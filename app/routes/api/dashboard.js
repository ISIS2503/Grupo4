var bodyParser = require('body-parser'); // get body-parser
var Alerta = require('../../models/Alerta');
var Reporte = require('../../models/Reporte');
var Micro = require('../../models/Micro');
var Medicion = require('../../models/Medicion');
var Sensor = require('../../models/Sensor');
var Ubicacion = require('../../models/Ubicacion');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;
var role;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	////////////////////////////////////////////////////////////////////////////////
	//  Middleware que verifica el token
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.use(function(req, res, next) {
		// var token = req.body.token || req.query.token || req.headers['x-access-token'];
		// // decode token
		// if (token) {
		// 	// verifies secret and checks exp
		// 	jwt.verify(token, superSecret, function(err, decoded) {
		// 		if (err) {
		// 			res.status(403).send({
		// 				success: false,
		// 				message: 'Failed to authenticate token.'
		// 			});
		// 		} else {
		// 			// if everything is good, save to request for use in other routes
		// 			req.decoded = decoded;
		// 			role = req.decoded.rol;
		next(); // make sure we go to the next routes and don't stop here
		// 		}
		// 	});
		// } else {
		// 	// if there is no token return an HTTP response of 403 (access forbidden) and an error message
		// 	res.status(403).send({
		// 		success: false,
		// 		message: 'No token provided.'
		// 	});
		// }
	});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de alertas (http://localhost:8080/dashboard/alertas)
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.route('/device')
		.post(function(req, res) {
			Medicion.find({ idSensor: req.body.device }, null, { sort: { fecha: 1 } }, function(err, medicion) {
				if (err) res.send(err);
				res.json(medicion);
			});
		});

	apiRouter.route('/alertas/tipo')
		.post(function(req, res) {
			Alerta.find({ tipoAlerta: req.body.tipo }, null, { sort: { fecha: -1 } }, function(err, alerta) {
				if (err) res.send(err);
				res.json(alerta);
			});
		});

	apiRouter.route('/alertas/fecha')
		.post(function(req, res) {
			Alerta.find({ fecha: req.body.fecha }, null, { sort: { fecha: -1 } }, function(err, alerta) {
				if (err) res.send(err);
				res.json(alerta);
			});
		});

	apiRouter.route('/alertas/device')
		.post(function(req, res) {
			Alerta.find({ dispositivoAlerta: req.body.device }, null, { sort: { fecha: -1 } }, function(err, alerta) {
				if (err) res.send(err);
				res.json(alerta);
			});
		});

	apiRouter.route('/alertas')

		.get(function(req, res) {
			Alerta.find({}, null, { sort: { fecha: -1 } }, function(err, alertas) {
				if (err) res.send(err);
				res.json(alertas);
			});
		});

	apiRouter.route('/alertas/:alerta_id')

		.get(function(req, res) {
			Alerta.findById(req.params.alerta_id, function(err, alerta) {
				if (err) res.send(err);
				res.json(alerta);
			});
		})

		.delete(function(req, res) {
			if (role == "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				Alerta.remove({
					_id: req.params.alerta_id
				}, function(err, alerta) {
					if (err) res.send(err);
					res.json({
						message: 'Alerta eliminada.'
					});
				});
			}
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de reportes (http://localhost:8080/dashboard/reportes)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/reportes/fecha')
		.post(function(req, res) {
			Reporte.find({ fecha: req.body.fecha }, null, { sort: { fecha: -1 } }, function(err, reportes) {
				if (err) res.send(err);
				res.json(reportes);
			});
		});

	apiRouter.route('/reportes')

		.post(function(req, res) {
			Ubicacion.aggregate({
				$lookup: {
					from: "micros",
					localField: "_id",
					foreignField: "ubicacion",
					as: "micros"
				}
			}, {
				$match: {
					area: req.body.area,
					nivel: req.body.nivel
				}
			}, {
				$unwind: "$micros"
			}, {
				$project: {
					_id: "$micros._id"
				}
			}, {
				$lookup: {
					from: "sensors",
					localField: "_id",
					foreignField: "idMicro",
					as: "sensores"
				}
			}, {
				$unwind: "$sensores"
			}, {
				$match: {
					"sensores.tipoSensor": req.body.tipoReporte
				}
			}, {
				$project: {
					idSensor: "$sensores.idSensor"
				}
			}, {
				$lookup: {
					from: "medicions",
					localField: "idSensor",
					foreignField: "idSensor",
					as: "datos"
				}
			}, {
				$unwind: "$datos"
			}, {
				$project: {
					idToma: "A",
					data: "$datos.valorMedida"
				}
			}, {
				$group: {
					_id: "$idToma",
					promedioTotal: {
						$avg: "$data"
					},
					minTotal: {
						$min: "$data"
					},
					devTotal: {
						$stdDevPop: "$data"
					},
					maxTotal: {
						$max: "$data"
					}
				}
			}, function(err, rpta) {
				if (err)
					res.send(err);
				else {
					var reporte = new Reporte();
					reporte.valorMin = rpta[0].minTotal;
					reporte.valorMax = rpta[0].maxTotal;
					reporte.valorMedio = rpta[0].promedioTotal;
					reporte.variacion = rpta[0].devTotal;
					reporte.tipoReporte = req.body.tipoReporte;
					reporte.area = req.body.area;
					reporte.nivel = req.body.nivel;
					reporte.fecha = new Date();

					reporte.save(function(err) {
						if (err) return res.send(err);
						res.json({
							message: '¡Reporte creado!'
						});
					});
				}
			});
		})

		.get(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				Reporte.find({}, null, { sort: { fecha: -1 } }, function(err, reportes) {
					if (err) res.send(err);
					res.json(reportes);
				});
			}
		});


	apiRouter.route('/reportes/:reporte_id')
		.get(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				Reporte.findById(req.params.reporte_id, function(err, reporte) {
					if (err) res.send(err);
					res.json(reporte);
				});
			}
		});

	// apiRouter.route('/reportes/:fecha')
	// 	.get(function(req, res) {
	// 		if (role != "Supervisor") {
	// 			return res.json({
	// 				success: false,
	// 				message: 'No estás autorizado.'
	// 			});
	// 		} else {
	// 			Reporte.findById(req.params.reporte_id, function(err, reporte) {
	// 				if (err) res.send(err);
	// 				res.json(reporte);
	// 			});
	// 		}
	// 	});

	return apiRouter;
};

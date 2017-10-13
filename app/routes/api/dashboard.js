var bodyParser = require('body-parser'); // get body-parser
var Alerta = require('../../models/Alerta');
var Reporte = require('../../models/Reporte');
var Micro = require('../../models/Micro');
var Sensor = require('../../models/Sensor');
var Ubicacion = require('../../models/Ubicacion');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

function fueraDeRango(idSensor) {

}

module.exports = function(app, express) {

	var apiRouter = express.Router();

	////////////////////////////////////////////////////////////////////////////////
	//  Middleware que verifica el token
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.use(function(req, res, next) {
		console.log(' ¡Han entrado a "/dashboard"! ');
		// var token = req.body.token || req.query.token || req.headers['x-access-token'];
		// // decode token
		// if (token) {
		//   // verifies secret and checks exp
		//   jwt.verify(token, superSecret, function(err, decoded) {
		//     if (err) {
		//       res.status(403).send({
		//         success: false,
		//         message: 'Failed to authenticate token.'
		//       });
		//     } else {
		//       // if everything is good, save to request for use in other routes
		//       req.decoded = decoded;
		next(); // make sure we go to the next routes and don't stop here
		//     }
		//   });
		// } else {
		//   // if there is no token return an HTTP response of 403 (access forbidden) and an error message
		//   res.status(403).send({
		//     success: false,
		//     message: 'No token provided.'
		//   });
		// }
	});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de alertas (http://localhost:8080/dashboard/alertas)
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.route('/alertas')

		.post(function(req, res) {
			var alerta = new Alerta();
			alerta.tipoAlerta = req.body.tipoAlerta;
			alerta.activa = true;
			alerta.fecha = new Date();
			alerta.save(function(err) {
				if (err) return res.send(err);
				res.json({
					message: '¡Alerta creada!'
				});
			});
		})

		.get(function(req, res) {
			Alerta.find({}, function(err, alertas) {
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
			Alerta.remove({
				_id: req.params.alerta_id
			}, function(err, alerta) {
				if (err) res.send(err);
				res.json({
					message: 'Alerta eliminada.'
				});
			});
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de reportes (http://localhost:8080/dashboard/reportes)
	////////////////////////////////////////////////////////////////////////////////

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
					area: "A",
					nivel: "1"
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
					"sensores.tipoSensor": "Temperatura"
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
			Reporte.find({}, function(err, reportes) {
				if (err) res.send(err);
				res.json(reportes);
			});
		});


	apiRouter.route('/reportes/:reporte_id')
		.get(function(req, res) {
			Reporte.findById(req.params.reporte_id, function(err, reporte) {
				if (err) res.send(err);
				res.json(reporte);
			});
		})

		.delete(function(req, res) {
			Reporte.remove({
				_id: req.params.reporte_id
			}, function(err, reporte) {
				if (err) res.send(err);
				res.json({
					message: 'Reporte eliminado.'
				});
			});
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de data (http://localhost:8080/dashboard/data)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/data')

		.post(function(req, res) {
			var data = new Medicion();
			data.idSensor = req.body.idSensor;
			data.fechaMedida = new Date();
			data.idSensor = req.body.valorMedida;
			data.save(function(err) {
				if (err) return res.json({
					success: false,
					message: err.message
				});
				res.json({
					message: '¡Dato guardado!'
				});
				fueraDeRango(req.body.idSensor);
			});
		})

		.get(function(req, res) {
			Ubicacion.find({}, function(err, datos) {
				if (err) res.send(err);
				res.json(datos);
			});
		});

	return apiRouter;
};

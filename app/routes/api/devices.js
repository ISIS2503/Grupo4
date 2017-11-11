var bodyParser = require('body-parser'); // get body-parser
var Ubicacion = require('../../models/Ubicacion');
var Micro = require('../../models/Micro');
var Sensor = require('../../models/Sensor');
var Actuador = require('../../models/Actuador');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	////////////////////////////////////////////////////////////////////////////////
	//  Middleware que verifica el token
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.use(function(req, res, next) {
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
	// Rutas para manejar el CRUD de sensores (http://localhost:8080/devices/sensores)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/sensores')

		.post(function(req, res) {
			var sensorM = new Sensor();
			Micro.findOne({
					idMicro: req.body.idMicro
				},
				function(err, micro) {
					if (err) res.send(err);
					if (micro != null) {
						sensorM.idMicro = micro._id;
						sensorM.idSensor = req.body.idSensor;
						sensorM.tipoSensor = req.body.tipoSensor;
						sensorM.save(function(err) {
							if (err) {
								if (err.code == 11000) return res.json({
									success: false,
									message: 'Ese sensor ya existe.'
								});
								else return res.json({
									success: false,
									message: err.message
								});
							} else {
								res.json({
									message: '¡Sensor creado!'
								});
							}
						});
					} else return res.json({
						success: false,
						message: 'No se ha encontrado el MicroControlador.'
					});
				});
		})

		.get(function(req, res) {
			Sensor.find({}, function(err, sensores) {
				if (err) res.send(err);
				res.json(sensores);
			});
		});


	apiRouter.route('/sensores/:sensor_id')

		.get(function(req, res) {
			Sensor.findById(req.params.sensor_id, function(err, sensor) {
				if (err) res.send(err);
				res.json(sensor);
			});
		})

		.put(function(req, res) {
			Sensor.findById(req.params.sensor_id, function(err, sensor) {
				if (err) res.send(err);
				if (req.body.idSensor) sensor.idSensor = req.body.idSensor;
				if (req.body.tipoSensor) sensor.tipoSensor = req.body.tipoSensor;
				if (req.body.idMicro) sensor.idMicro = req.body.idMicro;
				sensor.save(function(err) {
					if (err) res.send(err);
					res.json({
						message: '¡Sensor actualizado!'
					});
				});
			});
		})

		.delete(function(req, res) {
			Sensor.remove({
					_id: req.params.sensor_id
				},
				function(err, sensor) {
					if (err) res.send(err);
					res.json({
						message: 'Sensor eliminado.'
					});
				});
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de micros (http://localhost:8080/devices/micros)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/micros')

		.post(function(req, res) {
			var micro = new Micro();
			Ubicacion.findOne({
					area: req.body.area,
					nivel: req.body.nivel
				},
				function(err, ubi) {
					if (err) res.send(err);
					if (ubi != null) {
						micro.ubicacion = ubi._id;
						console.log(ubi);
						micro.idMicro = req.body.idMicro;
						micro.save(function(err) {
							if (err) {
								if (err.code == 11000) return res.json({
									success: false,
									message: 'Ese micro ya existe.'
								});
								else return res.json({
									success: false,
									message: err.message
								});
							} else {
								res.json({
									message: '¡Micro creado!'
								});
							}
						});
					} else return res.json({
						success: false,
						message: 'No se ha encontrado la ubicación.'
					});
				});
		})

		.get(function(req, res) {
			Micro.find({}, function(err, micros) {
				if (err) res.send(err);
				res.json(micros);
			});
		});

	apiRouter.route('/micros/:micro_id')

		.get(function(req, res) {
			Micro.findById(req.params.sensor_id, function(err, micro) {
				if (err) res.send(err);
				res.json(micro);
			});
		})

		.put(function(req, res) {
			Micro.findById(req.params.sensor_id, function(err, micro) {
				if (err) res.send(err);
				if (req.body.idMicro) micro.idMicro = req.body.idMicro;
				if (req.body.ubicacion) micro.ubicacion = req.body.ubicacion;
				micro.save(function(err) {
					if (err) res.send(err);
					res.json({
						message: '¡Micro actualizado!'
					});
				});
			});
		})

		.delete(function(req, res) {
			Micro.remove({
					_id: req.params.micro_id
				},
				function(err, micro) {
					if (err) res.send(err);
					res.json({
						message: 'Micro eliminado.'
					});
				});
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de actuadores (http://localhost:8080/devices/actuadores)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/actuadores')

		.post(function(req, res) {
			var actuador = new Actuador();
			Ubicacion.findOne({
					area: req.body.area,
					nivel: req.body.nivel
				},
				function(err, ubi) {
					if (err) res.send(err);
					if (ubi != null) {
						actuador.idActuador = req.body.idActuador;
						actuador.ubicacion = ubi._id;
						actuador.tiempoEnUso = 0;
						actuador.activo = false;
						actuador.save(function(err) {
							if (err) {
								if (err.code == 11000) return res.json({
									success: false,
									message: 'Ese actuador ya existe.'
								});
								else return res.json({
									success: false,
									message: err.message
								});
							} else {
								res.json({
									message: '¡Actuador creado!'
								});
							}
						});
					} else return res.json({
						success: false,
						message: 'No se ha encontrado dicha ubicación.'
					});
				});
		})

		.get(function(req, res) {
			Actuador.find({}, function(err, actuadores) {
				if (err) res.send(err);
				res.json(actuadores);
			});
		});

	apiRouter.route('/actuadores/:actuador_id')

		.get(function(req, res) {
			Actuador.findById(req.params.actuador_id, function(err, actuador) {
				if (err) res.send(err);
				res.json(actuador);
			});
		})

		.put(function(req, res) {
			Actuador.findById(req.params.actuador_id, function(err, actuador) {
				if (err) res.send(err);
				if (req.body.tiempoEnUso) actuador.tiempoEnUso = req.body.tiempoEnUso;
				if (req.body.activo) actuador.activo = req.body.activo;
				if (req.body.ubicacion) actuador.ubicacion = req.body.ubicacion;
				actuador.save(function(err) {
					if (err) res.send(err);
					res.json({
						message: '¡Actuador actualizado!'
					});
				});
			});
		})

		.delete(function(req, res) {
			Actuador.remove({
					_id: req.params.actuador_id
				},
				function(err, actuador) {
					if (err) res.send(err);
					res.json({
						message: 'Actuador eliminado.'
					});
				});
		});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de ubicaciones (http://localhost:8080/devices/ubicaciones)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/ubicaciones')

		.post(function(req, res) {
			var ubicacion = new Ubicacion();
			ubicacion.area = req.body.area;
			ubicacion.nivel = req.body.nivel;
			ubicacion.save(function(err) {
				if (err) {
					if (err.code == 11000) return res.json({
						success: false,
						message: 'Ya existe esa ubicación.'
					});
					else return res.json({
						success: false,
						message: err.message
					});
				}
				res.json({
					message: '¡Ubicación creada!'
				});
			});
		})

		.get(function(req, res) {
			Ubicacion.find({}, function(err, ubicaciones) {
				if (err) res.send(err);
				res.json(ubicaciones);
			});
		});

	apiRouter.route('/ubicaciones/:ubicacion_id')

		.get(function(req, res) {
			Ubicacion.findById(req.params.ubicacion_id, function(err, ubicacion) {
				if (err) res.send(err);
				res.json(ubicacion);
			});
		})

		.put(function(req, res) {
			Ubicacion.findById(req.params.ubicacion_id, function(err, ubicacion) {
				if (err) res.send(err);
				if (req.body.area) ubicacion.area = req.body.area;
				if (req.body.nivel) ubicacion.nivel = req.body.nivel;

				ubicacion.save(function(err) {
					if (err) res.send(err);
					res.json({
						message: '¡Ubicación actualizada!'
					});
				});
			});
		})

		.delete(function(req, res) {
			Ubicacion.remove({
				_id: req.params.ubicacion_id
			}, function(err, ubicacion) {
				if (err) res.send(err);
				res.json({
					message: 'Ubicación eliminada.'
				});
			});
		});

	apiRouter.route('/ubicacion/nivel/:nivel_id')
		.get(function(req, res) {
			Ubicacion.find({
				nivel: req.params.nivel_id
			}, function(err, ubicacion) {
				if (err) res.send(err);
				res.json(ubicacion);
			});
		});

	apiRouter.route('/ubicacion/area/:area_id')
		.get(function(req, res) {
			Ubicacion.find({
				area: req.params.area_id
			}, function(err, ubicacion) {
				if (err) res.send(err);
				res.json(ubicacion);
			});
		});

	return apiRouter;
};

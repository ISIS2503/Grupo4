var bodyParser = require('body-parser'); // get body-parser
var Medicion = require('../../models/Medicion');
var Alerta = require('../../models/Alerta');
var Actuador = require('../../models/Actuador');
var Micro = require('../../models/Micro');
var jwt = require('jsonwebtoken');
var config = require('../../../config');
var limits = require('../../../limits');
var superSecret = config.secret;

////////////////////////////////////////////////////////////////////////////////
//  Funciones a validar en el Middleware
////////////////////////////////////////////////////////////////////////////////

function fueraDeRango(idSens, data, res) {
	Medicion.aggregate({ $match: { idSensor: idSens } }, { $sort: { fechaMedida: -1 } }, { $limit: 9 }, {
		$group: {
			_id: "$idSensor",
			promedioTotal: { $avg: "$valorMedida" },
			count: { $sum: 1 }
		}
	}, function(err, rpta) {
		if (err) console.log(err);
		else {
			if (rpta[0].count == 9) {
				var num = (parseInt(data) + (rpta[0].promedioTotal) * 9) / 10;
				if (idSens.endsWith("T")) {
					var limiteInf = limits.minTemp;
					var limiteSup = limits.maxTemp;
				}
				if (idSens.endsWith("G")) {
					var limiteInf = limits.minGas;
					var limiteSup = limits.maxGas;
				}
				if (idSens.endsWith("N")) {
					var limiteInf = limits.minNoise;
					var limiteSup = limits.maxNoise;
				}
				if (idSens.endsWith("L")) {
					var limiteInf = limits.minLight;
					var limiteSup = limits.maxLight;
				}
				if (num < limiteInf || num > limiteSup) {
					console.log("Nueva alerta fuera rango.");
					crearAlertaFR(idSens);
					encenderActuadorZona(idSens, idSens.charAt(0));
				}
			}
		}
	});
}

function crearAlertaFR(idSensor) {
	var alerta = new Alerta();
	alerta.tipoAlerta = "Sensor fuera de rango";
	alerta.activa = true;
	alerta.fecha = new Date();
	alerta.dispositivoAlerta = idSensor;
	alerta.save();
}

function encenderActuadorZona(sensor, idMic) {
	Micro.aggregate({ $lookup: { from: "ubicacions", localField: "ubicacion", foreignField: "_id", as: "ubis" } }, { $match: { "idMicro": idMic } }, { $unwind: "$ubis" }, { $project: { idUbi: "$ubicacion" } }, { $lookup: { from: "actuadors", localField: "idUbi", foreignField: "ubicacion", as: "u" } }, { $unwind: "$u" }, { $project: { idActu: "$u._id" } },
		function(err, rpta) {
			if (err) console.log(err);
			else {
				Actuador.findById(rpta[0].idActu, function(err, datos) {
					if (err) console.log(err);
					datos.activo = true;
					datos.save();
				});
				setTimeout(verificarActuador, 3600000, sensor, rpta[0].idActu);
			}
		});
}

function verificarActuador(idSens, idActu) {
	Medicion.aggregate({ $match: { idSensor: idSens } }, { $sort: { fechaMedida: -1 } }, { $limit: 10 }, {
		$group: {
			_id: "$idSensor",
			promedioTotal: { $avg: "$valorMedida" }
		}
	}, function(err, rpta) {
		if (err) console.log(err);
		else {
			if (idSens.endsWith("T")) {
				var limiteInf = limits.minTemp;
				var limiteSup = limits.maxTemp;
			}
			if (idSens.endsWith("G")) {
				var limiteInf = limits.minGas;
				var limiteSup = limits.maxGas;
			}
			if (idSens.endsWith("N")) {
				var limiteInf = limits.minNoise;
				var limiteSup = limits.maxNoise;
			}
			if (idSens.endsWith("L")) {
				var limiteInf = limits.minLight;
				var limiteSup = limits.maxLight;
			}
			if ((rpta[0].promedioTotal) < limiteInf || (rpta[0].promedioTotal) > limiteSup) {
				crearAlertaActuador(idActu);
			} else {
				Actuador.findById(idActu, function(err, datos) {
					if (err) console.log(err);
					datos.activo = false;
					datos.save();
				});
			}
		}
	});
}

function crearAlertaActuador(idActuador) {
	var alerta = new Alerta();
	alerta.tipoAlerta = "Actuador inactivo";
	alerta.activa = true;
	alerta.fecha = new Date();
	alerta.dispositivoAlerta = idActuador;
	alerta.save();
	console.log("Nueva alerta actuador.");
}

function actualizarHB(idS) {
	Sensor.find({ idSensor: idS }, function(err, sensor) {
		if (err) console.log(err);
		if (sensor.heartBeat1 == null) heartBeat1 = new Date();
		else heartBeat1 = heartBeat2;
		heartBeat2 = new Date();
		if (idSens.endsWith("T")) {
			var maxHB = limits.hbTemp;
		}
		if (idSens.endsWith("G")) {
			var maxHB = limits.hbGas;
		}
		if (idSens.endsWith("N")) {
			var maxHB = limits.hbNoise;
		}
		if (idSens.endsWith("L")) {
			var maxHB = limits.hbLight;
		}
		if (heartBeat2 - heartBeat1 > maxHB) {
			crearAlertaFL(idSens);
		}
	});
}

function crearAlertaFL(idSensor) {
	var alerta = new Alerta();
	alerta.tipoAlerta = "Sensor fuera de línea.";
	alerta.activa = true;
	alerta.fecha = new Date();
	alerta.dispositivoAlerta = idSensor;
	alerta.save();
	console.log("Nueva alerta fuera de línea.");
}

module.exports = function(app, express) {

	var apiRouter = express.Router();

	////////////////////////////////////////////////////////////////////////////////
	//  Middleware
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.use(function(req, res, next) {
		console.log(' ¡Han entrado a "/data"! ');
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
		if (req.body.idSensor && req.body.valorMedida) {
			fueraDeRango(req.body.idSensor, req.body.valorMedida);
		}
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
	// Rutas para manejar el CRUD de data (http://localhost:8080/data)
	////////////////////////////////////////////////////////////////////////////////

	apiRouter.route('/')

		.post(function(req, res) {
			var data = new Medicion();
			data.idSensor = req.body.idSensor;
			data.fechaMedida = new Date();
			data.valorMedida = req.body.valorMedida;
			data.save(function(err) {
				if (err) return res.json({ success: false, message: err.message });
				actualizarHB(req.body.idSensor);
				res.json({ message: '¡Dato guardado!' });
			});
		})

		.get(function(req, res) {
			Medicion.find({}, function(err, datos) {
				if (err) res.send(err);
				res.json(datos);
			});
		});

	return apiRouter;
};

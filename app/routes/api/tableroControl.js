var bodyParser = require('body-parser'); 	// get body-parser
var Dash       = require('../../models/Dash');
var Alerta     = require('../../models/Alerta');
var Reporte    = require('../../models/Reporte');
var Micro       = require('../../models/Micro');
var Sensor       = require('../../models/Sensor');
var Ubicacion       = require('../../models/Ubicacion');
var jwt        = require('jsonwebtoken');
var config     = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log(' ¡Han entrado a "/dashboard"! ');
		//
		// // check header or url parameters or post parameters for token
		// var token = req.body.token || req.query.token || req.headers['x-access-token'];
		//
		// // decode token
		// if (token) {
		//
		//   // verifies secret and checks exp
		//   jwt.verify(token, superSecret, function(err, decoded) {
		//
		//     if (err) {
		//       res.status(403).send({
		//       	success: false,
		//       	message: 'Failed to authenticate token.'
		//   	});
		//     } else {
		//       // if everything is good, save to request for use in other routes
		//       req.decoded = decoded;
		//
		next(); // make sure we go to the next routes and don't stop here
		//     }
		//   });
		//
		// } else {
		//
		//   // if there is no token
		//   // return an HTTP response of 403 (access forbidden) and an error message
		// 	 	res.status(403).send({
		// 	 		success: false,
		// 	 		message: 'No token provided.'
		// 	 	});
		//
		// }
	});

	// on routes that end in /dashboard
	// ----------------------------------------------------
	apiRouter.route('/')

	// create a dash (accessed at POST http://localhost:8080/dashboard)
	.post(function(req, res) {

		var dash = new Dash();		// create a new instance of the Dash model

		dash.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
				return res.json({ success: false, message: 'Ese dashboard ya existe.'});
				else
				return res.send(err);
			}

			// return a message
			res.json({ message: '¡Dashboard creado!' });
		});

	})

	// get all the dashboard (accessed at GET http://localhost:8080/api/dashboard)
	.get(function(req, res) {

		Dash.find({}, function(err, dashboard) {
			if (err) res.send(err);

			// return the dashboard
			res.json(dashboard);
		});
	});

	// on routes that end in /dashboard/:dash_id
	// ----------------------------------------------------
	apiRouter.route('/:dash_id')

	// get the dash with that id
	.get(function(req, res) {
		Dash.findById(req.params.dash_id, function(err, dash) {
			if (err) res.send(err);

			// return that dash
			res.json(dash);
		});
	})

	// delete the dash with this id
	.delete(function(req, res) {
		Dash.remove({
			_id: req.params.dash_id
		}, function(err, dash) {
			if (err) res.send(err);

			res.json({ message: 'Successfully deleted.' });
		});
	});

	// on routes that end in /alertas
	// ----------------------------------------------------
	apiRouter.route('/alertas')

	// create a alerta (accessed at POST http://localhost:8080/alertas)
	.post(function(req, res) {

		var alerta = new Alerta();		// create a new instance of the Alerta model
		alerta.tipoAlerta = req.body.tipoAlerta;
		alerta.activa = req.body.activa;
		alerta.fecha = req.body.fecha;

		alerta.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
				return res.json({ success: false, message: 'Esa alerta ya existe.'});
				else
				return res.send(err);
			}

			// return a message
			res.json({ message: '¡Alerta creada!' });
		});

	})

	// get all the alertas (accessed at GET http://localhost:8080/api/alertas)
	.get(function(req, res) {

		Alerta.find({}, function(err, alertas) {
			if (err) res.send(err);

			// return the alertas
			res.json(alertas);
		});
	});

	// on routes that end in /alertas/:alerta_id
	// ----------------------------------------------------
	apiRouter.route('/alertas/:alerta_id')

	// get the alerta with that id
	.get(function(req, res) {
		Alerta.findById(req.params.alerta_id, function(err, alerta) {
			if (err) res.send(err);

			// return that alerta
			res.json(alerta);
		});
	})

	// update the alerta with this id
	.put(function(req, res) {
		Alerta.findById(req.params.alerta_id, function(err, alerta) {

			if (err) res.send(err);

			// set the new alerta information if it exists in the request
			if(req.body.tipoAlerta) alerta.tipoAlerta = req.body.tipoAlerta;
			if(req.body.activa) alerta.activa = req.body.activa;
			if(req.body.fecha) alerta.fecha = req.body.fecha;

			// save the alerta
			alerta.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({ message: '¡Alerta actualizada!' });
			});

		});
	})

	// delete the alerta with this id
	.delete(function(req, res) {
		Alerta.remove({
			_id: req.params.alerta_id
		}, function(err, alerta) {
			if (err) res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

	// on routes that end in /reportes
	// ----------------------------------------------------
	apiRouter.route('/reportes')

	// create a reporte (accessed at POST http://localhost:8080/reportes)
	.post(function(req, res) {
		Ubicacion.aggregate({$unwind: "$micros"},
		{$lookup: {from:"micros", localField: "micros", foreignField: "_id",as: "micros"}},
		{$match: {area: req.headers['area'], nivel: req.headers['nivel']}},
		{$project:{idMicro:"$micros.idMicro", sensores :"$micros.sensors"}},
		{$unwind: "$idMicro"},{$unwind: "$sensores"},
		{$lookup: {from: "sensors", localField: "sensores",foreignField: "_id",as: "sensores"}},
		{$unwind: "$sensores"},
		{$match: {"sensores.tipoSensor":req.headers['tipo-sensor']}},
		{$project: {idToma:"A",
		promDatos:{$avg: "$sensores.mediciones.valorMedida"},
		minDatos:{$min: "$sensores.mediciones.valorMedida"},
		maxDatos:{$max: "$sensores.mediciones.valorMedida"}}},
		{$group: {_id:"$idToma", promedioTotal: {$avg:"$promDatos"},
		minTotal: {$min:"$minDatos"},
		maxTotal: {$max:"$maxDatos"}}}, function(err, rpta)
		{
			if (err) res.send(err);
			else {
				var reporte = new Reporte();
				reporte.valorMin = rpta[0].minTotal;
				reporte.valorMax = rpta[0].maxTotal;
				reporte.valorMedio = rpta[0].promedioTotal;
				reporte.variacion = 0;
				reporte.fecha = new Date();  

				reporte.save(function(err) {
					if (err) {
						// duplicate entry
						if (err.code == 11000)
						return res.json({ success: false, message: 'Ese reporte ya existe'});
						else
						return res.send(err);
					}
					// return a message
					res.json({ message: '¡Reporte creado!' });
				});
			}
		});
	})

	// get all the reportes (accessed at GET http://localhost:8080/api/reportes)
	.get(function(req, res) {

		Reporte.find({}, function(err, reportes) {
			if (err) res.send(err);

			// return the reportes
			res.json(reportes);
		});
	});

	// on routes that end in /reportes/:reporte_id
	// ----------------------------------------------------
	apiRouter.route('/reportes/:reporte_id')

	// get the reporte with that id
	.get(function(req, res) {
		Reporte.findById(req.params.reporte_id, function(err, reporte) {
			if (err) res.send(err);

			// return that reporte
			res.json(reporte);
		});
	})

	// update the reporte with this id
	.put(function(req, res) {
		Reporte.findById(req.params.reporte_id, function(err, reporte) {

			if (err) res.send(err);

			// set the new reporte information if it exists in the request
			if(req.body.valorMin) reporte.valorMin = req.body.valorMin;
			if(req.body.valorMax) reporte.valorMax = req.body.valorMax;
			if(req.body.valorMedio) reporte.valorMedio = req.body.valorMedio;
			if(req.body.variacion) reporte.variacion = req.body.variacion;
			if(req.body.fecha) reporte.fecha = req.body.fecha;

			// save the reporte
			reporte.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({ message: '¡Reporte actualizado!' });
			});

		});
	})

	// delete the reporte with this id
	.delete(function(req, res) {
		Reporte.remove({
			_id: req.params.reporte_id
		}, function(err, reporte) {
			if (err) res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


	// Micro.aggregate(
	// 	{$unwind: "$sensors"},
	// 	{$lookup: {
	// 		from:"sensors",
	// 		localField: "sensors",
	// 		foreignField: "_id",
	// 		as: "sensor"
	// 	}},
	// 	{$match: {
	// 		"sensor.tipoSensor": "Noise sensor"
	// 	}},
	// 	{
	// 		$project:{
	// 			_id : 1,
	// 			idMicro : 1,
	// 			datos : "$sensor.mediciones"
	// 		}
	// 	}
	// )

	return apiRouter;
};

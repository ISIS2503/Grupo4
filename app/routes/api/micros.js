var bodyParser = require('body-parser'); 	// get body-parser
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
		console.log(' ¡Han entrado a "/micros"! ');
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

	// on routes that end in /micros
	// ----------------------------------------------------
	apiRouter.route('/')

	// create a micro (accessed at POST http://localhost:8080/micros)
	.post(function(req, res) {

		var micro = new Micro();		// create a new instance of the Micro model
		micro.idMicro = req.body.idMicro;
		micro.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
				return res.json({ success: false, message: 'Ese micro ya existe.'});
				else
				return res.json({ success: false, message: err.message});
			}
			else{
				Ubicacion.findOneAndUpdate(
					{area:req.body.area, nivel:req.body.nivel},
					{$addToSet : {"micros" : micro._id}},
					function(err) {
						if (err) return res.send(err);
						// return a message
						res.json({ message: '¡Micro creado!' });
					});
				}
			});
		})

		// get all the micros (accessed at GET http://localhost:8080/api/micros)
		.get(function(req, res) {

			Micro.find({}, function(err, micros) {
				if (err) res.send(err);
				// return the micros
				res.json(micros);
			});
		});

		apiRouter.route('/jaja')
		// Obtener todos los datos de una ubicación (area y nivel) para un tipo de sensor
		.get(function(req, res) {
			Ubicacion.aggregate({$unwind: "$micros"},
			{$lookup: {from:"micros", localField: "micros", foreignField: "_id",as: "micros"}},
			{$match: {area: "C", nivel:"1"}},
			{$project:{idMicro:"$micros.idMicro", sensores :"$micros.sensors"}},
			{$unwind: "$idMicro"},{$unwind: "$sensores"},
			{$lookup: {from: "sensors", localField: "sensores",foreignField: "_id",as: "sensores"}},
			{$unwind: "$sensores"},
			{$match: {"sensores.tipoSensor":"Noise sensor"}},
			{$project: {idToma:"A",
			promDatos:{$avg: "$sensores.mediciones.valorMedida"},
			minDatos:{$min: "$sensores.mediciones.valorMedida"},
			maxDatos:{$max: "$sensores.mediciones.valorMedida"}}},
			{$group: {_id:"$idToma", promedioTotal: {$avg:"$promDatos"},
			minTotal: {$min:"$minDatos"},
			maxTotal: {$max:"$maxDatos"}}}, function(err, rpta)
			{
				if (err) res.send(err);
				res.json(rpta);
				console.log(rpta[0].minTotal);
			});
		});

		// on routes that end in /micros/:micro_id
		// ----------------------------------------------------
		apiRouter.route('/:micro_id')

		// get the micro with that id
		.get(function(req, res) {
			Micro.findById(req.params.sensor_id, function(err, micro) {
				if (err) res.send(err);

				// return that micro
				res.json(micro);
			});
		})

		// update the micro with this id
		.put(function(req, res) {
			Micro.findById(req.params.sensor_id, function(err, micro) {

				if (err) res.send(err);
				if(req.body.idMicro) micro.idMicro = req.body.idMicro;
				// save the micro
				micro.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: '¡Micro actualizado!' });
				});

			});
		})

		// delete the micro with this id
		.delete(function(req, res) {
			Micro.remove({
				_id: req.params.micro_id
			}, function(err, micro) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted.' });
			});
		});

		return apiRouter;
	};

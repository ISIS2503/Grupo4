var bodyParser = require('body-parser'); 	// get body-parser
var Sensor       = require('../../models/Sensor');
var TempMin      = require('../../models/tempMin');
var NoiceMin     = require('../../models/noiceMin');
var CarbonMin    = require('../../models/carbonMin');
var jwt        = require('jsonwebtoken');
var config     = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		// console.log('Somebody just came to our app!');
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
	  //       next(); // make sure we go to the next routes and don't stop here
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

	// on routes that end in /sensores
	// ----------------------------------------------------
	apiRouter.route('/')

		// create a sensor (accessed at POST http://localhost:8080/sensores)
		.post(function(req, res) {

			var sensor = new Sensor();		// create a new instance of the Sensor model
			sensor.tipoSensor = req.body.sensor;
			// sensor.frecuencia = req.body.frecuencia;
			// sensor.valorMin = req.body.valorMin;
			// sensor.valorMax = req.body.valorMax;
			sensor.unidadMedida = req.body.unit;
			sensor.fechaMedida = req.body.protime;
			sensor.valorMedida = req.body.data;

			sensor.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'Ese sensor ya existe.'});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: '¡Sensor creado!' });
			});

		})

		// get all the sensores (accessed at GET http://localhost:8080/api/sensores)
		.get(function(req, res) {

			Sensor.find({}, function(err, sensores) {
				if (err) res.send(err);

				// return the sensores
				res.json(sensores);
			});
		});

	// on routes that end in /sensores/:sensor_id
	// ----------------------------------------------------
	apiRouter.route('/:sensor_id')

		// get the sensor with that id
		.get(function(req, res) {
			Sensor.findById(req.params.sensor_id, function(err, sensor) {
				if (err) res.send(err);

				// return that sensor
				res.json(sensor);
			});
		})

		// update the sensor with this id
		.put(function(req, res) {
			Sensor.findById(req.params.sensor_id, function(err, sensor) {

				if (err) res.send(err);

				// set the new sensor information if it exists in the request
				if(req.body.tipoSensor) sensor.tipoSensor = req.body.tipoSensor;
				if(req.body.frecuencia) sensor.frecuencia = req.body.frecuencia;
				if(req.body.valorMin) sensor.valorMin = req.body.valorMin;
				if(req.body.valorMax) sensor.valorMax = req.body.valorMax;
				if(req.body.unidadMedida) sensor.unidadMedida = req.body.unidadMedida;
				if(req.body.fechaMedida) sensor.fechaMedida = req.body.fechaMedida;
				if(req.body.valorMedida) sensor.valorMedida = req.body.valorMedida;

				// save the sensor
				sensor.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: '¡Sensor actualizado!' });
				});

			});
		})

		// delete the sensor with this id
		.delete(function(req, res) {
			Sensor.remove({
				_id: req.params.sensor_id
			}, function(err, sensor) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	return apiRouter;
};

var bodyParser = require('body-parser'); 	// get body-parser
var Actuador       = require('../../models/Actuador');
var jwt        = require('jsonwebtoken');
var config     = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {

	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
	    	});
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;

	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({
   	 		success: false,
   	 		message: 'No token provided.'
   	 	});

	  }
	});

	// on routes that end in /actuadores
	// ----------------------------------------------------
	apiRouter.route('/')

		// create a actuador (accessed at POST http://localhost:8080/actuadores)
		.post(function(req, res) {

			var actuador = new Actuador();		// create a new instance of the Actuador model
			actuador.tiempoEnUso = req.body.tiempoEnUso;

			actuador.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'Ese actuador ya existe.'});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: '¡Actuador creado!' });
			});

		})

		// get all the actuadores (accessed at GET http://localhost:8080/api/actuadores)
		.get(function(req, res) {

			Actuador.find({}, function(err, actuadores) {
				if (err) res.send(err);

				// return the actuadores
				res.json(actuadores);
			});
		});

	// on routes that end in /actuadores/:actuador_id
	// ----------------------------------------------------
	apiRouter.route('/:actuador_id')

		// get the actuador with that id
		.get(function(req, res) {
			Actuador.findById(req.params.actuador_id, function(err, actuador) {
				if (err) res.send(err);

				// return that actuador
				res.json(actuador);
			});
		})

		// update the actuador with this id
		.put(function(req, res) {
			Actuador.findById(req.params.actuador_id, function(err, actuador) {

				if (err) res.send(err);

				// set the new actuador information if it exists in the request
				if(req.body.tiempoEnUso) actuador.tiempoEnUso = req.body.tiempoEnUso;

				// save the actuador
				actuador.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: '¡Actuador actualizado!' });
				});

			});
		})

		// delete the actuador with this id
		.delete(function(req, res) {
			Actuador.remove({
				_id: req.params.actuador_id
			}, function(err, actuador) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted.' });
			});
		});

	return apiRouter;
};

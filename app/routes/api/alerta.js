var bodyParser = require('body-parser'); 	// get body-parser
var Alerta       = require('../../models/Alerta');
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

	// on routes that end in /alertas
	// ----------------------------------------------------
	apiRouter.route('/')

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
	apiRouter.route('/:alerta_id')

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

return apiRouter;
};

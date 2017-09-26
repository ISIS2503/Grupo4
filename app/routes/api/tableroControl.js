var bodyParser = require('body-parser'); 	// get body-parser
var Dash       = require('../../models/Dash');
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

	return apiRouter;
};

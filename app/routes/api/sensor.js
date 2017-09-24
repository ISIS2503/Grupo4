var bodyParser = require('body-parser'); 	// get body-parser
var IlumMin       = require('../../models/ilumMin');
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

	// ---------------------------- DATA GETTERS ---------------------------------- //
 apiRouter.route('/data/TempMin')
	 // get all the tempMin data (accessed at GET http://localhost:8080/api/data/TempMin)
	.get(function(req, res) {
	 TempMin.find(function(err, temperatureMin) {
	 if (err)
		 res.send(err);
	 // return the users
	 res.json(temperatureMin);
	 });
	});

	apiRouter.route('/data/NoiceMin')
	// get all the noiceMin data (accessed at GET http://localhost:8080/api/data/NoiceMin)
	.get(function(req, res) {
	 NoiceMin.find(function(err, noiceMin) {
	 if (err)
		 res.send(err);
	 // return the users
	 res.json(noiceMin);
	 });
	});

	apiRouter.route('/data/IlumMin')
	// get all the ilumMin data (accessed at GET http://localhost:8080/api/data/IlumMin)
	.get(function(req, res) {
	 IlumMin.find(function(err, iluminationMin) {
	 if (err)
		 res.send(err);
	 // return the users
	 res.json(iluminationMin);
	 });
	});

	apiRouter.route('/data/CarbonMin')
	// get all the carbonMin data (accessed at GET http://localhost:8080/api/data/CarbonMin)
	.get(function(req, res) {
	 CarbonMin.find(function(err, carbonMin) {
	 if (err)
		 res.send(err);
	 // return the users
	 res.json(carbonMin);
	 });
	});

	return apiRouter;
};

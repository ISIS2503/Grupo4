var bodyParser = require('body-parser'); 	// get body-parser
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
		console.log('Somebody just came to our app!');
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

	// on routes that end in /ubicaciones
	// ----------------------------------------------------
	apiRouter.route('/')

	// create a ubicacion (accessed at POST http://localhost:8080/ubicaciones)
	.post(function(req, res) {

		var ubicacion = new Ubicacion();		// create a new instance of the Ubicacion model
		ubicacion.area = req.body.area;  // (comes from the request)
		ubicacion.nivel = req.body.nivel;  // (comes from the request)

		ubicacion.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
				return res.json({ success: false, message: 'Ya existe esa ubicación.'});
				else
				return res.send(err);
			}
			// return a message
			res.json({ message: 'Ubicación creada!' });
		});

	})

	// get all the ubicaciones (accessed at GET http://localhost:8080/api/ubicaciones)
	.get(function(req, res) {
		Ubicacion.find({}, function(err, ubicaciones) {
			if (err) res.send(err);
			// return the ubicaciones
			res.json(ubicaciones);
		});
	});

	// on routes that end in /ubicaciones/:ubicacion_id
	// ----------------------------------------------------
	apiRouter.route('/:ubicacion_id')

	// get the ubicacion with that id
	.get(function(req, res) {
		Ubicacion.findById(req.params.ubicacion_id, function(err, ubicacion) {
			if (err) res.send(err);
			// return that ubicacion
			res.json(ubicacion);
		});
	})

	// update the ubicacion with this id
	.put(function(req, res) {
		Ubicacion.findById(req.params.ubicacion_id, function(err, ubicacion) {

			if (err) res.send(err);
			// set the new ubicacion information if it exists in the request
			if (req.body.area) ubicacion.area = req.body.area;
			if (req.body.nivel) ubicacion.nivel = req.body.nivel;

			// save the ubicacion
			ubicacion.save(function(err) {
				if (err) res.send(err);
				// return a message
				res.json({ message: 'Ubicación actualizada!' });
			});
		});
	})

	// delete the ubicacion with this id
	.delete(function(req, res) {
		Ubicacion.remove({
			_id: req.params.ubicacion_id
		}, function(err, ubicacion) {
			if (err) res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	});

	apiRouter.route('/ubicacion/nivel/:nivel_id')
	.get(function(req, res) {
		Ubicacion.find({nivel:req.params.nivel_id}, function(err, ubicacion) {
			if (err) res.send(err);
			res.json(ubicacion);
		});
	});

	apiRouter.route('/ubicacion/area/:area_id')
	.get(function(req, res) {
		Ubicacion.find({area:req.params.area_id}, function(err, ubicacion) {
			if (err) res.send(err);
			res.json(ubicacion);
		});
	});

	apiRouter.route('/ubicacion/nivel/:nivel_id/area/:area_id')
	.get(function(req, res) {
		Ubicacion.find({nivel:req.params.nivel_id, area:req.params.area_id}, function(err, ubicacion) {
			if (err) res.send(err);
			res.json(ubicacion);
		});
	});

	return apiRouter;
};

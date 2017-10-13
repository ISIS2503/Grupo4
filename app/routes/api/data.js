var bodyParser = require('body-parser'); // get body-parser
var Medicion = require('../../models/Medicion');
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
				res.json({ message: '¡Dato guardado!' });
			});
		})

		.get(function(req, res) {
			Ubicacion.find({}, function(err, datos) {
				if (err) res.send(err);
				res.json(datos);
			});
		});

	return apiRouter;
};

var bodyParser = require('body-parser'); // get body-parser
var User = require('../../models/User');
var jwt = require('jsonwebtoken');
var config = require('../../../config');

// super secret for creating tokens
var superSecret = config.secret;
var role;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/users/authenticate)
	// usuario: ad.laiton10
	// clave: superclave
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
			username: req.body.username
		}).select('name username rol email password').exec(function(err, user) {

			if (err) throw err;
			if (!user) {
				res.json({
					success: false,
					message: 'Usuario no válido. Vuelve a intentar.'
				});
			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Contraseña incorrecta. Vuelve a intentar.'
					});
				} else {
					var token = jwt.sign({
						id: user._id,
						rol: user.rol,
						email: user.email,
						name: user.name,
						username: user.username
					}, superSecret, {
						expiresIn: '24h' // expires in 24 hours
					});

					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			}
		});
	});

	////////////////////////////////////////////////////////////////////////////////
	//  Middleware que verifica el token
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.use(function(req, res, next) {
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
					role = req.decoded.rol;
					next(); // make sure we go to the next routes and don't stop here
				}
			});
		} else {
			// if there is no token return an HTTP response of 403 (access forbidden) and an error message
			res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	});

	////////////////////////////////////////////////////////////////////////////////
	// Rutas para manejar el CRUD de usuarios (http://localhost:8080/devices/users)
	////////////////////////////////////////////////////////////////////////////////
	apiRouter.route('/')

		.post(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				var user = new User();
				user.name = req.body.name;
				user.username = req.body.username;
				user.password = req.body.password;
				user.rol = req.body.rol;
				user.email = req.body.email;

				user.save(function(err) {
					if (err) {
						if (err.code == 11000) return res.json({
							success: false,
							message: 'Ya existe un usuario con ese username o email. '
						});
						else return res.send(err);
					}
					res.json({
						message: '¡Usuario creado!'
					});
				});
			}
		})

		.get(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				User.find({}, function(err, users) {
					if (err) res.send(err);
					res.json(users);
				});
			}
		});

	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	apiRouter.route('/:user_id')

		.get(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				User.findById(req.params.user_id, function(err, user) {
					if (err) res.send(err);
					res.json(user);
				});
			}
		})

		.put(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				User.findById(req.params.user_id, function(err, user) {
					if (err) res.send(err);
					if (req.body.name) user.name = req.body.name;
					if (req.body.username) user.username = req.body.username;
					if (req.body.rol) user.password = req.body.rol;
					if (req.body.email) user.email = req.body.email;

					user.save(function(err) {
						if (err) res.send(err);
						res.json({
							message: '¡Usuario actualizado!'
						});
					});
				});
			}
		})

		.delete(function(req, res) {
			if (role != "Supervisor") {
				return res.json({
					success: false,
					message: 'No estás autorizado.'
				});
			} else {
				User.remove({
					_id: req.params.user_id
				}, function(err, user) {
					if (err) res.send(err);
					res.json({
						message: 'Usuario eliminado.'
					});
				});
			}
		});

	return apiRouter;
};

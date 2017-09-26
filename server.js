// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path 	   = require('path');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutesUser = require('./app/routes/api/usuario')(app, express);
app.use('/users', apiRoutesUser);

var apiRoutesActuador = require('./app/routes/api/actuadores')(app, express);
app.use('/actuadores', apiRoutesActuador);

var apiRoutesUbicacion = require('./app/routes/api/ubicacion')(app, express);
app.use('/ubicaciones', apiRoutesUbicacion);

var apiRoutesSensor = require('./app/routes/api/sensor')(app, express);
app.use('/sensores', apiRoutesSensor);

var apiRoutesMicros = require('./app/routes/api/micros')(app, express);
app.use('/micros', apiRoutesSensor);

var apiRoutesDash = require('./app/routes/api/tableroControl')(app, express);
app.use('/dashboard', apiRoutesDash);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);

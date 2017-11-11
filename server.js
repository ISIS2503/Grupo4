// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');
var forceSsl = require('express-force-ssl');

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

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

var options = {  
	key: fs.readFileSync(config.pkey),
	cert: fs.readFileSync(config.certi)
};

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

app.use(forceSsl);

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutesUser = require('./app/routes/api/users')(app, express);
app.use('/users', apiRoutesUser);

var apiRoutesDevices = require('./app/routes/api/devices')(app, express);
app.use('/devices', apiRoutesDevices);

var apiRoutesDash = require('./app/routes/api/dashboard')(app, express);
app.use('/dashboard', apiRoutesDash);

var apiRoutesData = require('./app/routes/api/data')(app, express);
app.use('/data', apiRoutesData);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.use(function(req, res, next) {
	if (req.secure) {
		next();
	} else {
		res.redirect('https://' + req.headers.host + req.url);
	}
});

// START THE SERVER
// ====================================
http.createServer(app).listen(config.httpPort);
https.createServer(options, app).listen(config.httpsPort);

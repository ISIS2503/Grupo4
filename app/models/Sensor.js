var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var SensorSchema   = new Schema({
	tiempoEnUso: { type: String, required: true}
});

module.exports = mongoose.model('Sensor', SensorSchema);

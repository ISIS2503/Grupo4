var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var SensorSchema   = new Schema({
	unidadMedida: { type: String, required: true},
	variacion: { type: String, required: true},
	frecuencia: { type: String, required: true},
	valorMin: { type: String, required: true},
	valorMax: { type: String, required: true},
	tipoSensor: { type: String, required: true}
});

module.exports = mongoose.model('Sensor', SensorSchema);

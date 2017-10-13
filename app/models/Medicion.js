var mongoose = require('mongoose');
var Sensor = require('./Sensor');
var Schema = mongoose.Schema;

var MedicionSchema = new Schema({
	idSensor: { type: String, ref: 'Sensor' },
	fechaMedida: { type: Date, required: true },
	valorMedida: { type: Number, required: true }
});

module.exports = mongoose.model('Medicion', MedicionSchema);

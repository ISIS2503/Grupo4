var mongoose = require('mongoose');
var Micro = require('./Micro');
var Schema = mongoose.Schema;

var SensorSchema = new Schema({
	idSensor: { type: String, required: true, index: { unique: true } }, //Id del sensor (#Micro-Tipo)
	tipoSensor: { type: String, required: true }, //Tipo de Sensor (Constante)
	idMicro: { type: Schema.Types.ObjectId, ref: 'Micro', required: true },
	heartBeat1: Date,
	heartBeat2: Date
});

module.exports = mongoose.model('Sensor', SensorSchema);

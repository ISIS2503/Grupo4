// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
 var SensorSchema = new Schema({
 tipoSensor: { type: String, required: true}, //Tipo de Sensor (Constante)
 unidadMedida: { type: String, required: true}, //Unidad de medida del sensor (Constante)
 fechaMedida: { type: String, required: true}, //Unidad de medida del sensor
 valorMedida: { type: String, required: true} //Unidad de medida del sensor
 });

 // return the model
 module.exports = mongoose.model('SensorMin', SensorSchema);

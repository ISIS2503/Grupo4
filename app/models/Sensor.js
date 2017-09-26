// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
 var SensorSchema = new Schema({
 tipoSensor: String, //Tipo de Sensor (Constante)
 // frecuencia: String, //Frecuencia de Muestreo (Constante)
 // valorMin: String, //Valor Mínimo Rango (Constante)
 // valorMax: String, //Valor Máximo Rango (Constante)
 unidadMedida: String, //Unidad de medida del sensor (Constante)
 fechaMedida: String, //Unidad de medida del sensor
 valorMedida: String //Unidad de medida del sensor
 });

 // return the model
 module.exports = mongoose.model('SensorMin', SensorSchema);

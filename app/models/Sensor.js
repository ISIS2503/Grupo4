// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
var SensorSchema = new Schema({
  idSensor: { type: String, required: true, index: { unique: true }}, //Id del sensor (#Micro-Tipo)
  tipoSensor: { type: String, required: true}, //Tipo de Sensor (Constante)
  medidaSeg: { type: Number}, //Tipo de Sensor (Constante)
  cantMedidas: { type: Number}, //Tipo de Sensor (Constante)
  mediciones:[{
    fechaMedida: String, //Unidad de medida del sensor
    valorMedida: Number //Unidad de medida del sensor
  }]
});

// return the model
module.exports = mongoose.model('Sensor', SensorSchema);

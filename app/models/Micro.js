// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Sensor = require('./Sensor');
var Ubicacion = require('./Ubicacion');
var Schema = mongoose.Schema;

// user schema
var MicroControladorSchema = new Schema({
  idMicro: { type: String, required: true}, //Id del MicroControlador (1-2500)
  sensor: [{ type: Schema.Types.ObjectId, required: true, ref: 'Sensor' }], 
  ubicacion: [{ type: Schema.Types.ObjectId, required: true, ref: 'Ubicacion' }]
});

// return the model
module.exports = mongoose.model('MicroControlador', MicroControladorSchema);

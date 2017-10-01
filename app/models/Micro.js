// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Sensor = require('./Sensor');
var Schema = mongoose.Schema;

// user schema
var MicroControladorSchema = new Schema({
  idMicro: { type: String, required: true, index: { unique: true }}, //Id del MicroControlador (1-2500)
  sensors: [{ type: Schema.Types.ObjectId, index: { unique: true }, ref: 'Sensor' }]
});

// return the model
module.exports = mongoose.model('Micro', MicroControladorSchema);

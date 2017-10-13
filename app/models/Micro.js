var mongoose = require('mongoose');
var Ubicacion = require('./Ubicacion');
var Schema = mongoose.Schema;

var MicroControladorSchema = new Schema({
  idMicro: { type: String, required: true, index: { unique: true }}, //Id del MicroControlador (1-2500)
  ubicacion: { type: Schema.Types.ObjectId, ref: 'Ubicacion', required: true }
});

module.exports = mongoose.model('Micro', MicroControladorSchema);

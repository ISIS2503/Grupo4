var mongoose     = require('mongoose');
var Ubicacion 	 = require('./Ubicacion');
var Schema       = mongoose.Schema;

var ActuadorSchema   = new Schema({
	tiempoEnUso: { type: Number, required: true},
	activo: { type: Boolean, required: true},
	ubicacion: { type: Schema.Types.ObjectId, ref: 'Ubicacion', required: true }
});

module.exports = mongoose.model('Actuador', ActuadorSchema);

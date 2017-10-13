var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AlertaSchema   = new Schema({
	tipoAlerta: { type: String, required: true},
	activa: { type: Boolean, required: true},
	fecha: { type: Date, required: true}
});

module.exports = mongoose.model('Alerta', AlertaSchema);

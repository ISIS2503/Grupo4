var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var AlertaSchema   = new Schema({
	tipoAlerta: { type: String, required: true},
	activa: { type: Boolean, required: true},
	fecha: { type: String, required: true}
});

module.exports = mongoose.model('Alerta', AlertaSchema);

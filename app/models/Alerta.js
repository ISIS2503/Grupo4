var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var AlertaSchema   = new Schema({
	tiempoEnUso: { type: String, required: true}
});

module.exports = mongoose.model('Alerta', AlertaSchema);

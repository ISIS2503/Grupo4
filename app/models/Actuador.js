var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var ActuadorSchema   = new Schema({
	tiempoEnUso: { type: String, required: true}
});

module.exports = mongoose.model('Actuador', ActuadorSchema);
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Micro				 = require('./Micro');
var Actuador		 = require('./Actuador');
var bcrypt 			 = require('bcrypt-nodejs');

// user schema
var UbicacionSchema   = new Schema({
	area: { type: String, required: true},
	nivel: { type: String, required: true},
	micros: [{ type: Schema.Types.ObjectId, ref: 'Micro' }],
	actuadores: [{ type: Schema.Types.ObjectId, ref: 'Actuador' }]
});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);

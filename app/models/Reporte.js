var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var ReporteSchema   = new Schema({
	valorMin: { type: Number, required: true},
	valorMax: { type: Number, required: true},
	valorMedio: { type: Number, required: true},
	variacion: { type: Number, required: true},
	fecha: { type: String, required: true}
});

module.exports = mongoose.model('Reporte', ReporteSchema);

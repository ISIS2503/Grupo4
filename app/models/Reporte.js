var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var ReporteSchema   = new Schema({
	valorMin: { type: String, required: true},
	valorMax: { type: String, required: true},
	valorMedio: { type: String, required: true},
	variacion: { type: String, required: true},
	fecha: { type: String, required: true}
});

module.exports = mongoose.model('Reporte', ReporteSchema);

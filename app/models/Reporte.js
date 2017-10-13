var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReporteSchema   = new Schema({
	valorMin: { type: Number, required: true},
	valorMax: { type: Number, required: true},
	valorMedio: { type: Number, required: true},
	variacion: { type: Number, required: true},
	tipoReporte: { type: String, required: true},
	area: { type: String, required: true},
	nivel: { type: String, required: true},
	fecha: { type: Date, required: true}
});

module.exports = mongoose.model('Reporte', ReporteSchema);

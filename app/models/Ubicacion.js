var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UbicacionSchema   = new Schema({
	area: { type: String, required: true},
	nivel: { type: String, required: true}
});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var MicroSchema   = new Schema({

});

module.exports = mongoose.model('Micro', MicroSchema);

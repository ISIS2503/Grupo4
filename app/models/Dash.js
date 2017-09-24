var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema
var DashSchema   = new Schema({
});

module.exports = mongoose.model('Dash', DashSchema);

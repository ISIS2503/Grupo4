// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
 var CarbonMinSchema = new Schema({
 _id: String,
 payload:{
 	protime: String,
 	sensetime:String,
 	carbonDioxide:{
 		data: String,
 		unit: String,
 		place: String,
 	}
 },
 topic: String,
 _msgid: String
 });

  // return the model
 module.exports = mongoose.model('CarbonMin', CarbonMinSchema);

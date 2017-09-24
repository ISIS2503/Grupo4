// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user schema
 var TempMinSchema = new Schema({
 _id: String,
 payload:{
 	protime: String,
 	sensetime:String,
 	temperature:{
 		data: String,
 		unit: String,
 		place: String,
 	}
 },
 topic: String,
 _msgid: String
 });

 
 // return the model
 module.exports = mongoose.model('TempMin', TempMinSchema);

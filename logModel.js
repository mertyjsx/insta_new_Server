const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logSchema = new Schema({
 
  active : Boolean,
  _id:String,
  time : Date,
  proxy:String
});

const Log = mongoose.model("log", logSchema);

module.exports = Log;
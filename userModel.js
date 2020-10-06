const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  followed: Boolean,
  account:String,
  log:String,
  
  time:Date

});

const User = mongoose.model("user", userSchema);

module.exports = User;

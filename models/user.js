const mongoose = require('mongoose');
const { INTEGER } = require('sequelize');
const Schema = mongoose.Schema


const userSchema = new Schema({
  name : {
    type : String,
    required : true,
  },
email : {
  type : String,
  required : true,

},
password : {
  type : String,
  required : true,
},
isPremiumuser :{
  type : Boolean,
  required : true,
},
totalExpenses  : {
  type : Number,
  required : true,
}

})
module.exports = mongoose.model("User" , userSchema);
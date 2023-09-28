const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

//id, name , password, phone number, role
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const forgotePassSchema = new Schema ({
     id : {
        type : String,
        required : true,
     },
    active : {
        type : Boolean,
        required : true,
    },
    expiresby : {
        type : Date,
        required : true,
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User",
    }
})

module.exports  = mongoose.model("ForgotePass" , forgotePassSchema);
const { type } = require('express/lib/response');
const mongoose  =  require('mongoose');
const { stringify } = require('uuid');

const Schema  =  mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
   status:{
        type:String,
        default:'I am New here'
    },
    posts:[
      {
        type : Schema.Types.ObjectId,
        ref:'Post'
      }
    ]

});

module.exports = mongoose.model('User',UserSchema);
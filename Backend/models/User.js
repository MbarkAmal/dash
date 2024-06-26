const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    photo_user: {
      data: Buffer,
      contentType: String ,   
     },
     createdAt : {
      type : Date,
      default :Date.now
  },
  
  },


);

module.exports = mongoose.model('users', UserSchema);
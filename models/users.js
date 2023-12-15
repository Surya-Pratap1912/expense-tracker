const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email :{
    type: String,
    required: true
  },
  userName :{
    type: String,
    required: true
  },
  password :{
    type: String,
    required: true
  },
  loggedIn :{
    type: Boolean,
    required: true
  },
  totalExpanse :{
    type: Number,
    required: true
  },
  isPremium :{
    type: Boolean,
    required: true
  },

})


module.exports = mongoose.model('Users',userSchema);

const mongoose = require('mongoose');
// const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: [true, 'Please tell us your name.']
  },
  email: {
    type: String,
    require: [true, 'Please provide your email.'],
    unique: ['Please use another email.'],
    lowercase: true,
    trim: true,
    // validate: [validator.isEmail, 'Please provide a valid email.']
  },
  username: {
    type: String,
    trim: true,
    require: [true, 'Please tell us your username.']
  },
  password: {
    type: String,
    require: [true, 'Please provide a password.']
  },
  role: {
    type: String,
    default: 'user'
  },
  address: {
    type: String,
    default: ''
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;

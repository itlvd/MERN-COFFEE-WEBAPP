const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: 'processing'
  },
  address: {
    type: String,
    // required: [true, 'Please provide your address!'],
    default: ''
  },
  phone: {
    type: String,
    // required: [true, 'Please provide your phone to contact!'],
    default: ''
  },
  products: [],
  total: {
    type: Number
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;

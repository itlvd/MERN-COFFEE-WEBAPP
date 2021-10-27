const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  slug: {
    type: String
  },
  desc: {
    type: String,
    trim: true,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;

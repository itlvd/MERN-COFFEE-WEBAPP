const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

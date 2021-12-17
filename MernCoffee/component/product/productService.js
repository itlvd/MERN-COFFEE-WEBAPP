const Product = require('../../models/productModel');

exports.findAll = async() => {
  return await Product.find();
}

exports.findProduct = async(obj) => {
  return await Product.findOne(obj);
}

exports.findByCategory = async(category) => {
  return await Product.find({ category: category })
}

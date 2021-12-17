const Category = require('../../models/categoryModel');

exports.findAll = async () => {
  const categories = await Category.find();
  return categories;
}


exports.findCategory = async (category) => {
  return await Category.findOne({ slug: category });
}

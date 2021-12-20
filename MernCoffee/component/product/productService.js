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


exports.findProductWithSlug = async (slug) => {
  const pro = await Product.findOne({slug: slug});
  return pro;
}

exports.findProductWithId = async (id) => {
  const pro = await Product.findById({_id: id});
  return pro;
}

exports.createNewProduct = async (pro) => {
  const product = await new Product(pro);
  
  await product.save();
  return product
}

exports.updateImage = async (newLink, id) => {
  const product = await Product.findOne({
      _id: id
  });
  if (product) {
      product.image = newLink;
      await product.save();
  }
}

exports.updateProduct = async (id, fields) => {
    await Product.findByIdAndUpdate(id, fields);

}
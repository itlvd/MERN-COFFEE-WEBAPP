const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const commentService = require('../component/comment/commentService');
var fs = require('fs-extra');

exports.getAllProducts = async function (req, res) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit * 1 || 16;
  // const skip = (page - 1) * limit;
  // const totalPage = Math.ceil((await Product.count()) / limit);

  // const products = await Product.find().skip(skip).limit(limit);
  const categories = await Category.find();
  const products = await Product.find();

  res.render('all_products', {
    title: 'All products',
    products: products,
    categories: categories,
    user: req.user,
    // page,
    // limit,
    // totalPage
  });
}

exports.getCategory = function (req, res) {
  var categorySlug = req.params.category;

  Category.findOne({ slug: categorySlug }, function (err, c) {
    Product.find({ category: categorySlug }, function (err, products) {
      if (err)
        console.log(err);

      res.render('cat_products', {
        title: c.title,
        products: products,
        user: req.user
      });
    });
  });
}

exports.getProduct = function (req, res) {
  var galleryImages = null;
  const loggedIn = true;
  // const loggedIn = (req.isAuthenticated()) ? true : false;

  Product.findOne({ slug: req.params.product }, async function (err, product) {
    if (err) {
      console.log(err);
    } else {
      var galleryDir = 'public/product_images/' + product._id + '/gallery';
      const comments = await commentService.getAllCommentOfProduct(product._id);

      fs.readdir(galleryDir, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          galleryImages = files;
          // const comments = await Comment.find({productName: product.title});
          console.log("\n\ncomments: \n" + JSON.stringify(comments))
          res.render('product', {
            title: product.title,
            p: product,
            galleryImages: galleryImages,
            loggedIn: loggedIn,
            user: req.user,
            commentss: comments,
          });
        }
      });
    }
  });
}

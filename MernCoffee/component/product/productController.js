const commentService = require('../comment/commentService');
var fs = require('fs-extra');

const productService = require('./productService');
const categoryService = require('../category/categoryService');

exports.getAllProducts = async function (req, res) {
  // const page = req.query.page || 1;
  // const limit = req.query.limit * 1 || 16;
  // const skip = (page - 1) * limit;
  // const totalPage = Math.ceil((await Product.count()) / limit);
  // const products = await Product.find().skip(skip).limit(limit);

  const categories = await categoryService.findAll();
  const products = await productService.findAll();

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

exports.getCategory = async function (req, res) {
  var categorySlug = req.params.category;
  const category = await categoryService.findCategory(categorySlug);
  const products = await productService.findByCategory(categorySlug);

  res.render('cat_products', {
    title: category.title,
    products: products,
    user: req.user
  });
}

exports.getProduct = async function (req, res) {
  var galleryImages = null;
  const loggedIn = true;
  const product = await productService.findProduct({ slug: req.params.product });
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
  })
}

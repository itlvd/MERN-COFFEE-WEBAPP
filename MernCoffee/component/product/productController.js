const commentService = require('../comment/commentService');
var fs = require('fs-extra');

const productService = require('./productService');
const categoryService = require('../category/categoryService');

const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');



// config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    // secure: true
});


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
  // var galleryDir = 'public/product_images/' + product._id + '/gallery';
  const comments = await commentService.getAllCommentOfProduct(product._id);
  res.render('product', {
    title: product.title,
    p: product,
    loggedIn: loggedIn,
    user: req.user,
    commentss: comments,
  });
  // fs.readdir(galleryDir, function (err, files) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     galleryImages = files;
  //     // const comments = await Comment.find({productName: product.title});
  //     console.log("\n\ncomments: \n" + JSON.stringify(comments))
  //     res.render('product', {
  //       title: product.title,
  //       p: product,
  //       galleryImages: galleryImages,
  //       loggedIn: loggedIn,
  //       user: req.user,
  //       commentss: comments,
  //     });
  //   }
  // })
}


exports.postAddProduct = (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
      var pro = fields;      
      pro.slug = pro.slug + "";
      pro["slug"] = pro.title.replace(/\s+/g, '-').toLowerCase();
      
      const prod = await productService.findProductWithSlug(pro.slug);
      if (prod) {          
          res.redirect('/admin/add-products?message=product existed');
      } else {
          const newProduct = await productService.createNewProduct(pro);  
          let newLink;
          await cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/product/${pro._id}/${files.image.newFilename}`,width: 400, height: 400, crop: "scale", fetch_format: "jpg"}, function(error, result) {
              //await productService.updateImage(result.url, newPromo._id);
             newLink = result.url;
          
          });
          await productService.updateImage(newLink, newProduct._id);
          res.redirect('/admin/products');
      }

  })
};

exports.getEditProduct = async (req, res) => {
    var id = req.params.id;
    const p = await productService.findProductWithId(id);
    const categories = await categoryService.findAll();      
    res.render('admin/edit_product', {
        title: p.title,
        desc: p.desc,
        categories: categories,
        category: p.category.replace(/\s+/g, '-').toLowerCase(),
        price: parseFloat(p.price).toFixed(2),
        image: p.image,        
        id: p._id
    });

};


exports.postEditProduct = async (req, res) => {
    var id = req.params.id;
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
        var pro = fields;      
        pro.slug = pro.slug + "";
        pro["slug"] = pro.title.replace(/\s+/g, '-').toLowerCase();
        
        var prod = await productService.findProductWithId(id);
        if (prod) {   
            await productService.updateProduct(id, fields) 
            console.log("update: \n" + JSON.stringify(prod))
            let newLink;
            console.log("FILES: " + JSON.stringify(files))
            if (files.image.originalFilename) {
                await cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/product/${prod._id}/${files.image.newFilename}`,width: 400, height: 400, crop: "scale", fetch_format: "jpg"}, function(error, result) {
                  newLink = result.url;
                });
                await productService.updateImage(newLink, prod._id);
                res.redirect('/admin/products');   
            }   
            else {
              res.redirect('/admin/products');  
            } 
        } else {
          res.redirect(`/admin/edit-products/${id}?message=product not existed`);   
        }

    })

};
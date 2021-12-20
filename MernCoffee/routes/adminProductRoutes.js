const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const { check, validationResult } = require('express-validator');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;


// get Category model
const Category = require('../models/categoryModel');

// get Products model
const Product = require('../models/productModel');
const productController = require('../component/product/productController');

/**
 * GET product index
 */
router.get('/', async (req, res) => {
    // const page = req.query.page || 1;
    // const limit = req.query.limit * 1 || 16;
    // const skip = (page - 1) * limit;
    const count = (await Product.find()).length;
    // const totalPage = Math.ceil(count / limit);

    // const products = await Product.find().skip(skip).limit(limit);

    const products = await Product.find()

    res.render('admin/products', {
        title: 'All products',
        products: products,
        count: count,
        // page,
        // limit,
        // totalPage
    });
});


/**
 * GET add product
 */
router.get('/add-product', (req, res) => {

    var title = "";
    var desc = "";
    var price = "";

    //res.send("add category");

    Category.find((err, categories) => {
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    });
});




/**
 *  POST add-category
 */
 router.post('/add-product', productController.postAddProduct);

// router.post('/add-product', (req, res) => {
//     var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

//     check('title', 'Title must have a value').notEmpty();
//     check('desc', 'decription must have a value').notEmpty();
//     check('price', 'Price must have a value').isDecimal();
//     check('image', 'You must upload an image').custom(imageFile => {
//         var extension = (path.extname(imageFile)).toLowerCase();
//         switch (extension) {
//             case '.jpg':
//                 return '.jpg';
//             case '.jpeg':
//                 return '.jpeg';
//             case '.png':
//                 return '.png';
//             case '':
//                 return '.jpg';
//             default:
//                 return false;
//         }
//     });




//     var title = req.body.title + "";
//     var slug = title.replace(/\s+/g, '-').toLowerCase();
//     var desc = req.body.desc;
//     var price = req.body.price;
//     var category = req.body.category;

//     const errors = validationResult(req);

//     // if (!isImage(req.files)) {
//     //     errors.errors.push({ value: '', msg: 'You must upload an image', param: 'image', location: 'body' })
//     // }

//     if (!errors.isEmpty()) {
//         Category.find((err, categories) => {
//             res.render('admin/add_product', {
//                 errors: errors,
//                 title: title,
//                 desc: desc,
//                 categories: categories,
//                 price: price
//             });
//         });
//     } else {
//         Product.findOne({ slug: slug }, (err, product) => {
//             if (product) {
//                 req.flash('danger', 'Product title exists, choose another.');
//                 Category.find(function (err, categories) {
//                     res.render('admin/add_product', {
//                         title: title,
//                         desc: desc,
//                         categories: categories,
//                         price: price
//                     });
//                 });
//             } else {
//                 var price2 = parseFloat(price).toFixed(2);
//                 var product = new Product({
//                     title: title,
//                     slug: slug,
//                     desc: desc,
//                     price: price2,
//                     category: category,
//                     image: imageFile
//                 });

//                 product.save((err) => {
//                     if (err) {
//                         return console.log(err);
//                     }
//                     console.log("da luu thanh cong");

//                     mkdirp('public/product_images/' + product._id).then((err) => console.log(err));

//                     mkdirp('public/product_images/' + product._id + '/gallery').then((err) => console.log(err));

//                     mkdirp('public/product_images/' + product._id + '/gallery/thumbs').then(
//                         (err) => {
//                             console.log(err);
//                             if (imageFile != "") {
//                                 var productImage = req.files.image;

//                                 var path = 'public/product_images/' + product._id + '/' + imageFile;

//                                 productImage.mv(path, (err) => {
//                                     return console.log(err);
//                                 });
//                             }
//                         }
//                     );

//                     req.flash('success', 'Product added!');
//                     res.redirect('/admin/products');

//                 });
//             }
//         });
//     }
// });


/*
 * GET edit product
 */
router.get('/edit-product/:id', productController.getEditProduct);
// router.get('/edit-product/:id', function (req, res) {

//     var errors;

//     if (req.session.errors) {
//         errors = req.session.errors;
//     }
//     req.session.errors = null;

//     Category.find(function (err, categories) {

//         Product.findById(req.params.id, function (err, p) {
//             if (err) {
//                 console.log(err);
//                 res.redirect('/admin/products');
//             } else {
//                 var galleryDir = 'public/product_images/' + p._id + '/gallery';
//                 var galleryImages = null;

//                 fs.readdir(galleryDir, function (err, files) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         galleryImages = files;

//                         res.render('admin/edit_product', {
//                             title: p.title,
//                             errors: errors,
//                             desc: p.desc,
//                             categories: categories,
//                             category: p.category.replace(/\s+/g, '-').toLowerCase(),
//                             price: parseFloat(p.price).toFixed(2),
//                             image: p.image,
//                             galleryImages: galleryImages,
//                             id: p._id
//                         });
//                     }
//                 });
//             }
//         });

//     });

// });



/*
 * POST edit product
 */
router.post('/edit-product/:id', productController.postEditProduct);

// router.post('/edit-product/:id', (req, res) => {

//     var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

//     check('title', 'Title must have a value').notEmpty();
//     check('desc', 'decription must have a value').notEmpty();
//     check('price', 'Price must have a value').isDecimal();
//     check('image', 'You must upload an image').custom(imageFile => {
//         var extension = (path.extname(imageFile)).toLowerCase();
//         switch (extension) {
//             case '.jpg':
//                 return '.jpg';
//             case '.jpeg':
//                 return '.jpeg';
//             case '.png':
//                 return '.png';
//             case '':
//                 return '.jpg';
//             default:
//                 return false;
//         }
//     });

//     var title = req.body.title + "";
//     var slug = title.replace(/\s+/g, '-').toLowerCase();
//     var desc = req.body.desc;
//     var price = req.body.price;
//     var category = req.body.category;
//     var pimage = req.body.pimage;
//     var id = req.params.id;

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         req.session.errors = errors;
//         res.redirect('/admin/products/edit-product/' + id);
//     } else {
//         Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, p) {
//             if (err) {
//                 console.log("loi o find product");
//                 console.log(err);
//             }
//             if (p) {
//                 req.flash('danger', 'Product title exists, choose another.');
//                 res.redirect('/admin/products/edit-product/' + id);
//             } else {
//                 Product.findById(id, function (err, p) {
//                     if (err) {
//                         console.log("loi o find id");
//                         console.log(err);
//                     }
//                     p.title = title;
//                     p.slug = slug;
//                     p.desc = desc;
//                     p.price = parseFloat(price).toFixed(2);
//                     p.category = category;
//                     if (imageFile != "") {
//                         p.image = imageFile;
//                     }

//                     p.save(function (err) {
//                         if (err) {
//                             console.log("loi save");
//                             console.log(err);
//                         }
//                         if (imageFile != "") {
//                             if (pimage != "") {
//                                 fs.remove('public/product_images/' + id + '/' + pimage).then((err) => {
//                                     console.log(err);
//                                     if (imageFile != "") {
//                                         var productImage = req.files.image;

//                                         var path = 'public/product_images/' + id + '/' + imageFile;

//                                         productImage.mv(path, (err) => {
//                                             console.log("loi return mv");
//                                             return console.log(err);
//                                         });
//                                     }
//                                 });
//                             }
//                         }

//                         req.flash('success', 'Product edited!');
//                         res.redirect('/admin/products/');
//                     });

//                 });
//             }
//         });
//     }

// });

/*
 * POST product gallery
 */
router.post('/product-gallery/:id', function (req, res) {

    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(path, function (err) {
        if (err) {
            console.log("mv gallery");
            console.log(err);
        }
        resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);

});


/*
 * GET delete image
 */
router.get('/delete-image/:image', function (req, res) {

    var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/products/');
                }
            });
        }
    });
});


/*
 * GET delete product
 */
router.get('/delete-product/:id', function (req, res) {

    var id = req.params.id;
    var path = 'public/product_images/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndRemove(id, function (err) {
                console.log(err);
            });

            req.flash('success', 'Product deleted!');
            res.redirect('/admin/products');
        }
    });

});

module.exports = router;




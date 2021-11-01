const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const { check, validationResult } = require('express-validator');




// get Category model
const Category = require('../models/categoryModel');

// get Products model
const Product = require('../models/productModel');


/**
 * GET product index
 */
router.get('/', (req, res) => {
   var count;

    Product.count({}, function( err, c){
        count = c;
    })
    

    Product.find((err, products) => {
        res.render('admin/products', {
            products: products,
            count: count
        });
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


// function isImage(files) {

//     if (files !== null) {
    
//         let extension = files.image.name.split('.').pop();
//         console.log(extension)
//         switch (extension) {
//             case 'jpg':
//                 return true;
//             case 'jpeg':
//                 return true;
    
//             case 'png':
//                 return true;
    
//             default:
//                 return false;
//         }
//     } else return false;
// }

/**
 *  POST add-category
 */
router.post('/add-product', (req, res) => {
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    check('title', 'Title must have a value').notEmpty();
    check('desc', 'decription must have a value').notEmpty();
    check('price', 'Price must have a value').isDecimal();
    //check('image', 'You must upload an image').isImage(imageFile);

    check('image', 'You must upload an image').custom(imageFile => {
        var extension = (path.extname(imageFile)).toLowerCase();
        switch (extension) {
            case '.jpg':
                return '.jpg';
            case '.jpeg':
                return '.jpeg';
            case '.png':
                return '.png';
            case '':
                return '.jpg';
            default:
                return false;
    }});




    var title = req.body.title + "";
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    const errors = validationResult(req);

    // if (!isImage(req.files)) {
    //     errors.errors.push({ value: '', msg: 'You must upload an image', param: 'image', location: 'body' })
    // }

    if (!errors.isEmpty()) {
        Category.find((err, categories) => {
            res.render('admin/add_product', {
                errors: errors,
                title: title,
                desc: desc,
                categories: categories,
                price: price
            });
        });
    } else {
        Product.findOne({slug: slug}, (err, product) => {
            if (product) {
                req.flash('danger', 'Product title exists, choose another.');
                Category.find(function (err, categories) {
                    res.render('admin/add_product', {
                        title: title,
                        desc: desc,
                        categories: categories,
                        price: price
                    });
                });
            } else {
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                });

                product.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("da luu thanh cong");

                    // mkdirp('public/product_images/' + product._id, function (err) {
                    //     console.log("loi tao folder product_id");
                    //     return console.log(err);
                    // });

                    mkdirp('public/product_images/' + product.title).then((err)=>console.log(err));

                    mkdirp('public/product_images/' + product.title + '/gallery').then((err)=>console.log(err));
                
                    mkdirp('public/product_images/' + product.title + '/gallery/thumbs').then(
                        (err) => {
                            console.log(err);
                            if (imageFile != "") {
                                var productImage = req.files.image;
    
                                var path = 'public/product_images/' + product.title + '/' + imageFile;
    
                                productImage.mv(path, (err) => {
                                    return console.log(err);
                                });
                            }
                        }
                    );

                    // if (imageFile != "") {
                    //     var productImage = req.files.image;
                    //     //var path = 'public/product_images/' + product._id + '/' + imageFile;
                    //     var path = 'public/product_images/' + '/' + imageFile;
                    //     productImage.mv(path, function (err) {
                    //         console.log("here");
                    //         return console.log(err);
                    //     });
                    // }
 
                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products');

                });
            }
        });
    }
});


module.exports = router;




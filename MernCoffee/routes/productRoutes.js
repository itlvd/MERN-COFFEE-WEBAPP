var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Comment = require('../models/commentModel');

/*
 * GET all products
 */
router.get('/', async function (req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 16;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil((await Product.count()) / limit);

    const products = await Product.find().skip(skip).limit(limit);
    const categories = await Category.find();

    res.render('all_products', {
        title: 'All products',
        products: products,
        categories: categories,
        user: req.user,
        page,
        limit,
        totalPage
    });
});


/*
 * GET products by category
 */
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products,
                user: req.user
            });
        });
    });

});

/*
 * GET product details
 */
router.get('/:category/:product', function (req, res) {

    var galleryImages = null;
    const loggedIn = true;
    // const loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;
                    // const comments = await Comment.find({productName: product.title});
                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn,
                        user: req.user,
                        // comments: comments,
                    });
                }
            });
        }
    });

    // const pro = await Product.findOne({slug: req.params.product});
    // if (pro) {
    //     const comments = await Comment.find({productName: product.title});
    // }

});


// router.post('/:category/:product/comment', (req, res) => {
//     res.send("hihi");
// })


// Exports
module.exports = router;

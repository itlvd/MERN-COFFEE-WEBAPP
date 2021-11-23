const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;


//  Get Product model
const Product = require('../models/productModel');

// Get Category model
const Category = require('../models/categoryModel');



/*
 * GET products by category
 */
router.get('/:item', async function (req, res) {

    var item = req.params.item + "";    
    const slug = item.replace(/\s+/g, '-').toLowerCase();


    // {title : new RegExp(item, 'i')
    cates = await Category.find({slug: slug}, function (err, categories) {
        if (err) return console.log(err);
        // res.send(categories);
        return categories;
    }).clone().catch(function(err){ console.log(err)});


    // new RegExp('^'+item+'$', "i")
    prods = await Product.find({ slug : { '$regex' : slug, '$options' : 'i' } } , function (err, categories) {
        if (err) return console.log(err);
        // res.send(categories);
        return categories;
    }).clone().catch(function(err){ console.log(err)});

    console.log("cates: \n" + cates);
    console.log("prods: \n" + prods);


    var count;
    if ((cates==null && prods ==null) ||  (cates==undefined && prods ==undefined)) {
        count = 0;
    }
    else {
        count = 1;
    }

    res.render('search.ejs', {
        title: "Search Page",
        categories: cates,
        products: prods,
        count: count,
        user: req.user
    });
});



// Exports
module.exports = router;
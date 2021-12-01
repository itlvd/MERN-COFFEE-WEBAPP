var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
const mkdirp = require('mkdirp');
const resizeImg = require('resize-img');
const { check, validationResult } = require('express-validator');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

const Promotion = require('../models/promotionModel');
// const News = require('../models/newsModel');


/*
 * GET all promotions
 */
router.get('/', async (req, res) => {

    const count = (await Promotion.find()).length;    
    const promos = await Promotion.find();
    console.log("count promotion" + promos[0])
    res.render("admin/news_promo", {
        title: "Admin Promotion",
        count: count,
        promotions: promos,
    })
});

/**
 * GET add promotion
 */
 router.get('/add-promotion', (req, res) => {

    var title = "";
    var desc = "";
    var price = "";

    //res.send("add category");

    
    res.render('admin/add_promotion', {
        title: "Add promotion",
    });
    
});


/**
 *  POST add-category
 */
 router.post('/add-promotion', (req, res) => {
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    check('title', 'Title must have a value').notEmpty();
    check('code', 'decription must have a value').notEmpty();
    check('value', 'Discount value must have a value').notEmpty();
    check('quantity', 'Quantity must have a value').isDecimal();
    check('expiryDate', 'Expire must have a value').notEmpty();
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
        }
    });




    var title = req.body.title + "";
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var code = req.body.code;
    var value = req.body.value;
    var quantity = req.body.quantity;
    var expireDate = req.body.expiryDate
    const errors = validationResult(req);

    // if (!isImage(req.files)) {
    //     errors.errors.push({ value: '', msg: 'You must upload an image', param: 'image', location: 'body' })
    // }
    
    if (!errors.isEmpty()) {
        res.redirect("/admin/promotions");
    } else {
        Promotion.findOne({ slug: slug }, (err, promotion) => {
            if (promotion) {
                req.flash('danger', 'Promotion title exists, choose another.');
                res.redirect('/admin/promotions');
            } else {
                ///var price2 = parseFloat(price).toFixed(2);
                var promotion = new Promotion({
                    title: title,
                    slug: slug,
                    code: code,
                    value: value,
                    quantity: quantity,
                    expiryDate: expireDate,
                    image: imageFile
                });

                promotion.save((err) => {
                    if (err) {
                        return console.log(err);
                    }
                    

                    mkdirp('public/promotion_images/' + promotion._id).then((err) => console.log(err));

                    

                    mkdirp('public/promotion_images/' + promotion._id).then(
                        (err) => {
                            console.log(err);
                            if (imageFile != "") {
                                var promotionImage = req.files.image;

                                var path = 'public/promotion_images/' + promotion._id + '/' + imageFile;

                                promotionImage.mv(path, (err) => {
                                    return console.log(err);
                                });
                            }
                        }
                    );

                    req.flash('success', 'Promotion added!');
                    res.redirect('/admin/promotions');

                });
            }
        });
    }
});

/*
 * GET delete promotion
 */
router.get('/delete-promotion/:id', function (req, res) {

    var id = req.params.id;
    var path = 'public/promotion_images/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Promotion.findByIdAndRemove(id, function (err) {
                console.log(err);
            });

            req.flash('success', 'Product deleted!');
            res.redirect('/admin/promotions');
        }
    });

});


// Exports
module.exports = router;

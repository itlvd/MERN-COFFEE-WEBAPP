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
const promotionController = require('../component/promotion/promotionController');
var cloudinary = require('cloudinary').v2;  
const formidable = require('formidable');
//const form = formidable();

// config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });

/*
 * GET all promotions
 */
router.get('/', isEmployee, promotionController.getAllPromotions);


/**
 * GET add promotion
 */
router.get('/add-promotion', isEmployee, promotionController.add_promotion);

/**
 * POST add new promotion
 */
router.post('/add-promotion', promotionController.postAddPromotion);

// router.post('/add-promotion', (req, res) => {
//     const form = formidable({});
//     form.parse(req, async (err, fields, files) => {
//         var pro = fields;
        
        
//         pro.slug = pro.slug + "";
//         pro["slug"] = pro.title.replace(/\s+/g, '-').toLowerCase();
//         console.log("lug" + pro.slug)
//         console.log(pro);
//         Promotion.findOne({ slug: pro.slug }, (err, promotion) => {
//             if (promotion) {
//                 req.flash('danger', 'Promotion title exists, choose another.');
//                 res.redirect('/admin/promotions');
//             } else {
//                 promotion = new Promotion(pro);
//                 promotion.save()
//                 .then((result) => {
//                     cloudinary.uploader.upload(files.image.filepath, { public_id: `mern/propotion/${result._id}/${result.nameImage}`,width: 479, height: 340, crop: "scale"})
//                     res.redirect('/promotions');
//                 })
//                 .catch(err => console.log(err));
//             }
//         });
//     })
// });





/*
 * GET delete promotion
 */
router.get('/delete-promotion/:id', isEmployee, function (req, res) {

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

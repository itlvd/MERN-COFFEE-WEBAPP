const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();


// get Categories model
const Category = require('../models/categoryModel');


/**
 * GET category index
 */
router.get('/', (req, res) => {
    Category.find(function(err, categories) {
        if (err) return console.log(err);
        res.send(categories);

        // res.render('admin/categories', {
        //     categories: categories
        // });


    });
});


/**
 * GET add-category
 */
router.get('/add-category', (req, res) => {

    var title = "";
    //res.send("add category");

    res.render('admin/add_category', {
        title: title
    });
});


/**
 *  POST add-category
 */
router.post('/add-category', check('title').notEmpty(), (req, res) => {
   
    var title = req.body.title;
  
    title = title + "";
    var slug = title.replace(/\s+/g, '-').toLowerCase();
   
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // res.render('admin/add_category', {
        //     errors: errors,
        //     title: title
        // });

        res.send("Loi o empty");    

    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', {
                    title: title
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err)
                        //return console.log(err);
                        return console.log("loi database");
                    Category.find(function (err, categories) {
                        if (err) {
                            //console.log(err);
                            console.log("loi o find")

                        } else {
                            req.app.locals.categories = categories;
                        }
                    });

                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

});






module.exports = router;




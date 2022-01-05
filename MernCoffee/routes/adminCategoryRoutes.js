const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

// get Categories model
const Category = require('../models/categoryModel');


/**
 * GET category index
 */
router.get('/', isEmployee, async (req, res) => {
    var count;
    var category_count = 1;

    count = (await Category.find()).length;

    Category.find(function (err, categories) {
        if (err) return console.log(err);
        // res.send(categories);

        res.render('admin/categories', {
            categories: categories,
            category_count: category_count,
            count: count,
            title: "Category",
        });


    });
});


/**
 * GET add-category
 */
router.get('/add-category', isEmployee, (req, res) => {

    var title = "";
    //res.send("add category");

    res.render('admin/add_category', {
        title: "Add category",
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
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/add_category', {
                    title: title,
                    slug: slug
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
                    res.redirect('/admin/categories/');
                });
            }
        });
    }

});


/**
 * GET edit category
 */
router.get('/edit-category/:id', isEmployee, (req, res) => {

    Category.findById(req.params.id, (err, category) => {
        if (err) {
            return console.log(err);
        }
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    });

});

/**
 * POST edit category
 */
router.post('/edit-category/:id', (req, res) => {

    check('title', 'title must have a value').notEmpty()
    var title = req.body.title;
    var id = req.params.id;
    title = title + "";
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //res.render('admin/edit_category', {
        //     errors: errors,
        //     title: title,
        //     id: id
        // });

        res.send("Loi o empty");

    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, function (err, category) {
                    if (err) {
                        return console.log(err);
                    }
                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });

                        //req.flash('success', 'Category edited!');
                        //res.redirect('/admin/categories/edit-category/' + id);
                        res.redirect('/admin/categories');
                    });

                });


            }
        })
    }

})


router.get('/delete-category/:id', isEmployee, (req, res) => {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return console.log(err);
        }
        req.flash('success', 'Categoty deleted!');
        res.redirect('/admin/categories/')

    })
})


module.exports = router;




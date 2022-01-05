const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;



// get User model
const User = require("../models/userModel");




/**
 * GET show customer list
 */
router.get('/', isEmployee, async (req, res) => {
    
    //const count = (await User.where({role: "user"}).find()).length;
    const count = (await User.where({ role: "user"}).find()).length;
    const customer_count = 1;
    User.where({ role: "user" }).find((err, customers) => {
        if (err) {
            return console.log(err);
            
        }
        res.render('admin/customer', {
            customers: customers,
            count: count,
            customer_count: customer_count,
            title: "Customer List",
        });
    });
});


/**
 * GET add customer
 */
router.get('/add-customer', isEmployee, (req, res) => {
    // title ?
    res.render('admin/add_customer', {
        title: "Add customer"
    });
});


/**
 *  POST add-customer
 */
router.post('/add-customer', async (req, res) => {
    

    check('name', 'Title must have a value').notEmpty();
    check('email', 'decription must have a value').isEmail();
    check('username', 'Title must have a value').notEmpty();
    check('password', 'decription must have a value').notEmpty();
    check('role', 'Title must have a value').notEmpty();
    

    const name = req.body.name + "";
    const email = req.body.email + "";
    const username = req.body.username + "";
    const password = req.body.password + "";
    const role = req.body.role + "";

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("loi empty validation");
        res.render('admin/add_customer', {
            errors: errors,
            title: 'Register'
        }); 
    } else {
        //const user = await User.findById(idUser);
        console.log("Name: " + name);
        console.log("UserName: " + username);
        console.log("gmail: " + email);
        console.log("password: " + password);

        await User.where({username: username}).findOne( (err, user) => {
            if (err) {
                console.log("loi find user");
                console.log(err);
            }
            else if (user) {
                console.log("loi user exist");
                console.log("User\n" + user);
                req.flash('danger', 'Username exist, choose another!');
                res.redirect('/admin/customer');
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    role: role
                    // role: role ?
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("success");
                                req.flash('success', 'Add new customer successfully!');
                                //res.redirect('/users/login')
                                res.redirect('/admin/customer');
                            }
                        });
                    });
                });
            }

        }).clone().catch(function(err){ console.log(err)})
    }
 
    
});





/*
 * GET delete customer
 */
router.get('/delete-customer/:id', isEmployee, function (req, res) {

    var id = req.params.id;
    
    User.findByIdAndRemove(id, function (err) {
        console.log(err);
    });
    
    req.flash('success', 'Customer deleted!');
    res.redirect('/admin/customer');       

});

module.exports = router;




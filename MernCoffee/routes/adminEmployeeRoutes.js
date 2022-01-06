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
 * GET show employee list
 */
router.get('/', isAdmin, async (req, res) => {
    
    //const count = (await User.where({role: "employee"}).find()).length;
    const count = (await User.where({ role: { $ne: "user" } }).find()).length;
    const employee_count = 1;
    User.where({ role: { $ne: "user" } }).find((err, employees) => {
        if (err) {
            res.redirect('/admin/pages?message=Can view employee list right now');
            return console.log(err);
        }
        res.render('admin/employee', {
            employees: employees,
            count: count,
            employee_count: employee_count,
            title: "Employee",
        });
    });
});


/**
 * GET add employee
 */
router.get('/add-employee', isAdmin, (req, res) => {
    // title ?
    let error = req.query.message || undefined;
    if (error) {
        error = req.query.message;
    }
    res.render('admin/add_employee', {
        title: "Add Employee",
        error: error,
    });
});


/**
 *  POST add-employee
 */
router.post('/add-employee', async (req, res) => {
    

    // check('name', 'Title must have a value').notEmpty();
    // check('email', 'decription must have a value').isEmail();
    // check('username', 'Title must have a value').notEmpty();
    // check('password', 'decription must have a value').notEmpty();
    // check('role', 'Title must have a value').notEmpty();
    

    const name = req.body.name + "";
    const email = req.body.email + "";
    const username = req.body.username + "";
    const password = req.body.password + "";
    const role = req.body.role + "";

    if (name == "" || email == "" || username == "" || password == "" || role == "") {
        res.redirect('/admin/employee/add-employee?message=Please enter full information')
    } else {

        await User.where({username: username}).findOne( (err, user) => {
            if (err) {

                res.redirect('/admin/employee/add-employee?message=Error to add, please try again')
            }
            else if (user) {
                res.redirect('/admin/employee/add-employee?message=Username exist, choose another!')

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
                        if (err) {
                            //console.log(err);
                            res.redirect('/admin/employee/add-employee?message=Error to add, please try again')
                        }
                        else {
                            user.password = hash;
                            user.save(function (err) {
                                if (err) {
                                    res.redirect('/admin/employee/add-employee?message=Error to add, please try again')                                    
                                } else {                                    
                                    //req.flash('success', 'Add new employee successfully!');
                                    //res.redirect('/users/login')
                                    res.redirect('/admin/employee');
                                }
                            });
                        }
                    });
                });
            }

        }).clone().catch(function(err){ console.log(err)})
    }
 
    
});





/*
 * GET delete employee
 */
router.get('/delete-employee/:id', isAdmin, function (req, res) {

    var id = req.params.id;
    
    User.findByIdAndRemove(id, function (err) {
        console.log(err);
    });
    
    req.flash('success', 'Employee deleted!');
    res.redirect('/admin/employee');       

});

module.exports = router;




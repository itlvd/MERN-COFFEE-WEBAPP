const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
// Get Users model
var User = require('../models/userModel');


/**
 * GET register
 */
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    });
});



router.post('/register', async (req, res) => {
    console.log("bat dau check");
    var name = await req.body.name;
    var email = await req.body.email;
    var username = await req.body.username;
    var password = await req.body.password;
    var password2 = await req.body.password2;
    // role ?

    check('name', 'Name is required!').notEmpty();
    check('email', 'Email is required!').isEmail();
    check('username', 'Username is required!').notEmpty();
    check('password', 'Password is required!').notEmpty();
    check('password2', 'Passwords do not match!').equals(password);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("loi empty validation");
        res.render('register', {
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
                res.redirect('/users/register');
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    role: 'admin'
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
                                req.flash('success', 'You are now registered!');
                                //res.redirect('/users/login')
                                res.redirect('/about');
                            }
                        });
                    });
                });
            }

        }).clone().catch(function(err){ console.log(err)})
    }


});


/*
 * GET login
 */
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    //res.send("Loi ne");
    res.render('login', {
        title: 'Log in'
    });

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});

/*
 * GET logout
 */
router.get('/logout', function (req, res) {

    req.logout();
    
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');

});





// Exports
module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
// Get Users model
var User = require('../models/userModel');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

/**
 * GET register
 */
router.get('/register', hasLogin, (req, res) => {
    var errorRegis = req.query.error;
  
    res.render('register', {
        title: 'Register',
        errorRegis: errorRegis,
    });
});



router.post('/register', async (req, res) => {
    // console.log("bat dau check");
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


        await User.where({username: username}).findOne( (err, user) => {
            if (err) {
                console.log("loi find user");
                console.log(err);
            }
            else if (user) {
                console.log("loi user exist");
                // console.log("User\n" + user);
                req.flash('danger', 'Username exist, choose another!');
                res.redirect('/users/register?error=user exist');
            } else {
                const user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    role: 'user',
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
router.get('/login', hasLogin, function (req, res) {
    let error = req.query.error || undefined;
    if (error) {
        error = req.query.error;
    }
    
    if (res.locals.user) {
        res.redirect('/');
        req.flash("danger", "You have already logged in");
    }
    //res.send("Loi ne");
    var errorLogin = req.query.error;

    res.render('login', {
        title: 'Log in',
        errorLogin: error,
    });

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {
    var prev = req.query.redirect;
    console.log("redirect: " + prev);
    if (typeof prev === 'undefined') {
        prev = '/'
    } else {
        prev = '/' + prev;
    }
    console.log("redirect: " + prev);
    passport.authenticate('local', {
        // successRedirect: '/',
        successRedirect: prev,
        failureRedirect: '/users/login?error=username or password is wrong',
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
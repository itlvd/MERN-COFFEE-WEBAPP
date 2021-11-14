var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel');
var bcrypt = require('bcryptjs');


module.exports = function (passport) {
    
    // console.log("passport dang tim");
    // passport.use(new LocalStrategy(
    //     async function(username, password, done) {
    //         console.log("Pass, username: " + username);
    //         console.log("pass, password: " + password);
    //         await User.where({username: username}).findOne(function (err, user) {
    //             if (err) { 
    //                 console.log("loi passport");
    //                 return done(err); 
    //             }
    //             if (!user) { 
    //                 console.log("!user");
    //                 console.log(user);
    //                 return done(null, false);  
    //             }
    //             console.log("user tim duoc:\n");
    //             console.log(user);
    //             console.log("us name: " + user.username);
    //             console.log("us pass: " + user.password);
    //             console.log("us id: " + user._id);

    //             bcrypt.compare(password, user.password, function (err, isMatch) {
    //                 console.log("bcrypt, password: " + password);
    //                 console.log("bcrypt, user.pass: " + user.password);
    //                 if (err) {
    //                     console.log("loi compare");
    //                     console.log(err);
    //                 }
    //                 if (isMatch) {
    //                     return done(null, user);
    //                 } else {
    //                     console.log("sai pass");
    //                     return done(null, false, {message: 'Wrong password.'});
    //                 }
    //             });
    //         }).clone().catch(function(err){ console.log(err)});
    //     }
    // ));

    // passport.serializeUser(function (user, done) {
    //     done(null, user.id);
    // });

    // passport.deserializeUser(function (id, done) {
    //     User.findById(id, function (err, user) {
    //         done(err, user);
    //     });
    // });


    console.log("passport dang tim");
passport.use('local', new LocalStrategy({passReqToCallback : true},
    async function(req, username, password, done) {
        console.log("Pass, username: " + username);
        console.log("pass, password: " + password);
        await User.where({username: username}).findOne(function (err, user) {
            if (err) { 
                console.log("loi passport");
                return done(err); 
            }
            if (!user) { 
                console.log("!user");
                console.log(user);
                return done(null, false);  
            }
            console.log("user tim duoc:\n");
            console.log(user);
            console.log("us name: " + user.username);
            console.log("us pass: " + user.password);
            console.log("us id: " + user._id);
            bcrypt.compare(password, user.password, function (err, isMatch) {
                console.log("bcrypt, password: " + password);
                console.log("bcrypt, user.pass: " + user.password);
                if (err) {
                    console.log("loi compare");
                    console.log(err);
                }
                if (isMatch) {
                    console.log("req.body:\n" + req.body);
                    if (req.body.remember) {
                        console.log('remember')
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
                    } else {
                        console.log('no remember')
                        req.session.cookie.expires = false; // Cookie expires at end of session
                    }
                    return done(null, user);
                } else {
                    console.log("sai pass");
                    return done(null, false, {message: 'Wrong password.'});
                }
            });
        }).clone().catch(function(err){ console.log(err)});
    }
));

    passport.serializeUser(function (user, done) {
       // done(null, user.id);
       done(null, user);
    });

    //passport.deserializeUser(function (id, done) {
    passport.deserializeUser(function (user, done) {
        // User.findById(id, function (err, user) {
        //     done(err, user);
        // });
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}
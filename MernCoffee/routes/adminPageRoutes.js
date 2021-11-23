const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

/**
 * get admin page index
 */
//router.get('/', (req, res) => {
router.get('/', isEmployee, (req, res) => {  
    
    console.log("req: \n" + req.user);
    //req.flash('success', 'Page test message in admin pages!');
    res.render('admin/pages', {
        user: req.user
    });
    //user: req.user
});

router.get('/temp', (req, res) => {  
    
    console.log("req: \n" + req.user);
    res.render('admin/pages', {
        user: req.user
    });
    //user: req.user
});

module.exports = router;
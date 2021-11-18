const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;


/**
 * get admin page index
 */
//router.get('/', (req, res) => {
router.get('/', isAdmin, (req, res) => {  
    
    console.log("req: \n" + req);
    res.render('admin/pages');
    
});



module.exports = router;
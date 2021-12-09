const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const userController = require('../component/userComponent/userController');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

// Get Product model
const User = require('../models/userModel');

/*
 * GET profile
 */
router.get('/', isUser, userController.getProfile);


/*
 * POST profile
 */
router.post('/', isUser, userController.saveUpdate);

/**
 * update avatar
 */
router.post('/update_avt/:id', userController.updateImage);


/*
 * DELETE account
 */
router.delete('/', isUser, async function(req, res) {
    const user = await User.findByIdAndDelete(req.user);
    
    res.redirect('/');

    // res.status(204).json({
    //     status: 'success',
    //     data: null
    // });
});

module.exports = router;
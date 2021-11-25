const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/:id', async function(req, res, next) {
    const bill = await Bill.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            bill
        }
    });

})

module.exports = router;
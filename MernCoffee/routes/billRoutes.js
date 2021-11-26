const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/', isUser, async function (req, res, next) {
    const bills = await Bill.find({userId: req.user._id});

    res.status(200).json({
        status: 'success',
        result: bills.length,
        data: {
            bills
        }
    });
})

router.get('/:id', isUser, async function(req, res, next) {
    const bill = await Bill.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!bill) {
        res.status(200).json({
            status: 'fail',
            message: 'Something is wrong!'
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            data: {
                bill
            }
        });
    }
})

module.exports = router;

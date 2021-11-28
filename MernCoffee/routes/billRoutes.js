const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/', isUser, async function(req, res, next) {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 4;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil(((await Bill.find({ userId: req.user._id })).length) / limit);
    const bills = await Bill.find({ userId: req.user._id }).sort('createdAt').skip(skip).limit(limit);

    console.log(totalPage);

    res.status(200).json({
        status: 'success',
        result: bills.length,
        data: {
            bills,
            page,
            limit,
            totalPage
        }
    });
})

router.get('/:id', isUser, async function(req, res, next) {
    const promo = 0;
    const ship = 20000;
    const bill = await Bill.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!bill) {
        res.status(200).json({
            status: 'fail',
            message: 'Something is wrong!'
        });
    } else {
        // res.status(200).json({
        //     status: 'success',
        //     data: {
        //         bill
        //     }
        // });

        res.render('bill', {
            title: 'Billing',
            address: bill.address,
            name: req.user.name,
            email: req.user.email,
            phone: bill.phone,
            billid: bill._id,
            products: bill.products,
            promo: promo,
            ship: ship

            // user: req.user
        });
    }
})

module.exports = router;
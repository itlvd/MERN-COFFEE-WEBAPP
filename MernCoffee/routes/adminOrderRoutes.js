const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/', isEmployee, async function(req, res, next) {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 16;
    const skip = (page - 1) * limit;
    const totalPage = Math.ceil((await Bill.find({ status: 'processing' })).length / limit);
    const bills = await Bill.find({ status: 'processing' }).sort('createdAt').skip(skip).limit(limit);

    res.render('admin/handleOrder', {
        title: 'Danh sách mua hàng',
        bill: bills,
        page,
        totalPage,
    });

})

router.get('/:id', isEmployee, async function(req, res, next) {
    const bill = await Bill.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            bill
        }
    });

})

router.get('/:id/:status', isEmployee, async function(req, res) {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, { status: req.params.status }, {
        new: true,
        runValidators: true,
    });

    res.redirect('/admin/orders');
});

module.exports = router;
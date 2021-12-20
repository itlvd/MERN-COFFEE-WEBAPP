const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();
const billController = require('../component/bill/billController');
const Bill = require('../models/billModel');
router.get('/', isEmployee, billController.getAllBillUncompleted);

router.get('/:id', isEmployee, billController.getBillByEmployee);

router.get('/:id/:status', isEmployee, async function(req, res) {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, { status: req.params.status }, {
        new: true,
        runValidators: true,
    });

    res.redirect('/admin/orders');
});

module.exports = router;
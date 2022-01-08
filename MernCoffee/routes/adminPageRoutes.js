const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

const Bill = require('../models/billModel');

/**
 * get admin page index
 */
//router.get('/', (req, res) => {
router.get('/', isEmployee, async (req, res) => {
    const bills = await Bill.find({ status: 'completed' });
    let allProducts = {};

    for (let it = 0; it < bills.length; it++) {
        let bill = bills[it];

        for (let p = 0; p < bill.products.length; p++) {
            let product = bill.products[p];

            if (!allProducts[product._id]) {
                const quantity = product.quantity;
                product.quantity = undefined;
                allProducts[product._id] = { info: product, quantity };
            }
            else {
                const quantity = product.quantity;
                product.quantity = undefined;
                allProducts[product._id] = { info: product, quantity: allProducts[product._id].quantity + quantity };
            }
        }
    }

    let total = 0;
    let keys = Object.keys(allProducts);
    for (let i = 0; i < keys.length; i++) {
        total += allProducts[keys[i]].quantity * allProducts[keys[i]].info.price;
    }

    monthlyIncome = [];
    const monthNames = [];
    for (let i = 1; i <= 12; i++)
        monthNames.push('Tháng ' + i);

    for (let i = 0; i < 12; i++) {
        let total = 0;

        for (let b = 0; b < bills.length; b++) {
            let bill = bills[b];
            let createdAt = bill.createdAt;
            let month = new Date(createdAt).getMonth();
            let year = new Date(createdAt).getFullYear();

            if (month == i && year == new Date().getFullYear())
                total += bill.total;
        }

        monthlyIncome.push(total)
    }

    let error = req.query.message || undefined;
    if (error) {
        error = req.query.message;
    }
    res.render('admin/pages', {
        user: req.user,
        monthlyIncome: monthlyIncome,
        total,
        title: "Admin Home",
        error: error,
    });
});

router.get('/temp', (req, res) => {

    console.log("req: \n" + req.user);
    res.render('admin/pages', {
        user: req.user,
        title: "Admin Home",
    });
    //user: req.user
});

module.exports = router;
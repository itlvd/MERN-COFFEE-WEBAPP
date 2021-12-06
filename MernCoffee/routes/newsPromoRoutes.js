var express = require('express');
const { rmdirSync } = require('fs-extra');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

const Promotion = require('../models/promotionModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
// const News = require('../models/newsModel');


/*
 * GET all products
 */
router.get('/', (req, res) => {
    res.render("news_promotion", {
        title: "News Promotion"
    })
});

router.post('/apply/', async (req, res) => {
    const user = await User.findById(req.user);
    const promotion = await Promotion.findOne({
        code: req.body.code
    });
    const ship = 20000;
    products = [];

    for (let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        products.push(product);
    }

    res.render('checkout', {
        title: 'Checkout',
        cart: products,
        user: user,
        code: req.body.code,
        promoValue: promotion.value,
        ship: ship
    });
});

// Exports
module.exports = router;

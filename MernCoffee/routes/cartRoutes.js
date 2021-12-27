const express = require('express');
const { use } = require('passport');
const router = express.Router();

const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const cartController = require('../component/cart/cartController');

// GET add product to cart
router.get('/add/:product', isUser, cartController.addProduct);

// GET checkout page
router.get('/', isUser, cartController.getCart);

// GET update product
router.get('/update/:product', isUser, cartController.updateProduct);

// GET clear cart
router.get('/clear', isUser, cartController.cleanCart);

// GET buy now
router.post('/buynow', isUser, cartController.buynow);

router.post('/apply/', cartController.applyPromotion);

module.exports = router;
    
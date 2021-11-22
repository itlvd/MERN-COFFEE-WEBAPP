const express = require('express');
const { use } = require('passport');
const router = express.Router();

// Get Product model
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Bill = require('../models/billModel');

const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

/*
 * GET add product to cart
 */
router.get('/add/:product', isUser, function (req, res) {
    const slug = req.params.product;

    Product.findOne({slug: slug}, async function (err, p) {
        const user = await User.findById(req.user);
        const cart = user.cart;

        const temp = cart.filter(product => product._id.toString() == p._id.toString());

        if (temp.length) {
            res.status(200).json({
                status: 'fail',
                message: 'Product is exist in your cart!',
            })
        }
        else {
            const product = { '_id': p._id, 'quantity': 1};
            user.cart.push(product);
            await user.save();
        }

        req.flash('success', 'Product added!');
        res.redirect('back');
    });

});

/*
 * GET checkout page
 */
router.get('/', isUser, async function (req, res) {
    const user = await User.findById(req.user);

    products = []
    for(let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        products.push(product);
    }

    res.render('checkout', {
        title: 'Checkout',
        cart: products,
        user: user
    });
});

/*
 * GET update product
 */
router.get('/update/:product', isUser, async function (req, res) {
    const user = await User.findById(req.user);

    var slug = req.params.product;
    var cart = [];
    for (let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        cart.push(product);
    }
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].slug == slug) {
            switch (action) {
                case "add":
                    (user.cart)[i].quantity++;
                    break;
                case "remove":
                    (user.cart)[i].quantity--;
                    if ((user.cart)[i].quantity < 1)
                        user.cart.splice(i, 1);
                    break;
                case "clear":
                    user.cart.splice(i, 1);
                    if (user.cart.length == 0)
                        user.cart = [];
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    // user.cart = cart;
    await user.save();

    req.flash('success', 'Cart updated!');
    res.redirect('/cart');
});

/*
 * GET clear cart
 */
router.get('/clear', isUser, async function (req, res) {
    const user = await User.findById(req.user);

    user.cart = [];
    await user.save();
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart');

});

/*
 * GET buy now
 */
router.get('/buynow', isUser, async function (req, res) {
    const user = await User.findById(req.user);
    const cart = user.cart;

    if (cart.length == 0) {
        res.status(400).json({
            status: 'fail',
            message: 'Cart is empty!'
        });
        return;
    }

    let bill = {};
    let total = 0;
    bill.userId = user._id;
    bill.products = [];

    for (let i = 0; i < cart.length; i++) {
        let temp = await Product.findById(cart[i]._id);

        let product = {};
        product._id = temp._id;
        product.title = temp.title;
        product.slug = temp.slug;
        product.desc = temp.desc;
        product.category = temp.category;
        product.price = temp.price;
        product.image = temp.image;
        product.quantity = cart[i].quantity;
        total += cart[i].quantity * temp.price;

        bill.products.push(product);
    }

    bill.total = total;
    bill.address = '';
    bill.phone = '';

    bill = await Bill.create(bill);

    user.cart = [];
    await user.save();

    res.status(200).json({
        status: 'success',
        data: {
            bill
        }
    });
});

// Exports
module.exports = router;

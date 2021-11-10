var express = require('express');
const { use } = require('passport');
var router = express.Router();

// Get Product model
const Product = require('../models/productModel');
const User = require('../models/userModel');

/*
 * GET add product to cart
 */
router.get('/add/:product', function (req, res) {
    var slug = req.params.product;

    Product.findOne({slug: slug}, async function (err, p) {
//         if (err)
//             console.log(err);

//         if (typeof req.session.cart == "undefined") {
//             req.session.cart = [];
//             req.session.cart.push({
//                 title: slug,
//                 qty: 1,
//                 price: parseFloat(p.price).toFixed(2),
//                 image: '/product_images/' + p._id + '/' + p.image
//             });
//         } else {
//             var cart = req.session.cart;
//             var newItem = true;

//             for (var i = 0; i < cart.length; i++) {
//                 if (cart[i].title == slug) {
//                     cart[i].qty++;
//                     newItem = false;
//                     break;
//                 }
//             }

//             if (newItem) {
//                 cart.push({
//                     title: slug,
//                     qty: 1,
//                     price: parseFloat(p.price).toFixed(2),
//                     image: '/product_images/' + p._id + '/' + p.image
//                 });
//             }
//         }

// //        console.log(req.session.cart);
//         req.flash('success', 'Product added!');
//         res.redirect('back');

        const idUser = '6182bfd277e0be518092cc12'
        const user = await User.findById(idUser);
        const product = { '_id': p._id, 'quantity': 1};
        user.cart.push(product);
        await user.save();

        req.flash('success', 'Product added!');
        res.redirect('back');
    });

});

/*
 * GET checkout page
 */
router.get('/checkout', async function (req, res) {

    // if (req.session.cart && req.session.cart.length == 0) {
    //     delete req.session.cart;
    //     res.redirect('/cart/checkout');
    // } else {
    //     res.render('checkout', {
    //         title: 'Checkout',
    //         cart: req.session.cart
    //     });
    // }

    const idUser = '6182bfd277e0be518092cc12'
    const user = await User.findById(idUser);

    products = []
    for(let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        products.push(product);
    }

    console.log(products);

    res.render('checkout', {
        title: 'Checkout',
        cart: products
    });
});

/*
 * GET update product
 */
router.get('/update/:product', async function (req, res) {
    const idUser = '6182bfd277e0be518092cc12'
    const user = await User.findById(idUser);

    var slug = req.params.product;
    console.log(slug);
    var cart = [];
    for (let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        cart.push(product);
    }
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        console.log(cart[i].slug, slug);
        if (cart[i].slug == slug) {
            switch (action) {
                case "add":
                    (user.cart)[i].quantity++;
                    console.log(cart[i]);
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
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', async function (req, res) {
    const idUser = '6182bfd277e0be518092cc12'
    const user = await User.findById(idUser);

    user.cart = [];
    await user.save();
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

/*
 * GET buy now
 */
router.get('/buynow', async function (req, res) {
    const idUser = '6182bfd277e0be518092cc12'
    const user = await User.findById(idUser);

    user.cart = [];
    await user.save();
    
    res.sendStatus(200);

});

// Exports
module.exports = router;



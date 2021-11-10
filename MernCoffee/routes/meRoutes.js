var express = require('express');
var router = express.Router();

// Get Product model
const User = require('../models/userModel');

/*
 * GET profile
 */
router.get('/', async function (req, res) {
  const idUser = '6182bfd277e0be518092cc12'
  const user = await User.findById(idUser);

  user.password = undefined;
  user.role = undefined;
  user.__v = undefined;
  user.cart = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
});

/*
 * PATCH profile
*/
router.patch('/', async function (req, res) {
  const idUser = '6182bfd277e0be518092cc12';
  const user = await User.findByIdAndUpdate(idUser, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

/*
 * DELETE account
*/
router.delete('/', async function (req, res) {
  const idUser = '6182bfd277e0be518092cc12';
  const user = await User.findByIdAndDelete(idUser);

  res.status(204).json({
    status: 'success',
    data: null
  });
});


// /*
//  * GET checkout page
//  */
// router.get('/checkout', async function (req, res) {

//   // if (req.session.cart && req.session.cart.length == 0) {
//   //     delete req.session.cart;
//   //     res.redirect('/cart/checkout');
//   // } else {
//   //     res.render('checkout', {
//   //         title: 'Checkout',
//   //         cart: req.session.cart
//   //     });
//   // }

//   const idUser = '6182bfd277e0be518092cc12'
//   const user = await User.findById(idUser);

//   products = []
//   for (let i = 0; i < user.cart.length; i++) {
//     let product = await Product.findById(user.cart[i]._id);
//     product['quantity'] = user.cart[i].quantity;
//     products.push(product);
//   }

//   console.log(products);

//   res.render('checkout', {
//     title: 'Checkout',
//     cart: products
//   });
// });

// /*
//  * GET update product
//  */
// router.get('/update/:product', async function (req, res) {
//   const idUser = '6182bfd277e0be518092cc12'
//   const user = await User.findById(idUser);

//   var slug = req.params.product;
//   console.log(slug);
//   var cart = [];
//   for (let i = 0; i < user.cart.length; i++) {
//     let product = await Product.findById(user.cart[i]._id);
//     product['quantity'] = user.cart[i].quantity;
//     cart.push(product);
//   }
//   var action = req.query.action;

//   for (var i = 0; i < cart.length; i++) {
//     console.log(cart[i].slug, slug);
//     if (cart[i].slug == slug) {
//       switch (action) {
//         case "add":
//           (user.cart)[i].quantity++;
//           console.log(cart[i]);
//           break;
//         case "remove":
//           (user.cart)[i].quantity--;
//           if ((user.cart)[i].quantity < 1)
//             user.cart.splice(i, 1);
//           break;
//         case "clear":
//           user.cart.splice(i, 1);
//           if (user.cart.length == 0)
//             user.cart = [];
//           break;
//         default:
//           console.log('update problem');
//           break;
//       }
//       break;
//     }
//   }

//   // user.cart = cart;
//   await user.save();

//   req.flash('success', 'Cart updated!');
//   res.redirect('/cart/checkout');

// });

// /*
//  * GET clear cart
//  */
// router.get('/clear', async function (req, res) {
//   const idUser = '6182bfd277e0be518092cc12'
//   const user = await User.findById(idUser);

//   user.cart = [];
//   await user.save();

//   req.flash('success', 'Cart cleared!');
//   res.redirect('/cart/checkout');

// });

// /*
//  * GET buy now
//  */
// router.get('/buynow', async function (req, res) {
//   const idUser = '6182bfd277e0be518092cc12'
//   const user = await User.findById(idUser);

//   user.cart = [];
//   await user.save();

//   res.sendStatus(200);

// });

// Exports
module.exports = router;



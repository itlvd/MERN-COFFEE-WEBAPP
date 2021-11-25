const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/', async function (req, res, next) {
  const bills = await Bill.find({status: 'completed'});

  // let income = {};
  // for (let it = 0; it < bills.length; it++) {
  //   let bill = bills[it];

  //   for (let p = 0; p < bill.products.length; p++) {
  //     let product = bill.products[p];
      
  //     if (!income[product._id])
  //       income[product._id] = {price: product.price, quantity: product.quantity };
  //     else
  //       income[product._id] = { price: product.price, quantity: income[product._id].quantity + 1 };
  //   }
  // }

  // let total = 0;
  // let keys = Object.keys(income);
  // for (let i = 0; i < keys.length; i++) {
  //   total += income[keys[i]].quantity * income[keys[i]].price;
  // }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     income,
  //     total
  //   }
  // });


























  // let allProducts = {};

  // for (let it = 0; it < bills.length; it++) {
  //   let bill = bills[it];

  //   for (let p = 0; p < bill.products.length; p++) {
  //     let product = bill.products[p];

  //     if (!allProducts[product._id])
  //       allProducts[product._id] = { price: product.price, quantity: product.quantity };
  //     else
  //       allProducts[product._id] = { price: product.price, quantity: allProducts[product._id].quantity + 1 };
  //   }
  // }

  // let total = 0;
  // let keys = Object.keys(allProducts);
  // for (let i = 0; i < keys.length; i++) {
  //   total += allProducts[keys[i]].quantity * allProducts[keys[i]].price;
  // }

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     allProducts,
  //     total
  //   }
  // });









  // let bill = {};
  // let total = 0;
  // bill.userId = user._id;
  // bill.products = [];

  // for (let i = 0; i < cart.length; i++) {
  //   let temp = await Product.findById(cart[i]._id);

  //   let product = {};
  //   product._id = temp._id;
  //   product.title = temp.title;
  //   product.slug = temp.slug;
  //   product.desc = temp.desc;
  //   product.category = temp.category;
  //   product.price = temp.price;
  //   product.image = temp.image;
  //   product.quantity = cart[i].quantity;
  //   total += cart[i].quantity * temp.price;

  //   bill.products.push(product);
  // }

  // bill.total = total;
  // bill.address = '';
  // bill.phone = '';

  // bill = await Bill.create(bill);

  // user.cart = [];
  // await user.save();

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     bill
  //   }
  // });
});

module.exports = router;

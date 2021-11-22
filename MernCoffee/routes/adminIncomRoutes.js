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

  let income = {};
  for (let it = 0; it < bills.length; it++) {
    let bill = bills[it];

    for (let p = 0; p < bill.products.length; p++) {
      let product = bill.products[p];
      
      if (!income[product._id])
        income[product._id] = {price: product.price, quantity: product.quantity };
      else
        income[product._id] = { price: product.price, quantity: income[product._id].quantity + 1 };
    }
  }

  let total = 0;
  let keys = Object.keys(income);
  for (let i = 0; i < keys.length; i++) {
    total += income[keys[i]].quantity * income[keys[i]].price;
  }

  res.status(200).json({
    status: 'success',
    data: {
      income,
      total
    }
  });
});

module.exports = router;

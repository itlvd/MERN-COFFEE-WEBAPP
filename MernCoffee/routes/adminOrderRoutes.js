const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();

const Bill = require('../models/billModel');

router.get('/', async function(req, res, next) {
  const bills = await Bill.find();
  res.status(200).json({
    status: 'success',
    result: bills.length,
    data: {
      bills
    }
  });
})

router.get('/:id/:status', async function (req, res) {
  const updatedBill = await Bill.findByIdAndUpdate(req.params.id, {status: req.params.status}, {
    new: true,
    runValidators: true,
  });

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     bill: updatedBill
  //   }
  // });

  res.redirect('/admin/orders');
});

module.exports = router;
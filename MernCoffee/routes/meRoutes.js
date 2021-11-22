var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

// Get Product model
const User = require('../models/userModel');

/*
 * GET profile
 */
router.get('/', isUser, async function (req, res) {
  const user = req.user;
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
 * POST profile
*/
router.post('/', isUser, async function (req, res) {
  const user = await User.findByIdAndUpdate(req.user, req.body, {
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
router.delete('/', isUser, async function (req, res) {
  const user = await User.findByIdAndDelete(req.user);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = router;

const express = require('express');
const auth = require('../config/auth');
const isEmployee = auth.isEmployee;
const isAdmin = auth.isAdmin;
const isUser = auth.isUser;
const hasLogin = auth.hasLogin;

const router = express.Router();
const billController = require('../component/bill/billController');

router.get('/', isUser, billController.getAllBills);

router.get('/:id', isUser, billController.getBillByUser);

module.exports = router;

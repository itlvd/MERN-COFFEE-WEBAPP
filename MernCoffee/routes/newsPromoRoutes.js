var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

const Promotion = require('../models/promotionModel');
// const News = require('../models/newsModel');


/*
 * GET all products
 */
router.get('/', (req, res) => {
    res.render("news_promotion", {
        title: "News Promotion"
    })
});

// Exports
module.exports = router;

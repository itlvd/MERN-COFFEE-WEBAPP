var express = require('express');
var router = express.Router();

const productController = require('../controllers/productController');
const commentController = require('../component/comment/commentController');

// GET all products
router.get('/', productController.getAllProducts);

// GET products by category
router.get('/:category', productController.getCategory);

// GET product details
router.get('/:category/:product', productController.getProduct);
router.post('/:category/:productSlug/comment', commentController.postComment)

module.exports = router;

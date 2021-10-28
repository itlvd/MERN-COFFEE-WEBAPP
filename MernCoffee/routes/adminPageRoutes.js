const express = require('express');
const router = express.Router();



/**
 * get admin page index
 */
router.get('/', (req, res) => {
    res.render('admin/pages');
    
});



module.exports = router;
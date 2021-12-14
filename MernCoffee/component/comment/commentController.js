const commentService = require('./commentService');
const userService = require('../userComponent/userService');

exports.postComment = async (req, res) => {
    const category = req.body.productcate;
    const proSlug = req.body.productslug;
    const proId = req.body.productid;
    const content = req.body.comment;
    if (!req.user) {
        res.redirect(`/users/login?redirect=products/${category}/${proSlug}`);
    }
    else {
        const comment = await commentService.createNewComment(req.user, proId, content);
        res.redirect(`/products/${category}/${proSlug}`);
    }
}
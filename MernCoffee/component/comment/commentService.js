const Comment = require('../../models/commentModel');


exports.createNewComment = async (user, productId, content) => {
    return await new Comment({
        userId: user._id,
        productId: productId,
        userImage: user.image,
        userName: user.username,
        content: content,
        createAt: new Date(),
    }).save()
}

exports.getAllCommentOfProduct = async (productId) => {
    const comments = await Comment.find({productId: productId});
    return comments;
}
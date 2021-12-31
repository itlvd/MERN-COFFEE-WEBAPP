const Comment = require('../../models/commentModel');
const userService = require('../../component/userComponent/userService')

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

    for(i=0;i<comments.length;i++){
        const user = await userService.findById(comments[i].userId);
        if (user) {
            comments[i].userName = user.username;
            comments[i].userImage = user.image;
        }
    };
    return comments;
}
const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.ObjectId,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    userName: {
        type: String,
        default: "anonymous"
    },
    userImage: {
        type: String,
        default: '/img/avatar.jpg',
      },
    createdAt: {
      type: Date,
      default: new Date()
    },
    content: {
        type: String,
        require: true,
    },
   
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  module.exports = Comment;
  
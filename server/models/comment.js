const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: [true, "Please provide article id"],
  },
  userId: {
    type: String,
    required: [true, "Please provide user id"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: [String],
  },
  dislikes: {
    type: [String],
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

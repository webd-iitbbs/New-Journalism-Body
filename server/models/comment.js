const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: [true, "Please provide article id"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

commentSchema.index({ articleId: 1, date: -1 });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

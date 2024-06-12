const Comment = require("../models/comment");
const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for comments
// Create a comment - createComment
// Get all comments by articleId - getAllCommentsByArticleId
// Block a comment - blockComment
// Like or dislike a comment - likeOrDislikeComment

exports.createComment = catchAsync(async (req, res) => {
  const { articleId, content, userId } = req.body;
  if (!articleId || !content || !userId) {
    return next(
      new AppError("Please provide articleId, content and userId", 400)
    );
  }
  const comment = await Comment.create({ articleId, content, userId });
  return res.status(201).json({ comment });
});

exports.getAllCommentsByArticleId = catchAsync(async (req, res) => {
  const { articleId } = req.body;
  const comments = await Comment.find({ articleId, isBlocked: false });
  return res.status(200).json({ comments });
});

exports.blockComment = catchAsync(async (req, res, next) => {
  // check if user is an admin
  const { commentId } = req.body;
  if (!commentId) {
    return next(new AppError("Please provide commentId", 400));
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { isBlocked: true },
    { new: true }
  );
  return res.status(200).json({ message: "Comment blocked", comment });
});

exports.likeOrDislikeComment = catchAsync(async (req, res, next) => {
  const { commentId, userId, like } = req.body;
  if (!commentId || !userId || like === undefined) {
    return next(new AppError("Please provide commentId, userId and like", 400));
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (like) {
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
    } else {
      comment.likes = comment.likes.filter((id) => id !== userId);
    }
  } else {
    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
    }
  }
  await comment.save();
  return res.status(200).json({ comment });
});

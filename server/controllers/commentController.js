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
  const userId = req.user._id;
  const { articleId, content } = req.body;
  if (!articleId || !content || !userId) {
    return next(
      new AppError("Please provide articleId, content and userId", 400)
    );
  }
  const comment = await Comment.create({ articleId, content, userId });

  const populatedComment = await Comment.findById(comment._id).populate({
    path: "userId", // Field to populate
    select: "name email profileImage", // Select fields to include from the User model
  });
  return res.status(201).json({ comment: populatedComment });
});

exports.getAllCommentsByArticleId = catchAsync(async (req, res) => {
  const { articleId } = req.query;
  const comments = await Comment.find({ articleId, isBlocked: false })
    .populate("userId", "name email profileImage")
    .sort({ date: -1 });
  return res.status(200).json({ comments });
});

exports.blockComment = catchAsync(async (req, res, next) => {
  // check if user is an admin
  const { commentId } = req.body;
  if (!commentId) {
    return next(new AppError("Please provide commentId", 400));
  }

  const comment = await Comment.findByIdAndUpdate(commentId, {
    isBlocked: true,
  });
  return res.status(200).json({ message: "Comment blocked", comment });
});

exports.likeOrDislikeComment = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { commentId, like } = req.body;

  if (!commentId || !userId || like === undefined) {
    return next(
      new AppError("Please provide commentId, userId, and like", 400)
    );
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  // Update like/dislike arrays
  if (like === "like") {
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
    }
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else if (like === "dislike") {
    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
    }
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    return next(
      new AppError("Invalid like value, it should be true or false", 400)
    );
  }
  await comment.save();
  return res.status(200).json({ comment });
});

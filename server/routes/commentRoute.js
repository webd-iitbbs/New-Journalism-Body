const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/commentController");
const AdminController = require("../controllers/adminController");
const AuthController = require("../controllers/authController");

router
  .route("/")
  .get(CommentController.getAllCommentsByArticleId)
  .post(AuthController.protect, CommentController.createComment);

router
  .route("/admin")
  .post(AdminController.checkIfAdminMiddleware, CommentController.blockComment);

router
  .route("/like-dislike")
  .patch(AuthController.protect, CommentController.likeOrDislikeComment);

module.exports = router;

const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/commentController");
const AdminController = require("../controllers/adminController");

router
  .route("/")
  .get(CommentController.getAllCommentsByArticleId)
  .post(CommentController.createComment);

router
  .route("/admin")
  .post(AdminController.checkIfAdminMiddleware, CommentController.blockComment);

router.route("/like-dislike").patch(CommentController.likeOrDislikeComment);

module.exports = router;

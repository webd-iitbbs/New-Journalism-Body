const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/articleController");
const AdminController = require("../controllers/adminController");

// Route to get all published articles
router.route("/published").get(ArticleController.getPublishArticles);

// Routes for admin actions on articles
router
  .route("/admin")
  .get(AdminController.checkIfAdminMiddleware, ArticleController.getAllArticles)
  .post(
    AdminController.checkIfAdminMiddleware,
    ArticleController.createArticle
  );

// Route to check slug availability
router.route("/slug-availability").get(ArticleController.checkSlugAvailability);

// Route to update slug of an article
router
  .route("/admin/update-slug")
  .patch(AdminController.checkIfAdminMiddleware, ArticleController.changeSlug);

// Route to update the status of an article
router
  .route("/admin/update-status")
  .patch(
    AdminController.checkIfAdminMiddleware,
    ArticleController.updateStatus
  );

// search articles
router.route("/search").get(ArticleController.searchArticles);

router.route("/:slug/upvote").post(ArticleController.upvoteArticle);

// Routes for specific article operations
router
  .route("/:slug")
  .get(ArticleController.getArticle)
  .patch(
    AdminController.checkIfAdminMiddleware,
    ArticleController.updateArticle
  );

module.exports = router;

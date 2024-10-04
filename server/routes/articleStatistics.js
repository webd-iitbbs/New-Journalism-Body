const express = require("express");
const router = express.Router();

const ArticleStatisticsController = require("../controllers/articleStatisticsController");

// Route to get all published articles
router.route("/published").get(ArticleStatisticsController.getPublishArticles);

// Route to get latest articles
router.route("/recent").get(ArticleStatisticsController.getRecentArticles);

// Route to get most read articles
router.route("/most-read").get(ArticleStatisticsController.getMostReadArticles);

// Route to get trending articles
router.route("/trending").get(ArticleStatisticsController.getTrendingArticles);

// Route to search articles
router.route("/search").get(ArticleStatisticsController.searchArticles);

module.exports = router;

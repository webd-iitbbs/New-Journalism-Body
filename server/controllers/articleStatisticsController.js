const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get all articles
// Most recent articles
// Most read articles
// Trending articles
// Search articles

// Get all published articles
exports.getPublishArticles = catchAsync(async (req, res) => {
  const articles = await Article.find({ status: "published" });
  return res.status(200).json({ articles });
});

// Most recent articles
exports.getRecentArticles = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const articles = await Article.find({ status: "published" })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({ articles });
});

// Most read articles

exports.getMostReadArticles = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const articles = await Article.find({ status: "published" })
    .sort({ views: -1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({ articles });
});

// Trending articles
exports.getTrendingArticles = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const articles = await Article.aggregate([
    { $match: { status: "published" } },
    { $addFields: { upvotesLength: { $size: { $ifNull: ["$upVotes", []] } } } },
    { $sort: { upvotesLength: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return res.status(200).json({ articles });
});

// search by category
exports.getCategoryArticles = catchAsync(async (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const articles = await Article.find({ category, status: "published" })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({ articles });
});

// Search articles
exports.searchArticles = catchAsync(async (req, res) => {
  const { query } = req.query;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  if (!query) return next(new AppError("Please provide a search query", 400));

  // Split the query into individual words
  const searchTerms = query.split("+").filter((term) => term.trim() !== "");

  // Create an array of regex conditions for each term
  const regexConditions = searchTerms.map((term) => ({
    $or: [
      { title: { $regex: term, $options: "i" } },
      { content: { $regex: term, $options: "i" } },
      { tags: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
    ],
  }));

  // Use $and to combine the conditions
  const articles = await Article.find({
    $or: regexConditions,
    status: "published",
  })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
});

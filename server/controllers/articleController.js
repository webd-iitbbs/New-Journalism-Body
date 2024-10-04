const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for articles
// Create an article - createArticle
// Get all articles - getAllArticles
// Get latest articles - getPublishArticles
// Get all published articles - getPublishArticles
// Get an article - getArticle
// Change status of an article - updateStatus
// Change slug of an article - changeSlug
// Update an article - updateArticle
// Check if slug is available - checkSlugAvailability
// Search articles - searchArticles
// upvote an article - upvoteArticle

async function checkSlugAvailability(slug) {
  const article = await Article.find({ slug });
  return article.length === 0;
}

exports.createArticle = catchAsync(async (req, res, next) => {
  let { title, content, slug, category, coverImage, tags, date } = req.body;
  if (slug) slug = slug.toLowerCase().split(" ").join("-");
  if (!slug) slug = title.toLowerCase().split(" ").join("-");

  if (!(await checkSlugAvailability(slug))) {
    console.log("Slug already exists");
    return next(new AppError("Slug already exists", 400));
  }
  if (!date) date = new Date();
  const article = await Article.create({
    slug,
    title,
    content,
    category,
    coverImage,
    tags,
    date,
    addedOrUpdatedBy: [
      {
        userId: req.user._id,
        date: new Date(),
        modification: "added",
      },
    ],
  });
  return res.status(201).json({ article });
});

exports.getAllArticles = catchAsync(async (req, res) => {
  const articles = await Article.find().select("+addedOrUpdatedBy").populate({
    path: "addedOrUpdatedBy.userId",
    model: "User",
    select: "name email",
  });
  return res.status(200).json({ articles });
});

exports.getRecentArticles = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req?.query?.limit) : 5;
  const articles = await Article.find().sort({ date: -1 }).limit(limit);
  return res.status(200).json({ articles });
});

exports.getPublishArticles = catchAsync(async (req, res) => {
  const articles = await Article.find({ status: "published" });
  return res.status(200).json({ articles });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const article = await Article.findOne({ slug, status: "published" });
  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  return res.status(200).json({ article });
});

exports.getArticleAdmin = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const article = await Article.findOne({ slug });
  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  return res.status(200).json({ article });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { slug, status } = req.body;
  const article = await Article.findOneAndUpdate(
    { slug },
    {
      status,
      $push: {
        addedOrUpdatedBy: {
          userId: req.user._id,
          date: new Date(),
          modification: "status updated",
        },
      },
    },
    { new: true }
  );
  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  return res.status(200).json({ article });
});

exports.checkSlugAvailability = catchAsync(async (req, res) => {
  const { slug } = req.query;
  console.log(slug);
  const article = await Article.find({ slug });
  if (article.length > 0) {
    return res.status(200).json({ available: false });
  }
  return res.status(200).json({ available: true });
});

exports.changeSlug = catchAsync(async (req, res, next) => {
  let { slug, newSlug } = req.body;

  if (!(await checkSlugAvailability(newSlug))) {
    return next(new AppError("Slug already exists", 400));
  }

  const article = await Article.findOne({ slug }).select("+addedOrUpdatedBy");
  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  newSlug = newSlug.toLowerCase().split(" ").join("-");
  article.slug = newSlug;

  article.addedOrUpdatedBy.push({
    userId: req.user._id,
    date: new Date(),
    modification: "slug updated",
  });

  await article.save();
  return res.status(200).json({ article });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { title, content, category, coverImage, tags, date } = req.body;
  const article = await Article.findOne({ slug }).select("+addedOrUpdatedBy");

  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  if (
    req.body?.slug &&
    slug != req.body.slug &&
    !(await checkSlugAvailability(req.body?.slug))
  ) {
    console.log("Slug already exists");
    return next(new AppError("Slug already exists", 400));
  }
  if (req.body?.slug) article.slug = req.body.slug;
  if (title) article.title = title;
  if (content) article.content = content;
  if (category) article.category = category;
  if (coverImage) article.coverImage = coverImage;
  if (tags && tags.length > 0) article.tags = tags;
  if (date) article.date = date;

  article.addedOrUpdatedBy.push({
    userId: req.user._id,
    date: new Date(),
    modification: "updated",
  });

  await article.save();
  return res
    .status(200)
    .json({ message: "updated successfully", article: article });
});

exports.searchArticles = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return next(new AppError("Please provide a search query", 400));

  // Split the query into individual words
  const searchTerms = query.split("+").filter((term) => term.trim() !== "");

  // Create an array of regex conditions for each term
  const regexConditions = searchTerms.map((term) => ({
    $or: [
      { title: { $regex: term, $options: "i" } },
      { content: { $regex: term, $options: "i" } },
      { tags: { $regex: term, $options: "i" } },
    ],
  }));

  // Use $and to combine the conditions
  const articles = await Article.find({
    $or: regexConditions,
    status: "published",
  });

  return res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
});
exports.upvoteArticle = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const userId = req.user._id;

  // Find the article by its slug
  const article = await Article.findOne({ slug });

  // If the article is not found, return an error
  if (!article) {
    return next(new AppError("Article not found", 404));
  }

  // Ensure upVotes array exists
  if (!article.upVotes) {
    article.upVotes = [];
  }

  // Check if the user has already upvoted the article
  const userUpvoted = article.upVotes.some((id) => id.equals(userId));

  // Toggle the upvote status
  if (userUpvoted) {
    article.upVotes = article.upVotes.filter((id) => !id.equals(userId));
  } else {
    article.upVotes.push(userId);
  }

  // Save the updated article
  await article.save();

  // Return a success message along with the updated article
  return res.status(200).json({
    status: "success",
    message: userUpvoted
      ? "Upvote removed successfully"
      : "Article upvoted successfully",
    data: {
      article,
      upVotes: article.upVotes.length, // Optionally return the number of upvotes
    },
  });
});

exports.incrementViews = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const article = await Article.findOne({ slug });

  if (!article) {
    return next(new AppError("Article not found", 404));
  }

  article.views += 1;

  await article.save();

  return res.status(200).json({
    status: "success",
    message: "Views incremented successfully",
    data: {
      article,
    },
  });
});

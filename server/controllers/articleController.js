const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for articles
// Create an article - createArticle
// Get all articles - getAllArticles
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
  let { title, content, slug, category, coverImage, tags } = req.body;
  if (slug) slug = slug.toLowerCase().split(" ").join("-");
  if (!slug) slug = title.toLowerCase().split(" ").join("-");

  if (!(await checkSlugAvailability(slug))) {
    console.log("Slug already exists");
    return next(new AppError("Slug already exists", 400));
  }

  const AllArticles = await Article.find();
  const article = await Article.create({
    articleId: AllArticles.length + 1,
    slug,
    title,
    content,
    category,
    coverImage,
    tags,
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
  const articles = await Article.find();
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
  const { slug } = req.body;
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
  const { title, content, category, coverImage, tags } = req.body;
  const article = await Article.findOne({ slug }).select("+addedOrUpdatedBy");

  if (!article) {
    return next(new AppError("Article not found", 404));
  }

  if (title) article.title = title;
  if (content) article.content = content;
  if (category) article.category = category;
  if (coverImage) article.coverImage = coverImage;
  if (tags && tags.length > 0) article.tags = tags;

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
    $and: regexConditions,
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
  const { userId } = req.body;

  // Find the article by its slug
  const article = await Article.findOne({ slug });

  // If the article is not found, return an error
  if (!article) {
    return next(new AppError("Article not found", 404));
  }

  // Check if the user has already upvoted the article
  const userUpvoted = article.upVotes.includes(userId);
  console.log(userUpvoted);

  // Toggle the upvote status
  if (userUpvoted) {
    article.upVotes = article.upVotes.filter((id) => {
      console.log(id, userId);
      return id !== userId;
    });
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
    },
  });
});

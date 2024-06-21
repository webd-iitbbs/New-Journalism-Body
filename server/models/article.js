const mongoose = require("mongoose");

const addedOrUpdatedBySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  modification: {
    type: String,
    default: "added",
  },
});

const articleSchema = new mongoose.Schema({
  articleId: {
    type: Number,
  },
  slug: {
    // slug is a URL friendly version of the article name
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please provide name"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
  },
  coverImage: {
    type: String,
    required: [true, "Please provide cover image"],
  },
  tags: {
    type: [String],
    index: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived", "deleted"],
    default: "draft",
  },
  upVotes: {
    type: [String],
  },
  addedOrUpdatedBy: {
    type: [addedOrUpdatedBySchema],
    select: false,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;

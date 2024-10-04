const mongoose = require("mongoose");

const addedOrUpdatedBySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived", "deleted"],
    default: "draft",
  },
  upVotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  addedOrUpdatedBy: {
    type: [addedOrUpdatedBySchema],
    select: false,
  },
  views: {
    type: Number,
    default: 0,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

articleSchema.index({ date: -1 }); // Optimizes queries sorting by date
articleSchema.index({ status: 1, date: -1 }); // Compound index for status and date queries
articleSchema.index({ title: "text", content: "text", tags: "text" }); // Full-text search index

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;

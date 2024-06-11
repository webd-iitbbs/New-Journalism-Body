const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: [true, "Please provide id"],
  },
  slug: {
    // slug is a URL friendly version of the article name
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

articleSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;

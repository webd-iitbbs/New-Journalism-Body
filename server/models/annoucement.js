const mongoose = require("mongoose");

const annoucementSchema = new mongoose.Schema({
  annoucementId: {
    type: Number,
    required: [true, "Please provide id"],
  },
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  coverImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

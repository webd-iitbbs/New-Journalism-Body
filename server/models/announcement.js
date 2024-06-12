const mongoose = require("mongoose");

const annoucementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  content: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Announcement = mongoose.model("Announcement", annoucementSchema);
module.exports = Announcement;

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
  addedOrUpdatedBy: {
    type: [addedOrUpdatedBySchema],
    select: false,
  },
});

annoucementSchema.index({ date: -1 });

const Announcement = mongoose.model("Announcement", annoucementSchema);
module.exports = Announcement;

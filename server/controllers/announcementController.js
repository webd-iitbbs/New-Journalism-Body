const Announcement = require("../models/announcement");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD OPERATIONS
// GET ALL ANNOUNCEMENTS -getAnnouncements
// GET RECENT ANNOUNCEMENTS - getRecentAnnouncements
// CREATE ANNOUNCEMENT - createAnnouncement
// UPDATE ANNOUNCEMENT - updateAnnouncement
// DELETE ANNOUNCEMENT - deleteAnnouncement

exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const { deleted } = req.query;

  const query = deleted === "false" ? { deleted: false } : {};
  const announcements = await Announcement.find(query);
  res.status(200).json({
    status: "success",
    data: {
      announcements,
    },
    length: announcements.length,
  });
});

exports.getRecentAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find({ deleted: false })
    .sort({ createdAt: -1 })
    .limit(5);
  res.status(200).json({
    status: "success",
    data: {
      announcements,
    },
    length: announcements.length,
  });
});

exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const { title, link, content } = req.body;

  const announcement = await Announcement.create({
    title,
    link,
    content,
    addedOrUpdatedBy: [
      {
        userId: req.user._id,
        date: new Date(),
        modification: "added",
      },
    ],
  });
  res.status(201).json({
    status: "success",
    data: {
      announcement,
    },
  });
});

exports.updateAnnouncement = catchAsync(async (req, res, next) => {
  const { title, link, content } = req.body;
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    {
      title,
      link,
      content,
      $push: {
        addedOrUpdatedBy: {
          userId: req.user._id,
          date: new Date(),
          modification: "updated",
        },
      },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      announcement,
    },
  });
});

exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id).select(
    "+addedOrUpdatedBy"
  );
  if (!announcement)
    return next(new AppError("No announcement found with that ID", 404));
  console.log(announcement);
  announcement.deleted = true;
  announcement.addedOrUpdatedBy.push({
    userId: req.user._id,
    date: new Date(),
    modification: "deleted",
  });
  await announcement.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

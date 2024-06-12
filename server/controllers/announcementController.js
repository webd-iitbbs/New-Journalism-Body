const Announcement = require("../models/announcement");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD OPERATIONS
// GET ALL ANNOUNCEMENTS -getAnnouncements
// CREATE ANNOUNCEMENT - createAnnouncement
// UPDATE ANNOUNCEMENT - updateAnnouncement
// DELETE ANNOUNCEMENT - deleteAnnouncement

exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find({ deleted: false });
  res.status(200).json({
    status: "success",
    data: {
      announcements,
    },
    length: announcements.length,
  });
});

exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const { title, coverImage, content } = req.body;
  const announcement = await Announcement.create({
    title,
    coverImage,
    content,
  });
  res.status(201).json({
    status: "success",
    data: {
      announcement,
    },
  });
});

exports.updateAnnouncement = catchAsync(async (req, res, next) => {
  const { title, coverImage, content } = req.body;
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    {
      title,
      coverImage,
      content,
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
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement)
    return next(new AppError("No announcement found with that ID", 404));

  announcement.deleted = true;
  await announcement.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

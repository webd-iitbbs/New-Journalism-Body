const ContactUs = require("../models/contactUs");
const Admin = require("../models/admin");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for contact us
// Create a contact us - createContactUs
// Get all unresolved contact us - getAllUnresolvedContactUs
// Get all contact us - getAllContactUs
// Resolve a contact us - resolveContactUs

exports.createContactUs = catchAsync(async (req, res) => {
  const { name, email, message } = req.body;
  const contact = await ContactUs.create({ name, email, message });
  return res.status(201).json({ contact });
});

exports.getAllUnresolvedContactUs = catchAsync(async (req, res) => {
  const contacts = await ContactUs.find({ resolved: false });
  return res.status(200).json({ contacts });
});

exports.getAllContactUs = catchAsync(async (req, res) => {
  const contacts = await ContactUs.find();
  return res.status(200).json({ contacts });
});

exports.resolveContactUs = catchAsync(async (req, res, next) => {
  const { contactId } = req.body;
  if (!contactId) {
    return next(new AppError("Please provide contactId", 400));
  }
  const contact = await ContactUs.findByIdAndUpdate(contactId, {
    resolved: true,
  });
  return res.status(200).json({ message: "Contact resolved", contact });
});

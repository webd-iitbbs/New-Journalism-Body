const Admin = require("../models/admin");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for admins
// Check if user is an admin - checkIfAdmin
// Check if user is an admin middleware - checkIfAdminMiddleware
// Add an admin - addAdmin

exports.checkIfAdminMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized, token missing", 401));
  }

  const token = authHeader.split(" ")[1];
  const user = await User.findById(token);

  if (!user) return next(new AppError("User not found", 404));

  const admin = await Admin.findOne({ email: user.email });
  if (!admin) {
    return next(new AppError("You are not authorized", 401));
  }
  req.user = user;
  next();
});

exports.checkIfAdmin = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized, token missing", 401));
  }

  const token = authHeader.split(" ")[1];
  const user = await User.findById(token);

  if (!user) return next(new AppError("User not found", 404));

  const admin = await Admin.findOne({ email: user.email });
  if (!admin) {
    return next(new AppError("You are not authorized", 401));
  }
  return res.status(200).json({ message: "You are authorized", admin: true });
});

exports.addAdmin = catchAsync(async (req, res, next) => {
  // email of the user to be made an admin
  // userId of the user making the request

  const { email } = req.body;

  const admin = await Admin.create({ email, madeBy: req.user.email });
  return res.status(201).json({ admin });
});

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find();
  return res.status(200).json({ admins });
});

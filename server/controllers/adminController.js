const Admin = require("../models/admin");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CRUD operations for admins
// Check if user is an admin - checkIfAdmin
// Check if user is an admin middleware - checkIfAdminMiddleware
// Add an admin - addAdmin

exports.checkIfAdminMiddleware = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(new AppError("You are not authorized", 401));
  }
  next();
});

exports.checkIfAdmin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return next(new AppError("You are not authorized", 401));
  }
  return res.status(200).json({ message: "You are authorized" });
});

exports.addAdmin = catchAsync(async (req, res, next) => {
  // email of the user to be made an admin
  // userId of the user making the request

  const { email, userId } = req.body;
  // check if user is already an admin
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const ifuserisAdmin = await Admin.findOne({ email: user.email });
  if (!ifuserisAdmin) return next(new AppError("You are not authorized", 401));

  const admin = await Admin.create({ email, madeBy: user.email });
  return res.status(201).json({ admin });
});

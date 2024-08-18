const Admin = require("../models/admin");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const AuthController = require("./authController");
// CRUD operations for admins
// Check if user is an admin - checkIfAdmin
// Check if user is an admin middleware - checkIfAdminMiddleware
// Add an admin - addAdmin

exports.checkIfAdminMiddleware = [
  AuthController.protect, // check if user is logged in
  catchAsync(async (req, res, next) => {
    const user = req.user;

    if (!user) return next(new AppError("User not found", 404));

    const admin = await Admin.findOne({ email: user.email.toLowerCase() });
    if (!admin) {
      return next(new AppError("You are not authorized", 401));
    }
    req.user = user;
    console.log("User is an admin", user);
    next();
  }),
];

exports.checkIfAdmin = [
  AuthController.protect, // check if user is logged in
  catchAsync(async (req, res, next) => {
    const user = req.user;

    if (!user) return next(new AppError("User not found", 404));

    const admin = await Admin.findOne({ email: user?.email.toLowerCase() });
    if (!admin) {
      return next(new AppError("You are not authorized", 401));
    }
    return res.status(200).json({ message: "You are authorized", admin: true });
  }),
];

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

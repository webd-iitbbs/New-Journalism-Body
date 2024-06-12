const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendmail = require("../utils/nodemailer");

// CRUD operations for users
// Google login/signup - googleLoginSignup
// Signup - signup
// Login - login
// Get a user - getUser
// Update a user - updateUser
// Forgot password - forgotPassword
// Reset password - resetPassword

exports.googleLoginSignup = catchAsync(async (req, res, next) => {
  const { email, name, profileImage, access_token } = req.body;
  if (!email || !name) {
    return next(new AppError("Please provide email and name", 400));
  }

  // validate access_token google
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`
  );
  const data = await response.json();
  console.log(data);
  if (data.error) {
    return next(new AppError("Invalid access token", 400));
  }

  let user = await User.findOne({ email });
  if (!user) {
    password = email + "&" + process.env.GoogleAuthPassword;
    user = await User.create({ email, name, profileImage, password });
  } else {
    user.name = name;
    user.profileImage = profileImage;
    await user.save();
  }
  return res.status(200).json({ user });
});

exports.signup = catchAsync(async (req, res) => {
  const { email, password, name, profileImage } = req.body;
  if (!email || !password || !name) {
    return next(new AppError("Please provide email, password and name", 400));
  }
  const user = await User.create({ email, password, name, profileImage });
  return res.status(201).json({ user });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  return res.status(200).json({ message: "Login successful", user });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { name, profileImage } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (name) user.name = name;
  if (profileImage) user.profileImage = profileImage;

  await user.save();
  return res.status(200).json({ user });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  const resetToken = user.createpasswordresetpassword();
  await user.save({ validateBeforeSave: false });

  // send token to mail

  const message = `Forgot your password? Submit this ${resetToken} token with your new password.\nIf you didn't forget your password, please ignore this email!`;

  await sendmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    passwordresetexpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.passwordresetexpired = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Password reset successfully login with new password",
  });
});

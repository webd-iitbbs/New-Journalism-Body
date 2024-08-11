const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendmail = require("../utils/nodemailer");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// CRUD operations for users
// Google login/signup - googleLoginSignup
// Signup - signup
// Login - login
// Get a user - getUser
// Update a user - updateUser
// Forgot password - forgotPassword
// Reset password - resetPassword

exports.googleLoginSignup = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract user details
    const email = payload["email"];
    const name = payload["name"];
    const profileImage = payload["picture"];

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
  } catch (error) {
    console.error("Error with google login", error);
    return next(new AppError("Error with google login", 400));
  }
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

  const message = `
Dear User,

Did you forget your password? No worries! Simply submit the following code along with your new password to reset it:

Token: ${resetToken}

If you didn't request a password reset, please disregard this email.

Best regards,
Oracle Team
`;

  await sendmail({
    email: user.email,
    subject: "Your password reset code (valid for 10 min)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return next(new AppError("Please provide email, token and password", 400));
  }
  const user = await User.findOne({
    email,
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

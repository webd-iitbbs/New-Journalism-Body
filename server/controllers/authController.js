const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendmail = require("../utils/nodemailer");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  const Accesstoken = jwt.sign(id, process.env.ACCESS_JWT_SECRET, {
    expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
  });

  const Refreshtoken = jwt.sign(id, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  });

  console.log("AccessToken", Accesstoken);
  console.log("RefreshToken", Refreshtoken);
  return [Accesstoken, Refreshtoken];
};

const createSendToken = catchAsync(async (user, statusCode, res) => {
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  const [AccessToken, RefreshToken] = signToken({ id: user._id });
  // const cookieoptions = {
  //   expires: new Date(
  //     Date.now() +
  //       process.env.ACCESS_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   withCredentials: true,
  //   // httpOnly: true,
  //   // domain: ".github.io",
  //   // domain: "localhost",
  //   // path: "/winter_code_week_2/#/",
  //   path: "/",
  //   secure: true,
  //   sameSite: "None",
  //   httpOnly: false,
  // };
  // // if (process.env.NODE_ENV === "production") cookieoptions.secure = true;
  // // console.log(cookieoptions);
  // res.cookie("AccessToken", AccessToken, cookieoptions);
  // res.cookie("RefreshToken", RefreshToken, cookieoptions);
  console.log(AccessToken);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    AccessToken,
    RefreshToken,
    data: { user },
  });
});

exports.verifyRefreshToken = catchAsync(async (req, res, next) => {
  let RefreshToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    RefreshToken = req.headers.authorization.split(" ")[1];
  }
  if (!RefreshToken) {
    return next(new AppError("you are not logged in", 401));
  }
  console.log(RefreshToken, "refresh token");
  const decoded = await promisify(jwt.verify)(
    RefreshToken,
    process.env.REFRESH_JWT_SECRET
  );
  const currentUser = await User.findById(decoded.id).select("+password");
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does not exist", 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! please login again", 401)
    );
  }
  req.user = currentUser;
  createSendToken(currentUser, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // console.log("hello ");
  let AccessToken;
  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    AccessToken = req.headers.authorization.split(" ")[1];
  }
  if (!AccessToken) {
    return next(new AppError("you are not logged in", 401));
  }
  console.log(AccessToken, "access token");

  const decoded = await promisify(jwt.verify)(
    AccessToken,
    process.env.ACCESS_JWT_SECRET
  );

  const currentUser = await User.findById(decoded.id).select("+password");
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does not exist", 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! please login again", 401)
    );
  }
  req.user = currentUser;
  next();
});

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
    const email = payload["email"].toLowerCase();
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
    return createSendToken(user, 200, res);
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
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name,
    profileImage,
  });
  return createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  return createSendToken(user, 200, res);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return res.status(200).json({ user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, profileImage } = req.body;
  const user = req.user;
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

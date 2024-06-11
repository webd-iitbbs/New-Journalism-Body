const Admin = require("../models/admin");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

exports.checkIfAdmin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "You are not authorized" });
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
    return res.status(404).json({ message: "User not found" });
  }
  const ifuserisAdmin = await Admin.findOne({ email: user.email });
  if (!ifuserisAdmin) {
    return res
      .status(400)
      .json({ message: "You are not allowed to make an admin" });
  }

  const admin = await Admin.create({ email, madeBy: user.email });
  return res.status(201).json({ admin });
});

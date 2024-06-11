const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  madeBy: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

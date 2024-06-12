const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
  },
  message: {
    type: String,
    required: [true, "Please provide your message"],
  },
  resolved: {
    type: Boolean,
    default: false,
  },
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);
module.exports = ContactUs;

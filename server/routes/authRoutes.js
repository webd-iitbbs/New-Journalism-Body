const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

router.route("/login").post(AuthController.login);
router.route("/signup").post(AuthController.signup);
router.route("/google-login-signup").post(AuthController.googleLoginSignup);
router
  .route("/update-details/:userId")
  .patch(AuthController.protect, AuthController.updateUser);

router.route("/forgot-password").post(AuthController.forgotPassword);
router.route("/reset-password").patch(AuthController.resetPassword);

router.route("/:userId").get(AuthController.protect, AuthController.getUser);

module.exports = router;

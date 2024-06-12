const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");

router
  .route("/")
  .post(contactUsController.createContactUs)
  .get(contactUsController.getAllContactUs);

router.route("/unresolved").get(contactUsController.getAllUnresolvedContactUs);
router.route("/resolve").post(contactUsController.resolveContactUs);

module.exports = router;

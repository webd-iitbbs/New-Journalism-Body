const express = require("express");
const router = express.Router();
const contactUsController = require("../controllers/contactUsController");
const AdminController = require("../controllers/adminController");
router
  .route("/")
  .post(contactUsController.createContactUs)
  .get(contactUsController.getAllContactUs);

router.route("/unresolved").get(contactUsController.getAllUnresolvedContactUs);
router
  .route("/resolve")
  .post(
    AdminController.checkIfAdminMiddleware,
    contactUsController.resolveContactUs
  );

module.exports = router;

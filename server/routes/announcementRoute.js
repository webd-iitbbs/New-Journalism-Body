const express = require("express");
const router = express.Router();

const AnnouncementController = require("../controllers/announcementController");
const AdminController = require("../controllers/adminController");

router
  .route("/")
  .get(AnnouncementController.getAnnouncements)
  .post(
    AdminController.checkIfAdminMiddleware,
    AnnouncementController.createAnnouncement
  );

router
  .route("/:id")
  .patch(
    AdminController.checkIfAdminMiddleware,
    AnnouncementController.updateAnnouncement
  )
  .delete(
    AdminController.checkIfAdminMiddleware,
    AnnouncementController.deleteAnnouncement
  );

module.exports = router;

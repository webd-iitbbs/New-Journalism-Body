const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");

router
  .route("/")
  .get(AdminController.checkIfAdmin)
  .post(AdminController.checkIfAdminMiddleware, AdminController.addAdmin);

router
  .route("/all")
  .get(AdminController.checkIfAdminMiddleware, AdminController.getAllAdmins);

module.exports = router;

const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");

router
  .route("/")
  .get(AdminController.checkIfAdmin)
  .post(AdminController.addAdmin);

module.exports = router;

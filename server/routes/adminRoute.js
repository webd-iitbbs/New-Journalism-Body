const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");

router.route("/:email").get(AdminController.checkIfAdmin).post();
const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const router = express.Router();
const upload = multer();

router.route("/:id").get(fileController.getfile);

router.route("/upload-file").post(upload.any(), fileController.uploadImages);

module.exports = router;

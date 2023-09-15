const router = require("express").Router();
const multer = require("multer");

const { ping } = require("./get");
const { uploadToStorage } = require("./post");
const upload = multer();

router
  .route("/storage/:visit_id")
  .get(ping)
  .post(upload.any("image"), uploadToStorage);

module.exports = router;

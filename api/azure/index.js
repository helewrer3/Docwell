const router = require("express").Router();

const { ping } = require("./get");
const { uploadToStorage } = require("./post");

router.route("/storage/:visit_id").get(ping).post(uploadToStorage);

module.exports = router;

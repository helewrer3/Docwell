const router = require("express").Router();

const { getUser, isUserValid } = require("./get");
const { addUser } = require("./post");

router.route("/").get(getUser).post(addUser);
router.route("/verify").get(isUserValid);

module.exports = router;

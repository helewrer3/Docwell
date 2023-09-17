const router = require("express").Router();

const { getUser, isUserAdmin } = require("./get");
const { addUser } = require("./post");
const { verifyUser } = require("./put");

router.route("/").get(getUser).post(addUser).put(verifyUser);
router.route("/:name").get(isUserAdmin);

module.exports = router;

const router = require("express").Router();

const { getUser, isUserAdmin } = require("./get");
const { addUser } = require("./post");
const { verifyUser } = require("./put");
const { delUser } = require("./delete");

router.route("/").get(getUser).post(addUser).put(verifyUser).delete(delUser);
router.route("/:name").get(isUserAdmin);

module.exports = router;

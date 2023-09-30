const router = require("express").Router();

const { getUser, isUserAdmin } = require("./get");
const { addUser } = require("./post");
const { verifyUser } = require("./put");
const { delUser } = require("./delete");

router.route("/").get(getUser).post(addUser);
router.route("/:name").get(isUserAdmin).put(verifyUser).delete(delUser);

module.exports = router;

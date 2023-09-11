const router = require("express").Router();

const { getDataRecords, getDataMeta, getTableMeta } = require("./get");
const { postDataRecords } = require("./post");

router.route("/").get(getDataRecords).post(postDataRecords);
router.route("/meta").get(getDataMeta);
router.route("/meta/:tableName").get(getTableMeta);

module.exports = router;

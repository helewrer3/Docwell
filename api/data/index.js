const router = require("express").Router();

const { getDataRecords, getDataMeta, getTableMeta } = require("./get");
const { postDataRecords, extractDataRecords } = require("./post");

router.route("/").get(getDataRecords).post(postDataRecords);
router.route("/backup").post(extractDataRecords);
router.route("/meta").get(getDataMeta);
router.route("/meta/:tableName").get(getTableMeta);

module.exports = router;

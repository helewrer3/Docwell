const multer = require("multer");

const uploadToStorage = async (req, res) => {
  res.status(200).json({ message: "ok" });
};

module.exports = { uploadToStorage };

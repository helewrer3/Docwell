const { deleteFromDB } = require("../../utils/database/deleteFromDB");

const delUser = async (req, res) => {
  try {
    const { name } = req.body;

    await deleteFromDB({
      tableName: "user_accounts",
      filters: { name },
    });

    res.status(201).json({ message: "User request deleted." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "User request not deleted.", payload: error });
  }
};

module.exports = { delUser };

const { updateIntoDB } = require("../../utils/database/updateIntoDB");

const verifyUser = async (req, res) => {
  try {
    const { name } = req.body;

    await updateIntoDB({
      tableName: "user_accounts",
      dataToUpdate: { is_user: 1 },
      filters: { name },
    });

    res.status(201).json({ message: "User verified." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User not verfied.", payload: error });
  }
};

module.exports = { verifyUser };

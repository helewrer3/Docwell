const bcrypt = require("bcrypt");
const { addIntoDB } = require("../../utils/database/addIntoDB");

const addUser = async (req, res) => {
  try {
    const { name, password } = req.body,
      rounds = 10,
      salt = await bcrypt.hash(name, rounds);
    await addIntoDB({
      tableName: "user_accounts",
      dataToInsert: {
        name,
        salt,
        password: await bcrypt.hash(password + salt, rounds),
      },
    });

    res.status(201).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging you in.", payload: error });
  }
};

module.exports = { addUser };

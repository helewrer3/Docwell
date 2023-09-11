const bcrypt = require("bcrypt");
const argon2 = require("argon2");

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

    res.status(201).json({ token: await argon2.hash(name) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = { addUser };

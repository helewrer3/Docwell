const bcrypt = require("bcrypt");
const argon2 = require("argon2");

const { getFromDB } = require("../../utils/database/getFromDB");

const getUser = async (req, res) => {
  try {
    const { name, password } = req.query;
    const rows = await getFromDB({
      tableName: "user_accounts",
      filters: {
        name,
      },
    });
    if (rows.length) {
      const isVerified = await bcrypt.compare(
        password + rows[0].salt,
        rows[0].password
      );
      if (isVerified) res.status(200).json({ token: await argon2.hash(name) });
      else throw "Password not found";
    } else throw "Username not found";
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user entry.", payload: error });
  }
};

const isUserValid = async (req, res) => {
  try {
    const { token } = req.params;
    res.status(200).json({ token: "YES" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user entry.", payload: error });
  }
};

module.exports = { getUser, isUserValid };

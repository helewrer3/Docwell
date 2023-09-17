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
      replaceWithName: false,
    });
    if (rows.length) {
      const isVerified =
        (await bcrypt.compare(password + rows[0].salt, rows[0].password)) &&
        rows[0].is_user == 1;
      if (isVerified)
        res.status(200).json({ name, token: await argon2.hash(name) });
      else
        throw "Please check your password or wait for the admin to approve your account.";
    } else throw "Username not found";
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user entry.", payload: error });
  }
};

const isUserAdmin = async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await getFromDB({
      tableName: "user_accounts",
      filters: {
        name,
      },
      replaceWithName: false,
    });
    res.status(200).json({ isAdmin: rows[0].is_admin });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error getting user entry.", payload: error });
  }
};

module.exports = { getUser, isUserAdmin };

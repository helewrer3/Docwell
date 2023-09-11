const { connection } = require("./getConnection");

const addIntoDB = async ({ tableName, dataToInsert }) => {
  const columns = [];
  const values = [];

  for (const data in dataToInsert) {
    if (dataToInsert[data]) {
      columns.push(data);
      values.push(
        typeof dataToInsert[data] != "number"
          ? `'${dataToInsert[data]}'`
          : dataToInsert[data]
      );
    }
  }

  const sqlCmd = `INSERT INTO ${tableName} (${columns.join(
    ", "
  )}) VALUES (${values.join(", ")});`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { addIntoDB };

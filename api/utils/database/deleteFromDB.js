const { connection } = require("./getConnection");

const deleteFromDB = async ({ tableName, filters = {} }) => {
  const conditions = [];

  for (const filter in filters)
    if (filters[filter] !== "")
      conditions.push(`${filter} = '${filters[filter]}'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sqlCmd = `DELETE FROM ${tableName} ${whereClause};`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { deleteFromDB };

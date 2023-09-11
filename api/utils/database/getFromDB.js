const { connection } = require("./getConnection");

const getFromDB = async ({ tableName, filters, page = 1, size = 1 }) => {
  const conditions = [];

  for (const filter in filters) {
    if (filters[filter] !== "")
      conditions.push(`${filter} LIKE '${filters[filter]}%'`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sqlCmd = `SELECT * FROM ${tableName} ${whereClause} LIMIT ${size} OFFSET ${
    (page - 1) * size
  };`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getFromDB };

const { connection } = require("./getConnection");

const updateIntoDB = async ({ tableName, dataToUpdate, filters = {} }) => {
  const conditions = [],
    values = [];

  for (const data in dataToUpdate) {
    if (dataToInsert[data]) {
      values.push(`SET ${data} = '${dataToInsert[data]}'`);
    }
  }

  for (const filter in filters)
    if (filters[filter] !== "")
      conditions.push(`${tableName}.${filter} = '${filters[filter]}'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sqlCmd = `UPDATE ${tableName} ${values.join(", ")} ${whereClause};`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { updateIntoDB };

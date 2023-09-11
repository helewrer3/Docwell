const { connection } = require("./getConnection");

const getDBTables = async () => {
  const sqlCmd = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE}';`;
  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getTableColumns = async ({ tableName }) => {
  const sqlCmd = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}' AND COLUMN_NAME NOT IN ('created_at', 'updated_at');`;
  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getTableRowsCount = async ({ tableName, filters }) => {
  const conditions = [];

  for (const filter in filters) {
    if (filters[filter] !== "")
      conditions.push(`${filter} LIKE '${filters[filter]}%'`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sqlCmd = `SELECT COUNT(*) as COUNT_ROWS FROM ${tableName} ${whereClause}`;
  try {
    const [rows, fields] = await connection.query(sqlCmd);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getDBTables, getTableColumns, getTableRowsCount };

const { connection } = require("./getConnection");

const getReferencedNames = async (rows, foreignKeyColumn, referencedTable) => {
  if (foreignKeyColumn == null || rows.length == 0) return rows;

  const foreignKeys = rows.map((row) => row[foreignKeyColumn]);

  const sqlCmd = `SELECT ${foreignKeyColumn}, name FROM ${referencedTable} WHERE ${foreignKeyColumn} IN (${foreignKeys.join(
    ","
  )})`;

  try {
    const [nameRows, nameFields] = await connection.query(sqlCmd);

    const nameMap = {};
    nameRows.forEach((row) => {
      nameMap[row[foreignKeyColumn]] = row.name;
    });

    rows.forEach((row) => {
      row[foreignKeyColumn] = `${nameMap[row[foreignKeyColumn]]} [${
        row[foreignKeyColumn]
      }]`;
    });

    return rows;
  } catch (error) {
    throw error;
  }
};

const getFromDB = async ({ tableName, filters, page = 1, size = 1 }) => {
  const conditions = [];

  for (const filter in filters)
    if (filters[filter] !== "")
      conditions.push(`${tableName}.${filter} LIKE '${filters[filter]}%'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sqlCmd = `SELECT * FROM ${tableName} ${whereClause} LIMIT ${size} OFFSET ${
    (page - 1) * size
  };`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);

    let foreignKeyColumn = null;
    let referencedTable = null;

    if (tableName == "visits") {
      foreignKeyColumn = "patients_id";
      referencedTable = "patients";
    } else if (tableName == "medicines") {
      foreignKeyColumn = "manufacturer_id";
      referencedTable = "medicine_manufacturers";
    }

    const rowsWithNames = await getReferencedNames(
      rows,
      foreignKeyColumn,
      referencedTable
    );
    return rowsWithNames;
  } catch (error) {
    throw error;
  }
};

module.exports = { getFromDB };

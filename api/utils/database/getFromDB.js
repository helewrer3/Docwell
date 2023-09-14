const { connection } = require("./getConnection");

const getReferencedNames = async ({ tableName, rows }) => {
  let foreignKeyColumn = null,
    referencedTable = null;
  if (tableName == "visits") {
    foreignKeyColumn = "patients_id";
    referencedTable = "patients";
  } else if (tableName == "medicines") {
    foreignKeyColumn = "manufacturer_id";
    referencedTable = "medicine_manufacturers";
  }

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

const getFromDB = async ({
  tableName,
  filters,
  page = null,
  size = null,
  replaceWithName = true,
}) => {
  const conditions = [];

  for (const filter in filters)
    if (filters[filter] !== "")
      conditions.push(`${tableName}.${filter} LIKE '${filters[filter]}%'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const paginationClause =
    page != null ? `LIMIT ${size} OFFSET ${(page - 1) * size}` : "";
  const sqlCmd = `SELECT * FROM ${tableName} ${whereClause} ${paginationClause};`;

  try {
    const [rows, fields] = await connection.query(sqlCmd);

    if (replaceWithName) {
      const rowsWithNames = await getReferencedNames({ tableName, rows });
      return rowsWithNames;
    } else return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getFromDB };

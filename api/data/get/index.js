const { getFromDB } = require("../../utils/database/getFromDB");

const {
  getDBTables,
  getTableColumns,
  getTableRowsCount,
} = require("../../utils/database/getDBMeta");

const getDataRecords = async (req, res) => {
  try {
    const { tableName, filters, page = 1, size = 1 } = req.query;
    const result = await getFromDB({
      tableName,
      filters,
      page: parseInt(page),
      size: parseInt(size),
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting table entries.", error });
  }
};

const getDataMeta = async (req, res) => {
  try {
    const tables = await getDBTables();
    let meta = {};
    for (let i = 0; i < tables.length; i++) {
      meta[tables[i].TABLE_NAME] = await getTableColumns({
        tableName: tables[i].TABLE_NAME,
      });
    }
    res.status(200).json(meta);
  } catch (error) {
    res.status(500).json({ message: "Error getting database meta.", error });
  }
};

const getTableMeta = async (req, res) => {
  try {
    const tableName = req.params.tableName,
      filters = req.query.filters;
    const count = await getTableRowsCount({ tableName, filters });
    const meta = { rowCount: count[0].COUNT_ROWS };
    res.status(200).json(meta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting database meta.", error });
  }
};

module.exports = { getDataRecords, getDataMeta, getTableMeta };

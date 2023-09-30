const { getFromDB } = require("../../utils/database/getFromDB");

const {
  getDBTables,
  getTableColumns,
  getTableRowsCount,
} = require("../../utils/database/getDBMeta");

const getDataRecords = async (req, res) => {
  try {
    const {
      tableName,
      filters,
      page = 1,
      size = 1e7,
      replaceWithName = true,
    } = req.query;
    const result = await getFromDB({
      tableName,
      filters,
      page: parseInt(page),
      size: parseInt(size),
      replaceWithName,
    });
    res.status(200).json({ message: "Loaded table data.", payload: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error getting table entries.", payload: error });
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
    res
      .status(200)
      .json({ message: "Loaded database meta data.", payload: meta });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting database meta.", payload: error });
  }
};

const getTableMeta = async (req, res) => {
  try {
    const tableName = req.params.tableName,
      filters = req.query.filters;
    const count = await getTableRowsCount({ tableName, filters });
    const meta = { rowCount: count[0].COUNT_ROWS };
    res.status(200).json({ message: "Loaded table meta data.", payload: meta });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error getting table meta.", payload: error });
  }
};

module.exports = { getDataRecords, getDataMeta, getTableMeta };

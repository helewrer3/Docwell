const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const { addIntoDB } = require("../../utils/database/addIntoDB");
const { getFromDB } = require("../../utils/database/getFromDB");

const postDataRecords = async (req, res) => {
  const { tableName, dataToInsert } = req.body;
  try {
    const result = await addIntoDB({ tableName, dataToInsert });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const extractDataRecords = async (req, res) => {
  try {
    const { tables } = req.body,
      zipFileName = `${process.env.DB_DATABASE}.zip`,
      archive = archiver("zip", {
        zlib: { level: 9 },
      });

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const rows = await getFromDB({
        tableName: table,
        replaceWithName: false,
      });

      let headers = [];

      for (const key in rows[0]) {
        if (Object.hasOwnProperty.call(rows[0], key)) {
          headers.push({
            id: key,
            label: key,
          });
        }
      }

      const csvWriter = createCsvWriter({
        path: `${table}.csv`,
        header: headers,
      });
      await csvWriter.writeRecords(rows);
      archive.append(fs.createReadStream(`${table}.csv`), {
        name: `${table}.csv`,
      });
    }
    archive.finalize();

    res.setHeader("Content-Type", "application/zip");
    res.attachment(zipFileName);
    archive.on("finish", () => {
      archive.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ message: "Error extracting data.", payload: error });
  }
};

module.exports = { postDataRecords, extractDataRecords };

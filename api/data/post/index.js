const archiver = require("archiver");
const fs = require("fs");

const { addIntoDB } = require("../../utils/database/addIntoDB");
const { getFromDB } = require("../../utils/database/getFromDB");

const postDataRecords = async (req, res) => {
  const { tableName, dataToInsert } = req.body;
  try {
    const result = await addIntoDB({ tableName, dataToInsert });
    res.status(201).json({ message: "ok", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving data.", payload: error });
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
      if (rows.length) {
        let writeStream = Object.keys(rows[0]).join("\t") + "\n";

        rows.forEach((row) => {
          writeStream += Object.values(row).join("\t") + "\n";
        });

        await fs.promises.writeFile(`${table}.csv`, writeStream);
        archive.append(fs.createReadStream(`${table}.csv`), {
          name: `${table}.csv`,
        });
      }
    }
    archive.finalize();

    res.setHeader("Content-Type", "application/zip");
    res.attachment(zipFileName);
    archive.on("finish", () => {
      archive.pipe(res);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error extracting data.", payload: error });
  }
};

module.exports = { postDataRecords, extractDataRecords };

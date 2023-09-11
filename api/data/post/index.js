const { addIntoDB } = require("../../utils/database/addIntoDB");

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

module.exports = { postDataRecords };

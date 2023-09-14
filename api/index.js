const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/utils", require("./utils"));
app.use("/data", require("./data"));
app.use("/auth", require("./auth"));
app.use("/azure", require("./azure"));

app.listen(process.env.SERVER_PORT || 8080, () =>
  console.log(`Running on ${process.env.SERVER_PORT}`)
);

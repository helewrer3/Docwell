const express = require("express");
const cors = require("cors");
const app = express();

if (process.env.NODE_ENV == "development")
  require("dotenv").config({
    path: ".env.development",
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/utils", require("./utils"));
app.use("/data", require("./data"));
app.use("/auth", require("./auth"));

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Running on ${process.env.SERVER_PORT}`)
);

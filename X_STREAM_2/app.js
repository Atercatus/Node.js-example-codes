"use strict";

const express = require("express");
const path = require("path");

const app = express();

const PORT = 8888;

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(PORT, (req, res) => {
  console.log(`Listening PORT(${PORT})`);
});

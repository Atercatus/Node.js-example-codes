const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5432;

function streamVideo(req, res) {
  const path = "assets/sample2.mp4";
  const stat = fs.statSync(path);
  console.log(stat);
  const fileSize = stat.size;
  const range = req.headers.range;
  console.log(req.headers);
  console.log(range);

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };

    res.writeHead(206, head);
    file.pipe(res); // res is writeableStream
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}

function getMain(req, res) {
  res.render("index.html");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use("/public", express.static(__dirname + "/public"));
app.get("/", getMain);

app.get("/video", streamVideo);

app.listen(PORT, () => {
  console.log(`Listening port: ${PORT}`);
});

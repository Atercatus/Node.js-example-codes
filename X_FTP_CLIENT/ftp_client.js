const Client = require("ssh2").Client;
const connSettings = {
  host: "218.233.209.73",
  port: 22,
  username: "Atercatus",
  password: "scotish1@3"
};

const remotePath =
  "/srv/dev-disk-by-id-ata-ST3320813AS_6SZ1BV9K-part5/home/Atercatus";

const conn = new Client();

async function cycle() {
  await upload();
  await download();
}

function upload() {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const fs = require("fs");
    const readStream = fs.createReadStream("./test.txt");
    const writeStream = sftp.createWriteStream(remotePath + "/mytest.txt");

    writeStream.on("close", () => {
      console.log("- file transferred succesfully");
    });

    // initiate transfer of file
    readStream.pipe(writeStream);
  });
}

function download() {
  conn.sftp((err, sftp) => {
    if (err) throw err;

    const moveFrom = remotePath + "/download.txt";
    const moveTo = "./uploads/download.txt";

    sftp.fastGet(moveFrom, moveTo, {}, err => {
      if (err) {
        console.error(err);
        throw err;
      }

      console.log("Succesfully downloaded");
    });
  });
}

conn.on("ready", cycle).connect(connSettings);
// conn.end();

require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
let app = express();

const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const port = process.env.SERVER_PORT;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "../../../build")));

// max file number to upload at once
const maxFiles = 200;

// Mongo URI
const mongoURI = process.env.CONNECTION_STRING;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);
console.log(mongoURI);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // crypto.randomBytes(16, (err, buf) => {
      //   if (err) {
      //     return reject(err);
      //   }
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads"
      };
      resolve(fileInfo);
    });
    // });
  }
});
const upload = multer({ storage });

// @desc Loads form
app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB (support multi files upload)
// app.post("/upload", upload.single("file"), (req, res) => {
app.post("/upload", upload.array("file", maxFiles), (req, res) => {
  // res.json({ file: req.file });
  res.redirect("/");
});

// @desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});

app.get("/getDVDList", (req, res) => {
  mongo.getMongoResponse({ ID: "incompleteDVDList" }, function(result) {
    res.send(result);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../../build", "index.html"));
});

app.listen(port, _ => console.log(`The server is listening on port ${port}`));

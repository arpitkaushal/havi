const express = require("express");
const app = express();

require("dotenv").config(); // to load variables to process.env
const path = require("path");
const bodyParser = require("body-parser"); // json not parsed by default in express, so json data cannot be shown in the terminal without this
const axios = require("axios");
const mongoose = require("mongoose"); //manages DB connection
const Candidate = require("./models/Candidate");

// multer and storing to database
const multer = require("multer");
// const upload = multer({storage: multer.memoryStorage() });
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

// Create mongo connection
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads",
    };
  },
  // file: {
  //   filename: candidateImage.name,
  //   bucketName: "uploads",
  // },
});
const upload = multer({ storage });

// selecting port, establishing connection
app.listen(process.env.Port, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}`);
});

// making a connection to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected")) // if successful
  .catch((e) => console.log(`DB connection Error: ${e}`)); // if not successful

// serving the static website - in our case the form
const static_path = path.join(__dirname, "../public/");
console.log(static_path);
app.use(express.static(static_path));

// for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// get requests to the root - this will be the entry point to our app for the admin
app.get("/", (req, res) => {
  res.send("<h1>Hi You are awesome, and you'll complete this in time.</h1>");
});

// app.post("/apply", upload.single("candidateImage"), async (req, res) => {
app.post("/apply", upload.fields([{name:'candidateImage'},{name:'candidateResume'}]), async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  // console.log(req.files[0]);
  // console.log(req.files[1]);

  try {
    const candidate = new Candidate({
      email: req.body.candidateEmail,
      name: req.body.candidateName,
      comment: req.body.candidateComment,
      photo: req.files.candidateImage.buffer,
      resume: req.files.candidateResume.buffer,
    });
    console.log(candidate);
    await candidate.save();

    res
      .status(200)
      .send(
        `Hi ${req.body.candidateName} (${req.body.candidateEmail}). You commented ${req.body.candidateComment}. Thanks.`
      );
  } catch (error) {
    console.log(`Error in posting the said data: ${error}`);
    res.status(400).send(error);
  }

  // res.send("You are awesome!");
});

// app.get("/apply", (req, res) => {
//     // res.send("<h1>Hi You are awesome, and you'll complete this in time.</h1>");
//     res.render("index");
// });

// archive

// mongoDV default code
// const mongodb = require("mongodb");
/*
    // mongoDB client code
    const MongoClient = mongodb.MongoClient;
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    client.connect((err) => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
    console.log(`Error in conencting with Mongo\n${err}`);
    });
*/

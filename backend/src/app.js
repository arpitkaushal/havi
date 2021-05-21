require("dotenv").config(); // to load variables to process.env

// Intialize the app and other setup
const express = require("express");
const app = express();

// serving the static website - in our case the form
const path = require("path");
const static_path = path.join(__dirname, "../public/");
console.log(static_path);
app.use(express.static(static_path));

// selecting port, establishing connection
app.listen(process.env.Port, () => {
  console.log(`Application running at http://localhost:${process.env.PORT}`);
});

// for processing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// DATA
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
});
const upload = multer({ storage });



// making a connection to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected")) // if successful
  .catch((e) => console.log(`DB connection Error: ${e}`)); // if not successful

//

// get requests to the root - this will be the entry point to our app for the admin
app.get("/", (req, res) => {
  res.send("Awesome!");
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


// archive
/**
 * Videos - 
    * Very Conscise - https://www.youtube.com/watch?v=l8aGNhOD91k
    * https://www.youtube.com/watch?v=gQ5ou0G_frw - In Hindi
    * Traversy Media - https://www.youtube.com/watch?v=3f5Q9wDePzY
 * https://www.npmjs.com/package/multer-gridfs-storage
 * https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
 * apparently really simple way to upload - https://stackoverflow.com/questions/36428698/how-to-upload-the-file-and-store-it-in-mongodb-using-node-js
 * Embedding a React Application in an HTML page - https://medium.com/m/global-identity?redirectUrl=https%3A%2F%2Fbetterprogramming.pub%2Fhow-to-embed-a-react-application-on-any-website-1bee1d15617f
 * Tutorials BLog
    * Answer to uploading files on mongo - https://stackoverflow.com/questions/34576507/storing-a-file-into-mongodb-using-multer-in-mongoose
    * Upload File via MERN Stack - https://dev.to/ibrahimshamma99/upload-file-via-mern-stack-rocket-528l
    * AJAX SCript to show pictures preview - https://bezkoder.com/node-js-upload-store-images-mongodb/
    * Upload and Retrieve Files - https://medium.com/@kavitanambissan/uploading-and-retrieving-a-file-from-gridfs-using-multer-958dfc9255e8
    * Uploading form fields + files (Type Script) - https://medium.com/developer-rants/uploading-form-fields-and-files-at-the-same-time-with-multer-node-js-typescript-c1a367eb8198
    * Upload Image using MERN Stack - https://dev.to/yosraskhiri/how-to-upload-an-image-using-mern-stack-1j95
 * Monggose connect() vs connection()
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const axios = require("axios");

const stream = require("stream");
const { PassThrough } = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const app = express();
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// const LRU = require("lru-cache");
// const cache = new LRU({ max: 25, maxAge: 3600000 }); // 100 items, 1 hour TTL

const LRUCache = require("lrucache");

const cache = LRUCache(25);

// exports.getfile = catchAsync(async (req, res) => {
//   const fileId = req.params.id;

//   const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

//   const response = await axios({
//     url,
//     method: "GET",
//     responseType: "stream", // Use streaming
//   });

//   // Set appropriate content type
//   const contentType = response.headers["content-type"] || "image/jpeg";
//   res.setHeader("Content-Type", contentType);

//   response.data.pipe(res);
// });
exports.getfile = catchAsync(async (req, res) => {
  const fileId = req.params.id;

  // Check if the file is in the cache
  let cachedFile = cache.get(fileId);
  if (cachedFile) {
    console.log("cachedFile");
    res.setHeader("Content-Type", cachedFile.contentType);
    const passThroughStream = new PassThrough();
    passThroughStream.end(cachedFile.data); // Send the cached data through a PassThrough stream
    return passThroughStream.pipe(res);
  }

  console.log("not cached");

  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer", // Use arraybuffer to store the data in a buffer
  });
  const contentType = response.headers["content-type"] || "image/jpeg";
  res.setHeader("Content-Type", contentType);

  cache.set(fileId, {
    contentType,
    data: response.data,
  });

  res.end(response.data);
});

exports.uploadImages = async (req, res) => {
  // console.log(req);
  console.log("req.body ", req.body);
  const stream = require("stream");
  const path = require("path");
  const { google } = require("googleapis");
  // let cred = require('../utils/cred');

  const uploadFile = async (req, res, fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["1D9zojQ0KRH_rPguRn4mwPzUualCqLoNP"],
      },
      fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: data,
    });
  };
  console.log("dirname ", __dirname);
  // const KEYFILEPATH = JSON.stringify(cred);
  const KEYFILEPATH = path.join(__dirname, "./../credentials.json");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  console.log(auth);
  try {
    console.log("req.body ", req.body);
    console.log(req.files);
    const { body, files } = req;

    let resp = "";
    for (let f = 0; f < files.length; f += 1) {
      resp = await uploadFile(req, res, files[f]);
    }

    console.log(resp);
    // res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
};

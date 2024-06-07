const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());

app.use((req, res, next) => {
  console.log("Hello");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Connected to server",
  });
});

module.exports = app;

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cron = require("node-cron");
const https = require("https");
const app = express();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// Import Routes
const AdminRoute = require("./routes/adminRoute");
const ArticleRoute = require("./routes/articleRoute");
const ArticleStatsRoute = require("./routes/articleStatistics");
const CommentRoute = require("./routes/commentRoute");
const AnnouncementRoute = require("./routes/announcementRoute");
const ContactUsRoute = require("./routes/contactUsRoute");
const AuthRoutes = require("./routes/authRoutes");
const FileRoutes = require("./routes/fileRoute");

// Middleware for logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.options("*", cors());

// Middleware for CORS
app.use(
  cors({
    origin: [
      "https://oracle-journalism-body.onrender.com",
      "https://48bfw833-3000.inc1.devtunnels.ms",
      "http://localhost:3000",
    ], // Adjust this to match your front-end URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log("Hello");
  next();
});

// Middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Base Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Connected to server",
  });
});

const backendUrl = "https://new-journalism-body.onrender.com/";
cron.schedule("*/180 * * * * *", function () {
  console.log("Restarting server");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Restarted");
      } else {
        console.error(`failed to restart with status code: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("Error ", err.message);
    });
});

// Create a router for /api/v1
const apiRouter = express.Router();

apiRouter.use("/admin", AdminRoute);
apiRouter.use("/article", ArticleRoute);
apiRouter.use("/article-stats", ArticleStatsRoute);
apiRouter.use("/comment", CommentRoute);
apiRouter.use("/announcement", AnnouncementRoute);
apiRouter.use("/contactus", ContactUsRoute);
apiRouter.use("/auth", AuthRoutes);
apiRouter.use("/file", FileRoutes);

// Use the /api/v1 router
app.use("/api/v1", apiRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;

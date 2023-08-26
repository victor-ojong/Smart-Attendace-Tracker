const path = require("path");
const express = require("express");
const pug = require("pug");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");

// starting express app
const app = express();

// using our md functions
app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// importing the route handler functions
const {
  viewLoginPage,
  userActivation,
  userLogin,
  protect,
  usersLogout,
  changePassword,
  messageSender,
} = require("./Controllers/userController");

const {
  lecturerdashboard,
  resultUpload,
} = require("./Controllers/lecturerController");

const {
  studentOverview,
  displayResults,
} = require("./Controllers/studentController");

// global routes for all users
app.get("/", viewLoginPage);
app.post("/activate", userActivation);
app.post("/login", userLogin);

app.use(protect);
// common protected routes
app.post("/messageSend", messageSender);
app.patch("/passwordUpdate", changePassword);
app.get("/logout", usersLogout);
//protected routes for lecturers
app.post("/upload", resultUpload);
app.get("/resultUpload", lecturerdashboard);

/// routes for students only
app.get("/studentDashboard", studentOverview);
app.get("/studentDash", displayResults);

// global error handler middleware function
app.use((err, req, res, next) => {
  console.log(err);
  if (err.isOperational) {
    res.status(err.errCode).json({
      status: "failed",
      message: err.message,
    });
  }
  if (!err.isOperational) {
    res.status(404).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});
module.exports = app;

const Student = require("./../Models/studentModel");
const Lecturer = require("./../Models/lecturerModel");
const fs = require("fs");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

//  reading the files from file system
const lecturerData = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/lecturerData.json`)
);
const studentData = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/studentsData.json`)
);

const studentDataUpload = async (data) => {
  await Student.create(data, { validateBeforeSave: false });
  console.log("student data succesfully upploaded to the db");
};
// studentDataUpload(studentData);

const lecturerDataUpload = async (data) => {
  await Lecturer.create(data, { validateBeforeSave: false });
  console.log("lectuer data succesfully upploaded to the db");
};
// lecturerDataUpload(lecturerData);

exports.viewLoginPage = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.userActivation = catchAsync(async (req, res, next) => {
  console.log(req.body);
  //STEPS
  // check for the regno or courseCode
  // checking if the email is same as what is provided
  //hashing the password
  // setting the password,
  //saving the password
  // sending token to the client
  // getting response and telling the user
  const { regno, email, password, passwordConfirm } = req.body;
  const role = regno.split("/").at(1) === "EEN" ? "student" : "lecturer";

  if (role === "student") {
    user = await Student.findOne({ regno });
  }
  if (role === "lecturer") {
    user = await Lecturer.findOne({ courseCode: regno });
  }

  if (!user) {
    return next({
      message: "Incorrect Email/Id",
      errCode: 401,
      isOperational: true,
    });
  }

  if (user.email !== email) {
    return next({
      message: "Incorrect Email/Id",
      errCode: 401,
      isOperational: true,
    });
  }

  // checking if the user has already activated account

  if (user.password) {
    return next({
      message: "This Account has already been activated",
      errCode: 402,
      isOperational: true,
    });
  }

  const passwordDB = await bcrypt.hash(password, 12);
  user.password = passwordDB;
  user.save({ validateBeforeSave: false });
  const token = jwt.sign({ id: user._id }, "this-is-it-bro-we-must-work-hard");

  res.cookie("jwt", token);
  res.status(200).json({
    status: "success",
    message: "Account successfully activated",
  });
});

// login handler function
exports.userLogin = catchAsync(async (req, res, next) => {
  const { regno, password } = req.body;
  console.log(req.body);
  let user;
  let passwordHash;
  let role;
  // checking if the user is a student or sa
  const isStudent = regno.split("/").at(1) === "EEN";

  if (isStudent) {
    user = await Student.findOne({ regno });
    role = "student";
  }

  if (!isStudent) {
    user = await Lecturer.findOne({ courseCode: regno });
    role = "lecturer";
  }

  if (!user) {
    return next({
      message: "Invalid Login details",
      errCode: 401,
      isOperational: true,
    });
  }

  passwordHash = user.password;
  const passwordChecked = await bcrypt.compare(password, passwordHash);
  if (!passwordChecked) {
    return next({
      message: "Invalid Login details",
      errCode: 401,
      isOperational: true,
    });
  }

  const token = jwt.sign({ id: user._id }, "this-is-it-bro-we-must-work-hard");

  //cos we have access to the user role, we can use it direct the user based on the role in the axios response in the client script
  res.cookie("jwt", token, {
    expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
  res.cookie("role", role);
  res.status(200).json({
    status: "success",
    role,
  });
});

// the protect MIDDLEWARE FUNCTION
exports.protect = catchAsync(async (req, res, next) => {
  const role = req.cookies.role;
  const token = req.cookies.jwt;
  if (!token || token.length < 12) {
    return next({
      message: "You are not Logged In",
      errCode: 401,
      isOperational: true,
    });
  }
  //verifying the token
  const decoded = await promisify(jwt.verify)(
    token,
    "this-is-it-bro-we-must-work-hard"
  );
  console.log(role);
  console.log(decoded);

  const { id, exp, iat } = decoded;

  console.log(decoded);
  let user;
  if (role === "student") user = await Student.findById(id);
  if (role === "lecturer") user = await Lecturer.findById(id);

  if (!user) {
    return next({
      message: "You are not Logged In not found",
      errCode: 401,
      isOperational: true,
    });
  }

  // sending the user document to the next mw
  req.user = user;
  next();
});

exports.usersLogout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "fake-token", {
    expiresIn: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).render("login");
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, regno } = req.body;

  console.log(req.body);

  const isStudent = regno.split("/").at(1) === "EEN";

  if (isStudent) {
    user = await Student.findOne({ regno });
  }

  if (!isStudent) {
    user = await Lecturer.findOne({ courseCode: regno });
  }

  const passwordDB = user.password;
  const verifyPassword = await bcrypt.compare(currentPassword, passwordDB);
  if (!verifyPassword) {
    return next({
      message: "current password is not correct",
      errCode: 404,
      isOperational: true,
    });
  }
  // if the passwword is currect then

  user.password = await bcrypt.hash(newPassword, 12);
  user.save({ validateBeforeSave: false });

  res.status(202).json({
    status: "success",
    message: "password Updated",
  });
});

exports.messageSender = catchAsync(async (req, res, next) => {
  // sending to self
  const user = req.user;
  user.messages.push(req.body);
  user.save({ validateBeforeSave: false });

  // sending to admin

  const admin = await Lecturer.findOne({ courseCode: "GSS 1101" });
  admin.messages.push({
    message: req.body.message,
    time: req.body.time,
    regno: req.body.regno,
    flag: "reciever",
  });

  admin.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "message sent",
  });
});

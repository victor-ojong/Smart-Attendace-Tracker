const mongoose = require("mongoose");

// message schema

const messageSchema = new mongoose.Schema({
  message: {},
  time: Date,
  flag: { type: String, enum: ["sender", "reciever"] },
});

//  result schema for students to be filled by lecturers  and embedded in the students schema
const resultSchema = new mongoose.Schema({
  session: {
    type: String,
    required: [true, "session is required"],
  },
  title: { type: String, required: [true, "course Title is required"] },
  courseCode: {
    type: String,
    required: [true, "Course Code is required"],
  },
  semester: {
    type: String,
    required: [true, "Semester is required"],
    enum: ["First", "Second"],
  },
  level: {
    type: String,
    required: [true, "Level is required"],
    enum: ["100L", "200L", "300L", "400L", "500L"],
  },
  creditUnit: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: 2,
    required: [true, "CU is required"],
  },
  creditPoints: {
    type: Number,
  },
  score: { type: Number, default: 50, min: 0, max: 100 },
  grade: {
    type: String,
    default: "A",
    enum: ["A", "B", "C", "D", "E", "F"],
  },
});

// students bio data filled by the exams officer only password is entered by user upon account activation
const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  regno: {
    type: String,
    required: [true, "Reg no is required"],
    trim: [true, "this has alreaduy "],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "password Confirm is required"],
    validate: function (val) {
      return val === this.password;
    },
    message: "password confirm must match",
  },
  email: {
    type: String,
    required: [true, "email is required"],
    minlength: [5, "enter a valid email address"],
  },
  admissionYear: {
    type: String,
  },
  department: { type: String, default: "Electrical/Electronic Department" },
  results: [resultSchema],
  cgpa: { type: Number, default: 5.0 },
  messages: [messageSchema],
});

studentSchema.index({ regno: 1, email: 1 });

const Student = mongoose.model("Student", studentSchema);

Student.ensureIndexes();
module.exports = Student;

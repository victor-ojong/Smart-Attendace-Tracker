const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {},
  time: Date,
  flag: { type: String, enum: ["sender", "reciever"] },
});

const lecturerSchema = new mongoose.Schema({
  name: { type: String, required: [true, "lecturer name is required"] },
  email: { type: String, required: [true, "email is required "], unique: true },
  level: { type: String, required: [true, "level is required "] },

  courseTitle: {
    type: String,
    required: [true, "Course Title is required "],
  },
  courseCode: {
    type: String,
    required: [true, "Course Code is required "],
    unique: true,
  },
  criditunit: {
    type: Number,
    required: [true, "CU is required "],
    default: 2,
    enum: [1, 2, 3, 4, 5, 6],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "password is required"],
  },
  semester: { type: String, enum: ["First", "Second"], default: "First" },
  messages: [messageSchema],
});
lecturerSchema.index({ email: 1, courseCode: 1 });

const lecturer = mongoose.model("lecturer", lecturerSchema);

module.exports = lecturer;

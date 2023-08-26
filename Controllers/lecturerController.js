const Student = require("./../Models/studentModel");
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.lecturerdashboard = catchAsync(async (req, res, next) => {
  const lecturer = req.user;
  res.status(200).render("lecturerview", { lecturer });
});

//result upload handler
exports.resultUpload = catchAsync(async (req, res, next) => {
  const {
    regno,
    grade,
    level,
    courseCode,
    creditPoints,
    semester,
    creditUnit,
  } = req.body;
  console.log(regno);
  // STEPS
  // (1)find user with regno in the students database
  // (2)If user exist then get the result document....user.results
  // (3) then using the push array menthod , push the new result object into the results array
  // (4) save the document user.save()// validateBeforeSave: false

  const student = await Student.findOne({ regno });

  if (!student) {
    return next({
      message: "this regno is not associated with any student please verify",
      errCode: 404,
      isOperational: true,
    });
  }

  // checking if result exist already for that same course and resturning an error
  const resultExist = student.results.find(
    (el) => el.courseCode === courseCode
  );

  if (resultExist) {
    return next({
      message: "this result has already been uploaded",
      errCode: 401,
      isOperational: true,
    });
  }
  // sendind the results to the db
  student.results.push({
    regno,
    grade,
    level,
    courseCode,
    creditPoints,
    semester,
    creditUnit,
  });

  // student.save({ validateModifiedOnly: true });
  student.save({ validateBeforeSave: false });
  console.log("result uploaded successfully");
  res.status(200).json({
    status: "success",
    message: "result uploaded successfully",
  });
});

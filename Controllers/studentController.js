const Student = require("./../Models/studentModel");
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.studentOverview = catchAsync(async (req, res, next) => {
  const student = req.user;
  const resultSummary = [];
  // year one results
  const first_semester_ONE = student.results.filter(
    (el) => el.semester === "First" && el.level === "100L"
  );
  const second_semester_ONE = student.results.filter(
    (el) => el.semester === "Second" && el.level === "100L"
  );
  // year two results
  const first_semester_TWO = student.results.filter(
    (el) => el.semester === "First" && el.level === "200L"
  );
  const second_semester_TWO = student.results.filter(
    (el) => el.semester === "Second" && el.level === "200L"
  );
  // year three results
  const first_semester_THREE = student.results.filter(
    (el) => el.semester === "First" && el.level === "300L"
  );
  const second_semester_THREE = student.results.filter(
    (el) => el.semester === "Second" && el.level === "300L"
  );
  // year four results
  const first_semester_FOUR = student.results.filter(
    (el) => el.semester === "First" && el.level === "400L"
  );
  const second_semester_FOUR = student.results.filter(
    (el) => el.semester === "Second" && el.level === "400L"
  );

  // year five results
  const first_semester_FIVE = student.results.filter(
    (el) => el.semester === "First" && el.level === "500L"
  );
  const second_semester_FIVE = student.results.filter(
    (el) => el.semester === "Second" && el.level === "500L"
  );

  // populating our result summary array if result exist for a semester and level
  const summaryCalculator = (resultArrayPerSemester) => {
    resultSummary.push({
      semester: resultArrayPerSemester.at(0).semester,
      level: resultArrayPerSemester.at(0).level,
      courses: resultArrayPerSemester.length,
      // calculating the total credit hours taken per semester
      creditHourTotal: resultArrayPerSemester
        .map((el) => el.creditUnit)
        .reduce((acc, cur) => acc + cur, 0),
      // calculating the total credit hours taken per semester
      creditPointsTotal: resultArrayPerSemester
        .map((el) => el.creditPoints)
        .reduce((acc, cur) => acc + cur, 0),
      gpa: (
        resultArrayPerSemester
          .map((el) => el.creditPoints)
          .reduce((acc, cur) => acc + cur, 0) /
        resultArrayPerSemester
          .map((el) => el.creditUnit)
          .reduce((acc, cur) => acc + cur, 0)
      ).toFixed(2),
    });
  };
  // calling the calculator function if results exist for each semester
  if (first_semester_ONE.length > 0) {
    summaryCalculator(first_semester_ONE);
  }
  if (second_semester_ONE.length > 0) {
    summaryCalculator(second_semester_ONE);
  }
  if (first_semester_TWO.length > 0) {
    summaryCalculator(first_semester_TWO);
  }
  if (second_semester_TWO.length > 0) {
    summaryCalculator(second_semester_TWO);
  }
  if (first_semester_THREE.length > 0) {
    summaryCalculator(first_semester_THREE);
  }
  if (second_semester_THREE.length > 0) {
    summaryCalculator(second_semester_THREE);
  }
  if (first_semester_FOUR.length > 0) {
    summaryCalculator(first_semester_FOUR);
  }
  if (second_semester_FOUR.length > 0) {
    summaryCalculator(second_semester_FOUR);
  }
  if (first_semester_FIVE.length > 0) {
    summaryCalculator(first_semester_FIVE);
  }
  if (second_semester_FIVE.length > 0) {
    summaryCalculator(second_semester_FIVE);
  }

  //  calculating CGPA FOR ALL THE SEMESTERS
  // CGPA = sum of grade points / credit units
  let CGPA = 5.0;
  if (resultSummary.length > 0) {
    const total_credit_Points = resultSummary
      .map((el) => el.creditPointsTotal)
      .reduce((acc, cur) => acc + cur, 0);

    const total_credit_Units = resultSummary
      .map((el) => el.creditHourTotal)
      .reduce((acc, cur) => acc + cur, 0);

    CGPA = (total_credit_Points / total_credit_Units).toFixed(2);
    student;

    // send the calculated value to the Students document Student.gpa = GPA, student.save({...})

    student.cgpa = CGPA;
    student.save({ validateBeforeSave: false });
  }
  res.status(200).render("studentOverview", {
    resultSummary,
    student,
  });
});

exports.displayResults = catchAsync(async (req, res, next) => {
  const { semester, level } = req.query;

  // current logged in user
  const student = req.user;
  const results = student.results.filter(
    (el) => el.semester === semester && el.level === level
  );

  let sanitizedResults;
  if (results.at(0)) {
    sanitizedResults = results;
    console.log(sanitizedResults.length);
  }

  console.log(results, sanitizedResults);
  // res.status(200).render("lecturerview", { student, results });

  res.status(200).render("resultDisplay", { sanitizedResults });
});

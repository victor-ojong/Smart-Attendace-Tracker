"use strict";
let grade;
let creditPoint;
// handling result uploads to the students dashboard
try {
  const upload = async (
    regno,
    grade,
    level,
    courseCode,
    creditPoints,
    semester,
    creditUnit
  ) => {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/upload",
      data: {
        regno,
        grade,
        level,
        courseCode,
        creditPoints,
        semester,
        creditUnit,
      },
    });
    // database response could be handled here gracefully

    if (res.data.status === "success") {
      alert("result successfully uploaded");
    }
  };

  const submitResultBtn = document.getElementById("result-upload");
  if (submitResultBtn) {
    submitResultBtn.addEventListener("click", function (e) {
      e.preventDefault();
      ////
      const regno = document.getElementById("regno").value;
      const scores = document.getElementById("score").value;
      const level = document.getElementById("level").value;
      const courseCode = document.getElementById("CourseCode").value;
      const semester = document.getElementById("Semester").value;
      const creditUnit = document.getElementById("creditUnit").value;
      if (!regno || !scores) {
        return (document.getElementById("regno").value =
          "Error: registeration number and score is required");
      }

      //calculating grade and grade point
      // A = 70 - 100
      // B = 60 - 69
      // C = 50 - 59
      // D = 45 - 49
      // E = 40 - 44
      // F = 0 - 43

      if (scores >= 70) {
        grade = "A";
        creditPoint = creditUnit * 5;
      }

      if (scores >= 60 && scores < 69) {
        grade = "B";
        creditPoint = creditUnit * 4;
      }

      if (scores >= 50 && scores < 59) {
        grade = "C";
        creditPoint = creditUnit * 3;
      }

      if (scores >= 45 && scores < 49) {
        grade = "D";
        creditPoint = creditUnit * 2;
      }

      if (scores >= 40 && scores < 44) {
        grade = "E";
        creditPoint = creditUnit * 1;
      }

      if (scores >= 0 && scores < 43) {
        grade = "F";
        creditPoint = creditUnit * 0;
      }

      // uploading the result
      console.log(grade);
      console.log(creditPoint);
      upload(
        regno,
        grade,
        level,
        courseCode,
        creditPoint,
        semester,
        creditUnit
      );
      document.getElementById("regno").value = " ";
      document.getElementById("score").value = 0;
    });
  }
} catch (err) {
  console.log(err);
}

// pages switch between results and profile

const uploadForm = document.querySelector(".form-container");

const result_mobile = document.querySelector(".result-mobile");
const profile_mobile = document.querySelector(".profile-mobile");
const profile_desktop = document.querySelector(".profile-desktop");
const result_desktop = document.querySelector(".result-desktop");
const mobile_menu = document.querySelector(".filter-menu");
const profileContainer = document.querySelector(".profile-container");

const profileView = (e) => {
  mobile_menu.classList.remove("active");
  uploadForm.style.display = "none";
  profileContainer.style.display = "block";
};
const resultView = (e) => {
  mobile_menu.classList.remove("active");
  uploadForm.style.display = "block";
  profileContainer.style.display = "none";
};
profile_desktop.addEventListener("click", profileView);
profile_mobile.addEventListener("click", profileView);
result_mobile.addEventListener("click", resultView);
result_desktop.addEventListener("click", resultView);

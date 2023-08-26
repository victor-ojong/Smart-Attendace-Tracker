"use strict";
let errMessage;

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
});

const signupBtn = document.querySelector(".signupbtn");

const signupCard = document.querySelector(".signupcard");

const signinBtn = document.querySelector(".signinbtn");

const signinCard = document.querySelector(".signincard");

// activating user account

try {
  signupCard.style.display = "none";

  // single page login and sign up function

  signupCard.style.display = "none";

  signinBtn.addEventListener("click", function (e) {
    e.preventDefault();
    signupCard.style.display = "none";
    signinCard.style.display = "block";
  });

  signupBtn.addEventListener("click", function (e) {
    e.preventDefault();
    signinCard.style.display = "none";
    signupCard.style.display = "block";
  });
} catch (err) {
  console.log(err.response.data.message);
}

// logout btn function
// try {
//   logOutbtn.addEventListener("click", function (e) {
//     e.preventDefault();

//     Swal.fire({
//       // title: 'sure you want to exit?',
//       text: "exit?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "ok",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire("<p>Logging out ...<p>");
//         setTimeout(function () {
//           location.replace("logout.php");
//         }, 3000);
//       }
//     });
//   });
// } catch (err) {}

// activating users account using axios
const activateAccount = async (regno, email, password, passwordConfirm) => {
  // checks and return if no internet connection
  if (navigator.onLine === false) {
    return console.log("something went wrong kindly check your internet");
  }
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/activate",
      data: {
        regno,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      alert("account activated successfully");
      // alert that the account has been activated successfully
    }
  } catch (err) {
    // alert that there is an error in the process
    errMessage = err.response.data.message;
    alert(errMessage);
  }

  /// we can get response at this point
};

// account activation handler
document.querySelector("#activate").addEventListener("click", (e) => {
  e.preventDefault();
  const regno = document.getElementById("regno-activate").value;
  const email = document.getElementById("email-activate").value;
  const password = document.getElementById("password1").value;
  const passwordConfirm = document.getElementById("password2").value;
  if (!regno || !email || !password || !passwordConfirm) {
    return alert(" you are missing a required field");
  }
  if (password !== passwordConfirm) {
    return alert(" passwords must match");
  }

  activateAccount(regno, email, password, passwordConfirm);

  // setting all form data to empty
  document.getElementById("regno-activate").value = "";
  document.getElementById("email-activate").value = "";
  document.getElementById("password1").value = "";
  document.getElementById("password2").value = "";
});

// user login handler
// axios http connection

const loginAccount = async (regno, password) => {
  if (navigator.onLine === false) {
    return console.log("something went wrong kindly check your internet");
  }
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8000/login",
      data: {
        regno,
        password,
      },
    });
    // using early gaurding cluase to return when no response in an instance of networkk failure
    // console.log(navigator.onLine);

    // handing the success response and redirecting to the appropriate
    if (res.data.status === "success") {
      const loc =
        res.data.role === "student" ? "/studentDashboard" : "/resultUpload";
      window.setTimeout(() => {
        location.assign(loc);
      }, 1500);
    }
  } catch (err) {
    errMessage = err.response.data.message;
    alert(errMessage);
  }
};
document.querySelector("#login").addEventListener("click", (e) => {
  e.preventDefault();
  const regno = document.getElementById("regno-login").value.toUpperCase();
  const password = document.getElementById("password").value;
  if (!regno || !password) {
    return alert("Password and Email are Required");
  }
  // logging in user
  loginAccount(regno, password);
  //setting login form data to default empty
  document.getElementById("regno-login").value = "";
  document.getElementById("password").value = "";
});

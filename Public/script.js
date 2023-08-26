// const { default: axios } = require("axios");

// handling the menu bar for mobile
document.querySelector(".jsFilter").addEventListener("click", function () {
  document.querySelector(".filter-menu").classList.toggle("active");
});

let linkColour = document.querySelectorAll("#lastlinks");
linkColour = [...linkColour];

// changing the mode light or dark
var modeSwitch = document.querySelector(".mode-switch");
modeSwitch.addEventListener("click", function () {
  document.documentElement.classList.toggle("light");

  linkColour.forEach((el) => {
    el.style.color = "blue";
  });
  modeSwitch.classList.toggle("active");
});

// password change
const btnPassword = document.querySelector(".passwordUpdate");

const changePassword = async (currentPassword, newPassword, regno) => {
  if (navigator.onLine === false) {
    return console.log("no network connection");
  }
  try {
    const res = await axios({
      method: "PATCH",
      url: "/passwordUpdate",
      data: {
        currentPassword,
        newPassword,
        regno,
      },
    });
    if (res.data.status === "success") {
      alert("password updated successfully");
    }
  } catch (err) {
    console.log(err);
    alert("something went wrong");
  }
};

btnPassword.addEventListener("click", (e) => {
  e.preventDefault();
  let currentPassword = document.getElementById("currentpassword").value;
  let newPassword = document.getElementById("newpassword").value;
  let regno = document.getElementById("regno").value;
  if (currentPassword.length < 1 || newPassword < 1) {
    return alert("you must eneter both current and new passwords");
  }
  changePassword(currentPassword, newPassword, regno);
  document.getElementById("currentpassword").value = "";
  document.getElementById("newpassword").value = "";
});

// messanger

const messageBtn = document.querySelector(".messageSend");

const messageSend = async (message, regno, time, flag) => {
  if (navigator.onLine === false) {
    return alert("you are not connected to the innternet");
  }
  try {
    const res = await axios({
      method: "post",
      url: "http://127.0.0.1:8000/messageSend",
      data: {
        message,
        regno,
        time,
        flag,
      },
    });
    if (res.data.status === "success") {
      alert("message sent");
    }
  } catch (err) {
    console.log(err);
    alert("something went wrong");
  }
};
messageBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // data: message, time, regno, flag
  const message = document.querySelector("#messagevalue").value;
  regno = document.getElementById("regno").value;
  let time = new Date(Date.now()).toDateString();
  let flag = "sender";
  if (message.length < 1) {
    return alert("you cannot sent an empty message");
  }
  messageSend(message, regno, time, flag);
  document.querySelector("#messagevalue").value = "";
});

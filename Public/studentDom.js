"use strict";

// ui elements
const resultOverview = document.querySelector("#products-area-wrapper");
const profileView = document.querySelector("#profile-container");
const aboutPage = document.querySelector("#aboutpage");
const enquiry = document.querySelector("#messageAdmin");
const buttonNav = document.querySelector(".sidebar-list");
const mobileNav = document.querySelector(".filter-menu");

linkColour = [...linkColour];

linkColour.forEach((el) => {
  el.style.color = "white";
});

// buttons

const navigate = (e) => {
  e.preventDefault();
  // removing the mobile nav bar
  document.querySelector(".filter-menu").classList.remove("active");

  // setting all ui invisible
  resultOverview.style.display =
    aboutPage.style.display =
    enquiry.style.display =
    profileView.style.display =
      "none";

  // getting the data i saved as id in each of the li element with a suffice Nav and removing the suffice using slice method the last 3 strings
  const id = e.target.closest("li").id.slice(0, -3);
  if (id === "products-area-wrapper") {
    return location.assign("/studentDashboard");
  }
  document.getElementById(id).style.display = "block";
  if (id === "messageAdmin") {
    document
      .getElementById("messagevalue")
      .scrollIntoView({ behavior: "smooth" });
  }
};

// using the eventlisteners to handle the clicks
mobileNav.addEventListener("click", navigate);
buttonNav.addEventListener("click", navigate);

const SignUpBtn = document.querySelector(".signup-btn");
const EyeIcon = document.querySelector(".eye-img");
const Password = document.querySelector(".password-input");
const SignUpImg = document.querySelector(".SignUpImg");
const SignUpBox = document.querySelector(".signup-box");
const DarkLightMode = document.querySelector(".Dark-LightMode");

const TogglePassword = function () {
  if (Password.type === "password") {
    EyeIcon.src = "visible.png";
    Password.type = "text";
  } else {
    EyeIcon.src = "hide.png";
    Password.type = "password";
  }
};

SignUpBox.addEventListener("mouseover", function () {
  SignUpImg.src = "account_circle_60dp_FFF.png";
});

SignUpBox.addEventListener("mouseout", function () {
  SignUpImg.src = "account_circle_60dp_212121.png";
});

SignUpBox.addEventListener("click", () => {
  SignUpImg.src = "account_circle_60dp_FFF.png";
});

const TogglePage = function () {
  window.location = "../SignUpPage/index.html";
};

EyeIcon.addEventListener("click", TogglePassword);

SignUpBtn.addEventListener("click", TogglePage);

const updateStyles = function () {
  if (DarkLightMode.src.includes("LightMode.png") && window.innerWidth > 769) {
    document.querySelector(".main-container").style.boxShadow =
      "2px 2px 7px black, -2px -2px 7px black";
    document.querySelector(".main-container").style.border = "2px solid #fff";
  } else if (
    DarkLightMode.src.includes("LightMode.png") &&
    window.innerWidth <= 769
  ) {
    document.querySelector(".main-container").style.boxShadow = "none";
    document.querySelector(".main-container").style.border = "none";
  }

  if (DarkLightMode.src.includes("DarkMode.png") && window.innerWidth > 769) {
    document.querySelector(".main-container").style.boxShadow =
      "2px 2px 5px white, -2px -2px 5px white";
    document.querySelector(".main-container").style.border = "2px solid #000";
  } else if (
    DarkLightMode.src.includes("DarkMode.png") &&
    window.innerWidth <= 769
  ) {
    document.querySelector(".main-container").style.boxShadow = "none";
    document.querySelector(".main-container").style.border = "none";
  }

  if (DarkLightMode.src.includes("DarkMode.png") && window.innerWidth <= 640) {
    document.querySelector(".email-para").style.color = "#fff";
    document.querySelector(".password-para").style.color = "#fff";
  } else if (
    DarkLightMode.src.includes("DarkMode.png") &&
    window.innerWidth > 640
  ) {
    document.querySelector(".email-para").style.color = "#000";
    document.querySelector(".password-para").style.color = "#000";
  }
};

DarkLightMode.addEventListener("click", function () {
  if (DarkLightMode.src.includes("LightMode.png")) {
    DarkLightMode.src = "DarkMode.png";
    document.body.style.backgroundImage = "url(White.jpg)";
    document.querySelector(".main-container").style.borderColor = "black";
    document.querySelector(".email-para").style.color = "#000";
    document.querySelector(".password-para").style.color = "#000";
  } else {
    document.body.style.backgroundImage = "url(Dark.jpg)";
    DarkLightMode.src = "LightMode.png";
    document.querySelector(".main-container").style.borderColor = "white";
    document.querySelector(".email-para").style.color = "#fff";
    document.querySelector(".password-para").style.color = "#fff";
  }

  updateStyles();
});

window.addEventListener("resize", updateStyles);

updateStyles();

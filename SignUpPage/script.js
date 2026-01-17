const LoginBtn = document.querySelector(".login-btn");
const EyeIcon = document.querySelector(".eye-img");
const Password = document.querySelector(".password-input");
const LoginImg = document.querySelector(".LoginImg");
const LoginBox = document.querySelector(".login-box");
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

LoginBox.addEventListener("mouseover", function () {
  LoginImg.src = "login_60dp_FFF.png";
});

LoginBox.addEventListener("mouseout", function () {
  LoginImg.src = "login_60dp_212121.png";
});

LoginBox.addEventListener("click", () => {
  LoginImg.src = "login_60dp_FFF.png";
});

const TogglePage = function () {
  window.location = "../LoginPage/index.html";
};

EyeIcon.addEventListener("click", TogglePassword);

LoginBtn.addEventListener("click", TogglePage);

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
  }
};

DarkLightMode.addEventListener("click", function () {
  if (DarkLightMode.src.includes("LightMode.png")) {
    DarkLightMode.src = "DarkMode.png";
    document.body.style.backgroundImage = "url(White.jpg)";
    document.querySelector(".main-container").style.borderColor = "black";
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

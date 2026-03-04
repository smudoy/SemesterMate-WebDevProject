const Password = document.querySelector(".password");
const ConfirmPassword = document.querySelector(".confirm-password");
const eye_OpenPassword = document.querySelector(".eye_open--password");
const eye_OpenConfirmPassword = document.querySelector(
  ".eye_open--password_confirmation",
);
const eye_ClosePassword = document.querySelector(".eye_close--password");
const eye_CloseConfirmPassword = document.querySelector(
  ".eye_close--password_confirmation",
);

const welcomeMSG = document.querySelector(".section_login--container_title--1");
const accountCreateMSG = document.querySelector(
  ".section_login--container_title--2",
);
const loginBtn = document.querySelector(".section_login--container_btn--1");
const signupBtn = document.querySelector(".section_login--container_btn--2");

const submitLoginBtn = document.querySelector(".submit_btn--login");
const submitSignupBtn = document.querySelector(".submit_btn--create");

const userName = document.querySelector(
  ".section_login--container_form--userName",
);
const userNameInput = document.querySelector(
  ".section_login--container_form--userNameInput",
);
const email = document.querySelector(".section_login--container_form--Email");
const emailInput = document.querySelector(
  ".section_login--container_form--EmailInput",
);
const confirmPassword = document.querySelector(
  ".section_login--container_form--confirmPassword",
);
const confirmPasswordContainer = document.querySelector(
  ".section_login--container_form--confirmPassword_container",
);
const fullName = document.querySelector(
  ".section_login--container_form--fullName",
);
const fullNameInput = document.querySelector(
  ".section_login--container_form--fullNameInput",
);
const semester = document.querySelector(
  ".section_login--container_form--semester",
);
const semesterOption = document.querySelector(
  ".section_login--container_form--options",
);

const hiddenElements = [
  fullName,
  fullNameInput,
  userName,
  userNameInput,
  confirmPasswordContainer,
  confirmPassword,
  semester,
  semesterOption,
];

const passwordToggle = () => {
  if (Password.type === "password") {
    Password.type = "text";
    eye_OpenPassword.style.zIndex = 2;
    eye_ClosePassword.style.zIndex = -2;
  } else if ((Password.type = "text")) {
    Password.type = "password";
    eye_OpenPassword.style.zIndex = -2;
    eye_ClosePassword.style.zIndex = 2;
  }
};

const passwordConfirmToggle = () => {
  if (ConfirmPassword.type === "password") {
    ConfirmPassword.type = "text";
    eye_OpenConfirmPassword.style.zIndex = 2;
    eye_CloseConfirmPassword.style.zIndex = -2;
  } else if ((ConfirmPassword.type = "text")) {
    ConfirmPassword.type = "password";
    eye_OpenConfirmPassword.style.zIndex = -2;
    eye_CloseConfirmPassword.style.zIndex = 2;
  }
};

const LoginClick = () => {
  loginBtn.classList.add("section_login--container_btn--active");

  signupBtn.classList.remove("section_login--container_btn--active");

  accountCreateMSG.style.display = "none";
  welcomeMSG.style.display = "block";

  submitLoginBtn.classList.add("active_submit--btn");
  submitSignupBtn.classList.remove("active_submit--btn");

  hiddenElements.forEach((el) => el.classList.add("hideElement"));

  email.textContent = "Username / Email";
  emailInput.placeholder = "Username or Email";
};

const SignUpClick = () => {
  signupBtn.classList.add("section_login--container_btn--active");

  loginBtn.classList.remove("section_login--container_btn--active");

  accountCreateMSG.style.display = "block";
  welcomeMSG.style.display = "none";

  submitSignupBtn.classList.add("active_submit--btn");
  submitLoginBtn.classList.remove("active_submit--btn");

  hiddenElements.forEach((el) => el.classList.remove("hideElement"));

  email.textContent = "Email";
  emailInput.placeholder = "xyz@gmail.com";
};

eye_CloseConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_ClosePassword.addEventListener("click", passwordToggle);
eye_OpenConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_OpenPassword.addEventListener("click", passwordToggle);

loginBtn.addEventListener("click", LoginClick);
signupBtn.addEventListener("click", SignUpClick);

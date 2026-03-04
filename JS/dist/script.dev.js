"use strict";

var Password = document.querySelector(".password");
var ConfirmPassword = document.querySelector(".confirm-password");
var eye_OpenPassword = document.querySelector(".eye_open--password");
var eye_OpenConfirmPassword = document.querySelector(".eye_open--password_confirmation");
var eye_ClosePassword = document.querySelector(".eye_close--password");
var eye_CloseConfirmPassword = document.querySelector(".eye_close--password_confirmation");
var welcomeMSG = document.querySelector(".section_login--container_title--1");
var accountCreateMSG = document.querySelector(".section_login--container_title--2");
var loginBtn = document.querySelector(".section_login--container_btn--1");
var signupBtn = document.querySelector(".section_login--container_btn--2");
var submitLoginBtn = document.querySelector(".submit_btn--login");
var submitSignupBtn = document.querySelector(".submit_btn--create");
var userName = document.querySelector(".section_login--container_form--userName");
var userNameInput = document.querySelector(".section_login--container_form--userNameInput");
var email = document.querySelector(".section_login--container_form--Email");
var emailInput = document.querySelector(".section_login--container_form--EmailInput");
var confirmPassword = document.querySelector(".section_login--container_form--confirmPassword");
var confirmPasswordContainer = document.querySelector(".section_login--container_form--confirmPassword_container");
var fullName = document.querySelector(".section_login--container_form--fullName");
var fullNameInput = document.querySelector(".section_login--container_form--fullNameInput");
var semester = document.querySelector(".section_login--container_form--semester");
var semesterOption = document.querySelector(".section_login--container_form--options");
var hiddenElements = [fullName, fullNameInput, userName, userNameInput, confirmPasswordContainer, confirmPassword, semester, semesterOption];

var passwordToggle = function passwordToggle() {
  if (Password.type === "password") {
    Password.type = "text";
    eye_OpenPassword.style.zIndex = 2;
    eye_ClosePassword.style.zIndex = -2;
  } else if (Password.type = "text") {
    Password.type = "password";
    eye_OpenPassword.style.zIndex = -2;
    eye_ClosePassword.style.zIndex = 2;
  }
};

var passwordConfirmToggle = function passwordConfirmToggle() {
  if (ConfirmPassword.type === "password") {
    ConfirmPassword.type = "text";
    eye_OpenConfirmPassword.style.zIndex = 2;
    eye_CloseConfirmPassword.style.zIndex = -2;
  } else if (ConfirmPassword.type = "text") {
    ConfirmPassword.type = "password";
    eye_OpenConfirmPassword.style.zIndex = -2;
    eye_CloseConfirmPassword.style.zIndex = 2;
  }
};

var LoginClick = function LoginClick() {
  loginBtn.classList.add("section_login--container_btn--active");
  signupBtn.classList.remove("section_login--container_btn--active");
  accountCreateMSG.style.display = "none";
  welcomeMSG.style.display = "block";
  submitLoginBtn.classList.add("active_submit--btn");
  submitSignupBtn.classList.remove("active_submit--btn");
  hiddenElements.forEach(function (el) {
    return el.classList.add("hideElement");
  });
  email.textContent = "Username / Email";
  emailInput.placeholder = "Username or Email";
};

var SignUpClick = function SignUpClick() {
  signupBtn.classList.add("section_login--container_btn--active");
  loginBtn.classList.remove("section_login--container_btn--active");
  accountCreateMSG.style.display = "block";
  welcomeMSG.style.display = "none";
  submitSignupBtn.classList.add("active_submit--btn");
  submitLoginBtn.classList.remove("active_submit--btn");
  hiddenElements.forEach(function (el) {
    return el.classList.remove("hideElement");
  });
  email.textContent = "Email";
  emailInput.placeholder = "xyz@gmail.com";
};

eye_CloseConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_ClosePassword.addEventListener("click", passwordToggle);
eye_OpenConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_OpenPassword.addEventListener("click", passwordToggle);
loginBtn.addEventListener("click", LoginClick);
signupBtn.addEventListener("click", SignUpClick);
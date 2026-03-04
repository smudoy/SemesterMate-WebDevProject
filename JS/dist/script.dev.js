"use strict";

var Password = document.querySelector(".password");
var ConfirmPassword = document.querySelector(".confirm-password");
var eye_OpenPassword = document.querySelector(".eye_open--password");
var eye_OpenConfirmPassword = document.querySelector(".eye_open--password_confirmation");
var eye_ClosePassword = document.querySelector(".eye_close--password");
var eye_CloseConfirmPassword = document.querySelector(".eye_close--password_confirmation");

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

eye_CloseConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_ClosePassword.addEventListener("click", passwordToggle);
eye_OpenConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_OpenPassword.addEventListener("click", passwordToggle);
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

eye_CloseConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_ClosePassword.addEventListener("click", passwordToggle);
eye_OpenConfirmPassword.addEventListener("click", passwordConfirmToggle);
eye_OpenPassword.addEventListener("click", passwordToggle);

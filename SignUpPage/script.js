const LoginBtn = document.querySelector(".login-btn");
const EyeIcon = document.querySelector(".eye-img");
const Password = document.querySelector(".password-input");

const TogglePassword = function(){
    if(Password.type === 'password'){
        EyeIcon.src = 'visible.png';
        Password.type = 'text';
    }
    else{
        EyeIcon.src = 'hide.png';
        Password.type = 'password';
    }
}

const TogglePage = function(){
    window.location = "../LoginPage/index.html";
}

EyeIcon.addEventListener("click", TogglePassword);

LoginBtn.addEventListener("click", TogglePage);
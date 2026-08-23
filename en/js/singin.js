const createingIdBtn = document.querySelector("#createId-btn");
const numberIDinput = document.querySelector("#number-input");


createingIdBtn.addEventListener("click", () => {
    let id = Math.floor(Math.random() * 100000);


    // اگر ایدی انتخاب شده اشغال شده بود
    // if (id != user.id) {
    //     id = Math.floor(Math.random() * 100000);
    // }

    numberIDinput.value = id;

});

numberIDinput.addEventListener("input", function () {
    let value = this.value;

    // value = value.replace(/[-]/g, d => indexOf(d)."۱۲۳۴۵۶۷۸۹");
    value = value.replace(/\D/g, "")

    this.value = value.slice(0, 7)
});

const togglePasswordBtn = document.querySelector("#togglePassword-btn");
const passwordInput = document.querySelector("#password-input");

togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type == "password") {
        passwordInput.type = "text";
        togglePasswordBtn.innerHTML = '<img src="../assets/images/icons/soldier-open.png" alt="" width="35px">';
    } else {
        passwordInput.type = "password";
        togglePasswordBtn.innerHTML = '<img src="../assets/images/icons/soldier-cloase.png" alt="" width="35px">'
    }


})



// ۱۲۳۴۵۶۷۸۹
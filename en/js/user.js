// دکمه کپی شناسه:
const copyIDbtn = document.querySelector("#copyId-btn");
const userid = document.querySelector("#userid").textContent;

copyIDbtn.addEventListener("click", () => {
    navigator.clipboard.writeText(userid);
    copyIDbtn.textContent = "کپی شد.";
    setTimeout(() => {
        copyIDbtn.textContent = "کپی شناسه";
    }, 1200)
});


// فرایند تغییر رمز عبور
const absoloteCard = document.querySelector("#absolote-card");


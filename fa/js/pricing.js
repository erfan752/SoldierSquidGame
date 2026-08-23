const hambergerMenu = document.querySelector(".hambergerMenu-btn");
const mobileMenu = document.querySelector("#mobile-menu")

hambergerMenu.addEventListener("click", () => {
    hambergerMenu.classList.toggle("active");
    mobileMenu.classList.toggle("active");
})
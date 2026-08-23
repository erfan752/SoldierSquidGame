// بی رنگ کردن هدر زمانی که اسکرول 0 بایشد ====================================
let header = document.querySelector("header");
function noneBGTo0scroll() {
  setInterval(() => {
    if (scrollY === 0) {
      header.style.background = "rgba(0, 0, 0, 0)";
      header.style.justifyContent = " center";
    } else {
      header.style.removeProperty("background");
      header.style.justifyContent = "space-between";
    }
  }, 100);
}
noneBGTo0scroll();

const lenghtUserNav = document.querySelector("#lenght-user");
// const
function animateLenghtUser(lenghtUser) {
  for (let x = 0; x < lenghtUser + 1; x++) {
    setTimeout(() => {}, 100);
    lenghtUserNav.textContent = x;
    // console.log(x);
  }
}

animateLenghtUser(50);

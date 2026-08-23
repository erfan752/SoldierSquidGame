// بی رنگ کردن هدر زمانی که اسکرول 0 بایشد ====================================
let header = document.querySelector("header")
function noneBGTo0scroll() {
    setInterval(() => {
        if (scrollY === 0) {
            header.style.background = "rgba(0, 0, 0, 0)";
        }
        else {
            header.style.removeProperty("background")
        }
    }, 100)
}
noneBGTo0scroll()
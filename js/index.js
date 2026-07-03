let titleText = document.querySelector("#title-text");
const titleTextContent = "آیا میخواهید یک بازی کنیم؟";

let x = 0;

function typing_efect() {
    if (titleText.textContent != titleTextContent) {
        titleText.textContent += titleTextContent[x];
        x += 1;
        setTimeout(typing_efect, 100);
    }
}

typing_efect();


let startNow_card = document.querySelector("#startNow_card");
let orginalTopstartNowCard = startNow_card.offsetTop;

function chackPosition() {
    const rect = startNow_card.getBoundingClientRect();
    if (rect.top <= window.innerHeight - startNow_card.offsetHeight) {
        startNow_card.classList.remove("fixed");
    } else {
        startNow_card.classList.add("fixed");
    }
}

window.addEventListener("scroll", chackPosition())
// window.addEventListener("resize", chackPosition())
chackPosition()





// auto play music:
const music = document.getElementById("music");
function autoPlayingMusic() {
    music.play();
    music.volume = 0.5;
    document.removeEventListener("click", autoPlayingMusic);
    document.removeEventListener("touchstart", autoPlayingMusic);
    document.removeEventListener("keydown", autoPlayingMusic);
}
document.addEventListener("click", autoPlayingMusic);
document.addEventListener("touchstart", autoPlayingMusic);
document.addEventListener("keydown", autoPlayingMusic);

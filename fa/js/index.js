const header = document.querySelector("header");

function updateHeader() {
  if (window.scrollY === 0) {
    header.classList.remove("scrolled");
    document.querySelector("header .header-item:first-child").style.right =
      window.wi;
  } else {
    header.classList.add("scrolled");
  }
}

window.addEventListener("scroll", updateHeader);

updateHeader();

// انیمیشن تعداد کاربران ماهانه سرباز
const monthlyUsers = 23;

const counter = document.getElementById("monthly-users");

const duration = 3500;
const startTime = performance.now();

function formatNumber(value) {
  if ((value >= 1000) & (value < 1000000)) {
    return (
      (value / 1000).toFixed(value % 1000 === 0 ? 0 : 2).replace(/\.?0+$/, "") +
      "K+"
    );
  }

  if (value >= 1000000) {
    return (
      (value / 1000000)
        .toFixed(value % 1000000 === 0 ? 0 : 2)
        .replace(/\.?0+$/, "") + "M+"
    );
  }

  return String(Math.floor(value)).padStart(3, "0") + "+";
}

function updateCounter(currentTime) {
  const progress = Math.min((currentTime - startTime) / duration, 1);

  const value = Math.floor(progress * monthlyUsers);

  counter.textContent = formatNumber(value);

  if (progress < 1) {
    requestAnimationFrame(updateCounter);
  } else {
    counter.textContent = formatNumber(monthlyUsers);
  }
}

requestAnimationFrame(updateCounter);

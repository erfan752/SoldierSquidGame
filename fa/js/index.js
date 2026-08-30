"use strict";

/* =========================
   Header
========================= */

const header = document.querySelector(".site-header");

function updateHeader() {
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 10);
}

let headerTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (headerTicking) return;

    headerTicking = true;

    requestAnimationFrame(() => {
      updateHeader();
      headerTicking = false;
    });
  },
  {passive: true},
);

updateHeader();

/* =========================
   Scroll Reveal
========================= */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

/* =========================
   Staggered Cards
========================= */

const staggerContainers = document.querySelectorAll(".reveal-stagger");

staggerContainers.forEach((container) => {
  const children = Array.from(container.children);

  children.forEach((child, index) => {
    child.style.transitionDelay = `${index * 120}ms`;
    child.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    children.forEach((child) => {
      child.classList.add("is-visible");
    });

    return;
  }

  const staggerObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    },
  );

  children.forEach((child) => {
    staggerObserver.observe(child);
  });
});

/* =========================
   Monthly Users Counter
========================= */

const monthlyUsers = document.getElementById("monthly-users");

const MONTHLY_USERS = 50;
const COUNTER_DURATION = 1800;

function formatNumber(value) {
  if (value >= 1_000_000) {
    const number = (value / 1_000_000)
      .toFixed(value % 1_000_000 === 0 ? 0 : 2)
      .replace(/\.?0+$/, "");

    return `${number}M+`;
  }

  if (value >= 1_000) {
    const number = (value / 1_000)
      .toFixed(value % 1_000 === 0 ? 0 : 2)
      .replace(/\.?0+$/, "");

    return `${number}K+`;
  }

  return `${Math.floor(value).toString().padStart(3, "0")}+`;
}

function animateCounter() {
  if (!monthlyUsers) return;

  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / COUNTER_DURATION, 1);

    // Ease-out cubic
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const value = Math.floor(easedProgress * MONTHLY_USERS);

    monthlyUsers.textContent = formatNumber(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      monthlyUsers.textContent = formatNumber(MONTHLY_USERS);
    }
  }

  requestAnimationFrame(update);
}

/* =========================
   Counter Observer
========================= */

if (monthlyUsers) {
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;

        animateCounter();

        observer.disconnect();
      },
      {
        threshold: 0.4,
      },
    );

    counterObserver.observe(monthlyUsers);
  } else {
    animateCounter();
  }
}

/* =========================
   Menu Button
========================= */

const menuButton = document.querySelector(".menu-button");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isExpanded));
  });
}

const menuToggleBtn = document.getElementById("menu-toggle-btn");
const navDrawer = document.getElementById("nav-drawer");
const navOverlay = document.getElementById("nav-overlay");

function openMenu() {
  navDrawer.classList.add("is-open");
  navOverlay.hidden = false;

  // اجازه بده hidden برداشته شود قبل از افزودن کلاس، تا انیمیشن فید اجرا شود
  requestAnimationFrame(() => {
    navOverlay.classList.add("is-visible");
  });

  menuToggleBtn.setAttribute("aria-expanded", "true");
  menuToggleBtn.classList.add("is-active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navDrawer.classList.remove("is-open");
  navOverlay.classList.remove("is-visible");

  menuToggleBtn.setAttribute("aria-expanded", "false");
  menuToggleBtn.classList.remove("is-active");
  document.body.style.overflow = "";

  // بعد از پایان انیمیشن فید، overlay را کاملاً مخفی کن
  setTimeout(() => {
    navOverlay.hidden = true;
  }, 300);
}

menuToggleBtn.addEventListener("click", () => {
  const isOpen = navDrawer.classList.contains("is-open");
  isOpen ? closeMenu() : openMenu();
});

navOverlay.addEventListener("click", closeMenu);

// بستن منو با کلید Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navDrawer.classList.contains("is-open")) {
    closeMenu();
  }
});
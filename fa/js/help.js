// =========================================================
// Scrollspy: هایلایت کردن بخش فعال در فهرست کناری/نواری
// =========================================================

const tocLinks = document.querySelectorAll(".toc-link");
const helpSections = document.querySelectorAll(".help-section");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        tocLinks.forEach((link) => {
          link.classList.toggle("is-active", link.dataset.section === id);
        });

        // اسکرول خودکار فهرست موبایل تا لینک فعال همیشه دیده شود
        const activeLink = document.querySelector(`.toc-link[data-section="${id}"]`);
        if (activeLink) {
          activeLink.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    });
  },
  {
    rootMargin: "-100px 0px -70% 0px",
    threshold: 0,
  }
);

helpSections.forEach((section) => sectionObserver.observe(section));
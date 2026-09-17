const statusLabels = {
  upcoming: "پیش‌رو",
  ongoing: "درحال برگزاری",
  ended: "پایان‌یافته",
};

const eventsListEl = document.getElementById("events-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let allEvents = [];
let currentFilter = "all";

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";

  card.innerHTML = `
    <div>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <time datetime="${event.date}">تاریخ برگزاری: ${event.date}</time>
    </div>

    <a href="#">
      <button class="view-more-event" type="button">دیدن جزئیات</button>
    </a>
  `;

  return card;
}

function renderEvents() {
  eventsListEl.innerHTML = "";

  const filtered =
    currentFilter === "all"
      ? allEvents
      : allEvents.filter((ev) => ev.status === currentFilter);

  if (filtered.length === 0) {
    const noEvents = document.createElement("div");
    noEvents.className = "no-events";
    noEvents.innerHTML = "<span>ایونتی با این فیلتر یافت نشد.</span>";
    eventsListEl.appendChild(noEvents);
    return;
  }

  filtered.forEach((event) => {
    eventsListEl.appendChild(createEventCard(event));
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".event-card").forEach((card) => {
      requestAnimationFrame(() => card.classList.add("is-visible"));
    });
  });
}

fetch("../data/events.json")
  .then((res) => res.json())
  .then((data) => {
    allEvents = data;
    renderEvents();
  })
  .catch((err) => {
    console.error("خطا در دریافت اطلاعات ایونت‌ها:", err);
    eventsListEl.innerHTML =
      '<div class="no-events"><span>مشکلی در دریافت اطلاعات ایونت‌ها پیش آمد.</span></div>';
  });

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    renderEvents();
  });
});

const staticReveals = document.querySelectorAll(".events-hero.reveal, .filter-bar.reveal, #events.reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

staticReveals.forEach((el) => revealObserver.observe(el));
const eventsListEl = document.getElementById("events-list");

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card reveal";

  card.innerHTML = `
    <div>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <time datetime="${event.date}">تاریخ برگزاری: ${event.date}</time>
    </div>

    <a href="pages/events.html">
      <button class="view-more-event" type="button">دیدن جزئیات</button>
    </a>
  `;

  return card;
}

fetch("data/events.json")
  .then((res) => res.json())
  .then((events) => {
    if (!events || events.length === 0) {
      eventsListEl.innerHTML = `
        <div class="no-events">
          <span>ایونت دیگری نیست.</span>
        </div>
      `;
      return;
    }

    // فقط ۳ تای اول به‌عنوان پیش‌نمایش
    const preview = events.slice(0, 3);

    preview.forEach((event) => {
      eventsListEl.appendChild(createEventCard(event));
    });

    // فعال کردن انیمیشن reveal برای کارت‌های تازه‌اضافه‌شده
    const revealEls = eventsListEl.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  })
  .catch((err) => {
    console.error("خطا در دریافت اطلاعات ایونت‌ها:", err);
    eventsListEl.innerHTML = `
      <div class="no-events">
        <span>مشکلی در دریافت اطلاعات ایونت‌ها پیش آمد.</span>
      </div>
    `;
  });
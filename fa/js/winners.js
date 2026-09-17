const AVATAR_BASE = "../../shared/images/profile-icon/";

const seasonsContainer = document.getElementById("seasons-container");
const noWinnersEl = document.getElementById("no-winners");

// ساخت یک بلوک کامل فصل (سکو + بقیه رتبه‌ها)
function createSeasonBlock(season) {
  const top3 = season.winners.filter((w) => w.rank <= 3);
  const rest = season.winners.filter((w) => w.rank > 3);

  const block = document.createElement("section");
  block.className = "season-block reveal";

  block.innerHTML = `
    <div class="season-header">
      <h2 class="season-title">${season.seasonTitle}</h2>
      <span class="season-sub">${season.eventName} — ${season.endDate}</span>
    </div>

    <div class="podium">
      ${top3.map((w) => renderPodiumPlace(w)).join("")}
    </div>

    ${rest.length ? `<div class="other-ranks">${rest.map((w) => renderRankRow(w)).join("")}</div>` : ""}
  `;

  return block;
}

function renderPodiumPlace(winner) {
  const crown = winner.rank === 1 ? `<span class="crown">👑</span>` : "";

  return `
    <div class="podium-place rank-${winner.rank}">
      ${crown}
      <span class="rank-badge">#${winner.rank}</span>
      <div class="podium-avatar">
        <img src="${AVATAR_BASE}${winner.avatar}" alt="${winner.username}" />
      </div>
      <div class="podium-username">${winner.username}</div>
      <div class="podium-prize">${winner.prize}</div>
    </div>
  `;
}

function renderRankRow(winner) {
  return `
    <div class="rank-row">
      <span class="rank-number">#${winner.rank}</span>
      <img src="${AVATAR_BASE}${winner.avatar}" alt="${winner.username}" />
      <span class="rank-username">${winner.username}</span>
      <span class="rank-prize">${winner.prize}</span>
    </div>
  `;
}

// گرفتن دیتا و رندر
fetch("../data/winners.json")
  .then((res) => res.json())
  .then((seasons) => {
    if (!seasons || seasons.length === 0) {
      noWinnersEl.hidden = false;
      return;
    }

    seasons.forEach((season) => {
      seasonsContainer.appendChild(createSeasonBlock(season));
    });

    // فعال کردن انیمیشن reveal بعد از اضافه شدن به DOM
    const revealEls = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  })
  .catch((err) => {
    console.error("خطا در دریافت اطلاعات برندگان:", err);
    noWinnersEl.hidden = false;
    noWinnersEl.querySelector("span").textContent =
      "مشکلی در دریافت اطلاعات برندگان پیش آمد.";
  });
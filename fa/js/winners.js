const AVATAR_BASE = "../../shared/images/profile-icon/";

const seasonsContainer = document.getElementById("seasons-container");
const noWinnersEl = document.getElementById("no-winners");

// ساخت یک بلوک کامل فصل (سکو + بقیه رتبه‌ها)
function createSeasonBlock(season, winStats) {
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
      ${top3.map((w) => renderPodiumPlace(w, winStats)).join("")}
    </div>

    ${rest.length ? `<div class="other-ranks">${rest.map((w) => renderRankRow(w, winStats)).join("")}</div>` : ""}
  `;

  return block;
}


// استخراج عدد ابتدای اسم فایل آواتار (مثلاً از "456-profile-icon.jpg" عدد "456")
function extractAvatarNumber(avatarFile) {
  const match = avatarFile.match(/^(\d+)/);
  return match ? match[1] : "";
}


function renderPodiumPlace(winner, winStats) {
  const stat = winStats[winner.userId] || { count: 0, lastPlatform: null };
  const badge = RankSystem.renderBadge(stat.count, stat.lastPlatform);
  const avatarNumber = extractAvatarNumber(winner.avatar);

  const rankMarker =
    winner.rank === 1
      ? `<span class="podium-top-rank">#1</span>`
      : `<span class="podium-rank-number">#${winner.rank}</span>`;

  return `
    <div class="podium-place rank-${winner.rank}">
      ${rankMarker}

      <div class="podium-avatar-wrap">
        <a href="user.html?id=${winner.userId}" class="podium-avatar">
          <img src="${AVATAR_BASE}${winner.avatar}" alt="${winner.username}" />
        </a>
        ${avatarNumber ? `<span class="podium-avatar-number">${avatarNumber}</span>` : ""}
      </div>

      <div class="podium-username">
        <a href="user.html?id=${winner.userId}">${winner.username}</a> ${badge}
      </div>

      <div class="podium-user-id">${winner.userId}</div>

      <div class="podium-prize">برنده بازی</div>
    </div>
  `;
}

function renderRankRow(winner, winStats) {
  const stat = winStats[winner.userId] || { count: 0, lastPlatform: null };
  const badge = RankSystem.renderBadge(stat.count, stat.lastPlatform);

  return `
    <div class="rank-row">
      <span class="rank-number">#${winner.rank}</span>
      <img src="${AVATAR_BASE}${winner.avatar}" alt="${winner.username}" />
      <span class="rank-username">
        <a href="user.html?id=${winner.userId}">${winner.username}</a> ${badge}
      </span>
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

    const winStats = RankSystem.computeWinStats(seasons);

    seasons.forEach((season) => {
      seasonsContainer.appendChild(createSeasonBlock(season, winStats));
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
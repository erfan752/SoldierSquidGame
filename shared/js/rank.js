// =========================================================
// سیستم رتبه‌بندی بر اساس تعداد برد در تورنومنت‌های رسمی
// (winners.json) — فقط اسامی که در winners.json ثبت شده‌اند
// =========================================================

const RankSystem = {
  ICONS: {
    legendary: "../../shared/images/icons/Ranks/gold-pigi-legendery.png",
    mythic: "../../shared/images/icons/Ranks/gold-pigi-mythik.png",
    "platform-bale": "../../shared/images/icons/Ranks/bale.legengdery.png",
    "platform-telegram": "../../shared/images/icons/Ranks/telegram-legengdery.png",
    "platform-bale-legend": "../../shared/images/icons/Ranks/bale-mythik.png",
    "platform-telegram-legend": "../../shared/images/icons/Ranks/telegram-mythik.png",
  },

  LABELS: {
    legendary: "لجندری",
    mythic: "متیک",
    "platform-bale": "بله لجند",
    "platform-telegram": "تلگرام لجند",
    "platform-bale-legend": "بله متیک",
    "platform-telegram-legend": "تلگرام متیک",
  },

  DESCRIPTIONS: {
    legendary: "این نشان به بازیکنانی تعلق می‌گیرد که ۲ بار در تورنومنت‌های رسمی سرباز برنده شده‌اند.",
    mythic: "این نشان به بازیکنانی تعلق می‌گیرد که ۳ بار در تورنومنت‌های رسمی سرباز برنده شده‌اند؛ رتبه‌ای بالاتر از لجندری.",
    "platform-bale": "این بازیکن ۴ بار برنده شده و آخرین برد او در نسخه بله بوده است.",
    "platform-telegram": "این بازیکن ۴ بار برنده شده و آخرین برد او در نسخه تلگرام بوده است.",
    "platform-bale-legend": "بالاترین رتبه ممکن؛ این بازیکن ۵ بار یا بیشتر برنده شده و آخرین برد او در نسخه بله بوده است.",
    "platform-telegram-legend": "بالاترین رتبه ممکن؛ این بازیکن ۵ بار یا بیشتر برنده شده و آخرین برد او در نسخه تلگرام بوده است.",
  },

  // شمارش برد هر کاربر و آخرین پلتفرمی که در آن برده
  computeWinStats(seasons) {
    const stats = {}; // userId -> { count, lastPlatform, lastDate }

    seasons.forEach((season) => {
      (season.winners || []).forEach((winner) => {
        if (!winner.userId) return;

        if (!stats[winner.userId]) {
          stats[winner.userId] = { count: 0, lastPlatform: null, lastDate: null };
        }

        stats[winner.userId].count += 1;

        if (!stats[winner.userId].lastDate || season.endDate > stats[winner.userId].lastDate) {
          stats[winner.userId].lastDate = season.endDate;
          stats[winner.userId].lastPlatform = season.platform;
        }
      });
    });

    return stats;
  },

  getTier(winCount, lastPlatform) {
    if (winCount >= 5) {
      return lastPlatform === "bale" ? "platform-bale-legend" : "platform-telegram-legend";
    }
    if (winCount === 4) {
      return lastPlatform === "bale" ? "platform-bale" : "platform-telegram";
    }
    if (winCount === 3) {
      return "mythic";
    }
    if (winCount === 2) {
      return "legendary";
    }
    return null;
  },

  // تولید HTML نشان (فقط آیکون، بدون متن) — کلیک‌پذیر برای باز کردن جزئیات
  renderBadge(winCount, lastPlatform) {
    const tier = this.getTier(winCount, lastPlatform);
    if (!tier) return "";

    const icon = this.ICONS[tier];
    const iconHtml = icon ? `<img src="${icon}" alt="${this.LABELS[tier]}" />` : "";

    return `
      <button
        type="button"
        class="rank-badge rank-badge--${tier}"
        data-rank-tier="${tier}"
        aria-label="نشان ${this.LABELS[tier]}"
      >
        ${iconHtml}
      </button>
    `;
  },
};

// =========================================================
// شیت جزئیات رتبه (از پایین صفحه باز می‌شود)
// =========================================================

const RankSheet = {
  _sheet: null,
  _overlay: null,

  _ensureBuilt() {
    if (this._sheet) return;

    const overlay = document.createElement("div");
    overlay.className = "rank-sheet-overlay";
    overlay.id = "rank-sheet-overlay";

    const sheet = document.createElement("div");
    sheet.className = "rank-sheet";
    sheet.id = "rank-sheet";
    sheet.innerHTML = `
      <div class="rank-sheet-handle"></div>
      <div class="rank-sheet-icon" id="rank-sheet-icon"></div>
      <h3 class="rank-sheet-title" id="rank-sheet-title"></h3>
      <p class="rank-sheet-desc" id="rank-sheet-desc"></p>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sheet);

    overlay.addEventListener("click", () => this.close());

    this._overlay = overlay;
    this._sheet = sheet;
  },

  open(tier) {
    this._ensureBuilt();

    const icon = RankSystem.ICONS[tier];
    const label = RankSystem.LABELS[tier] || "";
    const desc = RankSystem.DESCRIPTIONS[tier] || "";

    const iconEl = document.getElementById("rank-sheet-icon");
    iconEl.innerHTML = icon ? `<img src="${icon}" alt="${label}" />` : "";

    document.getElementById("rank-sheet-title").textContent = label;
    document.getElementById("rank-sheet-desc").textContent = desc;

    this._overlay.hidden = false;
    this._sheet.hidden = false;

    requestAnimationFrame(() => {
      this._overlay.classList.add("is-visible");
      this._sheet.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
  },

  close() {
    if (!this._sheet) return;

    this._overlay.classList.remove("is-visible");
    this._sheet.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      this._overlay.hidden = true;
      this._sheet.hidden = true;
    }, 300);
  },
};

document.addEventListener("click", (e) => {
  const badge = e.target.closest(".rank-badge");
  if (!badge) return;

  const tier = badge.dataset.rankTier;
  if (tier) {
    RankSheet.open(tier);
  }
});
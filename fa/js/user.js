// =========================================================
// شناسه‌ی کاربر لاگین‌شده (فعلاً شبیه‌سازی‌شده)
// TODO: وقتی بک‌اند و سیستم لاگین آماده شد، این مقدار باید
// از سشن/توکن واقعی کاربر خوانده شود، نه یک مقدار ثابت.
// =========================================================
const CURRENT_USER_ID = "SDL-123456";

// خواندن شناسه‌ی درخواستی از URL
const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");

const viewedUserId = requestedId || CURRENT_USER_ID;
const isOwnProfile = viewedUserId === CURRENT_USER_ID;

// =========================================================
// نمایش عدد آواتار
// =========================================================
const avatarImg = document.getElementById("avatar-img");
const avatarNumber = document.getElementById("avatar-number");

if (avatarImg && avatarNumber) {
  avatarNumber.textContent = avatarImg.dataset.number || "";
}

// =========================================================
// نمایش شناسه‌ی کاربر مشاهده‌شده
// =========================================================
const userIdEl = document.getElementById("user-id");
if (userIdEl) {
  userIdEl.textContent = viewedUserId;
}

// =========================================================
// جابه‌جایی بین حالت «خودم» و «دیگری»
// =========================================================
const ownOnlyControls = document.querySelectorAll("[data-own-only]");
const otherOnlyControls = document.querySelectorAll("[data-other-only]");

ownOnlyControls.forEach((el) => {
  el.hidden = !isOwnProfile;
});

otherOnlyControls.forEach((el) => {
  el.hidden = isOwnProfile;
});

// =========================================================
// کپی شناسه
// =========================================================
const copyIdBtn = document.getElementById("copy-id-btn");

if (copyIdBtn && userIdEl) {
  copyIdBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(userIdEl.textContent.trim());
      const originalText = copyIdBtn.textContent;
      copyIdBtn.textContent = "کپی شد!";
      setTimeout(() => {
        copyIdBtn.textContent = originalText;
      }, 1500);
    } catch (err) {
      console.error("کپی انجام نشد:", err);
    }
  });
}

// =========================================================
// دکمه‌های «دیگری»: افزودن دوست / دیدن پروفایل بله و تلگرام
// TODO: اتصال واقعی به بک‌اند برای ارسال درخواست دوستی
// و باز کردن لینک واقعی پروفایل بله/تلگرام کاربر
// =========================================================
const addFriendBtn = document.getElementById("add-friend-btn");

if (addFriendBtn) {
  addFriendBtn.addEventListener("click", () => {
    addFriendBtn.textContent = "درخواست ارسال شد";
    addFriendBtn.disabled = true;
  });
}

// =========================================================
// نمایش بادج رتبه کنار شماره آواتار
// =========================================================
fetch("../data/winners.json")
  .then((res) => res.json())
  .then((seasons) => {
    const winStats = RankSystem.computeWinStats(seasons);
    const stat = winStats[viewedUserId] || { count: 0, lastPlatform: null };
    const badge = RankSystem.renderBadge(stat.count, stat.lastPlatform);

    const badgeContainer = document.getElementById("avatar-rank-badge");
    if (badgeContainer) {
      badgeContainer.innerHTML = badge;
    }
  })
  .catch((err) => {
    console.error("خطا در دریافت اطلاعات رتبه:", err);
  });
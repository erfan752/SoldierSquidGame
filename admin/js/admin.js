// نمایش عدد آواتار بر اساس data-number
const avatarImg = document.getElementById("avatar-img");
const avatarNumber = document.getElementById("avatar-number");

if (avatarImg && avatarNumber) {
  avatarNumber.textContent = avatarImg.dataset.number || "";
}

// کپی شناسه ادمین
const copyIdBtn = document.getElementById("copy-id-btn");
const adminIdEl = document.getElementById("admin-id");

if (copyIdBtn && adminIdEl) {
  copyIdBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(adminIdEl.textContent.trim());
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

// نمایش/مخفی کردن فیلد تعداد روز دلخواه در فرم اهدای اشتراک
const grantPlanSelect = document.getElementById("grant-plan");
const customDaysRow = document.getElementById("custom-days-row");

if (grantPlanSelect && customDaysRow) {
  grantPlanSelect.addEventListener("change", () => {
    customDaysRow.hidden = grantPlanSelect.value !== "custom";
  });
}

// --- فرم اهدای اشتراک ---
const grantForm = document.getElementById("grant-sub-form");
const grantsBody = document.getElementById("grants-body");

if (grantForm && grantsBody) {
  grantForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userId = document.getElementById("grant-user-id").value.trim();
    const platform = document.getElementById("grant-platform").value;
    const plan = document.getElementById("grant-plan").value;

    const platformLabel = { bale: "بله", telegram: "تلگرام" }[platform] || platform;
    const planLabel =
      { weekly: "هفتگی", biweekly: "۱۵ روزه", monthly: "ماهانه", custom: "دلخواه" }[plan] || plan;

    // TODO: اتصال به Cloudflare Worker برای ثبت واقعی اهدای اشتراک
    const emptyRow = grantsBody.querySelector(".empty-row");
    if (emptyRow) emptyRow.closest("tr").remove();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${userId}</td>
      <td>${platformLabel}</td>
      <td>${planLabel}</td>
      <td>${new Date().toLocaleDateString("fa-IR")}</td>
      <td>SDL-000001</td>
    `;
    grantsBody.prepend(row);

    grantForm.reset();
    customDaysRow.hidden = true;
  });
}

// --- فرم نوشتن مقاله ---
const articleForm = document.getElementById("article-form");
const articlesBody = document.getElementById("articles-body");

if (articleForm && articlesBody) {
  articleForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("article-title").value.trim();
    const category = document.getElementById("article-category").value;
    const categoryLabel =
      { news: "اخبار", guide: "راهنما", update: "به‌روزرسانی" }[category] || category;

    // TODO: اتصال به Cloudflare Worker برای ذخیره واقعی مقاله
    const emptyRow = articlesBody.querySelector(".empty-row");
    if (emptyRow) emptyRow.closest("tr").remove();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${title}</td>
      <td>${categoryLabel}</td>
      <td>${new Date().toLocaleDateString("fa-IR")}</td>
      <td>منتشرشده</td>
      <td>
        <button class="row-action edit" type="button">ویرایش</button>
        <button class="row-action delete" type="button">حذف</button>
      </td>
    `;
    articlesBody.prepend(row);

    articleForm.reset();
  });
}

// --- فرم افزودن تورنومنت ---
const tournamentForm = document.getElementById("tournament-form");
const tournamentsBody = document.getElementById("tournaments-body");

if (tournamentForm && tournamentsBody) {
  tournamentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("tournament-name").value.trim();
    const platform = document.getElementById("tournament-platform").value;
    const date = document.getElementById("tournament-date").value;
    const prize = document.getElementById("tournament-prize").value.trim();

    const platformLabel =
      { bale: "بله", telegram: "تلگرام", both: "هر دو" }[platform] || platform;

    // TODO: اتصال به Cloudflare Worker برای ثبت واقعی تورنومنت
    const emptyRow = tournamentsBody.querySelector(".empty-row");
    if (emptyRow) emptyRow.closest("tr").remove();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${platformLabel}</td>
      <td>${date}</td>
      <td>${prize}</td>
      <td>آینده</td>
      <td>
        <button class="row-action edit" type="button">ویرایش</button>
        <button class="row-action delete" type="button">حذف</button>
      </td>
    `;
    tournamentsBody.prepend(row);

    tournamentForm.reset();
  });
}
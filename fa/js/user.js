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
// نمایش بادج رتبه کنار نام کاربر
// =========================================================
fetch("../data/winners.json")
  .then((res) => res.json())
  .then((seasons) => {
    const winStats = RankSystem.computeWinStats(seasons);
    const stat = winStats[viewedUserId] || {count: 0, lastPlatform: null};
    const badge = RankSystem.renderBadge(stat.count, stat.lastPlatform);

    const badgeContainer = document.getElementById("avatar-rank-badge");
    if (badgeContainer) {
      badgeContainer.innerHTML = badge;
    }
  })
  .catch((err) => {
    console.error("خطا در دریافت اطلاعات رتبه:", err);
  });

// =========================================================
// ویرایش نام
// =========================================================
const nameBtn = document.getElementById("name-btn");
const userNameEl = document.getElementById("user-name");

if (nameBtn && userNameEl) {
  nameBtn.addEventListener("click", () => {
    // فقط متن اسم را می‌گیریم، نه بادج رتبه که داخل همین span است
    const currentName = userNameEl.childNodes[0].textContent.trim();

    EditModal.open({
      title: "ویرایش نام",
      fields: [
        {id: "name", label: "نام جدید", type: "text", value: currentName},
      ],
      validate: (values) => {
        if (!values.name) return "نام نمی‌تواند خالی باشد.";
        if (values.name.length > 20)
          return "نام نباید بیشتر از ۲۰ کاراکتر باشد.";
        return null;
      },
      onSave: (values) => {
        // TODO: اتصال واقعی به Worker برای ذخیره‌ی نام
        userNameEl.childNodes[0].textContent = values.name + " ";
      },
    });
  });
}

// =========================================================
// ثبت / تغییر ایمیل
// =========================================================
const emailBtn = document.getElementById("email-btn");
const userEmailEl = document.getElementById("user-email");

if (emailBtn && userEmailEl) {
  emailBtn.addEventListener("click", () => {
    const currentEmail =
      userEmailEl.textContent.trim() === "ثبت نشده"
        ? ""
        : userEmailEl.textContent.trim();

    EditModal.open({
      title: "ثبت / تغییر ایمیل",
      fields: [
        {
          id: "email",
          label: "آدرس ایمیل",
          type: "email",
          value: currentEmail,
          placeholder: "example@mail.com",
        },
      ],
      validate: (values) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email))
          return "ایمیل وارد شده معتبر نیست.";
        return null;
      },
      onSave: (values) => {
        // TODO: اتصال واقعی به Worker برای ذخیره‌ی ایمیل
        userEmailEl.textContent = values.email;
      },
    });
  });
}

// =========================================================
// تغییر رمز
// =========================================================
const passwordBtn = document.getElementById("password-btn");

if (passwordBtn) {
  passwordBtn.addEventListener("click", () => {
    EditModal.open({
      title: "تغییر رمز عبور",
      fields: [
        {
          id: "newPassword",
          label: "رمز جدید",
          type: "password",
          placeholder: "حداقل ۶ کاراکتر",
        },
        {id: "confirmPassword", label: "تکرار رمز جدید", type: "password"},
      ],
      validate: (values) => {
        if (values.newPassword.length < 6)
          return "رمز باید حداقل ۶ کاراکتر باشد.";
        if (values.newPassword !== values.confirmPassword)
          return "رمزهای وارد شده یکسان نیستند.";
        return null;
      },
      onSave: () => {
        // TODO: اتصال واقعی به Worker برای تغییر رمز
        alert("رمز عبور با موفقیت تغییر کرد. (شبیه‌سازی‌شده)");
      },
    });
  });
}
// =========================================================
// دکمه‌های «خودم»: لیست دوستان / افزودن پروفایل بله و تلگرام
// TODO: اتصال واقعی به بک‌اند
// =========================================================

const friendsListBtn = document.getElementById("friends-list-btn");
if (friendsListBtn) {
  friendsListBtn.addEventListener("click", () => {
    EditModal.open({
      title: "لیست دوستان",
      fields: [],
      onSave: () => {},
    });

    // چون فیلدی نداریم، فقط یه پیام اطلاع‌رسانی داخل مودال می‌گذاریم
    const modalBody = document.querySelector(".edit-modal");
    if (modalBody) {
      const info = document.createElement("p");
      info.style.color = "#999";
      info.style.fontSize = "0.88rem";
      info.style.textAlign = "center";
      info.style.margin = "10px 0 20px";
      info.textContent = "این قابلیت به‌زودی اضافه می‌شود.";
      modalBody.querySelector("#edit-modal-form").prepend(info);
    }
  });
}

const baleProfileBtn = document.getElementById("bale-profile-btn");
if (baleProfileBtn) {
  baleProfileBtn.addEventListener("click", () => {
    EditModal.open({
      title: "پروفایل بله",
      fields: [
        {
          id: "baleUsername",
          label: "یوزرنیم یا لینک پروفایل بله",
          type: "text",
          placeholder: "مثلاً @soldier_player",
        },
      ],
      validate: (values) => {
        if (!values.baleUsername) return "این فیلد نمی‌تواند خالی باشد.";
        return null;
      },
      onSave: (values) => {
        // TODO: اتصال واقعی به Worker برای ذخیره‌ی لینک پروفایل بله
        console.log("پروفایل بله ثبت شد:", values.baleUsername);
      },
    });
  });
}

const telegramProfileBtn = document.getElementById("telegram-profile-btn");
if (telegramProfileBtn) {
  telegramProfileBtn.addEventListener("click", () => {
    EditModal.open({
      title: "پروفایل تلگرام",
      fields: [
        {
          id: "telegramUsername",
          label: "یوزرنیم یا لینک پروفایل تلگرام",
          type: "text",
          placeholder: "مثلاً @soldier_player",
        },
      ],
      validate: (values) => {
        if (!values.telegramUsername) return "این فیلد نمی‌تواند خالی باشد.";
        return null;
      },
      onSave: (values) => {
        // TODO: اتصال واقعی به Worker برای ذخیره‌ی لینک پروفایل تلگرام
        console.log("پروفایل تلگرام ثبت شد:", values.telegramUsername);
      },
    });
  });
}


// =========================================================
// تغییر آواتار
// =========================================================
const avatarBtn = document.getElementById("avatar-btn");

const AVAILABLE_AVATARS = [
  { file: "067-profile-icon.jpeg", label: "067" },
  { file: "333-profile-icon.png", label: "333" },
  { file: "456-profile-icon.jpg", label: "456" },
  { file: "frontman-profile-icon.png", label: "001" },
  { file: "soldier-profile-icon.png", label: "SLD" },
];

if (avatarBtn && avatarImg) {
  avatarBtn.addEventListener("click", () => {
    const currentFile = avatarImg.src.split("/").pop();

    AvatarPicker.open({
      avatars: AVAILABLE_AVATARS,
      currentFile,
      basePath: "../../shared/images/profile-icon/",
      onConfirm: (avatar) => {
        // TODO: اتصال واقعی به Worker برای ذخیره‌ی آواتار جدید
        avatarImg.src = `../../shared/images/profile-icon/${avatar.file}`;
        avatarImg.dataset.number = avatar.label;
        avatarNumber.textContent = avatar.label;
      },
    });
  });
}
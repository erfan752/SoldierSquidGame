// =========================================================
// دیتای پلن‌ها (فعلاً ثابت - بعداً می‌تواند از API بیاید)
// =========================================================
const PLANS = {
  weekly: {
    name: "اشتراک هفتگی",
    price: 39000,
    highlight: false,
    features: [
      "دسترسی به همه بازی‌های سرباز",
      "اولویت در صف بازی",
      "نشان اختصاصی هفتگی",
    ],
  },
  biweekly: {
    name: "اشتراک ۱۵ روزه",
    price: 79000,
    highlight: true,
    features: [
      "همه امکانات پلن هفتگی",
      "شرکت در تورنومنت‌های ویژه",
      "نشان اختصاصی ۱۵ روزه",
      "پشتیبانی اولویت‌دار",
    ],
  },
  monthly: {
    name: "اشتراک ماهانه",
    price: 139000,
    highlight: false,
    features: [
      "همه امکانات پلن ۱۵ روزه",
      "بیشترین صرفه‌جویی",
      "نشان اختصاصی ماهانه",
      "اولویت در قرعه‌کشی جوایز",
    ],
  },
};

// =========================================================
// کدهای هدیه (فعلاً نمونه - بعداً باید از Worker استعلام شود)
// =========================================================
const GIFT_CODES = {
  SOLDIER10: { type: "percent", value: 10 },
  WELCOME20: { type: "percent", value: 20 },
  FIXED15K: { type: "fixed", value: 15000 },
};

let appliedDiscount = 0;

// =========================================================
// خواندن پلن انتخاب‌شده از URL
// =========================================================
const params = new URLSearchParams(window.location.search);
const selectedPlanKey = params.get("plan");
const selectedPlan = PLANS[selectedPlanKey] || PLANS.weekly;

// =========================================================
// تابع به‌روزرسانی خلاصه قیمت (قیمت پایه / تخفیف / مبلغ نهایی)
// =========================================================
function updateSummaryTotals() {
  const basePrice = selectedPlan.price;
  const finalPrice = Math.max(basePrice - appliedDiscount, 0);

  const priceEl = document.getElementById("summary-price");
  const discountRow = document.getElementById("discount-row");
  const discountEl = document.getElementById("summary-discount");
  const totalEl = document.getElementById("summary-total");

  priceEl.textContent = `${basePrice.toLocaleString("fa-IR")} تومان`;
  priceEl.classList.toggle("has-discount", appliedDiscount > 0);

  if (appliedDiscount > 0) {
    discountRow.hidden = false;
    discountEl.textContent = `${appliedDiscount.toLocaleString("fa-IR")} تومان-`;
  } else {
    discountRow.hidden = true;
  }

  totalEl.textContent = `${finalPrice.toLocaleString("fa-IR")} تومان`;
}

// =========================================================
// پر کردن خلاصه سفارش
// =========================================================
document.getElementById("summary-plan-name").textContent = selectedPlan.name;

const badgeEl = document.getElementById("summary-plan-badge");
if (selectedPlan.highlight) {
  badgeEl.hidden = false;
}

const featuresEl = document.getElementById("summary-features");
featuresEl.innerHTML = selectedPlan.features
  .map((f) => `<li>${f}</li>`)
  .join("");

updateSummaryTotals();

// =========================================================
// اعمال کد هدیه
// TODO: بعداً باید کد هدیه از طریق Worker استعلام و اعتبارسنجی شود
// =========================================================
const giftCodeInput = document.getElementById("checkout-gift-code");
const applyGiftBtn = document.getElementById("apply-gift-code-btn");
const giftMessageEl = document.getElementById("gift-code-message");

applyGiftBtn.addEventListener("click", () => {
  const code = giftCodeInput.value.trim().toUpperCase();

  if (!code) {
    giftMessageEl.textContent = "لطفاً یک کد وارد کنید.";
    giftMessageEl.className = "gift-code-message error";
    return;
  }

  const giftData = GIFT_CODES[code];

  if (!giftData) {
    appliedDiscount = 0;
    giftMessageEl.textContent = "کد هدیه معتبر نیست.";
    giftMessageEl.className = "gift-code-message error";
    updateSummaryTotals();
    return;
  }

  appliedDiscount =
    giftData.type === "percent"
      ? Math.round((selectedPlan.price * giftData.value) / 100)
      : giftData.value;

  giftMessageEl.textContent = "کد هدیه با موفقیت اعمال شد.";
  giftMessageEl.className = "gift-code-message success";

  giftCodeInput.disabled = true;
  applyGiftBtn.disabled = true;
  applyGiftBtn.textContent = "اعمال شد";

  updateSummaryTotals();
});

// =========================================================
// ارسال فرم (شبیه‌سازی‌شده)
// TODO: اتصال واقعی به Cloudflare Worker برای ثبت سفارش
// و اتصال به درگاه پرداخت واقعی
// =========================================================
const checkoutForm = document.getElementById("checkout-form");
const successOverlay = document.getElementById("success-overlay");

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const orderData = {
    plan: selectedPlanKey,
    userId: document.getElementById("checkout-user-id").value.trim(),
    platform: document.getElementById("checkout-platform").value,
    groupId: document.getElementById("checkout-group-id").value.trim(),
    groupUsername: document
      .getElementById("checkout-group-username")
      .value.trim(),
    paymentMethod: document.querySelector(
      'input[name="payment-method"]:checked',
    ).value,
    giftCode: giftCodeInput.value.trim() || null,
    discountApplied: appliedDiscount,
    finalPrice: Math.max(selectedPlan.price - appliedDiscount, 0),
  };

  console.log("سفارش ثبت‌شده (شبیه‌سازی‌شده):", orderData);

  // فعلاً به‌جای اتصال واقعی به درگاه، مستقیم پیام موفقیت نشان داده می‌شود
  successOverlay.hidden = false;
});
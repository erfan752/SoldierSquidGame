// =========================================================
// کامپوننت مشترک کارت لودینگ
// استفاده در هر صفحه:
//   1. لینک دادن shared/css/loading.css
//   2. اسکریپت shared/js/loading.js
//   3. صدا زدن SoldierLoading.show({ logo: "مسیر نسبی لوگو" })
//   4. بعد از آماده شدن محتوا: SoldierLoading.hide()
// =========================================================

const SoldierLoading = {
  _overlay: null,

  show(options = {}) {
    const logoPath = options.logo || "../shared/images/logo/logo-long.png";

    if (this._overlay) {
      this._overlay.hidden = false;
      this._overlay.classList.remove("is-hiding");
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";
    overlay.id = "soldier-loading-overlay";

    overlay.innerHTML = `
      <div class="loading-card">
        <img src="${logoPath}" alt="لوگو" />
        <nav>
          <svg
            class="loading-icon"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="loadingGradient"
                gradientUnits="userSpaceOnUse"
                x1="64" y1="20"
                x2="20" y2="64"
              >
                <stop offset="0%" stop-color="#ec4899" stop-opacity="0.08" />
                <stop offset="55%" stop-color="#ec4899" stop-opacity="0.3" />
                <stop offset="85%" stop-color="#ec4899" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#ec4899" stop-opacity="1" />
              </linearGradient>
            </defs>

            <path
              d="M64 20 A44 44 0 1 1 20 64"
              fill="none"
              stroke="url(#loadingGradient)"
              stroke-width="24"
              stroke-linecap="round"
            />
          </svg>
        </nav>
      </div>
    `;

    document.body.appendChild(overlay);
    this._overlay = overlay;
  },

  hide() {
    if (!this._overlay) return;

    this._overlay.classList.add("is-hiding");

    setTimeout(() => {
      if (this._overlay) {
        this._overlay.hidden = true;
      }
    }, 300);
  },
};
// =========================================================
// مودال مشترک ویرایش (نام، ایمیل، رمز و...)
// استفاده:
//   EditModal.open({
//     title: "ویرایش نام",
//     fields: [{ id: "name", label: "نام جدید", type: "text", value: "مقدار فعلی" }],
//     onSave: (values) => { ... },   // values = { name: "..." }
//     validate: (values) => "پیام خطا" یا null اگر معتبر بود (اختیاری)
//   });
// =========================================================

const EditModal = {
  _overlay: null,
  _modal: null,
  _currentConfig: null,

  _ensureBuilt() {
    if (this._overlay) return;

    const overlay = document.createElement("div");
    overlay.className = "edit-modal-overlay";
    overlay.hidden = true;

    const modal = document.createElement("div");
    modal.className = "edit-modal";

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) this.close();
    });

    this._overlay = overlay;
    this._modal = modal;
  },

  open(config) {
    this._ensureBuilt();
    this._currentConfig = config;

    const fieldsHtml = config.fields
      .map(
        (f) => `
          <div class="edit-modal-field">
            <label for="edit-modal-${f.id}">${f.label}</label>
            <input
              type="${f.type || "text"}"
              id="edit-modal-${f.id}"
              value="${f.value != null ? f.value : ""}"
              placeholder="${f.placeholder || ""}"
            />
          </div>
        `
      )
      .join("");

    this._modal.innerHTML = `
      <h3 class="edit-modal-title">${config.title}</h3>
      <form id="edit-modal-form">
        ${fieldsHtml}
        <div class="edit-modal-error" id="edit-modal-error"></div>
        <div class="edit-modal-actions">
          <button type="button" class="edit-modal-btn edit-modal-btn--cancel" id="edit-modal-cancel">
            انصراف
          </button>
          <button type="submit" class="edit-modal-btn edit-modal-btn--save">
            ذخیره
          </button>
        </div>
      </form>
    `;

    this._overlay.hidden = false;
    requestAnimationFrame(() => {
      this._overlay.classList.add("is-visible");
    });

    document.body.style.overflow = "hidden";

    const form = document.getElementById("edit-modal-form");
    const errorEl = document.getElementById("edit-modal-error");
    const cancelBtn = document.getElementById("edit-modal-cancel");

    cancelBtn.addEventListener("click", () => this.close());

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const values = {};
      config.fields.forEach((f) => {
        values[f.id] = document.getElementById(`edit-modal-${f.id}`).value.trim();
      });

      if (config.validate) {
        const errorMsg = config.validate(values);
        if (errorMsg) {
          errorEl.textContent = errorMsg;
          return;
        }
      }

      errorEl.textContent = "";

      if (config.onSave) {
        config.onSave(values);
      }

      this.close();
    });

    // فوکوس روی اولین فیلد
    const firstInput = this._modal.querySelector("input");
    if (firstInput) firstInput.focus();
  },

  close() {
    if (!this._overlay) return;

    this._overlay.classList.remove("is-visible");
    document.body.style.overflow = "";

    setTimeout(() => {
      this._overlay.hidden = true;
    }, 250);
  },
};
// =========================================================
// انتخابگر آواتار (گالری لوزی‌شکل لونه‌زنبوری تمام‌صفحه)
// استفاده:
//   AvatarPicker.open({
//     avatars: [{ file: "456-profile-icon.jpg", label: "456" }, ...],
//     currentFile: "456-profile-icon.jpg",
//     basePath: "../../shared/images/profile-icon/",
//     onConfirm: (avatar) => { ... }
//   });
// =========================================================

const AvatarPicker = {
  _overlay: null,
  _avatars: [],
  _basePath: "",
  _selectedIndex: 0,
  _onConfirm: null,

  _ensureBuilt() {
    if (this._overlay) return;

    const overlay = document.createElement("div");
    overlay.className = "avatar-picker-overlay";
    overlay.hidden = true;

    overlay.innerHTML = `
      <h3 class="avatar-picker-title">انتخاب آواتار</h3>

      <div class="avatar-picker-nav">
        <button type="button" class="avatar-picker-nav-btn" id="avatar-picker-prev">‹</button>
        <span style="color:#777; font-size:0.85rem;">جابه‌جایی بین آواتارها</span>
        <button type="button" class="avatar-picker-nav-btn" id="avatar-picker-next">›</button>
      </div>

      <div class="avatar-picker-grid" id="avatar-picker-grid"></div>

      <div class="avatar-picker-actions">
        <button type="button" class="avatar-picker-btn avatar-picker-btn--cancel" id="avatar-picker-cancel">
          لغو
        </button>
        <button type="button" class="avatar-picker-btn avatar-picker-btn--confirm" id="avatar-picker-confirm">
          تنظیم
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    this._overlay = overlay;

    document.getElementById("avatar-picker-prev").addEventListener("click", () => this._move(-1));
    document.getElementById("avatar-picker-next").addEventListener("click", () => this._move(1));
    document.getElementById("avatar-picker-cancel").addEventListener("click", () => this.close());
    document.getElementById("avatar-picker-confirm").addEventListener("click", () => this._confirm());
  },

  open({ avatars, currentFile, basePath, onConfirm }) {
    this._ensureBuilt();

    this._avatars = avatars;
    this._basePath = basePath;
    this._onConfirm = onConfirm;

    const foundIndex = avatars.findIndex((a) => a.file === currentFile);
    this._selectedIndex = foundIndex >= 0 ? foundIndex : 0;

    this._renderGrid();

    this._overlay.hidden = false;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      this._overlay.classList.add("is-visible");
    });
  },

  _renderGrid() {
    const grid = document.getElementById("avatar-picker-grid");

    grid.innerHTML = this._avatars
      .map(
        (avatar, index) => `
          <div class="avatar-picker-item" data-index="${index}">
            <div class="avatar-picker-diamond-wrap">
              <div class="avatar-picker-diamond">
                <img src="${this._basePath}${avatar.file}" alt="${avatar.label}" />
              </div>
            </div>
            <span class="avatar-picker-number">${avatar.label}</span>
          </div>
        `
      )
      .join("");

    grid.querySelectorAll(".avatar-picker-item").forEach((item) => {
      item.querySelector(".avatar-picker-diamond").addEventListener("click", () => {
        this._selectedIndex = Number(item.dataset.index);
        this._updateSelection();
      });
    });

    this._updateSelection();
  },

  _updateSelection() {
    const items = document.querySelectorAll(".avatar-picker-item");

    items.forEach((item, index) => {
      item.classList.toggle("is-selected", index === this._selectedIndex);
      item.classList.toggle("is-dimmed", index !== this._selectedIndex);
    });
  },

  _move(direction) {
    const total = this._avatars.length;
    this._selectedIndex = (this._selectedIndex + direction + total) % total;
    this._updateSelection();
  },

  _confirm() {
    const selected = this._avatars[this._selectedIndex];
    if (this._onConfirm) {
      this._onConfirm(selected);
    }
    this.close();
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
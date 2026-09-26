const API_BASE_URL =
  "https://soldier-squid-game-backend.soldier-squidgame.workers.dev";

const createingIdBtn = document.querySelector("#createId-btn");
const numberIDinput = document.querySelector("#number-input");

createingIdBtn.addEventListener("click", () => {
  let id = Math.floor(Math.random() * 1000000);

  numberIDinput.value = id.toString().padStart(6, "0");
});

numberIDinput.addEventListener("input", function () {
  let value = this.value;

  value = value.replace(/\D/g, "");

  this.value = value.slice(0, 6);
});

const togglePasswordBtn = document.querySelector("#togglePassword-btn");
const passwordInput = document.querySelector("#password-input");

togglePasswordBtn.addEventListener("click", () => {
  if (passwordInput.type == "password") {
    passwordInput.type = "text";

    togglePasswordBtn.innerHTML =
      '<img src="../../shared/images/icons/soldier-open.png" alt="" width="35px">';
  } else {
    passwordInput.type = "password";

    togglePasswordBtn.innerHTML =
      '<img src="../../shared/images/icons/soldier-cloase.png" alt="" width="35px">';
  }
});

const form = document.querySelector("#form-elements");
const registerModal = document.querySelector("#register-modal");
const registerNameInput = document.querySelector("#register-name");
const registerEmailInput = document.querySelector("#register-email");
const registerSubmitBtn = document.querySelector("#register-submit");
const closeRegisterModalBtn = document.querySelector("#close-register-modal");

closeRegisterModalBtn.addEventListener("click", () => {
  registerModal.classList.remove("active");
});

registerSubmitBtn.addEventListener("click", async () => {
  const number = numberIDinput.value.trim();
  const password = passwordInput.value;
  const name = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim();

  if (!name) {
    alert("نام سرباز را وارد کنید.");
    return;
  }

  if (!/^[A-Za-z]+$/.test(name)) {
    alert("نام سرباز باید فقط شامل حروف انگلیسی باشد.");
    return;
  }

  registerSubmitBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        soldier_id: `SDL-${number}`,
        name,
        email: email || null,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "ساخت حساب انجام نشد.");
      return;
    }

    localStorage.setItem("soldier_token", data.token);

    registerModal.classList.remove("active");

    window.location.href = "../index";
  } catch (error) {
    console.error("Register error:", error);

    alert("ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.");
  } finally {
    registerSubmitBtn.disabled = false;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');

  if (submitButton.disabled) {
    return;
  }

  submitButton.disabled = true;
  const number = numberIDinput.value.trim();
  const password = passwordInput.value;

  if (!number || !password) {
    alert("شناسه سرباز و رمز عبور را وارد کنید.");
    return;
  }

  const soldierId = `SDL-${number}`;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        soldier_id: soldierId,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 404) {
        registerModal.classList.add("active");
        return;
      }

      alert(data.error || "ورود به حساب انجام نشد.");
      return;
    }

    localStorage.setItem("soldier_token", data.token);

    window.location.href = "../index";
  } catch (error) {
    console.error("Login error:", error);

    alert(`Login error: ${error.message}`);
  }
});

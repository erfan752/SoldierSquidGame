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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const number = numberIDinput.value.trim();
  const password = passwordInput.value;

  if (!number || !password) {
    alert("شناسه سرباز و رمز عبور را وارد کنید.");
    return;
  }

  const soldierId = `SDL-${number}`;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          soldier_id: soldierId,
          password,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "ورود به حساب انجام نشد.");
      return;
    }

    localStorage.setItem("soldier_token", data.token);

    window.location.href = "../index";
  } catch (error) {
    console.error("Login error:", error);

    alert(
      "ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.",
    );
  }
});
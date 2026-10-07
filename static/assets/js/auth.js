// Shared by /login and /signup. The form's data-auth attribute picks the flow.
(function () {
  const HCAPTCHA_SITEKEY = "b53ebcec-4dfc-4536-b52e-a3bcbc1269e8";

  const form = document.querySelector("form[data-auth]");
  if (!form) return;

  const mode = form.dataset.auth;
  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#password");
  const submitButton = form.querySelector(".auth-submit");
  const message = form.querySelector(".auth-message");
  const avatar = document.querySelector(".auth-avatar");
  const avatarIcon = avatar ? avatar.innerHTML : "";
  let captchaWidget = null;

  // ---------- Avatar ----------

  function updateAvatar() {
    if (!avatar) return;
    const initial = usernameInput.value.trim().charAt(0);
    const current = avatar.dataset.initial || "";
    if (initial === current) return;

    avatar.dataset.initial = initial;
    avatar.classList.toggle("has-initial", Boolean(initial));
    if (initial) {
      avatar.textContent = initial;
    } else {
      avatar.innerHTML = avatarIcon;
    }
    avatar.classList.remove("is-popping");
    void avatar.offsetWidth;
    avatar.classList.add("is-popping");
  }

  // ---------- Messages and field errors ----------

  function showMessage(text, tone = "error") {
    message.textContent = text;
    message.dataset.tone = tone;
    message.hidden = false;
  }

  function clearMessage() {
    message.hidden = true;
    message.textContent = "";
  }

  function hintFor(input) {
    return form.querySelector(`#${input.id}-hint`);
  }

  function setFieldError(input, text) {
    const hint = hintFor(input);
    input.setAttribute("aria-invalid", "true");
    if (!hint) return;
    if (hint.dataset.default === undefined) {
      hint.dataset.default = hint.textContent;
    }
    hint.textContent = text;
    hint.classList.add("is-error");
    hint.hidden = false;
  }

  function clearFieldError(input) {
    const hint = hintFor(input);
    input.removeAttribute("aria-invalid");
    if (!hint || !hint.classList.contains("is-error")) return;
    hint.classList.remove("is-error");
    hint.textContent = hint.dataset.default || "";
    hint.hidden = !hint.textContent;
  }

  function setLoading(loading) {
    submitButton.disabled = loading;
    submitButton.classList.toggle("is-loading", loading);
  }

  function validate() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const errors = [];

    if (!username) {
      errors.push([usernameInput, "Enter your username."]);
    } else if (mode === "signup" && username.length < 3) {
      errors.push([usernameInput, "Use at least 3 characters."]);
    } else if (mode === "signup" && username.length > 16) {
      errors.push([usernameInput, "Use 16 characters or fewer."]);
    }

    if (!password) {
      errors.push([passwordInput, "Enter your password."]);
    } else if (mode === "signup" && password.length < 6) {
      errors.push([passwordInput, "Use at least 6 characters."]);
    }

    errors.forEach(([input, text]) => setFieldError(input, text));
    if (errors.length) errors[0][0].focus();
    return errors.length === 0;
  }

  async function postJson(url, body, headers = {}) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  async function readError(response) {
    try {
      const data = await response.json();
      return data.error || "";
    } catch {
      return "";
    }
  }

  // ---------- Login ----------

  async function login() {
    const response = await postJson("/api/login", {
      username: usernameInput.value.trim(),
      password: passwordInput.value,
    });

    if (response.status !== 200) {
      const error = await readError(response);
      showMessage(
        !error || error === "Invalid Email or password"
          ? "Wrong username or password."
          : error,
      );
      return false;
    }

    return startSession(
      await response.json(),
      "First time logging in here. Uploading your current save to the cloud…",
    );
  }

  // Stores the account the server just signed in, then opens the profile.
  async function startSession(data, uploadNotice) {
    localStorage.setItem("uuid", data.uuid);
    localStorage.setItem("username", data.username);
    localStorage.setItem("premium", data.premium);

    const save = await postJson("/api/readSave", { uuid: data.uuid });
    if (save.status !== 200) {
      // No cloud save yet, so this browser's data becomes the first one
      showMessage(uploadNotice, "info");
      const upload = await postJson(
        "/api/uploadSave",
        JSON.stringify(localStorage),
        { uuid: data.uuid },
      );
      if (upload.status !== 200) {
        showMessage(
          `You're logged in, but your save couldn't be uploaded (error ${upload.status}). Report this to rednotsus on Discord.`,
        );
        return false;
      }
    }

    location.href = "/profile";
    return true;
  }

  // ---------- Signup ----------

  function renderCaptcha() {
    const container = document.getElementById("captcha");
    if (!container || captchaWidget !== null || !window.hcaptcha) return;
    captchaWidget = window.hcaptcha.render(container, {
      sitekey: HCAPTCHA_SITEKEY,
      theme: "dark",
      // The normal widget is 303px wide; fall back when the card is narrower
      size: container.clientWidth < 303 ? "compact" : "normal",
      callback: clearMessage,
    });
  }

  async function signup() {
    const token =
      captchaWidget !== null ? window.hcaptcha.getResponse(captchaWidget) : "";
    if (!token) {
      showMessage(
        window.hcaptcha
          ? "Complete the captcha to create your account."
          : "The captcha didn't load. Check your connection or ad blocker, then reload the page.",
      );
      return false;
    }

    const username = usernameInput.value.trim();
    const response = await postJson("/api/signup", {
      username,
      password: passwordInput.value,
      captchaResponse: token,
    });

    if (response.status === 200) {
      // The server signs the new account in, so skip the login page
      const data = await response.json().catch(() => null);
      if (!data || !data.uuid) return login();
      return startSession(
        data,
        "Account created. Uploading your current save to the cloud…",
      );
    }

    // A captcha token can only be verified once
    window.hcaptcha.reset(captchaWidget);

    const error = await readError(response);
    if (response.status === 500) {
      // The server reports every creation failure the same way; a taken name is the usual cause
      setFieldError(usernameInput, "That username may already be taken.");
      showMessage("Couldn't create the account. Try a different username.");
    } else if (error === "Invalid CAPTCHA") {
      showMessage("The captcha check failed. Complete it again.");
    } else {
      showMessage(
        error || `Couldn't create the account (error ${response.status}).`,
      );
    }
    return false;
  }

  // ---------- Wiring ----------

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    clearMessage();
    clearFieldError(usernameInput);
    clearFieldError(passwordInput);
    if (!validate()) return;

    setLoading(true);
    let leaving = false;
    try {
      leaving = await (mode === "signup" ? signup() : login());
    } catch (error) {
      showMessage(
        "Couldn't reach the server. Check your connection and try again.",
      );
      console.error(error);
    }
    if (!leaving) setLoading(false);
  });

  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => clearFieldError(input));
  });
  usernameInput.addEventListener("input", updateAvatar);

  form.querySelectorAll(".auth-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(show));
      toggle.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password",
      );
    });
  });

  if (mode === "signup") {
    window.authCaptchaReady = renderCaptcha;
    renderCaptcha();
  }

  updateAvatar();
})();

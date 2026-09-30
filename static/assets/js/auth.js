document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const signup = form.dataset.mode === "signup";
  const username = form.elements.username;
  const password = form.elements.password;
  const button = form.querySelector('button[type="submit"]');
  const feedback = document.getElementById("authFeedback");
  const loader = document.getElementById("authLoader");
  const defaultLabel = button.textContent;

  function showError(message, field) {
    feedback.textContent = message;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    } else {
      feedback.focus();
    }
  }

  form.addEventListener("input", (event) => {
    event.target.removeAttribute("aria-invalid");
    feedback.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    feedback.textContent = "";
    username.removeAttribute("aria-invalid");
    password.removeAttribute("aria-invalid");
    if (!username.value.trim())
      return showError("Enter your username.", username);
    if (!password.value) return showError("Enter your password.", password);
    if (
      signup &&
      (username.value.trim().length < 3 || username.value.trim().length > 16)
    ) {
      return showError("Use a username with 3 to 16 characters.", username);
    }
    if (signup && password.value.length < 6) {
      return showError("Use a password with at least 6 characters.", password);
    }
    const captchaResponse = form.querySelector(
      '[name="h-captcha-response"]',
    )?.value;
    if (signup && !captchaResponse) {
      return showError("Complete the CAPTCHA before creating your account.");
    }

    button.disabled = true;
    button.textContent = signup ? "Creating account…" : "Signing in…";
    form.setAttribute("aria-busy", "true");
    loader.hidden = false;
    try {
      const response = await fetch(signup ? "/api/signup" : "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value.trim(),
          password: password.value,
          ...(signup ? { captchaResponse } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (signup && response.status === 400) window.hcaptcha?.reset();
        showError(
          signup
            ? data.error ||
                "Account creation failed. Try another username and complete the CAPTCHA again."
            : "Sign-in failed. Check your username and password, then try again.",
        );
        return;
      }
      if (signup) {
        form.hidden = true;
        document.getElementById("authSuccess").hidden = false;
        document.getElementById("authSuccessLink").focus();
        return;
      }
      localStorage.setItem("uuid", data.uuid);
      localStorage.setItem("username", data.username);
      localStorage.setItem("premium", data.premium);
      // Cloud sync is available explicitly on the profile page after sign-in.
      window.location.href = "/profile";
    } catch (error) {
      console.error("Authentication failed:", error);
      showError("Could not connect. Check your connection and try again.");
    } finally {
      button.disabled = false;
      button.textContent = defaultLabel;
      form.setAttribute("aria-busy", "false");
      loader.hidden = true;
    }
  });
});

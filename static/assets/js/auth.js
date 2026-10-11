// Shared by /login and /signup. The form's data-auth attribute picks the flow.
(function () {
  const form = document.querySelector("form[data-auth]");
  if (!form) return;

  const mode = form.dataset.auth;
  const usernameInput = form.querySelector("#username");
  const passwordInput = form.querySelector("#password");
  const submitButton = form.querySelector(".auth-submit");
  const message = form.querySelector(".auth-message");
  const avatar = document.querySelector(".auth-avatar");
  const avatarIcon = avatar ? avatar.innerHTML : "";

  const HANDLE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  // What the person typed as a handle: no "@", lowercase.
  function typedHandle() {
    return usernameInput.value.trim().replace(/^@/, "").toLowerCase();
  }

  // ---------- Avatar ----------

  function updateAvatar() {
    if (!avatar) return;
    const initial = usernameInput.value.trim().replace(/^@/, "").charAt(0);
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

  // ---------- Signup preview and rules ----------

  const handlePreview = document.getElementById("handle-preview");
  const previewPlaceholder = handlePreview ? handlePreview.textContent : "";

  function updatePreview() {
    if (!handlePreview) return;
    const handle = typedHandle();
    handlePreview.textContent = handle ? `@${handle}` : previewPlaceholder;
    handlePreview.classList.toggle("is-empty", !handle);
  }

  // Ticks each requirement under the fields as soon as it is met.
  function updateRules() {
    const handle = typedHandle();
    const met = {
      length: handle.length >= 3 && handle.length <= 16,
      characters: HANDLE_PATTERN.test(handle),
      password: passwordInput.value.length >= 6,
    };
    form.querySelectorAll(".auth-rules [data-rule]").forEach((rule) => {
      rule.classList.toggle("is-met", Boolean(met[rule.dataset.rule]));
    });
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
      errors.push([
        usernameInput,
        mode === "signup" ? "Choose a handle." : "Enter your handle.",
      ]);
    } else if (mode === "signup") {
      const handle = typedHandle();
      if (handle.length < 3) {
        errors.push([usernameInput, "Use at least 3 characters."]);
      } else if (handle.length > 16) {
        errors.push([usernameInput, "Use 16 characters or fewer."]);
      } else if (!HANDLE_PATTERN.test(handle)) {
        errors.push([
          usernameInput,
          "Use only letters, numbers and dashes, with no dash at either end.",
        ]);
      }
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
          ? "Wrong handle or password."
          : error,
      );
      return false;
    }

    const data = await response.json();
    // An old username that was converted for them: tell them once, on the
    // page they land on, what their handle is now.
    if (!data.handlePending && data.username !== typedHandle()) {
      sessionStorage.setItem("handleNotice", data.username);
    }
    return startSession(
      data,
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

    location.href = data.handlePending ? "/choose-handle" : "/profile";
    return true;
  }

  // ---------- Signup ----------

  const captcha = document.getElementById("captcha");
  const captchaLabel = document.getElementById("captcha-label");
  const captchaNote = document.getElementById("captcha-note");
  const CAPTCHA_WORKER = "/assets/js/captcha-worker.js?v=1";
  // Long enough for the spinner to be seen before the tick replaces it
  const CAPTCHA_MIN_MS = 650;
  const CHECK_DELAY_MS = 300;

  const CAPTCHA_TEXT = {
    idle: ["I'm not a robot", "Checks itself once you pick a handle"],
    working: ["Verifying…", "This takes a moment, nothing to solve"],
    done: ["Verified", "You're good to go"],
    error: ["Couldn't verify", "Click to try again"],
  };

  // Set once the box has ticked. A proof only counts for the handle it was
  // solved for, so a new handle still needs a new one, but that work then
  // happens out of sight and the box stays ticked unless it fails.
  let captchaPassed = false;

  function setCaptcha(state) {
    if (!captcha) return;
    if (state === "done") captchaPassed = true;
    else if (state === "error") captchaPassed = false;
    else if (captchaPassed) return;
    if (captcha.dataset.state === state) return;
    captcha.dataset.state = state;
    captcha.setAttribute("aria-checked", String(state === "done"));
    captcha.setAttribute("aria-busy", String(state === "working"));
    [captchaLabel.textContent, captchaNote.textContent] = CAPTCHA_TEXT[state];
  }

  // The line under the handle field: "Checking…", "available", or taken.
  function setAvailability(text, ok = false) {
    const hint = hintFor(usernameInput);
    if (!hint || hint.classList.contains("is-error")) return;
    hint.textContent = text;
    hint.classList.toggle("is-ok", ok);
    hint.hidden = !text;
  }

  function markTaken() {
    setAvailability("");
    setCaptcha("idle");
    setFieldError(usernameInput, "That handle is taken.");
  }

  // Answers from /api/signup-check, kept so retyping a handle costs nothing.
  const checks = new Map();
  let checkTimer = null;
  let checkAbort = null;
  // The handle being verified, its worker, and the promise of its solution.
  let proof = null;

  function isValidHandle(handle) {
    return (
      handle.length >= 3 && handle.length <= 16 && HANDLE_PATTERN.test(handle)
    );
  }

  async function checkHandle(handle) {
    const known = checks.get(handle);
    // Leave a margin so a challenge does not expire on its way to the server
    if (
      known &&
      (!known.challenge || known.challenge.expires > Date.now() + 30000)
    ) {
      return known;
    }

    if (checkAbort) checkAbort.abort();
    checkAbort = new AbortController();
    const response = await fetch(
      `/api/signup-check?handle=${encodeURIComponent(handle)}`,
      { signal: checkAbort.signal },
    );
    if (!response.ok) {
      throw new Error(`signup-check answered ${response.status}`);
    }
    const result = await response.json();
    checks.set(handle, result);
    return result;
  }

  function solveChallenge(challenge) {
    const worker = new Worker(CAPTCHA_WORKER);
    const solved = new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        worker.terminate();
        if (event.data.number === null) {
          reject(new Error("The challenge has no solution"));
        } else {
          resolve({ ...challenge, number: event.data.number });
        }
      };
      worker.onerror = (event) => {
        worker.terminate();
        reject(new Error(event.message || "The captcha worker failed"));
      };
    });
    worker.postMessage(challenge);
    return { worker, solved };
  }

  function dropProof() {
    if (!proof) return;
    if (proof.worker) proof.worker.terminate();
    proof = null;
  }

  // Checks the typed handle and, when it is free, solves its challenge.
  // Resolves with the captcha payload for signup, or null when there is none
  // (handle not valid, taken, changed meanwhile, or the check failed).
  function verifyHandle() {
    const handle = typedHandle();
    if (proof && proof.handle === handle) return proof.result;

    dropProof();
    clearTimeout(checkTimer);
    if (!isValidHandle(handle)) {
      if (checkAbort) checkAbort.abort();
      setAvailability("");
      setCaptcha("idle");
      return Promise.resolve(null);
    }

    const current = { handle, worker: null, result: null };
    proof = current;
    const started = Date.now();
    setCaptcha("working");
    if (!checks.has(handle)) setAvailability("Checking…");

    current.result = (async () => {
      try {
        const check = await checkHandle(handle);
        if (proof !== current) return null;

        if (check.available === false) {
          markTaken();
          return null;
        }
        setAvailability(
          check.available ? `@${handle} is available.` : "",
          true,
        );

        const { worker, solved } = solveChallenge(check.challenge);
        current.worker = worker;
        const payload = await solved;
        const wait = captchaPassed
          ? 0
          : CAPTCHA_MIN_MS - (Date.now() - started);
        if (wait > 0) await new Promise((done) => setTimeout(done, wait));
        if (proof !== current) return null;

        setCaptcha("done");
        clearMessage();
        return payload;
      } catch (error) {
        if (proof !== current) return null;
        // Forget the failure so the next click or keystroke starts over
        proof = null;
        checks.delete(handle);
        setAvailability("");
        setCaptcha("error");
        if (error.name !== "AbortError") console.error(error);
        return null;
      }
    })();
    return current.result;
  }

  // Runs as the handle is typed: reset now, verify once typing pauses.
  function scheduleVerify() {
    dropProof();
    clearTimeout(checkTimer);
    if (checkAbort) checkAbort.abort();

    const handle = typedHandle();
    if (!isValidHandle(handle)) {
      setAvailability("");
      setCaptcha("idle");
      return;
    }
    setAvailability(checks.has(handle) ? "" : "Checking…");
    setCaptcha("working");
    checkTimer = setTimeout(
      verifyHandle,
      checks.has(handle) ? 0 : CHECK_DELAY_MS,
    );
  }

  async function signup(retried = false) {
    const username = typedHandle();
    const payload = await verifyHandle();
    if (!payload) {
      if (checks.get(username)?.available === false) {
        markTaken();
        usernameInput.focus();
      } else if (captcha.dataset.state === "error") {
        showMessage(
          "The robot check couldn't run. Check your connection, then click the box to try again.",
        );
      }
      return false;
    }

    const response = await postJson("/api/signup", {
      username,
      password: passwordInput.value,
      captchaResponse: payload,
      website: form.elements.website ? form.elements.website.value : "",
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

    const error = await readError(response);
    if (response.status === 409) {
      checks.set(username, { handle: username, available: false });
      dropProof();
      markTaken();
      showMessage("Someone already has that handle. Try another.");
    } else if (response.status === 400 && /^Handles use/.test(error)) {
      setFieldError(
        usernameInput,
        "Use only letters, numbers and dashes, 3 to 16 characters.",
      );
    } else if (error === "Invalid CAPTCHA") {
      // Most likely an expired challenge: get a new one and send it once more
      checks.delete(username);
      dropProof();
      if (!retried) return signup(true);
      setCaptcha("error");
      showMessage("The robot check failed. Click the box to try again.");
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
    input.addEventListener("input", () => {
      clearFieldError(input);
      updateRules();
    });
  });
  usernameInput.addEventListener("input", () => {
    updateAvatar();
    updatePreview();
  });

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

  if (mode === "signup" && captcha) {
    // The handle hint starts empty; pin that so a cleared error returns to it
    hintFor(usernameInput).dataset.default = "";
    usernameInput.addEventListener("input", scheduleVerify);
    captcha.addEventListener("click", () => {
      const state = captcha.dataset.state;
      if (state === "working" || state === "done") return;
      if (!isValidHandle(typedHandle())) {
        setFieldError(usernameInput, "Choose a handle first.");
        usernameInput.focus();
        return;
      }
      clearMessage();
      verifyHandle();
    });
    // A handle the browser restored or autofilled
    if (typedHandle()) scheduleVerify();
  }

  updateAvatar();
  updatePreview();
  updateRules();
})();

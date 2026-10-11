// Shared by /choose-handle and /handles. The form's data-handles attribute
// picks the flow.
(function () {
  const HANDLE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  function formatDeadline(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function wire(form) {
    const message = form.querySelector(".auth-message");
    const submitButton = form.querySelector(".auth-submit");
    return {
      show(text, tone = "error") {
        message.textContent = text;
        message.dataset.tone = tone;
        message.hidden = false;
      },
      clear() {
        message.hidden = true;
        message.textContent = "";
      },
      setLoading(loading) {
        submitButton.disabled = loading;
        submitButton.classList.toggle("is-loading", loading);
      },
    };
  }

  function forgetAccount() {
    localStorage.removeItem("uuid");
    localStorage.removeItem("username");
    localStorage.removeItem("premium");
  }

  // ---------- /choose-handle ----------

  async function setUpChooser(form) {
    const ui = wire(form);
    const input = form.querySelector("#handle");
    const hint = form.querySelector("#handle-hint");
    const subtitle = document.getElementById("choose-subtitle");
    const uuid = localStorage.getItem("uuid");

    if (!uuid) {
      location.replace("/login");
      return;
    }

    let me = null;
    try {
      const response = await fetch("/api/me", {
        headers: { "X-User-UUID": uuid },
      });
      if (response.status === 404) {
        forgetAccount();
        location.replace("/login");
        return;
      }
      if (response.ok) me = await response.json();
    } catch (error) {
      console.error(error);
    }

    if (!me) {
      ui.show("Couldn't load your account. Reload the page to try again.");
      return;
    }

    localStorage.setItem("username", me.username);
    if (!me.handlePending) {
      location.replace("/profile");
      return;
    }

    input.value = me.username;
    if (me.deadline) {
      subtitle.textContent = `Choose your handle before ${formatDeadline(me.deadline)}, or you keep @${me.username}.`;
    } else {
      subtitle.textContent = `You can keep @${me.username} or pick another.`;
    }
    input.focus();
    input.select();

    function fieldError(text) {
      input.setAttribute("aria-invalid", "true");
      hint.textContent = text;
      hint.classList.add("is-error");
    }

    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      hint.classList.remove("is-error");
      hint.textContent = "3 to 16 characters: letters, numbers and dashes.";
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitButton(form).disabled) return;
      ui.clear();

      const handle = input.value.trim().replace(/^@/, "").toLowerCase();
      if (handle.length < 3) return fieldError("Use at least 3 characters.");
      if (handle.length > 16) return fieldError("Use 16 characters or fewer.");
      if (!HANDLE_PATTERN.test(handle)) {
        return fieldError(
          "Use only letters, numbers and dashes, with no dash at either end.",
        );
      }

      ui.setLoading(true);
      try {
        const response = await fetch("/api/handle", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-User-UUID": uuid },
          body: JSON.stringify({ handle }),
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          localStorage.setItem("username", data.username);
          location.href = "/profile";
          return;
        }
        if (response.status === 401) {
          // Signed in before sessions existed, or the session ran out.
          forgetAccount();
          ui.show(
            "Sign in again to choose your handle. Your old username and password still work.",
            "info",
          );
          setTimeout(() => location.replace("/login"), 2500);
          return;
        }
        if (response.status === 409 && /taken/.test(data.error || "")) {
          fieldError("That handle is taken.");
        } else {
          ui.show(
            data.error ||
              `Couldn't save the handle (error ${response.status}).`,
          );
        }
      } catch (error) {
        console.error(error);
        ui.show(
          "Couldn't reach the server. Check your connection and try again.",
        );
      }
      ui.setLoading(false);
    });
  }

  function submitButton(form) {
    return form.querySelector(".auth-submit");
  }

  // ---------- /handles ----------

  function setUpLookup(form) {
    const ui = wire(form);
    const input = form.querySelector("#old-username");

    const deadlineNote = document.getElementById("handles-deadline");
    fetch("/api/handle-config")
      .then((response) => (response.ok ? response.json() : null))
      .then((config) => {
        if (!config || !config.deadline || !deadlineNote) return;
        const date = formatDeadline(config.deadline);
        deadlineNote.textContent = config.open
          ? `If you are asked to choose, do it before ${date}. After that you keep the handle you were given, shown on the choose screen.`
          : `The time to choose ended on ${date}. Accounts that did not choose kept the handle they were given.`;
        deadlineNote.hidden = false;
      })
      .catch(() => {});

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitButton(form).disabled) return;
      ui.clear();

      const username = input.value.trim();
      if (!username) {
        ui.show("Enter your old username.");
        input.focus();
        return;
      }

      ui.setLoading(true);
      try {
        const response = await fetch("/api/handle-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          ui.show(
            data.error || `Couldn't look that up (error ${response.status}).`,
          );
        } else if (data.status === "found") {
          ui.show(
            `${username} is now @${data.handle}. Either one signs you in.`,
            "success",
          );
        } else if (data.status === "pending") {
          ui.show(
            "That account still has to choose a handle. Sign in with the old username and password to pick one.",
            "info",
          );
        } else if (data.status === "ambiguous") {
          ui.show(
            "More than one account used that name. Sign in with your old username and password to see yours.",
            "info",
          );
        } else {
          ui.show(
            "No account had that username. Check the spelling. If the account was never used it may have been removed, and you can sign up again.",
            "info",
          );
        }
      } catch (error) {
        console.error(error);
        ui.show(
          "Couldn't reach the server. Check your connection and try again.",
        );
      }
      ui.setLoading(false);
    });
  }

  const form = document.querySelector("form[data-handles]");
  if (!form) return;
  if (form.dataset.handles === "choose") setUpChooser(form);
  else setUpLookup(form);
})();

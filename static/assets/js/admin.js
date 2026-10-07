(function () {
  const SEARCH_DELAY_MS = 200;

  const loginSection = document.getElementById("loginSection");
  const manageSection = document.getElementById("manageSection");
  const searchInput = document.getElementById("search");
  const options = document.getElementById("options");
  const selected = document.getElementById("selected");
  const toggleButton = document.getElementById("toggleButton");
  const toasts = document.getElementById("toasts");

  let results = [];
  let activeIndex = -1;
  let selectedUser = null;
  let searchTimer = null;
  let searchSeq = 0;
  let hasResults = false;

  const ICONS = {
    success:
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8" opacity=".35"/><path d="M6.5 10.5l2.3 2.3 4.7-5"/></svg>',
    error:
      '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8" opacity=".35"/><path d="M10 6v4.5M10 13.5v.5"/></svg>',
  };

  function toast(type, message) {
    const el = document.createElement("div");
    el.className = "p-toast";
    el.dataset.type = type;
    el.innerHTML = ICONS[type];
    const text = document.createElement("span");
    text.textContent = message;
    el.appendChild(text);
    toasts.appendChild(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, 4000);
  }

  function setLoading(button, loading) {
    button.classList.toggle("is-loading", loading);
    button.disabled = loading;
  }

  function showLogin() {
    manageSection.hidden = true;
    loginSection.hidden = false;
  }

  // Authorized by the session cookie from the main login; without an admin
  // session the page shows the sign-in notice instead.
  async function api(path, init = {}) {
    const response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401 || response.status === 403) {
      showLogin();
      throw new Error("Sign in with the admin account.");
    }
    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  function closeOptions() {
    options.hidden = true;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  function setActive(index) {
    activeIndex = index;
    [...options.children].forEach((option, i) => {
      option.setAttribute("aria-selected", String(i === index));
    });

    const active = options.children[index];
    if (active) {
      searchInput.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    } else {
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function renderOptions() {
    options.replaceChildren();

    if (results.length === 0) {
      const empty = document.createElement("li");
      empty.className = "admin-empty";
      empty.textContent = "No users found";
      options.appendChild(empty);
    }

    results.forEach((user, index) => {
      const option = document.createElement("li");
      option.className = "admin-option";
      option.id = `option-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");

      const name = document.createElement("span");
      name.className = "admin-option-name";
      name.textContent = user.username;
      option.appendChild(name);

      if (user.premium) {
        const tag = document.createElement("span");
        tag.className = "admin-option-tag";
        tag.textContent = "Premium";
        option.appendChild(tag);
      }

      // mousedown fires before the input's blur closes the list.
      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        selectUser(user);
      });
      option.addEventListener("mousemove", () => setActive(index));
      options.appendChild(option);
    });

    options.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
    activeIndex = -1;
  }

  async function search() {
    const seq = ++searchSeq;

    try {
      const data = await api(
        `/api/admin/users?q=${encodeURIComponent(searchInput.value.trim())}`,
      );
      // Drop responses that arrive after a newer query was sent.
      if (seq !== searchSeq) return;

      results = data.users;
      hasResults = true;
      if (document.activeElement === searchInput) renderOptions();
    } catch (error) {
      if (seq === searchSeq) toast("error", error.message);
    }
  }

  function renderSelected() {
    document.getElementById("selectedName").textContent = selectedUser.username;
    document.getElementById("selectedStatus").textContent = selectedUser.premium
      ? "Premium"
      : "Not premium";
    document.getElementById("selectedId").textContent = selectedUser.uuid;
    document.getElementById("toggleLabel").textContent = selectedUser.premium
      ? "Revoke premium"
      : "Grant premium";
    toggleButton.classList.toggle("p-btn-primary", !selectedUser.premium);
    toggleButton.classList.toggle("p-btn-danger", selectedUser.premium);
    selected.hidden = false;
  }

  function selectUser(user) {
    selectedUser = user;
    searchInput.value = user.username;
    closeOptions();
    renderSelected();
  }

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(search, SEARCH_DELAY_MS);
  });

  searchInput.addEventListener("focus", () => {
    if (hasResults) renderOptions();
  });

  searchInput.addEventListener("blur", closeOptions);

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOptions();
      return;
    }
    if (results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (options.hidden) {
        renderOptions();
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + results.length) % results.length);
    } else if (event.key === "Enter" && !options.hidden && activeIndex >= 0) {
      event.preventDefault();
      selectUser(results[activeIndex]);
    }
  });

  toggleButton.addEventListener("click", async () => {
    if (!selectedUser) return;
    const premium = !selectedUser.premium;
    setLoading(toggleButton, true);

    try {
      const data = await api("/api/admin/premium", {
        method: "POST",
        body: JSON.stringify({ uuid: selectedUser.uuid, premium }),
      });

      selectedUser = data.user;
      renderSelected();
      results = results.map((user) =>
        user.uuid === data.user.uuid ? data.user : user,
      );
      toast(
        "success",
        `${data.user.username} ${premium ? "now has" : "no longer has"} premium.`,
      );
    } catch (error) {
      toast("error", error.message);
    } finally {
      setLoading(toggleButton, false);
    }
  });

  // The first search doubles as the access check.
  search().then(() => {
    if (!loginSection.hidden) return;
    manageSection.hidden = false;
    searchInput.focus();
  });
})();

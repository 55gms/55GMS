// 55GMS browser shell.
//
// Each tab owns an outer iframe pointing at /embed.html, which hosts the
// Scramjet frame for that tab. The shell talks to embed.html over a
// postMessage bridge:
//   shell -> embed: { type: "browser:command", command, url }
//   embed -> shell: { type: "browser:<event>", ... }  (see handleBridgeMessage)
(() => {
  const STORAGE_KEY = "55gms:browser";
  const DOCK_KEY = "55gms:browser:dock";
  const MAX_CLOSED = 15;
  const SEARCH_URL = "https://duckduckgo.com/?q=";
  const NEW_TAB_TITLE = "New Tab";
  const NEW_TAB_ICON = "/img/favicon.ico";
  const IS_MAC = /Mac|iPhone|iPad/.test(
    navigator.platform || navigator.userAgent,
  );

  const SHORTCUTS = [
    {
      title: "Discord",
      url: "https://discord.gg",
      img: "/img/shortcuts/dc.webp",
    },
    {
      title: "ESPN",
      url: "https://www.espn.com/watch/",
      img: "/img/shortcuts/ESPN.webp",
    },
    {
      title: "AI Chat",
      url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1",
      img: "/img/shortcuts/freegpt.webp",
    },
    {
      title: "GitHub",
      url: "https://github.com",
      img: "/img/shortcuts/GitHub.webp",
    },
    {
      title: "Google",
      url: "https://google.com",
      img: "/img/shortcuts/Google.webp",
    },
    {
      title: "now.gg",
      url: "https://nowgg.lol",
      img: "/img/shortcuts/nowgg.webp",
    },
    {
      title: "TikTok",
      url: "https://tiktok.com",
      img: "/img/shortcuts/tt.webp",
    },
    {
      title: "Twitch",
      url: "https://twitch.tv",
      img: "/img/shortcuts/Twitch.webp",
    },
  ];

  const $ = (id) => document.getElementById(id);
  const el = {
    browser: $("browser"),
    tabs: $("tabs"),
    tabsScroller: $("tabs-scroller"),
    newTab: $("new-tab"),
    frames: $("frames"),
    progress: $("progress"),
    ntp: $("ntp"),
    ntpShortcuts: $("ntp-shortcuts"),
    banner: $("page-banner"),
    bannerText: $("page-banner-text"),
    bannerRetry: $("page-banner-retry"),
    bannerDismiss: $("page-banner-dismiss"),
    dockClip: document.querySelector(".dock-clip"),
    dockWrap: $("dock-wrap"),
    dockCollapse: $("dock-collapse"),
    dockExpand: $("dock-expand"),
    home: $("btn-home"),
    back: $("btn-back"),
    forward: $("btn-forward"),
    reload: $("btn-reload"),
    menuBtn: $("btn-menu"),
    menu: $("menu"),
    omnibox: $("omnibox"),
    form: $("omnibox-form"),
    input: $("omnibox-input"),
    inputIcon: $("omnibox-icon"),
    suggestions: $("suggestions"),
    toasts: $("toasts"),
  };

  // ======================================================================
  // URL handling
  // ======================================================================

  const IPV4 = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;
  const LOCALHOST = /^localhost(:\d+)?(\/.*)?$/i;
  const DOMAIN = /^([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}(:\d+)?([/?#].*)?$/i;
  const HAS_SCHEME = /^[a-z][a-z\d+.-]*:/i;

  // Turns omnibox text into { url } or { error }.
  function resolveInput(raw) {
    const text = raw.trim();
    if (!text) return { error: "empty" };

    if (HAS_SCHEME.test(text) && !/^[^:/]+:\d/.test(text)) {
      try {
        const url = new URL(text);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          return { error: `“${url.protocol}” addresses can't be opened here.` };
        }
        if (!url.hostname) return { error: "That address isn't valid." };
        return { url: url.href };
      } catch {
        return { error: "That address isn't valid." };
      }
    }

    if (!/\s/.test(text)) {
      if (IPV4.test(text) || LOCALHOST.test(text))
        return { url: new URL("http://" + text).href };
      if (DOMAIN.test(text)) {
        try {
          return { url: new URL("https://" + text).href };
        } catch {
          /* fall through to search */
        }
      }
    }

    return { url: SEARCH_URL + encodeURIComponent(text) };
  }

  function hostnameOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }

  function fallbackFavicon(url) {
    try {
      const origin = new URL(url).origin;
      return (
        "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=" +
        encodeURIComponent(origin)
      );
    } catch {
      return "";
    }
  }

  // ======================================================================
  // State
  // ======================================================================

  /** @type {Array<Tab>} */
  const tabs = [];
  let activeId = null;
  let nextId = 1;
  let closedTabs = [];

  /**
   * @typedef {Object} Tab
   * @property {string} id
   * @property {string} url        Real (unproxied) URL, "" for the new-tab page
   * @property {string} title
   * @property {string} favicon
   * @property {boolean} loading
   * @property {boolean} canGoBack
   * @property {boolean} canGoForward
   * @property {?{kind: string, message: string}} error
   * @property {?HTMLIFrameElement} iframe  Created lazily on first navigation/activation
   * @property {boolean} ready     Embed bridge is listening for commands
   * @property {HTMLElement} node  Tab strip element
   */

  const getTab = (id) => tabs.find((t) => t.id === id);
  const activeTab = () => getTab(activeId);

  let saveQueued = false;
  function saveSession() {
    if (saveQueued) return;
    saveQueued = true;
    queueMicrotask(() => {
      saveQueued = false;
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            active: tabs.findIndex((t) => t.id === activeId),
            tabs: tabs.map(({ url, title, favicon }) => ({
              url,
              title,
              favicon,
            })),
            closed: closedTabs,
          }),
        );
      } catch {
        /* storage full or blocked; session restore is best-effort */
      }
    });
  }

  function loadSession() {
    try {
      const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (!data || !Array.isArray(data.tabs)) return null;
      return data;
    } catch {
      return null;
    }
  }

  // ======================================================================
  // Tab strip
  // ======================================================================

  function createTabNode(tab) {
    const node = document.createElement("div");
    node.className = "tab entering";
    node.id = "tab-" + tab.id;
    node.setAttribute("role", "tab");
    node.setAttribute("aria-selected", "false");
    node.tabIndex = -1;
    node.innerHTML = `
      <span class="tab-icon">
        <img loading="eager" class="tab-favicon" alt="" draggable="false" />
        <svg class="icon tab-fallback" aria-hidden="true"><use href="#i-globe" /></svg>
        <span class="tab-spinner" aria-hidden="true"></span>
      </span>
      <span class="tab-title"></span>
      <button class="tab-close" type="button" aria-label="Close tab" tabindex="-1">
        <svg class="icon" aria-hidden="true"><use href="#i-x" /></svg>
      </button>`;
    node.addEventListener(
      "animationend",
      () => node.classList.remove("entering"),
      { once: true },
    );

    // Page favicon failed -> try the favicon service -> fall back to a globe.
    node.querySelector(".tab-favicon").addEventListener("error", (e) => {
      if (e.currentTarget.dataset.src)
        tab.failedIcons.add(e.currentTarget.dataset.src);
      renderTab(tab);
    });

    node.addEventListener("mousedown", (e) => {
      // Middle click closes, like every desktop browser.
      if (e.button === 1) e.preventDefault();
    });
    node.addEventListener("auxclick", (e) => {
      if (e.button === 1) closeTab(tab.id);
    });
    node.addEventListener("click", (e) => {
      if (e.target.closest(".tab-close")) return;
      activateTab(tab.id);
    });
    node.querySelector(".tab-close").addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });
    node.addEventListener("keydown", onTabKeydown);
    return node;
  }

  function renderTab(tab) {
    const { node } = tab;
    const title =
      tab.title ||
      (tab.url ? hostnameOf(tab.url) : NEW_TAB_TITLE) ||
      NEW_TAB_TITLE;
    const titleEl = node.querySelector(".tab-title");
    if (titleEl.textContent !== title) titleEl.textContent = title;
    node.title = title;
    node.setAttribute("aria-label", title);

    const failed = tab.error && tab.error.kind === "transport";
    const favicon = failed ? "" : pickFavicon(tab);
    const img = node.querySelector(".tab-favicon");
    if (img.dataset.src !== favicon) {
      img.dataset.src = favicon;
      if (favicon) img.src = favicon;
      else img.removeAttribute("src");
    }
    node.querySelector(".tab-icon").classList.toggle("no-favicon", !favicon);
    node
      .querySelector(".tab-fallback use")
      .setAttribute("href", failed ? "#i-alert" : "#i-globe");

    node.classList.toggle("loading", tab.loading);
    node.classList.toggle("errored", !!tab.error);
    node.setAttribute("aria-busy", String(tab.loading));
  }

  function pickFavicon(tab) {
    if (!tab.url) return NEW_TAB_ICON;
    const candidates = [tab.favicon, fallbackFavicon(tab.url)].filter(Boolean);
    return candidates.find((url) => !tab.failedIcons.has(url)) || "";
  }

  function onTabKeydown(e) {
    const index = tabs.findIndex((t) => t.node === e.currentTarget);
    let target = null;
    if (e.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
    else if (e.key === "ArrowLeft")
      target = tabs[(index - 1 + tabs.length) % tabs.length];
    else if (e.key === "Home") target = tabs[0];
    else if (e.key === "End") target = tabs[tabs.length - 1];
    else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      const neighbour = tabs[index + 1] || tabs[index - 1];
      closeTab(tabs[index].id);
      (neighbour ? neighbour.node : activeTab().node).focus();
      return;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateTab(tabs[index].id);
      return;
    }
    if (target) {
      e.preventDefault();
      activateTab(target.id);
      target.node.focus();
    }
  }

  function scrollTabIntoView(tab) {
    const scroller = el.tabsScroller;
    const { offsetLeft, offsetWidth } = tab.node;
    if (offsetLeft < scroller.scrollLeft) {
      scroller.scrollTo({ left: offsetLeft - 8, behavior: "smooth" });
    } else if (
      offsetLeft + offsetWidth >
      scroller.scrollLeft + scroller.clientWidth
    ) {
      scroller.scrollTo({
        left: offsetLeft + offsetWidth - scroller.clientWidth + 8,
        behavior: "smooth",
      });
    }
  }

  // Vertical wheel scrolls the tab strip horizontally when it overflows.
  el.tabsScroller.addEventListener(
    "wheel",
    (e) => {
      if (
        Math.abs(e.deltaY) > Math.abs(e.deltaX) &&
        el.tabsScroller.scrollWidth > el.tabsScroller.clientWidth
      ) {
        el.tabsScroller.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // ======================================================================
  // Tab lifecycle
  // ======================================================================

  function createTab({
    url = "",
    title = "",
    favicon = "",
    activate = true,
    index = tabs.length,
  } = {}) {
    const tab = {
      id: String(nextId++),
      url,
      title,
      favicon,
      loading: false,
      canGoBack: false,
      canGoForward: false,
      error: null,
      failedIcons: new Set(),
      iframe: null,
      ready: false,
      node: null,
    };
    tab.node = createTabNode(tab);
    tabs.splice(index, 0, tab);
    el.tabs.insertBefore(tab.node, el.tabs.children[index] || null);
    renderTab(tab);
    if (activate) activateTab(tab.id);
    saveSession();
    return tab;
  }

  function ensureFrame(tab) {
    if (tab.iframe || !tab.url) return;
    const iframe = document.createElement("iframe");
    iframe.id = "frame-" + tab.id;
    iframe.title = "Web content";
    iframe.allowFullscreen = true;
    iframe.setAttribute(
      "allow",
      "fullscreen; autoplay; clipboard-read; clipboard-write; encrypted-media; picture-in-picture",
    );
    iframe.src = "/embed.html#" + tab.url;
    tab.iframe = iframe;
    tab.ready = false;
    tab.loading = true;
    iframe.classList.toggle("active", tab.id === activeId);
    el.frames.appendChild(iframe);
  }

  function activateTab(id) {
    const tab = getTab(id);
    if (!tab) return;
    const previous = activeTab();
    activeId = id;

    if (previous && previous !== tab) {
      previous.node.setAttribute("aria-selected", "false");
      previous.node.tabIndex = -1;
      if (previous.iframe) previous.iframe.classList.remove("active");
    }
    tab.node.setAttribute("aria-selected", "true");
    tab.node.tabIndex = 0;

    ensureFrame(tab);
    if (tab.iframe) tab.iframe.classList.add("active");

    closeSuggestions();
    syncChrome({ force: true });
    scrollTabIntoView(tab);
    saveSession();
  }

  function closeTab(id) {
    const index = tabs.findIndex((t) => t.id === id);
    if (index === -1) return;
    const [tab] = tabs.splice(index, 1);
    if (tab.openerId) {
      const opener = getTab(tab.openerId);
      if (opener) sendCommand(opener, "popupclosed", { popupId: tab.popupId });
    }

    if (tab.url) {
      closedTabs.push({
        url: tab.url,
        title: tab.title,
        favicon: tab.favicon,
        index,
      });
      if (closedTabs.length > MAX_CLOSED) closedTabs.shift();
    }
    tab.node.remove();
    if (tab.iframe) tab.iframe.remove();

    if (tabs.length === 0) {
      createTab();
      focusOmnibox();
    } else if (id === activeId) {
      // Prefer the tab that slid into this slot, else the one to the left.
      activeId = null;
      activateTab((tabs[index] || tabs[index - 1]).id);
    }
    saveSession();
  }

  function restoreClosedTab() {
    const entry = closedTabs.pop();
    if (!entry) return;
    createTab({ ...entry, index: Math.min(entry.index, tabs.length) });
  }

  function cycleTab(delta) {
    const index = tabs.findIndex((t) => t.id === activeId);
    activateTab(tabs[(index + delta + tabs.length) % tabs.length].id);
  }

  // ======================================================================
  // Navigation + bridge
  // ======================================================================

  function sendCommand(tab, command, extra = {}) {
    if (!tab.iframe || !tab.ready) return false;
    tab.iframe.contentWindow.postMessage(
      { type: "browser:command", command, ...extra },
      location.origin,
    );
    return true;
  }

  function navigate(tab, url) {
    // An embed whose transport never came up can't take commands; start it over.
    if (tab.iframe && tab.error && tab.error.kind === "transport") {
      tab.iframe.remove();
      tab.iframe = null;
    }
    tab.url = url;
    tab.title = "";
    tab.favicon = "";
    tab.error = null;
    tab.loading = true;

    if (!tab.iframe) {
      ensureFrame(tab);
    } else if (!sendCommand(tab, "go", { url })) {
      // Embed is still booting: a hash change is picked up by its hashchange listener.
      tab.iframe.contentWindow.location.hash = url;
    }
    renderTab(tab);
    if (tab.id === activeId) syncChrome();
    saveSession();
  }

  function navigateActive(raw) {
    const result = resolveInput(raw);
    if (result.error) {
      if (result.error !== "empty") toast(result.error);
      return false;
    }
    navigate(activeTab(), result.url);
    return true;
  }

  function focusFrame(tab) {
    if (tab.iframe) tab.iframe.focus();
    else if (document.activeElement) document.activeElement.blur();
  }

  function tabFromSource(source) {
    return tabs.find((t) => t.iframe && t.iframe.contentWindow === source);
  }

  function handleBridgeMessage(event) {
    if (event.origin !== location.origin) return;
    const data = event.data;
    if (
      !data ||
      typeof data.type !== "string" ||
      !data.type.startsWith("browser:")
    )
      return;
    const tab = tabFromSource(event.source);
    if (!tab) return;

    switch (data.type) {
      case "browser:newtab": {
        if (typeof data.url !== "string") return;
        const result = data.url === "" ? { url: "" } : resolveInput(data.url);
        if (result.error) return;
        if (data.popupId !== undefined && typeof data.popupId !== "string")
          return;
        const opened = createTab({
          url: result.url,
          activate: data.activate !== false,
        });
        if (data.popupId) {
          opened.openerId = tab.id;
          opened.popupId = data.popupId;
        }
        ensureFrame(opened);
        // Keyboard focus would otherwise stay in the now-hidden opener.
        if (opened.id === activeId) focusFrame(opened);
        return;
      }
      case "browser:popupnavigate":
      case "browser:popupfocus":
      case "browser:popupclose": {
        if (typeof data.popupId !== "string") return;
        const popup = tabs.find(
          (candidate) =>
            candidate.openerId === tab.id && candidate.popupId === data.popupId,
        );
        if (!popup) return;
        if (data.type === "browser:popupnavigate") {
          if (typeof data.url !== "string") return;
          const result = resolveInput(data.url);
          if (!result.error) navigate(popup, result.url);
        } else if (data.type === "browser:popupfocus") {
          activateTab(popup.id);
          focusFrame(popup);
        } else {
          closeTab(popup.id);
        }
        return;
      }
      case "browser:ready":
        tab.ready = true;
        break;
      case "browser:loading":
        tab.loading = true;
        if (tab.error && tab.error.kind !== "transport") tab.error = null;
        break;
      case "browser:loaded":
        tab.loading = false;
        if (tab.error && tab.error.kind === "timeout") tab.error = null;
        break;
      case "browser:urlchange":
        if (data.url && data.url !== tab.url) {
          tab.url = data.url;
          // A new document gets a new favicon; keep the title until the page reports one.
          tab.favicon = "";
        }
        break;
      case "browser:titlechange":
        tab.title = data.title || "";
        break;
      case "browser:faviconchange":
        tab.favicon = data.favicon || "";
        break;
      case "browser:history":
        tab.canGoBack = !!data.canGoBack;
        tab.canGoForward = !!data.canGoForward;
        break;
      case "browser:error":
        console.warn(
          `[browser] tab ${tab.id} error (${data.kind}):`,
          data.message,
        );
        if (data.kind === "devtools") {
          toast(data.message);
        } else {
          tab.error = { kind: data.kind, message: data.message };
          if (data.kind === "transport") tab.loading = false;
        }
        break;
      case "browser:shortcut":
        handleShortcut(data);
        return;
      default:
        return;
    }

    renderTab(tab);
    // Background tabs only update their own tab; the omnibox and nav state
    // always reflect the active tab.
    if (tab.id === activeId) syncChrome();
    saveSession();
  }

  window.addEventListener("message", handleBridgeMessage);

  // ======================================================================
  // Chrome sync (omnibox, nav buttons, progress, NTP, banner)
  // ======================================================================

  let progressState = "idle";

  function setProgress(loading) {
    if (loading && progressState !== "running") {
      el.progress.classList.remove("done");
      void el.progress.offsetWidth; // restart the animation
      el.progress.classList.add("running");
      progressState = "running";
    } else if (!loading && progressState === "running") {
      el.progress.classList.remove("running");
      el.progress.classList.add("done");
      progressState = "idle";
    }
  }

  function syncChrome({ force = false } = {}) {
    const tab = activeTab();
    if (!tab) return;

    if (force || document.activeElement !== el.input) {
      el.input.value = tab.url;
      updateOmniboxIcon(tab.url);
    }

    el.back.disabled = !tab.canGoBack;
    el.forward.disabled = !tab.canGoForward;
    el.reload.disabled = !tab.url;
    el.reload.classList.toggle("is-loading", tab.loading);
    el.reload.setAttribute(
      "aria-label",
      tab.loading ? "Stop loading" : "Reload",
    );
    el.reload.title = tab.loading ? "Stop" : "Reload";

    setProgress(tab.loading && !!tab.url);
    el.ntp.hidden = !!tab.url;

    const showBanner = tab.error && tab.error.kind === "timeout";
    el.banner.hidden = !showBanner;
    if (showBanner) el.bannerText.textContent = tab.error.message;

    updateMenuState();
  }

  function updateOmniboxIcon(value) {
    let name = "search";
    let secure = false;
    if (value && /^https?:\/\//i.test(value) && !value.startsWith(SEARCH_URL)) {
      secure = value.startsWith("https://");
      name = secure ? "lock" : "globe";
    }
    el.inputIcon.classList.toggle("secure", secure);
    el.inputIcon.querySelector("use").setAttribute("href", "#i-" + name);
  }

  // ======================================================================
  // Omnibox + autocomplete
  // ======================================================================

  let typedValue = "";
  let suggestionItems = [];
  let selectedIndex = -1;
  let suggestTimer = null;
  let suggestAbort = null;

  function focusOmnibox() {
    if (el.browser.classList.contains("dock-collapsed"))
      setDockCollapsed(false);
    el.input.focus();
    el.input.select();
  }

  function openSuggestions() {
    el.suggestions.hidden = false;
    el.omnibox.classList.add("open");
    el.input.setAttribute("aria-expanded", "true");
    setPopupOverflow(true);
  }

  function closeSuggestions() {
    clearTimeout(suggestTimer);
    if (suggestAbort) suggestAbort.abort();
    suggestionItems = [];
    selectedIndex = -1;
    el.suggestions.hidden = true;
    el.suggestions.replaceChildren();
    el.omnibox.classList.remove("open");
    el.input.setAttribute("aria-expanded", "false");
    el.input.removeAttribute("aria-activedescendant");
  }

  function renderSuggestions(query, phrases) {
    const items = [];
    const resolved = resolveInput(query);
    if (resolved.url && !resolved.url.startsWith(SEARCH_URL)) {
      items.push({ kind: "url", value: resolved.url, label: resolved.url });
    }
    for (const phrase of phrases) {
      if (items.length >= 8) break;
      items.push({ kind: "search", value: phrase, label: phrase });
    }
    if (!items.some((i) => i.kind === "search" && i.value === query)) {
      items.splice(items[0] && items[0].kind === "url" ? 1 : 0, 0, {
        kind: "search",
        value: query,
        label: query,
        hint: "Search",
      });
    }

    suggestionItems = items;
    selectedIndex = -1;
    el.suggestions.replaceChildren(
      ...items.map((item, i) => {
        const li = document.createElement("li");
        li.className = "suggestion";
        li.id = "suggestion-" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${item.kind === "url" ? "globe" : "search"}" /></svg>`;
        const text = document.createElement("span");
        text.className = "suggestion-text";
        text.textContent = item.label;
        li.append(text);
        if (item.hint) {
          const hint = document.createElement("span");
          hint.className = "suggestion-hint";
          hint.textContent = item.hint;
          li.append(hint);
        }
        // mousedown keeps focus in the input so blur doesn't close the list first.
        li.addEventListener("mousedown", (e) => e.preventDefault());
        li.addEventListener("click", () => commitSuggestion(item));
        return li;
      }),
    );
    openSuggestions();
  }

  function fetchSuggestions(query) {
    clearTimeout(suggestTimer);
    if (suggestAbort) suggestAbort.abort();
    if (!query.trim()) {
      closeSuggestions();
      return;
    }
    suggestTimer = setTimeout(async () => {
      suggestAbort = new AbortController();
      let phrases = [];
      try {
        const res = await fetch(
          `/api/autocomplete?q=${encodeURIComponent(query)}`,
          {
            signal: suggestAbort.signal,
          },
        );
        const data = await res.json();
        if (Array.isArray(data))
          phrases = data.map((s) => s.phrase).filter(Boolean);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.warn("Autocomplete error:", err);
      }
      // Ignore late responses for text the user has since changed.
      if (document.activeElement === el.input && typedValue === query)
        renderSuggestions(query, phrases);
    }, 90);
  }

  function selectSuggestion(index) {
    const items = el.suggestions.children;
    if (selectedIndex >= 0 && items[selectedIndex])
      items[selectedIndex].setAttribute("aria-selected", "false");
    selectedIndex = index;
    if (index >= 0 && items[index]) {
      items[index].setAttribute("aria-selected", "true");
      items[index].scrollIntoView({ block: "nearest" });
      el.input.setAttribute("aria-activedescendant", items[index].id);
      el.input.value = suggestionItems[index].value;
    } else {
      el.input.removeAttribute("aria-activedescendant");
      el.input.value = typedValue;
    }
    updateOmniboxIcon(el.input.value);
  }

  function commitSuggestion(item) {
    closeSuggestions();
    const ok =
      item.kind === "url"
        ? (navigate(activeTab(), item.value), true)
        : navigateActive(item.value);
    if (ok) el.input.blur();
  }

  el.input.addEventListener("input", () => {
    typedValue = el.input.value;
    updateOmniboxIcon(typedValue);
    fetchSuggestions(typedValue);
  });

  el.input.addEventListener("focus", () => {
    typedValue = el.input.value;
    // Select on the next frame so the click that focused the input doesn't collapse the selection.
    requestAnimationFrame(() => {
      if (document.activeElement === el.input) el.input.select();
    });
  });

  el.input.addEventListener("blur", () => {
    closeSuggestions();
    const tab = activeTab();
    // Revert unsubmitted edits so the bar keeps showing the real URL.
    if (tab) {
      el.input.value = tab.url;
      updateOmniboxIcon(tab.url);
    }
  });

  el.input.addEventListener("keydown", (e) => {
    const open = !el.suggestions.hidden && suggestionItems.length > 0;
    // The list is rendered bottom-up, so ArrowUp moves away from the input.
    if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      selectSuggestion(Math.min(selectedIndex + 1, suggestionItems.length - 1));
    } else if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      selectSuggestion(Math.max(selectedIndex - 1, -1));
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (open) {
        el.input.value = typedValue;
        closeSuggestions();
      } else {
        el.input.blur();
      }
    }
  });

  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const item = selectedIndex >= 0 ? suggestionItems[selectedIndex] : null;
    if (item) {
      commitSuggestion(item);
      return;
    }
    closeSuggestions();
    if (navigateActive(el.input.value)) el.input.blur();
  });

  // ======================================================================
  // Nav buttons
  // ======================================================================

  function goBack() {
    const tab = activeTab();
    if (tab && tab.canGoBack) sendCommand(tab, "back");
  }

  function goForward() {
    const tab = activeTab();
    if (tab && tab.canGoForward) sendCommand(tab, "forward");
  }

  function reloadOrStop() {
    const tab = activeTab();
    if (!tab || !tab.url) return;
    if (tab.loading) {
      if (!sendCommand(tab, "stop")) return;
      tab.loading = false;
    } else {
      reloadTab(tab);
      return;
    }
    renderTab(tab);
    syncChrome();
  }

  function reloadTab(tab) {
    if (!tab.url) return;
    tab.error = null;
    if (!sendCommand(tab, "reload")) {
      // Bridge not up (e.g. the transport failed): reload the whole embed.
      if (tab.iframe) tab.iframe.remove();
      tab.iframe = null;
      ensureFrame(tab);
    }
    tab.loading = true;
    renderTab(tab);
    if (tab.id === activeId) syncChrome();
  }

  el.home.addEventListener("click", () => {
    window.location.href = "/";
  });
  el.back.addEventListener("click", goBack);
  el.forward.addEventListener("click", goForward);
  el.reload.addEventListener("click", reloadOrStop);
  el.newTab.addEventListener("click", () => {
    createTab();
    focusOmnibox();
  });

  el.bannerRetry.addEventListener("click", () => reloadTab(activeTab()));
  el.bannerDismiss.addEventListener("click", () => {
    const tab = activeTab();
    tab.error = null;
    renderTab(tab);
    syncChrome();
  });

  // ======================================================================
  // Overflow menu
  // ======================================================================

  const modLabel = IS_MAC ? "⌘" : "Ctrl+";
  el.menu.querySelectorAll("kbd[data-kbd]").forEach((kbd) => {
    kbd.textContent =
      modLabel + kbd.dataset.kbd.replace("⇧", IS_MAC ? "⇧" : "Shift+");
  });
  el.newTab.title = `New tab (${modLabel}T)`;
  el.reload.title = `Reload (${modLabel}R)`;

  function menuItems() {
    return [...el.menu.querySelectorAll(".menu-item")].filter(
      (i) => !i.disabled && i.offsetParent !== null,
    );
  }

  function updateMenuState() {
    const tab = activeTab();
    const item = (action) => el.menu.querySelector(`[data-action="${action}"]`);
    item("restore-tab").disabled = closedTabs.length === 0;
    item("forward").disabled = !tab || !tab.canGoForward;
    item("copy-link").disabled = !tab || !tab.url;
    item("fullscreen").disabled = !tab || !tab.iframe;
    item("devtools").disabled = !tab || !tab.ready;
  }

  function openMenu() {
    updateMenuState();
    el.menu.hidden = false;
    el.menuBtn.setAttribute("aria-expanded", "true");
    setPopupOverflow(true);
    const first = menuItems()[0];
    if (first) first.focus();
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (el.menu.hidden) return;
    el.menu.hidden = true;
    el.menuBtn.setAttribute("aria-expanded", "false");
    if (restoreFocus) el.menuBtn.focus();
  }

  el.menuBtn.addEventListener("click", () =>
    el.menu.hidden ? openMenu() : closeMenu(),
  );

  el.menu.addEventListener("keydown", (e) => {
    const items = menuItems();
    const index = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      items[(index + delta + items.length) % items.length].focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1].focus();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (e.key === "Escape") e.preventDefault();
      closeMenu({ restoreFocus: e.key === "Escape" });
    }
  });

  el.menu.addEventListener("click", async (e) => {
    const item = e.target.closest(".menu-item");
    if (!item || item.disabled) return;
    closeMenu();
    const tab = activeTab();
    switch (item.dataset.action) {
      case "new-tab":
        createTab();
        focusOmnibox();
        break;
      case "restore-tab":
        restoreClosedTab();
        break;
      case "forward":
        goForward();
        break;
      case "copy-link":
        try {
          await navigator.clipboard.writeText(tab.url);
          toast("Link copied");
        } catch {
          toast("Couldn't copy the link");
        }
        break;
      case "fullscreen":
        if (tab.iframe && tab.iframe.requestFullscreen) {
          tab.iframe
            .requestFullscreen()
            .catch(() => toast("Fullscreen isn't available"));
        }
        break;
      case "devtools":
        sendCommand(tab, "devtools");
        break;
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (!el.menu.hidden && !e.target.closest(".menu-anchor")) closeMenu();
  });

  // Clicking into a page moves focus into its iframe: close any popups.
  window.addEventListener("blur", () => {
    closeMenu();
    if (document.activeElement !== el.input) closeSuggestions();
  });

  // ======================================================================
  // Dock collapse
  // ======================================================================

  // The dock's clip box hides content while it animates; popups (menu,
  // suggestions) need to overflow it, so only unclip once it's settled open.
  function setPopupOverflow(on) {
    el.dockClip.classList.toggle(
      "overflow-visible",
      on && !el.browser.classList.contains("dock-collapsed"),
    );
  }

  let unclipTimer = null;

  function setDockCollapsed(
    collapsed,
    { persist = true, animate = true } = {},
  ) {
    closeMenu();
    closeSuggestions();
    el.browser.classList.toggle("dock-collapsed", collapsed);
    clearTimeout(unclipTimer);
    if (collapsed) setPopupOverflow(false);
    else
      unclipTimer = setTimeout(() => setPopupOverflow(true), animate ? 240 : 0);
    el.dockWrap.inert = collapsed;
    el.dockCollapse.setAttribute("aria-expanded", String(!collapsed));
    el.dockExpand.setAttribute("aria-expanded", String(!collapsed));
    if (persist) {
      try {
        localStorage.setItem(DOCK_KEY, collapsed ? "collapsed" : "open");
      } catch {
        /* ignore */
      }
    }
  }

  el.dockCollapse.addEventListener("click", () => {
    setDockCollapsed(true);
    el.dockExpand.focus({ preventScroll: true });
  });
  el.dockExpand.addEventListener("click", () => {
    setDockCollapsed(false);
    el.input.focus();
  });

  // ======================================================================
  // Keyboard shortcuts
  // ======================================================================

  // Shared by the shell's own keydown handler and shortcuts forwarded from
  // pages (browser:shortcut). Returns true when handled.
  function handleShortcut(e) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const mod = IS_MAC ? e.metaKey || e.ctrlKey : e.ctrlKey;

    if (e.ctrlKey && key === "Tab") {
      cycleTab(e.shiftKey ? -1 : 1);
      return true;
    }
    if (!mod || e.altKey) return false;

    if (key === "l") {
      focusOmnibox();
    } else if (key === "t" && e.shiftKey) {
      restoreClosedTab();
    } else if (key === "t") {
      createTab();
      focusOmnibox();
    } else if (key === "w" && !e.shiftKey) {
      closeTab(activeId);
    } else if (key === "r" && !e.shiftKey) {
      reloadTab(activeTab());
    } else if (/^[1-9]$/.test(key)) {
      const n = Number(key);
      activateTab(
        (n === 9 ? tabs[tabs.length - 1] : tabs[n - 1] || tabs[tabs.length - 1])
          .id,
      );
    } else {
      return false;
    }
    return true;
  }

  function isEditable(target) {
    return (
      target &&
      (target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
    );
  }

  window.addEventListener(
    "keydown",
    (e) => {
      if (handleShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (isEditable(e.target)) return;
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      } else if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        goForward();
      } else if (e.key === "F5") {
        e.preventDefault();
        reloadTab(activeTab());
      }
    },
    true,
  );

  // ======================================================================
  // Toasts
  // ======================================================================

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    el.toasts.append(node);
    setTimeout(() => {
      node.classList.add("leaving");
      setTimeout(() => node.remove(), 200);
    }, 2400);
  }

  // ======================================================================
  // New tab page
  // ======================================================================

  el.ntpShortcuts.replaceChildren(
    ...SHORTCUTS.map(({ title, url, img }) => {
      const link = document.createElement("a");
      link.className = "ntp-shortcut";
      link.href = "#";
      link.innerHTML = `<img alt="" loading="eager" /><span></span>`;
      link.querySelector("img").src = img;
      link.querySelector("span").textContent = title;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigate(activeTab(), url);
      });
      return link;
    }),
  );

  // ======================================================================
  // Boot
  // ======================================================================

  function boot() {
    const session = loadSession();
    if (session) {
      closedTabs = Array.isArray(session.closed)
        ? session.closed.slice(-MAX_CLOSED)
        : [];
      for (const saved of session.tabs) {
        if (saved && typeof saved.url === "string") {
          createTab({
            url: saved.url,
            title: saved.title || "",
            favicon: saved.favicon || "",
            activate: false,
          });
        }
      }
    }

    // hire() on other pages hands us a URL through sessionStorage.
    let incoming = null;
    try {
      incoming = sessionStorage.getItem("encodedUrl");
      sessionStorage.removeItem("encodedUrl");
    } catch {
      /* ignore */
    }

    if (incoming) {
      const result = resolveInput(incoming);
      createTab({ url: result.url || "" });
    } else if (tabs.length > 0) {
      const index = Math.min(Math.max(session.active | 0, 0), tabs.length - 1);
      activateTab(tabs[index].id);
    } else {
      createTab();
    }

    let dockState = null;
    try {
      dockState = localStorage.getItem(DOCK_KEY);
    } catch {
      /* ignore */
    }
    setDockCollapsed(dockState === "collapsed", {
      persist: false,
      animate: false,
    });

    if (!activeTab().url) focusOmnibox();
  }

  boot();
})();

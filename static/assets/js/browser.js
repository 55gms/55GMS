(() => {
  const STORAGE_KEY = "55gms:browser";
  const DOCK_KEY = "55gms:browser:dock";
  const BOOKMARKS_KEY = "55gms:browser:bookmarks";
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
    browser: $("xxbjs"),
    tabs: $("zn76j"),
    tabsScroller: $("zjag8z"),
    newTab: $("sfshi3"),
    frames: $("trkd31i"),
    progress: $("zwo69g"),
    ntp: $("v74mrg"),
    ntpShortcuts: $("usxf98b"),
    banner: $("fdloq4d"),
    bannerText: $("tls82"),
    bannerRetry: $("jeze9dd"),
    bannerDismiss: $("tfjzze"),
    dockClip: document.querySelector(".qgbgr6o"),
    dockWrap: $("vbedu2h"),
    dockCollapse: $("kvfvdv"),
    dockExpand: $("sazoy"),
    home: $("tiordb"),
    back: $("un6id"),
    forward: $("fgczjjc"),
    reload: $("vvkynq8"),
    bookmarkBtn: $("tzatlc"),
    bookmarkPanel: $("wr1nine"),
    bookmarkList: $("z2ph8v"),
    bookmarkClose: $("aocw5c9"),
    tabContext: $("bjepr"),
    menuBtn: $("uvwywv8"),
    menu: $("zffhok"),
    omnibox: $("p9yavka"),
    form: $("vl4nbyy"),
    input: $("bkhpd"),
    inputIcon: $("znijk"),
    suggestions: $("oyncvy"),
    toasts: $("emk9po"),
  };

  const IPV4 = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;
  const LOCALHOST = /^localhost(:\d+)?(\/.*)?$/i;
  const DOMAIN = /^([a-z\d]([a-z\d-]*[a-z\d])?\.)+[a-z]{2,}(:\d+)?([/?#].*)?$/i;
  const HAS_SCHEME = /^[a-z][a-z\d+.-]*:/i;

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
        } catch {}
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

  const tabs = [];
  let activeId = null;
  let nextId = 1;
  let closedTabs = [];

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
            tabs: tabs.map(({ url, title, favicon, pinned }) => ({
              url,
              title,
              favicon,
              pinned: !!pinned,
            })),
            closed: closedTabs,
          }),
        );
      } catch {}
    });
  }

  function loadSession() {
    try {
      const [entry] = performance.getEntriesByType("navigation");
      if (!entry || entry.type !== "reload") return null;
      const data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (!data || !Array.isArray(data.tabs)) return null;
      return data;
    } catch {
      return null;
    }
  }

  function createTabNode(tab) {
    const node = document.createElement("div");
    node.className = "yaioh9w aihfic";
    node.id = "tab-" + tab.id;
    node.setAttribute("role", "tab");
    node.setAttribute("aria-selected", "false");
    node.tabIndex = -1;
    node.innerHTML = `
      <span class="f6fawdj">
        <img loading="eager" class="azbweq" alt="" draggable="false" />
        <svg class="qapv7vq mahozv" aria-hidden="true"><use href="#i-globe" /></svg>
        <span class="akk1h" aria-hidden="true"></span>
      </span>
      <span class="h6c4m"></span>
      <button class="kvsxy3x" type="button" aria-label="Close tab" tabindex="-1">
        <svg class="qapv7vq" aria-hidden="true"><use href="#i-x" /></svg>
      </button>`;
    node.addEventListener(
      "animationend",
      () => node.classList.remove("aihfic"),
      { once: true },
    );

    node.querySelector(".azbweq").addEventListener("error", (e) => {
      if (e.currentTarget.dataset.src)
        tab.failedIcons.add(e.currentTarget.dataset.src);
      renderTab(tab);
    });

    node.addEventListener("mousedown", (e) => {
      if (e.button === 1) e.preventDefault();
    });
    node.addEventListener("auxclick", (e) => {
      if (e.button === 1) closeTab(tab.id);
    });
    node.addEventListener("click", (e) => {
      if (e.target.closest(".kvsxy3x")) return;
      activateTab(tab.id);
    });
    node.querySelector(".kvsxy3x").addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });
    node.addEventListener("keydown", onTabKeydown);
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showTabContext(tab, e.clientX, e.clientY);
    });
    node.addEventListener("pointerdown", (e) => beginTabDrag(e, tab));
    node.addEventListener(
      "click",
      (e) => {
        if (node.dataset.suppressClick === "true") {
          e.preventDefault();
          e.stopImmediatePropagation();
          delete node.dataset.suppressClick;
        }
      },
      true,
    );
    return node;
  }

  function renderTab(tab) {
    const { node } = tab;
    node.classList.toggle("jkxfif", !!tab.pinned);
    const title =
      tab.title ||
      (tab.url ? hostnameOf(tab.url) : NEW_TAB_TITLE) ||
      NEW_TAB_TITLE;
    const titleEl = node.querySelector(".h6c4m");
    if (titleEl.textContent !== title) titleEl.textContent = title;
    node.title = title;
    node.setAttribute("aria-label", title);

    const failed = tab.error && tab.error.kind === "transport";
    const favicon = failed ? "" : pickFavicon(tab);
    const img = node.querySelector(".azbweq");
    if (img.dataset.src !== favicon) {
      img.dataset.src = favicon;
      if (favicon) img.src = favicon;
      else img.removeAttribute("src");
    }
    node.querySelector(".f6fawdj").classList.toggle("wizpl", !favicon);
    node
      .querySelector(".mahozv use")
      .setAttribute("href", failed ? "#i-alert" : "#i-globe");

    node.classList.toggle("q3jdy", tab.loading);
    node.classList.toggle("unk3hw8", !!tab.error);
    node.setAttribute("aria-busy", String(tab.loading));
  }

  function pickFavicon(tab) {
    if (!tab.url) return NEW_TAB_ICON;
    return tab.favicon && !tab.failedIcons.has(tab.favicon) ? tab.favicon : "";
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

  function createTab({
    url = "",
    title = "",
    favicon = "",
    activate = true,
    index = tabs.length,
    pinned = false,
  } = {}) {
    const tab = {
      id: String(nextId++),
      url,
      title,
      favicon,
      pinned: !!pinned,
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
    const pinCount = tabs.filter((t) => t.pinned).length;
    index = tab.pinned ? Math.min(index, pinCount) : Math.max(index, pinCount);
    tabs.splice(index, 0, tab);
    el.tabs.insertBefore(tab.node, el.tabs.children[index] || null);
    renderTab(tab);
    if (activate) activateTab(tab.id);
    saveSession();
    return tab;
  }

  function frameHash(url) {
    const bytes = new TextEncoder().encode(url);
    let out = "";
    for (let i = 0; i < bytes.length; i++)
      out += String.fromCharCode(bytes[i] ^ (37 + (i % 7)));
    return (
      "~" + btoa(out).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    );
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
    iframe.src = "/embed.html#" + frameHash(tab.url);
    tab.iframe = iframe;
    tab.ready = false;
    tab.loading = true;
    iframe.classList.toggle("qbohi", tab.id === activeId);
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
      if (previous.iframe) previous.iframe.classList.remove("qbohi");
    }
    tab.node.setAttribute("aria-selected", "true");
    tab.node.tabIndex = 0;

    ensureFrame(tab);
    if (tab.iframe) tab.iframe.classList.add("qbohi");

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
        pinned: tab.pinned,
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

  function sendCommand(tab, command, extra = {}) {
    if (!tab.iframe || !tab.ready) return false;
    tab.iframe.contentWindow.postMessage(
      { type: "browser:command", command, ...extra },
      location.origin,
    );
    return true;
  }

  function navigate(tab, url) {
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
      tab.iframe.contentWindow.location.hash = frameHash(url);
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

  function tabFromSource(source) {
    return tabs.find((t) => t.iframe && t.iframe.contentWindow === source);
  }

  function focusFrame(tab) {
    if (tab.iframe) tab.iframe.focus();
    else if (document.activeElement) document.activeElement.blur();
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
        if (data.activate !== false) focusFrame(opened);
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
    if (tab.id === activeId) syncChrome();
    saveSession();
  }

  window.addEventListener("message", handleBridgeMessage);

  let progressState = "idle";

  function setProgress(loading) {
    if (loading && progressState !== "running") {
      el.progress.classList.remove("xo7pl");
      void el.progress.offsetWidth;
      el.progress.classList.add("s6rrkvk");
      progressState = "running";
    } else if (!loading && progressState === "running") {
      el.progress.classList.remove("s6rrkvk");
      el.progress.classList.add("xo7pl");
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
    el.reload.classList.toggle("utygywe", tab.loading);
    el.reload.setAttribute(
      "aria-label",
      tab.loading ? "Stop loading" : "Reload",
    );
    el.reload.title = tab.loading ? "Stop" : "Reload";
    updateBookmarkButton();

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
    el.inputIcon.classList.toggle("ap4d7", secure);
    el.inputIcon.querySelector("use").setAttribute("href", "#i-" + name);
  }

  let typedValue = "";
  let suggestionItems = [];
  let selectedIndex = -1;
  let suggestTimer = null;
  let suggestAbort = null;

  function focusOmnibox() {
    if (el.browser.classList.contains("n8vuyk5")) setDockCollapsed(false);
    el.input.focus();
    el.input.select();
  }

  function openSuggestions() {
    el.suggestions.hidden = false;
    el.omnibox.classList.add("vpe4k1u");
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
    el.omnibox.classList.remove("vpe4k1u");
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
        li.className = "r7m8x";
        li.id = "suggestion-" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        li.innerHTML = `<svg class="qapv7vq" aria-hidden="true"><use href="#i-${item.kind === "url" ? "globe" : "search"}" /></svg>`;
        const text = document.createElement("span");
        text.className = "orrtzug";
        text.textContent = item.label;
        li.append(text);
        if (item.hint) {
          const hint = document.createElement("span");
          hint.className = "mcwlx4x";
          hint.textContent = item.hint;
          li.append(hint);
        }
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
    requestAnimationFrame(() => {
      if (document.activeElement === el.input) el.input.select();
    });
  });

  el.input.addEventListener("blur", () => {
    closeSuggestions();
    const tab = activeTab();
    if (tab) {
      el.input.value = tab.url;
      updateOmniboxIcon(tab.url);
    }
  });

  el.input.addEventListener("keydown", (e) => {
    const open = !el.suggestions.hidden && suggestionItems.length > 0;
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

  const modLabel = IS_MAC ? "⌘" : "Ctrl+";
  el.menu.querySelectorAll("kbd[data-kbd]").forEach((kbd) => {
    kbd.textContent =
      modLabel + kbd.dataset.kbd.replace("⇧", IS_MAC ? "⇧" : "Shift+");
  });
  el.newTab.title = `New tab (${modLabel}T)`;
  el.reload.title = `Reload (${modLabel}R)`;

  function menuItems() {
    return [...el.menu.querySelectorAll(".zkivham")].filter(
      (i) => !i.disabled && i.offsetParent !== null,
    );
  }

  function updateMenuState() {
    const tab = activeTab();
    const item = (action) => el.menu.querySelector(`[data-action="${action}"]`);
    item("restore-tab").disabled = closedTabs.length === 0;
    item("forward").disabled = !tab || !tab.canGoForward;
    item("copy-link").disabled = !tab || !tab.url;
    item("pin").disabled = !tab;
    $("a9hm3").textContent = tab?.pinned ? "Unpin tab" : "Pin tab";
    item("fullscreen").disabled = false;
    $("a1n9l7").textContent = document.fullscreenElement
      ? "Unfullscreen"
      : "Fullscreen page";
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
    const item = e.target.closest(".zkivham");
    if (!item || item.disabled) return;
    closeMenu();
    const tab = activeTab();
    switch (item.dataset.action) {
      case "bookmarks":
        toggleBookmarkPanel();
        break;
      case "pin":
        setTabPinned(tab, !tab.pinned);
        break;
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
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else await document.documentElement.requestFullscreen();
        } catch {
          toast("Fullscreen isn't available");
        }
        break;
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (!el.menu.hidden && !e.target.closest(".b1gtzke")) closeMenu();
  });
  document.addEventListener("fullscreenchange", () => {
    $("a1n9l7").textContent = document.fullscreenElement
      ? "Unfullscreen"
      : "Fullscreen page";
  });

  window.addEventListener("blur", () => {
    closeMenu();
    if (document.activeElement !== el.input) closeSuggestions();
  });

  function setPopupOverflow(on) {
    el.dockClip.classList.toggle(
      "qe7iib",
      on && !el.browser.classList.contains("n8vuyk5"),
    );
  }

  let unclipTimer = null;

  function setDockCollapsed(
    collapsed,
    { persist = true, animate = true } = {},
  ) {
    closeMenu();
    closeSuggestions();
    el.browser.classList.toggle("n8vuyk5", collapsed);
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
      } catch {}
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

  function toast(message) {
    const node = document.createElement("div");
    node.className = "ooqjp";
    node.textContent = message;
    el.toasts.append(node);
    setTimeout(() => {
      node.classList.add("j27uw");
      setTimeout(() => node.remove(), 200);
    }, 2400);
  }

  el.ntpShortcuts.replaceChildren(
    ...SHORTCUTS.map(({ title, url, img }) => {
      const link = document.createElement("a");
      link.className = "r98trp5";
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

  let bookmarks = readBookmarks();

  function readBookmarks() {
    try {
      const stored = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
      return Array.isArray(stored)
        ? stored.filter((x) => x && typeof x.url === "string").slice(0, 200)
        : [];
    } catch {
      return [];
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {}
  }

  function updateBookmarkButton() {
    const tab = activeTab();
    const marked = !!tab?.url && bookmarks.some((b) => b.url === tab.url);
    el.bookmarkBtn.disabled = !tab?.url;
    el.bookmarkBtn.classList.toggle("h8zvi", marked);
    el.bookmarkBtn.setAttribute(
      "aria-label",
      marked ? "Remove bookmark" : "Bookmark this page",
    );
    el.bookmarkBtn.title = marked ? "Remove bookmark" : "Bookmark this page";
  }

  function toggleBookmark() {
    const tab = activeTab();
    if (!tab?.url) return;
    const idx = bookmarks.findIndex((b) => b.url === tab.url);
    if (idx !== -1) bookmarks.splice(idx, 1);
    else
      bookmarks.unshift({
        url: tab.url,
        title: tab.title || hostnameOf(tab.url),
      });
    saveBookmarks();
    updateBookmarkButton();
    renderBookmarks();
    toast(idx === -1 ? "Bookmark saved" : "Bookmark removed");
  }

  function renderBookmarks() {
    el.bookmarkList.replaceChildren();
    if (!bookmarks.length) {
      const empty = document.createElement("div");
      empty.className = "ucm5gl";
      empty.textContent = "No bookmarks yet";
      el.bookmarkList.append(empty);
      return;
    }
    for (const item of bookmarks) {
      const row = document.createElement("div");
      row.className = "sl2e1lb";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "fl7r1";
      const name = document.createElement("strong");
      const address = document.createElement("small");
      name.textContent = item.title || hostnameOf(item.url);
      address.textContent = item.url;
      open.append(name, address);
      open.addEventListener("click", () => {
        const tab = activeTab() || createTab();
        navigate(tab, item.url);
        el.bookmarkPanel.hidden = true;
      });
      const remove = document.createElement("button");
      remove.className = "t9ohzr y3oz7 kpfpu3";
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${name.textContent} bookmark`);
      remove.innerHTML =
        '<svg class="qapv7vq" aria-hidden="true"><use href="#i-x" /></svg>';
      remove.addEventListener("click", () => {
        bookmarks = bookmarks.filter((b) => b.url !== item.url);
        saveBookmarks();
        updateBookmarkButton();
        renderBookmarks();
      });
      row.append(open, remove);
      el.bookmarkList.append(row);
    }
  }

  function toggleBookmarkPanel() {
    el.bookmarkPanel.hidden = !el.bookmarkPanel.hidden;
    if (!el.bookmarkPanel.hidden) renderBookmarks();
    el.tabContext.hidden = true;
  }

  el.bookmarkBtn.addEventListener("click", toggleBookmark);
  el.bookmarkClose.addEventListener(
    "click",
    () => (el.bookmarkPanel.hidden = true),
  );
  document.addEventListener("pointerdown", (e) => {
    if (
      !el.bookmarkPanel.hidden &&
      !el.bookmarkPanel.contains(e.target) &&
      !e.target.closest('[data-action="bookmarks"]')
    )
      el.bookmarkPanel.hidden = true;
    if (!el.tabContext.hidden && !el.tabContext.contains(e.target))
      el.tabContext.hidden = true;
  });

  function moveTab(tab, nextIndex) {
    const index = tabs.indexOf(tab);
    if (
      index < 0 ||
      nextIndex < 0 ||
      nextIndex >= tabs.length ||
      index === nextIndex
    )
      return;
    const other = tabs[nextIndex];
    if (other.pinned !== tab.pinned) tab.pinned = other.pinned;
    tabs.splice(index, 1);
    tabs.splice(nextIndex, 0, tab);
    el.tabs.append(...tabs.map((t) => t.node));
    renderTab(tab);
    saveSession();
  }

  function setTabPinned(tab, value) {
    if (tab.pinned === value) return;
    const index = tabs.indexOf(tab);
    if (index < 0) return;
    tabs.splice(index, 1);
    tab.pinned = value;
    const destination = tabs.filter((t) => t.pinned).length;
    tabs.splice(destination, 0, tab);
    el.tabs.append(...tabs.map((t) => t.node));
    renderTab(tab);
    saveSession();
  }

  function showTabContext(tab, x, y) {
    const panel = el.tabContext;
    panel.replaceChildren();
    const index = tabs.indexOf(tab);
    const entries = [
      {
        label: "Move tab left",
        icon: "arrow-left",
        enabled: index > 0,
        action: () => moveTab(tab, index - 1),
      },
      {
        label: "Move tab right",
        icon: "arrow-right",
        enabled: index < tabs.length - 1,
        action: () => moveTab(tab, index + 1),
      },
      {
        label: tab.pinned ? "Unpin tab" : "Pin tab",
        icon: "pin",
        enabled: true,
        action: () => setTabPinned(tab, !tab.pinned),
      },
      {
        label: bookmarks.some((b) => b.url === tab.url)
          ? "Remove bookmark"
          : "Bookmark tab",
        icon: "star",
        enabled: !!tab.url,
        action: () => {
          const index = bookmarks.findIndex((b) => b.url === tab.url);
          if (index !== -1) bookmarks.splice(index, 1);
          else
            bookmarks.unshift({
              url: tab.url,
              title: tab.title || hostnameOf(tab.url),
            });
          saveBookmarks();
          updateBookmarkButton();
          renderBookmarks();
        },
      },
      {
        label: "Close tab",
        icon: "x",
        enabled: true,
        action: () => closeTab(tab.id),
      },
    ];
    for (const entry of entries) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ekr46";
      button.disabled = !entry.enabled;
      const icon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      icon.setAttribute("class", "icon");
      icon.setAttribute("aria-hidden", "true");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#i-" + entry.icon);
      icon.appendChild(use);
      const label = document.createElement("span");
      label.textContent = entry.label;
      button.append(icon, label);
      button.addEventListener("click", () => {
        panel.hidden = true;
        entry.action();
      });
      panel.appendChild(button);
    }
    panel.hidden = false;
    panel.style.left =
      Math.max(5, Math.min(x, innerWidth - panel.offsetWidth - 5)) + "px";
    panel.style.top =
      Math.max(5, Math.min(y, innerHeight - panel.offsetHeight - 5)) + "px";
    el.bookmarkPanel.hidden = true;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.tabContext.hidden) {
      el.tabContext.hidden = true;
      activeTab()?.node.focus();
    }
  });

  function beginTabDrag(e, tab) {
    if (e.button !== 0 || e.target.closest(".kvsxy3x")) return;
    el.tabContext.hidden = true;
    const node = tab.node;
    const startX = e.clientX;
    const originalLeft = node.getBoundingClientRect().left;
    let dragging = false;
    let lastX = startX;
    const move = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      lastX = ev.clientX;
      if (!dragging && Math.abs(lastX - startX) < 6) return;
      if (!dragging) {
        dragging = true;
        document.body.classList.add("x7gaiu");
        el.tabs.classList.add("xfko3g");
        node.classList.add("c5nc0");
      }
      ev.preventDefault();
      let i = tabs.indexOf(tab);
      const delta = lastX - startX;
      const desiredCenter = originalLeft + delta + node.offsetWidth / 2;
      const next = tabs[i + 1];
      const prev = tabs[i - 1];
      if (
        next &&
        desiredCenter >
          next.node.getBoundingClientRect().left + next.node.offsetWidth / 2
      ) {
        moveTab(tab, i + 1);
      } else if (
        prev &&
        desiredCenter <
          prev.node.getBoundingClientRect().left + prev.node.offsetWidth / 2
      ) {
        moveTab(tab, i - 1);
      }
      const ownLeft =
        node.getBoundingClientRect().left -
        (parseFloat(node.style.getPropertyValue("--tab-drag-x")) || 0);
      const x = originalLeft + delta - ownLeft;
      node.style.setProperty("--tab-drag-x", `${x}px`);
      node.style.transform = `translate3d(${x}px,-2px,0)`;
    };
    const end = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      if (dragging) {
        node.dataset.suppressClick = "true";
        document.body.classList.remove("x7gaiu");
        el.tabs.classList.remove("xfko3g");
        node.classList.remove("c5nc0");
        node.style.transform = "";
        node.style.removeProperty("--tab-drag-x");
        saveSession();
        setTimeout(() => {
          delete node.dataset.suppressClick;
        }, 0);
      }
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

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
            pinned: !!saved.pinned,
            activate: false,
          });
        }
      }
    }

    let incoming = null;
    try {
      incoming = sessionStorage.getItem("encodedUrl");
      sessionStorage.removeItem("encodedUrl");
    } catch {}

    if (incoming) {
      const result = resolveInput(incoming);
      createTab({ url: result.url || "" });
    } else if (tabs.length > 0 && !session) {
      createTab();
    } else if (tabs.length > 0) {
      const index = Math.min(Math.max(session.active | 0, 0), tabs.length - 1);
      activateTab(tabs[index].id);
    } else {
      createTab();
    }

    let dockState = null;
    try {
      dockState = localStorage.getItem(DOCK_KEY);
    } catch {}
    setDockCollapsed(dockState === "collapsed", {
      persist: false,
      animate: false,
    });

    if (!activeTab().url) focusOmnibox();
  }

  boot();
})();

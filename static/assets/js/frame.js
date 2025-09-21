document.addEventListener("DOMContentLoaded", () => {
  const prxBck = document.getElementById("prx-bck");
  const prxFwd = document.getElementById("prx-fwd");
  const prxRefresh = document.getElementById("prx-refresh");
  const prxAddress = document.getElementById("proxy-address");
  const prxHome = document.getElementById("prx-home");
  const prxFullScreen = document.getElementById("prx-fullscreen");
  const prxInspect = document.getElementById("prx-inspect");

  let devTools = false;
  const tabsContainer = document.getElementById("tabs");
  const framesContainer = document.getElementById("frames");
  const newTabBtn = document.getElementById("new-tab");
  let tabCount = 0;

  function resizeTabs() {
    const tabs = tabsContainer.querySelectorAll(".tab");
    const newTabButton = document.getElementById("new-tab");

    if (tabs.length === 0) return;

    // Wait for layout to settle
    requestAnimationFrame(() => {
      // Get available space (container width minus new tab button width and gaps)
      const containerWidth = tabsContainer.offsetWidth;
      const newTabButtonWidth = newTabButton.offsetWidth + 5; // include margin
      const gapSpace = (tabs.length - 1) * 5; // 5px gap between tabs
      const availableSpace = containerWidth - newTabButtonWidth - gapSpace - 10; // 10px buffer

      // Calculate ideal tab width
      const idealWidth = Math.max(
        60,
        Math.min(200, availableSpace / tabs.length)
      );

      // Apply the calculated width to all tabs
      tabs.forEach((tab) => {
        tab.style.width = `${idealWidth}px`;
      });
    });
  }
  function isUrl(val = "") {
    if (
      /^http(s?):\/\//.test(val) ||
      (val.includes(".") && val.slice(0, 1) !== " ")
    )
      return true;
    return false;
  }

  function getTabUrl(url) {
    if (url.startsWith("/")) {
      return url;
    } else if (!isUrl(url)) {
      // It's a search query
      return "/embed.html#https://duckduckgo.com/?q=" + encodeURIComponent(url);
    } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
      // It's a domain without protocol
      return "/embed.html#https://" + url;
    } else {
      // It's a full URL with protocol
      return "/embed.html#" + url;
    }
  }

  function createTab(url = "/new") {
    tabCount++;
    const id = "tab-" + tabCount;

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.id = id;
    tab.innerHTML = `<span>Tab ${tabCount}</span> <i class="fa-solid fa-x close"></i>`;

    const newTabButton = document.getElementById("new-tab");
    tabsContainer.insertBefore(tab, newTabButton);

    const iframe = document.createElement("iframe");
    iframe.src = getTabUrl(url);
    iframe.id = id;
    iframe.style.border = "0px #ffffff none";
    iframe.name = "Iframe";
    iframe.allowFullscreen = true;
    framesContainer.appendChild(iframe);

    tab.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        closeTab(id, tab, iframe);
      } else {
        activateTab(id);
      }
    });

    activateTab(id);

    setTimeout(() => {
      resizeTabs();
    }, 50);
  }

  function activateTab(id) {
    // Remove active class from all tabs and iframes first
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll("iframe")
      .forEach((f) => f.classList.remove("active"));

    const tab = tabsContainer.querySelector(`[data-id='${id}']`);
    const iframe = document.getElementById(id);

    if (tab && iframe) {
      // Add active class synchronously
      tab.classList.add("active");
      iframe.classList.add("active");

      // Force layout recalculation to ensure classes are applied
      iframe.offsetHeight;

      // Update search bar immediately, then with a small delay for backup
      updateSearchBarForSpecificFrame(iframe);

      setTimeout(() => {
        updateSearchBarForSpecificFrame(iframe);
      }, 100);
    }
  }

  function closeTab(id, tab, iframe) {
    tab.remove();
    iframe.remove();

    const remainingTabs = tabsContainer.querySelectorAll(".tab");
    if (remainingTabs.length === 0) {
      createTab("/new");
      prxAddress.focus();
      prxAddress.select();
    } else {
      const actualTabs = Array.from(remainingTabs);
      const lastTab = actualTabs[actualTabs.length - 1];
      if (lastTab) activateTab(lastTab.dataset.id);

      setTimeout(() => {
        resizeTabs();
      }, 50);
    }
  }

  newTabBtn.addEventListener("click", () => {
    createTab();
    prxAddress.focus();
  });

  function getActiveFrame() {
    // Use querySelector to find the iframe with active class
    const activeFrame = document.querySelector("iframe.active");

    // Double-check that it exists and is displayed
    if (activeFrame && activeFrame.style.display !== "none") {
      return activeFrame;
    }

    // Fallback: look for any iframe that has the active class
    const allFrames = document.querySelectorAll("iframe");
    for (let frame of allFrames) {
      if (frame.classList.contains("active")) {
        return frame;
      }
    }

    return null;
  }

  // Function to update search bar for a specific iframe
  function updateSearchBarForSpecificFrame(frame) {
    if (!frame) return;

    try {
      // First try to get URL from the Scramjet iframe inside embed.html
      const scramjetUrl = getScramjetIframeUrl(frame);
      if (
        scramjetUrl &&
        scramjetUrl !== "about:blank" &&
        !isScramjetProxyUrl(scramjetUrl)
      ) {
        prxAddress.value = scramjetUrl;
        return;
      }

      // Try to get URL from embed.html hash
      const extractedUrl = extractUrlFromEmbed(frame.src);
      if (
        extractedUrl &&
        extractedUrl !== "about:blank" &&
        !isScramjetProxyUrl(extractedUrl)
      ) {
        prxAddress.value = extractedUrl;
        return;
      }

      // Fallback: try to get the actual URL from the embed iframe
      const actualUrl = frame.contentWindow.location.href;
      if (actualUrl && actualUrl !== "about:blank") {
        const hashExtractedUrl = extractUrlFromEmbed(actualUrl);
        if (hashExtractedUrl && !isScramjetProxyUrl(hashExtractedUrl)) {
          prxAddress.value = hashExtractedUrl;
          return;
        }
      }
    } catch (e) {
      // If we can't access the iframe content (cross-origin),
      // extract URL from the embed src
      const extractedUrl = extractUrlFromEmbed(frame.src);
      if (extractedUrl && !isScramjetProxyUrl(extractedUrl)) {
        prxAddress.value = extractedUrl;
      }
    }
  }

  // Function to extract the actual URL from the iframe src
  function extractUrlFromEmbed(embedSrc) {
    if (embedSrc.includes("#")) {
      const hashPart = embedSrc.split("#")[1];
      return hashPart || "";
    }
    return embedSrc;
  }

  // Function to check if a URL is a Scramjet proxy URL
  function isScramjetProxyUrl(url) {
    return url && (url.includes("/scramjet/") || url.includes("/sw/"));
  }

  function decodeScramjetUrl(scramjetUrl) {
    try {
      if (scramjetUrl.includes("/scramjet/")) {
        const encodedPart = scramjetUrl.split("/scramjet/")[1];
        return decodeURIComponent(encodedPart);
      }
    } catch (e) {
      console.log("Error decoding Scramjet URL:", e);
    }
    return scramjetUrl;
  }

  function getScramjetIframeUrl(embedIframe) {
    try {
      // Access the embed.html document
      const embedDoc =
        embedIframe.contentDocument || embedIframe.contentWindow.document;

      // Look for the Scramjet iframe inside embed.html
      const scramjetIframe = embedDoc.querySelector("#iframe-container iframe");

      if (scramjetIframe && scramjetIframe.src) {
        const scramjetUrl = scramjetIframe.src;

        // If it's a Scramjet proxy URL, decode it to get the actual URL
        if (isScramjetProxyUrl(scramjetUrl)) {
          return decodeScramjetUrl(scramjetUrl);
        }

        return scramjetUrl;
      }
    } catch (e) {
      // Cross-origin or other access issues
      console.log("Cannot access embed iframe content:", e.message);
    }
    return null;
  }

  function updateSearchBar() {
    const frame = getActiveFrame();
    if (frame) {
      updateSearchBarForSpecificFrame(frame);
    }
  }

  prxBck.addEventListener("click", () => {
    const frame = getActiveFrame();
    if (frame) {
      frame.contentWindow.history.back();
      setTimeout(updateSearchBar, 300);
    }
  });

  prxFwd.addEventListener("click", () => {
    const frame = getActiveFrame();
    if (frame) {
      frame.contentWindow.history.forward();
      setTimeout(updateSearchBar, 300);
    }
  });

  prxRefresh.addEventListener("click", () => {
    const frame = getActiveFrame();
    if (frame) {
      frame.contentWindow.location.reload();
      setTimeout(updateSearchBar, 500);
    }
  });

  prxHome.addEventListener("click", () => {
    window.location.href = "/";
  });

  prxFullScreen.addEventListener("click", () => {
    const frame = getActiveFrame();
    if (frame && frame.requestFullscreen) frame.requestFullscreen();
  });

  prxInspect.addEventListener("click", () => {
    if (devTools === false) {
      eruda.init();
      eruda.show();
      devTools = true;
    } else {
      eruda.destroy();
      devTools = false;
    }
  });

  const searchInput = document.getElementById("proxy-address");
  const autocompleteBox = document.getElementById("autocomplete");

  function positionAutocomplete() {
    if (searchInput && autocompleteBox) {
      const rect = searchInput.getBoundingClientRect();
      autocompleteBox.style.left = rect.left + "px";
      autocompleteBox.style.top = rect.bottom - 2 + "px";
      autocompleteBox.style.width = rect.width + "px";
    }
  }

  function showAutocomplete() {
    if (searchInput && autocompleteBox) {
      searchInput.classList.add("autocomplete-active");
      positionAutocomplete();
      autocompleteBox.style.display = "block";
    }
  }

  function hideAutocomplete() {
    if (searchInput && autocompleteBox) {
      searchInput.classList.remove("autocomplete-active");
      autocompleteBox.style.display = "none";
    }
  }

  async function fetchSuggestions(query) {
    if (!query) {
      autocompleteBox.innerHTML = "";
      hideAutocomplete();
      return;
    }
    try {
      const res = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}`
      );
      const suggestions = await res.json();
      autocompleteBox.innerHTML = "";
      if (suggestions.length === 0) {
        hideAutocomplete();
        return;
      }
      suggestions.forEach((s) => {
        const item = document.createElement("div");
        item.textContent = s.phrase;
        item.onclick = () => {
          searchInput.value = s.phrase;
          autocompleteBox.innerHTML = "";
          hideAutocomplete();
          const frame = getActiveFrame();
          if (frame) {
            frame.src = getTabUrl(s.phrase);
            // Update search bar after navigation
            setTimeout(updateSearchBar, 500);
          }
        };
        autocompleteBox.appendChild(item);
      });
      showAutocomplete();
    } catch (err) {
      console.error("Autocomplete error:", err);
      hideAutocomplete();
    }
  }

  searchInput.addEventListener("input", (e) => {
    fetchSuggestions(e.target.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        const frame = getActiveFrame();
        if (frame) {
          frame.src = getTabUrl(query);
          // Update search bar after navigation
          setTimeout(updateSearchBar, 500);
        }
        autocompleteBox.innerHTML = "";
        hideAutocomplete();
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!autocompleteBox.contains(e.target) && e.target !== searchInput) {
      autocompleteBox.innerHTML = "";
      hideAutocomplete();
    }
  });

  window.addEventListener("resize", () => {
    resizeTabs();
    if (autocompleteBox && autocompleteBox.style.display === "block") {
      positionAutocomplete();
    }
  });

  setTimeout(() => {
    resizeTabs();
  }, 100);

  if (sessionStorage.getItem("encodedUrl")) {
    createTab("/embed.html#" + sessionStorage.getItem("encodedUrl"));
  }

  prxAddress.addEventListener("focus", () => {
    prxAddress.select();
  });
});

window.addEventListener("resize", () => {
  if (navigator.keyboard && navigator.keyboard.lock) {
    navigator.keyboard.lock(["Escape"]);
  }
});

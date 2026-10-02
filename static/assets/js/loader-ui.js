// Shared Geist-style loading screen for the Unity loaders (game-loader.js and
// unity-cdn-loader.js). Game pages point <base> at a CDN, so site assets are
// resolved against the app origin.
window.LoaderUI = (() => {
  // .js/.css/images are cached for a day: bump this, and the ?v= on every
  // reference to this file, whenever the loading screen changes.
  const VERSION = "3";
  const asset = (path) => new URL(`${path}?v=${VERSION}`, location.origin).href;
  const STATUS = {
    preparing: "Preparing download",
    downloading: "Downloading game files",
    starting: "Starting game",
  };

  function gameTitle(overlay) {
    return (
      overlay.dataset.title ||
      document.title
        .replace(/^Unity WebGL Player \| /i, "")
        .split(/ - | Unblocked/)[0]
        .trim() ||
      "Loading game"
    );
  }

  // Replaces the overlay's contents. Set data-title to override the page
  // title and data-total-mb to override the size shown to the user.
  function mount(overlay) {
    for (const name of ["role", "aria-live", "aria-atomic"])
      overlay.removeAttribute(name);
    overlay.classList.add("loader-ui");
    try {
      overlay.dataset.theme = localStorage.getItem("siteTheme") || "legacy";
    } catch {}
    overlay.innerHTML = `
      <div class="loader" hidden>
        <p class="loader-brand">
          <img class="loader-logo" alt="" width="28" height="28">
          <span>55GMS</span>
          <span class="loader-slash" aria-hidden="true">/</span>
          <span class="loader-crumb">Games</span>
        </p>
        <h1 class="loader-title"></h1>
        <div class="loader-live" role="status" aria-live="polite" aria-atomic="true">
          <span class="loader-spinner" aria-hidden="true"></span>
          <p class="loader-status">${STATUS.preparing}</p>
          <p class="loader-detail">
            A required game file could not be downloaded.<br>
            Reload the page to try again.
          </p>
        </div>
        <div class="loader-progress">
          <div class="loader-track" role="progressbar" aria-label="Download progress"
            aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="loader-fill"></div>
          </div>
          <div class="loader-meta" aria-hidden="true">
            <span class="loader-amount"></span>
            <span class="loader-percent">0%</span>
          </div>
        </div>
        <button class="loader-reload" type="button">Reload</button>
      </div>`;
    const find = (name) => overlay.querySelector(`.loader-${name}`);
    const content = overlay.firstElementChild;
    const status = find("status");
    const track = find("track");
    const fill = find("fill");
    const amount = find("amount");
    const percent = find("percent");
    const displayMb = Number(overlay.dataset.totalMb) || 0;
    find("title").textContent = gameTitle(overlay);
    find("logo").src = asset("/img/55gms.png");
    find("reload").addEventListener("click", () => location.reload());

    // Keep the content hidden until its stylesheet is in, so it never shows
    // with the page's own styles.
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = asset("/assets/css/loader-ui.css");
    link.onload = link.onerror = () => (content.hidden = false);
    document.head.appendChild(link);

    // Bytes downloaded so far, expected total, and whether every file is in.
    function set(loaded, total, done) {
      const ratio = done
        ? 1
        : Math.min(Math.max(total > 0 ? loaded / total : 0, 0), 1);
      const shownMb = displayMb || total / 1048576;
      const state = done
        ? "starting"
        : loaded > 0
          ? "downloading"
          : "preparing";
      const whole = Math.floor(ratio * 100);
      overlay.dataset.state = state;
      // Only touch the live region when the state changes, not on every chunk.
      if (status.textContent !== STATUS[state])
        status.textContent = STATUS[state];
      fill.style.width = `${ratio * 100}%`;
      track.setAttribute("aria-valuenow", whole);
      amount.textContent = `${(ratio * shownMb).toFixed(2)} MB / ${shownMb.toFixed(2)} MB`;
      percent.textContent = `${whole}%`;
    }

    function fail() {
      overlay.dataset.state = "error";
      status.textContent = "Unable to load game";
    }

    set(0, 0, false);
    return { set, fail };
  }

  return { mount };
})();

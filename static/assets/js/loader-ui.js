// Shared loading screen for the Unity loaders (game-loader.js and
// unity-cdn-loader.js). Game pages point <base> at a CDN, so site assets are
// resolved against the app origin.
window.LoaderUI = (() => {
  // .js/.css/images are cached for a day. After changing any loader asset run
  // `node scripts/bump-loader-version.js` to refresh this and every ?v= tag.
  const VERSION = "e39jq3w37n";
  const asset = (path) => new URL(`${path}?v=${VERSION}`, location.origin).href;
  const CATALOG = "/assets/json/load/g.json";
  // The deployed catalogue is encoded by scripts/build/catalogue.js: base64url
  // of a 16-byte key followed by the JSON XORed with that key. Plain JSON
  // (development, or an older deploy) is read as-is.
  async function readCatalogue(response) {
    const text = (await response.text()).trim();
    if (text[0] === "[" || text[0] === "{") return JSON.parse(text);
    const raw = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(raw.length - 16);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = raw.charCodeAt(i + 16) ^ raw.charCodeAt(i % 16);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  const MB = 1048576;
  const STATUS = {
    loading: "Loading game…",
    preparing: "Preparing download",
    downloading: "Downloading game files",
    starting: "Loading game…",
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

  const normalize = (text) =>
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  // Game pages do not know their own cover, so it is looked up in the games
  // catalog: by the page that frames this one, by folder, then by name.
  async function findCover(title) {
    const games = await readCatalogue(
      await fetch(new URL(CATALOG, location.origin)),
    );
    let framePath = "";
    let frameTitle = "";
    try {
      if (parent !== window) {
        framePath = parent.location.pathname;
        frameTitle = new URLSearchParams(parent.location.search).get("title");
      }
    } catch {}
    const folder = location.pathname.replace(/[^/]*$/, "");
    const names = [frameTitle, title].map(normalize).filter(Boolean);
    const game =
      games.find(
        (entry) =>
          entry.url &&
          (entry.url === framePath || entry.url === location.pathname),
      ) ||
      games.find(
        (entry) =>
          folder.split("/").length > 3 && entry.image?.startsWith(folder),
      ) ||
      games.find((entry) => names.includes(normalize(entry.name)));
    return game?.image ? new URL(game.image, location.origin).href : "";
  }

  const megabytes = (bytes) => `${(bytes / MB).toFixed(1)} MB`;

  function rate(bytesPerSecond) {
    return bytesPerSecond >= MB
      ? `${(bytesPerSecond / MB).toFixed(1)} MB/s`
      : `${Math.round(bytesPerSecond / 1024)} KB/s`;
  }

  function remaining(seconds) {
    if (seconds < 1.5) return "almost done";
    if (seconds < 60) return `about ${Math.ceil(seconds)}s left`;
    return `about ${Math.ceil(seconds / 60)} min left`;
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
        <div class="loader-cover" aria-hidden="true">
          <span class="loader-initial"></span>
          <img class="loader-art" alt="" decoding="async">
        </div>
        <h1 class="loader-title"></h1>
        <div class="loader-progress">
          <div class="loader-track" role="progressbar" aria-label="Download progress"
            aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="loader-fill"></div>
          </div>
          <p class="loader-meta" aria-hidden="true">
            <span class="loader-percent">0%</span>
            <span class="loader-amount"></span>
          </p>
        </div>
        <div class="loader-live">
          <p class="loader-line">
            <span class="loader-status" role="status" aria-live="polite"
              aria-atomic="true">${STATUS.preparing}</span>
            <span class="loader-speed" aria-hidden="true"></span>
          </p>
          <p class="loader-detail">
            A required game file could not be downloaded.<br>
            Reload the page to try again.
          </p>
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
    const speed = find("speed");
    const art = find("art");
    const displayMb = Number(overlay.dataset.totalMb) || 0;

    function setTitle() {
      const title = gameTitle(overlay);
      find("title").textContent = title;
      find("initial").textContent = title.trim().charAt(0).toUpperCase();
      return title;
    }

    function showCover() {
      art.onload = () => overlay.classList.add("loader-has-art");
      findCover(setTitle())
        .then((url) => url && (art.src = url))
        .catch(() => {});
    }

    setTitle();
    // Mounted from <head>, the page's <title> may not be parsed yet.
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", showCover, { once: true });
    else showCover();
    find("reload").addEventListener("click", () => location.reload());

    // Keep the content hidden until its stylesheet is in, so it never shows
    // with the page's own styles.
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = asset("/assets/css/loader-ui.css");
    link.onload = link.onerror = () => (content.hidden = false);
    document.head.appendChild(link);

    // The bar and counters glide toward the reported progress every frame
    // instead of jumping from chunk to chunk.
    let target = 0;
    let shown = 0;
    let shownMb = 0;
    let frame = 0;
    let lastFrame = 0;

    function draw() {
      const whole = Math.floor(shown * 100 + 0.01);
      fill.style.setProperty("--loader-value", shown);
      track.setAttribute("aria-valuenow", whole);
      percent.textContent = `${whole}%`;
      amount.textContent = shownMb
        ? `${(shown * shownMb).toFixed(1)} MB of ${shownMb.toFixed(1)} MB`
        : "";
    }

    function step(now) {
      // A frame timestamp can predate the performance.now() taken before it.
      const elapsed = Math.min(Math.max(now - lastFrame, 0), 100);
      lastFrame = now;
      shown += (target - shown) * (1 - Math.exp(-elapsed / 140));
      if (Math.abs(target - shown) < 0.0005) shown = target;
      draw();
      frame = shown === target ? 0 : requestAnimationFrame(step);
    }

    function glide(value) {
      target = value;
      if (frame || shown === target) return;
      lastFrame = performance.now();
      frame = requestAnimationFrame(step);
    }

    function setState(state, text = STATUS[state]) {
      overlay.dataset.state = state;
      // Only touch the live region when the text changes, not on every chunk.
      if (status.textContent !== text) status.textContent = text;
    }

    // Download speed over the last few seconds, refreshed a few times a second
    // so the readout stays legible.
    const samples = [];
    let speedShownAt = 0;

    function measure(loaded, total) {
      const now = performance.now();
      samples.push([now, loaded]);
      while (samples.length > 2 && now - samples[1][0] > 3000) samples.shift();
      const [since, before] = samples[0];
      const seconds = (now - since) / 1000;
      if (seconds < 0.4 || now - speedShownAt < 250) return;
      speedShownAt = now;
      const pace = (loaded - before) / seconds;
      if (!(pace > 0)) return (speed.textContent = "");
      // Sizes shown to the user may be overridden, so scale the speed to match.
      const scale = displayMb && total > 0 ? (displayMb * MB) / total : 1;
      const parts = [rate(pace * scale)];
      if (total > loaded && seconds > 1.2)
        parts.push(remaining((total - loaded) / pace));
      speed.textContent = parts.join(" · ");
    }

    const clamp = (value) => Math.min(Math.max(value || 0, 0), 1);

    // Bytes downloaded so far, expected total, and whether every file is in.
    function set(loaded, total, done) {
      if (!done && !(total > 0) && loaded > 0) {
        // Sizes are unknown: report what has arrived without guessing a total.
        setState("downloading");
        overlay.dataset.sized = "false";
        measure(loaded, 0);
        amount.textContent = `${megabytes(loaded)} downloaded`;
        return;
      }
      delete overlay.dataset.sized;
      shownMb = displayMb || total / MB;
      if (done) speed.textContent = "";
      else if (loaded > 0) measure(loaded, total);
      setState(done ? "starting" : loaded > 0 ? "downloading" : "preparing");
      glide(done ? 1 : clamp(total > 0 ? loaded / total : 0));
      if (!frame) draw();
    }

    // Download progress as a 0-1 fraction, for loaders that know no sizes.
    function ratio(value, done) {
      if (!done && !(value > 0)) return busy();
      delete overlay.dataset.sized;
      shownMb = 0;
      speed.textContent = "";
      setState(done ? "starting" : "downloading");
      glide(done ? 1 : clamp(value));
    }

    // Work is under way but nothing measurable has been reported.
    function busy(text = STATUS.loading) {
      setState("loading", text);
      speed.textContent = "";
      track.removeAttribute("aria-valuenow");
    }

    function fail() {
      cancelAnimationFrame(frame);
      overlay.dataset.state = "error";
      status.textContent = "Unable to load game";
    }

    set(0, 0, false);
    return { set, ratio, busy, fail };
  }

  return { mount };
})();

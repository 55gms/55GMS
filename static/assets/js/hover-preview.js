// Plays a short muted clip over a game tile while the pointer rests on it.
// Tiles opt in with data-preview (set by games.js from the catalog's "preview"
// field); the clips live in /img/videos/preview/.
//
// Nothing is fetched until a tile has been hovered for HOVER_INTENT_MS, so
// sweeping the mouse across the grid costs no requests. One <video> element is
// shared by the whole page, and leaving a tile drops its src so the download
// in flight is aborted.
(() => {
  const TILES = ".game-link[data-preview]";
  const HOVER_INTENT_MS = 200;

  const matches = (query) => window.matchMedia?.(query).matches ?? false;
  if (matches("(prefers-reduced-motion: reduce)")) return;
  // A tap must not start a video, and touch screens never hover.
  if (!matches("(hover: hover) and (pointer: fine)")) return;
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || ""))
    return;

  let video = null;
  let playing = null; // tile that currently owns the video
  let pending = null; // tile waiting out the hover-intent delay
  let timer = 0;
  const broken = new Set();

  const tileOf = (node) =>
    node instanceof Element ? node.closest(TILES) : null;

  function cancelPending() {
    clearTimeout(timer);
    timer = 0;
    pending = null;
  }

  // Leaves `pending` alone: browsers disagree on whether the old tile's
  // mouseout or the new tile's mouseover comes first.
  function stop() {
    if (!playing) return;
    playing.classList.remove("is-previewing");
    playing = null;
    video.classList.remove("is-shown");
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }

  function createVideo() {
    const element = document.createElement("video");
    element.className = "game-preview";
    element.muted = true;
    element.defaultMuted = true;
    element.loop = true;
    element.playsInline = true;
    element.preload = "none";
    element.tabIndex = -1;
    element.disablePictureInPicture = true;
    element.setAttribute("disableremoteplayback", "");
    // Decorative: the tile's label already names the game.
    element.setAttribute("aria-hidden", "true");
    element.addEventListener("playing", () => {
      if (!playing) return;
      element.classList.add("is-shown");
      playing.classList.add("is-previewing");
    });
    element.addEventListener("error", () => {
      // A missing clip falls back to the thumbnail and is not asked for again.
      if (playing) broken.add(playing.dataset.preview);
      stop();
    });
    return element;
  }

  function start(tile) {
    if (!tile?.isConnected || broken.has(tile.dataset.preview)) return;
    stop();
    video ??= createVideo();
    playing = tile;
    video.src = tile.dataset.preview;
    // After the thumbnail and before the label, so the label stays on top.
    tile.querySelector("img").after(video);
    video.play().catch(() => {});
  }

  // Delegated, so tiles rendered after this script loads are covered too.
  document.addEventListener("mouseover", (event) => {
    const tile = tileOf(event.target);
    if (!tile || tile === playing || tile === pending) return;
    cancelPending();
    stop();
    if (broken.has(tile.dataset.preview)) return;
    pending = tile;
    timer = setTimeout(() => {
      const next = pending;
      cancelPending();
      start(next);
    }, HOVER_INTENT_MS);
  });

  document.addEventListener("mouseout", (event) => {
    const tile = tileOf(event.target);
    // Moving between children of the same tile is not a leave.
    if (!tile || tile.contains(event.relatedTarget)) return;
    if (tile === pending) cancelPending();
    if (tile === playing) stop();
  });

  const stopAll = () => {
    cancelPending();
    stop();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAll();
  });
  window.addEventListener("pagehide", stopAll);
})();

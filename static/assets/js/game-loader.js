// Shared download indicator for imported Unity ports. Sizes describe CDN bytes,
// before Unity's own decompression, and include all initial split-file downloads.
window.GameLoader = (() => {
  const overlay = document.getElementById("game-loading");
  const text = document.getElementById("game-loading-text");
  // Optional progress UI. Pages that only provide #game-loading-text keep the
  // plain "LOADING..." line; data-total-mb sets the size shown to the user.
  const bar = document.getElementById("game-loading-bar");
  const amount = document.getElementById("game-loading-amount");
  const percent = document.getElementById("game-loading-percent");
  const displayMb = Number(overlay.dataset.totalMb) || 0;
  const sizes = new Map();
  const downloads = new Map();
  const objectUrls = [];
  let loaded = 0;
  let completed = 0;
  let failed = false;

  function render() {
    if (failed) return;
    const total = [...sizes.values()].reduce((sum, size) => sum + size, 0);
    if (bar) return renderProgress(total);
    const mb = (bytes) => (bytes / 1048576).toFixed(2);
    text.textContent = `LOADING... ${mb(loaded)} MB / ${mb(total)} MB`;
  }

  function renderProgress(total) {
    const done = sizes.size > 0 && completed === sizes.size;
    const ratio = done
      ? 1
      : Math.min(Math.max(total > 0 ? loaded / total : 0, 0), 1);
    const shownMb = displayMb || total / 1048576;
    const status = done
      ? "Starting game"
      : loaded > 0
        ? "Downloading game files"
        : "Preparing download";
    // Only touch the live region when the state changes, not on every chunk.
    if (text.textContent !== status) text.textContent = status;
    const whole = Math.floor(ratio * 100);
    bar.style.width = `${ratio * 100}%`;
    bar.parentElement.setAttribute("aria-valuenow", whole);
    if (amount)
      amount.textContent = `${(ratio * shownMb).toFixed(2)} MB / ${shownMb.toFixed(2)} MB`;
    if (percent) percent.textContent = `${whole}%`;
  }

  function prepare(files) {
    for (const [path, size] of files) {
      sizes.set(new URL(path, document.baseURI).href, size);
    }
    render();
  }

  function download(path) {
    const url = new URL(path, document.baseURI).href;
    if (downloads.has(url)) return downloads.get(url);
    const promise = (async () => {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to load ${path}: ${response.status}`);
      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        loaded += value.byteLength;
        render();
      }
      sizes.set(url, received);
      completed += 1;
      render();
      return new Blob(chunks);
    })();
    downloads.set(url, promise);
    return promise;
  }

  function objectUrl(blob) {
    const url = URL.createObjectURL(blob);
    objectUrls.push(url);
    return url;
  }

  async function merge(paths, type = "application/octet-stream") {
    return objectUrl(
      new Blob(await Promise.all(paths.map(download)), { type }),
    );
  }

  function script(path) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = new URL(path, document.baseURI).href;
      element.onload = resolve;
      element.onerror = () => reject(new Error(`Failed to load ${path}`));
      document.body.appendChild(element);
    });
  }

  function finish() {
    if (!failed) overlay.hidden = true;
  }

  function fail(error) {
    failed = true;
    overlay.hidden = false;
    text.style.animation = "none";
    overlay.dataset.state = "error";
    text.textContent = bar
      ? "Unable to load game"
      : "Unable to load the game. Please reload to try again.";
    console.error(error);
  }

  document
    .getElementById("game-loading-reload")
    ?.addEventListener("click", () => location.reload());
  window.addEventListener("pagehide", () => {
    for (const url of objectUrls) URL.revokeObjectURL(url);
  });
  return { prepare, download, objectUrl, merge, script, finish, fail };
})();

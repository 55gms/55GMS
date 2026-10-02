// Shared downloader and progress indicator for imported Unity ports. Sizes
// describe CDN bytes, before Unity's own decompression, and include all initial
// split-file downloads. Loaded from <head>, it creates its own overlay.
window.GameLoader = (() => {
  const overlay = document.getElementById("game-loading") ?? createOverlay();
  const ui = LoaderUI.mount(overlay);
  const sizes = new Map();
  const downloads = new Map();
  const objectUrls = [];
  let loaded = 0;
  let completed = 0;
  let expected = 0;
  let failed = false;

  function createOverlay() {
    const element = document.createElement("div");
    element.id = "game-loading";
    const title = document.currentScript?.dataset.title;
    if (title) element.dataset.title = title;
    document.documentElement.appendChild(element);
    return element;
  }

  function render() {
    if (failed) return;
    const pending = [...downloads.keys()].some((url) => !sizes.has(url));
    const total =
      expected ||
      (pending ? 0 : [...sizes.values()].reduce((sum, size) => sum + size, 0));
    const done =
      sizes.size > 0 &&
      completed === sizes.size &&
      completed === downloads.size;
    ui.set(loaded, total, done);
  }

  // Fixed total for ports that know their download size but not each file's.
  function expect(bytes) {
    expected = bytes;
    render();
  }

  // Asks the CDN for sizes when a port ships no manifest. Files that do not
  // answer are simply left out until they finish downloading.
  async function measure(paths) {
    await Promise.all(
      paths.map(async (path) => {
        const url = new URL(path, document.baseURI).href;
        try {
          const response = await fetch(url, { method: "HEAD" });
          const size = Number(response.headers.get("Content-Length"));
          if (response.ok && size > 0 && !sizes.has(url)) sizes.set(url, size);
        } catch {}
      }),
    );
    render();
  }

  // Names a step that is not a download, such as unpacking an archive.
  function status(text) {
    if (!failed) ui.busy(text);
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
    ui.fail();
    console.error(error);
  }

  window.addEventListener("pagehide", () => {
    for (const url of objectUrls) URL.revokeObjectURL(url);
  });
  return {
    prepare,
    expect,
    measure,
    status,
    download,
    objectUrl,
    merge,
    script,
    finish,
    fail,
  };
})();

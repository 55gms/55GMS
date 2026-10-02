// Shared download indicator for imported Unity ports. Sizes describe CDN bytes,
// before Unity's own decompression, and include all initial split-file downloads.
window.GameLoader = (() => {
  const overlay = document.getElementById("game-loading");
  const ui = LoaderUI.mount(overlay);
  const sizes = new Map();
  const downloads = new Map();
  const objectUrls = [];
  let loaded = 0;
  let completed = 0;
  let failed = false;

  function render() {
    if (failed) return;
    const total = [...sizes.values()].reduce((sum, size) => sum + size, 0);
    ui.set(loaded, total, sizes.size > 0 && completed === sizes.size);
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
  return { prepare, download, objectUrl, merge, script, finish, fail };
})();

// Lets a game keep requesting a file that had to be split for the CDN (jsDelivr
// refuses anything over 20 MB). The page lists each split file with its parts:
//
//   GameParts.serve({ "Build/game.data": ["Build/game.data.part1", "Build/game.data.part2"] });
//
// The parts start downloading at once. When the game later asks for the whole
// file through fetch or XMLHttpRequest, it gets the parts joined together, so
// the game's own loading code needs no changes. With GameLoader on the page the
// parts are downloaded through it and count toward its progress bar.
window.GameParts = (() => {
  const merged = new Map(); // absolute URL without query -> Promise<blob URL>
  const TYPES = { wasm: "application/wasm", js: "text/javascript", json: "application/json" };

  const key = (input) => {
    try {
      const url = new URL(input?.url ?? input, document.baseURI);
      return url.origin + url.pathname;
    } catch {
      return "";
    }
  };

  async function join(parts, type) {
    if (window.GameLoader) return GameLoader.merge(parts, type);
    const blobs = await Promise.all(
      parts.map(async (part) => {
        const response = await fetch(new URL(part, document.baseURI));
        if (!response.ok) throw new Error(`Failed to load ${part}: ${response.status}`);
        return response.blob();
      }),
    );
    return URL.createObjectURL(new Blob(blobs, { type }));
  }

  function serve(files) {
    // The page's <base> must be parsed before paths are resolved against it.
    for (const [file, parts] of Object.entries(files)) {
      const name = file.replace(/\.(br|gz|unityweb)$/i, "");
      const type = TYPES[name.split(".").pop().toLowerCase()] || "application/octet-stream";
      const promise = join(parts, type);
      promise.catch((error) => window.GameLoader?.fail(error));
      merged.set(key(file), promise);
    }
  }

  const fetch = window.fetch;
  window.fetch = function (input, options) {
    const whole = merged.get(key(input));
    if (!whole) return fetch.call(this, input, options);
    return whole.then((url) => fetch.call(this, url, { signal: options?.signal }));
  };

  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;
  const waiting = new WeakMap();
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const whole = merged.get(key(url));
    if (whole) waiting.set(this, { whole, method });
    else waiting.delete(this);
    return open.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (body) {
    const request = waiting.get(this);
    if (!request) return send.call(this, body);
    // Opening again keeps the listeners and responseType the game has set.
    request.whole.then(
      (url) => {
        open.call(this, request.method, url, true);
        send.call(this, body);
      },
      () => this.dispatchEvent(new ProgressEvent("error")),
    );
  };

  return { serve };
})();

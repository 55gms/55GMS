// Lets a game keep requesting a file that had to be split for the CDN (jsDelivr
// refuses anything over 20 MB). The page lists each split file with its parts:
//
//   GameParts.serve({ "Build/game.data": ["Build/game.data.part1", "Build/game.data.part2"] });
//
// The parts start downloading at once. When the game later asks for the whole
// file through fetch or XMLHttpRequest, it gets the parts joined together, so
// the game's own loading code needs no changes. With GameLoader on the page the
// parts are downloaded through it and count toward its progress bar.
//
// GameParts.lazy() takes the same list for files the game only asks for later
// (level bundles): their parts are downloaded when the game first requests them.
window.GameParts = (() => {
  const merged = new Map(); // absolute URL without query -> () => Promise<blob URL>
  const TYPES = {
    wasm: "application/wasm",
    js: "text/javascript",
    json: "application/json",
  };

  const key = (input) => {
    try {
      const url = new URL(input?.url ?? input, document.baseURI);
      return url.origin + url.pathname;
    } catch {
      return "";
    }
  };

  // jsDelivr's main host sometimes caches GitHub's rate-limit page ("429: Too
  // Many Requests", sent with a 200) in place of a file. Its other hosts keep
  // their own caches, so a part that fails or comes back as such a page is
  // asked for again from them. GameLoader.download does the same.
  const MIRRORS = ["fastly.jsdelivr.net", "gcore.jsdelivr.net"];
  function sources(url) {
    if (url.hostname !== "cdn.jsdelivr.net") return [url];
    return [
      url,
      ...MIRRORS.map((host) => {
        const mirror = new URL(url);
        mirror.hostname = host;
        return mirror;
      }),
    ];
  }

  async function download(part) {
    let error;
    for (const url of sources(new URL(part, document.baseURI))) {
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to load ${part}: ${response.status}`);
        const blob = await response.blob();
        // GitHub's error pages are a few bytes of text such as "404: Not Found".
        if (blob.size <= 1024 && /^\d{3}: /.test(await blob.text()))
          throw new Error(`Failed to load ${part}: the CDN sent an error page`);
        return blob;
      } catch (failure) {
        error = failure;
      }
    }
    throw error;
  }

  async function join(parts, type, lazy) {
    if (window.GameLoader && !lazy) return GameLoader.merge(parts, type);
    const blobs = await Promise.all(parts.map(download));
    return URL.createObjectURL(new Blob(blobs, { type }));
  }

  function register(files, lazy) {
    // The page's <base> must be parsed before paths are resolved against it.
    for (const [file, parts] of Object.entries(files)) {
      const name = file.replace(/\.(br|gz|unityweb)$/i, "");
      const type =
        TYPES[name.split(".").pop().toLowerCase()] ||
        "application/octet-stream";
      let promise;
      const whole = () =>
        (promise ??= join(parts, type, lazy).catch((error) => {
          // A lazy file is asked for again when the game retries.
          if (lazy) promise = undefined;
          else window.GameLoader?.fail(error);
          throw error;
        }));
      if (!lazy) whole().catch(() => {});
      merged.set(key(file), whole);
      // Some engines build the URL from the page address instead of the <base>.
      merged.set(key(new URL(file, location.href)), whole);
    }
  }
  const serve = (files) => register(files, false);
  const lazy = (files) => register(files, true);

  const fetch = window.fetch;
  window.fetch = function (input, options) {
    const whole = merged.get(key(input));
    if (!whole) return fetch.call(this, input, options);
    return whole().then((url) =>
      fetch.call(this, url, { signal: options?.signal }),
    );
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
    // A blob URL answers only GET, which also carries the headers a HEAD asks for.
    request.whole().then(
      (url) => {
        const method = /^head$/i.test(request.method) ? "GET" : request.method;
        open.call(this, method, url, true);
        send.call(this, body);
      },
      () => this.dispatchEvent(new ProgressEvent("error")),
    );
  };

  return { serve, lazy };
})();

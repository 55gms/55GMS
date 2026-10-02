// Shared downloader and progress indicator for Unity games. Sizes describe CDN
// bytes, before Unity's own decompression, and include all initial split-file
// downloads. Loaded from <head>, it creates its own overlay. Imported ports
// download through it; games with their own template call unity() instead.
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
  let starting = false;

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
      starting ||
      (sizes.size > 0 &&
        completed === sizes.size &&
        completed === downloads.size);
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

  // Counts the bytes of files the game downloads itself. Paths are matched
  // when a request is made, as the page's <base> may not be parsed yet.
  function watch(paths) {
    const key = (input) => {
      try {
        const url = new URL(input?.url ?? input, document.baseURI);
        return url.origin + url.pathname;
      } catch {
        return "";
      }
    };
    const watched = (input) => paths.some((path) => key(path) === key(input));
    const count = (bytes) => {
      loaded += bytes;
      render();
    };

    const fetch = window.fetch;
    if (fetch)
      window.fetch = async function (input, options) {
        const response = await fetch.call(this, input, options);
        const method = options?.method ?? input?.method ?? "GET";
        if (
          !watched(input) ||
          !response.ok ||
          !response.body ||
          method.toUpperCase() === "HEAD"
        )
          return response;
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          async pull(controller) {
            try {
              const { done, value } = await reader.read();
              if (done) return controller.close();
              count(value.byteLength);
              controller.enqueue(value);
            } catch (error) {
              controller.error(error);
            }
          },
          cancel: (reason) => reader.cancel(reason),
        });
        const counted = new Response(stream, response);
        Object.defineProperty(counted, "url", { value: response.url });
        return counted;
      };

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (watched(url) && String(method).toUpperCase() !== "HEAD") {
        let received = 0;
        this.addEventListener("progress", (event) => {
          count(event.loaded - received);
          received = event.loaded;
        });
      }
      return open.call(this, method, url, ...rest);
    };
  }

  // Loading screen for Unity games that boot from their own page template.
  // `files` lists the [path, bytes] the engine downloads; the game's loading
  // code is left untouched and only its requests and startup are observed.
  // Call it before the page's game scripts.
  // preloads: the page downloads files itself before it starts Unity, so the
  // screen must stay up through that wait instead of being released.
  function unity(files, { preloads = false } = {}) {
    let started = false;
    let finished = false;
    watch(files.map(([path]) => path));
    expect(files.reduce((sum, [, size]) => sum + size, 0));

    function start() {
      started = true;
      if (!finished) overlay.hidden = false;
    }

    // Unity reports 0.9 once every file is in, then 1 when the game is running.
    function progress(amount) {
      if (finished || failed) return;
      if (amount >= 0.9) {
        starting = true;
        render();
        // Files Unity had cached are never requested, so nothing was counted.
      } else if (!loaded) ui.ratio(amount / 0.9);
    }

    function ready() {
      finished = true;
      finish();
    }

    function failure(error) {
      if (!finished) fail(error);
    }

    function watchGlobal(name, wrap) {
      let value = window[name];
      // A global an earlier script declared (`var UnityLoader`) cannot be
      // redefined. It is already set, so wrap it where it stands.
      if (
        Object.getOwnPropertyDescriptor(window, name)?.configurable === false
      ) {
        try {
          window[name] = wrap(value);
        } catch {}
        return;
      }
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        get: () => value,
        set(next) {
          value = wrap(next);
        },
      });
      if (value) value = wrap(value);
    }

    // Unity 2020+: createUnityInstance(canvas, config, onProgress).
    const wrappedFactories = new WeakSet();
    function wrapFactory(create) {
      if (typeof create !== "function" || wrappedFactories.has(create))
        return create;
      const wrapped = function (canvas, config, onProgress, ...rest) {
        start();
        const report = (amount) => {
          onProgress?.(amount);
          progress(amount);
        };
        const result = create.call(this, canvas, config, report, ...rest);
        Promise.resolve(result).then(ready, failure);
        return result;
      };
      wrappedFactories.add(wrapped);
      return wrapped;
    }
    watchGlobal("createUnityInstance", wrapFactory);
    // A function declaration can replace the accessor above. Capture script
    // load before the game's onload handler calls the newly declared factory.
    document.addEventListener(
      "load",
      (event) => {
        if (event.target.tagName === "SCRIPT" && window.createUnityInstance) {
          window.createUnityInstance = wrapFactory(window.createUnityInstance);
        }
      },
      true,
    );

    // Unity 2017-2019: UnityLoader.instantiate(container, url, { onProgress }).
    watchGlobal("UnityLoader", (loader) => {
      if (!loader?.instantiate) return loader;
      const instantiate = loader.instantiate;
      loader.instantiate = function (container, config, options = {}) {
        start();
        const onProgress = options.onProgress;
        return instantiate.call(this, container, config, {
          ...options,
          onProgress(instance, amount) {
            onProgress?.(instance, amount);
            progress(amount);
            if (amount === 1) ready();
          },
        });
      };
      return loader;
    });

    // Unity 5.x exposes a global Module and reports no usable progress.
    watchGlobal("Module", (module) => {
      if (!module || typeof module !== "object") return module;
      start();
      let postRun = module.postRun || [];
      if (typeof postRun === "function") postRun = [postRun];
      Object.defineProperty(module, "postRun", {
        configurable: true,
        get: () => postRun,
        set(callbacks) {
          postRun = [
            ...(Array.isArray(callbacks) ? callbacks : [callbacks]),
            ready,
          ];
        },
      });
      module.postRun = postRun;
      return module;
    });

    // Never trap a page whose startup these hooks did not see, such as a game
    // that waits for a click. The screen comes back if Unity starts later.
    if (!preloads)
      window.addEventListener("load", () =>
        setTimeout(() => {
          if (!started) overlay.hidden = true;
        }, 1500),
      );
  }

  window.addEventListener("pagehide", () => {
    for (const url of objectUrls) URL.revokeObjectURL(url);
  });
  return {
    prepare,
    expect,
    measure,
    unity,
    status,
    download,
    objectUrl,
    merge,
    script,
    finish,
    fail,
  };
})();

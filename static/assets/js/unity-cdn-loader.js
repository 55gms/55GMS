import {
  assetKey,
  installAssetRoutes,
  prepareAssets,
} from "./unity-cdn-assets.js";

const overlay = document.getElementById("unity-cdn-loading");
const template = document.getElementById("unity-game-scripts");
const base = document.baseURI;
const originalFetch = window.fetch.bind(window);
const downloaded = new Map();
const objectURLs = [];
let total = 0;
let finished = false;
let failed = false;
let bootComplete = false;
let ui = null;

// The loading screen is a classic script shared with game-loader.js. If it
// cannot be loaded the plain text overlay below still works.
function loadUI() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = new URL(
      "/assets/js/loader-ui.js?v=5iv7ctmpoy",
      location.origin,
    ).href;
    script.onload = () => resolve(window.LoaderUI.mount(overlay));
    script.onerror = () => {
      overlay.classList.add("loader-fallback");
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

function fail(error) {
  if (finished) return;
  failed = true;
  if (ui) ui.fail();
  else {
    overlay.textContent = "Unable to load the game. Reload to retry.";
    overlay.setAttribute("role", "alert");
  }
  console.error("Unity CDN loader:", error);
}

function progress(path, bytes) {
  if (finished || failed) return;
  downloaded.set(path, bytes);
  const loaded = [...downloaded.values()].reduce((sum, size) => sum + size, 0);
  if (ui) return ui.set(loaded, total, total > 0 && loaded >= total);
  const mb = (size) => (size / 1_000_000).toFixed(1);
  overlay.textContent = `LOADING... ${mb(loaded)} MB / ${mb(total)} MB`;
}

function ready() {
  if (failed || finished) return;
  finished = true;
  overlay.hidden = true;
  if (bootComplete) startupEvents.cleanup();
}

// These games originally installed load handlers during HTML parsing. Their
// scripts now run after chunk preparation, so replay events that already fired.
function replayLateEvents() {
  const windowAdd = window.addEventListener;
  const documentAdd = document.addEventListener;
  const pendingLoad = [];
  function register(target, original, eventName, hasFired) {
    target.addEventListener = function (type, callback, options) {
      if (type !== eventName || !callback) {
        return original.call(this, type, callback, options);
      }
      let called = false;
      const invoke = (event) => {
        if (target === window && !bootComplete) return;
        if (called || options?.signal?.aborted) return;
        called = true;
        if (typeof callback === "function") callback.call(target, event);
        else callback.handleEvent(event);
      };
      original.call(this, type, invoke, options);
      if (target === window && !bootComplete)
        pendingLoad.push(() => invoke(new Event(type)));
      else if (target === window || hasFired())
        setTimeout(() => invoke(new Event(type)), 0);
    };
  }
  register(window, windowAdd, "load", () => document.readyState === "complete");
  register(
    document,
    documentAdd,
    "DOMContentLoaded",
    () => document.readyState !== "loading",
  );
  let onload = window.onload;
  let invoked = null;
  const invokeOnload = () => {
    if (!bootComplete) return;
    if (onload && invoked !== onload) {
      invoked = onload;
      onload.call(window, new Event("load"));
    }
  };
  Object.defineProperty(window, "onload", {
    configurable: true,
    get: () => onload,
    set(callback) {
      onload = callback;
      if (bootComplete) setTimeout(invokeOnload, 0);
    },
  });
  windowAdd.call(window, "load", invokeOnload);
  return {
    flush() {
      bootComplete = true;
      pendingLoad.forEach((invoke) => invoke());
      invokeOnload();
      if (finished) this.cleanup();
    },
    cleanup() {
      window.addEventListener = windowAdd;
      document.addEventListener = documentAdd;
      delete window.onload;
      window.onload = invoked === onload ? null : onload;
      window.removeEventListener("load", invokeOnload);
    },
  };
}

const startupEvents = replayLateEvents();

// A CDN base also changes root-relative URLs. Keep site-wide resources on the
// app origin while game-relative resources continue to resolve against the CDN.
for (const element of document.querySelectorAll("link[href], img[src]")) {
  const attribute = element.tagName === "LINK" ? "href" : "src";
  const value = element.getAttribute(attribute);
  if (value.startsWith("/") && !value.startsWith("//")) {
    element.setAttribute(attribute, new URL(value, location.origin).href);
  }
}

function watchGlobal(name, wrap) {
  let value = window[name];
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

const wrappedFactories = new WeakSet();
function wrapFactory(create) {
  if (typeof create !== "function") return create;
  if (wrappedFactories.has(create)) return create;
  const wrapped = function (...args) {
    const result = create.apply(this, args);
    result.then(ready, fail);
    return result;
  };
  wrappedFactories.add(wrapped);
  return wrapped;
}
watchGlobal("createUnityInstance", wrapFactory);
// A function declaration can replace the accessor above. Capture script load
// before the game's onload handler calls the newly declared Unity factory.
document.addEventListener(
  "load",
  (event) => {
    if (event.target.tagName === "SCRIPT" && window.createUnityInstance) {
      window.createUnityInstance = wrapFactory(window.createUnityInstance);
    }
  },
  true,
);

watchGlobal("UnityLoader", (loader) => {
  if (!loader?.instantiate) return loader;
  const instantiate = loader.instantiate;
  loader.instantiate = function (container, config, options = {}) {
    const onProgress = options.onProgress;
    return instantiate.call(this, container, config, {
      ...options,
      onProgress(instance, amount) {
        onProgress?.(instance, amount);
        if (amount === 1) ready();
      },
    });
  };
  return loader;
});

// Superhot's older Unity build exposes Module rather than instantiate().
watchGlobal("Module", (module) => {
  if (!module || typeof module !== "object") return module;
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

async function runGameScripts() {
  const scripts = [...template.content.querySelectorAll("script")];
  template.remove();
  for (const original of scripts) {
    const script = document.createElement("script");
    for (const attribute of original.attributes) {
      script.setAttribute(attribute.name, attribute.value);
    }
    const source = original.getAttribute("src");
    if (source?.startsWith("/") && !source.startsWith("//")) {
      script.src = new URL(source, location.origin).href;
    }
    script.textContent = original.textContent;
    if (!original.hasAttribute("src")) {
      document.body.appendChild(script);
    } else if (original.hasAttribute("async")) {
      document.body.appendChild(script);
    } else {
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error(`Failed to load ${original.getAttribute("src")}`));
        document.body.appendChild(script);
      });
    }
  }
}

try {
  ui = await loadUI();
  const response = await originalFetch(new URL("unity-assets.json", base));
  if (!response.ok) throw new Error(`Asset manifest: HTTP ${response.status}`);
  const manifest = await response.json();
  total = manifest.files.reduce((sum, file) => sum + file.size, 0);
  progress("", 0);
  const { routes, blobs } = await prepareAssets(
    manifest,
    base,
    progress,
    originalFetch,
  );
  objectURLs.push(...blobs);
  // Also redirect root-relative asset URLs produced by older game loaders.
  for (const file of manifest.files) {
    routes.set(
      assetKey(new URL(file.path, location.href), base),
      routes.get(assetKey(file.path, base)),
    );
  }
  installAssetRoutes(routes, base);
  const routedFetch = window.fetch;
  const files = new Map(
    manifest.files.map((file) => [assetKey(file.path, base), file]),
  );
  window.fetch = async function (input, options) {
    const result = await routedFetch.call(this, input, options);
    const file = files.get(assetKey(input, base));
    if (file && !result.ok)
      fail(new Error(`${file.path}: HTTP ${result.status}`));
    if (
      !file ||
      file.parts ||
      !result.ok ||
      !result.body ||
      options?.method === "HEAD"
    )
      return result;
    const reader = result.body.getReader();
    let received = 0;
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) controller.close();
          else {
            received += value.byteLength;
            progress(file.path, received);
            controller.enqueue(value);
          }
        } catch (error) {
          controller.error(error);
          fail(error);
        }
      },
      cancel(reason) {
        return reader.cancel(reason);
      },
    });
    const streamed = new Response(stream, result);
    Object.defineProperty(streamed, "url", { value: result.url });
    return streamed;
  };
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const file = files.get(assetKey(url, base));
    if (file && !file.parts) {
      this.addEventListener("progress", (event) =>
        progress(file.path, event.loaded),
      );
      this.addEventListener(
        "error",
        () => fail(new Error(`Failed to load ${file.path}`)),
        { once: true },
      );
      this.addEventListener(
        "load",
        () => {
          if (this.status >= 400)
            fail(new Error(`${file.path}: HTTP ${this.status}`));
        },
        { once: true },
      );
    }
    return open.call(this, method, url, ...rest);
  };
  await runGameScripts();
  startupEvents.flush();
} catch (error) {
  fail(error);
}

window.addEventListener("pagehide", (event) => {
  if (!event.persisted) objectURLs.forEach((url) => URL.revokeObjectURL(url));
});

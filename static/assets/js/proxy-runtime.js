"use strict";

window.proxyRuntime = (() => {
  const CORE_VERSION = "2.0.67-alpha.2";
  const CONTROLLER_VERSION = "0.0.14";
  const WORKER_URL = `/sw.js?v=${CORE_VERSION}-${CONTROLLER_VERSION}`;

  async function withTimeout(promise, message, ms = 15000) {
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((resolve, reject) => {
          timer = setTimeout(() => reject(new Error(message)), ms);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  async function registerWorker() {
    if (!navigator.serviceWorker) {
      throw new Error("The proxy needs service worker support and HTTPS.");
    }
    const registration = await withTimeout(
      navigator.serviceWorker.register(WORKER_URL, {
        scope: "/",
        updateViaCache: "none",
      }),
      "The proxy service worker could not be registered.",
    );
    // Prefer the new worker during an upgrade, rather than sending new RPC
    // messages to the previous generation's still-active worker.
    const worker =
      registration.installing || registration.waiting || registration.active;
    if (!worker) throw new Error("No proxy service worker is available.");
    if (worker.state === "activated") return worker;
    let changed;
    try {
      await withTimeout(
        new Promise((resolve, reject) => {
          changed = () => {
            if (worker.state === "activated" || worker.state === "redundant") {
              if (worker.state === "activated") resolve();
              else
                reject(new Error("Proxy service worker installation failed."));
            }
          };
          worker.addEventListener("statechange", changed);
          changed();
        }),
        "The proxy service worker did not activate.",
      );
    } finally {
      worker.removeEventListener("statechange", changed);
    }
    return worker;
  }

  const CACHE_METHODS = new Set(["GET", "HEAD"]);
  const STATIC_DESTINATIONS = new Set(["script", "style", "font", "image"]);
  const STATIC_EXTENSION =
    /\.(?:m?js|css|wasm|woff2?|ttf|otf|png|jpe?g|webp|gif|svg|ico|avif)$/i;

  function canCacheAsset(request, parsed, response) {
    if (!CACHE_METHODS.has(request.method)) return false;
    if (request.initialHeaders.get("range")) return false;
    if (
      !STATIC_DESTINATIONS.has(request.destination) &&
      !STATIC_EXTENSION.test(parsed.url.pathname)
    )
      return false;
    if (response) {
      const headers = new Headers(response.rawHeaders);
      const type = headers.get("content-type") || "";
      // The upstream cache plugin buffers bodies; keep streams, HLS/DASH,
      // API responses and large downloads out of that path.
      if (
        !/^(?:text\/(?:javascript|css)|application\/(?:javascript|x-javascript|wasm)|image\/|font\/)/i.test(
          type,
        )
      )
        return false;
      if (Number(headers.get("content-length")) > 8 * 1024 * 1024) return false;
    }
    return true;
  }

  class AssetCachePlugin extends $scramjetUtils.HttpCachePlugin {
    tap(hook, callback, order) {
      return super.tap(
        hook,
        (context, props) => {
          if (!canCacheAsset(context.request, context.parsed, props.response))
            return;
          return callback(context, props);
        },
        order,
      );
    }
  }

  function stripLinkIntegrity(header) {
    // Skip URLs and other quoted parameters while removing preload hashes.
    return header.replace(
      /<[^>]*>|"(?:\\.|[^"\\])*"|;\s*integrity(?:\s*=\s*(?:"(?:\\.|[^"\\])*"|[^;,\s]+))?(?=\s*(?:;|,|$))/gi,
      (part) => (part.startsWith(";") ? "" : part),
    );
  }

  class ResourceIntegrityPlugin extends $scramjetController.ManagedPlugin {
    constructor() {
      super("proxy-resource-integrity", []);
    }

    install(frame) {
      super.install(frame);
      this.tap(frame.hooks.fetch.response, (context, { response }) => {
        const link = response.headers.get("link");
        // CSS and scripts change during rewriting, so upstream preload hashes
        // no longer match. Scramjet already clears integrity on HTML elements.
        if (link) response.headers.set("link", stripLinkIntegrity(link));
      });
    }
  }

  async function createController(wispUrl) {
    const transport = new EpoxyTransport.default({
      wisp: wispUrl,
      wisp_v2: true,
    });
    const [serviceworker] = await Promise.all([
      registerWorker(),
      withTimeout(transport.init(), "The proxy transport did not start."),
    ]);
    const controller = new $scramjetController.Controller({
      serviceworker,
      transport,
      config: {
        prefix: "/~/sj/",
        scramjetPath: `/scram/scramjet.js?v=${CORE_VERSION}`,
        wasmPath: `/scram/scramjet.wasm?v=${CORE_VERSION}`,
        injectPath: `/controller/controller.inject.js?v=${CONTROLLER_VERSION}`,
      },
    });
    await withTimeout(
      controller.wait(),
      "The proxy controller did not initialize.",
    );
    return controller;
  }

  return {
    createController,
    AssetCachePlugin,
    ResourceIntegrityPlugin,
    canCacheAsset,
    WORKER_URL,
  };
})();

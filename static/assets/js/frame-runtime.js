"use strict";

window.frameRuntime = (() => {
  const CORE_VERSION = "2.0.67-alpha.2-2";
  const CONTROLLER_VERSION = "0.0.14-1";
  const WORKER_URL = `/sw.js?v=${CORE_VERSION}-${CONTROLLER_VERSION}-2`;
  const PREFIX = "/stream/";
  const LEGACY_SCOPES = ["/", "/~/sj/"];
  const VIRTUAL_DATA = "vendor-data.js";

  // The vendor bundles publish themselves as globals. Look them up by
  // assembled name so this file never spells out which libraries they are.
  const ns = ["$scr", "amj", "et"].join("");
  const core = window[ns];
  const frames = window[ns + "Controller"];
  const helpers = window[ns + "Utils"];
  const Transport = window[["Epo", "xyTran", "sport"].join("")].default;
  const tunnel = ["wi", "sp"].join("");
  const intercept = ["Pro", "xy"].join("");

  // Frame URLs carry the destination as an opaque token rather than a
  // readable address. Both functions are serialized into every frame, so
  // they must stay self-contained: no references outside their own body.
  const codec = {
    encode: (input) => {
      if (!input) return input;
      const bytes = new TextEncoder().encode(input);
      let out = "";
      for (let i = 0; i < bytes.length; i++)
        out += String.fromCharCode(bytes[i] ^ (37 + (i % 7)));
      return btoa(out)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    },
    decode: (input) => {
      if (!input) return input;
      try {
        const raw = atob(input.replace(/-/g, "+").replace(/_/g, "/"));
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++)
          bytes[i] = raw.charCodeAt(i) ^ (37 + (i % 7));
        return new TextDecoder().decode(bytes);
      } catch {
        return input;
      }
    },
  };

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

  // Earlier stacks registered their worker at "/" and then "/~/sj/". A
  // replacement in the same scope cannot activate until the old worker goes
  // idle, which stalled startup on returning browsers, so old registrations
  // are retired without being waited on.
  function retireLegacyWorkers() {
    for (const scope of LEGACY_SCOPES) {
      (async () => {
        const old = await navigator.serviceWorker.getRegistration(scope);
        if (old && new URL(old.scope).pathname === scope)
          await old.unregister();
      })().catch((err) =>
        console.warn("Could not retire an old service worker:", err),
      );
    }
  }

  async function registerWorker() {
    if (!navigator.serviceWorker) {
      throw new Error("This page needs service worker support and HTTPS.");
    }
    retireLegacyWorkers();
    // Scoped to the frame prefix: only embedded frames are its clients.
    const registration = await withTimeout(
      navigator.serviceWorker.register(WORKER_URL, {
        scope: PREFIX,
        updateViaCache: "none",
      }),
      "The service worker could not be registered.",
    );
    // Prefer the new worker during an upgrade, rather than sending new RPC
    // messages to the previous generation's still-active worker.
    const worker =
      registration.installing || registration.waiting || registration.active;
    if (!worker) throw new Error("No service worker is available.");
    if (worker.state === "activated") return worker;
    let changed;
    try {
      await withTimeout(
        new Promise((resolve, reject) => {
          changed = () => {
            if (worker.state === "activated" || worker.state === "redundant") {
              if (worker.state === "activated") resolve();
              else reject(new Error("Service worker installation failed."));
            }
          };
          worker.addEventListener("statechange", changed);
          changed();
        }),
        "The service worker did not activate.",
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

  class AssetCachePlugin extends helpers.HttpCachePlugin {
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

  class ResourceIntegrityPlugin extends frames.ManagedPlugin {
    constructor() {
      super("resource-integrity", []);
    }

    install(frame) {
      super.install(frame);
      this.tap(frame.hooks.fetch.response, (context, { response }) => {
        const link = response.headers.get("link");
        // CSS and scripts change during rewriting, so upstream preload hashes
        // no longer match. The core already clears integrity on HTML elements.
        if (link) response.headers.set("link", stripLinkIntegrity(link));
      });
    }
  }

  class NewTabPlugin extends frames.ManagedPlugin {
    constructor(notify) {
      super("new-tabs", []);
      this.notify = notify;
      this.popups = new Map();
      this.namedPopups = new Map();
      this.popupNamespace = crypto.randomUUID();
      this.nextPopupId = 0;
    }

    popupClosed(id) {
      const popup = this.popups.get(id);
      if (popup) popup.closed = true;
      this.popups.delete(id);
      for (const [name, handle] of this.namedPopups) {
        if (handle === popup) this.namedPopups.delete(name);
      }
    }

    install(frame) {
      super.install(frame);
      this.tap(frame.hooks.init.post, ({ window: win, client }) => {
        const resolve = (value, base = win.document.baseURI) => {
          try {
            let url = new URL(String(value), base);
            if (url.href.startsWith(client.context.prefix.href))
              url = new URL(client.unrewriteUrl(url.href));
            return /^https?:$/.test(url.protocol) ? url.href : null;
          } catch {
            return null;
          }
        };

        // Install in every framed document, including nested page iframes.
        client[intercept]("window.open", {
          apply: (ctx) => {
            const target = String(ctx.args[1] ?? "_blank");
            if (
              ["_self", "_parent", "_top", "_unfencedTop"].includes(
                target.toLowerCase(),
              ) ||
              (target &&
                target.toLowerCase() !== "_blank" &&
                win.frames[target])
            )
              return;

            const raw = ctx.args[0] === undefined ? "" : String(ctx.args[0]);
            const blank = raw === "" || raw === "about:blank";
            const url = blank ? "" : resolve(raw);
            if (url === null) return ctx.return(null);

            const named = target && target.toLowerCase() !== "_blank";
            const features = String(ctx.args[2] ?? "");
            const noOpener =
              /(?:^|,)\s*(?:noopener|noreferrer)(?:\s*=\s*(?:1|yes|true))?\s*(?:,|$)/i.test(
                features,
              );
            let popup = named ? this.namedPopups.get(target) : null;
            if (popup && !popup.closed) {
              if (!blank) popup.location.href = url;
              popup.focus();
              return ctx.return(noOpener ? null : popup);
            }

            const popupId = `${this.popupNamespace}:${++this.nextPopupId}`;
            let href = url || "about:blank";
            const openerBase = win.document.baseURI;
            const go = (value) => {
              if (popup.closed) return;
              const next = resolve(
                value,
                href === "about:blank" ? openerBase : href,
              );
              if (!next) return;
              href = next;
              this.notify("popupnavigate", { popupId, url: next });
            };
            const popupLocation = {
              get href() {
                return href;
              },
              set href(value) {
                go(value);
              },
              assign: go,
              replace: go,
              toString: () => href,
            };
            // Support the common open-blank-then-set-location pattern without
            // spawning a native popup. This is a tab handle, not a full Window.
            popup = {
              closed: false,
              get location() {
                return popupLocation;
              },
              set location(value) {
                go(value);
              },
              focus: () => {
                if (!popup.closed) this.notify("popupfocus", { popupId });
              },
              close: () => {
                if (popup.closed) return;
                this.popupClosed(popupId);
                this.notify("popupclose", { popupId });
              },
            };
            this.popups.set(popupId, popup);
            if (named) this.namedPopups.set(target, popup);
            this.notify("newtab", { popupId, url });
            ctx.return(noOpener ? null : popup);
          },
        });

        const openLink = (event) => {
          if (event.defaultPrevented) return;
          const middle = event.type === "auxclick" && event.button === 1;
          if (!middle && (event.type !== "click" || event.button !== 0)) return;
          const anchor = event
            .composedPath()
            .find((node) => node?.matches?.("a[href], area[href]"));
          if (!anchor || anchor.hasAttribute("download")) return;
          const target =
            anchor.getAttribute("target") ??
            win.document.querySelector("base[target]")?.getAttribute("target");
          if (
            !middle &&
            !event.ctrlKey &&
            !event.metaKey &&
            target?.toLowerCase() !== "_blank"
          )
            return;
          const url = resolve(anchor.href);
          if (!url) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          this.notify("newtab", {
            url,
            activate: !(
              (middle || event.ctrlKey || event.metaKey) &&
              !event.shiftKey
            ),
          });
        };
        // Native capture listeners also cover links inserted after page load.
        for (const type of ["click", "auxclick"])
          client.natives.call(
            "EventTarget.prototype.addEventListener",
            win.document,
            type,
            openLink,
            true,
          );
      });
    }
  }

  async function createController(endpoint) {
    const transport = new Transport({
      [tunnel]: endpoint,
      [tunnel + "_v2"]: true,
    });
    const [serviceworker] = await Promise.all([
      registerWorker(),
      withTimeout(transport.init(), "The connection did not start."),
    ]);
    const controller = new frames.Controller({
      serviceworker,
      transport,
      config: {
        prefix: PREFIX,
        // Computed keys: the option names are the library's, not ours.
        [ns.slice(1) + "Path"]: `/assets/lib/vendor-core.js?v=${CORE_VERSION}`,
        wasmPath: `/assets/lib/vendor-core.wasm?v=${CORE_VERSION}`,
        injectPath: `/assets/lib/vendor-page.js?v=${CONTROLLER_VERSION}`,
        virtualWasmPath: VIRTUAL_DATA,
        codec,
      },
      [ns.slice(1) + "Config"]: {
        // Keep the injected bundles out of page-visible stacks and timings.
        maskedfiles: ["vendor-page.js", VIRTUAL_DATA],
      },
    });
    await withTimeout(
      controller.wait(),
      "The frame controller did not initialize.",
    );
    return controller;
  }

  return {
    createController,
    AssetCachePlugin,
    ResourceIntegrityPlugin,
    NewTabPlugin,
    UrlWatcherPlugin: helpers.UrlWatcherPlugin,
    core,
    codec,
    canCacheAsset,
    WORKER_URL,
  };
})();

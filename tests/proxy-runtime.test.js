import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import vm from "node:vm";
import test from "node:test";
import express from "express";
import { mountProxyAssets, proxyAssetFiles } from "../utils/proxyAssets.js";

const require = createRequire(import.meta.url);
const runtimeSource = await readFile(
  new URL("../static/assets/js/frame-runtime.js", import.meta.url),
  "utf8",
);
const tick = () => new Promise((resolve) => setImmediate(resolve));
function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function runtime(registration, rootRegistration) {
  const calls = [];
  const transport = deferred();
  const handshake = deferred();
  const timers = new Map();
  let nextTimer = 0;
  let controllerOptions;
  const context = vm.createContext({
    Headers,
    URL,
    console,
    setTimeout(callback) {
      const id = ++nextTimer;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    navigator: {
      serviceWorker: {
        register(url, options) {
          calls.push({ url, options });
          return registration;
        },
        getRegistration(url) {
          calls.push({ lookup: url });
          return rootRegistration;
        },
      },
    },
    EpoxyTransport: {
      default: class {
        constructor(options) {
          calls.push({ transport: options });
        }
        init() {
          calls.push("init");
          return transport.promise;
        }
      },
    },
    $scramjetController: {
      ManagedPlugin: class {},
      Controller: class {
        constructor(options) {
          controllerOptions = options;
        }
        wait() {
          return handshake.promise;
        }
      },
    },
    $scramjetUtils: { HttpCachePlugin: class {} },
  });
  context.window = context;
  vm.runInContext(runtimeSource, context);
  return {
    context,
    calls,
    transport,
    handshake,
    timers,
    get controllerOptions() {
      return controllerOptions;
    },
  };
}

function worker(state = "activated") {
  const callbacks = new Set();
  return {
    state,
    addEventListener(type, callback) {
      callbacks.add(callback);
    },
    removeEventListener(type, callback) {
      callbacks.delete(callback);
    },
    change(next) {
      this.state = next;
      for (const callback of [...callbacks]) callback();
    },
    get listeners() {
      return callbacks.size;
    },
  };
}

test("worker registration and Epoxy init overlap; frame waits for controller handshake", async () => {
  const active = worker();
  const page = runtime(Promise.resolve({ active }));
  let completed = false;
  const ready = page.context.frameRuntime
    .createController("wss://55gms.test/wisp/")
    .then(() => {
      completed = true;
    });
  assert.equal(page.calls.includes("init"), true);
  const registration = page.calls.find((call) => call.url);
  assert.equal(registration.options.scope, "/stream/");
  assert.equal(registration.options.updateViaCache, "none");
  assert.match(registration.url, /v=2\.0\.67-alpha\.2-0\.0\.14/);
  await tick();
  assert.equal(page.controllerOptions, undefined);
  page.transport.resolve();
  await tick();
  assert.equal(page.controllerOptions.serviceworker, active);
  assert.equal(completed, false);
  assert.equal(
    page.controllerOptions.transport instanceof
      page.context.EpoxyTransport.default,
    true,
  );
  page.handshake.resolve();
  await ready;
  assert.equal(page.timers.size, 0);
});

test("upgrade uses the new worker, not an active worker from the legacy stack", async () => {
  const oldWorker = worker();
  const installing = worker("installing");
  const page = runtime(Promise.resolve({ active: oldWorker, installing }));
  const ready = page.context.frameRuntime.createController(
    "wss://55gms.test/wisp/",
  );
  page.transport.resolve();
  await tick();
  assert.equal(page.controllerOptions, undefined);
  assert.equal(installing.listeners, 1);
  installing.change("activated");
  await tick();
  assert.equal(page.controllerOptions.serviceworker, installing);
  assert.equal(installing.listeners, 0);
  page.handshake.resolve();
  await ready;
});

test("startup never waits on a root-scope worker left by an earlier stack", async () => {
  // Returning browsers still have the legacy worker at "/". The proxy worker
  // lives in its own scope, so it activates without that worker going idle.
  const unregistered = deferred();
  let unregisterCalls = 0;
  const legacy = {
    scope: "https://55gms.test/",
    active: worker(),
    unregister() {
      unregisterCalls++;
      return unregistered.promise; // never settles during startup
    },
  };
  const active = worker();
  const page = runtime(
    Promise.resolve({ scope: "https://55gms.test/stream/", active }),
    Promise.resolve(legacy),
  );
  const ready = page.context.frameRuntime.createController(
    "wss://55gms.test/wisp/",
  );
  page.transport.resolve();
  await tick();
  assert.equal(page.controllerOptions.serviceworker, active);
  assert.deepEqual(
    page.calls.filter((call) => call.lookup),
    [{ lookup: "/" }, { lookup: "/~/sj/" }],
  );
  assert.equal(unregisterCalls, 1);
  page.handshake.resolve();
  await ready;
});

test("retiring the root worker skips other scopes and tolerates failures", async () => {
  let unregisterCalls = 0;
  const scoped = {
    scope: "https://55gms.test/stream/",
    unregister() {
      unregisterCalls++;
    },
  };
  for (const root of [
    () => Promise.resolve(scoped),
    () => Promise.resolve(undefined),
    () => Promise.reject(new Error("blocked")),
    () =>
      Promise.resolve({
        scope: "https://55gms.test/",
        unregister: () => Promise.reject(new Error("blocked")),
      }),
  ]) {
    const page = runtime(Promise.resolve({ active: worker() }), root());
    const ready = page.context.frameRuntime.createController(
      "wss://55gms.test/wisp/",
    );
    page.transport.resolve();
    await tick();
    page.handshake.resolve();
    await ready;
  }
  assert.equal(unregisterCalls, 0);
});

test("failed worker installation rejects startup and removes its listener", async () => {
  const installing = worker("installing");
  const page = runtime(Promise.resolve({ installing }));
  const ready = page.context.frameRuntime.createController(
    "wss://55gms.test/wisp/",
  );
  page.transport.resolve();
  await tick();
  installing.change("redundant");
  await assert.rejects(ready, /installation failed/);
  assert.equal(installing.listeners, 0);
  assert.equal(page.controllerOptions, undefined);
  assert.equal(page.timers.size, 0);
});

test("worker activation timeout releases listeners instead of hanging startup", async () => {
  const installing = worker("installing");
  const page = runtime(Promise.resolve({ installing }));
  const ready = page.context.frameRuntime.createController(
    "wss://55gms.test/wisp/",
  );
  page.transport.resolve();
  await tick();
  for (const callback of [...page.timers.values()]) callback();
  await assert.rejects(ready, /did not activate/);
  assert.equal(installing.listeners, 0);
  assert.equal(page.timers.size, 0);
});

async function realBundles() {
  const context = vm.createContext({
    URL,
    URLSearchParams,
    Headers,
    Request,
    Response,
    TextEncoder,
    TextDecoder,
    performance,
    setTimeout,
    clearTimeout,
    EventTarget,
    Event,
    ReadableStream,
    WritableStream,
    TransformStream,
    Uint8Array,
    ArrayBuffer,
    DataView,
    Blob,
    WebSocket,
    fetch,
    crypto,
    btoa,
    atob,
    console,
    navigator: { userAgent: "55GMS proxy runtime test" },
  });
  context.self = context;
  for (const name of ["core", "frame", "util", "net"]) {
    const file = proxyAssetFiles[`/assets/lib/vendor-${name}.js`];
    vm.runInContext(await readFile(file, "utf8"), context, { filename: file });
  }
  context.window = context;
  vm.runInContext(runtimeSource, context);
  return context;
}

test("frame URLs use neutral asset paths and an opaque, reversible target token", async () => {
  const context = await realBundles();
  const { codec } = context.frameRuntime;
  for (const url of [
    "https://vidsrc.party/embed/tv/1399/1/2?a=b&c=d#frag",
    "https://example.com/päth/✓",
    "x",
  ]) {
    const token = codec.encode(url);
    assert.match(token, /^[\w-]+$/);
    assert.doesNotMatch(token, /^aHR0c/);
    assert.equal(codec.decode(token), url);
  }
  assert.equal(codec.encode(""), "");
  assert.equal(codec.decode("%%%"), "%%%");
  // The controller serializes both functions into each frame.
  for (const fn of [codec.encode, codec.decode]) {
    const copy = vm.runInNewContext(`(${fn.toString()})`, {
      TextEncoder,
      TextDecoder,
      Uint8Array,
      btoa,
      atob,
    });
    assert.equal(
      copy(fn("https://example.com/")),
      fn(fn("https://example.com/")),
    );
  }

  const page = runtime(Promise.resolve({ active: worker() }));
  const ready = page.context.frameRuntime.createController(
    "wss://55gms.test/api/live/",
  );
  page.transport.resolve();
  await tick();
  page.handshake.resolve();
  await ready;
  const { config, scramjetConfig } = page.controllerOptions;
  assert.equal(config.prefix, "/stream/");
  assert.equal(typeof config.codec.encode, "function");
  const paths = [
    config.scramjetPath,
    config.wasmPath,
    config.injectPath,
    config.virtualWasmPath,
  ];
  assert.equal(paths.every(Boolean), true);
  for (const path of [...paths, ...scramjetConfig.maskedfiles])
    assert.doesNotMatch(path, /scram|controller|epoxy|inject|sj/i);
  assert.deepEqual(
    JSON.parse(JSON.stringify(page.calls.find((call) => call.transport))),
    { transport: { wisp: "wss://55gms.test/api/live/", wisp_v2: true } },
  );

  // The real core builds frame URLs through the codec: no readable target.
  const rewritten = context.frameRuntime.core.rewriteUrl(
    "https://vidsrc.party/embed/movie/550",
    {
      config: context.frameRuntime.core.defaultConfig,
      prefix: new URL("https://55gms.test/stream/tab/frame/"),
      interface: { codecEncode: codec.encode, codecDecode: codec.decode },
    },
    {
      origin: new URL("https://vidsrc.party/"),
      base: new URL("https://vidsrc.party/"),
    },
  );
  // The core still appends its own query metadata (initiator origin) after
  // the path; only the path is under the codec's control.
  const { pathname } = new URL(rewritten);
  assert.match(pathname, /^\/stream\/tab\/frame\/[\w-]+$/);
  assert.doesNotMatch(pathname, /vidsrc|https%3A|aHR0c/i);
});

async function newTabPage() {
  const context = await realBundles();
  const events = [];
  const handlers = {};
  const hooks = context.$scramjet.Tap.create();
  const plugin = new context.frameRuntime.NewTabPlugin((type, detail) => {
    events.push({ type, ...detail });
  });
  plugin.install({ hooks: { init: hooks } });
  const win = {
    frames: { existingFrame: {} },
    document: {
      baseURI: "https://example.com/base/",
      querySelector: () => null,
    },
  };
  let openHandler;
  const prefix = "https://55gms.test/~/sj/test/frame/";
  const client = {
    context: { prefix: new URL(prefix) },
    unrewriteUrl: (url) => decodeURIComponent(url.slice(prefix.length)),
    Proxy(name, handler) {
      assert.equal(name, "window.open");
      openHandler = handler;
    },
    natives: {
      call(name, target, type, handler, capture) {
        assert.equal(name, "EventTarget.prototype.addEventListener");
        assert.equal(target, win.document);
        assert.equal(capture, true);
        handlers[type] = handler;
      },
    },
  };
  // Exercise the real pinned controller's hook dispatch for a nested document.
  context.$scramjet.Tap.dispatch(
    hooks.post,
    {
      window: win,
      client,
      isTopLevel: false,
    },
    {},
  );
  return {
    plugin,
    events,
    win,
    prefix,
    open(...args) {
      let result = "native";
      openHandler.apply({
        args,
        return: (value) => {
          result = value;
        },
      });
      return result;
    },
    click({
      type = "click",
      target = "",
      href = "https://example.com/next",
      download = false,
      ...options
    } = {}) {
      const anchor = {
        href,
        matches: () => true,
        hasAttribute: () => download,
        getAttribute: () => target,
      };
      const event = {
        type,
        button: type === "auxclick" ? 1 : 0,
        defaultPrevented: false,
        composedPath: () => [{}, anchor],
        preventDefault() {
          this.defaultPrevented = true;
        },
        stopImmediatePropagation() {},
        ...options,
      };
      handlers[type](event);
      return event;
    },
  };
}

test("window.open creates internal tabs with decoded URLs and preserves existing frame targets", async () => {
  const page = await newTabPage();
  const popup = page.open("../next", "_blank");
  assert.equal(popup.location.href, "https://example.com/next");
  assert.equal(page.events[0].type, "newtab");
  assert.equal(page.events[0].url, "https://example.com/next");
  page.open(page.prefix + encodeURIComponent("https://other.example/path"));
  assert.equal(page.events[1].url, "https://other.example/path");
  for (const target of ["_self", "_parent", "_top", "existingFrame"])
    assert.equal(page.open("/same", target), "native");
  assert.equal(page.open("javascript:alert(1)"), null);
  assert.equal(page.events.length, 2);
});

test("blank popups redirect the same internal tab and named popups are reused", async () => {
  const page = await newTabPage();
  const popup = page.open("", "login");
  const id = page.events[0].popupId;
  assert.equal(page.events[0].url, "");
  popup.location = "/login";
  popup.location.replace("step2");
  popup.location.href = "https://example.com/done";
  assert.equal(
    page.events.filter((event) => event.type === "newtab").length,
    1,
  );
  assert.deepEqual(
    page.events.slice(1).map((event) => [event.popupId, event.url]),
    [
      [id, "https://example.com/login"],
      [id, "https://example.com/step2"],
      [id, "https://example.com/done"],
    ],
  );
  assert.equal(page.open("/again", "login"), popup);
  assert.equal(page.events.at(-1).type, "popupfocus");
  popup.close();
  assert.equal(popup.closed, true);
  assert.equal(page.events.at(-1).type, "popupclose");
  const reopened = page.open("/new", "login");
  assert.notEqual(reopened, popup);
  page.plugin.popupClosed(page.events.at(-1).popupId);
  assert.equal(reopened.closed, true);
  assert.equal(page.open("/private", "_blank", "noopener"), null);
  assert.equal(page.events.at(-1).type, "newtab");
});

test("only new-tab link gestures are intercepted, including links added after load", async () => {
  const page = await newTabPage();
  assert.equal(page.click().defaultPrevented, false);
  assert.equal(page.events.length, 0);
  assert.equal(page.click({ target: "_blank" }).defaultPrevented, true);
  assert.equal(page.events.at(-1).activate, true);
  assert.equal(page.click({ ctrlKey: true }).defaultPrevented, true);
  assert.equal(page.events.at(-1).activate, false);
  assert.equal(page.click({ type: "auxclick" }).defaultPrevented, true);
  assert.equal(page.events.at(-1).activate, false);
  page.click({ metaKey: true, shiftKey: true });
  assert.equal(page.events.at(-1).activate, true);
  const count = page.events.length;
  for (const options of [
    { download: true, target: "_blank" },
    { defaultPrevented: true, target: "_blank" },
    { href: "mailto:hi@example.com", target: "_blank" },
    { button: 2, target: "_blank" },
  ])
    page.click(options);
  assert.equal(page.events.length, count);
});

test("shell creates, navigates and closes popup tabs only for the matching embed", async () => {
  const source = await readFile(
    new URL("../static/assets/js/browser.js", import.meta.url),
    "utf8",
  );
  const opener = { id: "source", iframe: { contentWindow: {} } };
  const tabs = [opener];
  const calls = [];
  const context = vm.createContext({
    URL,
    location: { origin: "https://55gms.test" },
    tabs,
    SEARCH_URL: "https://duckduckgo.com/?q=",
    createTab(options) {
      calls.push(["create", options.url, options.activate]);
      const tab = { id: String(tabs.length), ...options };
      tabs.push(tab);
      return tab;
    },
    ensureFrame(tab) {
      calls.push(["frame", tab.id]);
      if (tab.url)
        tab.iframe = { focus: () => calls.push(["focusFrame", tab.id]) };
    },
    document: {
      activeElement: { blur: () => calls.push(["blur"]) },
    },
    navigate(tab, url) {
      tab.url = url;
      calls.push(["navigate", tab.id, url]);
    },
    activateTab(id) {
      calls.push(["focus", id]);
    },
    closeTab(id) {
      calls.push(["close", id]);
    },
  });
  vm.runInContext(
    source.slice(
      source.indexOf("  const IPV4"),
      source.indexOf("  function hostnameOf"),
    ) +
      source.slice(
        source.indexOf("  function tabFromSource"),
        source.indexOf(
          '  window.addEventListener("message", handleBridgeMessage)',
        ),
      ),
    context,
  );
  const dispatch = (
    type,
    detail = {},
    source = opener.iframe.contentWindow,
    origin = "https://55gms.test",
  ) =>
    context.handleBridgeMessage({
      source,
      origin,
      data: { type: "browser:" + type, ...detail },
    });
  dispatch("newtab", { url: "", popupId: "1" });
  assert.equal(tabs.length, 2);
  assert.deepEqual(calls.at(-1), ["blur"]);
  assert.equal(tabs[1].openerId, "source");
  dispatch("popupnavigate", {
    popupId: "1",
    url: "https://example.com/redirect",
  });
  assert.equal(tabs[1].url, "https://example.com/redirect");
  assert.equal(tabs.length, 2);
  dispatch("popupfocus", { popupId: "1" });
  assert.deepEqual(calls.slice(-2), [["focus", "1"], ["blur"]]);
  dispatch("popupclose", { popupId: "1" });
  assert.deepEqual(calls.at(-1), ["close", "1"]);
  const count = calls.length;
  dispatch("newtab", { url: "javascript:alert(1)" });
  dispatch("newtab", { url: {} });
  dispatch("newtab", { url: "https://example.com" }, {});
  dispatch(
    "newtab",
    { url: "https://example.com" },
    opener.iframe.contentWindow,
    "https://attacker.example",
  );
  dispatch("popupclose", { popupId: "wrong" });
  assert.equal(calls.length, count);
  dispatch("newtab", {
    url: "https://example.com/background",
    activate: false,
  });
  assert.deepEqual(calls.at(-2), [
    "create",
    "https://example.com/background",
    false,
  ]);
  assert.deepEqual(calls.at(-1), ["frame", "2"]);
  dispatch("newtab", { url: "https://example.com/foreground" });
  assert.deepEqual(calls.at(-1), ["focusFrame", "3"]);
});

function assetRequest(context, url, headers = {}) {
  return {
    request: {
      method: "GET",
      destination: "script",
      cache: "default",
      initialHeaders: context.$scramjet.ScramjetHeaders.fromNativeHeaders(
        new Headers(headers),
      ),
    },
    parsed: { url: new URL(url) },
  };
}

test("actual pinned bundles agree on versions and reuse untouched cached asset bytes", async () => {
  const context = await realBundles();
  assert.equal(context.$scramjet.versionInfo.version, "2.0.67-alpha.2");
  assert.equal(context.$scramjetController.VERSION, "0.0.14");
  context.$scramjetController.assertRuntimeScramjetVersion();
  const transport = new context.EpoxyTransport.default({
    wisp: "wss://55gms.test/wisp/",
    wisp_v2: true,
  });
  await transport.init();
  assert.equal(transport.ready, true);
  const stored = new Map();
  context.caches = {
    open: async () => ({
      match: async (key) => stored.get(key.url)?.clone(),
      put: async (key, response) => {
        stored.set(key.url, response.clone());
      },
    }),
  };
  const hooks = context.$scramjet.Tap.create();
  const plugin = new context.frameRuntime.AssetCachePlugin();
  plugin.install({ fetchHandler: { hooks: { fetch: hooks } } });
  const first = assetRequest(context, "https://cdn.example.com/player.js");
  const bare = context.$scramjet.BareResponse.fromNativeResponse(
    new Response("const asset = 'original upstream URL';", {
      headers: {
        "content-type": "application/javascript",
        "cache-control": "public, max-age=3600",
      },
    }),
  );
  await context.$scramjet.Tap.dispatch(hooks.preresponse, first, {
    response: bare,
  });
  assert.equal(stored.size, 1);
  const next = assetRequest(context, "https://cdn.example.com/player.js");
  const props = {};
  await context.$scramjet.Tap.dispatch(hooks.request, next, props);
  assert.equal(
    await props.earlyResponse.text(),
    "const asset = 'original upstream URL';",
  );
});

test("actual cache plugin passes streams, range requests, API data and oversized assets through", async () => {
  const context = await realBundles();
  context.caches = {
    open() {
      throw new Error("Stream must not access the asset cache");
    },
  };
  const hooks = context.$scramjet.Tap.create();
  new context.frameRuntime.AssetCachePlugin().install({
    fetchHandler: { hooks: { fetch: hooks } },
  });
  for (const [url, destination, headers, type, length] of [
    [
      "https://cdn.example.com/video.mp4",
      "video",
      {},
      "video/mp4",
      "100000000",
    ],
    [
      "https://cdn.example.com/chunk.js",
      "script",
      { range: "bytes=0-99" },
      "application/javascript",
      "100",
    ],
    ["https://cdn.example.com/api/sources", "", {}, "application/json", "100"],
    [
      "https://cdn.example.com/player.js",
      "script",
      {},
      "application/javascript",
      "10000000",
    ],
    ["https://cdn.example.com/stream.js", "script", {}, "video/mp4", "100"],
  ]) {
    const input = assetRequest(context, url, headers);
    input.request.destination = destination;
    const response = {
      rawHeaders: [
        ["content-type", type],
        ["content-length", length],
      ],
      arrayBuffer() {
        throw new Error("Stream must not be buffered");
      },
    };
    await context.$scramjet.Tap.dispatch(hooks.preresponse, input, {
      response,
    });
  }
});

test("new worker routes proxied requests and leaves site assets alone", async () => {
  const handlers = {};
  const routed = [];
  const context = vm.createContext({
    importScripts(url) {
      assert.equal(url, "/assets/lib/vendor-worker.js?v=0.0.14");
    },
    setTimeout() {},
    addEventListener(type, callback) {
      handlers[type] = callback;
    },
    $scramjetController: {
      shouldRoute(event) {
        return event.request.url.includes("/stream/");
      },
      route(event) {
        routed.push(event.request.url);
        return "proxied";
      },
    },
  });
  context.self = context;
  vm.runInContext(
    await readFile(new URL("../static/sw.js", import.meta.url), "utf8"),
    context,
  );
  handlers.fetch({
    request: { url: "https://55gms.test/assets/js/script.js" },
    respondWith() {
      throw new Error("Local asset was intercepted");
    },
  });
  handlers.fetch({
    request: { url: "https://55gms.test/stream/tab/frame/target" },
    respondWith(value) {
      assert.equal(value, "proxied");
    },
  });
  assert.equal(routed.length, 1);
});

test("restarted worker tells the uncontrolled embed pages to reconnect", async () => {
  const sent = [];
  const client = (url) => ({
    url,
    postMessage(message) {
      sent.push({ url, message });
    },
  });
  let query;
  let revive;
  const context = vm.createContext({
    URL,
    importScripts() {},
    addEventListener() {},
    setTimeout(callback) {
      revive = callback;
    },
    registration: { scope: "https://55gms.test/stream/" },
    clients: {
      async matchAll(options) {
        query = options;
        return [
          client("https://55gms.test/embed.html#https://example.com/"),
          client("https://55gms.test/stream/tab/frame/token"),
        ];
      },
    },
  });
  context.self = context;
  vm.runInContext(
    await readFile(new URL("../static/sw.js", import.meta.url), "utf8"),
    context,
  );
  await revive();
  assert.equal(query.includeUncontrolled, true);
  assert.equal(query.type, "window");
  // Controlled proxied frames already get the controller bundle's own notice.
  assert.deepEqual(JSON.parse(JSON.stringify(sent)), [
    {
      url: "https://55gms.test/embed.html#https://example.com/",
      message: { $controller$swrevive: {} },
    },
  ]);
});

test("server exposes every new core/controller/transport asset used by the browser", async () => {
  const app = express();
  mountProxyAssets(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    for (const file of Object.keys(proxyAssetFiles)) {
      const response = await fetch(
        `http://127.0.0.1:${server.address().port}${file}?v=current`,
      );
      assert.equal(response.status, 200, file);
      assert.match(
        response.headers.get("content-type"),
        file.endsWith(".wasm") ? /wasm/ : /javascript/,
      );
      await response.arrayBuffer();
    }
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/baremux/index.js`,
    );
    assert.equal(response.status, 404);
    // Package-named paths and unlisted package files are not reachable.
    for (const file of [
      "/scram/scramjet.js",
      "/controller/controller.api.js",
      "/epoxy/index.js",
      "/assets/lib/scramjet.js.map",
    ]) {
      const old = await fetch(
        `http://127.0.0.1:${server.address().port}${file}`,
      );
      assert.equal(old.status, 404, file);
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
  const pkg = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(pkg.dependencies["@mercuryworkshop/bare-mux"], undefined);
  const transport = JSON.parse(
    await readFile(
      join(
        dirname(require.resolve("@mercuryworkshop/epoxy-transport")),
        "../package.json",
      ),
      "utf8",
    ),
  );
  assert.equal(transport.version, "3.0.1");
});

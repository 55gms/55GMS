import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import vm from "node:vm";
import test from "node:test";
import express from "express";
import { mountProxyAssets, proxyAssetPaths } from "../utils/proxyAssets.js";

const require = createRequire(import.meta.url);
const runtimeSource = await readFile(
  new URL("../static/assets/js/proxy-runtime.js", import.meta.url),
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

function runtime(registration) {
  const calls = [];
  const transport = deferred();
  const handshake = deferred();
  const timers = new Map();
  let nextTimer = 0;
  let controllerOptions;
  const context = vm.createContext({
    Headers,
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
  const ready = page.context.proxyRuntime
    .createController("wss://55gms.test/wisp/")
    .then(() => {
      completed = true;
    });
  assert.equal(page.calls.includes("init"), true);
  const registration = page.calls.find((call) => call.url);
  assert.equal(registration.options.scope, "/");
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
  const ready = page.context.proxyRuntime.createController(
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

test("failed worker installation rejects startup and removes its listener", async () => {
  const installing = worker("installing");
  const page = runtime(Promise.resolve({ installing }));
  const ready = page.context.proxyRuntime.createController(
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
  const ready = page.context.proxyRuntime.createController(
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
  for (const [route, file] of [
    ["/scram", "scramjet.js"],
    ["/controller", "controller.api.js"],
    ["/scramjet-utils", "scramjet-utils.js"],
    ["/epoxy", "index.js"],
  ]) {
    vm.runInContext(
      await readFile(join(proxyAssetPaths[route], file), "utf8"),
      context,
      { filename: file },
    );
  }
  context.window = context;
  vm.runInContext(runtimeSource, context);
  return context;
}

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
  const plugin = new context.proxyRuntime.AssetCachePlugin();
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
  new context.proxyRuntime.AssetCachePlugin().install({
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
      assert.equal(url, "/controller/controller.sw.js?v=0.0.14");
    },
    addEventListener(type, callback) {
      handlers[type] = callback;
    },
    $scramjetController: {
      shouldRoute(event) {
        return event.request.url.includes("/~/sj/");
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
    request: { url: "https://55gms.test/~/sj/tab/frame/target" },
    respondWith(value) {
      assert.equal(value, "proxied");
    },
  });
  assert.equal(routed.length, 1);
});

test("server exposes every new core/controller/transport asset used by the browser", async () => {
  const app = express();
  mountProxyAssets(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    for (const file of [
      "/scram/scramjet.js",
      "/scram/scramjet.wasm",
      "/controller/controller.api.js",
      "/controller/controller.inject.js",
      "/controller/controller.sw.js",
      "/scramjet-utils/scramjet-utils.js",
      "/epoxy/index.js",
    ]) {
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

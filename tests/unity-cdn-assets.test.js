import assert from "node:assert/strict";
import test from "node:test";
import {
  assetKey,
  downloadPart,
  installAssetRoutes,
  prepareAssets,
} from "../static/assets/js/unity-cdn-assets.js";

const base = "https://cdn.jsdelivr.net/gh/55gms/55gms@main/static/misc/test/";

test("asset matching preserves case and ignores cache queries", () => {
  assert.equal(
    assetKey("Build/Game.wasm?cache=1#x", base),
    `${base}Build/Game.wasm`,
  );
  assert.equal(
    assetKey(new Request(`${base}Build/Game.wasm?v=2`), base),
    `${base}Build/Game.wasm`,
  );
});

test("chunk merging preserves byte order despite out-of-order completion", async () => {
  const progress = [];
  const file = {
    path: "game.wasm",
    size: 6,
    type: "application/wasm",
    parts: [
      { path: "game.wasm.part1", size: 3 },
      { path: "game.wasm.part2", size: 3 },
    ],
  };
  const result = await prepareAssets(
    { files: [file] },
    base,
    (...args) => progress.push(args),
    async (url) => {
      const first = url.pathname.endsWith("part1");
      if (first) await new Promise((resolve) => setTimeout(resolve, 10));
      return new Response(new Uint8Array(first ? [0, 1, 2] : [3, 4, 5]));
    },
  );
  try {
    const response = await fetch(result.routes.get(assetKey(file.path, base)));
    assert.deepEqual(
      [...new Uint8Array(await response.arrayBuffer())],
      [0, 1, 2, 3, 4, 5],
    );
    assert.equal(response.headers.get("content-type"), "application/wasm");
    assert.deepEqual(
      progress.map(([path]) => path),
      ["game.wasm.part2", "game.wasm.part1"],
    );
  } finally {
    result.blobs.forEach(URL.revokeObjectURL);
  }
});

test("unsplit assets stay on the CDN without prefetching", async () => {
  const result = await prepareAssets(
    { files: [{ path: "small.data", size: 3 }] },
    base,
    () => {},
    () => {
      throw new Error("should not prefetch");
    },
  );
  assert.equal(
    result.routes.get(assetKey("small.data", base)),
    `${base}small.data`,
  );
});

test("frameworks served with binary CDN MIME types become executable JavaScript blobs", async () => {
  const code = "window.unityFramework = () => {};";
  const file = {
    path: "Build/framework.js.br",
    size: code.length,
    type: "application/javascript",
  };
  const result = await prepareAssets(
    { files: [file] },
    base,
    () => {},
    async () =>
      new Response(code, {
        headers: { "content-type": "application/octet-stream" },
      }),
  );
  try {
    const response = await fetch(result.routes.get(assetKey(file.path, base)));
    assert.equal(
      response.headers.get("content-type"),
      "application/javascript",
    );
    assert.equal(await response.text(), code);
    class Script {}
    let source;
    Object.defineProperty(Script.prototype, "src", {
      configurable: true,
      get() {
        return source;
      },
      set(value) {
        source = value;
      },
    });
    class XHR {
      open() {}
    }
    const restore = installAssetRoutes(result.routes, base, {
      fetch,
      XMLHttpRequest: XHR,
      HTMLScriptElement: Script,
    });
    const script = new Script();
    script.src = file.path;
    assert.equal(script.src, result.routes.get(assetKey(file.path, base)));
    restore();
    script.src = file.path;
    assert.equal(script.src, file.path);
  } finally {
    result.blobs.forEach(URL.revokeObjectURL);
  }
});

test("missing, truncated and oversized chunks stop startup", async () => {
  const part = { path: "game.part1", size: 3 };
  for (const response of [
    new Response("missing", { status: 404 }),
    new Response(new Uint8Array(2)),
    new Response(new Uint8Array(4)),
  ]) {
    await assert.rejects(
      downloadPart(
        part,
        base,
        () => {},
        async () => response,
      ),
    );
  }
});

test("a failed stream stops startup", async () => {
  const response = new Response(
    new ReadableStream({
      start(controller) {
        controller.error(new Error("offline"));
      },
    }),
  );
  await assert.rejects(
    downloadPart(
      { path: "game.part1", size: 3 },
      base,
      () => {},
      async () => response,
    ),
    /offline/,
  );
});

test("invalid manifest sizes are rejected before downloading", async () => {
  await assert.rejects(
    prepareAssets(
      {
        files: [{ path: "game", size: 3, parts: [{ path: "part1", size: 2 }] }],
      },
      base,
      () => {},
    ),
    /invalid chunk manifest/,
  );
});

test("fetch and XHR receive merged bytes while engines retain filename suffixes", async () => {
  const calls = [];
  const originalFetch = async (...args) => {
    calls.push(args);
    return new Response("ok");
  };
  class XHR {
    open(...args) {
      calls.push(args);
    }
  }
  const originalOpen = XHR.prototype.open;
  const environment = { fetch: originalFetch, XMLHttpRequest: XHR };
  const restore = installAssetRoutes(
    new Map([
      [assetKey("game.data.br", base), "blob:https://example.com/merged"],
    ]),
    base,
    environment,
  );
  await environment.fetch("game.data.br?v=1", { method: "GET" });
  new XHR().open("GET", "game.data.br", true);
  await environment.fetch("other.data");
  assert.equal(calls[0][0], "blob:https://example.com/merged");
  assert.deepEqual(calls[1], ["GET", "blob:https://example.com/merged", true]);
  assert.equal(calls[2][0], "other.data");
  restore();
  assert.equal(environment.fetch, originalFetch);
  assert.equal(XHR.prototype.open, originalOpen);
});

test("root-relative site assets stay on the app origin under a CDN base", async () => {
  const calls = [];
  class XHR {
    open(...args) {
      calls.push(args);
    }
  }
  const environment = {
    location: { origin: "https://55gms.com" },
    fetch: async (input) => {
      calls.push(input);
      return new Response("ok");
    },
    XMLHttpRequest: XHR,
  };
  installAssetRoutes(new Map(), base, environment);
  await environment.fetch("/assets/json/ads.json");
  new XHR().open("GET", "/api/user");
  assert.equal(calls[0], "https://55gms.com/assets/json/ads.json");
  assert.deepEqual(calls[1], ["GET", "https://55gms.com/api/user"]);
});

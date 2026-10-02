import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const ui = await read("static/assets/js/loader-ui.js");
const gameLoader = await read("static/assets/js/game-loader.js");
const version = ui.match(/const VERSION = "(\w+)"/)[1];

function page(overlay, title = "Unity WebGL Player | Karlson") {
  const dom = new JSDOM(
    `<title>${title}</title><base href="https://cdn.example/game/">${overlay}`,
    { url: "https://55gms.test/misc/game/", runScripts: "outside-only" },
  );
  dom.window.localStorage.setItem("siteTheme", "midnight");
  dom.window.eval(ui);
  return dom.window;
}

const text = (window, name) =>
  window.document.querySelector(`.loader-${name}`).textContent.trim();

test("loader UI mounts with branding, theme and a cleaned title", () => {
  const window = page(
    '<div id="unity-cdn-loading" role="status">LOADING...</div>',
  );
  const overlay = window.document.getElementById("unity-cdn-loading");
  window.LoaderUI.mount(overlay);
  assert.equal(text(window, "title"), "Karlson");
  assert.equal(text(window, "status"), "Preparing download");
  assert.equal(overlay.dataset.theme, "midnight");
  assert.equal(overlay.hasAttribute("role"), false);
  assert.equal(
    window.document.querySelector(".loader-logo").src,
    `https://55gms.test/img/55gms.png?v=${version}`,
  );
  assert.equal(
    window.document.querySelector("link[rel=stylesheet]").href,
    `https://55gms.test/assets/css/loader-ui.css?v=${version}`,
  );
});

test("loader UI reports real sizes, clamps, and shows the error state", () => {
  const window = page('<div id="game-loading" data-title="Flick Goal"></div>');
  const overlay = window.document.getElementById("game-loading");
  const view = window.LoaderUI.mount(overlay);
  assert.equal(text(window, "title"), "Flick Goal");
  view.set(5242880, 10485760, false);
  assert.equal(overlay.dataset.state, "downloading");
  assert.equal(text(window, "amount"), "5.00 MB / 10.00 MB");
  assert.equal(text(window, "percent"), "50%");
  view.set(99999999, 10485760, false);
  assert.equal(text(window, "percent"), "100%");
  view.fail();
  assert.equal(overlay.dataset.state, "error");
  assert.equal(text(window, "status"), "Unable to load game");
});

test("GameLoader drives the UI through download, start and finish", async () => {
  const window = page(
    '<div id="game-loading" data-total-mb="133.35"></div>',
    "60 Seconds! Reatomized",
  );
  const chunk = new Uint8Array(1048576);
  window.fetch = async (url) => {
    let left = url.endsWith("a") ? 3 : 1;
    return {
      ok: true,
      body: {
        getReader: () => ({
          read: async () =>
            left-- > 0 ? { done: false, value: chunk } : { done: true },
        }),
      },
    };
  };
  window.Blob = Blob;
  window.URL.createObjectURL = () => "blob:test";
  window.eval(gameLoader);
  const overlay = window.document.getElementById("game-loading");
  window.GameLoader.prepare([
    ["a", 3145728],
    ["b", 1048576],
  ]);
  assert.equal(text(window, "amount"), "0.00 MB / 133.35 MB");
  assert.equal(overlay.dataset.state, "preparing");
  await window.GameLoader.merge(["a", "b"]);
  assert.equal(overlay.dataset.state, "starting");
  assert.equal(text(window, "status"), "Starting game");
  assert.equal(text(window, "amount"), "133.35 MB / 133.35 MB");
  assert.equal(text(window, "percent"), "100%");
  window.GameLoader.finish();
  assert.equal(overlay.hidden, true);
});

// A Unity page as it stands once game-loader.js has run GameLoader.unity().
function unityPage(title, files = [], before = () => {}) {
  const window = page("", title);
  before(window);
  window.eval(gameLoader);
  window.GameLoader.unity(files);
  return { window, overlay: window.document.getElementById("game-loading") };
}

test("GameLoader.unity follows createUnityInstance from progress to ready", async () => {
  const { window, overlay } = unityPage("Cuphead");
  assert.equal(overlay.dataset.state, "preparing");
  let finish;
  let seen = 0;
  window.createUnityInstance = (canvas, config, onProgress) => {
    onProgress(0.45);
    return new Promise((resolve) => (finish = resolve));
  };
  const result = window.createUnityInstance(
    null,
    {},
    (amount) => (seen = amount),
  );
  assert.equal(seen, 0.45);
  // Nothing was counted, so Unity's own fraction drives the bar.
  assert.equal(overlay.dataset.state, "downloading");
  assert.equal(text(window, "percent"), "50%");
  assert.equal(overlay.hidden, false);
  finish("instance");
  assert.equal(await result, "instance");
  await new Promise((resolve) => setTimeout(resolve));
  assert.equal(overlay.hidden, true);
});

test("GameLoader.unity follows UnityLoader.instantiate and shows failures", async () => {
  const { window, overlay } = unityPage("Slope");
  let report;
  window.UnityLoader = {
    instantiate: (container, url, options) => (report = options.onProgress),
  };
  window.UnityLoader.instantiate("gameContainer", "build.json");
  report({}, 0.9);
  assert.equal(overlay.dataset.state, "starting");
  assert.equal(text(window, "percent"), "100%");
  report({}, 1);
  assert.equal(overlay.hidden, true);

  const broken = unityPage("Raft");
  broken.window.console.error = () => {};
  broken.window.createUnityInstance = () =>
    Promise.reject(new Error("no wasm"));
  broken.window.createUnityInstance().catch(() => {});
  await new Promise((resolve) => setTimeout(resolve));
  assert.equal(broken.overlay.dataset.state, "error");
});

test("GameLoader.unity hooks a UnityLoader the page declared before it", () => {
  let report;
  // A top-level `var UnityLoader` in an earlier script cannot be redefined.
  const { window, overlay } = unityPage(
    "A Dance of Fire And Ice",
    [],
    (window) =>
      Object.defineProperty(window, "UnityLoader", {
        writable: true,
        enumerable: true,
        configurable: false,
        value: {
          instantiate: (container, url, options) =>
            (report = options.onProgress),
        },
      }),
  );
  window.UnityLoader.instantiate("gameContainer", "build.json");
  report({}, 0.45);
  assert.equal(overlay.dataset.state, "downloading");
  report({}, 1);
  assert.equal(overlay.hidden, true);
});

test("GameLoader.unity releases pages whose startup it never saw", async () => {
  const { window, overlay } = unityPage("Solar Smash");
  window.dispatchEvent(new window.Event("load"));
  await new Promise((resolve) => setTimeout(resolve, 1600));
  assert.equal(overlay.hidden, true);
});

test("GameLoader.unity counts the bytes Unity downloads itself", async () => {
  const chunk = new Uint8Array(1048576);
  const requested = [];
  const { window, overlay } = unityPage(
    "Karlson",
    [
      ["Build/game.data.unityweb", 3145728],
      ["Build/game.wasm.unityweb", 1048576],
    ],
    (window) => {
      window.ReadableStream = ReadableStream;
      window.Response = Response;
      window.fetch = async (url, options) => {
        requested.push(options?.method ?? "GET");
        return new Response(new Blob([chunk, chunk, chunk]).stream());
      };
    },
  );
  assert.equal(text(window, "amount"), "0.00 MB / 4.00 MB");

  // Paths resolve against the <base>, whatever form the engine asks in.
  const data = "https://cdn.example/game/Build/game.data.unityweb?v=2";
  await window.fetch(data, { method: "HEAD" });
  assert.equal(text(window, "amount"), "0.00 MB / 4.00 MB");
  const response = await window.fetch(data);
  assert.equal((await response.arrayBuffer()).byteLength, 3145728);
  assert.equal(text(window, "amount"), "3.00 MB / 4.00 MB");
  assert.equal(text(window, "percent"), "75%");
  await (await window.fetch("Build/other.bundle")).arrayBuffer();
  assert.equal(text(window, "amount"), "3.00 MB / 4.00 MB");
  assert.deepEqual(requested, ["HEAD", "GET", "GET"]);

  const xhr = new window.XMLHttpRequest();
  xhr.open("GET", "Build/game.wasm.unityweb");
  const progress = (loaded) =>
    xhr.dispatchEvent(new window.ProgressEvent("progress", { loaded }));
  progress(524288);
  assert.equal(text(window, "amount"), "3.50 MB / 4.00 MB");
  progress(1048576);
  assert.equal(text(window, "amount"), "4.00 MB / 4.00 MB");
  assert.equal(overlay.dataset.state, "downloading");

  let report;
  window.UnityLoader = {
    instantiate: (container, url, options) => (report = options.onProgress),
  };
  window.UnityLoader.instantiate("gameContainer", "build.json");
  report({}, 0.5);
  assert.equal(text(window, "amount"), "4.00 MB / 4.00 MB");
  report({}, 0.9);
  assert.equal(overlay.dataset.state, "starting");
});

test("Unity pages list the real sizes of the files in their folder", async () => {
  const misc = new URL("../static/misc/", import.meta.url);
  let pages = 0;
  for (const folder of await readdir(misc)) {
    const html = await readFile(
      new URL(`${folder}/index.html`, misc),
      "utf8",
    ).catch(() => "");
    const call = html.match(
      /GameLoader\.unity\(\[([^]*?)\](?:, \{[^}]*\})?\);/,
    );
    if (!call) continue;
    pages += 1;
    const base = html.match(/<base\s+href="([^"]+)"/)?.[1] ?? "";
    for (const [, path, size] of call[1].matchAll(/\["([^"]+)", (\d+)\]/g)) {
      // Files on other hosts cannot be checked from here.
      if (path.includes("://") || !base.includes(`/static/misc/${folder}/`))
        continue;
      const file = await stat(new URL(`${folder}/${path}`, misc));
      assert.equal(Number(size), file.size, `${folder}: ${path}`);
    }
  }
  assert.equal(pages, 35);
});

test("every page names the current loader version", async () => {
  const misc = new URL("../static/misc/", import.meta.url);
  const tag =
    /\/assets\/(?:js|css)\/(?:loader-ui|game-loader|unity-cdn-loader)\.(?:js|css)(\?v=(\w+))?"/g;
  let pages = 0;
  for (const folder of await readdir(misc)) {
    const html = await readFile(
      new URL(`${folder}/index.html`, misc),
      "utf8",
    ).catch(() => "");
    const tags = [...html.matchAll(tag)];
    if (tags.length) pages += 1;
    // The page <title> can be replaced by the tab cloak (e.g. "Dashboard"),
    // so every loading screen needs its game name spelled out.
    if (tags.length)
      assert.match(html, /data-title="[^"]+"/, `${folder}: no data-title`);
    for (const [url, , found] of tags)
      assert.equal(found, version, `${folder}: stale tag on ${url}`);
  }
  assert.ok(pages >= 77);
});

test("GameLoader builds its own overlay and measures unlisted ports", async () => {
  const window = page("", "Bendy");
  const chunk = new Uint8Array(1048576);
  window.fetch = async (url, options) => {
    if (options?.method === "HEAD")
      return { ok: true, headers: { get: () => "2097152" } };
    let left = 2;
    return {
      ok: true,
      body: {
        getReader: () => ({
          read: async () =>
            left-- > 0 ? { done: false, value: chunk } : { done: true },
        }),
      },
    };
  };
  window.Blob = Blob;
  window.URL.createObjectURL = () => "blob:test";
  window.eval(gameLoader);
  const overlay = window.document.getElementById("game-loading");
  assert.ok(overlay);
  await window.GameLoader.measure(["a.part1", "a.part2"]);
  assert.equal(text(window, "amount"), "0.00 MB / 4.00 MB");
  await window.GameLoader.merge(["a.part1", "a.part2"]);
  assert.equal(overlay.dataset.state, "starting");
  window.GameLoader.status("Extracting assets (3/9)");
  assert.equal(text(window, "status"), "Extracting assets (3/9)");
  assert.equal(overlay.dataset.state, "loading");
});

test("GameLoader honours a fixed total and reports unknown sizes plainly", async () => {
  const chunk = new Uint8Array(1048576);
  const load = (window) => {
    let release;
    window.fetch = async () => ({
      ok: true,
      body: {
        getReader: () => {
          let sent = false;
          return {
            read: async () => {
              if (!sent) return ((sent = true), { done: false, value: chunk });
              await new Promise((resolve) => (release = resolve));
              return { done: true };
            },
          };
        },
      },
    });
    window.Blob = Blob;
    window.URL.createObjectURL = () => "blob:test";
    window.eval(gameLoader);
    const merged = window.GameLoader.merge(["a.part1"]);
    return { merged, finish: () => release() };
  };
  const tick = () => new Promise((resolve) => setTimeout(resolve));

  const unknown = page("", "Raft");
  const first = load(unknown);
  await tick();
  assert.equal(text(unknown, "amount"), "1.00 MB");
  assert.equal(text(unknown, "percent"), "");
  first.finish();
  await first.merged;

  const fixed = page("", "Cuphead");
  const second = load(fixed);
  fixed.GameLoader.expect(4 * 1048576);
  await tick();
  assert.equal(text(fixed, "amount"), "1.00 MB / 4.00 MB");
  assert.equal(text(fixed, "percent"), "25%");
  second.finish();
  await second.merged;
  assert.equal(
    fixed.document.getElementById("game-loading").dataset.state,
    "starting",
  );
});

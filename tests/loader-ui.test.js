import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const ui = await read("static/assets/js/loader-ui.js");
const gameLoader = await read("static/assets/js/game-loader.js");
const unityLoading = await read("static/assets/js/unity-loading.js");
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

test("unity-loading follows createUnityInstance from progress to ready", async () => {
  const window = page("", "Cuphead");
  window.eval(unityLoading);
  const overlay = window.document.getElementById("unity-loading");
  assert.equal(overlay.dataset.state, "loading");
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
  assert.equal(overlay.dataset.state, "downloading");
  assert.equal(text(window, "percent"), "50%");
  assert.equal(overlay.hidden, false);
  finish("instance");
  assert.equal(await result, "instance");
  await new Promise((resolve) => setTimeout(resolve));
  assert.equal(overlay.hidden, true);
});

test("unity-loading follows UnityLoader.instantiate and shows failures", async () => {
  const window = page("", "Slope");
  window.eval(unityLoading);
  const overlay = window.document.getElementById("unity-loading");
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

  const broken = page("", "Raft");
  broken.eval(unityLoading);
  broken.createUnityInstance = () => Promise.reject(new Error("no wasm"));
  broken.createUnityInstance().catch(() => {});
  await new Promise((resolve) => setTimeout(resolve));
  assert.equal(
    broken.document.getElementById("unity-loading").dataset.state,
    "error",
  );
});

test("unity-loading releases pages whose startup it never saw", async () => {
  const window = page("", "Solar Smash");
  window.eval(unityLoading);
  const overlay = window.document.getElementById("unity-loading");
  window.dispatchEvent(new window.Event("load"));
  await new Promise((resolve) => setTimeout(resolve, 1600));
  assert.equal(overlay.hidden, true);
});

test("every page names the current loader version", async () => {
  const misc = new URL("../static/misc/", import.meta.url);
  const tag =
    /\/assets\/(?:js|css)\/(?:loader-ui|game-loader|unity-cdn-loader|unity-loading)\.(?:js|css)(\?v=(\w+))?"/g;
  let pages = 0;
  for (const folder of await readdir(misc)) {
    const html = await readFile(
      new URL(`${folder}/index.html`, misc),
      "utf8",
    ).catch(() => "");
    const tags = [...html.matchAll(tag)];
    if (tags.length) pages += 1;
    for (const [url, , found] of tags)
      assert.equal(found, version, `${folder}: stale tag on ${url}`);
  }
  assert.ok(pages >= 77);
});

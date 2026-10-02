import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const ui = await read("static/assets/js/loader-ui.js");
const gameLoader = await read("static/assets/js/game-loader.js");

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
    "https://55gms.test/img/55gms.png?v=3",
  );
  assert.equal(
    window.document.querySelector("link[rel=stylesheet]").href,
    "https://55gms.test/assets/css/loader-ui.css?v=3",
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

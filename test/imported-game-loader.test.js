import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";
const source = await readFile(
  new URL("../static/assets/js/imported-game-loader.js", import.meta.url),
  "utf8",
);
function page(engine) {
  const dom = new JSDOM(
    `<script type="application/json" id="gms-import-config">${JSON.stringify({ engine, files: [["game.data", 100]], total: 100, parts: {} })}</script>`,
    { runScripts: "outside-only", url: "https://55gms.test/misc/game/" },
  );
  const calls = [];
  dom.window.GameLoader = {
    unity: (...args) => calls.push(["unity", ...args]),
    expect: (n) => calls.push(["expect", n]),
    track: (...args) => calls.push(["track", ...args]),
    finish: () => calls.push(["finish"]),
    fail: (e) => calls.push(["fail", e]),
  };
  dom.window.eval(source);
  return { window: dom.window, calls, close: () => dom.window.close() };
}
test("imported Unity games use the existing loader and its real file sizes", () => {
  const { calls, close } = page("unity");
  assert.equal(calls[0]?.[0], "unity");
  assert.equal(calls[0][1][0][0], "game.data");
  assert.equal(calls[0][1][0][1], 100);
  assert.ok(calls.some((c) => c[0] === "expect" && c[1] === 100));
  close();
});
test("Construct 3 hides the 55GMS loader only after the runtime reports ready", () => {
  const { window, calls, close } = page("construct3");
  let original = 0;
  window.RuntimeInterface = class {
    _OnRuntimeReady() {
      original++;
    }
  };
  assert.equal(
    calls.some((c) => c[0] === "finish"),
    false,
  );
  new window.RuntimeInterface()._OnRuntimeReady();
  assert.equal(original, 1);
  assert.equal(calls.filter((c) => c[0] === "finish").length, 1);
  close();
});
test("Construct 2 waits for the runtime to finish loading", async () => {
  const { window, calls, close } = page("construct2");
  const runtime = { isLoading: true };
  window.cr_getC2Runtime = () => runtime;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(
    calls.some((c) => c[0] === "finish"),
    false,
  );
  runtime.isLoading = false;
  await new Promise((r) => setTimeout(r, 80));
  assert.equal(calls.filter((c) => c[0] === "finish").length, 1);
  close();
});

test("imported SDK stand-ins never grant a reward when ads are unavailable", async () => {
  const { window, close } = page("unity");
  let rewards = 0,
    closed = 0,
    errors = 0;
  await window.GMSImportedAds.yandex({
    callbacks: {
      onRewarded: () => rewards++,
      onClose: () => closed++,
      onError: () => errors++,
    },
  });
  assert.equal(rewards, 0);
  assert.equal(closed, 1);
  assert.equal(errors, 1);
  close();
});
test("a completed site rewarded ad grants exactly one game reward", async () => {
  const { window, close } = page("unity");
  let rewards = 0,
    closed = 0,
    opened = 0;
  window.GMSAds = {
    on: (_, fn) => fn(),
    off: () => {},
    showRewardedAd: async () => ({ rewardGranted: true }),
  };
  await window.GMSImportedAds.yandex({
    callbacks: {
      onRewarded: () => rewards++,
      onClose: () => closed++,
      onOpen: () => opened++,
    },
  });
  assert.equal(rewards, 1);
  assert.equal(closed, 1);
  assert.equal(opened, 1);
  close();
});

test("minified Construct 2 reports readiness through its exported startup callback", (t) => {
  const { window, calls, close } = page("construct2");
  t.after(close);
  let registered = 0;
  window.C2_RegisterSW = () => registered++;
  assert.equal(
    calls.some((call) => call[0] === "finish"),
    false,
  );
  // This is the exported callback used after the first layout starts in c2runtime.js.
  window.C2_RegisterSW();
  assert.equal(registered, 1);
  assert.equal(calls.filter((call) => call[0] === "finish").length, 1);
  close();
});

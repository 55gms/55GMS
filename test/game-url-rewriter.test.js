import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  createGameUrlRewriter,
  relativeUnityManifest,
} from "../scripts/lib/rewriteGameUrls.js";

const remote = "https://cdn.example.test/games/soccer/";
const local = "/misc/soccer/_ext/cdn.example.test/games/soccer/";
const sources = new Map([
  [
    remote + "images/title.png",
    "_ext/cdn.example.test/games/soccer/images/title.png",
  ],
  [
    remote + "scripts/main.js",
    "_ext/cdn.example.test/games/soccer/scripts/main.js",
  ],
]);
const rewrite = createGameUrlRewriter(
  sources,
  new URL("https://portal.test/game/"),
  "/misc/soccer/",
);

test("a game's dynamically constructed CDN paths fetch the captured local directory", () => {
  const requested = [];
  const code = `const images = "${remote}images/"; fetch(images + "level-2.png?cache=1");`;
  vm.runInNewContext(rewrite(code), { fetch: (url) => requested.push(url) });
  assert.deepEqual(requested, [local + "images/level-2.png?cache=1"]);
});

test("a repository root used to construct Build URLs stays local", () => {
  const rewriteRoot = createGameUrlRewriter(
    new Map([
      [
        "https://cdn.test/gh/owner/repo@ref/Build/game.loader.js",
        "_ext/cdn.test/gh/owner/repo@ref/Build/game.loader.js",
      ],
    ]),
    new URL("https://portal.test/game/"),
    "/misc/game/",
  );
  assert.equal(
    rewriteRoot(
      'const BASE="https://cdn.test/gh/owner/repo@ref"; fetch(BASE+"/Build/game.data")',
    ),
    'const BASE="/misc/game/_ext/cdn.test/gh/owner/repo%40ref"; fetch(BASE+"/Build/game.data")',
  );
});

test("old Unity manifest entries remain relative to the manifest", () => {
  const result = JSON.parse(
    relativeUnityManifest(
      JSON.stringify({
        dataUrl: "/misc/game/_ext/cdn/Build/Game%20Data.unityweb",
        wasmCodeUrl: "/misc/game/_ext/cdn/Build/Game.wasm",
      }),
      "_ext/cdn/Build/Game.json",
      "/misc/game/",
    ),
  );
  assert.equal(result.dataUrl, "Game%20Data.unityweb");
  assert.equal(result.wasmCodeUrl, "Game.wasm");
});

test("explicit files and protocol-relative directory paths preserve their query strings", () => {
  const requested = [];
  const code = `fetch("${remote}scripts/main.js?v=4"); fetch("//cdn.example.test/games/soccer/images/" + "ball.png");`;
  vm.runInNewContext(rewrite(code), { fetch: (url) => requested.push(url) });
  assert.deepEqual(requested, [
    local + "scripts/main.js?v=4",
    local + "images/ball.png",
  ]);
});

test("uncaptured sites and unrelated portal routes keep their original destinations", () => {
  const code = 'fetch("https://other.test/api"); fetch("/api/saves");';
  assert.equal(rewrite(code), code);
});

test("a CDN build directory without a trailing slash remains local when filenames are appended", () => {
  const requested = [];
  const code = `const build = "${remote}images"; fetch(build + "/level-3.png");`;
  vm.runInNewContext(rewrite(code), { fetch: (url) => requested.push(url) });
  assert.deepEqual(requested, [local + "images/level-3.png"]);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  getStaticCacheControl,
  LONG_CACHE_CONTROL,
  REVALIDATE_CACHE_CONTROL,
  shouldCompress,
} from "../utils/httpPerformance.js";

test("static assets get long-lived cache headers", () => {
  for (const file of [
    "/static/assets/css/style.css",
    "/static/assets/js/games.js",
    "/static/img/games/2doom.webp",
    "/static/misc/game/Build/game.wasm",
  ]) {
    assert.equal(getStaticCacheControl(file), LONG_CACHE_CONTROL, file);
  }
});

test("documents, catalogs and the service worker always revalidate", () => {
  for (const file of [
    "/static/index.html",
    "/static/assets/json/load/g.json",
    "/static/sitemap.xml",
    "/static/sw.js",
  ]) {
    assert.equal(getStaticCacheControl(file), REVALIDATE_CACHE_CONTROL, file);
  }
});

test("music proxy responses are never compressed", () => {
  const res = { getHeader: () => "text/plain" };
  assert.equal(
    shouldCompress({ path: "/api/music/stream", headers: {} }, res),
    false,
  );
  assert.equal(
    shouldCompress({ path: "/api/user-chats", headers: {} }, res),
    true,
  );
});

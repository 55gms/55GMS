import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const staticDir = new URL("../static/", import.meta.url);
const games = JSON.parse(
  readFileSync(new URL("assets/json/load/g.json", staticDir), "utf8"),
);

test("game ids are unique", () => {
  const ids = games.filter((game) => game.id).map((game) => game.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every game page link points at a catalog id with a frame", () => {
  for (const game of games) {
    const match = /^\/misc\/play\/\?g=(.+)$/.exec(game.url ?? "");
    if (!match) continue;
    assert.equal(game.id, match[1], game.name);
    assert.ok(game.frame, `${game.name} has no frame`);
  }
});

test("no per-game wrapper pages are left in /misc/play", () => {
  const pages = readdirSync(new URL("misc/play/", staticDir)).filter((name) =>
    name.endsWith(".html"),
  );
  assert.deepEqual(pages, ["index.html"]);
});

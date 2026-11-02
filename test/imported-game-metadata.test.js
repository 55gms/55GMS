import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file) =>
  JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));

test("every imported game has a unique catalog entry, pinned artwork and source-backed creator credit", () => {
  const baseline = read("../docs/game-imports/2026-10-29.json");
  const update = read("../docs/game-imports/2026-11-02.json");
  const metadata = read("../docs/game-imports/metadata.json");
  const catalog = read("../static/assets/json/load/g.json");
  const latest = read("../docs/game-imports/2026-11-02-batch2.json");
  const games = [...baseline.games, ...update.games, ...latest.games];
  assert.equal(metadata.length, games.length);
  assert.equal(new Set(metadata.map((game) => game.folder)).size, games.length);
  for (const game of games) {
    const credit = metadata.find((item) => item.folder === game.folder);
    assert.ok(
      credit?.author && !/original|unknown|unresolved/i.test(credit.author),
      game.name,
    );
    assert.match(credit.authorSourceUrl, /^https:\/\//, game.name);
    assert.match(credit.imageSourceUrl, /^https?:\/\/|^gameplay:/, game.name);
    const entries = catalog.filter((entry) => entry.name === game.name);
    assert.equal(entries.length, 1, game.name);
    const entry = entries[0];
    assert.equal(entry.author, credit.author, game.name);
    if (credit.imageDelivery === "external")
      assert.equal(entry.image, credit.imageSourceUrl, game.name);
    else
      assert.match(
        entry.image,
        new RegExp(
          `^https://cdn\\.jsdelivr\\.net/gh/55gms/assets@[0-9a-f]{40}/misc/${game.folder}/img\\.webp$`,
        ),
        game.name,
      );
    const launch = new URL(entry.url, "https://55gms.test");
    assert.equal(launch.searchParams.get("author"), credit.author, game.name);
    assert.equal(launch.searchParams.get("link"), game.folder, game.name);
  }
});

test("all ten requests record a duplicate decision and new games retain loader and save integration", () => {
  const update = read("../docs/game-imports/2026-11-02.json");
  assert.equal(update.requested.length, 10);
  const folders = new Set();
  for (const request of update.requested) {
    assert.ok(
      ["added", "already-present"].includes(request.disposition),
      request.name,
    );
    assert.ok(request.reason.length > 10, request.name);
    if (request.disposition === "already-present") {
      assert.ok(request.existingFolder, request.name);
      continue;
    }
    assert.ok(!folders.has(request.folder), request.name);
    folders.add(request.folder);
    const html = readFileSync(
      new URL(`../static/misc/${request.folder}/index.html`, import.meta.url),
      "utf8",
    );
    assert.ok(html.includes("gms-import-config"), request.name);
    assert.ok(
      html.includes("/assets/js/imported-game-loader.js?v=3"),
      request.name,
    );
    assert.ok(html.includes("/assets/js/save-agent.js"), request.name);
    assert.ok(html.includes(`data-game-id="${request.folder}"`), request.name);
  }
  assert.equal(update.games.length, folders.size);
});

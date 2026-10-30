import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "docs/game-imports/2026-10-29.json");
const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

test("each published batch contains distinct, reviewed games with working launch pages", () => {
  assert.ok(
    existsSync(manifestPath),
    "the source and gameplay evidence manifest must exist",
  );
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.target, 100);
  assert.ok(manifest.games.length > 0);
  assert.equal(
    manifest.status,
    manifest.games.length >= manifest.target ? "complete" : "in-progress",
  );
  const catalog = JSON.parse(
    readFileSync(path.join(root, "static/assets/json/load/g.json"), "utf8"),
  );
  const names = new Set();
  const payloads = new Set();
  const folders = new Set();
  const relay = readFileSync(path.join(root, "utils/gameAssets.js"), "utf8");
  assert.ok(relay.includes(`/assets@${manifest.assetCommit}/misc/`));
  for (const game of manifest.games) {
    assert.ok(
      !manifest.existingNames.includes(normalize(game.name)),
      `already in the baseline catalog: ${game.name}`,
    );
    assert.ok(!names.has(normalize(game.name)), `repeated title: ${game.name}`);
    names.add(normalize(game.name));
    assert.ok(!folders.has(game.folder), `repeated folder: ${game.folder}`);
    folders.add(game.folder);
    assert.match(game.sha256, /^[0-9a-f]{64}$/);
    assert.ok(!payloads.has(game.sha256), `identical payload: ${game.name}`);
    payloads.add(game.sha256);
    assert.ok(
      ["unity", "construct2", "construct3", "flash"].includes(game.runtime),
    );
    assert.ok(game.assets.length > 0);
    assert.ok(
      game.assets.every(
        (asset) => asset.bytes > 0 && asset.bytes <= 20_000_000,
      ),
    );
    assert.ok(
      game.sourceUrl.startsWith(
        "https://sites.google.com/view/drive-u-7-home/",
      ),
    );
    assert.equal(game.verification.status, "gameplay-verified");
    assert.ok(game.verification.actions.length > 0);
    assert.ok(game.verification.observation.length > 10);
    const entries = catalog.filter(
      (entry) => normalize(entry.name) === normalize(game.name),
    );
    assert.equal(
      entries.length,
      1,
      `catalog duplicate or missing: ${game.name}`,
    );
    const launch = new URL(entries[0].url, "https://55gms.test");
    assert.equal(launch.pathname, "/misc/play/");
    assert.equal(launch.searchParams.get("link"), game.folder);
    const html = readFileSync(
      path.join(root, "static/misc", game.folder, "index.html"),
      "utf8",
    );
    assert.ok(html.includes("/assets/js/save-agent.js"));
    assert.ok(html.includes("data-game-id="));
    if (html.includes("<base ")) {
      assert.ok(
        html.indexOf("/assets/js/save-agent.js") < html.indexOf("<base "),
      );
    }
  }
});

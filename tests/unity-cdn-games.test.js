import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";

const folders = [
  "nowgg",
  "amazing-rope-police",
  "superstarcar",
  "dadish3d",
  "drift-hunters",
  "funny-shooter-2",
  "geometry-dash",
  "gladihoppers",
  "golforbit",
  "survival-race",
  "madstunt-cars",
  "skyriders",
  "papery-planes",
  "flickgoal",
  "ragdoll-hit",
  "bikeobby",
  "superhot",
  "Tanuki-Sunset",
  "kiwiclicker",
  "karlson",
  "zombiederby",
];

for (const folder of folders) {
  test(`${folder}: CDN page and byte-exact Unity payloads`, async () => {
    const root = new URL(`../static/misc/${folder}/`, import.meta.url);
    const page = await readFile(new URL("index.html", root), "utf8");
    assert.ok(
      page.includes(
        `<base href="https://cdn.jsdelivr.net/gh/55gms/55gms@main/static/misc/${folder}/">`,
      ),
    );
    assert.ok(page.includes('id="unity-cdn-loading"'));
    assert.ok(page.includes('id="unity-game-scripts"'));
    assert.ok(page.includes('src="/assets/js/unity-cdn-loader.js"'));
    assert.ok(
      page.indexOf('src="/assets/js/unity-cdn-loader.js"') <
        page.indexOf("<base "),
    );
    assert.ok(
      page.indexOf('href="/assets/css/unity-cdn-loader.css"') <
        page.indexOf("<base "),
    );
    assert.equal(
      (
        page.match(
          /<script type="module" src="\/assets\/js\/unity-cdn-loader.js"/g,
        ) || []
      ).length,
      1,
    );
    const manifest = JSON.parse(
      await readFile(new URL("unity-assets.json", root), "utf8"),
    );
    assert.equal(manifest.version, 1);
    assert.ok(manifest.files.length);
    for (const [, attributes, script] of page.matchAll(
      /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,
    )) {
      if (/\bsrc=/.test(attributes) || !script.trim()) continue;
      const result = spawnSync(
        process.execPath,
        ["--check", "--input-type=commonjs"],
        { input: script, encoding: "utf8" },
      );
      assert.equal(result.status, 0, result.stderr);
    }
    if (folder === "bikeobby") {
      const policy = page.match(
        /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i,
      )?.[1];
      assert.ok(policy);
      for (const directive of [
        "connect-src",
        "script-src",
        "style-src",
        "img-src",
      ]) {
        assert.ok(
          policy
            .split(";")
            .find((item) => item.trim().startsWith(`${directive} `))
            .includes("https://cdn.jsdelivr.net"),
        );
      }
    }
    for (const file of manifest.files) {
      const hash = createHash("sha256");
      let bytes = 0;
      if (file.parts)
        assert.equal(
          existsSync(new URL(file.path, root)),
          false,
          `Oversized original remains: ${file.path}`,
        );
      for (const part of file.parts || [file]) {
        const path = new URL(part.path, root);
        const size = (await stat(path)).size;
        assert.equal(size, part.size);
        assert.ok(size <= 20_000_000, `CDN file limit exceeded: ${part.path}`);
        if (file.parts) assert.ok(size <= 10_000_000);
        bytes += size;
        for await (const buffer of createReadStream(path)) hash.update(buffer);
      }
      assert.equal(bytes, file.size, file.path);
      assert.equal(
        hash.digest("hex"),
        file.sha256,
        `Reconstruction differs: ${file.path}`,
      );
    }
  });
}

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const base = "https://cdn.jsdelivr.net/gh/web-ports/jsab@main/";
const source = await readFile(
  new URL("../static/misc/just-shapes-and-beats/load.js", import.meta.url),
  "utf8",
);

// Runs load.js against stubs and returns the Module that Unity 2019's
// UnityLoader.instantiate would build: option overrides first, then build JSON
// keys only where still undefined.
async function instantiate() {
  const blobs = new Map();
  let instantiated;
  const done = new Promise((resolve, reject) => {
    const context = {
      URL,
      Blob,
      document: { baseURI: base },
      XMLHttpRequest: class {
        open() {}
      },
      fetch: async () => ({
        json: async () => ({ dataUrl: "jsab.data.unityweb" }),
      }),
      GameLoader: {
        prepare() {},
        merge: async (paths) => `blob:merged/${paths[0]}`,
        script: async () => {},
        objectUrl(blob) {
          const url = `blob:config/${blobs.size}`;
          blobs.set(url, blob);
          return url;
        },
        finish() {},
        fail: reject,
      },
      UnityLoader: {
        instantiate(container, url, options) {
          instantiated = { url, options };
          resolve();
        },
      },
    };
    vm.runInNewContext(source, context);
  });
  await done;
  const module = { ...instantiated.options.Module };
  const json = JSON.parse(await blobs.get(instantiated.url).text());
  for (const key in json)
    if (typeof module[key] === "undefined") module[key] = json[key];
  return module;
}

test("just-shapes-and-beats: streamingAssetsUrl is callable by the Unity 2019 framework", async () => {
  const module = await instantiate();
  // The framework runs Module.streamingAssetsUrl() during startup; a string
  // here throws and leaves the loading screen up forever.
  assert.equal(typeof module.streamingAssetsUrl, "function");
  assert.equal(module.streamingAssetsUrl(), `${base}StreamingAssets`);
});

test("just-shapes-and-beats: merged build files reach the Unity module", async () => {
  const module = await instantiate();
  assert.equal(module.dataUrl, "blob:merged/Build/jsab.data.unityweb.part1");
  assert.equal(
    module.wasmCodeUrl,
    "blob:merged/Build/jsab.wasm.code.unityweb.part1",
  );
  assert.equal(
    module.wasmFrameworkUrl,
    "blob:merged/Build/jsab.wasm.framework.unityweb",
  );
});

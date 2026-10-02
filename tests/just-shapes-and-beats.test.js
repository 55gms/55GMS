import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const base = "https://cdn.jsdelivr.net/gh/web-ports/jsab@main/";
const source = await readFile(
  new URL("../static/misc/just-shapes-and-beats/load.js", import.meta.url),
  "utf8",
);

// Runs load.js against stubs and returns what it handed UnityLoader.instantiate
// along with the XMLHttpRequest class it patched.
async function instantiate() {
  let instantiated;
  class XMLHttpRequest {
    open(method, url) {
      this.opened = url;
    }
  }
  const done = new Promise((resolve, reject) => {
    const context = {
      URL,
      Blob,
      document: { baseURI: base },
      XMLHttpRequest,
      GameLoader: {
        prepare() {},
        merge: async (paths) => `blob:merged/${paths[0]}`,
        script: async () => {},
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
  return { ...instantiated, XMLHttpRequest };
}

function opened(XMLHttpRequest, url) {
  const request = new XMLHttpRequest();
  request.open("GET", url);
  return request.opened;
}

test("just-shapes-and-beats: Unity starts from the port's own build config", async () => {
  const { url, options } = await instantiate();
  // A blob config breaks the loader's relative URLs; a string
  // streamingAssetsUrl throws in the Unity 2019 framework. Use neither.
  assert.equal(url, "Build/jsab.json");
  assert.equal(options.Module.streamingAssetsUrl, undefined);
});

test("just-shapes-and-beats: split files are redirected to their merged copies", async () => {
  const { XMLHttpRequest } = await instantiate();
  assert.equal(
    opened(XMLHttpRequest, "Build/jsab.data.unityweb"),
    "blob:merged/Build/jsab.data.unityweb.part1",
  );
  assert.equal(
    opened(XMLHttpRequest, "Build/jsab.wasm.code.unityweb"),
    "blob:merged/Build/jsab.wasm.code.unityweb.part1",
  );
  assert.match(
    opened(
      XMLHttpRequest,
      `${base}StreamingAssets/aa/WebGL/fonts_tmp_assets_all_c2712a523e390d12249a703a5257c93b.bundle`,
    ),
    /^blob:merged\/StreamingAssets/,
  );
  assert.equal(
    opened(XMLHttpRequest, "Build/jsab.wasm.framework.unityweb"),
    "Build/jsab.wasm.framework.unityweb",
  );
});

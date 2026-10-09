import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { getStaticCacheControl } from "./httpPerformance.js";

const require = createRequire(import.meta.url);
const packageDir = (name) => dirname(require.resolve(name));

// Each bundle is published under a neutral URL: the browser never requests a
// path that names the package it came from, and nothing else in those
// package directories is reachable.
export const proxyAssetFiles = {
  "/assets/lib/vendor-core.js": join(scramjetPath, "scramjet.js"),
  "/assets/lib/vendor-core.wasm": join(scramjetPath, "scramjet.wasm"),
  "/assets/lib/vendor-frame.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.api.js",
  ),
  "/assets/lib/vendor-page.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.inject.js",
  ),
  "/assets/lib/vendor-worker.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.sw.js",
  ),
  "/assets/lib/vendor-util.js": join(
    packageDir("@mercuryworkshop/scramjet-utils"),
    "scramjet-utils.js",
  ),
  "/assets/lib/vendor-net.js": join(
    packageDir("@mercuryworkshop/epoxy-transport"),
    "index.js",
  ),
};

export function mountProxyAssets(app) {
  for (const [route, file] of Object.entries(proxyAssetFiles)) {
    // The cache header goes on through sendFile so it is only set when the
    // file is actually sent: set up front, it would also ride along on the 404
    // for a missing file, and browsers would keep that 404 for a day.
    const headers = { "Cache-Control": getStaticCacheControl(file) };
    app.get(route, (req, res, next) => {
      res.sendFile(file, { headers }, (err) => err && next(err));
    });
  }
}

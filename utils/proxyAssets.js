import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { setStaticCacheHeaders } from "./httpPerformance.js";

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
    app.get(route, (req, res, next) => {
      setStaticCacheHeaders(res, file);
      res.sendFile(file, (err) => err && next(err));
    });
  }
}

import express from "express";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { staticOptions } from "./httpPerformance.js";

const require = createRequire(import.meta.url);

export const proxyAssetPaths = {
  "/scram": scramjetPath,
  "/controller": dirname(
    require.resolve("@mercuryworkshop/scramjet-controller"),
  ),
  "/scramjet-utils": dirname(
    require.resolve("@mercuryworkshop/scramjet-utils"),
  ),
  "/epoxy": dirname(require.resolve("@mercuryworkshop/epoxy-transport")),
};

export function mountProxyAssets(app) {
  for (const [route, directory] of Object.entries(proxyAssetPaths)) {
    app.use(route, express.static(directory, staticOptions));
  }
}

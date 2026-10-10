// Where a game's files are. This repo keeps only the pages
// (static/misc/<folder>/*.html); everything else lives in a clone of
// 55gms/assets under misc/<folder>/, which is what jsDelivr serves.
// The clone is expected next to this repo; ASSETS_REPO points elsewhere.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const assetsRepo = path.resolve(
  process.env.ASSETS_REPO || path.join(root, "../assets"),
);
export const isPage = (file) => /\.html?$/i.test(file);
export const pagesDir = (folder) => path.join(root, "static/misc", folder);
export const filesDir = (folder) => path.join(assetsRepo, "misc", folder);

export function requireAssetsRepo() {
  if (fs.existsSync(path.join(assetsRepo, "misc"))) return;
  console.error(
    `No 55gms/assets clone at ${assetsRepo}.\n` +
      "Clone https://github.com/55gms/assets next to this repo, or set ASSETS_REPO.",
  );
  process.exit(1);
}

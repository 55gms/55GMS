// Refreshes the cache-busting ?v= tag on the shared game loading assets.
//
//   node scripts/bump-loader-version.js
//
// Static .js/.css/images are cached for a day while game pages are not, so a
// page must name a new URL whenever a loader asset changes. The tag is a hash
// of those assets: run this after editing any of them and commit the result.
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI = "static/assets/js/loader-ui.js";
const ASSETS = [
  UI,
  "static/assets/js/game-loader.js",
  "static/assets/js/unity-cdn-loader.js",
  "static/assets/js/unity-cdn-assets.js",
  "static/assets/js/unity-loading.js",
  "static/assets/css/loader-ui.css",
  "static/assets/css/game-loader.css",
  "static/assets/css/unity-cdn-loader.css",
  "static/img/55gms.png",
];
const TAGGED =
  /(\/assets\/(?:js|css)\/(?:loader-ui|game-loader|unity-cdn-loader|unity-loading)\.(?:js|css))(?:\?v=\w+)?(?=["'])/g;
const CONSTANT = /(const VERSION = ")\w+(")/;

const read = (file) => fs.readFileSync(path.join(root, file));
const hash = createHash("sha256");
for (const file of ASSETS) {
  // Leave the tags themselves out so the hash does not depend on itself.
  const text = file.endsWith(".png")
    ? read(file)
    : read(file).toString().replace(TAGGED, "$1").replace(CONSTANT, "$1$2");
  hash.update(file).update(text);
}
const version = BigInt(`0x${hash.digest("hex")}`)
  .toString(36)
  .slice(0, 10);

const pages = fs
  .readdirSync(path.join(root, "static/misc"))
  .map((folder) => `static/misc/${folder}/index.html`)
  .filter((file) => fs.existsSync(path.join(root, file)));
let changed = 0;
for (const file of [...pages, ...ASSETS.filter((f) => f.endsWith(".js"))]) {
  const before = read(file).toString();
  // loader-ui.js appends the tag itself, from VERSION.
  const after =
    file === UI
      ? before.replace(CONSTANT, `$1${version}$2`)
      : before.replace(TAGGED, `$1?v=${version}`);
  if (after === before) continue;
  fs.writeFileSync(path.join(root, file), after);
  changed += 1;
}
console.log(`Loader version ${version}: updated ${changed} file(s).`);

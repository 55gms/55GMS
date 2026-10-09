import {
  mkdir,
  rm,
  readdir,
  readlink,
  lstat,
  symlink,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepare } from "./build/prepare.js";
import { makeSecrets } from "./build/secrets.js";
import { obfuscateScripts } from "./build/javascript.js";
import { encodeCatalogue } from "./build/catalogue.js";
import { transformHtml } from "./build/html.js";
import { versionAssets } from "./build/asset-version.js";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(ROOT, "static");
const DIST = path.join(ROOT, "dist");
const BUILDS = path.join(DIST, "builds");
const KEEP_BUILDS = 3;
// A build directory is named by its id (secrets.js: 8 random bytes as hex).
const BUILD_ID = /^[0-9a-f]{16}$/;

// Remove all but the newest KEEP_BUILDS builds. Runs after the dist/current
// swap, so the new build is already live: nothing here may fail the build.
//
// Age is the build directory's mtime, not its name: ids are random, so sorting
// by name would remove an arbitrary build, the new one included. The mtime is
// set when the manifest is written at the end of a build (or when a failed
// build last wrote into its directory), so it follows creation order without
// changing the id format. The new build and whatever dist/current points at
// are kept regardless of their mtime (a restored or copied directory can carry
// an old one).
async function pruneBuilds(newId) {
  const keep = new Set([newId]);
  try {
    keep.add(path.basename(await readlink(path.join(DIST, "current"))));
  } catch {
    // no dist/current, or it is not a symlink: only the new build is pinned
  }

  const builds = [];
  for (const name of await readdir(BUILDS)) {
    if (!BUILD_ID.test(name)) continue; // not ours: leave it alone
    try {
      const info = await lstat(path.join(BUILDS, name));
      if (info.isDirectory()) builds.push({ name, mtime: info.mtimeMs });
    } catch {
      // vanished while listing
    }
  }
  builds.sort((a, b) => b.mtime - a.mtime || (a.name < b.name ? 1 : -1));

  // The pinned builds count toward the limit, then the newest of the rest.
  let slots = Math.max(0, KEEP_BUILDS - keep.size);
  for (const { name } of builds) {
    if (keep.has(name)) continue;
    if (slots > 0) {
      slots--;
      continue;
    }
    try {
      await rm(path.join(BUILDS, name), { recursive: true, force: true });
    } catch (err) {
      console.warn(
        `[build] could not remove old build ${name}: ${err.message}`,
      );
    }
  }
}

// A build interrupted between symlink() and rename() leaves its temp link.
async function removeStaleTempLinks(exceptName) {
  for (const name of await readdir(DIST)) {
    if (!name.startsWith(".current.") || name === exceptName) continue;
    try {
      await rm(path.join(DIST, name), { force: true });
    } catch (err) {
      console.warn(`[build] could not remove stale ${name}: ${err.message}`);
    }
  }
}

async function main() {
  const secrets = makeSecrets(); // { id, assetVersion, catalogueKey }
  const buildDir = path.join(BUILDS, secrets.id);
  const outStatic = path.join(buildDir, "static");

  await rm(buildDir, { recursive: true, force: true });
  await mkdir(outStatic, { recursive: true });

  await prepare(SRC, outStatic);
  await obfuscateScripts(outStatic);
  await encodeCatalogue(outStatic, secrets.catalogueKey);
  await transformHtml(outStatic);
  await versionAssets(outStatic, secrets.assetVersion);

  await writeFile(
    path.join(buildDir, "manifest.json"),
    JSON.stringify(
      {
        id: secrets.id,
        assetVersion: secrets.assetVersion,
        catalogueKey: secrets.catalogueKey.toString("hex"),
        routes: {},
      },
      null,
      2,
    ),
  );

  // Atomic swap: write a temp symlink, rename it over dist/current.
  const current = path.join(DIST, "current");
  const tmpName = `.current.${secrets.id}`;
  const tmp = path.join(DIST, tmpName);
  await symlink(path.join("builds", secrets.id), tmp);
  await rename(tmp, current);

  // The new build is live from here on; cleanup must not fail the build.
  try {
    await removeStaleTempLinks(tmpName);
    await pruneBuilds(secrets.id);
  } catch (err) {
    console.warn(`[build] cleanup of old builds skipped: ${err.message}`);
  }
  console.log(
    `[build] ${secrets.id} ready (assetVersion ${secrets.assetVersion})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

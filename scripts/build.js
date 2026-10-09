import { existsSync } from "node:fs";
import { mkdir, rm, readdir, symlink, rename, writeFile } from "node:fs/promises";
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

async function main() {
  const secrets = makeSecrets(); // { id, assetVersion, catalogueKey }
  const buildDir = path.join(DIST, "builds", secrets.id);
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
    JSON.stringify({ id: secrets.id, assetVersion: secrets.assetVersion, catalogueKey: secrets.catalogueKey.toString("hex"), routes: {} }, null, 2),
  );

  // Atomic swap: write a temp symlink, rename it over dist/current.
  const current = path.join(DIST, "current");
  const tmp = path.join(DIST, `.current.${secrets.id}`);
  await symlink(path.join("builds", secrets.id), tmp);
  await rename(tmp, current);

  // Keep the 3 newest builds.
  const builds = (await readdir(path.join(DIST, "builds"))).sort();
  for (const old of builds.slice(0, -3)) {
    await rm(path.join(DIST, "builds", old), { recursive: true, force: true });
  }
  console.log(`[build] ${secrets.id} ready (assetVersion ${secrets.assetVersion})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

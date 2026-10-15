// Pins every jsDelivr URL for the 55gms/assets mirror to a commit:
//
//   node scripts/pin-game-assets.js [path to a 55gms/assets clone]
//
// A URL on the moving `@main` makes jsDelivr ask GitHub again and again whether
// the file changed, and when GitHub answers "429: Too Many Requests" jsDelivr
// can cache that page in place of the file. A URL on a commit is fetched once
// and kept for good.
//
// Each game folder is pinned to the last commit that changed misc/<folder>/,
// so its URLs only change when its own files do: re-pinning every folder to
// the newest commit would make jsDelivr fetch the whole mirror from GitHub at
// once. URLs that name no folder take the newest commit on main.
//
// Run it after pushing files to 55gms/assets, and commit the result. Pages
// written with `@main` (new games) are pinned the same way. Without a clone
// path it fetches the mirror's history (no file contents) into a temp folder.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "https://github.com/55gms/assets";
const URL_PATTERN =
  /(cdn\.jsdelivr\.net\/gh\/55gms\/assets@)(main|[0-9a-f]{40})(\/misc\/)([^/"'`\s?#)]*\/)?/g;

const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

let clone = process.argv[2];
let temp;
if (clone) {
  git(clone, "fetch", "--quiet", "origin", "main");
} else {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), "55gms-assets-"));
  clone = path.join(temp, "assets");
  git(
    temp,
    "clone",
    "--quiet",
    "--filter=blob:none",
    "--no-checkout",
    "--single-branch",
    "--branch",
    "main",
    REPO,
    clone,
  );
}

try {
  const head = git(clone, "rev-parse", "origin/main").trim();

  // The first commit seen for a folder, newest first, is its last change.
  const folders = new Map();
  let commit;
  const log = git(
    clone,
    "log",
    "--format=%H",
    "--name-only",
    "origin/main",
    "--",
    "misc",
  );
  for (const line of log.split("\n")) {
    if (/^[0-9a-f]{40}$/.test(line)) commit = line;
    else if (line.startsWith("misc/")) {
      const folder = line.split("/")[1];
      if (!folders.has(folder)) folders.set(folder, commit);
    }
  }

  const files = [
    ...fs
      .readdirSync(path.join(root, "static/misc"), { recursive: true })
      .filter((file) => file.endsWith(".html"))
      .map((file) => path.join("static/misc", file)),
    ...fs
      .readdirSync(path.join(root, "static/assets/json/load"))
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.join("static/assets/json/load", file)),
    "utils/gameAssets.js",
  ];

  let changed = 0;
  const unknown = new Set();
  for (const file of files) {
    const before = fs.readFileSync(path.join(root, file), "utf8");
    const after = before.replace(
      URL_PATTERN,
      (match, start, ref, misc, folder = "") => {
        if (!folder) return `${start}${head}${misc}`;
        let name = folder.slice(0, -1);
        try {
          name = decodeURIComponent(name);
        } catch {}
        const pin = folders.get(name);
        if (!pin) {
          unknown.add(`${name} (${file})`);
          return match;
        }
        return `${start}${pin}${misc}${folder}`;
      },
    );
    if (after === before) continue;
    fs.writeFileSync(path.join(root, file), after);
    changed += 1;
  }

  console.log(
    `Pinned to 55gms/assets commits (newest ${head.slice(0, 7)}): updated ${changed} file(s).`,
  );
  if (unknown.size) {
    console.warn(
      `Left unchanged, no misc/<folder> in 55gms/assets:\n  ${[...unknown].join("\n  ")}`,
    );
  }
} finally {
  if (temp) fs.rmSync(temp, { recursive: true, force: true });
}

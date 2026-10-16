import { readdir, symlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { copyTree } from "./util.js";

// Folders under misc/ that are site code rather than games: they are copied,
// so the later stages can obfuscate them. Every other entry of misc/ is an
// absolute symlink to the live source tree, as misc/ itself used to be.
export const BUILT_MISC = ["media"];

async function linkMisc(from, to) {
  await mkdir(to, { recursive: true });
  for (const entry of await readdir(from)) {
    const src = path.join(from, entry);
    const dst = path.join(to, entry);
    if (BUILT_MISC.includes(entry)) await copyTree(src, dst);
    else await symlink(src, dst);
  }
}

export async function prepare(srcStatic, outStatic) {
  await mkdir(outStatic, { recursive: true });
  for (const entry of await readdir(srcStatic, { withFileTypes: true })) {
    const from = path.join(srcStatic, entry.name);
    const to = path.join(outStatic, entry.name);
    if (entry.name === "misc") {
      await linkMisc(from, to);
    } else if (entry.name === "img") {
      await symlink(from, to); // absolute symlink to the live source tree
    } else if (entry.isDirectory()) {
      await copyTree(from, to);
    } else {
      await copyTree(from, to);
    }
  }
}

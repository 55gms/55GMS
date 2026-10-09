import { readdir, symlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { copyTree } from "./util.js";

const SYMLINK_DIRS = ["misc", "img"];

export async function prepare(srcStatic, outStatic) {
  await mkdir(outStatic, { recursive: true });
  for (const entry of await readdir(srcStatic, { withFileTypes: true })) {
    const from = path.join(srcStatic, entry.name);
    const to = path.join(outStatic, entry.name);
    if (SYMLINK_DIRS.includes(entry.name)) {
      await symlink(from, to); // absolute symlink to the live source tree
    } else if (entry.isDirectory()) {
      await copyTree(from, to);
    } else {
      await copyTree(from, to);
    }
  }
}

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { base64urlXor } from "./util.js";

// The readers' decode, reproduced here so the build fails rather than ship a
// catalogue the browser cannot read.
function decodeLikeReader(b64url) {
  const raw = Buffer.from(b64url, "base64url");
  const out = Buffer.alloc(raw.length - 16);
  for (let i = 0; i < out.length; i++) out[i] = raw[i + 16] ^ raw[i % 16];
  return out;
}

export async function encodeCatalogue(outStatic, catalogueKey) {
  const dir = path.join(outStatic, "assets", "json", "load");
  for (const entry of await readdir(dir)) {
    if (!entry.endsWith(".json")) continue;
    const file = path.join(dir, entry);
    const plain = await readFile(file); // Buffer
    const encoded = base64urlXor(plain, catalogueKey);
    if (!decodeLikeReader(encoded).equals(plain)) {
      throw new Error(`[build] catalogue round-trip failed for ${entry}`);
    }
    if (encoded[0] === "[" || encoded[0] === "{") {
      throw new Error(`[build] encoded ${entry} starts with a JSON char — readers would treat it as plaintext`);
    }
    await writeFile(file, encoded); // same path, plaintext overwritten
  }
}

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { minify } from "terser";
import JavaScriptObfuscator from "javascript-obfuscator";
import { JS_SKIP } from "./util.js";

// script mode: these are classic scripts (no type="module"). renameGlobals
// stays OFF so $, io, frameRuntime.* and inline on* handlers keep resolving.
function obfuscatorOptions(prefix) {
  return {
    target: "browser",
    stringArray: true,
    stringArrayEncoding: ["rc4"],
    stringArrayThreshold: 1,
    splitStrings: true,
    splitStringsChunkLength: 5,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    identifierNamesGenerator: "hexadecimal",
    identifiersPrefix: prefix,
    transformObjectKeys: true,
    renameGlobals: false,
    deadCodeInjection: false,
    selfDefending: false,
    debugProtection: false,
    disableConsoleOutput: false,
  };
}

export async function obfuscateScripts(outStatic) {
  const jsDir = path.join(outStatic, "assets", "js");
  const obfuscated = [];
  const skipped = [];
  for (const entry of await readdir(jsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) { skipped.push(entry.name + "/"); continue; } // sdks/
    if (!entry.name.endsWith(".js")) continue;
    if (JS_SKIP.has(entry.name)) { skipped.push(entry.name); continue; }

    const file = path.join(jsDir, entry.name);
    const src = await readFile(file, "utf8");
    const min = await minify(src, { compress: true, mangle: true });
    if (min.error) throw new Error(`[build] terser failed on ${entry.name}: ${min.error}`);
    const prefix = "_" + entry.name.replace(/[^a-z0-9]/gi, "").slice(0, 6) + "_";
    const out = JavaScriptObfuscator.obfuscate(min.code, obfuscatorOptions(prefix)).getObfuscatedCode();
    await writeFile(file, out);
    obfuscated.push(entry.name);
  }

  // Review-focus guard: the only things skipped must be the known skip-list +
  // the sdks/ dir. A new file that should have been obfuscated fails loudly.
  const expectedSkips = new Set([...JS_SKIP, "sdks/"]);
  const unexpected = skipped.filter((s) => !expectedSkips.has(s));
  if (unexpected.length) throw new Error(`[build] unexpected JS skips: ${unexpected.join(", ")}`);
  const missed = [...JS_SKIP].filter((s) => !skipped.includes(s));
  if (missed.length) throw new Error(`[build] expected-but-missing JS skips (file renamed/removed?): ${missed.join(", ")}`);
  console.log(`[build] obfuscated ${obfuscated.length} scripts, skipped ${skipped.join(", ")}`);
}

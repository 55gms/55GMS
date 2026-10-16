import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { minify } from "terser";
import JavaScriptObfuscator from "javascript-obfuscator";
import { existsSync } from "node:fs";
import { JS_SKIP, SERIALIZED_FN_SCRIPTS, walkFiles } from "./util.js";
import { BUILT_MISC } from "./prepare.js";

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

// Serialization-safe profile for SERIALIZED_FN_SCRIPTS. The transforms that
// pull references out of a function body — the string array and its decoder,
// and control-flow flattening — are OFF, so every function still stringifies
// to self-contained source. Identifier renaming, split strings and
// numbers-to-expressions stay ON, and object keys are left literal so the
// returned frameRuntime.* members keep the names other files look them up by.
function serializedFnObfuscatorOptions(prefix) {
  return {
    target: "browser",
    stringArray: false,
    controlFlowFlattening: false,
    splitStrings: true,
    splitStringsChunkLength: 5,
    numbersToExpressions: true,
    simplify: true,
    identifierNamesGenerator: "hexadecimal",
    identifiersPrefix: prefix,
    transformObjectKeys: false,
    renameGlobals: false,
    deadCodeInjection: false,
    selfDefending: false,
    debugProtection: false,
    disableConsoleOutput: false,
  };
}

export { obfuscatorOptions, serializedFnObfuscatorOptions };

// Most app scripts are classic scripts, but a few (unity-cdn-loader.js and
// unity-cdn-assets.js, loaded with type="module" by game pages) are ES
// modules. A file is parsed as a classic script first, so its top-level names
// are never mangled; only one that does not parse that way (import
// declarations, top-level await) is retried as a module, where top-level
// names are private and exports keep their names. terser accepts a file with
// only `export` declarations in script mode, which leaves its exports intact.
// A real syntax error fails both.
async function minifyScript(src, name) {
  try {
    const min = await minify(src, { compress: true, mangle: true });
    return { code: min.code, isModule: false };
  } catch (scriptErr) {
    try {
      const min = await minify(src, {
        compress: true,
        mangle: true,
        module: true,
      });
      return { code: min.code, isModule: true };
    } catch (moduleErr) {
      throw new Error(
        `[build] terser failed on ${name}: as script: ${scriptErr.message}; as module: ${moduleErr.message}`,
      );
    }
  }
}

function assertModuleSyntax(code, name) {
  if (!/(?:^|[;}\s])(?:import|export)[\s{*"']/.test(code)) {
    throw new Error(`[build] module ${name} lost its import/export statements`);
  }
}

// Minifies and obfuscates one script in place. Returns whether it was parsed
// as an ES module.
async function obfuscateFile(file) {
  const name = path.basename(file);
  const src = await readFile(file, "utf8");
  const { code, isModule } = await minifyScript(src, name);
  const prefix = "_" + name.replace(/[^a-z0-9]/gi, "").slice(0, 6) + "_";
  const options = SERIALIZED_FN_SCRIPTS.has(name)
    ? serializedFnObfuscatorOptions(prefix)
    : obfuscatorOptions(prefix);
  const out = JavaScriptObfuscator.obfuscate(code, options).getObfuscatedCode();
  // A module's import/export statements and top-level await must survive,
  // or the pages that load it with type="module" would break.
  if (isModule) assertModuleSyntax(out, name);
  await writeFile(file, out);
  return isModule;
}

// The scripts of the site-code folders copied into misc/ (prepare.js), such
// as the media player's. A checkout without static/misc (CI) has none.
export async function obfuscateMiscScripts(outStatic) {
  const done = [];
  for (const folder of BUILT_MISC) {
    const dir = path.join(outStatic, "misc", folder);
    if (!existsSync(dir)) continue;
    for await (const file of walkFiles(dir)) {
      if (!file.endsWith(".js")) continue;
      await obfuscateFile(file);
      done.push(path.relative(outStatic, file));
    }
  }
  console.log(
    `[build] obfuscated ${done.length} misc scripts: ${done.join(", ") || "none"}`,
  );
}

export async function obfuscateScripts(outStatic) {
  const jsDir = path.join(outStatic, "assets", "js");
  const obfuscated = [];
  const skipped = [];
  const modules = [];
  for (const entry of await readdir(jsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      skipped.push(entry.name + "/");
      continue;
    } // sdks/
    if (!entry.name.endsWith(".js")) continue;
    if (JS_SKIP.has(entry.name)) {
      skipped.push(entry.name);
      continue;
    }

    const isModule = await obfuscateFile(path.join(jsDir, entry.name));
    if (isModule) modules.push(entry.name);
    obfuscated.push(entry.name);
  }

  // Review-focus guard: the only things skipped must be the known skip-list +
  // the sdks/ dir. A new file that should have been obfuscated fails loudly.
  const expectedSkips = new Set([...JS_SKIP, "sdks/"]);
  const unexpected = skipped.filter((s) => !expectedSkips.has(s));
  if (unexpected.length)
    throw new Error(`[build] unexpected JS skips: ${unexpected.join(", ")}`);
  const missed = [...JS_SKIP].filter((s) => !skipped.includes(s));
  if (missed.length)
    throw new Error(
      `[build] expected-but-missing JS skips (file renamed/removed?): ${missed.join(", ")}`,
    );
  console.log(
    `[build] obfuscated ${obfuscated.length} scripts (${modules.length} parsed as ES modules: ${modules.join(", ") || "none"}), skipped ${skipped.join(", ")}`,
  );
}

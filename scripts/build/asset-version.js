import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { walkFiles } from "./util.js";

// Pinned separately: the proxy bundles carry their package version and the
// game SDKs are third-party files, so neither takes the per-build token.
const EXEMPT = /^\/assets\/(?:lib\/vendor-|js\/sdks\/)/;

// A reference to an /assets/*.js or *.css file, with its query string if any.
//  - the path is lazy and must end at a real extension boundary, so
//    `/assets/json/load/g.json` and `/assets/js/a.js.map` are not mistaken for
//    a `.js` reference (a greedy match would backtrack into `g.js` + `on`);
//  - `<>` end the path and the query, so a tag boundary is never swallowed;
//  - the query may not end in sentence punctuation, so a reference that ends
//    a comment sentence (`... /assets/js/x.js.`) keeps its full stop outside.
const REF =
  /(\/assets\/[^\s"'`()<>?#]+?\.(?:js|css))(?![\w-]|\.\w)(\?[^\s"'`()<>#]*[^\s"'`()<>#.,;:])?/g;

export async function versionAssets(outStatic, assetVersion) {
  if (!/^[\w.-]+$/.test(assetVersion ?? "")) {
    throw new Error(`[build] invalid assetVersion: ${assetVersion}`);
  }
  const want = `?v=${assetVersion}`;
  const jsDir = path.join(outStatic, "assets", "js");

  // Built pages anywhere in the tree, plus the app scripts directly in
  // assets/js (not the vendored SDKs below it). walkFiles does not follow the
  // misc/img symlinks.
  const targets = [];
  for await (const f of walkFiles(outStatic)) {
    if (f.endsWith(".html") || (f.endsWith(".js") && path.dirname(f) === jsDir)) {
      targets.push(f);
    }
  }

  let found = 0;
  let rewritten = 0;
  let verified = 0;
  for (const f of targets) {
    const rel = path.relative(outStatic, f);
    const src = await readFile(f, "utf8");

    for (const m of src.matchAll(REF)) {
      if (!EXEMPT.test(m[1])) found++;
    }

    // Any existing query is an old cache-buster (`?v=7`, `?betav3`); it is
    // replaced outright so the token is never doubled.
    const out = src.replace(REF, (whole, url) => {
      if (EXEMPT.test(url)) return whole;
      rewritten++;
      return url + want;
    });
    if (out !== src) await writeFile(f, out);

    // Guard: re-scan what was written. Every non-exempt reference must now
    // carry exactly our token.
    for (const m of out.matchAll(REF)) {
      if (EXEMPT.test(m[1])) continue;
      if (m[2] !== want) {
        throw new Error(`[build] un-versioned asset ref in ${rel}: ${m[0]}`);
      }
      verified++;
    }
  }

  if (found !== rewritten || found !== verified) {
    throw new Error(
      `[build] asset-version count mismatch: found ${found}, rewrote ${rewritten}, verified ${verified}`,
    );
  }
  console.log(
    `[build] versioned ${rewritten} asset references at ${want} in ${targets.length} files`,
  );
}

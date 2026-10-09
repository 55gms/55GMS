import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { getStaticCacheControl } from "./httpPerformance.js";

const require = createRequire(import.meta.url);
const packageDir = (name) => dirname(require.resolve(name));

// Each bundle is published under a neutral URL: the browser never requests a
// path that names the package it came from, and nothing else in those
// package directories is reachable.
export const proxyAssetFiles = {
  "/assets/lib/vendor-core.js": join(scramjetPath, "scramjet.js"),
  "/assets/lib/vendor-core.wasm": join(scramjetPath, "scramjet.wasm"),
  "/assets/lib/vendor-frame.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.api.js",
  ),
  "/assets/lib/vendor-page.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.inject.js",
  ),
  "/assets/lib/vendor-worker.js": join(
    packageDir("@mercuryworkshop/scramjet-controller"),
    "controller.sw.js",
  ),
  "/assets/lib/vendor-util.js": join(
    packageDir("@mercuryworkshop/scramjet-utils"),
    "scramjet-utils.js",
  ),
  "/assets/lib/vendor-net.js": join(
    packageDir("@mercuryworkshop/epoxy-transport"),
    "index.js",
  ),
};

// The core tags frame URLs with request metadata as a readable query string,
// e.g. `?$io=https://example.com`, which spells out the site being visited.
// These edits pack that query into one `?_=<token>` parameter using the same
// codec as the path, and unpack it where the core reads it back. Each anchor
// must match exactly once, so a core upgrade that moves them fails at startup
// instead of quietly serving readable URLs again.
const UNPACK = (params, context, known) =>
  `(()=>{let P=new URLSearchParams([...${params}.entries()]),V=P.get("_");` +
  `if(V)try{let D=new URLSearchParams(${context}.interface.codecDecode(V)),` +
  `N=[...D.keys()];if(N.length&&N.every(k=>${known})){P.delete("_");` +
  `for(let[k,v]of D)P.set(k,v)}}catch{}return P})()`;

const coreEdits = [
  // Building a frame URL.
  [
    'let g="";return c.toString()&&(g="?"+c.toString()),',
    'let g="";return c.toString()&&(g="?_="+t.interface.codecEncode(c.toString())),',
  ],
  // Reading the metadata back off a frame request.
  [
    '}(e.rawUrl.searchParams);a.search=""',
    `}(${UNPACK("e.rawUrl.searchParams", "t.context", "Object.hasOwn(A,k)")});a.search=""`,
  ],
  // Redirects add more metadata to an already-built frame URL: fold it into
  // the packed parameter.
  [
    'b.set("location",o.href)',
    'b.set("location",(()=>{let K=Object.values(s.QP),' +
      `Q=${UNPACK("o.searchParams", "e.context", "K.includes(k)")},R=new URLSearchParams;` +
      "for(let k of K){let v=Q.get(k);null!==v&&R.set(k,v);o.searchParams.delete(k)}" +
      'o.searchParams.delete("_");' +
      'R.toString()&&o.searchParams.set("_",e.context.interface.codecEncode(R.toString()));' +
      "return o.href})())",
  ],
];

export function packFrameQuery(source) {
  for (const [find, replace] of coreEdits) {
    if (source.split(find).length !== 2)
      throw new Error(`Proxy core changed; cannot find: ${find}`);
    source = source.replace(find, () => replace);
  }
  return source;
}

const proxyAssetEdits = {
  "/assets/lib/vendor-core.js": packFrameQuery,
};

export function mountProxyAssets(app) {
  for (const [route, file] of Object.entries(proxyAssetFiles)) {
    // The cache header goes on through sendFile so it is only set when the
    // file is actually sent: set up front, it would also ride along on the 404
    // for a missing file, and browsers would keep that 404 for a day.
    const headers = { "Cache-Control": getStaticCacheControl(file) };
    const edit = proxyAssetEdits[route];
    let body;
    if (edit) {
      let source;
      try {
        source = readFileSync(file, "utf8");
      } catch (err) {
        // A missing file falls through to sendFile and its 404.
        if (err.code !== "ENOENT") throw err;
      }
      if (source !== undefined) body = Buffer.from(edit(source));
    }
    app.get(route, (req, res, next) => {
      if (body) return res.set(headers).type("js").send(body);
      res.sendFile(file, { headers }, (err) => err && next(err));
    });
  }
}

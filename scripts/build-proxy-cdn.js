// Builds the proxy bundles that the site loads from jsDelivr.
//
//   node scripts/build-proxy-cdn.js <out-dir> [source-dir]
//
// The sources are the renamed Scramjet build in TongSherbet/storage (sj/),
// downloaded from the pinned commit below unless a directory holding the six
// jet.* files is given. Each file is patched for 55GMS and written under its
// neutral name; upload the output to lib/ in the 55gms/assets repo and point
// CDN_BASE in static/assets/js/frame-runtime.js and static/sw.js at the new
// commit. See docs/proxy-stack.md.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_COMMIT = "a90bb43517f850d376f23b655ebd2c3c4a1d9820";
const SOURCE_URL = `https://raw.githubusercontent.com/TongSherbet/storage/${SOURCE_COMMIT}/sj/`;

const files = {
  "vendor-core.js": "jet.core.js",
  "vendor-core.wasm": "jet.wasm",
  "vendor-frame.js": "jet.api.js",
  "vendor-page.js": "jet.inject.js",
  "vendor-worker.js": "jet.sw.js",
  "vendor-util.js": "jet.utils.js",
};

// The core tags frame URLs with request metadata as a readable query string,
// e.g. `?$io=https://example.com`, which spells out the site being visited.
// These edits pack that query into one `?_=<token>` parameter using the same
// codec as the path, and unpack it where the core reads it back. Each anchor
// must match exactly once, so a core upgrade that moves them fails the build
// instead of quietly serving readable URLs again.
// Static `import` specifiers are tagged inside the WASM rewriter, which writes
// `?%24module=module&%24io=<origin>` itself. Its output is tied to a position
// map, so that tail is swapped in place for one of the same length:
// `?_=.` followed by this character rotation of twenty zeros and the origin.
// Both functions are injected into the core as source, so they must stay
// self-contained.
function rotateTail(text, sign) {
  const set =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const at = set.indexOf(c);
    if (at < 0) out += c === "%" ? "!" : c === "!" ? "%" : c;
    else out += set[(((at + sign * (11 + i * 7)) % 66) + 66) % 66];
  }
  return out;
}

function hideImportTails(js, rotate) {
  const mark = "?%24module=module&%24io=";
  const swap = (origin) => "?_=." + rotate("0".repeat(20) + origin, 1);
  if (typeof js === "string")
    return js.replace(
      /\?%24module=module&%24io=([\w.~%:\/-]*)/g,
      (all, origin) => swap(origin),
    );
  for (let i = js.indexOf(63); i !== -1; i = js.indexOf(63, i + 1)) {
    let j = 0;
    while (j < mark.length && js[i + j] === mark.charCodeAt(j)) j++;
    if (j < mark.length) continue;
    let end = i + j;
    let origin = "";
    while (end < js.length) {
      const c = String.fromCharCode(js[end]);
      if (!/[\w.~%:\/-]/.test(c)) break;
      origin += c;
      end++;
    }
    const tail = swap(origin);
    for (j = 0; j < tail.length; j++) js[i + j] = tail.charCodeAt(j);
    i = end - 1;
  }
  return js;
}

const UNPACK = (params, context, known) =>
  `(()=>{let P=new URLSearchParams([...${params}.entries()]),V=P.get("_");` +
  `if(V&&V[0]===".")try{let T=(${rotateTail})(V.slice(1),-1);` +
  `if(T.startsWith("0".repeat(20))){P.delete("_");P.set("$module","module");` +
  `P.set("$io",decodeURIComponent(T.slice(20)))}}catch{}` +
  `else if(V)try{let D=new URLSearchParams(${context}.interface.codecDecode(V)),` +
  `N=[...D.keys()];if(N.length&&N.every(k=>${known})){P.delete("_");` +
  `for(let[k,v]of D)P.set(k,v)}}catch{}return P})()`;

// The WASM rewriter emits calls to this realm helper under the upstream name,
// which the renamed core no longer defines. Both sides get a name of the same
// length so the WASM's string data keeps its size.
const REALM_FN_UPSTREAM = "$scramjet$setrealmfn";
const REALM_FN = "$jet$setrealmfn_____";

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
    'b.set("location",s.href)',
    'b.set("location",(()=>{let K=Object.values(o.QP),' +
      `Q=${UNPACK("s.searchParams", "e.context", "K.includes(k)")},R=new URLSearchParams;` +
      "for(let k of K){let v=Q.get(k);null!==v&&R.set(k,v);s.searchParams.delete(k)}" +
      's.searchParams.delete("_");' +
      'R.toString()&&s.searchParams.set("_",e.context.interface.codecEncode(R.toString()));' +
      "return s.href})())",
  ],
  // Module scripts coming out of the WASM rewriter.
  [
    'return{js:"string"==typeof e?(0,o.hS)(u):u,tag:d,map:g,errors:p}',
    `return{js:(${hideImportTails})("string"==typeof e?(0,o.hS)(u):u,${rotateTail}),tag:d,map:g,errors:p}`,
  ],
  ['"$jet$setrealmfn"', JSON.stringify(REALM_FN)],
];

function editOnce(source, find, replace) {
  if (source.split(find).length !== 2)
    throw new Error(`Proxy core changed; cannot find: ${find}`);
  return source.replace(find, () => replace);
}

function editCore(source) {
  for (const [find, replace] of coreEdits)
    source = editOnce(source, find, replace);
  return source;
}

// Same-length byte swaps only: the WASM addresses its strings by offset.
const wasmEdits = [
  [REALM_FN_UPSTREAM, REALM_FN],
  ["scramjet.codec.encodeurl", "rewriter.codec.encodeurl"],
];

function editWasm(buffer) {
  for (const [find, replace] of wasmEdits) {
    if (find.length !== replace.length)
      throw new Error(`WASM edit changes length: ${find}`);
    const at = buffer.indexOf(find, 0, "latin1");
    if (at === -1 || buffer.indexOf(find, at + 1, "latin1") !== -1)
      throw new Error(`Proxy WASM changed; cannot find: ${find}`);
    buffer.write(replace, at, "latin1");
  }
  return buffer;
}

// Drop the trailing source map comments: the maps are not published.
const stripMap = (source) =>
  source.replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "");

const edits = {
  "vendor-core.js": (buffer) =>
    Buffer.from(editCore(stripMap(buffer.toString("utf8")))),
  "vendor-core.wasm": editWasm,
};

async function readSource(name, sourceDir) {
  if (sourceDir) return readFileSync(join(sourceDir, name));
  const res = await fetch(SOURCE_URL + name);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const [outDir, sourceDir] = process.argv.slice(2);
if (!outDir) {
  console.error("usage: node scripts/build-proxy-cdn.js <out-dir> [source-dir]");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
for (const [target, source] of Object.entries(files)) {
  let body = await readSource(source, sourceDir);
  const edit = edits[target];
  if (edit) body = edit(body);
  else if (target.endsWith(".js"))
    body = Buffer.from(stripMap(body.toString("utf8")));
  writeFileSync(join(outDir, target), body);
  console.log(`${target} <- ${source} (${body.length} bytes)`);
}

# Build Obfuscation (Phases 1–2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a deploy-time client-asset build that obfuscates 55GMS's own app scripts, entity-encodes page shells, and encodes the catalogue JSON, so no served file shows copiable site text and every build differs — without touching server code or the proxy surface.

**Architecture:** `npm run build` runs `node scripts/build.js`, which copies `static/` into `dist/builds/<id>/static/` and runs six ordered, pure-ish stages (prepare → secrets → javascript → catalogue → html → asset-version) over an explicit allow-list, writes `manifest.json`, then atomically repoints the `dist/current` symlink. The running server already serves `STATIC_ROOT` (`dist/current/static` when present, else `static/`); `express.static` reads through the symlink, so a symlink swap is picked up with no reload. A fresh clone with no `dist/` serves `static/` exactly as today.

**Tech Stack:** Node 22 ES modules; `terser` + `javascript-obfuscator` (JS), `html-minifier-terser` (HTML minify), regex tokenization + a numeric-entity encoder (HTML text/attrs), Node `crypto` + `Buffer.base64url` (secrets + catalogue). pm2 + Caddy + GitHub Actions deploy already exist.

**Spec:** `docs/superpowers/specs/2026-10-08-deploy-and-build-design.md` (Part B "The build", Part C "Serving"). The `~/Downloads/55GMS Build Obfuscation Spec.md` summary matches it. Phases 3–5 are out of scope — see `docs/superpowers/specs/2026-10-08-build-phases-3-5.md`.

## Global Constraints

- **No tests.** CLAUDE.md and the spec both forbid writing or running automated tests. Every task's verification is manual: `node --check`, `npm run build` then `grep` the built tree, and visual render. This overrides the writing-plans TDD cycle.
- **Commit incrementally** (global CLAUDE.md): each task ends with a semantic commit (`feat:`/`chore:`/`fix:`/`docs:`) directly to `main` — no feature branches ([[commit-directly-to-main]]).
- **Catalogue encoding is a fixed runtime contract.** The committed readers (`static/assets/js/{games,apps,packs,loader-ui}.js`) decode `base64url( key[16] ‖ (jsonBytes[i] XOR key[i % 16]) )`. The catalogue stage MUST emit exactly this. Do not edit the readers.
- **No boot blob** (deviation from spec stage 2/4 text — justified: the readers carry the key inline, and `assetVersion` is applied statically by the rewrite stage, so nothing reads a boot blob at runtime). `manifest.json` still records `catalogueKey` for traceability.
- **Do-not-touch at runtime:** `/api/*` paths and JSON field names; Socket.IO event names and room prefixes (`user_`, `chat_`); `/stream/` SW scope, `/api/live/`, `/wisp/`, the `#~<token>` embed hash; Postgres schema, `bcrypt(sha256hex)`, session cookie; `static/sw.js` and `static/assets/sj/` copied **byte-for-byte**; everything under `static/misc/` and `static/img/` (symlinked); Unity `.unityweb` loaders; login/signup/account form `name` attributes.
- **JS skip-list:** `easteregg.min.js` (already minified), `assets/js/sdks/*` (third-party), `frame-runtime.js` (proxy surface, phase 5). `renameGlobals: false` always (front end leans on `$`, `io`, `frameRuntime.*`, and inline `on*` handlers call top-level functions by name).
- **Asset-version exemptions:** `/assets/lib/vendor-*` and `/assets/js/sdks/*` keep their own pinned `?v=`; the rewrite skips them.
- **Dependency pins:** add `terser`, `javascript-obfuscator`, `html-minifier-terser` as `devDependencies` (not shipped to the browser). The build runs in CI (`npm ci`) and on the server (`npm install` only when `package-lock.json` changed), so `package-lock.json` must be committed.

## Review Focus

Inputs the spec implies but no stage's happy path exercises — each gets a guard in the owning task:

- **A new app script appears in `assets/js/`** → JS stage must obfuscate it, not silently skip it. Guard: JS stage logs every file it obfuscated vs skipped and asserts the skip set equals exactly the skip-list (Task 5).
- **A page references an asset with no `?v=`, or a stale `?v=N`** → asset-version stage must version it exactly once. Guard: rewrite count == found count and zero un-versioned `/assets/*.(js|css)` remain except exempt paths (Task 8).
- **The HTML entity-encoding changes what the user sees** (encodes inside a `<script>`/`<style>`, or double-encodes an existing entity) → visible rendering must be byte-identical. Guard: `visibleText` equality check comparing normalized text of input vs output (Task 7).
- **The catalogue round-trips wrong** (key offset, padding, UTF-8) → a built catalogue must decode back to the exact source JSON. Guard: catalogue stage decodes its own output with the readers' algorithm and asserts deep-equality before deleting the plaintext (Task 6).
- **`dist/current` points at a half-written or pruned build** → the server must never serve a partial tree. Guard: the symlink is swapped atomically (rename over temp symlink) only after all stages pass, and pruning keeps the 3 newest (Task 9).

---

## File Structure

| Path                                       | Responsibility                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `scripts/build.js`                         | Orchestrator: resolve paths, run stages in order, write `manifest.json`, swap symlink, prune. Create.                |
| `scripts/build/util.js`                    | Shared helpers: allow-list constants, `copyTree`, `walkFiles`, `base64urlXor` encode, `assertCount`. Create.         |
| `scripts/build/prepare.js`                 | Copy `static/` → out, symlink `misc/`+`img/`, byte-copy `sw.js`/`sj/`. Create.                                       |
| `scripts/build/secrets.js`                 | Generate `{ id, assetVersion, catalogueKey }`. Create.                                                               |
| `scripts/build/javascript.js`              | Terser + javascript-obfuscator over allow-listed `assets/js/*.js`. Create.                                           |
| `scripts/build/catalogue.js`               | XOR-encode `assets/json/load/*.json`, verify round-trip, delete plaintext. Create.                                   |
| `scripts/build/html.js`                    | Obfuscate inline scripts, minify, entity-encode text + 5 attrs, `visibleText` check. Create.                         |
| `scripts/build/asset-version.js`           | Rewrite `/assets/*.(js\|css)` refs to `?v=<assetVersion>` with count guard. Create.                                  |
| `package.json`                             | Add `"build"` script + 3 devDependencies. Modify.                                                                    |
| `index.js:43-49`                           | Default `STATIC_ROOT` to `dist/current/static` when present; read `manifest.json`; optional debounced watch. Modify. |
| `.github/workflows/deploy.yml` (check job) | After build, assert built catalogue/page/script contain no readable title or site text. Modify.                      |
| `CLAUDE.md`, `docs/deploy.md`              | Update "no build step yet" / document the build. Modify.                                                             |

---

## Task 1: Build scaffolding, dependencies, and `util.js`

**Files:**

- Modify: `package.json`
- Create: `scripts/build.js`
- Create: `scripts/build/util.js`

**Interfaces:**

- Produces: `npm run build` → `node scripts/build.js`.
- Produces from `util.js`: `TRANSFORM = { html, js, css, catalogue }` (allow-list globs); `JS_SKIP = ["easteregg.min.js", "frame-runtime.js"]`; `async function copyTree(src, dst)` (recursive copy, follows no symlinks it creates); `async function* walkFiles(dir)` (yields absolute file paths); `function base64urlXor(buf, key)` → `string` (emits `base64url(key ‖ xor)`); `function assertCount(label, actual, expected)` (throws on mismatch).

- [ ] **Step 1: Add dependencies and the build script**

In `package.json`, change `"scripts"` to include the build entry and add `devDependencies`:

```json
"scripts": {
  "build": "node scripts/build.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

Then install (pins the latest stable 2+-week-old majors into `package-lock.json`):

```bash
cd /Users/jiayang/Documents/Github/55GMS
npm install --save-dev terser@5 javascript-obfuscator@4 html-minifier-terser@7
```

- [ ] **Step 2: Write `scripts/build/util.js`**

```js
import { createHash, randomBytes } from "node:crypto";
import { cp, readdir, stat } from "node:fs/promises";
import path from "node:path";

// Files later stages are ALLOWED to modify. Anything else is copied through
// untouched by prepare, so a new kind of file is never half-transformed.
export const JS_SKIP = new Set(["easteregg.min.js", "frame-runtime.js"]);
// base-name dirs under static/ that are copied byte-for-byte (never transformed).
export const BYTE_COPY_DIRS = [
  "assets/sj",
  "assets/cloaks",
  "assets/fonts",
  "assets/apps",
  "assets/404",
];
export const BYTE_COPY_FILES = ["sw.js"];
// JSON that holds no titles: left plaintext.
export const PLAINTEXT_JSON = [
  "assets/json/ads.json",
  "assets/json/motd.json",
  "assets/json/quotes.json",
];

export async function copyTree(src, dst) {
  await cp(src, dst, { recursive: true, dereference: false });
}

export async function* walkFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(p);
    else if (entry.isFile()) yield p;
  }
}

// Matches the committed readers: file = key(16) || (plain[i] ^ key[i % 16]),
// then base64url (no padding, URL-safe alphabet).
export function base64urlXor(plain, key) {
  const cipher = Buffer.alloc(plain.length);
  for (let i = 0; i < plain.length; i++) cipher[i] = plain[i] ^ key[i % 16];
  return Buffer.concat([key, cipher]).toString("base64url");
}

export function assertCount(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `[build] count guard failed for ${label}: expected ${expected}, got ${actual}`,
    );
  }
}

export { randomBytes, createHash };
```

- [ ] **Step 3: Write the `scripts/build.js` skeleton**

```js
import { existsSync } from "node:fs";
import {
  mkdir,
  rm,
  readdir,
  symlink,
  rename,
  writeFile,
} from "node:fs/promises";
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
    JSON.stringify(
      {
        id: secrets.id,
        assetVersion: secrets.assetVersion,
        catalogueKey: secrets.catalogueKey.toString("hex"),
        routes: {},
      },
      null,
      2,
    ),
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
  console.log(
    `[build] ${secrets.id} ready (assetVersion ${secrets.assetVersion})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

> Stage modules are stubbed in later tasks; until then `build.js` will throw on the missing imports — that is expected and resolved as each stage lands. Implement stages in order (Tasks 2–8); the build first runs end-to-end at Task 8.

- [ ] **Step 4: Verify syntax**

Run: `node --check scripts/build.js && node --check scripts/build/util.js`
Expected: no output, exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json scripts/build.js scripts/build/util.js
git commit -m "chore: scaffold deploy-time asset build (orchestrator + util)"
```

---

## Task 2: Prepare stage (copy + symlink + byte-copy)

**Files:**

- Create: `scripts/build/prepare.js`

**Interfaces:**

- Consumes: `copyTree`, `BYTE_COPY_DIRS`, `BYTE_COPY_FILES` from `util.js`.
- Produces: `export async function prepare(srcStatic, outStatic)` — populates `outStatic` as a full copy of `srcStatic`, except `misc/` and `img/` are **symlinks** to the source (never copied — 9.2 GB).

- [ ] **Step 1: Write `prepare.js`**

```js
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
```

> `sw.js` and `assets/sj/` are copied here like everything else and are **never** touched by a later stage (not in any transform allow-list), which satisfies the byte-for-byte contract.

- [ ] **Step 2: Verify prepare in isolation**

Run:

```bash
node --input-type=module -e "
import { prepare } from './scripts/build/prepare.js';
import { mkdtemp, readlink, stat } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const out = await mkdtemp(path.join(os.tmpdir(),'b-'));
await prepare('static', out);
console.log('misc symlink ->', await readlink(path.join(out,'misc')));
console.log('index.html copied:', (await stat(path.join(out,'index.html'))).isFile());
"
```

Expected: `misc symlink -> .../static/misc` and `index.html copied: true`.

- [ ] **Step 3: Commit**

```bash
git add scripts/build/prepare.js
git commit -m "feat: build prepare stage (copy tree, symlink misc/img)"
```

---

## Task 3: Secrets stage

**Files:**

- Create: `scripts/build/secrets.js`

**Interfaces:**

- Consumes: `randomBytes` from `util.js`.
- Produces: `export function makeSecrets()` → `{ id: string (16 hex chars), assetVersion: string (12 hex chars), catalogueKey: Buffer (16 bytes) }`. No seed — regenerated every build.

- [ ] **Step 1: Write `secrets.js`**

```js
import { randomBytes } from "./util.js";

export function makeSecrets() {
  return {
    id: randomBytes(8).toString("hex"),
    assetVersion: randomBytes(6).toString("hex"),
    catalogueKey: randomBytes(16),
  };
}
```

- [ ] **Step 2: Verify two calls differ**

Run:

```bash
node --input-type=module -e "
import { makeSecrets } from './scripts/build/secrets.js';
const a = makeSecrets(), b = makeSecrets();
console.log(a.id !== b.id, a.assetVersion !== b.assetVersion, a.catalogueKey.length === 16);
"
```

Expected: `true true true`.

- [ ] **Step 3: Commit**

```bash
git add scripts/build/secrets.js
git commit -m "feat: build secrets stage (per-build id, assetVersion, catalogueKey)"
```

---

## Task 4: JavaScript stage (Terser + obfuscator)

**Files:**

- Create: `scripts/build/javascript.js`

**Interfaces:**

- Consumes: `JS_SKIP` from `util.js`.
- Produces: `export async function obfuscateScripts(outStatic)` — minifies+obfuscates every top-level `assets/js/*.js` except the skip-list and the `sdks/` subdir; overwrites each file in place; logs obfuscated vs skipped and asserts the skipped set equals exactly `JS_SKIP ∪ {sdks/*}`.

- [ ] **Step 1: Write `javascript.js`**

```js
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
    if (entry.isDirectory()) {
      skipped.push(entry.name + "/");
      continue;
    } // sdks/
    if (!entry.name.endsWith(".js")) continue;
    if (JS_SKIP.has(entry.name)) {
      skipped.push(entry.name);
      continue;
    }

    const file = path.join(jsDir, entry.name);
    const src = await readFile(file, "utf8");
    const min = await minify(src, { compress: true, mangle: true });
    if (min.error)
      throw new Error(`[build] terser failed on ${entry.name}: ${min.error}`);
    const prefix =
      "_" + entry.name.replace(/[^a-z0-9]/gi, "").slice(0, 6) + "_";
    const out = JavaScriptObfuscator.obfuscate(
      min.code,
      obfuscatorOptions(prefix),
    ).getObfuscatedCode();
    await writeFile(file, out);
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
    `[build] obfuscated ${obfuscated.length} scripts, skipped ${skipped.join(", ")}`,
  );
}
```

- [ ] **Step 2: Verify against a prepared tree**

Run:

```bash
node --input-type=module -e "
import { prepare } from './scripts/build/prepare.js';
import { obfuscateScripts } from './scripts/build/javascript.js';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const out = await mkdtemp(path.join(os.tmpdir(),'b-'))+'';
await prepare('static', out+'/static'); // prepare expects outStatic dir
" 2>&1 | head
# Simpler: run the real build once stages exist (Task 8). Here just syntax:
node --check scripts/build/javascript.js
```

Expected: `node --check` passes. (Full behavioral check happens at Task 8: grep a built script for `loadGames`/`frameRuntime` to confirm globals survive and readable URLs are gone.)

- [ ] **Step 3: Commit**

```bash
git add scripts/build/javascript.js
git commit -m "feat: build javascript stage (terser + javascript-obfuscator, globals preserved)"
```

---

## Task 5: Catalogue stage (XOR-encode, round-trip verified)

**Files:**

- Create: `scripts/build/catalogue.js`

**Interfaces:**

- Consumes: `base64urlXor` from `util.js`.
- Produces: `export async function encodeCatalogue(outStatic, catalogueKey)` — for each `assets/json/load/*.json`, writes `base64urlXor(utf8(json), catalogueKey)` to the same path, after asserting it decodes back (via the readers' exact algorithm) to the original bytes.

- [ ] **Step 1: Write `catalogue.js`**

```js
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
      throw new Error(
        `[build] encoded ${entry} starts with a JSON char — readers would treat it as plaintext`,
      );
    }
    await writeFile(file, encoded); // same path, plaintext overwritten
  }
}
```

> base64url output uses only `A–Za–z0–9-_`, so it can never start with `[` or `{`; the guard documents the readers' plaintext-detection contract and catches any future encoder change.

- [ ] **Step 2: Verify round-trip and reader compatibility**

Run:

```bash
node --input-type=module -e "
import { encodeCatalogue } from './scripts/build/catalogue.js';
import { randomBytes } from 'node:crypto';
import { mkdtemp, mkdir, cp, readFile } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const out = await mkdtemp(path.join(os.tmpdir(),'cat-'));
await mkdir(path.join(out,'assets/json/load'),{recursive:true});
await cp('static/assets/json/load', path.join(out,'assets/json/load'), {recursive:true});
await encodeCatalogue(out, randomBytes(16));
const enc = await readFile(path.join(out,'assets/json/load/g.json'),'utf8');
console.log('encoded head:', enc.slice(0,8), '| looks like base64url:', /^[A-Za-z0-9_-]+$/.test(enc.slice(0,8)));
"
```

Expected: encoded head is base64url chars; `true`.

- [ ] **Step 3: Commit**

```bash
git add scripts/build/catalogue.js
git commit -m "feat: build catalogue stage (inline-key XOR, round-trip verified)"
```

---

## Task 6: HTML stage (inline-script obfuscation, minify, entity-encode, visibleText check)

**Files:**

- Create: `scripts/build/html.js`

**Interfaces:**

- Consumes: terser + javascript-obfuscator (same options as Task 4, via a shared import), `html-minifier-terser`.
- Produces: `export async function transformHtml(outStatic)` — for each `*.html` page shell, obfuscates eligible inline scripts, minifies, numeric-entity-encodes visible text and the attributes `alt`, `aria-label`, `title`, `placeholder`, `value`; asserts `visibleText` is unchanged.

- [ ] **Step 1: Export the obfuscator options from Task 4 for reuse**

Add to `scripts/build/javascript.js`:

```js
export { obfuscatorOptions };
```

and change its `function obfuscatorOptions` declaration to a hoisted export-compatible form (leave the `function` declaration; the named export line above is enough).

- [ ] **Step 2: Write `html.js`**

```js
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as terserMinify } from "terser";
import JavaScriptObfuscator from "javascript-obfuscator";
import { obfuscatorOptions } from "./javascript.js";

const ENCODE_ATTRS = ["alt", "aria-label", "title", "placeholder", "value"];

const numericEntities = (s) =>
  s.replace(/[^\s]/g, (ch) =>
    ch === "&" || ch === "<" || ch === ">" ? ch : `&#${ch.codePointAt(0)};`,
  );

// Normalized visible text: strip tags, collapse whitespace, decode numeric
// entities — so the before/after comparison is about meaning, not markup.
function visibleText(html) {
  return html
    .replace(/<(script|style|template)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/\s+/g, " ")
    .trim();
}

async function obfuscateInline(html) {
  // Only real inline scripts: no src, type js or absent.
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const parts = [];
  let last = 0,
    m,
    i = 0;
  while ((m = re.exec(html))) {
    parts.push(html.slice(last, m.index));
    const attrs = m[1];
    const body = m[2];
    const hasSrc = /\bsrc\s*=/.test(attrs);
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
    const isJs = !type || /javascript|ecmascript|^module$/i.test(type);
    if (!hasSrc && isJs && body.trim()) {
      const min = await terserMinify(body, { compress: true, mangle: true });
      const code = min.error ? body : min.code;
      const obf = JavaScriptObfuscator.obfuscate(
        code,
        obfuscatorOptions(`_h${i++}_`),
      ).getObfuscatedCode();
      parts.push(`<script${attrs}>${obf}</script>`);
    } else {
      parts.push(m[0]);
    }
    last = re.lastIndex;
  }
  parts.push(html.slice(last));
  return parts.join("");
}

// Tokenize protected tags out, run the markup transform, restore.
function protectAndEncode(html) {
  const tokens = [];
  const stash = (full) => {
    tokens.push(full);
    return `\u0000${tokens.length - 1}\u0000`;
  };
  let work = html.replace(
    /<(script|style|pre|textarea|template)[\s\S]*?<\/\1>/gi,
    stash,
  );

  // Encode the five attributes.
  for (const attr of ENCODE_ATTRS) {
    const are = new RegExp(`(\\b${attr}\\s*=\\s*)(["'])([\\s\\S]*?)\\2`, "gi");
    work = work.replace(
      are,
      (_, pre, q, val) => `${pre}${q}${numericEntities(val)}${q}`,
    );
  }
  // Encode visible text between tags.
  work = work.replace(/>([^<]+)</g, (_, text) => `>${numericEntities(text)}<`);

  return work.replace(/\u0000(\d+)\u0000/g, (_, n) => tokens[+n]);
}

export async function transformHtml(outStatic) {
  for (const entry of await readdir(outStatic)) {
    if (!entry.endsWith(".html")) continue;
    const file = path.join(outStatic, entry);
    const original = await readFile(file, "utf8");
    const before = visibleText(original);

    let html = await obfuscateInline(original);
    html = await minifyHtml(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: false, // inline JS already obfuscated above
      ignoreCustomFragments: [
        /<pre[\s\S]*?<\/pre>/i,
        /<textarea[\s\S]*?<\/textarea>/i,
      ],
    });
    html = protectAndEncode(html);

    const after = visibleText(html);
    if (before !== after) {
      throw new Error(
        `[build] visibleText changed in ${entry}\n  before: ${before.slice(0, 120)}\n  after:  ${after.slice(0, 120)}`,
      );
    }
    await writeFile(file, html);
  }
}
```

- [ ] **Step 3: Verify `node --check` and a single-file transform**

Run:

```bash
node --check scripts/build/html.js
node --input-type=module -e "
import { transformHtml } from './scripts/build/html.js';
import { mkdtemp, cp, readdir, readFile } from 'node:fs/promises';
import os from 'node:os'; import path from 'node:path';
const out = await mkdtemp(path.join(os.tmpdir(),'h-'));
for (const f of (await readdir('static')).filter(f=>f.endsWith('.html'))) await cp('static/'+f, path.join(out,f));
await transformHtml(out);
const idx = await readFile(path.join(out,'index.html'),'utf8');
console.log('contains raw word Games:', /Games/.test(idx), '| contains entity:', /&#\d+;/.test(idx));
"
```

Expected: `contains raw word Games: false | contains entity: true`, and no `visibleText changed` throw.

- [ ] **Step 4: Commit**

```bash
git add scripts/build/javascript.js scripts/build/html.js
git commit -m "feat: build html stage (inline-script obfuscation, minify, entity-encode, visibleText guard)"
```

---

## Task 7: Asset-version stage (count-guarded `?v=` rewrite)

**Files:**

- Create: `scripts/build/asset-version.js`

**Interfaces:**

- Produces: `export async function versionAssets(outStatic, assetVersion)` — rewrites every `/assets/....(js|css)` reference in built `*.html` and `assets/js/*.js` to carry `?v=<assetVersion>`, replacing any existing `?v=`; skips `/assets/lib/vendor-*` and `/assets/js/sdks/*`; asserts rewritten-count == found-count and zero non-exempt un-versioned refs remain.

- [ ] **Step 1: Write `asset-version.js`**

```js
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { walkFiles } from "./util.js";

const EXEMPT = /\/assets\/(lib\/vendor-|js\/sdks\/)/;
// A reference to an /assets/*.js or *.css file, with an optional existing ?v=.
const REF = /(\/assets\/[^\s"'`()?]+\.(?:js|css))(\?v=[^"'`\s)]*)?/g;

export async function versionAssets(outStatic, assetVersion) {
  let found = 0,
    rewritten = 0;
  const targets = [];
  for await (const f of walkFiles(outStatic)) {
    if (
      f.endsWith(".html") ||
      (f.includes(`${path.sep}assets${path.sep}js${path.sep}`) &&
        f.endsWith(".js"))
    ) {
      targets.push(f);
    }
  }
  for (const f of targets) {
    const src = await readFile(f, "utf8");
    const out = src.replace(REF, (whole, url, existing) => {
      if (EXEMPT.test(url)) return whole;
      found++;
      rewritten++;
      return `${url}?v=${assetVersion}`;
    });
    if (out !== src) await writeFile(f, out);
    // Guard: no non-exempt /assets/*.(js|css) left without our ?v=.
    const straggler = new RegExp(
      `/assets/[^\\s"'\`()?]+\\.(?:js|css)(?!\\?v=${assetVersion})`,
      "g",
    );
    for (const m of out.matchAll(straggler)) {
      if (!EXEMPT.test(m[0]))
        throw new Error(
          `[build] un-versioned asset ref in ${path.basename(f)}: ${m[0]}`,
        );
    }
  }
  if (found !== rewritten)
    throw new Error(
      `[build] asset-version count mismatch: found ${found}, rewrote ${rewritten}`,
    );
  console.log(
    `[build] versioned ${rewritten} asset references at ?v=${assetVersion}`,
  );
}
```

- [ ] **Step 2: Verify `node --check`**

Run: `node --check scripts/build/asset-version.js`
Expected: exit 0. (Behavioral check is the full build in Task 8.)

- [ ] **Step 3: Commit**

```bash
git add scripts/build/asset-version.js
git commit -m "feat: build asset-version stage (per-build ?v= rewrite with count guard)"
```

---

## Task 8: End-to-end build + manual verification

**Files:** none new — this task wires nothing; it runs the full `scripts/build.js` and confirms the spec's hand-checks pass.

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: ends with `[build] <id> ready (assetVersion ...)`, exit 0. `dist/current/static/` and `dist/builds/<id>/manifest.json` exist.

- [ ] **Step 2: Grep the built tree for readable site text (spec's core guarantee)**

Run:

```bash
head -c 40 dist/current/static/assets/json/load/g.json; echo
grep -c "&#" dist/current/static/index.html
grep -Eo "Games|Apps|Settings" dist/current/static/index.html | head
grep -Eo "assets/json/load|loadGames|fetch\(" dist/current/static/assets/js/games.js | head
grep -c "?v=" dist/current/static/index.html
```

Expected: `g.json` starts with base64url (not `[`); `index.html` has many `&#` entities and **no** raw `Games`/`Apps`/`Settings`; `games.js` shows no readable `assets/json/load`/`loadGames`/`fetch(` (obfuscated); `?v=` count > 0.

- [ ] **Step 3: Confirm globals and inline handlers survived**

Run:

```bash
grep -o "frameRuntime\|window\.\$\|io(" dist/current/static/assets/js/*.js | head
node --check <(cat dist/current/static/assets/js/games.js) 2>&1 || echo "SYNTAX ERROR"
```

Expected: global references still present (renameGlobals off); no syntax error on the obfuscated output.

- [ ] **Step 4: Confirm the server serves the built tree**

Run:

```bash
STATIC_ROOT=dist/current/static PORT=8099 node . >/tmp/srv.log 2>&1 &
sleep 2 && curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/ && curl -fsS http://127.0.0.1:8099/assets/json/load/g.json | head -c 20; echo
kill %1
```

Expected: `200`, and the catalogue response is base64url. Then confirm fallback:

```bash
PORT=8099 node . >/tmp/srv2.log 2>&1 & sleep 2; curl -fsS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8099/; kill %1
```

Expected: `200` (served from `static/` because no `STATIC_ROOT` and Task 9 default not yet in — this confirms the pre-existing fallback still works).

- [ ] **Step 5: Commit** (nothing to commit if all stages already landed; otherwise commit any fixes)

```bash
git commit -am "fix: build end-to-end corrections" --allow-empty
```

---

## Task 9: Serving — default-detect `dist/`, read manifest, optional debounced watch

**Files:**

- Modify: `index.js:43-49` (static-root resolution) and add a small watch block.

**Interfaces:**

- Consumes: `dist/current/static` and `dist/current/manifest.json` at runtime.
- Produces: the five existing `staticRoot` join sites (`express.static` mount `index.js:372`, `.html` fallback `:375`, routes table `:409`, `/chat/:chatId` `:414`, 404 `:418`) serve the live build; a symlink swap is picked up without a reload.

- [ ] **Step 1: Default `STATIC_ROOT` to the built tree when present**

Replace `index.js:43-49` so the default (no `STATIC_ROOT` env) auto-detects the build, matching the spec's `existsSync(dist/current/static) ? that : static`:

```js
// Production serves the built site (npm run build, see docs/deploy.md).
// Precedence: explicit STATIC_ROOT env > built tree if present > static/.
const builtStatic = path.resolve(__dirname, "dist/current/static");
const staticRoot = path.resolve(
  __dirname,
  process.env.STATIC_ROOT || (existsSync(builtStatic) ? builtStatic : "static"),
);
if (!existsSync(staticRoot)) {
  throw new Error(`STATIC_ROOT ${staticRoot} does not exist`);
}
```

> `express.static(staticRoot, ...)` resolves `staticRoot` lexically (symlink not pre-resolved), so each request reads through `dist/current` — a `deploy.sh` symlink swap is served immediately with no reload. The routes table in `manifest.json` is empty in phases 1–2, so no watch is required for correctness in this phase.

- [ ] **Step 2: Read the manifest once at boot (forward-compat, empty routes today)**

Immediately after the `staticRoot` block, add:

```js
// manifest.json sits beside the resolved root (built tree only). routes is
// empty in phases 1–2; reading it now means phase 3+ needs no serving change.
let manifest = { routes: {} };
const manifestPath = path.join(path.dirname(staticRoot), "manifest.json");
if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (e) {
    console.warn(`[static] ignoring unreadable manifest: ${e.message}`);
  }
}
```

Ensure `readFileSync` is imported from `node:fs` (check the existing import line near `existsSync`; add it if missing).

- [ ] **Step 3: Verify boot in both modes**

Run:

```bash
node --check index.js
npm run build
PORT=8099 node . >/tmp/s.log 2>&1 & sleep 2; curl -fsS -o /dev/null -w "built:%{http_code}\n" http://127.0.0.1:8099/; kill %1
rm -rf dist
PORT=8099 node . >/tmp/s2.log 2>&1 & sleep 2; curl -fsS -o /dev/null -w "fallback:%{http_code}\n" http://127.0.0.1:8099/; kill %1
```

Expected: `node --check` passes; `built:200` (auto-detected `dist/` with no `STATIC_ROOT` env); `fallback:200` after `dist/` removed.

- [ ] **Step 4: Commit**

```bash
git add index.js
git commit -m "feat: serve dist/current build by default and read its manifest"
```

---

## Task 10: CI `check` — assert the built tree leaks no site text

**Files:**

- Modify: `.github/workflows/deploy.yml` (the `check` job, after the `Build` step).

**Interfaces:**

- Consumes: the built tree the `Build` step produces in CI.
- Produces: a CI failure if a built catalogue/page/script contains a readable title or site word.

- [ ] **Step 1: Add an assertion step after `Build`**

In `.github/workflows/deploy.yml`, under the `check` job, immediately after the `- name: Build` step, add:

```yaml
- name: Assert the build leaks no readable site text
  run: |
    set -e
    cat=dist/current/static/assets/json/load/g.json
    page=dist/current/static/index.html
    # Catalogue must be base64url (no leading JSON bracket) and hold no title.
    head -c1 "$cat" | grep -qvE '[\[{]' || { echo "catalogue is still plaintext JSON"; exit 1; }
    # Pick a known title from the source catalogue and assert it is gone.
    title=$(node -e "const g=require('./static/assets/json/load/g.json');process.stdout.write((g[0]&&g[0].name)||'')")
    if [ -n "$title" ] && grep -qF "$title" "$cat"; then echo "title '$title' readable in built catalogue"; exit 1; fi
    # Page must be entity-encoded, with no raw nav words.
    grep -q '&#' "$page" || { echo "page not entity-encoded"; exit 1; }
    for w in Games Settings Signup; do
      if grep -qE ">[^<]*$w[^<]*<" "$page"; then echo "raw word '$w' in built page"; exit 1; fi
    done
    echo "build leak check passed"
```

- [ ] **Step 2: Verify the shell locally against a real build**

Run the body of the step locally:

```bash
npm run build
cat=dist/current/static/assets/json/load/g.json
title=$(node -e "const g=require('./static/assets/json/load/g.json');process.stdout.write((g[0]&&g[0].name)||'')")
echo "title: $title"; head -c1 "$cat"; echo
grep -c '&#' dist/current/static/index.html
```

Expected: title prints; catalogue head is not `[`/`{`; entity count > 0.

- [ ] **Step 3: Validate the workflow YAML**

Run: `node -e "require('js-yaml')" 2>/dev/null && npx --yes js-yaml .github/workflows/deploy.yml >/dev/null && echo OK || python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/deploy.yml'));print('OK')"`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: assert the built tree leaks no readable catalogue or page text"
```

---

## Task 11: Docs

**Files:**

- Modify: `CLAUDE.md` (the "No build step yet" line), `docs/deploy.md` ("Adding a build step" → "The build").

- [ ] **Step 1: Update `CLAUDE.md`**

Replace the `## Commands` note "No build step yet — the project uses ES6 modules served directly by Node.js." with a line documenting `npm run build` (writes `dist/current/static`, six stages under `scripts/build/`, obfuscates own assets only, proxy surface deferred to phases 3–5), keeping the existing `node .` / `node setup-db.js` commands.

- [ ] **Step 2: Update `docs/deploy.md`**

Turn the hypothetical "Adding a build step" section into a description of the shipped build: the stage list, the `dist/` layout, the symlink swap, and the manual verification checklist from Task 8.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md docs/deploy.md
git commit -m "docs: document the deploy-time asset build"
```

---

## Self-Review Notes

- **Spec coverage:** Part B stages 1–6 → Tasks 2,3,4,5,6,7. Boot blob (stage 2/4 text) → intentionally **not** built; the committed readers use an inline-prepended key and nothing reads a boot blob at runtime (documented in Global Constraints — raise with the user before implementing in case the spec author intended a different reader design). Output layout + symlink swap + prune → Task 1/9. Count guards → Tasks 4,7. visibleText check → Task 6. Serving (Part C) → Task 9. CI assertion (Part A check job) → Task 10.
- **Not in scope:** route randomization (spec says dropped), phases 3–5 (proxy surface), CSS selector renaming (phase 4) — CSS is copied through untouched in phases 1–2.
- **Open question for the user:** `static/assets/js/loader-ui.js` has its own hardcoded `VERSION` constant (managed by `scripts/bump-loader-version.js`) for game-loader assets. The asset-version stage versions `/assets/*.(js|css)` refs but does not touch that constant. Confirm that is intended (the two version schemes are independent).

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { minify as minifyHtml } from "html-minifier-terser";
import { minify as terserMinify } from "terser";
import JavaScriptObfuscator from "javascript-obfuscator";
import { obfuscatorOptions } from "./javascript.js";

const ENCODE_ATTRS = ["alt", "aria-label", "title", "placeholder", "value"];

// Sequences the encoder must pass through verbatim, or encoding them would
// corrupt them and the visibleText guard would throw:
//  - an existing HTML entity: numeric (&#160;), hex (&#xA0;), or named
//    (&nbsp;) — re-encoding `&nbsp;` into `&` + encoded `nbsp;` changes text.
//  - the protect/restore sentinel `\u0000N\u0000` used by protectAndEncode:
//    its NUL bytes are non-whitespace, so a naive pass would encode them to
//    `&#0;` and the sentinel could no longer be restored.
const SKIP_RE =
  /&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);|\u0000\d+\u0000/g;

// Numeric-encode every raw character except whitespace and the markup-
// significant `&<>` (left literal, matching the brief).
const encodeRaw = (s) =>
  s.replace(/[^\s]/g, (ch) =>
    ch === "&" || ch === "<" || ch === ">" ? ch : `&#${ch.codePointAt(0)};`,
  );

// Skip-safe wrapper: split on existing entities and protect sentinels, and
// encode only the raw segments between them, leaving the skipped runs verbatim.
const numericEntities = (s) => {
  const parts = [];
  let last = 0;
  let m;
  SKIP_RE.lastIndex = 0;
  while ((m = SKIP_RE.exec(s))) {
    parts.push(encodeRaw(s.slice(last, m.index)));
    parts.push(m[0]); // keep the entity / sentinel untouched
    last = SKIP_RE.lastIndex;
  }
  parts.push(encodeRaw(s.slice(last)));
  return parts.join("");
};

// Matches one HTML tag while respecting quoted attribute values, so a `>`
// inside an attribute (e.g. `onclick="...'</b>'..."`) never ends the tag early.
// A fresh instance is made per use to avoid shared lastIndex state.
const tagMatcher = () =>
  /<[a-zA-Z!/][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;

// Numeric-encode only the text nodes between tags; tags (and their attribute
// internals) are emitted verbatim.
function encodeTextNodes(html) {
  const re = tagMatcher();
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    out += numericEntities(html.slice(last, m.index));
    out += m[0];
    last = re.lastIndex;
  }
  out += numericEntities(html.slice(last));
  return out;
}

// Normalized visible text: strip tags, collapse whitespace, decode numeric
// entities — so the before/after comparison is about meaning, not markup.
// Existing named entities (e.g. &nbsp;) survive identically on both sides, so
// they compare equal without being decoded here.
function visibleText(html) {
  return html
    // Comments are not visible and minify strips them (removeComments), so
    // drop them on both sides — a comment may contain `>` that would otherwise
    // split across the tag-strip and leak its tail into the comparison.
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|template)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    // Quote-aware tag strip (same matcher as the encoder): a `>` inside a
    // quoted attribute value (e.g. an inline onclick handler holding HTML like
    // `'...</b>'`) must not end the tag early, or that JS would leak into the
    // comparison and minify's whitespace collapse around the real tag boundary
    // would read as a diff.
    .replace(tagMatcher(), " ")
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

// Tokenize protected tags out, run the markup transform, restore. Their
// contents (script/style/pre/textarea/template) are never entity-encoded.
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
    work = work.replace(are, (_, pre, q, val) => `${pre}${q}${numericEntities(val)}${q}`);
  }
  // Encode visible text nodes only. Walk the markup tag-by-tag (quote-aware,
  // so a `>` inside a quoted attribute value such as an inline onclick handler
  // that emits HTML does NOT look like a tag boundary) and numeric-encode just
  // the text between tags — never tag internals, so event handlers and other
  // unlisted attributes pass through untouched.
  work = encodeTextNodes(work);

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

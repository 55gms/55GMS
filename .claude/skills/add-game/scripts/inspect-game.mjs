#!/usr/bin/env node

const input = process.argv[2];

if (!input) {
  console.error("Usage: node scripts/inspect-game.mjs <GN-Math ID or URL>");
  process.exit(2);
}

const match = String(input).match(/(?:[?&]id=|^)(\d+)(?:\D|$)/);
if (!match) {
  console.error(`Could not extract a numeric GN-Math ID from: ${input}`);
  process.exit(2);
}

const id = Number(match[1]);
const liveSite = await fetchResult("https://gn-math.dev/");
const liveZonesUrl = liveSite.body?.match(/\bzones:\s*["']([^"']+)["']/)?.[1];
const liveCoversUrl = liveSite.body?.match(/\bcovers:\s*["']([^"']+)["']/)?.[1];
const liveHtmlUrl = liveSite.body?.match(
  /CONFIG\.html\s*=\s*["']([^"']+)["']/,
)?.[1];
const metadataSources = [
  ...new Set(
    [
      liveZonesUrl,
      "https://cdn.jsdelivr.net/gh/freebuisness/assets@latest/zones.json",
      "https://raw.githubusercontent.com/gn-math/assets/main/zones.json",
    ].filter(Boolean),
  ),
];

async function fetchResult(url, options = {}) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      ...options,
    });
    const body = await response.text();
    return {
      url,
      finalUrl: response.url,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      bytes: Buffer.byteLength(body),
      body,
    };
  } catch (error) {
    return { url, ok: false, error: error.message };
  }
}

let metadata;
let metadataSource;
const metadataAttempts = [];

for (const url of metadataSources) {
  const result = await fetchResult(url);
  metadataAttempts.push({
    url,
    status: result.status,
    contentType: result.contentType,
    bytes: result.bytes,
    error: result.error,
  });
  if (!result.ok) continue;
  try {
    const zones = JSON.parse(result.body);
    const candidate = Array.isArray(zones)
      ? zones.find((game) => String(game.id) === String(id))
      : undefined;
    if (candidate) {
      metadata = candidate;
      metadataSource = url;
      break;
    }
  } catch {
    // Try the next source.
  }
}

const htmlPath =
  metadata?.url?.match(/\/([^/]+\.html)(?:[?#]|$)/)?.[1] ?? `${id}.html`;
const coverPath =
  metadata?.cover?.match(/\/([^/]+\.(?:png|jpe?g|webp))(?:[?#]|$)/i)?.[1] ??
  `${id}.png`;
const htmlRawUrl = `https://raw.githubusercontent.com/gn-math/html/main/${encodeURIComponent(htmlPath)}`;
const coverRawUrl = `https://raw.githubusercontent.com/gn-math/covers/main/${encodeURIComponent(coverPath)}`;
const liveHtmlSourceUrl = liveHtmlUrl
  ? `${liveHtmlUrl}/${encodeURIComponent(htmlPath)}`
  : undefined;
const liveCoverSourceUrl = liveCoversUrl
  ? `${liveCoversUrl}/${encodeURIComponent(coverPath)}`
  : undefined;

const [
  html,
  cover,
  assetDirectory,
  jsdelivrHtml,
  jsdelivrAssetIndex,
  liveHtmlSource,
  liveCoverSource,
] = await Promise.all([
  fetchResult(htmlRawUrl),
  fetchResult(coverRawUrl),
  fetchResult(
    `https://api.github.com/repos/gn-math/assets/contents/${id}?ref=main`,
    {
      headers: { Accept: "application/vnd.github+json" },
    },
  ),
  fetchResult(
    `https://cdn.jsdelivr.net/gh/gn-math/html@main/${encodeURIComponent(htmlPath)}`,
  ),
  fetchResult(`https://cdn.jsdelivr.net/gh/gn-math/assets@main/${id}/`),
  liveHtmlSourceUrl
    ? fetchResult(liveHtmlSourceUrl)
    : Promise.resolve({ url: undefined, ok: false }),
  liveCoverSourceUrl
    ? fetchResult(liveCoverSourceUrl)
    : Promise.resolve({ url: undefined, ok: false }),
]);

const baseHref = html.body?.match(
  /<base\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i,
)?.[1];
const documentTitle = html.body?.match(/<title\b[^>]*>([^<]*)/i)?.[1]?.trim();
const summarize = (result) => ({
  url: result.url,
  finalUrl: result.finalUrl,
  ok: result.ok,
  status: result.status,
  contentType: result.contentType,
  bytes: result.bytes,
  error: result.error,
  blockedMessage:
    result.body &&
    result.bytes < 1_000 &&
    result.contentType?.startsWith("text/plain") &&
    /(?:user\s+\S+\s+is\s+blocked|acceptable-use-policy)/i.test(result.body)
      ? result.body.trim().slice(0, 240)
      : undefined,
});

console.log(
  JSON.stringify(
    {
      id,
      liveSite: {
        page: summarize(liveSite),
        zonesUrl: liveZonesUrl,
        coversUrl: liveCoversUrl,
        htmlUrl: liveHtmlUrl,
      },
      metadata,
      metadataSource,
      metadataAttempts,
      htmlPath,
      coverPath,
      documentTitle,
      sourceBaseHref: baseHref,
      sources: {
        htmlRaw: summarize(html),
        coverRaw: summarize(cover),
        officialAssetDirectory: summarize(assetDirectory),
      },
      requestedJsdelivr: {
        html: summarize(jsdelivrHtml),
        assetBase: summarize(jsdelivrAssetIndex),
      },
      activeMirror: {
        html: summarize(liveHtmlSource),
        cover: summarize(liveCoverSource),
      },
      notes: [
        "Use live metadata for the display name and exact source filenames.",
        "Do not replace an explicit source base unless the replacement asset tree is proven equivalent.",
        "Repeat representative CDN and browser checks during the actual import.",
      ],
    },
    null,
    2,
  ),
);

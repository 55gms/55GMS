import path from "node:path";

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Captured games also build URLs by appending filenames to a CDN directory.
// Rewrite those directories as well as the individual files already observed.
export function createGameUrlRewriter(sources, gameRoot, prefix) {
  const absolute = new Map();
  const rootRelative = new Map();
  for (const [source, rel] of sources) {
    const url = new URL(source);
    const inside = !rel.startsWith("_ext/");
    const target = prefix + rel.split("/").map(encodeURIComponent).join("/");
    if (!inside || url.origin !== gameRoot.origin) {
      absolute.set(`//${url.host}${url.pathname}`, target);
      const sourceDirectory = new URL("./", url);
      const targetDirectory = prefix + path.posix.dirname(rel).split("/").map(encodeURIComponent).join("/") + "/";
      absolute.set(`//${sourceDirectory.host}${sourceDirectory.pathname}`, targetDirectory);
      if (sourceDirectory.pathname !== "/") {
        absolute.set(`//${sourceDirectory.host}${sourceDirectory.pathname.slice(0, -1)}`, targetDirectory.slice(0, -1));
      }
    }
    if (url.origin === gameRoot.origin && !inside && url.pathname.length > 1) {
      rootRelative.set(url.pathname, target);
    }
  }
  const replacements = [...absolute]
    .sort((a, b) => b[0].length - a[0].length)
    .map(([from, to]) => [
      new RegExp(`(?:https?:)?${escapeRegExp(from)}${from.endsWith("/") ? "" : "(?![\\w.%-])"}`, "g"),
      to,
    ]);
  const localReplacements = [...rootRelative].map(([from, to]) => [
    new RegExp(`(["'\`(=])${escapeRegExp(from)}(?=["'\`)?#\\s>])`, "g"),
    `$1${to}`,
  ]);
  return (text) => {
    for (const [pattern, target] of [...replacements, ...localReplacements]) {
      text = text.replace(pattern, target);
    }
    return text;
  };
}

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
      const targetDirectory =
        prefix +
        path.posix.dirname(rel).split("/").map(encodeURIComponent).join("/") +
        "/";
      absolute.set(
        `//${sourceDirectory.host}${sourceDirectory.pathname}`,
        targetDirectory,
      );
      if (sourceDirectory.pathname !== "/") {
        absolute.set(
          `//${sourceDirectory.host}${sourceDirectory.pathname.slice(0, -1)}`,
          targetDirectory.slice(0, -1),
        );
      }
      // Templates often store a repository root and append "Build/...".
      // Observing only files in Build must also localize that root.
      let sourceParent = sourceDirectory;
      let targetParent = targetDirectory;
      while (sourceParent.pathname.split("/").filter(Boolean).length > 3) {
        sourceParent = new URL("../", sourceParent);
        targetParent = path.posix.dirname(targetParent.slice(0, -1)) + "/";
        absolute.set(
          `//${sourceParent.host}${sourceParent.pathname}`,
          targetParent,
        );
        absolute.set(
          `//${sourceParent.host}${sourceParent.pathname.slice(0, -1)}`,
          targetParent.slice(0, -1),
        );
      }
    }
    if (url.origin === gameRoot.origin && !inside && url.pathname.length > 1) {
      rootRelative.set(url.pathname, target);
    }
  }
  const replacements = [...absolute]
    .sort((a, b) => b[0].length - a[0].length)
    .map(([from, to]) => [
      new RegExp(
        `(?:https?:)?${escapeRegExp(from)}${from.endsWith("/") ? "" : "(?![\\w.%-])"}`,
        "g",
      ),
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

// Unity 2017-2019 prepends the JSON manifest directory even to root-relative
// asset paths. Keep those entries relative to the manifest, as Unity expects.
export function relativeUnityManifest(text, file, prefix) {
  let manifest;
  try {
    manifest = JSON.parse(text);
  } catch {
    return text;
  }
  if (!manifest || typeof manifest !== "object" || !manifest.dataUrl)
    return text;
  let changed = false;
  for (const key of [
    "dataUrl",
    "wasmCodeUrl",
    "wasmFrameworkUrl",
    "asmCodeUrl",
    "asmFrameworkUrl",
    "asmMemoryUrl",
    "memUrl",
  ]) {
    const value = manifest[key];
    if (typeof value !== "string" || !value.startsWith(prefix)) continue;
    manifest[key] = path.posix
      .relative(
        path.posix.dirname(file),
        decodeURIComponent(value.slice(prefix.length)),
      )
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    changed = true;
  }
  return changed ? JSON.stringify(manifest, null, 2) : text;
}

#!/usr/bin/env python3
"""Prepare the 21 locally hosted Unity games for jsDelivr delivery."""
import hashlib
import json
import os
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
# Pages stay in this repo; game files live in the 55gms/assets clone beside it.
ASSETS = pathlib.Path(os.environ.get("ASSETS_REPO", ROOT.parent / "assets")).resolve()
FOLDERS = [
    "nowgg", "amazing-rope-police", "superstarcar", "dadish3d",
    "drift-hunters", "funny-shooter-2", "geometry-dash", "gladihoppers",
    "golforbit", "survival-race", "madstunt-cars", "skyriders",
    "papery-planes", "flickgoal", "ragdoll-hit", "bikeobby", "superhot",
    "Tanuki-Sunset", "kiwiclicker", "karlson", "zombiederby",
]
LIMIT = 20_000_000
CHUNK_SIZE = 10_000_000
CDN = "https://cdn.jsdelivr.net/gh/55gms/assets@main/misc/"


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def asset_type(name):
    if "wasm" in name and not name.endswith(".zip") and "framework" not in name:
        return "application/wasm"
    if "framework" in name or "asm.code" in name or name.endswith((".jsgz", ".js.br")):
        return "application/javascript"
    return "application/octet-stream"


def chunk(path, folder):
    parts = []
    with path.open("rb") as source:
        for number in range(1, (path.stat().st_size + CHUNK_SIZE - 1) // CHUNK_SIZE + 1):
            part = path.with_name(f"{path.name}.part{number}")
            part.write_bytes(source.read(CHUNK_SIZE))
            parts.append({"path": part.relative_to(folder).as_posix(), "size": part.stat().st_size})
    # Verify the reconstruction before removing the oversized original.
    combined = hashlib.sha256()
    for part in parts:
        combined.update((folder / part["path"]).read_bytes())
    if combined.hexdigest() != digest(path):
        raise RuntimeError(f"Chunk verification failed: {path}")
    return parts


def migrate_page(folder):
    page = ROOT / "static/misc" / folder.name / "index.html"
    html = page.read_text()
    if 'id="unity-game-scripts"' in html:
        return
    scripts = []

    # Commented-out scripts must remain inactive when collecting startup code.
    html = re.sub(r"<!--[\s\S]*?-->", lambda match: "" if "<script" in match[0] else match[0], html)

    def capture(match):
        script = match[0]
        # This stale site-wide URL is already absent from the repository.
        if re.search(r'src=["\']/assets/js/LoadData\.js', script):
            return ""
        if folder.name == "nowgg" and ("w.document.write(" in script or 'src="js/googleAnalytics.js"' in script):
            # These parser-only ad placeholders would erase the completed page
            # when replayed after downloads. The Unity/SDK scripts are retained.
            return ""
        scripts.append(script)
        return ""

    html = re.sub(r"<script\b[^>]*>[\s\S]*?</script\s*>", capture, html, flags=re.I)
    html = re.sub(r"<head\b[^>]*>", lambda m: m[0] + f'\n    <link rel="stylesheet" href="/assets/css/unity-cdn-loader.css">\n    <script type="module" src="/assets/js/unity-cdn-loader.js"></script>\n    <base href="{CDN}{folder.name}/">', html, count=1, flags=re.I)
    # Permit the CDN and merged blob payloads within Bike Obby's existing policy.
    def csp(match):
        tag = match[0]
        if "content-security-policy" not in tag.lower():
            return tag
        def sources(value):
            policies = []
            for policy in value[3].split(";"):
                tokens = policy.split()
                if tokens and tokens[0] in {"default-src", "script-src", "connect-src", "style-src", "img-src", "font-src", "media-src", "worker-src"}:
                    if "https://cdn.jsdelivr.net" not in tokens:
                        tokens.append("https://cdn.jsdelivr.net")
                    if tokens[0] in {"script-src", "connect-src", "worker-src"} and "blob:" not in tokens:
                        tokens.append("blob:")
                policies.append(" ".join(tokens))
            return value[1] + value[2] + "; ".join(policies) + value[2]
        return re.sub(r'(content=)(["\'])(.*?)\2', sources, tag, flags=re.I | re.S)
    html = re.sub(r"<meta\b[^>]*>", csp, html, flags=re.I | re.S)
    html = re.sub(r"<body\b[^>]*>", lambda m: m[0] + '\n    <div id="unity-cdn-loading" role="status" aria-live="polite">LOADING...</div>', html, count=1, flags=re.I)
    boot = '\n    <template id="unity-game-scripts">\n' + "\n".join(scripts) + '\n    </template>\n'
    html = re.sub(r"</body\s*>", lambda match: boot + "</body>", html, count=1, flags=re.I)
    page.write_text(re.sub(r"(?m)^[ \t]+$", "", html))


for name in FOLDERS:
    folder = ASSETS / "misc" / name
    manifest_path = folder / "unity-assets.json"
    previous = json.loads(manifest_path.read_text())["files"] if manifest_path.exists() else []
    files = {entry["path"]: entry for entry in previous}
    candidates = sorted(path for path in folder.rglob("*") if path.is_file())
    for path in candidates:
        if re.search(r"\.part\d+$", path.name):
            continue
        if not (path.stat().st_size > LIMIT or re.search(r"\.(data|wasm|unityweb|datagz|jsgz|memgz)(\.|$)|framework|\.js\.br$", path.name)):
            continue
        relative = path.relative_to(folder).as_posix()
        entry = {"path": relative, "size": path.stat().st_size, "type": asset_type(path.name), "sha256": digest(path)}
        if entry["size"] > LIMIT:
            entry["parts"] = chunk(path, folder)
            path.unlink()
        files[relative] = entry
    manifest_path.write_text(json.dumps({"version": 1, "files": list(files.values())}, indent=2) + "\n")
    migrate_page(folder)
    print(f'{name}: {sum("parts" in file for file in files.values())} chunked files')

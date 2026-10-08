# Deploy Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cron `git pull` deploy on the `55gms` server with a GitHub Actions driven deploy that installs, builds an obfuscated settings page, reloads without downtime, health-checks and rolls back.

**Architecture:** A build script turns `src/pages/*.html` into decoy-plus-encrypted-payload files in `dist/`; Express serves the built settings page and falls back to an in-memory build. GitHub Actions checks each push and SSHes to the server with a key that can only run `/root/deploy/entry.sh`, which runs the target commit's `deploy/deploy.sh`. Caddy is not touched.

**Tech Stack:** Node 22 (ES modules), Express 4, `node-html-parser`, pm2 cluster mode, bash, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-07-deploy-pipeline-design.md`

## Global Constraints

- Do not write or run automated tests (user's standing instruction). Every task is verified with the manual commands given in its steps.
- Commit directly on `main`, semantic commit messages, one commit per task. Do not push until Task 7 says so.
- Run git commands one at a time, in the foreground. Use `git status -uno`, never a full status. Do not run `git gc` or `git repack`.
- Do not change `/etc/caddy/Caddyfile`, `/var/lib/caddy`, or the port the app listens on (8080).
- Every step in Task 7 that changes the production server needs the user's go-ahead in chat immediately before it runs.
- Only the settings page is obfuscated.
- The loader marker string is exactly `data-edu="1"`.
- Server paths: app `/root/55gms`, deploy state `/root/deploy`, pm2 app name `55gms`, 10 instances.

## Review Focus

Failure modes the spec implies that are most likely to bite, each pinned to a manual check in the task that owns the code:

1. A script on the settings page behaves differently when written into the body instead of loaded from `<head>` (controls dead, tab cloak not applied). Checked in Task 2 Step 5.
2. A commit that crashes on boot takes all 10 workers down during the rolling reload. Guarded by the preflight boot in `deploy.sh`; checked in Task 4 Step 4 and Task 7 Step 11.
3. `set -e` is ignored inside functions called from `if`, so a failed step in `deploy.sh` could be skipped silently. Every step in those functions ends in `|| return 1`; checked in Task 4 Step 4.
4. The clean settings source stays reachable over HTTP. Checked in Task 2 Step 4.
5. The deploy key can do more than deploy (shell, arbitrary sha, arbitrary command). Checked in Task 7 Step 4.

## File Structure

| Path | Responsibility |
| --- | --- |
| `src/pages/settings.html` | Clean settings page source (moved from `static/settings.html`) |
| `src/decoy.html` | Shell every built page uses; what a non-JS reader sees |
| `build/obfuscate.js` | `buildPage(name)` returns built HTML; run as a CLI it writes `dist/` |
| `utils/builtPages.js` | `getBuiltPage(name)` (dist or in-memory) and `mountBuiltPages(app)` |
| `index.js` | Mounts built pages; tells pm2 when it is ready |
| `ecosystem.config.cjs` | pm2 settings for the `55gms` app |
| `deploy/entry.sh` | The only command the deploy key can run; validates and dispatches |
| `deploy/deploy.sh` | Checkout, install, build, preflight, reload, health check, restore |
| `.github/workflows/deploy.yml` | Prettier, checks, deploy, rollback |
| `docs/deploy.md` | Runbook |

---

### Task 1: Build script and source layout

**Files:**
- Move: `static/settings.html` → `src/pages/settings.html`
- Create: `src/decoy.html`, `build/obfuscate.js`
- Modify: `package.json`, `package-lock.json`, `.gitignore`

**Interfaces:**
- Produces, from `build/obfuscate.js`:
  - `buildPage(name: string): string` — `name` is a file name in `src/pages/`, e.g. `"settings.html"`. Throws if the source or decoy is missing or the decoy has no `<body>` tag.
  - `buildAll(): string[]` — writes every page to `dist/`, returns the names built.
  - Constants `PAGES_DIR`, `DECOY_PATH`, `DIST_DIR`, `BUILD_SCRIPT` (absolute paths) and `LOADER_MARKER` (`'data-edu="1"'`).
  - `npm run build` runs `buildAll()`.

- [ ] **Step 1: Move the source page and add the dependency**

```bash
mkdir -p src/pages build
git mv static/settings.html src/pages/settings.html
npm install node-html-parser
```

- [ ] **Step 2: Add the build script entry and ignore `dist/`**

In `package.json`, replace the `scripts` block with:

```json
  "scripts": {
    "build": "node build/obfuscate.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Append to `.gitignore`:

```
# Build output (npm run build)
dist/
dist.tmp-*/
dist.old-*/
```

- [ ] **Step 3: Write the decoy**

Create `src/decoy.html`. The literal `<body>` tag (no attributes) must stay as written; the build inserts the loader right after it.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>Social Structures and Institutions | Introduction to Sociology</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description"
    content="Study notes on social structure, institutions and the sociological imagination." />
</head>

<body>
  <noscript>
    <main>
      <h1>Social Structures and Institutions</h1>
      <p>
        Sociology studies how people live together: the groups they form, the
        rules they follow and the institutions that outlast any one person.
        A social structure is a stable pattern of relationships, such as a
        family, a school or a workplace, that shapes what its members can do.
      </p>
      <h2>The sociological imagination</h2>
      <p>
        C. Wright Mills used this phrase for the habit of connecting personal
        experience to wider social forces. Losing a job feels private, but
        when thousands lose jobs at once the cause lies in the economy, not
        in any one worker.
      </p>
      <h2>Institutions</h2>
      <p>
        Institutions are established ways of meeting a society's needs. The
        five usually studied first are family, education, religion, the
        economy and government. Each has roles, norms and sanctions that
        guide behaviour.
      </p>
      <h2>Review questions</h2>
      <ol>
        <li>Give one example of a role and one example of a norm in a school.</li>
        <li>How does a social structure differ from a social institution?</li>
        <li>Describe a personal trouble that is also a public issue.</li>
      </ol>
    </main>
  </noscript>
</body>

</html>
```

- [ ] **Step 4: Write `build/obfuscate.js`**

```javascript
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  renameSync,
  rmSync,
  existsSync,
} from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

export const BUILD_SCRIPT = fileURLToPath(import.meta.url);
const ROOT = path.join(path.dirname(BUILD_SCRIPT), "..");
export const PAGES_DIR = path.join(ROOT, "src", "pages");
export const DECOY_PATH = path.join(ROOT, "src", "decoy.html");
export const DIST_DIR = path.join(ROOT, "dist");
export const LOADER_MARKER = 'data-edu="1"';

const BODY_TAG = "<body>";

// Repeating-key XOR over UTF-8 bytes; key and ciphertext as base64.
function encryptPayload(payload) {
  const plain = Buffer.from(JSON.stringify(payload), "utf8");
  const key = randomBytes(64);
  const cipher = Buffer.alloc(plain.length);
  for (let i = 0; i < plain.length; i++) {
    cipher[i] = plain[i] ^ key[i % key.length];
  }
  return { k: key.toString("base64"), t: cipher.toString("base64") };
}

// Runs in the browser and mirrors encryptPayload. `h` is written with
// document.write so the scripts inside it execute in order.
function loaderScript(k, t) {
  return (
    `<script ${LOADER_MARKER}>!function(){` +
    `var e=atob(${JSON.stringify(k)}),t=atob(${JSON.stringify(t)}),` +
    `o=new Uint8Array(t.length),n;` +
    `for(n=0;n<t.length;n++)o[n]=t.charCodeAt(n)^e.charCodeAt(n%e.length);` +
    `var j=JSON.parse(new TextDecoder().decode(o)),a=j.a,h=j.h,i;` +
    `if(j.t)document.title=j.t;` +
    `document.head.insertAdjacentHTML("beforeend",j.m);` +
    `for(i=0;i<a.length;i++)document.body.setAttribute(a[i][0],a[i][1]);` +
    `if(document.readyState==="loading"){document.write(h)}` +
    `else{document.body.innerHTML=h}` +
    `}();</script>`
  );
}

// Splits a source page into the payload the loader applies:
//   t  real <title> text
//   m  <meta> tags, appended to <head>
//   a  attributes of <body>
//   h  every other <head> element (stylesheets, scripts) in source order,
//      followed by the inner HTML of <body>
function splitPage(sourceHtml) {
  const root = parse(sourceHtml, { comment: false });
  const head = root.querySelector("head");
  const body = root.querySelector("body");
  if (!body) throw new Error("source page has no <body>");

  let t = "";
  let m = "";
  let assets = "";
  for (const node of head ? head.childNodes : []) {
    if (node.nodeType !== 1) continue;
    const tag = node.rawTagName.toLowerCase();
    if (tag === "title") t = node.text;
    else if (tag === "meta") m += node.toString();
    else assets += node.toString();
  }

  return {
    t,
    m,
    a: Object.entries(body.attributes),
    h: assets + body.innerHTML,
  };
}

export function buildPage(name) {
  const decoy = readFileSync(DECOY_PATH, "utf8");
  if (!decoy.includes(BODY_TAG)) {
    throw new Error(`${DECOY_PATH} must contain a plain ${BODY_TAG} tag`);
  }
  const source = readFileSync(path.join(PAGES_DIR, name), "utf8");
  const { k, t } = encryptPayload(splitPage(source));
  return decoy.replace(BODY_TAG, `${BODY_TAG}\n${loaderScript(k, t)}`);
}

// Builds into a temp folder and swaps it in, so dist/ is never half written.
export function buildAll() {
  const names = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  const tmp = `${DIST_DIR}.tmp-${process.pid}`;
  const old = `${DIST_DIR}.old-${process.pid}`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  for (const name of names) {
    writeFileSync(path.join(tmp, name), buildPage(name));
  }
  if (existsSync(DIST_DIR)) renameSync(DIST_DIR, old);
  renameSync(tmp, DIST_DIR);
  rmSync(old, { recursive: true, force: true });
  return names;
}

if (process.argv[1] === BUILD_SCRIPT) {
  for (const name of buildAll()) console.log("built", name);
}
```

- [ ] **Step 5: Verify the build output**

Run: `npm run build`
Expected: prints `built settings.html`; `dist/settings.html` exists.

Run:

```bash
grep -c 'data-edu="1"' dist/settings.html
grep -c -E 'settings-page|Reds Exploit|/assets/js/settings.js' dist/settings.html
```

Expected: first prints `1`, second prints `0` (and exits 1).

Decrypt the payload and compare it with the source:

```bash
node --input-type=commonjs -e '
const fs = require("fs");
const html = fs.readFileSync("dist/settings.html", "utf8");
const [, k, t] = html.match(/atob\("([^"]+)"\),t=atob\("([^"]+)"\)/);
const key = Buffer.from(k, "base64"), ct = Buffer.from(t, "base64");
const j = JSON.parse(Buffer.from(ct.map((b, i) => b ^ key[i % key.length])).toString("utf8"));
console.log(JSON.stringify([j.t, (j.m.match(/<meta/g) || []).length, j.a,
  (j.h.match(/<script/g) || []).length, (j.h.match(/<link/g) || []).length,
  j.h.indexOf("settings.js") < j.h.indexOf("script.js"), j.h.includes("importConfirmModal")]));
'
```

Expected: `["Google",2,[],4,4,true,true]`

Run `npm run build` again and confirm `dist.tmp-*` and `dist.old-*` do not exist (`ls -d dist*` prints only `dist`).

- [ ] **Step 6: Commit**

```bash
git add src/pages/settings.html src/decoy.html build/obfuscate.js package.json package-lock.json .gitignore
git commit -m "feat: add build step that obfuscates the settings page"
```

(`git mv` already staged the removal of `static/settings.html`.)

---

### Task 2: Serve the built settings page

**Files:**
- Create: `utils/builtPages.js`
- Modify: `index.js:15` (import), `index.js:359` (mount before static), `index.js:376` (remove `/s` route)

**Interfaces:**
- Consumes: `buildPage`, `PAGES_DIR`, `DECOY_PATH`, `DIST_DIR`, `BUILD_SCRIPT` from `build/obfuscate.js`.
- Produces: `getBuiltPage(name: string): string` and `mountBuiltPages(app): void` from `utils/builtPages.js`.

- [ ] **Step 1: Write `utils/builtPages.js`**

```javascript
import { statSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  buildPage,
  PAGES_DIR,
  DECOY_PATH,
  DIST_DIR,
  BUILD_SCRIPT,
} from "../build/obfuscate.js";

// name -> { key, html }; key changes when the file to serve changes.
const cache = new Map();

function mtime(file) {
  try {
    return statSync(file).mtimeMs;
  } catch {
    return 0;
  }
}

// Serves dist/<name> when it is at least as new as everything it was built
// from. Otherwise builds in memory, so a fresh clone, a dev edit and a
// read-only filesystem all work without running the build.
export function getBuiltPage(name) {
  const sourceStamp = Math.max(
    mtime(path.join(PAGES_DIR, name)),
    mtime(DECOY_PATH),
    mtime(BUILD_SCRIPT),
  );
  const distPath = path.join(DIST_DIR, name);
  const distStamp = mtime(distPath);
  const key =
    distStamp >= sourceStamp ? `dist:${distStamp}` : `memory:${sourceStamp}`;

  const cached = cache.get(name);
  if (cached?.key === key) return cached.html;

  const html = key.startsWith("dist:")
    ? readFileSync(distPath, "utf8")
    : buildPage(name);
  cache.set(name, { key, html });
  return html;
}

export function mountBuiltPages(app) {
  app.get(["/s", "/settings", "/settings.html"], (req, res, next) => {
    try {
      res
        .set("Cache-Control", "no-cache")
        .type("html")
        .send(getBuiltPage("settings.html"));
    } catch (error) {
      next(error);
    }
  });
}
```

- [ ] **Step 2: Wire it into `index.js`**

After the line `import { mountProxyAssets } from "./utils/proxyAssets.js";` add:

```javascript
import { mountBuiltPages } from "./utils/builtPages.js";
```

Immediately before `app.use(express.static(path.join(__dirname, "static"), staticOptions));` add:

```javascript
  mountBuiltPages(app);
```

Delete this line from the `routes` array:

```javascript
    { path: "/s", file: "settings.html" },
```

- [ ] **Step 3: Start the server**

Run: `node --check index.js && node --check utils/builtPages.js`
Expected: no output.

Start the server in the background with `PORT=8090 node .` (uses the dev database in `.env`). Wait until `curl -s -o /dev/null -w '%{http_code}' http://localhost:8090/` prints `200`.

- [ ] **Step 4: Verify the three URLs and that the source is not reachable**

```bash
for p in /s /settings /settings.html; do
  curl -s -D - "http://localhost:8090$p" -o /tmp/out.html | grep -i -E '^HTTP|cache-control'
  grep -c 'data-edu="1"' /tmp/out.html
  grep -c 'settings-page' /tmp/out.html
done
for p in /src/pages/settings.html /src/decoy.html /build/obfuscate.js /dist/settings.html; do
  curl -s -o /dev/null -w "$p %{http_code}\n" "http://localhost:8090$p"
done
```

Expected: each of the three pages gives `HTTP/1.1 200 OK`, `Cache-Control: no-cache`, marker count `1`, `settings-page` count `0`. Each of the four source paths gives `404`.

Fallback check: `rm -rf dist`, request `/s` again, expect the same result (built in memory). Then `touch src/pages/settings.html && npm run build` and request again, expect the same result.

- [ ] **Step 5: Verify the page in a browser (Review Focus 1)**

Open `http://localhost:8090/s` in a browser (the Playwright browser tools are fine). Confirm all of:

- The settings page renders with its styles and the nav bar icons.
- The tab title is `Google`, or the saved cloak title, not the decoy title.
- The console has no errors that are absent on `http://localhost:8090/g`.
- Changing one control (for example a tab cloak option) works and survives a reload.
- The import confirmation modal opens and cancels.
- View source shows only the decoy head, the loader and the `<noscript>` text.

If a control is dead, the cause is script order or placement: compare against the original by temporarily serving `src/pages/settings.html` unbuilt, fix `splitPage` in `build/obfuscate.js`, rebuild and recheck. Do not continue until this step passes.

Stop the background server.

- [ ] **Step 6: Commit**

```bash
git add utils/builtPages.js index.js
git commit -m "feat: serve the built settings page with an in-memory fallback"
```

---

### Task 3: pm2 ecosystem file and ready signal

**Files:**
- Create: `ecosystem.config.cjs`
- Modify: `index.js` (the `server.on("listening", ...)` handler near line 423)

**Interfaces:**
- Produces: `ecosystem.config.cjs` at the repo root, app name `55gms`; `deploy.sh` runs `pm2 reload ecosystem.config.cjs --update-env`.

- [ ] **Step 1: Write `ecosystem.config.cjs`**

```javascript
// pm2 settings for production. `pm2 reload ecosystem.config.cjs` replaces
// workers one at a time; wait_ready makes pm2 wait for index.js to report
// that it is listening before it retires the old worker.
module.exports = {
  apps: [
    {
      name: "55gms",
      script: "index.js",
      cwd: __dirname,
      exec_mode: "cluster",
      instances: 10,
      wait_ready: true,
      listen_timeout: 15000,
      // index.js gives itself 5 seconds to shut down.
      kill_timeout: 6000,
    },
  ],
};
```

- [ ] **Step 2: Send the ready signal**

In `index.js`, change the listening handler to:

```javascript
  server.on("listening", () => {
    console.log(`\n------------------------------------`);
    console.log(`🔗 URL: http://localhost:${process.env.PORT}`);
    console.log(`------------------------------------\n`);
    // Tells pm2 (wait_ready) this worker can take traffic. No-op otherwise.
    process.send?.("ready");
  });
```

- [ ] **Step 3: Verify**

Run: `node --check index.js && node -e 'console.log(require("./ecosystem.config.cjs").apps[0].instances)'`
Expected: `10`

Run `PORT=8090 node .` in the background, confirm `curl -s -o /dev/null -w '%{http_code}' http://localhost:8090/` prints `200` (the signal is a no-op outside pm2), then stop it.

- [ ] **Step 4: Commit**

```bash
git add ecosystem.config.cjs index.js
git commit -m "feat: add pm2 ecosystem file and ready signal for rolling reloads"
```

---

### Task 4: Server deploy scripts

**Files:**
- Create: `deploy/entry.sh`, `deploy/deploy.sh` (both mode 755)

**Interfaces:**
- Consumes: `npm run build`, `ecosystem.config.cjs`, the loader marker `data-edu="1"`, `GET /` returning 200.
- Produces:
  - `entry.sh` reads `SSH_ORIGINAL_COMMAND`: `deploy <40-hex-sha>`, `rollback`, or `status` (default). Exit 0 on success, non-zero on failure.
  - `deploy.sh <sha>` exits 0 after a healthy deploy, 1 after a failed deploy that was restored.
  - Both honour `APP_DIR` (default `/root/55gms`) and `STATE_DIR` (default `/root/deploy`). `deploy.sh` also honours `LIVE_PORT` (8080), `PREFLIGHT_PORT` (8099) and `PM2_RELOAD` (default `pm2 reload ecosystem.config.cjs --update-env`), which exist so the script can be exercised away from production.
  - `$STATE_DIR/releases.log`: one line per successful deploy, `<UTC timestamp> <sha>`.

- [ ] **Step 1: Write `deploy/entry.sh`**

```bash
#!/usr/bin/env bash
# The only command the GitHub Actions deploy key may run (forced command in
# /root/.ssh/authorized_keys). Installed by hand at /root/deploy/entry.sh;
# reinstall it when this file changes.
set -euo pipefail

APP_DIR="${APP_DIR:-/root/55gms}"
STATE_DIR="${STATE_DIR:-/root/deploy}"
LOG="$STATE_DIR/releases.log"

die() {
  echo "deploy: $*" >&2
  exit 1
}

read -r action sha _ <<<"${SSH_ORIGINAL_COMMAND:-status}"

case "$action" in
  status)
    echo "current: $(git -C "$APP_DIR" rev-parse HEAD)"
    echo "recent deploys:"
    tail -n 5 "$LOG" 2>/dev/null || true
    exit 0
    ;;
  deploy)
    [[ "${sha:-}" =~ ^[0-9a-f]{40}$ ]] || die "expected: deploy <40-character sha>"
    ;;
  rollback)
    # Second most recent distinct sha that deployed successfully.
    sha="$(tac "$LOG" 2>/dev/null | awk '!seen[$2]++ {print $2}' | sed -n 2p)"
    [[ -n "$sha" ]] || die "no earlier deploy recorded in $LOG"
    ;;
  *)
    die "unknown request: $action"
    ;;
esac

mkdir -p "$STATE_DIR"
exec 9>"$STATE_DIR/lock"
flock -w 600 9 || die "another deploy has held the lock for 10 minutes"

git -C "$APP_DIR" fetch --quiet origin main
git -C "$APP_DIR" merge-base --is-ancestor "$sha" origin/main ||
  die "$sha is not on origin/main"

# Run the deploy script that belongs to the target commit, from a copy, so
# the checkout cannot rewrite it mid-run. Commits older than the pipeline
# fall back to the installed copy.
script="$(mktemp)"
trap 'rm -f "$script"' EXIT
if ! git -C "$APP_DIR" show "$sha:deploy/deploy.sh" >"$script" 2>/dev/null; then
  cp "$STATE_DIR/deploy.sh" "$script" || die "no deploy.sh for $sha"
fi

echo "deploy: $action $sha"
APP_DIR="$APP_DIR" STATE_DIR="$STATE_DIR" bash "$script" "$sha" 2>&1 |
  tee -a "$STATE_DIR/deploy.log"
exit "${PIPESTATUS[0]}"
```

- [ ] **Step 2: Write `deploy/deploy.sh`**

```bash
#!/usr/bin/env bash
# Deploys one commit of 55GMS in place. Run by deploy/entry.sh, never by hand
# from the working tree (the checkout would rewrite the running script).
#
# errexit is not relied on: bash ignores it inside functions called from an
# `if`, so every step that can fail ends in `|| return 1`.
set -uo pipefail

sha="${1:?usage: deploy.sh <sha>}"
APP_DIR="${APP_DIR:-/root/55gms}"
STATE_DIR="${STATE_DIR:-/root/deploy}"
LIVE_PORT="${LIVE_PORT:-8080}"
PREFLIGHT_PORT="${PREFLIGHT_PORT:-8099}"
PM2_RELOAD="${PM2_RELOAD:-pm2 reload ecosystem.config.cjs --update-env}"
MARKER='data-edu="1"'

cd "$APP_DIR" || exit 1
reloaded=0

log() { echo "[$(date -u +%FT%TZ)] $*"; }

# A reload drops chat and proxy websockets, so skip it when only files that
# are read from disk per request (or never served) changed.
needs_reload() {
  git diff --name-only "$1" "$2" |
    grep -qvE '^(static/|src/|docs/|\.github/|tests?/)|\.md$'
}

install_and_build() {
  if ! git diff --quiet "$1" "$2" -- package-lock.json; then
    log "package-lock.json changed, installing"
    # In place, not `npm ci`: wiping node_modules would 404 the proxy
    # bundles that are served from it while the install runs.
    npm install --omit=dev --no-save --no-audit --no-fund || return 1
  fi
  npm run --silent build || return 1
}

# Boots the new code on a spare port before any live worker is replaced.
preflight() {
  local pid ok=1
  PORT="$PREFLIGHT_PORT" node index.js >"$STATE_DIR/preflight.log" 2>&1 &
  pid=$!
  for _ in $(seq 1 20); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$PREFLIGHT_PORT/"; then
      ok=0
      break
    fi
    kill -0 "$pid" 2>/dev/null || break
    sleep 1
  done
  kill "$pid" 2>/dev/null
  wait "$pid" 2>/dev/null
  if [[ "$ok" != 0 ]]; then
    log "preflight boot failed:"
    tail -n 20 "$STATE_DIR/preflight.log"
    return 1
  fi
}

health() {
  for _ in $(seq 1 30); do
    if curl -fsS -o /dev/null "http://127.0.0.1:$LIVE_PORT/" &&
      curl -fsS "http://127.0.0.1:$LIVE_PORT/s" | grep -q "$MARKER"; then
      return 0
    fi
    sleep 1
  done
  log "health check failed on port $LIVE_PORT"
  return 1
}

# apply <from> <to> <preflight: yes|no>
apply() {
  install_and_build "$1" "$2" || return 1
  if needs_reload "$1" "$2"; then
    if [[ "$3" == yes ]]; then
      preflight || return 1
    fi
    log "reloading"
    reloaded=1
    $PM2_RELOAD || return 1
  else
    log "no backend changes, not reloading"
  fi
  health || return 1
}

if [[ -n "$(git status --porcelain -uno)" ]]; then
  log "tracked files have local changes; refusing to deploy"
  git status --short -uno
  exit 1
fi

previous="$(git rev-parse HEAD)"

if [[ "$previous" == "$sha" ]]; then
  log "$sha is already checked out; rebuilding"
  npm run --silent build && health || exit 1
  echo "$(date -u +%FT%TZ) $sha" >>"$STATE_DIR/releases.log"
  exit 0
fi

log "deploying $previous -> $sha"
git checkout --quiet --detach "$sha" || exit 1

if apply "$previous" "$sha" yes; then
  echo "$(date -u +%FT%TZ) $sha" >>"$STATE_DIR/releases.log"
  log "deployed $sha"
  exit 0
fi

log "deploy failed; restoring $previous"
git checkout --quiet --detach "$previous" || {
  log "RESTORE FAILED: could not check out $previous"
  exit 1
}
install_and_build "$sha" "$previous" || log "RESTORE: install or build failed"
if [[ "$reloaded" == 1 ]]; then
  $PM2_RELOAD || log "RESTORE: reload failed"
fi
if health; then
  log "restored $previous"
else
  log "RESTORE FAILED: site is unhealthy on $previous"
fi
exit 1
```

- [ ] **Step 3: Make both executable and syntax-check them**

```bash
chmod +x deploy/entry.sh deploy/deploy.sh
bash -n deploy/entry.sh && bash -n deploy/deploy.sh && echo ok
```

Expected: `ok`. If `shellcheck` is installed, run `shellcheck deploy/*.sh` and fix anything other than SC2086 on `$PM2_RELOAD` (word splitting is intended there).

- [ ] **Step 4: Rehearse `deploy.sh` locally (Review Focus 2 and 3)**

The rehearsal runs against a throwaway clone so the real working tree is never checked out to another commit. Commit Tasks 1 to 3 first (already done), then commit this task's files (Step 5) before rehearsing, because the clone needs them.

```bash
REH="$TMPDIR/55gms-rehearsal"; rm -rf "$REH"; mkdir -p "$REH/state"
git clone --quiet --no-checkout --shared . "$REH/app"
git -C "$REH/app" sparse-checkout set --no-cone '/*' '!/static/misc/'
git -C "$REH/app" checkout --quiet --detach HEAD~1
cp .env "$REH/app/.env"
(cd "$REH/app" && npm install --omit=dev --no-audit --no-fund >/dev/null)
```

Start a "live" server from the clone on port 8091 in the background: `cd "$REH/app" && PORT=8091 node index.js`. Wait for `/` to return 200.

Rehearsal A, healthy deploy with a stubbed reload:

```bash
TARGET="$(git rev-parse HEAD)"
git show "$TARGET:deploy/deploy.sh" >"$REH/deploy.sh"
APP_DIR="$REH/app" STATE_DIR="$REH/state" LIVE_PORT=8091 PREFLIGHT_PORT=8092 \
  PM2_RELOAD="echo stub-reload" bash "$REH/deploy.sh" "$TARGET"; echo "exit=$?"
cat "$REH/state/releases.log"; git -C "$REH/app" rev-parse HEAD
```

Expected: log lines `deploying … -> …`, `stub-reload`, `deployed <sha>`; `exit=0`; one line in `releases.log`; the clone's HEAD equals `$TARGET`. (The stub does not restart the 8091 server, so `/s` is served by the server started from the older commit only if that commit already had the handler; if the health check fails for that reason, restart the 8091 server from the clone and rerun, which takes the "already checked out" path and must exit 0.)

Rehearsal B, a commit that crashes on boot is caught by the preflight and restored:

```bash
git -C "$REH/app" checkout --quiet -b broken
echo 'throw new Error("rehearsal crash");' >>"$REH/app/routes/auth.js"
git -C "$REH/app" commit --quiet -am "test: crash on boot"
BROKEN="$(git -C "$REH/app" rev-parse HEAD)"
git -C "$REH/app" checkout --quiet --detach "$TARGET"
APP_DIR="$REH/app" STATE_DIR="$REH/state" LIVE_PORT=8091 PREFLIGHT_PORT=8092 \
  PM2_RELOAD="echo stub-reload" bash "$REH/deploy.sh" "$BROKEN"; echo "exit=$?"
git -C "$REH/app" rev-parse HEAD; wc -l <"$REH/state/releases.log"
```

Expected: `preflight boot failed:` followed by the `rehearsal crash` stack, no `stub-reload` line, `deploy failed; restoring …`, `restored …`, `exit=1`; HEAD is `$TARGET` again; `releases.log` still has the same number of lines as before.

Rehearsal C, a docs-only commit does not reload:

```bash
git -C "$REH/app" checkout --quiet -b docsonly "$TARGET"
echo "rehearsal" >>"$REH/app/README.md"
git -C "$REH/app" commit --quiet -am "docs: rehearsal"
DOCS="$(git -C "$REH/app" rev-parse HEAD)"
git -C "$REH/app" checkout --quiet --detach "$TARGET"
APP_DIR="$REH/app" STATE_DIR="$REH/state" LIVE_PORT=8091 PREFLIGHT_PORT=8092 \
  PM2_RELOAD="echo stub-reload" bash "$REH/deploy.sh" "$DOCS"; echo "exit=$?"
```

Expected: `no backend changes, not reloading`, `deployed …`, `exit=0`, no `stub-reload` line.

Stop the 8091 server and `rm -rf "$REH"`. If any rehearsal deviates, fix `deploy/deploy.sh`, amend the commit from Step 5, and rerun all three.

- [ ] **Step 5: Commit** (before Step 4, as noted there)

```bash
git add deploy/entry.sh deploy/deploy.sh
git commit -m "feat: add server deploy scripts with preflight, health check and restore"
```

---

### Task 5: GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/main.yml`
- Delete: `.github/workflows/minify.yml`

**Interfaces:**
- Consumes: repository secrets `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_KNOWN_HOSTS` (created in Task 7); `entry.sh` requests `deploy <sha>` and `rollback`.
- Produces: workflow `Deploy`, runnable from the Actions tab with input `action` = `deploy` or `rollback`.

`minify.yml` is deleted, not moved: its output folder `static/assets/min/` does not exist and nothing references it. Prettier moves into the deploy workflow because commits pushed with `GITHUB_TOKEN` do not trigger workflows, so its bot commit would otherwise never be deployed.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      action:
        description: Deploy the tip of main, or go back to the previous deploy
        type: choice
        options: [deploy, rollback]
        default: deploy

# One deploy at a time; GitHub keeps only the newest waiting run.
concurrency:
  group: deploy-production
  cancel-in-progress: false

permissions:
  contents: read

jobs:
  tidy:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout without the games
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          filter: blob:none
          sparse-checkout-cone-mode: false
          sparse-checkout: |
            /*
            !/static/misc/

      - name: Prettify code
        uses: creyD/prettier_action@v4.3
        with:
          prettier_options: --write **/*.{js,md}
          only_changed: True

  check:
    needs: tidy
    if: ${{ !cancelled() && needs.tidy.result != 'failure' && inputs.action != 'rollback' }}
    runs-on: ubuntu-latest
    outputs:
      sha: ${{ steps.sha.outputs.sha }}
    steps:
      # The tip of main, so a Prettier commit from the tidy job is included.
      - name: Checkout without the games
        uses: actions/checkout@v4
        with:
          ref: main
          filter: blob:none
          sparse-checkout-cone-mode: false
          sparse-checkout: |
            /*
            !/static/misc/

      - id: sha
        run: echo "sha=$(git rev-parse HEAD)" >> "$GITHUB_OUTPUT"

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Syntax check server code
        run: |
          for f in index.js setup-db.js $(git ls-files routes services utils models config build | grep '\.js$'); do
            node --check "$f"
          done
          bash -n deploy/entry.sh
          bash -n deploy/deploy.sh

      - run: npm run build

      - name: Built settings page is the decoy
        run: |
          grep -q 'data-edu="1"' dist/settings.html
          ! grep -q 'settings-page' dist/settings.html

  deploy:
    needs: check
    if: ${{ !cancelled() && needs.check.result == 'success' && github.repository_owner == '55gms' }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy ${{ needs.check.outputs.sha }}
        env:
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
          REQUEST: deploy ${{ needs.check.outputs.sha }}
        run: |
          install -m 700 -d ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
            "root@$DEPLOY_HOST" "$REQUEST"

  rollback:
    if: ${{ github.event_name == 'workflow_dispatch' && inputs.action == 'rollback' && github.repository_owner == '55gms' }}
    runs-on: ubuntu-latest
    steps:
      - name: Roll back to the previous deploy
        env:
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
        run: |
          install -m 700 -d ~/.ssh
          printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes \
            "root@$DEPLOY_HOST" rollback
```

- [ ] **Step 2: Limit `main.yml` to pull requests and delete `minify.yml`**

In `.github/workflows/main.yml` replace the `on:` block with:

```yaml
on:
  pull_request:
    branches: [main]
```

```bash
git rm --quiet .github/workflows/minify.yml
```

- [ ] **Step 3: Verify**

```bash
node --input-type=commonjs -e '
const y = require("fs").readFileSync(".github/workflows/deploy.yml", "utf8");
if (/\t/.test(y)) throw new Error("tab in yaml");
console.log(["tidy:", "check:", "deploy:", "rollback:"].every((j) => y.includes("\n  " + j)));
'
```

Expected: `true`. If `actionlint` is installed, run `actionlint .github/workflows/deploy.yml` and expect no output.

Run the same checks the `check` job runs, locally:

```bash
for f in index.js setup-db.js $(git ls-files routes services utils models config build | grep '\.js$'); do node --check "$f" || echo "FAIL $f"; done
npm run build && grep -q 'data-edu="1"' dist/settings.html && ! grep -q 'settings-page' dist/settings.html && echo checks-pass
```

Expected: no `FAIL` lines, then `checks-pass`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml .github/workflows/main.yml
git commit -m "ci: add deploy workflow and retire the unused minify action"
```

---

### Task 6: Documentation

**Files:**
- Create: `docs/deploy.md`
- Modify: `CLAUDE.md` (Commands, Backend layout, Frontend, Deployment, CI sections)

- [ ] **Step 1: Write `docs/deploy.md`**

```markdown
# Deploying 55GMS

Production is one server (SSH host `55gms`): the app in `/root/55gms`, run by
pm2 as `55gms` (10 workers, port 8080), behind Caddy.

## What happens on a push to main

The `Deploy` workflow (`.github/workflows/deploy.yml`) runs:

1. **tidy** formats changed `.js` and `.md` files with Prettier and pushes a
   commit if anything changed.
2. **check** takes the tip of `main`, installs, syntax-checks the server code
   and runs the build.
3. **deploy** SSHes to the server and asks for that commit.

On the server, `/root/deploy/entry.sh` checks the commit is on `main`, then
runs that commit's `deploy/deploy.sh`, which:

- checks the commit out in place;
- runs `npm install` if `package-lock.json` changed;
- runs `npm run build`;
- if anything outside `static/`, `src/`, `docs/`, `.github/`, `test(s)/` and
  `*.md` changed: boots the new code on port 8099 as a preflight, then
  `pm2 reload ecosystem.config.cjs`;
- checks `/` and `/s` on port 8080.

If any step fails, the previous commit is put back and the workflow run goes
red. Commits that only add or change games do not reload the app, so chat and
proxy connections are not dropped.

## Rolling back

Actions tab → Deploy → Run workflow → `rollback`. This deploys the previous
successful commit. Running it twice returns to where you started.

## Looking at the server

- `/root/deploy/releases.log`: every successful deploy, newest last.
- `/root/deploy/deploy.log`: full output of every deploy.
- `/root/deploy/preflight.log`: output of the last preflight boot.
- `pm2 logs 55gms`: the app.

To deploy by hand from the server:

    SSH_ORIGINAL_COMMAND="deploy $(git -C /root/55gms rev-parse origin/main)" /root/deploy/entry.sh

## The build

`npm run build` (`build/obfuscate.js`) turns each page in `src/pages/` into
`dist/<page>`: the shell in `src/decoy.html` plus the real page as an
encrypted payload that a small inline loader decrypts in the browser. Only
the settings page is built this way today.

- Edit `src/pages/settings.html`, never `dist/`.
- In development no build is needed: the server builds in memory whenever
  `dist/` is missing or older than the source.
- To add a page: move it from `static/` to `src/pages/`, add its URLs to
  `mountBuiltPages` in `utils/builtPages.js`, remove it from the `routes`
  table in `index.js`, and check every script on it in a browser.

This deters copying and keeps the page text out of static HTML. It is not
protection: the key ships with the page, and JS and CSS are served as plain
files.

## Setting it up again

- `/root/deploy/entry.sh` and `/root/deploy/deploy.sh` are copies of the files
  in `deploy/`. Copy them again when `deploy/entry.sh` changes.
- The deploy key's line in `/root/.ssh/authorized_keys` starts with
  `command="/root/deploy/entry.sh",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`.
- Repository secrets: `DEPLOY_SSH_KEY` (private key), `DEPLOY_HOST`,
  `DEPLOY_KNOWN_HOSTS` (output of `ssh-keyscan -t ed25519 <host>`).
- pm2 is started with `pm2 start ecosystem.config.cjs && pm2 save`.

## Custom domains

Caddy's catch-all block proxies every hostname to `localhost:8080` and issues
certificates on demand. Deploys never touch Caddy; they only need port 8080
to keep answering, which the rolling reload does.
```

- [ ] **Step 2: Update `CLAUDE.md`**

Replace the Commands block and the sentence after it with:

````markdown
```bash
# Run the server (default port 8080)
node .

# Initialize the database (run once before first start)
node setup-db.js

# Build dist/ (obfuscated pages). Optional locally: the server builds in memory when dist/ is stale
npm run build
```

Server code is ES6 modules run directly by Node.js. The only build step is `npm run build`, which obfuscates the pages in `src/pages/` into `dist/`.
````

Add these rows to the Backend layout table, after the `utils/blockingCache.js` row:

```markdown
| `utils/builtPages.js`    | Serves built pages (`/s`) from `dist/`, or builds them in memory when `dist/` is stale            |
| `build/obfuscate.js`     | Build step: `src/pages/*.html` + `src/decoy.html` → `dist/`                                       |
| `deploy/`                | Server-side deploy scripts run by the GitHub Actions deploy key                                   |
| `ecosystem.config.cjs`   | pm2 settings for production                                                                       |
```

In the Frontend section, change the first bullet and add one after it:

```markdown
- `static/*.html` — page templates (no templating engine; plain HTML)
- `src/pages/settings.html` — the settings page source; served obfuscated from `dist/`, never from `static/`
```

Replace the Deployment section body with:

```markdown
Production is a single server (SSH host `55gms`) running pm2 behind Caddy. A push to `main` is deployed by the `Deploy` GitHub Actions workflow, which SSHes in with a key limited to `/root/deploy/entry.sh`; that runs the commit's `deploy/deploy.sh` (checkout, install, build, preflight, rolling reload, health check, restore on failure). See `docs/deploy.md`. Do not edit files on the server by hand: the deploy refuses to run over local changes.

`render.yaml` and `vercel.json` remain for forks; their start command is `node .`.
```

Replace the CI section body with:

```markdown
`.github/workflows/deploy.yml` runs on every push to `main`: Prettier (auto-commits), syntax checks, the build, then the deploy. `.github/workflows/main.yml` runs Prettier on pull requests. There are no automated tests.
```

- [ ] **Step 3: Commit**

```bash
git add docs/deploy.md CLAUDE.md
git commit -m "docs: document the deploy pipeline and build step"
```

---

### Task 7: Cutover

Manual, in order. Steps marked **(prod)** change the production server or the public repo: state what the step will do and wait for the user's go-ahead before each one. Stop and report if any expected result does not match.

**Interfaces:**
- Consumes: everything from Tasks 1 to 6, committed on local `main` and not yet pushed.

- [ ] **Step 1: Create the deploy key and host key file (local, no prod change)**

```bash
K="<scratchpad>/deploy-key"; mkdir -p "$K"; chmod 700 "$K"
ssh-keygen -q -t ed25519 -N "" -C "github-actions-deploy" -f "$K/id"
ssh-keyscan -t ed25519 152.53.37.155 2>/dev/null >"$K/known_hosts"
ssh-keygen -F 152.53.37.155 -f ~/.ssh/known_hosts | grep ed25519 | awk '{print $3}'
awk '{print $3}' "$K/known_hosts"
```

Expected: the last two commands print the same key. If they differ, stop.

- [ ] **Step 2 (prod): Install the entry script, fallback script and release log**

```bash
ssh 55gms 'mkdir -p /root/deploy && chmod 700 /root/deploy'
scp deploy/entry.sh deploy/deploy.sh 55gms:/root/deploy/
ssh 55gms 'chmod 755 /root/deploy/entry.sh /root/deploy/deploy.sh &&
  [ -s /root/deploy/releases.log ] ||
  echo "$(date -u +%FT%TZ) $(git -C /root/55gms rev-parse HEAD)" >/root/deploy/releases.log;
  SSH_ORIGINAL_COMMAND=status /root/deploy/entry.sh'
```

Expected: `current: <sha>` and one line under `recent deploys:`.

- [ ] **Step 3 (prod): Authorize the deploy key, limited to the entry script**

```bash
PUB="$(cat "$K/id.pub")"
ssh 55gms "cp /root/.ssh/authorized_keys /root/.ssh/authorized_keys.pre-deploy &&
  echo 'command=\"/root/deploy/entry.sh\",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding $PUB' >>/root/.ssh/authorized_keys &&
  tail -n 1 /root/.ssh/authorized_keys | cut -c1-90"
```

Expected: a line starting `command="/root/deploy/entry.sh",no-pty,`.

- [ ] **Step 4: Prove the key is limited (Review Focus 5)**

```bash
D="ssh -i $K/id -o IdentitiesOnly=yes -o UserKnownHostsFile=$K/known_hosts root@152.53.37.155"
$D status;                                             echo "exit=$?"
$D 'cat /root/55gms/.env';                             echo "exit=$?"
$D 'deploy main; id';                                  echo "exit=$?"
$D deploy 0000000000000000000000000000000000000000;    echo "exit=$?"
$D </dev/null;                                         echo "exit=$?"
```

Expected, in order: the status output, exit 0; `deploy: unknown request: cat`, exit 1; `deploy: expected: deploy <40-character sha>`, exit 1; an error that the sha is not on origin/main, exit non-zero; the status output (no shell), exit 0. No `.env` content and no `uid=` output anywhere.

- [ ] **Step 5 (prod): Add the repository secrets**

```bash
gh secret set DEPLOY_SSH_KEY --repo 55gms/55gms <"$K/id"
gh secret set DEPLOY_KNOWN_HOSTS --repo 55gms/55gms <"$K/known_hosts"
gh secret set DEPLOY_HOST --repo 55gms/55gms --body 152.53.37.155
gh secret list --repo 55gms/55gms
```

Expected: the three names are listed. Then `rm -rf "$K"`; the private key now exists only as a GitHub secret.

- [ ] **Step 6 (prod): Turn off the cron deploy**

This must happen before the push. The running workers still serve `/s` from `static/settings.html`, so a cron pull of the new commits would delete that file and 404 the settings page until a reload, and the 02:00 reload would crash on the missing `node-html-parser`.

```bash
ssh 55gms 'crontab -l >/root/deploy/crontab.pre-cutover &&
  crontab -l | sed -E "s#^([^#].*/root/cron/(update|restart)\.sh.*)#\# disabled 2026-10: replaced by GitHub Actions deploy \# \1#" | crontab - &&
  crontab -l'
```

Expected: the `update.sh` and `restart.sh` lines are commented out; the pterodactyl line is unchanged.

- [ ] **Step 7 (prod): Push and watch the first deploy**

Check `git log --oneline origin/main..main` lists only this plan's commits (plus the spec and plan docs), then:

```bash
git push origin main
gh run watch --repo 55gms/55gms "$(gh run list --repo 55gms/55gms --workflow Deploy --limit 1 --json databaseId -q '.[0].databaseId')"
```

Expected: `tidy`, `check` and `deploy` succeed. The deploy log shows `package-lock.json changed, installing`, `reloading`, `deployed <sha>`. If Prettier pushed a commit, run `git pull --ff-only` locally afterwards.

If the deploy job fails, read its log: the script will already have restored the previous commit. Fix forward locally and push again; do not edit files on the server.

- [ ] **Step 8: Verify production**

```bash
ssh 55gms 'SSH_ORIGINAL_COMMAND=status /root/deploy/entry.sh; pm2 jlist | node -e "let s=\"\";process.stdin.on(\"data\",d=>s+=d).on(\"end\",()=>{const a=JSON.parse(s).filter(p=>p.name===\"55gms\");console.log(a.length,\"workers\",a.every(p=>p.pm2_env.status===\"online\"),\"wait_ready=\"+a[0].pm2_env.wait_ready)})"'
curl -s https://55gms.com/s | grep -c 'data-edu="1"'
curl -s -o /dev/null -w '%{http_code}\n' https://55gms.com/src/pages/settings.html
```

Expected: current sha equals `git rev-parse origin/main`; `10 workers true`; marker count `1`; `404`. Ask the user for one custom domain and confirm `https://<custom-domain>/s` returns the same marker with a valid certificate. Open `/s` in a browser on production and confirm the settings page works.

- [ ] **Step 9 (prod): Put pm2 on the ecosystem file, if it is not already**

Only if Step 8 printed `wait_ready=undefined` or `false`. This is the one restart that is not rolling; the site is unreachable for a few seconds.

```bash
ssh 55gms 'cd /root/55gms && pm2 delete 55gms && pm2 start ecosystem.config.cjs && pm2 save && sleep 8 &&
  curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/'
```

Expected: `200`. Rerun the Step 8 checks; `wait_ready=true`.

- [ ] **Step 10 (prod): Confirm a static-only deploy does not reload**

Note the worker start times (`ssh 55gms 'pm2 jlist' | …pm_uptime`), push a commit that only touches a file under `docs/` (a real improvement to `docs/deploy.md` if one is pending, otherwise ask the user whether to skip this step), watch the run, and confirm the deploy log says `no backend changes, not reloading` and the worker start times are unchanged.

- [ ] **Step 11 (prod, optional): Confirm a broken commit is caught and the rollback button works**

Ask the user whether to run this on production. If yes: push a commit that adds `throw new Error("deploy test");` to the end of `routes/search.js`. Expected: the `deploy` job fails with `preflight boot failed`, the site stays up throughout (`curl` it during the run), and `status` still shows the previous sha. Then push a revert commit and confirm it deploys. Finally run the workflow by hand with `rollback`, confirm `status` shows the earlier sha, and run it with `deploy` to return to the tip.

- [ ] **Step 12 (prod): Remove the leftover pack files**

```bash
ssh 55gms 'pgrep -x git >/dev/null && echo "git is running, stop" ||
  { ls /root/55gms/.git/objects/pack/tmp_pack_* 2>/dev/null | wc -l; du -sh /root/55gms/.git; }'
```

Show the user the count and size and get a go-ahead, then:

```bash
ssh 55gms 'pgrep -x git >/dev/null && echo "git is running, stop" ||
  { rm -f /root/55gms/.git/objects/pack/tmp_pack_*; du -sh /root/55gms/.git; git -C /root/55gms fsck --connectivity-only --no-dangling 2>&1 | tail -n 3; }'
```

Expected: `.git` drops from about 41 GB to about 6.5 GB and `fsck` reports no errors.

- [ ] **Step 13: Record the new state**

Update the memory note `accounts-cutover-to-postgres.md` where it says rollback is "`pm2 reload 55gms`" to mention deploys now go through GitHub Actions, and add a memory note that production deploys are driven by the `Deploy` workflow and files on the server must not be edited by hand. Tell the user: what was changed on the server, where the backups are (`/root/deploy/crontab.pre-cutover`, `/root/.ssh/authorized_keys.pre-deploy`), and how to undo the cutover (restore the crontab from the backup).

# Deploy pipeline and client-asset build, phases 1 and 2

Date: 2026-10-08

Supersedes `2026-10-07-deploy-pipeline-design.md` (the settings-only decoy
page approach; kept in git history at `049aff2b`). Phases 3 to 5 are sketched
separately in `2026-10-08-build-phases-3-5.md` and each gets its own spec.

## Goal

Two things, shipped together:

1. Replace the cron `git pull` deploy on the production server (`55gms` SSH
   host, `/root/55gms`, pm2 app `55gms`) with a deploy that GitHub Actions
   drives: install, build, health-check, rolling reload, rollback.
2. Add a deploy-time build that reads `static/` and writes a transformed copy
   the server serves instead. The site's own JavaScript, page markup and game
   catalogue carry no readable strings a content filter can match on, and
   differ on every build so a signature matched to one deploy fails the next.

Success means:

- A push to `main` is live within a few minutes without anyone using SSH.
- A failed deploy restores the previous commit and shows red in Actions;
  rolling back is one button.
- In production, no served page shell, app script or catalogue file shows a
  game title or readable site text in its source, and every page renders and
  behaves exactly as today.
- `node .` on a fresh clone still works with no build run.
- Custom domains keep working throughout. Nothing in Caddy changes.

## Out of scope

Deferred to later phases (see the phases-3-5 doc):

- Randomizing the `/assets/lib/vendor-*.js` bundle names (phase 3).
- Renaming CSS selectors (phase 4).
- De-branding the proxy bundle bodies and re-keying the frame-token codec
  (phase 5).

Dropped entirely:

- Route randomization. The page routes are already one character (`/g`,
  `/a`, `/s`); randomizing them breaks every bookmark and shared chat link on
  each deploy, and `/g` cannot be safely search-replaced (it is also a regex
  flag). The cosmetic payoff is nil.

Never touched by the build:

- `static/misc/` and `static/img/` (symlinked through, not copied).
- `static/sw.js` and `static/assets/sj/` (copied byte-for-byte; a service
  worker whose bytes change every build forces an update on every user).
- Server code: `routes/`, `services/`, `models/`, `config/`, Socket.IO.

Also out of scope: Docker, Coolify, moving off pm2, any Caddy change.

## Current state

Server:

- `* * * * * /root/cron/update.sh` runs `git pull`; `0 2 * * *
  /root/cron/restart.sh` runs `pm2 reload 55gms`. No install, build or
  rollback.
- pm2 runs `index.js` in cluster mode, 10 workers, port 8080, started by hand,
  no ecosystem file.
- `.git` is 41 GB: a 6.4 GB pack plus leftover `tmp_pack_*` files.
- Caddy's catch-all `https://` block proxies every hostname to
  `localhost:8080` with on-demand TLS (~87,000 certificates). It needs only
  port 8080 to answer.

Repo:

- `static/` is ~9.3 GB: `misc/` 9.2 GB in 29,425 files, `img/` 131 MB, the
  rest ~3 MB. The transformable surface is 16 page shells (`static/*.html`),
  24 app scripts in `assets/js/` (excluding `easteregg.min.js` and
  `sdks/`), and three catalogue files in `assets/json/load/` (`g.json` 84 KB,
  `apps.json`, `packs.json`).
- `index.js` reads `static/` in five places: `express.static`
  (`index.js:359`), the extensionless `.html` fallback, the `routes` table,
  `/chat/:chatId`, and the 404 handler.
- Cache policy (`utils/httpPerformance.js`): `.html`, `.json`, `.txt`, `.xml`
  and `sw.js` are `no-cache`; everything else (JS, CSS, fonts, images) is
  `max-age` one day with `stale-while-revalidate` one week. Pages bump a
  manual `?v=N` query to force a refresh.
- 196 pages under `static/misc/` load site scripts by fixed URL
  (`/assets/js/script.js`, `loader-ui.js`, `game-loader.js`, `game-parts.js`,
  `unity-cdn-loader.js`, `font.js`, `packs.js`, `searchbar.v2.js`) and site
  CSS. Those URLs must keep resolving and those pages are never rewritten.
- The catalogue is fetched by `games.js` (`g.json`), `apps.js` (`apps.json`),
  `packs.js` (`packs.json`) and `loader-ui.js` (`g.json`). `games.html`
  preloads `g.json` with `<link rel="preload" as="fetch">`. Other JSON
  (`ads.json`, `motd.json`, `quotes.json`) is left plaintext — no game titles.
- All page scripts are classic scripts; none are `type="module"`. `test.html`
  has two `type="text/javascript"` inline blocks. `chat.html` contains a
  `<template>`.
- Inline event handlers exist in markup: 22 `onclick`, 6 `onkeyup`.
- `.github/workflows/main.yml` (Prettier) pushes a bot commit to `main`.
  Commits pushed with `GITHUB_TOKEN` do not trigger other workflows.
  `minify.yml` is dead (`static/assets/min/` does not exist; nothing reads it).

## Design

### Part A — Deploy pipeline

Identical in shape to the superseded spec; the build step is what changed.

**GitHub Actions (`.github/workflows/deploy.yml`)** runs on push to `main` and
on manual dispatch with an `action` input (`deploy` | `rollback`). Concurrency
group `deploy-production`, `cancel-in-progress: false`. Jobs:

1. `tidy` (push only): the Prettier step moved from `main.yml`, pushing its
   bot commit as today. `minify.yml` is deleted; `main.yml` keeps only its
   `pull_request` trigger.
2. `check`: checks out the tip of `main` (so a Prettier commit is included),
   sparse without `static/misc/`, `filter: blob:none`; `npm ci`; `node
   --check` on the server JS and `bash -n` on the deploy scripts; `npm run
   build`; asserts the built catalogue and a built page contain no readable
   title / site text.
3. `deploy`: SSHes to the server and sends `deploy <sha>` (the sha `check`
   verified). A `rollback` dispatch runs a `rollback` job that sends
   `rollback` instead.

Secrets: `DEPLOY_SSH_KEY` (a new ed25519 key used for nothing else),
`DEPLOY_HOST`, `DEPLOY_KNOWN_HOSTS`. The key's `authorized_keys` line is
prefixed `command="/root/deploy/entry.sh",no-pty,no-port-forwarding,
no-agent-forwarding,no-X11-forwarding`, so it can only run the deploy.

**Server scripts (in the repo under `deploy/`):**

- `deploy/entry.sh` (installed once at `/root/deploy/entry.sh`, the only
  command the key can run): reads `SSH_ORIGINAL_COMMAND` (`deploy <40-hex>`,
  `rollback`, `status`); `flock` so one deploy runs at a time; `git fetch` and
  refuses a sha not on `origin/main`; extracts `deploy/deploy.sh` from the
  target commit and runs it (falling back to the installed copy for commits
  older than the pipeline).
- `deploy/deploy.sh <sha>`: refuses to run over local changes; records the
  current commit; `git checkout --detach <sha>`; `npm install --omit=dev
  --no-save` if `package-lock.json` changed (not `npm ci` — wiping
  `node_modules` would 404 the proxy bundles served from it); `npm run build`;
  reloads only when a non-static file changed, after a **preflight** boot of
  the new code on port 8099; health-checks `/` and a built page on 8080; on
  any failure restores the previous commit, rebuilds, reloads and exits
  non-zero. Appends `timestamp sha` to `/root/deploy/releases.log`.

**pm2 ecosystem file (`ecosystem.config.cjs`)** in the repo: app `55gms`,
cluster, 10 instances, `wait_ready: true`, `listen_timeout: 15000`,
`kill_timeout: 6000`. `index.js` calls `process.send?.("ready")` once
listening, so a reload retires a worker only after its replacement serves.

### Part B — The build

`npm run build` runs `node scripts/build.js`. Stages live under
`scripts/build/`, one file per stage, each a pure function from an input
directory to an output directory plus the per-build secrets.

**Output layout.** The build writes a self-contained tree and swaps it in
atomically:

```
dist/
  current -> builds/<id>     symlink the server follows
  builds/<id>/
    static/                  the transformed copy the server serves
    manifest.json            { id, assetVersion, catalogueKey, routes:{} }
```

`<id>` is a random hex string generated per build. Old `builds/*` are pruned
to the last three.

**Stages, in order:**

1. **Prepare.** Make `builds/<id>/static/`. Symlink `misc/` and `img/` into it
   (never copy 9.2 GB). Copy `sw.js`, `assets/sj/`, `assets/cloaks/`,
   `assets/fonts/`, `assets/apps/`, `assets/404/` and the plaintext JSON
   (`ads.json`, `motd.json`, `quotes.json`) through unchanged. The remaining
   files (page shells, `assets/js/`, `assets/css/`, `assets/json/load/`) are
   the only ones later stages touch — an explicit allow-list, so a new kind of
   file under `static/` is passed through, never half-transformed.
2. **Secrets.** Generate `id`, `assetVersion` (replaces the manual `?v=N`), and
   `catalogueKey` (16 random bytes). Write them to `manifest.json`.
3. **JavaScript.** For each app script, Terser-minify then obfuscate with
   javascript-obfuscator in **script** mode: `stringArray` with RC4 at
   threshold 1, `splitStrings` (chunk 5), `controlFlowFlattening` 0.5,
   `identifierNamesGenerator: hexadecimal` with a per-file prefix,
   `transformObjectKeys: true`, **`renameGlobals: false`** (the front end
   leans on globals `$`, `io`, `frameRuntime.*`), and `deadCodeInjection`,
   `selfDefending`, `debugProtection`, `disableConsoleOutput` all off. Skip
   `easteregg.min.js`, `assets/js/sdks/*` (third-party SDKs with their own
   integrity expectations), and `frame-runtime.js` (phase 5 owns the proxy
   surface; obfuscating it now risks the proxy for no phase-1 gain). Socket.IO
   event-name string literals are swept into the string array by value, so
   they are emitted unchanged — safe as long as nothing renames those strings.
4. **Catalogue.** XOR each file in `assets/json/load/` with `catalogueKey`
   byte-for-byte, store as base64url at the same path, and delete the
   plaintext. The matching decode lives in the already-obfuscated `games.js`,
   `apps.js`, `packs.js` and `loader-ui.js`, which read `catalogueKey` from a
   small boot blob (see below). Not secrecy — it only keeps the title list out
   of readable served files.
5. **HTML.** For each page shell, in Interstellar's order: obfuscate real
   inline `<script>` blocks (no `src`, JS or absent type) with the same chain;
   pass through `src` tags and non-JS types; protect `script`, `style`, `pre`,
   `textarea`, `template` by tokenizing them out before markup transforms and
   restoring after; minify; then numeric-entity-encode visible text and a
   fixed attribute set (`alt`, `aria-label`, `title`, `placeholder`, `value`,
   and visible text), leaving existing entities intact. **Not** encoded:
   `class`, `id`, `name`, `href`, and `on*` handlers — renaming or re-encoding
   those would break styling hooks, the form field names the server reads, and
   inline handlers (phases 4+ own selectors; see keep-list). A `visibleText`
   equality check asserts rendering is unchanged.
6. **Asset versioning.** Rewrite every `/assets/...(js|css)` reference in the
   built pages and scripts to carry `?v=<assetVersion>` (replacing any
   existing `?v=`). This is the cache-correctness fix: because obfuscated JS
   and the catalogue key change per build while the HTML is `no-cache`, a
   stale day-old cached script would otherwise run against a fresh page and a
   new catalogue key. One version per build makes old and new never mix. The
   `/assets/lib/vendor-*` and `/assets/js/sdks/*` URLs keep their existing
   pinned versions.

**The boot blob.** Stage 2 writes `catalogueKey` and `assetVersion` into a
tiny generated script `assets/js/boot.<id>.js` that the build injects as the
first script of every page shell and that the catalogue readers consult. It is
obfuscated like the others. (The key ships to the client — this is
fingerprint resistance, not encryption.)

**Count-assertion guards.** Each string-rewrite stage asserts an expected
occurrence count and aborts on a mismatch, so an upstream change (a new app
script, a renamed asset path) fails the build loudly instead of shipping a
half-transformed page.

### Part C — Serving

`index.js` resolves its static root once at boot:
`STATIC_ROOT = existsSync(dist/current/static) ? that : static`. All five
places that currently join `__dirname/static` use `STATIC_ROOT`. The
`manifest.json` beside the resolved root is read for the routes table (empty
in phases 1-2). A fresh clone with no `dist/` serves `static/` as today.

The server re-reads `dist/current` on a filesystem-watch event (debounced), so
when `deploy.sh` swaps the symlink all 10 workers pick up the new build
without a reload. Static-only deploys therefore drop no chat or proxy
connections.

`dist/` is git-ignored.

### Part D — Cutover

Done once over SSH, each production-changing step gated on the user's
go-ahead:

1. Install `entry.sh`, the fallback `deploy.sh`, a seeded `releases.log` and
   the deploy key; add the three repository secrets.
2. Remove both cron lines **before** the push (the running workers serve from
   `static/`; a cron pull of the new code is harmless, but the 02:00 reload
   would run new `index.js` against an un-built `dist/` — fine, it falls back
   to `static/` — the real reason is simply that the cron is being retired).
3. Push; the workflow performs the first real deploy.
4. If pm2 has not picked up `wait_ready`: `pm2 delete 55gms && pm2 start
   ecosystem.config.cjs && pm2 save` (the one non-rolling restart).
5. With no git process running, delete `.git/objects/pack/tmp_pack_*`.

Undo: restore the crontab from `/root/deploy/crontab.pre-cutover`.

## Risks

- A script that behaves differently after obfuscation (RC4 strings,
  control-flow flattening). Mitigated by `renameGlobals: false`, the SDK /
  proxy exclusions, and a browser pass over every page before cutover.
- A commit that crashes on boot. Caught by the preflight before any live
  worker is replaced.
- Stale cached JS running against a new page. Fixed by the per-build asset
  version (stage 6).
- The deploy key runs as root. Limited to `entry.sh`, which only deploys
  commits already on `main` — the same trust boundary as pushing to `main`.
- Obfuscation is not a security boundary: every key ships to the client and
  the transform is reversible with effort. Its only job is to raise the cost
  of automated fingerprinting and make each deploy look different.

## Verification

No new automated tests (user's standing instruction). The existing suites
(`node --test`) must still pass against the built tree where relevant; the
proxy suites are untouched because the proxy surface is excluded until phase
5. Checked by hand:

- Locally: run `npm run build`; grep the built `g.json`, a built page and a
  built script for a known game title and for readable site text — none
  present; every page renders and every control works in a browser; a fresh
  clone with no `dist/` still serves `static/`.
- On the server after cutover: a docs-only commit deploys without a reload; a
  commit touching `index.js` reloads with no failed requests on a custom
  domain; a deliberately broken commit is rolled back and the run is red; the
  rollback button restores the previous sha; a proxied game under
  `/misc/...` still loads its site scripts.

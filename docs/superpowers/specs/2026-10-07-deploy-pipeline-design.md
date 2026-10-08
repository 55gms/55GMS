# Deploy pipeline with a build step

Date: 2026-10-07

## Goal

Replace the cron-based deploy on the production server (`55gms` SSH host,
`/root/55gms`, pm2 app `55gms`) with a pipeline that GitHub Actions drives and
that runs a real build. The first thing the build produces is an obfuscated
settings page.

Success means:

- A push to `main` is live within a few minutes without anyone using SSH.
- Dependencies are installed when `package-lock.json` changes.
- Backend changes take effect on that deploy, not at 02:00 the next day.
- A deploy that fails its health check puts the previous commit back and shows
  red in GitHub Actions.
- Rolling back is one button in GitHub Actions.
- `/s` serves a built page whose static HTML is the decoy and which renders
  the real settings page in a browser.
- Custom domains keep working throughout. Nothing in Caddy changes.

## Out of scope

- Obfuscating any page other than settings. The build is written so that
  adding one is moving its file into `src/pages/`.
- Obfuscating or bundling JS and CSS. They are still served as plain files.
- Per-release folders. Static files still change in place during a checkout,
  as they do today.
- Docker, Coolify, or moving off pm2.
- Caddy, its certificate store, and the `api.ch3n.cc` on-demand TLS check.
- Render and Vercel deploy configs, other than `node .` continuing to work.

## Current state

On the server:

- `* * * * * /root/cron/update.sh` runs `git pull` in `/root/55gms`.
- `0 2 * * * /root/cron/restart.sh` runs `pm2 reload 55gms`.
- `npm install` is never run. There is no build and no rollback.
- pm2 runs `index.js` in cluster mode with 10 workers on port 8080, started by
  hand; there is no ecosystem file.
- `.git` is 41 GB: a 6.4 GB pack plus `tmp_pack_*` files left by pulls that
  were interrupted or overlapped.

Caddy (`/etc/caddy/Caddyfile`) has a catch-all `https://` block with
`tls { on_demand }` that proxies to `localhost:8080`, guarded by
`on_demand_tls { ask https://api.ch3n.cc/api/links }`. It holds about 87,000
certificates. Its only requirement of the app is that port 8080 answers.

In the repo:

- `static/settings.html` is served three ways: the `/s` route, the
  extensionless fallback (`/settings`), and `express.static`
  (`/settings.html`).
- `.github/workflows/main.yml` (Prettier) and `minify.yml` each push a bot
  commit to `main`. Commits pushed with `GITHUB_TOKEN` do not trigger other
  workflows, so a deploy workflow triggered on push would never see them.

## Design

### 1. Build

New layout:

```
src/
  pages/settings.html   clean source, moved from static/settings.html
  decoy.html            the shell every built page uses
build/
  obfuscate.js          exports buildPage(); CLI writes dist/
dist/                   generated, git-ignored
  settings.html
```

`build/obfuscate.js` follows the approach in the user's "Build-Time HTML
Obfuscation for Node" note: split the source page into a payload, encrypt it
with a fresh 64-byte random key (repeating-key XOR, base64), and inline the
payload and a small loader as the first element of the decoy's `<body>`.
`node-html-parser` is the one new dependency.

The payload differs from the note in one way. The note carries only `title`,
`meta` and `link` from the head and applies them with `insertAdjacentHTML`,
which never executes scripts. The settings page loads `settings.js`,
`font.js`, `easteregg.min.js` and `script.js` from its head. So:

- `m`: `<title>` and `<meta>` tags, applied with `insertAdjacentHTML`.
- `a`: attributes of `<body>`.
- `h`: every `<link>` and `<script>` from the head, in source order, followed
  by the inner HTML of `<body>`. The loader writes `h` with `document.write`
  while the document is still loading, so scripts run in order and before the
  markup that follows them, as they do today.

`src/decoy.html` holds the decoy `<title>`, meta tags and a `<noscript>` block
with the decoy text. It contains nothing specific to a real page. A first
draft is written during implementation; the wording is the user's to edit.

`npm run build` runs `node build/obfuscate.js`, which builds every file in
`src/pages/` into a temp directory and renames it over `dist/`, so `dist/` is
never half written.

### 2. Serving

`index.js` gets one handler, mounted before `express.static`, for `/s`,
`/settings` and `/settings.html`. The `/s` entry leaves the `routes` table.

The handler returns `dist/settings.html` when it exists and is newer than
`src/pages/settings.html`, `src/decoy.html` and `build/obfuscate.js`.
Otherwise it calls `buildPage()` and serves the result from memory. This keeps
three cases working without extra steps:

- Development: no watcher; an edit shows on the next refresh.
- `node .` on Render, Codespaces or a fork: no build command needed.
- A read-only filesystem: nothing is written at boot.

The response carries `Cache-Control: no-cache`, because every build produces
different bytes.

The clean source is outside `static/`, so it is not downloadable.

### 3. Deploy on the server

Two scripts, both kept in the repo under `deploy/`.

`deploy/entry.sh` is installed once at `/root/deploy/entry.sh` and is the only
thing the deploy SSH key can run. It:

1. Reads the request from `SSH_ORIGINAL_COMMAND`: `deploy <sha>`, `rollback`
   or `status`. A sha must be 40 hex characters.
2. Takes a `flock` so only one deploy runs at a time.
3. Runs `git fetch origin main` and refuses a sha that is not an ancestor of
   `origin/main`.
4. Extracts `deploy/deploy.sh` from the target commit into a temp file and
   runs it. The deploy logic is versioned with the code and never rewrites
   itself mid-run.

`deploy/deploy.sh <sha>`:

1. Refuses to run if tracked files have local changes.
2. Records the current commit as `previous`.
3. `git checkout --detach <sha>`.
4. `npm ci --omit=dev` if `package-lock.json` differs between the two commits.
5. `npm run build`.
6. Reloads only when needed: `pm2 reload ecosystem.config.cjs` unless every
   changed path is under `static/`, `src/`, `docs/`, `.github/`, `test/`,
   `tests/` or is a `*.md` file. Commits that only add games therefore do not
   drop chat and proxy websocket connections.
7. Health check against `localhost:8080`, retried for up to 30 seconds: `/`
   returns 200, and `/s` returns 200 and contains the loader marker.
8. On success, appends `timestamp sha` to `/root/deploy/releases.log`.
9. On failure at any step after 3, checks out `previous`, repeats steps 4 to
   6 for it, and exits non-zero.

`rollback` deploys the second most recent sha in `releases.log`. `status`
prints the last five entries and the current commit.

`ecosystem.config.cjs` is added to the repo: app `55gms`, `index.js`, cluster
mode, 10 instances, `wait_ready: true`, `listen_timeout: 15000`,
`kill_timeout: 6000` (the app's own shutdown timeout is 5 seconds).
`index.js` calls `process.send?.("ready")` once the server is listening, so a
reload replaces a worker only after its successor is accepting requests.

### 4. GitHub Actions

`.github/workflows/deploy.yml`, on push to `main` and on `workflow_dispatch`
with an `action` input (`deploy` or `rollback`). Concurrency group
`deploy-production` with `cancel-in-progress: false`, so one deploy runs at a
time and only the newest waiting run is kept.

Every checkout is sparse (everything except `static/misc/`) with
`filter: blob:none`, so the runner never downloads the games.

Jobs, in order:

1. `tidy`: the existing Prettier and minify steps, moved here from `main.yml`
   and `minify.yml`, each pushing its bot commit as today. `minify.yml` is
   deleted. `main.yml` keeps only its `pull_request` trigger.
2. `check`: checks out the tip of `main` after `tidy`, runs `npm ci`,
   `node --check` on `index.js` and every file in `routes/`, `services/`,
   `utils/`, `models/`, `config/` and `build/`, then `npm run build`, and
   confirms `dist/settings.html` contains the loader marker and not the
   settings page's heading text.
3. `deploy`: SSHes to the server and sends `deploy <sha>`, where the sha is the
   one `check` verified. Skipped when the workflow was dispatched with
   `rollback`, in which case a `rollback` job sends `rollback` instead.

Repository secrets: `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_KNOWN_HOSTS`.

The key is a new ed25519 key used for nothing else. Its line in
`/root/.ssh/authorized_keys` is prefixed with
`command="/root/deploy/entry.sh",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`,
so it cannot open a shell.

### 5. Cutover

Done once, by hand over SSH, with the user's go-ahead for each step that
changes production:

1. Push the build, serving and deploy code. The old cron pulls it; settings
   is served by the in-memory fallback until the first real deploy.
2. `npm ci` on the server (for `node-html-parser`), then install
   `/root/deploy/entry.sh` and the deploy key.
3. Remove both cron lines. `/root/cron/` is left in place for reference.
4. `pm2 delete 55gms`, `pm2 start ecosystem.config.cjs`, `pm2 save`. This is
   the one restart that is not rolling; it takes a few seconds.
5. Add the three repository secrets and run the workflow by hand.
6. With no git process running, delete `.git/objects/pack/tmp_pack_*`.

Rollback of the cutover itself: restore the two cron lines.

## Risks

- The deploy key lets GitHub Actions run a deploy as root. It is limited to
  `entry.sh`, and `entry.sh` only deploys commits already on `main`; anyone
  who can push to `main` can already ship code to the server today.
- A page script that relies on running from `<head>` specifically would
  behave differently once written into the body. None of the four scripts on
  the settings page does; this is checked in a browser during implementation
  and again for each page added later.
- The obfuscation is a deterrent. The key ships with the page and the JS and
  CSS remain readable.

## Verification

No automated tests are added. Checked by hand:

- Locally: `/s`, `/settings` and `/settings.html` render the settings page
  and every control works; view-source shows only the decoy;
  `/src/pages/settings.html` returns 404.
- On the server after cutover: a docs-only commit deploys without a reload; a
  commit touching `index.js` reloads with no failed requests on a custom
  domain; a deliberately broken commit is rolled back and the run is red; the
  rollback button restores the previous sha.

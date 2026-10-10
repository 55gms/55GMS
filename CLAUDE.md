# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the server (default port 8080)
node .

# Initialize the database (run once before first start)
node setup-db.js

# Build the obfuscated copy of static/ into dist/ (CI and every deploy run this)
npm run build

# Check that the build hides what it should (CI runs this after the build)
node scripts/build/check-output.js
```

The server serves `STATIC_ROOT` if set, else `dist/current/static` if it exists, else `static/`. So after a local `npm run build`, plain `node .` serves the built copy and edits under `static/` do not show until you rebuild. To serve the sources, run `STATIC_ROOT=static node .` or delete `dist/`.

## Environment Setup

Copy `EXAMPLE.env` to `.env` and fill in:

```
API_KEY=
POSTGRES_URL=postgresql://username:password@localhost:5432/55gms_chat
workerAUTH=your_worker_auth_token
hcaptchaSecret=your_hcaptcha_secret
PORT=8080
```

A running PostgreSQL instance is required. Run `node setup-db.js` after configuring `POSTGRES_URL` to create schema.

## Architecture

**55GMS** is an unblocked-games/proxy site with a real-time chat system. The server is a single Express + Socket.IO app (`index.js`).

### Backend layout

| Path                     | Purpose                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `index.js`               | Server entry point — Express routes, Socket.IO events, static file serving                        |
| `config/database.js`     | Sequelize PostgreSQL connection (pool: max 10)                                                    |
| `models/`                | Sequelize ORM models: `Chat`, `Message`, `ChatMember`, `Friend`, `UserStatus`, `User`, `UserSave` |
| `routes/auth.js`         | Login/signup with hcaptcha, via `services/accounts.js`                                            |
| `routes/users.js`        | Premium checks, per-user save-data upload/download                                                |
| `routes/admin.js`        | Premium management for `/admin`; allowed only for the session cookie of user `jiayang`            |
| `services/accounts.js`   | Account/save store; `ACCOUNT_BACKEND` picks the Worker (default) or local Postgres                |
| `routes/messaging.js`    | Full chat REST API (~962 lines)                                                                   |
| `routes/music.js`        | Proxy routes for music/media                                                                      |
| `utils/userCache.js`     | In-memory user data cache                                                                         |
| `utils/blockingCache.js` | In-memory blocked-user cache                                                                      |
| `utils/ads.js`           | Mounts 55GMS Ads at `/_ads` when `ADS_SERVER_URL` and `ADS_API_KEY` are set                       |
| `utils/gameAssets.js`    | Relays `/misc/` files that are not on disk from the 55gms/assets mirror on jsDelivr               |
| `utils/ads-edge/`        | Vendored edge module from the gms-ads repo; do not edit here                                      |
| `scripts/build.js`       | `npm run build`: builds `static/` into `dist/builds/<id>/` and points `dist/current` at it        |
| `scripts/build/`         | The build stages, and `check-output.js`, the check CI runs on the built tree                      |
| `deploy/`                | Server-side deploy scripts run by the GitHub Actions deploy key (`docs/deploy.md`)                |
| `ecosystem.config.cjs`   | pm2 settings for production (cluster, 10 workers, `STATIC_ROOT`)                                  |

### Authentication flow

Accounts and saves go through `services/accounts.js`. By default it calls an external worker API (`https://db.55gms.com/api/`) authenticated with the `workerAUTH` token; with `ACCOUNT_BACKEND=postgres` it uses the local `users` and `user_saves` tables (passwords stored as bcrypt over SHA-256). UUIDs identify users. The migration plan is in `docs/superpowers/specs/2026-10-01-worker-to-postgres-migration-design.md`.

### Real-time (Socket.IO)

Key events handled in `index.js`:

- `authenticate` — associates a socket with a user UUID
- `join_chat` / `leave_chat` — room management
- `send_message` — persists to DB and broadcasts
- `typing_start` / `typing_stop` — indicators
- `mark_read` — read receipts
- `heartbeat` — keeps `UserStatus` updated for online presence

### Frontend

All frontend code is static files under `static/`:

- `static/*.html` — page templates (no templating engine; plain HTML)
- `static/assets/js/` — client-side JS (chat, auth, games UI)
- `static/assets/json/` — game/app catalog data
- `static/assets/harry-potter/` — preset tab favicons (Canvas, Gmail, Google Drive, etc.)
- `static/assets/sj/` — small proxy helper scripts (URL handling, service-worker registration)
- `static/misc/` — 400+ embedded game directories holding only the game pages (`*.html`). The game files themselves live in the [55gms/assets](https://github.com/55gms/assets) repo under `misc/<folder>/` and are served from jsDelivr; see `AGENTS.md` for the `<base>` pattern. A `/misc/` file requested from this server that is not on disk is relayed from that mirror by `utils/gameAssets.js`. Three files over jsDelivr's size limit stay here: `fruit-ninja/vendors.bundle.js`, `misc/packs/skyline/§bSkyline.zip`, `fnf/assets/videos/videos/toyCommercial.mp4`

### Build

`static/` is the source. `npm run build` writes a transformed copy to `dist/builds/<id>/static/` and swaps the `dist/current` symlink to it; production serves that copy. `dist/` is git-ignored. Stages, in order (`scripts/build/`):

1. `prepare` — copies `static/`; `misc/` and `img/` are symlinked, never copied or rebuilt
2. `javascript` — minifies and obfuscates the scripts directly in `assets/js/`
3. `catalogue` — encodes `assets/json/load/*.json`
4. `html` — obfuscates inline scripts, minifies, and entity-encodes visible text in `static/*.html`
5. `asset-version` — rewrites `/assets/*.js|css` references to a per-build `?v=`

What this means when editing the frontend:

- Byte-for-byte untouched: `sw.js`, `assets/sj/`, `assets/js/frame-runtime.js`, `assets/js/easteregg.min.js`, `assets/js/sdks/`. CSS and the other JSON files are copied as they are.
- Top-level function names in app scripts stay readable (global renaming is off) because pages call them from inline handlers; so does `<meta name="description">` content.
- A built catalogue is base64url of a 16-byte key followed by the JSON XORed with that key. `games.js`, `apps.js`, `packs.js` and `loader-ui.js` each carry the decoder (`readCatalogue`) and still accept plain JSON; any new code that fetches a catalogue needs it too.
- `unity-cdn-loader.js` and `unity-cdn-assets.js` are ES modules loaded by game pages under `static/misc/`, which are never rebuilt: keep their file names and export names stable.
- Whatever `?v=` a page puts on an `/assets/*.js|css` reference is replaced by the per-build one. `/assets/lib/vendor-*` and `/assets/js/sdks/*` keep their own versions, and so do URLs built at runtime inside app scripts (the loader `VERSION` in `loader-ui.js`, still bumped with `scripts/bump-loader-version.js`) and the game pages under `static/misc/`.

The proxy surface (phases 3–5) is not built: see `docs/superpowers/specs/2026-10-08-build-phases-3-5.md`. Details, the `dist/` layout and how to check a build are in `docs/deploy.md`.

### Proxy infrastructure

The site uses Mercury Workshop libraries for browser-based proxying, pinned in `package.json`:

- `@mercuryworkshop/scramjet`, `scramjet-controller`, `scramjet-utils`, `epoxy-transport`, `wisp-js`

The bundles are not copied into `static/`. `utils/proxyAssets.js` serves seven files straight from `node_modules` under neutral names in `/assets/lib/`, mounted by `mountProxyAssets(app)` in `index.js` ahead of the static middleware:

| URL                            | Source (`node_modules/@mercuryworkshop/`)       |
| ------------------------------ | ----------------------------------------------- |
| `/assets/lib/vendor-core.js`   | `scramjet/dist/scramjet.js`                     |
| `/assets/lib/vendor-core.wasm` | `scramjet/dist/scramjet.wasm`                   |
| `/assets/lib/vendor-frame.js`  | `scramjet-controller/dist/controller.api.js`    |
| `/assets/lib/vendor-page.js`   | `scramjet-controller/dist/controller.inject.js` |
| `/assets/lib/vendor-worker.js` | `scramjet-controller/dist/controller.sw.js`     |
| `/assets/lib/vendor-util.js`   | `scramjet-utils` (`scramjet-utils.js`)          |
| `/assets/lib/vendor-net.js`    | `epoxy-transport/dist/index.js`                 |

The rest of the stack:

- `static/embed.html` — the proxy page shared by the browser shell and media players; loads the bundles and `static/assets/js/frame-runtime.js`
- `static/sw.js` — service worker served at `/sw.js`, registered with scope `/stream/` (the proxied-URL prefix)
- Wisp transport — websocket upgrades on `/api/live/` (used by the site) or `/wisp/` (external clients) are routed to the wisp-js server in `index.js`

See `docs/proxy-stack.md` for versions, caching, the neutral-naming rules, and upgrade notes.

## Deployment

Production is a single server (SSH host `55gms`, `/root/55gms`) running pm2 behind Caddy. A push to `main` is deployed by the `Deploy` GitHub Actions workflow, which SSHes in with a key limited to `/root/deploy/entry.sh`; that runs the commit's `deploy/deploy.sh` (checkout, install, build, preflight boot, rolling reload, health check, restore on failure). Rollback is the workflow's manual `rollback` run. Do not edit files on the server by hand: the deploy refuses to run over local changes. See `docs/deploy.md`.

`render.yaml` and `vercel.json` remain for forks; their start command is `node .`.

## CI

`.github/workflows/deploy.yml` runs on every push to `main`: Prettier (auto-commits), syntax checks, the build, a check that the built tree exposes no readable catalogue or page text (`scripts/build/check-output.js`), then the deploy. `.github/workflows/main.yml` runs Prettier on pull requests. There are no automated tests in CI.

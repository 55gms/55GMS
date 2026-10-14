# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the server (default port 8080)
node .

# Initialize the database (run once before first start)
node setup-db.js

# Add the handle columns to an existing database (safe to re-run)
node scripts/add-handle-columns.js

# Add the avatar column to an existing database (safe to re-run)
node scripts/add-avatar-column.js

# Add the billing column and table to an existing database (safe to re-run)
node scripts/add-billing.js

# Create the Stripe product, prices and portal settings for the key in .env
node scripts/setup-stripe.js

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
PORT=8080
```

Every value is optional. `utils/features.js` decides at boot which optional features run: accounts need their backend (`POSTGRES_URL` with `ACCOUNT_BACKEND=postgres`, or `workerAUTH` for the Worker), and chat needs `POSTGRES_URL` plus accounts. With no `.env`, or one still holding the `EXAMPLE.env` placeholders, the server boots with both off and serves games, apps and the proxy: their API routes and models are never loaded, `/api/*` calls to them return 503 JSON, their pages redirect to `/`, and the build's `html` stage leaves their navbar links (`/chat`, `/profile`) out of the built pages. The build reads the same env as the server (`configuredFeatures()`), so it must run where the server's `.env` is; served straight from `static/`, the links stay and redirect home. Paid premium (`billing`) is a third switch: it needs `STRIPE`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_TOKEN_SECRET` and the Postgres account backend, and with any missing its routes return 503, `/premium` redirects home and the build drops links to `/premium`. A configured database that cannot be reached is fatal, except in GitHub Codespaces (`CODESPACES=true`), where the server starts without it. `.devcontainer/devcontainer.json` installs dependencies, builds, and runs `node .` in a Codespace.

For chat, run a PostgreSQL instance and `node setup-db.js` after configuring `POSTGRES_URL` to create schema.

## Architecture

**55GMS** is an unblocked-games/proxy site with a real-time chat system. The server is a single Express + Socket.IO app (`index.js`).

### Backend layout

| Path                         | Purpose                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `index.js`                   | Server entry point — Express routes, Socket.IO events, static file serving                                        |
| `config/database.js`         | Sequelize PostgreSQL connection (pool: max 10)                                                                    |
| `models/`                    | Sequelize ORM models: `Chat`, `Message`, `ChatMember`, `Friend`, `UserStatus`, `User`, `UserSave`, `Subscription` |
| `routes/auth.js`             | Login/signup, the handle check and the signup captcha challenge                                                   |
| `utils/captcha.js`           | Self-hosted signup captcha: a signed proof of work bound to the handle                                            |
| `routes/users.js`            | Premium checks, per-user save-data upload/download                                                                |
| `routes/admin.js`            | Premium management for `/admin`; allowed only for the session cookie of user `jiayang`                            |
| `routes/billing.js`          | Stripe checkout, portal and status routes, and the webhook; loaded only with billing on                           |
| `services/billing.js`        | Every Stripe call and the rule for who is premium (`recomputePremium`); see `docs/billing.md`                     |
| `services/accounts.js`       | Account/save store; `ACCOUNT_BACKEND` picks the Worker (default) or local Postgres                                |
| `routes/messaging.js`        | Full chat REST API (~962 lines)                                                                                   |
| `routes/music.js`            | Proxy routes for music/media                                                                                      |
| `utils/features.js`          | Turns accounts and chat on or off at boot from the env; see Environment Setup                                     |
| `utils/userCache.js`         | In-memory user data cache                                                                                         |
| `utils/handle.js`            | The handle rule (`@handle`: lowercase letters, numbers, dashes, 3 to 16) and the choose-by deadline               |
| `utils/avatars.js`           | The preset avatar ids an account can pick; images are `static/img/avatars/<id>.svg`                               |
| `scripts/migrate-handles.js` | One-off username-to-handle migration; steps in `docs/handles-rollout.md`                                          |
| `utils/blockingCache.js`     | In-memory blocked-user cache                                                                                      |
| `utils/saveKeys.js`          | Which localStorage keys stay out of a cloud save (the proxy's `host@key` storage); mirrored in `account.html`     |
| `utils/ads.js`               | Mounts 55GMS Ads at `/_ads` when `ADS_SERVER_URL` and `ADS_API_KEY` are set                                       |
| `utils/gameAssets.js`        | Relays `/misc/` files that are not on disk from the 55gms/assets mirror on jsDelivr                               |
| `utils/ads-edge/`            | Vendored edge module from the gms-ads repo; do not edit here                                                      |
| `scripts/build.js`           | `npm run build`: builds `static/` into `dist/builds/<id>/` and points `dist/current` at it                        |
| `scripts/build/`             | The build stages, and `check-output.js`, the check CI runs on the built tree                                      |
| `deploy/`                    | Server-side deploy scripts run by the GitHub Actions deploy key (`docs/deploy.md`)                                |
| `ecosystem.config.cjs`       | pm2 settings for production (cluster, 10 workers, `STATIC_ROOT`)                                                  |

### Authentication flow

Accounts and saves go through `services/accounts.js`. By default it calls an external worker API (`https://db.55gms.com/api/`) authenticated with the `workerAUTH` token; with `ACCOUNT_BACKEND=postgres` it uses the local `users` and `user_saves` tables (passwords stored as bcrypt over SHA-256). UUIDs identify users. A username is a handle: lowercase letters, numbers and dashes, 3 to 16 characters, shown as `@handle`; `utils/handle.js` is the only definition of the rule. `users.legacy_username` keeps the pre-migration username, which still signs in; `users.handle_pending` marks an account that must pick a handle at `/choose-handle` and cannot write to chat until it does, or until `HANDLE_MIGRATION_DEADLINE` passes and its placeholder becomes final. `/handles` explains this and looks up a handle from an old username. An account may also pick a preset avatar (`users.avatar`, an id from `utils/avatars.js`, set on `/profile` through `POST /api/avatar`); with none, the server sends the preset its uuid maps to (`defaultAvatar`), so only group chats and unknown users show an initial on a colour. Chat payloads also carry each account's `premium` flag, shown as a badge after the handle. `users.premium` is derived: it is true for an admin grant (`users.premium_granted`) or a live Stripe subscription (the `subscriptions` table), and only `recomputePremium` in `services/billing.js` and `setPremium` write it. There are no uploaded pictures. The images are the DiceBear "Sprouts" style, CC0 1.0; the column must exist before a build that reads it is deployed. The migration plan is in `docs/superpowers/specs/2026-10-01-worker-to-postgres-migration-design.md`.

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
- 55GMS Ads on the other pages are slots written in the page markup: `<div class="site-ad"><div data-55gms-ad></div></div>`, with `site-ad--billboard`, `--box` or `--small` to cap the width, and `site-ad-rail` pairs (160x600, wide screens only) after the navbar. The styles are at the end of `assets/css/style.css`; `script.js` loads the embed, and hides every slot when the visitor has banners off. An unfilled slot takes no space. Premium, chat, admin and the proxy pages have none.
- Ad tiles are ads shaped like a game tile, drawn by `assets/js/ad-tiles.js` (`requestAdTiles`, `fillAdTile`), which asks `/_ads/serve` itself for 250x250 creatives instead of going through the embed: the creative is the thumbnail, its alt text the hover label, and an "Ad" badge marks it. `games.js` puts up to four among the cards on `/games` (hidden during a search and in the Favorites and Recently Played views), and `game-page.js` turns up to two of a game page's tiles into them. On a host where Google fills the ads, the tile holds an AdSense unit made at the tile's size, which dims under a "Sponsored" label on hover like any tile, and a campaign replaces it if Google leaves it empty. A tile with no ad is removed or goes back to being a game. Game pages load `ad-tiles.js` with their own `?v=`, bumped like the others.
- Game pages (`static/misc/play/*.html`) ship only the game frame inside `#gamepage`. `assets/js/game-page.js` lays the page out as a grid of square cells sized from the window's width and height: the game, three 55GMS ad boxes (160x600 on wide screens, or a second 250x250 in its place on narrower ones such as a 1366px Chromebook; a 250x250 scaled to the size of a big tile; and 728x90 in the last row) and tiles of random games from `g.json`, which reuse `hover-preview.js` for the clips. The game is centred and takes about two thirds of the columns, with tiles on both sides and at most four rows under it. Under 1150px wide it takes every column and the rest stacks below it. The 160x600 and 728x90 ads shrink with the window's width (full size at 1700px), the 250x250s fill their big-tile frames, while the tiles keep their size, and a window that fits only four rows gives them all to the game, with the banner in the row below the fold. An unfilled or switched-off ad gives its cells to tiles. The look is in `assets/css/gameframe.css`. These pages are never rebuilt, so bump the `?v=` on `gameframe.css`, `script.js` or `game-page.js` in every page when one changes.
- `static/misc/` — 400+ embedded game directories holding only the game pages (`*.html`). The game files themselves live in the [55gms/assets](https://github.com/55gms/assets) repo under `misc/<folder>/` and are served from jsDelivr; see `AGENTS.md` for the `<base>` pattern. A `/misc/` file requested from this server that is not on disk is relayed from that mirror by `utils/gameAssets.js`. `static/misc/media/` (the media player's scripts and styles) is site code and stays here in full. `.gitignore` keeps other non-HTML files out of `static/misc/`. Three files over jsDelivr's size limit also stay here: `fruit-ninja/vendors.bundle.js`, `misc/packs/skyline/§bSkyline.zip`, `fnf/assets/videos/videos/toyCommercial.mp4`

### Build

`static/` is the source. `npm run build` writes a transformed copy to `dist/builds/<id>/static/` and swaps the `dist/current` symlink to it; production serves that copy. `dist/` is git-ignored. Stages, in order (`scripts/build/`):

1. `prepare` — copies `static/`; `misc/` and `img/` are symlinked, never copied or rebuilt
2. `javascript` — minifies and obfuscates the scripts directly in `assets/js/`
3. `catalogue` — encodes `assets/json/load/*.json`
4. `html` — obfuscates inline scripts, minifies, and entity-encodes visible text in `static/*.html`
5. `asset-version` — rewrites `/assets/*.js|css` references to a per-build `?v=`

What this means when editing the frontend:

- Byte-for-byte untouched: `sw.js`, `assets/sj/`, `assets/js/frame-runtime.js`, `assets/js/easteregg.min.js`, `assets/js/captcha-worker.js`, `assets/js/sdks/`. CSS and the other JSON files are copied as they are.
- Top-level function names in app scripts stay readable (global renaming is off) because pages call them from inline handlers; so does `<meta name="description">` content.
- A built catalogue is base64url of a 16-byte key followed by the JSON XORed with that key. `games.js`, `apps.js`, `packs.js`, `loader-ui.js` and `game-page.js` each carry the decoder (`readCatalogue`) and still accept plain JSON; any new code that fetches a catalogue needs it too.
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

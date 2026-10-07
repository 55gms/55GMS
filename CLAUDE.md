# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the server (default port 8080)
node .

# Initialize the database (run once before first start)
node setup-db.js
```

No build step — the project uses ES6 modules served directly by Node.js.

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
- `static/assets/cloaks/` — tab-cloak favicons (Canvas, Gmail, Google Drive, etc.)
- `static/assets/sj/` — small proxy helper scripts (URL handling, service-worker registration)
- `static/misc/` — 200+ self-contained embedded game directories

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

Primary deployments target **Render** (`render.yaml`) and **Vercel** (`vercel.json`). The start command for both is `node .`.

## CI

GitHub Actions runs **Prettier** for formatting on every push/PR (`.github/workflows/main.yml`). There are no automated tests.

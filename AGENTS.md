# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

| Path                     | Purpose                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `index.js`               | Server entry point — Express routes, Socket.IO events, static file serving           |
| `config/database.js`     | Sequelize PostgreSQL connection (pool: max 10)                                       |
| `models/`                | Sequelize ORM models: `Chat`, `Message`, `ChatMember`, `Friend`, `UserStatus`        |
| `routes/auth.js`         | Login/signup, delegates to external API at `https://db.55gms.com/api/` with hcaptcha |
| `routes/users.js`        | Premium checks, per-user save-data upload/download                                   |
| `routes/messaging.js`    | Full chat REST API (~962 lines)                                                      |
| `routes/music.js`        | Proxy routes for music/media                                                         |
| `utils/userCache.js`     | In-memory user data cache                                                            |
| `utils/blockingCache.js` | In-memory blocked-user cache                                                         |

### Authentication flow

User identity is managed by an external worker API (`https://db.55gms.com/api/`). The local server stores no passwords — it validates a `workerAUTH` token on each request. UUIDs identify users.

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
- `static/assets/cloaks/` — Mercury Workshop proxy-cloaking libraries
- `static/misc/` — 200+ self-contained embedded game directories

### Game asset handling

`static/misc/` is huge and contains many full game ports. Be careful with context:

- Do not bulk-read, `cat`, or recursively dump large game folders.
- Prefer targeted `rg`, `find ... -maxdepth`, `ls -lh`, `du -sh`, and small `sed` ranges.
- When diagnosing one game, inspect only that game's folder plus the relevant catalog entry in `static/assets/json/load/g.json`.

For game pages, prefer the existing jsDelivr base pattern when possible because it is faster for end users and reduces load on the app server:

```html
<base
  href="https://cdn.jsdelivr.net/gh/55gms/55gms@master/static/misc/<folder-name>/"
/>
```

Use relative asset paths inside the game page (`index.js`, `main.js`, `data/file.wasm`, etc.) so the `<base>` URL controls where game assets load from. Keep site-wide assets that should come from this server, such as `/assets/js/script.js`, as absolute paths.

Before relying on jsDelivr, verify the actual game assets work there. jsDelivr/GitHub has practical file-size limits; individual files around 25 MB or larger may fail, be blocked, or behave inconsistently. Check large assets with `curl -I` or range requests before assuming they will load.

If a required game asset is too large for jsDelivr, split it into chunk files in the same game folder, for example:

```text
index.pck.part1
index.pck.part2
index.wasm.part1
index.wasm.part2
```

Then add a small loader script that fetches the relative chunk paths, combines them into a `Blob`, creates an object URL, and intercepts the game engine's fetch for the original large filename (`index.pck`, `index.wasm`, etc.). Keep chunk filenames stable and verify the final game in a browser, not only with HTTP status checks.

Helpful checks for game asset work:

- Search for accidental remote dependencies with `rg -n "githubusercontent|cdn\\.jsdelivr|<old-repo-or-folder>" static/misc/<folder>`.
- Validate JS syntax with `node --check` for edited `.js` loader files.
- Start the app locally with `PORT=8099 node .` and test the game through `http://localhost:8099/misc/<folder>/index.html`.
- Watch the browser console: Godot/Unity games can show harmless in-game warnings, but missing `.wasm`, `.pck`, `.data`, or chunk files are blockers.

### Proxy infrastructure

The site uses Mercury Workshop libraries for browser-based proxying:

- `@mercuryworkshop/bare-mux`, `wisp-js`, `epoxy-transport`, `scramjet`

These are served from `static/assets/sj/` and `static/assets/cloaks/`.

## Deployment

Primary deployments target **Render** (`render.yaml`) and **Vercel** (`vercel.json`). The start command for both is `node .`.

## CI

GitHub Actions runs **Prettier** for formatting on every push/PR (`.github/workflows/main.yml`). There are no automated tests.

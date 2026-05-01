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

### Proxy infrastructure

The site uses Mercury Workshop libraries for browser-based proxying:

- `@mercuryworkshop/bare-mux`, `wisp-js`, `epoxy-transport`, `scramjet`

These are served from `static/assets/sj/` and `static/assets/cloaks/`.

## Deployment

Primary deployments target **Render** (`render.yaml`) and **Vercel** (`vercel.json`). The start command for both is `node .`.

## CI

GitHub Actions runs **Prettier** for formatting on every push/PR (`.github/workflows/main.yml`). There are no automated tests.

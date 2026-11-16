# 55GMS multiplayer server: design

Date: 2026-11-16. First game: 1v1.lol.

## Why

Multiplayer games on 55GMS sit on "Connecting…" forever. For 1v1.lol the cause
is now known, and it is not a school filter: the build we host (the `nowgg`
folder, 1v1.LOL 3.800, Unity 2019.4.24f1) connects to Photon's name server
`wss://ns.exitgames.com:19093/`, sends its AppId, and Photon answers
`ApplicationArchived`. The developer's Photon app is shut down, so this build
cannot reach a server anywhere, at school or at home. The only way to make it
playable is to give it a server of our own.

The owner wants one "mega server" for this, in its own repo, that every
multiplayer game on 55GMS can use: one process on its own port, with one
endpoint per game, each endpoint speaking the protocol that game's client
already expects. 1v1.lol is the first game; Steal and Run (`steal-a-brainrot`,
PlayCanvas + Colyseus) is a likely second.

## Goals

- A student opens 1v1.lol on any 55GMS domain, presses PLAY on a casual mode,
  and lands in a match with another 55GMS player who did the same.
- Players play as guests (the game's own "anonymous" login). No 55GMS account
  needed.
- Every 55GMS domain works, without a list of domains anywhere in the server.
- The server is built so a second game is a new folder in the repo, not a
  rewrite.

## Non-goals (for 1v1.lol, this version)

- Playing with players on the real 1v1.lol. 55GMS players only see each other.
- "Login with Google", the shop, purchases, LOL Pass progress, saved
  inventory, ranked/competitive ladders, friends, and parties. These go
  through Firebase and Photon Chat; they can stay broken or hidden.
- Changing the Unity build files. The fix lives in the game page and the
  server.
- Any other game. Steal and Run gets its own design when its turn comes.

## Anti-goals

- Anything that makes the 55GMS site itself less stable: the server is a
  separate process, and if it is down, only multiplayer breaks.
- A server that becomes an open relay or a cheap way to burn the box's
  bandwidth: it only speaks the games' protocols, with size and rate caps.
- Ports other than 443 facing players. Schools block unusual ports.

## What we know about the 1v1.lol client (captured 2026-11-16)

- Networking is Photon PUN 2 (the build carries `PhotonUnityNetworking.dll`,
  `PhotonRealtime.dll`, `PhotonChat.dll`, `PhotonWebSocket.dll`;
  version string `2.18.1`) over WebSocket, binary protocol 1.8.
- `PhotonServerSettings`: AppId `82620531-8737-4824-8fd2-a4d29e2417d8`,
  AppVersion `0.239`, using the name server. The PUN RPC list in the same
  asset: `ActivateBuilding, BuildingStatusUpdate, ClickRpc, DestroyRpc, …,
UpdateAllPartyUI` (about 50 names; the server only relays them).
- The exchange on connect, as captured (hex):
  - server → `f3 01 00` (init response, right after the socket opens)
  - client → `f3 06 01 01 01 0d …` (ping)
  - client → `f3 02 dc 01 e0 07 24 "8262…17d8"` (operation 220 GetRegions,
    parameter 224 AppId)
  - server → `f3 07 01 00 00 08 02 01 0d … 02 09 …` (ping reply)
  - server → `f3 03 dc ff7f 07 13 "ApplicationArchived" 00` (GetRegions
    failed)
  - the client closes and retries every second or so, forever.
- After the name server, PUN normally pings the regions it was given, then
  authenticates and moves to a master server (matchmaking) and then a game
  server (the room). PUN keeps all gameplay in the clients: a room's "master
  client" is one of the players, and the server relays events (RPCs, object
  sync, instantiation), keeps room and player properties, keeps cached events
  for players who join late, and picks a new master client when one leaves.
- Guests never touch Firebase (`anonymousLogin` in `js/login.js` returns a
  "guest" result locally). Remote config has built-in defaults
  (`js/firebase-config.js`) with the casual modes `1v1`, `BoxFight_Teams_2v2`,
  `PipeRun_Race` and `Teams_City_ZoneWars`.
- The client also calls
  `https://us-central1-justbuild-cdb86.cloudfunctions.net/userSettings/time`,
  which fails (CORS). Whether PLAY needs it is not known yet.
- Capture tools (`capture.mjs`, a Playwright script that logs every websocket
  frame; the UnityPy dump of the settings asset) were throwaway; the builder
  re-creates them as needed.

## How it fits together

```
browser (any 55GMS domain)
  game page /misc/nowgg/  ── WebSocket to wss://ns.exitgames.com:19093/
     │  a small script in the page rewrites that URL to
     ▼  wss://<same host>/api/mp/1v1/ns
Caddy (catch-all site block, every hostname)
     │  path /api/mp/*  →  127.0.0.1:8093
     ▼
multiplayer server (new repo, Node, one process)
     /api/mp/1v1/ns      Photon name server role
     /api/mp/1v1/master  Photon master server role (lobby, matchmaking)
     /api/mp/1v1/game    Photon game server role (rooms)
     /api/mp/<next game>/…
```

- **Redirect in the page.** The 55GMS game page (`static/misc/nowgg/index.html`,
  never rebuilt) gets a script before the Unity loader that wraps
  `window.WebSocket` and swaps any `*.exitgames.com` / `*.photonengine.io`
  address for `wss://<location.host>/api/mp/1v1/…`. Same-origin, so it works on
  every domain the site is served on, and the filter only ever sees traffic to
  our own domain.
- **Addresses the server hands out.** When the name server sends the client to
  a master server, and the master server sends it to a game server, the
  addresses it returns are built from the `Host` header of the incoming
  upgrade request (`wss://<host>/api/mp/1v1/master`, `…/game`), so they also
  work on every domain without configuration.
- **One region.** GetRegions answers with a single region whose address is our
  master endpoint, so the region ping lands on us and every player is in the
  same pool.
- **Production.** The same box as 55GMS: a pm2 app (or systemd service) on
  `127.0.0.1:8093`, and in Caddy's catch-all block an `/api/mp/*` route ahead
  of the app, the same way `/api/live/*` goes to epoxy-server today
  (`docs/proxy-stack.md`). Its own GitHub Actions deploy, modelled on 55GMS's.
  The one-time server steps (Caddy route, service install, the deploy key
  and repo secrets) are done by the builder over SSH (`55gms` host), with
  the owner's permission, and written down in the new repo's README so they
  can be repeated.
- **Locally and in forks.** The server runs on its own with `node .`; a page
  served by a local 55GMS can be pointed at it with a query parameter or by
  running both behind one local proxy (builder's call).

## What the server must do for 1v1.lol

Enough of Photon's name, master and game server roles for PUN 2.18 to:

1. Connect, ping, GetRegions (one region), Authenticate (accept any AppId and
   version; guests have no token).
2. Join the lobby, and JoinRandomRoom with the property filter the game sends
   (mode, version, and whatever else it puts in the expected properties),
   creating a room when none matches, with the max-players the client asks
   for.
3. In the room: join/leave events, actor numbers, room and player properties
   (with the CAS checks PUN uses), RaiseEvent with receiver groups and event
   caching (PUN's instantiate and buffered RPCs depend on it), interest groups
   if the game uses them, master client handover, and closing/hiding rooms
   when the game marks them closed or invisible.
4. Room lists or lobby statistics only as far as the menu needs them.

It does not run any game logic. Rooms live in memory; a restart ends the
matches in progress.

## Repo shape

- A new public GitHub repo, `55gms/multiplayer` (owner's decision).
- Node.js (current LTS, ES modules), `ws` for websockets, no framework needed.
- Shared core: HTTP/upgrade routing by path, connection limits, logging, a
  `/api/mp/health` endpoint. One folder per game protocol, e.g.
  `games/1v1/` (Photon roles) and later `games/steal-and-run/` (Colyseus).
  The Photon protocol code (binary 1.8 serializer, message framing) sits in
  its own module so another Photon game can reuse it.
- Safety: per-message size cap, per-connection message rate cap, max
  connections per IP, idle timeouts, max players per room as the client asks
  but never above a server cap.

## On the 55GMS side

- `static/misc/nowgg/index.html`: add the WebSocket redirect script.
- If the `userSettings/time` call turns out to block PLAY, answer it from the
  multiplayer server (`/api/mp/1v1/time`) and redirect it in the same script.
- Docs: a short section in `docs/proxy-stack.md` or a new `docs/multiplayer.md`
  in 55GMS pointing at the new repo and the Caddy route; `CLAUDE.md` gets a
  line.

## Risks and unknowns

- The Photon protocol has to be learned from the client and from the public
  Photon client source; parts of PUN's matchmaking behaviour (expected
  properties, lobby types, SQL lobby filters) may need several capture-and-fix
  rounds. Getting to the main menu without "Connecting…" is quick; getting a
  full match working is the bulk of the work.
- The game may depend on the dead Firebase functions for something on the way
  to a match. If so, stub them on our server.
- Photon Chat (parties) is a separate connection; leaving it broken must not
  block solo PLAY. If it does, give it a stub endpoint that accepts and stays
  quiet.
- Bandwidth: every match's traffic passes through the box. PUN sends at its
  default rates (10–20 messages a second per player); fine at our scale, but
  the server should log rooms, players and bytes so it can be watched.
- Legal: running a compatible server for someone else's game whose official
  servers are gone. The owner accepted this.

## Left to the builder

- How to structure the Photon serializer and the three roles internally.
- Whether name, master and game run as one shared room registry in one
  process (expected) or more.
- The exact local development setup.
- Which pm2/systemd setup and port, as long as Caddy routes `/api/mp/*` to it
  and the deploy is automatic on push like 55GMS.
- How far to go on room lists and statistics, as long as the menu works.

## Done when

Two browsers on two different 55GMS domains open 1v1.lol, both press PLAY on
the `1v1` casual mode, end up in the same match, can see and shoot each other,
and the match ends normally. Then the same for the other three casual modes.

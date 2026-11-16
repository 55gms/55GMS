# 55GMS Multiplayer Server (1v1.lol) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new public repo, `55gms/multiplayer`, runs one Node process that stands in for Photon's name, master and game servers, so 1v1.lol on any 55GMS domain matches 55GMS players with each other.

**Architecture:** A plain `http` server with `ws` routes websocket upgrades by path (`/api/mp/<game>/<role>`) to per-game modules. A shared Photon layer (binary protocol 1.8 codec, message framing, a peer wrapper) sits under `src/photon/`. The 1v1.lol module implements the three Photon roles over one in-memory room registry. A small script in the 55GMS game page rewrites the game's Photon URLs to `/api/mp/1v1/…` on the page's own host. Caddy routes `/api/mp/*` to the process on `127.0.0.1:8093`.

**Tech Stack:** Node.js 22+ (ES modules), `ws`. No framework, no database.

**Spec:** `docs/superpowers/specs/2026-11-16-multiplayer-server-design.md` (in the 55GMS repo).

## Global Constraints

- Repo: `55gms/multiplayer`, public, local checkout at `/home/jiayang/code/multiplayer`.
- Listens on `127.0.0.1:8093` in production (`PORT`, default 8093; `HOST`, default `0.0.0.0` locally).
- All public paths start with `/api/mp/`. Players only ever use port 443 in production.
- Photon endpoints for 1v1.lol: `/api/mp/1v1/ns`, `/api/mp/1v1/master`, `/api/mp/1v1/game`. Websocket subprotocol `GpBinaryV18` must be accepted.
- Addresses the server hands to clients are built from the upgrade request's `Host` header: `wss://<host>/api/mp/1v1/<role>` (`ws://` when `X-Forwarded-Proto` is absent and the host is `localhost`/`127.0.0.1`).
- Accept any AppId, AppVersion and auth token. Guests only.
- Rooms live in memory. No game logic on the server.
- Caps (in `src/limits.js`): message ≤ 64 KiB, ≤ 120 messages/s per connection (burst 240), ≤ 8 connections per IP, idle close after 60 s without a frame, room max players ≤ 16 regardless of what the client asks.
- Owner preferences: no test files and no test runs; verification is by running the server and the capture tool. Commit after each task with semantic messages (`feat:`, `fix:`, `chore:`, `docs:`), each ending with the `Claude-Session:` line.
- The 55GMS game page `static/misc/nowgg/index.html` is never rebuilt; the shim is inline in it.

## Review Focus

1. A player closes the tab mid-match. The others get a Leave event, a new master client is chosen if needed, and the match goes on (Task 6, verification step).
2. Three or more players press PLAY on the `1v1` mode within the same second. No room ever holds more than its max players, and full or closed rooms are never offered by JoinRandom (Task 5, verification step).
3. A room empties. It disappears from matchmaking at once, and nobody is matched into a dead room (Tasks 5–6).
4. Garbage, oversized or truncated frames arrive. That connection is closed and the process keeps running (Tasks 2–3, verification step).
5. A player joins a room after objects were instantiated (modes with more than 2 players). They see those objects, because cached events are replayed in order on join (Task 6, verification step).

---

### Task 1: Repo, core server, GitHub

**Files:**

- Create: `package.json` (`"type": "module"`, dep `ws`, `"start": "node ."`), `index.js`, `src/server.js`, `src/limits.js`, `src/log.js`, `games/index.js`, `README.md`, `.gitignore`, `.prettierrc` (copy 55GMS's)

**Interfaces:**

- Produces:
  - `createServer({ games }) -> http.Server` in `src/server.js`. `GET /api/mp/health` → `200 {"ok":true,"games":[...],"connections":n}`. An upgrade on `/api/mp/<game>/<rest>` calls `games[<game>].upgrade(req, socket, head, rest)`; any other upgrade or unknown game → `socket.destroy()`. HTTP `/api/mp/<game>/<rest>` calls `games[<game>].http?.(req, res, rest)`, else 404.
  - A game module: `{ name: string, upgrade(req, socket, head, rest: string), http?(req, res, rest: string) }`.
  - `src/limits.js`: `acceptConnection(ip) -> release() | null` (per-IP cap); `rateLimiter() -> { allow(): boolean }`; `clientIp(req)` (first `X-Forwarded-For` hop if `req.socket.remoteAddress` is loopback, else the socket address); constants `MAX_MESSAGE_BYTES`, `IDLE_MS`, `MAX_ROOM_PLAYERS`.
  - `src/log.js`: `log(event: string, fields?: object)` writes one JSON line to stdout.
  - `games/index.js`: `export default { "1v1": ... }` (empty object until Task 4).

- [ ] **Step 1:** Write the files above. `index.js` reads `PORT`/`HOST`, calls `createServer`, listens, and logs `{"event":"listening"}`. Every 60 s, log counts of connections, rooms and bytes in/out (games report theirs through a `stats()` function on the module, optional).
- [ ] **Step 2: Verify.** `node . & sleep 1; curl -s localhost:8093/api/mp/health` → `{"ok":true,"games":[],"connections":0}`. `node -e "new (require('ws'))('ws://localhost:8093/nope').on('close',()=>console.log('closed'))"` prints `closed`.
- [ ] **Step 3:** `git init`, commit `feat: core server that routes /api/mp/<game> to game modules`. `gh repo create 55gms/multiplayer --public --source . --push`.

### Task 2: Photon protocol 1.8 codec

**Files:**

- Create: `src/photon/protocol18.js`, `src/photon/codes.js`, `tools/frames.txt` (the captured frames below)

**Interfaces:**

- Produces (`protocol18.js`):
  - `class Typed { constructor(type: 'byte'|'short'|'long'|'float'|'double', v) }` plus helpers `byte(n)`, `short(n)`, `long(n)`, `float(n)`, `double(n)`. Decoding returns `Typed` for those types and a plain `number` only for `int`, so a decoded value re-encodes to the same types. Booleans, strings, `null` are plain; byte arrays are `Uint8Array`; Hashtables and Dictionaries are `Map`; object arrays are `Array`; typed arrays (`int[]`, `string[]`, …) are `{ $array: '<type>', items: [...] }`; custom types are `{ $custom: code, bytes: Uint8Array }`. Dictionaries keep their key/value type bytes on the `Map` as `map.$dict = [keyType, valueType]`.
  - `keyId(key) -> string` (`"b:255"`, `"s:name"`, `"i:3"`), for property maps keyed by mixed Photon keys.
  - `class Reader { constructor(buf: Uint8Array); value(); raw() -> Uint8Array /* the next value's encoded bytes, unparsed */; params() -> Map<number, any>; byte(); short(); ... }`
  - `class Writer { value(v); rawValue(bytes: Uint8Array); params(map: Map<number, any>); byte(n); short(n); ...; finish() -> Uint8Array }`
- Produces (`codes.js`): the Photon constants as named exports: `Op` (GetRegions 220, Authenticate 230, AuthenticateOnce 231, JoinLobby 229, LeaveLobby 228, CreateGame 227, JoinGame 226, JoinRandomGame 225, Leave 254, RaiseEvent 253, SetProperties 252, GetProperties 251, ChangeGroups 248, FindFriends 222, GetLobbyStats 221, ServerSettings 218, GetGameList 217, WebRpc 219), `Param` (Address 230, UserId 225, ApplicationId 224, Region 210, Token/Secret 221, AppVersion 220, RoomName 255, ActorNr 254, TargetActorNr 253, ActorList 252, Properties 251, Broadcast 250, PlayerProperties 249, GameProperties 248, Cache 247, ReceiverGroup 246, Data 245, Code 244, Group 240, Remove 239, Add 238, ExpectedValues 231, JoinMode 215, LobbyName 213, LobbyType 212, MasterClientId 203, Nickname 202, RoomOptionFlags 191, CleanupCacheOnLeave 241, PlayerTTL 235, EmptyRoomTTL 236, PublishUserId 239, Info 218, GameCount 229, PeerCount 246, MasterPeerCount 227, Cluster 196), `Ev` (Join 255, Leave 254, PropertiesChanged 253, Disconnect 252, ErrorInfo 251, CacheSliceChanged 250, GameList 230, GameListUpdate 229, AppStats 226, LobbyStats 224), `Err` (Ok 0, InternalServerError -1, InvalidOperation -2, OperationNotAllowedInCurrentState -3, InvalidAuthentication 32767, GameIdAlreadyExists 32766, GameFull 32765, GameClosed 32764, GameDoesNotExist 32758, NoRandomMatchFound 32760), `GameProp` (MaxPlayers 255, IsVisible 254, IsOpen 253, PlayerCount 252, Removed 251, PropsListedInLobby 250, CleanupCacheOnLeave 249, MasterClientId 248, ExpectedUsers 247, PlayerTtl 246, EmptyRoomTtl 245), `ActorProp` (PlayerName 255, IsInactive 254, UserId 253), `Cache` (DoNotCache 0, MergeCache 1, ReplaceCache 2, RemoveCache 3, AddToRoomCache 4, AddToRoomCacheGlobal 5, RemoveFromRoomCache 6, RemoveFromRoomCacheForActorsLeft 7), `Receivers` (Others 0, All 1, MasterClient 2).

- [ ] **Step 1: Get the reference.** Download the PUN 2 package (Photon's free Asset Store release, or a GitHub mirror of `Photon3Unity3D.dll` from PUN 2.18–2.30) and decompile `ExitGames.Client.Photon.Protocol18` with `ilspycmd` into `/tmp/.../scratchpad/photon-ref/` (not committed). Type codes and the compressed-int (varint + zigzag) rules come from there; confirm the codes listed above against it.
- [ ] **Step 2:** Write `protocol18.js` and `codes.js` against that reference.
- [ ] **Step 3:** Put these captured frames into `tools/frames.txt` (one hex frame per line, `#` comments), payloads after the 2-byte `f3 <type>` header:
  - op request `dc01e00724` + hex of `82620531-8737-4824-8fd2-a4d29e2417d8` (GetRegions, param 224 AppId)
  - op response `dcff7f0713` + hex of `ApplicationArchived` + `00`
  - internal op request `0101010d9906`, internal op response `010000080201 0d9906 0209d1bcc8a703` (spaces removed)
- [ ] **Step 4: Verify.** A one-off `node -e` (not committed) decodes each frame and re-encodes it, and every line round-trips byte for byte. A truncated frame (drop the last byte) throws a `RangeError` rather than returning junk.
- [ ] **Step 5:** Commit `feat: Photon binary protocol 1.8 codec and constants`.

### Task 3: Photon peer (framing and connection)

**Files:**

- Create: `src/photon/peer.js`

**Interfaces:**

- Consumes: `Reader`, `Writer` (Task 2); `acceptConnection`, `rateLimiter`, `clientIp`, `MAX_MESSAGE_BYTES`, `IDLE_MS`, `log` (Task 1).
- Produces:
  - `photonUpgrade(wss: WebSocketServer, onPeer: (peer: Peer) => void) -> (req, socket, head) => void`. Accepts subprotocol `GpBinaryV18`, enforces the per-IP cap, then wraps the socket in a `Peer`. One `WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES, handleProtocols })` per role is fine.
  - `class Peer extends EventEmitter`: fields `id` (process-unique int), `ip`, `host` (from `Host`), `scheme` (`wss`/`ws` per Global Constraints), `state` (free-form object for the role); methods `respond(opCode, returnCode, params = new Map(), debugMessage = null)`, `event(code, params)`, `eventRaw(bytes: Uint8Array)` (pre-encoded event message, for fan-out), `close()`; events `'op' (opCode, params: Map, rawParams: Map<number, Uint8Array>)`, `'close'`.
  - Framing: every websocket message is `0xF3`, a message type byte, then the body. Types: 1 InitResponse (server sends `f3 01 00` on open), 2 OperationRequest, 3 OperationResponse, 4 Event, 6 InternalOperationRequest, 7 InternalOperationResponse. Messages with the encrypted bit (`0x80`) close the connection. Internal op 1 (ping) is answered by the peer itself: params 1 = the client's timestamp echoed back, 2 = server time in ms as int. Request params are parsed into both `params` (decoded) and `rawParams` (encoded bytes, for relaying `Data` untouched).
  - Rate limiter and idle timer close the connection; a decode error closes the connection and logs `{"event":"bad_frame"}`; it never throws out of the handler.
- [ ] **Step 1:** Write `peer.js`.
- [ ] **Step 2: Verify.** With a throwaway role that answers every op with `Err.InvalidOperation`, a `node -e` client sends the captured GetRegions frame and gets `f3 01 00`, then an op response for 220; sends the ping and gets a type-7 reply echoing `0d9906`; sends 70 KiB and is closed; sends `f3 02 ff ff ff` and is closed, and the server is still up (`curl /api/mp/health`).
- [ ] **Step 3:** Commit `feat: Photon peer framing, ping, limits`.

### Task 4: 1v1.lol name server, and the page shim (first milestone)

**Files:**

- Create: `games/1v1/index.js` (module wiring and roles), `games/1v1/nameserver.js`, `tools/capture.mjs` (Playwright: opens a URL, logs websocket frames, console lines matching Photon/connect/error, failed requests, and saves a screenshot; uses `playwright-core` with `CHROME_PATH`)
- Modify: `games/index.js` (register `1v1`), `55GMS: static/misc/nowgg/index.html` (shim)

**Interfaces:**

- Consumes: `photonUpgrade`, `Peer` (Task 3); `Op`, `Param`, `Err` (Task 2).
- Produces:
  - `games/1v1/index.js` default export `{ name: "1v1", upgrade, http, stats }`, routing `rest` = `ns` | `master` | `game` (ignore anything after the role, such as a query string).
  - `address(peer, role) -> string` = `${peer.scheme}://${peer.host}/api/mp/1v1/${role}` (in `games/1v1/index.js`, used by Tasks 5–6).
  - Name server: `GetRegions` → Ok with `Region` = `string[] ["eu"]` and `Address` = `string[] [address(peer,'master')]`. `Authenticate`/`AuthenticateOnce` → Ok with `Address` = master address, `UserId` = the request's UserId or a random UUID, `Secret` = a random token string, `Cluster` = `"default"`. Anything else → `Err.InvalidOperation`.
  - Shim (inline `<script>` in the 55GMS page, before `UnityLoader.js`): wraps `window.WebSocket` so a URL whose host ends in `exitgames.com`, `exitgamescloud.com` or `photonengine.io` becomes `<page scheme ws/wss>://<location.host>/api/mp/1v1/ns`, and a URL whose path starts with `/api/mp/` keeps its path but takes the page's scheme and host. Base override for local work: `localStorage["gms-mp-base"]` (e.g. `ws://localhost:8093/api/mp`). The wrapper keeps `WebSocket.prototype` and the static constants.
- [ ] **Step 1:** Write the name server, register the game, add the shim to the 55GMS page.
- [ ] **Step 2: Verify.** Run multiplayer (`node .`) and 55GMS (`STATIC_ROOT=static node .`), open `/misc/nowgg/` with the localStorage override via `tools/capture.mjs`. The log shows GetRegions answered Ok, the client's region ping, Authenticate Ok, and a new websocket to `/api/mp/1v1/master`. If region pinging goes over HTTP (WebGL PUN pings `https://<host>/photon/m/?ping&r=…`), extend the shim to rewrite that request to `/api/mp/1v1/ping`, and have `http()` answer `ping` with `200` and an empty body.
- [ ] **Step 3:** Commit in both repos: `feat: 1v1.lol name server` (multiplayer) and `feat: point 1v1.lol at the 55GMS multiplayer server` (55GMS, on branch `docs/multiplayer-server`).

### Task 5: Master server and room registry

**Files:**

- Create: `games/1v1/rooms.js`, `games/1v1/master.js`

**Interfaces:**

- Consumes: Tasks 2–4.
- Produces (`rooms.js`):
  - `class Room { name; props: Map<string /*keyId*/, [key, value]>; maxPlayers; isOpen; isVisible; actors: Map<number, Actor>; nextActorNr = 1; masterActorNr; cache: Array<{ actorNr, code, rawData, receiverGroup }>; reservedUntil /* ms, for a slot handed out by master but not joined yet */ }`
  - `class Actor { actorNr; peer; props: Map; userId; groups: Set<number> }`
  - `registry`: `create(name?, options) -> Room` (name defaults to a UUID; `GameIdAlreadyExists` if taken), `get(name)`, `remove(name)`, `findRandom(expected: Map, maxPlayersFilter) -> Room | null` (open, visible, not full counting reservations, every expected key present with an equal value), `count()`.
- Master role:
  - `Authenticate` → Ok (same fields as name server). `JoinLobby` → Ok, then event `GameList` with an empty Hashtable (no room list needed unless the menu shows one; then fill it from the registry). `GetLobbyStats`/`ServerSettings` → Ok, empty.
  - `JoinRandomGame` → `findRandom(Param.GameProperties, …)`; found → Ok with `RoomName` and `Address` = game address, and reserve one slot for 10 s; none → `Err.NoRandomMatchFound` (PUN then calls CreateGame).
  - `CreateGame` → reserve the name in the registry with the requested game properties (`GameProperties` hashtable: `MaxPlayers` byte or int, `IsOpen`, `IsVisible`, custom keys), clamp max players to `MAX_ROOM_PLAYERS`, answer Ok with `RoomName` and `Address`. `JoinGame` → room exists and has space → Ok with `Address`; else `GameDoesNotExist` / `GameFull` / `GameClosed`. `JoinMode` 1 (CreateIfNotExists) on JoinGame creates.
- [ ] **Step 1:** Write `rooms.js` and `master.js`.
- [ ] **Step 2: Verify.** In the capture log, PLAY on `1v1` gives JoinRandomGame → NoRandomMatchFound → CreateGame Ok → a websocket to `/api/mp/1v1/game`. Record the exact expected-properties keys the game sends in the README (they define what "same mode" means).
- [ ] **Step 3: Verify Review Focus 2.** Three capture-tool pages press PLAY within a second (click `1075,620` on a 1280×720 viewport). The server log shows two of them in one room and the third in a different room, never three in one.
- [ ] **Step 4:** Commit `feat: 1v1.lol master server and matchmaking`.

### Task 6: Game server (rooms in play)

**Files:**

- Create: `games/1v1/game.js`

**Interfaces:**

- Consumes: `registry`, `Room`, `Actor` (Task 5), `Peer.eventRaw` (Task 3).
- Produces (all on the game role):
  - `Authenticate` → Ok. `CreateGame`/`JoinGame` (`JoinMode` honoured) → add an `Actor`, release the reservation. Response Ok with `ActorNr`, `ActorList` (`int[]`), `GameProperties` (Hashtable, including the well-known keys MaxPlayers as byte, IsOpen, IsVisible, MasterClientId as int), `PlayerProperties` (Hashtable actorNr → props), `MasterClientId`. Then replay `room.cache` to the joiner in order, as events from their original actors. Then broadcast event `Join` (`ActorNr`, `ActorList`, `PlayerProperties` = the joiner's props) to everyone including the joiner.
  - `RaiseEvent`: `Code`, `Data` (relayed as raw bytes), `ReceiverGroup` (default Others), `TargetActorNr` (`int[]`, overrides receivers), `Group` (interest group; 0 = all), `Cache`. The event sent carries `Data` raw, and `ActorNr` = sender. Cache rules: `AddToRoomCache` appends; `AddToRoomCacheGlobal` appends with actorNr 0; `RemoveFromRoomCache` removes entries matching sender (or any sender if actor 0), code (0 = any) and, if given, data; `RemoveFromRoomCacheForActorsLeft` drops entries of actors no longer present. Encode each fan-out event once and send the same bytes with `eventRaw`.
  - `SetProperties` (`Properties`, `ActorNr` for player props, `Broadcast`, `ExpectedValues` CAS): merge (a `null` value deletes), apply `IsOpen`/`IsVisible`/`MaxPlayers`/`MasterClientId` to the room fields, answer Ok (or `InvalidOperation` on a failed CAS), and send `PropertiesChanged` (`TargetActorNr` = actor or 0 for room, `Properties`, `ActorNr` = sender) to all when `Broadcast`.
  - `ChangeGroups` (`Remove`/`Add` byte arrays; empty array = all) updates `actor.groups`.
  - `Leave` and socket close: remove the actor; if `CleanupCacheOnLeave` is not false, drop their cache entries; if they were master, the lowest remaining actorNr becomes master; send `Leave` (`ActorNr`, `ActorList`, `MasterClientId` when it changed). An empty room is removed from the registry at once.
- [ ] **Step 1:** Write `game.js`.
- [ ] **Step 2: Verify the milestone.** Two capture-tool pages press PLAY on `1v1`. Both screenshots show the match, not the menu, and the log shows events 200/201/202 (PUN RPC, serialize, instantiate) relayed both ways. Fix whatever the log shows missing (unknown ops answered `InvalidOperation` are logged with their codes; implement each one the game needs).
- [ ] **Step 3: Verify Review Focus 1, 3.** Close one page mid-match. The other gets `Leave`, `MasterClientId` moves to it if needed, the room is removed when the second page closes, and a new PLAY makes a new room.
- [ ] **Step 4: Verify Review Focus 5.** In `BoxFight_Teams_2v2` (4 players), have the fourth page join after the others spawn. Its screenshot shows the other three players.
- [ ] **Step 5:** If the game stalls on `cloudfunctions.net/userSettings/time` or Photon Chat at any point, add the stub from the spec (`http()` answers `time` with the shape the game expects, read from the build's strings; the shim rewrites the URL; Photon Chat gets an endpoint that accepts Authenticate and stays quiet). Otherwise skip.
- [ ] **Step 6:** Commit `feat: 1v1.lol game server: rooms, events, cache, properties`, and a `fix:` commit per gap found.

### Task 7: Production

**Files:**

- Create: `deploy/entry.sh` (forced command; `deploy <sha>` → `git fetch && git checkout <sha> && npm ci --omit=dev && systemctl restart gms-multiplayer`, then `curl -sf 127.0.0.1:8093/api/mp/health` or check out the previous sha and restart; `status`), `deploy/gms-multiplayer.service` (systemd, `WorkingDirectory=/root/multiplayer`, `Environment=PORT=8093 HOST=127.0.0.1`, `Restart=always`), `.github/workflows/deploy.yml` (on push to `main`: `node --check` every `.js`, then SSH with the same three secrets and steps as 55GMS's `deploy.yml`)
- Modify: `README.md` (endpoints, local dev with the shim override, the capture tool, server setup steps below), 55GMS `docs/multiplayer.md` (new: what it is, the Caddy route, the shim) and `CLAUDE.md` (one line under Proxy infrastructure or Frontend pointing at it)

- [ ] **Step 1:** Write the files and push. Generate a new deploy key pair; set repo secrets `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_KNOWN_HOSTS` with `gh secret set` (host and known_hosts the same as 55GMS's).
- [ ] **Step 2: On the server (`ssh 55gms`).** Clone to `/root/multiplayer`; install `entry.sh` at `/root/deploy-mp/entry.sh`; add the public key to `/root/.ssh/authorized_keys` with `command="/root/deploy-mp/entry.sh",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding`; install and enable the systemd unit. In Caddy's catch-all block add `@mp path /api/mp/*` → `reverse_proxy 127.0.0.1:8093` ahead of the app, next to the Wisp route; `caddy validate` then `systemctl reload caddy`. Back up the Caddyfile first.
- [ ] **Step 3: Verify.** `curl -s https://55gms.com/api/mp/health` → ok. A push to `main` runs the workflow green and `ssh 55gms` shows the new sha in `systemctl status gms-multiplayer`.
- [ ] **Step 4:** Merge the 55GMS branch (shim and docs) to `main` through a PR so it deploys.
- [ ] **Step 5: Verify done.** Two capture-tool pages, on two different 55GMS domains, press PLAY on `1v1` and end up in the same match; repeat for `BoxFight_Teams_2v2`, `PipeRun_Race` and `Teams_City_ZoneWars`. Then ask the owner to try it from a school network.
- [ ] **Step 6:** Commit `chore: deploy workflow and server setup` (multiplayer) and `docs: multiplayer server` (55GMS).

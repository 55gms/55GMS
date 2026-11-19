# Multiplayer server

Multiplayer games whose own servers are gone, or blocked, play against the
55GMS multiplayer server instead: [55gms/multiplayer](https://github.com/55gms/multiplayer).
It is a separate Node process on the same box (`gms-multiplayer`, `127.0.0.1:8093`),
and Caddy sends `/api/mp/*` on every hostname to it, the same way `/api/live/*`
goes to epoxy-server. If it is down, only multiplayer breaks.

Each game gets endpoints under `/api/mp/<game>/` that speak the protocol its
client already expects. 55GMS players only play each other.

## 1v1.lol (`static/misc/nowgg/`)

The build's Photon app is archived (`ApplicationArchived`), so it sat on
"Connecting…" everywhere. An inline script at the top of
`static/misc/nowgg/index.html` wraps `WebSocket`: any `*.exitgames.com`,
`*.exitgamescloud.com` or `*.photonengine.io` address becomes
`/api/mp/1v1/ns` on the page's own host and scheme, and the server's own
`/api/mp/…` addresses are kept on that host too. Locally, point it at a
multiplayer server on another port with
`localStorage["gms-mp-base"] = "ws://localhost:8093/api/mp"`.

A 55GMS account stands in for the game's Google login (`docs/1v1-backend.md`):
the page adds the account's game token to each Photon connection, the server
asks 55GMS whose it is, and ranked (`1v1_Competitive`) is for accounts only.
The server decides each `1v1` and ranked 1v1 result from the players' own
messages and posts it to 55GMS at `/api/1v1/internal/match`, which keeps the
ratings, XP and battle pass. Both sides need the same `MP_SHARED_SECRET`.
Friends do not work; parties do. Details, setup and the capture tool are in
that repo's README.

A casual search that finds no room on 55GMS goes straight to another public
1v1.lol server's queue, 1v1.lol Reloaded's (`wss://ws.onecloudcdn.site/ns`).
The multiplayer server passes the player's master connection through and
relays the game server connection at `/api/mp/1v1/remote`, so the page needs
no change. There the player is named `55gms.com`; on their own screen the
players they meet there get random names from a list. The multiplayer server
referees their casual `1v1` matches from the relayed messages, so a signed-in
player still gets XP, stats and battle pass progress; they are never rated.
Ranked and parties stay on 55GMS.

## BasketBros, SoccerBros, BaseballBros, FootballBros, HockeyBros, Fight Bros, Wrestle Bros

Blue Wizard's games find their servers from the page's own hostname, so on
55GMS they dialled `wss://EA.55gms.com/0` (and pinged `https://EA.55gms.com/ping`
for the region list), which does not exist; their real servers are on
`*.basketbros.io`, which filters block. `static/assets/js/bros-mp.js`, loaded
before the game on `static/misc/{basketbros-io,soccerbros,baseballbros-io,footballbros,hockey-bros,fight-bros,wrestle-bros}/index.html`
with `data-game` set to the server's name for it, sends both to
`/api/mp/<game>/play` and `/api/mp/<game>/ping` on the page's host. Only the
`EA` ("US Atlanta") ping answers, so the game lists one server. Public games,
private codes and chat work. Wrestle Bros (`wrestlebros`) is one against one
like BasketBros; FootballBros keeps its lobby of up to three a
side, HockeyBros (`hockeybros`) uses the same lobby, and Fight Bros
(`fightbros`) uses it for up to four fighters, who pick their bros and the
host's stage through the lobby chat. The server runs every match itself (it
sends the shared 60 Hz tick); nothing goes to Blue Wizard's servers. Accounts are not
involved: names and records are the game's own. The protocol is in that repo's README. Bump the `?v=` on `bros-mp.js` in these
pages when it changes (game pages are never rebuilt).

## Kart Bros (`static/misc/kart-bros/`)

Kart Bros's servers are hard-coded (`wss://kart{da,ea,eu,mw,we}.kartbros.io/<n>`,
pinged at `https://kart<xx>.kartbros.io/ping`) on a domain filters block. An
inline script at the top of its page sends the socket to
`/api/mp/kartbros/play` and the pings to `/api/mp/kartbros/ping` on the page's
host, so it lists one server ("US Dallas"). The multiplayer server is the
game's whole session server: Host makes a lobby there under the code the
game shows (three words), Join and invite links (`?room=<code>`) find it, and
up to six racers and eight spectators share it. As on the original, the host's
game runs the race and the server relays it to the others; nothing goes to
Blue Wizard's servers. Rejoining after a dropped connection is refused, so a
player who drops joins again with the code. Locally, point it at a multiplayer server on another port with
`localStorage["gms-mp-base"] = "ws://localhost:8093/api/mp"`. The protocol is
in that repo's README.

## Ducklings.io (`static/misc/ducklings-io/`)

Ducklings.io's own server still runs, so this one is a relay, not a server
of ours. The game dials `wss://ducklings.io/ws`, which now redirects to
`wss://multiplayer.ducklings.io/ws` (browsers do not follow WebSocket
redirects); that server refuses any `Origin` but `https://ducklings.io`, and
filters block the domain. An inline script before the `<base>` in the game's
page sends any `ducklings.io` WebSocket to `/api/mp/ducklings/play`, and the
multiplayer server opens the real socket with the origin it accepts and
passes frames through unchanged. It carries matchmaking and WebRTC
signalling only: the match itself runs between the players' browsers over
WebRTC (or the game's TURN server), so a network that blocks WebRTC still
breaks it after a room is found.

## Smash Karts (`static/misc/smashkarts/`)

Smash Karts' own Photon servers still run, and its build still plays on them. 55GMS hosts the build itself (the page, and `Build/`, `StreamingAssets/`, `scripts/` in the assets repo) and puts the multiplayer server in front of its Photon traffic, so that private games and parties are on 55GMS and PLAY still reaches everyone who plays on the official cloud. An inline script before the `<base>` wraps `WebSocket`: any `*.exitgames.com`, `*.exitgamescloud.com` or `*.photonengine.io` address becomes `/api/mp/smashkarts/ns` on the page's host, and the server's own `/api/mp/…` addresses are kept on that host. Locally, point it at a multiplayer server on another port with `localStorage["gms-mp-base"] = "ws://localhost:8093/api/mp"`.

PLAY looks for a matching room on 55GMS; with none it goes on to the official cloud with the player's own Firebase login (a lone player meets the people who play there, and the game shows no difference). Create and Join (private games, parties) stay on 55GMS: a code the 55GMS server does not know gets "Game does not exist", so a code from a private game on smashkarts.io does not work here. Details are in that repo's README.

The page is the official one with everything that was not the game taken out:

- no ads (`scripts/ads-stub.js` answers the ad calls with nothing and never grants a reward), no house promotions, frame bar or ad-block detection, no analytics (the Firebase Analytics script is not loaded), no `cc.js` (a console warning);
- the build is in `Build/` **uncompressed**, with the wasm and the two data files in 10 MB `.partN` pieces (`scripts/split-game-files.js`) that the page joins with `GameLoader.merge` and gives Unity as blobs. Do not store the official `.br` files: jsDelivr compresses every response with Brotli, so a `.br` file reaches the browser encoded twice and Unity cannot read it. The mobile data file (`9fc7…`) and the desktop one (`e8bf…`) are both there, as the page picks one by ASTC support. Fetch the files with `curl --raw -H "Accept-Encoding: br"`, decompress them (`zlib.brotliDecompressSync`), then split;
- the game's addressable bundles and the catalog stay on its own CDN (`smashkartsgc.b-cdn.net`), as the official page does for hosts it does not know. `StreamingAssets/aa/settings.json` names the catalog for the build; the CDN removes old catalogs when Tall Team publishes a new one, so **the build goes stale on their next release** and must be ripped again (`node scripts/rip-game.js https://smashkarts.io/ --name smashkarts --force --headless --wait 60`, then redo the clean-up above, and fetch, decompress and split the four `Build/` files) before PLAY can load. The client version in the Photon login also has to be current for the cloud to accept it.

## Games whose own servers still run: `game-net.js`

A ripped game whose official servers are still up keeps playing on them.
Its files are served like any other game's; only its network traffic goes
out through the site's Wisp server (`/api/live/`, the proxy's), so no game
code changes and the full proxy is not loaded. `static/assets/js/game-net.js`,
in the page's `<head>` before the `<base>`, replaces `WebSocket`, `fetch` and
`XMLHttpRequest` for the hosts it is given:

```html
<script
  src="/assets/js/game-net.js?v=1"
  data-sockets="*"
  data-fetch="slither.io"
  data-origin="http://slither.io"
></script>
```

- `data-sockets`: hosts whose WebSockets are tunnelled. `slither.io` is that
  host, `*.slither.io` adds its subdomains, `*` is every host but the page's
  own (needed when the servers are raw IP addresses).
- `data-fetch`: hosts whose `fetch` and `XMLHttpRequest` calls are tunnelled
  (asynchronous XHR only).
- `data-origin`: the `Origin` header sent with both. Many game servers drop a
  connection from any other origin, and a browser cannot set it itself.
- `data-root`: for a game built to sit at the root of its own site (MK48's
  engine, a history-mode router): that site's origin. A root path the game
  asks for, which lands on this host or on the CDN's root through the
  `<base>`, goes to that site instead, and a server on a subdomain of this
  host (`2.55gms.com`) becomes the same subdomain there (`2.mk48.io`).
- `data-local`: root path prefixes that stay in the game folder
  (`/data/ /translation/`), for `data-root` games.
- `data-block`: hosts whose `<script>`s never load; the script fires `error`.
  For ad and analytics code a game injects by itself (MK48's server-sent
  snippet adds AdinPlay).
- `data-disable`: globals removed before the game starts, such as
  `WebTransport`, which Wisp cannot carry, so the game falls back to a
  WebSocket.

Every game's files stay in the 55gms/assets folder; the tunnel carries only
live traffic (APIs, matchmaking, game sockets). When a rip misses files a
game loads on demand, download them into the folder and point the game at
them; do not tunnel them from the original site.

What the shim also does by itself:

- Images from the page's `<base>` host (jsDelivr, which always allows CORS)
  are requested with CORS, so a game can draw them into WebGL as it could
  from its own origin.
- TLS through Wisp trusts Let's Encrypt's intermediates as well as the usual
  roots (`static/assets/json/tls-intermediates.json`): browsers fetch a
  server's missing intermediate, rustls does not, and some game servers
  (M28's) send only their own certificate.
- Cookies set on tunnelled responses are kept in a jar per game folder
  (`localStorage["gms-net-cookies:/misc/<folder>"]`) and sent back on later
  tunnelled requests and socket handshakes, so cookie logins can work.

This gets past what breaks such games on 55GMS: `ws://` servers on an
`https://` page (mixed content), origin checks, and filters that block the
game's domains (the browser only talks to 55GMS). epoxy-server still refuses
loopback and private addresses, so `*` cannot reach this machine.

WebSockets are spoken by `game-net.js` itself over a raw TCP (`ws:`) or TLS
(`wss:`) Wisp stream, not through Epoxy's WebSocket: Epoxy splits its socket
and fastwebsockets' write half never flushes, so each frame sat in the Wisp
stream until the next was sent, and a game that sends one message and waits
for the answer (slither.io's handshake) hung. HTTP goes through Epoxy's
`request`, which flushes. The Epoxy bundle (`/assets/lib/vendor-net.js`,
about 1.7 MB) starts loading with the page. Bump the `?v=` on `game-net.js`
in the pages that load it when it changes (game pages are never rebuilt).

It does not help a game whose servers are gone (use the multiplayer server
above), one that plays over WebRTC, or one whose sign-in is bound to its own
domain (Google sign-in, a Turnstile or hCaptcha site key).

Games often refuse to run off their own site. Patches used so far: a host
check sending the page to the original (Zorr's `wi()`), the obfuscator's
domain lock that blanks the page (Ships 3D), a hostname handed to WASM
(digdig's), and an arena or route read from the page's path (MK48 and SPA
routers: the page sets its path to `/` with `history.replaceState`).

### Slither.io (`static/misc/slither-io/`)

The client is the official one, ripped. It loads its server list from
`https://slither.io/i80124.txt` (tunnelled; the rip rewrites it back from a
local copy) and plays on `ws://<ip>:<port>/slither`, pinging `ws://<ip>:80/ptc`
to pick a server. The servers only answer `Origin: http://slither.io`. The
Twitter/Facebook box and analytics were removed; images the game loads on
demand (cosmetics, code pad, team buttons) are in the files under `s/`.

### Zorr.pro, MK48.io, Territorial.io, Skribbl.io, Ships 3D

- Zorr.pro (`zorr-pro`): sockets to `*.zorr.pro`. Its start function sends
  other hosts to zorr.pro; that check is off. The default fonts are local; a
  font picked in its settings still loads from Google Fonts.
- MK48.io (`mk48`): Softbear's engine, `data-root="https://mk48.io"` with
  `/data/` and `/translation/` local, `WebTransport` disabled, its ad snippet
  blocked. `system.json` (servers, snippets) is live. The WASM's one CSS
  sprite path was patched to a relative one of the same length.
- Territorial.io (`territorial-io`): the 640 KB inline script is `game.js`
  in the folder, and its maps (`maps/<id>-<version>[p].bin`) are local.
  Turnstile only runs on its own hosts, so players get the game's own
  captcha once before joining.
- Skribbl.io (`skribbl-io`): `POST https://skribbl.io/api/play` names the
  socket.io server; images, sounds and fonts are local.
- Ships 3D (`ships`): API and game sockets on `yp3d.com`; every webpack asset
  the bundles name is in the folder (`<hash>.png|glb`).

Tried and left on the proxy for now: digdig.io (M28's game servers turn
away the tunnelled client after its hello, for a reason not found), Deeeep.io
(menus work, but playing needs an account and its Google sign-in is bound to
deeeep.io), Venge.io (matchmaking works; its game server refused the
connection when tested, and its skins come from a live CDN catalogue),
Pokemon Showdown, deadshot.io (device attestation), and the Unity games
(Kour.io, Snowball.io, buildnow.gg, Stumble Guys).

Design and plan for accounts: `docs/superpowers/specs/2026-11-16-1v1-accounts-competitive-design.md`,
`docs/superpowers/plans/2026-11-16-1v1-accounts-competitive.md`.

Design and plan: `docs/superpowers/specs/2026-11-16-multiplayer-server-design.md`,
`docs/superpowers/plans/2026-11-16-multiplayer-server.md`.

## digdig.io (`static/misc/digdig-io/`)

M28 still runs digdig.io's servers, but this is a server of our own, not a relay: `games/digdig` in the multiplayer repo speaks the client's protocol (worked out from the client; the record is that folder's `README.md`) and runs the game itself: the same map as the official one (the client draws it from a seed), digging, ores, combat, fog of war and a leaderboard. Every lobby keeps bots playing (12 diggers, at least 4 bots) that farm ore, hunt smaller diggers, players and bots alike, and run from bigger ones. An inline script before the `<base>` sends the client's server list request (`api.n.m28.io`) to `/api/mp/digdig/servers` and its game socket (`*.s.m28n.net`) to `/api/mp/digdig/play` on the page's host; `localStorage["gms-mp-base"]` points it elsewhere for testing. The `client.js` in the assets repo reports `digdig.io` as the page's hostname to the game, which refuses to start on any other. Each mode button has its own lobbies: FFA, TDM (three coloured teams that cannot hurt each other), Tag (5-minute rounds; seekers turn hiders into seekers), Battle Royale (rounds in a shrinking arena) and Maze (the same maze walls the client draws from the seed). Squads do nothing yet.

**Accounts.** A 55GMS account stands in for the game's Discord/Apple login (on with `utils/features.js` `digdig`, the same needs as 1v1.lol: the Postgres account backend, `ADMIN_TOKEN_SECRET`, `MP_SHARED_SECRET`; tables from `node scripts/add-digdig.js`). Before the game starts, the page gets a game token from `POST /api/digdig/token` and saves it as the game's own login, so the game shows the handle and sends the token to the multiplayer server, which checks it with `/api/digdig/internal/verify`. Signed out, the login buttons (relabelled "Sign in/up with 55GMS" in the assets repo's `client.wasm`; `client.js` sends their navigation through `window.gmsNavigate`) open `/login` and `/signup`. The account keeps gold (a ledger, `digdig_gold_ledger`) and skins (`digdig_items`): the multiplayer server grants the gold each life collected when it ends (`/internal/gold`, once per source) and buys skins through `/internal/buy`, which charges our prices (`utils/digdig-skins.json`) under the account's row lock. Equipped skins are worn only if owned. Guests see 0 gold and keep nothing. The routes are `routes/digdig.js`; the internal ones answer only the multiplayer server (`utils/mpInternal.js`, shared with 1v1.lol).

**Tag display.** The game shows "You are a seeker/hider" only while a byte of its game object is set, which nothing the server sends sets; in Tag games the page catches the game's wasm memory as it is created and sets that byte (memory 331786 in this build: check it after updating `client.wasm`).

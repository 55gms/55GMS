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
players they meet there get random names from a list. Those matches give no 55GMS
results. Ranked and parties stay on 55GMS.

## BasketBros, SoccerBros, BaseballBros, FootballBros

Blue Wizard's games find their servers from the page's own hostname, so on
55GMS they dialled `wss://EA.55gms.com/0` (and pinged `https://EA.55gms.com/ping`
for the region list), which does not exist; their real servers are on
`*.basketbros.io`, which filters block. `static/assets/js/bros-mp.js`, loaded
before the game on `static/misc/{basketbros-io,soccerbros,baseballbros-io,footballbros}/index.html`
with `data-game` set to the server's name for it, sends both to
`/api/mp/<game>/play` and `/api/mp/<game>/ping` on the page's host. Only the
`EA` ("US Atlanta") ping answers, so the game lists one server. Public games,
private codes and chat work; FootballBros keeps its lobby of up to three a
side. Accounts are not involved: names and records are the game's own. The
protocol is in that repo's README. Bump the `?v=` on `bros-mp.js` in the four
pages when it changes (game pages are never rebuilt).

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
above), one that plays over WebRTC, or one whose login needs the original
site's cookies.

### Slither.io (`static/misc/slither-io/`)

The client is the official one, ripped. It loads its server list from
`https://slither.io/i80124.txt` (tunnelled; the rip rewrites it back from a
local copy) and plays on `ws://<ip>:<port>/slither`, pinging `ws://<ip>:80/ptc`
to pick a server. The servers only answer `Origin: http://slither.io`. The
Twitter/Facebook box and analytics were removed; images the game loads on
demand (cosmetics, code pad, team buttons) are in the files under `s/`.

Design and plan for accounts: `docs/superpowers/specs/2026-11-16-1v1-accounts-competitive-design.md`,
`docs/superpowers/plans/2026-11-16-1v1-accounts-competitive.md`.

Design and plan: `docs/superpowers/specs/2026-11-16-multiplayer-server-design.md`,
`docs/superpowers/plans/2026-11-16-multiplayer-server.md`.

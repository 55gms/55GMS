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
Friends and parties do not work. Details, setup and the capture tool are in
that repo's README.

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

Design and plan for accounts: `docs/superpowers/specs/2026-11-16-1v1-accounts-competitive-design.md`,
`docs/superpowers/plans/2026-11-16-1v1-accounts-competitive.md`.

Design and plan: `docs/superpowers/specs/2026-11-16-multiplayer-server-design.md`,
`docs/superpowers/plans/2026-11-16-multiplayer-server.md`.

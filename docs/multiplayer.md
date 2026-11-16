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

Guests only: Google login, the shop, LOL Pass, friends and parties do not
work. Details, setup and the capture tool are in that repo's README.

Design and plan: `docs/superpowers/specs/2026-11-16-multiplayer-server-design.md`,
`docs/superpowers/plans/2026-11-16-multiplayer-server.md`.

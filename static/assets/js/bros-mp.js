// Blue Wizard's sports games (BasketBros, SoccerBros, BaseballBros,
// FootballBros) look for their servers at <region>.<this page's host>:
// https://EA.55gms.com/ping to list regions, wss://EA.55gms.com/0 to play.
// Those hosts do not exist, and the games' own servers are on blocked
// domains, so send both to the 55GMS multiplayer server
// (github.com/55gms/multiplayer) on this page's own host instead.
//
// Load it before the game, with the server's name for the game:
//   <script src="/assets/js/bros-mp.js?v=1" data-game="soccerbros"></script>
// Locally, point it at a multiplayer server on another port with
//   localStorage["gms-mp-base"] = "ws://localhost:8093/api/mp"
(() => {
  const game = document.currentScript && document.currentScript.dataset.game;
  if (!game) return;
  let base = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/api/mp`;
  try {
    base = localStorage.getItem("gms-mp-base") || base;
  } catch {}
  const httpBase = base.replace(/^ws/, "http");

  // The games build the host from location.hostname, without "www." (and
  // "basketbros.io" on localhost or a LAN address); FootballBros goes to
  // ws://<host>:3000 on localhost.
  const sites = [
    "basketbros.io",
    "soccerbros.gg",
    "footballbros.io",
    "baseballbros.io",
  ];
  const page = location.hostname.toLowerCase();
  const region = (host) => {
    const m = /^(WE|EA|EU|AS|AU|MW|DA|NY)\.(.+)$/i.exec(host);
    if (!m) return null;
    const site = m[2].toLowerCase();
    return page.endsWith(site) || sites.includes(site)
      ? m[1].toUpperCase()
      : null;
  };
  const isLocalDev = (u) =>
    u.port === "3000" && /^(localhost|127\.)/.test(u.hostname);

  const socketUrl = (url) => {
    try {
      const u = new URL(String(url), location.href);
      if (!/^wss?:$/.test(u.protocol)) return url;
      const r = region(u.hostname) || (isLocalDev(u) ? "EA" : null);
      if (r) return `${base}/${game}/play?region=${r}`;
    } catch {}
    return url;
  };
  const pingUrl = (url) => {
    try {
      const u = new URL(String(url), location.href);
      const r = u.pathname === "/ping" && region(u.hostname);
      if (r) return `${httpBase}/${game}/ping?region=${r}`;
    } catch {}
    return url;
  };

  const Native = window.WebSocket;
  function GMSWebSocket(url, protocols) {
    return protocols == null
      ? new Native(socketUrl(url))
      : new Native(socketUrl(url), protocols);
  }
  GMSWebSocket.prototype = Native.prototype;
  for (const k of ["CONNECTING", "OPEN", "CLOSING", "CLOSED"])
    GMSWebSocket[k] = Native[k];
  window.WebSocket = GMSWebSocket;

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return open.call(this, method, pingUrl(url), ...rest);
  };
})();

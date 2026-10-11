// Builds everything around the game on a game page (/misc/play/): the three ad
// boxes and the tiles of random games: a small cluster beside the ads, plus
// the place of any ad that is not shown. The page
// ships only the game frame inside #gamepage; the grid itself is laid out in
// gameframe.css. Runs at the end of <body>, so the ad boxes exist before
// script.js fills them on DOMContentLoaded.
(() => {
  const page = document.getElementById("gamepage");
  if (!page) return;

  const CELL = 94;
  const PITCH = 110; // a cell and the gap after it
  const PHONE_ROWS = 2;
  const RECENT_KEY = "55gms.recentGames.v1";
  const RECENT_LIMIT = 24;
  const phone = window.matchMedia("(max-width: 789px)");

  function adBox(place, size) {
    const box = document.createElement("div");
    box.className = `ad-box ad-box--${place}`;
    const fit = document.createElement("div");
    fit.className = "ad-fit";
    fit.dataset.adSize = size;
    box.append(fit);
    // A slot with no ad to show is hidden by the ads script. Its box goes too,
    // and tiles take the cells.
    new MutationObserver(() => {
      const slot = fit.firstElementChild;
      if (!slot || slot.style.display !== "none" || box.hidden) return;
      box.hidden = true;
      fill();
    }).observe(fit, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    return box;
  }

  function createTile() {
    const tile = document.createElement("a");
    tile.className = "game-tile";
    return tile;
  }

  const bigTile = createTile();
  bigTile.classList.add("game-tile--big");
  const fixed = [
    document.getElementById("gameframe"),
    adBox("left", "160x600"),
    adBox("right", "300x250"),
    adBox("wide", "728x90"),
    bigTile,
  ].filter(Boolean);
  page.append(...fixed.slice(1));

  const tiles = [];
  let queue = null; // games not yet on a tile, once the catalogue is in

  // How many single-cell tiles the grid has room for: every cell of its first
  // --rows rows that the game, a shown ad or the big tile does not cover.
  function freeCells() {
    const style = getComputedStyle(page);
    if (phone.matches) {
      const columns = style.gridTemplateColumns.split(" ").length;
      return columns * PHONE_ROWS - 1;
    }
    const columns = Number(style.getPropertyValue("--cols"));
    const rows = Number(style.getPropertyValue("--rows"));
    const top = page.getBoundingClientRect().top;
    let taken = 0;
    for (const element of fixed) {
      const box = element.getBoundingClientRect();
      if (!box.width || Math.round((box.top - top) / PITCH) >= rows) continue;
      taken +=
        Math.round((box.width + PITCH - CELL) / PITCH) *
        Math.round((box.height + PITCH - CELL) / PITCH);
    }
    return columns * rows - taken;
  }

  function fill() {
    const wanted = Math.max(0, freeCells());
    while (tiles.length > wanted) {
      const tile = tiles.pop();
      if (tile.game) queue?.push(tile.game);
      tile.remove();
    }
    while (tiles.length < wanted) {
      const tile = createTile();
      tiles.push(tile);
      page.append(tile);
    }
    if (queue) [bigTile, ...tiles].forEach(show);
  }

  function gameLink(game) {
    if (game.url) return game.url;
    const folder = game.image.split("/").filter(Boolean).at(-2);
    return `/misc/play/?title=${encodeURIComponent(
      game.name,
    )}&author=${encodeURIComponent(game.author)}&link=${encodeURIComponent(
      folder,
    )}`;
  }

  function show(tile) {
    if (tile.game || !queue.length) return;
    const game = queue.shift();
    tile.game = game;
    tile.href = gameLink(game);
    tile.setAttribute("aria-label", `Play ${game.name}`);

    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.src = game.image;
    const label = document.createElement("span");
    label.textContent = game.name;
    tile.replaceChildren(image, label);

    tile.addEventListener("click", () => {
      recordGamePlayed(game);
      if (game.alert) window.alert(game.alert);
    });
  }

  // Same list and ids as the games page, so a game opened from a tile shows up
  // under Recently Played there.
  function recordGamePlayed(game) {
    const id = `${game.name}|${game.url || game.image || game.author || ""}`;
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const recent = Array.isArray(stored) ? stored : [];
      localStorage.setItem(
        RECENT_KEY,
        JSON.stringify(
          [id, ...recent.filter((item) => item !== id)].slice(0, RECENT_LIMIT),
        ),
      );
    } catch {}
  }

  async function readCatalogue(response) {
    const text = (await response.text()).trim();
    if (text[0] === "[" || text[0] === "{") return JSON.parse(text);
    const raw = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = new Uint8Array(raw.length - 16);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = raw.charCodeAt(i + 16) ^ raw.charCodeAt(i % 16);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  // Only games that open on a game page: no proxied games or outside links,
  // and not the game being played.
  function playable(game) {
    if (!game?.name || !game.image || game.usesProxy) return false;
    if (!game.url) {
      return (
        Boolean(game.author) &&
        new URLSearchParams(location.search).get("title") !== game.name
      );
    }
    return (
      game.url.startsWith("/misc/play/") &&
      game.url.toLowerCase() !== location.pathname.toLowerCase()
    );
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  fill();
  // A window resize can cross a column step, which changes the free cells.
  window.addEventListener("resize", fill);

  fetch("/assets/json/load/g.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Catalogue: ${response.status}`);
      return readCatalogue(response);
    })
    .then((games) => {
      queue = shuffle(games.filter(playable));
      fill();
    })
    .catch((error) => console.error("Could not load more games", error));
})();

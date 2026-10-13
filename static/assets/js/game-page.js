// Lays out a game page (/misc/play/): the game, up to four ad boxes and tiles of
// random games on a grid of square cells that spans the window. The cell size
// and the number of columns and rows come from the window's width and height,
// and the last row holds the banner ad. The page ships only the game frame
// inside #gamepage; the look is in gameframe.css. Runs at the end of <body>,
// so the ad slots exist before script.js loads the ads embed for them.
(() => {
  const page = document.getElementById("gamepage");
  const frame = document.getElementById("gameframe");
  if (!page || !frame) return;

  const RECENT_KEY = "55gms.recentGames.v1";
  const RECENT_LIMIT = 24;
  const PHONE_WIDTH = 700;
  const STACKED_WIDTH = 1150; // narrower than this, the game takes every column
  const GAME_RATIO = 1.8; // columns of the game for each of its rows
  const GAME_TALL_RATIO = 1.6; // the same, when the window has the height
  const ROWS_UNDER_GAME = 4; // at most: the game stays the main thing
  const SHORT_ROWS = 4; // a window that fits no more gives them all to the game
  const AD_FULL_WIDTH = 1700; // the window width at which an ad is its own size
  const AD_MIN_SCALE = 0.6;
  const AD_MAX_SCALE = 1.15;

  const showAds = typeof adChoices !== "function" || adChoices().banners;
  // A square ad fills its cells with a frame the size of a big tile, and the
  // ad sits in the middle of it.
  const ads = {
    left: { width: 160, height: 600 },
    box: { width: 300, height: 250, square: true },
    box2: { width: 300, height: 250, square: true },
    wide: { width: 728, height: 90 },
  };
  // The embed scans the page once, so an ad that has no place in the first
  // layout is never asked for.
  let adsOpen = true;

  const bigTiles = [createTile(true), createTile(true)];
  const tiles = [];
  let queue = null; // games not yet on a tile, once the catalogue is in

  function createTile(big) {
    const tile = document.createElement("a");
    tile.className = "game-tile game-link";
    if (big) {
      tile.hidden = true;
      page.append(tile);
    }
    return tile;
  }

  function createAd(ad) {
    ad.box = document.createElement("div");
    ad.box.className = ad.square ? "ad-box ad-box--square" : "ad-box";
    ad.fit = document.createElement("div");
    ad.fit.className = "ad-fit";
    const slot = document.createElement("div");
    slot.setAttribute("data-55gms-ad", "");
    slot.setAttribute("data-size", `${ad.width}x${ad.height}`);
    ad.fit.append(slot);
    ad.box.append(ad.fit);
    page.append(ad.box);
    // The embed hides a slot it has no ad for. Its box goes too, and tiles
    // take the cells.
    new MutationObserver(() => {
      const current = ad.fit.querySelector("[data-55gms-ad]");
      if (ad.dead || !current || current.style.display !== "none") return;
      ad.dead = true;
      layout();
    }).observe(ad.fit, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  function setArea(element, area) {
    element.style.gridArea = `${area.row} / ${area.col} / span ${area.rows} / span ${area.cols}`;
  }

  // Tracks which cells are taken while a layout is worked out.
  function createBoard(cols, rows) {
    const used = new Set();
    return {
      // The area, or null when it leaves the grid or overlaps something.
      take(col, row, width, height, lastRow = rows) {
        if (col < 1 || row < 1) return null;
        if (col + width - 1 > cols || row + height - 1 > lastRow) return null;
        const cells = [];
        for (let r = row; r < row + height; r++) {
          for (let c = col; c < col + width; c++) {
            if (used.has(`${r},${c}`)) return null;
            cells.push(`${r},${c}`);
          }
        }
        cells.forEach((cell) => used.add(cell));
        return { col, row, cols: width, rows: height };
      },
      free: () => cols * rows - used.size,
    };
  }

  // The cell size that fills the width exactly. A stacked page scrolls, so
  // only the width counts; otherwise, of the sizes in range, the one whose
  // rows leave the least of the window's height unused.
  function pickCells(inner, height, gap, stacked) {
    const cellFor = (cols) =>
      Math.floor(((inner - gap * (cols - 1)) / cols) * 100) / 100;
    if (stacked) {
      const cols = Math.max(3, Math.round((inner + gap) / (86 + gap)));
      return { cols, cell: cellFor(cols), rows: 0 };
    }
    let best = null;
    for (let cols = Math.floor((inner + gap) / (84 + gap)); cols >= 6; cols--) {
      const cell = cellFor(cols);
      if (best && cell > 122) break;
      const rows = Math.max(0, Math.floor((height + gap) / (cell + gap)));
      const spare = Math.abs(height - (rows * (cell + gap) - gap));
      if (!best || spare < best.spare) best = { cols, cell, rows, spare };
    }
    return best || { cols: 6, cell: cellFor(6), rows: 0 };
  }

  function wanted(ad) {
    return showAds && !ad.dead && Boolean(ad.box || adsOpen);
  }

  function arrange(width) {
    const phone = width < PHONE_WIDTH;
    const stacked = width < STACKED_WIDTH;
    const gap = phone ? 10 : 14;
    const pad = phone ? 12 : 20;
    page.style.setProperty("--pad", `${pad}px`);
    const top = page.getBoundingClientRect().top + window.scrollY + pad;
    const height = window.innerHeight - top - pad;
    const {
      cols,
      cell,
      rows: fitRows,
    } = pickCells(width - pad * 2, height, gap, stacked);

    // Ads shrink with the window, so on a small screen they leave the room to
    // the game. The tiles keep their size. A stacked page fits its ads to the
    // cells it gives them.
    const adScale = stacked
      ? AD_MAX_SCALE
      : Math.min(AD_MAX_SCALE, Math.max(AD_MIN_SCALE, width / AD_FULL_WIDTH));
    const span = (count) => count * cell + (count - 1) * gap;
    const cellsFor = (size) => (size + gap) / (cell + gap);

    const placed = { left: null, box: null, box2: null, wide: null };
    const big = [null, null];
    let game;
    let rows;
    let board;

    if (stacked) {
      // The game, the box ads with columns of tiles between them (one box on
      // a narrow screen), two rows of tiles, then the banner.
      const gameRows = Math.max(3, Math.round(cols * 0.5));
      const boxRows = wanted(ads.box) ? 3 : 0;
      rows = gameRows + boxRows + 2 + (wanted(ads.wide) ? 1 : 0);
      board = createBoard(cols, rows);
      game = board.take(1, 1, cols, gameRows);
      if (boxRows) placed.box = board.take(1, gameRows + 1, 3, 3);
      if (boxRows && cols >= 8 && wanted(ads.box2)) {
        placed.box2 = board.take(cols - 2, gameRows + 1, 3, 3);
      }
      big[0] = board.take(1, gameRows + boxRows + 1, 2, 2);
      if (wanted(ads.wide)) {
        const wide = Math.min(8, cols);
        const start = 1 + Math.floor((cols - wide) / 2);
        placed.wide = board.take(start, rows, wide, 1);
      }
    } else {
      // The game in the middle with as many columns to its left as to its
      // right (the right gets the odd one). A wide window has a skyscraper on
      // the left; the box ads, each the size of a big tile, go at the top of
      // the right and of the left (under the skyscraper, when it fits), with
      // the big tiles under them.
      // The game gets about two thirds of the columns, and all but six in a
      // wide window; a short window narrows it to keep its shape. The banner
      // has the window's last row, unless the window is so short that the
      // game needs it: then the banner is the first thing below the fold.
      const middle = Math.max(cols - 6, Math.round(cols * 0.66));
      const gameRows = Math.min(
        Math.max(3, Math.round(middle / GAME_TALL_RATIO)),
        Math.max(3, fitRows > SHORT_ROWS ? fitRows - 1 : fitRows),
      );
      let gameCols = Math.min(
        middle,
        Math.max(4, Math.round(gameRows * GAME_RATIO)),
      );
      if ((cols - gameCols) % 2 && gameCols < middle) gameCols++;
      const leftCols = Math.floor((cols - gameCols) / 2);
      const left = wanted(ads.left) && cols >= 16 && leftCols >= 2;
      // The box ad goes beside the game, or under it when the side is too
      // narrow.
      const rightCols = cols - gameCols - leftCols;
      const boxSize = 2;
      const boxBeside = rightCols >= boxSize;
      const boxBelow = wanted(ads.box) && !boxBeside;
      rows = Math.min(
        Math.max(fitRows, gameRows + (boxBelow ? boxSize + 1 : 1)),
        gameRows + ROWS_UNDER_GAME,
      );
      board = createBoard(cols, rows);
      const gameCol = leftCols + 1;
      const side = gameCol + gameCols;
      game = board.take(gameCol, 1, gameCols, gameRows);
      if (left) {
        placed.left = board.take(1, 1, 2, Math.min(rows - 1, 6));
      }
      if (wanted(ads.box2) && leftCols >= boxSize) {
        // Above the banner's row, as the big tiles are.
        placed.box2 = board.take(
          1,
          placed.left ? placed.left.rows + 1 : 1,
          boxSize,
          boxSize,
          rows - 1,
        );
      }
      if (wanted(ads.box)) {
        placed.box = board.take(
          cols - boxSize + 1,
          boxBeside ? 1 : gameRows + 1,
          boxSize,
          boxSize,
        );
      }
      if (wanted(ads.wide)) {
        const wide = Math.min(
          cols,
          Math.ceil(cellsFor(ads.wide.width * adScale)),
        );
        const start = gameCol + Math.floor((gameCols - wide) / 2);
        placed.wide = board.take(
          Math.min(Math.max(1, start), cols - wide + 1),
          rows,
          wide,
          1,
        );
      }
      // Big tiles keep clear of the last row, which is the banner's.
      const spots = [
        [cols - boxSize + 1, boxSize + 1],
        [side, 1],
        [1, 1],
        [1, boxSize + 1],
        [cols - 1, 1],
        [1, gameRows + 1],
      ];
      for (const [col, row] of spots) {
        const slot = big.indexOf(null);
        if (slot === -1) break;
        big[slot] = board.take(col, row, 2, 2, rows - 1);
      }
    }

    page.style.setProperty("--cols", cols);
    page.style.setProperty("--cell", `${cell}px`);
    page.style.setProperty("--gap", `${gap}px`);
    page.classList.add("is-laid-out");

    setArea(frame, game);
    // 1vw, as the bar and the border were drawn before the grid.
    const unit = Math.max(width / 100, phone ? 8 : 10);
    frame.style.setProperty("--u", `${unit}px`);

    for (const [name, ad] of Object.entries(ads)) {
      const area = placed[name];
      if (!area) {
        if (ad.box) ad.box.hidden = true;
        continue;
      }
      if (!ad.box) createAd(ad);
      ad.box.hidden = false;
      setArea(ad.box, area);
      // A square ad fills its frame's width; the others keep to the window's
      // scale.
      const scale = Math.min(
        span(area.cols) / ad.width,
        span(area.rows) / ad.height,
        ad.square ? Infinity : adScale,
      );
      ad.fit.style.width = `${Math.floor(ad.width * scale)}px`;
      ad.fit.style.height = `${Math.floor(ad.height * scale)}px`;
    }
    adsOpen = false;

    bigTiles.forEach((tile, index) => {
      tile.hidden = !big[index];
      if (big[index]) setArea(tile, big[index]);
    });

    fill(board.free());
  }

  function layout() {
    // Laying out can add or drop the page's scrollbar, which changes the
    // width, so a second pass settles it.
    for (let pass = 0; pass < 2; pass++) {
      const width = document.documentElement.clientWidth;
      arrange(width);
      if (document.documentElement.clientWidth === width) break;
    }
  }

  function fill(count) {
    while (tiles.length > count) {
      const tile = tiles.pop();
      if (tile.game) queue?.push(tile.game);
      tile.remove();
    }
    while (tiles.length < count) {
      const tile = createTile(false);
      tiles.push(tile);
      page.append(tile);
    }
    if (!queue) return;
    bigTiles.forEach((tile) => {
      if (!tile.hidden) show(tile, true);
    });
    tiles.forEach((tile) => show(tile, false));
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

  function show(tile, big) {
    if (tile.game || !queue.length) return;
    // A big tile has room for a clip, so it takes a game that has one.
    const index = big
      ? Math.max(
          0,
          queue.findIndex((g) => g.preview),
        )
      : 0;
    const [game] = queue.splice(index, 1);
    tile.game = game;
    tile.href = gameLink(game);
    tile.setAttribute("aria-label", `Play ${game.name}`);
    // hover-preview.js plays this clip while the pointer rests on the tile.
    if (game.preview) tile.dataset.preview = game.preview;

    const image = document.createElement("img");
    image.alt = "";
    image.decoding = "async";
    image.src = game.image;
    const label = document.createElement("span");
    label.className = "game-tile-name";
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
    const here = location.pathname.toLowerCase().replace(/\.html$/, "");
    return (
      game.url.startsWith("/misc/play/") &&
      game.url.toLowerCase().replace(/\.html$/, "") !== here
    );
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  layout();
  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  });

  fetch("/assets/json/load/g.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Catalogue: ${response.status}`);
      return readCatalogue(response);
    })
    .then((games) => {
      queue = shuffle(games.filter(playable));
      layout();
    })
    .catch((error) => console.error("Could not load more games", error));
})();

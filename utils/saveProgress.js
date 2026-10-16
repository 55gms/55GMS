// Progress adapters: how far a save of one game has got, read from the save
// itself, so two conflicting saves of the same game can be compared. Only
// games whose save format has been read and understood have one; every other
// game has no progress at all, and its conflicts go to the most recent save.
// A value is never guessed: an adapter that cannot read a save returns null.
//
// An adapter returns { metrics, summary }. metrics are finite numbers that
// only grow as the player gets further. `order` says how two sets compare:
//   lexicographic  the first metric that differs decides (a later run beats
//                  an earlier one whatever it holds)
//   dominance      one save wins only when it is at least as far on every
//                  metric and further on one; mixed results do not compare
// See docs/cloud-saves.md.

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function compact(number) {
  if (number < 1000) return String(Math.floor(number));
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
  let index = -1;
  let value = number;
  while (value >= 1000 && index < units.length - 1) {
    value /= 1000;
    index += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)}${units[index]}`;
}

function plural(count, word) {
  return `${count.toLocaleString("en-US")} ${word}${count === 1 ? "" : "s"}`;
}

// A localStorage value parsed as JSON, or null.
function lsJson(save, key) {
  const raw = save.ls?.[key];
  if (typeof raw !== "string" || !raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// GameMaker HTML5 ini files, as ini_close writes them to localStorage:
// "[section]\r\nkey=\"value\"\r\n", the value quoted with " or '.
function parseIni(text) {
  const sections = {};
  let current = null;
  for (const line of String(text).split(/\r?\n/)) {
    const header = /^\[(.+)\]$/.exec(line.trim());
    if (header) {
      current = sections[header[1]] = {};
      continue;
    }
    const pair = /^([^=]+)=(.*)$/.exec(line);
    if (!pair || !current) continue;
    let value = pair[2];
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    current[pair[1].trim()] = value;
  }
  return sections;
}

// Cookie Clicker (Orteil, v2.0x). The save is localStorage "CookieClickerGame":
// escape(base64(utf8(text)) + "!END!"), where text is "|"-separated
// sections (Game.WriteSave): [2] run details, [3] bakery name; [4] misc,
// ";"-separated: [0] cookies in bank, [1] baked this ascension, [8] baked in
// earlier ascensions, [14] ascensions, [25] prestige level, [43] sugar lumps
// ever made; [5] buildings, "amount,bought,…" each; [7] achievements, one
// "0"/"1" per achievement. Both compared totals only grow.
function cookieClicker(save) {
  const raw = save.ls?.CookieClickerGame ?? save.ls?.CookieClickerGameBeta;
  if (typeof raw !== "string" || !raw) return null;
  try {
    const encoded = unescape(raw).split("!END!")[0];
    const text = Buffer.from(encoded, "base64").toString("utf8");
    const sections = text.split("|");
    if (sections.length < 5) return null;
    const misc = sections[4].split(";");
    const earned = finite(parseFloat(misc[1]));
    const reset = finite(parseFloat(misc[8] || "0"));
    const ascensions = finite(parseInt(misc[14] || "0", 10));
    if (earned === null || reset === null || ascensions === null) return null;
    const lifetime = earned + reset;
    const bank = finite(parseFloat(misc[0]));
    const prestige = finite(parseFloat(misc[25]));
    let buildings = 0;
    for (const building of (sections[5] || "").split(";")) {
      buildings += finite(parseInt(building.split(",")[0], 10)) || 0;
    }
    const achievements = (sections[7] || "").replace(/[^1]/g, "").length;
    const bakery = (sections[2] || "").split(";")[3]?.trim();
    const parts = [`${compact(lifetime)} cookies baked`];
    if (bank !== null) parts.push(`${compact(bank)} in the bank`);
    if (buildings) parts.push(plural(buildings, "building"));
    if (achievements) parts.push(plural(achievements, "achievement"));
    if (ascensions) parts.push(plural(ascensions, "ascension"));
    if (prestige) parts.push(`prestige ${compact(prestige)}`);
    return {
      metrics: { ascensions, lifetimeCookies: lifetime },
      summary: (bakery ? `${bakery}'s bakery: ` : "") + parts.join(", "),
    };
  } catch {
    return null;
  }
}

// Universal Paperclips (Frank Lantz). localStorage "saveGame" is the running
// game as JSON: clips (made this run), funds, humanFlag (1 in the first
// stage), spaceFlag (1 in the last), probeCount, foundMatter and
// totalMatter (the universe explored, as the game shows it). "savePrestige"
// counts finished games (prestigeU universes, prestigeS simulations).
function universalPaperclips(save) {
  const game = lsJson(save, "saveGame");
  if (!game) return null;
  const clips = finite(game.clips);
  if (clips === null) return null;
  const done = lsJson(save, "savePrestige");
  const prestige =
    (finite(done?.prestigeU) || 0) + (finite(done?.prestigeS) || 0);
  const stage =
    Number(game.spaceFlag) === 1 ? 3 : Number(game.humanFlag) === 1 ? 1 : 2;
  const parts = [
    `${["Business", "Earth", "Universe"][stage - 1]} stage`,
    `${compact(clips)} clips`,
  ];
  const funds = finite(game.funds);
  if (stage === 1 && funds !== null) parts.push(`$${compact(funds)}`);
  const probes = finite(game.probeCount);
  if (stage === 3 && probes) parts.push(plural(Math.floor(probes), "probe"));
  const found = finite(game.foundMatter);
  const total = finite(game.totalMatter);
  if (stage === 3 && found && total) {
    const explored = (found / total) * 100;
    parts.push(
      `${explored < 0.01 ? explored.toExponential(1) : explored.toFixed(2)}% explored`,
    );
  }
  if (prestige) parts.push(plural(prestige, "reset"));
  return {
    metrics: { prestige, stage, clips },
    summary: parts.join(", "),
  };
}

// The rest only describe a save: their numbers can go back (a new career, a
// reset), so they never decide a conflict.

// Retro Bowl and Retro Bowl College (New Star Games, GameMaker). Five career
// slots, each an ini file "<prefix>savedata[2-5].ini" whose [savegame]
// section holds year, week and first_week_playoffs; College adds
// rec_bowl_wins and rec_champ_wins. The furthest slot is described.
function retroBowl(prefix) {
  return (save) => {
    const careers = [];
    for (const file of ["", "2", "3", "4", "5"]) {
      const raw = save.ls?.[`${prefix}savedata${file}.ini`];
      if (typeof raw !== "string") continue;
      const game = parseIni(raw).savegame;
      const year = finite(parseFloat(game?.year));
      if (!year) continue;
      careers.push({
        year,
        week: finite(parseFloat(game.week)) || 0,
        playoffs: finite(parseFloat(game.first_week_playoffs)),
        bowls: finite(parseFloat(game.rec_bowl_wins)) || 0,
        titles: finite(parseFloat(game.rec_champ_wins)) || 0,
      });
    }
    if (!careers.length) return null;
    careers.sort((a, b) => b.year - a.year || b.week - a.week);
    const best = careers[0];
    const parts = [
      `${Math.floor(best.year)} season, ${
        best.playoffs && best.week >= best.playoffs
          ? "playoffs"
          : `week ${Math.floor(best.week)}`
      }`,
    ];
    if (best.titles) parts.push(plural(best.titles, "national title"));
    if (best.bowls) parts.push(plural(best.bowls, "bowl win"));
    if (careers.length > 1) parts.push(plural(careers.length, "career"));
    return { metrics: {}, summary: parts.join(", ") };
  };
}

// Little Alchemy (Recloak). localStorage "progress" is
// { parents: [[a, b], …], date: [...] }, one entry per element made.
function littleAlchemy(save) {
  const progress = lsJson(save, "progress");
  if (!Array.isArray(progress?.parents)) return null;
  return {
    metrics: {},
    summary: `${plural(progress.parents.length, "element")} discovered`,
  };
}

// Doge Miner (Doge Miner team). localStorage "dogeminer2015" is the game
// state: level (1 Earth, 2 Moon, 3 Mars), clicks, and per level
// level<n>.alltimecoins and .coins.
function dogeMiner(save) {
  const game = lsJson(save, "dogeminer2015");
  const level = finite(game?.level);
  if (!level) return null;
  let mined = 0;
  for (const n of [1, 2, 3])
    mined += finite(game[`level${n}`]?.alltimecoins) || 0;
  const place = ["Earth", "the Moon", "Mars"][level - 1] || `level ${level}`;
  const parts = [`On ${place}`, `${compact(mined)} Dogecoins mined`];
  const clicks = finite(game.clicks);
  if (clicks) parts.push(plural(Math.floor(clicks), "click"));
  return { metrics: {}, summary: parts.join(", ") };
}

// Spacebar Clicker. localStorage "spacebar_clicker_game" is
// { v: points, items: [{ cost, lvl, value }] }.
function spacebarClicker(save) {
  const game = lsJson(save, "spacebar_clicker_game");
  const points = finite(game?.v);
  if (points === null) return null;
  let upgrades = 0;
  for (const item of Array.isArray(game.items) ? game.items : []) {
    upgrades += finite(item?.lvl) || 0;
  }
  return {
    metrics: {},
    summary:
      `${compact(points)} points` +
      (upgrades ? `, ${plural(upgrades, "upgrade")}` : ""),
  };
}

// CS:GO Clicker. localStorage "savegame" is { money, inventory: { id: item } }.
function csgoClicker(save) {
  const game = lsJson(save, "savegame");
  const money = finite(game?.money);
  if (money === null) return null;
  const items =
    game.inventory && typeof game.inventory === "object"
      ? Object.keys(game.inventory).length
      : 0;
  return {
    metrics: {},
    summary:
      `$${money < 1000 ? money.toFixed(2) : compact(money)}` +
      (items ? `, ${plural(items, "skin")}` : ""),
  };
}

// Wordle+ (the open-source clone). localStorage "stats-<mode>", mode 0
// Daily, 1 Hourly, 2 Infinite: { played, guesses: { 1…6, fail }, streak,
// maxStreak }.
function wordle(save) {
  const parts = [];
  ["Daily", "Hourly", "Infinite"].forEach((name, mode) => {
    const stats = lsJson(save, `stats-${mode}`);
    const played = finite(stats?.played);
    if (!played) return;
    const lost = finite(stats.guesses?.fail) || 0;
    let part = `${name}: ${played} played, ${Math.round(((played - lost) / played) * 100)}% won`;
    const streak = finite(stats.maxStreak);
    if (streak) part += `, best streak ${streak}`;
    parts.push(part);
  });
  if (!parts.length) return null;
  return { metrics: {}, summary: parts.join("; ") };
}

// Hextris. localStorage "highscores" is the top three scores, highest first.
function hextris(save) {
  const scores = lsJson(save, "highscores");
  if (!Array.isArray(scores)) return null;
  const best = Math.max(0, ...scores.map((score) => finite(score) || 0));
  if (!best) return null;
  return { metrics: {}, summary: `Best score ${best.toLocaleString("en-US")}` };
}

// A game built on the 55GMS save SDK (window.gmsSaves in save-agent.js)
// stores { data, progress } under "native-save/<gameId>" and reports its own
// progress. Only the metrics its registry entry names are read.
function nativeProgress(save, game) {
  const names = game?.progress?.metrics;
  if (!Array.isArray(names) || !names.length) return null;
  const raw = save.ls?.[`native-save/${game.id}`];
  if (typeof raw !== "string") return null;
  try {
    const reported = JSON.parse(raw)?.progress || {};
    const metrics = {};
    for (const name of names) {
      const value = finite(reported[name]);
      if (value === null) return null;
      metrics[name] = value;
    }
    return {
      metrics,
      summary: names
        .map((name) => `${name} ${compact(metrics[name])}`)
        .join(", "),
    };
  } catch {
    return null;
  }
}

const ADAPTERS = {
  "cookie-clicker": {
    read: cookieClicker,
    order: "dominance",
    metrics: ["ascensions", "lifetimeCookies"],
  },
  "universal-paperclips": {
    read: universalPaperclips,
    order: "lexicographic",
    metrics: ["prestige", "stage", "clips"],
  },
  "retro-bowl": { read: retroBowl("RetroBowl.0."), order: null, metrics: [] },
  "retro-bowl-college": {
    read: retroBowl("RetroBowlCollege.0."),
    order: null,
    metrics: [],
  },
  "little-alchemy": { read: littleAlchemy, order: null, metrics: [] },
  "doge-miner": { read: dogeMiner, order: null, metrics: [] },
  "spacebar-clicker": { read: spacebarClicker, order: null, metrics: [] },
  "csgo-clicker": { read: csgoClicker, order: null, metrics: [] },
  wordle: { read: wordle, order: null, metrics: [] },
  hextris: { read: hextris, order: null, metrics: [] },
  native: { read: nativeProgress, order: null, metrics: null },
};

export function progressAdapterIds() {
  return Object.keys(ADAPTERS);
}

// Whether an adapter's numbers settle conflicts, or only describe a save.
// The native adapter takes its metrics from the game's registry entry.
export function adapterCompares(id) {
  const adapter = ADAPTERS[id];
  return Boolean(adapter) && adapter.metrics?.length !== 0;
}

// A renamed game (scripts/build-save-registry.js) stores its keys as
// "<game id>:<key>"; adapters read them by the names the game gives them.
function withOwnNames(game, save) {
  if (!save.ls || typeof save.ls !== "object") return save;
  const prefix = `${game.id}:`;
  const ls = { ...save.ls };
  for (const [key, value] of Object.entries(save.ls))
    if (key.startsWith(prefix)) ls[key.slice(prefix.length)] = value;
  return { ...save, ls };
}

// { metrics, summary, adapter, order } for a parsed save, or null when the
// game has no adapter or the adapter cannot read this save.
export function readProgress(game, save) {
  const id = game?.progress?.adapter;
  const adapter = id && ADAPTERS[id];
  if (!adapter || !save || typeof save !== "object") return null;
  const result = adapter.read(
    game.renamed ? withOwnNames(game, save) : save,
    game,
  );
  if (!result) return null;
  return {
    adapter: id,
    order: adapter.order || game.progress.order || "dominance",
    metrics: result.metrics,
    names: adapter.metrics || game.progress.metrics,
    summary: String(result.summary || "").slice(0, 120),
  };
}

// 1 when a is further than b, -1 when b is, 0 when they are level, null when
// they cannot be compared (either is missing, they come from different
// adapters, or under dominance each is ahead on something).
export function compareProgress(a, b) {
  if (!a || !b || a.adapter !== b.adapter || a.order !== b.order) return null;
  const names = a.names;
  if (!Array.isArray(names) || !names.length) return null;

  if (a.order === "lexicographic") {
    for (const name of names) {
      const left = a.metrics[name];
      const right = b.metrics[name];
      if (typeof left !== "number" || typeof right !== "number") return null;
      if (left !== right) return left > right ? 1 : -1;
    }
    return 0;
  }

  let ahead = false;
  let behind = false;
  for (const name of names) {
    const left = a.metrics[name];
    const right = b.metrics[name];
    if (typeof left !== "number" || typeof right !== "number") return null;
    if (left > right) ahead = true;
    if (left < right) behind = true;
  }
  if (ahead && behind) return null;
  return ahead ? 1 : behind ? -1 : 0;
}

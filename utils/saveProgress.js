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

// Cookie Clicker (Orteil, v2.0x). The save is localStorage "CookieClickerGame":
// escape(base64(utf8(text)) + "!END!"), where text is "|"-separated sections
// and section 4 is ";"-separated: [1] cookies baked this ascension, [8]
// cookies baked in earlier ascensions, [14] ascensions. Both totals only grow.
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
    return {
      metrics: { ascensions, lifetimeCookies: lifetime },
      summary:
        `${compact(lifetime)} cookies baked` +
        (ascensions
          ? `, ${ascensions} ascension${ascensions === 1 ? "" : "s"}`
          : ""),
    };
  } catch {
    return null;
  }
}

// Universal Paperclips (Frank Lantz). localStorage "saveGame" is the running
// game as JSON: clips (made this run), humanFlag (1 in the first stage),
// spaceFlag (1 in the last). "savePrestige" counts finished games
// (prestigeU universes, prestigeS simulations).
function universalPaperclips(save) {
  const raw = save.ls?.saveGame;
  if (typeof raw !== "string" || !raw) return null;
  try {
    const game = JSON.parse(raw);
    const clips = finite(game?.clips);
    if (clips === null) return null;
    let prestige = 0;
    if (typeof save.ls.savePrestige === "string") {
      const done = JSON.parse(save.ls.savePrestige);
      prestige =
        (finite(done?.prestigeU) || 0) + (finite(done?.prestigeS) || 0);
    }
    const stage =
      Number(game.spaceFlag) === 1 ? 3 : Number(game.humanFlag) === 1 ? 1 : 2;
    return {
      metrics: { prestige, stage, clips },
      summary:
        `Stage ${stage}, ${compact(clips)} clips` +
        (prestige ? `, ${prestige} reset${prestige === 1 ? "" : "s"}` : ""),
    };
  } catch {
    return null;
  }
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
  native: { read: nativeProgress, order: null, metrics: null },
};

export function progressAdapterIds() {
  return Object.keys(ADAPTERS);
}

// { metrics, summary, adapter, order } for a parsed save, or null when the
// game has no adapter or the adapter cannot read this save.
export function readProgress(game, save) {
  const id = game?.progress?.adapter;
  const adapter = id && ADAPTERS[id];
  if (!adapter || !save || typeof save !== "object") return null;
  const result = adapter.read(save, game);
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

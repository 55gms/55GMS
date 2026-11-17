import { QueryTypes } from "sequelize";
import { sequelize } from "../models/index.js";
import {
  SEASON,
  battlePassRules,
  battlePassTiers,
  coinPack,
  isRvSkin,
  isSkin,
  rvSkinPrice,
  skinPrice,
} from "./onev1Config.js";

// 1v1.lol accounts on 55GMS (docs/1v1-backend.md): profiles, cosmetics,
// the battle pass, leaderboards and match results. Mounted by
// routes/onev1.js, which authenticates every call with the game token.
// Nothing the game sends can raise rating, XP, stats or coins: those come
// from the multiplayer server's decided results (applyMatch) and from the
// coin ledger.

export class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const DEFAULT_RATING = 1000;
const ELO_K = 32;
const COMPETITIVE_1V1 = "1v1_Competitive";
const COMPETITIVE_2V2 = "Teams_2v2_Competitive";
// Rated matches between the same two accounts in 24 hours: each one after
// the first counts for less, the fourth and later for nothing.
const PAIR_FACTORS = [1, 0.5, 0.25];
const RATED_PER_HOUR = 20;
const SETTINGS_MAX_BYTES = 16 * 1024;
const SETTINGS_MAX_KEYS = 200;

async function query(sql, replacements, transaction) {
  return sequelize.query(sql, {
    replacements,
    transaction,
    type: QueryTypes.SELECT,
  });
}

async function exec(sql, replacements, transaction) {
  await sequelize.query(sql, { replacements, transaction });
}

// Creates the profile row if needed and locks it for the transaction, which
// serialises every change to one account's coins, items and pass.
async function lockProfile(uuid, transaction) {
  await exec(
    `INSERT INTO onev1_profiles (uuid) VALUES (:uuid) ON CONFLICT DO NOTHING`,
    { uuid },
    transaction,
  );
  const [row] = await query(
    `SELECT * FROM onev1_profiles WHERE uuid = :uuid FOR UPDATE`,
    { uuid },
    transaction,
  );
  return row;
}

export async function coinBalance(uuid, transaction) {
  const [row] = await query(
    `SELECT COALESCE(SUM(delta), 0)::int AS balance
       FROM onev1_coin_ledger WHERE uuid = :uuid`,
    { uuid },
    transaction,
  );
  return row.balance;
}

// Adds one ledger row. Returns false when its source was already recorded.
export async function addCoins(uuid, delta, reason, source, transaction) {
  const rows = await query(
    `INSERT INTO onev1_coin_ledger (uuid, delta, reason, source)
     VALUES (:uuid, :delta, :reason, :source)
     ON CONFLICT (source) DO NOTHING RETURNING id`,
    { uuid, delta, reason, source },
    transaction,
  );
  return rows.length > 0;
}

async function ownedItems(uuid, transaction) {
  const rows = await query(
    `SELECT item_id FROM onev1_items WHERE uuid = :uuid ORDER BY acquired_at`,
    { uuid },
    transaction,
  );
  return rows.map((row) => row.item_id);
}

async function grantItem(uuid, itemId, source, transaction) {
  const rows = await query(
    `INSERT INTO onev1_items (uuid, item_id, source) VALUES (:uuid, :itemId, :source)
     ON CONFLICT DO NOTHING RETURNING item_id`,
    { uuid, itemId, source },
    transaction,
  );
  return rows.length > 0;
}

async function accountOf(uuid, transaction) {
  const [row] = await query(
    `SELECT uuid, username, premium FROM users WHERE uuid = :uuid`,
    { uuid },
    transaction,
  );
  if (!row) throw new GameError("User not logged in", 401);
  return row;
}

async function passRow(uuid, transaction, lock = false) {
  await exec(
    `INSERT INTO onev1_battle_pass (uuid, season) VALUES (:uuid, :season)
     ON CONFLICT DO NOTHING`,
    { uuid, season: SEASON },
    transaction,
  );
  const [row] = await query(
    `SELECT * FROM onev1_battle_pass WHERE uuid = :uuid AND season = :season
     ${lock ? "FOR UPDATE" : ""}`,
    { uuid, season: SEASON },
    transaction,
  );
  return row;
}

// Index of the highest tier reached with this much pass XP.
function tierOf(xp) {
  const tiers = battlePassTiers();
  let reached = 0;
  tiers.forEach((tier, index) => {
    if (xp >= tier.xp) reached = index;
  });
  return reached;
}

function earnedRewards(xp, premium) {
  const tiers = battlePassTiers().slice(0, tierOf(xp) + 1);
  return tiers.flatMap((tier) => [
    ...tier.free_rewards,
    ...(premium ? tier.premium_rewards : []),
  ]);
}

function ratingOf(profile, mode) {
  return profile?.ratings?.[mode]?.rating ?? DEFAULT_RATING;
}

// --- player/login ----------------------------------------------------------

// The ServerUser the game builds its signed-in menus from. Settings is left
// out: the game looks up keys in it it never sent, and throws on a settings
// object without them (docs/1v1-backend.md). What it sends is still kept.
export async function loginReply(uuid) {
  return sequelize.transaction(async (transaction) => {
    const account = await accountOf(uuid, transaction);
    const profile = await lockProfile(uuid, transaction);
    const [balance, items, pass] = await Promise.all([
      coinBalance(uuid, transaction),
      ownedItems(uuid, transaction),
      passRow(uuid, transaction),
    ]);
    const stats = profile.stats || {};
    const premium = Boolean(account.premium);
    const claimed = [...pass.claimed_free, ...pass.claimed_premium];
    const reply = {
      ID: uuid,
      Nickname: account.username,
      HardCurrency: balance,
      SoftCurrency: 0,
      XP: profile.xp,
      Elo: ratingOf(profile, COMPETITIVE_1V1),
      DuosRating: ratingOf(profile, COMPETITIVE_2V2),
      Rating: DEFAULT_RATING,
      BoxRating: DEFAULT_RATING,
      CustomRating: DEFAULT_RATING,
      Deviation: 350,
      Volatility: 0.06,
      Stats: {
        TotalKills: stats.TotalKills || 0,
        TotalDeaths: stats.TotalDeaths || 0,
        Victories: { "1v1": 0, BattleRoyale: 0, ...stats.Victories },
        Defeats: { "1v1": 0, BattleRoyale: 0, ...stats.Defeats },
        TotalGamesPlayed: stats.TotalGamesPlayed || 0,
        ConsecutiveWins: stats.ConsecutiveWins || 0,
      },
      Premium: { AdsDisabled: premium, LTV: 0 },
      Skins: {
        CharacterSkins: items.filter(isSkin),
        EquippedCharacterSkins: profile.equipped?.character || [],
        WeaponSkins: [],
        EquippedWeaponSkins: [],
      },
      BattlePass: {
        Seasons: {
          [SEASON]: {
            XP: pass.xp,
            IsPremium: premium,
            ClaimedRewards: claimed,
            // Reached and not yet claimed: the game claims these itself.
            EarnedRewards: earnedRewards(pass.xp, premium).filter(
              (id) => !claimed.includes(id),
            ),
          },
        },
      },
      RVData: {
        Watched: 0,
        CurrentSkin: "",
        LastRvSkinDateTime: (profile.rv_skin_at || new Date(0)).toISOString(),
      },
    };
    return reply;
  });
}

// --- settings and cosmetics -----------------------------------------------

function parseJsonObject(text) {
  try {
    const value = JSON.parse(String(text || ""));
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : null;
  } catch {
    return null;
  }
}

export async function saveSettings(uuid, params) {
  const incoming = parseJsonObject(params.settings);
  if (!incoming) throw new GameError("Nothing to save");
  await sequelize.transaction(async (transaction) => {
    const profile = await lockProfile(uuid, transaction);
    const merged = { ...profile.settings };
    for (const [key, value] of Object.entries(incoming)) {
      if (key.length > 128) continue;
      merged[key] = String(value).slice(0, 512);
    }
    if (
      Object.keys(merged).length > SETTINGS_MAX_KEYS ||
      JSON.stringify(merged).length > SETTINGS_MAX_BYTES
    ) {
      throw new GameError("Too many settings");
    }
    await exec(
      `UPDATE onev1_profiles SET settings = :settings, updated_at = now()
        WHERE uuid = :uuid`,
      { uuid, settings: JSON.stringify(merged) },
      transaction,
    );
  });
  return {};
}

export async function equipCharacterSkin(uuid, params) {
  const skinId = String(params.skinId || "");
  await sequelize.transaction(async (transaction) => {
    await lockProfile(uuid, transaction);
    const owned = await ownedItems(uuid, transaction);
    if (skinId && !owned.includes(skinId)) {
      throw new GameError("Skin not owned");
    }
    await exec(
      `UPDATE onev1_profiles SET equipped = :equipped, updated_at = now()
        WHERE uuid = :uuid`,
      {
        uuid,
        equipped: JSON.stringify({ character: skinId ? [skinId] : [] }),
      },
      transaction,
    );
  });
  return {};
}

// Spends coins on a cosmetic under the account's row lock.
async function spendOn(uuid, itemId, price, itemSource, transaction) {
  await lockProfile(uuid, transaction);
  if ((await ownedItems(uuid, transaction)).includes(itemId)) {
    throw new GameError("Already owned");
  }
  if ((await coinBalance(uuid, transaction)) < price) {
    throw new GameError("not enough money");
  }
  await addCoins(
    uuid,
    -price,
    itemSource,
    `${itemSource}:${uuid}:${itemId}`,
    transaction,
  );
  await grantItem(uuid, itemId, itemSource, transaction);
}

// product/coinPurchase: a shop skin. The price is ours, not the request's.
export async function buySkin(uuid, params) {
  const itemId = String(params.id || "");
  const price = skinPrice(itemId);
  if (price === null) throw new GameError("Unknown item");
  await sequelize.transaction((transaction) =>
    spendOn(uuid, itemId, price, "shop", transaction),
  );
  return {};
}

// product/rvCoinPurchase: the mystery skin the game picked from rv_skins.
export async function buyRvSkin(uuid, params) {
  const itemId = String(params.id || "");
  if (!isRvSkin(itemId)) throw new GameError("Unknown item");
  await sequelize.transaction(async (transaction) => {
    await spendOn(uuid, itemId, rvSkinPrice(), "rv", transaction);
    await exec(
      `UPDATE onev1_profiles SET rv_skin_at = now() WHERE uuid = :uuid`,
      { uuid },
      transaction,
    );
  });
  return {};
}

export async function rvSkinLastTime(uuid) {
  const [row] = await query(
    `SELECT rv_skin_at FROM onev1_profiles WHERE uuid = :uuid`,
    { uuid },
  );
  return (row?.rv_skin_at || new Date(0)).toISOString();
}

// --- battle pass -----------------------------------------------------------

export async function claimReward(uuid, params) {
  const rewardId = String(params.rewardId || "");
  return sequelize.transaction(async (transaction) => {
    const account = await accountOf(uuid, transaction);
    await lockProfile(uuid, transaction);
    const pass = await passRow(uuid, transaction, true);
    const reached = battlePassTiers().slice(0, tierOf(pass.xp) + 1);
    let track = null;
    if (reached.some((tier) => tier.free_rewards.includes(rewardId))) {
      track = "free";
    } else if (
      reached.some((tier) => tier.premium_rewards.includes(rewardId))
    ) {
      if (!account.premium) throw new GameError("Premium only", 403);
      track = "premium";
    }
    if (!track) throw new GameError("Reward not reached");
    const claimed = pass[`claimed_${track}`];
    if (claimed.includes(rewardId)) throw new GameError("Already claimed");

    const pack = coinPack(rewardId);
    if (pack) {
      await addCoins(
        uuid,
        pack.amount,
        "battle_pass",
        `bp:${uuid}:${SEASON}:${rewardId}`,
        transaction,
      );
    } else {
      await grantItem(uuid, rewardId, "bp", transaction);
    }
    await exec(
      `UPDATE onev1_battle_pass SET claimed_${track} = :claimed
        WHERE uuid = :uuid AND season = :season`,
      { uuid, season: SEASON, claimed: JSON.stringify([...claimed, rewardId]) },
      transaction,
    );
    return {};
  });
}

// Advances the pass to the next tier for tier_up_price coins.
export async function buyTierUp(uuid) {
  return sequelize.transaction(async (transaction) => {
    await lockProfile(uuid, transaction);
    const pass = await passRow(uuid, transaction, true);
    const tiers = battlePassTiers();
    const next = tierOf(pass.xp) + 1;
    if (next >= tiers.length) throw new GameError("Already at the last tier");
    const { tierUpPrice } = battlePassRules();
    if ((await coinBalance(uuid, transaction)) < tierUpPrice) {
      throw new GameError("not enough money");
    }
    const recorded = await addCoins(
      uuid,
      -tierUpPrice,
      "tier_up",
      `tierup:${uuid}:${SEASON}:${next}`,
      transaction,
    );
    if (!recorded) throw new GameError("Already bought");
    await exec(
      `UPDATE onev1_battle_pass
          SET xp = GREATEST(xp, :xp), tiers_bought = tiers_bought + 1
        WHERE uuid = :uuid AND season = :season`,
      { uuid, season: SEASON, xp: tiers[next].xp },
      transaction,
    );
    return {};
  });
}

// --- leaderboards ----------------------------------------------------------

export async function leaderboard(mode = COMPETITIVE_1V1, limit = 100) {
  const rows = await query(
    `SELECT u.username,
            (p.ratings -> :mode ->> 'rating')::int AS rating,
            (p.ratings -> :mode ->> 'games')::int AS games
       FROM onev1_profiles p JOIN users u ON u.uuid = p.uuid
      WHERE (p.ratings -> :mode ->> 'games')::int >= 5
      ORDER BY rating DESC, u.username
      LIMIT :limit`,
    { mode, limit },
  );
  return rows.map((row, index) => ({
    Rank: index + 1,
    Nickname: row.username,
    Rating: row.rating,
    Games: row.games,
  }));
}

export async function leaderboardInfo(uuid, mode = COMPETITIVE_1V1) {
  const [row] = await query(
    `WITH ranked AS (
       SELECT uuid, (ratings -> :mode ->> 'rating')::int AS rating,
              RANK() OVER (ORDER BY (ratings -> :mode ->> 'rating')::int DESC) AS rank
         FROM onev1_profiles
        WHERE (ratings -> :mode ->> 'games')::int >= 5)
     SELECT rank::int, rating FROM ranked WHERE uuid = :uuid`,
    { uuid, mode },
  );
  return { Rank: row?.rank ?? 0, Rating: row?.rating ?? DEFAULT_RATING };
}

// --- match results ---------------------------------------------------------

const UUID = /^[0-9a-f-]{36}$/i;

// The stats key the profile screen reads ("1v1" for both 1v1 modes).
function statsKey(mode) {
  return mode.startsWith("1v1") ? "1v1" : mode;
}

function expected(rating, other) {
  return 1 / (1 + 10 ** ((other - rating) / 400));
}

// Rated matches in the last 24 hours between two accounts.
async function pairMatches(a, b, transaction) {
  const [row] = await query(
    `SELECT count(*)::int AS n FROM onev1_matches
      WHERE rated AND created_at > now() - interval '24 hours'
        AND players @> CAST(:a AS jsonb) AND players @> CAST(:b AS jsonb)`,
    {
      a: JSON.stringify([{ uuid: a }]),
      b: JSON.stringify([{ uuid: b }]),
    },
    transaction,
  );
  return row.n;
}

async function ratedLastHour(uuid, transaction) {
  const [row] = await query(
    `SELECT count(*)::int AS n FROM onev1_matches
      WHERE rated AND created_at > now() - interval '1 hour'
        AND players @> CAST(:p AS jsonb)`,
    { p: JSON.stringify([{ uuid }]) },
    transaction,
  );
  return row.n;
}

function validMatch(body) {
  const { matchId, mode, teams, winner, players } = body;
  if (typeof matchId !== "string" || !matchId || matchId.length > 128)
    return false;
  if (typeof mode !== "string" || !mode || mode.length > 64) return false;
  if (!Array.isArray(teams) || teams.length !== 2) return false;
  if (
    !teams.every(
      (team) => Array.isArray(team) && team.every((u) => UUID.test(u)),
    )
  ) {
    return false;
  }
  if (!(winner === 0 || winner === 1 || winner === null)) return false;
  if (
    !Array.isArray(players) ||
    !players.every((p) => p && UUID.test(p.uuid))
  ) {
    return false;
  }
  return true;
}

// Applies one result the multiplayer server decided (routes/onev1.js,
// /internal/match). Idempotent on matchId. Body:
// { matchId, mode, rated, teams: [[uuid…], [uuid…]], winner: 0|1|null,
//   players: [{ uuid, kills, deaths, left }] }. Only accounts are listed.
export async function applyMatch(body) {
  if (!validMatch(body)) throw new GameError("Bad match");
  const { matchId, mode, winner } = body;
  const teamOf = new Map();
  body.teams.forEach((team, index) =>
    team.forEach((u) => teamOf.set(u, index)),
  );
  const players = body.players.filter((p) => teamOf.has(p.uuid));
  if (!players.length) return { applied: false, ratingChanges: {} };
  const rated = Boolean(body.rated) && winner !== null;

  return sequelize.transaction(async (transaction) => {
    const known = await query(
      `SELECT uuid FROM users WHERE uuid IN (:uuids)`,
      { uuids: players.map((p) => p.uuid) },
      transaction,
    );
    const live = new Set(known.map((row) => row.uuid));
    const listed = players.filter((p) => live.has(p.uuid));
    if (!listed.length) return { applied: false, ratingChanges: {} };

    const outcome = (p) =>
      p.left
        ? "loss"
        : winner === null
          ? "draw"
          : teamOf.get(p.uuid) === winner
            ? "win"
            : "loss";
    const stored = listed.map((p) => ({
      uuid: p.uuid,
      team: teamOf.get(p.uuid),
      outcome: outcome(p),
      kills: Math.max(0, Math.min(1000, Number(p.kills) || 0)),
      deaths: Math.max(0, Math.min(1000, Number(p.deaths) || 0)),
    }));

    // Lock every profile in a fixed order before anything else reads them.
    const profiles = new Map();
    for (const uuid of [...live].sort()) {
      profiles.set(uuid, await lockProfile(uuid, transaction));
    }

    const ratingChanges = {};
    if (rated) {
      // A team's rating is its members' mean; anyone unknown counts at the
      // default.
      const teamRating = body.teams.map((team) =>
        team.length
          ? team.reduce(
              (sum, u) =>
                sum +
                (profiles.has(u)
                  ? ratingOf(profiles.get(u), mode)
                  : DEFAULT_RATING),
              0,
            ) / team.length
          : DEFAULT_RATING,
      );
      for (const p of stored) {
        const own = p.team;
        const score = p.outcome === "win" ? 1 : 0;
        const base =
          ELO_K * (score - expected(teamRating[own], teamRating[1 - own]));
        let factor = 1;
        for (const other of body.teams[1 - own]) {
          if (!live.has(other)) continue;
          const n = await pairMatches(p.uuid, other, transaction);
          factor = Math.min(factor, PAIR_FACTORS[n] ?? 0);
        }
        if ((await ratedLastHour(p.uuid, transaction)) >= RATED_PER_HOUR)
          factor = 0;
        ratingChanges[p.uuid] = Math.round(base * factor);
      }
    }

    const inserted = await query(
      `INSERT INTO onev1_matches (match_id, mode, rated, players, rating_changes)
       VALUES (:matchId, :mode, :rated, :players, :changes)
       ON CONFLICT DO NOTHING RETURNING match_id`,
      {
        matchId,
        mode,
        rated,
        players: JSON.stringify(stored),
        changes: JSON.stringify(ratingChanges),
      },
      transaction,
    );
    if (!inserted.length) return { applied: false, ratingChanges: {} };

    const { winXp, loseXp } = battlePassRules();
    for (const p of stored) {
      const profile = profiles.get(p.uuid);
      const stats = { Victories: {}, Defeats: {}, ...profile.stats };
      const key = statsKey(mode);
      stats.TotalKills = (stats.TotalKills || 0) + p.kills;
      stats.TotalDeaths = (stats.TotalDeaths || 0) + p.deaths;
      stats.TotalGamesPlayed = (stats.TotalGamesPlayed || 0) + 1;
      if (p.outcome === "win") {
        stats.Victories = {
          ...stats.Victories,
          [key]: (stats.Victories[key] || 0) + 1,
        };
        stats.ConsecutiveWins = (stats.ConsecutiveWins || 0) + 1;
      } else {
        if (p.outcome === "loss") {
          stats.Defeats = {
            ...stats.Defeats,
            [key]: (stats.Defeats[key] || 0) + 1,
          };
        }
        stats.ConsecutiveWins = 0;
      }
      const ratings = { ...profile.ratings };
      if (p.uuid in ratingChanges) {
        const before = ratingOf(profile, mode);
        ratings[mode] = {
          rating: Math.max(0, before + ratingChanges[p.uuid]),
          games: (profile.ratings?.[mode]?.games || 0) + 1,
        };
      }
      // A player who left gets no XP; a draw counts as a loss for XP.
      const xp = body.players.find((x) => x.uuid === p.uuid)?.left
        ? 0
        : p.outcome === "win"
          ? winXp
          : loseXp;
      await exec(
        `UPDATE onev1_profiles
            SET xp = xp + :xp, stats = :stats, ratings = :ratings, updated_at = now()
          WHERE uuid = :uuid`,
        {
          uuid: p.uuid,
          xp,
          stats: JSON.stringify(stats),
          ratings: JSON.stringify(ratings),
        },
        transaction,
      );
      if (xp) {
        await passRow(p.uuid, transaction);
        await exec(
          `UPDATE onev1_battle_pass SET xp = xp + :xp WHERE uuid = :uuid AND season = :season`,
          { uuid: p.uuid, xp, season: SEASON },
          transaction,
        );
      }
    }
    return { applied: true, ratingChanges };
  });
}

// Ratings by mode for the multiplayer server's matchmaking:
// { <mode>: rating }.
export async function ratingsOf(uuid) {
  const [row] = await query(
    `SELECT ratings FROM onev1_profiles WHERE uuid = :uuid`,
    { uuid },
  );
  const out = {};
  for (const [mode, value] of Object.entries(row?.ratings || {})) {
    out[mode] = value.rating;
  }
  return out;
}

// --- routes ----------------------------------------------------------------

export function mount(router, handle) {
  router.get("/player/login", handle(loginReply));
  router.get("/player", handle(loginReply));
  router.post("/player", handle(loginReply));
  router.post("/userSettings/group", handle(saveSettings));
  router.post("/userSettings/single", handle(saveSettings));
  router.post("/player/rvSkinLastTime", handle(rvSkinLastTime));
  router.post("/player/skins/character/equip/list", handle(equipCharacterSkin));
  router.post("/player/skins/character/equip", handle(equipCharacterSkin));
  router.post("/product/coinPurchase", handle(buySkin));
  router.post("/product/rvCoinPurchase", handle(buyRvSkin));
  router.post("/battlePass/claimReward", handle(claimReward));
  router.post("/battlePass/buyTierUp", handle(buyTierUp));
  // Premium comes with 55GMS Premium: the page opens /premium on this.
  router.post("/battlePass/buyPremium", (req, res) =>
    res.status(402).json({ error: "premium", url: "/premium" }),
  );
  router.all(
    "/battlePass",
    handle(async (uuid) => (await loginReply(uuid)).BattlePass),
  );
  router.all(
    "/leaderboards",
    handle((uuid, params) => leaderboard(params.gameMode || params.mode)),
  );
  router.all(
    "/leaderboards/info",
    handle((uuid, params) =>
      leaderboardInfo(uuid, params.gameMode || params.mode),
    ),
  );
  router.all(
    "/rating",
    handle(async (uuid) => ratingsOf(uuid)),
  );
  router.all(
    "/userSettings",
    handle(async (uuid) => ({
      settings: (await loginReply(uuid)).Settings || {},
    })),
  );
}

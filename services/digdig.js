import { readFileSync } from "node:fs";
import { QueryTypes } from "sequelize";
import { sequelize } from "../models/index.js";

// digdig.io on 55GMS accounts: gold, skins and achievements (docs/multiplayer.md). The
// multiplayer server decides what an account earns and asks for purchases;
// prices are ours (utils/digdig-skins.json), never the game's.
const PRICES = JSON.parse(
  readFileSync(new URL("../utils/digdig-skins.json", import.meta.url), "utf8"),
);
delete PRICES._comment;

// The most one grant may carry: a long life collects a few thousand.
export const MAX_GRANT = 20000;

export class DigdigError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function skinPrice(itemId) {
  return Object.hasOwn(PRICES, itemId) ? PRICES[itemId] : null;
}

async function goldOf(uuid, transaction) {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(delta), 0)::bigint AS gold FROM digdig_gold_ledger WHERE uuid = :uuid`,
    { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
  );
  return Number(row?.gold) || 0;
}

async function itemsOf(uuid, transaction) {
  const rows = await sequelize.query(
    `SELECT item_id FROM digdig_items WHERE uuid = :uuid ORDER BY acquired_at, item_id`,
    { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
  );
  return rows.map((r) => r.item_id);
}

// Achievements: the client's ids and what each pays, from the client (build
// 2749f7ba, the reward it shows). The multiplayer server decides who earns
// one; master_seeker gives the spider face, which is not sold.
export const ACHIEVEMENT_REWARDS = {
  score_1: 25,
  score_2: 50,
  score_3: 200,
  one_of_many: 25,
  getting_better: 50,
  killer: 100,
  triple_kill: 25,
  genocide: 100,
  pacifist: 100,
  david: 100,
  consolation_prize: 50,
  excavator: 100,
  miner_not_digger: 100,
  how: 250,
  gold_digger: 50,
  ouch: 10,
  mechanic_abuse: 50,
  collector: 25,
  efficient_collector: 50,
  leader: 50,
  supreme_leader: 500,
  speedrun: 25,
  survivor: 25,
  willpower: 250,
  worth_it: 25,
  deflation: 100,
  hider: 50,
  seeker: 50,
  efficient_seeker: 100,
  master_seeker: { item: "spider" },
  royal: 100,
  jack: 100,
  queen: 100,
  king: 500,
  merciless: 100,
};

// Lifetime totals the multiplayer server adds to after each life; ores is a
// bit set and is ORed in. The caps bound what one life can add.
const STAT_CAPS = {
  kills: 1000,
  dirt: 5_000_000,
  gold: 100_000,
  tags: 1000,
  br_wins: 1,
};

async function achievementsOf(uuid, transaction) {
  const rows = await sequelize.query(
    `SELECT achievement_id FROM digdig_achievements WHERE uuid = :uuid ORDER BY unlocked_at, achievement_id`,
    { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
  );
  return rows.map((r) => r.achievement_id);
}

async function statsOf(uuid, transaction) {
  const [row] = await sequelize.query(
    `SELECT kills, dirt, gold, tags, br_wins, ores FROM digdig_stats WHERE uuid = :uuid`,
    { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
  );
  const stats = { ores: Number(row?.ores) || 0 };
  for (const key of Object.keys(STAT_CAPS))
    stats[key] = Number(row?.[key]) || 0;
  return stats;
}

// { uuid, handle, gold, items, achievements, stats }, or null for an account that cannot play
// (unknown, or still choosing its handle).
export async function accountOf(uuid, transaction) {
  const [user] = await sequelize.query(
    `SELECT uuid, username, handle_pending FROM users WHERE uuid = :uuid`,
    { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
  );
  if (!user || user.handle_pending) return null;
  return {
    uuid: user.uuid,
    handle: user.username,
    gold: await goldOf(uuid, transaction),
    items: await itemsOf(uuid, transaction),
    achievements: await achievementsOf(uuid, transaction),
    stats: await statsOf(uuid, transaction),
  };
}

// Gold the multiplayer server says an account earned. Applied once per
// source; returns the balance after.
export async function grantGold(uuid, amount, source) {
  if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_GRANT) {
    throw new DigdigError("bad amount");
  }
  if (typeof source !== "string" || !source || source.length > 200) {
    throw new DigdigError("bad source");
  }
  await sequelize.query(
    `INSERT INTO digdig_gold_ledger (uuid, delta, reason, source)
     SELECT uuid, :amount, 'play', :source FROM users WHERE uuid = :uuid
     ON CONFLICT (source) DO NOTHING`,
    { replacements: { uuid, amount, source } },
  );
  return goldOf(uuid);
}

// Buys a skin at our price, under the account's row lock so two purchases
// cannot spend the same gold. Returns the account after.
export async function buySkin(uuid, itemId) {
  const price = skinPrice(itemId);
  if (price === null) throw new DigdigError("unknown item");
  return sequelize.transaction(async (transaction) => {
    const [user] = await sequelize.query(
      `SELECT uuid FROM users WHERE uuid = :uuid FOR UPDATE`,
      { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
    );
    if (!user) throw new DigdigError("unknown account", 404);
    if ((await itemsOf(uuid, transaction)).includes(itemId)) {
      throw new DigdigError("already owned", 409);
    }
    if ((await goldOf(uuid, transaction)) < price) {
      throw new DigdigError("not enough gold", 402);
    }
    await sequelize.query(
      `INSERT INTO digdig_gold_ledger (uuid, delta, reason, source)
       VALUES (:uuid, :delta, 'buy', :source)`,
      {
        replacements: { uuid, delta: -price, source: `buy:${uuid}:${itemId}` },
        transaction,
      },
    );
    await sequelize.query(
      `INSERT INTO digdig_items (uuid, item_id) VALUES (:uuid, :itemId)`,
      { replacements: { uuid, itemId }, transaction },
    );
    return accountOf(uuid, transaction);
  });
}

// Unlocks an achievement and pays its reward, both once. Returns the account
// after.
export async function unlockAchievement(uuid, achievementId) {
  if (!Object.hasOwn(ACHIEVEMENT_REWARDS, achievementId)) {
    throw new DigdigError("unknown achievement");
  }
  const reward = ACHIEVEMENT_REWARDS[achievementId];
  return sequelize.transaction(async (transaction) => {
    const [user] = await sequelize.query(
      `SELECT uuid FROM users WHERE uuid = :uuid FOR UPDATE`,
      { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
    );
    if (!user) throw new DigdigError("unknown account", 404);
    const inserted = await sequelize.query(
      `INSERT INTO digdig_achievements (uuid, achievement_id) VALUES (:uuid, :achievementId)
       ON CONFLICT DO NOTHING RETURNING achievement_id`,
      {
        replacements: { uuid, achievementId },
        type: QueryTypes.SELECT,
        transaction,
      },
    );
    if (inserted.length && typeof reward === "number") {
      await sequelize.query(
        `INSERT INTO digdig_gold_ledger (uuid, delta, reason, source)
         VALUES (:uuid, :reward, 'achievement', :source)
         ON CONFLICT (source) DO NOTHING`,
        {
          replacements: {
            uuid,
            reward,
            source: `achievement:${uuid}:${achievementId}`,
          },
          transaction,
        },
      );
    } else if (inserted.length && reward?.item) {
      await sequelize.query(
        `INSERT INTO digdig_items (uuid, item_id) VALUES (:uuid, :item) ON CONFLICT DO NOTHING`,
        { replacements: { uuid, item: reward.item }, transaction },
      );
    }
    return accountOf(uuid, transaction);
  });
}

// Adds one life's stats to an account's totals, once per source. Returns the
// totals after.
export async function addStats(uuid, stats, source) {
  if (typeof source !== "string" || !source || source.length > 200) {
    throw new DigdigError("bad source");
  }
  const add = {};
  for (const [key, cap] of Object.entries(STAT_CAPS)) {
    const v = stats?.[key] ?? 0;
    if (!Number.isInteger(v) || v < 0 || v > cap)
      throw new DigdigError(`bad ${key}`);
    add[key] = v;
  }
  const ores = stats?.ores ?? 0;
  if (!Number.isInteger(ores) || ores < 0 || ores > 1023)
    throw new DigdigError("bad ores");
  return sequelize.transaction(async (transaction) => {
    const [user] = await sequelize.query(
      `SELECT uuid FROM users WHERE uuid = :uuid`,
      { replacements: { uuid }, type: QueryTypes.SELECT, transaction },
    );
    if (!user) throw new DigdigError("unknown account", 404);
    const fresh = await sequelize.query(
      `INSERT INTO digdig_stat_sources (source) VALUES (:source)
       ON CONFLICT DO NOTHING RETURNING source`,
      { replacements: { source }, type: QueryTypes.SELECT, transaction },
    );
    if (fresh.length) {
      await sequelize.query(
        `INSERT INTO digdig_stats (uuid, kills, dirt, gold, tags, br_wins, ores)
         VALUES (:uuid, :kills, :dirt, :gold, :tags, :br_wins, :ores)
         ON CONFLICT (uuid) DO UPDATE SET
           kills = digdig_stats.kills + EXCLUDED.kills,
           dirt = digdig_stats.dirt + EXCLUDED.dirt,
           gold = digdig_stats.gold + EXCLUDED.gold,
           tags = digdig_stats.tags + EXCLUDED.tags,
           br_wins = digdig_stats.br_wins + EXCLUDED.br_wins,
           ores = digdig_stats.ores | EXCLUDED.ores,
           updated_at = now()`,
        { replacements: { uuid, ...add, ores }, transaction },
      );
    }
    return statsOf(uuid, transaction);
  });
}

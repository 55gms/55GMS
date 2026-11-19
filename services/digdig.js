import { readFileSync } from "node:fs";
import { QueryTypes } from "sequelize";
import { sequelize } from "../models/index.js";

// digdig.io on 55GMS accounts: gold and skins (docs/multiplayer.md). The
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

// { uuid, handle, gold, items }, or null for an account that cannot play
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

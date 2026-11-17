import { QueryTypes } from "sequelize";
import { sequelize } from "../models/index.js";
import { addCoins, GameError } from "./onev1.js";
import { coinPack } from "./onev1Config.js";

// 1v1.lol coins (docs/1v1-backend.md): coin packs sold through Stripe
// Checkout as one-off payments, refunds and disputes that take them back,
// and coins from rewarded ads confirmed by 55GMS Ads. Every change is one
// row in onev1_coin_ledger with a unique source.

// Marks this site's coin payments in Stripe, on the Checkout session and on
// its PaymentIntent (refunds and disputes are read from the latter).
export const COIN_MARKER = "55gms-1v1-coins";
// The play page's game id for 55GMS Ads (data-game-id on the game page).
const ADS_GAME_ID = "nowgg";

let stripeApi = null;
async function stripe() {
  if (!stripeApi) stripeApi = (await import("./billing.js")).stripe();
  return stripeApi;
}

function originOf(req) {
  const forwarded = req.headers["x-forwarded-proto"];
  const protocol = forwarded ? forwarded.split(",")[0].trim() : req.protocol;
  return `${protocol === "https" ? "https" : "http"}://${req.get("host")}`;
}

// --- buying ----------------------------------------------------------------

// product/xsollaToken: a Stripe Checkout session for one coin pack. The
// token the game passes to its payment widget is the session's URL; the
// page's stand-in widget opens it and asks coinStatus until it is paid.
export async function createCoinCheckout(uuid, productId, origin) {
  const pack = coinPack(productId);
  if (!pack) throw new GameError("Unknown item");
  const metadata = {
    app: COIN_MARKER,
    uuid,
    productId,
    coins: String(pack.amount),
  };
  const session = await (
    await stripe()
  ).checkout.sessions.create({
    mode: "payment",
    client_reference_id: uuid,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: pack.priceCents,
          product_data: { name: `${pack.amount} 1v1.lol coins` },
        },
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${origin}/api/1v1/coins/done`,
    cancel_url: `${origin}/api/1v1/coins/done?cancelled=1`,
  });
  return { id: session.id, url: session.url };
}

function paidCoinSession(session) {
  return (
    session?.metadata?.app === COIN_MARKER &&
    session.payment_status === "paid" &&
    Number(session.metadata.coins) > 0
  );
}

async function creditSession(session) {
  return addCoins(
    session.metadata.uuid,
    Number(session.metadata.coins),
    "purchase",
    `stripe:${session.id}`,
  );
}

// Whether a coin checkout this account started is paid. Credits it here too
// if the webhook has not arrived yet (the ledger source makes that once).
export async function coinStatus(uuid, sessionId) {
  if (!/^cs_[A-Za-z0-9_]{8,200}$/.test(sessionId)) {
    throw new GameError("Unknown purchase");
  }
  const session = await (await stripe()).checkout.sessions.retrieve(sessionId);
  if (
    session?.metadata?.app !== COIN_MARKER ||
    session.metadata.uuid !== uuid
  ) {
    throw new GameError("Unknown purchase");
  }
  if (paidCoinSession(session)) {
    await creditSession(session);
    return { done: true, coins: Number(session.metadata.coins) };
  }
  return { done: false, expired: session.status === "expired" };
}

// --- webhook ---------------------------------------------------------------

async function coinIntent(paymentIntentId) {
  if (!paymentIntentId) return null;
  const id =
    typeof paymentIntentId === "string" ? paymentIntentId : paymentIntentId.id;
  const intent = await (await stripe()).paymentIntents.retrieve(id);
  return intent?.metadata?.app === COIN_MARKER ? intent : null;
}

async function alreadyRefunded(chargeId) {
  const [row] = await sequelize.query(
    `SELECT COALESCE(-SUM(delta), 0)::int AS taken FROM onev1_coin_ledger
      WHERE source LIKE :prefix`,
    {
      replacements: { prefix: `refund:${chargeId}:%` },
      type: QueryTypes.SELECT,
    },
  );
  return row.taken;
}

// Applies a Stripe event if it is about coins. Returns true when it was,
// false when services/billing.js should handle it. Refunds and disputes are
// recognised from the PaymentIntent, not from an earlier credit, so one that
// arrives first still takes the coins back, even below zero.
export async function handleCoinEvent(event) {
  const object = event.data.object;
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    if (object.metadata?.app !== COIN_MARKER) return false;
    if (paidCoinSession(object)) await creditSession(object);
    return true;
  }
  if (event.type === "charge.refunded") {
    const intent = await coinIntent(object.payment_intent);
    if (!intent) return false;
    const coins = Number(intent.metadata.coins);
    const target = Math.round((coins * object.amount_refunded) / object.amount);
    const taken = await alreadyRefunded(object.id);
    if (target > taken) {
      await addCoins(
        intent.metadata.uuid,
        -(target - taken),
        "refund",
        `refund:${object.id}:${object.amount_refunded}`,
      );
    }
    return true;
  }
  if (event.type === "charge.dispute.created") {
    const intent = await coinIntent(object.payment_intent);
    if (!intent) return false;
    await addCoins(
      intent.metadata.uuid,
      -Number(intent.metadata.coins),
      "dispute",
      `dispute:${object.id}`,
    );
    return true;
  }
  return false;
}

// --- rewarded ads ----------------------------------------------------------

// Confirms with 55GMS Ads that this rewarded-ad grant is real and unused,
// and marks it used. Returns the reward id the ad was shown for.
export async function redeemAdGrant(grant) {
  const base = process.env.ADS_SERVER_URL;
  const key = process.env.ADS_API_KEY;
  if (!base || !key) throw new GameError("Ads are off", 503);
  const grantId = String(grant?.grantId || "");
  const signature = String(grant?.signature || "");
  if (!grantId || !signature) throw new GameError("Watch an ad first", 403);
  const response = await fetch(new URL("/api/v1/rewards/redeem", base), {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ grantId, signature }),
    signal: AbortSignal.timeout(5000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.redeemed || body.gameId !== ADS_GAME_ID) {
    throw new GameError("Ad not confirmed", 403);
  }
  return { grantId, rewardId: body.rewardId };
}

// --- routes ----------------------------------------------------------------

export function mount(router, handle, { billing = false } = {}) {
  router.get(
    "/product/xsollaToken",
    handle(async (uuid, params, req) => {
      if (!billing) throw new GameError("The store is unavailable", 503);
      const { url } = await createCoinCheckout(
        uuid,
        String(params.itemId || ""),
        originOf(req),
      );
      return { token: url };
    }),
  );
  router.get(
    "/coins/status",
    handle(async (uuid, params) => {
      if (!billing) throw new GameError("The store is unavailable", 503);
      return coinStatus(uuid, String(params.session || ""));
    }),
  );
  router.all(
    "/product/checkTransaction",
    handle(async () => ({})),
  );
  // App-store receipts: there are none on the web.
  router.post(
    "/product/validateReceipt",
    handle(async () => {
      throw new GameError("Not supported", 404);
    }),
  );
  router.post(
    "/product/validateMultipleReceipts",
    handle(async () => {
      throw new GameError("Not supported", 404);
    }),
  );
  // Rewarded-ad watches. The page sends the 55GMS Ads grant with the call;
  // without a confirmed one nothing is counted.
  router.post(
    "/player/rv",
    handle(async (uuid, params) => {
      const { grantId } = await redeemAdGrant(params);
      await sequelize.query(
        `INSERT INTO onev1_profiles (uuid) VALUES (:uuid) ON CONFLICT DO NOTHING`,
        { replacements: { uuid } },
      );
      return { watched: grantId };
    }),
  );
}

// Where Stripe sends the buyer back to: a page that says to go back to the
// game, which notices the payment itself.
export function coinsDonePage(req, res) {
  const cancelled = req.query.cancelled === "1";
  res.type("html").send(`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${cancelled ? "Payment cancelled" : "Payment received"}</title>
<body style="font-family:system-ui,sans-serif;background:#1d2733;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center">
<div><h1>${cancelled ? "Payment cancelled" : "Payment received"}</h1>
<p>${cancelled ? "No coins were bought." : "Your coins are on your account."} You can close this tab and go back to 1v1.lol.</p></div>`);
}

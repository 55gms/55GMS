import Stripe from "stripe";
import { Subscription, User } from "../models/index.js";
import userCache from "../utils/userCache.js";

// Loaded only when the billing feature is on (utils/features.js). Every
// Stripe call and the rule for who is premium live here.

// Plan name -> the lookup key of its Stripe price (scripts/setup-stripe.js).
export const PLANS = {
  monthly: "premium_monthly",
  yearly: "premium_yearly",
};
// Marks the product and portal configuration this site created.
export const STRIPE_MARKER = { app: "55gms-premium" };

// How Stripe's hosted checkout page looks: the site's default blue behind the
// summary, and the premium icon's cyan on the pay button. The image is always
// the main site's: Stripe has to fetch it, and a mirror or localhost may not
// answer.
const PREMIUM_ICON = "https://55gms.com/img/premium.png";
const CHECKOUT_BRANDING = {
  display_name: "55GMS Premium",
  icon: { type: "url", url: PREMIUM_ICON },
  background_color: "#5e7594",
  button_color: "#01b6d8",
  border_style: "rounded",
  font_family: "inter",
};
const CHECKOUT_TEXT = {
  submit: {
    message:
      "Cancel any time from your profile. You keep premium until the end of the time you paid for.",
  },
};

// past_due stays premium: Stripe is still retrying the card. It ends as
// canceled or unpaid when the retries run out.
const LIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

export class BillingSignatureError extends Error {}

let stripeClient;
function stripe() {
  stripeClient ||= new Stripe(process.env.STRIPE);
  return stripeClient;
}

function isLive(status) {
  return LIVE_STATUSES.has(status);
}

function planOf(lookupKey) {
  const entry = Object.entries(PLANS).find(([, key]) => key === lookupKey);
  return entry ? entry[0] : null;
}

let pricesPromise;
// Plan name -> price id. Kept for the life of the process; a failed lookup
// is retried on the next call.
function priceIds() {
  pricesPromise ||= stripe()
    .prices.list({ lookup_keys: Object.values(PLANS), active: true })
    .then(({ data }) => {
      const ids = {};
      for (const price of data) {
        const plan = planOf(price.lookup_key);
        if (plan) ids[plan] = price.id;
      }
      return ids;
    })
    .catch((error) => {
      pricesPromise = null;
      throw error;
    });
  return pricesPromise;
}

let portalConfigPromise;
// The portal configuration setup-stripe.js created, or undefined to use the
// account's default.
function portalConfiguration() {
  portalConfigPromise ||= stripe()
    .billingPortal.configurations.list({ active: true, limit: 100 })
    .then(
      ({ data }) =>
        data.find((config) => config.metadata?.app === STRIPE_MARKER.app)?.id,
    )
    .catch((error) => {
      portalConfigPromise = null;
      throw error;
    });
  return portalConfigPromise;
}

// users.premium is the flag the rest of the site reads. It is true for an
// admin grant or a live subscription; this is the only place that decides.
export async function recomputePremium(uuid) {
  const [user, subscription] = await Promise.all([
    User.findByPk(String(uuid)),
    Subscription.findByPk(String(uuid)),
  ]);
  if (!user) return null;

  const premium = Boolean(user.premiumGranted) || isLive(subscription?.status);
  if (Boolean(user.premium) !== premium) {
    await user.update({ premium });
  }
  userCache.invalidateUser(user.uuid);
  return premium;
}

// Copies the customer's subscription from Stripe into our row. A customer
// can have old cancelled subscriptions beside a new one, so the live one
// wins, then the newest. Always writing Stripe's current state makes repeated
// and out-of-order webhooks harmless.
async function syncCustomer(uuid, customerId) {
  const { data } = await stripe().subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 20,
  });
  const current =
    data.find((subscription) => isLive(subscription.status)) ||
    data.sort((a, b) => b.created - a.created)[0];

  const item = current?.items?.data?.[0];
  const endsAt = current?.cancel_at ?? item?.current_period_end ?? null;

  await Subscription.upsert({
    uuid,
    stripeCustomerId: customerId,
    stripeSubscriptionId: current?.id ?? null,
    status: current?.status ?? null,
    plan: planOf(item?.price?.lookup_key),
    currentPeriodEnd: endsAt ? new Date(endsAt * 1000) : null,
    cancelAtPeriodEnd: Boolean(
      current && (current.cancel_at_period_end || current.cancel_at),
    ),
  });
  return recomputePremium(uuid);
}

// What the pages show. refresh asks Stripe first, for the moment after
// checkout when the webhook may not have landed yet.
export async function getStatus(uuid, { refresh = false } = {}) {
  let subscription = await Subscription.findByPk(String(uuid));
  if (refresh && subscription) {
    await syncCustomer(subscription.uuid, subscription.stripeCustomerId);
    subscription = await Subscription.findByPk(String(uuid));
  }

  const user = await User.findByPk(String(uuid), {
    attributes: ["uuid", "premium", "premiumGranted"],
  });
  if (!user) return null;

  const subscribed = isLive(subscription?.status);
  return {
    premium: Boolean(user.premium),
    source: subscribed ? "subscription" : user.premiumGranted ? "grant" : null,
    plan: subscribed ? subscription.plan : null,
    renewsAt: subscribed ? subscription.currentPeriodEnd : null,
    cancelAtPeriodEnd: subscribed ? subscription.cancelAtPeriodEnd : false,
    pastDue: subscription?.status === "past_due",
  };
}

async function customerFor(user) {
  const existing = await Subscription.findByPk(user.uuid);
  if (existing) return existing.stripeCustomerId;

  // The idempotency key makes two checkouts started at once share a customer.
  const customer = await stripe().customers.create(
    { name: `@${user.username}`, metadata: { uuid: user.uuid } },
    { idempotencyKey: `customer-${user.uuid}` },
  );
  await Subscription.findOrCreate({
    where: { uuid: user.uuid },
    defaults: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

// Returns { url } for Stripe's hosted checkout, { manage: true } when the
// account already has a live subscription, or null for an unknown account.
export async function createCheckout(uuid, plan, origin) {
  const user = await User.findByPk(String(uuid));
  if (!user) return null;

  const price = (await priceIds())[plan];
  if (!price) throw new Error(`No Stripe price for plan "${plan}"`);

  const customer = await customerFor(user);
  // Asked of Stripe, not of our row: a second checkout must not start in the
  // seconds before the first one's webhook arrives.
  await syncCustomer(user.uuid, customer);
  const row = await Subscription.findByPk(user.uuid);
  if (isLive(row?.status)) return { manage: true };

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: user.uuid,
    line_items: [{ price, quantity: 1 }],
    subscription_data: { metadata: { uuid: user.uuid } },
    allow_promotion_codes: true,
    // A code that takes the whole price off needs no card.
    payment_method_collection: "if_required",
    branding_settings: CHECKOUT_BRANDING,
    custom_text: CHECKOUT_TEXT,
    success_url: `${origin}/premium?done=1`,
    cancel_url: `${origin}/premium`,
  });
  return { url: session.url };
}

// Returns { url } for the Stripe Customer Portal, or null when the account
// has never started a checkout.
export async function createPortal(uuid, origin) {
  const row = await Subscription.findByPk(String(uuid));
  if (!row) return null;

  const configuration = await portalConfiguration();
  const session = await stripe().billingPortal.sessions.create({
    customer: row.stripeCustomerId,
    return_url: `${origin}/profile`,
    ...(configuration ? { configuration } : {}),
  });
  return { url: session.url };
}

const SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function idOf(value) {
  return typeof value === "string" ? value : (value?.id ?? null);
}

// Verifies and applies one webhook. rawBody must be the exact bytes Stripe
// sent. Throws BillingSignatureError for a bad signature; any other throw
// should become a 5xx so Stripe sends the event again.
export async function handleWebhook(rawBody, signature) {
  let event;
  try {
    event = stripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    throw new BillingSignatureError(error.message);
  }

  const object = event.data.object;
  let customerId;
  let uuid;
  if (event.type === "checkout.session.completed") {
    if (object.mode !== "subscription") return;
    customerId = idOf(object.customer);
    uuid = object.client_reference_id;
  } else if (SUBSCRIPTION_EVENTS.has(event.type)) {
    customerId = idOf(object.customer);
    uuid = object.metadata?.uuid;
  } else {
    return;
  }
  if (!customerId) return;

  // Our own row is the authority on whose customer this is; the ids Stripe
  // carries back are only needed if the row is somehow missing.
  const row = await Subscription.findOne({
    where: { stripeCustomerId: customerId },
  });
  uuid = row?.uuid || uuid;
  if (!uuid || !(await User.findByPk(String(uuid), { attributes: ["uuid"] }))) {
    // Retrying cannot fix this, so it is acknowledged rather than failed.
    console.warn(
      `[billing] ${event.type} ${event.id}: no account for ${customerId}`,
    );
    return;
  }

  await syncCustomer(String(uuid), customerId);
}

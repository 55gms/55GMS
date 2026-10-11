// Creates what premium billing needs in Stripe: the product, its two prices,
// the Customer Portal configuration and, with --webhook, the webhook
// endpoint. It works on whichever mode the key in STRIPE belongs to (test or
// live) and is safe to re-run: anything already there is left as it is.
//
//   node scripts/setup-stripe.js
//   node scripts/setup-stripe.js --webhook https://example.com/api/stripe/webhook
import "dotenv/config";
import Stripe from "stripe";

// Kept in step with services/billing.js, which is not imported here because
// it connects to the database as it loads.
const MARKER = { app: "55gms-premium" };
const PRICES = [
  {
    lookup_key: "premium_monthly",
    unit_amount: 199,
    interval: "month",
    nickname: "Monthly",
  },
  {
    lookup_key: "premium_yearly",
    unit_amount: 1499,
    interval: "year",
    nickname: "Yearly",
  },
];
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

if (!process.env.STRIPE) {
  console.error("STRIPE is not set in .env");
  process.exit(1);
}

const webhookFlag = process.argv.indexOf("--webhook");
const webhookUrl = webhookFlag === -1 ? null : process.argv[webhookFlag + 1];
if (webhookFlag !== -1 && !/^https:\/\//.test(webhookUrl || "")) {
  console.error("--webhook needs an https URL");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE);
const mode = process.env.STRIPE.startsWith("sk_live_") ? "LIVE" : "test";
console.log(`Stripe mode: ${mode}`);

try {
  const products = await stripe.products
    .list({ active: true, limit: 100 })
    .autoPagingToArray({ limit: 1000 });
  let product = products.find((item) => item.metadata?.app === MARKER.app);
  if (product) {
    console.log(`found:   product ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: "55GMS Premium",
      description: "Choose your ads or turn them off, and a premium badge.",
      metadata: MARKER,
    });
    console.log(`created: product ${product.id}`);
  }

  const { data: existing } = await stripe.prices.list({
    lookup_keys: PRICES.map((price) => price.lookup_key),
    active: true,
  });
  const priceIds = [];
  for (const wanted of PRICES) {
    let price = existing.find((item) => item.lookup_key === wanted.lookup_key);
    if (price) {
      console.log(`found:   price ${wanted.lookup_key} ${price.id}`);
    } else {
      price = await stripe.prices.create({
        product: product.id,
        currency: "usd",
        unit_amount: wanted.unit_amount,
        recurring: { interval: wanted.interval },
        lookup_key: wanted.lookup_key,
        nickname: wanted.nickname,
      });
      console.log(`created: price ${wanted.lookup_key} ${price.id}`);
    }
    priceIds.push(price.id);
  }

  const { data: configs } = await stripe.billingPortal.configurations.list({
    active: true,
    limit: 100,
  });
  const config = configs.find((item) => item.metadata?.app === MARKER.app);
  if (config) {
    console.log(`found:   portal configuration ${config.id}`);
  } else {
    const created = await stripe.billingPortal.configurations.create({
      metadata: MARKER,
      business_profile: { headline: "55GMS Premium" },
      features: {
        customer_update: { enabled: true, allowed_updates: ["email"] },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: { enabled: true, mode: "at_period_end" },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price"],
          proration_behavior: "create_prorations",
          products: [{ product: product.id, prices: priceIds }],
        },
      },
    });
    console.log(`created: portal configuration ${created.id}`);
  }

  if (webhookUrl) {
    const endpoints = await stripe.webhookEndpoints
      .list({ limit: 100 })
      .autoPagingToArray({ limit: 1000 });
    const endpoint = endpoints.find((item) => item.url === webhookUrl);
    if (endpoint) {
      console.log(`found:   webhook endpoint ${endpoint.id}`);
      console.log(
        "         Its signing secret is shown only in the dashboard now.",
      );
    } else {
      const created = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: WEBHOOK_EVENTS,
        description: "55GMS Premium",
      });
      console.log(`created: webhook endpoint ${created.id}`);
      console.log(`\nSTRIPE_WEBHOOK_SECRET=${created.secret}`);
      console.log("Put that line in .env now. It is not shown again.");
    }
  }
} catch (error) {
  console.error(`Stripe setup failed: ${error.message}`);
  process.exit(1);
}

# Premium subscriptions through Stripe Checkout

Date: 2026-10-11

## Goal

Sell 55GMS Premium as a subscription: $1.99 a month or $14.99 a year, paid
through Stripe Checkout.

Success means:

- A signed-in account can subscribe on `/premium`, pay on Stripe's hosted
  page, and come back premium without anyone touching `/admin`.
- Premium ends by itself when a subscription ends.
- A premium granted by hand from `/admin` is never removed by anything Stripe
  does.
- A self-hosted copy of the site (a fork, a Codespace, a local run) has no
  trace of billing: no routes, no page, no links, no Stripe calls, and it
  needs no Stripe settings to boot.

Premium unlocks what it does today (the ad choices in settings and the chat
badge). This spec adds no new perks.

## Decisions already made

| Question                         | Decision                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Prices                           | $1.99 monthly, $14.99 yearly, USD only                                                                     |
| Payment surface                  | Stripe-hosted Checkout (redirect), not embedded                                                            |
| Hand-granted premium             | Kept. Premium is a grant OR a live subscription                                                            |
| Cancel, card change, plan switch | Stripe Customer Portal, no custom billing UI                                                               |
| Stripe account                   | The `55gms` account (`acct_1OJLUQDQl6SK5gdk`): its test mode for development, its live mode for production |
| Trials, coupons, tax             | None                                                                                                       |
| When the site is not production  | Billing is off entirely unless the Stripe settings are present                                             |
| Tests                            | None written; checked by hand                                                                              |

## Today

- `users.premium` (boolean) is the only premium state. Everything reads it:
  `/api/checkPremium`, login, the chat payloads, `utils/userCache.js`.
- It is written only by `POST /api/admin/premium`, which is limited to the
  session cookie of `jiayang` and needs `ADMIN_TOKEN_SECRET`.
- Accounts have no email address.
- The Stripe account has no products, prices or subscriptions.

## Data

`users.premium` stays the effective flag, so nothing that reads premium
changes.

New column on `users`:

- `premium_granted BOOLEAN NOT NULL DEFAULT false`: the admin grant. Backfilled
  once from `premium`, so everyone premium today keeps it as a grant.

New table `subscriptions`, one row per account that has ever started a
checkout:

| Column                    | Type        | Notes                                         |
| ------------------------- | ----------- | --------------------------------------------- |
| `uuid`                    | string, PK  | The account                                   |
| `stripe_customer_id`      | string      | Unique. Reused for every later checkout       |
| `stripe_subscription_id`  | string      | Null until a subscription exists              |
| `status`                  | string      | Stripe's subscription status, null until then |
| `plan`                    | string      | `monthly` or `yearly`                         |
| `current_period_end`      | timestamptz | When it renews or ends                        |
| `cancel_at_period_end`    | boolean     | Set to cancel, still premium until the date   |
| `created_at`/`updated_at` | timestamptz |                                               |

One rule, in one function (`recomputePremium(uuid)` in `services/billing.js`):

    premium = premium_granted OR subscription.status IN (active, trialing, past_due)

It runs after every webhook and every admin change, writes `users.premium`
only when the value differs, and then invalidates the user cache the way
`/api/admin/premium` does today.

`past_due` counts as premium, so a failed renewal does not cut someone off
while Stripe retries the card. Premium ends when Stripe gives up and the
subscription becomes `canceled` or `unpaid`.

`scripts/add-billing.js` adds the column, runs the backfill and creates the
table. It is safe to re-run and safe to run under the build that is live now.
It must run on production before the first deploy that reads the column.
The backfill runs only when the column is first added, so a re-run cannot
turn a paid premium into a grant.

## Feature switch

`utils/features.js` gains `billing`:

    billing = accounts on the Postgres backend
              AND STRIPE_SECRET_KEY AND STRIPE_WEBHOOK_SECRET
              AND ADMIN_TOKEN_SECRET

`EXAMPLE.env` lists the two Stripe settings commented out, so a copied `.env`
leaves billing off. With billing off:

- `routes/billing.js`, `services/billing.js` and the `stripe` package are
  never imported.
- `/api/billing/*` and `/api/stripe/webhook` answer 503 JSON, like the other
  disabled features.
- `/premium` redirects to `/`.
- The build's `html` stage removes links to `/premium` from the built pages,
  as it does for `/chat` and `/profile`.
- Pages served straight from `static/` ask `GET /api/billing/status`; a 503
  hides the upgrade and billing UI.
- `/admin` grants keep working exactly as now.

## Server

`services/billing.js` holds every Stripe call and the premium rule.
`routes/billing.js` is the HTTP layer. Both are loaded only when billing is on.

Every route below except the webhook requires the session cookie
(`readSession`). A uuid alone is never enough: uuids are visible to chat
members.

**`POST /api/billing/checkout`** with `{ plan: "monthly" | "yearly" }`

1. 401 without a session. 400 for any other plan.
2. 409 with `{ manage: true }` when the account already has a subscription in
   a live status, so nobody is charged twice. The page then offers the portal.
3. Finds the `subscriptions` row, or creates a Stripe customer
   (`metadata.uuid`, name `@handle`) and the row.
4. Creates a Checkout Session: `mode: subscription`, the price looked up by
   lookup key, `customer`, `client_reference_id: uuid`,
   `subscription_data.metadata.uuid`, `success_url: /premium?done=1`,
   `cancel_url: /premium`.
5. Returns `{ url }`.

**`POST /api/billing/portal`** returns `{ url }` for a Customer Portal session
that comes back to `/profile`. 404 when the account has no Stripe customer.

**`GET /api/billing/status`** returns
`{ premium, source: "grant" | "subscription" | null, plan, renewsAt, cancelAtPeriodEnd }`.

**`POST /api/stripe/webhook`**

- Mounted in `index.js` before `express.json`, with `express.raw`, because the
  signature is checked against the exact bytes Stripe sent.
- A bad or missing signature is a 400.
- Handles `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`. Anything
  else is acknowledged and ignored.
- For each, it reads the subscription id from the event, fetches that
  subscription from Stripe, finds the account (the row by customer id, else
  `metadata.uuid`), writes the row, and calls `recomputePremium`. Because it
  always writes Stripe's current state, repeated, late or out-of-order events
  give the same result.
- An error inside the handler is a 500, so Stripe retries.

The success redirect is never trusted. `/premium?done=1` only polls
`/api/billing/status` until the webhook has landed.

Prices are found by lookup key (`premium_monthly`, `premium_yearly`) and
cached in memory, so no price ids live in the env.

**Admin.** `POST /api/admin/premium` writes `premium_granted` and calls
`recomputePremium`. Admin user objects carry `premium` (effective) and
`premiumGranted`; the button grants or revokes the grant, and the status line
says when premium comes from a subscription instead. With billing off there
is no subscription to consider and the result equals today's behaviour.

## Stripe setup

The same account has two modes with separate keys and separate data. A
`sk_test_` key takes Stripe's test cards (`4242 4242 4242 4242`) and never
moves money; a `sk_live_` key takes real cards only. The code is the same for
both: the mode is whichever key is in `.env`. Development uses the test key,
production the live key.

`scripts/setup-stripe.js` sets up the mode its key belongs to, through the
Stripe API, and is safe to re-run. Nothing is clicked in the dashboard.

- Creates the product "55GMS Premium" if none carries its metadata marker.
- Creates the two recurring prices with their lookup keys if missing.
- Creates the Customer Portal configuration (cancel at period end, update
  payment method, switch between the two prices) and makes it the default.
- With `--webhook https://<site>/api/stripe/webhook`, creates the webhook
  endpoint for the four events above if that URL has none, and prints its
  signing secret once, to the terminal, for `STRIPE_WEBHOOK_SECRET`.
- Prints what it found or created, and which mode it ran in.

Locally, Stripe cannot reach `localhost`, so webhooks come through the Stripe
CLI: `stripe listen --forward-to localhost:8080/api/stripe/webhook`, which
prints the signing secret to use in the local `.env`.

One setting has no API and is checked once in the dashboard (Billing,
Revenue recovery): after the last failed retry, cancel the subscription.
`docs/billing.md` records this and the steps above.

## Pages

- **`/premium`** (`static/premium.html`, `assets/js/premium.js`): what premium
  gives, the two plans with yearly marked as about 37% off, one subscribe
  button per plan. Signed out: the buttons go to `/login`. Already premium
  by subscription: plan, renewal date and "Manage billing". Premium by grant:
  a note that the account already has premium.
- **`/profile`** (`static/account.html`): beside the Premium pill, the plan and
  renewal or end date, and "Manage billing" for subscribers; an upgrade link
  for everyone else.
- **Settings**: the "Upgrade to premium" tooltip on the ads card becomes a link
  to `/premium`.
- After a successful return, `localStorage.premium` is refreshed from
  `/api/checkPremium` as the pages already do.

## Rollout

Development, in test mode:

1. Put the `sk_test_` key in the local `.env`; run
   `node scripts/add-billing.js` and `node scripts/setup-stripe.js`.
2. Run `stripe listen` and put its signing secret in `.env`.
3. Check by hand with test cards: subscribe monthly, subscribe yearly, a
   declined card, cancel in the portal, a failed renewal, a hand grant that
   survives a cancelled subscription, and a boot with the Stripe settings
   removed.

Production, in live mode:

1. Run `node scripts/add-billing.js` on production.
2. Run `node scripts/setup-stripe.js --webhook https://<site>/api/stripe/webhook`
   with the live key.
3. Put `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in production's `.env`
   (`ADMIN_TOKEN_SECRET` must already be there).
4. Deploy. Until step 3 is done, the deployed code runs with billing off.

## Out of scope

- Email receipts beyond what Stripe sends, invoices in the site, refunds from
  `/admin`.
- Dispute handling (a dispute is handled in the dashboard; premium is then
  revoked by cancelling the subscription there).
- The Worker account backend. Billing needs `ACCOUNT_BACKEND=postgres`.
- Trials, coupons, gift subscriptions, tax collection.

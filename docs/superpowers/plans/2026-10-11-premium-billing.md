# Premium Billing Implementation Plan

**Goal:** Sell 55GMS Premium ($1.99 monthly, $14.99 yearly) through Stripe
Checkout, with premium switched on and off by webhooks.

**Architecture:** `users.premium` stays the effective flag. A new
`users.premium_granted` holds the admin grant and a new `subscriptions` table
holds Stripe's state; `recomputePremium(uuid)` derives the flag from both.
All Stripe calls live in `services/billing.js`, loaded only when the
`billing` feature is on.

**Tech stack:** `stripe` Node SDK, Express, Sequelize, plain static pages.

**Spec:** `docs/superpowers/specs/2026-10-11-premium-billing-design.md`

## Global constraints

- Billing is on only with `STRIPE`, `STRIPE_WEBHOOK_SECRET`,
  `ADMIN_TOKEN_SECRET` and `ACCOUNT_BACKEND=postgres` with a database. Off
  means no Stripe import, 503 JSON on its API, `/premium` redirecting home,
  and no `/premium` links in built pages.
- The Stripe secret key is read from `STRIPE` (the name already in `.env`).
- Prices are found by lookup key: `premium_monthly`, `premium_yearly`.
- Live subscription statuses: `active`, `trialing`, `past_due`.
- The webhook is the only writer of subscription state. The success redirect
  is never trusted.
- No tests are written or run. Commits go straight to `main`, semantic
  messages, and are not pushed (a push deploys).

## Review focus

- A webhook for a customer with no `subscriptions` row and no
  `metadata.uuid`: acknowledged and logged, never a 500 loop.
- A second checkout while a subscription is live: 409, no second charge.
- A cancelled subscription on an account with an admin grant: stays premium.
- A boot with the Stripe settings removed: no Stripe import, pages hide
  billing.
- `add-billing.js` re-run after subscriptions exist: paid premium is not
  turned into a grant.

## Tasks

### Task 1: Data and the feature switch

- Create `models/Subscription.js`; export it from `models/index.js`.
- Modify `models/User.js`: `premiumGranted` (`premium_granted`).
- Create `scripts/add-billing.js`: add the column, backfill from `premium`
  only when the column is new, create `subscriptions`.
- Modify `utils/features.js`: `billing`, and `/premium` in the redirect list
  when it is off.
- Modify `EXAMPLE.env`.

Produces: `Subscription` model; `features.billing`.

### Task 2: Billing service and Stripe setup script

- Add the `stripe` dependency.
- Create `services/billing.js`:
  - `PLANS = { monthly: "premium_monthly", yearly: "premium_yearly" }`
  - `recomputePremium(uuid) -> boolean`
  - `getStatus(uuid) -> { premium, source, plan, renewsAt, cancelAtPeriodEnd }`
  - `createCheckout(uuid, plan, origin) -> { url } | { manage: true }`
  - `createPortal(uuid, origin) -> { url } | null`
  - `handleWebhook(rawBody, signature)`; throws `BillingSignatureError` on a
    bad signature
- Create `scripts/setup-stripe.js`: product, two prices, portal
  configuration, optional `--webhook <url>`.

### Task 3: Routes, admin grant and server wiring

- Create `routes/billing.js`: `POST /billing/checkout`,
  `POST /billing/portal`, `GET /billing/status`, and the webhook handler
  exported separately.
- Modify `index.js`: mount the webhook with `express.raw` before
  `express.json`; mount the router when `features.billing`; 503 and redirect
  when off; add the `/premium` page route.
- Modify `services/postgresAccounts.js`: `setPremium` writes
  `premiumGranted` and the effective flag; admin user objects carry
  `premiumGranted`.
- Modify `routes/admin.js` and `static/assets/js/admin.js`: grant and revoke
  act on the grant; show when premium comes from a subscription.

### Task 4: Pages

- Create `static/premium.html`, `static/assets/js/premium.js`,
  `static/assets/css/premium.css`.
- Modify `static/account.html`: a Premium section with plan, date and
  "Manage billing" or an upgrade link, hidden when billing is off.
- Modify `static/assets/js/settings.js`: the locked ads card links to
  `/premium`.
- Modify `scripts/build/html.js`: drop `/premium` links when billing is off.

### Task 5: Set up test mode, check by hand, document

- Run `scripts/add-billing.js` and `scripts/setup-stripe.js` against the
  local database and the test key.
- With `stripe listen`, walk the spec's manual checks.
- Create `docs/billing.md`; update `CLAUDE.md`.

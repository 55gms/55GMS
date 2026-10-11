# Premium billing

55GMS Premium is sold as a Stripe subscription: $1.99 a month or $14.99 a
year. The design is in
`docs/superpowers/specs/2026-10-11-premium-billing-design.md`.

## When it is on

Billing runs only when all of these are true (`utils/features.js`):

- `STRIPE` (the Stripe secret key) and `STRIPE_WEBHOOK_SECRET` are set
- `ADMIN_TOKEN_SECRET` is set, so logins carry a session cookie
- `ACCOUNT_BACKEND=postgres` with a database

Otherwise nothing about it loads: `services/billing.js`, `routes/billing.js`
and the `stripe` package are never imported, `/api/billing/*` and
`/api/stripe/webhook` answer 503, `/premium` redirects to `/`, and the build
leaves links to `/premium` out of the pages. A self-hosted copy needs no
Stripe settings.

One thing does apply to every copy that keeps accounts in Postgres: the
`users.premium_granted` column must exist. A new database gets it from
`node setup-db.js`; an existing one needs `node scripts/add-billing.js` once.

## How premium is decided

`users.premium` is the flag the site reads. It is true when either holds:

- `users.premium_granted`: premium given by hand from `/admin`
- the account's row in `subscriptions` has status `active`, `trialing` or
  `past_due`

`recomputePremium(uuid)` in `services/billing.js` is the only code that
applies this rule. It runs after every webhook and every `/admin` change.

Stripe's webhook is the only thing that writes subscription state. On each
event the server asks Stripe for the customer's subscriptions and stores the
live one, so repeated or out-of-order events give the same result. The
redirect back from checkout is never trusted.

## Setting up Stripe

The account has two modes with separate keys and data. `sk_test_` keys take
test cards (`4242 4242 4242 4242`, any future date, any CVC) and move no
money. `sk_live_` keys take real cards. The code is the same for both.

    node scripts/add-billing.js
    node scripts/setup-stripe.js

`setup-stripe.js` creates the product, the two prices (lookup keys
`premium_monthly` and `premium_yearly`) and the Customer Portal
configuration in the mode of the key in `.env`. It is safe to re-run.

One setting has no API. In the dashboard, under Billing, Revenue recovery,
set a subscription to be cancelled after the last failed payment retry.
Until Stripe gives up, a failed renewal leaves the account premium.

### Local

Stripe cannot reach `localhost`, so the Stripe CLI forwards the events:

    stripe listen \
      --events checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted \
      --forward-to localhost:8080/api/stripe/webhook

Put the signing secret it prints in `.env` as `STRIPE_WEBHOOK_SECRET` (it is
the same every time for one machine and key). Run the server with
`STATIC_ROOT=static node .` to see page edits without a build.

### Production

1. On the server: `node scripts/add-billing.js`. Do this before the deploy
   that first reads the column.
2. With the live key in `.env`:
   `node scripts/setup-stripe.js --webhook https://<site>/api/stripe/webhook`.
   It prints `STRIPE_WEBHOOK_SECRET=...` once.
3. Put `STRIPE` and `STRIPE_WEBHOOK_SECRET` in the server's `.env`.
4. Deploy. The build must run with those settings present, or it strips the
   `/premium` links.

## How checkout looks

The buyer pays on Stripe's hosted page. `CHECKOUT_BRANDING` and
`CHECKOUT_TEXT` in `services/billing.js` set its name, icon, colours, font
and the line above the pay button on every session, so nothing needs
setting in the dashboard. The panel is the site's default blue
(`--site-bg`) and the button the premium icon's cyan. Stripe
takes the icon and the product image only as PNG, JPG or SVG, which is why
`static/img/premium.png` exists beside the WebP. It is 640px wide because
Stripe shows the product image large in the summary panel; both are fetched from
`https://55gms.com/img/premium.png` whichever domain the buyer is on.

Checkout sends the buyer back to the domain they were on, so every mirror
works for buying. Webhooks go to the one URL registered in step 2.

## Routes

| Route                        | What it does                                                     |
| ---------------------------- | ---------------------------------------------------------------- |
| `GET /api/billing/status`    | Premium, where it comes from, plan and renewal date              |
| `POST /api/billing/checkout` | `{ plan: "monthly" \| "yearly" }` returns a Stripe Checkout URL  |
| `POST /api/billing/portal`   | Returns a Customer Portal URL (cancel, change card, switch plan) |
| `POST /api/stripe/webhook`   | Stripe's events, verified by signature                           |

The first three need the session cookie. A uuid alone is never accepted:
uuids are visible to chat members.

## Refunds and disputes

Both are handled in the Stripe dashboard. Cancelling the subscription there
removes premium through the webhook; a refund alone does not.

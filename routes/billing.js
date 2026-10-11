import express from "express";
import {
  BillingSignatureError,
  PLANS,
  createCheckout,
  createPortal,
  getStatus,
  handleWebhook,
} from "../services/billing.js";
import { readSession } from "../utils/sessionToken.js";

// Where Stripe sends the buyer back to: the address they are using, since
// the site is reached through more than one domain.
function originOf(req) {
  const forwarded = req.headers["x-forwarded-proto"];
  const protocol = forwarded ? forwarded.split(",")[0].trim() : req.protocol;
  return `${protocol === "https" ? "https" : "http"}://${req.get("host")}`;
}

// Mounted by index.js with express.raw, ahead of the JSON body parser: the
// signature is checked against the exact bytes Stripe sent.
export async function stripeWebhook(req, res) {
  try {
    await handleWebhook(req.body, req.headers["stripe-signature"]);
    res.status(200).json({ received: true });
  } catch (error) {
    if (error instanceof BillingSignatureError) {
      return res.status(400).json({ error: "Bad signature" });
    }
    // A 5xx makes Stripe deliver the event again later.
    console.error("[billing] webhook failed:", error);
    res.status(500).json({ error: "Webhook failed" });
  }
}

export function createBillingRouter() {
  const router = express.Router();

  // UUIDs are visible to chat members, so billing is authorized by the
  // session cookie set at login, never by uuid alone.
  function requireSession(req, res, next) {
    const session = readSession(req);
    if (!session) {
      return res.status(401).json({ error: "Sign in again to continue" });
    }
    req.uuid = String(session.uuid);
    next();
  }

  router.use("/billing", requireSession);

  router.get("/billing/status", async (req, res) => {
    try {
      const status = await getStatus(req.uuid, {
        refresh: req.query.refresh === "1",
      });
      if (!status) return res.status(404).json({ error: "User not found" });
      res.status(200).json(status);
    } catch (error) {
      console.error("[billing] status failed:", error);
      res.status(500).json({ error: "Could not load billing status" });
    }
  });

  router.post("/billing/checkout", async (req, res) => {
    const plan = req.body?.plan;
    if (typeof plan !== "string" || !Object.hasOwn(PLANS, plan)) {
      return res.status(400).json({ error: "Unknown plan" });
    }

    try {
      const result = await createCheckout(req.uuid, plan, originOf(req));
      if (!result) return res.status(404).json({ error: "User not found" });
      if (result.manage) {
        return res
          .status(409)
          .json({ error: "You already have a subscription", manage: true });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("[billing] checkout failed:", error);
      res.status(500).json({ error: "Could not start checkout" });
    }
  });

  router.post("/billing/portal", async (req, res) => {
    try {
      const result = await createPortal(req.uuid, originOf(req));
      if (!result) {
        return res.status(404).json({ error: "No subscription to manage" });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("[billing] portal failed:", error);
      res.status(500).json({ error: "Could not open billing" });
    }
  });

  return router;
}

export default createBillingRouter();

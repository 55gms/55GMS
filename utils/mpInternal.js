import { timingSafeEqual } from "node:crypto";

// Routes only the multiplayer server may call (github.com/55gms/multiplayer).
// It runs on the same box and calls straight in. Caddy also connects from
// loopback but always adds X-Forwarded-For, so a request that came through it
// is refused whatever it carries. The secret is MP_SHARED_SECRET, the same
// value as the multiplayer server's.
export function requireMultiplayerServer(req, res, next) {
  const secret = process.env.MP_SHARED_SECRET || "";
  const given = String(req.headers["x-mp-secret"] || "");
  const address = req.socket?.remoteAddress || "";
  const loopback = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
  const ok =
    secret.length >= 16 &&
    loopback &&
    !req.headers["x-forwarded-for"] &&
    given.length === secret.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return res.status(403).json({ error: "forbidden" });
  next();
}

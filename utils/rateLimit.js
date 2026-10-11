// The address of whoever connected to the reverse proxy. Caddy appends it
// to X-Forwarded-For, so the last entry is the one a client cannot forge.
export function clientKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded.at(-1) || req.socket?.remoteAddress || "unknown";
}

// A fixed-window limit held in memory, so it is per pm2 worker. Good enough
// to stop a route being scraped; not a security boundary.
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map();

  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  sweep.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = clientKey(req);
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: message });
    }
    next();
  };
}

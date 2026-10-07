import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_TOKEN_TTL_MS = 60 * 60 * 1000;

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

// Token format: base64url(JSON payload) + "." + HMAC-SHA256 of that string.
export function createAdminToken(uuid, secret, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ uuid, exp: now + ADMIN_TOKEN_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// Returns the payload when the signature matches and the token has not
// expired, otherwise null.
export function verifyAdminToken(token, secret, now = Date.now()) {
  if (typeof token !== "string") return null;

  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length > 0) return null;

  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp <= now) return null;
    return data;
  } catch {
    return null;
  }
}

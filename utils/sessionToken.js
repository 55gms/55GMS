import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

// Token format: base64url(JSON payload) + "." + HMAC-SHA256 of that string.
export function createSessionToken(uuid, secret, now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ uuid, exp: now + SESSION_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// Returns the payload when the signature matches and the token has not
// expired, otherwise null.
export function verifySessionToken(token, secret, now = Date.now()) {
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

function cookieOptions(req) {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    path: "/api",
  };
}

// The session lives in an HttpOnly cookie, never in localStorage: cloud
// saves upload all of localStorage, and a save can be read by uuid alone.
// Does nothing while ADMIN_TOKEN_SECRET is unset.
export function setSessionCookie(req, res, uuid) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) return;

  res.cookie(SESSION_COOKIE, createSessionToken(uuid, secret), {
    ...cookieOptions(req),
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(req, res) {
  res.clearCookie(SESSION_COOKIE, cookieOptions(req));
}

// Returns the session payload for the request's cookie, or null.
export function readSession(req) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) return null;

  const cookies = (req.headers.cookie || "").split(";");
  for (const cookie of cookies) {
    const index = cookie.indexOf("=");
    if (index !== -1 && cookie.slice(0, index).trim() === SESSION_COOKIE) {
      return verifySessionToken(cookie.slice(index + 1).trim(), secret);
    }
  }
  return null;
}

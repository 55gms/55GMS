import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

// The signup check: a proof of work the browser does by itself, with no
// third party. The server hides a number below CAPTCHA_MAX_NUMBER behind a
// SHA-256 hash and the browser tries numbers until one hashes the same. It
// costs a person about a second once and a script that second per account.
//
// Nothing is stored. A challenge is signed together with the handle it was
// issued for, so any pm2 worker can verify it and a solved one cannot be
// spent on a second account.
export const CAPTCHA_MAX_NUMBER = 500_000;
export const CAPTCHA_TTL_MS = 10 * 60 * 1000;

let fallbackSecret;

// CAPTCHA_SECRET if set, else the session secret, else a key derived from a
// secret every worker already shares, so production needs no new setting.
function signingKey() {
  const explicit =
    process.env.CAPTCHA_SECRET || process.env.ADMIN_TOKEN_SECRET;
  if (explicit) return explicit;

  const shared = process.env.POSTGRES_URL || process.env.workerAUTH;
  if (shared) {
    return createHmac("sha256", shared).update("55gms-captcha").digest();
  }

  fallbackSecret ||= randomBytes(32);
  return fallbackSecret;
}

function sign(handle, salt, expires, challenge) {
  return createHmac("sha256", signingKey())
    .update(`${handle}.${salt}.${expires}.${challenge}`)
    .digest("hex");
}

function hashNumber(salt, number) {
  return createHash("sha256").update(`${salt}.${number}`).digest("hex");
}

export function createChallenge(handle, now = Date.now()) {
  const salt = randomBytes(12).toString("hex");
  const expires = now + CAPTCHA_TTL_MS;
  const challenge = hashNumber(salt, randomInt(CAPTCHA_MAX_NUMBER));

  return {
    salt,
    expires,
    challenge,
    max: CAPTCHA_MAX_NUMBER,
    signature: sign(handle, salt, expires, challenge),
  };
}

// True when `solution` is a challenge this server issued for `handle`, still
// in date, with the number that solves it.
export function verifySolution(solution, handle, now = Date.now()) {
  if (!solution || typeof solution !== "object") return false;
  const { salt, expires, challenge, signature, number } = solution;

  if (
    typeof salt !== "string" ||
    typeof challenge !== "string" ||
    typeof signature !== "string" ||
    !Number.isSafeInteger(expires) ||
    !Number.isInteger(number) ||
    number < 0 ||
    number >= CAPTCHA_MAX_NUMBER
  ) {
    return false;
  }
  if (expires <= now) return false;

  const expected = Buffer.from(sign(handle, salt, expires, challenge));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return false;
  }

  return hashNumber(salt, number) === challenge;
}

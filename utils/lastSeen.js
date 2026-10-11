import defaultAccounts from "../services/accounts.js";

const WRITE_INTERVAL_MS = 60 * 60 * 1000;
const MAX_TRACKED = 50000;
const lastWrite = new Map();

// Records that an account was just active, at most once an hour per account
// per worker. Never awaited and never fails the request it rides on.
export function noteSeen(uuid, accounts = defaultAccounts, now = Date.now()) {
  if (typeof uuid !== "string" || !uuid) return;

  const previous = lastWrite.get(uuid);
  if (previous && now - previous < WRITE_INTERVAL_MS) return;

  // The uuid comes from the client, so the map is capped, not trusted.
  if (lastWrite.size >= MAX_TRACKED) lastWrite.clear();
  lastWrite.set(uuid, now);

  Promise.resolve(accounts.touchLastSeen(uuid)).catch(() => {});
}

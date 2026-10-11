// Planning for the one-off handle migration. Pure functions, no database
// access: given every account, decide who is deleted and who gets which
// handle. The same input always gives the same plan, so a dry run shows
// exactly what --apply will do.
import { createHash } from "node:crypto";
import {
  HANDLE_MAX_LENGTH,
  cleanToHandle,
  hasNonAscii,
  isValidHandle,
} from "../../utils/handle.js";

// Signup order: the position in the Worker export, then, for accounts made
// since, creation time. The admin account goes first so it always keeps its
// handle.
function rankUsers(users, orderIndex, adminHandle) {
  const rank = (user) => {
    if (user.username === adminHandle) return [-1, 0, ""];
    const position = orderIndex.get(user.uuid);
    return position === undefined
      ? [1, new Date(user.createdAt).getTime(), user.uuid]
      : [0, position, user.uuid];
  };
  const ranked = users.map((user) => ({ user, key: rank(user) }));
  ranked.sort(
    (a, b) =>
      a.key[0] - b.key[0] ||
      a.key[1] - b.key[1] ||
      (a.key[2] < b.key[2] ? -1 : a.key[2] > b.key[2] ? 1 : 0),
  );
  return ranked.map((entry) => entry.user);
}

function claimOf(user) {
  const cleaned = cleanToHandle(user.username)
    .slice(0, HANDLE_MAX_LENGTH)
    .replace(/-+$/, "");
  return isValidHandle(cleaned) ? cleaned : null;
}

// "king" -> "king2", "king3", ... shortened so the number always fits.
function numbered(base, taken) {
  for (let n = 2; ; n += 1) {
    const suffix = String(n);
    const candidate = base.slice(0, HANDLE_MAX_LENGTH - suffix.length) + suffix;
    if (isValidHandle(candidate) && !taken.has(candidate)) return candidate;
  }
}

// "user" plus seven digits taken from the uuid, so it does not change
// between the dry run and the real one.
function generated(uuid, taken) {
  let number =
    parseInt(createHash("sha256").update(uuid).digest("hex").slice(0, 12), 16) %
    10000000;
  for (;;) {
    const candidate = `user${String(number).padStart(7, "0")}`;
    if (!taken.has(candidate)) return candidate;
    number = (number + 1) % 10000000;
  }
}

export function planHandles(users, orderIndex, { adminHandle }) {
  const ranked = rankUsers(users, orderIndex, adminHandle);

  // Names in other alphabets never win a handle automatically: what is left
  // after cleaning is a fragment their owner did not pick. They do not make
  // a handle contested either.
  const claims = new Map();
  for (const user of ranked) {
    const claim = hasNonAscii(user.username) ? null : claimOf(user);
    if (!claim) continue;
    if (!claims.has(claim)) claims.set(claim, []);
    claims.get(claim).push(user);
  }

  // Accounts that own nothing are deleted, but only where someone else
  // wants the same handle.
  const deletes = new Set();
  for (const claimants of claims.values()) {
    if (claimants.length < 2) continue;
    for (const user of claimants) {
      if (user.empty && user.username !== adminHandle) deletes.add(user.uuid);
    }
  }

  const assignments = new Map();
  const taken = new Set();
  const losers = [];

  for (const [claim, claimants] of claims) {
    const remaining = claimants.filter((user) => !deletes.has(user.uuid));
    if (!remaining.length) continue;

    const [winner, ...rest] = remaining;
    taken.add(claim);
    assignments.set(winner.uuid, {
      uuid: winner.uuid,
      oldName: winner.username,
      handle: claim,
      pending: false,
      action:
        winner.username === claim
          ? "unchanged"
          : winner.username.toLowerCase() === claim
            ? "lowercased"
            : "cleaned",
    });
    for (const user of rest) losers.push({ user, base: claim });
  }

  // Placeholders come after every winner, so none of them takes a handle
  // that somebody holds by right.
  const pending = (user, handle) => {
    taken.add(handle);
    assignments.set(user.uuid, {
      uuid: user.uuid,
      oldName: user.username,
      handle,
      pending: true,
      action: "pending",
    });
  };

  for (const { user, base } of losers) pending(user, numbered(base, taken));

  for (const user of ranked) {
    if (assignments.has(user.uuid) || deletes.has(user.uuid)) continue;
    const claim = claimOf(user);
    pending(
      user,
      claim && !taken.has(claim) ? claim : generated(user.uuid, taken),
    );
  }

  return {
    deletes: [...deletes],
    assignments: ranked
      .filter((user) => assignments.has(user.uuid))
      .map((user) => assignments.get(user.uuid)),
  };
}

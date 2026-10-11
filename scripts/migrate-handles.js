// One-off migration of usernames to handles. See
// docs/superpowers/specs/2026-10-10-handles-design.md and
// docs/handles-rollout.md.
//
//   node scripts/migrate-handles.js --order signup-order.txt \
//     [--report handle-migration-report.csv] [--apply]
//
// Without --apply it only reads: it prints the totals and writes the report
// of what would happen. With --apply it deletes the empty accounts that sit
// on a contested handle and renames the rest, in one transaction.
//
// Run scripts/add-handle-columns.js first. It refuses to run twice.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { QueryTypes } from "sequelize";
import { sequelize } from "../models/index.js";
import { planHandles } from "./lib/handlePlan.js";

const ADMIN_HANDLE = "jiayang";
// Accounts created after the move off the Worker are never treated as empty.
const CUTOVER = "2026-10-02T12:23:00Z";
const BATCH = 1000;
const HANDLE_CHECK = `username ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(username) BETWEEN 3 AND 16`;

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const argValue = (flag, fallback) => {
  const index = args.indexOf(flag);
  const value = index === -1 ? fallback : args[index + 1];
  return value ? path.resolve(value) : null;
};
const orderFile = argValue("--order", null);
const reportFile = argValue("--report", "handle-migration-report.csv");

// Set once the transaction has committed, so a later failure is not
// reported as "nothing was changed".
let committed = false;

function fail(message) {
  console.error(`Stopped: ${message}`);
  process.exit(1);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function chunks(values, size) {
  const result = [];
  for (let i = 0; i < values.length; i += size) {
    result.push(values.slice(i, i + size));
  }
  return result;
}

async function loadUsers(transaction) {
  return sequelize.query(
    `SELECT u.uuid, u.username, u."createdAt",
       (NOT u.premium
        AND u."createdAt" < :cutover
        AND NOT EXISTS (SELECT 1 FROM user_saves s WHERE s.uuid = u.uuid)
        AND NOT EXISTS (SELECT 1 FROM chat_members m WHERE m."userUuid" = u.uuid)
        AND NOT EXISTS (SELECT 1 FROM messages m WHERE m."senderUuid" = u.uuid)
        AND NOT EXISTS (SELECT 1 FROM chats c WHERE c."createdBy" = u.uuid)
        AND NOT EXISTS (SELECT 1 FROM friends f
                        WHERE f."requesterUuid" = u.uuid OR f."addresseeUuid" = u.uuid)
       ) AS empty
     FROM users u`,
    {
      replacements: { cutover: CUTOVER },
      type: QueryTypes.SELECT,
      transaction,
    },
  );
}

async function scalar(sql, transaction, replacements = {}) {
  const [row] = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    transaction,
    replacements,
  });
  return Number(Object.values(row)[0]);
}

function summarize(users, plan) {
  const counts = { unchanged: 0, lowercased: 0, cleaned: 0, pending: 0 };
  for (const assignment of plan.assignments) counts[assignment.action] += 1;
  console.log(`Accounts:                 ${users.length}`);
  console.log(`  deleted (empty, contested): ${plan.deletes.length}`);
  console.log(`  unchanged:                  ${counts.unchanged}`);
  console.log(`  lowercased:                 ${counts.lowercased}`);
  console.log(`  characters removed:         ${counts.cleaned}`);
  console.log(`  must choose a handle:       ${counts.pending}`);
}

function writeReport(users, plan) {
  const oldNames = new Map(users.map((user) => [user.uuid, user.username]));
  const lines = ["uuid,old_username,new_handle,action"];
  for (const uuid of plan.deletes) {
    lines.push(
      [uuid, oldNames.get(uuid), "", "deleted"].map(csvCell).join(","),
    );
  }
  for (const a of plan.assignments) {
    if (a.action === "unchanged") continue;
    lines.push([a.uuid, a.oldName, a.handle, a.action].map(csvCell).join(","));
  }
  fs.writeFileSync(reportFile, lines.join("\n") + "\n");
  console.log(`Report: ${reportFile} (${lines.length - 1} rows)`);
}

async function applyPlan(users, plan, transaction) {
  const run = (sql, replacements) =>
    sequelize.query(sql, { transaction, replacements });

  for (const batch of chunks(plan.deletes, BATCH)) {
    await run(`DELETE FROM user_status WHERE "userUuid" IN (:uuids)`, {
      uuids: batch,
    });
    await run(`DELETE FROM users WHERE uuid IN (:uuids)`, { uuids: batch });
  }

  await run(
    `CREATE TEMP TABLE handle_plan (
       uuid VARCHAR(255) PRIMARY KEY,
       handle VARCHAR(255) NOT NULL UNIQUE,
       pending BOOLEAN NOT NULL
     ) ON COMMIT DROP`,
  );
  for (const batch of chunks(plan.assignments, BATCH)) {
    await run(
      `INSERT INTO handle_plan (uuid, handle, pending) VALUES ${batch
        .map(() => "(?, ?, ?)")
        .join(", ")}`,
      batch.flatMap((a) => [a.uuid, a.handle, a.pending]),
    );
  }

  await run(`UPDATE users SET legacy_username = username`);

  // Two steps, because the unique index is checked row by row: "King"
  // cannot become "king" while another row is still called "king". Every
  // row that changes first moves to a name nothing else can have.
  await run(
    `UPDATE users u SET username = '~' || u.uuid
       FROM handle_plan p
      WHERE p.uuid = u.uuid AND p.handle <> u.username`,
  );
  await run(
    `UPDATE users u SET username = p.handle, handle_pending = p.pending
       FROM handle_plan p
      WHERE p.uuid = u.uuid`,
  );

  // Old messages then show the sender's current handle, looked up by uuid.
  await run(
    `UPDATE messages SET "senderUsername" = NULL
      WHERE "senderUsername" IS NOT NULL AND "isSystem" IS NOT TRUE`,
  );

  const remaining = await scalar(`SELECT count(*) FROM users`, transaction);
  if (remaining !== users.length - plan.deletes.length) {
    throw new Error(
      `expected ${users.length - plan.deletes.length} accounts, found ${remaining}`,
    );
  }
  if (remaining !== plan.assignments.length) {
    throw new Error(
      `${remaining} accounts but ${plan.assignments.length} handles planned`,
    );
  }
  const invalid = await scalar(
    `SELECT count(*) FROM users WHERE NOT (${HANDLE_CHECK})`,
    transaction,
  );
  if (invalid)
    throw new Error(`${invalid} accounts ended with an invalid handle`);

  const admin = users.find((user) => user.username === ADMIN_HANDLE);
  if (admin) {
    const kept = await scalar(
      `SELECT count(*) FROM users WHERE uuid = :uuid AND username = :handle AND NOT handle_pending`,
      transaction,
      { uuid: admin.uuid, handle: ADMIN_HANDLE },
    );
    if (kept !== 1)
      throw new Error("the admin account did not keep its handle");
  }
}

async function main() {
  if (!orderFile)
    fail("pass --order <file> (see scripts/export-signup-order.js)");
  if (!fs.existsSync(orderFile)) fail(`${orderFile} does not exist`);

  const orderIndex = new Map(
    fs
      .readFileSync(orderFile, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((uuid, index) => [uuid, index]),
  );
  if (!orderIndex.size) fail(`${orderFile} lists no uuids`);

  const columns = await scalar(
    `SELECT count(*) FROM information_schema.columns
      WHERE table_name = 'users'
        AND column_name IN ('legacy_username', 'handle_pending', 'last_seen_at')`,
  );
  if (columns !== 3) fail("run scripts/add-handle-columns.js first");

  const migrated = await scalar(
    `SELECT count(*) FROM users WHERE legacy_username IS NOT NULL`,
  );
  if (migrated)
    fail(
      `${migrated} accounts already have a legacy username: this has run before`,
    );

  if (!apply) {
    const users = await loadUsers();
    const known = users.filter((user) => orderIndex.has(user.uuid)).length;
    console.log(
      `Dry run. ${known} of ${users.length} accounts are in the order file.`,
    );
    const plan = planHandles(users, orderIndex, { adminHandle: ADMIN_HANDLE });
    summarize(users, plan);
    writeReport(users, plan);
    console.log("Nothing was changed. Re-run with --apply to migrate.");
    return;
  }

  await sequelize.transaction(async (transaction) => {
    // Nobody signs up or is renamed underneath the plan.
    await sequelize.query(`LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE`, {
      transaction,
    });
    const users = await loadUsers(transaction);
    const plan = planHandles(users, orderIndex, { adminHandle: ADMIN_HANDLE });
    summarize(users, plan);
    writeReport(users, plan);
    await applyPlan(users, plan, transaction);
  });
  committed = true;

  await sequelize.query(
    `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_handle`,
  );
  await sequelize.query(
    `ALTER TABLE users ADD CONSTRAINT users_username_handle CHECK (${HANDLE_CHECK})`,
  );
  console.log(
    "Migrated. The database now refuses anything that is not a handle.",
  );
}

try {
  await main();
  await sequelize.close();
} catch (error) {
  console.error(
    committed
      ? "The accounts were migrated, but adding the handle constraint failed:"
      : "Handle migration failed; nothing was changed:",
    error,
  );
  process.exit(1);
}

// One-off import of the Worker's users (D1 export) and saves (KV export)
// into Postgres. Safe to re-run: users are matched by uuid and keep their
// existing password hash, saves are upserted.
//
//   node scripts/import-worker-data.js \
//     [--users migration-data/users.sql] [--saves migration-data/saves.ndjson] \
//     [--dry-run]
//
// Run `node setup-db.js` first so the users and user_saves tables exist.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { sequelize, User, UserSave } from "../models/index.js";
import { wrapLegacyHash } from "../utils/passwordHash.js";
import {
  findDuplicates,
  parseUsersExport,
  planUserImport,
} from "./lib/d1Export.js";
import { readNdjsonLines } from "./lib/ndjson.js";

const USER_BATCH_SIZE = 200;
const MAX_LISTED = 20;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const argValue = (flag, fallback) => {
  const index = args.indexOf(flag);
  return path.resolve(index === -1 ? fallback : args[index + 1]);
};
const usersFile = argValue("--users", "migration-data/users.sql");
const savesFile = argValue("--saves", "migration-data/saves.ndjson");

function listSome(values) {
  const shown = values.slice(0, MAX_LISTED).join(", ");
  return values.length > MAX_LISTED
    ? `${shown} ... and ${values.length - MAX_LISTED} more`
    : shown;
}

async function importUsers() {
  const rows = parseUsersExport(fs.readFileSync(usersFile, "utf8"));
  console.log(`Parsed ${rows.length} users from ${usersFile}`);

  const duplicates = findDuplicates(rows);
  if (duplicates.uuids.length || duplicates.usernames.length) {
    if (duplicates.uuids.length) {
      console.error(
        `Duplicate uuids (${duplicates.uuids.length}): ${listSome(duplicates.uuids)}`,
      );
    }
    if (duplicates.usernames.length) {
      console.error(
        `Duplicate usernames (${duplicates.usernames.length}): ${listSome(duplicates.usernames)}`,
      );
    }
    throw new Error(
      "The export has duplicates. Resolve them in D1 and export again; nothing was written.",
    );
  }

  const existingRows = await User.findAll({
    attributes: ["uuid", "username", "premium"],
    raw: true,
  });
  const existing = new Map(existingRows.map((row) => [row.uuid, row]));
  const plan = planUserImport(rows, existing);

  console.log(
    `Users: ${plan.toInsert.length} to insert, ${plan.toUpdate.length} to update, ${plan.unchanged} unchanged, ${plan.skipped.length} skipped`,
  );

  if (!dryRun) {
    const startedAt = Date.now();
    for (
      let start = 0;
      start < plan.toInsert.length;
      start += USER_BATCH_SIZE
    ) {
      const batch = plan.toInsert.slice(start, start + USER_BATCH_SIZE);
      const records = [];
      for (const row of batch) {
        records.push({
          uuid: row.uuid,
          username: row.username,
          password: await wrapLegacyHash(row.password),
          premium: row.premium,
        });
      }
      await User.bulkCreate(records);

      const done = start + batch.length;
      const perUser = (Date.now() - startedAt) / done;
      const minutesLeft = ((plan.toInsert.length - done) * perUser) / 60000;
      console.log(
        `  hashed and inserted ${done}/${plan.toInsert.length} (about ${minutesLeft.toFixed(1)} min left)`,
      );
    }

    for (const update of plan.toUpdate) {
      await User.update(
        { username: update.username, premium: update.premium },
        { where: { uuid: update.uuid } },
      );
    }
  }

  return { rows, plan };
}

async function importSaves(userUuids) {
  const report = { total: 0, upserted: 0, orphaned: 0, bytes: 0 };
  if (!fs.existsSync(savesFile)) {
    console.log(`No saves file at ${savesFile}; skipping saves.`);
    return null;
  }

  for await (const line of readNdjsonLines(savesFile)) {
    const { uuid, saveData } = JSON.parse(line);
    report.total += 1;
    report.bytes += Buffer.byteLength(saveData);
    if (!userUuids.has(uuid)) report.orphaned += 1;

    if (!dryRun) {
      await UserSave.upsert({ uuid, saveData });
      report.upserted += 1;
    }

    if (report.total % 1000 === 0) {
      console.log(`  processed ${report.total} saves`);
    }
  }

  return report;
}

async function main() {
  if (dryRun) console.log("Dry run: nothing will be written.\n");
  await sequelize.authenticate();

  const { rows, plan } = await importUsers();
  const saves = await importSaves(new Set(rows.map((row) => row.uuid)));

  console.log(`\nImport report${dryRun ? " (dry run)" : ""}`);
  console.log(`  users in export:        ${rows.length}`);
  console.log(`  users inserted:         ${plan.toInsert.length}`);
  console.log(`  users updated:          ${plan.toUpdate.length}`);
  console.log(`  users unchanged:        ${plan.unchanged}`);
  console.log(`  users skipped:          ${plan.skipped.length}`);
  for (const { row, reason } of plan.skipped.slice(0, MAX_LISTED)) {
    console.log(`    - ${row.uuid || "(no uuid)"} ${row.username}: ${reason}`);
  }
  if (plan.skipped.length > MAX_LISTED) {
    console.log(`    ... and ${plan.skipped.length - MAX_LISTED} more`);
  }

  if (saves) {
    console.log(`  saves in export:        ${saves.total}`);
    console.log(`  saves upserted:         ${saves.upserted}`);
    console.log(
      `  saves with no user:     ${saves.orphaned} (imported anyway)`,
    );
    console.log(
      `  save data size:         ${(saves.bytes / 1024 / 1024).toFixed(1)} MB`,
    );
  }

  if (!dryRun) {
    console.log(`  users now in Postgres:  ${await User.count()}`);
    console.log(`  saves now in Postgres:  ${await UserSave.count()}`);
  }
}

main()
  .then(() => sequelize.close())
  .catch(async (error) => {
    console.error("Import failed:", error.message || error);
    await sequelize.close().catch(() => {});
    process.exit(1);
  });

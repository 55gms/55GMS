// Writes the signup order the handle migration needs: one uuid per line, in
// the order the Worker export lists them (its insertion order). The output
// has no usernames and no password hashes, so it is the only part of the
// export that goes to the server.
//
//   node scripts/export-signup-order.js \
//     [--users migration-data/users.sql] [--out signup-order.txt]
import fs from "node:fs";
import path from "node:path";
import { parseUsersExport } from "./lib/d1Export.js";

const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const index = args.indexOf(flag);
  return path.resolve(index === -1 ? fallback : args[index + 1]);
};
const usersFile = argValue("--users", "migration-data/users.sql");
const outFile = argValue("--out", "signup-order.txt");

const rows = parseUsersExport(fs.readFileSync(usersFile, "utf8"));
const uuids = [...new Set(rows.map((row) => row.uuid).filter(Boolean))];
fs.writeFileSync(outFile, uuids.join("\n") + "\n");
console.log(`Wrote ${uuids.length} uuids to ${outFile}`);

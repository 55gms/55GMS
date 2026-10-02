import assert from "node:assert/strict";
import test from "node:test";
import {
  findDuplicates,
  parseUsersExport,
  planUserImport,
} from "../scripts/lib/d1Export.js";

const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);

test("parses sqlite-style dumps using the CREATE TABLE column order", () => {
  const sql = `PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  email VARCHAR(255),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  premium BOOLEAN DEFAULT false,
  UNIQUE (username)
);
INSERT INTO users VALUES(1,'uuid-1',NULL,'alpha','${HASH_A}',0);
INSERT INTO "users" VALUES(2,'uuid-2','b@example.com','o''brien','${HASH_B}',1);
INSERT INTO other VALUES(1,'ignored');
`;

  assert.deepEqual(parseUsersExport(sql), [
    { uuid: "uuid-1", username: "alpha", password: HASH_A, premium: false },
    { uuid: "uuid-2", username: "o'brien", password: HASH_B, premium: true },
  ]);
});

test("parses inserts with an explicit column list and several tuples", () => {
  const sql = `INSERT INTO "users" ("username","uuid","premium","password") VALUES
  ('a, (tricky) name','uuid-1','true','${HASH_A}'),
  ('beta','uuid-2','false','${HASH_B}');`;

  assert.deepEqual(parseUsersExport(sql), [
    {
      uuid: "uuid-1",
      username: "a, (tricky) name",
      password: HASH_A,
      premium: true,
    },
    { uuid: "uuid-2", username: "beta", password: HASH_B, premium: false },
  ]);
});

test("falls back to the Worker's column order without a CREATE TABLE", () => {
  const sql = `INSERT INTO users VALUES('uuid-1','alpha','${HASH_A}',1);`;

  assert.deepEqual(parseUsersExport(sql), [
    { uuid: "uuid-1", username: "alpha", password: HASH_A, premium: true },
  ]);
});

test("rejects a row whose value count does not match the columns", () => {
  assert.throws(
    () => parseUsersExport(`INSERT INTO users VALUES('uuid-1','alpha');`),
    /2 values but 4 columns/,
  );
});

test("findDuplicates reports repeated uuids and usernames", () => {
  const rows = [
    { uuid: "1", username: "alpha" },
    { uuid: "2", username: "alpha" },
    { uuid: "2", username: "beta" },
    { uuid: "3", username: "Alpha" },
  ];

  assert.deepEqual(findDuplicates(rows), {
    uuids: ["2"],
    usernames: ["alpha"],
  });
});

test("planUserImport inserts new rows and never re-hashes existing ones", () => {
  const rows = [
    { uuid: "new", username: "new-user", password: HASH_A, premium: false },
    { uuid: "same", username: "same", password: HASH_A, premium: true },
    { uuid: "renamed", username: "after", password: HASH_A, premium: false },
    { uuid: "upgraded", username: "up", password: HASH_A, premium: true },
    {
      uuid: "bad-hash",
      username: "bad",
      password: "plaintext",
      premium: false,
    },
    { uuid: "", username: "no-uuid", password: HASH_A, premium: false },
  ];
  const existing = new Map([
    ["same", { username: "same", premium: true }],
    ["renamed", { username: "before", premium: false }],
    ["upgraded", { username: "up", premium: false }],
  ]);

  const plan = planUserImport(rows, existing);

  assert.deepEqual(
    plan.toInsert.map((row) => row.uuid),
    ["new"],
  );
  assert.deepEqual(plan.toUpdate, [
    { uuid: "renamed", username: "after", premium: false },
    { uuid: "upgraded", username: "up", premium: true },
  ]);
  assert.equal(plan.unchanged, 1);
  assert.deepEqual(
    plan.skipped.map((entry) => [entry.row.username, entry.reason]),
    [
      ["bad", "password is not a SHA-256 hex hash"],
      ["no-uuid", "missing uuid or username"],
    ],
  );
});

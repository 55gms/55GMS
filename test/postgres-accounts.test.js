import assert from "node:assert/strict";
import test from "node:test";
import { createPostgresAccounts } from "../services/postgresAccounts.js";

// Plain-text stand-ins so the tests don't pay for bcrypt.
const passwords = {
  async hashPassword(plain) {
    return `hashed:${plain}`;
  },
  async verifyPassword(plain, stored) {
    return stored === `hashed:${plain}`;
  },
};

function createStubModels() {
  const users = new Map();
  const saves = new Map();

  const User = {
    async create(row) {
      for (const user of users.values()) {
        if (user.username === row.username) {
          throw new Error("Validation error");
        }
      }
      users.set(row.uuid, { ...row });
      return users.get(row.uuid);
    },
    async findOne({ where }) {
      for (const user of users.values()) {
        if (user.username === where.username) return user;
      }
      return null;
    },
    async findByPk(uuid) {
      return users.get(uuid) || null;
    },
  };

  const UserSave = {
    async upsert(row) {
      saves.set(row.uuid, { ...row });
    },
    async findByPk(uuid) {
      return saves.get(uuid) || null;
    },
  };

  return { User, UserSave, users, saves };
}

function createAccounts() {
  const models = createStubModels();
  return {
    ...models,
    accounts: createPostgresAccounts({ ...models, passwords }),
  };
}

test("createUser stores a hashed password and never grants premium", async () => {
  const { accounts, users } = createAccounts();

  const user = await accounts.createUser({
    username: "alpha",
    password: "secret1",
    premium: true,
  });

  assert.deepEqual(Object.keys(user).sort(), ["premium", "username", "uuid"]);
  assert.equal(user.username, "alpha");
  assert.equal(user.premium, false);
  assert.match(user.uuid, /^[0-9a-f-]{36}$/);
  assert.equal(users.get(user.uuid).password, "hashed:secret1");
});

test("createUser enforces the username length limits", async () => {
  const { accounts } = createAccounts();

  await assert.rejects(
    accounts.createUser({ username: "ab", password: "secret1" }),
    /too Short/,
  );
  await assert.rejects(
    accounts.createUser({ username: "a".repeat(17), password: "secret1" }),
    /Too Long/,
  );
});

test("createUser rejects a taken username", async () => {
  const { accounts } = createAccounts();

  await accounts.createUser({ username: "alpha", password: "secret1" });
  await assert.rejects(
    accounts.createUser({ username: "alpha", password: "secret2" }),
  );
});

test("verifyLogin returns the user only for the right password", async () => {
  const { accounts } = createAccounts();
  const created = await accounts.createUser({
    username: "alpha",
    password: "secret1",
  });

  assert.deepEqual(
    await accounts.verifyLogin({ username: "alpha", password: "secret1" }),
    { uuid: created.uuid, username: "alpha", premium: false, success: true },
  );
  assert.equal(
    await accounts.verifyLogin({ username: "alpha", password: "wrong" }),
    null,
  );
  assert.equal(
    await accounts.verifyLogin({ username: "nobody", password: "secret1" }),
    null,
  );
  assert.equal(
    await accounts.verifyLogin({ username: { $ne: "" }, password: "x" }),
    null,
  );
});

test("user lookups never expose the password hash", async () => {
  const { accounts } = createAccounts();
  const created = await accounts.createUser({
    username: "alpha",
    password: "secret1",
  });
  const expected = { uuid: created.uuid, username: "alpha", premium: false };

  assert.deepEqual(await accounts.getUserByUuid(created.uuid), expected);
  assert.deepEqual(await accounts.getUserByUsername("alpha"), expected);
  assert.equal(await accounts.getUserByUuid("missing"), null);
  assert.equal(await accounts.getUserByUsername("missing"), null);
});

test("isPremium reports the stored flag or null for an unknown user", async () => {
  const { accounts, users } = createAccounts();
  const created = await accounts.createUser({
    username: "alpha",
    password: "secret1",
  });

  assert.deepEqual(await accounts.isPremium(created.uuid), { premium: false });

  users.get(created.uuid).premium = true;
  assert.deepEqual(await accounts.isPremium(created.uuid), { premium: true });
  assert.equal(await accounts.isPremium("missing"), null);
});

test("saves round-trip as a JSON string and overwrite by uuid", async () => {
  const { accounts } = createAccounts();

  assert.equal(await accounts.readSave("user-1"), null);
  assert.deepEqual(await accounts.writeSave("user-1", { level: 1 }), {
    success: true,
    uuid: "user-1",
  });
  await accounts.writeSave("user-1", { level: 2, items: ["a"] });

  assert.equal(
    await accounts.readSave("user-1"),
    JSON.stringify({ level: 2, items: ["a"] }),
  );
});

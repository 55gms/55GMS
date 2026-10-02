import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createAuthRouter } from "../routes/auth.js";
import { createUsersRouter } from "../routes/users.js";

async function withServer(accounts, run, { captchaPasses = true } = {}) {
  const app = express();
  app.use(express.json());
  app.use(
    "/api",
    createAuthRouter({ accounts, verifyCaptcha: async () => captchaPasses }),
  );
  app.use("/api", createUsersRouter({ accounts }));

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const post = async (path, body, headers = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  };

  try {
    await run(post);
  } finally {
    delete process.env.ACCOUNT_WRITES_FROZEN;
    await new Promise((resolve) => server.close(resolve));
  }
}

const signUpBody = {
  username: "alpha",
  password: "secret1",
  captchaResponse: "token",
};

test("signUp returns the created user and ignores client-sent premium", async () => {
  let received;
  const accounts = {
    async createUser(input) {
      received = input;
      return { uuid: "user-1", username: input.username, premium: false };
    },
  };

  await withServer(accounts, async (post) => {
    const response = await post("/api/signUp", {
      ...signUpBody,
      premium: true,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
      uuid: "user-1",
      username: "alpha",
      premium: false,
    });
    assert.deepEqual(received, { username: "alpha", password: "secret1" });
  });
});

test("signUp validates input and the captcha before creating a user", async () => {
  let created = 0;
  const accounts = {
    async createUser() {
      created += 1;
      return {};
    },
  };

  await withServer(
    accounts,
    async (post) => {
      assert.equal(
        (await post("/api/signUp", { username: "alpha" })).status,
        400,
      );
      assert.deepEqual(
        (await post("/api/signUp", { ...signUpBody, password: "short" })).body,
        { error: "Password too short" },
      );
      assert.deepEqual(
        (await post("/api/signUp", { ...signUpBody, username: "ab" })).body,
        { error: "Username too short" },
      );

      const response = await post("/api/signUp", signUpBody);
      assert.equal(response.status, 400);
      assert.deepEqual(response.body, { error: "Invalid CAPTCHA" });
      assert.equal(created, 0);
    },
    { captchaPasses: false },
  );
});

test("signUp answers 500 with a generic error when creation fails", async () => {
  const accounts = {
    async createUser() {
      throw new Error("Validation error");
    },
  };

  await withServer(accounts, async (post) => {
    const response = await post("/api/signUp", signUpBody);

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      error: "An error occurred while processing your request.",
    });
  });
});

test("login returns the user, or 500 for bad credentials", async () => {
  const accounts = {
    async verifyLogin({ password }) {
      return password === "secret1"
        ? { uuid: "user-1", username: "alpha", premium: false, success: true }
        : null;
    },
  };

  await withServer(accounts, async (post) => {
    const ok = await post("/api/login", {
      username: "alpha",
      password: "secret1",
    });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.success, true);
    assert.equal(ok.body.uuid, "user-1");

    const bad = await post("/api/login", {
      username: "alpha",
      password: "nope",
    });
    assert.equal(bad.status, 500);
    assert.deepEqual(bad.body, { error: "Invalid Email or password" });

    assert.equal((await post("/api/login", { username: "alpha" })).status, 400);
  });
});

test("checkPremium returns the flag, or 500 for an unknown user", async () => {
  const accounts = {
    async isPremium(uuid) {
      return uuid === "user-1" ? { premium: true } : null;
    },
  };

  await withServer(accounts, async (post) => {
    const ok = await post("/api/checkPremium", { uuid: "user-1" });
    assert.equal(ok.status, 200);
    assert.deepEqual(ok.body, { premium: true });

    assert.equal(
      (await post("/api/checkPremium", { uuid: "nope" })).status,
      500,
    );
    assert.equal((await post("/api/checkPremium", {})).status, 400);
  });
});

test("uploadSave stores the body under the uuid header and readSave returns it", async () => {
  const saves = new Map();
  const accounts = {
    async writeSave(uuid, saveData) {
      saves.set(uuid, JSON.stringify(saveData));
      return { success: true, uuid };
    },
    async readSave(uuid) {
      return saves.get(uuid) ?? null;
    },
  };

  await withServer(accounts, async (post) => {
    const save = { cookies: "a=b", localStorage: { level: "3" } };

    const upload = await post("/api/uploadSave", save, { uuid: "user-1" });
    assert.equal(upload.status, 200);
    assert.deepEqual(upload.body, { success: true, uuid: "user-1" });
    assert.equal((await post("/api/uploadSave", save)).status, 400);

    const read = await post("/api/readSave", { uuid: "user-1" });
    assert.equal(read.status, 200);
    assert.deepEqual(read.body, save);

    assert.equal((await post("/api/readSave", { uuid: "nobody" })).status, 500);
    assert.equal((await post("/api/readSave", {})).status, 400);
  });
});

test("signUp and uploadSave answer 503 while account writes are frozen", async () => {
  let writes = 0;
  const accounts = {
    async createUser() {
      writes += 1;
      return {};
    },
    async writeSave() {
      writes += 1;
      return {};
    },
    async verifyLogin() {
      return {
        uuid: "user-1",
        username: "alpha",
        premium: false,
        success: true,
      };
    },
    async readSave() {
      return "{}";
    },
  };

  await withServer(accounts, async (post) => {
    process.env.ACCOUNT_WRITES_FROZEN = "true";

    assert.equal((await post("/api/signUp", signUpBody)).status, 503);
    assert.equal(
      (await post("/api/uploadSave", { a: 1 }, { uuid: "user-1" })).status,
      503,
    );
    assert.equal(writes, 0);

    // Reads keep working during the freeze.
    assert.equal(
      (await post("/api/login", { username: "alpha", password: "x" })).status,
      200,
    );
    assert.equal((await post("/api/readSave", { uuid: "user-1" })).status, 200);
  });
});

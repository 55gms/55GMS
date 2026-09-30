import assert from "node:assert/strict";
import test from "node:test";
import { UserCache } from "../utils/userCache.js";

test("getUserByUuid shares simultaneous pending lookups for one uuid", async () => {
  delete process.env.REDIS_URL;

  let requestCount = 0;
  let resolveLookup;
  const lookupResponse = new Promise((resolve) => {
    resolveLookup = resolve;
  });
  const cache = new UserCache({
    async get() {
      requestCount += 1;
      return lookupResponse;
    },
  });

  const lookups = [
    cache.getUserByUuid("user-1"),
    cache.getUserByUuid("user-1"),
    cache.getUserByUuid("user-1"),
  ];

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requestCount, 1);

  resolveLookup({ data: { uuid: "user-1", username: "alpha" } });

  const results = await Promise.all(lookups);
  assert.deepEqual(
    results.map((user) => user.username),
    ["alpha", "alpha", "alpha"],
  );
});

test("getUserByUuid returns stale cached data when refresh fails", async () => {
  delete process.env.REDIS_URL;

  const cache = new UserCache({
    async get() {
      throw new Error("network unavailable");
    },
  });
  cache.cacheTimeout = 1;
  cache.cache.set("user-2", {
    data: { uuid: "user-2", username: "stale" },
    timestamp: Date.now() - 1000,
  });

  const result = await cache.getUserByUuid("user-2");

  assert.equal(result.username, "stale");
});

test("getUserByUuid serves fresh in-memory entries without refetching", async () => {
  delete process.env.REDIS_URL;

  let requestCount = 0;
  const cache = new UserCache({
    async get() {
      requestCount += 1;
      return { data: { uuid: "user-3", username: "fresh" } };
    },
  });

  await cache.getUserByUuid("user-3");
  const result = await cache.getUserByUuid("user-3");

  assert.equal(result.username, "fresh");
  assert.equal(requestCount, 1);
});

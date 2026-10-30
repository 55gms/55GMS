import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { createLinksRouter, parseLinkUrls } from "../routes/links.js";

const grant = {
  id: "d3cfeab3-86d6-42c2-90d1-e0ed4819fbee",
  signature: "a".repeat(43),
};
async function withApi(options, run) {
  const app = express();
  app.use(express.json());
  app.use(
    "/api/links",
    createLinksRouter({
      urls: ["https://one.example/", "https://two.example/"],
      adServerUrl: "https://ads.example",
      apiKey: "test-key",
      randomIndex: () => 0,
      ...options,
    }),
  );
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/links`;
  const post = (body) =>
    fetch(url + "/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(3000),
    });
  try {
    await run({ url, post });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}
const verified = () =>
  Response.json({ redeemed: true, gameId: "links", rewardId: "site-link" });

test("configuration accepts deduplicated HTTPS URLs and rejects malformed pools", () => {
  assert.deepEqual(
    parseLinkUrls('["https://one.example","https://one.example/"]'),
    ["https://one.example/"],
  );
  for (const value of [
    "oops",
    "{}",
    '["http://example.com"]',
    '["javascript:alert(1)"]',
    '["https://u:p@example.com"]',
  ]) {
    assert.throws(() => parseLinkUrls(value));
  }
  assert.deepEqual(parseLinkUrls(undefined), []);
});
test("status exposes counts only and disables an unconfigured pool", async () => {
  await withApi({}, async ({ url }) => {
    const response = await fetch(url);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.deepEqual(await response.json(), { available: true, total: 2 });
  });
  await withApi({ urls: [] }, async ({ url, post }) => {
    assert.deepEqual(await (await fetch(url)).json(), {
      available: false,
      total: 0,
    });
    assert.equal((await post({ grant })).status, 503);
  });
});
test("missing credentials fail closed", async () => {
  await withApi({ apiKey: "" }, async ({ post }) =>
    assert.equal((await post({ grant })).status, 503),
  );
});
test("missing/forged payloads never contact the ad server", async () => {
  await withApi(
    { fetch: () => assert.fail("must not verify malformed grants") },
    async ({ post }) => {
      for (const body of [
        {},
        { grant: { id: "fake", signature: "fake" } },
        { grant: { id: { toString: 1 }, signature: "a".repeat(43) } },
        { grant, used: "bad" },
        { grant, used: Array(501).fill("x") },
      ]) {
        assert.equal((await post(body)).status, 400);
      }
    },
  );
});
test("a verified reward returns exactly one random unused destination", async () => {
  let calls = 0;
  await withApi(
    {
      fetch: async (url, options) => {
        calls++;
        assert.equal(url, "https://ads.example/api/v1/rewards/redeem");
        assert.equal(options.headers.authorization, "Bearer test-key");
        assert.deepEqual(JSON.parse(options.body), {
          grantId:
            calls === 1 ? grant.id : "84f839e8-f116-4c49-a6a1-12d537bde0f3",
          signature: grant.signature,
        });
        assert.equal(options.redirect, "error");
        return verified();
      },
    },
    async ({ post }) => {
      const first = await (await post({ grant, used: [] })).json();
      assert.equal(first.link.url, "https://one.example/");
      assert.equal(first.remaining, 1);
      const second = await (
        await post({
          grant: { ...grant, id: "84f839e8-f116-4c49-a6a1-12d537bde0f3" },
          used: [first.link.id],
        })
      ).json();
      assert.equal(second.link.url, "https://two.example/");
      assert.equal(second.remaining, 0);
      assert.equal(calls, 2);
    },
  );
});
test("replayed grants reveal nothing", async () => {
  let count = 0;
  await withApi(
    {
      fetch: async () =>
        ++count === 1
          ? verified()
          : Response.json({ redeemed: false, reason: "already_redeemed" }),
    },
    async ({ post }) => {
      assert.equal((await post({ grant })).status, 200);
      const replay = await post({ grant });
      assert.equal(replay.status, 403);
      assert.equal((await replay.json()).link, undefined);
    },
  );
});
test("unrelated and forged rewards never reveal a link", async () => {
  for (const reply of [
    Response.json({ redeemed: true, gameId: "other", rewardId: "site-link" }),
    Response.json({ redeemed: true, gameId: "links", rewardId: "coins" }),
    Response.json({ error: "unknown_grant" }, { status: 404 }),
  ]) {
    await withApi({ fetch: async () => reply }, async ({ post }) => {
      const response = await post({ grant });
      assert.equal(response.status, 403);
      assert.equal((await response.json()).link, undefined);
    });
  }
});
test("exhaustion does not consume another reward", async () => {
  await withApi(
    { urls: ["https://one.example/"], fetch: verified },
    async ({ post }) => {
      const first = await (await post({ grant })).json();
      assert.equal((await post({ grant, used: [first.link.id] })).status, 409);
    },
  );
});
test("timeouts and upstream failures fail closed", async () => {
  for (const request of [
    async () => {
      throw new Error("timeout");
    },
    async () => Response.json({}, { status: 503 }),
    async () => new Response("bad json"),
  ]) {
    await withApi({ fetch: request }, async ({ post }) => {
      const response = await post({ grant });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).link, undefined);
    });
  }
});

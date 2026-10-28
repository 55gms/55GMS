// Run with CHROMIUM_PATH=/usr/bin/chromium node --test tests/links-browser.mjs.
// Ad outcomes are simulated: this exercises the real page, API and SDK call
// contract without generating ad impressions or spending campaign budgets.
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { chromium } from "playwright-core";
import { createLinksRouter } from "../routes/links.js";

const app = express();
app.use(express.json());
app.use(
  "/api/links",
  createLinksRouter({
    urls: ["https://one.example/", "https://two.example/"],
    adServerUrl: "https://ads.example",
    apiKey: "test-key",
    fetch: async () =>
      Response.json({ redeemed: true, gameId: "links", rewardId: "site-link" }),
  }),
);
app.use(
  express.static(process.env.LINKS_STATIC_ROOT || "static", {
    extensions: ["html"],
  }),
);
const server = app.listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  await test("rewarded links page", async (t) => {
    async function pageFor(result, { sdkFailure = false, adDelay = 100 } = {}) {
      const page = await browser.newPage();
      page.setDefaultTimeout(3000);
      await page.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === base) return route.continue();
        if (url.pathname.endsWith("/video.min.js")) {
          if (sdkFailure) return route.abort();
          const source = `window.__gmsAdsVideo={host(endpoint){window.sdkEndpoint=endpoint;return {async show(options){window.sdkCalls=(window.sdkCalls||0)+1;window.sdkOptions=options;await new Promise(r=>setTimeout(r,${adDelay}));return ${JSON.stringify(result)};}}}};`;
          // SRI is checked by the browser; the fixture route strips it on the
          // page only so a simulated SDK can stand in for the pinned vendor.
          return route.fulfill({
            contentType: "application/javascript",
            body: source,
            headers: { "access-control-allow-origin": "*" },
          });
        }
        return route.fulfill({ status: 200, body: "" });
      });
      await page.addInitScript(() => {
        const append = HTMLHeadElement.prototype.appendChild;
        HTMLHeadElement.prototype.appendChild = function (child) {
          if (child.src?.includes("/video.min.js"))
            child.removeAttribute("integrity");
          return append.call(this, child);
        };
      });
      await page.goto(base + "/links");
      await page.waitForFunction(
        () =>
          document.querySelector("#watchAd") &&
          !document.querySelector("#watchAd").disabled,
      );
      return page;
    }
    const grant = {
      id: "d3cfeab3-86d6-42c2-90d1-e0ed4819fbee",
      signature: "a".repeat(43),
    };
    await t.test(
      "reveals unused links, blocks parallel clicks, exhausts and resets on reload",
      async () => {
        const page = await pageFor({
          status: "granted",
          rewardGranted: true,
          grant,
        });
        await page.locator("#watchAd").click();
        assert.equal(await page.locator("#watchAd").isDisabled(), true);
        await page.waitForFunction(
          () => document.querySelectorAll("#revealedLinks a").length === 1,
        );
        assert.equal(
          await page.evaluate(() => window.sdkEndpoint),
          "/api/_ads",
        );
        assert.deepEqual(
          await page.evaluate(() => ({
            format: sdkOptions.format,
            gameId: sdkOptions.gameId,
            rewardId: sdkOptions.rewardId,
          })),
          { format: "video_rewarded", gameId: "links", rewardId: "site-link" },
        );
        await page.locator("#watchAd").click();
        await page.waitForFunction(
          () => document.querySelectorAll("#revealedLinks a").length === 2,
        );
        const links = await page
          .locator("#revealedLinks a")
          .evaluateAll((els) => els.map((el) => el.href));
        assert.equal(new Set(links).size, 2);
        assert.equal(await page.locator("#watchAd").isDisabled(), true);
        assert.equal(await page.evaluate(() => window.sdkCalls), 2);
        await page
          .context()
          .grantPermissions(["clipboard-read", "clipboard-write"], {
            origin: base,
          });
        await page.locator(".links-copy").first().click();
        assert.ok(
          links.includes(
            await page.evaluate(() => navigator.clipboard.readText()),
          ),
        );
        await page.screenshot({
          path: "/tmp/55gms-links-desktop.png",
          fullPage: true,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({
          path: "/tmp/55gms-links-mobile.png",
          fullPage: true,
        });
        await page.reload();
        await page.waitForFunction(
          () => !document.querySelector("#watchAd").disabled,
        );
        assert.equal(await page.locator("#revealedLinks a").count(), 0);
        for (const width of [390, 1366]) {
          await page.setViewportSize({ width, height: 844 });
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
          );
        }
        await page.close();
      },
    );
    await t.test(
      "delayed consent or paused playback still unlocks on completion",
      async () => {
        const page = await pageFor(
          { status: "granted", rewardGranted: true, grant },
          { adDelay: 190000 },
        );
        await page.clock.install();
        await page.locator("#watchAd").click();
        await page.waitForFunction(() => window.sdkCalls === 1);
        await page.clock.fastForward(181000);
        assert.equal(await page.locator("#watchAd").isDisabled(), true);
        await page.clock.fastForward(10000);
        await page.waitForFunction(
          () => document.querySelectorAll("#revealedLinks a").length === 1,
        );
        await page.close();
      },
    );
    for (const result of [
      { status: "cancelled" },
      { status: "skipped" },
      { status: "no_fill" },
      { status: "error" },
      { status: "granted", rewardGranted: true, grant: null },
      { status: "completed", rewardGranted: false },
    ]) {
      await t.test(`no reveal for ${JSON.stringify(result)}`, async () => {
        const page = await pageFor(result);
        await page.locator("#watchAd").click();
        await page.waitForFunction(
          () => !document.querySelector("#watchAd").disabled,
        );
        assert.equal(await page.locator("#revealedLinks a").count(), 0);
        assert.ok(await page.locator("#linksStatus").textContent());
        await page.close();
      });
    }
    await t.test("SDK failure allows retry without revealing", async () => {
      const page = await pageFor({}, { sdkFailure: true });
      await page.locator("#watchAd").click();
      await page.waitForFunction(
        () => !document.querySelector("#watchAd").disabled,
      );
      assert.equal(await page.locator("#revealedLinks a").count(), 0);
      await page.close();
    });
    await t.test("API failure keeps the pool locked", async () => {
      const page = await pageFor({
        status: "granted",
        rewardGranted: true,
        grant,
      });
      await page.route("**/api/links/reveal", (r) =>
        r.fulfill({
          status: 503,
          contentType: "application/json",
          body: '{"error":"Reward verification is unavailable."}',
        }),
      );
      await page.locator("#watchAd").click();
      await page.waitForFunction(
        () => !document.querySelector("#watchAd").disabled,
      );
      assert.equal(await page.locator("#revealedLinks a").count(), 0);
      await page.close();
    });
  });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

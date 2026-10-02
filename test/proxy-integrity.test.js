import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

// Exercise the same core/controller bundles used by embed.html without a browser.
globalThis.self = globalThis;
globalThis.location = new URL("https://55gms.test/embed.html");
for (const file of [
  "../node_modules/@mercuryworkshop/scramjet/dist/scramjet.js",
  "../node_modules/@mercuryworkshop/scramjet-controller/dist/controller.api.js",
]) {
  vm.runInThisContext(readFileSync(new URL(file, import.meta.url), "utf8"));
}
globalThis.window = globalThis;
globalThis.$scramjetUtils = { HttpCachePlugin: class {} };
globalThis.EpoxyTransport = { default: class {} };
vm.runInThisContext(
  readFileSync(
    new URL("../static/assets/js/frame-runtime.js", import.meta.url),
    "utf8",
  ),
);

function createHandler(link) {
  const context = {
    config: $scramjet.defaultConfig,
    prefix: new URL("https://55gms.test/~/sj/test/"),
    interface: {
      codecEncode: encodeURIComponent,
      codecDecode: decodeURIComponent,
      getInjectScripts: () => [],
    },
    cookieJar: new $scramjet.CookieJar(),
  };
  const handler = new $scramjet.ScramjetFetchHandler({
    context,
    transport: {
      init: async () => {},
      request: async () =>
        $scramjet.BareResponse.fromNativeResponse(
          new Response(
            '<!doctype html><html><head><link rel="stylesheet" href="https://cdn.example.com/style.css" integrity="sha384-original"></head><body></body></html>',
            {
              headers: {
                "content-type": "text/html",
                ...(link ? { link } : {}),
              },
            },
          ),
        ),
    },
    sendSetCookie: async () => {},
  });
  const request = {
    rawUrl: new URL(
      context.prefix.href + encodeURIComponent("https://canary.discord.com/"),
    ),
    rawReferrer: null,
    rawDestination: "document",
    mode: "navigate",
    referrer: "",
    method: "GET",
    body: null,
    cache: "default",
    initialHeaders: new $scramjet.ScramjetHeaders(),
    clientId: "test",
  };
  const install = () =>
    new frameRuntime.ResourceIntegrityPlugin().install({
      fetchHandler: handler,
      hooks: { fetch: handler.hooks.fetch },
    });
  return { fetch: () => handler.handleFetch({ ...request }), install };
}

test("rewritten stylesheet preloads drop the original integrity hash", async () => {
  const pipeline = createHandler(
    '<https://cdn.example.com/style.css>; rel=preload; as=style; crossorigin; integrity="sha384-original"',
  );
  const before = await pipeline.fetch();
  assert.match(before.headers.get("link"), /integrity="sha384-original"/);

  pipeline.install();
  const after = await pipeline.fetch();
  assert.equal(
    after.headers.get("link"),
    before.headers.get("link").replace('; integrity="sha384-original"', ""),
  );
  assert.match(after.headers.get("link"), /55gms\.test\/~\/sj\/test\//);
  assert.match(after.body, /integrity(?:\s|>)/);
  assert.doesNotMatch(after.body, /\sintegrity="sha384-original"/);
});

test("multiple preload hashes are removed without changing other link parameters", async () => {
  const pipeline = createHandler(
    '<https://cdn.example.com/style.css>; rel=preload; INTEGRITY = "sha384-one"; as=style; title="keep; integrity=example, text", <https://cdn.example.com/main.js>; rel=modulepreload; integrity=sha256-two, <https://cdn.example.com>; rel=preconnect; crossorigin',
  );
  const before = await pipeline.fetch();
  pipeline.install();
  const after = await pipeline.fetch();
  assert.equal(
    after.headers.get("link"),
    before.headers
      .get("link")
      .replace('; INTEGRITY = "sha384-one"', "")
      .replace("; integrity=sha256-two", ""),
  );
});

test("responses without preload hashes keep their headers and body", async () => {
  for (const link of [undefined, "<https://cdn.example.com>; rel=preconnect"]) {
    const pipeline = createHandler(link);
    const before = await pipeline.fetch();
    pipeline.install();
    const after = await pipeline.fetch();
    assert.equal(after.headers.get("link"), before.headers.get("link"));
    assert.equal(after.body, before.body);
  }
});

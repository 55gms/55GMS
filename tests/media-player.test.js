import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const sources = await Promise.all(
  ["player", "watchmovie", "watchtv"].map((name) =>
    readFile(
      new URL(`../static/misc/media/js/${name}.js`, import.meta.url),
      "utf8",
    ),
  ),
);

function watchPage(search, fetch) {
  const elements = new Map();
  function element() {
    const listeners = {};
    const classes = new Set();
    const item = {
      dataset: {},
      children: [],
      value: "",
      src: "",
      textContent: "",
      addEventListener(type, callback) {
        listeners[type] = callback;
      },
      trigger(type) {
        return listeners[type]?.();
      },
      appendChild(child) {
        this.children.push(child);
      },
      classList: {
        add(name) {
          classes.add(name);
        },
        toggle(name, enabled) {
          enabled ? classes.add(name) : classes.delete(name);
        },
        contains(name) {
          return classes.has(name);
        },
      },
    };
    Object.defineProperty(item, "innerHTML", {
      set() {
        this.children = [];
      },
    });
    item.contentWindow = {
      location: {
        replace(url) {
          item.src = url;
        },
      },
    };
    return item;
  }
  const events = {};
  const location = {
    href: `https://55gms.test/misc/media/tv.html${search}`,
    search,
  };
  const context = vm.createContext({
    URL,
    URLSearchParams,
    AbortSignal,
    fetch,
    console: { error() {}, log() {} },
    location,
    addEventListener(type, callback) {
      events[type] = callback;
    },
    document: {
      addEventListener(type, callback) {
        events[type] = callback;
      },
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, element());
        return elements.get(id);
      },
      createElement: element,
      querySelectorAll() {
        return elements.get("episodeList")?.children || [];
      },
    },
    history: {
      pushState(state, title, url) {
        location.href = url.href;
        location.search = url.search;
      },
    },
  });
  context.window = context;
  vm.runInContext(sources[0], context);
  return { context, events, elements, location };
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
const json = (value) => ({ ok: true, json: async () => value });
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("movie starts while metadata is still pending, and survives metadata failure", async () => {
  const metadata = deferred();
  const page = watchPage("?id=550", () => metadata.promise);
  vm.runInContext(sources[1], page.context);
  const loading = page.events.DOMContentLoaded();
  assert.equal(
    page.elements.get("iframe").src,
    "/embed.html#https://vidsrc.party/embed/movie/550",
  );
  metadata.resolve({ ok: false, status: 503 });
  await loading;
  assert.equal(page.elements.get("iframe").dataset.playerMounted, "true");
});

test("TV defaults start immediately and metadata requests run in parallel", async () => {
  const requests = [];
  const page = watchPage("?id=1399", (url) => {
    requests.push(url);
    return new Promise(() => {});
  });
  vm.runInContext(sources[2], page.context);
  page.events.DOMContentLoaded();
  assert.equal(
    page.elements.get("iframe").src,
    "/embed.html#https://vidsrc.party/embed/tv/1399/1/1",
  );
  assert.equal(page.location.search, "?id=1399");
  assert.equal(requests.length, 2);
  assert.ok(requests.every((url) => url.startsWith("/api/music/url=")));
});

test("TV episode changes reuse the embed and Back restores selection", async () => {
  const page = watchPage("?id=1399&s=2&e=1", async (url) =>
    json(
      decodeURIComponent(url).includes("/season/")
        ? {
            episodes: [
              { episode_number: 1, name: "First" },
              { episode_number: 2, name: "Second" },
            ],
          }
        : {
            seasons: [
              { season_number: 1, name: "Season 1" },
              { season_number: 2, name: "Season 2" },
            ],
          },
    ),
  );
  vm.runInContext(sources[2], page.context);
  await page.events.DOMContentLoaded();
  await tick();
  const iframe = page.elements.get("iframe");
  let replacements = 0;
  iframe.contentWindow.location.replace = (url) => {
    replacements++;
    iframe.src = url;
  };
  page.elements.get("episodeList").children[1].trigger("click");
  assert.match(page.location.search, /s=2&e=2/);
  assert.match(iframe.src, /1399\/2\/2\?title=false$/);
  assert.equal(replacements, 1);
  assert.equal(
    page.elements.get("episodeList").children[1].classList.contains("active"),
    true,
  );
  page.location.search = "?id=1399&s=2&e=1";
  page.events.popstate();
  assert.match(iframe.src, /1399\/2\/1\?title=false$/);
  assert.equal(
    page.elements.get("episodeList").children[0].classList.contains("active"),
    true,
  );
});

test("late season metadata cannot overwrite a newer season selection", async () => {
  const oldSeason = deferred();
  const page = watchPage("?id=1399", async (url) => {
    const decoded = decodeURIComponent(url);
    if (decoded.includes("/season/1")) return oldSeason.promise;
    if (decoded.includes("/season/2"))
      return json({ episodes: [{ episode_number: 1, name: "New season" }] });
    return json({
      seasons: [
        { season_number: 1, name: "Season 1" },
        { season_number: 2, name: "Season 2" },
      ],
    });
  });
  vm.runInContext(sources[2], page.context);
  await page.events.DOMContentLoaded();
  const selector = page.elements.get("seasonSelector");
  selector.value = "2";
  selector.trigger("change");
  await tick();
  oldSeason.resolve(
    json({ episodes: [{ episode_number: 1, name: "Old season" }] }),
  );
  await tick();
  assert.equal(
    page.elements.get("episodeList").children[0].textContent,
    "Episode 1: New season",
  );
  assert.match(page.elements.get("iframe").src, /1399\/2\/1\?title=false$/);
});

test("invalid media IDs never reach the proxy", () => {
  const page = watchPage("?id=550/evil", () => {
    throw new Error("Unexpected metadata request");
  });
  vm.runInContext(sources[1], page.context);
  page.events.DOMContentLoaded();
  assert.equal(page.location.href, "/");
  assert.equal(page.elements.has("iframe"), false);
});

const embed = await readFile(
  new URL("../static/embed.html", import.meta.url),
  "utf8",
);
const embedScript = [...embed.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((script) => script.includes("const inShell"));

function proxyPage() {
  const init = deferred();
  const destinations = [];
  const handlers = {};
  const elements = new Map();
  const node = () => ({
    textContent: "",
    innerHTML: "",
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {},
    appendChild() {},
  });
  const frame = {
    element: {
      setAttribute() {},
      addEventListener() {},
      contentDocument: null,
    },
    hooks: { init: { post: {} }, error: { request: {} } },
    addEventListener() {},
    go(url) {
      destinations.push(url);
    },
  };
  const timers = new Map();
  let nextTimer = 0;
  const context = vm.createContext({
    console: { error() {}, warn() {} },
    URL,
    Proxy,
    wispurl: "wss://55gms.test/wisp/",
    location: {
      origin: "https://55gms.test",
      protocol: "https:",
      host: "55gms.test",
      hash: "#https://example.com/",
    },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {},
    },
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, node());
        return elements.get(id);
      },
    },
    addEventListener(type, callback) {
      handlers[type] = callback;
    },
    setTimeout(callback) {
      const id = ++nextTimer;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    proxyRuntime: {
      createController() {
        return init.promise.then(() => ({
          createFrame() {
            return frame;
          },
        }));
      },
      AssetCachePlugin: class {},
    },
    $scramjet: { Tap: { tap() {} } },
    $scramjetUtils: { UrlWatcherPlugin: class {} },
  });
  context.window = context;
  context.self = context;
  context.parent = context;
  vm.runInContext(embedScript, context);
  return {
    context,
    init,
    destinations,
    timers,
    handlers,
  };
}

test("proxy navigation waits for the new controller handshake", async () => {
  const page = proxyPage();
  await tick();
  assert.equal(page.destinations.length, 0);
  page.init.resolve();
  await tick();
  assert.deepEqual(page.destinations, ["https://example.com/"]);
  assert.equal(page.timers.size, 1);
});

test("latest episode wins if navigation changes before proxy startup completes", async () => {
  const page = proxyPage();
  page.context.location.hash = "#https://vidsrc.party/embed/tv/1399/1/2";
  page.handlers.hashchange();
  page.init.resolve();
  await tick();
  assert.deepEqual(page.destinations, [
    "https://vidsrc.party/embed/tv/1399/1/2",
  ]);
});

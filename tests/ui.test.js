import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
// Reuse the DOM implementation already required by isomorphic-dompurify.
const { JSDOM } = createRequire(import.meta.resolve("isomorphic-dompurify"))(
  "jsdom",
);
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

async function fixture(page, scripts) {
  const dom = new JSDOM(read(page), {
    url: "https://55gms.test/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  await new Promise((resolve) =>
    dom.window.addEventListener("load", resolve, { once: true }),
  );
  for (const script of scripts)
    vm.runInContext(read(script), dom.getInternalVMContext());
  return dom;
}

const rootPages = readdirSync(new URL("../static/", import.meta.url))
  .filter((path) => path.endsWith(".html"))
  .map((path) => `static/${path}`);
const games = JSON.parse(read("static/assets/json/load/g.json"));
const wrappers = readdirSync(new URL("../static/misc/play/", import.meta.url))
  .filter((path) => path.endsWith(".html") && path !== "index.html")
  .map((path) => `static/misc/play/${path}`);
const otherPages = [
  "static/misc/index.html",
  "static/misc/play/index.html",
  "static/misc/media/movie.html",
  "static/misc/media/tv.html",
];

test("every primary page and catalog player has labelled controls, unique IDs, and landmarks", () => {
  for (const path of [...rootPages, ...wrappers, ...otherPages]) {
    const dom = new JSDOM(read(path));
    const doc = dom.window.document;
    assert.equal(doc.documentElement.lang, "en", path);
    assert.equal(doc.querySelectorAll("main").length, 1, path);
    const skip = doc.querySelector(".skip-link");
    assert.ok(
      skip && doc.querySelector(skip.getAttribute("href")),
      `${path}: skip link`,
    );
    const ids = [...doc.querySelectorAll("[id]")].map((node) => node.id);
    assert.equal(ids.length, new Set(ids).size, `${path}: duplicate IDs`);
    assert.equal(
      doc.querySelectorAll("a button, button a").length,
      0,
      `${path}: nested controls`,
    );
    for (const input of doc.querySelectorAll("input,select,textarea")) {
      const label = [...doc.querySelectorAll("label")].some(
        (node) => node.htmlFor === input.id || node.contains(input),
      );
      assert.ok(
        label || input.getAttribute("aria-label"),
        `${path}: unnamed input ${input.id}`,
      );
    }
    for (const img of doc.querySelectorAll("img"))
      assert.ok(img.hasAttribute("alt"), `${path}: image alt`);
    for (const button of doc.querySelectorAll("button, .navbar a")) {
      assert.ok(
        button.textContent.trim() ||
          button.getAttribute("aria-label") ||
          button.querySelector("img[alt]")?.alt,
        `${path}: unnamed control ${button.id}`,
      );
    }
    for (const frame of doc.querySelectorAll("iframe"))
      assert.ok(frame.title, `${path}: iframe title`);
    for (const dialog of doc.querySelectorAll('[role="dialog"]'))
      assert.ok(
        doc.getElementById(dialog.getAttribute("aria-labelledby")),
        `${path}: dialog title`,
      );
    for (const script of doc.querySelectorAll("script:not([src])")) {
      if (!script.type || script.type === "text/javascript")
        new vm.Script(script.textContent, { filename: path });
    }
    dom.window.close();
  }
});

test("catalog search keeps Tab and action keys intact, reports empty states, and updates URL", async () => {
  const dom = await fixture("static/games.html", [
    "static/assets/js/searchbar.v2.js",
  ]);
  const { document, KeyboardEvent } = dom.window;
  document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  document.getElementById("game-container").innerHTML =
    '<div class="game">Alpha</div><div class="game">Beta</div>';
  const input = document.querySelector("input.searchbar");
  const action = document.getElementById("retry-games");
  action.focus();
  action.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
  );
  assert.equal(document.activeElement, action);
  action.dispatchEvent(
    new KeyboardEvent("keydown", { key: "/", bubbles: true }),
  );
  assert.equal(document.activeElement, action);
  input.value = "Alpha";
  dom.window.search();
  assert.equal(document.querySelectorAll(".game:not([hidden])").length, 1);
  assert.equal(
    new URL(dom.window.location.href).searchParams.get("q"),
    "Alpha",
  );
  input.value = "Missing";
  dom.window.search();
  assert.match(
    document.getElementById("search-status").textContent,
    /No matches/,
  );
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
  );
  assert.equal(document.querySelectorAll(".game:not([hidden])").length, 2);
  assert.equal(new URL(dom.window.location.href).searchParams.has("q"), false);
  dom.window.close();
});

test("dialog traps focus, handles Escape, restores focus and prior background state", async () => {
  const dom = await fixture("static/settings.html", ["static/assets/js/ui.js"]);
  const { document, KeyboardEvent } = dom.window;
  dom.window.HTMLElement.prototype.getClientRects = () => [
    { width: 40, height: 40 },
  ];
  const opener = document.querySelector(".settings-actions button");
  const modal = document.getElementById("importConfirmModal");
  const first = document.getElementById("confirmImportSave");
  const last = document.getElementById("cancelImportSave");
  opener.focus();
  let closed = false;
  dom.window.siteDialog.activate(modal, () => {
    closed = true;
    dom.window.siteDialog.deactivate(modal);
  });
  assert.equal(document.activeElement, first);
  assert.equal(document.querySelector("main").inert, true);
  last.focus();
  last.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    }),
  );
  assert.equal(document.activeElement, first);
  first.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    }),
  );
  assert.equal(document.activeElement, last);
  last.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
  );
  assert.ok(closed);
  assert.equal(document.activeElement, opener);
  assert.notEqual(document.querySelector("main").inert, true);
  dom.window.close();
});

test("auth validation focuses the field and failed requests restore the submit button", async () => {
  const dom = await fixture("static/login.html", ["static/assets/js/auth.js"]);
  const { document } = dom.window;
  document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  const form = document.getElementById("authForm");
  const submit = () =>
    form.dispatchEvent(
      new dom.window.Event("submit", { bubbles: true, cancelable: true }),
    );
  submit();
  assert.equal(document.activeElement, document.getElementById("username"));
  assert.equal(document.activeElement.getAttribute("aria-invalid"), "true");
  document.getElementById("username").value = "Tester";
  document.getElementById("password").value = "password";
  let requests = 0;
  dom.window.fetch = async () => {
    requests++;
    return { ok: false, json: async () => ({}) };
  };
  submit();
  submit();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests, 1);
  assert.equal(form.querySelector("button").disabled, false);
  assert.equal(form.getAttribute("aria-busy"), "false");
  assert.match(
    document.getElementById("authFeedback").textContent,
    /Check your username/,
  );
  dom.window.close();
});

test("signup handles an unloaded CAPTCHA without locking the form", async () => {
  const dom = await fixture("static/signup.html", ["static/assets/js/auth.js"]);
  const { document } = dom.window;
  document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  document.getElementById("username").value = "Tester";
  document.getElementById("password").value = "password";
  const form = document.getElementById("authForm");
  form.dispatchEvent(new dom.window.Event("submit", { cancelable: true }));
  assert.match(document.getElementById("authFeedback").textContent, /CAPTCHA/);
  assert.equal(form.querySelector("button").disabled, false);
  dom.window.close();
});

test("media cards render API titles as text and exclude people from search results", async () => {
  const dom = await fixture("static/media.html", [
    "static/misc/media/js/search.js",
  ]);
  const container = dom.window.document.getElementById("game-container");
  dom.window.createAndDisplayCard(
    {
      id: 1,
      title: '<img src=x onerror="alert(1)">',
      media_type: "movie",
      poster_path: "poster.jpg",
      vote_average: 7,
    },
    container,
  );
  dom.window.createAndDisplayCard(
    { id: 2, name: "Person", media_type: "person", poster_path: "poster.jpg" },
    container,
  );
  assert.equal(container.querySelectorAll(".card").length, 1);
  assert.equal(container.querySelectorAll("img").length, 1);
  assert.equal(
    container.querySelector(".item-name").textContent,
    '<img src=x onerror="alert(1)">',
  );
  assert.ok(container.querySelector("a").href.endsWith("movie.html?id=1"));
  dom.window.close();
});

test("chat list uses navigable links and escapes user-generated names and previews", async () => {
  const dom = await fixture("static/chat.html", ["static/assets/js/chat.js"]);
  dom.window.eval(
    `currentUser = { uuid: "me" }; chats = [{id: 123, name: '<img src=x>', type: "direct", members: [], lastMessage: {senderUuid:"other", content:'<script>bad</script>', createdAt: new Date().toISOString()}, unreadCount: 1}]; renderChatList();`,
  );
  const list = dom.window.document.getElementById("chatList");
  assert.equal(list.querySelectorAll("a.chat-item").length, 1);
  assert.equal(list.querySelector("a").pathname, "/chat/123");
  assert.equal(list.querySelectorAll("img,script").length, 0);
  assert.match(list.querySelector(".chat-item-meta").textContent, /1/);
  dom.window.close();
});

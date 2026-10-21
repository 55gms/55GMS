// Per-game cloud saves: the sync engine. Loaded by the play pages (before the
// game frame starts), the profile page, other site pages in the background,
// and by save-agent.js for a game opened on its own. It reads the records
// save-agent.js keeps of which storage each game uses, turns one game's
// storage into a save, and syncs it with /api/saves (routes/saves.js).
//
// A save is { v: 1, ls?: { key: value }, idb?: [database] }, serialized with
// sorted keys so the same data always has the same SHA-256. The server
// settles conflicts; this file only decides when to sync and applies the
// save the server keeps. See docs/cloud-saves.md.
window.GMSSaves = (() => {
  if (window.GMSSaves) return window.GMSSaves;

  const DB_NAME = "gms-cloud-saves";
  const REGISTRY_URL = "/assets/json/saves.json";
  const API = "/api/saves";
  const LEARNED_URL = "/api/saves-keys";
  const SYNC_URL = "/api/saves-sync";
  const BATCH_MAX_GAMES = 200;
  const BATCH_MAX_BYTES = 8 * 1024 * 1024;
  const RECENT_MS = 60 * 1000;
  const LEARNED_TTL_MS = 60 * 60 * 1000;
  const LEARNED_TIMEOUT_MS = 2500;
  const ENTITLEMENT_TTL_MS = 10 * 60 * 1000;
  const UPLOAD_DEBOUNCE_MS = 20000;
  const UPLOAD_MAX_WAIT_MS = 60000;
  const CHECK_INTERVAL_MS = 60000;
  const LAUNCH_BUDGET_MS = 5000;
  const LAUNCH_DOWNLOAD_BUDGET_MS = 12000;
  const MOVE_BUDGET_MS = 4000;
  const KEEPALIVE_MAX_BYTES = 60000;
  const RETRYABLE = new Set([0, 408, 425, 429, 500, 502, 503, 504]);

  // Must match isSiteStorageKey() in utils/saveRegistry.js.
  const SITE_KEYS = new Set([
    "uuid",
    "username",
    "premium",
    "siteTheme",
    "tab",
    "aboutBlank",
    "adPrefs",
    "panicKey",
    "PanicLink",
    "pokiMigrated",
  ]);
  const SITE_PATTERNS = [
    /^55gms/i,
    /^gms[-:._]/i,
    /^__gms/i,
    /^[a-z]+-(last-body|viewed)$/,
    /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?@/i,
  ];
  const isSiteKey = (key) =>
    SITE_KEYS.has(key) || SITE_PATTERNS.some((pattern) => pattern.test(key));

  // Must match gameIdFromLocation() in utils/saveRegistry.js.
  function gameIdFromLocation(pathname, search = "") {
    let decoded = String(pathname || "");
    try {
      decoded = decodeURIComponent(decoded);
    } catch {}
    const match = /^\/misc\/(.+)$/.exec(decoded);
    if (!match) return null;
    const rest = match[1]
      .replace(/\/index\.html?$/i, "")
      .replace(/\.html?$/i, "")
      .replace(/\/+$/, "");
    if (!rest || /^(play|media)(\/|$)/i.test(rest)) return null;
    let id = rest;
    const params = new URLSearchParams(search || "");
    for (const name of ["swf", "game", "rom"]) {
      const value = params.get(name);
      if (value) {
        id += "-" + value.replace(/\.[a-z0-9]+$/i, "");
        break;
      }
    }
    id = id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96)
      .replace(/-+$/, "");
    return /^[a-z0-9][a-z0-9-]{0,95}$/.test(id) ? id : null;
  }

  // When this file runs inside a game document, storage is read and written
  // with the methods save-agent.js had before it patched them.
  const raw = window.__gmsSaveAgent?.raw;
  const store = {
    get: (key) =>
      raw ? raw.getItem.call(localStorage, key) : localStorage.getItem(key),
    set: (key, value) =>
      raw
        ? raw.setItem.call(localStorage, key, value)
        : localStorage.setItem(key, value),
    remove: (key) =>
      raw
        ? raw.removeItem.call(localStorage, key)
        : localStorage.removeItem(key),
  };

  const account = () => {
    try {
      return store.get("uuid") || null;
    } catch {
      return null;
    }
  };

  // An /api request as this account. It carries the login's session, as
  // Bunny pull zones (*.b-cdn.net) strip the cookie, and a GET gets a query
  // of its own, as a pull zone that overrides cache times would otherwise
  // hand one account's answer to the next. script.js does the same for the
  // site's pages; game frames load this without it.
  let requestCount = 0;
  function apiRequest(path, init = {}) {
    const url = new URL(path, location.origin);
    const method = String(init.method || "GET").toUpperCase();
    if (method === "GET" || method === "HEAD")
      url.searchParams.set(
        "_",
        Date.now().toString(36) + (requestCount++).toString(36),
      );
    const headers = new Headers(init.headers || undefined);
    try {
      const session = store.get("gms-session");
      if (session) headers.set("X-GMS-Session", session);
    } catch {}
    return fetch(url, { ...init, headers }).then((response) => {
      try {
        const renewed = response.headers.get("X-GMS-Session");
        if (renewed) store.set("gms-session", renewed);
      } catch {}
      return response;
    });
  }

  // ---- Local database (shared with save-agent.js) ---------------------

  let dbPromise = null;
  function db() {
    dbPromise ||= new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        for (const name of ["claims", "dirty", "state", "meta"]) {
          if (!request.result.objectStoreNames.contains(name)) {
            request.result.createObjectStore(name, {
              keyPath: name === "meta" ? "name" : "id",
            });
          }
        }
      };
      request.onsuccess = () => {
        const opened = request.result;
        opened.onversionchange = () => {
          opened.close();
          dbPromise = null;
        };
        resolve(opened);
      };
      request.onerror = () => reject(request.error);
    }).catch((error) => {
      dbPromise = null;
      throw error;
    });
    return dbPromise;
  }

  function done(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function tx(names, mode, work) {
    const database = await db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(names, mode);
      let result;
      Promise.resolve(work(transaction)).then(
        (value) => (result = value),
        reject,
      );
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  const getAll = (name) =>
    tx([name], "readonly", (t) => done(t.objectStore(name).getAll()));
  const getOne = (name, id) =>
    tx([name], "readonly", (t) => done(t.objectStore(name).get(id)));
  const putOne = (name, value) =>
    tx([name], "readwrite", (t) => done(t.objectStore(name).put(value)));

  const stateId = (uuid, gameId) => `${uuid}|${gameId}`;

  async function getState(gameId, uuid = account()) {
    return (
      (await getOne("state", stateId(uuid, gameId))) || {
        id: stateId(uuid, gameId),
        gameId,
        uuid,
        baseRevision: 0,
        baseHash: null,
      }
    );
  }

  async function setState(gameId, changes, uuid = account()) {
    const id = stateId(uuid, gameId);
    return tx(["state"], "readwrite", async (t) => {
      const states = t.objectStore("state");
      const current = (await done(states.get(id))) || {
        id,
        gameId,
        uuid,
        baseRevision: 0,
        baseHash: null,
      };
      const next = { ...current, ...changes };
      states.put(next);
      emit("status", { gameId, state: next });
      return next;
    });
  }

  async function meta(name) {
    return (await getOne("meta", name))?.value;
  }
  const setMeta = (name, value) => putOne("meta", { name, value });

  async function deviceId() {
    let id = await meta("device");
    if (!id) {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      id = btoa(String.fromCharCode(...bytes)).replace(
        /[+/=]/g,
        (c) => ({ "+": "-", "/": "_", "=": "" })[c],
      );
      await setMeta("device", id);
    }
    return id;
  }

  // ---- Events ----------------------------------------------------------

  const listeners = {};
  function on(event, callback) {
    (listeners[event] ||= new Set()).add(callback);
    return () => listeners[event].delete(callback);
  }
  function emit(event, detail) {
    for (const callback of listeners[event] || []) {
      try {
        callback(detail);
      } catch (error) {
        console.error(error);
      }
    }
  }

  // ---- Registry ----------------------------------------------------------

  let registryPromise = null;
  function registry() {
    registryPromise ||= fetch(new URL(REGISTRY_URL, location.origin))
      .then((response) => (response.ok ? response.json() : { games: {} }))
      .then((data) => data.games || {})
      .catch(() => {
        registryPromise = null;
        return {};
      });
    return registryPromise;
  }

  // The storage names the server learned each game uses, from every
  // account's uploads and this account's own (services/learnedSaveKeys.js).
  // Kept for an hour so a launch does not wait on them; a stale copy is
  // used when the server cannot be reached.
  let learnedPromise = null;
  function learned() {
    learnedPromise ||= (async () => {
      const uuid = account() || null;
      const cached = await meta("learnedKeys").catch(() => null);
      if (cached?.uuid === uuid && Date.now() - cached.at < LEARNED_TTL_MS)
        return cached.games;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), LEARNED_TIMEOUT_MS);
        const response = await apiRequest(LEARNED_URL, {
          credentials: "same-origin",
          signal: controller.signal,
        }).finally(() => clearTimeout(timer));
        if (!response.ok) throw new Error(String(response.status));
        const games = (await response.json()).games || {};
        await setMeta("learnedKeys", { uuid, at: Date.now(), games }).catch(
          () => {},
        );
        return games;
      } catch {
        return cached?.games || {};
      }
    })();
    return learnedPromise;
  }

  async function databaseNames() {
    if (!indexedDB.databases) return null;
    try {
      return new Set((await indexedDB.databases()).map((info) => info.name));
    } catch {
      return null;
    }
  }

  // Learned names as claims, for the storage this browser actually has,
  // leaving out any name this browser already gave to another game.
  async function learnedClaims(claims) {
    const games = await learned();
    if (!Object.keys(games).length) return [];
    const localOwners = new Map();
    const own = (id, gameId) => {
      if (!localOwners.has(id)) localOwners.set(id, new Set());
      localOwners.get(id).add(gameId);
    };
    for (const claim of claims) {
      if (claim.kind === "ls") own(`ls\u0000${claim.key}`, claim.gameId);
      else if (claim.kind === "idb")
        own(
          `idb\u0000${claim.db}\u0000${claim.store}\u0000${claim.prefix ?? claim.key}`,
          claim.gameId,
        );
    }
    const takenElsewhere = (id, gameId) =>
      localOwners.has(id) && !localOwners.get(id).has(gameId);
    const databases = await databaseNames();
    const out = [];
    const idb = [];
    for (const [gameId, names] of Object.entries(games)) {
      for (const key of names.ls || []) {
        if (typeof key !== "string" || isSiteKey(key)) continue;
        if (takenElsewhere(`ls\u0000${key}`, gameId)) continue;
        if (store.get(key) === null) continue;
        out.push({ gameId, kind: "ls", key });
      }
      for (const target of names.idb || []) {
        if (databases && !databases.has(target.db)) continue;
        const at = `idb\u0000${target.db}\u0000${target.store}\u0000`;
        for (const prefix of target.prefixes || []) {
          if (takenElsewhere(at + prefix, gameId)) continue;
          idb.push({
            gameId,
            kind: "idb",
            db: target.db,
            store: target.store,
            prefix,
          });
        }
        for (const encoded of target.keys || []) {
          const key = decodeValue(encoded);
          if (typeof key !== "string" && typeof key !== "number") continue;
          if (takenElsewhere(at + key, gameId)) continue;
          idb.push({
            gameId,
            kind: "idb",
            db: target.db,
            store: target.store,
            key,
          });
        }
      }
    }
    return out.concat(await presentRecords(idb));
  }

  // The IndexedDB claims with a record here: one read per name, in one
  // transaction per database. A database that cannot be opened is skipped.
  async function presentRecords(candidates) {
    const byDatabase = new Map();
    for (const claim of candidates) {
      if (!byDatabase.has(claim.db)) byDatabase.set(claim.db, []);
      byDatabase.get(claim.db).push(claim);
    }
    const found = [];
    for (const [name, list] of byDatabase) {
      let opened = null;
      try {
        if (!(await databaseExists(name))) continue;
        opened = await openDatabase(name);
        const names = [...new Set(list.map((claim) => claim.store))].filter(
          (store) => opened.objectStoreNames.contains(store),
        );
        if (!names.length) continue;
        const transaction = opened.transaction(names, "readonly");
        for (const claim of list) {
          if (!names.includes(claim.store)) continue;
          const objectStore = transaction.objectStore(claim.store);
          const there =
            claim.prefix !== undefined
              ? (await done(objectStore.getKey(below(claim.prefix)))) !==
                  undefined ||
                (await done(objectStore.getKey(claim.prefix))) !== undefined
              : (await done(objectStore.getKey(claim.key))) !== undefined;
          if (there) found.push(claim);
        }
      } catch {
      } finally {
        opened?.close();
      }
    }
    return found;
  }

  // Learned claims change only with this browser's storage, so a run of
  // syncs (Sync now, Load from cloud) works them out once.
  let learnedCache = null;
  function learnedClaimsCached(local) {
    if (!learnedCache || Date.now() - learnedCache.at > 15000) {
      learnedCache = {
        at: Date.now(),
        claims: learnedClaims(local).catch(() => []),
      };
    }
    return learnedCache.claims;
  }

  // ---- Ownership -----------------------------------------------------------

  // Which storage belongs to which game, from save-agent.js's records, the
  // names learned from uploads, and the registry's known keys. A
  // localStorage key two games both use is left out of both saves, unless
  // the registry gives it to one of them.
  async function ownership() {
    const [local, games] = await Promise.all([getAll("claims"), registry()]);
    const claims = [...local, ...(await learnedClaimsCached(local))];
    const byGame = new Map();
    const keyOwners = new Map();
    const entry = (gameId) => {
      if (!byGame.has(gameId)) {
        byGame.set(gameId, { ls: new Set(), want: new Set(), idb: new Map() });
      }
      return byGame.get(gameId);
    };
    const namesCache = new Map();
    const namesFor = (gameId) => {
      if (!namesCache.has(gameId)) {
        const renamed = games[gameId]?.renamed;
        namesCache.set(gameId, renamed ? renamedNames(gameId, renamed) : null);
      }
      return namesCache.get(gameId);
    };
    for (const claim of claims) {
      if (claim.kind === "ls") {
        entry(claim.gameId).ls.add(claim.key);
        // Where the key is now: a renamed game no longer uses the old name.
        const at = namesFor(claim.gameId)?.key(claim.key) ?? claim.key;
        if (!keyOwners.has(at)) keyOwners.set(at, new Set());
        keyOwners.get(at).add(claim.gameId);
      } else if (claim.kind === "want") {
        entry(claim.gameId).want.add(claim.key);
      } else if (claim.kind === "idb") {
        const stores = entry(claim.gameId).idb;
        const name = `${claim.db}\u0000${claim.store}`;
        if (!stores.has(name)) {
          stores.set(name, {
            db: claim.db,
            store: claim.store,
            prefixes: new Set(),
            keys: [],
          });
        }
        const target = stores.get(name);
        if (claim.prefix !== undefined) target.prefixes.add(claim.prefix);
        else if (claim.key !== undefined && !target.keys.includes(claim.key)) {
          target.keys.push(claim.key);
        }
      }
    }
    const registered = new Map();
    for (const game of Object.values(games)) {
      for (const key of game.keys || []) registered.set(key, game.id);
    }
    return {
      games: byGame,
      names: namesFor,
      lsKeysFor(gameId) {
        const names = namesFor(gameId);
        if (names) {
          // Every key the game used, before and after it was renamed,
          // where it is now. They are the game's alone.
          const keys = new Set();
          for (const key of byGame.get(gameId)?.ls || [])
            if (!isSiteKey(key)) keys.add(names.key(key));
          for (const key of games[gameId]?.keys || []) keys.add(names.key(key));
          return keys;
        }
        const keys = new Set();
        for (const key of byGame.get(gameId)?.ls || []) {
          if (isSiteKey(key)) continue;
          const owner = registered.get(key);
          if (owner && owner !== gameId) continue;
          if (!owner && keyOwners.get(key)?.size > 1) continue;
          keys.add(key);
        }
        for (const key of games[gameId]?.keys || []) keys.add(key);
        return keys;
      },
      idbFor(gameId) {
        const targets = [...(byGame.get(gameId)?.idb.values() || [])];
        const names = namesFor(gameId);
        if (!names) return targets;
        // Records claimed in a database before it was copied are in the
        // copy under the same keys.
        const merged = new Map();
        for (const target of targets) {
          const db = names.database(target.db);
          const id = `${db}\u0000${target.store}`;
          if (!merged.has(id))
            merged.set(id, {
              db,
              store: target.store,
              prefixes: new Set(),
              keys: [],
            });
          const into = merged.get(id);
          for (const prefix of target.prefixes) into.prefixes.add(prefix);
          for (const key of target.keys)
            if (!into.keys.includes(key)) into.keys.push(key);
        }
        // Once a Poki Unity game has its own folder, the shared one it
        // wrote to before is not its save.
        const shared = games[gameId].renamed.unityFolder
          ? store.get(FOLDER_KEY)
          : null;
        if (
          names.moved &&
          shared &&
          shared !== store.get(names.prefix + FOLDER_KEY)
        ) {
          const folder = `/idbfs/${shared}`;
          for (const target of merged.values())
            if (target.db === "/idbfs")
              for (const prefix of target.prefixes)
                if (prefix === folder || prefix.startsWith(`${folder}/`))
                  target.prefixes.delete(prefix);
        }
        return [...merged.values()];
      },
      wantedFor(gameId) {
        const wanted = [
          ...(byGame.get(gameId)?.want || []),
          ...(byGame.get(gameId)?.ls || []),
        ];
        // A legacy backup has the names from before a game was renamed.
        const prefix = namesFor(gameId)?.prefix;
        if (!prefix) return wanted;
        return [
          ...new Set(
            wanted.map((key) =>
              key.startsWith(prefix) ? key.slice(prefix.length) : key,
            ),
          ),
        ];
      },
      shared(gameId) {
        if (namesFor(gameId)) return [];
        return [...(byGame.get(gameId)?.ls || [])].filter(
          (key) => !registered.has(key) && keyOwners.get(key)?.size > 1,
        );
      },
    };
  }

  // Records that a save's storage belongs to its game, as save-agent.js
  // would had it seen the game use it.
  async function claimSave(gameId, save) {
    const now = Date.now();
    await tx(["claims"], "readwrite", (t) => {
      const claims = t.objectStore("claims");
      for (const key of Object.keys(save.ls || {})) {
        claims.put({
          id: `${gameId}\u0000ls\u0000${key}`,
          gameId,
          kind: "ls",
          key,
          owned: true,
          at: now,
        });
      }
      for (const database of save.idb || []) {
        for (const target of database.stores) {
          for (const prefix of target.prefixes || []) {
            claims.put({
              id: `${gameId}\u0000idb\u0000${database.name}\u0000${target.name}\u0000p:${prefix}`,
              gameId,
              kind: "idb",
              db: database.name,
              store: target.name,
              prefix,
              at: now,
            });
          }
          for (const key of (target.keys || []).map(decodeValue)) {
            if (typeof key !== "string" && typeof key !== "number") continue;
            claims.put({
              id: `${gameId}\u0000idb\u0000${database.name}\u0000${target.name}\u0000k:${key}`,
              gameId,
              kind: "idb",
              db: database.name,
              store: target.name,
              key,
              at: now,
            });
          }
        }
      }
    });
  }

  // ---- Values ----------------------------------------------------------------

  function toBase64(bytes) {
    let text = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(text);
  }
  function fromBase64(text) {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  const TYPED = [
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array",
  ];

  // Files a game downloads into IndexedDB (level packs, asset archives) are
  // content, not progress, and one of them can fill a save past its limit.
  // A record holding more than this is left out of saves, and a restore
  // leaves it where it is; the game downloads it again where it is missing.
  const RECORD_MAX_BYTES = 4 * 1024 * 1024;

  function bytesIn(value, depth = 0) {
    if (typeof value === "string") return value.length;
    if (!value || typeof value !== "object" || depth > 8) return 0;
    if (value instanceof ArrayBuffer) return value.byteLength;
    if (ArrayBuffer.isView(value)) return value.byteLength;
    if (typeof Blob !== "undefined" && value instanceof Blob) return value.size;
    const items =
      value instanceof Map
        ? value.values()
        : Array.isArray(value) || value instanceof Set
          ? value
          : Object.values(value);
    let total = 0;
    for (const item of items) {
      total += bytesIn(item, depth + 1);
      if (total > RECORD_MAX_BYTES) break;
    }
    return total;
  }
  const tooLarge = (value) => bytesIn(value) > RECORD_MAX_BYTES;
  const recordId = (key) => JSON.stringify([typeof key, key]);

  // Emscripten file systems (Unity's /idbfs, Godot's /userfs) give every
  // folder a new time whenever any of their games starts and writes them all
  // back, so a folder's time is not save data: a save holds 0 instead, or
  // every such game would look changed each time another one ran.
  function withoutFolderTime(value) {
    if (
      value &&
      typeof value === "object" &&
      typeof value.mode === "number" &&
      (value.mode & 0o170000) === 0o040000 &&
      value.timestamp instanceof Date
    )
      return { ...value, timestamp: new Date(0) };
    return value;
  }

  // IndexedDB values as JSON, with the types JSON lacks tagged: { $t: type }.
  // An object that has its own "$t" is wrapped, so nothing is misread.
  async function encodeValue(value) {
    if (value === undefined) return { $t: "undef" };
    if (
      value === null ||
      typeof value === "boolean" ||
      typeof value === "string"
    )
      return value;
    if (typeof value === "number") {
      return Number.isFinite(value) && !Object.is(value, -0)
        ? value
        : { $t: "num", v: String(value) };
    }
    if (typeof value === "bigint") return { $t: "big", v: value.toString() };
    if (value instanceof Date) return { $t: "date", v: value.getTime() };
    if (value instanceof ArrayBuffer)
      return { $t: "ab", v: toBase64(new Uint8Array(value)) };
    if (ArrayBuffer.isView(value)) {
      const bytes = new Uint8Array(
        value.buffer,
        value.byteOffset,
        value.byteLength,
      );
      const type =
        value instanceof DataView ? "DataView" : value.constructor.name;
      return { $t: "view", type, v: toBase64(bytes) };
    }
    if (typeof Blob !== "undefined" && value instanceof Blob) {
      const bytes = new Uint8Array(await value.arrayBuffer());
      return { $t: "blob", type: value.type, v: toBase64(bytes) };
    }
    if (Array.isArray(value)) {
      const items = [];
      for (const item of value) items.push(await encodeValue(item));
      return items;
    }
    if (value instanceof Map) {
      const entries = [];
      for (const [key, item] of value)
        entries.push([await encodeValue(key), await encodeValue(item)]);
      return { $t: "map", v: entries };
    }
    if (value instanceof Set) {
      const items = [];
      for (const item of value) items.push(await encodeValue(item));
      return { $t: "set", v: items };
    }
    if (value instanceof RegExp)
      return { $t: "re", v: value.source, f: value.flags };
    const out = {};
    for (const key of Object.keys(value))
      out[key] = await encodeValue(value[key]);
    return Object.hasOwn(value, "$t") ? { $t: "obj", v: out } : out;
  }

  function decodeValue(value) {
    if (value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(decodeValue);
    switch (value.$t) {
      case undefined:
        break;
      case "undef":
        return undefined;
      case "num":
        return Number(value.v);
      case "big":
        return BigInt(value.v);
      case "date":
        return new Date(value.v);
      case "ab":
        return fromBase64(value.v).buffer;
      case "view": {
        const bytes = fromBase64(value.v);
        if (value.type === "DataView") return new DataView(bytes.buffer);
        const View = TYPED.includes(value.type)
          ? window[value.type]
          : Uint8Array;
        return new View(bytes.buffer);
      }
      case "blob":
        return new Blob([fromBase64(value.v)], { type: value.type });
      case "map":
        return new Map(
          value.v.map(([key, item]) => [decodeValue(key), decodeValue(item)]),
        );
      case "set":
        return new Set(value.v.map(decodeValue));
      case "re":
        return new RegExp(value.v, value.f);
      case "obj":
        return decodeObject(value.v);
    }
    return decodeObject(value);
  }
  function decodeObject(value) {
    const out = {};
    for (const key of Object.keys(value)) out[key] = decodeValue(value[key]);
    return out;
  }

  // Must match stableStringify() in services/gameSaves.js.
  function stableStringify(value) {
    if (value === null || typeof value !== "object")
      return JSON.stringify(value);
    if (Array.isArray(value)) {
      return `[${value.map((item) => (item === undefined ? "null" : stableStringify(item))).join(",")}]`;
    }
    const keys = Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }

  async function sha256(text) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  // ---- IndexedDB access ------------------------------------------------------

  async function databaseExists(name) {
    if (indexedDB.databases) {
      try {
        return (await indexedDB.databases()).some((info) => info.name === name);
      } catch {}
    }
    // Opening a database that is not there would create it; aborting the
    // upgrade leaves nothing behind.
    return new Promise((resolve) => {
      const request = indexedDB.open(name);
      request.onupgradeneeded = (event) => {
        if (event.oldVersion === 0) request.transaction.abort();
      };
      request.onsuccess = () => {
        request.result.close();
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });
  }

  function openDatabase(name, version, upgrade) {
    return new Promise((resolve, reject) => {
      const request = version
        ? indexedDB.open(name, version)
        : indexedDB.open(name);
      const timer = setTimeout(() => reject(new Error("blocked")), 4000);
      request.onupgradeneeded = (event) => {
        if (!upgrade) {
          request.transaction.abort();
          return;
        }
        upgrade(request.result, request.transaction, event.oldVersion);
      };
      request.onsuccess = () => {
        clearTimeout(timer);
        const opened = request.result;
        opened.onversionchange = () => opened.close();
        resolve(opened);
      };
      request.onerror = () => {
        clearTimeout(timer);
        reject(request.error || new Error("open failed"));
      };
    });
  }

  const below = (prefix) => IDBKeyRange.bound(`${prefix}/`, `${prefix}/￿`);
  function ancestors(prefix) {
    const parts = prefix.split("/");
    const out = [];
    for (let i = 2; i < parts.length; i++)
      out.push(parts.slice(0, i).join("/"));
    return out;
  }

  function readRecords(objectStore, range) {
    return new Promise((resolve, reject) => {
      const records = [];
      const request = objectStore.openCursor(range);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return resolve(records);
        records.push([cursor.primaryKey, cursor.value]);
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async function extractDatabase(name, targets) {
    if (!(await databaseExists(name))) return null;
    const opened = await openDatabase(name);
    try {
      const names = targets
        .map((target) => target.store)
        .filter((store) => opened.objectStoreNames.contains(store));
      if (!names.length) return null;
      // Every read happens first, inside the transaction; encoding can wait
      // on a Blob, which would let the transaction close.
      const transaction = opened.transaction(names, "readonly");
      const read = [];
      for (const target of targets) {
        if (!names.includes(target.store)) continue;
        const objectStore = transaction.objectStore(target.store);
        const found = new Map();
        const keep = (records) => {
          for (const [key, value] of records)
            if (!tooLarge(value)) found.set(recordId(key), [key, value]);
        };
        for (const prefix of target.prefixes) {
          keep(await readRecords(objectStore, below(prefix)));
          for (const key of [prefix, ...ancestors(prefix)]) {
            const value = await done(objectStore.get(key));
            if (value !== undefined) keep([[key, value]]);
          }
        }
        for (const key of target.keys) {
          const value = await done(objectStore.get(key));
          if (value !== undefined) keep([[key, value]]);
        }
        if (!found.size) continue;
        const indexes = [...objectStore.indexNames].sort().map((index) => {
          const definition = objectStore.index(index);
          return {
            name: index,
            keyPath: definition.keyPath,
            unique: definition.unique,
            multiEntry: definition.multiEntry,
          };
        });
        read.push({
          target,
          found,
          indexes,
          keyPath: objectStore.keyPath,
          autoIncrement: objectStore.autoIncrement,
        });
      }
      const stores = [];
      for (const { target, found, indexes, keyPath, autoIncrement } of read) {
        const records = [];
        for (const [key, value] of found.values()) {
          records.push([
            await encodeValue(key),
            await encodeValue(withoutFolderTime(value)),
          ]);
        }
        records.sort((a, b) =>
          stableStringify(a[0]) < stableStringify(b[0]) ? -1 : 1,
        );
        stores.push({
          name: target.store,
          keyPath,
          autoIncrement,
          indexes,
          prefixes: [...target.prefixes].sort(),
          keys: (await Promise.all(target.keys.map(encodeValue))).sort(
            (a, b) => (stableStringify(a) < stableStringify(b) ? -1 : 1),
          ),
          records,
        });
      }
      if (!stores.length) return null;
      stores.sort((a, b) => (a.name < b.name ? -1 : 1));
      return { name, version: opened.version, stores };
    } finally {
      opened.close();
    }
  }

  // Writes a database's part of a save in one transaction, so it is either
  // all there or not changed. Checks first that it can be done without
  // changing the database's version under the game.
  async function planDatabase(snapshot) {
    const exists = await databaseExists(snapshot.name);
    if (!exists) return { snapshot, version: snapshot.version, create: true };
    const opened = await openDatabase(snapshot.name);
    const version = opened.version;
    const missing = snapshot.stores.some(
      (target) => !opened.objectStoreNames.contains(target.name),
    );
    opened.close();
    if (!missing) return { snapshot, version: null };
    if (snapshot.version > version)
      return { snapshot, version: snapshot.version };
    throw new Error(
      `Can't restore into ${snapshot.name}: the game changed its storage`,
    );
  }

  // The records already here that a restore must not delete: those too
  // large to be in a save. For each store, the folders holding one, with the
  // other keys in them, and the large records' ids.
  async function findLarge(opened, snapshot) {
    const found = new Map();
    const names = snapshot.stores
      .map((target) => target.name)
      .filter((name) => opened.objectStoreNames.contains(name));
    if (!names.length) return found;
    const transaction = opened.transaction(names, "readonly");
    for (const target of snapshot.stores) {
      if (!names.includes(target.name)) continue;
      const objectStore = transaction.objectStore(target.name);
      const folders = new Map();
      const large = new Set();
      for (const prefix of target.prefixes || []) {
        const others = [];
        let holds = false;
        for (const [key, value] of await readRecords(
          objectStore,
          below(prefix),
        )) {
          if (tooLarge(value)) {
            large.add(recordId(key));
            holds = true;
          } else others.push(key);
        }
        if (holds) folders.set(prefix, others);
      }
      for (const key of (target.keys || []).map(decodeValue)) {
        const value = await done(objectStore.get(key));
        if (value !== undefined && tooLarge(value)) large.add(recordId(key));
      }
      if (large.size) found.set(target.name, { folders, large });
    }
    return found;
  }

  async function writeDatabase(plan) {
    const { snapshot } = plan;
    const opened = await openDatabase(
      snapshot.name,
      plan.version,
      (database, transaction) => {
        for (const target of snapshot.stores) {
          const objectStore = database.objectStoreNames.contains(target.name)
            ? transaction.objectStore(target.name)
            : database.createObjectStore(target.name, {
                keyPath: target.keyPath ?? undefined,
                autoIncrement: Boolean(target.autoIncrement),
              });
          for (const index of target.indexes || []) {
            if (!objectStore.indexNames.contains(index.name)) {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique,
                multiEntry: index.multiEntry,
              });
            }
          }
        }
      },
    );
    try {
      const kept = await findLarge(opened, snapshot);
      await new Promise((resolve, reject) => {
        const transaction = opened.transaction(
          snapshot.stores.map((target) => target.name),
          "readwrite",
        );
        for (const target of snapshot.stores) {
          const objectStore = transaction.objectStore(target.name);
          const large = kept.get(target.name);
          for (const prefix of target.prefixes || []) {
            objectStore.delete(prefix);
            const others = large?.folders.get(prefix);
            if (others) for (const key of others) objectStore.delete(key);
            else objectStore.delete(below(prefix));
          }
          for (const key of (target.keys || []).map(decodeValue))
            if (!large?.large.has(recordId(key))) objectStore.delete(key);
          for (const [key, value] of target.records) {
            if (objectStore.keyPath === null)
              objectStore.put(decodeValue(value), decodeValue(key));
            else objectStore.put(decodeValue(value));
          }
        }
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () =>
          reject(transaction.error || new Error("aborted"));
      });
    } finally {
      opened.close();
    }
  }

  // ---- Renamed storage -------------------------------------------------------

  // Games that would share storage with another keep theirs under names of
  // their own (RENAMED in scripts/build-save-registry.js; save-agent.js does
  // the renaming): localStorage keys as "<game id>:<key>", and the databases
  // in renamed.idb as "<game id>:<name>" once moveStorage() has copied them.
  // A save made before a game was renamed has the old names; inLayout()
  // gives any save this browser's.
  const FOLDER_KEY = "savegame_idbfs_hash";
  const settledKey = (gameId) => `gms-renamed:${gameId}`;
  const movedKey = (gameId) => `gms-renamed-idb:${gameId}`;

  function isMoved(gameId, renamed) {
    if (!renamed.idb && !renamed.unityFolder) return true;
    try {
      return store.get(movedKey(gameId)) === "1";
    } catch {
      return false;
    }
  }

  // The keys whose old value the game took over or left behind; see
  // save-agent.js.
  function settledFor(gameId) {
    try {
      const saved = JSON.parse(store.get(settledKey(gameId)) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  }

  // Where a renamed game's storage is in this browser, from a name in
  // either layout.
  function renamedNames(gameId, renamed) {
    const prefix = `${gameId}:`;
    const moved = isMoved(gameId, renamed);
    const base = (name) =>
      name.startsWith(prefix) ? name.slice(prefix.length) : name;
    return {
      prefix,
      moved,
      key(name) {
        if (isSiteKey(name)) return name;
        const key = base(name);
        if (key === FOLDER_KEY && renamed.unityFolder && !moved) return key;
        return prefix + key;
      },
      // The old name the game still reads a stored key from, or null.
      fallback(name, settled) {
        if (!name.startsWith(prefix)) return null;
        const key = name.slice(prefix.length);
        if (settled["*"] === 1 || settled[`~${key}`] === 1) return null;
        if (key === FOLDER_KEY && renamed.unityFolder) return null;
        return key;
      },
      database(name) {
        const short = base(name);
        if (!renamed.idb?.includes(short)) return name;
        return moved ? prefix + short : short;
      },
    };
  }

  function inLayout(names, save) {
    if (!names || !save) return save;
    const out = { ...save };
    if (save.ls) {
      out.ls = {};
      for (const [key, value] of Object.entries(save.ls))
        out.ls[names.key(key)] = value;
    }
    if (save.idb)
      out.idb = save.idb.map((database) => ({
        ...database,
        name: names.database(database.name),
      }));
    return out;
  }

  // Copies a whole database, its stores, indexes and records, to a new
  // name. Every game that shared it gets every record: the ones that are not
  // its own are left alone and never synced.
  async function copyDatabase(from, to) {
    const source = await openDatabase(from);
    const stores = [];
    let version;
    try {
      version = source.version;
      const names = [...source.objectStoreNames];
      if (names.length) {
        const transaction = source.transaction(names, "readonly");
        for (const name of names) {
          const objectStore = transaction.objectStore(name);
          stores.push({
            name,
            keyPath: objectStore.keyPath,
            autoIncrement: objectStore.autoIncrement,
            indexes: [...objectStore.indexNames].map((index) => {
              const definition = objectStore.index(index);
              return {
                name: index,
                keyPath: definition.keyPath,
                unique: definition.unique,
                multiEntry: definition.multiEntry,
              };
            }),
            records: await readRecords(objectStore),
          });
        }
      }
    } finally {
      source.close();
    }
    const target = await openDatabase(to, version, (database) => {
      for (const store of stores) {
        const objectStore = database.createObjectStore(store.name, {
          keyPath: store.keyPath ?? undefined,
          autoIncrement: store.autoIncrement,
        });
        for (const index of store.indexes)
          objectStore.createIndex(index.name, index.keyPath, {
            unique: index.unique,
            multiEntry: index.multiEntry,
          });
      }
    });
    try {
      if (!stores.length) return;
      await new Promise((resolve, reject) => {
        const transaction = target.transaction(
          stores.map((store) => store.name),
          "readwrite",
        );
        for (const store of stores) {
          const objectStore = transaction.objectStore(store.name);
          for (const [key, value] of store.records) {
            if (store.keyPath === null) objectStore.put(value, key);
            else objectStore.put(value);
          }
        }
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () =>
          reject(transaction.error || new Error("aborted"));
      });
    } finally {
      target.close();
    }
  }

  function deleteDatabase(name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("blocked"));
    });
  }

  // Poki's master-loader keeps the save folder of the first Unity game it
  // saw in FOLDER_KEY and sends every later game's files there. The game
  // gets a copy of that folder under a name of its own, which goes in its
  // own FOLDER_KEY once the move is done. Returns that name, or null.
  async function copyUnityFolder(gameId, prefix) {
    if (store.get(prefix + FOLDER_KEY) !== null) return null;
    const shared = store.get(FOLDER_KEY);
    if (!shared || !(await databaseExists("/idbfs"))) return null;
    const own = (await sha256(`gms-unity-folder:${gameId}`)).slice(0, 32);
    const from = `/idbfs/${shared}`;
    const opened = await openDatabase("/idbfs");
    try {
      if (!opened.objectStoreNames.contains("FILE_DATA")) return null;
      const read = opened
        .transaction("FILE_DATA", "readonly")
        .objectStore("FILE_DATA");
      if (read.keyPath !== null) return null;
      const records = await readRecords(read, below(from));
      const folder = await done(read.get(from));
      if (folder !== undefined) records.push([from, folder]);
      if (!records.length) return own;
      await new Promise((resolve, reject) => {
        const transaction = opened.transaction("FILE_DATA", "readwrite");
        const write = transaction.objectStore("FILE_DATA");
        for (const [key, value] of records)
          write.put(value, `/idbfs/${own}${key.slice(from.length)}`);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () =>
          reject(transaction.error || new Error("aborted"));
      });
      return own;
    } finally {
      opened.close();
    }
  }

  // Copies a renamed game's databases (and Poki's folder) to their new
  // names, once per browser, while the game is not running. save-agent.js
  // switches to them only after the marker is set, so a game that starts
  // first keeps the old ones and the copy is dropped. Resolves to whether
  // the game's storage is under its new names.
  const moving = new Map();
  function moveStorage(gameId, renamed, allowed = () => true) {
    if (isMoved(gameId, renamed)) return Promise.resolve(true);
    if (!moving.has(gameId)) {
      moving.set(
        gameId,
        moveNow(gameId, renamed, allowed).finally(() => moving.delete(gameId)),
      );
    }
    return moving.get(gameId);
  }

  async function moveNow(gameId, renamed, allowed) {
    const prefix = `${gameId}:`;
    const made = [];
    try {
      if (await isRunningElsewhere(gameId)) return false;
      for (const name of renamed.idb || []) {
        // Left by a copy that never finished: nothing has used it.
        if (await databaseExists(prefix + name))
          await deleteDatabase(prefix + name);
        if (!(await databaseExists(name))) continue;
        made.push(prefix + name);
        await copyDatabase(name, prefix + name);
      }
      const folder = renamed.unityFolder
        ? await copyUnityFolder(gameId, prefix)
        : null;
      if (!allowed()) throw new Error("the game started first");
      if (folder) store.set(prefix + FOLDER_KEY, folder);
      store.set(movedKey(gameId), "1");
      return true;
    } catch (error) {
      console.warn("[cloud saves] moving storage", gameId, error);
      for (const name of made) await deleteDatabase(name).catch(() => {});
      return false;
    }
  }

  // ---- Saves -----------------------------------------------------------------

  // One game's save as it is in this browser now: { save, text, hash, size },
  // or null when the game has nothing stored here. `alsoFrom` adds the
  // storage another save of the game covers, so data written before
  // save-agent.js saw the game is found too.
  async function extract(gameId, { alsoFrom = null, owners = null } = {}) {
    const map = owners || (await ownership());
    const names = map.names(gameId);
    alsoFrom = inLayout(names, alsoFrom);
    const keys = map.lsKeysFor(gameId);
    for (const key of Object.keys(alsoFrom?.ls || {}))
      if (!isSiteKey(key)) keys.add(key);

    // A renamed game finds a key under its old name until it takes the
    // value over (save-agent.js), so its save has what it would find.
    const settled = names ? settledFor(gameId) : null;
    const ls = {};
    for (const key of keys) {
      let value = store.get(key);
      const old = value === null && names?.fallback(key, settled);
      if (old) value = store.get(old);
      if (value !== null) ls[key] = value;
    }

    const targets = new Map();
    for (const target of map.idbFor(gameId)) {
      targets.set(`${target.db}\u0000${target.store}`, {
        db: target.db,
        store: target.store,
        prefixes: new Set(target.prefixes),
        keys: [...target.keys],
      });
    }
    for (const database of alsoFrom?.idb || []) {
      for (const target of database.stores) {
        const name = `${database.name}\u0000${target.name}`;
        if (!targets.has(name))
          targets.set(name, {
            db: database.name,
            store: target.name,
            prefixes: new Set(),
            keys: [],
          });
        const into = targets.get(name);
        for (const prefix of target.prefixes || []) into.prefixes.add(prefix);
        for (const key of (target.keys || []).map(decodeValue))
          if (!into.keys.includes(key)) into.keys.push(key);
      }
    }
    const byDatabase = new Map();
    for (const target of targets.values()) {
      if (!byDatabase.has(target.db)) byDatabase.set(target.db, []);
      byDatabase.get(target.db).push(target);
    }
    const idb = [];
    for (const [name, list] of [...byDatabase].sort((a, b) =>
      a[0] < b[0] ? -1 : 1,
    )) {
      try {
        const found = await extractDatabase(name, list);
        if (found) idb.push(found);
      } catch (error) {
        throw new Error(
          `Couldn't read the game's saved files (${error.message})`,
        );
      }
    }

    const save = { v: 1 };
    if (Object.keys(ls).length) save.ls = ls;
    if (idb.length) save.idb = idb;
    if (!save.ls && !save.idb) return null;
    const text = stableStringify(save);
    return {
      save,
      text,
      hash: await sha256(text),
      size: new Blob([text]).size,
    };
  }

  // Puts a save into this browser's storage. The game's keys the save does
  // not have are removed, so the game finds exactly the save. On a failure
  // halfway, what was there before is put back.
  async function apply(gameId, save) {
    const renamed = (await registry())[gameId]?.renamed;
    if (renamed) await moveStorage(gameId, renamed);
    const owners = await ownership();
    const names = owners.names(gameId);
    save = inLayout(names, save);
    const before = await extract(gameId, { alsoFrom: save, owners });
    const keys = owners.lsKeysFor(gameId);
    for (const key of Object.keys(save.ls || {})) keys.add(key);

    const plans = [];
    for (const database of save.idb || [])
      plans.push(await planDatabase(database));

    const previous = new Map();
    const removed = [];
    try {
      for (const plan of plans) await writeDatabase(plan);
      for (const key of keys) {
        if (isSiteKey(key)) continue;
        previous.set(key, store.get(key));
        const value = save.ls?.[key];
        if (value === undefined) {
          store.remove(key);
          if (names?.fallback(key, {})) removed.push(key);
        } else store.set(key, value);
      }
      // A key the save does not have stays gone: the game must not find
      // it under its old name.
      if (removed.length) {
        const settled = settledFor(gameId);
        for (const key of removed)
          settled[`~${key.slice(names.prefix.length)}`] = 1;
        store.set(settledKey(gameId), JSON.stringify(settled));
      }
    } catch (error) {
      for (const [key, value] of previous) {
        try {
          if (value === null) store.remove(key);
          else store.set(key, value);
        } catch {}
      }
      if (before?.save.idb) {
        for (const database of before.save.idb) {
          try {
            await writeDatabase({ snapshot: database, version: null });
          } catch {}
        }
      }
      throw error.name === "QuotaExceededError"
        ? new Error("This browser is out of storage space for this save")
        : error;
    }
    await claimSave(gameId, save);
  }

  // ---- Network ---------------------------------------------------------------

  class SyncError extends Error {
    constructor(status, code, message) {
      super(message || code || `HTTP ${status}`);
      this.status = status;
      this.code = code;
    }
  }

  async function api(
    path,
    { method = "GET", body, keepalive = false, timeout = 20000 } = {},
  ) {
    const headers = {};
    let payload;
    if (body !== undefined) {
      payload = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
      if (
        !keepalive &&
        payload.length > 16384 &&
        typeof CompressionStream !== "undefined"
      ) {
        const stream = new Blob([payload])
          .stream()
          .pipeThrough(new CompressionStream("gzip"));
        payload = await new Response(stream).blob();
        headers["Content-Encoding"] = "gzip";
      }
    }
    let response;
    try {
      response = await apiRequest(path, {
        method,
        headers,
        body: payload,
        keepalive,
        cache: "no-store",
        credentials: "same-origin",
        signal: AbortSignal.timeout ? AbortSignal.timeout(timeout) : undefined,
      });
    } catch (error) {
      throw new SyncError(
        0,
        "offline",
        navigator.onLine === false
          ? "Waiting for connection"
          : "Couldn't reach 55GMS",
      );
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new SyncError(
        response.status,
        data.error,
        data.message || data.error,
      );
    return data;
  }

  const gamePath = (gameId) => `${API}/${encodeURIComponent(gameId)}`;

  // Whether this account syncs on its own (premium). The server decides
  // and enforces it; the answer is kept for a few minutes so a game launch
  // does not wait on it.
  async function entitlement({ fresh = false } = {}) {
    const uuid = account();
    if (!uuid) return { signedIn: false, autoSync: false };
    const cached = await meta("entitlement").catch(() => null);
    if (
      !fresh &&
      cached?.uuid === uuid &&
      Date.now() - cached.at < ENTITLEMENT_TTL_MS
    )
      return cached;
    try {
      const manifest = await api(API, { timeout: 4000 });
      return rememberManifest(uuid, manifest);
    } catch (error) {
      if (error.status === 401) {
        const value = {
          uuid,
          signedIn: false,
          autoSync: false,
          at: Date.now(),
          reason: "sign_in_again",
        };
        await setMeta("entitlement", value);
        return value;
      }
      if (error.status === 503 && error.code !== "unavailable") {
        return { uuid, signedIn: true, autoSync: false, off: true };
      }
      return cached?.uuid === uuid
        ? cached
        : { uuid, signedIn: true, autoSync: false, unknown: true };
    }
  }

  async function rememberManifest(uuid, manifest) {
    const value = {
      uuid,
      signedIn: true,
      premium: manifest.premium,
      autoSync: manifest.autoSync,
      legacy: Boolean(manifest.legacy),
      at: Date.now(),
    };
    await setMeta("entitlement", value);
    await setMeta("manifest", { uuid, at: Date.now(), manifest });
    return value;
  }

  async function manifest({ fresh = true, maxAge = Infinity } = {}) {
    const uuid = account();
    if (!uuid) return null;
    if (!fresh) {
      const cached = await meta("manifest");
      if (cached?.uuid === uuid && Date.now() - cached.at < maxAge)
        return cached.manifest;
    }
    const data = await api(API);
    await rememberManifest(uuid, data);
    return data;
  }

  // ---- Sync ------------------------------------------------------------------

  const inFlight = new Map();
  const suspended = new Set();
  let activeGame = null;

  function withLock(name, work) {
    if (navigator.locks?.request) return navigator.locks.request(name, work);
    return work();
  }

  // The games running in this tab or another one.
  async function runningGames() {
    const running = new Set(activeGame ? [activeGame] : []);
    if (navigator.locks?.query) {
      const { held = [] } = await navigator.locks.query();
      for (const lock of held)
        if (lock.name.startsWith("gms-game:"))
          running.add(lock.name.slice("gms-game:".length));
    }
    return running;
  }

  async function isRunningElsewhere(gameId) {
    return (await runningGames()).has(gameId);
  }

  async function clearDirty(gameId, since) {
    await tx(["dirty"], "readwrite", async (t) => {
      const dirty = t.objectStore("dirty");
      const mark = await done(dirty.get(gameId));
      if (mark && mark.at <= since) dirty.delete(gameId);
    });
  }

  function failure(error, state) {
    const retry = RETRYABLE.has(error.status);
    const attempts = (state.attempts || 0) + 1;
    const wait = Math.min(10 * 60 * 1000, 5000 * 2 ** Math.min(attempts, 7));
    return {
      status:
        error.status === 0
          ? "offline"
          : retry
            ? "failed"
            : error.status === 401
              ? "signed-out"
              : "error",
      error: error.message,
      errorCode: error.code || null,
      attempts: retry ? attempts : state.attempts || 0,
      nextAttemptAt: retry
        ? Date.now() + wait * (0.75 + Math.random() / 2)
        : null,
    };
  }

  // Holds every lock in `names` while `work` runs. They are taken in sorted
  // order, so two tabs syncing overlapping games never wait on each other.
  function withLocks(names, work) {
    if (!navigator.locks?.request) return work();
    const sorted = [...new Set(names)].sort();
    const take = (index) =>
      index === sorted.length
        ? work()
        : navigator.locks.request(sorted[index], () => take(index + 1));
    return take(0);
  }

  // Runs `work` over `items`, at most `limit` at a time.
  async function mapLimit(items, limit, work) {
    const out = new Array(items.length);
    let next = 0;
    const worker = async () => {
      while (next < items.length) {
        const index = next++;
        out[index] = await work(items[index], index);
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(limit, items.length) }, worker),
    );
    return out;
  }

  // Sends entries to /api/saves-sync: one request, or a few when the games
  // are too many or too large for one. Returns each entry's result, in
  // order, and keeps the manifest the server answers with.
  async function sendBatch(entries, { mode, keepalive = false }) {
    const uuid = account();
    const device = await deviceId();
    const results = [];
    let chunk = [];
    let bytes = 0;
    const flush = async () => {
      if (!chunk.length) return;
      const games = chunk;
      chunk = [];
      bytes = 0;
      const answer = await api(SYNC_URL, {
        method: "POST",
        keepalive,
        body: { deviceId: device, mode, games },
      });
      if (answer.manifest)
        await rememberManifest(uuid, answer.manifest).catch(() => {});
      results.push(...answer.results);
    };
    for (const entry of entries) {
      const size = entry.data ? entry.data.length : 0;
      if (
        chunk.length &&
        (chunk.length >= BATCH_MAX_GAMES || bytes + size > BATCH_MAX_BYTES)
      )
        await flush();
      chunk.push(entry);
      bytes += size;
    }
    await flush();
    return results;
  }

  const resultError = (result) =>
    new SyncError(result.status, result.error, result.message);

  // Brings one game's save and the cloud's together; see syncGames.
  function syncGame(gameId, options = {}) {
    return syncGames([gameId], options).then((states) => states[0]);
  }

  // Brings games' saves and the cloud's together, all of them in one
  // request (and a second only for a game whose older data in this browser
  // must be offered after seeing the cloud's). mode "auto" is the background
  // sync premium allows; "manual" is a person pressing a button.
  // canApply(gameId) says whether the cloud's save may be written into this
  // browser now (never while the game is running); pull(gameId) whether it
  // is worth downloading at all. Returns each game's new state, in order.
  function syncGames(
    gameIds,
    {
      mode = "manual",
      canApply = () => true,
      pull = () => true,
      keepalive = false,
    } = {},
  ) {
    const uuid = account();
    if (!uuid) return Promise.resolve(gameIds.map(() => null));
    const fresh = [...new Set(gameIds)].filter((id) => !inFlight.has(id));
    if (fresh.length) {
      const run = withLocks(
        fresh.map((id) => `gms-sync:${id}`),
        () => syncLocked(fresh, uuid, { mode, canApply, pull, keepalive }),
      );
      for (const id of fresh) {
        const tracked = run
          .then((states) => states.get(id) ?? null)
          .finally(() => inFlight.delete(id));
        inFlight.set(id, tracked);
      }
    }
    return Promise.all(gameIds.map((id) => inFlight.get(id)));
  }

  async function syncLocked(
    gameIds,
    uuid,
    { mode, canApply, pull, keepalive },
  ) {
    const out = new Map();
    const [games, owners, ent] = await Promise.all([
      registry(),
      ownership(),
      meta("entitlement").catch(() => null),
    ]);
    const items = [];
    for (const gameId of gameIds) {
      const game = games[gameId];
      if (!game) {
        await tx(["dirty"], "readwrite", (t) =>
          t.objectStore("dirty").delete(gameId),
        );
        out.set(gameId, null);
      } else if (game.status === "local-only") {
        await clearDirty(gameId, Date.now());
        out.set(gameId, await setState(gameId, { status: "local-only" }, uuid));
      } else items.push({ gameId, game });
    }
    if (!items.length) return out;

    const started = Date.now();
    const fail = async (item, error) => {
      if (!(error instanceof SyncError))
        console.error("[cloud saves]", item.gameId, error);
      const status =
        error instanceof SyncError
          ? error
          : new SyncError(-1, "local", error.message);
      out.set(
        item.gameId,
        await setState(item.gameId, failure(status, item.state || {}), uuid),
      );
    };

    await mapLimit(items, 6, async (item) => {
      item.state = await getState(item.gameId, uuid);
      try {
        await setState(item.gameId, { status: "saving" }, uuid);
        item.local = await extract(item.gameId, { owners });
      } catch (error) {
        item.failed = true;
        await fail(item, error);
      }
    });

    const uploadOf = (item, copy) => {
      item.sent = copy;
      return {
        gameId: item.gameId,
        slot: "default",
        op: "sync",
        baseRevision: item.state.baseRevision,
        hash: copy.hash,
        data: copy.text,
        // A copy whose last change this browser never saw (written before
        // save-agent.js ran) goes as the oldest possible, so it does not
        // beat a newer cloud save on recency; it is kept in history if it
        // loses.
        modifiedAt: new Date(item.state.localChangedAt || 1).toISOString(),
      };
    };
    const checkOf = (item) => {
      const { gameId, game, state, local } = item;
      const entry = {
        gameId,
        slot: "default",
        op: "sync",
        hash: local?.hash || null,
        baseRevision: state.baseRevision || 0,
        pull: Boolean(pull(gameId)),
      };
      // Nothing in the cloud for this game: maybe in the old full backup,
      // which the server looks in for keys not tried before.
      if (ent?.legacy) {
        const wanted = owners.wantedFor(gameId);
        const tried = state.legacyTried || [];
        const untried = [...new Set([...(game.keys || []), ...wanted])].filter(
          (key) => !tried.includes(key),
        );
        if (untried.length) {
          entry.legacyKeys = wanted;
          item.untried = untried;
        }
      }
      return entry;
    };

    // Settles a save the cloud kept over this browser's: written in now
    // when allowed, else on the next launch.
    const takeCloud = async (item, save, kept) => {
      const { gameId } = item;
      if (!canApply(gameId)) {
        suspended.add(gameId);
        return setState(
          gameId,
          {
            status: "cloud-newer",
            pendingRevision: kept.revision,
            error: null,
          },
          uuid,
        );
      }
      await apply(gameId, save);
      const after = await extract(gameId);
      await clearDirty(gameId, started);
      return setState(
        gameId,
        {
          status: "synced",
          baseRevision: kept.revision,
          baseHash: after ? after.hash : kept.hash,
          cloudHash: kept.hash,
          lastSyncedAt: Date.now(),
          pendingRevision: null,
          attempts: 0,
          nextAttemptAt: null,
          error: null,
        },
        uuid,
      );
    };

    const settle = async (item, result) => {
      const { gameId, local } = item;
      if (result.result === "error") throw resultError(result);
      if (result.legacy && item.untried) {
        item.state = await setState(
          gameId,
          { legacyTried: [...(item.state.legacyTried || []), ...item.untried] },
          uuid,
        );
      }
      const state = item.state;
      if (item.sent) {
        if (result.result === "kept-cloud")
          return takeCloud(item, JSON.parse(result.data), result.save);
        await clearDirty(gameId, started);
        return setState(
          gameId,
          {
            status: "synced",
            baseRevision: result.save.revision,
            baseHash: item.sent.hash,
            cloudHash: result.save.hash,
            lastSyncedAt: Date.now(),
            attempts: 0,
            nextAttemptAt: null,
            error: null,
            lastRule: result.rule,
          },
          uuid,
        );
      }

      const cloud = result.save;
      if (!cloud) {
        await clearDirty(gameId, started);
        return setState(
          gameId,
          { status: local ? "synced" : "empty", baseRevision: 0, error: null },
          uuid,
        );
      }
      if (local && local.hash === cloud.hash) {
        await clearDirty(gameId, started);
        return setState(
          gameId,
          {
            status: "synced",
            baseRevision: cloud.revision,
            baseHash: local.hash,
            cloudHash: cloud.hash,
            lastSyncedAt: Date.now(),
            attempts: 0,
            nextAttemptAt: null,
            error: null,
          },
          uuid,
        );
      }
      if (local && cloud.revision === state.baseRevision) {
        return setState(gameId, { status: "synced", error: null }, uuid);
      }

      // The cloud has a newer save and this browser has not changed its own.
      if (result.data === undefined || !canApply(gameId)) {
        return setState(
          gameId,
          {
            status: "cloud-newer",
            pendingRevision: cloud.revision,
            error: null,
          },
          uuid,
        );
      }
      const save = JSON.parse(result.data);
      // Data this browser has for the game that predates save-agent.js and
      // was never synced: offered to the server first (the second request),
      // so it is compared with the cloud's instead of overwritten.
      const shadow = await extract(gameId, { alsoFrom: save });
      if (
        shadow &&
        shadow.hash !== cloud.hash &&
        shadow.hash !== state.baseHash
      )
        return { shadow };
      return takeCloud(item, save, cloud);
    };

    const round = async (list, entryOf) => {
      if (!list.length) return [];
      const entries = list.map(entryOf);
      const size = entries.reduce(
        (sum, entry) => sum + (entry.data ? entry.data.length : 0),
        0,
      );
      let results;
      try {
        results = await sendBatch(entries, {
          mode,
          keepalive: keepalive && size < KEEPALIVE_MAX_BYTES,
        });
      } catch (error) {
        for (const item of list) await fail(item, error);
        return [];
      }
      const again = [];
      for (const [index, item] of list.entries()) {
        try {
          const state = await settle(item, results[index] || {});
          if (state?.shadow) {
            item.shadow = state.shadow;
            again.push(item);
          } else out.set(item.gameId, state);
        } catch (error) {
          await fail(item, error);
        }
      }
      return again;
    };

    const ready = items.filter((item) => !item.failed);
    const shadows = await round(ready, (item) =>
      item.local && item.local.hash !== item.state.baseHash
        ? uploadOf(item, item.local)
        : checkOf(item),
    );
    await round(shadows, (item) => uploadOf(item, item.shadow));
    return out;
  }

  // Marks a game as changed in this browser, so it is synced (premium) or
  // shown as not synced yet (free), surviving a closed tab.
  async function markDirty(gameId) {
    await putOne("dirty", { id: gameId, at: Date.now() });
    await setState(gameId, { localChangedAt: Date.now() });
  }

  // ---- Running game ------------------------------------------------------------

  let session = null;

  function scheduleUpload(gameId, { now = false } = {}) {
    if (
      !session ||
      session.gameId !== gameId ||
      !session.auto ||
      suspended.has(gameId)
    )
      return;
    clearTimeout(session.timer);
    const first = session.firstChange || (session.firstChange = Date.now());
    const wait = now
      ? 0
      : Math.max(
          0,
          Math.min(UPLOAD_DEBOUNCE_MS, first + UPLOAD_MAX_WAIT_MS - Date.now()),
        );
    session.timer = setTimeout(() => {
      session.firstChange = 0;
      syncGame(gameId, {
        mode: "auto",
        canApply: () => false,
        pull: () => false,
        keepalive: now,
      }).then(retryLater);
    }, wait);
  }

  function retryLater(state) {
    if (!state?.nextAttemptAt || !session) return;
    clearTimeout(session.retry);
    session.retry = setTimeout(
      () => scheduleUpload(state.gameId, { now: true }),
      state.nextAttemptAt - Date.now(),
    );
  }

  // Called by save-agent.js in the game frame.
  function notify(gameId, what) {
    if (what === "change") {
      markDirty(gameId).catch(() => {});
      scheduleUpload(gameId);
    } else if (what === "hidden" || what === "closing") {
      if (session?.gameId === gameId && session.auto)
        scheduleUpload(gameId, { now: true });
    }
  }

  // Watches a running game: debounced uploads after it saves, a check every
  // minute for games whose saving cannot be seen, and a last upload when the
  // page is hidden. Never writes into the game's storage while it runs.
  async function attach(gameId, { standalone = false } = {}) {
    activeGame = gameId;
    const ent = await entitlement();
    session = { gameId, auto: Boolean(ent.autoSync), timer: 0, firstChange: 0 };
    if (navigator.locks?.request) {
      navigator.locks.request(
        `gms-game:${gameId}`,
        { mode: "shared" },
        () => new Promise(() => {}),
      );
    }
    if (!session.auto) return;
    let lastHash = (await extract(gameId).catch(() => null))?.hash || null;
    setInterval(async () => {
      if (document.visibilityState === "hidden") return;
      const now = await extract(gameId).catch(() => null);
      if (now && now.hash !== lastHash) {
        lastHash = now.hash;
        await markDirty(gameId);
        scheduleUpload(gameId);
      }
    }, CHECK_INTERVAL_MS);
    if (standalone) scheduleUpload(gameId);
    connectSocket();
    setTimeout(() => processQueue({ skip: gameId }), 8000);
  }

  // Starts a play page's game frame once its cloud save is settled: for
  // premium, a newer cloud save is put in place before the game loads.
  // Never holds the game back longer than the launch budget, and starts it
  // with the local save whenever the cloud cannot be reached.
  async function launch(frame) {
    const src = frame.dataset.src || frame.getAttribute("src");
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      overlay?.remove();
      if (frame.dataset.src) frame.src = frame.dataset.src;
    };
    let overlay = null;
    const showOverlay = setTimeout(() => {
      if (started) return;
      overlay = document.createElement("div");
      overlay.className = "gms-save-overlay";
      overlay.setAttribute("role", "status");
      overlay.textContent = "Loading your cloud save…";
      overlay.style.cssText =
        "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;" +
        "font:500 14px/1.4 Geist,system-ui,sans-serif;color:#cfd3dc;background:rgba(10,12,16,.6);pointer-events:none";
      frame.parentElement?.style.setProperty("position", "relative");
      frame.parentElement?.appendChild(overlay);
    }, 500);

    let gameId = null;
    try {
      const url = new URL(src, location.href);
      if (url.origin === location.origin)
        gameId = gameIdFromLocation(url.pathname, url.search);
    } catch {}

    // A renamed game's databases are copied to their new names before it
    // first starts, signed in or not. One that takes too long is left for
    // the next launch; the game keeps the old names meanwhile.
    let moved = true;
    try {
      moved = !gameId || store.get(movedKey(gameId)) === "1";
    } catch {}
    if (!moved) {
      await Promise.race([
        registry().then((games) => {
          const renamed = games[gameId]?.renamed;
          if (renamed) return moveStorage(gameId, renamed, () => !started);
        }),
        new Promise((resolve) => setTimeout(resolve, MOVE_BUDGET_MS)),
      ]).catch(() => {});
    }

    if (!gameId || !account()) {
      clearTimeout(showOverlay);
      start();
      if (gameId) attach(gameId).catch(() => {});
      return;
    }

    // A save being written in when time runs out is finished first: the
    // game must not start on half of it.
    let applying = false;
    const timeUp = () => {
      if (!applying) start();
    };
    let budget = setTimeout(timeUp, LAUNCH_BUDGET_MS);
    try {
      const [ent, games] = await Promise.all([entitlement(), registry()]);
      if (
        ent.autoSync &&
        games[gameId] &&
        games[gameId].status !== "local-only"
      ) {
        // A download in progress gets longer than the rest.
        clearTimeout(budget);
        budget = setTimeout(timeUp, LAUNCH_DOWNLOAD_BUDGET_MS);
        await syncGame(gameId, {
          mode: "auto",
          canApply: () => {
            if (started) return false;
            applying = true;
            return true;
          },
        });
      }
    } catch (error) {
      console.error("[cloud saves] launch", error);
    } finally {
      clearTimeout(budget);
      clearTimeout(showOverlay);
      start();
      attach(gameId).catch(() => {});
    }
  }

  // Syncs games changed earlier that never got to the cloud (closed tab,
  // lost connection), all in one request, skipping those that are running.
  let queueRunning = false;
  async function processQueue({ skip = null } = {}) {
    if (queueRunning || !account()) return;
    queueRunning = true;
    try {
      const ent = await entitlement();
      if (!ent.autoSync) return;
      const uuid = account();
      const [marks, states] = await Promise.all([
        getAll("dirty"),
        getAll("state"),
      ]);
      const due = new Set(
        marks.sort((a, b) => a.at - b.at).map((mark) => mark.id),
      );
      for (const state of states) {
        if (state.uuid === uuid && state.nextAttemptAt) due.add(state.gameId);
      }
      const running = await runningGames();
      const waiting = new Map(
        states
          .filter((state) => state.uuid === uuid)
          .map((state) => [state.gameId, state.nextAttemptAt]),
      );
      const ready = [...due].filter(
        (gameId) =>
          gameId !== skip &&
          !running.has(gameId) &&
          !(waiting.get(gameId) > Date.now()),
      );
      if (ready.length) await syncGames(ready, { mode: "auto" });
    } catch (error) {
      console.error("[cloud saves] queue", error);
    } finally {
      queueRunning = false;
    }
  }

  // ---- Notices from the account's other devices ---------------------------

  let socket = null;
  async function connectSocket() {
    if (socket || !account()) return;
    const ent = await entitlement();
    if (!ent.autoSync) return;
    if (!window.io) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL("/socket.io/socket.io.js", location.origin).href;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }).catch(() => null);
    }
    if (!window.io || socket) return;
    socket = window.io(location.origin, {
      transports: ["websocket", "polling"],
    });
    const subscribe = async () => {
      try {
        const { token } = await api("/api/saves-socket-token", {
          method: "POST",
          body: {},
        });
        socket.emit("saves_subscribe", { token });
      } catch {}
    };
    socket.on("connect", subscribe);
    socket.on("save_updated", async (notice) => {
      try {
        if (notice.deviceId && notice.deviceId === (await deviceId())) return;
        const state = await getState(notice.gameId);
        if (state.baseRevision === notice.revision) return;
        // The game running here keeps the save it started with; the new one
        // is taken on its next launch.
        if (await isRunningElsewhere(notice.gameId)) {
          await setState(notice.gameId, {
            status: "cloud-newer",
            pendingRevision: notice.revision,
          });
          return;
        }
        // Only games this browser has a copy of are refreshed.
        if (state.baseHash) await syncGame(notice.gameId, { mode: "auto" });
      } catch {}
    });
  }

  // ---- For the play page ------------------------------------------------------

  let dirtyCache = { key: null, dirty: false };

  // What the play page shows about a game's save: whether it can sync at
  // all, its last sync state, and whether this browser has changes the
  // cloud lacks.
  async function gameStatus(gameId) {
    const uuid = account();
    const game = (await registry())[gameId];
    if (!game) return { support: null };
    if (!uuid) return { support: game.status, signedIn: false };
    const [state, mark] = await Promise.all([
      getState(gameId, uuid),
      getOne("dirty", gameId),
    ]);
    // A write is not always a change (Unity rewrites its folders' times on
    // every start), so a marked game is compared with what was last synced,
    // once per mark.
    let dirty = false;
    if (mark) {
      const key = `${gameId}|${mark.at}|${state.baseHash}`;
      if (dirtyCache.key !== key) {
        const local = await extract(gameId).catch(() => null);
        dirtyCache = {
          key,
          dirty: Boolean(local) && local.hash !== state.baseHash,
        };
      }
      dirty = dirtyCache.dirty;
    }
    return {
      support: game.status,
      signedIn: true,
      saving: inFlight.has(gameId),
      dirty,
      state,
    };
  }

  // The Save button: uploads the running game's save now, for free accounts
  // too. Never writes into the running game; a newer cloud save waits for
  // the next launch.
  function saveNow(gameId) {
    suspended.delete(gameId);
    return syncGame(gameId, {
      mode: "manual",
      canApply: () => false,
      pull: () => false,
    });
  }

  // ---- For the profile page ----------------------------------------------------

  // Every game with a save here or in the cloud, with what the profile page
  // shows about it.
  async function overview({ fresh = true, maxAge } = {}) {
    const uuid = account();
    const [games, owners, cloud, states, marks] = await Promise.all([
      registry(),
      ownership(),
      manifest({ fresh, maxAge }).catch((error) => {
        if (error.status === 401 || error.status === 503) throw error;
        return null;
      }),
      getAll("state"),
      getAll("dirty"),
    ]);
    const stateOf = new Map(
      states
        .filter((state) => state.uuid === uuid)
        .map((state) => [state.gameId, state]),
    );
    const dirtyAt = new Map(marks.map((mark) => [mark.id, mark.at]));
    const cloudOf = new Map(
      (cloud?.saves || []).map((save) => [save.gameId, save]),
    );
    const ids = [...new Set([...cloudOf.keys(), ...owners.games.keys()])];
    const locals = await mapLimit(ids, 6, (gameId) =>
      games[gameId] ? extract(gameId, { owners }).catch(() => null) : null,
    );

    const list = [];
    for (const [index, gameId] of ids.entries()) {
      const game = games[gameId];
      if (!game) continue;
      const state = stateOf.get(gameId) || {};
      const local = locals[index];
      if (!local && !cloudOf.has(gameId)) continue;
      const remote = cloudOf.get(gameId) || null;
      let status;
      if (game.status === "local-only") status = "local-only";
      else if (inFlight.has(gameId)) status = "saving";
      else if (local && remote && local.hash === remote.hash) status = "synced";
      else if (local && local.hash !== state.baseHash) {
        // The manifest just loaded, so a "signed-out" left by an earlier
        // try is out of date.
        const kept = ["offline", "failed", "error"];
        if (!cloud) kept.push("signed-out");
        status = kept.includes(state.status) ? state.status : "not-synced";
      } else if (remote && !local) status = "cloud-only";
      else if (remote && remote.revision !== state.baseRevision)
        status = "cloud-newer";
      else status = local ? (remote ? "synced" : "not-synced") : "cloud-only";
      list.push({
        gameId,
        name: game.name,
        play: game.play || game.frame,
        support: game.status,
        status,
        error: state.error || null,
        local: local
          ? {
              size: local.size,
              hash: local.hash,
              changedAt: dirtyAt.get(gameId) || null,
            }
          : null,
        cloud: remote,
        lastSyncedAt:
          state.lastSyncedAt ||
          (remote && local && local.hash === remote.hash
            ? Date.parse(remote.lastSyncedAt)
            : null),
        shared: owners.shared(gameId).length,
      });
    }
    list.sort((a, b) => a.name.localeCompare(b.name));
    return { games: list, manifest: cloud };
  }

  // Sync now: every game this browser has a save of, and every game only in
  // the cloud, in one request. Changed ones are uploaded and settled;
  // unchanged ones take a newer cloud save, and games only in the cloud are
  // brought into this browser.
  async function syncAll({ onProgress } = {}) {
    const { games } = await overview({ fresh: false, maxAge: RECENT_MS });
    const ids = games
      .filter(
        (game) =>
          game.support !== "local-only" &&
          (game.local || (game.cloud && game.status === "cloud-only")),
      )
      .map((game) => game.gameId);
    if (!ids.length) return [];
    const running = await runningGames();
    onProgress?.(0, ids.length);
    const results = await syncGames(ids, {
      mode: "manual",
      canApply: (gameId) => !running.has(gameId),
      pull: (gameId) => !running.has(gameId),
    });
    onProgress?.(ids.length, ids.length);
    return results;
  }

  // Takes the cloud's current saves of games into this browser: one request
  // for the saves, and one more for this browser's own copies that differ,
  // which are kept in history instead of being lost. Returns, in order,
  // each game's new state or { error }.
  async function restoreGames(gameIds, { onProgress } = {}) {
    const running = await runningGames();
    const out = new Map();
    for (const gameId of gameIds)
      if (running.has(gameId))
        out.set(gameId, {
          error: new Error("Close the game first, then restore"),
        });
    const ids = gameIds.filter((gameId) => !out.has(gameId));
    if (ids.length) {
      await withLocks(
        ids.map((gameId) => `gms-sync:${gameId}`),
        async () => {
          const fetched = await sendBatch(
            ids.map((gameId) => ({ gameId, slot: "default", op: "get" })),
            { mode: "manual" },
          );
          const items = [];
          const backups = [];
          for (const [index, gameId] of ids.entries()) {
            const result = fetched[index] || {};
            try {
              if (result.result === "error") throw resultError(result);
              const save = JSON.parse(result.data);
              const local = await extract(gameId, { alsoFrom: save });
              const state = await getState(gameId);
              const item = { gameId, save, kept: result.save };
              if (
                local &&
                local.hash !== result.save.hash &&
                local.hash !== state.baseHash
              ) {
                item.backup = backups.length;
                backups.push({
                  gameId,
                  slot: "default",
                  op: "backup",
                  hash: local.hash,
                  data: local.text,
                });
              }
              items.push(item);
            } catch (error) {
              out.set(gameId, { error });
            }
          }
          const kept = backups.length
            ? await sendBatch(backups, { mode: "manual" })
            : [];
          let finished = 0;
          for (const item of items) {
            try {
              const backup = kept[item.backup];
              if (backup?.result === "error") throw resultError(backup);
              await apply(item.gameId, item.save);
              const after = await extract(item.gameId);
              await clearDirty(item.gameId, Date.now());
              out.set(
                item.gameId,
                await setState(item.gameId, {
                  status: "synced",
                  baseRevision: item.kept.revision,
                  baseHash: after ? after.hash : item.kept.hash,
                  cloudHash: item.kept.hash,
                  lastSyncedAt: Date.now(),
                  pendingRevision: null,
                  error: null,
                  attempts: 0,
                  nextAttemptAt: null,
                }),
              );
            } catch (error) {
              out.set(item.gameId, { error });
            }
            onProgress?.(++finished, items.length);
          }
        },
      );
    }
    return gameIds.map((gameId) => out.get(gameId));
  }

  // Restore: takes the cloud's current save of a game into this browser.
  // This browser's own copy, if it differs, is offered to the server first,
  // so it lands in history instead of being lost.
  async function restore(gameId) {
    const [result] = await restoreGames([gameId]);
    if (result?.error) throw result.error;
    return result;
  }

  // Load from cloud: takes every cloud save this browser lacks or has an
  // older copy of. Games with changes here that aren't uploaded yet, and
  // games running in another tab, are left alone and counted as skipped.
  async function restoreAll({ onProgress } = {}) {
    const { games } = await overview({ fresh: false, maxAge: RECENT_MS });
    const work = games.filter(
      (game) =>
        game.cloud &&
        game.support !== "local-only" &&
        ["cloud-only", "cloud-newer"].includes(game.status),
    );
    const skipped = games.filter(
      (game) =>
        game.cloud &&
        game.support !== "local-only" &&
        ["not-synced", "offline", "failed", "error"].includes(game.status),
    ).length;
    const ids = work.map((game) => game.gameId);
    const states = ids.length ? await restoreGames(ids, { onProgress }) : [];
    const results = ids.map((gameId, index) =>
      states[index]?.error
        ? { gameId, error: states[index].error }
        : { gameId, state: states[index] },
    );
    return { results, skipped };
  }

  async function history(gameId) {
    return api(`${gamePath(gameId)}/history`);
  }

  // Makes an earlier version the cloud save and puts it in this browser.
  async function restoreVersion(gameId, versionId) {
    if (await isRunningElsewhere(gameId))
      throw new Error("Close the game first, then restore");
    return withLock(`gms-sync:${gameId}`, async () => {
      const restored = await api(`${gamePath(gameId)}/restore`, {
        method: "POST",
        body: { versionId, deviceId: await deviceId() },
      });
      await apply(gameId, JSON.parse(restored.data));
      const after = await extract(gameId);
      await clearDirty(gameId, Date.now());
      return setState(gameId, {
        status: "synced",
        baseRevision: restored.save.revision,
        baseHash: after ? after.hash : restored.save.hash,
        cloudHash: restored.save.hash,
        lastSyncedAt: Date.now(),
        error: null,
      });
    });
  }

  // Background start on other site pages: sync what is waiting, quietly.
  function background() {
    if (!account()) return;
    window.addEventListener("online", () => processQueue({ skip: activeGame }));
    setTimeout(() => processQueue({ skip: activeGame }), 3000);
  }

  window.addEventListener("online", () => {
    if (session?.auto) scheduleUpload(session.gameId, { now: true });
  });

  return {
    launch,
    attach,
    notify,
    background,
    processQueue,
    syncGame,
    syncGames,
    syncAll,
    gameStatus,
    saveNow,
    overview,
    restore,
    restoreAll,
    restoreVersion,
    history,
    entitlement,
    registry,
    on,
    gameIdFromLocation,
    isSiteKey,
    SyncError,
  };
})();

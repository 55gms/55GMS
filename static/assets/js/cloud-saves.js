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
  const ENTITLEMENT_TTL_MS = 10 * 60 * 1000;
  const UPLOAD_DEBOUNCE_MS = 20000;
  const UPLOAD_MAX_WAIT_MS = 60000;
  const CHECK_INTERVAL_MS = 60000;
  const LAUNCH_BUDGET_MS = 5000;
  const LAUNCH_DOWNLOAD_BUDGET_MS = 12000;
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

  // ---- Ownership -----------------------------------------------------------

  // Which storage belongs to which game, from save-agent.js's records and
  // the registry's known keys. A localStorage key two games both use is
  // left out of both saves, unless the registry gives it to one of them.
  async function ownership() {
    const [claims, games] = await Promise.all([getAll("claims"), registry()]);
    const byGame = new Map();
    const keyOwners = new Map();
    const entry = (gameId) => {
      if (!byGame.has(gameId)) {
        byGame.set(gameId, { ls: new Set(), want: new Set(), idb: new Map() });
      }
      return byGame.get(gameId);
    };
    for (const claim of claims) {
      if (claim.kind === "ls") {
        entry(claim.gameId).ls.add(claim.key);
        if (!keyOwners.has(claim.key)) keyOwners.set(claim.key, new Set());
        keyOwners.get(claim.key).add(claim.gameId);
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
      lsKeysFor(gameId) {
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
        return [...(byGame.get(gameId)?.idb.values() || [])];
      },
      wantedFor(gameId) {
        return [
          ...(byGame.get(gameId)?.want || []),
          ...(byGame.get(gameId)?.ls || []),
        ];
      },
      shared(gameId) {
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
            found.set(JSON.stringify([typeof key, key]), [key, value]);
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
          records.push([await encodeValue(key), await encodeValue(value)]);
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
      await new Promise((resolve, reject) => {
        const transaction = opened.transaction(
          snapshot.stores.map((target) => target.name),
          "readwrite",
        );
        for (const target of snapshot.stores) {
          const objectStore = transaction.objectStore(target.name);
          for (const prefix of target.prefixes || []) {
            objectStore.delete(prefix);
            objectStore.delete(below(prefix));
          }
          for (const key of (target.keys || []).map(decodeValue))
            objectStore.delete(key);
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

  // ---- Saves -----------------------------------------------------------------

  // One game's save as it is in this browser now: { save, text, hash, size },
  // or null when the game has nothing stored here. `alsoFrom` adds the
  // storage another save of the game covers, so data written before
  // save-agent.js saw the game is found too.
  async function extract(gameId, { alsoFrom = null, owners = null } = {}) {
    const map = owners || (await ownership());
    const keys = map.lsKeysFor(gameId);
    for (const key of Object.keys(alsoFrom?.ls || {}))
      if (!isSiteKey(key)) keys.add(key);

    const ls = {};
    for (const key of keys) {
      const value = store.get(key);
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
    const owners = await ownership();
    const before = await extract(gameId, { alsoFrom: save, owners });
    const keys = owners.lsKeysFor(gameId);
    for (const key of Object.keys(save.ls || {})) keys.add(key);

    const plans = [];
    for (const database of save.idb || [])
      plans.push(await planDatabase(database));

    const previous = new Map();
    try {
      for (const plan of plans) await writeDatabase(plan);
      for (const key of keys) {
        if (isSiteKey(key)) continue;
        previous.set(key, store.get(key));
        const value = save.ls?.[key];
        if (value === undefined) store.remove(key);
        else store.set(key, value);
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
      response = await fetch(new URL(path, location.origin), {
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

  async function manifest({ fresh = true } = {}) {
    const uuid = account();
    if (!uuid) return null;
    if (!fresh) {
      const cached = await meta("manifest");
      if (cached?.uuid === uuid) return cached.manifest;
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

  async function isRunningElsewhere(gameId) {
    if (activeGame === gameId) return true;
    if (!navigator.locks?.query) return false;
    const { held = [] } = await navigator.locks.query();
    return held.some((lock) => lock.name === `gms-game:${gameId}`);
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

  // Brings one game's save and the cloud's together. mode "auto" is the
  // background sync premium allows; "manual" is a person pressing a button.
  // canApply says whether the cloud's save may be written into this browser
  // now (never while the game is running). Returns the game's new state.
  function syncGame(
    gameId,
    { mode = "manual", canApply = () => true, keepalive = false } = {},
  ) {
    if (inFlight.has(gameId)) return inFlight.get(gameId);
    const uuid = account();
    if (!uuid) return Promise.resolve(null);
    const run = withLock(`gms-sync:${gameId}`, () =>
      syncLocked(gameId, uuid, { mode, canApply, keepalive }),
    );
    const tracked = run.finally(() => inFlight.delete(gameId));
    inFlight.set(gameId, tracked);
    return tracked;
  }

  async function syncLocked(gameId, uuid, { mode, canApply, keepalive }) {
    const games = await registry();
    const game = games[gameId];
    if (!game) {
      await tx(["dirty"], "readwrite", (t) =>
        t.objectStore("dirty").delete(gameId),
      );
      return null;
    }
    if (game.status === "local-only") {
      await clearDirty(gameId, Date.now());
      return setState(gameId, { status: "local-only" }, uuid);
    }

    const started = Date.now();
    let state = await getState(gameId, uuid);
    try {
      await setState(gameId, { status: "saving" }, uuid);
      const device = await deviceId();
      let local = await extract(gameId);

      // Settles a save the cloud kept over this browser's: written in now
      // when allowed, else on the next launch.
      const takeCloud = async (save, kept) => {
        if (!canApply()) {
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

      const upload = async (copy, baseRevision) => {
        const result = await api(gamePath(gameId), {
          method: "POST",
          keepalive: keepalive && copy.size < KEEPALIVE_MAX_BYTES,
          body: {
            slot: "default",
            baseRevision,
            hash: copy.hash,
            data: copy.text,
            // A copy whose last change this browser never saw (written
            // before save-agent.js ran) goes as the oldest possible, so it
            // does not beat a newer cloud save on recency; it is kept in
            // history if it loses.
            modifiedAt: new Date(state.localChangedAt || 1).toISOString(),
            deviceId: device,
            mode,
          },
        });
        if (result.result === "kept-cloud") {
          return takeCloud(JSON.parse(result.data), result.save);
        }
        await clearDirty(gameId, started);
        return setState(
          gameId,
          {
            status: "synced",
            baseRevision: result.save.revision,
            baseHash: copy.hash,
            cloudHash: result.save.hash,
            lastSyncedAt: Date.now(),
            attempts: 0,
            nextAttemptAt: null,
            error: null,
            lastRule: result.rule,
          },
          uuid,
        );
      };

      const dirty = local && local.hash !== state.baseHash;
      if (dirty) return await upload(local, state.baseRevision);

      const { save: cloud } = await api(`${gamePath(gameId)}?meta=1`);
      if (!cloud) {
        // Nothing in the cloud for this game: maybe in the old full backup.
        const ent = await meta("entitlement");
        const wanted = (await ownership()).wantedFor(gameId);
        const tried = state.legacyTried || [];
        const fresh = [...new Set([...(game.keys || []), ...wanted])].filter(
          (key) => !tried.includes(key),
        );
        if (ent?.legacy && fresh.length) {
          const imported = await api(`${gamePath(gameId)}/import-legacy`, {
            method: "POST",
            body: { keys: wanted, deviceId: device },
          });
          state = await setState(
            gameId,
            { legacyTried: [...tried, ...fresh] },
            uuid,
          );
          if (imported.result === "imported" || imported.result === "exists") {
            return syncLocked(gameId, uuid, { mode, canApply, keepalive });
          }
        }
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
      if (!canApply()) {
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
      const full = await api(gamePath(gameId));
      const save = JSON.parse(full.data);
      // Data this browser has for the game that predates save-agent.js and
      // was never synced: offer it to the server first, so it is compared
      // with the cloud's instead of overwritten.
      const shadow = await extract(gameId, { alsoFrom: save });
      if (
        shadow &&
        shadow.hash !== full.save.hash &&
        shadow.hash !== state.baseHash
      ) {
        local = shadow;
        return await upload(shadow, state.baseRevision);
      }
      return await takeCloud(save, full.save);
    } catch (error) {
      if (!(error instanceof SyncError))
        console.error("[cloud saves]", gameId, error);
      const status =
        error instanceof SyncError
          ? error
          : new SyncError(-1, "local", error.message);
      return setState(gameId, failure(status, state), uuid);
    }
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
  // lost connection), oldest first, skipping one that is running.
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
      for (const gameId of due) {
        if (gameId === skip) continue;
        const state = await getState(gameId, uuid);
        if (state.nextAttemptAt && state.nextAttemptAt > Date.now()) continue;
        if (await isRunningElsewhere(gameId)) continue;
        await syncGame(gameId, { mode: "auto" });
      }
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

  // ---- For the profile page ----------------------------------------------------

  // Every game with a save here or in the cloud, with what the profile page
  // shows about it.
  async function overview({ fresh = true } = {}) {
    const uuid = account();
    const [games, owners, cloud, states, marks] = await Promise.all([
      registry(),
      ownership(),
      manifest({ fresh }).catch((error) => {
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
    const ids = new Set([...cloudOf.keys(), ...owners.games.keys()]);

    const list = [];
    for (const gameId of ids) {
      const game = games[gameId];
      if (!game) continue;
      const state = stateOf.get(gameId) || {};
      let local = null;
      try {
        local = await extract(gameId, { owners });
      } catch {}
      if (!local && !cloudOf.has(gameId)) continue;
      const remote = cloudOf.get(gameId) || null;
      let status;
      if (game.status === "local-only") status = "local-only";
      else if (inFlight.has(gameId)) status = "saving";
      else if (local && remote && local.hash === remote.hash) status = "synced";
      else if (local && local.hash !== state.baseHash) {
        status = ["offline", "failed", "error", "signed-out"].includes(
          state.status,
        )
          ? state.status
          : "not-synced";
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

  // Sync now: every game this browser has a save of. Changed ones are
  // uploaded and settled; unchanged ones take a newer cloud save. Games only
  // in the cloud are left for their own Restore, or a premium launch.
  async function syncAll({ onProgress } = {}) {
    const { games } = await overview();
    const work = games.filter(
      (game) => game.local && game.support !== "local-only",
    );
    let finished = 0;
    const results = [];
    for (const game of work) {
      const running = await isRunningElsewhere(game.gameId);
      results.push(
        await syncGame(game.gameId, {
          mode: "manual",
          canApply: () => !running,
        }),
      );
      finished += 1;
      onProgress?.(finished, work.length);
    }
    return results;
  }

  // Restore: takes the cloud's current save of a game into this browser.
  // This browser's own copy, if it differs, is offered to the server first,
  // so it lands in history instead of being lost.
  async function restore(gameId) {
    if (await isRunningElsewhere(gameId))
      throw new Error("Close the game first, then restore");
    return withLock(`gms-sync:${gameId}`, async () => {
      const full = await api(gamePath(gameId));
      const local = await extract(gameId, { alsoFrom: JSON.parse(full.data) });
      const state = await getState(gameId);
      if (
        local &&
        local.hash !== full.save.hash &&
        local.hash !== state.baseHash
      ) {
        await api(`${gamePath(gameId)}/backup`, {
          method: "POST",
          body: {
            hash: local.hash,
            data: local.text,
            deviceId: await deviceId(),
          },
        });
      }
      await apply(gameId, JSON.parse(full.data));
      const after = await extract(gameId);
      await clearDirty(gameId, Date.now());
      return setState(gameId, {
        status: "synced",
        baseRevision: full.save.revision,
        baseHash: after ? after.hash : full.save.hash,
        cloudHash: full.save.hash,
        lastSyncedAt: Date.now(),
        error: null,
        attempts: 0,
        nextAttemptAt: null,
      });
    });
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
    syncAll,
    overview,
    restore,
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

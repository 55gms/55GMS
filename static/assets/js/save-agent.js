// Cloud save agent. Runs first in every game document under /misc/ (see
// scripts/add-save-agent.js) and records which localStorage keys and
// IndexedDB records the game uses, so its cloud save holds that game's data
// and nothing else. All games share this site's storage, so this is how one
// game's save is told apart from another's. It never sends anything itself:
// cloud-saves.js, on the page around the game, does the syncing.
//
// It must stay cheap (some games call getItem every frame) and must never
// throw into a game. Copied into the build as it is (scripts/build/util.js).
(function () {
  "use strict";
  if (window.__gmsSaveAgent) return;

  var DB_NAME = "gms-cloud-saves";
  var SITE_KEYS = {
    uuid: 1,
    username: 1,
    premium: 1,
    siteTheme: 1,
    tab: 1,
    aboutBlank: 1,
    adPrefs: 1,
    panicKey: 1,
    PanicLink: 1,
    pokiMigrated: 1,
  };
  // Must match isSiteStorageKey() in utils/saveRegistry.js.
  var SITE_PATTERNS = [
    /^55gms/i,
    /^gms[-:._]/i,
    /^__gms/i,
    /^[a-z]+-(last-body|viewed)$/,
    /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?@/i,
  ];
  var IGNORED_DATABASES = /cache|^firebase|^workbox|^__/i;

  function isSiteKey(key) {
    if (SITE_KEYS[key] === 1) return true;
    for (var i = 0; i < SITE_PATTERNS.length; i++) {
      if (SITE_PATTERNS[i].test(key)) return true;
    }
    return false;
  }

  // Must match gameIdFromLocation() in utils/saveRegistry.js.
  function gameIdFromLocation(pathname, search) {
    var decoded = String(pathname || "");
    try {
      decoded = decodeURIComponent(decoded);
    } catch (error) {}
    var match = /^\/misc\/(.+)$/.exec(decoded);
    if (!match) return null;
    var rest = match[1]
      .replace(/\/index\.html?$/i, "")
      .replace(/\.html?$/i, "")
      .replace(/\/+$/, "");
    if (!rest || /^(play|media)(\/|$)/i.test(rest)) return null;
    var id = rest;
    var params = new URLSearchParams(search || "");
    var names = ["swf", "game", "rom"];
    for (var i = 0; i < names.length; i++) {
      var value = params.get(names[i]);
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

  // A document framed by another game document belongs to that game.
  function findGameId() {
    try {
      var up = window.parent;
      if (up && up !== window && up.__gmsSaveAgent) {
        return up.__gmsSaveAgent.gameId;
      }
    } catch (error) {}
    return gameIdFromLocation(location.pathname, location.search);
  }

  var gameId = findGameId();
  if (!gameId) return;

  // Games that would share storage with another game keep theirs under
  // names of their own: every localStorage key as "<game id>:<key>", and
  // the databases in idb as "<game id>:<name>". The table and why each game
  // is in it: RENAMED in scripts/build-save-registry.js, which writes it here.
  // <renamed> Written by scripts/build-save-registry.js; do not edit.
  var RENAMED = {
    archeryworldtour: {},
    asmallworldcup: { idb: ["_C2SaveStates", "localforage"] },
    "bad-time-simulator": { idb: ["_C2SaveStates"] },
    "baseballbros-io": {},
    "big-tower-tiny-square": { idb: ["_C2SaveStates", "localforage"] },
    "car-machines": {},
    choppyorc: { idb: ["_C2SaveStates"] },
    dadish3d: { unityFolder: true },
    "digging-master": { unityFolder: true },
    "dino-bros": { idb: ["/sandbox"] },
    "drive-mad": { idb: ["/sandbox"] },
    eaglercraftx: {},
    "eggy-car": { idb: ["_C2SaveStates", "localforage"] },
    "flash-1on1soccer": {},
    "flash-alien-hominid": {},
    "flash-bloons-tower-defense-2": {},
    "flash-bloonstd1": {},
    "flash-bloonstd3": {},
    "flash-cubefield": {},
    "flash-duck-life": {},
    "flash-duck-life-2": {},
    "flash-duck-life-3": {},
    "flash-duck-life-4": {},
    "flash-fancy-pants-adventure2": {},
    "flash-fancypantsadventure": {},
    "flash-gfiles-btd4": {},
    "flash-gmayhem2": {},
    "flash-gun-mayhem-3": {},
    "flash-happywheels": {},
    "flash-hobo": {},
    "flash-hobo-2": {},
    "flash-hobo-3": {},
    "flash-hobo-4": {},
    "flash-hobo-5": {},
    "flash-hobo-6": {},
    "flash-hobo-7": {},
    "flash-learn-to-fly-2": {},
    "flash-tetris": {},
    "flash-thebindingofisaac": {},
    "flash-whack-your-boss-24": {},
    "flash-whack-your-computer-12-ways": {},
    "flash-whack-your-ex": {},
    "flash-worlds-hardest-game-2": {},
    gobble: { idb: ["/sandbox"] },
    golforbit: { unityFolder: true },
    "idle-cowshed": { idb: ["_C2SaveStates", "localforage"] },
    "idle-digging-tycoon": { unityFolder: true },
    "idle-lumber-inc": { unityFolder: true },
    "kick-the-buddy": {},
    knifehit: { idb: ["_C2SaveStates", "localforage"] },
    littlealchemy: {},
    longcat: { idb: ["/sandbox"] },
    "misc-eloader": {},
    "monster-match": { idb: ["/sandbox"] },
    "monster-track": { idb: ["/sandbox"] },
    mrbullet: { idb: ["_C2SaveStates"] },
    mrracer: { unityFolder: true },
    "my-perfect-hotel": { unityFolder: true },
    ovo: { idb: ["_C2SaveStates", "localforage"] },
    ovo3: { idb: ["_C2SaveStates", "localforage"] },
    "paper-plane": { idb: ["_C2SaveStates", "localforage"] },
    "penalty-shooters-2": { idb: ["_C2SaveStates"] },
    policechase: { unityFolder: true },
    "ragdoll-fall": { unityFolder: true },
    recoil: { idb: ["/sandbox"] },
    "redball-4": { unityFolder: true },
    roller: { idb: ["/sandbox"] },
    roper: { idb: ["/sandbox"] },
    sandboxels: {},
    "slime-journey": { unityFolder: true },
    "smash-it": { unityFolder: true },
    "snake-pivot": { idb: ["/sandbox"] },
    "snow-train-odyssey": {},
    soccerbros: {},
    stacktris: { idb: ["/sandbox"] },
    "steal-a-brainrot": {},
    "stickman-boost": { idb: ["_C2SaveStates", "localforage"] },
    "stunt-bike-extreme": { unityFolder: true },
    "stunt-car-extreme": { unityFolder: true },
    tabletennisworldtour: {},
    thereisnogame: { idb: ["_C2SaveStates"] },
    wordle: {},
  };
  // </renamed>
  var renamed = Object.prototype.hasOwnProperty.call(RENAMED, gameId)
    ? RENAMED[gameId]
    : null;
  var PREFIX = gameId + ":";
  // Keys whose old value was taken over, or that the game wrote or removed
  // under its new name: the old name is never read for them again. "~<key>"
  // per key, "*" for all of them once the game cleared its storage.
  var SETTLED_KEY = "gms-renamed:" + gameId;
  // Set by cloud-saves.js once it has copied the game's databases (and
  // Poki's folder) to their new names; until then the game keeps the old.
  var MOVED_KEY = "gms-renamed-idb:" + gameId;
  var FOLDER_KEY = "savegame_idbfs_hash";
  var moved = !(renamed && (renamed.idb || renamed.unityFolder));

  var storage = null;
  try {
    storage = window.localStorage;
  } catch (error) {}
  // What the game sees as window.localStorage; see below.
  var wrapper = null;

  // claim id -> record, waiting to be written to IndexedDB.
  var pending = {};
  var pendingCount = 0;
  // Keys already recorded in this document, so repeat calls cost a lookup.
  var ownedKeys = {};
  var wantedKeys = {};
  var idbClaims = {};
  var changedByOthers = {};
  var dirty = false;
  var flushTimer = 0;
  var notifyTimer = 0;
  var engine = null;

  function claim(id, record) {
    if (pending[id]) return;
    pending[id] = record;
    pendingCount += 1;
    schedule();
  }

  function noteKey(key, owned) {
    key = String(key);
    if (owned) {
      if (ownedKeys[key] === 1) return;
      if (isSiteKey(key)) return;
      ownedKeys[key] = 1;
      claim(gameId + "\u0000ls\u0000" + key, {
        id: gameId + "\u0000ls\u0000" + key,
        gameId: gameId,
        kind: "ls",
        key: key,
        owned: true,
        at: Date.now(),
      });
    } else {
      if (wantedKeys[key] === 1 || ownedKeys[key] === 1) return;
      if (isSiteKey(key)) return;
      wantedKeys[key] = 1;
      claim(gameId + "\u0000want\u0000" + key, {
        id: gameId + "\u0000want\u0000" + key,
        gameId: gameId,
        kind: "want",
        key: key,
        at: Date.now(),
      });
    }
  }

  function changed() {
    dirty = true;
    schedule();
    if (notifyTimer) return;
    notifyTimer = setTimeout(function () {
      notifyTimer = 0;
      tellEngine("change");
    }, 1000);
  }

  function schedule() {
    if (flushTimer) return;
    flushTimer = setTimeout(flush, 2000);
  }

  // ---- localStorage ----------------------------------------------------

  var getItem, setItem, removeItem, keyAt;

  var settled = null;
  var settledTimer = 0;
  function isSettled(key) {
    if (!settled) {
      settled = {};
      try {
        var saved = JSON.parse(getItem.call(storage, SETTLED_KEY) || "{}");
        if (saved && typeof saved === "object") settled = saved;
      } catch (error) {}
    }
    return settled["*"] === 1 || settled["~" + key] === 1;
  }
  function settle(key) {
    if (isSettled(key)) return;
    settled["~" + key] = 1;
    if (!settledTimer) settledTimer = setTimeout(saveSettled, 0);
  }
  function saveSettled() {
    clearTimeout(settledTimer);
    settledTimer = 0;
    try {
      if (settled) setItem.call(storage, SETTLED_KEY, JSON.stringify(settled));
    } catch (error) {}
  }

  // Whether a renamed game's key is kept under its new name. Site keys
  // never are; Poki's folder key only once its folder was copied.
  function mapped(key) {
    if (!renamed || isSiteKey(key)) return false;
    return key !== FOLDER_KEY || !renamed.unityFolder || moved;
  }

  // What a renamed game finds under a key: its own value, else, the first
  // time, the value under the old name, which becomes its own. Poki's
  // folder key is never taken over: sharing it is what put every game's
  // files in one folder. quiet reads without taking anything over.
  function readMapped(key, quiet) {
    var value = getItem.call(storage, PREFIX + key);
    if (value !== null || isSettled(key)) return value;
    if (renamed.unityFolder && key === FOLDER_KEY) return null;
    var old = getItem.call(storage, key);
    if (quiet) return old;
    if (old === null) {
      settle(key);
      return null;
    }
    try {
      setItem.call(storage, PREFIX + key, old);
      settle(key);
      changed();
    } catch (error) {}
    return old;
  }
  function peek(key) {
    return mapped(key) ? readMapped(key, true) : getItem.call(storage, key);
  }

  if (storage && window.Storage) {
    var proto = Storage.prototype;
    getItem = proto.getItem;
    setItem = proto.setItem;
    removeItem = proto.removeItem;
    keyAt = proto.key;
    var clear = proto.clear;
    if (!moved) {
      try {
        moved = getItem.call(storage, MOVED_KEY) === "1";
      } catch (error) {}
    }

    // A call made on the wrapper below runs on the real storage.
    var real = function (self) {
      return self === wrapper ? storage : self;
    };
    proto.getItem = function (key) {
      var self = real(this);
      if (self === storage && mapped(String(key))) {
        var found = readMapped(String(key), false);
        try {
          if (found !== null) noteKey(PREFIX + key, true);
          else noteKey(key, false);
        } catch (error) {}
        return found;
      }
      var value = getItem.apply(self, arguments);
      if (self === storage) {
        try {
          noteKey(key, value !== null);
        } catch (error) {}
      }
      return value;
    };
    proto.setItem = function (key) {
      var self = real(this);
      if (self === storage && mapped(String(key))) {
        var args = Array.prototype.slice.call(arguments);
        args[0] = PREFIX + key;
        var stored = setItem.apply(self, args);
        try {
          settle(String(key));
          noteKey(args[0], true);
          changed();
        } catch (error) {}
        return stored;
      }
      var result = setItem.apply(self, arguments);
      if (self === storage) {
        try {
          if (!isSiteKey(String(key))) {
            noteKey(key, true);
            changed();
          }
        } catch (error) {}
      }
      return result;
    };
    proto.removeItem = function (key) {
      var self = real(this);
      var name = String(key);
      if (self === storage && mapped(name)) {
        name = PREFIX + name;
        removeItem.call(self, name);
        try {
          settle(String(key));
        } catch (error) {}
      } else {
        removeItem.apply(self, arguments);
      }
      if (self === storage) {
        try {
          if (ownedKeys[name] === 1) changed();
        } catch (error) {}
      }
    };
    proto.clear = function () {
      var self = real(this);
      if (self === storage && renamed) {
        // A renamed game clears its own keys, not every game's.
        var own = [];
        for (var i = 0; i < storage.length; i++) {
          var name = keyAt.call(storage, i);
          if (name !== null && name.indexOf(PREFIX) === 0) own.push(name);
        }
        for (var j = 0; j < own.length; j++) removeItem.call(storage, own[j]);
        settled = { "*": 1 };
        saveSettled();
        changed();
        return;
      }
      var result = clear.apply(self, arguments);
      if (self === storage) changed();
      return result;
    };
    // A renamed game sees its keys under the names it gave them.
    proto.key = function () {
      var self = real(this);
      var name = keyAt.apply(self, arguments);
      if (
        renamed &&
        self === storage &&
        typeof name === "string" &&
        name.indexOf(PREFIX) === 0
      ) {
        return name.slice(PREFIX.length);
      }
      return name;
    };

    // Games that read and write `localStorage[name]` (GameMaker, among
    // others) skip the methods above, so the game's window gets a wrapper
    // that turns those into getItem, setItem and removeItem. A read while
    // the game lists every key (Object.keys, for…in) is not a claim: it
    // would hand this game every other game's keys.
    var listing = false;
    var stopListing = function () {
      listing = false;
    };
    var member = function (name) {
      return typeof name !== "string" || name in proto;
    };
    var methods = {};
    try {
      var own = Object.getOwnPropertyDescriptor(window, "localStorage");
      if (window.Proxy && window.Reflect && (!own || own.configurable)) {
        wrapper = new Proxy(storage, {
          get: function (target, name) {
            if (member(name)) {
              var value = Reflect.get(target, name, target);
              if (typeof value !== "function") return value;
              if (!methods[name] || methods[name].of !== value) {
                methods[name] = { of: value, bound: value.bind(target) };
              }
              return methods[name].bound;
            }
            var item = listing ? peek(name) : target.getItem(name);
            return item === null ? undefined : item;
          },
          set: function (target, name, value) {
            if (typeof name !== "string") {
              return Reflect.set(target, name, value, target);
            }
            target.setItem(name, value);
            return true;
          },
          deleteProperty: function (target, name) {
            if (typeof name === "string" && peek(name) !== null) {
              target.removeItem(name);
              return true;
            }
            return Reflect.deleteProperty(target, name);
          },
          ownKeys: function (target) {
            if (!listing) {
              listing = true;
              setTimeout(stopListing, 0);
            }
            var names = Reflect.ownKeys(target);
            if (!renamed) return names;
            var seen = {};
            var own = [];
            for (var i = 0; i < names.length; i++) {
              var name = names[i];
              if (typeof name === "string") {
                if (name.indexOf(PREFIX) === 0)
                  name = name.slice(PREFIX.length);
                if (seen["~" + name] === 1) continue;
                seen["~" + name] = 1;
              }
              own.push(name);
            }
            return own;
          },
          // A renamed game's keys are not the target's own properties, so
          // `in` and Object.keys ask here.
          has: function (target, name) {
            if (!renamed || member(name)) return Reflect.has(target, name);
            return peek(name) !== null;
          },
          getOwnPropertyDescriptor: function (target, name) {
            if (!renamed || member(name)) {
              return Reflect.getOwnPropertyDescriptor(target, name);
            }
            var item = listing ? peek(name) : target.getItem(name);
            return item === null
              ? undefined
              : {
                  value: item,
                  writable: true,
                  enumerable: true,
                  configurable: true,
                };
          },
        });
        Object.defineProperty(window, "localStorage", {
          configurable: true,
          enumerable: true,
          get: function () {
            return wrapper;
          },
        });
      }
    } catch (error) {
      wrapper = null;
    }

    // Keys another document changed (another tab, the page around the game)
    // are not this game's, even when they change while it runs.
    window.addEventListener("storage", function (event) {
      if (event.storageArea === storage && event.key !== null) {
        changedByOthers[event.key] = 1;
      }
    });

    // Where the wrapper cannot be installed, keys written as
    // `localStorage.key = value` are found by comparing storage now and
    // then: a key that changed, that this document did not see another
    // document change, is this game's.
    var fingerprints = null;
    var fingerprint = function (value) {
      var hash = 2166136261;
      for (var i = 0; i < value.length; i += 1 + (value.length >> 12)) {
        hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
      }
      return value.length + ":" + (hash >>> 0);
    };
    var scan = function () {
      var next = {};
      try {
        for (var i = 0; i < storage.length; i++) {
          var key = keyAt.call(storage, i);
          if (key === null || isSiteKey(key)) continue;
          var value = getItem.call(storage, key);
          next[key] = value === null ? "" : fingerprint(value);
        }
      } catch (error) {
        return;
      }
      if (fingerprints) {
        var found = false;
        for (var name in next) {
          if (
            next[name] !== fingerprints[name] &&
            changedByOthers[name] !== 1
          ) {
            if (ownedKeys[name] !== 1) noteKey(name, true);
            found = true;
          }
        }
        if (found) changed();
      }
      fingerprints = next;
      changedByOthers = {};
    };
    setTimeout(scan, 0);
    setInterval(scan, 60000);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") scan();
    });
  }

  // ---- IndexedDB -------------------------------------------------------

  // What part of a store a written record makes this game's. Engines that
  // keep every game in one database name a per-game folder: Unity
  // /idbfs/<hash>/, Godot /userfs/godot/app_userdata/<project>/. Other file
  // paths claim their folder; other keys claim themselves.
  function claimFor(key) {
    if (typeof key === "number") return { key: key };
    if (typeof key !== "string") return null;
    var unity = /^\/idbfs\/[0-9a-f]{32}(?=\/|$)/.exec(key);
    if (unity) return { prefix: unity[0] };
    var godot = /^\/userfs\/godot\/app_userdata\/[^/]+/.exec(key);
    if (godot) return { prefix: godot[0] };
    if (key.charAt(0) === "/") {
      var parts = key.split("/");
      if (parts.length >= 4) return { prefix: parts.slice(0, -1).join("/") };
    }
    return { key: key };
  }

  function keyOf(store, value, explicit) {
    if (explicit !== undefined) return explicit;
    var path = store.keyPath;
    if (typeof path !== "string" || !value || typeof value !== "object") {
      return undefined;
    }
    var current = value;
    var steps = path.split(".");
    for (var i = 0; i < steps.length; i++) {
      if (current === null || typeof current !== "object") return undefined;
      current = current[steps[i]];
    }
    return current;
  }

  function noteRecord(store, value, explicit) {
    var database = store.transaction.db.name;
    if (database === DB_NAME || IGNORED_DATABASES.test(database)) return;
    if (IGNORED_DATABASES.test(store.name)) return;
    changed();
    recordClaim(database, store.name, keyOf(store, value, explicit));
  }

  function recordClaim(database, storeName, key) {
    var found = claimFor(key);
    if (!found) return;
    var id =
      gameId +
      "\u0000idb\u0000" +
      database +
      "\u0000" +
      storeName +
      "\u0000" +
      (found.prefix !== undefined ? "p:" + found.prefix : "k:" + found.key);
    if (idbClaims[id] === 1) return;
    idbClaims[id] = 1;
    claim(id, {
      id: id,
      gameId: gameId,
      kind: "idb",
      db: database,
      store: storeName,
      prefix: found.prefix,
      key: found.key,
      at: Date.now(),
    });
  }

  var put = null;
  if (window.IDBObjectStore) {
    var store = IDBObjectStore.prototype;
    put = store.put;
    var add = store.add;
    var remove = store["delete"];
    var wipe = store.clear;
    store.put = function (value, key) {
      var request = put.apply(this, arguments);
      try {
        noteRecord(this, value, arguments.length > 1 ? key : undefined);
      } catch (error) {}
      return request;
    };
    store.add = function (value, key) {
      var request = add.apply(this, arguments);
      try {
        noteRecord(this, value, arguments.length > 1 ? key : undefined);
      } catch (error) {}
      return request;
    };
    store["delete"] = function () {
      var request = remove.apply(this, arguments);
      try {
        var name = this.transaction.db.name;
        if (name !== DB_NAME && !IGNORED_DATABASES.test(name)) changed();
      } catch (error) {}
      return request;
    };
    store.clear = function () {
      var request = wipe.apply(this, arguments);
      try {
        var name = this.transaction.db.name;
        if (name !== DB_NAME && !IGNORED_DATABASES.test(name)) changed();
      } catch (error) {}
      return request;
    };
  }

  // A renamed game's databases, under their new names once cloud-saves.js
  // has copied them there (moved). Only this document is covered: none of
  // these games opens them from a Worker.
  if (renamed && renamed.idb && moved && window.IDBFactory) {
    var databases = {};
    for (var d = 0; d < renamed.idb.length; d++) {
      databases["~" + renamed.idb[d]] = 1;
    }
    var factory = IDBFactory.prototype;
    var renameOn = function (method) {
      var original = factory[method];
      if (!original) return;
      factory[method] = function (name) {
        var args = Array.prototype.slice.call(arguments);
        if (databases["~" + name] === 1) args[0] = PREFIX + name;
        return original.apply(this, args);
      };
    };
    renameOn("open");
    renameOn("deleteDatabase");
    var listDatabases = factory.databases;
    if (listDatabases) {
      factory.databases = function () {
        return listDatabases.apply(this, arguments).then(function (list) {
          var out = [];
          for (var i = 0; i < list.length; i++) {
            var info = list[i];
            if (databases["~" + info.name] === 1) continue;
            var short = info.name.slice(PREFIX.length);
            if (
              info.name.indexOf(PREFIX) === 0 &&
              databases["~" + short] === 1
            ) {
              info = { name: short, version: info.version };
            }
            out.push(info);
          }
          return out;
        });
      };
    }
  }

  // ---- Workers ---------------------------------------------------------

  // Some engines save from a Worker, where the patches above do not reach:
  // Construct 3 in worker mode, Eaglercraft's world server. Games here start
  // their workers from blobs (their scripts are on jsDelivr, another
  // origin), so a worker started from a blob first runs workerHook, which
  // reports its IndexedDB writes back to this document. It is turned into
  // source, so it uses nothing from outside itself but its arguments.
  function workerHook(channelName, ignored, ownDatabase, keyOf) {
    var proto = self.IDBObjectStore && IDBObjectStore.prototype;
    if (!proto || !self.BroadcastChannel) return;
    var channel = new BroadcastChannel(channelName);
    var sent = {};
    var waiting = 0;
    function report(store, value, explicit, write) {
      try {
        var database = store.transaction.db.name;
        if (database === ownDatabase || ignored.test(database)) return;
        if (ignored.test(store.name)) return;
        if (write) {
          var key = keyOf(store, value, explicit);
          if (typeof key === "string" || typeof key === "number") {
            var id = database + "\u0000" + store.name + "\u0000" + key;
            if (!sent[id]) {
              sent[id] = 1;
              channel.postMessage({
                db: database,
                store: store.name,
                key: key,
              });
            }
          }
        }
        if (!waiting) {
          waiting = setTimeout(function () {
            waiting = 0;
            channel.postMessage({ changed: true });
          }, 1000);
        }
      } catch (error) {}
    }
    function wrap(name, write) {
      var original = proto[name];
      proto[name] = function (value, key) {
        var request = original.apply(this, arguments);
        report(this, value, arguments.length > 1 ? key : undefined, write);
        return request;
      };
    }
    wrap("put", true);
    wrap("add", true);
    wrap("delete", false);
    wrap("clear", false);
  }

  var NativeWorker = window.Worker;
  if (NativeWorker && window.BroadcastChannel && window.Blob && window.URL) {
    try {
      var channelName =
        "gms-save-agent-" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2);
      var workerChannel = new BroadcastChannel(channelName);
      workerChannel.onmessage = function (event) {
        var data = event.data;
        if (!data) return;
        try {
          if (typeof data.db === "string" && typeof data.store === "string") {
            if (data.db === DB_NAME || IGNORED_DATABASES.test(data.db)) return;
            recordClaim(data.db, data.store, data.key);
          }
          changed();
        } catch (error) {}
      };
      var hookSource =
        "(" +
        workerHook +
        ")(" +
        JSON.stringify(channelName) +
        ", " +
        IGNORED_DATABASES +
        ", " +
        JSON.stringify(DB_NAME) +
        ", " +
        keyOf +
        ");\n";

      // The blob behind each blob: URL, to start a worker from it.
      var blobs = {};
      var createUrl = URL.createObjectURL;
      var revokeUrl = URL.revokeObjectURL;
      URL.createObjectURL = function (object) {
        var url = createUrl.apply(this, arguments);
        try {
          if (object instanceof Blob) blobs[url] = object;
        } catch (error) {}
        return url;
      };
      URL.revokeObjectURL = function (url) {
        try {
          delete blobs[url];
        } catch (error) {}
        return revokeUrl.apply(this, arguments);
      };
      var script = function (parts) {
        return createUrl.call(
          URL,
          new Blob(parts, { type: "text/javascript" }),
        );
      };
      // The hook and the game's script stay two scripts, so a "use strict"
      // at the top of the game's still applies.
      var withHook = function (url, options) {
        var blob = blobs[String(url)];
        if (!blob) return url;
        var hook = JSON.stringify(script([hookSource]));
        var game = JSON.stringify(script([blob]));
        return options && options.type === "module"
          ? script(["import " + hook + ";\nimport " + game + ";\n"])
          : script(["importScripts(" + hook + ", " + game + ");\n"]);
      };
      window.Worker = class Worker extends NativeWorker {
        constructor(url, options) {
          var target = url;
          try {
            target = withHook(url, options);
          } catch (error) {
            target = url;
          }
          super(target, options);
        }
      };
    } catch (error) {}
  }

  // ---- Recording -------------------------------------------------------

  // cloud-saves.js opens the same database with the same schema.
  function openDb(callback) {
    try {
      var request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        var names = ["claims", "dirty", "state", "meta"];
        for (var i = 0; i < names.length; i++) {
          if (!db.objectStoreNames.contains(names[i])) {
            db.createObjectStore(names[i], {
              keyPath: names[i] === "meta" ? "name" : "id",
            });
          }
        }
      };
      request.onsuccess = function () {
        callback(request.result);
      };
      request.onerror = function () {};
    } catch (error) {}
  }

  function flush() {
    flushTimer = 0;
    if (!pendingCount && !dirty) return;
    var records = pending;
    var wasDirty = dirty;
    pending = {};
    pendingCount = 0;
    dirty = false;
    openDb(function (db) {
      try {
        var transaction = db.transaction(["claims", "dirty"], "readwrite");
        var claims = transaction.objectStore("claims");
        for (var id in records) put.call(claims, records[id]);
        if (wasDirty) {
          put.call(transaction.objectStore("dirty"), {
            id: gameId,
            at: Date.now(),
          });
        }
        transaction.oncomplete = function () {
          db.close();
        };
      } catch (error) {
        db.close();
      }
    });
  }

  // The sync engine of the page around the game, or null.
  function findEngine() {
    if (engine) return engine;
    var frame = window;
    for (var depth = 0; depth < 6; depth++) {
      try {
        if (frame.GMSSaves && frame.GMSSaves.notify) {
          engine = frame.GMSSaves;
          return engine;
        }
      } catch (error) {
        return null;
      }
      if (frame.parent === frame) break;
      frame = frame.parent;
    }
    return null;
  }

  function tellEngine(what) {
    var found = findEngine();
    if (found) {
      try {
        found.notify(gameId, what);
      } catch (error) {}
    }
  }

  window.addEventListener("pagehide", function () {
    if (settledTimer) saveSettled();
    clearTimeout(flushTimer);
    flush();
    tellEngine("closing");
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      clearTimeout(flushTimer);
      flush();
      tellEngine("hidden");
    }
  });

  // A game opened on its own, not inside a play page, gets the engine too,
  // once it has loaded, so its saves still go to the cloud for a signed-in
  // account. Its cloud save cannot be restored before it starts here.
  window.addEventListener("load", function () {
    if (findEngine()) return;
    try {
      if (!storage || !getItem.call(storage, "uuid")) return;
    } catch (error) {
      return;
    }
    var script = document.createElement("script");
    // Absolute: game pages set <base> to the CDN.
    script.src = location.origin + "/assets/js/cloud-saves.js?v=7";
    script.async = true;
    script.onload = function () {
      if (window.GMSSaves) window.GMSSaves.attach(gameId, { standalone: true });
    };
    document.head.appendChild(script);
  });

  // ---- SDK for games built for 55GMS -----------------------------------

  var NATIVE_KEY = "native-save/" + gameId;
  window.gmsSaves = {
    gameId: gameId,
    // Saves any JSON-friendly data. progress is optional: numbers that only
    // grow, named in the game's registry entry, used to settle conflicts.
    save: function (data, options) {
      var record = {
        data: data,
        progress: (options && options.progress) || null,
        at: Date.now(),
      };
      localStorage.setItem(NATIVE_KEY, JSON.stringify(record));
    },
    load: function () {
      var raw = localStorage.getItem(NATIVE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw).data;
      } catch (error) {
        return null;
      }
    },
  };

  // raw: the unpatched methods, for cloud-saves.js when it runs in this
  // same document, so restoring a save is not recorded as the game's doing.
  window.__gmsSaveAgent = {
    gameId: gameId,
    flush: flush,
    // They run on the real storage whatever they are called on, as
    // localStorage in this window is the wrapper.
    raw:
      storage && window.Storage
        ? {
            getItem: function (name) {
              return getItem.call(storage, name);
            },
            setItem: function (name, value) {
              return setItem.call(storage, name, value);
            },
            removeItem: function (name) {
              return removeItem.call(storage, name);
            },
          }
        : null,
  };
})();

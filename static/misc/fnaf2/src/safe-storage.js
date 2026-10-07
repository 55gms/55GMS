// safe-storage.js
// Managed/school Chromebook profiles frequently block cookies and site data.
// On those profiles ANY touch of window.localStorage throws SecurityError.
// The Clickteam Fusion runtime touches localStorage while loading saved data
// (na.op / na.Gr in Runtime.js), so a single throw stalled the loader bar
// forever and the player never reached the game.
// This shim runs first and, only when real localStorage is unusable, swaps in an
// in-memory Storage work-alike so every later call site keeps working. Progress
// simply isn't persisted for that session, which beats not loading at all.
// Where localStorage works normally nothing is touched at all.
(function () {
  'use strict';

  function usable(s) {
    if (!s) return false;
    try {
      var k = '__pz_ls_probe__';
      s.setItem(k, '1');
      s.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function memoryStorage() {
    var data = Object.create(null);
    var api = {
      getItem: function (k) { k = String(k); return (k in data) ? data[k] : null; },
      setItem: function (k, v) { data[String(k)] = String(v); },
      removeItem: function (k) { delete data[String(k)]; },
      clear: function () { data = Object.create(null); },
      key: function (i) { var ks = Object.keys(data); i = Number(i); return (i >= 0 && i < ks.length) ? ks[i] : null; }
    };
    if (typeof Proxy !== 'function') {
      // No Proxy: plain object. Object.keys() won't list stored keys, but every
      // getItem/setItem/removeItem call still works, which is what matters.
      api.length = 0;
      return api;
    }
    return new Proxy(api, {
      get: function (t, p) {
        if (p === 'length') return Object.keys(data).length;
        if (Object.prototype.hasOwnProperty.call(api, p)) return api[p];
        if (typeof p === 'string' && (p in data)) return data[p];
        return undefined;
      },
      set: function (t, p, v) {
        if (p === 'length' || Object.prototype.hasOwnProperty.call(api, p)) return true;
        data[String(p)] = String(v);
        return true;
      },
      has: function (t, p) {
        return p === 'length' || Object.prototype.hasOwnProperty.call(api, p) || (typeof p === 'string' && (p in data));
      },
      deleteProperty: function (t, p) { delete data[String(p)]; return true; },
      ownKeys: function () { return Object.keys(data); },
      getOwnPropertyDescriptor: function (t, p) {
        if (typeof p === 'string' && (p in data)) {
          return { value: data[p], writable: true, enumerable: true, configurable: true };
        }
        return undefined;
      }
    });
  }

  function install(name) {
    var real = null;
    try { real = window[name]; } catch (e) { real = null; }
    if (usable(real)) return;
    var shim = memoryStorage();
    try {
      Object.defineProperty(window, name, { configurable: true, get: function () { return shim; } });
    } catch (e) {
      try { window[name] = shim; } catch (e2) { /* nothing more we can do */ }
    }
  }

  install('localStorage');
  install('sessionStorage');
})();

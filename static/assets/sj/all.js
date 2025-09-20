(() => {
  var e = {
      4322: function (e) {
        var t = { decodeValues: !0, map: !1, silent: !1 };
        function r(e) {
          return "string" == typeof e && !!e.trim();
        }
        function n(e, n) {
          var s,
            i,
            o,
            a,
            l = e.split(";").filter(r),
            c =
              ((s = l.shift()),
              (i = ""),
              (o = ""),
              (a = s.split("=")).length > 1
                ? ((i = a.shift()), (o = a.join("=")))
                : (o = s),
              { name: i, value: o }),
            u = c.name,
            d = c.value;
          n = n ? Object.assign({}, t, n) : t;
          try {
            d = n.decodeValues ? decodeURIComponent(d) : d;
          } catch (e) {
            console.error(
              "set-cookie-parser encountered an error while decoding a cookie with value '" +
                d +
                "'. Set options.decodeValues to false to disable this feature.",
              e
            );
          }
          var h = { name: u, value: d };
          return (
            l.forEach(function (e) {
              var t = e.split("="),
                r = t.shift().trimLeft().toLowerCase(),
                n = t.join("=");
              "expires" === r
                ? (h.expires = new Date(n))
                : "max-age" === r
                ? (h.maxAge = parseInt(n, 10))
                : "secure" === r
                ? (h.secure = !0)
                : "httponly" === r
                ? (h.httpOnly = !0)
                : "samesite" === r
                ? (h.sameSite = n)
                : "partitioned" === r
                ? (h.partitioned = !0)
                : (h[r] = n);
            }),
            h
          );
        }
        function s(e, s) {
          if (((s = s ? Object.assign({}, t, s) : t), !e))
            if (!s.map) return [];
            else return {};
          if (e.headers)
            if ("function" == typeof e.headers.getSetCookie)
              e = e.headers.getSetCookie();
            else if (e.headers["set-cookie"]) e = e.headers["set-cookie"];
            else {
              var i =
                e.headers[
                  Object.keys(e.headers).find(function (e) {
                    return "set-cookie" === e.toLowerCase();
                  })
                ];
              i ||
                !e.headers.cookie ||
                s.silent ||
                console.warn(
                  "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
                ),
                (e = i);
            }
          return (Array.isArray(e) || (e = [e]), s.map)
            ? e.filter(r).reduce(function (e, t) {
                var r = n(t, s);
                return (e[r.name] = r), e;
              }, {})
            : e.filter(r).map(function (e) {
                return n(e, s);
              });
        }
        (e.exports = s),
          (e.exports.parse = s),
          (e.exports.parseString = n),
          (e.exports.splitCookiesString = function (e) {
            if (Array.isArray(e)) return e;
            if ("string" != typeof e) return [];
            var t,
              r,
              n,
              s,
              i,
              o = [],
              a = 0;
            function l() {
              for (; a < e.length && /\s/.test(e.charAt(a)); ) a += 1;
              return a < e.length;
            }
            for (; a < e.length; ) {
              for (t = a, i = !1; l(); )
                if ("," === (r = e.charAt(a))) {
                  for (
                    n = a, a += 1, l(), s = a;
                    a < e.length &&
                    "=" !== (r = e.charAt(a)) &&
                    ";" !== r &&
                    "," !== r;

                  )
                    a += 1;
                  a < e.length && "=" === e.charAt(a)
                    ? ((i = !0), (a = s), o.push(e.substring(t, n)), (t = a))
                    : (a = n + 1);
                } else a += 1;
              (!i || a >= e.length) && o.push(e.substring(t, e.length));
            }
            return o;
          });
      },
      7302: function (e, t, r) {
        var n = {
          "./": "3255",
          "./client": "336",
          "./client.ts": "336",
          "./dom/attr": "1077",
          "./dom/attr.ts": "1077",
          "./dom/beacon": "7430",
          "./dom/beacon.ts": "7430",
          "./dom/cookie": "9116",
          "./dom/cookie.ts": "9116",
          "./dom/css": "6447",
          "./dom/css.ts": "6447",
          "./dom/document": "5351",
          "./dom/document.ts": "5351",
          "./dom/element": "7828",
          "./dom/element.ts": "7828",
          "./dom/fontface": "5426",
          "./dom/fontface.ts": "5426",
          "./dom/fragments": "5465",
          "./dom/fragments.ts": "5465",
          "./dom/history": "9804",
          "./dom/history.ts": "9804",
          "./dom/open": "7758",
          "./dom/open.ts": "7758",
          "./dom/origin": "6012",
          "./dom/origin.ts": "6012",
          "./dom/performance": "6286",
          "./dom/performance.ts": "6286",
          "./dom/protocol": "1974",
          "./dom/protocol.ts": "1974",
          "./dom/serviceworker": "9201",
          "./dom/serviceworker.ts": "9201",
          "./dom/storage": "5289",
          "./dom/storage.ts": "5289",
          "./entry": "1323",
          "./entry.ts": "1323",
          "./events": "1862",
          "./events.ts": "1862",
          "./helpers": "94",
          "./helpers.ts": "94",
          "./index": "3255",
          "./index.ts": "3255",
          "./location": "3696",
          "./location.ts": "3696",
          "./shared/antiantidebugger": "8382",
          "./shared/antiantidebugger.ts": "8382",
          "./shared/blob": "4634",
          "./shared/blob.ts": "4634",
          "./shared/caches": "5026",
          "./shared/caches.ts": "5026",
          "./shared/chrome": "6627",
          "./shared/chrome.ts": "6627",
          "./shared/err": "582",
          "./shared/err.ts": "582",
          "./shared/error": "6143",
          "./shared/error.ts": "6143",
          "./shared/eval": "591",
          "./shared/eval.ts": "591",
          "./shared/event": "3481",
          "./shared/event.ts": "3481",
          "./shared/function": "249",
          "./shared/function.ts": "249",
          "./shared/import": "2468",
          "./shared/import.ts": "2468",
          "./shared/indexeddb": "4338",
          "./shared/indexeddb.ts": "4338",
          "./shared/opfs": "6593",
          "./shared/opfs.ts": "6593",
          "./shared/postmessage": "1320",
          "./shared/postmessage.ts": "1320",
          "./shared/realm": "1914",
          "./shared/realm.ts": "1914",
          "./shared/requests/eventsource": "9701",
          "./shared/requests/eventsource.ts": "9701",
          "./shared/requests/fetch": "6972",
          "./shared/requests/fetch.ts": "6972",
          "./shared/requests/websocket": "9931",
          "./shared/requests/websocket.ts": "9931",
          "./shared/requests/xmlhttprequest": "248",
          "./shared/requests/xmlhttprequest.ts": "248",
          "./shared/settimeout": "7418",
          "./shared/settimeout.ts": "7418",
          "./shared/sourcemaps": "7791",
          "./shared/sourcemaps.ts": "7791",
          "./shared/worker": "9399",
          "./shared/worker.ts": "9399",
          "./shared/wrap": "581",
          "./shared/wrap.ts": "581",
          "./singletonbox": "1229",
          "./singletonbox.ts": "1229",
          "./swruntime": "8409",
          "./swruntime.ts": "8409",
          "./worker/importScripts": "9353",
          "./worker/importScripts.ts": "9353",
        };
        function s(e) {
          return r(i(e));
        }
        function i(e) {
          if (!r.o(n, e)) {
            var t = Error("Cannot find module '" + e + "'");
            throw ((t.code = "MODULE_NOT_FOUND"), t);
          }
          return n[e];
        }
        (s.keys = function () {
          return Object.keys(n);
        }),
          (s.resolve = i),
          (e.exports = s),
          (s.id = 7302);
      },
      409: function (e) {
        function t(e) {
          var t = Error("Cannot find module '" + e + "'");
          throw ((t.code = "MODULE_NOT_FOUND"), t);
        }
        (t.keys = () => []), (t.resolve = t), (t.id = 409), (e.exports = t);
      },
      336: function (e, t, r) {
        r.r(t), r.d(t, { ScramjetClient: () => g });
        var n = r(2794),
          s = r(94),
          i = r(3696),
          o = r(581),
          a = r(1862),
          l = r(1472),
          c = r(37),
          u = r(3831),
          d = r(1323),
          h = r(1229),
          p = r(236),
          f = r(8665).A;
        class g {
          global;
          locationProxy;
          serviceWorker;
          bare;
          natives;
          descriptors;
          wrapfn;
          cookieStore = new u.k();
          eventcallbacks = new Map();
          meta;
          box;
          constructor(e) {
            if (((this.global = e), n.pX in e))
              throw (
                (console.error(
                  "attempted to initialize a scramjet client, but one is already loaded - this is very bad"
                ),
                Error())
              );
            if (d.iswindow) {
              try {
                n.pX in e.parent && (this.box = e.parent[n.pX].box);
              } catch {}
              try {
                n.pX in e.top && (this.box = e.top[n.pX].box);
              } catch {}
              try {
                e.opener && n.pX in e.opener && (this.box = e.opener[n.pX].box);
              } catch {}
              this.box ||
                (f.warn("Creating SingletonBox"),
                (this.box = new h.SingletonBox(this)));
            } else this.box = new h.SingletonBox(this);
            this.box.registerClient(this, e),
              d.iswindow
                ? (this.bare = new p.Ay())
                : (this.bare = new p.Ay(
                    new Promise((e) => {
                      addEventListener("message", ({ data: t }) => {
                        "object" == typeof t &&
                          "$scramjet$type" in t &&
                          "baremuxinit" === t.$scramjet$type &&
                          e(t.port);
                      });
                    })
                  )),
              (this.serviceWorker = this.global.navigator.serviceWorker),
              d.iswindow && (e.document[n.pX] = this),
              (this.wrapfn = (0, o.createWrapFn)(this, e)),
              (this.natives = {
                store: new Proxy(
                  {},
                  {
                    get: (e, t) => {
                      if (t in e) return e[t];
                      let r = t.split("."),
                        n = r.pop(),
                        s = r.reduce((e, t) => e?.[t], this.global);
                      if (!s) return;
                      let i = Reflect.get(s, n);
                      return (e[t] = i), e[t];
                    },
                  }
                ),
                construct(e, ...t) {
                  let r = this.store[e];
                  return r ? new r(...t) : null;
                },
                call(e, t, ...r) {
                  let n = this.store[e];
                  return n ? n.call(t, ...r) : null;
                },
              }),
              (this.descriptors = {
                store: new Proxy(
                  {},
                  {
                    get: (e, r) => {
                      if (r in e) return e[r];
                      let n = r.split("."),
                        s = n.pop(),
                        i = n.reduce((e, t) => e?.[t], this.global);
                      if (!i) return;
                      let o = t.natives.call(
                        "Object.getOwnPropertyDescriptor",
                        null,
                        i,
                        s
                      );
                      return (e[r] = o), e[r];
                    },
                  }
                ),
                get(e, t) {
                  let r = this.store[e];
                  return r ? r.get.call(t) : null;
                },
                set(e, t, r) {
                  let n = this.store[e];
                  if (!n) return null;
                  n.set.call(t, r);
                },
              });
            const t = this;
            (this.meta = {
              get origin() {
                return t.url;
              },
              get base() {
                if (d.iswindow) {
                  const e = t.natives.call(
                    "Document.prototype.querySelector",
                    t.global.document,
                    "base"
                  );
                  if (e) {
                    let r = e.getAttribute("href");
                    if (!r) return t.url;
                    const n = r.indexOf("#");
                    if (!(r = r.substring(0, -1 === n ? void 0 : n)))
                      return t.url;
                    return new URL(r, t.url.origin);
                  }
                }
                return t.url;
              },
              get topFrameName() {
                if (!d.iswindow)
                  throw Error("topFrameName was called from a worker?");
                let e = t.global;
                if (e.parent.window == e.window) return null;
                for (; e.parent.window !== e.window && e.parent.window[n.pX]; )
                  e = e.parent.window;
                const r = e[n.pX].descriptors.get("window.frameElement", e);
                if (!r) return null;
                if (!r.name)
                  return (
                    console.error(
                      "YOU NEED TO USE `new ScramjetFrame()`! DIRECT IFRAMES WILL NOT WORK"
                    ),
                    null
                  );
                return r.name;
              },
              get parentFrameName() {
                if (!d.iswindow)
                  throw Error("parentFrameName was called from a worker?");
                if (t.global.parent.window == t.global.window) return null;
                let e = t.global.parent.window;
                if (e[n.pX]) {
                  const t = e[n.pX].descriptors.get("window.frameElement", e);
                  if (!t) return null;
                  if (!t.name)
                    return (
                      console.error(
                        "YOU NEED TO USE `new ScramjetFrame()`! DIRECT IFRAMES WILL NOT WORK"
                      ),
                      null
                    );
                  return t.name;
                }
                {
                  const e = t.descriptors.get("window.frameElement", t.global);
                  if (!e.name)
                    return (
                      console.error(
                        "YOU NEED TO USE `new ScramjetFrame()`! DIRECT IFRAMES WILL NOT WORK"
                      ),
                      null
                    );
                  return e.name;
                }
              },
            }),
              (this.locationProxy = (0, i.createLocationProxy)(this, e)),
              (e[n.pX] = this);
          }
          get frame() {
            if (!d.iswindow) return null;
            let e = this.descriptors.get("window.frameElement", this.global);
            if (!e) return null;
            let t = e[n.zr];
            if (!t) {
              let e = this.global.window;
              for (; e.parent !== e; ) {
                let t = e[n.pX].descriptors.get("window.frameElement", e);
                if (!t) return null;
                if (t && t[n.zr]) return t[n.zr];
                e = e.parent.window;
              }
            }
            return t;
          }
          get isSubframe() {
            if (!d.iswindow) return !1;
            let e = this.descriptors.get("window.frameElement", this.global);
            return !!e && !e[n.zr];
          }
          loadcookies(e) {
            this.cookieStore.load(e);
          }
          hook() {
            let e = r(7302),
              t = [];
            for (let r of e.keys()) {
              let n = e(r);
              r.endsWith(".ts") &&
                ((r.startsWith("./dom/") && "window" in this.global) ||
                  (r.startsWith("./worker/") &&
                    "WorkerGlobalScope" in this.global) ||
                  r.startsWith("./shared/")) &&
                t.push(n);
            }
            for (let e of (t.sort((e, t) => (e.order || 0) - (t.order || 0)),
            t))
              !e.enabled || e.enabled(this)
                ? e.default(this, this.global)
                : e.disabled && e.disabled(this, this.global);
          }
          get url() {
            return new URL((0, l.v2)(this.global.location.href));
          }
          set url(e) {
            e instanceof URL && (e = e.toString());
            let t = new a.NavigateEvent(e);
            this.frame && this.frame.dispatchEvent(t),
              t.defaultPrevented ||
                (this.global.location.href = (0, l.Oy)(t.url, this.meta));
          }
          Proxy(e, t) {
            if (Array.isArray(e)) {
              for (let r of e) this.Proxy(r, t);
              return;
            }
            let r = e.split("."),
              n = r.pop(),
              s = r.reduce((e, t) => e?.[t], this.global);
            if (s) {
              if (!(e in this.natives.store)) {
                let t = Reflect.get(s, n);
                this.natives.store[e] = t;
              }
              this.RawProxy(s, n, t);
            }
          }
          RawProxy(e, t, r) {
            if (!e || !t || !Reflect.has(e, t)) return;
            let n = Reflect.get(e, t);
            delete e[t];
            let i = {};
            r.construct &&
              (i.construct = function (e, t, n) {
                let s,
                  i = !1,
                  o = {
                    fn: e,
                    this: null,
                    args: t,
                    newTarget: n,
                    return: (e) => {
                      (i = !0), (s = e);
                    },
                    call: () => (
                      (i = !0),
                      (s = Reflect.construct(o.fn, o.args, o.newTarget))
                    ),
                  };
                return (r.construct(o), i)
                  ? s
                  : Reflect.construct(o.fn, o.args, o.newTarget);
              }),
              r.apply &&
                (i.apply = (e, t, n) => {
                  let s,
                    i = !1,
                    o = {
                      fn: e,
                      this: t,
                      args: n,
                      newTarget: null,
                      return: (e) => {
                        (i = !0), (s = e);
                      },
                      call: () => (
                        (i = !0), (s = Reflect.apply(o.fn, o.this, o.args))
                      ),
                    },
                    a = Error.prepareStackTrace;
                  Error.prepareStackTrace = function (e, t) {
                    if (
                      t[0].getFileName() &&
                      !t[0]
                        .getFileName()
                        .startsWith(location.origin + c.$W.prefix)
                    )
                      return { stack: e.stack };
                  };
                  try {
                    r.apply(o);
                  } catch (e) {
                    if (e instanceof Error)
                      if (e.stack instanceof Object) {
                        if (
                          ((e.stack = e.stack.stack),
                          console.error("ERROR FROM SCRAMJET INTERNALS", e),
                          !(0, c.U5)("allowFailedIntercepts", this.url))
                        )
                          throw e;
                      } else throw e;
                    else throw e;
                  }
                  return ((Error.prepareStackTrace = a), i)
                    ? s
                    : Reflect.apply(o.fn, o.this, o.args);
                }),
              (i.getOwnPropertyDescriptor = s.getOwnPropertyDescriptorHandler),
              (e[t] = new Proxy(n, i));
          }
          Trap(e, t) {
            if (Array.isArray(e)) {
              for (let r of e) this.Trap(r, t);
              return;
            }
            let r = e.split("."),
              n = r.pop(),
              s = r.reduce((e, t) => e?.[t], this.global);
            if (!s) return;
            let i = this.natives.call(
              "Object.getOwnPropertyDescriptor",
              null,
              s,
              n
            );
            return (this.descriptors.store[e] = i), this.RawTrap(s, n, t);
          }
          RawTrap(e, t, r) {
            if (!e || !t || !Reflect.has(e, t)) return;
            let n = this.natives.call(
                "Object.getOwnPropertyDescriptor",
                null,
                e,
                t
              ),
              s = {
                this: null,
                get: function () {
                  return n && n.get.call(this.this);
                },
                set: function (e) {
                  n && n.set.call(this.this, e);
                },
              };
            delete e[t];
            let i = {};
            return (
              r.get
                ? (i.get = function () {
                    return (s.this = this), r.get(s);
                  })
                : n?.get && (i.get = n.get),
              r.set
                ? (i.set = function (e) {
                    (s.this = this), r.set(s, e);
                  })
                : n?.set && (i.set = n.set),
              r.enumerable
                ? (i.enumerable = r.enumerable)
                : n?.enumerable && (i.enumerable = n.enumerable),
              r.configurable
                ? (i.configurable = r.configurable)
                : n?.configurable && (i.configurable = n.configurable),
              Object.defineProperty(e, t, i),
              n
            );
          }
        }
      },
      1077: function (e, t, r) {
        function n(e, t) {
          e.Trap("Element.prototype.attributes", {
            get(e) {
              let t = e.get(),
                r = new Proxy(t, {
                  get(e, n, s) {
                    let i = Reflect.get(e, n);
                    return "length" === n
                      ? Object.keys(r).length
                      : "getNamedItem" === n
                      ? (e) => r[e]
                      : "getNamedItemNS" === n
                      ? (e, t) => r[`${e}:${t}`]
                      : n in NamedNodeMap.prototype && "function" == typeof i
                      ? new Proxy(i, {
                          apply: (e, n, s) =>
                            n === r
                              ? Reflect.apply(e, t, s)
                              : Reflect.apply(e, n, s),
                        })
                      : ("string" != typeof n && "number" != typeof n) ||
                        isNaN(Number(n))
                      ? this.has(e, n)
                        ? i
                        : void 0
                      : t[Object.keys(r)[n]];
                  },
                  ownKeys(e) {
                    return Reflect.ownKeys(e).filter((t) => this.has(e, t));
                  },
                  has: (e, r) =>
                    "symbol" == typeof r
                      ? Reflect.has(e, r)
                      : !(
                          r.startsWith("scramjet-attr-") ||
                          t[r]?.name?.startsWith("scramjet-attr-")
                        ) && Reflect.has(e, r),
                });
              return r;
            },
          }),
            e.Trap(["Attr.prototype.value", "Attr.prototype.nodeValue"], {
              get: (e) =>
                e.this?.ownerElement
                  ? e.this.ownerElement.getAttribute(e.this.name)
                  : e.get(),
              set: (e, t) =>
                e.this?.ownerElement
                  ? e.this.ownerElement.setAttribute(e.this.name, t)
                  : e.set(t),
            });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      7430: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e, t) {
          e.Proxy("Navigator.prototype.sendBeacon", {
            apply(t) {
              t.args[0] = (0, n.Oy)(t.args[0], e.meta);
            },
          });
        }
      },
      9116: function (e, t, r) {
        function n(e, t) {
          e.serviceWorker.addEventListener("message", ({ data: t }) => {
            if ("scramjet$type" in t && "cookie" === t.scramjet$type) {
              e.cookieStore.setCookies([t.cookie], new URL(t.url));
              let r = {
                scramjet$token: t.scramjet$token,
                scramjet$type: "cookie",
              };
              e.serviceWorker.controller.postMessage(r);
            }
          }),
            e.Trap("Document.prototype.cookie", {
              get: () => e.cookieStore.getCookies(e.url, !0),
              set(t, r) {
                e.cookieStore.setCookies([r], e.url);
                let n = e.descriptors.get(
                  "ServiceWorkerContainer.prototype.controller",
                  e.serviceWorker
                );
                n &&
                  e.natives.call("ServiceWorker.prototype.postMessage", n, {
                    scramjet$type: "cookie",
                    cookie: r,
                    url: e.url.href,
                  });
              },
            }),
            delete t.cookieStore;
        }
        r.r(t), r.d(t, { default: () => n });
      },
      6447: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(2614);
        function s(e) {
          e.Proxy("CSSStyleDeclaration.prototype.setProperty", {
            apply(t) {
              t.args[1] && (t.args[1] = (0, n.s)(t.args[1], e.meta));
            },
          }),
            e.Proxy("CSSStyleDeclaration.prototype.getPropertyValue", {
              apply(e) {
                let t = e.call();
                if (!t) return t;
                e.return((0, n.f)(t));
              },
            }),
            e.Trap("CSSStyleDeclaration.prototype.cssText", {
              set(t, r) {
                t.set((0, n.s)(r, e.meta));
              },
              get: (e) => (0, n.f)(e.get()),
            }),
            e.Proxy("CSSStyleSheet.prototype.insertRule", {
              apply(t) {
                t.args[0] = (0, n.s)(t.args[0], e.meta);
              },
            }),
            e.Proxy("CSSStyleSheet.prototype.replace", {
              apply(t) {
                t.args[0] = (0, n.s)(t.args[0], e.meta);
              },
            }),
            e.Proxy("CSSStyleSheet.prototype.replaceSync", {
              apply(t) {
                t.args[0] = (0, n.s)(t.args[0], e.meta);
              },
            }),
            e.Trap("CSSRule.prototype.cssText", {
              set(t, r) {
                t.set((0, n.s)(r, e.meta));
              },
              get: (e) => (0, n.f)(e.get()),
            }),
            e.Proxy("CSSStyleValue.parse", {
              apply(t) {
                t.args[1] && (t.args[1] = (0, n.s)(t.args[1], e.meta));
              },
            }),
            e.Trap("HTMLElement.prototype.style", {
              get(t) {
                let r = t.get();
                return new Proxy(r, {
                  get(e, t) {
                    let s = Reflect.get(e, t);
                    return "function" == typeof s
                      ? new Proxy(s, {
                          apply: (e, t, n) => Reflect.apply(e, r, n),
                        })
                      : t in CSSStyleDeclaration.prototype || !s
                      ? s
                      : (0, n.f)(s);
                  },
                  set: (t, r, s) =>
                    "cssText" == r || "" == s || "string" != typeof s
                      ? Reflect.set(t, r, s)
                      : Reflect.set(t, r, (0, n.s)(s, e.meta)),
                });
              },
              set(e, t) {
                e.set(t);
              },
            });
        }
      },
      5351: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(884);
        function s(e, t) {
          let r = String;
          e.Proxy(
            [
              "Document.prototype.querySelector",
              "Document.prototype.querySelectorAll",
            ],
            {
              apply(e) {
                e.args[0] = r(e.args[0]).replace(
                  /((?:^|\s)\b\w+\[(?:src|href|data-href))[\^]?(=['"]?(?:https?[:])?\/\/)/,
                  "$1*$2"
                );
              },
            }
          ),
            e.Proxy("Document.prototype.write", {
              apply(t) {
                if (t.args[0])
                  try {
                    t.args[0] = (0, n.Qs)(t.args[0], e.cookieStore, e.meta, !1);
                  } catch {}
              },
            }),
            e.Proxy("Document.prototype.writeln", {
              apply(t) {
                if (t.args[0])
                  try {
                    t.args[0] = (0, n.Qs)(t.args[0], e.cookieStore, e.meta, !1);
                  } catch {}
              },
            }),
            e.Proxy("Document.prototype.parseHTMLUnsafe", {
              apply(t) {
                if (t.args[0])
                  try {
                    t.args[0] = (0, n.Qs)(t.args[0], e.cookieStore, e.meta, !1);
                  } catch {}
              },
            });
        }
      },
      7828: function (e, t, r) {
        r.r(t), r.d(t, { default: () => h });
        var n = r(2393),
          s = r(2614),
          i = r(884),
          o = r(1478),
          a = r(1472),
          l = r(2794),
          c = r(3255);
        let u = new TextEncoder();
        function d(e) {
          return btoa(Array.from(e, (e) => String.fromCodePoint(e)).join(""));
        }
        function h(e, t) {
          let r = {
              nonce: [t.HTMLElement],
              integrity: [t.HTMLScriptElement, t.HTMLLinkElement],
              csp: [t.HTMLIFrameElement],
              credentialless: [t.HTMLIFrameElement],
              src: [
                t.HTMLImageElement,
                t.HTMLMediaElement,
                t.HTMLIFrameElement,
                t.HTMLFrameElement,
                t.HTMLEmbedElement,
                t.HTMLScriptElement,
                t.HTMLSourceElement,
              ],
              href: [t.HTMLAnchorElement, t.HTMLLinkElement],
              data: [t.HTMLObjectElement],
              action: [t.HTMLFormElement],
              formaction: [t.HTMLButtonElement, t.HTMLInputElement],
              srcdoc: [t.HTMLIFrameElement],
              poster: [t.HTMLVideoElement],
              imagesrcset: [t.HTMLLinkElement],
            },
            h = [t.HTMLAnchorElement.prototype, t.HTMLAreaElement.prototype],
            p = [
              e.natives.call(
                "Object.getOwnPropertyDescriptor",
                null,
                t.HTMLAnchorElement.prototype,
                "href"
              ),
              e.natives.call(
                "Object.getOwnPropertyDescriptor",
                null,
                t.HTMLAreaElement.prototype,
                "href"
              ),
            ];
          for (let t of Object.keys(r))
            for (let n of r[t]) {
              let r = e.natives.call(
                "Object.getOwnPropertyDescriptor",
                null,
                n.prototype,
                t
              );
              Object.defineProperty(n.prototype, t, {
                get() {
                  return [
                    "src",
                    "data",
                    "href",
                    "action",
                    "formaction",
                  ].includes(t)
                    ? (0, a.v2)(r.get.call(this))
                    : r.get.call(this);
                },
                set(e) {
                  return this.setAttribute(t, e);
                },
              });
            }
          for (let t of [
            "protocol",
            "hash",
            "host",
            "hostname",
            "origin",
            "pathname",
            "port",
            "search",
          ])
            for (let r in h) {
              let n = h[r],
                s = p[r];
              e.RawTrap(n, t, {
                get(e) {
                  let r = s.get.call(e.this);
                  return r ? new URL((0, a.v2)(r))[t] : r;
                },
              });
            }
          e.Trap("Node.prototype.baseURI", {
            get(t) {
              let r = t.this,
                n = r.ownerDocument?.querySelector("base");
              return (r instanceof Document && (n = r.querySelector("base")), n)
                ? new URL(n.href, e.url.origin).href
                : e.url.origin;
            },
            set: (e, t) => !1,
          }),
            e.Proxy("Element.prototype.getAttribute", {
              apply(t) {
                let [r] = t.args;
                if (r.startsWith("scramjet-attr")) return t.return(null);
                if (
                  e.natives.call(
                    "Element.prototype.hasAttribute",
                    t.this,
                    `scramjet-attr-${r}`
                  )
                ) {
                  let e = t.fn.call(t.this, `scramjet-attr-${r}`);
                  return null === e ? t.return("") : t.return(e);
                }
              },
            }),
            e.Proxy("Element.prototype.getAttributeNames", {
              apply(e) {
                let t = e.call().filter((e) => !e.startsWith("scramjet-attr"));
                e.return(t);
              },
            }),
            e.Proxy("Element.prototype.getAttributeNode", {
              apply(e) {
                if (e.args[0].startsWith("scramjet-attr"))
                  return e.return(null);
              },
            }),
            e.Proxy("Element.prototype.hasAttribute", {
              apply(e) {
                if (e.args[0].startsWith("scramjet-attr")) return e.return(!1);
              },
            }),
            e.Proxy("Element.prototype.setAttribute", {
              apply(t) {
                let [r, s] = t.args,
                  i = n.V.find((e) => {
                    let n = e[r.toLowerCase()];
                    return (
                      !!n &&
                      ("*" === n ||
                        ("function" != typeof n &&
                          n.includes(t.this.tagName.toLowerCase())))
                    );
                  });
                if (i) {
                  let n = i.fn(s, e.meta, e.cookieStore);
                  if (null == n) {
                    e.natives.call(
                      "Element.prototype.removeAttribute",
                      t.this,
                      r
                    ),
                      t.return(void 0);
                    return;
                  }
                  (t.args[1] = n),
                    t.fn.call(t.this, `scramjet-attr-${t.args[0]}`, s);
                }
              },
            }),
            e.Proxy("Element.prototype.setAttributeNode", { apply(e) {} }),
            e.Proxy("Element.prototype.setAttributeNS", {
              apply(t) {
                let [r, s, i] = t.args,
                  o = n.V.find((e) => {
                    let r = e[s.toLowerCase()];
                    return (
                      !!r &&
                      ("*" === r ||
                        ("function" != typeof r &&
                          r.includes(t.this.tagName.toLowerCase())))
                    );
                  });
                o &&
                  ((t.args[2] = o.fn(i, e.meta, e.cookieStore)),
                  e.natives.call(
                    "Element.prototype.setAttribute",
                    t.this,
                    `scramjet-attr-${t.args[1]}`,
                    i
                  ));
              },
            }),
            e.Trap("SVGAnimatedString.prototype.baseVal", {
              get(e) {
                let t = e.get();
                return t ? (0, a.v2)(t) : t;
              },
              set(t, r) {
                t.set((0, a.Oy)(r, e.meta));
              },
            }),
            e.Trap("SVGAnimatedString.prototype.animVal", {
              get(e) {
                let t = e.get();
                return t ? (0, a.v2)(t) : t;
              },
            }),
            e.Proxy("Element.prototype.removeAttribute", {
              apply(t) {
                if (t.args[0].startsWith("scramjet-attr"))
                  return t.return(void 0);
                e.natives.call(
                  "Element.prototype.hasAttribute",
                  t.this,
                  t.args[0]
                ) && t.fn.call(t.this, `scramjet-attr-${t.args[0]}`);
              },
            }),
            e.Proxy("Element.prototype.toggleAttribute", {
              apply(t) {
                if (t.args[0].startsWith("scramjet-attr")) return t.return(!1);
                e.natives.call(
                  "Element.prototype.hasAttribute",
                  t.this,
                  t.args[0]
                ) && t.fn.call(t.this, `scramjet-attr-${t.args[0]}`);
              },
            }),
            e.Trap("Element.prototype.innerHTML", {
              set(r, n) {
                let a;
                if (r.this instanceof t.HTMLScriptElement)
                  (a = (0, o.o)(n, "(anonymous script element)", e.meta)),
                    e.natives.call(
                      "Element.prototype.setAttribute",
                      r.this,
                      "scramjet-attr-script-source-src",
                      d(u.encode(a))
                    );
                else if (r.this instanceof t.HTMLStyleElement)
                  a = (0, s.s)(n, e.meta);
                else
                  try {
                    a = (0, i.Qs)(n, e.cookieStore, e.meta);
                  } catch {
                    a = n;
                  }
                r.set(a);
              },
              get(r) {
                if (r.this instanceof t.HTMLScriptElement) {
                  let t = e.natives.call(
                    "Element.prototype.getAttribute",
                    r.this,
                    "scramjet-attr-script-source-src"
                  );
                  return t ? atob(t) : r.get();
                }
                return r.this instanceof t.HTMLStyleElement
                  ? r.get()
                  : (0, i.nK)(r.get());
              },
            }),
            e.Trap("Node.prototype.textContent", {
              set(r, n) {
                if (r.this instanceof t.HTMLScriptElement) {
                  let t = (0, o.o)(n, "(anonymous script element)", e.meta);
                  return (
                    e.natives.call(
                      "Element.prototype.setAttribute",
                      r.this,
                      "scramjet-attr-script-source-src",
                      d(u.encode(t))
                    ),
                    r.set(t)
                  );
                }
                return r.this instanceof t.HTMLStyleElement
                  ? r.set((0, s.s)(n, e.meta))
                  : r.set(n);
              },
              get(r) {
                if (r.this instanceof t.HTMLScriptElement) {
                  let t = e.natives.call(
                    "Element.prototype.getAttribute",
                    r.this,
                    "scramjet-attr-script-source-src"
                  );
                  return t ? atob(t) : r.get();
                }
                return r.this instanceof t.HTMLStyleElement
                  ? (0, s.f)(r.get())
                  : r.get();
              },
            }),
            e.Trap("Element.prototype.outerHTML", {
              set(t, r) {
                t.set((0, i.Qs)(r, e.cookieStore, e.meta));
              },
              get: (e) => (0, i.nK)(e.get()),
            }),
            e.Proxy("Element.prototype.setHTMLUnsafe", {
              apply(t) {
                try {
                  t.args[0] = (0, i.Qs)(t.args[0], e.cookieStore, e.meta, !1);
                } catch {}
              },
            }),
            e.Proxy("Element.prototype.getHTML", {
              apply(e) {
                e.return((0, i.nK)(e.call()));
              },
            }),
            e.Proxy("Element.prototype.insertAdjacentHTML", {
              apply(t) {
                if (t.args[1])
                  try {
                    t.args[1] = (0, i.Qs)(t.args[1], e.cookieStore, e.meta, !1);
                  } catch {}
              },
            }),
            e.Proxy("Audio", {
              construct(t) {
                t.args[0] && (t.args[0] = (0, a.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Text.prototype.appendData", {
              apply(t) {
                t.this.parentElement?.tagName === "STYLE" &&
                  (t.args[0] = (0, s.s)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Text.prototype.insertData", {
              apply(t) {
                t.this.parentElement?.tagName === "STYLE" &&
                  (t.args[1] = (0, s.s)(t.args[1], e.meta));
              },
            }),
            e.Proxy("Text.prototype.replaceData", {
              apply(t) {
                t.this.parentElement?.tagName === "STYLE" &&
                  (t.args[2] = (0, s.s)(t.args[2], e.meta));
              },
            }),
            e.Trap("Text.prototype.wholeText", {
              get: (e) =>
                e.this.parentElement?.tagName === "STYLE"
                  ? (0, s.f)(e.get())
                  : e.get(),
              set: (t, r) =>
                t.this.parentElement?.tagName === "STYLE"
                  ? t.set((0, s.s)(r, e.meta))
                  : t.set(r),
            }),
            e.Trap(
              [
                "HTMLIFrameElement.prototype.contentWindow",
                "HTMLFrameElement.prototype.contentWindow",
                "HTMLObjectElement.prototype.contentWindow",
                "HTMLEmbedElement.prototype.contentWindow",
              ],
              {
                get(e) {
                  let t = e.get();
                  return t && (l.pX in t || new c.ScramjetClient(t).hook()), t;
                },
              }
            ),
            e.Trap(
              [
                "HTMLIFrameElement.prototype.contentDocument",
                "HTMLFrameElement.prototype.contentDocument",
                "HTMLObjectElement.prototype.contentDocument",
                "HTMLEmbedElement.prototype.contentDocument",
              ],
              {
                get(t) {
                  let r = e.descriptors.get(
                    `${t.this.constructor.name}.prototype.contentWindow`,
                    t.this
                  );
                  return r
                    ? (l.pX in r || new c.ScramjetClient(r).hook(), r.document)
                    : r;
                },
              }
            ),
            e.Proxy(
              [
                "HTMLIFrameElement.prototype.getSVGDocument",
                "HTMLObjectElement.prototype.getSVGDocument",
                "HTMLEmbedElement.prototype.getSVGDocument",
              ],
              {
                apply(e) {
                  if (e.call()) return e.return(e.this.contentDocument);
                },
              }
            ),
            e.Proxy("DOMParser.prototype.parseFromString", {
              apply(t) {
                if ("text/html" === t.args[1])
                  try {
                    t.args[0] = (0, i.Qs)(t.args[0], e.cookieStore, e.meta, !1);
                  } catch {}
              },
            });
        }
      },
      5426: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(2614);
        function s(e, t) {
          e.Proxy("FontFace", {
            construct(t) {
              t.args[1] = (0, n.s)(t.args[1], e.meta);
            },
          });
        }
      },
      5465: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(884);
        function s(e, t) {
          e.Proxy("Range.prototype.createContextualFragment", {
            apply(t) {
              t.args[0] = (0, n.Qs)(t.args[0], e.cookieStore, e.meta);
            },
          });
        }
      },
      9804: function (e, t, r) {
        r.r(t), r.d(t, { default: () => o });
        var n = r(1472),
          s = r(1862),
          i = r(2794);
        function o(e, t) {
          e.Proxy(
            ["History.prototype.pushState", "History.prototype.replaceState"],
            {
              apply(t) {
                (t.args[2] || "" === t.args[2]) &&
                  (t.args[2] = (0, n.Oy)(t.args[2], e.meta)),
                  t.call();
                let {
                    constructor: { constructor: r },
                  } = t.this,
                  o = r("return globalThis")(),
                  a = o[i.pX];
                if (o.name === e.meta.topFrameName) {
                  let t = new s.UrlChangeEvent(a.url.href);
                  e.frame?.dispatchEvent(t);
                }
              },
            }
          );
        }
      },
      7758: function (e, t, r) {
        r.r(t), r.d(t, { default: () => o });
        var n = r(3255),
          s = r(2794),
          i = r(1472);
        function o(e) {
          e.Proxy("window.open", {
            apply(t) {
              t.args[0] && (t.args[0] = (0, i.Oy)(t.args[0], e.meta)),
                ("_top" === t.args[1] || "_unfencedTop" === t.args[1]) &&
                  (t.args[1] = e.meta.topFrameName),
                "_parent" === t.args[1] && (t.args[1] = e.meta.parentFrameName);
              let r = t.call();
              if (!r) return t.return(r);
              if (s.pX in r) return t.return(r[s.pX].global);
              {
                let e = new n.ScramjetClient(r);
                return e.hook(), t.return(e.global);
              }
            },
          }),
            e.Trap("window.frameElement", {
              get(e) {
                let t = e.get();
                return t ? (t.ownerDocument.defaultView[s.pX] ? t : null) : t;
              },
            });
        }
      },
      6012: function (e, t, r) {
        function n(e, t) {
          e.Trap("origin", { get: () => e.url.origin, set: () => !1 }),
            e.Trap("Document.prototype.URL", {
              get: () => e.url.href,
              set: () => !1,
            }),
            e.Trap("Document.prototype.documentURI", {
              get: () => e.url.href,
              set: () => !1,
            }),
            e.Trap("Document.prototype.domain", {
              get: () => e.url.hostname,
              set: () => !1,
            });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      6286: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(1472),
          s = r(37);
        function i(e, t) {
          e.Trap("PerformanceEntry.prototype.name", {
            get(e) {
              let t = e.get();
              return t && t.startsWith(location.origin + s.$W.prefix)
                ? (0, n.v2)(t)
                : t;
            },
          }),
            e.Proxy(
              [
                "Performance.prototype.getEntries",
                "Performance.prototype.getEntriesByType",
                "Performance.prototype.getEntriesByName",
                "PerformanceObserverEntryList.prototype.getEntries",
                "PerformanceObserverEntryList.prototype.getEntriesByType",
                "PerformanceObserverEntryList.prototype.getEntriesByName",
              ],
              {
                apply(e) {
                  let t = e.call();
                  return e.return(
                    t.filter((e) => {
                      for (let t of Object.values(s.$W.files))
                        if (e.name.startsWith(location.origin + t)) return !1;
                      return !0;
                    })
                  );
                },
              }
            );
        }
      },
      1974: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e, t) {
          e.Proxy("Navigator.prototype.registerProtocolHandler", {
            apply(t) {
              t.args[1] = (0, n.Oy)(t.args[1], e.meta);
            },
          }),
            e.Proxy("Navigator.prototype.unregisterProtocolHandler", {
              apply(t) {
                t.args[1] = (0, n.Oy)(t.args[1], e.meta);
              },
            });
        }
      },
      9201: function (e, t, r) {
        r.r(t),
          r.d(t, {
            default: () => l,
            disabled: () => a,
            enabled: () => o,
            order: () => i,
          });
        var n = r(37),
          s = r(1472);
        let i = 2,
          o = (e) => (0, n.U5)("serviceworkers", e.url);
        function a(e, t) {
          Reflect.deleteProperty(Navigator.prototype, "serviceWorker");
        }
        function l(e, t) {
          let r = new WeakMap();
          e.Proxy("EventTarget.prototype.addEventListener", {
            apply(e) {
              r.get(e.this) && e.return(void 0);
            },
          }),
            e.Proxy("EventTarget.prototype.removeEventListener", {
              apply(e) {
                r.get(e.this) && e.return(void 0);
              },
            }),
            e.Proxy("ServiceWorkerContainer.prototype.getRegistration", {
              apply(e) {
                e.return(new Promise((e) => e(registration)));
              },
            }),
            e.Proxy("ServiceWorkerContainer.prototype.getRegistrations", {
              apply(e) {
                e.return(new Promise((e) => e([registration])));
              },
            }),
            e.Trap("ServiceWorkerContainer.prototype.ready", {
              get: (e) => new Promise((e) => e(registration)),
            }),
            e.Trap("ServiceWorkerContainer.prototype.controller", {
              get: (e) => registration?.active,
            }),
            e.Proxy("ServiceWorkerContainer.prototype.register", {
              apply(t) {
                let n = new EventTarget();
                Object.setPrototypeOf(
                  n,
                  self.ServiceWorkerRegistration.prototype
                ),
                  (n.constructor = t.fn);
                let i = (0, s.Oy)(t.args[0], e.meta) + "?dest=serviceworker";
                t.args[1] &&
                  "module" === t.args[1].type &&
                  (i += "&type=module");
                let o = e.natives.construct("SharedWorker", i).port,
                  a = { scope: t.args[0], active: o },
                  l = e.descriptors.get(
                    "ServiceWorkerContainer.prototype.controller",
                    e.serviceWorker
                  );
                e.natives.call(
                  "ServiceWorker.prototype.postMessage",
                  l,
                  {
                    scramjet$type: "registerServiceWorker",
                    port: o,
                    origin: e.url.origin,
                  },
                  [o]
                ),
                  r.set(n, a),
                  t.return(new Promise((e) => e(n)));
              },
            });
        }
      },
      5289: function (e, t, r) {
        function n(e, t) {
          let r = {
            get(t, r) {
              switch (r) {
                case "getItem":
                  return (r) => t.getItem(e.url.host + "@" + r);
                case "setItem":
                  return (r, n) => t.setItem(e.url.host + "@" + r, n);
                case "removeItem":
                  return (r) => t.removeItem(e.url.host + "@" + r);
                case "clear":
                  return () => {
                    for (let r in Object.keys(t))
                      r.startsWith(e.url.host) && t.removeItem(r);
                  };
                case "key":
                  return (r) => {
                    let n = Object.keys(t).filter((t) =>
                      t.startsWith(e.url.host)
                    );
                    return t.getItem(n[r]);
                  };
                case "length":
                  return Object.keys(t).filter((t) => t.startsWith(e.url.host))
                    .length;
                default:
                  if (r in Object.prototype || "symbol" == typeof r)
                    return Reflect.get(t, r);
                  return t.getItem(e.url.host + "@" + r);
              }
            },
            set: (t, r, n) => (t.setItem(e.url.host + "@" + r, n), !0),
            ownKeys: (t) =>
              Reflect.ownKeys(t)
                .filter((t) => "string" == typeof t && t.startsWith(e.url.host))
                .map((t) =>
                  "string" == typeof t ? t.substring(e.url.host.length + 1) : t
                ),
            getOwnPropertyDescriptor: (t, r) => ({
              value: t.getItem(e.url.host + "@" + r),
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            defineProperty: (t, r, n) => (
              t.setItem(e.url.host + "@" + r, n.value), !0
            ),
          };
          t.localStorage;
          let n = new Proxy(t.localStorage, r),
            s = new Proxy(t.sessionStorage, r);
          delete t.localStorage,
            delete t.sessionStorage,
            (t.localStorage = n),
            (t.sessionStorage = s);
        }
        r.r(t), r.d(t, { default: () => n });
      },
      1323: function (e, t, r) {
        r.r(t),
          r.d(t, {
            isdedicated: () => h,
            isemulatedsw: () => f,
            isshared: () => p,
            issw: () => d,
            iswindow: () => c,
            isworker: () => u,
            loadAndHook: () => g,
          });
        var n = r(37),
          s = r(2794),
          i = r(3255),
          o = r(1862),
          a = r(8409),
          l = r(8665).A;
        let c = "window" in globalThis && window instanceof Window,
          u = "WorkerGlobalScope" in globalThis,
          d = "ServiceWorkerGlobalScope" in globalThis,
          h = "DedicatedWorkerGlobalScope" in globalThis,
          p = "SharedWorkerGlobalScope" in globalThis,
          f =
            "location" in globalThis &&
            "serviceworker" ===
              new URL(globalThis.location.href).searchParams.get("dest");
        function g(e) {
          if (
            ((0, n.Nk)(e),
            l.log("initializing scramjet client"),
            !(s.pX in globalThis))
          ) {
            (0, n.Ec)();
            let e = new i.ScramjetClient(globalThis),
              t = globalThis.frameElement;
            t &&
              !t.name &&
              (t.name = `${Array(8)
                .fill(0)
                .map(() => Math.floor(36 * Math.random()).toString(36))
                .join("")}`),
              globalThis.COOKIE && e.loadcookies(globalThis.COOKIE),
              e.hook(),
              f && new a.ScramjetServiceWorkerRuntime(e).hook();
            let r = new o.ScramjetContextEvent(e.global.window, e);
            e.frame?.dispatchEvent(r);
            let s = new o.UrlChangeEvent(e.url.href);
            e.isSubframe || e.frame?.dispatchEvent(s);
          }
          Reflect.deleteProperty(globalThis, "WASM"),
            Reflect.deleteProperty(globalThis, "COOKIE");
        }
      },
      1862: function (e, t, r) {
        r.r(t),
          r.d(t, {
            NavigateEvent: () => s,
            ScramjetContextEvent: () => o,
            ScramjetGlobalDownloadEvent: () => n,
            UrlChangeEvent: () => i,
          });
        class n extends Event {
          download;
          type = "download";
          constructor(e) {
            super("download"), (this.download = e);
          }
        }
        class s extends Event {
          url;
          type = "navigate";
          constructor(e) {
            super("navigate"), (this.url = e);
          }
        }
        class i extends Event {
          url;
          type = "urlchange";
          constructor(e) {
            super("urlchange"), (this.url = e);
          }
        }
        class o extends Event {
          window;
          client;
          type = "contextInit";
          constructor(e, t) {
            super("contextInit"), (this.window = e), (this.client = t);
          }
        }
      },
      94: function (e, t, r) {
        function n(e, t) {
          return Reflect.getOwnPropertyDescriptor(e, t);
        }
        r.r(t), r.d(t, { getOwnPropertyDescriptorHandler: () => n });
      },
      3255: function (e, t, r) {
        r.r(t),
          r.d(t, {
            NavigateEvent: () => i.NavigateEvent,
            ScramjetClient: () => n.ScramjetClient,
            ScramjetContextEvent: () => i.ScramjetContextEvent,
            ScramjetGlobalDownloadEvent: () => i.ScramjetGlobalDownloadEvent,
            ScramjetServiceWorkerRuntime: () => l.ScramjetServiceWorkerRuntime,
            UrlChangeEvent: () => i.UrlChangeEvent,
            createLocationProxy: () => a.createLocationProxy,
            getOwnPropertyDescriptorHandler: () =>
              o.getOwnPropertyDescriptorHandler,
            isdedicated: () => s.isdedicated,
            isemulatedsw: () => s.isemulatedsw,
            isshared: () => s.isshared,
            issw: () => s.issw,
            iswindow: () => s.iswindow,
            isworker: () => s.isworker,
            loadAndHook: () => s.loadAndHook,
          });
        var n = r(336),
          s = r(1323),
          i = r(1862),
          o = r(94),
          a = r(3696),
          l = r(8409);
        r(3255);
      },
      3696: function (e, t, r) {
        r.r(t), r.d(t, { createLocationProxy: () => o });
        var n = r(1862),
          s = r(1472),
          i = r(1323);
        function o(e, t) {
          let r = i.iswindow ? t.Location : t.WorkerLocation,
            o = {};
          Object.setPrototypeOf(o, r.prototype), (o.constructor = r);
          let a = i.iswindow ? t.location : r.prototype;
          for (let r of [
            "protocol",
            "hash",
            "host",
            "hostname",
            "href",
            "origin",
            "pathname",
            "port",
            "search",
          ]) {
            let s = e.natives.call(
              "Object.getOwnPropertyDescriptor",
              null,
              a,
              r
            );
            if (!s) continue;
            let i = { configurable: !1, enumerable: !0 };
            s.get && (i.get = new Proxy(s.get, { apply: () => e.url[r] })),
              s.set &&
                (i.set = new Proxy(s.set, {
                  apply(s, i, o) {
                    if ("href" === r) {
                      e.url = o[0];
                      return;
                    }
                    if ("hash" === r) {
                      t.location.hash = o[0];
                      let r = new n.UrlChangeEvent(e.url.href);
                      e.isSubframe || e.frame?.dispatchEvent(r);
                      return;
                    }
                    let a = new URL(e.url.href);
                    (a[r] = o[0]), (e.url = a);
                  },
                })),
              Object.defineProperty(o, r, i);
          }
          return (
            (o.toString = new Proxy(t.location.toString, {
              apply: () => e.url.href,
            })),
            t.location.valueOf &&
              (o.valueOf = new Proxy(t.location.valueOf, {
                apply: () => e.url.href,
              })),
            t.location.assign &&
              (o.assign = new Proxy(t.location.assign, {
                apply(r, i, o) {
                  (o[0] = (0, s.Oy)(o[0], e.meta)),
                    Reflect.apply(r, t.location, o);
                  let a = new n.UrlChangeEvent(e.url.href);
                  e.isSubframe || e.frame?.dispatchEvent(a);
                },
              })),
            t.location.reload &&
              (o.reload = new Proxy(t.location.reload, {
                apply(e, r, n) {
                  Reflect.apply(e, t.location, n);
                },
              })),
            t.location.replace &&
              (o.replace = new Proxy(t.location.replace, {
                apply(r, i, o) {
                  (o[0] = (0, s.Oy)(o[0], e.meta)),
                    Reflect.apply(r, t.location, o);
                  let a = new n.UrlChangeEvent(e.url.href);
                  e.isSubframe || e.frame?.dispatchEvent(a);
                },
              })),
            o
          );
        }
      },
      8382: function (e, t, r) {
        function n(e) {
          e.Proxy("console.clear", {
            apply(e) {
              e.return(void 0);
            },
          });
          let t = console.log;
          e.Trap("console.log", { set(e, t) {}, get: (e) => t });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      4634: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e) {
          e.Proxy("URL.createObjectURL", {
            apply(t) {
              let r = t.call();
              r.startsWith("blob:")
                ? t.return((0, n.IP)(r, e.meta))
                : t.return(r);
            },
          }),
            e.Proxy("URL.revokeObjectURL", {
              apply(e) {
                e.args[0] = (0, n.$n)(e.args[0]);
              },
            });
        }
      },
      5026: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e, t) {
          e.Proxy("CacheStorage.prototype.open", {
            apply(t) {
              t.args[0] = `${e.url.origin}@${t.args[0]}`;
            },
          }),
            e.Proxy("CacheStorage.prototype.has", {
              apply(t) {
                t.args[0] = `${e.url.origin}@${t.args[0]}`;
              },
            }),
            e.Proxy("CacheStorage.prototype.match", {
              apply(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("CacheStorage.prototype.delete", {
              apply(t) {
                t.args[0] = `${e.url.origin}@${t.args[0]}`;
              },
            }),
            e.Proxy("Cache.prototype.add", {
              apply(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.addAll", {
              apply(t) {
                for (let r = 0; r < t.args[0].length; r++)
                  ("string" == typeof t.args[0][r] ||
                    t.args[0][r] instanceof URL) &&
                    (t.args[0][r] = (0, n.Oy)(t.args[0][r], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.put", {
              apply(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.match", {
              apply(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.matchAll", {
              apply(t) {
                ((t.args[0] && "string" == typeof t.args[0]) ||
                  (t.args[0] && t.args[0] instanceof URL)) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.keys", {
              apply(t) {
                ((t.args[0] && "string" == typeof t.args[0]) ||
                  (t.args[0] && t.args[0] instanceof URL)) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            }),
            e.Proxy("Cache.prototype.delete", {
              apply(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  (t.args[0] = (0, n.Oy)(t.args[0], e.meta));
              },
            });
        }
      },
      6627: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1323);
        function s(e, t) {
          let r = (e) => {
            let r = e.split("."),
              n = r.pop(),
              s = r.reduce((e, t) => e?.[t], t);
            s && n && n in s && delete s[n];
          };
          r("BarcodeDetector"),
            r("FaceDetector"),
            r("TextDetector"),
            n.iswindow && r("ServiceWorkerRegistration.prototype.sync"),
            n.isemulatedsw && (r("SyncManager"), r("SyncEvent")),
            r("TrustedHTML"),
            r("TrustedScript"),
            r("TrustedScriptURL"),
            r("TrustedTypePolicy"),
            r("TrustedTypePolicyFactory"),
            t.__defineGetter__("trustedTypes", () => void 0),
            r("Navigator.prototype.joinAdInterestGroup"),
            n.iswindow &&
              (r("MediaDevices.prototype.setCaptureHandleConfig"),
              r("Navigator.prototype.bluetooth"),
              r("Bluetooth"),
              r("BluetoothDevice"),
              r("BluetoothRemoteGATTServer"),
              r("BluetoothRemoteGATTCharacteristic"),
              r("BluetoothRemoteGATTDescriptor"),
              r("BluetoothUUID"),
              r("Navigator.prototype.contacts"),
              r("ContactAddress"),
              r("ContactManager"),
              r("IdleDetector"),
              r("Navigator.prototype.presentation"),
              r("Presentation"),
              r("PresentationConnection"),
              r("PresentationReceiver"),
              r("PresentationRequest"),
              r("PresentationAvailability"),
              r("PresentationConnectionAvailableEvent"),
              r("PresentationConnectionCloseEvent"),
              r("PresentationConnectionList"),
              r("WindowControlsOverlay"),
              r("WindowControlsOverlayGeometryChangeEvent"),
              r("Navigator.prototype.windowControlsOverlay"),
              r("Navigator.prototype.hid"),
              r("HID"),
              r("HIDDevice"),
              r("HIDConnectionEvent"),
              r("HIDInputReportEvent"),
              r("navigation"),
              r("NavigateEvent"),
              r("NavigationActivation"),
              r("NavigationCurrentEntryChangeEvent"),
              r("NavigationDestination"),
              r("NavigationHistoryEntry"),
              r("NavigationTransition"));
        }
      },
      582: function (e, t, r) {
        r.r(t), r.d(t, { argdbg: () => i, default: () => o, enabled: () => s });
        var n = r(37);
        let s = (e) => (0, n.U5)("captureErrors", e.url);
        function i(e, t = []) {
          switch (typeof e) {
            case "string":
              break;
            case "object":
              if (
                e &&
                e[Symbol.iterator] &&
                "function" == typeof e[Symbol.iterator]
              )
                for (let r in e) {
                  let n = Object.getOwnPropertyDescriptor(e, r);
                  if (n && n.get) continue;
                  let s = e[r];
                  t.includes(s) || (t.push(s), i(s, t));
                }
          }
        }
        function o(e, t) {
          let r = console.warn;
          (t.$scramerr = function (e) {
            r("CAUGHT ERROR", e);
          }),
            (t.$scramdbg = function (e, t) {
              return e && "object" == typeof e && e.length > 0 && i(e), i(t), t;
            }),
            e.Proxy("Promise.prototype.catch", {
              apply(e) {
                e.args[0] &&
                  (e.args[0] = new Proxy(e.args[0], {
                    apply(e, t, r) {
                      Reflect.apply(e, t, r);
                    },
                  }));
              },
            });
        }
      },
      6143: function (e, t, r) {
        r.r(t), r.d(t, { default: () => o, enabled: () => i });
        var n = r(37),
          s = r(1472);
        let i = (e) => (0, n.U5)("cleanErrors", e.url);
        function o(e, t) {
          let r = (e, t) => {
            let r = e.stack;
            for (let e = 0; e < t.length; e++) {
              let i = t[e].getFileName();
              try {
                if (i.endsWith(n.$W.files.all)) {
                  let e = r.split("\n"),
                    t = e.find((e) => e.includes(i));
                  e.splice(t, 1), (r = e.join("\n"));
                  continue;
                }
              } catch {}
              try {
                r = r.replaceAll(i, (0, s.v2)(i));
              } catch {}
            }
            return r;
          };
          e.Trap("Error.prepareStackTrace", { get: (e) => r, set(e) {} });
        }
      },
      591: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i, indirectEval: () => o });
        var n = r(37),
          s = r(1478);
        function i(e, t) {
          Object.defineProperty(t, n.$W.globals.rewritefn, {
            value: function (t) {
              return "string" != typeof t
                ? t
                : (0, s.o)(t, "(direct eval proxy)", e.meta);
            },
            writable: !1,
            configurable: !1,
          });
        }
        function o(e, t) {
          let r;
          return "string" != typeof t
            ? t
            : ("accounts.google.com" === this.url.hostname
                ? (console.log("USING STRICT EVAL - BOTGUARD"),
                  (r = Function(`
			"use strict";
			return eval;
		`)))
                : (r = this.global.eval),
              r((0, s.o)(t, "(indirect eval proxy)", this.meta)));
        }
      },
      3481: function (e, t, r) {
        r.r(t), r.d(t, { default: () => a });
        var n = r(1323),
          s = r(1472),
          i = r(94);
        let o = Symbol.for("scramjet original onevent function");
        function a(e, t) {
          let r = {
            message: {
              _init() {
                return (
                  "object" != typeof this.data ||
                  !("$scramjet$type" in this.data)
                );
              },
              ports() {
                return this.ports;
              },
              source() {
                return null === this.source ? null : this.source;
              },
              origin() {
                return "object" == typeof this.data &&
                  "$scramjet$origin" in this.data
                  ? this.data.$scramjet$origin
                  : e.url.origin;
              },
              data() {
                return "object" == typeof this.data &&
                  "$scramjet$data" in this.data
                  ? this.data.$scramjet$data
                  : this.data;
              },
            },
            hashchange: {
              oldURL() {
                return (0, s.v2)(this.oldURL);
              },
              newURL() {
                return (0, s.v2)(this.newURL);
              },
            },
            storage: {
              _init() {
                return this.key.startsWith(e.url.host + "@");
              },
              key() {
                return this.key.substring(this.key.indexOf("@") + 1);
              },
              url() {
                return (0, s.v2)(this.url);
              },
            },
          };
          function a(e) {
            return new Proxy(e, {
              apply(e, n, s) {
                let o = s[0];
                if (o.isTrusted) {
                  let e = o.type;
                  if (e in r) {
                    let t = r[e];
                    if (t._init && !1 === t._init.call(o)) return;
                    s[0] = new Proxy(o, {
                      get(e, r, n) {
                        let s = Reflect.get(e, r);
                        return r in t
                          ? t[r].call(e)
                          : "function" == typeof s
                          ? new Proxy(s, {
                              apply: (e, t, r) =>
                                t === n
                                  ? Reflect.apply(e, o, r)
                                  : Reflect.apply(e, t, r),
                            })
                          : s;
                      },
                      getOwnPropertyDescriptor:
                        i.getOwnPropertyDescriptorHandler,
                    });
                  }
                }
                return (
                  t.event ||
                    Object.defineProperty(t, "event", {
                      get: () => s[0],
                      configurable: !0,
                    }),
                  Reflect.apply(e, n, s)
                );
              },
              getOwnPropertyDescriptor: i.getOwnPropertyDescriptorHandler,
            });
          }
          e.Proxy("EventTarget.prototype.addEventListener", {
            apply(t) {
              if ("function" != typeof t.args[1]) return;
              let r = t.args[1],
                n = a(r);
              t.args[1] = n;
              let s = e.eventcallbacks.get(t.this);
              (s ||= []).push({
                event: t.args[0],
                originalCallback: r,
                proxiedCallback: n,
              }),
                e.eventcallbacks.set(t.this, s);
            },
          }),
            e.Proxy("EventTarget.prototype.removeEventListener", {
              apply(t) {
                if ("function" != typeof t.args[1]) return;
                let r = e.eventcallbacks.get(t.this);
                if (!r) return;
                let n = r.findIndex(
                  (e) =>
                    e.event === t.args[0] && e.originalCallback === t.args[1]
                );
                if (-1 === n) return;
                let s = r.splice(n, 1);
                e.eventcallbacks.set(t.this, r),
                  (t.args[1] = s[0].proxiedCallback);
              },
            });
          let l = [t.self, t.MessagePort.prototype];
          for (let s of (n.iswindow && l.push(t.HTMLElement.prototype),
          t.Worker && l.push(t.Worker.prototype),
          l))
            for (let t of Reflect.ownKeys(s))
              if ("string" == typeof t && t.startsWith("on") && r[t.slice(2)]) {
                let r = e.natives.call(
                  "Object.getOwnPropertyDescriptor",
                  null,
                  s,
                  t
                );
                if (!r.get || !r.set || !r.configurable) continue;
                e.RawTrap(s, t, {
                  get(e) {
                    return this[o] ? this[o] : e.get();
                  },
                  set(e, t) {
                    if (((this[o] = t), "function" != typeof t))
                      return e.set(t);
                    e.set(a(t));
                  },
                });
              }
        }
      },
      249: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(1478);
        function s(e, t) {
          let r = e.call().toString(),
            s = (0, n.o)(`return ${r}`, "(function proxy)", t.meta);
          e.return(e.fn(s)());
        }
        function i(e, t) {
          let r = {
            apply(t) {
              s(t, e);
            },
            construct(t) {
              s(t, e);
            },
          };
          e.Proxy("Function", r);
          let n = e.natives.call("eval", null, "(function () {})").constructor,
            i = e.natives.call(
              "eval",
              null,
              "(async function () {})"
            ).constructor,
            o = e.natives.call("eval", null, "(function* () {})").constructor,
            a = e.natives.call(
              "eval",
              null,
              "(async function* () {})"
            ).constructor;
          e.RawProxy(n.prototype, "constructor", r),
            e.RawProxy(i.prototype, "constructor", r),
            e.RawProxy(o.prototype, "constructor", r),
            e.RawProxy(a.prototype, "constructor", r);
        }
      },
      2468: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(37),
          s = r(1472);
        function i(e, t) {
          let r = e.natives.call("Function", null, "url", "return import(url)");
          Object.defineProperty(t, n.$W.globals.importfn, {
            value: function (t, n) {
              let i = new URL(n, t).href;
              return n.includes(":") ||
                n.startsWith("/") ||
                n.startsWith(".") ||
                n.startsWith("..")
                ? r(`${(0, s.Oy)(i, e.meta)}?type=module`)
                : r(n);
            },
            writable: !1,
            configurable: !1,
            enumerable: !1,
          }),
            Object.defineProperty(t, n.$W.globals.metafn, {
              value: function (e, t) {
                return (
                  (e.url = t),
                  (e.resolve = function (e) {
                    return new URL(e, t).href;
                  }),
                  e
                );
              },
              writable: !1,
              configurable: !1,
              enumerable: !1,
            });
        }
      },
      4338: function (e, t, r) {
        function n(e) {
          e.Proxy("IDBFactory.prototype.open", {
            apply(t) {
              t.args[0] = `${e.url.origin}@${t.args[0]}`;
            },
          }),
            e.Trap("IDBDatabase.prototype.name", {
              get(e) {
                let t = e.get();
                return t.substring(t.indexOf("@") + 1);
              },
            });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      6593: function (e, t, r) {
        function n(e) {
          e.Proxy("StorageManager.prototype.getDirectory", {
            apply(t) {
              let r = t.call();
              t.return(
                (async () => {
                  let t = await r,
                    n = await t.getDirectoryHandle(
                      `${e.url.origin.replace(/\/|\s|\./g, "-")}`,
                      { create: !0 }
                    );
                  return (
                    Object.defineProperty(n, "name", {
                      value: "",
                      writable: !1,
                    }),
                    n
                  );
                })()
              );
            },
          });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      1320: function (e, t, r) {
        r.r(t), r.d(t, { default: () => o });
        var n = r(1323),
          s = r(2794),
          i = r(1914);
        function o(e) {
          n.iswindow &&
            e.Proxy("window.postMessage", {
              apply(e) {
                let {
                    constructor: { constructor: t },
                  } =
                    "object" == typeof e.args[0] && null !== e.args[0]
                      ? e.args[0]
                      : "object" == typeof e.args[2] && null !== e.args[2]
                      ? e.args[2]
                      : e.this &&
                        i.POLLUTANT in e.this &&
                        "object" == typeof e.this[i.POLLUTANT] &&
                        null !== e.this[i.POLLUTANT]
                      ? e.this[i.POLLUTANT]
                      : {},
                  r = t("return globalThis")()[s.pX],
                  n = t("...args", "this(...args)");
                (e.args[0] = {
                  $scramjet$messagetype: "window",
                  $scramjet$origin: r.url.origin,
                  $scramjet$data: e.args[0],
                }),
                  "string" == typeof e.args[1] && (e.args[1] = "*"),
                  "object" == typeof e.args[1] &&
                    (e.args[1].targetOrigin = "*"),
                  e.return(n.call(e.fn, ...e.args));
              },
            });
          let t = ["MessagePort.prototype.postMessage"];
          self.Worker && t.push("Worker.prototype.postMessage"),
            n.iswindow || t.push("self.postMessage"),
            e.Proxy(t, {
              apply(e) {
                e.args[0] = {
                  $scramjet$messagetype: "worker",
                  $scramjet$data: e.args[0],
                };
              },
            });
        }
      },
      1914: function (e, t, r) {
        r.r(t), r.d(t, { POLLUTANT: () => s, default: () => i });
        var n = r(37);
        let s = Symbol.for("scramjet realm pollutant");
        function i(e, t) {
          Object.defineProperty(t.Object.prototype, n.$W.globals.setrealmfn, {
            value(e) {
              return (
                Object.defineProperty(this, s, {
                  value: e,
                  writable: !1,
                  configurable: !0,
                  enumerable: !1,
                }),
                this
              );
            },
            writable: !0,
            configurable: !0,
            enumerable: !1,
          });
        }
      },
      9701: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e) {
          e.Proxy("EventSource", {
            construct(t) {
              t.args[0] = (0, n.Oy)(t.args[0], e.meta);
            },
          }),
            e.Trap("EventSource.prototype.url", {
              get(e) {
                (0, n.v2)(e.get());
              },
            });
        }
      },
      6972: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(1323),
          s = r(1472);
        function i(e) {
          e.Proxy("fetch", {
            apply(t) {
              ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                ((t.args[0] = (0, s.Oy)(t.args[0], e.meta)),
                n.isemulatedsw && (t.args[0] += "?from=swruntime"));
            },
          }),
            e.Proxy("Request", {
              construct(t) {
                ("string" == typeof t.args[0] || t.args[0] instanceof URL) &&
                  ((t.args[0] = (0, s.Oy)(t.args[0], e.meta)),
                  n.isemulatedsw && (t.args[0] += "?from=swruntime"));
              },
            }),
            e.Trap("Response.prototype.url", {
              get: (e) => (0, s.v2)(e.get()),
            }),
            e.Trap("Request.prototype.url", { get: (e) => (0, s.v2)(e.get()) });
        }
      },
      9931: function (e, t, r) {
        function n(e, t) {
          let r = new WeakMap(),
            n = new WeakMap();
          e.Proxy("WebSocket", {
            construct(n) {
              let s = new EventTarget();
              Object.setPrototypeOf(s, n.fn.prototype), (s.constructor = n.fn);
              let i = e.bare.createWebSocket(n.args[0], n.args[1], null, {
                  "User-Agent": t.navigator.userAgent,
                  Origin: e.url.origin,
                }),
                o = {
                  extensions: "",
                  protocol: "",
                  url: n.args[0],
                  binaryType: "blob",
                  barews: i,
                  onclose: null,
                  onerror: null,
                  onmessage: null,
                  onopen: null,
                };
              function a(e) {
                o["on" + e.type]?.(
                  new Proxy(e, {
                    get: (e, t) => "isTrusted" === t || Reflect.get(e, t),
                  })
                ),
                  s.dispatchEvent(e);
              }
              i.addEventListener("open", () => {
                a(new Event("open"));
              }),
                i.addEventListener("close", (e) => {
                  a(new CloseEvent("close", e));
                }),
                i.addEventListener("message", async (e) => {
                  let t = e.data;
                  "string" == typeof t ||
                    ("byteLength" in t
                      ? "blob" === o.binaryType
                        ? (t = new Blob([t]))
                        : Object.setPrototypeOf(t, ArrayBuffer.prototype)
                      : "arrayBuffer" in t &&
                        "arraybuffer" === o.binaryType &&
                        Object.setPrototypeOf(
                          (t = await t.arrayBuffer()),
                          ArrayBuffer.prototype
                        )),
                    a(
                      new MessageEvent("message", {
                        data: t,
                        origin: e.origin,
                        lastEventId: e.lastEventId,
                        source: e.source,
                        ports: e.ports,
                      })
                    );
                }),
                i.addEventListener("error", () => {
                  a(new Event("error"));
                }),
                r.set(s, o),
                n.return(s);
            },
          }),
            e.Trap("WebSocket.prototype.binaryType", {
              get: (e) => r.get(e.this).binaryType,
              set(e, t) {
                let n = r.get(e.this);
                ("blob" === t || "arraybuffer" === t) && (n.binaryType = t);
              },
            }),
            e.Trap("WebSocket.prototype.bufferedAmount", { get: () => 0 }),
            e.Trap("WebSocket.prototype.extensions", {
              get: (e) => r.get(e.this).extensions,
            }),
            e.Trap("WebSocket.prototype.onclose", {
              get: (e) => r.get(e.this).onclose,
              set(e, t) {
                r.get(e.this).onclose = t;
              },
            }),
            e.Trap("WebSocket.prototype.onerror", {
              get: (e) => r.get(e.this).onerror,
              set(e, t) {
                r.get(e.this).onerror = t;
              },
            }),
            e.Trap("WebSocket.prototype.onmessage", {
              get: (e) => r.get(e.this).onmessage,
              set(e, t) {
                r.get(e.this).onmessage = t;
              },
            }),
            e.Trap("WebSocket.prototype.onopen", {
              get: (e) => r.get(e.this).onopen,
              set(e, t) {
                r.get(e.this).onopen = t;
              },
            }),
            e.Trap("WebSocket.prototype.url", {
              get: (e) => r.get(e.this).url,
            }),
            e.Trap("WebSocket.prototype.protocol", {
              get: (e) => r.get(e.this).protocol,
            }),
            e.Trap("WebSocket.prototype.readyState", {
              get: (e) => r.get(e.this).barews.readyState,
            }),
            e.Proxy("WebSocket.prototype.send", {
              apply(e) {
                let t = r.get(e.this);
                e.return(t.barews.send(e.args[0]));
              },
            }),
            e.Proxy("WebSocket.prototype.close", {
              apply(e) {
                let t = r.get(e.this);
                void 0 === e.args[0] && (e.args[0] = 1e3),
                  void 0 === e.args[1] && (e.args[1] = ""),
                  e.return(t.barews.close(e.args[0], e.args[1]));
              },
            }),
            e.Proxy("WebSocketStream", {
              construct(r) {
                let s,
                  i,
                  o,
                  a = {};
                Object.setPrototypeOf(a, r.fn.prototype),
                  (a.constructor = r.fn);
                let l = e.bare.createWebSocket(r.args[0], r.args[1], null, {
                  "User-Agent": t.navigator.userAgent,
                  Origin: e.url.origin,
                });
                r.args[1]?.signal.addEventListener("abort", () => {
                  l.close(1e3, "");
                });
                let c = {
                  extensions: "",
                  protocol: "",
                  url: r.args[0],
                  barews: l,
                  opened: new Promise((e, t) => {
                    (s = e), (o = t);
                  }),
                  closed: new Promise((e) => {
                    i = e;
                  }),
                  readable: new ReadableStream({
                    start(e) {
                      l.addEventListener("message", async (t) => {
                        let r = t.data;
                        "string" == typeof r ||
                          ("byteLength" in r
                            ? Object.setPrototypeOf(r, ArrayBuffer.prototype)
                            : "arrayBuffer" in r &&
                              Object.setPrototypeOf(
                                (r = await r.arrayBuffer()),
                                ArrayBuffer.prototype
                              )),
                          e.enqueue(r);
                      });
                    },
                  }),
                  writable: new WritableStream({
                    write(e) {
                      l.send(e);
                    },
                  }),
                };
                l.addEventListener("open", () => {
                  s({
                    readable: c.readable,
                    writable: c.writable,
                    extensions: c.extensions,
                    protocol: c.protocol,
                  });
                }),
                  l.addEventListener("close", (e) => {
                    i({ code: e.code, reason: e.reason });
                  }),
                  l.addEventListener("error", (e) => {
                    o(e);
                  }),
                  n.set(a, c),
                  r.return(a);
              },
            }),
            e.Trap("WebSocketStream.prototype.closed", {
              get: (e) => n.get(e.this).closed,
            }),
            e.Trap("WebSocketStream.prototype.opened", {
              get: (e) => n.get(e.this).opened,
            }),
            e.Trap("WebSocketStream.prototype.url", {
              get: (e) => n.get(e.this).url,
            }),
            e.Proxy("WebSocketStream.prototype.close", {
              apply(e) {
                let t = n.get(e.this);
                return e.args[0]
                  ? (void 0 === e.args[0].closeCode &&
                      (e.args[0].closeCode = 1e3),
                    void 0 === e.args[0].reason && (e.args[0].reason = ""),
                    e.return(
                      t.barews.close(e.args[0].closeCode, e.args[0].reason)
                    ))
                  : e.return(t.barews.close(1e3, ""));
              },
            });
        }
        r.r(t), r.d(t, { default: () => n });
      },
      248: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(37),
          s = r(1472);
        function i(e, t) {
          let r;
          t.Worker &&
            (0, n.U5)("syncxhr", e.url) &&
            (r = e.natives.construct("Worker", n.$W.files.sync));
          let i = Symbol("xhr original args"),
            o = Symbol("xhr headers");
          e.Proxy("XMLHttpRequest.prototype.open", {
            apply(t) {
              t.args[1] && (t.args[1] = (0, s.Oy)(t.args[1], e.meta)),
                void 0 === t.args[2] && (t.args[2] = !0),
                (t.this[i] = t.args);
            },
          }),
            e.Proxy("XMLHttpRequest.prototype.setRequestHeader", {
              apply(e) {
                (e.this[o] || (e.this[o] = {}))[e.args[0]] = e.args[1];
              },
            }),
            e.Proxy("XMLHttpRequest.prototype.send", {
              apply(t) {
                let s = t.this[i];
                if (!s || s[2]) return;
                if (!(0, n.U5)("syncxhr", e.url))
                  return (
                    console.warn(
                      "ignoring request - sync xhr disabled in flags"
                    ),
                    t.return(void 0)
                  );
                let a = new SharedArrayBuffer(1024, {
                    maxByteLength: 0x7fffffff,
                  }),
                  l = new DataView(a);
                e.natives.call("Worker.prototype.postMessage", r, {
                  sab: a,
                  args: s,
                  headers: t.this[o],
                  body: t.args[0],
                });
                let c = performance.now();
                for (; 0 === l.getUint8(0); )
                  if (performance.now() - c > 1e3) throw Error("xhr timeout");
                let u = l.getUint16(1),
                  d = l.getUint32(3),
                  h = new Uint8Array(d);
                h.set(new Uint8Array(a.slice(7, 7 + d)));
                let p = new TextDecoder().decode(h),
                  f = l.getUint32(7 + d),
                  g = new Uint8Array(f);
                g.set(new Uint8Array(a.slice(11 + d, 11 + d + f)));
                let m = new TextDecoder().decode(g);
                e.RawTrap(t.this, "status", { get: () => u }),
                  e.RawTrap(t.this, "responseText", { get: () => m }),
                  e.RawTrap(t.this, "response", {
                    get: () =>
                      "arraybuffer" === t.this.responseType ? g.buffer : m,
                  }),
                  e.RawTrap(t.this, "responseXML", {
                    get: () => new DOMParser().parseFromString(m, "text/xml"),
                  }),
                  e.RawTrap(t.this, "getAllResponseHeaders", {
                    get: () => () => p,
                  }),
                  e.RawTrap(t.this, "getResponseHeader", {
                    get: () => (e) => {
                      let t = RegExp(`^${e}: (.*)$`, "m").exec(p);
                      return t ? t[1] : null;
                    },
                  }),
                  t.return(void 0);
              },
            }),
            e.Trap("XMLHttpRequest.prototype.responseURL", {
              get: (e) => (0, s.v2)(e.get()),
            });
        }
      },
      7418: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1478);
        function s(e, t) {
          e.Proxy(["setTimeout", "setInterval"], {
            apply(t) {
              t.args.length > 0 &&
                "string" == typeof t.args[0] &&
                (t.args[0] = (0, n.o)(
                  t.args[0],
                  "(setTimeout string eval)",
                  e.meta
                ));
            },
          });
        }
      },
      7791: function (e, t, r) {
        r.r(t), r.d(t, { default: () => a, enabled: () => o });
        var n = r(37),
          s = r(8665).A;
        let i = "/*scramtag ",
          o = (e) => (0, n.U5)("sourcemaps", e.url);
        function a(e, t) {
          Object.defineProperty(t, n.$W.globals.pushsourcemapfn, {
            value: (t, r) => {
              let n = performance.now();
              !(function (e, t, r) {
                let n = Uint8Array.from(t),
                  s = new DataView(n.buffer),
                  i = new TextDecoder("utf-8"),
                  o = [],
                  a = s.getUint32(0, !0),
                  l = 4;
                for (let e = 0; e < a; e++) {
                  let e = s.getUint32(l, !0);
                  l += 4;
                  let t = s.getUint32(l, !0);
                  l += 4;
                  let r = s.getUint8(l);
                  if (((l += 1), 0 == r))
                    o.push({ type: r, start: e, size: t });
                  else if (1 == r) {
                    let a = e + t,
                      c = s.getUint32(l, !0);
                    l += 4;
                    let u = i.decode(n.subarray(l, l + c));
                    o.push({ type: r, start: e, end: a, str: u });
                  }
                }
                e.box.sourcemaps[r] = o;
              })(e, t, r),
                s.time(e.meta, n, `scramtag parse for ${r}`);
            },
            enumerable: !1,
            writable: !1,
            configurable: !1,
          }),
            e.Proxy("Function.prototype.toString", {
              apply(t) {
                performance.now(),
                  (function (e, t) {
                    let r = t.fn.call(t.this),
                      n = (function (e) {
                        let t = e.indexOf(i);
                        if (-1 === t) return null;
                        let r = e.indexOf("*/", t);
                        if (-1 === r)
                          throw (console.log(e, t, r), Error("unreachable"));
                        let n = e.substring(t + 2, r).split(" ");
                        if (
                          3 !== n.length ||
                          "scramtag" !== n[0] ||
                          !Number.isSafeInteger(+n[1])
                        )
                          throw (console.log(e, t, r, n), Error("invalid tag"));
                        return [n[2], t, +n[1]];
                      })(r);
                    if (!n) return t.return(r);
                    let [s, o, a] = n,
                      l = a - o,
                      c = l + r.length,
                      u = e.box.sourcemaps[s];
                    if (!u)
                      return (
                        console.warn("failed to get rewrites for tag", s),
                        t.return(r)
                      );
                    let d = 0;
                    for (; d < u.length; )
                      if (u[d].start < l) d++;
                      else break;
                    let h = d;
                    for (; h < u.length; )
                      if (
                        (function (e) {
                          if (0 === e.type) return e.start + e.size;
                          if (1 === e.type) return e.end;
                          throw "unreachable";
                        })(u[h]) < c
                      )
                        h++;
                      else break;
                    let p = u.slice(d, h),
                      f = "",
                      g = 0;
                    for (let e of p)
                      if (((f += r.slice(g, e.start - l)), 0 === e.type))
                        g = e.start + e.size - l;
                      else if (1 === e.type) (f += e.str), (g = e.end - l);
                      else throw "unreachable";
                    (f += r.slice(g)),
                      (f = f.replace(`${i}${a} ${s}*/`, "")),
                      t.return(f);
                  })(e, t);
              },
            });
        }
      },
      9399: function (e, t, r) {
        r.r(t), r.d(t, { default: () => i });
        var n = r(236),
          s = r(1472);
        function i(e, t) {
          e.Proxy("Worker", {
            construct(t) {
              (t.args[0] = (0, s.Oy)(t.args[0], e.meta) + "?dest=worker"),
                t.args[1] &&
                  "module" === t.args[1].type &&
                  (t.args[0] += "&type=module");
              let r = t.call(),
                i = new n.DD();
              (async () => {
                let t = await i.getInnerPort();
                e.natives.call(
                  "Worker.prototype.postMessage",
                  r,
                  { $scramjet$type: "baremuxinit", port: t },
                  [t]
                );
              })();
            },
          }),
            e.Proxy("SharedWorker", {
              construct(t) {
                (t.args[0] =
                  (0, s.Oy)(t.args[0], e.meta) + "?dest=sharedworker"),
                  t.args[1] &&
                    "string" == typeof t.args[1] &&
                    (t.args[1] = `${e.url.origin}@${t.args[1]}`),
                  t.args[1] &&
                    "object" == typeof t.args[1] &&
                    ("module" === t.args[1].type &&
                      (t.args[0] += "&type=module"),
                    t.args[1].name &&
                      (t.args[1].name = `${e.url.origin}@${t.args[1].name}`));
                let r = t.call(),
                  i = new n.DD();
                (async () => {
                  let t = await i.getInnerPort();
                  e.natives.call(
                    "MessagePort.prototype.postMessage",
                    r.port,
                    { $scramjet$type: "baremuxinit", port: t },
                    [t]
                  );
                })();
              },
            }),
            e.Proxy("Worklet.prototype.addModule", {
              apply(t) {
                t.args[0] &&
                  (t.args[0] = (0, s.Oy)(t.args[0], e.meta) + "?dest=worklet");
              },
            });
        }
      },
      581: function (e, t, r) {
        r.r(t),
          r.d(t, { createWrapFn: () => a, default: () => c, order: () => l });
        var n = r(1323),
          s = r(2794),
          i = r(37),
          o = r(591);
        function a(e, t) {
          return function (r, i) {
            if (r === t.location) return e.locationProxy;
            if (r === t.eval) return o.indirectEval.bind(e, i);
            if (n.iswindow) {
              if (r === t.parent)
                if (s.pX in t.parent) return t.parent;
                else return t;
              else if (r === t.top) {
                let e = t;
                for (;;) {
                  let t = e.parent.self;
                  if (t === e || !(s.pX in t)) break;
                  e = t;
                }
                return e;
              }
            }
            return r;
          };
        }
        let l = 4;
        function c(e, t) {
          Object.defineProperty(t, i.$W.globals.wrapfn, {
            value: e.wrapfn,
            writable: !1,
            configurable: !1,
            enumerable: !1,
          }),
            Object.defineProperty(t, i.$W.globals.wrappropertyfn, {
              value: function (e) {
                return "location" === e ||
                  "parent" === e ||
                  "top" === e ||
                  "eval" === e
                  ? i.$W.globals.wrappropertybase + e
                  : e;
              },
              writable: !1,
              configurable: !1,
              enumerable: !1,
            }),
            Object.defineProperty(t, i.$W.globals.cleanrestfn, {
              value: function (e) {},
              writable: !1,
              configurable: !1,
              enumerable: !1,
            }),
            Object.defineProperty(
              t.Object.prototype,
              i.$W.globals.wrappropertybase + "location",
              {
                get: function () {
                  return this === t || this === t.document
                    ? e.locationProxy
                    : this.location;
                },
                set(r) {
                  if (this === t || this === t.document) {
                    e.url = r;
                    return;
                  }
                  this.location = r;
                },
                configurable: !1,
                enumerable: !1,
              }
            ),
            Object.defineProperty(
              t.Object.prototype,
              i.$W.globals.wrappropertybase + "parent",
              {
                get: function () {
                  return e.wrapfn(this.parent, !1);
                },
                set(e) {
                  this.parent = e;
                },
                configurable: !1,
                enumerable: !1,
              }
            ),
            Object.defineProperty(
              t.Object.prototype,
              i.$W.globals.wrappropertybase + "top",
              {
                get: function () {
                  return e.wrapfn(this.top, !1);
                },
                set(e) {
                  this.top = e;
                },
                configurable: !1,
                enumerable: !1,
              }
            ),
            Object.defineProperty(
              t.Object.prototype,
              i.$W.globals.wrappropertybase + "eval",
              {
                get: function () {
                  return e.wrapfn(this.eval, !0);
                },
                set(e) {
                  this.eval = e;
                },
                configurable: !1,
                enumerable: !1,
              }
            ),
            (t.$scramitize = function (e) {
              return (
                location,
                n.iswindow && t.top,
                "string" == typeof e && e.includes("scramjet"),
                "string" == typeof e && e.includes(location.origin),
                e
              );
            }),
            Object.defineProperty(t, i.$W.globals.trysetfn, {
              value: function (r, n, s) {
                return (
                  r instanceof t.Location && ((e.locationProxy.href = s), !0)
                );
              },
              writable: !1,
              configurable: !1,
            });
        }
      },
      1229: function (e, t, r) {
        r.r(t), r.d(t, { SingletonBox: () => n });
        class n {
          ownerclient;
          clients = [];
          globals = new Map();
          documents = new Map();
          locations = new Map();
          sourcemaps = {};
          constructor(e) {
            this.ownerclient = e;
          }
          registerClient(e, t) {
            this.clients.push(e),
              this.globals.set(t, e),
              this.documents.set(t.document, e),
              this.locations.set(t.location, e);
          }
        }
      },
      8409: function (e, t, r) {
        r.r(t), r.d(t, { ScramjetServiceWorkerRuntime: () => i });
        var n = r(1472),
          s = r(8665).A;
        class i {
          client;
          recvport;
          constructor(e) {
            (this.client = e),
              (self.onconnect = (t) => {
                let r = t.ports[0];
                s.log("sw", "connected"),
                  r.addEventListener("message", (t) => {
                    console.log("sw", t.data),
                      "scramjet$type" in t.data &&
                        ("init" === t.data.scramjet$type
                          ? ((this.recvport = t.data.scramjet$port),
                            this.recvport.postMessage({
                              scramjet$type: "init",
                            }))
                          : o.call(this, e, t.data));
                  }),
                  r.start();
              });
          }
          hook() {
            (this.client.global.registration = {
              scope: this.client.url.href,
              active: {
                scriptURL: this.client.url.href,
                state: "activated",
                onstatechange: null,
                onerror: null,
                postMessage: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: (e) => !1,
              },
              showNotification: async () => {},
              unregister: async () => !0,
              update: async () => {},
              installing: null,
              waiting: null,
            }),
              (this.client.global.ServiceWorkerGlobalScope =
                this.client.global);
          }
        }
        function o(e, t) {
          let r = this.recvport,
            i = t.scramjet$type,
            o = t.scramjet$token,
            a = e.eventcallbacks.get(self);
          if ("fetch" === i) {
            s.log("ee", t);
            let i = a.filter((e) => "fetch" === e.event);
            if (!i) return;
            for (let a of i) {
              let i = t.scramjet$request,
                l = new e.natives.Request((0, n.v2)(i.url), {
                  body: i.body,
                  headers: new Headers(i.headers),
                  method: i.method,
                  mode: "same-origin",
                });
              Object.defineProperty(l, "destination", {
                value: i.destinitation,
              });
              let c = new Event("fetch");
              c.request = l;
              let u = !1;
              (c.respondWith = (e) => {
                (u = !0),
                  (async () => {
                    let t = {
                      scramjet$type: "fetch",
                      scramjet$token: o,
                      scramjet$response: {
                        body: (e = await e).body,
                        headers: Array.from(e.headers.entries()),
                        status: e.status,
                        statusText: e.statusText,
                      },
                    };
                    s.log("sw", "responding", t), r.postMessage(t, [e.body]);
                  })();
              }),
                s.log("to fn", c),
                a.proxiedCallback(
                  new Proxy(c, {
                    get: (e, t, r) => "isTrusted" === t || Reflect.get(e, t),
                  })
                ),
                u ||
                  (console.log("sw", "no response"),
                  r.postMessage({
                    scramjet$type: "fetch",
                    scramjet$token: o,
                    scramjet$response: !1,
                  }));
            }
          }
        }
      },
      9353: function (e, t, r) {
        r.r(t), r.d(t, { default: () => s });
        var n = r(1472);
        function s(e) {
          e.Proxy("importScripts", {
            apply(t) {
              for (let r in t.args) t.args[r] = (0, n.Oy)(t.args[r], e.meta);
            },
          });
        }
      },
      3402: function (e, t, r) {
        r.d(t, { q: () => a });
        var n = r(37),
          s = r(4869),
          i = r(1862),
          o = r(8665).A;
        class a extends EventTarget {
          db;
          constructor(e) {
            super();
            const t = (e, r) => {
                for (let n in r)
                  r[n] instanceof Object &&
                    n in e &&
                    Object.assign(r[n], t(e[n], r[n]));
                return Object.assign(e || {}, r);
              },
              r = t(
                {
                  prefix: "/assets/sj/",
                  globals: {
                    wrapfn: "$scramjet$wrap",
                    wrappropertybase: "$scramjet__",
                    wrappropertyfn: "$scramjet$prop",
                    cleanrestfn: "$scramjet$clean",
                    importfn: "$scramjet$import",
                    rewritefn: "$scramjet$rewrite",
                    metafn: "$scramjet$meta",
                    setrealmfn: "$scramjet$setrealm",
                    pushsourcemapfn: "$scramjet$pushsourcemap",
                    trysetfn: "$scramjet$tryset",
                    templocid: "$scramjet$temploc",
                    tempunusedid: "$scramjet$tempunused",
                  },
                  files: {
                    wasm: "/wasm.wasm",
                    all: "/all.js",
                    sync: "/sync.js",
                  },
                  flags: {
                    serviceworkers: !1,
                    syncxhr: !1,
                    strictRewrites: !0,
                    rewriterLogs: !1,
                    captureErrors: !0,
                    cleanErrors: !1,
                    scramitize: !1,
                    sourcemaps: !0,
                    destructureRewrites: !1,
                    interceptDownloads: !1,
                    allowInvalidJs: !0,
                    allowFailedIntercepts: !0,
                  },
                  siteFlags: {},
                  codec: {
                    encode: (e) => (e ? encodeURIComponent(e) : e),
                    decode: (e) => (e ? decodeURIComponent(e) : e),
                  },
                },
                e
              );
            (r.codec.encode = r.codec.encode.toString()),
              (r.codec.decode = r.codec.decode.toString()),
              (0, n.Nk)(r);
          }
          async init() {
            (0, n.Ec)(),
              await this.openIDB(),
              navigator.serviceWorker.controller?.postMessage({
                scramjet$type: "loadConfig",
                config: n.$W,
              }),
              o.log("config loaded"),
              navigator.serviceWorker.addEventListener("message", (e) => {
                if (!("scramjet$type" in e.data)) return;
                let t = e.data;
                "download" === t.scramjet$type &&
                  this.dispatchEvent(
                    new i.ScramjetGlobalDownloadEvent(t.download)
                  );
              });
          }
          createFrame(e) {
            return (
              e || (e = document.createElement("iframe")), new s.X(this, e)
            );
          }
          encodeUrl(e) {
            if (
              ("string" == typeof e && (e = new URL(e)),
              "http:" != e.protocol && "https:" != e.protocol)
            )
              return e.href;
            let t = (0, n.hD)(e.hash.slice(1));
            return (
              (e.hash = ""),
              n.$W.prefix + (0, n.hD)(e.href) + (t ? "#" + t : "")
            );
          }
          decodeUrl(e) {
            e instanceof URL && (e = e.toString());
            let t = location.origin + n.$W.prefix;
            return (0, n.P_)(e.slice(t.length));
          }
          async openIDB() {
            let e = indexedDB.open("$scramjet", 1);
            return new Promise((t, r) => {
              (e.onsuccess = async () => {
                (this.db = e.result), await this.#e(), t(e.result);
              }),
                (e.onupgradeneeded = () => {
                  let t = e.result;
                  t.objectStoreNames.contains("config") ||
                    t.createObjectStore("config"),
                    t.objectStoreNames.contains("cookies") ||
                      t.createObjectStore("cookies"),
                    t.objectStoreNames.contains("redirectTrackers") ||
                      t.createObjectStore("redirectTrackers"),
                    t.objectStoreNames.contains("referrerPolicies") ||
                      t.createObjectStore("referrerPolicies"),
                    t.objectStoreNames.contains("publicSuffixList") ||
                      t.createObjectStore("publicSuffixList");
                }),
                (e.onerror = () => r(e.error));
            });
          }
          async #e() {
            if (!this.db) return void console.error("Store not ready!");
            let e = this.db
              .transaction("config", "readwrite")
              .objectStore("config")
              .put(n.$W, "config");
            return new Promise((t, r) => {
              (e.onsuccess = t), (e.onerror = r);
            });
          }
          async modifyConfig(e) {
            (0, n.Nk)(Object.assign({}, n.$W, e)),
              (0, n.Ec)(),
              await this.#e(),
              navigator.serviceWorker.controller?.postMessage({
                scramjet$type: "loadConfig",
                config: n.$W,
              });
          }
          addEventListener(e, t, r) {
            super.addEventListener(e, t, r);
          }
        }
      },
      4869: function (e, t, r) {
        r.d(t, { X: () => i });
        var n = r(2794),
          s = r(8665).A;
        class i extends EventTarget {
          controller;
          frame;
          constructor(e, t) {
            super(),
              (this.controller = e),
              (this.frame = t),
              (t.name = `${Array(8)
                .fill(0)
                .map(() => Math.floor(36 * Math.random()).toString(36))
                .join("")}`),
              (t[n.zr] = this);
          }
          get client() {
            return this.frame.contentWindow.window[n.pX];
          }
          get url() {
            return this.client.url;
          }
          go(e) {
            e instanceof URL && (e = e.toString()),
              s.log("navigated to", e),
              (this.frame.src = this.controller.encodeUrl(e));
          }
          back() {
            this.frame.contentWindow?.history.back();
          }
          forward() {
            this.frame.contentWindow?.history.forward();
          }
          reload() {
            this.frame.contentWindow?.location.reload();
          }
          addEventListener(e, t, r) {
            super.addEventListener(e, t, r);
          }
        }
      },
      9052: function (e, t, r) {
        r.r(t),
          r.d(t, { ScramjetController: () => s.q, ScramjetFrame: () => n.X });
        var n = r(4869),
          s = r(3402);
      },
      8665: function (e, t, r) {
        r.d(t, { A: () => s });
        let n = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            debug: console.debug,
            info: console.info,
          },
          s = {
            fmt: function (e, t, ...r) {
              let n = Error.prepareStackTrace;
              Error.prepareStackTrace = (e, t) => {
                t.shift(), t.shift(), t.shift();
                let r = "";
                for (let e = 1; e < Math.min(2, t.length); e++)
                  t[e].getFunctionName() &&
                    (r += `${t[e].getFunctionName()} -> ` + r);
                return r + (t[0].getFunctionName() || "Anonymous");
              };
              let s = (function () {
                try {
                  throw Error();
                } catch (e) {
                  return e.stack;
                }
              })();
              (Error.prepareStackTrace = n), this.print(e, s, t, ...r);
            },
            print(e, t, r, ...s) {
              (n[e] || n.log)(
                `%c${t}%c ${r}`,
                `
  	background-color: ${
      { log: "#000", warn: "#f80", error: "#f00", debug: "transparent" }[e]
    };
  	color: ${{ log: "#fff", warn: "#fff", error: "#fff", debug: "gray" }[e]};
  	padding: ${{ log: 2, warn: 4, error: 4, debug: 0 }[e]}px;
  	font-weight: bold;
  	font-family: monospace;
  	font-size: 0.9em;
  `,
                `${"debug" === e ? "color: gray" : ""}`,
                ...s
              );
            },
            log: function (e, ...t) {
              this.fmt("log", e, ...t);
            },
            warn: function (e, ...t) {
              this.fmt("warn", e, ...t);
            },
            error: function (e, ...t) {
              this.fmt("error", e, ...t);
            },
            debug: function (e, ...t) {
              this.fmt("debug", e, ...t);
            },
            time(e, t, r) {},
          };
      },
      3831: function (e, t, r) {
        r.d(t, { k: () => i });
        var n = r(4322),
          s = r.n(n);
        class i {
          cookies = {};
          setCookies(e, t) {
            for (let r of e) {
              let e = s()(r),
                n = { domain: e.domain, sameSite: e.sameSite, ...e[0] };
              n.domain || (n.domain = "." + t.hostname),
                n.domain.startsWith(".") || (n.domain = "." + n.domain),
                n.path || (n.path = "/"),
                n.sameSite || (n.sameSite = "lax"),
                n.expires && (n.expires = n.expires.toString());
              let i = `${n.domain}@${n.path}@${n.name}`;
              this.cookies[i] = n;
            }
          }
          getCookies(e, t) {
            let r = new Date(),
              n = Object.values(this.cookies),
              s = [];
            for (let i of n) {
              if (i.expires && new Date(i.expires) < r) {
                delete this.cookies[`${i.domain}@${i.path}@${i.name}`];
                continue;
              }
              (!i.secure || "https:" === e.protocol) &&
                (!i.httpOnly || !t) &&
                e.pathname.startsWith(i.path) &&
                (!i.domain.startsWith(".") ||
                  e.hostname.endsWith(i.domain.slice(1))) &&
                s.push(i);
            }
            return s.map((e) => `${e.name}=${e.value}`).join("; ");
          }
          load(e) {
            if ("object" == typeof e) return e;
            this.cookies = JSON.parse(e);
          }
          dump() {
            return JSON.stringify(this.cookies);
          }
        }
      },
      1427: function (e, t, r) {
        r.d(t, { u: () => n });
        class n {
          headers = {};
          set(e, t) {
            this.headers[e.toLowerCase()] = t;
          }
        }
      },
      2393: function (e, t, r) {
        r.d(t, { V: () => o });
        var n = r(2614),
          s = r(884),
          i = r(1472);
        let o = [
          {
            fn: (e, t) => (0, i.Oy)(e, t),
            src: [
              "embed",
              "script",
              "img",
              "frame",
              "source",
              "input",
              "track",
            ],
            href: ["a", "link", "area", "use", "image"],
            data: ["object"],
            action: ["form"],
            formaction: ["button", "input", "textarea", "submit"],
            poster: ["video"],
            "xlink:href": ["image"],
          },
          { fn: (e, t) => (0, i.Oy)(e, t), src: ["iframe"] },
          { fn: (e, t) => null, sandbox: ["iframe"] },
          {
            fn: (e, t) =>
              e.startsWith("blob:") ? (0, i.$n)(e) : (0, i.Oy)(e, t),
            src: ["video", "audio"],
          },
          { fn: () => "", integrity: ["script", "link"] },
          {
            fn: () => null,
            nonce: "*",
            csp: ["iframe"],
            credentialless: ["iframe"],
          },
          {
            fn: (e, t) => (0, s.PV)(e, t),
            srcset: ["img", "source"],
            imagesrcset: ["link"],
          },
          {
            fn: (e, t, r) =>
              (0, s.Qs)(
                e,
                r,
                {
                  origin: new URL(t.origin.origin),
                  base: new URL(t.origin.origin),
                },
                !0
              ),
            srcdoc: ["iframe"],
          },
          { fn: (e, t) => (0, n.s)(e, t), style: "*" },
          {
            fn: (e, t) =>
              "_top" === e || "_unfencedTop" === e
                ? t.topFrameName
                : "_parent" === e
                ? t.parentFrameName
                : e,
            target: ["a", "base"],
          },
        ];
      },
      37: function (e, t, r) {
        let n, s, i;
        r.d(t, {
          $W: () => i,
          Ec: () => a,
          Nk: () => c,
          P_: () => s,
          U5: () => l,
          hD: () => n,
        }),
          r(2393),
          r(9381);
        let o = Function;
        function a() {
          (n = o(`return ${i.codec.encode}`)()),
            (s = o(`return ${i.codec.decode}`)());
        }
        function l(e, t) {
          let r = i.flags[e];
          for (let r in i.siteFlags) {
            let n = i.siteFlags[r];
            if (new RegExp(r).test(t.href) && e in n) return n[e];
          }
          return r;
        }
        function c(e) {
          (i = e), a();
        }
      },
      2614: function (e, t, r) {
        r.d(t, { f: () => i, s: () => s });
        var n = r(1472);
        function s(e, t) {
          return o("rewrite", e, t);
        }
        function i(e) {
          return o("unrewrite", e);
        }
        function o(e, t, r) {
          return (t = (t = new String(t).toString()).replace(
            /url\(['"]?(.+?)['"]?\)/gm,
            (t, s) => {
              let i =
                "rewrite" === e ? (0, n.Oy)(s.trim(), r) : (0, n.v2)(s.trim());
              return t.replace(s, i);
            }
          )).replace(
            /@import\s+(url\s*?\(.{0,9999}?\)|['"].{0,9999}?['"]|.{0,9999}?)($|\s|;)/gm,
            (t, s) =>
              t.replace(
                s,
                s.replace(
                  /^(url\(['"]?|['"]|)(.+?)(['"]|['"]?\)|)$/gm,
                  (t, s, i, o) => {
                    if (s.startsWith("url")) return t;
                    let a =
                      "rewrite" === e
                        ? (0, n.Oy)(i.trim(), r)
                        : (0, n.v2)(i.trim());
                    return `${s}${a}${o}`;
                  }
                )
              )
          );
        }
      },
      4435: function (e, t, r) {
        r.d(t, { l: () => l });
        var n = r(1472),
          s = r(8228);
        let i = new Set([
            "cross-origin-embedder-policy",
            "cross-origin-opener-policy",
            "cross-origin-resource-policy",
            "content-security-policy",
            "content-security-policy-report-only",
            "expect-ct",
            "feature-policy",
            "origin-isolation",
            "strict-transport-security",
            "upgrade-insecure-requests",
            "x-content-type-options",
            "x-download-options",
            "x-frame-options",
            "x-permitted-cross-domain-policies",
            "x-powered-by",
            "x-xss-protection",
            "clear-site-data",
          ]),
          o = new Set(["location", "content-location", "referer"]);
        function a(e, t) {
          return e.replace(/<(.*)>/gi, (e) => (0, n.Oy)(e, t));
        }
        async function l(e, t, r, l) {
          let c = {};
          for (let t in e) c[t.toLowerCase()] = e[t];
          for (let e of i) delete c[e];
          for (let e of o) c[e] && (c[e] = (0, n.Oy)(c[e]?.toString(), t));
          if (
            ("string" == typeof c.link
              ? (c.link = a(c.link, t))
              : Array.isArray(c.link) && (c.link = c.link.map((e) => a(e, t))),
            "string" == typeof c.referer)
          ) {
            let e = new URL(c.referer),
              r = await l.get(e.href);
            if (r) {
              let n = r.policy
                .toLowerCase()
                .split(",")
                .map((e) => e.trim());
              n.includes("no-referrer") ||
              (n.includes("no-referrer-when-downgrade") &&
                "http:" === t.origin.protocol &&
                "https:" === e.protocol)
                ? delete c.referer
                : n.includes("origin")
                ? (c.referer = e.origin)
                : n.includes("origin-when-cross-origin")
                ? e.origin !== t.origin.origin
                  ? (c.referer = e.origin)
                  : (c.referer = e.href)
                : n.includes("same-origin")
                ? e.origin === t.origin.origin
                  ? (c.referer = e.href)
                  : delete c.referer
                : n.includes("strict-origin")
                ? "http:" === t.origin.protocol && "https:" === e.protocol
                  ? delete c.referer
                  : (c.referer = e.origin)
                : e.origin === t.origin.origin
                ? (c.referer = e.href)
                : "http:" === t.origin.protocol && "https:" === e.protocol
                ? delete c.referer
                : (c.referer = e.origin);
            }
          }
          return (
            "string" == typeof c["sec-fetch-dest"] &&
              "" === c["sec-fetch-dest"] &&
              (c["sec-fetch-dest"] = "empty"),
            "string" == typeof c["sec-fetch-site"] &&
              "none" !== c["sec-fetch-site"] &&
              ("string" == typeof c.referer
                ? (c["sec-fetch-site"] = await (0, s.ps)(
                    t,
                    new URL(c.referer),
                    r
                  ))
                : (console.warn(
                    "Missing referrer header; can't rewrite sec-fetch-site properly. Falling back to unsafe deletion."
                  ),
                  delete c["sec-fetch-site"])),
            c
          );
        }
      },
      884: function (e, t, r) {
        r.d(t, { PV: () => m, Qs: () => f, Uk: () => h, nK: () => g });
        var n = r(3808),
          s = r(8866),
          i = r(6498),
          o = r(1472),
          a = r(2614),
          l = r(1478),
          c = r(37),
          u = r(2393),
          d = r(8665).A;
        function h(e, t) {
          let r = JSON.stringify(e.dump()),
            n = `
		self.COOKIE = ${r};
		$scramjetLoadClient().loadAndHook(${JSON.stringify(c.$W)});
		if ("document" in self && document?.currentScript) {
			document.currentScript.remove();
		}
	`,
            s = y(p.encode(n));
          return [
            t(c.$W.files.wasm),
            t(c.$W.files.all),
            t("data:application/javascript;base64," + s),
          ];
        }
        let p = new TextEncoder();
        function f(e, t, r, c = !1) {
          let g = performance.now(),
            m = (function (e, t, r, c = !1) {
              let d = new s.DV((e, t) => t),
                f = new n.iX(d);
              if (
                (f.write(e),
                f.end(),
                (function e(t, r, n) {
                  if (
                    ("base" === t.name &&
                      void 0 !== t.attribs.href &&
                      (n.base = new URL(t.attribs.href, n.origin)),
                    t.attribs)
                  ) {
                    for (let e of u.V)
                      for (let s in e) {
                        let i = e[s.toLowerCase()];
                        if (
                          "function" != typeof i &&
                          ("*" === i || i.includes(t.name)) &&
                          void 0 !== t.attribs[s]
                        ) {
                          let i = t.attribs[s],
                            o = e.fn(i, n, r);
                          null === o ? delete t.attribs[s] : (t.attribs[s] = o),
                            (t.attribs[`scramjet-attr-${s}`] = i);
                        }
                      }
                    for (let [e, r] of Object.entries(t.attribs))
                      b.includes(e) &&
                        ((t.attribs[`scramjet-attr-${e}`] = r),
                        (t.attribs[e] = (0, l.o)(
                          r,
                          `(inline ${e} on element)`,
                          n
                        )));
                  }
                  if (
                    ("style" === t.name &&
                      void 0 !== t.children[0] &&
                      (t.children[0].data = (0, a.s)(t.children[0].data, n)),
                    "script" === t.name &&
                      "module" === t.attribs.type &&
                      t.attribs.src &&
                      (t.attribs.src = t.attribs.src + "?type=module"),
                    "script" === t.name &&
                      "importmap" === t.attribs.type &&
                      void 0 !== t.children[0])
                  ) {
                    let e = t.children[0].data;
                    try {
                      let r = JSON.parse(e);
                      if (r.imports)
                        for (let e in r.imports) {
                          let t = r.imports[e];
                          "string" == typeof t &&
                            ((t = (0, o.Oy)(t, n)), (r.imports[e] = t));
                        }
                      t.children[0].data = JSON.stringify(r);
                    } catch (e) {
                      console.error("Failed to parse importmap JSON:", e);
                    }
                  }
                  if (
                    "script" === t.name &&
                    /(application|text)\/javascript|module|undefined/.test(
                      t.attribs.type
                    ) &&
                    void 0 !== t.children[0]
                  ) {
                    let e = t.children[0].data,
                      r = "module" === t.attribs.type;
                    (t.attribs["scramjet-attr-script-source-src"] = y(
                      p.encode(e)
                    )),
                      (e = e.replace(/<!--[\s\S]*?-->/g, "")),
                      (t.children[0].data = (0, l.o)(
                        e,
                        "(inline script element)",
                        n,
                        r
                      ));
                  }
                  if ("meta" === t.name && void 0 !== t.attribs["http-equiv"]) {
                    if (
                      "content-security-policy" ===
                      t.attribs["http-equiv"].toLowerCase()
                    )
                      t = new s.Mw(t.attribs.content);
                    else if (
                      "refresh" === t.attribs["http-equiv"] &&
                      t.attribs.content.includes("url")
                    ) {
                      let e = t.attribs.content.split("url=");
                      e[1] && (e[1] = (0, o.Oy)(e[1].trim(), n)),
                        (t.attribs.content = e.join("url="));
                    }
                  }
                  if (t.childNodes)
                    for (let s in t.childNodes)
                      t.childNodes[s] = e(t.childNodes[s], r, n);
                  return t;
                })(d.root, t, r),
                c)
              ) {
                let e = (function e(t) {
                  if (t.type === n.RJ.vw && "head" === t.name) return t;
                  if (t.childNodes)
                    for (let r of t.childNodes) {
                      let t = e(r);
                      if (t) return t;
                    }
                  return null;
                })(d.root);
                e ||
                  ((e = new s.Hg("head", {}, [])), d.root.children.unshift(e)),
                  e.children.unshift(
                    ...h(t, (e) => new s.Hg("script", { src: e }))
                  );
              }
              return (0, i.A)(d.root, {
                encodeEntities: "utf8",
                decodeEntities: !1,
              });
            })(e, t, r, c);
          return d.time(r, g, "html rewrite"), m;
        }
        function g(e) {
          let t = new s.DV((e, t) => t),
            r = new n.iX(t);
          return (
            r.write(e),
            r.end(),
            !(function e(t) {
              if ("attribs" in t)
                for (let e in t.attribs) {
                  if ("scramjet-attr-script-source-src" == e) {
                    t.children[0] &&
                      "data" in t.children[0] &&
                      (t.children[0].data = atob(t.attribs[e]));
                    continue;
                  }
                  e.startsWith("scramjet-attr-") &&
                    ((t.attribs[e.slice(14)] = t.attribs[e]),
                    delete t.attribs[e]);
                }
              if ("childNodes" in t) for (let r of t.childNodes) e(r);
            })(t.root),
            (0, i.A)(t.root, { decodeEntities: !1 })
          );
        }
        function m(e, t) {
          return e
            .split(/ .*,/)
            .map((e) => e.trim())
            .map((e) => {
              let [r, ...n] = e.split(/\s+/),
                s = (0, o.Oy)(r.trim(), t);
              return n.length > 0 ? `${s} ${n.join(" ")}` : s;
            })
            .join(", ");
        }
        function y(e) {
          return btoa(Array.from(e, (e) => String.fromCodePoint(e)).join(""));
        }
        let b = [
          "onbeforexrselect",
          "onabort",
          "onbeforeinput",
          "onbeforematch",
          "onbeforetoggle",
          "onblur",
          "oncancel",
          "oncanplay",
          "oncanplaythrough",
          "onchange",
          "onclick",
          "onclose",
          "oncontentvisibilityautostatechange",
          "oncontextlost",
          "oncontextmenu",
          "oncontextrestored",
          "oncuechange",
          "ondblclick",
          "ondrag",
          "ondragend",
          "ondragenter",
          "ondragleave",
          "ondragover",
          "ondragstart",
          "ondrop",
          "ondurationchange",
          "onemptied",
          "onended",
          "onerror",
          "onfocus",
          "onformdata",
          "oninput",
          "oninvalid",
          "onkeydown",
          "onkeypress",
          "onkeyup",
          "onload",
          "onloadeddata",
          "onloadedmetadata",
          "onloadstart",
          "onmousedown",
          "onmouseenter",
          "onmouseleave",
          "onmousemove",
          "onmouseout",
          "onmouseover",
          "onmouseup",
          "onmousewheel",
          "onpause",
          "onplay",
          "onplaying",
          "onprogress",
          "onratechange",
          "onreset",
          "onresize",
          "onscroll",
          "onsecuritypolicyviolation",
          "onseeked",
          "onseeking",
          "onselect",
          "onslotchange",
          "onstalled",
          "onsubmit",
          "onsuspend",
          "ontimeupdate",
          "ontoggle",
          "onvolumechange",
          "onwaiting",
          "onwebkitanimationend",
          "onwebkitanimationiteration",
          "onwebkitanimationstart",
          "onwebkittransitionend",
          "onwheel",
          "onauxclick",
          "ongotpointercapture",
          "onlostpointercapture",
          "onpointerdown",
          "onpointermove",
          "onpointerrawupdate",
          "onpointerup",
          "onpointercancel",
          "onpointerover",
          "onpointerout",
          "onpointerenter",
          "onpointerleave",
          "onselectstart",
          "onselectionchange",
          "onanimationend",
          "onanimationiteration",
          "onanimationstart",
          "ontransitionrun",
          "ontransitionstart",
          "ontransitionend",
          "ontransitioncancel",
          "oncopy",
          "oncut",
          "onpaste",
          "onscrollend",
          "onscrollsnapchange",
          "onscrollsnapchanging",
        ];
      },
      9381: function (e, t, r) {
        r(2614), r(4435), r(884), r(1478), r(1472), r(2015), r(1561);
      },
      1478: function (e, t, r) {
        r.d(t, { o: () => o });
        var n = r(37),
          s = r(1561),
          i = r(8665).A;
        function o(e, t, r, a = !1) {
          try {
            let o = (function (e, t, r, n = !1) {
                return (function (e, t, r, n) {
                  let [o, a] = (0, s.nb)(r);
                  try {
                    let a,
                      l = performance.now();
                    (a =
                      "string" == typeof e
                        ? o.rewrite_js(e, r.base.href, t || "(unknown)", n)
                        : o.rewrite_js_bytes(
                            e,
                            r.base.href,
                            t || "(unknown)",
                            n
                          )),
                      i.time(r, l, `oxc rewrite for "${t || "(unknown)"}"`);
                    let { js: c, map: u, scramtag: d, errors: h } = a;
                    return {
                      js: "string" == typeof e ? s.su.decode(c) : c,
                      tag: d,
                      map: u,
                      errors: h,
                    };
                  } finally {
                    a();
                  }
                })(e, t, r, n);
              })(e, t, r, a),
              l = o.js;
            if ((0, n.U5)("sourcemaps", r.base)) {
              let e = globalThis[n.$W.globals.pushsourcemapfn];
              if (e) e(Array.from(o.map), o.tag);
              else {
                l instanceof Uint8Array && (l = new TextDecoder().decode(l));
                let e = `${n.$W.globals.pushsourcemapfn}([${o.map.join(
                    ","
                  )}], "${o.tag}");`,
                  t = /^\s*(['"])use strict\1;?/;
                l = t.test(l)
                  ? l.replace(
                      t,
                      `$&
${e}`
                    )
                  : `${e}
${l}`;
              }
            }
            if ((0, n.U5)("rewriterLogs", r.base))
              for (let e of o.errors) console.error("oxc parse error", e);
            return l;
          } catch (i) {
            if (
              (console.warn(
                "failed rewriting js for",
                t || "(unknown)",
                i.message,
                e instanceof Uint8Array ? s.su.decode(e) : e
              ),
              (0, n.U5)("allowInvalidJs", r.base))
            )
              return e;
            throw i;
          }
        }
        Error.stackTraceLimit = 50;
      },
      1472: function (e, t, r) {
        r.d(t, { $n: () => a, IP: () => o, Oy: () => l, v2: () => c });
        var n = r(37),
          s = r(1478);
        function i(e, t) {
          try {
            return new URL(e, t);
          } catch {
            return null;
          }
        }
        function o(e, t) {
          let r = new URL(e.substring(5));
          return "blob:" + t.origin.origin + r.pathname;
        }
        function a(e) {
          let t = new URL(e.substring(5));
          return "blob:" + location.origin + t.pathname;
        }
        function l(e, t) {
          if (
            (e instanceof URL && (e = e.toString()),
            e.startsWith("javascript:"))
          )
            return (
              "javascript:" + (0, s.o)(e.slice(11), "(javascript: url)", t)
            );
          {
            if (e.startsWith("blob:") || e.startsWith("data:"))
              return location.origin + n.$W.prefix + e;
            if (e.startsWith("mailto:") || e.startsWith("about:")) return e;
            let r = t.base.href;
            r.startsWith("about:") && (r = c(self.location.href));
            let s = i(e, r);
            if (!s) return e;
            let o = (0, n.hD)(s.hash.slice(1));
            return (
              (s.hash = ""),
              location.origin +
                n.$W.prefix +
                (0, n.hD)(s.href) +
                (o ? "#" + o : "")
            );
          }
        }
        function c(e) {
          e instanceof URL && (e = e.toString());
          let t = location.origin + n.$W.prefix;
          if (e.startsWith("javascript:")) return e;
          {
            if (e.startsWith("blob:")) return e;
            if (e.startsWith(t + "blob:") || e.startsWith(t + "data:"))
              return e.substring(t.length);
            if (e.startsWith("mailto:") || e.startsWith("about:")) return e;
            let r = i(e);
            if (!r) return e;
            let s = (0, n.P_)(r.hash.slice(1));
            return (
              (r.hash = ""),
              (0, n.P_)(r.href.slice(t.length) + (s ? "#" + s : ""))
            );
          }
        }
      },
      1561: function (e, t, r) {
        let n;
        r.d(t, { n$: () => d, nb: () => g, su: () => h });
        var s = r(3907),
          i = r(37),
          o = r(1472),
          a = r(2393),
          l = r(2614),
          c = r(1478),
          u = r(884);
        async function d() {
          n = new Uint8Array(
            await fetch(i.$W.files.wasm).then((e) => e.arrayBuffer())
          );
        }
        self.WASM &&
          (n = Uint8Array.from(atob(self.WASM), (e) => e.charCodeAt(0)));
        let h = new TextDecoder(),
          p = "\0asm".split("").map((e) => e.charCodeAt(0)),
          f = [];
        function g(e) {
          let t;
          if (!(n instanceof Uint8Array))
            throw Error("rewriter wasm not found (was it fetched correctly?)");
          if (![...n.slice(0, 4)].every((e, t) => e === p[t]))
            throw Error(
              "rewriter wasm does not have wasm magic (was it fetched correctly?)\nrewriter wasm contents: " +
                h.decode(n)
            );
          (0, s.QR)({ module: new WebAssembly.Module(n) });
          let r = f.findIndex((e) => !e.inUse),
            d = f.length;
          return (
            -1 === r
              ? ((0, i.U5)("rewriterLogs", e.base) &&
                  console.log(
                    `creating new rewriter, ${d} rewriters made already`
                  ),
                (t = {
                  rewriter: new s.LW({
                    config: i.$W,
                    shared: {
                      rewrite: {
                        htmlRules: a.V,
                        rewriteUrl: o.Oy,
                        rewriteCss: l.s,
                        rewriteJs: c.o,
                        getHtmlInjectCode(e, t) {
                          let r = (0, u.Uk)(
                            e,
                            (e) => `<script src="${e}"></script>`
                          ).join("");
                          return t ? `<head>${r}</head>` : r;
                        },
                      },
                    },
                    flagEnabled: i.U5,
                    codec: { encode: i.hD, decode: i.P_ },
                  }),
                  inUse: !1,
                }),
                f.push(t))
              : ((0, i.U5)("rewriterLogs", e.base) &&
                  console.log(
                    `using cached rewriter ${r} from list of ${d} rewriters`
                  ),
                (t = f[r])),
            (t.inUse = !0),
            [t.rewriter, () => (t.inUse = !1)]
          );
        }
      },
      2015: function (e, t, r) {
        r.d(t, { i: () => i });
        var n = r(37),
          s = r(1478);
        function i(e, t, r, i) {
          let o = "",
            a = "module" === t,
            l = (e) => {
              a
                ? (o += `import "${n.$W.files[e]}"
`)
                : (o += `importScripts("${n.$W.files[e]}");
`);
            };
          l("wasm"),
            l("all"),
            (o += `$scramjetLoadClient().loadAndHook(${JSON.stringify(
              n.$W
            )});`);
          let c = (0, s.o)(e, r, i, a);
          return (
            c instanceof Uint8Array && (c = new TextDecoder().decode(c)),
            (o += c)
          );
        }
      },
      6684: function (e, t, r) {
        r.d(t, {
          Sn: () => d,
          YH: () => c,
          Yq: () => p,
          hU: () => u,
          pL: () => h,
          rj: () => l,
        });
        let n = { none: 0, "same-origin": 1, "same-site": 2, "cross-site": 3 };
        async function s() {
          let e = indexedDB.open("$scramjet", 1);
          return new Promise((t, r) => {
            (e.onerror = () => r(e.error)), (e.onsuccess = () => t(e.result));
          });
        }
        async function i(e) {
          let t = (await s())
            .transaction("redirectTrackers", "readonly")
            .objectStore("redirectTrackers");
          return new Promise((r) => {
            let n = t.get(e);
            (n.onsuccess = () => r(n.result || null)),
              (n.onerror = () => r(null));
          });
        }
        async function o(e, t) {
          let r = (await s())
            .transaction("redirectTrackers", "readwrite")
            .objectStore("redirectTrackers");
          return new Promise((n, s) => {
            let i = r.put(t, e);
            (i.onsuccess = () => n()), (i.onerror = () => s(i.error));
          });
        }
        async function a(e) {
          let t = (await s())
            .transaction("redirectTrackers", "readwrite")
            .objectStore("redirectTrackers");
          return new Promise((r, n) => {
            let s = t.delete(e);
            (s.onsuccess = () => r()), (s.onerror = () => n(s.error));
          });
        }
        async function l(e, t, r) {
          (await i(e)) ||
            (await o(e, {
              originalReferrer: t || "",
              mostRestrictiveSite: r,
              referrerPolicy: "",
              chainStarted: Date.now(),
            }));
        }
        async function c(e, t, r) {
          let n = await i(e);
          n && (await a(e), r && (n.referrerPolicy = r), await o(t, n));
        }
        async function u(e, t) {
          let r = await i(e);
          if (!r) return t;
          let s = n[r.mostRestrictiveSite];
          return (n[t] ?? 0) > s
            ? ((r.mostRestrictiveSite = t), await o(e, r), t)
            : r.mostRestrictiveSite;
        }
        async function d(e) {
          await a(e);
        }
        async function h(e, t, r) {
          let n = (await s())
              .transaction("referrerPolicies", "readwrite")
              .objectStore("referrerPolicies"),
            i = { policy: t, referrer: r };
          return new Promise((t, r) => {
            let s = n.put(i, e);
            (s.onsuccess = () => t()), (s.onerror = () => r(s.error));
          });
        }
        async function p(e) {
          let t = (await s())
            .transaction("referrerPolicies", "readonly")
            .objectStore("referrerPolicies");
          return new Promise((r) => {
            let n = t.get(e);
            (n.onsuccess = () => r(n.result || null)),
              (n.onerror = () => r(null));
          });
        }
      },
      8228: function (e, t, r) {
        r.d(t, { ps: () => a });
        let n = "publicSuffixList";
        async function s() {
          let e = indexedDB.open("$scramjet", 1);
          return new Promise((t, r) => {
            (e.onerror = () => r(e.error)), (e.onsuccess = () => t(e.result));
          });
        }
        async function i() {
          let e = (await s()).transaction(n, "readonly").objectStore(n);
          return new Promise((t) => {
            let r = e.get(n);
            (r.onsuccess = () => t(r.result || null)),
              (r.onerror = () => t(null));
          });
        }
        async function o(e) {
          let t = (await s())
            .transaction("publicSuffixList", "readwrite")
            .objectStore("publicSuffixList");
          return new Promise((r, s) => {
            let i = t.put({ data: e, expiry: Date.now() + 36e5 }, n);
            (i.onsuccess = () => r()), (i.onerror = () => s(i.error));
          });
        }
        async function a(e, t, r) {
          return t
            ? e.origin.origin === t.origin
              ? "same-origin"
              : (await l(e.origin, t, r))
              ? "same-site"
              : "cross-site"
            : "none";
        }
        async function l(e, t, r) {
          return (await c(e, r)) === (await c(t, r));
        }
        async function c(e, t) {
          let r = await u(t),
            n = e.hostname.toLowerCase().split("."),
            s = "",
            i = !1;
          for (let e of r) {
            let t = e.startsWith("!") ? e.substring(1) : e;
            if (
              (function (e, t) {
                if (e.length < t.length) return !1;
                let r = e.length - t.length;
                for (let n = 0; n < t.length; n++) {
                  let s = e[r + n],
                    i = t[n];
                  if ("*" !== i && s !== i) return !1;
                }
                return !0;
              })(n, t.split("."))
            ) {
              if (e.startsWith("!")) {
                (s = t), (i = !0);
                break;
              }
              !i && t.length > s.length && (s = t);
            }
          }
          if (!s) return n.slice(-2).join(".");
          let o = s.split(".").length,
            a = i ? o : o + 1;
          return n.slice(-a).join(".");
        }
        async function u(e) {
          let t,
            r = await i();
          if (r && Date.now() < r.expiry) return r.data;
          try {
            t = await e.fetch(
              "https://publicsuffix.org/list/public_suffix_list.dat"
            );
          } catch (e) {
            throw Error(`Failed to fetch public suffix list: ${e}`);
          }
          let n = (await t.text())
            .split("\n")
            .map((e) => {
              let t = e.trim(),
                r = t.indexOf(" ");
              return r > -1 ? t.substring(0, r) : t;
            })
            .filter((e) => e && !e.startsWith("//"));
          return await o(n), n;
        }
      },
      2794: function (e, t, r) {
        r.d(t, { pX: () => n, zr: () => s });
        let n = Symbol.for("scramjet client global"),
          s = Symbol.for("scramjet frame handle");
      },
      5956: function (e, t, r) {
        function n(e, t) {
          let r = `
                errorTrace.value = ${JSON.stringify(e)};
                fetchedURL.textContent = ${JSON.stringify(t)};
                for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(
                  location.hostname
                )};
                reload.addEventListener("click", () => location.reload());
                version.textContent = ${JSON.stringify(
                  globalThis.$scramjetVersion?.version || "unknown"
                )};
                build.textContent = ${JSON.stringify(
                  globalThis.$scramjetVersion?.build || "unknown"
                )};

                document.getElementById('copy-button').addEventListener('click', async () => {
                    const text = document.getElementById('errorTrace').value;
                    await navigator.clipboard.writeText(text);
                    const btn = document.getElementById('copy-button');
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = 'Copy', 2000);
                });
        `;
          return `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Scramjet</title>
                    <style>
                    :root {
                        --deep: #080602;
                        --shallow: #181412;
                        --beach: #f1e8e1;
                        --shore: #b1a8a1;
                        --accent: #ffa938;
                        --font-sans: -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
                        --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    }

                    *:not(div,p,span,ul,li,i,span) {
                        background-color: var(--deep);
                        color: var(--beach);
                        font-family: var(--font-sans);
                    }

                    textarea,
                    button {
                        background-color: var(--shallow);
                        border-radius: 0.6em;
                        padding: 0.6em;
                        border: none;
                        appearance: none;
                        font-family: var(--font-sans);
                        color: var(--beach);
                    }

                    button.primary {
                        background-color: var(--accent);
                        color: var(--deep);
                        font-weight: bold;
                    }

                    textarea {
                        resize: none;
                        height: 20em;
                        text-align: left;
                        font-family: var(--font-monospace);
                    }

                    body {
                        width: 100vw;
                        height: 100vh;
                        justify-content: center;
                        align-items: center;
                    }

                    body,
                    html,
                    #inner {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        gap: 0.5em;
                        overflow: hidden;
                    }

                    #inner {
                        z-index: 100;
                    }

                    #cover {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: color-mix(in srgb, var(--deep) 70%, transparent);
                        z-index: 99;
                    }

                    #info {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 1em;
                    }

                    #version-wrapper {
                        width: auto;
                        text-align: right;
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        font-size: 0.8rem;
                        color: var(--shore)!important;
                        i {
                            background-color: color-mix(in srgb, var(--deep), transparent 50%);
                            border-radius: 9999px;
                            padding: 0.2em 0.5em;
                        }
                        z-index: 101;
                    }

                    #errorTrace-wrapper {
                        position: relative;
                        width: fit-content;
                    }

                    #copy-button {
                        position: absolute;
                        top: 0.5em;
                        right: 0.5em;
                        padding: 0.23em;
                        cursor: pointer;
                        opacity: 0;
                        transition: opacity 0.4s;
                        font-size: 0.9em;
                    }

                    #errorTrace-wrapper:hover #copy-button {
                        opacity: 1;
                    }
                    </style>
                </head>
                <body>
                    <div id="cover"></div>
                    <div id="inner">
                        <h1 id="errorTitle">Uh oh!</h1>
                        <p>There was an error loading <b id="fetchedURL"></b></p>
                        <!-- <p id="errorMessage">Internal Server Error</p> -->

                        <div id="info">
                            <div id="errorTrace-wrapper">
                                <textarea id="errorTrace" cols="40" rows="10" readonly></textarea>
                                <button id="copy-button" class="primary">Copy</button>
                            </div>
                            <div id="troubleshooting">
                                <p>Try:</p>
                                <ul>
                                    <li>Checking your internet connection</li>
                                    <li>Verifying you entered the correct address</li>
                                    <li>Clearing the site data</li>
                                    <li>Contacting <b id="hostname"></b>'s administrator</li>
                                    <li>Verify the server isn't censored</li>
                                </ul>
                                <p>If you're the administrator of <b id="hostname"></b>, try:</p>
                                    <ul>
                                    <li>Restarting your server</li>
                                    <li>Updating Scramjet</li>
                                    <li>Troubleshooting the error on the <a href="https://github.com/MercuryWorkshop/scramjet" target="_blank">GitHub repository</a></li>
                                </ul>
                            </div>
                        </div>
                        <br>
                        <button id="reload" class="primary">Reload</button>
                    </div>
                    <p id="version-wrapper"><i>Scramjet v<span id="version"></span> (build <span id="build"></span>)</i></p>
                    <script src="${
                      "data:application/javascript," + encodeURIComponent(r)
                    }"></script>
                </body>
            </html>
        `;
        }
        function s(e, t) {
          let r = { "content-type": "text/html" };
          return (
            crossOriginIsolated &&
              (r["Cross-Origin-Embedder-Policy"] = "require-corp"),
            new Response(n(String(e), t), { status: 500, headers: r })
          );
        }
        r.d(t, { B: () => n, v: () => s });
      },
      1403: function (e, t, r) {
        r.d(t, { H: () => n });
        class n {
          handle;
          origin;
          syncToken = 0;
          promises = {};
          messageChannel = new MessageChannel();
          connected = !1;
          constructor(e, t) {
            (this.handle = e),
              (this.origin = t),
              this.messageChannel.port1.addEventListener("message", (e) => {
                "scramjet$type" in e.data &&
                  ("init" === e.data.scramjet$type
                    ? (this.connected = !0)
                    : this.handleMessage(e.data));
              }),
              this.messageChannel.port1.start(),
              this.handle.postMessage(
                {
                  scramjet$type: "init",
                  scramjet$port: this.messageChannel.port2,
                },
                [this.messageChannel.port2]
              );
          }
          handleMessage(e) {
            let t = this.promises[e.scramjet$token];
            t && (t(e), delete this.promises[e.scramjet$token]);
          }
          async fetch(e) {
            let t = this.syncToken++,
              r = {
                scramjet$type: "fetch",
                scramjet$token: t,
                scramjet$request: {
                  url: e.url,
                  body: e.body,
                  headers: Array.from(e.headers.entries()),
                  method: e.method,
                  mode: e.mode,
                  destinitation: e.destination,
                },
              },
              n = e.body ? [e.body] : [];
            this.handle.postMessage(r, n);
            let { scramjet$response: s } = await new Promise((e) => {
              this.promises[t] = e;
            });
            return (
              !!s &&
              new Response(s.body, {
                headers: s.headers,
                status: s.status,
                statusText: s.statusText,
              })
            );
          }
        }
      },
      5790: function (e, t, r) {
        r.d(t, { Pf: () => m, V3: () => S, dT: () => w });
        var n = r(5956),
          s = r(8228),
          i = r(6684),
          o = r(1472),
          a = r(1478),
          l = r(1427),
          c = r(37),
          u = r(4435),
          d = r(884),
          h = r(2614),
          p = r(2015),
          f = r(8665).A;
        function g(e) {
          return e.status >= 300 && e.status < 400;
        }
        async function m(e, t) {
          try {
            let r,
              n,
              a = new URL(e.url);
            if (a.pathname === this.config.files.wasm)
              return fetch(this.config.files.wasm).then(async (e) => {
                let t = await e.arrayBuffer(),
                  r = btoa(
                    new Uint8Array(t)
                      .reduce((e, t) => (e.push(String.fromCharCode(t)), e), [])
                      .join("")
                  ),
                  n = "";
                return (
                  (n += `if ('document' in self && document.currentScript) { document.currentScript.remove(); }
self.WASM = '${r}';`),
                  new Response(n, {
                    headers: { "content-type": "text/javascript" },
                  })
                );
              });
            let u = "",
              d = {};
            for (let [e, t] of [...a.searchParams.entries()]) {
              switch (e) {
                case "type":
                  u = t;
                  break;
                case "dest":
                  break;
                case "topFrame":
                  r = t;
                  break;
                case "parentFrame":
                  n = t;
                  break;
                default:
                  f.warn(
                    `${a.href} extraneous query parameter ${e}. Assuming <form> element`
                  ),
                    (d[e] = t);
              }
              a.searchParams.delete(e);
            }
            let h = new URL((0, o.v2)(a));
            for (let [e, t] of Object.entries(d)) h.searchParams.set(e, t);
            let p = { origin: h, base: h, topFrameName: r, parentFrameName: n };
            if (
              a.pathname.startsWith(`${this.config.prefix}blob:`) ||
              a.pathname.startsWith(`${this.config.prefix}data:`)
            ) {
              let t,
                r = a.pathname.substring(this.config.prefix.length);
              r.startsWith("blob:") && (r = (0, o.$n)(r));
              let n = await fetch(r, {});
              (n.finalURL = r.startsWith("blob:") ? r : "(data url)"),
                n.body &&
                  (t = await b(n, p, e.destination, u, this.cookieStore));
              let s = Object.fromEntries(n.headers.entries());
              return (
                crossOriginIsolated &&
                  ((s["Cross-Origin-Opener-Policy"] = "same-origin"),
                  (s["Cross-Origin-Embedder-Policy"] = "require-corp")),
                new Response(t, {
                  status: n.status,
                  statusText: n.statusText,
                  headers: s,
                })
              );
            }
            let g = this.serviceWorkers.find((e) => e.origin === h.origin);
            if (g?.connected && "swruntime" !== a.searchParams.get("from")) {
              let t = await g.fetch(e);
              if (t) return t;
            }
            if (h.origin === new URL(e.url).origin)
              throw Error(
                "attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting"
              );
            let m = new l.u();
            for (let [t, r] of e.headers.entries()) m.set(t, r);
            if (t && new URL(t.url).pathname.startsWith(c.$W.prefix)) {
              let e = new URL((0, o.v2)(t.url));
              e.toString().includes("youtube.com") ||
                (m.set("Referer", e.href), m.set("Origin", e.origin));
            }
            let w = this.cookieStore.getCookies(h, !1);
            w.length && m.set("Cookie", w);
            let x = !1;
            if (
              "iframe" === e.destination &&
              "navigate" === e.mode &&
              e.referrer &&
              "no-referrer" !== e.referrer &&
              e.referrer !== location.origin + c.$W.prefix + "no-referrer"
            ) {
              let t = e.referrer,
                r = await self.clients.matchAll({ type: "window" });
              for (; t; ) {
                if (!t.includes(c.$W.prefix)) {
                  x = !0;
                  break;
                }
                let e = r.find((e) => e.url === t),
                  n = await (0, i.Yq)(t);
                if (!n || !n.referrer) {
                  e && t.startsWith(location.origin) && (x = !0);
                  break;
                }
                if (e && "nested" === e.frameType) t = n.referrer;
                else break;
              }
            }
            x
              ? (m.set("Sec-Fetch-Dest", "document"),
                m.set("Sec-Fetch-Mode", "navigate"))
              : (m.set("Sec-Fetch-Dest", e.destination || "empty"),
                m.set("Sec-Fetch-Mode", e.mode));
            let v = "none";
            if (
              e.referrer &&
              "" !== e.referrer &&
              "no-referrer" !== e.referrer &&
              e.referrer !== location.origin + c.$W.prefix + "no-referrer" &&
              e.referrer.includes(c.$W.prefix)
            ) {
              let t = (0, o.v2)(e.referrer);
              if (t) {
                let e = new URL(t);
                v = await (0, s.ps)(p, e, this.client);
              }
            }
            await (0, i.rj)(
              h.toString(),
              e.referrer ? (0, o.v2)(e.referrer) : null,
              v
            ),
              m.set("Sec-Fetch-Site", await (0, i.hU)(h.toString(), v));
            let E = new S(h, m.headers, e.body, e.method, e.destination, t);
            this.dispatchEvent(E);
            let T =
              (await E.response) ||
              (await this.client.fetch(E.url, {
                method: E.method,
                body: E.body,
                headers: E.requestHeaders,
                credentials: "omit",
                mode: "cors" === e.mode ? e.mode : "same-origin",
                cache: e.cache,
                redirect: "manual",
                duplex: "half",
              }));
            return (
              (T.finalURL = E.url.href),
              await y(
                h,
                p,
                u,
                e.destination,
                e.mode,
                T,
                this.cookieStore,
                t,
                this.client,
                this,
                e.referrer
              )
            );
          } catch (s) {
            let t = {
              message: s.message,
              url: e.url,
              destination: e.destination,
            };
            if (
              (s.stack && (t.stack = s.stack),
              console.error("ERROR FROM SERVICE WORKER FETCH: ", t),
              console.error(s),
              !["document", "iframe"].includes(e.destination))
            )
              return new Response(void 0, { status: 500 });
            let r = Object.entries(t)
              .map(
                ([e, t]) => `${e.charAt(0).toUpperCase() + e.slice(1)}: ${t}`
              )
              .join("\n\n");
            return (0, n.v)(r, (0, o.v2)(e.url));
          }
        }
        async function y(e, t, r, n, a, l, d, h, p, f, m) {
          let y,
            S = "navigate" === a && ["document", "iframe"].includes(n),
            x = await (0, u.l)(l.rawHeaders, t, p, { get: i.Yq, set: i.pL });
          if (
            (S &&
              x["referrer-policy"] &&
              m &&
              (await (0, i.pL)(e.href, x["referrer-policy"], m)),
            g(l))
          ) {
            let t = new URL((0, o.v2)(x.location));
            await (0, i.YH)(e.toString(), t.toString(), x["referrer-policy"]);
            let n = await (0, s.ps)({ origin: t, base: t }, e, p);
            if ((await (0, i.hU)(t.toString(), n), r)) {
              let e = new URL(x.location);
              e.searchParams.set("type", r), (x.location = e.href);
            }
          }
          let v = x["set-cookie"] || [];
          for (let t in v)
            if (h) {
              let r = f.dispatch(h, {
                scramjet$type: "cookie",
                cookie: t,
                url: e.href,
              });
              "document" !== n && "iframe" !== n && (await r);
            }
          for (let t in (await d.setCookies(v instanceof Array ? v : [v], e),
          x))
            Array.isArray(x[t]) && (x[t] = x[t][0]);
          if (
            (function (e, t) {
              if (["document", "iframe"].includes(t)) {
                let t = e["content-disposition"];
                if (t) {
                  if ("inline" !== t) return !0;
                } else {
                  let t = e["content-type"]?.split(";")[0].trim().toLowerCase();
                  if (
                    t &&
                    ![
                      "text/html",
                      "text/plain",
                      "text/css",
                      "text/javascript",
                      "text/xml",
                      "application/javascript",
                      "application/json",
                      "application/xml",
                      "application/pdf",
                    ].includes(t) &&
                    !t.startsWith("text") &&
                    !t.startsWith("image") &&
                    !t.startsWith("font") &&
                    !t.startsWith("video")
                  )
                    return !0;
                }
              }
              return !1;
            })(x, n) &&
            !g(l)
          )
            if ((0, c.U5)("interceptDownloads", e)) {
              if (!h) throw Error("cant find client");
              let t = null,
                r = x["content-disposition"];
              if ("string" == typeof r) {
                let e = r.match(/filename=["']?([^"';\n]*)["']?/i);
                e && e[1] && (t = e[1]);
              }
              let n = x["content-length"],
                s = await clients.matchAll({});
              if (
                (s = s.filter((e) => !e.url.includes(c.$W.prefix))).length < 1
              )
                throw Error(
                  "couldn't find a controller client to dispatch download to"
                );
              let i = {
                filename: t,
                url: e.href,
                type: x["content-type"],
                body: l.body,
                length: Number(n),
              };
              s[0].postMessage({ scramjet$type: "download", download: i }, [
                l.body,
              ]),
                await new Promise(() => {});
            } else {
              let e = x["content-disposition"];
              if (!/\s*?((inline|attachment);\s*?)filename=/i.test(e)) {
                let t = /^\s*?attachment/i.test(e) ? "attachment" : "inline",
                  [r] = new URL(l.finalURL).pathname.split("/").slice(-1);
                x["content-disposition"] = `${t}; filename=${JSON.stringify(
                  r
                )}`;
              }
            }
          l.body && !g(l) && (y = await b(l, t, n, r, d)),
            "text/event-stream" === x.accept &&
              (x["content-type"] = "text/event-stream"),
            delete x["permissions-policy"],
            crossOriginIsolated &&
              [
                "document",
                "iframe",
                "worker",
                "sharedworker",
                "style",
                "script",
              ].includes(n) &&
              ((x["Cross-Origin-Embedder-Policy"] = "require-corp"),
              (x["Cross-Origin-Opener-Policy"] = "same-origin"));
          let E = new w(y, x, l.status, l.statusText, n, e, l, h);
          return (
            f.dispatchEvent(E),
            g(l) || (await (0, i.Sn)(e.toString())),
            new Response(E.responseBody, {
              headers: E.responseHeaders,
              status: E.status,
              statusText: E.statusText,
            })
          );
        }
        async function b(e, t, r, n, s) {
          switch (r) {
            case "iframe":
            case "document":
              if (e.headers.get("content-type")?.startsWith("text/html"))
                return (0, d.Qs)(await e.text(), s, t, !0);
              return e.body;
            case "script":
              return (0, a.o)(
                new Uint8Array(await e.arrayBuffer()),
                e.finalURL,
                t,
                "module" === n
              );
            case "style":
              return (0, h.s)(await e.text(), t);
            case "sharedworker":
            case "worker":
              return (0, p.i)(
                new Uint8Array(await e.arrayBuffer()),
                n,
                e.finalURL,
                t
              );
            default:
              return e.body;
          }
        }
        class w extends Event {
          responseBody;
          responseHeaders;
          status;
          statusText;
          destination;
          url;
          rawResponse;
          client;
          constructor(e, t, r, n, s, i, o, a) {
            super("handleResponse"),
              (this.responseBody = e),
              (this.responseHeaders = t),
              (this.status = r),
              (this.statusText = n),
              (this.destination = s),
              (this.url = i),
              (this.rawResponse = o),
              (this.client = a);
          }
        }
        class S extends Event {
          url;
          requestHeaders;
          body;
          method;
          destination;
          client;
          constructor(e, t, r, n, s, i) {
            super("request"),
              (this.url = e),
              (this.requestHeaders = t),
              (this.body = r),
              (this.method = n),
              (this.destination = s),
              (this.client = i);
          }
          response;
        }
      },
      7510: function (e, t, r) {
        r.r(t),
          r.d(t, {
            FakeServiceWorker: () => n.H,
            ScramjetHandleResponseEvent: () => s.dT,
            ScramjetRequestEvent: () => s.V3,
            ScramjetServiceWorker: () => u,
            errorTemplate: () => c.B,
            handleFetch: () => s.Pf,
            renderError: () => c.v,
          });
        var n = r(1403),
          s = r(5790),
          i = r(236),
          o = r(1561),
          a = r(3831),
          l = r(37),
          c = r(5956);
        class u extends EventTarget {
          client;
          config;
          syncPool = {};
          synctoken = 0;
          cookieStore = new a.k();
          serviceWorkers = [];
          constructor() {
            super(), (this.client = new i.Ay());
            const e = indexedDB.open("$scramjet", 1);
            (e.onsuccess = () => {
              let t = e.result
                .transaction("cookies", "readonly")
                .objectStore("cookies")
                .get("cookies");
              t.onsuccess = () => {
                t.result && this.cookieStore.load(t.result);
              };
            }),
              addEventListener("message", async ({ data: t }) => {
                if ("scramjet$type" in t) {
                  if ("scramjet$token" in t) {
                    let e = this.syncPool[t.scramjet$token];
                    delete this.syncPool[t.scramjet$token], e(t);
                    return;
                  }
                  if ("registerServiceWorker" === t.scramjet$type)
                    return void this.serviceWorkers.push(
                      new n.H(t.port, t.origin)
                    );
                  "cookie" === t.scramjet$type &&
                    (this.cookieStore.setCookies([t.cookie], new URL(t.url)),
                    e.result
                      .transaction("cookies", "readwrite")
                      .objectStore("cookies")
                      .put(JSON.parse(this.cookieStore.dump()), "cookies")),
                    "loadConfig" === t.scramjet$type &&
                      (this.config = t.config);
                }
              });
          }
          async dispatch(e, t) {
            let r,
              n = this.synctoken++,
              s = new Promise((e) => (r = e));
            return (
              (this.syncPool[n] = r),
              (t.scramjet$token = n),
              e.postMessage(t),
              await s
            );
          }
          async loadConfig() {
            if (this.config) return;
            let e = indexedDB.open("$scramjet", 1);
            return new Promise((t, r) => {
              (e.onsuccess = async () => {
                let n = e.result
                  .transaction("config", "readonly")
                  .objectStore("config")
                  .get("config");
                (n.onsuccess = async () => {
                  (this.config = n.result),
                    (0, l.Nk)(n.result),
                    await (0, o.n$)(),
                    t();
                }),
                  (n.onerror = () => r(n.error));
              }),
                (e.onerror = () => r(e.error));
            });
          }
          route({ request: e }) {
            return (
              !!e.url.startsWith(location.origin + this.config.prefix) ||
              !!e.url.startsWith(location.origin + this.config.files.wasm)
            );
          }
          async fetch({ request: e, clientId: t }) {
            this.config || (await this.loadConfig());
            let r = await self.clients.get(t);
            return s.Pf.call(this, e, r);
          }
        }
      },
      236: function (e, t, r) {
        r.d(t, { Ay: () => S, DD: () => w });
        let n = globalThis.fetch,
          s = globalThis.SharedWorker,
          i = globalThis.localStorage,
          o = globalThis.navigator.serviceWorker,
          a = MessagePort.prototype.postMessage,
          l = {
            prototype: { send: WebSocket.prototype.send },
            CLOSED: WebSocket.CLOSED,
            CLOSING: WebSocket.CLOSING,
            CONNECTING: WebSocket.CONNECTING,
            OPEN: WebSocket.OPEN,
          };
        async function c() {
          let e = Promise.race([
            Promise.any(
              (
                await self.clients.matchAll({
                  type: "window",
                  includeUncontrolled: !0,
                })
              ).map(async (e) => {
                let t,
                  r = await ((t = new MessageChannel()),
                  new Promise((r) => {
                    e.postMessage({ type: "getPort", port: t.port2 }, [
                      t.port2,
                    ]),
                      (t.port1.onmessage = (e) => {
                        r(e.data);
                      });
                  }));
                return await u(r), r;
              })
            ),
            new Promise((e, t) => setTimeout(t, 1e3, TypeError("timeout"))),
          ]);
          try {
            return await e;
          } catch (e) {
            if (e instanceof AggregateError)
              throw (
                (console.error(
                  "bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort."
                ),
                Error("All clients returned an invalid MessagePort."))
              );
            return (
              console.warn(
                "bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying"
              ),
              await c()
            );
          }
        }
        function u(e) {
          let t = new MessageChannel(),
            r = new Promise((e, r) => {
              (t.port1.onmessage = (t) => {
                "pong" === t.data.type && e();
              }),
                setTimeout(r, 1500);
            });
          return (
            a.call(e, { message: { type: "ping" }, port: t.port2 }, [t.port2]),
            r
          );
        }
        function d(e, t) {
          let r = new s(e, "bare-mux-worker");
          return (
            t &&
              o.addEventListener("message", (t) => {
                if ("getPort" === t.data.type && t.data.port) {
                  console.debug("bare-mux: recieved request for port from sw");
                  let r = new s(e, "bare-mux-worker");
                  a.call(t.data.port, r.port, [r.port]);
                }
              }),
            r.port
          );
        }
        let h = null;
        class p {
          constructor(e) {
            (this.channel = new BroadcastChannel("bare-mux")),
              e instanceof MessagePort || e instanceof Promise
                ? (this.port = e)
                : this.createChannel(e, !0);
          }
          createChannel(e, t) {
            if (self.clients)
              (this.port = c()),
                (this.channel.onmessage = (e) => {
                  "refreshPort" === e.data.type && (this.port = c());
                });
            else if (e && SharedWorker) {
              if (!e.startsWith("/") && !e.includes("://"))
                throw Error(
                  "Invalid URL. Must be absolute or start at the root."
                );
              (this.port = d(e, t)),
                console.debug(
                  "bare-mux: setting localStorage bare-mux-path to",
                  e
                ),
                (i["bare-mux-path"] = e);
            } else {
              if (!SharedWorker)
                throw Error("Unable to get a channel to the SharedWorker.");
              {
                let e = i["bare-mux-path"];
                if (
                  (console.debug(
                    "bare-mux: got localStorage bare-mux-path:",
                    e
                  ),
                  !e)
                )
                  throw Error(
                    "Unable to get bare-mux workerPath from localStorage."
                  );
                this.port = d(e, t);
              }
            }
          }
          async sendMessage(e, t) {
            this.port instanceof Promise && (this.port = await this.port);
            try {
              await u(this.port);
            } catch {
              return (
                console.warn(
                  "bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead."
                ),
                this.createChannel(),
                await this.sendMessage(e, t)
              );
            }
            let r = new MessageChannel(),
              n = [r.port2, ...(t || [])],
              s = new Promise((e, t) => {
                r.port1.onmessage = (r) => {
                  let n = r.data;
                  "error" === n.type ? t(n.error) : e(n);
                };
              });
            return a.call(this.port, { message: e, port: r.port2 }, n), await s;
          }
        }
        class f extends EventTarget {
          constructor(e, t = [], r, n) {
            super(),
              (this.protocols = t),
              (this.readyState = l.CONNECTING),
              (this.url = e.toString()),
              (this.protocols = t);
            const s = (e) => {
                (this.protocols = e), (this.readyState = l.OPEN);
                let t = new Event("open");
                this.dispatchEvent(t);
              },
              i = async (e) => {
                let t = new MessageEvent("message", { data: e });
                this.dispatchEvent(t);
              },
              o = (e, t) => {
                this.readyState = l.CLOSED;
                let r = new CloseEvent("close", { code: e, reason: t });
                this.dispatchEvent(r);
              },
              a = () => {
                this.readyState = l.CLOSED;
                let e = new Event("error");
                this.dispatchEvent(e);
              };
            (this.channel = new MessageChannel()),
              (this.channel.port1.onmessage = (e) => {
                "open" === e.data.type
                  ? s(e.data.args[0])
                  : "message" === e.data.type
                  ? i(e.data.args[0])
                  : "close" === e.data.type
                  ? o(e.data.args[0], e.data.args[1])
                  : "error" === e.data.type && a();
              }),
              r.sendMessage(
                {
                  type: "websocket",
                  websocket: {
                    url: e.toString(),
                    protocols: t,
                    requestHeaders: n,
                    channel: this.channel.port2,
                  },
                },
                [this.channel.port2]
              );
          }
          send(...e) {
            if (this.readyState === l.CONNECTING)
              throw new DOMException(
                "Failed to execute 'send' on 'WebSocket': Still in CONNECTING state."
              );
            let t = e[0];
            t.buffer &&
              (t = t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength)),
              a.call(
                this.channel.port1,
                { type: "data", data: t },
                t instanceof ArrayBuffer ? [t] : []
              );
          }
          close(e, t) {
            a.call(this.channel.port1, {
              type: "close",
              closeCode: e,
              closeReason: t,
            });
          }
        }
        function g(e, t, r) {
          console.error(`error while processing '${r}': `, t),
            e.postMessage({ type: "error", error: t });
        }
        let m = ["ws:", "wss:"],
          y = [101, 204, 205, 304],
          b = [301, 302, 303, 307, 308];
        class w {
          constructor(e) {
            this.worker = new p(e);
          }
          async getTransport() {
            return (await this.worker.sendMessage({ type: "get" })).name;
          }
          async setTransport(e, t, r) {
            await this.setManualTransport(
              `
			const { default: BareTransport } = await import("${e}");
			return [BareTransport, "${e}"];
		`,
              t,
              r
            );
          }
          async setManualTransport(e, t, r) {
            if ("bare-mux-remote" === e) throw Error("Use setRemoteTransport.");
            await this.worker.sendMessage(
              { type: "set", client: { function: e, args: t } },
              r
            );
          }
          async setRemoteTransport(e, t) {
            let r = new MessageChannel();
            (r.port1.onmessage = async (t) => {
              let r = t.data.port,
                n = t.data.message;
              if ("fetch" === n.type)
                try {
                  e.ready || (await e.init()),
                    await (async function (e, t, r) {
                      let n = await r.request(
                        new URL(e.fetch.remote),
                        e.fetch.method,
                        e.fetch.body,
                        e.fetch.headers,
                        null
                      );
                      if (
                        !(function () {
                          if (null === h) {
                            let e,
                              t = new MessageChannel(),
                              r = new ReadableStream();
                            try {
                              a.call(t.port1, r, [r]), (e = !0);
                            } catch (t) {
                              e = !1;
                            }
                            return (h = e), e;
                          }
                          return h;
                        })() &&
                        n.body instanceof ReadableStream
                      ) {
                        let e = new Response(n.body);
                        n.body = await e.arrayBuffer();
                      }
                      n.body instanceof ReadableStream ||
                      n.body instanceof ArrayBuffer
                        ? a.call(t, { type: "fetch", fetch: n }, [n.body])
                        : a.call(t, { type: "fetch", fetch: n });
                    })(n, r, e);
                } catch (e) {
                  g(r, e, "fetch");
                }
              else if ("websocket" === n.type)
                try {
                  e.ready || (await e.init()),
                    await (async function (e, t, r) {
                      let [n, s] = r.connect(
                        new URL(e.websocket.url),
                        e.websocket.protocols,
                        e.websocket.requestHeaders,
                        (t) => {
                          a.call(e.websocket.channel, {
                            type: "open",
                            args: [t],
                          });
                        },
                        (t) => {
                          t instanceof ArrayBuffer
                            ? a.call(
                                e.websocket.channel,
                                { type: "message", args: [t] },
                                [t]
                              )
                            : a.call(e.websocket.channel, {
                                type: "message",
                                args: [t],
                              });
                        },
                        (t, r) => {
                          a.call(e.websocket.channel, {
                            type: "close",
                            args: [t, r],
                          });
                        },
                        (t) => {
                          a.call(e.websocket.channel, {
                            type: "error",
                            args: [t],
                          });
                        }
                      );
                      (e.websocket.channel.onmessage = (e) => {
                        "data" === e.data.type
                          ? n(e.data.data)
                          : "close" === e.data.type &&
                            s(e.data.closeCode, e.data.closeReason);
                      }),
                        a.call(t, { type: "websocket" });
                    })(n, r, e);
                } catch (e) {
                  g(r, e, "websocket");
                }
            }),
              await this.worker.sendMessage(
                {
                  type: "set",
                  client: { function: "bare-mux-remote", args: [r.port2, t] },
                },
                [r.port2]
              );
          }
          getInnerPort() {
            return this.worker.port;
          }
        }
        class S {
          constructor(e) {
            this.worker = new p(e);
          }
          createWebSocket(e, t = [], r, n) {
            try {
              e = new URL(e);
            } catch (t) {
              throw new DOMException(
                `Faiiled to construct 'WebSocket': The URL '${e}' is invalid.`
              );
            }
            if (!m.includes(e.protocol))
              throw new DOMException(
                `Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${e.protocol}' is not allowed.`
              );
            for (let e of (Array.isArray(t) || (t = [t]), (t = t.map(String))))
              if (
                !(function (e) {
                  for (let t = 0; t < e.length; t++) {
                    let r = e[t];
                    if (
                      !"!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~".includes(
                        r
                      )
                    )
                      return !1;
                  }
                  return !0;
                })(e)
              )
                throw new DOMException(
                  `Failed to construct 'WebSocket': The subprotocol '${e}' is invalid.`
                );
            return (n = n || {}), new f(e, t, this.worker, n);
          }
          async fetch(e, t) {
            let r = new Request(e, t),
              s = t?.headers || r.headers,
              i = s instanceof Headers ? Object.fromEntries(s) : s,
              o = r.body,
              a = new URL(r.url);
            if (a.protocol.startsWith("blob:")) {
              let e = await n(a),
                t = new Response(e.body, e);
              return (t.rawHeaders = Object.fromEntries(e.headers)), t;
            }
            for (let e = 0; ; e++) {
              let n = (
                  await this.worker.sendMessage(
                    {
                      type: "fetch",
                      fetch: {
                        remote: a.toString(),
                        method: r.method,
                        headers: i,
                        body: o || void 0,
                      },
                    },
                    o ? [o] : []
                  )
                ).fetch,
                s = new Response(y.includes(n.status) ? void 0 : n.body, {
                  headers: new Headers(n.headers),
                  status: n.status,
                  statusText: n.statusText,
                });
              (s.rawHeaders = n.headers),
                (s.rawResponse = n),
                (s.finalURL = a.toString());
              let l = t?.redirect || r.redirect;
              if (!b.includes(s.status)) return s;
              switch (l) {
                case "follow": {
                  let t = s.headers.get("location");
                  if (20 > e && null !== t) {
                    a = new URL(t, a);
                    continue;
                  }
                  throw TypeError("Failed to fetch");
                }
                case "error":
                  throw TypeError("Failed to fetch");
                case "manual":
                  return s;
              }
            }
          }
        }
        console.debug("bare-mux: running v2.1.7 (build c56d286)");
      },
      8832: function (e, t, r) {
        r.d(t, { H: () => n, L: () => s });
        let n = new Map(
            [
              "altGlyph",
              "altGlyphDef",
              "altGlyphItem",
              "animateColor",
              "animateMotion",
              "animateTransform",
              "clipPath",
              "feBlend",
              "feColorMatrix",
              "feComponentTransfer",
              "feComposite",
              "feConvolveMatrix",
              "feDiffuseLighting",
              "feDisplacementMap",
              "feDistantLight",
              "feDropShadow",
              "feFlood",
              "feFuncA",
              "feFuncB",
              "feFuncG",
              "feFuncR",
              "feGaussianBlur",
              "feImage",
              "feMerge",
              "feMergeNode",
              "feMorphology",
              "feOffset",
              "fePointLight",
              "feSpecularLighting",
              "feSpotLight",
              "feTile",
              "feTurbulence",
              "foreignObject",
              "glyphRef",
              "linearGradient",
              "radialGradient",
              "textPath",
            ].map((e) => [e.toLowerCase(), e])
          ),
          s = new Map(
            [
              "definitionURL",
              "attributeName",
              "attributeType",
              "baseFrequency",
              "baseProfile",
              "calcMode",
              "clipPathUnits",
              "diffuseConstant",
              "edgeMode",
              "filterUnits",
              "glyphRef",
              "gradientTransform",
              "gradientUnits",
              "kernelMatrix",
              "kernelUnitLength",
              "keyPoints",
              "keySplines",
              "keyTimes",
              "lengthAdjust",
              "limitingConeAngle",
              "markerHeight",
              "markerUnits",
              "markerWidth",
              "maskContentUnits",
              "maskUnits",
              "numOctaves",
              "pathLength",
              "patternContentUnits",
              "patternTransform",
              "patternUnits",
              "pointsAtX",
              "pointsAtY",
              "pointsAtZ",
              "preserveAlpha",
              "preserveAspectRatio",
              "primitiveUnits",
              "refX",
              "refY",
              "repeatCount",
              "repeatDur",
              "requiredExtensions",
              "requiredFeatures",
              "specularConstant",
              "specularExponent",
              "spreadMethod",
              "startOffset",
              "stdDeviation",
              "stitchTiles",
              "surfaceScale",
              "systemLanguage",
              "tableValues",
              "targetX",
              "targetY",
              "textLength",
              "viewBox",
              "viewTarget",
              "xChannelSelector",
              "yChannelSelector",
              "zoomAndPan",
            ].map((e) => [e.toLowerCase(), e])
          );
      },
      6498: function (e, t, r) {
        r.d(t, { A: () => c });
        var n = r(2743),
          s = r(8466),
          i = r(8832);
        let o = new Set([
          "style",
          "script",
          "xmp",
          "iframe",
          "noembed",
          "noframes",
          "plaintext",
          "noscript",
        ]);
        function a(e) {
          return e.replace(/"/g, "&quot;");
        }
        let l = new Set([
            "area",
            "base",
            "basefont",
            "br",
            "col",
            "command",
            "embed",
            "frame",
            "hr",
            "img",
            "input",
            "isindex",
            "keygen",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
          ]),
          c = function e(t, r = {}) {
            let c = "length" in t ? t : [t],
              h = "";
            for (let t = 0; t < c.length; t++)
              h += (function (t, r) {
                var c, h, p;
                switch (t.type) {
                  case n.bL:
                    return e(t.children, r);
                  case n.fl:
                  case n.WL:
                    return (c = t), `<${c.data}>`;
                  case n.Mw:
                    return (h = t), `<!--${h.data}-->`;
                  case n.KB:
                    return (p = t), `<![CDATA[${p.children[0].data}]]>`;
                  case n.eF:
                  case n.OF:
                  case n.vw:
                    return (function (t, r) {
                      var n;
                      "foreign" === r.xmlMode &&
                        ((t.name = null != (n = i.H.get(t.name)) ? n : t.name),
                        t.parent &&
                          u.has(t.parent.name) &&
                          (r = { ...r, xmlMode: !1 })),
                        !r.xmlMode &&
                          d.has(t.name) &&
                          (r = { ...r, xmlMode: "foreign" });
                      let o = `<${t.name}`,
                        c = (function (e, t) {
                          var r;
                          if (!e) return;
                          let n =
                            (null != (r = t.encodeEntities)
                              ? r
                              : t.decodeEntities) === !1
                              ? a
                              : t.xmlMode || "utf8" !== t.encodeEntities
                              ? s.WY
                              : s.Gj;
                          return Object.keys(e)
                            .map((r) => {
                              var s, o;
                              let a = null != (s = e[r]) ? s : "";
                              return ("foreign" === t.xmlMode &&
                                (r = null != (o = i.L.get(r)) ? o : r),
                              t.emptyAttrs || t.xmlMode || "" !== a)
                                ? `${r}="${n(a)}"`
                                : r;
                            })
                            .join(" ");
                        })(t.attribs, r);
                      return (
                        c && (o += ` ${c}`),
                        0 === t.children.length &&
                        (r.xmlMode
                          ? !1 !== r.selfClosingTags
                          : r.selfClosingTags && l.has(t.name))
                          ? (r.xmlMode || (o += " "), (o += "/>"))
                          : ((o += ">"),
                            t.children.length > 0 && (o += e(t.children, r)),
                            (r.xmlMode || !l.has(t.name)) &&
                              (o += `</${t.name}>`)),
                        o
                      );
                    })(t, r);
                  case n.EY:
                    return (function (e, t) {
                      var r;
                      let n = e.data || "";
                      return (
                        (null != (r = t.encodeEntities)
                          ? r
                          : t.decodeEntities) === !1 ||
                          (!t.xmlMode && e.parent && o.has(e.parent.name)) ||
                          (n =
                            t.xmlMode || "utf8" !== t.encodeEntities
                              ? (0, s.WY)(n)
                              : (0, s.X1)(n)),
                        n
                      );
                    })(t, r);
                }
              })(c[t], r);
            return h;
          },
          u = new Set([
            "mi",
            "mo",
            "mn",
            "ms",
            "mtext",
            "annotation-xml",
            "foreignObject",
            "desc",
            "title",
          ]),
          d = new Set(["svg", "math"]);
      },
      2743: function (e, t, r) {
        var n, s;
        function i(e) {
          return e.type === n.Tag || e.type === n.Script || e.type === n.Style;
        }
        r.d(t, {
          EY: () => a,
          KB: () => p,
          Mw: () => c,
          OF: () => d,
          RJ: () => n,
          WL: () => l,
          bL: () => o,
          dz: () => i,
          eF: () => u,
          fl: () => f,
          vw: () => h,
        }),
          ((s = n || (n = {})).Root = "root"),
          (s.Text = "text"),
          (s.Directive = "directive"),
          (s.Comment = "comment"),
          (s.Script = "script"),
          (s.Style = "style"),
          (s.Tag = "tag"),
          (s.CDATA = "cdata"),
          (s.Doctype = "doctype");
        let o = n.Root,
          a = n.Text,
          l = n.Directive,
          c = n.Comment,
          u = n.Script,
          d = n.Style,
          h = n.Tag,
          p = n.CDATA,
          f = n.Doctype;
      },
      8866: function (e, t, r) {
        r.d(t, { DV: () => o, Hg: () => s.Hg, Mw: () => s.Mw });
        var n = r(2743),
          s = r(6072);
        let i = { withStartIndices: !1, withEndIndices: !1, xmlMode: !1 };
        class o {
          constructor(e, t, r) {
            (this.dom = []),
              (this.root = new s.yo(this.dom)),
              (this.done = !1),
              (this.tagStack = [this.root]),
              (this.lastNode = null),
              (this.parser = null),
              "function" == typeof t && ((r = t), (t = i)),
              "object" == typeof e && ((t = e), (e = void 0)),
              (this.callback = null != e ? e : null),
              (this.options = null != t ? t : i),
              (this.elementCB = null != r ? r : null);
          }
          onparserinit(e) {
            this.parser = e;
          }
          onreset() {
            (this.dom = []),
              (this.root = new s.yo(this.dom)),
              (this.done = !1),
              (this.tagStack = [this.root]),
              (this.lastNode = null),
              (this.parser = null);
          }
          onend() {
            this.done ||
              ((this.done = !0),
              (this.parser = null),
              this.handleCallback(null));
          }
          onerror(e) {
            this.handleCallback(e);
          }
          onclosetag() {
            this.lastNode = null;
            let e = this.tagStack.pop();
            this.options.withEndIndices && (e.endIndex = this.parser.endIndex),
              this.elementCB && this.elementCB(e);
          }
          onopentag(e, t) {
            let r = this.options.xmlMode ? n.RJ.Tag : void 0,
              i = new s.Hg(e, t, void 0, r);
            this.addNode(i), this.tagStack.push(i);
          }
          ontext(e) {
            let { lastNode: t } = this;
            if (t && t.type === n.RJ.Text)
              (t.data += e),
                this.options.withEndIndices &&
                  (t.endIndex = this.parser.endIndex);
            else {
              let t = new s.EY(e);
              this.addNode(t), (this.lastNode = t);
            }
          }
          oncomment(e) {
            if (this.lastNode && this.lastNode.type === n.RJ.Comment) {
              this.lastNode.data += e;
              return;
            }
            let t = new s.Mw(e);
            this.addNode(t), (this.lastNode = t);
          }
          oncommentend() {
            this.lastNode = null;
          }
          oncdatastart() {
            let e = new s.EY(""),
              t = new s.KB([e]);
            this.addNode(t), (e.parent = t), (this.lastNode = e);
          }
          oncdataend() {
            this.lastNode = null;
          }
          onprocessinginstruction(e, t) {
            let r = new s.Cd(e, t);
            this.addNode(r);
          }
          handleCallback(e) {
            if ("function" == typeof this.callback) this.callback(e, this.dom);
            else if (e) throw e;
          }
          addNode(e) {
            let t = this.tagStack[this.tagStack.length - 1],
              r = t.children[t.children.length - 1];
            this.options.withStartIndices &&
              (e.startIndex = this.parser.startIndex),
              this.options.withEndIndices &&
                (e.endIndex = this.parser.endIndex),
              t.children.push(e),
              r && ((e.prev = r), (r.next = e)),
              (e.parent = t),
              (this.lastNode = null);
          }
        }
      },
      6072: function (e, t, r) {
        r.d(t, {
          Cd: () => l,
          EY: () => o,
          Hg: () => h,
          KB: () => u,
          Mw: () => a,
          yo: () => d,
        });
        var n = r(2743);
        class s {
          constructor() {
            (this.parent = null),
              (this.prev = null),
              (this.next = null),
              (this.startIndex = null),
              (this.endIndex = null);
          }
          get parentNode() {
            return this.parent;
          }
          set parentNode(e) {
            this.parent = e;
          }
          get previousSibling() {
            return this.prev;
          }
          set previousSibling(e) {
            this.prev = e;
          }
          get nextSibling() {
            return this.next;
          }
          set nextSibling(e) {
            this.next = e;
          }
          cloneNode(e = !1) {
            return p(this, e);
          }
        }
        class i extends s {
          constructor(e) {
            super(), (this.data = e);
          }
          get nodeValue() {
            return this.data;
          }
          set nodeValue(e) {
            this.data = e;
          }
        }
        class o extends i {
          constructor() {
            super(...arguments), (this.type = n.RJ.Text);
          }
          get nodeType() {
            return 3;
          }
        }
        class a extends i {
          constructor() {
            super(...arguments), (this.type = n.RJ.Comment);
          }
          get nodeType() {
            return 8;
          }
        }
        class l extends i {
          constructor(e, t) {
            super(t), (this.name = e), (this.type = n.RJ.Directive);
          }
          get nodeType() {
            return 1;
          }
        }
        class c extends s {
          constructor(e) {
            super(), (this.children = e);
          }
          get firstChild() {
            var e;
            return null != (e = this.children[0]) ? e : null;
          }
          get lastChild() {
            return this.children.length > 0
              ? this.children[this.children.length - 1]
              : null;
          }
          get childNodes() {
            return this.children;
          }
          set childNodes(e) {
            this.children = e;
          }
        }
        class u extends c {
          constructor() {
            super(...arguments), (this.type = n.RJ.CDATA);
          }
          get nodeType() {
            return 4;
          }
        }
        class d extends c {
          constructor() {
            super(...arguments), (this.type = n.RJ.Root);
          }
          get nodeType() {
            return 9;
          }
        }
        class h extends c {
          constructor(
            e,
            t,
            r = [],
            s = "script" === e
              ? n.RJ.Script
              : "style" === e
              ? n.RJ.Style
              : n.RJ.Tag
          ) {
            super(r), (this.name = e), (this.attribs = t), (this.type = s);
          }
          get nodeType() {
            return 1;
          }
          get tagName() {
            return this.name;
          }
          set tagName(e) {
            this.name = e;
          }
          get attributes() {
            return Object.keys(this.attribs).map((e) => {
              var t, r;
              return {
                name: e,
                value: this.attribs[e],
                namespace:
                  null == (t = this["x-attribsNamespace"]) ? void 0 : t[e],
                prefix: null == (r = this["x-attribsPrefix"]) ? void 0 : r[e],
              };
            });
          }
        }
        function p(e, t = !1) {
          let r;
          if (e.type === n.RJ.Text) r = new o(e.data);
          else if (e.type === n.RJ.Comment) r = new a(e.data);
          else if ((0, n.dz)(e)) {
            let n = t ? f(e.children) : [],
              s = new h(e.name, { ...e.attribs }, n);
            n.forEach((e) => (e.parent = s)),
              null != e.namespace && (s.namespace = e.namespace),
              e["x-attribsNamespace"] &&
                (s["x-attribsNamespace"] = { ...e["x-attribsNamespace"] }),
              e["x-attribsPrefix"] &&
                (s["x-attribsPrefix"] = { ...e["x-attribsPrefix"] }),
              (r = s);
          } else if (e.type === n.RJ.CDATA) {
            let n = t ? f(e.children) : [],
              s = new u(n);
            n.forEach((e) => (e.parent = s)), (r = s);
          } else if (e.type === n.RJ.Root) {
            let n = t ? f(e.children) : [],
              s = new d(n);
            n.forEach((e) => (e.parent = s)),
              e["x-mode"] && (s["x-mode"] = e["x-mode"]),
              (r = s);
          } else if (e.type === n.RJ.Directive) {
            let t = new l(e.name, e.data);
            null != e["x-name"] &&
              ((t["x-name"] = e["x-name"]),
              (t["x-publicId"] = e["x-publicId"]),
              (t["x-systemId"] = e["x-systemId"])),
              (r = t);
          } else throw Error(`Not implemented yet: ${e.type}`);
          return (
            (r.startIndex = e.startIndex),
            (r.endIndex = e.endIndex),
            null != e.sourceCodeLocation &&
              (r.sourceCodeLocation = e.sourceCodeLocation),
            r
          );
        }
        function f(e) {
          let t = e.map((e) => p(e, !0));
          for (let e = 1; e < t.length; e++)
            (t[e].prev = t[e - 1]), (t[e - 1].next = t[e]);
          return t;
        }
      },
      3256: function (e, t, r) {
        r(5016), r(1050);
      },
      6812: function (e, t, r) {
        var n, s;
        r(8866),
          ((s = n || (n = {}))[(s.DISCONNECTED = 1)] = "DISCONNECTED"),
          (s[(s.PRECEDING = 2)] = "PRECEDING"),
          (s[(s.FOLLOWING = 4)] = "FOLLOWING"),
          (s[(s.CONTAINS = 8)] = "CONTAINS"),
          (s[(s.CONTAINED_BY = 16)] = "CONTAINED_BY");
      },
      4993: function (e, t, r) {
        r(5016), r(4647), r(9861), r(1050), r(6812), r(3256), r(8866);
      },
      1050: function (e, t, r) {
        r(8866), r(9861);
      },
      9861: function (e, t, r) {
        r(8866);
      },
      5016: function (e, t, r) {
        r(8866), r(6498), r(2743);
      },
      4647: function (e, t, r) {
        r(8866);
      },
      2146: function (e, t, r) {
        var n;
        r.d(t, { MK: () => i, y6: () => o });
        let s = new Map([
            [0, 65533],
            [128, 8364],
            [130, 8218],
            [131, 402],
            [132, 8222],
            [133, 8230],
            [134, 8224],
            [135, 8225],
            [136, 710],
            [137, 8240],
            [138, 352],
            [139, 8249],
            [140, 338],
            [142, 381],
            [145, 8216],
            [146, 8217],
            [147, 8220],
            [148, 8221],
            [149, 8226],
            [150, 8211],
            [151, 8212],
            [152, 732],
            [153, 8482],
            [154, 353],
            [155, 8250],
            [156, 339],
            [158, 382],
            [159, 376],
          ]),
          i =
            null != (n = String.fromCodePoint)
              ? n
              : function (e) {
                  let t = "";
                  return (
                    e > 65535 &&
                      ((e -= 65536),
                      (t += String.fromCharCode(((e >>> 10) & 1023) | 55296)),
                      (e = 56320 | (1023 & e))),
                    (t += String.fromCharCode(e))
                  );
                };
        function o(e) {
          var t;
          return (e >= 55296 && e <= 57343) || e > 1114111
            ? 65533
            : null != (t = s.get(e))
            ? t
            : e;
        }
      },
      2990: function (e, t, r) {
        r.d(t, {
          FJ: () => u,
          MK: () => p.MK,
          Wf: () => g,
          qN: () => d.q,
          sr: () => h.s,
        });
        var n,
          s,
          i,
          o,
          a,
          l,
          c,
          u,
          d = r(7259),
          h = r(5949),
          p = r(2146);
        function f(e) {
          return e >= a.ZERO && e <= a.NINE;
        }
        ((n = a || (a = {}))[(n.NUM = 35)] = "NUM"),
          (n[(n.SEMI = 59)] = "SEMI"),
          (n[(n.EQUALS = 61)] = "EQUALS"),
          (n[(n.ZERO = 48)] = "ZERO"),
          (n[(n.NINE = 57)] = "NINE"),
          (n[(n.LOWER_A = 97)] = "LOWER_A"),
          (n[(n.LOWER_F = 102)] = "LOWER_F"),
          (n[(n.LOWER_X = 120)] = "LOWER_X"),
          (n[(n.LOWER_Z = 122)] = "LOWER_Z"),
          (n[(n.UPPER_A = 65)] = "UPPER_A"),
          (n[(n.UPPER_F = 70)] = "UPPER_F"),
          (n[(n.UPPER_Z = 90)] = "UPPER_Z"),
          ((s = l || (l = {}))[(s.VALUE_LENGTH = 49152)] = "VALUE_LENGTH"),
          (s[(s.BRANCH_LENGTH = 16256)] = "BRANCH_LENGTH"),
          (s[(s.JUMP_TABLE = 127)] = "JUMP_TABLE"),
          ((i = c || (c = {}))[(i.EntityStart = 0)] = "EntityStart"),
          (i[(i.NumericStart = 1)] = "NumericStart"),
          (i[(i.NumericDecimal = 2)] = "NumericDecimal"),
          (i[(i.NumericHex = 3)] = "NumericHex"),
          (i[(i.NamedEntity = 4)] = "NamedEntity"),
          ((o = u || (u = {}))[(o.Legacy = 0)] = "Legacy"),
          (o[(o.Strict = 1)] = "Strict"),
          (o[(o.Attribute = 2)] = "Attribute");
        class g {
          constructor(e, t, r) {
            (this.decodeTree = e),
              (this.emitCodePoint = t),
              (this.errors = r),
              (this.state = c.EntityStart),
              (this.consumed = 1),
              (this.result = 0),
              (this.treeIndex = 0),
              (this.excess = 1),
              (this.decodeMode = u.Strict);
          }
          startEntity(e) {
            (this.decodeMode = e),
              (this.state = c.EntityStart),
              (this.result = 0),
              (this.treeIndex = 0),
              (this.excess = 1),
              (this.consumed = 1);
          }
          write(e, t) {
            switch (this.state) {
              case c.EntityStart:
                if (e.charCodeAt(t) === a.NUM)
                  return (
                    (this.state = c.NumericStart),
                    (this.consumed += 1),
                    this.stateNumericStart(e, t + 1)
                  );
                return (
                  (this.state = c.NamedEntity), this.stateNamedEntity(e, t)
                );
              case c.NumericStart:
                return this.stateNumericStart(e, t);
              case c.NumericDecimal:
                return this.stateNumericDecimal(e, t);
              case c.NumericHex:
                return this.stateNumericHex(e, t);
              case c.NamedEntity:
                return this.stateNamedEntity(e, t);
            }
          }
          stateNumericStart(e, t) {
            return t >= e.length
              ? -1
              : (32 | e.charCodeAt(t)) === a.LOWER_X
              ? ((this.state = c.NumericHex),
                (this.consumed += 1),
                this.stateNumericHex(e, t + 1))
              : ((this.state = c.NumericDecimal),
                this.stateNumericDecimal(e, t));
          }
          addToNumericResult(e, t, r, n) {
            if (t !== r) {
              let s = r - t;
              (this.result =
                this.result * Math.pow(n, s) +
                Number.parseInt(e.substr(t, s), n)),
                (this.consumed += s);
            }
          }
          stateNumericHex(e, t) {
            let r = t;
            for (; t < e.length; ) {
              var n;
              let s = e.charCodeAt(t);
              if (
                !f(s) &&
                (!((n = s) >= a.UPPER_A) || !(n <= a.UPPER_F)) &&
                (!(n >= a.LOWER_A) || !(n <= a.LOWER_F))
              )
                return (
                  this.addToNumericResult(e, r, t, 16),
                  this.emitNumericEntity(s, 3)
                );
              t += 1;
            }
            return this.addToNumericResult(e, r, t, 16), -1;
          }
          stateNumericDecimal(e, t) {
            let r = t;
            for (; t < e.length; ) {
              let n = e.charCodeAt(t);
              if (!f(n))
                return (
                  this.addToNumericResult(e, r, t, 10),
                  this.emitNumericEntity(n, 2)
                );
              t += 1;
            }
            return this.addToNumericResult(e, r, t, 10), -1;
          }
          emitNumericEntity(e, t) {
            var r;
            if (this.consumed <= t)
              return (
                null == (r = this.errors) ||
                  r.absenceOfDigitsInNumericCharacterReference(this.consumed),
                0
              );
            if (e === a.SEMI) this.consumed += 1;
            else if (this.decodeMode === u.Strict) return 0;
            return (
              this.emitCodePoint((0, p.y6)(this.result), this.consumed),
              this.errors &&
                (e !== a.SEMI &&
                  this.errors.missingSemicolonAfterCharacterReference(),
                this.errors.validateNumericCharacterReference(this.result)),
              this.consumed
            );
          }
          stateNamedEntity(e, t) {
            let { decodeTree: r } = this,
              n = r[this.treeIndex],
              s = (n & l.VALUE_LENGTH) >> 14;
            for (; t < e.length; t++, this.excess++) {
              let i = e.charCodeAt(t);
              if (
                ((this.treeIndex = (function (e, t, r, n) {
                  let s = (t & l.BRANCH_LENGTH) >> 7,
                    i = t & l.JUMP_TABLE;
                  if (0 === s) return 0 !== i && n === i ? r : -1;
                  if (i) {
                    let t = n - i;
                    return t < 0 || t >= s ? -1 : e[r + t] - 1;
                  }
                  let o = r,
                    a = o + s - 1;
                  for (; o <= a; ) {
                    let t = (o + a) >>> 1,
                      r = e[t];
                    if (r < n) o = t + 1;
                    else {
                      if (!(r > n)) return e[t + s];
                      a = t - 1;
                    }
                  }
                  return -1;
                })(r, n, this.treeIndex + Math.max(1, s), i)),
                this.treeIndex < 0)
              )
                return 0 === this.result ||
                  (this.decodeMode === u.Attribute &&
                    (0 === s ||
                      (function (e) {
                        var t;
                        return (
                          e === a.EQUALS ||
                          ((t = e) >= a.UPPER_A && t <= a.UPPER_Z) ||
                          (t >= a.LOWER_A && t <= a.LOWER_Z) ||
                          f(t)
                        );
                      })(i)))
                  ? 0
                  : this.emitNotTerminatedNamedEntity();
              if (0 != (s = ((n = r[this.treeIndex]) & l.VALUE_LENGTH) >> 14)) {
                if (i === a.SEMI)
                  return this.emitNamedEntityData(
                    this.treeIndex,
                    s,
                    this.consumed + this.excess
                  );
                this.decodeMode !== u.Strict &&
                  ((this.result = this.treeIndex),
                  (this.consumed += this.excess),
                  (this.excess = 0));
              }
            }
            return -1;
          }
          emitNotTerminatedNamedEntity() {
            var e;
            let { result: t, decodeTree: r } = this,
              n = (r[t] & l.VALUE_LENGTH) >> 14;
            return (
              this.emitNamedEntityData(t, n, this.consumed),
              null == (e = this.errors) ||
                e.missingSemicolonAfterCharacterReference(),
              this.consumed
            );
          }
          emitNamedEntityData(e, t, r) {
            let { decodeTree: n } = this;
            return (
              this.emitCodePoint(
                1 === t ? n[e] & ~l.VALUE_LENGTH : n[e + 1],
                r
              ),
              3 === t && this.emitCodePoint(n[e + 2], r),
              r
            );
          }
          end() {
            var e;
            switch (this.state) {
              case c.NamedEntity:
                return 0 !== this.result &&
                  (this.decodeMode !== u.Attribute ||
                    this.result === this.treeIndex)
                  ? this.emitNotTerminatedNamedEntity()
                  : 0;
              case c.NumericDecimal:
                return this.emitNumericEntity(0, 2);
              case c.NumericHex:
                return this.emitNumericEntity(0, 3);
              case c.NumericStart:
                return (
                  null == (e = this.errors) ||
                    e.absenceOfDigitsInNumericCharacterReference(this.consumed),
                  0
                );
              case c.EntityStart:
                return 0;
            }
          }
        }
      },
      466: function (e, t, r) {
        r(9496), r(747);
      },
      747: function (e, t, r) {
        r.d(t, { Gj: () => l, WY: () => o, X1: () => c });
        let n = /["$&'<>\u0080-\uFFFF]/g,
          s = new Map([
            [34, "&quot;"],
            [38, "&amp;"],
            [39, "&apos;"],
            [60, "&lt;"],
            [62, "&gt;"],
          ]),
          i =
            null == String.prototype.codePointAt
              ? (e, t) =>
                  (64512 & e.charCodeAt(t)) == 55296
                    ? (e.charCodeAt(t) - 55296) * 1024 +
                      e.charCodeAt(t + 1) -
                      56320 +
                      65536
                    : e.charCodeAt(t)
              : (e, t) => e.codePointAt(t);
        function o(e) {
          let t,
            r = "",
            o = 0;
          for (; null !== (t = n.exec(e)); ) {
            let { index: a } = t,
              l = e.charCodeAt(a),
              c = s.get(l);
            void 0 === c
              ? ((r += `${e.substring(o, a)}&#x${i(e, a).toString(16)};`),
                (o = n.lastIndex += Number((64512 & l) == 55296)))
              : ((r += e.substring(o, a) + c), (o = a + 1));
          }
          return r + e.substr(o);
        }
        function a(e, t) {
          return function (r) {
            let n,
              s = 0,
              i = "";
            for (; (n = e.exec(r)); )
              s !== n.index && (i += r.substring(s, n.index)),
                (i += t.get(n[0].charCodeAt(0))),
                (s = n.index + 1);
            return i + r.substring(s);
          };
        }
        let l = a(
            /["&\u00A0]/g,
            new Map([
              [34, "&quot;"],
              [38, "&amp;"],
              [160, "&nbsp;"],
            ])
          ),
          c = a(
            /[&<>\u00A0]/g,
            new Map([
              [38, "&amp;"],
              [60, "&lt;"],
              [62, "&gt;"],
              [160, "&nbsp;"],
            ])
          );
      },
      7259: function (e, t, r) {
        r.d(t, { q: () => n });
        let n = new Uint16Array(
          'ᵁ<\xd5ıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms\x7f\x84\x8b\x90\x95\x98\xa6\xb3\xb9\xc8\xcflig耻\xc6䃆P耻&䀦cute耻\xc1䃁reve;䄂Āiyx}rc耻\xc2䃂;䐐r;쀀\ud835\udd04rave耻\xc0䃀pha;䎑acr;䄀d;橓Āgp\x9d\xa1on;䄄f;쀀\ud835\udd38plyFunction;恡ing耻\xc5䃅Ācs\xbe\xc3r;쀀\ud835\udc9cign;扔ilde耻\xc3䃃ml耻\xc4䃄Ѐaceforsu\xe5\xfb\xfeėĜĢħĪĀcr\xea\xf2kslash;或Ŷ\xf6\xf8;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀\ud835\udd05pf;쀀\ud835\udd39eve;䋘c\xf2ēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻\xa9䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻\xc7䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷\xf2ſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀\ud835\udc9epĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀\ud835\udd07Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀\ud835\udd3bƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegra\xecȹoɴ͹\0\0ͻ\xbb͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔e\xe5ˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀\ud835\udc9frok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻\xd0䃐cute耻\xc9䃉ƀaiyӒӗӜron;䄚rc耻\xca䃊;䐭ot;䄖r;쀀\ud835\udd08rave耻\xc8䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀\ud835\udd3csilon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻\xcb䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀\ud835\udd09lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀\ud835\udd3dAll;戀riertrf;愱c\xf2׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀\ud835\udd0a;拙pf;쀀\ud835\udd3eeater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀\ud835\udca2;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅ\xf2کrok;䄦mpńېۘownHum\xf0įqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻\xcd䃍Āiyܓܘrc耻\xce䃎;䐘ot;䄰r;愑rave耻\xcc䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lie\xf3ϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀\ud835\udd40a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻\xcf䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀\ud835\udd0dpf;쀀\ud835\udd41ǣ߇\0ߌr;쀀\ud835\udca5rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀\ud835\udd0epf;쀀\ud835\udd42cr;쀀\ud835\udca6րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ight\xe1Μs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀\ud835\udd0fĀ;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊight\xe1οight\xe1ϊf;쀀\ud835\udd43erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂ\xf2ࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀\ud835\udd10nusPlus;戓pf;쀀\ud835\udd44c\xf2੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘\xeb૙eryThi\xee૙tedĀGL૸ଆreaterGreate\xf2ٳessLes\xf3ੈLine;䀊r;쀀\ud835\udd11ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀\ud835\udca9ilde耻\xd1䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻\xd3䃓Āiy෎ීrc耻\xd4䃔;䐞blac;䅐r;쀀\ud835\udd12rave耻\xd2䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀\ud835\udd46enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀\ud835\udcaaash耻\xd8䃘iŬื฼de耻\xd5䃕es;樷ml耻\xd6䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀\ud835\udd13i;䎦;䎠usMinus;䂱Āipຢອncareplan\xe5ڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀\ud835\udcab;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀\ud835\udd14pf;愚cr;쀀\ud835\udcac؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻\xae䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r\xbbཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀\ud835\udd16ortȀDLRUᄪᄴᄾᅉownArrow\xbbОeftArrow\xbb࢚ightArrow\xbb࿝pArrow;憑gma;䎣allCircle;战pf;쀀\ud835\udd4aɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀\ud835\udcaear;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Th\xe1ྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et\xbbሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻\xde䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀\ud835\udd17Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀\ud835\udd4bipleDot;惛Āctዖዛr;쀀\ud835\udcafrok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻\xda䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻\xdb䃛;䐣blac;䅰r;쀀\ud835\udd18rave耻\xd9䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀\ud835\udd4cЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥own\xe1ϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀\ud835\udcb0ilde;䅨ml耻\xdc䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀\ud835\udd19pf;쀀\ud835\udd4dcr;쀀\ud835\udcb1dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀\ud835\udd1apf;쀀\ud835\udd4ecr;쀀\ud835\udcb2Ȁfiosᓋᓐᓒᓘr;쀀\ud835\udd1b;䎞pf;쀀\ud835\udd4fcr;쀀\ud835\udcb3ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻\xdd䃝Āiyᔉᔍrc;䅶;䐫r;쀀\ud835\udd1cpf;쀀\ud835\udd50cr;쀀\ud835\udcb4ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidt\xe8૙a;䎖r;愨pf;愤cr;쀀\ud835\udcb5௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻\xe1䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻\xe2䃢te肻\xb4̆;䐰lig耻\xe6䃦Ā;r\xb2ᖺ;쀀\ud835\udd1erave耻\xe0䃠ĀepᗊᗖĀfpᗏᗔsym;愵\xe8ᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e\xbbᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢\xbb\xb9arr;捼Āgpᙣᙧon;䄅f;쀀\ud835\udd52΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒ\xf1ᚃing耻\xe5䃥ƀctyᚡᚦᚨr;쀀\ud835\udcb6;䀪mpĀ;e዁ᚯ\xf1ʈilde耻\xe3䃣ml耻\xe4䃤Āciᛂᛈonin\xf4ɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e\xbbᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰s\xe9ᜌno\xf5ēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀\ud835\udd1fg΀costuvwឍឝឳេ៕៛៞ƀaiuបពរ\xf0ݠrc;旯p\xbb፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄e\xe5ᑄ\xe5ᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀\ud835\udd53Ā;tᏋᡣom\xbbᏌtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻\xa6䂦Ȁceioᥑᥖᥚᥠr;쀀\ud835\udcb7mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t\xbb᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁\xeeړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻\xe7䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻\xb8ƭptyv;榲t脀\xa2;eᨭᨮ䂢r\xe4Ʋr;쀀\ud835\udd20ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark\xbbᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟\xbbཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it\xbb᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;q\xc7\xc6ɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁\xeeᅠeĀmx᫱᫶ent\xbb᫩e\xf3ɍǧ᫾\0ᬇĀ;dኻᬂot;橭n\xf4Ɇƀfryᬐᬔᬗ;쀀\ud835\udd54o\xe4ɔ脀\xa9;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀\ud835\udcb8Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒre\xe3᭳u\xe3᭵ee;拎edge;拏en耻\xa4䂤earrowĀlrᯮ᯳eft\xbbᮀight\xbbᮽe\xe4ᯝĀciᰁᰇonin\xf4Ƿnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍r\xf2΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸\xf2ᄳhĀ;vᱚᱛ怐\xbbऊūᱡᱧarow;椏a\xe3̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻\xb0䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀\ud835\udd21arĀlrᲳᲵ\xbbࣜ\xbbသʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀\xf7;o᳧ᳰntimes;拇n\xf8᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀\ud835\udd55ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedg\xe5\xfanƀadhᄮᵝᵧownarrow\xf3ᲃarpoonĀlrᵲᵶef\xf4Ჴigh\xf4ᲶŢᵿᶅkaro\xf7གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀\ud835\udcb9;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃r\xf2Щa\xf2ྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴo\xf4ᲉĀcsḎḔute耻\xe9䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻\xea䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀\ud835\udd22ƀ;rsṐṑṗ檚ave耻\xe8䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et\xbbẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀\ud835\udd56ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on\xbbớ;䏵ȀcsuvỪỳἋἣĀioữḱrc\xbbḮɩỹ\0\0ỻ\xedՈantĀglἂἆtr\xbbṝess\xbbṺƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯o\xf4͒ĀahὉὋ;䎷耻\xf0䃰Āmrὓὗl耻\xeb䃫o;悬ƀcipὡὤὧl;䀡s\xf4ծĀeoὬὴctatio\xeeՙnential\xe5չৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotse\xf1Ṅy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀\ud835\udd23lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀\ud835\udd57ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻\xbd䂽;慓耻\xbc䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻\xbe䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀\ud835\udcbbࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lan\xf4٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀\ud835\udd24Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox\xbbℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀\ud835\udd58Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎pro\xf8₞r;楸qĀlqؿ↖les\xf3₈i\xed٫Āen↣↭rtneqq;쀀≩︀\xc5↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽r\xf2ΠȀilmr⇐⇔⇗⇛rs\xf0ᒄf\xbb․il\xf4کĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it\xbb∊lip;怦con;抹r;쀀\ud835\udd25sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀\ud835\udd59bar;怕ƀclt≯≴≸r;쀀\ud835\udcbdas\xe8⇴rok;䄧Ābp⊂⊇ull;恃hen\xbbᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻\xed䃭ƀ;iyݱ⊰⊵rc耻\xee䃮;䐸Ācx⊼⊿y;䐵cl耻\xa1䂡ĀfrΟ⋉;쀀\ud835\udd26rave耻\xec䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓in\xe5ގar\xf4ܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝do\xf4⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙er\xf3ᕣ\xe3⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀\ud835\udd5aa;䎹uest耻\xbf䂿Āci⎊⎏r;쀀\ud835\udcbenʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻\xef䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀\ud835\udd27ath;䈷pf;쀀\ud835\udd5bǣ⏬\0⏱r;쀀\ud835\udcbfrcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀\ud835\udd28reen;䄸cy;䑅cy;䑜pf;쀀\ud835\udd5ccr;쀀\ud835\udcc0஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼r\xf2৆\xf2Εail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴ra\xeeࡌbda;䎻gƀ;dlࢎⓁⓃ;榑\xe5ࢎ;檅uo耻\xab䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝\xeb≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼\xecࢰ\xe2┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□a\xe9⓶arpoonĀdu▯▴own\xbbњp\xbb०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoon\xf3྘quigarro\xf7⇰hreetimes;拋ƀ;qs▋ও◺lan\xf4বʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋ppro\xf8Ⓠot;拖qĀgq♃♅\xf4উgt\xf2⒌\xf4ছi\xedলƀilr♕࣡♚sht;楼;쀀\ud835\udd29Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖r\xf2◁orne\xf2ᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che\xbb⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox\xbb⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽r\xebࣁgƀlmr⛿✍✔eftĀar০✇ight\xe1৲apsto;柼ight\xe1৽parrowĀlr✥✩ef\xf4⓭ight;憬ƀafl✶✹✽r;榅;쀀\ud835\udd5dus;樭imes;樴š❋❏st;戗\xe1ፎƀ;ef❗❘᠀旊nge\xbb❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇r\xf2ࢨorne\xf2ᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀\ud835\udcc1mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹re\xe5◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀\xc5⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻\xaf䂯Āet⡗⡙;時Ā;e⡞⡟朠se\xbb⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻ow\xeeҌef\xf4ए\xf0Ꮡker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle\xbbᘦr;쀀\ud835\udd2ao;愧ƀcdn⢯⢴⣉ro耻\xb5䂵Ȁ;acdᑤ⢽⣀⣄s\xf4ᚧir;櫰ot肻\xb7Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛\xf2−\xf0ઁĀdp⣩⣮els;抧f;쀀\ud835\udd5eĀct⣸⣽r;쀀\ud835\udcc2pos\xbbᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la\xbb˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉ro\xf8඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xa0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸ui\xf6ୣĀei⩊⩎ar;椨\xed஘istĀ;s஠டr;쀀\ud835\udd2bȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lan\xf4௢i\xed௪Ā;rஶ⪁\xbbஷƀAap⪊⪍⪑r\xf2⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹r\xf2⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro\xf7⫁ightarro\xf7⪐ƀ;qs఻⪺⫪lan\xf4ౕĀ;sౕ⫴\xbbశi\xedౝĀ;rవ⫾iĀ;eచథi\xe4ඐĀpt⬌⬑f;쀀\ud835\udd5f膀\xac;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lle\xec୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳u\xe5ಥĀ;cಘ⭸Ā;eಒ⭽\xf1ಘȀAait⮈⮋⮝⮧r\xf2⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow\xbb⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉u\xe5൅;쀀\ud835\udcc3ortɭ⬅\0\0⯖ar\xe1⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭\xe5೸\xe5ഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗ\xf1സȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇ\xecௗlde耻\xf1䃱\xe7ృiangleĀlrⱒⱜeftĀ;eచⱚ\xf1దightĀ;eೋⱥ\xf1೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻\xf3䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻\xf4䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀\ud835\udd2cͯ⵹\0\0⵼\0ⶂn;䋛ave耻\xf2䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨr\xf2᪀Āir⶝ⶠr;榾oss;榻n\xe5๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀\ud835\udd60ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨r\xf2᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f\xbbⷿ耻\xaa䂪耻\xba䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧\xf2⸁ash耻\xf8䃸l;折iŬⸯ⸴de耻\xf5䃵esĀ;aǛ⸺s;樶ml耻\xf6䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀\xb6;l⹭⹮䂶le\xecЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀\ud835\udd2dƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕ma\xf4੶ne;明ƀ;tv⺿⻀⻈䏀chfork\xbb´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎\xf6⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻\xb1ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀\ud835\udd61nd耻\xa3䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷u\xe5໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾ppro\xf8⽃urlye\xf1໙\xf1໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨i\xedໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺\xf0⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴\xef໻rel;抰Āci⿀⿅r;쀀\ud835\udcc5;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀\ud835\udd2epf;쀀\ud835\udd62rime;恗cr;쀀\ud835\udcc6ƀaeo⿸〉〓tĀei⿾々rnion\xf3ڰnt;樖stĀ;e【】䀿\xf1Ἑ\xf4༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがr\xf2Ⴓ\xf2ϝail;検ar\xf2ᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕i\xe3ᅮmptyv;榳gȀ;del࿑らるろ;榒;榥\xe5࿑uo耻\xbb䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞\xeb≝\xf0✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶al\xf3༞ƀabrョリヮr\xf2៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗\xec࿲\xe2ヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜn\xe5Ⴛar\xf4ྩt;断ƀilrㅩဣㅮsht;楽;쀀\ud835\udd2fĀaoㅷㆆrĀduㅽㅿ\xbbѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭa\xe9トarpoonĀduㆻㆿow\xeeㅾp\xbb႒eftĀah㇊㇐rrow\xf3࿪arpoon\xf3Ցightarrows;應quigarro\xf7ニhreetimes;拌g;䋚ingdotse\xf1ἲƀahm㈍㈐㈓r\xf2࿪a\xf2Ց;怏oustĀ;a㈞㈟掱che\xbb㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾r\xebဃƀafl㉇㉊㉎r;榆;쀀\ud835\udd63us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒ar\xf2㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀\ud835\udcc7Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠re\xe5ㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛qu\xef➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡u\xe5ᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓i\xedሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒\xeb∨Ā;oਸ਼਴t耻\xa7䂧i;䀻war;椩mĀin㍩\xf0nu\xf3\xf1t;朶rĀ;o㍶⁕쀀\ud835\udd30Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜i\xe4ᑤara\xec⹯耻\xad䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲ar\xf2ᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetm\xe9㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀\ud835\udd64aĀdr㑍ЂesĀ;u㑔㑕晠it\xbb㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍\xf1ᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝\xf1ᆮƀ;afᅻ㒦ְrť㒫ֱ\xbbᅼar\xf2ᅈȀcemt㒹㒾㓂㓅r;쀀\ud835\udcc8tm\xee\xf1i\xec㐕ar\xe6ᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psilo\xeeỠh\xe9⺯s\xbb⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦ppro\xf8㋺urlye\xf1ᇾ\xf1ᇳƀaes㖂㖈㌛ppro\xf8㌚q\xf1㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻\xb9䂹耻\xb2䂲耻\xb3䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨\xeb∮Ā;oਫ਩war;椪lig耻\xdf䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄r\xeb๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀\ud835\udd31Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮ppro\xf8዁im\xbbኬs\xf0ኞĀas㚺㚮\xf0዁rn耻\xfe䃾Ǭ̟㛆⋧es膀\xd7;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀\xe1⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀\ud835\udd65rk;櫚\xe1㍢rime;怴ƀaip㜏㜒㝤d\xe5ቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own\xbbᶻeftĀ;e⠀㜾\xf1म;扜ightĀ;e㊪㝋\xf1ၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀\ud835\udcc9;䑆cy;䑛rok;䅧Āio㞋㞎x\xf4᝷headĀlr㞗㞠eftarro\xf7ࡏightarrow\xbbཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶r\xf2ϭar;楣Ācr㟜㟢ute耻\xfa䃺\xf2ᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻\xfb䃻;䑃ƀabh㠃㠆㠋r\xf2Ꭽlac;䅱a\xf2ᏃĀir㠓㠘sht;楾;쀀\ud835\udd32rave耻\xf9䃹š㠧㠱rĀlr㠬㠮\xbbॗ\xbbႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r\xbb㡆op;挏ri;旸Āal㡖㡚cr;䅫肻\xa8͉Āgp㡢㡦on;䅳f;쀀\ud835\udd66̀adhlsuᅋ㡸㡽፲㢑㢠own\xe1ᎳarpoonĀlr㢈㢌ef\xf4㠭igh\xf4㠯iƀ;hl㢙㢚㢜䏅\xbbᏺon\xbb㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r\xbb㢽op;挎ng;䅯ri;旹cr;쀀\ud835\udccaƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨\xbb᠓Āam㣯㣲r\xf2㢨l耻\xfc䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠r\xf2ϷarĀ;v㤦㤧櫨;櫩as\xe8ϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖app\xe1␕othin\xe7ẖƀhir㓫⻈㥙op\xf4⾵Ā;hᎷ㥢\xefㆍĀiu㥩㥭gm\xe1㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟et\xe1㚜iangleĀlr㦪㦯eft\xbbथight\xbbၑy;䐲ash\xbbံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨa\xf2ᑩr;쀀\ud835\udd33tr\xe9㦮suĀbp㧯㧱\xbbജ\xbb൙pf;쀀\ud835\udd67ro\xf0໻tr\xe9㦴Ācu㨆㨋r;쀀\ud835\udccbĀbp㨐㨘nĀEe㦀㨖\xbb㥾nĀEe㦒㨞\xbb㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀\ud835\udd34pf;쀀\ud835\udd68Ā;eᑹ㩦at\xe8ᑹcr;쀀\ud835\udcccૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tr\xe9៑r;쀀\ud835\udd35ĀAa㪔㪗r\xf2σr\xf2৶;䎾ĀAa㪡㪤r\xf2θr\xf2৫a\xf0✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀\ud835\udd69im\xe5ឲĀAa㫇㫊r\xf2ώr\xf2ਁĀcq㫒ីr;쀀\ud835\udccdĀpt៖㫜r\xe9។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻\xfd䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻\xa5䂥r;쀀\ud835\udd36cy;䑗pf;쀀\ud835\udd6acr;쀀\ud835\udcceĀcm㬦㬩y;䑎l耻\xff䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡tr\xe6ᕟa;䎶r;쀀\ud835\udd37cy;䐶grarr;懝pf;쀀\ud835\udd6bcr;쀀\ud835\udccfĀjn㮅㮇;怍j;怌'
            .split("")
            .map((e) => e.charCodeAt(0))
        );
      },
      5949: function (e, t, r) {
        r.d(t, { s: () => n });
        let n = new Uint16Array(
          "Ȁaglq	\x15\x18\x1bɭ\x0f\0\0\x12p;䀦os;䀧t;䀾t;䀼uot;䀢"
            .split("")
            .map((e) => e.charCodeAt(0))
        );
      },
      9496: function () {},
      8466: function (e, t, r) {
        r.d(t, { Gj: () => a.Gj, WY: () => a.WY, X1: () => a.X1 }),
          r(2990),
          r(466);
        var n,
          s,
          i,
          o,
          a = r(747);
        ((n = i || (i = {}))[(n.XML = 0)] = "XML"),
          (n[(n.HTML = 1)] = "HTML"),
          ((s = o || (o = {}))[(s.UTF8 = 0)] = "UTF8"),
          (s[(s.ASCII = 1)] = "ASCII"),
          (s[(s.Extensive = 2)] = "Extensive"),
          (s[(s.Attribute = 3)] = "Attribute"),
          (s[(s.Text = 4)] = "Text");
      },
      4645: function (e, t, r) {
        r.d(t, { i: () => g });
        var n = r(5645),
          s = r(2990);
        let i = new Set([
            "input",
            "option",
            "optgroup",
            "select",
            "button",
            "datalist",
            "textarea",
          ]),
          o = new Set(["p"]),
          a = new Set(["thead", "tbody"]),
          l = new Set(["dd", "dt"]),
          c = new Set(["rt", "rp"]),
          u = new Map([
            ["tr", new Set(["tr", "th", "td"])],
            ["th", new Set(["th"])],
            ["td", new Set(["thead", "th", "td"])],
            ["body", new Set(["head", "link", "script"])],
            ["li", new Set(["li"])],
            ["p", o],
            ["h1", o],
            ["h2", o],
            ["h3", o],
            ["h4", o],
            ["h5", o],
            ["h6", o],
            ["select", i],
            ["input", i],
            ["output", i],
            ["button", i],
            ["datalist", i],
            ["textarea", i],
            ["option", new Set(["option"])],
            ["optgroup", new Set(["optgroup", "option"])],
            ["dd", l],
            ["dt", l],
            ["address", o],
            ["article", o],
            ["aside", o],
            ["blockquote", o],
            ["details", o],
            ["div", o],
            ["dl", o],
            ["fieldset", o],
            ["figcaption", o],
            ["figure", o],
            ["footer", o],
            ["form", o],
            ["header", o],
            ["hr", o],
            ["main", o],
            ["nav", o],
            ["ol", o],
            ["pre", o],
            ["section", o],
            ["table", o],
            ["ul", o],
            ["rt", c],
            ["rp", c],
            ["tbody", a],
            ["tfoot", a],
          ]),
          d = new Set([
            "area",
            "base",
            "basefont",
            "br",
            "col",
            "command",
            "embed",
            "frame",
            "hr",
            "img",
            "input",
            "isindex",
            "keygen",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
          ]),
          h = new Set(["math", "svg"]),
          p = new Set([
            "mi",
            "mo",
            "mn",
            "ms",
            "mtext",
            "annotation-xml",
            "foreignobject",
            "desc",
            "title",
          ]),
          f = /\s|\//;
        class g {
          constructor(e, t = {}) {
            var r, s, i, o, a, l;
            (this.options = t),
              (this.startIndex = 0),
              (this.endIndex = 0),
              (this.openTagStart = 0),
              (this.tagname = ""),
              (this.attribname = ""),
              (this.attribvalue = ""),
              (this.attribs = null),
              (this.stack = []),
              (this.buffers = []),
              (this.bufferOffset = 0),
              (this.writeIndex = 0),
              (this.ended = !1),
              (this.cbs = null != e ? e : {}),
              (this.htmlMode = !this.options.xmlMode),
              (this.lowerCaseTagNames =
                null != (r = t.lowerCaseTags) ? r : this.htmlMode),
              (this.lowerCaseAttributeNames =
                null != (s = t.lowerCaseAttributeNames) ? s : this.htmlMode),
              (this.recognizeSelfClosing =
                null != (i = t.recognizeSelfClosing) ? i : !this.htmlMode),
              (this.tokenizer = new (null != (o = t.Tokenizer) ? o : n.A)(
                this.options,
                this
              )),
              (this.foreignContext = [!this.htmlMode]),
              null == (l = (a = this.cbs).onparserinit) || l.call(a, this);
          }
          ontext(e, t) {
            var r, n;
            let s = this.getSlice(e, t);
            (this.endIndex = t - 1),
              null == (n = (r = this.cbs).ontext) || n.call(r, s),
              (this.startIndex = t);
          }
          ontextentity(e, t) {
            var r, n;
            (this.endIndex = t - 1),
              null == (n = (r = this.cbs).ontext) || n.call(r, (0, s.MK)(e)),
              (this.startIndex = t);
          }
          isVoidElement(e) {
            return this.htmlMode && d.has(e);
          }
          onopentagname(e, t) {
            this.endIndex = t;
            let r = this.getSlice(e, t);
            this.lowerCaseTagNames && (r = r.toLowerCase()),
              this.emitOpenTag(r);
          }
          emitOpenTag(e) {
            var t, r, n, s;
            (this.openTagStart = this.startIndex), (this.tagname = e);
            let i = this.htmlMode && u.get(e);
            if (i)
              for (; this.stack.length > 0 && i.has(this.stack[0]); ) {
                let e = this.stack.shift();
                null == (r = (t = this.cbs).onclosetag) || r.call(t, e, !0);
              }
            !this.isVoidElement(e) &&
              (this.stack.unshift(e),
              this.htmlMode &&
                (h.has(e)
                  ? this.foreignContext.unshift(!0)
                  : p.has(e) && this.foreignContext.unshift(!1))),
              null == (s = (n = this.cbs).onopentagname) || s.call(n, e),
              this.cbs.onopentag && (this.attribs = {});
          }
          endOpenTag(e) {
            var t, r;
            (this.startIndex = this.openTagStart),
              this.attribs &&
                (null == (r = (t = this.cbs).onopentag) ||
                  r.call(t, this.tagname, this.attribs, e),
                (this.attribs = null)),
              this.cbs.onclosetag &&
                this.isVoidElement(this.tagname) &&
                this.cbs.onclosetag(this.tagname, !0),
              (this.tagname = "");
          }
          onopentagend(e) {
            (this.endIndex = e), this.endOpenTag(!1), (this.startIndex = e + 1);
          }
          onclosetag(e, t) {
            var r, n, s, i, o, a, l, c;
            this.endIndex = t;
            let u = this.getSlice(e, t);
            if (
              (this.lowerCaseTagNames && (u = u.toLowerCase()),
              this.htmlMode &&
                (h.has(u) || p.has(u)) &&
                this.foreignContext.shift(),
              this.isVoidElement(u))
            )
              this.htmlMode &&
                "br" === u &&
                (null == (i = (s = this.cbs).onopentagname) || i.call(s, "br"),
                null == (a = (o = this.cbs).onopentag) ||
                  a.call(o, "br", {}, !0),
                null == (c = (l = this.cbs).onclosetag) || c.call(l, "br", !1));
            else {
              let e = this.stack.indexOf(u);
              if (-1 !== e)
                for (let t = 0; t <= e; t++) {
                  let s = this.stack.shift();
                  null == (n = (r = this.cbs).onclosetag) ||
                    n.call(r, s, t !== e);
                }
              else
                this.htmlMode &&
                  "p" === u &&
                  (this.emitOpenTag("p"), this.closeCurrentTag(!0));
            }
            this.startIndex = t + 1;
          }
          onselfclosingtag(e) {
            (this.endIndex = e),
              this.recognizeSelfClosing || this.foreignContext[0]
                ? (this.closeCurrentTag(!1), (this.startIndex = e + 1))
                : this.onopentagend(e);
          }
          closeCurrentTag(e) {
            var t, r;
            let n = this.tagname;
            this.endOpenTag(e),
              this.stack[0] === n &&
                (null == (r = (t = this.cbs).onclosetag) || r.call(t, n, !e),
                this.stack.shift());
          }
          onattribname(e, t) {
            this.startIndex = e;
            let r = this.getSlice(e, t);
            this.attribname = this.lowerCaseAttributeNames
              ? r.toLowerCase()
              : r;
          }
          onattribdata(e, t) {
            this.attribvalue += this.getSlice(e, t);
          }
          onattribentity(e) {
            this.attribvalue += (0, s.MK)(e);
          }
          onattribend(e, t) {
            var r, s;
            (this.endIndex = t),
              null == (s = (r = this.cbs).onattribute) ||
                s.call(
                  r,
                  this.attribname,
                  this.attribvalue,
                  e === n.X.Double
                    ? '"'
                    : e === n.X.Single
                    ? "'"
                    : e === n.X.NoValue
                    ? void 0
                    : null
                ),
              this.attribs &&
                !Object.prototype.hasOwnProperty.call(
                  this.attribs,
                  this.attribname
                ) &&
                (this.attribs[this.attribname] = this.attribvalue),
              (this.attribvalue = "");
          }
          getInstructionName(e) {
            let t = e.search(f),
              r = t < 0 ? e : e.substr(0, t);
            return this.lowerCaseTagNames && (r = r.toLowerCase()), r;
          }
          ondeclaration(e, t) {
            this.endIndex = t;
            let r = this.getSlice(e, t);
            if (this.cbs.onprocessinginstruction) {
              let e = this.getInstructionName(r);
              this.cbs.onprocessinginstruction(`!${e}`, `!${r}`);
            }
            this.startIndex = t + 1;
          }
          onprocessinginstruction(e, t) {
            this.endIndex = t;
            let r = this.getSlice(e, t);
            if (this.cbs.onprocessinginstruction) {
              let e = this.getInstructionName(r);
              this.cbs.onprocessinginstruction(`?${e}`, `?${r}`);
            }
            this.startIndex = t + 1;
          }
          oncomment(e, t, r) {
            var n, s, i, o;
            (this.endIndex = t),
              null == (s = (n = this.cbs).oncomment) ||
                s.call(n, this.getSlice(e, t - r)),
              null == (o = (i = this.cbs).oncommentend) || o.call(i),
              (this.startIndex = t + 1);
          }
          oncdata(e, t, r) {
            var n, s, i, o, a, l, c, u, d, h;
            this.endIndex = t;
            let p = this.getSlice(e, t - r);
            !this.htmlMode || this.options.recognizeCDATA
              ? (null == (s = (n = this.cbs).oncdatastart) || s.call(n),
                null == (o = (i = this.cbs).ontext) || o.call(i, p),
                null == (l = (a = this.cbs).oncdataend) || l.call(a))
              : (null == (u = (c = this.cbs).oncomment) ||
                  u.call(c, `[CDATA[${p}]]`),
                null == (h = (d = this.cbs).oncommentend) || h.call(d)),
              (this.startIndex = t + 1);
          }
          onend() {
            var e, t;
            if (this.cbs.onclosetag) {
              this.endIndex = this.startIndex;
              for (let e = 0; e < this.stack.length; e++)
                this.cbs.onclosetag(this.stack[e], !0);
            }
            null == (t = (e = this.cbs).onend) || t.call(e);
          }
          reset() {
            var e, t, r, n;
            null == (t = (e = this.cbs).onreset) || t.call(e),
              this.tokenizer.reset(),
              (this.tagname = ""),
              (this.attribname = ""),
              (this.attribs = null),
              (this.stack.length = 0),
              (this.startIndex = 0),
              (this.endIndex = 0),
              null == (n = (r = this.cbs).onparserinit) || n.call(r, this),
              (this.buffers.length = 0),
              (this.foreignContext.length = 0),
              this.foreignContext.unshift(!this.htmlMode),
              (this.bufferOffset = 0),
              (this.writeIndex = 0),
              (this.ended = !1);
          }
          parseComplete(e) {
            this.reset(), this.end(e);
          }
          getSlice(e, t) {
            for (; e - this.bufferOffset >= this.buffers[0].length; )
              this.shiftBuffer();
            let r = this.buffers[0].slice(
              e - this.bufferOffset,
              t - this.bufferOffset
            );
            for (; t - this.bufferOffset > this.buffers[0].length; )
              this.shiftBuffer(),
                (r += this.buffers[0].slice(0, t - this.bufferOffset));
            return r;
          }
          shiftBuffer() {
            (this.bufferOffset += this.buffers[0].length),
              this.writeIndex--,
              this.buffers.shift();
          }
          write(e) {
            var t, r;
            if (this.ended) {
              null == (r = (t = this.cbs).onerror) ||
                r.call(t, Error(".write() after done!"));
              return;
            }
            this.buffers.push(e),
              this.tokenizer.running &&
                (this.tokenizer.write(e), this.writeIndex++);
          }
          end(e) {
            var t, r;
            if (this.ended) {
              null == (r = (t = this.cbs).onerror) ||
                r.call(t, Error(".end() after done!"));
              return;
            }
            e && this.write(e), (this.ended = !0), this.tokenizer.end();
          }
          pause() {
            this.tokenizer.pause();
          }
          resume() {
            for (
              this.tokenizer.resume();
              this.tokenizer.running && this.writeIndex < this.buffers.length;

            )
              this.tokenizer.write(this.buffers[this.writeIndex++]);
            this.ended && this.tokenizer.end();
          }
          parseChunk(e) {
            this.write(e);
          }
          done(e) {
            this.end(e);
          }
        }
      },
      5645: function (e, t, r) {
        r.d(t, { A: () => p, X: () => l });
        var n,
          s,
          i,
          o,
          a,
          l,
          c = r(2990);
        function u(e) {
          return (
            e === o.Space ||
            e === o.NewLine ||
            e === o.Tab ||
            e === o.FormFeed ||
            e === o.CarriageReturn
          );
        }
        function d(e) {
          return e === o.Slash || e === o.Gt || u(e);
        }
        ((n = o || (o = {}))[(n.Tab = 9)] = "Tab"),
          (n[(n.NewLine = 10)] = "NewLine"),
          (n[(n.FormFeed = 12)] = "FormFeed"),
          (n[(n.CarriageReturn = 13)] = "CarriageReturn"),
          (n[(n.Space = 32)] = "Space"),
          (n[(n.ExclamationMark = 33)] = "ExclamationMark"),
          (n[(n.Number = 35)] = "Number"),
          (n[(n.Amp = 38)] = "Amp"),
          (n[(n.SingleQuote = 39)] = "SingleQuote"),
          (n[(n.DoubleQuote = 34)] = "DoubleQuote"),
          (n[(n.Dash = 45)] = "Dash"),
          (n[(n.Slash = 47)] = "Slash"),
          (n[(n.Zero = 48)] = "Zero"),
          (n[(n.Nine = 57)] = "Nine"),
          (n[(n.Semi = 59)] = "Semi"),
          (n[(n.Lt = 60)] = "Lt"),
          (n[(n.Eq = 61)] = "Eq"),
          (n[(n.Gt = 62)] = "Gt"),
          (n[(n.Questionmark = 63)] = "Questionmark"),
          (n[(n.UpperA = 65)] = "UpperA"),
          (n[(n.LowerA = 97)] = "LowerA"),
          (n[(n.UpperF = 70)] = "UpperF"),
          (n[(n.LowerF = 102)] = "LowerF"),
          (n[(n.UpperZ = 90)] = "UpperZ"),
          (n[(n.LowerZ = 122)] = "LowerZ"),
          (n[(n.LowerX = 120)] = "LowerX"),
          (n[(n.OpeningSquareBracket = 91)] = "OpeningSquareBracket"),
          ((s = a || (a = {}))[(s.Text = 1)] = "Text"),
          (s[(s.BeforeTagName = 2)] = "BeforeTagName"),
          (s[(s.InTagName = 3)] = "InTagName"),
          (s[(s.InSelfClosingTag = 4)] = "InSelfClosingTag"),
          (s[(s.BeforeClosingTagName = 5)] = "BeforeClosingTagName"),
          (s[(s.InClosingTagName = 6)] = "InClosingTagName"),
          (s[(s.AfterClosingTagName = 7)] = "AfterClosingTagName"),
          (s[(s.BeforeAttributeName = 8)] = "BeforeAttributeName"),
          (s[(s.InAttributeName = 9)] = "InAttributeName"),
          (s[(s.AfterAttributeName = 10)] = "AfterAttributeName"),
          (s[(s.BeforeAttributeValue = 11)] = "BeforeAttributeValue"),
          (s[(s.InAttributeValueDq = 12)] = "InAttributeValueDq"),
          (s[(s.InAttributeValueSq = 13)] = "InAttributeValueSq"),
          (s[(s.InAttributeValueNq = 14)] = "InAttributeValueNq"),
          (s[(s.BeforeDeclaration = 15)] = "BeforeDeclaration"),
          (s[(s.InDeclaration = 16)] = "InDeclaration"),
          (s[(s.InProcessingInstruction = 17)] = "InProcessingInstruction"),
          (s[(s.BeforeComment = 18)] = "BeforeComment"),
          (s[(s.CDATASequence = 19)] = "CDATASequence"),
          (s[(s.InSpecialComment = 20)] = "InSpecialComment"),
          (s[(s.InCommentLike = 21)] = "InCommentLike"),
          (s[(s.BeforeSpecialS = 22)] = "BeforeSpecialS"),
          (s[(s.BeforeSpecialT = 23)] = "BeforeSpecialT"),
          (s[(s.SpecialStartSequence = 24)] = "SpecialStartSequence"),
          (s[(s.InSpecialTag = 25)] = "InSpecialTag"),
          (s[(s.InEntity = 26)] = "InEntity"),
          ((i = l || (l = {}))[(i.NoValue = 0)] = "NoValue"),
          (i[(i.Unquoted = 1)] = "Unquoted"),
          (i[(i.Single = 2)] = "Single"),
          (i[(i.Double = 3)] = "Double");
        let h = {
          Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
          CdataEnd: new Uint8Array([93, 93, 62]),
          CommentEnd: new Uint8Array([45, 45, 62]),
          ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
          StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
          TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
          TextareaEnd: new Uint8Array([
            60, 47, 116, 101, 120, 116, 97, 114, 101, 97,
          ]),
          XmpEnd: new Uint8Array([60, 47, 120, 109, 112]),
        };
        class p {
          constructor({ xmlMode: e = !1, decodeEntities: t = !0 }, r) {
            (this.cbs = r),
              (this.state = a.Text),
              (this.buffer = ""),
              (this.sectionStart = 0),
              (this.index = 0),
              (this.entityStart = 0),
              (this.baseState = a.Text),
              (this.isSpecial = !1),
              (this.running = !0),
              (this.offset = 0),
              (this.currentSequence = void 0),
              (this.sequenceIndex = 0),
              (this.xmlMode = e),
              (this.decodeEntities = t),
              (this.entityDecoder = new c.Wf(e ? c.sr : c.qN, (e, t) =>
                this.emitCodePoint(e, t)
              ));
          }
          reset() {
            (this.state = a.Text),
              (this.buffer = ""),
              (this.sectionStart = 0),
              (this.index = 0),
              (this.baseState = a.Text),
              (this.currentSequence = void 0),
              (this.running = !0),
              (this.offset = 0);
          }
          write(e) {
            (this.offset += this.buffer.length),
              (this.buffer = e),
              this.parse();
          }
          end() {
            this.running && this.finish();
          }
          pause() {
            this.running = !1;
          }
          resume() {
            (this.running = !0),
              this.index < this.buffer.length + this.offset && this.parse();
          }
          stateText(e) {
            e === o.Lt || (!this.decodeEntities && this.fastForwardTo(o.Lt))
              ? (this.index > this.sectionStart &&
                  this.cbs.ontext(this.sectionStart, this.index),
                (this.state = a.BeforeTagName),
                (this.sectionStart = this.index))
              : this.decodeEntities && e === o.Amp && this.startEntity();
          }
          stateSpecialStartSequence(e) {
            let t = this.sequenceIndex === this.currentSequence.length;
            if (
              t ? d(e) : (32 | e) === this.currentSequence[this.sequenceIndex]
            ) {
              if (!t) return void this.sequenceIndex++;
            } else this.isSpecial = !1;
            (this.sequenceIndex = 0),
              (this.state = a.InTagName),
              this.stateInTagName(e);
          }
          stateInSpecialTag(e) {
            if (this.sequenceIndex === this.currentSequence.length) {
              if (e === o.Gt || u(e)) {
                let t = this.index - this.currentSequence.length;
                if (this.sectionStart < t) {
                  let e = this.index;
                  (this.index = t),
                    this.cbs.ontext(this.sectionStart, t),
                    (this.index = e);
                }
                (this.isSpecial = !1),
                  (this.sectionStart = t + 2),
                  this.stateInClosingTagName(e);
                return;
              }
              this.sequenceIndex = 0;
            }
            (32 | e) === this.currentSequence[this.sequenceIndex]
              ? (this.sequenceIndex += 1)
              : 0 === this.sequenceIndex
              ? this.currentSequence === h.TitleEnd
                ? this.decodeEntities && e === o.Amp && this.startEntity()
                : this.fastForwardTo(o.Lt) && (this.sequenceIndex = 1)
              : (this.sequenceIndex = Number(e === o.Lt));
          }
          stateCDATASequence(e) {
            e === h.Cdata[this.sequenceIndex]
              ? ++this.sequenceIndex === h.Cdata.length &&
                ((this.state = a.InCommentLike),
                (this.currentSequence = h.CdataEnd),
                (this.sequenceIndex = 0),
                (this.sectionStart = this.index + 1))
              : ((this.sequenceIndex = 0),
                (this.state = a.InDeclaration),
                this.stateInDeclaration(e));
          }
          fastForwardTo(e) {
            for (; ++this.index < this.buffer.length + this.offset; )
              if (this.buffer.charCodeAt(this.index - this.offset) === e)
                return !0;
            return (this.index = this.buffer.length + this.offset - 1), !1;
          }
          stateInCommentLike(e) {
            e === this.currentSequence[this.sequenceIndex]
              ? ++this.sequenceIndex === this.currentSequence.length &&
                (this.currentSequence === h.CdataEnd
                  ? this.cbs.oncdata(this.sectionStart, this.index, 2)
                  : this.cbs.oncomment(this.sectionStart, this.index, 2),
                (this.sequenceIndex = 0),
                (this.sectionStart = this.index + 1),
                (this.state = a.Text))
              : 0 === this.sequenceIndex
              ? this.fastForwardTo(this.currentSequence[0]) &&
                (this.sequenceIndex = 1)
              : e !== this.currentSequence[this.sequenceIndex - 1] &&
                (this.sequenceIndex = 0);
          }
          isTagStartChar(e) {
            return this.xmlMode
              ? !d(e)
              : (e >= o.LowerA && e <= o.LowerZ) ||
                  (e >= o.UpperA && e <= o.UpperZ);
          }
          startSpecial(e, t) {
            (this.isSpecial = !0),
              (this.currentSequence = e),
              (this.sequenceIndex = t),
              (this.state = a.SpecialStartSequence);
          }
          stateBeforeTagName(e) {
            if (e === o.ExclamationMark)
              (this.state = a.BeforeDeclaration),
                (this.sectionStart = this.index + 1);
            else if (e === o.Questionmark)
              (this.state = a.InProcessingInstruction),
                (this.sectionStart = this.index + 1);
            else if (this.isTagStartChar(e)) {
              let t = 32 | e;
              (this.sectionStart = this.index),
                this.xmlMode
                  ? (this.state = a.InTagName)
                  : t === h.ScriptEnd[2]
                  ? (this.state = a.BeforeSpecialS)
                  : t === h.TitleEnd[2] || t === h.XmpEnd[2]
                  ? (this.state = a.BeforeSpecialT)
                  : (this.state = a.InTagName);
            } else
              e === o.Slash
                ? (this.state = a.BeforeClosingTagName)
                : ((this.state = a.Text), this.stateText(e));
          }
          stateInTagName(e) {
            d(e) &&
              (this.cbs.onopentagname(this.sectionStart, this.index),
              (this.sectionStart = -1),
              (this.state = a.BeforeAttributeName),
              this.stateBeforeAttributeName(e));
          }
          stateBeforeClosingTagName(e) {
            u(e) ||
              (e === o.Gt
                ? (this.state = a.Text)
                : ((this.state = this.isTagStartChar(e)
                    ? a.InClosingTagName
                    : a.InSpecialComment),
                  (this.sectionStart = this.index)));
          }
          stateInClosingTagName(e) {
            (e === o.Gt || u(e)) &&
              (this.cbs.onclosetag(this.sectionStart, this.index),
              (this.sectionStart = -1),
              (this.state = a.AfterClosingTagName),
              this.stateAfterClosingTagName(e));
          }
          stateAfterClosingTagName(e) {
            (e === o.Gt || this.fastForwardTo(o.Gt)) &&
              ((this.state = a.Text), (this.sectionStart = this.index + 1));
          }
          stateBeforeAttributeName(e) {
            e === o.Gt
              ? (this.cbs.onopentagend(this.index),
                this.isSpecial
                  ? ((this.state = a.InSpecialTag), (this.sequenceIndex = 0))
                  : (this.state = a.Text),
                (this.sectionStart = this.index + 1))
              : e === o.Slash
              ? (this.state = a.InSelfClosingTag)
              : u(e) ||
                ((this.state = a.InAttributeName),
                (this.sectionStart = this.index));
          }
          stateInSelfClosingTag(e) {
            e === o.Gt
              ? (this.cbs.onselfclosingtag(this.index),
                (this.state = a.Text),
                (this.sectionStart = this.index + 1),
                (this.isSpecial = !1))
              : u(e) ||
                ((this.state = a.BeforeAttributeName),
                this.stateBeforeAttributeName(e));
          }
          stateInAttributeName(e) {
            (e === o.Eq || d(e)) &&
              (this.cbs.onattribname(this.sectionStart, this.index),
              (this.sectionStart = this.index),
              (this.state = a.AfterAttributeName),
              this.stateAfterAttributeName(e));
          }
          stateAfterAttributeName(e) {
            e === o.Eq
              ? (this.state = a.BeforeAttributeValue)
              : e === o.Slash || e === o.Gt
              ? (this.cbs.onattribend(l.NoValue, this.sectionStart),
                (this.sectionStart = -1),
                (this.state = a.BeforeAttributeName),
                this.stateBeforeAttributeName(e))
              : u(e) ||
                (this.cbs.onattribend(l.NoValue, this.sectionStart),
                (this.state = a.InAttributeName),
                (this.sectionStart = this.index));
          }
          stateBeforeAttributeValue(e) {
            e === o.DoubleQuote
              ? ((this.state = a.InAttributeValueDq),
                (this.sectionStart = this.index + 1))
              : e === o.SingleQuote
              ? ((this.state = a.InAttributeValueSq),
                (this.sectionStart = this.index + 1))
              : u(e) ||
                ((this.sectionStart = this.index),
                (this.state = a.InAttributeValueNq),
                this.stateInAttributeValueNoQuotes(e));
          }
          handleInAttributeValue(e, t) {
            e === t || (!this.decodeEntities && this.fastForwardTo(t))
              ? (this.cbs.onattribdata(this.sectionStart, this.index),
                (this.sectionStart = -1),
                this.cbs.onattribend(
                  t === o.DoubleQuote ? l.Double : l.Single,
                  this.index + 1
                ),
                (this.state = a.BeforeAttributeName))
              : this.decodeEntities && e === o.Amp && this.startEntity();
          }
          stateInAttributeValueDoubleQuotes(e) {
            this.handleInAttributeValue(e, o.DoubleQuote);
          }
          stateInAttributeValueSingleQuotes(e) {
            this.handleInAttributeValue(e, o.SingleQuote);
          }
          stateInAttributeValueNoQuotes(e) {
            u(e) || e === o.Gt
              ? (this.cbs.onattribdata(this.sectionStart, this.index),
                (this.sectionStart = -1),
                this.cbs.onattribend(l.Unquoted, this.index),
                (this.state = a.BeforeAttributeName),
                this.stateBeforeAttributeName(e))
              : this.decodeEntities && e === o.Amp && this.startEntity();
          }
          stateBeforeDeclaration(e) {
            e === o.OpeningSquareBracket
              ? ((this.state = a.CDATASequence), (this.sequenceIndex = 0))
              : (this.state = e === o.Dash ? a.BeforeComment : a.InDeclaration);
          }
          stateInDeclaration(e) {
            (e === o.Gt || this.fastForwardTo(o.Gt)) &&
              (this.cbs.ondeclaration(this.sectionStart, this.index),
              (this.state = a.Text),
              (this.sectionStart = this.index + 1));
          }
          stateInProcessingInstruction(e) {
            (e === o.Gt || this.fastForwardTo(o.Gt)) &&
              (this.cbs.onprocessinginstruction(this.sectionStart, this.index),
              (this.state = a.Text),
              (this.sectionStart = this.index + 1));
          }
          stateBeforeComment(e) {
            e === o.Dash
              ? ((this.state = a.InCommentLike),
                (this.currentSequence = h.CommentEnd),
                (this.sequenceIndex = 2),
                (this.sectionStart = this.index + 1))
              : (this.state = a.InDeclaration);
          }
          stateInSpecialComment(e) {
            (e === o.Gt || this.fastForwardTo(o.Gt)) &&
              (this.cbs.oncomment(this.sectionStart, this.index, 0),
              (this.state = a.Text),
              (this.sectionStart = this.index + 1));
          }
          stateBeforeSpecialS(e) {
            let t = 32 | e;
            t === h.ScriptEnd[3]
              ? this.startSpecial(h.ScriptEnd, 4)
              : t === h.StyleEnd[3]
              ? this.startSpecial(h.StyleEnd, 4)
              : ((this.state = a.InTagName), this.stateInTagName(e));
          }
          stateBeforeSpecialT(e) {
            switch (32 | e) {
              case h.TitleEnd[3]:
                this.startSpecial(h.TitleEnd, 4);
                break;
              case h.TextareaEnd[3]:
                this.startSpecial(h.TextareaEnd, 4);
                break;
              case h.XmpEnd[3]:
                this.startSpecial(h.XmpEnd, 4);
                break;
              default:
                (this.state = a.InTagName), this.stateInTagName(e);
            }
          }
          startEntity() {
            (this.baseState = this.state),
              (this.state = a.InEntity),
              (this.entityStart = this.index),
              this.entityDecoder.startEntity(
                this.xmlMode
                  ? c.FJ.Strict
                  : this.baseState === a.Text ||
                    this.baseState === a.InSpecialTag
                  ? c.FJ.Legacy
                  : c.FJ.Attribute
              );
          }
          stateInEntity() {
            let e = this.entityDecoder.write(
              this.buffer,
              this.index - this.offset
            );
            e >= 0
              ? ((this.state = this.baseState),
                0 === e && (this.index = this.entityStart))
              : (this.index = this.offset + this.buffer.length - 1);
          }
          cleanup() {
            this.running &&
              this.sectionStart !== this.index &&
              (this.state === a.Text ||
              (this.state === a.InSpecialTag && 0 === this.sequenceIndex)
                ? (this.cbs.ontext(this.sectionStart, this.index),
                  (this.sectionStart = this.index))
                : (this.state === a.InAttributeValueDq ||
                    this.state === a.InAttributeValueSq ||
                    this.state === a.InAttributeValueNq) &&
                  (this.cbs.onattribdata(this.sectionStart, this.index),
                  (this.sectionStart = this.index)));
          }
          shouldContinue() {
            return (
              this.index < this.buffer.length + this.offset && this.running
            );
          }
          parse() {
            for (; this.shouldContinue(); ) {
              let e = this.buffer.charCodeAt(this.index - this.offset);
              switch (this.state) {
                case a.Text:
                  this.stateText(e);
                  break;
                case a.SpecialStartSequence:
                  this.stateSpecialStartSequence(e);
                  break;
                case a.InSpecialTag:
                  this.stateInSpecialTag(e);
                  break;
                case a.CDATASequence:
                  this.stateCDATASequence(e);
                  break;
                case a.InAttributeValueDq:
                  this.stateInAttributeValueDoubleQuotes(e);
                  break;
                case a.InAttributeName:
                  this.stateInAttributeName(e);
                  break;
                case a.InCommentLike:
                  this.stateInCommentLike(e);
                  break;
                case a.InSpecialComment:
                  this.stateInSpecialComment(e);
                  break;
                case a.BeforeAttributeName:
                  this.stateBeforeAttributeName(e);
                  break;
                case a.InTagName:
                  this.stateInTagName(e);
                  break;
                case a.InClosingTagName:
                  this.stateInClosingTagName(e);
                  break;
                case a.BeforeTagName:
                  this.stateBeforeTagName(e);
                  break;
                case a.AfterAttributeName:
                  this.stateAfterAttributeName(e);
                  break;
                case a.InAttributeValueSq:
                  this.stateInAttributeValueSingleQuotes(e);
                  break;
                case a.BeforeAttributeValue:
                  this.stateBeforeAttributeValue(e);
                  break;
                case a.BeforeClosingTagName:
                  this.stateBeforeClosingTagName(e);
                  break;
                case a.AfterClosingTagName:
                  this.stateAfterClosingTagName(e);
                  break;
                case a.BeforeSpecialS:
                  this.stateBeforeSpecialS(e);
                  break;
                case a.BeforeSpecialT:
                  this.stateBeforeSpecialT(e);
                  break;
                case a.InAttributeValueNq:
                  this.stateInAttributeValueNoQuotes(e);
                  break;
                case a.InSelfClosingTag:
                  this.stateInSelfClosingTag(e);
                  break;
                case a.InDeclaration:
                  this.stateInDeclaration(e);
                  break;
                case a.BeforeDeclaration:
                  this.stateBeforeDeclaration(e);
                  break;
                case a.BeforeComment:
                  this.stateBeforeComment(e);
                  break;
                case a.InProcessingInstruction:
                  this.stateInProcessingInstruction(e);
                  break;
                case a.InEntity:
                  this.stateInEntity();
              }
              this.index++;
            }
            this.cleanup();
          }
          finish() {
            this.state === a.InEntity &&
              (this.entityDecoder.end(), (this.state = this.baseState)),
              this.handleTrailingData(),
              this.cbs.onend();
          }
          handleTrailingData() {
            let e = this.buffer.length + this.offset;
            this.sectionStart >= e ||
              (this.state === a.InCommentLike
                ? this.currentSequence === h.CdataEnd
                  ? this.cbs.oncdata(this.sectionStart, e, 0)
                  : this.cbs.oncomment(this.sectionStart, e, 0)
                : this.state === a.InTagName ||
                  this.state === a.BeforeAttributeName ||
                  this.state === a.BeforeAttributeValue ||
                  this.state === a.AfterAttributeName ||
                  this.state === a.InAttributeName ||
                  this.state === a.InAttributeValueSq ||
                  this.state === a.InAttributeValueDq ||
                  this.state === a.InAttributeValueNq ||
                  this.state === a.InClosingTagName ||
                  this.cbs.ontext(this.sectionStart, e));
          }
          emitCodePoint(e, t) {
            this.baseState !== a.Text && this.baseState !== a.InSpecialTag
              ? (this.sectionStart < this.entityStart &&
                  this.cbs.onattribdata(this.sectionStart, this.entityStart),
                (this.sectionStart = this.entityStart + t),
                (this.index = this.sectionStart - 1),
                this.cbs.onattribentity(e))
              : (this.sectionStart < this.entityStart &&
                  this.cbs.ontext(this.sectionStart, this.entityStart),
                (this.sectionStart = this.entityStart + t),
                (this.index = this.sectionStart - 1),
                this.cbs.ontextentity(e, this.sectionStart));
          }
        }
      },
      3808: function (e, t, r) {
        r.d(t, { RJ: () => s, iX: () => n.i });
        var n = r(4645);
        r(8866), r(5645);
        var s = r(2743);
        r(4993);
      },
      1652: function (e, t, r) {
        r.d(t, { N: () => n });
        function n() {
          return "10000000000".replace(/[018]/g, (e) =>
            (
              e ^
              (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (e / 4)))
            ).toString(16)
          );
        }
      },
      3907: function (e, t, r) {
        let n;
        r.d(t, { LW: () => b, QR: () => v });
        var s = r(1652);
        function i(e, t) {
          try {
            return e.apply(this, t);
          } catch (r) {
            let e,
              t =
                ((e = n.__externref_table_alloc()),
                n.__wbindgen_export_2.set(e, r),
                e);
            n.__wbindgen_exn_store(t);
          }
        }
        let o =
          "undefined" != typeof TextDecoder
            ? new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 })
            : {
                decode: () => {
                  throw Error("TextDecoder not available");
                },
              };
        "undefined" != typeof TextDecoder && o.decode();
        let a = null;
        function l() {
          return (
            (null === a || 0 === a.byteLength) &&
              (a = new Uint8Array(n.memory.buffer)),
            a
          );
        }
        function c(e, t) {
          return (e >>>= 0), o.decode(l().subarray(e, e + t));
        }
        let u = 0,
          d =
            "undefined" != typeof TextEncoder
              ? new TextEncoder("utf-8")
              : {
                  encode: () => {
                    throw Error("TextEncoder not available");
                  },
                },
          h =
            "function" == typeof d.encodeInto
              ? function (e, t) {
                  return d.encodeInto(e, t);
                }
              : function (e, t) {
                  let r = d.encode(e);
                  return t.set(r), { read: e.length, written: r.length };
                };
        function p(e, t, r) {
          if (void 0 === r) {
            let r = d.encode(e),
              n = t(r.length, 1) >>> 0;
            return (
              l()
                .subarray(n, n + r.length)
                .set(r),
              (u = r.length),
              n
            );
          }
          let n = e.length,
            s = t(n, 1) >>> 0,
            i = l(),
            o = 0;
          for (; o < n; o++) {
            let t = e.charCodeAt(o);
            if (t > 127) break;
            i[s + o] = t;
          }
          if (o !== n) {
            0 !== o && (e = e.slice(o)),
              (s = r(s, n, (n = o + 3 * e.length), 1) >>> 0);
            let t = h(e, l().subarray(s + o, s + n));
            (o += t.written), (s = r(s, n, o, 1) >>> 0);
          }
          return (u = o), s;
        }
        let f = null;
        function g() {
          return (
            (null === f ||
              !0 === f.buffer.detached ||
              (void 0 === f.buffer.detached && f.buffer !== n.memory.buffer)) &&
              (f = new DataView(n.memory.buffer)),
            f
          );
        }
        function m(e) {
          let t = n.__wbindgen_export_2.get(e);
          return n.__externref_table_dealloc(e), t;
        }
        let y =
          "undefined" == typeof FinalizationRegistry
            ? { register: () => {}, unregister: () => {} }
            : new FinalizationRegistry((e) =>
                n.__wbg_rewriter_free(e >>> 0, 1)
              );
        class b {
          __destroy_into_raw() {
            let e = this.__wbg_ptr;
            return (this.__wbg_ptr = 0), y.unregister(this), e;
          }
          free() {
            let e = this.__destroy_into_raw();
            n.__wbg_rewriter_free(e, 0);
          }
          rewrite_js(e, t, r, s) {
            let i = p(e, n.__wbindgen_malloc, n.__wbindgen_realloc),
              o = u,
              a = p(t, n.__wbindgen_malloc, n.__wbindgen_realloc),
              l = u,
              c = p(r, n.__wbindgen_malloc, n.__wbindgen_realloc),
              d = u,
              h = n.rewriter_rewrite_js(this.__wbg_ptr, i, o, a, l, c, d, s);
            if (h[2]) throw m(h[1]);
            return m(h[0]);
          }
          rewrite_js_bytes(e, t, r, s) {
            let i,
              o =
                ((i = (0, n.__wbindgen_malloc)(+e.length, 1) >>> 0),
                l().set(e, i / 1),
                (u = e.length),
                i),
              a = u,
              c = p(t, n.__wbindgen_malloc, n.__wbindgen_realloc),
              d = u,
              h = p(r, n.__wbindgen_malloc, n.__wbindgen_realloc),
              f = u,
              g = n.rewriter_rewrite_js_bytes(
                this.__wbg_ptr,
                o,
                a,
                c,
                d,
                h,
                f,
                s
              );
            if (g[2]) throw m(g[1]);
            return m(g[0]);
          }
          constructor(e) {
            const t = n.rewriter_new(e);
            if (t[2]) throw m(t[1]);
            return (
              (this.__wbg_ptr = t[0] >>> 0),
              y.register(this, this.__wbg_ptr, this),
              this
            );
          }
        }
        async function w(e, t) {
          if ("function" == typeof Response && e instanceof Response) {
            if ("function" == typeof WebAssembly.instantiateStreaming)
              try {
                return await WebAssembly.instantiateStreaming(e, t);
              } catch (t) {
                if ("application/wasm" != e.headers.get("Content-Type"))
                  console.warn(
                    "`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
                    t
                  );
                else throw t;
              }
            let r = await e.arrayBuffer();
            return await WebAssembly.instantiate(r, t);
          }
          {
            let r = await WebAssembly.instantiate(e, t);
            return r instanceof WebAssembly.Instance
              ? { instance: r, module: e }
              : r;
          }
        }
        function S() {
          let e = {};
          return (
            (e.wbg = {}),
            (e.wbg.__wbg_buffer_609cc3eee51ed158 = function (e) {
              return e.buffer;
            }),
            (e.wbg.__wbg_call_7cccdd69e0791ae2 = function () {
              return i(function (e, t, r) {
                return e.call(t, r);
              }, arguments);
            }),
            (e.wbg.__wbg_call_833bed5770ea2041 = function () {
              return i(function (e, t, r, n) {
                return e.call(t, r, n);
              }, arguments);
            }),
            (e.wbg.__wbg_get_67b2ba62fc30de12 = function () {
              return i(function (e, t) {
                return Reflect.get(e, t);
              }, arguments);
            }),
            (e.wbg.__wbg_new_405e22f390576ce2 = function () {
              return {};
            }),
            (e.wbg.__wbg_new_78feb108b6472713 = function () {
              return [];
            }),
            (e.wbg.__wbg_new_9ffbe0a71eff35e3 = function () {
              return i(function (e, t) {
                return new URL(c(e, t));
              }, arguments);
            }),
            (e.wbg.__wbg_new_a12002a7f91c75be = function (e) {
              return new Uint8Array(e);
            }),
            (e.wbg.__wbg_newwithbase_161c299e7a34e2eb = function () {
              return i(function (e, t, r, n) {
                return new URL(c(e, t), c(r, n));
              }, arguments);
            }),
            (e.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a =
              function (e, t, r) {
                return new Uint8Array(e, t >>> 0, r >>> 0);
              }),
            (e.wbg.__wbg_scramtag_3a255d78b157986d = function (e) {
              let t = p((0, s.N)(), n.__wbindgen_malloc, n.__wbindgen_realloc),
                r = u;
              g().setInt32(e + 4, r, !0), g().setInt32(e + 0, t, !0);
            }),
            (e.wbg.__wbg_set_bb8cecf6a62b9f46 = function () {
              return i(function (e, t, r) {
                return Reflect.set(e, t, r);
              }, arguments);
            }),
            (e.wbg.__wbg_toString_5285597960676b7b = function (e) {
              return e.toString();
            }),
            (e.wbg.__wbg_toString_c813bbd34d063839 = function (e) {
              return e.toString();
            }),
            (e.wbg.__wbindgen_boolean_get = function (e) {
              return "boolean" == typeof e ? +!!e : 2;
            }),
            (e.wbg.__wbindgen_error_new = function (e, t) {
              return Error(c(e, t));
            }),
            (e.wbg.__wbindgen_init_externref_table = function () {
              let e = n.__wbindgen_export_2,
                t = e.grow(4);
              e.set(0, void 0),
                e.set(t + 0, void 0),
                e.set(t + 1, null),
                e.set(t + 2, !0),
                e.set(t + 3, !1);
            }),
            (e.wbg.__wbindgen_is_function = function (e) {
              return "function" == typeof e;
            }),
            (e.wbg.__wbindgen_memory = function () {
              return n.memory;
            }),
            (e.wbg.__wbindgen_string_get = function (e, t) {
              let r = "string" == typeof t ? t : void 0;
              var s =
                  null == r
                    ? 0
                    : p(r, n.__wbindgen_malloc, n.__wbindgen_realloc),
                i = u;
              g().setInt32(e + 4, i, !0), g().setInt32(e + 0, s, !0);
            }),
            (e.wbg.__wbindgen_string_new = function (e, t) {
              return c(e, t);
            }),
            (e.wbg.__wbindgen_throw = function (e, t) {
              throw Error(c(e, t));
            }),
            e
          );
        }
        function x(e, t) {
          return (
            (n = e.exports),
            (E.__wbindgen_wasm_module = t),
            (f = null),
            (a = null),
            n.__wbindgen_start(),
            n
          );
        }
        function v(e) {
          if (void 0 !== n) return n;
          void 0 !== e &&
            (Object.getPrototypeOf(e) === Object.prototype
              ? ({ module: e } = e)
              : console.warn(
                  "using deprecated parameters for `initSync()`; pass a single object instead"
                ));
          let t = S();
          return (
            e instanceof WebAssembly.Module || (e = new WebAssembly.Module(e)),
            x(new WebAssembly.Instance(e, t), e)
          );
        }
        async function E(e) {
          if (void 0 !== n) return n;
          void 0 !== e &&
            (Object.getPrototypeOf(e) === Object.prototype
              ? ({ module_or_path: e } = e)
              : console.warn(
                  "using deprecated parameters for the initialization function; pass a single object instead"
                )),
            void 0 === e && (e = new URL("wasm_bg.wasm", ""));
          let t = S();
          ("string" == typeof e ||
            ("function" == typeof Request && e instanceof Request) ||
            ("function" == typeof URL && e instanceof URL)) &&
            (e = fetch(e));
          let { instance: r, module: s } = await w(await e, t);
          return x(r, s);
        }
      },
    },
    t = {};
  function r(n) {
    var s = t[n];
    if (void 0 !== s) return s.exports;
    var i = (t[n] = { exports: {} });
    return e[n](i, i.exports, r), i.exports;
  }
  (r.n = (e) => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return r.d(t, { a: t }), t;
  }),
    (r.d = (e, t) => {
      for (var n in t)
        r.o(t, n) &&
          !r.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (r.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (globalThis.$scramjetRequire = function (e) {
      return r(409)(e);
    }),
    (globalThis.$scramjetLoadController = function () {
      return r(9052);
    }),
    (globalThis.$scramjetLoadClient = function () {
      return r(1323);
    }),
    (globalThis.$scramjetLoadWorker = function () {
      return r(7510);
    }),
    (globalThis.$scramjetVersion = {
      build: "529f729",
      version: "2.0.0-alpha",
    }),
    "document" in globalThis &&
      document?.currentScript &&
      document.currentScript.remove();
})();
//# sourceMappingURL=scramjet.all.js.map

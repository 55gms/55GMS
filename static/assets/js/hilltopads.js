(function (options) {
  (() => {
    var t = {
        757: (t, e, a) => {
          t.exports = a(666);
        },
        666: (t) => {
          var e = (function (t) {
            "use strict";
            var e,
              a = Object.prototype,
              n = a.hasOwnProperty,
              s = "function" == typeof Symbol ? Symbol : {},
              o = s.iterator || "@@iterator",
              i = s.asyncIterator || "@@asyncIterator",
              r = s.toStringTag || "@@toStringTag";
            function l(t, e, a) {
              return (
                Object.defineProperty(t, e, {
                  value: a,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                }),
                t[e]
              );
            }
            try {
              l({}, "");
            } catch (t) {
              l = function (t, e, a) {
                return (t[e] = a);
              };
            }
            function u(t, e, a, n) {
              var s = e && e.prototype instanceof m ? e : m,
                o = Object.create(s.prototype),
                i = new B(n || []);
              return (
                (o._invoke = (function (t, e, a) {
                  var n = c;
                  return function (s, o) {
                    if (n === f)
                      throw new Error("Generator is already running");
                    if (n === h) {
                      if ("throw" === s) throw o;
                      return D();
                    }
                    for (a.method = s, a.arg = o; ; ) {
                      var i = a.delegate;
                      if (i) {
                        var r = I(i, a);
                        if (r) {
                          if (r === g) continue;
                          return r;
                        }
                      }
                      if ("next" === a.method) a.sent = a._sent = a.arg;
                      else if ("throw" === a.method) {
                        if (n === c) throw ((n = h), a.arg);
                        a.dispatchException(a.arg);
                      } else "return" === a.method && a.abrupt("return", a.arg);
                      n = f;
                      var l = d(t, e, a);
                      if ("normal" === l.type) {
                        if (((n = a.done ? h : p), l.arg === g)) continue;
                        return { value: l.arg, done: a.done };
                      }
                      "throw" === l.type &&
                        ((n = h), (a.method = "throw"), (a.arg = l.arg));
                    }
                  };
                })(t, a, i)),
                o
              );
            }
            function d(t, e, a) {
              try {
                return { type: "normal", arg: t.call(e, a) };
              } catch (t) {
                return { type: "throw", arg: t };
              }
            }
            t.wrap = u;
            var c = "suspendedStart",
              p = "suspendedYield",
              f = "executing",
              h = "completed",
              g = {};
            function m() {}
            function A() {}
            function C() {}
            var x = {};
            l(x, o, function () {
              return this;
            });
            var b = Object.getPrototypeOf,
              y = b && b(b(W([])));
            y && y !== a && n.call(y, o) && (x = y);
            var v = (C.prototype = m.prototype = Object.create(x));
            function w(t) {
              ["next", "throw", "return"].forEach(function (e) {
                l(t, e, function (t) {
                  return this._invoke(e, t);
                });
              });
            }
            function E(t, e) {
              function a(s, o, i, r) {
                var l = d(t[s], t, o);
                if ("throw" !== l.type) {
                  var u = l.arg,
                    c = u.value;
                  return c && "object" == typeof c && n.call(c, "__await")
                    ? e.resolve(c.__await).then(
                        function (t) {
                          a("next", t, i, r);
                        },
                        function (t) {
                          a("throw", t, i, r);
                        },
                      )
                    : e.resolve(c).then(
                        function (t) {
                          (u.value = t), i(u);
                        },
                        function (t) {
                          return a("throw", t, i, r);
                        },
                      );
                }
                r(l.arg);
              }
              var s;
              this._invoke = function (t, n) {
                function o() {
                  return new e(function (e, s) {
                    a(t, n, e, s);
                  });
                }
                return (s = s ? s.then(o, o) : o());
              };
            }
            function I(t, a) {
              var n = t.iterator[a.method];
              if (n === e) {
                if (((a.delegate = null), "throw" === a.method)) {
                  if (
                    t.iterator.return &&
                    ((a.method = "return"),
                    (a.arg = e),
                    I(t, a),
                    "throw" === a.method)
                  )
                    return g;
                  (a.method = "throw"),
                    (a.arg = new TypeError(
                      "The iterator does not provide a 'throw' method",
                    ));
                }
                return g;
              }
              var s = d(n, t.iterator, a.arg);
              if ("throw" === s.type)
                return (
                  (a.method = "throw"), (a.arg = s.arg), (a.delegate = null), g
                );
              var o = s.arg;
              return o
                ? o.done
                  ? ((a[t.resultName] = o.value),
                    (a.next = t.nextLoc),
                    "return" !== a.method && ((a.method = "next"), (a.arg = e)),
                    (a.delegate = null),
                    g)
                  : o
                : ((a.method = "throw"),
                  (a.arg = new TypeError("iterator result is not an object")),
                  (a.delegate = null),
                  g);
            }
            function k(t) {
              var e = { tryLoc: t[0] };
              1 in t && (e.catchLoc = t[1]),
                2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
                this.tryEntries.push(e);
            }
            function _(t) {
              var e = t.completion || {};
              (e.type = "normal"), delete e.arg, (t.completion = e);
            }
            function B(t) {
              (this.tryEntries = [{ tryLoc: "root" }]),
                t.forEach(k, this),
                this.reset(!0);
            }
            function W(t) {
              if (t) {
                var a = t[o];
                if (a) return a.call(t);
                if ("function" == typeof t.next) return t;
                if (!isNaN(t.length)) {
                  var s = -1,
                    i = function a() {
                      for (; ++s < t.length; )
                        if (n.call(t, s))
                          return (a.value = t[s]), (a.done = !1), a;
                      return (a.value = e), (a.done = !0), a;
                    };
                  return (i.next = i);
                }
              }
              return { next: D };
            }
            function D() {
              return { value: e, done: !0 };
            }
            return (
              (A.prototype = C),
              l(v, "constructor", C),
              l(C, "constructor", A),
              (A.displayName = l(C, r, "GeneratorFunction")),
              (t.isGeneratorFunction = function (t) {
                var e = "function" == typeof t && t.constructor;
                return (
                  !!e &&
                  (e === A || "GeneratorFunction" === (e.displayName || e.name))
                );
              }),
              (t.mark = function (t) {
                return (
                  Object.setPrototypeOf
                    ? Object.setPrototypeOf(t, C)
                    : ((t.__proto__ = C), l(t, r, "GeneratorFunction")),
                  (t.prototype = Object.create(v)),
                  t
                );
              }),
              (t.awrap = function (t) {
                return { __await: t };
              }),
              w(E.prototype),
              l(E.prototype, i, function () {
                return this;
              }),
              (t.AsyncIterator = E),
              (t.async = function (e, a, n, s, o) {
                void 0 === o && (o = Promise);
                var i = new E(u(e, a, n, s), o);
                return t.isGeneratorFunction(a)
                  ? i
                  : i.next().then(function (t) {
                      return t.done ? t.value : i.next();
                    });
              }),
              w(v),
              l(v, r, "Generator"),
              l(v, o, function () {
                return this;
              }),
              l(v, "toString", function () {
                return "[object Generator]";
              }),
              (t.keys = function (t) {
                var e = [];
                for (var a in t) e.push(a);
                return (
                  e.reverse(),
                  function a() {
                    for (; e.length; ) {
                      var n = e.pop();
                      if (n in t) return (a.value = n), (a.done = !1), a;
                    }
                    return (a.done = !0), a;
                  }
                );
              }),
              (t.values = W),
              (B.prototype = {
                constructor: B,
                reset: function (t) {
                  if (
                    ((this.prev = 0),
                    (this.next = 0),
                    (this.sent = this._sent = e),
                    (this.done = !1),
                    (this.delegate = null),
                    (this.method = "next"),
                    (this.arg = e),
                    this.tryEntries.forEach(_),
                    !t)
                  )
                    for (var a in this)
                      "t" === a.charAt(0) &&
                        n.call(this, a) &&
                        !isNaN(+a.slice(1)) &&
                        (this[a] = e);
                },
                stop: function () {
                  this.done = !0;
                  var t = this.tryEntries[0].completion;
                  if ("throw" === t.type) throw t.arg;
                  return this.rval;
                },
                dispatchException: function (t) {
                  if (this.done) throw t;
                  var a = this;
                  function s(n, s) {
                    return (
                      (r.type = "throw"),
                      (r.arg = t),
                      (a.next = n),
                      s && ((a.method = "next"), (a.arg = e)),
                      !!s
                    );
                  }
                  for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                      r = i.completion;
                    if ("root" === i.tryLoc) return s("end");
                    if (i.tryLoc <= this.prev) {
                      var l = n.call(i, "catchLoc"),
                        u = n.call(i, "finallyLoc");
                      if (l && u) {
                        if (this.prev < i.catchLoc) return s(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return s(i.finallyLoc);
                      } else if (l) {
                        if (this.prev < i.catchLoc) return s(i.catchLoc, !0);
                      } else {
                        if (!u)
                          throw new Error(
                            "try statement without catch or finally",
                          );
                        if (this.prev < i.finallyLoc) return s(i.finallyLoc);
                      }
                    }
                  }
                },
                abrupt: function (t, e) {
                  for (var a = this.tryEntries.length - 1; a >= 0; --a) {
                    var s = this.tryEntries[a];
                    if (
                      s.tryLoc <= this.prev &&
                      n.call(s, "finallyLoc") &&
                      this.prev < s.finallyLoc
                    ) {
                      var o = s;
                      break;
                    }
                  }
                  o &&
                    ("break" === t || "continue" === t) &&
                    o.tryLoc <= e &&
                    e <= o.finallyLoc &&
                    (o = null);
                  var i = o ? o.completion : {};
                  return (
                    (i.type = t),
                    (i.arg = e),
                    o
                      ? ((this.method = "next"), (this.next = o.finallyLoc), g)
                      : this.complete(i)
                  );
                },
                complete: function (t, e) {
                  if ("throw" === t.type) throw t.arg;
                  return (
                    "break" === t.type || "continue" === t.type
                      ? (this.next = t.arg)
                      : "return" === t.type
                        ? ((this.rval = this.arg = t.arg),
                          (this.method = "return"),
                          (this.next = "end"))
                        : "normal" === t.type && e && (this.next = e),
                    g
                  );
                },
                finish: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var a = this.tryEntries[e];
                    if (a.finallyLoc === t)
                      return this.complete(a.completion, a.afterLoc), _(a), g;
                  }
                },
                catch: function (t) {
                  for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                    var a = this.tryEntries[e];
                    if (a.tryLoc === t) {
                      var n = a.completion;
                      if ("throw" === n.type) {
                        var s = n.arg;
                        _(a);
                      }
                      return s;
                    }
                  }
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function (t, a, n) {
                  return (
                    (this.delegate = {
                      iterator: W(t),
                      resultName: a,
                      nextLoc: n,
                    }),
                    "next" === this.method && (this.arg = e),
                    g
                  );
                },
              }),
              t
            );
          })(t.exports);
          try {
            regeneratorRuntime = e;
          } catch (t) {
            "object" == typeof globalThis
              ? (globalThis.regeneratorRuntime = e)
              : Function("r", "regeneratorRuntime = r")(e);
          }
        },
      },
      e = {};
    function a(n) {
      var s = e[n];
      if (void 0 !== s) return s.exports;
      var o = (e[n] = { exports: {} });
      return t[n](o, o.exports, a), o.exports;
    }
    (a.n = (t) => {
      var e = t && t.__esModule ? () => t.default : () => t;
      return a.d(e, { a: e }), e;
    }),
      (a.d = (t, e) => {
        for (var n in e)
          a.o(e, n) &&
            !a.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
      }),
      (a.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
      (() => {
        "use strict";
        function t(t, e, a, n, s, o, i) {
          try {
            var r = t[o](i),
              l = r.value;
          } catch (t) {
            return void a(t);
          }
          r.done ? e(l) : Promise.resolve(l).then(n, s);
        }
        function e(e) {
          return function () {
            var a = this,
              n = arguments;
            return new Promise(function (s, o) {
              var i = e.apply(a, n);
              function r(e) {
                t(i, s, o, r, l, "next", e);
              }
              function l(e) {
                t(i, s, o, r, l, "throw", e);
              }
              r(void 0);
            });
          };
        }
        function n(t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        }
        function s(t, e) {
          for (var a = 0; a < e.length; a++) {
            var n = e[a];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(t, n.key, n);
          }
        }
        function o(t, e, a) {
          return e && s(t.prototype, e), a && s(t, a), t;
        }
        function i(t, e, a) {
          return (
            e in t
              ? Object.defineProperty(t, e, {
                  value: a,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[e] = a),
            t
          );
        }
        var r = a(757),
          l = a.n(r);
        function u(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var a = 0, n = new Array(e); a < e; a++) n[a] = t[a];
          return n;
        }
        function d(t, e) {
          return (
            (function (t) {
              if (Array.isArray(t)) return t;
            })(t) ||
            (function (t, e) {
              var a =
                null == t
                  ? null
                  : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
                    t["@@iterator"];
              if (null != a) {
                var n,
                  s,
                  o = [],
                  i = !0,
                  r = !1;
                try {
                  for (
                    a = a.call(t);
                    !(i = (n = a.next()).done) &&
                    (o.push(n.value), !e || o.length !== e);
                    i = !0
                  );
                } catch (t) {
                  (r = !0), (s = t);
                } finally {
                  try {
                    i || null == a.return || a.return();
                  } finally {
                    if (r) throw s;
                  }
                }
                return o;
              }
            })(t, e) ||
            (function (t, e) {
              if (t) {
                if ("string" == typeof t) return u(t, e);
                var a = Object.prototype.toString.call(t).slice(8, -1);
                return (
                  "Object" === a && t.constructor && (a = t.constructor.name),
                  "Map" === a || "Set" === a
                    ? Array.from(t)
                    : "Arguments" === a ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)
                      ? u(t, e)
                      : void 0
                );
              }
            })(t, e) ||
            (function () {
              throw new TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function c(t) {
          return (
            (c =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? "symbol"
                      : typeof t;
                  }),
            c(t)
          );
        }
        const p = function (t, e) {
            var a,
              n = document.createElement("script"),
              s = "[[denied]]",
              o = e || {};
            (a =
              "Stack: " +
              t.stack +
              "\nMessage: " +
              t.message +
              "\nCode: " +
              t.code +
              "\nName: " +
              t.name),
              o.situation && (a += "\nSituation: " + o.situation),
              o.info && (a += "\nMore info: " + o.info),
              (a += "\nVersion: 1.0.2"),
              (a += "\nURL: " + window.location.href),
              window.self !== window.top &&
                (a +=
                  "\nParent URLs: " +
                  JSON.stringify(
                    (function () {
                      var t = {};
                      try {
                        t.topHref = window.top.location.href;
                      } catch (o) {
                        try {
                          var e = window.location.ancestorOrigins;
                          if (e) {
                            t.parentsDomains = [];
                            for (var a = 0; a < e.length; a++)
                              t.parentsDomains.unshift(e[a]);
                          }
                          var n = window,
                            s = window.parent;
                          for (
                            t.parentsHrefs = [], t.parentsReferrers = [];
                            s !== n;

                          )
                            t.parentsReferrers.unshift(n.document.referrer),
                              t.parentsHrefs.unshift(n.location.href),
                              (n = n.parent),
                              (s = s.parent);
                        } catch (t) {}
                      }
                      return t;
                    })(),
                  ));
            try {
              s = navigator.userAgent;
            } catch (t) {}
            return (
              (n.src =
                "//ptekuwiny.pro/jserr?msg=" +
                encodeURIComponent(a) +
                "&ua=" +
                encodeURIComponent(s) +
                "&tag=in-page-push"),
              document.head.appendChild(n),
              a
            );
          },
          f = (function () {
            var t = e(
              l().mark(function t(e) {
                var a;
                return l().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            ((t.prev = 0),
                            (a = function () {
                              return document.body.appendChild(e);
                            }),
                            !document.body)
                          ) {
                            t.next = 4;
                            break;
                          }
                          return t.abrupt("return", a());
                        case 4:
                          return t.abrupt(
                            "return",
                            new Promise(function (t) {
                              window.addEventListener(
                                "DOMContentLoaded",
                                function () {
                                  return t(a());
                                },
                                !1,
                              );
                            }),
                          );
                        case 7:
                          return (
                            (t.prev = 7),
                            (t.t0 = t.catch(0)),
                            p(t.t0, { situation: "injectDOM" }),
                            t.abrupt(
                              "return",
                              Promise.reject(new Error("Error on injectDOM")),
                            )
                          );
                        case 11:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 7]],
                );
              }),
            );
            return function (e) {
              return t.apply(this, arguments);
            };
          })(),
          h = (function () {
            var t = e(
              l().mark(function t(e) {
                var a;
                return l().wrap(
                  function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            ((t.prev = 0),
                            (a = function () {
                              return document.body.after(e);
                            }),
                            !document.body)
                          ) {
                            t.next = 4;
                            break;
                          }
                          return t.abrupt("return", a());
                        case 4:
                          return t.abrupt(
                            "return",
                            new Promise(function (t) {
                              window.addEventListener(
                                "DOMContentLoaded",
                                function () {
                                  return t(a());
                                },
                                !1,
                              );
                            }),
                          );
                        case 7:
                          return (
                            (t.prev = 7),
                            (t.t0 = t.catch(0)),
                            p(t.t0, { situation: "injectDOM" }),
                            t.abrupt(
                              "return",
                              Promise.reject(new Error("Error on injectDOM")),
                            )
                          );
                        case 11:
                        case "end":
                          return t.stop();
                      }
                  },
                  t,
                  null,
                  [[0, 7]],
                );
              }),
            );
            return function (e) {
              return t.apply(this, arguments);
            };
          })();
        function g(t) {
          return !!t && "object" === c(t) && !Array.isArray(t);
        }
        function m(t) {
          for (
            var e = arguments.length, a = new Array(e > 1 ? e - 1 : 0), n = 1;
            n < e;
            n++
          )
            a[n - 1] = arguments[n];
          if (!a.length) return t;
          var s = a.shift();
          return (
            g(t) &&
              g(s) &&
              Object.keys(s).forEach(function (e) {
                g(s[e])
                  ? (t[e] || Object.assign(t, i({}, e, {})), m(t[e], s[e]))
                  : Object.assign(t, i({}, e, s[e]));
              }),
            m.apply(void 0, [t].concat(a))
          );
        }
        var A = function () {
          this.parentElement && this.parentElement.removeChild(this);
        };
        const C = function (t) {
            if (t) {
              var e = "1.0.2",
                a = t,
                n = a.indexOf("?");
              -1 !== n && ((e += "&" + a.slice(n + 1)), (a = a.slice(0, n)));
              try {
                if ("function" == typeof navigator.sendBeacon) {
                  var s = new Blob([e], {
                    type: "application/x-www-form-urlencoded",
                  });
                  return void navigator.sendBeacon(a, s);
                }
              } catch (t) {}
              !(function (t, e) {
                try {
                  var a = new XMLHttpRequest();
                  (a.withCredentials = !0),
                    a.open("POST", t, !0),
                    a.setRequestHeader(
                      "Content-Type",
                      "application/x-www-form-urlencoded",
                    ),
                    a.send(e);
                } catch (a) {
                  !(function (t, e) {
                    var a =
                        document.currentScript ||
                        document.getElementsByTagName("script")[0],
                      n = !1;
                    function s() {
                      n ||
                        ((n = !0),
                        (function (t) {
                          var e,
                            a,
                            n = document,
                            s =
                              n.currentScript ||
                              n.getElementsByTagName("script")[0],
                            o = window,
                            i = function () {
                              t(o || window);
                            };
                          try {
                            a = n.createElement("IFRAME");
                          } catch (t) {
                            return i();
                          }
                          if (!a) return i();
                          (a.src = "about:blank"),
                            (a.title = ""),
                            (a.role = "presentation"),
                            (a.loading = "eager");
                          var r = (a.frameElement || a).style;
                          (r.width = 0),
                            (r.height = 0),
                            (r.border = 0),
                            (r.display = "none"),
                            (
                              (s && s.parentNode) ||
                              n.body ||
                              n.head
                            ).appendChild(a);
                          try {
                            n = (
                              (o = a.contentWindow).document ||
                              o.contentDocument
                            ).open();
                          } catch (t) {
                            if (
                              ((e = document.domain),
                              "sandboxed" ===
                                (function () {
                                  if (window.parent === window)
                                    return "no-iframe";
                                  var t;
                                  try {
                                    t = window.frameElement;
                                  } catch (e) {
                                    t = null;
                                  }
                                  return null === t
                                    ? "" !== document.domain
                                      ? "unknown"
                                      : "data:" !== window.location.protocol
                                        ? "sandboxed"
                                        : "unknown"
                                    : t.hasAttribute("sandbox")
                                      ? "sandboxed"
                                      : "non-sandboxed";
                                })())
                            )
                              return i();
                            if (
                              ((a.src =
                                'javascript:var d=document.open();d.domain="' +
                                e +
                                '";void 0'),
                              !(o = a.contentWindow))
                            )
                              return i();
                            try {
                              n = (o.document || o.contentDocument).open();
                            } catch (t) {
                              return i();
                            }
                          }
                          e
                            ? ((n._scriptl = function () {
                                (this.domain = e), t();
                              }),
                              n.write('<body onload="document._scriptl();">'))
                            : ((o._scriptl = function () {
                                t(), delete o._scriptl;
                              }),
                              o.addEventListener("load", o._scriptl, !0)),
                            n && "function" == typeof n.close && n.close();
                        })(function () {
                          return (function (t, e) {
                            setTimeout(function () {
                              var e =
                                "string" == typeof t
                                  ? document.createElement("SCRIPT")
                                  : t;
                              e.addEventListener("load", A, !0),
                                e.addEventListener("error", A, !0),
                                e.src || (e.src = t),
                                (
                                  document.head ||
                                  document.getElementsByTagName("head")[0]
                                ).appendChild(e);
                            }, 4);
                          })(t);
                        }));
                    }
                    var o = document.createElement("LINK");
                    o.relList &&
                    "function" == typeof o.relList.supports &&
                    o.relList.supports("preload") &&
                    "as" in o
                      ? (function (o) {
                          (o.href = "string" == typeof t ? t : t.src),
                            (o.rel = "preload"),
                            (o.as = "script"),
                            e && (o.crossOrigin = e),
                            o.addEventListener(
                              "load",
                              function () {
                                (n = !0), A.call(this);
                              },
                              !0,
                            ),
                            o.addEventListener(
                              "error",
                              function () {
                                s(), A.call(this);
                              },
                              !0,
                            ),
                            a.parentNode.appendChild(o);
                        })(o)
                      : s();
                  })(t + "?" + e);
                }
              })(a, e);
            }
          },
          x = function (t, e, a) {
            t.addEventListener(
              "transitionend",
              function n(s) {
                (a && s.propertyName !== a) ||
                  (t.removeEventListener("transitionend", n, !0), e());
              },
              !0,
            );
          };
        var b = (function () {
          function t(e) {
            var a = e.callbacks,
              s = void 0 === a ? {} : a,
              o = e.data,
              r = e.dataBus,
              l = e.methods,
              u = e.options;
            n(this, t),
              i(this, "renderElement", void 0),
              i(this, "sendEvent", C),
              (this.callbacks = {
                onstart: s.onstart || [],
                onremove: s.onremove || [],
              }),
              (this.data = o),
              (this.dataBus = r),
              (this.methods = l),
              (this.options = m({}, u));
          }
          var a;
          return (
            o(t, [
              {
                key: "start",
                value: function () {
                  var t = this;
                  this.renderElement.focus(),
                    requestAnimationFrame(function () {
                      t.renderElement.classList.add(
                        t.options.defaultClass + "_started",
                      );
                    }),
                    this.data.showEventUrl &&
                      this.sendEvent(this.data.showEventUrl),
                    this.runCallbacks("onstart");
                },
              },
              {
                key: "runCallbacks",
                value: function (t) {
                  var e = this;
                  this.callbacks[t].forEach(function (t) {
                    return t.call(e);
                  });
                },
              },
              {
                key: "hide",
                value:
                  ((a = e(
                    l().mark(function t() {
                      var e,
                        a,
                        n,
                        s = this,
                        o = arguments;
                      return l().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (e =
                                    o.length > 0 && void 0 !== o[0]
                                      ? o[0]
                                      : {}),
                                  (a = e.transitionEndProp),
                                  (n = new Promise(function (t) {
                                    x(s.renderElement, t, a);
                                  })),
                                  this.renderElement.classList.add(
                                    this.options.defaultClass + "_hidden",
                                  ),
                                  t.abrupt("return", n)
                                );
                              case 4:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                      );
                    }),
                  )),
                  function () {
                    return a.apply(this, arguments);
                  }),
              },
              {
                key: "remove",
                value: function () {
                  var t;
                  null === (t = this.renderElement.parentElement) ||
                    void 0 === t ||
                    t.removeChild(this.renderElement),
                    this.runCallbacks("onremove");
                },
              },
            ]),
            t
          );
        })();
        function y(t, e) {
          var a = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var n = Object.getOwnPropertySymbols(t);
            e &&
              (n = n.filter(function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable;
              })),
              a.push.apply(a, n);
          }
          return a;
        }
        function v(t) {
          for (var e = 1; e < arguments.length; e++) {
            var a = null != arguments[e] ? arguments[e] : {};
            e % 2
              ? y(Object(a), !0).forEach(function (e) {
                  i(t, e, a[e]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    t,
                    Object.getOwnPropertyDescriptors(a),
                  )
                : y(Object(a)).forEach(function (e) {
                    Object.defineProperty(
                      t,
                      e,
                      Object.getOwnPropertyDescriptor(a, e),
                    );
                  });
          }
          return t;
        }
        const w = (function () {
          function t(e) {
            n(this, t),
              i(this, "appendedStyles", {}),
              i(this, "options", {}),
              i(this, "getValue", function (t, e) {
                return "function" == typeof t ? t.call(e) : t;
              }),
              this.copySettings(e),
              this.setDefaultClass(),
              this.setUniqueID();
          }
          var a, s;
          return (
            o(t, [
              {
                key: "copySettings",
                value: function (t) {
                  t && (this.settings = m(this.options, t));
                },
              },
              {
                key: "setDefaultClass",
                value: function () {
                  this.options.defaultClass = (function (t) {
                    for (var e = "", a = 0; a < 1; a++)
                      e += "▭".charAt(Math.floor(Math.random() * "▭".length));
                    return e;
                  })();
                },
              },
              {
                key: "setPosition",
                value: function () {
                  return this.options.isAllowChangePosition && this.options.top
                    ? ".defaultClass{top:16px;right:16px;bottom:auto;left:auto;flex-direction:column}.defaultClass .defaultClass__push ~ .defaultClass__push{margin-bottom:0;margin-top:8px}\n"
                    : "";
                },
              },
              {
                key: "setUniqueID",
                value: function () {
                  this.options.uniqueID = (function (t) {
                    for (
                      var e = "abcdefghijklmnopqrstuvwxyz", a = "", n = 0;
                      n < 6;
                      n++
                    )
                      a += e.charAt(Math.floor(Math.random() * e.length));
                    return a;
                  })();
                },
              },
              {
                key: "add",
                value:
                  ((s = e(
                    l().mark(function t(e) {
                      var a, n, s;
                      return l().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                return (
                                  (a = e.options.layout.css),
                                  (n = e.data.template),
                                  this.appendStyles(a, n),
                                  (e.options = v(
                                    {
                                      defaultClass: this.options.defaultClass,
                                      uniqueID: this.options.uniqueID,
                                    },
                                    e.options,
                                  )),
                                  (e.methods = v(
                                    {
                                      removeStyles:
                                        this.removeStyles.bind(this),
                                    },
                                    e.methods,
                                  )),
                                  (s = new b(e)),
                                  (t.next = 8),
                                  this.makeDOM(null, null, s)
                                );
                              case 8:
                                return t.abrupt("return", s);
                              case 9:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                      );
                    }),
                  )),
                  function (t) {
                    return s.apply(this, arguments);
                  }),
              },
              {
                key: "appendStyles",
                value: function (t, e) {
                  var a = this,
                    n = Boolean(e || t),
                    s = t;
                  if (!n) return null;
                  if (((s += this.setPosition()), this.appendedStyles[e]))
                    return this.appendedStyles[e];
                  ["defaultClass", "uniqueID"].forEach(function (t) {
                    var e = new RegExp(t, "g");
                    s = s.replace(e, a.options[t]);
                  });
                  var o,
                    i,
                    r,
                    l =
                      ((o = s),
                      (i = document.createTextNode(o)),
                      (r = document.createElement("style")).appendChild(i),
                      document.head.appendChild(r));
                  return (this.appendedStyles[e] = l), l;
                },
              },
              {
                key: "removeStyles",
                value: function (t) {
                  var e = this.appendedStyles[t];
                  e &&
                    (e.parentElement.removeChild(e),
                    delete this.appendedStyles[t]);
                },
              },
              {
                key: "makeDOM",
                value:
                  ((a = e(
                    l().mark(function t(e, a, n) {
                      var s,
                        o,
                        i,
                        r = this;
                      return l().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                if (
                                  ((s = e || n.options.layout.dom),
                                  (o = a || document.createElement("div")),
                                  "object" === c(s))
                                ) {
                                  t.next = 4;
                                  break;
                                }
                                return t.abrupt("return");
                              case 4:
                                if (
                                  (Object.entries(s).forEach(function (t) {
                                    var e = d(t, 2),
                                      a = e[0],
                                      s = e[1],
                                      i = n.options.layout.props[a] || {},
                                      l = i.makeIf;
                                    if (
                                      (l = "function" !== c(l) || l.call(n))
                                    ) {
                                      var u = i.unique;
                                      if (u) {
                                        var p = r.getValue(i.attributes.id, n),
                                          f = document.getElementById(p);
                                        if (f)
                                          return void (s && r.makeDOM(s, f, n));
                                      }
                                      for (
                                        var h = i.tagName || "div",
                                          g = r.getValue(i.repeat, n) || 1,
                                          m = function (t) {
                                            var e = document.createElement(h),
                                              a = i.assign,
                                              l = i.attributes,
                                              p = i.content,
                                              f = i.listeners;
                                            l && (e = r.setAttributes(e, l, n)),
                                              f &&
                                                Object.entries(f).forEach(
                                                  function (t) {
                                                    var a = d(t, 2),
                                                      s = a[0],
                                                      o = a[1],
                                                      i = n.methods[o];
                                                    switch (c(o)) {
                                                      case "string":
                                                        "function" ==
                                                          typeof i &&
                                                          e.addEventListener(
                                                            s,
                                                            function (t) {
                                                              i.call(
                                                                this,
                                                                t,
                                                                n,
                                                              );
                                                            },
                                                          );
                                                        break;
                                                      case "function":
                                                        e.addEventListener(
                                                          s,
                                                          function (t) {
                                                            o.call(this, t, n);
                                                          },
                                                        );
                                                    }
                                                  },
                                                );
                                            var g = r.getValue(p, n);
                                            void 0 !== g && (e.textContent = g),
                                              void 0 !== a &&
                                                (u
                                                  ? (n.dataBus[a] = e)
                                                  : (n[a] = e)),
                                              o.appendChild(e),
                                              s && r.makeDOM(s, e, n);
                                          },
                                          A = 0;
                                        A < g;
                                        A++
                                      )
                                        m();
                                    }
                                  }),
                                  s !== n.options.layout.dom)
                                ) {
                                  t.next = 16;
                                  break;
                                }
                                if (
                                  ((i = o.firstElementChild),
                                  n.renderElement || (n.renderElement = i),
                                  !i || document.documentElement.contains(i))
                                ) {
                                  t.next = 16;
                                  break;
                                }
                                if (!this.options.isAfterBody) {
                                  t.next = 14;
                                  break;
                                }
                                return (t.next = 12), h(i);
                              case 12:
                                t.next = 16;
                                break;
                              case 14:
                                return (t.next = 16), f(i);
                              case 16:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                      );
                    }),
                  )),
                  function (t, e, n) {
                    return a.apply(this, arguments);
                  }),
              },
              {
                key: "setAttributes",
                value: function (t, e, a) {
                  var n = this;
                  return (
                    Object.entries(e).forEach(function (e) {
                      var s = d(e, 2),
                        o = s[0],
                        i = s[1],
                        r = n.getValue(i, a);
                      void 0 !== r && t.setAttribute(o, r);
                    }),
                    t
                  );
                },
              },
            ]),
            t
          );
        })();
        function E() {
          return I.apply(this, arguments);
        }
        function I() {
          return (
            (I = e(
              l().mark(function t() {
                var e,
                  a,
                  n,
                  s,
                  o,
                  i,
                  r,
                  u,
                  d = arguments;
                return l().wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (
                          ((e = d.length > 0 && void 0 !== d[0] ? d[0] : {}),
                          !(a = d.length > 1 ? d[1] : void 0).closed)
                        ) {
                          t.next = 4;
                          break;
                        }
                        return t.abrupt("return");
                      case 4:
                        return (
                          (a.closed = !0),
                          !e.doNotSendEvent &&
                            a.data.closeEventUrl &&
                            a.sendEvent(a.data.closeEventUrl),
                          (n = e.transitionEndProp),
                          (t.next = 9),
                          a.hide({ transitionEndProp: n })
                        );
                      case 9:
                        if (
                          (a.remove(),
                          (s = a.dataBus),
                          (o = s.adsBy),
                          (i = s.main),
                          (r = s.units),
                          (u = r.findIndex(function (t) {
                            return t === a;
                          })),
                          r.splice(u, 1),
                          !(r.length > 0) && i)
                        ) {
                          t.next = 16;
                          break;
                        }
                        return t.abrupt("return");
                      case 16:
                        x(o, function () {
                          var t;
                          a.dataBus.units.length ||
                            a.methods.removeStyles(a.data.template),
                            null === (t = i.parentElement) ||
                              void 0 === t ||
                              t.removeChild(i),
                            delete a.dataBus.main;
                        }),
                          i.classList.add(a.options.defaultClass + "_hidden"),
                          i.removeAttribute("id");
                      case 20:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            )),
            I.apply(this, arguments)
          );
        }
        const k = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{direction:ltr;position:fixed;bottom:52px;right:16px;display:flex;flex-direction:column-reverse;width:364px;font-family:'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}.defaultClass.defaultClass_scrollable-doc{right:0}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 364px + 20px);padding:1px;background:rgba(225,225,225,0.7) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4AQMAAACSSKldAAAABlBMVEXq6urs7OwykcR+AAAAAnRSTlPMzIMO2+EAAABqSURBVBjTfY1BDoAwCASnpDHGk/6gT+EJPomDDzcxKG1KnAOwmwUAxVlg7XQxpJLR+Kd5YHUt3geTQ6kEuyGP/RnJsuJ0wTOuGANCjo3ZnSD/Jd1c2hTJjfKqa3qhCkZCixaYV6tsAJXgBhc5CZP2d+O8AAAAAElFTkSuQmCC) repeat;opacity:1;will-change:left;cursor:default;-webkit-font-smoothing:antialiased}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px)}}.defaultClass__push:not(.defaultClass_close-mousedown):active{transform:perspective(700px) rotateX(9deg) rotateY(-3deg)}.defaultClass__push.defaultClass_started{left:0;max-height:600px;transition:transform 0.15s cubic-bezier(0, 0, 0.2, 1),left .5s cubic-bezier(0, 0, 0.2, 1);transform-origin:30% 50%;will-change:transform, left, opacity}.defaultClass__push.defaultClass_hidden{left:calc(100% + 16px + 364px + 20px);max-height:0;opacity:0;transition:left .1s ease-in,opacity .1s ease-in,max-height 0.3s ease-in;transition-delay:0s,0s,.1s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-bottom:0;transition:margin-bottom 0.3s ease-in;transition-delay:.3s}.defaultClass__push.defaultClass_clicked{left:0;transform-origin:40% 50%;transform:scale(0.55) perspective(700px) rotateX(9deg) rotateY(-3deg);opacity:0;transition:transform 0.15s linear,opacity 0.3s ease-in,max-height 0.3s ease-in;transition-delay:0s, 0s, .3s}.defaultClass__push.defaultClass_clicked+.defaultClass__push{margin-bottom:0;transition:margin-bottom 0.3s ease-in;transition-delay:.3s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__image{width:362px;height:180px}.defaultClass__header{position:relative;display:flex;width:100%;align-items:center;padding:18px 15px 10px}.defaultClass__app-icon{width:16px;height:16px;margin-right:8px;background:#5f6368 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBRJREFUeNqcVVtoXEUY/mbOOXtxs9u1bmLMdRPBoJRmtUK8QRIrKKIQhD5UFBP0ofVCWsUHHwrGB30o2CCIvki2PogEShIELepDYvtiFbKBtgRS4rYxapJu9pzN3s5txjlnu2lkzzatP8w5M2fO/33zf/PPPwS3sGtHX4uK1xDLb/Vy20qwYtH9Tv1+EH8gTUMNc2I43fHFabUeBqkHzE3zmK2poyyfc/re3lSCFNkjWiQpCMcEUXpXguUjryaIpk5ZmUwczMbtmnT3PaocazwuSJJ1CRbfODzM1v+ZoPk8JEpxp0aDd0Fuunek86tvkzUECyOHEmzt73kiwBVJgiLCJ4TcMYmQCkrzfdsk7jL7Zz6IXjG3pnR1EzZjlcY5/o9xvQxbzZ4S+xh3xrLzyJvlY+P7IvGPlhgoEY0TUOb0idscM5pbQXseBBPExl+rgHpRzIkVOw2k0qfOigkY2YzKTcEJ4TZInNWv5K//oZUL0SM/X8Nz6U0EHYkk2ZUKLR2QXx5BoPdxrGg+l6yxgSFsXYVx+XPI2gVIMoEsU/h9BIpCIEmCUgmBhDu7nAiGVL0QtcEw+VQHeleyaGOVSHhLO/ae+BhnllrxXXLnflD0dXfjzf5PIC+eQMT8HYogccJwA3YeVBcdfZRulLRemzPX7XqQ4/sD7cjZDKYg8b/yegV8oXazf10mOPmjD6TnPUjBMIhPJIVyo1X7KCRowdITVSdH37P7Y9gI+VBsbkEo8aQneNUurhIsaY0oh/t2gMs3+xIbqEn2Eix8/fT9kNvj25rfyi4JEhZsqwDKFNs7X1kyaDFfqHGabwniSt9Dt5/7UsDzu14qgVq8thyY4ttMOIemyO5nIR7jAiTjOcecZKE2T3tNzq1fhiVvimypT9IlwB/ttOAv/VaHgKcoNew5z0mx4R+mJvHOQYZ9rdwT/O2DNuTMGSh83ZOgpPOUTGw+Len2hO2Xan44uzovnl/i0xeHkV4LuhtaleVAu4HVlR/QwCY9wS2hfKnMT7sejademjAivuF6UkR9ITzf9gjaQzFY4m7IbmZx4c95TD+cRUzJevrk8mx2T/8vg24tIhYbE1EMiSiiXj+rRgHfLJ+rDGwOopUx1h1AzKeJ6uaRPQaHtsXGtqvp+vvTablgHhdy7Z6TpoU2UW/e6ioJcOYpTUa1xzteOD/rXkTVicJPi6nw4ANXmSINuYfFOy2EsOIg7g+gO5DxBFdzdrL52fNHb1atHbbx7lTSp+kjQi7PS5ybNp4ISejfm6vNmDLHesYab3zm3Miul37TyaE4U6jILHmA+W6sQRRAXtSx8FgAcWXtP3rnC2y2WOZjVVl2JdhJxCkZZX4pwXRz4FBMwWc9KnTdEOcEKQE+axh8xgu4av8KMACM0MJI/Z3WSAAAAABJRU5ErkJggg==) center/12px auto no-repeat;pointer-events:none}.defaultClass__app-name{flex:1 1 auto;margin-top:-2px;font-size:12px;line-height:1;letter-spacing:-0.05px;color:#000;-webkit-font-smoothing:antialiased;pointer-events:none}.defaultClass__app-name::selection{background-color:transparent}.defaultClass__app-name::-moz-selection{background-color:transparent}.defaultClass__body{display:flex;align-items:flex-start;max-height:140px;padding:6px 15px 15px;pointer-events:none}.defaultClass__icon{flex:0 0 60px;width:60px;height:60px;margin-right:16px}.defaultClass__text{flex:1 1 auto;min-width:0}.defaultClass__title{max-height:40px;margin-bottom:-1px;font-weight:600;font-size:15px;line-height:20px;overflow:hidden;color:#000}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:40px;font-size:15px;line-height:20px;color:#5b5b5b;overflow:hidden}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__domain{margin-top:1px;margin-bottom:1px;font-size:12px;line-height:24px;text-overflow:ellipsis;color:#5b5b5b;overflow:hidden;white-space:nowrap}.defaultClass__domain::selection{background-color:transparent}.defaultClass__domain::-moz-selection{background-color:transparent}.defaultClass__settings-dropdown{display:none;position:absolute;top:18px;right:43px;width:14px;height:14px;padding:0;background:none;border-style:none;outline:none;cursor:default}.defaultClass__settings-dropdown::before{content:'';position:absolute;top:6px;left:6px;width:2px;height:2px;background:#aaa;box-shadow:-4px 0 0 0 #aaa, 4px 0 0 0 #aaa}.defaultClass__settings-dropdown:hover::before,.defaultClass__settings-dropdown:hover::after{background:#888;box-shadow:-4px 0 0 0 #888, 4px 0 0 0 #888}.defaultClass__push:hover .defaultClass__settings-dropdown{display:block}.defaultClass__close{position:absolute;right:21px;top:19px;width:14px !important;height:14px !important;padding:0 !important;background:none !important;border-style:none;outline:none !important;cursor:default !important}.defaultClass__close:hover{background:none !important;border-color:inherit !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:12px;height:1.25px;background:#717172;transform:rotate(45deg);top:6px;left:0}.defaultClass__close:hover::before,.defaultClass__close:hover::after{background:#262626}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__adsby{top:100%;right:0;margin-top:10px;outline:none}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  image: null,
                  header: {
                    appIcon: null,
                    appName: null,
                    settingsDropdown: null,
                    close: null,
                  },
                  body: {
                    icon: null,
                    text: { title: null, desc: null, domain: null },
                  },
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    var t = this,
                      e = this.options.defaultClass,
                      a = (function (t) {
                        if (!t) return null;
                        var e = document.createElement("div");
                        return (
                          (e.style.cssText =
                            "position: fixed; left: 0; right: 0"),
                          document.body.appendChild(e),
                          new ResizeObserver(function () {
                            var e = document.documentElement,
                              a = e.clientHeight,
                              n = e.scrollHeight;
                            t(n > a);
                          }).observe(e),
                          e
                        );
                      })(function (a) {
                        var n;
                        null === (n = t.dataBus.main) ||
                          void 0 === n ||
                          n.classList[a ? "add" : "remove"](
                            "".concat(e, "_scrollable-doc"),
                          );
                      });
                    return (
                      this.callbacks.onremove.push(function () {
                        var t;
                        return null === (t = a.parentElement) || void 0 === t
                          ? void 0
                          : t.removeChild(a);
                      }),
                      e
                    );
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick" },
              },
              image: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__image";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.imageUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.imageUrl;
                },
              },
              header: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__header";
                  },
                },
              },
              appIcon: {
                tagName: "span",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-icon";
                  },
                },
              },
              appName: {
                tagName: "span",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-name";
                  },
                },
                content: "Google Chrome",
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              domain: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return "" !== this.data.domain
                      ? this.options.defaultClass + "__domain"
                      : this.options.defaultClass;
                  },
                },
                content: function () {
                  return "" !== this.data.domain ? this.data.domain : null;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              settingsDropdown: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__settings-dropdown";
                  },
                  tabindex: -1,
                  title: "Settings",
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { mousedown: "closeMousedown", click: "closeClick" },
              },
            },
            callbacks: {
              onstart: [
                function () {
                  var t = this;
                  if (
                    !1 !== this.data.sound &&
                    !this.dataBus.playing &&
                    this.options.soundOn
                  ) {
                    this.dataBus.playing = !0;
                    try {
                      var e = new Audio(
                        "data:audio/aac;base64,//FQgBcioCERRQAUUAFG+aEKWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWl7/8VCAF0KgIRFFABRQAUb5sQpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWl7/8VCAF0KgIRFFABRQAUb5sQpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWl7/8VCAF0KgISmUwHztaOSAgICeUkjEUwHztaWUpf/gAgJ5SkHvb4QQpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpeD/8VCAJ+JgIUvYgAzl3//8OHl44Bushl5iSBI9tMM2FcZduRz5DTVMVMECaWz0pkABsO+o03eEATLFBCICCALw1rV4AyXMEBAGhD+DpgAAFYwQO1L4gjM5+4//afSg/9Hx8KN9p7IGEJrCRrZMlqNpROAgmUus/vsfJfjqd07mK0vVhZQEM/vyXmDx4Qn6yWbuxI24VN1IeF/Ip/QT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",
                      );
                      e.addEventListener("ended", function () {
                        t.dataBus.playing = !1;
                      }),
                        e.play();
                    } catch (t) {
                      this.dataBus.playing = !1;
                    }
                  }
                },
              ],
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              closeMousedown: function (t, e) {
                e.renderElement.classList.add(
                  e.options.defaultClass + "_close-mousedown",
                ),
                  window.addEventListener(
                    "mouseup",
                    function t() {
                      e.renderElement.classList.remove(
                        e.options.defaultClass + "_close-mousedown",
                      ),
                        window.removeEventListener("mouseup", t, !1);
                    },
                    !1,
                  );
              },
              smartRemove: E,
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button)
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          _ = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetX: 0;direction:ltr;position:fixed;bottom:16px;right:16px;display:flex;flex-direction:column-reverse;width:344px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}@media (max-width: 494px){.defaultClass{top:16px;bottom:auto;flex-direction:column}.defaultClass .defaultClass__push ~ .defaultClass__push{margin-bottom:0;margin-top:8px}}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 344px + 20px);max-height:110px;padding:8px;background:#efeeec;border-radius:10px;box-shadow:0 0 6px 2px rgba(0,0,0,0.12),0 0 2px 0 rgba(0,0,0,0.17),0 0 1px 0 rgba(0,0,0,0.22),inset 0 0 0 1px rgba(242,241,239,0.95);opacity:.94;will-change:left;cursor:default;transition:left .3s ease}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px)}}.defaultClass__push.defaultClass_started{left:var(--pushOffsetX);transition:left .3s ease;will-change:opacity}.defaultClass__push.defaultClass_dragging{transition:left 0s linear}.defaultClass__push.defaultClass_drag-right{left:calc(100% + 16px + 344px + 20px);transition:left .25s ease}.defaultClass__push.defaultClass_hidden{max-height:0;opacity:0;padding:0;transition:opacity .23s ease,padding .23s ease,max-height .23s ease;transition-delay:0s,.23s,.23s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-top:0;transition:margin-top .23s ease;transition-delay:.23s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__body{display:flex;padding:2px 3px 0}.defaultClass__text{flex:1 1 auto;min-width:0;padding-bottom:3px;padding-right:15px}.defaultClass__title{font-size:13px;line-height:18px;font-weight:600;letter-spacing:-0.02px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514;pointer-events:none}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__domain{margin-bottom:1px;font-size:13px;line-height:18px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514;pointer-events:none}.defaultClass__domain::selection{background-color:transparent}.defaultClass__domain::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:32px;font-size:13px;line-height:16px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;pointer-events:none}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 34px;width:34px;height:34px;margin-right:8px;border-radius:4px;margin-top:5px}.defaultClass__close{position:absolute;top:8px;right:5px;width:21px !important;height:21px !important;background:none !important;border-radius:20px !important;padding:0 !important;border-style:none;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:inherit !important;border-color:inherit !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.5px;left:6px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:.94;transition:opacity .1s ease-in}.defaultClass__adsby{bottom:100%;right:4px}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  body: {
                    icon: null,
                    text: { title: null, domain: null, desc: null },
                  },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick", mousedown: "startDragPush" },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              domain: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return "" !== this.data.domain
                      ? this.options.defaultClass + "__domain"
                      : this.options.defaultClass;
                  },
                },
                content: function () {
                  return "" !== this.data.domain ? this.data.domain : null;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              smartRemove: E,
              startDragPush: function (t, e) {
                (e.mouseStartX = t.pageX),
                  e.renderElement.classList.add(
                    e.options.defaultClass + "_dragging",
                  );
                var a = function (t) {
                  e.methods.dragPush(t, e);
                };
                (e.mousemoveCallback = a),
                  document.documentElement.addEventListener("mousemove", a);
                var n = function (t) {
                  t.preventDefault(), e.methods.finishDragPush(t, e);
                };
                (e.mouseupCallback = n),
                  document.documentElement.addEventListener("mouseup", n);
              },
              dragPush: function (t, e) {
                if ("mouseStartX" in e) {
                  var a = Math.floor(t.pageX - e.mouseStartX);
                  a < -10 && (a = -10),
                    (e.closeDirection = a > 50 && "_drag-right"),
                    e.renderElement.style.setProperty(
                      "--pushOffsetX",
                      "".concat(a, "px"),
                    );
                }
              },
              finishDragPush: function (t, e) {
                e.renderElement.classList.remove(
                  e.options.defaultClass + "_dragging",
                ),
                  document.documentElement.removeEventListener(
                    "mouseup",
                    e.mouseupCallback,
                  ),
                  document.documentElement.removeEventListener(
                    "mousemove",
                    e.mousemoveCallback,
                  ),
                  delete e.mouseStartX,
                  e.closeDirection
                    ? ((t.transitionEndProp = "max-height"),
                      x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : e.renderElement.style.setProperty("--pushOffsetX", "0");
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button) &&
                  !e.closeDirection
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          B = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetY: 0;--pushOffsetX: 0;direction:ltr;position:fixed;top:8px;left:8px;right:8px;display:flex;max-width:556px;margin:auto;flex-direction:column;align-items:center;font-family:-apple-system, BlinkMacSystemFont, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__block-scroll{overflow:hidden}.defaultClass__push{position:sticky;bottom:100%;width:100%;max-height:600px;transform:translateY(-100%) translateY(-8px) translateY(-20px);padding:10px;background-color:rgba(170,171,171,0.07);background-repeat:repeat;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWRJREFUeNrsVttyhDAIzWH8//6tr6e7XTEQiBovfeiU2dUMJMDhFjHP81cpKCu9luTCeT+ogjdzEer+HzmLI3tm3R9l4oyqfrP2HumSn78qhdFBu2bQrSTOm3aN5qAVKvCAmpWP0iVZ3WDi2RpVJs6hRkHzsjqCJGLBMDZ2aHjR4VsH+XnrOoOL+pYIxWxCp2icEhhZgxSN7s0co63MshO2BR3gnSVz44tuybxxOXaVXHZz5xFqSpjluOQlj47CYBw75xnz9/pNeePnADZ5xbYgYidw4bFF3IZ6M5xHQg0/UEBXseIKAvHceTKFwohuYjYiLxtNOoJwU05wNJc8a7XtPCQ5vgtpGz4bUkWcOsfBSj6CuJnzsttOtya7Kp7CFfckmXEq54tnJM/RunQvbT7kAN21eNUYD06xypf0jh0uMAxvleGC4g3FlV6Lj5H/tpNycS4MH8SvI977Avk3/NcMfwswAGTxdNTgwCVoAAAAAElFTkSuQmCC);background-size:30px 30px;border-radius:12px;box-shadow:0 0 28px 0 rgba(0,0,0,0.09);overflow:hidden;will-change:bottom;cursor:default}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}}.defaultClass__push.defaultClass_started{bottom:0;transform:translateY(var(--pushOffsetY)) translateX(var(--pushOffsetX));transition:bottom 700ms ease-out,transform 700ms ease-out}.defaultClass_swiping .defaultClass__push{transition:transform 0s linear}.defaultClass__push.defaultClass_swipe-single-up{transform:translateY(-100%) translateY(-8px) translateY(-20px);transition:transform .25s ease-out}.defaultClass__push.defaultClass_swipe-left{transform:translateY(var(--pushOffsetY)) translateX(-100%) translateX(-8px) translateX(-20px);transition:transform .25s ease-out}.defaultClass__push.defaultClass_hidden{max-height:0;transition:max-height .25s ease-out}.defaultClass__push ~ .defaultClass__push{margin-top:8px}.defaultClass__header{display:flex;width:100%;margin-bottom:1px;align-items:center;pointer-events:none}.defaultClass__app-icon{width:20px;height:20px;margin-right:7px;background:url(data:image/png;base64,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) center/20px auto no-repeat;border-radius:5px}.defaultClass__app-name{flex:1 1 auto;font-size:13px;line-height:1;font-weight:400;text-transform:uppercase;color:#666563}.defaultClass__app-name::selection{background-color:transparent}.defaultClass__app-name::-moz-selection{background-color:transparent}.defaultClass__time-ago{margin-right:30px;padding:0 5px;font-size:13px;color:#767777;opacity:1;will-change:opacity;transition:opacity .1s ease-in}.defaultClass__time-ago::selection{background-color:transparent}.defaultClass__time-ago::-moz-selection{background-color:transparent}.defaultClass__body{display:flex;align-items:flex-end;padding:8px 2px 2px;pointer-events:none}.defaultClass__text{flex:1 1 auto;min-width:0}.defaultClass__title{margin-bottom:1px;font-size:15px;line-height:18px;font-weight:600;letter-spacing:-0.02px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:36px;font-size:15px;line-height:18px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 34px;width:34px;height:34px;margin-left:8px;border-radius:4px}.defaultClass__close{position:absolute;top:11px;right:5px;width:21px !important;height:21px !important;background:none !important;padding:0 !important;border-style:none;border-radius:20px !important;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border-color:inherit !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.5px;left:6px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:1;transition:opacity .1s ease-in}.defaultClass__adsby{bottom:100%;right:4px;padding:1px;font-size:7px;line-height:1}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  header: { appIcon: null, appName: null, timeAgo: null },
                  body: { text: { title: null, desc: null }, icon: null },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: {
                  click: "unitClick",
                  touchstart: "startSwipePush",
                  touchmove: "swipePush",
                  touchend: "finishSwipePush",
                  touchcancel: "finishSwipePush",
                },
              },
              header: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__header";
                  },
                },
              },
              appIcon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-icon";
                  },
                },
              },
              appName: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-name";
                  },
                },
                content: "Safari",
              },
              timeAgo: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__time-ago";
                  },
                },
                content: function () {
                  return this.data.timeAgo || "now";
                },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            callbacks: { onstart: [] },
            methods: {
              smartRemove: E,
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              getPointerPos: function (t) {
                var e = t.targetTouches;
                return e.length > 1 ? null : e[0];
              },
              startSwipePush: function (t, e) {
                var a = e.methods.getPointerPos(t);
                a &&
                  ((e.touchStartX = a.pageX),
                  (e.touchStartY = a.pageY),
                  e.dataBus.main.classList.add(
                    e.options.defaultClass + "_swiping",
                  ),
                  document.body.classList.add(
                    e.options.defaultClass + "__block-scroll",
                  ));
              },
              swipePush: function (t, e) {
                var a = e.methods.getPointerPos(t);
                if (a) {
                  var n = Math.floor(a.pageX - e.touchStartX),
                    s = Math.floor(a.pageY - e.touchStartY);
                  "horDirection" in e ||
                    (e.horDirection = Math.abs(n) > Math.abs(s)),
                    e.horDirection
                      ? (n > 20 && (n = 20),
                        (e.closeDirection = n < -50 && "_swipe-left"),
                        e.renderElement.style.setProperty(
                          "--pushOffsetX",
                          "".concat(n, "px"),
                        ))
                      : (1 === e.dataBus.units.length &&
                          (s > 20 && (s = 20),
                          (e.closeDirection = s < -30 && "_swipe-single-up")),
                        e.dataBus.main.style.setProperty(
                          "--pushOffsetY",
                          "".concat(s, "px"),
                        ));
                }
              },
              finishSwipePush: function (t, e) {
                e.dataBus.main.classList.remove(
                  e.options.defaultClass + "_swiping",
                ),
                  document.body.classList.remove(
                    e.options.defaultClass + "__block-scroll",
                  ),
                  delete e.horDirection,
                  e.closeDirection
                    ? (x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : (e.dataBus.main.style.setProperty("--pushOffsetY", "0"),
                      e.renderElement.style.setProperty("--pushOffsetX", "0"));
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button)
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank");
                  } catch (t) {}
                  (t.doNotSendEvent = !0), e.methods.smartRemove(t, e);
                }
              },
            },
          },
          W = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetY: 0;--pushOffsetX: 0;direction:ltr;position:fixed;top:0;left:0;right:0;display:flex;max-width:556px;margin:auto;flex-direction:column;align-items:center;font-family:Roboto, Ubuntu, 'Fira Sans', 'Droid Sans', sans-serif;z-index:2147483647}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:sticky;bottom:100%;width:100%;max-height:600px;transform:translateY(-100%) translateY(0) translateY(-20px);background-color:white;box-shadow:0 40px 40px 20px rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.3);overflow:hidden;will-change:bottom;cursor:default}.defaultClass__push.defaultClass_started{bottom:0;transform:translateY(var(--pushOffsetY)) translateX(var(--pushOffsetX));transition:bottom 700ms ease-out,transform 700ms ease-out}.defaultClass_swiping .defaultClass__push{transition:transform 0s linear}.defaultClass__push.defaultClass_swipe-single-up{transform:translateY(-100%) translateY(0) translateY(-20px);transition:transform .25s ease-out}.defaultClass__push.defaultClass_swipe-left{transform:translateY(var(--pushOffsetY)) translateX(-100%) translateX(0) translateX(-20px);transition:transform .25s ease-out}.defaultClass__push.defaultClass_hidden{max-height:0;transition:max-height .25s ease-out}.defaultClass__header{display:flex;flex-wrap:nowrap;width:100%;height:32px;padding:16px 16px 0;align-items:center;font-size:13px;line-height:1.333;letter-spacing:-.4px;color:#757575;pointer-events:none}.defaultClass__app-icon{flex-shrink:0;width:16px;height:16px;margin-right:8px;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MiA0MiI+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBkPSJNMzcuNTUgMjIuMjloMTJBMjAuNDYgMjAuNDYgMCAwMTUxIDMwYTIwLjI5IDIwLjI5IDAgMDEtNi4wNyAxNC43N0EyMC4xOCAyMC4xOCAwIDAxMzAuMjUgNTFsOC42MS0xNC44NUExMC43MyAxMC43MyAwIDAwNDAuNzUgMzBhMTAuNTEgMTAuNTEgMCAwMC0zLjItNy43MXpNMjQuNjMgMzUuMzdhNy41MSA3LjUxIDAgMDEwLTEwLjc0IDcuNTEgNy41MSAwIDAxMTAuNzQgMCA3LjUxIDcuNTEgMCAwMTAgMTAuNzQgNy41MSA3LjUxIDAgMDEtMTAuNzQgMHptLTUuMDUtOC4wOGwtNi0xMC40MWEyMSAyMSAwIDAxNy4yMi01Ljc5QTIwLjY4IDIwLjY4IDAgMDEzMCA5YTIwLjQ2IDIwLjQ2IDAgMDExMC40NiAyLjc5IDIwLjY2IDIwLjY2IDAgMDE3LjU5IDcuNTVIMzAuOWE0LjE2IDQuMTYgMCAwMC0uOS0uMDkgMTAuNTIgMTAuNTIgMCAwMC02LjYgMi4yNiAxMC4zMyAxMC4zMyAwIDAwLTMuODIgNS43OHptMTMuMjkgMTMuMDVsLTYgMTAuNDFhMjAuNDYgMjAuNDYgMCAwMS0xMi43NS03QTIwLjIxIDIwLjIxIDAgMDE5IDMwYTIwLjgzIDIwLjgzIDAgMDEyLjcxLTEwLjM0bDguNTMgMTQuOTNBMTAuODMgMTAuODMgMCAwMDI0LjE4IDM5IDEwLjM4IDEwLjM4IDAgMDAzMCA0MC43NWExMC4yNiAxMC4yNiAwIDAwMi44Ny0uNDF6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM3NTc1NzUiLz48L2NsaXBQYXRoPjwvZGVmcz48cGF0aCBkPSJNMjguNTQ5IDEzLjI5MWgxMS45OThhMjAuNDkgMjAuNDkgMCAwMTEuNDUgNy43MSAyMC4yOTMgMjAuMjkzIDAgMDEtNi4wNyAxNC43NyAyMC4xNzUgMjAuMTc1IDAgMDEtMTQuNjc4IDYuMjNsOC42MDktMTQuODVhMTAuNzI1IDEwLjcyNSAwIDAwMS44OS02LjE1IDEwLjUxNSAxMC41MTUgMCAwMC0zLjE5OS03Ljcxek0xNS42MyAyNi4zNzFhNy41MSA3LjUxIDAgMDEwLTEwLjc0IDcuNTA3IDcuNTA3IDAgMDExMC43MzkgMCA3LjUxIDcuNTEgMCAwMTAgMTAuNzQgNy41MSA3LjUxIDAgMDEtMTAuNzM5IDB6bS01LjA0OS04LjA4bC02LTEwLjQxYTIxIDIxIDAgMDE3LjIyLTUuNzkgMjAuNjU1IDIwLjY1NSAwIDAxOS4xOTgtMi4wOSAyMC40NSAyMC40NSAwIDAxMTAuNDU5IDIuNzkgMjAuNjYxIDIwLjY2MSAwIDAxNy41ODkgNy41NUgyMS44OTlhNC4xMjcgNC4xMjcgMCAwMC0uOS0uMDljLTIuMzkyLS4wMi00LjcyLjc3OC02LjU5OSAyLjI2YTEwLjMzIDEwLjMzIDAgMDAtMy44MTkgNS43OHptMTMuMjg4IDEzLjA1bC01Ljk5OSAxMC40MWEyMC40NTkgMjAuNDU5IDAgMDEtMTIuNzQ5LTcgMjAuMjEzIDIwLjIxMyAwIDAxLTUuMTE5LTEzLjc1IDIwLjgxNiAyMC44MTYgMCAwMTIuNzEtMTAuMzRsOC41MjkgMTQuOTNhMTAuODMgMTAuODMgMCAwMDMuOTM5IDQuNDEgMTAuMzggMTAuMzggMCAwMDUuODE5IDEuNzVjLjk3MSAwIDEuOTM3LS4xMzggMi44Ny0uNDF6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiM3NTc1NzUiLz48ZyBjbGlwLXBhdGg9InVybCgjYSkiIHRyYW5zZm9ybT0ibWF0cml4KC45OTk4OCAwIDAgMSAtOC45OTYgLTkpIj48cGF0aCBmaWxsPSIjNzU3NTc1IiBkPSJNOC45OTcgOC45OTloNDIuMDA1djQySDguOTk3di00MnoiLz48L2c+PC9zdmc+) center/16px auto no-repeat}.defaultClass__app-name{flex:0 0 auto;max-width:50%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.defaultClass__app-name::selection{background-color:transparent}.defaultClass__app-name::-moz-selection{background-color:transparent}.defaultClass__domain{flex:0 1 auto;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.defaultClass__domain::before{content:'';display:inline-block;vertical-align:middle;width:3px;height:3px;min-width:3px;margin-left:5px;margin-right:5px;border-radius:3px;background-color:#757575}.defaultClass__time-ago{flex:0 0 auto}.defaultClass__time-ago::selection{background-color:transparent}.defaultClass__time-ago::-moz-selection{background-color:transparent}.defaultClass__time-ago::before{content:'';display:inline-block;vertical-align:middle;width:3px;height:3px;min-width:3px;margin-left:5px;margin-right:5px;border-radius:3px;background-color:#757575}.defaultClass__time-ago::after{content:'';display:inline-block;width:5px;height:5px;vertical-align:middle;margin-left:5px;border-right:1.25px solid #757575;border-bottom:1.25px solid #757575;transform:translateY(-2px) rotate(45deg)}.defaultClass__body{padding:6px 16px 14px;pointer-events:none}.defaultClass__text-icon-row{display:flex;align-items:flex-end}.defaultClass__text{flex:1 1 auto;min-width:0;line-height:20px}.defaultClass__title{font-size:14px;font-weight:400;letter-spacing:-0.02px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#212121}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{display:-webkit-box;max-height:36px;font-size:14px;color:#757575;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 40px;width:40px;height:40px;margin-top:-1px;margin-left:16px}.defaultClass__image{width:100%;height:auto;max-height:40vh;margin-top:16px}.defaultClass__footer{padding:21px 16px;font-weight:500;font-size:14px;line-height:1;text-transform:uppercase;color:#757575;background-color:#eeeeee}.defaultClass__close{position:absolute;top:15px;right:9px;width:21px !important;height:21px !important;background:none !important;padding:0 !important;border-style:none;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border-color:inherit !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.5px;left:6px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:1;transition:opacity .1s ease-in}.defaultClass__adsby{bottom:100%;right:4px;padding:1px;font-size:7px;line-height:1}.defaultClass__block-scroll{overflow:hidden}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  header: {
                    appIcon: null,
                    appName: null,
                    domain: null,
                    timeAgo: null,
                  },
                  body: {
                    textIconRow: {
                      text: { title: null, desc: null },
                      icon: null,
                    },
                    image: null,
                  },
                  footer: null,
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: {
                  click: "unitClick",
                  touchstart: "startSwipePush",
                  touchmove: "swipePush",
                  touchend: "finishSwipePush",
                  touchcancel: "finishSwipePush",
                },
              },
              header: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__header";
                  },
                },
              },
              appIcon: {
                tagName: "span",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-icon";
                  },
                  style: function () {
                    if (this.data.appIcon)
                      return "background: url(".concat(
                        this.data.appIcon,
                        ") center / 16px auto no-repeat",
                      );
                  },
                },
              },
              appName: {
                tagName: "span",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__app-name";
                  },
                },
                content: function () {
                  return this.data.appName || "Chrome";
                },
              },
              domain: {
                tagName: "span",
                attributes: {
                  class: function () {
                    return "" !== this.data.domain
                      ? this.options.defaultClass + "__domain"
                      : this.options.defaultClass;
                  },
                },
                content: function () {
                  return this.data.domain ? this.data.domain : null;
                },
              },
              timeAgo: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__time-ago";
                  },
                },
                content: function () {
                  return this.data.timeAgo || "now";
                },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              textIconRow: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text-icon-row";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              image: {
                tagName: "img",
                attributes: {
                  alt: "",
                  class: function () {
                    return this.options.defaultClass + "__image";
                  },
                  src: function () {
                    return this.data.imageUrl;
                  },
                },
                makeIf: function () {
                  return this.data.imageUrl;
                },
              },
              footer: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__footer";
                  },
                },
                content: function () {
                  return this.data.footer || "SITE SETTINGS";
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            callbacks: {
              onstart: [
                function () {
                  var t = this;
                  if (
                    !1 !== this.data.sound &&
                    !this.dataBus.playing &&
                    this.options.soundOn
                  ) {
                    this.dataBus.playing = !0;
                    try {
                      var e = new Audio(
                        "data:audio/aac;base64,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",
                      );
                      e.addEventListener("ended", function () {
                        t.dataBus.playing = !1;
                      }),
                        e.play();
                    } catch (t) {
                      this.dataBus.playing = !1;
                    }
                  }
                },
              ],
            },
            methods: {
              smartRemove: E,
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              getPointerPos: function (t) {
                var e = t.targetTouches;
                return e.length > 1 ? null : e[0];
              },
              startSwipePush: function (t, e) {
                var a = e.methods.getPointerPos(t);
                a &&
                  ((e.touchStartX = a.pageX),
                  (e.touchStartY = a.pageY),
                  e.dataBus.main.classList.add(
                    e.options.defaultClass + "_swiping",
                  ),
                  document.body.classList.add(
                    e.options.defaultClass + "__block-scroll",
                  ));
              },
              swipePush: function (t, e) {
                var a = e.methods.getPointerPos(t);
                if (a) {
                  var n = Math.floor(a.pageX - e.touchStartX),
                    s = Math.floor(a.pageY - e.touchStartY);
                  "horDirection" in e ||
                    (e.horDirection = Math.abs(n) > Math.abs(s)),
                    e.horDirection
                      ? (n > 20 && (n = 20),
                        (e.closeDirection = n < -50 && "_swipe-left"),
                        e.renderElement.style.setProperty(
                          "--pushOffsetX",
                          "".concat(n, "px"),
                        ))
                      : (1 === e.dataBus.units.length &&
                          (s > 20 && (s = 20),
                          (e.closeDirection = s < -30 && "_swipe-single-up")),
                        e.dataBus.main.style.setProperty(
                          "--pushOffsetY",
                          "".concat(s, "px"),
                        ));
                }
              },
              finishSwipePush: function (t, e) {
                e.dataBus.main.classList.remove(
                  e.options.defaultClass + "_swiping",
                ),
                  document.body.classList.remove(
                    e.options.defaultClass + "__block-scroll",
                  ),
                  delete e.horDirection,
                  e.closeDirection
                    ? (x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : (e.dataBus.main.style.setProperty("--pushOffsetY", "0"),
                      e.renderElement.style.setProperty("--pushOffsetX", "0"));
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button)
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank");
                  } catch (t) {}
                  (t.doNotSendEvent = !0), e.methods.smartRemove(t, e);
                }
              },
            },
          },
          D = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetX: 0;direction:ltr;position:fixed;bottom:16px;right:16px;display:flex;flex-direction:column-reverse;width:390px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}@media (max-width: 494px){.defaultClass{left:16px;width:auto;top:16px;bottom:auto;flex-direction:column}.defaultClass .defaultClass__push ~ .defaultClass__push{margin-bottom:0;margin-top:8px}}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 390px + 20px);max-height:120px;padding:8px;background:#fff;border-radius:10px;box-shadow:0 0 6px 2px rgba(0,0,0,0.12),0 0 2px 0 rgba(0,0,0,0.17),0 0 1px 0 rgba(0,0,0,0.22),inset 0 0 0 1px rgba(242,241,239,0.95);opacity:.94;will-change:left;cursor:default;transition:left .3s ease}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px)}}.defaultClass__push.defaultClass_started{left:var(--pushOffsetX);transition:left .3s ease;will-change:opacity}.defaultClass__push.defaultClass_dragging{transition:left 0s linear}.defaultClass__push.defaultClass_drag-right{left:calc(100% + 16px + 390px + 20px);transition:left .25s ease}.defaultClass__push.defaultClass_hidden{max-height:0;opacity:0;padding:0;transition:opacity .23s ease,padding .23s ease,max-height .23s ease;transition-delay:0s,.23s,.23s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-top:0;transition:margin-top .23s ease;transition-delay:.23s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__body{display:flex;padding:2px 3px 0}.defaultClass__text{min-width:0;padding-bottom:3px;padding-right:15px}.defaultClass__title{font-size:17px;line-height:18px;font-weight:600;letter-spacing:-0.02px;display:-webkit-box;text-overflow:ellipsis;overflow:hidden;color:#141514;pointer-events:none}@media (max-width: 428px){.defaultClass__title{-webkit-line-clamp:2;-webkit-box-orient:vertical}}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:32px;font-size:16px;line-height:16px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;pointer-events:none}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 90px;width:90px;height:90px;margin-right:8px;border-radius:4px;background-repeat:no-repeat !important}@media (max-width: 428px){.defaultClass__icon{flex:0 0 65px;width:65px;height:65px}}.defaultClass__close{position:absolute;top:8px;right:5px;width:21px !important;height:21px !important;background:none !important;border-radius:20px !important;padding:0 !important;border:1px solid #141514 !important;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border:1px solid #141514 !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.4px;left:4.5px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:.94;transition:opacity .1s ease-in}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  body: { icon: null, text: { title: null, desc: null } },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick", mousedown: "startDragPush" },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              smartRemove: E,
              startDragPush: function (t, e) {
                (e.mouseStartX = t.pageX),
                  e.renderElement.classList.add(
                    e.options.defaultClass + "_dragging",
                  );
                var a = function (t) {
                  e.methods.dragPush(t, e);
                };
                (e.mousemoveCallback = a),
                  document.documentElement.addEventListener("mousemove", a);
                var n = function (t) {
                  t.preventDefault(), e.methods.finishDragPush(t, e);
                };
                (e.mouseupCallback = n),
                  document.documentElement.addEventListener("mouseup", n);
              },
              dragPush: function (t, e) {
                if ("mouseStartX" in e) {
                  var a = Math.floor(t.pageX - e.mouseStartX);
                  a < -10 && (a = -10),
                    (e.closeDirection = a > 50 && "_drag-right"),
                    e.renderElement.style.setProperty(
                      "--pushOffsetX",
                      "".concat(a, "px"),
                    );
                }
              },
              finishDragPush: function (t, e) {
                e.renderElement.classList.remove(
                  e.options.defaultClass + "_dragging",
                ),
                  document.documentElement.removeEventListener(
                    "mouseup",
                    e.mouseupCallback,
                  ),
                  document.documentElement.removeEventListener(
                    "mousemove",
                    e.mousemoveCallback,
                  ),
                  delete e.mouseStartX,
                  e.closeDirection
                    ? ((t.transitionEndProp = "max-height"),
                      x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : e.renderElement.style.setProperty("--pushOffsetX", "0");
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button) &&
                  !e.closeDirection
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          Q = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetX: 0;direction:ltr;position:fixed;bottom:16px;top:auto;right:16px;display:flex;flex-direction:column-reverse;width:390px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}@media (max-width: 494px){.defaultClass{left:16px;width:auto}}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 390px + 20px);max-height:120px;padding:8px;background:#fff;border-radius:10px;box-shadow:0 0 6px 2px rgba(0,0,0,0.12),0 0 2px 0 rgba(0,0,0,0.17),0 0 1px 0 rgba(0,0,0,0.22),inset 0 0 0 1px rgba(242,241,239,0.95);opacity:.94;will-change:left;cursor:default;transition:left .3s ease}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px)}}.defaultClass__push.defaultClass_started{left:var(--pushOffsetX);transition:left .3s ease;will-change:opacity}.defaultClass__push.defaultClass_dragging{transition:left 0s linear}.defaultClass__push.defaultClass_drag-right{left:calc(100% + 16px + 390px + 20px);transition:left .25s ease}.defaultClass__push.defaultClass_hidden{max-height:0;opacity:0;padding:0;transition:opacity .23s ease,padding .23s ease,max-height .23s ease;transition-delay:0s,.23s,.23s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-top:0;transition:margin-top .23s ease;transition-delay:.23s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__body{display:flex;padding:2px 3px 0}.defaultClass__text{min-width:0;padding-bottom:3px;padding-right:15px}.defaultClass__title{font-size:17px;line-height:18px;font-weight:600;letter-spacing:-0.02px;display:-webkit-box;text-overflow:ellipsis;overflow:hidden;color:#141514;pointer-events:none}@media (max-width: 428px){.defaultClass__title{-webkit-line-clamp:2;-webkit-box-orient:vertical}}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:32px;font-size:16px;line-height:16px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;pointer-events:none}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 90px;width:90px;height:90px;margin-right:8px;border-radius:4px;background-repeat:no-repeat !important}@media (max-width: 428px){.defaultClass__icon{flex:0 0 65px;width:65px;height:65px}}.defaultClass__close{position:absolute;top:8px;right:5px;width:21px !important;height:21px !important;background:none !important;border-radius:20px !important;padding:0 !important;border:1px solid #141514 !important;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border:1px solid #141514 !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.4px;left:4.5px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:.94;transition:opacity .1s ease-in}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  body: { icon: null, text: { title: null, desc: null } },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick", mousedown: "startDragPush" },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              smartRemove: E,
              startDragPush: function (t, e) {
                (e.mouseStartX = t.pageX),
                  e.renderElement.classList.add(
                    e.options.defaultClass + "_dragging",
                  );
                var a = function (t) {
                  e.methods.dragPush(t, e);
                };
                (e.mousemoveCallback = a),
                  document.documentElement.addEventListener("mousemove", a);
                var n = function (t) {
                  t.preventDefault(), e.methods.finishDragPush(t, e);
                };
                (e.mouseupCallback = n),
                  document.documentElement.addEventListener("mouseup", n);
              },
              dragPush: function (t, e) {
                if ("mouseStartX" in e) {
                  var a = Math.floor(t.pageX - e.mouseStartX);
                  a < -10 && (a = -10),
                    (e.closeDirection = a > 50 && "_drag-right"),
                    e.renderElement.style.setProperty(
                      "--pushOffsetX",
                      "".concat(a, "px"),
                    );
                }
              },
              finishDragPush: function (t, e) {
                e.renderElement.classList.remove(
                  e.options.defaultClass + "_dragging",
                ),
                  document.documentElement.removeEventListener(
                    "mouseup",
                    e.mouseupCallback,
                  ),
                  document.documentElement.removeEventListener(
                    "mousemove",
                    e.mousemoveCallback,
                  ),
                  delete e.mouseStartX,
                  e.closeDirection
                    ? ((t.transitionEndProp = "max-height"),
                      x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : e.renderElement.style.setProperty("--pushOffsetX", "0");
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button) &&
                  !e.closeDirection
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          N = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetX: 0;direction:ltr;position:fixed;bottom:16px;right:16px;display:flex;flex-direction:column-reverse;width:344px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}@media (max-width: 494px){.defaultClass{top:16px;bottom:auto;flex-direction:column}.defaultClass .defaultClass__push ~ .defaultClass__push{margin-bottom:0;margin-top:8px}}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 344px + 20px);max-height:110px;padding:8px;background:#efeeec;border-radius:10px;box-shadow:0 0 6px 2px rgba(0,0,0,0.12),0 0 2px 0 rgba(0,0,0,0.17),0 0 1px 0 rgba(0,0,0,0.22),inset 0 0 0 1px rgba(242,241,239,0.95);opacity:.94;will-change:left;cursor:default;transition:left .3s ease}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px)}}.defaultClass__push.defaultClass_started{left:var(--pushOffsetX);transition:left .3s ease;will-change:opacity}.defaultClass__push.defaultClass_dragging{transition:left 0s linear}.defaultClass__push.defaultClass_drag-right{left:calc(100% + 16px + 344px + 20px);transition:left .25s ease}.defaultClass__push.defaultClass_hidden{max-height:0;opacity:0;padding:0;transition:opacity .23s ease,padding .23s ease,max-height .23s ease;transition-delay:0s,.23s,.23s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-top:0;transition:margin-top .23s ease;transition-delay:.23s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__body{display:flex;padding:2px 3px 0}.defaultClass__text{flex:1 1 auto;min-width:0;padding-bottom:3px;padding-right:15px}.defaultClass__title{font-size:13px;line-height:18px;font-weight:600;letter-spacing:-0.02px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514;pointer-events:none}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__domain{text-align:right;margin-bottom:1px;font-size:13px;line-height:18px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514;pointer-events:none}.defaultClass__domain::selection{background-color:transparent}.defaultClass__domain::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:32px;font-size:13px;line-height:16px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;pointer-events:none}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 34px;width:34px;height:34px;margin-right:8px;border-radius:4px;margin-top:5px}.defaultClass__close{position:absolute;top:8px;right:5px;width:21px !important;height:21px !important;background:none !important;border-radius:20px !important;padding:0 !important;border-style:none;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border-color:inherit !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.5px;left:6px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:.94;transition:opacity .1s ease-in}.defaultClass__adsby{bottom:100%;right:4px}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  body: {
                    icon: null,
                    text: { title: null, desc: null, domain: null },
                  },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick", mousedown: "startDragPush" },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              domain: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return "" !== this.data.domain
                      ? this.options.defaultClass + "__domain"
                      : this.options.defaultClass;
                  },
                },
                content: function () {
                  return "" !== this.data.domain ? this.data.domain : null;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              smartRemove: E,
              startDragPush: function (t, e) {
                (e.mouseStartX = t.pageX),
                  e.renderElement.classList.add(
                    e.options.defaultClass + "_dragging",
                  );
                var a = function (t) {
                  e.methods.dragPush(t, e);
                };
                (e.mousemoveCallback = a),
                  document.documentElement.addEventListener("mousemove", a);
                var n = function (t) {
                  t.preventDefault(), e.methods.finishDragPush(t, e);
                };
                (e.mouseupCallback = n),
                  document.documentElement.addEventListener("mouseup", n);
              },
              dragPush: function (t, e) {
                if ("mouseStartX" in e) {
                  var a = Math.floor(t.pageX - e.mouseStartX);
                  a < -10 && (a = -10),
                    (e.closeDirection = a > 50 && "_drag-right"),
                    e.renderElement.style.setProperty(
                      "--pushOffsetX",
                      "".concat(a, "px"),
                    );
                }
              },
              finishDragPush: function (t, e) {
                e.renderElement.classList.remove(
                  e.options.defaultClass + "_dragging",
                ),
                  document.documentElement.removeEventListener(
                    "mouseup",
                    e.mouseupCallback,
                  ),
                  document.documentElement.removeEventListener(
                    "mousemove",
                    e.mousemoveCallback,
                  ),
                  delete e.mouseStartX,
                  e.closeDirection
                    ? ((t.transitionEndProp = "max-height"),
                      x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : e.renderElement.style.setProperty("--pushOffsetX", "0");
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button) &&
                  !e.closeDirection
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          M = {
            css: ".defaultClass__adsby{position:absolute;padding:2px;font-size:8px;line-height:12px;text-decoration:none;color:rgba(0,0,0,0.35);text-shadow:1px 1px 0 rgba(255,255,255,0.5);opacity:1;transition:opacity .23s ease-out}.defaultClass__adsby::selection{background-color:transparent}.defaultClass__adsby::-moz-selection{background-color:transparent}.defaultClass_hidden .defaultClass__adsby{opacity:0}.defaultClass{--pushOffsetX: 0;direction:ltr;position:fixed;bottom:16px;right:16px;display:flex;flex-direction:column-reverse;width:344px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;z-index:2147483647}@media (max-width: 494px){.defaultClass{top:16px;bottom:auto;flex-direction:column}.defaultClass .defaultClass__push ~ .defaultClass__push{margin-bottom:0;margin-top:8px}}.defaultClass *,.defaultClass *::before,.defaultClass *::after{box-sizing:border-box}.defaultClass__push{position:relative;left:calc(100% + 16px + 344px + 20px);max-height:110px;padding:8px;background:#efeeec;border-radius:10px;box-shadow:0 0 6px 2px rgba(0,0,0,0.12),0 0 2px 0 rgba(0,0,0,0.17),0 0 1px 0 rgba(0,0,0,0.22),inset 0 0 0 1px rgba(242,241,239,0.95);opacity:.94;will-change:left;cursor:default;transition:left .3s ease}@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)){.defaultClass__push{-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px)}}.defaultClass__push.defaultClass_started{left:var(--pushOffsetX);transition:left .3s ease;will-change:opacity}.defaultClass__push.defaultClass_dragging{transition:left 0s linear}.defaultClass__push.defaultClass_drag-right{left:calc(100% + 16px + 344px + 20px);transition:left .25s ease}.defaultClass__push.defaultClass_hidden{max-height:0;opacity:0;padding:0;transition:opacity .23s ease,padding .23s ease,max-height .23s ease;transition-delay:0s,.23s,.23s}.defaultClass__push.defaultClass_hidden+.defaultClass__push{margin-top:0;transition:margin-top .23s ease;transition-delay:.23s}.defaultClass__push ~ .defaultClass__push{margin-bottom:8px}.defaultClass__body{display:flex;padding:2px 3px 0}.defaultClass__text{flex:1 1 auto;min-width:0;padding-bottom:3px;padding-right:15px}.defaultClass__title{font-size:13px;line-height:18px;font-weight:600;letter-spacing:-0.02px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#141514;pointer-events:none}.defaultClass__title::selection{background-color:transparent}.defaultClass__title::-moz-selection{background-color:transparent}.defaultClass__desc{max-height:32px;font-size:13px;line-height:16px;color:#141514;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;pointer-events:none}.defaultClass__desc::selection{background-color:transparent}.defaultClass__desc::-moz-selection{background-color:transparent}.defaultClass__icon{flex:0 0 34px;width:34px;height:34px;margin-right:8px;border-radius:4px;margin-top:5px}.defaultClass__close{position:absolute;top:8px;right:5px;width:21px !important;height:21px !important;background:none !important;border-radius:20px !important;padding:0 !important;border-style:none;opacity:.94;transition:none;outline:none !important;will-change:opacity;cursor:default !important}.defaultClass__close:hover{background:none !important;border-color:inherit !important}.defaultClass__close:active{background:#e0dfdd !important}.defaultClass__close::before,.defaultClass__close::after{content:'';position:absolute;width:9px;height:1.25px;background:#5c5b5a;transform:rotate(45deg);top:9.5px;left:6px}.defaultClass__close::after{transform:rotate(-45deg)}.defaultClass__push:hover .defaultClass__close{opacity:.94;transition:opacity .1s ease-in}.defaultClass__adsby{bottom:100%;right:4px}\n",
            dom: {
              inPagePush: {
                adsBy: null,
                push: {
                  body: { icon: null, text: { title: null, desc: null } },
                  close: null,
                },
              },
            },
            props: {
              inPagePush: {
                assign: "main",
                attributes: {
                  class: function () {
                    return this.options.defaultClass;
                  },
                  id: function () {
                    return this.options.uniqueID;
                  },
                },
                unique: !0,
              },
              adsBy: {
                assign: "adsBy",
                tagName: "a",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__adsby";
                  },
                  href: function () {
                    return this.options.adsBy.href;
                  },
                  id: function () {
                    return this.options.uniqueID + "-adsby";
                  },
                  target: "_blank",
                  tabindex: -1,
                },
                content: function () {
                  return this.options.adsBy.content;
                },
                unique: !0,
              },
              push: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__push";
                  },
                },
                assign: "renderElement",
                listeners: { click: "unitClick", mousedown: "startDragPush" },
              },
              body: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__body";
                  },
                },
              },
              text: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__text";
                  },
                },
              },
              title: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__title";
                  },
                },
                content: function () {
                  return this.data.title;
                },
              },
              desc: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__desc";
                  },
                },
                content: function () {
                  return this.data.desc;
                },
              },
              icon: {
                tagName: "div",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__icon";
                  },
                  style: function () {
                    return "background: url(".concat(
                      this.data.iconUrl,
                      ") center/cover",
                    );
                  },
                },
                makeIf: function () {
                  return this.data.iconUrl;
                },
              },
              close: {
                tagName: "button",
                attributes: {
                  class: function () {
                    return this.options.defaultClass + "__close";
                  },
                  "data-button": "",
                  tabindex: -1,
                },
                listeners: { click: "closeClick" },
              },
            },
            methods: {
              closeClick: function (t, e) {
                (t.transitionEndProp = "max-height"),
                  e.methods.smartRemove(t, e);
              },
              smartRemove: E,
              startDragPush: function (t, e) {
                (e.mouseStartX = t.pageX),
                  e.renderElement.classList.add(
                    e.options.defaultClass + "_dragging",
                  );
                var a = function (t) {
                  e.methods.dragPush(t, e);
                };
                (e.mousemoveCallback = a),
                  document.documentElement.addEventListener("mousemove", a);
                var n = function (t) {
                  t.preventDefault(), e.methods.finishDragPush(t, e);
                };
                (e.mouseupCallback = n),
                  document.documentElement.addEventListener("mouseup", n);
              },
              dragPush: function (t, e) {
                if ("mouseStartX" in e) {
                  var a = Math.floor(t.pageX - e.mouseStartX);
                  a < -10 && (a = -10),
                    (e.closeDirection = a > 50 && "_drag-right"),
                    e.renderElement.style.setProperty(
                      "--pushOffsetX",
                      "".concat(a, "px"),
                    );
                }
              },
              finishDragPush: function (t, e) {
                e.renderElement.classList.remove(
                  e.options.defaultClass + "_dragging",
                ),
                  document.documentElement.removeEventListener(
                    "mouseup",
                    e.mouseupCallback,
                  ),
                  document.documentElement.removeEventListener(
                    "mousemove",
                    e.mousemoveCallback,
                  ),
                  delete e.mouseStartX,
                  e.closeDirection
                    ? ((t.transitionEndProp = "max-height"),
                      x(e.renderElement, function () {
                        return e.methods.smartRemove(t, e);
                      }),
                      e.renderElement.classList.add(
                        e.options.defaultClass + e.closeDirection,
                      ))
                    : e.renderElement.style.setProperty("--pushOffsetX", "0");
              },
              unitClick: function (t, e) {
                var a;
                if (
                  e.data.clickUrl &&
                  void 0 ===
                    (null === (a = t.target.dataset) || void 0 === a
                      ? void 0
                      : a.button) &&
                  !e.closeDirection
                ) {
                  try {
                    window.open(e.data.clickUrl, "_blank"),
                      e.renderElement.classList.add(
                        e.options.defaultClass + "_clicked",
                      );
                  } catch (t) {}
                  (t.doNotSendEvent = !0),
                    (t.transitionEndProp = "max-height"),
                    e.methods.smartRemove(t, e);
                }
              },
            },
          },
          S = {
            counters: {
              domain: "__ipcntd",
              page: "__ipcntp",
              iframePage: "__ipcntip",
              max: "__ipcntm",
            },
            appInfo: { os: 1, browser: 1, device: 0, adSample: 0 },
            freq: {
              qty: 2,
              period: 86400,
              scheme: "time",
              distances: null,
              distance: 60,
              context: "domain",
              hashed: !0,
              pagelim: 0,
              max: 0,
            },
            pageGroup: "abcdefgh",
            unitOptions: {
              adsBy: { content: "", href: "" },
              soundOn: !1,
              ignoredBetterJs: [],
            },
          };
        function O(t) {
          var e = document.createElement("script"),
            a = t.message,
            n = "[[denied]]";
          try {
            n = navigator.userAgent;
          } catch (t) {}
          (a += "\nVersion: 1.0.2"),
            (a += "\nURL: " + window.location.href),
            (e.src =
              "//ptekuwiny.pro/jsinfo?msg=" +
              encodeURIComponent(a) +
              "&ua=" +
              encodeURIComponent(n) +
              "&tags=in-page-push"),
            document.head.appendChild(e);
        }
        var R = function t(e, a) {
          var n;
          return (
            t.prototype.instance
              ? (n = t.prototype.instance)
              : ((n = Object.create(t.prototype)),
                (t.prototype.instance = n),
                n._init()),
            1 === arguments.length
              ? n.get(e)
              : 2 === arguments.length
                ? (n.set(e, a), a)
                : n
          );
        };
        R.prototype = {
          _list: {},
          _isAvailableMessage: void 0,
          _isAvailableResult: void 0,
          _isAvailable: function (t) {
            if (void 0 !== this._isAvailableResult)
              return this._isAvailableResult;
            var e = !1,
              a = {};
            try {
              a = window.localStorage;
              var n = "__storage_test__";
              return (
                a.setItem(n, n),
                a.removeItem(n),
                (this._isAvailableMessage =
                  "true: " + a.getItem(n) + "; from: " + t),
                (this._isAvailableResult = !0),
                !0
              );
            } catch (n) {
              this._isAvailableMessage = "catch";
              var s =
                "undefined" != typeof DOMException && n instanceof DOMException;
              return (
                (this._isAvailableResult =
                  s &&
                  (22 === n.code ||
                    1014 === n.code ||
                    "QuotaExceededError" === n.name ||
                    "NS_ERROR_DOM_QUOTA_REACHED" === n.name) &&
                  a &&
                  0 !== a.length),
                (e = this._isAvailableResult) &&
                  (this._isAvailableMessage =
                    "Result: TRUE. Details: e.isDOMException - " +
                    s +
                    "; e.code - " +
                    n.code +
                    "; e.name - " +
                    n.name +
                    "; storage - " +
                    a +
                    (a ? "; storage.length - " + a.length : "") +
                    "; FROM... " +
                    t +
                    "!"),
                e
              );
            }
          },
          _init: function () {
            "onstorage" in window &&
              window.addEventListener("storage", this._storageEvent.bind(this));
          },
          subscribe: function (t, e) {
            return (
              void 0 !== t &&
                "function" == typeof e &&
                (Object.prototype.hasOwnProperty.call(this._list, t) ||
                  (this._list[t] = []),
                this._list[t].push(e)),
              this
            );
          },
          _storageEvent: function (t) {
            var e = this,
              a = t || window.event;
            Object.prototype.hasOwnProperty.call(this._list, a.key) &&
              this._list[a.key].forEach(function (t) {
                t(e.get(a.key), a);
              });
          },
          get: function (t) {
            if (this._isAvailable("get")) {
              var e;
              try {
                e = window.localStorage.getItem(t);
              } catch (s) {
                var a, n;
                try {
                  a = window.localStorage.getItem("__storage_test__");
                } catch (e) {
                  return (
                    (n = ""),
                    "object" === c(e)
                      ? ((n += "Message: " + e.message),
                        (n += "\nStack: " + e.stack),
                        (n += "\nerr.code: " + e.code),
                        (n += "\nerr.name: " + e.name))
                      : (n += "Error is not an object, it's " + c(e)),
                    (n += "\ntestValue: " + a),
                    (n += "\nname: " + t),
                    (n += "\n_isAvailableResult: " + this._isAvailableResult),
                    this._isAvailableResult &&
                      (n +=
                        "\n_isAvailableMessage: " + this._isAvailableMessage),
                    void O({ message: n })
                  );
                }
                return (
                  "object" === c(s)
                    ? ((n += "Message: " + s.message),
                      (n += "\nStack: " + s.stack),
                      (n += "\nerror.code: " + s.code),
                      (n += "\nerror.name: " + s.name))
                    : (n += "Error is not an object, it's " + c(s)),
                  void O({ message: (n += "\nvalue: " + e) })
                );
              }
              var s = {
                0: function () {
                  return null;
                },
                n: function (t) {
                  return Number(t);
                },
                b: function (t) {
                  return "true" === t;
                },
                d: function (t) {
                  return new Date(t);
                },
                f: function (t) {
                  return Function("return " + t)();
                },
              };
              return e && /^:[bdfn0]:/.test(e)
                ? s[e.slice(1, 2)](e.slice(3))
                : JSON.parse(e);
            }
          },
          set: function (t, e) {
            if (!this._isAvailable("set")) return this;
            var a = {
                Null: "0",
                Date: "d",
                Number: "n",
                Boolean: "b",
                Function: "f",
              },
              n = Object.prototype.toString.call(e).split(/\s|]/)[1],
              s = e;
            if (Object.prototype.hasOwnProperty.call(a, n)) {
              switch (a[n]) {
                case "d":
                case "f":
                  s = s.toString();
                  break;
                default:
                  s = JSON.stringify(s);
              }
              s = ":" + a[n] + ":" + s;
            } else s = JSON.stringify(s);
            return localStorage.setItem(t, s), this;
          },
        };
        const U = R,
          L = function () {
            return Math.floor(new Date().getTime() / 1e3);
          },
          F = {
            getPageCounter: function (t, e) {
              return (
                this.getCounter(t)[this.getHash(e)] || {
                  counter: 0,
                  expire:
                    this.localCounters.loadedTime +
                    parseInt(this.settings.freq.period, 10),
                }
              );
            },
            getHash: function (t) {
              if (this.settings.hash) return this.settings.hash.substr(0, 8);
              var e,
                a = t || this.settings.freq.context;
              if ("domain" === a) return this.settings.pageGroup;
              var n = "",
                s = window.location,
                o = s.hash,
                i = s.pathname,
                r = s.search;
              if ("iframe-page" === a && document.referrer) {
                var l = document.referrer;
                (n = (n = /^(?:[^:/?#]+:)?(?:\/\/([^/?#]*))/i.exec(l))
                  ? n[1]
                  : ""),
                  (i = (i = /^(?:[^:/?#]+:)?(?:\/\/[^/?#]*)?([^?#]*)/i.exec(l))
                    ? i[1]
                    : ""),
                  (r = (r =
                    /^(?:[^:/?#]+:)?(?:\/\/[^/?#]*)?[^?#]*(\?[^#]*)/i.exec(l))
                    ? r[1]
                    : ""),
                  (o = (o =
                    /^(?:[^:/?#]+:)?(?:\/\/[^/?#]*)?[^?#]*(?:\?[^#]*)?(#.*)/i.exec(
                      l,
                    ))
                    ? o[1]
                    : "");
              }
              return (
                "#" ===
                  (e = n + i + r + (this.settings.freq.hashed ? o : "")).slice(
                    -1,
                  ) && (e = e.slice(0, -1)),
                e || (e = "0"),
                (function (t) {
                  var e,
                    a,
                    n = 0,
                    s = t.toString();
                  if (0 !== s.length)
                    for (e = 0, a = s.length; e < a; e++)
                      (n = (n << 5) - n + s.charCodeAt(e)), (n |= 0);
                  var o = "00000000";
                  return (Math.abs(n).toString(16) + o + o + o + o).substr(
                    0,
                    32,
                  );
                })(e).substr(0, 8)
              );
            },
            getCounter: function () {
              var t =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : this.getContextCounterName(),
                e = U(t);
              return this.actualizeCounter(e);
            },
            getCounterValue: function (t, e) {
              return this.getPageCounter(t, e).counter || 0;
            },
            getCounterTotalValue: function (t) {
              var e = this.getCounter(t);
              return Object.keys(e).reduce(function (t, a) {
                return t + e[a].counter || 0;
              }, 0);
            },
            setCounter: function (t, e, a, n) {
              var s = this.getCounter(t),
                o = this.getHash(a),
                i = s[o] || (s[o] = {}),
                r = L();
              return (
                (i.counter = void 0 === n ? 0 : n),
                (i.last = r),
                (i.expire = e
                  ? r + e
                  : i.expire || r + parseInt(this.settings.freq.period, 10)),
                this.updateCounter(t, s),
                s
              );
            },
            calcCounter: function (t, e, a, n) {
              var s = this.getCounter(t),
                o = this.getHash(a),
                i = s[o] || (s[o] = {}),
                r = L(),
                l = void 0 === n ? 1 : n;
              return (
                (i.counter = (i.counter || 0) + l),
                (i.last = r),
                (i.expire =
                  (e ? r + parseInt(e, 10) : i.expire) ||
                  r + parseInt(this.settings.freq.period, 10)),
                this.updateCounter(t, s),
                i.counter
              );
            },
            updateCounter: function (t, e) {
              var a = this.actualizeCounter(e);
              return U(t, a);
            },
            removePageCounter: function (t) {
              var e = this.getCounter(t),
                a = this.getHash();
              return e[a] && delete e[a], this.updateCounter(t, e);
            },
            removePageCounters: function (t) {
              var e = this;
              t.forEach(function (t) {
                e.removePageCounter(t);
              });
            },
            actualizeCounter: function (t) {
              var e = L();
              return (
                t &&
                  Object.entries(t).forEach(function (a) {
                    var n = d(a, 2),
                      s = n[0],
                      o = n[1];
                    e >= o.expire && delete t[s];
                  }),
                t || {}
              );
            },
            incContextCounters: function (t) {
              this.calcCounter(
                this.settings.counters.domain,
                null,
                "domain",
                t,
              ),
                this.calcCounter(this.settings.counters.page, null, "page", t),
                "iframe-page" === this.settings.freq.context &&
                  this.calcCounter(
                    this.settings.counters.iframePage,
                    null,
                    "iframe-page",
                    t,
                  );
            },
            getContextCounterName: function () {
              switch (this.settings.freq.context) {
                case "domain":
                  return this.settings.counters.domain;
                case "page":
                  return this.settings.counters.page;
                case "iframe-page":
                  return this.settings.counters.iframePage;
                default:
                  return "___def";
              }
            },
            getPeriodExpire: function () {
              return this.getPageCounter().expire;
            },
          };
        var P = [],
          j = (function () {
            function t(e) {
              n(this, t),
                i(this, "localCounters", { loadedTime: L() }),
                i(this, "nextUnitOptions", {}),
                i(this, "templates", {
                  1: _,
                  2: k,
                  3: B,
                  4: W,
                  5: D,
                  6: Q,
                  7: N,
                  8: M,
                }),
                i(this, "settings", S),
                i(this, "dataBus", { units: [] }),
                i(this, "onAdError", function (t) {
                  console.warn("error!", t);
                });
              try {
                if (this.checkOtherInpage(e.globalNameLoaded)) return;
                this.setGlobalVar(e.globalNameLoaded);
              } catch (t) {}
              this.copySettings(e),
                this.setLayout(),
                (this.settings.renderOptions.isAllowChangePosition =
                  this.checkAllowChangePosition()),
                (this.Renderer = new w(this.settings.renderOptions)),
                this.run();
            }
            var a;
            return (
              o(t, [
                {
                  key: "checkOtherInpage",
                  value: function (t) {
                    return window[t];
                  },
                },
                {
                  key: "setGlobalVar",
                  value: function (t) {
                    window[t] = !0;
                  },
                },
                {
                  key: "copySettings",
                  value: function (t) {
                    t && (this.settings = m(this.settings, t));
                  },
                },
                {
                  key: "setLayout",
                  value: function () {
                    var t;
                    0 !== this.settings.appInfo.adSample
                      ? (t = this.templates[this.settings.appInfo.adSample])
                      : 1 === this.settings.appInfo.device ||
                          2 === this.settings.appInfo.device
                        ? 4 === this.settings.appInfo.os
                          ? (t = W)
                          : 3 === this.settings.appInfo.os &&
                            (t = 5 === this.settings.appInfo.browser ? B : W)
                        : 1 === this.settings.appInfo.os
                          ? (t = k)
                          : ((t = _), (this.settings.appInfo.adSample = 1)),
                      (this.settings.unitOptions.layout = t);
                  },
                },
                {
                  key: "checkAllowChangePosition",
                  value: function () {
                    return (
                      -1 !==
                      [1, 5, 6, 7, 8].indexOf(this.settings.appInfo.adSample)
                    );
                  },
                },
                {
                  key: "run",
                  value: function () {
                    this.incContextCounters(0),
                      this.stopByEssential() ||
                        (this.scheduleNextUnit(), this.runSPASupport());
                  },
                },
                {
                  key: "addUnit",
                  value:
                    ((a = e(
                      l().mark(function t() {
                        var e;
                        return l().wrap(
                          function (t) {
                            for (;;)
                              switch ((t.prev = t.next)) {
                                case 0:
                                  return (
                                    (t.next = 2),
                                    this.Renderer.add(this.nextUnitOptions)
                                  );
                                case 2:
                                  if ((e = t.sent)) {
                                    t.next = 5;
                                    break;
                                  }
                                  return t.abrupt("return");
                                case 5:
                                  e.start(),
                                    this.dataBus.units.push(e),
                                    this.incContextCounters(),
                                    this.scheduleNextUnit();
                                case 9:
                                case "end":
                                  return t.stop();
                              }
                          },
                          t,
                          this,
                        );
                      }),
                    )),
                    function () {
                      return a.apply(this, arguments);
                    }),
                },
                {
                  key: "scheduleNextUnit",
                  value: function () {
                    var t = this.getTimeToNextUnit();
                    this.prepareNextUnit();
                    var e = t > 0 ? 1e3 * t : 0;
                    setTimeout(this.addUnit.bind(this), e);
                  },
                },
                {
                  key: "getTimeToNextUnit",
                  value: function () {
                    var t,
                      e = this.getPageCounter(),
                      a = this.settings.freq.distance,
                      n =
                        (null === (t = this.settings.freq.distances) ||
                        void 0 === t
                          ? void 0
                          : t.split(",")) || [],
                      s = e.counter || 0,
                      o = n.length ? Number(n[s] || n[n.length - 1]) : a,
                      i = e.expire,
                      r = (e.last || this.localCounters.loadedTime) + o,
                      l =
                        ((i && r > i) || this.isSchemeReached() ? i : r) - L();
                    return l > 0 ? l : 0;
                  },
                },
                {
                  key: "stopByEssential",
                  value: function () {
                    var t;
                    return (
                      !(null === (t = this.settings.units) || void 0 === t
                        ? void 0
                        : t.length) || this.isUrlStopping()
                    );
                  },
                },
                {
                  key: "isSchemeReached",
                  value: function () {
                    return (
                      this.isMaxReached() ||
                      this.isPageLimReached() ||
                      this.isQtyReached()
                    );
                  },
                },
                {
                  key: "isUrlStopping",
                  value: function () {
                    var t,
                      e = document.location.href,
                      a =
                        null === (t = this.settings.misc) || void 0 === t
                          ? void 0
                          : t.stopUrls;
                    return (
                      "string" == typeof a && (a = a.split()),
                      !(!a || !Array.isArray(a)) &&
                        a.some(function (t) {
                          return e.includes(t);
                        })
                    );
                  },
                },
                {
                  key: "prepareNextUnit",
                  value: function () {
                    var t = this,
                      e = this.settings,
                      a = e.units,
                      n = e.unitOptions,
                      s = n.layout,
                      o = s.callbacks,
                      i = s.methods,
                      r = this.getNextUnitIndex();
                    (this.nextUnitOptions = {
                      callbacks: o,
                      data: a[r],
                      dataBus: this.dataBus,
                      options: n,
                      methods: i,
                    }),
                      ["imageUrl"]
                        .reduce(function (e, a) {
                          var n = t.nextUnitOptions.data[a];
                          return n && e.push({ type: "image", url: n }), e;
                        }, [])
                        .forEach(function (t) {
                          var e = t.type,
                            a = t.url;
                          if (!P.includes(a)) {
                            var n = document.createElement("link");
                            n.setAttribute("rel", "preload"),
                              n.setAttribute("href", a),
                              n.setAttribute("as", e),
                              document.head.appendChild(n),
                              P.push(a);
                          }
                        });
                  },
                },
                {
                  key: "getNextUnitIndex",
                  value: function () {
                    var t = this.getCounterTotalValue();
                    return (
                      t === this.settings.freq.qty && (t = 0),
                      t % this.settings.units.length
                    );
                  },
                },
                {
                  key: "isMaxReached",
                  value: function () {
                    return (
                      !!this.settings.freq.max &&
                      this.getCounterTotalValue(
                        this.settings.counters.domain,
                      ) >= this.settings.freq.max
                    );
                  },
                },
                {
                  key: "isPageLimReached",
                  value: function () {
                    if (!this.settings.freq.pagelim) return !1;
                    var t = this.getCounterDataByContext(),
                      e = t.counterName,
                      a = t.context;
                    return (
                      this.getCounterValue(this.settings.counters[e], a) >=
                      this.settings.freq.pagelim
                    );
                  },
                },
                {
                  key: "isQtyReached",
                  value: function () {
                    var t = this.getCounterValue();
                    return t > 0 && t >= this.settings.freq.qty;
                  },
                },
                {
                  key: "getCounterDataByContext",
                  value: function () {
                    var t = {};
                    return (
                      "iframe-page" === this.settings.freq.context &&
                      document.referrer
                        ? ((t.counterName = "iframePage"),
                          (t.context = "iframe-page"))
                        : ((t.context = "page"), (t.counterName = "page")),
                      t
                    );
                  },
                },
                {
                  key: "runSPASupport",
                  value: function () {
                    var t = this;
                    window.addEventListener(
                      "hashchange",
                      function () {
                        -1 !== window.location.hash.indexOf("/") &&
                          ((t.localCounters.loadedTime = L()),
                          t.scheduleNextUnit());
                      },
                      !1,
                    );
                  },
                },
              ]),
              t
            );
          })();
        Object.assign(j.prototype, F);
        try {
          new j("undefined" == typeof options ? void 0 : options);
        } catch (t) {
          p(t, { situation: "app" });
        }
      })();
  })();
})({
  appInfo: { adSample: 0, browser: 1, device: 0, os: 1 },
  counters: {
    domain: "kadPD",
    iframePage: "kadPIP",
    max: "kadPM",
    page: "kadPP",
  },
  freq: { qty: 2, context: "page", distances: "0, 3", period: 3600 },
  globalNameLoaded: "bdd651",
  renderOptions: { top: false },
  scriptSrc:
    "/a.Wp5xwwYRWwdHl/Qk2U9/kuZ/T/9I6ybm2p5GlCScWZQT9MNZTPEJw-M-DTcbxrNMii0k1eMWTgAUwiN/zoES3R",
  unitOptions: { soundOn: false },
  units: [
    {
      adSample: "0",
      appName: "GOOGLE CHROME",
      clickUrl:
        "https://glum-mortgage.com/cBm.VCkDaEX_JGlHYI3JR-BLZMFNVOy_bQDR9SSTZ-XVZWlXbYn_ValbUcGdV-yfVgmhlil_dkzl0mwnJ-mpFqkrSsW_Qu9vNwTxg-3zMAzBUC2_JEmFNG0HP-WJ1K2LaMH_FOkPYQmRw-xTdUXVlWp_aYGZ9ajbZ-Gd9ejfMg2_Ui4jJknlB-hneoWp9q1_dsHtBulvc-mxNyszaAW_NCrDPETFA-mHcImJVKk_aMXNJOlPY-3RRSVTcUm_wW9XaYHZR-0bccHdMel_Mg0hEiljM-klYmlnMok_ZqzrLsmtN-svawWxNyr_LAmBFCsDa-WFVG4HcIH_JKlLcM3NM-uPYQ2R9St_JUTVJWGXZ-SZUaybRcl_9eEfRgVhQ-0jak2lUmz_JoTpNqGrZ-HtAulvMw0_RytzdAmBh-xDZEGFJGs_MIXJVK5La-WNhOvPYQ2_RSvTYUzVN-lXOYCZZay_ccmdlekfP-WhQi1jYkz_NmmnZompN-hrMsDtAux_Nw2xVyjzZ-DBVChDZEG_YG3HOIWJU-1LOMTNhOm_NQTRUSwTN-GVYW5XJYn_NapbZcDdM-9fJgnhNiz_PkTlUmmnc-3pQq9rMsS_Zu6vbw2x5-lzSAWBQC9_NETFEGwHM-DJcKxLNMg_",
      desc: "Shop now! Discover exclusive figurines and stickers on AliExpress! 🛒 ✨ ",
      domain: "",
      iconUrl:
        "https://glum-mortgage.com/caHbV-z.adGelftgZ_zi9jhkZlE-lnkoPpTqU_4sNtzuMv1-NxiyZzmAc_HCYD9EMFC-ZHmIcJnKY_9MMNCOZPp-bRWScT9Ua_HWRX0YcZH-MblcMd0eE_lgMhkiYjl-MlkmZn3od_3qcrusbtG-lvnwaxHyQ_tAYB2C9Dh-dFCG5HwIc_mK8LlMMNk-YPxQORDSg_0UMVzWgXl-MZkaYbzcM_TegfygOhT-QjlkMlkmY_1oOpDqcrz-MtjuNvfwN_DyUz2ANBm-UDuEZF2Gl_mIJJnKBLh-eNTO0PwQJ_nSBThUeVW-9X1YdZFaB_lccdkeNfs-ahWiNjrkP_TmAnmocpm-Vr2sPtTuA_mwcx2ylzk-MBzC0DmEc_3GMH9INJS-ZLzMdNDO0_xQJRnSpTv-bVmWVXJYZ_Da0b1cMdT-AfwgNhziE_2k",
      template: "web-push",
      timeAgo: "1m ago",
      title: "Anime merch awaits! 🎉 ",
    },
    {
      adSample: "0",
      appName: "GOOGLE CHROME",
      clickUrl:
        "https://glum-mortgage.com/ccmdV-k.afXgJhliY_3kRlBmZnF-VpyqbrDs9_SuZvXwZxl-bznAVBlCU_GEVFyGVHm-lJlKdLzM0_wOJPmQFRk-STWUQV9WN_TYgZ3aMbz-Ud4eJfmgN_0iPjWk1l2-anHoNpkqY_mswtxudvX-lxpyazHAV_kCaDWE1Fo-YHWIdJiKJ_nMBNhOePW-9R1SdTHUB_lWcXmYNZs-abWcNdreP_TgAhmicjm-VlkmanXoJ_lqYr3sRtV-cvmwwx9ya_HARB0CcDH-MFlGMH0IE_lKMLkMYNl-MPkQZRzSL_mUNVsWaXW-NZraLbmcF_seafWgVh4-cjHkJllmc_3oMpuqYr2-9ttuJvTwJ_GyZzSAUBy-RDlE9FEGR_VIQJ0KaL2-UNzOJPTQN_GSZTHUAVl-MX0YRZtad_mchdzeZfG-JhsiMjXkV_5manWohp1-ZrGslttua_GwFxnyYzi-ZByCcDmEl_kGPHWIQJ1-YLzMNNmOZ_mQNRhSMTD-AVxWNX2YV_jaZbDcVdh-ZfGgYh3iO_WkUl1mOnT-hpmqNrTsU_wuNvGwYx5-JznANBpCZ_DEMF9GJHn-NJzKPLTMU_mOcP3QQR9-MTSUZV6Wb_2Y5ZlaSbW-Qd9eNfTgE_wiMjDkclx-Nngo",
      desc: "Shop here! Dive into our collection of top anime merch on AliExpress! 🏷️ 🎌 ",
      domain: "",
      iconUrl:
        "https://glum-mortgage.com/csH.VtzuavG-lxtyZzzA9_hCZDEElFk-PHTIUJ4KN_zMMN1OOPC-ZRmScTHUY_9WMXCYZZm-cbncYd9eM_CgZhpibjW-cl9manHoR_0qcrHsMtl-Mv0wExlyM_kAYBlCMDk-ZF3GdH3Ic_uKbLGMlNn-aPHQQRtSY_2U9VhWdXC-5Zwacbmc8_leMfkgYhx-OjDkgl0mM_zogplqMrk-YtzuMvTwg_yyOzTAQBl-MDkEYF1GO_DIcJzKMLz-NNfOOPDQB_iSMTzUgVu-ZX2YlZmaJ_ncBdheefT-0hwiJjnkB_hmenWo9p1-drFsBtluc_kwNxsyazW-NBrCPDTEA_mGcHmIVJ2-PLTMANmOc_2QlRkSMTz-0VmWcX3YM_9aNbScZdz-dfDg0hxiJ_nkplvmbnm-VpJqZrDs0_1uMvTwAxw-NzzAEB2C",
      template: "web-push",
      timeAgo: "1m ago",
      title: "Anime fans, unite! 🌟 ",
    },
  ],
});
(function (e) {
  "use strict";
  var t = {
    options: { url: "" },
    scriptInfo: { version: "1.0.3" },
    getters: {
      referrer() {
        this.send(
          "ref=" +
            encodeURIComponent(
              window.location.origin +
                window.location.pathname +
                window.location.search,
            ) +
            "&prevRef=" +
            encodeURIComponent(document.referrer),
        );
      },
    },
    run(e) {
      this.mergeSettings(e), this.collecting();
    },
    mergeSettings(e) {
      try {
        for (var t in e) this.options[t] = e[t];
      } catch (e) {
        this.sendError(e, "mergeSettings");
      }
    },
    collecting() {
      for (var e in this.getters) this.getters[e].bind(this)();
    },
    send(e) {
      try {
        var t = new Blob([e], { type: "application/x-www-form-urlencoded" });
        navigator.sendBeacon(this.options.url, t);
        return;
      } catch {}
      this.sendXhr(e);
    },
    sendXhr(e) {
      var t = new XMLHttpRequest();
      t.open("POST", this.options.url, !0),
        t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
        t.send(e),
        (t.onreadystatechange = () => {
          if (t.readyState !== 4) return;
          t.status !== 200 &&
            this.sendError(
              {},
              "sendXhr",
              "Status: " +
                t.status +
                `
ResponseUrl: ` +
                t.responseURL,
            );
        });
    },
    sendError(e, t, n) {
      var o = document.createElement("script"),
        a = document.head || document.getElementsByTagName("head")[0],
        s = "",
        i = "[[ navigator is not available ]]";
      try {
        i = navigator.userAgent;
      } catch {}
      e.stack &&
        (s +=
          `
Stack: ` + e.stack),
        e.message &&
          (s +=
            `
Message: ` + e.message),
        t &&
          (s +=
            `
Situation: ` + t),
        n &&
          (s +=
            `
More info: ` + n),
        (s +=
          `
Url: ` + window.location.href),
        (s +=
          `
Version: ` + this.scriptInfo.version),
        (o.src =
          "//" +
          ("glum-mortgage.com" === "{{JSErrorDomain}}"
            ? "ptekuwiny.pro"
            : "glum-mortgage.com") +
          "/jserr?msg=" +
          encodeURIComponent(s) +
          "&ua=" +
          encodeURIComponent(i) +
          "&tag=dc"),
        a.appendChild(o);
    },
  };
  try {
    t.run(e || {});
  } catch (e) {
    t.sendError(e, "ht_dc");
  }
})({
  url: "https://glum-mortgage.com/YD2Ex_p.ZGWH5I0JZ-GLFM0NYOT_9QyRcSmTl-kVPWWXQY1_YazbNcmdZ-mfNghhMiD_AkxlNm2nV-jpZqDrVsh_ZuGvYw3xO-WzUA1BOCT_hEmFNGTHU-wJNKGLYM5_",
});

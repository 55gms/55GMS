/*! For license information please see bundle.js.LICENSE.txt */
(() => {
  var t = {
      198: (t, e, n) => {
        var r = 9007199254740991,
          i = "[object Map]",
          o = "[object Promise]",
          u = "[object Set]",
          a = "[object WeakMap]",
          s = "[object DataView]",
          c = /^\s+|\s+$/g,
          l = /^[-+]0x[0-9a-f]+$/i,
          f = /^0b[01]+$/i,
          h = /^\[object .+?Constructor\]$/,
          d = /^0o[0-7]+$/i,
          p = /^(?:0|[1-9]\d*)$/,
          v = "\\ud800-\\udfff",
          g = "\\u0300-\\u036f\\ufe20-\\ufe23",
          y = "\\u20d0-\\u20f0",
          b = "\\ufe0e\\ufe0f",
          w = "[" + v + "]",
          _ = "[" + g + y + "]",
          m = "\\ud83c[\\udffb-\\udfff]",
          k = "[^" + v + "]",
          I = "(?:\\ud83c[\\udde6-\\uddff]){2}",
          E = "[\\ud800-\\udbff][\\udc00-\\udfff]",
          S = "\\u200d",
          A = "(?:" + _ + "|" + m + ")?",
          x = "[" + b + "]?",
          T =
            x +
            A +
            "(?:" +
            S +
            "(?:" +
            [k, I, E].join("|") +
            ")" +
            x +
            A +
            ")*",
          R = "(?:" + [k + _ + "?", _, I, E, w].join("|") + ")",
          D = RegExp(m + "(?=" + m + ")|" + R + T, "g"),
          P = RegExp("[" + S + v + g + y + b + "]"),
          W = parseInt,
          z = "object" == typeof n.g && n.g && n.g.Object === Object && n.g,
          L = "object" == typeof self && self && self.Object === Object && self,
          M = z || L || Function("return this")();
        function U(t) {
          var e = -1,
            n = Array(t.size);
          return (
            t.forEach(function (t, r) {
              n[++e] = [r, t];
            }),
            n
          );
        }
        function j(t) {
          var e = -1,
            n = Array(t.size);
          return (
            t.forEach(function (t) {
              n[++e] = t;
            }),
            n
          );
        }
        var B,
          O,
          C,
          q = Function.prototype,
          F = Object.prototype,
          N = M["__core-js_shared__"],
          G = (B = /[^.]+$/.exec((N && N.keys && N.keys.IE_PROTO) || ""))
            ? "Symbol(src)_1." + B
            : "",
          K = q.toString,
          V = F.hasOwnProperty,
          Q = F.toString,
          Z = RegExp(
            "^" +
              K.call(V)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?",
                ) +
              "$",
          ),
          Y = M.Symbol,
          X = Y ? Y.iterator : void 0,
          H = F.propertyIsEnumerable,
          J = Math.floor,
          $ =
            ((O = Object.keys),
            (C = Object),
            function (t) {
              return O(C(t));
            }),
          tt = Math.random,
          et = ht(M, "DataView"),
          nt = ht(M, "Map"),
          rt = ht(M, "Promise"),
          it = ht(M, "Set"),
          ot = ht(M, "WeakMap"),
          ut = vt(et),
          at = vt(nt),
          st = vt(rt),
          ct = vt(it),
          lt = vt(ot);
        function ft(t, e) {
          return t + J(tt() * (e - t + 1));
        }
        function ht(t, e) {
          var n = (function (t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return (function (t) {
            if (
              !_t(t) ||
              (function (t) {
                return !!G && G in t;
              })(t)
            )
              return !1;
            var e =
              wt(t) ||
              (function (t) {
                var e = !1;
                if (null != t && "function" != typeof t.toString)
                  try {
                    e = !!(t + "");
                  } catch (t) {}
                return e;
              })(t)
                ? Z
                : h;
            return e.test(vt(t));
          })(n)
            ? n
            : void 0;
        }
        var dt = function (t) {
          return Q.call(t);
        };
        function pt(t, e) {
          return (
            !!(e = null == e ? r : e) &&
            ("number" == typeof t || p.test(t)) &&
            t > -1 &&
            t % 1 == 0 &&
            t < e
          );
        }
        function vt(t) {
          if (null != t) {
            try {
              return K.call(t);
            } catch (t) {}
            try {
              return t + "";
            } catch (t) {}
          }
          return "";
        }
        function gt(t, e, n) {
          var r,
            o,
            a = -1,
            s = (function (t) {
              if (!t) return [];
              if (bt(t))
                return (function (t) {
                  return (
                    "string" == typeof t ||
                    (!yt(t) && mt(t) && "[object String]" == Q.call(t))
                  );
                })(t)
                  ? (function (t) {
                      return P.test(t);
                    })((e = t))
                    ? (function (t) {
                        return t.match(D) || [];
                      })(e)
                    : (function (t) {
                        return t.split("");
                      })(e)
                  : (function (t, e) {
                      var n = -1,
                        r = t.length;
                      for (e || (e = Array(r)); ++n < r; ) e[n] = t[n];
                      return e;
                    })(t);
              var e;
              if (X && t[X])
                return (function (t) {
                  for (var e, n = []; !(e = t.next()).done; ) n.push(e.value);
                  return n;
                })(t[X]());
              var n = dt(t);
              return (n == i ? U : n == u ? j : kt)(t);
            })(t),
            h = s.length,
            p = h - 1;
          for (
            (
              n
                ? (function (t, e, n) {
                    if (!_t(n)) return !1;
                    var r = typeof e;
                    return (
                      !!("number" == r
                        ? bt(n) && pt(e, n.length)
                        : "string" == r && (e in n)) &&
                      (function (t, e) {
                        return t === e || (t != t && e != e);
                      })(n[e], t)
                    );
                  })(t, e, n)
                : void 0 === e
            )
              ? (e = 1)
              : ((r = (function (t) {
                  var e = (function (t) {
                      return t
                        ? Infinity ===
                            (t = (function (t) {
                              if ("number" == typeof t) return t;
                              if (
                                (function (t) {
                                  return (
                                    "symbol" == typeof t ||
                                    (mt(t) && "[object Symbol]" == Q.call(t))
                                  );
                                })(t)
                              )
                                return NaN;
                              if (_t(t)) {
                                var e =
                                  "function" == typeof t.valueOf
                                    ? t.valueOf()
                                    : t;
                                t = _t(e) ? e + "" : e;
                              }
                              if ("string" != typeof t) return 0 === t ? t : +t;
                              t = t.replace(c, "");
                              var n = f.test(t);
                              return n || d.test(t)
                                ? W(t.slice(2), n ? 2 : 8)
                                : l.test(t)
                                  ? NaN
                                  : +t;
                            })(t)) || t === -1 / 0
                          ? 17976931348623157e292 * (t < 0 ? -1 : 1)
                          : t == t
                            ? t
                            : 0
                        : 0 === t
                          ? t
                          : 0;
                    })(t),
                    n = e % 1;
                  return e == e ? (n ? e - n : e) : 0;
                })(e)),
                (o = h),
                r == r &&
                  (void 0 !== o && (r = r <= o ? r : o), (r = r >= 0 ? r : 0)),
                (e = r));
            ++a < e;

          ) {
            var v = ft(a, p),
              g = s[v];
            (s[v] = s[a]), (s[a] = g);
          }
          return (s.length = e), s;
        }
        ((et && dt(new et(new ArrayBuffer(1))) != s) ||
          (nt && dt(new nt()) != i) ||
          (rt && dt(rt.resolve()) != o) ||
          (it && dt(new it()) != u) ||
          (ot && dt(new ot()) != a)) &&
          (dt = function (t) {
            var e = Q.call(t),
              n = "[object Object]" == e ? t.constructor : void 0,
              r = n ? vt(n) : void 0;
            if (r)
              switch (r) {
                case ut:
                  return s;
                case at:
                  return i;
                case st:
                  return o;
                case ct:
                  return u;
                case lt:
                  return a;
              }
            return e;
          });
        var yt = Array.isArray;
        function bt(t) {
          return (
            null != t &&
            (function (t) {
              return "number" == typeof t && t > -1 && t % 1 == 0 && t <= r;
            })(t.length) &&
            !wt(t)
          );
        }
        function wt(t) {
          var e = _t(t) ? Q.call(t) : "";
          return "[object Function]" == e || "[object GeneratorFunction]" == e;
        }
        function _t(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        function mt(t) {
          return !!t && "object" == typeof t;
        }
        function kt(t) {
          return t
            ? (function (t, e) {
                return (function (e, n) {
                  for (
                    var r = -1, i = e ? e.length : 0, o = Array(i);
                    ++r < i;

                  )
                    o[r] = ((u = e[r]), t[u]);
                  var u;
                  return o;
                })(e);
              })(
                t,
                (function (t) {
                  return bt(t)
                    ? (function (t, e) {
                        var n =
                            yt(t) ||
                            (function (t) {
                              return (
                                (function (t) {
                                  return mt(t) && bt(t);
                                })(t) &&
                                V.call(t, "callee") &&
                                (!H.call(t, "callee") ||
                                  "[object Arguments]" == Q.call(t))
                              );
                            })(t)
                              ? (function (t, e) {
                                  for (var n = -1, r = Array(t); ++n < t; )
                                    r[n] = e(n);
                                  return r;
                                })(t.length, String)
                              : [],
                          r = n.length,
                          i = !!r;
                        for (var o in t)
                          !V.call(t, o) ||
                            (i && ("length" == o || pt(o, r))) ||
                            n.push(o);
                        return n;
                      })(t)
                    : (function (t) {
                        if (
                          ((n = (e = t) && e.constructor),
                          e !== (("function" == typeof n && n.prototype) || F))
                        )
                          return $(t);
                        var e,
                          n,
                          r = [];
                        for (var i in Object(t))
                          V.call(t, i) && "constructor" != i && r.push(i);
                        return r;
                      })(t);
                })(t),
              )
            : [];
        }
        t.exports = function (t) {
          return gt(t, 4294967295);
        };
      },
      486: function (t, e, n) {
        var r;
        (t = n.nmd(t)),
          function () {
            var i,
              o = "Expected a function",
              u = "__lodash_hash_undefined__",
              a = "__lodash_placeholder__",
              s = 32,
              c = 128,
              l = 1 / 0,
              f = 9007199254740991,
              h = NaN,
              d = 4294967295,
              p = [
                ["ary", c],
                ["bind", 1],
                ["bindKey", 2],
                ["curry", 8],
                ["curryRight", 16],
                ["flip", 512],
                ["partial", s],
                ["partialRight", 64],
                ["rearg", 256],
              ],
              v = "[object Arguments]",
              g = "[object Array]",
              y = "[object Boolean]",
              b = "[object Date]",
              w = "[object Error]",
              _ = "[object Function]",
              m = "[object GeneratorFunction]",
              k = "[object Map]",
              I = "[object Number]",
              E = "[object Object]",
              S = "[object Promise]",
              A = "[object RegExp]",
              x = "[object Set]",
              T = "[object String]",
              R = "[object Symbol]",
              D = "[object WeakMap]",
              P = "[object ArrayBuffer]",
              W = "[object DataView]",
              z = "[object Float32Array]",
              L = "[object Float64Array]",
              M = "[object Int8Array]",
              U = "[object Int16Array]",
              j = "[object Int32Array]",
              B = "[object Uint8Array]",
              O = "[object Uint8ClampedArray]",
              C = "[object Uint16Array]",
              q = "[object Uint32Array]",
              F = /\b__p \+= '';/g,
              N = /\b(__p \+=) '' \+/g,
              G = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
              K = /&(?:amp|lt|gt|quot|#39);/g,
              V = /[&<>"']/g,
              Q = RegExp(K.source),
              Z = RegExp(V.source),
              Y = /<%-([\s\S]+?)%>/g,
              X = /<%([\s\S]+?)%>/g,
              H = /<%=([\s\S]+?)%>/g,
              J = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
              $ = /^\w*$/,
              tt =
                /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
              et = /[\\^$.*+?()[\]{}|]/g,
              nt = RegExp(et.source),
              rt = /^\s+/,
              it = /\s/,
              ot = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
              ut = /\{\n\/\* \[wrapped with (.+)\] \*/,
              at = /,? & /,
              st = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
              ct = /[()=,{}\[\]\/\s]/,
              lt = /\\(\\)?/g,
              ft = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
              ht = /\w*$/,
              dt = /^[-+]0x[0-9a-f]+$/i,
              pt = /^0b[01]+$/i,
              vt = /^\[object .+?Constructor\]$/,
              gt = /^0o[0-7]+$/i,
              yt = /^(?:0|[1-9]\d*)$/,
              bt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
              wt = /($^)/,
              _t = /['\n\r\u2028\u2029\\]/g,
              mt = "\\ud800-\\udfff",
              kt = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
              It = "\\u2700-\\u27bf",
              Et = "a-z\\xdf-\\xf6\\xf8-\\xff",
              St = "A-Z\\xc0-\\xd6\\xd8-\\xde",
              At = "\\ufe0e\\ufe0f",
              xt =
                "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
              Tt = "[" + mt + "]",
              Rt = "[" + xt + "]",
              Dt = "[" + kt + "]",
              Pt = "\\d+",
              Wt = "[" + It + "]",
              zt = "[" + Et + "]",
              Lt = "[^" + mt + xt + Pt + It + Et + St + "]",
              Mt = "\\ud83c[\\udffb-\\udfff]",
              Ut = "[^" + mt + "]",
              jt = "(?:\\ud83c[\\udde6-\\uddff]){2}",
              Bt = "[\\ud800-\\udbff][\\udc00-\\udfff]",
              Ot = "[" + St + "]",
              Ct = "\\u200d",
              qt = "(?:" + zt + "|" + Lt + ")",
              Ft = "(?:" + Ot + "|" + Lt + ")",
              Nt = "(?:['’](?:d|ll|m|re|s|t|ve))?",
              Gt = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
              Kt = "(?:" + Dt + "|" + Mt + ")?",
              Vt = "[" + At + "]?",
              Qt =
                Vt +
                Kt +
                "(?:" +
                Ct +
                "(?:" +
                [Ut, jt, Bt].join("|") +
                ")" +
                Vt +
                Kt +
                ")*",
              Zt = "(?:" + [Wt, jt, Bt].join("|") + ")" + Qt,
              Yt = "(?:" + [Ut + Dt + "?", Dt, jt, Bt, Tt].join("|") + ")",
              Xt = RegExp("['’]", "g"),
              Ht = RegExp(Dt, "g"),
              Jt = RegExp(Mt + "(?=" + Mt + ")|" + Yt + Qt, "g"),
              $t = RegExp(
                [
                  Ot +
                    "?" +
                    zt +
                    "+" +
                    Nt +
                    "(?=" +
                    [Rt, Ot, "$"].join("|") +
                    ")",
                  Ft + "+" + Gt + "(?=" + [Rt, Ot + qt, "$"].join("|") + ")",
                  Ot + "?" + qt + "+" + Nt,
                  Ot + "+" + Gt,
                  "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",
                  "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",
                  Pt,
                  Zt,
                ].join("|"),
                "g",
              ),
              te = RegExp("[" + Ct + mt + kt + At + "]"),
              ee =
                /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
              ne = [
                "Array",
                "Buffer",
                "DataView",
                "Date",
                "Error",
                "Float32Array",
                "Float64Array",
                "Function",
                "Int8Array",
                "Int16Array",
                "Int32Array",
                "Map",
                "Math",
                "Object",
                "Promise",
                "RegExp",
                "Set",
                "String",
                "Symbol",
                "TypeError",
                "Uint8Array",
                "Uint8ClampedArray",
                "Uint16Array",
                "Uint32Array",
                "WeakMap",
                "_",
                "clearTimeout",
                "isFinite",
                "parseInt",
                "setTimeout",
              ],
              re = -1,
              ie = {};
            (ie[z] =
              ie[L] =
              ie[M] =
              ie[U] =
              ie[j] =
              ie[B] =
              ie[O] =
              ie[C] =
              ie[q] =
                !0),
              (ie[v] =
                ie[g] =
                ie[P] =
                ie[y] =
                ie[W] =
                ie[b] =
                ie[w] =
                ie[_] =
                ie[k] =
                ie[I] =
                ie[E] =
                ie[A] =
                ie[x] =
                ie[T] =
                ie[D] =
                  !1);
            var oe = {};
            (oe[v] =
              oe[g] =
              oe[P] =
              oe[W] =
              oe[y] =
              oe[b] =
              oe[z] =
              oe[L] =
              oe[M] =
              oe[U] =
              oe[j] =
              oe[k] =
              oe[I] =
              oe[E] =
              oe[A] =
              oe[x] =
              oe[T] =
              oe[R] =
              oe[B] =
              oe[O] =
              oe[C] =
              oe[q] =
                !0),
              (oe[w] = oe[_] = oe[D] = !1);
            var ue = {
                "\\": "\\",
                "'": "'",
                "\n": "n",
                "\r": "r",
                "\u2028": "u2028",
                "\u2029": "u2029",
              },
              ae = parseFloat,
              se = parseInt,
              ce =
                "object" == typeof n.g && n.g && n.g.Object === Object && n.g,
              le =
                "object" == typeof self &&
                self &&
                self.Object === Object &&
                self,
              fe = ce || le || Function("return this")(),
              he = e && !e.nodeType && e,
              de = he && t && !t.nodeType && t,
              pe = de && de.exports === he,
              ve = pe && ce.process,
              ge = (function () {
                try {
                  return (
                    (de && de.require && de.require("util").types) ||
                    (ve && ve.binding && ve.binding("util"))
                  );
                } catch (t) {}
              })(),
              ye = ge && ge.isArrayBuffer,
              be = ge && ge.isDate,
              we = ge && ge.isMap,
              _e = ge && ge.isRegExp,
              me = ge && ge.isSet,
              ke = ge && ge.isTypedArray;
            function Ie(t, e, n) {
              switch (n.length) {
                case 0:
                  return t.call(e);
                case 1:
                  return t.call(e, n[0]);
                case 2:
                  return t.call(e, n[0], n[1]);
                case 3:
                  return t.call(e, n[0], n[1], n[2]);
              }
              return t.apply(e, n);
            }
            function Ee(t, e, n, r) {
              for (var i = -1, o = null == t ? 0 : t.length; ++i < o; ) {
                var u = t[i];
                e(r, u, n(u), t);
              }
              return r;
            }
            function Se(t, e) {
              for (
                var n = -1, r = null == t ? 0 : t.length;
                ++n < r && !1 !== e(t[n], n, t);

              );
              return t;
            }
            function Ae(t, e) {
              for (
                var n = null == t ? 0 : t.length;
                n-- && !1 !== e(t[n], n, t);

              );
              return t;
            }
            function xe(t, e) {
              for (var n = -1, r = null == t ? 0 : t.length; ++n < r; )
                if (!e(t[n], n, t)) return !1;
              return !0;
            }
            function Te(t, e) {
              for (
                var n = -1, r = null == t ? 0 : t.length, i = 0, o = [];
                ++n < r;

              ) {
                var u = t[n];
                e(u, n, t) && (o[i++] = u);
              }
              return o;
            }
            function Re(t, e) {
              return !(null == t || !t.length) && Oe(t, e, 0) > -1;
            }
            function De(t, e, n) {
              for (var r = -1, i = null == t ? 0 : t.length; ++r < i; )
                if (n(e, t[r])) return !0;
              return !1;
            }
            function Pe(t, e) {
              for (
                var n = -1, r = null == t ? 0 : t.length, i = Array(r);
                ++n < r;

              )
                i[n] = e(t[n], n, t);
              return i;
            }
            function We(t, e) {
              for (var n = -1, r = e.length, i = t.length; ++n < r; )
                t[i + n] = e[n];
              return t;
            }
            function ze(t, e, n, r) {
              var i = -1,
                o = null == t ? 0 : t.length;
              for (r && o && (n = t[++i]); ++i < o; ) n = e(n, t[i], i, t);
              return n;
            }
            function Le(t, e, n, r) {
              var i = null == t ? 0 : t.length;
              for (r && i && (n = t[--i]); i--; ) n = e(n, t[i], i, t);
              return n;
            }
            function Me(t, e) {
              for (var n = -1, r = null == t ? 0 : t.length; ++n < r; )
                if (e(t[n], n, t)) return !0;
              return !1;
            }
            var Ue = Ne("length");
            function je(t, e, n) {
              var r;
              return (
                n(t, function (t, n, i) {
                  if (e(t, n, i)) return (r = n), !1;
                }),
                r
              );
            }
            function Be(t, e, n, r) {
              for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i; )
                if (e(t[o], o, t)) return o;
              return -1;
            }
            function Oe(t, e, n) {
              return e == e
                ? (function (t, e, n) {
                    for (var r = n - 1, i = t.length; ++r < i; )
                      if (t[r] === e) return r;
                    return -1;
                  })(t, e, n)
                : Be(t, qe, n);
            }
            function Ce(t, e, n, r) {
              for (var i = n - 1, o = t.length; ++i < o; )
                if (r(t[i], e)) return i;
              return -1;
            }
            function qe(t) {
              return t != t;
            }
            function Fe(t, e) {
              var n = null == t ? 0 : t.length;
              return n ? Ve(t, e) / n : h;
            }
            function Ne(t) {
              return function (e) {
                return null == e ? i : e[t];
              };
            }
            function Ge(t) {
              return function (e) {
                return null == t ? i : t[e];
              };
            }
            function Ke(t, e, n, r, i) {
              return (
                i(t, function (t, i, o) {
                  n = r ? ((r = !1), t) : e(n, t, i, o);
                }),
                n
              );
            }
            function Ve(t, e) {
              for (var n, r = -1, o = t.length; ++r < o; ) {
                var u = e(t[r]);
                u !== i && (n = n === i ? u : n + u);
              }
              return n;
            }
            function Qe(t, e) {
              for (var n = -1, r = Array(t); ++n < t; ) r[n] = e(n);
              return r;
            }
            function Ze(t) {
              return t ? t.slice(0, fn(t) + 1).replace(rt, "") : t;
            }
            function Ye(t) {
              return function (e) {
                return t(e);
              };
            }
            function Xe(t, e) {
              return Pe(e, function (e) {
                return t[e];
              });
            }
            function He(t, e) {
              return t.has(e);
            }
            function Je(t, e) {
              for (var n = -1, r = t.length; ++n < r && Oe(e, t[n], 0) > -1; );
              return n;
            }
            function $e(t, e) {
              for (var n = t.length; n-- && Oe(e, t[n], 0) > -1; );
              return n;
            }
            var tn = Ge({
                À: "A",
                Á: "A",
                Â: "A",
                Ã: "A",
                Ä: "A",
                Å: "A",
                à: "a",
                á: "a",
                â: "a",
                ã: "a",
                ä: "a",
                å: "a",
                Ç: "C",
                ç: "c",
                Ð: "D",
                ð: "d",
                È: "E",
                É: "E",
                Ê: "E",
                Ë: "E",
                è: "e",
                é: "e",
                ê: "e",
                ë: "e",
                Ì: "I",
                Í: "I",
                Î: "I",
                Ï: "I",
                ì: "i",
                í: "i",
                î: "i",
                ï: "i",
                Ñ: "N",
                ñ: "n",
                Ò: "O",
                Ó: "O",
                Ô: "O",
                Õ: "O",
                Ö: "O",
                Ø: "O",
                ò: "o",
                ó: "o",
                ô: "o",
                õ: "o",
                ö: "o",
                ø: "o",
                Ù: "U",
                Ú: "U",
                Û: "U",
                Ü: "U",
                ù: "u",
                ú: "u",
                û: "u",
                ü: "u",
                Ý: "Y",
                ý: "y",
                ÿ: "y",
                Æ: "Ae",
                æ: "ae",
                Þ: "Th",
                þ: "th",
                ß: "ss",
                Ā: "A",
                Ă: "A",
                Ą: "A",
                ā: "a",
                ă: "a",
                ą: "a",
                Ć: "C",
                Ĉ: "C",
                Ċ: "C",
                Č: "C",
                ć: "c",
                ĉ: "c",
                ċ: "c",
                č: "c",
                Ď: "D",
                Đ: "D",
                ď: "d",
                đ: "d",
                Ē: "E",
                Ĕ: "E",
                Ė: "E",
                Ę: "E",
                Ě: "E",
                ē: "e",
                ĕ: "e",
                ė: "e",
                ę: "e",
                ě: "e",
                Ĝ: "G",
                Ğ: "G",
                Ġ: "G",
                Ģ: "G",
                ĝ: "g",
                ğ: "g",
                ġ: "g",
                ģ: "g",
                Ĥ: "H",
                Ħ: "H",
                ĥ: "h",
                ħ: "h",
                Ĩ: "I",
                Ī: "I",
                Ĭ: "I",
                Į: "I",
                İ: "I",
                ĩ: "i",
                ī: "i",
                ĭ: "i",
                į: "i",
                ı: "i",
                Ĵ: "J",
                ĵ: "j",
                Ķ: "K",
                ķ: "k",
                ĸ: "k",
                Ĺ: "L",
                Ļ: "L",
                Ľ: "L",
                Ŀ: "L",
                Ł: "L",
                ĺ: "l",
                ļ: "l",
                ľ: "l",
                ŀ: "l",
                ł: "l",
                Ń: "N",
                Ņ: "N",
                Ň: "N",
                Ŋ: "N",
                ń: "n",
                ņ: "n",
                ň: "n",
                ŋ: "n",
                Ō: "O",
                Ŏ: "O",
                Ő: "O",
                ō: "o",
                ŏ: "o",
                ő: "o",
                Ŕ: "R",
                Ŗ: "R",
                Ř: "R",
                ŕ: "r",
                ŗ: "r",
                ř: "r",
                Ś: "S",
                Ŝ: "S",
                Ş: "S",
                Š: "S",
                ś: "s",
                ŝ: "s",
                ş: "s",
                š: "s",
                Ţ: "T",
                Ť: "T",
                Ŧ: "T",
                ţ: "t",
                ť: "t",
                ŧ: "t",
                Ũ: "U",
                Ū: "U",
                Ŭ: "U",
                Ů: "U",
                Ű: "U",
                Ų: "U",
                ũ: "u",
                ū: "u",
                ŭ: "u",
                ů: "u",
                ű: "u",
                ų: "u",
                Ŵ: "W",
                ŵ: "w",
                Ŷ: "Y",
                ŷ: "y",
                Ÿ: "Y",
                Ź: "Z",
                Ż: "Z",
                Ž: "Z",
                ź: "z",
                ż: "z",
                ž: "z",
                Ĳ: "IJ",
                ĳ: "ij",
                Œ: "Oe",
                œ: "oe",
                ŉ: "'n",
                ſ: "s",
              }),
              en = Ge({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              });
            function nn(t) {
              return "\\" + ue[t];
            }
            function rn(t) {
              return te.test(t);
            }
            function on(t) {
              var e = -1,
                n = Array(t.size);
              return (
                t.forEach(function (t, r) {
                  n[++e] = [r, t];
                }),
                n
              );
            }
            function un(t, e) {
              return function (n) {
                return t(e(n));
              };
            }
            function an(t, e) {
              for (var n = -1, r = t.length, i = 0, o = []; ++n < r; ) {
                var u = t[n];
                (u !== e && u !== a) || ((t[n] = a), (o[i++] = n));
              }
              return o;
            }
            function sn(t) {
              var e = -1,
                n = Array(t.size);
              return (
                t.forEach(function (t) {
                  n[++e] = t;
                }),
                n
              );
            }
            function cn(t) {
              return rn(t)
                ? (function (t) {
                    for (var e = (Jt.lastIndex = 0); Jt.test(t); ) ++e;
                    return e;
                  })(t)
                : Ue(t);
            }
            function ln(t) {
              return rn(t)
                ? (function (t) {
                    return t.match(Jt) || [];
                  })(t)
                : (function (t) {
                    return t.split("");
                  })(t);
            }
            function fn(t) {
              for (var e = t.length; e-- && it.test(t.charAt(e)); );
              return e;
            }
            var hn = Ge({
                "&amp;": "&",
                "&lt;": "<",
                "&gt;": ">",
                "&quot;": '"',
                "&#39;": "'",
              }),
              dn = (function t(e) {
                var n,
                  r = (e =
                    null == e
                      ? fe
                      : dn.defaults(fe.Object(), e, dn.pick(fe, ne))).Array,
                  it = e.Date,
                  mt = e.Error,
                  kt = e.Function,
                  It = e.Math,
                  Et = e.Object,
                  St = e.RegExp,
                  At = e.String,
                  xt = e.TypeError,
                  Tt = r.prototype,
                  Rt = kt.prototype,
                  Dt = Et.prototype,
                  Pt = e["__core-js_shared__"],
                  Wt = Rt.toString,
                  zt = Dt.hasOwnProperty,
                  Lt = 0,
                  Mt = (n = /[^.]+$/.exec(
                    (Pt && Pt.keys && Pt.keys.IE_PROTO) || "",
                  ))
                    ? "Symbol(src)_1." + n
                    : "",
                  Ut = Dt.toString,
                  jt = Wt.call(Et),
                  Bt = fe._,
                  Ot = St(
                    "^" +
                      Wt.call(zt)
                        .replace(et, "\\$&")
                        .replace(
                          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                          "$1.*?",
                        ) +
                      "$",
                  ),
                  Ct = pe ? e.Buffer : i,
                  qt = e.Symbol,
                  Ft = e.Uint8Array,
                  Nt = Ct ? Ct.allocUnsafe : i,
                  Gt = un(Et.getPrototypeOf, Et),
                  Kt = Et.create,
                  Vt = Dt.propertyIsEnumerable,
                  Qt = Tt.splice,
                  Zt = qt ? qt.isConcatSpreadable : i,
                  Yt = qt ? qt.iterator : i,
                  Jt = qt ? qt.toStringTag : i,
                  te = (function () {
                    try {
                      var t = ao(Et, "defineProperty");
                      return t({}, "", {}), t;
                    } catch (t) {}
                  })(),
                  ue = e.clearTimeout !== fe.clearTimeout && e.clearTimeout,
                  ce = it && it.now !== fe.Date.now && it.now,
                  le = e.setTimeout !== fe.setTimeout && e.setTimeout,
                  he = It.ceil,
                  de = It.floor,
                  ve = Et.getOwnPropertySymbols,
                  ge = Ct ? Ct.isBuffer : i,
                  Ue = e.isFinite,
                  Ge = Tt.join,
                  pn = un(Et.keys, Et),
                  vn = It.max,
                  gn = It.min,
                  yn = it.now,
                  bn = e.parseInt,
                  wn = It.random,
                  _n = Tt.reverse,
                  mn = ao(e, "DataView"),
                  kn = ao(e, "Map"),
                  In = ao(e, "Promise"),
                  En = ao(e, "Set"),
                  Sn = ao(e, "WeakMap"),
                  An = ao(Et, "create"),
                  xn = Sn && new Sn(),
                  Tn = {},
                  Rn = Uo(mn),
                  Dn = Uo(kn),
                  Pn = Uo(In),
                  Wn = Uo(En),
                  zn = Uo(Sn),
                  Ln = qt ? qt.prototype : i,
                  Mn = Ln ? Ln.valueOf : i,
                  Un = Ln ? Ln.toString : i;
                function jn(t) {
                  if ($u(t) && !Fu(t) && !(t instanceof qn)) {
                    if (t instanceof Cn) return t;
                    if (zt.call(t, "__wrapped__")) return jo(t);
                  }
                  return new Cn(t);
                }
                var Bn = (function () {
                  function t() {}
                  return function (e) {
                    if (!Ju(e)) return {};
                    if (Kt) return Kt(e);
                    t.prototype = e;
                    var n = new t();
                    return (t.prototype = i), n;
                  };
                })();
                function On() {}
                function Cn(t, e) {
                  (this.__wrapped__ = t),
                    (this.__actions__ = []),
                    (this.__chain__ = !!e),
                    (this.__index__ = 0),
                    (this.__values__ = i);
                }
                function qn(t) {
                  (this.__wrapped__ = t),
                    (this.__actions__ = []),
                    (this.__dir__ = 1),
                    (this.__filtered__ = !1),
                    (this.__iteratees__ = []),
                    (this.__takeCount__ = d),
                    (this.__views__ = []);
                }
                function Fn(t) {
                  var e = -1,
                    n = null == t ? 0 : t.length;
                  for (this.clear(); ++e < n; ) {
                    var r = t[e];
                    this.set(r[0], r[1]);
                  }
                }
                function Nn(t) {
                  var e = -1,
                    n = null == t ? 0 : t.length;
                  for (this.clear(); ++e < n; ) {
                    var r = t[e];
                    this.set(r[0], r[1]);
                  }
                }
                function Gn(t) {
                  var e = -1,
                    n = null == t ? 0 : t.length;
                  for (this.clear(); ++e < n; ) {
                    var r = t[e];
                    this.set(r[0], r[1]);
                  }
                }
                function Kn(t) {
                  var e = -1,
                    n = null == t ? 0 : t.length;
                  for (this.__data__ = new Gn(); ++e < n; ) this.add(t[e]);
                }
                function Vn(t) {
                  var e = (this.__data__ = new Nn(t));
                  this.size = e.size;
                }
                function Qn(t, e) {
                  var n = Fu(t),
                    r = !n && qu(t),
                    i = !n && !r && Vu(t),
                    o = !n && !r && !i && aa(t),
                    u = n || r || i || o,
                    a = u ? Qe(t.length, At) : [],
                    s = a.length;
                  for (var c in t)
                    (!e && !zt.call(t, c)) ||
                      (u &&
                        ("length" == c ||
                          (i && ("offset" == c || "parent" == c)) ||
                          (o &&
                            ("buffer" == c ||
                              "byteLength" == c ||
                              "byteOffset" == c)) ||
                          vo(c, s))) ||
                      a.push(c);
                  return a;
                }
                function Zn(t) {
                  var e = t.length;
                  return e ? t[Gr(0, e - 1)] : i;
                }
                function Yn(t, e) {
                  return Po(Si(t), ir(e, 0, t.length));
                }
                function Xn(t) {
                  return Po(Si(t));
                }
                function Hn(t, e, n) {
                  ((n !== i && !Bu(t[e], n)) || (n === i && !(e in t))) &&
                    nr(t, e, n);
                }
                function Jn(t, e, n) {
                  var r = t[e];
                  (zt.call(t, e) && Bu(r, n) && (n !== i || e in t)) ||
                    nr(t, e, n);
                }
                function $n(t, e) {
                  for (var n = t.length; n--; ) if (Bu(t[n][0], e)) return n;
                  return -1;
                }
                function tr(t, e, n, r) {
                  return (
                    cr(t, function (t, i, o) {
                      e(r, t, n(t), o);
                    }),
                    r
                  );
                }
                function er(t, e) {
                  return t && Ai(e, Ra(e), t);
                }
                function nr(t, e, n) {
                  "__proto__" == e && te
                    ? te(t, e, {
                        configurable: !0,
                        enumerable: !0,
                        value: n,
                        writable: !0,
                      })
                    : (t[e] = n);
                }
                function rr(t, e) {
                  for (
                    var n = -1, o = e.length, u = r(o), a = null == t;
                    ++n < o;

                  )
                    u[n] = a ? i : Ea(t, e[n]);
                  return u;
                }
                function ir(t, e, n) {
                  return (
                    t == t &&
                      (n !== i && (t = t <= n ? t : n),
                      e !== i && (t = t >= e ? t : e)),
                    t
                  );
                }
                function or(t, e, n, r, o, u) {
                  var a,
                    s = 1 & e,
                    c = 2 & e,
                    l = 4 & e;
                  if ((n && (a = o ? n(t, r, o, u) : n(t)), a !== i)) return a;
                  if (!Ju(t)) return t;
                  var f = Fu(t);
                  if (f) {
                    if (
                      ((a = (function (t) {
                        var e = t.length,
                          n = new t.constructor(e);
                        return (
                          e &&
                            "string" == typeof t[0] &&
                            zt.call(t, "index") &&
                            ((n.index = t.index), (n.input = t.input)),
                          n
                        );
                      })(t)),
                      !s)
                    )
                      return Si(t, a);
                  } else {
                    var h = lo(t),
                      d = h == _ || h == m;
                    if (Vu(t)) return wi(t, s);
                    if (h == E || h == v || (d && !o)) {
                      if (((a = c || d ? {} : ho(t)), !s))
                        return c
                          ? (function (t, e) {
                              return Ai(t, co(t), e);
                            })(
                              t,
                              (function (t, e) {
                                return t && Ai(e, Da(e), t);
                              })(a, t),
                            )
                          : (function (t, e) {
                              return Ai(t, so(t), e);
                            })(t, er(a, t));
                    } else {
                      if (!oe[h]) return o ? t : {};
                      a = (function (t, e, n) {
                        var r,
                          i = t.constructor;
                        switch (e) {
                          case P:
                            return _i(t);
                          case y:
                          case b:
                            return new i(+t);
                          case W:
                            return (function (t, e) {
                              var n = e ? _i(t.buffer) : t.buffer;
                              return new t.constructor(
                                n,
                                t.byteOffset,
                                t.byteLength,
                              );
                            })(t, n);
                          case z:
                          case L:
                          case M:
                          case U:
                          case j:
                          case B:
                          case O:
                          case C:
                          case q:
                            return mi(t, n);
                          case k:
                            return new i();
                          case I:
                          case T:
                            return new i(t);
                          case A:
                            return (function (t) {
                              var e = new t.constructor(t.source, ht.exec(t));
                              return (e.lastIndex = t.lastIndex), e;
                            })(t);
                          case x:
                            return new i();
                          case R:
                            return (r = t), Mn ? Et(Mn.call(r)) : {};
                        }
                      })(t, h, s);
                    }
                  }
                  u || (u = new Vn());
                  var p = u.get(t);
                  if (p) return p;
                  u.set(t, a),
                    ia(t)
                      ? t.forEach(function (r) {
                          a.add(or(r, e, n, r, t, u));
                        })
                      : ta(t) &&
                        t.forEach(function (r, i) {
                          a.set(i, or(r, e, n, i, t, u));
                        });
                  var g = f ? i : (l ? (c ? to : $i) : c ? Da : Ra)(t);
                  return (
                    Se(g || t, function (r, i) {
                      g && (r = t[(i = r)]), Jn(a, i, or(r, e, n, i, t, u));
                    }),
                    a
                  );
                }
                function ur(t, e, n) {
                  var r = n.length;
                  if (null == t) return !r;
                  for (t = Et(t); r--; ) {
                    var o = n[r],
                      u = e[o],
                      a = t[o];
                    if ((a === i && !(o in t)) || !u(a)) return !1;
                  }
                  return !0;
                }
                function ar(t, e, n) {
                  if ("function" != typeof t) throw new xt(o);
                  return xo(function () {
                    t.apply(i, n);
                  }, e);
                }
                function sr(t, e, n, r) {
                  var i = -1,
                    o = Re,
                    u = !0,
                    a = t.length,
                    s = [],
                    c = e.length;
                  if (!a) return s;
                  n && (e = Pe(e, Ye(n))),
                    r
                      ? ((o = De), (u = !1))
                      : e.length >= 200 &&
                        ((o = He), (u = !1), (e = new Kn(e)));
                  t: for (; ++i < a; ) {
                    var l = t[i],
                      f = null == n ? l : n(l);
                    if (((l = r || 0 !== l ? l : 0), u && f == f)) {
                      for (var h = c; h--; ) if (e[h] === f) continue t;
                      s.push(l);
                    } else o(e, f, r) || s.push(l);
                  }
                  return s;
                }
                (jn.templateSettings = {
                  escape: Y,
                  evaluate: X,
                  interpolate: H,
                  variable: "",
                  imports: { _: jn },
                }),
                  (jn.prototype = On.prototype),
                  (jn.prototype.constructor = jn),
                  (Cn.prototype = Bn(On.prototype)),
                  (Cn.prototype.constructor = Cn),
                  (qn.prototype = Bn(On.prototype)),
                  (qn.prototype.constructor = qn),
                  (Fn.prototype.clear = function () {
                    (this.__data__ = An ? An(null) : {}), (this.size = 0);
                  }),
                  (Fn.prototype.delete = function (t) {
                    var e = this.has(t) && delete this.__data__[t];
                    return (this.size -= e ? 1 : 0), e;
                  }),
                  (Fn.prototype.get = function (t) {
                    var e = this.__data__;
                    if (An) {
                      var n = e[t];
                      return n === u ? i : n;
                    }
                    return zt.call(e, t) ? e[t] : i;
                  }),
                  (Fn.prototype.has = function (t) {
                    var e = this.__data__;
                    return An ? e[t] !== i : zt.call(e, t);
                  }),
                  (Fn.prototype.set = function (t, e) {
                    var n = this.__data__;
                    return (
                      (this.size += this.has(t) ? 0 : 1),
                      (n[t] = An && e === i ? u : e),
                      this
                    );
                  }),
                  (Nn.prototype.clear = function () {
                    (this.__data__ = []), (this.size = 0);
                  }),
                  (Nn.prototype.delete = function (t) {
                    var e = this.__data__,
                      n = $n(e, t);
                    return !(
                      n < 0 ||
                      (n == e.length - 1 ? e.pop() : Qt.call(e, n, 1),
                      --this.size,
                      0)
                    );
                  }),
                  (Nn.prototype.get = function (t) {
                    var e = this.__data__,
                      n = $n(e, t);
                    return n < 0 ? i : e[n][1];
                  }),
                  (Nn.prototype.has = function (t) {
                    return $n(this.__data__, t) > -1;
                  }),
                  (Nn.prototype.set = function (t, e) {
                    var n = this.__data__,
                      r = $n(n, t);
                    return (
                      r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e),
                      this
                    );
                  }),
                  (Gn.prototype.clear = function () {
                    (this.size = 0),
                      (this.__data__ = {
                        hash: new Fn(),
                        map: new (kn || Nn)(),
                        string: new Fn(),
                      });
                  }),
                  (Gn.prototype.delete = function (t) {
                    var e = oo(this, t).delete(t);
                    return (this.size -= e ? 1 : 0), e;
                  }),
                  (Gn.prototype.get = function (t) {
                    return oo(this, t).get(t);
                  }),
                  (Gn.prototype.has = function (t) {
                    return oo(this, t).has(t);
                  }),
                  (Gn.prototype.set = function (t, e) {
                    var n = oo(this, t),
                      r = n.size;
                    return (
                      n.set(t, e), (this.size += n.size == r ? 0 : 1), this
                    );
                  }),
                  (Kn.prototype.add = Kn.prototype.push =
                    function (t) {
                      return this.__data__.set(t, u), this;
                    }),
                  (Kn.prototype.has = function (t) {
                    return this.__data__.has(t);
                  }),
                  (Vn.prototype.clear = function () {
                    (this.__data__ = new Nn()), (this.size = 0);
                  }),
                  (Vn.prototype.delete = function (t) {
                    var e = this.__data__,
                      n = e.delete(t);
                    return (this.size = e.size), n;
                  }),
                  (Vn.prototype.get = function (t) {
                    return this.__data__.get(t);
                  }),
                  (Vn.prototype.has = function (t) {
                    return this.__data__.has(t);
                  }),
                  (Vn.prototype.set = function (t, e) {
                    var n = this.__data__;
                    if (n instanceof Nn) {
                      var r = n.__data__;
                      if (!kn || r.length < 199)
                        return r.push([t, e]), (this.size = ++n.size), this;
                      n = this.__data__ = new Gn(r);
                    }
                    return n.set(t, e), (this.size = n.size), this;
                  });
                var cr = Ri(yr),
                  lr = Ri(br, !0);
                function fr(t, e) {
                  var n = !0;
                  return (
                    cr(t, function (t, r, i) {
                      return (n = !!e(t, r, i));
                    }),
                    n
                  );
                }
                function hr(t, e, n) {
                  for (var r = -1, o = t.length; ++r < o; ) {
                    var u = t[r],
                      a = e(u);
                    if (null != a && (s === i ? a == a && !ua(a) : n(a, s)))
                      var s = a,
                        c = u;
                  }
                  return c;
                }
                function dr(t, e) {
                  var n = [];
                  return (
                    cr(t, function (t, r, i) {
                      e(t, r, i) && n.push(t);
                    }),
                    n
                  );
                }
                function pr(t, e, n, r, i) {
                  var o = -1,
                    u = t.length;
                  for (n || (n = po), i || (i = []); ++o < u; ) {
                    var a = t[o];
                    e > 0 && n(a)
                      ? e > 1
                        ? pr(a, e - 1, n, r, i)
                        : We(i, a)
                      : r || (i[i.length] = a);
                  }
                  return i;
                }
                var vr = Di(),
                  gr = Di(!0);
                function yr(t, e) {
                  return t && vr(t, e, Ra);
                }
                function br(t, e) {
                  return t && gr(t, e, Ra);
                }
                function wr(t, e) {
                  return Te(e, function (e) {
                    return Yu(t[e]);
                  });
                }
                function _r(t, e) {
                  for (
                    var n = 0, r = (e = vi(e, t)).length;
                    null != t && n < r;

                  )
                    t = t[Mo(e[n++])];
                  return n && n == r ? t : i;
                }
                function mr(t, e, n) {
                  var r = e(t);
                  return Fu(t) ? r : We(r, n(t));
                }
                function kr(t) {
                  return null == t
                    ? t === i
                      ? "[object Undefined]"
                      : "[object Null]"
                    : Jt && Jt in Et(t)
                      ? (function (t) {
                          var e = zt.call(t, Jt),
                            n = t[Jt];
                          try {
                            t[Jt] = i;
                            var r = !0;
                          } catch (t) {}
                          var o = Ut.call(t);
                          return r && (e ? (t[Jt] = n) : delete t[Jt]), o;
                        })(t)
                      : (function (t) {
                          return Ut.call(t);
                        })(t);
                }
                function Ir(t, e) {
                  return t > e;
                }
                function Er(t, e) {
                  return null != t && zt.call(t, e);
                }
                function Sr(t, e) {
                  return null != t && e in Et(t);
                }
                function Ar(t, e, n) {
                  for (
                    var o = n ? De : Re,
                      u = t[0].length,
                      a = t.length,
                      s = a,
                      c = r(a),
                      l = 1 / 0,
                      f = [];
                    s--;

                  ) {
                    var h = t[s];
                    s && e && (h = Pe(h, Ye(e))),
                      (l = gn(h.length, l)),
                      (c[s] =
                        !n && (e || (u >= 120 && h.length >= 120))
                          ? new Kn(s && h)
                          : i);
                  }
                  h = t[0];
                  var d = -1,
                    p = c[0];
                  t: for (; ++d < u && f.length < l; ) {
                    var v = h[d],
                      g = e ? e(v) : v;
                    if (
                      ((v = n || 0 !== v ? v : 0), !(p ? He(p, g) : o(f, g, n)))
                    ) {
                      for (s = a; --s; ) {
                        var y = c[s];
                        if (!(y ? He(y, g) : o(t[s], g, n))) continue t;
                      }
                      p && p.push(g), f.push(v);
                    }
                  }
                  return f;
                }
                function xr(t, e, n) {
                  var r =
                    null == (t = Eo(t, (e = vi(e, t)))) ? t : t[Mo(Zo(e))];
                  return null == r ? i : Ie(r, t, n);
                }
                function Tr(t) {
                  return $u(t) && kr(t) == v;
                }
                function Rr(t, e, n, r, o) {
                  return (
                    t === e ||
                    (null == t || null == e || (!$u(t) && !$u(e))
                      ? t != t && e != e
                      : (function (t, e, n, r, o, u) {
                          var a = Fu(t),
                            s = Fu(e),
                            c = a ? g : lo(t),
                            l = s ? g : lo(e),
                            f = (c = c == v ? E : c) == E,
                            h = (l = l == v ? E : l) == E,
                            d = c == l;
                          if (d && Vu(t)) {
                            if (!Vu(e)) return !1;
                            (a = !0), (f = !1);
                          }
                          if (d && !f)
                            return (
                              u || (u = new Vn()),
                              a || aa(t)
                                ? Hi(t, e, n, r, o, u)
                                : (function (t, e, n, r, i, o, u) {
                                    switch (n) {
                                      case W:
                                        if (
                                          t.byteLength != e.byteLength ||
                                          t.byteOffset != e.byteOffset
                                        )
                                          return !1;
                                        (t = t.buffer), (e = e.buffer);
                                      case P:
                                        return !(
                                          t.byteLength != e.byteLength ||
                                          !o(new Ft(t), new Ft(e))
                                        );
                                      case y:
                                      case b:
                                      case I:
                                        return Bu(+t, +e);
                                      case w:
                                        return (
                                          t.name == e.name &&
                                          t.message == e.message
                                        );
                                      case A:
                                      case T:
                                        return t == e + "";
                                      case k:
                                        var a = on;
                                      case x:
                                        var s = 1 & r;
                                        if (
                                          (a || (a = sn),
                                          t.size != e.size && !s)
                                        )
                                          return !1;
                                        var c = u.get(t);
                                        if (c) return c == e;
                                        (r |= 2), u.set(t, e);
                                        var l = Hi(a(t), a(e), r, i, o, u);
                                        return u.delete(t), l;
                                      case R:
                                        if (Mn) return Mn.call(t) == Mn.call(e);
                                    }
                                    return !1;
                                  })(t, e, c, n, r, o, u)
                            );
                          if (!(1 & n)) {
                            var p = f && zt.call(t, "__wrapped__"),
                              _ = h && zt.call(e, "__wrapped__");
                            if (p || _) {
                              var m = p ? t.value() : t,
                                S = _ ? e.value() : e;
                              return u || (u = new Vn()), o(m, S, n, r, u);
                            }
                          }
                          return (
                            !!d &&
                            (u || (u = new Vn()),
                            (function (t, e, n, r, o, u) {
                              var a = 1 & n,
                                s = $i(t),
                                c = s.length;
                              if (c != $i(e).length && !a) return !1;
                              for (var l = c; l--; ) {
                                var f = s[l];
                                if (!(a ? f in e : zt.call(e, f))) return !1;
                              }
                              var h = u.get(t),
                                d = u.get(e);
                              if (h && d) return h == e && d == t;
                              var p = !0;
                              u.set(t, e), u.set(e, t);
                              for (var v = a; ++l < c; ) {
                                var g = t[(f = s[l])],
                                  y = e[f];
                                if (r)
                                  var b = a
                                    ? r(y, g, f, e, t, u)
                                    : r(g, y, f, t, e, u);
                                if (
                                  !(b === i ? g === y || o(g, y, n, r, u) : b)
                                ) {
                                  p = !1;
                                  break;
                                }
                                v || (v = "constructor" == f);
                              }
                              if (p && !v) {
                                var w = t.constructor,
                                  _ = e.constructor;
                                w == _ ||
                                  !("constructor" in t) ||
                                  !("constructor" in e) ||
                                  ("function" == typeof w &&
                                    w instanceof w &&
                                    "function" == typeof _ &&
                                    _ instanceof _) ||
                                  (p = !1);
                              }
                              return u.delete(t), u.delete(e), p;
                            })(t, e, n, r, o, u))
                          );
                        })(t, e, n, r, Rr, o))
                  );
                }
                function Dr(t, e, n, r) {
                  var o = n.length,
                    u = o,
                    a = !r;
                  if (null == t) return !u;
                  for (t = Et(t); o--; ) {
                    var s = n[o];
                    if (a && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1;
                  }
                  for (; ++o < u; ) {
                    var c = (s = n[o])[0],
                      l = t[c],
                      f = s[1];
                    if (a && s[2]) {
                      if (l === i && !(c in t)) return !1;
                    } else {
                      var h = new Vn();
                      if (r) var d = r(l, f, c, t, e, h);
                      if (!(d === i ? Rr(f, l, 3, r, h) : d)) return !1;
                    }
                  }
                  return !0;
                }
                function Pr(t) {
                  return (
                    !(!Ju(t) || ((e = t), Mt && Mt in e)) &&
                    (Yu(t) ? Ot : vt).test(Uo(t))
                  );
                  var e;
                }
                function Wr(t) {
                  return "function" == typeof t
                    ? t
                    : null == t
                      ? es
                      : "object" == typeof t
                        ? Fu(t)
                          ? jr(t[0], t[1])
                          : Ur(t)
                        : ls(t);
                }
                function zr(t) {
                  if (!_o(t)) return pn(t);
                  var e = [];
                  for (var n in Et(t))
                    zt.call(t, n) && "constructor" != n && e.push(n);
                  return e;
                }
                function Lr(t, e) {
                  return t < e;
                }
                function Mr(t, e) {
                  var n = -1,
                    i = Gu(t) ? r(t.length) : [];
                  return (
                    cr(t, function (t, r, o) {
                      i[++n] = e(t, r, o);
                    }),
                    i
                  );
                }
                function Ur(t) {
                  var e = uo(t);
                  return 1 == e.length && e[0][2]
                    ? ko(e[0][0], e[0][1])
                    : function (n) {
                        return n === t || Dr(n, t, e);
                      };
                }
                function jr(t, e) {
                  return yo(t) && mo(e)
                    ? ko(Mo(t), e)
                    : function (n) {
                        var r = Ea(n, t);
                        return r === i && r === e ? Sa(n, t) : Rr(e, r, 3);
                      };
                }
                function Br(t, e, n, r, o) {
                  t !== e &&
                    vr(
                      e,
                      function (u, a) {
                        if ((o || (o = new Vn()), Ju(u)))
                          !(function (t, e, n, r, o, u, a) {
                            var s = So(t, n),
                              c = So(e, n),
                              l = a.get(c);
                            if (l) Hn(t, n, l);
                            else {
                              var f = u ? u(s, c, n + "", t, e, a) : i,
                                h = f === i;
                              if (h) {
                                var d = Fu(c),
                                  p = !d && Vu(c),
                                  v = !d && !p && aa(c);
                                (f = c),
                                  d || p || v
                                    ? Fu(s)
                                      ? (f = s)
                                      : Ku(s)
                                        ? (f = Si(s))
                                        : p
                                          ? ((h = !1), (f = wi(c, !0)))
                                          : v
                                            ? ((h = !1), (f = mi(c, !0)))
                                            : (f = [])
                                    : na(c) || qu(c)
                                      ? ((f = s),
                                        qu(s)
                                          ? (f = va(s))
                                          : (Ju(s) && !Yu(s)) || (f = ho(c)))
                                      : (h = !1);
                              }
                              h && (a.set(c, f), o(f, c, r, u, a), a.delete(c)),
                                Hn(t, n, f);
                            }
                          })(t, e, a, n, Br, r, o);
                        else {
                          var s = r ? r(So(t, a), u, a + "", t, e, o) : i;
                          s === i && (s = u), Hn(t, a, s);
                        }
                      },
                      Da,
                    );
                }
                function Or(t, e) {
                  var n = t.length;
                  if (n) return vo((e += e < 0 ? n : 0), n) ? t[e] : i;
                }
                function Cr(t, e, n) {
                  e = e.length
                    ? Pe(e, function (t) {
                        return Fu(t)
                          ? function (e) {
                              return _r(e, 1 === t.length ? t[0] : t);
                            }
                          : t;
                      })
                    : [es];
                  var r = -1;
                  e = Pe(e, Ye(io()));
                  var i = Mr(t, function (t, n, i) {
                    var o = Pe(e, function (e) {
                      return e(t);
                    });
                    return { criteria: o, index: ++r, value: t };
                  });
                  return (function (t, e) {
                    var r = t.length;
                    for (
                      t.sort(function (t, e) {
                        return (function (t, e, n) {
                          for (
                            var r = -1,
                              i = t.criteria,
                              o = e.criteria,
                              u = i.length,
                              a = n.length;
                            ++r < u;

                          ) {
                            var s = ki(i[r], o[r]);
                            if (s)
                              return r >= a ? s : s * ("desc" == n[r] ? -1 : 1);
                          }
                          return t.index - e.index;
                        })(t, e, n);
                      });
                      r--;

                    )
                      t[r] = t[r].value;
                    return t;
                  })(i);
                }
                function qr(t, e, n) {
                  for (var r = -1, i = e.length, o = {}; ++r < i; ) {
                    var u = e[r],
                      a = _r(t, u);
                    n(a, u) && Yr(o, vi(u, t), a);
                  }
                  return o;
                }
                function Fr(t, e, n, r) {
                  var i = r ? Ce : Oe,
                    o = -1,
                    u = e.length,
                    a = t;
                  for (
                    t === e && (e = Si(e)), n && (a = Pe(t, Ye(n)));
                    ++o < u;

                  )
                    for (
                      var s = 0, c = e[o], l = n ? n(c) : c;
                      (s = i(a, l, s, r)) > -1;

                    )
                      a !== t && Qt.call(a, s, 1), Qt.call(t, s, 1);
                  return t;
                }
                function Nr(t, e) {
                  for (var n = t ? e.length : 0, r = n - 1; n--; ) {
                    var i = e[n];
                    if (n == r || i !== o) {
                      var o = i;
                      vo(i) ? Qt.call(t, i, 1) : ai(t, i);
                    }
                  }
                  return t;
                }
                function Gr(t, e) {
                  return t + de(wn() * (e - t + 1));
                }
                function Kr(t, e) {
                  var n = "";
                  if (!t || e < 1 || e > f) return n;
                  do {
                    e % 2 && (n += t), (e = de(e / 2)) && (t += t);
                  } while (e);
                  return n;
                }
                function Vr(t, e) {
                  return To(Io(t, e, es), t + "");
                }
                function Qr(t) {
                  return Zn(Ba(t));
                }
                function Zr(t, e) {
                  var n = Ba(t);
                  return Po(n, ir(e, 0, n.length));
                }
                function Yr(t, e, n, r) {
                  if (!Ju(t)) return t;
                  for (
                    var o = -1, u = (e = vi(e, t)).length, a = u - 1, s = t;
                    null != s && ++o < u;

                  ) {
                    var c = Mo(e[o]),
                      l = n;
                    if (
                      "__proto__" === c ||
                      "constructor" === c ||
                      "prototype" === c
                    )
                      return t;
                    if (o != a) {
                      var f = s[c];
                      (l = r ? r(f, c, s) : i) === i &&
                        (l = Ju(f) ? f : vo(e[o + 1]) ? [] : {});
                    }
                    Jn(s, c, l), (s = s[c]);
                  }
                  return t;
                }
                var Xr = xn
                    ? function (t, e) {
                        return xn.set(t, e), t;
                      }
                    : es,
                  Hr = te
                    ? function (t, e) {
                        return te(t, "toString", {
                          configurable: !0,
                          enumerable: !1,
                          value: Ja(e),
                          writable: !0,
                        });
                      }
                    : es;
                function Jr(t) {
                  return Po(Ba(t));
                }
                function $r(t, e, n) {
                  var i = -1,
                    o = t.length;
                  e < 0 && (e = -e > o ? 0 : o + e),
                    (n = n > o ? o : n) < 0 && (n += o),
                    (o = e > n ? 0 : (n - e) >>> 0),
                    (e >>>= 0);
                  for (var u = r(o); ++i < o; ) u[i] = t[i + e];
                  return u;
                }
                function ti(t, e) {
                  var n;
                  return (
                    cr(t, function (t, r, i) {
                      return !(n = e(t, r, i));
                    }),
                    !!n
                  );
                }
                function ei(t, e, n) {
                  var r = 0,
                    i = null == t ? r : t.length;
                  if ("number" == typeof e && e == e && i <= 2147483647) {
                    for (; r < i; ) {
                      var o = (r + i) >>> 1,
                        u = t[o];
                      null !== u && !ua(u) && (n ? u <= e : u < e)
                        ? (r = o + 1)
                        : (i = o);
                    }
                    return i;
                  }
                  return ni(t, e, es, n);
                }
                function ni(t, e, n, r) {
                  var o = 0,
                    u = null == t ? 0 : t.length;
                  if (0 === u) return 0;
                  for (
                    var a = (e = n(e)) != e,
                      s = null === e,
                      c = ua(e),
                      l = e === i;
                    o < u;

                  ) {
                    var f = de((o + u) / 2),
                      h = n(t[f]),
                      d = h !== i,
                      p = null === h,
                      v = h == h,
                      g = ua(h);
                    if (a) var y = r || v;
                    else
                      y = l
                        ? v && (r || d)
                        : s
                          ? v && d && (r || !p)
                          : c
                            ? v && d && !p && (r || !g)
                            : !p && !g && (r ? h <= e : h < e);
                    y ? (o = f + 1) : (u = f);
                  }
                  return gn(u, 4294967294);
                }
                function ri(t, e) {
                  for (var n = -1, r = t.length, i = 0, o = []; ++n < r; ) {
                    var u = t[n],
                      a = e ? e(u) : u;
                    if (!n || !Bu(a, s)) {
                      var s = a;
                      o[i++] = 0 === u ? 0 : u;
                    }
                  }
                  return o;
                }
                function ii(t) {
                  return "number" == typeof t ? t : ua(t) ? h : +t;
                }
                function oi(t) {
                  if ("string" == typeof t) return t;
                  if (Fu(t)) return Pe(t, oi) + "";
                  if (ua(t)) return Un ? Un.call(t) : "";
                  var e = t + "";
                  return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
                }
                function ui(t, e, n) {
                  var r = -1,
                    i = Re,
                    o = t.length,
                    u = !0,
                    a = [],
                    s = a;
                  if (n) (u = !1), (i = De);
                  else if (o >= 200) {
                    var c = e ? null : Ki(t);
                    if (c) return sn(c);
                    (u = !1), (i = He), (s = new Kn());
                  } else s = e ? [] : a;
                  t: for (; ++r < o; ) {
                    var l = t[r],
                      f = e ? e(l) : l;
                    if (((l = n || 0 !== l ? l : 0), u && f == f)) {
                      for (var h = s.length; h--; ) if (s[h] === f) continue t;
                      e && s.push(f), a.push(l);
                    } else i(s, f, n) || (s !== a && s.push(f), a.push(l));
                  }
                  return a;
                }
                function ai(t, e) {
                  return (
                    null == (t = Eo(t, (e = vi(e, t)))) || delete t[Mo(Zo(e))]
                  );
                }
                function si(t, e, n, r) {
                  return Yr(t, e, n(_r(t, e)), r);
                }
                function ci(t, e, n, r) {
                  for (
                    var i = t.length, o = r ? i : -1;
                    (r ? o-- : ++o < i) && e(t[o], o, t);

                  );
                  return n
                    ? $r(t, r ? 0 : o, r ? o + 1 : i)
                    : $r(t, r ? o + 1 : 0, r ? i : o);
                }
                function li(t, e) {
                  var n = t;
                  return (
                    n instanceof qn && (n = n.value()),
                    ze(
                      e,
                      function (t, e) {
                        return e.func.apply(e.thisArg, We([t], e.args));
                      },
                      n,
                    )
                  );
                }
                function fi(t, e, n) {
                  var i = t.length;
                  if (i < 2) return i ? ui(t[0]) : [];
                  for (var o = -1, u = r(i); ++o < i; )
                    for (var a = t[o], s = -1; ++s < i; )
                      s != o && (u[o] = sr(u[o] || a, t[s], e, n));
                  return ui(pr(u, 1), e, n);
                }
                function hi(t, e, n) {
                  for (
                    var r = -1, o = t.length, u = e.length, a = {};
                    ++r < o;

                  ) {
                    var s = r < u ? e[r] : i;
                    n(a, t[r], s);
                  }
                  return a;
                }
                function di(t) {
                  return Ku(t) ? t : [];
                }
                function pi(t) {
                  return "function" == typeof t ? t : es;
                }
                function vi(t, e) {
                  return Fu(t) ? t : yo(t, e) ? [t] : Lo(ga(t));
                }
                var gi = Vr;
                function yi(t, e, n) {
                  var r = t.length;
                  return (n = n === i ? r : n), !e && n >= r ? t : $r(t, e, n);
                }
                var bi =
                  ue ||
                  function (t) {
                    return fe.clearTimeout(t);
                  };
                function wi(t, e) {
                  if (e) return t.slice();
                  var n = t.length,
                    r = Nt ? Nt(n) : new t.constructor(n);
                  return t.copy(r), r;
                }
                function _i(t) {
                  var e = new t.constructor(t.byteLength);
                  return new Ft(e).set(new Ft(t)), e;
                }
                function mi(t, e) {
                  var n = e ? _i(t.buffer) : t.buffer;
                  return new t.constructor(n, t.byteOffset, t.length);
                }
                function ki(t, e) {
                  if (t !== e) {
                    var n = t !== i,
                      r = null === t,
                      o = t == t,
                      u = ua(t),
                      a = e !== i,
                      s = null === e,
                      c = e == e,
                      l = ua(e);
                    if (
                      (!s && !l && !u && t > e) ||
                      (u && a && c && !s && !l) ||
                      (r && a && c) ||
                      (!n && c) ||
                      !o
                    )
                      return 1;
                    if (
                      (!r && !u && !l && t < e) ||
                      (l && n && o && !r && !u) ||
                      (s && n && o) ||
                      (!a && o) ||
                      !c
                    )
                      return -1;
                  }
                  return 0;
                }
                function Ii(t, e, n, i) {
                  for (
                    var o = -1,
                      u = t.length,
                      a = n.length,
                      s = -1,
                      c = e.length,
                      l = vn(u - a, 0),
                      f = r(c + l),
                      h = !i;
                    ++s < c;

                  )
                    f[s] = e[s];
                  for (; ++o < a; ) (h || o < u) && (f[n[o]] = t[o]);
                  for (; l--; ) f[s++] = t[o++];
                  return f;
                }
                function Ei(t, e, n, i) {
                  for (
                    var o = -1,
                      u = t.length,
                      a = -1,
                      s = n.length,
                      c = -1,
                      l = e.length,
                      f = vn(u - s, 0),
                      h = r(f + l),
                      d = !i;
                    ++o < f;

                  )
                    h[o] = t[o];
                  for (var p = o; ++c < l; ) h[p + c] = e[c];
                  for (; ++a < s; ) (d || o < u) && (h[p + n[a]] = t[o++]);
                  return h;
                }
                function Si(t, e) {
                  var n = -1,
                    i = t.length;
                  for (e || (e = r(i)); ++n < i; ) e[n] = t[n];
                  return e;
                }
                function Ai(t, e, n, r) {
                  var o = !n;
                  n || (n = {});
                  for (var u = -1, a = e.length; ++u < a; ) {
                    var s = e[u],
                      c = r ? r(n[s], t[s], s, n, t) : i;
                    c === i && (c = t[s]), o ? nr(n, s, c) : Jn(n, s, c);
                  }
                  return n;
                }
                function xi(t, e) {
                  return function (n, r) {
                    var i = Fu(n) ? Ee : tr,
                      o = e ? e() : {};
                    return i(n, t, io(r, 2), o);
                  };
                }
                function Ti(t) {
                  return Vr(function (e, n) {
                    var r = -1,
                      o = n.length,
                      u = o > 1 ? n[o - 1] : i,
                      a = o > 2 ? n[2] : i;
                    for (
                      u = t.length > 3 && "function" == typeof u ? (o--, u) : i,
                        a &&
                          go(n[0], n[1], a) &&
                          ((u = o < 3 ? i : u), (o = 1)),
                        e = Et(e);
                      ++r < o;

                    ) {
                      var s = n[r];
                      s && t(e, s, r, u);
                    }
                    return e;
                  });
                }
                function Ri(t, e) {
                  return function (n, r) {
                    if (null == n) return n;
                    if (!Gu(n)) return t(n, r);
                    for (
                      var i = n.length, o = e ? i : -1, u = Et(n);
                      (e ? o-- : ++o < i) && !1 !== r(u[o], o, u);

                    );
                    return n;
                  };
                }
                function Di(t) {
                  return function (e, n, r) {
                    for (var i = -1, o = Et(e), u = r(e), a = u.length; a--; ) {
                      var s = u[t ? a : ++i];
                      if (!1 === n(o[s], s, o)) break;
                    }
                    return e;
                  };
                }
                function Pi(t) {
                  return function (e) {
                    var n = rn((e = ga(e))) ? ln(e) : i,
                      r = n ? n[0] : e.charAt(0),
                      o = n ? yi(n, 1).join("") : e.slice(1);
                    return r[t]() + o;
                  };
                }
                function Wi(t) {
                  return function (e) {
                    return ze(Ya(qa(e).replace(Xt, "")), t, "");
                  };
                }
                function zi(t) {
                  return function () {
                    var e = arguments;
                    switch (e.length) {
                      case 0:
                        return new t();
                      case 1:
                        return new t(e[0]);
                      case 2:
                        return new t(e[0], e[1]);
                      case 3:
                        return new t(e[0], e[1], e[2]);
                      case 4:
                        return new t(e[0], e[1], e[2], e[3]);
                      case 5:
                        return new t(e[0], e[1], e[2], e[3], e[4]);
                      case 6:
                        return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
                      case 7:
                        return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
                    }
                    var n = Bn(t.prototype),
                      r = t.apply(n, e);
                    return Ju(r) ? r : n;
                  };
                }
                function Li(t) {
                  return function (e, n, r) {
                    var o = Et(e);
                    if (!Gu(e)) {
                      var u = io(n, 3);
                      (e = Ra(e)),
                        (n = function (t) {
                          return u(o[t], t, o);
                        });
                    }
                    var a = t(e, n, r);
                    return a > -1 ? o[u ? e[a] : a] : i;
                  };
                }
                function Mi(t) {
                  return Ji(function (e) {
                    var n = e.length,
                      r = n,
                      u = Cn.prototype.thru;
                    for (t && e.reverse(); r--; ) {
                      var a = e[r];
                      if ("function" != typeof a) throw new xt(o);
                      if (u && !s && "wrapper" == no(a)) var s = new Cn([], !0);
                    }
                    for (r = s ? r : n; ++r < n; ) {
                      var c = no((a = e[r])),
                        l = "wrapper" == c ? eo(a) : i;
                      s =
                        l &&
                        bo(l[0]) &&
                        424 == l[1] &&
                        !l[4].length &&
                        1 == l[9]
                          ? s[no(l[0])].apply(s, l[3])
                          : 1 == a.length && bo(a)
                            ? s[c]()
                            : s.thru(a);
                    }
                    return function () {
                      var t = arguments,
                        r = t[0];
                      if (s && 1 == t.length && Fu(r))
                        return s.plant(r).value();
                      for (
                        var i = 0, o = n ? e[i].apply(this, t) : r;
                        ++i < n;

                      )
                        o = e[i].call(this, o);
                      return o;
                    };
                  });
                }
                function Ui(t, e, n, o, u, a, s, l, f, h) {
                  var d = e & c,
                    p = 1 & e,
                    v = 2 & e,
                    g = 24 & e,
                    y = 512 & e,
                    b = v ? i : zi(t);
                  return function c() {
                    for (var w = arguments.length, _ = r(w), m = w; m--; )
                      _[m] = arguments[m];
                    if (g)
                      var k = ro(c),
                        I = (function (t, e) {
                          for (var n = t.length, r = 0; n--; )
                            t[n] === e && ++r;
                          return r;
                        })(_, k);
                    if (
                      (o && (_ = Ii(_, o, u, g)),
                      a && (_ = Ei(_, a, s, g)),
                      (w -= I),
                      g && w < h)
                    ) {
                      var E = an(_, k);
                      return Ni(t, e, Ui, c.placeholder, n, _, E, l, f, h - w);
                    }
                    var S = p ? n : this,
                      A = v ? S[t] : t;
                    return (
                      (w = _.length),
                      l
                        ? (_ = (function (t, e) {
                            for (
                              var n = t.length, r = gn(e.length, n), o = Si(t);
                              r--;

                            ) {
                              var u = e[r];
                              t[r] = vo(u, n) ? o[u] : i;
                            }
                            return t;
                          })(_, l))
                        : y && w > 1 && _.reverse(),
                      d && f < w && (_.length = f),
                      this &&
                        this !== fe &&
                        this instanceof c &&
                        (A = b || zi(A)),
                      A.apply(S, _)
                    );
                  };
                }
                function ji(t, e) {
                  return function (n, r) {
                    return (function (t, e, n, r) {
                      return (
                        yr(t, function (t, i, o) {
                          e(r, n(t), i, o);
                        }),
                        r
                      );
                    })(n, t, e(r), {});
                  };
                }
                function Bi(t, e) {
                  return function (n, r) {
                    var o;
                    if (n === i && r === i) return e;
                    if ((n !== i && (o = n), r !== i)) {
                      if (o === i) return r;
                      "string" == typeof n || "string" == typeof r
                        ? ((n = oi(n)), (r = oi(r)))
                        : ((n = ii(n)), (r = ii(r))),
                        (o = t(n, r));
                    }
                    return o;
                  };
                }
                function Oi(t) {
                  return Ji(function (e) {
                    return (
                      (e = Pe(e, Ye(io()))),
                      Vr(function (n) {
                        var r = this;
                        return t(e, function (t) {
                          return Ie(t, r, n);
                        });
                      })
                    );
                  });
                }
                function Ci(t, e) {
                  var n = (e = e === i ? " " : oi(e)).length;
                  if (n < 2) return n ? Kr(e, t) : e;
                  var r = Kr(e, he(t / cn(e)));
                  return rn(e) ? yi(ln(r), 0, t).join("") : r.slice(0, t);
                }
                function qi(t) {
                  return function (e, n, o) {
                    return (
                      o && "number" != typeof o && go(e, n, o) && (n = o = i),
                      (e = fa(e)),
                      n === i ? ((n = e), (e = 0)) : (n = fa(n)),
                      (function (t, e, n, i) {
                        for (
                          var o = -1,
                            u = vn(he((e - t) / (n || 1)), 0),
                            a = r(u);
                          u--;

                        )
                          (a[i ? u : ++o] = t), (t += n);
                        return a;
                      })(e, n, (o = o === i ? (e < n ? 1 : -1) : fa(o)), t)
                    );
                  };
                }
                function Fi(t) {
                  return function (e, n) {
                    return (
                      ("string" == typeof e && "string" == typeof n) ||
                        ((e = pa(e)), (n = pa(n))),
                      t(e, n)
                    );
                  };
                }
                function Ni(t, e, n, r, o, u, a, c, l, f) {
                  var h = 8 & e;
                  (e |= h ? s : 64), 4 & (e &= ~(h ? 64 : s)) || (e &= -4);
                  var d = [
                      t,
                      e,
                      o,
                      h ? u : i,
                      h ? a : i,
                      h ? i : u,
                      h ? i : a,
                      c,
                      l,
                      f,
                    ],
                    p = n.apply(i, d);
                  return bo(t) && Ao(p, d), (p.placeholder = r), Ro(p, t, e);
                }
                function Gi(t) {
                  var e = It[t];
                  return function (t, n) {
                    if (
                      ((t = pa(t)),
                      (n = null == n ? 0 : gn(ha(n), 292)) && Ue(t))
                    ) {
                      var r = (ga(t) + "e").split("e");
                      return +(
                        (r = (ga(e(r[0] + "e" + (+r[1] + n))) + "e").split(
                          "e",
                        ))[0] +
                        "e" +
                        (+r[1] - n)
                      );
                    }
                    return e(t);
                  };
                }
                var Ki =
                  En && 1 / sn(new En([, -0]))[1] == l
                    ? function (t) {
                        return new En(t);
                      }
                    : us;
                function Vi(t) {
                  return function (e) {
                    var n = lo(e);
                    return n == k
                      ? on(e)
                      : n == x
                        ? (function (t) {
                            var e = -1,
                              n = Array(t.size);
                            return (
                              t.forEach(function (t) {
                                n[++e] = [t, t];
                              }),
                              n
                            );
                          })(e)
                        : (function (t, e) {
                            return Pe(e, function (e) {
                              return [e, t[e]];
                            });
                          })(e, t(e));
                  };
                }
                function Qi(t, e, n, u, l, f, h, d) {
                  var p = 2 & e;
                  if (!p && "function" != typeof t) throw new xt(o);
                  var v = u ? u.length : 0;
                  if (
                    (v || ((e &= -97), (u = l = i)),
                    (h = h === i ? h : vn(ha(h), 0)),
                    (d = d === i ? d : ha(d)),
                    (v -= l ? l.length : 0),
                    64 & e)
                  ) {
                    var g = u,
                      y = l;
                    u = l = i;
                  }
                  var b = p ? i : eo(t),
                    w = [t, e, n, u, l, g, y, f, h, d];
                  if (
                    (b &&
                      (function (t, e) {
                        var n = t[1],
                          r = e[1],
                          i = n | r,
                          o = i < 131,
                          u =
                            (r == c && 8 == n) ||
                            (r == c && 256 == n && t[7].length <= e[8]) ||
                            (384 == r && e[7].length <= e[8] && 8 == n);
                        if (!o && !u) return t;
                        1 & r && ((t[2] = e[2]), (i |= 1 & n ? 0 : 4));
                        var s = e[3];
                        if (s) {
                          var l = t[3];
                          (t[3] = l ? Ii(l, s, e[4]) : s),
                            (t[4] = l ? an(t[3], a) : e[4]);
                        }
                        (s = e[5]) &&
                          ((l = t[5]),
                          (t[5] = l ? Ei(l, s, e[6]) : s),
                          (t[6] = l ? an(t[5], a) : e[6])),
                          (s = e[7]) && (t[7] = s),
                          r & c &&
                            (t[8] = null == t[8] ? e[8] : gn(t[8], e[8])),
                          null == t[9] && (t[9] = e[9]),
                          (t[0] = e[0]),
                          (t[1] = i);
                      })(w, b),
                    (t = w[0]),
                    (e = w[1]),
                    (n = w[2]),
                    (u = w[3]),
                    (l = w[4]),
                    !(d = w[9] =
                      w[9] === i ? (p ? 0 : t.length) : vn(w[9] - v, 0)) &&
                      24 & e &&
                      (e &= -25),
                    e && 1 != e)
                  )
                    _ =
                      8 == e || 16 == e
                        ? (function (t, e, n) {
                            var o = zi(t);
                            return function u() {
                              for (
                                var a = arguments.length,
                                  s = r(a),
                                  c = a,
                                  l = ro(u);
                                c--;

                              )
                                s[c] = arguments[c];
                              var f =
                                a < 3 && s[0] !== l && s[a - 1] !== l
                                  ? []
                                  : an(s, l);
                              return (a -= f.length) < n
                                ? Ni(
                                    t,
                                    e,
                                    Ui,
                                    u.placeholder,
                                    i,
                                    s,
                                    f,
                                    i,
                                    i,
                                    n - a,
                                  )
                                : Ie(
                                    this && this !== fe && this instanceof u
                                      ? o
                                      : t,
                                    this,
                                    s,
                                  );
                            };
                          })(t, e, d)
                        : (e != s && 33 != e) || l.length
                          ? Ui.apply(i, w)
                          : (function (t, e, n, i) {
                              var o = 1 & e,
                                u = zi(t);
                              return function e() {
                                for (
                                  var a = -1,
                                    s = arguments.length,
                                    c = -1,
                                    l = i.length,
                                    f = r(l + s),
                                    h =
                                      this && this !== fe && this instanceof e
                                        ? u
                                        : t;
                                  ++c < l;

                                )
                                  f[c] = i[c];
                                for (; s--; ) f[c++] = arguments[++a];
                                return Ie(h, o ? n : this, f);
                              };
                            })(t, e, n, u);
                  else
                    var _ = (function (t, e, n) {
                      var r = 1 & e,
                        i = zi(t);
                      return function e() {
                        return (
                          this && this !== fe && this instanceof e ? i : t
                        ).apply(r ? n : this, arguments);
                      };
                    })(t, e, n);
                  return Ro((b ? Xr : Ao)(_, w), t, e);
                }
                function Zi(t, e, n, r) {
                  return t === i || (Bu(t, Dt[n]) && !zt.call(r, n)) ? e : t;
                }
                function Yi(t, e, n, r, o, u) {
                  return (
                    Ju(t) &&
                      Ju(e) &&
                      (u.set(e, t), Br(t, e, i, Yi, u), u.delete(e)),
                    t
                  );
                }
                function Xi(t) {
                  return na(t) ? i : t;
                }
                function Hi(t, e, n, r, o, u) {
                  var a = 1 & n,
                    s = t.length,
                    c = e.length;
                  if (s != c && !(a && c > s)) return !1;
                  var l = u.get(t),
                    f = u.get(e);
                  if (l && f) return l == e && f == t;
                  var h = -1,
                    d = !0,
                    p = 2 & n ? new Kn() : i;
                  for (u.set(t, e), u.set(e, t); ++h < s; ) {
                    var v = t[h],
                      g = e[h];
                    if (r)
                      var y = a ? r(g, v, h, e, t, u) : r(v, g, h, t, e, u);
                    if (y !== i) {
                      if (y) continue;
                      d = !1;
                      break;
                    }
                    if (p) {
                      if (
                        !Me(e, function (t, e) {
                          if (!He(p, e) && (v === t || o(v, t, n, r, u)))
                            return p.push(e);
                        })
                      ) {
                        d = !1;
                        break;
                      }
                    } else if (v !== g && !o(v, g, n, r, u)) {
                      d = !1;
                      break;
                    }
                  }
                  return u.delete(t), u.delete(e), d;
                }
                function Ji(t) {
                  return To(Io(t, i, No), t + "");
                }
                function $i(t) {
                  return mr(t, Ra, so);
                }
                function to(t) {
                  return mr(t, Da, co);
                }
                var eo = xn
                  ? function (t) {
                      return xn.get(t);
                    }
                  : us;
                function no(t) {
                  for (
                    var e = t.name + "",
                      n = Tn[e],
                      r = zt.call(Tn, e) ? n.length : 0;
                    r--;

                  ) {
                    var i = n[r],
                      o = i.func;
                    if (null == o || o == t) return i.name;
                  }
                  return e;
                }
                function ro(t) {
                  return (zt.call(jn, "placeholder") ? jn : t).placeholder;
                }
                function io() {
                  var t = jn.iteratee || ns;
                  return (
                    (t = t === ns ? Wr : t),
                    arguments.length ? t(arguments[0], arguments[1]) : t
                  );
                }
                function oo(t, e) {
                  var n,
                    r,
                    i = t.__data__;
                  return (
                    "string" == (r = typeof (n = e)) ||
                    "number" == r ||
                    "symbol" == r ||
                    "boolean" == r
                      ? "__proto__" !== n
                      : null === n
                  )
                    ? i["string" == typeof e ? "string" : "hash"]
                    : i.map;
                }
                function uo(t) {
                  for (var e = Ra(t), n = e.length; n--; ) {
                    var r = e[n],
                      i = t[r];
                    e[n] = [r, i, mo(i)];
                  }
                  return e;
                }
                function ao(t, e) {
                  var n = (function (t, e) {
                    return null == t ? i : t[e];
                  })(t, e);
                  return Pr(n) ? n : i;
                }
                var so = ve
                    ? function (t) {
                        return null == t
                          ? []
                          : ((t = Et(t)),
                            Te(ve(t), function (e) {
                              return Vt.call(t, e);
                            }));
                      }
                    : ds,
                  co = ve
                    ? function (t) {
                        for (var e = []; t; ) We(e, so(t)), (t = Gt(t));
                        return e;
                      }
                    : ds,
                  lo = kr;
                function fo(t, e, n) {
                  for (
                    var r = -1, i = (e = vi(e, t)).length, o = !1;
                    ++r < i;

                  ) {
                    var u = Mo(e[r]);
                    if (!(o = null != t && n(t, u))) break;
                    t = t[u];
                  }
                  return o || ++r != i
                    ? o
                    : !!(i = null == t ? 0 : t.length) &&
                        Hu(i) &&
                        vo(u, i) &&
                        (Fu(t) || qu(t));
                }
                function ho(t) {
                  return "function" != typeof t.constructor || _o(t)
                    ? {}
                    : Bn(Gt(t));
                }
                function po(t) {
                  return Fu(t) || qu(t) || !!(Zt && t && t[Zt]);
                }
                function vo(t, e) {
                  var n = typeof t;
                  return (
                    !!(e = null == e ? f : e) &&
                    ("number" == n || ("symbol" != n && yt.test(t))) &&
                    t > -1 &&
                    t % 1 == 0 &&
                    t < e
                  );
                }
                function go(t, e, n) {
                  if (!Ju(n)) return !1;
                  var r = typeof e;
                  return (
                    !!("number" == r
                      ? Gu(n) && vo(e, n.length)
                      : "string" == r && e in n) && Bu(n[e], t)
                  );
                }
                function yo(t, e) {
                  if (Fu(t)) return !1;
                  var n = typeof t;
                  return (
                    !(
                      "number" != n &&
                      "symbol" != n &&
                      "boolean" != n &&
                      null != t &&
                      !ua(t)
                    ) ||
                    $.test(t) ||
                    !J.test(t) ||
                    (null != e && t in Et(e))
                  );
                }
                function bo(t) {
                  var e = no(t),
                    n = jn[e];
                  if ("function" != typeof n || !(e in qn.prototype)) return !1;
                  if (t === n) return !0;
                  var r = eo(n);
                  return !!r && t === r[0];
                }
                ((mn && lo(new mn(new ArrayBuffer(1))) != W) ||
                  (kn && lo(new kn()) != k) ||
                  (In && lo(In.resolve()) != S) ||
                  (En && lo(new En()) != x) ||
                  (Sn && lo(new Sn()) != D)) &&
                  (lo = function (t) {
                    var e = kr(t),
                      n = e == E ? t.constructor : i,
                      r = n ? Uo(n) : "";
                    if (r)
                      switch (r) {
                        case Rn:
                          return W;
                        case Dn:
                          return k;
                        case Pn:
                          return S;
                        case Wn:
                          return x;
                        case zn:
                          return D;
                      }
                    return e;
                  });
                var wo = Pt ? Yu : ps;
                function _o(t) {
                  var e = t && t.constructor;
                  return t === (("function" == typeof e && e.prototype) || Dt);
                }
                function mo(t) {
                  return t == t && !Ju(t);
                }
                function ko(t, e) {
                  return function (n) {
                    return null != n && n[t] === e && (e !== i || t in Et(n));
                  };
                }
                function Io(t, e, n) {
                  return (
                    (e = vn(e === i ? t.length - 1 : e, 0)),
                    function () {
                      for (
                        var i = arguments,
                          o = -1,
                          u = vn(i.length - e, 0),
                          a = r(u);
                        ++o < u;

                      )
                        a[o] = i[e + o];
                      o = -1;
                      for (var s = r(e + 1); ++o < e; ) s[o] = i[o];
                      return (s[e] = n(a)), Ie(t, this, s);
                    }
                  );
                }
                function Eo(t, e) {
                  return e.length < 2 ? t : _r(t, $r(e, 0, -1));
                }
                function So(t, e) {
                  if (
                    ("constructor" !== e || "function" != typeof t[e]) &&
                    "__proto__" != e
                  )
                    return t[e];
                }
                var Ao = Do(Xr),
                  xo =
                    le ||
                    function (t, e) {
                      return fe.setTimeout(t, e);
                    },
                  To = Do(Hr);
                function Ro(t, e, n) {
                  var r = e + "";
                  return To(
                    t,
                    (function (t, e) {
                      var n = e.length;
                      if (!n) return t;
                      var r = n - 1;
                      return (
                        (e[r] = (n > 1 ? "& " : "") + e[r]),
                        (e = e.join(n > 2 ? ", " : " ")),
                        t.replace(ot, "{\n/* [wrapped with " + e + "] */\n")
                      );
                    })(
                      r,
                      (function (t, e) {
                        return (
                          Se(p, function (n) {
                            var r = "_." + n[0];
                            e & n[1] && !Re(t, r) && t.push(r);
                          }),
                          t.sort()
                        );
                      })(
                        (function (t) {
                          var e = t.match(ut);
                          return e ? e[1].split(at) : [];
                        })(r),
                        n,
                      ),
                    ),
                  );
                }
                function Do(t) {
                  var e = 0,
                    n = 0;
                  return function () {
                    var r = yn(),
                      o = 16 - (r - n);
                    if (((n = r), o > 0)) {
                      if (++e >= 800) return arguments[0];
                    } else e = 0;
                    return t.apply(i, arguments);
                  };
                }
                function Po(t, e) {
                  var n = -1,
                    r = t.length,
                    o = r - 1;
                  for (e = e === i ? r : e; ++n < e; ) {
                    var u = Gr(n, o),
                      a = t[u];
                    (t[u] = t[n]), (t[n] = a);
                  }
                  return (t.length = e), t;
                }
                var Wo,
                  zo,
                  Lo =
                    ((Wo = Wu(
                      function (t) {
                        var e = [];
                        return (
                          46 === t.charCodeAt(0) && e.push(""),
                          t.replace(tt, function (t, n, r, i) {
                            e.push(r ? i.replace(lt, "$1") : n || t);
                          }),
                          e
                        );
                      },
                      function (t) {
                        return 500 === zo.size && zo.clear(), t;
                      },
                    )),
                    (zo = Wo.cache),
                    Wo);
                function Mo(t) {
                  if ("string" == typeof t || ua(t)) return t;
                  var e = t + "";
                  return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
                }
                function Uo(t) {
                  if (null != t) {
                    try {
                      return Wt.call(t);
                    } catch (t) {}
                    try {
                      return t + "";
                    } catch (t) {}
                  }
                  return "";
                }
                function jo(t) {
                  if (t instanceof qn) return t.clone();
                  var e = new Cn(t.__wrapped__, t.__chain__);
                  return (
                    (e.__actions__ = Si(t.__actions__)),
                    (e.__index__ = t.__index__),
                    (e.__values__ = t.__values__),
                    e
                  );
                }
                var Bo = Vr(function (t, e) {
                    return Ku(t) ? sr(t, pr(e, 1, Ku, !0)) : [];
                  }),
                  Oo = Vr(function (t, e) {
                    var n = Zo(e);
                    return (
                      Ku(n) && (n = i),
                      Ku(t) ? sr(t, pr(e, 1, Ku, !0), io(n, 2)) : []
                    );
                  }),
                  Co = Vr(function (t, e) {
                    var n = Zo(e);
                    return (
                      Ku(n) && (n = i),
                      Ku(t) ? sr(t, pr(e, 1, Ku, !0), i, n) : []
                    );
                  });
                function qo(t, e, n) {
                  var r = null == t ? 0 : t.length;
                  if (!r) return -1;
                  var i = null == n ? 0 : ha(n);
                  return i < 0 && (i = vn(r + i, 0)), Be(t, io(e, 3), i);
                }
                function Fo(t, e, n) {
                  var r = null == t ? 0 : t.length;
                  if (!r) return -1;
                  var o = r - 1;
                  return (
                    n !== i &&
                      ((o = ha(n)), (o = n < 0 ? vn(r + o, 0) : gn(o, r - 1))),
                    Be(t, io(e, 3), o, !0)
                  );
                }
                function No(t) {
                  return null != t && t.length ? pr(t, 1) : [];
                }
                function Go(t) {
                  return t && t.length ? t[0] : i;
                }
                var Ko = Vr(function (t) {
                    var e = Pe(t, di);
                    return e.length && e[0] === t[0] ? Ar(e) : [];
                  }),
                  Vo = Vr(function (t) {
                    var e = Zo(t),
                      n = Pe(t, di);
                    return (
                      e === Zo(n) ? (e = i) : n.pop(),
                      n.length && n[0] === t[0] ? Ar(n, io(e, 2)) : []
                    );
                  }),
                  Qo = Vr(function (t) {
                    var e = Zo(t),
                      n = Pe(t, di);
                    return (
                      (e = "function" == typeof e ? e : i) && n.pop(),
                      n.length && n[0] === t[0] ? Ar(n, i, e) : []
                    );
                  });
                function Zo(t) {
                  var e = null == t ? 0 : t.length;
                  return e ? t[e - 1] : i;
                }
                var Yo = Vr(Xo);
                function Xo(t, e) {
                  return t && t.length && e && e.length ? Fr(t, e) : t;
                }
                var Ho = Ji(function (t, e) {
                  var n = null == t ? 0 : t.length,
                    r = rr(t, e);
                  return (
                    Nr(
                      t,
                      Pe(e, function (t) {
                        return vo(t, n) ? +t : t;
                      }).sort(ki),
                    ),
                    r
                  );
                });
                function Jo(t) {
                  return null == t ? t : _n.call(t);
                }
                var $o = Vr(function (t) {
                    return ui(pr(t, 1, Ku, !0));
                  }),
                  tu = Vr(function (t) {
                    var e = Zo(t);
                    return Ku(e) && (e = i), ui(pr(t, 1, Ku, !0), io(e, 2));
                  }),
                  eu = Vr(function (t) {
                    var e = Zo(t);
                    return (
                      (e = "function" == typeof e ? e : i),
                      ui(pr(t, 1, Ku, !0), i, e)
                    );
                  });
                function nu(t) {
                  if (!t || !t.length) return [];
                  var e = 0;
                  return (
                    (t = Te(t, function (t) {
                      if (Ku(t)) return (e = vn(t.length, e)), !0;
                    })),
                    Qe(e, function (e) {
                      return Pe(t, Ne(e));
                    })
                  );
                }
                function ru(t, e) {
                  if (!t || !t.length) return [];
                  var n = nu(t);
                  return null == e
                    ? n
                    : Pe(n, function (t) {
                        return Ie(e, i, t);
                      });
                }
                var iu = Vr(function (t, e) {
                    return Ku(t) ? sr(t, e) : [];
                  }),
                  ou = Vr(function (t) {
                    return fi(Te(t, Ku));
                  }),
                  uu = Vr(function (t) {
                    var e = Zo(t);
                    return Ku(e) && (e = i), fi(Te(t, Ku), io(e, 2));
                  }),
                  au = Vr(function (t) {
                    var e = Zo(t);
                    return (
                      (e = "function" == typeof e ? e : i), fi(Te(t, Ku), i, e)
                    );
                  }),
                  su = Vr(nu),
                  cu = Vr(function (t) {
                    var e = t.length,
                      n = e > 1 ? t[e - 1] : i;
                    return (
                      (n = "function" == typeof n ? (t.pop(), n) : i), ru(t, n)
                    );
                  });
                function lu(t) {
                  var e = jn(t);
                  return (e.__chain__ = !0), e;
                }
                function fu(t, e) {
                  return e(t);
                }
                var hu = Ji(function (t) {
                    var e = t.length,
                      n = e ? t[0] : 0,
                      r = this.__wrapped__,
                      o = function (e) {
                        return rr(e, t);
                      };
                    return !(e > 1 || this.__actions__.length) &&
                      r instanceof qn &&
                      vo(n)
                      ? ((r = r.slice(n, +n + (e ? 1 : 0))).__actions__.push({
                          func: fu,
                          args: [o],
                          thisArg: i,
                        }),
                        new Cn(r, this.__chain__).thru(function (t) {
                          return e && !t.length && t.push(i), t;
                        }))
                      : this.thru(o);
                  }),
                  du = xi(function (t, e, n) {
                    zt.call(t, n) ? ++t[n] : nr(t, n, 1);
                  }),
                  pu = Li(qo),
                  vu = Li(Fo);
                function gu(t, e) {
                  return (Fu(t) ? Se : cr)(t, io(e, 3));
                }
                function yu(t, e) {
                  return (Fu(t) ? Ae : lr)(t, io(e, 3));
                }
                var bu = xi(function (t, e, n) {
                    zt.call(t, n) ? t[n].push(e) : nr(t, n, [e]);
                  }),
                  wu = Vr(function (t, e, n) {
                    var i = -1,
                      o = "function" == typeof e,
                      u = Gu(t) ? r(t.length) : [];
                    return (
                      cr(t, function (t) {
                        u[++i] = o ? Ie(e, t, n) : xr(t, e, n);
                      }),
                      u
                    );
                  }),
                  _u = xi(function (t, e, n) {
                    nr(t, n, e);
                  });
                function mu(t, e) {
                  return (Fu(t) ? Pe : Mr)(t, io(e, 3));
                }
                var ku = xi(
                    function (t, e, n) {
                      t[n ? 0 : 1].push(e);
                    },
                    function () {
                      return [[], []];
                    },
                  ),
                  Iu = Vr(function (t, e) {
                    if (null == t) return [];
                    var n = e.length;
                    return (
                      n > 1 && go(t, e[0], e[1])
                        ? (e = [])
                        : n > 2 && go(e[0], e[1], e[2]) && (e = [e[0]]),
                      Cr(t, pr(e, 1), [])
                    );
                  }),
                  Eu =
                    ce ||
                    function () {
                      return fe.Date.now();
                    };
                function Su(t, e, n) {
                  return (
                    (e = n ? i : e),
                    (e = t && null == e ? t.length : e),
                    Qi(t, c, i, i, i, i, e)
                  );
                }
                function Au(t, e) {
                  var n;
                  if ("function" != typeof e) throw new xt(o);
                  return (
                    (t = ha(t)),
                    function () {
                      return (
                        --t > 0 && (n = e.apply(this, arguments)),
                        t <= 1 && (e = i),
                        n
                      );
                    }
                  );
                }
                var xu = Vr(function (t, e, n) {
                    var r = 1;
                    if (n.length) {
                      var i = an(n, ro(xu));
                      r |= s;
                    }
                    return Qi(t, r, e, n, i);
                  }),
                  Tu = Vr(function (t, e, n) {
                    var r = 3;
                    if (n.length) {
                      var i = an(n, ro(Tu));
                      r |= s;
                    }
                    return Qi(e, r, t, n, i);
                  });
                function Ru(t, e, n) {
                  var r,
                    u,
                    a,
                    s,
                    c,
                    l,
                    f = 0,
                    h = !1,
                    d = !1,
                    p = !0;
                  if ("function" != typeof t) throw new xt(o);
                  function v(e) {
                    var n = r,
                      o = u;
                    return (r = u = i), (f = e), (s = t.apply(o, n));
                  }
                  function g(t) {
                    var n = t - l;
                    return l === i || n >= e || n < 0 || (d && t - f >= a);
                  }
                  function y() {
                    var t = Eu();
                    if (g(t)) return b(t);
                    c = xo(
                      y,
                      (function (t) {
                        var n = e - (t - l);
                        return d ? gn(n, a - (t - f)) : n;
                      })(t),
                    );
                  }
                  function b(t) {
                    return (c = i), p && r ? v(t) : ((r = u = i), s);
                  }
                  function w() {
                    var t = Eu(),
                      n = g(t);
                    if (((r = arguments), (u = this), (l = t), n)) {
                      if (c === i)
                        return (function (t) {
                          return (f = t), (c = xo(y, e)), h ? v(t) : s;
                        })(l);
                      if (d) return bi(c), (c = xo(y, e)), v(l);
                    }
                    return c === i && (c = xo(y, e)), s;
                  }
                  return (
                    (e = pa(e) || 0),
                    Ju(n) &&
                      ((h = !!n.leading),
                      (a = (d = "maxWait" in n)
                        ? vn(pa(n.maxWait) || 0, e)
                        : a),
                      (p = "trailing" in n ? !!n.trailing : p)),
                    (w.cancel = function () {
                      c !== i && bi(c), (f = 0), (r = l = u = c = i);
                    }),
                    (w.flush = function () {
                      return c === i ? s : b(Eu());
                    }),
                    w
                  );
                }
                var Du = Vr(function (t, e) {
                    return ar(t, 1, e);
                  }),
                  Pu = Vr(function (t, e, n) {
                    return ar(t, pa(e) || 0, n);
                  });
                function Wu(t, e) {
                  if (
                    "function" != typeof t ||
                    (null != e && "function" != typeof e)
                  )
                    throw new xt(o);
                  var n = function () {
                    var r = arguments,
                      i = e ? e.apply(this, r) : r[0],
                      o = n.cache;
                    if (o.has(i)) return o.get(i);
                    var u = t.apply(this, r);
                    return (n.cache = o.set(i, u) || o), u;
                  };
                  return (n.cache = new (Wu.Cache || Gn)()), n;
                }
                function zu(t) {
                  if ("function" != typeof t) throw new xt(o);
                  return function () {
                    var e = arguments;
                    switch (e.length) {
                      case 0:
                        return !t.call(this);
                      case 1:
                        return !t.call(this, e[0]);
                      case 2:
                        return !t.call(this, e[0], e[1]);
                      case 3:
                        return !t.call(this, e[0], e[1], e[2]);
                    }
                    return !t.apply(this, e);
                  };
                }
                Wu.Cache = Gn;
                var Lu = gi(function (t, e) {
                    var n = (e =
                      1 == e.length && Fu(e[0])
                        ? Pe(e[0], Ye(io()))
                        : Pe(pr(e, 1), Ye(io()))).length;
                    return Vr(function (r) {
                      for (var i = -1, o = gn(r.length, n); ++i < o; )
                        r[i] = e[i].call(this, r[i]);
                      return Ie(t, this, r);
                    });
                  }),
                  Mu = Vr(function (t, e) {
                    var n = an(e, ro(Mu));
                    return Qi(t, s, i, e, n);
                  }),
                  Uu = Vr(function (t, e) {
                    var n = an(e, ro(Uu));
                    return Qi(t, 64, i, e, n);
                  }),
                  ju = Ji(function (t, e) {
                    return Qi(t, 256, i, i, i, e);
                  });
                function Bu(t, e) {
                  return t === e || (t != t && e != e);
                }
                var Ou = Fi(Ir),
                  Cu = Fi(function (t, e) {
                    return t >= e;
                  }),
                  qu = Tr(
                    (function () {
                      return arguments;
                    })(),
                  )
                    ? Tr
                    : function (t) {
                        return (
                          $u(t) && zt.call(t, "callee") && !Vt.call(t, "callee")
                        );
                      },
                  Fu = r.isArray,
                  Nu = ye
                    ? Ye(ye)
                    : function (t) {
                        return $u(t) && kr(t) == P;
                      };
                function Gu(t) {
                  return null != t && Hu(t.length) && !Yu(t);
                }
                function Ku(t) {
                  return $u(t) && Gu(t);
                }
                var Vu = ge || ps,
                  Qu = be
                    ? Ye(be)
                    : function (t) {
                        return $u(t) && kr(t) == b;
                      };
                function Zu(t) {
                  if (!$u(t)) return !1;
                  var e = kr(t);
                  return (
                    e == w ||
                    "[object DOMException]" == e ||
                    ("string" == typeof t.message &&
                      "string" == typeof t.name &&
                      !na(t))
                  );
                }
                function Yu(t) {
                  if (!Ju(t)) return !1;
                  var e = kr(t);
                  return (
                    e == _ ||
                    e == m ||
                    "[object AsyncFunction]" == e ||
                    "[object Proxy]" == e
                  );
                }
                function Xu(t) {
                  return "number" == typeof t && t == ha(t);
                }
                function Hu(t) {
                  return "number" == typeof t && t > -1 && t % 1 == 0 && t <= f;
                }
                function Ju(t) {
                  var e = typeof t;
                  return null != t && ("object" == e || "function" == e);
                }
                function $u(t) {
                  return null != t && "object" == typeof t;
                }
                var ta = we
                  ? Ye(we)
                  : function (t) {
                      return $u(t) && lo(t) == k;
                    };
                function ea(t) {
                  return "number" == typeof t || ($u(t) && kr(t) == I);
                }
                function na(t) {
                  if (!$u(t) || kr(t) != E) return !1;
                  var e = Gt(t);
                  if (null === e) return !0;
                  var n = zt.call(e, "constructor") && e.constructor;
                  return (
                    "function" == typeof n && n instanceof n && Wt.call(n) == jt
                  );
                }
                var ra = _e
                    ? Ye(_e)
                    : function (t) {
                        return $u(t) && kr(t) == A;
                      },
                  ia = me
                    ? Ye(me)
                    : function (t) {
                        return $u(t) && lo(t) == x;
                      };
                function oa(t) {
                  return (
                    "string" == typeof t || (!Fu(t) && $u(t) && kr(t) == T)
                  );
                }
                function ua(t) {
                  return "symbol" == typeof t || ($u(t) && kr(t) == R);
                }
                var aa = ke
                    ? Ye(ke)
                    : function (t) {
                        return $u(t) && Hu(t.length) && !!ie[kr(t)];
                      },
                  sa = Fi(Lr),
                  ca = Fi(function (t, e) {
                    return t <= e;
                  });
                function la(t) {
                  if (!t) return [];
                  if (Gu(t)) return oa(t) ? ln(t) : Si(t);
                  if (Yt && t[Yt])
                    return (function (t) {
                      for (var e, n = []; !(e = t.next()).done; )
                        n.push(e.value);
                      return n;
                    })(t[Yt]());
                  var e = lo(t);
                  return (e == k ? on : e == x ? sn : Ba)(t);
                }
                function fa(t) {
                  return t
                    ? (t = pa(t)) === l || t === -1 / 0
                      ? 17976931348623157e292 * (t < 0 ? -1 : 1)
                      : t == t
                        ? t
                        : 0
                    : 0 === t
                      ? t
                      : 0;
                }
                function ha(t) {
                  var e = fa(t),
                    n = e % 1;
                  return e == e ? (n ? e - n : e) : 0;
                }
                function da(t) {
                  return t ? ir(ha(t), 0, d) : 0;
                }
                function pa(t) {
                  if ("number" == typeof t) return t;
                  if (ua(t)) return h;
                  if (Ju(t)) {
                    var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                    t = Ju(e) ? e + "" : e;
                  }
                  if ("string" != typeof t) return 0 === t ? t : +t;
                  t = Ze(t);
                  var n = pt.test(t);
                  return n || gt.test(t)
                    ? se(t.slice(2), n ? 2 : 8)
                    : dt.test(t)
                      ? h
                      : +t;
                }
                function va(t) {
                  return Ai(t, Da(t));
                }
                function ga(t) {
                  return null == t ? "" : oi(t);
                }
                var ya = Ti(function (t, e) {
                    if (_o(e) || Gu(e)) Ai(e, Ra(e), t);
                    else for (var n in e) zt.call(e, n) && Jn(t, n, e[n]);
                  }),
                  ba = Ti(function (t, e) {
                    Ai(e, Da(e), t);
                  }),
                  wa = Ti(function (t, e, n, r) {
                    Ai(e, Da(e), t, r);
                  }),
                  _a = Ti(function (t, e, n, r) {
                    Ai(e, Ra(e), t, r);
                  }),
                  ma = Ji(rr),
                  ka = Vr(function (t, e) {
                    t = Et(t);
                    var n = -1,
                      r = e.length,
                      o = r > 2 ? e[2] : i;
                    for (o && go(e[0], e[1], o) && (r = 1); ++n < r; )
                      for (
                        var u = e[n], a = Da(u), s = -1, c = a.length;
                        ++s < c;

                      ) {
                        var l = a[s],
                          f = t[l];
                        (f === i || (Bu(f, Dt[l]) && !zt.call(t, l))) &&
                          (t[l] = u[l]);
                      }
                    return t;
                  }),
                  Ia = Vr(function (t) {
                    return t.push(i, Yi), Ie(Wa, i, t);
                  });
                function Ea(t, e, n) {
                  var r = null == t ? i : _r(t, e);
                  return r === i ? n : r;
                }
                function Sa(t, e) {
                  return null != t && fo(t, e, Sr);
                }
                var Aa = ji(function (t, e, n) {
                    null != e &&
                      "function" != typeof e.toString &&
                      (e = Ut.call(e)),
                      (t[e] = n);
                  }, Ja(es)),
                  xa = ji(function (t, e, n) {
                    null != e &&
                      "function" != typeof e.toString &&
                      (e = Ut.call(e)),
                      zt.call(t, e) ? t[e].push(n) : (t[e] = [n]);
                  }, io),
                  Ta = Vr(xr);
                function Ra(t) {
                  return Gu(t) ? Qn(t) : zr(t);
                }
                function Da(t) {
                  return Gu(t)
                    ? Qn(t, !0)
                    : (function (t) {
                        if (!Ju(t))
                          return (function (t) {
                            var e = [];
                            if (null != t) for (var n in Et(t)) e.push(n);
                            return e;
                          })(t);
                        var e = _o(t),
                          n = [];
                        for (var r in t)
                          ("constructor" != r || (!e && zt.call(t, r))) &&
                            n.push(r);
                        return n;
                      })(t);
                }
                var Pa = Ti(function (t, e, n) {
                    Br(t, e, n);
                  }),
                  Wa = Ti(function (t, e, n, r) {
                    Br(t, e, n, r);
                  }),
                  za = Ji(function (t, e) {
                    var n = {};
                    if (null == t) return n;
                    var r = !1;
                    (e = Pe(e, function (e) {
                      return (e = vi(e, t)), r || (r = e.length > 1), e;
                    })),
                      Ai(t, to(t), n),
                      r && (n = or(n, 7, Xi));
                    for (var i = e.length; i--; ) ai(n, e[i]);
                    return n;
                  }),
                  La = Ji(function (t, e) {
                    return null == t
                      ? {}
                      : (function (t, e) {
                          return qr(t, e, function (e, n) {
                            return Sa(t, n);
                          });
                        })(t, e);
                  });
                function Ma(t, e) {
                  if (null == t) return {};
                  var n = Pe(to(t), function (t) {
                    return [t];
                  });
                  return (
                    (e = io(e)),
                    qr(t, n, function (t, n) {
                      return e(t, n[0]);
                    })
                  );
                }
                var Ua = Vi(Ra),
                  ja = Vi(Da);
                function Ba(t) {
                  return null == t ? [] : Xe(t, Ra(t));
                }
                var Oa = Wi(function (t, e, n) {
                  return (e = e.toLowerCase()), t + (n ? Ca(e) : e);
                });
                function Ca(t) {
                  return Za(ga(t).toLowerCase());
                }
                function qa(t) {
                  return (t = ga(t)) && t.replace(bt, tn).replace(Ht, "");
                }
                var Fa = Wi(function (t, e, n) {
                    return t + (n ? "-" : "") + e.toLowerCase();
                  }),
                  Na = Wi(function (t, e, n) {
                    return t + (n ? " " : "") + e.toLowerCase();
                  }),
                  Ga = Pi("toLowerCase"),
                  Ka = Wi(function (t, e, n) {
                    return t + (n ? "_" : "") + e.toLowerCase();
                  }),
                  Va = Wi(function (t, e, n) {
                    return t + (n ? " " : "") + Za(e);
                  }),
                  Qa = Wi(function (t, e, n) {
                    return t + (n ? " " : "") + e.toUpperCase();
                  }),
                  Za = Pi("toUpperCase");
                function Ya(t, e, n) {
                  return (
                    (t = ga(t)),
                    (e = n ? i : e) === i
                      ? (function (t) {
                          return ee.test(t);
                        })(t)
                        ? (function (t) {
                            return t.match($t) || [];
                          })(t)
                        : (function (t) {
                            return t.match(st) || [];
                          })(t)
                      : t.match(e) || []
                  );
                }
                var Xa = Vr(function (t, e) {
                    try {
                      return Ie(t, i, e);
                    } catch (t) {
                      return Zu(t) ? t : new mt(t);
                    }
                  }),
                  Ha = Ji(function (t, e) {
                    return (
                      Se(e, function (e) {
                        (e = Mo(e)), nr(t, e, xu(t[e], t));
                      }),
                      t
                    );
                  });
                function Ja(t) {
                  return function () {
                    return t;
                  };
                }
                var $a = Mi(),
                  ts = Mi(!0);
                function es(t) {
                  return t;
                }
                function ns(t) {
                  return Wr("function" == typeof t ? t : or(t, 1));
                }
                var rs = Vr(function (t, e) {
                    return function (n) {
                      return xr(n, t, e);
                    };
                  }),
                  is = Vr(function (t, e) {
                    return function (n) {
                      return xr(t, n, e);
                    };
                  });
                function os(t, e, n) {
                  var r = Ra(e),
                    i = wr(e, r);
                  null != n ||
                    (Ju(e) && (i.length || !r.length)) ||
                    ((n = e), (e = t), (t = this), (i = wr(e, Ra(e))));
                  var o = !(Ju(n) && "chain" in n && !n.chain),
                    u = Yu(t);
                  return (
                    Se(i, function (n) {
                      var r = e[n];
                      (t[n] = r),
                        u &&
                          (t.prototype[n] = function () {
                            var e = this.__chain__;
                            if (o || e) {
                              var n = t(this.__wrapped__);
                              return (
                                (n.__actions__ = Si(this.__actions__)).push({
                                  func: r,
                                  args: arguments,
                                  thisArg: t,
                                }),
                                (n.__chain__ = e),
                                n
                              );
                            }
                            return r.apply(t, We([this.value()], arguments));
                          });
                    }),
                    t
                  );
                }
                function us() {}
                var as = Oi(Pe),
                  ss = Oi(xe),
                  cs = Oi(Me);
                function ls(t) {
                  return yo(t)
                    ? Ne(Mo(t))
                    : (function (t) {
                        return function (e) {
                          return _r(e, t);
                        };
                      })(t);
                }
                var fs = qi(),
                  hs = qi(!0);
                function ds() {
                  return [];
                }
                function ps() {
                  return !1;
                }
                var vs,
                  gs = Bi(function (t, e) {
                    return t + e;
                  }, 0),
                  ys = Gi("ceil"),
                  bs = Bi(function (t, e) {
                    return t / e;
                  }, 1),
                  ws = Gi("floor"),
                  _s = Bi(function (t, e) {
                    return t * e;
                  }, 1),
                  ms = Gi("round"),
                  ks = Bi(function (t, e) {
                    return t - e;
                  }, 0);
                return (
                  (jn.after = function (t, e) {
                    if ("function" != typeof e) throw new xt(o);
                    return (
                      (t = ha(t)),
                      function () {
                        if (--t < 1) return e.apply(this, arguments);
                      }
                    );
                  }),
                  (jn.ary = Su),
                  (jn.assign = ya),
                  (jn.assignIn = ba),
                  (jn.assignInWith = wa),
                  (jn.assignWith = _a),
                  (jn.at = ma),
                  (jn.before = Au),
                  (jn.bind = xu),
                  (jn.bindAll = Ha),
                  (jn.bindKey = Tu),
                  (jn.castArray = function () {
                    if (!arguments.length) return [];
                    var t = arguments[0];
                    return Fu(t) ? t : [t];
                  }),
                  (jn.chain = lu),
                  (jn.chunk = function (t, e, n) {
                    e = (n ? go(t, e, n) : e === i) ? 1 : vn(ha(e), 0);
                    var o = null == t ? 0 : t.length;
                    if (!o || e < 1) return [];
                    for (var u = 0, a = 0, s = r(he(o / e)); u < o; )
                      s[a++] = $r(t, u, (u += e));
                    return s;
                  }),
                  (jn.compact = function (t) {
                    for (
                      var e = -1, n = null == t ? 0 : t.length, r = 0, i = [];
                      ++e < n;

                    ) {
                      var o = t[e];
                      o && (i[r++] = o);
                    }
                    return i;
                  }),
                  (jn.concat = function () {
                    var t = arguments.length;
                    if (!t) return [];
                    for (var e = r(t - 1), n = arguments[0], i = t; i--; )
                      e[i - 1] = arguments[i];
                    return We(Fu(n) ? Si(n) : [n], pr(e, 1));
                  }),
                  (jn.cond = function (t) {
                    var e = null == t ? 0 : t.length,
                      n = io();
                    return (
                      (t = e
                        ? Pe(t, function (t) {
                            if ("function" != typeof t[1]) throw new xt(o);
                            return [n(t[0]), t[1]];
                          })
                        : []),
                      Vr(function (n) {
                        for (var r = -1; ++r < e; ) {
                          var i = t[r];
                          if (Ie(i[0], this, n)) return Ie(i[1], this, n);
                        }
                      })
                    );
                  }),
                  (jn.conforms = function (t) {
                    return (function (t) {
                      var e = Ra(t);
                      return function (n) {
                        return ur(n, t, e);
                      };
                    })(or(t, 1));
                  }),
                  (jn.constant = Ja),
                  (jn.countBy = du),
                  (jn.create = function (t, e) {
                    var n = Bn(t);
                    return null == e ? n : er(n, e);
                  }),
                  (jn.curry = function t(e, n, r) {
                    var o = Qi(e, 8, i, i, i, i, i, (n = r ? i : n));
                    return (o.placeholder = t.placeholder), o;
                  }),
                  (jn.curryRight = function t(e, n, r) {
                    var o = Qi(e, 16, i, i, i, i, i, (n = r ? i : n));
                    return (o.placeholder = t.placeholder), o;
                  }),
                  (jn.debounce = Ru),
                  (jn.defaults = ka),
                  (jn.defaultsDeep = Ia),
                  (jn.defer = Du),
                  (jn.delay = Pu),
                  (jn.difference = Bo),
                  (jn.differenceBy = Oo),
                  (jn.differenceWith = Co),
                  (jn.drop = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    return r
                      ? $r(t, (e = n || e === i ? 1 : ha(e)) < 0 ? 0 : e, r)
                      : [];
                  }),
                  (jn.dropRight = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    return r
                      ? $r(
                          t,
                          0,
                          (e = r - (e = n || e === i ? 1 : ha(e))) < 0 ? 0 : e,
                        )
                      : [];
                  }),
                  (jn.dropRightWhile = function (t, e) {
                    return t && t.length ? ci(t, io(e, 3), !0, !0) : [];
                  }),
                  (jn.dropWhile = function (t, e) {
                    return t && t.length ? ci(t, io(e, 3), !0) : [];
                  }),
                  (jn.fill = function (t, e, n, r) {
                    var o = null == t ? 0 : t.length;
                    return o
                      ? (n &&
                          "number" != typeof n &&
                          go(t, e, n) &&
                          ((n = 0), (r = o)),
                        (function (t, e, n, r) {
                          var o = t.length;
                          for (
                            (n = ha(n)) < 0 && (n = -n > o ? 0 : o + n),
                              (r = r === i || r > o ? o : ha(r)) < 0 &&
                                (r += o),
                              r = n > r ? 0 : da(r);
                            n < r;

                          )
                            t[n++] = e;
                          return t;
                        })(t, e, n, r))
                      : [];
                  }),
                  (jn.filter = function (t, e) {
                    return (Fu(t) ? Te : dr)(t, io(e, 3));
                  }),
                  (jn.flatMap = function (t, e) {
                    return pr(mu(t, e), 1);
                  }),
                  (jn.flatMapDeep = function (t, e) {
                    return pr(mu(t, e), l);
                  }),
                  (jn.flatMapDepth = function (t, e, n) {
                    return (n = n === i ? 1 : ha(n)), pr(mu(t, e), n);
                  }),
                  (jn.flatten = No),
                  (jn.flattenDeep = function (t) {
                    return null != t && t.length ? pr(t, l) : [];
                  }),
                  (jn.flattenDepth = function (t, e) {
                    return null != t && t.length
                      ? pr(t, (e = e === i ? 1 : ha(e)))
                      : [];
                  }),
                  (jn.flip = function (t) {
                    return Qi(t, 512);
                  }),
                  (jn.flow = $a),
                  (jn.flowRight = ts),
                  (jn.fromPairs = function (t) {
                    for (
                      var e = -1, n = null == t ? 0 : t.length, r = {};
                      ++e < n;

                    ) {
                      var i = t[e];
                      r[i[0]] = i[1];
                    }
                    return r;
                  }),
                  (jn.functions = function (t) {
                    return null == t ? [] : wr(t, Ra(t));
                  }),
                  (jn.functionsIn = function (t) {
                    return null == t ? [] : wr(t, Da(t));
                  }),
                  (jn.groupBy = bu),
                  (jn.initial = function (t) {
                    return null != t && t.length ? $r(t, 0, -1) : [];
                  }),
                  (jn.intersection = Ko),
                  (jn.intersectionBy = Vo),
                  (jn.intersectionWith = Qo),
                  (jn.invert = Aa),
                  (jn.invertBy = xa),
                  (jn.invokeMap = wu),
                  (jn.iteratee = ns),
                  (jn.keyBy = _u),
                  (jn.keys = Ra),
                  (jn.keysIn = Da),
                  (jn.map = mu),
                  (jn.mapKeys = function (t, e) {
                    var n = {};
                    return (
                      (e = io(e, 3)),
                      yr(t, function (t, r, i) {
                        nr(n, e(t, r, i), t);
                      }),
                      n
                    );
                  }),
                  (jn.mapValues = function (t, e) {
                    var n = {};
                    return (
                      (e = io(e, 3)),
                      yr(t, function (t, r, i) {
                        nr(n, r, e(t, r, i));
                      }),
                      n
                    );
                  }),
                  (jn.matches = function (t) {
                    return Ur(or(t, 1));
                  }),
                  (jn.matchesProperty = function (t, e) {
                    return jr(t, or(e, 1));
                  }),
                  (jn.memoize = Wu),
                  (jn.merge = Pa),
                  (jn.mergeWith = Wa),
                  (jn.method = rs),
                  (jn.methodOf = is),
                  (jn.mixin = os),
                  (jn.negate = zu),
                  (jn.nthArg = function (t) {
                    return (
                      (t = ha(t)),
                      Vr(function (e) {
                        return Or(e, t);
                      })
                    );
                  }),
                  (jn.omit = za),
                  (jn.omitBy = function (t, e) {
                    return Ma(t, zu(io(e)));
                  }),
                  (jn.once = function (t) {
                    return Au(2, t);
                  }),
                  (jn.orderBy = function (t, e, n, r) {
                    return null == t
                      ? []
                      : (Fu(e) || (e = null == e ? [] : [e]),
                        Fu((n = r ? i : n)) || (n = null == n ? [] : [n]),
                        Cr(t, e, n));
                  }),
                  (jn.over = as),
                  (jn.overArgs = Lu),
                  (jn.overEvery = ss),
                  (jn.overSome = cs),
                  (jn.partial = Mu),
                  (jn.partialRight = Uu),
                  (jn.partition = ku),
                  (jn.pick = La),
                  (jn.pickBy = Ma),
                  (jn.property = ls),
                  (jn.propertyOf = function (t) {
                    return function (e) {
                      return null == t ? i : _r(t, e);
                    };
                  }),
                  (jn.pull = Yo),
                  (jn.pullAll = Xo),
                  (jn.pullAllBy = function (t, e, n) {
                    return t && t.length && e && e.length
                      ? Fr(t, e, io(n, 2))
                      : t;
                  }),
                  (jn.pullAllWith = function (t, e, n) {
                    return t && t.length && e && e.length ? Fr(t, e, i, n) : t;
                  }),
                  (jn.pullAt = Ho),
                  (jn.range = fs),
                  (jn.rangeRight = hs),
                  (jn.rearg = ju),
                  (jn.reject = function (t, e) {
                    return (Fu(t) ? Te : dr)(t, zu(io(e, 3)));
                  }),
                  (jn.remove = function (t, e) {
                    var n = [];
                    if (!t || !t.length) return n;
                    var r = -1,
                      i = [],
                      o = t.length;
                    for (e = io(e, 3); ++r < o; ) {
                      var u = t[r];
                      e(u, r, t) && (n.push(u), i.push(r));
                    }
                    return Nr(t, i), n;
                  }),
                  (jn.rest = function (t, e) {
                    if ("function" != typeof t) throw new xt(o);
                    return Vr(t, (e = e === i ? e : ha(e)));
                  }),
                  (jn.reverse = Jo),
                  (jn.sampleSize = function (t, e, n) {
                    return (
                      (e = (n ? go(t, e, n) : e === i) ? 1 : ha(e)),
                      (Fu(t) ? Yn : Zr)(t, e)
                    );
                  }),
                  (jn.set = function (t, e, n) {
                    return null == t ? t : Yr(t, e, n);
                  }),
                  (jn.setWith = function (t, e, n, r) {
                    return (
                      (r = "function" == typeof r ? r : i),
                      null == t ? t : Yr(t, e, n, r)
                    );
                  }),
                  (jn.shuffle = function (t) {
                    return (Fu(t) ? Xn : Jr)(t);
                  }),
                  (jn.slice = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    return r
                      ? (n && "number" != typeof n && go(t, e, n)
                          ? ((e = 0), (n = r))
                          : ((e = null == e ? 0 : ha(e)),
                            (n = n === i ? r : ha(n))),
                        $r(t, e, n))
                      : [];
                  }),
                  (jn.sortBy = Iu),
                  (jn.sortedUniq = function (t) {
                    return t && t.length ? ri(t) : [];
                  }),
                  (jn.sortedUniqBy = function (t, e) {
                    return t && t.length ? ri(t, io(e, 2)) : [];
                  }),
                  (jn.split = function (t, e, n) {
                    return (
                      n && "number" != typeof n && go(t, e, n) && (e = n = i),
                      (n = n === i ? d : n >>> 0)
                        ? (t = ga(t)) &&
                          ("string" == typeof e || (null != e && !ra(e))) &&
                          !(e = oi(e)) &&
                          rn(t)
                          ? yi(ln(t), 0, n)
                          : t.split(e, n)
                        : []
                    );
                  }),
                  (jn.spread = function (t, e) {
                    if ("function" != typeof t) throw new xt(o);
                    return (
                      (e = null == e ? 0 : vn(ha(e), 0)),
                      Vr(function (n) {
                        var r = n[e],
                          i = yi(n, 0, e);
                        return r && We(i, r), Ie(t, this, i);
                      })
                    );
                  }),
                  (jn.tail = function (t) {
                    var e = null == t ? 0 : t.length;
                    return e ? $r(t, 1, e) : [];
                  }),
                  (jn.take = function (t, e, n) {
                    return t && t.length
                      ? $r(t, 0, (e = n || e === i ? 1 : ha(e)) < 0 ? 0 : e)
                      : [];
                  }),
                  (jn.takeRight = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    return r
                      ? $r(
                          t,
                          (e = r - (e = n || e === i ? 1 : ha(e))) < 0 ? 0 : e,
                          r,
                        )
                      : [];
                  }),
                  (jn.takeRightWhile = function (t, e) {
                    return t && t.length ? ci(t, io(e, 3), !1, !0) : [];
                  }),
                  (jn.takeWhile = function (t, e) {
                    return t && t.length ? ci(t, io(e, 3)) : [];
                  }),
                  (jn.tap = function (t, e) {
                    return e(t), t;
                  }),
                  (jn.throttle = function (t, e, n) {
                    var r = !0,
                      i = !0;
                    if ("function" != typeof t) throw new xt(o);
                    return (
                      Ju(n) &&
                        ((r = "leading" in n ? !!n.leading : r),
                        (i = "trailing" in n ? !!n.trailing : i)),
                      Ru(t, e, { leading: r, maxWait: e, trailing: i })
                    );
                  }),
                  (jn.thru = fu),
                  (jn.toArray = la),
                  (jn.toPairs = Ua),
                  (jn.toPairsIn = ja),
                  (jn.toPath = function (t) {
                    return Fu(t) ? Pe(t, Mo) : ua(t) ? [t] : Si(Lo(ga(t)));
                  }),
                  (jn.toPlainObject = va),
                  (jn.transform = function (t, e, n) {
                    var r = Fu(t),
                      i = r || Vu(t) || aa(t);
                    if (((e = io(e, 4)), null == n)) {
                      var o = t && t.constructor;
                      n = i
                        ? r
                          ? new o()
                          : []
                        : Ju(t) && Yu(o)
                          ? Bn(Gt(t))
                          : {};
                    }
                    return (
                      (i ? Se : yr)(t, function (t, r, i) {
                        return e(n, t, r, i);
                      }),
                      n
                    );
                  }),
                  (jn.unary = function (t) {
                    return Su(t, 1);
                  }),
                  (jn.union = $o),
                  (jn.unionBy = tu),
                  (jn.unionWith = eu),
                  (jn.uniq = function (t) {
                    return t && t.length ? ui(t) : [];
                  }),
                  (jn.uniqBy = function (t, e) {
                    return t && t.length ? ui(t, io(e, 2)) : [];
                  }),
                  (jn.uniqWith = function (t, e) {
                    return (
                      (e = "function" == typeof e ? e : i),
                      t && t.length ? ui(t, i, e) : []
                    );
                  }),
                  (jn.unset = function (t, e) {
                    return null == t || ai(t, e);
                  }),
                  (jn.unzip = nu),
                  (jn.unzipWith = ru),
                  (jn.update = function (t, e, n) {
                    return null == t ? t : si(t, e, pi(n));
                  }),
                  (jn.updateWith = function (t, e, n, r) {
                    return (
                      (r = "function" == typeof r ? r : i),
                      null == t ? t : si(t, e, pi(n), r)
                    );
                  }),
                  (jn.values = Ba),
                  (jn.valuesIn = function (t) {
                    return null == t ? [] : Xe(t, Da(t));
                  }),
                  (jn.without = iu),
                  (jn.words = Ya),
                  (jn.wrap = function (t, e) {
                    return Mu(pi(e), t);
                  }),
                  (jn.xor = ou),
                  (jn.xorBy = uu),
                  (jn.xorWith = au),
                  (jn.zip = su),
                  (jn.zipObject = function (t, e) {
                    return hi(t || [], e || [], Jn);
                  }),
                  (jn.zipObjectDeep = function (t, e) {
                    return hi(t || [], e || [], Yr);
                  }),
                  (jn.zipWith = cu),
                  (jn.entries = Ua),
                  (jn.entriesIn = ja),
                  (jn.extend = ba),
                  (jn.extendWith = wa),
                  os(jn, jn),
                  (jn.add = gs),
                  (jn.attempt = Xa),
                  (jn.camelCase = Oa),
                  (jn.capitalize = Ca),
                  (jn.ceil = ys),
                  (jn.clamp = function (t, e, n) {
                    return (
                      n === i && ((n = e), (e = i)),
                      n !== i && (n = (n = pa(n)) == n ? n : 0),
                      e !== i && (e = (e = pa(e)) == e ? e : 0),
                      ir(pa(t), e, n)
                    );
                  }),
                  (jn.clone = function (t) {
                    return or(t, 4);
                  }),
                  (jn.cloneDeep = function (t) {
                    return or(t, 5);
                  }),
                  (jn.cloneDeepWith = function (t, e) {
                    return or(t, 5, (e = "function" == typeof e ? e : i));
                  }),
                  (jn.cloneWith = function (t, e) {
                    return or(t, 4, (e = "function" == typeof e ? e : i));
                  }),
                  (jn.conformsTo = function (t, e) {
                    return null == e || ur(t, e, Ra(e));
                  }),
                  (jn.deburr = qa),
                  (jn.defaultTo = function (t, e) {
                    return null == t || t != t ? e : t;
                  }),
                  (jn.divide = bs),
                  (jn.endsWith = function (t, e, n) {
                    (t = ga(t)), (e = oi(e));
                    var r = t.length,
                      o = (n = n === i ? r : ir(ha(n), 0, r));
                    return (n -= e.length) >= 0 && t.slice(n, o) == e;
                  }),
                  (jn.eq = Bu),
                  (jn.escape = function (t) {
                    return (t = ga(t)) && Z.test(t) ? t.replace(V, en) : t;
                  }),
                  (jn.escapeRegExp = function (t) {
                    return (t = ga(t)) && nt.test(t)
                      ? t.replace(et, "\\$&")
                      : t;
                  }),
                  (jn.every = function (t, e, n) {
                    var r = Fu(t) ? xe : fr;
                    return n && go(t, e, n) && (e = i), r(t, io(e, 3));
                  }),
                  (jn.find = pu),
                  (jn.findIndex = qo),
                  (jn.findKey = function (t, e) {
                    return je(t, io(e, 3), yr);
                  }),
                  (jn.findLast = vu),
                  (jn.findLastIndex = Fo),
                  (jn.findLastKey = function (t, e) {
                    return je(t, io(e, 3), br);
                  }),
                  (jn.floor = ws),
                  (jn.forEach = gu),
                  (jn.forEachRight = yu),
                  (jn.forIn = function (t, e) {
                    return null == t ? t : vr(t, io(e, 3), Da);
                  }),
                  (jn.forInRight = function (t, e) {
                    return null == t ? t : gr(t, io(e, 3), Da);
                  }),
                  (jn.forOwn = function (t, e) {
                    return t && yr(t, io(e, 3));
                  }),
                  (jn.forOwnRight = function (t, e) {
                    return t && br(t, io(e, 3));
                  }),
                  (jn.get = Ea),
                  (jn.gt = Ou),
                  (jn.gte = Cu),
                  (jn.has = function (t, e) {
                    return null != t && fo(t, e, Er);
                  }),
                  (jn.hasIn = Sa),
                  (jn.head = Go),
                  (jn.identity = es),
                  (jn.includes = function (t, e, n, r) {
                    (t = Gu(t) ? t : Ba(t)), (n = n && !r ? ha(n) : 0);
                    var i = t.length;
                    return (
                      n < 0 && (n = vn(i + n, 0)),
                      oa(t)
                        ? n <= i && t.indexOf(e, n) > -1
                        : !!i && Oe(t, e, n) > -1
                    );
                  }),
                  (jn.indexOf = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    if (!r) return -1;
                    var i = null == n ? 0 : ha(n);
                    return i < 0 && (i = vn(r + i, 0)), Oe(t, e, i);
                  }),
                  (jn.inRange = function (t, e, n) {
                    return (
                      (e = fa(e)),
                      n === i ? ((n = e), (e = 0)) : (n = fa(n)),
                      (function (t, e, n) {
                        return t >= gn(e, n) && t < vn(e, n);
                      })((t = pa(t)), e, n)
                    );
                  }),
                  (jn.invoke = Ta),
                  (jn.isArguments = qu),
                  (jn.isArray = Fu),
                  (jn.isArrayBuffer = Nu),
                  (jn.isArrayLike = Gu),
                  (jn.isArrayLikeObject = Ku),
                  (jn.isBoolean = function (t) {
                    return !0 === t || !1 === t || ($u(t) && kr(t) == y);
                  }),
                  (jn.isBuffer = Vu),
                  (jn.isDate = Qu),
                  (jn.isElement = function (t) {
                    return $u(t) && 1 === t.nodeType && !na(t);
                  }),
                  (jn.isEmpty = function (t) {
                    if (null == t) return !0;
                    if (
                      Gu(t) &&
                      (Fu(t) ||
                        "string" == typeof t ||
                        "function" == typeof t.splice ||
                        Vu(t) ||
                        aa(t) ||
                        qu(t))
                    )
                      return !t.length;
                    var e = lo(t);
                    if (e == k || e == x) return !t.size;
                    if (_o(t)) return !zr(t).length;
                    for (var n in t) if (zt.call(t, n)) return !1;
                    return !0;
                  }),
                  (jn.isEqual = function (t, e) {
                    return Rr(t, e);
                  }),
                  (jn.isEqualWith = function (t, e, n) {
                    var r = (n = "function" == typeof n ? n : i) ? n(t, e) : i;
                    return r === i ? Rr(t, e, i, n) : !!r;
                  }),
                  (jn.isError = Zu),
                  (jn.isFinite = function (t) {
                    return "number" == typeof t && Ue(t);
                  }),
                  (jn.isFunction = Yu),
                  (jn.isInteger = Xu),
                  (jn.isLength = Hu),
                  (jn.isMap = ta),
                  (jn.isMatch = function (t, e) {
                    return t === e || Dr(t, e, uo(e));
                  }),
                  (jn.isMatchWith = function (t, e, n) {
                    return (
                      (n = "function" == typeof n ? n : i), Dr(t, e, uo(e), n)
                    );
                  }),
                  (jn.isNaN = function (t) {
                    return ea(t) && t != +t;
                  }),
                  (jn.isNative = function (t) {
                    if (wo(t))
                      throw new mt(
                        "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",
                      );
                    return Pr(t);
                  }),
                  (jn.isNil = function (t) {
                    return null == t;
                  }),
                  (jn.isNull = function (t) {
                    return null === t;
                  }),
                  (jn.isNumber = ea),
                  (jn.isObject = Ju),
                  (jn.isObjectLike = $u),
                  (jn.isPlainObject = na),
                  (jn.isRegExp = ra),
                  (jn.isSafeInteger = function (t) {
                    return Xu(t) && t >= -9007199254740991 && t <= f;
                  }),
                  (jn.isSet = ia),
                  (jn.isString = oa),
                  (jn.isSymbol = ua),
                  (jn.isTypedArray = aa),
                  (jn.isUndefined = function (t) {
                    return t === i;
                  }),
                  (jn.isWeakMap = function (t) {
                    return $u(t) && lo(t) == D;
                  }),
                  (jn.isWeakSet = function (t) {
                    return $u(t) && "[object WeakSet]" == kr(t);
                  }),
                  (jn.join = function (t, e) {
                    return null == t ? "" : Ge.call(t, e);
                  }),
                  (jn.kebabCase = Fa),
                  (jn.last = Zo),
                  (jn.lastIndexOf = function (t, e, n) {
                    var r = null == t ? 0 : t.length;
                    if (!r) return -1;
                    var o = r;
                    return (
                      n !== i &&
                        (o = (o = ha(n)) < 0 ? vn(r + o, 0) : gn(o, r - 1)),
                      e == e
                        ? (function (t, e, n) {
                            for (var r = n + 1; r--; ) if (t[r] === e) return r;
                            return r;
                          })(t, e, o)
                        : Be(t, qe, o, !0)
                    );
                  }),
                  (jn.lowerCase = Na),
                  (jn.lowerFirst = Ga),
                  (jn.lt = sa),
                  (jn.lte = ca),
                  (jn.max = function (t) {
                    return t && t.length ? hr(t, es, Ir) : i;
                  }),
                  (jn.maxBy = function (t, e) {
                    return t && t.length ? hr(t, io(e, 2), Ir) : i;
                  }),
                  (jn.mean = function (t) {
                    return Fe(t, es);
                  }),
                  (jn.meanBy = function (t, e) {
                    return Fe(t, io(e, 2));
                  }),
                  (jn.min = function (t) {
                    return t && t.length ? hr(t, es, Lr) : i;
                  }),
                  (jn.minBy = function (t, e) {
                    return t && t.length ? hr(t, io(e, 2), Lr) : i;
                  }),
                  (jn.stubArray = ds),
                  (jn.stubFalse = ps),
                  (jn.stubObject = function () {
                    return {};
                  }),
                  (jn.stubString = function () {
                    return "";
                  }),
                  (jn.stubTrue = function () {
                    return !0;
                  }),
                  (jn.multiply = _s),
                  (jn.nth = function (t, e) {
                    return t && t.length ? Or(t, ha(e)) : i;
                  }),
                  (jn.noConflict = function () {
                    return fe._ === this && (fe._ = Bt), this;
                  }),
                  (jn.noop = us),
                  (jn.now = Eu),
                  (jn.pad = function (t, e, n) {
                    t = ga(t);
                    var r = (e = ha(e)) ? cn(t) : 0;
                    if (!e || r >= e) return t;
                    var i = (e - r) / 2;
                    return Ci(de(i), n) + t + Ci(he(i), n);
                  }),
                  (jn.padEnd = function (t, e, n) {
                    t = ga(t);
                    var r = (e = ha(e)) ? cn(t) : 0;
                    return e && r < e ? t + Ci(e - r, n) : t;
                  }),
                  (jn.padStart = function (t, e, n) {
                    t = ga(t);
                    var r = (e = ha(e)) ? cn(t) : 0;
                    return e && r < e ? Ci(e - r, n) + t : t;
                  }),
                  (jn.parseInt = function (t, e, n) {
                    return (
                      n || null == e ? (e = 0) : e && (e = +e),
                      bn(ga(t).replace(rt, ""), e || 0)
                    );
                  }),
                  (jn.random = function (t, e, n) {
                    if (
                      (n && "boolean" != typeof n && go(t, e, n) && (e = n = i),
                      n === i &&
                        ("boolean" == typeof e
                          ? ((n = e), (e = i))
                          : "boolean" == typeof t && ((n = t), (t = i))),
                      t === i && e === i
                        ? ((t = 0), (e = 1))
                        : ((t = fa(t)),
                          e === i ? ((e = t), (t = 0)) : (e = fa(e))),
                      t > e)
                    ) {
                      var r = t;
                      (t = e), (e = r);
                    }
                    if (n || t % 1 || e % 1) {
                      var o = wn();
                      return gn(
                        t + o * (e - t + ae("1e-" + ((o + "").length - 1))),
                        e,
                      );
                    }
                    return Gr(t, e);
                  }),
                  (jn.reduce = function (t, e, n) {
                    var r = Fu(t) ? ze : Ke,
                      i = arguments.length < 3;
                    return r(t, io(e, 4), n, i, cr);
                  }),
                  (jn.reduceRight = function (t, e, n) {
                    var r = Fu(t) ? Le : Ke,
                      i = arguments.length < 3;
                    return r(t, io(e, 4), n, i, lr);
                  }),
                  (jn.repeat = function (t, e, n) {
                    return (
                      (e = (n ? go(t, e, n) : e === i) ? 1 : ha(e)),
                      Kr(ga(t), e)
                    );
                  }),
                  (jn.replace = function () {
                    var t = arguments,
                      e = ga(t[0]);
                    return t.length < 3 ? e : e.replace(t[1], t[2]);
                  }),
                  (jn.result = function (t, e, n) {
                    var r = -1,
                      o = (e = vi(e, t)).length;
                    for (o || ((o = 1), (t = i)); ++r < o; ) {
                      var u = null == t ? i : t[Mo(e[r])];
                      u === i && ((r = o), (u = n)),
                        (t = Yu(u) ? u.call(t) : u);
                    }
                    return t;
                  }),
                  (jn.round = ms),
                  (jn.runInContext = t),
                  (jn.sample = function (t) {
                    return (Fu(t) ? Zn : Qr)(t);
                  }),
                  (jn.size = function (t) {
                    if (null == t) return 0;
                    if (Gu(t)) return oa(t) ? cn(t) : t.length;
                    var e = lo(t);
                    return e == k || e == x ? t.size : zr(t).length;
                  }),
                  (jn.snakeCase = Ka),
                  (jn.some = function (t, e, n) {
                    var r = Fu(t) ? Me : ti;
                    return n && go(t, e, n) && (e = i), r(t, io(e, 3));
                  }),
                  (jn.sortedIndex = function (t, e) {
                    return ei(t, e);
                  }),
                  (jn.sortedIndexBy = function (t, e, n) {
                    return ni(t, e, io(n, 2));
                  }),
                  (jn.sortedIndexOf = function (t, e) {
                    var n = null == t ? 0 : t.length;
                    if (n) {
                      var r = ei(t, e);
                      if (r < n && Bu(t[r], e)) return r;
                    }
                    return -1;
                  }),
                  (jn.sortedLastIndex = function (t, e) {
                    return ei(t, e, !0);
                  }),
                  (jn.sortedLastIndexBy = function (t, e, n) {
                    return ni(t, e, io(n, 2), !0);
                  }),
                  (jn.sortedLastIndexOf = function (t, e) {
                    if (null != t && t.length) {
                      var n = ei(t, e, !0) - 1;
                      if (Bu(t[n], e)) return n;
                    }
                    return -1;
                  }),
                  (jn.startCase = Va),
                  (jn.startsWith = function (t, e, n) {
                    return (
                      (t = ga(t)),
                      (n = null == n ? 0 : ir(ha(n), 0, t.length)),
                      (e = oi(e)),
                      t.slice(n, n + e.length) == e
                    );
                  }),
                  (jn.subtract = ks),
                  (jn.sum = function (t) {
                    return t && t.length ? Ve(t, es) : 0;
                  }),
                  (jn.sumBy = function (t, e) {
                    return t && t.length ? Ve(t, io(e, 2)) : 0;
                  }),
                  (jn.template = function (t, e, n) {
                    var r = jn.templateSettings;
                    n && go(t, e, n) && (e = i),
                      (t = ga(t)),
                      (e = wa({}, e, r, Zi));
                    var o,
                      u,
                      a = wa({}, e.imports, r.imports, Zi),
                      s = Ra(a),
                      c = Xe(a, s),
                      l = 0,
                      f = e.interpolate || wt,
                      h = "__p += '",
                      d = St(
                        (e.escape || wt).source +
                          "|" +
                          f.source +
                          "|" +
                          (f === H ? ft : wt).source +
                          "|" +
                          (e.evaluate || wt).source +
                          "|$",
                        "g",
                      ),
                      p =
                        "//# sourceURL=" +
                        (zt.call(e, "sourceURL")
                          ? (e.sourceURL + "").replace(/\s/g, " ")
                          : "lodash.templateSources[" + ++re + "]") +
                        "\n";
                    t.replace(d, function (e, n, r, i, a, s) {
                      return (
                        r || (r = i),
                        (h += t.slice(l, s).replace(_t, nn)),
                        n && ((o = !0), (h += "' +\n__e(" + n + ") +\n'")),
                        a && ((u = !0), (h += "';\n" + a + ";\n__p += '")),
                        r &&
                          (h +=
                            "' +\n((__t = (" +
                            r +
                            ")) == null ? '' : __t) +\n'"),
                        (l = s + e.length),
                        e
                      );
                    }),
                      (h += "';\n");
                    var v = zt.call(e, "variable") && e.variable;
                    if (v) {
                      if (ct.test(v))
                        throw new mt(
                          "Invalid `variable` option passed into `_.template`",
                        );
                    } else h = "with (obj) {\n" + h + "\n}\n";
                    (h = (u ? h.replace(F, "") : h)
                      .replace(N, "$1")
                      .replace(G, "$1;")),
                      (h =
                        "function(" +
                        (v || "obj") +
                        ") {\n" +
                        (v ? "" : "obj || (obj = {});\n") +
                        "var __t, __p = ''" +
                        (o ? ", __e = _.escape" : "") +
                        (u
                          ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                          : ";\n") +
                        h +
                        "return __p\n}");
                    var g = Xa(function () {
                      return kt(s, p + "return " + h).apply(i, c);
                    });
                    if (((g.source = h), Zu(g))) throw g;
                    return g;
                  }),
                  (jn.times = function (t, e) {
                    if ((t = ha(t)) < 1 || t > f) return [];
                    var n = d,
                      r = gn(t, d);
                    (e = io(e)), (t -= d);
                    for (var i = Qe(r, e); ++n < t; ) e(n);
                    return i;
                  }),
                  (jn.toFinite = fa),
                  (jn.toInteger = ha),
                  (jn.toLength = da),
                  (jn.toLower = function (t) {
                    return ga(t).toLowerCase();
                  }),
                  (jn.toNumber = pa),
                  (jn.toSafeInteger = function (t) {
                    return t
                      ? ir(ha(t), -9007199254740991, f)
                      : 0 === t
                        ? t
                        : 0;
                  }),
                  (jn.toString = ga),
                  (jn.toUpper = function (t) {
                    return ga(t).toUpperCase();
                  }),
                  (jn.trim = function (t, e, n) {
                    if ((t = ga(t)) && (n || e === i)) return Ze(t);
                    if (!t || !(e = oi(e))) return t;
                    var r = ln(t),
                      o = ln(e);
                    return yi(r, Je(r, o), $e(r, o) + 1).join("");
                  }),
                  (jn.trimEnd = function (t, e, n) {
                    if ((t = ga(t)) && (n || e === i))
                      return t.slice(0, fn(t) + 1);
                    if (!t || !(e = oi(e))) return t;
                    var r = ln(t);
                    return yi(r, 0, $e(r, ln(e)) + 1).join("");
                  }),
                  (jn.trimStart = function (t, e, n) {
                    if ((t = ga(t)) && (n || e === i)) return t.replace(rt, "");
                    if (!t || !(e = oi(e))) return t;
                    var r = ln(t);
                    return yi(r, Je(r, ln(e))).join("");
                  }),
                  (jn.truncate = function (t, e) {
                    var n = 30,
                      r = "...";
                    if (Ju(e)) {
                      var o = "separator" in e ? e.separator : o;
                      (n = "length" in e ? ha(e.length) : n),
                        (r = "omission" in e ? oi(e.omission) : r);
                    }
                    var u = (t = ga(t)).length;
                    if (rn(t)) {
                      var a = ln(t);
                      u = a.length;
                    }
                    if (n >= u) return t;
                    var s = n - cn(r);
                    if (s < 1) return r;
                    var c = a ? yi(a, 0, s).join("") : t.slice(0, s);
                    if (o === i) return c + r;
                    if ((a && (s += c.length - s), ra(o))) {
                      if (t.slice(s).search(o)) {
                        var l,
                          f = c;
                        for (
                          o.global || (o = St(o.source, ga(ht.exec(o)) + "g")),
                            o.lastIndex = 0;
                          (l = o.exec(f));

                        )
                          var h = l.index;
                        c = c.slice(0, h === i ? s : h);
                      }
                    } else if (t.indexOf(oi(o), s) != s) {
                      var d = c.lastIndexOf(o);
                      d > -1 && (c = c.slice(0, d));
                    }
                    return c + r;
                  }),
                  (jn.unescape = function (t) {
                    return (t = ga(t)) && Q.test(t) ? t.replace(K, hn) : t;
                  }),
                  (jn.uniqueId = function (t) {
                    var e = ++Lt;
                    return ga(t) + e;
                  }),
                  (jn.upperCase = Qa),
                  (jn.upperFirst = Za),
                  (jn.each = gu),
                  (jn.eachRight = yu),
                  (jn.first = Go),
                  os(
                    jn,
                    ((vs = {}),
                    yr(jn, function (t, e) {
                      zt.call(jn.prototype, e) || (vs[e] = t);
                    }),
                    vs),
                    { chain: !1 },
                  ),
                  (jn.VERSION = "4.17.21"),
                  Se(
                    [
                      "bind",
                      "bindKey",
                      "curry",
                      "curryRight",
                      "partial",
                      "partialRight",
                    ],
                    function (t) {
                      jn[t].placeholder = jn;
                    },
                  ),
                  Se(["drop", "take"], function (t, e) {
                    (qn.prototype[t] = function (n) {
                      n = n === i ? 1 : vn(ha(n), 0);
                      var r =
                        this.__filtered__ && !e ? new qn(this) : this.clone();
                      return (
                        r.__filtered__
                          ? (r.__takeCount__ = gn(n, r.__takeCount__))
                          : r.__views__.push({
                              size: gn(n, d),
                              type: t + (r.__dir__ < 0 ? "Right" : ""),
                            }),
                        r
                      );
                    }),
                      (qn.prototype[t + "Right"] = function (e) {
                        return this.reverse()[t](e).reverse();
                      });
                  }),
                  Se(["filter", "map", "takeWhile"], function (t, e) {
                    var n = e + 1,
                      r = 1 == n || 3 == n;
                    qn.prototype[t] = function (t) {
                      var e = this.clone();
                      return (
                        e.__iteratees__.push({ iteratee: io(t, 3), type: n }),
                        (e.__filtered__ = e.__filtered__ || r),
                        e
                      );
                    };
                  }),
                  Se(["head", "last"], function (t, e) {
                    var n = "take" + (e ? "Right" : "");
                    qn.prototype[t] = function () {
                      return this[n](1).value()[0];
                    };
                  }),
                  Se(["initial", "tail"], function (t, e) {
                    var n = "drop" + (e ? "" : "Right");
                    qn.prototype[t] = function () {
                      return this.__filtered__ ? new qn(this) : this[n](1);
                    };
                  }),
                  (qn.prototype.compact = function () {
                    return this.filter(es);
                  }),
                  (qn.prototype.find = function (t) {
                    return this.filter(t).head();
                  }),
                  (qn.prototype.findLast = function (t) {
                    return this.reverse().find(t);
                  }),
                  (qn.prototype.invokeMap = Vr(function (t, e) {
                    return "function" == typeof t
                      ? new qn(this)
                      : this.map(function (n) {
                          return xr(n, t, e);
                        });
                  })),
                  (qn.prototype.reject = function (t) {
                    return this.filter(zu(io(t)));
                  }),
                  (qn.prototype.slice = function (t, e) {
                    t = ha(t);
                    var n = this;
                    return n.__filtered__ && (t > 0 || e < 0)
                      ? new qn(n)
                      : (t < 0 ? (n = n.takeRight(-t)) : t && (n = n.drop(t)),
                        e !== i &&
                          (n =
                            (e = ha(e)) < 0 ? n.dropRight(-e) : n.take(e - t)),
                        n);
                  }),
                  (qn.prototype.takeRightWhile = function (t) {
                    return this.reverse().takeWhile(t).reverse();
                  }),
                  (qn.prototype.toArray = function () {
                    return this.take(d);
                  }),
                  yr(qn.prototype, function (t, e) {
                    var n = /^(?:filter|find|map|reject)|While$/.test(e),
                      r = /^(?:head|last)$/.test(e),
                      o = jn[r ? "take" + ("last" == e ? "Right" : "") : e],
                      u = r || /^find/.test(e);
                    o &&
                      (jn.prototype[e] = function () {
                        var e = this.__wrapped__,
                          a = r ? [1] : arguments,
                          s = e instanceof qn,
                          c = a[0],
                          l = s || Fu(e),
                          f = function (t) {
                            var e = o.apply(jn, We([t], a));
                            return r && h ? e[0] : e;
                          };
                        l &&
                          n &&
                          "function" == typeof c &&
                          1 != c.length &&
                          (s = l = !1);
                        var h = this.__chain__,
                          d = !!this.__actions__.length,
                          p = u && !h,
                          v = s && !d;
                        if (!u && l) {
                          e = v ? e : new qn(this);
                          var g = t.apply(e, a);
                          return (
                            g.__actions__.push({
                              func: fu,
                              args: [f],
                              thisArg: i,
                            }),
                            new Cn(g, h)
                          );
                        }
                        return p && v
                          ? t.apply(this, a)
                          : ((g = this.thru(f)),
                            p ? (r ? g.value()[0] : g.value()) : g);
                      });
                  }),
                  Se(
                    ["pop", "push", "shift", "sort", "splice", "unshift"],
                    function (t) {
                      var e = Tt[t],
                        n = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
                        r = /^(?:pop|shift)$/.test(t);
                      jn.prototype[t] = function () {
                        var t = arguments;
                        if (r && !this.__chain__) {
                          var i = this.value();
                          return e.apply(Fu(i) ? i : [], t);
                        }
                        return this[n](function (n) {
                          return e.apply(Fu(n) ? n : [], t);
                        });
                      };
                    },
                  ),
                  yr(qn.prototype, function (t, e) {
                    var n = jn[e];
                    if (n) {
                      var r = n.name + "";
                      zt.call(Tn, r) || (Tn[r] = []),
                        Tn[r].push({ name: e, func: n });
                    }
                  }),
                  (Tn[Ui(i, 2).name] = [{ name: "wrapper", func: i }]),
                  (qn.prototype.clone = function () {
                    var t = new qn(this.__wrapped__);
                    return (
                      (t.__actions__ = Si(this.__actions__)),
                      (t.__dir__ = this.__dir__),
                      (t.__filtered__ = this.__filtered__),
                      (t.__iteratees__ = Si(this.__iteratees__)),
                      (t.__takeCount__ = this.__takeCount__),
                      (t.__views__ = Si(this.__views__)),
                      t
                    );
                  }),
                  (qn.prototype.reverse = function () {
                    if (this.__filtered__) {
                      var t = new qn(this);
                      (t.__dir__ = -1), (t.__filtered__ = !0);
                    } else (t = this.clone()).__dir__ *= -1;
                    return t;
                  }),
                  (qn.prototype.value = function () {
                    var t = this.__wrapped__.value(),
                      e = this.__dir__,
                      n = Fu(t),
                      r = e < 0,
                      i = n ? t.length : 0,
                      o = (function (t, e, n) {
                        for (var r = -1, i = n.length; ++r < i; ) {
                          var o = n[r],
                            u = o.size;
                          switch (o.type) {
                            case "drop":
                              t += u;
                              break;
                            case "dropRight":
                              e -= u;
                              break;
                            case "take":
                              e = gn(e, t + u);
                              break;
                            case "takeRight":
                              t = vn(t, e - u);
                          }
                        }
                        return { start: t, end: e };
                      })(0, i, this.__views__),
                      u = o.start,
                      a = o.end,
                      s = a - u,
                      c = r ? a : u - 1,
                      l = this.__iteratees__,
                      f = l.length,
                      h = 0,
                      d = gn(s, this.__takeCount__);
                    if (!n || (!r && i == s && d == s))
                      return li(t, this.__actions__);
                    var p = [];
                    t: for (; s-- && h < d; ) {
                      for (var v = -1, g = t[(c += e)]; ++v < f; ) {
                        var y = l[v],
                          b = y.iteratee,
                          w = y.type,
                          _ = b(g);
                        if (2 == w) g = _;
                        else if (!_) {
                          if (1 == w) continue t;
                          break t;
                        }
                      }
                      p[h++] = g;
                    }
                    return p;
                  }),
                  (jn.prototype.at = hu),
                  (jn.prototype.chain = function () {
                    return lu(this);
                  }),
                  (jn.prototype.commit = function () {
                    return new Cn(this.value(), this.__chain__);
                  }),
                  (jn.prototype.next = function () {
                    this.__values__ === i &&
                      (this.__values__ = la(this.value()));
                    var t = this.__index__ >= this.__values__.length;
                    return {
                      done: t,
                      value: t ? i : this.__values__[this.__index__++],
                    };
                  }),
                  (jn.prototype.plant = function (t) {
                    for (var e, n = this; n instanceof On; ) {
                      var r = jo(n);
                      (r.__index__ = 0),
                        (r.__values__ = i),
                        e ? (o.__wrapped__ = r) : (e = r);
                      var o = r;
                      n = n.__wrapped__;
                    }
                    return (o.__wrapped__ = t), e;
                  }),
                  (jn.prototype.reverse = function () {
                    var t = this.__wrapped__;
                    if (t instanceof qn) {
                      var e = t;
                      return (
                        this.__actions__.length && (e = new qn(this)),
                        (e = e.reverse()).__actions__.push({
                          func: fu,
                          args: [Jo],
                          thisArg: i,
                        }),
                        new Cn(e, this.__chain__)
                      );
                    }
                    return this.thru(Jo);
                  }),
                  (jn.prototype.toJSON =
                    jn.prototype.valueOf =
                    jn.prototype.value =
                      function () {
                        return li(this.__wrapped__, this.__actions__);
                      }),
                  (jn.prototype.first = jn.prototype.head),
                  Yt &&
                    (jn.prototype[Yt] = function () {
                      return this;
                    }),
                  jn
                );
              })();
            (fe._ = dn),
              (r = function () {
                return dn;
              }.call(e, n, e, t)) === i || (t.exports = r);
          }.call(this);
      },
      236: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = o(n(767)),
          s = {
            adFinished: function () {},
            adError: function () {},
            adStarted: function () {},
          },
          c = (function () {
            function t(t) {
              var e = this;
              (this.sdk = t),
                (this.adCallbacks = s),
                (this.requestInProgress = !1),
                (this.adblockDetectionResolvers = []),
                (this.logger = new a.default("ad")),
                (this.adblockDetectionTimeout = window.setTimeout(function () {
                  e.logger.log(
                    "Adblock timeout executed since there wasn't an adblock event in 5000ms",
                  ),
                    e.setAdblockDetectionResult(!1);
                }, 5e3));
            }
            return (
              (t.prototype.requestAd = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n;
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return (
                          this.logger.log("Requesting " + t + " ad"),
                          [4, this.sdk.ensureInit()]
                        );
                      case 1:
                        return (
                          r.sent(),
                          (this.adCallbacks = {
                            adFinished:
                              (null == e ? void 0 : e.adFinished) ||
                              s.adFinished,
                            adError:
                              (null == e ? void 0 : e.adError) ||
                              (null == e ? void 0 : e.adFinished) ||
                              s.adFinished,
                            adStarted:
                              (null == e ? void 0 : e.adStarted) || s.adStarted,
                          }),
                          this.requestInProgress
                            ? (this.logger.log("Ad already requested"),
                              (n = "An ad request is already in progress"),
                              [
                                2,
                                (0, u.wrapUserFn)(this.adCallbacks.adError)(n, {
                                  reason: "other",
                                  message: n,
                                }),
                              ])
                            : ((this.requestInProgress = !0),
                              this.sdk.postMessage("requestAd", { adType: t }),
                              [2])
                        );
                    }
                  });
                });
              }),
              (t.prototype.hasAdblock = function (t) {
                var e = this;
                return (0, u.callbackWrapper)(function () {
                  return void 0 !== e.adblockDetectionResult
                    ? Promise.resolve(e.adblockDetectionResult)
                    : (e.sdk.postMessage("hasAdblock", {}),
                      e.logger.log("Requesting adblock status"),
                      new Promise(function (t) {
                        e.adblockDetectionResolvers.push(t);
                      }));
                }, t);
              }),
              (t.prototype.handleEvent = function (t) {
                var e = t.data;
                switch (e.type) {
                  case "adblockDetectionExecuted":
                    return this.handleAdBlockDetectionExecutedEvent(e);
                  case "adError":
                    return (
                      (this.requestInProgress = !1),
                      (0, u.wrapUserFn)(this.adCallbacks.adError)(
                        e.error,
                        e.errorData,
                      )
                    );
                  case "adFinished":
                    return (
                      (this.requestInProgress = !1),
                      (0, u.wrapUserFn)(this.adCallbacks.adFinished)()
                    );
                  case "adStarted":
                    return (0, u.wrapUserFn)(this.adCallbacks.adStarted)();
                }
              }),
              (t.prototype.handleAdBlockDetectionExecutedEvent = function (t) {
                var e = !!t.hasAdblock;
                if (void 0 !== this.adblockDetectionResult)
                  return (
                    this.logger.log(
                      "Received update for adblock state: (" + e + ").",
                    ),
                    void (this.adblockDetectionResult = e)
                  );
                this.setAdblockDetectionResult(e),
                  clearTimeout(this.adblockDetectionTimeout);
              }),
              (t.prototype.setAdblockDetectionResult = function (t) {
                (this.adblockDetectionResult = t),
                  this.adblockDetectionResolvers.forEach(function (e) {
                    return e(t);
                  }),
                  (this.adblockDetectionResolvers = []);
              }),
              t
            );
          })();
        e.default = c;
      },
      683: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__assign) ||
            function () {
              return (
                (r =
                  Object.assign ||
                  function (t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (e = arguments[n]))
                        Object.prototype.hasOwnProperty.call(e, i) &&
                          (t[i] = e[i]);
                    return t;
                  }),
                r.apply(this, arguments)
              );
            },
          i =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          u =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a = n(81),
          s = n(823),
          c = n(414),
          l = n(314),
          f = u(n(767)),
          h = (function () {
            function t(t) {
              (this.sdk = t),
                (this.disableBannerCheck = !1),
                (this.useTestAds = !1),
                (this.bannerQueue = {}),
                (this.overlayBanners = {}),
                (this.renderedBannerIds = new Set()),
                (this.logger = new f.default("banner"));
            }
            return (
              (t.prototype.requestBanner = function (t, e) {
                var n = this;
                return (0, s.callbackWrapper)(function () {
                  return i(n, void 0, void 0, function () {
                    var e,
                      n,
                      i = this;
                    return o(this, function (o) {
                      switch (o.label) {
                        case 0:
                          return (
                            this.logger.log("Requesting banner", t),
                            [4, this.sdk.ensureInit(!0)]
                          );
                        case 1:
                          return (
                            o.sent(),
                            [
                              4,
                              (0, a.getBannerContainer)(
                                t.id,
                                !this.disableBannerCheck,
                              ),
                            ]
                          );
                        case 2:
                          return (
                            (e = o.sent()),
                            this.logger.verbose("Requesting banner from GF", t),
                            (n = r(r({}, t), { id: e.innerContainerId })),
                            this.renderedBannerIds.add(t.id),
                            [
                              2,
                              new Promise(function (t, e) {
                                (i.bannerQueue[n.id] = {
                                  banner: n,
                                  resolve: t,
                                  reject: e,
                                }),
                                  i.sdk.postMessage("requestBanner", [
                                    {
                                      containerId: n.id,
                                      size: (0, a.getBannerSizeAsText)(n),
                                    },
                                  ]);
                              }),
                            ]
                          );
                      }
                    });
                  });
                }, e);
              }),
              (t.prototype.requestResponsiveBanner = function (t, e) {
                var n = this;
                return (0, s.callbackWrapper)(function () {
                  return i(n, void 0, void 0, function () {
                    var e,
                      n,
                      r,
                      i,
                      u,
                      s = this;
                    return o(this, function (o) {
                      switch (o.label) {
                        case 0:
                          return (
                            this.logger.log(
                              "Requesting responsive banner for container #" +
                                t,
                            ),
                            [4, this.sdk.ensureInit(!0)]
                          );
                        case 1:
                          return (
                            o.sent(),
                            [
                              4,
                              (0, a.getBannerContainer)(
                                t,
                                !this.disableBannerCheck,
                              ),
                            ]
                          );
                        case 2:
                          return (
                            (e = o.sent()),
                            (n = e.containerInfo.size),
                            (r = n.width),
                            (i = n.height),
                            (u = {
                              id: e.innerContainerId,
                              width: r,
                              height: i,
                              isResponsive: !0,
                            }),
                            this.renderedBannerIds.add(t),
                            this.logger.log(
                              "Requesting responsive banner from gameframe",
                              u,
                            ),
                            [
                              2,
                              new Promise(function (t, e) {
                                (s.bannerQueue[u.id] = {
                                  banner: u,
                                  resolve: t,
                                  reject: e,
                                }),
                                  s.sdk.postMessage("requestResponsiveBanner", [
                                    { id: u.id, width: r, height: i },
                                  ]);
                              }),
                            ]
                          );
                      }
                    });
                  });
                }, e);
              }),
              (t.prototype.requestOverlayBanners = function (t, e) {
                var n = this,
                  r = t.map(function (t) {
                    return t.id;
                  });
                Object.keys(this.overlayBanners).forEach(function (t) {
                  r.includes(t) ||
                    (n.logger.log("Remove overlay banner " + t),
                    n.overlayBanners[t].destroy(),
                    delete n.overlayBanners[t]);
                }),
                  t.forEach(function (t) {
                    if (n.overlayBanners[t.id])
                      n.logger.log("Skip overlay banner update " + t.id);
                    else {
                      n.logger.log("Create overlay banner " + t.id);
                      var r = new c.OverlayBanner(
                        t,
                        n.disableBannerCheck,
                        n,
                        e,
                      );
                      n.overlayBanners[t.id] = r;
                    }
                  });
              }),
              (t.prototype.handleEvent = function (t) {
                switch (t.data.type) {
                  case "bannerError":
                    return this.handleBannerErrorEvent(t.data);
                  case "bannerRendered":
                    return this.handleBannerRenderedEvent(t.data);
                  case "requestBanner":
                    return this.handleRequestBannerEvent(t.data);
                }
              }),
              (t.prototype.handleBannerErrorEvent = function (t) {
                var e = t.error,
                  n = t.containerId;
                this.logger.log("Banner error happened", {
                  error: e,
                  containerId: n,
                });
                var r = this.popFromBannerQueue(t.containerId);
                r && (0, r.reject)(e);
              }),
              (t.prototype.handleBannerRenderedEvent = function (t) {
                var e = this.popFromBannerQueue(t.containerId);
                if (e) {
                  var n = e.banner,
                    r = e.resolve;
                  this.logger.log("Banner rendered", n), r();
                }
              }),
              (t.prototype.handleRequestBannerEvent = function (t) {
                var e = t.request;
                this.logger.verbose(
                  "Banner request answer from gameframe received",
                  e,
                ),
                  this.buildBannerRequestCallback(e),
                  (0, a.requestInGameBanner)(e);
              }),
              (t.prototype.buildBannerRequestCallback = function (t) {
                var e = this;
                t.options.banner = {
                  callback: function (t) {
                    var n = e.popFromBannerQueue(t.code);
                    if (n) {
                      var r = n.banner,
                        i = n.resolve,
                        o = n.reject;
                      if ((delete e.bannerQueue[t.code], !t.empty))
                        return (
                          e.logger.log("Banner rendered", r),
                          e.sdk.postMessage("bannerProcessed", {
                            containerId: r.id,
                            width: r.width,
                            height: r.height,
                            minPrice: t.minPrice,
                            houseAd: t.houseAd,
                            empty: t.empty,
                          }),
                          void i()
                        );
                      if (e.useTestAds)
                        (0, l.renderFakeBanner)(r),
                          e.logger.log("Fake banner rendered", r),
                          i();
                      else {
                        e.logger.log("No banner available", r);
                        var u =
                          "Sorry, no banner is available for the moment, please retry";
                        e.sdk.postMessage("bannerProcessed", {
                          containerId: r.id,
                          width: r.width,
                          height: r.height,
                          error: u,
                          minPrice: t.minPrice,
                          houseAd: t.houseAd,
                          empty: t.empty,
                        }),
                          o(u);
                      }
                    }
                  },
                };
              }),
              (t.prototype.popFromBannerQueue = function (t) {
                var e = this.bannerQueue[t];
                return e
                  ? (delete this.bannerQueue[t], e)
                  : (this.logger.log(
                      "Cannot retrieve element for id " +
                        t +
                        " from the banner queue",
                    ),
                    null);
              }),
              (t.prototype.clearBanner = function (t) {
                this.sdk.postMessage("clearBanner", {});
                var e = document.getElementById((0, a.ContainerIdToInnerId)(t));
                e
                  ? (e.remove(),
                    this.renderedBannerIds.delete(t),
                    this.logger.log("Cleared the banner from container #" + t))
                  : this.logger.log(
                      "There isn't a banner in container #" +
                        t +
                        ", not clearing anything.",
                    );
              }),
              (t.prototype.clearAllBanners = function () {
                var t = this;
                this.sdk.postMessage("clearAllBanners", {});
                var e = Array.from(this.renderedBannerIds.values());
                this.logger.log(
                  "Clearing all banners, ids: ",
                  e
                    .map(function (t) {
                      return "#" + t;
                    })
                    .join(", "),
                ),
                  e.forEach(function (e) {
                    t.clearBanner(e);
                  });
              }),
              t
            );
          })();
        e.default = h;
      },
      881: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = n(659),
          s = o(n(767)),
          c = (function () {
            function t(t) {
              (this.sdk = t), (this.logger = new s.default("game"));
            }
            return (
              (t.prototype.happytime = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (
                                  this.logger.log("Requesting happytime"),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  t.sent(),
                                  this.sdk.postMessage("happytime", {}),
                                  [2]
                                );
                            }
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.gameplayStart = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (
                                  this.logger.log("Requesting gameplay start"),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  t.sent(),
                                  this.sdk.postMessage("gameplayStart", {}),
                                  [2]
                                );
                            }
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.gameplayStop = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (
                                  this.logger.log("Requesting gameplay stop"),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  t.sent(),
                                  this.sdk.postMessage("gameplayStop", {}),
                                  [2]
                                );
                            }
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.sdkGameLoadingStart = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (
                                  this.logger.log(
                                    "Requesting game loading start",
                                  ),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  t.sent(),
                                  this.sdk.postMessage(
                                    "sdkGameLoadingStart",
                                    {},
                                  ),
                                  [2]
                                );
                            }
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.sdkGameLoadingStop = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            switch (t.label) {
                              case 0:
                                return (
                                  this.logger.log(
                                    "Requesting game loading stop",
                                  ),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  t.sent(),
                                  this.sdk.postMessage(
                                    "sdkGameLoadingStop",
                                    {},
                                  ),
                                  [2]
                                );
                            }
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.inviteLink = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(n, void 0, void 0, function () {
                          var e;
                          return i(this, function (n) {
                            switch (n.label) {
                              case 0:
                                return (
                                  this.logger.log("Requesting invite link"),
                                  [4, this.sdk.ensureInit()]
                                );
                              case 1:
                                return (
                                  n.sent(),
                                  (e = (0, a.generateInviteLink)(
                                    t,
                                    this.gameLink,
                                  )),
                                  this.logger.log("Invite link is " + e),
                                  this.sdk.postMessage("inviteUrl", {
                                    inviteUrl: e,
                                  }),
                                  [2, e]
                                );
                            }
                          });
                        });
                      }, e),
                    ];
                  });
                });
              }),
              (t.prototype.showInviteButton = function (t, e) {
                var n = this;
                return (0, u.callbackWrapper)(function () {
                  return r(n, void 0, void 0, function () {
                    var e;
                    return i(this, function (n) {
                      switch (n.label) {
                        case 0:
                          return (
                            this.logger.log("Show invite button"),
                            [4, this.sdk.ensureInit()]
                          );
                        case 1:
                          return (
                            n.sent(),
                            (e = (0, a.generateInviteLink)(t, this.gameLink)),
                            this.logger.log("Invite button link " + e),
                            this.sdk.postMessage("showInviteButton", {
                              inviteUrl: e,
                            }),
                            [2, e]
                          );
                      }
                    });
                  });
                }, e);
              }),
              (t.prototype.hideInviteButton = function () {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    switch (t.label) {
                      case 0:
                        return (
                          this.logger.log("Hide invite button"),
                          [4, this.sdk.ensureInit()]
                        );
                      case 1:
                        return (
                          t.sent(),
                          this.sdk.postMessage("hideInviteButton", {}),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.getInviteParam = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(n, void 0, void 0, function () {
                          return i(this, function (e) {
                            return [
                              2,
                              new URLSearchParams(window.location.search).get(
                                t,
                              ),
                            ];
                          });
                        });
                      }, e),
                    ];
                  });
                });
              }),
              (t.prototype.setScreenshotHandlerAsync = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    return [2, function () {}];
                  });
                });
              }),
              (t.prototype.setScreenshotHandler = function (t) {
                return function () {};
              }),
              (t.prototype.handleEvent = function (t) {
                "focusStealAttempt" === t.data.type &&
                  this.restoreCanvasFocus();
              }),
              (t.prototype.restoreCanvasFocus = function () {
                try {
                  var t = document.getElementsByTagName("canvas");
                  1 !== t.length
                    ? this.logger.log(
                        "There are " +
                          t.length +
                          " canvases, don't restore focus",
                      )
                    : (this.logger.log("Restore focus to canvas"),
                      (t[0].tabIndex = 1),
                      t[0].focus());
                } catch (t) {
                  this.logger.error("Failed to restore canvas focus");
                }
              }),
              t
            );
          })();
        e.default = c;
      },
      273: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__assign) ||
            function () {
              return (
                (r =
                  Object.assign ||
                  function (t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (e = arguments[n]))
                        Object.prototype.hasOwnProperty.call(e, i) &&
                          (t[i] = e[i]);
                    return t;
                  }),
                r.apply(this, arguments)
              );
            },
          i =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          u =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a = u(n(683)),
          s = u(n(881)),
          c = u(n(236)),
          l = u(n(320)),
          f = n(871),
          h = n(951),
          d = n(823),
          p = n(412),
          v = u(n(767)),
          g = (function () {
            function t() {
              var t = this;
              (this.initResolvers = []),
                (this.rafvertizingUrl = ""),
                (this.initState = f.INIT_STATE.UNINITIALIZED),
                (this._banner = new a.default(this)),
                (this._game = new s.default(this)),
                (this._ad = new c.default(this)),
                (this._user = new l.default(this)),
                (this.logger = new v.default("none")),
                (this.receiveMessage = function (e) {
                  return i(t, void 0, void 0, function () {
                    var t, n;
                    return o(this, function (r) {
                      return "sdk" !== (t = e.data).messageTarget
                        ? [2]
                        : (n = t.type) && this.isValidCrazyEvent(n)
                          ? (this.logger.verbose("Received message from GF", t),
                            "initialized" === n
                              ? ((this.gfWindow = e.source),
                                [2, this.initializeReply(t.data)])
                              : (this._banner.handleEvent(e),
                                this._ad.handleEvent(e),
                                this._user.handleEvent(e),
                                this._game.handleEvent(e),
                                [2]))
                          : [2];
                    });
                  });
                });
            }
            return (
              (t.prototype.init = function (t) {
                this.initState === f.INIT_STATE.UNINITIALIZED &&
                  (this.logger.log(
                    'Initializing v2 SDK (enable "Verbose" for full logs)',
                  ),
                  t && this.logger.log("Init options", t),
                  this.registerMessageListener(),
                  this.sendInit(t),
                  (this.initState = f.INIT_STATE.REQUESTED));
              }),
              (t.prototype.addInitCallback = function (t) {
                return i(this, void 0, void 0, function () {
                  return o(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.ensureInit()];
                      case 1:
                        return e.sent(), t(this._initInfo), [2];
                    }
                  });
                });
              }),
              (t.prototype.isQaTool = function (t) {
                return i(this, void 0, void 0, function () {
                  var e = this;
                  return o(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return [4, this.ensureInit()];
                      case 1:
                        return (
                          n.sent(),
                          this.postMessage("isQATool", {}),
                          [
                            2,
                            (0, d.callbackWrapper)(function () {
                              return i(e, void 0, void 0, function () {
                                return o(this, function (t) {
                                  return [2, !!this._isQaTool];
                                });
                              });
                            }, t),
                          ]
                        );
                    }
                  });
                });
              }),
              (t.prototype.getEnvironment = function (t) {
                return i(this, void 0, void 0, function () {
                  var e = this;
                  return o(this, function (n) {
                    return (
                      this.gfWindow && this.postMessage("getEnvironment", {}),
                      [
                        2,
                        (0, d.callbackWrapper)(function () {
                          return i(e, void 0, void 0, function () {
                            return o(this, function (t) {
                              return [2, "crazygames"];
                            });
                          });
                        }, t),
                      ]
                    );
                  });
                });
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  return this._banner;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  return this._game;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  return this._user;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  return this._ad;
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.syncUnityGameData = function (t) {
                return i(this, void 0, void 0, function () {
                  var e = this;
                  return o(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return [4, this.ensureInit()];
                      case 1:
                        return (
                          n.sent(),
                          [
                            2,
                            (0, d.callbackWrapper)(function () {
                              return i(e, void 0, void 0, function () {
                                return o(this, function (t) {
                                  return (
                                    this.logger.log(
                                      "Requesting to sync Unity gameData",
                                    ),
                                    this.postMessage("syncUnityGameData", {}),
                                    [2]
                                  );
                                });
                              });
                            }, t),
                          ]
                        );
                    }
                  });
                });
              }),
              (t.prototype.postMessage = function (t, e) {
                var n = { type: t, data: e };
                this.logger.verbose("Message to GF", n),
                  this.gfWindow
                    ? this.gfWindow.postMessage(n, "*")
                    : this.logger.log(
                        "CrazyGames gameframe hasn't been detected",
                      );
              }),
              (t.prototype.ensureInit = function (t) {
                return (
                  void 0 === t && (t = !1),
                  i(this, void 0, void 0, function () {
                    var e = this;
                    return o(this, function (n) {
                      return this.initState === f.INIT_STATE.INITIALIZED
                        ? t
                          ? [2, (0, h.loadAdsIfNeeded)(this.rafvertizingUrl)]
                          : [2, Promise.resolve()]
                        : (this.init(),
                          [
                            2,
                            new Promise(function (n) {
                              e.initResolvers.push(function () {
                                return i(e, void 0, void 0, function () {
                                  return o(this, function (e) {
                                    switch (e.label) {
                                      case 0:
                                        return t ? [3, 1] : (n(), [3, 3]);
                                      case 1:
                                        return [
                                          4,
                                          (0, h.loadAdsIfNeeded)(
                                            this.rafvertizingUrl,
                                          ),
                                        ];
                                      case 2:
                                        e.sent(), n(), (e.label = 3);
                                      case 3:
                                        return [2];
                                    }
                                  });
                                });
                              });
                            }),
                          ]);
                    });
                  })
                );
              }),
              (t.prototype.sendInit = function (t) {
                var e = {
                  type: "init-js-sdk",
                  data: r({ version: p.SDK_VERSION, sdkType: "js" }, t),
                };
                window.postMessage(e, "*"),
                  window.parent.postMessage(e, "*"),
                  window.parent.parent.postMessage(e, "*"),
                  window.parent.parent.parent.postMessage(e, "*");
              }),
              (t.prototype.registerMessageListener = function () {
                window.addEventListener("message", this.receiveMessage, !1);
              }),
              (t.prototype.initializeReply = function (t) {
                return i(this, void 0, void 0, function () {
                  return o(this, function (e) {
                    return (
                      t && !0 === t.debug && (v.default.forceEnable = !0),
                      this.logger.log(
                        "Initialize reply received from gameframe",
                        t,
                      ),
                      this.initState === f.INIT_STATE.INITIALIZED ||
                        (t &&
                          ((this.rafvertizingUrl = t.rafvertizingUrl),
                          (this.gameId = t.gameId),
                          (this._game.gameLink = t.gameLink),
                          (this._banner.useTestAds = t.useTestAds),
                          (this._banner.disableBannerCheck =
                            t.disableBannerCheck || !1),
                          (this._user.systemInfo = t.systemInfo),
                          (this._user.userAccountAvailable =
                            !!t.userAccountAvailable),
                          (this._isQaTool = !!t.isQaTool)),
                        (this.initState = f.INIT_STATE.INITIALIZED),
                        (this._initInfo = t),
                        this.initResolvers.length > 0 &&
                          (this.logger.log("Calling init callbacks"),
                          this.initResolvers.forEach(function (t) {
                            return t();
                          }),
                          (this.initResolvers = []))),
                      [2]
                    );
                  });
                });
              }),
              (t.prototype.isValidCrazyEvent = function (t) {
                switch (t) {
                  case "adStarted":
                  case "adFinished":
                  case "adError":
                  case "adblockDetectionExecuted":
                  case "bannerRendered":
                  case "bannerError":
                  case "requestBanner":
                  case "initialized":
                  case "requestGameDataResponse":
                  case "userLoggedIn":
                  case "showAuthPromptResponse":
                  case "requestUserTokenResponse":
                  case "requestXsollaUserTokenResponse":
                  case "linkAccountResponse":
                  case "initialUserSet":
                  case "focusStealAttempt":
                    return !0;
                  default:
                    return !1;
                }
              }),
              t
            );
          })();
        e.default = g;
      },
      320: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = o(n(767)),
          s = (function () {
            function t(t) {
              var e = this;
              (this.sdk = t),
                (this.authDeferredPromise = null),
                (this.accountLinkDeferredPromise = null),
                (this.authListeners = []),
                (this.userSetResolvers = []),
                (this.isUserInitialized = !1),
                (this.userTokenResolvers = []),
                (this.userTokenRequestInProgress = !1),
                (this.xsollaUserTokenRequestInProgress = !1),
                (this.xsollaUserTokenResolvers = []),
                (this.logger = new a.default("user")),
                setTimeout(function () {
                  e.isUserInitialized || e.initializeUser(void 0);
                }, 5e3);
            }
            return (
              (t.prototype.showAuthPrompt = function (t) {
                var e = this;
                return (
                  this.logger.log("Requesting auth prompt"),
                  this.authDeferredPromise
                    ? (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new Error("showAuthPromptInProgress");
                          });
                        });
                      }, t)
                    : this.user
                      ? (0, u.callbackWrapper)(function () {
                          return r(e, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error("userAlreadySignedIn");
                            });
                          });
                        }, t)
                      : (0, u.callbackWrapper)(function () {
                          return new Promise(function (t, n) {
                            return r(e, void 0, void 0, function () {
                              return i(this, function (e) {
                                switch (e.label) {
                                  case 0:
                                    return (
                                      (this.authDeferredPromise = {
                                        resolve: t,
                                        reject: n,
                                      }),
                                      [4, this.sdk.ensureInit()]
                                    );
                                  case 1:
                                    return (
                                      e.sent(),
                                      this.sdk.postMessage(
                                        "showAuthPrompt",
                                        {},
                                      ),
                                      [2]
                                    );
                                }
                              });
                            });
                          });
                        }, t)
                );
              }),
              (t.prototype.handleAuthPromptResponse = function (t) {
                this.logger.log("Received auth prompt response", t);
                var e = t.error,
                  n = t.user;
                e
                  ? this.authDeferredPromise &&
                    this.authDeferredPromise.reject(e.code)
                  : ((this.user = n),
                    this.authDeferredPromise &&
                      this.authDeferredPromise.resolve(this.user)),
                  (this.authDeferredPromise = null);
              }),
              (t.prototype.showAccountLinkPrompt = function (t) {
                var e = this;
                return (
                  this.logger.log("Requesting link account prompt"),
                  this.accountLinkDeferredPromise
                    ? (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new Error("showAccountLinkPromptInProgress");
                          });
                        });
                      }, t)
                    : this.user
                      ? (0, u.callbackWrapper)(function () {
                          return new Promise(function (t, n) {
                            return r(e, void 0, void 0, function () {
                              return i(this, function (e) {
                                switch (e.label) {
                                  case 0:
                                    return (
                                      (this.accountLinkDeferredPromise = {
                                        resolve: t,
                                        reject: n,
                                      }),
                                      [4, this.sdk.ensureInit()]
                                    );
                                  case 1:
                                    return (
                                      e.sent(),
                                      this.sdk.postMessage(
                                        "showAccountLinkPrompt",
                                        {},
                                      ),
                                      [2]
                                    );
                                }
                              });
                            });
                          });
                        }, t)
                      : (0, u.callbackWrapper)(function () {
                          return r(e, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error("userNotAuthenticated");
                            });
                          });
                        }, t)
                );
              }),
              (t.prototype.handleAccountLinkPromptResponse = function (t) {
                this.logger.log("Received account link prompt response", t);
                var e = t.response;
                this.accountLinkDeferredPromise &&
                  this.accountLinkDeferredPromise.resolve({ response: e }),
                  (this.accountLinkDeferredPromise = null);
              }),
              (t.prototype.getUser = function (t) {
                var e = this;
                return (0, u.callbackWrapper)(function () {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (t) {
                      switch (t.label) {
                        case 0:
                          return (
                            this.logger.log("Requesting user object"),
                            [4, this.sdk.ensureInit()]
                          );
                        case 1:
                          return (
                            t.sent(),
                            this.sdk.postMessage("getUser", {}),
                            this.isUserInitialized
                              ? [3, 3]
                              : (this.logger.log(
                                  "Waiting for the user init message...",
                                ),
                                [4, this.ensureUserInitialized()])
                          );
                        case 2:
                          t.sent(), (t.label = 3);
                        case 3:
                          return [2, this.user];
                      }
                    });
                  });
                }, t);
              }),
              (t.prototype.ensureUserInitialized = function () {
                return r(this, void 0, void 0, function () {
                  var t = this;
                  return i(this, function (e) {
                    return [
                      2,
                      new Promise(function (e) {
                        t.userSetResolvers.push(function () {
                          e();
                        });
                      }),
                    ];
                  });
                });
              }),
              (t.prototype.getSystemInfo = function (t) {
                var e = this;
                return (0, u.callbackWrapper)(function () {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (t) {
                      switch (t.label) {
                        case 0:
                          return (
                            this.logger.log("Requesting system info"),
                            [4, this.sdk.ensureInit()]
                          );
                        case 1:
                          return (
                            t.sent(),
                            this.sdk.postMessage("getSystemInfo", {}),
                            [2, this.systemInfo]
                          );
                      }
                    });
                  });
                }, t);
              }),
              (t.prototype.isUserAccountAvailable = function (t) {
                var e = this;
                return (
                  this.sdk.postMessage("isUserAccountAvailable", {}),
                  (0, u.callbackWrapper)(function () {
                    return r(e, void 0, void 0, function () {
                      return i(this, function (t) {
                        switch (t.label) {
                          case 0:
                            return (
                              this.logger.log(
                                "Requesting user account available",
                              ),
                              [4, this.sdk.ensureInit()]
                            );
                          case 1:
                            return t.sent(), [2, !!this.userAccountAvailable];
                        }
                      });
                    });
                  }, t)
                );
              }),
              (t.prototype.getUserToken = function (t) {
                var e;
                return r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    switch (o.label) {
                      case 0:
                        return (
                          this.logger.log("Requesting user token"),
                          [4, this.sdk.ensureInit()]
                        );
                      case 1:
                        return (
                          o.sent(),
                          this.tokenExpiresAtMs &&
                            this.tokenExpiresAtMs < Date.now() &&
                            (this.logger.log(
                              "User token expired, clean it so it is requested again",
                            ),
                            (this.userToken = null),
                            (this.tokenExpiresAtMs = null)),
                          this.tokenExpiresAtMs &&
                            !this.userTokenRequestInProgress &&
                            this.tokenExpiresAtMs - 3e4 < Date.now() &&
                            (this.logger.log(
                              "User token expires soon, request new one in background",
                            ),
                            this.requestNewUserToken()),
                          (
                            null === (e = this.userToken) || void 0 === e
                              ? void 0
                              : e.token
                          )
                            ? (this.logger.log("Returning cached user token"),
                              [
                                2,
                                (0, u.callbackWrapper)(function () {
                                  return r(n, void 0, void 0, function () {
                                    return i(this, function (t) {
                                      return [2, this.userToken.token];
                                    });
                                  });
                                }, t),
                              ])
                            : (this.userTokenRequestInProgress
                                ? this.logger.log(
                                    "User token request to portal in progress",
                                  )
                                : (this.logger.log(
                                    "No user token present in the SDK, request one",
                                  ),
                                  this.requestNewUserToken()),
                              [
                                2,
                                (0, u.callbackWrapper)(function () {
                                  return r(n, void 0, void 0, function () {
                                    var t = this;
                                    return i(this, function (e) {
                                      switch (e.label) {
                                        case 0:
                                          return [
                                            4,
                                            new Promise(function (e) {
                                              t.userTokenResolvers.push(
                                                function () {
                                                  return r(
                                                    t,
                                                    void 0,
                                                    void 0,
                                                    function () {
                                                      return i(
                                                        this,
                                                        function (t) {
                                                          return e(), [2];
                                                        },
                                                      );
                                                    },
                                                  );
                                                },
                                              );
                                            }),
                                          ];
                                        case 1:
                                          if ((e.sent(), !this.userToken))
                                            throw (
                                              (this.logger.error(
                                                "User token missing after portal request finished",
                                              ),
                                              new Error("unexpectedError"))
                                            );
                                          if (this.userToken.error)
                                            throw new Error(
                                              this.userToken.error.code,
                                            );
                                          if (!this.userToken.token)
                                            throw (
                                              (this.logger.error(
                                                "User token missing, even though there isn't any error",
                                              ),
                                              new Error("unexpectedError"))
                                            );
                                          return [2, this.userToken.token];
                                      }
                                    });
                                  });
                                }, t),
                              ])
                        );
                    }
                  });
                });
              }),
              (t.prototype.handleUserTokenResponse = function (t) {
                this.logger.log("Received token response from portal", t),
                  (this.userToken = t),
                  (this.userTokenRequestInProgress = !1),
                  t.expiresIn &&
                    (this.tokenExpiresAtMs = Date.now() + 1e3 * t.expiresIn),
                  this.userTokenResolvers.forEach(function (t) {
                    return t();
                  }),
                  (this.userTokenResolvers = []);
              }),
              (t.prototype.requestNewUserToken = function () {
                this.logger.log("Requesting user token from portal"),
                  this.sdk.postMessage("requestUserToken", {}),
                  (this.userTokenRequestInProgress = !0);
              }),
              (t.prototype.getXsollaUserToken = function (t) {
                var e;
                return r(this, void 0, void 0, function () {
                  var n = this;
                  return i(this, function (o) {
                    switch (o.label) {
                      case 0:
                        return (
                          this.logger.log("Requesting Xsolla user token"),
                          [4, this.sdk.ensureInit()]
                        );
                      case 1:
                        return (
                          o.sent(),
                          this.xsollaUserTokenExpiresAtMs &&
                            this.xsollaUserTokenExpiresAtMs < Date.now() &&
                            (this.logger.log(
                              "Xsolla user token expired, clean it so it is requested again",
                            ),
                            (this.xsollaUserToken = null),
                            (this.xsollaUserTokenExpiresAtMs = null)),
                          this.xsollaUserTokenExpiresAtMs &&
                            !this.xsollaUserTokenRequestInProgress &&
                            this.xsollaUserTokenExpiresAtMs - 3e4 <
                              Date.now() &&
                            (this.logger.log(
                              "Xsolla user token expires soon, request new one in background",
                            ),
                            this.requestNewXsollaUserToken()),
                          (
                            null === (e = this.xsollaUserToken) || void 0 === e
                              ? void 0
                              : e.token
                          )
                            ? (this.logger.log(
                                "Returning cached Xsolla user token",
                              ),
                              [
                                2,
                                (0, u.callbackWrapper)(function () {
                                  return r(n, void 0, void 0, function () {
                                    return i(this, function (t) {
                                      return [2, this.xsollaUserToken.token];
                                    });
                                  });
                                }, t),
                              ])
                            : (this.xsollaUserTokenRequestInProgress
                                ? this.logger.log(
                                    "Xsolla user token request to portal in progress",
                                  )
                                : (this.logger.log(
                                    "No Xsolla user token present in the SDK, request one",
                                  ),
                                  this.requestNewXsollaUserToken()),
                              [
                                2,
                                (0, u.callbackWrapper)(function () {
                                  return r(n, void 0, void 0, function () {
                                    var t = this;
                                    return i(this, function (e) {
                                      switch (e.label) {
                                        case 0:
                                          return [
                                            4,
                                            new Promise(function (e) {
                                              t.xsollaUserTokenResolvers.push(
                                                function () {
                                                  return r(
                                                    t,
                                                    void 0,
                                                    void 0,
                                                    function () {
                                                      return i(
                                                        this,
                                                        function (t) {
                                                          return e(), [2];
                                                        },
                                                      );
                                                    },
                                                  );
                                                },
                                              );
                                            }),
                                          ];
                                        case 1:
                                          if ((e.sent(), !this.xsollaUserToken))
                                            throw (
                                              (this.logger.error(
                                                "Xsolla user token missing after portal request finished",
                                              ),
                                              new Error("unexpectedError"))
                                            );
                                          if (this.xsollaUserToken.error)
                                            throw new Error(
                                              this.xsollaUserToken.error.code,
                                            );
                                          if (!this.xsollaUserToken.token)
                                            throw (
                                              (this.logger.error(
                                                "Xsolla user token missing, even though there isn't any error",
                                              ),
                                              new Error("unexpectedError"))
                                            );
                                          return [
                                            2,
                                            this.xsollaUserToken.token,
                                          ];
                                      }
                                    });
                                  });
                                }, t),
                              ])
                        );
                    }
                  });
                });
              }),
              (t.prototype.handleXsollaUserTokenResponse = function (t) {
                this.logger.log(
                  "Received Xsolla user token response from portal",
                  t,
                ),
                  (this.xsollaUserToken = t),
                  (this.xsollaUserTokenRequestInProgress = !1),
                  t.expiresIn &&
                    (this.xsollaUserTokenExpiresAtMs =
                      Date.now() + 1e3 * t.expiresIn),
                  this.xsollaUserTokenResolvers.forEach(function (t) {
                    return t();
                  }),
                  (this.xsollaUserTokenResolvers = []);
              }),
              (t.prototype.requestNewXsollaUserToken = function () {
                this.logger.log("Requesting Xsolla user token from portal"),
                  this.sdk.postMessage("requestXsollaUserToken", {}),
                  (this.xsollaUserTokenRequestInProgress = !0);
              }),
              (t.prototype.addScore = function (t, e) {
                var n = this;
                return (
                  this.logger.log("Requesting to add score", t),
                  (0, u.callbackWrapper)(function () {
                    return r(n, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2];
                      });
                    });
                  }, e)
                );
              }),
              (t.prototype.addScoreEncrypted = function (t, e, n) {
                var o = this;
                return (
                  this.logger.log(
                    "Requesting to add score encrypted. Score: ",
                    t,
                    "Encrypted: ",
                    e,
                  ),
                  "number" != typeof t || isNaN(t)
                    ? (0, u.callbackWrapper)(function () {
                        return r(o, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw (
                              (this.logger.error(
                                "Score input must be a number",
                              ),
                              new Error("unexpectedError"))
                            );
                          });
                        });
                      }, n)
                    : "https:" !== window.location.protocol
                      ? (0, u.callbackWrapper)(function () {
                          return r(o, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw (
                                (this.logger.error(
                                  "AddScore is only supported on https",
                                ),
                                new Error("unexpectedError"))
                              );
                            });
                          });
                        }, n)
                      : (0, u.callbackWrapper)(function () {
                          return r(o, void 0, void 0, function () {
                            return i(this, function (n) {
                              switch (n.label) {
                                case 0:
                                  return [4, this.sdk.ensureInit()];
                                case 1:
                                  return (
                                    n.sent(),
                                    this.sdk.postMessage("addScore", {
                                      score: t,
                                      encryptedScore: e,
                                    }),
                                    [2]
                                  );
                              }
                            });
                          });
                        }, n)
                );
              }),
              (t.prototype.handleEvent = function (t) {
                var e = t.data;
                switch (e.type) {
                  case "showAuthPromptResponse":
                    this.handleAuthPromptResponse(e);
                    break;
                  case "linkAccountResponse":
                    this.handleAccountLinkPromptResponse(e.data);
                    break;
                  case "userLoggedIn":
                    this.handleUserLoggedIn(e.data);
                    break;
                  case "requestUserTokenResponse":
                    this.handleUserTokenResponse(e);
                    break;
                  case "requestXsollaUserTokenResponse":
                    this.handleXsollaUserTokenResponse(e);
                    break;
                  case "initialUserSet":
                    this.initializeUser(e.data.user);
                }
              }),
              (t.prototype.addAuthListener = function (t) {
                this.authListeners.push(t),
                  this.sdk.postMessage("addAuthListener", {}),
                  this.callAuthChangeListener(t);
              }),
              (t.prototype.removeAuthListener = function (t) {
                this.sdk.postMessage("removeAuthListener", {}),
                  (this.authListeners = this.authListeners.filter(function (e) {
                    return e !== t;
                  }));
              }),
              (t.prototype.handleUserLoggedIn = function (t) {
                (this.user = t.user),
                  this.initializeUser(t.user),
                  this.callAuthChangeListeners();
              }),
              (t.prototype.initializeUser = function (t) {
                this.isUserInitialized ||
                  ((this.user = t),
                  this.userSetResolvers.forEach(function (t) {
                    return t();
                  }),
                  (this.userSetResolvers = []),
                  (this.isUserInitialized = !0));
              }),
              (t.prototype.callAuthChangeListeners = function () {
                var t = this;
                this.authListeners.forEach(function (e) {
                  return t.callAuthChangeListener(e);
                });
              }),
              (t.prototype.callAuthChangeListener = function (t) {
                try {
                  t(this.user);
                } catch (t) {}
              }),
              t
            );
          })();
        e.default = s;
      },
      176: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(823),
          u = (function () {
            function t() {
              var t = this;
              (this.errorMessage =
                'CrazySDK is disabled on this domain. Please check if window.CrazyGames.SDK.environment is not "disabled" before calling the SDK.'),
                (this.errorData = {
                  reason: "other",
                  message: this.errorMessage,
                }),
                (this.errorFunction = function () {
                  return r(t, void 0, void 0, function () {
                    return i(this, function (t) {
                      throw new Error(this.errorMessage);
                    });
                  });
                });
            }
            return (
              (t.prototype.init = function () {}),
              (t.prototype.addInitCallback = function () {}),
              (t.prototype.isQaTool = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, o.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.getEnvironment = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, o.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, "disabled"];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.syncUnityGameData = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    return [2, this.errorFunction()];
                  });
                });
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  var t = this;
                  return {
                    requestAd: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [
                            2,
                            null == n
                              ? void 0
                              : n.adError(this.errorMessage, this.errorData),
                          ];
                        });
                      });
                    },
                    hasAdblock: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  var t = this;
                  return {
                    requestBanner: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    requestResponsiveBanner: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    requestOverlayBanners: function (e, n) {
                      return t.errorFunction();
                    },
                    clearBanner: function (e) {
                      return t.errorFunction();
                    },
                    clearAllBanners: function () {
                      return t.errorFunction();
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  var t = this;
                  return {
                    happytime: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    gameplayStart: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    gameplayStop: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    sdkGameLoadingStart: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    sdkGameLoadingStop: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    inviteLink: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    hideInviteButton: function () {
                      return t.errorFunction();
                    },
                    showInviteButton: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    getInviteParam: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    setScreenshotHandlerAsync: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, function () {}];
                        });
                      });
                    },
                    setScreenshotHandler: function (t) {
                      return function () {};
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  var t = this;
                  return {
                    getUser: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    getSystemInfo: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    showAuthPrompt: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    showAccountLinkPrompt: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    addAuthListener: function (t) {},
                    removeAuthListener: function (t) {},
                    getUserToken: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    getXsollaUserToken: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                    addScore: function (e, n) {
                      return (0, o.callbackWrapper)(t.errorFunction, n);
                    },
                    addScoreEncrypted: function (e, n, r) {
                      return (0, o.callbackWrapper)(t.errorFunction, r);
                    },
                    isUserAccountAvailable: function (e) {
                      return (0, o.callbackWrapper)(t.errorFunction, e);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              t
            );
          })();
        e.default = u;
      },
      223: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = n(871),
          s = o(n(767)),
          c = 3e4,
          l = (function () {
            function t(t) {
              (this.sdk = t),
                (this.requestInProgress = !1),
                (this.throttleInterstitial = !1),
                (this.throttleRewarded = !1),
                (this.logger = new s.default("ad"));
            }
            return (
              (t.prototype.init = function (t) {
                var e, n, r, i;
                null === (e = null == t ? void 0 : t.fb) ||
                  void 0 === e ||
                  e.interstitialId,
                  null === (n = null == t ? void 0 : t.fb) ||
                    void 0 === n ||
                    n.rewardedId,
                  (this.interstitialAdId =
                    null === (r = null == t ? void 0 : t.fb) || void 0 === r
                      ? void 0
                      : r.interstitialId),
                  (this.rewardedAdId =
                    null === (i = null == t ? void 0 : t.fb) || void 0 === i
                      ? void 0
                      : i.rewardedId),
                  this.preloadAds();
              }),
              (t.prototype.preloadAds = function () {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    return (
                      this.preloadInterstitialAd(0),
                      this.preloadRewardedAd(0),
                      [2]
                    );
                  });
                });
              }),
              (t.prototype.requestAd = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n;
                  return i(this, function (r) {
                    return (
                      this.logger.log("Requesting " + t + " ad"),
                      this.requestInProgress &&
                        (null == e ? void 0 : e.adError) &&
                        ((n = "An ad request is already in progress"),
                        (0, u.wrapUserFn)(e.adError)(n, {
                          reason: "other",
                          message: n,
                        })),
                      (this.requestInProgress = !0),
                      "rewarded" === t
                        ? [2, this.displayRewardedAd(e)]
                        : [2, this.displayMidrollAd(e)]
                    );
                  });
                });
              }),
              (t.prototype.hasAdblock = function (t) {
                return (0, u.callbackWrapper)(function () {
                  return Promise.resolve(!1);
                }, t);
              }),
              (t.prototype.handleAdError = function (t, e) {
                (this.requestInProgress = !1),
                  (null == e ? void 0 : e.adError)
                    ? (0, u.wrapUserFn)(e.adError)(t.toString(), {
                        reason: "other",
                        message: t.toString(),
                      })
                    : (null == e ? void 0 : e.adFinished) &&
                      (0, u.wrapUserFn)(e.adFinished)();
              }),
              (t.prototype.handleAdFinished = function (t) {
                (this.requestInProgress = !1),
                  (null == t ? void 0 : t.adFinished) &&
                    (0, u.wrapUserFn)(t.adFinished)();
              }),
              (t.prototype.handleAdStarted = function (t) {
                (null == t ? void 0 : t.adStarted) &&
                  (0, u.wrapUserFn)(null == t ? void 0 : t.adStarted)();
              }),
              (t.prototype.displayMidrollAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n,
                    r = this;
                  return i(this, function (i) {
                    switch (i.label) {
                      case 0:
                        if (!this.preloadedInterstitialAd)
                          return (
                            this.handleAdError(
                              "Missing preloaded interstitial ad",
                              t,
                            ),
                            [2]
                          );
                        if (this.throttleInterstitial)
                          return (
                            this.handleAdError(
                              "Please wait " +
                                a.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS / 1e3 +
                                " seconds between two midroll ads",
                              t,
                            ),
                            [2]
                          );
                        i.label = 1;
                      case 1:
                        return (
                          i.trys.push([1, 3, , 4]),
                          this.handleAdStarted(t),
                          (this.throttleInterstitial = !0),
                          setTimeout(function () {
                            return (r.throttleInterstitial = !1);
                          }, a.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS),
                          [4, this.preloadedInterstitialAd.showAsync()]
                        );
                      case 2:
                        return i.sent(), this.handleAdFinished(t), [3, 4];
                      case 3:
                        return (
                          (e = i.sent()),
                          (n = e),
                          this.handleAdError(n.code + " " + n.message, t),
                          [3, 4]
                        );
                      case 4:
                        return (
                          (this.preloadedInterstitialAd = void 0),
                          this.preloadInterstitialAd(0),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.displayRewardedAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n,
                    r = this;
                  return i(this, function (i) {
                    switch (i.label) {
                      case 0:
                        if (!this.preloadedRewardedAd)
                          return (
                            this.handleAdError(
                              "Missing preloaded rewarded ad",
                              t,
                            ),
                            [2]
                          );
                        if (this.throttleRewarded)
                          return (
                            this.handleAdError(
                              "Please wait " +
                                a.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS / 1e3 +
                                " seconds between two rewarded ads",
                              t,
                            ),
                            [2]
                          );
                        i.label = 1;
                      case 1:
                        return (
                          i.trys.push([1, 3, , 4]),
                          this.handleAdStarted(t),
                          (this.throttleRewarded = !0),
                          setTimeout(function () {
                            return (r.throttleRewarded = !1);
                          }, a.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS),
                          [4, this.preloadedRewardedAd.showAsync()]
                        );
                      case 2:
                        return i.sent(), this.handleAdFinished(t), [3, 4];
                      case 3:
                        return (
                          (e = i.sent()),
                          (n = e),
                          this.handleAdError(n.code + " " + n.message, t),
                          [3, 4]
                        );
                      case 4:
                        return (
                          (this.preloadedRewardedAd = void 0),
                          this.preloadRewardedAd(0),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.preloadInterstitialAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n,
                    r,
                    o,
                    u = this;
                  return i(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return !this.interstitialAdId ||
                          this.preloadedInterstitialAd
                          ? [2]
                          : t >= 3
                            ? [2, void 0]
                            : [4, this.sdk.ensureInit()];
                      case 1:
                        (e = i.sent()), (i.label = 2);
                      case 2:
                        return (
                          i.trys.push([2, 4, , 5]),
                          [4, e.getInterstitialAdAsync(this.interstitialAdId)]
                        );
                      case 3:
                        return (n = i.sent()), [3, 5];
                      case 4:
                        return (
                          (r = i.sent()),
                          r,
                          setTimeout(function () {
                            return u.preloadInterstitialAd(t + 1);
                          }, c),
                          [2]
                        );
                      case 5:
                        return i.trys.push([5, 7, , 8]), [4, n.loadAsync()];
                      case 6:
                        return i.sent(), [3, 8];
                      case 7:
                        return (
                          (o = i.sent()),
                          o,
                          setTimeout(function () {
                            return u.preloadInterstitialAd(t + 1);
                          }, c),
                          [2]
                        );
                      case 8:
                        return (
                          (this.preloadedInterstitialAd = n),
                          this.logger.log(
                            "Interstitial (midgame) ad preloaded",
                          ),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.preloadRewardedAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n,
                    r,
                    o,
                    u = this;
                  return i(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return !this.rewardedAdId || this.preloadedRewardedAd
                          ? [2]
                          : t >= 3
                            ? [2, void 0]
                            : [4, this.sdk.ensureInit()];
                      case 1:
                        (e = i.sent()), (i.label = 2);
                      case 2:
                        return (
                          i.trys.push([2, 4, , 5]),
                          [4, e.getRewardedVideoAsync(this.rewardedAdId)]
                        );
                      case 3:
                        return (n = i.sent()), [3, 5];
                      case 4:
                        return (
                          (r = i.sent()),
                          r,
                          setTimeout(function () {
                            return u.preloadRewardedAd(t + 1);
                          }, c),
                          [2]
                        );
                      case 5:
                        return i.trys.push([5, 7, , 8]), [4, n.loadAsync()];
                      case 6:
                        return i.sent(), [3, 8];
                      case 7:
                        return (
                          (o = i.sent()),
                          o,
                          setTimeout(function () {
                            return u.preloadRewardedAd(t + 1);
                          }, c),
                          [2]
                        );
                      case 8:
                        return (
                          (this.preloadedRewardedAd = n),
                          this.logger.log("Rewarded ad preloaded"),
                          [2]
                        );
                    }
                  });
                });
              }),
              t
            );
          })();
        e.default = l;
      },
      983: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = n(871),
          s = o(n(223)),
          c = o(n(767)),
          l = (function () {
            function t() {
              (this.initState = a.INIT_STATE.UNINITIALIZED),
                (this.initResolvers = []),
                (this._ad = new s.default(this)),
                (this.bannerLogger = new c.default("banner")),
                (this.mainLogger = new c.default("none"));
            }
            return (
              (t.prototype.init = function (t) {
                this.loadFbSdk(), this._ad.init(t);
              }),
              (t.prototype.addInitCallback = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.ensureInit()];
                      case 1:
                        return (
                          e.sent(),
                          t({
                            gameLink: "",
                            rafvertizingUrl: "",
                            useTestAds: !1,
                            systemInfo: {
                              countryCode: "",
                              browser: { name: "", version: "" },
                              os: { name: "", version: "" },
                              device: "desktop",
                            },
                            gameId: "",
                            locale: "en-US",
                            userAccountAvailable: !1,
                            isQaTool: !1,
                          }),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.isQaTool = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.getEnvironment = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, "facebook"];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  return this._ad;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  var t = this;
                  return {
                    requestBanner: function (e, n) {
                      var o =
                        "Responsive banner not supported with FacebookSDK";
                      return (
                        t.bannerLogger.error(o),
                        (0, u.callbackWrapper)(function () {
                          return r(t, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error(o);
                            });
                          });
                        }, n)
                      );
                    },
                    requestResponsiveBanner: function (e, n) {
                      var o =
                        "Responsive banner not supported with FacebookSDK";
                      return (
                        t.bannerLogger.error(o),
                        (0, u.callbackWrapper)(function () {
                          return r(t, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error(o);
                            });
                          });
                        }, n)
                      );
                    },
                    requestOverlayBanners: function (t, e) {
                      throw new Error(
                        "Overlay banners not supported with FacebookSDK",
                      );
                    },
                    clearBanner: function (t) {
                      throw new Error(
                        "Clearing banners is supported with Yandex",
                      );
                    },
                    clearAllBanners: function () {
                      throw new Error(
                        "Clearing banners is supported with Yandex",
                      );
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  var t = this;
                  return {
                    happytime: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Happytime is not supported with FacebookSDK",
                        );
                      }, t);
                    },
                    gameplayStart: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Gameplay start is not supported with FacebookSDK",
                        );
                      }, t);
                    },
                    gameplayStop: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Gameplay stop is not supported with FacebookSDK",
                        );
                      }, t);
                    },
                    sdkGameLoadingStart: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Game load start from SDK is not supported with FacebookSDK",
                        );
                      }, t);
                    },
                    sdkGameLoadingStop: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Game load stop from SDK is not supported with FacebookSDK",
                        );
                      }, t);
                    },
                    inviteLink: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with FacebookSDK",
                        );
                      }, e);
                    },
                    showInviteButton: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with FacebookSDK",
                        );
                      }, e);
                    },
                    hideInviteButton: function () {
                      throw new a.SDKError(
                        "Invite button is not supported with FacebookSDK",
                      );
                    },
                    setScreenshotHandlerAsync: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, function () {}];
                        });
                      });
                    },
                    setScreenshotHandler: function (t) {
                      return function () {};
                    },
                    getInviteParam: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with FacebookSDK",
                        );
                      }, e);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  return {
                    getUser: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No user available with FacebookSDK",
                        );
                      }, t);
                    },
                    getSystemInfo: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No system info available with FacebookSDK",
                        );
                      }, t);
                    },
                    showAuthPrompt: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No user available with FacebookSDK",
                        );
                      }, t);
                    },
                    showAccountLinkPrompt: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No account linking available with FacebookSDK",
                        );
                      }, t);
                    },
                    getUserToken: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No user token available with FacebookSDK.",
                        );
                      }, t);
                    },
                    getXsollaUserToken: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No Xsolla user token available with FacebookSDK.",
                        );
                      }, t);
                    },
                    addScore: function (t, e) {
                      var n = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(n, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new a.SDKError(
                              "Game score is not supported with FacebookSDK",
                            );
                          });
                        });
                      }, e);
                    },
                    addScoreEncrypted: function (t, e, n) {
                      var o = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(o, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new a.SDKError(
                              "Game score is not supported with FacebookSDK",
                            );
                          });
                        });
                      }, n);
                    },
                    addAuthListener: function (t) {},
                    removeAuthListener: function (t) {},
                    isUserAccountAvailable: function (t) {
                      var e = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.syncUnityGameData = function (t) {
                throw new a.SDKError(
                  "syncUnityGameData is not supported with FacebookSDK",
                );
              }),
              (t.prototype.ensureInit = function () {
                return r(this, void 0, void 0, function () {
                  var t = this;
                  return i(this, function (e) {
                    return this.initState === a.INIT_STATE.INITIALIZED
                      ? [2, Promise.resolve(this.fbSdk)]
                      : (this.loadFbSdk(),
                        [
                          2,
                          new Promise(function (e) {
                            t.initResolvers.push(function () {
                              return r(t, void 0, void 0, function () {
                                return i(this, function (t) {
                                  return e(this.fbSdk), [2];
                                });
                              });
                            });
                          }),
                        ]);
                  });
                });
              }),
              (t.prototype.loadFbSdk = function () {
                var t, e, n;
                return r(this, void 0, void 0, function () {
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return this.initState !== a.INIT_STATE.UNINITIALIZED
                          ? [2]
                          : (this.mainLogger.log("Loading FBInstant SDK"),
                            (this.initState = a.INIT_STATE.REQUESTED),
                            [
                              4,
                              (0, u.loadScript)(
                                "https://connect.facebook.net/en_US/fbinstant.7.1.js",
                              ),
                            ]);
                      case 1:
                        return (
                          r.sent(),
                          (this.fbSdk = window.FBInstant),
                          [
                            4,
                            null === (t = this.fbSdk) || void 0 === t
                              ? void 0
                              : t.initializeAsync(),
                          ]
                        );
                      case 2:
                        return (
                          r.sent(),
                          null === (e = this.fbSdk) ||
                            void 0 === e ||
                            e.setLoadingProgress(100),
                          [
                            4,
                            null === (n = this.fbSdk) || void 0 === n
                              ? void 0
                              : n.startGameAsync(),
                          ]
                        );
                      case 3:
                        return (
                          r.sent(),
                          (this.initState = a.INIT_STATE.INITIALIZED),
                          this.initResolvers.length > 0 &&
                            (this.mainLogger.log("Calling init callbacks"),
                            this.initResolvers.forEach(function (t) {
                              return t();
                            }),
                            (this.initResolvers = [])),
                          [2]
                        );
                    }
                  });
                });
              }),
              t
            );
          })();
        e.default = l;
      },
      608: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = o(n(767)),
          s = (function () {
            function t() {
              (this.requestInProgress = !1),
                (this.overlay = null),
                (this.logger = new a.default("ad"));
            }
            return (
              (t.prototype.init = function () {
                (this.overlay = document.createElement("div")),
                  (this.overlay.id = "local-overlay"),
                  this.createOverlayStyle(),
                  document.body.appendChild(this.overlay);
              }),
              (t.prototype.requestAd = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n;
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return this.requestInProgress
                          ? ((null == e ? void 0 : e.adError)
                              ? ((n = "An ad request is already in progress"),
                                (0, u.wrapUserFn)(e.adError)(n, {
                                  reason: "other",
                                  message: n,
                                }))
                              : (null == e ? void 0 : e.adFinished) &&
                                (0, u.wrapUserFn)(e.adFinished)(),
                            [2])
                          : ((null == e ? void 0 : e.adStarted) &&
                              (0, u.wrapUserFn)(e.adStarted)(),
                            [4, this.renderFakeAd(t)]);
                      case 1:
                        return (
                          r.sent(),
                          (null == e ? void 0 : e.adFinished) &&
                            (0, u.wrapUserFn)(e.adFinished)(),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.hasAdblock = function (t) {
                return (
                  this.logger.log(
                    "Requesting adblock status (always false) (local)",
                  ),
                  (0, u.callbackWrapper)(function () {
                    return Promise.resolve(!1);
                  }, t)
                );
              }),
              (t.prototype.renderFakeAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return (
                      this.logger.log("Requesting " + t + " ad"),
                      (this.requestInProgress = !0),
                      this.showOverlay(),
                      (this.overlay.innerHTML =
                        "<h1>A " + t + " ad would appear here</h1>"),
                      [
                        2,
                        new Promise(function (t) {
                          window.setTimeout(function () {
                            (e.requestInProgress = !1), e.hideOverlay(), t();
                          }, 5e3);
                        }),
                      ]
                    );
                  });
                });
              }),
              (t.prototype.showOverlay = function () {
                this.overlay.style.display = "flex";
              }),
              (t.prototype.hideOverlay = function () {
                (this.overlay.style.display = "none"),
                  (this.overlay.innerHTML = "");
              }),
              (t.prototype.createOverlayStyle = function () {
                var t = {
                  position: "fixed",
                  display: "none",
                  inset: 0,
                  "font-family": "Arial, Helvetica, sans-serif",
                  color: "white",
                  "align-items": "center",
                  "justify-content": "center",
                  "background-color": "rgba(0,0,0,0.75)",
                  "z-index": "10000",
                };
                for (var e in t) this.overlay.style[e] = t[e];
              }),
              t
            );
          })();
        e.default = s;
      },
      216: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__assign) ||
            function () {
              return (
                (r =
                  Object.assign ||
                  function (t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                      for (var i in (e = arguments[n]))
                        Object.prototype.hasOwnProperty.call(e, i) &&
                          (t[i] = e[i]);
                    return t;
                  }),
                r.apply(this, arguments)
              );
            },
          i =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          o =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          u =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a = n(81),
          s = n(823),
          c = n(414),
          l = n(314),
          f = u(n(767)),
          h = (function () {
            function t() {
              (this.disableBannerCheck = !1),
                (this.overlayBanners = {}),
                (this.renderedBannerIds = new Set()),
                (this.logger = new f.default("banner"));
            }
            return (
              (t.prototype.requestBanner = function (t, e) {
                var n = this;
                return (0, s.callbackWrapper)(function () {
                  return i(n, void 0, void 0, function () {
                    var e, n;
                    return o(this, function (i) {
                      switch (i.label) {
                        case 0:
                          return (
                            this.logger.log("Requesting banner", t),
                            [
                              4,
                              (0, a.getBannerContainer)(
                                t.id,
                                !this.disableBannerCheck,
                              ),
                            ]
                          );
                        case 1:
                          return (
                            (e = i.sent()),
                            (n = r(r({}, t), { id: e.innerContainerId })),
                            this.renderedBannerIds.add(t.id),
                            (0, l.renderFakeBanner)(n),
                            [2]
                          );
                      }
                    });
                  });
                }, e);
              }),
              (t.prototype.requestResponsiveBanner = function (t, e) {
                var n = this;
                return (0, s.callbackWrapper)(function () {
                  return i(n, void 0, void 0, function () {
                    var e, n;
                    return o(this, function (r) {
                      switch (r.label) {
                        case 0:
                          return (
                            this.logger.log("Requesting responsive banner", t),
                            [
                              4,
                              (0, a.getBannerContainer)(
                                t,
                                !this.disableBannerCheck,
                              ),
                            ]
                          );
                        case 1:
                          return (
                            (e = r.sent()),
                            (n = {
                              id: e.innerContainerId,
                              width: e.containerInfo.size.width,
                              height: e.containerInfo.size.height,
                              isResponsive: !0,
                            }),
                            this.renderedBannerIds.add(t),
                            (0, l.renderFakeBanner)(n),
                            [2]
                          );
                      }
                    });
                  });
                }, e);
              }),
              (t.prototype.requestOverlayBanners = function (t, e) {
                var n = this,
                  r = t.map(function (t) {
                    return t.id;
                  });
                Object.keys(this.overlayBanners).forEach(function (t) {
                  r.includes(t) ||
                    (n.logger.log("Remove overlay banner " + t),
                    n.overlayBanners[t].destroy(),
                    delete n.overlayBanners[t]);
                }),
                  t.forEach(function (t) {
                    if (n.overlayBanners[t.id])
                      n.logger.log("Skip overlay banner update " + t.id);
                    else {
                      n.logger.log("Create overlay banner " + t.id);
                      var r = new c.OverlayBanner(
                        t,
                        n.disableBannerCheck,
                        n,
                        e,
                      );
                      n.overlayBanners[t.id] = r;
                    }
                  });
              }),
              (t.prototype.clearBanner = function (t) {
                var e = document.getElementById((0, a.ContainerIdToInnerId)(t));
                e
                  ? (e.remove(),
                    this.renderedBannerIds.delete(t),
                    this.logger.log("Cleared the banner from container #" + t))
                  : this.logger.log(
                      "There isn't a banner in container #" +
                        t +
                        ", not clearing anything.",
                    );
              }),
              (t.prototype.clearAllBanners = function () {
                var t = this,
                  e = Array.from(this.renderedBannerIds.values());
                this.logger.log(
                  "Clearing all banners, ids: ",
                  e
                    .map(function (t) {
                      return "#" + t;
                    })
                    .join(", "),
                ),
                  e.forEach(function (e) {
                    t.clearBanner(e);
                  });
              }),
              t
            );
          })();
        e.default = h;
      },
      942: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(871),
          a = o(n(608)),
          s = o(n(216)),
          c = o(n(338)),
          l = n(823),
          f = n(659),
          h = o(n(767)),
          d = (function () {
            function t() {
              var t = this;
              (this.initState = u.INIT_STATE.UNINITIALIZED),
                (this._ad = new a.default()),
                (this._banner = new s.default()),
                (this._user = new c.default()),
                (this.gameLink =
                  "https://www.crazygames.com/game/your-game-will-appear-here"),
                (this.mainLogger = new h.default("none")),
                (this.gameLogger = new h.default("game")),
                (this.showInviteButton = function (e, n) {
                  return (0, l.callbackWrapper)(function () {
                    return r(t, void 0, void 0, function () {
                      var t;
                      return i(this, function (n) {
                        return (
                          this.gameLogger.log("Show invite button (local)"),
                          (t = (0, f.generateInviteLink)(e, this.gameLink)),
                          this.gameLogger.log("Invite button link " + t),
                          [2, t]
                        );
                      });
                    });
                  }, n);
                }),
                (this.inviteLink = function (e, n) {
                  return (0, l.callbackWrapper)(function () {
                    return r(t, void 0, void 0, function () {
                      var t;
                      return i(this, function (n) {
                        return (
                          this.gameLogger.log("Requesting invite link (local)"),
                          (t = (0, f.generateInviteLink)(e, this.gameLink)),
                          this.gameLogger.log("Invite link is " + t),
                          [2, t]
                        );
                      });
                    });
                  }, n);
                });
            }
            return (
              (t.prototype.init = function (t) {
                this.mainLogger.log("Initializing local sdk"),
                  t && this.mainLogger.log("Init options", t),
                  this.initState !== u.INIT_STATE.INITIALIZED &&
                    ((this.initState = u.INIT_STATE.INITIALIZED),
                    this._ad.init(),
                    (this._banner.disableBannerCheck =
                      "true" ===
                      (0, l.getQueryStringValue)("disable_banner_check")));
              }),
              (t.prototype.addInitCallback = function (t) {
                var e = !0;
                "false" ===
                  (0, l.getQueryStringValue)("user_account_available") &&
                  (e = !1),
                  t({
                    gameLink:
                      "https://www.crazygames.com/game/yourFabulousGameHere",
                    rafvertizingUrl: "demo",
                    useTestAds: !1,
                    systemInfo: {
                      countryCode: "demo",
                      browser: { name: "demo", version: "demo" },
                      os: { name: "demo", version: "demo" },
                      device: "desktop",
                    },
                    gameId: "",
                    locale: "en-US",
                    userAccountAvailable: e,
                    isQaTool: !1,
                  });
              }),
              (t.prototype.isQaTool = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, l.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.getEnvironment = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, l.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, "local"];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  return this._ad;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  return this._banner;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  return this._user;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  var t = this;
                  return {
                    happytime: function (e) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return (
                              this.gameLogger.log(
                                "Requesting happytime (local)",
                              ),
                              [2]
                            );
                          });
                        });
                      }, e);
                    },
                    gameplayStart: function (e) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return (
                              this.gameLogger.log(
                                "Requesting gameplay start (local)",
                              ),
                              [2]
                            );
                          });
                        });
                      }, e);
                    },
                    gameplayStop: function (e) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return (
                              this.gameLogger.log(
                                "Requesting gameplay stop (local)",
                              ),
                              [2]
                            );
                          });
                        });
                      }, e);
                    },
                    sdkGameLoadingStart: function (e) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return (
                              this.gameLogger.log(
                                "Requesting game loading start (local)",
                              ),
                              [2]
                            );
                          });
                        });
                      }, e);
                    },
                    sdkGameLoadingStop: function (e) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return (
                              this.gameLogger.log(
                                "Requesting game loading stop (local)",
                              ),
                              [2]
                            );
                          });
                        });
                      }, e);
                    },
                    inviteLink: this.inviteLink,
                    showInviteButton: this.showInviteButton,
                    hideInviteButton: function () {
                      t.gameLogger.log("Hide invite button (local)");
                    },
                    setScreenshotHandlerAsync: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, function () {}];
                        });
                      });
                    },
                    setScreenshotHandler: function (t) {
                      return function () {};
                    },
                    getInviteParam: function (e, n) {
                      return (0, l.callbackWrapper)(function () {
                        return r(t, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [
                              2,
                              new URLSearchParams(window.location.search).get(
                                e,
                              ),
                            ];
                          });
                        });
                      }, n);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.syncUnityGameData = function (t) {
                var e = this;
                return (0, l.callbackWrapper)(function () {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (t) {
                      return (
                        this.mainLogger.log(
                          "Requesting to sync UnityGameData (local)",
                        ),
                        [2]
                      );
                    });
                  });
                }, t);
              }),
              t
            );
          })();
        e.default = d;
      },
      338: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = o(n(767)),
          s = (function () {
            function t() {
              (this.systemInfo = {
                browser: { name: "Chrome", version: "89.0.0.0" },
                countryCode: "FR",
                os: { name: "Windows", version: "10" },
                device: "desktop",
              }),
                (this.demoUser1 = {
                  username: "User1",
                  profilePictureUrl:
                    "https://images.crazygames.com/userportal/avatars/1.png",
                }),
                (this.demoUser2 = {
                  username: "User2",
                  profilePictureUrl:
                    "https://images.crazygames.com/userportal/avatars/2.png",
                }),
                (this.user1Token =
                  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.u4N2DzCC6Vmo6Gys-XSl8rHQR0NUJAcWQWr29eLd54qMDPbCopPG0kye8TAidOU6dWAqNWO_kERbl75nTxNcJjbW4yqBS_bIPingIhuCCJsjvnQPkalfmVotmoZGQP21Q9MyZPfpjZNogioA3a0vm6APXAqzudTA9lTioztnT4YvgndISngOMQVNoDCJ_DgCbKy8GFQDcCN-AHFFb0WIVWiTYszv-9JZohUzULt-ueYL31pXVGHQ5C4rHESEg7LYzx1IaLKw1zcoYGxul0RxR35nm3yD_bGa6fQVzCfnKnhEBRifUZsIN1LfIHfNB23ZOh1llG7PEOdvtCSfIxP9ZK6t4gRkGn1VsqZFAMhq1LgJebO8hcm_Iqx0wF3WkdMysoQuWThTNKnwmphv9pguuALILYJluUP8UQll3qiF6gzoLPy1MfD_9l4TPZeP9Bv50B-Tm6Lk3OW248jyuFRKP_VgwZutTb5pJ7LggFcqWFXsBv5ZG3V2zsfVwpAPDhpmb4ykjoB2xLSuxjrvs1dzMhl02QAQjqTUgHj4fstgX-2jYowDyyPjj6JbT2ZC7vrrdmPvc8AcNvyCszamfRYjexElGaeJDDt6vtRuJw_JVwsCLaYHGif4UaKCoe6BECg3mRVUkH08Nm-qQPQw9slpYZmxckFEQQPCGkkPhgOBFkE"),
                (this.user2Token =
                  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIyIiwidXNlcm5hbWUiOiJVc2VyMiIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8yLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.kh60HYKR8txKvLoCB6dQ9hQG8Mu1UgtneTGs3Y15HvBWrZoLKp3x3pTf_Vhq8xzs7fQYJKr94zYAxxFRztHey7Tv7PBBmPESUFo8Le-_s2xDy982sFhpM6XDt84ohhvEuJEsOW8wIcCaCK6wzm6UWY6n1bpw1cO1KNASyZRSkDRhfyzDVJ5e167OLgGe3euodTHgClJPDv0ZYhle9KH86PepWamCm0429VrzyOu6QdbtFcRlRNZVnTtgNrCpyvss4AyDhnY5qV9yng7xHVt4zlocP_Z7btBL_kxrzYskhJi6KYuQAYmqLxqHSDnehlIvgO4cdEpJA_FOTeACTohhEu8zjXRrfdAFvEe0W6qqUo5HNFoElRoxYWf11WGSdrJCjpF4Qei9BPgprFaVH2Xi-ITAjKyElQxeKs5p6VmvaMAGwdqZgM4fm7OSex8QQGK0HFJ7wFoCTV5PLl-MBVvTSTfemJMWEwc8od124gwT_uGdDKrASovT2pijgBsAi3jxwgfEr1RPq8uCgZtksrTqaAM9TMv9Z6Zv35pdgTrWzTrOn-G-uc4EPZq7iQaEnglWEFj8Qsm_nMQMgtIM7MYG8KwPC4if3-Yc8KwaAL_taVvkqyMaV3W5j4MX9b1bbf_fw3jrGt74MACb7FtgzKudxoz2CXKZqTppadxS_IOnlMk"),
                (this.expiredToken =
                  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzQ5MSwiZXhwIjoxNjY4NTkzNDkyfQ.l_0cyeD-suEM7n9l-Vb2nP5vTJi-e3HwZQWLUESJMdVTX1zPDuQhwnSgHhcGVGFnhG5Wvtni-ElpM8HnVNvY7hRthbeP23n2ScAJBvAX10vrzPuLJRn_Nj_5GcRQpK4fH813Ij8ZWuOaS2hD4gKaEUessZs5n5hNBTQN9T5j4wkNvfhuw9vqtVOha2aPveqeVy1eA5XAWI7IirHi31-Dw60MSVgsp3r4tpYEHTlUPktzLsQvO9Sk9IE7iybg9ycoFoS6L1eAvxGWVF1BMHRerPwdOV9CN0rtrqrTM3pyb1fpmFfgQpoA8AgPuVrU58mwyeTpUQ4WSrPrltGjxxfiGQOATBDBrJk5V173BfUgBEgAEP0TifWAQt02iijJa9G6q-V8p0GWto1EYSdvEDmG0YhoRBVxnOQH3U1Fu0yxMWGMm9VmZVVhVN8PpLjitEhP4Gn33IafpS05d1-Q0NFMb9-FvQCdtXjTaGbaBVIeBN-aO0r4ERvoBE9R0AUrywd9Z2zK_qKRvp35NyryLjnedsYt5Xrc9TA2uDMR77TjByyqsdQ_qv4zhLfhuiMiweXyPfYzltAiNJmEUohxlP7OvH33B6xpT7Qz2ZyEeMHBrQRQGGlT6MowcMYx_2LFNSK8PwZJNlMs0Uw_uCIu-4TvqleVleIg7sLhWiijw1cxtmM"),
                (this.logger = new a.default("user"));
            }
            return (
              (t.prototype.showAuthPrompt = function (t) {
                var e = this;
                switch (
                  (this.logger.log("Requesting auth prompt (local)"),
                  (0, u.getQueryStringValue)("show_auth_prompt_response"))
                ) {
                  case "user1":
                  default:
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.demoUser1];
                        });
                      });
                    }, t);
                  case "user2":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.demoUser2];
                        });
                      });
                    }, t);
                  case "user_cancelled":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          throw new Error("userCancelled");
                        });
                      });
                    }, t);
                }
              }),
              (t.prototype.showAccountLinkPrompt = function (t) {
                var e = this;
                switch (
                  (this.logger.log("Requesting link account prompt (local)"),
                  (0, u.getQueryStringValue)("link_account_response"))
                ) {
                  case "yes":
                  default:
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, { response: "yes" }];
                        });
                      });
                    }, t);
                  case "no":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, { response: "no" }];
                        });
                      });
                    }, t);
                  case "logged_out":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          throw new Error("userNotAuthenticated");
                        });
                      });
                    }, t);
                }
              }),
              (t.prototype.getUser = function (t) {
                var e = this;
                switch (
                  (this.logger.log("Requesting user object (local)"),
                  (0, u.getQueryStringValue)("user_response"))
                ) {
                  case "user1":
                  default:
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.demoUser1];
                        });
                      });
                    }, t);
                  case "user2":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.demoUser2];
                        });
                      });
                    }, t);
                  case "logged_out":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, null];
                        });
                      });
                    }, t);
                }
              }),
              (t.prototype.getSystemInfo = function (t) {
                var e = this;
                return (
                  this.logger.log("Requesting system info (local)"),
                  (0, u.callbackWrapper)(function () {
                    return r(e, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2, this.systemInfo];
                      });
                    });
                  }, t)
                );
              }),
              (t.prototype.getUserToken = function (t) {
                var e = this;
                switch (
                  (this.logger.log("Requesting user token (local)"),
                  (0, u.getQueryStringValue)("token_response"))
                ) {
                  case "user1":
                  default:
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.user1Token];
                        });
                      });
                    }, t);
                  case "user2":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.user2Token];
                        });
                      });
                    }, t);
                  case "expired_token":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, this.expiredToken];
                        });
                      });
                    }, t);
                  case "logged_out":
                    return (0, u.callbackWrapper)(function () {
                      return r(e, void 0, void 0, function () {
                        return i(this, function (t) {
                          throw new Error("userNotAuthenticated");
                        });
                      });
                    }, t);
                }
              }),
              (t.prototype.getXsollaUserToken = function (t) {
                var e = this;
                return (
                  this.logger.log("Requesting Xsolla user token (local)"),
                  (0, u.callbackWrapper)(function () {
                    return r(e, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2, "Demo local Xsolla token"];
                      });
                    });
                  }, t)
                );
              }),
              (t.prototype.addScore = function (t, e) {
                var n = this;
                return (
                  this.logger.log("Requesting to add score (local)", t),
                  (0, u.callbackWrapper)(function () {
                    return r(n, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2];
                      });
                    });
                  }, e)
                );
              }),
              (t.prototype.addScoreEncrypted = function (t, e, n) {
                var o = this;
                return (
                  this.logger.log(
                    "Requesting to add score (local). Score: ",
                    t,
                    "Encrypted score: ",
                    e,
                  ),
                  (0, u.callbackWrapper)(function () {
                    return r(o, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2];
                      });
                    });
                  }, n)
                );
              }),
              (t.prototype.addAuthListener = function (t) {}),
              (t.prototype.removeAuthListener = function (t) {}),
              (t.prototype.isUserAccountAvailable = function (t) {
                var e = this;
                return (
                  this.logger.log("Requesting user account available (local)"),
                  (0, u.callbackWrapper)(function () {
                    return r(e, void 0, void 0, function () {
                      return i(this, function (t) {
                        return [2, !0];
                      });
                    });
                  }, t)
                );
              }),
              t
            );
          })();
        e.default = s;
      },
      245: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var o = n(514),
          u = n(286),
          a = (function () {
            function t(t) {
              var e = this;
              (this.sdkInitializer = t),
                (this.initCallbacks = []),
                (this.throttledHappyTime = (0, o.throttledMethod)(function (t) {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, this.sdkInitializer.ensureInit()];
                        case 1:
                          return (
                            e.sent(),
                            [
                              2,
                              this.sdkInitializer
                                .getInstance()
                                .game.happytime(t),
                            ]
                          );
                      }
                    });
                  });
                }, 1e3)),
                (this.throttledGameplayStart = (0, o.throttledMethod)(function (
                  t,
                ) {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, this.sdkInitializer.ensureInit()];
                        case 1:
                          return (
                            e.sent(),
                            [
                              2,
                              this.sdkInitializer
                                .getInstance()
                                .game.gameplayStart(t),
                            ]
                          );
                      }
                    });
                  });
                }, 1e3)),
                (this.throttledGameplayStop = (0, o.throttledMethod)(function (
                  t,
                ) {
                  return r(e, void 0, void 0, function () {
                    return i(this, function (e) {
                      switch (e.label) {
                        case 0:
                          return [4, this.sdkInitializer.ensureInit()];
                        case 1:
                          return (
                            e.sent(),
                            [
                              2,
                              this.sdkInitializer
                                .getInstance()
                                .game.gameplayStop(t),
                            ]
                          );
                      }
                    });
                  });
                }, 1e3));
            }
            return (
              (t.prototype.getEnvironment = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.sdkInitializer.ensureInit()];
                      case 1:
                        return (
                          e.sent(),
                          [
                            2,
                            this.sdkInitializer.getInstance().getEnvironment(t),
                          ]
                        );
                    }
                  });
                });
              }),
              (t.prototype.isQaTool = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.sdkInitializer.ensureInit()];
                      case 1:
                        return (
                          e.sent(),
                          [2, this.sdkInitializer.getInstance().isQaTool(t)]
                        );
                    }
                  });
                });
              }),
              (t.prototype.init = function () {}),
              (t.prototype.addInitCallback = function (t) {
                this.initCallbacks.push(t);
              }),
              (t.prototype.forwardInitCallbacks = function (t) {
                this.initCallbacks.forEach(function (e) {
                  return t.addInitCallback(e);
                }),
                  (this.initCallbacks = []);
              }),
              (t.prototype.syncUnityGameData = function (t) {
                return r(this, void 0, void 0, function () {
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [4, this.sdkInitializer.ensureInit()];
                      case 1:
                        return (
                          e.sent(),
                          [
                            2,
                            this.sdkInitializer
                              .getInstance()
                              .syncUnityGameData(t),
                          ]
                        );
                    }
                  });
                });
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  var t = this;
                  return {
                    requestAd: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .ad.requestAd(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    hasAdblock: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .ad.hasAdblock(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  var t = this;
                  return {
                    requestBanner: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .banner.requestBanner(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    requestResponsiveBanner: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .banner.requestResponsiveBanner(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    requestOverlayBanners: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .banner.requestOverlayBanners(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    clearBanner: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .banner.clearBanner(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                    clearAllBanners: function () {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .banner.clearAllBanners(),
                                ]
                              );
                          }
                        });
                      });
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  var t = this;
                  return {
                    happytime: this.throttledHappyTime,
                    gameplayStart: this.throttledGameplayStart,
                    gameplayStop: this.throttledGameplayStop,
                    sdkGameLoadingStart: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.sdkGameLoadingStart(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                    sdkGameLoadingStop: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.sdkGameLoadingStop(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                    inviteLink: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.inviteLink(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    showInviteButton: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.showInviteButton(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    hideInviteButton: function () {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.hideInviteButton(),
                                ]
                              );
                          }
                        });
                      });
                    },
                    setScreenshotHandlerAsync: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return t.sent(), [2, function () {}];
                          }
                        });
                      });
                    },
                    setScreenshotHandler: function (t) {
                      return function () {};
                    },
                    getInviteParam: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .game.getInviteParam(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  var t = this;
                  return {
                    getUser: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("getUser"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  4,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.getUser(e),
                                ]
                              );
                            case 2:
                              return [2, t.sent()];
                          }
                        });
                      });
                    },
                    getSystemInfo: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  4,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.getSystemInfo(e),
                                ]
                              );
                            case 2:
                              return [2, t.sent()];
                          }
                        });
                      });
                    },
                    showAuthPrompt: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("showAuthPrompt"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  4,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.showAuthPrompt(e),
                                ]
                              );
                            case 2:
                              return [2, t.sent()];
                          }
                        });
                      });
                    },
                    showAccountLinkPrompt: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("showAccountLinkPrompt"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  4,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.showAccountLinkPrompt(e),
                                ]
                              );
                            case 2:
                              return [2, t.sent()];
                          }
                        });
                      });
                    },
                    addAuthListener: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                this.sdkInitializer
                                  .getInstance()
                                  .user.addAuthListener(e),
                                [2]
                              );
                          }
                        });
                      });
                    },
                    removeAuthListener: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                this.sdkInitializer
                                  .getInstance()
                                  .user.removeAuthListener(e),
                                [2]
                              );
                          }
                        });
                      });
                    },
                    getUserToken: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("getUserToken"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.getUserToken(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                    getXsollaUserToken: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("getXsollaUserToken"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.getXsollaUserToken(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                    addScore: function (e, n) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("addScore"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.addScore(e, n),
                                ]
                              );
                          }
                        });
                      });
                    },
                    addScoreEncrypted: function (e, n, o) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return (
                                (0, u.showBetaWarning)("addScoreEncrypted"),
                                [4, this.sdkInitializer.ensureInit()]
                              );
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.addScoreEncrypted(e, n, o),
                                ]
                              );
                          }
                        });
                      });
                    },
                    isUserAccountAvailable: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          switch (t.label) {
                            case 0:
                              return [4, this.sdkInitializer.ensureInit()];
                            case 1:
                              return (
                                t.sent(),
                                [
                                  2,
                                  this.sdkInitializer
                                    .getInstance()
                                    .user.isUserAccountAvailable(e),
                                ]
                              );
                          }
                        });
                      });
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              t
            );
          })();
        e.default = a;
      },
      724: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.SDKInitializer = void 0);
        var u = o(n(273)),
          a = o(n(942)),
          s = o(n(799)),
          c = n(823),
          l = o(n(176)),
          f = o(n(983)),
          h = o(n(245)),
          d = n(719),
          p = n(412),
          v = o(n(767)),
          g = (function () {
            function t() {
              (this.proxyInstance = new h.default(this)),
                (this.initResolvers = []),
                (this.crazyGamesCheckResolver = function () {}),
                (this.isOnCrazyGames = !1),
                (this.logger = new v.default("none")),
                this.initializeSDK();
            }
            return (
              (t.prototype.isYandex = function () {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    try {
                      return [
                        2,
                        window.location.origin.endsWith("yandex.net") ||
                          "true" === (0, c.getQueryStringValue)("useYandexSdk"),
                      ];
                    } catch (t) {
                      return [2, !1];
                    }
                    return [2];
                  });
                });
              }),
              (t.prototype.isFacebook = function () {
                return r(this, void 0, void 0, function () {
                  return i(this, function (t) {
                    try {
                      return [
                        2,
                        window.location.origin.endsWith("apps.fbsbx.com") ||
                          "true" ===
                            (0, c.getQueryStringValue)("useFacebookSdk"),
                      ];
                    } catch (t) {
                      return [2, !1];
                    }
                    return [2];
                  });
                });
              }),
              (t.prototype.isLocalhost = function () {
                return r(this, void 0, void 0, function () {
                  var t;
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return [
                          "http://localhost:4000/gameframe-unity56-standalone/",
                          "http://localhost:4000/gameframe-unity56/",
                          "http://localhost:4000/gameframe-standalone/",
                          "http://localhost:4000/gameframe/",
                        ].some(function (t) {
                          return window.location.href.startsWith(t);
                        })
                          ? [2, !1]
                          : (t =
                                [
                                  "localhost",
                                  "127.0.0.1",
                                  "preview.construct.net",
                                ].includes(window.location.hostname) ||
                                "true" ===
                                  (0, c.getQueryStringValue)("useLocalSdk"))
                            ? [4, (0, d.wait)(500)]
                            : [3, 2];
                      case 1:
                        e.sent(), (e.label = 2);
                      case 2:
                        return [2, t];
                    }
                  });
                });
              }),
              (t.prototype.isCrazyGames = function () {
                return r(this, void 0, void 0, function () {
                  var t,
                    e,
                    n = this;
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return (
                          window.addEventListener(
                            "message",
                            function (t) {
                              return n.crazyGamesGfCheckListener(t);
                            },
                            !1,
                          ),
                          (t = { type: "checkCrazyGamesGF" }),
                          window.postMessage(t, "*"),
                          window.parent.postMessage(t, "*"),
                          window.parent.parent.postMessage(t, "*"),
                          window.parent.parent.parent.postMessage(t, "*"),
                          (e = new Promise(function (t) {
                            n.crazyGamesCheckResolver = t;
                          })),
                          [4, Promise.race([e, (0, d.wait)(3e3)])]
                        );
                      case 1:
                        return (
                          r.sent(),
                          window.removeEventListener(
                            "message",
                            this.crazyGamesGfCheckListener,
                          ),
                          [2, this.isOnCrazyGames]
                        );
                    }
                  });
                });
              }),
              (t.prototype.crazyGamesGfCheckListener = function (t) {
                "crazyGamesGFConfirmation" === t.data.type &&
                  ((this.isOnCrazyGames = !0), this.crazyGamesCheckResolver());
              }),
              (t.prototype.getProxy = function () {
                return this.proxyInstance;
              }),
              (t.prototype.getInstance = function () {
                return this.realInstance;
              }),
              (t.prototype.initializeSDK = function () {
                return r(this, void 0, void 0, function () {
                  var t, e, n, r, o, c;
                  return i(this, function (i) {
                    switch (i.label) {
                      case 0:
                        return [
                          4,
                          Promise.all([
                            this.isCrazyGames(),
                            this.isLocalhost(),
                            this.isFacebook(),
                            this.isYandex(),
                          ]),
                        ];
                      case 1:
                        return (
                          (t = i.sent()),
                          (e = t[0]),
                          (n = t[1]),
                          (r = t[2]),
                          (o = t[3]),
                          n
                            ? ((v.default.forceEnable = !0),
                              (this.realInstance = new a.default()))
                            : (this.realInstance = e
                                ? new u.default()
                                : o
                                  ? new s.default()
                                  : r
                                    ? new f.default()
                                    : new l.default()),
                          (c = window.crazySdkInitOptions),
                          [4, this.realInstance.getEnvironment()]
                        );
                      case 2:
                        return (
                          i.sent(),
                          p.SDK_VERSION,
                          this.proxyInstance.forwardInitCallbacks(
                            this.realInstance,
                          ),
                          this.realInstance.init(c),
                          this.onInitialized(),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.onInitialized = function () {
                this.logger.log(
                  "SDK initialized, forwarding " +
                    this.initResolvers.length +
                    " cached calls",
                ),
                  this.initResolvers.length > 0 &&
                    (this.initResolvers.forEach(function (t) {
                      return t();
                    }),
                    (this.initResolvers = []));
              }),
              (t.prototype.ensureInit = function () {
                return r(this, void 0, void 0, function () {
                  var t = this;
                  return i(this, function (e) {
                    return this.realInstance
                      ? [2, Promise.resolve()]
                      : [
                          2,
                          new Promise(function (e) {
                            t.initResolvers.push(function () {
                              return r(t, void 0, void 0, function () {
                                return i(this, function (t) {
                                  return e(), [2];
                                });
                              });
                            });
                          }),
                        ];
                  });
                });
              }),
              t
            );
          })();
        e.SDKInitializer = g;
      },
      769: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = n(871),
          s = o(n(767)),
          c = (function () {
            function t(t) {
              (this.sdk = t),
                (this.requestInProgress = !1),
                (this.throttleMidroll = !1),
                (this.throttleRewarded = !1),
                (this.logger = new s.default("ad")),
                (this._onRewardedCalled = !1);
            }
            return (
              (t.prototype.requestAd = function (t, e) {
                return r(this, void 0, void 0, function () {
                  var n;
                  return i(this, function (r) {
                    return (
                      this.logger.log("Requesting " + t + " ad"),
                      this.requestInProgress &&
                        (null == e ? void 0 : e.adError) &&
                        ((n = "An ad request is already in progress"),
                        (0, u.wrapUserFn)(e.adError)(n, {
                          reason: "other",
                          message: n,
                        })),
                      (this.requestInProgress = !0),
                      "rewarded" === t
                        ? [2, this.requestRewardedAd(e)]
                        : [2, this.requestMidrollAd(e)]
                    );
                  });
                });
              }),
              (t.prototype.hasAdblock = function (t) {
                return (0, u.callbackWrapper)(function () {
                  return Promise.resolve(!1);
                }, t);
              }),
              (t.prototype.handleAdError = function (t, e) {
                (this.requestInProgress = !1),
                  (null == e ? void 0 : e.adError)
                    ? (0, u.wrapUserFn)(e.adError)(t.toString(), {
                        reason: "other",
                        message: t.toString(),
                      })
                    : (null == e ? void 0 : e.adFinished) &&
                      (0, u.wrapUserFn)(e.adFinished)();
              }),
              (t.prototype.handleAdFinished = function (t) {
                (this.requestInProgress = !1),
                  (null == t ? void 0 : t.adFinished) &&
                    (0, u.wrapUserFn)(t.adFinished)();
              }),
              (t.prototype.handleAdStarted = function (t) {
                (null == t ? void 0 : t.adStarted) &&
                  (0, u.wrapUserFn)(null == t ? void 0 : t.adStarted)();
              }),
              (t.prototype.requestMidrollAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n = this;
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return [4, this.sdk.ensureInit()];
                      case 1:
                        return (
                          (e = r.sent()),
                          this.throttleMidroll
                            ? (this.handleAdError(
                                "Please wait " +
                                  a.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS / 1e3 +
                                  " seconds between two midroll ads",
                                t,
                              ),
                              [2])
                            : (e.adv.showFullscreenAdv({
                                callbacks: {
                                  onOpen: function () {
                                    (n.throttleMidroll = !0),
                                      setTimeout(function () {
                                        return (n.throttleMidroll = !1);
                                      }, a.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS),
                                      n.handleAdStarted(t);
                                  },
                                  onClose: function () {
                                    n.handleAdFinished(t);
                                  },
                                  onError: function (e) {
                                    n.handleAdError(e, t);
                                  },
                                },
                              }),
                              [2])
                        );
                    }
                  });
                });
              }),
              (t.prototype.requestRewardedAd = function (t) {
                return r(this, void 0, void 0, function () {
                  var e,
                    n = this;
                  return i(this, function (r) {
                    switch (r.label) {
                      case 0:
                        return [4, this.sdk.ensureInit()];
                      case 1:
                        return (
                          (e = r.sent()),
                          this.throttleRewarded
                            ? (this.handleAdError(
                                "Please wait " +
                                  a.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS / 1e3 +
                                  " seconds between two rewarded ads",
                                t,
                              ),
                              [2])
                            : ((this._onRewardedCalled = !1),
                              e.adv.showRewardedVideo({
                                callbacks: {
                                  onOpen: function () {
                                    (n.throttleRewarded = !0),
                                      setTimeout(function () {
                                        return (n.throttleRewarded = !1);
                                      }, a.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS),
                                      n.handleAdStarted(t);
                                  },
                                  onRewarded: function () {
                                    n._onRewardedCalled ||
                                      ((n._onRewardedCalled = !0),
                                      n.handleAdFinished(t));
                                  },
                                  onClose: function () {
                                    n._onRewardedCalled ||
                                      ((n._onRewardedCalled = !0),
                                      n.handleAdFinished(t));
                                  },
                                  onError: function (e) {
                                    n.handleAdError(e, t);
                                  },
                                },
                              }),
                              [2])
                        );
                    }
                  });
                });
              }),
              t
            );
          })();
        e.default = c;
      },
      799: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var u = n(823),
          a = n(871),
          s = o(n(769)),
          c = o(n(767)),
          l = (function () {
            function t() {
              (this.initState = a.INIT_STATE.UNINITIALIZED),
                (this.yandexPromise = null),
                (this._ad = new s.default(this)),
                (this.bannerLogger = new c.default("banner")),
                (this.mainLogger = new c.default("none"));
            }
            return (
              (t.prototype.init = function () {
                this.initState === a.INIT_STATE.UNINITIALIZED &&
                  this.installYandex();
              }),
              (t.prototype.addInitCallback = function (t) {
                var e;
                return r(this, void 0, void 0, function () {
                  return i(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return [4, this.ensureInit()];
                      case 1:
                        return (
                          n.sent(),
                          t({
                            gameLink: "",
                            rafvertizingUrl: "",
                            useTestAds: !1,
                            systemInfo: {
                              countryCode: "",
                              browser: { name: "", version: "" },
                              os: { name: "", version: "" },
                              device: "desktop",
                            },
                            gameId: "",
                            locale:
                              (null === (e = this.yandexSDKObj) || void 0 === e
                                ? void 0
                                : e.environment.i18n.lang) || "en-US",
                            userAccountAvailable: !1,
                            isQaTool: !1,
                          }),
                          [2]
                        );
                    }
                  });
                });
              }),
              (t.prototype.isQaTool = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              (t.prototype.getEnvironment = function (t) {
                return r(this, void 0, void 0, function () {
                  var e = this;
                  return i(this, function (n) {
                    return [
                      2,
                      (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, "yandex"];
                          });
                        });
                      }, t),
                    ];
                  });
                });
              }),
              Object.defineProperty(t.prototype, "ad", {
                get: function () {
                  return this._ad;
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "banner", {
                get: function () {
                  var t = this;
                  return {
                    requestBanner: function (e, n) {
                      var o = "Responsive banner not supported with YandexSDK";
                      return (
                        t.bannerLogger.error(o),
                        (0, u.callbackWrapper)(function () {
                          return r(t, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error(o);
                            });
                          });
                        }, n)
                      );
                    },
                    requestResponsiveBanner: function (e, n) {
                      var o = "Responsive banner not supported with YandexSDK";
                      return (
                        t.bannerLogger.error(o),
                        (0, u.callbackWrapper)(function () {
                          return r(t, void 0, void 0, function () {
                            return i(this, function (t) {
                              throw new Error(o);
                            });
                          });
                        }, n)
                      );
                    },
                    requestOverlayBanners: function (t, e) {
                      throw new Error(
                        "Overlay banners not supported with Yandex",
                      );
                    },
                    clearBanner: function (t) {
                      throw new Error(
                        "Clearing banners is supported with Yandex",
                      );
                    },
                    clearAllBanners: function () {
                      throw new Error(
                        "Clearing banners is supported with Yandex",
                      );
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "game", {
                get: function () {
                  var t = this;
                  return {
                    happytime: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Happytime is not supported with YandexSDK",
                        );
                      }, t);
                    },
                    gameplayStart: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Gameplay start is not supported with YandexSDK",
                        );
                      }, t);
                    },
                    gameplayStop: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Gameplay stop is not supported with YandexSDK",
                        );
                      }, t);
                    },
                    sdkGameLoadingStart: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Game load start from SDK is not supported with YandexSDK",
                        );
                      }, t);
                    },
                    sdkGameLoadingStop: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Game load stop from SDK is not supported with YandexSDK",
                        );
                      }, t);
                    },
                    inviteLink: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with YandexSDK",
                        );
                      }, e);
                    },
                    showInviteButton: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with YandexSDK",
                        );
                      }, e);
                    },
                    hideInviteButton: function () {
                      throw new a.SDKError(
                        "Invite button is not supported with YandexSDK",
                      );
                    },
                    setScreenshotHandlerAsync: function (e) {
                      return r(t, void 0, void 0, function () {
                        return i(this, function (t) {
                          return [2, function () {}];
                        });
                      });
                    },
                    setScreenshotHandler: function (t) {
                      return function () {};
                    },
                    getInviteParam: function (t, e) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "Invite link is not supported with YandexSDK",
                        );
                      }, e);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              Object.defineProperty(t.prototype, "user", {
                get: function () {
                  return {
                    getUser: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError("No user available with Yandex");
                      }, t);
                    },
                    getSystemInfo: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No system info available with Yandex",
                        );
                      }, t);
                    },
                    showAuthPrompt: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError("No user available with Yandex");
                      }, t);
                    },
                    showAccountLinkPrompt: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No account linking available with Yandex",
                        );
                      }, t);
                    },
                    getUserToken: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No user token available with Yandex.",
                        );
                      }, t);
                    },
                    getXsollaUserToken: function (t) {
                      return (0, u.callbackWrapper)(function () {
                        throw new a.SDKError(
                          "No Xsolla user token available with Yandex.",
                        );
                      }, t);
                    },
                    addScore: function (t, e) {
                      var n = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(n, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new a.SDKError(
                              "Game score is not supported with Yandex",
                            );
                          });
                        });
                      }, e);
                    },
                    addScoreEncrypted: function (t, e, n) {
                      var o = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(o, void 0, void 0, function () {
                          return i(this, function (t) {
                            throw new a.SDKError(
                              "Game score is not supported with Yandex",
                            );
                          });
                        });
                      }, n);
                    },
                    addAuthListener: function (t) {},
                    removeAuthListener: function (t) {},
                    isUserAccountAvailable: function (t) {
                      var e = this;
                      return (0, u.callbackWrapper)(function () {
                        return r(e, void 0, void 0, function () {
                          return i(this, function (t) {
                            return [2, !1];
                          });
                        });
                      }, t);
                    },
                  };
                },
                enumerable: !1,
                configurable: !0,
              }),
              (t.prototype.syncUnityGameData = function (t) {
                return (0, u.callbackWrapper)(function () {
                  throw new a.SDKError(
                    "syncUnityGameData is not supported with YandexSDK",
                  );
                }, t);
              }),
              (t.prototype.ensureInit = function () {
                return r(this, void 0, void 0, function () {
                  var t;
                  return i(this, function (e) {
                    switch (e.label) {
                      case 0:
                        return this.yandexSDKObj
                          ? [2, this.yandexSDKObj]
                          : this.initState !== a.INIT_STATE.UNINITIALIZED &&
                              this.yandexPromise
                            ? [3, 1]
                            : [2, this.installYandex()];
                      case 1:
                        return (t = this), [4, this.yandexPromise];
                      case 2:
                        return (
                          (t.yandexSDKObj = e.sent()), [2, this.yandexSDKObj]
                        );
                    }
                  });
                });
              }),
              (t.prototype.installYandex = function () {
                return r(this, void 0, void 0, function () {
                  var t, e;
                  return i(this, function (n) {
                    switch (n.label) {
                      case 0:
                        return (
                          this.mainLogger.log("Initializing"),
                          (this.initState = a.INIT_STATE.REQUESTED),
                          [
                            4,
                            (0, u.loadScript)("https://yandex.ru/games/sdk/v2"),
                          ]
                        );
                      case 1:
                        return (
                          n.sent(),
                          (t = window.YaGames.init()),
                          (this.yandexPromise = t),
                          [
                            4,
                            Promise.race([
                              t,
                              new Promise(function (t, e) {
                                setTimeout(function () {
                                  e(
                                    "Yandex SDK was unable to init within the timeout",
                                  );
                                }, 5e3);
                              }),
                            ]),
                          ]
                        );
                      case 2:
                        return (
                          (e = n.sent()),
                          (this.yandexSDKObj = e),
                          this.mainLogger.log("Yandex SDK initialized"),
                          (this.initState = a.INIT_STATE.INITIALIZED),
                          [2, e]
                        );
                    }
                  });
                });
              }),
              t
            );
          })();
        e.default = l;
      },
      871: function (t, e) {
        "use strict";
        var n,
          r =
            (this && this.__extends) ||
            ((n = function (t, e) {
              return (
                (n =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e;
                    }) ||
                  function (t, e) {
                    for (var n in e)
                      Object.prototype.hasOwnProperty.call(e, n) &&
                        (t[n] = e[n]);
                  }),
                n(t, e)
              );
            }),
            function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Class extends value " +
                    String(e) +
                    " is not a constructor or null",
                );
              function r() {
                this.constructor = t;
              }
              n(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((r.prototype = e.prototype), new r()));
            });
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS =
            e.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS =
            e.INIT_STATE =
            e.SDKError =
              void 0);
        var i,
          o = (function (t) {
            function e() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return r(e, t), e;
          })(Error);
        (e.SDKError = o),
          ((i = e.INIT_STATE || (e.INIT_STATE = {}))[(i.UNINITIALIZED = 0)] =
            "UNINITIALIZED"),
          (i[(i.REQUESTED = 1)] = "REQUESTED"),
          (i[(i.INITIALIZED = 2)] = "INITIALIZED"),
          (e.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS = 18e4),
          (e.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS = 5e3);
      },
      81: function (t, e, n) {
        "use strict";
        var r,
          i =
            (this && this.__extends) ||
            ((r = function (t, e) {
              return (
                (r =
                  Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array &&
                    function (t, e) {
                      t.__proto__ = e;
                    }) ||
                  function (t, e) {
                    for (var n in e)
                      Object.prototype.hasOwnProperty.call(e, n) &&
                        (t[n] = e[n]);
                  }),
                r(t, e)
              );
            }),
            function (t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Class extends value " +
                    String(e) +
                    " is not a constructor or null",
                );
              function n() {
                this.constructor = t;
              }
              r(t, e),
                (t.prototype =
                  null === e
                    ? Object.create(e)
                    : ((n.prototype = e.prototype), new n()));
            }),
          o =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          u =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          a =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.getBannerSizeAsText =
            e.requestInGameBanner =
            e.getBannerContainer =
            e.ContainerIdToInnerId =
            e.BannerError =
              void 0);
        var s = a(n(767)),
          c = n(492),
          l = new s.default("banner"),
          f = (function (t) {
            function e() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return i(e, t), e;
          })(Error);
        (e.BannerError = f),
          (e.ContainerIdToInnerId = function (t) {
            return t + "-crazygames-inner";
          }),
          (e.getBannerContainer = function (t, n) {
            var r;
            return o(this, void 0, void 0, function () {
              var i, o, a, s;
              return u(this, function (u) {
                switch (u.label) {
                  case 0:
                    if (!t) throw new f("Container id not specified");
                    return [4, (0, c.getContainerInfo)(t)];
                  case 1:
                    if (((i = u.sent()), (o = i.visibleState), n)) {
                      if ("notCreated" === o)
                        throw new f("Container is not present on the page");
                      if ("notVisible" === o)
                        throw new f(
                          "Container is not entirely visible on the page",
                        );
                    }
                    return (
                      (a = (0, e.ContainerIdToInnerId)(t)),
                      document.getElementById(a) ||
                        (((s = document.createElement("div")).id = a),
                        s.classList.add("crazygames-banner-container"),
                        null === (r = document.getElementById(t)) ||
                          void 0 === r ||
                          r.append(s)),
                      [
                        2,
                        {
                          mainContainerId: t,
                          innerContainerId: a,
                          containerInfo: i,
                        },
                      ]
                    );
                }
              });
            });
          }),
          (e.requestInGameBanner = function (t) {
            return o(this, void 0, void 0, function () {
              var e, n;
              return u(this, function (r) {
                if (
                  ((e = window.CrazygamesAds),
                  l.verbose("Requesting banner to CrazyAds", t),
                  !e)
                )
                  throw (
                    ((n = "CrazygamesAds not found, maybe using an adblocker."),
                    l.verbose(n),
                    new Error(n))
                  );
                return [2, e.requestAds(t.request, t.options)];
              });
            });
          }),
          (e.getBannerSizeAsText = function (t) {
            return t.width + "x" + t.height;
          });
      },
      951: (t, e, n) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.loadAdsIfNeeded = void 0);
        var r,
          i = n(823);
        e.loadAdsIfNeeded = function (t) {
          return window.CrazygamesAds
            ? Promise.resolve()
            : (function (t) {
                return (
                  r ||
                  (r = (0, i.loadScript)(t).then(function () {
                    window.CrazygamesAds.initAds({
                      analyticsEventHandler: function () {},
                    });
                  }))
                );
              })(t);
        };
      },
      314: function (t, e, n) {
        "use strict";
        var r =
          (this && this.__importDefault) ||
          function (t) {
            return t && t.__esModule ? t : { default: t };
          };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.renderFakeBanner = void 0);
        var i = r(n(198)),
          o = n(81),
          u = new (r(n(767)).default)("banner"),
          a = [
            { width: 970, height: 90 },
            { width: 320, height: 50 },
            { width: 160, height: 600 },
            { width: 336, height: 280 },
            { width: 728, height: 90 },
            { width: 300, height: 600 },
            { width: 468, height: 60 },
            { width: 970, height: 250 },
            { width: 300, height: 250 },
            { width: 250, height: 250 },
            { width: 120, height: 600 },
          ];
        e.renderFakeBanner = function (t) {
          u.log("Rendering fake banner", t);
          var e = document.getElementById(t.id);
          if (e) {
            var n = t.width,
              r = t.height;
            if (t.isResponsive) {
              var s = (0, i.default)(a).find(function (t) {
                return n >= t.width && r >= t.height;
              });
              if (!s)
                throw new o.BannerError(
                  "No available banner size has been found for container " +
                    e.id,
                );
              (n = s.width), (r = s.height);
            }
            e.innerHTML = "";
            var c = document.createElement("img");
            c.setAttribute(
              "src",
              "https://images.crazygames.com/crazygames-sdk/" +
                n +
                "x" +
                r +
                ".png",
            ),
              c.setAttribute("width", n + "px"),
              c.setAttribute("height", r + "px"),
              e.appendChild(c),
              (e.style.backgroundColor = "rgb(191, 173, 255, 0.25)");
          }
        };
      },
      414: function (t, e, n) {
        "use strict";
        var r =
          (this && this.__assign) ||
          function () {
            return (
              (r =
                Object.assign ||
                function (t) {
                  for (var e, n = 1, r = arguments.length; n < r; n++)
                    for (var i in (e = arguments[n]))
                      Object.prototype.hasOwnProperty.call(e, i) &&
                        (t[i] = e[i]);
                  return t;
                }),
              r.apply(this, arguments)
            );
          };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.OverlayBanner = void 0);
        var i = n(486),
          o = (function () {
            function t(t, e, n, r) {
              var o = this;
              (this.onWindowResize = function () {
                o.setContainerPosition();
              }),
                (this.containerElement = document.createElement("div")),
                (this.containerId = "overlay-banner-" + t.id),
                (this.containerElement.id = this.containerId),
                (this.bannerRequest = t),
                (this.containerElement.style.position = "absolute"),
                (this.containerElement.style.transformOrigin = "top left"),
                (this.containerElement.style.userSelect = "none");
              var u = document.getElementById("gfMainContainer");
              u
                ? u.appendChild(this.containerElement)
                : document.body.appendChild(this.containerElement);
              var a = t.size.split("x");
              (this.onScreenSize = {
                width: parseInt(a[0]),
                height: parseInt(a[1]),
              }),
                (this.bannerModule = n),
                (this.callback = r),
                (this.disableBannerCheck = e),
                (this.debouncedWindowResize = (0, i.debounce)(
                  this.onWindowResize,
                  200,
                )),
                window.addEventListener("resize", this.debouncedWindowResize),
                this.renderBanner();
            }
            return (
              (t.prototype.isVisible = function () {
                var t = this.computeOverlay();
                if (this.disableBannerCheck) return !0;
                var e = t.left + t.width * t.scale,
                  n = t.top + t.height * t.scale,
                  r = this.getGameContainerDimensions();
                return !(
                  t.top < -4 ||
                  t.left < -4 ||
                  e > window.innerWidth + 4 ||
                  n > r.height + 4
                );
              }),
              (t.prototype.computeOverlay = function () {
                var t = this.getScale(),
                  e = this.getOnScreenPosition();
                return {
                  width: this.onScreenSize.width,
                  height: this.onScreenSize.height,
                  top: e.y,
                  left: e.x,
                  scale: t,
                };
              }),
              (t.prototype.getGameContainerDimensions = function () {
                var t = document.getElementById("game-container");
                return t
                  ? { width: t.clientWidth, height: t.clientHeight }
                  : { width: window.innerWidth, height: window.innerHeight };
              }),
              (t.prototype.getScale = function () {
                return this.getGameContainerDimensions().width / 922;
              }),
              (t.prototype.getOnScreenPosition = function () {
                var t = this.getGameContainerDimensions(),
                  e = this.bannerRequest.anchor.x * t.width,
                  n = (1 - this.bannerRequest.anchor.y) * t.height,
                  r = this.getScale(),
                  i = this.onScreenSize,
                  o = i.width * r,
                  u = i.height * r,
                  a = this.bannerRequest.pivot || { x: 0.5, y: 0.5 };
                return {
                  x: e + this.bannerRequest.position.x * r - o * a.x,
                  y: n - this.bannerRequest.position.y * r - u * (1 - a.y),
                };
              }),
              (t.prototype.setContainerPosition = function () {
                var t = this.computeOverlay();
                (this.containerElement.style.width = t.width + "px"),
                  (this.containerElement.style.height = t.height + "px"),
                  (this.containerElement.style.top = t.top + "px"),
                  (this.containerElement.style.left = t.left + "px"),
                  (this.containerElement.style.transform =
                    "scale(" + t.scale + ")"),
                  (this.containerElement.style.display = "block");
              }),
              (t.prototype.renderBanner = function () {
                var t = this;
                if ((this.setContainerPosition(), !this.isVisible()))
                  return (
                    this.callback(
                      this.bannerRequest.id,
                      "bannerError",
                      "bannerNotEntirelyVisible",
                    ),
                    void (this.containerElement.style.display = "none")
                  );
                this.bannerModule.requestBanner(
                  r({ id: this.containerId }, this.onScreenSize),
                  function (e, n) {
                    e
                      ? t.callback(t.bannerRequest.id, "bannerError", e)
                      : t.callback(t.bannerRequest.id, "bannerRendered");
                  },
                );
              }),
              (t.prototype.destroy = function () {
                this.containerElement && this.containerElement.remove(),
                  window.removeEventListener(
                    "resize",
                    this.debouncedWindowResize,
                  );
              }),
              t
            );
          })();
        e.OverlayBanner = o;
      },
      767: function (t, e) {
        "use strict";
        this && this.__spreadArray;
        Object.defineProperty(e, "__esModule", { value: !0 });
        var n = "border-radius: 3px; padding: 0px 4px; color: white;",
          r = (function () {
            function t(t) {
              (this.badge = t),
                (this.debugFlagPresent =
                  window.location.href.includes("sdk_debug=true"));
            }
            return (
              (t.prototype.isEnabled = function () {
                return this.debugFlagPresent || t.forceEnable;
              }),
              (t.prototype.log = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                  e[r - 1] = arguments[r];
                if (this.isEnabled() && this.isEnabled()) {
                  if ("none" === this.badge) return;
                  switch (this.badge) {
                    case "game":
                      ["%cGAME", "background-color: #d48f06; " + n];
                      break;
                    case "user":
                      ["%cUSER", "background-color: #3498DB; " + n];
                      break;
                    case "ad":
                      ["%cAD", "background-color: #008A00; " + n];
                      break;
                    case "banner":
                      ["%cBANNER", "background-color: #00ABA9; " + n];
                  }
                }
              }),
              (t.prototype.verbose = function (t) {
                for (var e = [], n = 1; n < arguments.length; n++)
                  e[n - 1] = arguments[n];
              }),
              (t.prototype.error = function (t) {
                for (var e = [], n = 1; n < arguments.length; n++)
                  e[n - 1] = arguments[n];
              }),
              (t.forceEnable = !1),
              t
            );
          })();
        e.default = r;
      },
      492: function (t, e) {
        "use strict";
        var n =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          r =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            };
        function i(t) {
          return n(this, void 0, void 0, function () {
            return r(this, function (e) {
              return [
                2,
                new Promise(function (e) {
                  var n = new IntersectionObserver(function (t) {
                    var r = t[0],
                      i = r.intersectionRatio > 0.95;
                    e({
                      visibleState: i ? "visible" : "notVisible",
                      size: {
                        width: Math.ceil(r.boundingClientRect.width),
                        height: Math.ceil(r.boundingClientRect.height),
                      },
                    }),
                      n.disconnect();
                  });
                  n.observe(t);
                }),
              ];
            });
          });
        }
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.getContainerInfo = void 0),
          (e.getContainerInfo = function (t) {
            return n(this, void 0, void 0, function () {
              var e;
              return r(this, function (n) {
                return (e = document.getElementById(t))
                  ? [2, i(e)]
                  : [
                      2,
                      {
                        visibleState: "notCreated",
                        size: { width: 0, height: 0 },
                      },
                    ];
              });
            });
          });
      },
      823: function (t, e, n) {
        "use strict";
        var r =
            (this && this.__awaiter) ||
            function (t, e, n, r) {
              return new (n || (n = Promise))(function (i, o) {
                function u(t) {
                  try {
                    s(r.next(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function a(t) {
                  try {
                    s(r.throw(t));
                  } catch (t) {
                    o(t);
                  }
                }
                function s(t) {
                  var e;
                  t.done
                    ? i(t.value)
                    : ((e = t.value),
                      e instanceof n
                        ? e
                        : new n(function (t) {
                            t(e);
                          })).then(u, a);
                }
                s((r = r.apply(t, e || [])).next());
              });
            },
          i =
            (this && this.__generator) ||
            function (t, e) {
              var n,
                r,
                i,
                o,
                u = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1];
                    return i[1];
                  },
                  trys: [],
                  ops: [],
                };
              return (
                (o = { next: a(0), throw: a(1), return: a(2) }),
                "function" == typeof Symbol &&
                  (o[Symbol.iterator] = function () {
                    return this;
                  }),
                o
              );
              function a(o) {
                return function (a) {
                  return (function (o) {
                    if (n)
                      throw new TypeError("Generator is already executing.");
                    for (; u; )
                      try {
                        if (
                          ((n = 1),
                          r &&
                            (i =
                              2 & o[0]
                                ? r.return
                                : o[0]
                                  ? r.throw || ((i = r.return) && i.call(r), 0)
                                  : r.next) &&
                            !(i = i.call(r, o[1])).done)
                        )
                          return i;
                        switch (
                          ((r = 0), i && (o = [2 & o[0], i.value]), o[0])
                        ) {
                          case 0:
                          case 1:
                            i = o;
                            break;
                          case 4:
                            return u.label++, { value: o[1], done: !1 };
                          case 5:
                            u.label++, (r = o[1]), (o = [0]);
                            continue;
                          case 7:
                            (o = u.ops.pop()), u.trys.pop();
                            continue;
                          default:
                            if (
                              !(
                                (i =
                                  (i = u.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== o[0] && 2 !== o[0])
                              )
                            ) {
                              u = 0;
                              continue;
                            }
                            if (
                              3 === o[0] &&
                              (!i || (o[1] > i[0] && o[1] < i[3]))
                            ) {
                              u.label = o[1];
                              break;
                            }
                            if (6 === o[0] && u.label < i[1]) {
                              (u.label = i[1]), (i = o);
                              break;
                            }
                            if (i && u.label < i[2]) {
                              (u.label = i[2]), u.ops.push(o);
                              break;
                            }
                            i[2] && u.ops.pop(), u.trys.pop();
                            continue;
                        }
                        o = e.call(t, u);
                      } catch (t) {
                        (o = [6, t]), (r = 0);
                      } finally {
                        n = i = 0;
                      }
                    if (5 & o[0]) throw o[1];
                    return { value: o[0] ? o[1] : void 0, done: !0 };
                  })([o, a]);
                };
              }
            },
          o =
            (this && this.__importDefault) ||
            function (t) {
              return t && t.__esModule ? t : { default: t };
            };
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.wrapUserFn =
            e.callbackWrapper =
            e.loadScript =
            e.addStyle =
            e.getQueryStringValue =
              void 0);
        var u = new (o(n(767)).default)("none");
        function a(t) {
          return function () {
            for (var e = [], n = 0; n < arguments.length; n++)
              e[n] = arguments[n];
            try {
              t.apply(void 0, e);
            } catch (t) {}
          };
        }
        (e.getQueryStringValue = function (t) {
          return decodeURIComponent(
            window.location.search.replace(
              new RegExp(
                "^(?:.*[&\\?]" +
                  encodeURIComponent(t).replace(/[\.\+\*]/g, "\\$&") +
                  "(?:\\=([^&]*))?)?.*$",
                "i",
              ),
              "$1",
            ),
          );
        }),
          (e.addStyle = function (t) {
            var e = document.createElement("style");
            (e.textContent = t), document.head.append(e);
          }),
          (e.loadScript = function (t) {
            return new Promise(function (e, n) {
              var r = document.createElement("script");
              (r.onload = function () {
                return e();
              }),
                (r.onerror = function (t) {
                  return n(t);
                }),
                (r.src = t),
                (r.async = !0),
                document.head.appendChild(r);
            });
          }),
          (e.callbackWrapper = function (t, e) {
            return r(this, void 0, void 0, function () {
              var n = this;
              return i(this, function (o) {
                return [
                  2,
                  new Promise(function (o, s) {
                    return r(n, void 0, void 0, function () {
                      var n, r;
                      return i(this, function (i) {
                        switch (i.label) {
                          case 0:
                            return i.trys.push([0, 2, , 3]), [4, t()];
                          case 1:
                            return (
                              (n = i.sent()), e && a(e)(void 0, n), o(n), [3, 3]
                            );
                          case 2:
                            return (
                              (r = i.sent()),
                              u.error(r),
                              e
                                ? (a(e)(r.message || r.toString(), void 0), o())
                                : s(r.message || r.toString()),
                              [3, 3]
                            );
                          case 3:
                            return [2];
                        }
                      });
                    });
                  }),
                ];
              });
            });
          }),
          (e.wrapUserFn = a);
      },
      659: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.generateInviteLink = void 0),
          (e.generateInviteLink = function (t, e) {
            if (!e) return "An error happened when generating invite link";
            var n = new URL(e),
              r = n.searchParams;
            return (
              r.set("czy_invite", "true"),
              r.set("utm_source", "invite"),
              Object.keys(t).forEach(function (e) {
                r.set(e, t[e]);
              }),
              n.toString()
            );
          });
      },
      514: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.throttledMethod = void 0),
          (e.throttledMethod = function (t, e) {
            var n = 0;
            return function () {
              for (var r = [], i = 0; i < arguments.length; i++)
                r[i] = arguments[i];
              var o = new Date().getTime();
              return o - n > e ? ((n = o), t.apply(void 0, r)) : void 0;
            };
          });
      },
      719: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.wait = void 0),
          (e.wait = function (t) {
            return new Promise(function (e) {
              return setTimeout(e, t);
            });
          });
      },
      286: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.showBetaWarning = void 0);
        var n = [];
        e.showBetaWarning = function (t) {
          n.includes(t) ||
            (n.push(t), ["getUser", "showAuthPrompt"].includes(t));
        };
      },
      412: (t, e) => {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.SDK_VERSION = void 0),
          (e.SDK_VERSION = "2.9.0");
      },
    },
    e = {};
  function n(r) {
    var i = e[r];
    if (void 0 !== i) return i.exports;
    var o = (e[r] = { id: r, loaded: !1, exports: {} });
    return t[r].call(o.exports, o, o.exports, n), (o.loaded = !0), o.exports;
  }
  (n.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (t) {
      if ("object" == typeof window) return window;
    }
  })()),
    (n.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
    (() => {
      "use strict";
      var t = n(823),
        e = new (n(724).SDKInitializer)().getProxy();
      e.init(window.crazySdkInitOptions),
        (window.CrazyGames = { SDK: e }),
        (0, t.addStyle)(
          "\n.crazygames-banner-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n",
        );
    })();
})();

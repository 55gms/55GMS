(function() {
    /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
    var m, aa = function(a) {
        var b = 0;
        return function() {
            return b < a.length ? {
                done: !1,
                value: a[b++]
            } : {
                done: !0
            }
        }
    }, ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    }
    , ca = function(a) {
        a = ["object" == typeof globalThis && globalThis, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, a];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math)
                return c
        }
        throw Error("a");
    }, da = ca(this), ea = function() {
        ea = function() {}
        ;
        da.Symbol || (da.Symbol = ha)
    }, ia = function(a, b) {
        this.g = a;
        ba(this, "description", {
            configurable: !0,
            writable: !0,
            value: b
        })
    };
    ia.prototype.toString = function() {
        return this.g
    }
    ;
    var ha = function() {
        function a(c) {
            if (this instanceof a)
                throw new TypeError("Symbol is not a constructor");
            return new ia("jscomp_symbol_" + (c || "") + "_" + b++,c)
        }
        var b = 0;
        return a
    }(), ka = function() {
        ea();
        var a = da.Symbol.iterator;
        a || (a = da.Symbol.iterator = da.Symbol("Symbol.iterator"));
        "function" != typeof Array.prototype[a] && ba(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function() {
                return ja(aa(this))
            }
        });
        ka = function() {}
    }, ja = function(a) {
        ka();
        a = {
            next: a
        };
        a[da.Symbol.iterator] = function() {
            return this
        }
        ;
        return a
    }, n = function(a) {
        var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return b ? b.call(a) : {
            next: aa(a)
        }
    }, la = function(a) {
        if (!(a instanceof Array)) {
            a = n(a);
            for (var b, c = []; !(b = a.next()).done; )
                c.push(b.value);
            a = c
        }
        return a
    }, ma = "function" == typeof Object.create ? Object.create : function(a) {
        var b = function() {};
        b.prototype = a;
        return new b
    }
    , na;
    if ("function" == typeof Object.setPrototypeOf)
        na = Object.setPrototypeOf;
    else {
        var oa;
        a: {
            var pa = {
                a: !0
            }
              , qa = {};
            try {
                qa.__proto__ = pa;
                oa = qa.a;
                break a
            } catch (a) {}
            oa = !1
        }
        na = oa ? function(a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b)
                throw new TypeError(a + " is not extensible");
            return a
        }
        : null
    }
    var ra = na
      , q = function(a, b) {
        a.prototype = ma(b.prototype);
        a.prototype.constructor = a;
        if (ra)
            ra(a, b);
        else
            for (var c in b)
                if ("prototype" != c)
                    if (Object.defineProperties) {
                        var d = Object.getOwnPropertyDescriptor(b, c);
                        d && Object.defineProperty(a, c, d)
                    } else
                        a[c] = b[c];
        a.Ab = b.prototype
    }
      , ta = function(a, b) {
        if (b) {
            var c = da;
            a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                e in c || (c[e] = {});
                c = c[e]
            }
            a = a[a.length - 1];
            d = c[a];
            b = b(d);
            b != d && null != b && ba(c, a, {
                configurable: !0,
                writable: !0,
                value: b
            })
        }
    };
    ta("String.prototype.startsWith", function(a) {
        return a ? a : function(b, c) {
            if (null == this)
                throw new TypeError("The 'this' value for String.prototype.startsWith must not be null or undefined");
            if (b instanceof RegExp)
                throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
            var d = this + "";
            b += "";
            var e = d.length
              , f = b.length;
            c = Math.max(0, Math.min(c | 0, d.length));
            for (var g = 0; g < f && c < e; )
                if (d[c++] != b[g++])
                    return !1;
            return g >= f
        }
    });
    ta("Array.prototype.fill", function(a) {
        return a ? a : function(b, c, d) {
            var e = this.length || 0;
            0 > c && (c = Math.max(0, e + c));
            if (null == d || d > e)
                d = e;
            d = Number(d);
            0 > d && (d = Math.max(0, e + d));
            for (c = Number(c || 0); c < d; c++)
                this[c] = b;
            return this
        }
    });
    ta("Promise", function(a) {
        function b() {
            this.g = null
        }
        function c(g) {
            return g instanceof e ? g : new e(function(h) {
                h(g)
            }
            )
        }
        if (a)
            return a;
        b.prototype.j = function(g) {
            if (null == this.g) {
                this.g = [];
                var h = this;
                this.i(function() {
                    h.T()
                })
            }
            this.g.push(g)
        }
        ;
        var d = da.setTimeout;
        b.prototype.i = function(g) {
            d(g, 0)
        }
        ;
        b.prototype.T = function() {
            for (; this.g && this.g.length; ) {
                var g = this.g;
                this.g = [];
                for (var h = 0; h < g.length; ++h) {
                    var k = g[h];
                    g[h] = null;
                    try {
                        k()
                    } catch (l) {
                        this.H(l)
                    }
                }
            }
            this.g = null
        }
        ;
        b.prototype.H = function(g) {
            this.i(function() {
                throw g;
            })
        }
        ;
        var e = function(g) {
            this.j = 0;
            this.i = void 0;
            this.g = [];
            var h = this.H();
            try {
                g(h.resolve, h.reject)
            } catch (k) {
                h.reject(k)
            }
        };
        e.prototype.H = function() {
            function g(l) {
                return function(p) {
                    k || (k = !0,
                    l.call(h, p))
                }
            }
            var h = this
              , k = !1;
            return {
                resolve: g(this.W),
                reject: g(this.T)
            }
        }
        ;
        e.prototype.W = function(g) {
            if (g === this)
                this.T(new TypeError("A Promise cannot resolve to itself"));
            else if (g instanceof e)
                this.Fa(g);
            else {
                a: switch (typeof g) {
                case "object":
                    var h = null != g;
                    break a;
                case "function":
                    h = !0;
                    break a;
                default:
                    h = !1
                }
                h ? this.va(g) : this.o(g)
            }
        }
        ;
        e.prototype.va = function(g) {
            var h = void 0;
            try {
                h = g.then
            } catch (k) {
                this.T(k);
                return
            }
            "function" == typeof h ? this.ha(h, g) : this.o(g)
        }
        ;
        e.prototype.T = function(g) {
            this.v(2, g)
        }
        ;
        e.prototype.o = function(g) {
            this.v(1, g)
        }
        ;
        e.prototype.v = function(g, h) {
            if (0 != this.j)
                throw Error("b`" + g + "`" + h + "`" + this.j);
            this.j = g;
            this.i = h;
            this.S()
        }
        ;
        e.prototype.S = function() {
            if (null != this.g) {
                for (var g = 0; g < this.g.length; ++g)
                    f.j(this.g[g]);
                this.g = null
            }
        }
        ;
        var f = new b;
        e.prototype.Fa = function(g) {
            var h = this.H();
            g.Nb(h.resolve, h.reject)
        }
        ;
        e.prototype.ha = function(g, h) {
            var k = this.H();
            try {
                g.call(h, k.resolve, k.reject)
            } catch (l) {
                k.reject(l)
            }
        }
        ;
        e.prototype.then = function(g, h) {
            function k(B, G) {
                return "function" == typeof B ? function(L) {
                    try {
                        l(B(L))
                    } catch (R) {
                        p(R)
                    }
                }
                : G
            }
            var l, p, t = new e(function(B, G) {
                l = B;
                p = G
            }
            );
            this.Nb(k(g, l), k(h, p));
            return t
        }
        ;
        e.prototype.catch = function(g) {
            return this.then(void 0, g)
        }
        ;
        e.prototype.Nb = function(g, h) {
            function k() {
                switch (l.j) {
                case 1:
                    g(l.i);
                    break;
                case 2:
                    h(l.i);
                    break;
                default:
                    throw Error("c`" + l.j);
                }
            }
            var l = this;
            null == this.g ? f.j(k) : this.g.push(k)
        }
        ;
        e.resolve = c;
        e.reject = function(g) {
            return new e(function(h, k) {
                k(g)
            }
            )
        }
        ;
        e.race = function(g) {
            return new e(function(h, k) {
                for (var l = n(g), p = l.next(); !p.done; p = l.next())
                    c(p.value).Nb(h, k)
            }
            )
        }
        ;
        e.all = function(g) {
            var h = n(g)
              , k = h.next();
            return k.done ? c([]) : new e(function(l, p) {
                function t(L) {
                    return function(R) {
                        B[L] = R;
                        G--;
                        0 == G && l(B)
                    }
                }
                var B = []
                  , G = 0;
                do
                    B.push(void 0),
                    G++,
                    c(k.value).Nb(t(B.length - 1), p),
                    k = h.next();
                while (!k.done)
            }
            )
        }
        ;
        return e
    });
    var ua = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };
    ta("WeakMap", function(a) {
        function b() {}
        function c(k) {
            var l = typeof k;
            return "object" === l && null !== k || "function" === l
        }
        function d(k) {
            if (!ua(k, f)) {
                var l = new b;
                ba(k, f, {
                    value: l
                })
            }
        }
        function e(k) {
            var l = Object[k];
            l && (Object[k] = function(p) {
                if (p instanceof b)
                    return p;
                d(p);
                return l(p)
            }
            )
        }
        if (function() {
            if (!a || !Object.seal)
                return !1;
            try {
                var k = Object.seal({})
                  , l = Object.seal({})
                  , p = new a([[k, 2], [l, 3]]);
                if (2 != p.get(k) || 3 != p.get(l))
                    return !1;
                p.delete(k);
                p.set(l, 4);
                return !p.has(k) && 4 == p.get(l)
            } catch (t) {
                return !1
            }
        }())
            return a;
        var f = "$jscomp_hidden_" + Math.random();
        e("freeze");
        e("preventExtensions");
        e("seal");
        var g = 0
          , h = function(k) {
            this.g = (g += Math.random() + 1).toString();
            if (k) {
                k = n(k);
                for (var l; !(l = k.next()).done; )
                    l = l.value,
                    this.set(l[0], l[1])
            }
        };
        h.prototype.set = function(k, l) {
            if (!c(k))
                throw Error("d");
            d(k);
            if (!ua(k, f))
                throw Error("e`" + k);
            k[f][this.g] = l;
            return this
        }
        ;
        h.prototype.get = function(k) {
            return c(k) && ua(k, f) ? k[f][this.g] : void 0
        }
        ;
        h.prototype.has = function(k) {
            return c(k) && ua(k, f) && ua(k[f], this.g)
        }
        ;
        h.prototype.delete = function(k) {
            return c(k) && ua(k, f) && ua(k[f], this.g) ? delete k[f][this.g] : !1
        }
        ;
        return h
    });
    ta("Map", function(a) {
        if (function() {
            if (!a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal)
                return !1;
            try {
                var h = Object.seal({
                    x: 4
                })
                  , k = new a(n([[h, "s"]]));
                if ("s" != k.get(h) || 1 != k.size || k.get({
                    x: 4
                }) || k.set({
                    x: 4
                }, "t") != k || 2 != k.size)
                    return !1;
                var l = k.entries()
                  , p = l.next();
                if (p.done || p.value[0] != h || "s" != p.value[1])
                    return !1;
                p = l.next();
                return p.done || 4 != p.value[0].x || "t" != p.value[1] || !l.next().done ? !1 : !0
            } catch (t) {
                return !1
            }
        }())
            return a;
        ka();
        var b = new WeakMap
          , c = function(h) {
            this.j = {};
            this.g = f();
            this.size = 0;
            if (h) {
                h = n(h);
                for (var k; !(k = h.next()).done; )
                    k = k.value,
                    this.set(k[0], k[1])
            }
        };
        c.prototype.set = function(h, k) {
            h = 0 === h ? 0 : h;
            var l = d(this, h);
            l.list || (l.list = this.j[l.id] = []);
            l.Qa ? l.Qa.value = k : (l.Qa = {
                next: this.g,
                Wa: this.g.Wa,
                head: this.g,
                key: h,
                value: k
            },
            l.list.push(l.Qa),
            this.g.Wa.next = l.Qa,
            this.g.Wa = l.Qa,
            this.size++);
            return this
        }
        ;
        c.prototype.delete = function(h) {
            h = d(this, h);
            return h.Qa && h.list ? (h.list.splice(h.index, 1),
            h.list.length || delete this.j[h.id],
            h.Qa.Wa.next = h.Qa.next,
            h.Qa.next.Wa = h.Qa.Wa,
            h.Qa.head = null,
            this.size--,
            !0) : !1
        }
        ;
        c.prototype.clear = function() {
            this.j = {};
            this.g = this.g.Wa = f();
            this.size = 0
        }
        ;
        c.prototype.has = function(h) {
            return !!d(this, h).Qa
        }
        ;
        c.prototype.get = function(h) {
            return (h = d(this, h).Qa) && h.value
        }
        ;
        c.prototype.entries = function() {
            return e(this, function(h) {
                return [h.key, h.value]
            })
        }
        ;
        c.prototype.keys = function() {
            return e(this, function(h) {
                return h.key
            })
        }
        ;
        c.prototype.values = function() {
            return e(this, function(h) {
                return h.value
            })
        }
        ;
        c.prototype.forEach = function(h, k) {
            for (var l = this.entries(), p; !(p = l.next()).done; )
                p = p.value,
                h.call(k, p[1], p[0], this)
        }
        ;
        c.prototype[Symbol.iterator] = c.prototype.entries;
        var d = function(h, k) {
            var l = k && typeof k;
            "object" == l || "function" == l ? b.has(k) ? l = b.get(k) : (l = "" + ++g,
            b.set(k, l)) : l = "p_" + k;
            var p = h.j[l];
            if (p && ua(h.j, l))
                for (h = 0; h < p.length; h++) {
                    var t = p[h];
                    if (k !== k && t.key !== t.key || k === t.key)
                        return {
                            id: l,
                            list: p,
                            index: h,
                            Qa: t
                        }
                }
            return {
                id: l,
                list: p,
                index: -1,
                Qa: void 0
            }
        }
          , e = function(h, k) {
            var l = h.g;
            return ja(function() {
                if (l) {
                    for (; l.head != h.g; )
                        l = l.Wa;
                    for (; l.next != l.head; )
                        return l = l.next,
                        {
                            done: !1,
                            value: k(l)
                        };
                    l = null
                }
                return {
                    done: !0,
                    value: void 0
                }
            })
        }
          , f = function() {
            var h = {};
            return h.Wa = h.next = h.head = h
        }
          , g = 0;
        return c
    });
    ta("Number.MAX_SAFE_INTEGER", function() {
        return 9007199254740991
    });
    ta("Number.MIN_SAFE_INTEGER", function() {
        return -9007199254740991
    });
    ta("Object.is", function(a) {
        return a ? a : function(b, c) {
            return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c
        }
    });
    ta("Array.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
                var f = d[c];
                if (f === b || Object.is(f, b))
                    return !0
            }
            return !1
        }
    });
    ta("Promise.prototype.finally", function(a) {
        return a ? a : function(b) {
            return this.then(function(c) {
                return Promise.resolve(b()).then(function() {
                    return c
                })
            }, function(c) {
                return Promise.resolve(b()).then(function() {
                    throw c;
                })
            })
        }
    });
    var va = va || {}
      , wa = this || self
      , xa = function() {}
      , ya = function(a) {
        a.kc = void 0;
        a.ka = function() {
            return a.kc ? a.kc : a.kc = new a
        }
    }
      , za = function(a) {
        var b = typeof a;
        if ("object" == b)
            if (a) {
                if (a instanceof Array)
                    return "array";
                if (a instanceof Object)
                    return b;
                var c = Object.prototype.toString.call(a);
                if ("[object Window]" == c)
                    return "object";
                if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))
                    return "array";
                if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))
                    return "function"
            } else
                return "null";
        else if ("function" == b && "undefined" == typeof a.call)
            return "object";
        return b
    }
      , Aa = function(a) {
        var b = za(a);
        return "array" == b || "object" == b && "number" == typeof a.length
    }
      , Ba = function(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b
    }
      , Ca = function(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }
      , Da = function(a, b, c) {
        if (!a)
            throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var e = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(e, d);
                return a.apply(b, e)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }
      , Ea = function(a, b, c) {
        Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? Ea = Ca : Ea = Da;
        return Ea.apply(null, arguments)
    }
      , Fa = function(a, b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function() {
            var d = c.slice();
            d.push.apply(d, arguments);
            return a.apply(this, d)
        }
    }
      , Ga = Date.now || function() {
        return +new Date
    }
      , Ha = function(a, b) {
        a = a.split(".");
        var c = wa;
        a[0]in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift()); )
            a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
    }
      , Ia = function(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.Ab = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a
    };
    var Ja = ["en", "es-419", "zh-CN"];
    var Ka = function(a) {
        this.o = a;
        this.i = !1;
        this.T = []
    };
    Ka.prototype.j = function() {
        if (!this.i) {
            this.i = !0;
            for (var a = 0, b; b = this.T[a]; a++)
                b()
        }
    }
    ;
    Ka.prototype.Rb = function() {
        return this.i
    }
    ;
    var La = function(a, b) {
        a.i ? b() : a.T.push(b)
    }
      , Ma = function(a) {
        Ka.call(this, a);
        this.image = new Image
    };
    Ia(Ma, Ka);
    Ma.prototype.preload = function() {
        if (!this.image.src) {
            var a = this;
            this.image.onload = function() {
                a.j()
            }
            ;
            this.image.src = this.o;
            (this.image.complete || "complete" == this.image.readyState) && this.j()
        }
    }
    ;
    var Pa = function(a) {
        var b = new Image;
        b.onerror = b.onload = b.onabort = function() {
            delete Na[Oa]
        }
        ;
        Na[Oa] = b;
        b.src = "/gen_204?atyp=i&ct=doodle&cad=" + a + "&zx=" + Ga();
        Oa++
    }
      , Na = []
      , Oa = 0;
    var Qa = /[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]/
      , Ra = /^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc]/
      , Sa = /^http:\/\/.*/
      , Ta = /\s+/
      , Ua = /[\d\u06f0-\u06f9]/;
    var Va = Array.prototype.indexOf ? function(a, b) {
        return Array.prototype.indexOf.call(a, b, void 0)
    }
    : function(a, b) {
        if ("string" === typeof a)
            return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
        for (var c = 0; c < a.length; c++)
            if (c in a && a[c] === b)
                return c;
        return -1
    }
      , Wa = Array.prototype.forEach ? function(a, b, c) {
        Array.prototype.forEach.call(a, b, c)
    }
    : function(a, b, c) {
        for (var d = a.length, e = "string" === typeof a ? a.split("") : a, f = 0; f < d; f++)
            f in e && b.call(c, e[f], f, a)
    }
      , Xa = Array.prototype.filter ? function(a, b) {
        return Array.prototype.filter.call(a, b, void 0)
    }
    : function(a, b) {
        for (var c = a.length, d = [], e = 0, f = "string" === typeof a ? a.split("") : a, g = 0; g < c; g++)
            if (g in f) {
                var h = f[g];
                b.call(void 0, h, g, a) && (d[e++] = h)
            }
        return d
    }
      , Ya = Array.prototype.map ? function(a, b) {
        return Array.prototype.map.call(a, b, void 0)
    }
    : function(a, b) {
        for (var c = a.length, d = Array(c), e = "string" === typeof a ? a.split("") : a, f = 0; f < c; f++)
            f in e && (d[f] = b.call(void 0, e[f], f, a));
        return d
    }
      , Za = Array.prototype.reduce ? function(a, b, c) {
        return Array.prototype.reduce.call(a, b, c)
    }
    : function(a, b, c) {
        var d = c;
        Wa(a, function(e, f) {
            d = b.call(void 0, d, e, f, a)
        });
        return d
    }
      , ab = function(a) {
        a: {
            var b = $a;
            for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++)
                if (e in d && b.call(void 0, d[e], e, a)) {
                    b = e;
                    break a
                }
            b = -1
        }
        return 0 > b ? null : "string" === typeof a ? a.charAt(b) : a[b]
    }
      , bb = function(a, b) {
        b = Va(a, b);
        var c;
        (c = 0 <= b) && Array.prototype.splice.call(a, b, 1);
        return c
    }
      , cb = function(a) {
        return Array.prototype.concat.apply([], arguments)
    }
      , db = function(a) {
        var b = a.length;
        if (0 < b) {
            for (var c = Array(b), d = 0; d < b; d++)
                c[d] = a[d];
            return c
        }
        return []
    }
      , eb = function(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (Aa(d)) {
                var e = a.length || 0
                  , f = d.length || 0;
                a.length = e + f;
                for (var g = 0; g < f; g++)
                    a[e + g] = d[g]
            } else
                a.push(d)
        }
    }
      , fb = function(a, b, c) {
        return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c)
    }
      , hb = function(a, b) {
        a.sort(b || gb)
    }
      , gb = function(a, b) {
        return a > b ? 1 : a < b ? -1 : 0
    };
    var ib = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ")
      , jb = function(a, b) {
        for (var c, d, e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d)
                a[c] = d[c];
            for (var f = 0; f < ib.length; f++)
                c = ib[f],
                Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    }
      , kb = function() {
        var a = new r(0,0,0);
        Object.isFrozen && !Object.isFrozen(a) && (a = Object.create(a),
        Object.freeze(a))
    };
    var nb = function(a, b) {
        this.i = a === lb && b || "";
        this.H = mb
    };
    nb.prototype.j = !0;
    nb.prototype.g = function() {
        return this.i
    }
    ;
    var mb = {}
      , lb = {};
    var qb = function(a, b) {
        this.i = a === ob && b || "";
        this.H = pb
    };
    qb.prototype.j = !0;
    qb.prototype.g = function() {
        return this.i.toString()
    }
    ;
    var pb = {}
      , ob = {};
    var rb = String.prototype.trim ? function(a) {
        return a.trim()
    }
    : function(a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
    }
      , u = function(a, b) {
        return -1 != a.indexOf(b)
    }
      , sb = function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    };
    var vb = function(a, b) {
        this.i = a === tb && b || "";
        this.H = ub
    };
    vb.prototype.j = !0;
    vb.prototype.g = function() {
        return this.i.toString()
    }
    ;
    var wb = function(a) {
        if (a instanceof vb && a.constructor === vb && a.H === ub)
            return a.i;
        za(a);
        return "type_error:SafeUrl"
    }
      , xb = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i
      , yb = function(a) {
        if (a instanceof vb)
            return a;
        a = "object" == typeof a && a.j ? a.g() : String(a);
        xb.test(a) || (a = "about:invalid#zClosurez");
        return new vb(tb,a)
    }
      , ub = {}
      , tb = {};
    var zb;
    a: {
        var Ab = wa.navigator;
        if (Ab) {
            var Bb = Ab.userAgent;
            if (Bb) {
                zb = Bb;
                break a
            }
        }
        zb = ""
    }
    ;var Cb = function(a) {
        var b = new nb(lb,"/logos/2019/july4th19/iframe.html");
        b = new qb(ob,b instanceof nb && b.constructor === nb && b.H === mb ? b.i : "type_error:Const");
        b instanceof qb && b.constructor === qb && b.H === pb ? b = b.i : (za(b),
        b = "type_error:TrustedResourceUrl");
        a.src = b.toString()
    }
      , Db = function(a) {
        a = a instanceof vb ? a : yb(a);
        wa.open(wb(a), "", void 0, void 0)
    };
    var Eb = function(a, b, c) {
        return Math.min(Math.max(a, b), c)
    }
      , v = function(a, b, c) {
        return a + c * (b - a)
    }
      , Fb = function(a) {
        return a * Math.PI / 180
    }
      , Gb = function(a) {
        return 180 * a / Math.PI
    };
    var Hb = function(a, b) {
        this.j = {};
        this.g = [];
        this.i = 0;
        var c = arguments.length;
        if (1 < c) {
            if (c % 2)
                throw Error("f");
            for (var d = 0; d < c; d += 2)
                this.set(arguments[d], arguments[d + 1])
        } else if (a)
            if (a instanceof Hb)
                for (c = a.Va(),
                d = 0; d < c.length; d++)
                    this.set(c[d], a.get(c[d]));
            else
                for (d in a)
                    this.set(d, a[d])
    };
    Hb.prototype.Ua = function() {
        Ib(this);
        for (var a = [], b = 0; b < this.g.length; b++)
            a.push(this.j[this.g[b]]);
        return a
    }
    ;
    Hb.prototype.Va = function() {
        Ib(this);
        return this.g.concat()
    }
    ;
    var Ib = function(a) {
        if (a.i != a.g.length) {
            for (var b = 0, c = 0; b < a.g.length; ) {
                var d = a.g[b];
                Jb(a.j, d) && (a.g[c++] = d);
                b++
            }
            a.g.length = c
        }
        if (a.i != a.g.length) {
            var e = {};
            for (c = b = 0; b < a.g.length; )
                d = a.g[b],
                Jb(e, d) || (a.g[c++] = d,
                e[d] = 1),
                b++;
            a.g.length = c
        }
    };
    Hb.prototype.get = function(a, b) {
        return Jb(this.j, a) ? this.j[a] : b
    }
    ;
    Hb.prototype.set = function(a, b) {
        Jb(this.j, a) || (this.i++,
        this.g.push(a));
        this.j[a] = b
    }
    ;
    Hb.prototype.forEach = function(a, b) {
        for (var c = this.Va(), d = 0; d < c.length; d++) {
            var e = c[d]
              , f = this.get(e);
            a.call(b, f, e, this)
        }
    }
    ;
    var Jb = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };
    var Kb = function(a) {
        if (a.Ua && "function" == typeof a.Ua)
            return a.Ua();
        if ("string" === typeof a)
            return a.split("");
        if (Aa(a)) {
            for (var b = [], c = a.length, d = 0; d < c; d++)
                b.push(a[d]);
            return b
        }
        b = [];
        c = 0;
        for (d in a)
            b[c++] = a[d];
        return b
    }
      , Lb = function(a, b) {
        if (a.forEach && "function" == typeof a.forEach)
            a.forEach(b, void 0);
        else if (Aa(a) || "string" === typeof a)
            Wa(a, b, void 0);
        else {
            if (a.Va && "function" == typeof a.Va)
                var c = a.Va();
            else if (a.Ua && "function" == typeof a.Ua)
                c = void 0;
            else if (Aa(a) || "string" === typeof a) {
                c = [];
                for (var d = a.length, e = 0; e < d; e++)
                    c.push(e)
            } else
                for (e in c = [],
                d = 0,
                a)
                    c[d++] = e;
            d = Kb(a);
            e = d.length;
            for (var f = 0; f < e; f++)
                b.call(void 0, d[f], c && c[f], a)
        }
    };
    var Mb = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/
      , Nb = function(a, b) {
        if (a) {
            a = a.split("&");
            for (var c = 0; c < a.length; c++) {
                var d = a[c].indexOf("=")
                  , e = null;
                if (0 <= d) {
                    var f = a[c].substring(0, d);
                    e = a[c].substring(d + 1)
                } else
                    f = a[c];
                b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "")
            }
        }
    };
    var Ob = function(a) {
        this.i = this.v = this.H = "";
        this.S = null;
        this.T = this.j = "";
        this.o = !1;
        var b;
        a instanceof Ob ? (this.o = a.o,
        Pb(this, a.H),
        this.v = a.v,
        this.i = a.i,
        Qb(this, a.S),
        this.j = a.j,
        Rb(this, Sb(a.g)),
        this.T = a.T) : a && (b = String(a).match(Mb)) ? (this.o = !1,
        Pb(this, b[1] || "", !0),
        this.v = Tb(b[2] || ""),
        this.i = Tb(b[3] || "", !0),
        Qb(this, b[4]),
        this.j = Tb(b[5] || "", !0),
        Rb(this, b[6] || "", !0),
        this.T = Tb(b[7] || "")) : (this.o = !1,
        this.g = new Ub(null,this.o))
    };
    Ob.prototype.toString = function() {
        var a = []
          , b = this.H;
        b && a.push(Vb(b, Wb, !0), ":");
        var c = this.i;
        if (c || "file" == b)
            a.push("//"),
            (b = this.v) && a.push(Vb(b, Wb, !0), "@"),
            a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
            c = this.S,
            null != c && a.push(":", String(c));
        if (c = this.j)
            this.i && "/" != c.charAt(0) && a.push("/"),
            a.push(Vb(c, "/" == c.charAt(0) ? Xb : Yb, !0));
        (c = this.g.toString()) && a.push("?", c);
        (c = this.T) && a.push("#", Vb(c, Zb));
        return a.join("")
    }
    ;
    Ob.prototype.resolve = function(a) {
        var b = new Ob(this)
          , c = !!a.H;
        c ? Pb(b, a.H) : c = !!a.v;
        c ? b.v = a.v : c = !!a.i;
        c ? b.i = a.i : c = null != a.S;
        var d = a.j;
        if (c)
            Qb(b, a.S);
        else if (c = !!a.j) {
            if ("/" != d.charAt(0))
                if (this.i && !this.j)
                    d = "/" + d;
                else {
                    var e = b.j.lastIndexOf("/");
                    -1 != e && (d = b.j.substr(0, e + 1) + d)
                }
            e = d;
            if (".." == e || "." == e)
                d = "";
            else if (u(e, "./") || u(e, "/.")) {
                d = 0 == e.lastIndexOf("/", 0);
                e = e.split("/");
                for (var f = [], g = 0; g < e.length; ) {
                    var h = e[g++];
                    "." == h ? d && g == e.length && f.push("") : ".." == h ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(),
                    d && g == e.length && f.push("")) : (f.push(h),
                    d = !0)
                }
                d = f.join("/")
            } else
                d = e
        }
        c ? b.j = d : c = "" !== a.g.toString();
        c ? Rb(b, Sb(a.g)) : c = !!a.T;
        c && (b.T = a.T);
        return b
    }
    ;
    var Pb = function(a, b, c) {
        a.H = c ? Tb(b, !0) : b;
        a.H && (a.H = a.H.replace(/:$/, ""))
    }
      , Qb = function(a, b) {
        if (b) {
            b = Number(b);
            if (isNaN(b) || 0 > b)
                throw Error("g`" + b);
            a.S = b
        } else
            a.S = null
    }
      , Rb = function(a, b, c) {
        b instanceof Ub ? (a.g = b,
        $b(a.g, a.o)) : (c || (b = Vb(b, ac)),
        a.g = new Ub(b,a.o))
    }
      , Tb = function(a, b) {
        return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
    }
      , Vb = function(a, b, c) {
        return "string" === typeof a ? (a = encodeURI(a).replace(b, bc),
        c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
        a) : null
    }
      , bc = function(a) {
        a = a.charCodeAt(0);
        return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
    }
      , Wb = /[#\/\?@]/g
      , Yb = /[#\?:]/g
      , Xb = /[#\?]/g
      , ac = /[#\?@]/g
      , Zb = /#/g
      , Ub = function(a, b) {
        this.j = this.g = null;
        this.i = a || null;
        this.H = !!b
    }
      , cc = function(a) {
        a.g || (a.g = new Hb,
        a.j = 0,
        a.i && Nb(a.i, function(b, c) {
            a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
        }))
    };
    Ub.prototype.add = function(a, b) {
        cc(this);
        this.i = null;
        a = dc(this, a);
        var c = this.g.get(a);
        c || this.g.set(a, c = []);
        c.push(b);
        this.j += 1;
        return this
    }
    ;
    var ec = function(a, b) {
        cc(a);
        b = dc(a, b);
        Jb(a.g.j, b) && (a.i = null,
        a.j -= a.g.get(b).length,
        a = a.g,
        Jb(a.j, b) && (delete a.j[b],
        a.i--,
        a.g.length > 2 * a.i && Ib(a)))
    }
      , fc = function(a, b) {
        cc(a);
        b = dc(a, b);
        return Jb(a.g.j, b)
    };
    m = Ub.prototype;
    m.forEach = function(a, b) {
        cc(this);
        this.g.forEach(function(c, d) {
            Wa(c, function(e) {
                a.call(b, e, d, this)
            }, this)
        }, this)
    }
    ;
    m.Va = function() {
        cc(this);
        for (var a = this.g.Ua(), b = this.g.Va(), c = [], d = 0; d < b.length; d++)
            for (var e = a[d], f = 0; f < e.length; f++)
                c.push(b[d]);
        return c
    }
    ;
    m.Ua = function(a) {
        cc(this);
        var b = [];
        if ("string" === typeof a)
            fc(this, a) && (b = cb(b, this.g.get(dc(this, a))));
        else {
            a = this.g.Ua();
            for (var c = 0; c < a.length; c++)
                b = cb(b, a[c])
        }
        return b
    }
    ;
    m.set = function(a, b) {
        cc(this);
        this.i = null;
        a = dc(this, a);
        fc(this, a) && (this.j -= this.g.get(a).length);
        this.g.set(a, [b]);
        this.j += 1;
        return this
    }
    ;
    m.get = function(a, b) {
        if (!a)
            return b;
        a = this.Ua(a);
        return 0 < a.length ? String(a[0]) : b
    }
    ;
    m.toString = function() {
        if (this.i)
            return this.i;
        if (!this.g)
            return "";
        for (var a = [], b = this.g.Va(), c = 0; c < b.length; c++) {
            var d = b[c]
              , e = encodeURIComponent(String(d));
            d = this.Ua(d);
            for (var f = 0; f < d.length; f++) {
                var g = e;
                "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
                a.push(g)
            }
        }
        return this.i = a.join("&")
    }
    ;
    var Sb = function(a) {
        var b = new Ub;
        b.i = a.i;
        a.g && (b.g = new Hb(a.g),
        b.j = a.j);
        return b
    }
      , dc = function(a, b) {
        b = String(b);
        a.H && (b = b.toLowerCase());
        return b
    }
      , $b = function(a, b) {
        b && !a.H && (cc(a),
        a.i = null,
        a.g.forEach(function(c, d) {
            var e = d.toLowerCase();
            d != e && (ec(this, d),
            ec(this, e),
            0 < c.length && (this.i = null,
            this.g.set(dc(this, e), db(c)),
            this.j += c.length))
        }, a));
        a.H = b
    };
    var gc = navigator.userAgent
      , hc = new Ob(location.href)
      , ic = u(gc, "iPad") || u(gc, "iPhone") || u(gc, "iPod")
      , jc = u(gc.toLowerCase(), "gsa") || u(gc, "GoogleApp")
      , kc = jc && ic
      , lc = jc && !ic
      , mc = u(gc, "Gbot")
      , nc = ic || u(gc, "Android") || u(gc, "Mobile") || u(gc, "Silk") || u(gc, "UCBrowser") || u(gc, "UCWEB")
      , oc = !!document.querySelector("body.hp")
      , pc = u(gc, "MSIE")
      , qc = u(hc.j, "/logos/") && u(hc.j, ".html")
      , sc = function() {
        return !!document.getElementById("fkbx") || rc()
    }
      , rc = function() {
        var a = hc.g.get("ntp");
        return "1" == a || "2" == a
    }
      , tc = function() {
        return "1" == hc.g.get("fpdoodle") && !!document.getElementById("fpdoodle")
    }
      , uc = function() {
        return !!document.querySelector("body#iframedoodle")
    };
    var vc = function(a, b) {
        for (var c = [], d = 1; d < arguments.length; ++d)
            c[d - 1] = arguments[d];
        if (a)
            for (d = 0; d < c.length; d += 2) {
                var e = c[d]
                  , f = c[d + 1]
                  , g = a.style;
                g && e in g ? g[e] = f : e in a ? a[e] = f : pc && g && "opacity" == e && (a.zoom = 1,
                e = (g.filter || "").replace(/alpha\([^)]*\)/, ""),
                isNaN(parseFloat(f)) || (e += "alpha(opacity=" + 100 * f + ")"),
                g.filter = e)
            }
    }
      , wc = self.performance && self.performance.now ? function() {
        return self.performance.now()
    }
    : Ga
      , yc = function(a) {
        var b = ["Asap", "Asap:bold"], c, d, e = new Promise(function(g, h) {
            c = g;
            d = h
        }
        );
        if (window.WebFontConfig && b) {
            b = n(b);
            for (var f = b.next(); !f.done; f = b.next())
                f = f.value,
                xc(f) && a && a(f, "");
            return e
        }
        Ha("WebFontConfig.active", c);
        Ha("WebFontConfig.inactive", d);
        Ha("WebFontConfig.google.families", b);
        a && Ha("WebFontConfig.fontactive", a);
        a = document.createElement("script");
        a.src = ("https:" == document.location.protocol ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
        a.type = "text/javascript";
        a.async = "true";
        (document.getElementById("xjsc") || document.body).appendChild(a);
        return e
    }
      , xc = function(a) {
        a = a.toLowerCase().replace(/ /g, "");
        var b = document.documentElement;
        b = b.classList ? b.classList : ("string" == typeof b.className ? b.className : b.getAttribute && b.getAttribute("class") || "").match(/\S+/g) || [];
        for (var c = 0; c < b.length; c++)
            if (b[c].search("wf-" + a + "-w+-active"))
                return !0;
        return !1
    }
      , zc = ["Moz", "ms", "O", "webkit"]
      , Ac = function(a, b, c) {
        if (a) {
            for (var d = n(zc), e = d.next(); !e.done; e = d.next())
                a.style[e.value + b] = c;
            a.style[b.charAt(0).toLowerCase() + b.substr(1)] = c
        }
    }
      , Bc = ["", "moz", "ms", "o", "webkit"]
      , Cc = function(a, b) {
        if (!a)
            return null;
        for (var c = n(Bc), d = c.next(); !d.done; d = c.next()) {
            d = d.value;
            var e = b;
            0 < d.length && (e = b.charAt(0).toUpperCase() + b.substr(1));
            d += e;
            if ("undefined" != typeof a[d])
                return d
        }
        return null
    }
      , Dc = function(a, b) {
        var c;
        return (c = window.google && void 0 !== window.google.doodle ? window.google.doodle : null) && void 0 != c[a] ? c[a] : b
    }
      , Ec = function() {
        var a = Dc("doodle_args", {}).is_dogfood;
        return null != a ? a : !1
    }
      , Fc = Dc("alt", "")
      , Gc = Dc("hl", "en")
      , Hc = Dc("gl", "")
      , Jc = function(a, b, c) {
        var d = Math.max(0, c - 230) + (document.querySelector("div.og-pdp") ? 36 : 12);
        vc(a, "width", b + "px", "height", c + "px");
        Ic(d)
    }
      , Ic = function(a) {
        a += "px";
        var b = document.getElementById("lga");
        b && vc(b, "marginBottom", a);
        sc() || ((b = document.getElementById("searchform")) && vc(b, "transform", "translateY(" + a + ")"),
        a = document.createEvent("UIEvents"),
        a.initUIEvent("resize", !1, !1, window, 0),
        window.dispatchEvent(a))
    }
      , Kc = null
      , Lc = null
      , Mc = null
      , Nc = function() {
        Mc || (window.google && window.google.kEI && window.google.kEI.length ? Mc = window.google.kEI : uc() && fc(hc.g, "ei") && (Mc = hc.g.get("ei")));
        return Mc
    }
      , Oc = function() {
        if (!Kc) {
            var a = document.getElementById("hplogoved");
            a ? Kc = a.getAttribute("data-ved") : uc() && fc(hc.g, "ved") && (Kc = hc.g.get("ved"))
        }
        return Kc
    };
    var Pc = function(a, b) {
        this.g = [];
        this.j = [];
        b = n(b);
        for (var c = b.next(); !c.done; c = b.next()) {
            var d = c.value;
            c = new Ma(a + d.filename);
            d = d.size;
            this.g.push(c);
            this.j.push(d)
        }
    }
      , Qc = function(a) {
        return "number" === typeof a ? a : a[0]
    };
    m = Pc.prototype;
    m.preload = function(a, b) {
        var c = this.g[Qc(a)];
        return (new Promise(function(d) {
            La(c, d);
            c.preload()
        }
        )).then(function() {
            return b && b()
        })
    }
    ;
    m.Rb = function() {
        return this.g[Qc(void 0)].Rb()
    }
    ;
    m.Fc = function() {
        return this.g[Qc(void 0)].image
    }
    ;
    m.Pb = function(a) {
        return a[3]
    }
    ;
    m.jc = function(a) {
        return a[4]
    }
    ;
    m.drawImage = function(a, b, c, d, e, f, g, h, k, l) {
        var p = b[1]
          , t = b[2]
          , B = b[3]
          , G = b[4];
        if (void 0 == e) {
            var L = p;
            var R = t;
            var fa = B;
            var sa = G;
            e = B;
            f = G
        } else
            void 0 == g ? (L = p,
            R = t,
            fa = B,
            sa = G) : (L = p + c,
            R = t + d,
            fa = e,
            sa = f,
            c = g,
            d = h,
            e = k,
            f = l);
        L < p && (l = p - L,
        L = p,
        fa -= l,
        c += l,
        e -= l);
        R < t && (l = t - R,
        R = t,
        sa -= l,
        d += l,
        f -= l);
        L + fa > p + B && (p = L + fa - (p + B),
        fa -= p,
        e -= p);
        R + sa > t + G && (t = R + sa - (t + G),
        sa -= t,
        f -= t);
        b = this.g[Qc(b)];
        if (!b.Rb())
            throw Error("i");
        0 < fa && 0 < sa && a.drawImage(b.image, L, R, fa, sa, c, d, e, f)
    }
    ;
    var Sc = function() {
        Pc.call(this, "", Rc)
    };
    q(Sc, Pc);
    var Rc = [{
        filename: "main-sprite.png",
        size: [3615, 1652]
    }, {
        filename: "share-sprite-a.png",
        size: [2012, 400]
    }, {
        filename: "share-sprite-b.png",
        size: [2012, 400]
    }, {
        filename: "cta-sprite.png",
        size: [300, 300]
    }]
      , Tc = [0, 3015, 0, 600, 600]
      , Uc = [3, 0, 0, 300, 300]
      , Vc = [1, 0, 0, 400, 400]
      , Wc = [1, 403, 0, 400, 400]
      , Xc = [1, 806, 0, 400, 400]
      , Yc = [1, 1209, 0, 400, 400]
      , Zc = [1, 1612, 0, 400, 400]
      , $c = [2, 0, 0, 400, 400]
      , ad = [2, 403, 0, 400, 400]
      , bd = [2, 806, 0, 400, 400]
      , cd = [2, 1209, 0, 400, 400]
      , dd = [2, 1612, 0, 400, 400]
      , ed = [[0, 0, 603, 498, 260], [0, 501, 603, 498, 260], [0, 1002, 603, 498, 260], [0, 1503, 603, 498, 260]]
      , fd = [[0, 0, 0, 600, 600], [0, 603, 0, 600, 600], [0, 1206, 0, 600, 600], [0, 1809, 0, 600, 600], [0, 2412, 0, 600, 600], Tc]
      , gd = [Vc, Wc, Xc, Yc, Zc, $c, ad, bd, cd]
      , hd = [[0, 2004, 603, 498, 260], [0, 2505, 603, 498, 260], [0, 3006, 603, 498, 260], [0, 0, 866, 498, 260], [0, 501, 866, 498, 260], [0, 1002, 866, 498, 260], [0, 1503, 866, 498, 260], [0, 2004, 866, 498, 260], [0, 2505, 866, 498, 260], [0, 3006, 866, 498, 260], [0, 0, 1129, 498, 260], [0, 501, 1129, 498, 260], [0, 1002, 1129, 498, 260], [0, 1503, 1129, 498, 260], [0, 2004, 1129, 498, 260], [0, 2505, 1129, 498, 260], [0, 3006, 1129, 498, 260], [0, 0, 1392, 498, 260], [0, 501, 1392, 498, 260], [0, 1002, 1392, 498, 260], [0, 1503, 1392, 498, 260], [0, 2004, 1392, 498, 260], [0, 2505, 1392, 498, 260], [0, 3006, 1392, 498, 260]];
    ya(Sc);
    var w = function() {
        this.j = [];
        this.g = new Map
    }
      , x = function(a, b, c) {
        for (var d = a.g.get(b) || [], e = [].concat(la(a.j), la(d)), f = 0; f < e.length; f++)
            -1 == a.j.indexOf(e[f]) && -1 == d.indexOf(e[f]) || e[f].Za(b, c)
    };
    w.prototype.addListener = function(a, b) {
        void 0 === b ? this.j.push(a) : (this.g.has(b) || this.g.set(b, []),
        this.g.get(b).push(a))
    }
    ;
    w.prototype.removeListener = function(a, b) {
        if (void 0 !== b)
            id(a, this.g.get(b) || []);
        else {
            id(a, this.j);
            b = n(this.g.values());
            for (var c = b.next(); !c.done; c = b.next())
                id(a, c.value)
        }
    }
    ;
    var id = function(a, b) {
        for (var c = b.indexOf(a); -1 != c; )
            b.splice(c, 1),
            c = b.indexOf(a)
    };
    ya(w);
    var jd = function(a, b) {
        this.x = void 0 !== a ? a : 0;
        this.y = void 0 !== b ? b : 0
    };
    jd.prototype.g = function() {
        return new jd(this.x,this.y)
    }
    ;
    var kd = function(a, b) {
        var c = a.x - b.x;
        a = a.y - b.y;
        return Math.sqrt(c * c + a * a)
    };
    jd.prototype.ceil = function() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this
    }
    ;
    jd.prototype.floor = function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this
    }
    ;
    jd.prototype.round = function() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this
    }
    ;
    jd.prototype.scale = function(a, b) {
        this.x *= a;
        this.y *= "number" === typeof b ? b : a;
        return this
    }
    ;
    var y = function(a, b) {
        this.width = a;
        this.height = b
    };
    m = y.prototype;
    m.aspectRatio = function() {
        return this.width / this.height
    }
    ;
    m.ceil = function() {
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    }
    ;
    m.floor = function() {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    }
    ;
    m.round = function() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    }
    ;
    m.scale = function(a, b) {
        this.width *= a;
        this.height *= "number" === typeof b ? b : a;
        return this
    }
    ;
    var ld = function(a, b, c, d) {
        this.g = a;
        this.j = b;
        this.width = c;
        this.height = d
    }
      , nd = function() {
        var a = md;
        return new ld(a.g,a.j,a.width,a.height)
    };
    ld.prototype.ceil = function() {
        this.g = Math.ceil(this.g);
        this.j = Math.ceil(this.j);
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    }
    ;
    ld.prototype.floor = function() {
        this.g = Math.floor(this.g);
        this.j = Math.floor(this.j);
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    }
    ;
    ld.prototype.round = function() {
        this.g = Math.round(this.g);
        this.j = Math.round(this.j);
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    }
    ;
    ld.prototype.scale = function(a, b) {
        b = "number" === typeof b ? b : a;
        this.g *= a;
        this.width *= a;
        this.j *= b;
        this.height *= b;
        return this
    }
    ;
    var od = function(a, b, c) {
        this.x = void 0 !== a ? a : 0;
        this.y = void 0 !== b ? b : 0;
        this.g = void 0 !== c ? c : 0
    };
    od.prototype.j = function() {
        return new od(this.x,this.y,this.g)
    }
    ;
    var pd = function(a, b) {
        var c = a.x - b.x
          , d = a.y - b.y;
        a = a.g - b.g;
        return Math.sqrt(c * c + d * d + a * a)
    };
    od.prototype.xc = function() {}
    ;
    var r = function(a, b, c) {
        this.x = a;
        this.y = b;
        this.g = c
    };
    Ia(r, od);
    r.prototype.j = function() {
        return new r(this.x,this.y,this.g)
    }
    ;
    var qd = function(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.g * a.g)
    };
    r.prototype.scale = function(a) {
        this.x *= a;
        this.y *= a;
        this.g *= a;
        return this
    }
    ;
    var rd = function(a) {
        return a.scale(1 / qd(a))
    };
    r.prototype.add = function(a) {
        this.x += a.x;
        this.y += a.y;
        this.g += a.g;
        return this
    }
    ;
    var td = function(a) {
        var b = sd.j();
        b.x -= a.x;
        b.y -= a.y;
        b.g -= a.g;
        return b
    }
      , ud = function(a, b) {
        return new r(a.x + b.x,a.y + b.y,a.g + b.g)
    }
      , vd = function(a, b) {
        return new r(a.x - b.x,a.y - b.y,a.g - b.g)
    }
      , z = function(a, b, c) {
        return new r(v(a.x, b.x, c),v(a.y, b.y, c),v(a.g, b.g, c))
    };
    var wd = nc ? 600 : 768
      , xd = nc ? 338 : 432
      , A = new r(0,0,21.35)
      , yd = new r(0,0,A.g - 18.39 - 4)
      , zd = [new r(A.x + 18.39,0,A.g), new r(A.x,0,A.g + 18.39), new r(A.x - 18.39,0,A.g), new r(A.x,0,A.g - 18.39)];
    kb();
    var Ad = new r(-2,0,A.g - 18.39)
      , Bd = new r(2,0,A.g - 18.39)
      , Cd = new r(45.975,0,-45.975)
      , Dd = function(a) {
        return window.google && window.google.doodle && window.google.doodle.flags && window.google.doodle.flags[a]
    }
      , Ed = !!Dd("bNoLocal")
      , Gd = Dd("exp1")
      , Hd = Dd("exp2")
      , Id = Dd("exp3")
      , Jd = Dd("exp4")
      , Kd = Dd("exp5");
    var C = function() {
        this.U = this.U;
        this.ha = this.ha
    };
    C.prototype.U = !1;
    C.prototype.Ob = function() {
        this.U || (this.U = !0,
        this.j())
    }
    ;
    var Ld = function(a, b) {
        a.U ? b() : (a.ha || (a.ha = []),
        a.ha.push(b))
    };
    C.prototype.j = function() {
        if (this.ha)
            for (; this.ha.length; )
                this.ha.shift()()
    }
    ;
    var Md = function(a) {
        a && "function" == typeof a.Ob && a.Ob()
    };
    var Nd = function(a, b) {
        this.type = a;
        this.g = this.target = b;
        this.defaultPrevented = this.j = !1
    };
    Nd.prototype.stopPropagation = function() {
        this.j = !0
    }
    ;
    Nd.prototype.preventDefault = function() {
        this.defaultPrevented = !0
    }
    ;
    var Od = function(a) {
        Od[" "](a);
        return a
    };
    Od[" "] = xa;
    var Qd = function(a, b) {
        var c = Pd;
        return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a)
    };
    var Rd = u(zb, "Opera"), Sd = u(zb, "Trident") || u(zb, "MSIE"), Td = u(zb, "Edge"), Ud = u(zb, "Gecko") && !(u(zb.toLowerCase(), "webkit") && !u(zb, "Edge")) && !(u(zb, "Trident") || u(zb, "MSIE")) && !u(zb, "Edge"), Vd = u(zb.toLowerCase(), "webkit") && !u(zb, "Edge"), Wd = function() {
        var a = wa.document;
        return a ? a.documentMode : void 0
    }, Xd;
    a: {
        var Yd = ""
          , Zd = function() {
            var a = zb;
            if (Ud)
                return /rv:([^\);]+)(\)|;)/.exec(a);
            if (Td)
                return /Edge\/([\d\.]+)/.exec(a);
            if (Sd)
                return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
            if (Vd)
                return /WebKit\/(\S+)/.exec(a);
            if (Rd)
                return /(?:Version)[ \/]?(\S+)/.exec(a)
        }();
        Zd && (Yd = Zd ? Zd[1] : "");
        if (Sd) {
            var $d = Wd();
            if (null != $d && $d > parseFloat(Yd)) {
                Xd = String($d);
                break a
            }
        }
        Xd = Yd
    }
    var ae = Xd, Pd = {}, be = function(a) {
        return Qd(a, function() {
            for (var b = 0, c = rb(String(ae)).split("."), d = rb(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
                var g = c[f] || ""
                  , h = d[f] || "";
                do {
                    g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
                    h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
                    if (0 == g[0].length && 0 == h[0].length)
                        break;
                    b = sb(0 == g[1].length ? 0 : parseInt(g[1], 10), 0 == h[1].length ? 0 : parseInt(h[1], 10)) || sb(0 == g[2].length, 0 == h[2].length) || sb(g[2], h[2]);
                    g = g[3];
                    h = h[3]
                } while (0 == b)
            }
            return 0 <= b
        })
    }, ce;
    if (wa.document && Sd) {
        var de = Wd();
        ce = de ? de : parseInt(ae, 10) || void 0
    } else
        ce = void 0;
    var ee = ce;
    var fe;
    (fe = !Sd) || (fe = 9 <= Number(ee));
    var ge = fe
      , he = Sd && !be("9")
      , ie = function() {
        if (!wa.addEventListener || !Object.defineProperty)
            return !1;
        var a = !1
          , b = Object.defineProperty({}, "passive", {
            get: function() {
                a = !0
            }
        });
        try {
            wa.addEventListener("test", xa, b),
            wa.removeEventListener("test", xa, b)
        } catch (c) {}
        return a
    }();
    var ke = function(a, b) {
        Nd.call(this, a ? a.type : "");
        this.relatedTarget = this.g = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
        this.key = "";
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.pointerId = 0;
        this.pointerType = "";
        this.vb = null;
        if (a) {
            var c = this.type = a.type
              , d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
            this.target = a.target || a.srcElement;
            this.g = b;
            if (b = a.relatedTarget) {
                if (Ud) {
                    a: {
                        try {
                            Od(b.nodeName);
                            var e = !0;
                            break a
                        } catch (f) {}
                        e = !1
                    }
                    e || (b = null)
                }
            } else
                "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);
            this.relatedTarget = b;
            d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX,
            this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY,
            this.screenX = d.screenX || 0,
            this.screenY = d.screenY || 0) : (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX,
            this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY,
            this.screenX = a.screenX || 0,
            this.screenY = a.screenY || 0);
            this.button = a.button;
            this.key = a.key || "";
            this.ctrlKey = a.ctrlKey;
            this.altKey = a.altKey;
            this.shiftKey = a.shiftKey;
            this.metaKey = a.metaKey;
            this.pointerId = a.pointerId || 0;
            this.pointerType = "string" === typeof a.pointerType ? a.pointerType : je[a.pointerType] || "";
            this.vb = a;
            a.defaultPrevented && this.preventDefault()
        }
    };
    Ia(ke, Nd);
    var je = {
        2: "touch",
        3: "pen",
        4: "mouse"
    };
    ke.prototype.stopPropagation = function() {
        ke.Ab.stopPropagation.call(this);
        this.vb.stopPropagation ? this.vb.stopPropagation() : this.vb.cancelBubble = !0
    }
    ;
    ke.prototype.preventDefault = function() {
        ke.Ab.preventDefault.call(this);
        var a = this.vb;
        if (a.preventDefault)
            a.preventDefault();
        else if (a.returnValue = !1,
        he)
            try {
                if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode)
                    a.keyCode = -1
            } catch (b) {}
    }
    ;
    var le = "closure_listenable_" + (1E6 * Math.random() | 0)
      , me = 0;
    var ne = function(a, b, c, d, e) {
        this.listener = a;
        this.g = null;
        this.src = b;
        this.type = c;
        this.capture = !!d;
        this.Qb = e;
        this.key = ++me;
        this.wb = this.Mb = !1
    }
      , oe = function(a) {
        a.wb = !0;
        a.listener = null;
        a.g = null;
        a.src = null;
        a.Qb = null
    };
    var pe = function(a) {
        this.src = a;
        this.g = {};
        this.j = 0
    };
    pe.prototype.add = function(a, b, c, d, e) {
        var f = a.toString();
        a = this.g[f];
        a || (a = this.g[f] = [],
        this.j++);
        var g = qe(a, b, d, e);
        -1 < g ? (b = a[g],
        c || (b.Mb = !1)) : (b = new ne(b,this.src,f,!!d,e),
        b.Mb = c,
        a.push(b));
        return b
    }
    ;
    var re = function(a, b) {
        var c = b.type;
        c in a.g && bb(a.g[c], b) && (oe(b),
        0 == a.g[c].length && (delete a.g[c],
        a.j--))
    }
      , qe = function(a, b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e];
            if (!f.wb && f.listener == b && f.capture == !!c && f.Qb == d)
                return e
        }
        return -1
    };
    var se = "closure_lm_" + (1E6 * Math.random() | 0)
      , te = {}
      , ue = 0
      , we = function(a, b, c, d, e) {
        if (d && d.once)
            ve(a, b, c, d, e);
        else if (Array.isArray(b))
            for (var f = 0; f < b.length; f++)
                we(a, b[f], c, d, e);
        else
            c = xe(c),
            a && a[le] ? a.i.add(String(b), c, !1, Ba(d) ? !!d.capture : !!d, e) : ye(a, b, c, !1, d, e)
    }
      , ye = function(a, b, c, d, e, f) {
        if (!b)
            throw Error("j");
        var g = Ba(e) ? !!e.capture : !!e
          , h = ze(a);
        h || (a[se] = h = new pe(a));
        c = h.add(b, c, d, g, f);
        if (!c.g) {
            d = Ae();
            c.g = d;
            d.src = a;
            d.listener = c;
            if (a.addEventListener)
                ie || (e = g),
                void 0 === e && (e = !1),
                a.addEventListener(b.toString(), d, e);
            else if (a.attachEvent)
                a.attachEvent(Be(b.toString()), d);
            else if (a.addListener && a.removeListener)
                a.addListener(d);
            else
                throw Error("k");
            ue++
        }
    }
      , Ae = function() {
        var a = Ce
          , b = ge ? function(c) {
            return a.call(b.src, b.listener, c)
        }
        : function(c) {
            c = a.call(b.src, b.listener, c);
            if (!c)
                return c
        }
        ;
        return b
    }
      , ve = function(a, b, c, d, e) {
        if (Array.isArray(b))
            for (var f = 0; f < b.length; f++)
                ve(a, b[f], c, d, e);
        else
            c = xe(c),
            a && a[le] ? a.i.add(String(b), c, !0, Ba(d) ? !!d.capture : !!d, e) : ye(a, b, c, !0, d, e)
    }
      , De = function(a, b, c, d, e) {
        if (Array.isArray(b))
            for (var f = 0; f < b.length; f++)
                De(a, b[f], c, d, e);
        else
            (d = Ba(d) ? !!d.capture : !!d,
            c = xe(c),
            a && a[le]) ? (a = a.i,
            b = String(b).toString(),
            b in a.g && (f = a.g[b],
            c = qe(f, c, d, e),
            -1 < c && (oe(f[c]),
            Array.prototype.splice.call(f, c, 1),
            0 == f.length && (delete a.g[b],
            a.j--)))) : a && (a = ze(a)) && (b = a.g[b.toString()],
            a = -1,
            b && (a = qe(b, c, d, e)),
            (c = -1 < a ? b[a] : null) && Ee(c))
    }
      , Ee = function(a) {
        if ("number" !== typeof a && a && !a.wb) {
            var b = a.src;
            if (b && b[le])
                re(b.i, a);
            else {
                var c = a.type
                  , d = a.g;
                b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Be(c), d) : b.addListener && b.removeListener && b.removeListener(d);
                ue--;
                (c = ze(b)) ? (re(c, a),
                0 == c.j && (c.src = null,
                b[se] = null)) : oe(a)
            }
        }
    }
      , Be = function(a) {
        return a in te ? te[a] : te[a] = "on" + a
    }
      , Ge = function(a, b, c, d) {
        var e = !0;
        if (a = ze(a))
            if (b = a.g[b.toString()])
                for (b = b.concat(),
                a = 0; a < b.length; a++) {
                    var f = b[a];
                    f && f.capture == c && !f.wb && (f = Fe(f, d),
                    e = e && !1 !== f)
                }
        return e
    }
      , Fe = function(a, b) {
        var c = a.listener
          , d = a.Qb || a.src;
        a.Mb && Ee(a);
        return c.call(d, b)
    }
      , Ce = function(a, b) {
        if (a.wb)
            return !0;
        if (!ge) {
            if (!b)
                a: {
                    b = ["window", "event"];
                    for (var c = wa, d = 0; d < b.length; d++)
                        if (c = c[b[d]],
                        null == c) {
                            b = null;
                            break a
                        }
                    b = c
                }
            d = b;
            b = new ke(d,this);
            c = !0;
            if (!(0 > d.keyCode || void 0 != d.returnValue)) {
                a: {
                    var e = !1;
                    if (0 == d.keyCode)
                        try {
                            d.keyCode = -1;
                            break a
                        } catch (g) {
                            e = !0
                        }
                    if (e || void 0 == d.returnValue)
                        d.returnValue = !0
                }
                d = [];
                for (e = b.g; e; e = e.parentNode)
                    d.push(e);
                a = a.type;
                for (e = d.length - 1; !b.j && 0 <= e; e--) {
                    b.g = d[e];
                    var f = Ge(d[e], a, !0, b);
                    c = c && f
                }
                for (e = 0; !b.j && e < d.length; e++)
                    b.g = d[e],
                    f = Ge(d[e], a, !1, b),
                    c = c && f
            }
            return c
        }
        return Fe(a, new ke(b,this))
    }
      , ze = function(a) {
        a = a[se];
        return a instanceof pe ? a : null
    }
      , He = "__closure_events_fn_" + (1E9 * Math.random() >>> 0)
      , xe = function(a) {
        if ("function" == za(a))
            return a;
        a[He] || (a[He] = function(b) {
            return a.handleEvent(b)
        }
        );
        return a[He]
    };
    var Ie = function() {
        C.call(this);
        this.i = new pe(this);
        this.Ea = this;
        this.$ = null
    };
    Ia(Ie, C);
    Ie.prototype[le] = !0;
    Ie.prototype.addEventListener = function(a, b, c, d) {
        we(this, a, b, c, d)
    }
    ;
    Ie.prototype.removeEventListener = function(a, b, c, d) {
        De(this, a, b, c, d)
    }
    ;
    var Ke = function(a, b) {
        var c, d = a.$;
        if (d)
            for (c = []; d; d = d.$)
                c.push(d);
        a = a.Ea;
        d = b.type || b;
        if ("string" === typeof b)
            b = new Nd(b,a);
        else if (b instanceof Nd)
            b.target = b.target || a;
        else {
            var e = b;
            b = new Nd(d,a);
            jb(b, e)
        }
        e = !0;
        if (c)
            for (var f = c.length - 1; !b.j && 0 <= f; f--) {
                var g = b.g = c[f];
                e = Je(g, d, !0, b) && e
            }
        b.j || (g = b.g = a,
        e = Je(g, d, !0, b) && e,
        b.j || (e = Je(g, d, !1, b) && e));
        if (c)
            for (f = 0; !b.j && f < c.length; f++)
                g = b.g = c[f],
                e = Je(g, d, !1, b) && e
    };
    Ie.prototype.j = function() {
        Ie.Ab.j.call(this);
        if (this.i) {
            var a = this.i, b = 0, c;
            for (c in a.g) {
                for (var d = a.g[c], e = 0; e < d.length; e++)
                    ++b,
                    oe(d[e]);
                delete a.g[c];
                a.j--
            }
        }
        this.$ = null
    }
    ;
    var Je = function(a, b, c, d) {
        b = a.i.g[String(b)];
        if (!b)
            return !0;
        b = b.concat();
        for (var e = !0, f = 0; f < b.length; ++f) {
            var g = b[f];
            if (g && !g.wb && g.capture == c) {
                var h = g.listener
                  , k = g.Qb || g.src;
                g.Mb && re(a.i, g);
                e = !1 !== h.call(k, d) && e
            }
        }
        return e && !d.defaultPrevented
    };
    var Le = function() {};
    Le.prototype.g = null;
    Le.prototype.getOptions = function() {
        var a;
        (a = this.g) || (a = {},
        Me(this) && (a[0] = !0,
        a[1] = !0),
        a = this.g = a);
        return a
    }
    ;
    var Ne, Oe = function() {};
    Ia(Oe, Le);
    var Pe = function(a) {
        return (a = Me(a)) ? new ActiveXObject(a) : new XMLHttpRequest
    }
      , Me = function(a) {
        if (!a.j && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
            for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
                var d = b[c];
                try {
                    return new ActiveXObject(d),
                    a.j = d
                } catch (e) {}
            }
            throw Error("l");
        }
        return a.j
    };
    Ne = new Oe;
    var Qe = function(a, b, c) {
        if ("function" == za(a))
            c && (a = Ea(a, c));
        else if (a && "function" == typeof a.handleEvent)
            a = Ea(a.handleEvent, a);
        else
            throw Error("m");
        return 2147483647 < Number(b) ? -1 : wa.setTimeout(a, b || 0)
    };
    var Re = function(a) {
        Ie.call(this);
        this.headers = new Hb;
        this.va = a || null;
        this.H = !1;
        this.S = this.g = null;
        this.V = "";
        this.T = this.Fa = this.o = this.W = !1;
        this.ta = 0;
        this.v = null;
        this.ya = "";
        this.wa = this.Ca = !1
    };
    Ia(Re, Ie);
    var Se = /^https?$/i
      , Te = ["POST", "PUT"]
      , Ue = []
      , We = function(a, b) {
        var c = new Re;
        Ue.push(c);
        b && c.i.add("complete", b, !1, void 0, void 0);
        c.i.add("ready", c.Ga, !0, void 0, void 0);
        Ve(c, a, void 0, void 0, void 0);
        return c
    };
    Re.prototype.Ga = function() {
        this.Ob();
        bb(Ue, this)
    }
    ;
    var Ve = function(a, b, c, d, e) {
        if (a.g)
            throw Error("n`" + a.V + "`" + b);
        c = c ? c.toUpperCase() : "GET";
        a.V = b;
        a.W = !1;
        a.H = !0;
        a.g = a.va ? Pe(a.va) : Pe(Ne);
        a.S = a.va ? a.va.getOptions() : Ne.getOptions();
        a.g.onreadystatechange = Ea(a.Ka, a);
        try {
            a.Fa = !0,
            a.g.open(c, String(b), !0),
            a.Fa = !1
        } catch (g) {
            Xe(a);
            return
        }
        b = d || "";
        var f = new Hb(a.headers);
        e && Lb(e, function(g, h) {
            f.set(h, g)
        });
        e = ab(f.Va());
        d = wa.FormData && b instanceof wa.FormData;
        !(0 <= Va(Te, c)) || e || d || f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        f.forEach(function(g, h) {
            this.g.setRequestHeader(h, g)
        }, a);
        a.ya && (a.g.responseType = a.ya);
        "withCredentials"in a.g && a.g.withCredentials !== a.Ca && (a.g.withCredentials = a.Ca);
        try {
            Ye(a),
            0 < a.ta && (a.wa = Ze(a.g),
            a.wa ? (a.g.timeout = a.ta,
            a.g.ontimeout = Ea(a.Ba, a)) : a.v = Qe(a.Ba, a.ta, a)),
            a.o = !0,
            a.g.send(b),
            a.o = !1
        } catch (g) {
            Xe(a)
        }
    }
      , Ze = function(a) {
        return Sd && be(9) && "number" === typeof a.timeout && void 0 !== a.ontimeout
    }
      , $a = function(a) {
        return "content-type" == a.toLowerCase()
    };
    Re.prototype.Ba = function() {
        "undefined" != typeof va && this.g && (Ke(this, "timeout"),
        this.abort(8))
    }
    ;
    var Xe = function(a) {
        a.H = !1;
        a.g && (a.T = !0,
        a.g.abort(),
        a.T = !1);
        $e(a);
        af(a)
    }
      , $e = function(a) {
        a.W || (a.W = !0,
        Ke(a, "complete"),
        Ke(a, "error"))
    };
    Re.prototype.abort = function() {
        this.g && this.H && (this.H = !1,
        this.T = !0,
        this.g.abort(),
        this.T = !1,
        Ke(this, "complete"),
        Ke(this, "abort"),
        af(this))
    }
    ;
    Re.prototype.j = function() {
        this.g && (this.H && (this.H = !1,
        this.T = !0,
        this.g.abort(),
        this.T = !1),
        af(this, !0));
        Re.Ab.j.call(this)
    }
    ;
    Re.prototype.Ka = function() {
        this.U || (this.Fa || this.o || this.T ? bf(this) : this.La())
    }
    ;
    Re.prototype.La = function() {
        bf(this)
    }
    ;
    var bf = function(a) {
        if (a.H && "undefined" != typeof va && (!a.S[1] || 4 != (a.g ? a.g.readyState : 0) || 2 != cf(a)))
            if (a.o && 4 == (a.g ? a.g.readyState : 0))
                Qe(a.Ka, 0, a);
            else if (Ke(a, "readystatechange"),
            4 == (a.g ? a.g.readyState : 0)) {
                a.H = !1;
                try {
                    df(a) ? (Ke(a, "complete"),
                    Ke(a, "success")) : $e(a)
                } finally {
                    af(a)
                }
            }
    }
      , af = function(a, b) {
        if (a.g) {
            Ye(a);
            var c = a.g
              , d = a.S[0] ? xa : null;
            a.g = null;
            a.S = null;
            b || Ke(a, "ready");
            try {
                c.onreadystatechange = d
            } catch (e) {}
        }
    }
      , Ye = function(a) {
        a.g && a.wa && (a.g.ontimeout = null);
        a.v && (wa.clearTimeout(a.v),
        a.v = null)
    }
      , df = function(a) {
        var b = cf(a);
        a: switch (b) {
        case 200:
        case 201:
        case 202:
        case 204:
        case 206:
        case 304:
        case 1223:
            var c = !0;
            break a;
        default:
            c = !1
        }
        if (!c) {
            if (b = 0 === b)
                a = String(a.V).match(Mb)[1] || null,
                !a && wa.self && wa.self.location && (a = wa.self.location.protocol,
                a = a.substr(0, a.length - 1)),
                b = !Se.test(a ? a.toLowerCase() : "");
            c = b
        }
        return c
    }
      , cf = function(a) {
        try {
            return 2 < (a.g ? a.g.readyState : 0) ? a.g.status : -1
        } catch (b) {
            return -1
        }
    }
      , ef = function(a) {
        try {
            return a.g ? a.g.responseXML : null
        } catch (b) {
            return null
        }
    };
    var ff = function(a) {
        Ka.call(this, a);
        this.H = this.g = this.v = null
    };
    q(ff, Ka);
    ff.prototype.preload = function() {
        var a = this;
        this.v || this.g || (this.g = We(this.o, function() {
            return a.j()
        }))
    }
    ;
    ff.prototype.j = function() {
        var a = this;
        this.g && df(this.g) && (this.v = ef(this.g),
        this.g.Ob(),
        this.g = null,
        this.H = new Image,
        this.H.onload = function() {
            return Ka.prototype.j.call(a)
        }
        ,
        this.H.src = "data:image/svg+xml;utf-8," + encodeURIComponent((new XMLSerializer).serializeToString(this.v)))
    }
    ;
    ff.prototype.Fc = function() {
        return this.H
    }
    ;
    var gf = function(a, b) {
        this.j = b.map(function(c) {
            return new ff(a + c)
        });
        this.g = new Map
    }
      , hf = function(a, b, c) {
        b = b.toString();
        return a.g.has(b) ? [].concat(la(a.g.get(b).keys())).map(function(d) {
            return parseFloat(d)
        }).sort(function(d, e) {
            return Math.abs(parseFloat(d) - c) - Math.abs(parseFloat(e) - c)
        })[0] : null
    };
    gf.prototype.preload = function(a, b) {
        var c = jf(this, a);
        return (new Promise(function(d) {
            La(c, d);
            c.preload()
        }
        )).then(function() {
            return b && b()
        })
    }
    ;
    var lf = function() {
        var a = kf;
        return Promise.all([0, 1].map(function(b) {
            return a.preload(b)
        })).then(function() {})
    }
      , jf = function(a, b) {
        return "number" == typeof b ? a.j[b] : a.j[b[0]]
    };
    gf.prototype.jc = function(a) {
        return a[4]
    }
    ;
    gf.prototype.Pb = function(a) {
        return a[3]
    }
    ;
    var nf = function(a, b, c) {
        c = void 0 === c ? 1 : c;
        var d = b.toString()
          , e = "" + Math.round(1E3 * c) / 1E3;
        a.g.has(d) || a.g.set(d, new Map);
        var f = a.g.get(d);
        if (!f.has(e)) {
            var g = jf(a, b[0]);
            if (!g.Rb())
                return null;
            f.set(e, mf(b, g.Fc(), c))
        }
        return a.g.get(d).get(e)
    }
      , mf = function(a, b, c) {
        var d = document.createElement("canvas")
          , e = a[3] + 10
          , f = a[4] + 10;
        d.width = Math.ceil(e * c);
        d.height = Math.ceil(f * c);
        var g = d.getContext("2d");
        g.scale(c, c);
        g.drawImage(b, a[1] - 5, a[2] - 5, e, f, 0, 0, e, f);
        return d
    }
      , pf = function(a, b) {
        var c = of.ka();
        return new Promise(function(d) {
            setTimeout(function() {
                nf(c, a, b);
                d()
            }, 0)
        }
        )
    }
      , qf = function(a, b, c, d, e, f, g, h, k) {
        h = void 0 === h ? !1 : h;
        if (a = nf(a, b, void 0 === k ? 1 : k))
            h && c.scale(-1, 1),
            b = 10 * f / b[3],
            c.drawImage(a, d - (f + b) / 2, e - (g + b) / 2, f + b, g + b),
            h && c.scale(-1, 1)
    };
    var of = function() {
        gf.call(this, "", rf)
    };
    q(of, gf);
    var rf = ["svg-sprite.svg", "pitcher-sprite.svg"]
      , sf = [0, 20, 1037, 459.899993896, 111.199996948]
      , tf = [0, 20, 1431, 40, 34]
      , uf = [0, 20, 20, 299.200012207, 351.5]
      , vf = [0, 20, 1485, 106, 65]
      , wf = [0, 20, 1865, 651.5, 136.899993896]
      , xf = [0, 20, 12104, 25, 28]
      , yf = [0, 20, 12152, 419.899993896, 135.800003052]
      , zf = [0, 20, 12308, 426.200012207, 122.5]
      , Af = [0, 20, 14288, 106, 65]
      , Bf = [0, 20, 14660, 28, 28]
      , Cf = [0, 20, 14708, 143, 117]
      , Df = [0, 20, 14845, 143, 117]
      , Ef = [0, 20, 15242, 129.300003052, 203.899993896]
      , Ff = [0, 20, 15466, 129.300003052, 239.800003052]
      , Gf = [0, 20, 15726, 129.300003052, 222]
      , Hf = [0, 20, 16043, 339, 133]
      , If = [0, 20, 16196, 441.5, 135.5]
      , Jf = [0, 20, 16352, 31, 31]
      , Kf = [0, 20, 16403, 35, 35]
      , Lf = [0, 20, 16458, 32, 41]
      , Mf = [0, 20, 16559, 27, 22]
      , Nf = [0, 20, 16601, 73.6999969482, 24.5]
      , Of = [0, 20, 16646, 34, 32]
      , Pf = [0, 20, 17067, 243, 49]
      , Qf = [0, 20, 16963, 120, 84]
      , Rf = [0, 20, 17136, 33, 34]
      , Sf = [0, 20, 17190, 32, 35]
      , Tf = [0, 20, 17245, 244, 104]
      , Uf = [0, 20, 17687, 52, 42]
      , Vf = [0, 20, 17749, 137.199996948, 236.800003052]
      , Wf = [0, 20, 18006, 171.899993896, 254]
      , Xf = [0, 20, 18504, 27, 22]
      , Yf = [0, 20, 18546, 442.700012207, 583.299987793];
    ya(of);
    var Zf = [[0, 20, 2022, 390, 290], [0, 20, 2332, 390, 290], [0, 20, 2642, 390, 290], [0, 20, 2952, 390, 290], [0, 20, 3262, 390, 290], [0, 20, 3572, 390, 290], [0, 20, 3882, 390, 290], [0, 20, 4192, 390, 290], [0, 20, 4502, 390, 290], [0, 20, 4812, 390, 290], [0, 20, 5122, 390, 290], [0, 20, 5432, 390, 290], [0, 20, 5742, 390, 290], [0, 20, 6052, 390, 290], [0, 20, 6362, 390, 290]]
      , $f = [[0, 20, 12451, 45, 62.0999984741], [0, 20, 12534, 45, 62.0999984741], [0, 20, 12617, 45, 62.0999984741], [0, 20, 12700, 45, 62.0999984741], [0, 20, 12783, 45, 62.0999984741], [0, 20, 12866, 45, 62.0999984741], [0, 20, 12949, 45, 62.0999984741], [0, 20, 13032, 45, 62.0999984741], [0, 20, 13115, 45, 62.0999984741], [0, 20, 13198, 45, 62.0999984741]]
      , ag = [[0, 20, 13281, 45, 62.0999984741], [0, 20, 13364, 45, 62.0999984741], [0, 20, 13447, 45, 62.0999984741], [0, 20, 13530, 45, 62.0999984741], [0, 20, 13613, 45, 62.0999984741], [0, 20, 13696, 45, 62.0999984741], [0, 20, 13779, 45, 62.0999984741], [0, 20, 13862, 45, 62.0999984741], [0, 20, 13945, 45, 62.0999984741], [0, 20, 14028, 45, 62.0999984741]]
      , bg = [[1, 20, 4492, 109, 66], [1, 20, 4578, 109, 66], [1, 20, 4664, 109, 66], [1, 20, 4750, 109, 66], [1, 20, 4836, 109, 66], [1, 20, 4922, 109, 66], [1, 20, 5008, 109, 66], [1, 20, 5094, 109, 66], [1, 20, 5180, 109, 66], [1, 20, 5266, 109, 66], [1, 20, 5352, 109, 66], [1, 20, 5438, 109, 66], [1, 20, 5524, 109, 66]]
      , cg = [[0, 20, 1570, 83, 39], [0, 20, 1629, 83, 39], [0, 20, 1688, 83, 39], [0, 20, 1747, 83, 39], [0, 20, 1806, 83, 39], [0, 20, 1747, 83, 39], [0, 20, 1688, 83, 39], [0, 20, 1629, 83, 39], [0, 20, 1570, 83, 39]]
      , dg = [[1, 20, 32378, 127, 339], [1, 20, 32737, 127, 339], [1, 20, 32737, 127, 339], [1, 20, 32737, 127, 339], [1, 20, 32737, 127, 339], [1, 20, 33096, 127, 339], [1, 20, 33455, 127, 339], [1, 20, 33814, 127, 339], [1, 20, 34173, 127, 339], [1, 20, 34532, 127, 339], [1, 20, 34891, 127, 339], [1, 20, 35250, 127, 339], [1, 20, 35609, 127, 339], [1, 20, 35968, 127, 339], [1, 20, 36327, 127, 339], [1, 20, 36686, 127, 339], [1, 20, 37045, 127, 339], [1, 20, 37404, 127, 339], [1, 20, 37763, 127, 339], [1, 20, 38122, 127, 339], [1, 20, 38481, 127, 339], [1, 20, 38840, 127, 339], [1, 20, 39199, 127, 339], [1, 20, 39558, 127, 339], [1, 20, 39917, 127, 339], [1, 20, 40276, 127, 339], [1, 20, 40635, 127, 339], [1, 20, 40994, 127, 339], [1, 20, 41353, 127, 339], [1, 20, 41712, 127, 339], [1, 20, 42071, 127, 339], [1, 20, 42430, 127, 339], [1, 20, 42789, 127, 339], [1, 20, 43148, 127, 339]]
      , eg = [[0, 20, 16698, 70, 33], [0, 20, 16751, 70, 33], [0, 20, 16804, 70, 33], [0, 20, 16857, 70, 33], [0, 20, 16910, 70, 33]]
      , fg = [[0, 20, 17369, 70, 33], [0, 20, 17422, 70, 33], [0, 20, 17475, 70, 33], [0, 20, 17528, 70, 33], [0, 20, 17581, 70, 33], [0, 20, 17528, 70, 33], [0, 20, 17634, 70, 33], [0, 20, 17422, 70, 33], [0, 20, 17369, 70, 33]]
      , gg = [[1, 20, 23828, 164, 151], [1, 20, 23999, 164, 151], [1, 20, 24170, 164, 151], [1, 20, 24341, 164, 151], [1, 20, 24512, 164, 151], [1, 20, 24683, 164, 151], [1, 20, 24854, 164, 151], [1, 20, 25025, 164, 151], [1, 20, 25196, 164, 151], [1, 20, 25367, 164, 151], [1, 20, 25538, 164, 151], [1, 20, 25709, 164, 151], [1, 20, 25880, 164, 151], [1, 20, 26051, 164, 151], [1, 20, 26222, 164, 151], [1, 20, 26393, 164, 151], [1, 20, 26564, 164, 151], [1, 20, 26735, 164, 151], [1, 20, 26906, 164, 151], [1, 20, 27077, 164, 151], [1, 20, 27248, 164, 151], [1, 20, 27419, 164, 151], [1, 20, 27590, 164, 151], [1, 20, 27761, 164, 151]];
    var D = function(a, b, c) {
        a = void 0 === a ? 0 : a;
        this.ab = [];
        this.va = null;
        this.g = a instanceof r ? a : new r(a,void 0 === b ? 0 : b,void 0 === c ? 0 : c);
        this.$a = new r(0,0,0);
        this.Gc = new r(0,0,0);
        this.Bc = this.hb = 1;
        this.Tb = this.Zb = this.T = !0;
        this.Xb = new hg;
        this.Fa = 0
    };
    D.prototype.yb = function(a) {
        this.Zb = !0;
        for (var b = n(this.ab), c = b.next(); !c.done; c = b.next())
            c.value.yb(a)
    }
    ;
    D.prototype.Eb = function(a) {
        this.Tb = !0;
        for (var b = n(this.ab), c = b.next(); !c.done; c = b.next())
            c.value.Eb(a)
    }
    ;
    var E = function(a, b) {
        a.yb(!0);
        a.Eb(!0);
        a.va && bb(a.va.ab, a);
        (a.va = b) && a.va.ab.push(a)
    }
      , ig = function(a, b) {
        E(b, a)
    }
      , jg = function(a) {
        E(a, null)
    };
    D.prototype.j = function(a, b, c) {
        this.yb(!0);
        a instanceof r ? (this.g.x = a.x,
        this.g.y = a.y,
        this.g.g = a.g) : (this.g.x = void 0 === a ? this.g.x : a,
        this.g.y = void 0 === b ? this.g.y : b,
        this.g.g = void 0 === c ? this.g.g : c)
    }
    ;
    var F = function(a, b) {
        a.Eb(!0);
        a.yb(!0);
        a.hb = b
    }
      , H = function(a) {
        a.Zb && (a.$a.x = a.g.x,
        a.$a.y = a.g.y,
        a.$a.g = a.g.g,
        a.va && a.$a.scale(kg(a.va)).add(H(a.va)),
        a.Gc = a.$a,
        a.Zb = !1);
        return a.Gc
    }
      , lg = function(a) {
        a = H(a);
        return new jd(a.x,a.g)
    }
      , kg = function(a) {
        if (a.Tb) {
            var b = a.va ? a.hb * kg(a.va) : a.hb;
            a.Bc = b;
            a.Tb = !1
        }
        return a.Bc
    }
      , mg = function(a, b) {
        if (!a.T)
            return !1;
        var c = b(a);
        if (c)
            return c;
        a = n(a.ab);
        for (c = a.next(); !c.done; c = a.next())
            if (c = mg(c.value, b))
                return c;
        return !1
    };
    D.prototype.H = function() {
        return new y(0,0)
    }
    ;
    D.prototype.Aa = function() {}
    ;
    var ng = function(a) {
        return a.va ? a.Fa + ng(a.va) : a.Fa
    }
      , hg = function() {
        this.g = 0
    };
    var og = function() {
        D.call(this);
        this.S = !1
    };
    q(og, D);
    m = og.prototype;
    m.Aa = function(a) {
        this.S || (this.S = !0,
        this.Lc());
        this.uc(a);
        this.mb() && this.Ra()
    }
    ;
    m.uc = function() {}
    ;
    m.Lc = function() {}
    ;
    m.Ra = function() {}
    ;
    m.mb = function() {
        return !1
    }
    ;
    var pg = function(a, b, c) {
        b = void 0 === b ? function() {}
        : b;
        c = void 0 === c ? function() {}
        : c;
        og.call(this);
        this.o = 0;
        this.W = a;
        b && (this.uc = b);
        this.Ra = c
    };
    q(pg, og);
    pg.prototype.mb = function() {
        return this.o >= this.W
    }
    ;
    pg.prototype.Aa = function(a) {
        this.o += a;
        og.prototype.Aa.call(this, a)
    }
    ;
    var qg = function(a) {
        og.call(this);
        this.i = a
    };
    q(qg, og);
    qg.prototype.Aa = function(a) {
        for (var b = n(this.i), c = b.next(); !c.done; c = b.next())
            c = c.value,
            c.mb() || c.Aa(a);
        og.prototype.Aa.call(this, a)
    }
    ;
    qg.prototype.mb = function() {
        for (var a = n(this.i), b = a.next(); !b.done; b = a.next())
            if (!b.value.mb())
                return !1;
        return !0
    }
    ;
    var I = function() {
        D.call(this);
        this.i = [];
        this.o = []
    };
    q(I, D);
    I.prototype.Aa = function(a) {
        if (0 < this.i.length && 0 < a) {
            var b = this.i[0];
            b.Aa(a);
            b.mb() && this.i.length && this.i[0] === b && this.i.shift()
        }
        for (b = 0; b < this.o.length; b++)
            this.o[b].Aa(a),
            this.o[b].mb() && this.o.splice(b--, 1)
    }
    ;
    var rg = function(a, b) {
        Array.isArray(b) ? a.i.push(new qg(b)) : a.i.push(b)
    }
      , J = function(a, b, c) {
        rg(a, new pg(b,function() {}
        ,void 0 === c ? function() {}
        : c))
    }
      , sg = function(a, b, c) {
        K(a, new pg(b,function() {}
        ,void 0 === c ? function() {}
        : c))
    }
      , K = function(a, b) {
        Array.isArray(b) ? a.o.push(new qg(b)) : a.o.push(b)
    };
    var tg = 1 / 76
      , md = new ld(0,0,1E3,1E3);
    kb();
    var vg = function(a, b, c, d, e, f) {
        if (6 == arguments.length)
            ug(this, a, b, c, d, e, f);
        else {
            if (0 != arguments.length)
                throw Error("o");
            this.g = this.j = 1;
            this.H = this.i = this.T = this.o = 0
        }
    }
      , ug = function(a, b, c, d, e, f, g) {
        if ("number" !== typeof b || "number" !== typeof c || "number" !== typeof d || "number" !== typeof e || "number" !== typeof f || "number" !== typeof g)
            throw Error("p");
        a.g = b;
        a.H = c;
        a.i = d;
        a.j = e;
        a.T = f;
        a.o = g;
        return a
    };
    vg.prototype.scale = function(a, b) {
        this.g *= a;
        this.H *= a;
        this.i *= b;
        this.j *= b;
        return this
    }
    ;
    vg.prototype.toString = function() {
        return "matrix(" + [this.g, this.H, this.i, this.j, this.T, this.o].join() + ")"
    }
    ;
    vg.prototype.transform = function(a, b, c, d, e) {
        var f = b;
        for (b += 2 * e; f < b; ) {
            e = a[f++];
            var g = a[f++];
            c[d++] = e * this.g + g * this.i + this.T;
            c[d++] = e * this.H + g * this.j + this.o
        }
    }
    ;
    var wg = function(a) {
        a = void 0 === a ? new r(0,0,0) : a;
        D.call(this, a);
        var b = this;
        this.i = nd();
        this.o = this.v = 0;
        this.S = new Map;
        this.W = 1.05 * this.i.height;
        this.ha = function(c) {
            return 2 >= c.g || Math.abs(c.x) >= b.i.width / b.i.height * c.g * .8
        }
    };
    q(wg, D);
    var xg = function(a, b) {
        var c = new D;
        c.Aa = function() {
            var d = b.height;
            a.i.width = b.width;
            a.i.height = d;
            a.W = 1.05 * a.i.height
        }
        ;
        c.Aa(0);
        E(c, a)
    }
      , yg = function(a) {
        return a.i.height > a.i.width
    };
    wg.prototype.Aa = function() {
        this.W = 1.05 * this.i.height
    }
    ;
    wg.prototype.j = function(a, b, c) {
        D.prototype.j.call(this, a, b, c);
        this.S.clear()
    }
    ;
    var zg = function(a, b) {
        a.v = Fb(b);
        a.S.clear()
    }
      , Ag = function(a, b) {
        a.o = Fb(b);
        a.S.clear()
    }
      , Cg = function(a, b, c) {
        var d = (c = void 0 === c ? !0 : c) ? a.S.get(173 * (103 * Bg(b.x) + Bg(b.y)) + Bg(b.g)) : null;
        if (!d) {
            d = vd(b, H(a));
            var e = d.x
              , f = d.y
              , g = d.g;
            a.o && (e = Math.cos(a.o) * d.x - Math.sin(a.o) * d.g,
            g = Math.cos(a.o) * d.g + Math.sin(a.o) * d.x);
            a.v && (f = Math.sin(a.v) * g + Math.cos(a.v) * d.y,
            g = Math.cos(a.v) * g - Math.sin(a.v) * d.y);
            d.x = e;
            d.y = f;
            d.g = g;
            c && 1E3 > a.S.size && a.S.set(173 * (103 * Bg(b.x) + Bg(b.y)) + Bg(b.g), d)
        }
        return d
    }
      , Dg = function(a, b, c) {
        c = void 0 === c ? 1 : c;
        b = Cg(a, b);
        c = void 0 === c ? 1 : c;
        if (a.ha(b))
            a = null;
        else {
            var d = Math.abs(a.W / b.g);
            a = new vg(d * c,0,0,d * c,d * b.x + a.i.width / 2,-1 * d * b.y + a.i.height / 2)
        }
        return a
    }
      , Eg = function(a, b) {
        var c = Math.abs(a.W / b.g);
        return new jd(c * b.x + a.i.width / 2,-1 * c * b.y + a.i.height / 2)
    }
      , Bg = function(a) {
        return Math.round(1E4 * a) / 1E4
    };
    var M = function(a, b, c) {
        D.call(this, void 0 === a ? 0 : a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.W = new vg;
        this.ha = new ld(0,0,0,0);
        this.Lb = new y(0,0);
        this.Ka = 0;
        this.S = 1;
        this.ya = new jd(.5,.5);
        this.Dd = "source-over";
        this.Vb = 0
    };
    q(M, D);
    M.prototype.isVisible = function(a) {
        a = a.i;
        var b = this.ha;
        return a.g <= b.g + b.width && b.g <= a.g + a.width && a.j <= b.j + b.height && b.j <= a.j + a.height
    }
    ;
    M.prototype.Kb = function(a) {
        if ((this.W = a) && Fg(this)) {
            a = this.W;
            var b = -Fg(this);
            var c = new vg;
            var d = Math.cos(b);
            b = Math.sin(b);
            c = ug(c, d, b, -b, d, -(0 * d) + 0 * b, -(0 * b) - 0 * d);
            d = a.g;
            b = a.i;
            a.g = c.g * d + c.H * b;
            a.i = c.i * d + c.j * b;
            a.T += c.T * d + c.o * b;
            d = a.H;
            b = a.j;
            a.H = c.g * d + c.H * b;
            a.j = c.i * d + c.j * b;
            a.o += c.T * d + c.o * b
        }
    }
    ;
    M.prototype.Cb = function() {
        return H(this).g
    }
    ;
    M.prototype.H = function() {
        return this.Lb
    }
    ;
    var Gg = function(a) {
        return new y(a.H().width * kg(a),a.H().height * kg(a))
    };
    M.prototype.setSize = function(a, b) {
        a instanceof y ? this.Lb = new y(a.width,a.height) : (this.Lb.width = a,
        this.Lb.height = void 0 === b ? a : b)
    }
    ;
    var Fg = function(a) {
        return a.va && a.va instanceof M ? a.Ka + Fg(a.va) : a.Ka
    }
      , Hg = function(a, b) {
        mg(a, function(c) {
            c instanceof M && (c.S = b)
        })
    };
    M.prototype.Ib = function(a) {
        if (!this.rb(a))
            return !1;
        this.hc();
        return this.isVisible(a)
    }
    ;
    M.prototype.rb = function(a) {
        var b = H(this);
        a = new jd(b.x + a.i.width / 2,b.y + a.i.height / 2);
        this.W ? ug(this.W, kg(this), 0, 0, kg(this), a.x, a.y) : this.W = new vg(kg(this),0,0,kg(this),a.x,a.y);
        this.Kb(this.W);
        return !0
    }
    ;
    M.prototype.hc = function() {
        var a = this.H().width
          , b = this.H().height
          , c = -this.ya.x * a
          , d = -this.ya.y * b
          , e = [];
        this.W.transform([c, d, c + a, d, c + a, d + b, c, d + b], 0, e, 0, 4);
        b = n([e[0], e[2], e[4], e[6]].reduce(function(f, g) {
            return [Math.min(f[0], g), Math.max(f[1], g)]
        }, [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]));
        a = b.next().value;
        b = b.next().value;
        c = n([e[1], e[3], e[5], e[7]].reduce(function(f, g) {
            return [Math.min(f[0], g), Math.max(f[1], g)]
        }, [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]));
        e = c.next().value;
        c = c.next().value;
        this.ha.g = a;
        this.ha.j = e;
        this.ha.width = b - a;
        this.ha.height = c - e;
        Ig(this.ha)
    }
    ;
    M.prototype.Oa = function() {}
    ;
    var Ig = function(a) {
        0 > a.width && (a.width *= -1,
        a.g -= a.width);
        0 > a.height && (a.height *= -1,
        a.j -= a.height)
    };
    var N = function(a, b, c) {
        M.call(this, void 0 === a ? 0 : a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.Jb = !0;
        this.Jc = 0
    };
    q(N, M);
    N.prototype.Cb = function(a) {
        return this.Jb ? this.Jc : M.prototype.Cb.call(this, a)
    }
    ;
    N.prototype.v = function(a) {
        this.Jb = a
    }
    ;
    N.prototype.rb = function(a) {
        if (!this.Jb)
            return M.prototype.rb.call(this, a);
        this.Jc = Cg(a, H(this)).g;
        a = Dg(a, H(this), kg(this));
        this.Kb(a);
        return !!a
    }
    ;
    N.prototype.Oa = function() {}
    ;
    var Jg = function(a, b, c, d, e) {
        b = void 0 === b ? 1 : b;
        c = void 0 === c ? "#000" : c;
        d = void 0 === d ? 0 : d;
        e = void 0 === e ? 360 : e;
        N.call(this, a);
        this.Sa = b;
        this.fillStyle = c;
        this.Ta = null;
        this.ub = Fb(d);
        this.tb = Fb(e);
        this.setSize(2 * this.Sa)
    };
    q(Jg, N);
    Jg.prototype.Oa = function(a) {
        N.prototype.Oa.call(this, a);
        a.beginPath();
        a.arc(0, 0, this.Sa, this.ub, this.tb);
        a.lineTo(0, 0);
        a.closePath();
        a.fillStyle = this.fillStyle;
        this.Ta && (a.strokeStyle = this.Ta,
        a.lineWidth = .1,
        a.stroke());
        a.fill()
    }
    ;
    var Kg = function(a, b, c) {
        this.g = a;
        this.j = b;
        this.i = c
    }
      , Lg = function(a, b) {
        if (0 == b)
            return 0;
        if (1 == b)
            return 1;
        var c = v(0, a.g, b)
          , d = v(a.g, a.i, b);
        a = v(a.i, 1, b);
        c = v(c, d, b);
        d = v(d, a, b);
        return v(c, d, b)
    }
      , Mg = function(a, b) {
        var c = b - 0;
        if (0 >= c)
            return 0;
        if (1 <= c)
            return 1;
        for (var d = 0, e = 1, f = 0, g = 0; 8 > g; g++) {
            f = Lg(a, c);
            var h = (Lg(a, c + 1E-6) - f) / 1E-6;
            if (1E-6 > Math.abs(f - b))
                return c;
            if (1E-6 > Math.abs(h))
                break;
            else
                f < b ? d = c : e = c,
                c -= (f - b) / h
        }
        for (g = 0; 1E-6 < Math.abs(f - b) && 8 > g; g++)
            f < b ? (d = c,
            c = (c + e) / 2) : (e = c,
            c = (c + d) / 2),
            f = Lg(a, c);
        return c
    };
    var Ng = function(a, b, c) {
        var d = new Kg(a,b,c);
        return function(e) {
            e = Mg(d, e);
            if (0 == e)
                e = 0;
            else if (1 == e)
                e = 1;
            else {
                var f = v(0, d.j, e)
                  , g = v(d.j, 1, e)
                  , h = v(1, 1, e);
                f = v(f, g, e);
                g = v(g, h, e);
                e = v(f, g, e)
            }
            return e
        }
    }
      , Og = Ng(.25, .1, .25)
      , Pg = function(a) {
        return a
    }
      , Qg = Ng(.4, 0, 1)
      , Rg = Ng(0, 0, .6)
      , Sg = Ng(.6, 0, .4)
      , Tg = function(a) {
        return .5 > a ? 2 * a * a : -1 + (4 - 2 * a) * a
    };
    var O = function(a, b, c, d, e) {
        e = void 0 === e ? {} : e;
        var f = void 0 === e.Db ? v : e.Db
          , g = void 0 === e.Ma ? Pg : e.Ma
          , h = void 0 === e.Ec ? void 0 : e.Ec;
        pg.call(this, a, null, void 0 === e.Ra ? function() {}
        : e.Ra);
        this.V = d;
        this.v = h;
        this.i = b;
        if (null === this.i && void 0 === this.v)
            throw Error("q");
        this.$ = c;
        this.ha = f;
        this.U = g
    };
    q(O, pg);
    O.prototype.Lc = function() {
        null === this.i && (this.i = this.v())
    }
    ;
    O.prototype.uc = function() {
        this.V(this.ha(this.i, this.$, this.U(Eb(this.o / this.W, 0, 1))))
    }
    ;
    var P = function(a, b, c, d) {
        d = void 0 === d ? {} : d;
        O.call(this, b, null, c.j(), function(e) {
            return a.j(e)
        }, {
            Ra: void 0 === d.Ra ? function() {}
            : d.Ra,
            Ma: void 0 === d.Ma ? Pg : d.Ma,
            Ec: function() {
                return a.g.j()
            },
            Db: z
        })
    };
    q(P, O);
    var Ug = function() {
        this.j = [];
        this.g = new D;
        this.i = [];
        this.T = [];
        this.H = []
    };
    Ug.prototype.reset = function() {
        this.j = [];
        this.g = new D;
        this.i = [];
        this.T = [];
        this.H = []
    }
    ;
    var Wg = function(a) {
        var b = Vg;
        b.T = [];
        for (var c = n(b.j), d = c.next(); !d.done; d = c.next())
            mg(d.value, function(f) {
                b.T.push(f);
                f.Aa(a)
            });
        b.H = [];
        var e = 0;
        mg(b.g, function(f) {
            b.H.push(f);
            var g = e++;
            f.Xb.g = g;
            f.Aa(a)
        })
    }
      , Xg = function(a) {
        var b = Vg;
        b.i = [];
        for (var c = n(b.T), d = c.next(); !d.done; d = c.next())
            d = d.value,
            d.T && d.Ib && d.Ib(a) && b.i.push(d);
        c = [];
        var e = n(b.H);
        for (d = e.next(); !d.done; d = e.next())
            d = d.value,
            d.T && d.Ib && d.Ib(a) && c.push(d);
        hb(c, function(f, g) {
            var h;
            return (h = g.Cb(a) + ng(g) - (f.Cb(a) + ng(f))) ? h : f.Xb.g - g.Xb.g
        });
        c.forEach(function(f, g) {
            f.Vb = g
        });
        b.i.push.apply(b.i, la(c))
    };
    ya(Ug);
    var Yg = function() {};
    Yg.prototype.g = function() {}
    ;
    Yg.prototype.j = function() {}
    ;
    var Zg = null;
    var Q = function(a, b, c) {
        var d = void 0 === c ? {} : c;
        c = void 0 === d.fillStyle ? null : d.fillStyle;
        var e = void 0 === d.strokeStyle ? null : d.strokeStyle;
        d = void 0 === d.lineWidth ? .1 : d.lineWidth;
        M.call(this, a);
        this.v = b || $g();
        this.U = this.v.map(function(f) {
            return f.j()
        });
        this.o = !0;
        this.i = [];
        this.$ = [];
        this.V = [];
        this.Na = c;
        this.La = !!c;
        this.Ea = e;
        this.ta = !!e;
        this.Ba = d;
        this.wa = !0;
        this.Ca = 0;
        this.Ga = !1
    };
    q(Q, M);
    m = Q.prototype;
    m.isVisible = function(a) {
        return 3 <= this.i.length && M.prototype.isVisible.call(this, a)
    }
    ;
    m.Cb = function(a) {
        this.wa && (this.Ca = Za(this.$, function(b, c) {
            return Math.max(b, c.g)
        }, Cg(a, H(this)).g));
        return this.Ca
    }
    ;
    m.yb = function(a) {
        M.prototype.yb.call(this, a);
        this.o = a || this.o
    }
    ;
    m.Eb = function(a) {
        M.prototype.Eb.call(this, a);
        this.o = a || this.o
    }
    ;
    m.rb = function(a) {
        this.$ = [];
        this.V = [];
        this.i = [];
        var b = !!this.Ea;
        if (this.o) {
            for (var c = kg(this), d = H(this), e = 0; e < this.v.length; e++)
                this.U[e].x = this.v[e].x * c + d.x,
                this.U[e].y = this.v[e].y * c + d.y,
                this.U[e].g = this.v[e].g * c + d.g;
            this.o = !1
        }
        c = n(this.U);
        for (d = c.next(); !d.done; d = c.next())
            if (d = Cg(a, d.value, !1),
            0 != d.g) {
                if (0 > d.g) {
                    e = rd(d.j());
                    var f = (.05 - d.g) / -e.g;
                    d.y += e.y * f;
                    d.x += e.x * f;
                    d.g = .05
                }
                this.$.push(d);
                b && this.V.push(Math.abs(a.W / d.g));
                this.i.push(Eg(a, d))
            }
        this.wa = !0;
        return 0 < this.i.length
    }
    ;
    m.hc = function() {
        if (this.i.length) {
            for (var a = Number.MAX_SAFE_INTEGER, b = Number.MAX_SAFE_INTEGER, c = Number.MIN_SAFE_INTEGER, d = Number.MIN_SAFE_INTEGER, e = n(this.i), f = e.next(); !f.done; f = e.next())
                f = f.value,
                a = Math.min(f.x, a),
                c = Math.max(f.x, c),
                b = Math.min(f.y, b),
                d = Math.max(f.y, d);
            c = Math.abs(c - a);
            d = Math.abs(d - b);
            this.ha.g = a;
            this.ha.j = b;
            this.ha.width = c;
            this.ha.height = d;
            Ig(this.ha)
        }
    }
    ;
    m.Oa = function(a) {
        a.beginPath();
        this.ta && (a.strokeStyle = this.Ea);
        if (this.Ga && 2 < this.i.length) {
            var b = (this.i[0].x + this.i[1].x) / 2
              , c = (this.i[0].y + this.i[1].y) / 2;
            a.moveTo(b, c);
            for (var d = 1; d < this.i.length - 1; d++) {
                var e = this.i[d]
                  , f = this.i[d + 1];
                a.quadraticCurveTo(e.x, e.y, (e.x + f.x) / 2, (e.y + f.y) / 2);
                this.ta && (a.lineWidth = this.Ba * this.V[d],
                a.stroke(),
                a.beginPath(),
                a.moveTo(Math.round(e.x), Math.round(e.y)))
            }
            a.quadraticCurveTo(this.i[0].x, this.i[0].y, b, c)
        } else
            for (b = 0; b < this.i.length; b++)
                c = this.i[b],
                a.lineTo(Math.round(c.x), Math.round(c.y)),
                this.ta && (a.lineWidth = this.Ba * this.V[b],
                a.stroke(),
                a.beginPath(),
                a.moveTo(Math.round(c.x), Math.round(c.y)));
        this.La && (a.closePath(),
        a.fillStyle = this.Na,
        a.fill())
    }
    ;
    var $g = function() {
        var a = new r(1,1,0);
        return a.x ? [new r(-a.x / 2,-a.y / 2,-a.g / 2), new r(a.x / 2,-a.y / 2,-a.g / 2), new r(a.x / 2,a.y / 2,a.g / 2), new r(-a.x / 2,a.y / 2,a.g / 2), new r(-a.x / 2,-a.y / 2,-a.g / 2)] : [new r(0,-a.y / 2,-a.g / 2), new r(0,a.y / 2,-a.g / 2), new r(0,a.y / 2,a.g / 2), new r(0,-a.y / 2,a.g / 2), new r(0,-a.y / 2,-a.g / 2)]
    }
      , ah = function(a, b, c, d) {
        d = void 0 === d ? 22 : d;
        var e = []
          , f = a instanceof y ? a.width : a;
        a = a instanceof y ? a.height : a;
        for (var g = 0; g <= d; g++)
            e.push(new r(f * Math.cos(b + (c - b) * g / d),0,a * Math.sin(b + (c - b) * g / d)));
        return e
    }
      , bh = function() {
        var a = new r(1.8,0,1.8);
        return [new r(0,0,a.g / 2), new r(a.x / 2,0,0), new r(0,0,-a.g / 2), new r(-a.x / 2,0,0), new r(0,0,a.g / 2)]
    };
    var ch = function(a) {
        Q.call(this, new r(0,0,0), ah(new y(a,a), 0, 2 * Math.PI, 8), {
            fillStyle: "#000"
        });
        this.Ga = !0;
        this.S = .12
    };
    q(ch, Q);
    ch.prototype.Oa = function(a) {
        var b = this.ha;
        3 > b.height ? (a.fillStyle = "#000",
        a.fillRect(b.g, b.j, b.width, b.height)) : Q.prototype.Oa.call(this, a)
    }
    ;
    var dh = [0, 0, 0, 0, 0, 0]
      , fh = function(a, b, c, d) {
        a = void 0 === a ? dh : a;
        N.call(this, void 0 === b ? 0 : b, void 0 === c ? 0 : c, void 0 === d ? 0 : d);
        this.ta = (this.U = "number" == typeof a[0] ? null : a) ? this.U[0] : a;
        this.$ = this.wa = 0;
        this.Na = !1;
        this.tb = this.Kc = !0;
        this.Ta = new y(1,1);
        this.Pa = new y(0,0);
        this.ub = new y(0,0);
        this.Yb = !1;
        S(this, 0, -.5);
        eh(this);
        this.Sa = null
    };
    q(fh, N);
    fh.prototype.Ba = function() {}
    ;
    var T = function(a, b) {
        a.U = "number" == typeof b[0] ? null : b;
        a.ta = a.U ? a.U[0] : b;
        a.$ = 0;
        a.wa = 0;
        eh(a)
    };
    fh.prototype.H = function() {
        var a = N.prototype.H.call(this);
        return new y(a.width * this.Ta.width,a.height * this.Ta.height)
    }
    ;
    var eh = function(a) {
        var b = a.Jb ? tg : 1;
        a.setSize(b * a.Ba().Pb(a.ta), b * a.Ba().jc(a.ta))
    }
      , S = function(a, b, c) {
        a.Pa.width = b;
        a.Pa.height = c;
        a.ya.x = -1 * (a.Yb ? -1 : 1) * b + .5;
        a.ya.y = -c + .5
    }
      , gh = function(a, b, c) {
        a.ub.width = b;
        a.ub.height = c
    };
    fh.prototype.v = function(a) {
        N.prototype.v.call(this, a);
        eh(this)
    }
    ;
    var U = function(a, b, c) {
        var d = N.prototype.H.call(a);
        b = Math.min(b / d.width, (void 0 == c ? b : c) / d.height);
        a.Ta.width = b;
        a.Ta.height = b
    }
      , hh = function(a, b) {
        a.Na = b;
        a.$ = 0;
        a.wa = 0;
        a.U && (a.ta = a.U[a.$])
    };
    fh.prototype.resume = function() {
        this.Na = !0
    }
    ;
    fh.prototype.setLoop = function(a) {
        this.Kc = a
    }
    ;
    fh.prototype.getDuration = function() {
        return this.U ? 42 * this.U.length : 0
    }
    ;
    var ih = function(a) {
        return a.$ + a.wa / 42
    };
    fh.prototype.reset = function() {
        this.wa = this.$ = 0;
        this.ta = this.U[this.$];
        this.Na = !1
    }
    ;
    fh.prototype.Aa = function(a) {
        N.prototype.Aa.call(this, a);
        this.Na && (this.wa += a,
        this.U && 42 < this.wa && (this.wa -= 42,
        this.$ >= this.U.length - 1 ? (this.Na = this.Na && this.Kc,
        a = 0) : a = this.$ + 1,
        this.$ = a,
        this.ta = this.U[this.$]))
    }
    ;
    fh.prototype.o = function(a) {
        this.Yb = a;
        S(this, this.Pa.width, this.Pa.height)
    }
    ;
    var jh = function(a) {
        a.Sa || (a.Sa = new ch(a.H().width / 2),
        E(a.Sa, a));
        a.Sa && (a.Sa.T = !0)
    };
    fh.prototype.Oa = function(a) {
        N.prototype.Oa.call(this, a);
        var b = this.H();
        this.Wb(a, this.ub.width + this.Pa.width * b.width, -this.ub.height + this.Pa.height * b.height, b.width, b.height, this.Yb)
    }
    ;
    fh.prototype.Wb = function() {}
    ;
    var V = function(a, b, c, d) {
        fh.call(this, a, void 0 === b ? 0 : b, void 0 === c ? 0 : c, void 0 === d ? 0 : d);
        this.ac = this.$b = 0
    };
    q(V, fh);
    V.prototype.Ba = function() {
        return Zg.g()
    }
    ;
    var kh = function(a) {
        return Math.max(.2, Math.abs(a.Ta.width * a.H().width * a.W.g / a.Ba().Pb(a.ta)))
    };
    V.prototype.Kb = function(a) {
        fh.prototype.Kb.call(this, a);
        if (a && !this.ac && (a = kh(this),
        lh(this.$b, a))) {
            var b = hf(this.Ba(), this.ta, a);
            this.$b = b && !lh(parseFloat(b), a) ? parseFloat(b) : a
        }
    }
    ;
    V.prototype.Wb = function(a, b, c, d, e, f) {
        qf(this.Ba(), this.ta, a, b, c, d, e, f, this.ac || this.$b)
    }
    ;
    var lh = function(a, b) {
        return a ? .5 < Math.max(a, b) / Math.min(a, b) - 1 : !0
    };
    var rh = function(a) {
        D.call(this);
        var b = this;
        this.$ = a;
        var c = Ug.ka().j[1];
        this.i = new mh(0,0,1E4);
        this.i.Oa = function(f) {
            f.fillStyle = b.i.i;
            f.fillRect(0, b.i.o, f.canvas.width, f.canvas.height - b.i.o)
        }
        ;
        E(this.i, c);
        this.v = new mh(0,0,1E4);
        this.v.Oa = function(f) {
            f.fillStyle = b.v.i;
            f.fillRect(0, 0, f.canvas.width, f.canvas.height)
        }
        ;
        E(this.v, this);
        var d = new V(If,-620,-13,1E3);
        F(d, 75);
        E(d, c);
        d = new V(Hf,680,-13,1E3);
        F(d, 70);
        E(d, c);
        d = new V(Wf,-350,-13,500);
        F(d, 30);
        E(d, c);
        d = new V(Vf,370,-13,500);
        F(d, 30);
        E(d, c);
        d = new V(Yf,-100,0,100);
        F(d, 10);
        E(d, c);
        var e = new V(wf);
        gh(e, 0, 4.9);
        S(e, -.5, .5);
        E(e, d);
        d = new V(Yf,100,0,100);
        F(d, 10);
        d.o(!0);
        E(d, c);
        e = new V(wf);
        gh(e, 0, 4.9);
        S(e, -.5, .5);
        e.o(!0);
        E(e, d);
        d = new V(sf,-55,0,150);
        F(d, 12);
        d.o(!0);
        e = new V(yf,-55,7.35 * d.H().height,150);
        U(e, .9 * d.H().width);
        F(e, 12);
        E(e, c);
        E(d, c);
        d = new V(sf,55,0,150);
        F(d, 12);
        e = new V(zf,55,.85 * d.H().height * 10.5,150);
        U(e, .9 * d.H().width);
        F(e, 12);
        E(e, c);
        E(d, c);
        d = new V(uf,0,0,150);
        F(d, 7);
        E(d, c);
        this.ya = new Jg(nh.j(),30,"khaki");
        a = a.createRadialGradient(0, 0, 0, 0, 0, 50);
        a.addColorStop(0, "rgba(240, 230, 140, 1)");
        a.addColorStop(1, "rgba(240, 230, 140, 0)");
        ig(this.ya, new Jg(new r(0,0,0),50,a));
        E(this.ya, this);
        this.ha = [101, 200, 208];
        this.U = [0, 187, 255];
        this.W = new oh(0,250,2E3);
        this.W.S = 0;
        this.W.T = !1;
        E(this.W, this);
        this.S = new Jg(new r(0,1,1E3),2E3,"#000");
        this.S.S = 0;
        this.S.Fa = 1E3;
        this.S.T = !1;
        ig(Ug.ka().g, this.S);
        this.V = 0;
        this.o = new I;
        E(this.o, this);
        w.ka().addListener(this);
        ph(this);
        qh(this)
    };
    q(rh, D);
    rh.prototype.Aa = function(a) {
        D.prototype.Aa.call(this, a);
        this.V += a;
        300 < this.V && (this.V = 0,
        ph(this))
    }
    ;
    var ph = function(a) {
        var b = a.$.canvas.height
          , c = .27 * b;
        a.i.i = a.$.createLinearGradient(0, c, 0, b - c);
        a.i.i.addColorStop(0, "#D9E021");
        a.i.i.addColorStop(1, "#76A520");
        a.v.i = a.$.createLinearGradient(0, 0, 0, b);
        a.v.i.addColorStop(0, "rgb(" + a.U[0] + "," + a.U[1] + "," + a.U[2] + ")");
        a.v.i.addColorStop(.3, "rgb(" + a.ha[0] + "," + a.ha[1] + "," + a.ha[2] + ")");
        a.v.i.addColorStop(1, "#FFF")
    };
    rh.prototype.Za = function(a) {
        1E3 == a && ph(this)
    }
    ;
    var qh = function(a) {
        K(a.o, new P(a.ya,3E5,new r(-180,-50,2E3)));
        J(a.o, 15E4, function() {
            a.W.T = !0
        });
        rg(a.o, new O(5E4,[173, 224, 239],[255, 182, 193],function(b) {
            return a.ha = b
        }
        ,{
            Db: sh
        }));
        J(a.o, 0, function() {
            a.S.T = !0
        });
        J(a.o, 0, function() {
            return x(w.ka(), 17)
        });
        rg(a.o, [new O(25E3,[255, 182, 193],[25, 25, 112],function(b) {
            return a.ha = b
        }
        ,{
            Db: sh
        }), new O(5E4,[0, 160, 208],[0, 0, 0],function(b) {
            return a.U = b
        }
        ,{
            Db: sh
        }), new O(5E4,0,1,function(b) {
            a.W.S = b
        }
        ), new O(4E4,0,.2,function(b) {
            a.S.S = b
        }
        )])
    }
      , oh = function(a, b, c) {
        N.call(this, a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.setSize(3E3, 3E3);
        this.i = [];
        for (a = 0; 100 > a; a++)
            this.i.push([-2E3 + 4E3 * Math.random(), -1E3 + 1200 * Math.random()])
    };
    q(oh, N);
    oh.prototype.Oa = function(a) {
        a.fillStyle = "#FFF";
        for (var b = n(this.i), c = b.next(); !c.done; c = b.next())
            c = c.value,
            a.beginPath(),
            a.arc(c[0], c[1], 3, 0, 2 * Math.PI),
            a.fill()
    }
    ;
    var mh = function(a, b, c) {
        N.call(this, a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.o = 0;
        this.i = null
    };
    q(mh, N);
    mh.prototype.rb = function(a) {
        var b = H(this);
        b = Cg(a, b);
        a = a.ha(b) ? null : Eg(a, b);
        this.o = a.y;
        return !0
    }
    ;
    mh.prototype.hc = function() {}
    ;
    mh.prototype.isVisible = function() {
        return !0
    }
    ;
    var nh = new r(-180,280,2E3);
    function sh(a, b, c) {
        return [Math.round(v(a[0], b[0], c)), Math.round(v(a[1], b[1], c)), Math.round(v(a[2], b[2], c))]
    }
    ;var th = -1 < window.location.href.indexOf("mode=1") ? 1 : 0
      , uh = 1 == th ? 10 : 3;
    var vh = function(a, b) {
        a = void 0 === a ? new r(0,0,0) : a;
        b = void 0 === b ? new r(0,0,0) : b;
        D.call(this);
        this.o = b;
        this.i = a;
        this.v = new r(Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER);
        this.S = new r(1,1,1)
    };
    q(vh, D);
    vh.prototype.Aa = function(a) {
        D.prototype.Aa.call(this, a);
        a /= 1E3;
        this.va && this.va.j(wh(this, this.va.g, a));
        xh(this, this.i, a);
        var b = this.i;
        b.x += this.o.x * a;
        b.y += this.o.y * a;
        b.g += this.o.g * a;
        yh(this, this.i)
    }
    ;
    var xh = function(a, b, c) {
        b.x = zh(b.x, a.S.x, c);
        b.y = zh(b.y, a.S.y, c);
        b.g = zh(b.g, a.S.g, c);
        return b
    }
      , zh = function(a, b, c) {
        return .01 > Math.abs(a) && 1 > b ? 0 : a - (a - a * b) * c
    }
      , yh = function(a, b) {
        b.x = Eb(b.x, -a.v.x, a.v.x);
        b.y = Eb(b.y, -a.v.y, a.v.y);
        b.g = Eb(b.g, -a.v.g, a.v.g);
        return b
    }
      , Ah = function(a, b, c, d) {
        b instanceof r ? (a.i.x = b.x,
        a.i.y = b.y,
        a.i.g = b.g) : (a.i.x = b,
        a.i.y = void 0 === c ? a.i.y : c,
        a.i.g = void 0 === d ? a.i.g : d)
    }
      , wh = function(a, b, c) {
        return yh(a, a.o.j().scale(.5 * c).add(xh(a, a.i, .5 * c))).scale(c).add(b)
    }
      , Bh = function(a, b, c, d) {
        c = void 0 === c ? 0 : c;
        d = void 0 === d ? 0 : d;
        b instanceof r ? (a.o.x = b.x,
        a.o.y = b.y,
        a.o.g = b.g) : (a.o.x = b,
        a.o.y = void 0 === c ? a.o.y : c,
        a.o.g = void 0 === d ? a.o.g : d)
    };
    var Ch = function() {
        this.H = this.i = this.j = this.g = 0
    }
      , Dh = function(a, b) {
        return new jd(v(a.g, a.i, b),v(a.j, a.H, b))
    };
    var Eh = w.ka()
      , Fh = function() {
        Jg.call(this, new r(0,0,0), .33, "ivory");
        this.Ca = new ch(.33);
        E(this.Ca, this);
        this.o = 6;
        this.$ = 0;
        this.U = new Ch;
        this.V = null;
        this.Na = .55;
        this.wa = this.Ba = 0;
        this.i = new vh;
        Bh(this.i, 0, -9.8, 0);
        this.i.T = !1;
        E(this.i, this);
        this.Ga = [H(this).j()];
        this.Ea = [];
        this.Pa = 30;
        this.ta = this.La = null
    };
    q(Fh, Jg);
    Fh.prototype.reset = function() {
        this.V = null;
        Gh(this, 6);
        Bh(this.i, 0, -9.8, 0)
    }
    ;
    var Hh = function(a) {
        a.ta && (a.ta(),
        a.ta = null);
        return 3 != a.o ? Promise.resolve() : new Promise(function(b) {
            return a.ta = b
        }
        )
    }
      , Ih = function(a, b, c, d) {
        Ah(a.i, b, c, d);
        a.U.g = H(a).x;
        a.U.j = H(a).g;
        a.U.i = a.U.g + 10 * a.i.i.x;
        a.U.H = a.U.j + 10 * a.i.i.g
    }
      , Jh = function(a) {
        return 2 == a.o || 1 == a.o && (1 == a.$ || 2 == a.$ || 3 == a.$)
    }
      , Gh = function(a, b) {
        a.o = b;
        3 != b && a.ta && (a.ta(),
        a.ta = null);
        Jh(a) || (a.Ga = []);
        0 == b || 6 == b ? (a.i.T = !1,
        Ih(a, 0, 0, 0),
        a.Ca.T = !1,
        a.Ka = Fb(0),
        a.Na = .55) : (a.i.T = !0,
        a.Ca.T = !0)
    };
    Fh.prototype.pitch = function(a) {
        this.La = this.g.j();
        Gh(this, 1);
        this.$ = a;
        var b = td(this.La);
        Ih(this, rd(b).scale(Kh[a]));
        Jh(this) && (this.Ga = [H(this).j()],
        this.Pa = 15);
        3 == this.$ && this.Aa(.3);
        x(Eh, 0)
    }
    ;
    Fh.prototype.Aa = function(a) {
        Jg.prototype.Aa.call(this, a);
        if (0 != this.o) {
            var b = Ug.ka().j[0];
            92 < pd(H(this), A) && this.va != b ? E(this, b) : 92 < pd(H(this), A) || this.va !== b || (b = Ug.ka().g,
            E(this, b))
        }
        Jh(this) && this.Ga.push(H(this).j()) > this.Pa && this.Ga.shift();
        if (6 != this.o) {
            0 != this.o && (this.S = 1);
            if (1 == this.o) {
                Bh(this.i, 0, 0, 0);
                b = td(this.La);
                b = (this.g.g - this.La.g) / b.g;
                var c = z(this.La, sd, b)
                  , d = this.g;
                switch (this.$) {
                case 2:
                    this.j(c.x - .6 * Math.cos(b * Math.PI * 8) + .6 * (1 - b), d.y, d.g);
                    break;
                case 3:
                    var e = b * Math.PI * 7;
                    this.j(c.x - .5 * Math.cos(e) + .5 * (1 - b), c.y + .5 * Math.sin(e), d.g);
                    break;
                case 4:
                    this.j(d.x, c.y + 4 * Math.sin(1.2 * b * Math.PI), d.g);
                    break;
                case 5:
                    this.S = Math.max(0, 1 - 1.4 * b)
                }
            } else
                0 != this.o && 6 != this.o && (0 < this.g.y - this.H().height / 2 ? Bh(this.i, 0, -9.8, 0) : 2 == this.o && 92 < pd(H(this), A) ? this.reset() : 3 == this.o && 92 < pd(H(this), A) ? this.reset() : .1 < Math.abs(this.i.i.y) ? (Bh(this.i, 0, -9.8, 0),
                this.j(this.g.x, this.H().height / 2),
                this.i.i.y *= -.7,
                this.V = null) : (Bh(this.i, -1, 0, -1),
                this.j(this.g.x, this.H().height / 2),
                this.i.i.y = 0,
                this.V = null,
                this.wa = 40 * this.i.i.x,
                this.Ba = -this.i.i.g / 5));
            1 == this.o ? (this.wa = 15 * -this.i.i.x,
            this.Ba = -this.i.i.g / 10) : 0 != this.o && 6 != this.o && (this.wa = 20 * this.i.i.x,
            this.Ba = -this.i.i.g / 8);
            this.Ka = Fb(Gb(this.Ka) + this.wa * a / 1E3);
            this.Na += this.Ba * a / 1E3;
            this.U.g = H(this).x;
            this.U.j = H(this).g;
            this.Ca.j(0, -H(this).y, 0);
            a = Math.max(.05, .5 - H(this).y / 10);
            this.Ca.S = a;
            F(this.Ca, 1 + H(this).y / 20)
        }
    }
    ;
    var Lh = function(a) {
        if (!a.V)
            if (0 >= a.g.y)
                a.V = a.g;
            else {
                var b = 0 >= a.g.y ? 0 : (-a.i.i.y - Math.sqrt(Math.pow(a.i.i.y, 2) - -39.2 * a.g.y / 2)) / -9.8;
                a.V = new r(H(a).x + a.i.i.x * b,0,H(a).g + a.i.i.g * b)
            }
        return a.V
    };
    Fh.prototype.rb = function(a) {
        var b = Jg.prototype.rb.call(this, a);
        if (b) {
            this.Ea = [];
            for (var c = n(this.Ga), d = c.next(); !d.done; d = c.next())
                this.Ea.push(Dg(a, d.value, kg(this)))
        }
        return b
    }
    ;
    Fh.prototype.Oa = function(a) {
        if (Jh(this)) {
            a.save();
            a.fillStyle = "#FFF";
            for (var b = 0; b < this.Ea.length; b++) {
                var c = this.Ea[b];
                c && (a.beginPath(),
                a.setTransform(c.g, 0, 0, c.j, c.T, c.o),
                a.arc(0, 0, .33 * b / this.Ea.length, 0, 2 * Math.PI),
                a.closePath(),
                a.globalAlpha = b / this.Ea.length,
                a.fill())
            }
            a.restore()
        }
        Jg.prototype.Oa.call(this, a);
        a.save();
        a.arc(0, 0, .33, 0, 2 * Math.PI);
        a.clip();
        a.strokeStyle = "red";
        a.lineWidth = .07;
        b = (1.08 + this.Na % 1.08) % 1.08 - .54;
        a.beginPath();
        a.arc(0, b - .54, .44, 0, 2 * Math.PI);
        a.stroke();
        a.closePath();
        a.beginPath();
        a.arc(0, b + .54, .44, 0, 2 * Math.PI);
        a.stroke();
        a.closePath();
        a.restore();
        a.beginPath();
        a.arc(0, 0, .33, 0, 2 * Math.PI);
        a.strokeStyle = "#000";
        a.lineWidth = .06;
        a.stroke();
        a.closePath()
    }
    ;
    var Mh = function(a, b, c) {
        return new r(a * Math.sin(Fb(b)) * Math.cos(Fb(c)),a * Math.cos(Fb(b)),a * Math.sin(Fb(b)) * Math.sin(Fb(c)))
    }
      , Nh = [1.3, 1.2, 1.3, 1.7, 2, 1.3]
      , Kh = [33, 60, 26, 18, 15, 28]
      , sd = new r(0,1.5,0);
    var Oh = function() {
        fh.apply(this, arguments)
    };
    q(Oh, fh);
    Oh.prototype.Ba = function() {
        return Zg.j()
    }
    ;
    Oh.prototype.Wb = function(a, b, c, d, e, f) {
        f && a.scale(-1, 1);
        this.Ba().drawImage(a, this.ta, b - d / 2, c - e / 2, d, e);
        f && a.scale(-1, 1)
    }
    ;
    var Ph = function(a, b) {
        var c = void 0 === c ? !0 : c;
        return new O(b,0,1,function(d) {
            c ? Hg(a, d) : a.S = d
        }
        )
    }
      , Qh = function(a, b) {
        var c = void 0 === c ? !0 : c;
        return new O(b,1,0,function(d) {
            c ? Hg(a, d) : a.S = d
        }
        )
    };
    var Rh = function(a, b, c) {
        Oh.call(this, hd, void 0 === a ? 0 : a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        U(this, 4, 4);
        S(this, 0, -.5);
        this.ya.x = -.3;
        this.ya.y = 0;
        F(this, 1.2);
        this.tb = !1;
        this.setLoop(!0);
        hh(this, !0);
        this.Ga = 0;
        this.Ea = !1;
        this.Ca = .4;
        this.j(-this.Ca, .5);
        this.V = new vh(new r(0,0,0),new r(0,-9.8,0));
        E(this.V, this);
        this.V.T = !1;
        this.i = new I;
        E(this.i, this)
    };
    q(Rh, Oh);
    Rh.prototype.o = function(a) {
        Oh.prototype.o.call(this, a);
        this.Ea = a
    }
    ;
    var Sh = function(a, b) {
        a.Ga = b;
        switch (a.Ga) {
        case 2:
            T(a, ed);
            U(a, 4, 4);
            a.setLoop(!1);
            hh(a, !0);
            K(a.i, new P(a,84,new r((a.Ea ? -1 : 1) * a.Ca,.5,0)));
            break;
        case 3:
            break;
        default:
            T(a, hd),
            U(a, 4, 4),
            a.setLoop(!0),
            hh(a, !0),
            K(a.i, new P(a,84,new r(-((a.Ea ? -1 : 1) * a.Ca),.5,0)))
        }
    }
      , Th = function(a, b) {
        a.V.T = !0;
        Ah(a.V, b ? new r(-10,5,0) : new r(-3,2,0));
        rg(a.i, Qh(a, 1E3));
        J(a.i, 0, function() {
            a.Ka = Fb(0);
            a.V.T = !1
        });
        K(a.i, new O(1E3,Gb(a.Ka),b ? 720 : 0,function(c) {
            a.Ka = Fb(c)
        }
        ,{
            Ma: Rg
        }));
        Sh(a, 3)
    };
    Rh.prototype.Aa = function(a) {
        Oh.prototype.Aa.call(this, a);
        this.Fa = 2 != this.Ga || 2 > ih(this) ? -.2 : .6
    }
    ;
    var Uh = 42 * ed.length;
    var Vh = [{
        Da: [0, 20, 7154, 98.8000030518, 87.0999984741],
        Ja: 87,
        Ia: -1
    }, {
        Da: [0, 20, 7262, 109.800003052, 141.399993896],
        Ja: 133,
        Ia: -3
    }, {
        Da: [0, 20, 7424, 51.9000015259, 168.300003052],
        Ja: 67,
        Ia: 0
    }, {
        Da: [0, 20, 9888, 66.5999984741, 130.399993896],
        Ja: 72,
        Ia: 0
    }, {
        Da: [0, 20, 9021, 93.5999984741, 170.899993896],
        Ja: 51,
        Ia: 0
    }, {
        Da: [0, 20, 9212, 98.9000015259, 157],
        Ja: 74,
        Ia: -2
    }, {
        Da: [0, 20, 8646, 101.400001526, 149.100006104],
        Ja: 69,
        Ia: 2
    }, {
        Da: [0, 20, 11052, 87.4000015259, 159.5],
        Ja: 95,
        Ia: 3,
        bc: -.1
    }, {
        Da: [0, 20, 11569, 109.5, 220],
        Ja: 129,
        Ia: 18,
        bc: -.8,
        Cc: -.2
    }, {
        Da: [0, 20, 7752, 95.1999969482, 176.699996948],
        Ja: 73,
        Ia: 0
    }, {
        Da: [0, 20, 8068, 93.0999984741, 151.300003052],
        Ja: 86,
        Ia: -4
    }, {
        Da: [0, 20, 8240, 63.7999992371, 236.300003052],
        Ja: 106,
        Ia: 0
    }, {
        Da: [0, 20, 8816, 80.0999984741, 184.100006104],
        Ja: 115,
        Ia: 0
    }, {
        Da: [0, 20, 9389, 62.7000007629, 163.100006104],
        Ja: 62,
        Ia: 0
    }, {
        Da: [0, 20, 9573, 60.7999992371, 180.699996948],
        Ja: 67,
        Ia: 0
    }, {
        Da: [0, 20, 9774, 136.699996948, 93.6999969482],
        Ja: 52,
        Ia: 10
    }, {
        Da: [0, 20, 7949, 94.5999984741, 98.3000030518],
        Ja: 43,
        Ia: 0
    }, {
        Da: [0, 20, 10473, 74.5, 168.899993896],
        Ja: 86,
        Ia: 0
    }, {
        Da: [0, 20, 10662, 81, 144.300003052],
        Ja: 78.5,
        Ia: 0
    }, {
        Da: [0, 20, 10039, 116.400001526, 106.599998474],
        Ja: 80.4,
        Ia: 3,
        Cc: -.3
    }, {
        Da: [0, 20, 11232, 113.5, 163.199996948],
        Ja: 125,
        Ia: 3
    }, {
        Da: [0, 20, 10827, 117, 86.1999969482],
        Ja: 44.2,
        Ia: 0
    }, {
        Da: [0, 20, 7613, 139.600006104, 118.099998474],
        Ja: 57.3,
        Ia: 35,
        Dc: !0,
        Ic: 60,
        Fd: .3
    }, {
        Da: [0, 20, 7034, 80, 99.8000030518],
        Ja: 57.6,
        Ia: 0
    }, {
        Da: [0, 20, 10166, 119.800003052, 124.199996948],
        Ja: 83,
        Ia: 0
    }, {
        Da: [0, 20, 10934, 96.0999984741, 97.5999984741],
        Ja: 46,
        Ia: 0
    }, {
        Da: [0, 20, 10311, 95.6999969482, 141.600006104],
        Ja: 62,
        Ia: 0
    }, {
        Da: [0, 20, 6850, 139.300003052, 163.899993896],
        Ja: 62,
        Ia: 0,
        lc: !0
    }, {
        Da: [0, 20, 6672, 110.300003052, 158],
        Ja: 63,
        Ia: 14,
        bc: -.3,
        lc: !0
    }]
      , Wh = function() {
        this.j = 0;
        this.g = [].concat(la(Vh))
    };
    Wh.prototype.reset = function() {
        this.j = 0;
        this.g = [].concat(la(Vh))
    }
    ;
    var Xh = function() {
        var a = Wh.ka();
        a.j >= Vh.length && a.reset();
        var b = Math.floor(Math.random() * a.g.length)
          , c = a.g[b];
        a.g.splice(b, 1);
        a.j++;
        return c
    };
    ya(Wh);
    var Yh = function(a, b) {
        this.H = a;
        this.i = b;
        this.o = this.g = null;
        this.v = this.T = !1;
        this.S = [];
        this.j = null
    }
      , ci = function(a) {
        var b = W.ka();
        if (Zh && !b.g) {
            b.g = new (window.AudioContext || window.webkitAudioContext);
            b.o = b.g.createGain();
            b.o.connect(b.g.destination);
            for (var c in b.H)
                b.H[c].H = b.g;
            for (var d in b.i)
                $h(b.i[d], b.g, b.o);
            b.g.onstatechange = function() {
                ai(b)
            }
            ;
            ai(b);
            bi(b);
            ve(a, ["click", "pointerup", "mouseup", "touchend"], function() {
                b.g.resume();
                bi(b)
            }, !0)
        }
    }
      , ai = function(a) {
        if ("running" == a.g.state && !a.v) {
            a.v = !0;
            for (var b = 0; b < a.S.length; b++)
                a.S[b]()
        }
    }
      , di = function(a) {
        a.j = a.g.createBufferSource();
        a.j.buffer = a.g.createBuffer(1, 1, 22050);
        a.j.connect(a.g.destination);
        a.j.start(0)
    }
      , bi = function(a) {
        a.g && (null == a.j ? di(a) : void 0 === a.j.playbackState ? di(a) : a.j.playbackState !== a.j.PLAYING_STATE && a.j.playbackState !== a.j.FINISHED_STATE && di(a))
    };
    Yh.prototype.destroy = function() {
        this.g.close();
        this.g = null
    }
    ;
    Yh.prototype.reset = function() {
        for (var a in this.H)
            this.H[a].T = [];
        for (var b in this.i)
            this.i[b].stop()
    }
    ;
    Yh.prototype.isMuted = function() {
        return !1
    }
    ;
    var Zh = !(!window.AudioContext && !window.webkitAudioContext) && !!window.GainNode
      , X = function(a, b) {
        this.va = ei.Ac;
        this.v = a;
        this.o = b;
        this.H = {};
        this.i = this.T = this.g = this.j = null;
        this.S = 0
    }
      , $h = function(a, b, c) {
        a.g = b;
        a.T = c
    }
      , fi = function(a) {
        if (a.g)
            for (var b in a.H) {
                var c = a.H[b];
                !c.Cd && 1E3 * a.g.currentTime > c.Mc + a.o && delete a.H[b]
            }
    }
      , gi = function(a) {
        !a.j && a.g.createGain && (a.j = a.g.createGain())
    };
    X.prototype.play = function(a, b, c, d, e, f) {
        a = void 0 === a ? 0 : a;
        b = void 0 === b ? !1 : b;
        c = void 0 === c ? 0 : c;
        e = void 0 === e ? !1 : e;
        if (!this.g || !this.T)
            return -1;
        fi(this);
        f = void 0 === f ? this.g.currentTime + a / 1E3 : f;
        d || (d = this.g.createBufferSource(),
        d.playbackRate.setValueAtTime(1, this.g.currentTime));
        gi(this);
        this.i && d.connect(this.i);
        this.j ? (this.i ? this.i.connect(this.j) : d.connect(this.j),
        this.j.connect(this.T)) : this.i ? this.i.connect(this.T) : d.connect(this.T);
        this.i = null;
        d.loop = b;
        try {
            d.buffer = this.va.v
        } catch (h) {
            return -1
        }
        a = this.v / 1E3;
        var g = this.o / 1E3 / d.playbackRate.value;
        b ? (d.loopStart = a + (e ? c / 1E3 : 0),
        d.loopEnd = a + g,
        d.start(f, a + c / 1E3)) : d.start(f, a + c / 1E3, g);
        e = this.S++;
        this.H[e] = {
            node: d,
            Mc: 1E3 * f - c,
            Cd: b
        };
        return e
    }
    ;
    var ii = function() {
        var a = hi;
        gi(a);
        a.j && (a.j.gain.setValueAtTime(a.j.gain.value, a.g.currentTime),
        a.j.gain.exponentialRampToValueAtTime(.01, a.g.currentTime + 1))
    };
    X.prototype.stop = function(a) {
        fi(this);
        if (void 0 !== a) {
            if (this.H[a]) {
                try {
                    this.H[a].node.stop(0)
                } catch (c) {}
                var b = (1E3 * this.g.currentTime - this.H[a].Mc) % this.o;
                delete this.H[a];
                return [b]
            }
            return []
        }
        a = [];
        for (b in this.H)
            a = a.concat(this.stop(b));
        return a
    }
    ;
    var ji = document.createElement("audio")
      , ki = "function" == za(ji.canPlayType) && "" != ji.canPlayType("audio/mpeg") ? ".mp3" : ".ogg"
      , li = function(a, b) {
        Ka.call(this, a + b + ki);
        this.H = this.v = null;
        this.g = 0
    };
    q(li, Ka);
    li.prototype.preload = function(a, b) {
        var c = this
          , d = new Promise(function(f) {
            La(c, f)
        }
        );
        a && La(this, a);
        if (0 != this.g)
            return Promise.resolve();
        if (!this.H)
            return Promise.reject();
        var e = new XMLHttpRequest;
        e.open("GET", this.o, !0);
        e.responseType = "arraybuffer";
        e.onload = function() {
            c.H.decodeAudioData(e.response, function(f) {
                f && (c.v = f,
                c.g = 3,
                c.j())
            });
            c.g = 2
        }
        ;
        b && (e.onprogress = function(f) {
            f.lengthComputable && b(f.loaded / f.total)
        }
        );
        e.send();
        this.g = 1;
        return d
    }
    ;
    var Y = function() {
        Yh.call(this, Y.j, Y.g)
    };
    q(Y, Yh);
    Y.j = {};
    Y.j.Ac = new li("","sounds");
    var ei = Y.j;
    Y.g = {};
    Y.g.yc = new X(0,403.333007812);
    Y.g.Nc = new X(1403.33300781,14328.3330078);
    Y.g.Oc = new X(16731.6679688,1111.66699219);
    Y.g.Pc = new X(18843.3320312,260);
    Y.g.Qc = new X(20103.3320312,1436.66699219);
    Y.g.Rc = new X(22540,4005);
    Y.g.Sc = new X(27545,4E3);
    Y.g.Tc = new X(32545,4E3);
    Y.g.Uc = new X(37545,938.333007812);
    Y.g.Vc = new X(39483.3320312,1170);
    Y.g.Wc = new X(41653.3320312,3970);
    Y.g.Xc = new X(46623.3320312,710);
    Y.g.Yc = new X(48333.3320312,4088.33300781);
    Y.g.Zc = new X(53421.6679688,28E3);
    Y.g.$c = new X(82421.6640625,2148.33300781);
    Y.g.hd = new X(85570,6336.66699219);
    Y.g.jd = new X(92906.6640625,4185);
    Y.g.kd = new X(98091.6640625,3788.33300781);
    Y.g.ld = new X(102880,3911.66699219);
    Y.g.nd = new X(107791.65625,4366.66699219);
    Y.g.od = new X(113158.34375,3588.33300781);
    Y.g.qd = new X(117746.65625,3353.33300781);
    Y.g.rd = new X(122100,3538.33300781);
    Y.g.sd = new X(126638.34375,2758.33300781);
    Y.g.ud = new X(130396.65625,15E3);
    Y.g.zc = new X(146396.671875,1080);
    Y.g.vd = new X(148476.671875,1308.33300781);
    Y.g.wd = new X(150785,650);
    Y.g.xd = new X(152435,995);
    Y.g.yd = new X(154430,933.333007812);
    Y.g.zd = new X(156363.328125,1013.33300781);
    ya(Y);
    var W = Y;
    var mi = function() {
        D.call(this);
        this.i = new Map
    };
    q(mi, D);
    mi.prototype.Aa = function(a) {
        for (var b = n(this.i.keys()), c = b.next(); !c.done; c = b.next()) {
            c = c.value;
            var d = this.i.get(c);
            0 < d && this.i.set(c, d - a)
        }
    }
    ;
    var ni = new mi
      , oi = Ug.ka().g;
    E(ni, oi);
    var pi = null
      , qi = function(a) {
        3 == a ? (.5 > Math.random() ? W.g.yd : W.g.zd).play() : 2 == a ? W.g.xd.play() : W.g.wd.play()
    }
      , ri = function(a, b) {
        var c = 0 > b ? 0 : 1;
        if (!(ni.i.has(c) && 0 < ni.i.get(c))) {
            var d = a.g;
            pi || (pi = d.createDynamicsCompressor(),
            pi.connect(d.destination),
            a.T = pi);
            if (d.createStereoPanner) {
                var e = d.createStereoPanner();
                e.pan.setValueAtTime(b, d.currentTime);
                a.i = e
            } else
                d.createPanner && (e = d.createPanner(),
                e.positionX ? e.positionX.setValueAtTime(b, d.currentTime) : e.setPosition(b, 0, 0),
                a.i = e);
            gi(a);
            a.j && a.j.gain.setValueAtTime(.3, a.g.currentTime);
            ni.i.set(c, a.o - 100);
            a.play()
        }
    }
      , si = [W.g.kd, W.g.ld, W.g.jd, W.g.nd, W.g.od, W.g.qd, W.g.rd, W.g.sd]
      , ti = Math.floor(Math.random() * si.length)
      , ui = [W.g.ud, W.g.Zc, W.g.Nc]
      , vi = Math.floor(Math.random() * ui.length)
      , hi = null
      , wi = function() {
        hi && (ii(),
        setTimeout(function() {
            hi.stop();
            hi = null
        }, 1E3))
    };
    var Bi = function(a) {
        D.call(this, 0, 0, 0);
        this.ha = 0;
        this.v = a;
        this.S = new V(this.v.Da);
        F(this.S, 1.8);
        this.Ka = this.v.bc || 0;
        this.Ca = this.v.Cc || 0;
        this.ya = new D;
        this.ya.j(this.Ka, this.Ca);
        E(this.ya, this);
        E(this.S, this.ya);
        this.V = xi(this);
        E(this.V, this);
        a = .8 * this.V.H().height / this.S.hb;
        gh(this.S, 0, a);
        this.Ba = yi(this, a);
        E(this.Ba, this.S);
        this.W = this.$ = null;
        this.v.Dc && (this.$ = yi(this, a, !0),
        E(this.$, this.S),
        this.W = xi(this, !0),
        E(this.W, this));
        this.Ea = new ch(this.S.H().width / 2);
        E(this.Ea, this);
        this.i = new Rh;
        E(this.i, this);
        a = this.i;
        a.Ca = this.S.H().width * (this.v.Fd || .1);
        a.j(-((a.Ea ? -1 : 1) * a.Ca), .5);
        this.o = new I;
        E(this.o, this);
        this.wa = !0;
        this.ta = this.U = 0;
        a = !!this.v.lc;
        zi(this, a);
        this.j(a ? Bd.j() : Ad.j());
        a = new I;
        E(a, this);
        Ai(this, a, this.Ba);
        this.$ && (a = new I,
        E(a, this),
        Ai(this, a, this.$))
    };
    q(Bi, D);
    var yi = function(a, b, c) {
        c = void 0 === c ? !1 : c;
        var d = new V(Af);
        S(d, 0, .5);
        U(d, Ci, Ci);
        gh(d, (c ? -1 : 1) * a.v.Ia * tg, b + a.v.Ja * tg);
        return d
    }
      , xi = function(a, b) {
        b = void 0 === b ? !1 : b;
        var c = new Di;
        a.v.Ic && gh(c, (b ? -1 : 1) * a.v.Ic * tg, 0);
        return c
    }
      , Ai = function(a, b, c) {
        J(b, 1E3 + Math.floor(1E4 * Math.random()), function() {
            T(c, vf);
            U(c, Ci, Ci)
        });
        J(b, 200, function() {
            T(c, Af);
            U(c, Ci, Ci);
            Ai(a, b, c)
        })
    }
      , Fi = function(a) {
        a.S.j(0, 0);
        Ei(a.V);
        a.W && Ei(a.W)
    }
      , Hi = function(a) {
        Gi(a.V);
        a.W && Gi(a.W)
    }
      , Ji = function(a) {
        K(a.o, new P(a,28E3 / 26.8 * 2,Cd,{
            Ma: Qg,
            Ra: function() {
                Ii(a, 9);
                jg(a)
            }
        }));
        J(a.o, 28E3 / 26.8)
    }
      , Ki = function(a, b) {
        var c = 1 == a.U ? Qg : Pg;
        rg(a.o, new P(a,28E3 / 26.8,zd[a.U - 1],{
            Ma: b ? c : Tg,
            Ra: function() {
                Ii(a, 5)
            }
        }))
    }
      , zi = function(a, b) {
        a.i && a.i.o(b);
        a.S.o(b);
        a.ya.j((b ? -1 : 1) * a.Ka);
        a.V.o(b);
        a.W && a.W.o(b);
        a.Ba.o(b);
        a.$ && a.$.o(b)
    }
      , Ii = function(a, b) {
        a.ha = b;
        b = !!a.v.lc;
        switch (a.ha) {
        case 10:
            jg(a.i);
            a.i = null;
            break;
        case 0:
            Sh(a.i, 0);
            zi(a, b);
            Fi(a);
            break;
        case 8:
            Hi(a);
            zi(a, b);
            a.j(18.39 * (b ? 1 : -1) / 1.5, 0, Ad.g);
            rg(a.o, new P(a,1E3,b ? Bd.j() : Ad.j()));
            J(a.o, 0, function() {
                return Ii(a, 0)
            });
            Sh(a.i, 0);
            break;
        case 3:
            Hi(a);
            zi(a, 2 == a.U || 3 == a.U);
            break;
        case 5:
            Fi(a);
            a.o.o = [];
            break;
        case 1:
            Fi(a),
            a.V.setLoop(!1),
            a.W && a.W.setLoop(!1),
            Sh(a.i, 1)
        }
    }
      , Li = function(a, b) {
        a.i && (a.i.j(ud(a.g, a.i.g)),
        E(a.i, a.va),
        Th(a.i, b),
        a.i = null)
    }
      , Mi = function(a) {
        Ii(a, 2);
        Sh(a.i, 2);
        a.wa = !1;
        sg(a.o, Uh, function() {
            return a.wa = !0
        });
        var b, c = new Promise(function(d) {
            return b = d
        }
        );
        sg(a.o, 84, function() {
            return b()
        });
        return c
    }
      , Ni = function(a) {
        return !(3 == a.ha || 5 == a.ha || !a.wa)
    }
      , Oi = function(a) {
        J(a.o, Uh - 84, function() {
            2 == a.ha && Ii(a, 0)
        })
    }
      , Pi = function(a) {
        J(a.o, Uh - 84, function() {
            return Ii(a, 1)
        })
    };
    Bi.prototype.Aa = function(a) {
        D.prototype.Aa.call(this, a);
        3 == this.ha || 8 == this.ha ? (this.ta += a,
        this.S.j(0, -Math.abs(.1 * Math.sin(this.ta / 100)))) : 5 != this.ha && 0 != this.ha && 1 != this.ha || this.S.j(0, .1 * -Math.abs(Math.sin(ih(this.V) / cg.length * Math.PI)))
    }
    ;
    var Si = function(a, b, c) {
        c = void 0 === c ? function() {}
        : c;
        a.o.i = [];
        a.U++;
        Ii(a, 3);
        Li(a, b);
        ri(W.g.zc, 2 >= a.U ? .7 : -.7);
        var d = 4 <= a.U;
        d ? Ji(a) : Ki(a, b);
        J(a.o, 0, function() {
            d && ri(W.g.zc, .7);
            c(d)
        });
        return d
    }
      , Di = function() {
        V.call(this, cg);
        hh(this, !0);
        this.tb = !1;
        U(this, 1.5, 1);
        this.Fa = 1
    };
    q(Di, V);
    var Ei = function(a) {
        T(a, cg);
        U(a, 1.5, 1);
        a.setLoop(!0);
        hh(a, !0)
    }
      , Gi = function(a) {
        T(a, eg);
        U(a, 1.5, 1);
        a.setLoop(!0);
        hh(a, !0)
    }
      , Ci = 51 * tg;
    var Ti = function(a) {
        Oh.call(this, [].concat(la(fd), [Tc]), a.g.j());
        this.o(0 > a.i.i.x);
        U(this, 4, 4);
        S(this, 0, 0);
        hh(this, !0);
        this.setLoop(!1)
    };
    q(Ti, Oh);
    Ti.prototype.Aa = function(a) {
        Oh.prototype.Aa.call(this, a);
        this.S = .8 - ih(this) / 7 * .3;
        F(this, 1 + ih(this) / 7 * .8);
        6 == this.$ && jg(this)
    }
    ;
    var Vi = function(a) {
        D.call(this);
        this.i = a;
        this.v = 3;
        a = Ui.get(this.v);
        this.i.j(a.Ha);
        zg(this.i, a.pitch);
        Ag(this.i, a.yaw);
        this.o = new I;
        E(this.o, this)
    };
    q(Vi, D);
    var Wi = function(a, b) {
        4 == b && yg(a.i) && (b = 5);
        var c = Ui.get(b);
        a.o.i = [];
        if (4 == b || 5 == b)
            rg(a.o, [new P(a.i,700,c.Ha,{
                Ma: Og
            }), new O(700,Gb(a.i.v),c.pitch,function(f) {
                return zg(a.i, f)
            }
            ,{
                Ma: Og
            })]);
        else if (1 == b)
            K(a.o, new O(800,Gb(a.i.o),2,function(f) {
                return Ag(a.i, f)
            }
            ,{
                Ma: Og
            })),
            sg(a.o, 800, function() {
                K(a.o, new O(2E3,Gb(a.i.o),c.yaw,function(f) {
                    return Ag(a.i, f)
                }
                ,{
                    Ma: Og
                }))
            }),
            rg(a.o, [new P(a.i,2E3,c.Ha,{
                Ma: Og
            }), new O(2E3,Gb(a.i.v),c.pitch,function(f) {
                return zg(a.i, f)
            }
            ,{
                Ma: Og
            })]);
        else if (2 == b)
            rg(a.o, [new P(a.i,1700,c.Ha,{
                Ma: Sg
            }), new O(1700,Gb(a.i.v),c.pitch,function(f) {
                return zg(a.i, f)
            }
            ,{
                Ma: Sg
            })]);
        else if (0 == b) {
            var d = 2 == a.v ? 1700 : 3 == a.v ? 3E3 : 700
              , e = 2 == a.v ? Sg : Og;
            rg(a.o, [new P(a.i,d,c.Ha,{
                Ma: e
            }), new O(d,Gb(a.i.v),c.pitch,function(f) {
                return zg(a.i, f)
            }
            ,{
                Ma: e
            }), new O(d,Gb(a.i.o),c.yaw,function(f) {
                return Ag(a.i, f)
            }
            ,{
                Ma: e
            })])
        }
        a.v = b;
        return new Promise(function(f) {
            return J(a.o, 0, f)
        }
        )
    }
      , Ui = new Map([[3, {
        Ha: new r(-2.5,8.5,-10),
        pitch: 14.05,
        yaw: 5.25
    }], [0, {
        Ha: new r(0,5,-3.6),
        pitch: 15.4,
        yaw: 0
    }], [2, {
        Ha: new r(0,5,-3.6),
        pitch: 15.4,
        yaw: 0
    }], [4, {
        Ha: new r(0,9.2,-10.2),
        pitch: 15.55,
        yaw: 0
    }], [5, {
        Ha: new r(0,9.2,-15.2),
        pitch: 15.55,
        yaw: 0
    }], [1, {
        Ha: new r(16.3,13.6,-27.2),
        pitch: 10.3,
        yaw: -18
    }]]);
    var Zi = function(a, b, c, d) {
        d = void 0 === d ? !1 : d;
        N.call(this, void 0 === a ? 0 : a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.$ = 0;
        this.U = d ? ag : $f;
        this.V = .1;
        this.i = [new V(this.U[0],-1.5 - 3 * this.V), new V(this.U[0]), new V(this.U[0],1.5 + 3 * this.V)];
        a = n(this.i);
        for (b = a.next(); !b.done; b = a.next())
            E(b.value, this);
        S(this.i[0], -.5, 0);
        S(this.i[1], 0, 0);
        S(this.i[2], .5, 0);
        this.o = 3;
        Xi(this, this.o);
        Yi(this, this.$)
    };
    q(Zi, N);
    Zi.prototype.v = function(a) {
        N.prototype.v.call(this, a);
        for (var b = n(this.i), c = b.next(); !c.done; c = b.next())
            c.value.v(a)
    }
    ;
    var $i = function(a) {
        a.V = .05;
        Xi(a, a.o)
    }
      , Xi = function(a, b) {
        a.o = b;
        for (var c = n(a.i), d = c.next(); !d.done; d = c.next())
            U(d.value, b);
        a.i[0].j(.5 * -a.o - a.o * a.V);
        a.i[2].j(.5 * a.o + a.o * a.V)
    }
      , Yi = function(a, b) {
        a.$ = Eb(b, 0, 999);
        T(a.i[2], a.U[Math.floor(a.$ % 10)]);
        T(a.i[1], a.U[Math.floor(a.$ / 10 % 10)]);
        T(a.i[0], a.U[Math.floor(a.$ / 100 % 10)]);
        Xi(a, a.o)
    };
    var aj = function() {
        M.call(this);
        var a = this;
        this.V = new M;
        this.V.Oa = function(b) {
            b.setTransform(1, 0, 0, 1, 0, 0);
            b.fillStyle = "rgba(0, 0, 0, 0.3)";
            b.globalAlpha = a.V.S;
            b.fillRect(0, 0, b.canvas.width, b.canvas.height)
        }
        ;
        E(this.V, this);
        this.i = new Oh(Vc,0,120,0);
        this.i.v(!1);
        U(this.i, 380);
        S(this.i, 0, .5);
        E(this.i, this);
        this.$ = new V(Qf,0,110,0);
        this.$.v(!1);
        U(this.$, 170);
        E(this.$, this);
        this.U = new Zi(0,30,0);
        this.U.v(!1);
        Xi(this.U, 56);
        $i(this.U);
        E(this.U, this);
        this.v = new Zi(0,85,0,!0);
        this.v.v(!1);
        Xi(this.v, 27);
        $i(this.v);
        E(this.v, this);
        this.o = new I;
        E(this.o, this)
    };
    q(aj, M);
    var bj = function(a, b, c) {
        a.o.i = [];
        a.T = !0;
        100 <= b ? T(a.i, dd) : T(a.i, gd[Math.floor(Math.random() * gd.length)]);
        U(a.i, 380);
        Yi(a.U, b);
        c && Yi(a.v, c);
        Hg(a, 0);
        J(a.o, 1E3, function() {
            K(a.o, Ph(a, 600))
        })
    }
      , cj = function(a) {
        a.o.i = [];
        rg(a.o, Qh(a, 500))
    }
      , ej = function(a) {
        return "/logos/2019/july4th19/r6/share/" + dj.get(a.i.ta)
    }
      , dj = new Map([[dd, "share_bonus.png"], [Vc, "share_01.png"], [Wc, "share_02.png"], [Xc, "share_03.png"], [Yc, "share_04.png"], [Zc, "share_05.png"], [$c, "share_06.png"], [ad, "share_07.png"], [bd, "share_08.png"], [cd, "share_09.png"]]);
    var fj = function() {
        this.g = this.j = 0
    };
    var hj = function(a) {
        D.call(this, a);
        a = new Q(new r(0,0,-18.39),[new r(-.9,0,0), new r(-.9,0,.9), new r(.9,0,.9), new r(.9,0,0), new r(0,0,-.9), new r(-.9,0,0)],{
            fillStyle: "FloralWhite"
        });
        var b = new Q(new r(18.39,0,0),bh(),{
            fillStyle: "FloralWhite"
        })
          , c = new Q(new r(0,0,18.39),bh(),{
            fillStyle: "FloralWhite"
        })
          , d = new Q(new r(-18.39,0,0),bh(),{
            fillStyle: "FloralWhite"
        })
          , e = new r(b.g.x + 2,0,b.g.g)
          , f = new r(c.g.x,0,c.g.g + 2)
          , g = new r(d.g.x - 2,0,d.g.g)
          , h = new r(a.g.x,0,a.g.g - 2)
          , k = new Q(new r(0,0,0),[g, h, e, f],{
            fillStyle: "rgba(0, 0, 0, 0.2)"
        });
        F(k, 1.02);
        E(k, this);
        k = new Q(new r(0,0,0),[g, h, e, f],{
            fillStyle: "#e07272"
        });
        E(k, this);
        for (k = 1; 20 > k; k += 2) {
            var l = z(h, e, 1 * k / 21)
              , p = z(h, e, 1 * (k + 1) / 21)
              , t = z(g, f, 1 * (k + 1) / 21)
              , B = z(g, f, 1 * k / 21)
              , G = new Q(new r(0,0,0),[l, p, z(p, t, .5), z(B, l, .5)],{
                fillStyle: "#fff"
            });
            G.S = .2;
            E(G, this);
            l = new Q(new r(0,0,0),[z(l, B, .5), z(p, t, .5), t, B],{
                fillStyle: "#fff"
            });
            l.S = .2;
            E(l, this)
        }
        for (k = 1; 20 > k; k += 2)
            l = z(e, f, 1 * k / 21),
            p = z(e, f, 1 * (k + 1) / 21),
            t = z(h, g, 1 * (k + 1) / 21),
            B = z(h, g, 1 * k / 21),
            G = new Q(new r(0,0,0),[l, p, z(p, t, .5), z(B, l, .5)],{
                fillStyle: "#fff"
            }),
            G.S = .2,
            E(G, this),
            l = new Q(new r(0,0,0),[z(l, B, .5), z(p, t, .5), t, B],{
                fillStyle: "#fff"
            }),
            l.S = .2,
            E(l, this);
        e = new Q(new r(0,0,0),[a.g, ud(a.g, new r(.4,0,0)), ud(b.g, new r(.4,0,0)), b.g],{
            fillStyle: "#e07272"
        });
        f = new Q(new r(0,0,0),[b.g, ud(b.g, new r(0,0,.4)), ud(c.g, new r(0,0,.4)), c.g],{
            fillStyle: "#e07272"
        });
        g = new Q(new r(0,0,0),[c.g, ud(c.g, new r(0,0,.4)), ud(d.g, new r(0,0,.4)), d.g],{
            fillStyle: "#e07272"
        });
        h = new Q(new r(0,0,0),[d.g, ud(d.g, new r(-.4,0,0)), ud(a.g, new r(-.4,0,0)), a.g],{
            fillStyle: "#e07272"
        });
        E(e, this);
        E(f, this);
        E(g, this);
        E(h, this);
        g = new r(-18.39,0,0);
        h = new r(-91.95,0,73.56);
        e = new r(18.39,0,0);
        f = new r(91.95,0,73.56);
        g = new Q(new r(0,0,0),[g, z(g, h, .33), z(g, h, .66), h],{
            strokeStyle: "#e07272",
            lineWidth: .25
        });
        E(g, this);
        e = new Q(new r(0,0,0),[e, z(e, f, .33), z(e, f, .66), f],{
            strokeStyle: "#e07272",
            lineWidth: .25
        });
        E(e, this);
        E(a, this);
        E(b, this);
        E(c, this);
        E(d, this);
        b = new D(0,1.5,0);
        E(b, this);
        a = gj(dg, b, 4.5, 94, .23 * Math.PI, 1.25 * Math.PI / 3, 6, !1, .3);
        b = gj(dg, b, 4.5, 94, 1.75 * Math.PI / 3, .77 * Math.PI, 6, !1, .3);
        this.o = [].concat(la(a), la(b));
        a = -.5 * Math.PI;
        b = 1.5 * Math.PI - a;
        for (c = 0; 16 > c; c++)
            d = 92 * Math.cos(a + (c + 1.01) / 16 * b),
            e = 92 * Math.sin(a + (c + 1.01) / 16 * b),
            f = 92 * Math.cos(a + c / 16 * b),
            g = 92 * Math.sin(a + c / 16 * b),
            d = new Q(new r(0,0,0),[new r(d,0,e), new r(f,0,g), new r(f,3.4,g), new r(d,3.4,e)],{
                fillStyle: "#3261A5"
            }),
            E(d, this);
        a = new D;
        E(a, this);
        gj([Ef, Ff, Gf], a, 6, 82, -Math.PI / 8, .2 * Math.PI, 14, !0);
        gj([Ef, Ff, Gf], a, 6, 82, .8 * Math.PI, 9 * Math.PI / 8, 14, !0);
        w.ka().addListener(this);
        this.i = new I;
        E(this.i, this)
    };
    q(hj, D);
    var gj = function(a, b, c, d, e, f, g, h, k) {
        h = void 0 === h ? !1 : h;
        var l = [];
        d = ah(d, e, f, g);
        hb(d, function(p, t) {
            return t.g - p.g
        });
        d = n(d);
        for (e = d.next(); !e.done; e = d.next())
            e = e.value,
            f = a,
            h && (f = a[Math.floor(Math.random() * a.length)],
            e.x += -.3 + .3 * Math.random(),
            e.g += -.3 + .3 * Math.random()),
            e = new V(f,e),
            F(e, c + (h ? -.3 + .3 * Math.random() : 0)),
            k && (e.ac = k),
            e.setLoop(!1),
            l.push(e),
            E(e, b);
        return l
    };
    hj.prototype.Za = function(a) {
        if (1 == a) {
            this.i.o = [];
            a = {};
            for (var b = n(this.o), c = b.next(); !c.done; a = {
                Gb: a.Gb
            },
            c = b.next())
                a.Gb = c.value,
                c = 15 * Math.max(0, Math.abs(H(a.Gb).x) - 5),
                sg(this.i, c, function(d) {
                    return function() {
                        return hh(d.Gb, !0)
                    }
                }(a))
        }
    }
    ;
    var jj = function(a, b) {
        V.call(this, gg, b);
        F(this, 1.9);
        jh(this);
        this.i = a;
        gh(this, 0, .1);
        this.Ea = 0;
        this.La = new I;
        E(this.La, this);
        b = new V(Nf);
        b.Fa = 1;
        E(b, this);
        this.Ca = new V(bg);
        this.Ca.T = !1;
        this.Ca.j(0, 1.3, 0);
        E(this.Ca, this);
        this.Ga = 0;
        this.V = [].concat(la(ij));
        this.Hc = 0;
        this.setLoop(!1);
        S(this, 0, -.4);
        a.Fa = 1;
        w.ka().addListener(this)
    };
    q(jj, V);
    jj.prototype.Za = function(a) {
        22 == a && (this.Ga = 0,
        this.V = [].concat(la(ij)))
    }
    ;
    var kj = function(a) {
        var b = new r(H(a).x - 1.1,H(a).y + 1.65,H(a).g + .1)
          , c = ih(a);
        if (1 != a.Ea)
            return b;
        3 <= c && 5 > c ? b.x -= .1 : 5 <= c && 9 > c ? (b.x -= .1,
        b.y += .6 * Eb((c - 5) / 4, 0, 1)) : 9 <= c && 12 > c ? (b.x -= .1,
        b.y += .6) : 12 <= c && 19 > c ? (b.x = -Math.cos(1.9 * Eb((c - 12) / 7, 0, 1)),
        b.y += .5 + 1.9 * -Math.sin(1.4 * Eb((c - 12) / 7, 0, 1))) : 19 <= c && (b.x += 2 * (1 - Eb((c - 20) / 2, 0, 1)),
        b.y -= 1.2 * (1 - Eb((c - 20) / 2, 0, 1)));
        return b
    };
    jj.prototype.pitch = function() {
        var a = this
          , b = this.V[Math.floor(Math.random() * this.V.length)]
          , c = lj.get(b);
        Gh(this.i, 6);
        this.Ea = this.i.Fa = 1;
        this.Hc != b && (T(this.Ca, c.kb),
        this.Ca.T = !0,
        hh(this.Ca, !0));
        this.Hc = b;
        T(this, c.Ya);
        J(this.La, 400, function() {
            a.Ca.T = !1;
            hh(a, !0)
        });
        J(this.La, 42 * (c.Ya.length - 2), function() {
            a.i.Fa = 0;
            T(a, c.Da);
            a.Ea = 2;
            a.i.pitch(b);
            mj.get(b).play();
            a.Ga++;
            2 == a.Ga ? (a.V.push(4),
            a.V.push(3)) : 5 == a.Ga ? (a.V.push(2),
            a.V.push(5)) : 12 == a.Ga ? a.V.push(1) : 15 == a.Ga ? (a.V.push(3),
            a.V.push(2),
            a.V.push(5)) : 30 == a.Ga && a.V.push(1)
        });
        J(this.La, 500, function() {
            a.Ea = 0;
            T(a, c.Ya);
            hh(a, !1);
            a.reset()
        })
    }
    ;
    jj.prototype.Aa = function(a) {
        V.prototype.Aa.call(this, a);
        3 == this.i.o && 2.7 > H(this.i).y && 1.1 > kd(lg(this.i), lg(this)) ? nj(this) : (3 == this.Ea || 1 == this.Ea) && this.i.j(kj(this))
    }
    ;
    var nj = function(a, b) {
        b = void 0 === b ? !0 : b;
        var c = a.i.o;
        Gh(a.i, 6);
        a.i.Fa = 1;
        var d = function() {
            return a.Ea = 3
        };
        b ? K(a.La, new P(a.i,200,kj(a),{
            Ra: d
        })) : (a.i.j(kj(a)),
        6 != c && (a.i.S = 0,
        K(a.La, Ph(a.i, 200))),
        d())
    }
      , ij = [0]
      , lj = new Map([[0, {
        Ya: gg,
        kb: bg,
        Da: [1, 20, 27932, 164, 151]
    }], [4, {
        Ya: [[1, 20, 6728, 164, 151], [1, 20, 6899, 164, 151], [1, 20, 7070, 164, 151], [1, 20, 7241, 164, 151], [1, 20, 7412, 164, 151], [1, 20, 7583, 164, 151], [1, 20, 7754, 164, 151], [1, 20, 7925, 164, 151], [1, 20, 8096, 164, 151], [1, 20, 8267, 164, 151], [1, 20, 8438, 164, 151], [1, 20, 8609, 164, 151], [1, 20, 8780, 164, 151], [1, 20, 8951, 164, 151], [1, 20, 9122, 164, 151], [1, 20, 9293, 164, 151], [1, 20, 9464, 164, 151], [1, 20, 9635, 164, 151], [1, 20, 9806, 164, 151], [1, 20, 9977, 164, 151], [1, 20, 10148, 164, 151], [1, 20, 10319, 164, 151], [1, 20, 10490, 164, 151], [1, 20, 10661, 164, 151]],
        kb: [[1, 20, 20, 109, 66], [1, 20, 106, 109, 66], [1, 20, 192, 109, 66], [1, 20, 278, 109, 66], [1, 20, 364, 109, 66], [1, 20, 450, 109, 66], [1, 20, 536, 109, 66], [1, 20, 622, 109, 66], [1, 20, 708, 109, 66], [1, 20, 794, 109, 66], [1, 20, 880, 109, 66], [1, 20, 966, 109, 66], [1, 20, 1052, 109, 66]],
        Da: [1, 20, 10832, 164, 151]
    }], [3, {
        Ya: [[1, 20, 11003, 164, 151], [1, 20, 11174, 164, 151], [1, 20, 11345, 164, 151], [1, 20, 11516, 164, 151], [1, 20, 11687, 164, 151], [1, 20, 11858, 164, 151], [1, 20, 12029, 164, 151], [1, 20, 12200, 164, 151], [1, 20, 12371, 164, 151], [1, 20, 12542, 164, 151], [1, 20, 12713, 164, 151], [1, 20, 12884, 164, 151], [1, 20, 13055, 164, 151], [1, 20, 13226, 164, 151], [1, 20, 13397, 164, 151], [1, 20, 13568, 164, 151], [1, 20, 13739, 164, 151], [1, 20, 13910, 164, 151], [1, 20, 14081, 164, 151], [1, 20, 14252, 164, 151], [1, 20, 14423, 164, 151], [1, 20, 14594, 164, 151], [1, 20, 14765, 164, 151], [1, 20, 14936, 164, 151]],
        kb: [[1, 20, 1138, 109, 66], [1, 20, 1224, 109, 66], [1, 20, 1310, 109, 66], [1, 20, 1396, 109, 66], [1, 20, 1482, 109, 66], [1, 20, 1568, 109, 66], [1, 20, 1654, 109, 66], [1, 20, 1740, 109, 66], [1, 20, 1826, 109, 66], [1, 20, 1912, 109, 66], [1, 20, 1998, 109, 66], [1, 20, 2084, 109, 66], [1, 20, 2170, 109, 66]],
        Da: [1, 20, 15107, 164, 151]
    }], [2, {
        Ya: [[1, 20, 28103, 164, 151], [1, 20, 28274, 164, 151], [1, 20, 28445, 164, 151], [1, 20, 28616, 164, 151], [1, 20, 28787, 164, 151], [1, 20, 28958, 164, 151], [1, 20, 29129, 164, 151], [1, 20, 29300, 164, 151], [1, 20, 29471, 164, 151], [1, 20, 29642, 164, 151], [1, 20, 29813, 164, 151], [1, 20, 29984, 164, 151], [1, 20, 30155, 164, 151], [1, 20, 30326, 164, 151], [1, 20, 30497, 164, 151], [1, 20, 30668, 164, 151], [1, 20, 30839, 164, 151], [1, 20, 31010, 164, 151], [1, 20, 31181, 164, 151], [1, 20, 31352, 164, 151], [1, 20, 31523, 164, 151], [1, 20, 31694, 164, 151], [1, 20, 31865, 164, 151], [1, 20, 32036, 164, 151]],
        kb: [[1, 20, 5610, 109, 66], [1, 20, 5696, 109, 66], [1, 20, 5782, 109, 66], [1, 20, 5868, 109, 66], [1, 20, 5954, 109, 66], [1, 20, 6040, 109, 66], [1, 20, 6126, 109, 66], [1, 20, 6212, 109, 66], [1, 20, 6298, 109, 66], [1, 20, 6384, 109, 66], [1, 20, 6470, 109, 66], [1, 20, 6556, 109, 66], [1, 20, 6642, 109, 66]],
        Da: [1, 20, 32207, 164, 151]
    }], [5, {
        Ya: [[1, 20, 19553, 164, 151], [1, 20, 19724, 164, 151], [1, 20, 19895, 164, 151], [1, 20, 20066, 164, 151], [1, 20, 20237, 164, 151], [1, 20, 20408, 164, 151], [1, 20, 20579, 164, 151], [1, 20, 20750, 164, 151], [1, 20, 20921, 164, 151], [1, 20, 21092, 164, 151], [1, 20, 21263, 164, 151], [1, 20, 21434, 164, 151], [1, 20, 21605, 164, 151], [1, 20, 21776, 164, 151], [1, 20, 21947, 164, 151], [1, 20, 22118, 164, 151], [1, 20, 22289, 164, 151], [1, 20, 22460, 164, 151], [1, 20, 22631, 164, 151], [1, 20, 22802, 164, 151], [1, 20, 22973, 164, 151], [1, 20, 23144, 164, 151], [1, 20, 23315, 164, 151], [1, 20, 23486, 164, 151]],
        kb: [[1, 20, 2256, 109, 66], [1, 20, 2342, 109, 66], [1, 20, 2428, 109, 66], [1, 20, 2514, 109, 66], [1, 20, 2600, 109, 66], [1, 20, 2686, 109, 66], [1, 20, 2772, 109, 66], [1, 20, 2858, 109, 66], [1, 20, 2944, 109, 66], [1, 20, 3030, 109, 66], [1, 20, 3116, 109, 66], [1, 20, 3202, 109, 66], [1, 20, 3288, 109, 66]],
        Da: [1, 20, 23657, 164, 151]
    }], [1, {
        Ya: [[1, 20, 15278, 164, 151], [1, 20, 15449, 164, 151], [1, 20, 15620, 164, 151], [1, 20, 15791, 164, 151], [1, 20, 15962, 164, 151], [1, 20, 16133, 164, 151], [1, 20, 16304, 164, 151], [1, 20, 16475, 164, 151], [1, 20, 16646, 164, 151], [1, 20, 16817, 164, 151], [1, 20, 16988, 164, 151], [1, 20, 17159, 164, 151], [1, 20, 17330, 164, 151], [1, 20, 17501, 164, 151], [1, 20, 17672, 164, 151], [1, 20, 17843, 164, 151], [1, 20, 18014, 164, 151], [1, 20, 18185, 164, 151], [1, 20, 18356, 164, 151], [1, 20, 18527, 164, 151], [1, 20, 18698, 164, 151], [1, 20, 18869, 164, 151], [1, 20, 19040, 164, 151], [1, 20, 19211, 164, 151]],
        kb: [[1, 20, 3374, 109, 66], [1, 20, 3460, 109, 66], [1, 20, 3546, 109, 66], [1, 20, 3632, 109, 66], [1, 20, 3718, 109, 66], [1, 20, 3804, 109, 66], [1, 20, 3890, 109, 66], [1, 20, 3976, 109, 66], [1, 20, 4062, 109, 66], [1, 20, 4148, 109, 66], [1, 20, 4234, 109, 66], [1, 20, 4320, 109, 66], [1, 20, 4406, 109, 66]],
        Da: [1, 20, 19382, 164, 151]
    }]])
      , mj = new Map([[0, W.g.yc], [4, W.g.$c], [3, W.g.Qc], [2, W.g.Uc], [5, W.g.Vc], [1, W.g.Xc]]);
    var oj = function(a, b, c) {
        D.call(this, c.Ha.j());
        this.v = new V(Cf);
        jh(this.v);
        S(this.v, .03, -.55);
        E(this.v, this);
        this.U = c;
        this.W = 0;
        this.i = a;
        this.V = b;
        this.o = new V(fg);
        E(this.o, this);
        hh(this.o, !0);
        this.o.tb = !1;
        this.o.Fa = 1;
        U(this.o, .5 * this.v.H().width, .5 * this.v.H().width);
        F(this, 1.9);
        this.S = new I;
        E(this.S, this);
        this.ha = this.g.j()
    };
    q(oj, D);
    var pj = function(a, b) {
        a.S.i = [];
        a.W = b;
        switch (b) {
        case 3:
        case 1:
            T(a.o, eg);
            hh(a.o, !0);
            break;
        default:
            T(a.o, fg),
            hh(a.o, !0)
        }
        U(a.o, .5 * a.v.H().width, .5 * a.v.H().width)
    }
      , qj = function(a) {
        return new r(H(a).x + 1.1,H(a).y + .7,H(a).g)
    };
    oj.prototype.Aa = function(a) {
        D.prototype.Aa.call(this, a);
        if (0 == this.W)
            S(this.v, .03, -.55 + .1 * Math.max(0, (.5 - Math.abs(ih(this.o) / fg.length - .5)) / .5));
        else if (1 == this.W || 3 == this.W) {
            var b = vd(this.g, this.ha);
            .01 < qd(b) && this.o.o(0 > b.x)
        }
        this.ha = this.g.j();
        a: {
            b = this.i.ha.g - this.v.ha.g;
            2 < Math.abs(b) && T(this.v, 0 > b ? Df : Cf);
            if (2 == this.i.o && 2.7 >= H(this.i).y) {
                b = kd(lg(this.i), lg(this));
                if (1.1 > b) {
                    rj(this);
                    b = !0;
                    break a
                }
                b < 1.1 * 3 && (this.W = 1)
            }
            b = !1
        }
        if (!b && 1 == this.W) {
            b = H(this.i);
            var c = H(this)
              , d = this.i.i.i;
            if (2 > pd(b, c))
                b = b.j();
            else {
                c = lg(this);
                var e = this.i.U
                  , f = c;
                if (f instanceof jd) {
                    var g = f.y;
                    f = f.x
                } else
                    g = void 0;
                var h = e.g
                  , k = e.j
                  , l = e.i - e.g
                  , p = e.H - e.j;
                c = kd(c, Dh(e, Eb(((Number(f) - h) * (e.i - h) + (Number(g) - k) * (e.H - k)) / (l * l + p * p), 0, 1)));
                2.7 > b.y && 1.1 > c ? b = b.j() : (c /= 12,
                e = d.j().scale(c).add(b),
                2.7 < Math.max(0, b.y + d.y * c + -4.9 * Math.pow(c, 2)) && Lh(this.i) && (e = Lh(this.i)),
                b = e)
            }
            b.y = 0;
            .2 < pd(b, this.g) && (a = rd(vd(b, H(this))).scale(12 * a / 1E3).add(H(this)),
            92 > pd(a, A) && this.j(a))
        }
    }
    ;
    var rj = function(a) {
        Gh(a.i, 0);
        x(Eh, 9);
        pj(a, 2);
        rg(a.S, new P(a.i,200,qj(a)));
        J(a.S, 100, function() {
            return sj(a)
        })
    }
      , sj = function(a) {
        var b = a.i
          , c = H(a.V);
        Gh(b, 3);
        c = vd(c, H(b));
        var d = qd(c)
          , e = Math.pow(30, 4) - Math.pow(-9.8, 2) * Math.pow(d, 2);
        Ih(b, Mh(30, 0 > e ? 45 : -Gb(Math.atan((Math.pow(30, 2) + Math.sqrt(e)) / (-9.8 * d))), Gb(Math.atan2(c.g, c.x))));
        ri(W.g.yc, Eb(H(a).x / 10, -1, 1))
    }
      , tj = function(a, b) {
        b = void 0 === b ? !0 : b;
        var c = 2 == a.W;
        pj(a, 3);
        c && sj(a);
        c = a.U.Ha.j();
        b && !a.U.nb && (c.x += -3 + 6 * Math.random(),
        c.g += -3 + 6 * Math.random());
        b = pd(H(a), c);
        rg(a.S, new P(a,(800 + 200 * Math.random()) * b / 12,c,{
            Ra: function() {
                return pj(a, 0)
            }
        }))
    }
      , uj = [{
        Ha: new r(-18.39 * 1.8,0,A.g + 36.78),
        nb: !1
    }, {
        Ha: new r(0,0,A.g + 45.975),
        nb: !1
    }, {
        Ha: new r(34.941,0,A.g + 36.78),
        nb: !1
    }, {
        Ha: new r(16.39,0,A.g),
        nb: !0
    }, {
        Ha: new r(5,0,A.g + 18.39 - 1),
        nb: !0
    }, {
        Ha: new r(-8,0,A.g + 18.39 - 1),
        nb: !1
    }, {
        Ha: new r(-16.39,0,A.g),
        nb: !0
    }];
    var vj = function(a, b) {
        D.call(this);
        this.S = a;
        this.i = [];
        for (var c = n(uj), d = c.next(); !d.done; d = c.next())
            d = new oj(a,b,d.value),
            this.i.push(d),
            E(d, this);
        this.v = this.o = null;
        w.ka().addListener(this)
    };
    q(vj, D);
    vj.prototype.Za = function(a) {
        if (1 == a) {
            a = Lh(this.S);
            for (var b = this.S.U, c = Number.MAX_SAFE_INTEGER, d = n(this.i), e = d.next(); !e.done; e = d.next()) {
                e = e.value;
                lg(e);
                var f = pd(H(e), a);
                f < c && 0 <= a.x * H(e).x && (c = f,
                this.o = e)
            }
            c = Number.MAX_SAFE_INTEGER;
            d = n(this.i);
            for (e = d.next(); !e.done; e = d.next())
                e = e.value,
                e !== this.o && (f = kd(lg(e), Dh(b, .5)),
                f < c && (c = f,
                this.v = e));
            pj(this.o, 1);
            pj(this.v, 1);
            b = n(this.i);
            for (e = b.next(); !e.done; e = b.next())
                c = e.value,
                c !== this.o && c !== this.v && (c.S.i = [],
                e = z(H(c), a, .05 + .2 * Math.random()),
                d = pd(H(c), e),
                rg(c.S, new P(c,(800 + 200 * Math.random()) * d / 12,e)))
        } else if (3 == a || 2 == a)
            for (b = n(this.i),
            e = b.next(); !e.done; e = b.next())
                tj(e.value, 2 != a)
    }
    ;
    var wj = function(a, b) {
        this.x = a;
        this.y = b
    };
    Ia(wj, jd);
    wj.prototype.g = function() {
        return new wj(this.x,this.y)
    }
    ;
    var xj = function(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y)
    };
    wj.prototype.scale = jd.prototype.scale;
    wj.prototype.add = function(a) {
        this.x += a.x;
        this.y += a.y;
        return this
    }
    ;
    var yj = function(a, b, c) {
        this.Ha = a;
        this.j = b;
        this.H = void 0 === c ? 0 : c
    };
    yj.prototype.g = function() {}
    ;
    var zj = function(a, b, c, d) {
        yj.call(this, a, b);
        this.i = c;
        this.color = d
    };
    q(zj, yj);
    zj.prototype.g = function(a) {
        yj.prototype.g.call(this, a);
        a.beginPath();
        a.arc(this.Ha.x, -this.Ha.y, this.i, 0, 2 * Math.PI);
        a.lineTo(this.Ha.x, -this.Ha.y);
        a.closePath();
        a.fillStyle = this.color;
        a.fill()
    }
    ;
    var Aj = function(a, b, c, d, e) {
        yj.call(this, a, b);
        this.i = a.g();
        this.color = d;
        this.lineWidth = c;
        this.T = e
    };
    q(Aj, yj);
    Aj.prototype.g = function(a) {
        yj.prototype.g.call(this, a);
        var b = this.Ha.g()
          , c = this.T * (Math.min(xj(this.j), 30) + 10) / 10
          , d = this.Ha.g()
          , e = this.i;
        d.x -= e.x;
        d.y -= e.y;
        d = d.scale(1 / xj(d));
        a.beginPath();
        a.lineCap = "round";
        a.moveTo(b.x + d.x * c, -b.y - d.y * c);
        a.lineTo(b.x - d.x * c, -b.y + d.y * c);
        a.closePath();
        a.strokeStyle = this.color;
        a.lineWidth = this.lineWidth;
        a.stroke();
        this.i = this.Ha.g()
    }
    ;
    var Bj = function(a, b, c, d) {
        d = void 0 === d ? 1 : d;
        yj.call(this, a, b);
        this.i = c;
        this.scale = d
    };
    q(Bj, yj);
    Bj.prototype.g = function(a) {
        yj.prototype.g.call(this, a);
        var b = Zg.g()
          , c = b.Pb(this.i) * this.scale
          , d = b.jc(this.i) * this.scale;
        qf(b, this.i, a, this.Ha.x - c / 2, d / 2 - this.Ha.y, c, d, !1)
    }
    ;
    var Cj = function(a, b) {
        b = void 0 === b ? -9.8 : b;
        N.call(this, a);
        this.i = [];
        this.U = b
    };
    q(Cj, N);
    Cj.prototype.Aa = function(a) {
        N.prototype.Aa.call(this, a);
        for (var b = n(this.i), c = b.next(); !c.done; c = b.next()) {
            c = c.value;
            var d = xj(c.j);
            d = Math.min(1, c.H * d * d);
            var e = a / 1E3;
            c.Ha.add(c.j.g().scale(e));
            c.j.y += e * this.U;
            c.j.scale(1 - e * d)
        }
    }
    ;
    Cj.prototype.Oa = function(a) {
        N.prototype.Oa.call(this, a);
        for (var b = n(this.i), c = b.next(); !c.done; c = b.next())
            c.value.g(a)
    }
    ;
    var Dj = function(a, b, c, d) {
        var e = void 0 === d.mc ? 40 : d.mc
          , f = void 0 === d.qc ? 0 : d.qc
          , g = void 0 === d.type ? 0 : d.type
          , h = void 0 === d.color ? "white" : d.color
          , k = void 0 === d.nc ? .3 : d.nc
          , l = void 0 === d.tc ? .3 : d.tc
          , p = void 0 === d.lineWidth ? .2 : d.lineWidth
          , t = void 0 === d.Ad ? .3 : d.Ad
          , B = void 0 === d.Da ? null : d.Da;
        d = void 0 === d.Ed ? 1 : d.Ed;
        for (var G = 0; G < c; G++) {
            var L = f + (e - f) * Math.random()
              , R = G / c * Math.PI * 2 + .05 * (1 - 2 * Math.random());
            L = new wj(L * Math.cos(R),5 + L * Math.sin(R));
            switch (g) {
            case 0:
                a.i.push(new zj(b.g(),L,l + (k - l) * Math.random(),h));
                break;
            case 1:
                a.i.push(new Aj(b.g(),L,p,h,t));
                break;
            case 2:
                B && a.i.push(new Bj(b.g(),L,B,d))
            }
        }
    };
    var Ej = function(a) {
        return Ya(a, function(b) {
            return Ya(b, function(c) {
                return [null, "#fffcf4", "#1971ff", "#ff4c4c"][c]
            })
        })
    }([[2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 3, 0, 3, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 3, 0, 3, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 3, 0, 3, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0]])
      , Fj = function(a, b) {
        Cj.call(this, a);
        this.V = b;
        this.o = new Aj(new wj(0,0),new wj(4 - 8 * Math.random(),40 + 7 * Math.random()),.5,"#ffeacc",1);
        this.o.H = .02;
        this.i.push(this.o)
    };
    q(Fj, Cj);
    Fj.prototype.Aa = function(a) {
        Cj.prototype.Aa.call(this, a);
        a = n(this.i);
        for (var b = a.next(); !b.done; b = a.next())
            b = b.value,
            0 > b.Ha.y && bb(this.i, b);
        if (this.o && 10 > xj(this.o.j))
            switch (a = this.o.Ha,
            bb(this.i, this.o),
            this.o = null,
            b = ["#fffcf4", "#ff4c4c", "#1971ff"][Math.floor(3 * Math.random())],
            W.g.Yc.play(),
            this.V) {
            case 3:
                b = new wj(10,5);
                for (var c = Ej[0].length, d = Ej.length, e = 0; e < d; e++)
                    for (var f = e / d * 2 - 1, g = 0; g < c; g++) {
                        var h = Ej[e][g];
                        h && this.i.push(new zj(new wj(a.x,a.y),new wj((g / c * 2 - 1 + .2 * Math.random()) * b.x,-(f + .2 * Math.random()) * b.y + 10),.4,h))
                    }
                break;
            case 2:
                Dj(this, a, 15 + Math.round(3 * Math.random()), {
                    color: b,
                    type: 1,
                    lineWidth: .3
                });
                break;
            case 0:
                Dj(this, a, 15 + Math.round(3 * Math.random()), {
                    color: b,
                    mc: 40,
                    qc: 0,
                    nc: .6,
                    tc: .3
                });
                break;
            case 1:
                c = 25 + 7 * Math.random(),
                Dj(this, a, 20 + Math.round(3 * Math.random()), {
                    color: b,
                    mc: c,
                    qc: c,
                    nc: .5,
                    tc: .3
                })
            }
        0 == this.i.length && jg(this)
    }
    ;
    var Gj = function(a, b) {
        N.call(this);
        this.i = new I;
        E(this.i, this);
        this.o = a;
        this.U = b
    };
    q(Gj, N);
    var Hj = function(a) {
        for (var b = a.U / a.o, c = {}, d = 0; d < a.o; c = {
            Ub: c.Ub
        },
        d++)
            c.Ub = [0, 0, 1, 1, 2, 2, 3][Math.floor(7 * Math.random())],
            J(a.i, b * d, function(e) {
                return function() {
                    var f = new Fj(new r(40 - 80 * Math.random(),0,A.g + 92),e.Ub);
                    E(f, a)
                }
            }(c))
    };
    var Ij = w.ka()
      , Jj = function() {
        D.call(this);
        this.ta = this.$ = this.W = 0;
        this.v = new I;
        E(this.v, this);
        this.ha = new D;
        E(this.ha, this);
        this.i = new Bi(Xh());
        E(this.i, this.ha);
        this.V = [];
        this.o = new Fh;
        E(this.o, this.ha);
        this.ya = 0;
        this.U = new jj(this.o,new r(0,0,A.g));
        E(this.U, this.ha);
        this.S = null;
        this.o.j(kj(this.U));
        var a = new vj(this.o,this.U);
        E(a, this.ha);
        w.ka().addListener(this)
    };
    q(Jj, D);
    Jj.prototype.Za = function(a) {
        10 == a && (this.S = new V(Zf),
        this.S.T = !1,
        this.S.j(-70, 0, 50),
        F(this.S, 3),
        E(this.S, this))
    }
    ;
    var Lj = function(a) {
        2 != a.o.o && Ni(a.i) && (W.g.Pc.play(),
        Mi(a.i).then(function() {
            if (1 == a.W) {
                var b = a.o;
                H(b);
                H(a.i);
                var c = (H(b).g - H(a.i).g) / 3;
                if (1 >= Math.abs(c) && 1 == b.o) {
                    Gh(b, 2);
                    if (!(-1 > c || 1 < c)) {
                        b.V = null;
                        b.Ga = [H(b).j()];
                        b.Pa = 30;
                        var d = Math.pow(Math.max(.2, 1 - Math.abs(c)) * Nh[b.$], 1.9);
                        d = -1.3 * b.i.i.g * d + Math.abs(b.i.i.g) / 2 * (1 - d);
                        Ih(b, Mh(d, 40 < d ? 60 : 110, 90 + c / Math.abs(c) * 5 + 40 * c))
                    }
                    W.g.Oc.play();
                    x(w.ka(), 20, c);
                    b = !0
                } else
                    b = !1;
                b ? Kj(a, Lh(a.o)) : Pi(a.i)
            }
        }))
    }
      , Mj = function(a) {
        a.W = 1;
        Ii(a.i, 1);
        a.U.pitch()
    }
      , Kj = function(a, b) {
        Oi(a.i);
        b = pd(b, A);
        var c = 92 < b;
        x(Ij, 1, c ? 3.281 * b : 0);
        0 == th || 1 == th && c ? (J(a.v, 100, function() {
            return Nj(a, c)
        }),
        J(a.v, 300, function() {
            [W.g.Rc, W.g.Sc, W.g.Tc][Math.floor(3 * Math.random())].play()
        })) : J(a.v, 500, function() {
            return Oj(a)
        })
    }
      , Pj = function(a, b) {
        a.$++;
        b.v.Dc && (a.$++,
        sg(a.v, 300, function() {
            return x(w.ka(), 21)
        }));
        x(w.ka(), 21)
    }
      , Nj = function(a, b) {
        for (var c = {}, d = 0; d < a.V.length; c = {
            Hb: c.Hb
        },
        d++)
            c.Hb = a.V[d],
            Si(c.Hb, b, function(e) {
                return function(f) {
                    return f && Pj(a, e.Hb)
                }
            }(c)) && (a.V.splice(d, 1),
            d--);
        Si(a.i, b, function(e) {
            a.ta++;
            e || !b && 2 != a.o.o ? (e ? Pj(a, a.i) : a.V.push(a.i),
            a.i = null,
            Qj(a)) : Nj(a, b)
        })
    }
      , Oj = function(a) {
        a.W = 3;
        a.ya++;
        x(w.ka(), 2, a.ya);
        qi(a.ya);
        sg(a.v, 1E3, function() {
            return W.g.Wc.play()
        });
        J(a.v, 1500, function() {
            if (a.ya >= uh) {
                Wh.ka().reset();
                a.ya = 0;
                for (var b = n(a.V), c = b.next(); !c.done; c = b.next())
                    jg(c.value);
                a.V = [];
                a.i.o.i = [];
                Ii(a.i, 0);
                a.W = 5;
                x(w.ka(), 22);
                wi();
                hi = ui[vi++ % ui.length];
                hi.play(0, !0)
            } else
                Qj(a)
        })
    }
      , Qj = function(a) {
        a.W = 4;
        a.$ ? x(w.ka(), 4, a.$) : a.ta && x(w.ka(), 23, a.ta);
        a.$ = 0;
        a.ta = 0;
        x(w.ka(), 3);
        Rj(a);
        J(a.v, 0, function() {
            si[ti++ % si.length].play()
        });
        Sj(a);
        J(a.v, 1500, function() {
            3 == a.o.o ? Hh(a.o).then(function() {
                return Mj(a)
            }) : (nj(a.U, !1),
            Mj(a))
        })
    }
      , Rj = function(a) {
        if (a.S) {
            var b = a.S;
            a.S = null;
            var c = new I;
            J(a.v, 1E3, function() {
                b.T = !0;
                hh(b, !0);
                b.tb = !1;
                E(c, a)
            });
            for (var d = b.getDuration(), e = 12; 152 > e; e += 12)
                rg(c, new P(b,d,new r(-70 + e,0,50),{
                    Ma: Sg
                }));
            J(c, 0, function() {
                jg(c);
                jg(b)
            });
            J(a.v, 3E3, function() {})
        }
    }
      , Sj = function(a) {
        a.i || (J(a.v, 0, function() {
            a.i = new Bi(Xh());
            a.i.j(Ad.j());
            E(a.i, a.ha);
            Ii(a.i, 8)
        }),
        J(a.v, 1E3))
    }
      , Tj = function(a) {
        return 0 == a.W || 4 == a.W || 1 == a.W
    };
    Jj.prototype.Aa = function(a) {
        D.prototype.Aa.call(this, a);
        a = this.o;
        1 == a.o && H(a).g <= yd.g && (Gh(this.o, 4),
        Oj(this));
        this.i && (a = Math.abs(H(this.o).g - H(this.i).g),
        1 == this.o.o && 3 > a ? this.o.Fa = 5 : (2 == this.o.o || 0 == this.o.o) && 3 < a && (this.o.Fa = 0))
    }
    ;
    var Uj = function(a, b, c, d, e) {
        d = void 0 === d ? xa : d;
        e = void 0 === e ? !1 : e;
        N.call(this, a);
        this.setSize(b);
        this.ta = !1;
        this.v(!1);
        this.V = e;
        this.Ea = c;
        this.Ba = d;
        this.wa = !1
    };
    q(Uj, N);
    var Z = function(a, b) {
        (a.ta = b) || a.i(!1)
    };
    Uj.prototype.cancel = function() {
        this.i(!1, !1)
    }
    ;
    Uj.prototype.i = function(a, b) {
        if (a == this.wa)
            return !1;
        this.wa = a;
        (void 0 === b || b) && (a ? this.Ba() : this.Ea());
        return !0
    }
    ;
    Uj.prototype.Ca = function(a) {
        if (!this.ta)
            return !1;
        if (this.V)
            return !0;
        var b = a.x - H(this).x;
        a = a.y - H(this).y;
        return Math.abs(b) < Gg(this).width / 2 && Math.abs(a) < Gg(this).height / 2
    }
    ;
    var Vj = function(a, b, c, d, e, f, g) {
        e = void 0 === e ? xa : e;
        f = void 0 === f ? "#fff" : f;
        Uj.call(this, a, new y(2 * b,2 * b), d, e, void 0 === g ? !1 : g);
        this.$ = new Jg(new r(0,0,0),b,"#000");
        this.$.S = .2;
        this.$.v(!1);
        E(this.$, this);
        this.U = new Jg(new r(0,-12,0),b,f);
        this.U.v(!1);
        E(this.U, this);
        a = 2 * b;
        this.o = new V(c);
        S(this.o, 0, 0);
        this.o.v(!1);
        U(this.o, a - .4 * a, a - .4 * a);
        E(this.o, this.U)
    };
    q(Vj, Uj);
    Vj.prototype.i = function(a, b) {
        b = void 0 === b ? !0 : b;
        a ? this.U.j(0, 0) : this.U.j(0, -12);
        return Uj.prototype.i.call(this, a, b)
    }
    ;
    var Wj = function(a, b, c) {
        Vj.call(this, a, 40, tf, c, b, "#3261A5", !0)
    };
    q(Wj, Vj);
    var Xj = function() {
        if (uc())
            throw "";
        return !nc && (oc || sc())
    }
      , Yj = function() {
        if (uc())
            throw "";
        return tc() || qc || nc
    }
      , Zj = function() {
        if (uc())
            throw "";
        return mc ? !1 : tc() && !(kc || lc) || qc && nc
    }
      , ak = function() {
        return uc() ? "1" == hc.g.get("ccta") : tc() && !sc() || qc && nc
    };
    var ck = function() {
        if (!bk)
            return 0;
        try {
            var a = window.localStorage.getItem("doodle-july4th19-score")
        } catch (b) {
            return 0
        }
        return null == a ? 0 : JSON.parse(a)
    }
      , bk = !!self.localStorage;
    var dk = function(a, b, c) {
        D.call(this, void 0 === a ? 0 : a, void 0 === b ? 0 : b, void 0 === c ? 0 : c);
        this.V = new V(Pf);
        U(this.V, 26);
        E(this.V, this);
        this.U = new Zi(7,2.5,0);
        E(this.U, this);
        F(this.U, 1.2);
        a = new D(-5.5,.8);
        F(a, 1.1);
        E(a, this);
        this.o = new V(Kf);
        this.o.j(-4, 0, 0);
        U(this.o, 3.3);
        E(this.o, a);
        this.S = new V(Kf);
        U(this.S, 3.3);
        E(this.S, a);
        this.v = new V(Kf);
        this.v.j(4, 0, 0);
        U(this.v, 3.3);
        E(this.v, a);
        this.i = 0;
        this.ha = ck();
        this.$ = new I;
        E(this.$, this);
        this.W = 50;
        w.ka().addListener(this)
    };
    q(dk, D);
    var ek = function(a, b) {
        1 <= b && (T(a.v, Jf),
        U(a.v, 3.3));
        2 <= b && (T(a.S, Jf),
        U(a.S, 3.3));
        3 <= b && (T(a.o, Jf),
        U(a.o, 3.3))
    };
    dk.prototype.reset = function() {
        this.i = 0;
        T(this.o, Kf);
        U(this.o, 3.3);
        T(this.S, Kf);
        U(this.S, 3.3);
        T(this.v, Kf);
        U(this.v, 3.3);
        Yi(this.U, 0);
        this.W = 50
    }
    ;
    dk.prototype.Za = function(a, b) {
        if (4 == a)
            this.i > this.ha && (this.ha = this.i),
            this.i - b < this.W && this.i >= this.W && (50 == this.W % 100 ? x(w.ka(), 10) : x(w.ka(), 11),
            this.W += 50);
        else if (21 == a)
            this.i += 1,
            Yi(this.U, this.i),
            W.g.vd.play();
        else if (22 == a && (mc && (document.cookie = "sessionHighScore=" + this.i),
        this.i >= this.ha && (a = this.ha,
        bk)))
            try {
                window.localStorage.setItem("doodle-july4th19-score", JSON.stringify(a))
            } catch (c) {}
    }
    ;
    var fk = {
        ad: ["ca"],
        ae: ["ar", "en", "fa", "hi", "ur"],
        af: ["ps", "fa"],
        ag: ["en"],
        ai: ["en"],
        al: ["sq", "en"],
        am: ["hy", "ru"],
        ao: ["pt-PT"],
        ar: ["es-419", "es"],
        as: ["en"],
        at: ["de"],
        au: ["en"],
        az: ["az", "ru"],
        ba: ["bs", "hr", "sr"],
        bd: ["bn", "en"],
        be: ["nl", "de", "en", "fr"],
        bf: ["fr"],
        bg: ["bg"],
        bh: ["ar", "en"],
        bi: ["fr"],
        bj: ["fr"],
        bn: ["ms", "en", "zh-CN"],
        bo: ["es-419", "es"],
        br: ["pt-BR", "en"],
        bs: ["en"],
        bt: ["en"],
        bw: ["tn", "en"],
        by: ["be", "ru"],
        bz: ["en", "es", "es-419"],
        ca: ["en", "fr"],
        cd: ["fr", "sw"],
        cf: ["fr"],
        cg: ["fr"],
        ch: ["de", "en", "fr", "it"],
        ci: ["fr"],
        ck: ["en"],
        cl: ["es-419", "es"],
        cm: ["fr", "en"],
        cn: ["zh-CN"],
        co: ["es-419", "es"],
        cr: ["es-419", "en", "es"],
        cu: ["es-419", "es"],
        cv: ["pt-PT"],
        cy: ["en", "el", "tr"],
        cz: ["cs"],
        de: ["de", "en", "fr"],
        dj: ["fr", "ar", "so"],
        dk: ["da"],
        dm: ["en"],
        "do": ["es-419", "es"],
        dz: ["fr", "ar"],
        ec: ["es-419", "es"],
        ee: ["et", "ru"],
        eg: ["ar", "en"],
        es: ["es", "ca", "en", "eu", "gl"],
        et: ["am", "en", "so"],
        fi: ["fi", "sv"],
        fj: ["en"],
        fr: ["fr"],
        ga: ["fr"],
        ge: ["ka", "en"],
        gg: ["en", "fr"],
        gh: ["en"],
        gi: ["en", "es", "it", "pt-PT"],
        gl: ["da", "en"],
        gm: ["en", "wo"],
        gr: ["el"],
        gt: ["es-419", "es"],
        gy: ["en"],
        hk: ["zh-TW", "en", "zh-CN", "zh-HK"],
        hn: ["es-419", "es"],
        hr: ["hr"],
        ht: ["fr", "en", "ht"],
        hu: ["hu"],
        id: ["id", "en", "nl"],
        ie: ["en-GB", "ga"],
        il: ["iw", "ar", "en"],
        im: ["en"],
        "in": "en bn gu hi kn ml mr ne or pa ta te".split(" "),
        iq: ["ar", "en"],
        is: ["is", "en"],
        it: ["it", "en"],
        je: ["en", "fr"],
        jm: ["en"],
        jo: ["ar", "en"],
        jp: ["ja"],
        ke: ["sw", "en"],
        kg: ["ky", "ru"],
        kh: ["km", "en"],
        ki: ["en"],
        kr: ["ko"],
        kw: ["ar", "en"],
        kz: ["kk", "ru"],
        la: ["lo", "en"],
        lb: ["ar", "en", "fr", "hy"],
        lk: ["en", "si", "ta"],
        ls: ["st", "en", "zu"],
        lt: ["lt"],
        lu: ["de", "fr"],
        lv: ["lv", "lt", "ru"],
        ly: ["ar", "en", "it"],
        ma: ["fr", "ar"],
        md: ["ro", "ro-MD", "ru"],
        me: ["sr-ME", "bs", "sr"],
        mg: ["mg", "fr"],
        mk: ["mk"],
        ml: ["fr"],
        mm: ["my", "en"],
        mn: ["mn"],
        mt: ["mt", "en"],
        mu: ["en", "fr"],
        mv: ["en"],
        mw: ["ny", "en"],
        mx: ["es-419", "es"],
        my: ["en", "ms"],
        mz: ["pt-PT", "ny", "sn", "sw"],
        na: ["en", "af", "de"],
        ne: ["fr"],
        ng: ["en"],
        ni: ["es-419", "en", "es"],
        nl: ["nl", "en"],
        no: ["no", "nn"],
        np: ["ne", "en"],
        nr: ["en"],
        nu: ["en"],
        nz: ["en-GB"],
        om: ["ar", "en"],
        pa: ["es-419", "en", "es"],
        pe: ["es-419", "es"],
        pg: ["en"],
        ph: ["en"],
        pk: ["en", "pa", "ur"],
        pl: ["pl"],
        pn: ["en"],
        pr: ["es-419", "en", "es"],
        ps: ["ar", "en"],
        pt: ["pt-PT"],
        py: ["es-419", "es"],
        qa: ["ar", "en"],
        ro: ["ro", "de", "hu"],
        rs: ["sr", "sr-Latn"],
        ru: ["ru"],
        rw: ["en", "fr", "sw"],
        sa: ["ar", "en"],
        sb: ["en"],
        sc: ["crs", "en", "fr"],
        se: ["sv"],
        sg: ["en", "ms", "ta", "zh-CN"],
        si: ["sl"],
        sk: ["sk", "hu"],
        sl: ["en"],
        sm: ["it"],
        sn: ["fr", "wo"],
        so: ["so", "ar", "en"],
        sr: ["nl", "en"],
        st: ["pt-PT"],
        sv: ["es-419", "es"],
        td: ["fr", "ar"],
        tg: ["fr"],
        th: ["th", "en"],
        tj: ["tg", "ru"],
        tl: ["pt-PT", "en", "id"],
        tm: ["tk", "ru", "uz"],
        tn: ["ar", "fr"],
        to: ["en"],
        tr: ["tr"],
        tt: "en es es-419 fr hi zh-TW".split(" "),
        tw: ["zh-TW", "en"],
        tz: ["sw", "en"],
        ua: ["uk", "ru"],
        ug: ["en"],
        uk: ["en-GB"],
        us: ["en", "es", "es-419", "zh-CN"],
        uy: ["es-419", "es"],
        uz: ["uz", "ru"],
        vc: ["en"],
        ve: ["es-419", "es"],
        vi: ["en"],
        vn: ["vi", "en", "fr", "zh-TW"],
        vu: ["en", "fr"],
        ws: ["en"],
        za: ["en", "af", "st", "tn", "zu"],
        zm: ["en", "ny", "sn"],
        zw: ["en", "ny", "sn", "tn", "zu"]
    };
    var gk = function() {
        this.g = this.j = null
    };
    gk.prototype.load = function(a, b, c, d) {
        var e = this;
        a = hk(this, a, b, c);
        if (null == a)
            return Promise.resolve();
        var f = d + "messages." + a + ".nocache.json"
          , g = new Re;
        g.ya = "text";
        return new Promise(function(h, k) {
            g.addEventListener("success", function() {
                try {
                    var l = g.g ? g.g.responseText : ""
                } catch (p) {
                    l = ""
                }
                e.j = JSON.parse(l.substring(5));
                h()
            });
            g.addEventListener("error", k);
            Ve(g, f)
        }
        )
    }
    ;
    var ik = function(a, b) {
        if (null == a.j)
            throw Error("r");
        return void 0 === a.j[b] ? "" : a.j[b]
    }
      , hk = function(a, b, c, d) {
        var e = b + "-" + c;
        if (-1 < d.indexOf(e))
            return a.g = b,
            e;
        if (b && -1 < d.indexOf(b))
            return a.g = b;
        if (c && fk[c])
            for (b = n(fk[c]),
            c = b.next(); !c.done; c = b.next())
                if (c = c.value,
                -1 < d.indexOf(c))
                    return a.g = c,
                    a.g;
        return -1 < d.indexOf("en") ? (a.g = "en",
        a.g) : a.g = null
    };
    ya(gk);
    var jk = [5, 6, 7, 8, 9, 11, 12, 16]
      , kk = 0
      , lk = 0
      , mk = !1
      , nk = {}
      , ok = []
      , qk = function(a) {
        nk.c = a;
        pk(1)
    }
      , pk = function(a) {
        var b = Ga();
        nk.dt = b - lk;
        lk = b;
        0 == a && (kk = b);
        nk.e = a;
        nk.t = 0 == kk ? -1 : Math.floor(b - kk);
        nk.m = nc ? 1 : 0;
        b = window.document;
        b = "CSS1Compat" == b.compatMode ? b.documentElement : b.body;
        b = new y(b.clientWidth,b.clientHeight);
        nk.w = b.width > b.height ? 1 : 0;
        b = [];
        for (var c in nk)
            nk.hasOwnProperty(c) && b.push(c + ":" + nk[c]);
        c = b.join(",");
        b = 10 == a;
        var d = 0 <= jk.indexOf(a);
        sc() && (c += "&ntp=1");
        b ? (b = Oc()) && (c += "&ved=" + b) : d && (Lc || ((b = document.getElementById("hplogoshareved")) ? Lc = b.getAttribute("data-ved") : uc() && fc(hc.g, "sved") && (Lc = hc.g.get("sved"))),
        (b = Lc) && (c += "&ved=" + b));
        -1 == c.search("&ei=") && (c += "&ei=",
        (b = Nc()) && (c += b));
        for (window.google && window.google.log ? window.google.log("doodle", c) : Pa(c); 0 < ok.length; )
            delete nk[ok.pop()];
        mk || 0 != a || ak() || (mk = !0,
        pk(10))
    };
    var rk = {}
      , sk = null;
    var tk = function() {
        this.g = []
    };
    tk.prototype.length = function() {
        return this.g.length
    }
    ;
    tk.prototype.end = function() {
        var a = this.g;
        this.g = [];
        return a
    }
    ;
    var uk = function() {
        this.i = [];
        this.g = 0;
        this.j = new tk
    };
    uk.prototype.reset = function() {
        this.i = [];
        this.j.end();
        this.g = 0
    }
    ;
    var vk = function(a, b, c) {
        if (null != c) {
            var d = a.j;
            for (b = 8 * b + 2; 127 < b; )
                d.g.push(b & 127 | 128),
                b >>>= 7;
            d.g.push(b);
            d = a.j.end();
            a.i.push(d);
            a.g += d.length;
            d.push(a.g);
            b = a.j;
            for (var e = 0; e < c.length; e++) {
                var f = c.charCodeAt(e);
                if (128 > f)
                    b.g.push(f);
                else if (2048 > f)
                    b.g.push(f >> 6 | 192),
                    b.g.push(f & 63 | 128);
                else if (65536 > f)
                    if (55296 <= f && 56319 >= f && e + 1 < c.length) {
                        var g = c.charCodeAt(e + 1);
                        56320 <= g && 57343 >= g && (f = 1024 * (f - 55296) + g - 56320 + 65536,
                        b.g.push(f >> 18 | 240),
                        b.g.push(f >> 12 & 63 | 128),
                        b.g.push(f >> 6 & 63 | 128),
                        b.g.push(f & 63 | 128),
                        e++)
                    } else
                        b.g.push(f >> 12 | 224),
                        b.g.push(f >> 6 & 63 | 128),
                        b.g.push(f & 63 | 128)
            }
            c = d.pop();
            for (c = a.g + a.j.length() - c; 127 < c; )
                d.push(c & 127 | 128),
                c >>>= 7,
                a.g++;
            d.push(c);
            a.g++
        }
    };
    ea();
    ka();
    var wk = function() {
        this.j = this.g = this.i = null
    };
    var Ak = function(a) {
        this.H = a;
        this.j = this.H.length / 4;
        this.T = this.j + 6;
        this.i = [[], [], [], []];
        this.v = [[], [], [], []];
        this.g = Array(xk * (this.T + 1));
        for (a = 0; a < this.j; a++)
            this.g[a] = [this.H[4 * a], this.H[4 * a + 1], this.H[4 * a + 2], this.H[4 * a + 3]];
        var b = Array(4);
        for (a = this.j; a < xk * (this.T + 1); a++) {
            b[0] = this.g[a - 1][0];
            b[1] = this.g[a - 1][1];
            b[2] = this.g[a - 1][2];
            b[3] = this.g[a - 1][3];
            if (0 == a % this.j) {
                var c = b
                  , d = c[0];
                c[0] = c[1];
                c[1] = c[2];
                c[2] = c[3];
                c[3] = d;
                yk(b);
                b[0] ^= zk[a / this.j][0];
                b[1] ^= zk[a / this.j][1];
                b[2] ^= zk[a / this.j][2];
                b[3] ^= zk[a / this.j][3]
            } else
                6 < this.j && 4 == a % this.j && yk(b);
            this.g[a] = Array(4);
            this.g[a][0] = this.g[a - this.j][0] ^ b[0];
            this.g[a][1] = this.g[a - this.j][1] ^ b[1];
            this.g[a][2] = this.g[a - this.j][2] ^ b[2];
            this.g[a][3] = this.g[a - this.j][3] ^ b[3]
        }
    };
    Ak.prototype.o = 16;
    var xk = Ak.prototype.o / 4
      , Bk = function(a, b) {
        for (var c = 0; 4 > c; c++)
            for (var d = 0; 4 > d; d++)
                a.i[c][d] ^= a.g[4 * b + d][c]
    }
      , Dk = function(a) {
        for (var b = Ck, c = 0; 4 > c; c++)
            for (var d = 0; 4 > d; d++)
                a.i[c][d] = b[a.i[c][d]]
    }
      , Ek = function(a) {
        for (var b = 1; 4 > b; b++)
            for (var c = 0; 4 > c; c++)
                a.v[b][c] = a.i[b][c];
        for (b = 1; 4 > b; b++)
            for (c = 0; 4 > c; c++)
                a.i[b][c] = a.v[b][(c + b) % xk]
    }
      , yk = function(a) {
        a[0] = Ck[a[0]];
        a[1] = Ck[a[1]];
        a[2] = Ck[a[2]];
        a[3] = Ck[a[3]]
    }
      , Ck = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22]
      , zk = [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0], [16, 0, 0, 0], [32, 0, 0, 0], [64, 0, 0, 0], [128, 0, 0, 0], [27, 0, 0, 0], [54, 0, 0, 0]]
      , Fk = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29, 19, 17, 23, 21, 11, 9, 15, 13, 3, 1, 7, 5, 59, 57, 63, 61, 51, 49, 55, 53, 43, 41, 47, 45, 35, 33, 39, 37, 91, 89, 95, 93, 83, 81, 87, 85, 75, 73, 79, 77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107, 105, 111, 109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137, 143, 141, 131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171, 169, 175, 173, 163, 161, 167, 165, 219, 217, 223, 221, 211, 209, 215, 213, 203, 201, 207, 205, 195, 193, 199, 197, 251, 249, 255, 253, 243, 241, 247, 245, 235, 233, 239, 237, 227, 225, 231, 229]
      , Gk = [0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53, 60, 63, 58, 57, 40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111, 106, 105, 120, 123, 126, 125, 116, 119, 114, 113, 80, 83, 86, 85, 92, 95, 90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192, 195, 198, 197, 204, 207, 202, 201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246, 245, 252, 255, 250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172, 175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149, 156, 159, 154, 153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157, 158, 151, 148, 145, 146, 131, 128, 133, 134, 143, 140, 137, 138, 171, 168, 173, 174, 167, 164, 161, 162, 179, 176, 181, 182, 191, 188, 185, 186, 251, 248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230, 239, 236, 233, 234, 203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217, 218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107, 104, 109, 110, 103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59, 56, 61, 62, 55, 52, 49, 50, 35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14, 7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26];
    var Hk = function(a) {
        this.g = a
    };
    var Ik = function(a) {
        return 0 == a.indexOf("//") ? "https:" + a : a
    }
      , Jk = function() {
        return null != window.agsa_ext && null != window.agsa_ext.share
    }
      , Kk = function(a, b) {
        var c = new Ub, d;
        for (d in b)
            c.add(d, b[d]);
        a = new Ob(a);
        Rb(a, c);
        return a.toString()
    }
      , Lk = null
      , Nk = function() {
        var a = Mk();
        if (navigator.g)
            return navigator.g.Hd(a);
        if (!document.execCommand)
            return Promise.reject();
        Lk || (Lk = document.createElement("input"),
        Lk.readOnly = !0,
        vc(Lk, "position", "absolute", "opacity", 0, "left", 0, "top", 0, "pointerEvents", "none"),
        document.body.appendChild(Lk));
        var b = Lk;
        b.value = a;
        b !== document.activeElement && b.focus();
        a = document.createRange();
        b.contentEditable = !0;
        b.readOnly = !1;
        a.selectNodeContents(b);
        var c = window.getSelection();
        c.removeAllRanges();
        c.addRange(a);
        b.setSelectionRange(0, b.value.length);
        b.contentEditable = !1;
        b.readOnly = !0;
        b = !1;
        try {
            b = document.execCommand("copy")
        } catch (d) {
            b = !1
        }
        window.getSelection().removeAllRanges();
        Lk.remove();
        Lk = null;
        return b ? Promise.resolve() : Promise.reject()
    };
    var Ok = function() {
        this.g = {};
        this.j = 0;
        this.i = document.body
    };
    ya(Ok);
    var Pk = {};
    Ok.prototype.reset = function() {
        for (var a in this.g)
            Qk(this, a);
        this.g = {}
    }
    ;
    var Qk = function(a, b) {
        if (a = a.g[b])
            a.Sb && window.clearTimeout(a.Sb),
            a.Xa && (a.Xa.parentNode && a.Xa.parentNode.removeChild(a.Xa),
            a.Xa = null),
            a.wc = null,
            a.Bb = null
    }
      , Rk = function(a, b, c) {
        var d = Ok.ka()
          , e = d.g[a];
        if (e) {
            if (e.Fb) {
                b && b(e.Fb);
                return
            }
            if (e.Sb)
                return
        } else
            e = {
                Bb: c,
                Bd: a,
                Xa: null,
                wc: b,
                Sb: 0,
                Fb: null
            };
        e.Xa || (e.Xa = document.createElement("script"));
        b = "c" + ++d.j;
        Pk[b] = function(f) {
            var g = Ok.ka()
              , h = e;
            h.Fb = f.id;
            h.Fb ? h.wc && h.wc(h.Fb) : h.Bb && h.Bb();
            Qk(g, h.Bd)
        }
        ;
        b = "//google-doodles.appspot.com/?callback=google.doodle.lsc." + b + "&url=" + encodeURIComponent(a);
        e.Xa.src = b;
        e.Sb = window.setTimeout(function() {
            e.Bb && e.Bb();
            Qk(Ok.ka(), a)
        }, 4E3);
        d.i.appendChild(e.Xa);
        d.g[a] = e
    };
    Ha("google.doodle.lsc", Pk);
    var Sk = null
      , Uk = function(a, b) {
        a = Tk(a);
        var c = new wk;
        c.i = a;
        c.g = b;
        c.j = "";
        a = new uk;
        vk(a, 1, c.i);
        vk(a, 2, c.g);
        vk(a, 3, c.j);
        b = new Uint8Array(a.g + a.j.length());
        for (var d = a.i, e = d.length, f = c = 0; f < e; f++) {
            var g = d[f];
            b.set(g, c);
            c += g.length
        }
        d = a.j.end();
        b.set(d, c);
        a.i = [b];
        a = [];
        for (d = c = 0; 27 > d; d++)
            e = "window.console.log119273973".charCodeAt(d),
            255 < e && (a[c++] = e & 255,
            e >>= 8),
            a[c++] = e;
        for (; 32 > a.length; )
            a.push(128);
        a = new Hk(new Ak(a));
        c = [];
        for (d = 0; d < b.length; d++)
            c.push(b[d]);
        for (; c.length % 16; )
            c.push(128);
        b = [];
        d = [];
        for (e = 0; 16 > e; e++)
            d[e] = 0;
        f = d;
        for (d = 0; d < c.length; d += a.g.o) {
            e = fb(c, d, d + a.g.o);
            g = [];
            for (var h = 0; h < e.length; h++)
                g.push(e[h] ^ f[h]);
            e = a.g;
            f = e;
            for (h = 0; h < xk; h++)
                for (var k = 0; 4 > k; k++) {
                    var l = 4 * k + h;
                    l = g[l];
                    f.i[h][k] = l
                }
            Bk(e, 0);
            for (f = 1; f < e.T; ++f) {
                Dk(e);
                Ek(e);
                g = e.i;
                h = e.v[0];
                for (k = 0; 4 > k; k++)
                    h[0] = g[0][k],
                    h[1] = g[1][k],
                    h[2] = g[2][k],
                    h[3] = g[3][k],
                    g[0][k] = Fk[h[0]] ^ Gk[h[1]] ^ h[2] ^ h[3],
                    g[1][k] = h[0] ^ Fk[h[1]] ^ Gk[h[2]] ^ h[3],
                    g[2][k] = h[0] ^ h[1] ^ Fk[h[2]] ^ Gk[h[3]],
                    g[3][k] = Gk[h[0]] ^ h[1] ^ h[2] ^ Fk[h[3]];
                Bk(e, f)
            }
            Dk(e);
            Ek(e);
            Bk(e, e.T);
            f = [];
            for (g = 0; g < xk; g++)
                for (h = 0; 4 > h; h++)
                    f[4 * h + g] = e.i[g][h];
            e = f;
            eb(b, e);
            f = e
        }
        a = 3;
        void 0 === a && (a = 0);
        if (!sk)
            for (sk = {},
            c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),
            d = ["+/=", "+/", "-_=", "-_.", "-_"],
            e = 0; 5 > e; e++)
                for (f = c.concat(d[e].split("")),
                rk[e] = f,
                g = 0; g < f.length; g++)
                    h = f[g],
                    void 0 === sk[h] && (sk[h] = g);
        c = rk[a];
        a = [];
        for (d = 0; d < b.length; d += 3)
            k = b[d],
            l = (e = d + 1 < b.length) ? b[d + 1] : 0,
            h = (f = d + 2 < b.length) ? b[d + 2] : 0,
            g = k >> 2,
            k = (k & 3) << 4 | l >> 4,
            l = (l & 15) << 2 | h >> 6,
            h &= 63,
            f || (h = 64,
            e || (l = 64)),
            a.push(c[g], c[k], c[l] || "", c[h] || "");
        b = window.location;
        return b.protocol + "//" + b.host + "/?doodle=119273973_" + a.join("") + "&hl=" + Gc
    }
      , Vk = function(a, b) {
        var c = Uk(a, b);
        Sk = c;
        Rk(c, function(d) {
            return Sk = d
        }, function() {
            return Sk = c
        })
    }
      , Mk = function() {
        return "https:" + Dc("shortlink", "//www.google.com/?doodle=119273973")
    }
      , Tk = function(a) {
        return ik(gk.ka(), "Share Message").replace(/\[.*\]/, "" + a)
    };
    var Wk = function(a, b, c, d, e, f, g) {
        e = void 0 === e ? xa : e;
        f = void 0 === f ? 0 : f;
        Uj.call(this, a, b, d, e, void 0 === g ? !1 : g);
        this.o = new V(c);
        S(this.o, 0, 0);
        this.o.v(!1);
        U(this.o, b.width - b.width * f, b.height - b.height * f);
        E(this.o, this)
    };
    q(Wk, Uj);
    Wk.prototype.i = function(a, b) {
        this.o.S = a ? .8 : 1;
        return Uj.prototype.i.call(this, a, void 0 === b ? !0 : b)
    }
    ;
    var Xk = function(a, b, c) {
        b = b.match(/[^\s-]+-?/g);
        if (!b || 1 > b.length)
            return [""];
        for (var d = b[0], e = [], f = 1; f < b.length; f++) {
            var g = d + ("-" == d[d.length - 1] ? "" : " ") + b[f];
            a.measureText(g).width > c ? (e.push(d),
            d = b[f]) : d = g
        }
        e.push(d);
        return e
    }
      , Yk = function(a, b) {
        a.font = b.fontStyle + " " + b.fontSize + "px " + b.fontFamily;
        for (var c = 0, d = 0; d < b.lines.length; d++)
            c = Math.max(c, a.measureText(b.lines[d]).width);
        return c
    };
    var $k = function(a, b, c, d) {
        b = void 0 === b ? 1 : b;
        c = void 0 === c ? 10 : c;
        d = void 0 === d ? "left" : d;
        N.call(this);
        this.U = d;
        this.Ca = a;
        this.i = {
            lines: [],
            fontFamily: "",
            fontSize: 1,
            fontStyle: ""
        };
        this.V = b;
        this.wa = c;
        this.o = "#000";
        this.$ = "Garamond";
        this.ta = document.createElement("canvas").getContext("2d");
        this.Ba = this.V / 2;
        this.ya.x = 0;
        this.ya.y = 0;
        Zk(this)
    };
    q($k, N);
    var Zk = function(a) {
        var b = a.ta
          , c = a.Ca
          , d = a.$
          , e = 24 * a.V
          , f = 24 * a.Ba
          , g = 24 * a.wa
          , h = b.font;
        b.font = " " + e + "px " + d;
        for (var k = Xk(b, c, g); 4 < k.length && e > f; )
            e = Math.max(f, 1 < e ? e - 1 : e - .1),
            b.font = " " + e + "px " + d,
            k = Xk(b, c, g);
        for (c = 0; c < k.length; c++)
            for (; b.measureText(k[c]).width > g && e > f; )
                e = Math.max(f, 1 < e ? e - 1 : e - .1),
                b.font = " " + e + "px " + d;
        b.font = h;
        a.i = {
            lines: k,
            fontFamily: d,
            fontSize: e,
            fontStyle: ""
        };
        a.setSize(Yk(a.ta, a.i) / 24, 1.2 * a.i.lines.length * a.i.fontSize / 24)
    };
    $k.prototype.Oa = function(a) {
        var b = 0;
        "left" == this.U ? b = -this.ya.x * this.H().width : "right" == this.U && (b = this.ya.x * this.H().width);
        a.translate(b, -this.ya.y * this.H().height);
        a.scale(1 / 24, 1 / 24);
        a.fillStyle = this.o;
        a.translate(0, this.i.fontSize);
        a.textAlign = this.U;
        b = this.i;
        var c = 1.2 * this.i.fontSize
          , d = a.font;
        a.font = b.fontStyle + " " + b.fontSize + "px " + b.fontFamily;
        for (var e = 0; e < b.lines.length; e++)
            a.fillText(b.lines[e], 0, e * c);
        a.font = d
    }
    ;
    var al = function(a) {
        a.$ = "Arial";
        Zk(a)
    };
    var dl = function(a, b) {
        D.call(this);
        var c = this;
        this.Pa = b;
        this.Ea = a;
        this.S = new aj;
        E(this.S, this);
        this.S.T = !1;
        this.$ = new D(0,0,0);
        E(this.$, this);
        this.v = new Wj(new r(0,150,0),function() {
            c.i.o = [];
            x(w.ka(), 7)
        }
        ,function() {
            x(w.ka(), 8, 2 == c.ha)
        }
        );
        Z(this.v, !0);
        E(this.v, this.$);
        this.ta = new D(0,150,0);
        E(this.ta, this.$);
        this.i = new I;
        E(this.i, this);
        this.ha = 3;
        a = 1.5 * this.v.H().width;
        this.V = new Vj(new r(a,0,0),40,kc && !qc ? Lf : Sf,function() {
            var d = b.i
              , e = ej(c.S);
            kc && !qc ? (e = Sk || Uk(d, e),
            d = Tk(d),
            Ec() || (pk(9),
            e = Ik(e),
            window.location = "http://www.google.com/doodles/_SHARE?description=" + encodeURIComponent(d) + "&url=" + encodeURIComponent(e))) : Jk() ? (e = Sk || Uk(d, e),
            d = Tk(d),
            !Ec() && Jk() && (pk(15),
            window.agsa_ext.share(d + " " + e, null))) : bl(c)
        }
        ,function() {}
        ,"#3261A5");
        kc && !qc || S(this.V.o, -.09, 0);
        E(this.V, this.ta);
        this.U = new Vj(new r(-a,0,0),40,Rf,function() {
            x(w.ka(), 13);
            var d = google.doodle ? google.doodle.url : "";
            if (d) {
                var e;
                (e = (e = !kc) || rc()) ? Db(d) : (e = window.top.location,
                d = d instanceof vb ? d : yb(d),
                e.assign(wb(d)))
            }
        }
        ,function() {}
        ,"#3261A5");
        S(this.U.o, .05, -.01);
        E(this.U, this.ta);
        this.W = new Vj(new r(0,0,0),40,Of,function() {
            return x(w.ka(), 5)
        }
        ,function() {}
        ,"#3261A5");
        F(this.W.o, 1.1);
        S(this.W.o, .05, 0);
        E(this.W, this.ta);
        this.Na = !1;
        this.Ba = new V(Uf);
        this.Ba.j(50, 35, 0);
        F(this.Ba, 1.7);
        this.Ba.v(!1);
        E(this.Ba, this.v);
        this.o = new V(Tf,0,-60,0);
        this.o.v(!1);
        U(this.o, 350);
        this.o.T = !1;
        this.wa = new Wk(new r(-70,-40,0),new y(80,80),Bf,function() {
            var d = ej(c.S);
            d = Sk || Uk(b.i, d);
            Ec() || (d = Ik(d),
            d = Kk("https://www.facebook.com/dialog/share", {
                app_id: "738026486351791",
                href: d,
                hashtag: "#GoogleDoodle"
            }),
            Db(d),
            pk(5))
        }
        ,function() {}
        ,.4);
        E(this.wa, this.o);
        this.Ka = new Wk(new r(0,-40,0),new y(80,80),Xf,function() {
            var d = b.i
              , e = ej(c.S);
            e = Sk || Uk(d, e);
            d = Tk(d);
            Ec() || (e = Ik(e),
            d = "text=" + encodeURIComponent(String(d + "\n" + e)),
            Db("http://twitter.com/intent/tweet?" + d),
            pk(6))
        }
        ,function() {}
        ,.4);
        E(this.Ka, this.o);
        this.ya = new Wk(new r(70,-40,0),new y(80,80),Mf,function() {
            var d = b.i
              , e = ej(c.S);
            e = Sk || Uk(d, e);
            var f = Tk(d);
            Ec() || (pk(8),
            d = window.top.location,
            e = Ik(e),
            e = Kk("mailto:", {
                subject: Fc,
                body: f + "\n" + e
            }),
            d.href = e)
        }
        ,function() {}
        ,.4);
        E(this.ya, this.o);
        this.Ca = new Uj(new r(0,-114,0),new y(340,40),function() {
            return Nk()
        }
        );
        a = new V(xf);
        F(a, 1.5);
        a.j(140, 0, 0);
        a.v(!1);
        S(a, 0, 0);
        E(a, this.Ca);
        E(this.Ca, this.o);
        this.Ga = new $k(ik(gk.ka(), "CLICK TO COPY"),21,200);
        this.Ga.v(!1);
        this.Ga.j(-160, -142, 0);
        this.Ga.o = "#2687FF";
        al(this.Ga);
        E(this.Ga, this.o);
        this.La = new $k(Mk().replace("https://", "").replace("www.", ""),21,200);
        this.La.v(!1);
        this.La.j(-160, -115, 0);
        this.La.o = "#FFF";
        al(this.La);
        E(this.La, this.o);
        E(this.o, this.ta);
        cl(this)
    };
    q(dl, D);
    var el = function(a) {
        return [a.v, a.V, a.U, a.W, a.wa, a.Ka, a.ya, a.Ca]
    }
      , bl = function(a) {
        a.Na = !a.Na;
        a.Na ? (a.o.T = !0,
        F(a.ya, 0),
        F(a.wa, 0),
        F(a.Ka, 0),
        J(a.i, 0, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.wa, b)
            }
            ))
        }),
        J(a.i, 80, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.Ka, b)
            }
            ))
        }),
        J(a.i, 80, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.ya, b)
            }
            ))
        }),
        J(a.i, 0, function() {
            Z(a.ya, !0);
            Z(a.wa, !0);
            Z(a.Ka, !0);
            Z(a.Ca, !0)
        })) : (a.o.T = !1,
        Z(a.ya, !1),
        Z(a.wa, !1),
        Z(a.Ka, !1),
        Z(a.Ca, !1))
    }
      , il = function(a, b) {
        b != a.ha && (a.ha = b,
        a.i.i = [],
        a.i.o = [],
        2 != b && jg(a.Ba),
        a.Na = !1,
        a.o.T = !1,
        Z(a.ya, !1),
        Z(a.wa, !1),
        Z(a.Ka, !1),
        Z(a.Ca, !1),
        0 == b || 2 == b ? (fl(a),
        2 == b && J(a.i, 0, function() {
            return gl(a)
        })) : 1 == b && hl(a))
    }
      , gl = function(a) {
        K(a.i, new O(2E4,0,20 * Math.PI,function(b) {
            b = !!Math.round(Math.abs(Math.sin(b)) - .44);
            a.Ba.j(a.Ba.g.x, 35 + 10 * b);
            a.v.i(b, !1) && (b ? x(w.ka(), 7) : x(w.ka(), 8, !1))
        }
        ))
    }
      , hl = function(a) {
        Vk(a.Pa.i, ej(a.S));
        Z(a.v, !1);
        a.ta.j(0, 0, 0);
        F(a.V, 0);
        F(a.U, 0);
        F(a.W, 0);
        bj(a.S, a.Pa.i, a.Pa.ha);
        K(a.i, new P(a.v,500,new r(0,150,0),{
            Ma: Qg
        }));
        J(a.i, 1E3, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.U, b)
            }
            ))
        });
        J(a.i, 100, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.W, b)
            }
            ))
        });
        J(a.i, 100, function() {
            K(a.i, new O(200,0,1,function(b) {
                return F(a.V, b)
            }
            ))
        });
        J(a.i, 0, function() {
            Z(a.V, !0);
            Z(a.U, !0);
            Z(a.W, !0)
        })
    }
      , fl = function(a) {
        Z(a.V, !1);
        Z(a.U, !1);
        Z(a.W, !1);
        cj(a.S);
        rg(a.i, [new P(a.ta,500,new r(0,150,0),{
            Ma: Qg
        }), new P(a.v,500,new r(0,0,0),{
            Ma: Qg
        })]);
        J(a.i, 0, function() {
            Z(a.v, !0)
        })
    };
    dl.prototype.Aa = function() {
        if (H(this.$).y != jl(this) || 0 != H(this.$).x)
            cl(this),
            1 == this.ha && (Z(this.V, !0),
            Z(this.U, !0),
            Z(this.W, !0))
    }
    ;
    var cl = function(a) {
        var b = Math.min(a.Ea.height / 720, a.Ea.width / 400);
        a.$.j(0, jl(a), 0);
        F(a.$, b);
        a.S.j(0, -a.Ea.height / 2 + 20 * b, 0);
        F(a.S, b)
    }
      , jl = function(a) {
        a = a.Ea.height / 2 - .07 * a.Ea.height;
        ic && (a -= 20);
        return a
    };
    var kl = function() {
        M.call(this);
        this.i = new Fh;
        Gh(this.i, 0);
        this.i.Fa = -20;
        F(this.i, 80);
        this.i.v(!1);
        this.i.Ba = 1.7;
        this.i.wa = 20;
        this.i.j(-130);
        this.o = new Fh;
        Gh(this.o, 0);
        this.o.Fa = -20;
        F(this.o, 80);
        this.o.v(!1);
        this.o.Ba = -1;
        this.o.wa = 18;
        this.o.j(0);
        this.v = new Fh;
        Gh(this.v, 0);
        this.v.Fa = -20;
        F(this.v, 80);
        this.v.v(!1);
        this.v.Ba = 2;
        this.v.wa = -20;
        this.v.j(130);
        E(this.i, this);
        E(this.o, this);
        E(this.v, this);
        this.U = new I;
        E(this.U, this)
    };
    q(kl, M);
    kl.prototype.Oa = function(a) {
        a.fillStyle = "#253F97";
        a.setTransform(1, 0, 0, 1, 0, 0);
        a.fillRect(0, 0, a.canvas.width, a.canvas.height)
    }
    ;
    var ll = function(a) {
        rg(a.U, Ph(a, 300));
        K(a.U, new O(1E4,0,16 * Math.PI,function(b) {
            a.i.j(-130, 60 * -Math.max(0, Math.sin(b)));
            a.o.j(0, 60 * -Math.max(0, Math.sin(b + .6)));
            a.v.j(130, 60 * -Math.max(0, Math.sin(b + 1.2)))
        }
        ))
    }
      , ml = function(a) {
        rg(a.U, Qh(a, 300));
        J(a.U, 0, function() {
            return jg(a)
        })
    };
    var ol = function() {
        this.g = 0;
        nl()
    }
      , nl = function() {
        var a = [4277217, 4277221, 4277218, 4277222, 4277219, 4277223]
          , b = Xa([Gd, Hd, Id, Jd, Kd], function(c) {
            return a.includes(c)
        });
        b = Za(b, function(c, d) {
            return c + d + " "
        }, "");
        nk.d1 = b
    };
    ol.prototype.reset = function() {
        this.g = 0;
        nk.s = this.g
    }
    ;
    ol.prototype.Za = function(a, b) {
        4 == a ? (this.g += b,
        nk.s = this.g) : 2 == a ? (pk(2),
        qk(4),
        this.g = 0,
        nk.s = this.g) : 13 == a ? pk(3) : 5 == a ? (pk(4),
        pk(0),
        qk(5)) : 16 == a ? nk.d2 = Math.round(b) : 12 == a ? (pk(0),
        qk(3)) : 19 == a && qk(2)
    }
    ;
    ya(ol);
    var pl = function(a) {
        D.call(this);
        this.i = document.createElement("div");
        this.i.classList.add("ddljly-a");
        a.appendChild(this.i);
        this.o = new I;
        E(this.o, this)
    };
    q(pl, D);
    var rl = function(a, b) {
        var c = ql
          , d = gk.ka();
        b = ik(d, b);
        for (var e = d = 0, f = !1, g = b.split(Ta), h = 0; h < g.length; h++) {
            var k = g[h];
            Ra.test(k) ? (d++,
            e++) : Sa.test(k) ? f = !0 : Qa.test(k) ? e++ : Ua.test(k) && (f = !0)
        }
        d = 0 == e ? f ? 1 : 0 : .4 < d / e ? -1 : 1;
        c(a, 1 == d ? "\u202a" + b + "\u202c" : -1 == d ? "\u202b" + b + "\u202c" : b)
    }
      , ql = function(a, b) {
        J(a.o, 0, function() {
            a.i.innerText = b;
            var c = a.i
              , d = 10;
            d = void 0 === d ? 10 : d;
            var e = 40;
            for (c.style.fontSize = e + "px"; (250 < c.offsetWidth || 100 < c.offsetHeight) && e > d; )
                e--,
                c.style.fontSize = e + "px";
            a.i.classList.add("ddljly-b")
        });
        J(a.o, 2E3, function() {
            a.i.classList.remove("ddljly-b")
        })
    };
    var sl = function(a, b) {
        var c = void 0 === c ? 52 : c;
        var d = c * (window.devicePixelRatio || 1)
          , e = document.createElement("canvas");
        e.width = d;
        e.height = d;
        var f = e.getContext("2d");
        f.fillStyle = "rgba(0,0,0,.3)";
        f.arc(d / 2, d / 2, d / 2, 0, 2 * Math.PI);
        f.fill();
        f.strokeStyle = "#fff";
        f.lineWidth = d / 52 * 3.5;
        var g = d / 52 * 2;
        f.beginPath();
        f.moveTo(d / 4 + g, d / 4 + g);
        f.lineTo(3 * d / 4 - g, 3 * d / 4 - g);
        f.stroke();
        f.beginPath();
        f.moveTo(3 * d / 4 - g, d / 4 + g);
        f.lineTo(d / 4 + g, 3 * d / 4 - g);
        f.stroke();
        this.g = e;
        this.g.style.top = "10px";
        this.g.style.right = "10px";
        this.g.style.width = c + "px";
        this.g.style.height = c + "px";
        this.g.style.cursor = "pointer";
        this.g.style.position = "absolute";
        this.g.style.pointerEvents = "all";
        this.g.style.background = "transparent";
        this.g.style.display = "none";
        this.g.setAttribute("role", "button");
        we(this.g, "click", b);
        a.appendChild(this.g)
    };
    var wl = function(a, b, c) {
        C.call(this);
        this.W = a;
        this.$ = b;
        this.ya = c;
        this.va = Ga();
        this.Fa = Cc(document, "hidden");
        this.i = (this.S = Cc(document, "visibilityState")) ? this.S.replace(/state$/i, "change").toLowerCase() : null;
        this.H = tl(this);
        this.T = !1;
        this.o = this.H;
        ul(this);
        vl(this)
    };
    q(wl, C);
    var ul = function(a) {
        a.i ? xl(a) : lc && yl(a, function() {
            xl(a)
        })
    }
      , xl = function(a) {
        a.g = function() {
            a.H = tl(a);
            a.H ? zl(a) : Al(a)
        }
        ;
        var b = window.agsa_ext;
        a.i ? document.addEventListener(a.i, a.g, !1) : b && b.registerPageVisibilityListener && (google.doodle || (google.doodle = {}),
        google.doodle.pvc = function() {
            a.g && a.g()
        }
        ,
        b.registerPageVisibilityListener("google.doodle.pvc();"))
    }
      , yl = function(a, b) {
        window.agsa_ext ? b() : a.V = window.setTimeout(function() {
            ul(a)
        }, 100)
    };
    wl.prototype.j = function() {
        window.clearTimeout(this.v);
        window.clearTimeout(this.V);
        this.g && (this.i && document.removeEventListener ? document.removeEventListener(this.i, this.g, !1) : window.agsa_ext && window.agsa_ext.registerPageVisibilityListener && (this.g = null));
        C.prototype.j.call(this)
    }
    ;
    var tl = function(a) {
        if (!a.Fa && !a.S && window.agsa_ext && window.agsa_ext.getPageVisibility)
            return "hidden" == window.agsa_ext.getPageVisibility();
        var b = document[a.S];
        return document[a.Fa] || "hidden" == b
    }
      , zl = function(a) {
        var b = a.H || a.T;
        a.o && !b ? (a.o = !1,
        a.ya(),
        vl(a)) : !a.o && b && (a.o = !0,
        a.$())
    }
      , vl = function(a) {
        a.v && window.clearTimeout(a.v);
        var b = Math.max(100, a.W - Bl(a));
        a.v = window.setTimeout(function() {
            a.v = null;
            a.T = Bl(a) >= a.W;
            a.T || vl(a);
            zl(a)
        }, b)
    }
      , Bl = function(a) {
        return Ga() - a.va
    }
      , Al = function(a) {
        a.va = Ga();
        a.T = !1;
        zl(a)
    };
    var Dl = function(a, b) {
        C.call(this);
        var c = this;
        this.i = [];
        this.g = b;
        this.T = function(f) {
            var g;
            if ("contextmenu" == f.type)
                f.preventDefault();
            else {
                var h;
                var k = void 0;
                h = (h = f || window.event) ? (k = k || h.targetTouches && h.targetTouches[0] || h.changedTouches && h.changedTouches[0]) && void 0 !== k.pageX ? [k.pageX, k.pageY] : void 0 !== h.clientX ? [h.clientX + ("rtl" == document.dir ? -1 : 1) * (document.body.scrollLeft || document.documentElement.scrollLeft || 0), h.clientY + (document.body.scrollTop || document.documentElement.scrollTop || 0)] : void 0 !== h.pageX ? [h.pageX, h.pageY] : [0, 0] : [0, 0];
                k = c.g;
                var l = g = 0;
                if (k) {
                    do
                        g += k.offsetLeft,
                        l += k.offsetTop;
                    while (k = k.offsetParent)
                }
                k = [g, l];
                h = [h[0] - k[0], h[1] - k[1]];
                k = h[0] * c.g.width / c.g.clientWidth - c.g.width / 2;
                g = h[1] * c.g.height / c.g.clientHeight - c.g.height / 2;
                h = f.type;
                "touchstart" == h ? h = "mousedown" : "touchmove" == h ? h = "mousemove" : "touchend" == h && (h = "mouseup");
                k = new jd(k,g);
                var p = !1;
                g = "default";
                l = n(c.i);
                for (var t = l.next(); !t.done; t = l.next())
                    if (t = t.value,
                    "mouseleave" == h || p)
                        t.cancel && t.cancel();
                    else {
                        var B = t.Ca(k);
                        "mousedown" == h && B && !p ? (t.i(!0),
                        g = "pointer",
                        c.g.focus(),
                        p = !t.V) : "mouseup" == h ? ((p = B && !p) && (g = "pointer"),
                        t.i(!1, p),
                        p = B && !t.V) : "mousemove" == h && B && !p && (g = "pointer",
                        p = !t.V)
                    }
                c.g.style.cursor = g;
                f.preventDefault();
                Al(a)
            }
        }
        ;
        this.H = "mousedown mouseup mousemove mouseleave touchstart touchend touchmove contextmenu".split(" ");
        for (var d = n(this.H), e = d.next(); !e.done; e = d.next())
            b.addEventListener(e.value, this.T, !1);
        b = new D;
        b.Aa = function() {
            Cl(c)
        }
        ;
        ig(Ug.ka().g, b)
    };
    q(Dl, C);
    var Cl = function(a) {
        a.i = a.i.sort(function(b, c) {
            return b.Vb - c.Vb
        }).reverse()
    }
      , El = function(a, b) {
        for (var c = n(a.i), d = c.next(); !d.done; d = c.next())
            d.value.cancel();
        a.i = b;
        Cl(a)
    };
    Dl.prototype.j = function() {
        for (var a = n(this.H), b = a.next(); !b.done; b = a.next())
            this.g.removeEventListener(b.value, this.T, !1);
        C.prototype.j.call(this)
    }
    ;
    var Gl = function(a) {
        this.g = a;
        this.H = a.clientWidth;
        this.i = a.clientHeight;
        this.j = 2;
        Fl(this)
    }
      , Fl = function(a) {
        a.H = a.g.clientWidth;
        a.i = a.g.clientHeight;
        a.g.width = a.H * a.j;
        a.g.height = a.i * a.j;
        x(w.ka(), 1E3)
    }
      , Hl = function(a) {
        var b = a.j;
        a.j = 1;
        1 != b && Fl(a)
    };
    var Jl = function(a, b, c, d) {
        C.call(this);
        var e = this;
        this.T = {};
        b = n(b);
        for (var f = b.next(); !f.done; f = b.next())
            this.T[f.value] = !0;
        this.g = null;
        b = n(document.getElementsByTagName("input"));
        for (f = b.next(); !f.done; f = b.next())
            f = f.value,
            "q" == f.name && (this.g = f);
        this.i = function(g) {
            Il(e, g) && (Al(a),
            g.preventDefault(),
            g.stopPropagation(),
            c(g))
        }
        ;
        this.H = function(g) {
            Il(e, g) && (Al(a),
            g.preventDefault(),
            g.stopPropagation(),
            d(g))
        }
        ;
        document.addEventListener("keydown", this.i, !1);
        document.addEventListener("keyup", this.H, !1)
    };
    q(Jl, C);
    var Il = function(a, b) {
        return a.T[b.which] && !b.ctrlKey && !b.metaKey && !b.altKey && (!a.g || a.g != document.activeElement)
    };
    Jl.prototype.j = function() {
        document.removeEventListener("keydown", this.i, !1);
        document.removeEventListener("keyup", this.H, !1);
        C.prototype.j.call(this)
    }
    ;
    var Kl = function() {};
    Kl.prototype.g = function() {
        return !0
    }
    ;
    var Ll = function() {};
    q(Ll, Kl);
    Ll.prototype.j = function() {
        return !1
    }
    ;
    (function() {
        var a = new Ll;
        a.j = function() {
            return !0
        }
        ;
        a.g = function() {
            return !1
        }
        ;
        return a
    }
    )();
    var Nl = function() {
        this.va = !0;
        this.S = !1;
        this.H = [];
        this.v = !1;
        this.g = this.T = this.i = 0;
        this.o = Ml
    };
    Ia(Nl, C);
    ya(Nl);
    var Ml = 1E3 / 60
      , Ol = function(a) {
        this.j = 1E3 / 60;
        this.i = a;
        this.g = Nl.ka().i;
        this.H = 0
    }
      , Pl = function(a) {
        var b = a.i(a.H);
        a.H++;
        a.g = Nl.ka().i + a.j / Nl.ka().o;
        return b
    };
    Ol.prototype.cancel = function() {
        this.i = function() {
            return !1
        }
    }
    ;
    var Rl = function(a, b) {
        b = new Ol(b);
        Ql(a, b)
    }
      , Ql = function(a, b) {
        a.H.push(b);
        a.v = !0
    }
      , Tl = function(a) {
        if (a.va)
            a.S = !1;
        else {
            a.S = !0;
            Sl(a);
            a.v && (a.H.sort(function(e, f) {
                return e.g == f.g ? f.j - e.j : e.g - f.g
            }),
            a.v = !1);
            for (var b = 0, c = 0, d; d = a.H[c]; c++)
                if (d.g <= a.i)
                    Pl(d) && Ql(a, d),
                    b++;
                else
                    break;
            a.H.splice(0, b);
            a.i++;
            requestAnimationFrame(function() {
                Tl(a)
            })
        }
    }
      , Sl = function(a) {
        var b = (new Date).getTime();
        30 < a.i && a.T && (b - a.T >= 1.05 * a.o ? a.g++ : a.g >>= 1,
        20 < a.g && (a.o = Math.min(50, 1.2 * a.o),
        a.g = 0));
        a.T = b
    };
    Nl.prototype.start = function() {
        this.va = !1;
        this.S || Tl(this)
    }
    ;
    Nl.prototype.stop = function() {
        this.va = !0;
        this.T = this.g = 0
    }
    ;
    Nl.prototype.j = function() {
        this.reset();
        Nl.Ab.j.call(this)
    }
    ;
    Nl.prototype.reset = function() {
        this.stop();
        this.H = [];
        this.i = 0;
        this.v = !1;
        this.o = Ml;
        this.T = this.g = 0
    }
    ;
    var Vl = function(a, b, c) {
        var d = Ul;
        this.H = a;
        this.T = b;
        this.o = {};
        this.duration = 400;
        this.v = d || Og;
        this.i = c || wc;
        this.g = null;
        this.j = !1
    }
      , Xl = function(a) {
        var b = Math.min(Math.max(Wl(a) / a.duration, 0), 1);
        a.j && (b = 1 - b);
        for (var c in a.H)
            if (a.T.hasOwnProperty(c)) {
                var d = a.o
                  , e = c;
                var f = a.H[c];
                var g = a.T[c]
                  , h = a.v;
                h = void 0 === h ? Og : h;
                f += h(b) * (g - f);
                d[e] = f
            }
        return a.o
    }
      , Wl = function(a) {
        return null === a.g ? 0 : a.i() - a.g
    };
    Vl.prototype.start = function() {
        this.g = this.i();
        this.j = !1
    }
    ;
    Vl.prototype.resume = function() {
        if (null !== this.g) {
            if (this.j) {
                var a = Math.min(this.duration, Wl(this));
                this.g = this.i() - (this.duration - a);
                this.j = !1
            }
        } else
            this.start()
    }
    ;
    Vl.prototype.reset = function() {
        this.g = null
    }
    ;
    var Ul = function(a) {
        return 3 * a * a - 2 * a * a * a
    };
    var Yl = function(a, b) {
        C.call(this);
        this.i = !1;
        this.g = a;
        this.o = b || null;
        this.T = function() {
            return !1
        }
        ;
        this.H = null;
        Xj() && (this.g.style.willChange = "width,height")
    };
    q(Yl, C);
    var Zl = function(a) {
        var b = void 0 === b ? function() {}
        : b;
        var c = void 0 === c ? 0 : c;
        if (a.g && Xj() && !a.i) {
            var d = a.g;
            if (rc()) {
                var e = {
                    cmd: "resizeDoodle",
                    width: wd + "px",
                    height: xd + "px",
                    duration: "400ms"
                };
                "1" == hc.g.get("ntp") ? window.parent.postMessage(e, "chrome-search://local-ntp") : window.top.postMessage(e, "chrome://new-tab-page");
                a.i = !0;
                var f = !1;
                a.H = setTimeout(function() {
                    f = !0;
                    b()
                }, 500);
                window.addEventListener("message", function(t) {
                    "resizeComplete" === t.data.Gd && (null !== a.H && (clearTimeout(a.H),
                    a.H = null),
                    f || (f = !0,
                    b()))
                })
            } else {
                document.getElementById("fkbx") && vc(d.parentNode, "width", "100%");
                e = d.offsetHeight;
                var g = d.offsetWidth;
                c = Math.min(wd, d.parentNode.clientWidth) - 2 * c;
                var h = c / (wd / xd)
                  , k = Nl.ka()
                  , l = wc()
                  , p = new Vl({
                    height: e,
                    width: g
                },{
                    height: h,
                    width: c
                },function() {
                    return l
                }
                );
                p.start();
                a.i = !0;
                a.T = function(t) {
                    l = void 0 !== t ? l + t : wc();
                    t = Xl(p);
                    Jc(d, Math.round(t.width), Math.round(t.height));
                    a.o && a.o.g(!1);
                    return Wl(p) >= p.duration ? (b(),
                    a.g.style.willChange = "unset",
                    a.T = function() {
                        return !1
                    }
                    ,
                    !1) : !0
                }
                ;
                Rl(k, function() {
                    return a.T()
                })
            }
        }
    };
    Yl.prototype.j = function() {
        C.prototype.j.call(this);
        this.reset();
        this.g = null
    }
    ;
    Yl.prototype.reset = function() {
        this.i && (vc(this.g, "width", "", "height", ""),
        Ic(0),
        this.g.style.width = "",
        this.g.style.height = "");
        this.i = !1
    }
    ;
    var $l = function() {
        this.ha = this.U = this.V = this.i = this.j = null;
        this.$ = !1;
        this.S = null;
        this.o = this.va = this.H = this.T = !1;
        this.g = !0;
        this.W = this.Fa = !1;
        this.v = null
    };
    $l.prototype.reset = function() {
        this.ha = this.U = this.V = this.i = this.j = null;
        this.$ = !1;
        this.S = null;
        this.o = this.va = this.H = this.T = !1;
        this.g = !0;
        this.W = this.Fa = !1;
        this.v = null
    }
    ;
    var bm = function(a) {
        a.T && (a.W ? (am.call(document),
        a.W = !1) : (a.S.call(a.i),
        a.v && (window.screen.lockOrientation && window.screen.lockOrientation(a.v),
        window.screen.orientation && window.screen.orientation.lock && window.screen.orientation.lock(a.v).catch(xa))))
    }
      , dm = function(a, b, c) {
        var d = void 0
          , e = !1;
        d = void 0 === d ? xa : d;
        e = void 0 === e ? !0 : e;
        a.i = b;
        a.j = c;
        a.V = d;
        a.o = !1;
        a.S = b[Cc(b, "requestFullscreen")];
        b = !!(document[Cc(document, "fullscreenEnabled")] && a.S && am);
        a.T = Zj() && b;
        a.H = e && Yj();
        a.va = !e && Yj();
        a.g = !0;
        if (a.T || a.H)
            vc(document.body, "margin", "0"),
            vc(a.i, "overflow", "visible", "width", "100%", "height", "100%"),
            document.body.scrollLeft = 0,
            we(window, "scroll", cm, !0)
    }
      , em = function(a, b) {
        a.j.push(b);
        a.g = !0
    };
    $l.prototype.close = function() {
        this.W = !0;
        bm(this)
    }
    ;
    var fm = function(a, b) {
        var c = document.createElement("div");
        c.style.pointerEvents = "none";
        c.style.position = "absolute";
        c.style.top = "0";
        c.style.left = "0";
        c.style.width = "100%";
        c.style.height = "100%";
        c.style.direction = "ltr";
        c.dataset.width = a;
        c.dataset.height = b;
        return c
    };
    ya($l);
    var gm = Cc(document, "fullscreenElement")
      , am = document[Cc(document, "exitFullscreen")]
      , cm = function(a) {
        a.preventDefault();
        a.stopPropagation();
        return !1
    };
    var hm = function(a, b) {
        window.google && google.doodle && (b && Ha("google.doodle.cpDestroy", b),
        Ha("google.doodle.cpInit", function() {
            b && b();
            a()
        }))
    };
    var im = function(a, b, c, d) {
        this.g = 0;
        this.j = a;
        this.H = void 0 === c ? 3 : c;
        this.i = b;
        this.T = void 0 === d ? 2E3 : d
    };
    im.prototype.fetch = function(a, b, c) {
        var d = this;
        b = void 0 === b ? function() {}
        : b;
        c = new Ob(((void 0 === c ? 0 : c) ? "//www.google.com" : "") + "/async/" + this.j);
        Rb(c, a);
        c = c.toString();
        this.g++;
        b(this.g);
        return jm(this, c).catch(function(e) {
            return d.g < d.H ? d.i(d.T * Math.pow(2, d.g - 1)).finally(function() {
                return d.fetch(a, b)
            }) : Promise.reject(e)
        }).finally(function() {
            return d.g = 0
        })
    }
    ;
    var jm = function(a, b) {
        var c = new XMLHttpRequest;
        c.open("GET", b);
        return new Promise(function(d, e) {
            c.send();
            c.onreadystatechange = function() {
                if (4 == c.readyState)
                    if (200 == c.status && c.responseText)
                        a: {
                            var f = c.responseText;
                            f.startsWith(")]}'\n") && (f = f.substring(5));
                            var g = {};
                            try {
                                g = JSON.parse(f)
                            } catch (h) {
                                e(f);
                                break a
                            }
                            g.hasOwnProperty(a.j) && (g = g[a.j]);
                            g.hasOwnProperty("__err__") ? e(g.__err__) : d(g)
                        }
                    else
                        e(c)
            }
        }
        )
    };
    var km = function(a, b, c) {
        im.call(this, a, function(d) {
            return new Promise(function(e) {
                return setTimeout(e, d)
            }
            )
        }, void 0 === b ? 3 : b, void 0 === c ? 2E3 : c)
    };
    q(km, im);
    var lm = function() {}
      , mm = "function" == typeof Uint8Array
      , nm = []
      , om = function(a, b) {
        if (b < a.H) {
            b += a.T;
            var c = a.g[b];
            return c === nm ? a.g[b] = [] : c
        }
        if (a.j)
            return c = a.j[b],
            c === nm ? a.j[b] = [] : c
    }
      , pm = function(a) {
        if (a.i)
            for (var b in a.i) {
                var c = a.i[b];
                if ("array" == za(c))
                    for (var d = 0; d < c.length; d++)
                        c[d] && c[d].xc();
                else
                    c && c.xc()
            }
    };
    lm.prototype.xc = function() {
        pm(this)
    }
    ;
    lm.prototype.toString = function() {
        pm(this);
        return this.g.toString()
    }
    ;
    var qm = function(a) {
        this.i = null;
        a || (a = []);
        this.T = -1;
        this.g = a;
        a: {
            if (a = this.g.length) {
                --a;
                var b = this.g[a];
                if (!(null === b || "object" != typeof b || Array.isArray(b) || mm && b instanceof Uint8Array)) {
                    this.H = a - -1;
                    this.j = b;
                    break a
                }
            }
            this.H = Number.MAX_VALUE
        }
    };
    Ia(qm, lm);
    var rm = function() {
        var a = void 0 === a ? !1 : a;
        if (Oc() && Nc())
            return Promise.resolve();
        var b = "_fmt:jspb,doodle:119273973,slot:0,type:3,cta:1";
        sc() && (b += ",ntp:1");
        if (Oc() || a)
            b += ",impr:0";
        a = new Ub;
        a.add("async", b);
        return (new km("ddllog",1)).fetch(a, void 0, !1).then(function(c) {
            c = new qm(c);
            if (!Oc() && om(c, 2)) {
                var d = om(c, 2);
                Kc = (new Ob(d)).g.get("ved", "")
            }
            !Nc() && om(c, 3) && (Mc = om(c, 3))
        }).catch(function() {
            return Promise.resolve()
        })
    };
    var sm = function(a, b) {
        b = void 0 === b ? 50 : b;
        C.call(this);
        this.v = a;
        this.H = 0;
        this.i = this.g = !1;
        this.o = b;
        this.T = 0
    };
    q(sm, C);
    sm.prototype.start = function() {
        this.H = Ga();
        var a = !this.i && !this.g;
        this.i = !1;
        this.g = !0;
        a && tm(this)
    }
    ;
    var tm = function(a) {
        a.i ? a.i = !1 : (requestAnimationFrame(function() {
            return tm(a)
        }),
        um(a))
    }
      , um = function(a) {
        var b = Ga()
          , c = b - a.H;
        c < a.T || (c = a.o ? Math.min(c, a.o) : c,
        a.H = b,
        a.v(c))
    };
    sm.prototype.j = function() {
        this.g && (this.i = !0,
        this.g = !1);
        C.prototype.j.call(this)
    }
    ;
    var Vg = Ug.ka()
      , vm = Sc.ka()
      , kf = of.ka()
      , wm = function() {};
    q(wm, Yg);
    wm.prototype.g = function() {
        return kf
    }
    ;
    wm.prototype.j = function() {
        return vm
    }
    ;
    var zm = function(a, b, c) {
        C.call(this);
        var d = this;
        this.Ta = a;
        this.g = b;
        this.va = b.getContext("2d");
        this.hb = c;
        this.ta = new wl(6E4,function() {
            var g = W.ka();
            g.T || g.g.suspend();
            g.T = !0;
            g = d.Ba;
            g.g && (g.g = !1,
            g.i = !0)
        }
        ,function() {
            d.start()
        }
        );
        Ld(this, Fa(Md, this.ta));
        this.Ba = new sm(function(g) {
            var h = g * d.V
              , k = d.$a;
            k.j++;
            k.g += g;
            1E4 <= k.g && (g = k.g / k.j / 1E3,
            x(w.ka(), 1001, 1 / g),
            k.j = 0,
            k.g = 0);
            md.width = d.va.canvas.width;
            md.height = d.va.canvas.height;
            k = d.ya;
            if (k.T || k.H || k.va) {
                g = !!document[gm];
                var l = window.innerWidth
                  , p = window.innerHeight;
                0 == window.scrollX && 0 == window.scrollY || window.scrollTo(0, 0);
                if (l != k.U || p != k.ha || g != k.$ || k.g) {
                    k.Fa = l < p;
                    for (var t = !1, B = 0; B < k.j.length; ++B) {
                        var G = k.j[B]
                          , L = G.width || G.dataset.width
                          , R = G.height || G.dataset.height;
                        if (k.H) {
                            if (uc())
                                throw "";
                            Yj() && nc && !kc && !mc && 0 == B && (t = L < R != k.Fa);
                            var fa = t ? Math.min(l / R, p / L) : Math.min(l / L, p / R)
                              , sa = fa * L
                              , Fd = fa * R
                              , Qi = k.o ? "scale(" + fa + ") " : "";
                            if (t) {
                                fa = (l - Fd) / 2 + Fd;
                                var Ri = (p - sa) / 2;
                                Qi += "rotate(90deg)"
                            } else
                                fa = (l - sa) / 2,
                                Ri = (p - Fd) / 2;
                            L = k.o ? L : sa;
                            R = k.o ? R : Fd;
                            Ac(G, "TransformOrigin", "0 0");
                            Ac(G, "Transform", Qi);
                            vc(G, "position", "absolute", "width", L + "px", "height", R + "px", "left", fa + "px", "top", Ri + "px")
                        } else
                            ic && vc(G, "height", p + "px")
                    }
                    k.va || u(gc, "CriOS") || document.body.clientWidth > l && 0 < l && vc(document.body, "width", l + "px");
                    vc(k.i, "height", "100%", "width", "100%");
                    k.V(t);
                    k.U = l;
                    k.ha = p;
                    k.$ = g;
                    k.g = !1
                }
            }
            d.Ea.T(void 0);
            k = d.La;
            k.g.clientWidth == k.H && k.g.clientHeight == k.i || Fl(k);
            d.va.save();
            d.va.clearRect(0, 0, d.va.canvas.width, d.va.canvas.height);
            k = d.va;
            g = d.S;
            Wg(h);
            Xg(g);
            h = Vg;
            k.setTransform(1, 0, 0, 1, 0, 0);
            k.clearRect(0, 0, k.canvas.width, k.canvas.height);
            h = n(h.i);
            for (g = h.next(); !g.done; g = h.next())
                g = g.value,
                l = k,
                g.W && (l.globalAlpha = g.S,
                l.setTransform(g.W.g, g.W.i, g.W.H, g.W.j, g.W.T, g.W.o),
                l.globalCompositeOperation = g.Dd,
                g.Oa(l),
                l.globalCompositeOperation = "source-over");
            d.va.restore();
            h = d.Sa;
            $l.ka();
            h.g.style.display = document[gm] ? "block" : "none"
        }
        );
        Ld(this, Fa(Md, this.Ba));
        this.Pa = function() {
            Al(d.ta)
        }
        ;
        window.addEventListener("orientationchange", this.Pa, !1);
        this.ya = $l.ka();
        dm(this.ya, a, [b]);
        this.Ca = fm(b.width, b.height);
        a.appendChild(this.Ca);
        em(this.ya, this.Ca);
        this.La = new Gl(b);
        this.Ea = new Yl(a);
        this.i = 2;
        this.V = 1;
        this.S = new wg;
        xg(this.S, b);
        this.W = new Vi(this.S);
        var e = new D;
        e.Aa = function() {
            var g = b.clientWidth / 768;
            1 < g || (g = -7 * (1 / g - 1),
            g != e.g.g && (e.j(0, -g / 2, g),
            d.S.S.clear()))
        }
        ;
        E(this.S, e);
        c = Vg.g;
        E(e, c);
        E(this.W, c);
        this.Fa = new I;
        E(this.Fa, c);
        var f = document.createElement("style");
        f.innerText = "@-webkit-keyframes messageAnimation{0%{opacity:0;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}20%,80%{opacity:1;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}100%{opacity:0;-webkit-transform:translate(0,-50%);transform:translate(0,-50%)}}@-moz-keyframes messageAnimation{0%{opacity:0;-moz-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}20%,80%{opacity:1;-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}100%{opacity:0;-moz-transform:translate(0,-50%);transform:translate(0,-50%)}}@-o-keyframes messageAnimation{0%{opacity:0;-o-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}20%,80%{opacity:1;-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}100%{opacity:0;-o-transform:translate(0,-50%);transform:translate(0,-50%)}}@keyframes messageAnimation{0%{opacity:0;-webkit-transform:translate(-100%,-50%);-moz-transform:translate(-100%,-50%);-o-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}20%,80%{opacity:1;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}100%{opacity:0;-webkit-transform:translate(0,-50%);-moz-transform:translate(0,-50%);-o-transform:translate(0,-50%);transform:translate(0,-50%)}}.ddljly-a{font-size:40px;top:50%;left:50%;position:absolute;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background:-webkit-gradient(linear,left top, right top,from(rgba(50,97,165,0)),color-stop(20%, rgba(50,97,165,1)),color-stop(80%, rgba(50,97,165,1)),to(rgba(50,97,165,0)));background:-webkit-linear-gradient(left,rgba(50,97,165,0) 0%,rgba(50,97,165,1) 20%,rgba(50,97,165,1) 80%,rgba(50,97,165,0) 100%);background:-moz-linear-gradient(left,rgba(50,97,165,0) 0%,rgba(50,97,165,1) 20%,rgba(50,97,165,1) 80%,rgba(50,97,165,0) 100%);background:-o-linear-gradient(left,rgba(50,97,165,0) 0%,rgba(50,97,165,1) 20%,rgba(50,97,165,1) 80%,rgba(50,97,165,0) 100%);background:linear-gradient(90deg,rgba(50,97,165,0) 0%,rgba(50,97,165,1) 20%,rgba(50,97,165,1) 80%,rgba(50,97,165,0) 100%);color:#fff;font-family:Asap;font-weight:bold;padding:5px 30px;opacity:0;white-space:nowrap}.ddljly-b{-webkit-animation:messageAnimation 2s 1;-moz-animation:messageAnimation 2s 1;-o-animation:messageAnimation 2s 1;animation:messageAnimation 2s 1}";
        a.appendChild(f);
        this.v = new pl(this.Ca);
        E(this.v, c);
        this.wa = new dk(new r(0,0,A.g + 92 - 5));
        F(this.wa, 1.5);
        this.Na = new Gj(10,400);
        this.T = new Jj;
        this.o = new dl(b,this.wa);
        E(this.o, this.T);
        this.Ga = new Dl(this.ta,b);
        El(this.Ga, el(this.o));
        Ld(this, Fa(Md, this.Ga));
        this.ab = new Jl(this.ta,[32],function(g) {
            32 == g.which && (g = d.o,
            0 == g.ha || 2 == g.ha ? g.v.i(!0) : 1 == g.ha && g.W.i(!0))
        }
        ,function(g) {
            32 == g.which && (g = d.o,
            0 == g.ha || 2 == g.ha ? g.v.i(!1) : 1 == g.ha && g.W.i(!1))
        }
        );
        Ld(this, Fa(Md, this.ab));
        this.$ = new D;
        this.$.Aa = function(g) {
            var h = d.T.o;
            h = Math.asin(H(h).x / pd(H(d.S), H(h)));
            Ag(d.S, Gb(d.S.o) + g / 500 * (Gb(Eb(h, -Math.PI / 5, Math.PI / 5)) - Gb(d.S.o)))
        }
        ;
        w.ka().addListener(this);
        w.ka().addListener(ol.ka());
        this.$a = new fj;
        this.Sa = new sl(this.Ca,function() {
            return d.ya.close()
        }
        );
        we(a, ["click", "touchend"], function() {
            Zj() && bm(d.ya);
            Al(d.ta)
        }, !0);
        ak() ? xm(this) : ym(this)
    };
    q(zm, C);
    var ym = function(a) {
        a.i = 4;
        a.Ba.T = 33;
        if (uc() ? "1" == hc.g.get("scta") : sc())
            a.g.style.background = "url(CTA_static.png)no-repeat bottom / contain";
        else {
            a.H = new Oh(Uc,.3 * a.g.width,.5 * a.g.height);
            S(a.H, 0, 0);
            a.H.v(!1);
            var b = function() {
                return Math.min(.4 * a.g.height, .2 * a.g.width)
            };
            U(a.H, b(), b());
            F(a.H, .75);
            var c = Am(a)
              , d = wd / xd;
            a.H.Aa = function(e) {
                var f = a.g.width
                  , g = a.g.height;
                a.g.width / a.g.height > d ? f = a.g.height * d : g = a.g.width / d;
                U(a.H, b(), b());
                a.H.j(.37 * f, .21 * g);
                c(e)
            }
            ;
            a.Ka = new M;
            a.Ka.Oa = function(e) {
                e.clearRect(0, 0, a.g.width, a.g.height)
            }
            ;
            ig(Ug.ka().g, a.Ka);
            ig(Ug.ka().g, a.H)
        }
    }
      , Bm = function(a) {
        Vg.j.push(new D);
        Vg.j.push(new D);
        var b = Vg.j[0]
          , c = new rh(a.va);
        E(c, b);
        E(a.Na, b);
        b = Vg.j[1];
        c = new hj(A);
        E(c, b);
        E(a.wa, b);
        E(a.T, Vg.g)
    }
      , Cm = function(a) {
        a.i = 2;
        J(a.Fa, 500, function() {
            W.g.hd.play();
            Wi(a.W, 0).then(function() {
                J(a.Fa, 100, function() {
                    a.i = 0;
                    il(a.o, 2)
                })
            })
        })
    }
      , xm = function(a) {
        a.i = 5;
        a.Ba.T = 0;
        a.H && jg(a.H);
        a.Ka && jg(a.Ka);
        Xj() && Zl(a.Ea);
        document.getElementById("hplogo").title = "";
        var b = new kl;
        E(b, Vg.g);
        ll(b);
        var c = [vm.preload(1), vm.preload(2)];
        Promise.all([].concat(la(a.hb), [vm.preload(0), W.j.Ac.preload(), new Promise(function(d) {
            return setTimeout(d, 2E3)
        }
        )])).then(function() {
            Bm(a);
            return new Promise(function(d) {
                return setTimeout(d, 1E3)
            }
            )
        }).then(function() {
            for (var d = kh(a.T.U), e = [], f = n(lj.values()), g = f.next(); !g.done; g = f.next()) {
                g = g.value;
                for (var h = n(g.Ya), k = h.next(); !k.done; k = h.next())
                    e.push(pf(k.value, d));
                h = n(g.kb);
                for (k = h.next(); !k.done; k = h.next())
                    e.push(pf(k.value, d));
                e.push(pf(g.Da, d))
            }
            return Promise.all(e)
        }).then(function() {
            return Promise.all(c)
        }).then(function() {
            ml(b);
            Cm(a)
        })
    }
      , Dm = function(a) {
        a.i = 2;
        a.wa.reset();
        il(a.o, 0);
        Wi(a.W, 0);
        wi();
        J(a.Fa, 1700, function() {
            a.V = .9;
            a.i = 1;
            Mj(a.T)
        })
    };
    zm.prototype.Za = function(a, b) {
        var c = this;
        switch (a) {
        case 3:
            jg(this.$);
            Wi(this.W, 0);
            break;
        case 2:
            ek(this.wa, b);
            3 == b ? rl(this.v, "You're out") : rl(this.v, "Strike");
            break;
        case 1:
            ig(Vg.g, new Ti(this.T.o));
            b ? (Wi(this.W, 1),
            rl(this.v, "Home Run"),
            ql(this.v, Math.round(b) + "ft"),
            Hj(this.Na)) : (E(this.$, this.W),
            Wi(this.W, 4));
            break;
        case 4:
            this.V = Math.min(this.V + .01 * b, 2);
            jg(this.$);
            sg(this.Fa, 0, function() {
                Wi(c.W, 0)
            });
            0 < b && rl(this.v, b + " Runs");
            break;
        case 23:
            1 == b ? rl(this.v, "Single") : 2 == b ? rl(this.v, "Double") : 3 == b && rl(this.v, "Triple");
            break;
        case 7:
            !Tj(this.T) || 1 != this.i && 0 != this.i || Lj(this.T);
            break;
        case 8:
            b && 0 == this.i ? (il(this.o, 0),
            J(this.Fa, 1E3, function() {
                il(c.o, 0);
                c.i = 1;
                x(w.ka(), 12);
                c.V = .9;
                Mj(c.T)
            })) : 4 == this.i && (x(w.ka(), 19),
            xm(this));
            break;
        case 5:
            Dm(this);
            break;
        case 22:
            this.V = 1;
            this.Fa.i = [];
            this.Fa.o = [];
            jg(this.$);
            this.i = 3;
            il(this.o, 1);
            break;
        case 1001:
            25 > b && 1 == this.i && Hl(this.La)
        }
    }
    ;
    zm.prototype.start = function() {
        var a = W.ka();
        a.T && a.g.resume();
        a.T = !1;
        this.Ta.classList.add("fpdoodleready");
        this.Ba.start()
    }
    ;
    var Am = function(a) {
        var b = 0
          , c = a.H.hb;
        return function(d) {
            F(a.H, c + Math.abs(Math.sin(b) / 5));
            b += d / 500
        }
    };
    zm.prototype.j = function() {
        window.removeEventListener("orientationchange", this.Pa, !1);
        this.Ea.reset();
        Ug.ka().reset();
        var a = w.ka();
        a.j = [];
        a.g = new Map;
        ol.ka().reset();
        C.prototype.j.call(this)
    }
    ;
    var Em = null;
    (function(a, b) {
        hm(function() {
            a()
        }, b);
        a()
    }
    )(function() {
        var a = document.getElementById("hplogo")
          , b = document.getElementById("hpcanvas");
        if (a && b) {
            nk.d3 = Ed ? "1" : "0";
            b.width = tc() ? 720 : 1280;
            b.height = tc() ? 1280 : 720;
            lk = Ga();
            nk.d = "119273973";
            !mk && ak() && (mk = !0,
            pk(10));
            qk(0);
            ci(a);
            var c = rm()
              , d = [lf(), new Promise(function(f) {
                return yc(f)
            }
            )]
              , e = [c, vm.preload(3), gk.ka().load(Gc, Hc, Ja, "")];
            c = function() {
                return Promise.all(e).catch(function() {
                    return console.error("Error loading assets.")
                }).then(function() {
                    Zg = new wm;
                    qk(1);
                    a && b && (Em = new zm(a,b,d),
                    Em.start())
                })
            }
            ;
            Ed ? (new Promise(function(f) {
                var g = document.createElement("iframe");
                we(window, "message", function(h) {
                    "doodleiframeloaded" == h.vb.data && f()
                });
                Cb(g);
                g.style.display = "none";
                document.body.appendChild(g);
                setTimeout(f, 2E3)
            }
            )).then(c) : c()
        }
    }, function() {
        for (var a = n(kf.j), b = a.next(); !b.done; b = a.next())
            b.value.T = [];
        Md(Em)
    });
}
).call(this);

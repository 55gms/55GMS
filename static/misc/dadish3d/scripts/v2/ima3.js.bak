// Copyright 2011 Google Inc. All Rights Reserved.
(function() {
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
        },
        ba = typeof Object.defineProperties == "function" ? Object.defineProperty : function(a, b, c) {
            if (a == Array.prototype || a == Object.prototype) return a;
            a[b] = c.value;
            return a
        },
        ca = function(a) {
            a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                if (c && c.Math == Math) return c
            }
            throw Error("Cannot find global object");
        },
        ea = ca(this),
        r = function(a, b) {
            if (b) a: {
                var c = ea;a = a.split(".");
                for (var d = 0; d < a.length - 1; d++) {
                    var e = a[d];
                    if (!(e in c)) break a;
                    c = c[e]
                }
                a = a[a.length - 1];d = c[a];b = b(d);b != d && b != null && ba(c, a, {
                    configurable: !0,
                    writable: !0,
                    value: b
                })
            }
        };
    r("Symbol", function(a) {
        if (a) return a;
        var b = function(f, g) {
            this.g = f;
            ba(this, "description", {
                configurable: !0,
                writable: !0,
                value: g
            })
        };
        b.prototype.toString = function() {
            return this.g
        };
        var c = "jscomp_symbol_" + (Math.random() * 1E9 >>> 0) + "_",
            d = 0,
            e = function(f) {
                if (this instanceof e) throw new TypeError("Symbol is not a constructor");
                return new b(c + (f || "") + "_" + d++, f)
            };
        return e
    });
    r("Symbol.iterator", function(a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = ea[b[c]];
            typeof d === "function" && typeof d.prototype[a] != "function" && ba(d.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return fa(aa(this))
                }
            })
        }
        return a
    });
    var fa = function(a) {
            a = {
                next: a
            };
            a[Symbol.iterator] = function() {
                return this
            };
            return a
        },
        ha = typeof Object.create == "function" ? Object.create : function(a) {
            var b = function() {};
            b.prototype = a;
            return new b
        },
        ka = function() {
            function a() {
                function c() {}
                new c;
                Reflect.construct(c, [], function() {});
                return new c instanceof c
            }
            if (typeof Reflect != "undefined" && Reflect.construct) {
                if (a()) return Reflect.construct;
                var b = Reflect.construct;
                return function(c, d, e) {
                    c = b(c, d);
                    e && Reflect.setPrototypeOf(c, e.prototype);
                    return c
                }
            }
            return function(c,
                d, e) {
                e === void 0 && (e = c);
                e = ha(e.prototype || Object.prototype);
                return Function.prototype.apply.call(c, e, d) || e
            }
        }(),
        la;
    if (typeof Object.setPrototypeOf == "function") la = Object.setPrototypeOf;
    else {
        var na;
        a: {
            var oa = {
                    a: !0
                },
                pa = {};
            try {
                pa.__proto__ = oa;
                na = pa.a;
                break a
            } catch (a) {}
            na = !1
        }
        la = na ? function(a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
            return a
        } : null
    }
    var qa = la,
        w = function(a, b) {
            a.prototype = ha(b.prototype);
            a.prototype.constructor = a;
            if (qa) qa(a, b);
            else
                for (var c in b)
                    if (c != "prototype")
                        if (Object.defineProperties) {
                            var d = Object.getOwnPropertyDescriptor(b, c);
                            d && Object.defineProperty(a, c, d)
                        } else a[c] = b[c];
            a.Ia = b.prototype
        },
        x = function(a) {
            var b = typeof Symbol != "undefined" && Symbol.iterator && a[Symbol.iterator];
            if (b) return b.call(a);
            if (typeof a.length == "number") return {
                next: aa(a)
            };
            throw Error(String(a) + " is not an iterable or ArrayLike");
        },
        ra = function(a) {
            if (!(a instanceof Array)) {
                a = x(a);
                for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
                a = c
            }
            return a
        },
        ta = function(a) {
            return sa(a, a)
        },
        sa = function(a, b) {
            a.raw = b;
            Object.freeze && (Object.freeze(a), Object.freeze(b));
            return a
        },
        va = function(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b)
        },
        wa = typeof Object.assign == "function" ? Object.assign : function(a, b) {
            for (var c = 1; c < arguments.length; c++) {
                var d = arguments[c];
                if (d)
                    for (var e in d) va(d, e) && (a[e] = d[e])
            }
            return a
        };
    r("Object.assign", function(a) {
        return a || wa
    });
    var xa = function() {
            this.B = !1;
            this.o = null;
            this.j = void 0;
            this.g = 1;
            this.J = this.l = 0;
            this.A = null
        },
        ya = function(a) {
            if (a.B) throw new TypeError("Generator is already running");
            a.B = !0
        };
    xa.prototype.C = function(a) {
        this.j = a
    };
    var za = function(a, b) {
        a.A = {
            Ee: b,
            Ig: !0
        };
        a.g = a.l || a.J
    };
    xa.prototype.return = function(a) {
        this.A = {
            return: a
        };
        this.g = this.J
    };
    var Aa = function(a, b, c) {
            a.g = c;
            return {
                value: b
            }
        },
        Ba = function(a) {
            a.g = 0;
            a.l = 0
        },
        Da = function(a) {
            a.l = 0;
            var b = a.A.Ee;
            a.A = null;
            return b
        },
        Ea = function(a) {
            this.g = new xa;
            this.j = a
        },
        Ha = function(a, b) {
            ya(a.g);
            var c = a.g.o;
            if (c) return Fa(a, "return" in c ? c["return"] : function(d) {
                return {
                    value: d,
                    done: !0
                }
            }, b, a.g.return);
            a.g.return(b);
            return Ga(a)
        },
        Fa = function(a, b, c, d) {
            try {
                var e = b.call(a.g.o, c);
                if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
                if (!e.done) return a.g.B = !1, e;
                var f = e.value
            } catch (g) {
                return a.g.o =
                    null, za(a.g, g), Ga(a)
            }
            a.g.o = null;
            d.call(a.g, f);
            return Ga(a)
        },
        Ga = function(a) {
            for (; a.g.g;) try {
                var b = a.j(a.g);
                if (b) return a.g.B = !1, {
                    value: b.value,
                    done: !1
                }
            } catch (c) {
                a.g.j = void 0, za(a.g, c)
            }
            a.g.B = !1;
            if (a.g.A) {
                b = a.g.A;
                a.g.A = null;
                if (b.Ig) throw b.Ee;
                return {
                    value: b.return,
                    done: !0
                }
            }
            return {
                value: void 0,
                done: !0
            }
        },
        Ia = function(a) {
            this.next = function(b) {
                ya(a.g);
                a.g.o ? b = Fa(a, a.g.o.next, b, a.g.C) : (a.g.C(b), b = Ga(a));
                return b
            };
            this.throw = function(b) {
                ya(a.g);
                a.g.o ? b = Fa(a, a.g.o["throw"], b, a.g.C) : (za(a.g, b), b = Ga(a));
                return b
            };
            this.return = function(b) {
                return Ha(a, b)
            };
            this[Symbol.iterator] = function() {
                return this
            }
        },
        Ja = function(a) {
            function b(d) {
                return a.next(d)
            }

            function c(d) {
                return a.throw(d)
            }
            return new Promise(function(d, e) {
                function f(g) {
                    g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
                }
                f(a.next())
            })
        },
        La = function(a) {
            return Ja(new Ia(new Ea(a)))
        },
        Ma = function() {
            for (var a = Number(this), b = [], c = a; c < arguments.length; c++) b[c - a] = arguments[c];
            return b
        };
    r("Reflect", function(a) {
        return a ? a : {}
    });
    r("Reflect.construct", function() {
        return ka
    });
    r("Reflect.setPrototypeOf", function(a) {
        return a ? a : qa ? function(b, c) {
            try {
                return qa(b, c), !0
            } catch (d) {
                return !1
            }
        } : null
    });
    r("Promise", function(a) {
        function b() {
            this.g = null
        }

        function c(g) {
            return g instanceof e ? g : new e(function(h) {
                h(g)
            })
        }
        if (a) return a;
        b.prototype.j = function(g) {
            if (this.g == null) {
                this.g = [];
                var h = this;
                this.l(function() {
                    h.A()
                })
            }
            this.g.push(g)
        };
        var d = ea.setTimeout;
        b.prototype.l = function(g) {
            d(g, 0)
        };
        b.prototype.A = function() {
            for (; this.g && this.g.length;) {
                var g = this.g;
                this.g = [];
                for (var h = 0; h < g.length; ++h) {
                    var k = g[h];
                    g[h] = null;
                    try {
                        k()
                    } catch (l) {
                        this.o(l)
                    }
                }
            }
            this.g = null
        };
        b.prototype.o = function(g) {
            this.l(function() {
                throw g;
            })
        };
        var e = function(g) {
            this.g = 0;
            this.l = void 0;
            this.j = [];
            this.C = !1;
            var h = this.o();
            try {
                g(h.resolve, h.reject)
            } catch (k) {
                h.reject(k)
            }
        };
        e.prototype.o = function() {
            function g(l) {
                return function(p) {
                    k || (k = !0, l.call(h, p))
                }
            }
            var h = this,
                k = !1;
            return {
                resolve: g(this.H),
                reject: g(this.A)
            }
        };
        e.prototype.H = function(g) {
            if (g === this) this.A(new TypeError("A Promise cannot resolve to itself"));
            else if (g instanceof e) this.M(g);
            else {
                a: switch (typeof g) {
                    case "object":
                        var h = g != null;
                        break a;
                    case "function":
                        h = !0;
                        break a;
                    default:
                        h = !1
                }
                h ?
                this.G(g) : this.B(g)
            }
        };
        e.prototype.G = function(g) {
            var h = void 0;
            try {
                h = g.then
            } catch (k) {
                this.A(k);
                return
            }
            typeof h == "function" ? this.P(h, g) : this.B(g)
        };
        e.prototype.A = function(g) {
            this.J(2, g)
        };
        e.prototype.B = function(g) {
            this.J(1, g)
        };
        e.prototype.J = function(g, h) {
            if (this.g != 0) throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.g);
            this.g = g;
            this.l = h;
            this.g === 2 && this.K();
            this.L()
        };
        e.prototype.K = function() {
            var g = this;
            d(function() {
                    if (g.F()) {
                        var h = ea.console;
                        typeof h !== "undefined" && h.error(g.l)
                    }
                },
                1)
        };
        e.prototype.F = function() {
            if (this.C) return !1;
            var g = ea.CustomEvent,
                h = ea.Event,
                k = ea.dispatchEvent;
            if (typeof k === "undefined") return !0;
            typeof g === "function" ? g = new g("unhandledrejection", {
                cancelable: !0
            }) : typeof h === "function" ? g = new h("unhandledrejection", {
                cancelable: !0
            }) : (g = ea.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
            g.promise = this;
            g.reason = this.l;
            return k(g)
        };
        e.prototype.L = function() {
            if (this.j != null) {
                for (var g = 0; g < this.j.length; ++g) f.j(this.j[g]);
                this.j =
                    null
            }
        };
        var f = new b;
        e.prototype.M = function(g) {
            var h = this.o();
            g.Ac(h.resolve, h.reject)
        };
        e.prototype.P = function(g, h) {
            var k = this.o();
            try {
                g.call(h, k.resolve, k.reject)
            } catch (l) {
                k.reject(l)
            }
        };
        e.prototype.then = function(g, h) {
            function k(q, t) {
                return typeof q == "function" ? function(u) {
                    try {
                        l(q(u))
                    } catch (v) {
                        p(v)
                    }
                } : t
            }
            var l, p, n = new e(function(q, t) {
                l = q;
                p = t
            });
            this.Ac(k(g, l), k(h, p));
            return n
        };
        e.prototype.catch = function(g) {
            return this.then(void 0, g)
        };
        e.prototype.Ac = function(g, h) {
            function k() {
                switch (l.g) {
                    case 1:
                        g(l.l);
                        break;
                    case 2:
                        h(l.l);
                        break;
                    default:
                        throw Error("Unexpected state: " + l.g);
                }
            }
            var l = this;
            this.j == null ? f.j(k) : this.j.push(k);
            this.C = !0
        };
        e.resolve = c;
        e.reject = function(g) {
            return new e(function(h, k) {
                k(g)
            })
        };
        e.race = function(g) {
            return new e(function(h, k) {
                for (var l = x(g), p = l.next(); !p.done; p = l.next()) c(p.value).Ac(h, k)
            })
        };
        e.all = function(g) {
            var h = x(g),
                k = h.next();
            return k.done ? c([]) : new e(function(l, p) {
                function n(u) {
                    return function(v) {
                        q[u] = v;
                        t--;
                        t == 0 && l(q)
                    }
                }
                var q = [],
                    t = 0;
                do q.push(void 0), t++, c(k.value).Ac(n(q.length -
                    1), p), k = h.next(); while (!k.done)
            })
        };
        return e
    });
    r("Object.setPrototypeOf", function(a) {
        return a || qa
    });
    r("Symbol.dispose", function(a) {
        return a ? a : Symbol("Symbol.dispose")
    });
    r("Array.prototype.find", function(a) {
        return a ? a : function(b, c) {
            a: {
                var d = this;d instanceof String && (d = String(d));
                for (var e = d.length, f = 0; f < e; f++) {
                    var g = d[f];
                    if (b.call(c, g, f, d)) {
                        b = g;
                        break a
                    }
                }
                b = void 0
            }
            return b
        }
    });
    r("WeakMap", function(a) {
        function b() {}

        function c(k) {
            var l = typeof k;
            return l === "object" && k !== null || l === "function"
        }

        function d(k) {
            if (!va(k, f)) {
                var l = new b;
                ba(k, f, {
                    value: l
                })
            }
        }

        function e(k) {
            var l = Object[k];
            l && (Object[k] = function(p) {
                if (p instanceof b) return p;
                Object.isExtensible(p) && d(p);
                return l(p)
            })
        }
        if (function() {
                if (!a || !Object.seal) return !1;
                try {
                    var k = Object.seal({}),
                        l = Object.seal({}),
                        p = new a([
                            [k, 2],
                            [l, 3]
                        ]);
                    if (p.get(k) != 2 || p.get(l) != 3) return !1;
                    p.delete(k);
                    p.set(l, 4);
                    return !p.has(k) && p.get(l) == 4
                } catch (n) {
                    return !1
                }
            }()) return a;
        var f = "$jscomp_hidden_" + Math.random();
        e("freeze");
        e("preventExtensions");
        e("seal");
        var g = 0,
            h = function(k) {
                this.g = (g += Math.random() + 1).toString();
                if (k) {
                    k = x(k);
                    for (var l; !(l = k.next()).done;) l = l.value, this.set(l[0], l[1])
                }
            };
        h.prototype.set = function(k, l) {
            if (!c(k)) throw Error("Invalid WeakMap key");
            d(k);
            if (!va(k, f)) throw Error("WeakMap key fail: " + k);
            k[f][this.g] = l;
            return this
        };
        h.prototype.get = function(k) {
            return c(k) && va(k, f) ? k[f][this.g] : void 0
        };
        h.prototype.has = function(k) {
            return c(k) && va(k, f) && va(k[f],
                this.g)
        };
        h.prototype.delete = function(k) {
            return c(k) && va(k, f) && va(k[f], this.g) ? delete k[f][this.g] : !1
        };
        return h
    });
    r("Map", function(a) {
        if (function() {
                if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") return !1;
                try {
                    var h = Object.seal({
                            x: 4
                        }),
                        k = new a(x([
                            [h, "s"]
                        ]));
                    if (k.get(h) != "s" || k.size != 1 || k.get({
                            x: 4
                        }) || k.set({
                            x: 4
                        }, "t") != k || k.size != 2) return !1;
                    var l = k.entries(),
                        p = l.next();
                    if (p.done || p.value[0] != h || p.value[1] != "s") return !1;
                    p = l.next();
                    return p.done || p.value[0].x != 4 || p.value[1] != "t" || !l.next().done ? !1 : !0
                } catch (n) {
                    return !1
                }
            }()) return a;
        var b = new WeakMap,
            c = function(h) {
                this[0] = {};
                this[1] =
                    f();
                this.size = 0;
                if (h) {
                    h = x(h);
                    for (var k; !(k = h.next()).done;) k = k.value, this.set(k[0], k[1])
                }
            };
        c.prototype.set = function(h, k) {
            h = h === 0 ? 0 : h;
            var l = d(this, h);
            l.list || (l.list = this[0][l.id] = []);
            l.oa ? l.oa.value = k : (l.oa = {
                next: this[1],
                Xa: this[1].Xa,
                head: this[1],
                key: h,
                value: k
            }, l.list.push(l.oa), this[1].Xa.next = l.oa, this[1].Xa = l.oa, this.size++);
            return this
        };
        c.prototype.delete = function(h) {
            h = d(this, h);
            return h.oa && h.list ? (h.list.splice(h.index, 1), h.list.length || delete this[0][h.id], h.oa.Xa.next = h.oa.next, h.oa.next.Xa =
                h.oa.Xa, h.oa.head = null, this.size--, !0) : !1
        };
        c.prototype.clear = function() {
            this[0] = {};
            this[1] = this[1].Xa = f();
            this.size = 0
        };
        c.prototype.has = function(h) {
            return !!d(this, h).oa
        };
        c.prototype.get = function(h) {
            return (h = d(this, h).oa) && h.value
        };
        c.prototype.entries = function() {
            return e(this, function(h) {
                return [h.key, h.value]
            })
        };
        c.prototype.keys = function() {
            return e(this, function(h) {
                return h.key
            })
        };
        c.prototype.values = function() {
            return e(this, function(h) {
                return h.value
            })
        };
        c.prototype.forEach = function(h, k) {
            for (var l = this.entries(),
                    p; !(p = l.next()).done;) p = p.value, h.call(k, p[1], p[0], this)
        };
        c.prototype[Symbol.iterator] = c.prototype.entries;
        var d = function(h, k) {
                var l = k && typeof k;
                l == "object" || l == "function" ? b.has(k) ? l = b.get(k) : (l = "" + ++g, b.set(k, l)) : l = "p_" + k;
                var p = h[0][l];
                if (p && va(h[0], l))
                    for (h = 0; h < p.length; h++) {
                        var n = p[h];
                        if (k !== k && n.key !== n.key || k === n.key) return {
                            id: l,
                            list: p,
                            index: h,
                            oa: n
                        }
                    }
                return {
                    id: l,
                    list: p,
                    index: -1,
                    oa: void 0
                }
            },
            e = function(h, k) {
                var l = h[1];
                return fa(function() {
                    if (l) {
                        for (; l.head != h[1];) l = l.Xa;
                        for (; l.next != l.head;) return l =
                            l.next, {
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
            },
            f = function() {
                var h = {};
                return h.Xa = h.next = h.head = h
            },
            g = 0;
        return c
    });
    r("Set", function(a) {
        if (function() {
                if (!a || typeof a != "function" || !a.prototype.entries || typeof Object.seal != "function") return !1;
                try {
                    var c = Object.seal({
                            x: 4
                        }),
                        d = new a(x([c]));
                    if (!d.has(c) || d.size != 1 || d.add(c) != d || d.size != 1 || d.add({
                            x: 4
                        }) != d || d.size != 2) return !1;
                    var e = d.entries(),
                        f = e.next();
                    if (f.done || f.value[0] != c || f.value[1] != c) return !1;
                    f = e.next();
                    return f.done || f.value[0] == c || f.value[0].x != 4 || f.value[1] != f.value[0] ? !1 : e.next().done
                } catch (g) {
                    return !1
                }
            }()) return a;
        var b = function(c) {
            this.g = new Map;
            if (c) {
                c =
                    x(c);
                for (var d; !(d = c.next()).done;) this.add(d.value)
            }
            this.size = this.g.size
        };
        b.prototype.add = function(c) {
            c = c === 0 ? 0 : c;
            this.g.set(c, c);
            this.size = this.g.size;
            return this
        };
        b.prototype.delete = function(c) {
            c = this.g.delete(c);
            this.size = this.g.size;
            return c
        };
        b.prototype.clear = function() {
            this.g.clear();
            this.size = 0
        };
        b.prototype.has = function(c) {
            return this.g.has(c)
        };
        b.prototype.entries = function() {
            return this.g.entries()
        };
        b.prototype.values = function() {
            return this.g.values()
        };
        b.prototype.keys = b.prototype.values;
        b.prototype[Symbol.iterator] = b.prototype.values;
        b.prototype.forEach = function(c, d) {
            var e = this;
            this.g.forEach(function(f) {
                return c.call(d, f, f, e)
            })
        };
        return b
    });
    r("Object.values", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) va(b, d) && c.push(b[d]);
            return c
        }
    });
    r("Object.is", function(a) {
        return a ? a : function(b, c) {
            return b === c ? b !== 0 || 1 / b === 1 / c : b !== b && c !== c
        }
    });
    r("Array.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (c < 0 && (c = Math.max(c + e, 0)); c < e; c++) {
                var f = d[c];
                if (f === b || Object.is(f, b)) return !0
            }
            return !1
        }
    });
    var Na = function(a, b, c) {
        if (a == null) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
        if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
        return a + ""
    };
    r("String.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            return Na(this, b, "includes").indexOf(b, c || 0) !== -1
        }
    });
    r("Array.from", function(a) {
        return a ? a : function(b, c, d) {
            c = c != null ? c : function(h) {
                return h
            };
            var e = [],
                f = typeof Symbol != "undefined" && Symbol.iterator && b[Symbol.iterator];
            if (typeof f == "function") {
                b = f.call(b);
                for (var g = 0; !(f = b.next()).done;) e.push(c.call(d, f.value, g++))
            } else
                for (f = b.length, g = 0; g < f; g++) e.push(c.call(d, b[g], g));
            return e
        }
    });
    r("Object.entries", function(a) {
        return a ? a : function(b) {
            var c = [],
                d;
            for (d in b) va(b, d) && c.push([d, b[d]]);
            return c
        }
    });
    r("Number.isFinite", function(a) {
        return a ? a : function(b) {
            return typeof b !== "number" ? !1 : !isNaN(b) && b !== Infinity && b !== -Infinity
        }
    });
    r("Number.MAX_SAFE_INTEGER", function() {
        return 9007199254740991
    });
    r("Number.MIN_SAFE_INTEGER", function() {
        return -9007199254740991
    });
    r("Number.isInteger", function(a) {
        return a ? a : function(b) {
            return Number.isFinite(b) ? b === Math.floor(b) : !1
        }
    });
    r("Number.isSafeInteger", function(a) {
        return a ? a : function(b) {
            return Number.isInteger(b) && Math.abs(b) <= Number.MAX_SAFE_INTEGER
        }
    });
    r("String.prototype.startsWith", function(a) {
        return a ? a : function(b, c) {
            var d = Na(this, b, "startsWith");
            b += "";
            var e = d.length,
                f = b.length;
            c = Math.max(0, Math.min(c | 0, d.length));
            for (var g = 0; g < f && c < e;)
                if (d[c++] != b[g++]) return !1;
            return g >= f
        }
    });
    var Oa = function(a, b) {
        a instanceof String && (a += "");
        var c = 0,
            d = !1,
            e = {
                next: function() {
                    if (!d && c < a.length) {
                        var f = c++;
                        return {
                            value: b(f, a[f]),
                            done: !1
                        }
                    }
                    d = !0;
                    return {
                        done: !0,
                        value: void 0
                    }
                }
            };
        e[Symbol.iterator] = function() {
            return e
        };
        return e
    };
    r("Array.prototype.entries", function(a) {
        return a ? a : function() {
            return Oa(this, function(b, c) {
                return [b, c]
            })
        }
    });
    r("Math.imul", function(a) {
        return a ? a : function(b, c) {
            b = Number(b);
            c = Number(c);
            var d = b & 65535,
                e = c & 65535;
            return d * e + ((b >>> 16 & 65535) * e + d * (c >>> 16 & 65535) << 16 >>> 0) | 0
        }
    });
    r("globalThis", function(a) {
        return a || ea
    });
    r("Math.trunc", function(a) {
        return a ? a : function(b) {
            b = Number(b);
            if (isNaN(b) || b === Infinity || b === -Infinity || b === 0) return b;
            var c = Math.floor(Math.abs(b));
            return b < 0 ? -c : c
        }
    });
    r("Number.isNaN", function(a) {
        return a ? a : function(b) {
            return typeof b === "number" && isNaN(b)
        }
    });
    r("Array.prototype.keys", function(a) {
        return a ? a : function() {
            return Oa(this, function(b) {
                return b
            })
        }
    });
    r("Array.prototype.values", function(a) {
        return a ? a : function() {
            return Oa(this, function(b, c) {
                return c
            })
        }
    });
    r("Object.fromEntries", function(a) {
        return a ? a : function(b) {
            var c = {};
            if (!(Symbol.iterator in b)) throw new TypeError("" + b + " is not iterable");
            b = b[Symbol.iterator].call(b);
            for (var d = b.next(); !d.done; d = b.next()) {
                d = d.value;
                if (Object(d) !== d) throw new TypeError("iterable for fromEntries should yield objects");
                c[d[0]] = d[1]
            }
            return c
        }
    });
    r("String.prototype.repeat", function(a) {
        return a ? a : function(b) {
            var c = Na(this, null, "repeat");
            if (b < 0 || b > 1342177279) throw new RangeError("Invalid count value");
            b |= 0;
            for (var d = ""; b;)
                if (b & 1 && (d += c), b >>>= 1) c += c;
            return d
        }
    });
    var Pa = function(a, b) {
        a = a !== void 0 ? String(a) : " ";
        return b > 0 && a ? a.repeat(Math.ceil(b / a.length)).substring(0, b) : ""
    };
    r("String.prototype.padStart", function(a) {
        return a ? a : function(b, c) {
            var d = Na(this, null, "padStart");
            return Pa(c, b - d.length) + d
        }
    });
    r("String.prototype.padEnd", function(a) {
        return a ? a : function(b, c) {
            var d = Na(this, null, "padStart");
            return d + Pa(c, b - d.length)
        }
    });
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    var Ra = Ra || {},
        y = this || self,
        z = function(a, b, c) {
            a = a.split(".");
            c = c || y;
            a[0] in c || typeof c.execScript == "undefined" || c.execScript("var " + a[0]);
            for (var d; a.length && (d = a.shift());) a.length || b === void 0 ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
        },
        Ta = function(a, b) {
            var c = Sa("CLOSURE_FLAGS");
            a = c && c[a];
            return a != null ? a : b
        },
        Sa = function(a, b) {
            a = a.split(".");
            b = b || y;
            for (var c = 0; c < a.length; c++)
                if (b = b[a[c]], b == null) return null;
            return b
        },
        Ua = function(a) {
            var b = typeof a;
            return b != "object" ? b : a ? Array.isArray(a) ?
                "array" : b : "null"
        },
        Va = function(a) {
            var b = Ua(a);
            return b == "array" || b == "object" && typeof a.length == "number"
        },
        Wa = function(a) {
            var b = typeof a;
            return b == "object" && a != null || b == "function"
        },
        $a = function(a) {
            return Object.prototype.hasOwnProperty.call(a, Xa) && a[Xa] || (a[Xa] = ++Ya)
        },
        ab = function(a) {
            a !== null && "removeAttribute" in a && a.removeAttribute(Xa);
            try {
                delete a[Xa]
            } catch (b) {}
        },
        Xa = "closure_uid_" + (Math.random() * 1E9 >>> 0),
        Ya = 0,
        bb = function(a, b, c) {
            return a.call.apply(a.bind, arguments)
        },
        cb = function(a, b, c) {
            if (!a) throw Error();
            if (arguments.length > 2) {
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
        },
        db = function(a, b, c) {
            db = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? bb : cb;
            return db.apply(null, arguments)
        },
        fb = function(a, b) {
            var c = Array.prototype.slice.call(arguments, 1);
            return function() {
                var d = c.slice();
                d.push.apply(d, arguments);
                return a.apply(this, d)
            }
        },
        gb = function(a) {
            return a
        },
        ib = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.Ia = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.cj = function(d, e, f) {
                for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
                return b.prototype[e].apply(d, g)
            }
        };

    function jb(a, b) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, jb);
        else {
            var c = Error().stack;
            c && (this.stack = c)
        }
        a && (this.message = String(a));
        b !== void 0 && (this.cause = b)
    }
    ib(jb, Error);
    jb.prototype.name = "CustomError";
    var lb;
    var nb, rb = typeof String.prototype.isWellFormed === "function",
        sb = typeof TextEncoder !== "undefined";

    function tb(a) {
        var b = !1;
        b = b === void 0 ? !1 : b;
        if (sb) {
            if (b && (rb ? !a.isWellFormed() : /(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(a))) throw Error("Found an unpaired surrogate");
            a = (nb || (nb = new TextEncoder)).encode(a)
        } else {
            for (var c = 0, d = new Uint8Array(3 * a.length), e = 0; e < a.length; e++) {
                var f = a.charCodeAt(e);
                if (f < 128) d[c++] = f;
                else {
                    if (f < 2048) d[c++] = f >> 6 | 192;
                    else {
                        if (f >= 55296 && f <= 57343) {
                            if (f <= 56319 && e < a.length) {
                                var g = a.charCodeAt(++e);
                                if (g >= 56320 && g <= 57343) {
                                    f = (f - 55296) * 1024 + g - 56320 +
                                        65536;
                                    d[c++] = f >> 18 | 240;
                                    d[c++] = f >> 12 & 63 | 128;
                                    d[c++] = f >> 6 & 63 | 128;
                                    d[c++] = f & 63 | 128;
                                    continue
                                } else e--
                            }
                            if (b) throw Error("Found an unpaired surrogate");
                            f = 65533
                        }
                        d[c++] = f >> 12 | 224;
                        d[c++] = f >> 6 & 63 | 128
                    }
                    d[c++] = f & 63 | 128
                }
            }
            a = c === d.length ? d : d.subarray(0, c)
        }
        return a
    };

    function ub(a) {
        y.setTimeout(function() {
            throw a;
        }, 0)
    };
    var vb = function(a, b) {
            var c = a.length - b.length;
            return c >= 0 && a.indexOf(b, c) == c
        },
        wb = function(a) {
            return /^[\s\xa0]*$/.test(a)
        },
        xb = String.prototype.trim ? function(a) {
            return a.trim()
        } : function(a) {
            return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
        },
        yb = function(a, b) {
            return a.indexOf(b) != -1
        },
        Ab = function(a, b) {
            return yb(a.toLowerCase(), b.toLowerCase())
        },
        Cb = function(a, b) {
            var c = 0;
            a = xb(String(a)).split(".");
            b = xb(String(b)).split(".");
            for (var d = Math.max(a.length, b.length), e = 0; c == 0 && e < d; e++) {
                var f = a[e] || "",
                    g = b[e] || "";
                do {
                    f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
                    g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
                    if (f[0].length == 0 && g[0].length == 0) break;
                    c = Bb(f[1].length == 0 ? 0 : parseInt(f[1], 10), g[1].length == 0 ? 0 : parseInt(g[1], 10)) || Bb(f[2].length == 0, g[2].length == 0) || Bb(f[2], g[2]);
                    f = f[3];
                    g = g[3]
                } while (c == 0)
            }
            return c
        },
        Bb = function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0
        };
    var Db = Ta(610401301, !1),
        Eb = Ta(653718497, Ta(1, !0));

    function Fb() {
        var a = y.navigator;
        return a && (a = a.userAgent) ? a : ""
    }
    var Gb, Hb = y.navigator;
    Gb = Hb ? Hb.userAgentData || null : null;

    function Ib(a) {
        return Db ? Gb ? Gb.brands.some(function(b) {
            return (b = b.brand) && yb(b, a)
        }) : !1 : !1
    }

    function A(a) {
        return yb(Fb(), a)
    };

    function Jb() {
        return Db ? !!Gb && Gb.brands.length > 0 : !1
    }

    function Kb() {
        return Jb() ? !1 : A("Opera")
    }

    function Lb() {
        return Jb() ? !1 : A("Trident") || A("MSIE")
    }

    function Mb() {
        return A("Firefox") || A("FxiOS")
    }

    function Nb() {
        return A("Safari") && !(Ob() || (Jb() ? 0 : A("Coast")) || Kb() || (Jb() ? 0 : A("Edge")) || (Jb() ? Ib("Microsoft Edge") : A("Edg/")) || (Jb() ? Ib("Opera") : A("OPR")) || Mb() || A("Silk") || A("Android"))
    }

    function Ob() {
        return Jb() ? Ib("Chromium") : (A("Chrome") || A("CriOS")) && !(Jb() ? 0 : A("Edge")) || A("Silk")
    };

    function Pb() {
        return Db && Gb && Gb.platform ? Gb.platform === "Android" : A("Android")
    }

    function Qb() {
        return A("iPhone") && !A("iPod") && !A("iPad")
    };
    var Rb = function(a, b) {
            if (typeof a === "string") return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
            for (var c = 0; c < a.length; c++)
                if (c in a && a[c] === b) return c;
            return -1
        },
        Sb = function(a, b) {
            for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++) e in d && b.call(void 0, d[e], e, a)
        };

    function Tb(a, b) {
        for (var c = typeof a === "string" ? a.split("") : a, d = a.length - 1; d >= 0; --d) d in c && b.call(void 0, c[d], d, a)
    }
    var Ub = function(a, b) {
            for (var c = a.length, d = [], e = 0, f = typeof a === "string" ? a.split("") : a, g = 0; g < c; g++)
                if (g in f) {
                    var h = f[g];
                    b.call(void 0, h, g, a) && (d[e++] = h)
                } return d
        },
        Vb = function(a, b) {
            for (var c = a.length, d = Array(c), e = typeof a === "string" ? a.split("") : a, f = 0; f < c; f++) f in e && (d[f] = b.call(void 0, e[f], f, a));
            return d
        },
        Wb = function(a, b, c) {
            var d = c;
            Sb(a, function(e, f) {
                d = b.call(void 0, d, e, f, a)
            });
            return d
        },
        Xb = function(a, b) {
            for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++)
                if (e in d && b.call(void 0, d[e],
                        e, a)) return !0;
            return !1
        };

    function Yb(a, b) {
        b = Zb(a, b);
        return b < 0 ? null : typeof a === "string" ? a.charAt(b) : a[b]
    }

    function Zb(a, b) {
        for (var c = a.length, d = typeof a === "string" ? a.split("") : a, e = 0; e < c; e++)
            if (e in d && b.call(void 0, d[e], e, a)) return e;
        return -1
    }

    function $b(a, b) {
        b = ac(a, b);
        return b < 0 ? null : typeof a === "string" ? a.charAt(b) : a[b]
    }

    function ac(a, b) {
        for (var c = typeof a === "string" ? a.split("") : a, d = a.length - 1; d >= 0; d--)
            if (d in c && b.call(void 0, c[d], d, a)) return d;
        return -1
    }

    function bc(a, b) {
        return Rb(a, b) >= 0
    }

    function cc(a, b) {
        b = Rb(a, b);
        var c;
        (c = b >= 0) && dc(a, b);
        return c
    }

    function dc(a, b) {
        return Array.prototype.splice.call(a, b, 1).length == 1
    }

    function ec(a, b) {
        var c = 0;
        Tb(a, function(d, e) {
            b.call(void 0, d, e, a) && dc(a, e) && c++
        })
    }

    function fc(a) {
        return Array.prototype.concat.apply([], arguments)
    }

    function gc(a) {
        var b = a.length;
        if (b > 0) {
            for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
            return c
        }
        return []
    }

    function hc(a) {
        for (var b = 0, c = 0, d = {}; c < a.length;) {
            var e = a[c++],
                f = Wa(e) ? "o" + $a(e) : (typeof e).charAt(0) + e;
            Object.prototype.hasOwnProperty.call(d, f) || (d[f] = !0, a[b++] = e)
        }
        a.length = b
    }

    function ic(a, b) {
        a.sort(b || jc)
    }

    function jc(a, b) {
        return a > b ? 1 : a < b ? -1 : 0
    }

    function kc(a) {
        for (var b = [], c = 0; c < a; c++) b[c] = "";
        return b
    };
    var lc = function(a) {
        lc[" "](a);
        return a
    };
    lc[" "] = function() {};
    var mc = function(a, b) {
            try {
                return lc(a[b]), !0
            } catch (c) {}
            return !1
        },
        oc = function(a) {
            var b = nc;
            return Object.prototype.hasOwnProperty.call(b, 8) ? b[8] : b[8] = a(8)
        };
    var pc = Kb(),
        qc = Lb(),
        rc = A("Edge"),
        sc = A("Gecko") && !(Ab(Fb(), "WebKit") && !A("Edge")) && !(A("Trident") || A("MSIE")) && !A("Edge"),
        tc = Ab(Fb(), "WebKit") && !A("Edge"),
        uc = Db && Gb && Gb.platform ? Gb.platform === "macOS" : A("Macintosh"),
        vc = Pb(),
        wc = Qb(),
        yc = A("iPad"),
        zc = A("iPod"),
        Ac = Qb() || A("iPad") || A("iPod"),
        Bc;
    a: {
        var Cc = "",
            Dc = function() {
                var a = Fb();
                if (sc) return /rv:([^\);]+)(\)|;)/.exec(a);
                if (rc) return /Edge\/([\d\.]+)/.exec(a);
                if (qc) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
                if (tc) return /WebKit\/(\S+)/.exec(a);
                if (pc) return /(?:Version)[ \/]?(\S+)/.exec(a)
            }();Dc && (Cc = Dc ? Dc[1] : "");
        if (qc) {
            var Ec, Fc = y.document;
            Ec = Fc ? Fc.documentMode : void 0;
            if (Ec != null && Ec > parseFloat(Cc)) {
                Bc = String(Ec);
                break a
            }
        }
        Bc = Cc
    }
    var Gc = Bc,
        nc = {},
        Hc = function() {
            return oc(function() {
                return Cb(Gc, 8) >= 0
            })
        };
    var Ic = Mb(),
        Jc = A("Android") && !(Ob() || Mb() || Kb() || A("Silk")),
        Nc = Ob();
    Nb();
    var Oc = {},
        Pc = null,
        Rc = function(a, b) {
            b === void 0 && (b = 0);
            Qc();
            b = Oc[b];
            for (var c = Array(Math.floor(a.length / 3)), d = b[64] || "", e = 0, f = 0; e < a.length - 2; e += 3) {
                var g = a[e],
                    h = a[e + 1],
                    k = a[e + 2],
                    l = b[g >> 2];
                g = b[(g & 3) << 4 | h >> 4];
                h = b[(h & 15) << 2 | k >> 6];
                k = b[k & 63];
                c[f++] = "" + l + g + h + k
            }
            l = 0;
            k = d;
            switch (a.length - e) {
                case 2:
                    l = a[e + 1], k = b[(l & 15) << 2] || d;
                case 1:
                    a = a[e], c[f] = "" + b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
            }
            return c.join("")
        },
        Tc = function(a) {
            var b = [];
            Sc(a, function(c) {
                b.push(c)
            });
            return b
        },
        Sc = function(a, b) {
            function c(k) {
                for (; d < a.length;) {
                    var l = a.charAt(d++),
                        p = Pc[l];
                    if (p != null) return p;
                    if (!wb(l)) throw Error("Unknown base64 encoding at char: " + l);
                }
                return k
            }
            Qc();
            for (var d = 0;;) {
                var e = c(-1),
                    f = c(0),
                    g = c(64),
                    h = c(64);
                if (h === 64 && e === -1) break;
                b(e << 2 | f >> 4);
                g != 64 && (b(f << 4 & 240 | g >> 2), h != 64 && b(g << 6 & 192 | h))
            }
        },
        Qc = function() {
            if (!Pc) {
                Pc = {};
                for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; c < 5; c++) {
                    var d = a.concat(b[c].split(""));
                    Oc[c] = d;
                    for (var e = 0; e < d.length; e++) {
                        var f = d[e];
                        Pc[f] === void 0 && (Pc[f] = e)
                    }
                }
            }
        };
    var Uc = typeof Uint8Array !== "undefined",
        Vc = !qc && typeof btoa === "function";
    var Wc = function(a, b) {
        a.__closure__error__context__984382 || (a.__closure__error__context__984382 = {});
        a.__closure__error__context__984382.severity = b
    };
    var Xc;

    function Yc() {
        var a = Error();
        Wc(a, "incident");
        ub(a)
    }

    function Zc(a) {
        a = Error(a);
        Wc(a, "warning");
        return a
    };

    function $c() {
        return typeof BigInt === "function"
    };

    function ad(a) {
        return Array.prototype.slice.call(a)
    };
    var bd = typeof Symbol === "function" && typeof Symbol() === "symbol";

    function cd(a) {
        return typeof Symbol === "function" && typeof Symbol() === "symbol" ? Symbol() : a
    }
    var dd = cd(),
        ed = cd("0di"),
        fd = cd("2ex"),
        gd = cd("1oa");
    var hd = bd ? function(a, b) {
            a[dd] |= b
        } : function(a, b) {
            a.Da !== void 0 ? a.Da |= b : Object.defineProperties(a, {
                Da: {
                    value: b,
                    configurable: !0,
                    writable: !0,
                    enumerable: !1
                }
            })
        },
        id = bd ? function(a, b) {
            a[dd] &= ~b
        } : function(a, b) {
            a.Da !== void 0 && (a.Da &= ~b)
        },
        jd = bd ? function(a) {
            return a[dd] | 0
        } : function(a) {
            return a.Da | 0
        },
        kd = bd ? function(a) {
            return a[dd]
        } : function(a) {
            return a.Da
        },
        ld = bd ? function(a, b) {
            a[dd] = b
        } : function(a, b) {
            a.Da !== void 0 ? a.Da = b : Object.defineProperties(a, {
                Da: {
                    value: b,
                    configurable: !0,
                    writable: !0,
                    enumerable: !1
                }
            })
        };

    function md(a) {
        if (4 & a) return 4096 & a ? 4096 : 8192 & a ? 8192 : 0
    }

    function nd(a) {
        hd(a, 34);
        return a
    }

    function od(a) {
        hd(a, 32);
        return a
    }

    function pd(a, b) {
        ld(b, (a | 0) & -30975)
    }

    function qd(a, b) {
        ld(b, (a | 34) & -30941)
    };
    var rd = {},
        sd = {};

    function td(a) {
        return !(!a || typeof a !== "object" || a.Ng !== sd)
    }

    function ud(a) {
        return a !== null && typeof a === "object" && !Array.isArray(a) && a.constructor === Object
    }

    function vd(a) {
        return !Array.isArray(a) || a.length ? !1 : jd(a) & 1 ? !0 : !1
    }
    var wd, xd = [];
    ld(xd, 55);
    wd = Object.freeze(xd);

    function yd(a) {
        if (a & 2) throw Error();
    }
    var zd = function(a, b, c) {
        this.l = 0;
        this.g = a;
        this.j = b;
        this.o = c
    };
    zd.prototype.next = function() {
        if (this.l < this.g.length) {
            var a = this.g[this.l++];
            return {
                done: !1,
                value: this.j ? this.j.call(this.o, a) : a
            }
        }
        return {
            done: !0,
            value: void 0
        }
    };
    zd.prototype[Symbol.iterator] = function() {
        return new zd(this.g, this.j, this.o)
    };
    var Ad = Object.freeze({});

    function Bd(a) {
        a.mj = !0;
        return a
    };
    var Cd = Bd(function(a) {
            return typeof a === "number"
        }),
        Dd = Bd(function(a) {
            return typeof a === "string"
        }),
        Ed = Bd(function(a) {
            return typeof a === "boolean"
        }),
        Fd = Bd(function(a) {
            return !!a && (typeof a === "object" || typeof a === "function")
        });

    function Gd() {
        return Hd(Bd(function(a, b) {
            return a === void 0 ? !0 : Dd(a, b)
        }))
    }

    function Hd(a) {
        a.Kg = !0;
        return a
    };
    var Id = typeof y.BigInt === "function" && typeof y.BigInt(0) === "bigint";

    function Jd(a) {
        var b = a;
        if (Dd(b)) {
            if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(b)) throw Error(String(b));
        } else if (Cd(b) && !Number.isSafeInteger(b)) throw Error(String(b));
        return Id ? BigInt(a) : a = Ed(a) ? a ? "1" : "0" : Dd(a) ? a.trim() || "0" : String(a)
    }
    var Pd = Bd(function(a) {
            return Id ? a >= Kd && a <= Ld : a[0] === "-" ? Md(a, Nd) : Md(a, Od)
        }),
        Nd = Number.MIN_SAFE_INTEGER.toString(),
        Kd = Id ? BigInt(Number.MIN_SAFE_INTEGER) : void 0,
        Od = Number.MAX_SAFE_INTEGER.toString(),
        Ld = Id ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;

    function Md(a, b) {
        if (a.length > b.length) return !1;
        if (a.length < b.length || a === b) return !0;
        for (var c = 0; c < a.length; c++) {
            var d = a[c],
                e = b[c];
            if (d > e) return !1;
            if (d < e) return !0
        }
    };
    var Qd = 0,
        Rd = 0,
        Sd;

    function Td(a) {
        var b = a >>> 0;
        Qd = b;
        Rd = (a - b) / 4294967296 >>> 0
    }

    function Ud(a) {
        if (a < 0) {
            Td(0 - a);
            var b = x(Vd(Qd, Rd));
            a = b.next().value;
            b = b.next().value;
            Qd = a >>> 0;
            Rd = b >>> 0
        } else Td(a)
    }

    function Wd(a, b) {
        var c = b * 4294967296 + (a >>> 0);
        return Number.isSafeInteger(c) ? c : Xd(a, b)
    }

    function Xd(a, b) {
        b >>>= 0;
        a >>>= 0;
        if (b <= 2097151) var c = "" + (4294967296 * b + a);
        else $c() ? c = "" + (BigInt(b) << BigInt(32) | BigInt(a)) : (c = (a >>> 24 | b << 8) & 16777215, b = b >> 16 & 65535, a = (a & 16777215) + c * 6777216 + b * 6710656, c += b * 8147497, b *= 2, a >= 1E7 && (c += a / 1E7 >>> 0, a %= 1E7), c >= 1E7 && (b += c / 1E7 >>> 0, c %= 1E7), c = b + Yd(c) + Yd(a));
        return c
    }

    function Yd(a) {
        a = String(a);
        return "0000000".slice(a.length) + a
    }

    function Zd() {
        var a = Qd,
            b = Rd;
        b & 2147483648 ? $c() ? a = "" + (BigInt(b | 0) << BigInt(32) | BigInt(a >>> 0)) : (b = x(Vd(a, b)), a = b.next().value, b = b.next().value, a = "-" + Xd(a, b)) : a = Xd(a, b);
        return a
    }

    function $d(a) {
        if (a.length < 16) Ud(Number(a));
        else if ($c()) a = BigInt(a), Qd = Number(a & BigInt(4294967295)) >>> 0, Rd = Number(a >> BigInt(32) & BigInt(4294967295));
        else {
            var b = +(a[0] === "-");
            Rd = Qd = 0;
            for (var c = a.length, d = 0 + b, e = (c - b) % 6 + b; e <= c; d = e, e += 6) d = Number(a.slice(d, e)), Rd *= 1E6, Qd = Qd * 1E6 + d, Qd >= 4294967296 && (Rd += Math.trunc(Qd / 4294967296), Rd >>>= 0, Qd >>>= 0);
            b && (b = x(Vd(Qd, Rd)), a = b.next().value, b = b.next().value, Qd = a, Rd = b)
        }
    }

    function Vd(a, b) {
        b = ~b;
        a ? a = ~a + 1 : b += 1;
        return [a, b]
    };

    function ae(a) {
        if (a == null || typeof a === "number") return a;
        if (a === "NaN" || a === "Infinity" || a === "-Infinity") return Number(a)
    }

    function be(a) {
        if (typeof a !== "boolean") throw Error("Expected boolean but got " + Ua(a) + ": " + a);
        return a
    }

    function ce(a) {
        if (a == null || typeof a === "boolean") return a;
        if (typeof a === "number") return !!a
    }
    var de = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;

    function ee(a) {
        var b = typeof a;
        switch (b) {
            case "bigint":
                return !0;
            case "number":
                return Number.isFinite(a)
        }
        return b !== "string" ? !1 : de.test(a)
    }

    function fe(a) {
        if (!Number.isFinite(a)) throw Zc("enum");
        return a | 0
    }

    function ge(a) {
        return a == null ? a : fe(a)
    }

    function he(a) {
        return a == null ? a : Number.isFinite(a) ? a | 0 : void 0
    }

    function ie(a) {
        if (typeof a !== "number") throw Zc("int32");
        if (!Number.isFinite(a)) throw Zc("int32");
        return a | 0
    }

    function je(a) {
        if (a == null) return a;
        if (typeof a === "string") {
            if (!a) return;
            a = +a
        }
        if (typeof a === "number") return Number.isFinite(a) ? a | 0 : void 0
    }

    function ke(a) {
        if (a == null) return a;
        if (typeof a === "string") {
            if (!a) return;
            a = +a
        }
        if (typeof a === "number") return Number.isFinite(a) ? a >>> 0 : void 0
    }

    function le(a) {
        var b = 0;
        b = b === void 0 ? 0 : b;
        if (!ee(a)) throw Zc("int64");
        var c = typeof a;
        switch (b) {
            case 4096:
                switch (c) {
                    case "string":
                        return me(a);
                    case "bigint":
                        return String(BigInt.asIntN(64, a));
                    default:
                        return ne(a)
                }
            case 8192:
                switch (c) {
                    case "string":
                        return oe(a);
                    case "bigint":
                        return Jd(BigInt.asIntN(64, a));
                    default:
                        return pe(a)
                }
            case 0:
                switch (c) {
                    case "string":
                        return me(a);
                    case "bigint":
                        return Jd(BigInt.asIntN(64, a));
                    default:
                        return qe(a)
                }
            default:
                throw Error("Unknown format requested type for int64");
        }
    }

    function re(a) {
        return a == null ? a : le(a)
    }

    function se(a) {
        return a[0] === "-" ? !1 : a.length < 20 ? !0 : a.length === 20 && Number(a.substring(0, 6)) < 184467
    }

    function te(a) {
        return a[0] === "-" ? a.length < 20 ? !0 : a.length === 20 && Number(a.substring(0, 7)) > -922337 : a.length < 19 ? !0 : a.length === 19 && Number(a.substring(0, 6)) < 922337
    }

    function ue(a) {
        if (a < 0) {
            Ud(a);
            var b = Xd(Qd, Rd);
            a = Number(b);
            return Number.isSafeInteger(a) ? a : b
        }
        b = String(a);
        if (se(b)) return b;
        Ud(a);
        return Wd(Qd, Rd)
    }

    function ve(a) {
        if (te(a)) return a;
        $d(a);
        return Zd()
    }

    function qe(a) {
        a = Math.trunc(a);
        if (!Number.isSafeInteger(a)) {
            Ud(a);
            var b = Qd,
                c = Rd;
            if (a = c & 2147483648) b = ~b + 1 >>> 0, c = ~c >>> 0, b == 0 && (c = c + 1 >>> 0);
            b = Wd(b, c);
            a = typeof b === "number" ? a ? -b : b : a ? "-" + b : b
        }
        return a
    }

    function ne(a) {
        a = Math.trunc(a);
        if (Number.isSafeInteger(a)) a = String(a);
        else {
            var b = String(a);
            te(b) ? a = b : (Ud(a), a = Zd())
        }
        return a
    }

    function me(a) {
        var b = Math.trunc(Number(a));
        if (Number.isSafeInteger(b)) return String(b);
        b = a.indexOf(".");
        b !== -1 && (a = a.substring(0, b));
        return ve(a)
    }

    function oe(a) {
        var b = Math.trunc(Number(a));
        if (Number.isSafeInteger(b)) return Jd(b);
        b = a.indexOf(".");
        b !== -1 && (a = a.substring(0, b));
        return $c() ? Jd(BigInt.asIntN(64, BigInt(a))) : Jd(ve(a))
    }

    function pe(a) {
        return Number.isSafeInteger(a) ? Jd(qe(a)) : Jd(ne(a))
    }

    function we(a) {
        if (a == null) return a;
        var b = typeof a;
        if (b === "bigint") return String(BigInt.asIntN(64, a));
        if (ee(a)) {
            if (b === "string") return me(a);
            if (b === "number") return qe(a)
        }
    }

    function xe(a) {
        if (a == null) return a;
        var b = typeof a;
        if (b === "bigint") return String(BigInt.asUintN(64, a));
        if (ee(a)) {
            if (b === "string") return b = Math.trunc(Number(a)), Number.isSafeInteger(b) && b >= 0 ? a = String(b) : (b = a.indexOf("."), b !== -1 && (a = a.substring(0, b)), se(a) || ($d(a), a = Xd(Qd, Rd))), a;
            if (b === "number") return a = Math.trunc(a), a >= 0 && Number.isSafeInteger(a) ? a : ue(a)
        }
    }

    function ye(a) {
        if (typeof a !== "string") throw Error();
        return a
    }

    function ze(a) {
        if (a != null && typeof a !== "string") throw Error();
        return a
    }

    function Ae(a) {
        return a == null || typeof a === "string" ? a : void 0
    }

    function Be(a, b, c, d) {
        if (a != null && typeof a === "object" && a.Md === rd) return a;
        if (!Array.isArray(a)) return c ? d & 2 ? Ce(b) : new b : void 0;
        var e = c = jd(a);
        e === 0 && (e |= d & 32);
        e |= d & 2;
        e !== c && ld(a, e);
        return new b(a)
    }

    function Ce(a) {
        var b = a[ed];
        if (b) return b;
        b = new a;
        nd(b.D);
        return a[ed] = b
    }

    function De(a, b, c) {
        if (b) return be(a);
        var d;
        return (d = ce(a)) != null ? d : c ? !1 : void 0
    }

    function Ee(a, b, c) {
        if (b) return ye(a);
        var d;
        return (d = Ae(a)) != null ? d : c ? "" : void 0
    };
    var Me = function(a) {
        Fe === void 0 && (Fe = typeof Proxy === "function" ? Ge(Proxy) : null);
        var b;
        (b = !Fe) || (He === void 0 && (He = typeof WeakMap === "function" ? Ge(WeakMap) : null), b = !He);
        if (b) return a;
        if (b = Ie(a)) return b;
        if (Math.random() > .01) return a;
        Je(a);
        b = new Fe(a, {
            set: function(c, d, e) {
                Ke();
                c[d] = e;
                return !0
            }
        });
        Le(a, b);
        return b
    };

    function Ke() {
        Yc()
    }
    var Ne = void 0,
        Oe = void 0,
        Ie = function(a) {
            var b;
            return (b = Ne) == null ? void 0 : b.get(a)
        },
        Pe = function(a) {
            var b;
            return ((b = Oe) == null ? void 0 : b.get(a)) || a
        };

    function Le(a, b) {
        (Ne || (Ne = new He)).set(a, b);
        (Oe || (Oe = new He)).set(b, a)
    }
    var Fe = void 0,
        He = void 0;

    function Ge(a) {
        try {
            return a.toString().indexOf("[native code]") !== -1 ? a : null
        } catch (b) {
            return null
        }
    }
    var Qe = void 0;

    function Je(a) {
        if (Qe === void 0) {
            var b = new Fe([], {});
            Qe = Array.prototype.concat.call([], b).length === 1
        }
        Qe && typeof Symbol === "function" && Symbol.isConcatSpreadable && (a[Symbol.isConcatSpreadable] = !0)
    };
    var Re;

    function Se(a, b) {
        Re = b;
        a = new a(b);
        Re = void 0;
        return a
    }
    var Te, Ue;

    function Ve(a) {
        switch (typeof a) {
            case "boolean":
                return Te || (Te = [0, void 0, !0]);
            case "number":
                return a > 0 ? void 0 : a === 0 ? Ue || (Ue = [0, void 0]) : [-a, void 0];
            case "string":
                return [0, a];
            case "object":
                return a
        }
    }

    function B(a, b, c, d) {
        var e;
        d = (e = d) != null ? e : 0;
        a == null && (a = Re);
        Re = void 0;
        if (a == null) e = 96, c ? (a = [c], e |= 512) : a = [], b && (e = e & -33521665 | (b & 1023) << 15);
        else {
            if (!Array.isArray(a)) throw Error("narr");
            e = jd(a);
            if (e & 2048) throw Error("farr");
            if (e & 64) return a;
            d === 1 || d === 2 || (e |= 64);
            if (c && (e |= 512, c !== a[0])) throw Error("mid");
            a: {
                d = a;c = e;
                if (e = d.length) {
                    var f = e - 1;
                    if (ud(d[f])) {
                        c |= 256;
                        b = f - (+!!(c & 512) - 1);
                        if (b >= 1024) throw Error("pvtlmt");
                        e = c & -33521665 | (b & 1023) << 15;
                        break a
                    }
                }
                if (b) {
                    b = Math.max(b, e - (+!!(c & 512) - 1));
                    if (b > 1024) throw Error("spvt");
                    e = c & -33521665 | (b & 1023) << 15
                } else e = c
            }
        }
        ld(a, e);
        return a
    };
    var We = {},
        Xe = function() {
            try {
                var a = function() {
                    return ka(Map, [], this.constructor)
                };
                w(a, Map);
                lc(new a);
                return !1
            } catch (b) {
                return !0
            }
        }(),
        Ye = function() {
            this.g = new Map
        };
    m = Ye.prototype;
    m.get = function(a) {
        return this.g.get(a)
    };
    m.set = function(a, b) {
        this.g.set(a, b);
        this.size = this.g.size;
        return this
    };
    m.delete = function(a) {
        a = this.g.delete(a);
        this.size = this.g.size;
        return a
    };
    m.clear = function() {
        this.g.clear();
        this.size = this.g.size
    };
    m.has = function(a) {
        return this.g.has(a)
    };
    m.entries = function() {
        return this.g.entries()
    };
    m.keys = function() {
        return this.g.keys()
    };
    m.values = function() {
        return this.g.values()
    };
    m.forEach = function(a, b) {
        return this.g.forEach(a, b)
    };
    Ye.prototype[Symbol.iterator] = function() {
        return this.entries()
    };
    var Ze = function() {
        if (Xe) return Object.setPrototypeOf(Ye.prototype, Map.prototype), Object.defineProperties(Ye.prototype, {
            size: {
                value: 0,
                configurable: !0,
                enumerable: !0,
                writable: !0
            }
        }), Ye;
        var a = function() {
            return ka(Map, [], this.constructor)
        };
        w(a, Map);
        return a
    }();

    function $e(a) {
        return a
    }
    var bf = function(a, b, c, d) {
        c = c === void 0 ? $e : c;
        d = d === void 0 ? $e : d;
        var e = Ze.call(this) || this;
        var f = jd(a);
        f |= 64;
        ld(a, f);
        e.Ob = f;
        e.ld = b;
        e.ac = c;
        e.ke = e.ld ? af : d;
        for (var g = 0; g < a.length; g++) {
            var h = a[g],
                k = c(h[0], !1, !0),
                l = h[1];
            b ? l === void 0 && (l = null) : l = d(h[1], !1, !0, void 0, void 0, f);
            Ze.prototype.set.call(e, k, l)
        }
        return e
    };
    w(bf, Ze);
    var df = function(a) {
            if (a.Ob & 2) throw Error("Cannot mutate an immutable Map");
        },
        gf = function(a, b) {
            b = b === void 0 ? ef : b;
            if (a.size !== 0) return ff(a, b)
        },
        ff = function(a, b) {
            b = b === void 0 ? ef : b;
            var c = [];
            a = Ze.prototype.entries.call(a);
            for (var d; !(d = a.next()).done;) d = d.value, d[0] = b(d[0]), d[1] = b(d[1]), c.push(d);
            return c
        };
    m = bf.prototype;
    m.clear = function() {
        df(this);
        Ze.prototype.clear.call(this)
    };
    m.delete = function(a) {
        df(this);
        return Ze.prototype.delete.call(this, this.ac(a, !0, !1))
    };
    m.entries = function() {
        var a = Array.from(Ze.prototype.keys.call(this));
        return new zd(a, hf, this)
    };
    m.keys = function() {
        return Ze.prototype.keys.call(this)
    };
    m.values = function() {
        var a = Array.from(Ze.prototype.keys.call(this));
        return new zd(a, bf.prototype.get, this)
    };
    m.forEach = function(a, b) {
        var c = this;
        Ze.prototype.forEach.call(this, function(d, e) {
            a.call(b, c.get(e), e, c)
        })
    };
    m.set = function(a, b) {
        df(this);
        a = this.ac(a, !0, !1);
        return a == null ? this : b == null ? (Ze.prototype.delete.call(this, a), this) : Ze.prototype.set.call(this, a, this.ke(b, !0, !0, this.ld, !1, this.Ob))
    };
    m.has = function(a) {
        return Ze.prototype.has.call(this, this.ac(a, !1, !1))
    };
    m.get = function(a) {
        a = this.ac(a, !1, !1);
        var b = Ze.prototype.get.call(this, a);
        if (b !== void 0) {
            var c = this.ld;
            return c ? (c = this.ke(b, !1, !0, c, this.cg, this.Ob), c !== b && Ze.prototype.set.call(this, a, c), c) : b
        }
    };
    bf.prototype[Symbol.iterator] = function() {
        return this.entries()
    };
    bf.prototype.toJSON = void 0;
    bf.prototype.Ng = sd;

    function af(a, b, c, d, e, f) {
        a = Be(a, d, c, f);
        e && (a = jf(a));
        return a
    }

    function ef(a) {
        return a
    }

    function hf(a) {
        return [a, this.get(a)]
    }
    var kf;

    function lf() {
        return kf || (kf = new bf(nd([]), void 0, void 0, void 0, We))
    };

    function mf(a, b) {
        return nf(b)
    }

    function nf(a) {
        switch (typeof a) {
            case "number":
                return isFinite(a) ? a : String(a);
            case "bigint":
                return Pd(a) ? Number(a) : String(a);
            case "boolean":
                return a ? 1 : 0;
            case "object":
                if (a)
                    if (Array.isArray(a)) {
                        if (vd(a)) return
                    } else {
                        if (Uc && a != null && a instanceof Uint8Array) {
                            if (Vc) {
                                for (var b = "", c = 0, d = a.length - 10240; c < d;) b += String.fromCharCode.apply(null, a.subarray(c, c += 10240));
                                b += String.fromCharCode.apply(null, c ? a.subarray(c) : a);
                                a = btoa(b)
                            } else a = Rc(a);
                            return a
                        }
                        if (a instanceof bf) return gf(a)
                    }
        }
        return a
    };

    function of(a, b, c) {
        a = ad(a);
        var d = a.length,
            e = b & 256 ? a[d - 1] : void 0;
        d += e ? -1 : 0;
        for (b = b & 512 ? 1 : 0; b < d; b++) a[b] = c(a[b]);
        if (e) {
            b = a[b] = {};
            for (var f in e) b[f] = c(e[f])
        }
        return a
    }

    function pf(a, b, c, d, e) {
        if (a != null) {
            if (Array.isArray(a)) a = vd(a) ? void 0 : e && jd(a) & 2 ? a : qf(a, b, c, d !== void 0, e);
            else if (ud(a)) {
                var f = {},
                    g;
                for (g in a) f[g] = pf(a[g], b, c, d, e);
                a = f
            } else a = b(a, d);
            return a
        }
    }

    function qf(a, b, c, d, e) {
        var f = d || c ? jd(a) : 0;
        d = d ? !!(f & 32) : void 0;
        a = ad(a);
        for (var g = 0; g < a.length; g++) a[g] = pf(a[g], b, c, d, e);
        c && c(f, a);
        return a
    }

    function rf(a) {
        return pf(a, sf, void 0, void 0, !1)
    }

    function sf(a) {
        return a.Md === rd ? a.toJSON() : a instanceof bf ? gf(a, rf) : nf(a)
    };

    function tf(a, b, c) {
        c = c === void 0 ? qd : c;
        if (a != null) {
            if (Uc && a instanceof Uint8Array) return b ? a : new Uint8Array(a);
            if (Array.isArray(a)) {
                var d = jd(a);
                if (d & 2) return a;
                b && (b = d === 0 || !!(d & 32) && !(d & 64 || !(d & 16)));
                return b ? (ld(a, (d | 34) & -12293), a) : qf(a, tf, d & 4 ? qd : c, !0, !0)
            }
            a.Md === rd ? (c = a.D, d = kd(c), a = d & 2 ? a : Se(a.constructor, uf(c, d, !0))) : a instanceof bf && !(a.Ob & 2) && (c = nd(ff(a, tf)), a = new bf(c, a.ld, a.ac, a.ke));
            return a
        }
    }

    function uf(a, b, c) {
        var d = c || b & 2 ? qd : pd,
            e = !!(b & 32);
        a = of(a, b, function(f) {
            return tf(f, e, d)
        });
        hd(a, 32 | (c ? 2 : 0));
        return a
    }

    function jf(a) {
        var b = a.D,
            c = kd(b);
        return c & 2 ? Se(a.constructor, uf(b, c, !1)) : a
    };
    var vf = Jd(0),
        xf = function(a, b) {
            a = a.D;
            return wf(a, kd(a), b)
        };

    function yf(a, b, c, d) {
        b = d + (+!!(b & 512) - 1);
        if (!(b < 0 || b >= a.length || b >= c)) return a[b]
    }
    var wf = function(a, b, c, d) {
            if (c === -1) return null;
            var e = b >> 15 & 1023 || 536870912;
            if (c >= e) {
                if (b & 256) return a[a.length - 1][c]
            } else {
                var f = a.length;
                if (d && b & 256 && (d = a[f - 1][c], d != null)) {
                    if (yf(a, b, e, c) && fd != null) {
                        var g;
                        a = (g = Xc) != null ? g : Xc = {};
                        g = a[fd] || 0;
                        g >= 4 || (a[fd] = g + 1, Yc())
                    }
                    return d
                }
                return yf(a, b, e, c)
            }
        },
        Af = function(a, b, c) {
            var d = a.D,
                e = kd(d);
            yd(e);
            zf(d, e, b, c);
            return a
        };

    function zf(a, b, c, d) {
        var e = b >> 15 & 1023 || 536870912;
        if (c >= e) {
            var f = b;
            if (b & 256) var g = a[a.length - 1];
            else {
                if (d == null) return f;
                g = a[e + (+!!(b & 512) - 1)] = {};
                f |= 256
            }
            g[c] = d;
            c < e && (a[c + (+!!(b & 512) - 1)] = void 0);
            f !== b && ld(a, f);
            return f
        }
        a[c + (+!!(b & 512) - 1)] = d;
        b & 256 && (a = a[a.length - 1], c in a && delete a[c]);
        return b
    }
    var Bf = function(a) {
        return a === Ad ? 2 : Eb ? 4 : 5
    };

    function Cf(a, b, c, d, e) {
        var f = a.D;
        a = kd(f);
        var g = 2 & a ? 1 : d;
        e = !!e;
        d = Df(f, a, b);
        var h = jd(d);
        if (!(4 & h)) {
            4 & h && (d = ad(d), h = Ef(h, a), a = zf(f, a, b, d));
            for (var k = 0, l = 0; k < d.length; k++) {
                var p = c(d[k]);
                p != null && (d[l++] = p)
            }
            l < k && (d.length = l);
            h = Ff(h, a);
            h = (h | 20) & -4097;
            h &= -8193;
            ld(d, h);
            2 & h && Object.freeze(d)
        }
        if (g === 1 || g === 4 && 32 & h) Gf(h) || (e = h, h |= 2, h !== e && ld(d, h), Object.freeze(d));
        else if (c = g !== 5 ? !1 : !!(32 & h) || Gf(h) || !!Ie(d), (g === 2 || c) && Gf(h) && (d = ad(d), h = Ef(h, a), h = Hf(h, a, e), ld(d, h), a = zf(f, a, b, d)), Gf(h) || (b = h, h = Hf(h, a, e), h !== b &&
                ld(d, h)), c) var n = Me(d);
        else if (g === 2 && !e) {
            var q;
            (q = Ne) == null || q.delete(d)
        }
        return n || d
    }

    function Df(a, b, c) {
        a = wf(a, b, c);
        return Array.isArray(a) ? a : wd
    }

    function Ff(a, b) {
        a === 0 && (a = Ef(a, b));
        return a | 1
    }

    function Gf(a) {
        return !!(2 & a) && !!(4 & a) || !!(2048 & a)
    }

    function If(a, b, c, d, e, f) {
        var g = b & 2;
        a: {
            var h = c,
                k = b & 2;c = !1;
            if (h == null) {
                if (k) {
                    a = lf();
                    break a
                }
                h = []
            } else if (h.constructor === bf) {
                if ((h.Ob & 2) == 0 || k) {
                    a = h;
                    break a
                }
                h = ff(h)
            } else Array.isArray(h) ? c = !!(jd(h) & 2) : h = [];
            if (k) {
                if (!h.length) {
                    a = lf();
                    break a
                }
                c || (c = !0, nd(h))
            } else if (c) {
                c = !1;
                k = ad(h);
                for (h = 0; h < k.length; h++) {
                    var l = k[h] = ad(k[h]);
                    Array.isArray(l[1]) && (l[1] = nd(l[1]))
                }
                h = k
            }
            c || (jd(h) & 64 ? id(h, 32) : 32 & b && od(h));f = new bf(h, e, Ee, f);zf(a, b, d, f);a = f
        }!g && e && (a.cg = !0);
        return a
    }

    function Jf(a, b, c) {
        a = a.D;
        var d = kd(a);
        return If(a, d, wf(a, d, b), b, void 0, c)
    }

    function Kf(a) {
        var b = Lf;
        a = a.D;
        var c = kd(a);
        return If(a, c, wf(a, c, 24), 24, b)
    }

    function Mf(a, b, c, d) {
        var e = a.D,
            f = kd(e);
        yd(f);
        if (c == null) return zf(e, f, b), a;
        c = Pe(c);
        var g = jd(c),
            h = g,
            k = !!(4 & g),
            l = Gf(g),
            p = l || Object.isFrozen(c);
        l || (g = 0);
        p || (c = ad(c), h = 0, g = Ef(g, f), g = Hf(g, f, !0), p = !1);
        g |= 21;
        var n;
        l = (n = md(g)) != null ? n : 0;
        if (!k)
            for (k = 0; k < c.length; k++) {
                n = c[k];
                var q = d(n, l);
                Object.is(n, q) || (p && (c = ad(c), h = 0, g = Ef(g, f), g = Hf(g, f, !0), p = !1), c[k] = q)
            }
        g !== h && (p && (c = ad(c), g = Ef(g, f), g = Hf(g, f, !0)), ld(c, g));
        zf(e, f, b, c);
        return a
    }

    function Nf(a, b, c, d) {
        var e = a.D,
            f = kd(e);
        yd(f);
        zf(e, f, b, (d === "0" ? Number(c) === 0 : c === d) ? void 0 : c);
        return a
    }
    var Qf = function(a, b, c, d) {
            var e = a.D,
                f = kd(e);
            yd(f);
            if (d == null) {
                var g = Of(e);
                if (Pf(g, e, f, c) === b) g.set(c, 0);
                else return a
            } else {
                g = Of(e);
                var h = Pf(g, e, f, c);
                h !== b && (h && (f = zf(e, f, h)), g.set(c, b))
            }
            zf(e, f, b, d);
            return a
        },
        Sf = function(a, b, c) {
            return Rf(a, b) === c ? c : -1
        },
        Rf = function(a, b) {
            a = a.D;
            return Pf(Of(a), a, kd(a), b)
        };

    function Of(a) {
        if (bd) {
            var b;
            return (b = a[gd]) != null ? b : a[gd] = new Map
        }
        if (gd in a) return a[gd];
        b = new Map;
        Object.defineProperty(a, gd, {
            value: b
        });
        return b
    }

    function Pf(a, b, c, d) {
        var e = a.get(d);
        if (e != null) return e;
        for (var f = e = 0; f < d.length; f++) {
            var g = d[f];
            wf(b, c, g) != null && (e !== 0 && (c = zf(b, c, e)), e = g)
        }
        a.set(d, e);
        return e
    }
    var Uf = function(a) {
        var b = Tf;
        a = a.D;
        var c = kd(a);
        yd(c);
        var d = wf(a, c, 4);
        b = jf(Be(d, b, !0, c));
        d !== b && zf(a, c, 4, b);
        return b
    };

    function Vf(a, b, c) {
        var d = !1;
        a = a.D;
        var e = kd(a);
        d = wf(a, e, c, d);
        b = Be(d, b, !1, e);
        b !== d && b != null && zf(a, e, c, b);
        return b
    }
    var Wf = function(a, b, c) {
            return (a = Vf(a, b, c)) ? a : Ce(b)
        },
        Xf = function(a, b, c) {
            b = Vf(a, b, c);
            if (b == null) return b;
            a = a.D;
            var d = kd(a);
            if (!(d & 2)) {
                var e = jf(b);
                e !== b && (b = e, zf(a, d, c, b))
            }
            return b
        };

    function Yf(a, b, c, d, e, f, g) {
        a = a.D;
        var h = !!(2 & b);
        e = h ? 1 : e;
        f = !!f;
        g && (g = !h);
        h = Df(a, b, d);
        var k = jd(h),
            l = !!(4 & k);
        if (!l) {
            k = Ff(k, b);
            var p = h,
                n = b,
                q = !!(2 & k);
            q && (n |= 2);
            for (var t = !q, u = !0, v = 0, C = 0; v < p.length; v++) {
                var R = Be(p[v], c, !1, n);
                if (R instanceof c) {
                    if (!q) {
                        var U = !!(jd(R.D) & 2);
                        t && (t = !U);
                        u && (u = U)
                    }
                    p[C++] = R
                }
            }
            C < v && (p.length = C);
            k |= 4;
            k = u ? k | 16 : k & -17;
            k = t ? k | 8 : k & -9;
            ld(p, k);
            q && Object.freeze(p)
        }
        if (g && !(8 & k || !h.length && (e === 1 || e === 4 && 32 & k))) {
            Gf(k) && (h = ad(h), k = Ef(k, b), b = zf(a, b, d, h));
            c = h;
            g = k;
            for (p = 0; p < c.length; p++) k = c[p], n = jf(k),
                k !== n && (c[p] = n);
            g |= 8;
            g = c.length ? g & -17 : g | 16;
            ld(c, g);
            k = g
        }
        if (e === 1 || e === 4 && 32 & k) Gf(k) || (b = k, k |= !h.length || 16 & k && (!l || 32 & k) ? 2 : 2048, k !== b && ld(h, k), Object.freeze(h));
        else if (l = e !== 5 ? !1 : !!(32 & k) || Gf(k) || !!Ie(h), (e === 2 || l) && Gf(k) && (h = ad(h), k = Ef(k, b), k = Hf(k, b, f), ld(h, k), b = zf(a, b, d, h)), Gf(k) || (d = k, k = Hf(k, b, f), k !== d && ld(h, k)), l) var da = Me(h);
        else if (e === 2 && !f) {
            var V;
            (V = Ne) == null || V.delete(h)
        }
        return da || h
    }
    var Zf = function(a, b, c, d) {
            var e = kd(a.D);
            return Yf(a, e, b, c, d, !1, !(2 & e))
        },
        D = function(a, b, c) {
            c == null && (c = void 0);
            return Af(a, b, c)
        },
        $f = function(a, b, c, d) {
            d == null && (d = void 0);
            return Qf(a, b, c, d)
        },
        ag = function(a, b, c) {
            var d = a.D,
                e = kd(d);
            yd(e);
            if (c == null) return zf(d, e, b), a;
            c = Pe(c);
            for (var f = jd(c), g = f, h = Gf(f), k = h || Object.isFrozen(c), l = !0, p = !0, n = 0; n < c.length; n++) {
                var q = c[n];
                h || (q = !!(jd(q.D) & 2), l && (l = !q), p && (p = q))
            }
            h || (f = l ? 13 : 5, f = p ? f | 16 : f & -17);
            if (!k || k && f !== g) c = ad(c), g = 0, f = Ef(f, e), f = Hf(f, e, !0);
            f !== g && ld(c, f);
            zf(d,
                e, b, c);
            return a
        };

    function Ef(a, b) {
        a = (2 & b ? a | 2 : a & -3) | 32;
        return a &= -2049
    }

    function Hf(a, b, c) {
        32 & b && c || (a &= -33);
        return a
    }

    function bg(a, b, c, d, e) {
        yd(kd(a.D));
        a = Cf(a, b, e, 2, !0);
        var f;
        b = (f = md(jd(a))) != null ? f : 0;
        if (Array.isArray(d))
            for (d = Pe(d), f = d.length, e = 0; e < f; e++) a.push(c(d[e], b));
        else
            for (d = x(d), f = d.next(); !f.done; f = d.next()) a.push(c(f.value, b))
    }

    function cg(a, b, c, d) {
        var e = kd(a.D);
        yd(e);
        a = Yf(a, e, c, b, 2, !0);
        d = d != null ? d : new c;
        a.push(d);
        jd(d.D) & 2 ? id(a, 8) : id(a, 16);
        return d
    }
    var dg = function(a, b, c, d) {
            cg(a, b, c, d);
            return a
        },
        eg = function(a, b) {
            a = xf(a, b);
            a != null && (typeof a === "bigint" ? Pd(a) ? a = Number(a) : (a = BigInt.asIntN(64, a), a = Pd(a) ? Number(a) : String(a)) : a = ee(a) ? typeof a === "number" ? qe(a) : me(a) : void 0);
            return a
        };

    function fg(a, b) {
        return a != null ? a : b
    }
    var gg = function(a, b) {
            return Ae(xf(a, b))
        },
        hg = function(a, b) {
            var c = c === void 0 ? !1 : c;
            return fg(ce(xf(a, b)), c)
        },
        ig = function(a, b) {
            var c = c === void 0 ? 0 : c;
            return fg(je(xf(a, b)), c)
        },
        jg = function(a, b) {
            var c = c === void 0 ? 0 : c;
            return fg(ke(xf(a, b)), c)
        },
        kg = function(a, b) {
            var c = c === void 0 ? 0 : c;
            return fg(eg(a, b), c)
        },
        lg = function(a, b) {
            var c = c === void 0 ? vf : c;
            a = xf(a, b);
            b = typeof a;
            a = a == null ? a : b === "bigint" ? Jd(BigInt.asIntN(64, a)) : ee(a) ? b === "string" ? oe(a) : pe(a) : void 0;
            return fg(a, c)
        },
        mg = function(a, b) {
            var c = c === void 0 ? 0 : c;
            a = a.D;
            var d = kd(a),
                e = wf(a, d, b),
                f = ae(e);
            f != null && f !== e && zf(a, d, b, f);
            return fg(f, c)
        },
        E = function(a, b) {
            var c = c === void 0 ? "" : c;
            return fg(gg(a, b), c)
        },
        F = function(a, b) {
            var c = 0;
            c = c === void 0 ? 0 : c;
            return fg(he(xf(a, b)), c)
        },
        ng = function(a, b) {
            var c = c === void 0 ? "0" : c;
            a = xf(a, b);
            b = !0;
            b = b === void 0 ? !1 : b;
            var d = typeof a;
            a = a == null ? a : d === "bigint" ? String(BigInt.asIntN(64, a)) : ee(a) ? d === "string" ? me(a) : b ? ne(a) : qe(a) : void 0;
            return fg(a, c)
        },
        og = function(a, b) {
            return Cf(a, b, je, Bf())
        },
        pg = function(a, b, c) {
            return Cf(a, b, Ae, c)
        },
        qg = function(a,
            b, c) {
            return F(a, Sf(a, c, b))
        },
        rg = function(a, b, c) {
            return Af(a, b, c == null ? c : be(c))
        },
        sg = function(a, b, c) {
            return Nf(a, b, c == null ? c : be(c), !1)
        },
        tg = function(a, b, c) {
            return Af(a, b, c == null ? c : ie(c))
        },
        ug = function(a, b, c) {
            return Nf(a, b, c == null ? c : ie(c), 0)
        },
        vg = function(a, b, c) {
            return Nf(a, b, re(c), "0")
        },
        wg = function(a, b, c) {
            return Af(a, b, ze(c))
        },
        xg = function(a, b, c) {
            return Af(a, b, ge(c))
        },
        G = function(a, b, c) {
            return Nf(a, b, ge(c), 0)
        };
    var yg, H = function(a, b, c) {
        this.D = B(a, b, c)
    };
    H.prototype.toJSON = function() {
        return zg(this)
    };
    var Ag = function(a) {
        try {
            return yg = !0, JSON.stringify(zg(a), mf)
        } finally {
            yg = !1
        }
    };
    H.prototype.Md = rd;
    H.prototype.toString = function() {
        try {
            return yg = !0, zg(this).toString()
        } finally {
            yg = !1
        }
    };

    function zg(a) {
        a = a.D;
        a = yg ? a : qf(a, sf, void 0, void 0, !1);
        var b = !yg,
            c = a.length;
        if (c) {
            var d = a[c - 1],
                e = ud(d);
            e ? c-- : d = void 0;
            var f = a;
            if (e) {
                b: {
                    var g = d;
                    var h;
                    var k = !1;
                    if (g)
                        for (var l in g)
                            if (isNaN(+l)) e = void 0, ((e = h) != null ? e : h = {})[l] = g[l];
                            else if (e = g[l], Array.isArray(e) && (vd(e) || td(e) && e.size === 0) && (e = null), e == null && (k = !0), e != null) {
                        var p = void 0;
                        ((p = h) != null ? p : h = {})[l] = e
                    }
                    k || (h = g);
                    if (h)
                        for (var n in h) {
                            k = h;
                            break b
                        }
                    k = null
                }
                g = k == null ? d != null : k !== d
            }
            for (; c > 0; c--) {
                h = f[c - 1];
                if (!(h == null || vd(h) || td(h) && h.size === 0)) break;
                var q = !0
            }
            if (f !== a || g || q) {
                if (!b) f = Array.prototype.slice.call(f, 0, c);
                else if (q || g || k) f.length = c;
                k && f.push(k)
            }
            q = f
        } else q = a;
        return q
    };
    var Bg = function(a, b) {
            this.j = a >>> 0;
            this.g = b >>> 0
        },
        Dg = function(a) {
            if (!a) return Cg || (Cg = new Bg(0, 0));
            if (!/^\d+$/.test(a)) return null;
            $d(a);
            return new Bg(Qd, Rd)
        },
        Cg, Eg = function(a, b) {
            this.j = a >>> 0;
            this.g = b >>> 0
        },
        Gg = function(a) {
            if (!a) return Fg || (Fg = new Eg(0, 0));
            if (!/^-?\d+$/.test(a)) return null;
            $d(a);
            return new Eg(Qd, Rd)
        },
        Fg;
    var Hg = function() {
        this.g = []
    };
    Hg.prototype.length = function() {
        return this.g.length
    };
    Hg.prototype.end = function() {
        var a = this.g;
        this.g = [];
        return a
    };
    var Ig = function(a, b, c) {
            for (; c > 0 || b > 127;) a.g.push(b & 127 | 128), b = (b >>> 7 | c << 25) >>> 0, c >>>= 7;
            a.g.push(b)
        },
        Jg = function(a, b) {
            for (; b > 127;) a.g.push(b & 127 | 128), b >>>= 7;
            a.g.push(b)
        },
        Kg = function(a, b) {
            if (b >= 0) Jg(a, b);
            else {
                for (var c = 0; c < 9; c++) a.g.push(b & 127 | 128), b >>= 7;
                a.g.push(1)
            }
        },
        Lg = function(a, b) {
            a.g.push(b >>> 0 & 255);
            a.g.push(b >>> 8 & 255);
            a.g.push(b >>> 16 & 255);
            a.g.push(b >>> 24 & 255)
        };
    var Mg = function() {
            this.l = [];
            this.j = 0;
            this.g = new Hg
        },
        Ng = function(a, b) {
            b.length !== 0 && (a.l.push(b), a.j += b.length)
        },
        Pg = function(a, b) {
            Og(a, b, 2);
            b = a.g.end();
            Ng(a, b);
            b.push(a.j);
            return b
        },
        Qg = function(a, b) {
            var c = b.pop();
            for (c = a.j + a.g.length() - c; c > 127;) b.push(c & 127 | 128), c >>>= 7, a.j++;
            b.push(c);
            a.j++
        },
        Og = function(a, b, c) {
            Jg(a.g, b * 8 + c)
        },
        Rg = function(a, b, c) {
            Og(a, b, 2);
            Jg(a.g, c.length);
            Ng(a, a.g.end());
            Ng(a, c)
        };

    function Sg() {
        var a = function() {
            throw Error();
        };
        Object.setPrototypeOf(a, a.prototype);
        return a
    }
    var Tg = Sg(),
        Ug = Sg(),
        Vg = Sg(),
        Wg = Sg(),
        Xg = Sg();
    var Yg = function(a, b) {
        this.g = a;
        a = gb(Tg);
        this.j = !!a && b === a || !1
    };

    function Zg() {
        var a = $g;
        var b = b === void 0 ? Tg : b;
        return new Yg(a, b)
    }

    function $g(a, b, c, d, e) {
        b = ah(b, d);
        b != null && (c = Pg(a, c), e(b, a), Qg(a, c))
    }
    var bh = Zg(),
        ch = Zg(),
        dh = Symbol(),
        eh = Symbol(),
        fh, gh;

    function hh(a) {
        var b = ih,
            c = jh,
            d = a[dh];
        if (d) return d;
        d = {};
        d.Ne = Ve(a[0]);
        var e = a[1],
            f = 1;
        e && e.constructor === Object && (d.og = e, e = a[++f], typeof e === "function" && (d.Jg = !0, fh != null || (fh = e), gh != null || (gh = a[f + 1]), e = a[f += 2]));
        for (var g = {}; e && Array.isArray(e) && e.length && typeof e[0] === "number" && e[0] > 0;) {
            for (var h = 0; h < e.length; h++) g[e[h]] = e;
            e = a[++f]
        }
        for (h = 1; e !== void 0;) {
            typeof e === "number" && (h += e, e = a[++f]);
            var k = void 0;
            if (e instanceof Yg) var l = e;
            else l = bh, f--;
            e = void 0;
            if ((e = l) == null ? 0 : e.j) {
                e = a[++f];
                k = a;
                var p = f;
                typeof e ===
                    "function" && (e = e(), k[p] = e);
                k = e
            }
            e = a[++f];
            p = h + 1;
            typeof e === "number" && e < 0 && (p -= e, e = a[++f]);
            for (; h < p; h++) {
                var n = g[h];
                k ? c(d, h, l, k, n) : b(d, h, l, n)
            }
        }
        return a[dh] = d
    }

    function ah(a, b) {
        if (a instanceof H) return a.D;
        if (Array.isArray(a)) return B(a, b[0], b[1], 2)
    };

    function ih(a, b, c) {
        a[b] = c.g
    }

    function jh(a, b, c, d) {
        var e, f, g = c.g;
        a[b] = function(h, k, l) {
            return g(h, k, l, f || (f = hh(d).Ne), e || (e = kh(d)))
        }
    }

    function kh(a) {
        var b = a[eh];
        if (!b) {
            var c = hh(a);
            b = function(d, e) {
                return lh(d, e, c)
            };
            a[eh] = b
        }
        return b
    }

    function lh(a, b, c) {
        for (var d = jd(a), e = +!!(d & 512) - 1, f = a.length, g = f + (d & 256 ? -1 : 0), h = d & 512 ? 1 : 0; h < g; h++) {
            var k = a[h];
            if (k != null) {
                var l = h - e,
                    p = mh(c, l);
                p && p(b, k, l)
            }
        }
        if (d & 256) {
            a = a[f - 1];
            for (var n in a) d = +n, Number.isNaN(d) || (e = a[d], e != null && (f = mh(c, d)) && f(b, e, d))
        }
    }

    function mh(a, b) {
        var c = a[b];
        if (c) return c;
        if (c = a.og)
            if (c = c[b]) {
                c = Array.isArray(c) ? c[0] instanceof Yg ? c : [ch, c] : [c, void 0];
                var d = c[0].g;
                if (c = c[1]) {
                    var e = kh(c),
                        f = hh(c).Ne;
                    c = a.Jg ? gh(f, e) : function(g, h, k) {
                        return d(g, h, k, f, e)
                    }
                } else c = d;
                return a[b] = c
            }
    };

    function nh(a, b) {
        if (Array.isArray(b)) {
            var c = jd(b);
            if (c & 4) return b;
            for (var d = 0, e = 0; d < b.length; d++) {
                var f = a(b[d]);
                f != null && (b[e++] = f)
            }
            e < d && (b.length = e);
            ld(b, (c | 5) & -12289);
            c & 2 && Object.freeze(b);
            return b
        }
    }
    var oh = function(a, b) {
        var c = new Mg;
        lh(a.D, c, hh(b));
        Ng(c, c.g.end());
        a = new Uint8Array(c.j);
        b = c.l;
        for (var d = b.length, e = 0, f = 0; f < d; f++) {
            var g = b[f];
            a.set(g, e);
            e += g.length
        }
        c.l = [a];
        return a
    };

    function ph(a, b) {
        return new Yg(a, b)
    }

    function qh(a, b, c) {
        b = we(b);
        if (b != null) {
            switch (typeof b) {
                case "string":
                    Gg(b)
            }
            if (b != null) switch (Og(a, c, 0), typeof b) {
                case "number":
                    a = a.g;
                    Ud(b);
                    Ig(a, Qd, Rd);
                    break;
                case "bigint":
                    c = BigInt.asUintN(64, b);
                    c = new Eg(Number(c & BigInt(4294967295)), Number(c >> BigInt(32)));
                    Ig(a.g, c.j, c.g);
                    break;
                default:
                    c = Gg(b), Ig(a.g, c.j, c.g)
            }
        }
    }

    function rh(a, b, c) {
        b = je(b);
        b != null && b != null && (Og(a, c, 0), Kg(a.g, b))
    }
    var sh = ph(function(a, b, c) {
            b = ae(b);
            b != null && (Og(a, c, 1), a = a.g, c = Sd || (Sd = new DataView(new ArrayBuffer(8))), c.setFloat64(0, +b, !0), Qd = c.getUint32(0, !0), Rd = c.getUint32(4, !0), Lg(a, Qd), Lg(a, Rd))
        }, Sg()),
        th = ph(function(a, b, c) {
            b = ae(b);
            b != null && (Og(a, c, 5), a = a.g, c = Sd || (Sd = new DataView(new ArrayBuffer(8))), c.setFloat32(0, +b, !0), Rd = 0, Qd = c.getUint32(0, !0), Lg(a, Qd))
        }, Sg()),
        uh = ph(qh, Wg),
        vh = ph(qh, Wg),
        wh = ph(qh, Wg),
        xh = ph(function(a, b, c) {
            b = xe(b);
            if (b != null) {
                switch (typeof b) {
                    case "string":
                        Dg(b)
                }
                if (b != null) switch (Og(a, c,
                        0), typeof b) {
                    case "number":
                        a = a.g;
                        Ud(b);
                        Ig(a, Qd, Rd);
                        break;
                    case "bigint":
                        c = BigInt.asUintN(64, b);
                        c = new Bg(Number(c & BigInt(4294967295)), Number(c >> BigInt(32)));
                        Ig(a.g, c.j, c.g);
                        break;
                    default:
                        c = Dg(b), Ig(a.g, c.j, c.g)
                }
            }
        }, Sg()),
        yh = ph(rh, Vg),
        zh = ph(rh, Vg),
        Ah = ph(function(a, b, c) {
            b = ce(b);
            b != null && (Og(a, c, 0), a.g.g.push(b ? 1 : 0))
        }, Sg()),
        Bh = ph(function(a, b, c) {
            b = Ae(b);
            b != null && Rg(a, c, tb(b))
        }, Ug),
        Ch;
    Ch = new Yg(function(a, b, c) {
        b = nh(Ae, b);
        if (b != null)
            for (var d = 0; d < b.length; d++) {
                var e = a,
                    f = c,
                    g = b[d];
                g != null && Rg(e, f, tb(g))
            }
    }, Ug);
    var Dh, Eh = void 0;
    Eh = Eh === void 0 ? Tg : Eh;
    Dh = new Yg(function(a, b, c, d, e) {
        if (Array.isArray(b))
            for (var f = 0; f < b.length; f++) {
                var g = a,
                    h = c,
                    k = e,
                    l = ah(b[f], d);
                l != null && (h = Pg(g, h), k(l, g), Qg(g, h))
            }
    }, Eh);
    var Fh = ph(function(a, b, c) {
            b = ke(b);
            b != null && b != null && (Og(a, c, 0), Jg(a.g, b))
        }, Sg()),
        Gh = ph(function(a, b, c) {
            b = je(b);
            b != null && (b = parseInt(b, 10), Og(a, c, 0), Kg(a.g, b))
        }, Xg),
        Hh;
    Hh = new Yg(function(a, b, c) {
        b = nh(je, b);
        if (b != null && b.length) {
            c = Pg(a, c);
            for (var d = 0; d < b.length; d++) Kg(a.g, b[d]);
            Qg(a, c)
        }
    }, Xg);

    function Ih(a) {
        return function() {
            return oh(this, a)
        }
    }

    function Jh(a) {
        return function(b) {
            b = JSON.parse(b);
            if (!Array.isArray(b)) throw Error("Expected jspb data to be an array, got " + Ua(b) + ": " + b);
            nd(b);
            return new a(b)
        }
    }

    function Kh(a) {
        return function(b) {
            if (b == null || b == "") b = new a;
            else {
                b = JSON.parse(b);
                if (!Array.isArray(b)) throw Error("dnarr");
                b = Se(a, od(b))
            }
            return b
        }
    };
    var Lh = function(a) {
        this.D = B(a)
    };
    w(Lh, H);
    var Mh = function(a, b, c) {
            c = c === void 0 ? {} : c;
            this.error = a;
            this.context = b.context;
            this.msg = b.message || "";
            this.id = b.id || "jserror";
            this.meta = c
        },
        Nh = function(a) {
            return !!(a.error && a.meta && a.id)
        };

    function Oh(a) {
        var b = a.toString();
        a.name && b.indexOf(a.name) == -1 && (b += ": " + a.name);
        a.message && b.indexOf(a.message) == -1 && (b += ": " + a.message);
        if (a.stack) a: {
            a = a.stack;
            var c = b;
            try {
                a.indexOf(c) == -1 && (a = c + "\n" + a);
                for (var d; a != d;) d = a, a = a.replace(RegExp("((https?:/..*/)[^/:]*:\\d+(?:.|\n)*)\\2"), "$1");
                b = a.replace(RegExp("\n *", "g"), "\n");
                break a
            } catch (e) {
                b = c;
                break a
            }
            b = void 0
        }
        return b
    };
    var Ph = function() {},
        Qh = function(a) {
            var b = !1,
                c;
            return function() {
                b || (c = a(), b = !0);
                return c
            }
        },
        Rh = function(a) {
            var b = a;
            return function() {
                if (b) {
                    var c = b;
                    b = null;
                    c()
                }
            }
        },
        Sh = function(a) {
            var b = 0,
                c = !1,
                d = [],
                e = function() {
                    b = 0;
                    c && (c = !1, f())
                },
                f = function() {
                    b = y.setTimeout(e, 1E3);
                    var g = d;
                    d = [];
                    a.apply(void 0, g)
                };
            return function(g) {
                d = arguments;
                b ? c = !0 : f()
            }
        };
    var Th = Qh(function() {
        var a = !1;
        try {
            var b = Object.defineProperty({}, "passive", {
                get: function() {
                    a = !0
                }
            });
            y.addEventListener("test", null, b)
        } catch (c) {}
        return a
    });

    function Uh(a) {
        return a ? a.passive && Th() ? a : a.capture || !1 : !1
    }
    var Vh = function(a, b, c, d) {
            return a.addEventListener ? (a.addEventListener(b, c, Uh(d)), !0) : !1
        },
        Wh = function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, Uh())
        };
    var Yh = function() {
            return Db && Gb ? Gb.mobile : !Xh() && (A("iPod") || A("iPhone") || A("Android") || A("IEMobile"))
        },
        Xh = function() {
            return Db && Gb ? !Gb.mobile && (A("iPad") || A("Android") || A("Silk")) : A("iPad") || A("Android") && !A("Mobile") || A("Silk")
        };

    function Zh(a, b, c) {
        for (var d in a) b.call(c, a[d], d, a)
    }

    function $h(a, b) {
        var c = {},
            d;
        for (d in a) b.call(void 0, a[d], d, a) && (c[d] = a[d]);
        return c
    }

    function hi(a) {
        var b = ii,
            c;
        for (c in b)
            if (!a.call(void 0, b[c], c, b)) return !1;
        return !0
    }

    function ji(a) {
        var b = [],
            c = 0,
            d;
        for (d in a) b[c++] = a[d];
        return b
    }

    function ki(a) {
        var b = [],
            c = 0,
            d;
        for (d in a) b[c++] = d;
        return b
    }

    function li(a, b) {
        var c = Va(b),
            d = c ? b : arguments;
        for (c = c ? 0 : 1; c < d.length; c++) {
            if (a == null) return;
            a = a[d[c]]
        }
        return a
    }

    function mi(a, b) {
        return a !== null && b in a
    }

    function ni(a, b) {
        for (var c in a)
            if (a[c] == b) return !0;
        return !1
    }

    function oi(a) {
        var b = pi,
            c;
        for (c in b)
            if (a.call(void 0, b[c], c, b)) return c
    }

    function qi(a) {
        for (var b in a) return !1;
        return !0
    }

    function ri(a) {
        for (var b in a) delete a[b]
    }

    function si(a, b, c) {
        return a !== null && b in a ? a[b] : c
    }
    var ti = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

    function ui(a, b) {
        for (var c, d, e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d) a[c] = d[c];
            for (var f = 0; f < ti.length; f++) c = ti[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    };
    /*

     Copyright Google LLC
     SPDX-License-Identifier: Apache-2.0
    */
    var vi = globalThis.trustedTypes,
        wi;

    function xi() {
        var a = null;
        if (!vi) return a;
        try {
            var b = function(c) {
                return c
            };
            a = vi.createPolicy("goog#html", {
                createHTML: b,
                createScript: b,
                createScriptURL: b
            })
        } catch (c) {}
        return a
    }

    function yi() {
        wi === void 0 && (wi = xi());
        return wi
    };
    var zi = function(a) {
        this.g = a
    };
    zi.prototype.toString = function() {
        return this.g + ""
    };

    function Ai(a) {
        var b = yi();
        return new zi(b ? b.createScriptURL(a) : a)
    };
    var Bi = function(a) {
        this.g = a
    };
    Bi.prototype.toString = function() {
        return this.g
    };
    var Ci = new Bi("about:invalid#zClosurez");
    var Di = function(a) {
        this.Mg = a
    };

    function Ei(a) {
        return new Di(function(b) {
            return b.substr(0, a.length + 1).toLowerCase() === a + ":"
        })
    }
    var Fi = [Ei("data"), Ei("http"), Ei("https"), Ei("mailto"), Ei("ftp"), new Di(function(a) {
        return /^[^:]*([/?#]|$)/.test(a)
    })];

    function Gi(a) {
        if (typeof MediaSource !== "undefined" && a instanceof MediaSource) return new Bi(URL.createObjectURL(a));
        var b = a.type.match(/^([^;]+)(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i);
        if ((b == null ? void 0 : b.length) !== 2 || !(/^image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon|heic|heif|avif|x-ms-bmp)$/i.test(b[1]) || /^video\/(?:mpeg|mp4|ogg|webm|x-matroska|quicktime|x-ms-wmv)$/i.test(b[1]) || /^audio\/(?:3gpp2|3gpp|aac|amr|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)$/i.test(b[1]) || /^font\/[\w-]+$/i.test(b[1]))) throw Error("");
        return new Bi(URL.createObjectURL(a))
    }
    var Hi = /^\s*(?!javascript:)(?:[\w+.-]+:|[^:/?#]*(?:[/?#]|$))/i;
    var Ii = function(a) {
        this.g = a
    };
    Ii.prototype.toString = function() {
        return this.g + ""
    };

    function Ji(a) {
        if (a instanceof Ii) return a.g;
        throw Error("");
    };

    function Ki(a, b) {
        if (a.nodeType === 1 && /^(script|style)$/i.test(a.tagName)) throw Error("");
        a.innerHTML = Ji(b)
    };

    function Li(a, b) {
        if (b instanceof zi) b = b.g;
        else throw Error("");
        a.src = b;
        var c;
        b = a.ownerDocument && a.ownerDocument.defaultView || window;
        b = b === void 0 ? document : b;
        var d;
        b = (d = (c = "document" in b ? b.document : b).querySelector) == null ? void 0 : d.call(c, "script[nonce]");
        (c = b == null ? "" : b.nonce || b.getAttribute("nonce") || "") && a.setAttribute("nonce", c)
    };
    var Mi = function(a) {
        var b = [],
            c = [],
            d = {},
            e = function(f, g) {
                var h = g + "  ";
                try {
                    if (f === void 0) b.push("undefined");
                    else if (f === null) b.push("NULL");
                    else if (typeof f === "string") b.push('"' + f.replace(/\n/g, "\n" + g) + '"');
                    else if (typeof f === "function") b.push(String(f).replace(/\n/g, "\n" + g));
                    else if (Wa(f)) {
                        f[Xa] || c.push(f);
                        var k = $a(f);
                        if (d[k]) b.push("*** reference loop detected (id=" + k + ") ***");
                        else {
                            d[k] = !0;
                            b.push("{");
                            for (var l in f) typeof f[l] !== "function" && (b.push("\n"), b.push(h), b.push(l + " = "), e(f[l], h));
                            b.push("\n" +
                                g + "}");
                            delete d[k]
                        }
                    } else b.push(f)
                } catch (p) {
                    b.push("*** " + p + " ***")
                }
            };
        e(a, "");
        for (a = 0; a < c.length; a++) ab(c[a]);
        return b.join("")
    };

    function Ni(a, b) {
        a.write(Ji(b))
    };
    var Oi = function(a) {
            return decodeURIComponent(a.replace(/\+/g, " "))
        },
        Pi = function(a, b) {
            a.length > b && (a = a.substring(0, b - 3) + "...");
            return a
        },
        Qi = String.prototype.repeat ? function(a, b) {
            return a.repeat(b)
        } : function(a, b) {
            return Array(b + 1).join(a)
        },
        Ri = function(a) {
            return a == null ? "" : String(a)
        },
        Si = Math.random() * 2147483648 | 0,
        Ti = function(a) {
            return String(a).replace(/\-([a-z])/g, function(b, c) {
                return c.toUpperCase()
            })
        },
        Ui = function() {
            return "googleAvInapp".replace(/([A-Z])/g, "-$1").toLowerCase()
        },
        Vi = function(a) {
            return a.replace(RegExp("(^|[\\s]+)([a-z])",
                "g"), function(b, c, d) {
                return c + d.toUpperCase()
            })
        },
        Wi = function(a) {
            isFinite(a) && (a = String(a));
            return typeof a === "string" ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
        };
    var Xi = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"),
        Yi = function(a) {
            var b = a.match(Xi);
            a = b[1];
            var c = b[3];
            b = b[4];
            var d = "";
            a && (d += a + ":");
            c && (d = d + "//" + c, b && (d += ":" + b));
            return d
        },
        Zi = function(a, b) {
            if (a) {
                a = a.split("&");
                for (var c = 0; c < a.length; c++) {
                    var d = a[c].indexOf("="),
                        e = null;
                    if (d >= 0) {
                        var f = a[c].substring(0, d);
                        e = a[c].substring(d + 1)
                    } else f = a[c];
                    b(f, e ? Oi(e) : "")
                }
            }
        },
        $i = /#|$/,
        aj = function(a, b) {
            var c = a.search($i);
            a: {
                var d =
                    0;
                for (var e = b.length;
                    (d = a.indexOf(b, d)) >= 0 && d < c;) {
                    var f = a.charCodeAt(d - 1);
                    if (f == 38 || f == 63)
                        if (f = a.charCodeAt(d + e), !f || f == 61 || f == 38 || f == 35) break a;
                    d += e + 1
                }
                d = -1
            }
            if (d < 0) return null;
            e = a.indexOf("&", d);
            if (e < 0 || e > c) e = c;
            d += b.length + 1;
            return Oi(a.slice(d, e !== -1 ? e : 0))
        };

    function bj(a) {
        var b = Ma.apply(1, arguments);
        if (b.length === 0) return Ai(a[0]);
        for (var c = a[0], d = 0; d < b.length; d++) c += encodeURIComponent(b[d]) + a[d + 1];
        return Ai(c)
    };
    var cj = function(a) {
            try {
                return !!a && a.location.href != null && mc(a, "foo")
            } catch (b) {
                return !1
            }
        },
        ej = function(a) {
            var b = b === void 0 ? !1 : b;
            var c = c === void 0 ? y : c;
            for (var d = 0; c && d++ < 40 && (!b && !cj(c) || !a(c));) c = dj(c)
        },
        fj = function() {
            var a = window;
            ej(function(b) {
                a = b;
                return !1
            });
            return a
        },
        dj = function(a) {
            try {
                var b = a.parent;
                if (b && b != a) return b
            } catch (c) {}
            return null
        },
        gj = function() {
            var a = window;
            return cj(a.top) ? a.top : null
        },
        hj = function() {
            if (!globalThis.crypto) return Math.random();
            try {
                var a = new Uint32Array(1);
                globalThis.crypto.getRandomValues(a);
                return a[0] / 65536 / 65536
            } catch (b) {
                return Math.random()
            }
        },
        ij = function(a, b) {
            if (a)
                for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a)
        },
        jj = function(a) {
            var b = a.length;
            if (b == 0) return 0;
            for (var c = 305419896, d = 0; d < b; d++) c ^= (c << 5) + (c >> 2) + a.charCodeAt(d) & 4294967295;
            return c > 0 ? c : 4294967296 + c
        };

    function kj(a) {
        var b, c;
        return (c = (b = /https?:\/\/[^\/]+/.exec(a)) == null ? void 0 : b[0]) != null ? c : ""
    }
    var lj = function() {
            var a = y;
            try {
                for (var b = null; b != a; b = a, a = a.parent) switch (a.location.protocol) {
                    case "https:":
                        return !0;
                    case "file:":
                        return !0;
                    case "http:":
                        return !1
                }
            } catch (c) {}
            return !0
        },
        mj = function(a) {
            a = a && a.toString && a.toString();
            return typeof a === "string" && yb(a, "[native code]")
        },
        nj = function(a, b) {
            try {
                return !(!a.frames || !a.frames[b])
            } catch (c) {
                return !1
            }
        },
        oj = function(a, b) {
            for (var c = 0; c < 50; ++c) {
                if (nj(a, b)) return a;
                if (!(a = dj(a))) break
            }
            return null
        },
        pj = Qh(function() {
            return Yh() ? 2 : Xh() ? 1 : 0
        }),
        qj = function() {
            var a =
                window;
            if (typeof a.goog_pvsid !== "number") try {
                var b = Object,
                    c = b.defineProperty,
                    d = void 0;
                d = d === void 0 ? Math.random : d;
                var e = Math.floor(d() * 4503599627370496);
                c.call(b, a, "goog_pvsid", {
                    value: e,
                    configurable: !1
                })
            } catch (f) {}
            return Number(a.goog_pvsid) || -1
        },
        rj = function(a, b) {
            b = b === void 0 ? document : b;
            return b.createElement(String(a).toLowerCase())
        },
        sj = function(a) {
            for (var b = a; a && a != a.parent;) a = a.parent, cj(a) && (b = a);
            return b
        };
    var uj = function(a, b, c, d, e) {
        tj(a, b, c === void 0 ? null : c, d === void 0 ? !1 : d, e === void 0 ? !1 : e)
    };

    function tj(a, b, c, d, e) {
        e = e === void 0 ? !1 : e;
        a.google_image_requests || (a.google_image_requests = []);
        var f = rj("IMG", a.document);
        if (c || d) {
            var g = function(h) {
                c && c(h);
                d && cc(a.google_image_requests, f);
                Wh(f, "load", g);
                Wh(f, "error", g)
            };
            Vh(f, "load", g);
            Vh(f, "error", g)
        }
        e && (f.attributionSrc = "");
        f.src = b;
        a.google_image_requests.push(f)
    }
    var wj = function(a, b) {
            var c = c === void 0 ? !1 : c;
            var d = "https://pagead2.googlesyndication.com/pagead/gen_204?id=" + b;
            ij(a, function(e, f) {
                if (e || e === 0) d += "&" + f + "=" + encodeURIComponent("" + e)
            });
            vj(d, c)
        },
        vj = function(a, b) {
            var c = window;
            b = b === void 0 ? !1 : b;
            var d = d === void 0 ? !1 : d;
            c.fetch ? (b = {
                keepalive: !0,
                credentials: "include",
                redirect: "follow",
                method: "get",
                mode: "no-cors"
            }, d && (b.mode = "cors", "setAttributionReporting" in XMLHttpRequest.prototype ? b.attributionReporting = {
                    eventSourceEligible: "true",
                    triggerEligible: "false"
                } :
                b.headers = {
                    "Attribution-Reporting-Eligible": "event-source"
                }), c.fetch(a, b)) : uj(c, a, void 0, b, d)
        };

    function xj(a, b) {
        try {
            var c = function(d) {
                var e = {};
                return [(e[d.lf] = d.Me, e)]
            };
            return JSON.stringify([a.filter(function(d) {
                return d.Jd
            }).map(c), zg(b), a.filter(function(d) {
                return !d.Jd
            }).map(c)])
        } catch (d) {
            return yj(d, b), ""
        }
    }

    function yj(a, b) {
        try {
            wj({
                m: Oh(a instanceof Error ? a : Error(String(a))),
                b: F(b, 1) || null,
                v: E(b, 2) || null
            }, "rcs_internal")
        } catch (c) {}
    }
    var zj = function(a, b) {
        var c = new Lh;
        a = G(c, 1, a);
        b = Nf(a, 2, ze(b), "");
        a = b.D;
        c = kd(a);
        this.l = c & 2 ? b : Se(b.constructor, uf(a, c, !0))
    };
    var Aj = function(a) {
        this.D = B(a)
    };
    w(Aj, H);
    var Bj = [1, 2, 3];
    var Cj = function(a) {
        this.D = B(a)
    };
    w(Cj, H);
    var Dj = [2, 4];
    var Ej = function(a) {
        this.D = B(a)
    };
    w(Ej, H);
    var Fj = function(a) {
        this.D = B(a)
    };
    w(Fj, H);
    var Gj = function(a) {
        this.D = B(a)
    };
    w(Gj, H);
    var Hj = function(a, b) {
            return G(a, 1, b)
        },
        Ij = function(a, b) {
            return G(a, 2, b)
        };
    var Jj = function(a) {
        this.D = B(a)
    };
    w(Jj, H);
    var Kj = [1, 2];
    var Lj = function(a) {
        this.D = B(a)
    };
    w(Lj, H);
    var Mj = function(a, b) {
            return D(a, 1, b)
        },
        Nj = function(a, b) {
            return ag(a, 2, b)
        },
        Oj = function(a, b) {
            return Mf(a, 4, b, ie)
        },
        Pj = function(a, b) {
            return ag(a, 5, b)
        },
        Qj = function(a, b) {
            return G(a, 6, b)
        };
    var Rj = function(a) {
        this.D = B(a)
    };
    w(Rj, H);
    var Sj = [1, 2, 3, 4, 6];
    var Tj = function(a) {
        this.D = B(a)
    };
    w(Tj, H);
    var Uj = function(a) {
        this.D = B(a)
    };
    w(Uj, H);
    var Vj = [2, 3, 4];
    var Wj = function(a) {
        this.D = B(a)
    };
    w(Wj, H);
    var Xj = [3, 4, 5],
        Yj = [6, 7];
    var Zj = function(a) {
        this.D = B(a)
    };
    w(Zj, H);
    var ak = [4, 5];
    var bk = function(a) {
        this.D = B(a)
    };
    w(bk, H);
    bk.prototype.getTagSessionCorrelator = function() {
        return lg(this, 2)
    };
    var dk = function(a) {
            var b = new bk;
            return $f(b, 4, ck, a)
        },
        ck = [4, 5, 7, 8, 9];
    var ek = function(a) {
        this.D = B(a)
    };
    w(ek, H);
    var fk = function(a) {
        this.D = B(a)
    };
    w(fk, H);
    var gk = function(a) {
        this.D = B(a)
    };
    w(gk, H);
    var hk = function(a) {
        this.D = B(a)
    };
    w(hk, H);
    hk.prototype.ib = function() {
        return Xf(this, fk, 1)
    };
    hk.prototype.getSize = function() {
        return Xf(this, gk, 2)
    };
    hk.prototype.getDuration = function() {
        return Xf(this, ek, 3)
    };
    var ik = function(a) {
        this.D = B(a)
    };
    w(ik, H);
    var jk = function(a) {
        this.D = B(a)
    };
    w(jk, H);
    var kk = function(a) {
        this.D = B(a)
    };
    w(kk, H);
    var lk = function(a) {
        this.D = B(a)
    };
    w(lk, H);
    lk.prototype.getEscapedQemQueryId = function() {
        return E(this, 4)
    };
    var mk = function(a) {
        this.D = B(a)
    };
    w(mk, H);
    var nk = function(a) {
        this.D = B(a)
    };
    w(nk, H);
    nk.prototype.getEscapedQemQueryId = function() {
        return E(this, 2)
    };
    var pk = function(a) {
            this.g = a;
            this.nh = new ok(this.g)
        },
        ok = function(a) {
            this.g = a;
            this.rh = new qk(this.g)
        },
        qk = function(a) {
            this.g = a;
            this.runAdAuction = new rk;
            this.ag = new sk(this.g)
        },
        sk = function(a) {
            this.g = a
        },
        tk = function(a, b) {
            a = a.g;
            var c = a.H;
            var d = new Ej;
            d = Nf(d, 1, ze("SOomke"), "");
            var e = new Aj;
            e = Qf(e, 1, Bj, ze(b.pd));
            d = dg(d, 4, Aj, e);
            e = new Aj;
            e = Qf(e, 1, Bj, ze(b.status));
            d = dg(d, 4, Aj, e);
            e = new Cj;
            b = Qf(e, 2, Dj, re(Math.round(b.fe)));
            b = D(d, 3, b);
            c.call(a, b)
        },
        rk = function() {
            this.duration = new uk
        },
        uk = function() {},
        vk = function() {
            zj.apply(this,
                arguments);
            this.Pg = new pk(this)
        };
    w(vk, zj);
    var wk = function() {
        vk.apply(this, arguments)
    };
    w(wk, vk);
    wk.prototype.fd = function() {
        this.B.apply(this, ra(Ma.apply(0, arguments).map(function(a) {
            return {
                Jd: !0,
                lf: 4,
                Me: zg(a)
            }
        })))
    };
    wk.prototype.H = function() {
        this.B.apply(this, ra(Ma.apply(0, arguments).map(function(a) {
            return {
                Jd: !1,
                lf: 1,
                Me: zg(a)
            }
        })))
    };
    var xk = function(a, b) {
        if (globalThis.fetch) globalThis.fetch(a, {
            method: "POST",
            body: b,
            keepalive: b.length < 65536,
            credentials: "omit",
            mode: "no-cors",
            redirect: "follow"
        }).catch(function() {});
        else {
            var c = new XMLHttpRequest;
            c.open("POST", a, !0);
            c.send(b)
        }
    };
    var yk = function(a, b, c, d, e, f, g, h) {
        wk.call(this, a, b);
        this.F = c;
        this.L = d;
        this.G = e;
        this.C = f;
        this.J = g;
        this.o = h;
        this.g = [];
        this.j = null;
        this.A = !1
    };
    w(yk, wk);
    var zk = function(a) {
        a.j !== null && (clearTimeout(a.j), a.j = null);
        if (a.g.length) {
            var b = xj(a.g, a.l);
            a.L(a.F + "?e=1", b);
            a.g = []
        }
    };
    yk.prototype.B = function() {
        var a = Ma.apply(0, arguments),
            b = this;
        try {
            this.J && xj(this.g.concat(a), this.l).length >= 65536 && zk(this), this.o && !this.A && (this.A = !0, this.o.g(function() {
                zk(b)
            })), this.g.push.apply(this.g, ra(a)), this.g.length >= this.C && zk(this), this.g.length && this.j === null && (this.j = setTimeout(function() {
                zk(b)
            }, this.G))
        } catch (c) {
            yj(c, this.l)
        }
    };
    var Ak = function(a, b, c, d, e, f) {
        yk.call(this, a, b, "https://pagead2.googlesyndication.com/pagead/ping", xk, c === void 0 ? 1E3 : c, d === void 0 ? 100 : d, (e === void 0 ? !1 : e) && !!globalThis.fetch, f)
    };
    w(Ak, yk);
    var Bk = function(a, b) {
        this.x = a !== void 0 ? a : 0;
        this.y = b !== void 0 ? b : 0
    };
    Bk.prototype.ceil = function() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this
    };
    Bk.prototype.floor = function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this
    };
    Bk.prototype.round = function() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this
    };
    Bk.prototype.scale = function(a, b) {
        this.x *= a;
        this.y *= typeof b === "number" ? b : a;
        return this
    };
    var I = function(a, b, c, d) {
        this.top = a;
        this.right = b;
        this.bottom = c;
        this.left = d
    };
    I.prototype.getWidth = function() {
        return this.right - this.left
    };
    I.prototype.getHeight = function() {
        return this.bottom - this.top
    };
    var Ck = function(a) {
        return new I(a.top, a.right, a.bottom, a.left)
    };
    I.prototype.contains = function(a) {
        return this && a ? a instanceof I ? a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom : a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom : !1
    };
    I.prototype.expand = function(a, b, c, d) {
        Wa(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += Number(b), this.bottom += Number(c), this.left -= Number(d));
        return this
    };
    var Dk = function(a, b) {
        return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
    };
    I.prototype.ceil = function() {
        this.top = Math.ceil(this.top);
        this.right = Math.ceil(this.right);
        this.bottom = Math.ceil(this.bottom);
        this.left = Math.ceil(this.left);
        return this
    };
    I.prototype.floor = function() {
        this.top = Math.floor(this.top);
        this.right = Math.floor(this.right);
        this.bottom = Math.floor(this.bottom);
        this.left = Math.floor(this.left);
        return this
    };
    I.prototype.round = function() {
        this.top = Math.round(this.top);
        this.right = Math.round(this.right);
        this.bottom = Math.round(this.bottom);
        this.left = Math.round(this.left);
        return this
    };
    var Ek = function(a, b, c) {
        b instanceof Bk ? (a.left += b.x, a.right += b.x, a.top += b.y, a.bottom += b.y) : (a.left += b, a.right += b, typeof c === "number" && (a.top += c, a.bottom += c));
        return a
    };
    I.prototype.scale = function(a, b) {
        b = typeof b === "number" ? b : a;
        this.left *= a;
        this.right *= a;
        this.top *= b;
        this.bottom *= b;
        return this
    };
    var Fk = function(a, b) {
            this.width = a;
            this.height = b
        },
        Gk = function(a, b) {
            return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
        };
    m = Fk.prototype;
    m.aspectRatio = function() {
        return this.width / this.height
    };
    m.isEmpty = function() {
        return !(this.width * this.height)
    };
    m.ceil = function() {
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    };
    m.floor = function() {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    m.round = function() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    m.scale = function(a, b) {
        this.width *= a;
        this.height *= typeof b === "number" ? b : a;
        return this
    };
    var Hk = function(a, b, c, d) {
            this.left = a;
            this.top = b;
            this.width = c;
            this.height = d
        },
        Ik = function(a) {
            return new I(a.top, a.left + a.width, a.top + a.height, a.left)
        };
    m = Hk.prototype;
    m.contains = function(a) {
        return a instanceof Bk ? a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height : this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height
    };
    m.getSize = function() {
        return new Fk(this.width, this.height)
    };
    m.ceil = function() {
        this.left = Math.ceil(this.left);
        this.top = Math.ceil(this.top);
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    };
    m.floor = function() {
        this.left = Math.floor(this.left);
        this.top = Math.floor(this.top);
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    m.round = function() {
        this.left = Math.round(this.left);
        this.top = Math.round(this.top);
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    m.scale = function(a, b) {
        b = typeof b === "number" ? b : a;
        this.left *= a;
        this.width *= a;
        this.top *= b;
        this.height *= b;
        return this
    };

    function Jk(a) {
        a = a === void 0 ? y : a;
        var b = a.context || a.AMP_CONTEXT_DATA;
        if (!b) try {
            b = a.parent.context || a.parent.AMP_CONTEXT_DATA
        } catch (e) {}
        var c, d;
        return ((c = b) == null ? 0 : c.pageViewId) && ((d = b) == null ? 0 : d.canonicalUrl) ? b : null
    };
    var Kk = function() {
            this.S = {}
        },
        Lk = function() {
            var a = Jk(window);
            if (a) {
                if (a) {
                    var b = a.pageViewId;
                    a = a.clientId;
                    typeof a === "string" && (b += a.replace(/\D/g, "").substr(0, 6))
                } else b = null;
                return +b
            }
            b = sj(window);
            a = b.google_global_correlator;
            a || (b.google_global_correlator = a = 1 + Math.floor(Math.random() * 8796093022208));
            return a
        },
        Nk = function(a, b) {
            var c = Mk[7] || "google_ps_7";
            a = a.S;
            var d = a[c];
            return d === void 0 ? (a[c] = b(), a[c]) : d
        },
        Ok = function(a) {
            var b = Lk();
            return Nk(a, function() {
                return b
            })
        },
        Qk = function() {
            if (Pk) var a = Pk;
            else {
                a =
                    ((a = a === void 0 ? Jk() : a) ? cj(a.master) ? a.master : null : null) || window;
                var b = a.google_persistent_state_async;
                a = b != null && typeof b == "object" && b.S != null && typeof b.S == "object" ? Pk = b : a.google_persistent_state_async = Pk = new Kk
            }
            return Ok(a)
        },
        Pk = null,
        Rk = {},
        Mk = (Rk[8] = "google_prev_ad_formats_by_region", Rk[9] = "google_prev_ad_slotnames_by_region", Rk);
    var Sk = ta(["https://pagead2.googlesyndication.com/pagead/js/err_rep.js"]),
        Tk = function() {
            var a = a === void 0 ? "jserror" : a;
            var b = b === void 0 ? .01 : b;
            var c = c === void 0 ? bj(Sk) : c;
            this.j = a;
            this.l = b;
            this.o = c;
            this.g = !1
        };
    Tk.prototype.ee = function(a) {
        this.g = a
    };
    Tk.prototype.Va = function(a, b, c, d) {
        c = c === void 0 ? this.l : c;
        d = d === void 0 ? this.j : d;
        if (Math.random() > c) return this.g;
        Nh(b) || (b = new Mh(b, {
            context: a,
            id: d
        }));
        y.google_js_errors = y.google_js_errors || [];
        y.google_js_errors.push(b);
        y.error_rep_loaded || (b = y.document, a = rj("SCRIPT", b), Li(a, this.o), (b = b.getElementsByTagName("script")[0]) && b.parentNode && b.parentNode.insertBefore(a, b), y.error_rep_loaded = !0);
        return this.g
    };
    Tk.prototype.yb = function(a, b) {
        try {
            return b()
        } catch (c) {
            if (!this.Va(a, c, this.l, this.j)) throw c;
        }
    };
    Tk.prototype.Ud = function(a, b, c) {
        var d = this;
        return function() {
            var e = Ma.apply(0, arguments);
            return d.yb(a, function() {
                return b.apply(c, e)
            })
        }
    };
    var Uk = function(a) {
            return a.prerendering ? 3 : {
                visible: 1,
                hidden: 2,
                prerender: 3,
                preview: 4,
                unloaded: 5
            } [a.visibilityState || a.webkitVisibilityState || a.mozVisibilityState || ""] || 0
        },
        dl = function(a) {
            var b;
            a.visibilityState ? b = "visibilitychange" : a.mozVisibilityState ? b = "mozvisibilitychange" : a.webkitVisibilityState && (b = "webkitvisibilitychange");
            return b
        };
    var el = null,
        fl = function() {
            if (el === null) {
                el = "";
                try {
                    var a = "";
                    try {
                        a = y.top.location.hash
                    } catch (c) {
                        a = y.location.hash
                    }
                    if (a) {
                        var b = a.match(/\bdeid=([\d,]+)/);
                        el = b ? b[1] : ""
                    }
                } catch (c) {}
            }
            return el
        };

    function gl() {
        var a = a === void 0 ? y : a;
        return (a = a.performance) && a.now && a.timing ? Math.floor(a.now() + a.timing.navigationStart) : Date.now()
    }

    function hl() {
        var a = a === void 0 ? y : a;
        return (a = a.performance) && a.now ? a.now() : null
    }

    function il(a, b) {
        b = b === void 0 ? y : b;
        var c, d;
        return ((c = b.performance) == null ? void 0 : (d = c.timing) == null ? void 0 : d[a]) || 0
    }

    function jl() {
        var a = a === void 0 ? y : a;
        var b = Math.min(il("domLoading", a) || Infinity, il("domInteractive", a) || Infinity);
        return b === Infinity ? Math.max(il("responseEnd", a), il("navigationStart", a)) : b
    };
    var kl = function(a, b, c, d) {
        this.label = a;
        this.type = b;
        this.value = c;
        this.duration = d === void 0 ? 0 : d;
        this.taskId = this.slotId = void 0;
        this.uniqueId = Math.random()
    };
    var ll = y.performance,
        ml = !!(ll && ll.mark && ll.measure && ll.clearMarks),
        nl = Qh(function() {
            var a;
            if (a = ml) a = fl(), a = !!a.indexOf && a.indexOf("1337") >= 0;
            return a
        }),
        ol = function(a, b) {
            this.events = [];
            this.g = b || y;
            var c = null;
            b && (b.google_js_reporting_queue = b.google_js_reporting_queue || [], this.events = b.google_js_reporting_queue, c = b.google_measure_js_timing);
            this.l = nl() || (c != null ? c : Math.random() < a)
        };
    ol.prototype.B = function() {
        this.l = !1;
        this.events != this.g.google_js_reporting_queue && (nl() && Sb(this.events, pl), this.events.length = 0)
    };
    ol.prototype.C = function(a) {
        !this.l || this.events.length > 2048 || this.events.push(a)
    };
    var pl = function(a) {
        a && ll && nl() && (ll.clearMarks("goog_" + a.label + "_" + a.uniqueId + "_start"), ll.clearMarks("goog_" + a.label + "_" + a.uniqueId + "_end"))
    };
    ol.prototype.start = function(a, b) {
        if (!this.l) return null;
        a = new kl(a, b, hl() || gl());
        b = "goog_" + a.label + "_" + a.uniqueId + "_start";
        ll && nl() && ll.mark(b);
        return a
    };
    ol.prototype.end = function(a) {
        if (this.l && typeof a.value === "number") {
            a.duration = (hl() || gl()) - a.value;
            var b = "goog_" + a.label + "_" + a.uniqueId + "_end";
            ll && nl() && ll.mark(b);
            this.C(a)
        }
    };
    var ql = function(a) {
        a = a._google_rum_ns_ = a._google_rum_ns_ || {};
        return a.pq = a.pq || []
    };

    function rl(a, b, c) {
        ij(b, function(d, e) {
            var f = c && c[e];
            !d && d !== 0 || f || (a += "&" + encodeURIComponent(e) + "=" + encodeURIComponent(String(d)), c && (c[e] = !0))
        });
        return a
    }
    var xl = function(a, b, c, d, e, f, g, h) {
        f = f === void 0 ? Infinity : f;
        g = g === void 0 ? !1 : g;
        ol.call(this, a, h);
        var k = this;
        this.V = b;
        this.domain = c;
        this.path = d;
        this.aa = e;
        this.J = 0;
        this.A = {};
        this.G = {};
        this.Z = [];
        this.report = {};
        this.j = 0;
        this.F = [];
        this.H = f;
        a = this.g.navigator;
        this.U = !(this.domain !== "csi.gstatic.com" || !a || !a.sendBeacon);
        this.g.performance && this.g.performance.now || sl(this, "dat", 1);
        a && a.deviceMemory && sl(this, "dmc", a.deviceMemory);
        this.g === this.g.top && sl(this, "top", 1);
        this.P = !g;
        this.K = function() {
            k.g.setTimeout(function() {
                    tl(k)
                },
                1100)
        };
        this.M = function() {
            sl(k, "uet", 2);
            for (var p = x(k.Z), n = p.next(); !n.done; n = p.next()) {
                n = n.value;
                try {
                    n()
                } catch (t) {}
            }
            p = k.g;
            var q = q === void 0 ? {} : q;
            typeof window.CustomEvent === "function" ? n = new CustomEvent("rum_blp", q) : (n = document.createEvent("CustomEvent"), n.initCustomEvent("rum_blp", !!q.bubbles, !!q.cancelable, q.detail));
            p.dispatchEvent(n);
            tl(k);
            k.A.uet != null && (k.o -= 3 + k.A.uet.length + 2, delete k.A.uet)
        };
        this.ba = Sh(function() {
            tl(k)
        });
        this.da = function() {
            var p = k.g.document;
            (p.hidden != null ? p.hidden : p.mozHidden !=
                null ? p.mozHidden : p.webkitHidden != null && p.webkitHidden) && k.ba()
        };
        this.L = this.g.setTimeout(function() {
            tl(k)
        }, 5E3);
        this.o = b.length + c.length + d.length + e.length + 3;
        Sb(this.events, function(p) {
            ul(k, p)
        });
        b = ql(this.g);
        var l = function() {
            var p = Ma.apply(0, arguments)[0],
                n = p[0];
            p = p[1];
            var q = n.length + p.length + 2;
            k.o + k.j + q > 8E3 && tl(k);
            k.F.push([n, p]);
            k.j += q;
            vl(k);
            return 0
        };
        Sb(b, function(p) {
            return l(p)
        });
        b.length = 0;
        b.push = l;
        sl(this, "puid", (this.J + 1).toString(36) + "~" + Date.now().toString(36));
        wl(this)
    };
    w(xl, ol);
    var wl = function(a) {
            a.g.document.readyState === "complete" ? a.g.setTimeout(function() {
                tl(a)
            }, 0) : Vh(a.g, "load", a.K);
            var b = dl(a.g.document);
            typeof b !== "undefined" && Vh(a.g, b, a.da);
            Vh(a.g, "pagehide", a.M)
        },
        sl = function(a, b, c) {
            c = String(c);
            a.o = a.A[b] != null ? a.o + (c.length - a.A[b].length) : a.o + (b.length + c.length + 2);
            a.A[b] = c
        },
        Al = function(a, b, c, d, e) {
            e = e === void 0 ? "" : e;
            var f = yl(a, b, c, d, e);
            a.o + a.j + f > 8E3 && (tl(a), f = b.length + c.length + 2);
            zl(a, b, c, d, e);
            a.j += f;
            vl(a)
        },
        yl = function(a, b, c, d, e) {
            return a.report[b] == null ? b.length +
                c.length + 2 : d ? c.length + (e === void 0 ? "" : e).length : c.length - a.report[b].length
        },
        zl = function(a, b, c, d, e) {
            a.report[b] = d && a.report[b] != null ? a.report[b] + ("" + (e === void 0 ? "" : e) + c) : c
        },
        vl = function(a) {
            a.o + a.j >= 6E3 && tl(a)
        },
        tl = function(a) {
            if (a.l && a.P) {
                try {
                    a.j && (a.sendBeacon(a.report), a.J === a.H && a.B())
                } catch (b) {
                    (new Tk).Va(358, b)
                }
                a.report = {};
                a.j = 0;
                a.events.length = 0;
                a.g.clearTimeout(a.L);
                a.L = 0
            }
        },
        Bl = function(a, b) {
            var c = a.V + "//" + a.domain + a.path + a.aa,
                d = {};
            c = rl(c, a.A, d);
            c = rl(c, b, d);
            b = a.g;
            b.google_timing_params && (c = rl(c,
                b.google_timing_params, d), b.google_timing_params = void 0);
            Sb(a.F, function(e) {
                var f = x(e);
                e = f.next().value;
                f = f.next().value;
                var g = {};
                c = rl(c, (g[e] = f, g))
            });
            a.F.length = 0;
            return c
        };
    xl.prototype.sendBeacon = function(a) {
        this.J++;
        a = Bl(this, a);
        var b = !1;
        try {
            b = !!(this.U && this.g.navigator && this.g.navigator.sendBeacon(a, null))
        } catch (c) {
            this.U = !1
        }
        b || uj(this.g, a);
        sl(this, "puid", (this.J + 1).toString(36) + "~" + Date.now().toString(36))
    };
    var ul = function(a, b) {
        var c = "met." + b.type,
            d = typeof b.value === "number" ? Math.round(b.value).toString(36) : b.value,
            e = Math.round(b.duration);
        b = "" + b.label + (b.slotId != null ? "_" + b.slotId : "") + ("." + d) + (e > 0 ? "_" + e.toString(36) : "") + (b.taskId != null ? "__" + Math.round(b.taskId).toString(36) : "");
        Al(a, c, b, !0, "~")
    };
    xl.prototype.C = function(a) {
        this.l && this.J < this.H && (ol.prototype.C.call(this, a), ul(this, a))
    };
    xl.prototype.B = function() {
        ol.prototype.B.call(this);
        this.g.clearTimeout(this.L);
        this.j = this.L = 0;
        this.report = {};
        ri(this.G);
        ri(this.A);
        Wh(this.g, "load", this.K);
        Wh(this.g, "pagehide", this.M)
    };
    var J = function(a) {
        var b = "vb";
        if (a.vb && a.hasOwnProperty(b)) return a.vb;
        b = new a;
        return a.vb = b
    };
    var K = function() {
            this.g = new xl(1, "https:", "csi.gstatic.com", "/csi?v=2&s=", "ima", void 0, !0);
            var a = Qk();
            a != null && sl(this.g, "c", a);
            a = Math.floor(Number(this.g.A.c) / 2);
            a != null && sl(this.g, "slotId", a)
        },
        L = function(a, b, c) {
            if (c != null) {
                a = a.g;
                var d = b + "=" + c;
                a.G[d] || (Al(a, b, c, !1), d.length < 1E3 && (a.G[d] = !0))
            }
        },
        Cl = function(a, b) {
            for (var c in b) b[c] = typeof b[c] === "object" ? encodeURIComponent(JSON.stringify(b[c])) : encodeURIComponent(String(b[c]));
            a = a.g;
            var d = !1;
            c = 0;
            for (var e = x(Object.keys(b)), f = e.next(); !f.done; f = e.next()) f =
                f.value, a.report[f] != null && (d = !0), c += yl(a, f, b[f], !1);
            (a.o + a.j + c > 8E3 || d) && tl(a);
            d = x(Object.keys(b));
            for (e = d.next(); !e.done; e = d.next()) e = e.value, zl(a, e, b[e], !1);
            a.j += c;
            vl(a)
        },
        Dl = function(a) {
            var b = K.getInstance().g;
            b.l && b.C(new kl(a, 4, gl() - 0, 0))
        };
    K.prototype.recordClick = function(a, b, c, d) {
        for (var e = !1, f = "notag"; d != null && d !== document.documentElement;) {
            var g = void 0,
                h = void 0;
            if (((g = d) == null ? 0 : g.getAttribute("data-ck-navigates")) || ((h = d) == null ? 0 : h.getAttribute("data-ck-tag"))) {
                g = f = void 0;
                e = (g = (f = d) == null ? void 0 : f.getAttribute("data-ck-navigates")) != null ? g : !1;
                h = g = void 0;
                f = (h = (g = d) == null ? void 0 : g.getAttribute("data-ck-tag")) != null ? h : "notag";
                break
            }
            g = void 0;
            d = (g = d.parentElement) != null ? g : void 0
        }
        d = this.g;
        d.l && d.C(new kl(a + "_" + b + "x" + c + "|" + e + "|" + f, 4, gl(),
            0))
    };
    K.getInstance = function() {
        return J(K)
    };
    var El = function(a) {
            return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
        },
        Fl = function(a) {
            try {
                return y.JSON.parse(a)
            } catch (b) {}
            a = String(a);
            if (El(a)) try {
                return eval("(" + a + ")")
            } catch (b) {}
            throw Error("Invalid JSON string: " + a);
        },
        Hl = function() {
            this.g = Gl
        },
        Il = function(a, b, c) {
            if (b ==
                null) c.push("null");
            else {
                if (typeof b == "object") {
                    if (Array.isArray(b)) {
                        var d = b;
                        b = d.length;
                        c.push("[");
                        for (var e = "", f = 0; f < b; f++) c.push(e), e = d[f], Il(a, a.g ? a.g.call(d, String(f), e) : e, c), e = ",";
                        c.push("]");
                        return
                    }
                    if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();
                    else {
                        c.push("{");
                        f = "";
                        for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (e = b[d], typeof e != "function" && (c.push(f), Jl(d, c), c.push(":"), Il(a, a.g ? a.g.call(b, d, e) : e, c), f = ","));
                        c.push("}");
                        return
                    }
                }
                switch (typeof b) {
                    case "string":
                        Jl(b,
                            c);
                        break;
                    case "number":
                        c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");
                        break;
                    case "boolean":
                        c.push(String(b));
                        break;
                    case "function":
                        c.push("null");
                        break;
                    default:
                        throw Error("Unknown type: " + typeof b);
                }
            }
        },
        Kl = {
            '"': '\\"',
            "\\": "\\\\",
            "/": "\\/",
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            "\v": "\\u000b"
        },
        Ll = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g,
        Jl = function(a, b) {
            b.push('"', a.replace(Ll, function(c) {
                var d = Kl[c];
                d || (d = "\\u" + (c.charCodeAt(0) | 65536).toString(16).slice(1),
                    Kl[c] = d);
                return d
            }), '"')
        };
    var Ml = function() {
            this.l = null;
            this.g = "missing-id";
            this.j = !1
        },
        Ol = function(a) {
            var b = null;
            try {
                b = document.getElementsByClassName("lima-exp-data")
            } catch (c) {
                return Nl("missing-element", a.g), null
            }
            if (b.length > 1) return Nl("multiple-elements", a.g), null;
            b = b[0];
            return b ? b.innerHTML : (Nl("missing-element", a.g), null)
        },
        Ql = function() {
            var a = Pl,
                b = Ol(a);
            if (b !== null)
                if (El(b)) {
                    var c = JSON.parse(b);
                    b = c.experimentIds;
                    var d = c.binaryIdentifier;
                    c = c.adEventId;
                    var e = typeof d === "string";
                    if (typeof c == "string") {
                        var f = K.getInstance();
                        c != null && sl(f.g, "qqid", c)
                    }
                    e && (a.g = d);
                    typeof b !== "string" ? Nl("missing-flags", a.g) : (e || Nl("missing-binary-id", a.g), a.l = b)
                } else Nl("invalid-json", a.g)
        };
    Ml.prototype.reset = function() {
        this.l = null;
        this.g = "missing-id"
    };

    function Rl(a, b) {
        var c = Zf(a, Wj, 2, Bf());
        if (!c.length) return Sl(a, b);
        a = F(a, 1);
        if (a === 1) {
            var d = Rl(c[0], b);
            return d.success ? {
                success: !0,
                value: !d.value
            } : d
        }
        c = Vb(c, function(h) {
            return Rl(h, b)
        });
        switch (a) {
            case 2:
                var e;
                return (e = (d = c.find(function(h) {
                    return h.success && !h.value
                })) != null ? d : c.find(function(h) {
                    return !h.success
                })) != null ? e : {
                    success: !0,
                    value: !0
                };
            case 3:
                var f, g;
                return (g = (f = c.find(function(h) {
                    return h.success && h.value
                })) != null ? f : c.find(function(h) {
                    return !h.success
                })) != null ? g : {
                    success: !0,
                    value: !1
                };
            default:
                return {
                    success: !1,
                        errorType: 3
                }
        }
    }

    function Sl(a, b) {
        var c = Rf(a, Xj);
        a: {
            switch (c) {
                case 3:
                    var d = qg(a, 3, Xj);
                    break a;
                case 4:
                    d = qg(a, 4, Xj);
                    break a;
                case 5:
                    d = qg(a, 5, Xj);
                    break a
            }
            d = void 0
        }
        if (!d) return {
            success: !1,
            errorType: 2
        };
        b = (b = b[c]) && b[d];
        if (!b) return {
            success: !1,
            Jb: d,
            hc: c,
            errorType: 1
        };
        try {
            var e = b.apply;
            var f = pg(a, 8, Bf());
            var g = e.call(b, null, ra(f))
        } catch (h) {
            return {
                success: !1,
                Jb: d,
                hc: c,
                errorType: 2
            }
        }
        e = F(a, 1);
        if (e === 4) return {
            success: !0,
            value: !!g
        };
        if (e === 5) return {
            success: !0,
            value: g != null
        };
        if (e === 12) a = E(a, Sf(a, Yj, 7));
        else a: {
            switch (c) {
                case 4:
                    a = mg(a,
                        Sf(a, Yj, 6));
                    break a;
                case 5:
                    a = E(a, Sf(a, Yj, 7));
                    break a
            }
            a = void 0
        }
        if (a == null) return {
            success: !1,
            Jb: d,
            hc: c,
            errorType: 3
        };
        if (e === 6) return {
            success: !0,
            value: g === a
        };
        if (e === 9) return {
            success: !0,
            value: g != null && Cb(String(g), a) === 0
        };
        if (g == null) return {
            success: !1,
            Jb: d,
            hc: c,
            errorType: 4
        };
        switch (e) {
            case 7:
                c = g < a;
                break;
            case 8:
                c = g > a;
                break;
            case 12:
                c = Dd(a) && Dd(g) && (new RegExp(a)).test(g);
                break;
            case 10:
                c = g != null && Cb(String(g), a) === -1;
                break;
            case 11:
                c = g != null && Cb(String(g), a) === 1;
                break;
            default:
                return {
                    success: !1, errorType: 3
                }
        }
        return {
            success: !0,
            value: c
        }
    }

    function Tl(a, b) {
        return a ? b ? Rl(a, b) : {
            success: !1,
            errorType: 1
        } : {
            success: !0,
            value: !0
        }
    };
    var Tf = function(a) {
        this.D = B(a)
    };
    w(Tf, H);
    var Ul = function(a) {
        this.D = B(a)
    };
    w(Ul, H);
    Ul.prototype.getValue = function() {
        return Xf(this, Tf, 2)
    };
    var Vl = function(a) {
        this.D = B(a)
    };
    w(Vl, H);
    var Wl = Kh(Vl),
        Xl = [1, 2, 3, 6, 7, 8];
    var Yl = function(a, b, c) {
            var d = d === void 0 ? new Ak(6, "unknown", b) : d;
            this.o = a;
            this.A = c;
            this.j = d;
            this.g = [];
            this.l = a > 0 && hj() < 1 / a
        },
        $l = function(a, b, c, d, e, f) {
            if (a.l) {
                var g = Ij(Hj(new Gj, b), c);
                b = Qj(Nj(Mj(Pj(Oj(new Lj, d), e), g), a.g.slice()), f);
                b = dk(b);
                a.j.fd(Zl(a, b));
                if (f === 1 || f === 3 || f === 4 && !a.g.some(function(h) {
                        return F(h, 1) === F(g, 1) && F(h, 2) === c
                    })) a.g.push(g), a.g.length > 100 && a.g.shift()
            }
        },
        am = function(a, b, c, d) {
            if (a.l) {
                var e = new Fj;
                b = tg(e, 1, b);
                c = tg(b, 2, c);
                d = xg(c, 3, d);
                c = new bk;
                d = $f(c, 8, ck, d);
                a.j.fd(Zl(a, d))
            }
        },
        bm =
        function(a, b, c, d, e) {
            if (a.l) {
                var f = new Zj;
                b = D(f, 1, b);
                c = xg(b, 2, c);
                d = tg(c, 3, d);
                if (e.hc === void 0) Qf(d, 4, ak, ge(e.errorType));
                else switch (e.hc) {
                    case 3:
                        c = new Uj;
                        c = Qf(c, 2, Vj, ge(e.Jb));
                        e = xg(c, 1, e.errorType);
                        $f(d, 5, ak, e);
                        break;
                    case 4:
                        c = new Uj;
                        c = Qf(c, 3, Vj, ge(e.Jb));
                        e = xg(c, 1, e.errorType);
                        $f(d, 5, ak, e);
                        break;
                    case 5:
                        c = new Uj, c = Qf(c, 4, Vj, ge(e.Jb)), e = xg(c, 1, e.errorType), $f(d, 5, ak, e)
                }
                e = new bk;
                e = $f(e, 9, ck, d);
                a.j.fd(Zl(a, e))
            }
        },
        Zl = function(a, b) {
            var c = Date.now();
            c = Number.isFinite(c) ? Math.round(c) : 0;
            b = vg(b, 1, c);
            c = qj();
            b = vg(b, 2, c);
            return vg(b, 6, a.o)
        };
    var cm = function() {
        var a = {};
        this.Ha = (a[3] = {}, a[4] = {}, a[5] = {}, a)
    };
    var dm = /^true$/.test("false");

    function em(a, b) {
        switch (b) {
            case 1:
                return qg(a, 1, Xl);
            case 2:
                return qg(a, 2, Xl);
            case 3:
                return qg(a, 3, Xl);
            case 6:
                return qg(a, 6, Xl);
            case 8:
                return qg(a, 8, Xl);
            default:
                return null
        }
    }

    function fm(a, b) {
        if (!a) return null;
        switch (b) {
            case 1:
                return hg(a, 1);
            case 7:
                return E(a, 3);
            case 2:
                return mg(a, 2);
            case 3:
                return E(a, 3);
            case 6:
                return pg(a, 4, Bf());
            case 8:
                return pg(a, 4, Bf());
            default:
                return null
        }
    }
    var gm = Qh(function() {
        if (!dm) return {};
        try {
            var a = a === void 0 ? window : a;
            try {
                var b = a.sessionStorage.getItem("GGDFSSK")
            } catch (c) {
                b = null
            }
            if (b) return JSON.parse(b)
        } catch (c) {}
        return {}
    });

    function hm(a, b, c, d) {
        var e = d = d === void 0 ? 0 : d,
            f, g;
        J(im).l[e] = (g = (f = J(im).l[e]) == null ? void 0 : f.add(b)) != null ? g : (new Set).add(b);
        e = gm();
        if (e[b] != null) return e[b];
        b = jm(d)[b];
        if (!b) return c;
        b = Wl(JSON.stringify(b));
        b = km(b);
        a = fm(b, a);
        return a != null ? a : c
    }

    function km(a) {
        var b = J(cm).Ha;
        if (b && Rf(a, Xl) !== 8) {
            var c = $b(Zf(a, Ul, 5, Bf()), function(f) {
                f = Tl(Xf(f, Wj, 1), b);
                return f.success && f.value
            });
            if (c) {
                var d;
                return (d = c.getValue()) != null ? d : null
            }
        }
        var e;
        return (e = Xf(a, Tf, 4)) != null ? e : null
    }
    var im = function() {
        this.j = {};
        this.o = [];
        this.l = {};
        this.g = new Map
    };

    function lm(a, b, c) {
        return !!hm(1, a, b === void 0 ? !1 : b, c)
    }

    function mm(a, b, c) {
        b = b === void 0 ? 0 : b;
        a = Number(hm(2, a, b, c));
        return isNaN(a) ? b : a
    }

    function nm(a, b, c) {
        b = b === void 0 ? "" : b;
        a = hm(3, a, b, c);
        return typeof a === "string" ? a : b
    }

    function om(a, b, c) {
        b = b === void 0 ? [] : b;
        a = hm(6, a, b, c);
        return Array.isArray(a) ? a : b
    }

    function pm(a, b, c) {
        b = b === void 0 ? [] : b;
        a = hm(8, a, b, c);
        return Array.isArray(a) ? a : b
    }

    function jm(a) {
        return J(im).j[a] || (J(im).j[a] = {})
    }

    function qm(a, b) {
        var c = jm(b);
        ij(a, function(d, e) {
            if (c[e]) {
                d = Wl(JSON.stringify(d));
                var f = Sf(d, Xl, 8);
                if (he(xf(d, f)) != null) {
                    var g = Wl(JSON.stringify(c[e]));
                    f = Uf(d);
                    g = pg(Wf(g, Tf, 4), 4, Bf());
                    bg(f, 4, ye, g, Ae)
                }
                c[e] = zg(d)
            } else c[e] = d
        })
    }

    function rm(a, b, c, d, e) {
        e = e === void 0 ? !1 : e;
        var f = [],
            g = [];
        b = x(b);
        for (var h = b.next(); !h.done; h = b.next()) {
            h = h.value;
            for (var k = jm(h), l = x(a), p = l.next(); !p.done; p = l.next()) {
                p = p.value;
                var n = Rf(p, Xl),
                    q = em(p, n);
                if (q) {
                    var t = void 0,
                        u = void 0,
                        v = void 0;
                    var C = (t = (v = J(im).g.get(h)) == null ? void 0 : (u = v.get(q)) == null ? void 0 : u.slice(0)) != null ? t : [];
                    a: {
                        t = q;u = n;v = new Rj;
                        switch (u) {
                            case 1:
                                Qf(v, 1, Sj, ge(t));
                                break;
                            case 2:
                                Qf(v, 2, Sj, ge(t));
                                break;
                            case 3:
                                Qf(v, 3, Sj, ge(t));
                                break;
                            case 6:
                                Qf(v, 4, Sj, ge(t));
                                break;
                            case 8:
                                Qf(v, 6, Sj, ge(t));
                                break;
                            default:
                                C = void 0;
                                break a
                        }
                        Mf(v, 5, C, ie);C = v
                    }
                    if (t = C) u = void 0, t = !((u = J(im).l[h]) == null || !u.has(q));
                    t && f.push(C);
                    if (n === 8 && k[q]) C = Wl(JSON.stringify(k[q])), n = Uf(p), C = pg(Wf(C, Tf, 4), 4, Bf()), bg(n, 4, ye, C, Ae);
                    else {
                        if (n = C) t = void 0, n = !((t = J(im).g.get(h)) == null || !t.has(q));
                        n && g.push(C)
                    }
                    e || (n = q, C = h, t = d, u = J(im), u.g.has(C) || u.g.set(C, new Map), u.g.get(C).has(n) || u.g.get(C).set(n, []), t && u.g.get(C).get(n).push(t));
                    k[q] = zg(p)
                }
            }
        }
        if (f.length || g.length) a = d != null ? d : void 0, c.l && c.A && (d = new Tj, f = ag(d, 2, f), g = ag(f, 3, g),
            a && ug(g, 1, a), f = new bk, g = $f(f, 7, ck, g), c.j.fd(Zl(c, g)))
    }

    function sm(a, b) {
        b = jm(b);
        a = x(a);
        for (var c = a.next(); !c.done; c = a.next()) {
            c = c.value;
            var d = Wl(JSON.stringify(c)),
                e = Rf(d, Xl);
            (d = em(d, e)) && (b[d] || (b[d] = c))
        }
    }

    function tm() {
        return Object.keys(J(im).j).map(function(a) {
            return Number(a)
        })
    }

    function um(a) {
        J(im).o.includes(a) || qm(jm(4), a)
    };

    function vm(a, b, c) {
        c.hasOwnProperty(a) || Object.defineProperty(c, String(a), {
            value: b
        })
    }

    function wm(a, b, c) {
        return b[a] || c
    }

    function xm(a) {
        vm(5, lm, a);
        vm(6, mm, a);
        vm(7, nm, a);
        vm(8, om, a);
        vm(17, pm, a);
        vm(13, sm, a);
        vm(15, um, a)
    }

    function ym(a) {
        vm(4, function(b) {
            J(cm).Ha = b
        }, a);
        vm(9, function(b, c) {
            var d = J(cm);
            d.Ha[3][b] == null && (d.Ha[3][b] = c)
        }, a);
        vm(10, function(b, c) {
            var d = J(cm);
            d.Ha[4][b] == null && (d.Ha[4][b] = c)
        }, a);
        vm(11, function(b, c) {
            var d = J(cm);
            d.Ha[5][b] == null && (d.Ha[5][b] = c)
        }, a);
        vm(14, function(b) {
            for (var c = J(cm), d = x([3, 4, 5]), e = d.next(); !e.done; e = d.next()) e = e.value, Object.assign(c.Ha[e], b[e])
        }, a)
    }

    function zm(a) {
        a.hasOwnProperty("init-done") || Object.defineProperty(a, "init-done", {
            value: !0
        })
    };
    var Am = function() {};
    Am.prototype.j = function() {};
    Am.prototype.g = function() {
        return []
    };
    var Bm = function(a, b, c) {
        a.j = function(d, e) {
            wm(2, b, function() {
                return []
            })(d, c, e)
        };
        a.g = function() {
            return wm(3, b, function() {
                return []
            })(c)
        }
    };
    var Cm = function(a, b, c) {
            this.id = a;
            this.I = b;
            this.j = c;
            this.g = !1
        },
        Dm = function(a) {
            return a.g || a.j
        },
        Em = function() {
            this.g = []
        },
        Fm = function() {
            this.g = new Map;
            this.j = !1;
            this.o = new Em;
            this.A = new Cm(0, 0, !1);
            this.l = [this.o]
        },
        M = function(a) {
            var b = Gm;
            if (b.j || b.g.has(a.id) || a.I == null && a.control == null || a.gj == 0) return b.A;
            var c = b.o;
            if (a.control != null)
                for (var d = x(b.l), e = d.next(); !e.done; e = d.next()) {
                    if (e = e.value, e.g.includes(a.control)) {
                        c = e;
                        break
                    }
                } else a.fa != null && (c = a.fa);
            d = 0;
            a.control != null ? d = a.control.I : a.I != null &&
                (d = a.I);
            a = new Cm(a.id, d, !!a.jj);
            c.g.push(a);
            b.l.includes(c) || b.l.push(c);
            b.g.set(a.id, a);
            return a
        },
        Hm = function() {
            var a = Gm;
            a = [].concat(ra(a.g.keys())).filter(function(c) {
                return Dm(this.g.get(c))
            }, a);
            var b = J(Am).g();
            return [].concat(ra(a), ra(b))
        },
        Im = function(a) {
            var b = Gm;
            b.j || (a.g(b.l, b.g), b.j = !0)
        };
    Fm.prototype.reset = function() {
        for (var a = x(this.g), b = a.next(); !b.done; b = a.next()) b = x(b.value), b.next(), b.next().value.g = !1;
        this.j = !1
    };
    var Gm = new Fm,
        Km = function() {
            return Jm.g.filter(function(a) {
                return Dm(a)
            }).map(function(a) {
                return a.id
            })
        };
    var Lm = function() {};
    Lm.prototype.g = function(a) {
        a = x(a);
        for (var b = a.next(); !b.done; b = a.next()) {
            var c = 0,
                d = Math.floor(Math.random() * 1E3);
            b = x(b.value.g);
            for (var e = b.next(); !e.done; e = b.next())
                if (e = e.value, c += e.I, d < c) {
                    e.g = !0;
                    break
                }
        }
    };
    var Mm = function(a) {
        this.j = a
    };
    Mm.prototype.g = function(a, b) {
        a = x(this.j);
        for (var c = a.next(); !c.done; c = a.next())
            if (c = b.get(c.value)) c.g = !0
    };
    var Nm = function(a, b) {
        this.j = a;
        this.l = b
    };
    w(Nm, Mm);
    Nm.prototype.g = function(a, b) {
        Mm.prototype.g.call(this, a, b);
        var c = [];
        a = [];
        for (var d = x(this.j), e = d.next(); !e.done; e = d.next()) e = e.value, b.get(e) ? c.push(e) : a.push(e);
        b = c.map(String).join(",") || "0";
        a = a.map(String).join(",") || "0";
        L(K.getInstance(), "sei", b);
        L(K.getInstance(), "nsei", a);
        L(K.getInstance(), "bi", this.l)
    };
    var Om = function() {
        Ml.apply(this, arguments)
    };
    w(Om, Ml);
    var Nl = function(a, b) {
        var c = K.getInstance();
        L(c, "eee", a);
        L(c, "bi", b)
    };
    Om.getInstance = function() {
        return J(Om)
    };

    function Pm() {
        return Qm.split(",").map(function(a) {
            return parseInt(a, 10)
        }).filter(function(a) {
            return !isNaN(a)
        })
    };
    var Jm = new Em,
        Rm = new Em,
        Sm = new Em,
        Tm = new Em,
        Um = new Em,
        Vm = new Em,
        Wm = new Em,
        Xm = new Em;
    M({
        id: 95342637,
        I: 0
    });
    M({
        id: 318475490,
        I: 0
    });
    M({
        id: 324123032,
        I: 0
    });
    M({
        id: 420706097,
        I: 10
    });
    M({
        id: 420706098,
        I: 10
    });
    M({
        id: 95342168,
        I: 10
    });
    M({
        id: 95342169,
        I: 10
    });
    M({
        id: 21062100,
        I: 0
    });
    M({
        id: 420706142,
        I: 0
    });
    M({
        id: 44745813,
        I: 0
    });
    M({
        id: 44746068,
        I: 0
    });
    M({
        id: 21064565,
        I: 0
    });
    M({
        id: 21064567,
        I: 0
    });
    M({
        id: 418572006,
        I: 10
    });
    M({
        id: 95338773,
        I: 10,
        fa: Tm
    });
    M({
        id: 95338774,
        I: 10,
        fa: Tm
    });
    M({
        id: 95334214,
        I: 10
    });
    M({
        id: 95334215,
        I: 10
    });
    M({
        id: 44749839,
        I: 0
    });
    M({
        id: 44714743,
        I: 0
    });
    M({
        id: 44715336,
        I: 10
    });
    M({
        id: 44724516,
        I: 0
    });
    M({
        id: 44726389,
        I: 10
    });
    M({
        id: 44752711,
        I: 50
    });
    M({
        id: 44752052,
        I: 50
    });
    M({
        id: 44752657,
        I: 50
    });
    M({
        id: 44733246,
        I: 10
    });
    M({
        id: 95343833,
        I: 10,
        fa: Rm
    });
    M({
        id: 95343834,
        I: 10,
        fa: Rm
    });
    M({
        id: 95343835,
        I: 10,
        fa: Rm
    });
    M({
        id: 95343836,
        I: 10,
        fa: Rm
    });
    M({
        id: 95343837,
        I: 10,
        fa: Rm
    });
    M({
        id: 44750822,
        I: 10,
        fa: Rm
    });
    M({
        id: 44751889,
        I: 10
    });
    M({
        id: 44751890,
        I: 10
    });
    M({
        id: 44752995,
        I: 10
    });
    M({
        id: 44752996,
        I: 10
    });
    M({
        id: 44762627,
        I: 0
    });
    M({
        id: 44762628,
        I: 0
    });
    M({
        id: 44801479,
        I: 10,
        fa: Sm
    });
    M({
        id: 44801480,
        I: 10,
        fa: Sm
    });
    M({
        id: 44752538,
        I: 0
    });
    M({
        id: 44754608,
        I: 10
    });
    M({
        id: 44754609,
        I: 10
    });
    M({
        id: 44776384,
        I: 0
    });
    M({
        id: 95322945,
        I: 10
    });
    var Ym = M({
        id: 95322946,
        I: 10
    });
    M({
        id: 44789282,
        I: 0
    });
    M({
        id: 44792636,
        I: 0
    });
    M({
        id: 95344889,
        I: 0
    });
    M({
        id: 95334260,
        I: 0
    });
    M({
        id: 95345698,
        I: 0
    });
    var Zm = M({
            id: 75259416,
            I: 0
        }),
        $m = M({
            id: 75259420,
            I: 0
        }),
        an = M({
            id: 75259421,
            I: 0
        });
    M({
        id: 45401791,
        I: 0
    });
    M({
        id: 95326337,
        I: 990,
        fa: Um
    });
    var bn = window.navigator || {},
        cn = bn.cookieDeprecationLabel ? 990 : 0;
    M({
        id: 95322906,
        I: bn.cookieDeprecationLabel ? 10 : 0,
        fa: Vm
    });
    var dn = M({
            id: 95320461,
            I: 0,
            fa: Vm
        }),
        en = M({
            id: 95322907,
            I: cn,
            fa: Vm
        });
    M({
        id: 44809192,
        I: 10,
        fa: Xm
    });
    M({
        id: 44809193,
        I: 10,
        fa: Xm
    });
    M({
        id: 95320804,
        I: 10,
        fa: Xm
    });
    M({
        id: 95320805,
        I: 10,
        fa: Xm
    });
    M({
        id: 95322027,
        I: 1E3,
        fa: Wm
    });
    var fn = M({
        id: 46130031,
        I: 0
    });
    M({
        id: 95328713,
        I: 10
    });
    M({
        id: 95328714,
        I: 10
    });
    var gn = M({
        id: 95327848,
        I: 0
    });
    M({
        id: 31065644,
        I: 1
    });
    var hn = M({
            id: 31065645,
            I: 1
        }),
        jn = new Em;
    M({
        id: 95331588,
        I: 0,
        fa: jn
    });
    M({
        id: 95331589,
        I: 1E3,
        fa: jn
    });
    var kn = M({
        id: 95332182,
        I: 0
    });
    M({
        id: 95347814,
        I: 10
    });
    M({
        id: 95347815,
        I: 10
    });
    if (typeof window.initializeVirtualDom === "undefined") {
        var Pl = Om.getInstance();
        Pl.j || (Ql(), Pl.j = !0);
        var Qm = Pl.l,
            ln;
        Pl.j || (Ql(), Pl.j = !0);
        ln = Pl.g;
        if (Qm != null) {
            var mn = new Nm(Pm(), ln);
            Im(mn)
        }
    };
    var nn = function(a) {
        this.D = B(a)
    };
    w(nn, H);
    nn.prototype.getId = function() {
        return ig(this, 1)
    };
    var on = function(a) {
        this.D = B(a)
    };
    w(on, H);
    var pn = function(a) {
        return Zf(a, nn, 2, Bf())
    };
    var qn = function(a) {
        this.D = B(a)
    };
    w(qn, H);
    var rn = function(a) {
        this.D = B(a)
    };
    w(rn, H);
    var sn = function(a) {
        this.D = B(a)
    };
    w(sn, H);
    var tn = Jh(sn);

    function un() {
        return jf(tn("[[[45669828,null,null,[]],[45669829,null,null,[]],[45641707,null,null,[1]],[45663239,null,null,[]],[45642592,null,null,[1]],[45661356,null,null,[]],[45642676,null,null,[]],[45640378,null,null,[]],[null,45645574,null,[]],[45656766,null,null,[]],[45652001,null,null,[1]],[45652000,null,null,[1]],[45651995,null,null,[]],[45651993,null,null,[]],[45651997,null,null,[]],[45651996,null,null,[1]],[45647593,null,null,[]],[45647592,null,null,[]],[45650216,null,null,[1]],[45658982,null,null,[1]]],[[16,[[1000,[[95332046]]],[null,[[95332047]]],[10,[[95333808],[95333809,[[635466687,null,null,[1]]]]]],[10,[[95336351],[95336352,[[45640378,null,null,[1]]]]]],[10,[[95338769,[[null,45645574,null,[null,1]]]],[95338770,[[null,45645574,null,[null,2]]]]]],[50,[[95344129],[95344130,[[45658982,null,null,[]]]]]],[10,[[95345206],[95345207,[[45661356,null,null,[1]]]]]],[10,[[95346932],[95346933,[[45663239,null,null,[1]]]]]],[5,[[95348755,[[45642592,null,null,[]]]],[95348756,[[45642592,null,null,[1]]]]]],[10,[[95348947,[[45669829,null,null,[1]]]],[95348948,[[45669828,null,null,[1]],[45669829,null,null,[1]]]],[95348949],[95348950,[[45669828,null,null,[1]]]]]]]]],null,null,[null,1000,1,1000]]"))
    };
    var vn = ["A9AxgGSwmnfgzzkyJHILUr3H8nJ/3D+57oAsL4DBt4USlng4jZ0weq+fZtHC/Qwwn6gd4QSa5DzT3OBif+kXVA0AAAB4eyJvcmlnaW4iOiJodHRwczovL2ltYXNkay5nb29nbGVhcGlzLmNvbTo0NDMiLCJmZWF0dXJlIjoiUHJpdmFjeVNhbmRib3hBZHNBUElzIiwiZXhwaXJ5IjoxNjk1MTY3OTk5LCJpc1RoaXJkUGFydHkiOnRydWV9", "AlK2UR5SkAlj8jjdEc9p3F3xuFYlF6LYjAML3EOqw1g26eCwWPjdmecULvBH5MVPoqKYrOfPhYVL71xAXI1IBQoAAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="];

    function wn(a, b) {
        b = b === void 0 ? document : b;
        var c;
        return !((c = b.featurePolicy) == null || !c.features().includes(a))
    }

    function xn(a, b) {
        b = b === void 0 ? document : b;
        var c;
        return !((c = b.featurePolicy) == null || !c.allowedFeatures().includes(a))
    }

    function yn() {
        var a = window.navigator,
            b = window.document;
        return !!(window.isSecureContext && "runAdAuction" in a && a.runAdAuction instanceof Function && xn("run-ad-auction", b))
    };

    function zn(a, b) {
        try {
            var c = a.split(".");
            a = y;
            for (var d = 0, e; a != null && d < c.length; d++) e = a, a = a[c[d]], typeof a === "function" && (a = e[c[d]]());
            var f = a;
            if (typeof f === b) return f
        } catch (g) {}
    }
    var An = {},
        Bn = {},
        Cn = {},
        Dn = {},
        En = (Dn[3] = (An[8] = function(a) {
            try {
                return Sa(a) != null
            } catch (b) {}
        }, An[9] = function(a) {
            try {
                var b = Sa(a)
            } catch (c) {
                return
            }
            return typeof b === "function" && mj(b)
        }, An[10] = function() {
            return window === window.top
        }, An[6] = function(a) {
            return bc(J(Am).g(), Number(a))
        }, An[27] = function(a) {
            a = zn(a, "boolean");
            return a !== void 0 ? a : void 0
        }, An[60] = function(a) {
            try {
                return !!y.document.querySelector(a)
            } catch (b) {}
        }, An[80] = function(a) {
            try {
                return !!y.matchMedia(a).matches
            } catch (b) {}
        }, An[69] = function(a) {
            return wn(a,
                y.document)
        }, An[70] = function(a) {
            return xn(a, y.document)
        }, An[79] = function(a) {
            var b = y.navigator;
            b = b === void 0 ? navigator : b;
            try {
                var c, d;
                var e = !!((c = b.protectedAudience) == null ? 0 : (d = c.queryFeatureSupport) == null ? 0 : d.call(c, a))
            } catch (f) {
                e = !1
            }
            return e
        }, An), Dn[4] = (Bn[3] = function() {
            return pj()
        }, Bn[6] = function(a) {
            a = zn(a, "number");
            return a !== void 0 ? a : void 0
        }, Bn), Dn[5] = (Cn[2] = function() {
            return window.location.href
        }, Cn[3] = function() {
            try {
                return window.top.location.hash
            } catch (a) {
                return ""
            }
        }, Cn[4] = function(a) {
            a = zn(a,
                "string");
            return a !== void 0 ? a : void 0
        }, Cn[12] = function(a) {
            try {
                var b = zn(a, "string");
                if (b !== void 0) return atob(b)
            } catch (c) {}
        }, Cn), Dn);

    function Fn() {
        var a = a === void 0 ? y : a;
        return a.ggeac || (a.ggeac = {})
    };

    function Gn(a) {
        var b = {};
        return Hn((b[0] = new Map, b[1] = new Map, b[2] = new Map, b), a)
    }

    function Hn(a, b) {
        for (var c = new Map, d = x(a[1].entries()), e = d.next(); !e.done; e = d.next()) {
            var f = x(e.value);
            e = f.next().value;
            f = f.next().value;
            f = f[f.length - 1];
            c.set(e, f.hf + f.Oe * f.Pe)
        }
        b = x(b);
        for (d = b.next(); !d.done; d = b.next())
            for (d = d.value, e = Zf(d, on, 2, Bf()), e = x(e), f = e.next(); !f.done; f = e.next())
                if (f = f.value, pn(f).length !== 0) {
                    var g = jg(f, 8);
                    if (F(f, 4) && !F(f, 13) && !F(f, 14)) {
                        var h = void 0;
                        g = (h = c.get(F(f, 4))) != null ? h : 0;
                        h = jg(f, 1) * pn(f).length;
                        c.set(F(f, 4), g + h)
                    }
                    h = [];
                    for (var k = 0; k < pn(f).length; k++) {
                        var l = {
                            hf: g,
                            Oe: jg(f,
                                1),
                            Pe: pn(f).length,
                            Qg: k,
                            Ec: F(d, 1),
                            kd: f,
                            Ma: pn(f)[k]
                        };
                        h.push(l)
                    }
                    In(a[2], F(f, 10), h) || In(a[1], F(f, 4), h) || In(a[0], pn(f)[0].getId(), h)
                } return a
    }

    function In(a, b, c) {
        if (!b) return !1;
        a.has(b) || a.set(b, []);
        var d;
        (d = a.get(b)).push.apply(d, ra(c));
        return !0
    };
    var Jn = [12, 13, 20],
        Kn = function(a, b, c, d) {
            d = d === void 0 ? {} : d;
            var e = d.Bd === void 0 ? !1 : d.Bd;
            d = d.fh === void 0 ? [] : d.fh;
            this.bc = a;
            this.ob = c;
            this.o = {};
            this.Bd = e;
            a = {};
            this.g = (a[b] = [], a[4] = [], a);
            this.j = {};
            this.l = {};
            if (b = fl())
                for (b = x(b.split(",") || []), a = b.next(); !a.done; a = b.next())(a = Number(a.value)) && (this.j[a] = !0);
            d = x(d);
            for (b = d.next(); !b.done; b = d.next()) this.j[b.value] = !0
        },
        Nn = function(a, b, c, d) {
            var e = [],
                f;
            if (f = b !== 9) a.o[b] ? f = !0 : (a.o[b] = !0, f = !1);
            if (f) return $l(a.ob, b, c, e, [], 4), e;
            f = Jn.includes(b);
            for (var g = [], h = [], k = x([0, 1, 2]), l = k.next(); !l.done; l = k.next()) {
                l = l.value;
                for (var p = x(a.bc[l].entries()), n = p.next(); !n.done; n = p.next()) {
                    var q = x(n.value);
                    n = q.next().value;
                    q = q.next().value;
                    var t = n,
                        u = q;
                    n = new Jj;
                    q = u.filter(function(da) {
                        return da.Ec === b && a.j[da.Ma.getId()] && Ln(a, da)
                    });
                    if (q.length)
                        for (n = x(q), q = n.next(); !q.done; q = n.next()) h.push(q.value.Ma);
                    else if (!a.Bd) {
                        q = void 0;
                        l === 2 ? (q = d[1], Qf(n, 2, Kj, ge(t))) : q = d[0];
                        var v = void 0,
                            C = void 0;
                        q = (C = (v = q) == null ? void 0 : v(String(t))) != null ? C : l === 2 && F(u[0].kd, 11) === 1 ? void 0 : d[0](String(t));
                        if (q !== void 0) {
                            t = x(u);
                            for (u = t.next(); !u.done; u = t.next())
                                if (u = u.value, u.Ec === b) {
                                    v = q - u.hf;
                                    var R = u;
                                    C = R.Oe;
                                    var U = R.Pe;
                                    R = R.Qg;
                                    v < 0 || v >= C * U || v % U !== R || !Ln(a, u) || (v = F(u.kd, 13), v !== 0 && v !== void 0 && (C = a.l[String(v)], C !== void 0 && C !== u.Ma.getId() ? am(a.ob, a.l[String(v)], u.Ma.getId(), v) : a.l[String(v)] = u.Ma.getId()), h.push(u.Ma))
                                } Rf(n, Kj) !== 0 && (ug(n, 3, q), g.push(n))
                        }
                    }
                }
            }
            d = x(h);
            for (h = d.next(); !h.done; h = d.next()) h = h.value, k = h.getId(), e.push(k), Mn(a, k, f ? 4 : c), rm(Zf(h, Vl, 2, Bf()), f ? tm() : [c], a.ob, k);
            $l(a.ob, b, c, e, g, 1);
            return e
        },
        Mn = function(a, b, c) {
            a.g[c] || (a.g[c] = []);
            a = a.g[c];
            a.includes(b) || a.push(b)
        },
        Ln = function(a, b) {
            var c = J(cm).Ha,
                d = Tl(Xf(b.kd, Wj, 3), c);
            if (!d.success) return bm(a.ob, Xf(b.kd, Wj, 3), b.Ec, b.Ma.getId(), d), !1;
            if (!d.value) return !1;
            c = Tl(Xf(b.Ma, Wj, 3), c);
            return c.success ? c.value ? !0 : !1 : (bm(a.ob, Xf(b.Ma, Wj, 3), b.Ec, b.Ma.getId(), c), !1)
        },
        On = function(a, b) {
            b = b.map(function(c) {
                return new qn(c)
            }).filter(function(c) {
                return !Jn.includes(F(c, 1))
            });
            a.bc = Hn(a.bc, b)
        },
        Pn = function(a, b) {
            vm(1, function(c) {
                a.j[c] = !0
            }, b);
            vm(2, function(c,
                d, e) {
                return Nn(a, c, d, e)
            }, b);
            vm(3, function(c) {
                return (a.g[c] || []).concat(a.g[4])
            }, b);
            vm(12, function(c) {
                return void On(a, c)
            }, b);
            vm(16, function(c, d) {
                return void Mn(a, c, d)
            }, b)
        };
    var Qn = function() {
        var a = {};
        this.g = function(b, c) {
            return a[b] != null ? a[b] : c
        };
        this.j = function(b, c) {
            return a[b] != null ? a[b] : c
        };
        this.A = function(b, c) {
            return a[b] != null ? a[b] : c
        };
        this.B = function(b, c) {
            return a[b] != null ? a[b] : c
        };
        this.o = function(b, c) {
            return a[b] != null ? c.concat(a[b]) : c
        };
        this.l = function() {}
    };

    function Rn(a) {
        return J(Qn).g(a.g, a.defaultValue)
    };
    var Sn = function() {
            this.g = function() {}
        },
        Tn = function(a, b) {
            a.g = wm(14, b, function() {})
        };

    function Un(a) {
        J(Sn).g(a)
    };
    var Vn, Wn, Xn, Yn, Zn, $n;

    function ao(a, b) {
        var c = b = b === void 0 ? Fn() : b;
        Bm(J(Am), c, a);
        bo(b, a);
        a = b;
        Tn(J(Sn), a);
        J(Qn).l()
    }

    function bo(a, b) {
        var c = J(Qn);
        c.g = function(d, e) {
            return wm(5, a, function() {
                return !1
            })(d, e, b)
        };
        c.j = function(d, e) {
            return wm(6, a, function() {
                return 0
            })(d, e, b)
        };
        c.A = function(d, e) {
            return wm(7, a, function() {
                return ""
            })(d, e, b)
        };
        c.B = function(d, e) {
            return wm(8, a, function() {
                return []
            })(d, e, b)
        };
        c.o = function(d, e) {
            return wm(17, a, function() {
                return []
            })(d, e, b)
        };
        c.l = function() {
            wm(15, a, function() {})(b)
        }
    };
    Gm.reset();
    Im(new Lm);
    (function(a) {
        var b = a.ng;
        var c = a.Ha;
        var d = a.config;
        var e = a.Xf === void 0 ? Fn() : a.Xf;
        var f = a.xe === void 0 ? 0 : a.xe;
        var g = a.ob === void 0 ? new Yl((Yn = (Vn = Xf(b, rn, 5)) == null ? void 0 : kg(Vn, 2)) != null ? Yn : 0, (Zn = (Wn = Xf(b, rn, 5)) == null ? void 0 : kg(Wn, 4)) != null ? Zn : 0, ($n = (Xn = Xf(b, rn, 5)) == null ? void 0 : hg(Xn, 3)) != null ? $n : !1) : a.ob;
        a = a.bc === void 0 ? Gn(Zf(b, qn, 2, Bf(Ad))) : a.bc;
        e.hasOwnProperty("init-done") ? (wm(12, e, function() {})(Zf(b, qn, 2, Bf()).map(function(h) {
            return zg(h)
        })), wm(13, e, function() {})(Zf(b, Vl, 1, Bf()).map(function(h) {
                return zg(h)
            }),
            f), c && wm(14, e, function() {})(c), ao(f, e)) : (Pn(new Kn(a, f, g, d), e), xm(e), ym(e), zm(e), ao(f, e), rm(Zf(b, Vl, 1, Bf(Ad)), [f], g, void 0, !0), dm = dm || !(!d || !d.lj), Un(En), c && Un(c))
    })({
        ng: un(),
        xe: 7
    });
    var co = qj(),
        eo = {},
        fo = (eo[0] = function(a) {
            a = a === void 0 ? hj() : a;
            return function(b) {
                return jj(b + " + " + a) % 1E3
            }
        }(co), eo);
    J(Am).j(16, fo);
    var go = function(a) {
        var b = {};
        Sb(a, function(c) {
            var d = c.event,
                e = b[d];
            b.hasOwnProperty(d) ? e !== null && (c.g(e) || (b[d] = null)) : b[d] = c
        });
        ec(a, function(c) {
            return b[c.event] === null
        })
    };
    var ho = {
            NONE: 0,
            Oh: 1
        },
        io = {
            Mh: 0,
            Ji: 1,
            Ii: 2,
            Ki: 3
        },
        jo = {
            rf: "a",
            Nh: "d",
            VIDEO: "v"
        };
    var ko = function() {
        this.X = 0;
        this.g = !1;
        this.j = -1;
        this.wb = !1;
        this.sa = 0
    };
    ko.prototype.isVisible = function() {
        return this.wb ? this.X >= .3 : this.X >= .5
    };
    var lo = {
            Lh: 0,
            Rh: 1
        },
        mo = {
            668123728: 0,
            668123729: 1
        },
        no = {
            44731964: 0,
            44731965: 1
        },
        oo = {
            NONE: 0,
            wi: 1,
            Wh: 2
        },
        po = {
            480596784: 0,
            480596785: 1,
            21063355: 2
        };
    var qo = function() {
            this.g = null;
            this.o = !1;
            this.l = null
        },
        ro = function(a) {
            a.o = !0;
            return a
        },
        so = function(a, b) {
            a.l && Sb(b, function(c) {
                c = a.l[c];
                c !== void 0 && a.j(c)
            })
        };
    qo.prototype.getValue = function() {
        return this.g
    };
    var to = function(a) {
        qo.call(this);
        this.A = a
    };
    w(to, qo);
    to.prototype.j = function(a) {
        this.g === null && ni(this.A, a) && (this.g = a)
    };
    var uo = function() {
        qo.call(this)
    };
    w(uo, qo);
    uo.prototype.j = function(a) {
        this.g === null && typeof a === "number" && (this.g = a)
    };
    var vo = function() {
        qo.call(this)
    };
    w(vo, qo);
    vo.prototype.j = function(a) {
        this.g === null && typeof a === "string" && (this.g = a)
    };
    var wo = function() {
        this.g = {};
        this.l = !0;
        this.j = {}
    };
    wo.prototype.reset = function() {
        this.g = {};
        this.l = !0;
        this.j = {}
    };
    var xo = function(a, b, c) {
            a.g[b] || (a.g[b] = new to(c));
            return a.g[b]
        },
        yo = function(a) {
            a.g.queryid || (a.g.queryid = new vo)
        },
        zo = function(a, b, c) {
            (a = a.g[b]) && a.j(c)
        },
        Ao = function(a, b) {
            if (mi(a.j, b)) return a.j[b];
            if (a = a.g[b]) return a.getValue()
        },
        Bo = function(a) {
            var b = {},
                c = $h(a.g, function(d) {
                    return d.o
                });
            Zh(c, function(d, e) {
                d = a.j[e] !== void 0 ? String(a.j[e]) : d.o && d.g !== null ? String(d.g) : "";
                d.length > 0 && (b[e] = d)
            }, a);
            return b
        },
        Co = function(a) {
            a = Bo(a);
            var b = [];
            Zh(a, function(c, d) {
                d in Object.prototype || typeof c != "undefined" &&
                    b.push([d, ":", c].join(""))
            });
            return b
        },
        Do = function() {
            var a = N().R,
                b = Km();
            a.l && Sb(ji(a.g), function(c) {
                return so(c, b)
            })
        };
    var Eo = function(a) {
        xo(a, "od", ho);
        ro(xo(a, "opac", lo));
        ro(xo(a, "sbeos", lo));
        ro(xo(a, "prf", lo));
        ro(xo(a, "mwt", lo));
        xo(a, "iogeo", lo)
    };
    var Fo = document,
        O = window;
    var Go = !qc && !Nb();
    var Jo = function(a) {
            return a ? new Ho(Io(a)) : lb || (lb = new Ho)
        },
        Ko = function(a) {
            var b = document;
            return typeof a === "string" ? b.getElementById(a) : a
        },
        Mo = function(a, b) {
            Zh(b, function(c, d) {
                d == "style" ? a.style.cssText = c : d == "class" ? a.className = c : d == "for" ? a.htmlFor = c : Lo.hasOwnProperty(d) ? a.setAttribute(Lo[d], c) : d.lastIndexOf("aria-", 0) == 0 || d.lastIndexOf("data-", 0) == 0 ? a.setAttribute(d, c) : a[d] = c
            })
        },
        Lo = {
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing",
            colspan: "colSpan",
            frameborder: "frameBorder",
            height: "height",
            maxlength: "maxLength",
            nonce: "nonce",
            role: "role",
            rowspan: "rowSpan",
            type: "type",
            usemap: "useMap",
            valign: "vAlign",
            width: "width"
        },
        No = function(a) {
            a = a.document;
            a = a.compatMode == "CSS1Compat" ? a.documentElement : a.body;
            return new Fk(a.clientWidth, a.clientHeight)
        },
        Oo = function(a) {
            var b = a.scrollingElement ? a.scrollingElement : tc || a.compatMode != "CSS1Compat" ? a.body || a.documentElement : a.documentElement;
            a = a.defaultView;
            return new Bk(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
        },
        Po = function(a) {
            return a ? a.defaultView : window
        },
        So = function(a,
            b, c) {
            var d = arguments,
                e = document,
                f = d[1],
                g = Qo(e, String(d[0]));
            f && (typeof f === "string" ? g.className = f : Array.isArray(f) ? g.className = f.join(" ") : Mo(g, f));
            d.length > 2 && Ro(e, g, d, 2);
            return g
        },
        Ro = function(a, b, c, d) {
            function e(h) {
                h && b.appendChild(typeof h === "string" ? a.createTextNode(h) : h)
            }
            for (; d < c.length; d++) {
                var f = c[d];
                if (!Va(f) || Wa(f) && f.nodeType > 0) e(f);
                else {
                    a: {
                        if (f && typeof f.length == "number") {
                            if (Wa(f)) {
                                var g = typeof f.item == "function" || typeof f.item == "string";
                                break a
                            }
                            if (typeof f === "function") {
                                g = typeof f.item ==
                                    "function";
                                break a
                            }
                        }
                        g = !1
                    }
                    Sb(g ? gc(f) : f, e)
                }
            }
        },
        Qo = function(a, b) {
            b = String(b);
            a.contentType === "application/xhtml+xml" && (b = b.toLowerCase());
            return a.createElement(b)
        },
        To = function(a) {
            a && a.parentNode && a.parentNode.removeChild(a)
        },
        Uo = function(a, b) {
            if (!a || !b) return !1;
            if (a.contains && b.nodeType == 1) return a == b || a.contains(b);
            if (typeof a.compareDocumentPosition != "undefined") return a == b || !!(a.compareDocumentPosition(b) & 16);
            for (; b && a != b;) b = b.parentNode;
            return b == a
        },
        Io = function(a) {
            return a.nodeType == 9 ? a : a.ownerDocument ||
                a.document
        },
        Vo = function(a) {
            try {
                return a.contentWindow || (a.contentDocument ? Po(a.contentDocument) : null)
            } catch (b) {}
            return null
        },
        Wo = function(a, b) {
            a && (a = a.parentNode);
            for (var c = 0; a;) {
                if (b(a)) return a;
                a = a.parentNode;
                c++
            }
            return null
        },
        Ho = function(a) {
            this.g = a || y.document || document
        };
    m = Ho.prototype;
    m.getElementsByTagName = function(a, b) {
        return (b || this.g).getElementsByTagName(String(a))
    };
    m.appendChild = function(a, b) {
        a.appendChild(b)
    };
    m.append = function(a, b) {
        Ro(Io(a), a, arguments, 1)
    };
    m.canHaveChildren = function(a) {
        if (a.nodeType != 1) return !1;
        switch (a.tagName) {
            case "APPLET":
            case "AREA":
            case "BASE":
            case "BR":
            case "COL":
            case "COMMAND":
            case "EMBED":
            case "FRAME":
            case "HR":
            case "IMG":
            case "INPUT":
            case "IFRAME":
            case "ISINDEX":
            case "KEYGEN":
            case "LINK":
            case "NOFRAMES":
            case "NOSCRIPT":
            case "META":
            case "OBJECT":
            case "PARAM":
            case "SCRIPT":
            case "SOURCE":
            case "STYLE":
            case "TRACK":
            case "WBR":
                return !1
        }
        return !0
    };
    m.contains = Uo;
    var Xo = function() {
        this.g = this.nb = null
    };
    var Yo = function() {};
    Yo.prototype.now = function() {
        return 0
    };
    Yo.prototype.j = function() {
        return 0
    };
    Yo.prototype.l = function() {
        return 0
    };
    Yo.prototype.g = function() {
        return 0
    };
    var $o = function() {
        if (!Zo()) throw Error();
    };
    w($o, Yo);
    var Zo = function() {
        return !(!O || !O.performance)
    };
    $o.prototype.now = function() {
        return Zo() && O.performance.now ? O.performance.now() : Yo.prototype.now.call(this)
    };
    $o.prototype.j = function() {
        return Zo() && O.performance.memory ? O.performance.memory.totalJSHeapSize || 0 : Yo.prototype.j.call(this)
    };
    $o.prototype.l = function() {
        return Zo() && O.performance.memory ? O.performance.memory.usedJSHeapSize || 0 : Yo.prototype.l.call(this)
    };
    $o.prototype.g = function() {
        return Zo() && O.performance.memory ? O.performance.memory.jsHeapSizeLimit || 0 : Yo.prototype.g.call(this)
    };
    var ap = function() {};
    ap.prototype.isVisible = function() {
        return Uk(Fo) === 1
    };
    var bp = RegExp("^https?://(\\w|-)+\\.cdn\\.ampproject\\.(net|org)(\\?|/|$)"),
        fp = function(a) {
            a = a || cp();
            for (var b = new dp(y.location.href, !1), c = null, d = a.length - 1, e = d; e >= 0; --e) {
                var f = a[e];
                !c && bp.test(f.url) && (c = f);
                if (f.url && !f.Hd) {
                    b = f;
                    break
                }
            }
            e = null;
            f = a.length && a[d].url;
            b.depth != 0 && f && (e = a[d]);
            return new ep(b, e, c)
        },
        cp = function() {
            var a = y,
                b = [],
                c = null;
            do {
                var d = a;
                if (cj(d)) {
                    var e = d.location.href;
                    c = d.document && d.document.referrer || null
                } else e = c, c = null;
                b.push(new dp(e || ""));
                try {
                    a = d.parent
                } catch (f) {
                    a = null
                }
            } while (a &&
                d != a);
            d = 0;
            for (a = b.length - 1; d <= a; ++d) b[d].depth = a - d;
            d = y;
            if (d.location && d.location.ancestorOrigins && d.location.ancestorOrigins.length == b.length - 1)
                for (a = 1; a < b.length; ++a) e = b[a], e.url || (e.url = d.location.ancestorOrigins[a - 1] || "", e.Hd = !0);
            return b
        },
        ep = function(a, b, c) {
            this.g = a;
            this.j = b;
            this.l = c
        },
        dp = function(a, b) {
            this.url = a;
            this.Hd = !!b;
            this.depth = null
        };
    var gp = function() {
            this.l = "&";
            this.j = {};
            this.o = 0;
            this.g = []
        },
        hp = function(a, b) {
            var c = {};
            c[a] = b;
            return [c]
        },
        jp = function(a, b, c, d, e) {
            var f = [];
            ij(a, function(g, h) {
                (g = ip(g, b, c, d, e)) && f.push(h + "=" + g)
            });
            return f.join(b)
        },
        ip = function(a, b, c, d, e) {
            if (a == null) return "";
            b = b || "&";
            c = c || ",$";
            typeof c === "string" && (c = c.split(""));
            if (a instanceof Array) {
                if (d || (d = 0), d < c.length) {
                    for (var f = [], g = 0; g < a.length; g++) f.push(ip(a[g], b, c, d + 1, e));
                    return f.join(c[d])
                }
            } else if (typeof a === "object") return e || (e = 0), e < 2 ? encodeURIComponent(jp(a,
                b, c, d, e + 1)) : "...";
            return encodeURIComponent(String(a))
        },
        kp = function(a, b, c) {
            a.g.push(b);
            a.j[b] = c
        },
        lp = function(a, b, c, d) {
            a.g.push(b);
            a.j[b] = hp(c, d)
        },
        np = function(a, b, c) {
            b = b + "//pagead2.googlesyndication.com" + c;
            var d = mp(a) - c.length;
            if (d < 0) return "";
            a.g.sort(function(p, n) {
                return p - n
            });
            c = null;
            for (var e = "", f = 0; f < a.g.length; f++)
                for (var g = a.g[f], h = a.j[g], k = 0; k < h.length; k++) {
                    if (!d) {
                        c = c == null ? g : c;
                        break
                    }
                    var l = jp(h[k], a.l, ",$");
                    if (l) {
                        l = e + l;
                        if (d >= l.length) {
                            d -= l.length;
                            b += l;
                            e = a.l;
                            break
                        }
                        c = c == null ? g : c
                    }
                }
            a = "";
            c != null &&
                (a = "" + e + "trn=" + c);
            return b + a
        },
        mp = function(a) {
            var b = 1,
                c;
            for (c in a.j) c.length > b && (b = c.length);
            return 3997 - b - a.l.length - 1
        };
    var op = function(a, b) {
            this.g = a;
            this.depth = b
        },
        qp = function() {
            var a = cp(),
                b = Math.max(a.length - 1, 0),
                c = fp(a);
            a = c.g;
            var d = c.j,
                e = c.l,
                f = [];
            c = function(h, k) {
                return h == null ? k : h
            };
            e && f.push(new op([e.url, e.Hd ? 2 : 0], c(e.depth, 1)));
            d && d != e && f.push(new op([d.url, 2], 0));
            a.url && a != e && f.push(new op([a.url, 0], c(a.depth, b)));
            var g = Vb(f, function(h, k) {
                return f.slice(0, f.length - k)
            });
            !a.url || (e || d) && a != e || (d = kj(a.url)) && g.push([new op([d, 1], c(a.depth, b))]);
            g.push([]);
            return Vb(g, function(h) {
                return pp(b, h)
            })
        };

    function pp(a, b) {
        var c = Wb(b, function(e, f) {
                return Math.max(e, f.depth)
            }, -1),
            d = kc(c + 2);
        d[0] = a;
        Sb(b, function(e) {
            return d[e.depth + 1] = e.g
        });
        return d
    }

    function rp() {
        var a = a === void 0 ? qp() : a;
        return a.map(function(b) {
            return ip(b)
        })
    };
    var sp = function() {
            this.j = new ap;
            this.g = Zo() ? new $o : new Yo
        },
        up = function() {
            tp();
            var a = O.document;
            return !!(a && a.body && a.body.getBoundingClientRect && typeof O.setInterval === "function" && typeof O.clearInterval === "function" && typeof O.setTimeout === "function" && typeof O.clearTimeout === "function")
        };
    sp.prototype.setInterval = function(a, b) {
        return O.setInterval(a, b)
    };
    sp.prototype.clearInterval = function(a) {
        O.clearInterval(a)
    };
    sp.prototype.setTimeout = function(a, b) {
        return O.setTimeout(a, b)
    };
    sp.prototype.clearTimeout = function(a) {
        O.clearTimeout(a)
    };
    var vp = function() {
        tp();
        return rp()
    };
    var wp = function() {},
        tp = function() {
            var a = J(wp);
            if (!a.g) {
                if (!O) throw Error("Context has not been set and window is undefined.");
                a.g = J(sp)
            }
            return a.g
        };
    var xp = function(a) {
        this.D = B(a)
    };
    w(xp, H);
    xp.prototype.g = Ih([0, sh, wh, -2, zh]);
    var yp = function(a) {
            this.l = a;
            this.g = -1;
            this.j = this.o = 0
        },
        zp = function(a, b) {
            return function() {
                var c = Ma.apply(0, arguments);
                if (a.g > -1) return b.apply(null, ra(c));
                try {
                    return a.g = a.l.g.now(), b.apply(null, ra(c))
                } finally {
                    a.o += a.l.g.now() - a.g, a.g = -1, a.j += 1
                }
            }
        };
    var Ap = function(a, b) {
        this.j = a;
        this.l = b;
        this.g = new yp(a)
    };
    var Bp = function() {
            this.g = {}
        },
        Dp = function() {
            var a = N().flags,
                b = Cp;
            a = a.g[b.key];
            if (b.valueType === "proto") {
                try {
                    var c = JSON.parse(a);
                    if (Array.isArray(c)) return c
                } catch (d) {}
                return b.defaultValue
            }
            return typeof a === typeof b.defaultValue ? a : b.defaultValue
        };
    var Ep = {
        Fi: 1,
        Wi: 2,
        Bi: 3
    };
    var Fp = function() {
        this.l = void 0;
        this.j = this.B = 0;
        this.A = -1;
        this.R = new wo;
        ro(xo(this.R, "mv", oo)).l = po === void 0 ? null : po;
        xo(this.R, "omid", lo);
        ro(xo(this.R, "epoh", lo));
        ro(xo(this.R, "epph", lo));
        ro(xo(this.R, "umt", lo)).l = mo === void 0 ? null : mo;
        ro(xo(this.R, "phel", lo));
        ro(xo(this.R, "phell", lo));
        ro(xo(this.R, "oseid", Ep));
        var a = this.R;
        a.g.sloi || (a.g.sloi = new uo);
        ro(a.g.sloi);
        xo(this.R, "mm", jo);
        ro(xo(this.R, "ovms", io));
        ro(xo(this.R, "xdi", lo));
        ro(xo(this.R, "amp", lo));
        ro(xo(this.R, "prf", lo));
        ro(xo(this.R, "gtx", lo));
        ro(xo(this.R, "mvp_lv", lo));
        ro(xo(this.R, "ssmol", lo)).l = no === void 0 ? null : no;
        ro(xo(this.R, "fmd", lo));
        xo(this.R, "gen204simple", lo);
        this.g = new Ap(tp(), this.R);
        this.o = !1;
        this.flags = new Bp
    };
    Fp.prototype.Td = function(a) {
        if (typeof a === "string" && a.length != 0) {
            var b = this.R;
            if (b.l) {
                a = a.split("&");
                for (var c = a.length - 1; c >= 0; c--) {
                    var d = a[c].split("="),
                        e = decodeURIComponent(d[0]);
                    d.length > 1 ? (d = decodeURIComponent(d[1]), d = /^[0-9]+$/g.exec(d) ? parseInt(d, 10) : d) : d = 1;
                    (e = b.g[e]) && e.j(d)
                }
            }
        }
    };
    var N = function() {
        return J(Fp)
    };
    var Gp = function(a, b, c, d, e) {
        if ((d ? a.l : Math.random()) < (e || a.g)) try {
            if (c instanceof gp) var f = c;
            else f = new gp, ij(c, function(h, k) {
                var l = f,
                    p = l.o++;
                kp(l, p, hp(k, h))
            });
            var g = np(f, a.j, "/pagead/gen_204?id=" + b + "&");
            g && (tp(), uj(O, g))
        } catch (h) {}
    };
    var Jp = function() {
        var a = Hp;
        this.B = Ip;
        this.A = "jserror";
        this.l = !0;
        this.j = null;
        this.C = this.Va;
        this.g = a === void 0 ? null : a;
        this.o = !1
    };
    m = Jp.prototype;
    m.de = function(a) {
        this.j = a
    };
    m.bf = function(a) {
        this.A = a
    };
    m.ee = function(a) {
        this.l = a
    };
    m.cf = function(a) {
        this.o = a
    };
    m.yb = function(a, b, c) {
        var d = this;
        return zp(N().g.g, function() {
            try {
                if (d.g && d.g.l) {
                    var e = d.g.start(a.toString(), 3);
                    var f = b();
                    d.g.end(e)
                } else f = b()
            } catch (h) {
                var g = d.l;
                try {
                    pl(e), g = d.C(a, new $p(aq(h)), void 0, c)
                } catch (k) {
                    d.Va(217, k)
                }
                if (!g) throw h;
            }
            return f
        })()
    };
    m.Ud = function(a, b, c, d) {
        var e = this;
        return zp(N().g.g, function() {
            var f = Ma.apply(0, arguments);
            return e.yb(a, function() {
                return b.apply(c, f)
            }, d)
        })
    };
    m.Va = function(a, b, c, d, e) {
        e = e || this.A;
        try {
            var f = new gp;
            lp(f, 1, "context", a);
            Nh(b) || (b = new $p(aq(b)));
            b.msg && lp(f, 2, "msg", b.msg.substring(0, 512));
            var g = b.meta || {};
            if (this.j) try {
                this.j(g)
            } catch (k) {}
            if (d) try {
                d(g)
            } catch (k) {}
            kp(f, 3, [g]);
            var h = fp();
            h.j && lp(f, 4, "top", h.j.url || "");
            kp(f, 5, [{
                url: h.g.url || ""
            }, {
                url: h.g.url ? Yi(h.g.url) : ""
            }]);
            Gp(this.B, e, f, this.o, c)
        } catch (k) {
            try {
                Gp(this.B, e, {
                    context: "ecmserr",
                    rctx: a,
                    msg: aq(k),
                    url: h && h.g.url
                }, this.o, c)
            } catch (l) {}
        }
        return this.l
    };
    var aq = function(a) {
            var b = a.toString();
            a.name && b.indexOf(a.name) == -1 && (b += ": " + a.name);
            a.message && b.indexOf(a.message) == -1 && (b += ": " + a.message);
            if (a.stack) a: {
                a = a.stack;
                var c = b;
                try {
                    a.indexOf(c) == -1 && (a = c + "\n" + a);
                    for (var d; a != d;) d = a, a = a.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/, "$1");
                    b = a.replace(/\n */g, "\n");
                    break a
                } catch (e) {
                    b = c;
                    break a
                }
                b = void 0
            }
            return b
        },
        $p = function(a) {
            Mh.call(this, Error(a), {
                message: a
            })
        };
    w($p, Mh);
    var Ip, bq, Hp = new ol(1, window),
        cq = function() {
            O && typeof O.google_measure_js_timing != "undefined" && (O.google_measure_js_timing || Hp.B())
        };
    Ip = new function() {
        var a = "https:";
        O && O.location && O.location.protocol === "http:" && (a = "http:");
        this.j = a;
        this.g = .01;
        this.l = Math.random()
    };
    bq = new Jp;
    O && O.document && (O.document.readyState == "complete" ? cq() : Hp.l && Vh(O, "load", function() {
        cq()
    }));
    var dq = function(a) {
            bq.de(function(b) {
                Sb(a, function(c) {
                    c(b)
                })
            })
        },
        eq = function(a, b) {
            return bq.yb(a, b)
        },
        fq = function(a, b, c, d) {
            return bq.Ud(a, b, c, d)
        },
        gq = function(a, b, c, d) {
            bq.Va(a, b, c, d)
        };
    var hq = Date.now(),
        iq = -1,
        jq = -1,
        kq, lq = -1,
        mq = !1,
        nq = function() {
            return Date.now() - hq
        },
        oq = function() {
            var a = N().l,
                b = jq >= 0 ? nq() - jq : -1,
                c = mq ? nq() - iq : -1,
                d = lq >= 0 ? nq() - lq : -1;
            if (a == 947190542) return 100;
            if (a == 79463069) return 200;
            a = [2E3, 4E3];
            var e = [250, 500, 1E3];
            gq(637, Error(), .001);
            var f = b;
            c != -1 && c < b && (f = c);
            for (b = 0; b < a.length; ++b)
                if (f < a[b]) {
                    var g = e[b];
                    break
                } g === void 0 && (g = e[a.length]);
            return d != -1 && d > 1500 && d < 4E3 ? 500 : g
        };
    var pq = function(a, b, c) {
        var d = new I(0, 0, 0, 0);
        this.time = a;
        this.volume = null;
        this.l = b;
        this.g = d;
        this.j = c
    };
    var qq = function(a, b, c, d, e, f, g) {
        this.l = a;
        this.j = b;
        this.A = c;
        this.g = d;
        this.o = e;
        this.C = f;
        this.B = g
    };
    qq.prototype.getTimestamp = function() {
        return this.C
    };
    var rq = {
            currentTime: 1,
            duration: 2,
            isVpaid: 4,
            volume: 8,
            isYouTube: 16,
            isPlaying: 32
        },
        pi = {
            te: "start",
            FIRST_QUARTILE: "firstquartile",
            MIDPOINT: "midpoint",
            THIRD_QUARTILE: "thirdquartile",
            COMPLETE: "complete",
            ERROR: "error",
            Ef: "metric",
            PAUSE: "pause",
            Nf: "resume",
            SKIPPED: "skip",
            VIEWABLE_IMPRESSION: "viewable_impression",
            Ff: "mute",
            Rf: "unmute",
            FULLSCREEN: "fullscreen",
            Bf: "exitfullscreen",
            wf: "bufferstart",
            vf: "bufferfinish",
            oe: "fully_viewable_audible_half_duration_impression",
            se: "measurable_impression",
            qf: "abandon",
            ne: "engagedview",
            IMPRESSION: "impression",
            yf: "creativeview",
            LOADED: "loaded",
            PROGRESS: "progress",
            Fh: "close",
            Gh: "collapse",
            Gf: "overlay_resize",
            Hf: "overlay_unmeasurable_impression",
            If: "overlay_unviewable_impression",
            Kf: "overlay_viewable_immediate_impression",
            Jf: "overlay_viewable_end_of_session_impression",
            zf: "custom_metric_viewable",
            sf: "audio_audible",
            uf: "audio_measurable",
            tf: "audio_impression"
        },
        sq = "start firstquartile midpoint thirdquartile resume loaded".split(" "),
        tq = ["start", "firstquartile", "midpoint", "thirdquartile"],
        uq = ["abandon"],
        vq = {
            UNKNOWN: -1,
            te: 0,
            FIRST_QUARTILE: 1,
            MIDPOINT: 2,
            THIRD_QUARTILE: 3,
            COMPLETE: 4,
            Ef: 5,
            PAUSE: 6,
            Nf: 7,
            SKIPPED: 8,
            VIEWABLE_IMPRESSION: 9,
            Ff: 10,
            Rf: 11,
            FULLSCREEN: 12,
            Bf: 13,
            oe: 14,
            se: 15,
            qf: 16,
            ne: 17,
            IMPRESSION: 18,
            yf: 19,
            LOADED: 20,
            zf: 21,
            wf: 22,
            vf: 23,
            tf: 27,
            uf: 28,
            sf: 29
        };
    var ii = {
            Bh: "addEventListener",
            Xh: "getMaxSize",
            Yh: "getScreenSize",
            Zh: "getState",
            ai: "getVersion",
            Hi: "removeEventListener",
            xi: "isViewable"
        },
        wq = function(a) {
            var b = a !== a.top,
                c = a.top === sj(a),
                d = -1,
                e = 0;
            if (b && c && a.top.mraid) {
                d = 3;
                var f = a.top.mraid
            } else d = (f = a.mraid) ? b ? c ? 2 : 1 : 0 : -1;
            f && (f.IS_GMA_SDK || (e = 2), hi(function(g) {
                return typeof f[g] === "function"
            }) || (e = 1));
            return {
                Fa: f,
                Dc: e,
                kh: d
            }
        };
    var xq = function() {
        var a = window.document;
        return a && typeof a.elementFromPoint === "function"
    };

    function yq(a, b, c) {
        try {
            a && (b = b.top);
            var d = b;
            a && d !== null && d != d.top && (d = d.top);
            try {
                var e = (c === void 0 ? 0 : c) ? (new Fk(d.innerWidth, d.innerHeight)).round() : No(d || window).round()
            } catch (p) {
                e = new Fk(-12245933, -12245933)
            }
            a = e;
            var f = a.height,
                g = a.width;
            if (g === -12245933) return new I(g, g, g, g);
            var h = Oo(Jo(b.document).g),
                k = h.x,
                l = h.y;
            return new I(l, k + g, l + f, k)
        } catch (p) {
            return new I(-12245933, -12245933, -12245933, -12245933)
        }
    };
    var Aq = function(a, b) {
            if (typeof b === "string")(b = zq(a, b)) && (a.style[b] = void 0);
            else
                for (var c in b) {
                    var d = a,
                        e = b[c],
                        f = zq(d, c);
                    f && (d.style[f] = e)
                }
        },
        Bq = {},
        zq = function(a, b) {
            var c = Bq[b];
            if (!c) {
                var d = Ti(b);
                c = d;
                a.style[d] === void 0 && (d = (tc ? "Webkit" : sc ? "Moz" : null) + Vi(d), a.style[d] !== void 0 && (c = d));
                Bq[b] = c
            }
            return c
        },
        Cq = function(a, b) {
            var c = a.style[Ti(b)];
            return typeof c !== "undefined" ? c : a.style[zq(a, b)] || ""
        },
        Dq = function(a, b) {
            var c = Io(a);
            return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a,
                null)) ? a[b] || a.getPropertyValue(b) || "" : ""
        },
        Eq = function(a) {
            try {
                return a.getBoundingClientRect()
            } catch (b) {
                return {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                }
            }
        },
        Fq = function(a) {
            var b = Io(a),
                c = new Bk(0, 0);
            if (a == (b ? Io(b) : document).documentElement) return c;
            a = Eq(a);
            b = Oo(Jo(b).g);
            c.x = a.left + b.x;
            c.y = a.top + b.y;
            return c
        },
        Gq = function(a, b) {
            var c = new Bk(0, 0),
                d = Po(Io(a));
            if (!mc(d, "parent")) return c;
            do {
                if (d == b) var e = Fq(a);
                else e = Eq(a), e = new Bk(e.left, e.top);
                c.x += e.x;
                c.y += e.y
            } while (d && d != b && d != d.parent && (a = d.frameElement) && (d = d.parent));
            return c
        },
        Hq = function() {
            var a = "100%";
            typeof a == "number" && (a = Math.round(a) + "px");
            return a
        },
        Jq = function(a) {
            var b = Iq,
                c;
            (c = Dq(a, "display")) || (c = a.currentStyle ? a.currentStyle.display : null);
            if ((c || a.style && a.style.display) != "none") return b(a);
            c = a.style;
            var d = c.display,
                e = c.visibility,
                f = c.position;
            c.visibility = "hidden";
            c.position = "absolute";
            c.display = "inline";
            a = b(a);
            c.display = d;
            c.position = f;
            c.visibility = e;
            return a
        },
        Iq = function(a) {
            var b = a.offsetWidth,
                c = a.offsetHeight,
                d = tc && !b && !c;
            return (b === void 0 || d) && a.getBoundingClientRect ?
                (a = Eq(a), new Fk(a.right - a.left, a.bottom - a.top)) : new Fk(b, c)
        },
        Kq = function(a) {
            var b = new Fk(a.offsetWidth, a.offsetHeight);
            var c = Dq(a, "paddingLeft");
            var d = Dq(a, "paddingRight"),
                e = Dq(a, "paddingTop"),
                f = Dq(a, "paddingBottom");
            c = new I(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c));
            d = Dq(a, "borderLeftWidth");
            e = Dq(a, "borderRightWidth");
            f = Dq(a, "borderTopWidth");
            a = Dq(a, "borderBottomWidth");
            a = new I(parseFloat(f), parseFloat(e), parseFloat(a), parseFloat(d));
            return new Fk(b.width - a.left - c.left - c.right - a.right,
                b.height - a.top - c.top - c.bottom - a.bottom)
        };
    var Lq = function(a, b) {
        b = Math.pow(10, b);
        return Math.floor(a * b) / b
    };

    function Mq(a, b, c, d) {
        if (!a) return {
            value: d,
            done: !1
        };
        d = b(d, a);
        var e = c(d, a);
        return !e && mc(a, "parentElement") ? Mq(a.parentElement || null, b, c, d) : {
            done: e,
            value: d
        }
    }
    var Nq = function(a, b, c, d) {
        if (!a) return d;
        d = Mq(a, b, c, d);
        if (!d.done) try {
            var e = Io(a),
                f = e && Po(e);
            return Nq(f && f.frameElement, b, c, d.value)
        } catch (g) {}
        return d.value
    };

    function Oq(a) {
        var b = !qc || Hc();
        return Nq(a, function(c, d) {
            c = mc(d, "style") && d.style && Cq(d, "visibility");
            return {
                hidden: c === "hidden",
                visible: b && c === "visible"
            }
        }, function(c) {
            return c.hidden || c.visible
        }, {
            hidden: !1,
            visible: !1
        }).hidden
    }
    var Pq = function(a) {
            return Nq(a, function(b, c) {
                return !(!mc(c, "style") || !c.style || Cq(c, "display") !== "none")
            }, function(b) {
                return b
            }, !1) ? !0 : Oq(a)
        },
        Qq = function(a) {
            return new I(a.top, a.right, a.bottom, a.left)
        },
        Rq = function(a) {
            var b = a.top || 0,
                c = a.left || 0;
            return new I(b, c + (a.width || 0), b + (a.height || 0), c)
        },
        Sq = function(a) {
            return a != null && a >= 0 && a <= 1
        };

    function Tq() {
        var a = Fb();
        return a ? Xb("AmazonWebAppPlatform;Android TV;Apple TV;AppleTV;BRAVIA;BeyondTV;Freebox;GoogleTV;HbbTV;LongTV;MiBOX;MiTV;NetCast.TV;Netcast;Opera TV;PANASONIC;POV_TV;SMART-TV;SMART_TV;SWTV;Smart TV;SmartTV;TV Store;UnionTV;WebOS".split(";"), function(b) {
            return Ab(a, b)
        }) || Ab(a, "OMI/") && !Ab(a, "XiaoMi/") ? !0 : Ab(a, "Presto") && Ab(a, "Linux") && !Ab(a, "X11") && !Ab(a, "Android") && !Ab(a, "Mobi") : !1
    }

    function Uq() {
        var a = Fb();
        return Ab(a, "AppleTV") || Ab(a, "Apple TV") || Ab(a, "CFNetwork") || Ab(a, "tvOS")
    }

    function Vq(a) {
        return (a = a.userAgentData) ? a.brands.some(function(b) {
            return b.brand.includes("kepler_webview")
        }) : Ab(Fb(), "Kepler")
    }

    function Wq() {
        var a;
        (a = Ab(Fb(), "CrKey") && !(Ab(Fb(), "CrKey") && Ab(Fb(), "SmartSpeaker")) || Ab(Fb(), "PlayStation") || Ab(Fb(), "Roku") || Tq() || Ab(Fb(), "Xbox") || Uq()) || (a = Fb(), a = Ab(a, "sdk_google_atv_x86") || Ab(a, "Android TV"));
        return a
    };
    var Yq = function() {
            this.l = !cj(O.top);
            this.C = Xh() || Yh();
            var a = cp();
            a = a.length > 0 && a[a.length - 1] != null && a[a.length - 1].url != null ? ((a = a[a.length - 1].url.match(Xi)[3] || null) ? decodeURI(a) : a) || "" : "";
            this.domain = a;
            this.g = new I(0, 0, 0, 0);
            this.A = new Fk(0, 0);
            this.o = new Fk(0, 0);
            this.J = new I(0, 0, 0, 0);
            this.frameOffset = new Bk(0, 0);
            this.B = 0;
            this.L = !1;
            this.j = !(!O || !wq(O).Fa);
            Xq(this)
        },
        Zq = function(a, b) {
            b && b.screen && (a.A = new Fk(b.screen.width, b.screen.height))
        },
        $q = function(a, b) {
            a: {
                var c = a.g ? new Fk(a.g.getWidth(), a.g.getHeight()) : new Fk(0, 0);b = b === void 0 ? O : b;b !== null && b != b.top && (b = b.top);
                var d = 0,
                    e = 0;
                try {
                    var f = b.document,
                        g = f.body,
                        h = f.documentElement;
                    if (f.compatMode == "CSS1Compat" && h.scrollHeight) d = h.scrollHeight != c.height ? h.scrollHeight : h.offsetHeight, e = h.scrollWidth != c.width ? h.scrollWidth : h.offsetWidth;
                    else {
                        var k = h.scrollHeight,
                            l = h.scrollWidth,
                            p = h.offsetHeight,
                            n = h.offsetWidth;
                        h.clientHeight != p && (k = g.scrollHeight, l = g.scrollWidth, p = g.offsetHeight, n = g.offsetWidth);
                        k > c.height ? k > p ? (d = k, e = l) : (d = p, e = n) : k < p ? (d = k, e = l) : (d = p, e = n)
                    }
                    var q =
                        new Fk(e, d);
                    break a
                } catch (t) {
                    q = new Fk(-12245933, -12245933);
                    break a
                }
                q = void 0
            }
            a.o = q
        },
        Xq = function(a) {
            O && O.document && (a.J = yq(!1, O, a.C), a.g = yq(!0, O, a.C), $q(a, O), Zq(a, O))
        },
        br = function() {
            var a = ar();
            if (a.B > 0 || a.L) return !0;
            a = tp().j.isVisible();
            var b = Uk(Fo) === 0;
            return a || b
        },
        ar = function() {
            return J(Yq)
        };
    var cr = function(a) {
        this.l = a;
        this.j = 0;
        this.g = null
    };
    cr.prototype.cancel = function() {
        tp().clearTimeout(this.g);
        this.g = null
    };
    var dr = function(a) {
        var b = tp(),
            c = N().g.g;
        a.g = b.setTimeout(zp(c, fq(143, function() {
            a.j++;
            a.l.sample()
        })), oq())
    };
    var er = function(a, b, c) {
        this.l = a;
        this.ka = c === void 0 ? "na" : c;
        this.A = [];
        this.ua = !1;
        this.o = new pq(-1, !0, this);
        this.g = this;
        this.L = b;
        this.H = this.F = !1;
        this.Z = "uk";
        this.P = !1;
        this.C = !0
    };
    er.prototype.G = function() {
        return !1
    };
    er.prototype.initialize = function() {
        return this.ua = !0
    };
    er.prototype.Eb = function() {
        return this.g.Z
    };
    er.prototype.Xb = function() {
        return this.g.H
    };
    var gr = function(a, b, c) {
        if (!a.H || (c === void 0 ? 0 : c)) a.H = !0, a.Z = b, a.L = 0, a.g != a || fr(a)
    };
    er.prototype.getName = function() {
        return this.g.ka
    };
    er.prototype.gb = function() {
        return this.g.aa()
    };
    er.prototype.aa = function() {
        return {}
    };
    er.prototype.Ra = function() {
        return this.g.L
    };
    var hr = function(a, b) {
        bc(a.A, b) || (a.A.push(b), b.Gb(a.g), b.jb(a.o), b.Oa() && (a.F = !0))
    };
    er.prototype.U = function() {
        var a = ar();
        a.g = yq(!0, this.l, a.C)
    };
    er.prototype.V = function() {
        Zq(ar(), this.l)
    };
    er.prototype.ba = function() {
        return this.o.g
    };
    var ir = function(a) {
        a = a.g;
        a.V();
        a.U();
        var b = ar();
        b.J = yq(!1, a.l, b.C);
        $q(ar(), a.l);
        a.o.g = a.ba()
    };
    er.prototype.sample = function() {};
    er.prototype.isActive = function() {
        return this.g.C
    };
    var jr = function(a) {
            a.F = a.A.length ? Xb(a.A, function(b) {
                return b.Oa()
            }) : !1
        },
        kr = function(a) {
            var b = gc(a.A);
            Sb(b, function(c) {
                c.jb(a.o)
            })
        },
        fr = function(a) {
            var b = gc(a.A);
            Sb(b, function(c) {
                c.Gb(a.g)
            });
            a.g != a || kr(a)
        };
    m = er.prototype;
    m.Gb = function(a) {
        var b = this.g;
        this.g = a.Ra() >= this.L ? a : this;
        b !== this.g ? (this.C = this.g.C, fr(this)) : this.C !== this.g.C && (this.C = this.g.C, fr(this))
    };
    m.jb = function(a) {
        if (a.j === this.g) {
            var b = this.o,
                c = this.F;
            b = !(a && (c === void 0 || !c || b.volume == a.volume) && b.l == a.l && Dk(b.g, a.g));
            this.o = a;
            b && kr(this)
        }
    };
    m.Oa = function() {
        return this.F
    };
    m.dispose = function() {
        this.P = !0
    };
    m.Ea = function() {
        return this.P
    };
    var lr = function(a, b, c, d) {
        this.l = a;
        this.g = new I(0, 0, 0, 0);
        this.o = null;
        this.C = new I(0, 0, 0, 0);
        this.j = b;
        this.R = c;
        this.P = d;
        this.M = !1;
        this.timestamp = -1;
        this.G = new qq(b.o, this.g, new I(0, 0, 0, 0), 0, 0, nq(), 0);
        this.B = void 0
    };
    lr.prototype.nd = function() {
        return !0
    };
    lr.prototype.F = function() {};
    lr.prototype.dispose = function() {
        if (!this.Ea()) {
            var a = this.j;
            cc(a.A, this);
            a.F && this.Oa() && jr(a);
            this.F();
            this.M = !0
        }
    };
    lr.prototype.Ea = function() {
        return this.M
    };
    var mr = function(a, b) {
        return a.B ? new I(Math.max(b.top + a.B.top, b.top), Math.min(b.left + a.B.right, b.right), Math.min(b.top + a.B.bottom, b.bottom), Math.max(b.left + a.B.left, b.left)) : Ck(b)
    };
    m = lr.prototype;
    m.gb = function() {
        return this.j.gb()
    };
    m.Ra = function() {
        return this.j.Ra()
    };
    m.Eb = function() {
        return this.j.Eb()
    };
    m.Xb = function() {
        return this.j.Xb()
    };
    m.Gb = function() {};
    m.jb = function() {
        this.bb()
    };
    m.Oa = function() {
        return this.P
    };
    var nr = function(a) {
        this.A = !1;
        this.g = a;
        this.o = function() {}
    };
    m = nr.prototype;
    m.Ra = function() {
        return this.g.Ra()
    };
    m.Eb = function() {
        return this.g.Eb()
    };
    m.Xb = function() {
        return this.g.Xb()
    };
    m.create = function(a, b, c) {
        var d = null;
        this.g && (d = this.rc(a, b, c), hr(this.g, d));
        return d
    };
    m.pe = function() {
        return this.Nb()
    };
    m.Nb = function() {
        return !1
    };
    m.init = function(a) {
        return this.g.initialize() ? (hr(this.g, this), this.o = a, !0) : !1
    };
    m.Gb = function(a) {
        a.Ra() == 0 && this.o(a.Eb(), this)
    };
    m.jb = function() {};
    m.Oa = function() {
        return !1
    };
    m.dispose = function() {
        this.A = !0
    };
    m.Ea = function() {
        return this.A
    };
    m.gb = function() {
        return {}
    };
    var or = function(a, b, c) {
            this.l = c === void 0 ? 0 : c;
            this.j = a;
            this.g = b == null ? "" : b
        },
        pr = function(a) {
            switch (Math.trunc(a.l)) {
                case -16:
                    return -16;
                case -8:
                    return -8;
                case 0:
                    return 0;
                case 8:
                    return 8;
                case 16:
                    return 16;
                default:
                    return 16
            }
        },
        qr = function(a, b) {
            return a.l < b.l ? !0 : a.l > b.l ? !1 : a.j < b.j ? !0 : a.j > b.j ? !1 : typeof a.g < typeof b.g ? !0 : typeof a.g > typeof b.g ? !1 : a.g < b.g
        };
    var rr = function() {
        this.l = 0;
        this.g = [];
        this.j = !1
    };
    rr.prototype.add = function(a, b, c) {
        ++this.l;
        a = new or(a, b, c);
        this.g.push(new or(a.j, a.g, a.l + this.l / 4096));
        this.j = !0;
        return this
    };
    var sr = function(a, b) {
            Sb(b.g, function(c) {
                a.add(c.j, c.g, pr(c))
            })
        },
        tr = function(a, b) {
            var c = c === void 0 ? 0 : c;
            var d = d === void 0 ? !0 : d;
            ij(b, function(e, f) {
                d && e === void 0 || a.add(f, e, c)
            });
            return a
        },
        vr = function(a) {
            var b = ur;
            a.j && (ic(a.g, function(c, d) {
                return qr(d, c) ? 1 : qr(c, d) ? -1 : 0
            }), a.j = !1);
            return Wb(a.g, function(c, d) {
                d = b(d);
                return "" + c + (c != "" && d != "" ? "&" : "") + d
            }, "")
        };
    var ur = function(a) {
        var b = a.j;
        a = a.g;
        return a === "" ? b : typeof a === "boolean" ? a ? b : "" : Array.isArray(a) ? a.length === 0 ? b : b + "=" + a.join() : b + "=" + (bc(["mtos", "tos", "p"], b) ? a : encodeURIComponent(a))
    };
    var wr = function(a) {
        var b = b === void 0 ? !0 : b;
        this.g = new rr;
        a !== void 0 && sr(this.g, a);
        b && this.g.add("v", "unreleased", -16)
    };
    wr.prototype.toString = function() {
        var a = "//pagead2.googlesyndication.com//pagead/gen_204",
            b = vr(this.g);
        b.length > 0 && (a += "?" + b);
        return a
    };
    var xr = function(a) {
            var b = [],
                c = [];
            Zh(a, function(d, e) {
                if (!(e in Object.prototype) && typeof d != "undefined") switch (Array.isArray(d) && (d = d.join(",")), d = [e, "=", d].join(""), e) {
                    case "adk":
                    case "r":
                    case "tt":
                    case "error":
                    case "mtos":
                    case "tos":
                    case "p":
                    case "bs":
                        b.unshift(d);
                        break;
                    case "req":
                    case "url":
                    case "referrer":
                    case "iframe_loc":
                        c.push(d);
                        break;
                    default:
                        b.push(d)
                }
            });
            return b.concat(c)
        },
        yr = function(a) {
            a = a.toString();
            tp();
            uj(O, a)
        };
    var zr = function() {
        this.g = 0
    };

    function Ar(a) {
        a && typeof a.dispose == "function" && a.dispose()
    };
    var P = function() {
        this.L = this.L;
        this.J = this.J
    };
    P.prototype.L = !1;
    P.prototype.Ea = function() {
        return this.L
    };
    P.prototype.dispose = function() {
        this.L || (this.L = !0, this.O())
    };
    P.prototype[Symbol.dispose] = function() {
        this.dispose()
    };
    var Cr = function(a, b) {
            Br(a, fb(Ar, b))
        },
        Br = function(a, b) {
            a.L ? b() : (a.J || (a.J = []), a.J.push(b))
        };
    P.prototype.O = function() {
        if (this.J)
            for (; this.J.length;) this.J.shift()()
    };
    var Dr = function(a, b, c) {
        Sb(a.l, function(d) {
            var e = a.g;
            if (!d.g && (d.l(b, c), d.o())) {
                d.g = !0;
                var f = d.j(),
                    g = new rr;
                g.add("id", "av-js");
                g.add("type", "verif");
                g.add("vtype", d.A);
                d = J(zr);
                g.add("i", d.g++);
                g.add("adk", e);
                tr(g, f);
                e = new wr(g);
                yr(e)
            }
        })
    };
    var Er = function() {
            this.j = this.l = this.o = this.g = 0
        },
        Fr = function(a, b, c, d) {
            b && (a.g += c, a.j += c, a.o += c, a.l = Math.max(a.l, a.o));
            if (d === void 0 ? !b : d) a.o = 0
        };
    var Gr = [1, .75, .5, .3, 0],
        Hr = function(a) {
            this.j = a = a === void 0 ? Gr : a;
            this.g = Vb(this.j, function() {
                return new Er
            })
        },
        Jr = function(a, b) {
            return Ir(a, function(c) {
                return c.g
            }, b === void 0 ? !0 : b)
        },
        Lr = function(a, b) {
            return Kr(a, b, function(c) {
                return c.g
            })
        },
        Mr = function(a, b) {
            return Ir(a, function(c) {
                return c.l
            }, b === void 0 ? !0 : b)
        },
        Nr = function(a, b) {
            return Kr(a, b, function(c) {
                return c.l
            })
        },
        Or = function(a, b) {
            return Kr(a, b, function(c) {
                return c.j
            })
        },
        Pr = function(a) {
            Sb(a.g, function(b) {
                b.j = 0
            })
        },
        Qr = function(a, b, c, d, e, f, g) {
            g = g === void 0 ?
                !0 : g;
            c = f ? Math.min(b, c) : c;
            for (f = 0; f < a.j.length; f++) {
                var h = a.j[f],
                    k = c > 0 && c >= h;
                h = !(b > 0 && b >= h) || d;
                Fr(a.g[f], g && k, e, !g || h)
            }
        },
        Ir = function(a, b, c) {
            a = Vb(a.g, function(d) {
                return b(d)
            });
            return c ? a : Rr(a)
        },
        Kr = function(a, b, c) {
            var d = ac(a.j, function(e) {
                return b <= e
            });
            return d == -1 ? 0 : c(a.g[d])
        },
        Rr = function(a) {
            return Vb(a, function(b, c, d) {
                return c > 0 ? d[c] - d[c - 1] : d[c]
            })
        };
    var Sr = function() {
            this.j = new Hr;
            this.Z = this.V = 0;
            this.ba = new Er;
            this.H = this.C = -1;
            this.ka = 1E3;
            this.va = new Hr([1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0]);
            this.P = this.K = -1
        },
        Tr = function(a, b) {
            return Mr(a.j, b === void 0 ? !0 : b)
        };
    Sr.prototype.L = function(a, b, c, d) {
        this.C = this.C != -1 ? Math.min(this.C, b.X) : b.X;
        this.H = Math.max(this.H, b.X);
        this.K = this.K != -1 ? Math.min(this.K, b.sa) : b.sa;
        this.P = Math.max(this.P, b.sa);
        Qr(this.va, b.sa, c.sa, b.g, a, d);
        this.V += a;
        b.X === 0 && (this.Z += a);
        Qr(this.j, b.X, c.X, b.g, a, d);
        c = d || c.wb != b.wb ? c.isVisible() && b.isVisible() : c.isVisible();
        b = !b.isVisible() || b.g;
        Fr(this.ba, c, a, b)
    };
    Sr.prototype.Ua = function() {
        return this.ba.l >= this.ka
    };
    if (Fo && Fo.URL) {
        var Ur = Fo.URL,
            Vr;
        if (Vr = !!Ur) {
            var Wr;
            a: {
                if (Ur) {
                    var Xr = RegExp(".*[&#?]google_debug(=[^&]*)?(&.*)?$");
                    try {
                        var Yr = Xr.exec(decodeURIComponent(Ur));
                        if (Yr) {
                            Wr = Yr[1] && Yr[1].length > 1 ? Yr[1].substring(1) : "true";
                            break a
                        }
                    } catch (a) {}
                }
                Wr = ""
            }
            Vr = Wr.length > 0
        }
        bq.ee(!Vr)
    }
    var Zr = function(a, b, c, d) {
        var e = e === void 0 ? !1 : e;
        c = fq(d, c);
        Vh(a, b, c, {
            capture: e
        })
    };
    var $r = new I(0, 0, 0, 0);

    function as(a, b) {
        b = bs(b);
        return b === 0 ? 0 : bs(a) / b
    }

    function bs(a) {
        return Math.max(a.bottom - a.top, 0) * Math.max(a.right - a.left, 0)
    }

    function cs(a, b) {
        if (!a || !b) return !1;
        for (var c = 0; a !== null && c++ < 100;) {
            if (a === b) return !0;
            try {
                if (a = a.parentElement || a) {
                    var d = Io(a),
                        e = d && Po(d),
                        f = e && e.frameElement;
                    f && (a = f)
                }
            } catch (g) {
                break
            }
        }
        return !1
    }

    function ds(a, b, c) {
        if (!a || !b) return !1;
        b = Ek(Ck(a), -b.left, -b.top);
        a = (b.left + b.right) / 2;
        b = (b.top + b.bottom) / 2;
        cj(window.top) && window.top && window.top.document && (window = window.top);
        if (!xq()) return !1;
        a = window.document.elementFromPoint(a, b);
        if (!a) return !1;
        b = (b = (b = Io(c)) && b.defaultView && b.defaultView.frameElement) && cs(b, a);
        var d = a === c;
        a = !d && a && Wo(a, function(e) {
            return e === c
        });
        return !(b || d || a)
    }

    function es(a, b, c, d) {
        return ar().l ? !1 : a.getWidth() <= 0 || a.getHeight() <= 0 ? !0 : c && d ? eq(208, function() {
            return ds(a, b, c)
        }) : !1
    };
    var fs = new I(0, 0, 0, 0),
        hs = function(a, b, c) {
            P.call(this);
            this.position = Ck(fs);
            this.Uc = this.Ic();
            this.Id = -2;
            this.ph = Date.now();
            this.kf = -1;
            this.Lc = b;
            this.Kc = null;
            this.Tb = !1;
            this.Zc = null;
            this.opacity = -1;
            this.bh = c;
            this.qh = !1;
            this.Ld = function() {};
            this.mf = function() {};
            this.ta = new Xo;
            this.ta.nb = a;
            this.ta.g = a;
            this.Sa = !1;
            this.tb = {
                Od: null,
                Nd: null
            };
            this.df = !0;
            this.qc = null;
            this.Hb = this.Lg = !1;
            N().B++;
            this.qa = this.Dd();
            this.jf = -1;
            this.W = null;
            this.Je = this.Hg = !1;
            this.R = new wo;
            Eo(this.R);
            gs(this);
            this.bh == 1 ? zo(this.R,
                "od", 1) : zo(this.R, "od", 0)
        };
    w(hs, P);
    hs.prototype.O = function() {
        this.ta.g && (this.tb.Od && (Wh(this.ta.g, "mouseover", this.tb.Od), this.tb.Od = null), this.tb.Nd && (Wh(this.ta.g, "mouseout", this.tb.Nd), this.tb.Nd = null));
        this.qc && this.qc.dispose();
        this.W && this.W.dispose();
        delete this.Uc;
        delete this.Ld;
        delete this.mf;
        delete this.ta.nb;
        delete this.ta.g;
        delete this.tb;
        delete this.qc;
        delete this.W;
        delete this.R;
        P.prototype.O.call(this)
    };
    hs.prototype.ib = function() {
        return this.W ? this.W.g : this.position
    };
    hs.prototype.Td = function(a) {
        N().Td(a)
    };
    var gs = function(a) {
        a = a.ta.nb;
        var b;
        if (b = a && a.getAttribute) b = /-[a-z]/.test("googleAvInapp") ? !1 : Go && a.dataset ? "googleAvInapp" in a.dataset : a.hasAttribute ? a.hasAttribute("data-" + Ui()) : !!a.getAttribute("data-" + Ui());
        b && (ar().j = !0)
    };
    hs.prototype.Oa = function() {
        return !1
    };
    hs.prototype.Ic = function() {
        return new Sr
    };
    hs.prototype.pa = function() {
        return this.Uc
    };
    var is = function(a, b) {
            b != a.Hb && (a.Hb = b, a = ar(), b ? a.B++ : a.B > 0 && a.B--)
        },
        js = function(a, b) {
            if (a.W) {
                if (b.getName() === a.W.getName()) return;
                a.W.dispose();
                a.W = null
            }
            b = b.create(a.ta.g, a.R, a.Oa());
            if (b = b != null && b.nd() ? b : null) a.W = b
        },
        ks = function(a, b, c) {
            if (!a.Kc || a.Lc == -1 || b.getTimestamp() === -1 || a.Kc.getTimestamp() === -1) return 0;
            a = b.getTimestamp() - a.Kc.getTimestamp();
            return a > c ? 0 : a
        };
    hs.prototype.Ge = function(a) {
        return ks(this, a, 1E4)
    };
    var ls = function(a, b, c) {
            if (a.W) {
                a.W.bb();
                var d = a.W.G,
                    e = d.l,
                    f = e.g;
                if (d.A != null) {
                    var g = d.j;
                    a.Zc = new Bk(g.left - f.left, g.top - f.top)
                }
                f = a.hd() ? Math.max(d.g, d.o) : d.g;
                g = {};
                e.volume !== null && (g.volume = e.volume);
                e = a.Ge(d);
                a.Kc = d;
                a.he(f, b, c, !1, g, e, d.B)
            }
        },
        ms = function(a) {
            if (a.Tb && a.qc) {
                var b = Ao(a.R, "od") == 1,
                    c = ar().g,
                    d = a.qc,
                    e = a.W ? a.W.getName() : "ns",
                    f = a.Zc,
                    g = new Fk(c.getWidth(), c.getHeight());
                c = a.hd();
                a = {
                    mh: e,
                    Zc: f,
                    Ah: g,
                    hd: c,
                    X: a.qa.X,
                    vh: b
                };
                if (b = d.j) {
                    b.bb();
                    e = b.G;
                    f = e.l.g;
                    var h = g = null;
                    e.A != null && f && (g = e.j, g = new Bk(g.left -
                        f.left, g.top - f.top), h = new Fk(f.right - f.left, f.bottom - f.top));
                    e = c ? Math.max(e.g, e.o) : e.g;
                    c = {
                        mh: b.getName(),
                        Zc: g,
                        Ah: h,
                        hd: c,
                        vh: !1,
                        X: e
                    }
                } else c = null;
                c && Dr(d, a, c)
            }
        };
    m = hs.prototype;
    m.he = function(a, b, c, d, e, f, g) {
        this.Sa || (this.Tb && (a = this.od(a, c, e, g), d = d && this.qa.X >= (this.wb() ? .3 : .5), this.ie(f, a, d), this.Lc = b, a.X > 0 && -1 === this.jf && (this.jf = b), this.kf == -1 && this.Ua() && (this.kf = b), this.Id == -2 && (this.Id = bs(this.ib()) ? a.X : -1), this.qa = a), this.Ld(this))
    };
    m.ie = function(a, b, c) {
        this.pa().L(a, b, this.qa, c)
    };
    m.Dd = function() {
        return new ko
    };
    m.od = function(a, b, c, d) {
        c = this.Dd();
        c.g = b;
        b = tp().j;
        b = Uk(Fo) === 0 ? -1 : b.isVisible() ? 0 : 1;
        c.j = b;
        c.X = this.td(a);
        c.wb = this.wb();
        c.sa = d;
        return c
    };
    m.td = function(a) {
        return this.opacity === 0 && Ao(this.R, "opac") === 1 ? 0 : a
    };
    m.wb = function() {
        return !1
    };
    m.hd = function() {
        return this.Hg || this.Lg
    };
    m.za = function() {
        return 0
    };
    m.Ua = function() {
        return this.Uc.Ua()
    };
    m.Ie = function() {
        var a = this.Tb;
        a = (this.Je || this.Ea()) && !a;
        var b = N().j !== 2 || this.qh;
        return this.Sa || b && a ? 2 : this.Ua() ? 4 : 3
    };
    m.Gc = function() {
        return 0
    };
    var ns = function(a, b, c) {
        b && (a.Ld = b);
        c && (a.mf = c)
    };
    var os = function() {};
    os.prototype.next = function() {
        return ps
    };
    var ps = {
        done: !0,
        value: void 0
    };
    os.prototype.Bb = function() {
        return this
    };
    var qs = function() {
            this.o = this.g = this.l = this.j = this.A = 0
        },
        rs = function(a) {
            var b = {};
            b = (b.ptlt = Date.now() - a.A, b);
            var c = a.j;
            c && (b.pnk = c);
            (c = a.l) && (b.pnc = c);
            (c = a.o) && (b.pnmm = c);
            (a = a.g) && (b.pns = a);
            return b
        };
    var ts = function() {
        ko.call(this);
        this.fullscreen = !1;
        this.volume = void 0;
        this.l = !1;
        this.mediaTime = -1
    };
    w(ts, ko);
    var us = function(a) {
        return Sq(a.volume) && a.volume > 0
    };
    var ws = function(a, b, c, d) {
            c = c === void 0 ? !0 : c;
            d = d === void 0 ? function() {
                return !0
            } : d;
            return function(e) {
                var f = e[a];
                if (Array.isArray(f) && d(e)) return vs(f, b, c)
            }
        },
        xs = function(a, b) {
            return function(c) {
                return b(c) ? c[a] : void 0
            }
        },
        ys = function(a) {
            return function(b) {
                for (var c = 0; c < a.length; c++)
                    if (a[c] === b.e || a[c] === void 0 && !b.hasOwnProperty("e")) return !0;
                return !1
            }
        },
        vs = function(a, b, c) {
            return c === void 0 || c ? Ub(a, function(d, e) {
                return bc(b, e)
            }) : Vb(b, function(d, e, f) {
                return a.slice(e > 0 ? f[e - 1] + 1 : 0, d + 1).reduce(function(g, h) {
                    return g +
                        h
                }, 0)
            })
        };
    var zs = ys([void 0, 1, 2, 3, 4, 8, 16]),
        As = ys([void 0, 4, 8, 16]),
        Bs = {
            sv: "sv",
            v: "v",
            cb: "cb",
            e: "e",
            nas: "nas",
            msg: "msg",
            "if": "if",
            sdk: "sdk",
            p: "p",
            p0: xs("p0", As),
            p1: xs("p1", As),
            p2: xs("p2", As),
            p3: xs("p3", As),
            cp: "cp",
            tos: "tos",
            mtos: "mtos",
            amtos: "amtos",
            mtos1: ws("mtos1", [0, 2, 4], !1, As),
            mtos2: ws("mtos2", [0, 2, 4], !1, As),
            mtos3: ws("mtos3", [0, 2, 4], !1, As),
            mcvt: "mcvt",
            ps: "ps",
            scs: "scs",
            bs: "bs",
            vht: "vht",
            mut: "mut",
            a: "a",
            a0: xs("a0", As),
            a1: xs("a1", As),
            a2: xs("a2", As),
            a3: xs("a3", As),
            ft: "ft",
            dft: "dft",
            at: "at",
            dat: "dat",
            as: "as",
            vpt: "vpt",
            gmm: "gmm",
            std: "std",
            efpf: "efpf",
            swf: "swf",
            nio: "nio",
            px: "px",
            nnut: "nnut",
            vmer: "vmer",
            vmmk: "vmmk",
            vmiec: "vmiec",
            nmt: "nmt",
            tcm: "tcm",
            bt: "bt",
            pst: "pst",
            vpaid: "vpaid",
            dur: "dur",
            vmtime: "vmtime",
            dtos: "dtos",
            dtoss: "dtoss",
            dvs: "dvs",
            dfvs: "dfvs",
            dvpt: "dvpt",
            fmf: "fmf",
            vds: "vds",
            is: "is",
            i0: "i0",
            i1: "i1",
            i2: "i2",
            i3: "i3",
            ic: "ic",
            cs: "cs",
            c: "c",
            c0: xs("c0", As),
            c1: xs("c1", As),
            c2: xs("c2", As),
            c3: xs("c3", As),
            mc: "mc",
            nc: "nc",
            mv: "mv",
            nv: "nv",
            qmt: xs("qmtos", zs),
            qnc: xs("qnc", zs),
            qmv: xs("qmv", zs),
            qnv: xs("qnv", zs),
            raf: "raf",
            rafc: "rafc",
            lte: "lte",
            ces: "ces",
            tth: "tth",
            femt: "femt",
            femvt: "femvt",
            emc: "emc",
            emuc: "emuc",
            emb: "emb",
            avms: "avms",
            nvat: "nvat",
            qi: "qi",
            psm: "psm",
            psv: "psv",
            psfv: "psfv",
            psa: "psa",
            pnk: "pnk",
            pnc: "pnc",
            pnmm: "pnmm",
            pns: "pns",
            ptlt: "ptlt",
            pngs: "pings",
            veid: "veid",
            ssb: "ssb",
            ss0: xs("ss0", As),
            ss1: xs("ss1", As),
            ss2: xs("ss2", As),
            ss3: xs("ss3", As),
            dc_rfl: "urlsigs",
            obd: "obd",
            omidp: "omidp",
            omidr: "omidr",
            omidv: "omidv",
            omida: "omida",
            omids: "omids",
            omidpv: "omidpv",
            omidam: "omidam",
            omidct: "omidct",
            omidia: "omidia",
            omiddc: "omiddc",
            omidlat: "omidlat",
            omiddit: "omiddit",
            nopd: "nopd",
            co: "co",
            tm: "tm",
            tu: "tu"
        },
        Cs = Object.assign({}, Bs, {
            avid: function(a) {
                return function() {
                    return a
                }
            }("audio"),
            avas: "avas",
            vs: "vs"
        }),
        Ds = {
            atos: "atos",
            avt: ws("atos", [2]),
            davs: "davs",
            dafvs: "dafvs",
            dav: "dav",
            ss: function(a, b) {
                return function(c) {
                    return c[a] === void 0 && b !== void 0 ? b : c[a]
                }
            }("ss", 0),
            t: "t"
        };
    var Es = function() {
        this.j = this.g = ""
    };
    var Fs = function() {},
        Gs = function(a, b) {
            var c = {};
            if (a !== void 0)
                if (b != null)
                    for (var d in b) {
                        var e = b[d];
                        d in Object.prototype || e != null && (c[d] = typeof e === "function" ? e(a) : a[e])
                    } else ui(c, a);
            return vr(tr(new rr, c))
        };
    var Hs = function() {
        var a = {};
        this.j = (a.vs = [1, 0], a.vw = [0, 1], a.am = [2, 2], a.a = [4, 4], a.f = [8, 8], a.bm = [16, 16], a.b = [32, 32], a.avw = [0, 64], a.avs = [64, 0], a.pv = [256, 256], a.gdr = [0, 512], a.p = [0, 1024], a.r = [0, 2048], a.m = [0, 4096], a.um = [0, 8192], a.ef = [0, 16384], a.s = [0, 32768], a.pmx = [0, 16777216], a.mut = [33554432, 33554432], a.umutb = [67108864, 67108864], a.tvoff = [134217728, 134217728], a);
        this.g = {};
        for (var b in this.j) this.j[b][1] > 0 && (this.g[b] = 0);
        this.l = 0
    };
    Hs.prototype.reportEvent = function(a) {
        var b = this.j[a],
            c = b[1];
        this.l += b[0];
        c > 0 && this.g[a] == 0 && (this.g[a] = 1)
    };
    var Is = function(a) {
            var b = ki(a.j),
                c = 0,
                d;
            for (d in a.g) bc(b, d) && a.g[d] == 1 && (c += a.j[d][1], a.g[d] = 2);
            return c
        },
        Js = function(a) {
            var b = 0,
                c;
            for (c in a.g) {
                var d = a.g[c];
                if (d == 1 || d == 2) b += a.j[c][1]
            }
            return b
        };
    var Ks = function() {
        this.g = this.j = 0
    };
    Ks.prototype.getValue = function() {
        return this.j
    };
    var Ls = function(a, b, c) {
        b >= 32 || (a.g & 1 << b && !c ? a.j &= ~(1 << b) : a.g & 1 << b || !c || (a.j |= 1 << b), a.g |= 1 << b)
    };
    var Ms = function() {
        Sr.call(this);
        this.l = new Er;
        this.aa = this.F = this.M = 0;
        this.J = -1;
        this.wa = new Er;
        this.A = new Er;
        this.g = new Hr;
        this.B = this.o = -1;
        this.G = new Er;
        this.ka = 2E3;
        this.U = new Ks;
        this.ga = new Ks;
        this.da = new Ks
    };
    w(Ms, Sr);
    var Ns = function(a, b, c) {
        var d = a.aa;
        mq || c || a.J == -1 || (d += b - a.J);
        return d
    };
    Ms.prototype.L = function(a, b, c, d) {
        if (!b.l) {
            Sr.prototype.L.call(this, a, b, c, d);
            var e = us(b) && us(c),
                f = (d ? Math.min(b.X, c.X) : c.X) >= .5;
            Sq(b.volume) && (this.o = this.o != -1 ? Math.min(this.o, b.volume) : b.volume, this.B = Math.max(this.B, b.volume));
            f && (this.M += a, this.F += e ? a : 0);
            Qr(this.g, b.X, c.X, b.g, a, d, e);
            Fr(this.l, !0, a);
            Fr(this.A, e, a);
            Fr(this.G, c.fullscreen, a);
            Fr(this.wa, e && !f, a);
            a = Math.floor(b.mediaTime / 1E3);
            Ls(this.U, a, b.isVisible());
            Ls(this.ga, a, b.X >= 1);
            Ls(this.da, a, us(b))
        }
    };
    var Os = function() {
        this.l = !1
    };
    Os.prototype.j = function(a) {
        this.l || (this.g(a) ? (a = this.L.report(this.o, a), this.A |= a, a = a == 0) : a = !1, this.l = a)
    };
    var Ps = function(a, b) {
        this.l = !1;
        this.o = a;
        this.L = b;
        this.A = 0
    };
    w(Ps, Os);
    Ps.prototype.g = function() {
        return !0
    };
    Ps.prototype.B = function() {
        return !1
    };
    Ps.prototype.getId = function() {
        var a = this,
            b = oi(function(c) {
                return c == a.o
            });
        return vq[b].toString()
    };
    Ps.prototype.toString = function() {
        var a = "";
        this.B() && (a += "c");
        this.l && (a += "s");
        this.A > 0 && (a += ":" + this.A);
        return this.getId() + a
    };
    var Qs = function(a, b) {
        Ps.call(this, a, b);
        this.C = []
    };
    w(Qs, Ps);
    Qs.prototype.j = function(a, b) {
        b = b === void 0 ? null : b;
        b != null && this.C.push(b);
        Ps.prototype.j.call(this, a)
    };
    var Rs = function() {};
    var Ss = function() {};
    w(Ss, Rs);
    Ss.prototype.j = function() {
        return null
    };
    Ss.prototype.l = function() {
        return []
    };
    var Ts = function(a, b, c, d) {
        lr.call(this, a, b, c, d)
    };
    w(Ts, lr);
    m = Ts.prototype;
    m.qd = function() {
        if (this.l) {
            var a = this.l,
                b = this.j.g.l;
            try {
                try {
                    var c = Qq(a.getBoundingClientRect())
                } catch (l) {
                    c = new I(0, 0, 0, 0)
                }
                var d = c.right - c.left,
                    e = c.bottom - c.top,
                    f = Gq(a, b),
                    g = f.x,
                    h = f.y;
                var k = new I(Math.round(h), Math.round(g + d), Math.round(h + e), Math.round(g))
            } catch (l) {
                k = Ck($r)
            }
            this.o = k;
            this.g = mr(this, this.o)
        }
    };
    m.ye = function() {
        this.C = this.j.o.g
    };
    m.Ke = function(a) {
        var b = Ao(this.R, "od") == 1;
        return es(a, this.C, this.l, b)
    };
    m.ze = function() {
        this.timestamp = nq()
    };
    m.bb = function() {
        this.ze();
        this.qd();
        if (this.l && typeof this.l.videoWidth === "number" && typeof this.l.videoHeight === "number") {
            var a = this.l;
            var b = new Fk(a.videoWidth, a.videoHeight);
            a = this.g;
            var c = a.getWidth(),
                d = a.getHeight(),
                e = b.width;
            b = b.height;
            e <= 0 || b <= 0 || c <= 0 || d <= 0 || (e /= b, a = Ck(a), e > c / d ? (c /= e, d = (d - c) / 2, d > 0 && (d = a.top + d, a.top = Math.round(d), a.bottom = Math.round(d + c))) : (d *= e, c = Math.round((c - d) / 2), c > 0 && (c = a.left + c, a.left = Math.round(c), a.right = Math.round(c + d))));
            this.g = a
        }
        this.ye();
        a = this.g;
        c = this.C;
        a = a.left <=
            c.right && c.left <= a.right && a.top <= c.bottom && c.top <= a.bottom ? new I(Math.max(a.top, c.top), Math.min(a.right, c.right), Math.min(a.bottom, c.bottom), Math.max(a.left, c.left)) : new I(0, 0, 0, 0);
        c = a.top >= a.bottom || a.left >= a.right ? new I(0, 0, 0, 0) : a;
        a = this.j.o;
        b = e = d = 0;
        if ((this.g.bottom - this.g.top) * (this.g.right - this.g.left) > 0)
            if (this.Ke(c)) c = new I(0, 0, 0, 0);
            else {
                d = ar().A;
                b = new I(0, d.height, d.width, 0);
                var f;
                d = as(c, (f = this.B) != null ? f : this.g);
                e = as(c, ar().g);
                b = as(c, b)
            } f = c.top >= c.bottom || c.left >= c.right ? new I(0, 0, 0, 0) :
            Ek(c, -this.g.left, -this.g.top);
        br() || (e = d = 0);
        this.G = new qq(a, this.g, f, d, e, this.timestamp, b)
    };
    m.getName = function() {
        return this.j.getName()
    };
    var Us = new I(0, 0, 0, 0),
        Vs = function(a, b, c) {
            lr.call(this, null, a, b, c);
            this.L = a.isActive();
            this.J = 0
        };
    w(Vs, Ts);
    m = Vs.prototype;
    m.nd = function() {
        this.A();
        return !0
    };
    m.jb = function() {
        Ts.prototype.bb.call(this)
    };
    m.ze = function() {};
    m.qd = function() {};
    m.bb = function() {
        this.A();
        Ts.prototype.bb.call(this)
    };
    m.Gb = function(a) {
        a = a.isActive();
        a !== this.L && (a ? this.A() : (ar().g = new I(0, 0, 0, 0), this.g = new I(0, 0, 0, 0), this.C = new I(0, 0, 0, 0), this.timestamp = -1));
        this.L = a
    };

    function Ws(a) {
        return [a.top, a.left, a.bottom, a.right]
    }
    var Xs = {},
        Ys = (Xs.firstquartile = 0, Xs.midpoint = 1, Xs.thirdquartile = 2, Xs.complete = 3, Xs),
        Zs = function(a, b, c, d, e, f) {
            f = f === void 0 ? new Ss : f;
            hs.call(this, b, c, d);
            this.Sd = e;
            this.xd = 0;
            this.ia = {};
            this.ha = new Hs;
            this.nf = {};
            this.ma = "";
            this.pb = null;
            this.Qa = !1;
            this.g = [];
            this.Wa = f.j();
            this.B = f.l();
            this.A = null;
            this.l = -1;
            this.aa = this.G = void 0;
            this.K = this.H = 0;
            this.U = -1;
            this.ka = this.ga = !1;
            this.P = this.F = this.j = this.Mb = this.Pa = 0;
            new Hr;
            this.V = this.ba = 0;
            this.da = -1;
            this.la = 0;
            this.C = Ph;
            this.M = [this.Ic()];
            this.Db = 2;
            this.Ab = {};
            this.Ab.pause = "p";
            this.Ab.resume = "r";
            this.Ab.skip = "s";
            this.Ab.mute = "m";
            this.Ab.unmute = "um";
            this.Ab.exitfullscreen = "ef";
            this.o = null;
            this.va = this.wa = !1;
            this.Cb = Math.floor(Date.now() / 1E3 - 1704067200);
            this.Z = 0
        };
    w(Zs, hs);
    Zs.prototype.Oa = function() {
        return !0
    };
    var $s = function(a) {
            a.Je = !0;
            a.la != 0 && (a.la = 3)
        },
        at = function(a) {
            return a === void 0 ? a : Number(a) ? Lq(a, 3) : 0
        };
    m = Zs.prototype;
    m.Ge = function(a) {
        return ks(this, a, Math.max(1E4, this.l / 3))
    };
    m.he = function(a, b, c, d, e, f, g) {
        var h = this,
            k = this.C(this) || {};
        ui(k, e);
        this.l = k.duration || this.l;
        this.G = k.isVpaid || this.G;
        this.aa = k.isYouTube || this.aa;
        tp();
        this.va = !1;
        e = bt(this, b);
        ct(this) === 1 && (f = e);
        hs.prototype.he.call(this, a, b, c, d, k, f, g);
        this.Wa && this.Wa.l && Sb(this.B, function(l) {
            l.j(h)
        })
    };
    m.ie = function(a, b, c) {
        hs.prototype.ie.call(this, a, b, c);
        dt(this).L(a, b, this.qa, c);
        this.ka = us(this.qa) && us(b);
        this.U == -1 && this.ga && (this.U = this.pa().l.g);
        this.ha.l = 0;
        a = this.Ua();
        b.isVisible() && this.ha.reportEvent("vs");
        a && this.ha.reportEvent("vw");
        Sq(b.volume) && this.ha.reportEvent("am");
        us(b) ? this.ha.reportEvent("a") : this.ha.reportEvent("mut");
        this.Hb && this.ha.reportEvent("f");
        b.j != -1 && (this.ha.reportEvent("bm"), b.j == 1 && (this.ha.reportEvent("b"), us(b) && this.ha.reportEvent("umutb")));
        us(b) && b.isVisible() &&
            this.ha.reportEvent("avs");
        this.ka && a && this.ha.reportEvent("avw");
        b.X > 0 && this.ha.reportEvent("pv");
        et(this, this.pa().l.g, !0) && this.ha.reportEvent("gdr");
        Nr(this.pa().j, 1) >= 2E3 && this.ha.reportEvent("pmx");
        this.va && this.ha.reportEvent("tvoff")
    };
    m.Ic = function() {
        return new Ms
    };
    m.pa = function() {
        return this.Uc
    };
    var dt = function(a, b) {
        return a.M[b != null && b < a.M.length ? b : a.M.length - 1]
    };
    Zs.prototype.Dd = function() {
        return new ts
    };
    Zs.prototype.od = function(a, b, c, d) {
        a = hs.prototype.od.call(this, a, b, c, d === void 0 ? -1 : d);
        a.fullscreen = this.Hb;
        a.l = this.la == 2;
        a.volume = c.volume;
        Sq(a.volume) || (this.Pa++, b = this.qa, Sq(b.volume) && (a.volume = b.volume));
        c = c.currentTime;
        a.mediaTime = c !== void 0 && c >= 0 ? c : -1;
        return a
    };
    var ct = function(a) {
            var b = !!Ao(N().R, "umt");
            return a.G || !b && !a.aa ? 0 : 1
        },
        bt = function(a, b) {
            a.la == 2 ? b = 0 : a.Lc == -1 ? b = 0 : (b -= a.Lc, b = b > Math.max(1E4, a.l / 3) ? 0 : b);
            var c = a.C(a) || {};
            c = c.currentTime !== void 0 ? c.currentTime : a.H;
            var d = c - a.H,
                e = 0;
            d >= 0 ? (a.K += b, a.V += Math.max(b - d, 0), e = Math.min(d, a.K)) : a.ba += Math.abs(d);
            d != 0 && (a.K = 0);
            a.da == -1 && d > 0 && (a.da = lq >= 0 ? nq() - lq : -1);
            a.H = c;
            return e
        };
    Zs.prototype.td = function(a) {
        return ar(), this.Hb ? 1 : hs.prototype.td.call(this, a)
    };
    Zs.prototype.za = function() {
        return 1
    };
    Zs.prototype.getDuration = function() {
        return this.l
    };
    var ft = function(a, b) {
            Xb(a.B, function(c) {
                return c.o == b.o
            }) || a.B.push(b)
        },
        gt = function(a) {
            var b = Lr(a.pa().g, 1);
            return et(a, b)
        },
        et = function(a, b, c) {
            return b >= 15E3 ? !0 : a.ga ? (c === void 0 ? 0 : c) ? !0 : a.l > 0 ? b >= a.l / 2 : a.U > 0 ? b >= a.U : !1 : !1
        },
        ht = function(a) {
            var b = {},
                c = ar();
            b.insideIframe = c.l;
            b.unmeasurable = a.Sa;
            var d = a.ib(),
                e = a.W ? a.W.o : null;
            b.position = d;
            e && !Dk(d, e) && (b.containerPosition = e);
            b.exposure = a.qa.X;
            b.documentSize = c.o;
            b.viewportSize = new Fk(c.g.getWidth(), c.g.getHeight());
            a.o != null && (b.presenceData = a.o);
            b.screenShare =
                a.qa.sa;
            return b
        },
        it = function(a) {
            var b = Lq(a.qa.X, 2),
                c = a.ha.l,
                d = a.qa,
                e = dt(a),
                f = at(e.o),
                g = at(e.B),
                h = at(d.volume),
                k = Lq(e.C, 2),
                l = Lq(e.H, 2),
                p = Lq(d.X, 2),
                n = Lq(e.K, 2),
                q = Lq(e.P, 2);
            d = Lq(d.sa, 2);
            var t = Ck(a.ib()).round();
            a = a.W && a.W.o ? Ck(a.W ? a.W.o : null).round() : null;
            e = Tr(e, !1);
            return {
                zh: b,
                Zb: c,
                Vc: f,
                Rc: g,
                Pb: h,
                Wc: k,
                Sc: l,
                X: p,
                Xc: n,
                Tc: q,
                sa: d,
                position: t,
                Qb: a,
                Yc: e
            }
        },
        kt = function(a, b) {
            jt(a.g, b, function() {
                return {
                    zh: 0,
                    Zb: void 0,
                    Vc: -1,
                    Rc: -1,
                    Pb: -1,
                    Wc: -1,
                    Sc: -1,
                    X: -1,
                    Xc: -1,
                    Tc: -1,
                    sa: -1,
                    position: void 0,
                    Qb: void 0,
                    Yc: []
                }
            });
            a.g[b] =
                it(a)
        },
        jt = function(a, b, c) {
            for (var d = a.length; d < b + 1;) a.push(c()), d++
        },
        nt = function(a, b, c) {
            var d = a.nf[b];
            if (d != null) return d;
            d = lt(a, b);
            var e = oi(function(f) {
                return f == b
            });
            a = mt(a, d, d, c, Ys[pi[e]]);
            b == "fully_viewable_audible_half_duration_impression" && (a.std = "csm");
            return a
        },
        ot = function(a, b, c) {
            var d = [b];
            if (a != b || c != b) d.unshift(a), d.push(c);
            return d
        },
        mt = function(a, b, c, d, e) {
            if (a.Sa) return {
                "if": 0,
                vs: 0
            };
            var f = Ck(a.ib()).round(),
                g = a.W ? a.W.o : null,
                h = ar(),
                k = N(),
                l = a.pa(),
                p = a.W ? a.W.getName() : "ns",
                n = {};
            n["if"] = h.l ?
                1 : void 0;
            n.sdk = a.A ? a.A : void 0;
            n.t = a.ph;
            n.p = [f.top, f.left, f.bottom, f.right];
            f && g && !Dk(g, f) && (f = g.round(), n.cp = [f.top, f.left, f.bottom, f.right]);
            n.tos = Jr(l.j, !1);
            n.mtos = Tr(l);
            n.mcvt = l.ba.l;
            n.ps = void 0;
            n.vht = Ns(l, nq(), a.la == 2);
            n.mut = l.wa.l;
            n.a = at(a.qa.volume);
            n.mv = at(l.B);
            n.fs = a.Hb ? 1 : 0;
            n.ft = l.G.g;
            n.at = l.A.g;
            n.as = l.o > 0 ? 1 : 0;
            n.atos = Jr(l.g);
            n.ssb = Jr(l.va, !1);
            n.amtos = Mr(l.g, !1);
            n.uac = a.Pa;
            n.vpt = l.l.g;
            p == "nio" && (n.nio = 1, n.avms = "nio");
            n.gmm = "4";
            n.gdr = et(a, l.l.g, !0) ? 1 : 0;
            n.efpf = a.Db;
            if (p == "gsv" || p == "nis") p = a.W,
                p.J > 0 && (n.nnut = p.J);
            n.tcm = ct(a);
            n.nmt = a.ba;
            n.bt = a.V;
            n.pst = a.da;
            n.vpaid = a.G;
            n.dur = a.l;
            n.vmtime = a.H;
            n.is = a.ha.l;
            a.g.length >= 1 && (n.i0 = a.g[0].Zb, n.a0 = [a.g[0].Pb], n.c0 = [a.g[0].X], n.ss0 = [a.g[0].sa], p = a.g[0].position, f = a.g[0].Qb, n.p0 = p ? Ws(p) : void 0, p && f && !Dk(f, p) && (n.cp0 = Ws(f)));
            a.g.length >= 2 && (n.i1 = a.g[1].Zb, n.a1 = ot(a.g[1].Vc, a.g[1].Pb, a.g[1].Rc), n.c1 = ot(a.g[1].Wc, a.g[1].X, a.g[1].Sc), n.ss1 = ot(a.g[1].Xc, a.g[1].sa, a.g[1].Tc), p = a.g[1].position, f = a.g[1].Qb, n.p1 = p ? Ws(p) : void 0, p && f && !Dk(f, p) && (n.cp1 = Ws(f)),
                n.mtos1 = a.g[1].Yc);
            a.g.length >= 3 && (n.i2 = a.g[2].Zb, n.a2 = ot(a.g[2].Vc, a.g[2].Pb, a.g[2].Rc), n.c2 = ot(a.g[2].Wc, a.g[2].X, a.g[2].Sc), n.ss2 = ot(a.g[2].Xc, a.g[2].sa, a.g[2].Tc), p = a.g[2].position, f = a.g[2].Qb, n.p2 = p ? Ws(p) : void 0, p && f && !Dk(f, p) && (n.cp2 = Ws(f)), n.mtos2 = a.g[2].Yc);
            a.g.length >= 4 && (n.i3 = a.g[3].Zb, n.a3 = ot(a.g[3].Vc, a.g[3].Pb, a.g[3].Rc), n.c3 = ot(a.g[3].Wc, a.g[3].X, a.g[3].Sc), n.ss3 = ot(a.g[3].Xc, a.g[3].sa, a.g[3].Tc), p = a.g[3].position, f = a.g[3].Qb, n.p3 = p ? Ws(p) : void 0, p && f && !Dk(f, p) && (n.cp3 = Ws(f)), n.mtos3 =
                a.g[3].Yc);
            n.cs = Js(a.ha);
            b && (n.ic = Is(a.ha), n.dvpt = l.l.j, n.dvs = Or(l.j, .5), n.dfvs = Or(l.j, 1), n.davs = Or(l.g, .5), n.dafvs = Or(l.g, 1), c && (l.l.j = 0, Pr(l.j), Pr(l.g)), a.Ua() && (n.dtos = l.M, n.dav = l.F, n.dtoss = a.xd + 1, c && (l.M = 0, l.F = 0, a.xd++)), n.dat = l.A.j, n.dft = l.G.j, c && (l.A.j = 0, l.G.j = 0));
            n.ps = [h.o.width, h.o.height];
            n.bs = [h.g.getWidth(), h.g.getHeight()];
            n.scs = [h.A.width, h.A.height];
            n.dom = h.domain;
            a.Mb && (n.vds = a.Mb);
            if (a.B.length > 0 || a.Wa) b = gc(a.B), a.Wa && b.push(a.Wa), n.pings = Vb(b, function(q) {
                return q.toString()
            });
            b = Vb(Ub(a.B,
                function(q) {
                    return q.B()
                }), function(q) {
                return q.getId()
            });
            hc(b);
            n.ces = b;
            a.j && (n.vmer = a.j);
            a.F && (n.vmmk = a.F);
            a.P && (n.vmiec = a.P);
            n.avms = a.W ? a.W.getName() : "ns";
            a.W && ui(n, a.W.gb());
            d ? (n.c = Lq(a.qa.X, 2), n.ss = Lq(a.qa.sa, 2)) : n.tth = nq() - kq;
            n.mc = Lq(l.H, 2);
            n.nc = Lq(l.C, 2);
            n.mv = at(l.B);
            n.nv = at(l.o);
            n.lte = Lq(a.Id, 2);
            d = dt(a, e);
            Tr(l);
            n.qmtos = Tr(d);
            n.qnc = Lq(d.C, 2);
            n.qmv = at(d.B);
            n.qnv = at(d.o);
            n.qas = d.o > 0 ? 1 : 0;
            n.qi = a.ma;
            n.avms || (n.avms = "geo");
            n.psm = l.U.g;
            n.psv = l.U.getValue();
            n.psfv = l.ga.getValue();
            n.psa = l.da.getValue();
            k = Co(k.R);
            k.length && (n.veid = k);
            a.o && ui(n, rs(a.o));
            n.avas = a.Gc();
            n.vs = a.Ie();
            n.co = pt(a);
            n.tm = l.V;
            n.tu = l.Z;
            return n
        },
        lt = function(a, b) {
            if (bc(uq, b)) return !0;
            var c = a.ia[b];
            return c !== void 0 ? (a.ia[b] = !0, !c) : !1
        };
    Zs.prototype.Ie = function() {
        return this.Sa ? 2 : gt(this) ? 5 : this.Ua() ? 4 : 3
    };
    Zs.prototype.Gc = function() {
        return this.wa ? this.pa().A.l >= 2E3 ? 4 : 3 : 2
    };
    var pt = function(a) {
        var b = a.Z.toString(10).padStart(2, "0");
        b = "" + a.Cb + b;
        a.Z < 99 && a.Z++;
        return b
    };
    var qt = Date.now(),
        ut = function() {
            this.g = {};
            var a = Po();
            rt(this, a, document);
            var b = tt();
            try {
                if ("1" == b) {
                    for (var c = a.parent; c != a.top; c = c.parent) rt(this, c, c.document);
                    rt(this, a.top, a.top.document)
                }
            } catch (d) {}
        },
        tt = function() {
            var a = document.documentElement;
            try {
                if (!cj(Po().top)) return "2";
                var b = [],
                    c = Po(a.ownerDocument);
                for (a = c; a != c.top; a = a.parent)
                    if (a.frameElement) b.push(a.frameElement);
                    else break;
                return b && b.length != 0 ? "1" : "0"
            } catch (d) {
                return "2"
            }
        },
        rt = function(a, b, c) {
            Zr(c, "mousedown", function() {
                    return vt(a)
                },
                301);
            Zr(b, "scroll", function() {
                return wt(a)
            }, 302);
            Zr(c, "touchmove", function() {
                return xt(a)
            }, 303);
            Zr(c, "mousemove", function() {
                return yt(a)
            }, 304);
            Zr(c, "keydown", function() {
                return zt(a)
            }, 305)
        },
        vt = function(a) {
            Zh(a.g, function(b) {
                b.l > 1E5 || ++b.l
            })
        },
        wt = function(a) {
            Zh(a.g, function(b) {
                b.g > 1E5 || ++b.g
            })
        },
        xt = function(a) {
            Zh(a.g, function(b) {
                b.g > 1E5 || ++b.g
            })
        },
        zt = function(a) {
            Zh(a.g, function(b) {
                b.j > 1E5 || ++b.j
            })
        },
        yt = function(a) {
            Zh(a.g, function(b) {
                b.o > 1E5 || ++b.o
            })
        };
    var At = function() {
            this.g = [];
            this.j = []
        },
        Bt = function(a, b) {
            return Yb(a.g, function(c) {
                return c.ma == b
            })
        },
        Ct = function(a, b) {
            return b ? Yb(a.g, function(c) {
                return c.ta.nb == b
            }) : null
        },
        Dt = function(a, b) {
            return Yb(a.j, function(c) {
                return c.za() == 2 && c.ma == b
            })
        },
        Ft = function() {
            var a = Et;
            return a.g.length == 0 ? a.j : a.j.length == 0 ? a.g : fc(a.j, a.g)
        };
    At.prototype.reset = function() {
        this.g = [];
        this.j = []
    };
    var Gt = function(a, b) {
            a = b.za() == 1 ? a.g : a.j;
            var c = Zb(a, function(d) {
                return d == b
            });
            return c != -1 ? (a.splice(c, 1), b.W && b.W.F(), b.dispose(), !0) : !1
        },
        Ht = function(a) {
            var b = Et;
            if (Gt(b, a)) {
                switch (a.za()) {
                    case 0:
                        var c = function() {
                            return null
                        };
                    case 2:
                        c = function() {
                            return Dt(b, a.ma)
                        };
                        break;
                    case 1:
                        c = function() {
                            return Bt(b, a.ma)
                        }
                }
                for (var d = c(); d; d = c()) Gt(b, d)
            }
        },
        It = function(a) {
            var b = Et;
            a = Ub(a, function(c) {
                return !Ct(b, c.ta.nb)
            });
            b.g.push.apply(b.g, ra(a))
        },
        Jt = function(a) {
            var b = [];
            Sb(a, function(c) {
                Xb(Et.g, function(d) {
                    return d.ta.nb ===
                        c.ta.nb && d.ma === c.ma
                }) || (Et.g.push(c), b.push(c))
            })
        },
        Et = J(At);
    var Kt = function() {
            this.g = this.j = null
        },
        Lt = function(a, b) {
            if (a.j == null) return !1;
            var c = function(d, e) {
                b(d, e)
            };
            a.g = Yb(a.j, function(d) {
                return d != null && d.pe()
            });
            a.g && (a.g.init(c) ? ir(a.g.g) : b(a.g.g.Eb(), a.g));
            return a.g != null
        };
    var Nt = function(a) {
        a = Mt(a);
        nr.call(this, a.length ? a[a.length - 1] : new er(O, 0));
        this.l = a;
        this.j = null
    };
    w(Nt, nr);
    m = Nt.prototype;
    m.getName = function() {
        return (this.j ? this.j : this.g).getName()
    };
    m.gb = function() {
        return (this.j ? this.j : this.g).gb()
    };
    m.Ra = function() {
        return (this.j ? this.j : this.g).Ra()
    };
    m.init = function(a) {
        var b = !1;
        Sb(this.l, function(c) {
            c.initialize() && (b = !0)
        });
        b && (this.o = a, hr(this.g, this));
        return b
    };
    m.dispose = function() {
        Sb(this.l, function(a) {
            a.dispose()
        });
        nr.prototype.dispose.call(this)
    };
    m.pe = function() {
        return Xb(this.l, function(a) {
            return a.G()
        })
    };
    m.Nb = function() {
        return Xb(this.l, function(a) {
            return a.G()
        })
    };
    m.rc = function(a, b, c) {
        return new Ts(a, this.g, b, c)
    };
    m.jb = function(a) {
        this.j = a.j
    };
    var Mt = function(a) {
        if (!a.length) return [];
        a = Ub(a, function(c) {
            return c != null && c.G()
        });
        for (var b = 1; b < a.length; b++) hr(a[b - 1], a[b]);
        return a
    };
    var Ot = {
            threshold: [0, .3, .5, .75, 1]
        },
        Pt = function(a, b, c, d) {
            lr.call(this, a, b, c, d);
            this.K = this.H = this.J = this.L = this.A = null
        };
    w(Pt, Ts);
    Pt.prototype.nd = function() {
        var a = this;
        this.K || (this.K = nq());
        if (eq(298, function() {
                return Qt(a)
            })) return !0;
        gr(this.j, "msf");
        return !1
    };
    Pt.prototype.F = function() {
        if (this.A && this.l) try {
            this.A.unobserve(this.l), this.L ? (this.L.unobserve(this.l), this.L = null) : this.J && (this.J.disconnect(), this.J = null)
        } catch (a) {}
    };
    var Rt = function(a) {
            return a.A && a.A.takeRecords ? a.A.takeRecords() : []
        },
        Qt = function(a) {
            if (!a.l) return !1;
            var b = a.l,
                c = a.j.g.l,
                d = N().g.g;
            a.A = new c.IntersectionObserver(zp(d, function(e) {
                return St(a, e)
            }), Ot);
            d = zp(d, function() {
                a.A.unobserve(b);
                a.A.observe(b);
                St(a, Rt(a))
            });
            c.ResizeObserver ? (a.L = new c.ResizeObserver(d), a.L.observe(b)) : c.MutationObserver && (a.J = new y.MutationObserver(d), a.J.observe(b, {
                attributes: !0,
                childList: !0,
                characterData: !0,
                subtree: !0
            }));
            a.A.observe(b);
            St(a, Rt(a));
            return !0
        },
        St = function(a,
            b) {
            try {
                if (b.length) {
                    a.H || (a.H = nq());
                    var c = Tt(b),
                        d = Gq(a.l, a.j.g.l),
                        e = d.x,
                        f = d.y;
                    a.o = new I(Math.round(f), Math.round(e) + c.boundingClientRect.width, Math.round(f) + c.boundingClientRect.height, Math.round(e));
                    a.g = mr(a, a.o);
                    var g = Qq(c.intersectionRect);
                    a.C = Ek(g, a.o.left - g.left, a.o.top - g.top)
                }
            } catch (h) {
                a.F(), gq(299, h)
            }
        },
        Tt = function(a) {
            return Wb(a, function(b, c) {
                return b.time > c.time ? b : c
            }, a[0])
        };
    m = Pt.prototype;
    m.bb = function() {
        var a = Rt(this);
        a.length > 0 && St(this, a);
        Ts.prototype.bb.call(this)
    };
    m.qd = function() {};
    m.Ke = function() {
        return !1
    };
    m.ye = function() {};
    m.gb = function() {
        var a = {};
        return Object.assign(this.j.gb(), (a.niot_obs = this.K, a.niot_cbk = this.H, a))
    };
    m.getName = function() {
        return "nio"
    };
    var Ut = function(a) {
        a = a === void 0 ? O : a;
        nr.call(this, new er(a, 2))
    };
    w(Ut, nr);
    Ut.prototype.getName = function() {
        return "nio"
    };
    Ut.prototype.Nb = function() {
        return !ar().j && this.g.g.l.IntersectionObserver != null
    };
    Ut.prototype.rc = function(a, b, c) {
        return new Pt(a, this.g, b, c)
    };
    var Wt = function() {
        var a = Vt();
        er.call(this, O.top, a, "geo")
    };
    w(Wt, er);
    Wt.prototype.ba = function() {
        return ar().g
    };
    Wt.prototype.G = function() {
        var a = Vt();
        this.L !== a && (this.g != this && a > this.g.L && (this.g = this, fr(this)), this.L = a);
        return a == 2
    };
    var Vt = function() {
        N();
        var a = ar();
        return a.l || a.j ? 0 : 2
    };
    var Xt = function() {};
    var Yt = function() {
            this.done = !1;
            this.g = {
                Tf: 0,
                ue: 0,
                tj: 0,
                Ce: 0,
                Gd: -1,
                gg: 0,
                fg: 0,
                hg: 0,
                lh: 0
            };
            this.A = null;
            this.B = !1;
            this.l = null;
            this.C = 0;
            this.j = new cr(this)
        },
        au = function() {
            var a = Zt;
            a.B || (a.B = !0, $t(a, function() {
                return a.o.apply(a, ra(Ma.apply(0, arguments)))
            }), a.o())
        };
    Yt.prototype.sample = function() {
        bu(this, Ft(), !1)
    };
    var cu = function() {
            J(Xt);
            var a = J(Kt);
            a.g != null && a.g.g ? ir(a.g.g) : Xq(ar())
        },
        bu = function(a, b, c) {
            if (!a.done && (a.j.cancel(), b.length != 0)) {
                a.l = null;
                try {
                    cu();
                    var d = nq();
                    N().A = d;
                    if (J(Kt).g != null)
                        for (var e = 0; e < b.length; e++) ls(b[e], d, c);
                    for (d = 0; d < b.length; d++) ms(b[d]);
                    ++a.g.Ce
                } finally {
                    c ? Sb(b, function(f) {
                        f.qa.X = 0
                    }) : dr(a.j)
                }
            }
        },
        $t = function(a, b) {
            if (!a.A) {
                b = fq(142, b);
                tp();
                var c = dl(Fo);
                c && Vh(Fo, c, b, {
                    capture: !1
                }) && (a.A = b)
            }
        };
    Yt.prototype.o = function() {
        var a = br(),
            b = nq();
        a ? (mq || (iq = b, Sb(Et.g, function(c) {
            var d = c.pa();
            d.aa = Ns(d, b, c.la != 1)
        })), mq = !0) : (this.C = du(this, b), mq = !1, kq = b, Sb(Et.g, function(c) {
            c.Tb && (c.pa().J = b)
        }));
        bu(this, Ft(), !a)
    };
    var eu = function() {
            var a = J(Kt);
            if (a.g != null) {
                var b = a.g;
                Sb(Ft(), function(c) {
                    return js(c, b)
                })
            }
        },
        du = function(a, b) {
            a = a.C;
            mq && (a += b - iq);
            return a
        },
        fu = function(a) {
            a = a === void 0 ? function() {
                return {}
            } : a;
            bq.bf("av-js");
            Ip.g = .01;
            dq([function(b) {
                var c = N(),
                    d = {};
                d = (d.bin = c.j, d.type = "error", d);
                c = Bo(c.R);
                if (!Zt.l) {
                    var e = Zt,
                        f = O.document,
                        g = jq >= 0 ? nq() - jq : -1,
                        h = nq();
                    e.g.Gd == -1 && (g = h);
                    var k = ar(),
                        l = N(),
                        p = Bo(l.R),
                        n = Ft();
                    try {
                        if (n.length > 0) {
                            var q = k.g;
                            q && (p.bs = [q.getWidth(), q.getHeight()]);
                            var t = k.o;
                            t && (p.ps = [t.width, t.height]);
                            O.screen && (p.scs = [O.screen.width, O.screen.height])
                        } else p.url = encodeURIComponent(O.location.href.substring(0, 512)), f.referrer && (p.referrer = encodeURIComponent(f.referrer.substring(0, 512)));
                        p.tt = g;
                        p.pt = jq;
                        p.bin = l.j;
                        O.google_osd_load_pub_page_exp !== void 0 && (p.olpp = O.google_osd_load_pub_page_exp);
                        p.deb = [1, e.g.Tf, e.g.ue, e.g.Ce, e.g.Gd, 0, e.j.j, e.g.gg, e.g.fg, e.g.hg, e.g.lh, -1].join(";");
                        p.tvt = du(e, h);
                        k.j && (p.inapp = 1);
                        if (O !== null && O != O.top) {
                            n.length > 0 && (p.iframe_loc = encodeURIComponent(O.location.href.substring(0,
                                512)));
                            var u = k.J;
                            p.is = [u.getWidth(), u.getHeight()]
                        }
                    } catch (C) {
                        p.error = 1
                    }
                    Zt.l = p
                }
                t = Zt.l;
                q = {};
                for (var v in t) q[v] = t[v];
                v = N().g;
                if (Ao(v.l, "prf") == 1) {
                    t = new xp;
                    u = v.g;
                    e = 0;
                    u.g > -1 && (e = u.l.g.now() - u.g);
                    u = u.o + e;
                    if (u != null && typeof u !== "number") throw Error("Value of float/double field must be a number, found " + typeof u + ": " + u);
                    t = Nf(t, 1, u, 0);
                    u = v.g;
                    t = ug(t, 5, u.g > -1 ? u.j + 1 : u.j);
                    t = vg(t, 2, v.j.g.l());
                    t = vg(t, 3, v.j.g.j());
                    v = vg(t, 4, v.j.g.g());
                    t = {};
                    v = (t.pf = Rc(v.g()), t)
                } else v = {};
                ui(q, v);
                ui(b, d, c, q, a())
            }])
        },
        Zt = J(Yt);
    var gu = null,
        hu = "",
        iu = !1,
        ju = function() {
            var a = gu || O;
            if (!a) return "";
            var b = [];
            if (!a.location || !a.location.href) return "";
            b.push("url=" + encodeURIComponent(a.location.href.substring(0, 512)));
            a.document && a.document.referrer && b.push("referrer=" + encodeURIComponent(a.document.referrer.substring(0, 512)));
            return b.join("&")
        };

    function ku() {
        var a = "av.default_js_unreleased_RCxx".match(/_(\d{8})_RC\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+_\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+\.\d+$/) || "av.default_js_unreleased_RCxx".match(/_(\d{8})_\d+_RC\d+$/),
            b;
        if (((b = a) == null ? void 0 : b.length) == 2) return a[1];
        a = "av.default_js_unreleased_RCxx".match(/.*_(\d{2})\.(\d{4})\.\d+_RC\d+$/);
        var c;
        return ((c = a) == null ? void 0 : c.length) == 3 ? "20" + a[1] + a[2] : null
    }
    var lu = function() {
            return "ima_html5_sdk".includes("ima_html5_sdk") ? {
                Ka: "ima",
                La: null
            } : "ima_html5_sdk".includes("ima_native_sdk") ? {
                Ka: "nima",
                La: null
            } : "ima_html5_sdk".includes("admob-native-video-javascript") ? {
                Ka: "an",
                La: null
            } : "av.default_js_unreleased_RCxx".includes("cast_js_sdk") ? {
                Ka: "cast",
                La: ku()
            } : "av.default_js_unreleased_RCxx".includes("youtube.player.web") ? {
                Ka: "yw",
                La: ku()
            } : "av.default_js_unreleased_RCxx".includes("outstream_web_client") ? {
                Ka: "out",
                La: ku()
            } : "av.default_js_unreleased_RCxx".includes("drx_rewarded_web") ? {
                Ka: "r",
                La: ku()
            } : "av.default_js_unreleased_RCxx".includes("gam_native_web_video") ? {
                Ka: "n",
                La: ku()
            } : "av.default_js_unreleased_RCxx".includes("admob_interstitial_video") ? {
                Ka: "int",
                La: ku()
            } : {
                Ka: "j",
                La: null
            }
        },
        mu = lu().Ka,
        nu = lu().La;
    var pu = function(a, b) {
            var c = {
                sv: "966"
            };
            nu !== null && (c.v = nu);
            c.cb = mu;
            c.nas = Et.g.length;
            c.msg = a;
            b !== void 0 && (a = ou(b)) && (c.e = vq[a]);
            return c
        },
        qu = function(a) {
            return a.lastIndexOf("custom_metric_viewable", 0) == 0
        },
        ou = function(a) {
            var b = qu(a) ? "custom_metric_viewable" : a.toLowerCase();
            return oi(function(c) {
                return c == b
            })
        };
    var ru = {
            Sh: "visible",
            Dh: "audible",
            Ni: "time",
            Pi: "timetype"
        },
        tu = {
            visible: function(a) {
                return /^(100|[0-9]{1,2})$/.test(a)
            },
            audible: function(a) {
                return a == "0" || a == "1"
            },
            timetype: function(a) {
                return a == "mtos" || a == "tos"
            },
            time: function(a) {
                return /^(100|[0-9]{1,2})%$/.test(a) || /^([0-9])+ms$/.test(a)
            }
        },
        uu = function() {
            this.g = void 0;
            this.j = !1;
            this.l = 0;
            this.o = -1;
            this.A = "tos"
        },
        vu = function(a) {
            try {
                var b = a.split(",");
                return b.length > ki(ru).length ? null : Wb(b, function(c, d) {
                    d = d.toLowerCase().split("=");
                    if (d.length != 2 || tu[d[0]] ===
                        void 0 || !tu[d[0]](d[1])) throw Error("Entry (" + d[0] + ", " + d[1] + ") is invalid.");
                    c[d[0]] = d[1];
                    return c
                }, {})
            } catch (c) {
                return null
            }
        },
        wu = function(a, b) {
            if (a.g == void 0) return 0;
            switch (a.A) {
                case "mtos":
                    return a.j ? Nr(b.g, a.g) : Nr(b.j, a.g);
                case "tos":
                    return a.j ? Lr(b.g, a.g) : Lr(b.j, a.g)
            }
            return 0
        };
    var xu = function(a, b, c, d) {
        Ps.call(this, b, d);
        this.C = a;
        this.J = c
    };
    w(xu, Ps);
    xu.prototype.getId = function() {
        return this.C
    };
    xu.prototype.B = function() {
        return !0
    };
    xu.prototype.g = function(a) {
        var b = a.pa(),
            c = a.getDuration();
        return Xb(this.J, function(d) {
            if (d.g != void 0) var e = wu(d, b);
            else b: {
                switch (d.A) {
                    case "mtos":
                        e = d.j ? b.A.l : b.l.g;
                        break b;
                    case "tos":
                        e = d.j ? b.A.g : b.l.g;
                        break b
                }
                e = 0
            }
            e == 0 ? d = !1 : (d = d.l != -1 ? d.l : c !== void 0 && c > 0 ? d.o * c : -1, d = d != -1 && e >= d);
            return d
        })
    };
    var yu = function() {};
    w(yu, Fs);
    yu.prototype.g = function(a) {
        var b = new Es;
        b.g = Gs(a, Bs);
        b.j = Gs(a, Ds);
        return b
    };
    var zu = function(a) {
        Ps.call(this, "fully_viewable_audible_half_duration_impression", a)
    };
    w(zu, Ps);
    zu.prototype.g = function(a) {
        return gt(a)
    };
    var Au = function(a) {
        this.g = a
    };
    w(Au, Rs);
    var Bu = function(a, b) {
        Ps.call(this, a, b)
    };
    w(Bu, Ps);
    Bu.prototype.g = function(a) {
        return a.pa().Ua()
    };
    var Cu = function(a) {
        Qs.call(this, "measurable_impression", a)
    };
    w(Cu, Qs);
    Cu.prototype.g = function(a) {
        var b = bc(this.C, Ao(N().R, "ovms"));
        return !a.Sa && (a.la != 0 || b)
    };
    var Du = function() {
        Au.apply(this, arguments)
    };
    w(Du, Au);
    Du.prototype.j = function() {
        return new Cu(this.g)
    };
    Du.prototype.l = function() {
        return [new Bu("viewable_impression", this.g), new zu(this.g)]
    };
    var Eu = function(a, b, c) {
        Vs.call(this, a, b, c)
    };
    w(Eu, Vs);
    Eu.prototype.A = function() {
        var a = Sa("ima.admob.getViewability"),
            b = Ao(this.R, "queryid");
        typeof a === "function" && b && a(b)
    };
    Eu.prototype.getName = function() {
        return "gsv"
    };
    var Fu = function(a) {
        a = a === void 0 ? O : a;
        nr.call(this, new er(a, 2))
    };
    w(Fu, nr);
    Fu.prototype.getName = function() {
        return "gsv"
    };
    Fu.prototype.Nb = function() {
        var a = ar();
        N();
        return a.j && !1
    };
    Fu.prototype.rc = function(a, b, c) {
        return new Eu(this.g, b, c)
    };
    var Gu = function(a, b, c) {
        Vs.call(this, a, b, c)
    };
    w(Gu, Vs);
    Gu.prototype.A = function() {
        var a = this,
            b = Sa("ima.bridge.getNativeViewability"),
            c = Ao(this.R, "queryid");
        typeof b === "function" && c && b(c, function(d) {
            qi(d) && a.J++;
            var e = d.opt_nativeViewVisibleBounds || {},
                f = d.opt_nativeViewHidden;
            a.g = Rq(d.opt_nativeViewBounds || {});
            var g = a.j.o;
            g.g = f ? Ck(Us) : Rq(e);
            a.timestamp = d.opt_nativeTime || -1;
            ar().g = g.g;
            d = d.opt_nativeVolume;
            d !== void 0 && (g.volume = d)
        })
    };
    Gu.prototype.getName = function() {
        return "nis"
    };
    var Hu = function(a) {
        a = a === void 0 ? O : a;
        nr.call(this, new er(a, 2))
    };
    w(Hu, nr);
    Hu.prototype.getName = function() {
        return "nis"
    };
    Hu.prototype.Nb = function() {
        var a = ar();
        N();
        return a.j && !1
    };
    Hu.prototype.rc = function(a, b, c) {
        return new Gu(this.g, b, c)
    };
    var Iu = function() {
        er.call(this, O, 2, "mraid");
        this.da = 0;
        this.K = this.M = !1;
        this.J = null;
        this.j = wq(this.l);
        this.o.g = new I(0, 0, 0, 0);
        this.ga = !1
    };
    w(Iu, er);
    Iu.prototype.G = function() {
        return this.j.Fa != null
    };
    Iu.prototype.aa = function() {
        var a = {};
        this.da && (a.mraid = this.da);
        this.M && (a.mlc = 1);
        a.mtop = this.j.kh;
        this.J && (a.mse = this.J);
        this.ga && (a.msc = 1);
        a.mcp = this.j.Dc;
        return a
    };
    Iu.prototype.B = function(a) {
        var b = Ma.apply(1, arguments);
        try {
            return this.j.Fa[a].apply(this.j.Fa, b)
        } catch (c) {
            gq(538, c, .01, function(d) {
                d.method = a
            })
        }
    };
    var Ju = function(a, b, c) {
        a.B("addEventListener", b, c)
    };
    Iu.prototype.initialize = function() {
        var a = this;
        if (this.ua) return !this.Xb();
        this.ua = !0;
        if (this.j.Dc === 2) return this.J = "ng", gr(this, "w"), !1;
        if (this.j.Dc === 1) return this.J = "mm", gr(this, "w"), !1;
        ar().L = !0;
        this.l.document.readyState && this.l.document.readyState == "complete" ? Ku(this) : Zr(this.l, "load", function() {
            tp().setTimeout(fq(292, function() {
                return Ku(a)
            }), 100)
        }, 292);
        return !0
    };
    var Ku = function(a) {
            N().o = !!a.B("isViewable");
            Ju(a, "viewableChange", Lu);
            a.B("getState") === "loading" ? Ju(a, "ready", Mu) : Nu(a)
        },
        Nu = function(a) {
            typeof a.j.Fa.AFMA_LIDAR === "string" ? (a.M = !0, Ou(a)) : (a.j.Dc = 3, a.J = "nc", gr(a, "w"))
        },
        Ou = function(a) {
            a.K = !1;
            var b = Ao(N().R, "rmmt") == 1,
                c = !!a.B("isViewable");
            (b ? !c : 1) && tp().setTimeout(fq(524, function() {
                a.K || (Pu(a), gq(540, Error()), a.J = "mt", gr(a, "w"))
            }), 500);
            Qu(a);
            Ju(a, a.j.Fa.AFMA_LIDAR, Ru)
        },
        Qu = function(a) {
            var b = Ao(N().R, "sneio") == 1,
                c = a.j.Fa.AFMA_LIDAR_EXP_1 !== void 0,
                d =
                a.j.Fa.AFMA_LIDAR_EXP_2 !== void 0;
            (b = b && d) && (a.j.Fa.AFMA_LIDAR_EXP_2 = !0);
            c && (a.j.Fa.AFMA_LIDAR_EXP_1 = !b)
        },
        Pu = function(a) {
            a.B("removeEventListener", a.j.Fa.AFMA_LIDAR, Ru);
            a.M = !1
        };
    Iu.prototype.U = function() {
        var a = ar(),
            b = Su(this, "getMaxSize");
        a.g = new I(0, b.width, b.height, 0)
    };
    Iu.prototype.V = function() {
        ar().A = Su(this, "getScreenSize")
    };
    var Su = function(a, b) {
        if (a.B("getState") === "loading") return new Fk(-1, -1);
        b = a.B(b);
        if (!b) return new Fk(-1, -1);
        a = parseInt(b.width, 10);
        b = parseInt(b.height, 10);
        return isNaN(a) || isNaN(b) ? new Fk(-1, -1) : new Fk(a, b)
    };
    Iu.prototype.dispose = function() {
        Pu(this);
        er.prototype.dispose.call(this)
    };
    var Mu = function() {
            try {
                var a = J(Iu);
                a.B("removeEventListener", "ready", Mu);
                Nu(a)
            } catch (b) {
                gq(541, b)
            }
        },
        Ru = function(a, b) {
            try {
                var c = J(Iu);
                c.K = !0;
                var d = a ? new I(a.y, a.x + a.width, a.y + a.height, a.x) : new I(0, 0, 0, 0);
                var e = nq(),
                    f = br();
                var g = new pq(e, f, c);
                g.g = d;
                g.volume = b;
                c.jb(g)
            } catch (h) {
                gq(542, h)
            }
        },
        Lu = function(a) {
            var b = N(),
                c = J(Iu);
            a && !b.o && (b.o = !0, c.ga = !0, c.J && gr(c, "w", !0))
        };
    var Cp = new function(a, b) {
        this.key = a;
        this.defaultValue = b === void 0 ? !1 : b;
        this.valueType = "boolean"
    }("45378663");
    var Uu = function() {
        this.l = this.ua = !1;
        this.g = this.j = null;
        var a = {};
        this.P = (a.start = this.Dg, a.firstquartile = this.yg, a.midpoint = this.Ag, a.thirdquartile = this.Eg, a.complete = this.vg, a.error = this.wg, a.pause = this.Rd, a.resume = this.Ze, a.skip = this.Cg, a.viewable_impression = this.Na, a.mute = this.Lb, a.unmute = this.Lb, a.fullscreen = this.zg, a.exitfullscreen = this.xg, a.fully_viewable_audible_half_duration_impression = this.Na, a.measurable_impression = this.Na, a.abandon = this.Rd, a.engagedview = this.Na, a.impression = this.Na, a.creativeview =
            this.Na, a.progress = this.Lb, a.custom_metric_viewable = this.Na, a.bufferstart = this.Rd, a.bufferfinish = this.Ze, a.audio_measurable = this.Na, a.audio_audible = this.Na, a);
        a = {};
        this.V = (a.overlay_resize = this.Bg, a.abandon = this.Fd, a.close = this.Fd, a.collapse = this.Fd, a.overlay_unmeasurable_impression = function(b) {
            return nt(b, "overlay_unmeasurable_impression", br())
        }, a.overlay_viewable_immediate_impression = function(b) {
            return nt(b, "overlay_viewable_immediate_impression", br())
        }, a.overlay_unviewable_impression = function(b) {
            return nt(b,
                "overlay_unviewable_impression", br())
        }, a.overlay_viewable_end_of_session_impression = function(b) {
            return nt(b, "overlay_viewable_end_of_session_impression", br())
        }, a);
        N().j = 3;
        Tu(this);
        this.J = null
    };
    Uu.prototype.A = function(a) {
        is(a, !1);
        Ht(a)
    };
    Uu.prototype.L = function() {};
    var Vu = function(a, b, c, d) {
        a = a.B(null, d, !0, b);
        a.A = c;
        It([a]);
        return a
    };
    Uu.prototype.B = function(a, b, c, d) {
        var e = this;
        a = new Zs(O, a, c ? b : -1, 7, this.ud(), this.Be());
        a.ma = d;
        yo(a.R);
        zo(a.R, "queryid", a.ma);
        a.Td("");
        ns(a, function() {
            return e.M.apply(e, ra(Ma.apply(0, arguments)))
        }, function() {
            return e.U.apply(e, ra(Ma.apply(0, arguments)))
        });
        (d = J(Kt).g) && js(a, d);
        this.J && (a.W && (a.W.B = this.J), this.J = null);
        a.ta.nb && J(Xt);
        return a
    };
    var Wu = function(a, b, c) {
            go(b);
            var d = a.g;
            Sb(b, function(e) {
                var f = Vb(e.j, function(g) {
                    var h = vu(g);
                    if (h == null) g = null;
                    else if (g = new uu, h.visible != null && (g.g = h.visible / 100), h.audible != null && (g.j = h.audible == 1), h.time != null) {
                        var k = h.timetype == "mtos" ? "mtos" : "tos",
                            l = vb(h.time, "%") ? "%" : "ms";
                        h = parseInt(h.time, 10);
                        l == "%" && (h /= 100);
                        l == "ms" ? (g.l = h, g.o = -1) : (g.l = -1, g.o = h);
                        g.A = k === void 0 ? "tos" : k
                    }
                    return g
                });
                Xb(f, function(g) {
                    return g == null
                }) || ft(c, new xu(e.id, e.event, f, d))
            })
        },
        Xu = function() {
            var a = [],
                b = N();
            a.push(J(Wt));
            Ao(b.R, "mvp_lv") && a.push(J(Iu));
            b = [new Fu, new Hu];
            b.push(new Nt(a));
            b.push(new Ut(O));
            return b
        },
        Zu = function(a) {
            if (!a.ua) {
                a.ua = !0;
                try {
                    var b = nq(),
                        c = N(),
                        d = ar();
                    jq = b;
                    c.l = 79463069;
                    a.j !== "o" && (gu = sj(O));
                    if (up()) {
                        Zt.g.ue = 0;
                        Zt.g.Gd = nq() - b;
                        var e = Xu(),
                            f = J(Kt);
                        f.j = e;
                        Lt(f, function() {
                            Yu()
                        }) ? Zt.done || (eu(), hr(f.g.g, a), au()) : d.l ? Yu() : au()
                    } else iu = !0
                } catch (g) {
                    throw Et.reset(), g;
                }
            }
        },
        $u = function(a) {
            Zt.j.cancel();
            hu = a;
            Zt.done = !0
        },
        av = function(a) {
            if (a.j) return a.j;
            var b = J(Kt).g;
            if (b) switch (b.getName()) {
                case "nis":
                    a.j =
                        "n";
                    break;
                case "gsv":
                    a.j = "m"
            }
            a.j || (a.j = "h");
            return a.j
        },
        bv = function(a, b, c) {
            if (a.g == null) return b.Mb |= 4, !1;
            a = a.g.report(c, b);
            b.Mb |= a;
            return a == 0
        };
    Uu.prototype.Gb = function(a) {
        switch (a.Ra()) {
            case 0:
                if (a = J(Kt).g) a = a.g, cc(a.A, this), a.F && this.Oa() && jr(a);
                Yu();
                break;
            case 2:
                au()
        }
    };
    Uu.prototype.jb = function() {};
    Uu.prototype.Oa = function() {
        return !1
    };
    var Yu = function() {
        var a = [new Ut(O)],
            b = J(Kt);
        b.j = a;
        Lt(b, function() {
            $u("i")
        }) ? Zt.done || (eu(), au()) : $u("i")
    };
    Uu.prototype.U = function(a, b) {
        a.Sa = !0;
        switch (a.za()) {
            case 1:
                cv(a, b);
                break;
            case 2:
                this.Yd(a)
        }
        this.ce(a)
    };
    var cv = function(a, b) {
        if (!a.Qa) {
            var c = nt(a, "start", br());
            c = a.Sd.g(c).g;
            var d = {
                id: "lidarv"
            };
            d.r = b;
            d.sv = "966";
            nu !== null && (d.v = nu);
            Zi(c, function(e, f) {
                return d[e] = e == "mtos" || e == "tos" ? f : encodeURIComponent(f)
            });
            b = ju();
            Zi(b, function(e, f) {
                return d[e] = encodeURIComponent(f)
            });
            b = "//pagead2.googlesyndication.com/pagead/gen_204?" + vr(tr(new rr, d));
            yr(b);
            a.Qa = !0
        }
    };
    m = Uu.prototype;
    m.Dg = function(a) {
        var b = a.C(a);
        b && (b = b.volume, a.wa = Sq(b) && b > 0);
        kt(a, 0);
        return nt(a, "start", br())
    };
    m.Lb = function(a, b, c) {
        bu(Zt, [a], !br());
        return this.Na(a, b, c)
    };
    m.Na = function(a, b, c) {
        return nt(a, c, br())
    };
    m.yg = function(a) {
        return dv(a, "firstquartile", 1)
    };
    m.Ag = function(a) {
        a.ga = !0;
        return dv(a, "midpoint", 2)
    };
    m.Eg = function(a) {
        return dv(a, "thirdquartile", 3)
    };
    m.vg = function(a) {
        var b = dv(a, "complete", 4);
        $s(a);
        return b
    };
    m.wg = function(a) {
        a.la = 3;
        return nt(a, "error", br())
    };
    var dv = function(a, b, c) {
        bu(Zt, [a], !br());
        kt(a, c);
        c != 4 && jt(a.M, c, a.Ic);
        return nt(a, b, br())
    };
    m = Uu.prototype;
    m.Ze = function(a, b, c) {
        b = br();
        a.la != 2 || b || (a.pa().J = nq());
        bu(Zt, [a], !b);
        a.la == 2 && (a.la = 1);
        return nt(a, c, b)
    };
    m.Cg = function(a, b) {
        b = this.Lb(a, b || {}, "skip");
        $s(a);
        return b
    };
    m.zg = function(a, b) {
        is(a, !0);
        return this.Lb(a, b || {}, "fullscreen")
    };
    m.xg = function(a, b) {
        is(a, !1);
        return this.Lb(a, b || {}, "exitfullscreen")
    };
    m.Rd = function(a, b, c) {
        b = a.pa();
        b.aa = Ns(b, nq(), a.la != 1);
        bu(Zt, [a], !br());
        a.la == 1 && (a.la = 2);
        return nt(a, c, br())
    };
    m.Bg = function(a) {
        bu(Zt, [a], !br());
        return a.j()
    };
    m.Fd = function(a) {
        bu(Zt, [a], !br());
        this.We(a);
        $s(a);
        return a.j()
    };
    var Tu = function(a) {
            fu(function() {
                var b = ev();
                a.j != null && (b.sdk = a.j);
                var c = J(Kt);
                c.g != null && (b.avms = c.g.getName());
                return b
            })
        },
        fv = function(a, b, c, d) {
            var e = Ct(Et, c);
            e !== null && e.ma !== b && (a.A(e), e = null);
            e || (b = a.B(c, nq(), !1, b), Et.j.length == 0 && (N().l = 79463069), Jt([b]), e = b, e.A = av(a), d && (e.pb = d));
            return e
        };
    Uu.prototype.M = function() {};
    var hv = function(a, b) {
        b.F = 0;
        for (var c in rq) a[c] == null && (b.F |= rq[c]);
        gv(a, "currentTime");
        gv(a, "duration")
    };
    m = Uu.prototype;
    m.Yd = function() {};
    m.We = function() {};
    m.qe = function() {};
    m.ce = function() {};
    m.wd = function() {};
    m.Be = function() {
        this.g || (this.g = this.wd());
        return this.g == null || this.l ? new Ss : new Du(this.g)
    };
    m.ud = function() {
        return new yu
    };
    var gv = function(a, b) {
            var c = a[b];
            c !== void 0 && c > 0 && (a[b] = Math.floor(c * 1E3))
        },
        ev = function() {
            var a = ar(),
                b = {},
                c = {},
                d = {};
            return Object.assign({}, (b.sv = "966", b), nu !== null && (c.v = nu, c), (d["if"] = a.l ? "1" : "0", d.nas = String(Et.g.length), d))
        };
    var iv = function(a) {
        Ps.call(this, "audio_audible", a)
    };
    w(iv, Ps);
    iv.prototype.g = function(a) {
        return a.Gc() == 4
    };
    var jv = function(a) {
        Qs.call(this, "audio_measurable", a)
    };
    w(jv, Qs);
    jv.prototype.g = function(a) {
        a = a.Gc();
        return a == 3 || a == 4
    };
    var kv = function() {
        Au.apply(this, arguments)
    };
    w(kv, Au);
    kv.prototype.j = function() {
        return new jv(this.g)
    };
    kv.prototype.l = function() {
        return [new iv(this.g)]
    };
    var lv = function() {};
    w(lv, Fs);
    lv.prototype.g = function(a) {
        a && (a.e === 28 && (a = Object.assign({}, a, {
            avas: 3
        })), a.vs === 4 || a.vs === 5) && (a = Object.assign({}, a, {
            vs: 3
        }));
        var b = new Es;
        b.g = Gs(a, Cs);
        b.j = Gs(a, Ds);
        return b
    };
    var mv = function(a) {
        this.j = a
    };
    mv.prototype.report = function(a, b) {
        var c = this.g(b);
        if (typeof c === "function") {
            var d = {};
            var e = {};
            d = Object.assign({}, nu !== null && (d.v = nu, d), (e.sv = "966", e.cb = mu, e.e = nv(a), e));
            e = nt(b, a, br());
            ui(d, e);
            b.nf[a] = e;
            d = b.za() == 2 ? xr(d).join("&") : b.Sd.g(d).g;
            try {
                return c(b.ma, d, a), 0
            } catch (f) {
                return 2
            }
        } else return 1
    };
    var nv = function(a) {
        var b = qu(a) ? "custom_metric_viewable" : a;
        a = oi(function(c) {
            return c == b
        });
        return vq[a]
    };
    mv.prototype.g = function() {
        return Sa(this.j)
    };
    var ov = function(a, b) {
        this.j = a;
        this.l = b
    };
    w(ov, mv);
    ov.prototype.g = function(a) {
        if (!a.pb) return mv.prototype.g.call(this, a);
        if (this.l[a.pb]) return function() {};
        gq(393, Error());
        return null
    };
    var pv = function() {
        Uu.call(this);
        this.G = void 0;
        this.H = null;
        this.F = !1;
        this.o = {};
        this.K = 0;
        this.C = "ACTIVE_VIEW_TRAFFIC_TYPE_UNSPECIFIED"
    };
    w(pv, Uu);
    pv.prototype.L = function(a, b) {
        var c = this,
            d = J(Kt);
        if (d.g != null) switch (d.g.getName()) {
            case "nis":
                var e = qv(this, a, b);
                break;
            case "gsv":
                e = rv(this, a, b);
                break;
            case "exc":
                e = tv(this, a)
        }
        e || (b.opt_overlayAdElement ? e = void 0 : b.opt_adElement && (e = fv(this, a, b.opt_adElement, b.opt_osdId)));
        e && e.za() == 1 && (e.C == Ph && (e.C = function(f) {
            return c.qe(f)
        }), uv(this, e, b));
        return e
    };
    var uv = function(a, b, c) {
        c = c.opt_configurable_tracking_events;
        a.g != null && Array.isArray(c) && Wu(a, c, b)
    };
    pv.prototype.qe = function(a) {
        a.j = 0;
        a.P = 0;
        if (a.A == "h" || a.A == "n") {
            var b;
            N();
            if (a.pb && vv(this)) {
                var c = this.o[a.pb];
                c ? b = function(e) {
                    return wv(c, e)
                } : c !== null && gq(379, Error())
            } else b = Sa("ima.common.getVideoMetadata");
            if (typeof b === "function") try {
                var d = b(a.ma)
            } catch (e) {
                a.j |= 4
            } else a.j |= 2
        } else if (a.A == "b")
            if (b = Sa("ytads.bulleit.getVideoMetadata"), typeof b === "function") try {
                d = b(a.ma)
            } catch (e) {
                a.j |= 4
            } else a.j |= 2;
            else if (a.A == "ml")
            if (b = Sa("ima.common.getVideoMetadata"), typeof b === "function") try {
                d = b(a.ma)
            } catch (e) {
                a.j |=
                    4
            } else a.j |= 2;
            else a.j |= 1;
        a.j || (d === void 0 ? a.j |= 8 : d === null ? a.j |= 16 : qi(d) ? a.j |= 32 : d.errorCode != null && (a.P = d.errorCode, a.j |= 64));
        d == null && (d = {});
        hv(d, a);
        Sq(d.volume) && Sq(this.G) && (d.volume *= this.G);
        return d
    };
    var rv = function(a, b, c) {
            var d = Bt(Et, b);
            d || (d = c.opt_nativeTime || -1, d = Vu(a, b, av(a), d), c.opt_osdId && (d.pb = c.opt_osdId));
            return d
        },
        qv = function(a, b, c) {
            var d = Bt(Et, b);
            d || (d = Vu(a, b, "n", c.opt_nativeTime || -1));
            return d
        },
        tv = function(a, b) {
            var c = Bt(Et, b);
            c || (c = Vu(a, b, "h", -1));
            return c
        };
    pv.prototype.wd = function() {
        if (vv(this)) return new ov("ima.common.triggerExternalActivityEvent", this.o);
        var a = xv(this);
        return a != null ? new mv(a) : null
    };
    var xv = function(a) {
        N();
        switch (av(a)) {
            case "b":
                return "ytads.bulleit.triggerExternalActivityEvent";
            case "n":
                return "ima.bridge.triggerExternalActivityEvent";
            case "h":
            case "m":
            case "ml":
                return "ima.common.triggerExternalActivityEvent"
        }
        return null
    };
    pv.prototype.Yd = function(a) {
        !a.g && a.Sa && bv(this, a, "overlay_unmeasurable_impression") && (a.g = !0)
    };
    pv.prototype.We = function(a) {
        a.df && (a.Ua() ? bv(this, a, "overlay_viewable_end_of_session_impression") : bv(this, a, "overlay_unviewable_impression"), a.df = !1)
    };
    var yv = function(a, b, c, d) {
        c = c === void 0 ? {} : c;
        var e = {};
        ui(e, {
            opt_adElement: void 0,
            opt_fullscreen: void 0
        }, c);
        var f = a.L(b, c);
        c = f ? f.Sd : a.ud();
        if (e.opt_bounds) return c.g(pu("ol", d));
        if (d !== void 0)
            if (ou(d) !== void 0)
                if (iu) a = pu("ue", d);
                else if (Zu(a), hu == "i") a = pu("i", d), a["if"] = 0;
        else if (b = a.L(b, e)) {
            b: {
                hu == "i" && (b.Sa = !0, a.ce(b));f = e.opt_fullscreen;f !== void 0 && is(b, !!f);
                var g;
                if (f = !ar().j && !Wq()) tp(),
                f = Uk(Fo) === 0;
                if (g = f) {
                    switch (b.za()) {
                        case 1:
                            cv(b, "pv");
                            break;
                        case 2:
                            a.Yd(b)
                    }
                    $u("pv")
                }
                f = d.toLowerCase();
                if (g = !g) c: {
                    if (Ao(N().R,
                            "ssmol") && (g = a.l, f === "loaded")) break c;g = bc(sq, f)
                }
                if (g && b.la == 0) {
                    hu != "i" && (Zt.done = !1);
                    g = e !== void 0 ? e.opt_nativeTime : void 0;
                    lq = g = typeof g === "number" ? g : nq();
                    b.Tb = !0;
                    var h = br();
                    b.la = 1;
                    b.ia = {};
                    b.ia.start = !1;
                    b.ia.firstquartile = !1;
                    b.ia.midpoint = !1;
                    b.ia.thirdquartile = !1;
                    b.ia.complete = !1;
                    b.ia.resume = !1;
                    b.ia.pause = !1;
                    b.ia.skip = !1;
                    b.ia.mute = !1;
                    b.ia.unmute = !1;
                    b.ia.viewable_impression = !1;
                    b.ia.measurable_impression = !1;
                    b.ia.fully_viewable_audible_half_duration_impression = !1;
                    b.ia.fullscreen = !1;
                    b.ia.exitfullscreen = !1;
                    b.xd = 0;
                    h || (b.pa().J = g);
                    bu(Zt, [b], !h)
                }(g = b.Ab[f]) && b.ha.reportEvent(g);Ao(N().R, "fmd") || bc(tq, f) && b.Wa && b.Wa.j(b, null);
                switch (b.za()) {
                    case 1:
                        var k = qu(f) ? a.P.custom_metric_viewable : a.P[f];
                        break;
                    case 2:
                        k = a.V[f]
                }
                if (k && (d = k.call(a, b, e, d), Ao(N().R, "fmd") && bc(tq, f) && b.Wa && b.Wa.j(b, null), d !== void 0)) {
                    e = pu(void 0, f);
                    ui(e, d);
                    d = e;
                    break b
                }
                d = void 0
            }
            b.la == 3 && a.A(b);a = d
        }
        else a = pu("nf", d);
        else a = void 0;
        else iu ? a = pu("ue") : f ? (a = pu(), ui(a, mt(f, !0, !1, !1))) : a = pu("nf");
        return typeof a === "string" ? c.g() : c.g(a)
    };
    pv.prototype.M = function(a) {
        this.l && a.za() == 1 && zv(this, a)
    };
    pv.prototype.ce = function(a) {
        this.l && a.za() == 1 && zv(this, a)
    };
    var zv = function(a, b) {
            var c;
            if (b.pb && vv(a)) {
                var d = a.o[b.pb];
                d ? c = function(f, g) {
                    Av(d, f, g)
                } : d !== null && gq(379, Error())
            } else c = Sa("ima.common.triggerViewabilityMeasurementUpdate");
            if (typeof c === "function") {
                var e = ht(b);
                e.nativeVolume = a.G;
                c(b.ma, e)
            }
        },
        vv = function(a) {
            return (N(), av(a) != "h" && av(a) != "m") ? !1 : a.K != 0
        };
    pv.prototype.B = function(a, b, c, d) {
        if (Dp()) {
            var e = Ao(N().R, "mm"),
                f = {};
            (e = (f[jo.rf] = "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO", f[jo.VIDEO] = "ACTIVE_VIEW_TRAFFIC_TYPE_VIDEO", f)[e]) && e && (this.C = e);
            this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_UNSPECIFIED" && gq(1044, Error())
        }
        a = Uu.prototype.B.call(this, a, b, c, d);
        this.F && (b = this.H, a.o == null && (a.o = new qs), b.g[a.ma] = a.o, a.o.A = qt);
        return a
    };
    pv.prototype.A = function(a) {
        a && a.za() == 1 && this.F && delete this.H.g[a.ma];
        return Uu.prototype.A.call(this, a)
    };
    pv.prototype.Be = function() {
        this.g || (this.g = this.wd());
        return this.g == null || this.l ? new Ss : this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO" ? new kv(this.g) : new Du(this.g)
    };
    pv.prototype.ud = function() {
        return this.C === "ACTIVE_VIEW_TRAFFIC_TYPE_AUDIO" ? new lv : new yu
    };
    var Bv = function(a) {
            var b = {};
            return b.viewability = a.g, b.googleViewability = a.j, b
        },
        Cv = function(a, b, c) {
            c = c === void 0 ? {} : c;
            a = yv(J(pv), b, c, a);
            return Bv(a)
        },
        Dv = fq(193, Cv, void 0, ev);
    z("Goog_AdSense_Lidar_sendVastEvent", Dv);
    var Ev = fq(194, function(a, b) {
        b = b === void 0 ? {} : b;
        a = yv(J(pv), a, b);
        return Bv(a)
    });
    z("Goog_AdSense_Lidar_getViewability", Ev);
    var Fv = fq(195, function() {
        return vp()
    });
    z("Goog_AdSense_Lidar_getUrlSignalsArray", Fv);
    var Gv = fq(196, function() {
        return JSON.stringify(vp())
    });
    z("Goog_AdSense_Lidar_getUrlSignalsList", Gv);
    y.console && typeof y.console.log === "function" && db(y.console.log, y.console);
    var Hv = function(a) {
        for (var b = [], c = a = Po(a.ownerDocument); c != a.top; c = c.parent)
            if (c.frameElement) b.push(c.frameElement);
            else break;
        return b
    };
    var Iv = function(a, b) {
        this.type = a;
        this.currentTarget = this.target = b;
        this.defaultPrevented = this.j = !1
    };
    Iv.prototype.stopPropagation = function() {
        this.j = !0
    };
    Iv.prototype.preventDefault = function() {
        this.defaultPrevented = !0
    };
    var Jv = function() {
        if (!y.addEventListener || !Object.defineProperty) return !1;
        var a = !1,
            b = Object.defineProperty({}, "passive", {
                get: function() {
                    a = !0
                }
            });
        try {
            var c = function() {};
            y.addEventListener("test", c, b);
            y.removeEventListener("test", c, b)
        } catch (d) {}
        return a
    }();
    var Kv = function(a, b) {
        Iv.call(this, a ? a.type : "");
        this.relatedTarget = this.currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
        this.key = "";
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.state = null;
        this.pointerId = 0;
        this.pointerType = "";
        this.g = null;
        a && this.init(a, b)
    };
    ib(Kv, Iv);
    Kv.prototype.init = function(a, b) {
        var c = this.type = a.type,
            d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.currentTarget = b;
        b = a.relatedTarget;
        b || (c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement));
        this.relatedTarget = b;
        d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY =
            a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
        this.button = a.button;
        this.key = a.key || "";
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = a.pointerType;
        this.state = a.state;
        this.g = a;
        a.defaultPrevented && Kv.Ia.preventDefault.call(this)
    };
    Kv.prototype.stopPropagation = function() {
        Kv.Ia.stopPropagation.call(this);
        this.g.stopPropagation ? this.g.stopPropagation() : this.g.cancelBubble = !0
    };
    Kv.prototype.preventDefault = function() {
        Kv.Ia.preventDefault.call(this);
        var a = this.g;
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    };
    var Lv = "closure_listenable_" + (Math.random() * 1E6 | 0),
        Mv = function(a) {
            return !(!a || !a[Lv])
        };
    var Nv = 0;
    var Ov = function(a, b, c, d, e) {
            this.listener = a;
            this.proxy = null;
            this.src = b;
            this.type = c;
            this.capture = !!d;
            this.Jc = e;
            this.key = ++Nv;
            this.kc = this.zc = !1
        },
        Pv = function(a) {
            a.kc = !0;
            a.listener = null;
            a.proxy = null;
            a.src = null;
            a.Jc = null
        };
    var Qv = function(a) {
        this.src = a;
        this.g = {};
        this.j = 0
    };
    Qv.prototype.add = function(a, b, c, d, e) {
        var f = a.toString();
        a = this.g[f];
        a || (a = this.g[f] = [], this.j++);
        var g = Rv(a, b, d, e);
        g > -1 ? (b = a[g], c || (b.zc = !1)) : (b = new Ov(b, this.src, f, !!d, e), b.zc = c, a.push(b));
        return b
    };
    Qv.prototype.remove = function(a, b, c, d) {
        a = a.toString();
        if (!(a in this.g)) return !1;
        var e = this.g[a];
        b = Rv(e, b, c, d);
        return b > -1 ? (Pv(e[b]), dc(e, b), e.length == 0 && (delete this.g[a], this.j--), !0) : !1
    };
    var Sv = function(a, b) {
        var c = b.type;
        c in a.g && cc(a.g[c], b) && (Pv(b), a.g[c].length == 0 && (delete a.g[c], a.j--))
    };
    Qv.prototype.Vb = function(a, b, c, d) {
        a = this.g[a.toString()];
        var e = -1;
        a && (e = Rv(a, b, c, d));
        return e > -1 ? a[e] : null
    };
    var Rv = function(a, b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e];
            if (!f.kc && f.listener == b && f.capture == !!c && f.Jc == d) return e
        }
        return -1
    };
    var Tv = "closure_lm_" + (Math.random() * 1E6 | 0),
        Uv = {},
        Vv = 0,
        Xv = function(a, b, c, d, e) {
            if (d && d.once) return Wv(a, b, c, d, e);
            if (Array.isArray(b)) {
                for (var f = 0; f < b.length; f++) Xv(a, b[f], c, d, e);
                return null
            }
            c = Yv(c);
            return Mv(a) ? a.listen(b, c, Wa(d) ? !!d.capture : !!d, e) : Zv(a, b, c, !1, d, e)
        },
        Zv = function(a, b, c, d, e, f) {
            if (!b) throw Error("Invalid event type");
            var g = Wa(e) ? !!e.capture : !!e,
                h = $v(a);
            h || (a[Tv] = h = new Qv(a));
            c = h.add(b, c, d, g, f);
            if (c.proxy) return c;
            d = aw();
            c.proxy = d;
            d.src = a;
            d.listener = c;
            if (a.addEventListener) Jv || (e = g), e ===
                void 0 && (e = !1), a.addEventListener(b.toString(), d, e);
            else if (a.attachEvent) a.attachEvent(bw(b.toString()), d);
            else if (a.addListener && a.removeListener) a.addListener(d);
            else throw Error("addEventListener and attachEvent are unavailable.");
            Vv++;
            return c
        },
        aw = function() {
            var a = cw,
                b = function(c) {
                    return a.call(b.src, b.listener, c)
                };
            return b
        },
        Wv = function(a, b, c, d, e) {
            if (Array.isArray(b)) {
                for (var f = 0; f < b.length; f++) Wv(a, b[f], c, d, e);
                return null
            }
            c = Yv(c);
            return Mv(a) ? a.dc(b, c, Wa(d) ? !!d.capture : !!d, e) : Zv(a, b, c, !0, d,
                e)
        },
        dw = function(a, b, c, d, e) {
            if (Array.isArray(b))
                for (var f = 0; f < b.length; f++) dw(a, b[f], c, d, e);
            else d = Wa(d) ? !!d.capture : !!d, c = Yv(c), Mv(a) ? a.rb(b, c, d, e) : a && (a = $v(a)) && (b = a.Vb(b, c, d, e)) && ew(b)
        },
        ew = function(a) {
            if (typeof a !== "number" && a && !a.kc) {
                var b = a.src;
                if (Mv(b)) Sv(b.o, a);
                else {
                    var c = a.type,
                        d = a.proxy;
                    b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(bw(c), d) : b.addListener && b.removeListener && b.removeListener(d);
                    Vv--;
                    (c = $v(b)) ? (Sv(c, a), c.j == 0 && (c.src = null, b[Tv] = null)) :
                    Pv(a)
                }
            }
        },
        bw = function(a) {
            return a in Uv ? Uv[a] : Uv[a] = "on" + a
        },
        cw = function(a, b) {
            if (a.kc) a = !0;
            else {
                b = new Kv(b, this);
                var c = a.listener,
                    d = a.Jc || a.src;
                a.zc && ew(a);
                a = c.call(d, b)
            }
            return a
        },
        $v = function(a) {
            a = a[Tv];
            return a instanceof Qv ? a : null
        },
        fw = "__closure_events_fn_" + (Math.random() * 1E9 >>> 0),
        Yv = function(a) {
            if (typeof a === "function") return a;
            a[fw] || (a[fw] = function(b) {
                return a.handleEvent(b)
            });
            return a[fw]
        };
    var Q = function() {
        P.call(this);
        this.o = new Qv(this);
        this.Cb = this;
        this.da = null
    };
    ib(Q, P);
    Q.prototype[Lv] = !0;
    m = Q.prototype;
    m.addEventListener = function(a, b, c, d) {
        Xv(this, a, b, c, d)
    };
    m.removeEventListener = function(a, b, c, d) {
        dw(this, a, b, c, d)
    };
    m.dispatchEvent = function(a) {
        var b, c = this.da;
        if (c)
            for (b = []; c; c = c.da) b.push(c);
        c = this.Cb;
        var d = a.type || a;
        if (typeof a === "string") a = new Iv(a, c);
        else if (a instanceof Iv) a.target = a.target || c;
        else {
            var e = a;
            a = new Iv(d, c);
            ui(a, e)
        }
        e = !0;
        var f;
        if (b)
            for (f = b.length - 1; !a.j && f >= 0; f--) {
                var g = a.currentTarget = b[f];
                e = gw(g, d, !0, a) && e
            }
        a.j || (g = a.currentTarget = c, e = gw(g, d, !0, a) && e, a.j || (e = gw(g, d, !1, a) && e));
        if (b)
            for (f = 0; !a.j && f < b.length; f++) g = a.currentTarget = b[f], e = gw(g, d, !1, a) && e;
        return e
    };
    m.O = function() {
        Q.Ia.O.call(this);
        if (this.o) {
            var a = this.o,
                b = 0,
                c;
            for (c in a.g) {
                for (var d = a.g[c], e = 0; e < d.length; e++) ++b, Pv(d[e]);
                delete a.g[c];
                a.j--
            }
        }
        this.da = null
    };
    m.listen = function(a, b, c, d) {
        return this.o.add(String(a), b, !1, c, d)
    };
    m.dc = function(a, b, c, d) {
        return this.o.add(String(a), b, !0, c, d)
    };
    m.rb = function(a, b, c, d) {
        this.o.remove(String(a), b, c, d)
    };
    var gw = function(a, b, c, d) {
        b = a.o.g[String(b)];
        if (!b) return !0;
        b = b.concat();
        for (var e = !0, f = 0; f < b.length; ++f) {
            var g = b[f];
            if (g && !g.kc && g.capture == c) {
                var h = g.listener,
                    k = g.Jc || g.src;
                g.zc && Sv(a.o, g);
                e = h.call(k, d) !== !1 && e
            }
        }
        return e && !d.defaultPrevented
    };
    Q.prototype.Vb = function(a, b, c, d) {
        return this.o.Vb(String(a), b, c, d)
    };
    var hw = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? function(a) {
        return a && AsyncContext.Snapshot.wrap(a)
    } : function(a) {
        return a
    };
    var iw = function(a, b) {
        this.l = a;
        this.o = b;
        this.j = 0;
        this.g = null
    };
    iw.prototype.get = function() {
        if (this.j > 0) {
            this.j--;
            var a = this.g;
            this.g = a.next;
            a.next = null
        } else a = this.l();
        return a
    };
    var jw = function(a, b) {
        a.o(b);
        a.j < 100 && (a.j++, b.next = a.g, a.g = b)
    };
    var kw = function() {
        this.j = this.g = null
    };
    kw.prototype.add = function(a, b) {
        var c = lw.get();
        c.set(a, b);
        this.j ? this.j.next = c : this.g = c;
        this.j = c
    };
    kw.prototype.remove = function() {
        var a = null;
        this.g && (a = this.g, this.g = this.g.next, this.g || (this.j = null), a.next = null);
        return a
    };
    var lw = new iw(function() {
            return new mw
        }, function(a) {
            return a.reset()
        }),
        mw = function() {
            this.next = this.g = this.j = null
        };
    mw.prototype.set = function(a, b) {
        this.j = a;
        this.g = b;
        this.next = null
    };
    mw.prototype.reset = function() {
        this.next = this.g = this.j = null
    };
    var nw, ow = !1,
        pw = new kw,
        rw = function(a, b) {
            nw || qw();
            ow || (nw(), ow = !0);
            pw.add(a, b)
        },
        qw = function() {
            var a = Promise.resolve(void 0);
            nw = function() {
                a.then(tw)
            }
        };

    function tw() {
        for (var a; a = pw.remove();) {
            try {
                a.j.call(a.g)
            } catch (b) {
                ub(b)
            }
            jw(lw, a)
        }
        ow = !1
    };
    var uw = function(a) {
        if (!a) return !1;
        try {
            return !!a.$goog_Thenable
        } catch (b) {
            return !1
        }
    };
    var ww = function(a) {
            this.g = 0;
            this.C = void 0;
            this.o = this.j = this.l = null;
            this.A = this.B = !1;
            if (a != Ph) try {
                var b = this;
                a.call(void 0, function(c) {
                    vw(b, 2, c)
                }, function(c) {
                    vw(b, 3, c)
                })
            } catch (c) {
                vw(this, 3, c)
            }
        },
        xw = function() {
            this.next = this.context = this.j = this.l = this.g = null;
            this.o = !1
        };
    xw.prototype.reset = function() {
        this.context = this.j = this.l = this.g = null;
        this.o = !1
    };
    var yw = new iw(function() {
            return new xw
        }, function(a) {
            a.reset()
        }),
        zw = function(a, b, c) {
            var d = yw.get();
            d.l = a;
            d.j = b;
            d.context = c;
            return d
        };
    ww.prototype.then = function(a, b, c) {
        return Aw(this, hw(typeof a === "function" ? a : null), hw(typeof b === "function" ? b : null), c)
    };
    ww.prototype.$goog_Thenable = !0;
    ww.prototype.J = function(a, b) {
        return Aw(this, null, hw(a), b)
    };
    ww.prototype.catch = ww.prototype.J;
    ww.prototype.cancel = function(a) {
        if (this.g == 0) {
            var b = new Bw(a);
            rw(function() {
                Cw(this, b)
            }, this)
        }
    };
    var Cw = function(a, b) {
            if (a.g == 0)
                if (a.l) {
                    var c = a.l;
                    if (c.j) {
                        for (var d = 0, e = null, f = null, g = c.j; g && (g.o || (d++, g.g == a && (e = g), !(e && d > 1))); g = g.next) e || (f = g);
                        e && (c.g == 0 && d == 1 ? Cw(c, b) : (f ? (d = f, d.next == c.o && (c.o = d), d.next = d.next.next) : Dw(c), Ew(c, e, 3, b)))
                    }
                    a.l = null
                } else vw(a, 3, b)
        },
        Gw = function(a, b) {
            a.j || a.g != 2 && a.g != 3 || Fw(a);
            a.o ? a.o.next = b : a.j = b;
            a.o = b
        },
        Aw = function(a, b, c, d) {
            var e = zw(null, null, null);
            e.g = new ww(function(f, g) {
                e.l = b ? function(h) {
                    try {
                        var k = b.call(d, h);
                        f(k)
                    } catch (l) {
                        g(l)
                    }
                } : f;
                e.j = c ? function(h) {
                    try {
                        var k = c.call(d,
                            h);
                        k === void 0 && h instanceof Bw ? g(h) : f(k)
                    } catch (l) {
                        g(l)
                    }
                } : g
            });
            e.g.l = a;
            Gw(a, e);
            return e.g
        };
    ww.prototype.F = function(a) {
        this.g = 0;
        vw(this, 2, a)
    };
    ww.prototype.G = function(a) {
        this.g = 0;
        vw(this, 3, a)
    };
    var vw = function(a, b, c) {
            if (a.g == 0) {
                a === c && (b = 3, c = new TypeError("Promise cannot resolve to itself"));
                a.g = 1;
                a: {
                    var d = c,
                        e = a.F,
                        f = a.G;
                    if (d instanceof ww) {
                        Gw(d, zw(e || Ph, f || null, a));
                        var g = !0
                    } else if (uw(d)) d.then(e, f, a),
                    g = !0;
                    else {
                        if (Wa(d)) try {
                            var h = d.then;
                            if (typeof h === "function") {
                                Hw(d, h, e, f, a);
                                g = !0;
                                break a
                            }
                        } catch (k) {
                            f.call(a, k);
                            g = !0;
                            break a
                        }
                        g = !1
                    }
                }
                g || (a.C = c, a.g = b, a.l = null, Fw(a), b != 3 || c instanceof Bw || Iw(a, c))
            }
        },
        Hw = function(a, b, c, d, e) {
            var f = !1,
                g = function(k) {
                    f || (f = !0, c.call(e, k))
                },
                h = function(k) {
                    f || (f = !0, d.call(e,
                        k))
                };
            try {
                b.call(a, g, h)
            } catch (k) {
                h(k)
            }
        },
        Fw = function(a) {
            a.B || (a.B = !0, rw(a.L, a))
        },
        Dw = function(a) {
            var b = null;
            a.j && (b = a.j, a.j = b.next, b.next = null);
            a.j || (a.o = null);
            return b
        };
    ww.prototype.L = function() {
        for (var a; a = Dw(this);) Ew(this, a, this.g, this.C);
        this.B = !1
    };
    var Ew = function(a, b, c, d) {
            if (c == 3 && b.j && !b.o)
                for (; a && a.A; a = a.l) a.A = !1;
            if (b.g) b.g.l = null, Jw(b, c, d);
            else try {
                b.o ? b.l.call(b.context) : Jw(b, c, d)
            } catch (e) {
                Kw.call(null, e)
            }
            jw(yw, b)
        },
        Jw = function(a, b, c) {
            b == 2 ? a.l.call(a.context, c) : a.j && a.j.call(a.context, c)
        },
        Iw = function(a, b) {
            a.A = !0;
            rw(function() {
                a.A && Kw.call(null, b)
            })
        },
        Kw = ub,
        Bw = function(a) {
            jb.call(this, a)
        };
    ib(Bw, jb);
    Bw.prototype.name = "cancel";
    var Lw = function(a, b) {
        Q.call(this);
        this.j = a || 1;
        this.g = b || y;
        this.l = db(this.oh, this);
        this.A = Date.now()
    };
    ib(Lw, Q);
    m = Lw.prototype;
    m.enabled = !1;
    m.Ba = null;
    m.setInterval = function(a) {
        this.j = a;
        this.Ba && this.enabled ? (this.stop(), this.start()) : this.Ba && this.stop()
    };
    m.oh = function() {
        if (this.enabled) {
            var a = Date.now() - this.A;
            a > 0 && a < this.j * .8 ? this.Ba = this.g.setTimeout(this.l, this.j - a) : (this.Ba && (this.g.clearTimeout(this.Ba), this.Ba = null), this.dispatchEvent("tick"), this.enabled && (this.stop(), this.start()))
        }
    };
    m.start = function() {
        this.enabled = !0;
        this.Ba || (this.Ba = this.g.setTimeout(this.l, this.j), this.A = Date.now())
    };
    m.stop = function() {
        this.enabled = !1;
        this.Ba && (this.g.clearTimeout(this.Ba), this.Ba = null)
    };
    m.O = function() {
        Lw.Ia.O.call(this);
        this.stop();
        delete this.g
    };
    var Mw = function(a, b) {
            if (typeof a !== "function")
                if (a && typeof a.handleEvent == "function") a = db(a.handleEvent, a);
                else throw Error("Invalid listener argument");
            return Number(b) > 2147483647 ? -1 : y.setTimeout(a, b || 0)
        },
        Nw = function(a, b) {
            var c = null;
            return (new ww(function(d, e) {
                c = Mw(function() {
                    d(b)
                }, a);
                c == -1 && e(Error("Failed to schedule timer."))
            })).J(function(d) {
                y.clearTimeout(c);
                throw d;
            })
        };
    var Ow = function() {
        return Math.round(Date.now() / 1E3)
    };
    var Pw = function() {
        this.g = {};
        return this
    };
    Pw.prototype.remove = function(a) {
        var b = this.g;
        a in b && delete b[a]
    };
    Pw.prototype.set = function(a, b) {
        this.g[a] = b
    };
    var Qw = function(a, b) {
        a.g.eb = si(a.g, "eb", 0) | b
    };
    Pw.prototype.get = function(a) {
        return si(this.g, a, null)
    };
    var Rw = null,
        Sw = function() {
            this.g = {};
            this.j = 0
        },
        Tw = function() {
            Rw || (Rw = new Sw);
            return Rw
        },
        Uw = function(a, b) {
            a.g[b.getName()] = b
        },
        Vw = function(a, b) {
            this.o = a;
            this.l = !0;
            this.g = b
        };
    Vw.prototype.getName = function() {
        return this.o
    };
    Vw.prototype.getValue = function() {
        return this.g
    };
    Vw.prototype.j = function() {
        return String(this.g)
    };
    var Ww = function(a, b) {
        Vw.call(this, String(a), b);
        this.A = a;
        this.g = !!b
    };
    w(Ww, Vw);
    Ww.prototype.j = function() {
        return this.g ? "1" : "0"
    };
    var Xw = function(a, b) {
        Vw.call(this, a, b)
    };
    w(Xw, Vw);
    Xw.prototype.j = function() {
        return this.g ? Math.round(this.g.top) + "." + Math.round(this.g.left) + "." + (Math.round(this.g.top) + Math.round(this.g.height)) + "." + (Math.round(this.g.left) + Math.round(this.g.width)) : ""
    };
    var Yw = function(a) {
        if (a.match(/^-?[0-9]+\.-?[0-9]+\.-?[0-9]+\.-?[0-9]+$/)) {
            a = a.split(".");
            var b = Number(a[0]),
                c = Number(a[1]);
            return new Xw("", new Hk(c, b, Number(a[3]) - c, Number(a[2]) - b))
        }
        return new Xw("", new Hk(0, 0, 0, 0))
    };
    var Zw = function(a) {
            var b = new Hk(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE),
                c = new Hk(0, 0, 0, 0);
            if (!a || 0 == a.length) return c;
            for (var d = 0; d < a.length; d++) {
                a: {
                    var e = b;
                    var f = a[d],
                        g = Math.max(e.left, f.left),
                        h = Math.min(e.left + e.width, f.left + f.width);
                    if (g <= h) {
                        var k = Math.max(e.top, f.top);
                        f = Math.min(e.top + e.height, f.top + f.height);
                        if (k <= f) {
                            e.left = g;
                            e.top = k;
                            e.width = h - g;
                            e.height = f - k;
                            e = !0;
                            break a
                        }
                    }
                    e = !1
                }
                if (!e) return c
            }
            return b
        },
        $w = function(a, b) {
            var c = a.getBoundingClientRect();
            a = Gq(a,
                b);
            return new Hk(Math.round(a.x), Math.round(a.y), Math.round(c.right - c.left), Math.round(c.bottom - c.top))
        },
        ax = function(a, b, c) {
            if (b && c) {
                a: {
                    var d = Math.max(b.left, c.left);
                    var e = Math.min(b.left + b.width, c.left + c.width);
                    if (d <= e) {
                        var f = Math.max(b.top, c.top),
                            g = Math.min(b.top + b.height, c.top + c.height);
                        if (f <= g) {
                            d = new Hk(d, f, e - d, g - f);
                            break a
                        }
                    }
                    d = null
                }
                e = d ? d.height * d.width : 0;f = d ? b.height * b.width : 0;d = d && f ? Math.round(e / f * 100) : 0;Uw(a, new Vw("vp", d));d && d > 0 ? (e = Ik(b), f = Ik(c), e = e.top >= f.top && e.top < f.bottom) : e = !1;Uw(a, new Ww(512,
                    e));d && d > 0 ? (e = Ik(b), f = Ik(c), e = e.bottom <= f.bottom && e.bottom > f.top) : e = !1;Uw(a, new Ww(1024, e));d && d > 0 ? (e = Ik(b), f = Ik(c), e = e.left >= f.left && e.left < f.right) : e = !1;Uw(a, new Ww(2048, e));d && d > 0 ? (b = Ik(b), c = Ik(c), c = b.right <= c.right && b.right > c.left) : c = !1;Uw(a, new Ww(4096, c))
            }
        };
    var bx = function(a, b) {
        var c = 0;
        li(Po(), "ima", "video", "client", "tagged") && (c = 1);
        var d = null;
        a && (d = a());
        if (d) {
            a = Tw();
            a.g = {};
            var e = new Ww(32, !0);
            e.l = !1;
            Uw(a, e);
            e = Po().document;
            e = e.visibilityState || e.webkitVisibilityState || e.mozVisibilityState || e.msVisibilityState || "";
            Uw(a, new Ww(64, e.toLowerCase().substring(e.length - 6) != "hidden" ? !0 : !1));
            a: {
                try {
                    var f = Po().top;
                    try {
                        var g = !!f.location.href || f.location.href === ""
                    } catch (p) {
                        g = !1
                    }
                    if (g) {
                        var h = Hv(d);
                        var k = h && h.length != 0 ? "1" : "0";
                        break a
                    }
                    k = "2";
                    break a
                } catch (p) {
                    k = "2";
                    break a
                }
                k = void 0
            }
            Uw(a, new Ww(256, k == "2"));
            Uw(a, new Ww(128, k == "1"));
            h = g = Po().top;
            k == "2" && (h = Po());
            f = $w(d, h);
            Uw(a, new Xw("er", f));
            try {
                var l = h.document && !h.document.body ? null : No(h || window)
            } catch (p) {
                l = null
            }
            l ? (h = Oo(Jo(h.document).g), Uw(a, new Ww(16384, !!h)), l = h ? new Hk(h.x, h.y, l.width, l.height) : null) : l = null;
            Uw(a, new Xw("vi", l));
            if (l && "1" == k) {
                k = Hv(d);
                d = [];
                for (h = 0; h < k.length; h++)(e = $w(k[h], g)) && d.push(e);
                d.push(l);
                l = Zw(d)
            }
            ax(a, f, l);
            a.j && Uw(a, new Vw("ts", Ow() - a.j));
            a.j = Ow()
        } else a = Tw(), a.g = {}, a.j = Ow(), Uw(a,
            new Ww(32, !1));
        this.l = a;
        this.g = new Pw;
        this.g.set("ve", 4);
        c && Qw(this.g, 1);
        li(Po(), "ima", "video", "client", "crossdomainTag") && Qw(this.g, 4);
        li(Po(), "ima", "video", "client", "sdkTag") && Qw(this.g, 8);
        li(Po(), "ima", "video", "client", "jsTag") && Qw(this.g, 2);
        b && si(b, "fullscreen", !1) && Qw(this.g, 16);
        this.j = b = null;
        if (c && (c = li(Po(), "ima", "video", "client"), c.getEData)) {
            this.j = c.getEData();
            if (c = li(Po(), "ima", "video", "client", "getLastSnapshotFromTop"))
                if (a = c()) this.j.extendWithDataFromTopIframe(a.tagstamp, a.playstamp,
                    a.lactstamp), c = this.l, b = a.er, a = a.vi, b && a && (b = Yw(b).getValue(), a = Yw(a).getValue(), k = null, si(c.g, "er", null) && (k = si(c.g, "er", null).getValue(), k.top += b.top, k.left += b.left, Uw(c, new Xw("er", k))), si(c.g, "vi", null) && (l = si(c.g, "vi", null).getValue(), l.top += b.top, l.left += b.left, d = [], d.push(l), d.push(b), d.push(a), b = Zw(d), ax(c, k, b), Uw(c, new Xw("vi", a))));
            a: {
                if (this.j) {
                    if (this.j.getTagLoadTimestamp) {
                        b = this.j.getTagLoadTimestamp();
                        break a
                    }
                    if (this.j.getTimeSinceTagLoadSeconds) {
                        b = this.j.getTimeSinceTagLoadSeconds();
                        break a
                    }
                }
                b = null
            }
        }
        c = this.g;
        a = window.performance && window.performance.timing && window.performance.timing.domLoading && window.performance.timing.domLoading > 0 ? Math.round(window.performance.timing.domLoading / 1E3) : null;
        c.set.call(c, "td", Ow() - (a != null ? a : b != null ? b : Ow()))
    };
    new Lw(200);
    var cx = function(a, b) {
        try {
            var c = new bx(a, b);
            a = [];
            var d = Number(c.g.get("eb"));
            c.g.remove("eb");
            var e, f = c.g;
            b = [];
            for (var g in f.g) b.push(g + f.g[g]);
            (e = b.join("_")) && a.push(e);
            if (c.j) {
                var h = c.j.serialize();
                h && a.push(h)
            }
            var k, l = c.l;
            e = d;
            f = [];
            e || (e = 0);
            for (var p in l.g) {
                var n = l.g[p];
                if (n instanceof Ww) n.getValue() && (e |= n.A);
                else {
                    var q = l.g[p],
                        t = q.l ? q.j() : "";
                    t && f.push(p + t)
                }
            }
            f.push("eb" + String(e));
            (k = f.join("_")) && a.push(k);
            c.g.set("eb", d);
            return a.join("_")
        } catch (u) {
            return "tle;" + Pi(u.name, 12) + ";" + Pi(u.message,
                40)
        }
    };
    var dx = function(a) {
        this.D = B(a)
    };
    w(dx, H);
    dx.prototype.getId = function() {
        return E(this, 1)
    };
    var ex = [0, Bh];
    var fx = function(a) {
        this.D = B(a)
    };
    w(fx, H);
    var gx = [0, Bh, -3];
    var hx = function(a) {
        this.D = B(a)
    };
    w(hx, H);
    hx.prototype.getWidth = function() {
        return ig(this, 1)
    };
    hx.prototype.getHeight = function() {
        return ig(this, 2)
    };
    var ix = [0, yh, -1];
    var jx = function(a) {
        this.D = B(a)
    };
    w(jx, H);
    var kx = [0, vh, Ah, Bh, -1];
    var lx = function(a) {
        this.D = B(a)
    };
    w(lx, H);
    lx.prototype.getAdId = function() {
        return E(this, 1)
    };
    lx.prototype.getSize = function() {
        return Xf(this, hx, 7)
    };
    lx.prototype.Wb = function() {
        return Xf(this, jx, 9)
    };
    var mx = [0, Bh, vh, Bh, Ch, Gh, ex, ix, vh, kx, Bh, gx];
    var nx = function(a) {
        this.D = B(a)
    };
    w(nx, H);
    var ox = function(a, b) {
            return xg(a, 1, b)
        },
        px = function(a, b) {
            return rg(a, 4, b)
        },
        qx = function(a, b) {
            return tg(a, 2, b)
        };
    var rx = function(a) {
        this.D = B(a)
    };
    w(rx, H);
    var sx = function(a, b) {
            return wg(a, 1, b)
        },
        tx = function(a, b) {
            return dg(a, 3, lx, b)
        },
        ux = function(a, b) {
            return xg(a, 4, b)
        };
    var vx = [0, Gh, yh, Bh, Ah];
    var wx = [0, Bh, vh, Dh, mx, Gh, vx, Ah, Gh, 2, Ch];
    var xx = function(a) {
        this.D = B(a)
    };
    w(xx, H);
    var yx = function(a) {
        this.D = B(a)
    };
    w(yx, H);
    var zx = function(a, b) {
            return cg(a, 2, rx, b)
        },
        Ax = function(a, b) {
            D(a, 5, b)
        },
        Bx = function(a, b) {
            wg(a, 10, b)
        },
        Cx = function(a, b) {
            wg(a, 11, b)
        };
    var Dx = [0, Gh, Dh, wx, Gh, Bh, vx, Bh, Ah, yh, [0, Gh, Ah, vh], Bh, -1];
    var Ex = function(a) {
        this.D = B(a)
    };
    w(Ex, H);
    var Fx = function(a) {
        var b = new yx;
        b = xg(b, 1, 1);
        return cg(a, 1, yx, b)
    };
    Ex.prototype.g = Ih([0, Dh, Dx]);
    var Gx = function(a) {
        this.D = B(a)
    };
    w(Gx, H);
    var Hx = function(a) {
        this.D = B(a)
    };
    w(Hx, H);
    var Ix = function(a) {
        this.D = B(a)
    };
    w(Ix, H);
    var Jx = function(a) {
        this.D = B(a)
    };
    w(Jx, H);
    var Kx = function(a) {
        this.D = B(a)
    };
    w(Kx, H);
    var Lx = function(a) {
        this.D = B(a)
    };
    w(Lx, H);
    var Mx = function(a) {
        this.D = B(a)
    };
    w(Mx, H);
    var Nx = function(a) {
        this.D = B(a)
    };
    w(Nx, H);
    Nx.prototype.getEscapedQemQueryId = function() {
        return E(this, 1)
    };
    var Ox = function(a) {
        this.D = B(a)
    };
    w(Ox, H);
    var Px = function(a) {
        this.D = B(a)
    };
    w(Px, H);
    var Qx = [0, Bh, [0, uh],
        [0, Gh, vh]
    ];
    var Rx = Jh(Px);
    var Sx = function(a) {
        this.D = B(a)
    };
    w(Sx, H);
    var Tx = function(a) {
        var b = new Sx;
        return xg(b, 1, a)
    };
    var Ux = [0, Gh];
    var Vx = function(a) {
        this.D = B(a)
    };
    w(Vx, H);
    var Wx = function(a) {
            var b = new Vx;
            return wg(b, 1, a)
        },
        Xx = function(a) {
            var b = window.Date.now();
            b = Number.isFinite(b) ? Math.round(b) : 0;
            return Af(a, 3, re(b))
        };
    Vx.prototype.getError = function() {
        return Xf(this, Sx, 10)
    };
    Vx.prototype.Za = function(a) {
        return D(this, 10, a)
    };
    var Yx = Kh(Vx);
    var Zx = [0, Bh, -1, vh, yh, -2, vh, th, Ah, Ux, Ah];
    var $x = [0, 1, [0, xh, -2], -1, Bh, -1, Ah, [0, 3, Gh, Bh], vh, Hh, Fh];
    var ay = function(a) {
        this.D = B(a)
    };
    w(ay, H);
    ay.prototype.g = Ih([0, Dh, $x, Dh, Zx]);
    var dy = function() {
        var a = by;
        this.A = cy;
        this.B = "jserror";
        this.j = !0;
        this.g = a === void 0 ? null : a;
        this.l = null;
        this.o = !1;
        this.C = this.Va
    };
    m = dy.prototype;
    m.de = function(a) {
        this.l = a
    };
    m.bf = function(a) {
        this.B = a
    };
    m.ee = function(a) {
        this.j = a
    };
    m.cf = function(a) {
        this.o = a
    };
    m.yb = function(a, b, c) {
        try {
            if (this.g && this.g.l) {
                var d = this.g.start(a.toString(), 3);
                var e = b();
                this.g.end(d)
            } else e = b()
        } catch (h) {
            b = this.j;
            try {
                pl(d), b = this.C(a, new Mh(h, {
                    message: Oh(h)
                }), void 0, c)
            } catch (k) {
                this.Va(217, k)
            }
            if (b) {
                var f, g;
                (f = window.console) == null || (g = f.error) == null || g.call(f, h)
            } else throw h;
        }
        return e
    };
    m.Ud = function(a, b, c, d) {
        var e = this;
        return function() {
            var f = Ma.apply(0, arguments);
            return e.yb(a, function() {
                return b.apply(c, f)
            }, d)
        }
    };
    m.Va = function(a, b, c, d, e) {
        e = e || this.B;
        try {
            var f = new gp;
            lp(f, 1, "context", a);
            Nh(b) || (b = new Mh(b, {
                message: Oh(b)
            }));
            b.msg && lp(f, 2, "msg", b.msg.substring(0, 512));
            var g = b.meta || {};
            if (this.l) try {
                this.l(g)
            } catch (k) {}
            if (d) try {
                d(g)
            } catch (k) {}
            kp(f, 3, [g]);
            var h = fp();
            h.j && lp(f, 4, "top", h.j.url || "");
            kp(f, 5, [{
                url: h.g.url || ""
            }, {
                url: h.g.url ? Yi(h.g.url) : ""
            }]);
            ey(this.A, e, f, this.o, c)
        } catch (k) {
            try {
                ey(this.A, e, {
                    context: "ecmserr",
                    rctx: a,
                    msg: Oh(k),
                    url: h && h.g.url
                }, this.o, c)
            } catch (l) {}
        }
        return this.j
    };
    var fy = function() {
            this.g = Math.random()
        },
        gy = function() {
            var a = cy,
                b = window.google_srt;
            b >= 0 && b <= 1 && (a.g = b)
        },
        ey = function(a, b, c, d, e) {
            if (((d === void 0 ? 0 : d) ? a.g : Math.random()) < (e || .01)) try {
                if (c instanceof gp) var f = c;
                else f = new gp, ij(c, function(h, k) {
                    var l = f,
                        p = l.o++;
                    kp(l, p, hp(k, h))
                });
                var g = np(f, "https:", "/pagead/gen_204?id=" + b + "&");
                g && uj(y, g)
            } catch (h) {}
        };
    var cy, hy, by = new ol(1, window);
    (function(a) {
        cy = a != null ? a : new fy;
        typeof window.google_srt !== "number" && (window.google_srt = Math.random());
        gy();
        hy = new dy;
        hy.de(function() {});
        hy.cf(!0);
        window.document.readyState == "complete" ? window.google_measure_js_timing || by.B() : by.l && Vh(window, "load", function() {
            window.google_measure_js_timing || by.B()
        })
    })();
    var iy = function(a) {
        this.D = B(a)
    };
    w(iy, H);
    var jy = {
        "-": 0,
        Y: 2,
        N: 1
    };
    var ky = function(a) {
        this.D = B(a)
    };
    w(ky, H);
    ky.prototype.getType = function() {
        return ig(this, 1)
    };
    ky.prototype.getVersion = function() {
        return ig(this, 2)
    };

    function ly(a) {
        return Tc(a.length % 4 !== 0 ? a + "A" : a).map(function(b) {
            return b.toString(2).padStart(8, "0")
        }).join("")
    }

    function my(a) {
        if (!/^[0-1]+$/.test(a)) throw Error("Invalid input [" + a + "] not a bit string.");
        return parseInt(a, 2)
    }

    function ny(a) {
        if (!/^[0-1]+$/.test(a)) throw Error("Invalid input [" + a + "] not a bit string.");
        for (var b = [1, 2, 3, 5], c = 0, d = 0; d < a.length - 1; d++) b.length <= d && b.push(b[d - 1] + b[d - 2]), c += parseInt(a[d], 2) * b[d];
        return c
    }

    function oy(a, b) {
        a = ly(a);
        return a.length < b ? a.padEnd(b, "0") : a
    };

    function py(a, b) {
        var c = a.indexOf("11");
        if (c === -1) throw Error("Expected section bitstring but not found in [" + a + "] part of [" + b + "]");
        return a.slice(0, c + 2)
    };
    var qy = function(a) {
        this.D = B(a)
    };
    w(qy, H);
    var ry = function(a) {
        this.D = B(a)
    };
    w(ry, H);
    var sy = function(a) {
        this.D = B(a)
    };
    w(sy, H);
    sy.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var ty = function(a) {
        this.D = B(a)
    };
    w(ty, H);
    var uy = function(a) {
        this.D = B(a)
    };
    w(uy, H);
    var vy = function(a) {
        var b = new uy;
        return D(b, 1, a)
    };
    var NA = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        OA = 6 + NA.reduce(function(a, b) {
            return a + b
        });
    var PA = function(a) {
        this.D = B(a)
    };
    w(PA, H);
    var QA = function(a) {
        this.D = B(a)
    };
    w(QA, H);
    QA.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var RA = function(a) {
        this.D = B(a)
    };
    w(RA, H);
    var SA = function(a) {
        this.D = B(a)
    };
    w(SA, H);
    var TA = function(a) {
        var b = new SA;
        return D(b, 1, a)
    };
    var UA = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        VA = 6 + UA.reduce(function(a, b) {
            return a + b
        });
    var WA = function(a) {
        this.D = B(a)
    };
    w(WA, H);
    var XA = function(a) {
        this.D = B(a)
    };
    w(XA, H);
    var YA = function(a) {
        this.D = B(a)
    };
    w(YA, H);
    YA.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var ZA = function(a) {
        this.D = B(a)
    };
    w(ZA, H);
    var $A = function(a) {
        this.D = B(a)
    };
    w($A, H);
    var aB = function(a) {
        var b = new $A;
        return D(b, 1, a)
    };
    var bB = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        cB = 6 + bB.reduce(function(a, b) {
            return a + b
        });
    var dB = function(a) {
        this.D = B(a)
    };
    w(dB, H);
    var eB = function(a) {
        this.D = B(a)
    };
    w(eB, H);
    var fB = function(a) {
        this.D = B(a)
    };
    w(fB, H);
    fB.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var gB = function(a) {
        this.D = B(a)
    };
    w(gB, H);
    var hB = function(a) {
        this.D = B(a)
    };
    w(hB, H);
    var iB = function(a) {
        var b = new hB;
        return D(b, 1, a)
    };
    var jB = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        kB = 6 + jB.reduce(function(a, b) {
            return a + b
        });
    var lB = function(a) {
        this.D = B(a)
    };
    w(lB, H);
    var mB = function(a) {
        this.D = B(a)
    };
    w(mB, H);
    mB.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var nB = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        oB = 6 + nB.reduce(function(a, b) {
            return a + b
        });
    var pB = function(a) {
        this.D = B(a)
    };
    w(pB, H);
    var qB = function(a) {
        this.D = B(a)
    };
    w(qB, H);
    var rB = function(a, b) {
            return Mf(a, 1, b, fe)
        },
        sB = function(a, b) {
            return Mf(a, 2, b, fe)
        },
        tB = function(a, b) {
            return Mf(a, 3, b, ie)
        },
        uB = function(a, b) {
            Mf(a, 4, b, ie)
        };
    var vB = function(a) {
        this.D = B(a)
    };
    w(vB, H);
    var wB = function(a) {
        this.D = B(a)
    };
    w(wB, H);
    wB.prototype.getVersion = function() {
        return ig(this, 1)
    };
    var xB = function(a, b) {
            return ug(a, 1, b)
        },
        yB = function(a, b) {
            return D(a, 2, b)
        },
        zB = function(a, b) {
            return D(a, 3, b)
        },
        AB = function(a, b) {
            return ug(a, 4, b)
        },
        BB = function(a, b) {
            return ug(a, 5, b)
        },
        CB = function(a, b) {
            return ug(a, 6, b)
        },
        DB = function(a, b) {
            return Nf(a, 7, ze(b), "")
        },
        EB = function(a, b) {
            return ug(a, 8, b)
        },
        FB = function(a, b) {
            return ug(a, 9, b)
        },
        GB = function(a, b) {
            return sg(a, 10, b)
        },
        HB = function(a, b) {
            return sg(a, 11, b)
        },
        IB = function(a, b) {
            return Mf(a, 12, b, fe)
        },
        JB = function(a, b) {
            return Mf(a, 13, b, fe)
        },
        KB = function(a, b) {
            return Mf(a,
                14, b, fe)
        },
        LB = function(a, b) {
            return sg(a, 15, b)
        },
        MB = function(a, b) {
            return Nf(a, 16, ze(b), "")
        },
        NB = function(a, b) {
            return Mf(a, 17, b, ie)
        },
        OB = function(a, b) {
            return Mf(a, 18, b, ie)
        },
        PB = function(a, b) {
            return ag(a, 19, b)
        };
    var QB = function(a) {
        this.D = B(a)
    };
    w(QB, H);
    var RB = "a".charCodeAt(),
        SB = ji({
            mi: 0,
            li: 1,
            hi: 2,
            ci: 3,
            ji: 4,
            di: 5,
            ki: 6,
            fi: 7,
            gi: 8,
            bi: 9,
            ei: 10,
            pi: 11
        }),
        TB = ji({
            si: 0,
            ti: 1,
            ri: 2
        });
    var UB = function(a) {
            if (/[^01]/.test(a)) throw Error("Input bitstring " + a + " is malformed!");
            this.j = a;
            this.g = 0
        },
        WB = function(a) {
            a = VB(a, 36);
            var b = new vB;
            b = vg(b, 1, Math.floor(a / 10));
            return ug(b, 2, a % 10 * 1E8)
        },
        XB = function(a) {
            return String.fromCharCode(RB + VB(a, 6)) + String.fromCharCode(RB + VB(a, 6))
        },
        $B = function(a) {
            var b = VB(a, 16);
            return !!VB(a, 1) === !0 ? (a = YB(a), a.forEach(function(c) {
                if (c > b) throw Error("ID " + c + " is past MaxVendorId " + b + "!");
            }), a) : ZB(a, b)
        },
        aC = function(a) {
            for (var b = [], c = VB(a, 12); c--;) {
                var d = VB(a, 6),
                    e =
                    VB(a, 2),
                    f = YB(a),
                    g = b,
                    h = g.push,
                    k = new pB;
                d = G(k, 1, d);
                e = G(d, 2, e);
                f = Mf(e, 3, f, ie);
                h.call(g, f)
            }
            return b
        },
        YB = function(a) {
            for (var b = VB(a, 12), c = []; b--;) {
                var d = !!VB(a, 1) === !0,
                    e = VB(a, 16);
                if (d)
                    for (d = VB(a, 16); e <= d; e++) c.push(e);
                else c.push(e)
            }
            c.sort(function(f, g) {
                return f - g
            });
            return c
        },
        ZB = function(a, b, c) {
            for (var d = [], e = 0; e < b; e++)
                if (VB(a, 1)) {
                    var f = e + 1;
                    if (c && c.indexOf(f) === -1) throw Error("ID: " + f + " is outside of allowed values!");
                    d.push(f)
                } return d
        },
        VB = function(a, b) {
            if (a.g + b > a.j.length) throw Error("Requested length " +
                b + " is past end of string.");
            var c = a.j.substring(a.g, a.g + b);
            a.g += b;
            return parseInt(c, 2)
        };
    UB.prototype.skip = function(a) {
        this.g += a
    };
    var bC = function(a) {
        try {
            var b = Tc(a).map(function(f) {
                    return f.toString(2).padStart(8, "0")
                }).join(""),
                c = new UB(b);
            if (VB(c, 3) !== 3) return null;
            var d = sB(rB(new qB, ZB(c, 24, SB)), ZB(c, 24, SB)),
                e = VB(c, 6);
            e !== 0 && uB(tB(d, ZB(c, e)), ZB(c, e));
            return d
        } catch (f) {
            return null
        }
    };
    var cC = function(a) {
        try {
            var b = Tc(a).map(function(d) {
                    return d.toString(2).padStart(8, "0")
                }).join(""),
                c = new UB(b);
            return PB(OB(NB(MB(LB(KB(JB(IB(HB(GB(FB(EB(DB(CB(BB(AB(zB(yB(xB(new wB, VB(c, 6)), WB(c)), WB(c)), VB(c, 12)), VB(c, 12)), VB(c, 6)), XB(c)), VB(c, 12)), VB(c, 6)), !!VB(c, 1)), !!VB(c, 1)), ZB(c, 12, TB)), ZB(c, 24, SB)), ZB(c, 24, SB)), !!VB(c, 1)), XB(c)), $B(c)), $B(c)), aC(c))
        } catch (d) {
            return null
        }
    };
    var eC = function(a) {
            if (!a) return null;
            var b = a.split(".");
            if (b.length > 4) return null;
            a = cC(b[0]);
            if (!a) return null;
            var c = new QB;
            a = D(c, 1, a);
            b.shift();
            b = x(b);
            for (c = b.next(); !c.done; c = b.next()) switch (c = c.value, dC(c)) {
                case 1:
                case 2:
                    break;
                case 3:
                    c = bC(c);
                    if (!c) return null;
                    D(a, 2, c);
                    break;
                default:
                    return null
            }
            return a
        },
        dC = function(a) {
            try {
                var b = Tc(a).map(function(c) {
                    return c.toString(2).padStart(8, "0")
                }).join("");
                return VB(new UB(b), 3)
            } catch (c) {
                return -1
            }
        };
    var gC = function(a, b) {
            var c = eC(a);
            if (!c || !a) return null;
            var d = Xf(c, wB, 1),
                e = Xf(c, qB, 2) || new qB;
            c = ig(d, 9);
            var f = ig(d, 4),
                g = ig(d, 5),
                h = hg(d, 10),
                k = hg(d, 11),
                l = E(d, 16),
                p = hg(d, 15);
            var n = Cf(d, 13, he, Bf());
            n = fC(n, SB);
            var q = Cf(d, 14, he, Bf());
            n = {
                consents: n,
                legitimateInterests: fC(q, SB)
            };
            q = og(d, 17);
            q = fC(q);
            var t = og(d, 18);
            q = {
                consents: q,
                legitimateInterests: fC(t)
            };
            t = Cf(d, 12, he, Bf());
            t = fC(t, TB);
            var u = Zf(d, pB, 19, Bf());
            d = {};
            u = x(u);
            for (var v = u.next(); !v.done; v = u.next()) {
                v = v.value;
                var C = F(v, 1);
                d[C] = d[C] || {};
                for (var R = x(og(v,
                        3)), U = R.next(); !U.done; U = R.next()) d[C][U.value] = F(v, 2)
            }
            u = Cf(e, 1, he, Bf());
            u = fC(u, SB);
            v = Cf(e, 2, he, Bf());
            v = fC(v, SB);
            C = og(e, 3);
            C = fC(C);
            e = og(e, 4);
            return {
                tcString: a,
                tcfPolicyVersion: c,
                gdprApplies: b,
                cmpId: f,
                cmpVersion: g,
                isServiceSpecific: h,
                useNonStandardStacks: k,
                publisherCC: l,
                purposeOneTreatment: p,
                purpose: n,
                vendor: q,
                specialFeatureOptins: t,
                publisher: {
                    restrictions: d,
                    consents: u,
                    legitimateInterests: v,
                    customPurposes: {
                        consents: C,
                        legitimateInterests: fC(e)
                    }
                }
            }
        },
        fC = function(a, b) {
            var c = {};
            if (Array.isArray(b) && b.length !==
                0) {
                b = x(b);
                for (var d = b.next(); !d.done; d = b.next()) d = d.value, c[d] = a.indexOf(d) !== -1
            } else
                for (a = x(a), b = a.next(); !b.done; b = a.next()) c[b.value] = !0;
            delete c[0];
            return c
        };
    var hC = function(a, b) {
        this.g = a;
        this.defaultValue = b === void 0 ? !1 : b
    };
    var iC = new hC(45641707, !0),
        jC = new hC(45642592, !0),
        kC = new hC(635466687),
        lC = new function(a, b) {
            this.g = a;
            this.defaultValue = b === void 0 ? 0 : b
        }(45645574);
    var mC = function(a) {
        this.D = B(a)
    };
    w(mC, H);
    var nC = function(a) {
        var b = new mC;
        bg(b, 1, fe, a, he)
    };
    var oC = /^((market|itms|intent|itms-appss):\/\/)/i;
    var pC = "ad_type vpos mridx pos vad_type videoad_start_delay".split(" ");
    var qC = function(a) {
        var b = a.sb;
        var c = a.ab;
        var d = a.height;
        var e = a.width;
        a = a.Ga === void 0 ? !1 : a.Ga;
        this.sb = b;
        this.ab = c;
        this.height = d;
        this.width = e;
        this.Ga = a
    };
    qC.prototype.getHeight = function() {
        return this.height
    };
    qC.prototype.getWidth = function() {
        return this.width
    };
    var rC = function(a) {
        var b = a.yh;
        var c = a.Zf;
        var d = a.sb;
        var e = a.ab;
        var f = a.xh;
        var g = a.Yf;
        qC.call(this, {
            sb: d,
            ab: e,
            height: a.height,
            width: a.width,
            Ga: a.Ga === void 0 ? !1 : a.Ga
        });
        this.o = b;
        this.j = c;
        this.l = f;
        this.g = g
    };
    w(rC, qC);
    var sC = function(a) {
        var b = a.Og;
        qC.call(this, {
            sb: a.sb,
            ab: a.ab,
            height: a.height,
            width: a.width,
            Ga: a.Ga === void 0 ? !1 : a.Ga
        });
        this.g = b
    };
    w(sC, qC);
    sC.prototype.getMediaUrl = function() {
        return this.g
    };

    function tC(a) {
        return new(Function.prototype.bind.apply(a, [null].concat(ra(Ma.apply(1, arguments)))))
    };
    var uC = function(a, b, c, d) {
        P.call(this);
        this.G = b;
        this.F = c;
        this.C = d;
        this.A = new Map;
        this.H = 0;
        this.o = new Map;
        this.B = new Map;
        this.l = void 0;
        this.j = a
    };
    w(uC, P);
    uC.prototype.O = function() {
        delete this.g;
        this.A.clear();
        this.o.clear();
        this.B.clear();
        this.l && (Wh(this.j, "message", this.l), delete this.l);
        delete this.j;
        delete this.C;
        P.prototype.O.call(this)
    };
    var vC = function(a) {
            if (a.g) return a.g;
            a.F && a.F(a.j) ? a.g = a.j : a.g = oj(a.j, a.G);
            var b;
            return (b = a.g) != null ? b : null
        },
        xC = function(a, b, c) {
            if (vC(a))
                if (a.g === a.j)(b = a.A.get(b)) && b(a.g, c);
                else {
                    var d = a.o.get(b);
                    if (d && d.Pc) {
                        wC(a);
                        var e = ++a.H;
                        a.B.set(e, {
                            ec: d.ec,
                            ig: d.Kd(c),
                            ah: b === "addEventListener"
                        });
                        a.g.postMessage(d.Pc(c, e), "*")
                    }
                }
        },
        wC = function(a) {
            a.l || (a.l = function(b) {
                    try {
                        var c = a.C ? a.C(b) : void 0;
                        if (c) {
                            var d = c.Te,
                                e = a.B.get(d);
                            if (e) {
                                e.ah || a.B.delete(d);
                                var f;
                                (f = e.ec) == null || f.call(e, e.ig, c.payload)
                            }
                        }
                    } catch (g) {}
                },
                Vh(a.j, "message", a.l))
        };

    function yC(a) {
        a.addtlConsent !== void 0 && typeof a.addtlConsent !== "string" && (a.addtlConsent = void 0);
        a.gdprApplies !== void 0 && typeof a.gdprApplies !== "boolean" && (a.gdprApplies = void 0);
        return a.tcString !== void 0 && typeof a.tcString !== "string" || a.listenerId !== void 0 && typeof a.listenerId !== "number" ? 2 : a.cmpStatus && a.cmpStatus !== "error" ? 0 : 3
    }
    var zC = function(a, b) {
        b = b === void 0 ? {} : b;
        P.call(this);
        this.g = null;
        this.B = {};
        this.C = 0;
        this.l = null;
        this.j = a;
        var c;
        this.o = (c = b.timeoutMs) != null ? c : 500;
        var d;
        this.A = (d = b.dj) != null ? d : !1
    };
    w(zC, P);
    zC.prototype.O = function() {
        this.B = {};
        this.l && (Wh(this.j, "message", this.l), delete this.l);
        delete this.B;
        delete this.j;
        delete this.g;
        P.prototype.O.call(this)
    };
    var BC = function(a) {
            return typeof a.j.__tcfapi === "function" || AC(a) != null
        },
        EC = function(a, b) {
            var c = {
                    internalErrorState: 0,
                    internalBlockOnErrors: a.A
                },
                d = Rh(function() {
                    return b(c)
                }),
                e = 0;
            a.o !== -1 && (e = setTimeout(function() {
                e = 0;
                c.tcString = "tcunavailable";
                c.internalErrorState = 1;
                d()
            }, a.o));
            CC(a, "addEventListener", function(f) {
                f && (c = f, c.internalErrorState = yC(c), c.internalBlockOnErrors = a.A, DC(c) ? (c.internalErrorState !== 0 && (c.tcString = "tcunavailable"), CC(a, "removeEventListener", null, c.listenerId), (f = e) && clearTimeout(f),
                    d()) : (c.cmpStatus === "error" || c.internalErrorState !== 0) && (f = e) && clearTimeout(f))
            })
        };
    zC.prototype.addEventListener = function(a) {
        var b = this,
            c = {
                internalBlockOnErrors: this.A
            },
            d = Rh(function() {
                return a(c)
            }),
            e = 0;
        this.o !== -1 && (e = setTimeout(function() {
            c.tcString = "tcunavailable";
            c.internalErrorState = 1;
            d()
        }, this.o));
        var f = function(g, h) {
            clearTimeout(e);
            g ? (c = g, c.internalErrorState = yC(c), c.internalBlockOnErrors = b.A, h && c.internalErrorState === 0 || (c.tcString = "tcunavailable", h || (c.internalErrorState = 3))) : (c.tcString = "tcunavailable", c.internalErrorState = 3);
            a(c)
        };
        try {
            CC(this, "addEventListener", f)
        } catch (g) {
            c.tcString =
                "tcunavailable", c.internalErrorState = 3, e && (clearTimeout(e), e = 0), d()
        }
    };
    zC.prototype.removeEventListener = function(a) {
        a && a.listenerId && CC(this, "removeEventListener", null, a.listenerId)
    };
    var GC = function(a, b, c) {
            var d = d === void 0 ? "755" : d;
            a: {
                if (a.publisher && a.publisher.restrictions) {
                    var e = a.publisher.restrictions[b];
                    if (e !== void 0) {
                        e = e[d === void 0 ? "755" : d];
                        break a
                    }
                }
                e = void 0
            }
            if (e === 0) return !1;
            var f = c;
            c === 2 ? (f = 0, e === 2 && (f = 1)) : c === 3 && (f = 1, e === 1 && (f = 0));
            a = f === 0 ? a.purpose && a.vendor ? (c = FC(a.vendor.consents, d === void 0 ? "755" : d)) && b === "1" && a.purposeOneTreatment && a.publisherCC === "CH" ? !0 : c && FC(a.purpose.consents, b) : !0 : f === 1 ? a.purpose && a.vendor ? FC(a.purpose.legitimateInterests, b) && FC(a.vendor.legitimateInterests,
                d === void 0 ? "755" : d) : !0 : !0;
            return a
        },
        FC = function(a, b) {
            return !(!a || !a[b])
        },
        CC = function(a, b, c, d) {
            c || (c = function() {});
            var e = a.j;
            typeof e.__tcfapi === "function" ? (a = e.__tcfapi, a(b, 2, c, d)) : AC(a) ? (HC(a), e = ++a.C, a.B[e] = c, a.g && (c = {}, a.g.postMessage((c.__tcfapiCall = {
                command: b,
                version: 2,
                callId: e,
                parameter: d
            }, c), "*"))) : c({}, !1)
        },
        AC = function(a) {
            if (a.g) return a.g;
            a.g = oj(a.j, "__tcfapiLocator");
            return a.g
        },
        HC = function(a) {
            if (!a.l) {
                var b = function(c) {
                    try {
                        var d = (typeof c.data === "string" ? JSON.parse(c.data) : c.data).__tcfapiReturn;
                        a.B[d.callId](d.returnValue, d.success)
                    } catch (e) {}
                };
                a.l = b;
                Vh(a.j, "message", b)
            }
        },
        DC = function(a) {
            if (a.gdprApplies === !1) return !0;
            a.internalErrorState === void 0 && (a.internalErrorState = yC(a));
            return a.cmpStatus === "error" || a.internalErrorState !== 0 ? a.internalBlockOnErrors ? (wj({
                e: String(a.internalErrorState)
            }, "tcfe"), !1) : !0 : a.cmpStatus !== "loaded" || a.eventStatus !== "tcloaded" && a.eventStatus !== "useractioncomplete" ? !1 : !0
        },
        IC = function(a, b, c) {
            return a.gdprApplies === !1 ? !0 : b.every(function(d) {
                return GC(a, d, c)
            })
        };
    var JC = function(a, b) {
            b = b.listener;
            (a = (0, a.__gpp)("addEventListener", b)) && b(a, !0)
        },
        KC = function(a, b) {
            (0, a.__gpp)("removeEventListener", b.listener, b.listenerId)
        },
        LC = {
            Kd: function(a) {
                return a.listener
            },
            Pc: function(a, b) {
                a = {};
                return a.__gppCall = {
                    callId: b,
                    command: "addEventListener",
                    version: "1.1"
                }, a
            },
            ec: function(a, b) {
                b = b.__gppReturn;
                a(b.returnValue, b.success)
            }
        },
        MC = {
            Kd: function(a) {
                return a.listener
            },
            Pc: function(a, b) {
                var c = {};
                return c.__gppCall = {
                        callId: b,
                        command: "removeEventListener",
                        version: "1.1",
                        parameter: a.listenerId
                    },
                    c
            },
            ec: function(a, b) {
                b = b.__gppReturn;
                var c = b.returnValue.data;
                a == null || a(c, b.success)
            }
        };

    function NC(a) {
        var b = {};
        typeof a.data === "string" ? b = JSON.parse(a.data) : b = a.data;
        return {
            payload: b,
            Te: b.__gppReturn.callId
        }
    }
    var OC = function(a, b) {
        var c = b === void 0 ? {} : b;
        b = c.timeoutMs;
        c = c.cmpInteractionEventReporter;
        P.call(this);
        this.caller = new uC(a, "__gppLocator", function(d) {
            return typeof d.__gpp === "function"
        }, NC);
        this.caller.A.set("addEventListener", JC);
        this.caller.o.set("addEventListener", LC);
        this.caller.A.set("removeEventListener", KC);
        this.caller.o.set("removeEventListener", MC);
        this.timeoutMs = b != null ? b : 500;
        this.cmpInteractionEventReporter = c
    };
    w(OC, P);
    OC.prototype.O = function() {
        this.caller.dispose();
        P.prototype.O.call(this)
    };
    OC.prototype.addEventListener = function(a) {
        var b = this,
            c = Rh(function() {
                a(PC, !0)
            }),
            d = this.timeoutMs === -1 ? void 0 : setTimeout(function() {
                c()
            }, this.timeoutMs);
        xC(this.caller, "addEventListener", {
            listener: function(e, f) {
                clearTimeout(d);
                try {
                    var g;
                    if (((g = e.pingData) == null ? void 0 : g.gppVersion) === void 0 || e.pingData.gppVersion === "1" || e.pingData.gppVersion === "1.0") {
                        b.removeEventListener(e.listenerId);
                        var h = {
                            eventName: "signalStatus",
                            data: "ready",
                            pingData: {
                                internalErrorState: 1,
                                gppString: "GPP_ERROR_STRING_IS_DEPRECATED_SPEC",
                                applicableSections: [-1]
                            }
                        }
                    } else Array.isArray(e.pingData.applicableSections) ? h = e : (b.removeEventListener(e.listenerId), h = {
                        eventName: "signalStatus",
                        data: "ready",
                        pingData: {
                            internalErrorState: 2,
                            gppString: "GPP_ERROR_STRING_EXPECTED_APPLICATION_SECTION_ARRAY",
                            applicableSections: [-1]
                        }
                    });
                    a(h, f);
                    var k;
                    (k = b.cmpInteractionEventReporter) == null || k.g()
                } catch (l) {
                    if (e == null ? 0 : e.listenerId) try {
                        b.removeEventListener(e.listenerId)
                    } catch (p) {
                        a(QC, !0);
                        return
                    }
                    a(RC, !0)
                }
            }
        })
    };
    OC.prototype.removeEventListener = function(a) {
        xC(this.caller, "removeEventListener", {
            listener: function() {},
            listenerId: a
        })
    };
    var SC = function(a, b) {
            var c = c === void 0 ? !1 : c;
            if (!a) return !1;
            var d = ly(a.split("~")[0]),
                e = my(d.slice(0, 6)),
                f = my(d.slice(6, 12)),
                g = new ky;
            var h = ug(g, 1, e);
            var k = ug(h, 2, f);
            for (var l = d.slice(12), p = my(l.slice(0, 12)), n = [], q = l.slice(12).replace(/0+$/, ""), t = 0; t < p; t++) {
                if (q.length === 0) throw Error("Found " + t + " of " + p + " sections [" + n + "] but reached end of input [" + l + "]");
                var u = my(q[0]) === 0;
                q = q.slice(1);
                var v = py(q, l),
                    C = n.length === 0 ? 0 : n[n.length - 1],
                    R = ny(v) + C;
                q = q.slice(v.length);
                if (u) n.push(R);
                else {
                    for (var U = py(q, l),
                            da = ny(U), V = 0; V <= da; V++) n.push(R + V);
                    q = q.slice(U.length)
                }
            }
            if (q.length > 0) throw Error("Found " + p + " sections [" + n + "] but has remaining input [" + q + "], entire input [" + l + "]");
            var ma = Mf(k, 3, n, ie);
            var ob = a.includes("~") ? a.split("~").slice(1) : [];
            var zb = og(ma, 3);
            for (var eb = 0; eb < zb.length; ++eb) {
                var xc = zb[eb];
                if (b.includes(xc)) {
                    var Ca = ob[eb];
                    switch (xc) {
                        case 2:
                            if (c) {
                                var Kc = gC(Ca, !0);
                                if (!Kc) throw Error("Cannot decode TCF V2 section string.");
                                if (!IC(Kc, ["3", "4"], 0)) return !0
                            }
                            break;
                        case 7:
                            if (Ca.length === 0) throw Error("Cannot decode empty USNat section string.");
                            var ia = Ca.split(".");
                            if (ia.length > 2) throw Error("Expected at most 2 segments but got " + ia.length + " when decoding " + Ca + ".");
                            var Ka = void 0,
                                Lc = void 0,
                                Mc = void 0,
                                cf = void 0,
                                pb = void 0,
                                ai = void 0,
                                bi = void 0,
                                ci = void 0,
                                di = void 0,
                                wy = void 0,
                                yy = void 0,
                                zy = void 0,
                                Ay = void 0,
                                By = void 0,
                                Cy = void 0,
                                Dy = void 0,
                                Ey = void 0,
                                Fy = void 0,
                                Gy = void 0,
                                Hy = void 0,
                                Iy = void 0,
                                Jy = void 0,
                                Ky = void 0,
                                Ly = void 0,
                                My = void 0,
                                Ny = void 0,
                                Oy = void 0,
                                Py = void 0,
                                Qy = void 0,
                                Ry = void 0,
                                Sy = ia[0];
                            if (Sy.length === 0) throw Error("Cannot decode empty core segment string.");
                            var Vk = oy(Sy, kB),
                                Kp = my(Vk.slice(0, 6));
                            Vk = Vk.slice(6);
                            if (Kp !== 1) throw Error("Unable to decode unsupported USNat Section specification version " + Kp + " - only version 1 is supported.");
                            for (var Lp = 0, ua = [], Mp = 0; Mp < jB.length; Mp++) {
                                var Ty = jB[Mp];
                                ua.push(my(Vk.slice(Lp, Lp + Ty)));
                                Lp += Ty
                            }
                            var $K = new fB;
                            Ry = ug($K, 1, Kp);
                            var aL = ua.shift();
                            Qy = G(Ry, 2, aL);
                            var bL = ua.shift();
                            Py = G(Qy, 3, bL);
                            var cL = ua.shift();
                            Oy = G(Py, 4, cL);
                            var dL = ua.shift();
                            Ny = G(Oy, 5, dL);
                            var eL = ua.shift();
                            My = G(Ny, 6, eL);
                            var fL = ua.shift();
                            Ly = G(My, 7, fL);
                            var gL =
                                ua.shift();
                            Ky = G(Ly, 8, gL);
                            var hL = ua.shift();
                            Jy = G(Ky, 9, hL);
                            var iL = ua.shift();
                            Iy = G(Jy, 10, iL);
                            var jL = new eB,
                                kL = ua.shift();
                            Hy = G(jL, 1, kL);
                            var lL = ua.shift();
                            Gy = G(Hy, 2, lL);
                            var mL = ua.shift();
                            Fy = G(Gy, 3, mL);
                            var nL = ua.shift();
                            Ey = G(Fy, 4, nL);
                            var oL = ua.shift();
                            Dy = G(Ey, 5, oL);
                            var pL = ua.shift();
                            Cy = G(Dy, 6, pL);
                            var qL = ua.shift();
                            By = G(Cy, 7, qL);
                            var rL = ua.shift();
                            Ay = G(By, 8, rL);
                            var sL = ua.shift();
                            zy = G(Ay, 9, sL);
                            var tL = ua.shift();
                            yy = G(zy, 10, tL);
                            var uL = ua.shift();
                            wy = G(yy, 11, uL);
                            var vL = ua.shift();
                            di = G(wy, 12, vL);
                            ci = D(Iy, 11, di);
                            var wL = new dB,
                                xL = ua.shift();
                            bi = G(wL, 1, xL);
                            var yL = ua.shift();
                            ai = G(bi, 2, yL);
                            pb = D(ci, 12, ai);
                            var zL = ua.shift();
                            cf = G(pb, 13, zL);
                            var AL = ua.shift();
                            Mc = G(cf, 14, AL);
                            var BL = ua.shift();
                            Lc = G(Mc, 15, BL);
                            var CL = ua.shift();
                            var Uy = Ka = G(Lc, 16, CL);
                            if (ia.length === 1) var Vy = iB(Uy);
                            else {
                                var DL = iB(Uy),
                                    Wy = void 0,
                                    Xy = void 0,
                                    Yy = void 0,
                                    Zy = ia[1];
                                if (Zy.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                var $y = oy(Zy, 3),
                                    Wk = my($y.slice(0, 2));
                                if (Wk < 0 || Wk > 1) throw Error("Attempting to decode unknown GPC segment subsection type " +
                                    Wk + ".");
                                Yy = Wk + 1;
                                var EL = my($y.slice(2, 3)),
                                    FL = new gB;
                                Xy = G(FL, 2, Yy);
                                Wy = sg(Xy, 1, !!EL);
                                Vy = D(DL, 2, Wy)
                            }
                            var Np = Xf(Vy, fB, 1);
                            if (F(Np, 8) === 1 || F(Np, 9) === 1 || F(Np, 10) === 1) return !0;
                            break;
                        case 8:
                            if (Ca.length === 0) throw Error("Cannot decode empty USCA section string.");
                            var ei = Ca.split(".");
                            if (ei.length > 2) throw Error("Expected at most 1 sub-section but got " + (ei.length - 1) + " when decoding " + Ca + ".");
                            var GL = void 0,
                                az = void 0,
                                bz = void 0,
                                cz = void 0,
                                dz = void 0,
                                ez = void 0,
                                fz = void 0,
                                gz = void 0,
                                hz = void 0,
                                iz = void 0,
                                jz = void 0,
                                kz = void 0,
                                lz = void 0,
                                mz = void 0,
                                nz = void 0,
                                oz = void 0,
                                pz = void 0,
                                qz = void 0,
                                rz = void 0,
                                sz = void 0,
                                tz = void 0,
                                uz = void 0,
                                vz = void 0,
                                wz = ei[0];
                            if (wz.length === 0) throw Error("Cannot decode empty core segment string.");
                            var Xk = oy(wz, OA),
                                Op = my(Xk.slice(0, 6));
                            Xk = Xk.slice(6);
                            if (Op !== 1) throw Error("Unable to decode unsupported USCA Section specification version " + Op + " - only version 1 is supported.");
                            for (var Pp = 0, Qa = [], Qp = 0; Qp < NA.length; Qp++) {
                                var xz = NA[Qp];
                                Qa.push(my(Xk.slice(Pp, Pp + xz)));
                                Pp += xz
                            }
                            var HL = new sy;
                            vz = ug(HL, 1, Op);
                            var IL =
                                Qa.shift();
                            uz = G(vz, 2, IL);
                            var JL = Qa.shift();
                            tz = G(uz, 3, JL);
                            var KL = Qa.shift();
                            sz = G(tz, 4, KL);
                            var LL = Qa.shift();
                            rz = G(sz, 5, LL);
                            var ML = Qa.shift();
                            qz = G(rz, 6, ML);
                            var NL = new ry,
                                OL = Qa.shift();
                            pz = G(NL, 1, OL);
                            var PL = Qa.shift();
                            oz = G(pz, 2, PL);
                            var QL = Qa.shift();
                            nz = G(oz, 3, QL);
                            var RL = Qa.shift();
                            mz = G(nz, 4, RL);
                            var SL = Qa.shift();
                            lz = G(mz, 5, SL);
                            var TL = Qa.shift();
                            kz = G(lz, 6, TL);
                            var UL = Qa.shift();
                            jz = G(kz, 7, UL);
                            var VL = Qa.shift();
                            iz = G(jz, 8, VL);
                            var WL = Qa.shift();
                            hz = G(iz, 9, WL);
                            gz = D(qz, 7, hz);
                            var XL = new qy,
                                YL = Qa.shift();
                            fz = G(XL,
                                1, YL);
                            var ZL = Qa.shift();
                            ez = G(fz, 2, ZL);
                            dz = D(gz, 8, ez);
                            var $L = Qa.shift();
                            cz = G(dz, 9, $L);
                            var aM = Qa.shift();
                            bz = G(cz, 10, aM);
                            var bM = Qa.shift();
                            az = G(bz, 11, bM);
                            var cM = Qa.shift();
                            var yz = GL = G(az, 12, cM);
                            if (ei.length === 1) var zz = vy(yz);
                            else {
                                var dM = vy(yz),
                                    Az = void 0,
                                    Bz = void 0,
                                    Cz = void 0,
                                    Dz = ei[1];
                                if (Dz.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                var Ez = oy(Dz, 3),
                                    Yk = my(Ez.slice(0, 2));
                                if (Yk < 0 || Yk > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + Yk + ".");
                                Cz = Yk + 1;
                                var eM = my(Ez.slice(2,
                                        3)),
                                    fM = new ty;
                                Bz = G(fM, 2, Cz);
                                Az = sg(Bz, 1, !!eM);
                                zz = D(dM, 2, Az)
                            }
                            var Fz = Xf(zz, sy, 1);
                            if (F(Fz, 5) === 1 || F(Fz, 6) === 1) return !0;
                            break;
                        case 9:
                            if (Ca.length === 0) throw Error("Cannot decode empty USVA section string.");
                            var Zk = oy(Ca, oB),
                                Rp = my(Zk.slice(0, 6));
                            Zk = Zk.slice(6);
                            if (Rp !== 1) throw Error("Unable to decode unsupported USVA Section specification version " + Rp + " - only version 1 is supported.");
                            for (var Sp = 0, kb = [], Tp = 0; Tp < nB.length; Tp++) {
                                var Gz = nB[Tp];
                                kb.push(my(Zk.slice(Sp, Sp + Gz)));
                                Sp += Gz
                            }
                            var gM = Rp,
                                hM = new mB,
                                iM = ug(hM,
                                    1, gM),
                                jM = kb.shift(),
                                kM = G(iM, 2, jM),
                                lM = kb.shift(),
                                mM = G(kM, 3, lM),
                                nM = kb.shift(),
                                oM = G(mM, 4, nM),
                                pM = kb.shift(),
                                qM = G(oM, 5, pM),
                                rM = kb.shift();
                            var sM = G(qM, 6, rM);
                            var tM = new lB,
                                uM = kb.shift(),
                                vM = G(tM, 1, uM),
                                wM = kb.shift(),
                                xM = G(vM, 2, wM),
                                yM = kb.shift(),
                                zM = G(xM, 3, yM),
                                AM = kb.shift(),
                                BM = G(zM, 4, AM),
                                CM = kb.shift(),
                                DM = G(BM, 5, CM),
                                EM = kb.shift(),
                                FM = G(DM, 6, EM),
                                GM = kb.shift(),
                                HM = G(FM, 7, GM),
                                IM = kb.shift();
                            var JM = G(HM, 8, IM);
                            var KM = D(sM, 7, JM),
                                LM = kb.shift(),
                                MM = G(KM, 8, LM),
                                NM = kb.shift(),
                                OM = G(MM, 9, NM),
                                PM = kb.shift(),
                                QM = G(OM, 10, PM),
                                RM = kb.shift(),
                                Hz = G(QM, 11, RM);
                            if (F(Hz, 5) === 1 || F(Hz, 6) === 1) return !0;
                            break;
                        case 10:
                            if (Ca.length === 0) throw Error("Cannot decode empty USCO section string.");
                            var fi = Ca.split(".");
                            if (fi.length > 2) throw Error("Expected at most 2 segments but got " + fi.length + " when decoding " + Ca + ".");
                            var SM = void 0,
                                Iz = void 0,
                                Jz = void 0,
                                Kz = void 0,
                                Lz = void 0,
                                Mz = void 0,
                                Nz = void 0,
                                Oz = void 0,
                                Pz = void 0,
                                Qz = void 0,
                                Rz = void 0,
                                Sz = void 0,
                                Tz = void 0,
                                Uz = void 0,
                                Vz = void 0,
                                Wz = void 0,
                                Xz = void 0,
                                Yz = void 0,
                                Zz = fi[0];
                            if (Zz.length === 0) throw Error("Cannot decode empty core segment string.");
                            var $k = oy(Zz, VA),
                                Up = my($k.slice(0, 6));
                            $k = $k.slice(6);
                            if (Up !== 1) throw Error("Unable to decode unsupported USCO Section specification version " + Up + " - only version 1 is supported.");
                            for (var Vp = 0, qb = [], Wp = 0; Wp < UA.length; Wp++) {
                                var $z = UA[Wp];
                                qb.push(my($k.slice(Vp, Vp + $z)));
                                Vp += $z
                            }
                            var TM = new QA;
                            Yz = ug(TM, 1, Up);
                            var UM = qb.shift();
                            Xz = G(Yz, 2, UM);
                            var VM = qb.shift();
                            Wz = G(Xz, 3, VM);
                            var WM = qb.shift();
                            Vz = G(Wz, 4, WM);
                            var XM = qb.shift();
                            Uz = G(Vz, 5, XM);
                            var YM = qb.shift();
                            Tz = G(Uz, 6, YM);
                            var ZM = new PA,
                                $M = qb.shift();
                            Sz = G(ZM,
                                1, $M);
                            var aN = qb.shift();
                            Rz = G(Sz, 2, aN);
                            var bN = qb.shift();
                            Qz = G(Rz, 3, bN);
                            var cN = qb.shift();
                            Pz = G(Qz, 4, cN);
                            var dN = qb.shift();
                            Oz = G(Pz, 5, dN);
                            var eN = qb.shift();
                            Nz = G(Oz, 6, eN);
                            var fN = qb.shift();
                            Mz = G(Nz, 7, fN);
                            Lz = D(Tz, 7, Mz);
                            var gN = qb.shift();
                            Kz = G(Lz, 8, gN);
                            var hN = qb.shift();
                            Jz = G(Kz, 9, hN);
                            var iN = qb.shift();
                            Iz = G(Jz, 10, iN);
                            var jN = qb.shift();
                            var aA = SM = G(Iz, 11, jN);
                            if (fi.length === 1) var bA = TA(aA);
                            else {
                                var kN = TA(aA),
                                    cA = void 0,
                                    dA = void 0,
                                    eA = void 0,
                                    fA = fi[1];
                                if (fA.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                var gA = oy(fA, 3),
                                    al = my(gA.slice(0, 2));
                                if (al < 0 || al > 1) throw Error("Attempting to decode unknown GPC segment subsection type " + al + ".");
                                eA = al + 1;
                                var lN = my(gA.slice(2, 3)),
                                    mN = new RA;
                                dA = G(mN, 2, eA);
                                cA = sg(dA, 1, !!lN);
                                bA = D(kN, 2, cA)
                            }
                            var hA = Xf(bA, QA, 1);
                            if (F(hA, 5) === 1 || F(hA, 6) === 1) return !0;
                            break;
                        case 12:
                            if (Ca.length === 0) throw Error("Cannot decode empty usct section string.");
                            var gi = Ca.split(".");
                            if (gi.length > 2) throw Error("Expected at most 2 segments but got " + gi.length + " when decoding " + Ca + ".");
                            var nN = void 0,
                                iA =
                                void 0,
                                jA = void 0,
                                kA = void 0,
                                lA = void 0,
                                mA = void 0,
                                nA = void 0,
                                oA = void 0,
                                pA = void 0,
                                qA = void 0,
                                rA = void 0,
                                sA = void 0,
                                tA = void 0,
                                uA = void 0,
                                vA = void 0,
                                wA = void 0,
                                xA = void 0,
                                yA = void 0,
                                zA = void 0,
                                AA = void 0,
                                BA = void 0,
                                CA = void 0,
                                DA = gi[0];
                            if (DA.length === 0) throw Error("Cannot decode empty core segment string.");
                            var bl = oy(DA, cB),
                                Xp = my(bl.slice(0, 6));
                            bl = bl.slice(6);
                            if (Xp !== 1) throw Error("Unable to decode unsupported USCT Section specification version " + Xp + " - only version 1 is supported.");
                            for (var Yp = 0, Za = [], Zp = 0; Zp < bB.length; Zp++) {
                                var EA =
                                    bB[Zp];
                                Za.push(my(bl.slice(Yp, Yp + EA)));
                                Yp += EA
                            }
                            var oN = new YA;
                            CA = ug(oN, 1, Xp);
                            var pN = Za.shift();
                            BA = G(CA, 2, pN);
                            var qN = Za.shift();
                            AA = G(BA, 3, qN);
                            var rN = Za.shift();
                            zA = G(AA, 4, rN);
                            var sN = Za.shift();
                            yA = G(zA, 5, sN);
                            var tN = Za.shift();
                            xA = G(yA, 6, tN);
                            var uN = new XA,
                                vN = Za.shift();
                            wA = G(uN, 1, vN);
                            var wN = Za.shift();
                            vA = G(wA, 2, wN);
                            var xN = Za.shift();
                            uA = G(vA, 3, xN);
                            var yN = Za.shift();
                            tA = G(uA, 4, yN);
                            var zN = Za.shift();
                            sA = G(tA, 5, zN);
                            var AN = Za.shift();
                            rA = G(sA, 6, AN);
                            var BN = Za.shift();
                            qA = G(rA, 7, BN);
                            var CN = Za.shift();
                            pA = G(qA, 8, CN);
                            oA = D(xA, 7, pA);
                            var DN = new WA,
                                EN = Za.shift();
                            nA = G(DN, 1, EN);
                            var FN = Za.shift();
                            mA = G(nA, 2, FN);
                            var GN = Za.shift();
                            lA = G(mA, 3, GN);
                            kA = D(oA, 8, lA);
                            var HN = Za.shift();
                            jA = G(kA, 9, HN);
                            var IN = Za.shift();
                            iA = G(jA, 10, IN);
                            var JN = Za.shift();
                            var FA = nN = G(iA, 11, JN);
                            if (gi.length === 1) var GA = aB(FA);
                            else {
                                var KN = aB(FA),
                                    HA = void 0,
                                    IA = void 0,
                                    JA = void 0,
                                    KA = gi[1];
                                if (KA.length === 0) throw Error("Cannot decode empty GPC segment string.");
                                var LA = oy(KA, 3),
                                    cl = my(LA.slice(0, 2));
                                if (cl < 0 || cl > 1) throw Error("Attempting to decode unknown GPC segment subsection type " +
                                    cl + ".");
                                JA = cl + 1;
                                var LN = my(LA.slice(2, 3)),
                                    MN = new ZA;
                                IA = G(MN, 2, JA);
                                HA = sg(IA, 1, !!LN);
                                GA = D(KN, 2, HA)
                            }
                            var MA = Xf(GA, YA, 1);
                            if (F(MA, 5) === 1 || F(MA, 6) === 1) return !0
                    }
                }
            }
            return !1
        },
        RC = {
            eventName: "signalStatus",
            data: "ready",
            pingData: {
                internalErrorState: 2,
                gppString: "GPP_ERROR_STRING_UNAVAILABLE",
                applicableSections: [-1]
            },
            listenerId: -1
        },
        PC = {
            eventName: "signalStatus",
            data: "ready",
            pingData: {
                gppString: "GPP_ERROR_STRING_LISTENER_REGISTRATION_TIMEOUT",
                internalErrorState: 2,
                applicableSections: [-1]
            },
            listenerId: -1
        },
        QC = {
            eventName: "signalStatus",
            data: "ready",
            pingData: {
                gppString: "GPP_ERROR_STRING_REMOVE_EVENT_LISTENER_ERROR",
                internalErrorState: 2,
                applicableSections: [-1]
            },
            listenerId: -1
        };
    nC([1, 8, 9, 10, 11, 12, 2, 3, 4, 5, 15, 16, 19, 20, 21]);
    nC([1, 6, 7, 9, 10, 11, 12, 2, 3, 4, 5, 13, 14, 18, 19, 20, 21]);
    nC([1, 6, 7, 9, 10, 11, 12, 22, 2, 3, 4, 5, 13, 14, 17, 18, 19, 20, 21]);
    new mC;
    var TC = function(a, b) {
        this.g = this.B = this.o = "";
        this.J = null;
        this.L = this.j = "";
        this.A = !1;
        var c;
        a instanceof TC ? (this.A = b !== void 0 ? b : a.A, UC(this, a.o), this.B = a.B, this.g = a.g, VC(this, a.J), this.j = a.j, WC(this, XC(a.l)), this.L = a.F()) : a && (c = String(a).match(Xi)) ? (this.A = !!b, UC(this, c[1] || "", !0), this.B = YC(c[2] || ""), this.g = YC(c[3] || "", !0), VC(this, c[4]), this.j = YC(c[5] || "", !0), WC(this, c[6] || "", !0), this.L = YC(c[7] || "")) : (this.A = !!b, this.l = new ZC(null, this.A))
    };
    TC.prototype.toString = function() {
        var a = [],
            b = this.o;
        b && a.push($C(b, aD, !0), ":");
        var c = this.g;
        if (c || b == "file") a.push("//"), (b = this.B) && a.push($C(b, aD, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.J, c != null && a.push(":", String(c));
        if (c = this.j) this.g && c.charAt(0) != "/" && a.push("/"), a.push($C(c, c.charAt(0) == "/" ? bD : cD, !0));
        (c = this.l.toString()) && a.push("?", c);
        (c = this.F()) && a.push("#", $C(c, dD));
        return a.join("")
    };
    TC.prototype.resolve = function(a) {
        var b = this.G(),
            c = !!a.o;
        c ? UC(b, a.o) : c = !!a.B;
        c ? b.B = a.B : c = !!a.g;
        c ? b.g = a.g : c = a.J != null;
        var d = a.j;
        if (c) VC(b, a.J);
        else if (c = !!a.j) {
            if (d.charAt(0) != "/")
                if (this.g && !this.j) d = "/" + d;
                else {
                    var e = b.j.lastIndexOf("/");
                    e != -1 && (d = b.j.slice(0, e + 1) + d)
                } e = d;
            if (e == ".." || e == ".") d = "";
            else if (yb(e, "./") || yb(e, "/.")) {
                d = e.lastIndexOf("/", 0) == 0;
                e = e.split("/");
                for (var f = [], g = 0; g < e.length;) {
                    var h = e[g++];
                    h == "." ? d && g == e.length && f.push("") : h == ".." ? ((f.length > 1 || f.length == 1 && f[0] != "") && f.pop(), d &&
                        g == e.length && f.push("")) : (f.push(h), d = !0)
                }
                d = f.join("/")
            } else d = e
        }
        c ? b.j = d : c = a.l.toString() !== "";
        c ? WC(b, XC(a.l)) : c = !!a.L;
        c && (b.L = a.F());
        return b
    };
    TC.prototype.G = function() {
        return new TC(this)
    };
    var UC = function(a, b, c) {
            a.o = c ? YC(b, !0) : b;
            a.o && (a.o = a.o.replace(/:$/, ""))
        },
        VC = function(a, b) {
            if (b) {
                b = Number(b);
                if (isNaN(b) || b < 0) throw Error("Bad port number " + b);
                a.J = b
            } else a.J = null
        },
        WC = function(a, b, c) {
            b instanceof ZC ? (a.l = b, eD(a.l, a.A)) : (c || (b = $C(b, fD)), a.l = new ZC(b, a.A))
        },
        gD = function(a, b, c) {
            a.l.set(b, c);
            return a
        },
        hD = function(a, b) {
            return a.l.get(b)
        };
    TC.prototype.F = function() {
        return this.L
    };
    var iD = function(a) {
            return a instanceof TC ? a.G() : new TC(a, void 0)
        },
        YC = function(a, b) {
            return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
        },
        $C = function(a, b, c) {
            return typeof a === "string" ? (a = encodeURI(a).replace(b, jD), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
        },
        jD = function(a) {
            a = a.charCodeAt(0);
            return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
        },
        aD = /[#\/\?@]/g,
        cD = /[#\?:]/g,
        bD = /[#\?]/g,
        fD = /[#\?@]/g,
        dD = /#/g,
        ZC = function(a, b) {
            this.j = this.g = null;
            this.l = a || null;
            this.o = !!b
        },
        kD =
        function(a) {
            a.g || (a.g = new Map, a.j = 0, a.l && Zi(a.l, function(b, c) {
                a.add(Oi(b), c)
            }))
        };
    ZC.prototype.add = function(a, b) {
        kD(this);
        this.l = null;
        a = lD(this, a);
        var c = this.g.get(a);
        c || this.g.set(a, c = []);
        c.push(b);
        this.j += 1;
        return this
    };
    ZC.prototype.remove = function(a) {
        kD(this);
        a = lD(this, a);
        return this.g.has(a) ? (this.l = null, this.j -= this.g.get(a).length, this.g.delete(a)) : !1
    };
    ZC.prototype.clear = function() {
        this.g = this.l = null;
        this.j = 0
    };
    ZC.prototype.isEmpty = function() {
        kD(this);
        return this.j == 0
    };
    var mD = function(a, b) {
        kD(a);
        b = lD(a, b);
        return a.g.has(b)
    };
    m = ZC.prototype;
    m.forEach = function(a, b) {
        kD(this);
        this.g.forEach(function(c, d) {
            c.forEach(function(e) {
                a.call(b, e, d, this)
            }, this)
        }, this)
    };
    m.Hc = function() {
        kD(this);
        for (var a = Array.from(this.g.values()), b = Array.from(this.g.keys()), c = [], d = 0; d < b.length; d++)
            for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
        return c
    };
    m.Fb = function(a) {
        kD(this);
        var b = [];
        if (typeof a === "string") mD(this, a) && (b = b.concat(this.g.get(lD(this, a))));
        else {
            a = Array.from(this.g.values());
            for (var c = 0; c < a.length; c++) b = b.concat(a[c])
        }
        return b
    };
    m.set = function(a, b) {
        kD(this);
        this.l = null;
        a = lD(this, a);
        mD(this, a) && (this.j -= this.g.get(a).length);
        this.g.set(a, [b]);
        this.j += 1;
        return this
    };
    m.get = function(a, b) {
        if (!a) return b;
        a = this.Fb(a);
        return a.length > 0 ? String(a[0]) : b
    };
    m.toString = function() {
        if (this.l) return this.l;
        if (!this.g) return "";
        for (var a = [], b = Array.from(this.g.keys()), c = 0; c < b.length; c++) {
            var d = b[c],
                e = encodeURIComponent(String(d));
            d = this.Fb(d);
            for (var f = 0; f < d.length; f++) {
                var g = e;
                d[f] !== "" && (g += "=" + encodeURIComponent(String(d[f])));
                a.push(g)
            }
        }
        return this.l = a.join("&")
    };
    var XC = function(a) {
            var b = new ZC;
            b.l = a.l;
            a.g && (b.g = new Map(a.g), b.j = a.j);
            return b
        },
        lD = function(a, b) {
            b = String(b);
            a.o && (b = b.toLowerCase());
            return b
        },
        eD = function(a, b) {
            b && !a.o && (kD(a), a.l = null, a.g.forEach(function(c, d) {
                var e = d.toLowerCase();
                d != e && (this.remove(d), this.remove(e), c.length > 0 && (this.l = null, this.g.set(lD(this, e), gc(c)), this.j += c.length))
            }, a));
            a.o = b
        };
    var nD, oD, pD, qD = function() {
            return y.navigator ? y.navigator.userAgent : ""
        },
        rD = yb(qD(), "(iPad") || yb(qD(), "(Macintosh") || yb(qD(), "(iPod") || yb(qD(), "(iPhone");
    var sD = "ad.doubleclick.net bid.g.doubleclick.net ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com gvt1.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com".split(" "),
        tD = ["c.googlesyndication.com"];

    function uD(a, b) {
        b = b === void 0 ? window.location.protocol : b;
        var c = !1;
        a == null || !a.startsWith("http") || (a == null ? 0 : a.startsWith("https")) ? c = !1 : vD(a, tD) ? c = !1 : b.includes("https") && vD(a, sD) && (c = !0);
        return c ? (a = new TC(a), L(K.getInstance(), "htp", "1"), UC(a, "https"), a.toString()) : a
    }

    function wD(a) {
        if (!a) return !1;
        try {
            return (typeof a === "string" ? new TC(a) : a).o === "gcache"
        } catch (b) {
            return !1
        }
    }

    function xD(a) {
        return wD(a) && !!hD(new TC(a), "url")
    }

    function yD(a) {
        try {
            var b = typeof a === "string" ? new TC(a) : a;
            if (wD(b)) {
                var c, d;
                return (d = (c = hD(b, "url")) != null ? c : hD(b, "tag.check_url")) != null ? d : null
            }
        } catch (e) {}
        return null
    }

    function vD(a, b) {
        return (new RegExp("^https?://([a-z0-9-]{1,63}\\.)*(" + b.join("|").replace(/\./g, "\\.") + ")(:[0-9]+)?([/?#]|$)", "i")).test(a)
    };
    var zD = -1;

    function AD(a, b) {
        b = b != null ? b : "";
        qc && (b = "");
        if (!wb(Ri(a))) {
            var c = a instanceof Bi || !oC.test(a) ? a : new Bi(a);
            if (c instanceof Bi) var d = c;
            else {
                d = d === void 0 ? Fi : d;
                a: if (d = d === void 0 ? Fi : d, !(a instanceof Bi)) {
                    for (c = 0; c < d.length; ++c) {
                        var e = d[c];
                        if (e instanceof Di && e.Mg(a)) {
                            a = new Bi(a);
                            break a
                        }
                    }
                    a = void 0
                } d = a || Ci
            }
            a = window;
            if (d instanceof Bi)
                if (d instanceof Bi) d = d.g;
                else throw Error("");
            else d = Hi.test(d) ? d : void 0;
            d !== void 0 && a.open(d, "_blank", b)
        }
    };

    function BD(a, b) {
        for (var c; !(c = a.next()).done;) b(c.value)
    }
    var CD = function(a, b) {
        this.g = a[y.Symbol.iterator]();
        this.j = b
    };
    CD.prototype[Symbol.iterator] = function() {
        return this
    };
    CD.prototype.next = function() {
        var a = this.g.next();
        return {
            value: a.done ? void 0 : this.j.call(void 0, a.value),
            done: a.done
        }
    };
    var DD = function(a, b) {
        return new CD(a, b)
    };
    var ED = function(a, b) {
        var c = new Set(a);
        BD(b[Symbol.iterator](), function(d) {
            return c.add(d)
        });
        return c
    };
    var FD = new Map,
        GD = function() {
            this.j = this.g = null
        };

    function HD(a, b, c, d) {
        var e = Jq(a);
        Gk(b, e) ? (e = setTimeout(function() {
            return HD(a, b, c, d)
        }, 200), d.j = e) : (ID(d), c(e))
    }

    function JD(a) {
        var b = new GD,
            c = new Promise(function(f) {
                var g = Jq(a);
                if ("ResizeObserver" in window) {
                    var h = new ResizeObserver(function(k) {
                        window.requestAnimationFrame(function() {
                            for (var l = new Fk(0, 0), p = x(k), n = p.next(); !n.done; n = p.next())
                                if (n = n.value, n.contentBoxSize ? (n = Array.isArray(n.contentBoxSize) ? n.contentBoxSize[0] : n.contentBoxSize, l.width = Math.floor(n.inlineSize), l.height = Math.floor(n.blockSize)) : (l.width = Math.floor(n.contentRect.width), l.height = Math.floor(n.contentRect.height)), !Gk(g, l)) return ID(b),
                                    f(l)
                        })
                    });
                    b.g = h;
                    h.observe(a)
                } else HD(a, g, f, b)
            }),
            d, e = (d = FD.get(c)) != null ? d : new Set;
        e.add(b);
        FD.set(c, e);
        return c
    }

    function KD(a, b) {
        b = b === void 0 ? new Fk(1, 1) : b;
        var c = function(g) {
                var h = JD(a),
                    k, l = (k = FD.get(g)) != null ? k : new Set,
                    p;
                k = (p = FD.get(h)) != null ? p : new Set;
                FD.set(g, ED(l, k));
                return h
            },
            d = function(g, h) {
                c(g).then(function(k) {
                    return b.width <= k.width && b.height <= k.height ? (LD(g), h(k)) : d(g, h)
                })
            },
            e, f = new Promise(function(g) {
                e = g
            });
        d(f, e);
        return f
    }

    function LD(a) {
        a = FD.get(a);
        a = x(a);
        for (var b = a.next(); !b.done; b = a.next()) ID(b.value)
    }

    function ID(a) {
        a.j && window.clearTimeout(a.j);
        a.g && (a.g.disconnect(), a.g = null)
    };

    function MD(a, b) {
        return a && (a[b] || (a[b] = {}))
    }

    function ND(a, b) {
        var c;
        if (c = c === void 0 ? typeof omidExports === "undefined" ? null : omidExports : c) a = a.split("."), a.slice(0, a.length - 1).reduce(MD, c)[a[a.length - 1]] = b
    };
    var OD = new Map([
        [2, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.moatads\.com\/.*$/]],
        [3, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.doubleverify\.com\/.*$/, /^(https?:\/\/|\/\/)?c\.[\w\-]+\.com\/vfw\/dv\/.*$/, /^(https?:\/\/|\/\/)?(www\.)?[\w]+\.tv\/r\/s\/d\/.*$/, /^(https?:\/\/|\/\/)?(\w\.?)+\.dv\.tech\/.*$/]],
        [4, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.adsafeprotected\.com\/.*$/]],
        [5, [/^https?:\/\/(q|cdn)\.adrta\.com\/s\/.*\/(aa|aanf)\.js.*$/, /^https:\/\/cdn\.rta247\.com\/s\/.*\/(aa|aanf)\.js.*$/]],
        [6, []],
        [7, [/^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.voicefive\.com\/.*$/,
            /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.measuread\.com\/.*$/, /^(https?:\/\/|\/\/)?[-a-zA-Z0-9.]+\.scorecardresearch\.com\/.*$/
        ]],
        [8, [/^(https?:\/\/|\/\/)?s418\.mxcdn\.net\/bb-serve\/omid-meetrics.*\.js$/]],
        [9, [/^(https?:\/\/|\/\/)?pagead2\.googlesyndication\.com\/.*$/, /^(https?:\/\/|\/\/)?www\.googletagservices\.com\/.*$/]]
    ]);
    ND("OmidSessionClient.verificationVendorIdForScriptUrl", function(a) {
        for (var b = x(OD.keys()), c = b.next(); !c.done; c = b.next()) {
            c = c.value;
            for (var d = x(OD.get(c)), e = d.next(); !e.done; e = d.next())
                if (e.value.test(a)) return c
        }
        return 1
    });
    ND("OmidSessionClient.VerificationVendorId", {
        OTHER: 1,
        MOAT: 2,
        DOUBLEVERIFY: 3,
        INTEGRAL_AD_SCIENCE: 4,
        PIXELATE: 5,
        NIELSEN: 6,
        COMSCORE: 7,
        MEETRICS: 8,
        GOOGLE: 9
    });
    var PD = /OS (\S+) like/,
        QD = /Android ([\d\.]+)/;

    function RD(a, b) {
        a = (a = a.exec(Fb())) ? a[1] : "";
        a = a.replace(/_/g, ".");
        return Cb(a, b) >= 0
    }
    var SD = function() {
            return yc || uc && "ontouchstart" in document.documentElement
        },
        TD = function(a) {
            return Ac && RD(PD, a)
        },
        UD = function(a) {
            return (a = a === void 0 ? null : a) && typeof a.getAttribute === "function" ? a.getAttribute("playsinline") ? !0 : !1 : !1
        };
    var VD = function(a) {
        Q.call(this);
        this.j = a;
        this.A = this.B = !1;
        this.C = this.F = 0;
        this.g = new Lw(1E3);
        Cr(this, this.g);
        Xv(this.g, "tick", this.G, !1, this);
        Xv(this.j, "pause", this.l, !1, this);
        Xv(this.j, "playing", this.l, !1, this);
        Xv(this.j, "ended", this.l, !1, this);
        Xv(this.j, "timeupdate", this.l, !1, this)
    };
    w(VD, Q);
    var WD = function(a) {
        var b;
        return (b = a.j.currentTime) != null ? b : a.j.getCurrentTime()
    };
    VD.prototype.l = function(a) {
        switch (a.type) {
            case "playing":
                XD(this);
                break;
            case "pause":
            case "ended":
                this.g.enabled && this.g.stop();
                break;
            case "timeupdate":
                !this.B && WD(this) > 0 && (this.B = !0, XD(this))
        }
    };
    var XD = function(a) {
        !a.g.enabled && a.B && (a.F = WD(a) * 1E3, a.C = Date.now(), a.A = !1, a.g.start())
    };
    VD.prototype.G = function() {
        var a = Date.now(),
            b = a - this.C,
            c = WD(this) * 1E3;
        c - this.F < b * .5 ? this.A || (this.A = !0, this.dispatchEvent("playbackStalled")) : this.A = !1;
        this.F = c;
        this.C = a
    };
    var YD = "://secure-...imrworldwide.com/ ://cdn.imrworldwide.com/ ://aksecure.imrworldwide.com/ ://[^.]*.moatads.com ://youtube[0-9]+.moatpixel.com ://pm.adsafeprotected.com/youtube ://pm.test-adsafeprotected.com/youtube ://e[0-9]+.yt.srs.doubleverify.com www.google.com/pagead/xsul www.youtube.com/pagead/slav".split(" "),
        ZD = /\bocr\b/;

    function $D(a) {
        if (wb(Ri(a)) || qc && a.length > 2048) return !1;
        try {
            if ((new TC(a)).F().match(ZD)) return !0
        } catch (b) {}
        return YD.find(function(b) {
            return a.match(b) != null
        }) != null
    };

    function aE(a, b) {
        return wb(b) ? !1 : (new RegExp(a)).test(b)
    }

    function bE(a) {
        var b = {};
        a.split(",").forEach(function(c) {
            var d = c.split("=");
            d.length == 2 && (c = xb(d[0]), d = xb(d[1]), c.length > 0 && (b[c] = d))
        });
        return b
    }

    function cE(a) {
        var b = "af am ar_eg ar_sa ar_xb ar be bg bn ca cs da de_at de_cn de el en_au en_ca en_gb en_ie en_in en_sg en_xa en_xc en_za en es_419 es_ar es_bo es_cl es_co es_cr es_do es_ec es_gt es_hn es_mx es_ni es_pa es_pe es_pr es_py es_sv es_us es_uy es_ve es et eu fa fi fil fr_ca fr_ch fr gl gsw gu he hi hr hu id in is it iw ja kn ko ln lo lt lv ml mo mr ms nb ne nl no pl pt_br pt_pt pt ro ru sk sl sr_latn sr sv sw ta te th tl tr uk ur vi zh_cn zh_hk zh_tw zh zu".split(" ");
        if (!a) return null;
        a = a.toLowerCase().replace("-", "_");
        if (b.includes(a)) return a;
        a = (a = a.match(/^\w{2,3}([-_]|$)/)) ? a[0].replace(/[_-]/g, "") : "";
        return b.includes(a) ? a : null
    };
    var dE = function() {
        this.g = Date.now()
    };
    dE.prototype.reset = function() {
        this.g = Date.now()
    };
    var eE = function(a) {
        a = a.g + 5E3 - Date.now();
        return a > 0 ? a : 0
    };
    var fE = function(a, b) {
        this.url = a;
        this.g = b === void 0 ? null : b
    };
    var gE = function(a) {
        switch (a) {
            case 0:
                return "No Error";
            case 1:
                return "Access denied to content document";
            case 2:
                return "File not found";
            case 3:
                return "Firefox silently errored";
            case 4:
                return "Application custom error";
            case 5:
                return "An exception occurred";
            case 6:
                return "Http response at 400 or 500 level";
            case 7:
                return "Request was aborted";
            case 8:
                return "Request timed out";
            case 9:
                return "The resource is not available offline";
            default:
                return "Unrecognized error code"
        }
    };
    var hE = function(a) {
        var b = Error.call(this, a);
        this.message = b.message;
        "stack" in b && (this.stack = b.stack);
        this.errorCode = a
    };
    w(hE, Error);

    function iE(a) {
        a = a === null ? "null" : a === void 0 ? "undefined" : a;
        var b = yi();
        return new Ii(b ? b.createHTML(a) : a)
    };
    var jE = function(a) {
        P.call(this);
        this.o = a;
        this.j = {}
    };
    ib(jE, P);
    var kE = [];
    jE.prototype.listen = function(a, b, c, d) {
        return lE(this, a, b, c, d)
    };
    var lE = function(a, b, c, d, e, f) {
        Array.isArray(c) || (c && (kE[0] = c.toString()), c = kE);
        for (var g = 0; g < c.length; g++) {
            var h = Xv(b, c[g], d || a.handleEvent, e || !1, f || a.o || a);
            if (!h) break;
            a.j[h.key] = h
        }
        return a
    };
    jE.prototype.dc = function(a, b, c, d) {
        return mE(this, a, b, c, d)
    };
    var mE = function(a, b, c, d, e, f) {
        if (Array.isArray(c))
            for (var g = 0; g < c.length; g++) mE(a, b, c[g], d, e, f);
        else {
            b = Wv(b, c, d || a.handleEvent, e, f || a.o || a);
            if (!b) return a;
            a.j[b.key] = b
        }
        return a
    };
    jE.prototype.rb = function(a, b, c, d, e) {
        if (Array.isArray(b))
            for (var f = 0; f < b.length; f++) this.rb(a, b[f], c, d, e);
        else c = c || this.handleEvent, d = Wa(d) ? !!d.capture : !!d, e = e || this.o || this, c = Yv(c), d = !!d, b = Mv(a) ? a.Vb(b, c, d, e) : a ? (a = $v(a)) ? a.Vb(b, c, d, e) : null : null, b && (ew(b), delete this.j[b.key])
    };
    var nE = function(a) {
        Zh(a.j, function(b, c) {
            this.j.hasOwnProperty(c) && ew(b)
        }, a);
        a.j = {}
    };
    jE.prototype.O = function() {
        jE.Ia.O.call(this);
        nE(this)
    };
    jE.prototype.handleEvent = function() {
        throw Error("EventHandler.handleEvent not implemented");
    };
    var oE = function() {
        Q.call(this);
        this.headers = new Map;
        this.j = !1;
        this.g = null;
        this.H = "";
        this.A = 0;
        this.l = this.G = this.B = this.F = !1;
        this.K = 0;
        this.C = null;
        this.U = "";
        this.M = !1
    };
    ib(oE, Q);
    var pE = /^https?$/i,
        qE = ["POST", "PUT"],
        tE = function(a, b, c, d) {
            if (a.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + a.H + "; newUri=" + b);
            c = c ? c.toUpperCase() : "GET";
            a.H = b;
            a.A = 0;
            a.F = !1;
            a.j = !0;
            a.g = new XMLHttpRequest;
            a.g.onreadystatechange = hw(db(a.P, a));
            try {
                a.G = !0, a.g.open(c, String(b), !0), a.G = !1
            } catch (g) {
                rE(a);
                return
            }
            b = d || "";
            d = new Map(a.headers);
            var e = Array.from(d.keys()).find(function(g) {
                    return "content-type" == g.toLowerCase()
                }),
                f = y.FormData && b instanceof y.FormData;
            !bc(qE, c) || e || f || d.set("Content-Type",
                "application/x-www-form-urlencoded;charset=utf-8");
            c = x(d);
            for (d = c.next(); !d.done; d = c.next()) e = x(d.value), d = e.next().value, e = e.next().value, a.g.setRequestHeader(d, e);
            a.U && (a.g.responseType = a.U);
            "withCredentials" in a.g && a.g.withCredentials !== a.M && (a.g.withCredentials = a.M);
            try {
                sE(a), a.K > 0 && (a.C = setTimeout(a.Z.bind(a), a.K)), a.B = !0, a.g.send(b), a.B = !1
            } catch (g) {
                rE(a)
            }
        };
    oE.prototype.Z = function() {
        typeof Ra != "undefined" && this.g && (this.A = 8, this.dispatchEvent("timeout"), this.abort(8))
    };
    var rE = function(a) {
            a.j = !1;
            a.g && (a.l = !0, a.g.abort(), a.l = !1);
            a.A = 5;
            uE(a);
            vE(a)
        },
        uE = function(a) {
            a.F || (a.F = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"))
        };
    oE.prototype.abort = function(a) {
        this.g && this.j && (this.j = !1, this.l = !0, this.g.abort(), this.l = !1, this.A = a || 7, this.dispatchEvent("complete"), this.dispatchEvent("abort"), vE(this))
    };
    oE.prototype.O = function() {
        this.g && (this.j && (this.j = !1, this.l = !0, this.g.abort(), this.l = !1), vE(this, !0));
        oE.Ia.O.call(this)
    };
    oE.prototype.P = function() {
        this.Ea() || (this.G || this.B || this.l ? wE(this) : this.V())
    };
    oE.prototype.V = function() {
        wE(this)
    };
    var wE = function(a) {
            if (a.j && typeof Ra != "undefined")
                if (a.B && (a.g ? a.g.readyState : 0) == 4) setTimeout(a.P.bind(a), 0);
                else if (a.dispatchEvent("readystatechange"), (a.g ? a.g.readyState : 0) == 4) {
                a.j = !1;
                try {
                    var b = xE(a);
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
                    var d;
                    if (!(d = c)) {
                        var e;
                        if (e = b === 0) {
                            var f = String(a.H).match(Xi)[1] || null;
                            !f && y.self && y.self.location && (f = y.self.location.protocol.slice(0, -1));
                            e = !pE.test(f ? f.toLowerCase() : "")
                        }
                        d = e
                    }
                    d ? (a.dispatchEvent("complete"),
                        a.dispatchEvent("success")) : (a.A = 6, uE(a))
                } finally {
                    vE(a)
                }
            }
        },
        vE = function(a, b) {
            if (a.g) {
                sE(a);
                var c = a.g;
                a.g = null;
                b || a.dispatchEvent("ready");
                try {
                    c.onreadystatechange = null
                } catch (d) {}
            }
        },
        sE = function(a) {
            a.C && (clearTimeout(a.C), a.C = null)
        };
    oE.prototype.isActive = function() {
        return !!this.g
    };
    var xE = function(a) {
            try {
                return (a.g ? a.g.readyState : 0) > 2 ? a.g.status : -1
            } catch (b) {
                return -1
            }
        },
        yE = function(a) {
            if (a.g) {
                a: {
                    a = a.g.responseText;
                    if (y.JSON) try {
                        var b = y.JSON.parse(a);
                        break a
                    } catch (c) {}
                    b = Fl(a)
                }
                return b
            }
        };
    var zE = function() {};
    zE.prototype.get = function(a) {
        return AE({
            url: a.url,
            timeout: a.timeout,
            withCredentials: a.withCredentials === void 0 ? !0 : a.withCredentials,
            method: "GET",
            headers: a.headers === void 0 ? {} : a.headers
        })
    };
    var AE = function(a) {
            var b = a.url;
            var c = a.timeout;
            var d = a.withCredentials;
            var e = a.method;
            var f = a.content === void 0 ? void 0 : a.content;
            var g = a.headers === void 0 ? {} : a.headers;
            return BE({
                url: b,
                timeout: c,
                withCredentials: d,
                method: e,
                content: f,
                headers: g
            }).then(function(h) {
                return Promise.resolve(h)
            }, function(h) {
                return h instanceof Error && h.message == 6 && d ? BE({
                    url: b,
                    timeout: c,
                    withCredentials: !d,
                    method: e,
                    content: f,
                    headers: g
                }) : Promise.reject(h)
            })
        },
        BE = function(a) {
            var b = a.url;
            var c = a.timeout;
            var d = a.withCredentials;
            var e =
                a.method;
            var f = a.content === void 0 ? void 0 : a.content;
            a = a.headers === void 0 ? {} : a.headers;
            var g = new oE;
            g.M = d;
            g.K = Math.max(0, eE(c));
            for (var h in a) g.headers.set(h, a[h]);
            var k = new jE;
            return new Promise(function(l, p) {
                k.dc(g, "success", function() {
                    a: {
                        if (Uq()) try {
                            yE(g);
                            var n = "application/json";
                            break a
                        } catch (u) {
                            n = "application/xml";
                            break a
                        }
                        g.g && (g.g ? g.g.readyState : 0) == 4 ? (n = g.g.getResponseHeader("Content-Type"), n = n === null ? void 0 : n) : n = void 0;n = n || ""
                    }
                    if (n.indexOf("application/json") != -1) try {
                        l(yE(g) || {})
                    } catch (u) {
                        p(new hE(5,
                            xE(g)))
                    } else {
                        try {
                            var q = g.g ? g.g.responseXML : null
                        } catch (u) {
                            q = null
                        }
                        if (q == null) {
                            try {
                                var t = g.g ? g.g.responseText : ""
                            } catch (u) {
                                t = ""
                            }
                            if (typeof DOMParser != "undefined") q = new DOMParser, t = iE(t), q = q.parseFromString(Ji(t), "application/xml");
                            else throw Error("Your browser does not support loading xml documents");
                        }
                        l(q)
                    }
                    k.dispose();g.dispose()
                });
                k.dc(g, ["error", "timeout"], function() {
                    p(new hE(g.A, xE(g)));
                    k.dispose();
                    g.dispose()
                });
                tE(g, uD(b), e, f)
            })
        };
    z("google.javascript.ads.imalib.common.UrlLoader", zE);
    var CE = RegExp("^(https?:)?\\/\\/ad\\.doubleclick\\.net/ddm/track(imp|clk)");

    function DE() {
        return wn("attribution-reporting")
    }
    var HE = function(a, b, c, d, e) {
            c = c === void 0 ? !1 : c;
            e = e === void 0 ? null : e;
            try {
                b = (d === void 0 ? 0 : d) ? uD(b, "https") : uD(b);
                CE.test(b) && (b = b.replace("?", ";tpsrc=ima?"), e = e || "");
                c = c || $D(b);
                var f = e != null && window.fetch != null;
                if (a.j || f) EE(a, b, c, e);
                else {
                    var g = DE() ? e : null;
                    Uq() ? FE(b) : GE(a, b, c, g)
                }
            } catch (h) {}
        },
        IE = function(a, b) {
            var c = {
                keepalive: !0,
                method: "get",
                redirect: "follow",
                credentials: "include"
            };
            a && (c.referrerPolicy = "no-referrer");
            b ? "setAttributionReporting" in XMLHttpRequest.prototype ? (c.attributionReporting = {
                eventSourceEligible: !0,
                triggerEligible: !1
            }, c.mode = "no-cors") : c.headers = {
                "Attribution-Reporting-Eligible": "event-source"
            } : c.mode = "no-cors";
            return c
        },
        EE = function(a, b, c, d) {
            d = d === void 0 ? null : d;
            L(K.getInstance(), "faa", "1");
            L(K.getInstance(), "alp", d === null ? "0" : "1");
            var e = DE();
            L(K.getInstance(), "arpa", e ? "1" : "0");
            fetch(b, IE(c, d === "" && e)).then(function() {
                L(K.getInstance(), "fas", "1")
            }).catch(function() {
                L(K.getInstance(), "faf", "1");
                a.j = !1;
                var f = d;
                f = DE() ? f : null;
                Uq() ? FE(b) : GE(a, b, c, f)
            });
            e && d && fetch(d, IE(c, !0))
        },
        GE = function(a, b, c, d) {
            var e =
                new Image,
                f = (a.l++).toString();
            a.g.set(f, e);
            e.onload = e.onerror = function() {
                a.g.delete(f)
            };
            c && (e.referrerPolicy = "no-referrer");
            d != null && (e.attributionSrc = d);
            e.src = b
        },
        FE = function(a) {
            (new zE).get({
                url: a,
                timeout: new dE
            })
        };
    var JE = {
        AUTOPLAY_DISALLOWED: "autoplayDisallowed",
        Eh: "beginFullscreen",
        CAN_PLAY: "canPlay",
        CAN_PLAY_THROUGH: "canPlayThrough",
        CLICK: "click",
        DURATION_CHANGE: "durationChange",
        Ph: "end",
        Qh: "endFullscreen",
        ERROR: "error",
        Uh: "focusSkipButton",
        LOAD_START: "loadStart",
        LOADED: "loaded",
        yi: "mediaLoadTimeout",
        zi: "mediaPlaybackTimeout",
        PAUSE: "pause",
        PLAY: "play",
        PLAYING: "playing",
        SEEKED: "seeked",
        SEEKING: "seeking",
        Li: "skip",
        Of: "skipShown",
        STALLED: "stalled",
        te: "start",
        TIME_UPDATE: "timeUpdate",
        Oi: "timedMetadata",
        Xi: "volumeChange",
        WAITING: "waiting",
        Yi: "windowFocusChanged",
        Vh: "fullyLoaded"
    };
    var KE = function() {
        Q.apply(this, arguments)
    };
    w(KE, Q);
    KE.prototype.C = function() {
        return !1
    };
    KE.prototype.F = function() {
        return -1
    };
    KE.prototype.G = function() {};
    var LE = {},
        ME = (LE[18] = -1, LE[22] = -1, LE[43] = 350, LE[44] = 350, LE[45] = 350, LE[59] = -1, LE[133] = 350, LE[134] = 350, LE[135] = 350, LE[136] = 350, LE[139] = 50, LE[140] = 50, LE[141] = 50, LE[160] = 350, LE[242] = 150, LE[243] = 150, LE[244] = 150, LE[245] = 150, LE[247] = 150, LE[249] = 50, LE[250] = 50, LE[251] = 50, LE[278] = 150, LE[342] = -1, LE[343] = -1, LE[344] = -1, LE[345] = -1, LE[346] = -1, LE[347] = -1, LE),
        NE = {},
        OE = (NE[18] = !1, NE[22] = !1, NE[43] = !0, NE[44] = !0, NE[45] = !0, NE[59] = !1, NE[133] = !0, NE[134] = !0, NE[135] = !0, NE[136] = !0, NE[139] = !0, NE[140] = !0, NE[141] = !0, NE[160] = !0,
            NE[242] = !0, NE[243] = !0, NE[244] = !0, NE[245] = !0, NE[247] = !0, NE[249] = !0, NE[250] = !0, NE[251] = !0, NE[278] = !0, NE[342] = !1, NE[343] = !1, NE[344] = !1, NE[345] = !1, NE[346] = !1, NE[347] = !1, NE),
        PE = {},
        QE = (PE[18] = "video/mp4", PE[22] = "video/mp4", PE[43] = "video/webm", PE[44] = "video/webm", PE[45] = "video/webm", PE[59] = "video/mp4", PE[133] = "video/mp4", PE[134] = "video/mp4", PE[135] = "video/mp4", PE[136] = "video/mp4", PE[139] = "audio/mp4", PE[140] = "audio/mp4", PE[141] = "audio/mp4", PE[160] = "video/mp4", PE[242] = "video/webm", PE[243] = "video/webm", PE[244] =
            "video/webm", PE[245] = "video/webm", PE[247] = "video/webm", PE[249] = "audio/webm", PE[250] = "audio/webm", PE[251] = "audio/webm", PE[278] = "video/webm", PE[342] = "video/mp4", PE[343] = "video/mp4", PE[344] = "video/mp4", PE[345] = "video/mp4", PE[346] = "video/mp4", PE[347] = "video/mp4", PE),
        RE = {},
        SE = (RE[18] = "avc1.42001E, mp4a.40.2", RE[22] = "avc1.64001F, mp4a.40.2", RE[43] = "vp8, vorbis", RE[44] = "vp8, vorbis", RE[45] = "vp8, vorbis", RE[59] = "avc1.4D001F, mp4a.40.2", RE[133] = "avc1.4D401E", RE[134] = "avc1.4D401E", RE[135] = "avc1.4D401E", RE[136] =
            "avc1.4D401E", RE[139] = "mp4a.40.2", RE[140] = "mp4a.40.2", RE[141] = "mp4a.40.2", RE[160] = "avc1.4D401E", RE[242] = "vp9", RE[243] = "vp9", RE[244] = "vp9", RE[245] = "vp9", RE[247] = "vp9", RE[249] = "opus", RE[250] = "opus", RE[251] = "opus", RE[278] = "vp9", RE[342] = "avc1.42E01E, mp4a.40.2", RE[343] = "avc1.42E01E, mp4a.40.2", RE[344] = "avc1.42E01E, mp4a.40.2", RE[345] = "avc1.42E01E, mp4a.40.2", RE[346] = "avc1.42E01E, mp4a.40.2", RE[347] = "avc1.4D001F, mp4a.40.2", RE);
    var TE = RegExp("/itag/(\\d+)/");

    function UE(a) {
        var b = Number(aj(a, "itag"));
        return b ? b : (a = a.match(TE)) && a.length === 2 ? Number(a[1]) : null
    }

    function VE(a) {
        var b = QE[a];
        a = SE[a];
        b ? (b = Ri(b).toLowerCase(), b = a ? b + '; codecs="' + Ri(a) + '"' : b) : b = "";
        return b
    }

    function WE(a, b) {
        if (typeof CustomEvent === "function") return new CustomEvent(a, {
            detail: b
        });
        var c = document.createEvent("CustomEvent");
        c.initCustomEvent(a, !1, !0, b);
        return c
    };
    var XE = function(a, b) {
        KE.call(this);
        var c = this;
        this.j = b;
        this.B = this.l = this.g = 0;
        this.A = null;
        this.uri = new TC(a);
        this.state = 0;
        var d;
        this.H = (d = this.j) == null ? void 0 : d.initialize();
        Br(this, function() {
            Ar(c.j)
        })
    };
    w(XE, KE);
    XE.prototype.F = function() {
        return this.g
    };
    XE.prototype.C = function() {
        return this.state === 3
    };
    XE.prototype.G = function(a) {
        this.state === 1 ? (this.g += a, this.state = 2) : this.state === 0 && (this.g += a, this.state = 1, YE(this))
    };
    var YE = function(a) {
            La(function(b) {
                if (b.g == 1) return a.state === 2 && (a.state = 1), Aa(b, ZE(a), 4);
                var c = a.B > 3;
                if (c) {
                    a.A === null && (a.A = 400);
                    var d = WE("media_source_error", {
                        code: a.l > 0 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                        message: 'Response code "' + a.A + '" with ' + a.g + " bytes requested and " + a.l + " bytes loaded"
                    });
                    a.dispatchEvent(d)
                }
                a.l < a.g && a.state !== 3 && !c ? b.g = 1 : (a.state !== 3 && (a.state = 0), b.g = 0)
            })
        },
        ZE = function(a) {
            var b;
            return La(function(c) {
                switch (c.g) {
                    case 1:
                        b = a.l + "-" + (a.g - 1);
                        gD(a.uri,
                            "range", b);
                        if (!a.j) {
                            c.g = 2;
                            break
                        }
                        return Aa(c, a.H, 3);
                    case 3:
                        return c.return($E(a));
                    case 2:
                        return c.l = 4, Aa(c, aF(a), 6);
                    case 6:
                        Ba(c);
                        break;
                    case 4:
                        Da(c), a.B++, c.g = 0
                }
            })
        },
        $E = function(a) {
            var b;
            return La(function(c) {
                switch (c.g) {
                    case 1:
                        return a.j ? Aa(c, a.j.Wb(a.uri), 2) : c.return(Promise.reject());
                    case 2:
                        if (b = c.j) return b.xa && (a.state = 3), bF(a, b.video), c.return();
                        c.l = 3;
                        return Aa(c, aF(a), 5);
                    case 5:
                        Ba(c);
                        break;
                    case 3:
                        Da(c), a.B++, c.g = 0
                }
            })
        },
        aF = function(a) {
            var b, c, d, e, f, g, h;
            return La(function(k) {
                if (k.g == 1) return b = 0,
                    c = a.g - a.l, Aa(k, fetch(a.uri.toString()), 2);
                d = k.j;
                if (d.status >= 400) return L(K.getInstance(), "lvlfes", d.status.toString()), a.A = d.status, k.return(Promise.reject());
                f = (e = d.body) == null ? void 0 : e.getReader();
                if (!f) return Dl("lvlmr"), a.A = d.status, k.return(Promise.reject());
                g = [];
                h = function() {
                    var l, p, n, q, t, u;
                    return La(function(v) {
                        if (v.g == 1) return Aa(v, f.read(), 2);
                        l = v.j;
                        p = l.done;
                        n = l.value;
                        if (p) return q = b < c, cF(a, g, q), v.return();
                        g.push(n);
                        b += (t = n) == null ? void 0 : t.length;
                        bF(a, (u = n) == null ? void 0 : u.buffer);
                        return Aa(v,
                            h(), 0)
                    })
                };
                return Aa(k, h(), 0)
            })
        },
        cF = function(a, b, c) {
            c && (a.state = 3, bF(a, new ArrayBuffer(0)));
            var d = new Uint8Array(b.reduce(function(g, h) {
                    return g + h.length
                }, 0)),
                e = 0;
            b = x(b);
            for (var f = b.next(); !f.done; f = b.next()) f = f.value, d.set(f, e), e += f.length;
            a.j && d.buffer.byteLength > 0 && a.j.wc(d.buffer, a.uri, 0, c)
        },
        bF = function(a, b) {
            b !== null && (b = b.slice(0), a.l += b.byteLength, a.dispatchEvent({
                type: "progress",
                rd: b
            }))
        };
    XE.prototype.O = function() {
        var a;
        ((a = this.j) == null ? 0 : a.Ta()) && this.j.close();
        KE.prototype.O.call(this)
    };
    var eF = function(a) {
            this.uri = a;
            this.g = dF(a)
        },
        dF = function(a) {
            return new Map(a.j.split("/").reduce(function(b, c, d, e) {
                d % 2 && b.set(e[d - 1], c);
                return b
            }, new Map))
        },
        fF = function(a) {
            var b, c;
            return (b = a.uri) == null ? void 0 : (c = b.j) == null ? void 0 : c.startsWith("/videoplayback")
        };
    eF.prototype.getId = function() {
        return gF(this, "id")
    };
    var hF = function(a) {
            a = hD(a.uri, "range");
            if (!a) return null;
            a = a.split("-")[0];
            return !a || isNaN(Number(a)) ? null : Number(a)
        },
        gF = function(a, b) {
            var c = hD(a.uri, b);
            return c ? c : (a = a.g.get(b)) ? a : null
        };
    var iF = function() {};
    var jF = ["doubleclick.net"];

    function kF() {
        if (Qb() || A("iPad") || A("iPod")) var a = !1;
        else if (Pb()) {
            if (pD === void 0) {
                a: {
                    if (nD === void 0) {
                        if (rD) {
                            a = yb(qD(), "Safari");
                            var b = (new TC(window.location.href)).l.Fb("js");
                            b: {
                                if ((b = b.length ? b[0] : "") && b.lastIndexOf("afma-", 0) == 0) {
                                    var c = b.lastIndexOf("v");
                                    if (c > -1 && (b = b.substr(c + 1).match(/^(\d+\.\d+\.\d+|^\d+\.\d+|^\d+)(-.*)?$/))) {
                                        b = b[1];
                                        break b
                                    }
                                }
                                b = "0.0.0"
                            }
                            if (!a || b !== "0.0.0") {
                                a = nD = !0;
                                break a
                            }
                        }
                        nD = !1
                    }
                    a = nD
                }
                a || (oD === void 0 && (oD = yb(qD(), "afma-sdk-a") ? !0 : !1), a = oD);pD = a
            }
            a = pD ? !0 : Xh() ? !1 : lF()
        } else a = !1;
        return a
    }

    function lF() {
        var a = !1,
            b = (new TC(window.location.href)).g;
        jF.forEach(function(c) {
            b.includes(c) && (a = !0)
        });
        return a
    };
    var mF, pF = function(a, b, c) {
        if (typeof a === "number") var d = {
            name: nF(a)
        };
        else d = a, a = oF(a.name);
        this.code = a;
        this.g = d;
        b = "Error " + b + ": " + this.getName();
        c && (b += ", " + c);
        jb.call(this, b)
    };
    ib(pF, jb);
    pF.prototype.getName = function() {
        return this.g.name || ""
    };
    var qF = {
            Qf: 1,
            Di: 2,
            NOT_FOUND_ERR: 3,
            xf: 4,
            Af: 5,
            Ei: 6,
            Pf: 7,
            ABORT_ERR: 8,
            Mf: 9,
            Ri: 10,
            TIMEOUT_ERR: 11,
            Lf: 12,
            INVALID_ACCESS_ERR: 13,
            INVALID_STATE_ERR: 14
        },
        rF = (y.g || y.j || qF).Qf,
        sF = (y.g || y.j || qF).NOT_FOUND_ERR,
        tF = (y.g || y.j || qF).xf,
        uF = (y.g || y.j || qF).Af,
        vF = (y.g || y.j || qF).Pf,
        wF = (y.g || y.j || qF).ABORT_ERR,
        xF = (y.g || y.j || qF).Mf,
        yF = (y.g || y.j || qF).TIMEOUT_ERR,
        zF = (y.g || y.j || qF).Lf,
        AF = (y.DOMException || qF).INVALID_ACCESS_ERR,
        BF = (y.DOMException || qF).INVALID_STATE_ERR,
        oF = function(a) {
            switch (a) {
                case "UnknownError":
                    return rF;
                case "NotFoundError":
                    return sF;
                case "ConstraintError":
                    return tF;
                case "DataError":
                    return uF;
                case "TransactionInactiveError":
                    return vF;
                case "AbortError":
                    return wF;
                case "ReadOnlyError":
                    return xF;
                case "TimeoutError":
                    return yF;
                case "QuotaExceededError":
                    return zF;
                case "InvalidAccessError":
                    return AF;
                case "InvalidStateError":
                    return BF;
                default:
                    return rF
            }
        },
        nF = function(a) {
            switch (a) {
                case rF:
                    return "UnknownError";
                case sF:
                    return "NotFoundError";
                case tF:
                    return "ConstraintError";
                case uF:
                    return "DataError";
                case vF:
                    return "TransactionInactiveError";
                case wF:
                    return "AbortError";
                case xF:
                    return "ReadOnlyError";
                case yF:
                    return "TimeoutError";
                case zF:
                    return "QuotaExceededError";
                case AF:
                    return "InvalidAccessError";
                case BF:
                    return "InvalidStateError";
                default:
                    return "UnknownError"
            }
        },
        CF = function(a, b) {
            return "error" in a ? new pF(a.error, b) : new pF({
                name: "UnknownError"
            }, b)
        },
        DF = function(a, b) {
            return "name" in a ? new pF(a, b + ": " + a.message) : new pF({
                name: "UnknownError"
            }, b)
        };
    var EF = function(a) {
            this.g = a
        },
        FF = y.IDBKeyRange || y.webkitIDBKeyRange;
    /*

     Copyright 2005, 2007 Bob Ippolito. All Rights Reserved.
     Copyright The Closure Library Authors.
     SPDX-License-Identifier: MIT
    */
    var GF = function() {
        this.A = [];
        this.o = this.l = !1;
        this.j = void 0;
        this.L = this.G = this.C = !1;
        this.B = 0;
        this.g = null;
        this.J = 0
    };
    GF.prototype.cancel = function(a) {
        if (this.l) this.j instanceof GF && this.j.cancel();
        else {
            if (this.g) {
                var b = this.g;
                delete this.g;
                a ? b.cancel(a) : (b.J--, b.J <= 0 && b.cancel())
            }
            this.L = !0;
            this.l || HF(this, new IF(this))
        }
    };
    GF.prototype.F = function(a, b) {
        this.C = !1;
        JF(this, a, b)
    };
    var JF = function(a, b, c) {
            a.l = !0;
            a.j = c;
            a.o = !b;
            KF(a)
        },
        MF = function(a) {
            if (a.l) {
                if (!a.L) throw new LF(a);
                a.L = !1
            }
        };
    GF.prototype.Ca = function(a) {
        MF(this);
        JF(this, !0, a)
    };
    var HF = function(a, b) {
            MF(a);
            JF(a, !1, b)
        },
        OF = function(a, b) {
            return NF(a, b, null)
        },
        NF = function(a, b, c, d) {
            a.A.push([b, c, d]);
            a.l && KF(a);
            return a
        };
    GF.prototype.then = function(a, b, c) {
        var d, e, f = new ww(function(g, h) {
            e = g;
            d = h
        });
        NF(this, e, function(g) {
            g instanceof IF ? f.cancel() : d(g);
            return PF
        }, this);
        return f.then(a, b, c)
    };
    GF.prototype.$goog_Thenable = !0;
    var QF = function(a) {
            return Xb(a.A, function(b) {
                return typeof b[1] === "function"
            })
        },
        PF = {},
        KF = function(a) {
            if (a.B && a.l && QF(a)) {
                var b = a.B,
                    c = RF[b];
                c && (y.clearTimeout(c.g), delete RF[b]);
                a.B = 0
            }
            a.g && (a.g.J--, delete a.g);
            b = a.j;
            for (var d = c = !1; a.A.length && !a.C;) {
                var e = a.A.shift(),
                    f = e[0],
                    g = e[1];
                e = e[2];
                if (f = a.o ? g : f) try {
                    var h = f.call(e || null, b);
                    h === PF && (h = void 0);
                    h !== void 0 && (a.o = a.o && (h == b || h instanceof Error), a.j = b = h);
                    if (uw(b) || typeof y.Promise === "function" && b instanceof y.Promise) d = !0, a.C = !0
                } catch (k) {
                    b = k, a.o = !0,
                        QF(a) || (c = !0)
                }
            }
            a.j = b;
            d && (h = db(a.F, a, !0), d = db(a.F, a, !1), b instanceof GF ? (NF(b, h, d), b.G = !0) : b.then(h, d));
            c && (b = new SF(b), RF[b.g] = b, a.B = b.g)
        },
        LF = function() {
            jb.call(this)
        };
    ib(LF, jb);
    LF.prototype.message = "Deferred has already fired";
    LF.prototype.name = "AlreadyCalledError";
    var IF = function() {
        jb.call(this)
    };
    ib(IF, jb);
    IF.prototype.message = "Deferred was canceled";
    IF.prototype.name = "CanceledError";
    var SF = function(a) {
        this.g = y.setTimeout(db(this.l, this), 0);
        this.j = a
    };
    SF.prototype.l = function() {
        delete RF[this.g];
        throw this.j;
    };
    var RF = {};
    var TF = function() {
        Q.call(this)
    };
    ib(TF, Q);
    TF.prototype.g = null;
    TF.prototype.next = function(a) {
        if (a) this.g["continue"](a);
        else this.g["continue"]()
    };
    TF.prototype.remove = function() {
        var a = new GF;
        try {
            var b = this.g["delete"]()
        } catch (c) {
            return HF(a, DF(c, "deleting via cursor")), a
        }
        b.onsuccess = function() {
            a.Ca()
        };
        b.onerror = function(c) {
            HF(a, CF(c.target, "deleting via cursor"))
        };
        return a
    };
    TF.prototype.getValue = function() {
        return this.g.value
    };
    var UF = function(a, b) {
        var c = new TF;
        try {
            var d = a.openCursor(b ? b.g : null)
        } catch (e) {
            throw c.dispose(), DF(e, a.name);
        }
        d.onsuccess = function(e) {
            c.g = e.target.result || null;
            c.g ? c.dispatchEvent("n") : c.dispatchEvent("c")
        };
        d.onerror = function() {
            c.dispatchEvent("e")
        };
        return c
    };
    var VF = function(a) {
        this.g = a
    };
    VF.prototype.getName = function() {
        return this.g.name
    };
    var WF = function(a, b, c) {
        var d = new GF;
        try {
            var e = a.g.get(c)
        } catch (f) {
            return b += " with key " + Mi(c), HF(d, DF(f, b)), d
        }
        e.onsuccess = function(f) {
            d.Ca(f.target.result)
        };
        e.onerror = function(f) {
            b += " with key " + Mi(c);
            HF(d, CF(f.target, b))
        };
        return d
    };
    VF.prototype.get = function(a) {
        return WF(this, "getting from index " + this.getName(), a)
    };
    var XF = function(a, b) {
        return UF(a.g, b)
    };
    var YF = function(a) {
        this.g = a
    };
    YF.prototype.getName = function() {
        return this.g.name
    };
    var ZF = function(a, b, c, d, e) {
            var f = new GF;
            try {
                var g = e ? a.g[b](d, e) : a.g[b](d)
            } catch (h) {
                return c += Mi(d), e && (c += ", with key " + Mi(e)), HF(f, DF(h, c)), f
            }
            g.onsuccess = function(h) {
                f.Ca(h.target.result)
            };
            g.onerror = function(h) {
                c += Mi(d);
                e && (c += ", with key " + Mi(e));
                HF(f, CF(h.target, c))
            };
            return f
        },
        $F = function(a, b) {
            return ZF(a, "put", "putting into " + a.getName() + " with value", b)
        };
    YF.prototype.add = function(a, b) {
        return ZF(this, "add", "adding into " + this.getName() + " with value ", a, b)
    };
    YF.prototype.remove = function(a) {
        var b = new GF;
        try {
            var c = this.g["delete"](a instanceof EF ? a.g : a)
        } catch (e) {
            return c = "removing from " + this.getName() + " with key " + Mi(a), HF(b, DF(e, c)), b
        }
        c.onsuccess = function() {
            b.Ca()
        };
        var d = this;
        c.onerror = function(e) {
            var f = "removing from " + d.getName() + " with key " + Mi(a);
            HF(b, CF(e.target, f))
        };
        return b
    };
    YF.prototype.get = function(a) {
        var b = new GF;
        try {
            var c = this.g.get(a)
        } catch (e) {
            return c = "getting from " + this.getName() + " with key " + Mi(a), HF(b, DF(e, c)), b
        }
        c.onsuccess = function(e) {
            b.Ca(e.target.result)
        };
        var d = this;
        c.onerror = function(e) {
            var f = "getting from " + d.getName() + " with key " + Mi(a);
            HF(b, CF(e.target, f))
        };
        return b
    };
    YF.prototype.clear = function() {
        var a = "clearing store " + this.getName(),
            b = new GF;
        try {
            var c = this.g.clear()
        } catch (d) {
            return HF(b, DF(d, a)), b
        }
        c.onsuccess = function() {
            b.Ca()
        };
        c.onerror = function(d) {
            HF(b, CF(d.target, a))
        };
        return b
    };
    var aG = function(a) {
        try {
            return new VF(a.g.index("timestamp"))
        } catch (b) {
            throw DF(b, "getting index timestamp");
        }
    };
    var bG = function(a, b) {
        Q.call(this);
        this.g = a;
        this.l = b;
        this.j = new jE(this);
        this.j.listen(this.g, "complete", db(this.dispatchEvent, this, "complete"));
        this.j.listen(this.g, "abort", db(this.dispatchEvent, this, "abort"));
        this.j.listen(this.g, "error", this.Cf)
    };
    ib(bG, Q);
    m = bG.prototype;
    m.Cf = function(a) {
        a.target instanceof pF ? this.dispatchEvent({
            type: "error",
            target: a.target
        }) : this.dispatchEvent({
            type: "error",
            target: CF(a.target, "in transaction")
        })
    };
    m.objectStore = function(a) {
        try {
            return new YF(this.g.objectStore(a))
        } catch (b) {
            throw DF(b, "getting object store " + a);
        }
    };
    m.commit = function(a) {
        if (this.g.commit || !a) try {
            this.g.commit()
        } catch (b) {
            throw DF(b, "cannot commit the transaction");
        }
    };
    m.wait = function() {
        var a = new GF;
        Wv(this, "complete", db(a.Ca, a));
        var b = Wv(this, "abort", function() {
            ew(c);
            HF(a, new pF(wF, "waiting for transaction to complete"))
        });
        var c = Wv(this, "error", function(e) {
            ew(b);
            HF(a, e.target)
        });
        var d = this.l;
        return OF(a, function() {
            return d
        })
    };
    m.abort = function() {
        this.g.abort()
    };
    m.O = function() {
        bG.Ia.O.call(this);
        this.j.dispose()
    };
    var cG = function(a) {
        Q.call(this);
        this.g = a;
        this.j = new jE(this);
        this.j.listen(this.g, "abort", db(this.dispatchEvent, this, "abort"));
        this.j.listen(this.g, "error", this.Df);
        this.j.listen(this.g, "versionchange", this.kg);
        this.j.listen(this.g, "close", db(this.dispatchEvent, this, "close"))
    };
    ib(cG, Q);
    m = cG.prototype;
    m.Pd = !0;
    m.Df = function(a) {
        a = (a = a.target) && a.error;
        this.dispatchEvent({
            type: "error",
            errorCode: a && a.severity
        })
    };
    m.kg = function(a) {
        this.dispatchEvent(new dG(a.oldVersion, a.newVersion))
    };
    m.close = function() {
        this.Pd && (this.g.close(), this.Pd = !1)
    };
    m.Ta = function() {
        return this.Pd
    };
    m.getName = function() {
        return this.g.name
    };
    m.getVersion = function() {
        return Number(this.g.version)
    };
    var eG = function(a) {
        var b = ["MediaSourceVideoChunk"];
        try {
            var c = a.g.transaction(b, "readwrite");
            return new bG(c, a)
        } catch (d) {
            throw DF(d, "creating transaction");
        }
    };
    cG.prototype.O = function() {
        cG.Ia.O.call(this);
        this.j.dispose()
    };
    var dG = function(a, b) {
        Iv.call(this, "versionchange");
        this.oldVersion = a;
        this.newVersion = b
    };
    ib(dG, Iv);
    var fG = function(a) {
        var b = new GF;
        mF == void 0 && (mF = y.indexedDB || y.mozIndexedDB || y.webkitIndexedDB || y.moz_indexedDB);
        var c = mF.open("IndexedDbVideoChunkPersistentStorage", 6);
        c.onsuccess = function(d) {
            d = new cG(d.target.result);
            b.Ca(d)
        };
        c.onerror = function(d) {
            HF(b, CF(d.target, "opening database IndexedDbVideoChunkPersistentStorage"))
        };
        c.onupgradeneeded = function(d) {
            if (a) {
                var e = new cG(d.target.result);
                a(new dG(d.oldVersion, d.newVersion), e, new bG(d.target.transaction, e))
            }
        };
        c.onblocked = function() {};
        return b
    };
    var gG = function() {
        Q.apply(this, arguments);
        this.g = null
    };
    w(gG, Q);
    gG.prototype.initialize = function() {
        var a = this;
        return Promise.resolve(fG(this.j)).then(function(b) {
            a.g = b
        }, function(b) {
            L(K.getInstance(), "codf", b.message)
        })
    };
    gG.prototype.Ta = function() {
        return this.g !== null && this.g.Ta()
    };
    gG.prototype.close = function() {
        var a = this;
        return (new Promise(function(b) {
            hG(a, b)
        })).then(function() {
            return iG()
        }).then(function() {
            a.g.close()
        })
    };
    var iG = function() {
        var a;
        return ((a = navigator.storage) == null ? 0 : a.estimate) ? navigator.storage.estimate().then(function(b) {
            L(K.getInstance(), "csue", String(b.usage))
        }) : Promise.resolve(void 0)
    };
    gG.prototype.Wb = function(a) {
        return (a = jG(a, 0)) ? kG(this, lG(a), a.Mc) : Promise.resolve(null)
    };
    gG.prototype.wc = function(a, b, c, d) {
        (b = jG(b, c)) ? (c = b.startIndex, mG(this, {
            ej: lG(b),
            startIndex: c,
            Fc: c + a.byteLength - 1,
            Mc: b.Mc,
            timestamp: new Date(Date.now()),
            xa: d,
            xb: b.xb,
            video: a
        })) : Promise.resolve(void 0)
    };
    gG.prototype.j = function(a, b) {
        if (b.g.objectStoreNames.contains("MediaSourceVideoChunk")) try {
            b.g.deleteObjectStore("MediaSourceVideoChunk")
        } catch (d) {
            throw DF(d, "deleting object store MediaSourceVideoChunk");
        }
        a = {
            keyPath: "cacheId"
        };
        try {
            var c = new YF(b.g.createObjectStore("MediaSourceVideoChunk", a))
        } catch (d) {
            throw DF(d, "creating object store MediaSourceVideoChunk");
        }
        b = {
            unique: !1
        };
        try {
            c.g.createIndex("timestamp", "timestamp", b)
        } catch (d) {
            throw DF(d, "creating new index timestamp with key path timestamp");
        }
    };
    var hG = function(a, b) {
            var c = new Date(Date.now());
            c.setDate(c.getDate() - 30);
            c = new EF(FF.upperBound(c, void 0));
            var d = XF(aG(eG(a.g).objectStore("MediaSourceVideoChunk")), c),
                e = d.listen("n", function() {
                    d.remove();
                    d.next()
                });
            Wv(d, "c", function() {
                ew(e);
                b()
            })
        },
        jG = function(a, b) {
            var c = new eF(a);
            a = c.getId();
            var d = gF(c, "itag"),
                e = gF(c, "source"),
                f = gF(c, "lmt");
            c = hF(c);
            var g = [];
            a ? d ? e ? f ? c === null && g.push("startIndex") : g.push("lmt") : g.push("source") : g.push("itag") : g.push("videoId");
            return g.length > 0 ? (L(K.getInstance(),
                "civp", g.join("-")), null) : {
                wh: a,
                xb: d,
                source: e,
                Mc: f,
                startIndex: c + b
            }
        },
        lG = function(a) {
            for (var b = [a.wh, a.source, a.startIndex].join(), c = 0, d = 0; d < b.length; d++) c = Math.imul(31, c) + b.charCodeAt(d) | 0;
            return c.toString() + "," + a.xb
        },
        kG = function(a, b, c) {
            var d = eG(a.g).objectStore("MediaSourceVideoChunk");
            return Promise.resolve(d.get(b)).then(function(e) {
                if (!e) return L(K.getInstance(), "cenf", "1"), null;
                if (e.Mc !== c) return L(K.getInstance(), "cdl", "1"), d.remove(b).then(null, function(f) {
                        L(K.getInstance(), "crdlvf", f.message)
                    }),
                    null;
                L(K.getInstance(), "cefml", "1");
                return {
                    xb: e.xb,
                    Fc: e.Fc,
                    xa: e.xa,
                    video: e.video
                }
            }, function(e) {
                L(K.getInstance(), "cgvf", e.message);
                return null
            })
        },
        mG = function(a, b) {
            a = eG(a.g).objectStore("MediaSourceVideoChunk");
            Promise.resolve($F(a, b)).then(function() {
                L(K.getInstance(), "cavs", "1")
            }, function(c) {
                L(K.getInstance(), "cavf", c.message)
            })
        };
    var nG = function(a) {
        KE.call(this);
        var b = this;
        this.H = this.j = this.g = 0;
        this.A = this.K = null;
        this.uri = new TC(a);
        this.state = 0;
        this.l = (this.B = kF() && !xD(this.uri)) ? tC(gG) : null;
        Br(this, function() {
            Ar(b.l)
        });
        this.K = this.B ? this.l.initialize() : null
    };
    w(nG, KE);
    nG.prototype.F = function() {
        return this.g
    };
    nG.prototype.C = function() {
        return this.state === 3
    };
    nG.prototype.G = function(a) {
        this.state === 1 ? (this.g += a, this.state = 2) : this.state === 0 && (this.g += a, this.state = 1, oG(this))
    };
    var oG = function(a) {
            La(function(b) {
                if (b.g == 1) return a.state === 2 && (a.state = 1), Aa(b, pG(a), 4);
                var c = a.H > 3;
                if (c && a.A !== null) {
                    var d = WE("media_source_error", {
                        code: a.j > 0 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                        message: 'Response code "' + a.A + '" with ' + a.g + " bytes requested and " + a.j + " bytes loaded"
                    });
                    a.dispatchEvent(d)
                }
                a.j < a.g && a.state !== 3 && !c ? b.g = 1 : (a.state !== 3 && (a.state = 0), b.g = 0)
            })
        },
        pG = function(a) {
            var b;
            return La(function(c) {
                switch (c.g) {
                    case 1:
                        b = a.j + "-" + (a.g - 1);
                        gD(a.uri, "range",
                            b);
                        if (!a.B) {
                            c.g = 2;
                            break
                        }
                        return Aa(c, a.K, 3);
                    case 3:
                        return c.return(qG(a));
                    case 2:
                        return c.l = 4, Aa(c, rG(a), 6);
                    case 6:
                        Ba(c);
                        break;
                    case 4:
                        Da(c), sG(a), c.g = 0
                }
            })
        },
        qG = function(a) {
            var b;
            return La(function(c) {
                switch (c.g) {
                    case 1:
                        return Aa(c, a.l.Wb(a.uri), 2);
                    case 2:
                        if (b = c.j) {
                            b.xa && (a.state = 3);
                            tG(a, b.video, 0);
                            c.g = 0;
                            break
                        }
                        c.l = 4;
                        return Aa(c, rG(a), 6);
                    case 6:
                        Ba(c);
                        break;
                    case 4:
                        Da(c), sG(a), c.g = 0
                }
            })
        },
        sG = function(a) {
            var b = new eF(a.uri);
            if (Dm(fn) && fF(b)) {
                a: if (fF(b)) {
                    var c = gF(b, "mn");
                    var d = c ? c.split(",") : null;
                    var e = gF(b,
                        "fvip");
                    c = b.uri.G();
                    if (d && e) {
                        var f = (Number(gF(b, "fallback_count")) || 0) + 1;
                        if (d = d[f]) {
                            c.g = "r" + e + "---" + d + ".googlevideo.com";
                            gD(c, "fallback_count", f);
                            b = c;
                            break a
                        }
                    }
                    var g, h;
                    e = Number(((h = (g = hD(c, "cmo")) == null ? void 0 : g.split("=")) != null ? h : [])[1]) || 0;
                    b.uri.g.match(/^r{1,2}(\d+)---(.+)\.googlevideo.com$/) && (c.g = "redirector.googlevideo.com");
                    gD(c, "cmo", "pf=" + (e + 1));
                    b = c
                } else b = b.uri;a.uri = b;a.dispatchEvent(WE("bandaid_fallback_count"))
            }
            else Dm(kn) && xD(a.uri) && (a.uri = new TC(yD(a.uri)));
            a.H++
        },
        rG = function(a) {
            return new Promise(function(b,
                c) {
                var d = new XMLHttpRequest,
                    e = 0,
                    f = a.g - a.j;
                d.addEventListener("load", function() {
                    Dl("lvlcl");
                    if (d.status >= 400) L(K.getInstance(), "lvlxes", d.status.toString()), a.A = d.status, c();
                    else {
                        var g = d.response;
                        g.byteLength < f && (a.state = 3);
                        var h = tG(a, g, e);
                        e += h;
                        a.B && g.byteLength > 0 && a.l.wc(g, a.uri, 0, g.byteLength < f);
                        b()
                    }
                });
                d.addEventListener("timeout", function() {
                    Dl("lvlct");
                    a.A = d.status;
                    c()
                });
                d.addEventListener("error", function() {
                    Dl("lvlce");
                    a.A = d.status;
                    c()
                });
                d.addEventListener("progress", function() {
                    if (d.status >= 400) a.A =
                        d.status;
                    else {
                        var g = tG(a, d.response, e);
                        e += g
                    }
                });
                d.responseType = "arraybuffer";
                d.open("get", a.uri.toString());
                d.send(null)
            })
        },
        tG = function(a, b, c) {
            if (b === null) return 0;
            b = b.slice(c);
            a.j += b.byteLength;
            a.dispatchEvent({
                type: "progress",
                rd: b
            });
            return b.byteLength
        };
    nG.prototype.O = function() {
        this.B && this.l.Ta() && this.l.close();
        KE.prototype.O.call(this)
    };
    var uG = {
        qj: 2E5,
        oj: 7E4,
        Ja: 3E5,
        nj: 5E3,
        xj: 5E3,
        pj: 6E3
    };

    function vG() {
        return !!window.MediaSource
    }

    function wG(a) {
        return [43, 44, 45].includes(a) && Ic ? !1 : OE[a] ? (a = VE(a), !!a && vG() && MediaSource.isTypeSupported(a)) : !1
    };
    var xG = function() {};
    xG.prototype.Rg = function(a, b, c) {
        return c === 0 ? 1E6 : b - a < 5E3 ? 3E5 : 0
    };
    var zG = function(a, b) {
            var c = this;
            this.g = a;
            this.index = b;
            this.j = [];
            this.g || Dl("msms_sbf" + this.index);
            this.g.addEventListener("updateend", function() {
                yG(c)
            });
            this.g.addEventListener("error", function() {
                Dl("msms_sbe" + c.index)
            })
        },
        yG = function(a) {
            if (a.j.length > 0 && !a.g.updating) {
                var b = a.j.shift();
                a.g.appendBuffer(b)
            }
        };
    var AG = function() {
        this.g = this.cache = null
    };
    m = AG.prototype;
    m.initialize = function() {
        var a = this;
        return window.caches.open("CACHE_VIDEO_CHUNK_PERSISTENT_STORAGE").then(function(b) {
            a.cache = b
        }, function(b) {
            L(K.getInstance(), "codf", b.message)
        })
    };
    m.Ta = function() {
        return this.cache !== null
    };
    m.close = function() {
        return Promise.resolve()
    };
    m.Wb = function(a) {
        var b = this;
        a = BG(this, a);
        return this.Ta() && a ? this.cache.match(a).then(function(c) {
            if (!c) return L(K.getInstance(), "cenf", "1"), Promise.resolve(null);
            L(K.getInstance(), "cef", "1");
            return c.arrayBuffer().then(function(d) {
                var e = hF(b.g),
                    f;
                (f = hD(b.g.uri, "range")) ? (f = f.split("-")[1], f = !f || isNaN(Number(f)) ? null : Number(f)) : f = null;
                e = e + d.byteLength - 1;
                f = f > e;
                return {
                    xb: gF(b.g, "itag"),
                    Fc: e,
                    xa: f,
                    video: d
                }
            })
        }, function(c) {
            L(K.getInstance(), "cgvf", c.message);
            return Promise.resolve(null)
        }) : (L(K.getInstance(),
            "cgvf", "1"), Promise.resolve(null))
    };
    m.wc = function(a, b) {
        b = BG(this, b);
        a = new Response(a);
        this.Ta() && b ? this.cache.put(b, a).then(function() {
            L(K.getInstance(), "cavs", "1")
        }, function(c) {
            L(K.getInstance(), "cavf", c.message)
        }) : (L(K.getInstance(), "cavf", "1"), Promise.resolve())
    };
    var BG = function(a, b) {
        a.g = new eF(b);
        b = a.g.getId();
        var c = gF(a.g, "itag"),
            d = gF(a.g, "source"),
            e = gF(a.g, "lmt");
        a = gF(a.g, "range");
        if (b && c && d && a) return new Request("http://url/videoplayback?id=" + b + "&itag=" + c + "&source=" + d + "&lmt=" + e + "&range=" + a);
        L(K.getInstance(), "civp", "1");
        return null
    };
    var EG = function(a) {
        Q.call(this);
        var b = this;
        this.l = a;
        this.g = [];
        this.B = null;
        this.C = 0;
        this.M = !1;
        this.G = 0;
        this.F = [];
        if (Dm(Zm)) {
            var c = null;
            kF() && (Dm(an) ? c = tC(AG) : c = tC(gG));
            this.A = this.l.map(function(d) {
                return tC(XE, d.url, xD(d.url) ? null : c)
            })
        } else this.A = this.l.map(function(d) {
            return tC(nG, d.url)
        });
        this.j = tC(MediaSource);
        this.H = function() {
            CG(b)
        };
        this.j.addEventListener("sourceopen", this.H);
        this.K = DG(this)
    };
    w(EG, Q);
    var DG = function(a) {
            for (var b = [], c = 0; c < a.l.length; ++c) b.push(new xG);
            return b
        },
        CG = function(a) {
            Dl("msms_oso");
            for (var b = {
                    Aa: 0
                }; b.Aa < a.l.length; b = {
                    Xd: void 0,
                    Nc: void 0,
                    qb: void 0,
                    Aa: b.Aa,
                    Oc: void 0
                }, ++b.Aa) {
                var c = a.l[b.Aa];
                L(K.getInstance(), "msms_mime" + b.Aa, c.mimeType);
                L(K.getInstance(), "msms_cs" + b.Aa, c.Ja.toString());
                Dm($m) ? (b.Xd = new zG(a.j.addSourceBuffer(c.mimeType), b.Aa), b.Nc = a.A[b.Aa], b.Nc.listen("progress", function(d) {
                    return function(e) {
                        var f = d.Xd,
                            g = d.Nc;
                        e = e.rd;
                        e.byteLength !== 0 && (f.j.push(e), yG(f));
                        g.C() && (a.C++, a.C === a.g.length && FG(a))
                    }
                }(b)), b.Nc.listen("media_source_error", function(d) {
                    a.dispatchEvent(d)
                }), a.g.push(b.Xd.g)) : (b.qb = a.j.addSourceBuffer(c.mimeType), b.qb ? (b.Oc = a.A[b.Aa], Dm(Zm) && b.qb.addEventListener("updateend", function(d) {
                    return function() {
                        if (a.F.length > 0 && !d.qb.updating) {
                            var e = a.F.shift();
                            d.qb.appendBuffer(e)
                        }
                    }
                }(b)), b.qb.addEventListener("error", function(d) {
                    return function() {
                        Dl("msms_sbe" + d.Aa)
                    }
                }(b)), b.Oc.listen("progress", function(d) {
                    return function(e) {
                        var f = d.qb,
                            g = d.Oc;
                        e = e.rd;
                        e.byteLength !== 0 && (Dm(Zm) ? f.updating ? a.F.push(e) : f.appendBuffer(e) : f.appendBuffer(e));
                        g.C() && (a.C++, a.C === a.g.length && FG(a))
                    }
                }(b)), b.Oc.listen("media_source_error", function(d) {
                    a.dispatchEvent(d)
                }), a.g.push(b.qb)) : Dl("msms_sbf" + b.Aa))
            }
            L(K.getInstance(), "msms_ns", a.g.length.toString());
            a.M = !0;
            GG(a)
        },
        FG = function(a) {
            Promise.all(a.g.map(function(b) {
                return new Promise(function(c) {
                    b.updating ? b.addEventListener("updateend", function() {
                        c()
                    }) : c()
                })
            })).then(function() {
                a.j.endOfStream()
            })
        },
        GG = function(a) {
            if (a.M)
                for (var b =
                        0; b < a.l.length; ++b) {
                    var c = a.A[b],
                        d = a.g[b];
                    d = d.buffered.length === 0 ? 0 : d.buffered.end(0) * 1E3;
                    d = a.K[b].Rg(a.G, d, c.F());
                    d !== 0 && c.G(d)
                }
        },
        HG = function(a) {
            a.B = Gi(a.j).toString();
            return a.B
        };
    EG.prototype.O = function() {
        this.B && window.URL.revokeObjectURL(this.B);
        for (var a = x(this.A), b = a.next(); !b.done; b = a.next()) b.value.dispose();
        this.j.removeEventListener("sourceopen", this.H);
        Q.prototype.O.call(this)
    };
    EG.prototype.gd = function(a) {
        this.K.filter(function() {
            return !1
        }).map(function(b) {
            return b
        }).forEach(function(b) {
            b.g = Object.assign({}, uG, b.g, a)
        })
    };
    var IG = RegExp("/pagead/conversion|/pagead/adview|/pagead/gen_204|/activeview?|csi.gstatic.com/csi|google.com/pagead/xsul|google.com/ads/measurement/l|googleads.g.doubleclick.net/pagead/ide_cookie|googleads.g.doubleclick.net/xbbe/pixel"),
        JG = RegExp("outstream.min.js"),
        KG = RegExp("outstream.min.css"),
        LG = RegExp("fonts.gstatic.com"),
        MG = RegExp("googlevideo.com/videoplayback|c.2mdn.net/videoplayback|gcdn.2mdn.net/videoplayback"),
        NG = RegExp("custom.elements.min.js");

    function OG(a, b) {
        var c = 0,
            d = 0,
            e = 0,
            f = 0,
            g = 0,
            h = 0,
            k = 0,
            l = !1,
            p = !1;
        if (typeof Sa("performance.getEntriesByType", y) === "function" && "transferSize" in y.PerformanceResourceTiming.prototype) {
            var n = y.performance.getEntriesByType("resource");
            n = x(n);
            for (var q = n.next(); !q.done; q = n.next()) q = q.value, IG.test(q.name) || (f += 1, q.transferSize ? (c += q.transferSize, q.encodedBodySize && q.transferSize < q.encodedBodySize && (h += 1, e += q.encodedBodySize, JG.test(q.name) && (l = !0), KG.test(q.name) && (p = !0)), MG.test(q.name) && (d += q.transferSize)) :
                q.transferSize === 0 && q.encodedBodySize === 0 ? NG.test(q.name) ? c += 6686 : LG.test(q.name) || (k += 1, Cl(K.getInstance(), {
                    event_name: "unmeasurable_asset",
                    resource_name: q.name,
                    encoded_body_size: q.encodedBodySize,
                    transfer_size: q.transferSize
                })) : (g += 1, e += q.encodedBodySize, JG.test(q.name) && (l = !0), KG.test(q.name) && (p = !0)));
            n = 0;
            if (a.duration) {
                for (q = 0; q < a.buffered.length; q++) n += a.buffered.end(q) - a.buffered.start(q);
                n = Math.min(n, a.duration)
            }
            Cl(K.getInstance(), {
                event_name: b,
                asset_bytes: c,
                video_bytes: d,
                cached_data_bytes: e,
                js_cached: l,
                css_cached: p,
                num_assets: f,
                num_assets_cached: g,
                num_assets_cache_validated: h,
                num_assets_unmeasurable: k,
                video_played_seconds: a.currentTime.toFixed(2),
                video_muted: a.muted,
                video_seconds_loaded: n.toFixed(2)
            })
        } else L(K.getInstance(), "error", "reporting_timing_not_supported")
    };
    var PG = function(a, b, c, d) {
        this.url = a;
        this.mimeType = b;
        this.Ja = c;
        this.g = d === void 0 ? null : d
    };

    function QG(a) {
        var b = K.getInstance(),
            c = a.getVideoPlaybackQuality && a.getVideoPlaybackQuality();
        c ? (a = a.currentTime, L(b, "vqdf", String(c.droppedVideoFrames)), L(b, "vqtf", String(c.totalVideoFrames)), L(b, "vqfr", String(Math.round(c.totalVideoFrames / a)))) : L(b, "vqu", "1")
    };
    var RG = function(a) {
        this.g = a
    };
    RG.prototype.toString = function() {
        return this.g
    };
    var SG = new RG("video_mute"),
        TG = new RG("video_caption_visibility");
    var UG = function(a) {
        P.call(this);
        this.B = 1;
        this.l = [];
        this.o = 0;
        this.g = [];
        this.j = {};
        this.F = !!a
    };
    ib(UG, P);
    var VG = function(a, b, c) {
            var d = TG.toString(),
                e = a.j[d];
            e || (e = a.j[d] = []);
            var f = a.B;
            a.g[f] = d;
            a.g[f + 1] = b;
            a.g[f + 2] = c;
            a.B = f + 3;
            e.push(f)
        },
        WG = function(a, b, c) {
            var d = a.j[TG.toString()];
            if (d) {
                var e = a.g;
                (d = d.find(function(f) {
                    return e[f + 1] == b && e[f + 2] == c
                })) && a.A(d)
            }
        };
    UG.prototype.A = function(a) {
        var b = this.g[a];
        if (b) {
            var c = this.j[b];
            this.o != 0 ? (this.l.push(a), this.g[a + 1] = function() {}) : (c && cc(c, a), delete this.g[a], delete this.g[a + 1], delete this.g[a + 2])
        }
        return !!b
    };
    UG.prototype.C = function(a, b) {
        var c = this.j[a];
        if (c) {
            var d = Array(arguments.length - 1),
                e = arguments.length,
                f;
            for (f = 1; f < e; f++) d[f - 1] = arguments[f];
            if (this.F)
                for (f = 0; f < c.length; f++) e = c[f], XG(this.g[e + 1], this.g[e + 2], d);
            else {
                this.o++;
                try {
                    for (f = 0, e = c.length; f < e && !this.Ea(); f++) {
                        var g = c[f];
                        this.g[g + 1].apply(this.g[g + 2], d)
                    }
                } finally {
                    if (this.o--, this.l.length > 0 && this.o == 0)
                        for (; c = this.l.pop();) this.A(c)
                }
            }
        }
    };
    var XG = function(a, b, c) {
        rw(function() {
            a.apply(b, c)
        })
    };
    UG.prototype.clear = function(a) {
        if (a) {
            var b = this.j[a];
            b && (b.forEach(this.A, this), delete this.j[a])
        } else this.g.length = 0, this.j = {}
    };
    UG.prototype.O = function() {
        UG.Ia.O.call(this);
        this.clear();
        this.l.length = 0
    };
    var YG = function(a) {
        P.call(this);
        this.g = new UG(a);
        Cr(this, this.g)
    };
    ib(YG, P);
    YG.prototype.clear = function(a) {
        this.g.clear(a !== void 0 ? a.toString() : void 0)
    };
    var ZG = function(a) {
        a = a === void 0 ? null : a;
        P.call(this);
        this.g = new jE(this);
        Cr(this, this.g);
        this.zb = a
    };
    w(ZG, P);
    var $G = function(a, b, c) {
        a.zb && (VG(a.zb.g, b, c), Br(a, function() {
            WG(a.zb.g, b, c)
        }))
    };
    var aH = function(a, b) {
        ZG.call(this, b);
        $G(this, function(c) {
            c ? a.g.mode = "showing" : a.kb()
        }, this)
    };
    w(aH, ZG);
    var bH = function() {
        Q.call(this);
        this.j = new jE(this);
        Cr(this, this.j)
    };
    w(bH, Q);
    var dH = function(a, b, c) {
        c = c === void 0 ? !0 : c;
        bH.call(this);
        a.setAttribute("crossorigin", "anonymous");
        var d = So("TRACK");
        d.setAttribute("kind", "captions");
        d.setAttribute("src", b);
        d.setAttribute("default", "");
        a.appendChild(d);
        this.g = a.textTracks[0];
        cH(this);
        c ? this.g.mode = "showing" : this.kb()
    };
    w(dH, bH);
    var cH = function(a) {
        var b = a.g;
        b.addEventListener("cuechange", function() {
            for (var c = b.cues, d = 0; d < c.length; d++) {
                var e = c[d];
                e.align = "center";
                e.position = "auto"
            }
        }, {
            once: !0
        })
    };
    dH.prototype.kb = function() {
        this.g.mode = "hidden"
    };

    function eH(a, b) {
        if (typeof ReportingObserver !== "undefined") {
            var c = function(e) {
                    e = x(e);
                    for (var f = e.next(); !f.done; f = e.next()) f = f.value, a(f) && b(f)
                },
                d = new ReportingObserver(c, {
                    buffered: !0
                });
            y.addEventListener("pagehide", function() {
                c(d.takeRecords(), d);
                d.disconnect()
            });
            d.observe()
        }
    }

    function fH(a) {
        a = a === void 0 ? null : a;
        eH(function(b) {
            return b.body && b.body.id === "HeavyAdIntervention"
        }, function(b) {
            var c = b.body.message,
                d = K.getInstance();
            L(d, "ham", c);
            c.includes("CPU") ? L(d, "hacpu", "true") : c.includes("network") && L(d, "habytes", "true");
            a && a(b)
        })
    };
    var gH = "autoplay controls crossorigin demuxedaudiosrc demuxedvideosrc loop muted playsinline poster preload src webkit-playsinline x-webkit-airplay".split(" "),
        hH = "autoplay buffered controls crossOrigin currentSrc currentTime defaultMuted defaultPlaybackRate disablePictureInPicture disableRemotePlayback duration ended loop muted networkState onerror onwaitingforkey paused played playsinline poster preload preservesPitch mozPreservesPitch webkitPreservesPitch readyState seekable videoWidth videoHeight volume textTracks canPlayType captureStream getVideoPlaybackQuality load pause play requestPictureInPicture setSinkId oncanplay oncanplaythrough onload onplay onpause onended onfullscreenchange onfullscreenerror addEventListener dispatchEvent removeEventListener requestFullscreen".split(" "),
        iH = {
            childList: !0
        },
        jH = !RegExp("^\\s*class\\s*\\{\\s*\\}\\s*$").test(function() {}.toString()),
        kH = HTMLElement;
    jH && (kH = function() {
        var a = Object.getPrototypeOf(this).constructor;
        return y.Reflect.construct(HTMLElement, [], a)
    }, Object.setPrototypeOf(kH, HTMLElement), Object.setPrototypeOf(kH.prototype, HTMLElement.prototype));
    var lH = function(a) {
            if (a !== null) {
                a = x(a);
                for (var b = a.next(); !b.done; b = a.next())
                    if (b = b.value, b.nodeName === "TRACK".toString()) return b
            }
            return null
        },
        mH = function(a, b) {
            this.code = a;
            this.message = b === void 0 ? "" : b
        },
        nH = function(a) {
            mH.call(this, MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED, a === void 0 ? "" : a)
        };
    w(nH, mH);
    var rH = function(a, b) {
        b = b === void 0 ? !1 : b;
        var c = kH.call(this) || this;
        L(K.getInstance(), "ulv", "1");
        c.th = b;
        c.ra = null;
        c.Ve = null;
        c.ve = null;
        c.T = So("VIDEO");
        oH(c);
        c.zb = a || new YG;
        pH(c);
        c.Bc = null;
        qH(c);
        c.attachShadow({
            mode: "open"
        });
        c.shadowRoot.appendChild(c.T);
        fH(function() {
            L(K.getInstance(), "has", c.src || c.fb);
            L(K.getInstance(), "hat", String(c.T.currentTime))
        });
        c.dd = !1;
        c.Xe = !1;
        c.fc = null;
        c.md = null;
        c.uh = !1;
        c.ff = !1;
        c.ij = null;
        c.Rb = null;
        return c
    };
    w(rH, kH);
    var sH = function(a) {
        a.T.load();
        Dm(gn) && a.T.dispatchEvent(new Event("canplaythrough"))
    };
    rH.prototype.attributeChangedCallback = function(a, b, c) {
        switch (a) {
            case "src":
                tH(this, c);
                break;
            case "demuxedaudiosrc":
            case "demuxedvideosrc":
                uH(this);
                break;
            case "muted":
                this.T[a] = c === "" ? !0 : !!c;
                vH(this, a, c);
                break;
            default:
                vH(this, a, c)
        }
    };
    rH.prototype.gd = function(a) {
        this.Rb = a;
        var b;
        (b = this.ra) == null || b.gd(a)
    };
    var vH = function(a, b, c) {
            c !== a.T.getAttribute(b) && (c === null ? a.T.removeAttribute(b) : a.T.setAttribute(b, c))
        },
        wH = function(a) {
            a.ra && (a.T.removeEventListener("timeupdate", a.fc), a.ra.dispose(), a.ra = null)
        },
        xH = function(a, b) {
            a.ve = b;
            a.T.dispatchEvent(new Event("error"))
        },
        oH = function(a) {
            yH(a);
            zH(a);
            a.T.addEventListener("loadedmetadata", function() {
                a.md = KD(a);
                a.md.then(function(b) {
                    var c = a.T.videoWidth;
                    var d = a.T.videoHeight,
                        e = b.width,
                        f = b.height;
                    c > 0 && d > 0 && e > 0 && f > 0 ? (b = b.width / b.height, c /= d, c = Math.min(c, b) / Math.max(c,
                        b) >= .97 ? "cover" : "contain") : c = null;
                    c !== null && Aq(a.T, {
                        "object-fit": c
                    })
                })
            });
            a.T.addEventListener("play", function() {
                a.Xe || (OG(a.T, "first_play"), a.Xe = !0)
            });
            a.T.addEventListener("pause", function() {
                a.dd || (OG(a.T, "first_pause"), QG(a.T), a.dd = !0)
            });
            Xv(y, "pagehide", function() {
                a.dd || (OG(a.T, "first_pause"), QG(a.T), a.dd = !0)
            });
            a.T.addEventListener("stalled", function() {
                L(K.getInstance(), "ves", "1")
            });
            (new VD(a.T)).listen("playbackStalled", function() {
                return L(K.getInstance(), "pbs", "1")
            });
            a.T.addEventListener("media_source_error",
                function(b) {
                    wH(a);
                    b = b.detail;
                    xH(a, new mH(b.code, b.message))
                });
            AH(a)
        },
        qH = function(a) {
            var b = lH(a.childNodes);
            b && BH(a, b);
            a.Bc === null && CH(a)
        },
        CH = function(a) {
            if (y.MutationObserver) {
                var b = new MutationObserver(function(c) {
                    c = x(c);
                    for (var d = c.next(); !d.done; d = c.next())
                        if (d = d.value, d.type === "childList" && (d = lH(d.addedNodes))) {
                            BH(a, d);
                            b.disconnect();
                            break
                        }
                });
                b.observe(a, iH)
            }
        },
        pH = function(a) {
            a.T.addEventListener("volumechange", function() {
                a.zb.g.C(SG.toString(), a.T.muted);
                a.th || a.zb.g.C(TG.toString(), a.T.muted)
            })
        },
        BH = function(a, b) {
            if (a.Bc === null && b.hasAttribute("src")) {
                var c = b.getAttribute("src");
                a.Bc = new dH(a.T, c, b.hasAttribute("default"));
                new aH(a.Bc, a.zb);
                c.includes("kind=asr") && L(K.getInstance(), "act", "1")
            }
        },
        tH = function(a, b) {
            if (b !== a.Ve) {
                a.Ve = b;
                a.uh && b && wD(b) && (b = yD(b));
                var c = b ? UE(b) : null,
                    d = !!c && wG(c);
                L(K.getInstance(), "umsem", d ? "1" : "0");
                d ? (b = tC(PG, b, VE(c), ME[c] * 1E3, null), a.ra = tC(EG, [b]), a.Rb && a.ra.gd(a.Rb), a.ra.listen("media_source_error", function(e) {
                        e = WE("media_source_error", e.detail);
                        a.T.dispatchEvent(e)
                    }),
                    a.fc = function() {
                        var e = a.ra;
                        e.G = a.T.currentTime * 1E3;
                        GG(e)
                    }, a.T.addEventListener("timeupdate", a.fc), vH(a, "src", HG(a.ra))) : (wH(a), vH(a, "src", b));
                a.ff || sH(a)
            }
        },
        uH = function(a) {
            a.src && xH(a, new mH(MediaError.MEDIA_ERR_ABORTED, "Setting demuxed src after src is already set."));
            if (!a.ub && !a.fb && a.ra) wH(a), vH(a, "src", null), sH(a);
            else if (a.ub && a.fb) {
                var b = UE(wD(a.fb) ? yD(a.fb) : a.fb),
                    c = UE(wD(a.ub) ? yD(a.ub) : a.ub);
                if (b && wG(b))
                    if (c && wG(c)) {
                        var d = !!b && wG(b) && !!c && wG(c);
                        L(K.getInstance(), "umsed", d ? "1" : "0");
                        b = tC(PG,
                            a.fb, VE(b), -1, null);
                        c = tC(PG, a.ub, VE(c), -1, null);
                        a.ra = tC(EG, [b, c]);
                        a.Rb && a.ra.gd(a.Rb);
                        a.ra.listen("media_source_error", function(e) {
                            e = WE("media_source_error", e.detail);
                            a.T.dispatchEvent(e)
                        });
                        a.fc = function() {
                            var e = a.ra;
                            e.G = a.T.currentTime * 1E3;
                            GG(e)
                        };
                        a.T.addEventListener("timeupdate", a.fc);
                        vH(a, "src", HG(a.ra));
                        a.ff || sH(a)
                    } else xH(a, new nH('Audio itag "' + c + '" not supported.'));
                else xH(a, new nH('Video itag "' + b + '" not supported.'))
            }
        },
        yH = function(a) {
            for (var b = x(hH), c = b.next(), d = {}; !c.done; d = {
                    Ya: void 0,
                    getValue: void 0
                }, c = b.next()) d.Ya = c.value, d.Ya in a.T && (typeof a.T[d.Ya] === "function" ? (d.getValue = a.T[d.Ya].bind(a.T), Object.defineProperty(a, d.Ya, {
                set: function(e) {
                    return function(f) {
                        a.T[e.Ya] = f
                    }
                }(d),
                get: function(e) {
                    return function() {
                        return e.getValue
                    }
                }(d)
            })) : Object.defineProperty(a, d.Ya, {
                set: function(e) {
                    return function(f) {
                        a.T[e.Ya] = f
                    }
                }(d),
                get: function(e) {
                    return function() {
                        return a.T[e.Ya]
                    }
                }(d)
            }))
        },
        zH = function(a) {
            Object.defineProperty(a, "error", {
                set: function() {},
                get: function() {
                    return a.T.error ? a.T.error :
                        a.ve
                }
            })
        },
        AH = function(a) {
            a.T.style.width = Hq();
            a.T.style.height = Hq()
        };
    rH.prototype.disconnectedCallback = function() {
        this.md && LD(this.md);
        kH.prototype.disconnectedCallback && kH.prototype.disconnectedCallback.call(this)
    };
    ea.Object.defineProperties(rH.prototype, {
        ub: {
            configurable: !0,
            enumerable: !0,
            set: function(a) {
                this.setAttribute("demuxedaudiosrc", a)
            },
            get: function() {
                return this.getAttribute("demuxedaudiosrc")
            }
        },
        fb: {
            configurable: !0,
            enumerable: !0,
            set: function(a) {
                this.setAttribute("demuxedvideosrc", a)
            },
            get: function() {
                return this.getAttribute("demuxedvideosrc")
            }
        },
        src: {
            configurable: !0,
            enumerable: !0,
            set: function(a) {
                this.setAttribute("src", a)
            },
            get: function() {
                return this.getAttribute("src")
            }
        }
    });
    ea.Object.defineProperties(rH, {
        observedAttributes: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return gH
            }
        }
    });
    y.customElements && (y.customElements.get("lima-video") || y.customElements.define("lima-video", rH));

    function DH() {
        var a = tC(gG);
        a.initialize().then(function() {
            var b = WE("initialized");
            a.dispatchEvent(b)
        });
        return a
    }
    var FH = function(a, b, c, d, e) {
        P.call(this);
        this.G = a;
        this.j = c;
        this.o = e;
        this.aa = this.U = this.Cb = this.F = this.l = this.Qa = 0;
        this.C = [];
        this.M = !1;
        this.ba = this.ga = this.da = null;
        this.va = !1;
        this.Db = this.K = this.A = this.wa = this.Pa = null;
        this.xa = !1;
        this.H = new TC(b.url);
        this.Ja = b.Ja;
        this.ka = d;
        (this.P = b.g) || this.H.l.remove("alr");
        L(K.getInstance(), "sl_dv" + this.o, (this.P !== null).toString());
        this.V = !this.P;
        this.g = new XMLHttpRequest;
        this.Z = .1;
        if (this.B = kF() && !xD(this.H)) this.A = DH(), Cr(this, this.A);
        EH(this)
    };
    w(FH, P);
    var GH = function(a, b) {
            b = WE("media_source_error", b);
            a.G.dispatchEvent(b)
        },
        HH = function(a, b) {
            GH(a, {
                code: a.l > 1 ? MediaError.MEDIA_ERR_NETWORK : MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED,
                message: b
            })
        },
        EH = function(a) {
            a.da = function() {
                IH(a);
                if (a.V) {
                    var b = a.g.responseText;
                    a.M = !b || b.length < a.Ja;
                    a.U = 0;
                    Dl("sl_cc" + a.o + "_" + a.l);
                    a.F++;
                    JH(a)
                }
            };
            a.ga = function() {
                IH(a)
            };
            a.ba = function() {
                Dl("sl_ec" + a.o + "_" + a.l);
                HH(a, "Failed to load chunk " + a.l + " for stream " + a.o)
            };
            a.g.addEventListener("load", a.da);
            a.g.addEventListener("progress",
                a.ga);
            a.g.addEventListener("error", a.ba);
            a.j.addEventListener("updateend", function() {
                a.j.buffered.length && (a.Cb = a.j.buffered.end(0), a.B ? a.xa && !a.j.updating && a.l === a.F && (Dl("sl_lc" + a.o), a.ka()) : a.M && !a.j.updating && a.l === a.F && (Dl("sl_lc" + a.o), a.ka()));
                !a.va && a.G.buffered.length > 1 && (L(K.getInstance(), "dbr", "1"), a.va = !0)
            });
            a.j.addEventListener("update", function() {
                a.C.length && !a.j.updating && a.j.appendBuffer(a.C.shift())
            });
            a.j.addEventListener("error", function() {
                Dl("msb_err" + a.o);
                GH(a, {
                    code: MediaError.MEDIA_ERR_DECODE,
                    message: "Error on SourceBuffer " + a.o
                })
            });
            a.B ? (a.A.Ta() ? KH(a) : a.Pa = Xv(a.A, "initialized", function() {
                KH(a)
            }), a.wa = Xv(a.A, "get_video_succeeded", function() {
                JH(a)
            })) : KH(a)
        },
        MH = function(a) {
            Dl("sl_rc" + a.o + "_" + a.l);
            var b = LH(a);
            a.g.open("get", b);
            a.g.overrideMimeType("text/plain; charset=x-user-defined");
            a.g.send(null);
            a.B && (a.K = null, a.Db = b)
        },
        IH = function(a) {
            if (a.g.status >= 400) HH(a, 'Response code "' + a.g.status + '" on loading chunk ' + a.l + " for stream " + a.o);
            else {
                if (!a.V) {
                    var b = a.g.getResponseHeader("content-type");
                    if (b && b.indexOf("text/plain") >= 0) {
                        a.g.readyState === XMLHttpRequest.DONE && (a.H = new TC(a.g.response), a.l = 0, a.F = 0, a.Qa++, KH(a));
                        return
                    }
                    a.V = !0;
                    Dl("sl_redc" + a.o);
                    L(K.getInstance(), "sl_tr" + a.o, a.Qa.toString())
                }
                a.H.l.remove("alr");
                if (a.g.readyState === XMLHttpRequest.LOADING || a.g.readyState === XMLHttpRequest.DONE) b = NH(a, a.U), a.U = a.g.response.length, a.aa += b.byteLength, OH(a, b);
                if (a.B && a.g.readyState === XMLHttpRequest.DONE && (b = NH(a, 0), b.byteLength > 0)) {
                    var c = a.g.responseText;
                    a.xa = !c || c.length < a.Ja;
                    a.A.wc(b, new TC(a.Db),
                        0, a.xa)
                }
            }
        },
        OH = function(a, b) {
            b.byteLength > 0 && (a.j.updating || a.C.length ? a.C.push(b) : a.j.appendBuffer(b))
        },
        NH = function(a, b) {
            a = a.g.response;
            for (var c = new Uint8Array(a.length - b), d = 0; d < c.length; d++) c[d] = a.charCodeAt(d + b) & 255;
            return c.buffer
        },
        JH = function(a) {
            var b = zD;
            b !== -1 && b < a.aa + a.Ja ? (a.G.pause(), zD = -1, b = !1) : (b = a.F === a.l && !a.j.updating && !a.C.length, b = a.B ? !a.xa && b && a.G.currentTime >= a.Z : !a.M && b && a.G.currentTime >= a.Z);
            b && (a.Z = a.Cb + .1, KH(a))
        },
        LH = function(a) {
            var b = a.B && a.K ? a.K + 1 : a.l * a.Ja;
            return gD(a.H, "range",
                b + "-" + (b + a.Ja - 1)).toString()
        },
        KH = function(a) {
            if (a.B) {
                var b = new TC(LH(a));
                a.A.Wb(b).then(function(c) {
                    c ? (a.K = Number(c.Fc), a.xa = c.xa, OH(a, c.video), c = WE("get_video_succeeded"), a.A.dispatchEvent(c), a.F++) : MH(a);
                    a.l++
                })
            } else MH(a), a.l++
        };
    FH.prototype.O = function() {
        this.B && this.A.Ta() && this.A.close();
        this.g.removeEventListener("load", this.da);
        this.g.removeEventListener("progress", this.ga);
        this.g.removeEventListener("error", this.ba);
        ew(this.Pa);
        ew(this.wa);
        P.prototype.O.call(this)
    };
    var QH = function(a, b) {
        P.call(this);
        var c = this;
        this.A = a;
        this.G = b;
        this.g = new MediaSource;
        this.F = [];
        this.l = [];
        this.j = this.o = null;
        this.B = !1;
        this.C = function() {
            PH(c)
        };
        this.g.addEventListener("sourceopen", this.C)
    };
    w(QH, P);
    var RH = function(a) {
            a.o && a.A.removeEventListener("timeupdate", a.o)
        },
        PH = function(a) {
            Dl("msmsw_oso");
            a.o = function() {
                if (!a.B)
                    for (var e = x(a.l), f = e.next(); !f.done; f = e.next()) JH(f.value)
            };
            a.A.addEventListener("timeupdate", a.o);
            for (var b = 0; b < a.G.length; b++) {
                var c = a.G[b];
                L(K.getInstance(), "msmsw_mime" + b, c.mimeType);
                L(K.getInstance(), "msmsw_cs" + b, c.Ja.toString());
                var d = a.g.addSourceBuffer(c.mimeType);
                d ? (a.F.push(d), c = tC(FH, a.A, c, d, function() {
                    a: if (!a.B) {
                        for (var e = x(a.l), f = e.next(); !f.done; f = e.next())
                            if (f = f.value,
                                f.B ? !f.xa || f.j.updating || f.C.length : !f.M || f.j.updating || f.C.length) break a;
                        a.g.endOfStream();
                        a.B = !0;
                        RH(a)
                    }
                }, b), a.l.push(c)) : Dl("msmsw_sbf" + b)
            }
            L(K.getInstance(), "msmsw_ns", a.F.length.toString())
        };
    QH.prototype.O = function() {
        this.j && window.URL.revokeObjectURL(this.j);
        for (var a = x(this.l), b = a.next(); !b.done; b = a.next()) b.value.dispose();
        RH(this);
        this.g.removeEventListener("sourceopen", this.C);
        P.prototype.O.call(this)
    };
    RegExp.prototype.hasOwnProperty("sticky");
    /*

    Math.uuid.js (v1.4)
    http://www.broofa.com
    mailto:robert@broofa.com
    Copyright (c) 2010 Robert Kieffer
    Dual licensed under the MIT and GPL licenses.
    */
    var SH = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
        TH = function() {
            for (var a = Array(36), b = 0, c, d = 0; d < 36; d++) d == 8 || d == 13 || d == 18 || d == 23 ? a[d] = "-" : d == 14 ? a[d] = "4" : (b <= 2 && (b = 33554432 + Math.random() * 16777216 | 0), c = b & 15, b >>= 4, a[d] = SH[d == 19 ? c & 3 | 8 : c]);
            return a.join("")
        };
    var VH = function(a) {
        TC.call(this, a);
        this.C = new Map;
        a = this.j;
        var b = a.indexOf(";"),
            c = null;
        b >= 0 ? (this.j = a.substring(0, b), c = a.substring(b + 1)) : this.j = a;
        UH(this, c)
    };
    w(VH, TC);
    VH.prototype.toString = function() {
        return WH(this, TC.prototype.toString.call(this))
    };
    VH.prototype.F = function() {
        return ""
    };
    var UH = function(a, b) {
            wb(Ri(b)) || b.split(";").forEach(function(c) {
                var d = c.indexOf("=");
                if (!(d <= 0)) {
                    var e = Oi(c.substring(0, d));
                    c = Oi(c.substring(d + 1));
                    d = a.C.get(e);
                    d != null ? d.includes(c) || d.push(c) : d = [Ri(c)];
                    a.C.set(e, d)
                }
            }, a)
        },
        XH = function(a) {
            if (wb(Ri("ord"))) return null;
            a = a.C.get("ord");
            return a != null ? a : null
        },
        YH = function(a, b) {
            wb(Ri("ord")) || (b = b.map(Ri), a.C.set("ord", b))
        },
        WH = function(a, b) {
            b = [Ri(b)];
            b.push.apply(b, ra(ZH(a)));
            return b.join(";")
        },
        ZH = function(a) {
            var b = XH(a);
            b == null ? b = [Ri(Date.now())] : wb(Ri("ord")) ||
                a.C.delete("ord");
            var c = [];
            a.C.forEach(function(d, e) {
                d.forEach(function(f) {
                    c.push(e + "=" + f)
                })
            });
            c.push("ord=" + b[0]);
            YH(a, b);
            return c
        };
    VH.prototype.G = function() {
        return new VH(this.toString())
    };
    var S = {
        DEPRECATED_ERROR_CODE: -1,
        VAST_MALFORMED_RESPONSE: 100,
        VAST_SCHEMA_VALIDATION_ERROR: 101,
        VAST_UNSUPPORTED_VERSION: 102,
        VAST_TRAFFICKING_ERROR: 200,
        VAST_UNEXPECTED_LINEARITY: 201,
        VAST_UNEXPECTED_DURATION_ERROR: 202,
        VAST_WRAPPER_ERROR: 300,
        VAST_LOAD_TIMEOUT: 301,
        VAST_TOO_MANY_REDIRECTS: 302,
        VAST_NO_ADS_AFTER_WRAPPER: 303,
        VIDEO_PLAY_ERROR: 400,
        VAST_MEDIA_LOAD_TIMEOUT: 402,
        VAST_LINEAR_ASSET_MISMATCH: 403,
        VAST_PROBLEM_DISPLAYING_MEDIA_FILE: 405,
        OVERLAY_AD_PLAYING_FAILED: 500,
        NONLINEAR_DIMENSIONS_ERROR: 501,
        OVERLAY_AD_LOADING_FAILED: 502,
        VAST_NONLINEAR_ASSET_MISMATCH: 503,
        COMPANION_REQUIRED_ERROR: 602,
        COMPANION_AD_LOADING_FAILED: 603,
        UNKNOWN_ERROR: 900,
        VPAID_ERROR: 901,
        FAILED_TO_REQUEST_ADS: 1005,
        VAST_ASSET_NOT_FOUND: 1007,
        VAST_EMPTY_RESPONSE: 1009,
        UNKNOWN_AD_RESPONSE: 1010,
        UNSUPPORTED_LOCALE: 1011,
        ADS_REQUEST_NETWORK_ERROR: 1012,
        INVALID_AD_TAG: 1013,
        PROTECTED_AUDIENCE_API_ERROR: 1014,
        STREAM_INITIALIZATION_FAILED: 1020,
        ASSET_FALLBACK_FAILED: 1021,
        UNSUPPORTED_URL: 1022,
        INVALID_ARGUMENTS: 1101,
        NATIVE_MESSAGE_ERROR: 1204,
        AUTOPLAY_DISALLOWED: 1205,
        CONSENT_MANAGEMENT_PROVIDER_NOT_READY: 1300,
        Mi: 2002
    };
    S[-1] = "DEPRECATED_ERROR_CODE";
    S[100] = "VAST_MALFORMED_RESPONSE";
    S[101] = "VAST_SCHEMA_VALIDATION_ERROR";
    S[102] = "VAST_UNSUPPORTED_VERSION";
    S[200] = "VAST_TRAFFICKING_ERROR";
    S[201] = "VAST_UNEXPECTED_LINEARITY";
    S[202] = "VAST_UNEXPECTED_DURATION_ERROR";
    S[300] = "VAST_WRAPPER_ERROR";
    S[301] = "VAST_LOAD_TIMEOUT";
    S[302] = "VAST_TOO_MANY_REDIRECTS";
    S[303] = "VAST_NO_ADS_AFTER_WRAPPER";
    S[400] = "VIDEO_PLAY_ERROR";
    S[402] = "VAST_MEDIA_LOAD_TIMEOUT";
    S[403] = "VAST_LINEAR_ASSET_MISMATCH";
    S[405] = "VAST_PROBLEM_DISPLAYING_MEDIA_FILE";
    S[500] = "OVERLAY_AD_PLAYING_FAILED";
    S[501] = "NONLINEAR_DIMENSIONS_ERROR";
    S[502] = "OVERLAY_AD_LOADING_FAILED";
    S[503] = "VAST_NONLINEAR_ASSET_MISMATCH";
    S[602] = "COMPANION_REQUIRED_ERROR";
    S[603] = "COMPANION_AD_LOADING_FAILED";
    S[900] = "UNKNOWN_ERROR";
    S[901] = "VPAID_ERROR";
    S[1005] = "FAILED_TO_REQUEST_ADS";
    S[1007] = "VAST_ASSET_NOT_FOUND";
    S[1009] = "VAST_EMPTY_RESPONSE";
    S[1010] = "UNKNOWN_AD_RESPONSE";
    S[1011] = "UNSUPPORTED_LOCALE";
    S[1012] = "ADS_REQUEST_NETWORK_ERROR";
    S[1013] = "INVALID_AD_TAG";
    S[1014] = "PROTECTED_AUDIENCE_API_ERROR";
    S[1020] = "STREAM_INITIALIZATION_FAILED";
    S[1021] = "ASSET_FALLBACK_FAILED";
    S[1022] = "UNSUPPORTED_URL";
    S[1101] = "INVALID_ARGUMENTS";
    S[1204] = "NATIVE_MESSAGE_ERROR";
    S[1205] = "AUTOPLAY_DISALLOWED";
    S[1300] = "CONSENT_MANAGEMENT_PROVIDER_NOT_READY";
    S[2002] = "SUPPORTED_ADS_NOT_FOUND";
    var $H = function(a, b, c) {
        var d = Error.call(this);
        this.message = d.message;
        "stack" in d && (this.stack = d.stack);
        this.type = a;
        this.errorMessage = b;
        this.errorCode = c;
        this.ad = this.g = null
    };
    w($H, Error);
    m = $H.prototype;
    m.getAd = function() {
        return this.ad
    };
    m.getInnerError = function() {
        return this.g
    };
    m.getMessage = function() {
        return this.errorMessage
    };
    m.getErrorCode = function() {
        return this.errorCode
    };
    m.getVastErrorCode = function() {
        return this.errorCode < 1E3 ? this.errorCode : 900
    };
    m.getType = function() {
        return this.type
    };
    m.toString = function() {
        return "AdError " + this.getErrorCode() + ": " + this.getMessage() + (this.getInnerError() != null ? " Caused by: " + this.getInnerError() : "")
    };
    var aI = ta(["https://imasdk.googleapis.com/js/sdkloader/car.js"]);
    bj(aI);

    function bI(a) {
        return a ? (a = /\/(\d+)(?:,\d+){0,2}\//.exec(a)) && a.length === 2 ? a[1] : null : null
    }

    function cI(a) {
        if (a === "") return null;
        a = new TC(a);
        var b = hD(a, "slotname") || hD(a, "iu");
        if (!(b = b ? bI(b) : null)) {
            var c;
            b = (a = (c = hD(a, "client")) != null ? c : "") ? a : null
        }
        return b
    }

    function dI(a, b) {
        try {
            var c = new URL(a);
            return c.searchParams.get("slotname") || c.searchParams.get("iu") || ""
        } catch (d) {
            b == null || b(d)
        }
        return ""
    }

    function eI(a) {
        try {
            var b = (new URL(a)).searchParams.get("cust_params");
            return b == null ? {} : Object.fromEntries(b.split("&").map(function(c) {
                return c.split("=")
            }).map(function(c) {
                var d;
                return [c[0], decodeURIComponent((d = c[1]) != null ? d : "").split(",")]
            }).filter(function(c) {
                return c[0].length > 0
            }))
        } catch (c) {}
        return {}
    };
    var fI = function(a) {
        var b = {};
        b = (b.IABUSPrivacy_String = "uspString", b.IABTCF_gdprApplies = "gdprApplies", b.IABTCF_TCString = "tcString", b.IABTCF_AddtlConsent = "addtlConsent", b.IABGPP_HDR_GppString = "gppString", b.IABGPP_GppSID = "gppSid", b);
        for (var c in b) a[c] != null && (a[b[c]] = a[c], delete a[c]);
        c = a.uspString;
        this.uspString = typeof c === "string" ? c : "";
        c = a.gdprApplies;
        this.j = typeof c === "boolean" ? c ? "1" : "0" : typeof c !== "number" || c !== 1 && c !== 0 ? typeof c !== "string" || c !== "1" && c !== "0" ? "" : c === "1" ? "1" : "0" : c === 1 ? "1" : "0";
        c = a.tcString;
        this.g = typeof c === "string" ? c : "";
        /^[\.\w_-]*$/.test(this.g) || (this.g = encodeURIComponent(this.g));
        c = a.gppString;
        this.gppString = typeof c === "string" ? c : "";
        a = a.gppSid;
        this.l = typeof a === "string" ? a : ""
    };
    var gI = function(a) {
            this.g = a
        },
        hI = function(a, b) {
            return mi(a.g, b) && (a = a.g[b], typeof a === "boolean") ? a : !1
        },
        iI = function(a) {
            return mi(a.g, "videoElementFakeDuration") && (a = a.g.videoElementFakeDuration, typeof a === "number") ? a : NaN
        },
        jI = function(a) {
            if (mi(a.g, "forceExperimentIds")) {
                a = a.g.forceExperimentIds;
                var b = [],
                    c = 0;
                Array.isArray(a) && a.forEach(function(d) {
                    typeof d === "number" && (b[c++] = d)
                });
                return b
            }
            return null
        };
    var T = function() {
            this.G = "always";
            this.U = 4;
            this.L = null;
            this.A = 1;
            this.g = 0;
            this.o = !0;
            this.locale = "en";
            this.l = null;
            this.j = !1;
            this.aa = this.Z = "";
            this.C = null;
            this.ba = this.V = -1;
            this.B = "";
            this.M = !1;
            this.da = null;
            this.K = !0;
            this.F = TH();
            this.P = {};
            this.J = "";
            this.H = 0;
            try {
                this.da = qp()[0]
            } catch (a) {}
        },
        kI = function(a) {
            a = Ri(a);
            wb(a) || (a = a.substring(0, 20));
            return a
        };
    m = T.prototype;
    m.setCompanionBackfill = function(a) {
        this.G = a
    };
    m.getCompanionBackfill = function() {
        return this.G
    };
    m.setNumRedirects = function(a) {
        this.U = a
    };
    m.getNumRedirects = function() {
        return this.U
    };
    m.setPpid = function(a) {
        this.L = a
    };
    m.getPpid = function() {
        return this.L
    };
    m.setVpaidAllowed = function(a) {
        typeof a === "boolean" && (this.A = a ? 1 : 0)
    };
    m.setVpaidMode = function(a) {
        this.A = a
    };
    m.tg = function() {
        return this.A
    };
    m.setAutoPlayAdBreaks = function(a) {
        this.o = a
    };
    m.Gg = function() {
        return this.o
    };
    m.hh = function(a) {
        this.j = a
    };
    m.sg = function() {
        return this.j
    };
    m.setLocale = function(a) {
        if (a = cE(a)) this.locale = a
    };
    m.getLocale = function() {
        return this.locale
    };
    m.setPlayerType = function(a) {
        this.Z = kI(a)
    };
    m.getPlayerType = function() {
        return this.Z
    };
    m.setPlayerVersion = function(a) {
        this.aa = kI(a)
    };
    m.getPlayerVersion = function() {
        return this.aa
    };
    var lI = function(a) {
        if (a.C == null) {
            var b = {};
            var c = (new TC(Po().location.href)).l;
            if (mD(c, "tcnfp")) try {
                b = JSON.parse(c.get("tcnfp"))
            } catch (d) {}
            a.C = new gI(b)
        }
        return a.C
    };
    m = T.prototype;
    m.ih = function(a) {
        this.V = a
    };
    m.jh = function(a) {
        this.ba = a
    };
    m.setDisableCustomPlaybackForIOS10Plus = function(a) {
        this.M = a
    };
    m.getDisableCustomPlaybackForIOS10Plus = function() {
        return this.M
    };
    m.isCookiesEnabled = function() {
        return this.K
    };
    m.setCookiesEnabled = function(a) {
        a != null && (this.K = a)
    };
    m.setSessionId = function(a) {
        this.F = a
    };
    m.gh = function() {};
    m.rg = function() {
        return !0
    };
    m.setFeatureFlags = function(a) {
        this.P = a
    };
    m.getFeatureFlags = function() {
        return this.P
    };
    var mI = function(a, b) {
        b = b === void 0 ? null : b;
        var c = {};
        b != null && (c.activeViewPushUpdates = b);
        c.activityMonitorMode = a.g;
        c.adsToken = a.B;
        c.autoPlayAdBreaks = a.o;
        c.companionBackfill = a.getCompanionBackfill();
        c.cookiesEnabled = a.isCookiesEnabled();
        c.disableCustomPlaybackForIOS10Plus = a.getDisableCustomPlaybackForIOS10Plus();
        c.engagementDetection = !0;
        c.isFunctionalTest = !1;
        c.isVpaidAdapter = a.j;
        c["1pJar"] = "";
        c.numRedirects = a.getNumRedirects();
        c.pageCorrelator = a.V;
        c.persistentStateCorrelator = Qk();
        c.playerType = a.getPlayerType();
        c.playerVersion = a.getPlayerVersion();
        c.ppid = a.getPpid();
        c.privacyControls = "";
        c.reportMediaRequests = !1;
        c.sessionId = a.F;
        c.streamCorrelator = a.ba;
        c.testingConfig = lI(a).g;
        c.urlSignals = a.da;
        c.vpaidMode = a.A;
        c.featureFlags = a.getFeatureFlags();
        c.cookieDeprecationLabel = a.J;
        c.cookieDeprecationLabelStatus = a.H;
        return c
    };
    T.prototype.getFeatureFlags = T.prototype.getFeatureFlags;
    T.prototype.setFeatureFlags = T.prototype.setFeatureFlags;
    T.prototype.getDisableFlashAds = T.prototype.rg;
    T.prototype.setDisableFlashAds = T.prototype.gh;
    T.prototype.setSessionId = T.prototype.setSessionId;
    T.prototype.setCookiesEnabled = T.prototype.setCookiesEnabled;
    T.prototype.isCookiesEnabled = T.prototype.isCookiesEnabled;
    T.prototype.getDisableCustomPlaybackForIOS10Plus = T.prototype.getDisableCustomPlaybackForIOS10Plus;
    T.prototype.setDisableCustomPlaybackForIOS10Plus = T.prototype.setDisableCustomPlaybackForIOS10Plus;
    T.prototype.setStreamCorrelator = T.prototype.jh;
    T.prototype.setPageCorrelator = T.prototype.ih;
    T.prototype.getPlayerVersion = T.prototype.getPlayerVersion;
    T.prototype.setPlayerVersion = T.prototype.setPlayerVersion;
    T.prototype.getPlayerType = T.prototype.getPlayerType;
    T.prototype.setPlayerType = T.prototype.setPlayerType;
    T.prototype.getLocale = T.prototype.getLocale;
    T.prototype.setLocale = T.prototype.setLocale;
    T.prototype.getIsVpaidAdapter = T.prototype.sg;
    T.prototype.setIsVpaidAdapter = T.prototype.hh;
    T.prototype.isAutoPlayAdBreaks = T.prototype.Gg;
    T.prototype.setAutoPlayAdBreaks = T.prototype.setAutoPlayAdBreaks;
    T.prototype.getVpaidMode = T.prototype.tg;
    T.prototype.setVpaidMode = T.prototype.setVpaidMode;
    T.prototype.setVpaidAllowed = T.prototype.setVpaidAllowed;
    T.prototype.getPpid = T.prototype.getPpid;
    T.prototype.setPpid = T.prototype.setPpid;
    T.prototype.getNumRedirects = T.prototype.getNumRedirects;
    T.prototype.setNumRedirects = T.prototype.setNumRedirects;
    T.prototype.getCompanionBackfill = T.prototype.getCompanionBackfill;
    T.prototype.setCompanionBackfill = T.prototype.setCompanionBackfill;
    var nI = new T;
    var oI = function(a, b) {
            (0, a.__uspapi)("getUSPData", 1, function(c, d) {
                b.Ca({
                    Ae: c != null ? c : void 0,
                    De: d ? void 0 : 2
                })
            })
        },
        pI = {
            Kd: function(a) {
                return a.Ca
            },
            Pc: function(a, b) {
                a = {};
                return a.__uspapiCall = {
                    callId: b,
                    command: "getUSPData",
                    version: 1
                }, a
            },
            ec: function(a, b) {
                b = b.__uspapiReturn;
                var c;
                a({
                    Ae: (c = b.returnValue) != null ? c : void 0,
                    De: b.success ? void 0 : 2
                })
            }
        };

    function qI(a) {
        var b = {};
        typeof a.data === "string" ? b = JSON.parse(a.data) : b = a.data;
        return {
            payload: b,
            Te: b.__uspapiReturn.callId
        }
    }
    var rI = function(a, b) {
        b = b === void 0 ? {} : b;
        P.call(this);
        var c;
        this.timeoutMs = (c = b.timeoutMs) != null ? c : 500;
        this.caller = new uC(a, "__uspapiLocator", function(d) {
            return typeof d.__uspapi === "function"
        }, qI);
        this.caller.A.set("getDataWithCallback", oI);
        this.caller.o.set("getDataWithCallback", pI)
    };
    w(rI, P);
    rI.prototype.O = function() {
        this.caller.dispose();
        P.prototype.O.call(this)
    };
    var sI = function(a, b) {
        var c = {};
        if (vC(a.caller)) {
            var d = Rh(function() {
                b(c)
            });
            xC(a.caller, "getDataWithCallback", {
                Ca: function(e) {
                    e.De || (c = e.Ae);
                    d()
                }
            });
            setTimeout(d, a.timeoutMs)
        } else b(c)
    };
    var tI = function(a) {
        this.D = B(a)
    };
    w(tI, H);
    var uI = function(a) {
        return Bd(function(b) {
            return b instanceof a && !(jd(b.D) & 2)
        })
    }(tI);

    function vI(a) {
        var b = {};
        (new TC(a)).l.forEach(function(c, d) {
            b[d] = c
        });
        return b
    }

    function wI(a) {
        return a === "1" || a === "true"
    }
    var xI = function(a, b, c, d) {
            b = b === void 0 ? {} : b;
            c = c === void 0 ? {} : c;
            this.j = a === void 0 ? !1 : a;
            this.o = d === void 0 ? !1 : d;
            a = {};
            b = x(Object.entries(b));
            for (d = b.next(); !d.done; d = b.next()) {
                var e = x(d.value);
                d = e.next().value;
                e = e.next().value;
                e != null && (a[d] = String(e))
            }
            this.l = a;
            this.g = new fI(c)
        },
        yI = function(a, b) {
            var c = !0;
            c = c === void 0 ? !1 : c;
            var d = new TC(a);
            var e = d.j;
            (d = vb(d.g, "googleads.g.doubleclick.net") && aE("/pagead/(live/)?ads", e)) || (e = new VH(a), d = e.g, e = WH(e, e.j), d = !vb(d, ".g.doubleclick.net") && (vb(d, "doubleclick.net") ||
                vb(d, "pagead2.googlesyndication.com")) && aE("/(ad|pfad)[x|i|j]?/", e));
            d || (d = new TC(a), e = d.j, d = vb(d.g, "doubleclick.net") && aE("/gampad/(live/)?ads", e));
            (d = d || (new TC(a)).g == "bid.g.doubleclick.net") || (d = new TC(a), e = d.j, d = d.g === "ad.doubleclick.net" && aE("/dv3/adv", e));
            d || (d = new TC(a), e = d.j, d = d.g === "pubads.g.doubleclick.net" && (aE("/ssai/", e) || aE("/ondemand/", e)));
            return new xI(d, vI(a), b, c)
        },
        BI = function(a) {
            var b = a.g.g;
            var c = zI(a, "gdpr_consent");
            b = b && b !== "tcunavailable" ? b : b === "tcunavailable" ? c || b : c || "";
            if (b ===
                "tcunavailable") return null;
            var d;
            return (d = gC(b, AI(a))) != null ? d : null
        },
        zI = function(a, b) {
            if (a.l.hasOwnProperty(b)) return a.l[b]
        },
        DI = function(a) {
            var b;
            if (!(b = CI(a))) {
                if (AI(a)) {
                    a = BI(a);
                    if (b = !!a) {
                        var c = c === void 0 ? {} : c;
                        b = DC(a) ? a.gdprApplies === !1 ? !0 : a.tcString === "tcunavailable" ? !c.idpcApplies : (c.idpcApplies || a.gdprApplies !== void 0 || c.kj) && (c.idpcApplies || typeof a.tcString === "string" && a.tcString.length) ? GC(a, "1", 0) : !0 : !1
                    }
                    c = b
                } else c = !0;
                b = !c
            }
            return b
        },
        CI = function(a) {
            a = zI(a, "ltd");
            return wI(a)
        },
        AI = function(a) {
            var b =
                zI(a, "gdpr"),
                c = a.g.j;
            b = (c === "1" || c === "0" ? c : b !== void 0 ? b : "").toLowerCase();
            b = b === "true" || b === "1";
            return Rn(jC) ? b || a.o : b
        },
        EI = function(a) {
            var b = new tI;
            var c = !DI(a);
            c = rg(b, 5, c);
            AI(a) ? (a = BI(a), a = !!a && !IC(a, ["2", "7", "9", "10"], 3)) : a = !1;
            rg(c, 8, a);
            return b
        },
        FI = function(a) {
            try {
                var b = a.g.gppString,
                    c = a.g.l.split("_").map(function(d) {
                        return Number(d)
                    });
                return SC(b, c)
            } catch (d) {
                return !1
            }
        };
    var GI = function(a) {
        this.D = B(a)
    };
    w(GI, H);
    GI.prototype.getVersion = function() {
        return E(this, 2)
    };
    var HI = function(a) {
        this.D = B(a)
    };
    w(HI, H);
    var II = function(a, b) {
            return wg(a, 2, b)
        },
        JI = function(a, b) {
            return wg(a, 3, b)
        },
        KI = function(a, b) {
            return wg(a, 4, b)
        },
        LI = function(a, b) {
            return wg(a, 5, b)
        },
        MI = function(a, b) {
            return wg(a, 9, b)
        },
        NI = function(a, b) {
            return ag(a, 10, b)
        },
        OI = function(a, b) {
            return rg(a, 11, b)
        },
        PI = function(a, b) {
            return wg(a, 1, b)
        },
        QI = function(a, b) {
            return rg(a, 7, b)
        };
    var RI = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");

    function SI(a) {
        var b;
        return (b = a.google_tag_data) != null ? b : a.google_tag_data = {}
    }

    function TI(a) {
        var b, c;
        return typeof((b = a.navigator) == null ? void 0 : (c = b.userAgentData) == null ? void 0 : c.getHighEntropyValues) === "function"
    }

    function UI() {
        var a = window;
        if (!TI(a)) return null;
        var b = SI(a);
        if (b.uach_promise) return b.uach_promise;
        a = a.navigator.userAgentData.getHighEntropyValues(RI).then(function(c) {
            b.uach != null || (b.uach = c);
            return c
        });
        return b.uach_promise = a
    }

    function VI(a) {
        var b;
        return OI(NI(LI(II(PI(KI(QI(MI(JI(new HI, a.architecture || ""), a.bitness || ""), a.mobile || !1), a.model || ""), a.platform || ""), a.platformVersion || ""), a.uaFullVersion || ""), ((b = a.fullVersionList) == null ? void 0 : b.map(function(c) {
            var d = new GI;
            d = wg(d, 1, c.brand);
            return wg(d, 2, c.version)
        })) || []), a.wow64 || !1)
    }

    function WI() {
        var a, b;
        return (b = (a = UI()) == null ? void 0 : a.then(function(c) {
            return VI(c)
        })) != null ? b : null
    };
    var YI = function() {
            this.appName = null;
            new xI;
            this.secureSignals = null;
            TH();
            this.deviceId = "";
            this.g = this.referrer = this.Qe = null;
            new kk;
            new ik;
            XI(this)
        },
        ZI = function() {
            YI.getInstance();
            var a = "h.3.679.0";
            nI.j && (a += "/vpaid_adapter");
            return a
        },
        XI = function(a) {
            var b = WI();
            b && b.then(function(c) {
                if (c == null) c = null;
                else {
                    c = Ag(c);
                    for (var d = [], e = 0, f = 0; f < c.length; f++) {
                        var g = c.charCodeAt(f);
                        g > 255 && (d[e++] = g & 255, g >>= 8);
                        d[e++] = g
                    }
                    c = Rc(d, 3)
                }
                a.g = c
            })
        };
    YI.getInstance = function() {
        return J(YI)
    };
    var aJ = function(a) {
            a = a === void 0 ? !1 : a;
            var b = lI(nI);
            if (b && hI(b, "forceCustomPlayback") || nI.j) return !0;
            if (SD() && a) return !1;
            a = a && (SD() || TD(10)) && nI.getDisableCustomPlaybackForIOS10Plus();
            return (wc || zc) && !a || vc && (!vc || !RD(QD, 4)) || $I() ? !0 : !1
        },
        bJ = function(a) {
            return a === null ? !1 : nI.j ? !0 : Ac || SD() ? UD(a) ? SD() || TD(10) && nI.getDisableCustomPlaybackForIOS10Plus() ? !1 : !0 : !0 : vc && (!vc || !RD(QD, 4)) || $I() ? !0 : !1
        },
        cJ = function() {
            var a = lI(nI);
            return a && hI(a, "disableOnScreenDetection") ? !1 : !Uq()
        },
        $I = function() {
            return dJ() === 1 ||
                dJ() === 2
        },
        dJ = function() {
            switch (YI.getInstance(), 0) {
                case 1:
                    return 3;
                case 2:
                    return 1
            }
            var a = y.navigator || null;
            return (YI.getInstance(), YI.getInstance(), a && Vq(a)) || YI.getInstance().Qe === "tvos" ? 1 : Wq() ? 2 : 0
        };
    var eJ = function(a, b) {
        return a.indexOf(b) == 0 ? a.substr(b.length) : null
    };

    function fJ() {
        if (Uq()) return window.location.href;
        var a = fp(),
            b = a.j,
            c = a.g;
        a = a.l;
        var d = null;
        if (a) try {
            var e = iD(a.url),
                f = e.j,
                g = eJ(f, "/v/");
            g || (g = eJ(f, "/a/"));
            if (!g) throw Error("Can not extract standalone amp url.");
            var h = eJ("/" + g, "/s/"),
                k = XC(e.l);
            k.remove("amp_js_v");
            k.remove("amp_lite");
            var l = h ? iD("https://" + h) : iD("http://" + g);
            WC(l, k);
            d = l.toString()
        } catch (p) {
            d = null
        }
        return d ? d : b && b.url ? b.url : c && c.url ? c.url : ""
    }

    function gJ() {
        var a = cp();
        a = x(a);
        for (var b = a.next(); !b.done; b = a.next())
            if (b = b.value, b.url && b.url.includes("amp=1")) return !0;
        return window.context != null ? (a = Number(window.context.ampcontextVersion), isNaN(a) ? !1 : Math.floor(a) > 0) : fp().l != null
    }

    function hJ() {
        var a = Po().location.ancestorOrigins;
        return a ? a.length > 0 ? [].concat(ra(a)).join(",") : "" : ""
    };

    function iJ() {
        var a = Po(),
            b = document;
        return new TC(a.parent === a ? a.location.href : b.referrer)
    }

    function jJ(a, b) {
        gD(a, "url", "");
        try {
            var c = 2083 - a.toString().length - 1;
            if (c <= 0) return a.toString();
            for (var d = b.slice(0, c), e = encodeURIComponent(d), f = c; f > 0 && e.length > c;) d = b.slice(0, f--), e = encodeURIComponent(d);
            gD(a, "url", d)
        } catch (g) {}
        return a.toString()
    };
    var W = {},
        kJ = (W.creativeView = "creativeview", W.start = "start", W.midpoint = "midpoint", W.firstQuartile = "firstquartile", W.thirdQuartile = "thirdquartile", W.complete = "complete", W.mute = "mute", W.unmute = "unmute", W.pause = "pause", W.rewind = "rewind", W.resume = "resume", W.fullscreen = "fullscreen", W.exitFullscreen = "exitfullscreen", W.expand = "expand", W.collapse = "collapse", W.close = "close", W.acceptInvitation = "acceptinvitation", W.adCanPlay = "adCanPlay", W.adStarted = "adStarted", W.abandon = "abandon", W.acceptInvitationLinear = "acceptinvitationlinear",
            W.engagedView = "engagedview", W.instreamAdComplete = "instreamAdComplete", W.skipShown = "skipshown", W.skippableStateChanged = "skippableStateChanged", W.skip = "skip", W.progress = "progress", W.publisher_invoked_skip = "PUBLISHER_INVOKED_SKIP", W.annotation_start = "annotation_start", W.annotation_click = "annotation_click", W.annotation_close = "annotation_close", W.cta_annotation_shown = "cta_annotation_shown", W.cta_annotation_clicked = "cta_annotation_clicked", W.cta_annotation_closed = "cta_annotation_closed", W.replay = "replay",
            W.stop = "stop", W.autoplayDisallowed = "autoplayDisallowed", W.error = "error", W.mediaLoadTimeout = "mediaLoadTimeout", W.linearChanged = "linearChanged", W.click = "click", W.contentPauseRequested = "contentPauseRequested", W.contentResumeRequested = "contentResumeRequested", W.discardAdBreak = "discardAdBreak", W.updateAdsRenderingSettings = "updateAdsRenderingSettings", W.durationChange = "durationChange", W.expandedChanged = "expandedChanged", W.autoClose = "autoClose", W.userClose = "userClose", W.userRecall = "userRecall", W.prefetched =
            "prefetched", W.loaded = "loaded", W.init = "init", W.allAdsCompleted = "allAdsCompleted", W.adMetadata = "adMetadata", W.adBreakReady = "adBreakReady", W.adBreakFetchError = "adBreakFetchError", W.log = "log", W.volumeChange = "volumeChange", W.companionBackfill = "companionBackfill", W.companionInitialized = "companionInitialized", W.companionImpression = "companionImpression", W.companionClick = "companionClick", W.impression = "impression", W.interaction = "interaction", W.adProgress = "adProgress", W.adBuffering = "adBuffering", W.trackingUrlPinged =
            "trackingUrlPinged", W.measurable_impression = "measurable_impression", W.custom_metric_viewable = "custom_metric_viewable", W.viewable_impression = "viewable_impression", W.fully_viewable_audible_half_duration_impression = "fully_viewable_audible_half_duration_impression", W.audio_audible = "audio_audible", W.audio_measurable = "audio_measurable", W.overlay_resize = "overlay_resize", W.overlay_unmeasurable_impression = "overlay_unmeasurable_impression", W.overlay_unviewable_impression = "overlay_unviewable_impression", W.overlay_viewable_immediate_impression =
            "overlay_viewable_immediate_impression", W.overlay_viewable_end_of_session_impression = "overlay_viewable_end_of_session_impression", W.externalActivityEvent = "externalActivityEvent", W.adEvent = "adEvent", W.configure = "configure", W.remainingTime = "remainingTime", W.destroy = "destroy", W.resize = "resize", W.volume = "volume", W.authorIconClicked = "videoAuthorIconClicked", W.authorNameClicked = "videoAuthorClicked", W.videoClicked = "videoClicked", W.videoIconClicked = "videoIconClicked", W.learnMoreClicked = "videoLearnMoreClicked",
            W.muteClicked = "videoMuteClicked", W.titleClicked = "videoTitleClicked", W.videoSkipClicked = "SKIPPED", W.unmuteClicked = "videoUnmuteClicked", W.vpaidEvent = "vpaidEvent", W.show_ad = "show_ad", W.video_card_endcap_collapse = "video_card_endcap_collapse", W.video_card_endcap_dismiss = "video_card_endcap_dismiss", W.video_card_endcap_impression = "video_card_endcap_impression", W.mediaUrlPinged = "mediaUrlPinged", W.breakStart = "breakstart", W.breakEnd = "breakend", W.omidReady = "omidReady", W.omidUnavailable = "omidUnavailable", W.omidAdSessionCompleted =
            "omidAdSessionCompleted", W.omidAdSessionAbandoned = "omidAdSessionAbandoned", W.verificationNotExecuted = "verificationNotExecuted", W.loadStart = "loadStart", W.seeked = "seeked", W.seeking = "seeking", W);
    var lJ = new function() {
        this.g = new Map;
        this.l = 0;
        this.j = window.fetch != null
    };

    function mJ(a) {
        var b = b === void 0 ? lJ : b;
        var c = c === void 0 ? null : c;
        a = new fE(a, c ? c : c);
        var d = d === void 0 ? !1 : d;
        var e = e === void 0 ? !1 : e;
        a.g != null || e ? HE(b, a.url, d, e, a.g) : HE(b, a.url, d)
    };
    var X = function() {
        this.l = Math.random() < .01;
        this.j = Math.floor(Math.random() * 4503599627370496);
        this.g = null
    };
    X.prototype.report = function(a, b, c) {
        b = b === void 0 ? {} : b;
        if (y.G_testRunner == null && (this.l || (c === void 0 ? 0 : c))) {
            b.lid = a;
            ZI() && (b.sdkv = ZI());
            this.g && (b.palv = this.g);
            a = Hm().sort().join(",");
            wb(Ri(a)) || (b.e = a);
            b = nJ(this, b);
            var d = new TC("http://pagead2.googlesyndication.com/pagead/gen_204");
            Zh(b, function(e, f) {
                e != null && gD(d, f, e == null ? "" : typeof e === "boolean" ? e ? "t" : "f" : "" + e)
            }, this);
            b = iJ().o;
            b !== "http" && b !== "https" || UC(d, b);
            b = d.toString();
            a = hD(d, "url");
            a != null && Lb() && b.length > 2083 && (b = jJ(d, a));
            mJ(b)
        }
    };
    var nJ = function(a, b) {
        b.id = "ima_html5";
        var c = iJ();
        b.c = a.j;
        b.domain = c.g;
        return b
    };
    X.getInstance = function() {
        return J(X)
    };

    function oJ(a) {
        var b = Date.now(),
            c = {};
        a = (c["x-afma-token-requester-type"] = a, c);
        c = "https://pubads.g.doubleclick.net/adsid/integrator.json?aos=" + encodeURIComponent(hJ());
        return (new zE).get({
            url: c,
            withCredentials: !0,
            timeout: new dE,
            headers: a
        }).then(function(d) {
            var e = Date.now();
            d = d.newToken || "";
            var f = {};
            X.getInstance().report(182, (f.t = e - b, f.aos = hJ(), f));
            return new pJ(d)
        }).catch(function(d) {
            var e = "not instanceof Error";
            d instanceof Error && (e = gE(Number(d.message)));
            d = Date.now();
            var f = {};
            X.getInstance().report(182,
                (f.except = e, f.t = d - b, f));
            return Promise.resolve(qJ)
        })
    }
    var rJ = function() {
        Q.call(this);
        this.g = null;
        this.A = new jE(this);
        Cr(this, this.A);
        this.j = new Lw(72E5);
        this.l = Promise.resolve(qJ)
    };
    w(rJ, Q);
    var sJ = function(a) {
        var b = "requester_type_8";
        b = b === void 0 ? "requester_type_9" : b;
        var c = function(d) {
            a.g = d;
            return a.g
        };
        a.l = oJ(b).then(c);
        a.j = new Lw(72E5);
        a.A.listen(a.j, "tick", function() {
            a.l = oJ(b).then(c)
        });
        a.j.start();
        Br(a, function() {
            a.j.stop()
        })
    };
    rJ.prototype.getId = function() {
        var a = this;
        return La(function(b) {
            if (b.g == 1) return a.g != null && a.g !== qJ ? (b.g = 2, b = void 0) : b = Aa(b, a.l, 3), b;
            b.g != 2 && (a.g = b.j);
            return b.return(a.g)
        })
    };
    var pJ = function(a) {
            this.id = a
        },
        qJ = new pJ("");
    var tJ = function(a, b, c, d, e) {
            this.name = a;
            this.type = b;
            this.data = c;
            this.id = d;
            this.g = e
        },
        uJ = function(a) {
            Q.call(this);
            this.A = [];
            this.j = !1;
            this.l = a || "goog_" + Si++
        };
    w(uJ, Q);
    uJ.prototype.connect = function() {
        for (this.j = !0; this.A.length !== 0;) {
            var a = this.A.shift();
            a && this.sendMessage(a)
        }
    };
    var vJ = function(a, b, c, d, e, f) {
        a.j ? a.sendMessage(new tJ(b, c, d, e, f)) : a.A.push(new tJ(b, c, d, e, f))
    };
    uJ.prototype.sendMessage = function() {};
    var wJ = function(a, b, c, d, e, f) {
        e = e === void 0 ? "" : e;
        f = f === void 0 ? "" : f;
        Iv.call(this, a);
        this.messageType = b;
        this.na = c;
        this.sc = d;
        this.origin = e;
        this.id = f
    };
    w(wJ, Iv);
    wJ.prototype.getId = function() {
        return this.id
    };
    wJ.prototype.toString = function() {
        return ""
    };
    var xJ = {
            IMAGE: "Image",
            FLASH: "Flash",
            ALL: "All"
        },
        yJ = {
            HTML: "Html",
            IFRAME: "IFrame",
            STATIC: "Static",
            ALL: "All"
        },
        zJ = {
            IGNORE: "IgnoreSize",
            SELECT_EXACT_MATCH: "SelectExactMatch",
            SELECT_NEAR_MATCH: "SelectNearMatch",
            SELECT_FLUID: "SelectFluid"
        },
        AJ = function() {
            this.allowCustom = !0;
            this.creativeType = this.resourceType = "All";
            this.sizeCriteria = "SelectExactMatch";
            this.nearMatchPercent = 90;
            this.adSlotIds = []
        };
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.CreativeType", xJ);
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.ResourceType", yJ);
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$companion_ad_selection_settings.CompanionAdSelectionSettings.SizeCriteria", zJ);
    var CJ = function(a, b) {
            b = b === void 0 ? new AJ : b;
            this.g = a;
            this.settings = b ? b : new AJ;
            this.resourceType = BJ(yJ, this.settings.resourceType) ? this.settings.resourceType : "All";
            this.creativeType = BJ(xJ, this.settings.creativeType) ? this.settings.creativeType : "All";
            this.sizeCriteria = BJ(zJ, this.settings.sizeCriteria) ? this.settings.sizeCriteria : "SelectExactMatch";
            this.adSlotIds = this.settings.adSlotIds != null ? this.settings.adSlotIds : [];
            this.nearMatchPercent = typeof this.settings.nearMatchPercent === "number" && this.settings.nearMatchPercent >
                0 && this.settings.nearMatchPercent <= 100 ? this.settings.nearMatchPercent : 90
        },
        FJ = function(a, b) {
            var c = [];
            b.forEach(function(d) {
                a.settings.allowCustom && (!wb(d.getContent()) && (isNaN(d.data.sequenceNumber) || isNaN(d.data.mainAdSequenceNumber) || d.data.mainAdSequenceNumber === d.data.sequenceNumber) && DJ(a, d) ? c.push(d) : (d = EJ(a, d), d != null && !wb(d.getContent()) && c.push(d)))
            });
            return c
        };
    CJ.prototype.He = function() {
        return this.resourceType
    };
    var DJ = function(a, b) {
            var c;
            if (c = b.getContentType() !== "Flash") {
                if (c = a.resourceType === "All" || a.resourceType === b.He()) c = b.getContentType(), c = c == null ? !0 : a.creativeType === "All" || a.creativeType === c;
                c && (c = b.getAdSlotId(), c = a.adSlotIds.length === 0 ? !0 : c != null ? a.adSlotIds.includes(c) : !1)
            }
            if (c)
                if (c = b.getSize(), (b = !!b.data.fluidSize) || a.g.Fe) a = b && a.g.Fe;
                else if (a.sizeCriteria === "IgnoreSize" || Gk(a.g.size, c)) a = !0;
            else {
                if (b = a.sizeCriteria === "SelectNearMatch") b = c.width, c = c.height, b = b > a.g.size.width || c > a.g.size.height ||
                    b < a.nearMatchPercent / 100 * a.g.size.width || c < a.nearMatchPercent / 100 * a.g.size.height ? !1 : !0;
                a = b
            } else a = !1;
            return a
        },
        EJ = function(a, b) {
            b = GJ(b);
            return b == null ? null : b.find(function(c) {
                return DJ(a, c)
            }) || null
        },
        BJ = function(a, b) {
            return b != null && ni(a, b)
        };

    function HJ(a) {
        var b = new ik;
        var c = a.jc;
        var d = c.clientWidth;
        var e = c.clientHeight;
        typeof c.getBoundingClientRect === "function" && Uo(Io(c), c) ? (c = c.getBoundingClientRect(), d = document.elementsFromPoint(c.x + .5 * d, c.y + .5 * e)) : d = [];
        if (d = IJ(d, a)) {
            a = new hk;
            c = d.getBoundingClientRect();
            e = c.y;
            c = c.x;
            var f = new fk;
            e = ug(f, 1, e);
            e = ug(e, 2, c);
            c = d.duration;
            var g = d.clientWidth;
            f = d.clientHeight;
            var h = new gk;
            g = ug(h, 1, g);
            f = ug(g, 2, f);
            c === Number.POSITIVE_INFINITY || isNaN(c) || (g = new ek, c = tg(g, 1, c), D(a, 3, c));
            d = Number(window.getComputedStyle(d).opacity);
            e = D(a, 1, e);
            e = D(e, 2, f);
            tg(e, 4, d);
            b = D(b, 2, a)
        } else a = new hk, b = D(b, 2, a);
        return b
    }

    function IJ(a, b) {
        if (a.length === 0) return null;
        var c = b.ca.A.g,
            d, e, f = (e = (d = b.ya) == null ? void 0 : d.A.g) != null ? e : null;
        a = a.filter(function(g) {
            return g.tagName === "VIDEO" && !g.isEqualNode(c) && !g.isEqualNode(f)
        });
        return a.length > 0 ? a[0] : null
    };
    var JJ = function(a, b) {
        this.message = a;
        this.errorCode = b
    };
    JJ.prototype.getErrorCode = function() {
        return this.errorCode
    };
    JJ.prototype.getMessage = function() {
        return this.message
    };
    var KJ = new JJ("Failed to initialize ad playback element before starting ad playback.", 400),
        LJ = new JJ("The provided {0} information: {1} is invalid.", 1101);

    function MJ(a, b) {
        var c = b === void 0 ? null : b;
        var d = Ma.apply(2, arguments);
        if (!(c instanceof $H)) {
            var e = a.getErrorCode(),
                f = a.getMessage();
            if (d.length > 0)
                for (var g = 0; g < d.length; g++) f = f.replace(new RegExp("\\{" + g + "\\}", "ig"), d[g]);
            d = new $H("adPlayError", f, e);
            d.g = c;
            c = d
        }
        return c
    };
    var NJ = {
        dg: [],
        bg: 0,
        jg: [],
        uj: !1,
        Wf: !1
    };

    function OJ(a, b, c) {
        b = b === void 0 ? window : b;
        c = c === void 0 ? function() {} : c;
        try {
            return b.localStorage.getItem(a)
        } catch (d) {
            return c(d), null
        }
    }

    function PJ(a, b, c) {
        var d = window;
        d = d === void 0 ? window : d;
        c = c === void 0 ? function() {} : c;
        return hg(b, 5) ? OJ(a, d, c) : null
    }

    function QJ(a, b, c, d) {
        c = c === void 0 ? window : c;
        d = d === void 0 ? function() {} : d;
        try {
            return c.localStorage.setItem(a, b), !0
        } catch (e) {
            d(e)
        }
        return !1
    }

    function RJ(a, b, c, d) {
        var e = window;
        e = e === void 0 ? window : e;
        d = d === void 0 ? function() {} : d;
        return hg(c, 5) ? QJ(a, b, e, d) : !1
    };
    var SJ = function() {};
    SJ.getInstance = function() {
        throw Error("Must be overridden");
    };
    var TJ = function() {
        this.g = 0
    };
    w(TJ, SJ);
    TJ.vb = void 0;
    TJ.getInstance = function() {
        return TJ.vb ? TJ.vb : TJ.vb = new TJ
    };

    function UJ(a, b, c, d) {
        c = c === void 0 ? null : c;
        d = d === void 0 ? {} : d;
        var e = TJ.getInstance();
        e.g === 0 && (e.g = Math.random() < .001 ? 2 : 1);
        e.g === 2 && (e = {}, wj(Object.assign({}, (e.c = String(a), e.pc = String(qj()), e.em = c, e.lid = b, e.eids = J(Am).g().join(), e), d), "esp"))
    };

    function VJ() {
        var a = window;
        var b = b === void 0 ? function() {} : b;
        return new Promise(function(c) {
            var d = function() {
                c(b());
                Wh(a, "load", d)
            };
            Vh(a, "load", d)
        })
    };
    var WJ = function() {
            this.cache = {}
        },
        YJ = function() {
            XJ || (XJ = new WJ);
            return XJ
        },
        ZJ = function(a) {
            if (a !== void 0)
                for (var b = x(Object.keys(a)), c = b.next(); !c.done; c = b.next())
                    if (c = c.value, c.startsWith("_GESPSK")) try {
                        a.removeItem(c)
                    } catch (d) {}
            XJ = new WJ
        },
        $J = function(a) {
            var b = eg(a, 3);
            if (!b) return 3;
            if (gg(a, 2) === void 0) return 4;
            a = Date.now();
            return a > b + 2592E5 ? 2 : a > b + 432E5 ? 1 : 0
        };
    WJ.prototype.get = function(a, b) {
        if (this.cache[a]) return {
            Kb: this.cache[a],
            success: !0
        };
        var c = "_GESPSK-" + a,
            d = "",
            e = !1;
        if (uI(b)) d = PJ(c, b, function(k) {
            UJ(6, a, k == null ? void 0 : k.message);
            e = !0
        });
        else try {
            d = b.getItem(c)
        } catch (k) {
            var f;
            UJ(6, a, (f = k) == null ? void 0 : f.message);
            e = !0
        }
        if (e) return {
            Kb: null,
            success: !1
        };
        if (!d) return {
            Kb: null,
            success: !0
        };
        try {
            var g = Yx(d);
            this.cache[a] = g;
            return {
                Kb: g,
                success: !0
            }
        } catch (k) {
            var h;
            UJ(5, a, (h = k) == null ? void 0 : h.message);
            return {
                Kb: null,
                success: !1
            }
        }
    };
    WJ.prototype.set = function(a, b) {
        var c = gg(a, 1),
            d = "_GESPSK-" + c;
        Xx(a);
        if (uI(b)) {
            if (!RJ(d, Ag(a), b, function(f) {
                    UJ(7, c, f == null ? void 0 : f.message)
                })) return !1
        } else try {
            b.setItem(d, Ag(a))
        } catch (f) {
            var e;
            UJ(7, c, (e = f) == null ? void 0 : e.message);
            return !1
        }
        this.cache[c] = a;
        return !0
    };
    WJ.prototype.remove = function(a, b) {
        a = gg(a, 1);
        try {
            b.removeItem("_GESPSK-" + a), delete this.cache[a]
        } catch (d) {
            var c;
            UJ(8, a, (c = d) == null ? void 0 : c.message)
        }
    };
    var XJ = null;

    function aK(a) {
        var b = new ay;
        UJ(56, "", null);
        if (a) {
            var c = [],
                d = RegExp("^_GESPSK-(.+)$");
            try {
                for (var e = 0; e < a.length; e++) {
                    var f = (d.exec(a.key(e)) || [])[1];
                    f && c.push(f)
                }
            } catch (k) {}
            c = x(c);
            e = c.next();
            for (d = {}; !e.done; d = {
                    Yb: void 0
                }, e = c.next())
                if (d.Yb = e.value, (e = YJ().get(d.Yb, a).Kb) && !bK(b, d.Yb) && (f = $J(e), f !== 2 && f !== 3)) {
                    rg(e, 9, !1);
                    if ((f = gg(e, 2)) && f.length > 1024) {
                        var g = {};
                        UJ(55, d.Yb, null, (g.sl = String(f.length), g));
                        f = e.Za(Tx(108));
                        Af(f, 2)
                    }
                    dg(b, 2, Vx, e);
                    e = gg(e, 2);
                    g = f = void 0;
                    var h = {};
                    UJ(19, d.Yb, null, (h.hs = e ? "1" : "0",
                        h.sl = String((g = (f = e) == null ? void 0 : f.length) != null ? g : -1), h))
                }
        }
        if (!Zf(b, Vx, 2, Bf()).length) return null;
        a = {};
        UJ(50, "", null, (a.ns = String(Zf(b, Vx, 2, Bf()).length), a));
        return Rc(b.g(), 3)
    }

    function bK(a, b) {
        return Zf(a, Vx, 2, Bf()).some(function(c) {
            return gg(c, 1) === b && gg(c, 2) != null
        })
    };
    var cK = function() {
        var a = this;
        this.promise = new Promise(function(b, c) {
            a.resolve = b;
            a.reject = c
        })
    };
    var dK = function(a) {
        a = Error.call(this, a);
        this.message = a.message;
        "stack" in a && (this.stack = a.stack);
        Object.setPrototypeOf(this, dK.prototype);
        this.name = "InputError"
    };
    w(dK, Error);
    var eK = function() {
            this.lb = !1
        },
        fK = function() {
            eK.apply(this, arguments);
            this.cd = new cK
        };
    w(fK, eK);
    var gK = function(a, b) {
        a.lb || (a.lb = !0, a.bd = b, a.cd.resolve(b))
    };
    ea.Object.defineProperties(fK.prototype, {
        promise: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.cd.promise
            }
        },
        Ye: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.lb
            }
        },
        error: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.Qd
            }
        }
    });
    var hK = function() {
        fK.apply(this, arguments)
    };
    w(hK, fK);
    var iK = function(a, b) {
            gK(a, b)
        },
        jK = function(a, b) {
            b.then(function(c) {
                gK(a, c)
            })
        };
    hK.prototype.Za = function(a) {
        this.lb || (this.lb = !0, this.bd = null, this.Qd = a, this.cd.reject(a))
    };
    var kK = function(a) {
        this.lb = !1;
        this.g = a
    };
    w(kK, eK);
    kK.prototype.Ye = function() {
        return this.g.lb
    };
    ea.Object.defineProperties(kK.prototype, {
        error: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.g.Qd
            }
        }
    });
    var lK = function(a) {
        kK.call(this, a);
        this.g = a
    };
    w(lK, kK);
    ea.Object.defineProperties(lK.prototype, {
        value: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.g.bd
            }
        }
    });
    var mK = function(a) {
        kK.call(this, a);
        this.g = a
    };
    w(mK, kK);
    ea.Object.defineProperties(mK.prototype, {
        value: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                var a;
                return (a = this.g.bd) != null ? a : null
            }
        }
    });
    var nK = function() {
        fK.apply(this, arguments)
    };
    w(nK, fK);
    nK.prototype.notify = function() {
        gK(this, null)
    };
    var oK = function() {
        P.apply(this, arguments);
        this.g = [];
        this.j = [];
        this.l = []
    };
    w(oK, P);
    var pK = function(a, b) {
        a.j.push({
            xc: !1,
            yd: b
        })
    };
    oK.prototype.xc = function(a) {
        var b = this.j.find(function(c) {
            return c.yd === a
        });
        b && (b.xc = !0)
    };
    oK.prototype.O = function() {
        this.g.length = 0;
        this.l.length = 0;
        this.j.length = 0;
        P.prototype.O.call(this)
    };

    function qK(a, b) {
        var c, d;
        return La(function(e) {
            if (e.g == 1) return c = b ? a.filter(function(f) {
                return !f.xc
            }) : a, Aa(e, Promise.all(c.map(function(f) {
                return f.yd.promise
            })), 2);
            if (a.length === c.length) return e.return();
            d = a.filter(function(f) {
                return f.xc
            });
            return Aa(e, Promise.race([Promise.all(d.map(function(f) {
                return f.yd.promise
            })), new Promise(function(f) {
                return void setTimeout(f, b)
            })]), 0)
        })
    }
    var rK = function(a, b) {
        P.call(this);
        this.id = a;
        this.timeoutMs = b;
        this.A = !1;
        this.g = new oK;
        Cr(this, this.g)
    };
    w(rK, P);
    rK.prototype.start = function() {
        var a = this,
            b, c;
        return La(function(d) {
            if (d.g == 1) {
                if (a.A) return d.return();
                a.A = !0;
                d.l = 2;
                return Aa(d, qK(a.g.j, (b = a.P) != null ? b : a.timeoutMs), 4)
            }
            if (d.g != 2) {
                if (!a.Ea()) {
                    for (var e = 0, f = x(a.g.l), g = f.next(); !g.done; g = f.next()) {
                        if (g.value.g.bd == null) throw Error("missing input: " + a.id + "/" + e);
                        ++e
                    }
                    a.j()
                }
                return Ba(d)
            }
            c = Da(d);
            if (a.Ea()) return d.return();
            if (!(c instanceof dK) && c instanceof Error && (a.F ? a.F(a.id, c) : a.reportError(c), a.g.g.length))
                for (e = new dK(c.message), f = x(a.g.g), g = f.next(); !g.done; g =
                    f.next())
                    if (g = g.value, !g.Ye) {
                        var h = e;
                        g.lb = !0;
                        g.Qd = h;
                        g.cd.reject(h)
                    } d.g = 0
        })
    };
    var sK = function(a) {
            var b = b === void 0 ? new hK : b;
            a.g.g.push(b);
            return b
        },
        tK = function(a) {
            var b = b === void 0 ? new nK : b;
            a.g.g.push(b);
            return b
        },
        uK = function(a, b) {
            pK(a.g, b);
            b = new lK(b);
            a.g.l.push(b);
            return b
        },
        vK = function(a, b) {
            pK(a.g, b);
            return new mK(b)
        };
    var wK = function() {};
    var xK = function() {
        P.call(this);
        this.o = [];
        this.B = [];
        this.A = {};
        this.g = [];
        this.j = new cK;
        this.l = {}
    };
    w(xK, P);
    var yK = function(a, b) {
            Cr(a, b);
            a.o.push(b)
        },
        zK = function(a, b) {
            b = x(b);
            for (var c = b.next(); !c.done; c = b.next()) yK(a, c.value)
        },
        AK = function(a) {
            var b, c, d, e, f, g, h, k, l, p, n, q;
            La(function(t) {
                switch (t.g) {
                    case 1:
                        if (!a.g.length) {
                            t.g = 2;
                            break
                        }
                        return Aa(t, Promise.all(a.g.map(function(u) {
                            return u.j.promise
                        })), 2);
                    case 2:
                        b = x(a.o);
                        for (c = b.next(); !c.done; c = b.next()) d = c.value, d.start();
                        e = x(a.B);
                        for (f = e.next(); !f.done; f = e.next()) g = f.value, AK(g);
                        if (!a.l) {
                            t.g = 4;
                            break
                        }
                        h = Object.keys(a.l);
                        if (!h.length) {
                            t.g = 4;
                            break
                        }
                        return Aa(t, Promise.all(Object.values(a.l).map(function(u) {
                                return u.promise
                            })),
                            6);
                    case 6:
                        for (k = t.j, l = 0, p = x(h), n = p.next(); !n.done; n = p.next()) q = n.value, a.A[q] = k[l++];
                    case 4:
                        return a.j.resolve(a.A), t.return(a.j.promise)
                }
            })
        };
    xK.prototype.O = function() {
        P.prototype.O.call(this);
        this.o.length = 0;
        this.B.length = 0;
        this.g.length = 0
    };
    var BK = function(a, b) {
        rK.call(this, a);
        this.id = a;
        this.B = b
    };
    w(BK, rK);
    BK.prototype.reportError = function(a) {
        this.B(this.id, a)
    };
    var CK = function(a, b, c, d) {
        BK.call(this, 1041, d);
        this.C = uK(this, a);
        c ? this.l = uK(this, c) : b && (this.o = vK(this, b))
    };
    w(CK, BK);
    CK.prototype.j = function() {
        var a = this.C.value,
            b, c, d, e = (d = (b = this.l) == null ? void 0 : b.value) != null ? d : (c = this.o) == null ? void 0 : c.value;
        e && YJ().set(a, e) && gg(a, 2) != null && UJ(27, gg(a, 1))
    };
    var DK = function(a, b) {
        BK.call(this, 1094, b);
        this.l = tK(this);
        this.o = vK(this, a)
    };
    w(DK, BK);
    DK.prototype.j = function() {
        var a = this.o.value;
        a && (ZJ(a), this.l.notify())
    };
    var EK = function(a, b) {
        BK.call(this, 1048, b);
        this.l = sK(this);
        this.o = sK(this);
        this.C = uK(this, a)
    };
    w(EK, BK);
    EK.prototype.j = function() {
        var a = this.C.value,
            b = function(c) {
                var d = {};
                UJ(c, gg(a, 1), null, (d.tic = String(Math.round((Date.now() - eg(a, 3)) / 6E4)), d))
            };
        switch ($J(a)) {
            case 0:
                b(24);
                break;
            case 1:
                b(25);
                gK(this.o, a);
                break;
            case 2:
                b(26);
                gK(this.l, a);
                break;
            case 3:
                UJ(9, gg(a, 1));
                gK(this.l, a);
                break;
            case 4:
                b(23), gK(this.l, a)
        }
    };
    var FK = function(a, b, c, d) {
        BK.call(this, 1027, d);
        this.Cc = a;
        this.l = sK(this);
        this.o = sK(this);
        var e;
        this.C = (e = c != null ? c : b) != null ? e : void 0
    };
    w(FK, BK);
    FK.prototype.j = function() {
        var a = YJ().get(this.Cc, this.C).Kb;
        if (!a) {
            a = Xx(Wx(this.Cc));
            var b = this.o,
                c = a.Za(Tx(100));
            gK(b, c)
        }
        gK(this.l, a)
    };
    var GK = function(a, b, c) {
        BK.call(this, 1046, c);
        this.output = tK(this);
        this.l = sK(this);
        this.o = uK(this, b);
        pK(this.g, a)
    };
    w(GK, BK);
    GK.prototype.j = function() {
        gK(this.l, this.o.value)
    };
    var HK = function(a, b, c) {
        BK.call(this, 1047, c);
        this.collectorFunction = a;
        this.l = sK(this);
        this.o = sK(this);
        this.C = sK(this);
        this.G = uK(this, b)
    };
    w(HK, BK);
    HK.prototype.j = function() {
        var a = this,
            b = this.G.value,
            c = gg(b, 1);
        UJ(18, c);
        try {
            var d = gl();
            this.collectorFunction().then(function(e) {
                UJ(29, c, null, {
                    delta: String(gl() - d)
                });
                var f = a.l,
                    g = wg(b, 2, e);
                gK(f, g);
                gK(a.C, e != null ? e : null)
            }).catch(function(e) {
                UJ(28, c, IK(e));
                e = a.o;
                var f = b.Za(Tx(106));
                gK(e, f)
            })
        } catch (e) {
            UJ(1, c, IK(e)), iK(this.o, b.Za(Tx(107)))
        }
    };

    function IK(a) {
        return typeof a === "string" ? a : a instanceof Error ? a.message : null
    };
    var JK = function(a, b) {
        BK.call(this, 1028, b);
        this.l = sK(this);
        this.o = uK(this, a)
    };
    w(JK, BK);
    JK.prototype.j = function() {
        var a = this.o.value,
            b = gg(a, 1);
        eg(a, 3) != null || UJ(35, b);
        gK(this.l, a)
    };
    var KK = function(a, b, c, d) {
        BK.call(this, 1050, d);
        this.C = c;
        this.l = sK(this);
        this.o = uK(this, a);
        this.G = vK(this, b)
    };
    w(KK, BK);
    KK.prototype.j = function() {
        var a = this.o.value,
            b = gg(a, 1),
            c = this.G.value;
        if (c == null) UJ(41, b), a.Za(Tx(111)), gK(this.l, a);
        else if (typeof c !== "string") UJ(21, b), b = this.l, a = a.Za(Tx(113)), gK(b, a);
        else {
            if (c.length > this.C) {
                var d = {};
                UJ(12, b, null, (d.sl = String(c.length), d));
                b = a.Za(Tx(108));
                Af(b, 2)
            } else c.length || UJ(20, b), Af(a, 10);
            gK(this.l, a)
        }
    };
    var LK = function(a) {
        BK.call(this, 1046, a);
        this.output = tK(this)
    };
    w(LK, BK);
    LK.prototype.j = function() {
        var a = this;
        VJ().then(function() {
            a.output.notify()
        })
    };

    function MK(a, b, c, d, e, f, g) {
        var h, k, l, p, n, q, t, u, v, C, R, U, da, V;
        return La(function(ma) {
            return ma.g == 1 ? (h = new xK(a, 2), k = new FK(b, f ? null : d, f, g), yK(h, k), l = null, f && (l = new hK, gK(l, f)), yK(h, new CK(k.o, l ? null : e, l, g)), p = new JK(k.l, g), yK(h, p), n = new EK(p.l, g), yK(h, n), q = new HK(c, n.l, g), yK(h, q), yK(h, new CK(q.o, l ? null : e, l, g)), t = new KK(q.l, q.C, 1024, g), yK(h, t), yK(h, new CK(t.l, l ? null : e, l, g)), u = new LK(g), yK(h, u), v = new GK(u.output, n.o, g), yK(h, v), C = new HK(c, v.l, g), yK(h, C), R = new CK(C.l, l ? null : e, l, g), yK(h, R), AK(h), V = b, Aa(ma,
                t.l.promise, 2)) : ma.return({
                id: V,
                collectorGeneratedData: (da = (U = ma.j) == null ? void 0 : gg(U, 2)) != null ? da : null
            })
        })
    };
    var NK = function(a, b, c, d, e, f) {
        BK.call(this, 1059, f);
        this.C = a;
        this.K = c;
        this.H = d;
        this.o = sK(this);
        this.M = uK(this, b);
        e ? this.l = uK(this, e) : d && (this.G = vK(this, d))
    };
    w(NK, BK);
    NK.prototype.j = function() {
        var a, b = (a = this.G) == null ? void 0 : a.value,
            c;
        a = ((c = this.l) == null ? 0 : c.value) ? hg(this.l.value, 5) : b;
        if (b || a) {
            var d = this.M.value;
            a = d.id;
            c = d.collectorFunction;
            var e;
            d = (e = d.networkCode) != null ? e : a;
            e = {};
            UJ(42, d, null, (e.ea = String(Number(this.K)), e));
            var f, g;
            jK(this.o, MK(this.C, d, c, b != null ? b : null, this.H, (g = (f = this.l) == null ? void 0 : f.value) != null ? g : null, this.B))
        }
    };
    var OK = function(a, b, c) {
        c = c === void 0 ? NJ : c;
        BK.call(this, 1057, b);
        this.l = a;
        this.G = c;
        this.o = sK(this);
        this.C = sK(this)
    };
    w(OK, BK);
    OK.prototype.j = function() {
        if (this.l)
            if (typeof this.l !== "object") UJ(46, "UNKNOWN_COLLECTOR_ID"), PK(this, "UNKNOWN_COLLECTOR_ID", 112);
            else {
                var a = this.l.id,
                    b = this.l.networkCode;
                a && b && (delete this.l.id, UJ(47, a + ";" + b));
                a = b != null ? b : a;
                typeof a !== "string" ? (b = {}, UJ(37, "INVALID_COLLECTOR_ID", null, (b.ii = JSON.stringify(a), b)), PK(this, "INVALID_COLLECTOR_ID", 102)) : typeof this.l.collectorFunction !== "function" ? (UJ(14, a), PK(this, a, 105)) : this.G.jg.includes(a) ? (UJ(22, a), PK(this, a, 104)) : gK(this.C, this.l)
            }
        else UJ(39, "UNKNOWN_COLLECTOR_ID"),
            PK(this, "UNKNOWN_COLLECTOR_ID", 110)
    };
    var PK = function(a, b, c) {
        a = a.o;
        b = Wx(b).Za(Tx(c));
        gK(a, b)
    };
    var QK = function(a, b, c, d, e, f) {
        var g = document;
        g = g === void 0 ? document : g;
        f = f === void 0 ? NJ : f;
        this.j = a;
        this.l = c;
        this.A = d;
        this.B = g;
        this.F = e;
        this.g = f;
        this.L = [];
        this.J = [];
        this.C = [];
        this.o = 0;
        a = x(b);
        for (b = a.next(); !b.done; b = a.next()) this.push(b.value)
    };
    QK.prototype.push = function(a) {
        var b = this;
        this.A || this.F();
        var c = function(f, g) {
            return void RK(b, f, g)
        };
        a = new OK(a, c, this.g);
        var d = new CK(a.o, this.l, null, c);
        c = new NK(this.j, a.C, this.A, this.l, null, c, this.g);
        var e = new xK(this.j, 3);
        zK(e, [a, d, c]);
        AK(e);
        a = c.o.promise;
        this.L.push(a);
        d = x(this.J);
        for (c = d.next(); !c.done; c = d.next()) a.then(c.value)
    };
    QK.prototype.addOnSignalResolveCallback = function(a) {
        this.J.push(a);
        for (var b = x(this.L), c = b.next(); !c.done; c = b.next()) c.value.then(a)
    };
    QK.prototype.addErrorHandler = function(a) {
        this.C.push(a)
    };
    QK.prototype.clearAllCache = function() {
        var a = this,
            b = this.B.currentScript instanceof HTMLScriptElement ? this.B.currentScript.src : "";
        if (this.o === 1) {
            var c = {};
            UJ(49, "", null, (c.url = b, c))
        } else if (this.g.dg.includes(String(jj(b != null ? b : "")))) c = {}, UJ(48, "", null, (c.url = b, c));
        else {
            var d = new xK(this.j, 4);
            c = new DK(this.l, function(e, f) {
                return void RK(a, e, f)
            });
            yK(d, c);
            AK(d);
            this.o = 1;
            setTimeout(function() {
                a.o = 0
            }, this.g.bg * 1E3);
            d = {};
            UJ(43, "", null, (d.url = b, d));
            return c.l.promise
        }
    };
    var RK = function(a, b, c) {
            a = x(a.C);
            for (var d = a.next(); !d.done; d = a.next()) d = d.value, d(b, c)
        },
        SK = function(a) {
            this.push = function(b) {
                a.push(b)
            };
            this.addOnSignalResolveCallback = function(b) {
                a.addOnSignalResolveCallback(b)
            };
            this.addErrorHandler = function(b) {
                a.addErrorHandler(b)
            };
            this.clearAllCache = function() {
                a.clearAllCache()
            }
        };

    function TK(a, b, c, d, e, f, g) {
        g = g === void 0 ? NJ : g;
        g.Wf || fj() === gj() ? UK(b, "encryptedSignalProviders", d, f) && UK(b, "secureSignalProviders", d, f) || (UJ(38, ""), VK(a, b, "encryptedSignalProviders", c, g, d, e, f), VK(a, b, "secureSignalProviders", c, g, d, function() {}, f)) : UJ(16, "")
    }

    function UK(a, b, c, d) {
        if (a[b] === void 0 || a[b] instanceof Array) return !1;
        a = a[b];
        d && a.addOnSignalResolveCallback(d);
        a.addErrorHandler(c);
        return !0
    }

    function VK(a, b, c, d, e, f, g, h) {
        var k;
        a = new QK(a, (k = b[c]) != null ? k : [], d, c === "secureSignalProviders", g, e);
        b[c] = new SK(a);
        h && a.addOnSignalResolveCallback(h);
        a.addErrorHandler(f)
    }

    function WK(a, b, c, d, e, f) {
        f = f === void 0 ? new wK : f;
        var g = g === void 0 ? NJ : g;
        var h = new hK;
        gK(h, b);
        TK(f, a, h, c, d, e, g)
    }

    function XK(a, b, c, d) {
        var e = YK;
        var f = f === void 0 ? new wK : f;
        var g = new Map;
        b = b.map(function(h) {
            var k = h.Cc;
            return new Promise(function(l) {
                g.set(k, l)
            })
        });
        WK(a, c, d, e, function(h) {
            var k = h.collectorGeneratedData;
            h = h.id;
            var l;
            return void((l = g.get(h)) == null ? void 0 : l({
                collectorGeneratedData: k,
                id: h
            }))
        }, f);
        return b
    };

    function ZK() {
        var a;
        return (a = y.googletag) != null ? a : y.googletag = {
            cmd: []
        }
    };

    function NN(a) {
        if (DI(a)) return null;
        try {
            return window.localStorage
        } catch (b) {
            return null
        }
    }

    function ON(a, b) {
        (a = NN(a)) && WK(ZK(), a, function() {}, YK, b)
    }

    function PN(a, b) {
        return (b = NN(b)) && a.length !== 0 ? XK(ZK(), a, b, function() {}) : null
    }

    function YK() {};

    function QN(a, b, c, d) {
        var e = new cK,
            f = "",
            g = function(k) {
                try {
                    var l = typeof k.data === "object" ? k.data : JSON.parse(k.data);
                    f === l.paw_id && (Wh(a, "message", g), l.error ? e.reject(Error(l.error)) : e.resolve(d(l)))
                } catch (p) {}
            },
            h = RN(a);
        return h ? (Vh(a, "message", g), f = c(h), e.promise) : (c = SN(a)) ? (f = String(Math.floor(hj() * 2147483647)), Vh(a, "message", g), b(c, f), e.promise) : null
    }

    function TN(a) {
        return QN(a, function(b, c) {
            var d, e;
            return void((d = (e = b.getGmaQueryInfo) != null ? e : b.getGmaSig) == null ? void 0 : d.postMessage(c))
        }, function(b) {
            return b.getQueryInfo()
        }, function(b) {
            return b.signal
        })
    }

    function UN() {
        var a = window;
        return !!RN(a) || !!SN(a)
    }

    function RN(a) {
        var b;
        if (typeof((b = a.gmaSdk) == null ? void 0 : b.getQueryInfo) === "function") return a.gmaSdk
    }

    function SN(a) {
        var b, c, d, e, f, g;
        if (typeof((b = a.webkit) == null ? void 0 : (c = b.messageHandlers) == null ? void 0 : (d = c.getGmaQueryInfo) == null ? void 0 : d.postMessage) === "function" || typeof((e = a.webkit) == null ? void 0 : (f = e.messageHandlers) == null ? void 0 : (g = f.getGmaSig) == null ? void 0 : g.postMessage) === "function") return a.webkit.messageHandlers
    }
    (function(a) {
        return Bd(function(b) {
            if (!Fd(b)) return !1;
            for (var c = x(Object.entries(a)), d = c.next(); !d.done; d = c.next()) {
                var e = x(d.value);
                d = e.next().value;
                e = e.next().value;
                if (!(d in b)) {
                    if (e.Kg === !0) continue;
                    return !1
                }
                if (!e(b[d])) return !1
            }
            return !0
        })
    })({
        vc: Dd,
        pn: Dd,
        eid: Gd(),
        vnm: Gd(),
        js: Dd
    }, "RawGmaSdkStaticSignalObject");
    var VN = function() {
            this.timeoutMs = 500;
            this.j = TN;
            this.signal = null;
            this.g = 0
        },
        WN = function(a) {
            if (Dm(Ym) || !UN()) return Promise.resolve(null);
            var b;
            return ((b = a.j(window)) != null ? b : Promise.resolve(null)).catch(function() {
                return "0"
            })
        },
        YN = function(a) {
            var b;
            return La(function(c) {
                if (c.g == 1) return b = Date.now() - a.g, !a.signal || b > 3E5 ? c = Aa(c, XN(a), 3) : (c.g = 2, c = void 0), c;
                c.g != 2 && (a.signal = c.j, a.g = Date.now());
                return c.return(a.signal)
            })
        },
        XN = function(a) {
            return Promise.race([WN(a).then(function(b) {
                if (b == null) return null;
                a.signal = b.length > 1E4 ? "0" : b;
                a.g = Date.now();
                return a.signal
            }), Nw(a.timeoutMs, "0")])
        };

    function Gl(a, b) {
        return b instanceof RegExp ? "__REGEXP" + b.toString() : b
    }

    function ZN(a, b) {
        return b && b.toString().indexOf("__REGEXP") === 0 ? (a = b.split("__REGEXP")[1].match(/\/(.*)\/(.*)?/), new RegExp(a[1], a[2] || "")) : b
    }
    var $N = function(a, b) {
        uJ.call(this, b);
        this.B = a;
        this.g = null;
        this.C = new jE(this);
        this.C.listen(Po(), "message", this.F)
    };
    w($N, uJ);
    var aO = function(a) {
        if (a == null || typeof a !== "string" || !a.startsWith("ima://")) return null;
        a = a.substr(6);
        try {
            return JSON.parse(a, ZN)
        } catch (b) {
            return null
        }
    };
    $N.prototype.sendMessage = function(a) {
        if (this.g != null && this.g.postMessage != null) {
            var b = this.g,
                c = b.postMessage,
                d = {};
            d.name = a.name;
            d.type = a.type;
            a.data != null && (d.data = a.data);
            a.id && (d.id = a.id);
            a.g && (d.replyToMessageId = a.g);
            d.sid = this.l;
            d.channel = this.B;
            a = [];
            Il(new Hl, d, a);
            c.call(b, "ima://" + a.join(""), "*")
        }
        this.g != null && this.g.postMessage == null && X.getInstance().report(11)
    };
    $N.prototype.O = function() {
        Ar(this.C);
        this.g = null;
        uJ.prototype.O.call(this)
    };
    $N.prototype.F = function(a) {
        a = a.g;
        var b = aO(a.data);
        if (bO(this, b)) {
            if (this.g === null) this.g = a.source, this.j || this.connect();
            else if (this.g !== a.source) return;
            bO(this, b) && this.dispatchEvent(new wJ(b.name, b.type, b.data || {}, b.sid, a.origin, b.id, b.replyToMessageId))
        }
    };
    var bO = function(a, b) {
        if (b == null) return !1;
        var c = b.channel;
        if (c == null || c !== a.B) return !1;
        b = b.sid;
        return b == null || a.l !== "*" && b !== a.l ? !1 : !0
    };
    var cO = function() {
        Q.call(this);
        this.G = !1;
        this.g = null;
        this.B = this.F = this.M = !1;
        this.j = 0;
        this.A = [];
        this.C = !1;
        this.U = this.P = Infinity;
        this.l = 0;
        this.H = {};
        this.K = new jE(this);
        Cr(this, this.K)
    };
    w(cO, Q);
    var eO = function(a, b) {
            b == null || a.G || (a.g = b, dO(a), a.G = !0)
        },
        gO = function(a) {
            a.g != null && a.G && (fO(a), a.G = !1, a.F = !1, a.B = !1, a.j = 0, a.A = [], a.C = !1)
        },
        dO = function(a) {
            fO(a);
            !(a.g instanceof Q) && "ontouchstart" in document.documentElement && Ac ? (a.H = {
                touchstart: function(b) {
                    a.F = !0;
                    a.j = b.touches.length;
                    a.l && (window.clearTimeout(a.l), a.l = 0, a.M = !0);
                    a.C = hO(a, b.touches) || b.touches.length !== 1;
                    a.C ? (a.P = Infinity, a.U = Infinity) : (a.P = b.touches[0].clientX, a.U = b.touches[0].clientY);
                    b = b.touches;
                    a.A = [];
                    for (var c = 0; c < b.length; c++) a.A.push(b[c].identifier)
                },
                touchmove: function(b) {
                    a.j = b.touches.length;
                    if (!TD(8) || Math.pow(b.changedTouches[0].clientX - a.P, 2) + Math.pow(b.changedTouches[0].clientY - a.U, 2) > 25) a.B = !0
                },
                touchend: function(b) {
                    return void iO(a, b)
                }
            }, Zh(a.H, function(b, c) {
                a.g.addEventListener(c, b, !1)
            })) : a.K.listen(a.g, "click", a.V)
        },
        fO = function(a) {
            a.K.rb(a.g, "click", a.V);
            Zh(a.H, function(b, c) {
                this.g.removeEventListener(c, b, !1)
            }, a);
            a.H = {}
        },
        iO = function(a, b) {
            !a.F || a.j !== 1 || a.B || a.M || a.C || !hO(a, b.changedTouches) || (a.l = window.setTimeout(function() {
                    return void jO(a)
                },
                300));
            a.j = b.touches.length;
            a.j === 0 && (a.F = !1, a.B = !1, a.A = []);
            a.M = !1
        };
    cO.prototype.V = function() {
        jO(this)
    };
    var hO = function(a, b) {
            for (var c = 0; c < b.length; c++)
                if (a.A.includes(b[c].identifier)) return !0;
            return !1
        },
        jO = function(a) {
            a.l = 0;
            a.dispatchEvent(new Iv("click"))
        };
    cO.prototype.O = function() {
        gO(this);
        Q.prototype.O.call(this)
    };
    var lO = function() {
            var a = kO;
            return La(function(b) {
                return b.g == 1 ? Aa(b, a.g.promise, 2) : b.return({
                    serializedConfig: a.serializedConfig,
                    errorMessage: a.j,
                    latencyMs: a.l
                })
            })
        },
        pO = function() {
            var a = mO,
                b = nO,
                c = Date.now(),
                d = a.o();
            d.timeout = 6E4;
            d.open("GET", b, !0);
            d.onload = function() {
                a.l = Date.now() - c;
                d.status < 200 || d.status >= 300 ? oO(a, Error("status: " + d.status)) : (a.j = null, a.serializedConfig = d.responseText, a.g.resolve())
            };
            d.onerror = function() {
                a.l = Date.now() - c;
                oO(a, Error("status: " + d.status))
            };
            d.send()
        },
        oO = function(a,
            b) {
            a.serializedConfig = null;
            a.j = b.message;
            a.g.resolve()
        },
        kO = new function() {
            this.o = function() {
                return new XMLHttpRequest
            };
            this.g = new cK;
            this.j = this.serializedConfig = null;
            this.l = 0
        };

    function qO() {
        var a = rO;
        var b = a.appName;
        var c = a.Qe;
        a = a.pageUrl;
        var d = new URL("https://securepubads.g.doubleclick.net/pagead/ima_ppub_config");
        return b && c ? (c === "android" ? d.searchParams.set("msid", b) : c === "ios" && d.searchParams.set("an", b), d.toString()) : a ? (d.searchParams.set("ippd", a), d.toString()) : null
    };
    var sO = [0, Dh, Qx];
    var tO = function(a) {
        this.D = B(a)
    };
    w(tO, H);
    var uO = function(a) {
        return function(b) {
            return oh(b, a)
        }
    }([0, Dh, Qx, Dh, sO]);

    function vO(a, b, c) {
        var d, e, f;
        a = ((f = (d = Xf(a, Kx, 2)) == null ? void 0 : (e = Zf(d, Jx, 1, Bf())) == null ? void 0 : e.map(function(g) {
            return E(g, 1)
        })) != null ? f : []).some(function(g) {
            return g === b
        });
        X.getInstance().report(190, {
            fm: a,
            fl: c
        })
    }

    function wO(a, b) {
        if (!a || !b) return !1;
        a = Xf(a, Gx, 3);
        var c;
        a = !!b && (a == null ? void 0 : (c = Jf(a, 1, De)) == null ? void 0 : c.get(b));
        X.getInstance().report(196, {
            status: a,
            network: b
        });
        return a != null ? a : !1
    }

    function xO(a, b) {
        if (!a || !b) return !1;
        var c;
        return !((c = Xf(a, Ix, 5)) == null || !Zf(c, Hx, 1, Bf()).find(function(d) {
            return (d == null ? void 0 : E(d, 1)) === b && (d == null ? void 0 : hg(d, 2))
        }))
    }

    function yO(a) {
        if (!a) return null;
        var b = new tO;
        a = Zf(a, Ox, 6, Bf());
        a = x(a);
        for (var c = a.next(); !c.done; c = a.next()) {
            var d = void 0;
            if (c = (d = Xf(c.value, Nx, 4)) == null ? void 0 : Xf(d, Mx, 2)) {
                d = new Nx;
                var e = new Mx;
                c = lg(c, 1);
                c = Af(e, 1, re(c));
                d = D(d, 2, c);
                dg(b, 1, Nx, d)
            }
        }
        return Zf(b, Nx, 1, Bf()).length === 0 ? null : b
    };

    function zO(a, b, c) {
        var d = EI(a);
        if (hg(d, 8)) return !1;
        a = CI(a) || !hg(d, 5);
        b = wO(b, c);
        return a && !b ? !1 : !0
    };
    var AO = function(a, b) {
        P.call(this);
        var c = this;
        this.g = a;
        this.j = new Map;
        this.l = function(d) {
            var e = c.j.get(d.messageType);
            if (e) {
                var f = "goog_" + Si++,
                    g = d.getId();
                e(d.na).then(function(h) {
                    vJ(c.g, d.type, d.messageType, h, f, g)
                })
            }
        };
        this.g.listen(b, this.l);
        Br(this, function() {
            c.j.clear();
            c.g.rb(b, c.l)
        })
    };
    w(AO, P);
    var BO = "abort canplay canplaythrough durationchange emptied loadstart loadeddata loadedmetadata progress ratechange seeked seeking stalled suspend waiting".split(" ");
    var CO = function(a, b) {
        P.call(this);
        this.g = a;
        this.timeoutMs = b;
        Cr(this, this.g)
    };
    w(CO, P);
    var EO = function(a) {
            if (!vC(a.g.caller)) return Promise.resolve(null);
            var b = new cK,
                c = null;
            a.g.addEventListener(function(e) {
                if (e.pingData.internalErrorState === 1) b.resolve(null);
                else if (e.eventName === "listenerRegistered") c = e.listenerId, e.pingData.applicableSections.length === 1 && e.pingData.applicableSections[0] === -1 && b.resolve(new DO("", "-1"));
                else if (e.eventName === "signalStatus" && e.data === "ready") {
                    e = e.pingData;
                    var f, g = ((f = e.applicableSections) != null ? f : []).join("_");
                    b.resolve(new DO(e.gppString, g))
                }
            });
            var d =
                new Promise(function(e) {
                    setTimeout(function() {
                        e(null)
                    }, a.timeoutMs)
                });
            d = Promise.race([b.promise, d]);
            d.then(function() {
                c !== null && a.g.removeEventListener(c)
            });
            return d
        },
        DO = function(a, b) {
            this.gppString = a;
            this.sid = b
        };
    var FO = ta(["scripts/v2/omweb-v1.js"]),
        GO = ta(["scripts/v2/omweb-v1.js"]),
        HO = ta(["scripts/v2/omweb-v1.js"]),
        IO = ta(["scripts/v2/omweb-v1.js"]),
        JO = bj(FO),
        KO = bj(GO),
        LO = bj(HO),
        MO = bj(IO);

    function NO(a) {
        var b;
        return (b = a.omidSessionInterface) != null ? b : null
    }

    function OO(a) {
        var b, c, d, e, f, g;
        return La(function(h) {
            if (h.g == 1) return b = So("IFRAME", {
                style: "display: none",
                title: "Advertisement"
            }), c = new Promise(function(k) {
                b.addEventListener("load", function() {
                    k()
                })
            }), a.appendChild(b), Aa(h, c, 2);
            d = So("SCRIPT");
            e = PO();
            Li(d, e);
            f = new Promise(function(k, l) {
                d.addEventListener("load", function() {
                    var p = Vo(b);
                    p && NO(p) ? k(b) : l()
                })
            });
            g = b.contentDocument || b.contentWindow.document;
            g.head.appendChild(d);
            return h.return(f)
        })
    }

    function PO() {
        switch (J(Qn).j(lC.g, lC.defaultValue)) {
            case 0:
                return JO;
            case 1:
                return KO;
            case 2:
                return LO;
            case 3:
                return MO;
            default:
                return JO
        }
    };
    var QO = function(a, b) {
        Q.call(this);
        this.j = b;
        this.g = NO(a)
    };
    w(QO, Q);
    var SO = function(a) {
            try {
                a.g && a.g.registerSessionObserver(function(b) {
                    b.type === "sessionStart" ? RO(a, a.j) : b.type === "sessionFinish" && SO(a)
                })
            } catch (b) {
                a.dispatchEvent(new Event("error"))
            }
        },
        RO = function(a, b) {
            b instanceof rH && (b = b.T);
            var c;
            if (((c = b.tagName) == null ? void 0 : c.toUpperCase()) !== "AUDIO") try {
                a.g && a.g.setVideoElement(b)
            } catch (d) {
                a.dispatchEvent(new Event("error"))
            }
        };
    QO.prototype.O = function() {
        try {
            this.g && this.g.finishAdSession()
        } catch (a) {}
        Q.prototype.O.call(this)
    };
    var TO = function(a) {
        this.data = a
    };
    m = TO.prototype;
    m.getTotalAds = function() {
        return this.data.totalAds
    };
    m.getMaxDuration = function() {
        return this.data.maxDuration
    };
    m.getAdPosition = function() {
        return this.data.adPosition
    };
    m.getPodIndex = function() {
        return this.data.podIndex
    };
    m.getTimeOffset = function() {
        return this.data.timeOffset
    };
    m.getIsBumper = function() {
        return this.data.isBumper
    };
    TO.prototype.getIsBumper = TO.prototype.getIsBumper;
    TO.prototype.getTimeOffset = TO.prototype.getTimeOffset;
    TO.prototype.getPodIndex = TO.prototype.getPodIndex;
    TO.prototype.getAdPosition = TO.prototype.getAdPosition;
    TO.prototype.getMaxDuration = TO.prototype.getMaxDuration;
    TO.prototype.getTotalAds = TO.prototype.getTotalAds;
    var UO = function(a) {
        this.data = a
    };
    m = UO.prototype;
    m.getContent = function() {
        return this.data.content
    };
    m.getContentType = function() {
        return this.data.contentType
    };
    m.getWidth = function() {
        return this.getSize().width
    };
    m.getHeight = function() {
        return this.getSize().height
    };
    m.getAdSlotId = function() {
        return this.data.adSlotId
    };
    m.getSize = function() {
        return this.data.size
    };
    m.He = function() {
        return this.data.resourceType
    };
    var GJ = function(a) {
        return (a = a.data.backupCompanions) ? a.map(function(b) {
            return new UO(b)
        }) : []
    };
    UO.prototype.getAdSlotId = UO.prototype.getAdSlotId;
    UO.prototype.getHeight = UO.prototype.getHeight;
    UO.prototype.getWidth = UO.prototype.getWidth;
    UO.prototype.getContentType = UO.prototype.getContentType;
    UO.prototype.getContent = UO.prototype.getContent;
    var VO = function(a, b) {
        this.j = a;
        this.g = b
    };
    VO.prototype.getAdIdValue = function() {
        return this.j
    };
    VO.prototype.getAdIdRegistry = function() {
        return this.g
    };
    VO.prototype.getAdIdRegistry = VO.prototype.getAdIdRegistry;
    VO.prototype.getAdIdValue = VO.prototype.getAdIdValue;
    var Y = function(a) {
        this.data = a
    };
    Y.prototype.getAdId = function() {
        return this.data.adId
    };
    Y.prototype.getCreativeAdId = function() {
        return this.data.creativeAdId
    };
    Y.prototype.getCreativeId = function() {
        return this.data.creativeId
    };
    var WO = function(a) {
        return a.data.adQueryId
    };
    m = Y.prototype;
    m.getAdSystem = function() {
        return this.data.adSystem
    };
    m.getAdvertiserName = function() {
        return this.data.advertiserName
    };
    m.getApiFramework = function() {
        return this.data.apiFramework
    };
    m.getWrapperAdIds = function() {
        return this.data.adWrapperIds
    };
    m.getWrapperCreativeIds = function() {
        return this.data.adWrapperCreativeIds
    };
    m.getWrapperAdSystems = function() {
        return this.data.adWrapperSystems
    };
    m.isLinear = function() {
        return this.data.linear
    };
    m.isSkippable = function() {
        return this.data.skippable
    };
    m.getContentType = function() {
        return this.data.contentType
    };
    m.getDescription = function() {
        return this.data.description
    };
    m.getTitle = function() {
        return this.data.title
    };
    m.getDuration = function() {
        return this.data.duration
    };
    m.getVastMediaWidth = function() {
        return this.data.vastMediaWidth
    };
    m.getVastMediaHeight = function() {
        return this.data.vastMediaHeight
    };
    m.getWidth = function() {
        return this.data.width
    };
    m.getHeight = function() {
        return this.data.height
    };
    m.getUiElements = function() {
        return this.data.uiElements
    };
    m.getMinSuggestedDuration = function() {
        return this.data.minSuggestedDuration
    };
    m.getAdPodInfo = function() {
        return new TO(this.data.adPodInfo)
    };
    m.getCompanionAds = function(a, b, c) {
        if (!this.data.companions) return [];
        var d = this.data.companions.map(function(e) {
            return new UO(e)
        });
        return FJ(new CJ({
            size: new Fk(a, b),
            Fe: c ? c.sizeCriteria === "SelectFluid" : !1
        }, c), d)
    };
    m.getTraffickingParameters = function() {
        return bE(Ri(this.data.traffickingParameters))
    };
    m.getTraffickingParametersString = function() {
        return this.data.traffickingParameters
    };
    m.getVastMediaBitrate = function() {
        return this.data.vastMediaBitrate
    };
    m.getMediaUrl = function() {
        return this.data.mediaUrl
    };
    m.getSurveyUrl = function() {
        return this.data.surveyUrl
    };
    m.getDealId = function() {
        return this.data.dealId
    };
    m.getUniversalAdIds = function() {
        return (this.data.universalAdIds || []).map(function(a) {
            return new VO(a.adIdValue, a.adIdRegistry)
        })
    };
    m.getUniversalAdIdValue = function() {
        return this.data.universalAdIdValue
    };
    m.getUniversalAdIdRegistry = function() {
        return this.data.universalAdIdRegistry
    };
    m.getSkipTimeOffset = function() {
        return this.data.skipTimeOffset
    };
    m.Le = function() {
        return this.data.disableUi
    };
    Y.prototype.isUiDisabled = Y.prototype.Le;
    Y.prototype.getSkipTimeOffset = Y.prototype.getSkipTimeOffset;
    Y.prototype.getUniversalAdIdRegistry = Y.prototype.getUniversalAdIdRegistry;
    Y.prototype.getUniversalAdIdValue = Y.prototype.getUniversalAdIdValue;
    Y.prototype.getUniversalAdIds = Y.prototype.getUniversalAdIds;
    Y.prototype.getDealId = Y.prototype.getDealId;
    Y.prototype.getSurveyUrl = Y.prototype.getSurveyUrl;
    Y.prototype.getMediaUrl = Y.prototype.getMediaUrl;
    Y.prototype.getVastMediaBitrate = Y.prototype.getVastMediaBitrate;
    Y.prototype.getTraffickingParametersString = Y.prototype.getTraffickingParametersString;
    Y.prototype.getTraffickingParameters = Y.prototype.getTraffickingParameters;
    Y.prototype.getCompanionAds = Y.prototype.getCompanionAds;
    Y.prototype.getAdPodInfo = Y.prototype.getAdPodInfo;
    Y.prototype.getMinSuggestedDuration = Y.prototype.getMinSuggestedDuration;
    Y.prototype.getUiElements = Y.prototype.getUiElements;
    Y.prototype.getHeight = Y.prototype.getHeight;
    Y.prototype.getWidth = Y.prototype.getWidth;
    Y.prototype.getVastMediaHeight = Y.prototype.getVastMediaHeight;
    Y.prototype.getVastMediaWidth = Y.prototype.getVastMediaWidth;
    Y.prototype.getDuration = Y.prototype.getDuration;
    Y.prototype.getTitle = Y.prototype.getTitle;
    Y.prototype.getDescription = Y.prototype.getDescription;
    Y.prototype.getContentType = Y.prototype.getContentType;
    Y.prototype.isSkippable = Y.prototype.isSkippable;
    Y.prototype.isLinear = Y.prototype.isLinear;
    Y.prototype.getWrapperAdSystems = Y.prototype.getWrapperAdSystems;
    Y.prototype.getWrapperCreativeIds = Y.prototype.getWrapperCreativeIds;
    Y.prototype.getWrapperAdIds = Y.prototype.getWrapperAdIds;
    Y.prototype.getApiFramework = Y.prototype.getApiFramework;
    Y.prototype.getAdvertiserName = Y.prototype.getAdvertiserName;
    Y.prototype.getAdSystem = Y.prototype.getAdSystem;
    Y.prototype.getCreativeId = Y.prototype.getCreativeId;
    Y.prototype.getCreativeAdId = Y.prototype.getCreativeAdId;
    Y.prototype.getAdId = Y.prototype.getAdId;
    var XO = function(a) {
        this.g = a
    };
    XO.prototype.getCuePoints = function() {
        return this.g
    };
    XO.prototype.getCuePoints = XO.prototype.getCuePoints;
    var YO = function() {
            this.useLearnMoreButton = this.disableUi = this.disableClickThrough = !1;
            this.autoAlign = this.useVideoAdUi = !0;
            this.bitrate = -1;
            this.enablePreloading = !1;
            this.loadVideoTimeout = 8E3;
            this.mimeTypes = null;
            this.playAdsAfterTime = -1;
            this.restoreCustomPlaybackStateOnAdBreakComplete = !1;
            this.uiElements = null;
            this.useStyledNonLinearAds = this.useStyledLinearAds = !1
        },
        ZO = function(a, b) {
            var c = {};
            Object.assign(c, a);
            b && (c.disableClickThrough = !0);
            return c
        };
    YO.prototype.append = function(a) {
        if (a) {
            var b = a.autoAlign;
            b != null && (this.autoAlign = b);
            b = Wi(a.bitrate);
            typeof b === "number" && !isNaN(b) && b > 0 && (this.bitrate = b);
            this.disableClickThrough = a.disableClickThrough || this.disableClickThrough;
            this.disableUi = a.disableUi || this.disableUi;
            this.enablePreloading = a.enablePreloading || this.enablePreloading;
            (b = a.mimeTypes) && b.length !== 0 && (this.mimeTypes = b);
            b = Wi(a.playAdsAfterTime);
            typeof b === "number" && !isNaN(b) && b > 0 && (this.playAdsAfterTime = b);
            this.restoreCustomPlaybackStateOnAdBreakComplete =
                a.restoreCustomPlaybackStateOnAdBreakComplete || this.restoreCustomPlaybackStateOnAdBreakComplete;
            b = Wi(a.loadVideoTimeout);
            typeof b === "number" && !isNaN(b) && b > 0 && (this.loadVideoTimeout = b);
            this.uiElements = a.uiElements || this.uiElements;
            this.useLearnMoreButton = a.useLearnMoreButton || this.useLearnMoreButton;
            this.useStyledLinearAds = a.useStyledLinearAds || this.useStyledLinearAds;
            this.useStyledNonLinearAds = a.useStyledNonLinearAds || this.useStyledNonLinearAds;
            this.useVideoAdUi = a.useVideoAdUi === !1 ? !1 : this.useVideoAdUi
        }
    };
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ads_rendering_settings.AdsRenderingSettings.AUTO_SCALE", -1);
    var Lf = function(a) {
        this.D = B(a)
    };
    w(Lf, H);
    var $O = function(a) {
        this.D = B(a)
    };
    w($O, H);
    var aP = function(a) {
        this.D = B(a)
    };
    w(aP, H);
    var bP = function(a) {
        this.D = B(a)
    };
    w(bP, H);
    var cP = function(a) {
        this.D = B(a)
    };
    w(cP, H);
    var dP = function(a) {
        return Wf(a, nk, 5)
    };
    cP.prototype.getWidth = function() {
        return ig(this, 9)
    };
    cP.prototype.getHeight = function() {
        return ig(this, 10)
    };
    var eP = Kh(cP);

    function fP(a) {
        var b;
        return (b = (new Map([
                ["https://googleads.g.doubleclick.net", BigInt(200)],
                ["https://td.doubleclick.net", BigInt(300)],
                ["https://f.creativecdn.com", BigInt(400)],
                ["https://fledge.us.criteo.com", BigInt(500)],
                ["https://fledge.eu.criteo.com", BigInt(600)],
                ["https://fledge.as.criteo.com", BigInt(700)],
                ["https://fledge-buyer-testing-1.uc.r.appspot.com", BigInt(800)],
                ["https://at-us-east.amazon-adsystem.com", BigInt(900)],
                ["https://x.adroll.com", BigInt(1E3)],
                ["https://fledge.dynalyst.jp", BigInt(1100)]
            ])).get(a)) !=
            null ? b : BigInt(100)
    };

    function gP(a) {
        var b = a.sh,
            c = a.fj,
            d = a.rj,
            e = a.auctionNonce,
            f = a.Zi,
            g = a.sj,
            h = a.multiBidLimit;
        a = !hg(b, 14);
        for (var k = {}, l = x(Zf(b, $O, 7, Bf())), p = l.next(); !p.done; p = l.next()) {
            p = p.value;
            var n = {},
                q = void 0,
                t = (q = d) == null ? void 0 : q.Pg.nh.rh.ag;
            q = E(p, 1);
            if (E(p, 2).length) try {
                if (n = JSON.parse(E(p, 2)), hj() * 100 < 1) {
                    var u = void 0;
                    (u = t) == null || tk(u, {
                        pd: q,
                        status: "SUCCESS",
                        fe: 100
                    })
                }
            } catch (ma) {
                u = void 0, (u = t) == null || tk(u, {
                    pd: q,
                    status: "ERROR",
                    fe: 1
                })
            } else u = void 0, (u = t) == null || tk(u, {
                pd: q,
                status: "EMPTY",
                fe: 1
            });
            k[E(p, 1)] = n
        }
        if (d =
            Xf(b, lk, 6)) k["https://googleads.g.doubleclick.net"] = zg(d), k["https://td.doubleclick.net"] = zg(d);
        d = {};
        l = Zf(b, bP, 11, Bf());
        l = x(l);
        for (p = l.next(); !p.done; p = l.next()) p = p.value, d[E(p, 1)] = ig(p, 2);
        l = {};
        ig(b, 21) !== 0 && (l["*"] = ig(b, 21));
        if (Zf(b, aP, 32, Bf()).length > 0) {
            var v = {};
            p = x(Zf(b, aP, 32, Bf()));
            for (n = p.next(); !n.done; n = p.next()) n = n.value, v[E(n, 1)] = ig(n, 2)
        }
        p = {};
        ke(xf(b, 18)) != null && (p["https://googleads.g.doubleclick.net"] = jg(b, 18), p["https://td.doubleclick.net"] = jg(b, 18));
        n = x(Kf(b));
        for (t = n.next(); !t.done; t =
            n.next()) q = x(t.value), t = q.next().value, q = q.next().value, jg(q, 4) && (p[t] = jg(q, 4));
        n = {};
        t = x(Kf(b));
        for (q = t.next(); !q.done; q = t.next()) u = x(q.value), q = u.next().value, u = u.next().value, u = E(u, 5), u.length && (n[q] = {
            type: u
        });
        t = {};
        h && h > 1 && (t["*"] = h);
        h = E(b, 1).split("/td/")[0];
        (q = Xf(b, nk, 5)) == null ? q = void 0 : (u = q.D, q = Se(q.constructor, uf(u, kd(u), !1)));
        var C;
        q != null && (C = Xf(q, mk, 5)) != null && Af(C, 2);
        C = Object;
        u = C.assign;
        var R = E(b, 1),
            U = E(b, 2);
        var da = pg(b, 3, Bf(Ad));
        v = u.call(C, {}, {
            seller: h,
            decisionLogicUrl: R,
            trustedScoringSignalsUrl: U,
            interestGroupBuyers: da,
            sellerExperimentGroupId: jg(b, 17),
            auctionSignals: JSON.parse(E(b, 4) || "{}"),
            sellerSignals: (q == null ? void 0 : zg(q)) || [],
            sellerTimeout: ig(b, 15) || 50,
            perBuyerExperimentGroupIds: p,
            perBuyerSignals: k,
            perBuyerTimeouts: d,
            perBuyerCumulativeTimeouts: l,
            perBuyerRealTimeReportingConfig: n,
            perBuyerMultiBidLimits: t,
            reportingTimeout: 5E3
        }, v ? {
            perBuyerGroupLimits: v
        } : {}, a ? {
            resolveToConfig: a
        } : {});
        if (b == null ? 0 : hg(dP(b), 25)) v.sellerCurrency = "USD", v.perBuyerCurrencies = Object.fromEntries(Jf(b, 22, Ee));
        E(b,
            28) && (v.directFromSellerSignalsHeaderAdSlot = E(b, 28));
        if (hP(v.interestGroupBuyers, f)) {
            v.auctionReportBuyerKeys = v.interestGroupBuyers.map(fP);
            f = {
                interestGroupCount: {
                    bucket: BigInt(0),
                    scale: 1
                },
                bidCount: {
                    bucket: BigInt(1),
                    scale: 1
                }
            };
            g || (f.totalGenerateBidLatency = {
                bucket: BigInt(2),
                scale: 1
            }, f.totalSignalsFetchLatency = {
                bucket: BigInt(3),
                scale: 1
            });
            v.auctionReportBuyers = f;
            var V = V === void 0 ? BigInt(0) : V;
            v.auctionReportBuyerDebugModeConfig = {
                enabled: !0,
                debugKey: V
            }
        }
        e && (v.auctionNonce = e, v.additionalBids = Promise.resolve());
        Jf(b, 33, Ee).size && (v.deprecatedRenderURLReplacements = Object.fromEntries(Jf(b, 33, Ee).entries()), (e = v.deprecatedRenderURLReplacements["${RENDER_DATA_td.doubleclick.net_GDA}"]) && (v.deprecatedRenderURLReplacements["${RENDER_DATA}"] = e));
        e = Object;
        g = e.assign;
        V = E(b, 1);
        f = jg(b, 17);
        k = new nk;
        C = dP(b);
        Vf(C, mk, 5) !== void 0 && (C = new mk, d = ng(Wf(dP(b), mk, 5), 2), C = Nf(C, 2, re(d), "0"), d = ng(Wf(dP(b), mk, 5), 4), C = Nf(C, 4, re(d), "0"), D(k, 5, C));
        dP(b).getEscapedQemQueryId() && (C = dP(b).getEscapedQemQueryId(), Nf(k, 2, ze(C), ""));
        E(dP(b),
            6) && (C = E(dP(b), 6), Nf(k, 6, ze(C), ""));
        hg(dP(b), 21) && sg(k, 21, !0);
        hg(dP(b), 4) && sg(k, 4, !0);
        E(dP(b), 11) && (C = E(dP(b), 11), Nf(k, 11, ze(C), ""));
        hg(dP(b), 32) && sg(k, 32, !0);
        k = zg(k);
        C = ig(b, 15) || 50;
        if (hg(b, 30)) {
            if (c == null || !c.length) throw Error("top_td_without_component_auction");
        } else c = [v].concat(ra(c != null ? c : []));
        c = g.call(e, {}, {
            seller: h,
            decisionLogicUrl: V,
            sellerExperimentGroupId: f,
            sellerSignals: k,
            sellerTimeout: C,
            interestGroupBuyers: [],
            auctionSignals: {},
            perBuyerExperimentGroupIds: {},
            perBuyerSignals: {},
            perBuyerTimeouts: {},
            perBuyerCumulativeTimeouts: {},
            componentAuctions: c
        }, a ? {
            resolveToConfig: a
        } : {});
        E(b, 28) && (c.directFromSellerSignalsHeaderAdSlot = E(b, 28));
        return c
    }

    function hP(a, b) {
        return a.some(function(c) {
            return fP(c) !== BigInt(100)
        }) && (b != null ? b : !1)
    };
    var jP = function(a, b) {
        P.call(this);
        var c = this;
        this.navigator = b;
        this.j = function(d) {
            var e = Date.now();
            try {
                var f = iP(c, d.tdconfig)
            } catch (g) {
                f = Promise.resolve({
                    Ib: !1,
                    result: null
                })
            }
            return f.then(function(g) {
                var h = new jk;
                h = vg(h, 1, e);
                h = vg(h, 2, Date.now());
                var k = g.Ib,
                    l;
                g = (l = g.result) != null ? l : "";
                l = {};
                return l.ffconfig = g, l.timeout = 2E3, l.auctioninterval = Ag(h), l.isauctiontimeout = k, l
            })
        };
        this.g = new AO(a, "fledge");
        Cr(this, this.g)
    };
    w(jP, P);
    var iP = function(a, b) {
        b = eP(b);
        var c = gP({
            sh: b
        });
        b = Nw(2E3, null).then(function() {
            return {
                Ib: !0,
                result: null
            }
        });
        a = a.navigator.runAdAuction(c).then(function(d) {
            d !== null && typeof d !== "string" ? d = null : d == null && (d = null);
            return {
                Ib: !1,
                result: d
            }
        });
        return Promise.race([b, a])
    };
    var lP = function(a, b, c) {
        P.call(this);
        this.C = a;
        this.A = b;
        this.B = c;
        this.g = this.j = this.o = null;
        this.l = 0;
        a = new jE(this);
        Cr(this, a);
        kP(this);
        a.listen(this.A, "adsManager", this.F)
    };
    w(lP, P);
    var kP = function(a) {
        OO(a.C).then(function(b) {
            a.j = b;
            mP(a, Vo(b))
        }).catch(function() {
            return void nP(a)
        })
    };
    lP.prototype.F = function(a) {
        if (["complete", "skip", "error"].includes(a.messageType)) {
            this.l++;
            if (this.l === 10) {
                this.l = 0;
                var b;
                (b = this.g) == null || b.dispose();
                kP(this)
            }
            a = Vo(this.j);
            var c;
            a && ((c = a.frames) == null ? 0 : c.omid_v1_present) || X.getInstance().report(188, {})
        }
    };
    var oP = function(a) {
            if (a.g && a.o) {
                var b = a.g;
                try {
                    b.g && b.g.setSessionClientWindow(a.o)
                } catch (c) {
                    b.dispatchEvent(new Event("error"))
                }
            }
        },
        mP = function(a, b) {
            a.g = new QO(b, a.B);
            a.g.listen("error", function() {
                return void nP(a)
            });
            SO(a.g);
            oP(a)
        },
        nP = function(a) {
            vJ(a.A, "omid", "iframeFailed");
            a.dispose()
        };
    lP.prototype.O = function() {
        this.j && (To(this.j), this.j = null);
        var a;
        (a = this.g) == null || a.dispose();
        P.prototype.O.call(this)
    };
    var pP = function(a, b, c, d) {
        P.call(this);
        this.o = a;
        this.l = b;
        this.g = c;
        this.C = d;
        this.j = new jE(this);
        Cr(this, this.j);
        this.j.listen(this.o, d, this.B)
    };
    w(pP, P);
    var qP = function(a, b) {
        var c = b.na;
        switch (b.messageType) {
            case "showVideo":
                a.l.jd();
                break;
            case "hide":
                a.l.kb();
                break;
            case "resizeAndPositionVideo":
                b = c.resizeAndPositionVideo;
                a.l.Zd(new Hk(b.x, b.y, b.width, b.height));
                break;
            case "restoreSizeAndPositionVideo":
                a.l.ae()
        }
    };
    pP.prototype.B = function(a) {
        var b = a.na;
        switch (a.messageType) {
            case "activate":
                this.l.uc(this.g);
                break;
            case "startTracking":
                a = this.g;
                var c = this.A;
                this.j.listen(a, ji(JE), c);
                this.j.listen(a, BO, c);
                a = this.g;
                rP(a);
                a.j.listen(a.g, BO, a.Pa);
                a.j.listen(a.g, "ended", a.Sg);
                a.j.listen(a.g, "webkitbeginfullscreen", a.Qa);
                a.j.listen(a.g, "webkitendfullscreen", a.ga);
                a.j.listen(a.g, "loadedmetadata", a.Ug);
                a.j.listen(a.g, "pause", a.Wg);
                a.j.listen(a.g, "playing", a.Se);
                a.j.listen(a.g, "timeupdate", a.Xg);
                a.j.listen(a.g, "volumechange",
                    a.Zg);
                a.j.listen(a.g, "error", a.Z);
                a.j.listen(a.g, Jc || Ac && !TD(8) ? "loadeddata" : "canplay", a.Tg);
                a.B = new cO;
                a.j.listen(a.B, "click", a.ka);
                eO(a.B, a.g);
                a.H = new Lw(1E3);
                a.j.listen(a.H, "tick", a.wa);
                a.H.start();
                break;
            case "stopTracking":
                a = this.g;
                c = this.A;
                this.j.rb(a, ji(JE), c);
                this.j.rb(a, BO, c);
                rP(this.g);
                break;
            case "exitFullscreen":
                a = this.g;
                (wc || zc) && a.g.webkitDisplayingFullscreen && a.g.webkitExitFullscreen();
                break;
            case "play":
                sP(this.g);
                break;
            case "pause":
                this.g.pause();
                break;
            case "load":
                a = this.g;
                c = b.videoUrl;
                var d = b.muxedMediaUrl,
                    e = b.muxedMimeType,
                    f = b.muxedAudioCodec,
                    g = b.muxedVideoCodec,
                    h = b.demuxedAudioUrl,
                    k = b.demuxedVideoUrl,
                    l = b.demuxedAudioMimeType,
                    p = b.demuxedVideoMimeType,
                    n = b.demuxedAudioCodec,
                    q = b.demuxedVideoCodec;
                b = b.mseCompatible;
                var t = null;
                k && h && b && p && l && q && n && (t = new rC({
                    yh: k,
                    Zf: h,
                    wj: null,
                    bj: null,
                    xh: p,
                    Yf: l,
                    sb: q,
                    ab: n,
                    height: null,
                    width: null,
                    Ga: b,
                    vj: null,
                    aj: null
                }));
                h = null;
                d && e && g && f && (h = new sC({
                    Og: d,
                    xb: null,
                    mimeType: e,
                    sb: g,
                    ab: f,
                    height: null,
                    width: null,
                    Ga: b,
                    hj: null
                }));
                t ? a.load(c, t) : h ? a.load(c, h) : a.load(c,
                    null);
                break;
            case "unload":
                a = this.g;
                tP(a);
                a.U = !1;
                "removeAttribute" in a.g ? a.g.removeAttribute("src") : a.g.src = "";
                a.g.load();
                break;
            case "setCurrentTime":
                this.g.g.currentTime = b.currentTime;
                break;
            case "setVolume":
                this.g.setVolume(b.volume)
        }
    };
    pP.prototype.A = function(a) {
        var b = {};
        switch (a.type) {
            case "autoplayDisallowed":
                a = "autoplayDisallowed";
                break;
            case "beginFullscreen":
                a = "fullscreen";
                break;
            case "endFullscreen":
                a = "exitFullscreen";
                break;
            case "click":
                a = "click";
                break;
            case "end":
                a = "end";
                break;
            case "error":
                a = "error";
                break;
            case "loaded":
                a = "loaded";
                break;
            case "mediaLoadTimeout":
                a = "mediaLoadTimeout";
                break;
            case "pause":
                a = "pause";
                b.ended = this.g.g.ended;
                break;
            case "play":
                a = "play";
                break;
            case "skip":
                a = "skip";
                break;
            case "start":
                a = "start";
                b.volume = this.g.getVolume();
                break;
            case "timeUpdate":
                a = "timeupdate";
                b.currentTime = this.g.getCurrentTime();
                b.duration = this.g.getDuration();
                break;
            case "volumeChange":
                a = "volumeChange";
                b.volume = this.g.getVolume();
                break;
            case "loadedmetadata":
                a = a.type;
                b.duration = this.g.getDuration();
                break;
            case "abort":
            case "canplay":
            case "canplaythrough":
            case "durationchange":
            case "emptied":
            case "loadstart":
            case "loadeddata":
            case "progress":
            case "ratechange":
            case "seeked":
            case "seeking":
            case "stalled":
            case "suspend":
            case "waiting":
                a = a.type;
                break;
            default:
                return
        }
        vJ(this.o,
            this.C, a, b)
    };
    var uP = function(a, b) {
        P.call(this);
        this.j = b;
        this.g = null;
        this.l = new pP(a, b, this.j.ca, "videoDisplay1");
        Cr(this, this.l);
        var c = this.j.ya;
        c != null && (this.g = new pP(a, b, c, "videoDisplay2"), Cr(this, this.g))
    };
    w(uP, P);

    function vP(a, b, c, d) {
        var e = rj("IFRAME");
        e.id = b;
        e.name = b;
        e.width = String(c);
        e.height = String(d);
        e.allowTransparency = "true";
        e.scrolling = "no";
        e.marginWidth = "0";
        e.marginHeight = "0";
        e.frameBorder = "0";
        e.style.border = "0";
        e.style.verticalAlign = "bottom";
        e.src = "about:blank";
        e.setAttribute("aria-label", "Advertisement");
        e.title = "3rd party ad content";
        e.tabIndex = 0;
        a.appendChild(e);
        return e
    };

    function wP() {
        var a, b, c, d = Po();
        d = d === void 0 ? window : d;
        d = ((c = d === void 0 ? null : d) != null ? c : window).googletag;
        c = (d == null ? 0 : d.apiReady) ? d : void 0;
        return (b = c == null ? void 0 : (a = c.companionAds) == null ? void 0 : a.call(c)) != null ? b : null
    }

    function xP(a) {
        var b = {};
        b.slotId = a.getSlotId().getId();
        var c = [];
        a = x(a.getSizes() || []);
        for (var d = a.next(); !d.done; d = a.next())
            if (d = d.value, typeof d !== "string") {
                var e = {};
                c.push((e.adWidth = d.getWidth(), e.adHeight = d.getHeight(), e))
            } else d === "fluid" && (d = {}, c.push((d.fluidSize = !0, d)));
        return b.adSizes = c, b
    }

    function yP(a) {
        var b = wP();
        if (b && a && Array.isArray(a)) {
            var c = new Map(b.getSlots().map(function(q) {
                return [q.getSlotId().getId(), q]
            }));
            a = x(a);
            for (var d = a.next(); !d.done; d = a.next()) {
                var e = d.value,
                    f = c.get(e.slotId);
                if (f && !b.isSlotAPersistentRoadblock(f)) {
                    var g = e.adContent;
                    if (g && (d = Ko(f.getSlotId().getDomId()))) {
                        d.style.display = "";
                        var h = e.adWidth,
                            k = e.adHeight;
                        e.fluidSize && (k = Kq(d), h = k.width, k = k.height);
                        d.textContent = "";
                        if (e.friendlyIframeRendering) try {
                            var l = "google_companion_" + f.getSlotId().getId(),
                                p = vP(d,
                                    l, h, k),
                                n = p.contentWindow ? p.contentWindow.document : p.contentDocument;
                            sc && n.open("text/html", "replace");
                            Ni(n, iE(g));
                            n.close()
                        } catch (q) {} else Ki(d, iE(g)), d.style.width = h + "px", d.style.height = k + "px";
                        b.slotRenderEnded(f, h, k);
                        (e = e.onAdContentSet) && e(d)
                    }
                }
            }
        }
    };
    var zP = function(a, b, c, d, e, f) {
        wJ.call(this, a, b, c, d, e);
        this.g = f
    };
    w(zP, wJ);
    var AP = function(a, b) {
        Q.call(this);
        this.B = a;
        this.A = b;
        this.g = {};
        this.j = new jE(this);
        Cr(this, this.j);
        this.j.listen(Po(), "message", this.l)
    };
    w(AP, Q);
    var BP = function(a, b) {
            var c = b.g;
            a.g.hasOwnProperty(c) && vJ(a.g[c], b.type, b.messageType, b.na)
        },
        CP = function(a, b, c, d) {
            a.g.hasOwnProperty(b) || (c = new $N(b, c), a.j.listen(c, a.B, function(e) {
                this.dispatchEvent(new zP(e.type, e.messageType, e.na, e.sc, e.origin, b))
            }), c.g = d, c.connect(), a.g[b] = c)
        };
    AP.prototype.O = function() {
        for (var a = x(Object.values(this.g)), b = a.next(); !b.done; b = a.next()) Ar(b.value);
        Q.prototype.O.call(this)
    };
    AP.prototype.l = function(a) {
        a = a.g;
        var b = aO(a.data);
        if (b != null) {
            var c = b.channel;
            if (this.A && !this.g.hasOwnProperty(c)) {
                var d = b.sid;
                CP(this, c, d, a.source);
                this.dispatchEvent(new zP(b.name, b.type, b.data || {}, d, a.origin, c))
            }
        }
    };

    function DP() {
        return !!Sa("googletag.cmd", Po())
    }

    function EP() {
        var a = Sa("googletag.console", Po());
        return a != null ? a : null
    }
    var FP = function() {
        jE.call(this);
        this.g = null;
        this.l = new AP("gpt", !0);
        Cr(this, this.l);
        this.listen(this.l, "gpt", this.B);
        DP() || Po().top === Po() || (this.g = new AP("gpt", !1), Cr(this, this.g), this.listen(this.g, "gpt", this.A))
    };
    w(FP, jE);
    FP.prototype.B = function(a) {
        var b = a.origin,
            c = "//imasdk.googleapis.com".match(Xi);
        b = b.match(Xi);
        if (c[3] == b[3] && c[4] == b[4])
            if (this.g != null) CP(this.g, a.g, a.sc, Po().parent), this.g != null && BP(this.g, a);
            else if (c = a.na, c != null && c.scope !== void 0) {
            b = c.scope;
            c = c.args;
            var d;
            if (b === "proxy") {
                var e = a.messageType;
                e === "isGptPresent" ? d = DP() : e === "isConsolePresent" && (d = EP() != null)
            } else if (DP())
                if (b === "pubads" || b === "companionAds") {
                    d = a.messageType;
                    var f = Po().googletag;
                    if (f != null && f[b] != null && (b = f[b](), b != null && (d = b[d],
                            d != null))) try {
                        e = d.apply(b, c)
                    } catch (g) {}
                    d = e
                } else if (b === "console") {
                if (e = EP(), e != null && (b = e[a.messageType], b != null)) try {
                    b.apply(e, c)
                } catch (g) {}
            } else b === null && (e = a.messageType, e === "googleGetCompanionAdSlots" ? (e = wP()) ? (e = e.getSlots().map(xP), d = e.length ? e : null) : d = null : (e === "googleSetCompanionAdContents" && yP(c == null ? void 0 : c[0]), d = null));
            d !== void 0 && (a.na.returnValue = d, BP(this.l, a))
        }
    };
    FP.prototype.A = function(a) {
        BP(this.l, a)
    };
    var GP = function(a, b) {
        if (a.g) {
            var c = a.g;
            Ar(c.g[b]);
            delete c.g[b]
        }
        a.l && (a = a.l, Ar(a.g[b]), delete a.g[b])
    };
    var IP = function(a, b) {
            var c = Array.prototype.slice.call(arguments),
                d = c.shift();
            if (typeof d == "undefined") throw Error("[goog.string.format] Template required");
            return d.replace(/%([0\- \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(e, f, g, h, k, l, p, n) {
                if (l == "%") return "%";
                var q = c.shift();
                if (typeof q == "undefined") throw Error("[goog.string.format] Not enough arguments");
                arguments[0] = q;
                return HP[l].apply(null, arguments)
            })
        },
        HP = {
            s: function(a, b, c) {
                return isNaN(c) || c == "" || a.length >= Number(c) ? a : a = b.indexOf("-", 0) > -1 ?
                    a + Qi(" ", Number(c) - a.length) : Qi(" ", Number(c) - a.length) + a
            },
            f: function(a, b, c, d, e) {
                d = a.toString();
                isNaN(e) || e == "" || (d = parseFloat(a).toFixed(e));
                var f = Number(a) < 0 ? "-" : b.indexOf("+") >= 0 ? "+" : b.indexOf(" ") >= 0 ? " " : "";
                Number(a) >= 0 && (d = f + d);
                if (isNaN(c) || d.length >= Number(c)) return d;
                d = isNaN(e) ? Math.abs(Number(a)).toString() : Math.abs(Number(a)).toFixed(e);
                a = Number(c) - d.length - f.length;
                return d = b.indexOf("-", 0) >= 0 ? f + d + Qi(" ", a) : f + Qi(b.indexOf("0", 0) >= 0 ? "0" : " ", a) + d
            },
            d: function(a, b, c, d, e, f, g, h) {
                return HP.f(parseInt(a,
                    10), b, c, d, 0, f, g, h)
            }
        };
    HP.i = HP.d;
    HP.u = HP.d;

    function JP() {
        return ["autoplay", "attribution-reporting"].filter(function(a) {
            var b = document.featurePolicy;
            return b !== void 0 && typeof b.allowedFeatures == "function" && typeof b.allowedFeatures() == "object" && b.allowedFeatures().includes(a)
        }).join(";")
    }
    var LP = function(a, b, c) {
        c = c === void 0 ? !1 : c;
        Q.call(this);
        this.C = b;
        this.V = c;
        this.K = this.H = null;
        this.G = !1;
        this.F = "goog_" + Si++;
        this.A = new Map;
        this.g = null;
        c = Po();
        var d = Sa("google.ima.gptProxyInstance", c);
        d != null ? c = d : (d = new FP, z("google.ima.gptProxyInstance", d, c), c = d);
        this.Z = c;
        this.B = null;
        this.l = new jE(this);
        Cr(this, this.l);
        c = this.F;
        d = this.V ? "?gdpr=1" : "";
        d = (lj() ? "https:" : "http:") + IP("//imasdk.googleapis.com/js/core/bridge3.679.0_%s.html", nI.getLocale()) + d;
        a: {
            var e = window;
            try {
                do {
                    try {
                        if (e.location.href.indexOf(d) ===
                            0 || e.document.referrer.indexOf(d) === 0) {
                            var f = !0;
                            break a
                        }
                    } catch (k) {}
                    e = e.parent
                } while (e !== e.top)
            } catch (k) {}
            f = !1
        }
        f && (d += "?f=" + c);
        f = window.document;
        if (vn.length && f.head) {
            e = x(vn);
            for (var g = e.next(); !g.done; g = e.next())
                if ((g = g.value) && f.head) {
                    var h = rj("META");
                    f.head.appendChild(h);
                    h.httpEquiv = "origin-trial";
                    h.content = g
                }
        }
        f = JP();
        c = So("IFRAME", {
            src: d + "#" + c,
            allowFullscreen: !0,
            allow: f,
            id: c,
            style: "border:0; opacity:0; margin:0; padding:0; position:relative; color-scheme: light;",
            title: "Advertisement"
        });
        this.l.dc(c,
            "load", this.ga);
        a.appendChild(c);
        this.frameElement = c;
        this.j = KP(this);
        this.M = new jP(this.j, navigator);
        Cr(this, this.M);
        c = this.M;
        c.g.j.set("auction", c.j);
        this.P = new uP(this.j, this.C);
        Cr(this, this.P);
        this.C.ca && this.l.listen(this.j, "displayContainer", this.U);
        this.l.listen(this.j, "mouse", this.aa);
        this.l.listen(this.j, "touch", this.ba);
        $I() || (this.B = new lP(a, this.j, b.ca.A.g), Cr(this, this.B))
    };
    w(LP, Q);
    var KP = function(a, b) {
        b = b === void 0 ? "*" : b;
        var c = a.A.get(b);
        c == null && (c = new $N(a.F, b), a.G && (c.g = Vo(a.frameElement), c.connect()), a.A.set(b, c));
        return c
    };
    LP.prototype.uc = function(a) {
        var b;
        (b = this.B) != null && (a = a.A.g, b.B = a, b.g && (b = b.g, b.j = a, RO(b, a)))
    };
    LP.prototype.O = function() {
        this.g !== null && (this.g.dispose(), this.g = null);
        this.A.forEach(function(a) {
            Ar(a)
        });
        this.A.clear();
        GP(this.Z, this.F);
        To(this.frameElement);
        Q.prototype.O.call(this)
    };
    LP.prototype.aa = function(a) {
        var b = a.na,
            c = Fq(this.frameElement),
            d = document.createEvent("MouseEvent");
        d.initMouseEvent(a.messageType, !0, !0, window, b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, null);
        this.frameElement.dispatchEvent(d)
    };
    var MP = function(a, b) {
        var c = Fq(a.frameElement),
            d = !!("TouchEvent" in window && TouchEvent.length > 0);
        b = b.map(function(f) {
            return d ? new Touch({
                identifier: f.identifier,
                target: a.frameElement,
                clientX: f.clientX,
                clientY: f.clientY,
                screenX: f.screenX,
                screenY: f.screenY,
                pageX: f.pageX + c.x,
                pageY: f.pageY + c.y
            }) : document.createTouch(window, a.frameElement, f.identifier, f.pageX + c.x, f.pageY + c.y, f.screenX, f.screenY)
        });
        if (d) return b;
        var e;
        return (e = document.createTouchList) == null ? void 0 : e.apply(document, b)
    };
    LP.prototype.ba = function(a) {
        var b = a.na,
            c = Fq(this.frameElement);
        if ("TouchEvent" in window && TouchEvent.length > 0) b = {
            bubbles: !0,
            cancelable: !0,
            view: window,
            detail: b.detail,
            ctrlKey: b.ctrlKey,
            altKey: b.altKey,
            shiftKey: b.shiftKey,
            metaKey: b.metaKey,
            touches: MP(this, b.touches),
            targetTouches: MP(this, b.targetTouches),
            changedTouches: MP(this, b.changedTouches)
        }, a = new TouchEvent(a.messageType, b), this.frameElement.dispatchEvent(a);
        else {
            var d = document.createEvent("TouchEvent");
            d.initTouchEvent(a.messageType, !0, !0, window,
                b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, MP(this, b.touches), MP(this, b.targetTouches), MP(this, b.changedTouches), b.scale, b.rotation);
            this.frameElement.dispatchEvent(d)
        }
    };
    LP.prototype.U = function(a) {
        switch (a.messageType) {
            case "showVideo":
                this.g == null ? (this.g = new cO, this.l.listen(this.g, "click", this.ka)) : gO(this.g);
                eO(this.g, this.C.Ub());
                break;
            case "hide":
                this.g !== null && (this.g.dispose(), this.g = null)
        }
        var b = this.P;
        qP(b.l, a);
        b.g && qP(b.g, a)
    };
    LP.prototype.ka = function() {
        vJ(this.j, "displayContainer", "videoClick")
    };
    LP.prototype.ga = function() {
        this.H = jl();
        this.K = gl();
        var a = Vo(this.frameElement);
        this.A.forEach(function(c) {
            c.g = a;
            c.connect()
        });
        var b;
        (b = this.B) != null && (b.o = a, oP(b));
        this.G = !0
    };
    var NP = ta(["scripts/v2/client.js"]),
        OP = null,
        PP = function() {
            Q.call(this);
            this.g = null;
            this.j = new Map;
            this.l = new Map;
            this.ua = this.C = !1;
            this.A = null;
            this.B = new jE(this);
            Cr(this, this.B)
        };
    w(PP, Q);
    var QP = function() {
            OP == null && (OP = new PP);
            return OP
        },
        Av = function(a, b, c) {
            var d = {};
            d.queryId = b;
            d.viewabilityData = c;
            a.g && vJ(a.g, "activityMonitor", "viewabilityMeasurement", d)
        };
    PP.prototype.destroy = function() {
        this.B.rb(this.g, "activityMonitor", this.F);
        this.ua = !1;
        this.j.clear()
    };
    PP.prototype.O = function() {
        this.destroy();
        Q.prototype.O.call(this)
    };
    PP.prototype.init = function(a) {
        if (!this.ua) {
            if (this.g = a || null) this.B.listen(this.g, "activityMonitor", this.F), RP(this);
            if (!(y.ima && y.ima.video && y.ima.video.client && y.ima.video.client.tagged)) {
                z("ima.video.client.sdkTag", !0);
                var b = y.document;
                a = Qo(document, "SCRIPT");
                var c = bj(NP);
                Li(a, c);
                a.async = !0;
                a.type = "text/javascript";
                b = b.getElementsByTagName("script")[0];
                b.parentNode.insertBefore(a, b)
            }
            Do();
            J(pv).K = nI.g;
            this.C = !0;
            J(pv).l = !0;
            this.A = null;
            a = J(pv);
            b = av(a) == "h" || av(a) == "b";
            c = !(N(), !1);
            b && c && (a.F = !0, a.H =
                new ut);
            this.ua = !0
        }
    };
    var TP = function(a) {
            if (a == null) return !1;
            if ((wc || zc) && a.webkitDisplayingFullscreen !== null) return a.webkitDisplayingFullscreen;
            a = SP(a);
            var b = window.screen.availHeight || window.screen.height;
            return (window.screen.availWidth || window.screen.width) - a.width <= 0 && b - a.height <= 42
        },
        SP = function(a) {
            var b = {
                left: a.offsetLeft,
                top: a.offsetTop,
                width: a.offsetWidth,
                height: a.offsetHeight
            };
            try {
                typeof a.getBoundingClientRect === "function" && Uo(Io(a), a) && (b = a.getBoundingClientRect())
            } catch (c) {}
            return b
        },
        UP = function(a, b, c, d, e) {
            e =
                e === void 0 ? {} : e;
            if (a.ua) {
                d && e.opt_osdId == null && (e.opt_osdId = d);
                if (a.A) return a.A(b, c, e);
                if (a = d ? a.l.get(d) : nI.l) e.opt_fullscreen == null && (e.opt_fullscreen = TP(a)), e.opt_adElement == null && (e.opt_adElement = a);
                return hy.yb(469, fb(Cv, b, c, e)) || {}
            }
            return {}
        },
        VP = function(a) {
            var b;
            nI.g !== 0 ? b = J(pv).l : b = a.C;
            return b
        },
        WP = function(a, b) {
            var c = String(Math.floor(Math.random() * 1E9));
            a.l.set(c, b);
            nI.g !== 0 && (J(pv).o[c] = a);
            return c
        },
        XP = function(a, b, c) {
            if (c) a.j.get(c) === b && a.j.delete(c);
            else {
                var d = [];
                a.j.forEach(function(e,
                    f) {
                    e === b && d.push(f)
                });
                d.forEach(a.j.delete, a.j)
            }
        },
        wv = function(a, b) {
            a = a.j.get(b);
            return typeof a === "function" ? a() : {}
        },
        RP = function(a) {
            if (typeof window.Goog_AdSense_Lidar_getUrlSignalsArray === "function") {
                var b = {};
                b.pageSignals = window.Goog_AdSense_Lidar_getUrlSignalsArray();
                var c;
                (c = a.g) == null || vJ(c, "activityMonitor", "pageSignals", b)
            }
        };
    PP.prototype.F = function(a) {
        var b = a.na,
            c = b.queryId,
            d = {},
            e = null;
        d.eventId = b.eventId;
        switch (a.messageType) {
            case "getPageSignals":
                RP(this);
                break;
            case "reportVastEvent":
                e = b.vastEvent;
                a = b.osdId;
                var f = {};
                f.opt_fullscreen = b.isFullscreen;
                b.isOverlay && (f.opt_bounds = b.overlayBounds);
                d.viewabilityData = UP(this, e, c, a, f);
                var g;
                (g = this.g) == null || vJ(g, "activityMonitor", "viewability", d);
                break;
            case "fetchAdTagUrl":
                c = {}, c.eventId = b.eventId, a = b.osdId, mi(b, "isFullscreen") && (e = b.isFullscreen), mi(b, "loggingId") && (b = b.loggingId,
                    c.loggingId = b, X.getInstance().report(43, {
                        step: "beforeLookup",
                        logid: b,
                        time: Date.now()
                    })), c.engagementString = YP(this, a, e), this.g && vJ(this.g, "activityMonitor", "engagement", c)
        }
    };
    var YP = function(a, b, c) {
        var d, e = b ? (d = a.l.get(b)) != null ? d : null : nI.l;
        a = {};
        c != null && (a.fullscreen = c);
        c = "";
        try {
            c = cx(function() {
                return e
            }, a)
        } catch (f) {
            c = f, c = "sdktle;" + Pi(c.name, 12) + ";" + Pi(c.message, 40)
        }
        return c
    };
    z("ima.common.getVideoMetadata", function(a) {
        return wv(QP(), a)
    });
    z("ima.common.triggerViewabilityMeasurementUpdate", function(a, b) {
        Av(QP(), a, b)
    });
    var ZP = function(a) {
            this.g = a;
            this.l = "";
            this.j = -1;
            this.o = !1
        },
        aQ = function(a, b) {
            if (a.j >= 0) {
                var c = b == null ? function() {} : b,
                    d = function() {
                        $P(a, c);
                        a.g.removeEventListener("loadedmetadata", d, !1)
                    };
                a.g.addEventListener("loadedmetadata", d, !1);
                a.g.src = a.l;
                a.g.load()
            } else b != null && b()
        },
        $P = function(a, b) {
            var c = a.g.seekable.length > 0;
            a.o ? c ? (a.g.currentTime = a.j, bQ(a), b()) : setTimeout(function() {
                return void $P(a, b)
            }, 100) : (bQ(a), b())
        },
        bQ = function(a) {
            a.j = -1;
            a.l = "";
            a.o = !1
        };
    var cQ = new Fk(5, 5),
        dQ = function(a) {
            Q.call(this);
            this.g = a;
            this.B = this.ba = null;
            this.F = 0;
            this.M = this.G = this.U = this.loaded = this.K = !1;
            this.V = this.H = this.P = this.l = null;
            this.aa = !1;
            this.C = null;
            this.A = new ZP(a);
            this.j = new jE(this);
            Cr(this, this.j);
            this.size = this.getSize();
            this.fullscreen = TP(this.g)
        };
    w(dQ, Q);
    m = dQ.prototype;
    m.re = function() {
        var a = this.A;
        a.l = a.g.currentSrc;
        a.o = a.g.seekable.length > 0;
        a.j = a.g.ended ? -1 : a.g.currentTime
    };
    m.tc = function(a) {
        aQ(this.A, a)
    };
    m.load = function(a, b) {
        var c = K.getInstance().g;
        c.P = !0;
        tl(c);
        Dl("hvd_lc");
        tP(this);
        this.U = !1;
        if (b)
            if (Dl("hvd_ad"), b instanceof sC) {
                if (Dl("hvd_mad"), c = b.getMediaUrl()) {
                    Dl("hvd_admu");
                    Dl("hvd_src");
                    this.g.src = c;
                    this.g.load();
                    return
                }
            } else if (b instanceof rC) {
            Dl("hvd_dad");
            c = b.o;
            var d = b.j,
                e = b.l,
                f = b.g,
                g = b.sb,
                h = b.ab;
            if (c && d && e && f && g && h && (Dl("hvd_addu"), b.Ga)) {
                Dl("hvd_admse");
                b = e + '; codecs="' + g + '"';
                f = f + '; codecs="' + h + '"';
                if (vG() && vG() && MediaSource.isTypeSupported(b) && vG() && MediaSource.isTypeSupported(f)) {
                    Dl("hvd_ymse");
                    Dl("hvd_mse");
                    a = !1;
                    try {
                        window.location.search.indexOf("goog_limavideo=true") !== -1 && (a = !0)
                    } catch (k) {}
                    y.customElements ? a ? a = !0 : (Rn(kC) && X.getInstance().report(153, {
                        limvid: "vd"
                    }), a = Rn(kC) ? !0 : !1) : a = !1;
                    a && this.g instanceof rH ? (this.g.fb = c, this.g.ub = d) : (this.ba = new QH(this.g, [new PG(c, b, 35E4, new iF), new PG(d, f, 82E3, new iF)]), Cr(this, this.ba), a = this.g, c = this.ba, c.j || (c.j = Gi(c.g).toString()), c = c.j, a.src = c);
                    this.g.load();
                    return
                }
                Dl("hvd_nmse")
            }
        } else Dl("hvd_uad");
        a ? (Dl("hvd_src"), this.g.src = a) : Dl("hvd_vn");
        this.g.load()
    };
    m.setVolume = function(a) {
        this.g.volume = Math.max(a, 0);
        this.g.muted = a === 0 ? !0 : !1
    };
    m.Zd = function(a) {
        this.g.style.left = String(a.left) + "px";
        this.g.style.top = String(a.top) + "px";
        this.g.style.width = String(a.width) + "px";
        this.g.style.height = String(a.height) + "px"
    };
    m.ae = function() {
        this.g.style.width = "100%";
        this.g.style.height = "100%";
        this.g.style.left = "0";
        this.g.style.right = "0"
    };
    m.getVolume = function() {
        return this.g.muted ? 0 : this.g.volume
    };
    var sP = function(a) {
        a.aa = !1;
        a.U || Lb() ? (a.M = !1, a.l = a.g.play(), a.l != null && (a.P = null, a.l.then(function() {
            a.l = null;
            a.Se(a.P);
            a.P = null
        }).catch(function(b) {
            a.l = null;
            var c = "";
            b != null && b.name != null && (c = b.name);
            c === "AbortError" || c === "NotAllowedError" ? a.dispatchEvent("autoplayDisallowed") : a.Z()
        }))) : a.M = !0
    };
    m = dQ.prototype;
    m.pause = function() {
        this.l == null && (this.aa = !0, this.g.pause())
    };
    m.getCurrentTime = function() {
        return this.g.currentTime
    };
    m.getDuration = function() {
        return isNaN(this.g.duration) ? -1 : this.g.duration
    };
    m.getSize = function() {
        return new Fk(this.g.offsetWidth, this.g.offsetHeight)
    };
    m.O = function() {
        this.V && LD(this.V);
        rP(this);
        Q.prototype.O.call(this)
    };
    var rP = function(a) {
            a.B != null && (gO(a.B), a.B = null);
            a.H != null && a.H.dispose();
            nE(a.j);
            tP(a)
        },
        tP = function(a) {
            a.loaded = !1;
            a.G = !1;
            a.K = !1;
            a.M = !1;
            a.F = 0;
            a.l = null;
            a.P = null;
            Ar(a.C)
        };
    dQ.prototype.Pa = function(a) {
        this.dispatchEvent(a.type)
    };
    var fQ = function(a) {
        if (!a.G) {
            a.G = !0;
            a.dispatchEvent("start");
            try {
                if (Rn(kC) && y.customElements) {
                    var b = y.customElements.get("lima-video");
                    a.g instanceof b ? X.getInstance().report(153, {
                        limvid: "limastart"
                    }) : X.getInstance().report(153, {
                        limvid: "videostart"
                    })
                }
            } catch (c) {
                X.getInstance().report(153, {
                    limvid: "startfail"
                })
            }
            b = typeof a.g.getAttribute === "function" && a.g.getAttribute("playsinline") != null;
            b = b === void 0 ? !1 : b;
            (!SD() && !TD(10) || !b && (YI.getInstance(), !1) ? (YI.getInstance(), Ab(Fb(), "Xbox")) || (wc || zc ? 0 : (!vc || vc &&
                RD(QD, 4)) && (Uq() ? (YI.getInstance(), !1) : !$I())) : 1) || !vc || vc && RD(QD, 3) || (wc || zc) && !TD(4) || eQ(a)
        }
    };
    m = dQ.prototype;
    m.Ug = function() {
        this.U = !0;
        this.M && sP(this);
        this.M = !1;
        gQ(this)
    };
    m.Tg = function() {
        this.loaded || (this.loaded = !0, this.dispatchEvent("loaded"))
    };
    m.Se = function(a) {
        this.l != null ? this.P = a : (this.dispatchEvent("play"), Ac || SD() || Jc || fQ(this))
    };
    m.Xg = function(a) {
        if (!this.G && (Ac || SD() || Jc)) {
            if (this.getCurrentTime() <= 0) return;
            if (Jc && this.g.ended && this.getDuration() === 1) {
                this.Z(a);
                return
            }
            fQ(this)
        }
        if (Ac || Ab(Fb(), "Nintendo WiiU")) {
            if (this.getCurrentTime() - this.F > 1.5) {
                this.K = !0;
                this.g.currentTime = this.F;
                return
            }
            this.K = !1;
            this.getCurrentTime() > this.F && (this.F = this.getCurrentTime())
        }
        this.dispatchEvent("timeUpdate")
    };
    m.Zg = function() {
        this.dispatchEvent("volumeChange")
    };
    m.Wg = function() {
        if (this.G && Ac && !this.aa && (hQ(this) < 2 || this.K)) {
            this.C = new Lw(250);
            this.j.listen(this.C, "tick", this.va);
            this.C.start();
            var a = !0
        } else a = !1;
        a || this.l || this.dispatchEvent("pause")
    };
    m.Sg = function() {
        var a = !0;
        if (Ac || Ab(Fb(), "Nintendo WiiU")) a = this.F >= this.g.duration - 1.5;
        !this.K && a && this.dispatchEvent("end")
    };
    var eQ = function(a) {
        a.dispatchEvent("beginFullscreen")
    };
    dQ.prototype.ga = function() {
        this.dispatchEvent("endFullscreen")
    };
    dQ.prototype.Z = function() {
        this.dispatchEvent("error")
    };
    dQ.prototype.ka = function() {
        this.dispatchEvent("click")
    };
    var gQ = function(a) {
        a.g instanceof HTMLElement && (a.V = KD(a.g, cQ), a.V.then(function(b) {
            a.Ea() || L(K.getInstance(), "ps", b.width + "x" + b.height)
        }))
    };
    dQ.prototype.wa = function() {
        var a = this.getSize(),
            b = TP(this.g);
        if (a.width !== this.size.width || a.height !== this.size.height) !this.fullscreen && b ? eQ(this) : this.fullscreen && !b && this.ga(), this.size = a, this.fullscreen = b
    };
    dQ.prototype.va = function() {
        if (!this.g.ended && this.g.paused && (Ac || Nc ? this.g.currentTime < this.g.duration : 1)) {
            var a = this.g.duration - this.g.currentTime,
                b = hQ(this);
            b > 0 && (b >= 2 || a < 2) && (Ar(this.C), sP(this))
        } else Ar(this.C)
    };
    var hQ = function(a) {
        var b;
        a: {
            for (b = a.g.buffered.length - 1; b >= 0;) {
                if (a.g.buffered.start(b) <= a.g.currentTime) {
                    b = a.g.buffered.end(b);
                    break a
                }
                b--
            }
            b = 0
        }
        return b - a.g.currentTime
    };
    dQ.prototype.Qa = function() {
        X.getInstance().report(139);
        eQ(this)
    };
    var lQ = function(a) {
            if (a instanceof iQ || a instanceof jQ || a instanceof kQ) return a;
            if (typeof a.next == "function") return new iQ(function() {
                return a
            });
            if (typeof a[Symbol.iterator] == "function") return new iQ(function() {
                return a[Symbol.iterator]()
            });
            if (typeof a.Bb == "function") return new iQ(function() {
                return a.Bb()
            });
            throw Error("Not an iterator or iterable.");
        },
        iQ = function(a) {
            this.g = a
        };
    iQ.prototype.Bb = function() {
        return new jQ(this.g())
    };
    iQ.prototype[Symbol.iterator] = function() {
        return new kQ(this.g())
    };
    iQ.prototype.j = function() {
        return new kQ(this.g())
    };
    var jQ = function(a) {
        this.g = a
    };
    w(jQ, os);
    jQ.prototype.next = function() {
        return this.g.next()
    };
    jQ.prototype[Symbol.iterator] = function() {
        return new kQ(this.g)
    };
    jQ.prototype.j = function() {
        return new kQ(this.g)
    };
    var kQ = function(a) {
        iQ.call(this, function() {
            return a
        });
        this.l = a
    };
    w(kQ, iQ);
    kQ.prototype.next = function() {
        return this.l.next()
    };
    var mQ = function(a, b) {
        this.j = {};
        this.g = [];
        this.l = this.size = 0;
        var c = arguments.length;
        if (c > 1) {
            if (c % 2) throw Error("Uneven number of arguments");
            for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
        } else if (a)
            if (a instanceof mQ)
                for (c = a.Hc(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d]));
            else
                for (d in a) this.set(d, a[d])
    };
    m = mQ.prototype;
    m.Fb = function() {
        nQ(this);
        for (var a = [], b = 0; b < this.g.length; b++) a.push(this.j[this.g[b]]);
        return a
    };
    m.Hc = function() {
        nQ(this);
        return this.g.concat()
    };
    m.has = function(a) {
        return oQ(this.j, a)
    };
    m.isEmpty = function() {
        return this.size == 0
    };
    m.clear = function() {
        this.j = {};
        this.l = this.size = this.g.length = 0
    };
    m.remove = function(a) {
        return this.delete(a)
    };
    m.delete = function(a) {
        return oQ(this.j, a) ? (delete this.j[a], --this.size, this.l++, this.g.length > 2 * this.size && nQ(this), !0) : !1
    };
    var nQ = function(a) {
        if (a.size != a.g.length) {
            for (var b = 0, c = 0; b < a.g.length;) {
                var d = a.g[b];
                oQ(a.j, d) && (a.g[c++] = d);
                b++
            }
            a.g.length = c
        }
        if (a.size != a.g.length) {
            b = {};
            for (d = c = 0; c < a.g.length;) {
                var e = a.g[c];
                oQ(b, e) || (a.g[d++] = e, b[e] = 1);
                c++
            }
            a.g.length = d
        }
    };
    m = mQ.prototype;
    m.get = function(a, b) {
        return oQ(this.j, a) ? this.j[a] : b
    };
    m.set = function(a, b) {
        oQ(this.j, a) || (this.size += 1, this.g.push(a), this.l++);
        this.j[a] = b
    };
    m.forEach = function(a, b) {
        for (var c = this.Hc(), d = 0; d < c.length; d++) {
            var e = c[d],
                f = this.get(e);
            a.call(b, f, e, this)
        }
    };
    m.keys = function() {
        return lQ(this.Bb(!0)).j()
    };
    m.values = function() {
        return lQ(this.Bb(!1)).j()
    };
    m.entries = function() {
        var a = this;
        return DD(this.keys(), function(b) {
            return [b, a.get(b)]
        })
    };
    m.Bb = function(a) {
        nQ(this);
        var b = 0,
            c = this.l,
            d = this,
            e = new os;
        e.next = function() {
            if (c != d.l) throw Error("The map has changed since the iterator was created");
            if (b >= d.g.length) return ps;
            var f = d.g[b++];
            return {
                value: a ? f : d.j[f],
                done: !1
            }
        };
        return e
    };
    var oQ = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };
    var qQ = function() {
        Q.call(this);
        this.currentTime = 0;
        this.duration = NaN;
        this.l = !0;
        this.volume = 1;
        this.muted = !1;
        this.C = 1;
        this.playbackRate = 0;
        this.j = this.g = this.G = null;
        this.buffered = new pQ;
        this.F = new pQ;
        this.B = "";
        this.tagName = "VIDEO";
        this.height = this.width = 0;
        this.canPlayType = function() {
            return ""
        };
        this.A = new jE(this);
        Cr(this, this.A);
        var a = lI(nI);
        a && (this.duration = iI(a))
    };
    w(qQ, Q);
    var rQ = function() {
        var a = ["video/mp4"],
            b = ["video/ogg"],
            c = new qQ;
        c.canPlayType = function(d) {
            return a.includes(d) ? "probably" : b.includes(d) ? "maybe" : ""
        };
        return c
    };
    m = qQ.prototype;
    m.pause = function() {
        if (!this.l) {
            var a;
            (a = this.G) == null || a.stop();
            this.l = !0;
            this.dispatchEvent("timeupdate");
            this.dispatchEvent("pause")
        }
    };
    m.load = function() {
        this.l = !0;
        this.dispatchEvent("loadstart");
        var a;
        isNaN(this.duration) ? a = 10 + Math.random() * 20 : a = this.duration;
        this.duration = Number(a);
        this.dispatchEvent("durationchange");
        a = this.F;
        a.g.push(new sQ(this.duration));
        a.length = a.g.length;
        a = this.buffered;
        a.g.push(new sQ(this.duration));
        a.length = a.g.length;
        this.dispatchEvent("loadedmetadata");
        this.currentTime > 0 && this.dispatchEvent("timeupdate");
        this.dispatchEvent("loadeddata");
        this.dispatchEvent("canplay");
        this.dispatchEvent("canplaythrough");
        this.dispatchEvent("progress");
        this.playbackRate = this.C
    };
    m.setVolume = function(a) {
        this.volume = a;
        this.dispatchEvent("volumechange")
    };
    m.setAttribute = function(a, b) {
        a != null && tQ.set(a, b)
    };
    m.getAttribute = function(a) {
        return tQ.get(a)
    };
    m.Yg = function(a) {
        var b = null,
            c = null;
        switch (a.type) {
            case "loadeddata":
                b = "Loaded";
                break;
            case "playing":
                b = "Playing";
                c = "#00f";
                break;
            case "pause":
                b = "Paused";
                break;
            case "ended":
                b = "Ended", c = "#000"
        }
        b && this.j && (this.j.innerText = b);
        c && this.g && (this.g.style.backgroundColor = c)
    };
    ea.Object.defineProperties(qQ.prototype, {
        src: {
            configurable: !0,
            enumerable: !0,
            get: function() {
                return this.B
            },
            set: function(a) {
                this.B = a
            }
        }
    });
    var tQ = new mQ,
        sQ = function(a) {
            this.startTime = 0;
            this.endTime = a
        },
        pQ = function() {
            this.length = 0;
            this.g = []
        };
    pQ.prototype.start = function(a) {
        return this.g[a].startTime
    };
    pQ.prototype.end = function(a) {
        return this.g[a].endTime
    };
    var vQ = function(a) {
        P.call(this);
        this.o = a;
        this.l = this.g = null;
        this.j = uQ(this);
        this.g = So("DIV", {
            style: "display:none;"
        });
        this.o.appendChild(this.g);
        this.g.appendChild(this.j);
        this.l = So("DIV", {
            style: "position:absolute;width:100%;height:100%;left:0px;top:0px"
        });
        this.g.appendChild(this.l);
        fH(function() {
            L(K.getInstance(), "haob", "1")
        })
    };
    w(vQ, P);
    vQ.prototype.initialize = function() {
        this.j && this.j.load()
    };
    vQ.prototype.O = function() {
        To(this.g);
        P.prototype.O.call(this)
    };
    var uQ = function(a) {
            var b = lI(nI);
            if (hI(b, "useVideoElementFake")) a = rQ(), b = So("DIV", {
                style: "position:absolute;width:100%;height:100%;top:0px;left:0px;"
            }), Object.assign(b, a), a.g = So("DIV", {
                style: "position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:#000"
            }), a.j = So("P", {
                style: "position:absolute;top:25%;margin-left:10px;font-size:24px;color:#fff;"
            }), a.g.appendChild(a.j), b.appendChild(a.g), a.A.listen(a, ["loadeddata", "playing", "pause", "ended"], a.Yg), a = b;
            else {
                b = !1;
                try {
                    window.location.search.indexOf("goog_limavideo=true") !==
                        -1 && (b = !0)
                } catch (c) {}
                if (wQ(a, b)) {
                    b && console.log("force lima video in wrapper");
                    a = null;
                    try {
                        a = new rH
                    } catch (c) {
                        a = So("lima-video"), Rn(kC) && X.getInstance().report(153, {
                            limvid: "firefail"
                        })
                    }
                    a.style.backgroundColor = "#000";
                    a.style.height = "100%";
                    a.style.width = "100%";
                    a.style.position = "absolute";
                    a.style.left = "0";
                    a.style.top = "0"
                } else a = So("VIDEO", {
                    style: "background-color:#000;position:absolute;width:100%;height:100%;left:0;top:0;",
                    title: "Advertisement".toString()
                })
            }
            a.setAttribute("webkit-playsinline", "true");
            a.setAttribute("playsinline", "true");
            return a
        },
        wQ = function(a, b) {
            if (!y.customElements) return !1;
            if (b) return !0;
            if (Mb() && Io(a.o) !== document) return !1;
            Rn(kC) && X.getInstance().report(153, {
                limvid: "vw"
            });
            return Rn(kC) ? !0 : !1
        };
    vQ.prototype.Ub = function() {
        return this.l
    };
    vQ.prototype.kb = function() {
        var a = this.g;
        a != null && (a.style.display = "none")
    };
    var AQ = function(a, b, c) {
        var d = a && a.getRootNode ? a.getRootNode({
            composed: !0
        }) : a;
        if (a == null || !Uo(Io(d), d)) throw MJ(LJ, null, "containerElement", "element");
        this.j = b;
        this.P = bJ(this.j || null);
        this.M = UD(this.j || null);
        this.K = String(Math.floor(Math.random() * 1E9));
        this.F = !1;
        this.jc = a;
        this.H = b != null;
        nI.g = 2;
        this.J = xQ(b ? b : null);
        d = So("DIV", {
            style: "position:absolute"
        });
        a.insertBefore(d, a.firstChild);
        this.o = d;
        this.g = null;
        yQ(this) && b ? a = new dQ(b) : (this.g = new vQ(this.o), a = new dQ(this.g.j));
        this.ca = a;
        this.ya = this.l = null;
        if (a = this.g && nI.o) a = !(yQ(this) || wc || zc || Wq() || vc && (!vc || !RD(QD, 4)));
        a && (this.l = new vQ(this.o), this.ya = new dQ(this.l.j));
        this.A = c || null;
        this.G = this.A != null;
        yQ(this) && b ? typeof b.getBoundingClientRect !== "function" ? (c = this.o, nI.l = c) : c = b : c = this.o;
        this.C = c;
        this.B = new LP(this.o, this, !0);
        this.size = new Fk(0, 0);
        this.L = "";
        b && (b = iD(b.src || b.currentSrc), b.toString().length < 200 ? this.L = b.toString() : b.g.length < 200 && (this.L = b.g));
        this.me = new Map;
        this.me.set("videoDisplay1", this.ca);
        this.ya && this.me.set("videoDisplay2",
            this.ya);
        zQ(this) && !nI.j && console.warn("Custom media element must be a <video> or <audio> element. Viewability/audibility measurement will fail.")
    };
    m = AQ.prototype;
    m.initialize = function() {
        this.F = !0;
        this.g != null && this.g.initialize();
        this.l != null && this.l.initialize()
    };
    m.ua = function() {
        return this.F
    };
    m.destroy = function() {
        var a = this;
        this.j = null;
        Ar(this.g);
        Ar(this.l);
        Ar(this.B);
        this.ca.tc(function() {
            return Ar(a.ca)
        });
        this.ya != null && this.ya.tc(function() {
            return Ar(a.ya)
        });
        To(this.o)
    };
    m.jd = function() {
        if (this.g != null) {
            var a = this.g.g;
            a != null && (a.style.display = "block")
        }
    };
    m.uc = function(a) {
        this.ca !== a && this.g && this.l && this.ya && (a.setVolume(this.ca.getVolume()), a = this.ca, this.ca = this.ya, this.ya = a, a = this.g, this.g = this.l, this.l = a, this.l.kb(), this.B.uc(this.ca))
    };
    m.kb = function() {
        this.g != null && this.g.kb()
    };
    m.Ub = function() {
        return this.G && this.A ? this.A : this.g != null ? this.g.Ub() : null
    };
    var yQ = function(a) {
            return aJ(a.J) && a.H
        },
        zQ = function(a) {
            var b = ["VIDEO", "AUDIO"],
                c;
            return yQ(a) && !!a.j && !b.includes((c = a.j.tagName) == null ? void 0 : c.toUpperCase())
        };
    AQ.prototype.getSize = function() {
        return this.size
    };
    var xQ = function(a) {
        return a != null && typeof a.getAttribute === "function" && a.getAttribute("playsinline") != null ? !0 : !1
    };
    AQ.prototype.Zd = function(a) {
        this.ca.Zd(a)
    };
    AQ.prototype.ae = function() {
        this.ca.ae()
    };
    AQ.prototype.destroy = AQ.prototype.destroy;
    AQ.prototype.initialize = AQ.prototype.initialize;
    var BQ = {
            AD_LOAD: "adLoadError",
            AD_PLAY: "adPlayError"
        },
        CQ = function(a) {
            var b = Error.call(this);
            this.message = b.message;
            "stack" in b && (this.stack = b.stack);
            this.data = a
        };
    w(CQ, Error);
    m = CQ.prototype;
    m.getInnerError = function() {
        var a = this.data.innerError;
        return a instanceof Object ? new CQ(a) : a != null ? Error(a) : null
    };
    m.getMessage = function() {
        return this.data.errorMessage
    };
    m.getErrorCode = function() {
        return this.data.errorCode
    };
    m.getVastErrorCode = function() {
        var a = this.getErrorCode();
        return a < 1E3 ? a : 900
    };
    m.getType = function() {
        return this.data.type
    };
    m.toString = function() {
        return "AdError " + this.getErrorCode() + ": " + this.getMessage() + (this.getInnerError() != null ? " Caused by: " + this.getInnerError() : "")
    };
    CQ.prototype.getType = CQ.prototype.getType;
    CQ.prototype.getVastErrorCode = CQ.prototype.getVastErrorCode;
    CQ.prototype.getErrorCode = CQ.prototype.getErrorCode;
    CQ.prototype.getMessage = CQ.prototype.getMessage;
    CQ.prototype.getInnerError = CQ.prototype.getInnerError;
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_error.AdError.Type", BQ);
    var DQ = {
            AD_ERROR: "adError"
        },
        EQ = function(a, b) {
            b = b === void 0 ? null : b;
            Iv.call(this, "adError");
            this.error = a;
            this.g = b
        };
    w(EQ, Iv);
    EQ.prototype.getError = function() {
        return this.error
    };
    EQ.prototype.getUserRequestContext = function() {
        return this.g
    };
    EQ.prototype.getUserRequestContext = EQ.prototype.getUserRequestContext;
    EQ.prototype.getError = EQ.prototype.getError;
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_error_event.AdErrorEvent.Type", DQ);
    var FQ = {
            AD_CAN_PLAY: "adCanPlay",
            Ch: "adStarted",
            CONTENT_PAUSE_REQUESTED: "contentPauseRequested",
            CONTENT_RESUME_REQUESTED: "contentResumeRequested",
            CLICK: "click",
            VIDEO_CLICKED: "videoClicked",
            VIDEO_ICON_CLICKED: "videoIconClicked",
            ne: "engagedView",
            EXPANDED_CHANGED: "expandedChanged",
            STARTED: "start",
            AD_PROGRESS: "adProgress",
            AD_BUFFERING: "adBuffering",
            IMPRESSION: "impression",
            se: "measurable_impression",
            VIEWABLE_IMPRESSION: "viewable_impression",
            oe: "fully_viewable_audible_half_duration_impression",
            Gf: "overlay_resize",
            Hf: "overlay_unmeasurable_impression",
            If: "overlay_unviewable_impression",
            Kf: "overlay_viewable_immediate_impression",
            Jf: "overlay_viewable_end_of_session_impression",
            Th: "externalActivityEvent",
            PAUSED: "pause",
            RESUMED: "resume",
            FIRST_QUARTILE: "firstQuartile",
            MIDPOINT: "midpoint",
            THIRD_QUARTILE: "thirdQuartile",
            COMPLETE: "complete",
            DURATION_CHANGE: "durationChange",
            USER_CLOSE: "userClose",
            Si: "userRecall",
            Gi: "prefetched",
            LOADED: "loaded",
            ALL_ADS_COMPLETED: "allAdsCompleted",
            SKIPPED: "skip",
            Of: "skipShown",
            LINEAR_CHANGED: "linearChanged",
            SKIPPABLE_STATE_CHANGED: "skippableStateChanged",
            AD_METADATA: "adMetadata",
            AD_BREAK_FETCH_ERROR: "adBreakFetchError",
            AD_BREAK_READY: "adBreakReady",
            LOG: "log",
            VOLUME_CHANGED: "volumeChange",
            VOLUME_MUTED: "mute",
            INTERACTION: "interaction",
            Hh: "companionBackfill",
            Qi: "trackingUrlPinged",
            Ti: "video_card_endcap_collapse",
            Ui: "video_card_endcap_dismiss",
            Vi: "video_card_endcap_impression",
            Kh: "companionInitialized",
            Jh: "companionImpression",
            Ih: "companionClick",
            Ai: "mediaUrlPinged",
            LOAD_START: "loadStart",
            Ci: "navigationRequested"
        },
        GQ = function(a, b, c) {
            b = b === void 0 ? null : b;
            c = c === void 0 ? null : c;
            Iv.call(this, a);
            this.ad = b;
            this.l = c
        };
    w(GQ, Iv);
    GQ.prototype.getAd = function() {
        return this.ad
    };
    GQ.prototype.getAdData = function() {
        return this.l
    };
    GQ.prototype.getAdData = GQ.prototype.getAdData;
    GQ.prototype.getAd = GQ.prototype.getAd;
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ad_event.AdEvent.Type", FQ);
    var HQ = function(a, b) {
        b = b === void 0 ? null : b;
        GQ.call(this, "adMetadata", a);
        this.g = b
    };
    w(HQ, GQ);
    HQ.prototype.pg = function() {
        return this.g
    };
    HQ.prototype.getAdCuePoints = HQ.prototype.pg;
    var IQ = function(a) {
        this.adBreakDuration = a.adBreakDuration;
        this.adPosition = a.adPosition;
        this.currentTime = a.currentTime;
        this.duration = a.duration;
        this.totalAds = a.totalAds
    };
    var JQ = function(a, b) {
        Q.call(this);
        this.l = a;
        this.B = b;
        this.j = this.l.currentTime;
        this.g = new Lw(250);
        Cr(this, this.g);
        this.A = new jE(this);
        Cr(this, this.A);
        lE(this.A, this.g, "tick", this.C, !1, this)
    };
    w(JQ, Q);
    JQ.prototype.ib = function() {
        return this.j
    };
    JQ.prototype.start = function() {
        KQ(this);
        this.g.start()
    };
    JQ.prototype.stop = function() {
        this.g.stop()
    };
    JQ.prototype.C = function() {
        var a = this.l.currentTime;
        a !== this.ib() && (this.j = a, KQ(this))
    };
    var KQ = function(a) {
        var b = {};
        b.currentTime = a.ib();
        vJ(a.B, "contentTimeUpdate", "contentTimeUpdate", b)
    };
    var LQ = tc && "srcdoc" in Qo(document, "IFRAME"),
        MQ = function(a, b) {
            a.open("text/html", "replace");
            Ni(a, iE(String(b)));
            a.close()
        };
    var NQ = {
            rgb: !0,
            rgba: !0,
            alpha: !0,
            rect: !0,
            image: !0,
            "linear-gradient": !0,
            "radial-gradient": !0,
            "repeating-linear-gradient": !0,
            "repeating-radial-gradient": !0,
            "cubic-bezier": !0,
            matrix: !0,
            perspective: !0,
            rotate: !0,
            rotate3d: !0,
            rotatex: !0,
            rotatey: !0,
            steps: !0,
            rotatez: !0,
            scale: !0,
            scale3d: !0,
            scalex: !0,
            scaley: !0,
            scalez: !0,
            skew: !0,
            skewx: !0,
            skewy: !0,
            translate: !0,
            translate3d: !0,
            translatex: !0,
            translatey: !0,
            translatez: !0
        },
        OQ = function(a) {
            a = xb(a);
            if (a == "") return null;
            var b = String(a.slice(0, 4)).toLowerCase();
            if (("url(" <
                    b ? -1 : "url(" == b ? 0 : 1) == 0) return null;
            if (a.indexOf("(") > 0) {
                if (/"|'/.test(a)) return null;
                b = /([\-\w]+)\(/g;
                for (var c; c = b.exec(a);)
                    if (!(c[1].toLowerCase() in NQ)) return null
            }
            return a
        };

    function PQ(a, b) {
        a = y[a];
        return a && a.prototype ? (b = Object.getOwnPropertyDescriptor(a.prototype, b)) && b.get || null : null
    }

    function QQ(a) {
        var b = y.CSSStyleDeclaration;
        return b && b.prototype && b.prototype[a] || null
    }
    PQ("Element", "attributes") || PQ("Node", "attributes");
    PQ("Element", "innerHTML") || PQ("HTMLElement", "innerHTML");
    PQ("Node", "nodeName");
    PQ("Node", "nodeType");
    PQ("Node", "parentNode");
    PQ("Node", "childNodes");
    PQ("HTMLElement", "style") || PQ("Element", "style");
    PQ("HTMLStyleElement", "sheet");
    var RQ = QQ("getPropertyValue"),
        SQ = QQ("setProperty");
    PQ("Element", "namespaceURI") || PQ("Node", "namespaceURI");

    function TQ(a, b, c, d) {
        if (a) return a.apply(b, d);
        if (qc && document.documentMode < 10) {
            if (!b[c].call) throw Error("IE Clobbering detected");
        } else if (typeof b[c] != "function") throw Error("Clobbering detected");
        return b[c].apply(b, d)
    };
    var UQ = {
            "-webkit-border-horizontal-spacing": !0,
            "-webkit-border-vertical-spacing": !0
        },
        WQ = function(a) {
            if (!a) return "";
            var b = document.createElement("div").style;
            VQ(a).forEach(function(c) {
                var d = tc && c in UQ ? c : c.replace(/^-(?:apple|css|epub|khtml|moz|mso?|o|rim|wap|webkit|xv)-(?=[a-z])/i, "");
                d.lastIndexOf("--", 0) != 0 && d.lastIndexOf("var", 0) != 0 && (c = TQ(RQ, a, a.getPropertyValue ? "getPropertyValue" : "getAttribute", [c]) || "", c = OQ(c), c != null && TQ(SQ, b, b.setProperty ? "setProperty" : "setAttribute", [d, c]))
            });
            return b.cssText ||
                ""
        },
        VQ = function(a) {
            Va(a) ? a = gc(a) : (a = ki(a), cc(a, "cssText"));
            return a
        };
    var XQ = function(a, b, c) {
        Q.call(this);
        this.j = a;
        this.l = b;
        this.C = c;
        this.g = null;
        this.G = this.F = "";
        this.H = 0;
        this.A = this.slot = this.frameElement = null;
        this.B = ""
    };
    w(XQ, Q);
    XQ.prototype.init = function(a) {
        this.B = a;
        a = "about:blank";
        qc && (a = "");
        this.frameElement = So("IFRAME", {
            src: a,
            allowtransparency: !0,
            background: "transparent",
            title: "Advertisement"
        });
        Aq(this.frameElement, {
            display: "none",
            width: "0",
            height: "0"
        });
        a = this.j.jc;
        a.appendChild(this.frameElement);
        a = a.ownerDocument;
        a = a.defaultView || a.parentWindow;
        this.A == null && (this.A = new jE(this));
        this.A.listen(a, "message", this.K);
        a = '<body><script src="//imasdk.googleapis.com/js/sdkloader/loader.js">\x3c/script><script>loader = new VPAIDLoader(false, "' +
            (this.B + '");\x3c/script></body>');
        if (Nc || Ic || rc) {
            var b = this.frameElement.contentWindow;
            b && MQ(b.document, a)
        } else b = this.frameElement, LQ ? (a = iE(a), b.srcdoc = Ji(a)) : (b = b.contentWindow) && MQ(b.document, a)
    };
    XQ.prototype.K = function(a) {
        try {
            var b = a.g.data;
            try {
                var c = JSON.parse(b)
            } catch (t) {
                return
            }
            var d = c.session;
            if (d != null && this.B === d) switch (c.type) {
                case "friendlyReady":
                    var e = YQ(this);
                    if (e != null) {
                        this.g = e;
                        this.F = e.currentSrc;
                        var f = e.style.cssText,
                            g = document.implementation.createHTMLDocument("").createElement("DIV");
                        g.style.cssText = f;
                        this.G = WQ(g.style);
                        this.H = e.currentTime
                    } else {
                        var h = this.j.jc,
                            k = "border: 0; margin: 0; padding: 0; position: absolute; ",
                            l = this.j.getSize();
                        k += "width:" + l.width + "px;";
                        k += "height:" +
                            l.height + "px;";
                        this.g = So("VIDEO", {
                            style: k,
                            autoplay: !0
                        });
                        h.appendChild(this.g)
                    }
                    var p = this.j.jc;
                    h = "border: 0; margin: 0; padding: 0;position: absolute; ";
                    var n = Jq(this.g);
                    h += "width:" + n.width + "px;";
                    h += "height:" + n.height + "px;";
                    this.slot = So("DIV", {
                        style: h
                    });
                    p.appendChild(this.slot);
                    try {
                        this.frameElement.contentWindow.loader.initFriendly(this.g, this.slot)
                    } catch (t) {
                        ZQ(this)
                    }
                    vJ(this.l, "vpaid", "", b);
                    break;
                case "becameLinear":
                    this.g && !Yh() && !Xh() && Aq(this.g, {
                        visibility: "visible"
                    });
                    vJ(this.l, "vpaid", "", b);
                    break;
                case "becameNonlinear":
                    $Q(this);
                    vJ(this.l, "vpaid", "", b);
                    break;
                case "startAd":
                    p = {};
                    if (this.g) {
                        k = this.g.paused;
                        var q = this.g.currentTime > 0;
                        p.apl = q && !k ? "1" : "0";
                        p.ip = k ? "1" : "0";
                        p.iavp = q ? "1" : "0"
                    } else p.apl = "n";
                    X.getInstance().report(99, p);
                    vJ(this.l, "vpaid", "", b);
                    this.jd();
                    break;
                default:
                    vJ(this.l, "vpaid", "", b)
            }
        } catch (t) {
            ZQ(this)
        }
    };
    var ZQ = function(a) {
        var b = {
            type: "error"
        };
        b.session = a.B;
        b = JSON.stringify(b);
        a.postMessage(b)
    };
    XQ.prototype.postMessage = function(a) {
        window.postMessage(a, "*")
    };
    var YQ = function(a) {
        return (a.C === "videoDisplayUnknown" ? a.j.ca : a.j.me.get(a.C)).A.g
    };
    XQ.prototype.jd = function() {
        YQ(this) != null && this.j.jd()
    };
    var $Q = function(a) {
        a.g && !Yh() && !Xh() && Aq(a.g, {
            visibility: "hidden"
        })
    };
    XQ.prototype.O = function() {
        Ar(this.A);
        this.A = null;
        To(this.slot);
        this.slot = null;
        To(this.frameElement);
        this.frameElement = null;
        var a = YQ(this);
        a != null ? (a.style.cssText = this.G, Yh() || Xh() ? (a.src = this.F, a.currentTime = this.H) : (a.removeAttribute("src"), this.j.kb())) : (To(this.g), this.g = null);
        Q.prototype.O.call(this)
    };
    var aR = function(a, b) {
        P.call(this);
        this.j = a;
        this.l = b;
        this.g = new Map
    };
    w(aR, P);
    var bR = function(a, b) {
        try {
            var c = b.na,
                d = c.session;
            switch (c.vpaidEventType) {
                case "createFriendlyIframe":
                    b = "videoDisplayUnknown";
                    c.videoDisplayName && (b = c.videoDisplayName);
                    var e = c.session,
                        f = new XQ(a.j, a.l, b);
                    a.g.set(e, f);
                    f.init(e);
                    break;
                case "vpaidNonLinear":
                    var g = a.g.get(d);
                    g && $Q(g);
                    break;
                case "destroyFriendlyIframe":
                    var h = a.g.get(d);
                    h && (h.dispose(), a.g.delete(d))
            }
        } catch (k) {
            X.getInstance().report(125, {
                msg: k.message
            })
        }
    };
    aR.prototype.O = function() {
        this.g.forEach(function(a) {
            a.dispose()
        })
    };
    var cR = function(a) {
        this.D = B(a)
    };
    w(cR, H);
    cR.prototype.getValue = function() {
        return E(this, 1)
    };
    cR.prototype.getVersion = function() {
        return F(this, 5)
    };
    var dR = Kh(cR);
    var eR = function(a) {
        this.g = a || {
            cookie: ""
        }
    };
    m = eR.prototype;
    m.set = function(a, b, c) {
        var d = !1;
        if (typeof c === "object") {
            var e = c.af;
            d = c.ed || !1;
            var f = c.domain || void 0;
            var g = c.path || void 0;
            var h = c.Qc
        }
        if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');
        if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');
        h === void 0 && (h = -1);
        this.g.cookie = a + "=" + b + (f ? ";domain=" + f : "") + (g ? ";path=" + g : "") + (h < 0 ? "" : h == 0 ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(Date.now() + h * 1E3)).toUTCString()) + (d ? ";secure" : "") + (e != null ? ";samesite=" + e : "")
    };
    m.get = function(a, b) {
        for (var c = a + "=", d = (this.g.cookie || "").split(";"), e = 0, f; e < d.length; e++) {
            f = xb(d[e]);
            if (f.lastIndexOf(c, 0) == 0) return f.slice(c.length);
            if (f == a) return ""
        }
        return b
    };
    m.remove = function(a, b, c) {
        var d = this.get(a) !== void 0;
        this.set(a, "", {
            Qc: 0,
            path: b,
            domain: c
        });
        return d
    };
    m.Hc = function() {
        return fR(this).keys
    };
    m.Fb = function() {
        return fR(this).values
    };
    m.isEmpty = function() {
        return !this.g.cookie
    };
    m.clear = function() {
        for (var a = fR(this).keys, b = a.length - 1; b >= 0; b--) this.remove(a[b])
    };
    var fR = function(a) {
        a = (a.g.cookie || "").split(";");
        for (var b = [], c = [], d, e, f = 0; f < a.length; f++) e = xb(a[f]), d = e.indexOf("="), d == -1 ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
        return {
            keys: b,
            values: c
        }
    };

    function gR(a, b, c) {
        return hg(b, 5) ? hR(a, c) : null
    }
    var iR;

    function jR(a) {
        return iR ? iR : a.origin === "null" ? iR = !1 : iR = kR(a)
    }

    function kR(a) {
        if (!a.navigator.cookieEnabled) return !1;
        var b = new eR(a.document);
        if (!b.isEmpty()) return !0;
        b.set("TESTCOOKIESENABLED", "1", {
            Qc: 60,
            af: a.isSecureContext ? "none" : void 0,
            ed: a.isSecureContext || void 0
        });
        if (b.get("TESTCOOKIESENABLED") !== "1") return !1;
        b.remove("TESTCOOKIESENABLED");
        return !0
    }

    function hR(a, b) {
        b = b.origin !== "null" ? b.document.cookie : null;
        return b === null ? null : (new eR({
            cookie: b
        })).get(a) || ""
    }

    function lR(a, b, c, d) {
        d.origin !== "null" && (d.isSecureContext && (c = Object.assign({}, c, {
            af: "none",
            ed: !0
        })), (new eR(d.document)).set(a, b, c))
    };
    var mR = function() {
            this.g = window
        },
        nR = function(a, b) {
            return hg(b, 5) ? !!jR(a.g) : !1
        },
        oR = function(a, b, c, d) {
            if (d) {
                var e = kg(c, 2) - Date.now() / 1E3;
                e = {
                    Qc: Math.max(e, 0),
                    path: E(c, 3),
                    domain: E(c, 4),
                    ed: !1
                };
                c = c.getValue();
                a = a.g;
                hg(d, 5) && lR(b, c, e, a)
            }
        },
        pR = function(a, b, c) {
            if (c && gR(b, c, a.g)) {
                var d = a.g.location.hostname;
                if (d === "localhost") d = ["localhost"];
                else if (d = d.split("."), d.length < 2) d = [];
                else {
                    for (var e = [], f = 0; f < d.length - 1; ++f) e.push(d.slice(f).join("."));
                    d = e
                }
                d = x(d);
                for (var g = d.next(); !g.done; g = d.next()) e = b, f = a.g, g =
                    g.value, hg(c, 5) && f.origin !== "null" && (new eR(f.document)).remove(e, "/", g)
            }
        };
    var qR = function() {
        this.g = [];
        this.j = []
    };
    m = qR.prototype;
    m.isEmpty = function() {
        return this.g.length === 0 && this.j.length === 0
    };
    m.clear = function() {
        this.g = [];
        this.j = []
    };
    m.contains = function(a) {
        return bc(this.g, a) || bc(this.j, a)
    };
    m.remove = function(a) {
        var b = this.g;
        b: {
            var c = b.length - 1;c < 0 && (c = Math.max(0, b.length + c));
            if (typeof b === "string") c = typeof a !== "string" || a.length != 1 ? -1 : b.lastIndexOf(a, c);
            else {
                for (; c >= 0; c--)
                    if (c in b && b[c] === a) break b;
                c = -1
            }
        }
        c >= 0 ? (dc(b, c), b = !0) : b = !1;
        return b || cc(this.j, a)
    };
    m.Fb = function() {
        for (var a = [], b = this.g.length - 1; b >= 0; --b) a.push(this.g[b]);
        b = this.j.length;
        for (var c = 0; c < b; ++c) a.push(this.j[c]);
        return a
    };
    var Z = function(a, b, c, d, e, f, g, h) {
        Q.call(this);
        var k = this;
        this.H = a;
        this.g = b;
        this.adTagUrl = c;
        this.ga = d;
        this.Qa = e;
        this.F = g;
        this.Pa = h;
        this.A = new YO;
        this.M = !1;
        this.volume = 1;
        this.ga = d;
        this.ba = -1;
        this.C = this.l = this.j = null;
        this.B = new JQ({
            currentTime: 0
        }, this.F);
        this.G = new qR;
        this.ka = this.V = !1;
        this.Z = new Map;
        this.aa = this.va = !1;
        this.wa = new aR(b, g);
        Cr(this, this.wa);
        this.K = f && this.g.A != null;
        this.P = function() {
            var l = k.g.ca,
                p = l.getCurrentTime();
            l = l.getDuration();
            return {
                currentTime: p,
                duration: l,
                isPlaying: !0,
                volume: k.volume
            }
        };
        this.U = new jE(this);
        this.U.listen(this.F, "adsManager", this.Db)
    };
    w(Z, Q);
    Z.prototype.Db = function(a) {
        var b = this,
            c = a.messageType,
            d = a.na,
            e = {};
        switch (c) {
            case "error":
                rR(this);
                sR(this, d);
                break;
            case "contentPauseRequested":
                X.getInstance().report(130);
                tR(this);
                this.B.stop();
                uR(this, c, d);
                break;
            case "contentResumeRequested":
                vR(this, function() {
                    uR(b, c, d)
                });
                break;
            case "remainingTime":
                this.ba = d.remainingTime;
                break;
            case "skip":
                uR(this, c, d);
                break;
            case "log":
                uR(this, c, d, d.logData);
                break;
            case "companionBackfill":
                a = Sa("window.google_show_companion_ad");
                a != null && a();
                break;
            case "skipShown":
                this.M = !0;
                uR(this, c, d);
                break;
            case "interaction":
                uR(this, c, d, d.interactionData);
                break;
            case "vpaidEvent":
                bR(this.wa, a);
                break;
            case "skippableStateChanged":
                e = d.adData;
                e.skippable != null && (this.M = e.skippable);
                uR(this, c, d);
                break;
            case "volumeChange":
                e = d.adData;
                e != null && typeof e.volume === "number" && (this.volume = e.volume);
                uR(this, c, d);
                break;
            case "firstQuartile":
                uR(this, kJ.firstQuartile, d);
                uR(this, c, d);
                break;
            case "thirdQuartile":
                uR(this, kJ.thirdQuartile, d);
                uR(this, c, d);
                break;
            case "updateGfpCookie":
                wR(this, d);
                break;
            default:
                uR(this, c, d)
        }
    };
    var uR = function(a, b, c, d) {
            if (c.companions == null) {
                var e = a.Z.get(c.adId);
                c.companions = e != null ? e : []
            }
            var f = c.adData;
            if (e = f == null ? null : new Y(f)) a.j = e;
            switch (b) {
                case "adBreakReady":
                case "mediaUrlPinged":
                    b = new GQ(b, null, c);
                    break;
                case "adMetadata":
                    b = null;
                    c.adCuePoints != null && (b = new XO(c.adCuePoints));
                    b = new HQ(e, b);
                    break;
                case "allAdsCompleted":
                    a.j = null;
                    a.va = !0;
                    b = new GQ(b, e);
                    break;
                case "contentPauseRequested":
                    a.aa = !1;
                    b = new GQ(b, e);
                    break;
                case "contentResumeRequested":
                    a.j = null;
                    a.aa = !0;
                    b = new GQ(b, e);
                    break;
                case "loaded":
                    a.ba =
                        e.getDuration();
                    a.M = !1;
                    cJ() && (d = a.H, c = a.Qa, d.j.set(WO(e), a.P), VP(d) && UP(d, "loaded", WO(e), c));
                    b = new GQ(b, e, f);
                    break;
                case "start":
                    a.Z.set(c.adId, c.companions);
                    a.g.Ub() != null && (a.l == null ? (a.l = new cO, a.U.listen(a.l, "click", a.Vg)) : gO(a.l), eO(a.l, a.g.Ub()));
                    b = new GQ(b, e);
                    break;
                case "complete":
                    a.l != null && gO(a.l);
                    cJ() && XP(a.H, a.P, WO(e));
                    a.j = null;
                    a.Z.delete(c.adId);
                    b = new GQ(b, e);
                    break;
                case "log":
                    c = null;
                    d != null && d.type != null ? (f = d.type, f = f === "adLoadError" || f === "adPlayError") : f = !1;
                    f && (c = {
                        adError: new CQ(d)
                    });
                    b = new GQ(b, e, c);
                    break;
                case "interaction":
                    b = new GQ(b, e, d);
                    break;
                case "adProgress":
                    b = new GQ(b, e, new IQ(c));
                    break;
                default:
                    b = new GQ(b, e)
            }
            a.dispatchEvent(b);
            a.va && a.aa && a.destroy()
        },
        sR = function(a, b) {
            var c = new EQ(new CQ(b));
            a.V ? (a.dispatchEvent(c), cJ() && a.j && XP(a.H, a.P, WO(a.j)), a.j = null) : a.G.j.push(c);
            a = {
                error: b.errorCode,
                vis: Uk(document)
            };
            X.getInstance().report(7, a)
        },
        xR = function(a, b, c) {
            vJ(a.F, "adsManager", b, c)
        },
        vR = function(a, b) {
            X.getInstance().report(131);
            rR(a, b);
            a.Ea() || a.B.start()
        },
        tR = function(a) {
            var b =
                a.g.ca;
            yQ(a.g) && a.A.restoreCustomPlaybackStateOnAdBreakComplete && b.re != null && b.re()
        },
        rR = function(a, b) {
            var c = a.g.ca;
            yQ(a.g) && a.A.restoreCustomPlaybackStateOnAdBreakComplete && c.tc != null ? c.tc(b) : b && b()
        };
    m = Z.prototype;
    m.configureAdsManager = function(a, b) {
        this.C = a;
        a.currentTime != null && (this.B = new JQ(a, this.F), this.B.start());
        b != null && (this.A = yR(b))
    };
    m.init = function(a, b, c, d) {
        if (this.G.isEmpty()) {
            var e = this.g,
                f = null;
            e.j && d == null && (f = {
                vd: "setnull"
            });
            e.j && e.j === d && (f = {
                vd: "match"
            });
            if (e.j && e.j !== d) {
                f = bJ(d || null);
                var g = UD(d || null);
                f = {
                    vd: "diff",
                    oc: e.P,
                    nc: f,
                    oi: e.M,
                    ni: g
                }
            }!e.j && d && (f = {
                vd: "new"
            });
            f && (f.custVid = e.K, X.getInstance().report(93, f));
            d != null && (e.J = xQ(d), aJ(e.J) && (e.H = !0, Ar(e.g), Ar(e.l), Ar(e.ya), e.g = null, e.l = null, e.ya = null, Ar(e.ca), e.ca = new dQ(d), typeof d.getBoundingClientRect !== "function" ? (e.C = e.o, nI.l = e.C) : e.C = d, e.B.uc(e.ca)));
            this.V = !0;
            this.resize(a,
                b, c);
            d = ZO(this.A, this.K);
            e = {};
            a = (e.adsRenderingSettings = d, e.width = a, e.height = b, e.viewMode = c, e);
            xR(this, "init", a)
        } else {
            for (; !this.G.isEmpty();) b = a = this.G, b.g.length === 0 && (b.g = b.j, b.g.reverse(), b.j = []), a = a.g.pop(), this.dispatchEvent(a);
            this.dispose()
        }
    };
    m.isCustomPlaybackUsed = function() {
        return yQ(this.g)
    };
    m.isCustomClickTrackingUsed = function() {
        return this.K
    };
    m.getRemainingTime = function() {
        return this.ba
    };
    m.getAdSkippableState = function() {
        return this.M
    };
    m.discardAdBreak = function() {
        xR(this, "discardAdBreak")
    };
    m.updateAdsRenderingSettings = function(a) {
        if (a != null) {
            a = yR(a);
            var b = this.A.bitrate,
                c = a.bitrate;
            X.getInstance().report(96, {
                init: this.V ? "1" : "0",
                start: this.ka ? "1" : "0",
                old: b,
                "new": c,
                changed: b !== c ? "1" : "0"
            });
            this.A = a;
            a = ZO(this.A, this.K);
            b = {};
            a = (b.adsRenderingSettings = a, b);
            xR(this, "updateAdsRenderingSettings", a)
        }
    };
    m.skip = function() {
        xR(this, "skip")
    };
    m.start = function() {
        if (this.adTagUrl) {
            (wc || zc) && X.getInstance().report(50, {
                customPlayback: yQ(this.g)
            });
            this.g.ua() || X.getInstance().report(26, {
                adtagurl: this.adTagUrl,
                customPlayback: yQ(this.g)
            });
            Pq(this.g.o) && X.getInstance().report(30, {
                adtagurl: this.adTagUrl,
                customPlayback: yQ(this.g)
            });
            var a = this.g.A,
                b = this.g.o,
                c;
            if (c = a && b && !Pq(a)) a = SP(a), b = SP(b), c = a.width > 0 && a.height > 0 && b.width > 0 && b.height > 0 && a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
            b = c;
            X.getInstance().report(31, {
                adtagurl: this.adTagUrl,
                customPlayback: yQ(this.g),
                covers: b
            })
        }
        if (!this.g.ua() && !yQ(this.g)) throw MJ(KJ);
        b = this.g;
        b.G = this.K && b.A != null;
        this.g.B.frameElement.style.opacity = "1";
        if (this.C != null && this.getVolume() === 1) {
            var d, e;
            if (typeof((d = this.C) == null ? void 0 : d.muted) === "boolean" && ((e = this.C) == null ? 0 : e.muted)) this.setVolume(0);
            else {
                var f;
                if (typeof((f = this.C) == null ? void 0 : f.volume) === "number") {
                    var g;
                    d = (g = this.C) == null ? void 0 : g.volume;
                    if (d >= 0 && d <= 1) {
                        var h;
                        this.setVolume((h = this.C) == null ? void 0 : h.volume)
                    }
                }
            }
        }
        this.ka = !0;
        xR(this, "start")
    };
    m.Vg = function() {
        if (!this.A.disableClickThrough && this.j != null) {
            var a = this.j.data.clickThroughUrl;
            a != null && AD(a, this.j.data.attributionParams)
        }
    };
    m.resize = function(a, b, c) {
        var d = this.g,
            e = d.o;
        e != null && (a === -1 ? (e.style.right = "0", e.style.left = "0") : e.style.width = a + "px", b === -1 ? (e.style.bottom = "0", e.style.top = "0") : e.style.height = b + "px");
        e = d.B;
        e.frameElement.width = a === -1 ? "100%" : String(a);
        e.frameElement.height = b === -1 ? "100%" : String(b);
        try {
            e.frameElement.offsetTop = e.frameElement.offsetTop
        } catch (f) {}
        d.size = new Fk(a, b);
        d = {};
        a = (d.width = a, d.height = b, d.viewMode = c, d);
        xR(this, "resize", a)
    };
    m.stop = function() {
        xR(this, "stop")
    };
    m.expand = function() {
        xR(this, "expand")
    };
    m.collapse = function() {
        xR(this, "collapse")
    };
    m.getVolume = function() {
        return this.volume
    };
    m.setVolume = function(a) {
        this.volume = a;
        this.g.ca.setVolume(a);
        var b = {};
        a = (b.volume = a, b);
        xR(this, "volume", a)
    };
    m.pause = function() {
        xR(this, "pause")
    };
    m.resume = function() {
        xR(this, "resume")
    };
    m.destroy = function() {
        this.dispose()
    };
    m.getCuePoints = function() {
        return this.ga
    };
    m.qg = function() {
        return this.j
    };
    m.O = function() {
        xR(this, "destroy");
        this.l != null && this.l.dispose();
        this.U.dispose();
        this.G.clear();
        this.B && (this.B.stop(), this.B.dispose());
        cJ() && XP(this.H, this.P);
        Q.prototype.O.call(this)
    };
    m.eg = function() {
        X.getInstance().report(124, {
            api: "clicked"
        });
        var a = this.j && this.j.data.clickThroughUrl,
            b;
        if (a && ((b = this.j) == null ? 0 : b.Le())) {
            var c;
            AD(a, (c = this.j) == null ? void 0 : c.data.attributionParams)
        }
        xR(this, "click")
    };
    m.focus = function() {
        vJ(this.F, "userInteraction", "focusUiElement")
    };
    var wR = function(a, b) {
        var c = b.gfpCookieUserEnabled;
        b = b.gfpCookieClearData;
        var d = new cR;
        d = wg(d, 1, c ? "0" : "1");
        d = Af(d, 2, re(2147483647));
        d = wg(d, 3, "/");
        d = wg(d, 4, window.location.hostname);
        var e = new mR,
            f, g;
        a = (g = (f = a.Pa) == null ? void 0 : EI(f)) != null ? g : null;
        oR(e, "__gpi_opt_out", d, a);
        if (!c || b) pR(e, "__gads", a), pR(e, "__gpi", a)
    };
    Z.prototype.clicked = Z.prototype.eg;
    Z.prototype.getCurrentAd = Z.prototype.qg;
    Z.prototype.getCuePoints = Z.prototype.getCuePoints;
    Z.prototype.destroy = Z.prototype.destroy;
    Z.prototype.resume = Z.prototype.resume;
    Z.prototype.pause = Z.prototype.pause;
    Z.prototype.setVolume = Z.prototype.setVolume;
    Z.prototype.getVolume = Z.prototype.getVolume;
    Z.prototype.collapse = Z.prototype.collapse;
    Z.prototype.expand = Z.prototype.expand;
    Z.prototype.stop = Z.prototype.stop;
    Z.prototype.resize = Z.prototype.resize;
    Z.prototype.start = Z.prototype.start;
    Z.prototype.skip = Z.prototype.skip;
    Z.prototype.updateAdsRenderingSettings = Z.prototype.updateAdsRenderingSettings;
    Z.prototype.discardAdBreak = Z.prototype.discardAdBreak;
    Z.prototype.getAdSkippableState = Z.prototype.getAdSkippableState;
    Z.prototype.getRemainingTime = Z.prototype.getRemainingTime;
    Z.prototype.isCustomClickTrackingUsed = Z.prototype.isCustomClickTrackingUsed;
    Z.prototype.isCustomPlaybackUsed = Z.prototype.isCustomPlaybackUsed;
    Z.prototype.init = Z.prototype.init;

    function yR(a) {
        if (a instanceof YO) return X.getInstance().report(174, {
            valid: !0
        }), a;
        X.getInstance().report(174, {
            valid: !1
        });
        var b = new YO;
        b.append(a);
        return b
    };
    var zR = {
            ADS_MANAGER_LOADED: "adsManagerLoaded"
        },
        AR = function(a, b) {
            Iv.call(this, "adsManagerLoaded");
            this.g = a;
            this.l = b
        };
    w(AR, Iv);
    AR.prototype.getAdsManager = function(a, b) {
        a = a || {
            currentTime: null
        };
        this.g.configureAdsManager(a, b);
        return this.g
    };
    AR.prototype.getUserRequestContext = function() {
        return this.l
    };
    AR.prototype.getUserRequestContext = AR.prototype.getUserRequestContext;
    AR.prototype.getAdsManager = AR.prototype.getAdsManager;
    z("module$exports$google3$javascript$ads$interactivemedia$sdk$clientside$api$ads_manager_loaded_event.AdsManagerLoadedEvent.Type", zR);
    var BR = function() {
            this.g = window
        },
        CR = function(a, b, c) {
            var d = c.Vd;
            c = c.Wd;
            return hg(b, 8) || (d || !hg(b, 5)) && c || !jR(a.g) ? !1 : !0
        };

    function DR() {
        var a = window,
            b, c;
        return (c = ["pbjs"].concat((b = a._pbjsGlobals) != null ? b : []).map(function(d) {
            return a[d]
        }).find(function(d) {
            return Array.isArray(d == null ? void 0 : d.que)
        })) != null ? c : null
    };

    function ER(a, b) {
        var c, d, e;
        b == null ? e = void 0 : e = b.get.call(b, a);
        return (d = (c = e) != null ? c : b == null ? void 0 : b.get(jj(a))) != null ? d : 0
    };
    var FR = /^v?\d{1,3}(\.\d{1,3}){0,2}(-pre)?$/,
        GR = new Map,
        HR = function(a, b, c) {
            this.pbjs = a;
            this.slot = b;
            var d;
            this.lc = (d = c == null ? void 0 : c.lc) != null ? d : {};
            this.zd = !(c == null || !c.zd);
            var e;
            this.Cd = (e = c == null ? void 0 : c.Cd) != null ? e : new Map;
            var f;
            this.Ue = (f = c == null ? void 0 : c.Ue) != null ? f : new Map;
            var g;
            this.we = (g = c == null ? void 0 : c.we) != null ? g : new xx;
            this.Re = c == null ? void 0 : c.Re;
            this.g = c
        },
        KR = function(a, b, c) {
            var d = a.pbjs.getBidResponsesForAdUnitCode;
            if (d) {
                var e, f, g, h, k, l = (k = (e = d((g = a.slot.Sb) != null ? g : "")) == null ? void 0 :
                    e.bids) != null ? k : (f = d((h = a.slot.adUnitCode) != null ? h : "")) == null ? void 0 : f.bids;
                if (l != null && l.length && (e = l.filter(function(q) {
                        var t = q.auctionId;
                        var u = q.adId;
                        return t !== c && Object.values(a.lc).some(function(v) {
                            return v.includes(u)
                        })
                    }), e.length)) {
                    var p, n;
                    d = (p = a.pbjs.adUnits) == null ? void 0 : (n = p.find(function(q) {
                        q = q.code;
                        return q === a.slot.Sb || q === a.slot.adUnitCode
                    })) == null ? void 0 : n.mediaTypes;
                    p = x(e);
                    for (n = p.next(); !n.done; n = p.next()) n = n.value, e = IR(a, n, d), e = zx(b, tx(rg(ux(sx(new rx, n.bidder), 1), 6, !0), e)), JR(a,
                        n.bidder, e), typeof n.timeToRespond === "number" && Af(e, 2, re(Math.round(n.timeToRespond)))
                }
            }
        },
        JR = function(a, b, c) {
            for (var d = []; b && !d.includes(b);) {
                d.unshift(b);
                var e = void 0,
                    f = void 0;
                b = (e = a.pbjs) == null ? void 0 : (f = e.aliasRegistry) == null ? void 0 : f[b]
            }
            Mf(c, 10, d, ye)
        },
        LR = function(a, b, c, d, e) {
            e = a.Ue.get(e != null ? e : function() {
                return null
            });
            (e == null ? void 0 : F(e, 1)) !== 1 && D(c, 5, e);
            Vf(b, nx, 5) !== void 0 || (e ? F(e, 1) === 1 ? Ax(b, e) : Ax(b, qx(ox(px(new nx, a.zd), 1), ER(d, a.Cd))) : Ax(b, ox(px(new nx, a.zd), ER(d, a.Cd) ? 2 : 3)))
        },
        IR = function(a,
            b, c) {
            var d = b.cpm,
                e = b.originalCpm,
                f = b.currency,
                g = b.originalCurrency,
                h = b.dealId,
                k = b.adserverTargeting,
                l = b.bidder,
                p = b.adId,
                n = b.mediaType,
                q = b.height,
                t = b.width,
                u = b.meta,
                v = new lx;
            typeof d === "number" && (Af(v, 2, re(Math.round(d * 1E6))), g && g !== f || (d = Math.round(Number(e) * 1E6), isNaN(d) || d === kg(v, 2) || Af(v, 8, re(d))));
            typeof f === "string" && wg(v, 3, f);
            ["string", "number"].includes(typeof h) && (f = new dx, h = wg(f, 1, String(h)), D(v, 6, h));
            if (typeof k === "object")
                for (h = x(["", "_" + l]), f = h.next(); !f.done; f = h.next()) {
                    d = f.value;
                    f = [];
                    e = x(Object.entries(k));
                    for (g = e.next(); !g.done; g = e.next()) {
                        g = x(g.value);
                        var C = g.next().value;
                        g = g.next().value;
                        C = ("" + C + d).slice(0, 20);
                        var R = void 0;
                        if ((R = a.lc[C]) != null && R.length)
                            if (a.lc[C][0] === String(g)) f.push(C);
                            else {
                                f = [];
                                break
                            }
                    }
                    d = pg(v, 4, Bf());
                    Mf(v, 4, d.concat(f), ye)
                }
            switch (n || "banner") {
                case "banner":
                    xg(v, 5, 1);
                    break;
                case "native":
                    xg(v, 5, 2);
                    break;
                case "video":
                    xg(v, 5, 3);
                    n = new jx;
                    var U;
                    if ((c == null ? void 0 : (U = c.video) == null ? void 0 : U.context) === "adpod") {
                        var da, V = c == null ? void 0 : (da = c.video) == null ? void 0 :
                            da.adPodDurationSec;
                        Af(n, 1, re(V))
                    } else da = c == null ? void 0 : (V = c.video) == null ? void 0 : V.maxduration, Af(n, 1, re(da));
                    var ma;
                    if (typeof(c == null ? void 0 : (ma = c.video) == null ? void 0 : ma.skip) === "number") {
                        var ob;
                        c = !!(c == null ? 0 : (ob = c.video) == null ? 0 : ob.skip);
                        rg(n, 2, c)
                    }
                    var zb;
                    ob = (zb = b.meta) == null ? void 0 : zb.adServerCatId;
                    zb = wg(n, 3, ob);
                    if (typeof k !== "object") k = null;
                    else {
                        var eb, xc;
                        ob = String((xc = (eb = k["hb_pb_cat_dur_" + l]) != null ? eb : k.hb_pb_cat_dur) != null ? xc : "");
                        var Ca, Kc, ia, Ka;
                        eb = String((Ka = (ia = (Kc = (Ca = k["hb_cache_id_" +
                            l]) != null ? Ca : k["hb_uuid_" + l]) != null ? Kc : k.hb_cache_id) != null ? ia : k.hb_uuid) != null ? Ka : "");
                        k = ob && eb ? ob + "_" + eb : eb ? eb : null
                    }
                    wg(zb, 4, k);
                    D(v, 9, n)
            }
            Number.isFinite(q) && Number.isFinite(t) && (k = new hx, t = tg(k, 1, Math.round(t)), q = tg(t, 2, Math.round(q)), D(v, 7, q));
            typeof p === "string" && wg(v, 1, p);
            var Lc, Mc;
            if (((Lc = a.g) == null ? 0 : Lc.Sf) && Array.isArray(u == null ? void 0 : u.advertiserDomains) && (u == null ? 0 : (Mc = u.advertiserDomains[0]) == null ? 0 : Mc.length)) {
                var cf;
                p = u.advertiserDomains[0].substring(0, (cf = a.g) == null ? void 0 : cf.Sf);
                wg(v,
                    10, p)
            }
            if (b.meta && a.g) {
                var pb, ai;
                a.g.Uf && typeof b.meta.agencyId === "string" && ((ai = b.meta.agencyId) == null ? 0 : ai.length) && (pb != null || (pb = new fx), wg(pb, 1, b.meta.agencyId.substring(0, a.g.Uf)));
                var bi;
                a.g.Vf && typeof b.meta.agencyId === "string" && ((bi = b.meta.agencyName) == null ? 0 : bi.length) && (pb != null || (pb = new fx), wg(pb, 2, b.meta.agencyName.substring(0, a.g.Vf)));
                var ci;
                a.g.lg && typeof b.meta.networkId === "string" && ((ci = b.meta.networkId) == null ? 0 : ci.length) && (pb != null || (pb = new fx), wg(pb, 3, b.meta.networkId.substring(0,
                    a.g.lg)));
                var di;
                a.g.mg && typeof b.meta.networkId === "string" && ((di = b.meta.networkName) == null ? 0 : di.length) && (pb != null || (pb = new fx), wg(pb, 4, b.meta.networkName.substring(0, a.g.mg)));
                pb && D(v, 11, pb)
            }
            return v
        },
        MR = function(a, b) {
            var c = new Map,
                d = function(k) {
                    var l = c.get(k);
                    l || (l = {}, c.set(k, l));
                    return l
                },
                e = [];
            a = x(a);
            for (var f = a.next(); !f.done; f = a.next()) {
                f = f.value;
                var g = f.args,
                    h = f.eventType;
                f = f.elapsedTime;
                h === "bidTimeout" && e.push.apply(e, ra(g));
                switch (h) {
                    case "bidRequested":
                        if (g.auctionId !== b) continue;
                        if (!Array.isArray(g.bids)) continue;
                        g = x(g.bids);
                        for (h = g.next(); !h.done; h = g.next())
                            if (h = h.value.bidId) d(h).requestTime = f;
                        break;
                    case "noBid":
                        g.auctionId === b && g.bidId && (d(g.bidId).eh = f)
                }
            }
            d = new Map;
            a = x(c.entries());
            for (f = a.next(); !f.done; f = a.next()) g = x(f.value), f = g.next().value, h = g.next().value, g = h.requestTime, h = h.eh, g && h && d.set(f, {
                latency: h - g,
                Ib: !1
            });
            e = x(e);
            for (a = e.next(); !a.done; a = e.next())
                if (f = a.value, a = f.bidId, f = f.auctionId, a && f === b && (a = d.get(a))) a.Ib = !0;
            return d
        };
    HR.prototype.fetch = function() {
        var a = this,
            b = new Map,
            c, d, e = ((d = (c = this.pbjs) == null ? void 0 : c.getEvents) != null ? d : function() {
                return []
            })();
        d = e.filter(function(ia) {
            var Ka = ia.eventType;
            ia = ia.args;
            return Ka === "auctionEnd" && ia.auctionId
        });
        c = new Ex;
        var f = function(ia) {
                return ia === a.slot.Sb || ia === a.slot.adUnitCode
            },
            g, h, k, l = (k = GR.get(((g = this.slot.Sb) != null ? g : "") + ((h = this.slot.adUnitCode) != null ? h : ""))) != null ? k : 0,
            p;
        g = (p = d.filter(function(ia) {
            var Ka, Lc, Mc;
            return Number((Ka = ia.args) == null ? void 0 : Ka.timestamp) > l &&
                ((Lc = ia.args) == null ? void 0 : (Mc = Lc.adUnitCodes) == null ? void 0 : Mc.find(f))
        })) != null ? p : [];
        if (!g.length) return null;
        var n;
        if (p = (n = g.reduce(function(ia, Ka) {
                return Number(Ka.args.timestamp) > Number(ia.args.timestamp) ? Ka : ia
            })) == null ? void 0 : n.args) {
            g = p.bidderRequests === void 0 ? [] : p.bidderRequests;
            n = p.bidsReceived === void 0 ? [] : p.bidsReceived;
            var q = p.auctionId;
            h = p.timestamp;
            if (q && h != null && g.length) {
                var t, u;
                GR.set(((t = this.slot.Sb) != null ? t : "") + ((u = this.slot.adUnitCode) != null ? u : ""), h);
                t = Fx(c);
                this.pbjs.version &&
                    FR.test(this.pbjs.version) && wg(t, 6, this.pbjs.version);
                var v, C, R, U;
                if ((C = (v = this.pbjs).getConfig) == null ? 0 : (R = C.call(v).cache) == null ? 0 : (U = R.url) == null ? 0 : U.length) {
                    var da, V, ma;
                    Bx(t, (V = (da = this.pbjs).getConfig) == null ? void 0 : (ma = V.call(da).cache) == null ? void 0 : ma.url)
                }
                D(t, 9, this.we);
                v = Qh(function() {
                    return MR(e, q)
                });
                var ob;
                C = x(g);
                U = C.next();
                for (R = {}; !U.done; R = {
                        bidderCode: void 0,
                        gf: void 0
                    }, U = C.next())
                    for (da = U.value, R.bidderCode = da.bidderCode, V = da.bids, U = da.timeout, R.gf = da.src, da = da.auctionStart, V = x(V), ma =
                        V.next(), u = {}; !ma.done; u = {
                            yc: void 0
                        }, ma = V.next())
                        if (d = ma.value, u.yc = d.bidId, k = d.transactionId, g = d.adUnitCode, h = d.getFloor, ma = d.mediaTypes, d = d.ortb2Imp, u.yc && f(g)) {
                            he(xf(t, 3)) != null || (g === this.slot.adUnitCode ? xg(t, 3, 1) : g === this.slot.Sb && xg(t, 3, 2));
                            var zb = void 0,
                                eb = void 0,
                                xc = void 0;
                            ((zb = this.g) == null ? 0 : zb.ug) && gg(t, 11) == null && typeof((eb = d) == null ? void 0 : (xc = eb.ext) == null ? void 0 : xc.gpid) === "string" && (zb = void 0, Cx(t, d.ext.gpid.substring(0, (zb = this.g) == null ? void 0 : zb.ug)));
                            k && (ob != null || (ob = k), gg(t, 4) !=
                                null || wg(t, 4, k), b.has(k) || b.set(k, da));
                            je(xf(t, 8)) == null && Number.isFinite(U) && tg(t, 8, U);
                            d = n.find(function(ia) {
                                return function(Ka) {
                                    return Ka.requestId === ia.yc
                                }
                            }(u));
                            k = zx(t, function(ia) {
                                return function() {
                                    var Ka = sx(new rx, ia.bidderCode);
                                    JR(a, ia.bidderCode, Ka);
                                    switch (ia.gf) {
                                        case null:
                                        case void 0:
                                        case "client":
                                            xg(Ka, 7, 1);
                                            break;
                                        case "s2s":
                                            xg(Ka, 7, 2)
                                    }
                                    return Ka
                                }
                            }(R)());
                            LR(this, t, k, g, h);
                            if (d) {
                                ux(k, 1);
                                typeof d.timeToRespond === "number" && Number.isFinite(d.timeToRespond) && Af(k, 2, re(Math.round(d.timeToRespond)));
                                try {
                                    g = u = void 0, (g = (u = this).Re) == null || g.call(u, d)
                                } catch (ia) {}
                                ma = IR(this, d, ma);
                                tx(k, ma)
                            } else(ma = v().get(u.yc)) && !ma.Ib ? (ux(k, 2), Number.isFinite(ma.latency) && Af(k, 2, re(Math.round(ma.latency)))) : (ma = ux(k, 3), Number.isFinite(U) && Af(ma, 2, re(Math.round(U))))
                        } var Ca, Kc;
                ((Kc = (Ca = this.pbjs).getConfig) == null ? 0 : Kc.call(Ca).useBidCache) && KR(this, t, q);
                return {
                    Fg: c,
                    transactionId: ob,
                    arg: p
                }
            }
        }
    };

    function NR(a, b, c) {
        return (new HR(a, b, c)).fetch()
    };
    var OR = function(a) {
        Q.call(this);
        var b = this,
            c = jI(lI(this.getSettings()));
        c && c.length > 0 && (Gm.reset(), Im(new Mm(c)));
        this.B = new mR;
        this.A = null;
        this.g = a;
        this.F = new Map;
        this.l = this.g.B;
        this.H = new jE(this);
        Cr(this, this.H);
        this.P = new zC(window, {
            timeoutMs: 500
        });
        this.U = new rI(window, {
            timeoutMs: 500
        });
        this.K = new VN;
        YN(this.K);
        a = new OC(window, {
            timeoutMs: 500
        });
        this.M = new CO(a, 500);
        Cr(this, this.M);
        this.G = {};
        nI.g !== 0 ? (this.j = new PP, Cr(this, this.j)) : this.j = QP();
        cJ() && (this.j.init(KP(this.l)), this.C = WP(this.j, this.g.C),
            Br(this, function() {
                var d = b.C;
                b.j.l.delete(d);
                nI.g !== 0 && (J(pv).o[d] = null)
            }))
    };
    w(OR, Q);
    OR.prototype.destroy = function() {
        this.dispose()
    };
    OR.prototype.getVersion = function() {
        return "h.3.679.0"
    };
    OR.prototype.requestAds = function(a, b) {
        var c = this,
            d = [],
            e = null;
        BC(this.P) && d.push(new Promise(function(h) {
            EC(c.P, function(k) {
                e = k;
                h()
            })
        }));
        var f = null;
        vC(this.U.caller) && d.push(new Promise(function(h) {
            sI(c.U, function(k) {
                f = k;
                h()
            })
        }));
        var g = null;
        d.push(EO(this.M).then(function(h) {
            g = h
        }));
        Promise.all(d).then(function() {
            PR(c, a, b, {
                ge: e,
                je: f,
                Ed: g
            })
        })
    };
    var PR = function(a, b, c, d) {
        var e = b.adTagUrl,
            f = "goog_" + Si++;
        a.F.set(f, c || null);
        var g = QR({
                adTagUrl: e,
                ge: d.ge,
                je: d.je,
                Ed: d.Ed
            }),
            h = yI(e, g || {});
        ON(h, function() {
            RR(a, h)
        });
        var k, l = (k = b.adTagUrl) == null ? void 0 : k.includes("GOOGLE_INSTREAM_VIDEO_NONCE"),
            p = DI(h);
        c = SR(a, p, l);
        d = YN(a.K);
        var n = e ? cI(e) : null;
        e = lO().then(function(q) {
            var t = q.serializedConfig;
            var u = q.errorMessage;
            if (t) t = Rx(t);
            else throw Error(u != null ? u : "Unknown PPC error");
            vO(t, n, q.latencyMs);
            return t
        }).catch(function(q) {
            X.getInstance().report(189, {
                message: q.message
            });
            return null
        });
        e = Promise.race([e, Nw(500, null)]);
        Promise.all([c, d, e]).then(function(q) {
            var t = x(q);
            t.next();
            q = t.next().value;
            t = t.next().value;
            var u = {};
            X.getInstance().report(182, (u.aid = !!nI.B, u.aidf = !!a.A, u.hsc = !p && l, u));
            TR(a, f, b, g, h, q, t)
        })
    };
    OR.prototype.getSettings = function() {
        return nI
    };
    OR.prototype.contentComplete = function() {
        vJ(KP(this.l), "adsLoader", "contentComplete")
    };
    var UR = function(a, b, c) {
            b.length !== 0 && (b = PN(b.map(function(d) {
                return {
                    Cc: d
                }
            }), c)) && b.forEach(function(d) {
                d.then(function(e) {
                    e && RR(a, c)
                })
            })
        },
        RR = function(a, b) {
            if (b = aK(NN(b))) a.G.espSignals = b, vJ(KP(a.l), "adsLoader", "signalsRefresh", a.G)
        },
        VR = function(a, b) {
            var c = a.F.get(b);
            a.F.delete(b);
            return c != null ? c : null
        },
        QR = function(a) {
            var b = a.ge,
                c = a.je;
            a = a.Ed;
            var d, e, f, g, h, k, l = {};
            var p = p === void 0 ? y : p;
            return l.gfcLoaded = nj(p.top, "googlefcLoaded"), l.addtlConsent = (d = b == null ? void 0 : b.addtlConsent) != null ? d : null, l.gdprApplies =
                (e = b == null ? void 0 : b.gdprApplies) != null ? e : null, l.tcString = (f = b == null ? void 0 : b.tcString) != null ? f : null, l.uspString = (g = c == null ? void 0 : c.uspString) != null ? g : null, l.gppString = (h = a == null ? void 0 : a.gppString) != null ? h : null, l.gppSid = (k = a == null ? void 0 : a.sid) != null ? k : null, l
        },
        WR = function(a, b) {
            var c = {};
            c.contentMediaUrl = a.g.L;
            c.customClickTrackingProvided = a.g.A != null;
            c.isAmp = gJ();
            a: {
                try {
                    var d = window.top.location.href
                } catch (C) {
                    d = 2;
                    break a
                }
                d = d == null ? 2 : d == window.document.location.href ? 0 : 1
            }
            c.iframeState = d;
            c.imaHostingDomain =
                window.document.domain;
            c.imaHostingPageUrl = window.document.URL;
            c.topAccessiblePageUrl = fJ();
            c.referrer = window.document.referrer;
            c.domLoadTime = a.l.H;
            c.sdkImplLoadTime = a.l.K;
            c.supportsResizing = !yQ(a.g);
            d = Po().location.ancestorOrigins;
            c.topOrigin = d ? d.length > 0 && d[d.length - 1].length < 200 ? d[d.length - 1] : "" : null;
            c.osdId = a.C;
            c.usesCustomVideoPlayback = yQ(a.g);
            c.usesProxyMediaElement = zQ(a.g);
            c.usesInlinePlayback = a.g.J;
            d = a.g.jc;
            a = [];
            var e = "",
                f = "";
            if (d != null) {
                e = d;
                f = !0;
                f = f === void 0 ? !1 : f;
                for (var g = [], h = 0; e && h < 25; ++h) {
                    var k =
                        "";
                    f !== void 0 && f || (k = (k = e.nodeType !== 9 && e.id) ? "/" + k : "");
                    a: {
                        if (e && e.nodeName && e.parentElement) {
                            var l = e.nodeName.toString().toLowerCase();
                            for (var p = e.parentElement.childNodes, n = 0, q = 0; q < p.length; ++q) {
                                var t = p[q];
                                if (t.nodeName && t.nodeName.toString().toLowerCase() === l) {
                                    if (e === t) {
                                        l = "." + n;
                                        break a
                                    }++n
                                }
                            }
                        }
                        l = ""
                    }
                    g.push((e.nodeName && e.nodeName.toString().toLowerCase()) + k + l);
                    e = e.parentElement
                }
                e = g.join();
                if (d) {
                    d = (d = d.ownerDocument) && (d.defaultView || d.parentWindow) || null;
                    f = [];
                    if (d) try {
                        var u = d.parent;
                        for (g = 0; u && u !==
                            d && g < 25; ++g) {
                            var v = u.frames;
                            for (h = 0; h < v.length; ++h)
                                if (d === v[h]) {
                                    f.push(h);
                                    break
                                } d = u;
                            u = d.parent
                        }
                    } catch (C) {}
                    f = f.join()
                } else f = ""
            }
            a.push(e, f);
            if (b != null) {
                for (u = 0; u < pC.length - 1; ++u) a.push(aj(b, pC[u]) || "");
                b = aj(b, "videoad_start_delay");
                u = "";
                b && (b = parseInt(b, 10), u = b < 0 ? "postroll" : b == 0 ? "preroll" : "midroll");
                a.push(u)
            } else
                for (b = 0; b < pC.length; ++b) a.push("");
            return c.videoAdKey = jj(a.join(":")).toString(), c
        },
        YR = function(a, b, c) {
            a = CI(a);
            b = !wO(c, b);
            return {
                Vd: a,
                Wd: b
            }
        },
        ZR = function(a, b, c) {
            var d = EI(a);
            a = YR(a, b, c);
            return CR(new BR,
                d, a)
        },
        $R = function(a, b, c) {
            var d = EI(a);
            a = YR(a, b, c);
            b = new BR;
            if (CR(b, d, {
                    Vd: a.Vd,
                    Wd: a.Wd
                })) {
                var e;
                d = (e = hR("__eoi", b.g)) != null ? e : void 0
            } else d = void 0;
            return d
        },
        aS = function(a, b, c) {
            if (Ob() && mj(window.fetch) && mj(window.AbortController)) try {
                var d = window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname),
                    e = window.document;
                var f = !!(d && "browsingTopics" in e && e.browsingTopics instanceof Function && xn("browsing-topics", e));
                if (a.j) {
                    var g = zI(a, "rdp");
                    var h = wI(g) ? "1" : ""
                } else h = "";
                d = h === "1";
                var k, l = zI(a, "us_privacy"),
                    p = a.g.uspString || l || "";
                p = p.toUpperCase();
                l = p;
                if (l.length == 4 && (l.indexOf("-") == -1 || l.substring(1) === "---") && l[0] >= "1" && l[0] <= "9" && jy.hasOwnProperty(l[1]) && jy.hasOwnProperty(l[2]) && jy.hasOwnProperty(l[3])) {
                    var n = new iy;
                    var q = ug(n, 1, parseInt(p[0], 10));
                    var t = G(q, 2, jy[p[1]]);
                    var u = G(t, 3, jy[p[2]]);
                    var v = G(u, 4, jy[p[3]])
                } else v = null;
                var C = v;
                var R;
                if (!(R = (C == null ? void 0 : F(C, 3)) === 2 || FI(a)))
                    if (AI(a)) {
                        var U = BI(a);
                        R = U ? !IC(U, ["3", "4"], 0) : !0
                    } else R = !1;
                if (!(k = R)) {
                    var da = zI(a, "npa"),
                        V =
                        wI(da);
                    k = (a.j && V ? "1" : "") === "1"
                }
                var ma;
                if (!(ma = k || d || DI(a))) {
                    if (a.j) {
                        var ob = zI(a, "tfcd");
                        var zb = ob === "0" || ob === "false" ? (0).toString() : wI(ob) ? (1).toString() : ""
                    } else zb = "";
                    var eb;
                    if (!(eb = zb === (1).toString())) {
                        if (a.j) {
                            var xc = zI(a, "tfua");
                            var Ca = xc === "0" || xc === "false" ? (0).toString() : wI(xc) ? (1).toString() : ""
                        } else Ca = "";
                        eb = Ca === (1).toString()
                    }
                    ma = eb
                }
                a = !ma;
                if (c && b) {
                    var Kc, ia, Ka;
                    var Lc = (Ka = (Kc = Xf(c, Lx, 4)) == null ? void 0 : (ia = Jf(Kc, 1, De)) == null ? void 0 : ia.get(b)) != null ? Ka : !0
                } else Lc = !0;
                return f && a && Lc
            } catch (cf) {
                var Mc;
                X.getInstance().report(209, {
                    message: (Mc = cf) == null ? void 0 : Mc.message
                })
            }
            return !1
        },
        SR = function(a, b, c) {
            if (b) return a.A = null, Promise.resolve([]);
            b = [];
            b.push(bS());
            c && b.push(cS(a));
            return Promise.all(b)
        },
        TR = function(a, b, c, d, e, f, g) {
            c = dS(a, c, d, e, f, g);
            b = KP(a.l, b);
            a.H.listen(b, "adsLoader", function(h) {
                var k = h.messageType;
                switch (k) {
                    case "adsLoaded":
                        k = h.na;
                        h = h.sc;
                        k = new Z(a.j, a.g, k.adTagUrl || "", k.adCuePoints, a.C, k.isCustomClickTrackingAllowed, KP(a.l, h), e);
                        a.dispatchEvent(new AR(k, VR(a, h)));
                        break;
                    case "error":
                        k =
                            h.na;
                        a.dispatchEvent(new EQ(new CQ(k), VR(a, h.sc)));
                        h = {
                            error: k.errorCode,
                            vis: Uk(document)
                        };
                        X.getInstance().report(7, h);
                        break;
                    case "cookieUpdate":
                        h = h.na;
                        if (h == null) break;
                        if (nI.isCookiesEnabled()) {
                            k = new tI;
                            k = rg(k, 5, !0);
                            var l = h.gfpCookie;
                            l && oR(a.B, "__gads", dR(l), k);
                            (l = h.gfpCookieV2) && oR(a.B, "__gpi", dR(l), k)
                        }
                        if (l = h.eoidCookie) {
                            k = new BR;
                            l = dR(l);
                            var p = kg(l, 2) - Date.now() / 1E3;
                            p = {
                                Qc: Math.max(p, 0),
                                path: E(l, 3),
                                domain: E(l, 4),
                                ed: !1
                            };
                            lR("__eoi", l.getValue(), p, k.g)
                        }
                        UR(a, h.encryptedSignalBidderIds || [], e);
                        break;
                    case "trackingUrlPinged":
                        a.dispatchEvent(new GQ(k,
                            null, h.na))
                }
            });
            vJ(b, "adsLoader", "requestAds", c);
            b = {};
            X.getInstance().report(155, (b.ws = UN(), b.blob = f != null ? f : "undef", b))
        },
        cS = function(a) {
            var b;
            return La(function(c) {
                if (c.g == 1) return a.A || (a.A = new rJ, sJ(a.A)), Aa(c, a.A.getId(), 2);
                b = c.j;
                nI.B = b.id || "";
                c.g = 0
            })
        },
        bS = function() {
            return Ob() && (Dm(en) || Dm(dn)) ? Dm(dn) ? new Promise(function(a) {
                setTimeout(function() {
                    a()
                }, 50)
            }) : eS().then(function(a) {
                var b, c = (b = a.label) != null ? b : "";
                nI.J = c;
                nI.H = a.status
            }) : Promise.resolve()
        },
        eS = function() {
            if (navigator.cookieDeprecationLabel) {
                var a =
                    navigator.cookieDeprecationLabel.getValue().then(function(c) {
                        return {
                            label: c,
                            status: 1
                        }
                    }).catch(function() {
                        return {
                            label: "",
                            status: 2
                        }
                    }),
                    b = new Promise(function(c) {
                        setTimeout(function() {
                            c({
                                label: "",
                                status: 5
                            })
                        }, 50)
                    });
                return Promise.race([b, a])
            }
            return Promise.resolve({
                label: "",
                status: 3
            })
        },
        dS = function(a, b, c, d, e, f) {
            var g = {};
            g = (g.limaExperimentIds = Hm().sort().join(","), g);
            var h = qj(),
                k = un(),
                l = {};
            k = (l.experimentStateProto = Ag(k), l);
            l = mI(a.getSettings(), VP(a.j));
            var p = WR(a, b.adTagUrl),
                n = yn(),
                q = {};
            c = (q.consentSettings =
                c, q.imalibExperiments = g, q.genotypeExperimentData = k, q.settings = l, q.videoEnvironment = p, q.isFledgeEligible = n, q.pvsid = h, q);
            Object.assign(c, fS(b));
            nI.isCookiesEnabled() && (g = EI(d), c.isBrowserCookieEnabled = nR(a.B, g), h = g ? gR("__gads", g, a.B.g) : null, h !== null && (c.gfpCookieValue = h), h = g ? gR("__gpi", g, a.B.g) : null, h !== null && (c.gfpCookieV2Id = h), g = g ? gR("__gpi_opt_out", g, a.B.g) : null, g !== null && (c.gfpCookieV2OptOut = g));
            g = b.adTagUrl ? cI(b.adTagUrl) : null;
            h = ZR(d, g, f);
            c.eoidCookieEnabled = h;
            (h = $R(d, g, f)) && (c.eoidCookieValue =
                h);
            c.ivtDetectionOnlyStorageAllowed = zO(d, f, g);
            if (h = aK(NN(d))) a.G.espSignals = h, c.espSignals = h;
            e && (c.gmaSignals = e);
            c.isEapLoader = !1;
            if (Dm(hn) || Rn(iC)) {
                e = function(V) {
                    X.getInstance().report(195, {
                        message: V == null ? void 0 : V.message
                    })
                };
                try {
                    var t = DR();
                    if (t) {
                        var u = dI(b.adTagUrl, e);
                        if (u && (Dm(hn) || xO(f, bI(u)))) {
                            var v, C = (v = NR(t, {
                                adUnitCode: u
                            }, {
                                lc: eI(b.adTagUrl)
                            })) == null ? void 0 : v.Fg;
                            c.clientBidsProto = C ? Rc(C.g(), 3) : void 0
                        }
                    }
                } catch (V) {
                    e(V)
                }
            }
            try {
                var R = yO(f);
                R && (c.publisherInitiatedExperimentDataProto = Rc(uO(R), 3))
            } catch (V) {
                var U;
                X.getInstance().report(214, {
                    message: (U = V) == null ? void 0 : U.message
                })
            }
            c.topicsEnabled = aS(d, g, f);
            try {
                c.quicksilverSignals = Ag(HJ(a.g))
            } catch (V) {
                var da;
                X.getInstance().report(212, {
                    message: (da = V) == null ? void 0 : da.message
                }, !0)
            }
            return c
        };
    OR.prototype.contentComplete = OR.prototype.contentComplete;
    OR.prototype.getSettings = OR.prototype.getSettings;
    OR.prototype.requestAds = OR.prototype.requestAds;
    OR.prototype.getVersion = OR.prototype.getVersion;
    OR.prototype.destroy = OR.prototype.destroy;
    var gS = function() {
            this.l = this.j = "unknown";
            this.g = "0";
            this.adsResponse = null;
            this.adTagUrl = "";
            this.contentTitle = this.contentKeywords = this.contentDuration = null;
            this.forceNonLinearFullSlot = !1;
            this.nonLinearAdSlotWidth = this.nonLinearAdSlotHeight = this.liveStreamPrefetchSeconds = this.linearAdSlotWidth = this.linearAdSlotHeight = 0;
            this.omidAccessModeRules = {};
            this.pageUrl = null;
            this.vastLoadTimeout = 5E3
        },
        fS = function(a) {
            var b = {};
            b.adsResponse = a.adsResponse;
            b.videoPlayActivation = a.j;
            b.videoPlayMuted = a.l;
            b.videoContinuousPlay =
                a.g;
            b.adTagUrl = a.adTagUrl;
            b.contentDuration = a.contentDuration;
            b.contentKeywords = a.contentKeywords;
            b.contentTitle = a.contentTitle;
            b.linearAdSlotWidth = a.linearAdSlotWidth;
            b.linearAdSlotHeight = a.linearAdSlotHeight;
            b.nonLinearAdSlotWidth = a.nonLinearAdSlotWidth;
            b.nonLinearAdSlotHeight = a.nonLinearAdSlotHeight;
            b.forceNonLinearFullSlot = a.forceNonLinearFullSlot;
            b.liveStreamPrefetchSeconds = a.liveStreamPrefetchSeconds;
            b.vastLoadTimeout = a.vastLoadTimeout;
            b.omidAccessModeRules = a.omidAccessModeRules;
            b.pageUrl = a.pageUrl;
            return b
        };
    gS.prototype.setAdWillAutoPlay = function(a) {
        this.j = a ? "auto" : "click"
    };
    gS.prototype.setAdWillPlayMuted = function(a) {
        this.l = a ? "muted" : "unmuted"
    };
    gS.prototype.setContinuousPlayback = function(a) {
        this.g = a ? "2" : "1"
    };
    gS.prototype.setContinuousPlayback = gS.prototype.setContinuousPlayback;
    gS.prototype.setAdWillPlayMuted = gS.prototype.setAdWillPlayMuted;
    gS.prototype.setAdWillAutoPlay = gS.prototype.setAdWillAutoPlay;
    z("google.ima.AdCuePoints.POSTROLL", -1, window);
    z("google.ima.AdCuePoints.PREROLL", 0, window);
    z("google.ima.AdDisplayContainer", AQ, window);
    z("google.ima.AdError.ErrorCode", S, window);
    z("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_USED", -1, window);
    z("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_REQUIRED", -1, window);
    z("google.ima.AdError.ErrorCode.VAST_MEDIA_ERROR", -1, window);
    z("google.ima.AdError.ErrorCode.ADSLOT_NOT_VISIBLE", -1, window);
    z("google.ima.AdError.ErrorCode.OVERLAY_AD_LOADING_FAILED", -1, window);
    z("google.ima.AdError.ErrorCode.VAST_MALFORMED_RESPONSE", -1, window);
    z("google.ima.AdError.ErrorCode.COMPANION_AD_LOADING_FAILED", -1, window);
    z("google.ima.AdError.Type", BQ, window);
    z("google.ima.AdErrorEvent.Type", DQ, window);
    z("google.ima.AdEvent.Type", FQ, window);
    z("google.ima.AdsLoader", OR, window);
    z("google.ima.AdsManagerLoadedEvent.Type", zR, window);
    z("google.ima.CompanionAdSelectionSettings", AJ, window);
    z("google.ima.CompanionAdSelectionSettings.CreativeType", xJ);
    z("google.ima.CompanionAdSelectionSettings.ResourceType", yJ);
    z("google.ima.CompanionAdSelectionSettings.SizeCriteria", zJ);
    z("google.ima.CustomContentLoadedEvent.Type.CUSTOM_CONTENT_LOADED", "deprecated-event", window);
    z("ima.ImaSdkSettings", T, window);
    z("google.ima.settings", nI, window);
    z("google.ima.ImaSdkSettings.CompanionBackfillMode", {
        ALWAYS: "always",
        ON_MASTER_AD: "on_master_ad"
    });
    z("google.ima.ImaSdkSettings.VpaidMode", {
        DISABLED: 0,
        ENABLED: 1,
        INSECURE: 2,
        0: "DISABLED",
        1: "ENABLED",
        2: "INSECURE"
    });
    z("google.ima.AdsRenderingSettings", YO, window);
    z("google.ima.AdsRenderingSettings.AUTO_SCALE", -1, window);
    z("google.ima.AdsRequest", gS, window);
    z("google.ima.VERSION", "3.679.0");
    z("google.ima.OmidAccessMode", {
        LIMITED: "limited",
        DOMAIN: "domain",
        FULL: "full"
    });
    z("google.ima.OmidVerificationVendor", {
        COMSCORE: 7,
        DOUBLEVERIFY: 3,
        GOOGLE: 9,
        INTEGRAL_AD_SCIENCE: 4,
        MEETRICS: 8,
        MOAT: 2,
        NIELSEN: 6,
        PIXELATE: 5,
        OTHER: 1,
        7: "COMSCORE",
        3: "DOUBLEVERIFY",
        9: "GOOGLE",
        4: "INTEGRAL_AD_SCIENCE",
        8: "MEETRICS",
        2: "MOAT",
        6: "NIELSEN",
        5: "PIXELATE",
        1: "OTHER"
    });
    z("google.ima.UiElements", {
        AD_ATTRIBUTION: "adAttribution",
        COUNTDOWN: "countdown"
    });
    z("google.ima.ViewMode", {
        NORMAL: "normal",
        FULLSCREEN: "fullscreen"
    });
    z("google.ima.secureSignals", {
        clearAllCache: function() {
            ZJ(window.localStorage)
        }
    });
    var hS = function(a, b, c) {
            this.j = c;
            b.length === 0 && (b = [
                []
            ]);
            this.g = b.map(function(d) {
                d = a.concat(d);
                for (var e = [], f = 0, g = 0; f < d.length;) {
                    var h = d[f++];
                    if (h < 128) e[g++] = String.fromCharCode(h);
                    else if (h > 191 && h < 224) {
                        var k = d[f++];
                        e[g++] = String.fromCharCode((h & 31) << 6 | k & 63)
                    } else if (h > 239 && h < 365) {
                        k = d[f++];
                        var l = d[f++],
                            p = d[f++];
                        h = ((h & 7) << 18 | (k & 63) << 12 | (l & 63) << 6 | p & 63) - 65536;
                        e[g++] = String.fromCharCode(55296 + (h >> 10));
                        e[g++] = String.fromCharCode(56320 + (h & 1023))
                    } else k = d[f++], l = d[f++], e[g++] = String.fromCharCode((h & 15) << 12 |
                        (k & 63) << 6 | l & 63)
                }
                return new RegExp(e.join(""))
            })
        },
        iS = function(a, b) {
            return b ? a.g.some(function(c) {
                c = b.match(c);
                return c == null ? !1 : !a.j || c.length >= 1 && c[1] === "3.679.0" || c.length >= 2 && c[2] === "3.679.0" ? !0 : !1
            }) : !1
        },
        jS = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 106, 115, 47, 40, 115, 100, 107, 108, 111, 97, 100, 101, 114, 124, 99, 111, 114, 101, 41, 47],
        kS = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 115, 48, 92, 46, 50, 109, 100,
            110, 92, 46, 110, 101, 116, 47, 105, 110, 115, 116, 114, 101, 97, 109, 47, 104, 116, 109, 108, 53, 47
        ],
        lS = [94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 112, 97, 108, 47, 115, 100, 107, 108, 111, 97, 100, 101, 114, 47],
        mS = [
            [105, 109, 97, 51, 92, 46, 106, 115],
            [105, 109, 97, 51, 95, 100, 101, 98, 117, 103, 92, 46, 106, 115],
            [105, 109, 97, 51, 95, 101, 97, 112, 46, 106, 115]
        ],
        nS = [
            [98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 40, 91, 97,
                45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108
            ],
            [98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
            [98, 114, 105, 100, 103, 101, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108]
        ],
        oS = [
            [111, 117, 116, 115, 116, 114, 101, 97, 109, 92, 46, 106, 115],
            [111, 117, 116, 115, 116, 114, 101, 97, 109, 95, 100, 101,
                98, 117, 103, 92, 46, 106, 115
            ]
        ],
        pS = new hS(jS, mS, !1);
    new hS(jS, nS, !0);
    var qS = new hS(kS, mS, !1);
    new hS(kS, nS, !0);
    var rS = new hS([94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 105, 109, 97, 115, 100, 107, 92, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 92, 46, 99, 111, 109, 47, 112, 114, 101, 114, 101, 108, 101, 97, 115, 101, 47, 106, 115, 47, 91, 48, 45, 57, 93, 43, 46, 91, 48, 45, 57, 46, 93, 43, 47], mS, !1),
        sS = new hS([94, 40, 63, 58, 104, 116, 116, 112, 115, 63, 58, 41, 63, 47, 47, 40, 112, 97, 103, 101, 97, 100, 50, 124, 116, 112, 99, 41, 92, 46, 103, 111, 111, 103, 108, 101, 115, 121, 110, 100, 105, 99, 97, 116, 105, 111, 110, 92, 46, 99, 111, 109, 47, 112, 97, 103, 101, 97, 100, 47, 40, 103, 97, 100, 103,
            101, 116, 115, 124, 106, 115, 41, 47
        ], [], !1);
    new hS(jS, [
        [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
        [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108],
        [100, 97, 105, 95, 105, 102, 114, 97, 109, 101, 40, 95, 40, 91, 97, 45, 122, 48, 45, 57, 93, 41, 123, 50, 44, 51, 125,
            41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108
        ]
    ], !0);
    var tS = new hS(jS, oS, !1),
        uS = new hS(jS, oS, !1);
    new hS(lS, [
        [112, 97, 108, 46, 106, 115]
    ], !1);
    new hS(lS, [
        [99, 97, 115, 116, 95, 112, 97, 108, 46, 106, 115]
    ], !1);
    new hS(lS, [
        [99, 116, 118, 95, 112, 97, 108, 46, 106, 115]
    ], !1);

    function vS(a, b) {
        for (var c = {}, d = 0; d < b.length; c = {
                be: void 0
            }, d++)
            if (c.be = b[d], a.some(function(e) {
                    return function(f) {
                        return iS(f, e.be.src)
                    }
                }(c))) return c.be;
        return null
    };
    if (! function(a) {
            if (a.some(function(c) {
                    return iS(c, Po().location.href)
                })) return !0;
            var b = vS(a, document.querySelectorAll("SCRIPT"));
            b == null && document.querySelectorAll && (b = vS(a, document.querySelectorAll("script")));
            return b != null
        }([pS, rS, qS, sS, tS, uS])) throw Error("IMA SDK is either not loaded from a google domain or is not a supported version.");
    var mO = kO,
        rO = {
            pageUrl: fJ()
        };
    try {
        var nO = qO();
        if (!nO) throw Error("Could not generate config URL");
        pO()
    } catch (a) {
        oO(mO, a)
    };
})();
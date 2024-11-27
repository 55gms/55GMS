var rough = function() {
    function t(t, e, s) {
        if (t && t.length) {
            const [n, o] = e, a = Math.PI / 180 * s, r = Math.cos(a), h = Math.sin(a);
            t.forEach(t => {
                const [e, s] = t;
                t[0] = (e - n) * r - (s - o) * h + n, t[1] = (e - n) * h + (s - o) * r + o
            })
        }
    }

    function e(t) {
        const e = t[0],
            s = t[1];
        return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2))
    }

    function s(t, e, s, n) {
        const o = e[1] - t[1],
            a = t[0] - e[0],
            r = o * t[0] + a * t[1],
            h = n[1] - s[1],
            i = s[0] - n[0],
            c = h * s[0] + i * s[1],
            l = o * i - h * a;
        return l ? [(i * r - a * c) / l, (o * c - h * r) / l] : null
    }

    function n(t, e, s) {
        const n = t.length;
        if (n < 3) return !1;
        const h = [Number.MAX_SAFE_INTEGER, s],
            i = [e, s];
        let c = 0;
        for (let e = 0; e < n; e++) {
            const s = t[e],
                l = t[(e + 1) % n];
            if (r(s, l, i, h)) {
                if (0 === a(s, i, l)) return o(s, i, l);
                c++
            }
        }
        return c % 2 == 1
    }

    function o(t, e, s) {
        return e[0] <= Math.max(t[0], s[0]) && e[0] >= Math.min(t[0], s[0]) && e[1] <= Math.max(t[1], s[1]) && e[1] >= Math.min(t[1], s[1])
    }

    function a(t, e, s) {
        const n = (e[1] - t[1]) * (s[0] - e[0]) - (e[0] - t[0]) * (s[1] - e[1]);
        return 0 === n ? 0 : n > 0 ? 1 : 2
    }

    function r(t, e, s, n) {
        const r = a(t, e, s),
            h = a(t, e, n),
            i = a(s, n, t),
            c = a(s, n, e);
        return r !== h && i !== c || (!(0 !== r || !o(t, s, e)) || (!(0 !== h || !o(t, n, e)) || (!(0 !== i || !o(s, t, n)) || !(0 !== c || !o(s, e, n)))))
    }

    function h(e, s) {
        const n = [0, 0],
            o = Math.round(s.hachureAngle + 90);
        o && t(e, n, o);
        const a = function(t, e) {
            const s = [...t];
            s[0].join(",") !== s[s.length - 1].join(",") && s.push([s[0][0], s[0][1]]);
            const n = [];
            if (s && s.length > 2) {
                let t = e.hachureGap;
                t < 0 && (t = 4 * e.strokeWidth), t = Math.max(t, .1);
                const o = [];
                for (let t = 0; t < s.length - 1; t++) {
                    const e = s[t],
                        n = s[t + 1];
                    if (e[1] !== n[1]) {
                        const t = Math.min(e[1], n[1]);
                        o.push({
                            ymin: t,
                            ymax: Math.max(e[1], n[1]),
                            x: t === e[1] ? e[0] : n[0],
                            islope: (n[0] - e[0]) / (n[1] - e[1])
                        })
                    }
                }
                if (o.sort((t, e) => t.ymin < e.ymin ? -1 : t.ymin > e.ymin ? 1 : t.x < e.x ? -1 : t.x > e.x ? 1 : t.ymax === e.ymax ? 0 : (t.ymax - e.ymax) / Math.abs(t.ymax - e.ymax)), !o.length) return n;
                let a = [],
                    r = o[0].ymin;
                for (; a.length || o.length;) {
                    if (o.length) {
                        let t = -1;
                        for (let e = 0; e < o.length && !(o[e].ymin > r); e++) t = e;
                        o.splice(0, t + 1).forEach(t => {
                            a.push({
                                s: r,
                                edge: t
                            })
                        })
                    }
                    if (a = a.filter(t => !(t.edge.ymax <= r)), a.sort((t, e) => t.edge.x === e.edge.x ? 0 : (t.edge.x - e.edge.x) / Math.abs(t.edge.x - e.edge.x)), a.length > 1)
                        for (let t = 0; t < a.length; t += 2) {
                            const e = t + 1;
                            if (e >= a.length) break;
                            const s = a[t].edge,
                                o = a[e].edge;
                            n.push([
                                [Math.round(s.x), r],
                                [Math.round(o.x), r]
                            ])
                        }
                    r += t, a.forEach(e => {
                        e.edge.x = e.edge.x + t * e.edge.islope
                    })
                }
            }
            return n
        }(e, s);
        return o && (t(e, n, -o), function(e, s, n) {
            const o = [];
            e.forEach(t => o.push(...t)), t(o, s, n)
        }(a, n, -o)), a
    }
    class i {
        constructor(t) {
            this.helper = t
        }
        fillPolygon(t, e) {
            return this._fillPolygon(t, e)
        }
        _fillPolygon(t, e, s = !1) {
            let n = h(t, e);
            if (s) {
                const e = this.connectingLines(t, n);
                n = n.concat(e)
            }
            return {
                type: "fillSketch",
                ops: this.renderLines(n, e)
            }
        }
        renderLines(t, e) {
            const s = [];
            for (const n of t) s.push(...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], e));
            return s
        }
        connectingLines(t, s) {
            const n = [];
            if (s.length > 1)
                for (let o = 1; o < s.length; o++) {
                    const a = s[o - 1];
                    if (e(a) < 3) continue;
                    const r = [s[o][0], a[1]];
                    if (e(r) > 3) {
                        const e = this.splitOnIntersections(t, r);
                        n.push(...e)
                    }
                }
            return n
        }
        midPointInPolygon(t, e) {
            return n(t, (e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2)
        }
        splitOnIntersections(t, o) {
            const a = Math.max(5, .1 * e(o)),
                h = [];
            for (let n = 0; n < t.length; n++) {
                const i = t[n],
                    c = t[(n + 1) % t.length];
                if (r(i, c, ...o)) {
                    const t = s(i, c, o[0], o[1]);
                    if (t) {
                        const s = e([t, o[0]]),
                            n = e([t, o[1]]);
                        s > a && n > a && h.push({
                            point: t,
                            distance: s
                        })
                    }
                }
            }
            if (h.length > 1) {
                const e = h.sort((t, e) => t.distance - e.distance).map(t => t.point);
                if (n(t, ...o[0]) || e.shift(), n(t, ...o[1]) || e.pop(), e.length <= 1) return this.midPointInPolygon(t, o) ? [o] : [];
                const s = [o[0], ...e, o[1]],
                    a = [];
                for (let e = 0; e < s.length - 1; e += 2) {
                    const n = [s[e], s[e + 1]];
                    this.midPointInPolygon(t, n) && a.push(n)
                }
                return a
            }
            return this.midPointInPolygon(t, o) ? [o] : []
        }
    }
    class c extends i {
        fillPolygon(t, e) {
            return this._fillPolygon(t, e, !0)
        }
    }

    class u {
        constructor(t) {
            this.helper = t
        }
        fillPolygon(t, e) {
            const s = h(t, e = Object.assign({}, e, {
                curveStepCount: 4,
                hachureAngle: 0,
                roughness: 1
            }));
            return this.dotsOnLines(s, e)
        }
        dotsOnLines(t, s) {
            const n = [];
            let o = s.hachureGap;
            o < 0 && (o = 4 * s.strokeWidth), o = Math.max(o, .1);
            let a = s.fillWeight;
            a < 0 && (a = s.strokeWidth / 2);
            const r = o / 4;
            for (const h of t) {
                const t = e(h),
                    i = t / o,
                    c = Math.ceil(i) - 1,
                    l = t - c * o,
                    u = (h[0][0] + h[1][0]) / 2 - o / 4,
                    f = Math.min(h[0][1], h[1][1]);
                for (let t = 0; t < c; t++) {
                    const e = f + l + t * o,
                        h = this.helper.randOffsetWithRange(u - r, u + r, s),
                        i = this.helper.randOffsetWithRange(e - r, e + r, s),
                        c = this.helper.ellipse(h, i, a, a, s);
                    n.push(...c.ops)
                }
            }
            return {
                type: "fillSketch",
                ops: n
            }
        }
    }

    const d = {};
    class g {
        constructor(t) {
            this.seed = t
        }
        next() {
            return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random()
        }
    }

    const x = {
        randOffset: function(t, e) {
            return W(t, e)
        },
        randOffsetWithRange: function(t, e, s) {
            return E(t, e, s)
        },
        ellipse: function(t, e, s, n, o) {
            const a = T(s, n, o);
            return I(t, e, o, a).opset
        },
        doubleLineOps: function(t, e, s, n, o) {
            return z(t, e, s, n, o, !0)
        }
    };

    function v(t, e, s, n, o) {
        return {
            type: "path",
            ops: z(t, e, s, n, o)
        }
    }

    function O(t, e, s) {
        const n = (t || []).length;
        if (n > 2) {
            const o = [];
            for (let e = 0; e < n - 1; e++) o.push(...z(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
            return e && o.push(...z(t[n - 1][0], t[n - 1][1], t[0][0], t[0][1], s)), {
                type: "path",
                ops: o
            }
        }
        return 2 === n ? v(t[0][0], t[0][1], t[1][0], t[1][1], s) : {
            type: "path",
            ops: []
        }
    }

    function S(t, e, s, n, o) {
        return function(t, e) {
            return O(t, !0, e)
        }([
            [t, e],
            [t + s, e],
            [t + s, e + n],
            [t, e + n]
        ], o)
    }

    function T(t, e, s) {
        const n = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(t / 2, 2) + Math.pow(e / 2, 2)) / 2)),
            o = Math.max(s.curveStepCount, s.curveStepCount / Math.sqrt(200) * n),
            a = 2 * Math.PI / o;
        let r = Math.abs(t / 2),
            h = Math.abs(e / 2);
        const i = 1 - s.curveFitting;
        return r += W(r * i, s), h += W(h * i, s), {
            increment: a,
            rx: r,
            ry: h
        }
    }

    function I(t, e, s, n) {
        const [o, a] = q(n.increment, t, e, n.rx, n.ry, 1, n.increment * E(.1, E(.4, 1, s), s), s);
        let r = G(o, null, s);
        if (!s.disableMultiStroke) {
            const [o] = q(n.increment, t, e, n.rx, n.ry, 1.5, 0, s), a = G(o, null, s);
            r = r.concat(a)
        }
        return {
            estimatedPoints: a,
            opset: {
                type: "path",
                ops: r
            }
        }
    }

    function _(t, e) {
        const s = [];
        if (t.length) {
            const n = e.maxRandomnessOffset || 0,
                o = t.length;
            if (o > 2) {
                s.push({
                    op: "move",
                    data: [t[0][0] + W(n, e), t[0][1] + W(n, e)]
                });
                for (let a = 1; a < o; a++) s.push({
                    op: "lineTo",
                    data: [t[a][0] + W(n, e), t[a][1] + W(n, e)]
                })
            }
        }
        return {
            type: "fillPath",
            ops: s
        }
    }

    function C(t, e) {
        return function(t, e) {
            let s = t.fillStyle || "hachure";
            if (!d[s]) switch (s) {
                case "zigzag":
                    d[s] || (d[s] = new c(e));
                    break;
                /*case "cross-hatch":
                    d[s] || (d[s] = new l(e));
                    break;*/
                case "dots":
                    d[s] || (d[s] = new u(e));
                    break;
                /*case "dashed":
                    d[s] || (d[s] = new f(e));
                    break;*/
                /*case "zigzag-line":
                    d[s] || (d[s] = new p(e));
                    break;*/
                case "hachure":
                default:
                    s = "hachure", d[s] || (d[s] = new i(e))
            }
            return d[s]
        }(e, x).fillPolygon(t, e)
    }

    function D(t) {
        return t.randomizer || (t.randomizer = new g(t.seed || 0)), t.randomizer.next()
    }

    function E(t, e, s, n = 1) {
        return s.roughness * n * (D(s) * (e - t) + t)
    }

    function W(t, e, s = 1) {
        return E(-t, t, e, s)
    }

    function z(t, e, s, n, o, a = !1) {
        const r = a ? o.disableMultiStrokeFill : o.disableMultiStroke,
            h = R(t, e, s, n, o, !0, !1);
        if (r) return h;
        const i = R(t, e, s, n, o, !0, !0);
        return h.concat(i)
    }

    function R(t, e, s, n, o, a, r) {
        const h = Math.pow(t - s, 2) + Math.pow(e - n, 2),
            i = Math.sqrt(h);
        let c = 1;
        //c = i < 200 ? 1 : i > 500 ? .4 : -.0016668 * i + 1.233334;
        let l = o.maxRandomnessOffset || 0;
        l * l * 100 > h && (l = i / 10);
        const u = l / 2,
            f = .2 + .2 * D(o);
        let p = o.bowing * o.maxRandomnessOffset * (n - e) / 200,
            d = o.bowing * o.maxRandomnessOffset * (t - s) / 200;
        p = W(p, o, c), d = W(d, o, c);
        const g = [],
            M = () => W(u, o, c),
            k = () => W(l, o, c);
        return a && (r ? g.push({
            op: "move",
            data: [t + M(), e + M()]
        }) : g.push({
            op: "move",
            data: [t + W(l, o, c), e + W(l, o, c)]
        })), r ? g.push({
            op: "bcurveTo",
            data: [p + t + (s - t) * f + M(), d + e + (n - e) * f + M(), p + t + 2 * (s - t) * f + M(), d + e + 2 * (n - e) * f + M(), s + M(), n + M()]
        }) : g.push({
            op: "bcurveTo",
            data: [p + t + (s - t) * f + k(), d + e + (n - e) * f + k(), p + t + 2 * (s - t) * f + k(), d + e + 2 * (n - e) * f + k(), s + k(), n + k()]
        }), g
    }

    function G(t, e, s) {
        const n = t.length,
            o = [];
        if (n > 3) {
            const a = [],
                r = 1 - s.curveTightness;
            o.push({
                op: "move",
                data: [t[1][0], t[1][1]]
            });
            for (let e = 1; e + 2 < n; e++) {
                const s = t[e];
                a[0] = [s[0], s[1]], a[1] = [s[0] + (r * t[e + 1][0] - r * t[e - 1][0]) / 6, s[1] + (r * t[e + 1][1] - r * t[e - 1][1]) / 6], a[2] = [t[e + 1][0] + (r * t[e][0] - r * t[e + 2][0]) / 6, t[e + 1][1] + (r * t[e][1] - r * t[e + 2][1]) / 6], a[3] = [t[e + 1][0], t[e + 1][1]], o.push({
                    op: "bcurveTo",
                    data: [a[1][0], a[1][1], a[2][0], a[2][1], a[3][0], a[3][1]]
                })
            }
            if (e && 2 === e.length) {
                const t = s.maxRandomnessOffset;
                o.push({
                    op: "lineTo",
                    data: [e[0] + W(t, s), e[1] + W(t, s)]
                })
            }
        } else 3 === n ? (o.push({
            op: "move",
            data: [t[1][0], t[1][1]]
        }), o.push({
            op: "bcurveTo",
            data: [t[1][0], t[1][1], t[2][0], t[2][1], t[2][0], t[2][1]]
        })) : 2 === n && o.push(...z(t[0][0], t[0][1], t[1][0], t[1][1], s));
        return o
    }

    function q(t, e, s, n, o, a, r, h) {
        const i = [],
            c = [],
            l = W(.5, h) - Math.PI / 2;
        c.push([W(a, h) + e + .9 * n * Math.cos(l - t), W(a, h) + s + .9 * o * Math.sin(l - t)]);
        for (let r = l; r < 2 * Math.PI + l - .01; r += t) {
            const t = [W(a, h) + e + n * Math.cos(r), W(a, h) + s + o * Math.sin(r)];
            i.push(t), c.push(t)
        }
        return c.push([W(a, h) + e + n * Math.cos(l + 2 * Math.PI + .5 * r), W(a, h) + s + o * Math.sin(l + 2 * Math.PI + .5 * r)]), c.push([W(a, h) + e + .98 * n * Math.cos(l + r), W(a, h) + s + .98 * o * Math.sin(l + r)]), c.push([W(a, h) + e + .9 * n * Math.cos(l + .5 * r), W(a, h) + s + .9 * o * Math.sin(l + .5 * r)]), [c, i]
    }

    const K = "none";
    class U {
        constructor(t) {
            this.defaultOptions = {
                maxRandomnessOffset: 2,
                roughness: 1,
                bowing: 1,
                stroke: "#000",
                strokeWidth: 1,
                curveTightness: 0,
                curveFitting: .95,
                curveStepCount: 9,
                fillStyle: "hachure",
                fillWeight: -1,
                hachureAngle: -41,
                hachureGap: -1,
                dashOffset: -1,
                dashGap: -1,
                zigzagOffset: -1,
                seed: 0,
                combineNestedSvgPaths: !1,
                disableMultiStroke: !1,
                disableMultiStrokeFill: !1
            }, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options))
        }
        static newSeed() {
            return Math.floor(Math.random() * 2 ** 31)
        }
        _o(t) {
            return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions
        }
        _d(t, e, s) {
            return {
                shape: t,
                sets: e || [],
                options: s || this.defaultOptions
            }
        }
        line(t, e, s, n, o) {
            const a = this._o(o);
            return this._d("line", [v(t, e, s, n, a)], a)
        }
        rectangle(t, e, s, n, o) {
            const a = this._o(o),
                r = [],
                h = S(t, e, s, n, a);
            if (a.fill) {
                const o = [
                    [t, e],
                    [t + s, e],
                    [t + s, e + n],
                    [t, e + n]
                ];
                "solid" === a.fillStyle ? r.push(_(o, a)) : r.push(C(o, a))
            }
            return a.stroke !== K && r.push(h), this._d("rectangle", r, a)
        }
        ellipse(t, e, s, n, o) {
            const a = this._o(o),
                r = [],
                h = T(s, n, a),
                i = I(t, e, a, h);
            if (a.fill)
                if ("solid" === a.fillStyle) {
                    const s = I(t, e, a, h).opset;
                    s.type = "fillPath", r.push(s)
                } else r.push(C(i.estimatedPoints, a));
            return a.stroke !== K && r.push(i.opset), this._d("ellipse", r, a)
        }
        circle(t, e, s, n) {
            const o = this.ellipse(t, e, s, s, n);
            return o.shape = "circle", o
        }
        
        polygon(t, e) {
            const s = this._o(e),
                n = [],
                o = O(t, !0, s);
            return s.fill && ("solid" === s.fillStyle ? n.push(_(t, s)) : n.push(C(t, s))), s.stroke !== K && n.push(o), this._d("polygon", n, s)
        }
    }
    class Y {
        constructor(t, e) {
            this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new U(e)
        }
        draw(t) {
            const e = t.sets || [],
                s = t.options || this.getDefaultOptions(),
                n = this.ctx;
            for (const o of e) switch (o.type) {
                case "path":
                    n.save(), n.strokeStyle = "none" === s.stroke ? "transparent" : s.stroke, n.lineWidth = s.strokeWidth, s.strokeLineDash && n.setLineDash(s.strokeLineDash), s.strokeLineDashOffset && (n.lineDashOffset = s.strokeLineDashOffset), this._drawToContext(n, o), n.restore();
                    break;
                case "fillPath":
                    n.save(), n.fillStyle = s.fill || "";
                    const e = "curve" === t.shape || "polygon" === t.shape ? "evenodd" : "nonzero";
                    this._drawToContext(n, o, e), n.restore();
                    break;
                case "fillSketch":
                    this.fillSketch(n, o, s)
            }
        }
        fillSketch(t, e, s) {
            let n = s.fillWeight;
            n < 0 && (n = s.strokeWidth / 2), t.save(), s.fillLineDash && t.setLineDash(s.fillLineDash), s.fillLineDashOffset && (t.lineDashOffset = s.fillLineDashOffset), t.strokeStyle = s.fill || "", t.lineWidth = n, this._drawToContext(t, e), t.restore()
        }
        _drawToContext(t, e, s = "nonzero") {
            t.beginPath();
            for (const s of e.ops) {
                const e = s.data;
                switch (s.op) {
                    case "move":
                        t.moveTo(e[0], e[1]);
                        break;
                    case "bcurveTo":
                        t.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
                        break;
                    case "lineTo":
                        t.lineTo(e[0], e[1])
                }
            }
            "fillPath" === e.type ? t.fill(s) : t.stroke()
        } /*get generator(){return this.gen}*/
        getDefaultOptions() {
            return this.gen.defaultOptions
        }
        line(t, e, s, n, o) {
            const a = this.gen.line(t, e, s, n, o);
            return this.draw(a), a
        }
        rectangle(t, e, s, n, o) {
            const a = this.gen.rectangle(t, e, s, n, o);
            return this.draw(a), a
        }
        ellipse(t, e, s, n, o) {
            const a = this.gen.ellipse(t, e, s, n, o);
            return this.draw(a), a
        }
        circle(t, e, s, n) {
            const o = this.gen.circle(t, e, s, n);
            return this.draw(o), o
        }
    }
    return {
        canvas: (t, e) => new Y(t, e),
        generator: t => new U(t),
        newSeed: () => U.newSeed()
    }
}();
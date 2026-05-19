! function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var n = t();
        for (var r in n)("object" == typeof exports ? exports : e)[r] = n[r]
    }
}(self, (function() {
    return (() => {
        var e = {
                142: (e, t, n) => {
                    function r(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }
                    n(6059), n(8388);
                    var i = function() {
                        "use strict";
                        return e = function e(t, n, i) {
                            var A = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                                o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : -1;
                            r(this, e), this.id = t, this.name = n, this.completionList = i, this.completed = !1, this.sessionOnly = A, this.completionTime = -1, this.timeLimit = o
                        }, Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e;
                        var e
                    }();
                    e.exports = i
                },
                7668: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function i(e, t, n) {
                        return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                    }
                    n(6059), n(8388);
                    var A = i((function e(t, n, r) {
                        "use strict";
                        ! function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), this.name = t, this.num = n, this.timeLimit = r
                    }));
                    e.exports = A
                },
                6874: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return u(e)
                    }

                    function u(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(5666), n(9730), n(8837), n(4336), n(3369), n(6059), n(2310), n(8838), n(1520), n(9371), n(2139), n(8132), n(8388), n(6253), n(851), n(5767), n(9115), n(6997), n(1181);
                    var l = n(1978),
                        d = n(142),
                        f = n(7668),
                        g = n(3104).ACHIEVEMENT_ERROR,
                        I = n(8090),
                        v = I.STORE_MODULE,
                        h = I.ERROR_MODULE,
                        p = I.LOGGER_MODULE,
                        y = n(8795).$ioc,
                        m = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(S, e);
                            var t, n, r, i, l, d, f, I, m, C, b, w = (C = S, b = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(C);
                                if (b) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function S() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, S), (e = w.call(this))._achievements = [], e._log = [], e._savedCompleted = [], e.init = e.init.bind(u(e)), e.reset = e.reset.bind(u(e)), e.purgeSavedCompletedAchievements = e.purgeSavedCompletedAchievements.bind(u(e)), e.restoreCompletedAchievements = e.restoreCompletedAchievements.bind(u(e)), e.saveCompletedAchievements = e.saveCompletedAchievements.bind(u(e)), e.getSavedCompletedAchievements = e.getSavedCompletedAchievements.bind(u(e)), e.saveLogs = e.saveLogs.bind(u(e)), e.restoreSavedLog = e.restoreSavedLog.bind(u(e)), e.getLog = e.getLog.bind(u(e)), e.purgeLog = e.purgeLog.bind(u(e)), e.notify = e.notify.bind(u(e)), e.checkAchievement = e.checkAchievement.bind(u(e)), e.completeAchievement = e.completeAchievement.bind(u(e)), e.findAchievement = e.findAchievement.bind(u(e)), e.hasAchievement = e.hasAchievement.bind(u(e)), e.addAchievement = e.addAchievement.bind(u(e)), e.getAchievementById = e.getAchievementById.bind(u(e)), e.removeAchievement = e.removeAchievement.bind(u(e)), e.getAchievements = e.getAchievements.bind(u(e)), e
                            }
                            return t = S, n = [{
                                key: "init",
                                value: (m = A(regeneratorRuntime.mark((function e(t) {
                                    var n, r = arguments;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return n = r.length > 1 && void 0 !== r[1] && r[1], this._achievements = [], this._log = [], this._savedCompleted = [], this.isOnFacebook = n, e.next = 7, this.restoreSavedLog();
                                            case 7:
                                                return this.purgeLog(25e3), e.next = 10, this.restoreCompletedAchievements();
                                            case 10:
                                                return e.next = 12, this.purgeSavedCompletedAchievements(t);
                                            case 12:
                                                E();
                                            case 13:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return m.apply(this, arguments)
                                })
                            }, {
                                key: "getStore",
                                value: function() {
                                    return y(v)
                                }
                            }, {
                                key: "reset",
                                value: function() {
                                    this._log = [], this._achievements = [], this._savedCompleted = [], this.saveLogs(), this.saveCompletedAchievements([])
                                }
                            }, {
                                key: "purgeSavedCompletedAchievements",
                                value: (I = A(regeneratorRuntime.mark((function e(t) {
                                    var n = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return this.getCompletedAchievements().filter((function(e) {
                                                    return !0 === e.sessionOnly || e.completionTime <= t - e.timeLimit
                                                })).forEach((function(e) {
                                                    n._achievements.splice(n._achievements.indexOf(e), 1), n._savedCompleted.splice(n._achievements.indexOf(e), 1)
                                                })), e.next = 5, this.saveCompletedAchievements(this.getCompletedAchievements());
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return I.apply(this, arguments)
                                })
                            }, {
                                key: "restoreCompletedAchievements",
                                value: (f = A(regeneratorRuntime.mark((function e() {
                                    var t;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, this.getStore().get("achievementsCompleted");
                                            case 2:
                                                (t = e.sent) && t.achievementsCompleted && t.achievementsCompleted.length > 0 && (this._achievements = t.achievementsCompleted);
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return f.apply(this, arguments)
                                })
                            }, {
                                key: "saveCompletedAchievements",
                                value: (d = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return this._savedCompleted = t, e.next = 3, this.getStore().save("achievementsCompleted", t);
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return d.apply(this, arguments)
                                })
                            }, {
                                key: "getSavedCompletedAchievements",
                                value: function() {
                                    return this._savedCompleted
                                }
                            }, {
                                key: "saveLogs",
                                value: (l = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, this.getStore().save("achievement_logs", this._log);
                                            case 2:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "restoreSavedLog",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    var t;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, this.getStore().get("achievement_logs");
                                            case 2:
                                                return (t = e.sent) && t.achievement_logs && (this._log = t.achievement_logs), this._log.forEach((function(e) {
                                                    return e.session = !1
                                                })), e.next = 7, this.saveLogs();
                                            case 7:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "getLog",
                                value: function() {
                                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1;
                                    return this._log.filter((function(t) {
                                        return -1 === e || t.timestamp >= e
                                    }))
                                }
                            }, {
                                key: "purgeLog",
                                value: function() {
                                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 25e3;
                                    if (this._log.length > e) {
                                        var t = this._log.length - e;
                                        this._log = this._log.splice(t, e)
                                    }
                                }
                            }, {
                                key: "notify",
                                value: function(e, t) {
                                    var n = this;
                                    this._log.push({
                                        eventName: e,
                                        timestamp: t,
                                        session: !0
                                    }), this.saveLogs(), this._achievements.filter((function(e) {
                                        return !1 === e.completed
                                    })).forEach((function(e) {
                                        n.checkAchievement(e, n._log, t)
                                    }))
                                }
                            }, {
                                key: "checkAchievement",
                                value: (r = A(regeneratorRuntime.mark((function e(t, n, r) {
                                    var i;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (i = this.findAchievement(t.name, t.completionList), !(t.completed || null !== i && !0 === i.completed)) {
                                                    e.next = 3;
                                                    break
                                                }
                                                return e.abrupt("return");
                                            case 3:
                                                t.completionList.filter((function(e) {
                                                    var i = r - e.timeLimit;
                                                    return n.filter((function(n) {
                                                        return (!t.sessionOnly || !1 !== n.session) && n.eventName === e.name && n.timestamp >= i
                                                    })).length >= e.num
                                                })).length >= t.completionList.length && this.completeAchievement(t, r);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t, n) {
                                    return r.apply(this, arguments)
                                })
                            }, {
                                key: "completeAchievement",
                                value: function(e, t) {
                                    e.completed = !0, e.completionTime = t;
                                    var n = this.getSavedCompletedAchievements();
                                    try {
                                        n.push(e), this.saveCompletedAchievements(n), y(p).onAchievementComplete(e), this.dispatch("achievementComplete", e)
                                    } catch (e) {
                                        y(h).onError(e, g)
                                    }
                                }
                            }, {
                                key: "findAchievement",
                                value: function(e, t) {
                                    return this._achievements.find((function(n) {
                                        return n.name === e && JSON.stringify(n.completionList) === JSON.stringify(t)
                                    })) || null
                                }
                            }, {
                                key: "hasAchievement",
                                value: function(e, t) {
                                    return null !== this.findAchievement(e, t)
                                }
                            }, {
                                key: "addAchievement",
                                value: function(e) {
                                    this.findAchievement(e.name, e.completionList) || this._achievements.push(e)
                                }
                            }, {
                                key: "getAchievementById",
                                value: function(e) {
                                    return this._achievements.find((function(t) {
                                        return t.id === e
                                    })) || null
                                }
                            }, {
                                key: "removeAchievement",
                                value: function(e) {
                                    var t = this._achievements.indexOf(e);
                                    t > -1 && this._achievements.splice(t, 1)
                                }
                            }, {
                                key: "getAchievements",
                                value: function() {
                                    return this._achievements
                                }
                            }, {
                                key: "getCompletedAchievements",
                                value: function() {
                                    return this.getAchievements().filter((function(e) {
                                        return e.completed
                                    }))
                                }
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), S
                        }(l),
                        C = new m;

                    function E() {
                        [{
                            name: "Tournament_creation",
                            completion: [{
                                eventName: "create_tournament",
                                num: 1
                            }]
                        }, {
                            name: "Tournament_share",
                            completion: [{
                                eventName: "share_tournament",
                                num: 1
                            }]
                        }, {
                            name: "Tournament_join",
                            completion: [{
                                eventName: "join_tournament",
                                num: 1
                            }]
                        }, {
                            name: "2min_playtime",
                            completion: [{
                                eventName: "tick",
                                num: 2
                            }]
                        }, {
                            name: "3min_playtime",
                            completion: [{
                                eventName: "tick",
                                num: 3
                            }]
                        }, {
                            name: "5min_playtime",
                            completion: [{
                                eventName: "tick",
                                num: 5
                            }]
                        }, {
                            name: "10min_playtime",
                            completion: [{
                                eventName: "tick",
                                num: 10
                            }]
                        }, {
                            name: "15min_playtime",
                            completion: [{
                                eventName: "tick",
                                num: 15
                            }]
                        }, {
                            name: "1RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 1
                            }]
                        }, {
                            name: "2RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 2
                            }]
                        }, {
                            name: "3RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 3
                            }]
                        }, {
                            name: "5RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 5
                            }]
                        }, {
                            name: "10RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 10
                            }]
                        }, {
                            name: "15RV_watched",
                            completion: [{
                                eventName: "rv_watched",
                                num: 15
                            }]
                        }, {
                            name: "1FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 1
                            }]
                        }, {
                            name: "2FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 2
                            }]
                        }, {
                            name: "3FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 3
                            }]
                        }, {
                            name: "5FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 5
                            }]
                        }, {
                            name: "10FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 10
                            }]
                        }, {
                            name: "15FS_watched",
                            completion: [{
                                eventName: "fs_watched",
                                num: 15
                            }]
                        }, {
                            name: "1RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 1
                            }]
                        }, {
                            name: "2RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 2
                            }]
                        }, {
                            name: "3RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 3
                            }]
                        }, {
                            name: "5RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 5
                            }]
                        }, {
                            name: "10RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 10
                            }]
                        }, {
                            name: "15RI_watched",
                            completion: [{
                                eventName: "ri_watched",
                                num: 15
                            }]
                        }, {
                            name: "Did_an_IAP",
                            completion: [{
                                eventName: "buy_iap",
                                num: 1
                            }]
                        }].forEach((function(e, t) {
                            var n = 864e5,
                                r = 31536e8,
                                i = e.completion.map((function(e) {
                                    return new f(e.eventName, e.num, n)
                                })),
                                A = e.completion.map((function(e) {
                                    return new f(e.eventName, e.num, r)
                                })),
                                o = new d(t, e.name, i, !0, n),
                                a = new d(t, e.name, i, !1, n),
                                s = new d(t, e.name, A, !1, r);
                            o.name += "_session", a.name += "_24h", s.name += "_lifetime", C.addAchievement(o), C.addAchievement(a), C.addAchievement(s)
                        }))
                    }
                    e.exports = {
                        achievementManager: C,
                        addDefaultAchievements: E
                    }
                },
                5920: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return u(e)
                    }

                    function u(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(5666), n(9730), n(6253), n(851), n(2310), n(2773), n(6059), n(8838), n(1520), n(2139), n(8132), n(8388), n(5767), n(9115), n(6997), n(1181);
                    var l = n(1978),
                        d = n(4602).ADTYPE,
                        f = n(3104).AD_FAILED_ERROR,
                        g = n(8090),
                        I = g.ACHIEVEMENT_MODULE,
                        v = g.ERROR_MODULE,
                        h = g.LOGGER_MODULE,
                        p = n(8795).$ioc,
                        y = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(C, e);
                            var t, n, r, i, l, g, y, m = (g = C, y = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(g);
                                if (y) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function C() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, C), (e = m.call(this)).requestBannerAd = e.requestBannerAd.bind(u(e)), e._lastPreloadedInter = null, e._hasPreloadedInterstitialAd = !1, e.preloadInterstitialAd = e.preloadInterstitialAd.bind(u(e)), e.showPreloadedInterstitialAd = e.showPreloadedInterstitialAd.bind(u(e)), e.requestInterstitialAd = e.requestInterstitialAd.bind(u(e)), e._removeInterstitialAd = e._removeInterstitialAd.bind(u(e)), e._hasInterstitialAd = e._hasInterstitialAd.bind(u(e)), e._lastPreloadedRewarded = null, e._hasPreloadedRewardedAd = !1, e.preloadRewardedAd = e.preloadRewardedAd.bind(u(e)), e.showPreloadedRewardedAd = e.showPreloadedRewardedAd.bind(u(e)), e.requestRewardedAd = e.requestRewardedAd.bind(u(e)), e._removeRewardedAd = e._removeRewardedAd.bind(u(e)), e._hasRewardedAd = e._hasRewardedAd.bind(u(e)), e._lastPreloadedRewardedInterstitial = null, e._hasPreloadedRewardedInterstitialAd = !1, e.preloadRewardedInterstitialAd = e.preloadRewardedInterstitialAd.bind(u(e)), e.showPreloadedRewardedInterstitialAd = e.showPreloadedRewardedInterstitialAd.bind(u(e)), e.requestRewardedInterstitialAd = e.requestRewardedInterstitialAd.bind(u(e)), e._removeRewardedInterstitialAd = e._removeRewardedInterstitialAd.bind(u(e)), e._hasRewardedInterstitialAd = e._hasRewardedInterstitialAd.bind(u(e)), e._autoPreloadAds = !0, e.setAutoPreloadAds = e.setAutoPreloadAds.bind(u(e)), e.getAutoPreloadAds = e.getAutoPreloadAds.bind(u(e)), e.autoClose = !1, e._onAdFailed = e._onAdFailed.bind(u(e)), e._reloadTable = [{
                                    type: d.REWARDED_INTERSTITIAL,
                                    count: 0,
                                    callback: e.preloadRewardedInterstitialAd,
                                    time: 30
                                }, {
                                    type: d.INTERSTITIAL,
                                    count: 0,
                                    callback: e.preloadInterstitialAd,
                                    time: 30
                                }, {
                                    type: d.REWARDED,
                                    count: 0,
                                    callback: e.preloadRewardedAd,
                                    time: 30
                                }], e.setConfig({}), e
                            }
                            return t = C, n = [{
                                key: "isBannerAvailable",
                                value: function() {
                                    return Promise.resolve(!0)
                                }
                            }, {
                                key: "hideBanner",
                                value: function() {
                                    return Promise.resolve(!0)
                                }
                            }, {
                                key: "_onAdFailed",
                                value: function(e, t) {
                                    var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                                    p(v).onAdFailed(e, t, n), this._reloadAfterDelay(e, t || {
                                        code: ""
                                    })
                                }
                            }, {
                                key: "_reloadAfterDelay",
                                value: function(e, t) {
                                    var n = t && t.code || "",
                                        r = this._reloadTable.find((function(t) {
                                            return t.type === e
                                        })) || null;
                                    null !== r && ["ADS_NO_FILL", "ADS_TOO_MANY_INSTANCES", "ADS_FREQUENT_LOAD"].includes(n) && r.count < 3 && (r.count++, p(h).log("try to reload " + e.name + " in " + r.time + "s"), setTimeout((function() {
                                        p(h).log("reload " + e.name + ", times:" + r.count), r.callback()
                                    }), 1e3 * r.time))
                                }
                            }, {
                                key: "setAutoPreloadAds",
                                value: function(e) {
                                    this._autoPreloadAds = e
                                }
                            }, {
                                key: "getAutoPreloadAds",
                                value: function() {
                                    return this._autoPreloadAds
                                }
                            }, {
                                key: "getConfig",
                                value: function() {
                                    return this._config
                                }
                            }, {
                                key: "setConfig",
                                value: function(e) {
                                    this._config = e
                                }
                            }, {
                                key: "requestBannerAd",
                                value: function() {
                                    return this.isBannerAvailable()
                                }
                            }, {
                                key: "_removeInterstitialAd",
                                value: function() {
                                    this._lastPreloadedInter = null
                                }
                            }, {
                                key: "_hasInterstitialAd",
                                value: function() {
                                    return null !== this._lastPreloadedInter
                                }
                            }, {
                                key: "preloadInterstitialAd",
                                value: function() {
                                    return this._hasPreloadedInterstitialAd = !0, Promise.resolve(!0)
                                }
                            }, {
                                key: "showPreloadedInterstitialAd",
                                value: function() {
                                    return this.hasPreloadedInterstitialAd() ? (this._hasPreloadedInterstitialAd = !1, p(I).notify("fs_watched", (new Date).getTime()), Promise.resolve(!0)) : (this._hasPreloadedInterstitialAd = !1, Promise.resolve(!1))
                                }
                            }, {
                                key: "hasPreloadedInterstitialAd",
                                value: function() {
                                    return this._hasPreloadedInterstitialAd
                                }
                            }, {
                                key: "requestInterstitialAd",
                                value: (l = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (e.prev = 0, this.hasPreloadedInterstitialAd()) {
                                                    e.next = 4;
                                                    break
                                                }
                                                return e.next = 4, this.preloadInterstitialAd();
                                            case 4:
                                                return e.next = 6, this.showPreloadedInterstitialAd();
                                            case 6:
                                                return e.abrupt("return", e.sent);
                                            case 9:
                                                return e.prev = 9, e.t0 = e.catch(0), p(v).onError(e.t0, f), e.abrupt("return", !1);
                                            case 13:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 9]
                                    ])
                                }))), function() {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "_removeRewardedAd",
                                value: function() {
                                    this._lastPreloadedRewarded = null
                                }
                            }, {
                                key: "_hasRewardedAd",
                                value: function() {
                                    return null !== this._lastPreloadedRewarded
                                }
                            }, {
                                key: "preloadRewardedAd",
                                value: function() {
                                    return this._hasPreloadedRewardedAd = !0, Promise.resolve(!0)
                                }
                            }, {
                                key: "hasPreloadedRewardedAd",
                                value: function() {
                                    return this._hasPreloadedRewardedAd
                                }
                            }, {
                                key: "showPreloadedRewardedAd",
                                value: function() {
                                    return this.hasPreloadedRewardedAd() ? (this._hasPreloadedRewardedAd = !1, p(I).notify("rv_watched", (new Date).getTime()), Promise.resolve(!0)) : (this._hasPreloadedRewardedAd = !1, Promise.resolve(!1))
                                }
                            }, {
                                key: "requestRewardedAd",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (e.prev = 0, !1 !== this.hasPreloadedRewardedAd()) {
                                                    e.next = 4;
                                                    break
                                                }
                                                return e.next = 4, this.preloadRewardedAd();
                                            case 4:
                                                return e.next = 6, this.showPreloadedRewardedAd();
                                            case 6:
                                                return e.abrupt("return", e.sent);
                                            case 9:
                                                return e.prev = 9, e.t0 = e.catch(0), p(v).onError(e.t0, f), e.abrupt("return", !1);
                                            case 13:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 9]
                                    ])
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "_removeRewardedInterstitialAd",
                                value: function() {
                                    this._lastPreloadedRewardedInterstitial = null
                                }
                            }, {
                                key: "_hasRewardedInterstitialAd",
                                value: function() {
                                    return null !== this._lastPreloadedRewardedInterstitial
                                }
                            }, {
                                key: "preloadRewardedInterstitialAd",
                                value: function() {
                                    return this._hasPreloadedRewardedInterstitialAd = !0, Promise.resolve(!0)
                                }
                            }, {
                                key: "hasPreloadedRewardedInterstitialAd",
                                value: function() {
                                    return this._hasPreloadedRewardedInterstitialAd
                                }
                            }, {
                                key: "showPreloadedRewardedInterstitialAd",
                                value: function() {
                                    return this.hasPreloadedRewardedInterstitialAd() ? (this._hasPreloadedRewardedInterstitialAd = !1, p(I).notify("ri_watched", (new Date).getTime()), Promise.resolve(!0)) : (this._hasPreloadedRewardedInterstitialAd = !1, Promise.resolve(!1))
                                }
                            }, {
                                key: "requestRewardedInterstitialAd",
                                value: (r = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (e.prev = 0, !1 !== this.hasPreloadedRewardedInterstitialAd()) {
                                                    e.next = 4;
                                                    break
                                                }
                                                return e.next = 4, this.preloadRewardedInterstitialAd();
                                            case 4:
                                                return e.next = 6, this.showPreloadedRewardedInterstitialAd();
                                            case 6:
                                                return e.abrupt("return", e.sent);
                                            case 9:
                                                return e.prev = 9, e.t0 = e.catch(0), p(v).onError(e.t0, f), e.abrupt("return", !1);
                                            case 13:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 9]
                                    ])
                                }))), function() {
                                    return r.apply(this, arguments)
                                })
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), C
                        }(l);
                    e.exports = y
                },
                6807: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return function(e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e)
                    }

                    function u(e) {
                        return u = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, u(e)
                    }
                    n(5666), n(6253), n(851), n(8838), n(1520), n(2139), n(8132), n(8388), n(5767), n(9115), n(6997), n(1181);
                    var c = n(8090).ACHIEVEMENT_MODULE,
                        l = n(8795).$ioc,
                        d = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(I, e);
                            var t, n, r, i, d, f, g = (d = I, f = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = u(d);
                                if (f) {
                                    var n = u(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function I() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, I), (e = g.call(this)).adTimeout = 2e3, e._lastShowAdFn = null, e.sdkInstance = null, e
                            }
                            return t = I, n = [{
                                key: "requestInterstitialAd",
                                value: function() {
                                    return l(c).notify("fs_watched", (new Date).getTime()), Promise.resolve(!0)
                                }
                            }, {
                                key: "preloadRewardedAd",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    var t, n, r, i, A = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return t = function() {
                                                    null !== A.sdkInstance && (A.sdkInstance.pause(), A.sdkInstance.mute())
                                                }, n = function() {
                                                    null !== A.sdkInstance && (A.sdkInstance.resume(), A.sdkInstance.unmute())
                                                }, r = function() {
                                                    A.dispatch("adComplete")
                                                }, i = function() {
                                                    A.dispatch("adDismissed")
                                                }, e.abrupt("return", new Promise((function(e, o) {
                                                    var a = setTimeout((function() {
                                                        return e(!1)
                                                    }), A.adTimeout);
                                                    GAMESNACKS.rewardedAdOpportunity({
                                                        beforeReward: function(t) {
                                                            A._lastShowAdFn = t, clearTimeout(a), A._hasPreloadedRewardedAd = !0, e(!0)
                                                        },
                                                        beforeBreak: t,
                                                        adComplete: r,
                                                        adDismissed: i,
                                                        afterBreak: n
                                                    })
                                                })));
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "showPreloadedRewardedAd",
                                value: (r = A(regeneratorRuntime.mark((function e() {
                                    var t = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.abrupt("return", new Promise((function(e, n) {
                                                    var r = function n() {
                                                            t.removeEventListener("adComplete", n), t.removeEventListener("adDismissed", i), t._lastShowAdFn = null, t._hasPreloadedRewardedAd = !1, t.getAutoPreloadAds() && t.preloadRewardedAd(), l(c).notify("rv_watched", (new Date).getTime()), e(!0)
                                                        },
                                                        i = function n() {
                                                            t.removeEventListener("adComplete", r), t.removeEventListener("adDismissed", n), t._lastShowAdFn = null, t._hasPreloadedRewardedAd = !1, t.getAutoPreloadAds() && t.preloadRewardedAd(), e(!1)
                                                        };
                                                    t.addEventListener("adComplete", r), t.addEventListener("adDismissed", i), null === t._lastShowAdFn ? (t._hasPreloadedRewardedAd = !1, n("no preloaded ad")) : t._lastShowAdFn()
                                                })));
                                            case 1:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e)
                                }))), function() {
                                    return r.apply(this, arguments)
                                })
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), I
                        }(n(5920));
                    e.exports = d
                },
                5044: e => {
                    e.exports = {
                        BLANK: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bpUWqDhYRcchQnSyIighdpIpFsFDaCq06mFz6BU0akhQXR8G14ODHYtXBxVlXB1dBEPwAcXRyUnSREv+XFFrEeHDcj3f3HnfvAG+jwhSjawJQVFNPxWNCNrcq+F8RwCD6EEVUZIaWSC9m4Dq+7uHh612EZ7mf+3P0ynmDAR6BeI5pukm8QTyzaWqc94lDrCTKxOfE4zpdkPiR65LDb5yLNnt5ZkjPpOaJQ8RCsYOlDmYlXSGeJg7Likr53qzDMuctzkqlxlr35C8M5tWVNNdpjiCOJSSQhAAJNZRRgYkIrSopBlK0H3PxD9v+JLkkcpXByLGAKhSIth/8D353axSmJp2kYAzofrGsj1HAvws065b1fWxZzRPA9wxcqW1/tQHMfpJeb2vhI6B/G7i4bmvSHnC5Aww9aaIu2pKPprdQAN7P6JtywMAt0LPm9Nbax+kDkKGulm+Ag0NgrEjZ6y7vDnT29u+ZVn8/I9ly7qI+CM4AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfmCBYPACxwTzpjAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAA1JREFUCNdj+P//PwMACPwC/lyfz9oAAAAASUVORK5CYII=",
                        CLOSE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAATCAYAAAB/TkaLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACvSURBVHja1NTBDcIwDIXhV45MkRFZBRbpDrBHK7WHXugCXH4uQXIjkjioIBHJl9j+FMVROkB7r4O+sCw6SJokhYb+IGmWNObQi6SjpKsTDpJusee8yQA2TsAdmICQ5GwEYAbW2LPJv2uowUUwh5bgKlhCX/AakeAFa6iFlxhV0IMK6IFHjN5R//uT7n6nKWinP8WX0TT9HOiGW0EX/AlYhW3R2ACm8GD3u7/5pJ8DAAjzd5Mj/aguAAAAAElFTkSuQmCC",
                        CLOSE2: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAATCAYAAAB/TkaLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAADsSURBVHjazNQ9CsIwFMDxv0EcPIUew8FewMkzhAxZ1APopAdQlw6lZ3DyAnoP6QUc7SBCXZ4gpTavfoCBQPNofry8vLZVFAXfHoYfjPbjIU7Sk6wj72ym2RwnaQ84AjfvbL8q0y3QBQ7yshbsApvK43tn18BKA5fApeytrqkGDoGVF1UHa0CA1quWipN0BiyAHBhKOAjWoiX4KqFOCAyiAu+AkSz33tnxR80vmUbAWWYksffQUk0HMnNgEYKN5pK8s5l8ZUPgAszrYKMBn9otk3LkdbDRgk1g0wTUws+ZTjXgC3jSqE//5id9HwAJuZW9QKE4fgAAAABJRU5ErkJggg==",
                        FBLOGO: "data:image/png;base64,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",
                        GAME: "data:image/png;base64,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",
                        GAME2: "data:image/png;base64,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yD32VW7O8XXtfGF7im3ltu3xtiQ/iWcuf3O04dv8tcdh7Py2jMVz0HK1JL7DyvdhsWt+loZr5diG21e5iBwUnuy//M2/InIyUju3JWzrv2XX8AdNd46jjv+gHHb+9rm8l7nMZTaXu9zlhjx+8Ytf3Hz605/efOxjH7vEffSjHx3c+eefvznvvPM2n/3sZy8O+Q/Zt3K2+Tlo/va1Hg87X/tazqNmrtynqlzk5IeWrUktIiKrgQFyxStecXPZy152c+lLX3pYalX5xje+sfna1762+cIXvrD55Cc/ufnSl7508RURETkZ0AAREREREZHVcA+IiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIishgaIiIiIiIisxGbz/wNY6Pha1lytMAAAAABJRU5ErkJggg==",
                        GAME3: "data:image/jpg;base64,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dE9wdGlvbnMAAAAXAAAAAENwdG5ib29sAAAAAABDbGJyYm9vbAAAAAAAUmdzTWJvb2wAAAAAAENybkNib29sAAAAAABDbnRDYm9vbAAAAAAATGJsc2Jvb2wAAAAAAE5ndHZib29sAAAAAABFbWxEYm9vbAAAAAAASW50cmJvb2wAAAAAAEJja2dPYmpjAAAAAQAAAAAAAFJHQkMAAAADAAAAAFJkICBkb3ViQG/gAAAAAAAAAAAAR3JuIGRvdWJAb+AAAAAAAAAAAABCbCAgZG91YkBv4AAAAAAAAAAAAEJyZFRVbnRGI1JsdAAAAAAAAAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQPyAAAAAAAKAAD///////8AADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAA4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAY4QklNBAgAAAAAABUAAAABAAACQAAAAkAAAAABAAAQDQAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADQQAAAAYAAAAAAAAAAAAAAQAAAAEAAAAABgBiAGEAbgBuAGUAcgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAQAAAAAAUmdodGxvbmcAAAEAAAAABnNsaWNlc1ZsTHMAAAABT2JqYwAAAAEAAAAAAAVzbGljZQAAABIAAAAHc2xpY2VJRGxvbmcAAAAAAAAAB2dyb3VwSURsb25nAAAAAAAAAAZvcmlnaW5lbnVtAAAADEVTbGljZU9yaWdpbgAAAA1hdXRvR2VuZXJhdGVkAAAAAFR5cGVlbnVtAAAACkVTbGljZVR5cGUAAAAASW1nIAAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAEAAAAAAFJnaHRsb25nAAABAAAAAAN1cmxURVhUAAAAAQAAAAAAAG51bGxURVhUAAAAAQAAAAAAAE1zZ2VURVhUAAAAAQAAAAAABmFsdFRhZ1RFWFQAAAABAAAAAAAOY2VsbFRleHRJc0hUTUxib29sAQAAAAhjZWxsVGV4dFRFWFQAAAABAAAAAAAJaG9yekFsaWduZW51bQAAAA9FU2xpY2VIb3J6QWxpZ24AAAAHZGVmYXVsdAAAAAl2ZXJ0QWxpZ25lbnVtAAAAD0VTbGljZVZlcnRBbGlnbgAAAAdkZWZhdWx0AAAAC2JnQ29sb3JUeXBlZW51bQAAABFFU2xpY2VCR0NvbG9yVHlwZQAAAABOb25lAAAACXRvcE91dHNldGxvbmcAAAAAAAAACmxlZnRPdXRzZXRsb25nAAAAAAAAAAxib3R0b21PdXRzZXRsb25nAAAAAAAAAAtyaWdodE91dHNldGxvbmcAAAAAADhCSU0EKAAAAAAADAAAAAI/8AAAAAAAADhCSU0EEQAAAAAAAQEAOEJJTQQUAAAAAAAEAAAABzhCSU0EDAAAAAAciAAAAAEAAACgAAAAoAAAAeAAASwAAAAcbAAYAAH/2P/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRleHQAAAAAQ29weXJpZ2h0IChjKSAxOTk4IEhld2xldHQtUGFja2FyZCBDb21wYW55AABkZXNjAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAA81EAAQAAAAEWzFhZWiAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPZGVzYwAAAAAAAAAWSUVDIGh0dHA6Ly93d3cuaWVjLmNoAAAAAAAAAAAAAAAWSUVDIGh0dHA6Ly93d3cuaWVjLmNoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRlc2MAAAAAAAAALklFQyA2MTk2Ni0yLjEgRGVmYXVsdCBSR0IgY29sb3VyIHNwYWNlIC0gc1JHQgAAAAAAAAAAAAAALklFQyA2MTk2Ni0yLjEgRGVmYXVsdCBSR0IgY29sb3VyIHNwYWNlIC0gc1JHQgAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAACxSZWZlcmVuY2UgVmlld2luZyBDb25kaXRpb24gaW4gSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdmlldwAAAAAAE6T+ABRfLgAQzxQAA+3MAAQTCwADXJ4AAAABWFlaIAAAAAAATAlWAFAAAABXH+dtZWFzAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAACjwAAAAJzaWcgAAAAAENSVCBjdXJ2AAAAAAAABAAAAAAFAAoADwAUABkAHgAjACgALQAyADcAOwBAAEUASgBPAFQAWQBeAGMAaABtAHIAdwB8AIEAhgCLAJAAlQCaAJ8ApACpAK4AsgC3ALwAwQDGAMsA0ADVANsA4ADlAOsA8AD2APsBAQEHAQ0BEwEZAR8BJQErATIBOAE+AUUBTAFSAVkBYAFnAW4BdQF8AYMBiwGSAZoBoQGpAbEBuQHBAckB0QHZAeEB6QHyAfoCAwIMAhQCHQImAi8COAJBAksCVAJdAmcCcQJ6AoQCjgKYAqICrAK2AsECywLVAuAC6wL1AwADCwMWAyEDLQM4A0MDTwNaA2YDcgN+A4oDlgOiA64DugPHA9MD4APsA/kEBgQTBCAELQQ7BEgEVQRjBHEEfgSMBJoEqAS2BMQE0wThBPAE/gUNBRwFKwU6BUkFWAVnBXcFhgWWBaYFtQXFBdUF5QX2BgYGFgYnBjcGSAZZBmoGewaMBp0GrwbABtEG4wb1BwcHGQcrBz0HTwdhB3QHhgeZB6wHvwfSB+UH+AgLCB8IMghGCFoIbgiCCJYIqgi+CNII5wj7CRAJJQk6CU8JZAl5CY8JpAm6Cc8J5Qn7ChEKJwo9ClQKagqBCpgKrgrFCtwK8wsLCyILOQtRC2kLgAuYC7ALyAvhC/kMEgwqDEMMXAx1DI4MpwzADNkM8w0NDSYNQA1aDXQNjg2pDcMN3g34DhMOLg5JDmQOfw6bDrYO0g7uDwkPJQ9BD14Peg+WD7MPzw/sEAkQJhBDEGEQfhCbELkQ1xD1ERMRMRFPEW0RjBGqEckR6BIHEiYSRRJkEoQSoxLDEuMTAxMjE0MTYxODE6QTxRPlFAYUJxRJFGoUixStFM4U8BUSFTQVVhV4FZsVvRXgFgMWJhZJFmwWjxayFtYW+hcdF0EXZReJF64X0hf3GBsYQBhlGIoYrxjVGPoZIBlFGWsZkRm3Gd0aBBoqGlEadxqeGsUa7BsUGzsbYxuKG7Ib2hwCHCocUhx7HKMczBz1HR4dRx1wHZkdwx3sHhYeQB5qHpQevh7pHxMfPh9pH5Qfvx/qIBUgQSBsIJggxCDwIRwhSCF1IaEhziH7IiciVSKCIq8i3SMKIzgjZiOUI8Ij8CQfJE0kfCSrJNolCSU4JWgllyXHJfcmJyZXJocmtyboJxgnSSd6J6sn3CgNKD8ocSiiKNQpBik4KWspnSnQKgIqNSpoKpsqzysCKzYraSudK9EsBSw5LG4soizXLQwtQS12Last4S4WLkwugi63Lu4vJC9aL5Evxy/+MDUwbDCkMNsxEjFKMYIxujHyMioyYzKbMtQzDTNGM38zuDPxNCs0ZTSeNNg1EzVNNYc1wjX9Njc2cjauNuk3JDdgN5w31zgUOFA4jDjIOQU5Qjl/Obw5+To2OnQ6sjrvOy07azuqO+g8JzxlPKQ84z0iPWE9oT3gPiA+YD6gPuA/IT9hP6I/4kAjQGRApkDnQSlBakGsQe5CMEJyQrVC90M6Q31DwEQDREdEikTORRJFVUWaRd5GIkZnRqtG8Ec1R3tHwEgFSEtIkUjXSR1JY0mpSfBKN0p9SsRLDEtTS5pL4kwqTHJMuk0CTUpNk03cTiVObk63TwBPSU+TT91QJ1BxULtRBlFQUZtR5lIxUnxSx1MTU19TqlP2VEJUj1TbVShVdVXCVg9WXFapVvdXRFeSV+BYL1h9WMtZGllpWbhaB1pWWqZa9VtFW5Vb5Vw1XIZc1l0nXXhdyV4aXmxevV8PX2Ffs2AFYFdgqmD8YU9homH1YklinGLwY0Njl2PrZEBklGTpZT1lkmXnZj1mkmboZz1nk2fpaD9olmjsaUNpmmnxakhqn2r3a09rp2v/bFdsr20IbWBtuW4SbmtuxG8eb3hv0XArcIZw4HE6cZVx8HJLcqZzAXNdc7h0FHRwdMx1KHWFdeF2Pnabdvh3VnezeBF4bnjMeSp5iXnnekZ6pXsEe2N7wnwhfIF84X1BfaF+AX5ifsJ/I3+Ef+WAR4CogQqBa4HNgjCCkoL0g1eDuoQdhICE44VHhauGDoZyhteHO4efiASIaYjOiTOJmYn+imSKyoswi5aL/IxjjMqNMY2Yjf+OZo7OjzaPnpAGkG6Q1pE/kaiSEZJ6kuOTTZO2lCCUipT0lV+VyZY0lp+XCpd1l+CYTJi4mSSZkJn8mmia1ZtCm6+cHJyJnPedZJ3SnkCerp8dn4uf+qBpoNihR6G2oiailqMGo3aj5qRWpMelOKWpphqmi6b9p26n4KhSqMSpN6mpqhyqj6sCq3Wr6axcrNCtRK24ri2uoa8Wr4uwALB1sOqxYLHWskuywrM4s660JbSctRO1irYBtnm28Ldot+C4WbjRuUq5wro7urW7LrunvCG8m70VvY++Cr6Evv+/er/1wHDA7MFnwePCX8Lbw1jD1MRRxM7FS8XIxkbGw8dBx7/IPci8yTrJuco4yrfLNsu2zDXMtc01zbXONs62zzfPuNA50LrRPNG+0j/SwdNE08bUSdTL1U7V0dZV1tjXXNfg2GTY6Nls2fHadtr724DcBdyK3RDdlt4c3qLfKd+v4DbgveFE4cziU+Lb42Pj6+Rz5PzlhOYN5pbnH+ep6DLovOlG6dDqW+rl63Dr++yG7RHtnO4o7rTvQO/M8Fjw5fFy8f/yjPMZ86f0NPTC9VD13vZt9vv3ivgZ+Kj5OPnH+lf65/t3/Af8mP0p/br+S/7c/23////tAAxBZG9iZV9DTQAC/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAoACgAwEiAAIRAQMRAf/dAAQACv/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A8qSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSU//0PKkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP/9HypJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT//S8qSSSSU9V1j/ABcdb6V0P9uvyMTKwNtb92O97nGu0tbVc1ttNO6v9JWuVXs/+K/qOP8AWD6oZX1ezpecRrsawayce8P9I7z+ez9PUzb/ADXpUryLqfTcnpvU8jpl7ZvxrXUugH3Fp2tewO92y36df8hJTtfVX6g9b+tONflYD6KaKHiovyHPaHPje5lfpVX/AM211e/d/pFhZ2KcPNvxHWMuOPY6o21EurcWHYX1PcG763bfY5e1Zrh9Qv8AFsKWuDM/0vSa4EScvIl1r2Pa33/Zt1tlW7/BYy5H6v8A+Jvqufisyuq5Q6b6gDmY3pmy4A/6dpfUyh/52z9K/wD0vpWJKfPEl6D9Yf8AE71jp2M7K6VkDqjK2l1lAZ6d0DX9DXvtbke383ey3/RVWLieldJz+sZ9fT+n1G/JtPtaNAAPpPe4+1jGfvJKaiS9Sxf8R1jscHM6s1mQR7mVUl7Gnysstpfa3/rVK5T63/UDq/1WIuuLcrAe7azLrBAB7MvqM+i939ayv/hUlPMJLoPqn9SOs/Wm15ww2nEpcG3ZdshgJ19OsN9112z3bGf9dsq9Stdnkf4jnDHccbq4fkAEtbZRsY535rXPZda+pv8AL2XJKeI619SfrJ0LCbn9Txm04z3tra8W1vlzg57fbVY930WLDXtX+OBjmfU3GY6NzcukOjiRXeFxn1V/xVdY69iV9Qy7m9NwrhupL2F9tjfzbW0bqttNn+Dsss/4T0/S96SniEl6X1b/ABJ59GO63pWe3MtaCfs9rPRLoH0a7vUtr3u/4X0mf8KvOm4WY7MGA2h/2w2ej9n2kWepPp+j6Z9/qb/ZsSUhSXpvS/8AElm3Y7beqdRbi3OEnHpr9XbIna+42VM3t/P9Nllf/DLG+tf+K3rH1fxn5+Pa3qOBUJtsY0ssrH5z7MfdZ+ib/pK7bP8AhPTSU8Wkkkkp/9PypJJJJT1H+Lfr37F+tWK+xwbjZv6pkExAbYW+k/c4hrPTyG1Pe/8A0XqL07rH1GZnfX/p3Xw0fZWM9XMjSb8faMMnX/Cb6fzf5vC/4ReEr3Lon+M3oJ+rFGX1LMaOp00H18Yn9LZbUC32+1rN2Xs9Rn/GpKa3W+qUdW/xo9F6E734/S9+RY3UA5Povy6eDtd9nbXjvZ/16tYX+OjrXUm9Ux+jMsdVgHHbe+tpIFj3PsZNsfTZX6LfTZ++uCr651Gvrn7dbZGf9oOUXjQF7neo9u1v+Cfu2Or/ANH+jXrB+sv+Lz69YFNXXXMwsumXBmRYanVuIAs9DM/R021P/cf9P/CY/wBBJTl/4l+tdUuycvo9z33dPpp9eovJcKn72s9Kt35jL22Ps9L/AIH9H/hV0v1Q6P03C+tn1ouxmt9QX0tbEexttYzL2M/OYyzIs+h/wFf+jWZb9a/qF9R+nXY31c9PMzLoJbS4273AEMsys33M9Kv/AENT/wDCfo6f0lli4T6pfX3P6H9YMjqmZOXT1J09RYIDnEuLxfSPZX6tLnv9Ov8AmvTe+n9F/O1JTQ+tfW+r9S+sOXkZ1trbqL7GU0lxHoBjixlNTRt9P0tn9uz9JZ+lXq31dyL/AKxf4sbv2242l2PkVHJthxc2nf6OU4u+lZQ6v+dd7/Wo9X+cVXLx/wDFL9ZL/wBsZGVj13PO69rrziusI/02PY6l+7/hKW/pP9Isf67/AOMTpDejn6t/VUD7M9hovyGtLK2VfRdj4zXbXWOu+hdc79H6X836vrerSlPQY99n1c/xT15vRgDkDDruDwNxFmQ5n2i4/vOxfXs+n/oPf+jXkHTuv9Y6f1QdVxsq37bv3Psc5zjZJ3PZkSf0zLP8JvXa/wCL7/GH0/p3Tj9XvrC3d04h7abiz1GNZZudbjZNLWufbTY5z/zLf5z03/of5vosbA/xRdFyW9bpy8Zz6SLKaxkG/Y4fRfXiNdbc6xv5nqMs9J6SnU/xj4tOd03pGHkg+hldWxKrhMHZZ6jLPcP5Llkf44+sdS6d0vAwMF5ox842tyX1y07axWGY+9v0arfWf6jP8J6X+j9RVf8AGf8AWvoHVfq3VT0rqFd+SzKqtDKyQ8AMt9+ob9Hc1G6V9evql9bejM6R9bgynJG3e62WVPe2YyaMmvb9ls/0m51P876P6Wrekp5n/FJ1nqdH1no6VXY52Bmtt9elxJa0srfcy9jfo12b6mV7/wBz/ra71nS8Af417MoMHrnpIydefVNv2F1zf/QVno/9cVDF6n/iy+o1N2T0y+vKzLm7f0Fn2m57QZ9IWtc6jHZu97/fT6np/wCF9OpefV/X7qrPrgfrSWhz3u2OxNxDDjxs+yb/AOSwbvU9P+kfrHpJKbn+NTrPU8v61ZXT77HsxMIsbRjz7BLG2euWj2ust9Xdv/0f6Ndt/ii6r1Dq3QczD6mXZWPi2Cmmy73zXY0+piuc7+dZV/wn+Du9L+a9NLLzv8V/12ZXmdQya8bLraGk32fZbmt+l6Ly9wov/set/IeqfW/r99WPqx0Z3RvqcGWZB3BttQLqqnOHuyH327vtd/8Aov56v/S/zfo2JT5Z1bGpxOqZmLju9SnHvtqqfzuYx7mMd/aa1VUkklP/1PKkkkklKSSAJIAEk6ABdvT/AIq89rKGdU6pg9MzcuPs+FdZ+lcT7WsjTdZ6h2foPXSU8QktDr3QepfV/qVnTeo17Lq4c1zZLLGH6F1DyG76nx/6Ls/SsWekpSSSSSlJJJJKUkkr2BgYeViZl+Rn1YduMwOoosa9zryQ8mup1bXbHexn85/pUlNFJJaGB0PPz+n53UqQxuJ01jXZNj3Aa2O2VVMZq99ln+Z/LSU56SSSSlJJJJKUkkkkp//V8qSSSSU6n1VyMbG+s3SsjKcGUVZdL7HuIDWgPafUe530WV/Tcuv+uXSav/HAybPrFj512Bmhv2F2C1rn2ODKmV00+p7Hen7q7K/5zf8A8YvPF0mB/jF+uXT8RmHjdRd6NQ21iyuu1zR2b6l9dlm1v5m5ySnsOo/VvqLfrp0k9NL+rZTsI5T/ANvvNramAuraLmVMY9novt9jNluzLs9X/hET6x2Y/V/8XXUs/LzcfrObhZLBVmUUGltDn2YzbMWh5az1621Xfzv5/qfpP0la8+r+t31kr6x+2xn2O6iGlnrPhw2OndT6Lw6n0fdu9H0/TY/9JWrHUPr19Z+pYWRgZuWLcTK2+rT6VbW+13rBzPTrZ6bvV/SPc36aSn1TP6rYP8ZWN9XxRjnA6hiOOe11LHOvIrvdX61rm73NqZSyplbvZ6fq/wDW+byM79r/AFO+tONlY9Ao6Pktb0yuuprPQaLNgbU5gH5rPp/zj/Vu9T9GuMs+un1it65V19+S09SorNVd3pVgBhD2R6YZ6bvbdZ+Yq9f1m6zXidQw2XNFHVn+pmt9NnvcTv8Aadn6L3f6JJT6z1LI+rP1ZycLpF3UaMTpDccOu6XZ092QMprtzftVubU1zd7vT/d+mz9L6i8b6oMEdTyx04l2AL7BiOMyad7vQP6SLP5rZ9P3rZwP8YP1u6fiU4eNnRVjN9PHL6qrHsZ/o2W3VWWbPzfpfQ9iwLrrb7n33PNltri+yxxlznOO573OP0nOckp9l+s3XOpdO+unQ+m4mNQcLqlVFWbuoa43tssfjWU2XRu2YdLvWqrr/m/W/T+rS/01m/s7C6az/GJhYIAxq6cd1bBBDS+vIufWyPotqssfWz/RrO+t/wDjKy2dVof9Vuo7sQYrG2F1IIbeHXB7q251O9jvRdVu9P2WLjMT6x9YxKOo0VZBLOriM82NbY63+c9zrLWvfv8A09v6RvvSU971Pq2b9UenfVrD+ruHVZT1LGZdkfoRYc22wV7qXSHZG79N7Gsd/h6qf5r9EpfV/wCsXWsX6pfWe9ldfSrsCyuzGxK6QxtD7n7r2tpyBY/3/m13b/S/wPp1+xcb0v6+fWrpOGzBws3bj0kmlj667dhII/RPvrsez6X0VHB+vH1owMrLzKM5xv6gWuyn2tZbvLJFXtvZY1nptdsZ6f8Ag/Ykp2vrBVZZ/i4+q3psLy67Kb7RJL322bWCP3/d7V6D6db/APGrYx7GuY7okOaQCCDkAO3LyTp/14+tHTcE4GHmmvG3usYw11vLHPO57qH21vfT7nb/ANH+f70QfX760jq/7Z+1t+3/AGf7IbvSq/mt3rbPT9P0/wCc/wAJt3pKeu+pXVbOunrXX+sWVVX9Ixq2dPuGMLasKt5yLXWY+DS3c/7N6LPTs/nvS/nLfTWT9fOp/VrqfSMK3G6gzqfXqrNmRl14j8T1qCH/AKS6t7BU59L2U1t22f6T9GuV6L13q3Qsv7Z0rIONeWljiA1wc0/mPrsa+t/+aj9b+tXXeu1009TyfVpxyTTUxjKmNJETsoZW139pJTkpJJJKf//W8qSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSU//1/KkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP/9DypJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT//ZOEJJTQQhAAAAAABVAAAAAQEAAAAPAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwAAAAEwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAUwA2AAAAAQA4QklNBAYAAAAAAAcACAEBAAEBAP/hDetodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9IkY3MjY3QkYyMDkxOUNFQTFGQzFFNjQwNDI2RkJCOEVGIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYyRkEzNkI4QzdENEVDMTE5MjE0QzkxQzNGRTVEOEQ3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkY3MjY3QkYyMDkxOUNFQTFGQzFFNjQwNDI2RkJCOEVGIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpMZWdhY3lJUFRDRGlnZXN0PSI5MUQ5MzdDMjc0QjYyNkQ3MkU3ODhEODAzRUY2NUY1NyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMDUtMTZUMDA6NTQ6MTIrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTA1LTE2VDA1OjI0OjM5KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA1LTE2VDA1OjI0OjM5KzAyOjAwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDY0REZERDZBM0Q0RUMxMTkyMTRDOTFDM0ZFNUQ4RDciIHN0RXZ0OndoZW49IjIwMjItMDUtMTZUMDE6MDk6MDgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMkZBMzZCOEM3RDRFQzExOTIxNEM5MUMzRkU1RDhENyIgc3RFdnQ6d2hlbj0iMjAyMi0wNS0xNlQwNToyNDozOSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/7gAhQWRvYmUAZEAAAAABAwAQAwIDBgAAAAAAAAAAAAAAAP/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQEBAQEBAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8IAEQgBAAEAAwERAAIRAQMRAf/EAK8AAQACAgIDAQEAAAAAAAAAAAAJCggLAQcEBQYDAgEBAAAAAAAAAAAAAAAAAAAAABAAAgIBAgYCAAUFAAAAAAAACAkGBwoBBQAgEQIDBBAwQFCAoDkhFyc4GREAAAcAAQIEAwUFBAYLAQAAAQIDBAUGBwgREgATFAkhFRYQ8DEiFzBBUYEjIHGRJICxMjN3uEBQYaHR4UImthgZChIBAAAAAAAAAAAAAAAAAAAAoP/aAAwDAQECEQMRAAAA1/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOTgA5OAAAAAAAAAAAAAWXyK4jxOS2UV3DFcAAAAEt5gedAAAAAAAAvIkrprESVs225pDz7I6uP4OT7c9KehB7I+zNtGUEiAU7QOtD8T+j7E8A+bAAAMjjdpmksNg0dGkyZI4Y7GptLcx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",
                        MESSENGER: "data:image/png;base64,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",
                        PUBLICBTN: "data:image/png;base64,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",
                        PUBLICBTN2: "data:image/png;base64,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",
                        SKIP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAATCAYAAAB/TkaLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACMSURBVHja1JTBCYAwDEW/Hp3CEZ3FRVxBHERBj+oMz1OhKNpUq2Agl/D+I5SSDFDqyvVCOWkvaZRUBngT56S1pEJSFwjYOMB1BSzACJTefN9BLjpg4W5tEuKuAiswGcQHTrEBC3clFdAAM9DGcJ9umvxNHwnP/ukj4V6aROhLkwl96WAQmrnsN0d6GwBy7nlnMU5qlgAAAABJRU5ErkJggg==",
                        SUPER_SCORE: "data:image/jpg;base64,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bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAAAAAAQY3JvcFdoZW5QcmludGluZ2Jvb2wAAAAADmNyb3BSZWN0Qm90dG9tbG9uZwAAAAAAAAAMY3JvcFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAIASAAAAAEAAjhCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQQNAAAAAAAEAAAAeDhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAADhCSU0EAgAAAAAAAgAAOEJJTQQwAAAAAAABAQA4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADTQAAAAYAAAAAAAAAAAAAAHwAAADEAAAADABTAGEAbgBzACAAdABpAHQAcgBlAC0AMgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAxAAAAHwAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAHwAAAAAUmdodGxv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REYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA1LTE2VDEwOjM5OjU3KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA1LTE2VDEwOjM5OjU3KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNS0xNlQxMDozOTo1NyswMjowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQTUzMDVDNEYzRDRFQzExOTIxNEM5MUMzRkU1RDhENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowN0Y1OERGQUU5RDRFQzExOTIxNEM5MUMzRkU1RDhENyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjA3RjU4REZBRTlENEVDMTE5MjE0QzkxQzNGRTVEOEQ3IiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3RjU4REZBRTlENEVDMTE5MjE0QzkxQzNGRTVEOEQ3IiBzdEV2dDp3aGVuPSIyMDIyLTA1LTE2VDEwOjM5OjU3KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6QkE1MzA1QzRGM0Q0RUMxMTkyMTRDOTFDM0ZFNUQ4RDciIHN0RXZ0OndoZW49IjIwMjItMDUtMTZUMTA6Mzk6NTcrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8cmRmOkJhZz4gPHJkZjpsaT5BODA2Njg5OTIyOEMyNkYzQkI3OEQ4MDJDRTYxM0Q3ODwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+4AIUFkb2JlAGRAAAAAAQMAEAMCAwYAAAAAAAAAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAQEBAQICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD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",
                        YOU: "data:image/png;base64,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"
                    }
                },
                6748: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return u(e)
                    }

                    function u(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(5666), n(9730), n(6253), n(851), n(8837), n(8838), n(1520), n(2139), n(8132), n(8388), n(5767), n(9115), n(6997), n(1181);
                    var l = n(1978),
                        d = n(8090),
                        f = d.ERROR_MODULE,
                        g = d.LOGGER_MODULE,
                        I = n(8795).$ioc,
                        v = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(m, e);
                            var t, n, r, i, l, d, v, h, p, y = (h = m, p = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(h);
                                if (p) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function m() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, m), (e = y.call(this))._history = [], e._currentContext = {
                                    id: null,
                                    type: "SOLO"
                                }, e._notJoinedContext = null, e.reconnect = e.reconnect.bind(u(e)), e
                            }
                            return t = m, n = [{
                                key: "init",
                                value: (v = A(regeneratorRuntime.mark((function e() {
                                    var t;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return this._currentContext = {
                                                    id: null,
                                                    type: "SOLO"
                                                }, e.next = 3, this.loadSavedHistory();
                                            case 3:
                                                return e.next = 5, this.reconnect();
                                            case 5:
                                                t = e.sent, this.dispatch("reconnected", {
                                                    reconnected: t
                                                });
                                            case 7:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return v.apply(this, arguments)
                                })
                            }, {
                                key: "saveHistory",
                                value: function() {
                                    return window.localStorage.setItem("game_ctx_history", JSON.stringify(this._history)), Promise.resolve(!0)
                                }
                            }, {
                                key: "loadSavedHistory",
                                value: (d = A(regeneratorRuntime.mark((function e() {
                                    var t, n;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (e.prev = 0, t = window.localStorage.getItem("game_ctx_history")) {
                                                    e.next = 4;
                                                    break
                                                }
                                                return e.abrupt("return", !1);
                                            case 4:
                                                n = JSON.parse(t), this._history = n, e.next = 12;
                                                break;
                                            case 8:
                                                return e.prev = 8, e.t0 = e.catch(0), I(f).onError(e.t0), e.abrupt("return", !1);
                                            case 12:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 8]
                                    ])
                                }))), function() {
                                    return d.apply(this, arguments)
                                })
                            }, {
                                key: "clearHistory",
                                value: function() {
                                    return this._history = [], Promise.resolve(!0)
                                }
                            }, {
                                key: "clearSavedHistory",
                                value: function() {
                                    return window.localStorage.setItem("game_ctx_history", JSON.stringify([])), Promise.resolve(!0)
                                }
                            }, {
                                key: "getNotJoinedContext",
                                value: function() {
                                    return this._notJoinedContext
                                }
                            }, {
                                key: "hasRefusedTournament",
                                value: function() {
                                    var e = this.getNotJoinedContext();
                                    return null === e || null === e.id ? Promise.resolve(!1) : this.isTournament(e.id)
                                }
                            }, {
                                key: "setCurrentContext",
                                value: function(e, t) {
                                    this._currentContext.id = e, this._currentContext.type = t
                                }
                            }, {
                                key: "getCurrentContext",
                                value: function() {
                                    return this._currentContext
                                }
                            }, {
                                key: "saveContext",
                                value: function(e, t) {
                                    this._history.unshift({
                                        id: e,
                                        type: t
                                    }), this._history.splice(10), this.saveHistory()
                                }
                            }, {
                                key: "getLastNotSoloContext",
                                value: function() {
                                    return this._history.filter((function(e) {
                                        return "SOLO" !== e.type
                                    }))[0] || null
                                }
                            }, {
                                key: "getLastContext",
                                value: function() {
                                    return this._history[0] || null
                                }
                            }, {
                                key: "getHistory",
                                value: function() {
                                    return this._history
                                }
                            }, {
                                key: "isInPost",
                                value: function(e) {
                                    return null !== e && "post" === e.toLowerCase()
                                }
                            }, {
                                key: "isSolo",
                                value: function(e) {
                                    return null !== e && "solo" === e.toLowerCase()
                                }
                            }, {
                                key: "isInThread",
                                value: function(e) {
                                    return null !== e && "thread" === e.toLowerCase()
                                }
                            }, {
                                key: "isInGroup",
                                value: function(e) {
                                    return null !== e && "group" === e.toLowerCase()
                                }
                            }, {
                                key: "isTournament",
                                value: function(e) {
                                    return Promise.resolve(!0)
                                }
                            }, {
                                key: "isDual",
                                value: (l = A(regeneratorRuntime.mark((function e(t, n) {
                                    var r, i;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return r = this.isSolo(t), e.next = 3, this.isTournament(n);
                                            case 3:
                                                return i = e.sent, e.abrupt("return", !r && !i);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t) {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "create",
                                value: function(e) {
                                    return this.saveContext(Math.round(1e3 * Math.random()), "THREAD"), Promise.resolve(!0)
                                }
                            }, {
                                key: "choose",
                                value: function() {
                                    return this.saveContext(Math.round(1e3 * Math.random()), "THREAD"), Promise.resolve(!0)
                                }
                            }, {
                                key: "reconnect",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    var t, n, r;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (I(g).log("********* reconnect"), t = this.getLastNotSoloContext(), n = this.getCurrentContext(), this._notJoinedContext = null, null !== t && null !== n && this.isSolo(n.type)) {
                                                    e.next = 6;
                                                    break
                                                }
                                                return e.abrupt("return", !1);
                                            case 6:
                                                if (!this.isInThread(t.type) && !this.isInGroup(t.type)) {
                                                    e.next = 14;
                                                    break
                                                }
                                                return e.next = 9, this.join(t.id, t.type);
                                            case 9:
                                                return !1 === (r = e.sent) && (this._notJoinedContext = t), e.abrupt("return", r);
                                            case 14:
                                                return e.abrupt("return", !1);
                                            case 15:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "join",
                                value: (r = A(regeneratorRuntime.mark((function e(t, n) {
                                    var r;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return r = Promise.resolve(!0), this.saveContext(t, n), this._currentContext.id = t, this._currentContext.type = n, e.abrupt("return", r);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t) {
                                    return r.apply(this, arguments)
                                })
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), m
                        }(l);
                    e.exports = v
                },
                287: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return u(e)
                    }

                    function u(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(5666), n(9730), n(6253), n(851), n(8388), n(8838), n(1520), n(2139), n(8132), n(5767), n(9115), n(6997), n(1181);
                    var l = n(1978),
                        d = (n(5920), n(5044)),
                        f = d.BLANK,
                        g = d.YOU,
                        I = n(3104).BASE64_IMG_ERROR,
                        v = n(8090),
                        h = v.STORE_MODULE,
                        p = v.PROFILE_MODULE,
                        y = v.CONTEXT_MODULE,
                        m = v.MATCHMAKING_MODULE,
                        C = v.ADS_MODULE,
                        E = v.IAP_MODULE,
                        b = v.ACHIEVEMENT_MODULE,
                        w = v.ERROR_MODULE,
                        S = v.LOGGER_MODULE,
                        k = v.SCORE_MODULE,
                        D = v.I18N_MODULE,
                        R = n(8795).$ioc,
                        O = n(2218),
                        P = O.getInviteFriendsButtonDefaultStyle,
                        B = O.getSelectFriendsButtonDefaultStyle,
                        M = O.getShareFriendsButtonDefaultStyle,
                        x = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(F, e);
                            var t, n, r, i, l, d, v, O, x, G, j, T, H, U, L, z, Q, V = (z = F, Q = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(z);
                                if (Q) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function F() {
                                var e, t, n, r;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, F), r = function(e) {
                                    window.navigator && window.navigator.vibrate && window.navigator.vibrate(e)
                                }, (n = "performHapticFeedBack") in (t = u(e = V.call(this))) ? Object.defineProperty(t, n, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : t[n] = r, e._initialized = !1, e._windowLoaded = !1, e.init = e.init.bind(u(e)), e.isInitialized = e.isInitialized.bind(u(e)), e.notifyLoadingProgress = e.notifyLoadingProgress.bind(u(e)), e.notifyLoadingComplete = e.notifyLoadingComplete.bind(u(e)), e.notifyLevelEnd = e.notifyLevelEnd.bind(u(e)), e.requestBannerAd = e.requestBannerAd.bind(u(e)), e.setConfig = e.setConfig.bind(u(e)), e.getConfig = e.getConfig.bind(u(e)), e.setBestScore = e.setBestScore.bind(u(e)), e.resetBestScore = e.resetBestScore.bind(u(e)), e.getBestScore = e.getBestScore.bind(u(e)), e.preloadInterstitialAd = e.preloadInterstitialAd.bind(u(e)), e.showPreloadedInterstitialAd = e.showPreloadedInterstitialAd.bind(u(e)), e.hasPreloadedInterstitialAd = e.hasPreloadedInterstitialAd.bind(u(e)), e.requestInterstitialAd = e.requestInterstitialAd.bind(u(e)), e.requestRewardedAd = e.requestRewardedAd.bind(u(e)), e.showPreloadedRewardedAd = e.showPreloadedRewardedAd.bind(u(e)), e.preloadRewardedAd = e.preloadRewardedAd.bind(u(e)), e.hasPreloadedRewardedAd = e.hasPreloadedRewardedAd.bind(u(e)), e.createShortcutAsync = e.createShortcutAsync.bind(u(e)), e.saveProgression = e.saveProgression.bind(u(e)), e.getSavedProgression = e.getSavedProgression.bind(u(e)), e.performHapticFeedBack = e.performHapticFeedBack.bind(u(e)), e._onWindowLoaded = e._onWindowLoaded.bind(u(e)), e.getPlayerInfo = e.getPlayerInfo.bind(u(e)), e.setAutoPreloadAds = e.setAutoPreloadAds.bind(u(e)), e.getAutoPreloadAds = e.getAutoPreloadAds.bind(u(e)), e.getLang = e.getLang.bind(u(e)), e.getTranslation = e.getTranslation.bind(u(e)), e.getBrowserLang = e.getBrowserLang.bind(u(e)), e.fetchLang = e.fetchLang.bind(u(e)), e.hasLang = e.hasLang.bind(u(e)), e.setLoadingTime = e.setLoadingTime.bind(u(e)), e.getLoadingTime = e.getLoadingTime.bind(u(e)), e.getProfileManager = e.getProfileManager.bind(u(e)), e.getMatchMakingManager = e.getMatchMakingManager.bind(u(e)), e.getAchievementManager = e.getAchievementManager.bind(u(e)), e.getContextManager = e.getContextManager.bind(u(e)), e.getOpponent = e.getOpponent.bind(u(e)), e.tick = e.tick.bind(u(e)), e.sdkInstance = null, e.totalLoadingTime = 0, e._config = {}, e._playerInfo = {
                                    playerName: "You",
                                    playerPic: g
                                }, e._dictionnary = {}, e._notfoundlang = {}, e._langPromises = {}, e._adsManager = R(C), e._matchMakingManager = R(m), e._ctxManager = R(y), e._profileManager = R(p), e._store = R(h), e._iap = R(E), e._iap.init(), e._ctxManager.parent = u(e), e._adsManager.parent = u(e), R(S).platformName = e.getName(), window.addEventListener("load", e._onWindowLoaded), e
                            }
                            return t = F, n = [{
                                key: "getInviteFriendsButtonDefaultStyle",
                                value: function() {
                                    return P()
                                }
                            }, {
                                key: "getSelectFriendsButtonDefaultStyle",
                                value: function() {
                                    return B()
                                }
                            }, {
                                key: "getShareFriendsButtonDefaultStyle",
                                value: function() {
                                    return M()
                                }
                            }, {
                                key: "getOpponent",
                                value: function() {
                                    return this.isInitialized() ? this._profileManager.getOpponent() : R(w).onNotInitialized("getOpponent")
                                }
                            }, {
                                key: "_onWindowLoaded",
                                value: function() {
                                    window.removeEventListener("load", this._onWindowLoaded), this._windowLoaded = !0
                                }
                            }, {
                                key: "getBase64Img",
                                value: (L = A(regeneratorRuntime.mark((function e() {
                                    var t, n, r;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.prev = 0, e.next = 3, window.fetch("./custom.update.png");
                                            case 3:
                                                return t = e.sent, e.next = 6, t.blob();
                                            case 6:
                                                return n = e.sent, e.next = 9, new Promise((function(e, t) {
                                                    var r = new FileReader;
                                                    r.onloadend = function() {
                                                        return e(r.result)
                                                    }, r.onerror = function() {
                                                        return t()
                                                    }, r.readAsDataURL(n)
                                                }));
                                            case 9:
                                                return r = e.sent, e.abrupt("return", r);
                                            case 13:
                                                return e.prev = 13, e.t0 = e.catch(0), R(w).onError(e.t0, I), e.abrupt("return", f);
                                            case 17:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, null, [
                                        [0, 13]
                                    ])
                                }))), function() {
                                    return L.apply(this, arguments)
                                })
                            }, {
                                key: "tick",
                                value: function() {
                                    var e = this,
                                        t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                                    void 0 !== this._timeout && clearTimeout(this._timeout), R(b).notify("tick", (new Date).getTime()), !0 === t && (this._timeout = setTimeout((function() {
                                        return e.tick(!0)
                                    }), 6e4))
                                }
                            }, {
                                key: "setLoadingTime",
                                value: function(e) {
                                    this.totalLoadingTime = e
                                }
                            }, {
                                key: "getLoadingTime",
                                value: function() {
                                    return this.totalLoadingTime
                                }
                            }, {
                                key: "getIAP",
                                value: function() {
                                    return this._iap
                                }
                            }, {
                                key: "getContextManager",
                                value: function() {
                                    return this._ctxManager
                                }
                            }, {
                                key: "getAchievementManager",
                                value: function() {
                                    return R(b)
                                }
                            }, {
                                key: "getProfileManager",
                                value: function() {
                                    return this._profileManager
                                }
                            }, {
                                key: "getMatchMakingManager",
                                value: function() {
                                    return this._matchMakingManager
                                }
                            }, {
                                key: "getBrowserLang",
                                value: function() {
                                    return this.isInitialized() ? R(D).getBrowserLang() : R(w).onNotInitialized("getBrowserLang")
                                }
                            }, {
                                key: "getLang",
                                value: (U = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("getLang"));
                                            case 2:
                                                return e.abrupt("return", R(D).getLang());
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return U.apply(this, arguments)
                                })
                            }, {
                                key: "fetchLang",
                                value: (H = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("fetchLang"));
                                            case 2:
                                                return e.abrupt("return", R(D).fetchLang(t));
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return H.apply(this, arguments)
                                })
                            }, {
                                key: "getTranslation",
                                value: (T = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("getTranslation"));
                                            case 2:
                                                return e.abrupt("return", R(D).getTranslation(t));
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return T.apply(this, arguments)
                                })
                            }, {
                                key: "hasLang",
                                value: function(e) {
                                    return this.isInitialized() ? R(D).hasLang(e) : R(w).onNotInitialized("hasLang")
                                }
                            }, {
                                key: "setAutoPreloadAds",
                                value: function(e) {
                                    this._adsManager.setAutoPreloadAds(e)
                                }
                            }, {
                                key: "getAutoPreloadAds",
                                value: function() {
                                    return this._adsManager.getAutoPreloadAds()
                                }
                            }, {
                                key: "getPlayerInfo",
                                value: function() {
                                    return this._playerInfo
                                }
                            }, {
                                key: "saveProgression",
                                value: (j = A(regeneratorRuntime.mark((function e(t, n) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("saveProgression"));
                                            case 2:
                                                return e.next = 4, this._store.save(t, n);
                                            case 4:
                                                return e.abrupt("return", !0);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t) {
                                    return j.apply(this, arguments)
                                })
                            }, {
                                key: "getSavedProgression",
                                value: (G = A(regeneratorRuntime.mark((function e() {
                                    var t, n = arguments;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (t = n.length > 0 && void 0 !== n[0] ? n[0] : [], this.isInitialized()) {
                                                    e.next = 3;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("getSavedProgression"));
                                            case 3:
                                                return e.next = 5, this._store.get(t);
                                            case 5:
                                                return e.abrupt("return", e.sent);
                                            case 6:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return G.apply(this, arguments)
                                })
                            }, {
                                key: "setConfig",
                                value: function(e) {
                                    this._config = e, this._adsManager.setConfig(e)
                                }
                            }, {
                                key: "setBestScore",
                                value: (x = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("setBestScore"));
                                            case 2:
                                                return e.next = 4, R(k).setBestScore(t);
                                            case 4:
                                                return e.abrupt("return", e.sent);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return x.apply(this, arguments)
                                })
                            }, {
                                key: "resetBestScore",
                                value: (O = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("resetBestScore"));
                                            case 2:
                                                return e.next = 4, R(k).resetBestScore(t);
                                            case 4:
                                                return e.abrupt("return", e.sent);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return O.apply(this, arguments)
                                })
                            }, {
                                key: "getBestScore",
                                value: (v = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("getBestScore"));
                                            case 2:
                                                return e.next = 4, R(k).getBestScore();
                                            case 4:
                                                return e.abrupt("return", e.sent);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return v.apply(this, arguments)
                                })
                            }, {
                                key: "getConfig",
                                value: function() {
                                    return this._config
                                }
                            }, {
                                key: "getName",
                                value: function() {
                                    return "base"
                                }
                            }, {
                                key: "init",
                                value: function() {
                                    var e = this;
                                    return new Promise((function(t, n) {
                                        e._windowLoaded ? (e._initialized = !0, t()) : window.addEventListener("load", (function n() {
                                            window.removeEventListener("load", n), e._initialized = !0, t()
                                        }))
                                    }))
                                }
                            }, {
                                key: "isInitialized",
                                value: function() {
                                    return this._initialized
                                }
                            }, {
                                key: "createShortcutAsync",
                                value: function() {
                                    return this.isInitialized() ? Promise.resolve(!1) : R(w).onNotInitialized("createShortcutAsync")
                                }
                            }, {
                                key: "notifyLoadingProgress",
                                value: function(e) {
                                    return this.isInitialized() ? Promise.resolve(!0) : R(w).onNotInitialized("notifyLoadingProgress")
                                }
                            }, {
                                key: "notifyLoadingComplete",
                                value: function() {
                                    return this.isInitialized() ? Promise.resolve(!0) : R(w).onNotInitialized("notifyLoadingComplete")
                                }
                            }, {
                                key: "notifyLevelEnd",
                                value: (d = A(regeneratorRuntime.mark((function e(t, n, r) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("notifyLevelEnd"));
                                            case 2:
                                                return e.next = 4, this.setBestScore(n);
                                            case 4:
                                                return e.abrupt("return", e.sent);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e, t, n) {
                                    return d.apply(this, arguments)
                                })
                            }, {
                                key: "hideBanner",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.hideBanner() : R(w).onNotInitialized("hideBanner")
                                }
                            }, {
                                key: "isBannerAvailable",
                                value: function() {
                                    return this._adsManager.isBannerAvailable()
                                }
                            }, {
                                key: "requestBannerAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.requestBannerAd() : R(w).onNotInitialized("requestBannerAd")
                                }
                            }, {
                                key: "preloadInterstitialAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.preloadInterstitialAd() : R(w).onNotInitialized("preloadInterstitialAd")
                                }
                            }, {
                                key: "showPreloadedInterstitialAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.showPreloadedInterstitialAd() : R(w).onNotInitialized("showPreloadedInterstitialAd")
                                }
                            }, {
                                key: "hasPreloadedInterstitialAd",
                                value: function() {
                                    return this._adsManager.hasPreloadedInterstitialAd()
                                }
                            }, {
                                key: "requestInterstitialAd",
                                value: (l = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("requestInterstitialAd"));
                                            case 2:
                                                return e.abrupt("return", this._adsManager.requestInterstitialAd());
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "preloadRewardedAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.preloadRewardedAd() : R(w).onNotInitialized("preloadRewardedAd")
                                }
                            }, {
                                key: "hasPreloadedRewardedAd",
                                value: function() {
                                    return this._adsManager.hasPreloadedRewardedAd()
                                }
                            }, {
                                key: "showPreloadedRewardedAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.showPreloadedRewardedAd() : R(w).onNotInitialized("showPreloadedRewardedAd")
                                }
                            }, {
                                key: "requestRewardedAd",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("requestRewardedAd"));
                                            case 2:
                                                return e.abrupt("return", this._adsManager.requestRewardedAd());
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "preloadRewardedInterstitialAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.preloadRewardedInterstitialAd() : R(w).onNotInitialized("preloadRewardedInterstitialAd")
                                }
                            }, {
                                key: "hasPreloadedRewardedInterstitialAd",
                                value: function() {
                                    return this._adsManager.hasPreloadedRewardedInterstitialAd()
                                }
                            }, {
                                key: "showPreloadedRewardedInterstitialAd",
                                value: function() {
                                    return this.isInitialized() ? this._adsManager.showPreloadedRewardedInterstitialAd() : R(w).onNotInitialized("showPreloadedRewardedInterstitialAd")
                                }
                            }, {
                                key: "requestRewardedInterstitialAd",
                                value: (r = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", R(w).onNotInitialized("requestRewardedInterstitialAd"));
                                            case 2:
                                                return e.abrupt("return", this._adsManager.requestRewardedInterstitialAd());
                                            case 3:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return r.apply(this, arguments)
                                })
                            }, {
                                key: "isDev",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "isFacebook",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "isGameSnacks",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "isTiktok",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "isYandex",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "isFlipkart",
                                value: function() {
                                    return !1
                                }
                            }, {
                                key: "setSDKInstance",
                                value: function(e) {
                                    this.sdkInstance = e, this._adsManager.sdkInstance = e
                                }
                            }, {
                                key: "getAdManager",
                                value: function() {
                                    return this._adsManager
                                }
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), F
                        }(l);
                    e.exports = x
                },
                4762: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function A(e, t) {
                        return A = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, A(e, t)
                    }

                    function o(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return a(e)
                    }

                    function a(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function s() {
                        return s = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                            var r = u(e, t);
                            if (r) {
                                var i = Object.getOwnPropertyDescriptor(r, t);
                                return i.get ? i.get.call(arguments.length < 3 ? e : n) : i.value
                            }
                        }, s.apply(this, arguments)
                    }

                    function u(e, t) {
                        for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = c(e)););
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(9730), n(6253), n(851), n(8388), n(8838), n(1520), n(3049), n(4882), n(2139), n(8132), n(5767), n(9115), n(6997), n(1181);
                    var l = n(8090).ERROR_MODULE,
                        d = n(8795).$ioc,
                        f = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && A(e, t)
                            }(g, e);
                            var t, n, r, u, f = (r = g, u = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(r);
                                if (u) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return o(this, e)
                            });

                            function g() {
                                var e, t, n, r, i;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, g), i = function(n, r, i) {
                                    return i && GAMESNACKS.levelComplete(n), i || GAMESNACKS.gameOver(), s((e = a(t), c(g.prototype)), "notifyLevelEnd", e).call(e, n, r, i)
                                }, (r = "notifyLevelEnd") in (n = a(t = f.call(this))) ? Object.defineProperty(n, r, {
                                    value: i,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : n[r] = i, t._audioHandler = t._audioHandler.bind(a(t)), t._mute = !1, t
                            }
                            return t = g, (n = [{
                                key: "_audioHandler",
                                value: function() {
                                    var e = GAMESNACKS.isAudioEnabled();
                                    this._mute !== e && null !== this.sdkInstance && (this._mute = e, e && this.sdkInstance.mute(), e || this.sdkInstance.unmute())
                                }
                            }, {
                                key: "notifyLoadingComplete",
                                value: function() {
                                    return this.isInitialized() ? (GAMESNACKS.subscribeToAudioUpdates(this._audioHandler), GAMESNACKS.gameReady(), this._mute = GAMESNACKS.isAudioEnabled(), Promise.resolve(!0)) : d(l).onNotInitialized("notifyLoadingComplete")
                                }
                            }, {
                                key: "getName",
                                value: function() {
                                    return "gamesnacks"
                                }
                            }, {
                                key: "isGameSnacks",
                                value: function() {
                                    return !0
                                }
                            }]) && i(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), g
                        }(n(287));
                    e.exports = f
                },
                2071: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function(t) {
                                return Object.getOwnPropertyDescriptor(e, t).enumerable
                            }))), n.push.apply(n, r)
                        }
                        return n
                    }

                    function A(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? i(Object(n), !0).forEach((function(t) {
                                f(e, t, n[t])
                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : i(Object(n)).forEach((function(t) {
                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                            }))
                        }
                        return e
                    }

                    function o(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function a(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, i) {
                                var A = e.apply(t, n);

                                function a(e) {
                                    o(A, r, i, a, s, "next", e)
                                }

                                function s(e) {
                                    o(A, r, i, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function s(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function u(e, t) {
                        return u = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, u(e, t)
                    }

                    function c(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return l(e)
                    }

                    function l(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function d(e) {
                        return d = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, d(e)
                    }

                    function f(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(5666), n(6253), n(851), n(9730), n(8388), n(8838), n(1520), n(2139), n(8132), n(7476), n(5767), n(8837), n(4882), n(4336), n(8351), n(7470), n(9115), n(6997), n(1181);
                    var g = n(1978),
                        I = n(4602).ADTYPE,
                        v = n(2975).getGPUTier,
                        h = n(8090),
                        p = h.ACHIEVEMENT_MODULE,
                        y = h.ERROR_MODULE,
                        m = h.LOGGER_MODULE,
                        C = n(8795).$ioc,
                        E = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && u(e, t)
                            }(h, e);
                            var t, n, r, i, o, g = (i = h, o = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = d(i);
                                if (o) {
                                    var n = d(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return c(this, e)
                            });

                            function h() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, h), f(l(e = g.call(this)), "enableAnalytics", (function(e, t, n) {
                                    return C(m).enableAnalytics(e, t, n)
                                })), f(l(e), "setBuildVersion", (function(e) {
                                    return C(m).setBuildVersion(e)
                                })), f(l(e), "getAnalytics", (function() {
                                    return C(m).getAnalytics()
                                })), f(l(e), "disableAnalytics", (function() {
                                    return C(m).disableAnalytics()
                                })), f(l(e), "isAnalyticsEnabled", (function() {
                                    return C(m).isAnalyticsEnabled()
                                })), f(l(e), "setPlatform", (function(t) {
                                    e._platform = t, e._platform.setSDKInstance(l(e)), e._platform.parent = l(e)
                                })), f(l(e), "getPlatform", (function() {
                                    return e._platform
                                })), f(l(e), "init", (function() {
                                    if (null !== e._platform) return e._platform.init().then((function() {
                                        return e._state = "ready", e.dispatch("ready", {}), e._startLoadingTime = (new Date).getTime(), e.dispatch("startLoading", {}), e._platform.isFacebook() && !e._platform.isDev() && e.loadConfigFromFile("./config.json"), !0
                                    }))
                                })), f(l(e), "saveProgression", (function(t, n) {
                                    null != e._platform && e._platform.saveProgression(t, n)
                                })), f(l(e), "getSavedProgression", (function(t) {
                                    return null != e._platform ? e._platform.getSavedProgression(t) : null
                                })), f(l(e), "pause", (function() {
                                    e.dispatch("pause", {})
                                })), f(l(e), "start", (function() {
                                    e.dispatch("start", {})
                                })), f(l(e), "stop", (function() {
                                    e.dispatch("stop", {})
                                })), f(l(e), "mute", (function() {
                                    e.dispatch("mute", {})
                                })), f(l(e), "resume", (function() {
                                    e.dispatch("resume", {})
                                })), f(l(e), "unmute", (function() {
                                    e.dispatch("unmute", {})
                                })), f(l(e), "getState", (function() {
                                    return e._state
                                })), f(l(e), "notifyLoadingProgress", (function(t) {
                                    null !== e._platform && e._platform.notifyLoadingProgress(t)
                                })), f(l(e), "notifyLoadingComplete", a(regeneratorRuntime.mark((function t() {
                                    var n;
                                    return regeneratorRuntime.wrap((function(t) {
                                        for (;;) switch (t.prev = t.next) {
                                            case 0:
                                                if (null !== e._platform) {
                                                    t.next = 2;
                                                    break
                                                }
                                                return t.abrupt("return", Promise.resolve(!1));
                                            case 2:
                                                return e._totalLoadingTime = (new Date).getTime() - e._startLoadingTime, e._platform.setLoadingTime(e._totalLoadingTime), C(m).onGamePreloadEnd(e._ms2seconds(e._totalLoadingTime)), t.next = 7, e._platform.notifyLoadingComplete();
                                            case 7:
                                                return n = t.sent, e._getAutoPreloadBanner() && (e.requestBannerAd().catch((function(e) {
                                                    return C(y).onError(e)
                                                })), C(m).log("************************************************************** "), C(m).log("*************** request banner automatically ***************** "), C(m).log("************************************************************** ")), C(m).isAnalyticsEnabled() && C(m).getAnalytics().init(), e._platform.getAutoPreloadAds() && (e._platform.preloadRewardedAd(), e._platform.preloadInterstitialAd(), e._platform.preloadRewardedInterstitialAd()), e._platform.getContextManager().init(), C(p).init((new Date).getTime(), "facebook" === e._platform.getName()), e._platform.tick(!0), t.abrupt("return", n);
                                            case 15:
                                            case "end":
                                                return t.stop()
                                        }
                                    }), t)
                                })))), f(l(e), "performHapticFeedBack", (function(t) {
                                    null !== e._platform && e._platform.performHapticFeedBack(t)
                                })), f(l(e), "notifyLevelStart", (function(e) {
                                    C(m).onLevelStarted(e)
                                })), f(l(e), "notifyUpdateScore", (function(t) {
                                    null !== e._platform && e._platform.setBestScore(t)
                                })), f(l(e), "notifyLevelEnd", (function(t, n, r) {
                                    if (C(m).onLevelEnd(n, r, t), null !== e._platform) return e._platform.notifyLevelEnd(t, n, r);
                                    Promise.resolve(!0)
                                })), f(l(e), "requestInterstitialAd", (function() {
                                    if (null !== e._platform) return e._platform.requestInterstitialAd().then((function(t) {
                                        return t && C(m).onAdImpression(I.INTERSTITIAL, e.getPlatform().getName()), t
                                    }))
                                })), f(l(e), "requestBannerAd", (function() {
                                    if (null !== e._platform) return e._platform.requestBannerAd().then((function(t) {
                                        return t && C(m).onAdImpression(I.BANNER, e.getPlatform().getName()), t
                                    }))
                                })), f(l(e), "requestRewardedAd", (function() {
                                    if (null !== e._platform) return e._platform.requestRewardedAd().then((function(t) {
                                        return t && C(m).onAdImpression(I.REWARDED, e.getPlatform().getName()), t
                                    }))
                                })), f(l(e), "createShortcutAsync", (function() {
                                    return null !== e._platform ? e._platform.createShortcutAsync() : Promise.resolve(!1)
                                })), e._state = "loading", e._platform = null, e._startLoadingTime = (new Date).getTime(), e._totalLoadingTime = 0, e.autoPreloadBanner = !0, e._bestScore = 0, e._ms2seconds = e._ms2seconds.bind(l(e)), e.getErrorManager = e.getErrorManager.bind(l(e)), e._setAutoPreloadBanner = e._setAutoPreloadBanner.bind(l(e)), e
                            }
                            return t = h, n = [{
                                key: "getErrorManager",
                                value: function() {
                                    return C(y)
                                }
                            }, {
                                key: "_setAutoPreloadBanner",
                                value: function(e) {
                                    this.autoPreloadBanner = !1 !== e.autoPreloadBanner, C(m).log("auto preload banner", this.autoPreloadBanner)
                                }
                            }, {
                                key: "_getAutoPreloadBanner",
                                value: function() {
                                    return this.autoPreloadBanner
                                }
                            }, {
                                key: "loadConfigFromFile",
                                value: (r = a(regeneratorRuntime.mark((function e(t) {
                                    var n, r, i;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, window.fetch(t);
                                            case 2:
                                                if ((n = e.sent).ok && null !== this._platform) {
                                                    e.next = 5;
                                                    break
                                                }
                                                return e.abrupt("return", !1);
                                            case 5:
                                                return e.prev = 5, e.next = 8, n.json();
                                            case 8:
                                                return r = e.sent, i = A(A({}, this._platform.getConfig()), r), this._setAutoPreloadBanner(i), C(m).log("load config: ", i), this._platform.setConfig(i), i.GAME_KEY && i.SECRET_KEY && !this.isAnalyticsEnabled() && this.enableAnalytics(i.GAME_KEY, i.SECRET_KEY, !0), e.abrupt("return", !0);
                                            case 17:
                                                return e.prev = 17, e.t0 = e.catch(5), e.abrupt("return", !1);
                                            case 20:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [5, 17]
                                    ])
                                }))), function(e) {
                                    return r.apply(this, arguments)
                                })
                            }, {
                                key: "getLogger",
                                value: function() {
                                    return C(m)
                                }
                            }, {
                                key: "getTotalLoadingTime",
                                value: function() {
                                    return this._totalLoadingTime
                                }
                            }, {
                                key: "_ms2seconds",
                                value: function(e) {
                                    var t = Math.floor(e / 1e3),
                                        n = Math.round(e - 1e3 * t);
                                    return t + Math.round(n / 10) / 100
                                }
                            }, {
                                key: "showPreloadedInterstitialAd",
                                value: function() {
                                    var e = this;
                                    if (null !== this._platform) return this._platform.showPreloadedInterstitialAd().then((function(t) {
                                        return t && C(m).onAdImpression(I.INTERSTITIAL, e.getPlatform().getName()), t
                                    }))
                                }
                            }, {
                                key: "hideBanner",
                                value: function() {
                                    return null === this._platform ? Promise.resolve(!1) : this._platform.hideBanner()
                                }
                            }, {
                                key: "isBannerAvailable",
                                value: function() {
                                    return null !== this._platform && this._platform.isBannerAvailable()
                                }
                            }, {
                                key: "preloadInterstitialAd",
                                value: function() {
                                    if (null !== this._platform) return this._platform.preloadInterstitialAd()
                                }
                            }, {
                                key: "preloadRewardedAd",
                                value: function() {
                                    if (null !== this._platform) return this._platform.preloadRewardedAd()
                                }
                            }, {
                                key: "showPreloadedRewardedAd",
                                value: function() {
                                    var e = this;
                                    if (null !== this._platform) return this._platform.showPreloadedRewardedAd().then((function(t) {
                                        return t && C(m).onAdImpression(I.REWARDED, e.getPlatform().getName()), t
                                    }))
                                }
                            }, {
                                key: "getGPUTier",
                                value: function() {
                                    return v()
                                }
                            }, {
                                key: "getLang",
                                value: function() {
                                    if (null !== this._platform) return this._platform.getLang()
                                }
                            }, {
                                key: "getTranslation",
                                value: function(e) {
                                    if (null !== this._platform) return this._platform.getTranslation(e)
                                }
                            }], n && s(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), h
                        }(g);
                    e.exports = E
                },
                6058: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t) {
                        return i = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, i(e, t)
                    }

                    function A(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return o(e)
                    }

                    function o(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function a(e) {
                        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, a(e)
                    }

                    function s(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(2850), n(2773), n(6253), n(851), n(8388), n(8838), n(1520), n(2139), n(8132), n(5767), n(9115), n(6997), n(1181);
                    var u = n(1978),
                        c = n(3104),
                        l = c.CALLED_BEFORE_INIT_ERROR,
                        d = c.GENERIC_ERROR,
                        f = c.LOGGABLE_ERRORS,
                        g = c.ANALYTICS_ERRORS,
                        I = n(8090).LOGGER_MODULE,
                        v = n(8795).$ioc,
                        h = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && i(e, t)
                            }(c, e);
                            var t, n, r, u = (n = c, r = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = a(n);
                                if (r) {
                                    var i = a(this).constructor;
                                    e = Reflect.construct(t, arguments, i)
                                } else e = t.apply(this, arguments);
                                return A(this, e)
                            });

                            function c() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, c), s(o(e = u.call(this)), "onError", (function(t) {
                                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : d;
                                    return f.includes(n) && v(I).log("error:", t), g.includes(n) && v(I).logFB("error", t), e.dispatch("sdkError", {
                                        type: n,
                                        error: t
                                    }), !1
                                })), s(o(e), "onAdFailed", (function(t, n) {
                                    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                                    e.dispatch("sdkError", {
                                        adType: t,
                                        type: "adError",
                                        error: n
                                    }), r && v(I).onAdFailed(t, n)
                                })), s(o(e), "onNotInitialized", (function() {
                                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                                    return e.onError("called an SDK method before being initialized: " + t, l), Promise.reject("called an SDK method before being initialized: " + t)
                                })), e
                            }
                            return t = c, Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), t
                        }(u);
                    e.exports = {
                        errorManager: new h
                    }
                },
                1978: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function i(e, t, n) {
                        return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                    }

                    function A(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(4336), n(3369), n(8416), n(9115), n(6253), n(6997), n(1181), n(8388);
                    var o = n(4559),
                        a = i((function e() {
                            "use strict";
                            var t = this;
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), A(this, "dispatch", (function(e, n) {
                                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                                    i = t._observers.get(e) || [],
                                    A = new o(e, null === r ? t : r, n);
                                i.forEach((function(e) {
                                    e(A)
                                })), null !== t.parent && t.parent.dispatch(e, n, t)
                            })), A(this, "hasEventListeners", (function(e) {
                                return void 0 !== t._observers.get(e)
                            })), A(this, "removeEventListener", (function(e, n) {
                                if (t.isEventListener(e, n)) {
                                    var r = t._observers.get(e);
                                    r.splice(r.indexOf(n), 1)
                                }
                            })), A(this, "isEventListener", (function(e, n) {
                                return (t._observers.get(e) || []).indexOf(n) > -1
                            })), A(this, "addEventListener", (function(e, n) {
                                if (t.isEventListener(e, n)) return !1;
                                var r = t._observers.get(e) || [];
                                return r.push(n), t._observers.set(e, r), !0
                            })), A(this, "removeAllEventListeners", (function() {
                                t._observers = new Map
                            })), this._observers = new Map, this.parent = null
                        }));
                    e.exports = a
                },
                4559: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function i(e, t, n) {
                        return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                    }

                    function A(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(8388);
                    var o = i((function e(t, n, r) {
                        "use strict";
                        var i = this;
                        ! function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), A(this, "getEventType", (function() {
                            return i._type
                        })), A(this, "getEmitter", (function() {
                            return i._emitter
                        })), A(this, "getPayload", (function() {
                            return i._payload
                        })), this._type = t, this._emitter = n, this._payload = r
                    }));
                    e.exports = o
                },
                3104: e => {
                    var t = "AD_FAILED_ERROR",
                        n = "ACHIEVEMENT_ERROR",
                        r = "HIDE_BANNER_ERROR",
                        i = "CALLED_BEFORE_INIT_ERROR",
                        A = "BASE64_IMG_ERROR",
                        o = "TRANSLATION_ERROR",
                        a = "SET_BEST_SCORE_ERROR",
                        s = "CREATE_SHORTCUT_ERROR",
                        u = "CHOOSE_RANDOM_FRIEND_ERROR",
                        c = "CHOOSE_CTX_WITH_FRIEND_ERROR",
                        l = "CREATE_CTX_WITH_FRIEND_ERROR",
                        d = "SWITCH_CTX_WITH_FRIEND_ERROR",
                        f = "INVITE_FRIEND_ERROR",
                        g = "IAP_ERROR",
                        I = "MATCHMAKING_ERROR",
                        v = [t, n, r, i, A, o, a, s, u, c, l, d, f, g, I],
                        h = [t];
                    e.exports = {
                        LOGGABLE_ERRORS: v,
                        ANALYTICS_ERRORS: h,
                        AD_FAILED_ERROR: t,
                        ACHIEVEMENT_ERROR: n,
                        HIDE_BANNER_ERROR: r,
                        CALLED_BEFORE_INIT_ERROR: i,
                        BASE64_IMG_ERROR: A,
                        TRANSLATION_ERROR: o,
                        SET_BEST_SCORE_ERROR: a,
                        CREATE_SHORTCUT_ERROR: s,
                        CHOOSE_RANDOM_FRIEND_ERROR: u,
                        CREATE_CTX_WITH_FRIEND_ERROR: l,
                        CHOOSE_CTX_WITH_FRIEND_ERROR: c,
                        SWITCH_CTX_WITH_FRIEND_ERROR: d,
                        INVITE_FRIEND_ERROR: f,
                        TOURNAMENT_ERROR: "TOURNAMENT_ERROR",
                        GENERIC_ERROR: "GENERIC_ERROR",
                        IAP_ERROR: g,
                        MATCHMAKING_ERROR: I
                    }
                },
                6204: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return u(e)
                    }

                    function u(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function c(e) {
                        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, c(e)
                    }
                    n(5666), n(9730), n(1876), n(6253), n(851), n(8838), n(1520), n(2139), n(8132), n(8388), n(5767), n(9115), n(6997), n(1181);
                    var l = n(1978),
                        d = n(3104).TRANSLATION_ERROR,
                        f = n(8090).ERROR_MODULE,
                        g = n(8795).$ioc,
                        I = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(p, e);
                            var t, n, r, i, l, I, v, h = (I = p, v = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = c(I);
                                if (v) {
                                    var n = c(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function p() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, p), (e = h.call(this))._dictionnary = {}, e._notfoundlang = {}, e._langPromises = {}, e._resolveObjPath = e._resolveObjPath.bind(u(e)), e.getBrowserLang = e.getBrowserLang.bind(u(e)), e.hasLang = e.hasLang.bind(u(e)), e.getTranslation = e.getTranslation.bind(u(e)), e.getLang = e.getLang.bind(u(e)), e.fetchLang = e.fetchLang.bind(u(e)), e.getDualLocalizations = e.getDualLocalizations.bind(u(e)), e.getTrialLocalizations = e.getTrialLocalizations.bind(u(e)), e.getNormalLocalizations = e.getNormalLocalizations.bind(u(e)), e
                            }
                            return t = p, n = [{
                                key: "_resolveObjPath",
                                value: function(e, t) {
                                    for (var n = t.split("."), r = e, i = 0; i < n.length; i++) {
                                        if (void 0 === r[n[i]]) return t;
                                        r = r[n[i]]
                                    }
                                    return r || t
                                }
                            }, {
                                key: "getBrowserLang",
                                value: function() {
                                    return window.navigator.language.substring(0, 2) || "en"
                                }
                            }, {
                                key: "hasLang",
                                value: function(e) {
                                    return void 0 !== this._dictionnary[e]
                                }
                            }, {
                                key: "getDualLocalizations",
                                value: function(e) {
                                    return {
                                        es_ES: "¡".concat(e, " te desafía a un partido!"),
                                        fr_FR: "".concat(e, " vous défie en match !"),
                                        en_US: "".concat(e, " is challenging you to a match !"),
                                        it_IT: "".concat(e, " ti sta sfidando ad un match!"),
                                        pt_PT: "".concat(e, " está a desafiá-lo para uma partida!"),
                                        de_DE: "".concat(e, " fordert Sie zu einem Wettkampf heraus!"),
                                        vi_VN: "".concat(e, " đang thách thức bạn một trận đấu!"),
                                        tr_TR: "".concat(e, " seni maça davet ediyor!")
                                    }
                                }
                            }, {
                                key: "getTrialLocalizations",
                                value: function(e) {
                                    return {
                                        es_ES: "".concat(e, " superó su mejor puntuación. ¡Intenta hacerlo mejor!"),
                                        fr_FR: "".concat(e, " a battu votre meilleur score. Essayez de faire mieux !"),
                                        en_US: "".concat(e, " beat your best score. Try to do better! "),
                                        it_IT: "".concat(e, " ha battuto il suo miglior punteggio. Cerca di fare meglio!"),
                                        pt_PT: "".concat(e, " bateu a sua melhor pontuação. Tente fazer melhor!"),
                                        de_DE: "".concat(e, " übertrifft dein bestes Ergebnis. Versuche, es besser zu machen!"),
                                        vi_VN: "".concat(e, " đánh bại điểm số tốt nhất của bạn. Cố gắng làm tốt hơn!"),
                                        tr_TR: "".concat(e, " en iyi skorunu geçti. Daha iyisini yapmaya çalış!")
                                    }
                                }
                            }, {
                                key: "getNormalLocalizations",
                                value: function(e) {
                                    return {
                                        es_ES: "".concat(e, " acaba de jugar, ¡ahora es tu turno!"),
                                        fr_FR: "".concat(e, " vient de jouer, maintenant c'est votre tour !"),
                                        en_US: "".concat(e, " just played, now it's your turn !"),
                                        it_IT: "".concat(e, " ha appena giocato, ora tocca a te!"),
                                        pt_PT: "".concat(e, " acabou de tocar, agora é a sua vez!"),
                                        de_DE: "".concat(e, " hat gerade gespielt, jetzt bist du dran!"),
                                        vi_VN: "".concat(e, " vừa chơi, giờ đến lượt bạn!"),
                                        tr_TR: "".concat(e, " az önce oynadı, şimdi sıra sende!")
                                    }
                                }
                            }, {
                                key: "getTranslation",
                                value: (l = A(regeneratorRuntime.mark((function e(t) {
                                    var n;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.prev = 0, e.next = 3, this.getLang();
                                            case 3:
                                                return n = e.sent, e.abrupt("return", this._resolveObjPath(this._dictionnary[n], t));
                                            case 7:
                                                return e.prev = 7, e.t0 = e.catch(0), g(f).onError(e.t0, d), e.abrupt("return", t);
                                            case 11:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 7]
                                    ])
                                }))), function(e) {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "getLang",
                                value: (i = A(regeneratorRuntime.mark((function e() {
                                    var t;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return t = this.getBrowserLang(), e.next = 3, this.fetchLang(t);
                                            case 3:
                                                if (!this.hasLang(t)) {
                                                    e.next = 7;
                                                    break
                                                }
                                                return e.abrupt("return", t);
                                            case 7:
                                                return e.next = 9, this.fetchLang("en");
                                            case 9:
                                                return e.abrupt("return", "en");
                                            case 10:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function() {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "fetchLang",
                                value: (r = A(regeneratorRuntime.mark((function e(t) {
                                    var n, r = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (!this.hasLang(t)) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return");
                                            case 2:
                                                if (!this._notfoundlang[t]) {
                                                    e.next = 4;
                                                    break
                                                }
                                                return e.abrupt("return");
                                            case 4:
                                                if (!this._langPromises[t]) {
                                                    e.next = 6;
                                                    break
                                                }
                                                return e.abrupt("return", this._langPromises[t]);
                                            case 6:
                                                return e.prev = 6, this._langPromises[t] = new Promise((function(e, n) {
                                                    r.addEventListener("lang_resolved", (function(n) {
                                                        n.getPayload().lang === t && e()
                                                    }))
                                                })), e.next = 10, window.fetch("./locales/" + t + ".json");
                                            case 10:
                                                if (!(n = e.sent).ok) {
                                                    e.next = 17;
                                                    break
                                                }
                                                return e.next = 14, n.json();
                                            case 14:
                                                this._dictionnary[t] = e.sent, e.next = 18;
                                                break;
                                            case 17:
                                                this._notfoundlang[t] = !0;
                                            case 18:
                                                this.dispatch("lang_resolved", {
                                                    lang: t
                                                }), e.next = 25;
                                                break;
                                            case 21:
                                                e.prev = 21, e.t0 = e.catch(6), g(f).onError(e.t0), this._notfoundlang[t] = !0;
                                            case 25:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [6, 21]
                                    ])
                                }))), function(e) {
                                    return r.apply(this, arguments)
                                })
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), p
                        }(l);
                    e.exports = I
                },
                3092: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(r, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    i(o, r, A, a, s, "next", e)
                                }

                                function s(e) {
                                    i(o, r, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a(e, t) {
                        return a = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, a(e, t)
                    }

                    function s(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return function(e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e)
                    }

                    function u(e) {
                        return u = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, u(e)
                    }
                    n(5666), n(2310), n(6253), n(851), n(8838), n(1520), n(2139), n(8132), n(8388), n(5767), n(9115), n(6997), n(1181);
                    var c = n(1978),
                        l = n(3104).IAP_ERROR,
                        d = n(8090),
                        f = d.ACHIEVEMENT_MODULE,
                        g = d.ERROR_MODULE,
                        I = n(8795).$ioc,
                        v = n(385),
                        h = n(4233).isIOS,
                        p = n(8538),
                        y = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && a(e, t)
                            }(b, e);
                            var t, n, r, i, c, d, y, m, C, E = (m = b, C = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = u(m);
                                if (C) {
                                    var n = u(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return s(this, e)
                            });

                            function b() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, b), (e = E.call(this))._init = !1, e._mock = new p, e
                            }
                            return t = b, n = [{
                                key: "setCatalog",
                                value: function(e) {
                                    this._mock.setCatalog(e)
                                }
                            }, {
                                key: "isIAPAvailable",
                                value: function() {
                                    return !h(navigator.userAgent) && !h(navigator.platform)
                                }
                            }, {
                                key: "init",
                                value: function() {
                                    var e = this;
                                    this._mock.onReady((function() {
                                        e._init = !0
                                    })), this._mock.triggerReady()
                                }
                            }, {
                                key: "isInitialized",
                                value: function() {
                                    return this._init
                                }
                            }, {
                                key: "getCatalogProductById",
                                value: (y = A(regeneratorRuntime.mark((function e(t) {
                                    var n;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.next = 2, this.getCatalog();
                                            case 2:
                                                return n = e.sent, e.abrupt("return", n.find((function(e) {
                                                    return e.productID === t
                                                })) || null);
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                }))), function(e) {
                                    return y.apply(this, arguments)
                                })
                            }, {
                                key: "getCatalog",
                                value: (d = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", Promise.reject("not initialized"));
                                            case 2:
                                                return e.prev = 2, e.next = 5, this._mock.getCatalogAsync();
                                            case 5:
                                                return e.abrupt("return", e.sent);
                                            case 8:
                                                return e.prev = 8, e.t0 = e.catch(2), I(g).onError(e.t0, l), e.abrupt("return", []);
                                            case 12:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [2, 8]
                                    ])
                                }))), function() {
                                    return d.apply(this, arguments)
                                })
                            }, {
                                key: "getUnconsumedPurchases",
                                value: (c = A(regeneratorRuntime.mark((function e() {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", Promise.reject("not initialized"));
                                            case 2:
                                                return e.prev = 2, e.next = 5, this._mock.getPurchasesAsync();
                                            case 5:
                                                return e.abrupt("return", e.sent);
                                            case 8:
                                                return e.prev = 8, e.t0 = e.catch(2), I(g).onError(e.t0, l), e.abrupt("return", []);
                                            case 12:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [2, 8]
                                    ])
                                }))), function() {
                                    return c.apply(this, arguments)
                                })
                            }, {
                                key: "purchase",
                                value: (i = A(regeneratorRuntime.mark((function e(t, n) {
                                    var r, i, A = arguments;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (r = A.length > 2 && void 0 !== A[2] && A[2], this.isInitialized()) {
                                                    e.next = 3;
                                                    break
                                                }
                                                return e.abrupt("return", Promise.reject("not initialized"));
                                            case 3:
                                                return e.prev = 3, e.next = 6, v.getInstance().init();
                                            case 6:
                                                if (e.sent) {
                                                    e.next = 9;
                                                    break
                                                }
                                                return e.abrupt("return", !1);
                                            case 9:
                                                return e.next = 11, this._mock.purchaseAsync({
                                                    productID: t,
                                                    developerPayload: n
                                                });
                                            case 11:
                                                if ((i = e.sent) && I(f).notify("buy_iap", (new Date).getTime()), r) {
                                                    e.next = 15;
                                                    break
                                                }
                                                return e.abrupt("return", !0);
                                            case 15:
                                                return e.next = 17, this.consume(i.purchaseToken);
                                            case 17:
                                                return e.abrupt("return", e.sent);
                                            case 20:
                                                return e.prev = 20, e.t0 = e.catch(3), I(g).onError(e.t0, l), e.abrupt("return", !1);
                                            case 24:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [3, 20]
                                    ])
                                }))), function(e, t) {
                                    return i.apply(this, arguments)
                                })
                            }, {
                                key: "consume",
                                value: (r = A(regeneratorRuntime.mark((function e(t) {
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                if (this.isInitialized()) {
                                                    e.next = 2;
                                                    break
                                                }
                                                return e.abrupt("return", Promise.reject("not initialized"));
                                            case 2:
                                                return e.prev = 2, e.next = 5, this._mock.consumePurchaseAsync(t);
                                            case 5:
                                                return e.abrupt("return", !0);
                                            case 8:
                                                return e.prev = 8, e.t0 = e.catch(2), I(g).onError(e.t0, l), e.abrupt("return", !1);
                                            case 12:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [2, 8]
                                    ])
                                }))), function(e) {
                                    return r.apply(this, arguments)
                                })
                            }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), b
                        }(c);
                    e.exports = y
                },
                8538: (e, t, n) => {
                    function r(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function(t) {
                                return Object.getOwnPropertyDescriptor(e, t).enumerable
                            }))), n.push.apply(n, r)
                        }
                        return n
                    }

                    function i(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }

                    function A(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(6253), n(851), n(2310), n(3369), n(8388), n(7476), n(5767), n(8837), n(4882), n(4336), n(8351), n(7470);
                    var o = n(9838),
                        a = function() {
                            "use strict";

                            function e() {
                                ! function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, e), this.reset(), this._readyHandler = function() {}
                            }
                            var t, n;
                            return t = e, n = [{
                                key: "setCatalog",
                                value: function(e) {
                                    this._catalog = e
                                }
                            }, {
                                key: "reset",
                                value: function() {
                                    this.setCatalog([new o("1", "No Ads", "Buy to disable ads", "", "1€", 1, "EUR", "1234567"), new o("2", "Booster 1", "boost damage", "", "1€", 1, "EUR", "1234568"), new o("3", "Booster 2", "boost life", "", "1€", 1, "EUR", "1234569")]), this._purchased = [], this._consumed = []
                                }
                            }, {
                                key: "triggerReady",
                                value: function() {
                                    this._readyHandler.call()
                                }
                            }, {
                                key: "onReady",
                                value: function(e) {
                                    this._readyHandler = e
                                }
                            }, {
                                key: "getCatalogAsync",
                                value: function() {
                                    return Promise.resolve(this._catalog)
                                }
                            }, {
                                key: "getPurchasesAsync",
                                value: function() {
                                    return Promise.resolve(this._purchased)
                                }
                            }, {
                                key: "purchaseAsync",
                                value: function(e) {
                                    var t = this._catalog.find((function(t) {
                                        return t.productID === e.productID
                                    })) || null;
                                    return null === t ? Promise.reject("not existing product") : (this._purchased.push(t), Promise.resolve({
                                        isConsumed: !1,
                                        paymentActionType: "charge",
                                        paymentID: Math.round(1e6 * Math.random()),
                                        purchasePlatform: "FB",
                                        purchasePrice: {
                                            amount: t.priceAmount,
                                            currency: t.priceCurrencyCode
                                        },
                                        purchaseTime: (new Date).getTime(),
                                        purchaseToken: t.purchaseToken,
                                        signedRequest: "signed_request_" + t.title,
                                        developerPayload: e.developerPayload
                                    }))
                                }
                            }, {
                                key: "consumePurchaseAsync",
                                value: function(e) {
                                    var t = this._purchased.find((function(t) {
                                        return t.purchaseToken === e
                                    })) || null;
                                    return null === t ? Promise.reject("not purchased product") : (this._consumed.push(t), this._purchased.splice(this._purchased.indexOf(t), 1), Promise.resolve(function(e) {
                                        for (var t = 1; t < arguments.length; t++) {
                                            var n = null != arguments[t] ? arguments[t] : {};
                                            t % 2 ? r(Object(n), !0).forEach((function(t) {
                                                i(e, t, n[t])
                                            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                            }))
                                        }
                                        return e
                                    }({}, t)))
                                }
                            }], n && A(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), e
                        }();
                    e.exports = a
                },
                9838: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function i(e, t, n) {
                        return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                    }
                    n(8388);
                    var A = i((function e(t, n, r, i, A, o, a, s) {
                        "use strict";
                        ! function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), this.description = r, this.imageURI = i, this.price = A, this.priceAmount = o, this.priceCurrencyCode = a, this.productID = t, this.title = n, this.purchaseToken = s
                    }));
                    e.exports = A
                },
                7130: (e, t, n) => {
                    var r = n(2071),
                        i = n(4762);
                    (0, n(9897).configSnacksIOC)();
                    var A = new i,
                        o = new r;
                    o.setPlatform(A), e.exports = {
                        H5SDK: o
                    }
                },
                2089: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(9730), n(8388);
                    var i, A, o = function() {
                        "use strict";

                        function e() {
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), this._dic = {}, this.unregister = this.unregister.bind(this), this.register = this.register.bind(this), this.resolve = this.resolve.bind(this), this.has = this.has.bind(this), this.get = this.get.bind(this)
                        }
                        var t, n, i;
                        return t = e, n = [{
                            key: "has",
                            value: function(e) {
                                return null !== this.get(e)
                            }
                        }, {
                            key: "unregister",
                            value: function(e) {
                                this.has(e) && delete this._dic[e]
                            }
                        }, {
                            key: "register",
                            value: function(e, t) {
                                var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                                this._dic[e] = {
                                    producer: t,
                                    singleton: n,
                                    cache: null
                                }
                            }
                        }, {
                            key: "resolve",
                            value: function(e) {
                                var t = this.get(e);
                                if (null === t || "function" != typeof t.producer) return null;
                                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
                                return t.singleton ? (null === t.cache && (t.cache = t.producer.apply(t, r)), t.cache) : t.producer.apply(t, r)
                            }
                        }, {
                            key: "get",
                            value: function(e) {
                                return this._dic[e] || null
                            }
                        }], i = [{
                            key: "getInstance",
                            value: function() {
                                return null === e._instance && (e._instance = new e), e._instance
                            }
                        }], n && r(t.prototype, n), i && r(t, i), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), e
                    }();
                    (A = "_instance") in (i = o) ? Object.defineProperty(i, A, {
                        value: null,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }): i[A] = null, e.exports = o
                },
                9897: (e, t, n) => {
                    var r = n(8090),
                        i = r.STORE_MODULE,
                        A = r.PROFILE_MODULE,
                        o = r.CONTEXT_MODULE,
                        a = r.MATCHMAKING_MODULE,
                        s = r.ADS_MODULE,
                        u = r.IAP_MODULE,
                        c = r.ACHIEVEMENT_MODULE,
                        l = r.ERROR_MODULE,
                        d = r.LOGGER_MODULE,
                        f = r.SCORE_MODULE,
                        g = r.ANALYTICS_MODULE,
                        I = r.I18N_MODULE,
                        v = n(4602).H5Analytics,
                        h = n(6874).achievementManager,
                        p = n(6058).errorManager,
                        y = n(5265).logger,
                        m = n(2089),
                        C = n(7862),
                        E = n(3282),
                        b = n(6748),
                        w = n(2219),
                        S = n(6807),
                        k = n(3092),
                        D = n(1306),
                        R = n(6204);
                    e.exports = {
                        configSnacksIOC: function() {
                            var e = m.getInstance();
                            e.register(i, (function() {
                                return new C
                            }), !0), e.register(A, (function() {
                                return new E
                            }), !0), e.register(o, (function() {
                                return new b
                            }), !0), e.register(a, (function() {
                                return new w
                            }), !0), e.register(s, (function() {
                                return new S
                            }), !0), e.register(u, (function() {
                                return new k
                            }), !0), e.register(f, (function() {
                                return new D
                            }), !0), e.register(I, (function() {
                                return new R
                            }), !0), e.register(c, (function() {
                                return h
                            })), e.register(l, (function() {
                                return p
                            })), e.register(d, (function() {
                                return y
                            })), e.register(g, (function(e, t, n) {
                                return new v(e, t, n)
                            }))
                        }
                    }
                },
                8090: e => {
                    e.exports = {
                        STORE_MODULE: "storeModule",
                        PROFILE_MODULE: "profileModule",
                        CONTEXT_MODULE: "contextModule",
                        MATCHMAKING_MODULE: "matchMakingModule",
                        ADS_MODULE: "adsModule",
                        IAP_MODULE: "iapModule",
                        ACHIEVEMENT_MODULE: "achievementModule",
                        LOGGER_MODULE: "loggerModule",
                        ERROR_MODULE: "errorModule",
                        SCORE_MODULE: "scoreModule",
                        ANALYTICS_MODULE: "analyticsModule",
                        I18N_MODULE: "i18nModule"
                    }
                },
                8795: (e, t, n) => {
                    var r = n(2089);
                    e.exports = {
                        $ioc: function(e) {
                            for (var t, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), A = 1; A < n; A++) i[A - 1] = arguments[A];
                            return (t = r.getInstance(e)).resolve.apply(t, [e].concat(i))
                        }
                    }
                },
                5265: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function i(e, t, n) {
                        return t && r(e.prototype, t), n && r(e, n), Object.defineProperty(e, "prototype", {
                            writable: !1
                        }), e
                    }

                    function A(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(6059), n(8388);
                    var o = n(3119).version,
                        a = (n(4602).H5Analytics, n(8795).$ioc),
                        s = n(8090).ANALYTICS_MODULE,
                        u = i((function e() {
                            "use strict";
                            var t = this;
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), A(this, "setVerbose", (function(e) {
                                t._verbose = !0 === e, t.logFB("setVerbose", {
                                    value: e
                                }), t.log("setVerbose", e)
                            })), A(this, "isVerbose", (function() {
                                return t._verbose
                            })), A(this, "enableAnalytics", (function(e, n, r) {
                                return t.logFB("enableAnalytics", {
                                    gameKey: e,
                                    secretKey: n,
                                    debug: r
                                }), t.log("enableAnalytics", e, n, r), t._tracking = a(s, e, n, r), t.getAnalytics()
                            })), A(this, "getAnalytics", (function() {
                                return t._tracking
                            })), A(this, "isAnalyticsEnabled", (function() {
                                return null !== t._tracking
                            })), A(this, "disableAnalytics", (function() {
                                t._tracking = null, t.logFB("disableAnalytics", {
                                    buildVersion
                                }), t.log("disableAnalytics")
                            })), A(this, "setBuildVersion", (function(e) {
                                t.isAnalyticsEnabled() && t._tracking.onGameSetBuildVersion(e), t.logFB("setBuildVersion", {
                                    buildVersion: e
                                }), t.log("setBuildVersion", e)
                            })), A(this, "onAchievementComplete", (function(e) {
                                t.isAnalyticsEnabled() && t._tracking.onCustomEvent(e.name, 1), t.logFB(e.name), t.log(e.name)
                            })), A(this, "onGamePreloadEnd", (function(e) {
                                t.isAnalyticsEnabled() && t._tracking.onGamePreloadEnd(e), t.logFB("onGamePreloadEnd", {
                                    time: e
                                }), t.log("onGamePreloadEnd", e)
                            })), A(this, "onLevelStarted", (function(e) {
                                t.isAnalyticsEnabled() && t._tracking.onLevelStarted(e), t.logFB("onLevelStarted", {
                                    levelId: e
                                }), t.log("onLevelStarted", e)
                            })), A(this, "onLevelEnd", (function(e, n, r) {
                                t.isAnalyticsEnabled() && t._tracking.onLevelEnded(e, n, r), t.logFB("onLevelEnd", {
                                    score: e,
                                    levelWon: n,
                                    levelId: r
                                }), t.log("onLevelEnd:", e, n, r)
                            })), A(this, "onAdImpression", (function(e, n) {
                                t.isAnalyticsEnabled() && t._tracking.onAdImpression(e, n.substring(0, 30)), t.logFB("impression_" + e.name, n), t.log("impression:", e.name, n)
                            })), A(this, "onAdFailed", (function(e, n) {
                                t.isAnalyticsEnabled() && t._tracking.onAdFailedLoad(e, t.platformName), t.logFB("onAdFailed_" + e.name, t.platformName, n), t.log("onAdFailed:", e.name, t.platformName, n)
                            })), A(this, "onError", (function(e) {
                                return t.logFB("error", e), t.log("error:", e), !1
                            })), A(this, "logFB", (function(e, t) {
                                var n = window.FBInstant;
                                void 0 !== n && void 0 !== n.logEvent && n.logEvent(e, 0, t)
                            })), A(this, "log", (function() {
                                var e;
                                t.isVerbose() && (e = console).log.apply(e, arguments)
                            })), this._tracking = null, this._verbose = !0, console.log("Voodoo H5SDK v" + o)
                        }));
                    e.exports = {
                        logger: new u
                    }
                },
                2219: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(6253), n(851), n(8388);
                    var i = function() {
                        "use strict";

                        function e() {
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e)
                        }
                        var t, n;
                        return t = e, (n = [{
                            key: "findMatch",
                            value: function() {
                                return Promise.resolve(!0)
                            }
                        }]) && r(t.prototype, n), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), e
                    }();
                    e.exports = i
                },
                6020: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(9730), n(8388);
                    var i = function() {
                        "use strict";

                        function e() {
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), this.resetRatio(608, 1080), this._html = null, this.cover = this.cover.bind(this), this.onResize = this.onResize.bind(this), this.initEvents = this.initEvents.bind(this)
                        }
                        var t, n;
                        return t = e, (n = [{
                            key: "resetRatio",
                            value: function(e, t) {
                                this._viewWidth = e, this._viewHeight = t, this._hCoef = e / t, this._wCoef = t / e
                            }
                        }, {
                            key: "cover",
                            value: function(e, t, n) {
                                e.style.height = n + "px", e.style.width = n * this._hCoef + "px", n * this._hCoef >= t && (e.style.height = t * this._wCoef + "px", e.style.width = t + "px");
                                var r = e.getBoundingClientRect().width,
                                    i = e.getBoundingClientRect().height;
                                e.style.position = "absolute", e.style.zIndex = 1e3, e.style.left = (t - r >> 1) + "px", e.style.top = (n - i >> 1) + "px"
                            }
                        }, {
                            key: "onResize",
                            value: function() {
                                this.cover(this._html, window.innerWidth, window.innerHeight)
                            }
                        }, {
                            key: "initEvents",
                            value: function() {
                                window.addEventListener("resize", this.onResize)
                            }
                        }]) && r(t.prototype, n), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), e
                    }();
                    e.exports = i
                },
                385: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function o() {
                        return o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                            var r = a(e, t);
                            if (r) {
                                var i = Object.getOwnPropertyDescriptor(r, t);
                                return i.get ? i.get.call(arguments.length < 3 ? e : n) : i.value
                            }
                        }, o.apply(this, arguments)
                    }

                    function a(e, t) {
                        for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = l(e)););
                        return e
                    }

                    function s(e, t) {
                        return s = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, s(e, t)
                    }

                    function u(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return c(e)
                    }

                    function c(e) {
                        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return e
                    }

                    function l(e) {
                        return l = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, l(e)
                    }

                    function d(e, t, n) {
                        return t in e ? Object.defineProperty(e, t, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : e[t] = n, e
                    }
                    n(5666), n(9730), n(6253), n(851), n(8388), n(8838), n(1520), n(2139), n(8132), n(3049), n(4882), n(5767), n(9115), n(6997), n(1181);
                    var f = n(5044).CLOSE2,
                        g = function(e) {
                            "use strict";
                            ! function(e, t) {
                                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                                e.prototype = Object.create(t && t.prototype, {
                                    constructor: {
                                        value: e,
                                        writable: !0,
                                        configurable: !0
                                    }
                                }), Object.defineProperty(e, "prototype", {
                                    writable: !1
                                }), t && s(e, t)
                            }(h, e);
                            var t, n, r, a, d, g, I, v = (g = h, I = function() {
                                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                                if (Reflect.construct.sham) return !1;
                                if ("function" == typeof Proxy) return !0;
                                try {
                                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                                } catch (e) {
                                    return !1
                                }
                            }(), function() {
                                var e, t = l(g);
                                if (I) {
                                    var n = l(this).constructor;
                                    e = Reflect.construct(t, arguments, n)
                                } else e = t.apply(this, arguments);
                                return u(this, e)
                            });

                            function h() {
                                var e;
                                return function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, h), (e = v.call(this))._html = "", e._skip = null, e._content = null, e._content2 = null, e._share = null, e.init = e.init.bind(c(e)), e.autoClose = !1, e.autoConfirm = !1, e
                            }
                            return t = h, n = [{
                                key: "cover",
                                value: function(e, t, n) {
                                    o(l(h.prototype), "cover", this).call(this, e, t, n);
                                    var r = Math.min(250, n),
                                        i = Math.min(250, t);
                                    this._html.style.height = r + "px", this._html.style.width = i + "px", this._html.style.top = "calc(50% - " + r / 2 + "px)", this._html.style.left = "calc(50% - " + i / 2 + "px)"
                                }
                            }, {
                                key: "init",
                                value: (a = regeneratorRuntime.mark((function e() {
                                    var t = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return this._html = document.createElement("div"), this._html.style["background-color"] = "#1a74e4", this._html.style["border-radius"] = "15px", this._html.style.width = Math.min(250, this._viewWidth) + "px", this._html.style.height = Math.min(250, this._viewHeight) + "px", this._html.style["border-radius"] = "15px", this._html.style.border = "2px solid black", this._html.style.display = "flex", this._html.style["flex-wrap"] = "wrap", this._html.style["flex-direction"] = "column", this._html.style["justify-content"] = "center", this._html.style["align-content"] = "center", this._html.style["align-items"] = "center", this._skipContainer = document.createElement("div"), this._skipContainer.style.position = "absolute", this._skipContainer.style.top = "-15px", this._skipContainer.style.right = "-15px", this._skipContainer.style.padding = "5px", this._skipContainer.style.border = "2px solid black", this._skipContainer.style["border-radius"] = "8px", this._skipContainer.style["background-color"] = "#333333", this._skipContainer.style.cursor = "pointer", this._html.appendChild(this._skipContainer), this._skip = document.createElement("img"), this._skip.style.width = "20px", this._skip.src = f, this._skipContainer.appendChild(this._skip), this._content = document.createElement("p"), this._content.style["font-family"] = "arial", this._content.style["font-size"] = "1.3rem", this._content.style["font-weight"] = "bold", this._content.style["text-align"] = "center", this._content.style.color = "white", this._content.style.width = "90%", this._content.style["text-shadow"] = "1px 2px 0px #111111", this._content.innerHTML = "Confirm buying ?", this._content.style["pointer-events"] = "none", this._html.appendChild(this._content), this._share = document.createElement("button"), this._share.style["background-color"] = "rgb(220,57,125)", this._share.style["font-family"] = "arial", this._share.style["font-weight"] = "bold", this._share.style["font-size"] = "1.3rem", this._share.style["margin-left"] = "auto", this._share.style["margin-right"] = "auto", this._share.style["margin-top"] = "25px", this._share.style["text-align"] = "center", this._share.style.padding = "10px", this._share.style["border-radius"] = "8px", this._share.style.cursor = "pointer", this._share.style.color = "#FFFFFF", this._share.style["text-shadow"] = "0px 2px 0px #111111", this._share.style.border = "2px solid black", this._share.style.width = "30%", this._share.style["box-shadow"] = "0px 1px 3px 1px rgba(0,0,0,0.8)", this._share.innerText = "YES", this._html.appendChild(this._share), this._html.parentNode && this._html.parentNode.removeChild(this._html), this._html.style.transition = "all 0s", this._html.style.transform = "scale(1,1)", document.body.appendChild(this._html), this.initEvents(), this.onResize(), e.abrupt("return", new Promise((function(e, n) {
                                                    var r = function n(r) {
                                                        t._html.parentNode.removeChild(t._html), t._skipContainer.removeEventListener("click", n), t._share.removeEventListener("click", n), t._skip.removeEventListener("click", n), r && (r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation());
                                                        var i = r && r.target === t._share || t.autoConfirm;
                                                        e(i)
                                                    };
                                                    t._skipContainer.addEventListener("click", r), t._share.addEventListener("click", r), t._skip.addEventListener("click", r), !0 === t.autoClose && (t._skipContainer.removeEventListener("click", r), t._share.removeEventListener("click", r), t._skip.removeEventListener("click", r), setTimeout(r, h.AUTOCLOSE_TIME))
                                                })));
                                            case 64:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })), d = function() {
                                    var e = this,
                                        t = arguments;
                                    return new Promise((function(n, r) {
                                        var A = a.apply(e, t);

                                        function o(e) {
                                            i(A, n, r, o, s, "next", e)
                                        }

                                        function s(e) {
                                            i(A, n, r, o, s, "throw", e)
                                        }
                                        o(void 0)
                                    }))
                                }, function() {
                                    return d.apply(this, arguments)
                                })
                            }], r = [{
                                key: "getInstance",
                                value: function() {
                                    return null === h._instance && (h._instance = new h), h._instance
                                }
                            }], n && A(t.prototype, n), r && A(t, r), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), h
                        }(n(6020));
                    d(g, "_instance", null), d(g, "AUTOCLOSE_TIME", 2e3), e.exports = g
                },
                9354: (e, t, n) => {
                    function r(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }

                    function i(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(6059), n(8388);
                    var A = function() {
                        "use strict";

                        function e() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "no_name",
                                n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                                i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                A = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                                o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0;
                            r(this, e), this.id = "", this.isRealScore = !0, this.name = t, this.imguri = n, this.isFriend = i, this.isBot = A, this.score = o, this.isOpponent = !1
                        }
                        var t, n;
                        return t = e, n = [{
                            key: "setRealScore",
                            value: function(e) {
                                this.score = e, this.isRealScore = !0
                            }
                        }, {
                            key: "setScoreBetween",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                    t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
                                    r = t - e,
                                    i = Math.random(),
                                    A = Math.round(i * r / n);
                                this.score = e + A * n, this.isRealScore = !1
                            }
                        }], n && i(t.prototype, n), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), e
                    }();
                    e.exports = A
                },
                3282: (e, t, n) => {
                    function r(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function i(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(5666), n(75), n(4336), n(110), n(2310), n(6059), n(3369), n(8388), n(6253), n(851);
                    var A = n(9354),
                        o = function() {
                            "use strict";

                            function e() {
                                ! function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, e), this._bots = []
                            }
                            var t, n, o, a;
                            return t = e, n = [{
                                key: "getProfiles",
                                value: (o = regeneratorRuntime.mark((function e() {
                                    var t, n, r, i, A, o, a = arguments;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return t = a.length > 0 && void 0 !== a[0] ? a[0] : 1, n = a.length > 1 && void 0 !== a[1] ? a[1] : 0, r = a.length > 2 && void 0 !== a[2] ? a[2] : 1e3, i = a.length > 3 && void 0 !== a[3] ? a[3] : 10, A = this.getBots(), o = Math.round(3 * Math.random()), A.sort((function(e, t) {
                                                    return Math.random() > .5 ? 1 : -1
                                                })), A.forEach((function(e, t) {
                                                    e.isFriend = t <= o, e.isBot = !e.isFriend, e.setScoreBetween(n, r, i)
                                                })), e.abrupt("return", A.slice(0, t));
                                            case 9:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })), a = function() {
                                    var e = this,
                                        t = arguments;
                                    return new Promise((function(n, i) {
                                        var A = o.apply(e, t);

                                        function a(e) {
                                            r(A, n, i, a, s, "next", e)
                                        }

                                        function s(e) {
                                            r(A, n, i, a, s, "throw", e)
                                        }
                                        a(void 0)
                                    }))
                                }, function() {
                                    return a.apply(this, arguments)
                                })
                            }, {
                                key: "getOpponent",
                                value: function() {
                                    return this.getProfiles()
                                }
                            }, {
                                key: "getBots",
                                value: function() {
                                    return this._bots
                                }
                            }, {
                                key: "removeBot",
                                value: function(e) {
                                    var t = this._bots.find((function(t) {
                                        return t.name === e
                                    })) || null;
                                    null !== t && this._bots.splice(this._bots.indexOf(t), 1)
                                }
                            }, {
                                key: "addBot",
                                value: function(e, t, n) {
                                    this._bots.push(new A(e, t, !1, !0, n))
                                }
                            }], n && i(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), e
                        }();
                    e.exports = o
                },
                1306: (e, t, n) => {
                    function r(e) {
                        return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                            return typeof e
                        } : function(e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                        }, r(e)
                    }

                    function i(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function A(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }

                    function o(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }

                    function a() {
                        return a = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
                            var r = s(e, t);
                            if (r) {
                                var i = Object.getOwnPropertyDescriptor(r, t);
                                return i.get ? i.get.call(arguments.length < 3 ? e : n) : i.value
                            }
                        }, a.apply(this, arguments)
                    }

                    function s(e, t) {
                        for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = l(e)););
                        return e
                    }

                    function u(e, t) {
                        return u = Object.setPrototypeOf || function(e, t) {
                            return e.__proto__ = t, e
                        }, u(e, t)
                    }

                    function c(e, t) {
                        if (t && ("object" === r(t) || "function" == typeof t)) return t;
                        if (void 0 !== t) throw new TypeError("Derived constructors may only return object or undefined");
                        return function(e) {
                            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                            return e
                        }(e)
                    }

                    function l(e) {
                        return l = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                            return e.__proto__ || Object.getPrototypeOf(e)
                        }, l(e)
                    }
                    n(8838), n(1520), n(2139), n(8132), n(8388), n(3049), n(4882), n(6253), n(851), n(5767), n(9115), n(6997), n(1181), n(5666);
                    var d = function(e) {
                        "use strict";
                        ! function(e, t) {
                            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                            e.prototype = Object.create(t && t.prototype, {
                                constructor: {
                                    value: e,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), Object.defineProperty(e, "prototype", {
                                writable: !1
                            }), t && u(e, t)
                        }(I, e);
                        var t, n, r, s, d, f, g = (d = I, f = function() {
                            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                            if (Reflect.construct.sham) return !1;
                            if ("function" == typeof Proxy) return !0;
                            try {
                                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
                            } catch (e) {
                                return !1
                            }
                        }(), function() {
                            var e, t = l(d);
                            if (f) {
                                var n = l(this).constructor;
                                e = Reflect.construct(t, arguments, n)
                            } else e = t.apply(this, arguments);
                            return c(this, e)
                        });

                        function I() {
                            return A(this, I), g.apply(this, arguments)
                        }
                        return t = I, n = [{
                            key: "setBestScore",
                            value: (r = regeneratorRuntime.mark((function e(t) {
                                return regeneratorRuntime.wrap((function(e) {
                                    for (;;) switch (e.prev = e.next) {
                                        case 0:
                                            return e.next = 2, a(l(I.prototype), "setBestScore", this).call(this, t);
                                        case 2:
                                            return GAMESNACKS.sendScore(t), e.abrupt("return", this.hasBeenUpdated());
                                        case 4:
                                        case "end":
                                            return e.stop()
                                    }
                                }), e, this)
                            })), s = function() {
                                var e = this,
                                    t = arguments;
                                return new Promise((function(n, A) {
                                    var o = r.apply(e, t);

                                    function a(e) {
                                        i(o, n, A, a, s, "next", e)
                                    }

                                    function s(e) {
                                        i(o, n, A, a, s, "throw", e)
                                    }
                                    a(void 0)
                                }))
                            }, function(e) {
                                return s.apply(this, arguments)
                            })
                        }], n && o(t.prototype, n), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), I
                    }(n(6917));
                    e.exports = d
                },
                6917: (e, t, n) => {
                    function r(e, t, n, r, i, A, o) {
                        try {
                            var a = e[A](o),
                                s = a.value
                        } catch (e) {
                            return void n(e)
                        }
                        a.done ? t(s) : Promise.resolve(s).then(r, i)
                    }

                    function i(e) {
                        return function() {
                            var t = this,
                                n = arguments;
                            return new Promise((function(i, A) {
                                var o = e.apply(t, n);

                                function a(e) {
                                    r(o, i, A, a, s, "next", e)
                                }

                                function s(e) {
                                    r(o, i, A, a, s, "throw", e)
                                }
                                a(void 0)
                            }))
                        }
                    }

                    function A(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(8388), n(6253), n(851), n(5666);
                    var o = n(3104).SET_BEST_SCORE_ERROR,
                        a = n(8090),
                        s = a.STORE_MODULE,
                        u = a.ERROR_MODULE,
                        c = n(8795).$ioc,
                        l = function() {
                            "use strict";

                            function e() {
                                ! function(e, t) {
                                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                }(this, e), this._updated = !1
                            }
                            var t, n, r, a, l;
                            return t = e, n = [{
                                key: "setUpdated",
                                value: function(e) {
                                    this._updated = !0 === e
                                }
                            }, {
                                key: "hasBeenUpdated",
                                value: function() {
                                    return this._updated
                                }
                            }, {
                                key: "setBestScore",
                                value: (l = i(regeneratorRuntime.mark((function e(t) {
                                    var n, r;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return e.prev = 0, e.next = 3, this.getBestScore();
                                            case 3:
                                                if (n = e.sent, r = c(s), !(t > n)) {
                                                    e.next = 11;
                                                    break
                                                }
                                                return e.next = 8, r.save("___internalBestScore___", t);
                                            case 8:
                                                this._updated = !0, e.next = 12;
                                                break;
                                            case 11:
                                                this._updated = !1;
                                            case 12:
                                                e.next = 18;
                                                break;
                                            case 14:
                                                e.prev = 14, e.t0 = e.catch(0), this._updated = !1, c(u).onError(e.t0, o);
                                            case 18:
                                                return e.abrupt("return", this.hasBeenUpdated());
                                            case 19:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this, [
                                        [0, 14]
                                    ])
                                }))), function(e) {
                                    return l.apply(this, arguments)
                                })
                            }, {
                                key: "getBestScore",
                                value: (a = i(regeneratorRuntime.mark((function e() {
                                    var t, n, r;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return t = c(s), e.next = 3, t.get(["___internalBestScore___"]);
                                            case 3:
                                                return n = e.sent, r = n && n.___internalBestScore___ ? n.___internalBestScore___ : 0, e.abrupt("return", r);
                                            case 6:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e)
                                }))), function() {
                                    return a.apply(this, arguments)
                                })
                            }, {
                                key: "resetBestScore",
                                value: (r = i(regeneratorRuntime.mark((function e(t) {
                                    var n;
                                    return regeneratorRuntime.wrap((function(e) {
                                        for (;;) switch (e.prev = e.next) {
                                            case 0:
                                                return n = c(s), e.next = 3, n.save("___internalBestScore___", t);
                                            case 3:
                                                return e.abrupt("return", e.sent);
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e)
                                }))), function(e) {
                                    return r.apply(this, arguments)
                                })
                            }], n && A(t.prototype, n), Object.defineProperty(t, "prototype", {
                                writable: !1
                            }), e
                        }();
                    e.exports = l
                },
                7862: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0; n < t.length; n++) {
                            var r = t[n];
                            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                        }
                    }
                    n(6253), n(851), n(4336), n(8388);
                    var i = function() {
                        "use strict";

                        function e() {
                            ! function(e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e)
                        }
                        var t, n;
                        return t = e, n = [{
                            key: "save",
                            value: function(e, t) {
                                return window.localStorage.setItem(e, JSON.stringify(t)), Promise.resolve(!0)
                            }
                        }, {
                            key: "get",
                            value: function() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                                    t = e;
                                "string" == typeof e && (t = [e]);
                                var n = {};
                                return t.forEach((function(e) {
                                    n[e] = JSON.parse(window.localStorage.getItem(e))
                                })), Promise.resolve(n)
                            }
                        }], n && r(t.prototype, n), Object.defineProperty(t, "prototype", {
                            writable: !1
                        }), e
                    }();
                    e.exports = i
                },
                2218: e => {
                    e.exports = {
                        getSelectFriendsButtonDefaultStyle: function() {
                            var e = document.createElement("style");
                            return e.setAttribute("type", "text/css"), e.textContent = "\n    .select-friends-button{\n        padding: 10px;\n        padding-left: 20px;\n        padding-right: 20px;\n        color: white; \n        font-weight: bold;\n        border-radius: 5px;\n        border: none;\n        background: rgb(255,255,255);\n        background: linear-gradient(40deg, rgba(255,255,255,1) 0%, rgba(64,1,149,1) 0%, rgba(172,80,57,1) 100%);\n        cursor: pointer;\n    }\n    ", e
                        },
                        getShareFriendsButtonDefaultStyle: function() {
                            var e = document.createElement("style");
                            return e.setAttribute("type", "text/css"), e.textContent = "\n    .share-friends-button{\n      padding: 10px;\n      padding-left: 20px;\n      padding-right: 20px;\n      color: white; \n      font-weight: bold;\n      border-radius: 5px;\n      border: none;\n      background: rgb(255,255,255);\n      background: linear-gradient(40deg, rgba(255,255,255,1) 0%, rgba(64,1,149,1) 0%, rgba(172,80,57,1) 100%);\n      cursor: pointer;\n    }\n    ", e
                        },
                        getInviteFriendsButtonDefaultStyle: function() {
                            var e = document.createElement("style");
                            return e.setAttribute("type", "text/css"), e.textContent = "\n    .invite-friends-button{\n      padding: 10px;\n      padding-left: 20px;\n      padding-right: 20px;\n      color: white; \n      font-weight: bold;\n      border-radius: 5px;\n      border: none;\n      background: rgb(255,255,255);\n      background: linear-gradient(10deg, rgba(255,255,255,1) 0%, rgba(1,113,151,1) 0%, rgba(80,34,166,1) 100%);\n      cursor: pointer;\n    }\n    ", e
                        }
                    }
                },
                4233: (e, t, n) => {
                    n(3369), e.exports = {
                        isIOS: function(e) {
                            for (var t = ["ipad", "iphone", "ipod", "mac", "macintel"], n = 0; n < t.length; n++)
                                if (e.toLowerCase().indexOf(t[n]) > -1) return !0;
                            return !1
                        }
                    }
                },
                3119: e => {
                    e.exports = {
                        version: "1.44.11"
                    }
                },
                4963: e => {
                    e.exports = function(e) {
                        if ("function" != typeof e) throw TypeError(e + " is not a function!");
                        return e
                    }
                },
                7722: (e, t, n) => {
                    var r = n(6314)("unscopables"),
                        i = Array.prototype;
                    null == i[r] && n(7728)(i, r, {}), e.exports = function(e) {
                        i[r][e] = !0
                    }
                },
                6793: (e, t, n) => {
                    "use strict";
                    var r = n(4496)(!0);
                    e.exports = function(e, t, n) {
                        return t + (n ? r(e, t).length : 1)
                    }
                },
                3328: e => {
                    e.exports = function(e, t, n, r) {
                        if (!(e instanceof t) || void 0 !== r && r in e) throw TypeError(n + ": incorrect invocation!");
                        return e
                    }
                },
                7007: (e, t, n) => {
                    var r = n(5286);
                    e.exports = function(e) {
                        if (!r(e)) throw TypeError(e + " is not an object!");
                        return e
                    }
                },
                9315: (e, t, n) => {
                    var r = n(2110),
                        i = n(875),
                        A = n(2337);
                    e.exports = function(e) {
                        return function(t, n, o) {
                            var a, s = r(t),
                                u = i(s.length),
                                c = A(o, u);
                            if (e && n != n) {
                                for (; u > c;)
                                    if ((a = s[c++]) != a) return !0
                            } else
                                for (; u > c; c++)
                                    if ((e || c in s) && s[c] === n) return e || c || 0;
                            return !e && -1
                        }
                    }
                },
                50: (e, t, n) => {
                    var r = n(741),
                        i = n(9797),
                        A = n(508),
                        o = n(875),
                        a = n(6886);
                    e.exports = function(e, t) {
                        var n = 1 == e,
                            s = 2 == e,
                            u = 3 == e,
                            c = 4 == e,
                            l = 6 == e,
                            d = 5 == e || l,
                            f = t || a;
                        return function(t, a, g) {
                            for (var I, v, h = A(t), p = i(h), y = r(a, g, 3), m = o(p.length), C = 0, E = n ? f(t, m) : s ? f(t, 0) : void 0; m > C; C++)
                                if ((d || C in p) && (v = y(I = p[C], C, h), e))
                                    if (n) E[C] = v;
                                    else if (v) switch (e) {
                                case 3:
                                    return !0;
                                case 5:
                                    return I;
                                case 6:
                                    return C;
                                case 2:
                                    E.push(I)
                            } else if (c) return !1;
                            return l ? -1 : u || c ? c : E
                        }
                    }
                },
                2736: (e, t, n) => {
                    var r = n(5286),
                        i = n(4302),
                        A = n(6314)("species");
                    e.exports = function(e) {
                        var t;
                        return i(e) && ("function" != typeof(t = e.constructor) || t !== Array && !i(t.prototype) || (t = void 0), r(t) && null === (t = t[A]) && (t = void 0)), void 0 === t ? Array : t
                    }
                },
                6886: (e, t, n) => {
                    var r = n(2736);
                    e.exports = function(e, t) {
                        return new(r(e))(t)
                    }
                },
                4398: (e, t, n) => {
                    "use strict";
                    var r = n(4963),
                        i = n(5286),
                        A = n(7242),
                        o = [].slice,
                        a = {},
                        s = function(e, t, n) {
                            if (!(t in a)) {
                                for (var r = [], i = 0; i < t; i++) r[i] = "a[" + i + "]";
                                a[t] = Function("F,a", "return new F(" + r.join(",") + ")")
                            }
                            return a[t](e, n)
                        };
                    e.exports = Function.bind || function(e) {
                        var t = r(this),
                            n = o.call(arguments, 1),
                            a = function() {
                                var r = n.concat(o.call(arguments));
                                return this instanceof a ? s(t, r.length, r) : A(t, r, e)
                            };
                        return i(t.prototype) && (a.prototype = t.prototype), a
                    }
                },
                1488: (e, t, n) => {
                    var r = n(2032),
                        i = n(6314)("toStringTag"),
                        A = "Arguments" == r(function() {
                            return arguments
                        }());
                    e.exports = function(e) {
                        var t, n, o;
                        return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof(n = function(e, t) {
                            try {
                                return e[t]
                            } catch (e) {}
                        }(t = Object(e), i)) ? n : A ? r(t) : "Object" == (o = r(t)) && "function" == typeof t.callee ? "Arguments" : o
                    }
                },
                2032: e => {
                    var t = {}.toString;
                    e.exports = function(e) {
                        return t.call(e).slice(8, -1)
                    }
                },
                9824: (e, t, n) => {
                    "use strict";
                    var r = n(9275).f,
                        i = n(2503),
                        A = n(4408),
                        o = n(741),
                        a = n(3328),
                        s = n(3531),
                        u = n(2923),
                        c = n(5436),
                        l = n(2974),
                        d = n(7057),
                        f = n(4728).fastKey,
                        g = n(1616),
                        I = d ? "_s" : "size",
                        v = function(e, t) {
                            var n, r = f(t);
                            if ("F" !== r) return e._i[r];
                            for (n = e._f; n; n = n.n)
                                if (n.k == t) return n
                        };
                    e.exports = {
                        getConstructor: function(e, t, n, u) {
                            var c = e((function(e, r) {
                                a(e, c, t, "_i"), e._t = t, e._i = i(null), e._f = void 0, e._l = void 0, e[I] = 0, null != r && s(r, n, e[u], e)
                            }));
                            return A(c.prototype, {
                                clear: function() {
                                    for (var e = g(this, t), n = e._i, r = e._f; r; r = r.n) r.r = !0, r.p && (r.p = r.p.n = void 0), delete n[r.i];
                                    e._f = e._l = void 0, e[I] = 0
                                },
                                delete: function(e) {
                                    var n = g(this, t),
                                        r = v(n, e);
                                    if (r) {
                                        var i = r.n,
                                            A = r.p;
                                        delete n._i[r.i], r.r = !0, A && (A.n = i), i && (i.p = A), n._f == r && (n._f = i), n._l == r && (n._l = A), n[I]--
                                    }
                                    return !!r
                                },
                                forEach: function(e) {
                                    g(this, t);
                                    for (var n, r = o(e, arguments.length > 1 ? arguments[1] : void 0, 3); n = n ? n.n : this._f;)
                                        for (r(n.v, n.k, this); n && n.r;) n = n.p
                                },
                                has: function(e) {
                                    return !!v(g(this, t), e)
                                }
                            }), d && r(c.prototype, "size", {
                                get: function() {
                                    return g(this, t)[I]
                                }
                            }), c
                        },
                        def: function(e, t, n) {
                            var r, i, A = v(e, t);
                            return A ? A.v = n : (e._l = A = {
                                i: i = f(t, !0),
                                k: t,
                                v: n,
                                p: r = e._l,
                                n: void 0,
                                r: !1
                            }, e._f || (e._f = A), r && (r.n = A), e[I]++, "F" !== i && (e._i[i] = A)), e
                        },
                        getEntry: v,
                        setStrong: function(e, t, n) {
                            u(e, t, (function(e, n) {
                                this._t = g(e, t), this._k = n, this._l = void 0
                            }), (function() {
                                for (var e = this, t = e._k, n = e._l; n && n.r;) n = n.p;
                                return e._t && (e._l = n = n ? n.n : e._t._f) ? c(0, "keys" == t ? n.k : "values" == t ? n.v : [n.k, n.v]) : (e._t = void 0, c(1))
                            }), n ? "entries" : "values", !n, !0), l(t)
                        }
                    }
                },
                5795: (e, t, n) => {
                    "use strict";
                    var r = n(3816),
                        i = n(2985),
                        A = n(7234),
                        o = n(4408),
                        a = n(4728),
                        s = n(3531),
                        u = n(3328),
                        c = n(5286),
                        l = n(4253),
                        d = n(7462),
                        f = n(2943),
                        g = n(266);
                    e.exports = function(e, t, n, I, v, h) {
                        var p = r[e],
                            y = p,
                            m = v ? "set" : "add",
                            C = y && y.prototype,
                            E = {},
                            b = function(e) {
                                var t = C[e];
                                A(C, e, "delete" == e || "has" == e ? function(e) {
                                    return !(h && !c(e)) && t.call(this, 0 === e ? 0 : e)
                                } : "get" == e ? function(e) {
                                    return h && !c(e) ? void 0 : t.call(this, 0 === e ? 0 : e)
                                } : "add" == e ? function(e) {
                                    return t.call(this, 0 === e ? 0 : e), this
                                } : function(e, n) {
                                    return t.call(this, 0 === e ? 0 : e, n), this
                                })
                            };
                        if ("function" == typeof y && (h || C.forEach && !l((function() {
                                (new y).entries().next()
                            })))) {
                            var w = new y,
                                S = w[m](h ? {} : -0, 1) != w,
                                k = l((function() {
                                    w.has(1)
                                })),
                                D = d((function(e) {
                                    new y(e)
                                })),
                                R = !h && l((function() {
                                    for (var e = new y, t = 5; t--;) e[m](t, t);
                                    return !e.has(-0)
                                }));
                            D || ((y = t((function(t, n) {
                                u(t, y, e);
                                var r = g(new p, t, y);
                                return null != n && s(n, v, r[m], r), r
                            }))).prototype = C, C.constructor = y), (k || R) && (b("delete"), b("has"), v && b("get")), (R || S) && b(m), h && C.clear && delete C.clear
                        } else y = I.getConstructor(t, e, v, m), o(y.prototype, n), a.NEED = !0;
                        return f(y, e), E[e] = y, i(i.G + i.W + i.F * (y != p), E), h || I.setStrong(y, e, v), y
                    }
                },
                5645: e => {
                    var t = e.exports = {
                        version: "2.6.12"
                    };
                    "number" == typeof __e && (__e = t)
                },
                2811: (e, t, n) => {
                    "use strict";
                    var r = n(9275),
                        i = n(681);
                    e.exports = function(e, t, n) {
                        t in e ? r.f(e, t, i(0, n)) : e[t] = n
                    }
                },
                741: (e, t, n) => {
                    var r = n(4963);
                    e.exports = function(e, t, n) {
                        if (r(e), void 0 === t) return e;
                        switch (n) {
                            case 1:
                                return function(n) {
                                    return e.call(t, n)
                                };
                            case 2:
                                return function(n, r) {
                                    return e.call(t, n, r)
                                };
                            case 3:
                                return function(n, r, i) {
                                    return e.call(t, n, r, i)
                                }
                        }
                        return function() {
                            return e.apply(t, arguments)
                        }
                    }
                },
                1355: e => {
                    e.exports = function(e) {
                        if (null == e) throw TypeError("Can't call method on  " + e);
                        return e
                    }
                },
                7057: (e, t, n) => {
                    e.exports = !n(4253)((function() {
                        return 7 != Object.defineProperty({}, "a", {
                            get: function() {
                                return 7
                            }
                        }).a
                    }))
                },
                2457: (e, t, n) => {
                    var r = n(5286),
                        i = n(3816).document,
                        A = r(i) && r(i.createElement);
                    e.exports = function(e) {
                        return A ? i.createElement(e) : {}
                    }
                },
                4430: e => {
                    e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
                },
                5541: (e, t, n) => {
                    var r = n(7184),
                        i = n(4548),
                        A = n(4682);
                    e.exports = function(e) {
                        var t = r(e),
                            n = i.f;
                        if (n)
                            for (var o, a = n(e), s = A.f, u = 0; a.length > u;) s.call(e, o = a[u++]) && t.push(o);
                        return t
                    }
                },
                2985: (e, t, n) => {
                    var r = n(3816),
                        i = n(5645),
                        A = n(7728),
                        o = n(7234),
                        a = n(741),
                        s = function(e, t, n) {
                            var u, c, l, d, f = e & s.F,
                                g = e & s.G,
                                I = e & s.S,
                                v = e & s.P,
                                h = e & s.B,
                                p = g ? r : I ? r[t] || (r[t] = {}) : (r[t] || {}).prototype,
                                y = g ? i : i[t] || (i[t] = {}),
                                m = y.prototype || (y.prototype = {});
                            for (u in g && (n = t), n) l = ((c = !f && p && void 0 !== p[u]) ? p : n)[u], d = h && c ? a(l, r) : v && "function" == typeof l ? a(Function.call, l) : l, p && o(p, u, l, e & s.U), y[u] != l && A(y, u, d), v && m[u] != l && (m[u] = l)
                        };
                    r.core = i, s.F = 1, s.G = 2, s.S = 4, s.P = 8, s.B = 16, s.W = 32, s.U = 64, s.R = 128, e.exports = s
                },
                8852: (e, t, n) => {
                    var r = n(6314)("match");
                    e.exports = function(e) {
                        var t = /./;
                        try {
                            "/./" [e](t)
                        } catch (n) {
                            try {
                                return t[r] = !1, !"/./" [e](t)
                            } catch (e) {}
                        }
                        return !0
                    }
                },
                4253: e => {
                    e.exports = function(e) {
                        try {
                            return !!e()
                        } catch (e) {
                            return !0
                        }
                    }
                },
                8082: (e, t, n) => {
                    "use strict";
                    n(8269);
                    var r = n(7234),
                        i = n(7728),
                        A = n(4253),
                        o = n(1355),
                        a = n(6314),
                        s = n(1165),
                        u = a("species"),
                        c = !A((function() {
                            var e = /./;
                            return e.exec = function() {
                                var e = [];
                                return e.groups = {
                                    a: "7"
                                }, e
                            }, "7" !== "".replace(e, "$<a>")
                        })),
                        l = function() {
                            var e = /(?:)/,
                                t = e.exec;
                            e.exec = function() {
                                return t.apply(this, arguments)
                            };
                            var n = "ab".split(e);
                            return 2 === n.length && "a" === n[0] && "b" === n[1]
                        }();
                    e.exports = function(e, t, n) {
                        var d = a(e),
                            f = !A((function() {
                                var t = {};
                                return t[d] = function() {
                                    return 7
                                }, 7 != "" [e](t)
                            })),
                            g = f ? !A((function() {
                                var t = !1,
                                    n = /a/;
                                return n.exec = function() {
                                    return t = !0, null
                                }, "split" === e && (n.constructor = {}, n.constructor[u] = function() {
                                    return n
                                }), n[d](""), !t
                            })) : void 0;
                        if (!f || !g || "replace" === e && !c || "split" === e && !l) {
                            var I = /./ [d],
                                v = n(o, d, "" [e], (function(e, t, n, r, i) {
                                    return t.exec === s ? f && !i ? {
                                        done: !0,
                                        value: I.call(t, n, r)
                                    } : {
                                        done: !0,
                                        value: e.call(n, t, r)
                                    } : {
                                        done: !1
                                    }
                                })),
                                h = v[0],
                                p = v[1];
                            r(String.prototype, e, h), i(RegExp.prototype, d, 2 == t ? function(e, t) {
                                return p.call(e, this, t)
                            } : function(e) {
                                return p.call(e, this)
                            })
                        }
                    }
                },
                3218: (e, t, n) => {
                    "use strict";
                    var r = n(7007);
                    e.exports = function() {
                        var e = r(this),
                            t = "";
                        return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.unicode && (t += "u"), e.sticky && (t += "y"), t
                    }
                },
                3531: (e, t, n) => {
                    var r = n(741),
                        i = n(8851),
                        A = n(6555),
                        o = n(7007),
                        a = n(875),
                        s = n(9002),
                        u = {},
                        c = {},
                        l = e.exports = function(e, t, n, l, d) {
                            var f, g, I, v, h = d ? function() {
                                    return e
                                } : s(e),
                                p = r(n, l, t ? 2 : 1),
                                y = 0;
                            if ("function" != typeof h) throw TypeError(e + " is not iterable!");
                            if (A(h)) {
                                for (f = a(e.length); f > y; y++)
                                    if ((v = t ? p(o(g = e[y])[0], g[1]) : p(e[y])) === u || v === c) return v
                            } else
                                for (I = h.call(e); !(g = I.next()).done;)
                                    if ((v = i(I, p, g.value, t)) === u || v === c) return v
                        };
                    l.BREAK = u, l.RETURN = c
                },
                18: (e, t, n) => {
                    e.exports = n(3825)("native-function-to-string", Function.toString)
                },
                3816: e => {
                    var t = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
                    "number" == typeof __g && (__g = t)
                },
                9181: e => {
                    var t = {}.hasOwnProperty;
                    e.exports = function(e, n) {
                        return t.call(e, n)
                    }
                },
                7728: (e, t, n) => {
                    var r = n(9275),
                        i = n(681);
                    e.exports = n(7057) ? function(e, t, n) {
                        return r.f(e, t, i(1, n))
                    } : function(e, t, n) {
                        return e[t] = n, e
                    }
                },
                639: (e, t, n) => {
                    var r = n(3816).document;
                    e.exports = r && r.documentElement
                },
                1734: (e, t, n) => {
                    e.exports = !n(7057) && !n(4253)((function() {
                        return 7 != Object.defineProperty(n(2457)("div"), "a", {
                            get: function() {
                                return 7
                            }
                        }).a
                    }))
                },
                266: (e, t, n) => {
                    var r = n(5286),
                        i = n(7375).set;
                    e.exports = function(e, t, n) {
                        var A, o = t.constructor;
                        return o !== n && "function" == typeof o && (A = o.prototype) !== n.prototype && r(A) && i && i(e, A), e
                    }
                },
                7242: e => {
                    e.exports = function(e, t, n) {
                        var r = void 0 === n;
                        switch (t.length) {
                            case 0:
                                return r ? e() : e.call(n);
                            case 1:
                                return r ? e(t[0]) : e.call(n, t[0]);
                            case 2:
                                return r ? e(t[0], t[1]) : e.call(n, t[0], t[1]);
                            case 3:
                                return r ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);
                            case 4:
                                return r ? e(t[0], t[1], t[2], t[3]) : e.call(n, t[0], t[1], t[2], t[3])
                        }
                        return e.apply(n, t)
                    }
                },
                9797: (e, t, n) => {
                    var r = n(2032);
                    e.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
                        return "String" == r(e) ? e.split("") : Object(e)
                    }
                },
                6555: (e, t, n) => {
                    var r = n(2803),
                        i = n(6314)("iterator"),
                        A = Array.prototype;
                    e.exports = function(e) {
                        return void 0 !== e && (r.Array === e || A[i] === e)
                    }
                },
                4302: (e, t, n) => {
                    var r = n(2032);
                    e.exports = Array.isArray || function(e) {
                        return "Array" == r(e)
                    }
                },
                5286: e => {
                    e.exports = function(e) {
                        return "object" == typeof e ? null !== e : "function" == typeof e
                    }
                },
                5364: (e, t, n) => {
                    var r = n(5286),
                        i = n(2032),
                        A = n(6314)("match");
                    e.exports = function(e) {
                        var t;
                        return r(e) && (void 0 !== (t = e[A]) ? !!t : "RegExp" == i(e))
                    }
                },
                8851: (e, t, n) => {
                    var r = n(7007);
                    e.exports = function(e, t, n, i) {
                        try {
                            return i ? t(r(n)[0], n[1]) : t(n)
                        } catch (t) {
                            var A = e.return;
                            throw void 0 !== A && r(A.call(e)), t
                        }
                    }
                },
                9988: (e, t, n) => {
                    "use strict";
                    var r = n(2503),
                        i = n(681),
                        A = n(2943),
                        o = {};
                    n(7728)(o, n(6314)("iterator"), (function() {
                        return this
                    })), e.exports = function(e, t, n) {
                        e.prototype = r(o, {
                            next: i(1, n)
                        }), A(e, t + " Iterator")
                    }
                },
                2923: (e, t, n) => {
                    "use strict";
                    var r = n(4461),
                        i = n(2985),
                        A = n(7234),
                        o = n(7728),
                        a = n(2803),
                        s = n(9988),
                        u = n(2943),
                        c = n(468),
                        l = n(6314)("iterator"),
                        d = !([].keys && "next" in [].keys()),
                        f = "keys",
                        g = "values",
                        I = function() {
                            return this
                        };
                    e.exports = function(e, t, n, v, h, p, y) {
                        s(n, t, v);
                        var m, C, E, b = function(e) {
                                if (!d && e in D) return D[e];
                                switch (e) {
                                    case f:
                                    case g:
                                        return function() {
                                            return new n(this, e)
                                        }
                                }
                                return function() {
                                    return new n(this, e)
                                }
                            },
                            w = t + " Iterator",
                            S = h == g,
                            k = !1,
                            D = e.prototype,
                            R = D[l] || D["@@iterator"] || h && D[h],
                            O = R || b(h),
                            P = h ? S ? b("entries") : O : void 0,
                            B = "Array" == t && D.entries || R;
                        if (B && (E = c(B.call(new e))) !== Object.prototype && E.next && (u(E, w, !0), r || "function" == typeof E[l] || o(E, l, I)), S && R && R.name !== g && (k = !0, O = function() {
                                return R.call(this)
                            }), r && !y || !d && !k && D[l] || o(D, l, O), a[t] = O, a[w] = I, h)
                            if (m = {
                                    values: S ? O : b(g),
                                    keys: p ? O : b(f),
                                    entries: P
                                }, y)
                                for (C in m) C in D || A(D, C, m[C]);
                            else i(i.P + i.F * (d || k), t, m);
                        return m
                    }
                },
                7462: (e, t, n) => {
                    var r = n(6314)("iterator"),
                        i = !1;
                    try {
                        var A = [7][r]();
                        A.return = function() {
                            i = !0
                        }, Array.from(A, (function() {
                            throw 2
                        }))
                    } catch (e) {}
                    e.exports = function(e, t) {
                        if (!t && !i) return !1;
                        var n = !1;
                        try {
                            var A = [7],
                                o = A[r]();
                            o.next = function() {
                                return {
                                    done: n = !0
                                }
                            }, A[r] = function() {
                                return o
                            }, e(A)
                        } catch (e) {}
                        return n
                    }
                },
                5436: e => {
                    e.exports = function(e, t) {
                        return {
                            value: t,
                            done: !!e
                        }
                    }
                },
                2803: e => {
                    e.exports = {}
                },
                4461: e => {
                    e.exports = !1
                },
                4728: (e, t, n) => {
                    var r = n(3953)("meta"),
                        i = n(5286),
                        A = n(9181),
                        o = n(9275).f,
                        a = 0,
                        s = Object.isExtensible || function() {
                            return !0
                        },
                        u = !n(4253)((function() {
                            return s(Object.preventExtensions({}))
                        })),
                        c = function(e) {
                            o(e, r, {
                                value: {
                                    i: "O" + ++a,
                                    w: {}
                                }
                            })
                        },
                        l = e.exports = {
                            KEY: r,
                            NEED: !1,
                            fastKey: function(e, t) {
                                if (!i(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
                                if (!A(e, r)) {
                                    if (!s(e)) return "F";
                                    if (!t) return "E";
                                    c(e)
                                }
                                return e[r].i
                            },
                            getWeak: function(e, t) {
                                if (!A(e, r)) {
                                    if (!s(e)) return !0;
                                    if (!t) return !1;
                                    c(e)
                                }
                                return e[r].w
                            },
                            onFreeze: function(e) {
                                return u && l.NEED && s(e) && !A(e, r) && c(e), e
                            }
                        }
                },
                4351: (e, t, n) => {
                    var r = n(3816),
                        i = n(4193).set,
                        A = r.MutationObserver || r.WebKitMutationObserver,
                        o = r.process,
                        a = r.Promise,
                        s = "process" == n(2032)(o);
                    e.exports = function() {
                        var e, t, n, u = function() {
                            var r, i;
                            for (s && (r = o.domain) && r.exit(); e;) {
                                i = e.fn, e = e.next;
                                try {
                                    i()
                                } catch (r) {
                                    throw e ? n() : t = void 0, r
                                }
                            }
                            t = void 0, r && r.enter()
                        };
                        if (s) n = function() {
                            o.nextTick(u)
                        };
                        else if (!A || r.navigator && r.navigator.standalone)
                            if (a && a.resolve) {
                                var c = a.resolve(void 0);
                                n = function() {
                                    c.then(u)
                                }
                            } else n = function() {
                                i.call(r, u)
                            };
                        else {
                            var l = !0,
                                d = document.createTextNode("");
                            new A(u).observe(d, {
                                characterData: !0
                            }), n = function() {
                                d.data = l = !l
                            }
                        }
                        return function(r) {
                            var i = {
                                fn: r,
                                next: void 0
                            };
                            t && (t.next = i), e || (e = i, n()), t = i
                        }
                    }
                },
                3499: (e, t, n) => {
                    "use strict";
                    var r = n(4963);

                    function i(e) {
                        var t, n;
                        this.promise = new e((function(e, r) {
                            if (void 0 !== t || void 0 !== n) throw TypeError("Bad Promise constructor");
                            t = e, n = r
                        })), this.resolve = r(t), this.reject = r(n)
                    }
                    e.exports.f = function(e) {
                        return new i(e)
                    }
                },
                2503: (e, t, n) => {
                    var r = n(7007),
                        i = n(5588),
                        A = n(4430),
                        o = n(9335)("IE_PROTO"),
                        a = function() {},
                        s = function() {
                            var e, t = n(2457)("iframe"),
                                r = A.length;
                            for (t.style.display = "none", n(639).appendChild(t), t.src = "javascript:", (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), s = e.F; r--;) delete s.prototype[A[r]];
                            return s()
                        };
                    e.exports = Object.create || function(e, t) {
                        var n;
                        return null !== e ? (a.prototype = r(e), n = new a, a.prototype = null, n[o] = e) : n = s(), void 0 === t ? n : i(n, t)
                    }
                },
                9275: (e, t, n) => {
                    var r = n(7007),
                        i = n(1734),
                        A = n(1689),
                        o = Object.defineProperty;
                    t.f = n(7057) ? Object.defineProperty : function(e, t, n) {
                        if (r(e), t = A(t, !0), r(n), i) try {
                            return o(e, t, n)
                        } catch (e) {}
                        if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
                        return "value" in n && (e[t] = n.value), e
                    }
                },
                5588: (e, t, n) => {
                    var r = n(9275),
                        i = n(7007),
                        A = n(7184);
                    e.exports = n(7057) ? Object.defineProperties : function(e, t) {
                        i(e);
                        for (var n, o = A(t), a = o.length, s = 0; a > s;) r.f(e, n = o[s++], t[n]);
                        return e
                    }
                },
                8693: (e, t, n) => {
                    var r = n(4682),
                        i = n(681),
                        A = n(2110),
                        o = n(1689),
                        a = n(9181),
                        s = n(1734),
                        u = Object.getOwnPropertyDescriptor;
                    t.f = n(7057) ? u : function(e, t) {
                        if (e = A(e), t = o(t, !0), s) try {
                            return u(e, t)
                        } catch (e) {}
                        if (a(e, t)) return i(!r.f.call(e, t), e[t])
                    }
                },
                9327: (e, t, n) => {
                    var r = n(2110),
                        i = n(616).f,
                        A = {}.toString,
                        o = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
                    e.exports.f = function(e) {
                        return o && "[object Window]" == A.call(e) ? function(e) {
                            try {
                                return i(e)
                            } catch (e) {
                                return o.slice()
                            }
                        }(e) : i(r(e))
                    }
                },
                616: (e, t, n) => {
                    var r = n(189),
                        i = n(4430).concat("length", "prototype");
                    t.f = Object.getOwnPropertyNames || function(e) {
                        return r(e, i)
                    }
                },
                4548: (e, t) => {
                    t.f = Object.getOwnPropertySymbols
                },
                468: (e, t, n) => {
                    var r = n(9181),
                        i = n(508),
                        A = n(9335)("IE_PROTO"),
                        o = Object.prototype;
                    e.exports = Object.getPrototypeOf || function(e) {
                        return e = i(e), r(e, A) ? e[A] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? o : null
                    }
                },
                189: (e, t, n) => {
                    var r = n(9181),
                        i = n(2110),
                        A = n(9315)(!1),
                        o = n(9335)("IE_PROTO");
                    e.exports = function(e, t) {
                        var n, a = i(e),
                            s = 0,
                            u = [];
                        for (n in a) n != o && r(a, n) && u.push(n);
                        for (; t.length > s;) r(a, n = t[s++]) && (~A(u, n) || u.push(n));
                        return u
                    }
                },
                7184: (e, t, n) => {
                    var r = n(189),
                        i = n(4430);
                    e.exports = Object.keys || function(e) {
                        return r(e, i)
                    }
                },
                4682: (e, t) => {
                    t.f = {}.propertyIsEnumerable
                },
                3160: (e, t, n) => {
                    var r = n(2985),
                        i = n(5645),
                        A = n(4253);
                    e.exports = function(e, t) {
                        var n = (i.Object || {})[e] || Object[e],
                            o = {};
                        o[e] = t(n), r(r.S + r.F * A((function() {
                            n(1)
                        })), "Object", o)
                    }
                },
                7643: (e, t, n) => {
                    var r = n(616),
                        i = n(4548),
                        A = n(7007),
                        o = n(3816).Reflect;
                    e.exports = o && o.ownKeys || function(e) {
                        var t = r.f(A(e)),
                            n = i.f;
                        return n ? t.concat(n(e)) : t
                    }
                },
                188: e => {
                    e.exports = function(e) {
                        try {
                            return {
                                e: !1,
                                v: e()
                            }
                        } catch (e) {
                            return {
                                e: !0,
                                v: e
                            }
                        }
                    }
                },
                94: (e, t, n) => {
                    var r = n(7007),
                        i = n(5286),
                        A = n(3499);
                    e.exports = function(e, t) {
                        if (r(e), i(t) && t.constructor === e) return t;
                        var n = A.f(e);
                        return (0, n.resolve)(t), n.promise
                    }
                },
                681: e => {
                    e.exports = function(e, t) {
                        return {
                            enumerable: !(1 & e),
                            configurable: !(2 & e),
                            writable: !(4 & e),
                            value: t
                        }
                    }
                },
                4408: (e, t, n) => {
                    var r = n(7234);
                    e.exports = function(e, t, n) {
                        for (var i in t) r(e, i, t[i], n);
                        return e
                    }
                },
                7234: (e, t, n) => {
                    var r = n(3816),
                        i = n(7728),
                        A = n(9181),
                        o = n(3953)("src"),
                        a = n(18),
                        s = "toString",
                        u = ("" + a).split(s);
                    n(5645).inspectSource = function(e) {
                        return a.call(e)
                    }, (e.exports = function(e, t, n, a) {
                        var s = "function" == typeof n;
                        s && (A(n, "name") || i(n, "name", t)), e[t] !== n && (s && (A(n, o) || i(n, o, e[t] ? "" + e[t] : u.join(String(t)))), e === r ? e[t] = n : a ? e[t] ? e[t] = n : i(e, t, n) : (delete e[t], i(e, t, n)))
                    })(Function.prototype, s, (function() {
                        return "function" == typeof this && this[o] || a.call(this)
                    }))
                },
                7787: (e, t, n) => {
                    "use strict";
                    var r = n(1488),
                        i = RegExp.prototype.exec;
                    e.exports = function(e, t) {
                        var n = e.exec;
                        if ("function" == typeof n) {
                            var A = n.call(e, t);
                            if ("object" != typeof A) throw new TypeError("RegExp exec method returned something other than an Object or null");
                            return A
                        }
                        if ("RegExp" !== r(e)) throw new TypeError("RegExp#exec called on incompatible receiver");
                        return i.call(e, t)
                    }
                },
                1165: (e, t, n) => {
                    "use strict";
                    var r, i, A = n(3218),
                        o = RegExp.prototype.exec,
                        a = String.prototype.replace,
                        s = o,
                        u = (r = /a/, i = /b*/g, o.call(r, "a"), o.call(i, "a"), 0 !== r.lastIndex || 0 !== i.lastIndex),
                        c = void 0 !== /()??/.exec("")[1];
                    (u || c) && (s = function(e) {
                        var t, n, r, i, s = this;
                        return c && (n = new RegExp("^" + s.source + "$(?!\\s)", A.call(s))), u && (t = s.lastIndex), r = o.call(s, e), u && r && (s.lastIndex = s.global ? r.index + r[0].length : t), c && r && r.length > 1 && a.call(r[0], n, (function() {
                            for (i = 1; i < arguments.length - 2; i++) void 0 === arguments[i] && (r[i] = void 0)
                        })), r
                    }), e.exports = s
                },
                7375: (e, t, n) => {
                    var r = n(5286),
                        i = n(7007),
                        A = function(e, t) {
                            if (i(e), !r(t) && null !== t) throw TypeError(t + ": can't set as prototype!")
                        };
                    e.exports = {
                        set: Object.setPrototypeOf || ("__proto__" in {} ? function(e, t, r) {
                            try {
                                (r = n(741)(Function.call, n(8693).f(Object.prototype, "__proto__").set, 2))(e, []), t = !(e instanceof Array)
                            } catch (e) {
                                t = !0
                            }
                            return function(e, n) {
                                return A(e, n), t ? e.__proto__ = n : r(e, n), e
                            }
                        }({}, !1) : void 0),
                        check: A
                    }
                },
                2974: (e, t, n) => {
                    "use strict";
                    var r = n(3816),
                        i = n(9275),
                        A = n(7057),
                        o = n(6314)("species");
                    e.exports = function(e) {
                        var t = r[e];
                        A && t && !t[o] && i.f(t, o, {
                            configurable: !0,
                            get: function() {
                                return this
                            }
                        })
                    }
                },
                2943: (e, t, n) => {
                    var r = n(9275).f,
                        i = n(9181),
                        A = n(6314)("toStringTag");
                    e.exports = function(e, t, n) {
                        e && !i(e = n ? e : e.prototype, A) && r(e, A, {
                            configurable: !0,
                            value: t
                        })
                    }
                },
                9335: (e, t, n) => {
                    var r = n(3825)("keys"),
                        i = n(3953);
                    e.exports = function(e) {
                        return r[e] || (r[e] = i(e))
                    }
                },
                3825: (e, t, n) => {
                    var r = n(5645),
                        i = n(3816),
                        A = "__core-js_shared__",
                        o = i[A] || (i[A] = {});
                    (e.exports = function(e, t) {
                        return o[e] || (o[e] = void 0 !== t ? t : {})
                    })("versions", []).push({
                        version: r.version,
                        mode: n(4461) ? "pure" : "global",
                        copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
                    })
                },
                8364: (e, t, n) => {
                    var r = n(7007),
                        i = n(4963),
                        A = n(6314)("species");
                    e.exports = function(e, t) {
                        var n, o = r(e).constructor;
                        return void 0 === o || null == (n = r(o)[A]) ? t : i(n)
                    }
                },
                7717: (e, t, n) => {
                    "use strict";
                    var r = n(4253);
                    e.exports = function(e, t) {
                        return !!e && r((function() {
                            t ? e.call(null, (function() {}), 1) : e.call(null)
                        }))
                    }
                },
                4496: (e, t, n) => {
                    var r = n(1467),
                        i = n(1355);
                    e.exports = function(e) {
                        return function(t, n) {
                            var A, o, a = String(i(t)),
                                s = r(n),
                                u = a.length;
                            return s < 0 || s >= u ? e ? "" : void 0 : (A = a.charCodeAt(s)) < 55296 || A > 56319 || s + 1 === u || (o = a.charCodeAt(s + 1)) < 56320 || o > 57343 ? e ? a.charAt(s) : A : e ? a.slice(s, s + 2) : o - 56320 + (A - 55296 << 10) + 65536
                        }
                    }
                },
                2094: (e, t, n) => {
                    var r = n(5364),
                        i = n(1355);
                    e.exports = function(e, t, n) {
                        if (r(t)) throw TypeError("String#" + n + " doesn't accept regex!");
                        return String(i(e))
                    }
                },
                4193: (e, t, n) => {
                    var r, i, A, o = n(741),
                        a = n(7242),
                        s = n(639),
                        u = n(2457),
                        c = n(3816),
                        l = c.process,
                        d = c.setImmediate,
                        f = c.clearImmediate,
                        g = c.MessageChannel,
                        I = c.Dispatch,
                        v = 0,
                        h = {},
                        p = function() {
                            var e = +this;
                            if (h.hasOwnProperty(e)) {
                                var t = h[e];
                                delete h[e], t()
                            }
                        },
                        y = function(e) {
                            p.call(e.data)
                        };
                    d && f || (d = function(e) {
                        for (var t = [], n = 1; arguments.length > n;) t.push(arguments[n++]);
                        return h[++v] = function() {
                            a("function" == typeof e ? e : Function(e), t)
                        }, r(v), v
                    }, f = function(e) {
                        delete h[e]
                    }, "process" == n(2032)(l) ? r = function(e) {
                        l.nextTick(o(p, e, 1))
                    } : I && I.now ? r = function(e) {
                        I.now(o(p, e, 1))
                    } : g ? (A = (i = new g).port2, i.port1.onmessage = y, r = o(A.postMessage, A, 1)) : c.addEventListener && "function" == typeof postMessage && !c.importScripts ? (r = function(e) {
                        c.postMessage(e + "", "*")
                    }, c.addEventListener("message", y, !1)) : r = "onreadystatechange" in u("script") ? function(e) {
                        s.appendChild(u("script")).onreadystatechange = function() {
                            s.removeChild(this), p.call(e)
                        }
                    } : function(e) {
                        setTimeout(o(p, e, 1), 0)
                    }), e.exports = {
                        set: d,
                        clear: f
                    }
                },
                2337: (e, t, n) => {
                    var r = n(1467),
                        i = Math.max,
                        A = Math.min;
                    e.exports = function(e, t) {
                        return (e = r(e)) < 0 ? i(e + t, 0) : A(e, t)
                    }
                },
                1467: e => {
                    var t = Math.ceil,
                        n = Math.floor;
                    e.exports = function(e) {
                        return isNaN(e = +e) ? 0 : (e > 0 ? n : t)(e)
                    }
                },
                2110: (e, t, n) => {
                    var r = n(9797),
                        i = n(1355);
                    e.exports = function(e) {
                        return r(i(e))
                    }
                },
                875: (e, t, n) => {
                    var r = n(1467),
                        i = Math.min;
                    e.exports = function(e) {
                        return e > 0 ? i(r(e), 9007199254740991) : 0
                    }
                },
                508: (e, t, n) => {
                    var r = n(1355);
                    e.exports = function(e) {
                        return Object(r(e))
                    }
                },
                1689: (e, t, n) => {
                    var r = n(5286);
                    e.exports = function(e, t) {
                        if (!r(e)) return e;
                        var n, i;
                        if (t && "function" == typeof(n = e.toString) && !r(i = n.call(e))) return i;
                        if ("function" == typeof(n = e.valueOf) && !r(i = n.call(e))) return i;
                        if (!t && "function" == typeof(n = e.toString) && !r(i = n.call(e))) return i;
                        throw TypeError("Can't convert object to primitive value")
                    }
                },
                3953: e => {
                    var t = 0,
                        n = Math.random();
                    e.exports = function(e) {
                        return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++t + n).toString(36))
                    }
                },
                575: (e, t, n) => {
                    var r = n(3816).navigator;
                    e.exports = r && r.userAgent || ""
                },
                1616: (e, t, n) => {
                    var r = n(5286);
                    e.exports = function(e, t) {
                        if (!r(e) || e._t !== t) throw TypeError("Incompatible receiver, " + t + " required!");
                        return e
                    }
                },
                6074: (e, t, n) => {
                    var r = n(3816),
                        i = n(5645),
                        A = n(4461),
                        o = n(8787),
                        a = n(9275).f;
                    e.exports = function(e) {
                        var t = i.Symbol || (i.Symbol = A ? {} : r.Symbol || {});
                        "_" == e.charAt(0) || e in t || a(t, e, {
                            value: o.f(e)
                        })
                    }
                },
                8787: (e, t, n) => {
                    t.f = n(6314)
                },
                6314: (e, t, n) => {
                    var r = n(3825)("wks"),
                        i = n(3953),
                        A = n(3816).Symbol,
                        o = "function" == typeof A;
                    (e.exports = function(e) {
                        return r[e] || (r[e] = o && A[e] || (o ? A : i)("Symbol." + e))
                    }).store = r
                },
                9002: (e, t, n) => {
                    var r = n(1488),
                        i = n(6314)("iterator"),
                        A = n(2803);
                    e.exports = n(5645).getIteratorMethod = function(e) {
                        if (null != e) return e[i] || e["@@iterator"] || A[r(e)]
                    }
                },
                8837: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(50)(2);
                    r(r.P + r.F * !n(7717)([].filter, !0), "Array", {
                        filter: function(e) {
                            return i(this, e, arguments[1])
                        }
                    })
                },
                2310: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(50)(5),
                        A = "find",
                        o = !0;
                    A in [] && Array(1).find((function() {
                        o = !1
                    })), r(r.P + r.F * o, "Array", {
                        find: function(e) {
                            return i(this, e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    }), n(7722)(A)
                },
                4336: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(50)(0),
                        A = n(7717)([].forEach, !0);
                    r(r.P + r.F * !A, "Array", {
                        forEach: function(e) {
                            return i(this, e, arguments[1])
                        }
                    })
                },
                3369: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(9315)(!1),
                        A = [].indexOf,
                        o = !!A && 1 / [1].indexOf(1, -0) < 0;
                    r(r.P + r.F * (o || !n(7717)(A)), "Array", {
                        indexOf: function(e) {
                            return o ? A.apply(this, arguments) || 0 : i(this, e, arguments[1])
                        }
                    })
                },
                6997: (e, t, n) => {
                    "use strict";
                    var r = n(7722),
                        i = n(5436),
                        A = n(2803),
                        o = n(2110);
                    e.exports = n(2923)(Array, "Array", (function(e, t) {
                        this._t = o(e), this._i = 0, this._k = t
                    }), (function() {
                        var e = this._t,
                            t = this._k,
                            n = this._i++;
                        return !e || n >= e.length ? (this._t = void 0, i(1)) : i(0, "keys" == t ? n : "values" == t ? e[n] : [n, e[n]])
                    }), "values"), A.Arguments = A.Array, r("keys"), r("values"), r("entries")
                },
                9371: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(50)(1);
                    r(r.P + r.F * !n(7717)([].map, !0), "Array", {
                        map: function(e) {
                            return i(this, e, arguments[1])
                        }
                    })
                },
                110: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(639),
                        A = n(2032),
                        o = n(2337),
                        a = n(875),
                        s = [].slice;
                    r(r.P + r.F * n(4253)((function() {
                        i && s.call(i)
                    })), "Array", {
                        slice: function(e, t) {
                            var n = a(this.length),
                                r = A(this);
                            if (t = void 0 === t ? n : t, "Array" == r) return s.call(this, e, t);
                            for (var i = o(e, n), u = o(t, n), c = a(u - i), l = new Array(c), d = 0; d < c; d++) l[d] = "String" == r ? this.charAt(i + d) : this[i + d];
                            return l
                        }
                    })
                },
                75: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(4963),
                        A = n(508),
                        o = n(4253),
                        a = [].sort,
                        s = [1, 2, 3];
                    r(r.P + r.F * (o((function() {
                        s.sort(void 0)
                    })) || !o((function() {
                        s.sort(null)
                    })) || !n(7717)(a)), "Array", {
                        sort: function(e) {
                            return void 0 === e ? a.call(A(this)) : a.call(A(this), i(e))
                        }
                    })
                },
                9730: (e, t, n) => {
                    var r = n(2985);
                    r(r.P, "Function", {
                        bind: n(4398)
                    })
                },
                6059: (e, t, n) => {
                    var r = n(9275).f,
                        i = Function.prototype,
                        A = /^\s*function ([^ (]*)/,
                        o = "name";
                    o in i || n(7057) && r(i, o, {
                        configurable: !0,
                        get: function() {
                            try {
                                return ("" + this).match(A)[1]
                            } catch (e) {
                                return ""
                            }
                        }
                    })
                },
                8416: (e, t, n) => {
                    "use strict";
                    var r = n(9824),
                        i = n(1616),
                        A = "Map";
                    e.exports = n(5795)(A, (function(e) {
                        return function() {
                            return e(this, arguments.length > 0 ? arguments[0] : void 0)
                        }
                    }), {
                        get: function(e) {
                            var t = r.getEntry(i(this, A), e);
                            return t && t.v
                        },
                        set: function(e, t) {
                            return r.def(i(this, A), 0 === e ? 0 : e, t)
                        }
                    }, r, !0)
                },
                8132: (e, t, n) => {
                    var r = n(2985);
                    r(r.S, "Object", {
                        create: n(2503)
                    })
                },
                7470: (e, t, n) => {
                    var r = n(2985);
                    r(r.S + r.F * !n(7057), "Object", {
                        defineProperties: n(5588)
                    })
                },
                8388: (e, t, n) => {
                    var r = n(2985);
                    r(r.S + r.F * !n(7057), "Object", {
                        defineProperty: n(9275).f
                    })
                },
                4882: (e, t, n) => {
                    var r = n(2110),
                        i = n(8693).f;
                    n(3160)("getOwnPropertyDescriptor", (function() {
                        return function(e, t) {
                            return i(r(e), t)
                        }
                    }))
                },
                1520: (e, t, n) => {
                    var r = n(508),
                        i = n(468);
                    n(3160)("getPrototypeOf", (function() {
                        return function(e) {
                            return i(r(e))
                        }
                    }))
                },
                7476: (e, t, n) => {
                    var r = n(508),
                        i = n(7184);
                    n(3160)("keys", (function() {
                        return function(e) {
                            return i(r(e))
                        }
                    }))
                },
                8838: (e, t, n) => {
                    var r = n(2985);
                    r(r.S, "Object", {
                        setPrototypeOf: n(7375).set
                    })
                },
                6253: (e, t, n) => {
                    "use strict";
                    var r = n(1488),
                        i = {};
                    i[n(6314)("toStringTag")] = "z", i + "" != "[object z]" && n(7234)(Object.prototype, "toString", (function() {
                        return "[object " + r(this) + "]"
                    }), !0)
                },
                851: (e, t, n) => {
                    "use strict";
                    var r, i, A, o, a = n(4461),
                        s = n(3816),
                        u = n(741),
                        c = n(1488),
                        l = n(2985),
                        d = n(5286),
                        f = n(4963),
                        g = n(3328),
                        I = n(3531),
                        v = n(8364),
                        h = n(4193).set,
                        p = n(4351)(),
                        y = n(3499),
                        m = n(188),
                        C = n(575),
                        E = n(94),
                        b = "Promise",
                        w = s.TypeError,
                        S = s.process,
                        k = S && S.versions,
                        D = k && k.v8 || "",
                        R = s.Promise,
                        O = "process" == c(S),
                        P = function() {},
                        B = i = y.f,
                        M = !! function() {
                            try {
                                var e = R.resolve(1),
                                    t = (e.constructor = {})[n(6314)("species")] = function(e) {
                                        e(P, P)
                                    };
                                return (O || "function" == typeof PromiseRejectionEvent) && e.then(P) instanceof t && 0 !== D.indexOf("6.6") && -1 === C.indexOf("Chrome/66")
                            } catch (e) {}
                        }(),
                        x = function(e) {
                            var t;
                            return !(!d(e) || "function" != typeof(t = e.then)) && t
                        },
                        G = function(e, t) {
                            if (!e._n) {
                                e._n = !0;
                                var n = e._c;
                                p((function() {
                                    for (var r = e._v, i = 1 == e._s, A = 0, o = function(t) {
                                            var n, A, o, a = i ? t.ok : t.fail,
                                                s = t.resolve,
                                                u = t.reject,
                                                c = t.domain;
                                            try {
                                                a ? (i || (2 == e._h && H(e), e._h = 1), !0 === a ? n = r : (c && c.enter(), n = a(r), c && (c.exit(), o = !0)), n === t.promise ? u(w("Promise-chain cycle")) : (A = x(n)) ? A.call(n, s, u) : s(n)) : u(r)
                                            } catch (e) {
                                                c && !o && c.exit(), u(e)
                                            }
                                        }; n.length > A;) o(n[A++]);
                                    e._c = [], e._n = !1, t && !e._h && j(e)
                                }))
                            }
                        },
                        j = function(e) {
                            h.call(s, (function() {
                                var t, n, r, i = e._v,
                                    A = T(e);
                                if (A && (t = m((function() {
                                        O ? S.emit("unhandledRejection", i, e) : (n = s.onunhandledrejection) ? n({
                                            promise: e,
                                            reason: i
                                        }) : (r = s.console) && r.error && r.error("Unhandled promise rejection", i)
                                    })), e._h = O || T(e) ? 2 : 1), e._a = void 0, A && t.e) throw t.v
                            }))
                        },
                        T = function(e) {
                            return 1 !== e._h && 0 === (e._a || e._c).length
                        },
                        H = function(e) {
                            h.call(s, (function() {
                                var t;
                                O ? S.emit("rejectionHandled", e) : (t = s.onrejectionhandled) && t({
                                    promise: e,
                                    reason: e._v
                                })
                            }))
                        },
                        U = function(e) {
                            var t = this;
                            t._d || (t._d = !0, (t = t._w || t)._v = e, t._s = 2, t._a || (t._a = t._c.slice()), G(t, !0))
                        },
                        L = function(e) {
                            var t, n = this;
                            if (!n._d) {
                                n._d = !0, n = n._w || n;
                                try {
                                    if (n === e) throw w("Promise can't be resolved itself");
                                    (t = x(e)) ? p((function() {
                                        var r = {
                                            _w: n,
                                            _d: !1
                                        };
                                        try {
                                            t.call(e, u(L, r, 1), u(U, r, 1))
                                        } catch (e) {
                                            U.call(r, e)
                                        }
                                    })): (n._v = e, n._s = 1, G(n, !1))
                                } catch (e) {
                                    U.call({
                                        _w: n,
                                        _d: !1
                                    }, e)
                                }
                            }
                        };
                    M || (R = function(e) {
                        g(this, R, b, "_h"), f(e), r.call(this);
                        try {
                            e(u(L, this, 1), u(U, this, 1))
                        } catch (e) {
                            U.call(this, e)
                        }
                    }, (r = function(e) {
                        this._c = [], this._a = void 0, this._s = 0, this._d = !1, this._v = void 0, this._h = 0, this._n = !1
                    }).prototype = n(4408)(R.prototype, {
                        then: function(e, t) {
                            var n = B(v(this, R));
                            return n.ok = "function" != typeof e || e, n.fail = "function" == typeof t && t, n.domain = O ? S.domain : void 0, this._c.push(n), this._a && this._a.push(n), this._s && G(this, !1), n.promise
                        },
                        catch: function(e) {
                            return this.then(void 0, e)
                        }
                    }), A = function() {
                        var e = new r;
                        this.promise = e, this.resolve = u(L, e, 1), this.reject = u(U, e, 1)
                    }, y.f = B = function(e) {
                        return e === R || e === o ? new A(e) : i(e)
                    }), l(l.G + l.W + l.F * !M, {
                        Promise: R
                    }), n(2943)(R, b), n(2974)(b), o = n(5645).Promise, l(l.S + l.F * !M, b, {
                        reject: function(e) {
                            var t = B(this);
                            return (0, t.reject)(e), t.promise
                        }
                    }), l(l.S + l.F * (a || !M), b, {
                        resolve: function(e) {
                            return E(a && this === o ? R : this, e)
                        }
                    }), l(l.S + l.F * !(M && n(7462)((function(e) {
                        R.all(e).catch(P)
                    }))), b, {
                        all: function(e) {
                            var t = this,
                                n = B(t),
                                r = n.resolve,
                                i = n.reject,
                                A = m((function() {
                                    var n = [],
                                        A = 0,
                                        o = 1;
                                    I(e, !1, (function(e) {
                                        var a = A++,
                                            s = !1;
                                        n.push(void 0), o++, t.resolve(e).then((function(e) {
                                            s || (s = !0, n[a] = e, --o || r(n))
                                        }), i)
                                    })), --o || r(n)
                                }));
                            return A.e && i(A.v), n.promise
                        },
                        race: function(e) {
                            var t = this,
                                n = B(t),
                                r = n.reject,
                                i = m((function() {
                                    I(e, !1, (function(e) {
                                        t.resolve(e).then(n.resolve, r)
                                    }))
                                }));
                            return i.e && r(i.v), n.promise
                        }
                    })
                },
                2139: (e, t, n) => {
                    var r = n(2985),
                        i = n(2503),
                        A = n(4963),
                        o = n(7007),
                        a = n(5286),
                        s = n(4253),
                        u = n(4398),
                        c = (n(3816).Reflect || {}).construct,
                        l = s((function() {
                            function e() {}
                            return !(c((function() {}), [], e) instanceof e)
                        })),
                        d = !s((function() {
                            c((function() {}))
                        }));
                    r(r.S + r.F * (l || d), "Reflect", {
                        construct: function(e, t) {
                            A(e), o(t);
                            var n = arguments.length < 3 ? e : A(arguments[2]);
                            if (d && !l) return c(e, t, n);
                            if (e == n) {
                                switch (t.length) {
                                    case 0:
                                        return new e;
                                    case 1:
                                        return new e(t[0]);
                                    case 2:
                                        return new e(t[0], t[1]);
                                    case 3:
                                        return new e(t[0], t[1], t[2]);
                                    case 4:
                                        return new e(t[0], t[1], t[2], t[3])
                                }
                                var r = [null];
                                return r.push.apply(r, t), new(u.apply(e, r))
                            }
                            var s = n.prototype,
                                f = i(a(s) ? s : Object.prototype),
                                g = Function.apply.call(e, f, t);
                            return a(g) ? g : f
                        }
                    })
                },
                3049: (e, t, n) => {
                    var r = n(8693),
                        i = n(468),
                        A = n(9181),
                        o = n(2985),
                        a = n(5286),
                        s = n(7007);
                    o(o.S, "Reflect", {
                        get: function e(t, n) {
                            var o, u, c = arguments.length < 3 ? t : arguments[2];
                            return s(t) === c ? t[n] : (o = r.f(t, n)) ? A(o, "value") ? o.value : void 0 !== o.get ? o.get.call(c) : void 0 : a(u = i(t)) ? e(u, n, c) : void 0
                        }
                    })
                },
                8269: (e, t, n) => {
                    "use strict";
                    var r = n(1165);
                    n(2985)({
                        target: "RegExp",
                        proto: !0,
                        forced: r !== /./.exec
                    }, {
                        exec: r
                    })
                },
                1876: (e, t, n) => {
                    "use strict";
                    var r = n(5364),
                        i = n(7007),
                        A = n(8364),
                        o = n(6793),
                        a = n(875),
                        s = n(7787),
                        u = n(1165),
                        c = n(4253),
                        l = Math.min,
                        d = [].push,
                        f = 4294967295,
                        g = !c((function() {
                            RegExp(f, "y")
                        }));
                    n(8082)("split", 2, (function(e, t, n, c) {
                        var I;
                        return I = "c" == "abbc".split(/(b)*/)[1] || 4 != "test".split(/(?:)/, -1).length || 2 != "ab".split(/(?:ab)*/).length || 4 != ".".split(/(.?)(.?)/).length || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(e, t) {
                            var i = String(this);
                            if (void 0 === e && 0 === t) return [];
                            if (!r(e)) return n.call(i, e, t);
                            for (var A, o, a, s = [], c = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "") + (e.sticky ? "y" : ""), l = 0, g = void 0 === t ? f : t >>> 0, I = new RegExp(e.source, c + "g");
                                (A = u.call(I, i)) && !((o = I.lastIndex) > l && (s.push(i.slice(l, A.index)), A.length > 1 && A.index < i.length && d.apply(s, A.slice(1)), a = A[0].length, l = o, s.length >= g));) I.lastIndex === A.index && I.lastIndex++;
                            return l === i.length ? !a && I.test("") || s.push("") : s.push(i.slice(l)), s.length > g ? s.slice(0, g) : s
                        } : "0".split(void 0, 0).length ? function(e, t) {
                            return void 0 === e && 0 === t ? [] : n.call(this, e, t)
                        } : n, [function(n, r) {
                            var i = e(this),
                                A = null == n ? void 0 : n[t];
                            return void 0 !== A ? A.call(n, i, r) : I.call(String(i), n, r)
                        }, function(e, t) {
                            var r = c(I, e, this, t, I !== n);
                            if (r.done) return r.value;
                            var u = i(e),
                                d = String(this),
                                v = A(u, RegExp),
                                h = u.unicode,
                                p = (u.ignoreCase ? "i" : "") + (u.multiline ? "m" : "") + (u.unicode ? "u" : "") + (g ? "y" : "g"),
                                y = new v(g ? u : "^(?:" + u.source + ")", p),
                                m = void 0 === t ? f : t >>> 0;
                            if (0 === m) return [];
                            if (0 === d.length) return null === s(y, d) ? [d] : [];
                            for (var C = 0, E = 0, b = []; E < d.length;) {
                                y.lastIndex = g ? E : 0;
                                var w, S = s(y, g ? d : d.slice(E));
                                if (null === S || (w = l(a(y.lastIndex + (g ? 0 : E)), d.length)) === C) E = o(d, E, h);
                                else {
                                    if (b.push(d.slice(C, E)), b.length === m) return b;
                                    for (var k = 1; k <= S.length - 1; k++)
                                        if (b.push(S[k]), b.length === m) return b;
                                    E = C = w
                                }
                            }
                            return b.push(d.slice(C)), b
                        }]
                    }))
                },
                2850: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(2094),
                        A = "includes";
                    r(r.P + r.F * n(8852)(A), "String", {
                        includes: function(e) {
                            return !!~i(this, e, A).indexOf(e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    })
                },
                9115: (e, t, n) => {
                    "use strict";
                    var r = n(4496)(!0);
                    n(2923)(String, "String", (function(e) {
                        this._t = String(e), this._i = 0
                    }), (function() {
                        var e, t = this._t,
                            n = this._i;
                        return n >= t.length ? {
                            value: void 0,
                            done: !0
                        } : (e = r(t, n), this._i += e.length, {
                            value: e,
                            done: !1
                        })
                    }))
                },
                5767: (e, t, n) => {
                    "use strict";
                    var r = n(3816),
                        i = n(9181),
                        A = n(7057),
                        o = n(2985),
                        a = n(7234),
                        s = n(4728).KEY,
                        u = n(4253),
                        c = n(3825),
                        l = n(2943),
                        d = n(3953),
                        f = n(6314),
                        g = n(8787),
                        I = n(6074),
                        v = n(5541),
                        h = n(4302),
                        p = n(7007),
                        y = n(5286),
                        m = n(508),
                        C = n(2110),
                        E = n(1689),
                        b = n(681),
                        w = n(2503),
                        S = n(9327),
                        k = n(8693),
                        D = n(4548),
                        R = n(9275),
                        O = n(7184),
                        P = k.f,
                        B = R.f,
                        M = S.f,
                        x = r.Symbol,
                        G = r.JSON,
                        j = G && G.stringify,
                        T = f("_hidden"),
                        H = f("toPrimitive"),
                        U = {}.propertyIsEnumerable,
                        L = c("symbol-registry"),
                        z = c("symbols"),
                        Q = c("op-symbols"),
                        V = Object.prototype,
                        F = "function" == typeof x && !!D.f,
                        N = r.QObject,
                        J = !N || !N.prototype || !N.prototype.findChild,
                        Z = A && u((function() {
                            return 7 != w(B({}, "a", {
                                get: function() {
                                    return B(this, "a", {
                                        value: 7
                                    }).a
                                }
                            })).a
                        })) ? function(e, t, n) {
                            var r = P(V, t);
                            r && delete V[t], B(e, t, n), r && e !== V && B(V, t, r)
                        } : B,
                        K = function(e) {
                            var t = z[e] = w(x.prototype);
                            return t._k = e, t
                        },
                        X = F && "symbol" == typeof x.iterator ? function(e) {
                            return "symbol" == typeof e
                        } : function(e) {
                            return e instanceof x
                        },
                        Y = function(e, t, n) {
                            return e === V && Y(Q, t, n), p(e), t = E(t, !0), p(n), i(z, t) ? (n.enumerable ? (i(e, T) && e[T][t] && (e[T][t] = !1), n = w(n, {
                                enumerable: b(0, !1)
                            })) : (i(e, T) || B(e, T, b(1, {})), e[T][t] = !0), Z(e, t, n)) : B(e, t, n)
                        },
                        W = function(e, t) {
                            p(e);
                            for (var n, r = v(t = C(t)), i = 0, A = r.length; A > i;) Y(e, n = r[i++], t[n]);
                            return e
                        },
                        q = function(e) {
                            var t = U.call(this, e = E(e, !0));
                            return !(this === V && i(z, e) && !i(Q, e)) && (!(t || !i(this, e) || !i(z, e) || i(this, T) && this[T][e]) || t)
                        },
                        _ = function(e, t) {
                            if (e = C(e), t = E(t, !0), e !== V || !i(z, t) || i(Q, t)) {
                                var n = P(e, t);
                                return !n || !i(z, t) || i(e, T) && e[T][t] || (n.enumerable = !0), n
                            }
                        },
                        $ = function(e) {
                            for (var t, n = M(C(e)), r = [], A = 0; n.length > A;) i(z, t = n[A++]) || t == T || t == s || r.push(t);
                            return r
                        },
                        ee = function(e) {
                            for (var t, n = e === V, r = M(n ? Q : C(e)), A = [], o = 0; r.length > o;) !i(z, t = r[o++]) || n && !i(V, t) || A.push(z[t]);
                            return A
                        };
                    F || (x = function() {
                        if (this instanceof x) throw TypeError("Symbol is not a constructor!");
                        var e = d(arguments.length > 0 ? arguments[0] : void 0),
                            t = function(n) {
                                this === V && t.call(Q, n), i(this, T) && i(this[T], e) && (this[T][e] = !1), Z(this, e, b(1, n))
                            };
                        return A && J && Z(V, e, {
                            configurable: !0,
                            set: t
                        }), K(e)
                    }, a(x.prototype, "toString", (function() {
                        return this._k
                    })), k.f = _, R.f = Y, n(616).f = S.f = $, n(4682).f = q, D.f = ee, A && !n(4461) && a(V, "propertyIsEnumerable", q, !0), g.f = function(e) {
                        return K(f(e))
                    }), o(o.G + o.W + o.F * !F, {
                        Symbol: x
                    });
                    for (var te = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), ne = 0; te.length > ne;) f(te[ne++]);
                    for (var re = O(f.store), ie = 0; re.length > ie;) I(re[ie++]);
                    o(o.S + o.F * !F, "Symbol", {
                        for: function(e) {
                            return i(L, e += "") ? L[e] : L[e] = x(e)
                        },
                        keyFor: function(e) {
                            if (!X(e)) throw TypeError(e + " is not a symbol!");
                            for (var t in L)
                                if (L[t] === e) return t
                        },
                        useSetter: function() {
                            J = !0
                        },
                        useSimple: function() {
                            J = !1
                        }
                    }), o(o.S + o.F * !F, "Object", {
                        create: function(e, t) {
                            return void 0 === t ? w(e) : W(w(e), t)
                        },
                        defineProperty: Y,
                        defineProperties: W,
                        getOwnPropertyDescriptor: _,
                        getOwnPropertyNames: $,
                        getOwnPropertySymbols: ee
                    });
                    var Ae = u((function() {
                        D.f(1)
                    }));
                    o(o.S + o.F * Ae, "Object", {
                        getOwnPropertySymbols: function(e) {
                            return D.f(m(e))
                        }
                    }), G && o(o.S + o.F * (!F || u((function() {
                        var e = x();
                        return "[null]" != j([e]) || "{}" != j({
                            a: e
                        }) || "{}" != j(Object(e))
                    }))), "JSON", {
                        stringify: function(e) {
                            for (var t, n, r = [e], i = 1; arguments.length > i;) r.push(arguments[i++]);
                            if (n = t = r[1], (y(t) || void 0 !== e) && !X(e)) return h(t) || (t = function(e, t) {
                                if ("function" == typeof n && (t = n.call(this, e, t)), !X(t)) return t
                            }), r[1] = t, j.apply(G, r)
                        }
                    }), x.prototype[H] || n(7728)(x.prototype, H, x.prototype.valueOf), l(x, "Symbol"), l(Math, "Math", !0), l(r.JSON, "JSON", !0)
                },
                2773: (e, t, n) => {
                    "use strict";
                    var r = n(2985),
                        i = n(9315)(!0);
                    r(r.P, "Array", {
                        includes: function(e) {
                            return i(this, e, arguments.length > 1 ? arguments[1] : void 0)
                        }
                    }), n(7722)("includes")
                },
                8351: (e, t, n) => {
                    var r = n(2985),
                        i = n(7643),
                        A = n(2110),
                        o = n(8693),
                        a = n(2811);
                    r(r.S, "Object", {
                        getOwnPropertyDescriptors: function(e) {
                            for (var t, n, r = A(e), s = o.f, u = i(r), c = {}, l = 0; u.length > l;) void 0 !== (n = s(r, t = u[l++])) && a(c, t, n);
                            return c
                        }
                    })
                },
                1181: (e, t, n) => {
                    for (var r = n(6997), i = n(7184), A = n(7234), o = n(3816), a = n(7728), s = n(2803), u = n(6314), c = u("iterator"), l = u("toStringTag"), d = s.Array, f = {
                            CSSRuleList: !0,
                            CSSStyleDeclaration: !1,
                            CSSValueList: !1,
                            ClientRectList: !1,
                            DOMRectList: !1,
                            DOMStringList: !1,
                            DOMTokenList: !0,
                            DataTransferItemList: !1,
                            FileList: !1,
                            HTMLAllCollection: !1,
                            HTMLCollection: !1,
                            HTMLFormElement: !1,
                            HTMLSelectElement: !1,
                            MediaList: !0,
                            MimeTypeArray: !1,
                            NamedNodeMap: !1,
                            NodeList: !0,
                            PaintRequestList: !1,
                            Plugin: !1,
                            PluginArray: !1,
                            SVGLengthList: !1,
                            SVGNumberList: !1,
                            SVGPathSegList: !1,
                            SVGPointList: !1,
                            SVGStringList: !1,
                            SVGTransformList: !1,
                            SourceBufferList: !1,
                            StyleSheetList: !0,
                            TextTrackCueList: !1,
                            TextTrackList: !1,
                            TouchList: !1
                        }, g = i(f), I = 0; I < g.length; I++) {
                        var v, h = g[I],
                            p = f[h],
                            y = o[h],
                            m = y && y.prototype;
                        if (m && (m[c] || a(m, c, d), m[l] || a(m, l, h), s[h] = d, p))
                            for (v in r) m[v] || A(m, v, r[v], !0)
                    }
                },
                2975: (e, t, n) => {
                    "use strict";

                    function r(e, t, n, r) {
                        return new(n || (n = Promise))((function(i, A) {
                            function o(e) {
                                try {
                                    s(r.next(e))
                                } catch (e) {
                                    A(e)
                                }
                            }

                            function a(e) {
                                try {
                                    s(r.throw(e))
                                } catch (e) {
                                    A(e)
                                }
                            }

                            function s(e) {
                                var t;
                                e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
                                    e(t)
                                }))).then(o, a)
                            }
                            s((r = r.apply(e, t || [])).next())
                        }))
                    }
                    n.r(t), n.d(t, {
                        getGPUTier: () => f
                    });
                    const i = ["geforce 320m", "geforce 8600", "geforce 8600m gt", "geforce 8800 gs", "geforce 8800 gt", "geforce 9400", "geforce 9400m g", "geforce 9400m", "geforce 9600m gt", "geforce 9600m", "geforce fx go5200", "geforce gt 120", "geforce gt 130", "geforce gt 330m", "geforce gtx 285", "google swiftshader", "intel g41", "intel g45", "intel gma 4500mhd", "intel gma x3100", "intel hd 3000", "intel q45", "legacy", "mali-2", "mali-3", "mali-4", "quadro fx 1500", "quadro fx 4", "quadro fx 5", "radeon hd 2400", "radeon hd 2600", "radeon hd 4670", "radeon hd 4850", "radeon hd 4870", "radeon hd 5670", "radeon hd 5750", "radeon hd 6290", "radeon hd 6300", "radeon hd 6310", "radeon hd 6320", "radeon hd 6490m", "radeon hd 6630m", "radeon hd 6750m", "radeon hd 6770m", "radeon hd 6970m", "sgx 543", "sgx543"];

                    function A(e) {
                        return e.toLowerCase().replace(/^angle ?\((.+)\)*$/, "$1").replace(/\s(\d{1,2}gb|direct3d.+$)|\(r\)| \([^)]+\)$/g, "")
                    }
                    const o = "undefined" == typeof window,
                        a = (() => {
                            if (o) return;
                            const {
                                userAgent: e,
                                platform: t,
                                maxTouchPoints: n
                            } = window.navigator, r = /(iphone|ipod|ipad)/i.test(e), i = "iPad" === t || "MacIntel" === t && n > 0 && !window.MSStream;
                            return {
                                isIpad: i,
                                isMobile: /android/i.test(e) || r || i,
                                isSafari12: /Version\/12.+Safari/.test(e)
                            }
                        })(),
                        s = [],
                        u = [];

                    function c(e, t) {
                        if (e === t) return 0;
                        const n = e;
                        e.length > t.length && (e = t, t = n);
                        let r = e.length,
                            i = t.length;
                        for (; r > 0 && e.charCodeAt(~-r) === t.charCodeAt(~-i);) r--, i--;
                        let A, o = 0;
                        for (; o < r && e.charCodeAt(o) === t.charCodeAt(o);) o++;
                        if (r -= o, i -= o, 0 === r) return i;
                        let a, c, l = 0,
                            d = 0,
                            f = 0;
                        for (; d < r;) u[d] = e.charCodeAt(o + d), s[d] = ++d;
                        for (; f < i;)
                            for (A = t.charCodeAt(o + f), a = f++, l = f, d = 0; d < r; d++) c = A === u[d] ? a : a + 1, a = s[d], l = s[d] = a > l ? c > l ? l + 1 : c : c > a ? a + 1 : c;
                        return l
                    }

                    function l(e) {
                        return null != e
                    }
                    class d extends Error {
                        constructor(e) {
                            super(e), Object.setPrototypeOf(this, new.target.prototype)
                        }
                    }
                    const f = ({
                        mobileTiers: e = [0, 15, 30, 60],
                        desktopTiers: t = [0, 15, 30, 60],
                        override: n = {},
                        glContext: s,
                        failIfMajorPerformanceCaveat: u = !1,
                        benchmarksURL: f = "https://unpkg.com/detect-gpu@4.0.21/dist/benchmarks"
                    } = {}) => r(void 0, void 0, void 0, (function*() {
                        const g = {};
                        if (o) return {
                            tier: 0,
                            type: "SSR"
                        };
                        const {
                            isIpad: I = !!(null == a ? void 0 : a.isIpad),
                            isMobile: v = !!(null == a ? void 0 : a.isMobile),
                            screenSize: h = window.screen,
                            loadBenchmarks: p = (e => r(void 0, void 0, void 0, (function*() {
                                const t = yield fetch(`${f}/${e}`).then((e => e.json()));
                                if (parseInt(t.shift().split(".")[0], 10) < 4) throw new d("Detect GPU benchmark data is out of date. Please update to version 4x");
                                return t
                            })))
                        } = n;
                        let {
                            renderer: y
                        } = n;
                        const m = (e, t, n, r, i) => ({
                            device: i,
                            fps: r,
                            gpu: n,
                            isMobile: v,
                            tier: e,
                            type: t
                        });
                        let C, E = "";
                        if (y) y = A(y), C = [y];
                        else {
                            const e = s || function(e, t = !1) {
                                const n = {
                                    alpha: !1,
                                    antialias: !1,
                                    depth: !1,
                                    failIfMajorPerformanceCaveat: t,
                                    powerPreference: "high-performance",
                                    stencil: !1
                                };
                                e && delete n.powerPreference;
                                const r = window.document.createElement("canvas"),
                                    i = r.getContext("webgl", n) || r.getContext("experimental-webgl", n);
                                return null != i ? i : void 0
                            }(null == a ? void 0 : a.isSafari12, u);
                            if (!e) return m(0, "WEBGL_UNSUPPORTED");
                            const t = e.getExtension("WEBGL_debug_renderer_info");
                            if (t && (y = e.getParameter(t.UNMASKED_RENDERER_WEBGL)), !y) return m(1, "FALLBACK");
                            E = y, y = A(y), C = function(e, t, n) {
                                return "apple gpu" === t ? function(e, t, n) {
                                    if (!n) return [t];
                                    const r = function(e) {
                                            const t = e.createShader(35633),
                                                n = e.createShader(35632),
                                                r = e.createProgram();
                                            if (!(n && t && r)) return;
                                            e.shaderSource(t, "\n    precision highp float;\n    attribute vec3 aPosition;\n    varying float vvv;\n    void main() {\n      vvv = 0.31622776601683794;\n      gl_Position = vec4(aPosition, 1.0);\n    }\n  "), e.shaderSource(n, "\n    precision highp float;\n    varying float vvv;\n    void main() {\n      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * vvv;\n      enc = fract(enc);\n      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);\n      gl_FragColor = enc;\n    }\n  "), e.compileShader(t), e.compileShader(n), e.attachShader(r, t), e.attachShader(r, n), e.linkProgram(r), e.detachShader(r, t), e.detachShader(r, n), e.deleteShader(t), e.deleteShader(n), e.useProgram(r);
                                            const i = e.createBuffer();
                                            e.bindBuffer(34962, i), e.bufferData(34962, new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 35044);
                                            const A = e.getAttribLocation(r, "aPosition");
                                            e.vertexAttribPointer(A, 3, 5126, !1, 0, 0), e.enableVertexAttribArray(A), e.clearColor(1, 1, 1, 1), e.clear(16384), e.viewport(0, 0, 1, 1), e.drawArrays(4, 0, 3);
                                            const o = new Uint8Array(4);
                                            return e.readPixels(0, 0, 1, 1, 6408, 5121, o), e.deleteProgram(r), e.deleteBuffer(i), o.join("")
                                        }(e),
                                        i = "801621810",
                                        A = "8016218135",
                                        o = "80162181161",
                                        s = (null == a ? void 0 : a.isIpad) ? [
                                            ["a7", o, 12],
                                            ["a8", A, 15],
                                            ["a8x", A, 15],
                                            ["a9", A, 15],
                                            ["a9x", A, 15],
                                            ["a10", A, 15],
                                            ["a10x", A, 15],
                                            ["a12", i, 15],
                                            ["a12x", i, 15],
                                            ["a12z", i, 15],
                                            ["a14", i, 15],
                                            ["m1", i, 15]
                                        ] : [
                                            ["a7", o, 12],
                                            ["a8", A, 12],
                                            ["a9", A, 15],
                                            ["a10", A, 15],
                                            ["a11", i, 15],
                                            ["a12", i, 15],
                                            ["a13", i, 15],
                                            ["a14", i, 15]
                                        ];
                                    let u;
                                    return "80162181255" === r ? u = s.filter((([, , e]) => e >= 14)) : (u = s.filter((([, e]) => e === r)), u.length || (u = s)), u.map((([e]) => `apple ${e} gpu`))
                                }(e, t, n) : [t]
                            }(e, y, v)
                        }
                        const b = (yield Promise.all(C.map((e => r(void 0, void 0, void 0, (function*() {
                            var t;
                            const n = (e => {
                                const t = v ? ["adreno", "apple", "mali-t", "mali", "nvidia", "powervr"] : ["intel", "apple", "amd", "radeon", "nvidia", "geforce"];
                                for (const n of t)
                                    if (e.includes(n)) return n
                            })(e);
                            if (!n) return;
                            const r = `${v?"m":"d"}-${n}${I?"-ipad":""}.json`,
                                i = g[r] = null !== (t = g[r]) && void 0 !== t ? t : p(r);
                            let A;
                            try {
                                A = yield i
                            } catch (t) {
                                if (t instanceof d) throw t;
                                return
                            }
                            const o = function(e) {
                                var t;
                                const n = (e = e.replace(/\([^)]+\)/, "")).match(/\d+/) || e.match(/(\W|^)([A-Za-z]{1,3})(\W|$)/g);
                                return null !== (t = null == n ? void 0 : n.join("").replace(/\W|amd/g, "")) && void 0 !== t ? t : ""
                            }(e);
                            let a = A.filter((([, e]) => e === o));
                            a.length || (a = A.filter((([t]) => t.includes(e))));
                            const s = a.length;
                            if (0 === s) return;
                            let u, [l, , , f] = s > 1 ? a.map((t => [t, c(e, t[0])])).sort((([, e], [, t]) => e - t))[0][0] : a[0],
                                y = Number.MAX_VALUE;
                            const {
                                devicePixelRatio: m
                            } = window, C = h.width * m * h.height * m;
                            for (const e of f) {
                                const [t, n] = e, r = t * n, i = Math.abs(C - r);
                                i < y && (y = i, u = e)
                            }
                            if (!u) return;
                            const [, , E, b] = u;
                            return [y, E, l, b]
                        })))))).filter(l).sort((([e = Number.MAX_VALUE, t], [n = Number.MAX_VALUE, r]) => e === n ? t - r : e - n));
                        if (!b.length) {
                            const e = i.find((e => y.includes(e)));
                            return e ? m(0, "BLOCKLISTED", e) : m(1, "FALLBACK", `${y} (${E})`)
                        }
                        const [, w, S, k] = b[0];
                        if (-1 === w) return m(0, "BLOCKLISTED", S, w, k);
                        const D = v ? e : t;
                        let R = 0;
                        for (let e = 0; e < D.length; e++) w >= D[e] && (R = e);
                        return m(R, "BENCHMARK", S, w, k)
                    }))
                },
                4602: (e, t) => {
                    (() => {
                        var e = {
                                912: (e, t, n) => {
                                    function r(e) {
                                        return function(e) {
                                            if (Array.isArray(e)) return i(e)
                                        }(e) || function(e) {
                                            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
                                        }(e) || function(e, t) {
                                            if (e) {
                                                if ("string" == typeof e) return i(e, t);
                                                var n = Object.prototype.toString.call(e).slice(8, -1);
                                                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0
                                            }
                                        }(e) || function() {
                                            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                                        }()
                                    }

                                    function i(e, t) {
                                        (null == t || t > e.length) && (t = e.length);
                                        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                                        return r
                                    }

                                    function A(e, t) {
                                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                    }
                                    var o = n(806),
                                        a = n(49),
                                        s = n(461),
                                        u = function() {
                                            function e(t, n) {
                                                var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                                    i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
                                                A(this, e), o.GameAnalytics.gaCommand("setEnabledInfoLog", r), this._gameKey = t, this._secretKey = n, this._initiliazed = !1, this._commandBuffer = [], i && this.init()
                                            }
                                            var t, n;
                                            return t = e, n = [{
                                                key: "init",
                                                value: function() {
                                                    var e = this;
                                                    this._getBeforeInitCommands().forEach((function(t) {
                                                        var n = t.callback;
                                                        n.call.apply(n, [e].concat(r(t.args)))
                                                    })), this._initiliazed = !0, o.GameAnalytics.gaCommand("initialize", this._gameKey, this._secretKey), this._getAfterInitCommands().forEach((function(t) {
                                                        var n = t.callback;
                                                        n.call.apply(n, [e].concat(r(t.args)))
                                                    }))
                                                }
                                            }, {
                                                key: "_getBeforeInitCommands",
                                                value: function() {
                                                    return this._commandBuffer.filter((function(e) {
                                                        return !0 === e.beforeInit
                                                    }))
                                                }
                                            }, {
                                                key: "_getAfterInitCommands",
                                                value: function() {
                                                    return this._commandBuffer.filter((function(e) {
                                                        return !1 === e.beforeInit
                                                    }))
                                                }
                                            }, {
                                                key: "_delayCommand",
                                                value: function(e) {
                                                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                                                        n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                                                    return !1 === this._initiliazed && this._commandBuffer.push({
                                                        callback: e,
                                                        args: t,
                                                        beforeInit: n
                                                    }), !this._initiliazed
                                                }
                                            }, {
                                                key: "onCustomEvent",
                                                value: function(e, t) {
                                                    this._delayCommand(this.onCustomEvent, [e, t]) || o.GameAnalytics.gaCommand(a.DESIGNEVENT, e, t)
                                                }
                                            }, {
                                                key: "onGameShopOpen",
                                                value: function() {
                                                    this._delayCommand(this.onGameShopOpen) || o.GameAnalytics.gaCommand(a.DESIGNEVENT, "shopOpen", 1)
                                                }
                                            }, {
                                                key: "onGameShopPurchase",
                                                value: function() {
                                                    this._delayCommand(this.onGameShopPurchase) || o.GameAnalytics.gaCommand(a.DESIGNEVENT, "shopPurchase", 1)
                                                }
                                            }, {
                                                key: "onGamePreloadEnd",
                                                value: function(e) {
                                                    this._delayCommand(this.onGamePreloadEnd, [e]) || o.GameAnalytics.gaCommand(a.DESIGNEVENT, "preloadingTime", e)
                                                }
                                            }, {
                                                key: "onGameSetBuildVersion",
                                                value: function(e) {
                                                    this._delayCommand(this.onGameSetBuildVersion, [e], !0) || o.GameAnalytics.gaCommand("configureBuild", e)
                                                }
                                            }, {
                                                key: "onGameSetUserId",
                                                value: function(e) {
                                                    this._delayCommand(this.onGameSetUserId, [e], !0) || o.GameAnalytics.gaCommand("configureUserId", e)
                                                }
                                            }, {
                                                key: "onGameError",
                                                value: function(e) {
                                                    this._delayCommand(this.onGameError, [e]) || o.GameAnalytics.gaCommand(a.ERROREVENT, o.EGAErrorSeverity.Debug, e)
                                                }
                                            }, {
                                                key: "onLevelStarted",
                                                value: function(e) {
                                                    this._delayCommand(this.onLevelStarted, [e]) || o.GameAnalytics.gaCommand(a.PROGRESSIONEVENT, "Start", e || " ", null, null, {})
                                                }
                                            }, {
                                                key: "onLevelEnded",
                                                value: function(e, t, n) {
                                                    this._delayCommand(this.onLevelEnded, [e, t, n]) || o.GameAnalytics.gaCommand(a.PROGRESSIONEVENT, !0 === t ? "Complete" : "Fail", n || " ", null, null, {
                                                        score: e
                                                    })
                                                }
                                            }, {
                                                key: "onAdFailedLoad",
                                                value: function(e, t) {
                                                    if (!this._delayCommand(this.onAdFailedLoad, [e, t])) {
                                                        var n = s.typeToAd(e);
                                                        o.GameAnalytics.gaCommand(a.ADEVENT, o.EGAAdAction.FailedShow, n.id, t, n.name + "Impression")
                                                    }
                                                }
                                            }, {
                                                key: "onAdImpression",
                                                value: function(e, t) {
                                                    if (!this._delayCommand(this.onAdImpression, [e, t])) {
                                                        var n = s.typeToAd(e);
                                                        o.GameAnalytics.gaCommand(a.ADEVENT, o.EGAAdAction.Show, n.id, t, n.name + "Impression")
                                                    }
                                                }
                                            }], n && function(e, t) {
                                                for (var n = 0; n < t.length; n++) {
                                                    var r = t[n];
                                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                                                }
                                            }(t.prototype, n), Object.defineProperty(t, "prototype", {
                                                writable: !1
                                            }), e
                                        }();
                                    e.exports = u
                                },
                                461: e => {
                                    function t(e, t, n) {
                                        return t in e ? Object.defineProperty(e, t, {
                                            value: n,
                                            enumerable: !0,
                                            configurable: !0,
                                            writable: !0
                                        }) : e[t] = n, e
                                    }
                                    var n = function() {
                                        function e() {
                                            ! function(e, t) {
                                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                            }(this, e)
                                        }
                                        var t, n;
                                        return t = e, n = [{
                                            key: "typeToAd",
                                            value: function(t) {
                                                var n = [e.VIDEO, e.REWARDED, e.REWARDED_INTERSTITIAL, e.PLAYABLE, e.INTERSTITIAL, e.OFFERWALL, e.BANNER],
                                                    r = n.indexOf(t);
                                                return -1 === r ? e.BANNER : n[r]
                                            }
                                        }], n && function(e, t) {
                                            for (var n = 0; n < t.length; n++) {
                                                var r = t[n];
                                                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                                            }
                                        }(t, n), Object.defineProperty(t, "prototype", {
                                            writable: !1
                                        }), e
                                    }();
                                    t(n, "VIDEO", {
                                        name: "Video",
                                        id: 1
                                    }), t(n, "REWARDED", {
                                        name: "RewardedVideo",
                                        id: 2
                                    }), t(n, "PLAYABLE", {
                                        name: "Playable",
                                        id: 3
                                    }), t(n, "INTERSTITIAL", {
                                        name: "Interstitial",
                                        id: 4
                                    }), t(n, "OFFERWALL", {
                                        name: "OfferWall",
                                        id: 5
                                    }), t(n, "BANNER", {
                                        name: "Banner",
                                        id: 6
                                    }), t(n, "REWARDED_INTERSTITIAL", {
                                        name: "RewardedVideo",
                                        id: 7
                                    }), e.exports = n
                                },
                                49: e => {
                                    function t(e, t, n) {
                                        return t in e ? Object.defineProperty(e, t, {
                                            value: n,
                                            enumerable: !0,
                                            configurable: !0,
                                            writable: !0
                                        }) : e[t] = n, e
                                    }
                                    var n = function(e, t, n) {
                                        return Object.defineProperty(e, "prototype", {
                                            writable: !1
                                        }), e
                                    }((function e() {
                                        ! function(e, t) {
                                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                                        }(this, e)
                                    }));
                                    t(n, "PROGRESSIONEVENT", "addProgressionEvent"), t(n, "DESIGNEVENT", "addDesignEvent"), t(n, "ERROREVENT", "addErrorEvent"), t(n, "ADEVENT", "addAdEvent"), e.exports = n
                                },
                                579: (e, t, n) => {
                                    var r = n(912),
                                        i = n(461);
                                    e.exports = {
                                        H5Analytics: r,
                                        ADTYPE: i,
                                        REWARDED: i.REWARDED,
                                        VIDEO: i.VIDEO,
                                        PLAYABLE: i.PLAYABLE,
                                        INTERSTITIAL: i.INTERSTITIAL,
                                        REWARDED_INTERSTITIAL: i.REWARDED_INTERSTITIAL,
                                        OFFERWALL: i.OFFERWALL,
                                        BANNER: i.BANNER
                                    }
                                },
                                806: (e, t, n) => {
                                    "use strict";
                                    var r, i, A, o, a = a || function(e, t) {
                                        var n = {},
                                            r = n.lib = {},
                                            i = function() {},
                                            A = r.Base = {
                                                extend: function(e) {
                                                    i.prototype = this;
                                                    var t = new i;
                                                    return e && t.mixIn(e), t.hasOwnProperty("init") || (t.init = function() {
                                                        t.$super.init.apply(this, arguments)
                                                    }), t.init.prototype = t, t.$super = this, t
                                                },
                                                create: function() {
                                                    var e = this.extend();
                                                    return e.init.apply(e, arguments), e
                                                },
                                                init: function() {},
                                                mixIn: function(e) {
                                                    for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                                                    e.hasOwnProperty("toString") && (this.toString = e.toString)
                                                },
                                                clone: function() {
                                                    return this.init.prototype.extend(this)
                                                }
                                            },
                                            o = r.WordArray = A.extend({
                                                init: function(e, t) {
                                                    e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length
                                                },
                                                toString: function(e) {
                                                    return (e || s).stringify(this)
                                                },
                                                concat: function(e) {
                                                    var t = this.words,
                                                        n = e.words,
                                                        r = this.sigBytes;
                                                    if (e = e.sigBytes, this.clamp(), r % 4)
                                                        for (var i = 0; i < e; i++) t[r + i >>> 2] |= (n[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 24 - (r + i) % 4 * 8;
                                                    else if (65535 < n.length)
                                                        for (i = 0; i < e; i += 4) t[r + i >>> 2] = n[i >>> 2];
                                                    else t.push.apply(t, n);
                                                    return this.sigBytes += e, this
                                                },
                                                clamp: function() {
                                                    var t = this.words,
                                                        n = this.sigBytes;
                                                    t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, t.length = e.ceil(n / 4)
                                                },
                                                clone: function() {
                                                    var e = A.clone.call(this);
                                                    return e.words = this.words.slice(0), e
                                                },
                                                random: function(t) {
                                                    for (var n = [], r = 0; r < t; r += 4) n.push(4294967296 * e.random() | 0);
                                                    return new o.init(n, t)
                                                }
                                            }),
                                            a = n.enc = {},
                                            s = a.Hex = {
                                                stringify: function(e) {
                                                    var t = e.words;
                                                    e = e.sigBytes;
                                                    for (var n = [], r = 0; r < e; r++) {
                                                        var i = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
                                                        n.push((i >>> 4).toString(16)), n.push((15 & i).toString(16))
                                                    }
                                                    return n.join("")
                                                },
                                                parse: function(e) {
                                                    for (var t = e.length, n = [], r = 0; r < t; r += 2) n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
                                                    return new o.init(n, t / 2)
                                                }
                                            },
                                            u = a.Latin1 = {
                                                stringify: function(e) {
                                                    var t = e.words;
                                                    e = e.sigBytes;
                                                    for (var n = [], r = 0; r < e; r++) n.push(String.fromCharCode(t[r >>> 2] >>> 24 - r % 4 * 8 & 255));
                                                    return n.join("")
                                                },
                                                parse: function(e) {
                                                    for (var t = e.length, n = [], r = 0; r < t; r++) n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
                                                    return new o.init(n, t)
                                                }
                                            },
                                            c = a.Utf8 = {
                                                stringify: function(e) {
                                                    try {
                                                        return decodeURIComponent(escape(u.stringify(e)))
                                                    } catch (e) {
                                                        throw Error("Malformed UTF-8 data")
                                                    }
                                                },
                                                parse: function(e) {
                                                    return u.parse(unescape(encodeURIComponent(e)))
                                                }
                                            },
                                            l = r.BufferedBlockAlgorithm = A.extend({
                                                reset: function() {
                                                    this._data = new o.init, this._nDataBytes = 0
                                                },
                                                _append: function(e) {
                                                    "string" == typeof e && (e = c.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
                                                },
                                                _process: function(t) {
                                                    var n = this._data,
                                                        r = n.words,
                                                        i = n.sigBytes,
                                                        A = this.blockSize,
                                                        a = i / (4 * A);
                                                    if (t = (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) * A, i = e.min(4 * t, i), t) {
                                                        for (var s = 0; s < t; s += A) this._doProcessBlock(r, s);
                                                        s = r.splice(0, t), n.sigBytes -= i
                                                    }
                                                    return new o.init(s, i)
                                                },
                                                clone: function() {
                                                    var e = A.clone.call(this);
                                                    return e._data = this._data.clone(), e
                                                },
                                                _minBufferSize: 0
                                            });
                                        r.Hasher = l.extend({
                                            cfg: A.extend(),
                                            init: function(e) {
                                                this.cfg = this.cfg.extend(e), this.reset()
                                            },
                                            reset: function() {
                                                l.reset.call(this), this._doReset()
                                            },
                                            update: function(e) {
                                                return this._append(e), this._process(), this
                                            },
                                            finalize: function(e) {
                                                return e && this._append(e), this._doFinalize()
                                            },
                                            blockSize: 16,
                                            _createHelper: function(e) {
                                                return function(t, n) {
                                                    return new e.init(n).finalize(t)
                                                }
                                            },
                                            _createHmacHelper: function(e) {
                                                return function(t, n) {
                                                    return new d.HMAC.init(e, n).finalize(t)
                                                }
                                            }
                                        });
                                        var d = n.algo = {};
                                        return n
                                    }(Math);
                                    ! function(e) {
                                        for (var t = a, n = (i = t.lib).WordArray, r = i.Hasher, i = t.algo, A = [], o = [], s = function(e) {
                                                return 4294967296 * (e - (0 | e)) | 0
                                            }, u = 2, c = 0; 64 > c;) {
                                            var l;
                                            e: {
                                                l = u;
                                                for (var d = e.sqrt(l), f = 2; f <= d; f++)
                                                    if (!(l % f)) {
                                                        l = !1;
                                                        break e
                                                    }
                                                l = !0
                                            }
                                            l && (8 > c && (A[c] = s(e.pow(u, .5))), o[c] = s(e.pow(u, 1 / 3)), c++), u++
                                        }
                                        var g = [];
                                        i = i.SHA256 = r.extend({
                                            _doReset: function() {
                                                this._hash = new n.init(A.slice(0))
                                            },
                                            _doProcessBlock: function(e, t) {
                                                for (var n = this._hash.words, r = n[0], i = n[1], A = n[2], a = n[3], s = n[4], u = n[5], c = n[6], l = n[7], d = 0; 64 > d; d++) {
                                                    if (16 > d) g[d] = 0 | e[t + d];
                                                    else {
                                                        var f = g[d - 15],
                                                            I = g[d - 2];
                                                        g[d] = ((f << 25 | f >>> 7) ^ (f << 14 | f >>> 18) ^ f >>> 3) + g[d - 7] + ((I << 15 | I >>> 17) ^ (I << 13 | I >>> 19) ^ I >>> 10) + g[d - 16]
                                                    }
                                                    f = l + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + (s & u ^ ~s & c) + o[d] + g[d], I = ((r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22)) + (r & i ^ r & A ^ i & A), l = c, c = u, u = s, s = a + f | 0, a = A, A = i, i = r, r = f + I | 0
                                                }
                                                n[0] = n[0] + r | 0, n[1] = n[1] + i | 0, n[2] = n[2] + A | 0, n[3] = n[3] + a | 0, n[4] = n[4] + s | 0, n[5] = n[5] + u | 0, n[6] = n[6] + c | 0, n[7] = n[7] + l | 0
                                            },
                                            _doFinalize: function() {
                                                var t = this._data,
                                                    n = t.words,
                                                    r = 8 * this._nDataBytes,
                                                    i = 8 * t.sigBytes;
                                                return n[i >>> 5] |= 128 << 24 - i % 32, n[14 + (i + 64 >>> 9 << 4)] = e.floor(r / 4294967296), n[15 + (i + 64 >>> 9 << 4)] = r, t.sigBytes = 4 * n.length, this._process(), this._hash
                                            },
                                            clone: function() {
                                                var e = r.clone.call(this);
                                                return e._hash = this._hash.clone(), e
                                            }
                                        }), t.SHA256 = r._createHelper(i), t.HmacSHA256 = r._createHmacHelper(i)
                                    }(Math), i = (r = a).enc.Utf8, r.algo.HMAC = r.lib.Base.extend({
                                            init: function(e, t) {
                                                e = this._hasher = new e.init, "string" == typeof t && (t = i.parse(t));
                                                var n = e.blockSize,
                                                    r = 4 * n;
                                                t.sigBytes > r && (t = e.finalize(t)), t.clamp();
                                                for (var A = this._oKey = t.clone(), o = this._iKey = t.clone(), a = A.words, s = o.words, u = 0; u < n; u++) a[u] ^= 1549556828, s[u] ^= 909522486;
                                                A.sigBytes = o.sigBytes = r, this.reset()
                                            },
                                            reset: function() {
                                                var e = this._hasher;
                                                e.reset(), e.update(this._iKey)
                                            },
                                            update: function(e) {
                                                return this._hasher.update(e), this
                                            },
                                            finalize: function(e) {
                                                var t = this._hasher;
                                                return e = t.finalize(e), t.reset(), t.finalize(this._oKey.clone().concat(e))
                                            }
                                        }),
                                        function() {
                                            var e = a,
                                                t = e.lib.WordArray;
                                            e.enc.Base64 = {
                                                stringify: function(e) {
                                                    var t = e.words,
                                                        n = e.sigBytes,
                                                        r = this._map;
                                                    e.clamp(), e = [];
                                                    for (var i = 0; i < n; i += 3)
                                                        for (var A = (t[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 16 | (t[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255) << 8 | t[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255, o = 0; 4 > o && i + .75 * o < n; o++) e.push(r.charAt(A >>> 6 * (3 - o) & 63));
                                                    if (t = r.charAt(64))
                                                        for (; e.length % 4;) e.push(t);
                                                    return e.join("")
                                                },
                                                parse: function(e) {
                                                    var n = e.length,
                                                        r = this._map;
                                                    (i = r.charAt(64)) && -1 != (i = e.indexOf(i)) && (n = i);
                                                    for (var i = [], A = 0, o = 0; o < n; o++)
                                                        if (o % 4) {
                                                            var a = r.indexOf(e.charAt(o - 1)) << o % 4 * 2,
                                                                s = r.indexOf(e.charAt(o)) >>> 6 - o % 4 * 2;
                                                            i[A >>> 2] |= (a | s) << 24 - A % 4 * 8, A++
                                                        }
                                                    return t.create(i, A)
                                                },
                                                _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                                            }
                                        }(),
                                        function(e) {
                                            var t, n, r, i, A, o, a, s, u, c, l, d, f;
                                            (f = e.EGAErrorSeverity || (e.EGAErrorSeverity = {}))[f.Undefined = 0] = "Undefined", f[f.Debug = 1] = "Debug", f[f.Info = 2] = "Info", f[f.Warning = 3] = "Warning", f[f.Error = 4] = "Error", f[f.Critical = 5] = "Critical", (d = e.EGAProgressionStatus || (e.EGAProgressionStatus = {}))[d.Undefined = 0] = "Undefined", d[d.Start = 1] = "Start", d[d.Complete = 2] = "Complete", d[d.Fail = 3] = "Fail", (l = e.EGAResourceFlowType || (e.EGAResourceFlowType = {}))[l.Undefined = 0] = "Undefined", l[l.Source = 1] = "Source", l[l.Sink = 2] = "Sink", (c = e.EGAAdAction || (e.EGAAdAction = {}))[c.Undefined = 0] = "Undefined", c[c.Clicked = 1] = "Clicked", c[c.Show = 2] = "Show", c[c.FailedShow = 3] = "FailedShow", c[c.RewardReceived = 4] = "RewardReceived", (u = e.EGAAdError || (e.EGAAdError = {}))[u.Undefined = 0] = "Undefined", u[u.Unknown = 1] = "Unknown", u[u.Offline = 2] = "Offline", u[u.NoFill = 3] = "NoFill", u[u.InternalError = 4] = "InternalError", u[u.InvalidRequest = 5] = "InvalidRequest", u[u.UnableToPrecache = 6] = "UnableToPrecache", (s = e.EGAAdType || (e.EGAAdType = {}))[s.Undefined = 0] = "Undefined", s[s.Video = 1] = "Video", s[s.RewardedVideo = 2] = "RewardedVideo", s[s.Playable = 3] = "Playable", s[s.Interstitial = 4] = "Interstitial", s[s.OfferWall = 5] = "OfferWall", s[s.Banner = 6] = "Banner", (a = (o = e.http || (e.http = {})).EGAHTTPApiResponse || (o.EGAHTTPApiResponse = {}))[a.NoResponse = 0] = "NoResponse", a[a.BadResponse = 1] = "BadResponse", a[a.RequestTimeout = 2] = "RequestTimeout", a[a.JsonEncodeFailed = 3] = "JsonEncodeFailed", a[a.JsonDecodeFailed = 4] = "JsonDecodeFailed", a[a.InternalServerError = 5] = "InternalServerError", a[a.BadRequest = 6] = "BadRequest", a[a.Unauthorized = 7] = "Unauthorized", a[a.UnknownResponseCode = 8] = "UnknownResponseCode", a[a.Ok = 9] = "Ok", a[a.Created = 10] = "Created", (A = (t = e.events || (e.events = {})).EGASdkErrorCategory || (t.EGASdkErrorCategory = {}))[A.Undefined = 0] = "Undefined", A[A.EventValidation = 1] = "EventValidation", A[A.Database = 2] = "Database", A[A.Init = 3] = "Init", A[A.Http = 4] = "Http", A[A.Json = 5] = "Json", (i = t.EGASdkErrorArea || (t.EGASdkErrorArea = {}))[i.Undefined = 0] = "Undefined", i[i.BusinessEvent = 1] = "BusinessEvent", i[i.ResourceEvent = 2] = "ResourceEvent", i[i.ProgressionEvent = 3] = "ProgressionEvent", i[i.DesignEvent = 4] = "DesignEvent", i[i.ErrorEvent = 5] = "ErrorEvent", i[i.InitHttp = 9] = "InitHttp", i[i.EventsHttp = 10] = "EventsHttp", i[i.ProcessEvents = 11] = "ProcessEvents", i[i.AddEventsToStore = 12] = "AddEventsToStore", i[i.AdEvent = 20] = "AdEvent", (r = t.EGASdkErrorAction || (t.EGASdkErrorAction = {}))[r.Undefined = 0] = "Undefined", r[r.InvalidCurrency = 1] = "InvalidCurrency", r[r.InvalidShortString = 2] = "InvalidShortString", r[r.InvalidEventPartLength = 3] = "InvalidEventPartLength", r[r.InvalidEventPartCharacters = 4] = "InvalidEventPartCharacters", r[r.InvalidStore = 5] = "InvalidStore", r[r.InvalidFlowType = 6] = "InvalidFlowType", r[r.StringEmptyOrNull = 7] = "StringEmptyOrNull", r[r.NotFoundInAvailableCurrencies = 8] = "NotFoundInAvailableCurrencies", r[r.InvalidAmount = 9] = "InvalidAmount", r[r.NotFoundInAvailableItemTypes = 10] = "NotFoundInAvailableItemTypes", r[r.WrongProgressionOrder = 11] = "WrongProgressionOrder", r[r.InvalidEventIdLength = 12] = "InvalidEventIdLength", r[r.InvalidEventIdCharacters = 13] = "InvalidEventIdCharacters", r[r.InvalidProgressionStatus = 15] = "InvalidProgressionStatus", r[r.InvalidSeverity = 16] = "InvalidSeverity", r[r.InvalidLongString = 17] = "InvalidLongString", r[r.DatabaseTooLarge = 18] = "DatabaseTooLarge", r[r.DatabaseOpenOrCreate = 19] = "DatabaseOpenOrCreate", r[r.JsonError = 25] = "JsonError", r[r.FailHttpJsonDecode = 29] = "FailHttpJsonDecode", r[r.FailHttpJsonEncode = 30] = "FailHttpJsonEncode", r[r.InvalidAdAction = 31] = "InvalidAdAction", r[r.InvalidAdType = 32] = "InvalidAdType", r[r.InvalidString = 33] = "InvalidString", (n = t.EGASdkErrorParameter || (t.EGASdkErrorParameter = {}))[n.Undefined = 0] = "Undefined", n[n.Currency = 1] = "Currency", n[n.CartType = 2] = "CartType", n[n.ItemType = 3] = "ItemType", n[n.ItemId = 4] = "ItemId", n[n.Store = 5] = "Store", n[n.FlowType = 6] = "FlowType", n[n.Amount = 7] = "Amount", n[n.Progression01 = 8] = "Progression01", n[n.Progression02 = 9] = "Progression02", n[n.Progression03 = 10] = "Progression03", n[n.EventId = 11] = "EventId", n[n.ProgressionStatus = 12] = "ProgressionStatus", n[n.Severity = 13] = "Severity", n[n.Message = 14] = "Message", n[n.AdAction = 15] = "AdAction", n[n.AdType = 16] = "AdType", n[n.AdSdkName = 17] = "AdSdkName", n[n.AdPlacement = 18] = "AdPlacement"
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i, A, o;
                                            (o = e.EGAErrorSeverity || (e.EGAErrorSeverity = {}))[o.Undefined = 0] = "Undefined", o[o.Debug = 1] = "Debug", o[o.Info = 2] = "Info", o[o.Warning = 3] = "Warning", o[o.Error = 4] = "Error", o[o.Critical = 5] = "Critical", (A = e.EGAProgressionStatus || (e.EGAProgressionStatus = {}))[A.Undefined = 0] = "Undefined", A[A.Start = 1] = "Start", A[A.Complete = 2] = "Complete", A[A.Fail = 3] = "Fail", (i = e.EGAResourceFlowType || (e.EGAResourceFlowType = {}))[i.Undefined = 0] = "Undefined", i[i.Source = 1] = "Source", i[i.Sink = 2] = "Sink", (r = e.EGAAdAction || (e.EGAAdAction = {}))[r.Undefined = 0] = "Undefined", r[r.Clicked = 1] = "Clicked", r[r.Show = 2] = "Show", r[r.FailedShow = 3] = "FailedShow", r[r.RewardReceived = 4] = "RewardReceived", (n = e.EGAAdError || (e.EGAAdError = {}))[n.Undefined = 0] = "Undefined", n[n.Unknown = 1] = "Unknown", n[n.Offline = 2] = "Offline", n[n.NoFill = 3] = "NoFill", n[n.InternalError = 4] = "InternalError", n[n.InvalidRequest = 5] = "InvalidRequest", n[n.UnableToPrecache = 6] = "UnableToPrecache", (t = e.EGAAdType || (e.EGAAdType = {}))[t.Undefined = 0] = "Undefined", t[t.Video = 1] = "Video", t[t.RewardedVideo = 2] = "RewardedVideo", t[t.Playable = 3] = "Playable", t[t.Interstitial = 4] = "Interstitial", t[t.OfferWall = 5] = "OfferWall", t[t.Banner = 6] = "Banner"
                                        }(A || (A = {})),
                                        function(e) {
                                            ! function(e) {
                                                var t;
                                                ! function(e) {
                                                    e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Info = 2] = "Info", e[e.Debug = 3] = "Debug"
                                                }(t || (t = {}));
                                                var n = function() {
                                                    function e() {
                                                        e.debugEnabled = !1
                                                    }
                                                    return e.setInfoLog = function(t) {
                                                        e.instance.infoLogEnabled = t
                                                    }, e.setVerboseLog = function(t) {
                                                        e.instance.infoLogVerboseEnabled = t
                                                    }, e.i = function(n) {
                                                        if (e.instance.infoLogEnabled) {
                                                            var r = "Info/" + e.Tag + ": " + n;
                                                            e.instance.sendNotificationMessage(r, t.Info)
                                                        }
                                                    }, e.w = function(n) {
                                                        var r = "Warning/" + e.Tag + ": " + n;
                                                        e.instance.sendNotificationMessage(r, t.Warning)
                                                    }, e.e = function(n) {
                                                        var r = "Error/" + e.Tag + ": " + n;
                                                        e.instance.sendNotificationMessage(r, t.Error)
                                                    }, e.ii = function(n) {
                                                        if (e.instance.infoLogVerboseEnabled) {
                                                            var r = "Verbose/" + e.Tag + ": " + n;
                                                            e.instance.sendNotificationMessage(r, t.Info)
                                                        }
                                                    }, e.d = function(n) {
                                                        if (e.debugEnabled) {
                                                            var r = "Debug/" + e.Tag + ": " + n;
                                                            e.instance.sendNotificationMessage(r, t.Debug)
                                                        }
                                                    }, e.prototype.sendNotificationMessage = function(e, n) {
                                                        switch (n) {
                                                            case t.Error:
                                                                console.error(e);
                                                                break;
                                                            case t.Warning:
                                                                console.warn(e);
                                                                break;
                                                            case t.Debug:
                                                                "function" == typeof console.debug ? console.debug(e) : console.log(e);
                                                                break;
                                                            case t.Info:
                                                                console.log(e)
                                                        }
                                                    }, e.instance = new e, e.Tag = "GameAnalytics", e
                                                }();
                                                e.GALogger = n
                                            }(e.logging || (e.logging = {}))
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r;
                                            t = e.utilities || (e.utilities = {}), n = e.logging.GALogger, r = function() {
                                                function e() {}
                                                return e.getHmac = function(e, t) {
                                                    var n = a.HmacSHA256(t, e);
                                                    return a.enc.Base64.stringify(n)
                                                }, e.stringMatch = function(e, t) {
                                                    return !(!e || !t) && t.test(e)
                                                }, e.joinStringArray = function(e, t) {
                                                    for (var n = "", r = 0, i = e.length; r < i; r++) r > 0 && (n += t), n += e[r];
                                                    return n
                                                }, e.stringArrayContainsString = function(e, t) {
                                                    if (0 === e.length) return !1;
                                                    for (var n in e)
                                                        if (e[n] === t) return !0;
                                                    return !1
                                                }, e.encode64 = function(t) {
                                                    t = encodeURI(t);
                                                    var n, r, i, A, o, a = "",
                                                        s = 0,
                                                        u = 0,
                                                        c = 0;
                                                    do {
                                                        i = (n = t.charCodeAt(c++)) >> 2, A = (3 & n) << 4 | (r = t.charCodeAt(c++)) >> 4, o = (15 & r) << 2 | (s = t.charCodeAt(c++)) >> 6, u = 63 & s, isNaN(r) ? o = u = 64 : isNaN(s) && (u = 64), a = a + e.keyStr.charAt(i) + e.keyStr.charAt(A) + e.keyStr.charAt(o) + e.keyStr.charAt(u), n = r = s = 0, i = A = o = u = 0
                                                    } while (c < t.length);
                                                    return a
                                                }, e.decode64 = function(t) {
                                                    var r, i, A, o, a = "",
                                                        s = 0,
                                                        u = 0,
                                                        c = 0;
                                                    /[^A-Za-z0-9\+\/\=]/g.exec(t) && n.w("There were invalid base64 characters in the input text. Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='. Expect errors in decoding."), t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                                                    do {
                                                        r = e.keyStr.indexOf(t.charAt(c++)) << 2 | (A = e.keyStr.indexOf(t.charAt(c++))) >> 4, i = (15 & A) << 4 | (o = e.keyStr.indexOf(t.charAt(c++))) >> 2, s = (3 & o) << 6 | (u = e.keyStr.indexOf(t.charAt(c++))), a += String.fromCharCode(r), 64 != o && (a += String.fromCharCode(i)), 64 != u && (a += String.fromCharCode(s)), r = i = s = 0, A = o = u = 0
                                                    } while (c < t.length);
                                                    return decodeURI(a)
                                                }, e.timeIntervalSince1970 = function() {
                                                    var e = new Date;
                                                    return Math.round(e.getTime() / 1e3)
                                                }, e.createGuid = function() {
                                                    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (function(e) {
                                                        return (+e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +e / 4).toString(16)
                                                    }))
                                                }, e.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e
                                            }(), t.GAUtilities = r
                                        }(o || (o = {})),
                                        function(e) {
                                            ! function(t) {
                                                var n = e.logging.GALogger,
                                                    r = e.utilities.GAUtilities,
                                                    i = e.events.EGASdkErrorCategory,
                                                    A = e.events.EGASdkErrorArea,
                                                    o = e.events.EGASdkErrorAction,
                                                    a = e.events.EGASdkErrorParameter,
                                                    s = function(e, t, n, r, i) {
                                                        this.category = e, this.area = t, this.action = n, this.parameter = r, this.reason = i
                                                    };
                                                t.ValidationResult = s;
                                                var u = function() {
                                                    function t() {}
                                                    return t.validateBusinessEvent = function(e, r, u, c, l) {
                                                        return t.validateCurrency(e) ? r < 0 ? (n.w("Validation fail - business event - amount. Cannot be less than 0. Failed amount: " + r), new s(i.EventValidation, A.BusinessEvent, o.InvalidAmount, a.Amount, r + "")) : t.validateShortString(u, !0) ? t.validateEventPartLength(c, !1) ? t.validateEventPartCharacters(c) ? t.validateEventPartLength(l, !1) ? t.validateEventPartCharacters(l) ? null : (n.w("Validation fail - business event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + l), new s(i.EventValidation, A.BusinessEvent, o.InvalidEventPartCharacters, a.ItemId, l)) : (n.w("Validation fail - business event - itemId. Cannot be (null), empty or above 64 characters. String: " + l), new s(i.EventValidation, A.BusinessEvent, o.InvalidEventPartLength, a.ItemId, l)) : (n.w("Validation fail - business event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + c), new s(i.EventValidation, A.BusinessEvent, o.InvalidEventPartCharacters, a.ItemType, c)) : (n.w("Validation fail - business event - itemType: Cannot be (null), empty or above 64 characters. String: " + c), new s(i.EventValidation, A.BusinessEvent, o.InvalidEventPartLength, a.ItemType, c)) : (n.w("Validation fail - business event - cartType. Cannot be above 32 length. String: " + u), new s(i.EventValidation, A.BusinessEvent, o.InvalidShortString, a.CartType, u)) : (n.w("Validation fail - business event - currency: Cannot be (null) and need to be A-Z, 3 characters and in the standard at openexchangerates.org. Failed currency: " + e), new s(i.EventValidation, A.BusinessEvent, o.InvalidCurrency, a.Currency, e))
                                                    }, t.validateResourceEvent = function(u, c, l, d, f, g, I) {
                                                        return u == e.EGAResourceFlowType.Undefined ? (n.w("Validation fail - resource event - flowType: Invalid flow type."), new s(i.EventValidation, A.ResourceEvent, o.InvalidFlowType, a.FlowType, "")) : c ? r.stringArrayContainsString(g, c) ? l > 0 ? d ? t.validateEventPartLength(d, !1) ? t.validateEventPartCharacters(d) ? r.stringArrayContainsString(I, d) ? t.validateEventPartLength(f, !1) ? t.validateEventPartCharacters(f) ? null : (n.w("Validation fail - resource event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + f), new s(i.EventValidation, A.ResourceEvent, o.InvalidEventPartCharacters, a.ItemId, f)) : (n.w("Validation fail - resource event - itemId: Cannot be (null), empty or above 64 characters. String: " + f), new s(i.EventValidation, A.ResourceEvent, o.InvalidEventPartLength, a.ItemId, f)) : (n.w("Validation fail - resource event - itemType: Not found in list of pre-defined available resource itemTypes. String: " + d), new s(i.EventValidation, A.ResourceEvent, o.NotFoundInAvailableItemTypes, a.ItemType, d)) : (n.w("Validation fail - resource event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + d), new s(i.EventValidation, A.ResourceEvent, o.InvalidEventPartCharacters, a.ItemType, d)) : (n.w("Validation fail - resource event - itemType: Cannot be (null), empty or above 64 characters. String: " + d), new s(i.EventValidation, A.ResourceEvent, o.InvalidEventPartLength, a.ItemType, d)) : (n.w("Validation fail - resource event - itemType: Cannot be (null)"), new s(i.EventValidation, A.ResourceEvent, o.StringEmptyOrNull, a.ItemType, "")) : (n.w("Validation fail - resource event - amount: Float amount cannot be 0 or negative. Value: " + l), new s(i.EventValidation, A.ResourceEvent, o.InvalidAmount, a.Amount, l + "")) : (n.w("Validation fail - resource event - currency: Not found in list of pre-defined available resource currencies. String: " + c), new s(i.EventValidation, A.ResourceEvent, o.NotFoundInAvailableCurrencies, a.Currency, c)) : (n.w("Validation fail - resource event - currency: Cannot be (null)"), new s(i.EventValidation, A.ResourceEvent, o.StringEmptyOrNull, a.Currency, ""))
                                                    }, t.validateProgressionEvent = function(r, u, c, l) {
                                                        if (r == e.EGAProgressionStatus.Undefined) return n.w("Validation fail - progression event: Invalid progression status."), new s(i.EventValidation, A.ProgressionEvent, o.InvalidProgressionStatus, a.ProgressionStatus, "");
                                                        if (l && !c && u) return n.w("Validation fail - progression event: 03 found but 01+02 are invalid. Progression must be set as either 01, 01+02 or 01+02+03."), new s(i.EventValidation, A.ProgressionEvent, o.WrongProgressionOrder, a.Undefined, u + ":" + c + ":" + l);
                                                        if (c && !u) return n.w("Validation fail - progression event: 02 found but not 01. Progression must be set as either 01, 01+02 or 01+02+03"), new s(i.EventValidation, A.ProgressionEvent, o.WrongProgressionOrder, a.Undefined, u + ":" + c + ":" + l);
                                                        if (!u) return n.w("Validation fail - progression event: progression01 not valid. Progressions must be set as either 01, 01+02 or 01+02+03"), new s(i.EventValidation, A.ProgressionEvent, o.WrongProgressionOrder, a.Undefined, (u || "") + ":" + (c || "") + ":" + (l || ""));
                                                        if (!t.validateEventPartLength(u, !1)) return n.w("Validation fail - progression event - progression01: Cannot be (null), empty or above 64 characters. String: " + u), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartLength, a.Progression01, u);
                                                        if (!t.validateEventPartCharacters(u)) return n.w("Validation fail - progression event - progression01: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + u), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartCharacters, a.Progression01, u);
                                                        if (c) {
                                                            if (!t.validateEventPartLength(c, !0)) return n.w("Validation fail - progression event - progression02: Cannot be empty or above 64 characters. String: " + c), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartLength, a.Progression02, c);
                                                            if (!t.validateEventPartCharacters(c)) return n.w("Validation fail - progression event - progression02: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + c), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartCharacters, a.Progression02, c)
                                                        }
                                                        if (l) {
                                                            if (!t.validateEventPartLength(l, !0)) return n.w("Validation fail - progression event - progression03: Cannot be empty or above 64 characters. String: " + l), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartLength, a.Progression03, l);
                                                            if (!t.validateEventPartCharacters(l)) return n.w("Validation fail - progression event - progression03: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + l), new s(i.EventValidation, A.ProgressionEvent, o.InvalidEventPartCharacters, a.Progression03, l)
                                                        }
                                                        return null
                                                    }, t.validateDesignEvent = function(e) {
                                                        return t.validateEventIdLength(e) ? t.validateEventIdCharacters(e) ? null : (n.w("Validation fail - design event - eventId: Non valid characters. Only allowed A-z, 0-9, -_., ()!?. String: " + e), new s(i.EventValidation, A.DesignEvent, o.InvalidEventIdCharacters, a.EventId, e)) : (n.w("Validation fail - design event - eventId: Cannot be (null) or empty. Only 5 event parts allowed seperated by :. Each part need to be 64 characters or less. String: " + e), new s(i.EventValidation, A.DesignEvent, o.InvalidEventIdLength, a.EventId, e))
                                                    }, t.validateErrorEvent = function(r, u) {
                                                        return r == e.EGAErrorSeverity.Undefined ? (n.w("Validation fail - error event - severity: Severity was unsupported value."), new s(i.EventValidation, A.ErrorEvent, o.InvalidSeverity, a.Severity, "")) : t.validateLongString(u, !0) ? null : (n.w("Validation fail - error event - message: Message cannot be above 8192 characters."), new s(i.EventValidation, A.ErrorEvent, o.InvalidLongString, a.Message, u))
                                                    }, t.validateAdEvent = function(r, u, c, l) {
                                                        return r == e.EGAAdAction.Undefined ? (n.w("Validation fail - error event - severity: Severity was unsupported value."), new s(i.EventValidation, A.AdEvent, o.InvalidAdAction, a.AdAction, "")) : u == e.EGAAdType.Undefined ? (n.w("Validation fail - ad event - adType: Ad type was unsupported value."), new s(i.EventValidation, A.AdEvent, o.InvalidAdType, a.AdType, "")) : t.validateShortString(c, !1) ? t.validateString(l, !1) ? null : (n.w("Validation fail - ad event - message: Ad placement cannot be above 64 characters."), new s(i.EventValidation, A.AdEvent, o.InvalidString, a.AdPlacement, l)) : (n.w("Validation fail - ad event - message: Ad SDK name cannot be above 32 characters."), new s(i.EventValidation, A.AdEvent, o.InvalidShortString, a.AdSdkName, c))
                                                    }, t.validateSdkErrorEvent = function(e, r, a, s, u) {
                                                        return !(!t.validateKeys(e, r) || (a === i.Undefined ? (n.w("Validation fail - sdk error event - type: Category was unsupported value."), 1) : s === A.Undefined ? (n.w("Validation fail - sdk error event - type: Area was unsupported value."), 1) : u === o.Undefined && (n.w("Validation fail - sdk error event - type: Action was unsupported value."), 1)))
                                                    }, t.validateKeys = function(e, t) {
                                                        return !(!r.stringMatch(e, /^[A-z0-9]{32}$/) || !r.stringMatch(t, /^[A-z0-9]{40}$/))
                                                    }, t.validateCurrency = function(e) {
                                                        return !!e && !!r.stringMatch(e, /^[A-Z]{3}$/)
                                                    }, t.validateEventPartLength = function(e, t) {
                                                        return !(!t || e) || !!e && !(e.length > 64)
                                                    }, t.validateEventPartCharacters = function(e) {
                                                        return !!r.stringMatch(e, /^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}$/)
                                                    }, t.validateEventIdLength = function(e) {
                                                        return !!e && !!r.stringMatch(e, /^[^:]{1,64}(?::[^:]{1,64}){0,4}$/)
                                                    }, t.validateEventIdCharacters = function(e) {
                                                        return !!e && !!r.stringMatch(e, /^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}(:[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}){0,4}$/)
                                                    }, t.validateAndCleanInitRequestResponse = function(e, t) {
                                                        if (null == e) return n.w("validateInitRequestResponse failed - no response dictionary."), null;
                                                        var r = {};
                                                        try {
                                                            var i = e.server_ts;
                                                            if (!(i > 0)) return n.w("validateInitRequestResponse failed - invalid value in 'server_ts' field."), null;
                                                            r.server_ts = i
                                                        } catch (t) {
                                                            return n.w("validateInitRequestResponse failed - invalid type in 'server_ts' field. type=" + typeof e.server_ts + ", value=" + e.server_ts + ", " + t), null
                                                        }
                                                        if (t) {
                                                            try {
                                                                var A = e.configs;
                                                                r.configs = A
                                                            } catch (t) {
                                                                return n.w("validateInitRequestResponse failed - invalid type in 'configs' field. type=" + typeof e.configs + ", value=" + e.configs + ", " + t), null
                                                            }
                                                            try {
                                                                var o = e.configs_hash;
                                                                r.configs_hash = o
                                                            } catch (t) {
                                                                return n.w("validateInitRequestResponse failed - invalid type in 'configs_hash' field. type=" + typeof e.configs_hash + ", value=" + e.configs_hash + ", " + t), null
                                                            }
                                                            try {
                                                                var a = e.ab_id;
                                                                r.ab_id = a
                                                            } catch (t) {
                                                                return n.w("validateInitRequestResponse failed - invalid type in 'ab_id' field. type=" + typeof e.ab_id + ", value=" + e.ab_id + ", " + t), null
                                                            }
                                                            try {
                                                                var s = e.ab_variant_id;
                                                                r.ab_variant_id = s
                                                            } catch (t) {
                                                                return n.w("validateInitRequestResponse failed - invalid type in 'ab_variant_id' field. type=" + typeof e.ab_variant_id + ", value=" + e.ab_variant_id + ", " + t), null
                                                            }
                                                        }
                                                        return r
                                                    }, t.validateBuild = function(e) {
                                                        return !!t.validateShortString(e, !1)
                                                    }, t.validateSdkWrapperVersion = function(e) {
                                                        return !!r.stringMatch(e, /^(unity|unreal|gamemaker|cocos2d|construct|defold|godot|flutter) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/)
                                                    }, t.validateEngineVersion = function(e) {
                                                        return !(!e || !r.stringMatch(e, /^(unity|unreal|gamemaker|cocos2d|construct|defold|godot) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/))
                                                    }, t.validateUserId = function(e) {
                                                        return !!t.validateString(e, !1) || (n.w("Validation fail - user id: id cannot be (null), empty or above 64 characters."), !1)
                                                    }, t.validateShortString = function(e, t) {
                                                        return !(!t || e) || !(!e || e.length > 32)
                                                    }, t.validateString = function(e, t) {
                                                        return !(!t || e) || !(!e || e.length > 64)
                                                    }, t.validateLongString = function(e, t) {
                                                        return !(!t || e) || !(!e || e.length > 8192)
                                                    }, t.validateConnectionType = function(e) {
                                                        return r.stringMatch(e, /^(wwan|wifi|lan|offline)$/)
                                                    }, t.validateCustomDimensions = function(e) {
                                                        return t.validateArrayOfStrings(20, 32, !1, "custom dimensions", e)
                                                    }, t.validateResourceCurrencies = function(e) {
                                                        if (!t.validateArrayOfStrings(20, 64, !1, "resource currencies", e)) return !1;
                                                        for (var i = 0; i < e.length; ++i)
                                                            if (!r.stringMatch(e[i], /^[A-Za-z]+$/)) return n.w("resource currencies validation failed: a resource currency can only be A-Z, a-z. String was: " + e[i]), !1;
                                                        return !0
                                                    }, t.validateResourceItemTypes = function(e) {
                                                        if (!t.validateArrayOfStrings(20, 32, !1, "resource item types", e)) return !1;
                                                        for (var r = 0; r < e.length; ++r)
                                                            if (!t.validateEventPartCharacters(e[r])) return n.w("resource item types validation failed: a resource item type cannot contain other characters than A-z, 0-9, -_., ()!?. String was: " + e[r]), !1;
                                                        return !0
                                                    }, t.validateDimension01 = function(e, t) {
                                                        return !e || !!r.stringArrayContainsString(t, e)
                                                    }, t.validateDimension02 = function(e, t) {
                                                        return !e || !!r.stringArrayContainsString(t, e)
                                                    }, t.validateDimension03 = function(e, t) {
                                                        return !e || !!r.stringArrayContainsString(t, e)
                                                    }, t.validateArrayOfStrings = function(e, t, r, i, A) {
                                                        var o = i;
                                                        if (o || (o = "Array"), !A) return n.w(o + " validation failed: array cannot be null. "), !1;
                                                        if (0 == r && 0 == A.length) return n.w(o + " validation failed: array cannot be empty. "), !1;
                                                        if (e > 0 && A.length > e) return n.w(o + " validation failed: array cannot exceed " + e + " values. It has " + A.length + " values."), !1;
                                                        for (var a = 0; a < A.length; ++a) {
                                                            var s = A[a] ? A[a].length : 0;
                                                            if (0 === s) return n.w(o + " validation failed: contained an empty string. Array=" + JSON.stringify(A)), !1;
                                                            if (t > 0 && s > t) return n.w(o + " validation failed: a string exceeded max allowed length (which is: " + t + "). String was: " + A[a]), !1
                                                        }
                                                        return !0
                                                    }, t.validateClientTs = function(e) {
                                                        return !(e < 0 || e > 99999999999)
                                                    }, t
                                                }();
                                                t.GAValidator = u
                                            }(e.validators || (e.validators = {}))
                                        }(o || (o = {})),
                                        function(e) {
                                            ! function(e) {
                                                var t = function(e, t, n) {
                                                    this.name = e, this.value = t, this.version = n
                                                };
                                                e.NameValueVersion = t;
                                                var n = function(e, t) {
                                                    this.name = e, this.version = t
                                                };
                                                e.NameVersion = n;
                                                var r = function() {
                                                    function e() {}
                                                    return e.touch = function() {}, e.getRelevantSdkVersion = function() {
                                                        return e.sdkGameEngineVersion ? e.sdkGameEngineVersion : e.sdkWrapperVersion
                                                    }, e.getConnectionType = function() {
                                                        return e.connectionType
                                                    }, e.updateConnectionType = function() {
                                                        navigator.onLine ? "ios" === e.buildPlatform || "android" === e.buildPlatform ? e.connectionType = "wwan" : e.connectionType = "lan" : e.connectionType = "offline"
                                                    }, e.getOSVersionString = function() {
                                                        return e.buildPlatform + " " + e.osVersionPair.version
                                                    }, e.runtimePlatformToString = function() {
                                                        return e.osVersionPair.name
                                                    }, e.getBrowserVersionString = function() {
                                                        var t, n = navigator.userAgent,
                                                            r = n.match(/(opera|chrome|safari|firefox|ubrowser|msie|trident|fbav(?=\/))\/?\s*(\d+)/i) || [];
                                                        if (0 == r.length && "ios" === e.buildPlatform) return "webkit_" + e.osVersion;
                                                        if (/trident/i.test(r[1])) return "IE " + ((t = /\brv[ :]+(\d+)/g.exec(n) || [])[1] || "");
                                                        if ("Chrome" === r[1] && null != (t = n.match(/\b(OPR|Edge|UBrowser)\/(\d+)/))) return t.slice(1).join(" ").replace("OPR", "Opera").replace("UBrowser", "UC").toLowerCase();
                                                        if (r[1] && "fbav" === r[1].toLowerCase() && (r[1] = "facebook", r[2])) return "facebook " + r[2];
                                                        var i = r[2] ? [r[1], r[2]] : [navigator.appName, navigator.appVersion, "-?"];
                                                        return null != (t = n.match(/version\/(\d+)/i)) && i.splice(1, 1, t[1]), i.join(" ").toLowerCase()
                                                    }, e.getDeviceModel = function() {
                                                        return "unknown"
                                                    }, e.getDeviceManufacturer = function() {
                                                        return "unknown"
                                                    }, e.matchItem = function(e, t) {
                                                        var r, i, A, o, a = new n("unknown", "0.0.0"),
                                                            s = 0,
                                                            u = 0;
                                                        for (s = 0; s < t.length; s += 1)
                                                            if (new RegExp(t[s].value, "i").test(e)) {
                                                                if (r = new RegExp(t[s].version + "[- /:;]([\\d._]+)", "i"), o = "", (i = e.match(r)) && i[1] && (A = i[1]), A) {
                                                                    var c = A.split(/[._]+/);
                                                                    for (u = 0; u < Math.min(c.length, 3); u += 1) o += c[u] + (u < Math.min(c.length, 3) - 1 ? "." : "")
                                                                } else o = "0.0.0";
                                                                return a.name = t[s].name, a.version = o, a
                                                            }
                                                        return a
                                                    }, e.sdkWrapperVersion = "javascript 4.4.5", e.osVersionPair = e.matchItem([navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor].join(" "), [new t("windows_phone", "Windows Phone", "OS"), new t("windows", "Win", "NT"), new t("ios", "iPhone", "OS"), new t("ios", "iPad", "OS"), new t("ios", "iPod", "OS"), new t("android", "Android", "Android"), new t("blackBerry", "BlackBerry", "/"), new t("mac_osx", "Mac", "OS X"), new t("tizen", "Tizen", "Tizen"), new t("linux", "Linux", "rv"), new t("kai_os", "KAIOS", "KAIOS")]), e.buildPlatform = e.runtimePlatformToString(), e.deviceModel = e.getDeviceModel(), e.deviceManufacturer = e.getDeviceManufacturer(), e.osVersion = e.getOSVersionString(), e.browserVersion = e.getBrowserVersionString(), e
                                                }();
                                                e.GADevice = r
                                            }(e.device || (e.device = {}))
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n;
                                            t = e.threading || (e.threading = {}), n = function() {
                                                function e(t) {
                                                    this.deadline = t, this.ignore = !1, this.async = !1, this.running = !1, this.id = ++e.idCounter
                                                }
                                                return e.idCounter = 0, e
                                            }(), t.TimedBlock = n
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n;
                                            t = e.threading || (e.threading = {}), n = function() {
                                                function e(e) {
                                                    this.comparer = e, this._subQueues = {}, this._sortedKeys = []
                                                }
                                                return e.prototype.enqueue = function(e, t) {
                                                    -1 === this._sortedKeys.indexOf(e) && this.addQueueOfPriority(e), this._subQueues[e].push(t)
                                                }, e.prototype.addQueueOfPriority = function(e) {
                                                    var t = this;
                                                    this._sortedKeys.push(e), this._sortedKeys.sort((function(e, n) {
                                                        return t.comparer.compare(e, n)
                                                    })), this._subQueues[e] = []
                                                }, e.prototype.peek = function() {
                                                    if (this.hasItems()) return this._subQueues[this._sortedKeys[0]][0];
                                                    throw new Error("The queue is empty")
                                                }, e.prototype.hasItems = function() {
                                                    return this._sortedKeys.length > 0
                                                }, e.prototype.dequeue = function() {
                                                    if (this.hasItems()) return this.dequeueFromHighPriorityQueue();
                                                    throw new Error("The queue is empty")
                                                }, e.prototype.dequeueFromHighPriorityQueue = function() {
                                                    var e = this._sortedKeys[0],
                                                        t = this._subQueues[e].shift();
                                                    return 0 === this._subQueues[e].length && (this._sortedKeys.shift(), delete this._subQueues[e]), t
                                                }, e
                                            }(), t.PriorityQueue = n
                                        }(o || (o = {})),
                                        function(e) {
                                            ! function(t) {
                                                var n, r, i = e.logging.GALogger;
                                                ! function(e) {
                                                    e[e.Equal = 0] = "Equal", e[e.LessOrEqual = 1] = "LessOrEqual", e[e.NotEqual = 2] = "NotEqual"
                                                }(n = t.EGAStoreArgsOperator || (t.EGAStoreArgsOperator = {})),
                                                function(e) {
                                                    e[e.Events = 0] = "Events", e[e.Sessions = 1] = "Sessions", e[e.Progression = 2] = "Progression"
                                                }(r = t.EGAStore || (t.EGAStore = {}));
                                                var A = function() {
                                                    function e() {
                                                        this.eventsStore = [], this.sessionsStore = [], this.progressionStore = [], this.storeItems = {};
                                                        try {
                                                            "object" == typeof localStorage ? (localStorage.setItem("testingLocalStorage", "yes"), localStorage.removeItem("testingLocalStorage"), e.storageAvailable = !0) : e.storageAvailable = !1
                                                        } catch (e) {}
                                                    }
                                                    return e.isStorageAvailable = function() {
                                                        return e.storageAvailable
                                                    }, e.isStoreTooLargeForEvents = function() {
                                                        return e.instance.eventsStore.length + e.instance.sessionsStore.length > e.MaxNumberOfEntries
                                                    }, e.select = function(t, r, i, A) {
                                                        void 0 === r && (r = []), void 0 === i && (i = !1), void 0 === A && (A = 0);
                                                        var o = e.getStore(t);
                                                        if (!o) return null;
                                                        for (var a = [], s = 0; s < o.length; ++s) {
                                                            for (var u = o[s], c = !0, l = 0; l < r.length; ++l) {
                                                                var d = r[l];
                                                                if (u[d[0]]) switch (d[1]) {
                                                                    case n.Equal:
                                                                        c = u[d[0]] == d[2];
                                                                        break;
                                                                    case n.LessOrEqual:
                                                                        c = u[d[0]] <= d[2];
                                                                        break;
                                                                    case n.NotEqual:
                                                                        c = u[d[0]] != d[2];
                                                                        break;
                                                                    default:
                                                                        c = !1
                                                                } else c = !1;
                                                                if (!c) break
                                                            }
                                                            c && a.push(u)
                                                        }
                                                        return i && a.sort((function(e, t) {
                                                            return e.client_ts - t.client_ts
                                                        })), A > 0 && a.length > A && (a = a.slice(0, A + 1)), a
                                                    }, e.update = function(t, r, i) {
                                                        void 0 === i && (i = []);
                                                        var A = e.getStore(t);
                                                        if (!A) return !1;
                                                        for (var o = 0; o < A.length; ++o) {
                                                            for (var a = A[o], s = !0, u = 0; u < i.length; ++u) {
                                                                var c = i[u];
                                                                if (a[c[0]]) switch (c[1]) {
                                                                    case n.Equal:
                                                                        s = a[c[0]] == c[2];
                                                                        break;
                                                                    case n.LessOrEqual:
                                                                        s = a[c[0]] <= c[2];
                                                                        break;
                                                                    case n.NotEqual:
                                                                        s = a[c[0]] != c[2];
                                                                        break;
                                                                    default:
                                                                        s = !1
                                                                } else s = !1;
                                                                if (!s) break
                                                            }
                                                            if (s)
                                                                for (u = 0; u < r.length; ++u) {
                                                                    var l = r[u];
                                                                    a[l[0]] = l[1]
                                                                }
                                                        }
                                                        return !0
                                                    }, e.delete = function(t, r) {
                                                        var i = e.getStore(t);
                                                        if (i)
                                                            for (var A = 0; A < i.length; ++A) {
                                                                for (var o = i[A], a = !0, s = 0; s < r.length; ++s) {
                                                                    var u = r[s];
                                                                    if (o[u[0]]) switch (u[1]) {
                                                                        case n.Equal:
                                                                            a = o[u[0]] == u[2];
                                                                            break;
                                                                        case n.LessOrEqual:
                                                                            a = o[u[0]] <= u[2];
                                                                            break;
                                                                        case n.NotEqual:
                                                                            a = o[u[0]] != u[2];
                                                                            break;
                                                                        default:
                                                                            a = !1
                                                                    } else a = !1;
                                                                    if (!a) break
                                                                }
                                                                a && (i.splice(A, 1), --A)
                                                            }
                                                    }, e.insert = function(t, n, r, i) {
                                                        void 0 === r && (r = !1), void 0 === i && (i = null);
                                                        var A = e.getStore(t);
                                                        if (A)
                                                            if (r) {
                                                                if (!i) return;
                                                                for (var o = !1, a = 0; a < A.length; ++a) {
                                                                    var s = A[a];
                                                                    if (s[i] == n[i]) {
                                                                        for (var u in n) s[u] = n[u];
                                                                        o = !0;
                                                                        break
                                                                    }
                                                                }
                                                                o || A.push(n)
                                                            } else A.push(n)
                                                    }, e.save = function(t) {
                                                        e.isStorageAvailable() ? (localStorage.setItem(e.StringFormat(e.KeyFormat, t, e.EventsStoreKey), JSON.stringify(e.instance.eventsStore)), localStorage.setItem(e.StringFormat(e.KeyFormat, t, e.SessionsStoreKey), JSON.stringify(e.instance.sessionsStore)), localStorage.setItem(e.StringFormat(e.KeyFormat, t, e.ProgressionStoreKey), JSON.stringify(e.instance.progressionStore)), localStorage.setItem(e.StringFormat(e.KeyFormat, t, e.ItemsStoreKey), JSON.stringify(e.instance.storeItems))) : i.w("Storage is not available, cannot save.")
                                                    }, e.load = function(t) {
                                                        if (e.isStorageAvailable()) {
                                                            try {
                                                                e.instance.eventsStore = JSON.parse(localStorage.getItem(e.StringFormat(e.KeyFormat, t, e.EventsStoreKey))), e.instance.eventsStore || (e.instance.eventsStore = [])
                                                            } catch (t) {
                                                                i.w("Load failed for 'events' store. Using empty store."), e.instance.eventsStore = []
                                                            }
                                                            try {
                                                                e.instance.sessionsStore = JSON.parse(localStorage.getItem(e.StringFormat(e.KeyFormat, t, e.SessionsStoreKey))), e.instance.sessionsStore || (e.instance.sessionsStore = [])
                                                            } catch (t) {
                                                                i.w("Load failed for 'sessions' store. Using empty store."), e.instance.sessionsStore = []
                                                            }
                                                            try {
                                                                e.instance.progressionStore = JSON.parse(localStorage.getItem(e.StringFormat(e.KeyFormat, t, e.ProgressionStoreKey))), e.instance.progressionStore || (e.instance.progressionStore = [])
                                                            } catch (t) {
                                                                i.w("Load failed for 'progression' store. Using empty store."), e.instance.progressionStore = []
                                                            }
                                                            try {
                                                                e.instance.storeItems = JSON.parse(localStorage.getItem(e.StringFormat(e.KeyFormat, t, e.ItemsStoreKey))), e.instance.storeItems || (e.instance.storeItems = {})
                                                            } catch (t) {
                                                                i.w("Load failed for 'items' store. Using empty store."), e.instance.progressionStore = []
                                                            }
                                                        } else i.w("Storage is not available, cannot load.")
                                                    }, e.setItem = function(t, n, r) {
                                                        var i = e.StringFormat(e.KeyFormat, t, n);
                                                        r ? e.instance.storeItems[i] = r : i in e.instance.storeItems && delete e.instance.storeItems[i]
                                                    }, e.getItem = function(t, n) {
                                                        var r = e.StringFormat(e.KeyFormat, t, n);
                                                        return r in e.instance.storeItems ? e.instance.storeItems[r] : null
                                                    }, e.getStore = function(t) {
                                                        switch (t) {
                                                            case r.Events:
                                                                return e.instance.eventsStore;
                                                            case r.Sessions:
                                                                return e.instance.sessionsStore;
                                                            case r.Progression:
                                                                return e.instance.progressionStore;
                                                            default:
                                                                return i.w("GAStore.getStore(): Cannot find store: " + t), null
                                                        }
                                                    }, e.instance = new e, e.MaxNumberOfEntries = 2e3, e.StringFormat = function(e) {
                                                        for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
                                                        return e.replace(/{(\d+)}/g, (function(e, n) {
                                                            return t[n] || ""
                                                        }))
                                                    }, e.KeyFormat = "GA::{0}::{1}", e.EventsStoreKey = "ga_event", e.SessionsStoreKey = "ga_session", e.ProgressionStoreKey = "ga_progression", e.ItemsStoreKey = "ga_items", e
                                                }();
                                                t.GAStore = A
                                            }(e.store || (e.store = {}))
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i, A, o, a, s, u;
                                            t = e.state || (e.state = {}), n = e.validators.GAValidator, r = e.utilities.GAUtilities, i = e.logging.GALogger, A = e.store.GAStore, o = e.device.GADevice, a = e.store.EGAStore, s = e.store.EGAStoreArgsOperator, u = function() {
                                                function e() {
                                                    this.availableCustomDimensions01 = [], this.availableCustomDimensions02 = [], this.availableCustomDimensions03 = [], this.currentGlobalCustomEventFields = {}, this.availableResourceCurrencies = [], this.availableResourceItemTypes = [], this.configurations = {}, this.remoteConfigsListeners = [], this.beforeUnloadListeners = [], this.sdkConfigDefault = {}, this.sdkConfig = {}, this.progressionTries = {}, this._isEventSubmissionEnabled = !0, this.isUnloading = !1
                                                }
                                                return e.setUserId = function(t) {
                                                    e.instance.userId = t, e.cacheIdentifier()
                                                }, e.getIdentifier = function() {
                                                    return e.instance.identifier
                                                }, e.isInitialized = function() {
                                                    return e.instance.initialized
                                                }, e.setInitialized = function(t) {
                                                    e.instance.initialized = t
                                                }, e.getSessionStart = function() {
                                                    return e.instance.sessionStart
                                                }, e.getSessionNum = function() {
                                                    return e.instance.sessionNum
                                                }, e.getTransactionNum = function() {
                                                    return e.instance.transactionNum
                                                }, e.getSessionId = function() {
                                                    return e.instance.sessionId
                                                }, e.getCurrentCustomDimension01 = function() {
                                                    return e.instance.currentCustomDimension01
                                                }, e.getCurrentCustomDimension02 = function() {
                                                    return e.instance.currentCustomDimension02
                                                }, e.getCurrentCustomDimension03 = function() {
                                                    return e.instance.currentCustomDimension03
                                                }, e.getGameKey = function() {
                                                    return e.instance.gameKey
                                                }, e.getGameSecret = function() {
                                                    return e.instance.gameSecret
                                                }, e.getAvailableCustomDimensions01 = function() {
                                                    return e.instance.availableCustomDimensions01
                                                }, e.setAvailableCustomDimensions01 = function(t) {
                                                    n.validateCustomDimensions(t) && (e.instance.availableCustomDimensions01 = t, e.validateAndFixCurrentDimensions(), i.i("Set available custom01 dimension values: (" + r.joinStringArray(t, ", ") + ")"))
                                                }, e.getAvailableCustomDimensions02 = function() {
                                                    return e.instance.availableCustomDimensions02
                                                }, e.setAvailableCustomDimensions02 = function(t) {
                                                    n.validateCustomDimensions(t) && (e.instance.availableCustomDimensions02 = t, e.validateAndFixCurrentDimensions(), i.i("Set available custom02 dimension values: (" + r.joinStringArray(t, ", ") + ")"))
                                                }, e.getAvailableCustomDimensions03 = function() {
                                                    return e.instance.availableCustomDimensions03
                                                }, e.setAvailableCustomDimensions03 = function(t) {
                                                    n.validateCustomDimensions(t) && (e.instance.availableCustomDimensions03 = t, e.validateAndFixCurrentDimensions(), i.i("Set available custom03 dimension values: (" + r.joinStringArray(t, ", ") + ")"))
                                                }, e.getAvailableResourceCurrencies = function() {
                                                    return e.instance.availableResourceCurrencies
                                                }, e.setAvailableResourceCurrencies = function(t) {
                                                    n.validateResourceCurrencies(t) && (e.instance.availableResourceCurrencies = t, i.i("Set available resource currencies: (" + r.joinStringArray(t, ", ") + ")"))
                                                }, e.getAvailableResourceItemTypes = function() {
                                                    return e.instance.availableResourceItemTypes
                                                }, e.setAvailableResourceItemTypes = function(t) {
                                                    n.validateResourceItemTypes(t) && (e.instance.availableResourceItemTypes = t, i.i("Set available resource item types: (" + r.joinStringArray(t, ", ") + ")"))
                                                }, e.getBuild = function() {
                                                    return e.instance.build
                                                }, e.setBuild = function(t) {
                                                    e.instance.build = t, i.i("Set build version: " + t)
                                                }, e.getUseManualSessionHandling = function() {
                                                    return e.instance.useManualSessionHandling
                                                }, e.isEventSubmissionEnabled = function() {
                                                    return e.instance._isEventSubmissionEnabled
                                                }, e.getABTestingId = function() {
                                                    return e.instance.abId
                                                }, e.getABTestingVariantId = function() {
                                                    return e.instance.abVariantId
                                                }, e.prototype.setDefaultId = function(t) {
                                                    this.defaultUserId = t || "", e.cacheIdentifier()
                                                }, e.getDefaultId = function() {
                                                    return e.instance.defaultUserId
                                                }, e.getSdkConfig = function() {
                                                    var t, n = 0;
                                                    for (var r in e.instance.sdkConfig) 0 === n && (t = r), ++n;
                                                    if (t && n > 0) return e.instance.sdkConfig;
                                                    for (var r in n = 0, e.instance.sdkConfigCached) 0 === n && (t = r), ++n;
                                                    return t && n > 0 ? e.instance.sdkConfigCached : e.instance.sdkConfigDefault
                                                }, e.isEnabled = function() {
                                                    return !!e.instance.initAuthorized
                                                }, e.setCustomDimension01 = function(t) {
                                                    e.instance.currentCustomDimension01 = t, A.setItem(e.getGameKey(), e.Dimension01Key, t), i.i("Set custom01 dimension value: " + t)
                                                }, e.setCustomDimension02 = function(t) {
                                                    e.instance.currentCustomDimension02 = t, A.setItem(e.getGameKey(), e.Dimension02Key, t), i.i("Set custom02 dimension value: " + t)
                                                }, e.setCustomDimension03 = function(t) {
                                                    e.instance.currentCustomDimension03 = t, A.setItem(e.getGameKey(), e.Dimension03Key, t), i.i("Set custom03 dimension value: " + t)
                                                }, e.incrementSessionNum = function() {
                                                    var t = e.getSessionNum() + 1;
                                                    e.instance.sessionNum = t
                                                }, e.incrementTransactionNum = function() {
                                                    var t = e.getTransactionNum() + 1;
                                                    e.instance.transactionNum = t
                                                }, e.incrementProgressionTries = function(t) {
                                                    var n = e.getProgressionTries(t) + 1;
                                                    e.instance.progressionTries[t] = n;
                                                    var r = {};
                                                    r.progression = t, r.tries = n, A.insert(a.Progression, r, !0, "progression")
                                                }, e.getProgressionTries = function(t) {
                                                    return t in e.instance.progressionTries ? e.instance.progressionTries[t] : 0
                                                }, e.clearProgressionTries = function(t) {
                                                    t in e.instance.progressionTries && delete e.instance.progressionTries[t];
                                                    var n = [];
                                                    n.push(["progression", s.Equal, t]), A.delete(a.Progression, n)
                                                }, e.setKeys = function(t, n) {
                                                    e.instance.gameKey = t, e.instance.gameSecret = n
                                                }, e.setManualSessionHandling = function(t) {
                                                    e.instance.useManualSessionHandling = t, i.i("Use manual session handling: " + t)
                                                }, e.setEnabledEventSubmission = function(t) {
                                                    e.instance._isEventSubmissionEnabled = t
                                                }, e.getEventAnnotations = function() {
                                                    var t = {
                                                        v: 2
                                                    };
                                                    t.event_uuid = r.createGuid(), t.user_id = e.instance.identifier, t.client_ts = e.getClientTsAdjusted(), t.sdk_version = o.getRelevantSdkVersion(), t.os_version = o.osVersion, t.manufacturer = o.deviceManufacturer, t.device = o.deviceModel, t.browser_version = o.browserVersion, t.platform = o.buildPlatform, t.session_id = e.instance.sessionId, t[e.SessionNumKey] = e.instance.sessionNum;
                                                    var i = o.getConnectionType();
                                                    if (n.validateConnectionType(i) && (t.connection_type = i), o.gameEngineVersion && (t.engine_version = o.gameEngineVersion), e.instance.configurations) {
                                                        var A = 0;
                                                        for (var a in e.instance.configurations) {
                                                            A++;
                                                            break
                                                        }
                                                        A > 0 && (t.configurations = e.instance.configurations)
                                                    }
                                                    return e.instance.abId && (t.ab_id = e.instance.abId), e.instance.abVariantId && (t.ab_variant_id = e.instance.abVariantId), e.instance.build && (t.build = e.instance.build), t
                                                }, e.getSdkErrorEventAnnotations = function() {
                                                    var t = {
                                                        v: 2
                                                    };
                                                    t.event_uuid = r.createGuid(), t.category = e.CategorySdkError, t.sdk_version = o.getRelevantSdkVersion(), t.os_version = o.osVersion, t.manufacturer = o.deviceManufacturer, t.device = o.deviceModel, t.platform = o.buildPlatform;
                                                    var i = o.getConnectionType();
                                                    return n.validateConnectionType(i) && (t.connection_type = i), o.gameEngineVersion && (t.engine_version = o.gameEngineVersion), t
                                                }, e.getInitAnnotations = function() {
                                                    var t = {};
                                                    return e.getIdentifier() || e.cacheIdentifier(), A.setItem(e.getGameKey(), e.LastUsedIdentifierKey, e.getIdentifier()), t.user_id = e.getIdentifier(), t.sdk_version = o.getRelevantSdkVersion(), t.os_version = o.osVersion, t.platform = o.buildPlatform, e.getBuild() ? t.build = e.getBuild() : t.build = null, t.session_num = e.getSessionNum(), t.random_salt = e.getSessionNum(), t
                                                }, e.getClientTsAdjusted = function() {
                                                    var t = r.timeIntervalSince1970(),
                                                        i = t + e.instance.clientServerTimeOffset;
                                                    return n.validateClientTs(i) ? i : t
                                                }, e.sessionIsStarted = function() {
                                                    return 0 != e.instance.sessionStart
                                                }, e.cacheIdentifier = function() {
                                                    e.instance.userId ? e.instance.identifier = e.instance.userId : e.instance.defaultUserId && (e.instance.identifier = e.instance.defaultUserId)
                                                }, e.ensurePersistedStates = function() {
                                                    A.isStorageAvailable() && A.load(e.getGameKey());
                                                    var t = e.instance;
                                                    t.setDefaultId(null != A.getItem(e.getGameKey(), e.DefaultUserIdKey) ? A.getItem(e.getGameKey(), e.DefaultUserIdKey) : r.createGuid()), t.sessionNum = null != A.getItem(e.getGameKey(), e.SessionNumKey) ? Number(A.getItem(e.getGameKey(), e.SessionNumKey)) : 0, t.transactionNum = null != A.getItem(e.getGameKey(), e.TransactionNumKey) ? Number(A.getItem(e.getGameKey(), e.TransactionNumKey)) : 0, t.currentCustomDimension01 ? A.setItem(e.getGameKey(), e.Dimension01Key, t.currentCustomDimension01) : (t.currentCustomDimension01 = null != A.getItem(e.getGameKey(), e.Dimension01Key) ? A.getItem(e.getGameKey(), e.Dimension01Key) : "", t.currentCustomDimension01), t.currentCustomDimension02 ? A.setItem(e.getGameKey(), e.Dimension02Key, t.currentCustomDimension02) : (t.currentCustomDimension02 = null != A.getItem(e.getGameKey(), e.Dimension02Key) ? A.getItem(e.getGameKey(), e.Dimension02Key) : "", t.currentCustomDimension02), t.currentCustomDimension03 ? A.setItem(e.getGameKey(), e.Dimension03Key, t.currentCustomDimension03) : (t.currentCustomDimension03 = null != A.getItem(e.getGameKey(), e.Dimension03Key) ? A.getItem(e.getGameKey(), e.Dimension03Key) : "", t.currentCustomDimension03);
                                                    var n = null != A.getItem(e.getGameKey(), e.SdkConfigCachedKey) ? A.getItem(e.getGameKey(), e.SdkConfigCachedKey) : "";
                                                    if (n) {
                                                        var o = JSON.parse(r.decode64(n));
                                                        if (o) {
                                                            var s = A.getItem(e.getGameKey(), e.LastUsedIdentifierKey);
                                                            null != s && s != e.getIdentifier() && (i.w("New identifier spotted compared to last one used, clearing cached configs hash!!"), o.configs_hash && delete o.configs_hash), t.sdkConfigCached = o
                                                        }
                                                    }
                                                    var u = e.getSdkConfig();
                                                    t.configsHash = u.configs_hash ? u.configs_hash : "", t.abId = u.ab_id ? u.ab_id : "", t.abVariantId = u.ab_variant_id ? u.ab_variant_id : "";
                                                    var c = A.select(a.Progression);
                                                    if (c)
                                                        for (var l = 0; l < c.length; ++l) {
                                                            var d = c[l];
                                                            d && (t.progressionTries[d.progression] = d.tries)
                                                        }
                                                }, e.calculateServerTimeOffset = function(e) {
                                                    return e - r.timeIntervalSince1970()
                                                }, e.formatString = function(e, t) {
                                                    for (var n = e, r = 0; r < t.length; r++) {
                                                        var i = new RegExp("\\{" + r + "\\}", "gi");
                                                        n = n.replace(i, arguments[r])
                                                    }
                                                    return n
                                                }, e.validateAndCleanCustomFields = function(t, n) {
                                                    void 0 === n && (n = null);
                                                    var A = {};
                                                    if (t) {
                                                        var o = 0;
                                                        for (var a in t) {
                                                            var s = t[a];
                                                            if (a && s)
                                                                if (o < e.MAX_CUSTOM_FIELDS_COUNT) {
                                                                    var u = new RegExp("^[a-zA-Z0-9_]{1," + e.MAX_CUSTOM_FIELDS_KEY_LENGTH + "}$");
                                                                    if (r.stringMatch(a, u)) {
                                                                        var c = typeof s;
                                                                        if ("string" === c || s instanceof String) {
                                                                            var l = s;
                                                                            l.length <= e.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH && l.length > 0 ? (A[a] = l, ++o) : (f = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its value is an empty string or exceeds the max number of characters (" + e.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH + ")", g = e.formatString(f, [a, s]), i.w(g), n && n(f, g))
                                                                        } else if ("number" === c || s instanceof Number) {
                                                                            var d = s;
                                                                            A[a] = d, ++o
                                                                        } else f = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its value is not a string or number", g = e.formatString(f, [a, s]), i.w(g), n && n(f, g)
                                                                    } else f = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its key contains illegal character, is empty or exceeds the max number of characters (" + e.MAX_CUSTOM_FIELDS_KEY_LENGTH + ")", g = e.formatString(f, [a, s]), i.w(g), n && n(f, g)
                                                                } else f = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because it exceeds the max number of custom fields (" + e.MAX_CUSTOM_FIELDS_COUNT + ")", g = e.formatString(f, [a, s]), i.w(g), n && n(f, g);
                                                            else {
                                                                var f = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its key or value is null",
                                                                    g = e.formatString(f, [a, s]);
                                                                i.w(g), n && n(f, g)
                                                            }
                                                        }
                                                    }
                                                    return A
                                                }, e.validateAndFixCurrentDimensions = function() {
                                                    n.validateDimension01(e.getCurrentCustomDimension01(), e.getAvailableCustomDimensions01()) || e.setCustomDimension01(""), n.validateDimension02(e.getCurrentCustomDimension02(), e.getAvailableCustomDimensions02()) || e.setCustomDimension02(""), n.validateDimension03(e.getCurrentCustomDimension03(), e.getAvailableCustomDimensions03()) || e.setCustomDimension03("")
                                                }, e.getConfigurationStringValue = function(t, n) {
                                                    return e.instance.configurations[t] ? e.instance.configurations[t].toString() : n
                                                }, e.isRemoteConfigsReady = function() {
                                                    return e.instance.remoteConfigsIsReady
                                                }, e.addRemoteConfigsListener = function(t) {
                                                    e.instance.remoteConfigsListeners.indexOf(t) < 0 && e.instance.remoteConfigsListeners.push(t)
                                                }, e.removeRemoteConfigsListener = function(t) {
                                                    var n = e.instance.remoteConfigsListeners.indexOf(t);
                                                    n > -1 && e.instance.remoteConfigsListeners.splice(n, 1)
                                                }, e.getRemoteConfigsContentAsString = function() {
                                                    return JSON.stringify(e.instance.configurations)
                                                }, e.populateConfigurations = function(t) {
                                                    var n = t.configs;
                                                    if (n) {
                                                        e.instance.configurations = {};
                                                        for (var r = 0; r < n.length; ++r) {
                                                            var i = n[r];
                                                            if (i) {
                                                                var A = i.key,
                                                                    o = i.value,
                                                                    a = i.start_ts ? i.start_ts : Number.MIN_VALUE,
                                                                    s = i.end_ts ? i.end_ts : Number.MAX_VALUE,
                                                                    u = e.getClientTsAdjusted();
                                                                A && o && u > a && u < s && (e.instance.configurations[A] = o)
                                                            }
                                                        }
                                                    }
                                                    e.instance.remoteConfigsIsReady = !0;
                                                    var c = e.instance.remoteConfigsListeners;
                                                    for (r = 0; r < c.length; ++r) c[r] && c[r].onRemoteConfigsUpdated()
                                                }, e.addOnBeforeUnloadListener = function(t) {
                                                    e.instance.beforeUnloadListeners.indexOf(t) < 0 && e.instance.beforeUnloadListeners.push(t)
                                                }, e.removeOnBeforeUnloadListener = function(t) {
                                                    var n = e.instance.beforeUnloadListeners.indexOf(t);
                                                    n > -1 && e.instance.beforeUnloadListeners.splice(n, 1)
                                                }, e.notifyBeforeUnloadListeners = function() {
                                                    for (var t = e.instance.beforeUnloadListeners, n = 0; n < t.length; ++n) t[n] && t[n].onBeforeUnload()
                                                }, e.CategorySdkError = "sdk_error", e.MAX_CUSTOM_FIELDS_COUNT = 50, e.MAX_CUSTOM_FIELDS_KEY_LENGTH = 64, e.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH = 256, e.instance = new e, e.DefaultUserIdKey = "default_user_id", e.SessionNumKey = "session_num", e.TransactionNumKey = "transaction_num", e.Dimension01Key = "dimension01", e.Dimension02Key = "dimension02", e.Dimension03Key = "dimension03", e.SdkConfigCachedKey = "sdk_config_cached", e.LastUsedIdentifierKey = "last_used_identifier", e
                                            }(), t.GAState = u
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i;
                                            t = e.tasks || (e.tasks = {}), n = e.utilities.GAUtilities, r = e.logging.GALogger, i = function() {
                                                function e() {}
                                                return e.execute = function(t, i, A, o) {
                                                    var a = new Date;
                                                    if (e.timestampMap[i] || (e.timestampMap[i] = a), e.countMap[i] || (e.countMap[i] = 0), (a.getTime() - e.timestampMap[i].getTime()) / 1e3 >= 3600 && (e.timestampMap[i] = a, e.countMap[i] = 0), !(e.countMap[i] >= e.MaxCount)) {
                                                        var s = n.getHmac(o, A),
                                                            u = new XMLHttpRequest;
                                                        u.onreadystatechange = function() {
                                                            if (4 === u.readyState) {
                                                                if (!u.responseText) return;
                                                                if (200 != u.status) return void r.w("sdk error failed. response code not 200. status code: " + u.status + ", description: " + u.statusText + ", body: " + u.responseText);
                                                                e.countMap[i] = e.countMap[i] + 1
                                                            }
                                                        }, u.open("POST", t, !0), u.setRequestHeader("Content-Type", "application/json"), u.setRequestHeader("Authorization", s);
                                                        try {
                                                            u.send(A)
                                                        } catch (e) {
                                                            console.error(e)
                                                        }
                                                    }
                                                }, e.MaxCount = 10, e.countMap = {}, e.timestampMap = {}, e
                                            }(), t.SdkErrorTask = i
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i, A, o, a, s, u, c, l;
                                            t = e.http || (e.http = {}), n = e.state.GAState, r = e.logging.GALogger, i = e.utilities.GAUtilities, A = e.validators.GAValidator, o = e.tasks.SdkErrorTask, a = e.events.EGASdkErrorCategory, s = e.events.EGASdkErrorArea, u = e.events.EGASdkErrorAction, c = e.events.EGASdkErrorParameter, l = function() {
                                                function e() {
                                                    this.protocol = "https", this.hostName = "api.gameanalytics.com", this.version = "v2", this.remoteConfigsVersion = "v1", this.baseUrl = this.protocol + "://" + this.hostName + "/" + this.version, this.remoteConfigsBaseUrl = this.protocol + "://" + this.hostName + "/remote_configs/" + this.remoteConfigsVersion, this.initializeUrlPath = "init", this.eventsUrlPath = "events", this.useGzip = !1
                                                }
                                                return e.prototype.requestInit = function(r, i) {
                                                    var A = n.getGameKey(),
                                                        o = this.remoteConfigsBaseUrl + "/" + this.initializeUrlPath + "?game_key=" + A + "&interval_seconds=0&configs_hash=" + r,
                                                        a = n.getInitAnnotations(),
                                                        s = JSON.stringify(a);
                                                    if (s) {
                                                        var u = this.createPayloadData(s, this.useGzip),
                                                            c = [];
                                                        c.push(s), e.sendRequest(o, u, c, this.useGzip, e.initRequestCallback, i)
                                                    } else i(t.EGAHTTPApiResponse.JsonEncodeFailed, null)
                                                }, e.prototype.sendEventsInArray = function(r, i, A) {
                                                    if (0 != r.length) {
                                                        var o = n.getGameKey(),
                                                            a = this.baseUrl + "/" + o + "/" + this.eventsUrlPath,
                                                            s = JSON.stringify(r);
                                                        if (s) {
                                                            var u = this.createPayloadData(s, this.useGzip),
                                                                c = [];
                                                            c.push(s), c.push(i), c.push(r.length.toString()), e.sendRequest(a, u, c, this.useGzip, e.sendEventInArrayRequestCallback, A)
                                                        } else A(t.EGAHTTPApiResponse.JsonEncodeFailed, null, i, r.length)
                                                    }
                                                }, e.prototype.sendSdkErrorEvent = function(t, i, a, s, u, c, l) {
                                                    if (n.isEventSubmissionEnabled() && A.validateSdkErrorEvent(c, l, t, i, a)) {
                                                        var d, f = this.baseUrl + "/" + c + "/" + this.eventsUrlPath,
                                                            g = "",
                                                            I = n.getSdkErrorEventAnnotations(),
                                                            v = e.sdkErrorCategoryString(t);
                                                        I.error_category = v, g += v;
                                                        var h = e.sdkErrorAreaString(i);
                                                        I.error_area = h, g += ":" + h;
                                                        var p = e.sdkErrorActionString(a);
                                                        I.error_action = p;
                                                        var y = e.sdkErrorParameterString(s);
                                                        if (y.length > 0 && (I.error_parameter = y), u.length > 0) {
                                                            var m = u;
                                                            u.length > e.MAX_ERROR_MESSAGE_LENGTH && (m = u.substring(0, e.MAX_ERROR_MESSAGE_LENGTH)), I.reason = m
                                                        }
                                                        var C = [];
                                                        C.push(I), (d = JSON.stringify(C)) ? o.execute(f, g, d, l) : r.w("sendSdkErrorEvent: JSON encoding failed.")
                                                    }
                                                }, e.sendEventInArrayRequestCallback = function(r, i, A, o) {
                                                    void 0 === o && (o = null), o[0], o[1];
                                                    var l, d, f = o[2],
                                                        g = parseInt(o[3]);
                                                    l = r.responseText, d = r.status;
                                                    var I = e.instance.processRequestResponse(d, r.statusText, l, "Events");
                                                    if (I == t.EGAHTTPApiResponse.Ok || I == t.EGAHTTPApiResponse.Created || I == t.EGAHTTPApiResponse.BadRequest) {
                                                        var v = l ? JSON.parse(l) : {};
                                                        if (null == v) return A(t.EGAHTTPApiResponse.JsonDecodeFailed, null, f, g), void e.instance.sendSdkErrorEvent(a.Http, s.EventsHttp, u.FailHttpJsonDecode, c.Undefined, l, n.getGameKey(), n.getGameSecret());
                                                        t.EGAHTTPApiResponse.BadRequest, A(I, v, f, g)
                                                    } else A(I, null, f, g)
                                                }, e.sendRequest = function(e, t, r, A, o, a) {
                                                    var s = new XMLHttpRequest,
                                                        u = n.getGameSecret(),
                                                        c = i.getHmac(u, t),
                                                        l = [];
                                                    for (var d in l.push(c), r) l.push(r[d]);
                                                    if (s.onreadystatechange = function() {
                                                            4 === s.readyState && o(s, e, a, l)
                                                        }, s.open("POST", e, !0), s.setRequestHeader("Content-Type", "application/json"), s.setRequestHeader("Authorization", c), A) throw new Error("gzip not supported");
                                                    try {
                                                        s.send(t)
                                                    } catch (e) {
                                                        console.error(e.stack)
                                                    }
                                                }, e.initRequestCallback = function(r, i, o, l) {
                                                    var d, f;
                                                    void 0 === l && (l = null), l[0], l[1], d = r.responseText, f = r.status;
                                                    var g = d ? JSON.parse(d) : {},
                                                        I = e.instance.processRequestResponse(f, r.statusText, d, "Init");
                                                    if (I == t.EGAHTTPApiResponse.Ok || I == t.EGAHTTPApiResponse.Created || I == t.EGAHTTPApiResponse.BadRequest) {
                                                        if (null == g) return o(t.EGAHTTPApiResponse.JsonDecodeFailed, null, "", 0), void e.instance.sendSdkErrorEvent(a.Http, s.InitHttp, u.FailHttpJsonDecode, c.Undefined, d, n.getGameKey(), n.getGameSecret());
                                                        if (I !== t.EGAHTTPApiResponse.BadRequest) {
                                                            var v = A.validateAndCleanInitRequestResponse(g, I === t.EGAHTTPApiResponse.Created);
                                                            v ? o(I, v, "", 0) : o(t.EGAHTTPApiResponse.BadResponse, null, "", 0)
                                                        } else o(I, null, "", 0)
                                                    } else o(I, null, "", 0)
                                                }, e.prototype.createPayloadData = function(e, t) {
                                                    if (t) throw new Error("gzip not supported");
                                                    return e
                                                }, e.prototype.processRequestResponse = function(e, n, r, i) {
                                                    return r ? 200 === e ? t.EGAHTTPApiResponse.Ok : 201 === e ? t.EGAHTTPApiResponse.Created : 0 === e || 401 === e ? t.EGAHTTPApiResponse.Unauthorized : 400 === e ? t.EGAHTTPApiResponse.BadRequest : 500 === e ? t.EGAHTTPApiResponse.InternalServerError : t.EGAHTTPApiResponse.UnknownResponseCode : t.EGAHTTPApiResponse.NoResponse
                                                }, e.sdkErrorCategoryString = function(e) {
                                                    switch (e) {
                                                        case a.EventValidation:
                                                            return "event_validation";
                                                        case a.Database:
                                                            return "db";
                                                        case a.Init:
                                                            return "init";
                                                        case a.Http:
                                                            return "http";
                                                        case a.Json:
                                                            return "json"
                                                    }
                                                    return ""
                                                }, e.sdkErrorAreaString = function(e) {
                                                    switch (e) {
                                                        case s.BusinessEvent:
                                                            return "business";
                                                        case s.ResourceEvent:
                                                            return "resource";
                                                        case s.ProgressionEvent:
                                                            return "progression";
                                                        case s.DesignEvent:
                                                            return "design";
                                                        case s.ErrorEvent:
                                                            return "error";
                                                        case s.InitHttp:
                                                            return "init_http";
                                                        case s.EventsHttp:
                                                            return "events_http";
                                                        case s.ProcessEvents:
                                                            return "process_events";
                                                        case s.AddEventsToStore:
                                                            return "add_events_to_store"
                                                    }
                                                    return ""
                                                }, e.sdkErrorActionString = function(e) {
                                                    switch (e) {
                                                        case u.InvalidCurrency:
                                                            return "invalid_currency";
                                                        case u.InvalidShortString:
                                                            return "invalid_short_string";
                                                        case u.InvalidEventPartLength:
                                                            return "invalid_event_part_length";
                                                        case u.InvalidEventPartCharacters:
                                                            return "invalid_event_part_characters";
                                                        case u.InvalidStore:
                                                            return "invalid_store";
                                                        case u.InvalidFlowType:
                                                            return "invalid_flow_type";
                                                        case u.StringEmptyOrNull:
                                                            return "string_empty_or_null";
                                                        case u.NotFoundInAvailableCurrencies:
                                                            return "not_found_in_available_currencies";
                                                        case u.InvalidAmount:
                                                            return "invalid_amount";
                                                        case u.NotFoundInAvailableItemTypes:
                                                            return "not_found_in_available_item_types";
                                                        case u.WrongProgressionOrder:
                                                            return "wrong_progression_order";
                                                        case u.InvalidEventIdLength:
                                                            return "invalid_event_id_length";
                                                        case u.InvalidEventIdCharacters:
                                                            return "invalid_event_id_characters";
                                                        case u.InvalidProgressionStatus:
                                                            return "invalid_progression_status";
                                                        case u.InvalidSeverity:
                                                            return "invalid_severity";
                                                        case u.InvalidLongString:
                                                            return "invalid_long_string";
                                                        case u.DatabaseTooLarge:
                                                            return "db_too_large";
                                                        case u.DatabaseOpenOrCreate:
                                                            return "db_open_or_create";
                                                        case u.JsonError:
                                                            return "json_error";
                                                        case u.FailHttpJsonDecode:
                                                            return "fail_http_json_decode";
                                                        case u.FailHttpJsonEncode:
                                                            return "fail_http_json_encode"
                                                    }
                                                    return ""
                                                }, e.sdkErrorParameterString = function(e) {
                                                    switch (e) {
                                                        case c.Currency:
                                                            return "currency";
                                                        case c.CartType:
                                                            return "cart_type";
                                                        case c.ItemType:
                                                            return "item_type";
                                                        case c.ItemId:
                                                            return "item_id";
                                                        case c.Store:
                                                            return "store";
                                                        case c.FlowType:
                                                            return "flow_type";
                                                        case c.Amount:
                                                            return "amount";
                                                        case c.Progression01:
                                                            return "progression01";
                                                        case c.Progression02:
                                                            return "progression02";
                                                        case c.Progression03:
                                                            return "progression03";
                                                        case c.EventId:
                                                            return "event_id";
                                                        case c.ProgressionStatus:
                                                            return "progression_status";
                                                        case c.Severity:
                                                            return "severity";
                                                        case c.Message:
                                                            return "message"
                                                    }
                                                    return ""
                                                }, e.instance = new e, e.MAX_ERROR_MESSAGE_LENGTH = 256, e
                                            }(), t.GAHTTPApi = l
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i, A, o, a, s, u, c, l;
                                            t = e.events || (e.events = {}), n = e.store.GAStore, r = e.store.EGAStore, i = e.store.EGAStoreArgsOperator, A = e.state.GAState, o = e.logging.GALogger, a = e.utilities.GAUtilities, s = e.http.EGAHTTPApiResponse, u = e.http.GAHTTPApi, c = e.validators.GAValidator, l = function() {
                                                function l() {}
                                                return l.customEventFieldsErrorCallback = function(t, n) {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var r = new Date;
                                                        l.timestampMap[t] || (l.timestampMap[t] = r), l.countMap[t] || (l.countMap[t] = 0), (r.getTime() - l.timestampMap[t].getTime()) / 1e3 >= 3600 && (l.timestampMap[t] = r, l.countMap[t] = 0), l.countMap[t] >= l.MAX_ERROR_COUNT || e.threading.GAThreading.performTaskOnGAThread((function() {
                                                            l.addErrorEvent(e.EGAErrorSeverity.Warning, n, null, !0), l.countMap[t] = l.countMap[t] + 1
                                                        }))
                                                    }
                                                }, l.addSessionStartEvent = function() {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var e = {};
                                                        e.category = l.CategorySessionStart, A.incrementSessionNum(), n.setItem(A.getGameKey(), A.SessionNumKey, A.getSessionNum().toString()), l.addDimensionsToEvent(e);
                                                        var t = A.instance.currentGlobalCustomEventFields;
                                                        l.addCustomFieldsToEvent(e, A.validateAndCleanCustomFields(t, l.customEventFieldsErrorCallback)), l.addEventToStore(e), o.i("Add SESSION START event"), l.processEvents(l.CategorySessionStart, !1)
                                                    }
                                                }, l.addSessionEndEvent = function() {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var e = A.getSessionStart(),
                                                            t = A.getClientTsAdjusted() - e;
                                                        t < 0 && (o.w("Session length was calculated to be less then 0. Should not be possible. Resetting to 0."), t = 0);
                                                        var n = {};
                                                        n.category = l.CategorySessionEnd, n.length = t, l.addDimensionsToEvent(n);
                                                        var r = A.instance.currentGlobalCustomEventFields;
                                                        l.addCustomFieldsToEvent(n, A.validateAndCleanCustomFields(r, l.customEventFieldsErrorCallback)), l.addEventToStore(n), o.i("Add SESSION END event."), l.processEvents("", !1)
                                                    }
                                                }, l.addBusinessEvent = function(e, t, r, i, a, s, d) {
                                                    if (void 0 === a && (a = null), A.isEventSubmissionEnabled()) {
                                                        var f = c.validateBusinessEvent(e, t, a, r, i);
                                                        if (null == f) {
                                                            var g = {};
                                                            A.incrementTransactionNum(), n.setItem(A.getGameKey(), A.TransactionNumKey, A.getTransactionNum().toString()), g.event_id = r + ":" + i, g.category = l.CategoryBusiness, g.currency = e, g.amount = t, g[A.TransactionNumKey] = A.getTransactionNum(), a && (g.cart_type = a), l.addDimensionsToEvent(g);
                                                            var I = {};
                                                            if (s && Object.keys(s).length > 0)
                                                                for (var v in s) I[v] = s[v];
                                                            else
                                                                for (var v in A.instance.currentGlobalCustomEventFields) I[v] = A.instance.currentGlobalCustomEventFields[v];
                                                            if (d && s && Object.keys(s).length > 0)
                                                                for (var v in A.instance.currentGlobalCustomEventFields) I[v] || (I[v] = A.instance.currentGlobalCustomEventFields[v]);
                                                            l.addCustomFieldsToEvent(g, A.validateAndCleanCustomFields(I, l.customEventFieldsErrorCallback)), o.i("Add BUSINESS event: {currency:" + e + ", amount:" + t + ", itemType:" + r + ", itemId:" + i + ", cartType:" + a + "}"), l.addEventToStore(g)
                                                        } else u.instance.sendSdkErrorEvent(f.category, f.area, f.action, f.parameter, f.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.addResourceEvent = function(t, n, r, i, a, s, d) {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var f = c.validateResourceEvent(t, n, r, i, a, A.getAvailableResourceCurrencies(), A.getAvailableResourceItemTypes());
                                                        if (null == f) {
                                                            t === e.EGAResourceFlowType.Sink && (r *= -1);
                                                            var g = {},
                                                                I = l.resourceFlowTypeToString(t);
                                                            g.event_id = I + ":" + n + ":" + i + ":" + a, g.category = l.CategoryResource, g.amount = r, l.addDimensionsToEvent(g);
                                                            var v = {};
                                                            if (s && Object.keys(s).length > 0)
                                                                for (var h in s) v[h] = s[h];
                                                            else
                                                                for (var h in A.instance.currentGlobalCustomEventFields) v[h] = A.instance.currentGlobalCustomEventFields[h];
                                                            if (d && s && Object.keys(s).length > 0)
                                                                for (var h in A.instance.currentGlobalCustomEventFields) v[h] || (v[h] = A.instance.currentGlobalCustomEventFields[h]);
                                                            l.addCustomFieldsToEvent(g, A.validateAndCleanCustomFields(v, l.customEventFieldsErrorCallback)), o.i("Add RESOURCE event: {currency:" + n + ", amount:" + r + ", itemType:" + i + ", itemId:" + a + "}"), l.addEventToStore(g)
                                                        } else u.instance.sendSdkErrorEvent(f.category, f.area, f.action, f.parameter, f.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.addProgressionEvent = function(t, n, r, i, a, s, d, f) {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var g = l.progressionStatusToString(t),
                                                            I = c.validateProgressionEvent(t, n, r, i);
                                                        if (null == I) {
                                                            var v, h = {};
                                                            v = r ? i ? n + ":" + r + ":" + i : n + ":" + r : n, h.category = l.CategoryProgression, h.event_id = g + ":" + v;
                                                            var p = 0;
                                                            s && t != e.EGAProgressionStatus.Start && (h.score = Math.round(a)), t === e.EGAProgressionStatus.Fail && A.incrementProgressionTries(v), t === e.EGAProgressionStatus.Complete && (A.incrementProgressionTries(v), p = A.getProgressionTries(v), h.attempt_num = p, A.clearProgressionTries(v)), l.addDimensionsToEvent(h);
                                                            var y = {};
                                                            if (d && Object.keys(d).length > 0)
                                                                for (var m in d) y[m] = d[m];
                                                            else
                                                                for (var m in A.instance.currentGlobalCustomEventFields) y[m] = A.instance.currentGlobalCustomEventFields[m];
                                                            if (f && d && Object.keys(d).length > 0)
                                                                for (var m in A.instance.currentGlobalCustomEventFields) y[m] || (y[m] = A.instance.currentGlobalCustomEventFields[m]);
                                                            l.addCustomFieldsToEvent(h, A.validateAndCleanCustomFields(y, l.customEventFieldsErrorCallback)), o.i("Add PROGRESSION event: {status:" + g + ", progression01:" + n + ", progression02:" + r + ", progression03:" + i + ", score:" + a + ", attempt:" + p + "}"), l.addEventToStore(h)
                                                        } else u.instance.sendSdkErrorEvent(I.category, I.area, I.action, I.parameter, I.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.addDesignEvent = function(e, t, n, r, i) {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var a = c.validateDesignEvent(e);
                                                        if (null == a) {
                                                            var s = {};
                                                            s.category = l.CategoryDesign, s.event_id = e, n && (s.value = t), l.addDimensionsToEvent(s);
                                                            var d = {};
                                                            if (r && Object.keys(r).length > 0)
                                                                for (var f in r) d[f] = r[f];
                                                            else
                                                                for (var f in A.instance.currentGlobalCustomEventFields) d[f] = A.instance.currentGlobalCustomEventFields[f];
                                                            if (i && r && Object.keys(r).length > 0)
                                                                for (var f in A.instance.currentGlobalCustomEventFields) d[f] || (d[f] = A.instance.currentGlobalCustomEventFields[f]);
                                                            l.addCustomFieldsToEvent(s, A.validateAndCleanCustomFields(d, l.customEventFieldsErrorCallback)), o.i("Add DESIGN event: {eventId:" + e + ", value:" + t + "}"), l.addEventToStore(s)
                                                        } else u.instance.sendSdkErrorEvent(a.category, a.area, a.action, a.parameter, a.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.addErrorEvent = function(e, t, n, r, i) {
                                                    if (void 0 === i && (i = !1), A.isEventSubmissionEnabled()) {
                                                        var a = l.errorSeverityToString(e),
                                                            s = c.validateErrorEvent(e, t);
                                                        if (null == s) {
                                                            var d = {};
                                                            if (d.category = l.CategoryError, d.severity = a, d.message = t, l.addDimensionsToEvent(d), !i) {
                                                                var f = {};
                                                                if (n && Object.keys(n).length > 0)
                                                                    for (var g in n) f[g] = n[g];
                                                                else
                                                                    for (var g in A.instance.currentGlobalCustomEventFields) f[g] = A.instance.currentGlobalCustomEventFields[g];
                                                                if (r && n && Object.keys(n).length > 0)
                                                                    for (var g in A.instance.currentGlobalCustomEventFields) f[g] || (f[g] = A.instance.currentGlobalCustomEventFields[g]);
                                                                l.addCustomFieldsToEvent(d, A.validateAndCleanCustomFields(f, l.customEventFieldsErrorCallback))
                                                            }
                                                            o.i("Add ERROR event: {severity:" + a + ", message:" + t + "}"), l.addEventToStore(d)
                                                        } else u.instance.sendSdkErrorEvent(s.category, s.area, s.action, s.parameter, s.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.addAdEvent = function(t, n, r, i, a, s, d, f, g) {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var I = l.adActionToString(t),
                                                            v = l.adTypeToString(n),
                                                            h = l.adErrorToString(a),
                                                            p = c.validateAdEvent(t, n, r, i);
                                                        if (null == p) {
                                                            var y = {};
                                                            y.category = l.CategoryAds, y.ad_sdk_name = r, y.ad_placement = i, y.ad_type = v, y.ad_action = I, t == e.EGAAdAction.FailedShow && h.length > 0 && (y.ad_fail_show_reason = h), !d || n != e.EGAAdType.RewardedVideo && n != e.EGAAdType.Video || (y.ad_duration = s), l.addDimensionsToEvent(y);
                                                            var m = {};
                                                            if (f && Object.keys(f).length > 0)
                                                                for (var C in f) m[C] = f[C];
                                                            else
                                                                for (var C in A.instance.currentGlobalCustomEventFields) m[C] = A.instance.currentGlobalCustomEventFields[C];
                                                            if (g && f && Object.keys(f).length > 0)
                                                                for (var C in A.instance.currentGlobalCustomEventFields) m[C] || (m[C] = A.instance.currentGlobalCustomEventFields[C]);
                                                            l.addCustomFieldsToEvent(y, A.validateAndCleanCustomFields(m, l.customEventFieldsErrorCallback)), o.i("Add AD event: {ad_sdk_name:" + r + ", ad_placement:" + i + ", ad_type:" + v + ", ad_action:" + I + (t == e.EGAAdAction.FailedShow && h.length > 0 ? ", ad_fail_show_reason:" + h : "") + (!d || n != e.EGAAdType.RewardedVideo && n != e.EGAAdType.Video ? "" : ", ad_duration:" + s) + "}"), l.addEventToStore(y)
                                                        } else u.instance.sendSdkErrorEvent(p.category, p.area, p.action, p.parameter, p.reason, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.processEvents = function(e, s) {
                                                    if (A.isEventSubmissionEnabled()) try {
                                                        var d = a.createGuid();
                                                        s && (l.cleanupEvents(), l.fixMissingSessionEndEvents());
                                                        var f = [];
                                                        f.push(["status", i.Equal, "new"]);
                                                        var g = [];
                                                        g.push(["status", i.Equal, "new"]), e && (f.push(["category", i.Equal, e]), g.push(["category", i.Equal, e]));
                                                        var I = [];
                                                        I.push(["status", d]);
                                                        var v = n.select(r.Events, f);
                                                        if (!v || 0 == v.length) return o.i("Event queue: No events to send"), void l.updateSessionStore();
                                                        if (v.length > l.MaxEventCount) {
                                                            if (!(v = n.select(r.Events, f, !0, l.MaxEventCount))) return;
                                                            var h = v[v.length - 1].client_ts;
                                                            if (f.push(["client_ts", i.LessOrEqual, h]), !(v = n.select(r.Events, f))) return;
                                                            g.push(["client_ts", i.LessOrEqual, h])
                                                        }
                                                        if (o.i("Event queue: Sending " + v.length + " events."), !n.update(r.Events, I, g)) return;
                                                        for (var p = [], y = 0; y < v.length; ++y) {
                                                            var m = v[y],
                                                                C = JSON.parse(a.decode64(m.event));
                                                            if (0 != C.length) {
                                                                var E = C.client_ts;
                                                                E && !c.validateClientTs(E) && delete C.client_ts, p.push(C)
                                                            }
                                                        }
                                                        u.instance.sendEventsInArray(p, d, l.processEventsCallback)
                                                    } catch (e) {
                                                        o.e("Error during ProcessEvents(): " + e.stack), u.instance.sendSdkErrorEvent(t.EGASdkErrorCategory.Json, t.EGASdkErrorArea.ProcessEvents, t.EGASdkErrorAction.JsonError, t.EGASdkErrorParameter.Undefined, e.stack, A.getGameKey(), A.getGameSecret())
                                                    }
                                                }, l.processEventsCallback = function(e, t, A, a) {
                                                    var u = [];
                                                    if (u.push(["status", i.Equal, A]), e === s.Ok) n.delete(r.Events, u), o.i("Event queue: " + a + " events sent.");
                                                    else if (e === s.NoResponse) {
                                                        var c = [];
                                                        c.push(["status", "new"]), o.w("Event queue: Failed to send events to collector - Retrying next time"), n.update(r.Events, c, u)
                                                    } else {
                                                        if (t) {
                                                            var l, d = 0;
                                                            for (var f in t) 0 == d && (l = t[f]), ++d;
                                                            e === s.BadRequest && l.constructor === Array ? o.w("Event queue: " + a + " events sent. " + d + " events failed GA server validation.") : o.w("Event queue: Failed to send events.")
                                                        } else o.w("Event queue: Failed to send events.");
                                                        n.delete(r.Events, u)
                                                    }
                                                }, l.cleanupEvents = function() {
                                                    n.update(r.Events, [
                                                        ["status", "new"]
                                                    ])
                                                }, l.fixMissingSessionEndEvents = function() {
                                                    if (A.isEventSubmissionEnabled()) {
                                                        var e = [];
                                                        e.push(["session_id", i.NotEqual, A.getSessionId()]);
                                                        var t = n.select(r.Sessions, e);
                                                        if (t && 0 != t.length) {
                                                            o.i(t.length + " session(s) located with missing session_end event.");
                                                            for (var s = 0; s < t.length; ++s) {
                                                                var u = JSON.parse(a.decode64(t[s].event)),
                                                                    c = u.client_ts - t[s].timestamp;
                                                                c = Math.max(0, c), u.category = l.CategorySessionEnd, u.length = c, l.addEventToStore(u)
                                                            }
                                                        }
                                                    }
                                                }, l.addEventToStore = function(e) {
                                                    if (A.isEventSubmissionEnabled())
                                                        if (A.isInitialized()) try {
                                                            if (n.isStoreTooLargeForEvents() && !a.stringMatch(e.category, /^(user|session_end|business)$/)) return o.w("Database too large. Event has been blocked."), void u.instance.sendSdkErrorEvent(t.EGASdkErrorCategory.Database, t.EGASdkErrorArea.AddEventsToStore, t.EGASdkErrorAction.DatabaseTooLarge, t.EGASdkErrorParameter.Undefined, "", A.getGameKey(), A.getGameSecret());
                                                            var s = A.getEventAnnotations();
                                                            for (var c in e) s[c] = e[c];
                                                            var d = JSON.stringify(s);
                                                            o.ii("Event added to queue: " + d);
                                                            var f = {
                                                                status: "new"
                                                            };
                                                            f.category = s.category, f.session_id = s.session_id, f.client_ts = s.client_ts, f.event = a.encode64(JSON.stringify(s)), n.insert(r.Events, f), e.category == l.CategorySessionEnd ? n.delete(r.Sessions, [
                                                                ["session_id", i.Equal, s.session_id]
                                                            ]) : l.updateSessionStore(), n.isStorageAvailable() && n.save(A.getGameKey())
                                                        } catch (c) {
                                                            o.e("addEventToStore: error"), o.e(c.stack), u.instance.sendSdkErrorEvent(t.EGASdkErrorCategory.Database, t.EGASdkErrorArea.AddEventsToStore, t.EGASdkErrorAction.DatabaseTooLarge, t.EGASdkErrorParameter.Undefined, c.stack, A.getGameKey(), A.getGameSecret())
                                                        } else o.w("Could not add event: SDK is not initialized")
                                                }, l.updateSessionStore = function() {
                                                    if (A.sessionIsStarted()) {
                                                        var e = {};
                                                        e.session_id = A.instance.sessionId, e.timestamp = A.getSessionStart();
                                                        var t = A.getEventAnnotations();
                                                        l.addDimensionsToEvent(t);
                                                        var i = A.instance.currentGlobalCustomEventFields;
                                                        l.addCustomFieldsToEvent(t, A.validateAndCleanCustomFields(i, l.customEventFieldsErrorCallback)), e.event = a.encode64(JSON.stringify(t)), n.insert(r.Sessions, e, !0, "session_id"), n.isStorageAvailable() && n.save(A.getGameKey())
                                                    }
                                                }, l.addDimensionsToEvent = function(e) {
                                                    e && (A.getCurrentCustomDimension01() && (e.custom_01 = A.getCurrentCustomDimension01()), A.getCurrentCustomDimension02() && (e.custom_02 = A.getCurrentCustomDimension02()), A.getCurrentCustomDimension03() && (e.custom_03 = A.getCurrentCustomDimension03()))
                                                }, l.addCustomFieldsToEvent = function(e, t) {
                                                    e && t && Object.keys(t).length > 0 && (e.custom_fields = t)
                                                }, l.resourceFlowTypeToString = function(t) {
                                                    return t == e.EGAResourceFlowType.Source || t == e.EGAResourceFlowType[e.EGAResourceFlowType.Source] ? "Source" : t == e.EGAResourceFlowType.Sink || t == e.EGAResourceFlowType[e.EGAResourceFlowType.Sink] ? "Sink" : ""
                                                }, l.progressionStatusToString = function(t) {
                                                    return t == e.EGAProgressionStatus.Start || t == e.EGAProgressionStatus[e.EGAProgressionStatus.Start] ? "Start" : t == e.EGAProgressionStatus.Complete || t == e.EGAProgressionStatus[e.EGAProgressionStatus.Complete] ? "Complete" : t == e.EGAProgressionStatus.Fail || t == e.EGAProgressionStatus[e.EGAProgressionStatus.Fail] ? "Fail" : ""
                                                }, l.errorSeverityToString = function(t) {
                                                    return t == e.EGAErrorSeverity.Debug || t == e.EGAErrorSeverity[e.EGAErrorSeverity.Debug] ? "debug" : t == e.EGAErrorSeverity.Info || t == e.EGAErrorSeverity[e.EGAErrorSeverity.Info] ? "info" : t == e.EGAErrorSeverity.Warning || t == e.EGAErrorSeverity[e.EGAErrorSeverity.Warning] ? "warning" : t == e.EGAErrorSeverity.Error || t == e.EGAErrorSeverity[e.EGAErrorSeverity.Error] ? "error" : t == e.EGAErrorSeverity.Critical || t == e.EGAErrorSeverity[e.EGAErrorSeverity.Critical] ? "critical" : ""
                                                }, l.adActionToString = function(t) {
                                                    return t == e.EGAAdAction.Clicked || t == e.EGAAdAction[e.EGAAdAction.Clicked] ? "clicked" : t == e.EGAAdAction.Show || t == e.EGAAdAction[e.EGAAdAction.Show] ? "show" : t == e.EGAAdAction.FailedShow || t == e.EGAAdAction[e.EGAAdAction.FailedShow] ? "failed_show" : t == e.EGAAdAction.RewardReceived || t == e.EGAAdAction[e.EGAAdAction.RewardReceived] ? "reward_received" : ""
                                                }, l.adErrorToString = function(t) {
                                                    return t == e.EGAAdError.Unknown || t == e.EGAAdError[e.EGAAdError.Unknown] ? "unknown" : t == e.EGAAdError.Offline || t == e.EGAAdError[e.EGAAdError.Offline] ? "offline" : t == e.EGAAdError.NoFill || t == e.EGAAdError[e.EGAAdError.NoFill] ? "no_fill" : t == e.EGAAdError.InternalError || t == e.EGAAdError[e.EGAAdError.InternalError] ? "internal_error" : t == e.EGAAdError.InvalidRequest || t == e.EGAAdError[e.EGAAdError.InvalidRequest] ? "invalid_request" : t == e.EGAAdError.UnableToPrecache || t == e.EGAAdError[e.EGAAdError.UnableToPrecache] ? "unable_to_precache" : ""
                                                }, l.adTypeToString = function(t) {
                                                    return t == e.EGAAdType.Video || t == e.EGAAdType[e.EGAAdType.Video] ? "video" : t == e.EGAAdType.RewardedVideo || t == e.EGAAdError[e.EGAAdType.RewardedVideo] ? "rewarded_video" : t == e.EGAAdType.Playable || t == e.EGAAdError[e.EGAAdType.Playable] ? "playable" : t == e.EGAAdType.Interstitial || t == e.EGAAdError[e.EGAAdType.Interstitial] ? "interstitial" : t == e.EGAAdType.OfferWall || t == e.EGAAdError[e.EGAAdType.OfferWall] ? "offer_wall" : t == e.EGAAdType.Banner || t == e.EGAAdError[e.EGAAdType.Banner] ? "banner" : ""
                                                }, l.CategorySessionStart = "user", l.CategorySessionEnd = "session_end", l.CategoryDesign = "design", l.CategoryBusiness = "business", l.CategoryProgression = "progression", l.CategoryResource = "resource", l.CategoryError = "error", l.CategoryAds = "ads", l.MaxEventCount = 500, l.MAX_ERROR_COUNT = 10, l.countMap = {}, l.timestampMap = {}, l
                                            }(), t.GAEvents = l
                                        }(o || (o = {})),
                                        function(e) {
                                            var t, n, r, i, A;
                                            t = e.threading || (e.threading = {}), n = e.logging.GALogger, r = e.state.GAState, i = e.events.GAEvents, A = function() {
                                                function e() {
                                                    this.blocks = new t.PriorityQueue({
                                                        compare: function(e, t) {
                                                            return e - t
                                                        }
                                                    }), this.id2TimedBlockMap = {}, e.startThread()
                                                }
                                                return e.createTimedBlock = function(e) {
                                                    void 0 === e && (e = 0);
                                                    var n = new Date;
                                                    return n.setSeconds(n.getSeconds() + e), new t.TimedBlock(n)
                                                }, e.performTaskOnGAThread = function(n, r) {
                                                    void 0 === r && (r = 0);
                                                    var i = new Date;
                                                    i.setSeconds(i.getSeconds() + r);
                                                    var A = new t.TimedBlock(i);
                                                    A.block = n, e.instance.id2TimedBlockMap[A.id] = A, e.instance.addTimedBlock(A)
                                                }, e.performTimedBlockOnGAThread = function(t) {
                                                    e.instance.id2TimedBlockMap[t.id] = t, e.instance.addTimedBlock(t)
                                                }, e.scheduleTimer = function(n, r) {
                                                    var i = new Date;
                                                    i.setSeconds(i.getSeconds() + n);
                                                    var A = new t.TimedBlock(i);
                                                    return A.block = r, e.instance.id2TimedBlockMap[A.id] = A, e.instance.addTimedBlock(A), A.id
                                                }, e.getTimedBlockById = function(t) {
                                                    return t in e.instance.id2TimedBlockMap ? e.instance.id2TimedBlockMap[t] : null
                                                }, e.ensureEventQueueIsRunning = function() {
                                                    e.instance.keepRunning = !0, e.instance.isRunning || (e.instance.isRunning = !0, e.scheduleTimer(e.ProcessEventsIntervalInSeconds, e.processEventQueue))
                                                }, e.endSessionAndStopQueue = function() {
                                                    r.isInitialized() && (n.i("Ending session."), e.stopEventQueue(), r.isEnabled() && r.sessionIsStarted() && (i.addSessionEndEvent(), r.instance.sessionStart = 0))
                                                }, e.stopEventQueue = function() {
                                                    e.instance.keepRunning = !1
                                                }, e.ignoreTimer = function(t) {
                                                    t in e.instance.id2TimedBlockMap && (e.instance.id2TimedBlockMap[t].ignore = !0)
                                                }, e.setEventProcessInterval = function(t) {
                                                    t > 0 && (e.ProcessEventsIntervalInSeconds = t)
                                                }, e.prototype.addTimedBlock = function(e) {
                                                    this.blocks.enqueue(e.deadline.getTime(), e)
                                                }, e.run = function() {
                                                    clearTimeout(e.runTimeoutId);
                                                    try {
                                                        for (var t; t = e.getNextBlock();)
                                                            if (!t.ignore)
                                                                if (t.async) {
                                                                    if (!t.running) {
                                                                        t.running = !0, t.block();
                                                                        break
                                                                    }
                                                                } else t.block();
                                                        return void(e.runTimeoutId = setTimeout(e.run, e.ThreadWaitTimeInMs))
                                                    } catch (e) {
                                                        n.e("Error on GA thread"), n.e(e.stack)
                                                    }
                                                }, e.startThread = function() {
                                                    e.runTimeoutId = setTimeout(e.run, 0)
                                                }, e.getNextBlock = function() {
                                                    var t = new Date;
                                                    return e.instance.blocks.hasItems() && e.instance.blocks.peek().deadline.getTime() <= t.getTime() ? e.instance.blocks.peek().async && e.instance.blocks.peek().running ? e.instance.blocks.peek() : e.instance.blocks.dequeue() : null
                                                }, e.processEventQueue = function() {
                                                    i.processEvents("", !0), e.instance.keepRunning ? e.scheduleTimer(e.ProcessEventsIntervalInSeconds, e.processEventQueue) : e.instance.isRunning = !1
                                                }, e.instance = new e, e.ThreadWaitTimeInMs = 1e3, e.ProcessEventsIntervalInSeconds = 8, e
                                            }(), t.GAThreading = A
                                        }(o || (o = {})),
                                        function(e) {
                                            var t = e.threading.GAThreading,
                                                r = e.logging.GALogger,
                                                i = e.store.GAStore,
                                                A = e.state.GAState,
                                                o = e.http.GAHTTPApi,
                                                a = e.device.GADevice,
                                                s = e.validators.GAValidator,
                                                u = e.http.EGAHTTPApiResponse,
                                                c = e.utilities.GAUtilities,
                                                l = e.events.GAEvents,
                                                d = function() {
                                                    function d() {}
                                                    return d.getGlobalObject = function() {
                                                        return "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n.g ? n.g : void 0
                                                    }, d.init = function() {
                                                        if (a.touch(), d.methodMap.configureAvailableCustomDimensions01 = d.configureAvailableCustomDimensions01, d.methodMap.configureAvailableCustomDimensions02 = d.configureAvailableCustomDimensions02, d.methodMap.configureAvailableCustomDimensions03 = d.configureAvailableCustomDimensions03, d.methodMap.configureAvailableResourceCurrencies = d.configureAvailableResourceCurrencies, d.methodMap.configureAvailableResourceItemTypes = d.configureAvailableResourceItemTypes, d.methodMap.configureBuild = d.configureBuild, d.methodMap.configureSdkGameEngineVersion = d.configureSdkGameEngineVersion, d.methodMap.configureGameEngineVersion = d.configureGameEngineVersion, d.methodMap.configureUserId = d.configureUserId, d.methodMap.initialize = d.initialize, d.methodMap.addBusinessEvent = d.addBusinessEvent, d.methodMap.addResourceEvent = d.addResourceEvent, d.methodMap.addProgressionEvent = d.addProgressionEvent, d.methodMap.addDesignEvent = d.addDesignEvent, d.methodMap.addErrorEvent = d.addErrorEvent, d.methodMap.addAdEvent = d.addAdEvent, d.methodMap.setEnabledInfoLog = d.setEnabledInfoLog, d.methodMap.setEnabledVerboseLog = d.setEnabledVerboseLog, d.methodMap.setEnabledManualSessionHandling = d.setEnabledManualSessionHandling, d.methodMap.setEnabledEventSubmission = d.setEnabledEventSubmission, d.methodMap.setCustomDimension01 = d.setCustomDimension01, d.methodMap.setCustomDimension02 = d.setCustomDimension02, d.methodMap.setCustomDimension03 = d.setCustomDimension03, d.methodMap.setGlobalCustomEventFields = d.setGlobalCustomEventFields, d.methodMap.setEventProcessInterval = d.setEventProcessInterval, d.methodMap.startSession = d.startSession, d.methodMap.endSession = d.endSession, d.methodMap.onStop = d.onStop, d.methodMap.onResume = d.onResume, d.methodMap.addRemoteConfigsListener = d.addRemoteConfigsListener, d.methodMap.removeRemoteConfigsListener = d.removeRemoteConfigsListener, d.methodMap.getRemoteConfigsValueAsString = d.getRemoteConfigsValueAsString, d.methodMap.isRemoteConfigsReady = d.isRemoteConfigsReady, d.methodMap.getRemoteConfigsContentAsString = d.getRemoteConfigsContentAsString, d.methodMap.addOnBeforeUnloadListener = d.addOnBeforeUnloadListener, d.methodMap.removeOnBeforeUnloadListener = d.removeOnBeforeUnloadListener, void 0 !== d.getGlobalObject() && void 0 !== d.getGlobalObject().GameAnalytics && void 0 !== d.getGlobalObject().GameAnalytics.q) {
                                                            var e = d.getGlobalObject().GameAnalytics.q;
                                                            for (var n in e) d.gaCommand.apply(null, e[n])
                                                        }
                                                        window.addEventListener("beforeunload", (function(e) {
                                                            console.log("addEventListener unload"), A.instance.isUnloading = !0, A.notifyBeforeUnloadListeners(), t.endSessionAndStopQueue(), A.instance.isUnloading = !1
                                                        }))
                                                    }, d.gaCommand = function() {
                                                        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                                                        t.length > 0 && t[0] in e.GameAnalytics.methodMap && (t.length > 1 ? e.GameAnalytics.methodMap[t[0]].apply(null, Array.prototype.slice.call(t, 1)) : e.GameAnalytics.methodMap[t[0]]())
                                                    }, d.configureAvailableCustomDimensions01 = function(e) {
                                                        void 0 === e && (e = []), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Available custom dimensions must be set before SDK is initialized") : A.setAvailableCustomDimensions01(e)
                                                        }))
                                                    }, d.configureAvailableCustomDimensions02 = function(e) {
                                                        void 0 === e && (e = []), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Available custom dimensions must be set before SDK is initialized") : A.setAvailableCustomDimensions02(e)
                                                        }))
                                                    }, d.configureAvailableCustomDimensions03 = function(e) {
                                                        void 0 === e && (e = []), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Available custom dimensions must be set before SDK is initialized") : A.setAvailableCustomDimensions03(e)
                                                        }))
                                                    }, d.configureAvailableResourceCurrencies = function(e) {
                                                        void 0 === e && (e = []), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Available resource currencies must be set before SDK is initialized") : A.setAvailableResourceCurrencies(e)
                                                        }))
                                                    }, d.configureAvailableResourceItemTypes = function(e) {
                                                        void 0 === e && (e = []), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Available resource item types must be set before SDK is initialized") : A.setAvailableResourceItemTypes(e)
                                                        }))
                                                    }, d.configureBuild = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("Build version must be set before SDK is initialized.") : s.validateBuild(e) ? A.setBuild(e) : r.i("Validation fail - configure build: Cannot be null, empty or above 32 length. String: " + e)
                                                        }))
                                                    }, d.configureSdkGameEngineVersion = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) || (s.validateSdkWrapperVersion(e) ? a.sdkGameEngineVersion = e : r.i("Validation fail - configure sdk version: Sdk version not supported. String: " + e))
                                                        }))
                                                    }, d.configureGameEngineVersion = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) || (s.validateEngineVersion(e) ? a.gameEngineVersion = e : r.i("Validation fail - configure game engine version: Game engine version not supported. String: " + e))
                                                        }))
                                                    }, d.configureUserId = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !1) ? r.w("A custom user id must be set before SDK is initialized.") : s.validateUserId(e) ? A.setUserId(e) : r.i("Validation fail - configure user_id: Cannot be null, empty or above 64 length. Will use default user_id method. Used string: " + e)
                                                        }))
                                                    }, d.initialize = function(e, n) {
                                                        void 0 === e && (e = ""), void 0 === n && (n = ""), a.updateConnectionType();
                                                        var i = t.createTimedBlock();
                                                        i.async = !0, d.initTimedBlockId = i.id, i.block = function() {
                                                            d.isSdkReady(!0, !1) ? r.w("SDK already initialized. Can only be called once.") : s.validateKeys(e, n) ? (A.setKeys(e, n), d.internalInitialize()) : r.w("SDK failed initialize. Game key or secret key is invalid. Can only contain characters A-z 0-9, gameKey is 32 length, gameSecret is 40 length. Failed keys - gameKey: " + e + ", secretKey: " + n)
                                                        }, t.performTimedBlockOnGAThread(i)
                                                    }, d.addBusinessEvent = function(e, n, r, i, o, s, u) {
                                                        if (void 0 === e && (e = ""), void 0 === n && (n = 0), void 0 === r && (r = ""), void 0 === i && (i = ""), void 0 === o && (o = ""), void 0 === s && (s = {}), void 0 === u && (u = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add business event")) return;
                                                            l.addBusinessEvent(e, n, r, i, o, s, u)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add business event") && l.addBusinessEvent(e, n, r, i, o, s, u)
                                                        }))
                                                    }, d.addResourceEvent = function(n, r, i, o, s, u, c) {
                                                        if (void 0 === n && (n = e.EGAResourceFlowType.Undefined), void 0 === r && (r = ""), void 0 === i && (i = 0), void 0 === o && (o = ""), void 0 === s && (s = ""), void 0 === u && (u = {}), void 0 === c && (c = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add resource event")) return;
                                                            l.addResourceEvent(n, r, i, o, s, u, c)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add resource event") && l.addResourceEvent(n, r, i, o, s, u, c)
                                                        }))
                                                    }, d.addProgressionEvent = function(n, r, i, o, s, u, c) {
                                                        if (void 0 === n && (n = e.EGAProgressionStatus.Undefined), void 0 === r && (r = ""), void 0 === i && (i = ""), void 0 === o && (o = ""), void 0 === u && (u = {}), void 0 === c && (c = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add progression event")) return;
                                                            var f = "number" == typeof s;
                                                            l.addProgressionEvent(n, r, i, o, f ? s : 0, f, u, c)
                                                        } else t.performTaskOnGAThread((function() {
                                                            if (d.isSdkReady(!0, !0, "Could not add progression event")) {
                                                                var e = "number" == typeof s;
                                                                l.addProgressionEvent(n, r, i, o, e ? s : 0, e, u, c)
                                                            }
                                                        }))
                                                    }, d.addDesignEvent = function(e, n, r, i) {
                                                        if (void 0 === r && (r = {}), void 0 === i && (i = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add design event")) return;
                                                            var o = "number" == typeof n;
                                                            l.addDesignEvent(e, o ? n : 0, o, r, i)
                                                        } else t.performTaskOnGAThread((function() {
                                                            if (d.isSdkReady(!0, !0, "Could not add design event")) {
                                                                var t = "number" == typeof n;
                                                                l.addDesignEvent(e, t ? n : 0, t, r, i)
                                                            }
                                                        }))
                                                    }, d.addErrorEvent = function(n, r, i, o) {
                                                        if (void 0 === n && (n = e.EGAErrorSeverity.Undefined), void 0 === r && (r = ""), void 0 === i && (i = {}), void 0 === o && (o = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add error event")) return;
                                                            l.addErrorEvent(n, r, i, o)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add error event") && l.addErrorEvent(n, r, i, o)
                                                        }))
                                                    }, d.addAdEventWithNoAdReason = function(n, r, i, o, s, u, c) {
                                                        if (void 0 === n && (n = e.EGAAdAction.Undefined), void 0 === r && (r = e.EGAAdType.Undefined), void 0 === i && (i = ""), void 0 === o && (o = ""), void 0 === s && (s = e.EGAAdError.Undefined), void 0 === u && (u = {}), void 0 === c && (c = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add ad event")) return;
                                                            l.addAdEvent(n, r, i, o, s, 0, !1, u, c)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add ad event") && l.addAdEvent(n, r, i, o, s, 0, !1, u, c)
                                                        }))
                                                    }, d.addAdEventWithDuration = function(n, r, i, o, s, u, c) {
                                                        if (void 0 === n && (n = e.EGAAdAction.Undefined), void 0 === r && (r = e.EGAAdType.Undefined), void 0 === i && (i = ""), void 0 === o && (o = ""), void 0 === s && (s = 0), void 0 === u && (u = {}), void 0 === c && (c = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add ad event")) return;
                                                            l.addAdEvent(n, r, i, o, e.EGAAdError.Undefined, s, !0, u, c)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add ad event") && l.addAdEvent(n, r, i, o, e.EGAAdError.Undefined, s, !0, u, c)
                                                        }))
                                                    }, d.addAdEvent = function(n, r, i, o, s, u) {
                                                        if (void 0 === n && (n = e.EGAAdAction.Undefined), void 0 === r && (r = e.EGAAdType.Undefined), void 0 === i && (i = ""), void 0 === o && (o = ""), void 0 === s && (s = {}), void 0 === u && (u = !1), a.updateConnectionType(), A.instance.isUnloading) {
                                                            if (!d.isSdkReady(!0, !0, "Could not add ad event")) return;
                                                            l.addAdEvent(n, r, i, o, e.EGAAdError.Undefined, 0, !1, s, u)
                                                        } else t.performTaskOnGAThread((function() {
                                                            d.isSdkReady(!0, !0, "Could not add ad event") && l.addAdEvent(n, r, i, o, e.EGAAdError.Undefined, 0, !1, s, u)
                                                        }))
                                                    }, d.setEnabledInfoLog = function(e) {
                                                        void 0 === e && (e = !1), t.performTaskOnGAThread((function() {
                                                            e ? (r.setInfoLog(e), r.i("Info logging enabled")) : (r.i("Info logging disabled"), r.setInfoLog(e))
                                                        }))
                                                    }, d.setEnabledVerboseLog = function(e) {
                                                        void 0 === e && (e = !1), t.performTaskOnGAThread((function() {
                                                            e ? (r.setVerboseLog(e), r.i("Verbose logging enabled")) : (r.i("Verbose logging disabled"), r.setVerboseLog(e))
                                                        }))
                                                    }, d.setEnabledManualSessionHandling = function(e) {
                                                        void 0 === e && (e = !1), t.performTaskOnGAThread((function() {
                                                            A.setManualSessionHandling(e)
                                                        }))
                                                    }, d.setEnabledEventSubmission = function(e) {
                                                        void 0 === e && (e = !1), t.performTaskOnGAThread((function() {
                                                            e ? (A.setEnabledEventSubmission(e), r.i("Event submission enabled")) : (r.i("Event submission disabled"), A.setEnabledEventSubmission(e))
                                                        }))
                                                    }, d.setCustomDimension01 = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            s.validateDimension01(e, A.getAvailableCustomDimensions01()) ? A.setCustomDimension01(e) : r.w("Could not set custom01 dimension value to '" + e + "'. Value not found in available custom01 dimension values")
                                                        }))
                                                    }, d.setCustomDimension02 = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            s.validateDimension02(e, A.getAvailableCustomDimensions02()) ? A.setCustomDimension02(e) : r.w("Could not set custom02 dimension value to '" + e + "'. Value not found in available custom02 dimension values")
                                                        }))
                                                    }, d.setCustomDimension03 = function(e) {
                                                        void 0 === e && (e = ""), t.performTaskOnGAThread((function() {
                                                            s.validateDimension03(e, A.getAvailableCustomDimensions03()) ? A.setCustomDimension03(e) : r.w("Could not set custom03 dimension value to '" + e + "'. Value not found in available custom03 dimension values")
                                                        }))
                                                    }, d.setGlobalCustomEventFields = function(e) {
                                                        void 0 === e && (e = {}), t.performTaskOnGAThread((function() {
                                                            r.i("Set global custom event fields: " + JSON.stringify(e)), A.instance.currentGlobalCustomEventFields = e
                                                        }))
                                                    }, d.setEventProcessInterval = function(e) {
                                                        t.performTaskOnGAThread((function() {
                                                            t.setEventProcessInterval(e)
                                                        }))
                                                    }, d.startSession = function() {
                                                        if (A.isInitialized()) {
                                                            var e = t.createTimedBlock();
                                                            e.async = !0, d.initTimedBlockId = e.id, e.block = function() {
                                                                A.isEnabled() && A.sessionIsStarted() && t.endSessionAndStopQueue(), d.resumeSessionAndStartQueue()
                                                            }, t.performTimedBlockOnGAThread(e)
                                                        }
                                                    }, d.endSession = function() {
                                                        d.onStop()
                                                    }, d.onStop = function() {
                                                        t.performTaskOnGAThread((function() {
                                                            try {
                                                                t.endSessionAndStopQueue()
                                                            } catch (e) {}
                                                        }))
                                                    }, d.onResume = function() {
                                                        var e = t.createTimedBlock();
                                                        e.async = !0, d.initTimedBlockId = e.id, e.block = function() {
                                                            d.resumeSessionAndStartQueue()
                                                        }, t.performTimedBlockOnGAThread(e)
                                                    }, d.getRemoteConfigsValueAsString = function(e, t) {
                                                        return void 0 === t && (t = null), A.getConfigurationStringValue(e, t)
                                                    }, d.isRemoteConfigsReady = function() {
                                                        return A.isRemoteConfigsReady()
                                                    }, d.addRemoteConfigsListener = function(e) {
                                                        A.addRemoteConfigsListener(e)
                                                    }, d.removeRemoteConfigsListener = function(e) {
                                                        A.removeRemoteConfigsListener(e)
                                                    }, d.getRemoteConfigsContentAsString = function() {
                                                        return A.getRemoteConfigsContentAsString()
                                                    }, d.getABTestingId = function() {
                                                        return A.getABTestingId()
                                                    }, d.getABTestingVariantId = function() {
                                                        return A.getABTestingVariantId()
                                                    }, d.addOnBeforeUnloadListener = function(e) {
                                                        A.addOnBeforeUnloadListener(e)
                                                    }, d.removeOnBeforeUnloadListener = function(e) {
                                                        A.removeOnBeforeUnloadListener(e)
                                                    }, d.internalInitialize = function() {
                                                        A.ensurePersistedStates(), i.setItem(A.getGameKey(), A.DefaultUserIdKey, A.getDefaultId()), A.setInitialized(!0), d.newSession(), A.isEnabled() && t.ensureEventQueueIsRunning()
                                                    }, d.newSession = function() {
                                                        r.i("Starting a new session."), A.validateAndFixCurrentDimensions(), o.instance.requestInit(A.instance.configsHash, d.startNewSessionCallback)
                                                    }, d.startNewSessionCallback = function(e, n) {
                                                        if (e !== u.Ok && e !== u.Created || !n) e == u.Unauthorized ? (r.w("Initialize SDK failed - Unauthorized"), A.instance.initAuthorized = !1) : (e === u.NoResponse || e === u.RequestTimeout ? r.i("Init call (session start) failed - no response. Could be offline or timeout.") : e === u.BadResponse || e === u.JsonEncodeFailed || e === u.JsonDecodeFailed ? r.i("Init call (session start) failed - bad response. Could be bad response from proxy or GA servers.") : e !== u.BadRequest && e !== u.UnknownResponseCode || r.i("Init call (session start) failed - bad request or unknown response."), null == A.instance.sdkConfig ? null != A.instance.sdkConfigCached ? (r.i("Init call (session start) failed - using cached init values."), A.instance.sdkConfig = A.instance.sdkConfigCached) : (r.i("Init call (session start) failed - using default init values."), A.instance.sdkConfig = A.instance.sdkConfigDefault) : r.i("Init call (session start) failed - using cached init values."), A.instance.initAuthorized = !0);
                                                        else {
                                                            var o = 0;
                                                            if (n.server_ts) {
                                                                var a = n.server_ts;
                                                                o = A.calculateServerTimeOffset(a)
                                                            }
                                                            if (n.time_offset = o, e != u.Created) {
                                                                var s = A.getSdkConfig();
                                                                s.configs && (n.configs = s.configs), s.configs_hash && (n.configs_hash = s.configs_hash), s.ab_id && (n.ab_id = s.ab_id), s.ab_variant_id && (n.ab_variant_id = s.ab_variant_id)
                                                            }
                                                            A.instance.configsHash = n.configs_hash ? n.configs_hash : "", A.instance.abId = n.ab_id ? n.ab_id : "", A.instance.abVariantId = n.ab_variant_id ? n.ab_variant_id : "", i.setItem(A.getGameKey(), A.SdkConfigCachedKey, c.encode64(JSON.stringify(n))), A.instance.sdkConfigCached = n, A.instance.sdkConfig = n, A.instance.initAuthorized = !0
                                                        }
                                                        if (A.instance.clientServerTimeOffset = A.getSdkConfig().time_offset ? A.getSdkConfig().time_offset : 0, A.populateConfigurations(A.getSdkConfig()), !A.isEnabled()) return r.w("Could not start session: SDK is disabled."), void t.stopEventQueue();
                                                        t.ensureEventQueueIsRunning();
                                                        var f = c.createGuid();
                                                        A.instance.sessionId = f, A.instance.sessionStart = A.getClientTsAdjusted(), l.addSessionStartEvent();
                                                        var g = t.getTimedBlockById(d.initTimedBlockId);
                                                        null != g && (g.running = !1), d.initTimedBlockId = -1
                                                    }, d.resumeSessionAndStartQueue = function() {
                                                        A.isInitialized() && (r.i("Resuming session."), A.sessionIsStarted() || d.newSession())
                                                    }, d.isSdkReady = function(e, t, n) {
                                                        return void 0 === t && (t = !0), void 0 === n && (n = ""), n && (n += ": "), e && !A.isInitialized() ? (t && r.w(n + "SDK is not initialized"), !1) : e && !A.isEnabled() ? (t && r.w(n + "SDK is disabled"), !1) : !(e && !A.sessionIsStarted() && (t && r.w(n + "Session has not started yet"), 1))
                                                    }, d.initTimedBlockId = -1, d.methodMap = {}, d
                                                }();
                                            e.GameAnalytics = d
                                        }(o || (o = {})), o.GameAnalytics.init(), o.GameAnalytics.gaCommand, e.exports = o
                                }
                            },
                            n = {};

                        function r(t) {
                            var i = n[t];
                            if (void 0 !== i) return i.exports;
                            var A = n[t] = {
                                exports: {}
                            };
                            return e[t](A, A.exports, r), A.exports
                        }
                        r.g = function() {
                            if ("object" == typeof globalThis) return globalThis;
                            try {
                                return this || new Function("return this")()
                            } catch (e) {
                                if ("object" == typeof window) return window
                            }
                        }();
                        var i = r(579),
                            A = t;
                        for (var o in i) A[o] = i[o];
                        i.__esModule && Object.defineProperty(A, "__esModule", {
                            value: !0
                        })
                    })()
                },
                5666: e => {
                    var t = function(e) {
                        "use strict";
                        var t, n = Object.prototype,
                            r = n.hasOwnProperty,
                            i = "function" == typeof Symbol ? Symbol : {},
                            A = i.iterator || "@@iterator",
                            o = i.asyncIterator || "@@asyncIterator",
                            a = i.toStringTag || "@@toStringTag";

                        function s(e, t, n) {
                            return Object.defineProperty(e, t, {
                                value: n,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }), e[t]
                        }
                        try {
                            s({}, "")
                        } catch (e) {
                            s = function(e, t, n) {
                                return e[t] = n
                            }
                        }

                        function u(e, t, n, r) {
                            var i = t && t.prototype instanceof v ? t : v,
                                A = Object.create(i.prototype),
                                o = new R(r || []);
                            return A._invoke = function(e, t, n) {
                                var r = l;
                                return function(i, A) {
                                    if (r === f) throw new Error("Generator is already running");
                                    if (r === g) {
                                        if ("throw" === i) throw A;
                                        return P()
                                    }
                                    for (n.method = i, n.arg = A;;) {
                                        var o = n.delegate;
                                        if (o) {
                                            var a = S(o, n);
                                            if (a) {
                                                if (a === I) continue;
                                                return a
                                            }
                                        }
                                        if ("next" === n.method) n.sent = n._sent = n.arg;
                                        else if ("throw" === n.method) {
                                            if (r === l) throw r = g, n.arg;
                                            n.dispatchException(n.arg)
                                        } else "return" === n.method && n.abrupt("return", n.arg);
                                        r = f;
                                        var s = c(e, t, n);
                                        if ("normal" === s.type) {
                                            if (r = n.done ? g : d, s.arg === I) continue;
                                            return {
                                                value: s.arg,
                                                done: n.done
                                            }
                                        }
                                        "throw" === s.type && (r = g, n.method = "throw", n.arg = s.arg)
                                    }
                                }
                            }(e, n, o), A
                        }

                        function c(e, t, n) {
                            try {
                                return {
                                    type: "normal",
                                    arg: e.call(t, n)
                                }
                            } catch (e) {
                                return {
                                    type: "throw",
                                    arg: e
                                }
                            }
                        }
                        e.wrap = u;
                        var l = "suspendedStart",
                            d = "suspendedYield",
                            f = "executing",
                            g = "completed",
                            I = {};

                        function v() {}

                        function h() {}

                        function p() {}
                        var y = {};
                        s(y, A, (function() {
                            return this
                        }));
                        var m = Object.getPrototypeOf,
                            C = m && m(m(O([])));
                        C && C !== n && r.call(C, A) && (y = C);
                        var E = p.prototype = v.prototype = Object.create(y);

                        function b(e) {
                            ["next", "throw", "return"].forEach((function(t) {
                                s(e, t, (function(e) {
                                    return this._invoke(t, e)
                                }))
                            }))
                        }

                        function w(e, t) {
                            function n(i, A, o, a) {
                                var s = c(e[i], e, A);
                                if ("throw" !== s.type) {
                                    var u = s.arg,
                                        l = u.value;
                                    return l && "object" == typeof l && r.call(l, "__await") ? t.resolve(l.__await).then((function(e) {
                                        n("next", e, o, a)
                                    }), (function(e) {
                                        n("throw", e, o, a)
                                    })) : t.resolve(l).then((function(e) {
                                        u.value = e, o(u)
                                    }), (function(e) {
                                        return n("throw", e, o, a)
                                    }))
                                }
                                a(s.arg)
                            }
                            var i;
                            this._invoke = function(e, r) {
                                function A() {
                                    return new t((function(t, i) {
                                        n(e, r, t, i)
                                    }))
                                }
                                return i = i ? i.then(A, A) : A()
                            }
                        }

                        function S(e, n) {
                            var r = e.iterator[n.method];
                            if (r === t) {
                                if (n.delegate = null, "throw" === n.method) {
                                    if (e.iterator.return && (n.method = "return", n.arg = t, S(e, n), "throw" === n.method)) return I;
                                    n.method = "throw", n.arg = new TypeError("The iterator does not provide a 'throw' method")
                                }
                                return I
                            }
                            var i = c(r, e.iterator, n.arg);
                            if ("throw" === i.type) return n.method = "throw", n.arg = i.arg, n.delegate = null, I;
                            var A = i.arg;
                            return A ? A.done ? (n[e.resultName] = A.value, n.next = e.nextLoc, "return" !== n.method && (n.method = "next", n.arg = t), n.delegate = null, I) : A : (n.method = "throw", n.arg = new TypeError("iterator result is not an object"), n.delegate = null, I)
                        }

                        function k(e) {
                            var t = {
                                tryLoc: e[0]
                            };
                            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
                        }

                        function D(e) {
                            var t = e.completion || {};
                            t.type = "normal", delete t.arg, e.completion = t
                        }

                        function R(e) {
                            this.tryEntries = [{
                                tryLoc: "root"
                            }], e.forEach(k, this), this.reset(!0)
                        }

                        function O(e) {
                            if (e) {
                                var n = e[A];
                                if (n) return n.call(e);
                                if ("function" == typeof e.next) return e;
                                if (!isNaN(e.length)) {
                                    var i = -1,
                                        o = function n() {
                                            for (; ++i < e.length;)
                                                if (r.call(e, i)) return n.value = e[i], n.done = !1, n;
                                            return n.value = t, n.done = !0, n
                                        };
                                    return o.next = o
                                }
                            }
                            return {
                                next: P
                            }
                        }

                        function P() {
                            return {
                                value: t,
                                done: !0
                            }
                        }
                        return h.prototype = p, s(E, "constructor", p), s(p, "constructor", h), h.displayName = s(p, a, "GeneratorFunction"), e.isGeneratorFunction = function(e) {
                            var t = "function" == typeof e && e.constructor;
                            return !!t && (t === h || "GeneratorFunction" === (t.displayName || t.name))
                        }, e.mark = function(e) {
                            return Object.setPrototypeOf ? Object.setPrototypeOf(e, p) : (e.__proto__ = p, s(e, a, "GeneratorFunction")), e.prototype = Object.create(E), e
                        }, e.awrap = function(e) {
                            return {
                                __await: e
                            }
                        }, b(w.prototype), s(w.prototype, o, (function() {
                            return this
                        })), e.AsyncIterator = w, e.async = function(t, n, r, i, A) {
                            void 0 === A && (A = Promise);
                            var o = new w(u(t, n, r, i), A);
                            return e.isGeneratorFunction(n) ? o : o.next().then((function(e) {
                                return e.done ? e.value : o.next()
                            }))
                        }, b(E), s(E, a, "Generator"), s(E, A, (function() {
                            return this
                        })), s(E, "toString", (function() {
                            return "[object Generator]"
                        })), e.keys = function(e) {
                            var t = [];
                            for (var n in e) t.push(n);
                            return t.reverse(),
                                function n() {
                                    for (; t.length;) {
                                        var r = t.pop();
                                        if (r in e) return n.value = r, n.done = !1, n
                                    }
                                    return n.done = !0, n
                                }
                        }, e.values = O, R.prototype = {
                            constructor: R,
                            reset: function(e) {
                                if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(D), !e)
                                    for (var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = t)
                            },
                            stop: function() {
                                this.done = !0;
                                var e = this.tryEntries[0].completion;
                                if ("throw" === e.type) throw e.arg;
                                return this.rval
                            },
                            dispatchException: function(e) {
                                if (this.done) throw e;
                                var n = this;

                                function i(r, i) {
                                    return a.type = "throw", a.arg = e, n.next = r, i && (n.method = "next", n.arg = t), !!i
                                }
                                for (var A = this.tryEntries.length - 1; A >= 0; --A) {
                                    var o = this.tryEntries[A],
                                        a = o.completion;
                                    if ("root" === o.tryLoc) return i("end");
                                    if (o.tryLoc <= this.prev) {
                                        var s = r.call(o, "catchLoc"),
                                            u = r.call(o, "finallyLoc");
                                        if (s && u) {
                                            if (this.prev < o.catchLoc) return i(o.catchLoc, !0);
                                            if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                                        } else if (s) {
                                            if (this.prev < o.catchLoc) return i(o.catchLoc, !0)
                                        } else {
                                            if (!u) throw new Error("try statement without catch or finally");
                                            if (this.prev < o.finallyLoc) return i(o.finallyLoc)
                                        }
                                    }
                                }
                            },
                            abrupt: function(e, t) {
                                for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                    var i = this.tryEntries[n];
                                    if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                                        var A = i;
                                        break
                                    }
                                }
                                A && ("break" === e || "continue" === e) && A.tryLoc <= t && t <= A.finallyLoc && (A = null);
                                var o = A ? A.completion : {};
                                return o.type = e, o.arg = t, A ? (this.method = "next", this.next = A.finallyLoc, I) : this.complete(o)
                            },
                            complete: function(e, t) {
                                if ("throw" === e.type) throw e.arg;
                                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), I
                            },
                            finish: function(e) {
                                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                    var n = this.tryEntries[t];
                                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), D(n), I
                                }
                            },
                            catch: function(e) {
                                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                                    var n = this.tryEntries[t];
                                    if (n.tryLoc === e) {
                                        var r = n.completion;
                                        if ("throw" === r.type) {
                                            var i = r.arg;
                                            D(n)
                                        }
                                        return i
                                    }
                                }
                                throw new Error("illegal catch attempt")
                            },
                            delegateYield: function(e, n, r) {
                                return this.delegate = {
                                    iterator: O(e),
                                    resultName: n,
                                    nextLoc: r
                                }, "next" === this.method && (this.arg = t), I
                            }
                        }, e
                    }(e.exports);
                    try {
                        regeneratorRuntime = t
                    } catch (e) {
                        "object" == typeof globalThis ? globalThis.regeneratorRuntime = t : Function("r", "regeneratorRuntime = r")(t)
                    }
                }
            },
            t = {};

        function n(r) {
            var i = t[r];
            if (void 0 !== i) return i.exports;
            var A = t[r] = {
                exports: {}
            };
            return e[r](A, A.exports, n), A.exports
        }
        return n.d = (e, t) => {
            for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            })
        }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, n(7130)
    })()
}));
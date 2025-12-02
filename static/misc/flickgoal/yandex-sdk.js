var YaGames;
(() => {
    "use strict";
    var e = {
            31: (e, t, n) => {
                n.d(t, {
                    i: () => a
                });
                var r = n(719);
                const a = {
                    I18n: () => ({
                        type: r.tT,
                        action: r.X2.i18n
                    })
                }
            },
            393: (e, t, n) => {
                n.d(t, {
                    jG: () => a,
                    X$: () => i,
                    qs: () => U,
                    uQ: () => l,
                    sC: () => o,
                    Aw: () => u,
                    TT: () => G,
                    u8: () => h,
                    N3: () => y,
                    VT: () => _,
                    _X: () => N,
                    E0: () => D,
                    qf: () => $,
                    X0: () => Y,
                    Bz: () => A,
                    OI: () => T,
                    Xk: () => F,
                    cp: () => H,
                    $J: () => O,
                    Rh: () => v,
                    S: () => b,
                    Qq: () => E,
                    jt: () => B,
                    sF: () => k,
                    Al: () => L,
                    Gd: () => x,
                    yH: () => X,
                    HT: () => C,
                    Uh: () => z,
                    Vo: () => Z,
                    ce: () => j,
                    $4: () => M,
                    TI: () => W,
                    Sd: () => K,
                    _W: () => ee,
                    Ry: () => R,
                    lW: () => ne,
                    rS: () => ae,
                    Iq: () => re,
                    Vw: () => V,
                    XT: () => oe,
                    eU: () => ie
                });
                var r = n(719);
                const a = {
                        GetList: e => ({
                            action: "getList",
                            type: r.y0,
                            data: e
                        }),
                        GetProgress: e => ({
                            action: "getProgress",
                            type: r.y0,
                            data: e
                        }),
                        SetProgress: e => ({
                            action: "setProgress",
                            type: r.y0,
                            data: e
                        })
                    },
                    o = {
                        CheckAvailability: e => ({
                            type: "availability-methods",
                            action: "check-availability",
                            data: e
                        })
                    },
                    s = "adv-manager",
                    i = {
                        GetDisabledState: () => ({
                            type: s,
                            action: "get-disabled-state"
                        }),
                        AdvShowFullscreen: () => ({
                            type: s,
                            action: "adv-show-fullscreen",
                            timeout: 1e4
                        }),
                        AdvShowRewardedVideo: () => ({
                            type: s,
                            action: "adv-show-rewarded-video",
                            timeout: 1e4
                        }),
                        AdvShowStickyBanner: () => ({
                            type: s,
                            action: "adv-show-sticky-banner",
                            timeout: 3e3
                        }),
                        AdvHideStickyBanner: () => ({
                            type: s,
                            action: "adv-hide-sticky-banner",
                            timeout: 3e3
                        }),
                        AdvStatusStickyBanner: () => ({
                            type: s,
                            action: "adv-status-sticky-banner",
                            timeout: 3e3
                        })
                    },
                    c = "auth",
                    l = {
                        AuthDialogSuccess: e => ({
                            type: c,
                            action: "auth-dialog-success",
                            data: e
                        }),
                        AuthDialogOpen: () => ({
                            type: c,
                            action: "auth-dialog-open",
                            data: {
                                initializer: "auth-manager-public"
                            }
                        }),
                        HasAuth: () => ({
                            type: c,
                            action: "has-auth"
                        })
                    },
                    d = "bonuses",
                    u = {
                        Catalog: e => ({
                            type: d,
                            action: "catalog",
                            data: e
                        }),
                        Consume: e => ({
                            type: d,
                            action: "consume",
                            data: e
                        }),
                        PlayerBonuses: e => ({
                            type: d,
                            action: "player-bonuses",
                            data: e
                        })
                    },
                    h = {
                        WriteText: e => ({
                            type: "clipboard",
                            action: "write-text",
                            data: e
                        })
                    },
                    p = "document-events";
                var m, g = ((m = g || {}).Click = `click${r.ej}`, m.Dblclick = `dblclick${r.ej}`, m.Mouseup = `mouseup${r.ej}`, m.Pointerup = `pointerup${r.ej}`, m.Touchend = `touchend${r.ej}`, m);
                const y = {
                        ClickOnBody: () => ({
                            type: p,
                            action: g.Click
                        }),
                        DblclickOnBody: () => ({
                            type: p,
                            action: g.Dblclick
                        }),
                        MouseupOnBody: () => ({
                            type: p,
                            action: g.Mouseup
                        }),
                        PointerupOnBody: () => ({
                            type: p,
                            action: g.Pointerup
                        }),
                        TouchendOnBody: () => ({
                            type: p,
                            action: g.Touchend
                        })
                    },
                    f = "get-games";
                const v = {
                        All: () => ({
                            type: f,
                            action: "all"
                        }),
                        Game: e => ({
                            type: f,
                            action: "game",
                            data: {
                                app_id: e
                            }
                        })
                    },
                    w = "leaderboard",
                    b = {
                        Description: e => ({
                            type: w,
                            action: "description",
                            data: e
                        }),
                        Entries: e => ({
                            type: w,
                            action: "entries",
                            data: e
                        }),
                        PlayerEntry: e => ({
                            type: w,
                            action: "player-entry",
                            data: e
                        }),
                        Score: e => ({
                            type: w,
                            action: "score",
                            data: e
                        }),
                        Stat: e => ({
                            type: w,
                            action: "stat",
                            data: e
                        })
                    },
                    P = "local-storage",
                    E = {
                        GetAll: () => ({
                            type: P,
                            action: "get-all"
                        }),
                        Clear: () => ({
                            type: P,
                            action: "clear"
                        }),
                        Del: e => ({
                            type: P,
                            action: "del",
                            data: {
                                key: e
                            }
                        }),
                        Set: (e, t) => ({
                            type: P,
                            action: "set",
                            data: {
                                key: e,
                                value: t
                            }
                        }),
                        Backup: e => ({
                            type: P,
                            action: "backup",
                            data: e
                        })
                    },
                    S = "metrika",
                    k = {
                        ReachGoal: e => ({
                            type: S,
                            action: "reachGoal",
                            data: e
                        }),
                        Params: e => ({
                            type: S,
                            action: "params",
                            data: e
                        })
                    },
                    A = e => ({
                        type: "game-call-alert",
                        data: e
                    }),
                    T = (e, t) => ({
                        type: "game-measuring",
                        action: e,
                        data: t
                    }),
                    O = (e, t) => ({
                        action: e,
                        type: r.Tn,
                        data: t
                    }),
                    I = "feedback",
                    D = {
                        CanReview: () => ({
                            type: I,
                            action: "can-review"
                        }),
                        RequestReview: () => ({
                            type: I,
                            action: "request-review"
                        })
                    };
                const x = () => ({
                        type: "options",
                        action: "get"
                    }),
                    _ = () => ({
                        type: "environment",
                        action: "get",
                        params: {
                            withOptions: !0
                        }
                    }),
                    C = e => ({
                        type: "player",
                        action: "get",
                        data: e
                    }),
                    L = () => ({
                        type: "notifications",
                        action: "allow"
                    }),
                    R = e => ({
                        type: "foolproof-sdk-init",
                        data: e
                    }),
                    F = e => ({
                        type: "game-reporter",
                        action: "plugin_engine_data",
                        data: e
                    }),
                    N = e => ({
                        type: "error",
                        data: e
                    }),
                    G = e => ({
                        type: "csp",
                        action: "violation",
                        data: e
                    }),
                    $ = () => ({
                        type: "frame",
                        action: r.ur.IframeLoaded
                    }),
                    j = () => {
                        var e;
                        return {
                            type: "sdk-bundle-start",
                            data: {
                                time: Date.now(),
                                sdkVersion: "v2",
                                sdkBundle: null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.APP_VERSION,
                                isSdkLoader: Boolean(window.isSdkLoader)
                            }
                        }
                    },
                    M = e => ({
                        type: "sdk-debug-log",
                        data: e
                    }),
                    U = e => ({
                        type: "alert",
                        error: e
                    }),
                    B = () => ({
                        type: "longtask"
                    }),
                    Y = () => ({
                        type: "longtask_frame_ready"
                    }),
                    V = () => ({
                        type: "user-action"
                    }),
                    H = e => ({
                        type: "game-stats",
                        data: e
                    }),
                    K = () => ({
                        type: "sdk_initialization",
                        data: {
                            initialized: !0
                        }
                    }),
                    W = (e, t) => ({
                        type: r.Ul,
                        action: e,
                        data: t
                    }),
                    q = "payments",
                    X = {
                        GetCatalog: e => ({
                            type: q,
                            action: "get-catalog",
                            data: e
                        }),
                        GetEnv: () => ({
                            type: q,
                            action: "get-env"
                        }),
                        GetPurchases: e => ({
                            type: q,
                            action: "get-purchases",
                            data: e
                        }),
                        PurchaseStart: e => ({
                            type: q,
                            action: "purchase-start",
                            data: e
                        }),
                        PurchaseConsume: e => ({
                            type: q,
                            action: "purchase-consume",
                            data: e
                        }),
                        PurchaseDialogInit: () => ({
                            type: q,
                            action: "purchase-dialog-init"
                        }),
                        PurchaseDialogOpen: () => ({
                            type: q,
                            action: "purchase-dialog-open"
                        }),
                        PurchaseDialogShow: e => ({
                            type: q,
                            action: "purchase-dialog-show",
                            data: e
                        }),
                        PurchaseDialogError: e => ({
                            type: q,
                            action: "purchase-dialog-error",
                            data: e
                        }),
                        PurchaseDialogClose: () => ({
                            type: q,
                            action: "purchase-dialog-close"
                        }),
                        GetGamePurchaseEnabled: () => ({
                            type: q,
                            action: "get-game-purchase-enabled"
                        })
                    },
                    J = "player-info",
                    z = {
                        GetData: e => ({
                            type: J,
                            action: "get-data",
                            data: e
                        }),
                        IdsPerGame: e => ({
                            type: J,
                            action: "ids-per-game",
                            data: e
                        }),
                        IncrementStats: e => ({
                            type: J,
                            action: "increment-stats",
                            data: e
                        }),
                        SetData: e => ({
                            type: J,
                            action: "set-data",
                            data: e
                        }),
                        SetStats: e => ({
                            type: J,
                            action: "set-stats",
                            data: e
                        }),
                        Stats: e => ({
                            type: J,
                            action: "stats",
                            data: e
                        })
                    },
                    Q = "screen-manager",
                    Z = {
                        ExitFullscreen: () => ({
                            type: Q,
                            action: "exit-fullscreen"
                        }),
                        RequestFullscreen: () => ({
                            type: Q,
                            action: "request-fullscreen"
                        }),
                        ToggleFullscreen: () => ({
                            type: Q,
                            action: "toggle-fullscreen"
                        }),
                        GetState: () => ({
                            type: Q,
                            action: "get-state"
                        })
                    },
                    ee = {
                        ListenersChange: e => ({
                            type: "sdk-internal-event",
                            action: "listeners-change",
                            data: e
                        })
                    },
                    te = "shortcut-manager",
                    ne = {
                        ShowPrompt: () => ({
                            type: te,
                            action: "show-prompt"
                        }),
                        CanShowPrompt: () => ({
                            type: te,
                            action: "can-show-prompt"
                        })
                    },
                    re = e => ({
                        type: "sdk-stats",
                        data: e
                    }),
                    ae = e => ({
                        type: "telegram",
                        data: e
                    }),
                    oe = {
                        Fetch: e => ({
                            type: "varioqub",
                            action: "fetch",
                            data: e
                        })
                    },
                    se = "yaMetrikaCounter",
                    ie = {
                        ReachGoal: e => ({
                            type: se,
                            action: "reachGoal",
                            data: e
                        }),
                        Hit: e => ({
                            type: se,
                            action: "hit",
                            data: e
                        })
                    };
                n(31)
            },
            719: (e, t, n) => {
                n.d(t, {
                    y0: () => s,
                    tT: () => f,
                    ej: () => p,
                    X2: () => v,
                    VR: () => r,
                    BE: () => h,
                    ur: () => a,
                    Fs: () => y,
                    q1: () => b,
                    Tn: () => d,
                    US: () => i,
                    cV: () => m,
                    Ul: () => w,
                    Hn: () => o
                });
                var r = (e => (e.AudioAPI = "AudioAPI", e.GameplayAPI = "GameplayAPI", e.GamesAPI = "GamesAPI", e.LoadingAPI = "LoadingAPI", e.PluginEngineDataReporterAPI = "PluginEngineDataReporterAPI", e))(r || {}),
                    a = (e => (e.GameInit = "loading_api_game_init", e.GameReady = "loading_api_game_ready", e.GameReadyForce = "loading_api_game_ready_force", e.IframeAdded = "loading_api_iframe_added", e.IframeError = "loading_api_iframe_resources_error", e.IframeLoaded = "loading_api_iframe_resources_loaded", e.ScriptInit = "loading_api_script_init", e.TTIReady = "loading_api_tti_ready", e))(a || {});
                const o = ["GameplayAPI", "LoadingAPI", "PluginEngineDataReporterAPI"],
                    s = "achv-manager",
                    i = "game_api";
                var c, l = ((c = l || {}).Pause = `${i}_pause`, c.Resume = `${i}_resume`, c);
                const d = "gameplay_api";
                var u, h = ((u = h || {}).Start = `${d}_start`, u.Stop = `${d}_stop`, u);
                const p = "-on-body",
                    m = "screen_recorder";
                var g, y = ((g = y || {}).Start = `${m}_start`, g.Stop = `${m}_stop`, g);
                const f = "debug-panel";
                var v = (e => (e.i18n = "i18n", e))(v || {});
                const w = "sdk-event";
                var b = (e => (e.BONUS_AWARDED = "BONUS_AWARDED", e.EXIT = "EXIT", e.HISTORY_BACK = "HISTORY_BACK", e))(b || {})
            },
            754: (e, t, n) => {
                n.d(t, {
                    T: () => c,
                    f: () => i
                });
                var r = n(303),
                    a = n(998),
                    o = n(89);

                function s(e, t, n) {
                    "YaGames" in window || console.warn("Don't use logSDKError or logSDKGameError outside SDK");
                    const r = (0, a.U)(e, t, n);
                    r && o.F.postToParent({
                        data: r,
                        type: "error"
                    }).catch(console.warn)
                }

                function i(e, t = {}) {
                    s("sdk", e, t), console.warn(e)
                }

                function c(e, t = {}) {
                    s("sdk-game", e, t), console.error(e, r.X4)
                }
            },
            998: (e, t, n) => {
                n.d(t, {
                    U: () => m
                });
                var r = n(399),
                    a = Object.defineProperty,
                    o = Object.defineProperties,
                    s = Object.getOwnPropertyDescriptors,
                    i = Object.getOwnPropertySymbols,
                    c = Object.prototype.hasOwnProperty,
                    l = Object.prototype.propertyIsEnumerable,
                    d = (e, t, n) => t in e ? a(e, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: n
                    }) : e[t] = n,
                    u = (e, t) => {
                        for (var n in t || (t = {})) c.call(t, n) && d(e, n, t[n]);
                        if (i)
                            for (var n of i(t)) l.call(t, n) && d(e, n, t[n]);
                        return e
                    },
                    h = (e, t) => o(e, s(t));
                const p = [/Adv was delayed on/];

                function m(e, t, n) {
                    var a, o, s;
                    const i = function (e, t) {
                        var n, r, a, o;
                        const s = {
                            columnNumber: null != (n = e.columnNumber) ? n : -1,
                            fileName: e.fileName || "",
                            lineNumber: null != (r = e.lineNumber) ? r : -1,
                            name: e.name || "Error",
                            message: e.message || String(e),
                            stack: (null == (a = e.stack) ? void 0 : a.slice(0, 4e5)) || ""
                        };
                        return s.additional = h(u(u({}, e.additional), t.additional), {
                            version: parseInt((null == (o = window.YandexGamesSDKEnvironment) ? void 0 : o.APP_VERSION) || "0")
                        }), s
                    }(t, n);
                    return c = i.message, p.some((e => e.test(c))) ? null : (n.message && (i.message = n.message), n.prefix && (i.message = `${n.prefix} ${i.message}`), {
                        block: `ErrorCounter/common: ${e}`,
                        error: i,
                        level: null != (a = n.level) ? a : "error",
                        source: e,
                        sourceMethod: null != (o = n.sourceMethod) ? o : (0, r.Z)(i.stack),
                        type: null != (s = n.type) ? s : "error"
                    });
                    var c
                }
            },
            498: (e, t, n) => {
                n.d(t, {
                    o: () => a
                });
                var r = n(754);

                function a() {
                    var e, t;
                    if ("undefined" == typeof window) return "";
                    const n = (null == (t = null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.app) ? void 0 : t.id) || "";
                    return n || (0, r.f)(new Error("Can not get appId from environment")), n
                }
            },
            280: (e, t, n) => {
                n.d(t, {
                    Z: () => c
                });
                var r = n(393),
                    a = n(754),
                    o = n(498),
                    s = n(89);
                const i = Object.create(null);
                const c = {
                    gameSessionUID: "",
                    init() {},
                    sendOnceDeprecatedUsage(e) {
                        var t;
                        e in i || (i[e] = 1, this.params({
                            borrowParams: {
                                sdkDeprecatedUsage: {
                                    key: e,
                                    appId: (0, o.o)()
                                }
                            },
                            service: "undefined" == typeof window ? "unknown" : (null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.serviceName) || "unknown"
                        }))
                    },
                    params(e) {
                        s.F.hasParent() && s.F.postToParent(r.sF.Params(e)).catch((e => {
                            (0, a.f)(e)
                        }))
                    },
                    reachGoal(e, t, n) {
                        s.F.hasParent() && s.F.postToParent(r.sF.ReachGoal({
                            data: t,
                            goal: e,
                            params: n
                        })).catch((e => {
                            (0, a.f)(e)
                        }))
                    }
                }
            },
            89: (e, t, n) => {
                n.d(t, {
                    F: () => c
                });
                const r = e => void 0 !== e ? String(e) : e;
                class a extends Error {
                    constructor(e, t, n) {
                        super(e), this.code = t, this.httpStatus = n
                    }
                }
                class o {
                    constructor() {
                        this.promises = {}, this.listeners = {}, this.callbacks = {}, this.addEventListener()
                    }
                    onExternalMessage(e, t) {
                        this._onMessage(this.listeners, e, t)
                    }
                    offExternalMessage(e, t) {
                        this._offMessage(this.listeners, e, t)
                    }
                    addEventListener() {
                        window.addEventListener("message", (e => {
                            this.checkExternalEvent(e) && this.handleEvent(e)
                        }))
                    }
                    deletePromise(e) {
                        this.clearPromiseWaitTimeout(e), delete this.promises[e]
                    }
                    clearPromiseWaitTimeout(e) {
                        const t = this.promises[e];
                        (null == t ? void 0 : t.timeoutId) && (window.clearTimeout(t.timeoutId), delete t.timeoutId)
                    }
                    getExternalCallback(e) {
                        const {
                            type: t,
                            action: n,
                            messageId: r,
                            payload: a
                        } = e.data || {};
                        if (this.callbacks[r]) return this.callbacks[r];
                        return this.callbacks[r] = (e = {}) => {
                            const o = {
                                type: e.type || t,
                                action: e.action || n,
                                originMessageId: r,
                                originPayload: a,
                                data: e.data || {}
                            };
                            ! function (e, t) {
                                t.error && (e.error = String(t.error.message) || null, e.errorJSON = JSON.stringify(t.error) || null)
                            }(o, e), this.postCallback(o), this.callbacks[r] = () => {}
                        }, this.callbacks[r]
                    }
                    handleEvent(e) {
                        const {
                            type: t,
                            action: n,
                            originMessageId: r,
                            originPayload: a,
                            data: o,
                            error: s,
                            errorJSON: i
                        } = e.data || {}, c = this.promises[r];
                        c && (this.deletePromise(r), void 0 === s ? c.resolve({
                            type: t,
                            action: n,
                            originPayload: a,
                            data: o
                        }) : c.reject(this.createErrorInstance(s, i)));
                        const l = this.getExternalCallback(e),
                            d = this.listeners[t] || [];
                        for (const t of d) try {
                            t(e, l)
                        } catch (e) {
                            this.logError({
                                prefix: "[Messaging]",
                                sourceMethod: "_handleEvent"
                            }, e)
                        }
                        return e
                    }
                    createErrorInstance(e, t) {
                        if (t) try {
                            const {
                                message: e,
                                code: n,
                                httpStatus: o
                            } = JSON.parse(t);
                            if (e) return new a(e, r(n), r(o))
                        } catch (e) {}
                        return new Error(e || "Undefined error message")
                    }
                    checkExternalEvent(e) {
                        var t;
                        return "YandexGamesSDK" === (null == (t = e.data) ? void 0 : t.source)
                    }
                    _offMessage(e, t, n) {
                        if ("string" == typeof t && (t = [t]), !Array.isArray(t)) throw new Error('Wrong argument "types"');
                        for (const r of t) r in e && (e[r] = e[r].filter((e => e !== n)))
                    }
                    _onMessage(e, t, n) {
                        if ("string" == typeof t && (t = [t]), !Array.isArray(t)) throw new Error('Wrong argument "types"');
                        for (const r of t) r in e || (e[r] = []), e[r].push(n)
                    }
                    _post(e, t) {
                        const n = Date.now(),
                            r = `${n}-${Math.random()}`;
                        t = Object.assign({}, t, {
                            source: "YandexGamesSDK",
                            messageId: r
                        });
                        let a = e => {},
                            o = e => {};
                        const s = new Promise(((e, t) => {
                            a = e, o = t
                        }));
                        this.promises[r] = {
                            promise: s,
                            resolve: a,
                            reject: o,
                            time: n
                        };
                        try {
                            e.postMessage(function (e, t) {
                                if ("function" == typeof structuredClone) try {
                                    return structuredClone(e), e
                                } catch (n) {
                                    return t({
                                        block: "Utils",
                                        message: "Error structuredClone operation",
                                        additional: {
                                            error: n
                                        }
                                    }, n), e
                                }
                                return e
                            }(t, this.logError.bind(this)), "*")
                        } catch (e) {
                            return this.deletePromise(r), Promise.reject(e)
                        }
                        if ("timeout" in t) {
                            const {
                                timeout: e
                            } = t;
                            "number" == typeof e && e > 0 ? this.promises[r].timeoutId = window.setTimeout((() => {
                                this.deletePromise(r);
                                const e = new Error("Message rejected by timeout");
                                e.additional = {
                                    type: t.type,
                                    action: t.action
                                }, o(e)
                            }), e) : this.logError({
                                prefix: "[Messaging]",
                                sourceMethod: "_post",
                                additional: {
                                    type: t.type,
                                    action: t.action
                                }
                            }, new Error("Wrong timeout value"))
                        }
                        return s
                    }
                }
                var s = n(998);
                class i extends o {
                    constructor() {
                        if (i.instance) return i.instance;
                        super(), i.instance = this
                    }
                    get _parentTarget() {
                        return window.parent !== window ? window.parent : void 0
                    }
                    hasParent() {
                        return Boolean(this._parentTarget)
                    }
                    postToParent(e) {
                        const t = this._parentTarget;
                        return t ? this._post(t, e) : Promise.resolve()
                    }
                    postCallback(e) {
                        const t = this._parentTarget;
                        return t ? this._post(t, e) : Promise.resolve()
                    }
                    logError(e, t) {
                        const n = (0, s.U)("sdk", t, e);
                        n && this.postToParent({
                            data: n,
                            type: "error"
                        }).catch(console.warn)
                    }
                }
                const c = new i
            },
            303: (e, t, n) => {
                n.d(t, {
                    NA: () => o,
                    O6: () => a,
                    U0: () => r,
                    X4: () => c,
                    _h: () => i,
                    f9: () => s
                });
                const r = "%TLD%",
                    a = "%DOMAIN_NAME%";
                var o = (e => (e.CON = "CON", e.HOP = "HOP", e.RUB = "РУБ", e.TST = "TST", e.YAN = "YAN", e))(o || {}),
                    s = (e => (e.BIG = "big", e.ISLANDS_75 = "islands-75", e.ISLANDS_200 = "islands-200", e.ISLANDS_MIDDLE = "islands-middle", e.ISLANDS_RETINA_MEDIUM = "islands-retina-medium", e.ISLANDS_RETINA_SMALL = "islands-retina-small", e.NORMAL = "normal", e))(s || {});
                const i = "0/0-0",
                    c = "YandexSDKLogError"
            },
            399: (e, t, n) => {
                n.d(t, {
                    Z: () => o
                });
                const r = /(\w+)@|at (.+) \(/g;

                function a(e, t = 0) {
                    var n;
                    const a = Array.from(e.matchAll(r)) || [];
                    if (!a.length) return "unknown";
                    if (0 === t) return a[0][2];
                    for (let e = Math.min(a.length - 1, t); e >= 0; e--) {
                        const t = null == (n = a[e]) ? void 0 : n[2];
                        if (t) return t
                    }
                    return "unknown"
                }

                function o(e) {
                    if (e) return a(e, 0);
                    try {
                        throw new Error
                    } catch (e) {
                        return a(e instanceof Error && e.stack || "", 2)
                    }
                }
            }
        },
        t = {};

    function n(r) {
        var a = t[r];
        if (void 0 !== a) return a.exports;
        var o = t[r] = {
            exports: {}
        };
        return e[r](o, o.exports, n), o.exports
    }
    n.d = (e, t) => {
        for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), (() => {
        if (void 0 !== n) {
            var e = n.u,
                t = n.e,
                r = {},
                a = {};
            n.u = function (t) {
                return e(t) + (r.hasOwnProperty(t) ? "?" + r[t] : "")
            }, n.e = function (r) {
                return t(r).catch((function (t) {
                    var o = a.hasOwnProperty(r) ? a[r] : 3;
                    if (o < 1) {
                        var s = e(r);
                        throw t.message = "Loading chunk " + r + " failed after 3 retries.\n(" + s + ")", t.request = s, t
                    }
                    return new Promise((function (e) {
                        setTimeout((function () {
                            a[r] = o - 1, e(n.e(r))
                        }), 0)
                    }))
                }))
            }
        }
    })();
    var r = {};
    (() => {
        n.d(r, {
            default: () => er
        });
        var e = (e => (e.ABORT_CONTROLLER = "abort-controller", e.GLOBAL_THIS = "global-this", e.INTERSECTION_OBSERVER = "intersection-observer", e.LEGACY = "legacy", e.SMOOTH_SCROLL = "smooth-scroll", e))(e || {});
        const t = e => {
            const {
                async: t,
                content: n,
                crossOrigin: r,
                id: a,
                nonce: o,
                onErrCb: s,
                onLoadCb: i,
                src: c
            } = e, l = document.createElement("script");
            if (i && (l.onload = i), s && (l.onerror = s), l.type = "text/javascript", t && (l.async = t), c && (l.src = c), o && l.setAttribute("nonce", o), r && l.setAttribute("crossOrigin", r), a && (l.setAttribute("id", `${a}-script`), l.dataset.rcid = `load-script-${a}`), n) {
                const e = document.createTextNode(n);
                l.appendChild(e)
            }
            return l
        };

        function a(e, t) {
            return e.endsWith("/") || (e = `${e}/`), `${e}polyfill/${t}`
        }

        function o(e, t) {
            return a(e, function (e) {
                var t, n;
                return (null == (n = null == (t = window.loadPolyfillHash) ? void 0 : t[e]) ? void 0 : n.contenthash) ? `${e}.${window.loadPolyfillHash[e].contenthash}.js` : `${e}.js`
            }(t))
        }

        function s(e, t) {
            let n, r;
            return function (...a) {
                const o = a,
                    s = this;
                return n || (n = !0, setTimeout((() => n = !1), t), r = e.apply(s, o)), r
            }
        }
        var i = n(393),
            c = n(719),
            l = n(89);
        const d = {
                background: "#4e3534",
                text: "#f9dedc"
            },
            u = ["Log error: data is not suitable for logging"];

        function h(e, t = "Dev", n) {
            if (!new URLSearchParams(location.search).get("debug-mode")) return () => {};
            const r = new Set("string" == typeof t ? [t] : t);
            r.add("Sdk");
            const a = Array.from(r);

            function o(t, n) {
                return l.F.postToParent((0, i.$4)({
                    prefix: e,
                    tag: a,
                    color: n,
                    data: t
                }))
            }
            return function (...e) {
                o(e, n).catch((() => o(u, d)))
            }
        }
        const p = class {
            constructor() {
                this.resolve = () => {}, this.reject = () => {}, this.promiseState = 0, this.promise = new Promise(((e, t) => {
                    this.resolve = t => {
                        this.promiseState = 1, e(t)
                    }, this.reject = e => {
                        this.promiseState = 2, t(e)
                    }
                }))
            }
            get state() {
                return this.promiseState
            }
        };
        var m = n(754);
        const g = h("sdkTimeout");

        function y(e, t = function () {
            var e;
            switch (null == (e = navigator.connection) ? void 0 : e.effectiveType) {
            case "slow-2g":
                return 4e4;
            case "2g":
                return 2e4;
            case "3g":
                return 1e4;
            default:
                return 5e3
            }
        }()) {
            const n = new p;
            g("init", e), n.promise.catch((() => {
                var n;
                const r = new Error(`[SDK] too long resolve for method '${e}'`);
                r.additional = {
                    speed: (null == (n = navigator.connection) ? void 0 : n.effectiveType) || "unknown",
                    timeout: t
                }, g("timeout", e), (0, m.f)(r)
            }));
            const r = setTimeout((() => {
                n.reject()
            }), t);
            return () => {
                g("resolve", e), n.resolve(), clearTimeout(r)
            }
        }
        class f {
            constructor(e) {
                this.log = e, this.observers = {}, this.subscribe = (e, t) => {
                    var n, r;
                    return (null != (r = (n = this.observers)[e]) ? r : n[e] = []).push(t), this.unsubscribe.bind(this, e, t)
                }, this.unsubscribe = (e, t) => {
                    var n;
                    if (!t) return void delete this.observers[e];
                    const r = this.observers[e];
                    if (!r) return void(null == (n = this.log) || n.call(this, `Observable: eventId {${e}} does not exist`));
                    const a = r.indexOf(t); - 1 !== a && r.splice(a, 1)
                }, this.notifyObservers = (e, t) => e.forEach((e => {
                    const n = this.observers[e];
                    n && n.forEach((n => {
                        var r;
                        try {
                            n(t)
                        } catch (t) {
                            null == (r = this.log) || r.call(this, `Observable: {${e}} event observer error`, t)
                        }
                    }))
                })), this.getObserversNumber = e => {
                    var t, n;
                    return null != (n = null == (t = this.observers[e]) ? void 0 : t.length) ? n : 0
                }
            }
        }
        var v = (e, t, n) => new Promise(((r, a) => {
            var o = e => {
                    try {
                        i(n.next(e))
                    } catch (e) {
                        a(e)
                    }
                },
                s = e => {
                    try {
                        i(n.throw(e))
                    } catch (e) {
                        a(e)
                    }
                },
                i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
            i((n = n.apply(e, t)).next())
        }));
        const w = {
                background: "#6c5b7b",
                text: "#ffffff"
            },
            b = class {
                constructor() {
                    this.log = h("Achievements | Child frame", "Dev", w), this.observable = new f(this.log), this.setProgress = (e, t) => v(this, null, (function* () {
                        return this.post(i.jG.SetProgress({
                            id: e,
                            progress: t
                        }))
                    })), this.getProgress = e => v(this, null, (function* () {
                        return this.post(i.jG.GetProgress({
                            id: e
                        }))
                    })), this.getList = (...e) => v(this, [...e], (function* (e = ["allLocal"]) {
                        return this.post(i.jG.GetList({
                            status: e
                        }))
                    })), this.on = ({
                        action: e,
                        id: t = ""
                    }, n) => this.observable.subscribe(this.buildId(e, t), n), this.off = ({
                        action: e,
                        id: t
                    }, n) => this.observable.unsubscribe(this.buildId(e, t), n), this.post = e => v(this, null, (function* () {
                        this.log("post to parent", e.action, e.data);
                        const t = y(`AchvManager.${e.action}`);
                        return l.F.postToParent(e).then((t => {
                            var n;
                            this.log("receive from parent", e, t);
                            const {
                                result: r,
                                success: a,
                                error: o
                            } = t.data;
                            return a && r ? (this.notify(e.action, null != (n = e.data) ? n : {}, r), r) : (this.log("reject", e, "due to error"), Promise.reject(o))
                        })).finally((() => {
                            t()
                        }))
                    })), this.notify = (e, t, n) => {
                        const r = [this.buildId(e)];
                        t.id && r.push(this.buildId(e, t.id)), this.observable.notifyObservers(r, {
                            data: n,
                            payload: t
                        })
                    }, this.buildId = (e, t = "") => `${e}${t}`
                }
            };
        b.init = () => {
            const {
                getList: e,
                getProgress: t,
                off: n,
                on: r,
                setProgress: a
            } = new b;
            return {
                getList: e,
                getProgress: t,
                off: n,
                on: r,
                setProgress: a
            }
        };
        let P = b;
        var E = (e => (e.ADV_IS_NOT_CONNECTED = "ADV_IS_NOT_CONNECTED", e.UNKNOWN = "UNKNOWN", e))(E || {});
        const S = h("NoAds", "Adv"),
            k = "yandex-games-no-ads-style";

        function A() {
            Array.isArray(window.yaContextCb) && 0 !== window.yaContextCb.length && (window.yaContextCb = []), Array.isArray(window.yandexContextAsyncCallbacks) && 0 !== window.yandexContextAsyncCallbacks.length && (window.yandexContextAsyncCallbacks = [])
        }
        let T = !1;

        function O() {
            T || (T = !0, S("_disableAds"), function () {
                var e;
                if (document.getElementById(k)) return;
                const t = document.createElement("style");
                t.id = k, t.textContent = '\nbody div[id*="yandex_rtb"],\nbody div[id*="adfox"],\nbody iframe#bwiframe,\nbody iframe[src*="yabnrwall.html"],\nbody iframe[src*="yartbbnr.html"],\nbody yatag,\nbody yatag[class]\n{ display: none !important; }', null == (e = document.body) || e.appendChild(t)
            }(), function () {
                var e, t, n;
                const r = {
                    destroy() {
                        S("Ya.Context.AdvManager.destroy disabled")
                    },
                    render(e, t) {
                        "function" == typeof t ? t() : "function" == typeof e.altCallback ? e.altCallback() : "function" == typeof e.onError && e.onError({
                            code: "YA_GAMES_ADS_DISABLED",
                            text: "",
                            type: "error"
                        })
                    }
                };
                "function" == typeof (null == (n = null == (t = null == (e = window.Ya) ? void 0 : e.Context) ? void 0 : t.AdvManager) ? void 0 : n.render) && (window.Ya.Context.AdvManager.render = r.render), A();
                let a = window.Ya;
                Object.defineProperty(window, "Ya", {
                    get() {
                        var e;
                        return (null == (e = null == a ? void 0 : a.Context) ? void 0 : e.AdvManager) && a.Context.AdvManager !== r && (a.Context.AdvManager = r), A(), a
                    },
                    set(e) {
                        var t;
                        (null == (t = e.Context) ? void 0 : t.AdvManager) && e.Context.AdvManager !== r && (e.Context.AdvManager = r), a = e
                    },
                    enumerable: !0,
                    configurable: !0
                }), window.Ya = window.Ya || {}, window.Ya.Context = window.Ya.Context || {
                    AdvManager: r
                }, window.Ya.Context.AdvManager = r, S("disable Ya.Context.AdvManager.render")
            }())
        }

        function I(e) {
            try {
                return String(e.message || e).substring(0, 100)
            } catch (e) {}
            return ""
        }

        function D() {
            return "true" === new URLSearchParams(location.search).get("draft")
        }
        const x = h("AdvManager", "Adv");

        function _(e, t) {
            return "function" == typeof e[t] ? (n = e[t], r = `Error in callback ${t}`, (...e) => {
                try {
                    return n(...e)
                } catch (e) {
                    (0, m.f)(e, {
                        additional: {
                            origError: I(e)
                        },
                        message: r
                    })
                }
            }) : () => {};
            var n, r
        }
        class C {
            constructor(e) {
                var t;
                this.callbacks = {}, this.onAdvDebugManagerExternalMessage = e => {
                    const {
                        action: t
                    } = e.data;
                    switch (t) {
                    case "debug-action-showFullscreenAdv":
                        this.showFullscreenAdvDebug(t);
                        break;
                    case "debug-action-showRewardedVideo":
                        this.showRewardedVideoDebug(t);
                        break;
                    case "debug-action-switchStickyBanners":
                        this.switchStickyBannersDebug(t)
                    }
                }, this.onAdvManagerExternalMessage = e => {
                    var t, n, r, a, o, s, i, c, l, d, u, h, p, g, y;
                    const {
                        action: f,
                        data: v
                    } = e.data;
                    switch (x(`onAdvManagerExternalMessage ${f}`), f) {
                    case "adv-callback-open":
                        null == (n = (t = this.callbacks).onOpen) || n.call(t);
                        break;
                    case "adv-callback-close":
                        this.callOnAdvClose(v.wasShown);
                        break;
                    case "adv-callback-error":
                        this.callOnAdvClose(!1);
                        try {
                            if ("string" != typeof (null == (r = null == v ? void 0 : v.error) ? void 0 : r.message)) {
                                const e = new Error("Undefined error message");
                                try {
                                    e.additional = JSON.stringify(v)
                                } catch (t) {
                                    e.additional = "undefined"
                                }(0, m.f)(e)
                            }
                        } catch (e) {}
                        null == (o = (a = this.callbacks).onError) || o.call(a, new Error(v.error.message, {
                            cause: v.error
                        }));
                        break;
                    case "adv-callback-offline":
                        this.callOnAdvClose(!1), null == (i = (s = this.callbacks).onOffline) || i.call(s);
                        break;
                    case "rewarded-video-callback-open":
                        null == (l = (c = this.callbacks).onOpen) || l.call(c);
                        break;
                    case "rewarded-video-callback-rewarded":
                        null == (u = (d = this.callbacks).onRewarded) || u.call(d);
                        break;
                    case "rewarded-video-callback-close":
                        null == (p = (h = this.callbacks).onClose) || p.call(h);
                        break;
                    case "rewarded-video-callback-error":
                        null == (y = (g = this.callbacks).onError) || y.call(g, new Error(v.error.message, {
                            cause: v.error
                        }));
                        break;
                    case "set-disabled-state":
                        x('On "set-disabled-state" event', e.data, v.value), this.setDisabledState(v.value)
                    }
                }, this.adv = e.adv || {}, this.checkDeprecatedOnAdvCloseUsage(), (null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.isWorldWide) && this.setDisabledState(!0), Object.defineProperty(this, "callbacks", {
                    enumerable: !1,
                    writable: !0
                }), Object.defineProperty(this.adv, "onAdvClose", {
                    enumerable: !1,
                    writable: !0
                }), l.F.onExternalMessage("adv-manager", this.onAdvManagerExternalMessage), l.F.onExternalMessage("adv-debug-manager", this.onAdvDebugManagerExternalMessage), this.updateDisabledState()
            }
            checkDeprecatedOnAdvCloseUsage() {
                "onAdvClose" in this.adv && (0, m.T)(new Error('Deprecated usage "onAdvClose". Please, use `ysdk.adv.method({callbacks})` https://yandex.ru/dev/games/doc/sdk/sdk-adv'))
            }
            showFullscreenAdvDebug(e) {
                this.showFullscreenAdv({
                    callbacks: {
                        onClose: t => x(`${e} onClose, wasShown = ${t}`),
                        onError: t => x(`${e} onError, error =`, t),
                        onOffline: () => x(`${e} onOffline`),
                        onOpen: () => x(`${e} onOpen`)
                    }
                })
            }
            showRewardedVideoDebug(e) {
                this.showRewardedVideo({
                    callbacks: {
                        onClose: () => x(`${e} onClose`),
                        onError: t => x(`${e} onError, error =`, t),
                        onOpen: () => x(`${e} onOpen`),
                        onRewarded: () => x(`${e} onRewarded`)
                    }
                })
            }
            switchStickyBannersDebug(e) {
                this.getBannerAdvStatus().then((({
                    stickyAdvIsShowing: t
                }) => {
                    t ? this.hideBannerAdv().then((({
                        stickyAdvIsShowing: t
                    }) => {
                        x(`${e} hideBannerAdv, stickyAdvIsShowing = ${t}`)
                    })) : this.showBannerAdv().then((({
                        reason: t,
                        stickyAdvIsShowing: n
                    }) => {
                        x(`${e} hideBannerAdv, stickyAdvIsShowing = ${n}, reason = ${t}`)
                    }))
                }))
            }
            updateDisabledState() {
                l.F.postToParent(i.X$.GetDisabledState()).then((({
                    data: e
                }) => {
                    this.setDisabledState(e.value)
                })).catch(console.warn)
            }
            setDisabledState(e) {
                x("setDisabledState", e), e ? O() : T && (T = !1)
            }
            ensureCallbacksIsValid(e, t) {
                if (!Object.keys(t).length) return;
                let n = ["onClose", "onError"];
                "showRewardedVideo" === e && n.push("onRewarded");
                try {
                    n = n.filter((e => !(e in t && "function" == typeof t[e])))
                } catch (e) {
                    (0, m.T)(new Error('Error in "ensureCallbacksIsValid"'), {
                        additional: {
                            error: String(e).substring(0, 100)
                        }
                    })
                }
                if (n.length) {
                    const t = new Error(`Callbacks for "${e}" has unpresented methods. See https://yandex.ru/dev/games/doc/ru/sdk/sdk-adv`);
                    (0, m.T)(t, {
                        additional: {
                            unpresentedMethods: n
                        }
                    })
                }
            }
            showFullscreenAdv({
                callbacks: e = {}
            } = {}) {
                this.ensureCallbacksIsValid("showFullscreenAdv", e);
                const t = y("AdvManager.showFullscreenAdv");
                l.F.postToParent(i.X$.AdvShowFullscreen()).then((({
                    data: {
                        error: t
                    }
                }) => {
                    if (!t) return this.setCallbacks(e, ["onClose", "onOpen", "onError", "onOffline"]);
                    if (D() && t.message.includes("often than once per")) throw t;
                    (0, m.f)(t), _(e, "onError")(t), _(e, "onClose")(!1), this.callDeprecatedOnClose(!1)
                })).catch((t => {
                    (0, m.f)(t), _(e, "onError")(t), _(e, "onClose")(!1), this.callDeprecatedOnClose(!1)
                })).finally((() => {
                    t()
                }))
            }
            showRewardedVideo({
                callbacks: e = {}
            } = {}) {
                this.ensureCallbacksIsValid("showRewardedVideo", e);
                const t = y("AdvManager.showRewardedVideo");
                l.F.postToParent(i.X$.AdvShowRewardedVideo()).then((({
                    data: {
                        error: t
                    }
                }) => {
                    if (t) throw t;
                    this.setCallbacks(e, ["onOpen", "onRewarded", "onClose", "onError"])
                })).catch((t => {
                    (0, m.f)(t), _(e, "onError")(t), _(e, "onClose")(!1)
                })).finally((() => {
                    t()
                }))
            }
            showBannerAdv() {
                return new Promise((e => {
                    const t = y("AdvManager.showBannerAdv");
                    l.F.postToParent(i.X$.AdvShowStickyBanner()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((t => {
                        (0, m.f)(t), e({
                            reason: E.UNKNOWN,
                            stickyAdvIsShowing: !1
                        })
                    })).finally((() => {
                        t()
                    }))
                }))
            }
            hideBannerAdv() {
                return new Promise((e => {
                    const t = y("AdvManager.hideBannerAdv");
                    l.F.postToParent(i.X$.AdvHideStickyBanner()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((t => {
                        (0, m.f)(t), e({
                            stickyAdvIsShowing: !1
                        })
                    })).finally((() => {
                        t()
                    }))
                }))
            }
            getBannerAdvStatus() {
                return new Promise((e => {
                    const t = y("AdvManager.getBannerAdvStatus");
                    l.F.postToParent(i.X$.AdvStatusStickyBanner()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((t => {
                        (0, m.f)(t), e({
                            reason: E.UNKNOWN,
                            stickyAdvIsShowing: !1
                        })
                    })).finally((() => {
                        t()
                    }))
                }))
            }
            setCallbacks(e, t) {
                this.callbacks = {}, t.forEach((t => {
                    this.callbacks[t] = _(e, t)
                }))
            }
            callOnAdvClose(e = !1) {
                var t, n;
                this.callDeprecatedOnClose(e), null == (n = (t = this.callbacks).onClose) || n.call(t, e)
            }
            callDeprecatedOnClose(e = !1) {
                if ("function" == typeof this.adv.onAdvClose) try {
                    this.adv.onAdvClose(e)
                } catch (e) {
                    (0, m.T)(e)
                }
            }
        }
        const L = new class {
            openAuthDialog() {
                const e = y("AuthManagerPublic.openAuthDialog", 12e4),
                    t = l.F.postToParent(i.uQ.AuthDialogOpen());
                return t.finally((() => {
                    e()
                })), t
            }
        };

        function R(e) {
            const t = typeof e;
            return null != e && ("object" === t || "function" === t)
        }
        var F = n(303);
        const N = n(280).Z,
            G = {
                small: F.f9.ISLANDS_RETINA_SMALL,
                medium: F.f9.ISLANDS_RETINA_MEDIUM,
                large: F.f9.ISLANDS_200
            },
            $ = {
                small: F.f9.ISLANDS_200,
                medium: F.f9.ISLANDS_200,
                large: F.f9.BIG
            };
        class j {
            constructor(e) {
                this._personalInfo = e
            }
            getID() {
                return (0, m.T)(new Error("Player.getID() is deprecated. Please, use Player.getUniqueID().\nhttps://yandex.ru/dev/games/doc/dg/sdk/sdk-player.html#sdk-player__profile-data")), N.sendOnceDeprecatedUsage("Player.getID"), this._personalInfo.id
            }
            getUniqueID() {
                return this._personalInfo.uniqueID
            }
            getName() {
                return this._personalInfo.publicName
            }
            getMode() {
                var e;
                return null != (e = this._personalInfo.mode) ? e : ""
            }
            getPayingStatus() {
                return l.F.postToParent(i.yH.GetGamePurchaseEnabled()).then((({
                    data: {
                        enabled: e
                    }
                }) => {
                    e || (0, m.T)(new Error("We provide data on the player's ability to pay in games that already support purchases"), {
                        level: "warn"
                    })
                })), this._personalInfo.payingStatus
            }
            getPhoto(e = "medium") {
                const t = G[e];
                if (!t) throw new Error(`Unknown size value ('${e}')`);
                return this._personalInfo.avatarIdHash ? `${function(){var e,t,n;const r=(null==(e=window.YandexGamesSDKEnvironment)?void 0:e.serviceHostname)||(null==(t=window.YandexGamesSDKEnvironment)?void 0:t.serviceName)||"yandex",a=(null==(n=window.YandexGamesSDKEnvironment)?void 0:n.i18n.tld)||"ru";return"https://games-sdk.%DOMAIN_NAME%.%TLD%/games/api/sdk/v1".replace(F.O6,r).replace(F.U0,a)}()}/player/avatar/${this._personalInfo.avatarIdHash}/${t}` : `https://avatars.mds.yandex.net/get-yapic/${F._h}/${t}`
            }
        }
        var M = Object.defineProperty,
            U = Object.getOwnPropertySymbols,
            B = Object.prototype.hasOwnProperty,
            Y = Object.prototype.propertyIsEnumerable,
            V = (e, t, n) => t in e ? M(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: n
            }) : e[t] = n,
            H = (e, t) => {
                for (var n in t || (t = {})) B.call(t, n) && V(e, n, t[n]);
                if (U)
                    for (var n of U(t)) Y.call(t, n) && V(e, n, t[n]);
                return e
            };
        const K = (e, t) => {
                l.F.postToParent((0, i.rS)({
                    playdeck: H({
                        method: e
                    }, t)
                }))
            },
            W = "tgData",
            q = () => (K("getData", {
                key: W
            }), new Promise(((e, t) => {
                function n(r) {
                    var a;
                    if (!(e => {
                            var t, n, r;
                            return "getData" === (null == (r = null == (n = null == (t = e.data) ? void 0 : t.data) ? void 0 : n.playdeck) ? void 0 : r.method)
                        })(r)) return;
                    l.F.offExternalMessage("telegram", n);
                    const o = (null == (a = r.data.data.playdeck.value) ? void 0 : a.data) || "{}";
                    if ("string" == typeof o) try {
                        e(JSON.parse(o))
                    } catch (e) {
                        const n = new Error("Error parsing game data from telegram");
                        n.additional = {
                            originalError: e
                        }, (0, m.f)(n, {
                            prefix: "telegram"
                        }), t({})
                    } else e(o)
                }
                l.F.onExternalMessage("telegram", n), setTimeout((() => {
                    l.F.offExternalMessage("telegram", n), t()
                }), 1e3)
            })));
        var X = Object.defineProperty,
            J = Object.defineProperties,
            z = Object.getOwnPropertyDescriptors,
            Q = Object.getOwnPropertySymbols,
            Z = Object.prototype.hasOwnProperty,
            ee = Object.prototype.propertyIsEnumerable,
            te = (e, t, n) => t in e ? X(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: n
            }) : e[t] = n;
        const ne = s((e => l.F.postToParent(i.S.Score(e)).then((({
            data: e
        }) => e.result))), 1e3);
        class re {
            getLeaderboardDescription(e) {
                const t = y("Leaderboards.getLeaderboardDescription"),
                    n = l.F.postToParent(i.S.Description({
                        name: e
                    })).then((({
                        data: e
                    }) => e));
                return n.finally((() => {
                    t()
                })), n
            }
            getLeaderboardStat(e) {
                const t = y("Leaderboards.getLeaderboardStat"),
                    n = l.F.postToParent(i.S.Stat({
                        name: e
                    })).then((({
                        data: e
                    }) => e));
                return n.finally((() => {
                    t()
                })), n
            }
            getLeaderboardEntries(e, t) {
                const {
                    includeUser: n = !1,
                    quantityAround: r = 5,
                    quantityTop: a = 5
                } = t || {}, o = y("Leaderboards.getLeaderboardEntries"), s = l.F.postToParent(i.S.Entries({
                    include_user: n,
                    name: e,
                    quantity_around: r,
                    quantity_top: a
                })).then((({
                    data: e
                }) => {
                    const {
                        avatarPrefix: t,
                        result: n
                    } = e, {
                        entries: r,
                        leaderboard: a,
                        ranges: o,
                        userRank: s
                    } = n;
                    return {
                        entries: this.transformLeaderboardEntries(r, t),
                        leaderboard: a,
                        ranges: o,
                        userRank: s
                    }
                }));
                return s.finally((() => {
                    o()
                })), s
            }
            getLeaderboardPlayerEntry(e) {
                return t = this, n = null, r = function* () {
                    const {
                        data: t
                    } = yield l.F.postToParent(i.S.PlayerEntry({
                        name: e
                    }));
                    return this.transformLeaderboardEntry(t.result, t.avatarPrefix)
                }, new Promise(((e, a) => {
                    var o = e => {
                            try {
                                i(r.next(e))
                            } catch (e) {
                                a(e)
                            }
                        },
                        s = e => {
                            try {
                                i(r.throw(e))
                            } catch (e) {
                                a(e)
                            }
                        },
                        i = t => t.done ? e(t.value) : Promise.resolve(t.value).then(o, s);
                    i((r = r.apply(t, n)).next())
                }));
                var t, n, r
            }
            setLeaderboardScore(e, t, n) {
                K("setScore", {
                    value: t
                });
                const r = {
                    name: e,
                    score: t
                };
                return this.lastTimeLeaderboardWasSend && !this.canSetLeaderboardScoreByTime() ? Promise.reject("The request to setLeaderboardScore can be sent no more than once per second") : (n && (r.extraData = n), this.lastTimeLeaderboardWasSend = Date.now(), ne(r))
            }
            canSetLeaderboardScoreByTime() {
                return Date.now() - this.lastTimeLeaderboardWasSend > 1e3
            }
            transformLeaderboardEntry(e, t) {
                const {
                    avatarIdHash: n,
                    lang: r,
                    publicName: a,
                    scopePermissions: o,
                    uniqueID: s
                } = e.player, i = `${t}${n}`;
                return c = ((e, t) => {
                    for (var n in t || (t = {})) Z.call(t, n) && te(e, n, t[n]);
                    if (Q)
                        for (var n of Q(t)) ee.call(t, n) && te(e, n, t[n]);
                    return e
                })({}, e), J(c, z({
                    player: {
                        getAvatarSrc: (e = "medium") => (G[e] || (e = "medium"), `${i}/${G[e]}`),
                        getAvatarSrcSet: (e = "medium") => (G[e] || (e = "medium"), `${i}/${G[e]} 1x, ${i}/${$[e]} 2x`),
                        lang: r,
                        publicName: a,
                        scopePermissions: o,
                        uniqueID: s
                    }
                }));
                var c
            }
            transformLeaderboardEntries(e, t) {
                return e.map((e => this.transformLeaderboardEntry(e, t)))
            }
        }
        const ae = () => {
            const e = new re;
            return Promise.resolve(e)
        };

        function oe(e) {
            return function (e) {
                for (var t, n = "", r = e.length, a = 0; a < r; a++) t = e[a], n += String.fromCharCode(t > 251 && t < 254 && a + 5 < r ? 1073741824 * (t - 252) + (e[++a] - 128 << 24) + (e[++a] - 128 << 18) + (e[++a] - 128 << 12) + (e[++a] - 128 << 6) + e[++a] - 128 : t > 247 && t < 252 && a + 4 < r ? (t - 248 << 24) + (e[++a] - 128 << 18) + (e[++a] - 128 << 12) + (e[++a] - 128 << 6) + e[++a] - 128 : t > 239 && t < 248 && a + 3 < r ? (t - 240 << 18) + (e[++a] - 128 << 12) + (e[++a] - 128 << 6) + e[++a] - 128 : t > 223 && t < 240 && a + 2 < r ? (t - 224 << 12) + (e[++a] - 128 << 6) + e[++a] - 128 : t > 191 && t < 224 && a + 1 < r ? (t - 192 << 6) + e[++a] - 128 : t);
                return n
            }(function (e, t) {
                for (var n, r, a, o = e.replace(/[^A-Za-z0-9\+\/]/g, ""), s = o.length, i = t ? Math.ceil((3 * s + 1 >>> 2) / t) * t : 3 * s + 1 >>> 2, c = new Uint8Array(i), l = 0, d = 0, u = 0; u < s; u++)
                    if (r = 3 & u, l |= ((a = o.charCodeAt(u)) > 64 && a < 91 ? a - 65 : a > 96 && a < 123 ? a - 71 : a > 47 && a < 58 ? a + 4 : 43 === a ? 62 : 47 === a ? 63 : 0) << 18 - 6 * r, 3 === r || s - u == 1) {
                        for (n = 0; n < 3 && d < i; n++, d++) c[d] = l >>> (16 >>> n & 24) & 255;
                        l = 0
                    } return c
            }(e))
        }

        function se(e, t) {
            t && Object.defineProperty(e, "signature", {
                enumerable: !1,
                configurable: !1,
                get: () => t
            })
        }
        class ie extends Error {
            constructor({
                code: e,
                httpStatus: t,
                message: n
            }, r, a) {
                super(n, r, a), this.name = "PaymentsError", this.code = e, this.httpStatus = t, Object.setPrototypeOf(this, ie.prototype), Error.captureStackTrace && Error.captureStackTrace(this, ie)
            }
            toJSON() {
                return {
                    code: this.code,
                    httpStatus: this.httpStatus,
                    message: this.message,
                    name: this.name,
                    stack: this.stack
                }
            }
        }
        const ce = ie,
            le = new Set(["ru", "uk", "be", "kk", "uz"]);
        var de = (e => (e.BE = "be", e.EN = "en", e.KK = "kk", e.RU = "ru", e.TR = "tr", e.UK = "uk", e.UZ = "uz", e))(de || {});
        const ue = de.EN;

        function he(e, t = ue, n = "") {
            if (e) {
                if ("string" == typeof e) return e;
                if (t in e) return e[t] || n;
                if (!(e => !e || le.has(e))(t) && "en" in e) return e.en || n;
                if (ue in e) return e[ue] || n
            }
            return n
        }
        var pe;
        const me = Symbol("codePath"),
            ge = Symbol("appId"),
            ye = Symbol("sendMetricaParams"),
            fe = Symbol("sendOnceCurrencyCodeStat"),
            ve = Symbol("getCurrencyImageUrlPrefix"),
            we = Symbol("currencyCodeStat");
        class be {
            constructor(e) {
                this._productData = e, this[pe] = () => {
                    this[fe] = () => {}, this[ye](this[we])
                }
            }
            get id() {
                return this._productData.id
            }
            get title() {
                return he(this._productData.title)
            }
            get description() {
                return he(this._productData.description)
            }
            get imageURI() {
                const {
                    image: e
                } = this._productData;
                if (e && "object" == typeof e && "url_prefix" in e) {
                    const t = String(e.url_prefix);
                    return /\.(png|jpg|svg)$/.test(t) ? t : `${t}/default256x256`
                }
                return "https://yastatic.net/s3/games-static/static-data/images/payments/default-product-image.png"
            }
            get price() {
                const {
                    price: e
                } = this._productData;
                return `${e} ${this.priceCurrencyCode}`
            }
            get priceValue() {
                return String(this._productData.price)
            }
            get priceCurrencyCode() {
                this[fe]()
            }
            get[me]() {
                return ""
            }
            getPriceCurrencyImage(e = "small") {
                if ("svg" === e) return `${this[ve]()}/currency-icon-m.svg`;
                let t = "s";
                switch (e) {
                case "medium":
                case "small":
                    t = e.charAt(0);
                    break;
                default:
                    console.warn(`Unknown size value ('${e}')`)
                }
                const n = window.devicePixelRatio >= 2;
                return `${this[ve]()}/currency-icon-${t}${n?"@2x":""}.png`
            }
            toJSON() {
                return {
                    id: this.id,
                    title: this.title,
                    description: this.description,
                    imageURI: this.imageURI,
                    price: this.price,
                    priceValue: this.priceValue,
                    priceCurrencyCode: this.priceCurrencyCode
                }
            }
            get[we]() {
                return {
                    borrowParams: {
                        payments: {
                            appId: this[ge],
                            productCurrencyCodeGet: !0
                        }
                    }
                }
            } [(pe = fe, ve)]() {
                return `//yastatic.net/s3/games-static/static-data/images/payments/sdk${this[me]}`
            }
        }
        var Pe = n(498),
            Ee = n(280);
        class Se extends be {
            get priceCurrencyCode() {
                var e;
                return super.priceCurrencyCode, null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.moneyCodeSymbol
            }
            get[me]() {
                var e, t;
                return (null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.moneyCodeSymbol) ? `/${null==(t=window.YandexGamesSDKEnvironment)?void 0:t.moneyCodeSymbol.toLowerCase()}` : ""
            }
            get [ge]() {
                return (0, Pe.o)()
            } [ye](e) {
                Ee.Z.params(e)
            }
        }
        class ke {
            constructor(e) {
                this.purchaseData = e
            }
            get productID() {
                return this.purchaseData.productID
            }
            get purchaseToken() {
                return this.purchaseData.purchaseToken
            }
            get developerPayload() {
                return this.purchaseData.developerPayload
            }
            toJSON() {
                return {
                    productID: this.productID,
                    purchaseToken: this.purchaseToken,
                    developerPayload: this.developerPayload
                }
            }
        }
        const Ae = h("Payment");
        class Te {
            constructor(e = {}) {
                this._config = e, this.___test1212()
            }
            getCatalog() {
                return new Promise(((e, t) => {
                    const n = y("Payments.getCatalog");
                    l.F.postToParent(i.yH.GetCatalog({
                        lang: this._config.lang
                    })).then((({
                        data: t
                    }) => {
                        Ae("get-catalog result", t), e(t.products.map((e => new Se(e))))
                    })).catch((e => {
                        t(e)
                    })).finally((() => {
                        n()
                    }))
                }))
            }
            purchase(e) {
                "object" != typeof e && (e = {
                    id: e,
                    developerPayload: ""
                });
                const {
                    developerPayload: t
                } = e;
                if (t) {
                    if ("string" != typeof t) return Promise.reject(new Error("developerPayload must be a string"))
                } else e.developerPayload = "";
                return new Promise(((t, n) => {
                    l.F.postToParent(i.yH.PurchaseStart({
                        paymentsConfig: this._config,
                        purchaseConfig: e
                    })).then((({
                        data: {
                            data: e,
                            signature: n
                        }
                    }) => {
                        Ae("purchase-start then");
                        const r = new ke({
                            productID: e.product.id,
                            purchaseToken: e.token,
                            developerPayload: e.developerPayload
                        });
                        se(r, n), t(r)
                    })).catch((e => {
                        Ae("purchase-start catch"), n(e)
                    }))
                }))
            }
            getPurchases() {
                return new Promise(((e, t) => {
                    const n = y("Payments.getPurchases");
                    l.F.postToParent(i.yH.GetPurchases({
                        paymentsConfig: this._config
                    })).then((({
                        data: {
                            data: t,
                            signature: n
                        }
                    }) => {
                        Ae("getPurchases callback", t);
                        const r = t.map((e => new ke({
                            productID: e.product.id,
                            purchaseToken: e.token,
                            developerPayload: e.developerPayload
                        })));
                        se(r, n), e(r)
                    })).catch((e => {
                        t(e)
                    })).finally((() => {
                        n()
                    }))
                }))
            }
            consumePurchase(e) {
                return new Promise(((t, n) => {
                    const r = y("Payments.consumePurchase");
                    l.F.postToParent(i.yH.PurchaseConsume({
                        token: e
                    })).then((({
                        data: e
                    }) => {
                        if (console.info("consumePurchase data"), console.info(e), !e || !e.token) throw new ce({
                            code: "CANNOT_CONSUME_PURCHASE",
                            message: "Can not consume purchase."
                        });
                        t(!0)
                    })).catch((e => {
                        n(e)
                    })).finally((() => {
                        r()
                    }))
                }))
            }
            ___test1212() {
                var e, t, n;
                if ("96458" !== (null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.app.id)) return;
                if (!0 !== (null == (n = null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.request.experiments) ? void 0 : n.test1212Payments)) return;
                const r = "position: fixed; left: 15px; padding: 0.3em; background: #fff; border: 1px solid #000; border-radius: 5px;";
                let a = document.createElement("div");
                a.setAttribute("id", "payElement1212-noads"), a.setAttribute("style", `${r} top: 5px;`), a.textContent = 'purchase("noads")', a.onclick = () => this.___test1212Purchase("noads"), document.body.appendChild(a), a = document.createElement("div"), a.setAttribute("id", "payElement1212-3x3antiblock"), a.setAttribute("style", `${r} top: 40px;`), a.textContent = 'purchase("3x3antiblock")', a.onclick = () => this.___test1212Purchase("3x3antiblock"), document.body.appendChild(a)
            }
            ___test1212Purchase(e) {
                function t(t) {
                    const n = document.getElementById(`payElement1212-${e}`);
                    n && (n.style.backgroundColor = t ? "#0f0" : "#f00")
                }
                this.purchase({
                    id: e,
                    developerPayload: ""
                }).then((() => t(!0))).catch((e => {
                    t(!1), (0, m.f)(e)
                }))
            }
        }
        const Oe = function (e = {}) {
                const t = new Te(e);
                return new Promise(((e, n) => {
                    t.getCatalog().then((() => e(t))).catch(n)
                }))
            },
            Ie = {
                APP_VERSION: "",
                app: {
                    id: ""
                },
                browser: {
                    lang: "en"
                },
                clid: void 0,
                i18n: {
                    lang: "en",
                    tld: "en"
                },
                isStickyBannerEnabled: !1,
                isWorldWide: !1,
                isYandexApp: !1,
                isTelegram: !1,
                parentTimeOrigin: performance.timeOrigin,
                moneyCodeSymbol: F.NA.HOP,
                params: {},
                request: {},
                serverTime: Date.now(),
                serviceHostname: "yandex",
                serviceName: "yandex",
                useMockGameLinks: !1
            };
        let De = () => (window.YandexGamesSDKEnvironment || (0, m.f)(new Error("SDK environment: `window.YandexGamesSDKEnvironment` is undefined")), De = () => window.YandexGamesSDKEnvironment || Ie, De());
        const xe = {
            get app() {
                return De().app
            },
            get browser() {
                return {
                    lang: De().i18n.lang
                }
            },
            get data() {
                return De().data || {}
            },
            get i18n() {
                return De().i18n
            },
            get payload() {
                return De().params.payload
            },
            get isTelegram() {
                return De().isTelegram
            },
            get domain() {
                return De().serviceName || De().serviceHostname
            }
        };
        var _e = n(31);
        const Ce = 204800;

        function Le(e) {
            try {
                return JSON.stringify(e)
            } catch (e) {
                return (0, m.f)(e), `${Date.now()}.${Math.random()}`
            }
        }
        class Re {
            constructor(e) {
                this._playerId = e, this._dataHash = null, this._timestamp = 0
            }
            isSamePlayer(e) {
                return e === this._playerId
            }
            set dataHash(e) {
                this._dataHash = e ? Le(e) : null
            }
            validate(e) {
                const t = Le(e);
                return function (e) {
                    try {
                        return (new TextEncoder).encode(e).length
                    } catch (t) {
                        return function (e) {
                            let t = e.length;
                            for (let n = e.length - 1; n >= 0; n--) {
                                let r = e.charCodeAt(n);
                                r > 127 && r <= 2047 ? t++ : r > 2047 && r <= 65535 && (t += 2), r >= 56320 && r <= 57343 && n--
                            }
                            return t
                        }(e)
                    }
                }(t) > Ce ? {
                    error: new Error("The data is too large (bigger then 204800 bytes)."),
                    reject: !0
                } : this._dataHash === t ? {
                    error: new Error("The data does not differ from the previous ones."),
                    reject: !1
                } : {}
            }
            getWaitTime() {
                let e = 200;
                const t = Math.abs(Date.now() - this._timestamp);
                return t < 3e3 && (e = Math.max(200, 3e3 - t)), e
            }
            set timestamp(e) {
                this._timestamp = e
            }
        }
        const Fe = h("Player");

        function Ne(e, t) {
            return (0, m.f)(t, e)
        }

        function Ge(e) {
            const {
                data: t,
                signature: n
            } = function (e, t) {
                if ("signature" in e) {
                    const {
                        signature: n
                    } = e;
                    if ("string" == typeof n) {
                        const {
                            data: e
                        } = JSON.parse(oe(n.split(".")[1]));
                        return {
                            data: e,
                            signature: n
                        }
                    }
                    t({}, new Error("response.signature is not a string"))
                }
                return {
                    data: e
                }
            }(e, Ne);
            return se(t, n), t
        }

        function $e(e, t) {
            if (void 0 === t) return e;
            if (!Array.isArray(t)) throw new Error("`keys` must be an Array");
            if (-1 !== t.indexOf("signature")) throw new Error('`keys` must not contains "signature" key');
            const n = {};
            return t.forEach((t => {
                t in e && (n[t] = e[t])
            })), n
        }

        function je(e) {
            return !(!e || "object" != typeof e) && Object.values(e).every((e => "number" == typeof e && !isNaN(e)))
        }
        let Me, Ue, Be;
        l.F.onExternalMessage("auth", (e => {
            if ("changed" === e.data.action && Be) {
                Fe("Call onLogoutCallback()");
                try {
                    Be()
                } catch (e) {
                    console.error()
                }
                Be = void 0
            }
        }));
        class Ye extends j {
            constructor(e, t) {
                super(e), this.dataPromise = null, this.getApiPromise = () => new Promise(((e, t) => {
                    this.getPlayerData().then((t => {
                        this.data = t, e(t)
                    })).catch((e => {
                        this.dataPromise = null, t(e)
                    }))
                })), this.getPlayerData = () => {
                    return e = this, t = null, n = function* () {
                        const {
                            data: e
                        } = yield l.F.postToParent(i.Uh.GetData({
                            signed: this.config.signed
                        }));
                        return Ge(e)
                    }, new Promise(((r, a) => {
                        var o = e => {
                                try {
                                    i(n.next(e))
                                } catch (e) {
                                    a(e)
                                }
                            },
                            s = e => {
                                try {
                                    i(n.throw(e))
                                } catch (e) {
                                    a(e)
                                }
                            },
                            i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
                        i((n = n.apply(e, t)).next())
                    }));
                    var e, t, n
                }, this.getDataPromise = () => void 0 !== this.data ? Promise.resolve(this.data) : xe.isTelegram ? q().catch((() => this.getPlayerData())) : this.getApiPromise(), this.config = t, Ue && Ue.isSamePlayer(this.getUniqueID()) || (Ue = new Re(this.getUniqueID()))
            }
            onLogout(e) {
                Fe("Set onLogout callback"), Be = e
            }
            getIDsPerGame() {
                return l.F.postToParent(i.Uh.IdsPerGame({
                    signed: this.config.signed
                })).then((({
                    data: e
                }) => Ge(e)))
            }
            getData(e) {
                return this.dataPromise = this.getDataPromise(), this.dataPromise.then((t => $e(t, e)))
            }
            setData(e, t = !1) {
                var n;
                if (xe.isTelegram && (n = e, K("setData", {
                        key: W,
                        value: JSON.stringify(n)
                    })), ! function (e) {
                        return "object" == typeof e && null !== e
                    }(e)) return Promise.reject(new Error("Data is not valid"));
                this.data = e;
                const r = function (e, t = !1) {
                    const n = Ue.validate(e);
                    return n.error ? n.reject ? Promise.reject(n.error) : ((0, m.T)(n.error), Promise.resolve(!0)) : new Promise(((n, r) => {
                        Me && window.clearTimeout(Me);
                        let a = t ? 200 : Math.max(200, Ue.getWaitTime());
                        Ue.timestamp = Date.now(), Me = window.setTimeout((() => {
                            l.F.postToParent(i.Uh.SetData({
                                data: e
                            })).then((() => {
                                Ue.dataHash = e, n(!0)
                            })).catch((e => {
                                Ue.timestamp = 0, Ue.dataHash = null, r(e)
                            }))
                        }), a)
                    }))
                }(e, t);
                return t ? r : Promise.resolve(!0)
            }
            getStats(e) {
                return void 0 === this.statsPromise && (this.statsPromise = new Promise(((e, t) => {
                    l.F.postToParent(i.Uh.Stats({
                        signed: this.config.signed
                    })).then((({
                        data: e
                    }) => Ge(e))).then(e).catch(t).finally((() => this.statsPromise = void 0))
                }))), this.statsPromise.then((t => $e(t, e)))
            }
            setStats(e) {
                return je(e) ? l.F.postToParent(i.Uh.SetStats({
                    stats: e
                })).then((({
                    data: e
                }) => e.result)) : Promise.reject(new Error("Stats is not valid"))
            }
            incrementStats(e) {
                return je(e) ? l.F.postToParent(i.Uh.IncrementStats({
                    increments: e,
                    signed: this.config.signed
                })).then((({
                    data: e
                }) => Ge(e.result))) : Promise.reject(new Error("Increments is not valid"))
            }
        }

        function Ve(e) {
            return t = this, n = null, r = function* () {
                return new Promise((t => setTimeout((() => t()), e)))
            }, new Promise(((e, a) => {
                var o = e => {
                        try {
                            i(r.next(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    s = e => {
                        try {
                            i(r.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    i = t => t.done ? e(t.value) : Promise.resolve(t.value).then(o, s);
                i((r = r.apply(t, n)).next())
            }));
            var t, n, r
        }
        let He;
        try {
            He = window.localStorage
        } catch (e) {}
        const Ke = He || function () {
                let e = {};
                return {
                    clear() {
                        e = {}
                    },
                    getItem: t => e[t],
                    key: t => Object.keys(e)[t],
                    removeItem(t) {
                        delete e[t]
                    },
                    setItem(t, n) {
                        e[t] = String(n)
                    },
                    get length() {
                        return Object.keys(e).length
                    }
                }
            }(),
            We = /iPad|iPhone|iPod/.test(navigator.platform),
            qe = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            Xe = We || qe,
            Je = /app-[^.]+\.games\.s3\.yandex\.net$/.test(location.hostname),
            ze = !Je && Xe,
            Qe = function (e, t) {
                if ("function" != typeof t) throw new Error("Argument is not a function");
                let n;
                return function (...r) {
                    return --e > 0 && t && (n = t.apply(this, r)), e <= 1 && (t = void 0), n
                }
            }(2, (() => {
                (0, m.f)(new Error("localStorage is broken on iOS/MacOS - https://developer.apple.com/forums/thread/109909\nPlease use YaGames.init().then(ysdk => ysdk.getStorage()).then(storage => storage.setItem('key', 'value'))"))
            }));
        const Ze = class e {
            static setup() {
                ze && Object.defineProperty(window, "localStorage", {
                    get: function () {
                        return Qe(), Ke
                    }
                }), Xe && Je && e.setProxy() && e.backup()
            }
            static load() {
                if (e.onloadPromise_) return e.onloadPromise_;
                const t = e.getCustomLocalStorage();
                return t ? (e.onloadPromise_ = Promise.race([Ve(5e3).then((() => {
                    throw new Error("LocalStorage timeout")
                })), l.F.postToParent(i.Qq.GetAll()).then((({
                    data: e
                }) => {
                    for (let [n, r] of Object.entries(e)) t.setItem(n, String(r));
                    return t
                }))]).catch((e => (console.error(e), Ke))), e.onloadPromise_) : Promise.resolve(Ke)
            }
            static getCustomLocalStorage() {
                if ("function" != typeof Proxy) return null;
                return new Proxy({
                    clear() {
                        Ke.clear.call(Ke), l.F.postToParent(i.Qq.Clear())
                    },
                    getItem: e => Ke.getItem.call(Ke, e),
                    key: e => Ke.key.call(Ke, e),
                    get length() {
                        return Ke.length
                    },
                    removeItem(e) {
                        Ke.removeItem.call(Ke, e), l.F.postToParent(i.Qq.Del(e))
                    },
                    setItem(e, t) {
                        Ke.setItem.call(Ke, e, String(t)), l.F.postToParent(i.Qq.Set(e, t))
                    }
                }, {
                    get: function (e, t) {
                        return t in e ? e[t] : e.getItem(String(t))
                    },
                    set: function (e, t, n) {
                        return e.setItem(String(t), n), !0
                    }
                })
            }
            static setProxy() {
                const t = e.getCustomLocalStorage();
                return !!t && (Object.defineProperty(window, "localStorage", {
                    get: function () {
                        return t
                    }
                }), !0)
            }
            static backup() {
                const e = Object.create(null);
                for (let t = 0; t < Ke.length; t++) {
                    const n = Ke.key(t);
                    n && (e[n] = Ke.getItem(n))
                }
                l.F.postToParent(i.Qq.Backup(e))
            }
        };
        Ze.onloadPromise_ = null;
        let et = Ze;

        function tt() {
            return !Xe && He ? Promise.resolve(He) : et.load()
        }
        var nt = Object.defineProperty,
            rt = Object.getOwnPropertySymbols,
            at = Object.prototype.hasOwnProperty,
            ot = Object.prototype.propertyIsEnumerable,
            st = (e, t, n) => t in e ? nt(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: n
            }) : e[t] = n,
            it = (e, t) => {
                for (var n in t || (t = {})) at.call(t, n) && st(e, n, t[n]);
                if (rt)
                    for (var n of rt(t)) ot.call(t, n) && st(e, n, t[n]);
                return e
            };
        const ct = e => ({
            get id() {
                return e.id
            },
            get title() {
                return he(e.title)
            },
            get description() {
                return he(e.description)
            },
            get imageURI() {
                const {
                    image: t
                } = e;
                return t && "object" == typeof t && "url_prefix" in t ? /\.(png|jpg|svg)$/.test(String(t.url_prefix)) ? t.url_prefix : `${t.url_prefix}/default256x256` : "https://yastatic.net/s3/games-static/static-data/images/bonuses/default-bonus-image.png"
            }
        });
        h("Bonus");
        var lt = Object.defineProperty,
            dt = Object.defineProperties,
            ut = Object.getOwnPropertyDescriptors,
            ht = Object.getOwnPropertySymbols,
            pt = Object.prototype.hasOwnProperty,
            mt = Object.prototype.propertyIsEnumerable,
            gt = (e, t, n) => t in e ? lt(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: n
            }) : e[t] = n,
            yt = (e, t) => {
                for (var n in t || (t = {})) pt.call(t, n) && gt(e, n, t[n]);
                if (ht)
                    for (var n of ht(t)) mt.call(t, n) && gt(e, n, t[n]);
                return e
            },
            ft = (e, t) => dt(e, ut(t)),
            vt = (e, t, n) => new Promise(((r, a) => {
                var o = e => {
                        try {
                            i(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    s = e => {
                        try {
                            i(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
                i((n = n.apply(e, t)).next())
            }));
        const wt = () => ({
                params: {
                    lang: xe.i18n.lang
                }
            }),
            bt = class {
                constructor(e) {
                    this.getCatalog = () => vt(this, null, (function* () {
                        var e;
                        const {
                            data: t
                        } = yield l.F.postToParent(i.Aw.Catalog(wt()));
                        return (null != (e = null == t ? void 0 : t.bonuses) ? e : []).map(ct)
                    })), this.getPlayerBonuses = () => vt(this, null, (function* () {
                        const {
                            data: e
                        } = yield l.F.postToParent(i.Aw.PlayerBonuses(ft(yt({}, wt()), {
                            signed: this.signed
                        })));
                        return this.signed ? e : e ? e.map((e => ft(yt({}, ct(e.item)), {
                            receivedAt: e.created,
                            token: e.token
                        }))) : []
                    })), this.consume = e => l.F.postToParent(i.Aw.Consume({
                        params: {
                            token: e
                        },
                        signed: this.signed
                    })).then((({
                        data: e
                    }) => e)), this.signed = Boolean(e)
                }
            };
        bt.init = e => {
            const {
                getCatalog: t,
                getPlayerBonuses: n,
                consume: r
            } = new bt(e), a = {
                getCatalog: t,
                getPlayerBonuses: n,
                consume: r
            };
            return a
        };
        let Pt = bt;
        const Et = h("captureAlert"),
            St = 250;

        function kt(e) {
            var t, n;
            if ("DIV" === e.tagName && e.getAttribute("style") && !e.querySelector("div") && !e.classList.length && !e.id) {
                const e = "OK" === (null == (t = document.querySelector("button")) ? void 0 : t.textContent) && (null == (n = document.querySelector("span")) ? void 0 : n.textContent);
                e && (Et(`popup message = ${e}`), l.F.postToParent((0, i.Bz)({
                    message: e.substring(0, St),
                    popup: !0
                })))
            }
        }

        function At() {
            const e = "createUnityInstance" in window || "UnityLoader" in window;
            if (Et("captureUnityAlert isUnity", e), !e) return;
            if (document.querySelectorAll("div[style]:not([id]):not([class])").forEach(kt), "undefined" != typeof MutationObserver) {
                const e = new MutationObserver((e => {
                    e.forEach((e => {
                        "childList" === e.type && setTimeout((() => {
                            Array.from(e.addedNodes).forEach(kt)
                        }), 0)
                    }))
                }));
                e.observe(document.body, {
                    childList: !0,
                    subtree: !0
                }), window.addEventListener("unload", (() => {
                    e.disconnect()
                }))
            }
        }
        const Tt = new class {
            writeText(e) {
                try {
                    e = String(e)
                } catch (e) {
                    return Promise.reject(new Error("Error while stringified provided value"))
                }
                return new Promise(((t, n) => {
                    const r = y("ClipboardPublic.writeText");
                    l.F.postToParent(i.u8.WriteText({
                        text: e
                    })).then((() => t(void 0))).catch(n).finally((() => {
                        r()
                    }))
                }))
            }
        };
        class Ot {
            constructor(e = "desktop") {
                this._type = e
            }
            get type() {
                return this._type
            }
            isMobile() {
                return "mobile" === this.type
            }
            isTablet() {
                return "tablet" === this.type
            }
            isDesktop() {
                return "desktop" === this.type
            }
            isTV() {
                return "tv" === this.type
            }
        }
        var It = n(399);
        const Dt = [{
            regexp: new RegExp("User .+ already exists in users list!"),
            title: "User already exists in users list!"
        }, {
            regexp: new RegExp("\\(Filename:.+Line: -?[0-9]+\\)"),
            title: "Unity"
        }, {
            substr: "UnityEngine",
            title: "Unity"
        }, {
            substr: "Dimensions must match",
            title: "Unity"
        }, {
            substr: "Loading FSB failed for audio clip",
            title: "Unity"
        }, {
            substr: "UnityLoader",
            title: "Unity"
        }, {
            substr: "FS.syncfs operations in flight at once, probably just doing extra work",
            title: "Unity"
        }, {
            substr: "GLSL",
            title: "GLSL"
        }, {
            substr: "ValerypopoffJS plugin",
            title: "ValerypopoffJS plugin"
        }, {
            substr: "https://github.com/cocos-creator/engine",
            title: "cocos-creator"
        }, {
            substr: "Wicket.Ajax",
            title: "Wicket.Ajax"
        }, {
            substr: 'Error loading sound "%s"',
            title: '"loading sound"'
        }, {
            substr: "Error loading image",
            title: '"loading image"'
        }, {
            substr: "Error loading Texture",
            title: '"loading Texture"'
        }, {
            substr: "Error loading asset",
            title: '"loading asset"'
        }, {
            substr: "Error loading audio url",
            title: '"loading audio url"'
        }, {
            substr: "Error loading animation resource",
            title: '"loading animation resource"'
        }, {
            substr: "Failed to load resource:",
            title: '"loading resource"'
        }, {
            substr: "Could not load",
            title: '"loading"'
        }, {
            substr: "Failed to load",
            title: '"loading"'
        }, {
            regexp: new RegExp("[Cc]ould not allocate memory"),
            title: "working with memory"
        }, {
            substr: "Out of executable memory in function at index",
            title: "working with memory"
        }, {
            substr: "memory access out of bounds",
            title: "working with memory"
        }, {
            substr: "pre-main prep time: ",
            title: '"pre-main prep time"'
        }, {
            substr: "FAILED DIGGING: ",
            title: '"DIGGING"'
        }, {
            substr: "sth wrong with connection!",
            title: '"sth wrong with connection!"'
        }, {
            substr: "Object2D is not available",
            title: '"Object2D is not available"'
        }, {
            regexp: new RegExp("^Client : Error finish action.*?respawn$"),
            title: '"finish action respawn"'
        }, {
            substr: "[TokenStorageYandex]",
            title: "TokenStorageYandex"
        }, {
            substr: "TOO_SMALL_CONTAINER",
            title: "TOO_SMALL_CONTAINER"
        }, {
            substr: "Too small container",
            title: "TOO_SMALL_CONTAINER"
        }, {
            substr: "window.cb",
            title: "Error related to window.cb"
        }, {
            substr: "Not allowed to call RecalculateBounds",
            title: "Not allowed to call RecalculateBounds"
        }, {
            regexp: /Loading chunk.*?partner-code-bundles/,
            title: "Loading chunk partner-code-bundles errors"
        }, {
            substr: "[pcode] Loading chunk",
            title: "Loading chunk partner-code-bundles errors"
        }, {
            regexp: /Loading chunk \S+ failed after \d+ retries/,
            title: "Loading chunk loadable-components errors"
        }, {
            substr: "loadable-components: failed to asynchronously load component",
            title: "Loading component loadable-components errors"
        }];

        function xt(e, t) {
            return t
        }
        const _t = function ({
                matchers: e,
                updateErrorTitle: t = xt
            }) {
                return function (n) {
                    for (const r of e)
                        if (r.regexp && -1 !== n.search(r.regexp) || r.substr && n.includes(r.substr)) return {
                            message: `[grouped] ${t(n,r.title)}`,
                            additional: {
                                message: n
                            }
                        };
                    return {
                        message: n
                    }
                }
            }({
                matchers: Dt
            }),
            Ct = e => {
                const t = (e => e.map((e => {
                        if ("object" == typeof e) try {
                            return JSON.stringify(e)
                        } catch (t) {
                            return `${e}: ${t.message}`
                        }
                        return String(e)
                    })).join(" "))(e),
                    n = _t(t),
                    r = new Error(n.message);
                return n.additional && (r.additional = n.additional), r
            };
        var Lt = Object.defineProperty,
            Rt = Object.getOwnPropertySymbols,
            Ft = Object.prototype.hasOwnProperty,
            Nt = Object.prototype.propertyIsEnumerable,
            Gt = (e, t, n) => t in e ? Lt(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: n
            }) : e[t] = n,
            $t = (e, t) => {
                for (var n in t || (t = {})) Ft.call(t, n) && Gt(e, n, t[n]);
                if (Rt)
                    for (var n of Rt(t)) Nt.call(t, n) && Gt(e, n, t[n]);
                return e
            };

        function jt(e, t) {
            t && (e.type = t), l.F.postToParent((0, i._X)(e)).catch((e => {
                console.warn(e)
            }))
        }

        function Mt(e) {
            return {
                data: {
                    additional: {
                        sdkVersion: 2
                    }
                },
                error: e,
                source: "game",
                sourceMethod: (0, It.Z)(e.stack)
            }
        }
        const Ut = new class {
            constructor(e, t) {
                this.source = e, this.additionalErrorData = t, this.source = e, window.addEventListener("error", this), "Promise" in window && window.addEventListener("unhandledrejection", this)
            }
            addLogger(e) {
                this.logger = e
            }
            handleEvent(e) {
                this._handleEvent(e)
            }
            _handleEvent(e, t = "error") {
                try {
                    this._unsafeHandleEvent(e, t)
                } catch (e) {
                    console.warn("Couldn't handle event in ErrorCounter!", e)
                }
            }
            _unsafeHandleEvent(e, t) {
                return "unhandledrejection" === e.type ? this._unsafeHandlePromiseRejectionEvent(e) : this._unsafeHandleErrorEvent(e, t)
            }
            _unsafeHandlePromiseRejectionEvent(e) {
                var t;
                const {
                    reason: n
                } = e;
                if (!n) return;
                let r;
                const a = {};
                n.stack && n.message ? r = n.message : (r = String(n), "[object Event]" === r ? r = "event.type: " + n.type : "[object Object]" === r && (a.unhandledObject = n, r = n.message || "Undefined error message")), (null == (t = n.target) ? void 0 : t.src) && (a.src = n.target.src);
                const o = {
                    additional: a,
                    message: "Unhandled rejection: " + r,
                    name: "UnhandledPromiseError",
                    stack: n.stack || ""
                };
                console.error(o.message, F.X4, o), this._postError(o, "unhandled")
            }
            _unsafeHandleErrorEvent(e, t) {
                var n, r, a, o, s;
                const {
                    error: i
                } = e, c = {
                    columnNumber: null != (r = null != (n = e.colno) ? n : null == i ? void 0 : i.columnNumber) ? r : -1,
                    fileName: this._trimErrorData(e.filename || (null == i ? void 0 : i.fileName) || "", 200),
                    lineNumber: null != (o = null != (a = e.lineno) ? a : null == i ? void 0 : i.lineNumber) ? o : -1,
                    message: this._trimErrorData(e.message || (null == i ? void 0 : i.message) || "", 200),
                    name: this._trimErrorData((null == i ? void 0 : i.name) || "Error", 200),
                    stack: this._trimErrorData(null != (s = null == i ? void 0 : i.stack) ? s : "", 3e3)
                };
                (this.additionalErrorData || (null == i ? void 0 : i.additional)) && (c.additional = $t($t({}, null == i ? void 0 : i.additional), this.additionalErrorData)), console.error(c.message, F.X4, c), this._postError(c, t)
            }
            _trimErrorData(e, t) {
                return "string" == typeof e && e.length > t ? e.substring(0, t) : e
            }
            _postError(e, t) {
                var n;
                let r = (0, It.Z)(e.stack);
                "ErrorListener.handleEvent" === r && (r = "unknown"), null == (n = this.logger) || n.call(this, {
                    data: {
                        additional: e.additional || {}
                    },
                    block: `${this.source}-${t}`,
                    error: e,
                    source: this.source,
                    sourceMethod: r
                }, t)
            }
        }("game");
        Ut.addLogger(jt),
            function () {
                try {
                    const e = console.error;
                    console.error = (...t) => {
                        let n = t.filter((e => e instanceof Error))[0];
                        n || (n = Ct(t));
                        try {
                            "string" == typeof t[1] && t[1] === F.X4 ? t.splice(1, 1) : jt(Mt(n), "console.error")
                        } catch (e) {}
                        e.apply(console, t)
                    }
                } catch (e) {
                    try {
                        jt(Mt(e), "error")
                    } catch (e) {}
                }
            }();
        const Bt = h("Events bus", "Dev", {
                background: "#0072B5",
                text: "#ffffff"
            }),
            Yt = new f(Bt),
            Vt = [c.US, c.Tn, c.Ul],
            Ht = e => {
                l.F.postToParent(i._W.ListenersChange({
                    event: e,
                    count: Yt.getObserversNumber(e)
                }))
            },
            Kt = {
                EXIT: Ht,
                HISTORY_BACK: Ht
            },
            Wt = (e, t) => {
                Bt(`[on]: {${e}}`);
                const n = Kt[e],
                    r = Yt.subscribe(e, t);
                return null == n || n(e), () => {
                    r(), null == n || n(e)
                }
            },
            qt = (e, t) => {
                var n;
                Bt(`[off]: {${e}}`), Yt.unsubscribe(e, t), null == (n = Kt[e]) || n.call(Kt, e)
            },
            Xt = (e, t) => {
                Bt(`[notifyObservers]: {${e}}`, ...t ? [t] : []), Yt.notifyObservers(Array.isArray(e) ? e : [e], t)
            };
        l.F.onExternalMessage(Vt, (({
            data: {
                action: e,
                data: t
            }
        }) => Xt(e, t)));
        const Jt = h("Gameplay | Child frame", "Dev", {
                background: "#6c5b7b",
                text: "#ffffff"
            }),
            zt = e => {
                Jt(`[POST]: {${e}}`), l.F.postToParent((0, i.$J)(e))
            };
        const Qt = new Set;
        let Zt = !1;
        const en = "function" != typeof Proxy ? e => e : (e, t, n) => Zt ? e : new Proxy(e, {
                get: (e, r) => ("symbol" != typeof r && !Zt && t.includes(r) && Qt.add(`${n}.${r}`), e[r])
            }),
            tn = () => {
                Zt || (l.F.postToParent((0, i.Iq)(Array.from(Qt).join(","))), Qt.clear(), Zt = !0)
            };
        var nn;
        const rn = "/helpers/fake-page/1/index.html",
            an = Symbol("promises");
        nn = an;
        let on = class e {
            constructor() {
                if (this[nn] = new Map, e.instance) return e.instance
            }
            getAllGames() {
                const e = this[an].get("all");
                if (e) return e;
                const t = y("getAllGames"),
                    n = new Promise(((e, n) => l.F.postToParent(i.Rh.All()).then((({
                        data: t
                    }) => {
                        var n;
                        (null == (n = window.YandexGamesSDKEnvironment) ? void 0 : n.useMockGameLinks) && (t.games.forEach((e => e.url = `${rn}`)), t.developerURL = `${rn}`), e(t)
                    })).catch((e => {
                        this[an].delete("all"), n(e)
                    })).finally((() => t()))));
                return this[an].set("all", n), n
            }
            getGameByID(e) {
                const t = this[an].get(`${e}`);
                if (t) return t;
                const n = y("getGameByID"),
                    r = new Promise(((t, r) => l.F.postToParent(i.Rh.Game(e)).then((({
                        data: e
                    }) => {
                        var n;
                        (null == (n = window.YandexGamesSDKEnvironment) ? void 0 : n.useMockGameLinks) && e.game && (e.game.url = `${rn}`), t(e)
                    })).catch((t => {
                        this[an].delete(`${e}`), r(t)
                    })).finally((() => n()))));
                return this[an].set(`${e}`, r), r
            }
        };
        on.instance = en(new on, ["getGameByID", "getAllGames"], "GamesAPI");
        const sn = on.instance,
            cn = class e {
                constructor() {
                    this.isReady = !1, this.startTimestamp = Date.now(), this.startReadyFallbackTimeout()
                }
                ready() {
                    if (this.isReady) return void console.warn("Don't call %cfeatures.LoadingAPI.ready() %cmore than one time.", "color: green", "color: unset");
                    this.isReady = !0;
                    const e = Date.now() - this.startTimestamp;
                    this.logGameInitTime(e, c.ur.GameReady), clearTimeout(this.readyFallbackTimerId)
                }
                logGameInitTime(e, t) {
                    l.F.postToParent((0, i.OI)(t, {
                        timeFromInit: e
                    }))
                }
                startReadyFallbackTimeout() {
                    this.readyFallbackTimerId = window.setTimeout((() => {
                        this.logGameInitTime(e.MAX_TIMEOUT, c.ur.GameReadyForce)
                    }), e.MAX_TIMEOUT)
                }
            };
        cn.MAX_TIMEOUT = 3e4;
        let ln = cn;
        var dn;
        const un = {
            [c.VR.GameplayAPI]: class {
                start() {
                    zt(c.BE.Start)
                }
                stop() {
                    zt(c.BE.Stop)
                }
            },
            [c.VR.LoadingAPI]: ln,
            [c.VR.PluginEngineDataReporterAPI]: class {
                constructor() {
                    this.isReported = !1
                }
                report(e) {
                    this.isReported ? console.warn("Don't call %cfeatures.PluginEngineDataReporterAPI.report() %cmore than one time.", "color: green", "color: unset") : (this.logData(e), this.isReported = !0)
                }
                logData(e) {
                    l.F.postToParent((0, i.Xk)(e))
                }
            }
        };
        class hn {
            constructor(e = {}) {
                this[dn] = sn;
                for (let t in c.VR) c.VR[t] in e && e[c.VR[t]] && (this[t] = new un[t]);
                for (let t of c.Hn) !this[t] && (t in e && e[t] || !(t in e)) && (this[t] = new un[t]);
                l.F.postToParent((0, i.OI)(c.ur.GameInit))
            }
        }
        c.VR.GameplayAPI, c.VR.LoadingAPI, c.VR.PluginEngineDataReporterAPI, dn = c.VR.GamesAPI;
        var pn = (e => (e.GAME_RATED = "GAME_RATED", e.NO_AUTH = "NO_AUTH", e.REVIEW_ALREADY_REQUESTED = "REVIEW_ALREADY_REQUESTED", e.REVIEW_WAS_REQUESTED = "REVIEW_WAS_REQUESTED", e.UNKNOWN = "UNKNOWN", e))(pn || {});
        const mn = new class {
            canReview() {
                return new Promise((e => {
                    const t = y("Feedback.canReview");
                    l.F.postToParent(i.E0.CanReview()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((t => {
                        (0, m.f)(t), e({
                            reason: pn.UNKNOWN,
                            value: !1
                        })
                    })).finally((() => {
                        t()
                    }))
                }))
            }
            requestReview() {
                return new Promise((e => {
                    const t = y("Feedback.requestReview", 12e4);
                    l.F.postToParent(i.E0.RequestReview()).then((({
                        data: t
                    }) => {
                        const {
                            feedbackSent: n,
                            reason: r
                        } = t;
                        r ? ((0, m.f)(r), e({
                            feedbackSent: null != n && n
                        })) : e({
                            feedbackSent: null == n || n
                        })
                    })).catch((t => {
                        (0, m.f)(t), e({
                            feedbackSent: !1
                        })
                    })).finally((() => {
                        t()
                    }))
                }))
            }
        };

        function gn() {
            l.F.postToParent((0, i.Ry)({
                url: location.href,
                draftDetectedInIframe: D()
            }))
        }

        function yn(e) {
            try {
                return "WebGLRenderingContext" in window && Boolean(e.getContext("webgl") || e.getContext("experimental-webgl") instanceof WebGLRenderingContext)
            } catch (e) {
                (0, m.f)(e, {
                    sourceMethod: "isWebGLSupported",
                    level: "warn"
                })
            }
            return !1
        }

        function fn(e) {
            try {
                return "WebGL2RenderingContext" in window && Boolean(e.getContext("webgl2") || e.getContext("experimental-webgl2") instanceof WebGL2RenderingContext)
            } catch (e) {
                (0, m.f)(e, {
                    sourceMethod: "isWebGL2Supported",
                    level: "warn"
                })
            }
            return !1
        }

        function vn() {
            const e = [];
            return "createUnityInstance" in window && e.push("unity"), e
        }

        function wn() {
            const e = [],
                t = {
                    webassembly: "WebAssembly" in window,
                    webgl: yn(document.createElement("canvas")),
                    webgl2: fn(document.createElement("canvas"))
                };
            return Object.keys(t).filter((e => t[e])).forEach((t => {
                e.push(t)
            })), e
        }
        const bn = {
            allow() {
                l.F.postToParent((0, i.Al)())
            }
        };

        function Pn(...e) {
            const t = e => e && "object" == typeof e;
            return e.reduce(((e, n) => (Object.keys(n).forEach((r => {
                const a = e[r],
                    o = n[r];
                Array.isArray(a) && Array.isArray(o) ? e[r] = a.concat(...o) : t(a) && t(o) ? e[r] = Pn(a, o) : e[r] = o
            })), e)), {})
        }

        function En(e) {
            if (!e || "object" != typeof e) return {};
            ! function (e) {
                "partnerId" in e && (delete e.partnerId, console.warn("`partnerId` is deprecated in the SDKv2"))
            }(e)
        }

        function Sn(e, t = {}) {
            var n, r, a;
            return (null == (r = null == (n = window.YandexGamesSDKEnvironment) ? void 0 : n.request.experiments) ? void 0 : r.signed) && (t.signed = !0), En(t), "object" == typeof (a = t) && Object.keys(a).forEach((e => {
                    "signed" !== e && (0, m.f)(new Error(`Using deprecated key in YaGames.init options: ${e}`))
                })),
                function (e = {}) {
                    return function (e) {
                        "adv" in e && N.sendOnceDeprecatedUsage("SDK init options with adv");
                        e.adv = e.adv || {},
                            function (e) {
                                if ("onAdvClose" in e && "function" != typeof e.onAdvClose) throw new Error('"onAdvClose" must be a function')
                            }(e.adv)
                    }(e), e
                }(Pn(null != e ? e : {}, t))
        }
        const kn = (e = {}) => Oe(e);
        const An = class {
            constructor() {
                this.promiseWrappers = Object.create(null)
            }
            getKey(e) {
                return JSON.stringify(e)
            }
            getFor(e) {
                return this.promiseWrappers[this.getKey(e)]
            }
            setFor(e, t) {
                t ? this.promiseWrappers[this.getKey(e)] = t : delete this.promiseWrappers[this.getKey(e)]
            }
            clear() {
                this.promiseWrappers = Object.create(null)
            }
        };
        const Tn = h("PlayerProxy");
        const On = new An;

        function In() {
            return e = this, t = arguments, n = function* (e = {}) {
                var t;
                const n = null == (t = On.getFor(e)) ? void 0 : t.promise;
                if (n) return n;
                const r = y("getPlayer", 12e4),
                    a = new p;
                return a.promise.finally((() => {
                    r()
                })), On.setFor(e, a), window.setTimeout((() => {
                    On.setFor(e, void 0)
                }), 3e5), l.F.postToParent((0, i.HT)({
                    config: e
                })).then((({
                    data: t
                }) => {
                    const {
                        data: n,
                        signature: r
                    } = t, o = function (e, t, n) {
                        const r = new Ye(t, e);
                        return se(r, n), en(r, ["getPayingStatus", "getStats", "getData", "getName"], "Player")
                    }(e, n, r);
                    a.resolve(o)
                })).catch((t => {
                    On.setFor(e, void 0), a.reject(t)
                })), a.promise
            }, new Promise(((r, a) => {
                var o = e => {
                        try {
                            i(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    s = e => {
                        try {
                            i(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
                i((n = n.apply(e, t)).next())
            }));
            var e, t, n
        }
        l.F.onExternalMessage("auth", (e => {
            ["auth-dialog-cancel", "auth-dialog-success", "changed"].includes(e.data.action) && (Tn("Clear getPlayer promises."), On.clear())
        }));
        class Dn {
            constructor() {
                this.onMessage = e => {
                    const {
                        action: t
                    } = e.data;
                    "fullscreenchange" === t && (document.dispatchEvent(new Event("fullscreenchange")), this._status = e.data.data.isFullscreen ? "on" : "off")
                }, this._status = "off", this.overrideBrowserFullscreenElement(), this.initMessaging(), this.updateStatus()
            }
            get STATUS_ON() {
                return "on"
            }
            get STATUS_OFF() {
                return "off"
            }
            get status() {
                return this._status
            }
            request() {
                const e = y("FullscreenManager.request"),
                    t = l.F.postToParent(i.Vo.RequestFullscreen());
                return t.finally((() => {
                    e()
                })), t
            }
            exit() {
                const e = y("FullscreenManager.exit"),
                    t = l.F.postToParent(i.Vo.ExitFullscreen());
                return t.finally((() => {
                    e()
                })), t
            }
            toggle() {
                const e = y("FullscreenManager.toggle"),
                    t = l.F.postToParent(i.Vo.ToggleFullscreen());
                return t.finally((() => {
                    e()
                })), t
            }
            updateStatus() {
                l.F.postToParent(i.Vo.GetState()).then((e => {
                    const {
                        isFullscreen: t
                    } = e.data;
                    this._status = t ? "on" : "off"
                }))
            }
            overrideBrowserFullscreenElement() {
                try {
                    Object.getOwnPropertyDescriptor(document, "fullscreenElement") || Object.defineProperty(document, "fullscreenElement", {
                        enumerable: !1,
                        configurable: !0,
                        get: () => this.status === this.STATUS_ON ? document.documentElement : null
                    })
                } catch (e) {
                    (0, m.f)(e)
                }
            }
            initMessaging() {
                l.F.onExternalMessage("screen-manager", this.onMessage)
            }
        }
        class xn {
            constructor() {
                this.fullscreen = new Dn
            }
        }
        const _n = Date.now(),
            Cn = `active_${_n}`,
            Ln = `cursorHighlighter_${_n}`,
            Rn = `id_cursorHighlighter_${_n}`,
            Fn = e => {
                let t;
                e || (() => {
                    if (document.head.querySelector(`#${Rn}`)) return;
                    const e = document.createElement("style");
                    e.id = Rn, e.innerHTML = `\n        .${Ln} {\n            position: absolute;\n            z-index: 1000;\n\n            display: none;\n\n            width: 16px;\n            height: 16px;\n\n            pointer-events: none;\n\n            border: 3px solid #f00;\n            border-radius: 50%;\n\n            transform: translate(-50%, -50%);\n        }\n\n        .${Ln}.${Cn} {\n            display: initial;\n        }\n    `, document.head.appendChild(e)
                })();
                let n, r, a, o = !1;
                const s = document.createElement("div"),
                    {
                        activeClass: i = Cn,
                        mainClass: c = Ln
                    } = null != e ? e : {};
                s.classList.add(c), document.body.appendChild(s);
                const l = (e, t) => {
                        r = e, a = t, n || (n = requestAnimationFrame((() => {
                            n = 0, s.style.left = `${r}px`, s.style.top = `${a}px`
                        })))
                    },
                    d = ({
                        pageX: e,
                        pageY: n
                    }) => {
                        clearTimeout(t), o = !0, s.classList.add(i), l(e, n)
                    },
                    u = ({
                        pageX: e,
                        pageY: t
                    }) => {
                        o && l(e, t)
                    },
                    h = () => {
                        t = setTimeout((() => s.classList.remove(i)), 250), o = !1
                    };
                return {
                    startHighlighting: () => {
                        document.addEventListener("mousedown", d), document.addEventListener("mousemove", u), document.addEventListener("mouseup", h)
                    },
                    stopHighlighting: () => {
                        document.removeEventListener("mousedown", d), document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", h), s.classList.remove(i)
                    }
                }
            };
        const Nn = {
            [c.q1.EXIT]: !0
        };
        const Gn = ["passport.ya", "passport.yandex", "an.yandex.ru", "avatars.mds.yandex.net", "/api/"];

        function $n(e) {
            const t = Cache.prototype[e];
            Cache.prototype[e] = function (e, n) {
                return "GET" !== e.method || 0 !== e.url.indexOf("https://") || (r = e.url, Gn.some((e => -1 !== r.indexOf(e)))) ? Promise.resolve() : ("ignoreSearch" in (n = n || {}) || (n.ignoreSearch = !0), t.call(this, e, n));
                var r
            }
        }
        const jn = class {
            static overrideCacheSearch() {
                ("function" != typeof Cache ? (console.warn("Can not find `Cache` function"), 0) : "function" != typeof Cache.prototype.match ? (console.warn("Can not find `Cache.match` function"), 0) : "function" == typeof Cache.prototype.matchAll || (console.warn("Can not find `Cache.matchAll` function"), 0)) && ($n("match"), $n("matchAll"))
            }
        };
        const Mn = new class {
            canShowPrompt() {
                return new Promise((e => {
                    const t = y("Shortcut.canShowPrompt");
                    l.F.postToParent(i.lW.CanShowPrompt()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((e => {
                        (0, m.f)(e)
                    })).finally((() => {
                        t()
                    }))
                }))
            }
            showPrompt() {
                return new Promise((e => {
                    const t = y("Shortcut.showPrompt", 12e4);
                    l.F.postToParent(i.lW.ShowPrompt()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((e => {
                        (0, m.f)(e)
                    })).finally((() => {
                        t()
                    }))
                }))
            }
        };
        const Un = () => {
            return e = void 0, t = null, n = function* () {
                return new Promise(((e, t) => {
                    const n = `${Date.now()}-${Math.random()}`,
                        r = setTimeout((() => {
                            t(new Error("Get external iframe timeout"))
                        }), 500);
                    window.addEventListener("message", (function t(a) {
                        const {
                            data: o
                        } = function (e) {
                            try {
                                return {
                                    data: JSON.parse(e),
                                    error: null
                                }
                            } catch (e) {
                                return {
                                    data: null,
                                    error: e
                                }
                            }
                        }(a.data);
                        o && o.messageId === n && (window.removeEventListener("message", t), clearTimeout(r), e(o.payload))
                    })), window.parent.postMessage(JSON.stringify({
                        source: "YandexGamesSDK",
                        actionName: "GET_IFRAME_ORIGIN_SRC",
                        channel: "EARLY_SDK_EVENT",
                        messageId: n
                    }), "*")
                }))
            }, new Promise(((r, a) => {
                var o = e => {
                        try {
                            i(n.next(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    s = e => {
                        try {
                            i(n.throw(e))
                        } catch (e) {
                            a(e)
                        }
                    },
                    i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
                i((n = n.apply(e, t)).next())
            }));
            var e, t, n
        };

        function Bn() {
            return new Promise((e => {
                if ("loading" === document.readyState) {
                    const t = () => {
                        "loading" !== document.readyState && (document.removeEventListener("readystatechange", t), e())
                    };
                    document.addEventListener("readystatechange", t)
                } else e()
            }))
        }
        const Yn = new An;

        function Vn(e = {}) {
            const {
                clientFeatures: t = [],
                defaultFlags: n = {}
            } = e, r = Yn.getFor(e);
            if (r) return r.promise;
            const a = y("get_flags/fetch"),
                o = new p;
            return o.promise.finally((() => {
                a()
            })), Yn.setFor(e, o), l.F.postToParent(i.XT.Fetch({
                clientFeatures: t
            })).then((({
                data: e
            }) => {
                const t = Object.assign(n, e);
                o.resolve(t)
            })).catch((() => {
                o.resolve(n), Yn.setFor(e, void 0)
            })), o.promise
        }
        class Hn {
            reachGoal(e, t, n) {
                l.F.postToParent(i.eU.ReachGoal({
                    counterId: e,
                    target: t,
                    goalData: n
                }))
            }
            sendGoal(e, t, n) {
                console.warn('"sendGoal" method is deprecated. Please use "reachGoal" instead.'), l.F.postToParent(i.eU.ReachGoal({
                    counterId: e,
                    target: t,
                    goalData: n
                }))
            }
            hit(e, t = {}) {
                l.F.postToParent(i.eU.Hit({
                    counterId: e,
                    hitData: t
                }))
            }
        }
        var Kn = (e, t, n) => new Promise(((r, a) => {
            var o = e => {
                    try {
                        i(n.next(e))
                    } catch (e) {
                        a(e)
                    }
                },
                s = e => {
                    try {
                        i(n.throw(e))
                    } catch (e) {
                        a(e)
                    }
                },
                i = e => e.done ? r(e.value) : Promise.resolve(e.value).then(o, s);
            i((n = n.apply(e, t)).next())
        }));
        const Wn = h("sdkv2");
        ! function () {
            var e;
            if (D()) Et("alert hook disabled");
            else try {
                "function" == typeof window.alert && (e = window.alert, window.alert = function () {
                    const t = arguments[0];
                    return Et(`alert message = ${t}`), l.F.postToParent((0, i.Bz)({
                        message: t.substring(0, St)
                    })), e.apply(this, arguments)
                }), window.addEventListener("load", At, {
                    once: !0
                }), Et("alert hook enabled")
            } catch (e) {
                (0, m.f)(e, {
                    prefix: "game_hook_alert exp error: ",
                    level: "warn"
                })
            }
        }();
        const qn = Kn(void 0, null, (function* () {
            return function ({
                staticOrigin: n,
                version: r,
                logError: s
            }) {
                if (window.loadPolyfillsPromise) return window.loadPolyfillsPromise;
                let i = [
                    [e.LEGACY, Boolean(Array.prototype.at)],
                    [e.INTERSECTION_OBSERVER, Boolean("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype)],
                    [e.SMOOTH_SCROLL, Boolean("scrollBehavior" in document.documentElement.style)],
                    [e.ABORT_CONTROLLER, "undefined" != typeof AbortController],
                    [e.GLOBAL_THIS, "object" == typeof globalThis]
                ].filter((([, e]) => !e));
                return window.loadPolyfillsPromise = new Promise(((e, o) => {
                    i.length ? document.head.appendChild(t({
                        id: "loadPolyfillHash",
                        src: a(n, `stats-hash.js?v=${r||(new Date).setUTCHours(12,0,0,0)}`),
                        onErrCb: o,
                        onLoadCb: e
                    })) : e()
                })).then((() => Promise.all(i.map((([e]) => new Promise(((r, a) => {
                    document.head.appendChild(t({
                        id: e,
                        src: o(n, e),
                        onErrCb: a,
                        onLoadCb: r
                    }))
                }))))))).catch((e => {
                    s({
                        block: "Polyfill",
                        message: "Error while loading polyfills",
                        additional: {
                            error: e
                        }
                    })
                })), window.loadPolyfillsPromise
            }({
                staticOrigin: "//yastatic.net/s3/games-static/_/build",
                logError: (e, t) => (0, m.f)(t, e)
            })
        })).then((() => {
            (() => {
                if (window.top !== window) return;
                const {
                    hash: e,
                    hostname: t,
                    search: n
                } = window.location;
                if (!/(games\.s3\.yandex\.net|games-storage(-awst?)?\.yandex\.net)$/.test(t)) return;
                const r = (0, Pe.o)();
                if (!r) return;
                let a;
                a = /games\.s3\.yandex\.net$/.test(t) ? `https://yandex.ru/games/app/${r}${n}${e}` : `https://yandex.com/games/app/${r}${n}${e}`, window.top.location.replace(a)
            })(), gn(), window.loadEnvironmentPromise = window.loadEnvironmentPromise || new Promise(((e, t) => {
                    const n = y("loadEnvironment");
                    l.F.postToParent((0, i.VT)()).then((({
                        data: t
                    }) => {
                        e(t)
                    })).catch((e => {
                        t(e)
                    })).finally((() => {
                        n()
                    }))
                })).then((e => {
                    const t = !("enviroment" in e && "options" in e),
                        n = t ? e : e.enviroment;
                    return window.YandexGamesSDKEnvironment = n, Wn("APP_VERSION", n.APP_VERSION), !t && e.options
                })),
                function (e) {
                    const t = s(e, 2e3),
                        n = ["click", "keydown", "keyup", "mousedown", "mouseenter", "mouseleave", "mouseup", "pointerup", "touchcancel", "touchend", "touchmove", "touchstart"];
                    n.forEach((e => document.addEventListener(e, t, {
                        passive: !0,
                        capture: !0
                    })))
                }((() => l.F.postToParent((0, i.Vw)())))
        }));
        let Xn, Jn;
        class zn {
            constructor(e) {
                var t, n;
                e = Sn(e), this.EVENTS = {
                    BONUS_AWARDED: c.q1.BONUS_AWARDED,
                    EXIT: c.q1.EXIT,
                    HISTORY_BACK: c.q1.HISTORY_BACK
                }, this.dispatchEvent = function (e, t) {
                    const n = y("getSdkEventsDispatcher");
                    return new Promise(((r, a) => {
                        if (!(e in Nn)) {
                            const t = `Yandex SDK Event ${e} is not in supported.`;
                            return console.warn(t), void a(new Error(t))
                        }
                        const o = {};
                        if (void 0 !== t) try {
                            o.detail = JSON.stringify(t)
                        } catch (e) {
                            return console.warn(e), void a(new Error('Wrong "detail" argument'))
                        }
                        l.F.postToParent((0, i.TI)(e, o)).then((() => {
                            r(!0)
                        })).catch((e => {
                            a(e)
                        })).finally((() => {
                            n()
                        }))
                    }))
                }, this.onEvent = (e, t) => (console.warn("Deprecated usage of `ysdk.onEvent`, please use `ysdk.on(...)` instead."), Wt(e, t)), this.achievements = P.init(), this.adv = en(new C(e), ["showBannerAdv"], "AdvManager"), this.analytics = {
                    yaMetrikaCounter: en(new Hn, ["hit", "reachGoal", "sendGoal"], "YaMetrikaCounter")
                }, this.auth = L, this.bonuses = Pt.init(e.signed), this.clipboard = Tt, this.deviceInfo = new Ot(e.deviceType), Zn.deviceInfo = this.deviceInfo, this.environment = (e => {
                    if (!new URLSearchParams(location.search).get("debug-mode") || "function" != typeof Proxy) return e;
                    const t = Object.create(e);
                    return Object.defineProperty(t, "i18n", {
                        get() {
                            const t = e.i18n;
                            return new Proxy(t, {
                                get: (e, t) => ("lang" === t && l.F.postToParent(_e.i.I18n()), e[t])
                            })
                        }
                    }), t
                })(xe), this.feedback = mn, this.isAvailableMethod = (n = this, e => {
                    const t = y("isAvailableMethod"),
                        r = l.F.postToParent(i.sC.CheckAvailability({
                            methodToVerify: e
                        })).then((({
                            data: t
                        }) => {
                            const {
                                isAvailable: r
                            } = t;
                            if (!r) return !1;
                            const a = {
                                    leaderboards: re,
                                    payments: Te,
                                    player: Ye,
                                    storage: et.getCustomLocalStorage()
                                },
                                o = e.split(".");
                            let s = it(it({}, a), n);
                            for (let e = 0; e < o.length; e++) {
                                const t = s[o[e]];
                                if (!t) return !1;
                                if (e === o.length - 1) return "function" == typeof t;
                                if (!R(t)) return !1;
                                s = R(t.prototype) ? t.prototype : t
                            }
                            return !1
                        }));
                    return r.finally((() => {
                        t()
                    })), r
                }), this.shortcut = Mn, this.getLeaderboards = ae, this.getPayments = kn, this.getPlayer = In, this.getStorage = tt, this.notifications = bn, this.screen = new xn, this.features = en(new hn(e.features), [c.VR.GameplayAPI, c.VR.LoadingAPI], "FeatureManager"), this.yandexApp = {
                    enabled: Boolean(null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.isYandexApp)
                }, this.serverTime = function () {
                    var e, t;
                    const n = performance.timeOrigin || Date.now(),
                        r = (null == (e = window.YandexGamesSDKEnvironment) ? void 0 : e.serverTime) || n,
                        a = (null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.parentTimeOrigin) || n,
                        o = (performance.timeOrigin || n) - a,
                        s = performance.now.bind(performance);
                    return () => new Date(r + o + s()).valueOf()
                }(), this.getFlags = Vn, this.dispatch = Xt, this.on = Wt, this.off = qt
            }
        }

        function Qn(e) {
            if ("complete" === document.readyState) e();
            else {
                const t = () => {
                    e(), window.removeEventListener("load", t)
                };
                window.addEventListener("load", t)
            }
        }
        try {
            Jn = new URLSearchParams(location.hash.slice(1)).get("device-type")
        } catch (e) {}
        class Zn {
            constructor() {
                throw new Error("Please, use `YaGames.init` instead.")
            }
            static longtaskObserver() {
                var e;
                const t = "longtask";
                if ("undefined" != typeof PerformanceObserver && (null == (e = PerformanceObserver.supportedEntryTypes) ? void 0 : e.includes(t))) {
                    let e;
                    const n = () => {
                            clearTimeout(e), e = setTimeout((() => {
                                "complete" === document.readyState ? r.disconnect() : n()
                            }), 5e3)
                        },
                        r = new PerformanceObserver((e => {
                            e.getEntries().forEach((() => {
                                l.F.postToParent((0, i.jt)()), n()
                            }))
                        }));
                    r.observe({
                        entryTypes: [t]
                    })
                }
                "complete" === document.readyState ? l.F.postToParent((0, i.X0)()) : window.addEventListener("load", (() => {
                    l.F.postToParent((0, i.X0)())
                }))
            }
            static init(e) {
                return Kn(this, null, (function* () {
                    let t = location.hash;
                    try {
                        const e = yield Kn(void 0, null, (function* () {
                            let e;
                            try {
                                e = yield Un()
                            } catch (e) {
                                console.warn("Error get IFrameURL", e)
                            }
                            return new URL(e || location.href)
                        }));
                        t = new URL(e).hash
                    } catch (e) {}
                    return Xn ? (console.warn("YaGames was initialized"), Xn) : (this.longtaskObserver(), Wn("Start initialization"), yield qn, Xn = new Promise(((n, r) => {
                        ! function () {
                            const e = () => {
                                l.F.postToParent((0, i.Sd)()), window.removeEventListener("load", e)
                            };
                            "complete" === document.readyState ? e() : window.addEventListener("load", e)
                        }();
                        const a = a => {
                            try {
                                let r = Sn(a, e);
                                if (!r.deviceType) try {
                                    r.deviceType = new URLSearchParams(t.slice(1)).get("device-type")
                                } catch (e) {
                                    (0, m.f)(e, {
                                        message: "No deviceType in options"
                                    })
                                }
                                Bn().then((() => {
                                    const e = new zn(r);
                                    e.environment.isTelegram && K("loading", {
                                            value: 100
                                        }), r.hasAuth && e.getPlayer({
                                            scopes: !1
                                        }), window.setTimeout(tn, 6e4), n(en(e, ["auth", "getFlags", "getLeaderboards", "getPayments", "getStorage", "serverTime"], "SDK")),
                                        function () {
                                            if (!new URLSearchParams(location.search).get("debug-mode")) return;
                                            const {
                                                startHighlighting: e,
                                                stopHighlighting: t
                                            } = Fn();
                                            l.F.onExternalMessage(c.cV, (({
                                                data: {
                                                    action: n
                                                }
                                            }) => {
                                                switch (n) {
                                                case c.Fs.Start:
                                                    e();
                                                    break;
                                                case c.Fs.Stop:
                                                    t()
                                                }
                                            }))
                                        }()
                                }))
                            } catch (e) {
                                (0, m.f)(e), r(e)
                            }
                        };
                        window.loadEnvironmentPromise.then((e => {
                            e ? a(e) : new Promise(((e, t) => {
                                const n = y("loadOptions");
                                l.F.postToParent((0, i.Gd)()).then((({
                                    data: t
                                }) => {
                                    e(t)
                                })).catch((e => {
                                    t(e)
                                })).finally((() => {
                                    n()
                                }))
                            })).then(a).catch((e => {
                                console.warn(`Options load failed with error ${e}`), a()
                            }))
                        })).catch((e => {
                            (0, m.f)(e), a()
                        })), setTimeout((() => {
                            const e = {
                                clientTech: wn(),
                                gameTech: vn()
                            };
                            Wn("checkAndSendGameInfo tech data:", e), Qn((() => {
                                l.F.postToParent((0, i.cp)(e))
                            }))
                        }), 1e4)
                    })), Xn.then((() => Wn("Initialized"))), Xn)
                }))
            }
        }
        if (Zn.deviceInfo = new Ot(Jn), window.YaGames && window.YaGamesAdded) {
            const e = 'YaGames is already defined. Please, check double <script src="https://yandex.ru/games/sdk/v2"> on the page.';
            D() && l.F.postToParent((0, i.qs)(new Error(e))), (0, m.T)(new Error(e))
        } else {
            if (window.parent !== window) {
                const e = (0, i.ce)();
                console.info(`SDK Init. Version: ${e.data.sdkVersion}. Is loader: ${e.data.isSdkLoader}.`), l.F.postToParent(e)
            }
            try {
                et.setup()
            } catch (e) {
                (0, m.f)(e)
            }
            window.top !== window && Bn().then((function () {
                Object.values(i.N3).forEach((e => {
                    const t = e(),
                        [n] = t.action.split(c.ej);
                    document.addEventListener(n, (() => l.F.postToParent(t)), !0)
                }))
            })), jn.overrideCacheSearch(), "SecurityPolicyViolationEvent" in window ? window.addEventListener("securitypolicyviolation", (({
                blockedURI: e,
                columnNumber: t,
                disposition: n,
                documentURI: r,
                effectiveDirective: a,
                lineNumber: o,
                originalPolicy: s,
                referrer: c,
                sample: d,
                sourceFile: u,
                statusCode: h,
                violatedDirective: p
            }) => {
                l.F.postToParent((0, i.TT)({
                    blockedURI: e,
                    columnNumber: t,
                    disposition: n,
                    documentURI: r,
                    effectiveDirective: a,
                    lineNumber: o,
                    originalPolicy: s,
                    referrer: c,
                    sample: d,
                    sourceFile: u,
                    statusCode: h,
                    violatedDirective: p
                }))
            })) : console.warn("SecurityPolicyViolationEvent is not available for this browser")
        }
        Qn((() => {
            l.F.postToParent((0, i.qf)())
        })), window.YaGamesAdded = !0, window.YaGames = Zn;
        const er = Zn
    })(), YaGames = r.default
})();
//# sourceMappingURL=https://s3.mdst.yandex.net/games/source-maps/_/sdk/client/sdk-v2/production/v2.79e5f6f6325b0faa1b66.js.map

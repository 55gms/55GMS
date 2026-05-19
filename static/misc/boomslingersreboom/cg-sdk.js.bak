/*! For license information please see bundle.js.LICENSE.txt */
(() => {
    var e = {
            12: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.throttledMethod = void 0;
                const i = new(r(n(916)).default)("none");
                t.throttledMethod = (e, t, n) => {
                    let r = 0;
                    return (...o) => {
                        const s = (new Date).getTime();
                        return s - r > t ? (r = s, e(...o)) : void(n && i.error(`${n}() call throttled, delay ${t}`))
                    }
                }
            },
            25: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.loadGameDataFromLs = f, t.loadCachedCloudGameDataFromLs = g, t.checkDataLimits = function(e) {
                    const t = (new TextEncoder).encode(e);
                    if (t.length > i.MAX_DATA_LENGTH) throw (0, s.sendErrorToGf)("size-exceeded", "data", {
                        maxSize: i.MAX_DATA_LENGTH,
                        dataSize: t.length
                    }), new i.DataError("dataLimitExcedeed", `Game data when converted to a JSON string cannot exceed ${i.MAX_DATA_LENGTH} bytes. Data was not saved`);
                    t.length > .9 * i.MAX_DATA_LENGTH && d.warn(`You are approaching ${i.MAX_DATA_LENGTH} bytes data limit.`)
                }, t.prepareInitialGameData = async function(e, t) {
                    return t.isQaTool ? (d.verbose("Running in QA tool, always using local data here"), {
                        data: f(t.gameId),
                        handler: "local"
                    }) : t.dataModule.isEnabled ? e ? new Promise(e => {
                        let n;
                        const r = async i => {
                            if ("sdkGameDataResponseNew" === i.data.type) {
                                d.verbose("Received game data from GF", i.data), window.removeEventListener("message", r, !1), void 0 !== n && window.clearTimeout(n);
                                const o = i.data.data;
                                if ("loaded" === o.status) o.hasData ? e({
                                    data: o.data,
                                    handler: "cloud"
                                }) : (() => {
                                    const n = (0, c.generateLsGameDataKey)(t.gameId);
                                    if (u.SafeLocalStorage.Instance.getItem(n)) {
                                        d.verbose("Cloud data missing but has local data, initialize with local data");
                                        const n = f(t.gameId);
                                        e({
                                            data: n,
                                            handler: "cloud"
                                        })
                                    } else d.verbose("Cloud data and local data missing, initialize with empty data"), e({
                                        data: {},
                                        handler: "cloud"
                                    })
                                })();
                                else {
                                    d.error("GF failed to load cloud game data, will load cached cloud data."), (0, s.sendErrorToGf)("gf-data-load-fail", "data");
                                    const n = g(t.gameId);
                                    d.verbose("Loaded cached cloud data, data will not be synced in this session", n), e({
                                        data: n,
                                        handler: "cloud",
                                        doNotSync: !0
                                    })
                                }
                            }
                        };
                        d.verbose("Requesting game data from GF"), window.addEventListener("message", r, !1), a.GF_WINDOW.postMessage({
                            type: "requestSdkGameDataNew"
                        }, "*"), n = window.setTimeout(() => {
                            d.error(`Did not get game data reply from GF in ${h}ms. Using cached cloud data if present. Disable data sync for this session.`), (0, s.sendErrorToGf)("gf-response-timeout", "data", {
                                timeoutMs: h
                            }), window.removeEventListener("message", r, !1);
                            const n = g(t.gameId);
                            e({
                                data: n,
                                handler: "cloud",
                                doNotSync: !0
                            })
                        }, h)
                    }) : (d.verbose("User signed out, loading data from LocalStorage"), {
                        data: f(t.gameId),
                        handler: "local"
                    }) : {
                        handler: "disabled"
                    }
                };
                const i = n(915),
                    o = r(n(916)),
                    s = n(771),
                    a = n(925),
                    u = n(265),
                    l = n(457),
                    c = n(63),
                    h = 1e4,
                    d = new o.default("data");

                function f(e) {
                    const t = (0, c.generateLsGameDataKey)(e);
                    try {
                        const e = u.SafeLocalStorage.Instance.getItem(t);
                        return e && JSON.parse(e).data || {}
                    } catch (e) {
                        return d.error(`Failed to retrieve local game data (${t}), initializing empty data. Error ${e}`), (0, s.sendErrorToGf)("load-ls-fail", "data"), {}
                    }
                }

                function g(e) {
                    const t = (0, l.generateCloudCacheLsGameDataKey)(e);
                    try {
                        const e = u.SafeLocalStorage.Instance.getItem(t);
                        return e && JSON.parse(e).data || {}
                    } catch (e) {
                        return d.error(`Failed to retrieve cached cloud game data from localStorage (${t}), initializing empty data. Error ${e}`), (0, s.sendErrorToGf)("load-cached-cloud-fail", "data"), {}
                    }
                }
            },
            63: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.LocalDataHandler = void 0, t.generateLsGameDataKey = a;
                const i = r(n(916)),
                    o = n(265),
                    s = n(25);

                function a(e) {
                    return `SDK_DATA_${e}`
                }
                t.LocalDataHandler = class {
                    constructor(e, t) {
                        this.logger = new i.default("data"), this.data = e, this.lsKey = a(t), this.logger.log("Local data handler initialized"), this.logger.verbose("With this initial data: ", e)
                    }
                    clear() {
                        this.data = {}, this.saveData()
                    }
                    getItem(e) {
                        return this.data[e] || null
                    }
                    removeItem(e) {
                        delete this.data[e], this.saveData()
                    }
                    setItem(e, t) {
                        this.data[e] = `${t}`, this.saveData()
                    }
                    saveData() {
                        (0, s.checkDataLimits)(JSON.stringify(this.data));
                        const e = {
                            data: this.data,
                            metadata: {
                                date: new Date
                            }
                        };
                        o.SafeLocalStorage.Instance.setItem(this.lsKey, JSON.stringify(e))
                    }
                }
            },
            67: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.loadAdsIfNeeded = function(e, t) {
                    return window.CrazygamesAds ? Promise.resolve() : function(e, t) {
                        return o || (o = (0, r.loadScript)(e).catch(t => {
                            throw new Error(`Error while loading script ${e}. Reason: ${(0,i.stringifyError)(t)}`)
                        }).then(() => {
                            const e = window,
                                n = e => {
                                    t.postMessage({
                                        type: "adsAnalyticsEvent",
                                        data: {
                                            event: e
                                        }
                                    })
                                };
                            try {
                                e.CrazygamesAds.initAds({
                                    analyticsEventHandler: n
                                })
                            } catch (e) {
                                throw new Error(`Error in initAds. Reason: ${(0,i.stringifyError)(e)}`)
                            }
                        }), o)
                    }(e, t)
                };
                const r = n(771),
                    i = n(100);
                let o
            },
            80: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.UserError = t.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS = t.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS = void 0;
                const r = n(833);
                t.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS = 18e4, t.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS = 5e3;
                class i extends r.GeneralError {
                    constructor(e, t) {
                        super(e, t), this.code = e, this.message = t
                    }
                }
                t.UserError = i
            },
            91: function(e, t, n) {
                "use strict";
                var r, i = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
                        void 0 === r && (r = n);
                        var i = Object.getOwnPropertyDescriptor(t, n);
                        i && !("get" in i ? !t.__esModule : i.writable || i.configurable) || (i = {
                            enumerable: !0,
                            get: function() {
                                return t[n]
                            }
                        }), Object.defineProperty(e, r, i)
                    } : function(e, t, n, r) {
                        void 0 === r && (r = n), e[r] = t[n]
                    }),
                    o = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                        Object.defineProperty(e, "default", {
                            enumerable: !0,
                            value: t
                        })
                    } : function(e, t) {
                        e.default = t
                    }),
                    s = this && this.__importStar || (r = function(e) {
                        return r = Object.getOwnPropertyNames || function(e) {
                            var t = [];
                            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[t.length] = n);
                            return t
                        }, r(e)
                    }, function(e) {
                        if (e && e.__esModule) return e;
                        var t = {};
                        if (null != e)
                            for (var n = r(e), s = 0; s < n.length; s++) "default" !== n[s] && i(t, e, n[s]);
                        return o(t, e), t
                    }),
                    a = this && this.__importDefault || function(e) {
                        return e && e.__esModule ? e : {
                            default: e
                        }
                    };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const u = n(100),
                    l = n(67),
                    c = n(833),
                    h = s(n(916)),
                    d = n(25),
                    f = n(771),
                    g = n(925),
                    p = n(672),
                    v = a(n(691)),
                    y = a(n(945)),
                    _ = a(n(591)),
                    m = a(n(351)),
                    w = n(643);
                t.default = class {
                    constructor() {
                        this.logger = new h.default("none"), this.sdk = new m.default
                    }
                    async init(e) {
                        return this.initializingPromise || (this.initializingPromise = new Promise(async (t, n) => {
                            if (this.logger.log("Request init, options: ", e), (0, g.shouldInitLocalMode)()) h.default.forceEnable = !0, this.sdk = new _.default, await (0, w.wait)(200);
                            else if ((await (0, g.checkIsCrazyGames)()).isOnCrazyGames) {
                                if (!g.GF_WINDOW) return n(new c.GeneralError("unexpectedError", "Missing GF_WINDOW, even though running on CrazyGames"));
                                const [t, r] = await Promise.all([(0, g.initSdk)(e), (0, g.fetchSdkUser)()]);
                                if (null === t) throw new c.GeneralError("initFailed", "The SDK failed to initialize");
                                this.logger.log("Init response received from GF", t);
                                const i = await (0, d.prepareInitialGameData)(r, t);
                                this.sdk = new v.default(t, i, r);
                                try {
                                    await (0, l.loadAdsIfNeeded)(t.rafvertizingUrl, this.sdk)
                                } catch (e) {
                                    (0, f.sendErrorToGf)("ads-script-load-fail", "ad", {
                                        error: (0, u.stringifyError)(e)
                                    }), this.logger.error("Failed to load ads", e)
                                }
                            } else this.sdk = new y.default;
                            console.log(...h.MAIN_BADGE, "CrazyGames HTML SDK initialized", {
                                version: p.SDK_VERSION,
                                environment: this.sdk.environment,
                                initOptions: e
                            }), t()
                        })), this.initializingPromise
                    }
                    get ad() {
                        return this.sdk.ad
                    }
                    get banner() {
                        return this.sdk.banner
                    }
                    get game() {
                        return this.sdk.game
                    }
                    get user() {
                        return this.sdk.user
                    }
                    get data() {
                        return this.sdk.data
                    }
                    get analytics() {
                        return this.sdk.analytics
                    }
                    get environment() {
                        return this.sdk.environment
                    }
                    get isQaTool() {
                        return this.sdk.isQaTool
                    }
                }
            },
            100: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.stringifyError = function(e, t = {}) {
                    if (!e) return n;
                    let r = "";
                    const {
                        includeStack: i = !1
                    } = t;
                    if (e instanceof Error) r = i && e.stack || e.message;
                    else try {
                        r = e.toString()
                    } catch {
                        try {
                            r = JSON.stringify(e)
                        } catch {
                            r = n
                        }
                    }
                    if ("string" != typeof r) try {
                        r = JSON.stringify(r)
                    } catch {
                        r = n
                    }
                    return r
                };
                const n = "An error occurred"
            },
            156: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(771),
                    o = r(n(91));
                window.CrazyGames = {
                    SDK: new o.default
                }, (0, i.addStyle)("\n.crazygames-banner-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n")
            },
            199: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = r(n(916)),
                    o = n(771),
                    s = n(361);
                t.default = class {
                    constructor(e) {
                        this.sdk = e, this.logger = new i.default("analytics")
                    }
                    trackOrder(e, t) {
                        if (!(0, o.isXsollaOrderArgumentValid)(t)) throw new s.AnalyticsError("invalidArgument", "Order must be a JSON object.");
                        if (!s.PAYMENT_PROVIDERS.includes(e)) throw new s.AnalyticsError("invalidArgument", `Unsupported payment provider. Supported providers: ${s.PAYMENT_PROVIDERS.join(",")}`);
                        this.logger.log(`Track "${e}" order`, t), this.sdk.postMessage({
                            type: "analyticsTrackIAPOrder",
                            data: {
                                paymentProvider: e,
                                orderJson: JSON.stringify(t)
                            }
                        })
                    }
                }
            },
            201: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.NO_BANNERS_ON_APP = void 0;
                const i = n(491),
                    o = n(366),
                    s = r(n(916)),
                    a = n(930),
                    u = n(637),
                    l = n(985),
                    c = n(710);
                t.NO_BANNERS_ON_APP = "Banner Ads are disabled on the mobile apps", t.default = class {
                    constructor(e, t) {
                        this.sdk = e, this.initInfo = t, this.bannerQueue = {}, this.overlayBanners = {}, this.renderedBannerIds = new Set, this.logger = new s.default("banner"), this.useTestAds = t.useTestAds || !1, this.disableBannerCheck = t.disableBannerCheck || !1
                    }
                    checkBannerAdsEnabled() {
                        if ("basic" === this.initInfo.launchFlow) throw new c.AdError("other", l.BASIC_LAUNCH_AD_DISABLED_ERROR);
                        if (function(e) {
                                switch (e) {
                                    case "pwa":
                                    case "web":
                                        return !1;
                                    case "apple_store":
                                    case "google_play_store":
                                        return !0
                                }
                            }(this.initInfo.systemInfo.applicationType)) throw new c.AdError("other", t.NO_BANNERS_ON_APP)
                    }
                    async requestBanner(e) {
                        this.checkBannerAdsEnabled(), this.logger.log("Requesting banner with automatic rendering", e), this.ensureVideoAdNotPlaying(e.id);
                        const t = await this.prefetchBanner(e);
                        return this.renderPrefetchedBanner(t)
                    }
                    async requestResponsiveBanner(e) {
                        this.checkBannerAdsEnabled(), this.logger.log(`Requesting responsive banner with automatic rendering #${e}`), this.ensureVideoAdNotPlaying(e);
                        const t = await (0, a.getBannerContainer)(e, !this.disableBannerCheck),
                            {
                                width: n,
                                height: r
                            } = t.containerInfo.size,
                            i = await this.prefetchResponsiveBanner({
                                id: e,
                                width: n,
                                height: r
                            });
                        return this.renderPrefetchedBanner(i)
                    }
                    async prefetchBanner(e) {
                        this.checkBannerAdsEnabled(), this.logger.log("Prefetch banner", e);
                        const t = (0, a.ContainerIdToInnerId)(e.id),
                            n = {
                                ...e,
                                id: t
                            };
                        return new Promise((e, t) => {
                            this.bannerQueue[n.id] = {
                                banner: n,
                                resolve: e,
                                reject: t
                            }, this.sdk.postMessage({
                                type: "requestBanner",
                                data: [{
                                    containerId: n.id,
                                    size: (0, a.getBannerSizeAsText)(n)
                                }]
                            })
                        })
                    }
                    async prefetchResponsiveBanner(e) {
                        this.checkBannerAdsEnabled(), this.logger.log(`Prefetch responsive banner #${e.id}`);
                        const {
                            width: t,
                            height: n
                        } = e, r = {
                            id: (0, a.ContainerIdToInnerId)(e.id),
                            width: t,
                            height: n,
                            isResponsive: !0
                        };
                        return new Promise((e, i) => {
                            this.bannerQueue[r.id] = {
                                banner: r,
                                resolve: e,
                                reject: i
                            }, this.sdk.postMessage({
                                type: "requestResponsiveBanner",
                                data: [{
                                    id: r.id,
                                    width: t,
                                    height: n
                                }]
                            })
                        })
                    }
                    async renderPrefetchedBanner(e) {
                        this.logger.log("Rendering prefetched banner", e);
                        const t = (0, a.InnerIdToContainerId)(e.id);
                        return this.ensureVideoAdNotPlaying(t), await (0, a.getBannerContainer)(t, !this.disableBannerCheck), this.renderedBannerIds.add(t), new Promise((t, n) => {
                            const {
                                CrazygamesAds: r
                            } = window, {
                                id: i,
                                banner: s
                            } = e;
                            r.render([i], {
                                ...e.options,
                                banner: {
                                    callback: e => {
                                        if (delete this.bannerQueue[e.code], !e.empty) return this.logger.log("Banner rendered", s, "with options", e), this.sdk.postMessage({
                                            type: "bannerProcessed",
                                            data: {
                                                containerId: s.id,
                                                width: s.width,
                                                height: s.height,
                                                minPrice: e.minPrice,
                                                houseAd: e.houseAd,
                                                empty: e.empty
                                            }
                                        }), void t();
                                        if (this.useTestAds)(0, o.renderFakeBanner)(s), this.logger.log("Fake banner rendered", s), t();
                                        else {
                                            this.logger.log("No banner available", s);
                                            const t = "Sorry, no banner is available for the moment, please retry";
                                            this.sdk.postMessage({
                                                type: "bannerProcessed",
                                                data: {
                                                    containerId: s.id,
                                                    width: s.width,
                                                    height: s.height,
                                                    error: t,
                                                    minPrice: e.minPrice,
                                                    houseAd: e.houseAd,
                                                    empty: e.empty
                                                }
                                            }), n(new u.BannerError("other", t, s.id))
                                        }
                                    }
                                }
                            })
                        })
                    }
                    requestOverlayBanners(e, t) {
                        this.logger.log("Requesting overlay banners", e);
                        const n = e.map(e => e.id);
                        Object.keys(this.overlayBanners).forEach(e => {
                            n.includes(e) || (this.logger.log("Remove overlay banner " + e), this.overlayBanners[e].destroy(), delete this.overlayBanners[e])
                        }), e.forEach(e => {
                            if (this.overlayBanners[e.id]) return void this.logger.log("Skip overlay banner update " + e.id);
                            this.logger.log("Create overlay banner " + e.id);
                            const n = new i.OverlayBanner(e, this.disableBannerCheck, this, t);
                            this.overlayBanners[e.id] = n
                        })
                    }
                    handleEvent(e) {
                        switch (e.type) {
                            case "bannerError":
                                return void this.handleBannerErrorEvent(e);
                            case "requestBanner":
                                return void this.handleRequestBannerEvent(e)
                        }
                    }
                    handleBannerErrorEvent(e) {
                        const {
                            error: t,
                            containerId: n
                        } = e;
                        this.logger.log("Banner error happened", {
                            error: t,
                            containerId: n
                        });
                        const r = this.popFromBannerQueue(n);
                        if (!r) return;
                        const {
                            reject: i
                        } = r;
                        i(new u.BannerError("other", `${t}`, n))
                    }
                    async handleRequestBannerEvent(e) {
                        const {
                            request: t
                        } = e;
                        this.logger.verbose("Received banner data from GF, will prefetch it now", t);
                        const n = t.request.units[0].adUnit.code,
                            r = this.popFromBannerQueue(n);
                        if (r) try {
                            const {
                                CrazygamesAds: e
                            } = window;
                            await e.requestOnly(t.request, t.options), this.logger.verbose(`Banner ${n} prefetched`), r.resolve({
                                id: n,
                                banner: r.banner,
                                options: t.options
                            })
                        } catch {
                            r.reject(new u.BannerError("other", "Failed to prefetch the banner", n))
                        } else this.logger.verbose(`Banner ${n} missing in queue, not prefetching.`)
                    }
                    popFromBannerQueue(e) {
                        const t = this.bannerQueue[e];
                        return t ? (delete this.bannerQueue[e], t) : (this.logger.log(`Cannot retrieve element for id ${e} from the banner queue`), null)
                    }
                    clearBanner(e) {
                        this.sdk.postMessage({
                            type: "clearBanner",
                            data: {}
                        });
                        const t = document.getElementById((0, a.ContainerIdToInnerId)(e));
                        if (!t) return void this.logger.log(`There isn't a banner in container #${e}, not clearing anything.`);
                        t.remove(), this.renderedBannerIds.delete(e);
                        const n = Object.values(this.overlayBanners).find(t => t.containerId === e);
                        n && (n.destroy(), delete this.overlayBanners[n.bannerRequest.id]), this.logger.log(`Cleared the banner from container #${e} ${n?"(also overlay banner)":""}`)
                    }
                    clearAllBanners() {
                        this.sdk.postMessage({
                            type: "clearAllBanners",
                            data: {}
                        });
                        const e = Array.from(this.renderedBannerIds.values());
                        this.logger.log("Clearing all banners, ids: ", e.map(e => `#${e}`).join(", ")), e.forEach(e => {
                            this.clearBanner(e)
                        })
                    }
                    ensureVideoAdNotPlaying(e) {
                        if (this.sdk.ad.isAdPlaying) throw new u.BannerError("videoAdPlaying", "Banners cannot be rendered while a video ad is playing", e)
                    }
                    get activeBannersCount() {
                        return this.renderedBannerIds.size
                    }
                }
            },
            202: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(710),
                    o = n(771),
                    s = r(n(916));
                t.default = class {
                    constructor(e) {
                        this.sdk = e, this.requestInProgress = !1, this.overlay = null, this.logger = new s.default("ad"), this.adPlaying = !1
                    }
                    init() {
                        this.overlay = document.createElement("div"), this.overlay.id = "local-overlay", this.createOverlayStyle(), document.body.appendChild(this.overlay)
                    }
                    prefetchAd(e) {
                        this.logger.log(`Prefetching ${e} ad`)
                    }
                    async requestAd(e, t) {
                        if (this.requestInProgress)
                            if (null == t ? void 0 : t.adError) {
                                const e = "An ad request is already in progress";
                                (0, o.wrapUserFn)(t.adError)(new i.AdError("other", e))
                            } else(null == t ? void 0 : t.adFinished) && (0, o.wrapUserFn)(t.adFinished)();
                        else this.adPlaying = !0, (null == t ? void 0 : t.adStarted) && (0, o.wrapUserFn)(t.adStarted)(), this.sdk.banner.activeBannersCount > 0 && this.sdk.banner.clearAllBanners(), await this.renderFakeAd(e), this.adPlaying = !1, (null == t ? void 0 : t.adFinished) && (0, o.wrapUserFn)(t.adFinished)()
                    }
                    async hasAdblock() {
                        return this.logger.log("Requesting adblock status (always false) (local)"), !1
                    }
                    async renderFakeAd(e) {
                        return this.logger.log(`Requesting ${e} ad`), this.requestInProgress = !0, this.showOverlay(), this.overlay.innerHTML = `<h1>A ${e} ad would appear here</h1>`, new Promise(e => {
                            window.setTimeout(() => {
                                this.requestInProgress = !1, this.hideOverlay(), e()
                            }, 5e3)
                        })
                    }
                    showOverlay() {
                        this.overlay.style.display = "flex"
                    }
                    hideOverlay() {
                        this.overlay.style.display = "none", this.overlay.innerHTML = ""
                    }
                    createOverlayStyle() {
                        const e = {
                            position: "fixed",
                            display: "none",
                            inset: 0,
                            "font-family": "Arial, Helvetica, sans-serif",
                            color: "white",
                            "align-items": "center",
                            "justify-content": "center",
                            "background-color": "rgba(0,0,0,0.75)",
                            "z-index": "10000"
                        };
                        for (const t in e) this.overlay.style[t] = e[t]
                    }
                    get isAdPlaying() {
                        return this.adPlaying
                    }
                }
            },
            220: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isGfToSdkEvent = function(e) {
                    return "sdk" === e.messageTarget
                }
            },
            265: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.SafeLocalStorage = t.InMemoryStorage = void 0;
                const i = r(n(916));
                class o {
                    constructor() {
                        this.data = {}, this.clear()
                    }
                    setItem(e, t) {
                        this.data[e] = String(t)
                    }
                    getItem(e) {
                        return this.data.hasOwnProperty(e) ? this.data[e] : void 0
                    }
                    removeItem(e) {
                        delete this.data[e]
                    }
                    clear() {
                        this.data = {}
                    }
                }
                t.InMemoryStorage = o, t.SafeLocalStorage = class {
                    constructor() {
                        this.logger = new i.default("none"), this.storage = this.getAvailableStorage()
                    }
                    static get Instance() {
                        return this._instance ? this._instance : this._instance = new this
                    }
                    getItem(e) {
                        return this.storage.getItem(e)
                    }
                    setItem(e, t) {
                        this.storage.setItem(e, t)
                    }
                    removeItem(e) {
                        this.storage.removeItem(e)
                    }
                    clear() {
                        return this.storage.clear()
                    }
                    isFunctioningStorage(e) {
                        try {
                            const t = `__SafeLocalStorage__${Date.now()}`,
                                n = "test";
                            return e.setItem(t, n), e.getItem(t) === n && (window.localStorage.removeItem(t), !0)
                        } catch {
                            return !1
                        }
                    }
                    getAvailableStorage() {
                        try {
                            return this.hasWorkingLocalStorage() ? (this.logger.verbose("[SafeLocalStorage] using localStorage"), window.localStorage) : this.hasWorkingSessionStorage() ? (this.logger.verbose("[SafeLocalStorage] fallback to sessionStorage"), window.sessionStorage) : (this.logger.verbose("[SafeLocalStorage] fallback to InMemoryStorage"), new o)
                        } catch {
                            return this.logger.verbose("[SafeLocalStorage] fallback to InMemoryStorage"), new o
                        }
                    }
                    hasWorkingLocalStorage() {
                        try {
                            if (!window.hasOwnProperty("localStorage")) return !1;
                            const {
                                localStorage: e
                            } = window;
                            return this.isFunctioningStorage(e)
                        } catch {
                            return !1
                        }
                    }
                    hasWorkingSessionStorage() {
                        try {
                            if (!window.hasOwnProperty("sessionStorage")) return !1;
                            const {
                                sessionStorage: e
                            } = window;
                            return this.isFunctioningStorage(e)
                        } catch {
                            return !1
                        }
                    }
                }
            },
            351: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(833),
                    o = r(n(916));
                t.default = class {
                    constructor() {
                        this.logger = new o.default("none"), this.code = "sdkNotInitialized", this.message = `CrazySDK is not initialized yet. Check ${i.DOCS_URL} for more info.`
                    }
                    get ad() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get banner() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get game() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get user() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get data() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get analytics() {
                        throw new i.GeneralError(this.code, this.message)
                    }
                    get environment() {
                        return "uninitialized"
                    }
                    get isQaTool() {
                        return !1
                    }
                }
            },
            361: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AnalyticsError = t.PAYMENT_PROVIDERS = void 0;
                const r = n(833),
                    i = n(433);
                t.PAYMENT_PROVIDERS = i.PAYMENT_PROVIDERS;
                class o extends r.GeneralError {
                    constructor(e, t) {
                        super(e, t), this.code = e, this.message = t
                    }
                }
                t.AnalyticsError = o
            },
            366: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.renderFakeBanner = function(e) {
                    a.log("Rendering fake banner", e);
                    const t = document.getElementById(e.id);
                    if (!t) return void console.error(`Didn't find container #${e.id} for rendering fake banner`);
                    let n = e.width,
                        r = e.height;
                    if (e.isResponsive) {
                        const e = (0, s.shuffle)(l).find(e => n >= e.width && r >= e.height);
                        if (!e) throw new o.BannerError("noAvailableSizes", "No available banner size has been found", t.id);
                        n = e.width, r = e.height
                    }
                    t.innerHTML = "";
                    const i = document.createElement("img");
                    i.setAttribute("src", `${u}${n}x${r}.png`), i.setAttribute("width", `${n}px`), i.setAttribute("height", `${r}px`), t.appendChild(i), t.style.backgroundColor = "rgb(191, 173, 255, 0.25)"
                };
                const i = r(n(916)),
                    o = n(637),
                    s = n(543),
                    a = new i.default("banner"),
                    u = "https://images.crazygames.com/crazygames-sdk/",
                    l = [{
                        width: 970,
                        height: 90
                    }, {
                        width: 320,
                        height: 50
                    }, {
                        width: 160,
                        height: 600
                    }, {
                        width: 336,
                        height: 280
                    }, {
                        width: 728,
                        height: 90
                    }, {
                        width: 300,
                        height: 600
                    }, {
                        width: 468,
                        height: 60
                    }, {
                        width: 970,
                        height: 250
                    }, {
                        width: 300,
                        height: 250
                    }, {
                        width: 250,
                        height: 250
                    }, {
                        width: 120,
                        height: 600
                    }]
            },
            433: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.PAYMENT_PROVIDERS = void 0, t.isInGameBannerSize = function(e) {
                    return n.some(t => t === e)
                };
                const n = ["728x90", "300x250", "320x50", "468x60", "320x100"];
                t.PAYMENT_PROVIDERS = ["xsolla"]
            },
            457: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.CloudDataHandler = void 0, t.generateCloudCacheLsGameDataKey = a;
                const i = r(n(916)),
                    o = n(25),
                    s = n(265);

                function a(e) {
                    return `SDK_DATA_CLOUD_CACHE_${e}`
                }
                t.CloudDataHandler = class {
                    constructor(e, t, n) {
                        this.sdk = e, this.doNotSync = t, this.data = n, this.logger = new i.default("data"), this.cacheLsKey = a(e.game.id), this.logger.log("Cloud data handler initialized. " + (this.doNotSync ? "Data will not be synced due to failed cloud load." : "")), this.logger.verbose("With this initial data: ", n)
                    }
                    clear() {
                        this.data = {}, this.saveData()
                    }
                    getItem(e) {
                        return this.data[e] || null
                    }
                    removeItem(e) {
                        delete this.data[e], this.saveData()
                    }
                    setItem(e, t) {
                        this.data[e] = `${t}`, this.saveData()
                    }
                    saveData() {
                        const e = JSON.stringify(this.data);
                        (0, o.checkDataLimits)(e), this.doNotSync || this.sdk.postMessage({
                            type: "saveSdkGameData",
                            data: {
                                jsonData: e
                            }
                        });
                        const t = {
                            data: this.data,
                            metadata: {
                                date: new Date
                            }
                        };
                        s.SafeLocalStorage.Instance.setItem(this.cacheLsKey, JSON.stringify(t))
                    }
                }
            },
            488: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(80),
                    o = n(771),
                    s = r(n(916));

                function a() {
                    const e = navigator.userAgent.toLowerCase(),
                        t = /mobile/i.test(e),
                        n = /tablet/i.test(e) || t && /ipad/i.test(e);
                    return t ? "mobile" : n ? "tablet" : "desktop"
                }
                t.default = class {
                    constructor() {
                        this.systemInfo = {
                            browser: {
                                name: "demo",
                                version: "demo"
                            },
                            countryCode: "US",
                            locale: "en-US",
                            os: {
                                name: "demo",
                                version: "demo"
                            },
                            device: {
                                type: a()
                            },
                            applicationType: "web"
                        }, this.isUserAccountAvailable = !0, this.demoUser1 = {
                            username: "User1",
                            profilePictureUrl: "https://images.crazygames.com/userportal/avatars/1.png"
                        }, this.demoUser2 = {
                            username: "User2",
                            profilePictureUrl: "https://images.crazygames.com/userportal/avatars/2.png"
                        }, this.user1Token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.u4N2DzCC6Vmo6Gys-XSl8rHQR0NUJAcWQWr29eLd54qMDPbCopPG0kye8TAidOU6dWAqNWO_kERbl75nTxNcJjbW4yqBS_bIPingIhuCCJsjvnQPkalfmVotmoZGQP21Q9MyZPfpjZNogioA3a0vm6APXAqzudTA9lTioztnT4YvgndISngOMQVNoDCJ_DgCbKy8GFQDcCN-AHFFb0WIVWiTYszv-9JZohUzULt-ueYL31pXVGHQ5C4rHESEg7LYzx1IaLKw1zcoYGxul0RxR35nm3yD_bGa6fQVzCfnKnhEBRifUZsIN1LfIHfNB23ZOh1llG7PEOdvtCSfIxP9ZK6t4gRkGn1VsqZFAMhq1LgJebO8hcm_Iqx0wF3WkdMysoQuWThTNKnwmphv9pguuALILYJluUP8UQll3qiF6gzoLPy1MfD_9l4TPZeP9Bv50B-Tm6Lk3OW248jyuFRKP_VgwZutTb5pJ7LggFcqWFXsBv5ZG3V2zsfVwpAPDhpmb4ykjoB2xLSuxjrvs1dzMhl02QAQjqTUgHj4fstgX-2jYowDyyPjj6JbT2ZC7vrrdmPvc8AcNvyCszamfRYjexElGaeJDDt6vtRuJw_JVwsCLaYHGif4UaKCoe6BECg3mRVUkH08Nm-qQPQw9slpYZmxckFEQQPCGkkPhgOBFkE", this.user2Token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIyIiwidXNlcm5hbWUiOiJVc2VyMiIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8yLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.kh60HYKR8txKvLoCB6dQ9hQG8Mu1UgtneTGs3Y15HvBWrZoLKp3x3pTf_Vhq8xzs7fQYJKr94zYAxxFRztHey7Tv7PBBmPESUFo8Le-_s2xDy982sFhpM6XDt84ohhvEuJEsOW8wIcCaCK6wzm6UWY6n1bpw1cO1KNASyZRSkDRhfyzDVJ5e167OLgGe3euodTHgClJPDv0ZYhle9KH86PepWamCm0429VrzyOu6QdbtFcRlRNZVnTtgNrCpyvss4AyDhnY5qV9yng7xHVt4zlocP_Z7btBL_kxrzYskhJi6KYuQAYmqLxqHSDnehlIvgO4cdEpJA_FOTeACTohhEu8zjXRrfdAFvEe0W6qqUo5HNFoElRoxYWf11WGSdrJCjpF4Qei9BPgprFaVH2Xi-ITAjKyElQxeKs5p6VmvaMAGwdqZgM4fm7OSex8QQGK0HFJ7wFoCTV5PLl-MBVvTSTfemJMWEwc8od124gwT_uGdDKrASovT2pijgBsAi3jxwgfEr1RPq8uCgZtksrTqaAM9TMv9Z6Zv35pdgTrWzTrOn-G-uc4EPZq7iQaEnglWEFj8Qsm_nMQMgtIM7MYG8KwPC4if3-Yc8KwaAL_taVvkqyMaV3W5j4MX9b1bbf_fw3jrGt74MACb7FtgzKudxoz2CXKZqTppadxS_IOnlMk", this.expiredToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzQ5MSwiZXhwIjoxNjY4NTkzNDkyfQ.l_0cyeD-suEM7n9l-Vb2nP5vTJi-e3HwZQWLUESJMdVTX1zPDuQhwnSgHhcGVGFnhG5Wvtni-ElpM8HnVNvY7hRthbeP23n2ScAJBvAX10vrzPuLJRn_Nj_5GcRQpK4fH813Ij8ZWuOaS2hD4gKaEUessZs5n5hNBTQN9T5j4wkNvfhuw9vqtVOha2aPveqeVy1eA5XAWI7IirHi31-Dw60MSVgsp3r4tpYEHTlUPktzLsQvO9Sk9IE7iybg9ycoFoS6L1eAvxGWVF1BMHRerPwdOV9CN0rtrqrTM3pyb1fpmFfgQpoA8AgPuVrU58mwyeTpUQ4WSrPrltGjxxfiGQOATBDBrJk5V173BfUgBEgAEP0TifWAQt02iijJa9G6q-V8p0GWto1EYSdvEDmG0YhoRBVxnOQH3U1Fu0yxMWGMm9VmZVVhVN8PpLjitEhP4Gn33IafpS05d1-Q0NFMb9-FvQCdtXjTaGbaBVIeBN-aO0r4ERvoBE9R0AUrywd9Z2zK_qKRvp35NyryLjnedsYt5Xrc9TA2uDMR77TjByyqsdQ_qv4zhLfhuiMiweXyPfYzltAiNJmEUohxlP7OvH33B6xpT7Qz2ZyEeMHBrQRQGGlT6MowcMYx_2LFNSK8PwZJNlMs0Uw_uCIu-4TvqleVleIg7sLhWiijw1cxtmM", this.logger = new s.default("user")
                    }
                    async showAuthPrompt() {
                        switch (this.logger.log("Requesting auth prompt (local)"), (0, o.getQueryStringValue)("show_auth_prompt_response")) {
                            case "user1":
                            default:
                                return this.demoUser1;
                            case "user2":
                                return this.demoUser2;
                            case "user_cancelled":
                                throw new i.UserError("userCancelled", "User cancelled the auth prompt")
                        }
                    }
                    async showAccountLinkPrompt() {
                        switch (this.logger.log("Requesting link account prompt (local)"), (0, o.getQueryStringValue)("link_account_response")) {
                            case "yes":
                            default:
                                return {
                                    response: "yes"
                                };
                            case "no":
                                return {
                                    response: "no"
                                };
                            case "logged_out":
                                throw new i.UserError("userNotAuthenticated", "The user is not authenticated")
                        }
                    }
                    async getUser() {
                        switch (this.logger.log("Requesting user object (local)"), (0, o.getQueryStringValue)("user_response")) {
                            case "user1":
                            default:
                                return this.demoUser1;
                            case "user2":
                                return this.demoUser2;
                            case "logged_out":
                                return null
                        }
                    }
                    async getUserToken() {
                        switch (this.logger.log("Requesting user token (local)"), (0, o.getQueryStringValue)("token_response")) {
                            case "user1":
                            default:
                                return this.user1Token;
                            case "user2":
                                return this.user2Token;
                            case "expired_token":
                                return this.expiredToken;
                            case "logged_out":
                                throw new i.UserError("userNotAuthenticated", "The user is not authenticated")
                        }
                    }
                    async getXsollaUserToken() {
                        return this.logger.log("Requesting Xsolla user token (local). Xsolla token not supported locally."), "Xsolla token not supported locally"
                    }
                    addScore(e) {
                        this.logger.warn("addScore is no longer supported.")
                    }
                    addScoreEncrypted(e, t) {
                        this.logger.warn("addScoreEncrypted is no longer supported.")
                    }
                    submitScore(e) {
                        this.logger.log("Requesting to submit score (local).", e.encryptedScore)
                    }
                    addAuthListener() {}
                    removeAuthListener() {}
                }
            },
            491: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.OverlayBanner = void 0;
                const r = n(543);
                t.OverlayBanner = class {
                    constructor(e, t, n, i) {
                        this.bannerRequest = e, this.onWindowResize = () => {
                            this.setContainerPosition()
                        }, this.containerElement = document.createElement("div"), this.containerId = "overlay-banner-" + e.id, this.containerElement.id = this.containerId, this.bannerRequest = e, this.containerElement.style.position = "absolute", this.containerElement.style.transformOrigin = "top left", this.containerElement.style.userSelect = "none";
                        const o = document.getElementById("gfMainContainer");
                        o ? o.appendChild(this.containerElement) : document.body.appendChild(this.containerElement);
                        const s = e.size.split("x");
                        this.onScreenSize = {
                            width: parseInt(s[0]),
                            height: parseInt(s[1])
                        }, this.bannerModule = n, this.callback = i, this.disableBannerCheck = t, this.debouncedWindowResize = (0, r.debounce)(this.onWindowResize, 200), window.addEventListener("resize", this.debouncedWindowResize), this.renderBanner()
                    }
                    isVisible() {
                        const e = this.computeOverlay();
                        if (this.disableBannerCheck) return !0;
                        const t = e.left + e.width * e.scale,
                            n = e.top + e.height * e.scale,
                            r = this.getGameContainerDimensions();
                        return !(e.top < -4 || e.left < -4 || t > window.innerWidth + 4 || n > r.height + 4)
                    }
                    computeOverlay() {
                        const e = this.getScale(),
                            t = this.getOnScreenPosition();
                        return {
                            width: this.onScreenSize.width,
                            height: this.onScreenSize.height,
                            top: t.y,
                            left: t.x,
                            scale: e
                        }
                    }
                    getGameContainerDimensions() {
                        const e = document.getElementById("game-container");
                        return e ? {
                            width: e.clientWidth,
                            height: e.clientHeight
                        } : {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    }
                    getScale() {
                        return this.getGameContainerDimensions().width / 922
                    }
                    getOnScreenPosition() {
                        const e = this.getGameContainerDimensions(),
                            t = this.bannerRequest.anchor.x * e.width,
                            n = (1 - this.bannerRequest.anchor.y) * e.height,
                            r = this.getScale(),
                            i = this.onScreenSize,
                            o = i.width * r,
                            s = i.height * r,
                            a = this.bannerRequest.pivot || {
                                x: .5,
                                y: .5
                            };
                        return {
                            x: t + this.bannerRequest.position.x * r - o * a.x,
                            y: n - this.bannerRequest.position.y * r - s * (1 - a.y)
                        }
                    }
                    setContainerPosition() {
                        const e = this.computeOverlay();
                        this.containerElement.style.width = `${e.width}px`, this.containerElement.style.height = `${e.height}px`, this.containerElement.style.top = `${e.top}px`, this.containerElement.style.left = `${e.left}px`, this.containerElement.style.transform = `scale(${e.scale})`, this.containerElement.style.display = "block"
                    }
                    async renderBanner() {
                        if (this.setContainerPosition(), !this.isVisible()) return this.callback(this.bannerRequest.id, "bannerError", "bannerNotEntirelyVisible"), void(this.containerElement.style.display = "none");
                        try {
                            await this.bannerModule.requestBanner({
                                id: this.containerId,
                                ...this.onScreenSize
                            }), this.callback(this.bannerRequest.id, "bannerRendered")
                        } catch (e) {
                            this.callback(this.bannerRequest.id, "bannerError", `${e}`)
                        }
                    }
                    destroy() {
                        this.containerElement && this.containerElement.remove(), window.removeEventListener("resize", this.debouncedWindowResize)
                    }
                }
            },
            529: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isJsSdkRequestUserTokenSuccessResponse = function(e) {
                    return Object.hasOwn(e, "token")
                }, t.isJsSdkRequestUserTokenErrorResponse = function(e) {
                    return Object.hasOwn(e, "error")
                }, t.isJsSdkRequestXsollaUserTokenSuccessResponse = function(e) {
                    return Object.hasOwn(e, "token")
                }, t.isJsSdkRequestXsollaUserTokenErrorResponse = function(e) {
                    return Object.hasOwn(e, "error")
                }
            },
            543: function(e, t, n) {
                var r;
                e = n.nmd(e),
                    function() {
                        var i, o = "Expected a function",
                            s = "__lodash_hash_undefined__",
                            a = "__lodash_placeholder__",
                            u = 32,
                            l = 128,
                            c = 1 / 0,
                            h = 9007199254740991,
                            d = NaN,
                            f = 4294967295,
                            g = [
                                ["ary", l],
                                ["bind", 1],
                                ["bindKey", 2],
                                ["curry", 8],
                                ["curryRight", 16],
                                ["flip", 512],
                                ["partial", u],
                                ["partialRight", 64],
                                ["rearg", 256]
                            ],
                            p = "[object Arguments]",
                            v = "[object Array]",
                            y = "[object Boolean]",
                            _ = "[object Date]",
                            m = "[object Error]",
                            w = "[object Function]",
                            b = "[object GeneratorFunction]",
                            k = "[object Map]",
                            I = "[object Number]",
                            E = "[object Object]",
                            S = "[object Promise]",
                            A = "[object RegExp]",
                            M = "[object Set]",
                            T = "[object String]",
                            R = "[object Symbol]",
                            D = "[object WeakMap]",
                            P = "[object ArrayBuffer]",
                            O = "[object DataView]",
                            x = "[object Float32Array]",
                            L = "[object Float64Array]",
                            B = "[object Int8Array]",
                            C = "[object Int16Array]",
                            U = "[object Int32Array]",
                            j = "[object Uint8Array]",
                            N = "[object Uint8ClampedArray]",
                            G = "[object Uint16Array]",
                            z = "[object Uint32Array]",
                            q = /\b__p \+= '';/g,
                            F = /\b(__p \+=) '' \+/g,
                            W = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                            $ = /&(?:amp|lt|gt|quot|#39);/g,
                            V = /[&<>"']/g,
                            J = RegExp($.source),
                            H = RegExp(V.source),
                            Q = /<%-([\s\S]+?)%>/g,
                            X = /<%([\s\S]+?)%>/g,
                            Z = /<%=([\s\S]+?)%>/g,
                            Y = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                            K = /^\w*$/,
                            ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                            te = /[\\^$.*+?()[\]{}|]/g,
                            ne = RegExp(te.source),
                            re = /^\s+/,
                            ie = /\s/,
                            oe = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
                            se = /\{\n\/\* \[wrapped with (.+)\] \*/,
                            ae = /,? & /,
                            ue = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
                            le = /[()=,{}\[\]\/\s]/,
                            ce = /\\(\\)?/g,
                            he = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                            de = /\w*$/,
                            fe = /^[-+]0x[0-9a-f]+$/i,
                            ge = /^0b[01]+$/i,
                            pe = /^\[object .+?Constructor\]$/,
                            ve = /^0o[0-7]+$/i,
                            ye = /^(?:0|[1-9]\d*)$/,
                            _e = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
                            me = /($^)/,
                            we = /['\n\r\u2028\u2029\\]/g,
                            be = "\\ud800-\\udfff",
                            ke = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
                            Ie = "\\u2700-\\u27bf",
                            Ee = "a-z\\xdf-\\xf6\\xf8-\\xff",
                            Se = "A-Z\\xc0-\\xd6\\xd8-\\xde",
                            Ae = "\\ufe0e\\ufe0f",
                            Me = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
                            Te = "[" + be + "]",
                            Re = "[" + Me + "]",
                            De = "[" + ke + "]",
                            Pe = "\\d+",
                            Oe = "[" + Ie + "]",
                            xe = "[" + Ee + "]",
                            Le = "[^" + be + Me + Pe + Ie + Ee + Se + "]",
                            Be = "\\ud83c[\\udffb-\\udfff]",
                            Ce = "[^" + be + "]",
                            Ue = "(?:\\ud83c[\\udde6-\\uddff]){2}",
                            je = "[\\ud800-\\udbff][\\udc00-\\udfff]",
                            Ne = "[" + Se + "]",
                            Ge = "\\u200d",
                            ze = "(?:" + xe + "|" + Le + ")",
                            qe = "(?:" + Ne + "|" + Le + ")",
                            Fe = "(?:['’](?:d|ll|m|re|s|t|ve))?",
                            We = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
                            $e = "(?:" + De + "|" + Be + ")?",
                            Ve = "[" + Ae + "]?",
                            Je = Ve + $e + "(?:" + Ge + "(?:" + [Ce, Ue, je].join("|") + ")" + Ve + $e + ")*",
                            He = "(?:" + [Oe, Ue, je].join("|") + ")" + Je,
                            Qe = "(?:" + [Ce + De + "?", De, Ue, je, Te].join("|") + ")",
                            Xe = RegExp("['’]", "g"),
                            Ze = RegExp(De, "g"),
                            Ye = RegExp(Be + "(?=" + Be + ")|" + Qe + Je, "g"),
                            Ke = RegExp([Ne + "?" + xe + "+" + Fe + "(?=" + [Re, Ne, "$"].join("|") + ")", qe + "+" + We + "(?=" + [Re, Ne + ze, "$"].join("|") + ")", Ne + "?" + ze + "+" + Fe, Ne + "+" + We, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Pe, He].join("|"), "g"),
                            et = RegExp("[" + Ge + be + ke + Ae + "]"),
                            tt = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
                            nt = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
                            rt = -1,
                            it = {};
                        it[x] = it[L] = it[B] = it[C] = it[U] = it[j] = it[N] = it[G] = it[z] = !0, it[p] = it[v] = it[P] = it[y] = it[O] = it[_] = it[m] = it[w] = it[k] = it[I] = it[E] = it[A] = it[M] = it[T] = it[D] = !1;
                        var ot = {};
                        ot[p] = ot[v] = ot[P] = ot[O] = ot[y] = ot[_] = ot[x] = ot[L] = ot[B] = ot[C] = ot[U] = ot[k] = ot[I] = ot[E] = ot[A] = ot[M] = ot[T] = ot[R] = ot[j] = ot[N] = ot[G] = ot[z] = !0, ot[m] = ot[w] = ot[D] = !1;
                        var st = {
                                "\\": "\\",
                                "'": "'",
                                "\n": "n",
                                "\r": "r",
                                "\u2028": "u2028",
                                "\u2029": "u2029"
                            },
                            at = parseFloat,
                            ut = parseInt,
                            lt = "object" == typeof n.g && n.g && n.g.Object === Object && n.g,
                            ct = "object" == typeof self && self && self.Object === Object && self,
                            ht = lt || ct || Function("return this")(),
                            dt = t && !t.nodeType && t,
                            ft = dt && e && !e.nodeType && e,
                            gt = ft && ft.exports === dt,
                            pt = gt && lt.process,
                            vt = function() {
                                try {
                                    return ft && ft.require && ft.require("util").types || pt && pt.binding && pt.binding("util")
                                } catch (e) {}
                            }(),
                            yt = vt && vt.isArrayBuffer,
                            _t = vt && vt.isDate,
                            mt = vt && vt.isMap,
                            wt = vt && vt.isRegExp,
                            bt = vt && vt.isSet,
                            kt = vt && vt.isTypedArray;

                        function It(e, t, n) {
                            switch (n.length) {
                                case 0:
                                    return e.call(t);
                                case 1:
                                    return e.call(t, n[0]);
                                case 2:
                                    return e.call(t, n[0], n[1]);
                                case 3:
                                    return e.call(t, n[0], n[1], n[2])
                            }
                            return e.apply(t, n)
                        }

                        function Et(e, t, n, r) {
                            for (var i = -1, o = null == e ? 0 : e.length; ++i < o;) {
                                var s = e[i];
                                t(r, s, n(s), e)
                            }
                            return r
                        }

                        function St(e, t) {
                            for (var n = -1, r = null == e ? 0 : e.length; ++n < r && !1 !== t(e[n], n, e););
                            return e
                        }

                        function At(e, t) {
                            for (var n = null == e ? 0 : e.length; n-- && !1 !== t(e[n], n, e););
                            return e
                        }

                        function Mt(e, t) {
                            for (var n = -1, r = null == e ? 0 : e.length; ++n < r;)
                                if (!t(e[n], n, e)) return !1;
                            return !0
                        }

                        function Tt(e, t) {
                            for (var n = -1, r = null == e ? 0 : e.length, i = 0, o = []; ++n < r;) {
                                var s = e[n];
                                t(s, n, e) && (o[i++] = s)
                            }
                            return o
                        }

                        function Rt(e, t) {
                            return !(null == e || !e.length) && Nt(e, t, 0) > -1
                        }

                        function Dt(e, t, n) {
                            for (var r = -1, i = null == e ? 0 : e.length; ++r < i;)
                                if (n(t, e[r])) return !0;
                            return !1
                        }

                        function Pt(e, t) {
                            for (var n = -1, r = null == e ? 0 : e.length, i = Array(r); ++n < r;) i[n] = t(e[n], n, e);
                            return i
                        }

                        function Ot(e, t) {
                            for (var n = -1, r = t.length, i = e.length; ++n < r;) e[i + n] = t[n];
                            return e
                        }

                        function xt(e, t, n, r) {
                            var i = -1,
                                o = null == e ? 0 : e.length;
                            for (r && o && (n = e[++i]); ++i < o;) n = t(n, e[i], i, e);
                            return n
                        }

                        function Lt(e, t, n, r) {
                            var i = null == e ? 0 : e.length;
                            for (r && i && (n = e[--i]); i--;) n = t(n, e[i], i, e);
                            return n
                        }

                        function Bt(e, t) {
                            for (var n = -1, r = null == e ? 0 : e.length; ++n < r;)
                                if (t(e[n], n, e)) return !0;
                            return !1
                        }
                        var Ct = Ft("length");

                        function Ut(e, t, n) {
                            var r;
                            return n(e, function(e, n, i) {
                                if (t(e, n, i)) return r = n, !1
                            }), r
                        }

                        function jt(e, t, n, r) {
                            for (var i = e.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i;)
                                if (t(e[o], o, e)) return o;
                            return -1
                        }

                        function Nt(e, t, n) {
                            return t == t ? function(e, t, n) {
                                for (var r = n - 1, i = e.length; ++r < i;)
                                    if (e[r] === t) return r;
                                return -1
                            }(e, t, n) : jt(e, zt, n)
                        }

                        function Gt(e, t, n, r) {
                            for (var i = n - 1, o = e.length; ++i < o;)
                                if (r(e[i], t)) return i;
                            return -1
                        }

                        function zt(e) {
                            return e != e
                        }

                        function qt(e, t) {
                            var n = null == e ? 0 : e.length;
                            return n ? Vt(e, t) / n : d
                        }

                        function Ft(e) {
                            return function(t) {
                                return null == t ? i : t[e]
                            }
                        }

                        function Wt(e) {
                            return function(t) {
                                return null == e ? i : e[t]
                            }
                        }

                        function $t(e, t, n, r, i) {
                            return i(e, function(e, i, o) {
                                n = r ? (r = !1, e) : t(n, e, i, o)
                            }), n
                        }

                        function Vt(e, t) {
                            for (var n, r = -1, o = e.length; ++r < o;) {
                                var s = t(e[r]);
                                s !== i && (n = n === i ? s : n + s)
                            }
                            return n
                        }

                        function Jt(e, t) {
                            for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
                            return r
                        }

                        function Ht(e) {
                            return e ? e.slice(0, dn(e) + 1).replace(re, "") : e
                        }

                        function Qt(e) {
                            return function(t) {
                                return e(t)
                            }
                        }

                        function Xt(e, t) {
                            return Pt(t, function(t) {
                                return e[t]
                            })
                        }

                        function Zt(e, t) {
                            return e.has(t)
                        }

                        function Yt(e, t) {
                            for (var n = -1, r = e.length; ++n < r && Nt(t, e[n], 0) > -1;);
                            return n
                        }

                        function Kt(e, t) {
                            for (var n = e.length; n-- && Nt(t, e[n], 0) > -1;);
                            return n
                        }
                        var en = Wt({
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
                                ſ: "s"
                            }),
                            tn = Wt({
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#39;"
                            });

                        function nn(e) {
                            return "\\" + st[e]
                        }

                        function rn(e) {
                            return et.test(e)
                        }

                        function on(e) {
                            var t = -1,
                                n = Array(e.size);
                            return e.forEach(function(e, r) {
                                n[++t] = [r, e]
                            }), n
                        }

                        function sn(e, t) {
                            return function(n) {
                                return e(t(n))
                            }
                        }

                        function an(e, t) {
                            for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
                                var s = e[n];
                                s !== t && s !== a || (e[n] = a, o[i++] = n)
                            }
                            return o
                        }

                        function un(e) {
                            var t = -1,
                                n = Array(e.size);
                            return e.forEach(function(e) {
                                n[++t] = e
                            }), n
                        }

                        function ln(e) {
                            var t = -1,
                                n = Array(e.size);
                            return e.forEach(function(e) {
                                n[++t] = [e, e]
                            }), n
                        }

                        function cn(e) {
                            return rn(e) ? function(e) {
                                for (var t = Ye.lastIndex = 0; Ye.test(e);) ++t;
                                return t
                            }(e) : Ct(e)
                        }

                        function hn(e) {
                            return rn(e) ? function(e) {
                                return e.match(Ye) || []
                            }(e) : function(e) {
                                return e.split("")
                            }(e)
                        }

                        function dn(e) {
                            for (var t = e.length; t-- && ie.test(e.charAt(t)););
                            return t
                        }
                        var fn = Wt({
                                "&amp;": "&",
                                "&lt;": "<",
                                "&gt;": ">",
                                "&quot;": '"',
                                "&#39;": "'"
                            }),
                            gn = function e(t) {
                                var n, r = (t = null == t ? ht : gn.defaults(ht.Object(), t, gn.pick(ht, nt))).Array,
                                    ie = t.Date,
                                    be = t.Error,
                                    ke = t.Function,
                                    Ie = t.Math,
                                    Ee = t.Object,
                                    Se = t.RegExp,
                                    Ae = t.String,
                                    Me = t.TypeError,
                                    Te = r.prototype,
                                    Re = ke.prototype,
                                    De = Ee.prototype,
                                    Pe = t["__core-js_shared__"],
                                    Oe = Re.toString,
                                    xe = De.hasOwnProperty,
                                    Le = 0,
                                    Be = (n = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "",
                                    Ce = De.toString,
                                    Ue = Oe.call(Ee),
                                    je = ht._,
                                    Ne = Se("^" + Oe.call(xe).replace(te, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                                    Ge = gt ? t.Buffer : i,
                                    ze = t.Symbol,
                                    qe = t.Uint8Array,
                                    Fe = Ge ? Ge.allocUnsafe : i,
                                    We = sn(Ee.getPrototypeOf, Ee),
                                    $e = Ee.create,
                                    Ve = De.propertyIsEnumerable,
                                    Je = Te.splice,
                                    He = ze ? ze.isConcatSpreadable : i,
                                    Qe = ze ? ze.iterator : i,
                                    Ye = ze ? ze.toStringTag : i,
                                    et = function() {
                                        try {
                                            var e = uo(Ee, "defineProperty");
                                            return e({}, "", {}), e
                                        } catch (e) {}
                                    }(),
                                    st = t.clearTimeout !== ht.clearTimeout && t.clearTimeout,
                                    lt = ie && ie.now !== ht.Date.now && ie.now,
                                    ct = t.setTimeout !== ht.setTimeout && t.setTimeout,
                                    dt = Ie.ceil,
                                    ft = Ie.floor,
                                    pt = Ee.getOwnPropertySymbols,
                                    vt = Ge ? Ge.isBuffer : i,
                                    Ct = t.isFinite,
                                    Wt = Te.join,
                                    pn = sn(Ee.keys, Ee),
                                    vn = Ie.max,
                                    yn = Ie.min,
                                    _n = ie.now,
                                    mn = t.parseInt,
                                    wn = Ie.random,
                                    bn = Te.reverse,
                                    kn = uo(t, "DataView"),
                                    In = uo(t, "Map"),
                                    En = uo(t, "Promise"),
                                    Sn = uo(t, "Set"),
                                    An = uo(t, "WeakMap"),
                                    Mn = uo(Ee, "create"),
                                    Tn = An && new An,
                                    Rn = {},
                                    Dn = Uo(kn),
                                    Pn = Uo(In),
                                    On = Uo(En),
                                    xn = Uo(Sn),
                                    Ln = Uo(An),
                                    Bn = ze ? ze.prototype : i,
                                    Cn = Bn ? Bn.valueOf : i,
                                    Un = Bn ? Bn.toString : i;

                                function jn(e) {
                                    if (ea(e) && !Fs(e) && !(e instanceof qn)) {
                                        if (e instanceof zn) return e;
                                        if (xe.call(e, "__wrapped__")) return jo(e)
                                    }
                                    return new zn(e)
                                }
                                var Nn = function() {
                                    function e() {}
                                    return function(t) {
                                        if (!Ks(t)) return {};
                                        if ($e) return $e(t);
                                        e.prototype = t;
                                        var n = new e;
                                        return e.prototype = i, n
                                    }
                                }();

                                function Gn() {}

                                function zn(e, t) {
                                    this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = i
                                }

                                function qn(e) {
                                    this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = f, this.__views__ = []
                                }

                                function Fn(e) {
                                    var t = -1,
                                        n = null == e ? 0 : e.length;
                                    for (this.clear(); ++t < n;) {
                                        var r = e[t];
                                        this.set(r[0], r[1])
                                    }
                                }

                                function Wn(e) {
                                    var t = -1,
                                        n = null == e ? 0 : e.length;
                                    for (this.clear(); ++t < n;) {
                                        var r = e[t];
                                        this.set(r[0], r[1])
                                    }
                                }

                                function $n(e) {
                                    var t = -1,
                                        n = null == e ? 0 : e.length;
                                    for (this.clear(); ++t < n;) {
                                        var r = e[t];
                                        this.set(r[0], r[1])
                                    }
                                }

                                function Vn(e) {
                                    var t = -1,
                                        n = null == e ? 0 : e.length;
                                    for (this.__data__ = new $n; ++t < n;) this.add(e[t])
                                }

                                function Jn(e) {
                                    var t = this.__data__ = new Wn(e);
                                    this.size = t.size
                                }

                                function Hn(e, t) {
                                    var n = Fs(e),
                                        r = !n && qs(e),
                                        i = !n && !r && Js(e),
                                        o = !n && !r && !i && ua(e),
                                        s = n || r || i || o,
                                        a = s ? Jt(e.length, Ae) : [],
                                        u = a.length;
                                    for (var l in e) !t && !xe.call(e, l) || s && ("length" == l || i && ("offset" == l || "parent" == l) || o && ("buffer" == l || "byteLength" == l || "byteOffset" == l) || vo(l, u)) || a.push(l);
                                    return a
                                }

                                function Qn(e) {
                                    var t = e.length;
                                    return t ? e[$r(0, t - 1)] : i
                                }

                                function Xn(e, t) {
                                    return Oo(Ai(e), or(t, 0, e.length))
                                }

                                function Zn(e) {
                                    return Oo(Ai(e))
                                }

                                function Yn(e, t, n) {
                                    (n !== i && !Ns(e[t], n) || n === i && !(t in e)) && rr(e, t, n)
                                }

                                function Kn(e, t, n) {
                                    var r = e[t];
                                    xe.call(e, t) && Ns(r, n) && (n !== i || t in e) || rr(e, t, n)
                                }

                                function er(e, t) {
                                    for (var n = e.length; n--;)
                                        if (Ns(e[n][0], t)) return n;
                                    return -1
                                }

                                function tr(e, t, n, r) {
                                    return cr(e, function(e, i, o) {
                                        t(r, e, n(e), o)
                                    }), r
                                }

                                function nr(e, t) {
                                    return e && Mi(t, Da(t), e)
                                }

                                function rr(e, t, n) {
                                    "__proto__" == t && et ? et(e, t, {
                                        configurable: !0,
                                        enumerable: !0,
                                        value: n,
                                        writable: !0
                                    }) : e[t] = n
                                }

                                function ir(e, t) {
                                    for (var n = -1, o = t.length, s = r(o), a = null == e; ++n < o;) s[n] = a ? i : Sa(e, t[n]);
                                    return s
                                }

                                function or(e, t, n) {
                                    return e == e && (n !== i && (e = e <= n ? e : n), t !== i && (e = e >= t ? e : t)), e
                                }

                                function sr(e, t, n, r, o, s) {
                                    var a, u = 1 & t,
                                        l = 2 & t,
                                        c = 4 & t;
                                    if (n && (a = o ? n(e, r, o, s) : n(e)), a !== i) return a;
                                    if (!Ks(e)) return e;
                                    var h = Fs(e);
                                    if (h) {
                                        if (a = function(e) {
                                                var t = e.length,
                                                    n = new e.constructor(t);
                                                return t && "string" == typeof e[0] && xe.call(e, "index") && (n.index = e.index, n.input = e.input), n
                                            }(e), !u) return Ai(e, a)
                                    } else {
                                        var d = ho(e),
                                            f = d == w || d == b;
                                        if (Js(e)) return wi(e, u);
                                        if (d == E || d == p || f && !o) {
                                            if (a = l || f ? {} : go(e), !u) return l ? function(e, t) {
                                                return Mi(e, co(e), t)
                                            }(e, function(e, t) {
                                                return e && Mi(t, Pa(t), e)
                                            }(a, e)) : function(e, t) {
                                                return Mi(e, lo(e), t)
                                            }(e, nr(a, e))
                                        } else {
                                            if (!ot[d]) return o ? e : {};
                                            a = function(e, t, n) {
                                                var r, i = e.constructor;
                                                switch (t) {
                                                    case P:
                                                        return bi(e);
                                                    case y:
                                                    case _:
                                                        return new i(+e);
                                                    case O:
                                                        return function(e, t) {
                                                            var n = t ? bi(e.buffer) : e.buffer;
                                                            return new e.constructor(n, e.byteOffset, e.byteLength)
                                                        }(e, n);
                                                    case x:
                                                    case L:
                                                    case B:
                                                    case C:
                                                    case U:
                                                    case j:
                                                    case N:
                                                    case G:
                                                    case z:
                                                        return ki(e, n);
                                                    case k:
                                                        return new i;
                                                    case I:
                                                    case T:
                                                        return new i(e);
                                                    case A:
                                                        return function(e) {
                                                            var t = new e.constructor(e.source, de.exec(e));
                                                            return t.lastIndex = e.lastIndex, t
                                                        }(e);
                                                    case M:
                                                        return new i;
                                                    case R:
                                                        return r = e, Cn ? Ee(Cn.call(r)) : {}
                                                }
                                            }(e, d, u)
                                        }
                                    }
                                    s || (s = new Jn);
                                    var g = s.get(e);
                                    if (g) return g;
                                    s.set(e, a), oa(e) ? e.forEach(function(r) {
                                        a.add(sr(r, t, n, r, e, s))
                                    }) : ta(e) && e.forEach(function(r, i) {
                                        a.set(i, sr(r, t, n, i, e, s))
                                    });
                                    var v = h ? i : (c ? l ? to : eo : l ? Pa : Da)(e);
                                    return St(v || e, function(r, i) {
                                        v && (r = e[i = r]), Kn(a, i, sr(r, t, n, i, e, s))
                                    }), a
                                }

                                function ar(e, t, n) {
                                    var r = n.length;
                                    if (null == e) return !r;
                                    for (e = Ee(e); r--;) {
                                        var o = n[r],
                                            s = t[o],
                                            a = e[o];
                                        if (a === i && !(o in e) || !s(a)) return !1
                                    }
                                    return !0
                                }

                                function ur(e, t, n) {
                                    if ("function" != typeof e) throw new Me(o);
                                    return To(function() {
                                        e.apply(i, n)
                                    }, t)
                                }

                                function lr(e, t, n, r) {
                                    var i = -1,
                                        o = Rt,
                                        s = !0,
                                        a = e.length,
                                        u = [],
                                        l = t.length;
                                    if (!a) return u;
                                    n && (t = Pt(t, Qt(n))), r ? (o = Dt, s = !1) : t.length >= 200 && (o = Zt, s = !1, t = new Vn(t));
                                    e: for (; ++i < a;) {
                                        var c = e[i],
                                            h = null == n ? c : n(c);
                                        if (c = r || 0 !== c ? c : 0, s && h == h) {
                                            for (var d = l; d--;)
                                                if (t[d] === h) continue e;
                                            u.push(c)
                                        } else o(t, h, r) || u.push(c)
                                    }
                                    return u
                                }
                                jn.templateSettings = {
                                    escape: Q,
                                    evaluate: X,
                                    interpolate: Z,
                                    variable: "",
                                    imports: {
                                        _: jn
                                    }
                                }, jn.prototype = Gn.prototype, jn.prototype.constructor = jn, zn.prototype = Nn(Gn.prototype), zn.prototype.constructor = zn, qn.prototype = Nn(Gn.prototype), qn.prototype.constructor = qn, Fn.prototype.clear = function() {
                                    this.__data__ = Mn ? Mn(null) : {}, this.size = 0
                                }, Fn.prototype.delete = function(e) {
                                    var t = this.has(e) && delete this.__data__[e];
                                    return this.size -= t ? 1 : 0, t
                                }, Fn.prototype.get = function(e) {
                                    var t = this.__data__;
                                    if (Mn) {
                                        var n = t[e];
                                        return n === s ? i : n
                                    }
                                    return xe.call(t, e) ? t[e] : i
                                }, Fn.prototype.has = function(e) {
                                    var t = this.__data__;
                                    return Mn ? t[e] !== i : xe.call(t, e)
                                }, Fn.prototype.set = function(e, t) {
                                    var n = this.__data__;
                                    return this.size += this.has(e) ? 0 : 1, n[e] = Mn && t === i ? s : t, this
                                }, Wn.prototype.clear = function() {
                                    this.__data__ = [], this.size = 0
                                }, Wn.prototype.delete = function(e) {
                                    var t = this.__data__,
                                        n = er(t, e);
                                    return !(n < 0 || (n == t.length - 1 ? t.pop() : Je.call(t, n, 1), --this.size, 0))
                                }, Wn.prototype.get = function(e) {
                                    var t = this.__data__,
                                        n = er(t, e);
                                    return n < 0 ? i : t[n][1]
                                }, Wn.prototype.has = function(e) {
                                    return er(this.__data__, e) > -1
                                }, Wn.prototype.set = function(e, t) {
                                    var n = this.__data__,
                                        r = er(n, e);
                                    return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this
                                }, $n.prototype.clear = function() {
                                    this.size = 0, this.__data__ = {
                                        hash: new Fn,
                                        map: new(In || Wn),
                                        string: new Fn
                                    }
                                }, $n.prototype.delete = function(e) {
                                    var t = so(this, e).delete(e);
                                    return this.size -= t ? 1 : 0, t
                                }, $n.prototype.get = function(e) {
                                    return so(this, e).get(e)
                                }, $n.prototype.has = function(e) {
                                    return so(this, e).has(e)
                                }, $n.prototype.set = function(e, t) {
                                    var n = so(this, e),
                                        r = n.size;
                                    return n.set(e, t), this.size += n.size == r ? 0 : 1, this
                                }, Vn.prototype.add = Vn.prototype.push = function(e) {
                                    return this.__data__.set(e, s), this
                                }, Vn.prototype.has = function(e) {
                                    return this.__data__.has(e)
                                }, Jn.prototype.clear = function() {
                                    this.__data__ = new Wn, this.size = 0
                                }, Jn.prototype.delete = function(e) {
                                    var t = this.__data__,
                                        n = t.delete(e);
                                    return this.size = t.size, n
                                }, Jn.prototype.get = function(e) {
                                    return this.__data__.get(e)
                                }, Jn.prototype.has = function(e) {
                                    return this.__data__.has(e)
                                }, Jn.prototype.set = function(e, t) {
                                    var n = this.__data__;
                                    if (n instanceof Wn) {
                                        var r = n.__data__;
                                        if (!In || r.length < 199) return r.push([e, t]), this.size = ++n.size, this;
                                        n = this.__data__ = new $n(r)
                                    }
                                    return n.set(e, t), this.size = n.size, this
                                };
                                var cr = Di(_r),
                                    hr = Di(mr, !0);

                                function dr(e, t) {
                                    var n = !0;
                                    return cr(e, function(e, r, i) {
                                        return n = !!t(e, r, i)
                                    }), n
                                }

                                function fr(e, t, n) {
                                    for (var r = -1, o = e.length; ++r < o;) {
                                        var s = e[r],
                                            a = t(s);
                                        if (null != a && (u === i ? a == a && !aa(a) : n(a, u))) var u = a,
                                            l = s
                                    }
                                    return l
                                }

                                function gr(e, t) {
                                    var n = [];
                                    return cr(e, function(e, r, i) {
                                        t(e, r, i) && n.push(e)
                                    }), n
                                }

                                function pr(e, t, n, r, i) {
                                    var o = -1,
                                        s = e.length;
                                    for (n || (n = po), i || (i = []); ++o < s;) {
                                        var a = e[o];
                                        t > 0 && n(a) ? t > 1 ? pr(a, t - 1, n, r, i) : Ot(i, a) : r || (i[i.length] = a)
                                    }
                                    return i
                                }
                                var vr = Pi(),
                                    yr = Pi(!0);

                                function _r(e, t) {
                                    return e && vr(e, t, Da)
                                }

                                function mr(e, t) {
                                    return e && yr(e, t, Da)
                                }

                                function wr(e, t) {
                                    return Tt(t, function(t) {
                                        return Xs(e[t])
                                    })
                                }

                                function br(e, t) {
                                    for (var n = 0, r = (t = vi(t, e)).length; null != e && n < r;) e = e[Co(t[n++])];
                                    return n && n == r ? e : i
                                }

                                function kr(e, t, n) {
                                    var r = t(e);
                                    return Fs(e) ? r : Ot(r, n(e))
                                }

                                function Ir(e) {
                                    return null == e ? e === i ? "[object Undefined]" : "[object Null]" : Ye && Ye in Ee(e) ? function(e) {
                                        var t = xe.call(e, Ye),
                                            n = e[Ye];
                                        try {
                                            e[Ye] = i;
                                            var r = !0
                                        } catch (e) {}
                                        var o = Ce.call(e);
                                        return r && (t ? e[Ye] = n : delete e[Ye]), o
                                    }(e) : function(e) {
                                        return Ce.call(e)
                                    }(e)
                                }

                                function Er(e, t) {
                                    return e > t
                                }

                                function Sr(e, t) {
                                    return null != e && xe.call(e, t)
                                }

                                function Ar(e, t) {
                                    return null != e && t in Ee(e)
                                }

                                function Mr(e, t, n) {
                                    for (var o = n ? Dt : Rt, s = e[0].length, a = e.length, u = a, l = r(a), c = 1 / 0, h = []; u--;) {
                                        var d = e[u];
                                        u && t && (d = Pt(d, Qt(t))), c = yn(d.length, c), l[u] = !n && (t || s >= 120 && d.length >= 120) ? new Vn(u && d) : i
                                    }
                                    d = e[0];
                                    var f = -1,
                                        g = l[0];
                                    e: for (; ++f < s && h.length < c;) {
                                        var p = d[f],
                                            v = t ? t(p) : p;
                                        if (p = n || 0 !== p ? p : 0, !(g ? Zt(g, v) : o(h, v, n))) {
                                            for (u = a; --u;) {
                                                var y = l[u];
                                                if (!(y ? Zt(y, v) : o(e[u], v, n))) continue e
                                            }
                                            g && g.push(v), h.push(p)
                                        }
                                    }
                                    return h
                                }

                                function Tr(e, t, n) {
                                    var r = null == (e = So(e, t = vi(t, e))) ? e : e[Co(Qo(t))];
                                    return null == r ? i : It(r, e, n)
                                }

                                function Rr(e) {
                                    return ea(e) && Ir(e) == p
                                }

                                function Dr(e, t, n, r, o) {
                                    return e === t || (null == e || null == t || !ea(e) && !ea(t) ? e != e && t != t : function(e, t, n, r, o, s) {
                                        var a = Fs(e),
                                            u = Fs(t),
                                            l = a ? v : ho(e),
                                            c = u ? v : ho(t),
                                            h = (l = l == p ? E : l) == E,
                                            d = (c = c == p ? E : c) == E,
                                            f = l == c;
                                        if (f && Js(e)) {
                                            if (!Js(t)) return !1;
                                            a = !0, h = !1
                                        }
                                        if (f && !h) return s || (s = new Jn), a || ua(e) ? Yi(e, t, n, r, o, s) : function(e, t, n, r, i, o, s) {
                                            switch (n) {
                                                case O:
                                                    if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
                                                    e = e.buffer, t = t.buffer;
                                                case P:
                                                    return !(e.byteLength != t.byteLength || !o(new qe(e), new qe(t)));
                                                case y:
                                                case _:
                                                case I:
                                                    return Ns(+e, +t);
                                                case m:
                                                    return e.name == t.name && e.message == t.message;
                                                case A:
                                                case T:
                                                    return e == t + "";
                                                case k:
                                                    var a = on;
                                                case M:
                                                    var u = 1 & r;
                                                    if (a || (a = un), e.size != t.size && !u) return !1;
                                                    var l = s.get(e);
                                                    if (l) return l == t;
                                                    r |= 2, s.set(e, t);
                                                    var c = Yi(a(e), a(t), r, i, o, s);
                                                    return s.delete(e), c;
                                                case R:
                                                    if (Cn) return Cn.call(e) == Cn.call(t)
                                            }
                                            return !1
                                        }(e, t, l, n, r, o, s);
                                        if (!(1 & n)) {
                                            var g = h && xe.call(e, "__wrapped__"),
                                                w = d && xe.call(t, "__wrapped__");
                                            if (g || w) {
                                                var b = g ? e.value() : e,
                                                    S = w ? t.value() : t;
                                                return s || (s = new Jn), o(b, S, n, r, s)
                                            }
                                        }
                                        return !!f && (s || (s = new Jn), function(e, t, n, r, o, s) {
                                            var a = 1 & n,
                                                u = eo(e),
                                                l = u.length;
                                            if (l != eo(t).length && !a) return !1;
                                            for (var c = l; c--;) {
                                                var h = u[c];
                                                if (!(a ? h in t : xe.call(t, h))) return !1
                                            }
                                            var d = s.get(e),
                                                f = s.get(t);
                                            if (d && f) return d == t && f == e;
                                            var g = !0;
                                            s.set(e, t), s.set(t, e);
                                            for (var p = a; ++c < l;) {
                                                var v = e[h = u[c]],
                                                    y = t[h];
                                                if (r) var _ = a ? r(y, v, h, t, e, s) : r(v, y, h, e, t, s);
                                                if (!(_ === i ? v === y || o(v, y, n, r, s) : _)) {
                                                    g = !1;
                                                    break
                                                }
                                                p || (p = "constructor" == h)
                                            }
                                            if (g && !p) {
                                                var m = e.constructor,
                                                    w = t.constructor;
                                                m == w || !("constructor" in e) || !("constructor" in t) || "function" == typeof m && m instanceof m && "function" == typeof w && w instanceof w || (g = !1)
                                            }
                                            return s.delete(e), s.delete(t), g
                                        }(e, t, n, r, o, s))
                                    }(e, t, n, r, Dr, o))
                                }

                                function Pr(e, t, n, r) {
                                    var o = n.length,
                                        s = o,
                                        a = !r;
                                    if (null == e) return !s;
                                    for (e = Ee(e); o--;) {
                                        var u = n[o];
                                        if (a && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) return !1
                                    }
                                    for (; ++o < s;) {
                                        var l = (u = n[o])[0],
                                            c = e[l],
                                            h = u[1];
                                        if (a && u[2]) {
                                            if (c === i && !(l in e)) return !1
                                        } else {
                                            var d = new Jn;
                                            if (r) var f = r(c, h, l, e, t, d);
                                            if (!(f === i ? Dr(h, c, 3, r, d) : f)) return !1
                                        }
                                    }
                                    return !0
                                }

                                function Or(e) {
                                    return !(!Ks(e) || (t = e, Be && Be in t)) && (Xs(e) ? Ne : pe).test(Uo(e));
                                    var t
                                }

                                function xr(e) {
                                    return "function" == typeof e ? e : null == e ? nu : "object" == typeof e ? Fs(e) ? jr(e[0], e[1]) : Ur(e) : hu(e)
                                }

                                function Lr(e) {
                                    if (!bo(e)) return pn(e);
                                    var t = [];
                                    for (var n in Ee(e)) xe.call(e, n) && "constructor" != n && t.push(n);
                                    return t
                                }

                                function Br(e, t) {
                                    return e < t
                                }

                                function Cr(e, t) {
                                    var n = -1,
                                        i = $s(e) ? r(e.length) : [];
                                    return cr(e, function(e, r, o) {
                                        i[++n] = t(e, r, o)
                                    }), i
                                }

                                function Ur(e) {
                                    var t = ao(e);
                                    return 1 == t.length && t[0][2] ? Io(t[0][0], t[0][1]) : function(n) {
                                        return n === e || Pr(n, e, t)
                                    }
                                }

                                function jr(e, t) {
                                    return _o(e) && ko(t) ? Io(Co(e), t) : function(n) {
                                        var r = Sa(n, e);
                                        return r === i && r === t ? Aa(n, e) : Dr(t, r, 3)
                                    }
                                }

                                function Nr(e, t, n, r, o) {
                                    e !== t && vr(t, function(s, a) {
                                        if (o || (o = new Jn), Ks(s)) ! function(e, t, n, r, o, s, a) {
                                            var u = Ao(e, n),
                                                l = Ao(t, n),
                                                c = a.get(l);
                                            if (c) Yn(e, n, c);
                                            else {
                                                var h = s ? s(u, l, n + "", e, t, a) : i,
                                                    d = h === i;
                                                if (d) {
                                                    var f = Fs(l),
                                                        g = !f && Js(l),
                                                        p = !f && !g && ua(l);
                                                    h = l, f || g || p ? Fs(u) ? h = u : Vs(u) ? h = Ai(u) : g ? (d = !1, h = wi(l, !0)) : p ? (d = !1, h = ki(l, !0)) : h = [] : ra(l) || qs(l) ? (h = u, qs(u) ? h = va(u) : Ks(u) && !Xs(u) || (h = go(l))) : d = !1
                                                }
                                                d && (a.set(l, h), o(h, l, r, s, a), a.delete(l)), Yn(e, n, h)
                                            }
                                        }(e, t, a, n, Nr, r, o);
                                        else {
                                            var u = r ? r(Ao(e, a), s, a + "", e, t, o) : i;
                                            u === i && (u = s), Yn(e, a, u)
                                        }
                                    }, Pa)
                                }

                                function Gr(e, t) {
                                    var n = e.length;
                                    if (n) return vo(t += t < 0 ? n : 0, n) ? e[t] : i
                                }

                                function zr(e, t, n) {
                                    t = t.length ? Pt(t, function(e) {
                                        return Fs(e) ? function(t) {
                                            return br(t, 1 === e.length ? e[0] : e)
                                        } : e
                                    }) : [nu];
                                    var r = -1;
                                    t = Pt(t, Qt(oo()));
                                    var i = Cr(e, function(e, n, i) {
                                        var o = Pt(t, function(t) {
                                            return t(e)
                                        });
                                        return {
                                            criteria: o,
                                            index: ++r,
                                            value: e
                                        }
                                    });
                                    return function(e) {
                                        var t = e.length;
                                        for (e.sort(function(e, t) {
                                                return function(e, t, n) {
                                                    for (var r = -1, i = e.criteria, o = t.criteria, s = i.length, a = n.length; ++r < s;) {
                                                        var u = Ii(i[r], o[r]);
                                                        if (u) return r >= a ? u : u * ("desc" == n[r] ? -1 : 1)
                                                    }
                                                    return e.index - t.index
                                                }(e, t, n)
                                            }); t--;) e[t] = e[t].value;
                                        return e
                                    }(i)
                                }

                                function qr(e, t, n) {
                                    for (var r = -1, i = t.length, o = {}; ++r < i;) {
                                        var s = t[r],
                                            a = br(e, s);
                                        n(a, s) && Xr(o, vi(s, e), a)
                                    }
                                    return o
                                }

                                function Fr(e, t, n, r) {
                                    var i = r ? Gt : Nt,
                                        o = -1,
                                        s = t.length,
                                        a = e;
                                    for (e === t && (t = Ai(t)), n && (a = Pt(e, Qt(n))); ++o < s;)
                                        for (var u = 0, l = t[o], c = n ? n(l) : l;
                                            (u = i(a, c, u, r)) > -1;) a !== e && Je.call(a, u, 1), Je.call(e, u, 1);
                                    return e
                                }

                                function Wr(e, t) {
                                    for (var n = e ? t.length : 0, r = n - 1; n--;) {
                                        var i = t[n];
                                        if (n == r || i !== o) {
                                            var o = i;
                                            vo(i) ? Je.call(e, i, 1) : ui(e, i)
                                        }
                                    }
                                    return e
                                }

                                function $r(e, t) {
                                    return e + ft(wn() * (t - e + 1))
                                }

                                function Vr(e, t) {
                                    var n = "";
                                    if (!e || t < 1 || t > h) return n;
                                    do {
                                        t % 2 && (n += e), (t = ft(t / 2)) && (e += e)
                                    } while (t);
                                    return n
                                }

                                function Jr(e, t) {
                                    return Ro(Eo(e, t, nu), e + "")
                                }

                                function Hr(e) {
                                    return Qn(Na(e))
                                }

                                function Qr(e, t) {
                                    var n = Na(e);
                                    return Oo(n, or(t, 0, n.length))
                                }

                                function Xr(e, t, n, r) {
                                    if (!Ks(e)) return e;
                                    for (var o = -1, s = (t = vi(t, e)).length, a = s - 1, u = e; null != u && ++o < s;) {
                                        var l = Co(t[o]),
                                            c = n;
                                        if ("__proto__" === l || "constructor" === l || "prototype" === l) return e;
                                        if (o != a) {
                                            var h = u[l];
                                            (c = r ? r(h, l, u) : i) === i && (c = Ks(h) ? h : vo(t[o + 1]) ? [] : {})
                                        }
                                        Kn(u, l, c), u = u[l]
                                    }
                                    return e
                                }
                                var Zr = Tn ? function(e, t) {
                                        return Tn.set(e, t), e
                                    } : nu,
                                    Yr = et ? function(e, t) {
                                        return et(e, "toString", {
                                            configurable: !0,
                                            enumerable: !1,
                                            value: Ka(t),
                                            writable: !0
                                        })
                                    } : nu;

                                function Kr(e) {
                                    return Oo(Na(e))
                                }

                                function ei(e, t, n) {
                                    var i = -1,
                                        o = e.length;
                                    t < 0 && (t = -t > o ? 0 : o + t), (n = n > o ? o : n) < 0 && (n += o), o = t > n ? 0 : n - t >>> 0, t >>>= 0;
                                    for (var s = r(o); ++i < o;) s[i] = e[i + t];
                                    return s
                                }

                                function ti(e, t) {
                                    var n;
                                    return cr(e, function(e, r, i) {
                                        return !(n = t(e, r, i))
                                    }), !!n
                                }

                                function ni(e, t, n) {
                                    var r = 0,
                                        i = null == e ? r : e.length;
                                    if ("number" == typeof t && t == t && i <= 2147483647) {
                                        for (; r < i;) {
                                            var o = r + i >>> 1,
                                                s = e[o];
                                            null !== s && !aa(s) && (n ? s <= t : s < t) ? r = o + 1 : i = o
                                        }
                                        return i
                                    }
                                    return ri(e, t, nu, n)
                                }

                                function ri(e, t, n, r) {
                                    var o = 0,
                                        s = null == e ? 0 : e.length;
                                    if (0 === s) return 0;
                                    for (var a = (t = n(t)) != t, u = null === t, l = aa(t), c = t === i; o < s;) {
                                        var h = ft((o + s) / 2),
                                            d = n(e[h]),
                                            f = d !== i,
                                            g = null === d,
                                            p = d == d,
                                            v = aa(d);
                                        if (a) var y = r || p;
                                        else y = c ? p && (r || f) : u ? p && f && (r || !g) : l ? p && f && !g && (r || !v) : !g && !v && (r ? d <= t : d < t);
                                        y ? o = h + 1 : s = h
                                    }
                                    return yn(s, 4294967294)
                                }

                                function ii(e, t) {
                                    for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
                                        var s = e[n],
                                            a = t ? t(s) : s;
                                        if (!n || !Ns(a, u)) {
                                            var u = a;
                                            o[i++] = 0 === s ? 0 : s
                                        }
                                    }
                                    return o
                                }

                                function oi(e) {
                                    return "number" == typeof e ? e : aa(e) ? d : +e
                                }

                                function si(e) {
                                    if ("string" == typeof e) return e;
                                    if (Fs(e)) return Pt(e, si) + "";
                                    if (aa(e)) return Un ? Un.call(e) : "";
                                    var t = e + "";
                                    return "0" == t && 1 / e == -1 / 0 ? "-0" : t
                                }

                                function ai(e, t, n) {
                                    var r = -1,
                                        i = Rt,
                                        o = e.length,
                                        s = !0,
                                        a = [],
                                        u = a;
                                    if (n) s = !1, i = Dt;
                                    else if (o >= 200) {
                                        var l = t ? null : Vi(e);
                                        if (l) return un(l);
                                        s = !1, i = Zt, u = new Vn
                                    } else u = t ? [] : a;
                                    e: for (; ++r < o;) {
                                        var c = e[r],
                                            h = t ? t(c) : c;
                                        if (c = n || 0 !== c ? c : 0, s && h == h) {
                                            for (var d = u.length; d--;)
                                                if (u[d] === h) continue e;
                                            t && u.push(h), a.push(c)
                                        } else i(u, h, n) || (u !== a && u.push(h), a.push(c))
                                    }
                                    return a
                                }

                                function ui(e, t) {
                                    return null == (e = So(e, t = vi(t, e))) || delete e[Co(Qo(t))]
                                }

                                function li(e, t, n, r) {
                                    return Xr(e, t, n(br(e, t)), r)
                                }

                                function ci(e, t, n, r) {
                                    for (var i = e.length, o = r ? i : -1;
                                        (r ? o-- : ++o < i) && t(e[o], o, e););
                                    return n ? ei(e, r ? 0 : o, r ? o + 1 : i) : ei(e, r ? o + 1 : 0, r ? i : o)
                                }

                                function hi(e, t) {
                                    var n = e;
                                    return n instanceof qn && (n = n.value()), xt(t, function(e, t) {
                                        return t.func.apply(t.thisArg, Ot([e], t.args))
                                    }, n)
                                }

                                function di(e, t, n) {
                                    var i = e.length;
                                    if (i < 2) return i ? ai(e[0]) : [];
                                    for (var o = -1, s = r(i); ++o < i;)
                                        for (var a = e[o], u = -1; ++u < i;) u != o && (s[o] = lr(s[o] || a, e[u], t, n));
                                    return ai(pr(s, 1), t, n)
                                }

                                function fi(e, t, n) {
                                    for (var r = -1, o = e.length, s = t.length, a = {}; ++r < o;) {
                                        var u = r < s ? t[r] : i;
                                        n(a, e[r], u)
                                    }
                                    return a
                                }

                                function gi(e) {
                                    return Vs(e) ? e : []
                                }

                                function pi(e) {
                                    return "function" == typeof e ? e : nu
                                }

                                function vi(e, t) {
                                    return Fs(e) ? e : _o(e, t) ? [e] : Bo(ya(e))
                                }
                                var yi = Jr;

                                function _i(e, t, n) {
                                    var r = e.length;
                                    return n = n === i ? r : n, !t && n >= r ? e : ei(e, t, n)
                                }
                                var mi = st || function(e) {
                                    return ht.clearTimeout(e)
                                };

                                function wi(e, t) {
                                    if (t) return e.slice();
                                    var n = e.length,
                                        r = Fe ? Fe(n) : new e.constructor(n);
                                    return e.copy(r), r
                                }

                                function bi(e) {
                                    var t = new e.constructor(e.byteLength);
                                    return new qe(t).set(new qe(e)), t
                                }

                                function ki(e, t) {
                                    var n = t ? bi(e.buffer) : e.buffer;
                                    return new e.constructor(n, e.byteOffset, e.length)
                                }

                                function Ii(e, t) {
                                    if (e !== t) {
                                        var n = e !== i,
                                            r = null === e,
                                            o = e == e,
                                            s = aa(e),
                                            a = t !== i,
                                            u = null === t,
                                            l = t == t,
                                            c = aa(t);
                                        if (!u && !c && !s && e > t || s && a && l && !u && !c || r && a && l || !n && l || !o) return 1;
                                        if (!r && !s && !c && e < t || c && n && o && !r && !s || u && n && o || !a && o || !l) return -1
                                    }
                                    return 0
                                }

                                function Ei(e, t, n, i) {
                                    for (var o = -1, s = e.length, a = n.length, u = -1, l = t.length, c = vn(s - a, 0), h = r(l + c), d = !i; ++u < l;) h[u] = t[u];
                                    for (; ++o < a;)(d || o < s) && (h[n[o]] = e[o]);
                                    for (; c--;) h[u++] = e[o++];
                                    return h
                                }

                                function Si(e, t, n, i) {
                                    for (var o = -1, s = e.length, a = -1, u = n.length, l = -1, c = t.length, h = vn(s - u, 0), d = r(h + c), f = !i; ++o < h;) d[o] = e[o];
                                    for (var g = o; ++l < c;) d[g + l] = t[l];
                                    for (; ++a < u;)(f || o < s) && (d[g + n[a]] = e[o++]);
                                    return d
                                }

                                function Ai(e, t) {
                                    var n = -1,
                                        i = e.length;
                                    for (t || (t = r(i)); ++n < i;) t[n] = e[n];
                                    return t
                                }

                                function Mi(e, t, n, r) {
                                    var o = !n;
                                    n || (n = {});
                                    for (var s = -1, a = t.length; ++s < a;) {
                                        var u = t[s],
                                            l = r ? r(n[u], e[u], u, n, e) : i;
                                        l === i && (l = e[u]), o ? rr(n, u, l) : Kn(n, u, l)
                                    }
                                    return n
                                }

                                function Ti(e, t) {
                                    return function(n, r) {
                                        var i = Fs(n) ? Et : tr,
                                            o = t ? t() : {};
                                        return i(n, e, oo(r, 2), o)
                                    }
                                }

                                function Ri(e) {
                                    return Jr(function(t, n) {
                                        var r = -1,
                                            o = n.length,
                                            s = o > 1 ? n[o - 1] : i,
                                            a = o > 2 ? n[2] : i;
                                        for (s = e.length > 3 && "function" == typeof s ? (o--, s) : i, a && yo(n[0], n[1], a) && (s = o < 3 ? i : s, o = 1), t = Ee(t); ++r < o;) {
                                            var u = n[r];
                                            u && e(t, u, r, s)
                                        }
                                        return t
                                    })
                                }

                                function Di(e, t) {
                                    return function(n, r) {
                                        if (null == n) return n;
                                        if (!$s(n)) return e(n, r);
                                        for (var i = n.length, o = t ? i : -1, s = Ee(n);
                                            (t ? o-- : ++o < i) && !1 !== r(s[o], o, s););
                                        return n
                                    }
                                }

                                function Pi(e) {
                                    return function(t, n, r) {
                                        for (var i = -1, o = Ee(t), s = r(t), a = s.length; a--;) {
                                            var u = s[e ? a : ++i];
                                            if (!1 === n(o[u], u, o)) break
                                        }
                                        return t
                                    }
                                }

                                function Oi(e) {
                                    return function(t) {
                                        var n = rn(t = ya(t)) ? hn(t) : i,
                                            r = n ? n[0] : t.charAt(0),
                                            o = n ? _i(n, 1).join("") : t.slice(1);
                                        return r[e]() + o
                                    }
                                }

                                function xi(e) {
                                    return function(t) {
                                        return xt(Xa(qa(t).replace(Xe, "")), e, "")
                                    }
                                }

                                function Li(e) {
                                    return function() {
                                        var t = arguments;
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
                                                return new e(t[0], t[1], t[2], t[3]);
                                            case 5:
                                                return new e(t[0], t[1], t[2], t[3], t[4]);
                                            case 6:
                                                return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                                            case 7:
                                                return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6])
                                        }
                                        var n = Nn(e.prototype),
                                            r = e.apply(n, t);
                                        return Ks(r) ? r : n
                                    }
                                }

                                function Bi(e) {
                                    return function(t, n, r) {
                                        var o = Ee(t);
                                        if (!$s(t)) {
                                            var s = oo(n, 3);
                                            t = Da(t), n = function(e) {
                                                return s(o[e], e, o)
                                            }
                                        }
                                        var a = e(t, n, r);
                                        return a > -1 ? o[s ? t[a] : a] : i
                                    }
                                }

                                function Ci(e) {
                                    return Ki(function(t) {
                                        var n = t.length,
                                            r = n,
                                            s = zn.prototype.thru;
                                        for (e && t.reverse(); r--;) {
                                            var a = t[r];
                                            if ("function" != typeof a) throw new Me(o);
                                            if (s && !u && "wrapper" == ro(a)) var u = new zn([], !0)
                                        }
                                        for (r = u ? r : n; ++r < n;) {
                                            var l = ro(a = t[r]),
                                                c = "wrapper" == l ? no(a) : i;
                                            u = c && mo(c[0]) && 424 == c[1] && !c[4].length && 1 == c[9] ? u[ro(c[0])].apply(u, c[3]) : 1 == a.length && mo(a) ? u[l]() : u.thru(a)
                                        }
                                        return function() {
                                            var e = arguments,
                                                r = e[0];
                                            if (u && 1 == e.length && Fs(r)) return u.plant(r).value();
                                            for (var i = 0, o = n ? t[i].apply(this, e) : r; ++i < n;) o = t[i].call(this, o);
                                            return o
                                        }
                                    })
                                }

                                function Ui(e, t, n, o, s, a, u, c, h, d) {
                                    var f = t & l,
                                        g = 1 & t,
                                        p = 2 & t,
                                        v = 24 & t,
                                        y = 512 & t,
                                        _ = p ? i : Li(e);
                                    return function l() {
                                        for (var m = arguments.length, w = r(m), b = m; b--;) w[b] = arguments[b];
                                        if (v) var k = io(l),
                                            I = function(e, t) {
                                                for (var n = e.length, r = 0; n--;) e[n] === t && ++r;
                                                return r
                                            }(w, k);
                                        if (o && (w = Ei(w, o, s, v)), a && (w = Si(w, a, u, v)), m -= I, v && m < d) {
                                            var E = an(w, k);
                                            return Wi(e, t, Ui, l.placeholder, n, w, E, c, h, d - m)
                                        }
                                        var S = g ? n : this,
                                            A = p ? S[e] : e;
                                        return m = w.length, c ? w = function(e, t) {
                                            for (var n = e.length, r = yn(t.length, n), o = Ai(e); r--;) {
                                                var s = t[r];
                                                e[r] = vo(s, n) ? o[s] : i
                                            }
                                            return e
                                        }(w, c) : y && m > 1 && w.reverse(), f && h < m && (w.length = h), this && this !== ht && this instanceof l && (A = _ || Li(A)), A.apply(S, w)
                                    }
                                }

                                function ji(e, t) {
                                    return function(n, r) {
                                        return function(e, t, n, r) {
                                            return _r(e, function(e, i, o) {
                                                t(r, n(e), i, o)
                                            }), r
                                        }(n, e, t(r), {})
                                    }
                                }

                                function Ni(e, t) {
                                    return function(n, r) {
                                        var o;
                                        if (n === i && r === i) return t;
                                        if (n !== i && (o = n), r !== i) {
                                            if (o === i) return r;
                                            "string" == typeof n || "string" == typeof r ? (n = si(n), r = si(r)) : (n = oi(n), r = oi(r)), o = e(n, r)
                                        }
                                        return o
                                    }
                                }

                                function Gi(e) {
                                    return Ki(function(t) {
                                        return t = Pt(t, Qt(oo())), Jr(function(n) {
                                            var r = this;
                                            return e(t, function(e) {
                                                return It(e, r, n)
                                            })
                                        })
                                    })
                                }

                                function zi(e, t) {
                                    var n = (t = t === i ? " " : si(t)).length;
                                    if (n < 2) return n ? Vr(t, e) : t;
                                    var r = Vr(t, dt(e / cn(t)));
                                    return rn(t) ? _i(hn(r), 0, e).join("") : r.slice(0, e)
                                }

                                function qi(e) {
                                    return function(t, n, o) {
                                        return o && "number" != typeof o && yo(t, n, o) && (n = o = i), t = da(t), n === i ? (n = t, t = 0) : n = da(n),
                                            function(e, t, n, i) {
                                                for (var o = -1, s = vn(dt((t - e) / (n || 1)), 0), a = r(s); s--;) a[i ? s : ++o] = e, e += n;
                                                return a
                                            }(t, n, o = o === i ? t < n ? 1 : -1 : da(o), e)
                                    }
                                }

                                function Fi(e) {
                                    return function(t, n) {
                                        return "string" == typeof t && "string" == typeof n || (t = pa(t), n = pa(n)), e(t, n)
                                    }
                                }

                                function Wi(e, t, n, r, o, s, a, l, c, h) {
                                    var d = 8 & t;
                                    t |= d ? u : 64, 4 & (t &= ~(d ? 64 : u)) || (t &= -4);
                                    var f = [e, t, o, d ? s : i, d ? a : i, d ? i : s, d ? i : a, l, c, h],
                                        g = n.apply(i, f);
                                    return mo(e) && Mo(g, f), g.placeholder = r, Do(g, e, t)
                                }

                                function $i(e) {
                                    var t = Ie[e];
                                    return function(e, n) {
                                        if (e = pa(e), (n = null == n ? 0 : yn(fa(n), 292)) && Ct(e)) {
                                            var r = (ya(e) + "e").split("e");
                                            return +((r = (ya(t(r[0] + "e" + (+r[1] + n))) + "e").split("e"))[0] + "e" + (+r[1] - n))
                                        }
                                        return t(e)
                                    }
                                }
                                var Vi = Sn && 1 / un(new Sn([, -0]))[1] == c ? function(e) {
                                    return new Sn(e)
                                } : au;

                                function Ji(e) {
                                    return function(t) {
                                        var n = ho(t);
                                        return n == k ? on(t) : n == M ? ln(t) : function(e, t) {
                                            return Pt(t, function(t) {
                                                return [t, e[t]]
                                            })
                                        }(t, e(t))
                                    }
                                }

                                function Hi(e, t, n, s, c, h, d, f) {
                                    var g = 2 & t;
                                    if (!g && "function" != typeof e) throw new Me(o);
                                    var p = s ? s.length : 0;
                                    if (p || (t &= -97, s = c = i), d = d === i ? d : vn(fa(d), 0), f = f === i ? f : fa(f), p -= c ? c.length : 0, 64 & t) {
                                        var v = s,
                                            y = c;
                                        s = c = i
                                    }
                                    var _ = g ? i : no(e),
                                        m = [e, t, n, s, c, v, y, h, d, f];
                                    if (_ && function(e, t) {
                                            var n = e[1],
                                                r = t[1],
                                                i = n | r,
                                                o = i < 131,
                                                s = r == l && 8 == n || r == l && 256 == n && e[7].length <= t[8] || 384 == r && t[7].length <= t[8] && 8 == n;
                                            if (!o && !s) return e;
                                            1 & r && (e[2] = t[2], i |= 1 & n ? 0 : 4);
                                            var u = t[3];
                                            if (u) {
                                                var c = e[3];
                                                e[3] = c ? Ei(c, u, t[4]) : u, e[4] = c ? an(e[3], a) : t[4]
                                            }(u = t[5]) && (c = e[5], e[5] = c ? Si(c, u, t[6]) : u, e[6] = c ? an(e[5], a) : t[6]), (u = t[7]) && (e[7] = u), r & l && (e[8] = null == e[8] ? t[8] : yn(e[8], t[8])), null == e[9] && (e[9] = t[9]), e[0] = t[0], e[1] = i
                                        }(m, _), e = m[0], t = m[1], n = m[2], s = m[3], c = m[4], !(f = m[9] = m[9] === i ? g ? 0 : e.length : vn(m[9] - p, 0)) && 24 & t && (t &= -25), t && 1 != t) w = 8 == t || 16 == t ? function(e, t, n) {
                                        var o = Li(e);
                                        return function s() {
                                            for (var a = arguments.length, u = r(a), l = a, c = io(s); l--;) u[l] = arguments[l];
                                            var h = a < 3 && u[0] !== c && u[a - 1] !== c ? [] : an(u, c);
                                            return (a -= h.length) < n ? Wi(e, t, Ui, s.placeholder, i, u, h, i, i, n - a) : It(this && this !== ht && this instanceof s ? o : e, this, u)
                                        }
                                    }(e, t, f) : t != u && 33 != t || c.length ? Ui.apply(i, m) : function(e, t, n, i) {
                                        var o = 1 & t,
                                            s = Li(e);
                                        return function t() {
                                            for (var a = -1, u = arguments.length, l = -1, c = i.length, h = r(c + u), d = this && this !== ht && this instanceof t ? s : e; ++l < c;) h[l] = i[l];
                                            for (; u--;) h[l++] = arguments[++a];
                                            return It(d, o ? n : this, h)
                                        }
                                    }(e, t, n, s);
                                    else var w = function(e, t, n) {
                                        var r = 1 & t,
                                            i = Li(e);
                                        return function t() {
                                            return (this && this !== ht && this instanceof t ? i : e).apply(r ? n : this, arguments)
                                        }
                                    }(e, t, n);
                                    return Do((_ ? Zr : Mo)(w, m), e, t)
                                }

                                function Qi(e, t, n, r) {
                                    return e === i || Ns(e, De[n]) && !xe.call(r, n) ? t : e
                                }

                                function Xi(e, t, n, r, o, s) {
                                    return Ks(e) && Ks(t) && (s.set(t, e), Nr(e, t, i, Xi, s), s.delete(t)), e
                                }

                                function Zi(e) {
                                    return ra(e) ? i : e
                                }

                                function Yi(e, t, n, r, o, s) {
                                    var a = 1 & n,
                                        u = e.length,
                                        l = t.length;
                                    if (u != l && !(a && l > u)) return !1;
                                    var c = s.get(e),
                                        h = s.get(t);
                                    if (c && h) return c == t && h == e;
                                    var d = -1,
                                        f = !0,
                                        g = 2 & n ? new Vn : i;
                                    for (s.set(e, t), s.set(t, e); ++d < u;) {
                                        var p = e[d],
                                            v = t[d];
                                        if (r) var y = a ? r(v, p, d, t, e, s) : r(p, v, d, e, t, s);
                                        if (y !== i) {
                                            if (y) continue;
                                            f = !1;
                                            break
                                        }
                                        if (g) {
                                            if (!Bt(t, function(e, t) {
                                                    if (!Zt(g, t) && (p === e || o(p, e, n, r, s))) return g.push(t)
                                                })) {
                                                f = !1;
                                                break
                                            }
                                        } else if (p !== v && !o(p, v, n, r, s)) {
                                            f = !1;
                                            break
                                        }
                                    }
                                    return s.delete(e), s.delete(t), f
                                }

                                function Ki(e) {
                                    return Ro(Eo(e, i, Wo), e + "")
                                }

                                function eo(e) {
                                    return kr(e, Da, lo)
                                }

                                function to(e) {
                                    return kr(e, Pa, co)
                                }
                                var no = Tn ? function(e) {
                                    return Tn.get(e)
                                } : au;

                                function ro(e) {
                                    for (var t = e.name + "", n = Rn[t], r = xe.call(Rn, t) ? n.length : 0; r--;) {
                                        var i = n[r],
                                            o = i.func;
                                        if (null == o || o == e) return i.name
                                    }
                                    return t
                                }

                                function io(e) {
                                    return (xe.call(jn, "placeholder") ? jn : e).placeholder
                                }

                                function oo() {
                                    var e = jn.iteratee || ru;
                                    return e = e === ru ? xr : e, arguments.length ? e(arguments[0], arguments[1]) : e
                                }

                                function so(e, t) {
                                    var n, r, i = e.__data__;
                                    return ("string" == (r = typeof(n = t)) || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== n : null === n) ? i["string" == typeof t ? "string" : "hash"] : i.map
                                }

                                function ao(e) {
                                    for (var t = Da(e), n = t.length; n--;) {
                                        var r = t[n],
                                            i = e[r];
                                        t[n] = [r, i, ko(i)]
                                    }
                                    return t
                                }

                                function uo(e, t) {
                                    var n = function(e, t) {
                                        return null == e ? i : e[t]
                                    }(e, t);
                                    return Or(n) ? n : i
                                }
                                var lo = pt ? function(e) {
                                        return null == e ? [] : (e = Ee(e), Tt(pt(e), function(t) {
                                            return Ve.call(e, t)
                                        }))
                                    } : gu,
                                    co = pt ? function(e) {
                                        for (var t = []; e;) Ot(t, lo(e)), e = We(e);
                                        return t
                                    } : gu,
                                    ho = Ir;

                                function fo(e, t, n) {
                                    for (var r = -1, i = (t = vi(t, e)).length, o = !1; ++r < i;) {
                                        var s = Co(t[r]);
                                        if (!(o = null != e && n(e, s))) break;
                                        e = e[s]
                                    }
                                    return o || ++r != i ? o : !!(i = null == e ? 0 : e.length) && Ys(i) && vo(s, i) && (Fs(e) || qs(e))
                                }

                                function go(e) {
                                    return "function" != typeof e.constructor || bo(e) ? {} : Nn(We(e))
                                }

                                function po(e) {
                                    return Fs(e) || qs(e) || !!(He && e && e[He])
                                }

                                function vo(e, t) {
                                    var n = typeof e;
                                    return !!(t = null == t ? h : t) && ("number" == n || "symbol" != n && ye.test(e)) && e > -1 && e % 1 == 0 && e < t
                                }

                                function yo(e, t, n) {
                                    if (!Ks(n)) return !1;
                                    var r = typeof t;
                                    return !!("number" == r ? $s(n) && vo(t, n.length) : "string" == r && t in n) && Ns(n[t], e)
                                }

                                function _o(e, t) {
                                    if (Fs(e)) return !1;
                                    var n = typeof e;
                                    return !("number" != n && "symbol" != n && "boolean" != n && null != e && !aa(e)) || K.test(e) || !Y.test(e) || null != t && e in Ee(t)
                                }

                                function mo(e) {
                                    var t = ro(e),
                                        n = jn[t];
                                    if ("function" != typeof n || !(t in qn.prototype)) return !1;
                                    if (e === n) return !0;
                                    var r = no(n);
                                    return !!r && e === r[0]
                                }(kn && ho(new kn(new ArrayBuffer(1))) != O || In && ho(new In) != k || En && ho(En.resolve()) != S || Sn && ho(new Sn) != M || An && ho(new An) != D) && (ho = function(e) {
                                    var t = Ir(e),
                                        n = t == E ? e.constructor : i,
                                        r = n ? Uo(n) : "";
                                    if (r) switch (r) {
                                        case Dn:
                                            return O;
                                        case Pn:
                                            return k;
                                        case On:
                                            return S;
                                        case xn:
                                            return M;
                                        case Ln:
                                            return D
                                    }
                                    return t
                                });
                                var wo = Pe ? Xs : pu;

                                function bo(e) {
                                    var t = e && e.constructor;
                                    return e === ("function" == typeof t && t.prototype || De)
                                }

                                function ko(e) {
                                    return e == e && !Ks(e)
                                }

                                function Io(e, t) {
                                    return function(n) {
                                        return null != n && n[e] === t && (t !== i || e in Ee(n))
                                    }
                                }

                                function Eo(e, t, n) {
                                    return t = vn(t === i ? e.length - 1 : t, 0),
                                        function() {
                                            for (var i = arguments, o = -1, s = vn(i.length - t, 0), a = r(s); ++o < s;) a[o] = i[t + o];
                                            o = -1;
                                            for (var u = r(t + 1); ++o < t;) u[o] = i[o];
                                            return u[t] = n(a), It(e, this, u)
                                        }
                                }

                                function So(e, t) {
                                    return t.length < 2 ? e : br(e, ei(t, 0, -1))
                                }

                                function Ao(e, t) {
                                    if (("constructor" !== t || "function" != typeof e[t]) && "__proto__" != t) return e[t]
                                }
                                var Mo = Po(Zr),
                                    To = ct || function(e, t) {
                                        return ht.setTimeout(e, t)
                                    },
                                    Ro = Po(Yr);

                                function Do(e, t, n) {
                                    var r = t + "";
                                    return Ro(e, function(e, t) {
                                        var n = t.length;
                                        if (!n) return e;
                                        var r = n - 1;
                                        return t[r] = (n > 1 ? "& " : "") + t[r], t = t.join(n > 2 ? ", " : " "), e.replace(oe, "{\n/* [wrapped with " + t + "] */\n")
                                    }(r, function(e, t) {
                                        return St(g, function(n) {
                                            var r = "_." + n[0];
                                            t & n[1] && !Rt(e, r) && e.push(r)
                                        }), e.sort()
                                    }(function(e) {
                                        var t = e.match(se);
                                        return t ? t[1].split(ae) : []
                                    }(r), n)))
                                }

                                function Po(e) {
                                    var t = 0,
                                        n = 0;
                                    return function() {
                                        var r = _n(),
                                            o = 16 - (r - n);
                                        if (n = r, o > 0) {
                                            if (++t >= 800) return arguments[0]
                                        } else t = 0;
                                        return e.apply(i, arguments)
                                    }
                                }

                                function Oo(e, t) {
                                    var n = -1,
                                        r = e.length,
                                        o = r - 1;
                                    for (t = t === i ? r : t; ++n < t;) {
                                        var s = $r(n, o),
                                            a = e[s];
                                        e[s] = e[n], e[n] = a
                                    }
                                    return e.length = t, e
                                }
                                var xo, Lo, Bo = (xo = xs(function(e) {
                                    var t = [];
                                    return 46 === e.charCodeAt(0) && t.push(""), e.replace(ee, function(e, n, r, i) {
                                        t.push(r ? i.replace(ce, "$1") : n || e)
                                    }), t
                                }, function(e) {
                                    return 500 === Lo.size && Lo.clear(), e
                                }), Lo = xo.cache, xo);

                                function Co(e) {
                                    if ("string" == typeof e || aa(e)) return e;
                                    var t = e + "";
                                    return "0" == t && 1 / e == -1 / 0 ? "-0" : t
                                }

                                function Uo(e) {
                                    if (null != e) {
                                        try {
                                            return Oe.call(e)
                                        } catch (e) {}
                                        try {
                                            return e + ""
                                        } catch (e) {}
                                    }
                                    return ""
                                }

                                function jo(e) {
                                    if (e instanceof qn) return e.clone();
                                    var t = new zn(e.__wrapped__, e.__chain__);
                                    return t.__actions__ = Ai(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t
                                }
                                var No = Jr(function(e, t) {
                                        return Vs(e) ? lr(e, pr(t, 1, Vs, !0)) : []
                                    }),
                                    Go = Jr(function(e, t) {
                                        var n = Qo(t);
                                        return Vs(n) && (n = i), Vs(e) ? lr(e, pr(t, 1, Vs, !0), oo(n, 2)) : []
                                    }),
                                    zo = Jr(function(e, t) {
                                        var n = Qo(t);
                                        return Vs(n) && (n = i), Vs(e) ? lr(e, pr(t, 1, Vs, !0), i, n) : []
                                    });

                                function qo(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    if (!r) return -1;
                                    var i = null == n ? 0 : fa(n);
                                    return i < 0 && (i = vn(r + i, 0)), jt(e, oo(t, 3), i)
                                }

                                function Fo(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    if (!r) return -1;
                                    var o = r - 1;
                                    return n !== i && (o = fa(n), o = n < 0 ? vn(r + o, 0) : yn(o, r - 1)), jt(e, oo(t, 3), o, !0)
                                }

                                function Wo(e) {
                                    return null != e && e.length ? pr(e, 1) : []
                                }

                                function $o(e) {
                                    return e && e.length ? e[0] : i
                                }
                                var Vo = Jr(function(e) {
                                        var t = Pt(e, gi);
                                        return t.length && t[0] === e[0] ? Mr(t) : []
                                    }),
                                    Jo = Jr(function(e) {
                                        var t = Qo(e),
                                            n = Pt(e, gi);
                                        return t === Qo(n) ? t = i : n.pop(), n.length && n[0] === e[0] ? Mr(n, oo(t, 2)) : []
                                    }),
                                    Ho = Jr(function(e) {
                                        var t = Qo(e),
                                            n = Pt(e, gi);
                                        return (t = "function" == typeof t ? t : i) && n.pop(), n.length && n[0] === e[0] ? Mr(n, i, t) : []
                                    });

                                function Qo(e) {
                                    var t = null == e ? 0 : e.length;
                                    return t ? e[t - 1] : i
                                }
                                var Xo = Jr(Zo);

                                function Zo(e, t) {
                                    return e && e.length && t && t.length ? Fr(e, t) : e
                                }
                                var Yo = Ki(function(e, t) {
                                    var n = null == e ? 0 : e.length,
                                        r = ir(e, t);
                                    return Wr(e, Pt(t, function(e) {
                                        return vo(e, n) ? +e : e
                                    }).sort(Ii)), r
                                });

                                function Ko(e) {
                                    return null == e ? e : bn.call(e)
                                }
                                var es = Jr(function(e) {
                                        return ai(pr(e, 1, Vs, !0))
                                    }),
                                    ts = Jr(function(e) {
                                        var t = Qo(e);
                                        return Vs(t) && (t = i), ai(pr(e, 1, Vs, !0), oo(t, 2))
                                    }),
                                    ns = Jr(function(e) {
                                        var t = Qo(e);
                                        return t = "function" == typeof t ? t : i, ai(pr(e, 1, Vs, !0), i, t)
                                    });

                                function rs(e) {
                                    if (!e || !e.length) return [];
                                    var t = 0;
                                    return e = Tt(e, function(e) {
                                        if (Vs(e)) return t = vn(e.length, t), !0
                                    }), Jt(t, function(t) {
                                        return Pt(e, Ft(t))
                                    })
                                }

                                function is(e, t) {
                                    if (!e || !e.length) return [];
                                    var n = rs(e);
                                    return null == t ? n : Pt(n, function(e) {
                                        return It(t, i, e)
                                    })
                                }
                                var os = Jr(function(e, t) {
                                        return Vs(e) ? lr(e, t) : []
                                    }),
                                    ss = Jr(function(e) {
                                        return di(Tt(e, Vs))
                                    }),
                                    as = Jr(function(e) {
                                        var t = Qo(e);
                                        return Vs(t) && (t = i), di(Tt(e, Vs), oo(t, 2))
                                    }),
                                    us = Jr(function(e) {
                                        var t = Qo(e);
                                        return t = "function" == typeof t ? t : i, di(Tt(e, Vs), i, t)
                                    }),
                                    ls = Jr(rs),
                                    cs = Jr(function(e) {
                                        var t = e.length,
                                            n = t > 1 ? e[t - 1] : i;
                                        return n = "function" == typeof n ? (e.pop(), n) : i, is(e, n)
                                    });

                                function hs(e) {
                                    var t = jn(e);
                                    return t.__chain__ = !0, t
                                }

                                function ds(e, t) {
                                    return t(e)
                                }
                                var fs = Ki(function(e) {
                                        var t = e.length,
                                            n = t ? e[0] : 0,
                                            r = this.__wrapped__,
                                            o = function(t) {
                                                return ir(t, e)
                                            };
                                        return !(t > 1 || this.__actions__.length) && r instanceof qn && vo(n) ? ((r = r.slice(n, +n + (t ? 1 : 0))).__actions__.push({
                                            func: ds,
                                            args: [o],
                                            thisArg: i
                                        }), new zn(r, this.__chain__).thru(function(e) {
                                            return t && !e.length && e.push(i), e
                                        })) : this.thru(o)
                                    }),
                                    gs = Ti(function(e, t, n) {
                                        xe.call(e, n) ? ++e[n] : rr(e, n, 1)
                                    }),
                                    ps = Bi(qo),
                                    vs = Bi(Fo);

                                function ys(e, t) {
                                    return (Fs(e) ? St : cr)(e, oo(t, 3))
                                }

                                function _s(e, t) {
                                    return (Fs(e) ? At : hr)(e, oo(t, 3))
                                }
                                var ms = Ti(function(e, t, n) {
                                        xe.call(e, n) ? e[n].push(t) : rr(e, n, [t])
                                    }),
                                    ws = Jr(function(e, t, n) {
                                        var i = -1,
                                            o = "function" == typeof t,
                                            s = $s(e) ? r(e.length) : [];
                                        return cr(e, function(e) {
                                            s[++i] = o ? It(t, e, n) : Tr(e, t, n)
                                        }), s
                                    }),
                                    bs = Ti(function(e, t, n) {
                                        rr(e, n, t)
                                    });

                                function ks(e, t) {
                                    return (Fs(e) ? Pt : Cr)(e, oo(t, 3))
                                }
                                var Is = Ti(function(e, t, n) {
                                        e[n ? 0 : 1].push(t)
                                    }, function() {
                                        return [
                                            [],
                                            []
                                        ]
                                    }),
                                    Es = Jr(function(e, t) {
                                        if (null == e) return [];
                                        var n = t.length;
                                        return n > 1 && yo(e, t[0], t[1]) ? t = [] : n > 2 && yo(t[0], t[1], t[2]) && (t = [t[0]]), zr(e, pr(t, 1), [])
                                    }),
                                    Ss = lt || function() {
                                        return ht.Date.now()
                                    };

                                function As(e, t, n) {
                                    return t = n ? i : t, t = e && null == t ? e.length : t, Hi(e, l, i, i, i, i, t)
                                }

                                function Ms(e, t) {
                                    var n;
                                    if ("function" != typeof t) throw new Me(o);
                                    return e = fa(e),
                                        function() {
                                            return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = i), n
                                        }
                                }
                                var Ts = Jr(function(e, t, n) {
                                        var r = 1;
                                        if (n.length) {
                                            var i = an(n, io(Ts));
                                            r |= u
                                        }
                                        return Hi(e, r, t, n, i)
                                    }),
                                    Rs = Jr(function(e, t, n) {
                                        var r = 3;
                                        if (n.length) {
                                            var i = an(n, io(Rs));
                                            r |= u
                                        }
                                        return Hi(t, r, e, n, i)
                                    });

                                function Ds(e, t, n) {
                                    var r, s, a, u, l, c, h = 0,
                                        d = !1,
                                        f = !1,
                                        g = !0;
                                    if ("function" != typeof e) throw new Me(o);

                                    function p(t) {
                                        var n = r,
                                            o = s;
                                        return r = s = i, h = t, u = e.apply(o, n)
                                    }

                                    function v(e) {
                                        var n = e - c;
                                        return c === i || n >= t || n < 0 || f && e - h >= a
                                    }

                                    function y() {
                                        var e = Ss();
                                        if (v(e)) return _(e);
                                        l = To(y, function(e) {
                                            var n = t - (e - c);
                                            return f ? yn(n, a - (e - h)) : n
                                        }(e))
                                    }

                                    function _(e) {
                                        return l = i, g && r ? p(e) : (r = s = i, u)
                                    }

                                    function m() {
                                        var e = Ss(),
                                            n = v(e);
                                        if (r = arguments, s = this, c = e, n) {
                                            if (l === i) return function(e) {
                                                return h = e, l = To(y, t), d ? p(e) : u
                                            }(c);
                                            if (f) return mi(l), l = To(y, t), p(c)
                                        }
                                        return l === i && (l = To(y, t)), u
                                    }
                                    return t = pa(t) || 0, Ks(n) && (d = !!n.leading, a = (f = "maxWait" in n) ? vn(pa(n.maxWait) || 0, t) : a, g = "trailing" in n ? !!n.trailing : g), m.cancel = function() {
                                        l !== i && mi(l), h = 0, r = c = s = l = i
                                    }, m.flush = function() {
                                        return l === i ? u : _(Ss())
                                    }, m
                                }
                                var Ps = Jr(function(e, t) {
                                        return ur(e, 1, t)
                                    }),
                                    Os = Jr(function(e, t, n) {
                                        return ur(e, pa(t) || 0, n)
                                    });

                                function xs(e, t) {
                                    if ("function" != typeof e || null != t && "function" != typeof t) throw new Me(o);
                                    var n = function() {
                                        var r = arguments,
                                            i = t ? t.apply(this, r) : r[0],
                                            o = n.cache;
                                        if (o.has(i)) return o.get(i);
                                        var s = e.apply(this, r);
                                        return n.cache = o.set(i, s) || o, s
                                    };
                                    return n.cache = new(xs.Cache || $n), n
                                }

                                function Ls(e) {
                                    if ("function" != typeof e) throw new Me(o);
                                    return function() {
                                        var t = arguments;
                                        switch (t.length) {
                                            case 0:
                                                return !e.call(this);
                                            case 1:
                                                return !e.call(this, t[0]);
                                            case 2:
                                                return !e.call(this, t[0], t[1]);
                                            case 3:
                                                return !e.call(this, t[0], t[1], t[2])
                                        }
                                        return !e.apply(this, t)
                                    }
                                }
                                xs.Cache = $n;
                                var Bs = yi(function(e, t) {
                                        var n = (t = 1 == t.length && Fs(t[0]) ? Pt(t[0], Qt(oo())) : Pt(pr(t, 1), Qt(oo()))).length;
                                        return Jr(function(r) {
                                            for (var i = -1, o = yn(r.length, n); ++i < o;) r[i] = t[i].call(this, r[i]);
                                            return It(e, this, r)
                                        })
                                    }),
                                    Cs = Jr(function(e, t) {
                                        var n = an(t, io(Cs));
                                        return Hi(e, u, i, t, n)
                                    }),
                                    Us = Jr(function(e, t) {
                                        var n = an(t, io(Us));
                                        return Hi(e, 64, i, t, n)
                                    }),
                                    js = Ki(function(e, t) {
                                        return Hi(e, 256, i, i, i, t)
                                    });

                                function Ns(e, t) {
                                    return e === t || e != e && t != t
                                }
                                var Gs = Fi(Er),
                                    zs = Fi(function(e, t) {
                                        return e >= t
                                    }),
                                    qs = Rr(function() {
                                        return arguments
                                    }()) ? Rr : function(e) {
                                        return ea(e) && xe.call(e, "callee") && !Ve.call(e, "callee")
                                    },
                                    Fs = r.isArray,
                                    Ws = yt ? Qt(yt) : function(e) {
                                        return ea(e) && Ir(e) == P
                                    };

                                function $s(e) {
                                    return null != e && Ys(e.length) && !Xs(e)
                                }

                                function Vs(e) {
                                    return ea(e) && $s(e)
                                }
                                var Js = vt || pu,
                                    Hs = _t ? Qt(_t) : function(e) {
                                        return ea(e) && Ir(e) == _
                                    };

                                function Qs(e) {
                                    if (!ea(e)) return !1;
                                    var t = Ir(e);
                                    return t == m || "[object DOMException]" == t || "string" == typeof e.message && "string" == typeof e.name && !ra(e)
                                }

                                function Xs(e) {
                                    if (!Ks(e)) return !1;
                                    var t = Ir(e);
                                    return t == w || t == b || "[object AsyncFunction]" == t || "[object Proxy]" == t
                                }

                                function Zs(e) {
                                    return "number" == typeof e && e == fa(e)
                                }

                                function Ys(e) {
                                    return "number" == typeof e && e > -1 && e % 1 == 0 && e <= h
                                }

                                function Ks(e) {
                                    var t = typeof e;
                                    return null != e && ("object" == t || "function" == t)
                                }

                                function ea(e) {
                                    return null != e && "object" == typeof e
                                }
                                var ta = mt ? Qt(mt) : function(e) {
                                    return ea(e) && ho(e) == k
                                };

                                function na(e) {
                                    return "number" == typeof e || ea(e) && Ir(e) == I
                                }

                                function ra(e) {
                                    if (!ea(e) || Ir(e) != E) return !1;
                                    var t = We(e);
                                    if (null === t) return !0;
                                    var n = xe.call(t, "constructor") && t.constructor;
                                    return "function" == typeof n && n instanceof n && Oe.call(n) == Ue
                                }
                                var ia = wt ? Qt(wt) : function(e) {
                                        return ea(e) && Ir(e) == A
                                    },
                                    oa = bt ? Qt(bt) : function(e) {
                                        return ea(e) && ho(e) == M
                                    };

                                function sa(e) {
                                    return "string" == typeof e || !Fs(e) && ea(e) && Ir(e) == T
                                }

                                function aa(e) {
                                    return "symbol" == typeof e || ea(e) && Ir(e) == R
                                }
                                var ua = kt ? Qt(kt) : function(e) {
                                        return ea(e) && Ys(e.length) && !!it[Ir(e)]
                                    },
                                    la = Fi(Br),
                                    ca = Fi(function(e, t) {
                                        return e <= t
                                    });

                                function ha(e) {
                                    if (!e) return [];
                                    if ($s(e)) return sa(e) ? hn(e) : Ai(e);
                                    if (Qe && e[Qe]) return function(e) {
                                        for (var t, n = []; !(t = e.next()).done;) n.push(t.value);
                                        return n
                                    }(e[Qe]());
                                    var t = ho(e);
                                    return (t == k ? on : t == M ? un : Na)(e)
                                }

                                function da(e) {
                                    return e ? (e = pa(e)) === c || e === -1 / 0 ? 17976931348623157e292 * (e < 0 ? -1 : 1) : e == e ? e : 0 : 0 === e ? e : 0
                                }

                                function fa(e) {
                                    var t = da(e),
                                        n = t % 1;
                                    return t == t ? n ? t - n : t : 0
                                }

                                function ga(e) {
                                    return e ? or(fa(e), 0, f) : 0
                                }

                                function pa(e) {
                                    if ("number" == typeof e) return e;
                                    if (aa(e)) return d;
                                    if (Ks(e)) {
                                        var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                                        e = Ks(t) ? t + "" : t
                                    }
                                    if ("string" != typeof e) return 0 === e ? e : +e;
                                    e = Ht(e);
                                    var n = ge.test(e);
                                    return n || ve.test(e) ? ut(e.slice(2), n ? 2 : 8) : fe.test(e) ? d : +e
                                }

                                function va(e) {
                                    return Mi(e, Pa(e))
                                }

                                function ya(e) {
                                    return null == e ? "" : si(e)
                                }
                                var _a = Ri(function(e, t) {
                                        if (bo(t) || $s(t)) Mi(t, Da(t), e);
                                        else
                                            for (var n in t) xe.call(t, n) && Kn(e, n, t[n])
                                    }),
                                    ma = Ri(function(e, t) {
                                        Mi(t, Pa(t), e)
                                    }),
                                    wa = Ri(function(e, t, n, r) {
                                        Mi(t, Pa(t), e, r)
                                    }),
                                    ba = Ri(function(e, t, n, r) {
                                        Mi(t, Da(t), e, r)
                                    }),
                                    ka = Ki(ir),
                                    Ia = Jr(function(e, t) {
                                        e = Ee(e);
                                        var n = -1,
                                            r = t.length,
                                            o = r > 2 ? t[2] : i;
                                        for (o && yo(t[0], t[1], o) && (r = 1); ++n < r;)
                                            for (var s = t[n], a = Pa(s), u = -1, l = a.length; ++u < l;) {
                                                var c = a[u],
                                                    h = e[c];
                                                (h === i || Ns(h, De[c]) && !xe.call(e, c)) && (e[c] = s[c])
                                            }
                                        return e
                                    }),
                                    Ea = Jr(function(e) {
                                        return e.push(i, Xi), It(xa, i, e)
                                    });

                                function Sa(e, t, n) {
                                    var r = null == e ? i : br(e, t);
                                    return r === i ? n : r
                                }

                                function Aa(e, t) {
                                    return null != e && fo(e, t, Ar)
                                }
                                var Ma = ji(function(e, t, n) {
                                        null != t && "function" != typeof t.toString && (t = Ce.call(t)), e[t] = n
                                    }, Ka(nu)),
                                    Ta = ji(function(e, t, n) {
                                        null != t && "function" != typeof t.toString && (t = Ce.call(t)), xe.call(e, t) ? e[t].push(n) : e[t] = [n]
                                    }, oo),
                                    Ra = Jr(Tr);

                                function Da(e) {
                                    return $s(e) ? Hn(e) : Lr(e)
                                }

                                function Pa(e) {
                                    return $s(e) ? Hn(e, !0) : function(e) {
                                        if (!Ks(e)) return function(e) {
                                            var t = [];
                                            if (null != e)
                                                for (var n in Ee(e)) t.push(n);
                                            return t
                                        }(e);
                                        var t = bo(e),
                                            n = [];
                                        for (var r in e)("constructor" != r || !t && xe.call(e, r)) && n.push(r);
                                        return n
                                    }(e)
                                }
                                var Oa = Ri(function(e, t, n) {
                                        Nr(e, t, n)
                                    }),
                                    xa = Ri(function(e, t, n, r) {
                                        Nr(e, t, n, r)
                                    }),
                                    La = Ki(function(e, t) {
                                        var n = {};
                                        if (null == e) return n;
                                        var r = !1;
                                        t = Pt(t, function(t) {
                                            return t = vi(t, e), r || (r = t.length > 1), t
                                        }), Mi(e, to(e), n), r && (n = sr(n, 7, Zi));
                                        for (var i = t.length; i--;) ui(n, t[i]);
                                        return n
                                    }),
                                    Ba = Ki(function(e, t) {
                                        return null == e ? {} : function(e, t) {
                                            return qr(e, t, function(t, n) {
                                                return Aa(e, n)
                                            })
                                        }(e, t)
                                    });

                                function Ca(e, t) {
                                    if (null == e) return {};
                                    var n = Pt(to(e), function(e) {
                                        return [e]
                                    });
                                    return t = oo(t), qr(e, n, function(e, n) {
                                        return t(e, n[0])
                                    })
                                }
                                var Ua = Ji(Da),
                                    ja = Ji(Pa);

                                function Na(e) {
                                    return null == e ? [] : Xt(e, Da(e))
                                }
                                var Ga = xi(function(e, t, n) {
                                    return t = t.toLowerCase(), e + (n ? za(t) : t)
                                });

                                function za(e) {
                                    return Qa(ya(e).toLowerCase())
                                }

                                function qa(e) {
                                    return (e = ya(e)) && e.replace(_e, en).replace(Ze, "")
                                }
                                var Fa = xi(function(e, t, n) {
                                        return e + (n ? "-" : "") + t.toLowerCase()
                                    }),
                                    Wa = xi(function(e, t, n) {
                                        return e + (n ? " " : "") + t.toLowerCase()
                                    }),
                                    $a = Oi("toLowerCase"),
                                    Va = xi(function(e, t, n) {
                                        return e + (n ? "_" : "") + t.toLowerCase()
                                    }),
                                    Ja = xi(function(e, t, n) {
                                        return e + (n ? " " : "") + Qa(t)
                                    }),
                                    Ha = xi(function(e, t, n) {
                                        return e + (n ? " " : "") + t.toUpperCase()
                                    }),
                                    Qa = Oi("toUpperCase");

                                function Xa(e, t, n) {
                                    return e = ya(e), (t = n ? i : t) === i ? function(e) {
                                        return tt.test(e)
                                    }(e) ? function(e) {
                                        return e.match(Ke) || []
                                    }(e) : function(e) {
                                        return e.match(ue) || []
                                    }(e) : e.match(t) || []
                                }
                                var Za = Jr(function(e, t) {
                                        try {
                                            return It(e, i, t)
                                        } catch (e) {
                                            return Qs(e) ? e : new be(e)
                                        }
                                    }),
                                    Ya = Ki(function(e, t) {
                                        return St(t, function(t) {
                                            t = Co(t), rr(e, t, Ts(e[t], e))
                                        }), e
                                    });

                                function Ka(e) {
                                    return function() {
                                        return e
                                    }
                                }
                                var eu = Ci(),
                                    tu = Ci(!0);

                                function nu(e) {
                                    return e
                                }

                                function ru(e) {
                                    return xr("function" == typeof e ? e : sr(e, 1))
                                }
                                var iu = Jr(function(e, t) {
                                        return function(n) {
                                            return Tr(n, e, t)
                                        }
                                    }),
                                    ou = Jr(function(e, t) {
                                        return function(n) {
                                            return Tr(e, n, t)
                                        }
                                    });

                                function su(e, t, n) {
                                    var r = Da(t),
                                        i = wr(t, r);
                                    null != n || Ks(t) && (i.length || !r.length) || (n = t, t = e, e = this, i = wr(t, Da(t)));
                                    var o = !(Ks(n) && "chain" in n && !n.chain),
                                        s = Xs(e);
                                    return St(i, function(n) {
                                        var r = t[n];
                                        e[n] = r, s && (e.prototype[n] = function() {
                                            var t = this.__chain__;
                                            if (o || t) {
                                                var n = e(this.__wrapped__);
                                                return (n.__actions__ = Ai(this.__actions__)).push({
                                                    func: r,
                                                    args: arguments,
                                                    thisArg: e
                                                }), n.__chain__ = t, n
                                            }
                                            return r.apply(e, Ot([this.value()], arguments))
                                        })
                                    }), e
                                }

                                function au() {}
                                var uu = Gi(Pt),
                                    lu = Gi(Mt),
                                    cu = Gi(Bt);

                                function hu(e) {
                                    return _o(e) ? Ft(Co(e)) : function(e) {
                                        return function(t) {
                                            return br(t, e)
                                        }
                                    }(e)
                                }
                                var du = qi(),
                                    fu = qi(!0);

                                function gu() {
                                    return []
                                }

                                function pu() {
                                    return !1
                                }
                                var vu, yu = Ni(function(e, t) {
                                        return e + t
                                    }, 0),
                                    _u = $i("ceil"),
                                    mu = Ni(function(e, t) {
                                        return e / t
                                    }, 1),
                                    wu = $i("floor"),
                                    bu = Ni(function(e, t) {
                                        return e * t
                                    }, 1),
                                    ku = $i("round"),
                                    Iu = Ni(function(e, t) {
                                        return e - t
                                    }, 0);
                                return jn.after = function(e, t) {
                                    if ("function" != typeof t) throw new Me(o);
                                    return e = fa(e),
                                        function() {
                                            if (--e < 1) return t.apply(this, arguments)
                                        }
                                }, jn.ary = As, jn.assign = _a, jn.assignIn = ma, jn.assignInWith = wa, jn.assignWith = ba, jn.at = ka, jn.before = Ms, jn.bind = Ts, jn.bindAll = Ya, jn.bindKey = Rs, jn.castArray = function() {
                                    if (!arguments.length) return [];
                                    var e = arguments[0];
                                    return Fs(e) ? e : [e]
                                }, jn.chain = hs, jn.chunk = function(e, t, n) {
                                    t = (n ? yo(e, t, n) : t === i) ? 1 : vn(fa(t), 0);
                                    var o = null == e ? 0 : e.length;
                                    if (!o || t < 1) return [];
                                    for (var s = 0, a = 0, u = r(dt(o / t)); s < o;) u[a++] = ei(e, s, s += t);
                                    return u
                                }, jn.compact = function(e) {
                                    for (var t = -1, n = null == e ? 0 : e.length, r = 0, i = []; ++t < n;) {
                                        var o = e[t];
                                        o && (i[r++] = o)
                                    }
                                    return i
                                }, jn.concat = function() {
                                    var e = arguments.length;
                                    if (!e) return [];
                                    for (var t = r(e - 1), n = arguments[0], i = e; i--;) t[i - 1] = arguments[i];
                                    return Ot(Fs(n) ? Ai(n) : [n], pr(t, 1))
                                }, jn.cond = function(e) {
                                    var t = null == e ? 0 : e.length,
                                        n = oo();
                                    return e = t ? Pt(e, function(e) {
                                        if ("function" != typeof e[1]) throw new Me(o);
                                        return [n(e[0]), e[1]]
                                    }) : [], Jr(function(n) {
                                        for (var r = -1; ++r < t;) {
                                            var i = e[r];
                                            if (It(i[0], this, n)) return It(i[1], this, n)
                                        }
                                    })
                                }, jn.conforms = function(e) {
                                    return function(e) {
                                        var t = Da(e);
                                        return function(n) {
                                            return ar(n, e, t)
                                        }
                                    }(sr(e, 1))
                                }, jn.constant = Ka, jn.countBy = gs, jn.create = function(e, t) {
                                    var n = Nn(e);
                                    return null == t ? n : nr(n, t)
                                }, jn.curry = function e(t, n, r) {
                                    var o = Hi(t, 8, i, i, i, i, i, n = r ? i : n);
                                    return o.placeholder = e.placeholder, o
                                }, jn.curryRight = function e(t, n, r) {
                                    var o = Hi(t, 16, i, i, i, i, i, n = r ? i : n);
                                    return o.placeholder = e.placeholder, o
                                }, jn.debounce = Ds, jn.defaults = Ia, jn.defaultsDeep = Ea, jn.defer = Ps, jn.delay = Os, jn.difference = No, jn.differenceBy = Go, jn.differenceWith = zo, jn.drop = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    return r ? ei(e, (t = n || t === i ? 1 : fa(t)) < 0 ? 0 : t, r) : []
                                }, jn.dropRight = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    return r ? ei(e, 0, (t = r - (t = n || t === i ? 1 : fa(t))) < 0 ? 0 : t) : []
                                }, jn.dropRightWhile = function(e, t) {
                                    return e && e.length ? ci(e, oo(t, 3), !0, !0) : []
                                }, jn.dropWhile = function(e, t) {
                                    return e && e.length ? ci(e, oo(t, 3), !0) : []
                                }, jn.fill = function(e, t, n, r) {
                                    var o = null == e ? 0 : e.length;
                                    return o ? (n && "number" != typeof n && yo(e, t, n) && (n = 0, r = o), function(e, t, n, r) {
                                        var o = e.length;
                                        for ((n = fa(n)) < 0 && (n = -n > o ? 0 : o + n), (r = r === i || r > o ? o : fa(r)) < 0 && (r += o), r = n > r ? 0 : ga(r); n < r;) e[n++] = t;
                                        return e
                                    }(e, t, n, r)) : []
                                }, jn.filter = function(e, t) {
                                    return (Fs(e) ? Tt : gr)(e, oo(t, 3))
                                }, jn.flatMap = function(e, t) {
                                    return pr(ks(e, t), 1)
                                }, jn.flatMapDeep = function(e, t) {
                                    return pr(ks(e, t), c)
                                }, jn.flatMapDepth = function(e, t, n) {
                                    return n = n === i ? 1 : fa(n), pr(ks(e, t), n)
                                }, jn.flatten = Wo, jn.flattenDeep = function(e) {
                                    return null != e && e.length ? pr(e, c) : []
                                }, jn.flattenDepth = function(e, t) {
                                    return null != e && e.length ? pr(e, t = t === i ? 1 : fa(t)) : []
                                }, jn.flip = function(e) {
                                    return Hi(e, 512)
                                }, jn.flow = eu, jn.flowRight = tu, jn.fromPairs = function(e) {
                                    for (var t = -1, n = null == e ? 0 : e.length, r = {}; ++t < n;) {
                                        var i = e[t];
                                        r[i[0]] = i[1]
                                    }
                                    return r
                                }, jn.functions = function(e) {
                                    return null == e ? [] : wr(e, Da(e))
                                }, jn.functionsIn = function(e) {
                                    return null == e ? [] : wr(e, Pa(e))
                                }, jn.groupBy = ms, jn.initial = function(e) {
                                    return null != e && e.length ? ei(e, 0, -1) : []
                                }, jn.intersection = Vo, jn.intersectionBy = Jo, jn.intersectionWith = Ho, jn.invert = Ma, jn.invertBy = Ta, jn.invokeMap = ws, jn.iteratee = ru, jn.keyBy = bs, jn.keys = Da, jn.keysIn = Pa, jn.map = ks, jn.mapKeys = function(e, t) {
                                    var n = {};
                                    return t = oo(t, 3), _r(e, function(e, r, i) {
                                        rr(n, t(e, r, i), e)
                                    }), n
                                }, jn.mapValues = function(e, t) {
                                    var n = {};
                                    return t = oo(t, 3), _r(e, function(e, r, i) {
                                        rr(n, r, t(e, r, i))
                                    }), n
                                }, jn.matches = function(e) {
                                    return Ur(sr(e, 1))
                                }, jn.matchesProperty = function(e, t) {
                                    return jr(e, sr(t, 1))
                                }, jn.memoize = xs, jn.merge = Oa, jn.mergeWith = xa, jn.method = iu, jn.methodOf = ou, jn.mixin = su, jn.negate = Ls, jn.nthArg = function(e) {
                                    return e = fa(e), Jr(function(t) {
                                        return Gr(t, e)
                                    })
                                }, jn.omit = La, jn.omitBy = function(e, t) {
                                    return Ca(e, Ls(oo(t)))
                                }, jn.once = function(e) {
                                    return Ms(2, e)
                                }, jn.orderBy = function(e, t, n, r) {
                                    return null == e ? [] : (Fs(t) || (t = null == t ? [] : [t]), Fs(n = r ? i : n) || (n = null == n ? [] : [n]), zr(e, t, n))
                                }, jn.over = uu, jn.overArgs = Bs, jn.overEvery = lu, jn.overSome = cu, jn.partial = Cs, jn.partialRight = Us, jn.partition = Is, jn.pick = Ba, jn.pickBy = Ca, jn.property = hu, jn.propertyOf = function(e) {
                                    return function(t) {
                                        return null == e ? i : br(e, t)
                                    }
                                }, jn.pull = Xo, jn.pullAll = Zo, jn.pullAllBy = function(e, t, n) {
                                    return e && e.length && t && t.length ? Fr(e, t, oo(n, 2)) : e
                                }, jn.pullAllWith = function(e, t, n) {
                                    return e && e.length && t && t.length ? Fr(e, t, i, n) : e
                                }, jn.pullAt = Yo, jn.range = du, jn.rangeRight = fu, jn.rearg = js, jn.reject = function(e, t) {
                                    return (Fs(e) ? Tt : gr)(e, Ls(oo(t, 3)))
                                }, jn.remove = function(e, t) {
                                    var n = [];
                                    if (!e || !e.length) return n;
                                    var r = -1,
                                        i = [],
                                        o = e.length;
                                    for (t = oo(t, 3); ++r < o;) {
                                        var s = e[r];
                                        t(s, r, e) && (n.push(s), i.push(r))
                                    }
                                    return Wr(e, i), n
                                }, jn.rest = function(e, t) {
                                    if ("function" != typeof e) throw new Me(o);
                                    return Jr(e, t = t === i ? t : fa(t))
                                }, jn.reverse = Ko, jn.sampleSize = function(e, t, n) {
                                    return t = (n ? yo(e, t, n) : t === i) ? 1 : fa(t), (Fs(e) ? Xn : Qr)(e, t)
                                }, jn.set = function(e, t, n) {
                                    return null == e ? e : Xr(e, t, n)
                                }, jn.setWith = function(e, t, n, r) {
                                    return r = "function" == typeof r ? r : i, null == e ? e : Xr(e, t, n, r)
                                }, jn.shuffle = function(e) {
                                    return (Fs(e) ? Zn : Kr)(e)
                                }, jn.slice = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    return r ? (n && "number" != typeof n && yo(e, t, n) ? (t = 0, n = r) : (t = null == t ? 0 : fa(t), n = n === i ? r : fa(n)), ei(e, t, n)) : []
                                }, jn.sortBy = Es, jn.sortedUniq = function(e) {
                                    return e && e.length ? ii(e) : []
                                }, jn.sortedUniqBy = function(e, t) {
                                    return e && e.length ? ii(e, oo(t, 2)) : []
                                }, jn.split = function(e, t, n) {
                                    return n && "number" != typeof n && yo(e, t, n) && (t = n = i), (n = n === i ? f : n >>> 0) ? (e = ya(e)) && ("string" == typeof t || null != t && !ia(t)) && !(t = si(t)) && rn(e) ? _i(hn(e), 0, n) : e.split(t, n) : []
                                }, jn.spread = function(e, t) {
                                    if ("function" != typeof e) throw new Me(o);
                                    return t = null == t ? 0 : vn(fa(t), 0), Jr(function(n) {
                                        var r = n[t],
                                            i = _i(n, 0, t);
                                        return r && Ot(i, r), It(e, this, i)
                                    })
                                }, jn.tail = function(e) {
                                    var t = null == e ? 0 : e.length;
                                    return t ? ei(e, 1, t) : []
                                }, jn.take = function(e, t, n) {
                                    return e && e.length ? ei(e, 0, (t = n || t === i ? 1 : fa(t)) < 0 ? 0 : t) : []
                                }, jn.takeRight = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    return r ? ei(e, (t = r - (t = n || t === i ? 1 : fa(t))) < 0 ? 0 : t, r) : []
                                }, jn.takeRightWhile = function(e, t) {
                                    return e && e.length ? ci(e, oo(t, 3), !1, !0) : []
                                }, jn.takeWhile = function(e, t) {
                                    return e && e.length ? ci(e, oo(t, 3)) : []
                                }, jn.tap = function(e, t) {
                                    return t(e), e
                                }, jn.throttle = function(e, t, n) {
                                    var r = !0,
                                        i = !0;
                                    if ("function" != typeof e) throw new Me(o);
                                    return Ks(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), Ds(e, t, {
                                        leading: r,
                                        maxWait: t,
                                        trailing: i
                                    })
                                }, jn.thru = ds, jn.toArray = ha, jn.toPairs = Ua, jn.toPairsIn = ja, jn.toPath = function(e) {
                                    return Fs(e) ? Pt(e, Co) : aa(e) ? [e] : Ai(Bo(ya(e)))
                                }, jn.toPlainObject = va, jn.transform = function(e, t, n) {
                                    var r = Fs(e),
                                        i = r || Js(e) || ua(e);
                                    if (t = oo(t, 4), null == n) {
                                        var o = e && e.constructor;
                                        n = i ? r ? new o : [] : Ks(e) && Xs(o) ? Nn(We(e)) : {}
                                    }
                                    return (i ? St : _r)(e, function(e, r, i) {
                                        return t(n, e, r, i)
                                    }), n
                                }, jn.unary = function(e) {
                                    return As(e, 1)
                                }, jn.union = es, jn.unionBy = ts, jn.unionWith = ns, jn.uniq = function(e) {
                                    return e && e.length ? ai(e) : []
                                }, jn.uniqBy = function(e, t) {
                                    return e && e.length ? ai(e, oo(t, 2)) : []
                                }, jn.uniqWith = function(e, t) {
                                    return t = "function" == typeof t ? t : i, e && e.length ? ai(e, i, t) : []
                                }, jn.unset = function(e, t) {
                                    return null == e || ui(e, t)
                                }, jn.unzip = rs, jn.unzipWith = is, jn.update = function(e, t, n) {
                                    return null == e ? e : li(e, t, pi(n))
                                }, jn.updateWith = function(e, t, n, r) {
                                    return r = "function" == typeof r ? r : i, null == e ? e : li(e, t, pi(n), r)
                                }, jn.values = Na, jn.valuesIn = function(e) {
                                    return null == e ? [] : Xt(e, Pa(e))
                                }, jn.without = os, jn.words = Xa, jn.wrap = function(e, t) {
                                    return Cs(pi(t), e)
                                }, jn.xor = ss, jn.xorBy = as, jn.xorWith = us, jn.zip = ls, jn.zipObject = function(e, t) {
                                    return fi(e || [], t || [], Kn)
                                }, jn.zipObjectDeep = function(e, t) {
                                    return fi(e || [], t || [], Xr)
                                }, jn.zipWith = cs, jn.entries = Ua, jn.entriesIn = ja, jn.extend = ma, jn.extendWith = wa, su(jn, jn), jn.add = yu, jn.attempt = Za, jn.camelCase = Ga, jn.capitalize = za, jn.ceil = _u, jn.clamp = function(e, t, n) {
                                    return n === i && (n = t, t = i), n !== i && (n = (n = pa(n)) == n ? n : 0), t !== i && (t = (t = pa(t)) == t ? t : 0), or(pa(e), t, n)
                                }, jn.clone = function(e) {
                                    return sr(e, 4)
                                }, jn.cloneDeep = function(e) {
                                    return sr(e, 5)
                                }, jn.cloneDeepWith = function(e, t) {
                                    return sr(e, 5, t = "function" == typeof t ? t : i)
                                }, jn.cloneWith = function(e, t) {
                                    return sr(e, 4, t = "function" == typeof t ? t : i)
                                }, jn.conformsTo = function(e, t) {
                                    return null == t || ar(e, t, Da(t))
                                }, jn.deburr = qa, jn.defaultTo = function(e, t) {
                                    return null == e || e != e ? t : e
                                }, jn.divide = mu, jn.endsWith = function(e, t, n) {
                                    e = ya(e), t = si(t);
                                    var r = e.length,
                                        o = n = n === i ? r : or(fa(n), 0, r);
                                    return (n -= t.length) >= 0 && e.slice(n, o) == t
                                }, jn.eq = Ns, jn.escape = function(e) {
                                    return (e = ya(e)) && H.test(e) ? e.replace(V, tn) : e
                                }, jn.escapeRegExp = function(e) {
                                    return (e = ya(e)) && ne.test(e) ? e.replace(te, "\\$&") : e
                                }, jn.every = function(e, t, n) {
                                    var r = Fs(e) ? Mt : dr;
                                    return n && yo(e, t, n) && (t = i), r(e, oo(t, 3))
                                }, jn.find = ps, jn.findIndex = qo, jn.findKey = function(e, t) {
                                    return Ut(e, oo(t, 3), _r)
                                }, jn.findLast = vs, jn.findLastIndex = Fo, jn.findLastKey = function(e, t) {
                                    return Ut(e, oo(t, 3), mr)
                                }, jn.floor = wu, jn.forEach = ys, jn.forEachRight = _s, jn.forIn = function(e, t) {
                                    return null == e ? e : vr(e, oo(t, 3), Pa)
                                }, jn.forInRight = function(e, t) {
                                    return null == e ? e : yr(e, oo(t, 3), Pa)
                                }, jn.forOwn = function(e, t) {
                                    return e && _r(e, oo(t, 3))
                                }, jn.forOwnRight = function(e, t) {
                                    return e && mr(e, oo(t, 3))
                                }, jn.get = Sa, jn.gt = Gs, jn.gte = zs, jn.has = function(e, t) {
                                    return null != e && fo(e, t, Sr)
                                }, jn.hasIn = Aa, jn.head = $o, jn.identity = nu, jn.includes = function(e, t, n, r) {
                                    e = $s(e) ? e : Na(e), n = n && !r ? fa(n) : 0;
                                    var i = e.length;
                                    return n < 0 && (n = vn(i + n, 0)), sa(e) ? n <= i && e.indexOf(t, n) > -1 : !!i && Nt(e, t, n) > -1
                                }, jn.indexOf = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    if (!r) return -1;
                                    var i = null == n ? 0 : fa(n);
                                    return i < 0 && (i = vn(r + i, 0)), Nt(e, t, i)
                                }, jn.inRange = function(e, t, n) {
                                    return t = da(t), n === i ? (n = t, t = 0) : n = da(n),
                                        function(e, t, n) {
                                            return e >= yn(t, n) && e < vn(t, n)
                                        }(e = pa(e), t, n)
                                }, jn.invoke = Ra, jn.isArguments = qs, jn.isArray = Fs, jn.isArrayBuffer = Ws, jn.isArrayLike = $s, jn.isArrayLikeObject = Vs, jn.isBoolean = function(e) {
                                    return !0 === e || !1 === e || ea(e) && Ir(e) == y
                                }, jn.isBuffer = Js, jn.isDate = Hs, jn.isElement = function(e) {
                                    return ea(e) && 1 === e.nodeType && !ra(e)
                                }, jn.isEmpty = function(e) {
                                    if (null == e) return !0;
                                    if ($s(e) && (Fs(e) || "string" == typeof e || "function" == typeof e.splice || Js(e) || ua(e) || qs(e))) return !e.length;
                                    var t = ho(e);
                                    if (t == k || t == M) return !e.size;
                                    if (bo(e)) return !Lr(e).length;
                                    for (var n in e)
                                        if (xe.call(e, n)) return !1;
                                    return !0
                                }, jn.isEqual = function(e, t) {
                                    return Dr(e, t)
                                }, jn.isEqualWith = function(e, t, n) {
                                    var r = (n = "function" == typeof n ? n : i) ? n(e, t) : i;
                                    return r === i ? Dr(e, t, i, n) : !!r
                                }, jn.isError = Qs, jn.isFinite = function(e) {
                                    return "number" == typeof e && Ct(e)
                                }, jn.isFunction = Xs, jn.isInteger = Zs, jn.isLength = Ys, jn.isMap = ta, jn.isMatch = function(e, t) {
                                    return e === t || Pr(e, t, ao(t))
                                }, jn.isMatchWith = function(e, t, n) {
                                    return n = "function" == typeof n ? n : i, Pr(e, t, ao(t), n)
                                }, jn.isNaN = function(e) {
                                    return na(e) && e != +e
                                }, jn.isNative = function(e) {
                                    if (wo(e)) throw new be("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
                                    return Or(e)
                                }, jn.isNil = function(e) {
                                    return null == e
                                }, jn.isNull = function(e) {
                                    return null === e
                                }, jn.isNumber = na, jn.isObject = Ks, jn.isObjectLike = ea, jn.isPlainObject = ra, jn.isRegExp = ia, jn.isSafeInteger = function(e) {
                                    return Zs(e) && e >= -9007199254740991 && e <= h
                                }, jn.isSet = oa, jn.isString = sa, jn.isSymbol = aa, jn.isTypedArray = ua, jn.isUndefined = function(e) {
                                    return e === i
                                }, jn.isWeakMap = function(e) {
                                    return ea(e) && ho(e) == D
                                }, jn.isWeakSet = function(e) {
                                    return ea(e) && "[object WeakSet]" == Ir(e)
                                }, jn.join = function(e, t) {
                                    return null == e ? "" : Wt.call(e, t)
                                }, jn.kebabCase = Fa, jn.last = Qo, jn.lastIndexOf = function(e, t, n) {
                                    var r = null == e ? 0 : e.length;
                                    if (!r) return -1;
                                    var o = r;
                                    return n !== i && (o = (o = fa(n)) < 0 ? vn(r + o, 0) : yn(o, r - 1)), t == t ? function(e, t, n) {
                                        for (var r = n + 1; r--;)
                                            if (e[r] === t) return r;
                                        return r
                                    }(e, t, o) : jt(e, zt, o, !0)
                                }, jn.lowerCase = Wa, jn.lowerFirst = $a, jn.lt = la, jn.lte = ca, jn.max = function(e) {
                                    return e && e.length ? fr(e, nu, Er) : i
                                }, jn.maxBy = function(e, t) {
                                    return e && e.length ? fr(e, oo(t, 2), Er) : i
                                }, jn.mean = function(e) {
                                    return qt(e, nu)
                                }, jn.meanBy = function(e, t) {
                                    return qt(e, oo(t, 2))
                                }, jn.min = function(e) {
                                    return e && e.length ? fr(e, nu, Br) : i
                                }, jn.minBy = function(e, t) {
                                    return e && e.length ? fr(e, oo(t, 2), Br) : i
                                }, jn.stubArray = gu, jn.stubFalse = pu, jn.stubObject = function() {
                                    return {}
                                }, jn.stubString = function() {
                                    return ""
                                }, jn.stubTrue = function() {
                                    return !0
                                }, jn.multiply = bu, jn.nth = function(e, t) {
                                    return e && e.length ? Gr(e, fa(t)) : i
                                }, jn.noConflict = function() {
                                    return ht._ === this && (ht._ = je), this
                                }, jn.noop = au, jn.now = Ss, jn.pad = function(e, t, n) {
                                    e = ya(e);
                                    var r = (t = fa(t)) ? cn(e) : 0;
                                    if (!t || r >= t) return e;
                                    var i = (t - r) / 2;
                                    return zi(ft(i), n) + e + zi(dt(i), n)
                                }, jn.padEnd = function(e, t, n) {
                                    e = ya(e);
                                    var r = (t = fa(t)) ? cn(e) : 0;
                                    return t && r < t ? e + zi(t - r, n) : e
                                }, jn.padStart = function(e, t, n) {
                                    e = ya(e);
                                    var r = (t = fa(t)) ? cn(e) : 0;
                                    return t && r < t ? zi(t - r, n) + e : e
                                }, jn.parseInt = function(e, t, n) {
                                    return n || null == t ? t = 0 : t && (t = +t), mn(ya(e).replace(re, ""), t || 0)
                                }, jn.random = function(e, t, n) {
                                    if (n && "boolean" != typeof n && yo(e, t, n) && (t = n = i), n === i && ("boolean" == typeof t ? (n = t, t = i) : "boolean" == typeof e && (n = e, e = i)), e === i && t === i ? (e = 0, t = 1) : (e = da(e), t === i ? (t = e, e = 0) : t = da(t)), e > t) {
                                        var r = e;
                                        e = t, t = r
                                    }
                                    if (n || e % 1 || t % 1) {
                                        var o = wn();
                                        return yn(e + o * (t - e + at("1e-" + ((o + "").length - 1))), t)
                                    }
                                    return $r(e, t)
                                }, jn.reduce = function(e, t, n) {
                                    var r = Fs(e) ? xt : $t,
                                        i = arguments.length < 3;
                                    return r(e, oo(t, 4), n, i, cr)
                                }, jn.reduceRight = function(e, t, n) {
                                    var r = Fs(e) ? Lt : $t,
                                        i = arguments.length < 3;
                                    return r(e, oo(t, 4), n, i, hr)
                                }, jn.repeat = function(e, t, n) {
                                    return t = (n ? yo(e, t, n) : t === i) ? 1 : fa(t), Vr(ya(e), t)
                                }, jn.replace = function() {
                                    var e = arguments,
                                        t = ya(e[0]);
                                    return e.length < 3 ? t : t.replace(e[1], e[2])
                                }, jn.result = function(e, t, n) {
                                    var r = -1,
                                        o = (t = vi(t, e)).length;
                                    for (o || (o = 1, e = i); ++r < o;) {
                                        var s = null == e ? i : e[Co(t[r])];
                                        s === i && (r = o, s = n), e = Xs(s) ? s.call(e) : s
                                    }
                                    return e
                                }, jn.round = ku, jn.runInContext = e, jn.sample = function(e) {
                                    return (Fs(e) ? Qn : Hr)(e)
                                }, jn.size = function(e) {
                                    if (null == e) return 0;
                                    if ($s(e)) return sa(e) ? cn(e) : e.length;
                                    var t = ho(e);
                                    return t == k || t == M ? e.size : Lr(e).length
                                }, jn.snakeCase = Va, jn.some = function(e, t, n) {
                                    var r = Fs(e) ? Bt : ti;
                                    return n && yo(e, t, n) && (t = i), r(e, oo(t, 3))
                                }, jn.sortedIndex = function(e, t) {
                                    return ni(e, t)
                                }, jn.sortedIndexBy = function(e, t, n) {
                                    return ri(e, t, oo(n, 2))
                                }, jn.sortedIndexOf = function(e, t) {
                                    var n = null == e ? 0 : e.length;
                                    if (n) {
                                        var r = ni(e, t);
                                        if (r < n && Ns(e[r], t)) return r
                                    }
                                    return -1
                                }, jn.sortedLastIndex = function(e, t) {
                                    return ni(e, t, !0)
                                }, jn.sortedLastIndexBy = function(e, t, n) {
                                    return ri(e, t, oo(n, 2), !0)
                                }, jn.sortedLastIndexOf = function(e, t) {
                                    if (null != e && e.length) {
                                        var n = ni(e, t, !0) - 1;
                                        if (Ns(e[n], t)) return n
                                    }
                                    return -1
                                }, jn.startCase = Ja, jn.startsWith = function(e, t, n) {
                                    return e = ya(e), n = null == n ? 0 : or(fa(n), 0, e.length), t = si(t), e.slice(n, n + t.length) == t
                                }, jn.subtract = Iu, jn.sum = function(e) {
                                    return e && e.length ? Vt(e, nu) : 0
                                }, jn.sumBy = function(e, t) {
                                    return e && e.length ? Vt(e, oo(t, 2)) : 0
                                }, jn.template = function(e, t, n) {
                                    var r = jn.templateSettings;
                                    n && yo(e, t, n) && (t = i), e = ya(e), t = wa({}, t, r, Qi);
                                    var o, s, a = wa({}, t.imports, r.imports, Qi),
                                        u = Da(a),
                                        l = Xt(a, u),
                                        c = 0,
                                        h = t.interpolate || me,
                                        d = "__p += '",
                                        f = Se((t.escape || me).source + "|" + h.source + "|" + (h === Z ? he : me).source + "|" + (t.evaluate || me).source + "|$", "g"),
                                        g = "//# sourceURL=" + (xe.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++rt + "]") + "\n";
                                    e.replace(f, function(t, n, r, i, a, u) {
                                        return r || (r = i), d += e.slice(c, u).replace(we, nn), n && (o = !0, d += "' +\n__e(" + n + ") +\n'"), a && (s = !0, d += "';\n" + a + ";\n__p += '"), r && (d += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"), c = u + t.length, t
                                    }), d += "';\n";
                                    var p = xe.call(t, "variable") && t.variable;
                                    if (p) {
                                        if (le.test(p)) throw new be("Invalid `variable` option passed into `_.template`")
                                    } else d = "with (obj) {\n" + d + "\n}\n";
                                    d = (s ? d.replace(q, "") : d).replace(F, "$1").replace(W, "$1;"), d = "function(" + (p || "obj") + ") {\n" + (p ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (s ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + d + "return __p\n}";
                                    var v = Za(function() {
                                        return ke(u, g + "return " + d).apply(i, l)
                                    });
                                    if (v.source = d, Qs(v)) throw v;
                                    return v
                                }, jn.times = function(e, t) {
                                    if ((e = fa(e)) < 1 || e > h) return [];
                                    var n = f,
                                        r = yn(e, f);
                                    t = oo(t), e -= f;
                                    for (var i = Jt(r, t); ++n < e;) t(n);
                                    return i
                                }, jn.toFinite = da, jn.toInteger = fa, jn.toLength = ga, jn.toLower = function(e) {
                                    return ya(e).toLowerCase()
                                }, jn.toNumber = pa, jn.toSafeInteger = function(e) {
                                    return e ? or(fa(e), -9007199254740991, h) : 0 === e ? e : 0
                                }, jn.toString = ya, jn.toUpper = function(e) {
                                    return ya(e).toUpperCase()
                                }, jn.trim = function(e, t, n) {
                                    if ((e = ya(e)) && (n || t === i)) return Ht(e);
                                    if (!e || !(t = si(t))) return e;
                                    var r = hn(e),
                                        o = hn(t);
                                    return _i(r, Yt(r, o), Kt(r, o) + 1).join("")
                                }, jn.trimEnd = function(e, t, n) {
                                    if ((e = ya(e)) && (n || t === i)) return e.slice(0, dn(e) + 1);
                                    if (!e || !(t = si(t))) return e;
                                    var r = hn(e);
                                    return _i(r, 0, Kt(r, hn(t)) + 1).join("")
                                }, jn.trimStart = function(e, t, n) {
                                    if ((e = ya(e)) && (n || t === i)) return e.replace(re, "");
                                    if (!e || !(t = si(t))) return e;
                                    var r = hn(e);
                                    return _i(r, Yt(r, hn(t))).join("")
                                }, jn.truncate = function(e, t) {
                                    var n = 30,
                                        r = "...";
                                    if (Ks(t)) {
                                        var o = "separator" in t ? t.separator : o;
                                        n = "length" in t ? fa(t.length) : n, r = "omission" in t ? si(t.omission) : r
                                    }
                                    var s = (e = ya(e)).length;
                                    if (rn(e)) {
                                        var a = hn(e);
                                        s = a.length
                                    }
                                    if (n >= s) return e;
                                    var u = n - cn(r);
                                    if (u < 1) return r;
                                    var l = a ? _i(a, 0, u).join("") : e.slice(0, u);
                                    if (o === i) return l + r;
                                    if (a && (u += l.length - u), ia(o)) {
                                        if (e.slice(u).search(o)) {
                                            var c, h = l;
                                            for (o.global || (o = Se(o.source, ya(de.exec(o)) + "g")), o.lastIndex = 0; c = o.exec(h);) var d = c.index;
                                            l = l.slice(0, d === i ? u : d)
                                        }
                                    } else if (e.indexOf(si(o), u) != u) {
                                        var f = l.lastIndexOf(o);
                                        f > -1 && (l = l.slice(0, f))
                                    }
                                    return l + r
                                }, jn.unescape = function(e) {
                                    return (e = ya(e)) && J.test(e) ? e.replace($, fn) : e
                                }, jn.uniqueId = function(e) {
                                    var t = ++Le;
                                    return ya(e) + t
                                }, jn.upperCase = Ha, jn.upperFirst = Qa, jn.each = ys, jn.eachRight = _s, jn.first = $o, su(jn, (vu = {}, _r(jn, function(e, t) {
                                    xe.call(jn.prototype, t) || (vu[t] = e)
                                }), vu), {
                                    chain: !1
                                }), jn.VERSION = "4.17.21", St(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
                                    jn[e].placeholder = jn
                                }), St(["drop", "take"], function(e, t) {
                                    qn.prototype[e] = function(n) {
                                        n = n === i ? 1 : vn(fa(n), 0);
                                        var r = this.__filtered__ && !t ? new qn(this) : this.clone();
                                        return r.__filtered__ ? r.__takeCount__ = yn(n, r.__takeCount__) : r.__views__.push({
                                            size: yn(n, f),
                                            type: e + (r.__dir__ < 0 ? "Right" : "")
                                        }), r
                                    }, qn.prototype[e + "Right"] = function(t) {
                                        return this.reverse()[e](t).reverse()
                                    }
                                }), St(["filter", "map", "takeWhile"], function(e, t) {
                                    var n = t + 1,
                                        r = 1 == n || 3 == n;
                                    qn.prototype[e] = function(e) {
                                        var t = this.clone();
                                        return t.__iteratees__.push({
                                            iteratee: oo(e, 3),
                                            type: n
                                        }), t.__filtered__ = t.__filtered__ || r, t
                                    }
                                }), St(["head", "last"], function(e, t) {
                                    var n = "take" + (t ? "Right" : "");
                                    qn.prototype[e] = function() {
                                        return this[n](1).value()[0]
                                    }
                                }), St(["initial", "tail"], function(e, t) {
                                    var n = "drop" + (t ? "" : "Right");
                                    qn.prototype[e] = function() {
                                        return this.__filtered__ ? new qn(this) : this[n](1)
                                    }
                                }), qn.prototype.compact = function() {
                                    return this.filter(nu)
                                }, qn.prototype.find = function(e) {
                                    return this.filter(e).head()
                                }, qn.prototype.findLast = function(e) {
                                    return this.reverse().find(e)
                                }, qn.prototype.invokeMap = Jr(function(e, t) {
                                    return "function" == typeof e ? new qn(this) : this.map(function(n) {
                                        return Tr(n, e, t)
                                    })
                                }), qn.prototype.reject = function(e) {
                                    return this.filter(Ls(oo(e)))
                                }, qn.prototype.slice = function(e, t) {
                                    e = fa(e);
                                    var n = this;
                                    return n.__filtered__ && (e > 0 || t < 0) ? new qn(n) : (e < 0 ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== i && (n = (t = fa(t)) < 0 ? n.dropRight(-t) : n.take(t - e)), n)
                                }, qn.prototype.takeRightWhile = function(e) {
                                    return this.reverse().takeWhile(e).reverse()
                                }, qn.prototype.toArray = function() {
                                    return this.take(f)
                                }, _r(qn.prototype, function(e, t) {
                                    var n = /^(?:filter|find|map|reject)|While$/.test(t),
                                        r = /^(?:head|last)$/.test(t),
                                        o = jn[r ? "take" + ("last" == t ? "Right" : "") : t],
                                        s = r || /^find/.test(t);
                                    o && (jn.prototype[t] = function() {
                                        var t = this.__wrapped__,
                                            a = r ? [1] : arguments,
                                            u = t instanceof qn,
                                            l = a[0],
                                            c = u || Fs(t),
                                            h = function(e) {
                                                var t = o.apply(jn, Ot([e], a));
                                                return r && d ? t[0] : t
                                            };
                                        c && n && "function" == typeof l && 1 != l.length && (u = c = !1);
                                        var d = this.__chain__,
                                            f = !!this.__actions__.length,
                                            g = s && !d,
                                            p = u && !f;
                                        if (!s && c) {
                                            t = p ? t : new qn(this);
                                            var v = e.apply(t, a);
                                            return v.__actions__.push({
                                                func: ds,
                                                args: [h],
                                                thisArg: i
                                            }), new zn(v, d)
                                        }
                                        return g && p ? e.apply(this, a) : (v = this.thru(h), g ? r ? v.value()[0] : v.value() : v)
                                    })
                                }), St(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
                                    var t = Te[e],
                                        n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru",
                                        r = /^(?:pop|shift)$/.test(e);
                                    jn.prototype[e] = function() {
                                        var e = arguments;
                                        if (r && !this.__chain__) {
                                            var i = this.value();
                                            return t.apply(Fs(i) ? i : [], e)
                                        }
                                        return this[n](function(n) {
                                            return t.apply(Fs(n) ? n : [], e)
                                        })
                                    }
                                }), _r(qn.prototype, function(e, t) {
                                    var n = jn[t];
                                    if (n) {
                                        var r = n.name + "";
                                        xe.call(Rn, r) || (Rn[r] = []), Rn[r].push({
                                            name: t,
                                            func: n
                                        })
                                    }
                                }), Rn[Ui(i, 2).name] = [{
                                    name: "wrapper",
                                    func: i
                                }], qn.prototype.clone = function() {
                                    var e = new qn(this.__wrapped__);
                                    return e.__actions__ = Ai(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = Ai(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = Ai(this.__views__), e
                                }, qn.prototype.reverse = function() {
                                    if (this.__filtered__) {
                                        var e = new qn(this);
                                        e.__dir__ = -1, e.__filtered__ = !0
                                    } else(e = this.clone()).__dir__ *= -1;
                                    return e
                                }, qn.prototype.value = function() {
                                    var e = this.__wrapped__.value(),
                                        t = this.__dir__,
                                        n = Fs(e),
                                        r = t < 0,
                                        i = n ? e.length : 0,
                                        o = function(e, t, n) {
                                            for (var r = -1, i = n.length; ++r < i;) {
                                                var o = n[r],
                                                    s = o.size;
                                                switch (o.type) {
                                                    case "drop":
                                                        e += s;
                                                        break;
                                                    case "dropRight":
                                                        t -= s;
                                                        break;
                                                    case "take":
                                                        t = yn(t, e + s);
                                                        break;
                                                    case "takeRight":
                                                        e = vn(e, t - s)
                                                }
                                            }
                                            return {
                                                start: e,
                                                end: t
                                            }
                                        }(0, i, this.__views__),
                                        s = o.start,
                                        a = o.end,
                                        u = a - s,
                                        l = r ? a : s - 1,
                                        c = this.__iteratees__,
                                        h = c.length,
                                        d = 0,
                                        f = yn(u, this.__takeCount__);
                                    if (!n || !r && i == u && f == u) return hi(e, this.__actions__);
                                    var g = [];
                                    e: for (; u-- && d < f;) {
                                        for (var p = -1, v = e[l += t]; ++p < h;) {
                                            var y = c[p],
                                                _ = y.iteratee,
                                                m = y.type,
                                                w = _(v);
                                            if (2 == m) v = w;
                                            else if (!w) {
                                                if (1 == m) continue e;
                                                break e
                                            }
                                        }
                                        g[d++] = v
                                    }
                                    return g
                                }, jn.prototype.at = fs, jn.prototype.chain = function() {
                                    return hs(this)
                                }, jn.prototype.commit = function() {
                                    return new zn(this.value(), this.__chain__)
                                }, jn.prototype.next = function() {
                                    this.__values__ === i && (this.__values__ = ha(this.value()));
                                    var e = this.__index__ >= this.__values__.length;
                                    return {
                                        done: e,
                                        value: e ? i : this.__values__[this.__index__++]
                                    }
                                }, jn.prototype.plant = function(e) {
                                    for (var t, n = this; n instanceof Gn;) {
                                        var r = jo(n);
                                        r.__index__ = 0, r.__values__ = i, t ? o.__wrapped__ = r : t = r;
                                        var o = r;
                                        n = n.__wrapped__
                                    }
                                    return o.__wrapped__ = e, t
                                }, jn.prototype.reverse = function() {
                                    var e = this.__wrapped__;
                                    if (e instanceof qn) {
                                        var t = e;
                                        return this.__actions__.length && (t = new qn(this)), (t = t.reverse()).__actions__.push({
                                            func: ds,
                                            args: [Ko],
                                            thisArg: i
                                        }), new zn(t, this.__chain__)
                                    }
                                    return this.thru(Ko)
                                }, jn.prototype.toJSON = jn.prototype.valueOf = jn.prototype.value = function() {
                                    return hi(this.__wrapped__, this.__actions__)
                                }, jn.prototype.first = jn.prototype.head, Qe && (jn.prototype[Qe] = function() {
                                    return this
                                }), jn
                            }();
                        ht._ = gn, (r = function() {
                            return gn
                        }.call(t, n, t, e)) === i || (e.exports = r)
                    }.call(this)
            },
            589: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(491),
                    o = n(366),
                    s = r(n(916)),
                    a = n(930),
                    u = n(637);
                t.default = class {
                    constructor(e) {
                        this.sdk = e, this.disableBannerCheck = !1, this.overlayBanners = {}, this.renderedBannerIds = new Set, this.logger = new s.default("banner")
                    }
                    async requestBanner(e) {
                        this.logger.log("Requesting banner with automatic rendering", e), this.ensureVideoAdNotPlaying(e.id);
                        const t = await this.prefetchBanner(e);
                        return this.renderPrefetchedBanner(t)
                    }
                    async requestResponsiveBanner(e) {
                        this.logger.log(`Requesting responsive banner with automatic rendering #${e}`), this.ensureVideoAdNotPlaying(e);
                        const t = await (0, a.getBannerContainer)(e, !this.disableBannerCheck),
                            {
                                width: n,
                                height: r
                            } = t.containerInfo.size,
                            i = await this.prefetchResponsiveBanner({
                                id: e,
                                width: n,
                                height: r
                            });
                        return this.renderPrefetchedBanner(i)
                    }
                    async prefetchBanner(e) {
                        if (this.logger.log("Prefetch banner", e), !(0, u.matchesInGameBannerSize)(e.width, e.height)) return Promise.reject("Invalid banner size");
                        const t = (0, a.ContainerIdToInnerId)(e.id),
                            n = {
                                ...e,
                                id: t
                            };
                        return {
                            id: n.id,
                            banner: n,
                            options: {}
                        }
                    }
                    async prefetchResponsiveBanner(e) {
                        this.logger.log(`Prefetch responsive banner #${e.id}`);
                        const {
                            width: t,
                            height: n
                        } = e, r = {
                            id: (0, a.ContainerIdToInnerId)(e.id),
                            width: t,
                            height: n,
                            isResponsive: !0
                        };
                        return {
                            id: r.id,
                            banner: r,
                            options: {}
                        }
                    }
                    async renderPrefetchedBanner(e) {
                        this.logger.log("Rendering prefetched banner", e);
                        const t = (0, a.InnerIdToContainerId)(e.id);
                        this.ensureVideoAdNotPlaying(t), await (0, a.getBannerContainer)(t, !0), this.renderedBannerIds.add(t), (0, o.renderFakeBanner)(e.banner)
                    }
                    ensureVideoAdNotPlaying(e) {
                        if (this.sdk.ad.isAdPlaying) throw new u.BannerError("videoAdPlaying", "Banners cannot be rendered while a video ad is playing", e)
                    }
                    requestOverlayBanners(e, t) {
                        const n = e.map(e => e.id);
                        Object.keys(this.overlayBanners).forEach(e => {
                            n.includes(e) || (this.logger.log("Remove overlay banner " + e), this.overlayBanners[e].destroy(), delete this.overlayBanners[e])
                        }), e.forEach(e => {
                            if (this.overlayBanners[e.id]) return void this.logger.log("Skip overlay banner update " + e.id);
                            this.logger.log("Create overlay banner " + e.id);
                            const n = new i.OverlayBanner(e, this.disableBannerCheck, this, t);
                            this.overlayBanners[e.id] = n
                        })
                    }
                    clearBanner(e) {
                        const t = document.getElementById((0, a.ContainerIdToInnerId)(e));
                        t ? (t.remove(), this.renderedBannerIds.delete(e), this.logger.log(`Cleared the banner from container #${e}`)) : this.logger.log(`There isn't a banner in container #${e}, not clearing anything.`)
                    }
                    clearAllBanners() {
                        const e = Array.from(this.renderedBannerIds.values());
                        this.logger.log("Clearing all banners, ids: ", e.map(e => `#${e}`).join(", ")), e.forEach(e => {
                            this.clearBanner(e)
                        })
                    }
                    get activeBannersCount() {
                        return this.renderedBannerIds.size
                    }
                }
            },
            591: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = r(n(202)),
                    o = r(n(589)),
                    s = r(n(488)),
                    a = n(771),
                    u = n(681),
                    l = r(n(916)),
                    c = n(12),
                    h = r(n(599)),
                    d = n(361);
                t.default = class {
                    constructor() {
                        this.adModule = new i.default(this), this.bannerModule = new o.default(this), this.userModule = new s.default, this.dataModule = new h.default(this), this.gameLogger = new l.default("game"), this.analyticsLogger = new l.default("analytics"), this.throttledHappyTime = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting happytime (local)"), 1e3, "happytime"), this.throttledGameplayStart = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting gameplay start (local)"), 1e3, "gameplayStart"), this.throttledGameplayStop = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting gameplay stop (local)"), 1e3, "gameplayStop"), this.showInviteButton = e => {
                            this.gameLogger.log("Show invite button (local)");
                            const t = (0, u.generateInviteLink)(e, this.game.link);
                            return this.gameLogger.log(`Invite button link ${t}`), t
                        }, this.inviteLink = e => {
                            this.gameLogger.log("Requesting invite link (local)");
                            const t = (0, u.generateInviteLink)(e, this.game.link);
                            return this.gameLogger.log(`Invite link is ${t}`), t
                        }, this.adModule.init(), this.bannerModule.disableBannerCheck = "true" === (0, a.getQueryStringValue)("disable_banner_check")
                    }
                    get ad() {
                        return this.adModule
                    }
                    get banner() {
                        return this.bannerModule
                    }
                    get user() {
                        return this.userModule
                    }
                    get data() {
                        return this.dataModule
                    }
                    get environment() {
                        return "local"
                    }
                    get isQaTool() {
                        return !1
                    }
                    get game() {
                        return {
                            link: "https://www.crazygames.com/game/your-game-will-appear-here",
                            id: "local",
                            isInstantJoin: window.location.search.includes("instantJoin=true"),
                            isInstantMultiplayer: window.location.search.includes("instantJoin=true"),
                            happytime: () => this.throttledHappyTime(),
                            gameplayStart: () => this.throttledGameplayStart(),
                            gameplayStop: () => this.throttledGameplayStop(),
                            loadingStart: () => this.gameLogger.log("Requesting game loading start (local)"),
                            loadingStop: () => this.gameLogger.log("Requesting game loading stop (local)"),
                            inviteLink: this.inviteLink,
                            showInviteButton: this.showInviteButton,
                            hideInviteButton: () => this.gameLogger.log("Hide invite button (local)"),
                            getInviteParam: e => new URLSearchParams(window.location.search).get(e),
                            settings: {
                                disableChat: !1
                            }
                        }
                    }
                    get analytics() {
                        return {
                            trackOrder: (e, t) => {
                                if (!(0, a.isXsollaOrderArgumentValid)(t)) throw new d.AnalyticsError("invalidArgument", "Order must be a JSON object.");
                                if (!d.PAYMENT_PROVIDERS.includes(e)) throw new d.AnalyticsError("invalidArgument", `Unsupported payment provider. Supported providers: ${d.PAYMENT_PROVIDERS.join(",")}`);
                                this.analyticsLogger.log(`Track "${e}" order`, t)
                            }
                        }
                    }
                }
            },
            599: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = r(n(916)),
                    o = n(25),
                    s = n(63);
                t.default = class {
                    constructor(e) {
                        this.logger = new i.default("data");
                        const t = (0, o.loadGameDataFromLs)(e.game.id);
                        this.localDataHandler = new s.LocalDataHandler(t, e.game.id)
                    }
                    clear() {
                        this.logger.log("Clear data"), this.localDataHandler.clear()
                    }
                    getItem(e) {
                        const t = this.localDataHandler.getItem(e);
                        return this.logger.log(`Get "${e}", returning ${t}`), t
                    }
                    removeItem(e) {
                        this.logger.log(`Remove "${e}"`), this.localDataHandler.removeItem(e)
                    }
                    setItem(e, t) {
                        this.logger.log(`Set "${e}" = ${t}`), this.localDataHandler.setItem(e, t)
                    }
                    syncUnityGameData() {
                        this.logger.log("Requesting to sync unity PlayerPrefs (local)")
                    }
                }
            },
            617: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(681),
                    o = r(n(916)),
                    s = n(12),
                    a = n(543),
                    u = n(868);
                t.default = class {
                    constructor(e, t) {
                        this.sdk = e, this.logger = new o.default("game"), this.settings = {
                            disableChat: !1
                        }, this.isInstantJoin = window.location.search.includes("instantJoin=true"), this.isInstantMultiplayer = window.location.search.includes("instantJoin=true"), this.loadStatsSent = !1, this.throttledHappyTime = (0, s.throttledMethod)(() => {
                            this.logger.log("Requesting happytime"), this.sdk.postMessage({
                                type: "happytime",
                                data: {}
                            })
                        }, 1e3, "happytime"), this.throttledGameplayStart = (0, s.throttledMethod)(() => {
                            this.logger.log("Requesting gameplay start"), this.sdk.postMessage({
                                type: "gameplayStart",
                                data: {}
                            })
                        }, 1e3, "gameplayStart"), this.throttledGameplayStop = (0, s.throttledMethod)(() => {
                            this.logger.log("Requesting gameplay stop"), this.sdk.postMessage({
                                type: "gameplayStop",
                                data: {}
                            })
                        }, 1e3, "gameplayStop"), this.link = t.gameLink, this.id = t.gameId, this.performanceTracker = new u.GamePerformanceTracker(this.logger, e)
                    }
                    happytime() {
                        this.throttledHappyTime()
                    }
                    gameplayStart() {
                        if (this.throttledGameplayStart(), !this.loadStatsSent) {
                            this.loadStatsSent = !0;
                            let e = window.performance.getEntriesByType("resource").map(e => JSON.parse(JSON.stringify(e)));
                            e = (0, a.uniqBy)(e, "name"), this.sdk.postMessage({
                                type: "sdkGameLoadStats",
                                data: {
                                    resources: e
                                }
                            })
                        }
                    }
                    gameplayStop() {
                        this.throttledGameplayStop()
                    }
                    loadingStart() {
                        this.logger.log("Requesting game loading start"), this.sdk.postMessage({
                            type: "sdkGameLoadingStart",
                            data: {}
                        })
                    }
                    loadingStop() {
                        this.logger.log("Requesting game loading stop"), this.sdk.postMessage({
                            type: "sdkGameLoadingStop",
                            data: {}
                        })
                    }
                    inviteLink(e) {
                        this.logger.log("Requesting invite link");
                        const t = (0, i.generateInviteLink)(e, this.link);
                        return this.logger.log(`Invite link is ${t}`), this.sdk.postMessage({
                            type: "inviteUrl",
                            data: {
                                inviteUrl: t
                            }
                        }), t
                    }
                    showInviteButton(e) {
                        this.logger.log("Show invite button");
                        const t = (0, i.generateInviteLink)(e, this.link);
                        return this.logger.log(`Invite button link ${t}`), this.sdk.postMessage({
                            type: "showInviteButton",
                            data: {
                                inviteUrl: t
                            }
                        }), t
                    }
                    hideInviteButton() {
                        this.logger.log("Hide invite button"), this.sdk.postMessage({
                            type: "hideInviteButton",
                            data: {}
                        })
                    }
                    getInviteParam(e) {
                        return new URLSearchParams(window.location.search).get(e)
                    }
                    handleEvent(e) {
                        "focusStealAttempt" === e.type && this.restoreCanvasFocus()
                    }
                    restoreCanvasFocus() {
                        try {
                            const e = document.getElementsByTagName("canvas");
                            1 !== e.length ? this.logger.log(`There are ${e.length} canvases, don't restore focus`) : (this.logger.log("Restore focus to canvas"), e[0].tabIndex = 1, e[0].focus())
                        } catch {
                            this.logger.error("Failed to restore canvas focus")
                        }
                    }
                }
            },
            629: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.ch = function(e) {
                    const t = JSON.parse(JSON.stringify(e)),
                        n = Object.keys(t).filter(e => void 0 !== t[e] && null !== t[e]).sort();
                    let r = "";
                    for (const e of n) r += e + "_" + JSON.stringify(t[e]) + "_";
                    return function(e) {
                        let t = 0;
                        if (0 === e.length) return t;
                        for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t |= 0;
                        return t
                    }(r)
                }
            },
            637: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.BannerError = void 0, t.isInGameBannerSize = o, t.matchesInGameBannerSize = function(e, t) {
                    return o(`${e}x${t}`)
                };
                const r = n(833),
                    i = n(433);

                function o(e) {
                    return (0, i.isInGameBannerSize)(e)
                }
                class s extends r.GeneralError {
                    constructor(e, t, n) {
                        super(e, t), this.code = e, this.message = t, this.containerId = n
                    }
                }
                t.BannerError = s
            },
            643: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.wait = function(e) {
                    return new Promise(t => setTimeout(t, e))
                }
            },
            659: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = n(833),
                    o = r(n(916)),
                    s = n(457),
                    a = r(n(984)),
                    u = n(888),
                    l = n(63);
                t.default = class {
                    constructor(e, t) {
                        if (this.sdk = e, this.logger = new o.default("data"), this.alreadySent = [], "local" === t.handler) this.dataHandler = new l.LocalDataHandler(t.data, e.game.id);
                        else if ("cloud" === t.handler) this.dataHandler = new s.CloudDataHandler(e, !!t.doNotSync, t.data);
                        else {
                            if ("disabled" !== t.handler) throw new i.GeneralError("unexpectedError", `Unknown data handler ${t.handler}`);
                            this.dataHandler = new u.DisabledDataHandler
                        }
                    }
                    clear() {
                        this.dataHandler.clear(), this.logger.log("Clear data"), this.sdk.postMessage({
                            type: "useDataModule",
                            data: {
                                action: "clear"
                            }
                        })
                    }
                    getItem(e) {
                        const t = this.dataHandler.getItem(e);
                        return this.logger.log(`Get "${e}", returning ${t}`), this.debugEvent("getItem", e), this.sdk.postMessage({
                            type: "useDataModule",
                            data: {
                                action: "getItem"
                            }
                        }), t
                    }
                    removeItem(e) {
                        this.dataHandler.removeItem(e), this.logger.log(`Remove "${e}"`), this.sdk.postMessage({
                            type: "useDataModule",
                            data: {
                                action: "removeItem"
                            }
                        }), this.debugEvent("removeItem", e)
                    }
                    setItem(e, t) {
                        this.dataHandler.setItem(e, t), this.logger.log(`Set "${e}" = ${t}`), this.sdk.postMessage({
                            type: "useDataModule",
                            data: {
                                action: "setItem"
                            }
                        }), this.debugEvent("setItem", e, t)
                    }
                    syncUnityGameData() {
                        this.logger.log("Requesting to sync unity game data"), this.sdk.postMessage({
                            type: "syncUnityGameData",
                            data: {}
                        })
                    }
                    debugEvent(e, t, n) {
                        const r = `${e}-${t}`;
                        this.alreadySent.includes(r) || (this.alreadySent.push(r), a.default.getInstance().sendDebugEvent("dataEventWithoutSDKPS", {
                            method: e,
                            key: t,
                            value: n
                        }, e => !!e.dataModule && "sdk" !== e.dataModule.apsStorageType))
                    }
                }
            },
            672: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.SDK_VERSION = void 0, t.SDK_VERSION = "3.3.1"
            },
            681: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.generateInviteLink = function(e, t) {
                    if (!t) return "An error happened when generating invite link";
                    const n = new URL(t),
                        r = n.searchParams;
                    return r.set("czy_invite", "true"), r.set("utm_source", "invite"), Object.keys(e).forEach(t => {
                        r.set(t, e[t])
                    }), n.toString()
                }
            },
            691: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = r(n(201)),
                    o = r(n(617)),
                    s = r(n(985)),
                    a = r(n(924)),
                    u = n(220),
                    l = r(n(916)),
                    c = r(n(659)),
                    h = r(n(984)),
                    d = n(925),
                    f = r(n(199));
                t.default = class {
                    constructor(e, t, n) {
                        this.logger = new l.default("none"), this.receiveMessage = async e => {
                            const t = e.data;
                            (0, u.isGfToSdkEvent)(t) && t.type && (this.logger.verbose("Received message from GF", t), this.bannerModule.handleEvent(t), this.adModule.handleEvent(t), this.userModule.handleEvent(t), this.gameModule.handleEvent(t), h.default.getInstance().handleEvent(t))
                        }, !0 === e.debug && (l.default.forceEnable = !0), this._isQaTool = e.isQaTool, this.adModule = new s.default(this, e), this.bannerModule = new i.default(this, e), this.gameModule = new o.default(this, e), this.userModule = new a.default(this, e.systemInfo, !!e.userAccountAvailable, n), this.dataModule = new c.default(this, t), this.analyticsModule = new f.default(this), window.addEventListener("message", this.receiveMessage, !1), h.default.getInstance().init(this, e), this.propagateErrors()
                    }
                    get environment() {
                        return this.postMessage({
                            type: "getEnvironment",
                            data: {}
                        }), "crazygames"
                    }
                    get isQaTool() {
                        return this.postMessage({
                            type: "isQATool",
                            data: {}
                        }), this._isQaTool
                    }
                    get banner() {
                        return this.bannerModule
                    }
                    get game() {
                        return this.gameModule
                    }
                    get user() {
                        return this.userModule
                    }
                    get ad() {
                        return this.adModule
                    }
                    get data() {
                        return this.dataModule
                    }
                    get analytics() {
                        return this.analyticsModule
                    }
                    propagateErrors() {
                        window.addEventListener("error", e => {
                            var t;
                            this.postMessage({
                                type: "error",
                                data: {
                                    name: e.error.name || "Error",
                                    message: e.message || "Unknown error",
                                    filename: e.filename || "Unknown file",
                                    lineno: e.lineno || 0,
                                    colno: e.colno || 0,
                                    stack: (null === (t = e.error) || void 0 === t ? void 0 : t.stack) || "No stack trace available",
                                    url: window.location.href
                                }
                            })
                        }), window.addEventListener("unhandledrejection", e => {
                            var t;
                            this.postMessage({
                                type: "error",
                                data: {
                                    name: "UnhandledRejection",
                                    message: e.reason,
                                    stack: null === (t = e.reason) || void 0 === t ? void 0 : t.stack,
                                    url: window.location.href
                                }
                            })
                        })
                    }
                    postMessage(e) {
                        this.logger.verbose("Message to GF", e), d.GF_WINDOW ? d.GF_WINDOW.postMessage(e, "*") : this.logger.log("Missing GF_WINDOW, message won't be sent")
                    }
                }
            },
            710: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AdError = void 0;
                const r = n(833);
                class i extends r.GeneralError {
                    constructor(e, t) {
                        super(e, t), this.code = e, this.message = t
                    }
                }
                t.AdError = i
            },
            771: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getQueryStringValue = function(e) {
                    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(e).replace(/[.+*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"))
                }, t.addStyle = function(e) {
                    const t = document.createElement("style");
                    t.textContent = e, document.head.append(t)
                }, t.loadScript = function(e) {
                    return new Promise((t, n) => {
                        const i = document.createElement("script");
                        i.onload = () => t(), i.onerror = (e, t, i, o, s) => {
                            try {
                                let a = "";
                                a = "string" == typeof e ? e : `type: ${e.type} - target: ${e.currentTarget}`, n(new Error(`LoadScript error. Event [${a}]- source [${t}] - line/column [${i}/${o}] - error [${(0,r.stringifyError)(s)}]`))
                            } catch (e) {
                                n(e)
                            }
                        }, i.src = e, i.async = !0, document.head.appendChild(i)
                    })
                }, t.wrapUserFn = function(e) {
                    return t => {
                        try {
                            e(t)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }, t.isXsollaOrderArgumentValid = function(e) {
                    return !("object" != typeof e || null === e || Array.isArray(e))
                }, t.sendErrorToGf = function(e, t, n) {
                    if (!i.GF_WINDOW) return;
                    const r = {
                        type: "sdkError",
                        data: {
                            errorName: e,
                            module: t,
                            specificValues: n || {}
                        }
                    };
                    i.GF_WINDOW.postMessage(r, "*")
                };
                const r = n(100),
                    i = n(925)
            },
            825: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getContainerInfo = async function(e) {
                    const t = document.getElementById(e);
                    return t ? async function(e) {
                        return new Promise(t => {
                            const r = new IntersectionObserver(([i]) => {
                                const o = window.getComputedStyle(e),
                                    s = i.intersectionRatio > n;
                                t({
                                    visibleState: s ? "visible" : "notVisible",
                                    size: {
                                        width: Math.ceil("auto" !== o.width ? parseFloat(o.width) : i.boundingClientRect.width),
                                        height: Math.ceil("auto" !== o.height ? parseFloat(o.height) : i.boundingClientRect.height)
                                    }
                                }), r.disconnect()
                            });
                            r.observe(e)
                        })
                    }(t): {
                        visibleState: "notCreated",
                        size: {
                            width: 0,
                            height: 0
                        }
                    }
                };
                const n = .95
            },
            833: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.GeneralError = t.INIT_STATE = t.SDKError = t.DOCS_URL = void 0, t.DOCS_URL = "docs.crazygames.com";
                class n extends Error {}
                var r;
                t.SDKError = n,
                    function(e) {
                        e[e.UNINITIALIZED = 0] = "UNINITIALIZED", e[e.REQUESTED = 1] = "REQUESTED", e[e.INITIALIZED = 2] = "INITIALIZED"
                    }(r || (t.INIT_STATE = r = {})), t.GeneralError = class {
                        constructor(e, t) {
                            this.code = e, this.message = t
                        }
                    }
            },
            868: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.GamePerformanceTracker = void 0, t.GamePerformanceTracker = class {
                    constructor(e, t) {
                        var n;
                        this.logger = e, this.sdk = t, this.skipTracking = !1, this.resetSkipTrackingTimeout = null, this.lastFps = 0, this.lastWasmHeapSize = 0, "function" == typeof(null === (n = window.unityGameInstance) || void 0 === n ? void 0 : n.GetMetricsInfo) ? (setTimeout(() => {
                            this.startTracking()
                        }, 5e3), document.addEventListener("visibilitychange", () => {
                            this.resetSkipTrackingTimeout && (clearTimeout(this.resetSkipTrackingTimeout), this.resetSkipTrackingTimeout = null), "visible" === document.visibilityState ? this.resetSkipTrackingTimeout = window.setTimeout(() => {
                                this.skipTracking = !1
                            }, 3e3) : this.skipTracking = !0
                        })) : e.verbose("No window.unityGameInstance.GetMetricsInfo function found, FPSTracker will not run.")
                    }
                    startTracking() {
                        var e;
                        const t = null === (e = window.unityGameInstance) || void 0 === e ? void 0 : e.GetMetricsInfo;
                        setInterval(() => {
                            if (this.skipTracking || this.sdk.ad.isAdPlaying) return;
                            const e = t(),
                                n = Math.round(e.fps) || this.lastFps,
                                {
                                    totalWASMHeapSize: r,
                                    usedWASMHeapSize: i,
                                    totalJSHeapSize: o,
                                    usedJSHeapSize: s
                                } = e,
                                a = Math.abs(n - this.lastFps) >= .1 * this.lastFps,
                                u = this.lastWasmHeapSize !== r;
                            if (a || u) {
                                const e = {
                                    fps: n,
                                    totalWASMHeapSize: r,
                                    usedWASMHeapSize: i,
                                    totalJSHeapSize: o,
                                    usedJSHeapSize: s
                                };
                                this.logger.verbose("Sending game performance event", e, "reasons", {
                                    fpsSignificantChange: a,
                                    wasmHeapSizeChange: u
                                }), this.sdk.postMessage({
                                    type: "analyticsTrackGamePerformance",
                                    data: e
                                }), this.lastFps = n, this.lastWasmHeapSize = r
                            }
                        }, 5e3)
                    }
                }
            },
            888: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.DisabledDataHandler = void 0;
                const r = n(833);
                t.DisabledDataHandler = class {
                    constructor() {
                        this.errorCode = "dataModuleDisabled", this.errorMessage = "The data module is disabled. To enable it, please indicate on the Developer Portal that your game is using it."
                    }
                    clear() {
                        throw new r.GeneralError(this.errorCode, this.errorMessage)
                    }
                    getItem(e) {
                        throw new r.GeneralError(this.errorCode, this.errorMessage)
                    }
                    removeItem(e) {
                        throw new r.GeneralError(this.errorCode, this.errorMessage)
                    }
                    setItem(e, t) {
                        throw new r.GeneralError(this.errorCode, this.errorMessage)
                    }
                }
            },
            896: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.isDefined = function(e) {
                    return null != e
                }, t.nonEmptyString = function(e) {
                    return !!e && "" !== e.trim()
                }
            },
            915: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.DEFAULT_SAVE_INTERVAL_MS = t.MAX_DATA_LENGTH = t.DataError = void 0;
                const r = n(833);
                class i extends r.GeneralError {
                    constructor(e, t) {
                        super(e, t), this.code = e, this.message = t
                    }
                }
                t.DataError = i, t.MAX_DATA_LENGTH = 1048576, t.DEFAULT_SAVE_INTERVAL_MS = 1e3
            },
            916: (e, t) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.MAIN_BADGE = void 0;
                const n = "border-radius: 3px; padding: 0px 4px; color: white;";
                t.MAIN_BADGE = ["%cHTML5 SDK", `background-color: #6842FF; ${n}`];
                class r {
                    constructor(e) {
                        this.badge = e, this.debugFlagPresent = window.location.href.includes("sdk_debug=true")
                    }
                    isEnabled() {
                        return this.debugFlagPresent || r.forceEnable
                    }
                    log(e, ...r) {
                        if (!this.isEnabled()) return;
                        if ("none" === this.badge) return console.log(...t.MAIN_BADGE, e, ...r.length > 0 ? r : []);
                        let i = [];
                        switch (this.badge) {
                            case "game":
                                i = ["%cGAME", `background-color: #d48f06; ${n}`];
                                break;
                            case "user":
                                i = ["%cUSER", `background-color: #3498DB; ${n}`];
                                break;
                            case "ad":
                                i = ["%cAD", `background-color: #008A00; ${n}`];
                                break;
                            case "banner":
                                i = ["%cBANNER", `background-color: #00ABA9; ${n}`];
                                break;
                            case "data":
                                i = ["%cDATA", `background-color: #A21CAF; ${n}`];
                                break;
                            case "analytics":
                                i = ["%cANALYTICS", `background-color: #5c5c5c; ${n}`]
                        }
                        console.log(`${t.MAIN_BADGE[0]}%c ${i[0]}`, t.MAIN_BADGE[1], "", i[1], e, ...r.length > 0 ? r : [])
                    }
                    verbose(e, ...n) {
                        this.isEnabled() && console.debug(`${t.MAIN_BADGE[0]}%c %c${e}`, t.MAIN_BADGE[1], "", "color: #3d7fff", ...n.length > 0 ? n : [])
                    }
                    warn(e, ...n) {
                        this.isEnabled() && console.warn(...t.MAIN_BADGE, e, ...n.length > 0 ? n : [])
                    }
                    error(e, ...n) {
                        console.error(...t.MAIN_BADGE, e, ...n.length > 0 ? n : [])
                    }
                }
                r.forceEnable = !1, t.default = r
            },
            924: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = r(n(916)),
                    o = n(80),
                    s = n(529),
                    a = n(896);
                t.default = class {
                    constructor(e, t, n, r) {
                        this.sdk = e, this._systemInfo = t, this._userAccountAvailable = n, this.user = null, this.authDeferredPromise = null, this.accountLinkDeferredPromise = null, this.authListeners = [], this.userTokenResolvers = [], this.userTokenRequestInProgress = !1, this.xsollaUserTokenRequestInProgress = !1, this.xsollaUserTokenResolvers = [], this.logger = new i.default("user"), this.user = r
                    }
                    get isUserAccountAvailable() {
                        return this.sdk.postMessage({
                            type: "isUserAccountAvailable",
                            data: {}
                        }), !!this._userAccountAvailable
                    }
                    get systemInfo() {
                        return this.sdk.postMessage({
                            type: "getSystemInfo",
                            data: {}
                        }), this._systemInfo
                    }
                    async showAuthPrompt() {
                        if (this.logger.log("Requesting auth prompt"), this.authDeferredPromise) throw new o.UserError("showAuthPromptInProgress", "The auth prompt is already opened");
                        if (this.user) throw new o.UserError("userAlreadySignedIn", "The user is already signed in");
                        return new Promise((e, t) => {
                            this.authDeferredPromise = {
                                resolve: e,
                                reject: t
                            }, this.sdk.postMessage({
                                type: "showAuthPrompt",
                                data: {}
                            })
                        })
                    }
                    handleAuthPromptResponse(e) {
                        this.logger.log("Received auth prompt response", e);
                        const {
                            error: t,
                            user: n
                        } = e;
                        t ? this.authDeferredPromise && this.authDeferredPromise.reject(new o.UserError(t.code, t.message)) : (this.user = null != n ? n : null, this.authDeferredPromise && this.authDeferredPromise.resolve(this.user)), this.authDeferredPromise = null
                    }
                    async showAccountLinkPrompt() {
                        if (this.logger.log("Requesting link account prompt"), this.accountLinkDeferredPromise) throw new o.UserError("showAccountLinkPromptInProgress", "The account link prompt is already displayed");
                        if (!this.user) throw new o.UserError("userNotAuthenticated", "The user is not signed in");
                        return new Promise(async (e, t) => {
                            this.accountLinkDeferredPromise = {
                                resolve: e,
                                reject: t
                            }, this.sdk.postMessage({
                                type: "showAccountLinkPrompt",
                                data: {}
                            })
                        })
                    }
                    handleAccountLinkPromptResponse(e) {
                        this.logger.log("Received account link prompt response", e);
                        const {
                            response: t
                        } = e.data;
                        this.accountLinkDeferredPromise && this.accountLinkDeferredPromise.resolve({
                            response: t
                        }), this.accountLinkDeferredPromise = null
                    }
                    async getUser() {
                        return this.logger.log("Requesting user object"), this.sdk.postMessage({
                            type: "getUser",
                            data: {}
                        }), this.user
                    }
                    async getUserToken() {
                        this.logger.log("Requesting user token"), this.tokenExpiresAtMs && this.tokenExpiresAtMs < Date.now() && (this.logger.log("User token expired, clean it so it is requested again"), this.userToken = null, this.tokenExpiresAtMs = null), this.tokenExpiresAtMs && !this.userTokenRequestInProgress && this.tokenExpiresAtMs - 3e4 < Date.now() && (this.logger.log("User token expires soon, request new one in background"), this.requestNewUserToken());
                        let e = this.userToken;
                        if ((0, a.isDefined)(e) && (0, s.isJsSdkRequestUserTokenSuccessResponse)(e)) return this.logger.log("Returning cached user token"), e.token;
                        if (this.userTokenRequestInProgress ? this.logger.log("User token request to portal in progress") : (this.logger.log("No user token present in the SDK, request one"), this.requestNewUserToken()), await new Promise(e => {
                                this.userTokenResolvers.push(async () => {
                                    e()
                                })
                            }), e = this.userToken, !(0, a.isDefined)(e)) throw this.logger.error("User token missing after portal request finished"), new o.UserError("unexpectedError", "User token missing after portal request finished");
                        if ((0, s.isJsSdkRequestUserTokenErrorResponse)(e)) throw new o.UserError(e.error.code, e.error.message);
                        if (!e.token) throw this.logger.error("User token missing, even though there isn't any error"), new o.UserError("unexpectedError", "User token missing, even though there isn't any error");
                        return e.token
                    }
                    handleUserTokenResponse(e) {
                        this.logger.log("Received token response from portal", e), this.userToken = e, this.userTokenRequestInProgress = !1, (0, s.isJsSdkRequestUserTokenSuccessResponse)(e) && (this.tokenExpiresAtMs = Date.now() + 1e3 * e.expiresIn), this.userTokenResolvers.forEach(e => e()), this.userTokenResolvers = []
                    }
                    requestNewUserToken() {
                        this.logger.log("Requesting user token from portal"), this.sdk.postMessage({
                            type: "requestUserToken",
                            data: {}
                        }), this.userTokenRequestInProgress = !0
                    }
                    async getXsollaUserToken() {
                        this.logger.log("Requesting Xsolla user token"), this.xsollaUserTokenExpiresAtMs && this.xsollaUserTokenExpiresAtMs < Date.now() && (this.logger.log("Xsolla user token expired, clean it so it is requested again"), this.xsollaUserToken = null, this.xsollaUserTokenExpiresAtMs = null), this.xsollaUserTokenExpiresAtMs && !this.xsollaUserTokenRequestInProgress && this.xsollaUserTokenExpiresAtMs - 3e4 < Date.now() && (this.logger.log("Xsolla user token expires soon, request new one in background"), this.requestNewXsollaUserToken());
                        let e = this.xsollaUserToken;
                        if ((0, a.isDefined)(e) && (0, s.isJsSdkRequestXsollaUserTokenSuccessResponse)(e)) return this.logger.log("Returning cached Xsolla user token"), e.token;
                        if (this.xsollaUserTokenRequestInProgress ? this.logger.log("Xsolla user token request to portal in progress") : (this.logger.log("No Xsolla user token present in the SDK, request one"), this.requestNewXsollaUserToken()), await new Promise(e => {
                                this.xsollaUserTokenResolvers.push(async () => {
                                    e()
                                })
                            }), e = this.xsollaUserToken, !(0, a.isDefined)(e)) throw this.logger.error("Xsolla user token response missing after portal request finished"), new o.UserError("unexpectedError", "Xsolla user token missing after portal request finished");
                        if ((0, s.isJsSdkRequestXsollaUserTokenErrorResponse)(e)) throw new o.UserError(e.error.code, e.error.message);
                        if (!e.token) throw this.logger.error("Xsolla user token missing, even though there isn't any error"), new o.UserError("unexpectedError", "Xsolla user token missing, even though there isn't any error");
                        return e.token
                    }
                    handleXsollaUserTokenResponse(e) {
                        this.logger.log("Received Xsolla user token response from portal", e), this.xsollaUserToken = e, this.xsollaUserTokenRequestInProgress = !1, (0, s.isJsSdkRequestXsollaUserTokenSuccessResponse)(e) && (this.xsollaUserTokenExpiresAtMs = Date.now() + 1e3 * e.expiresIn), this.xsollaUserTokenResolvers.forEach(e => e()), this.xsollaUserTokenResolvers = []
                    }
                    requestNewXsollaUserToken() {
                        this.logger.log("Requesting Xsolla user token from portal"), this.sdk.postMessage({
                            type: "requestXsollaUserToken",
                            data: {}
                        }), this.xsollaUserTokenRequestInProgress = !0
                    }
                    addScore(e) {
                        this.logger.warn("addScore is no longer supported.")
                    }
                    addScoreEncrypted(e, t) {
                        this.logger.warn("addScoreEncrypted is no longer supported.")
                    }
                    submitScore(e) {
                        this.sdk.postMessage({
                            type: "submitScore",
                            data: {
                                encryptedScore: e.encryptedScore,
                                requestId: this.generateRequestId()
                            }
                        })
                    }
                    generateRequestId() {
                        return "undefined" != typeof crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2)
                    }
                    handleEvent(e) {
                        switch (e.type) {
                            case "showAuthPromptResponse":
                                this.handleAuthPromptResponse(e);
                                break;
                            case "linkAccountResponse":
                                this.handleAccountLinkPromptResponse(e);
                                break;
                            case "userLoggedIn":
                                this.handleUserLoggedIn(e);
                                break;
                            case "requestUserTokenResponse":
                                this.handleUserTokenResponse(e);
                                break;
                            case "requestXsollaUserTokenResponse":
                                this.handleXsollaUserTokenResponse(e)
                        }
                    }
                    addAuthListener(e) {
                        this.sdk.postMessage({
                            type: "addAuthListener",
                            data: {}
                        }), this.authListeners.push(e)
                    }
                    removeAuthListener(e) {
                        this.sdk.postMessage({
                            type: "removeAuthListener",
                            data: {}
                        }), this.authListeners = this.authListeners.filter(t => t !== e)
                    }
                    handleUserLoggedIn(e) {
                        var t;
                        this.user = null !== (t = e.data.user) && void 0 !== t ? t : null, this.callAuthChangeListeners()
                    }
                    callAuthChangeListeners() {
                        this.authListeners.forEach(e => this.callAuthChangeListener(e))
                    }
                    callAuthChangeListener(e) {
                        try {
                            e(this.user)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            },
            925: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.GF_WINDOW = void 0, t.initSdk = function(e) {
                    return new Promise(n => {
                        const r = window.setTimeout(() => {
                                window.removeEventListener("message", i, !1), (0, a.sendErrorToGf)("gf-init-response-timeout", null, {
                                    timeoutMs: h
                                }), c.error(`Gf Init response timeout ${h}ms`), n(null)
                            }, h),
                            i = async e => {
                                if ("initialized" === e.data.type) {
                                    c.verbose("Received init from GF", e.data), window.clearTimeout(r), window.removeEventListener("message", i, !1);
                                    const t = e.data.data;
                                    n(t)
                                }
                            };
                        window.addEventListener("message", i, !1), t.GF_WINDOW.postMessage({
                            type: "init-js-sdk",
                            data: {
                                version: o.SDK_VERSION,
                                sdkType: "js",
                                ...e
                            }
                        }, "*")
                    })
                }, t.fetchSdkUser = function() {
                    return new Promise(e => {
                        const t = window.setTimeout(() => {
                                window.removeEventListener("message", n, !1), (0, a.sendErrorToGf)("gf-user-response-timeout", null, {
                                    timeoutMs: d
                                }), c.error(`Gf user response timeout ${d}ms, continuing with "null" (signed out) user`), e(null)
                            }, d),
                            n = async r => {
                                var o;
                                if (!(0, i.isGfToSdkEvent)(r.data)) return;
                                const s = r.data;
                                if ("initialUserSet" === s.type) {
                                    l.verbose("Received initial user from GF", s), window.clearTimeout(t), window.removeEventListener("message", n, !1);
                                    const r = null !== (o = s.data.user) && void 0 !== o ? o : null;
                                    e(r)
                                }
                            };
                        window.addEventListener("message", n, !1)
                    })
                }, t.shouldInitLocalMode = function() {
                    return true;
                }, t.checkIsCrazyGames = async function() {
                    let e, n = !1;
                    const r = new Promise(t => {
                            e = t
                        }),
                        i = r => {
                            var i;
                            "crazyGamesGFConfirmation" === (null === (i = null == r ? void 0 : r.data) || void 0 === i ? void 0 : i.type) && (t.GF_WINDOW = r.source, n = !0, e())
                        },
                        o = new Promise(async e => {
                            await (0, u.wait)(f), e()
                        });
                    window.addEventListener("message", i, !1);
                    const s = {
                        type: "checkCrazyGamesGF"
                    };
                    return window.postMessage(s, "*"), window.parent.postMessage(s, "*"), window.parent.parent.postMessage(s, "*"), window.parent.parent.parent.postMessage(s, "*"), await Promise.race([r, o]), window.removeEventListener("message", i), {
                        isOnCrazyGames: n
                    }
                };
                const i = n(220),
                    o = n(672),
                    s = r(n(916)),
                    a = n(771),
                    u = n(643),
                    l = new s.default("user"),
                    c = new s.default("none");
                t.GF_WINDOW = null;
                const h = 5e3,
                    d = 5e3,
                    f = 7e3
            },
            930: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.InnerIdToContainerId = t.ContainerIdToInnerId = void 0, t.getBannerContainer = async function(e, n) {
                    var o;
                    if (!e) throw new r.BannerError("missingId", "Container id not specified", e);
                    const s = await (0, i.getContainerInfo)(e),
                        {
                            visibleState: a
                        } = s;
                    if (n) {
                        if ("notCreated" === a) throw new r.BannerError("notCreated", "Container is not present on the page", e);
                        if ("notVisible" === a) throw new r.BannerError("notVisible", "Container is not entirely visible on the page", e)
                    }
                    const u = (0, t.ContainerIdToInnerId)(e);
                    if (!document.getElementById(u)) {
                        const t = document.createElement("div");
                        t.id = u, t.classList.add("crazygames-banner-container"), null === (o = document.getElementById(e)) || void 0 === o || o.append(t)
                    }
                    return {
                        mainContainerId: e,
                        innerContainerId: u,
                        containerInfo: s
                    }
                }, t.getBannerSizeAsText = function(e) {
                    return `${e.width}x${e.height}`
                };
                const r = n(637),
                    i = n(825);
                t.ContainerIdToInnerId = e => `${e}-crazygames-inner`, t.InnerIdToContainerId = e => `${e}`.replace("-crazygames-inner", "")
            },
            945: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const r = n(833);
                t.default = class {
                    constructor() {
                        this.message = `CrazySDK is disabled on this domain. Check ${r.DOCS_URL} for more info.`, this.code = "sdkDisabled"
                    }
                    get ad() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get banner() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get game() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get user() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get data() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get analytics() {
                        throw new r.GeneralError(this.code, this.message)
                    }
                    get environment() {
                        return "disabled"
                    }
                    get isQaTool() {
                        return !1
                    }
                }
            },
            984: (e, t, n) => {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const r = n(629),
                    i = "https://cza.crazygames.com/event";
                class o {
                    constructor() {
                        this.eventQueue = [], this.initTimedOut = !1
                    }
                    static getInstance() {
                        return o.instance || (o.instance = new o), o.instance
                    }
                    init(e, t) {
                        this.initInfo = t, this.sdk = e, this.sdk.postMessage({
                            type: "requestAnalyticsInfoFromSDK",
                            data: {}
                        }), this.initTimeoutId = window.setTimeout(() => {
                            this.instanceId || (this.initTimedOut = !0, this.eventQueue = [])
                        }, 1e4)
                    }
                    sendDebugEvent(e, t, n) {
                        if (this.initTimedOut) return;
                        const r = {
                            time: Date.now(),
                            version: "3.6.0",
                            source: "sdk",
                            type: "debug",
                            sampling: 1,
                            userId: "",
                            page: "",
                            instanceId: "",
                            gameId: "",
                            buildId: "",
                            name: e,
                            data: JSON.stringify(t)
                        };
                        this.sendEvent(r, n)
                    }
                    handleEvent(e) {
                        "analyticsInfoResponseFromGF" === e.type && (this.initTimeoutId && window.clearTimeout(this.initTimeoutId), this.instanceId = e.instanceId, this.eventQueue.forEach(e => this.sendEvent(e.event, e.filter)), this.eventQueue = [])
                    }
                    sendEvent(e, t) {
                        this.initInfo ? this.safeIdleCallback(() => {
                            var n, i;
                            if (this.initInfo.isQaTool) return;
                            if (t && !t(this.initInfo)) return;
                            const o = {
                                    ...e,
                                    instanceId: this.instanceId,
                                    gameId: null === (n = this.initInfo) || void 0 === n ? void 0 : n.gameId,
                                    buildId: null === (i = this.initInfo) || void 0 === i ? void 0 : i.buildId
                                },
                                s = (0, r.ch)(o);
                            o.__i = s, this.sendData(o)
                        }) : this.eventQueue.push({
                            event: e,
                            filter: t
                        })
                    }
                    async sendData(e) {
                        const t = e,
                            n = async () => {
                                await window.fetch(i, {
                                    method: "post",
                                    body: JSON.stringify(t),
                                    headers: {
                                        "Content-Type": "text/plain"
                                    }
                                })
                            };
                        if (window.navigator) {
                            const e = {
                                    type: "text/plain"
                                },
                                r = new Blob([JSON.stringify(t)], e);
                            if (window.navigator.sendBeacon(i, r)) return Promise.resolve();
                            await n()
                        } else await n()
                    }
                    safeIdleCallback(e) {
                        window.requestIdleCallback ? window.requestIdleCallback(e, {
                            timeout: 2e3
                        }) : window.setTimeout(e, 0)
                    }
                }
                t.default = o
            },
            985: function(e, t, n) {
                "use strict";
                var r = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.BASIC_LAUNCH_AD_DISABLED_ERROR = void 0;
                const i = n(771),
                    o = r(n(916)),
                    s = n(710),
                    a = {
                        adFinished: () => {},
                        adError: () => {},
                        adStarted: () => {}
                    };
                t.BASIC_LAUNCH_AD_DISABLED_ERROR = "Ads are disabled during basic launch", t.default = class {
                    constructor(e, t) {
                        this.sdk = e, this.initInfo = t, this.adCallbacks = a, this.requestInProgress = !1, this.adblockDetectionResolvers = [], this.logger = new o.default("ad"), this.adPlaying = !1, this.adblockPopupListeners = [], this.adblockDetectionTimeout = window.setTimeout(() => {
                            this.logger.log("Adblock timeout executed since there wasn't an adblock event in 5000ms"), this.setAdblockDetectionResult(!1)
                        }, 5e3)
                    }
                    prefetchAd(e) {
                        if ("basic" === this.initInfo.launchFlow) throw new s.AdError("other", t.BASIC_LAUNCH_AD_DISABLED_ERROR);
                        this.logger.log(`Prefetching ${e} ad`), this.sdk.postMessage({
                            type: "prefetchAd",
                            data: {
                                adType: e
                            }
                        })
                    }
                    async requestAd(e, n) {
                        if (this.adCallbacks = {
                                adFinished: (null == n ? void 0 : n.adFinished) || a.adFinished,
                                adError: (null == n ? void 0 : n.adError) || (null == n ? void 0 : n.adFinished) || a.adFinished,
                                adStarted: (null == n ? void 0 : n.adStarted) || a.adStarted
                            }, "basic" === this.initInfo.launchFlow) return (0, i.wrapUserFn)(this.adCallbacks.adError)(new s.AdError("other", t.BASIC_LAUNCH_AD_DISABLED_ERROR));
                        if (this.logger.log(`Requesting ${e} ad`), this.requestInProgress) {
                            this.logger.log("Ad already requested");
                            const e = new s.AdError("other", "An ad request is already in progress");
                            return (0, i.wrapUserFn)(this.adCallbacks.adError)(e)
                        }
                        this.requestInProgress = !0, this.sdk.postMessage({
                            type: "requestAd",
                            data: {
                                adType: e
                            }
                        })
                    }
                    async hasAdblock() {
                        return void 0 !== this.adblockDetectionResult ? this.adblockDetectionResult : (this.sdk.postMessage({
                            type: "hasAdblock",
                            data: {}
                        }), this.logger.log("Requesting adblock status"), new Promise(e => {
                            this.adblockDetectionResolvers.push(e)
                        }))
                    }
                    handleEvent(e) {
                        var t, n;
                        switch (e.type) {
                            case "adblockDetectionExecuted":
                                return this.handleAdBlockDetectionExecutedEvent(e);
                            case "adError":
                                this.requestInProgress = !1;
                                const r = new s.AdError((null === (t = e.errorData) || void 0 === t ? void 0 : t.reason) || "other", (null === (n = e.errorData) || void 0 === n ? void 0 : n.message) || "Unknown message");
                                return this.adPlaying = !1, (0, i.wrapUserFn)(this.adCallbacks.adError)(r);
                            case "adFinished":
                                return this.adPlaying = !1, this.requestInProgress = !1, (0, i.wrapUserFn)(this.adCallbacks.adFinished)();
                            case "adStarted":
                                return this.adPlaying = !0, this.sdk.banner.activeBannersCount > 0 && this.sdk.banner.clearAllBanners(), (0, i.wrapUserFn)(this.adCallbacks.adStarted)();
                            case "adblockPopupShowed":
                                return void this.callAdblockPopupListeners("open")
                        }
                    }
                    handleAdBlockDetectionExecutedEvent(e) {
                        const {
                            hasAdblock: t
                        } = e, n = !!t;
                        if (void 0 !== this.adblockDetectionResult) return this.logger.log(`Received update for adblock state: (${n}).`), void(this.adblockDetectionResult = n);
                        this.setAdblockDetectionResult(n), clearTimeout(this.adblockDetectionTimeout)
                    }
                    setAdblockDetectionResult(e) {
                        this.adblockDetectionResult = e, this.adblockDetectionResolvers.forEach(t => t(e)), this.adblockDetectionResolvers = []
                    }
                    get isAdPlaying() {
                        return this.adPlaying
                    }
                    addAdblockPopupListener(e) {
                        this.adblockPopupListeners.push(e)
                    }
                    removeAdblockPopupListener(e) {
                        this.adblockPopupListeners = this.adblockPopupListeners.filter(t => t !== e)
                    }
                    callAdblockPopupListeners(e) {
                        this.adblockPopupListeners.forEach(t => {
                            try {
                                t(e)
                            } catch (e) {
                                console.error(e)
                            }
                        })
                    }
                }
            }
        },
        t = {};

    function n(r) {
        var i = t[r];
        if (void 0 !== i) return i.exports;
        var o = t[r] = {
            id: r,
            loaded: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.loaded = !0, o.exports
    }
    n.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window) return window
        }
    }(), n.nmd = e => (e.paths = [], e.children || (e.children = []), e), n(156)
})();

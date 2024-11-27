!function(e) {
    var t = {};
    function n(a) {
        if (t[a])
            return t[a].exports;
        var r = t[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        return e[a].call(r.exports, r, r.exports, n),
        r.l = !0,
        r.exports
    }
    n.m = e,
    n.c = t,
    n.d = function(e, t, a) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: a
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var a = Object.create(null);
        if (n.r(a),
        Object.defineProperty(a, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var r in e)
                n.d(a, r, function(t) {
                    return e[t]
                }
                .bind(null, r));
        return a
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 0)
}([function(e, t, n) {
    "use strict";
    n.r(t),
    n.d(t, "runGamesnacksDotTs", (function() {
        return h
    }
    )),
    n.d(t, "GAMESNACKS", (function() {
        return y
    }
    ));
    var a, r = {
        afgSdkUrl: "patch/js/null.js?pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        publisherId: "ca-pub-1725310704471587",
        dataAdFrequencyHint: "120s",
        dataAdbreakTest: "on",
        preloadAdBreaks: "on",
        channelId: "5910243868"
    }, o = {
        type: "GAMESNACKS_ALLOW_REWARDED_ADS",
        value: !0,
        afgName: "testEnvironment"
    }, i = ["test", "production"], s = function() {
        var e = this;
        this.isType = function(t, n) {
            var a = e.validateOrReturnError(t, n);
            return !0 === a || (console.error(a),
            !1)
        }
    }, d = function() {
        var e = this;
        this.isType = function(t, n) {
            return !0 === e.validateOrReturnError(t, n)
        }
    }, u = function(e, t, n) {
        for (var a = 0, r = Object.entries(t); a < r.length; a++) {
            var o = r[a]
              , i = o[0]
              , s = o[1]
              , d = l(e, i, s, n);
            if (!0 !== d)
                return d
        }
        return !0
    }, l = function(e, t, n, a) {
        return typeof e[t] === n || a + ' expects "' + t + '" property of type "' + n + '".'
    }, c = (a = function(e, t) {
        return (a = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var n in t)
                Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
        }
        )(e, t)
    }
    ,
    function(e, t) {
        function n() {
            this.constructor = e
        }
        a(e, t),
        e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype,
        new n)
    }
    ), A = {
        afgSdkUrl: "string",
        publisherId: "string",
        dataAdFrequencyHint: "string",
        dataAdbreakTest: "string",
        preloadAdBreaks: "string",
        channelId: "string"
    }, f = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.validateOrReturnError = function(e, t) {
                return "object" != typeof e ? t + ' expects parameter of type "object".' : u(e, A, t)
            }
            ,
            t
        }
        return c(t, e),
        t.instance = new t,
        t
    }(d), p = {
        type: "string",
        value: "object"
    }, _ = (function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.validateOrReturnError = function(e, t) {
                if ("object" != typeof e)
                    return t + ' expects parameter of type "object".';
                var n = u(e, p, t);
                return !0 !== n ? n : "GAMESNACKS_ADS_INITIALIZE" !== e.type ? t + ' expects property "type" to be "GAMESNACKS_ADS_INITIALIZE"' : f.instance.validateOrReturnError(e.value, t)
            }
            ,
            t
        }
        c(t, e),
        t.instance = new t
    }(d),
    function() {
        var e = function(t, n) {
            return (e = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var n in t)
                    Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
            }
            )(t, n)
        };
        return function(t, n) {
            function a() {
                this.constructor = t
            }
            e(t, n),
            t.prototype = null === n ? Object.create(n) : (a.prototype = n.prototype,
            new a)
        }
    }()), b = {
        beforeReward: "function",
        beforeBreak: "function",
        adComplete: "function",
        adDismissed: "function",
        afterBreak: "function"
    }, S = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.validateOrReturnError = function(e, t) {
                return "object" != typeof e ? t + ' expects parameter of type "object".' : u(e, b, "rewardedAdOpportunity")
            }
            ,
            t
        }
        return _(t, e),
        t.instance = new t,
        t
    }(s), E = function(e) {
        var t = this;
        this.environment = "production",
        this.audioEnabled = !0,
        this.shouldAudioBeEnabledAfterAd = !0,
        this.isAdInProgress = !1,
        this.audioSubscribers = [],
        this.ghostDataSubscriber = null,
        this.adsInitialized = !1,
        this.rewardedAdsAllowed = !1,
        this.rewardedAdName = "",
        this.forceVerbose = !1,
        this.sendScore = function(e, n) {
            void 0 === n && (n = {});
            var a = {
                type: "GAMESNACKS_SCORE_MESSAGE",
                value: void 0,
                score: e,
                scoreMetadata: n
            };
            t.postMessageHandler.send(a)
        }
        ,
        this.gameOver = function() {
            t.postMessageHandler.send({
                type: "gameOver",
                value: !0
            })
        }
        ,
        this.isAudioEnabled = function() {
            return t.notifyGamesnacksOfAudioApiUsage(),
            t.audioEnabled
        }
        ,
        this.subscribeToAudioUpdates = function(e) {
            t.notifyGamesnacksOfAudioApiUsage(),
            t.audioSubscribers.push(e)
        }
        ,
        this.notifyGamesnacksOfAudioApiUsage = function() {
            t.postMessageHandler.send({
                type: "GAMESNACKS_AUDIO_SUBCRIPTION",
                value: !0
            })
        }
        ,
        this.listenAndDelegateMessages = function() {
            t.postMessageHandler.listen("GAMESNACKS_AUDIO_UPDATE", t.handleAudioUpdates),
            t.postMessageHandler.listen("GAMESNACKS_ADS_INITIALIZE", t._initializeAds),
            t.postMessageHandler.listen("GAMESNACKS_ADS_AD_BREAK", t._adBreak),
            t.postMessageHandler.listen("GAMESNACKS_ALLOW_REWARDED_ADS", t._handleRewardedAdsAllowed),
            t.postMessageHandler.listen("GAMESNACKS_DECLARE_TEST_ENVIRONMENT", t._testEnvironment),
            t.postMessageHandler.listen("GAMESNACKS_DECLARE_VERBOSE_MODE", t._handleVerboseMode)
        }
        ,
        this._sendSdkLoadedMessage = function() {
            t.postMessageHandler.send({
                type: "GAMESNACKS_SDK_LOADED",
                value: !0
            })
        }
        ,
        this._initializeAds = function(e) {
            var n = e.value;
            f.instance.isType(n, "GAMESNACKS_ADS_INITIALIZE") ? t._initializeAdsWithValidatedConfig(n) : t._logIfVerbose("Malformatted GS SDK request: initializeAds.")
        }
        ,
        this._initializeAdsWithValidatedConfig = function(e) {
            if (t._logIfVerbose("initialize AdSense with config " + JSON.stringify(e, null, 2)),
            !t.adsInitialized) {
                t.adsInitialized = !0;
                var n = window.document.createElement("script");
                n.setAttribute("data-ad-client", e.publisherId),
                n.setAttribute("data-ad-frequency-hint", e.dataAdFrequencyHint),
                n.setAttribute("src", e.afgSdkUrl),
                "on" === e.dataAdbreakTest && n.setAttribute("data-adbreak-test", "on"),
                e.channelId && n.setAttribute("data-ad-channel", e.channelId),
                window.document.head.appendChild(n),
                window.adsbygoogle = window.adsbygoogle || [],
                window.adBreak = window.adConfig = function(e) {
                    window.adsbygoogle.push(e)
                }
                ,
                window.adConfig({
                    preloadAdBreaks: e.preloadAdBreaks,
                    sound: t._getAdconfigSoundParam()
                })
            }
        }
        ,
        this._getAdconfigSoundParam = function() {
            return t.audioEnabled ? "on" : "off"
        }
        ,
        this._adBreak = function(e) {
            var n = e.value
              , a = {
                type: n.type,
                name: n.name,
                beforeAd: t._beforeBreak,
                afterAd: t._afterBreak,
                adBreakDone: t._adBreakDone
            };
            t._logIfVerbose("calling adbreak."),
            window.adBreak && window.adBreak(a)
        }
        ,
        this._beforeBreak = function() {
            t.postMessageHandler.send({
                type: "GAMESNACKS_ADS_BEFORE_BREAK",
                value: !0
            }),
            t.isAdInProgress = !0,
            t.shouldAudioBeEnabledAfterAd = t.audioEnabled,
            t._changeAudioAndUpdateSubscribers(!1)
        }
        ,
        this._afterBreak = function() {
            t.postMessageHandler.send({
                type: "GAMESNACKS_ADS_AFTER_BREAK",
                value: !0
            }),
            t.isAdInProgress = !1,
            t._changeAudioAndUpdateSubscribers(t.shouldAudioBeEnabledAfterAd)
        }
        ,
        this._adBreakDone = function(e) {
            t._logIfVerbose("adbreakDone called with placementInfo: " + JSON.stringify(e)),
            t.postMessageHandler.send({
                type: "GAMESNACKS_ADS_AD_BREAK_DONE",
                value: e
            })
        }
        ,
        this._checkEnvironmentAttribute = function() {
            var e = document.currentScript && document.currentScript.getAttribute("data-environment");
            "string" == typeof e && (i.includes(e) || console.warn("GameSnacks SDK: Invalid value for data-environment attrbute: " + e),
            "test" === e && t._testEnvironment())
        }
        ,
        this._testEnvironment = function() {
            t.environment = "test",
            t._logIfVerbose("GameSnacks SDK is running in a test environment."),
            t._initializeAdsWithValidatedConfig(r),
            t._handleRewardedAdsAllowed(o),
            t.postMessageHandler.send({
                type: "GAMESNACKS_USING_TEST_ENVIRONMENT",
                value: !0
            })
        }
        ,
        this._handleRewardedAdsAllowed = function(e) {
            t.rewardedAdsAllowed = !0,
            t.rewardedAdName = e.afgName
        }
        ,
        this.rewardedAdOpportunity = function(e) {
            if (S.instance.isType(e, "rewardedAdOpportunity") && t.rewardedAdsAllowed) {
                var n = t
                  , a = {
                    type: "reward",
                    name: t.rewardedAdName,
                    beforeReward: function(t) {
                        n._logIfVerbose("AFG called beforeReward"),
                        e.beforeReward((function() {
                            n._logIfVerbose("Game called showAdFn"),
                            t(),
                            n.postMessageHandler.send({
                                type: "GAMESNACKS_SHOW_REWARDED_AD",
                                value: !0
                            })
                        }
                        )),
                        n.postMessageHandler.send({
                            type: "GAMESNACKS_BEFORE_REWARD",
                            value: !0
                        })
                    },
                    beforeAd: function() {
                        n._logIfVerbose("AFG called beforeAd"),
                        e.beforeBreak()
                    },
                    adViewed: function() {
                        n._logIfVerbose("AFG called adViewed"),
                        e.adComplete(),
                        n.postMessageHandler.send({
                            type: "GAMESNACKS_REWARDED_AD_COMPLETE",
                            value: !0
                        })
                    },
                    adDismissed: function() {
                        n._logIfVerbose("AFG called adDismissed"),
                        e.adDismissed(),
                        n.postMessageHandler.send({
                            type: "GAMESNACKS_REWARDED_AD_DISMISSED",
                            value: !0
                        })
                    },
                    afterAd: function() {
                        n._logIfVerbose("AFG called afterAd"),
                        e.afterBreak()
                    },
                    adBreakDone: function(e) {
                        n._logIfVerbose("AFG called adBreakDone called with placementInfo: " + JSON.stringify(e)),
                        n.postMessageHandler.send({
                            type: "GAMESNACKS_REWARDED_AD_BREAK_DONE",
                            value: e
                        })
                    }
                };
                window.adBreak && window.adBreak(a)
            }
        }
        ,
        this.handleAudioUpdates = function(e) {
            var n;
            "boolean" == typeof e.isAudioEnabled && (n = e.isAudioEnabled),
            "object" == typeof e.value && "boolean" == typeof e.value.isAudioEnabled && (n = e.value.isAudioEnabled),
            t.isAdInProgress ? t.shouldAudioBeEnabledAfterAd = n : (t._changeAudioAndUpdateSubscribers(n),
            window.adConfig && window.adConfig({
                sound: t._getAdconfigSoundParam()
            }))
        }
        ,
        this._changeAudioAndUpdateSubscribers = function(e) {
            t.audioEnabled = e,
            t.updateAudioSubscribers()
        }
        ,
        this.updateAudioSubscribers = function() {
            t.audioSubscribers.forEach((function(e) {
                e(t.audioEnabled)
            }
            ))
        }
        ,
        this._subscribeToGhostData = function(e) {
            t.ghostDataSubscriber = e;
            var n = t;
            window.addEventListener("message", (function(e) {
                e && e.data && "GAMESNACKS_RECEIVE_GHOST_DATA" === e.data.type && n.ghostDataSubscriber(e.data.value)
            }
            ), !1),
            t.postMessageHandler.send({
                type: "GAMESNACKS_SUBSCRIBE_TO_GHOST_DATA",
                value: !0
            })
        }
        ,
        this._gameOverWithGhost = function(e) {
            t.postMessageHandler.send({
                type: "GAMESNACKS_GAME_OVER_WITH_GHOST",
                value: e
            })
        }
        ,
        this.gameReady = function() {
            t.postMessageHandler.send({
                type: "GAMESNACKS_GAME_READY",
                value: Date.now()
            })
        }
        ,
        this.levelComplete = function(e) {
            t.postMessageHandler.send({
                type: "GAMESNACKS_LEVEL_COMPLETE",
                value: e
            })
        }
        ,
        this._handleVerboseMode = function() {
            t.forceVerbose = !0,
            t._logIfVerbose("Entering verbose mode.")
        }
        ,
        this._isVerbose = function() {
            return !0 === t.forceVerbose || "test" === t.environment
        }
        ,
        this._logIfVerbose = function(e) {
            t._isVerbose() && console.log("GameSnacks SDK: " + e)
        }
        ,
        this.postMessageHandler = e,
        this._checkEnvironmentAttribute(),
        this.listenAndDelegateMessages(),
        this._sendSdkLoadedMessage()
    }, g = function() {
        function e() {
            this.listen = function(e, t) {
                window.addEventListener("message", (function(n) {
                    if ("object" == typeof n.data) {
                        var a = n.data;
                        a.type === e && t(a)
                    }
                }
                ))
            }
            ,
            this.send = function(e) {
                parent.postMessage(JSON.stringify(e), "*")
            }
        }
        return e.instance = new e,
        e
    }(), h = function() {}, y = new E(g.instance);
    window.GAMESNACKS = y
}
]);

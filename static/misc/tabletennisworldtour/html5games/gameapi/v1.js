!function(a, b) {

    const SDK_INTERFACE = {

        version: "1.1.0",

        settings: null,
        isSDKInterfaceDone: false,

        AD_STATES: {
            "OFF": 0,
            "IDLE": 1,
            "PRELOADING": 2,
            "READY": 3,
            "PLAYING": 4,
            "CLOSED": 5
        },

        init: function(settings) {

            this.settings = settings || {};

            this.getDebugLevel() && console.log("[init] SDK_INTERFACE %s...", this.version);
            this.getDebugLevel() && console.log(settings);

            if(this.settings.isProd) {
                this.settings.forceMockObject = false;
            }

            this.settings.interstitial.state = null; // initial state
            this.settings.interstitial.last = null; // last ad call

            this.settings.rewarded.state = null; // initial state
            this.settings.rewarded.last = null; // last ad call

            let files = [];
            for(let i = 0; i < this.settings.externalFiles.length; i++) {
                files.push(this.settings.externalFiles[i]);
            }

            let _this = this;

            this.loadFiles(files).then(function() {}, function() {}).finally(function() {

                _this.setFamobiAdapters();

                ["interstitial"].forEach(function(type){

                    if(_this.settings[type].enabled) {

                        _this.setAdState(type, _this.AD_STATES.IDLE);

                        if(_this.settings[type].preload > 0) {
                            setInterval(function() {
                                if(_this.settings[type].enabled) {
                                     _this.preload(type);
                                }
                            }, _this.settings[type].preload);
                        }
                    }
                });

                (_this.settings.forceMockObject ? SDK_INTERFACE_MOCK_OBJECT() : Promise.resolve()).then(
                    function() {
                        _this.getDebugLevel() && console.log("[SDK_INTERFACE] using mock object..." + (!_this.settings.forceMockObject ? "SKIPPED" : "OK"));
                    },
                    function() {
                        _this.getDebugLevel() && console.log("[SDK_INTERFACE] using mock object... FAILED");
                    }).finally(function() {
                        SDK_INTERFACE_INIT().then(
                            function() {
                                _this.getDebugLevel() && console.log("[SDK_INTERFACE] init... OK");
                            },
                            function() {
                                _this.getDebugLevel() && console.log("[SDK_INTERFACE] init... FAILED");
                            }).finally(function() {
                                _this.done();
                            });
                    });
            });
        },
        loadFile: function(src) {

            let _this = this;

            return new Promise(function(resolve, reject) {
                const s = document.createElement('script');
                let r = false;
                s.type = 'text/javascript';
                s.src = src;
                s.async = false;
                s.onerror = function(err) {
                    _this.getDebugLevel() && console.log("[loading] %s... FAILED", src);
                    reject(err, s);
                };
                s.onload = s.onreadystatechange = function() {
                    if (!r && (!this.readyState || this.readyState == 'complete')) {
                        r = true;
                        _this.getDebugLevel() && console.log("[loading] %s... OK", src);
                        resolve();
                    }
                };
                const t = document.getElementsByTagName('script')[0];
                t.parentElement.insertBefore(s, t);
            });
        },
        loadFiles: function(files) {

            let _this = this;
            files = files || [];
            let head;
            let link;

            return new Promise((resolve, reject) => {

                if(!Array.isArray(files)) {
                    reject();
                    return;
                }

                files.push(() => {
                    resolve();
                });

                files.reduce((prev, pSrc) => {

                    return prev.then(() => {
                        return new Promise((resolve,reject) => {
                            let script = document.createElement('script');
                            if(typeof pSrc === "function") {
                                SDK_INTERFACE_SETTINGS.debugLevel && console.debug("calling function...");
                                pSrc();
                                resolve();
                            } else {
                                SDK_INTERFACE_SETTINGS.debugLevel && console.debug("loading %s...", pSrc);

                                switch(pSrc.split('.').pop()) {
                                    case "js":
                                        script.src = pSrc;
                                        document.body.appendChild(script);
                                        script.onload = () => {
                                            resolve();
                                        }
                                        script.onerror = () => {
                                            resolve();
                                        }
                                        break;
                                    case "css":
                                        head  = document.getElementsByTagName('head')[0];
                                        link  = document.createElement('link');

                                        link.rel  = 'stylesheet';
                                        link.type = 'text/css';
                                        link.href = pSrc;

                                        head.appendChild(link);
                                        resolve();
                                        break;
                                    default:
                                        script.src = pSrc;
                                        document.body.appendChild(script);
                                        script.onload = () => {
                                            resolve();
                                        }
                                        script.onerror = () => {
                                            resolve();
                                        }
                                };
                            }
                        });
                    });
                }, Promise.resolve());
            });
        },
        _showAd: function(callback, force, isInitial) {

            let type = "interstitial";

            this.getDebugLevel() && console.log("[famobi] showAd");

            const doCallback = function() {
                if(typeof callback == "function") {
                    callback();
                }
            };

            if(this.getAdState(type) !== this.AD_STATES.READY) {
                this.getDebugLevel() && console.log("[famobi] showAd SKIPPED (state: %s)", this.getAdState(type));
                doCallback();
                return;
            }

            if(!this.hasCooledDown()) {
                this.getDebugLevel() && console.log("[famobi] showAd SKIPPED");
                doCallback();
                return;
            }

            this.setAdState(type, this.AD_STATES.PLAYING);

            if(isInitial !== true) {
                this.pauseGame();
            }

            let _this = this;

            setTimeout(function() {

                _this.getDebugLevel() && console.log("SDK_INTERFACE_SHOW_AD()");
                SDK_INTERFACE_SHOW_AD(force, isInitial).then(
                    function() {
                        _this.getDebugLevel() && console.log("OK");
                        if(isInitial !== true) {
                            _this.settings[type].last = new Date();
                        }
                    },
                    function(e) {
                        _this.getDebugLevel() && console.log("FAILED", e);
                }).finally(function() {
                    _this.setAdState(type, _this.AD_STATES.CLOSED);
                    setTimeout(function() {
                        _this.setAdState(type, _this.AD_STATES.IDLE);
                    }, 500);

                    setTimeout(function() {
                        _this.resumeGame();
                        doCallback();
                    }, _this.settings[type].timeout);
                });
            }, _this.settings[type].timeout);
        },
        _rewardedAd: function(callback) {

            let result = {rewardGranted: this.settings.rewarded.reward, adDidLoad: true, adDidShow: true},
                type = "rewarded";

            this.getDebugLevel() && console.log("[famobi] rewardedAd");

            const doCallback = function() {
                if(typeof callback == "function") {
                    callback(result);
                }
            };

            if(this.getAdState(type) !== this.AD_STATES.READY) {
                this.getDebugLevel() && console.log("[famobi] rewardedAd SKIPPED (state: %s)", this.getAdState(type));
                doCallback();
                return;
            }

            if(!this.hasCooledDown(type)) {
                this.getDebugLevel() && console.log("[famobi] rewardedAd SKIPPED");
                doCallback();
                return;
            }

            this.setAdState(type, this.AD_STATES.PLAYING);
            this.pauseGame();

            let _this = this;

            setTimeout(function() {

                _this.getDebugLevel() && console.log("SDK_INTERFACE_REWARDED_AD()");
                SDK_INTERFACE_REWARDED_AD().then(
                    function(rewardGranted) {
                        _this.settings[type].last = new Date();
                        _this.getDebugLevel() && console.log("OK");
                        result.rewardGranted = rewardGranted;
                    },
                    function(e) {
                        _this.getDebugLevel() && console.log("FAILED", e);

                }).finally(function() {
                    _this.setAdState(type, _this.AD_STATES.CLOSED);
                    setTimeout(function() {
                        _this.setAdState(type, _this.AD_STATES.IDLE);
                    }, 500);

                    setTimeout(function() {
                        _this.resumeGame();
                        doCallback();
                    }, _this.settings[type].timeout);
                });
            }, _this.settings[type].timeout);

        },
        _hasRewardedAd: function() {
            return this.settings.rewarded.state === this.AD_STATES.READY && this.hasCooledDown("rewarded");
        },
        pauseGame: function() {
            this.getDebugLevel() && console.log("[famobi] game.pause... OK");
            window.famobi.game.pause();
        },
        resumeGame: function() {
            if(window.famobi.game.canResume()) {
                this.getDebugLevel() && console.log("[famobi] game.resume... OK");
                window.famobi.game.resume();
            } else {
                this.getDebugLevel() && console.log("[famobi] game.resume... SKIPPED");
            }
        },
        preload: function(type) {

            type = type || "interstitial";

            if(this.settings[type].state !== this.AD_STATES.IDLE) {
                return;
            }

            this.settings[type].fails = this.settings[type].fails || 0;
            this.settings[type].attempts = this.settings[type].attempts || 0;

            if(this.settings[type].attempts > 0 && this.settings[type].fails >= this.settings[type].attempts) {
                return;
            }

            this.setAdState(type, this.AD_STATES.PRELOADING);

            let _this = this;

            SDK_INTERFACE_PRELOAD_AD(type).then(
                function() {
                    _this.settings[type].fails = 0;
                    _this.getDebugLevel() && console.log("[%s] preloading... OK", type);
                    _this.setAdState(type, _this.AD_STATES.READY);
                },
                function() {
                    _this.settings[type].fails++;
                    _this.getDebugLevel() && console.log("[%s] preloading... FAILED (attempt: %s)", type, _this.settings[type].fails);
                    _this.setAdState(type, _this.AD_STATES.CLOSED);

                    setTimeout(function() {
                        _this.setAdState(type, _this.AD_STATES.IDLE);
                    }, _this.settings[type].retry);
                }
            );
        },
        setFamobiAdapters: function() {

            let _this = this;

            window.famobi_adapters = {
                "api": {
                    "created": function() {
                        _this.overwrite();

                        if(window.famobi.hasFeature("rewarded")) {
                            ["rewarded"].forEach(function(type){

                                if(_this.settings[type].enabled) {

                                    _this.setAdState(type, _this.AD_STATES.IDLE);

                                    if(_this.settings[type].preload > 0) {
                                        setInterval(function() {
                                            _this.preload(type)
                                        }, _this.settings[type].preload);
                                    }
                                }
                            });
                        }
                    }
                }
            };
        },
        getDebugLevel: function() {
            return this.settings.debugLevel;
        },
        setAdState: function(type, state) {
            this.getDebugLevel() && console.log("[%s] changed state: %s", type, Object.keys(this.AD_STATES)[state]);
            this.settings[type].state = state;
        },
        getAdState: function(type) {
            type = type || "interstitial";
            return this.settings[type].state;
        },
        hasCooledDown: function(type) {

            type = type || "interstitial";

            if(!(this.settings[type].last && this.settings[type].cooldown >= 0)) {
                return true;
            }

            const adTimeInterval = this.settings[type].cooldown;
            const lastAdCalled = Math.round((Date.now() - this.settings[type].last) / 1000);

            if(lastAdCalled >= adTimeInterval) {
                return true;
            } else {
                this.getDebugLevel() && console.log("[%s/cooldown]: %s seconds left", type, (adTimeInterval - lastAdCalled));
                return false;
            }
        },
        overwrite: function() {

            let _this = this;

            // window.famobi
            if(typeof window.famobi !== "undefined") {

                Object.keys(SDK_INTERFACE_OVERRIDES.famobi).forEach(function(fnc) {
                    if(["showAd", "rewardedAd", "hasRewardedAd"].includes(fnc)) {
                        _this.getDebugLevel() && console.warn("[overwrite] famobi.%s... SKIPPED", fnc);
                    } else {
                        _this.getDebugLevel() && console.log("[overwrite] famobi.%s... OK", fnc);
                        window.famobi[fnc] = SDK_INTERFACE_OVERRIDES.famobi[fnc];
                    }
                });

                window.famobi.showAd = SDK_INTERFACE._showAd.bind(SDK_INTERFACE);
                window.famobi.rewardedAd = SDK_INTERFACE._rewardedAd.bind(SDK_INTERFACE);
                window.famobi.hasRewardedAd = SDK_INTERFACE._hasRewardedAd.bind(SDK_INTERFACE);
            }

            // window.famobi_analytics
            let intervalAnalytics = setInterval(function() {
                if(typeof window.famobi_analytics !== "undefined") {
                    clearInterval(intervalAnalytics);

                    Object.keys(SDK_INTERFACE_OVERRIDES.famobi_analytics).forEach(function(fnc) {
                        _this.getDebugLevel() && console.log("[overwrite] famobi_analytics.%s... OK", fnc);
                        window.famobi_analytics[fnc] = SDK_INTERFACE_OVERRIDES.famobi_analytics[fnc];
                    });
                }
            }, 500);
        },
        done: function() {
            this.isSDKInterfaceDone = true;
        }
    }
    b[a] = SDK_INTERFACE;
}('SDK_INTERFACE', window);

const loadScript = function(src) {
    return new Promise(function(resolve, reject) {
        const s = document.createElement('script');
        let r = false;
        s.type = 'text/javascript';
        s.src = src;
        s.async = true;
        s.onerror = function(err) {
            reject(err, s);
        };
        s.onload = s.onreadystatechange = function() {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                resolve();
            }
        };
        const t = document.getElementsByTagName('script')[0];
        t.parentElement.insertBefore(s, t);
    });
};

window.famobi_tracking = window.famobi_tracking || {
    init: function() {},
    trackEvent: function() {},
    EVENTS: {
        'LEVEL_START'   : 'event/level/start',
        'LEVEL_END'     : 'event/level/end',
        'LEVEL_UPDATE'  : 'event/level/update',
        'PING'          : 'event/ping',
        'AD'            : 'event/ad'
    }
};

if (typeof window !== "undefined" && !window.famobi) {
    ! function(a, b) {
        var famobi = {

                orientationChangeCallback: null,
                brandingLogo: null,
                config: null,
                reached_home: false,
                splashComplete: false,
                volume: 1.0,

                init: function() {

                    return new Promise(function(resolve, reject) {

                        // famobi.json
                        if(!this.config) {
                            readTextFile("famobi.json", function(text){

                                var data = JSON.parse(text);
                                data = data.offlinizer || data;

                                data.game_i18n = data.game_i18n || {};
                                this.config = data;

                                if(typeof SDK_INTERFACE_SETTINGS !== "undefined") {

                                    // ads
                                    this.config.ads = {};
                                    if("interstitial" in SDK_INTERFACE_SETTINGS) {
                                        this.config.ads.show_initial = !!SDK_INTERFACE_SETTINGS.interstitial.enabled && !!SDK_INTERFACE_SETTINGS.interstitial.initial;
                                    }

                                    if("features" in SDK_INTERFACE_SETTINGS) {
                                        let features = Object.keys(SDK_INTERFACE_SETTINGS.features);
                                        for(let i = 0; i < features.length; i++) {
                                            this.config.features[features[i]] = SDK_INTERFACE_SETTINGS.features[features[i]];
                                        }
                                    }
                                }

                                if(SDK_INTERFACE_SETTINGS.disable_console) {
                                    window.console = {
                                        log: function() {},
                                        warn: function() {},
                                        info: function() {},
                                        error: function() {},
                                        debug: function() {}
                                    };
                                }

                                this.log("init...");

                                this.game.init();

                                this.includeCSS("html5games/gameapi/v1/play.css");

                                // include css files
                                for(var i = 0; this.config.includeCSS && i < this.config.includeCSS.length; i++) {
                                    this.includeCSS(this.config.includeCSS[i]);
                                }

                                if(window.famobi_gameJS && window.famobi_gameJS.length) {
                                    if(typeof window.famobi_gameJS[window.famobi_gameJS.length - 1] == "string") {
                                        window.famobi_gameJS.push(function(){});
                                    }
                                }

                                window.famobi_gameJS.unshift("html5games/gameapi/fenster.js");
                                window.famobi_gameJS.unshift("html5games/gameapi/famobi_analytics_v1.js");
                                window.famobi_gameJS.unshift("html5games/gameapi/detection.js");
                                window.famobi_gameJS.unshift("html5games/gameapi/zepto.min.js");

                                // js files
                                for(var i = 0; this.config.includeJS && i < this.config.includeJS.length; i++) {
                                    window.famobi_gameJS.unshift(this.config.includeJS[i]);
                                }

                                // orientation change
                                window.addEventListener("orientationchange", function() {
                                    if (typeof this.orientationChangeCallback == "function") {
                                        this.orientationChangeCallback();
                                    }
                                }.bind(this), false);

                                // aid
                                var aid = this.getUrlParams()["fg_aid"];

                                window.famobi_multiplayer = this.config.features.multiplayer || false;

                                this.config.gameParams = this.config.gameParams || {};

                                window.addEventListener("famobi_tracking_screen", function(e) {
                                    if(this.config.autoShowMenuScreens && this.config.autoShowMenuScreens.includes(e.detail.screen)) {

                                        this.reached_home = true;
                                        setTimeout(function() {
                                            if(this.splashComplete) {
                                                window.famobi.menu.show();
                                            }
                                        }, 1000);
                                    }
                                });

                                if(SDK_INTERFACE_SETTINGS && SDK_INTERFACE_SETTINGS.show_splash) {

                                    SDK_INTERFACE_SETTINGS.splash_duration = SDK_INTERFACE_SETTINGS.splash_duration || -1;

                                    this.showSplashScreen(function() {
                                        this.splashComplete = true;
                                        if(this.reached_home) {
                                            window.famobi.menu.show();
                                        }
                                    }, SDK_INTERFACE_SETTINGS.splash_duration < 0);
                                }

                                var getGameTitle = function() {
                                    String.prototype.replaceAll = function(search, replacement) {
                                        var target = this;
                                        return target.split(search).join(replacement);
                                    };
                                    function toTitleCase(str) {
                                        return str.replace(/\w\S*/g, function(txt){
                                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                        });
                                    }
                                    return toTitleCase(window.famobi_gameID.replaceAll("-", " "));
                                };

                                // document.title = this.config.title || getGameTitle();

                                // ads
                                this.ads.init();

                                // logging tracking events
                                this.adapters.add("analytics", "trackStats", function(key, value) {

                                    if(!window.famobi.config.logging) return;

                                    console.log(
                                        "%c " + key + " %c (trackStats)",
                                        "background: #333333; color: white; display: block;",
                                        ""
                                    );
                                    if(value) console.log(value);
                                });

                                this.adapters.add("analytics", "trackEvent", function(event, params) {
                                    if(event == "EVENT_LIVESCORE" || !window.famobi.config.logging) {
                                        return;
                                    }
                                    console.log(
                                        "%c " + event + " %c (trackEvent)",
                                        "background: #0092c3; color: white; display: block;",
                                        ""
                                    );
                                    if(params) console.log(params);
                                });

                                this.adapters.add("analytics", "trackScreen", function(screen, pageTitle) {

                                    if(!window.famobi.config.logging) return;

                                    console.log(
                                        "%c " + screen + " %c (trackScreen)",
                                        "background: #f08119; color: white; display: block;",
                                        ""
                                    );
                                    if(pageTitle) console.log("pageTitle: " + pageTitle);
                                });

                                resolve((window.famobi_gameID === "running-jack") ? false : true);

                            }.bind(this));
                        }

                        function readTextFile(file, callback) {
                            var rawFile = new XMLHttpRequest();
                            rawFile.overrideMimeType("application/json");
                            rawFile.open("GET", file, true);
                            rawFile.onreadystatechange = function() {
                                if (rawFile.readyState === 4 && rawFile.status == "200") {
                                    callback(rawFile.responseText);
                                }
                            };
                            rawFile.send(null);
                        }
                    }.bind(this));
                },

                showInterstitialAd: function(force, isInitial) {

                    var _this = this;
                    return new Promise(function(resolve, reject) {
                        _this.showAd(function() {
                            resolve();
                        }, force, isInitial);
                    });
                },

                forceAd: function(callback) {

                    this.showAd(callback, true);
                },

                rewardedAd: function(callback) {

                    if(!this.hasFeature("rewarded")) {
                        this.log("rewarded ads: not supported");
                        if (typeof callback == "function") {
                            callback(this.rewardedads.defaultReturnValue);
                        }
                        return;
                    }

                    if(!this.hasRewardedAd()) {
                        this.log("rewarded ads: not supported");
                        if (typeof callback == "function") {
                            callback(this.rewardedads.defaultReturnValue);
                        }
                        return;
                    }

                    this.rewardedads.show().then(function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        return;
                    })
                },

                showAd: function(callback, force) {

                    if(!!this.config.ads.off) {

                        this.log("ads: off");

                        if (typeof callback == "function") {
                            callback();
                        }
                        return;
                    }

                    if(force !== true && !this.ads.hasCooledDown()) {

                        this.log("skipping ad...");

                        if (typeof callback == "function") {
                            callback();
                        }
                        return;
                    }


                    this.ads.adcount++;
                    this.ads.lastAdCall = Date.now();
                    this.game.pause();

                    this.log("showing ad...");
                    this.ads.show(this.ads.show_initial && this.ads.adcount == 1).then(function() {

                        this.log("ad finished");

                        if (typeof callback == "function") {
                            callback();
                        }

                        setTimeout(function() {
                            this.game.resume();
                        }.bind(this), 100);
                    }.bind(this));
                },

                rewardedads: {
                    lastAdCall: Date.now(),
                    adcount: 0,
                    defaultReturnValue: {
                        "adType": "rewarded",
                        "adDidLoad": false,
                        "adDidShow": false,
                        "adCount": 0,
                        "rewardGranted": false
                    },

                    init: function() {
                        var self = window.famobi;
                        // todo
                    },
                    hasCooledDown: function() {
                        return true;
                    },
                    show: function() {
                        var self = window.famobi;
                        return new Promise(function(resolve, reject) {
                            setTimeout(function() {
                                resolve({
                                    "adType": "rewarded",
                                    "adDidLoad": true,
                                    "adDidShow": true,
                                    "adCount": self.rewardedads.adcount,
                                    "rewardGranted": true
                                });
                            }, 0);
                        });
                    }
                },
                ads: {
                    lastAdCall: Date.now(),
                    adcount: 0,
                    off: true,
                    show_initial: false,
                    min_s_before: 10,
                    min_s_between: 90,

                    init: function() {

                        var self = window.famobi;
                        self.config.ads = self.config.ads || {};
                        this.lastAdCall = Date.now();
                        this.off = self.config.ads.off === false ? false : true;
                        this.show_initial = self.config.ads.show_initial || false;
                        this.min_s_before = self.config.ads.min_s_before || 10;
                        this.min_s_between = self.config.ads.min_s_between || 90;
                    },
                    hasCooledDown: function() {
                        var min_s_between =
                            this.adcount === 0 && +this.min_s_before > 0
                                ? +this.min_s_before
                                : +this.min_s_between;

                        var ret = Date.now() - min_s_between * 1000 > this.lastAdCall;
                        return ret;
                    },
                    show: function(isInitial) {

                        var self = window.famobi;
                        if(isInitial) {
                            self.log("initial ad");
                        }
                        return new Promise(function(resolve, reject) {
                            setTimeout(function() {
                                resolve();
                            }, 0);
                        });
                    }
                },

                // Localization
                gametranslation: {

                    init: function() {
                        window.famobi.gametranslation.curLangString = window.famobi.gametranslation.getUserLang();

                        // Always fall back to 'en' when the user locale is not supported or translated
                        if (window.famobi.gametranslation.getSupportedLanguages().indexOf(window.famobi.gametranslation.curLangString) === -1) {
                            window.famobi.gametranslation.curLangString = "en";
                        }

                        window.famobi.gametranslation.translationData = window.famobi.gametranslation.getGameTranslations();

                        window.famobi.gametranslation.translateHtml(faZepto("body"));
                    },

                    getSupportedLanguages: function() {
                        return window.famobi.config.languages || Object.keys(window.famobi.config.game_i18n) || [];
                    },

                    getGameTranslations: function() {
                        var i18n = window.famobi.config.game_i18n,
                            lang = window.famobi.gametranslation.curLangString;

                        if (i18n.current) {
                            return i18n.current;
                        }

                        faZepto.each(i18n, function(language, translations) {
                            faZepto.each(translations, function(key, value) {
                                if (value == null) {
                                    i18n[language][key] = "";
                                } else if (typeof i18n[language][key] === "string") {
                                    i18n[language][key] = value.replace(/\{lang\}/g, language);
                                }
                            });
                        });

                        i18n.current = faZepto.extend(
                            {},
                            i18n["default"],
                            i18n[window.famobi.config.aid + ".default"],
                            i18n[lang],
                            i18n[window.famobi.config.aid + "." + lang]
                        );

                        return (window.famobi.config.game_i18n.current = i18n.current);
                    },

                    translateString: function(key) {
                        return window.famobi.gametranslation.translationData.hasOwnProperty(key)
                            ? window.famobi.gametranslation.translationData[key]
                            : null;
                    },

                    getNavigatorLocale: function() {
                        var language = "";

                        if (navigator.languages && window.famobi.sizeOf(navigator.languages)) {
                            language = navigator.languages[0];
                        } else if (navigator.language) {
                            language = navigator.language;
                        } else if (navigator.userLanguage) {
                            language = navigator.userLanguage;
                        } else if (navigator.browserLanguage) {
                            language = navigator.browserLanguage;
                        }

                        return language;
                    },

                    getNavigatorLanguage: function() {
                        return window.famobi.gametranslation.getNavigatorLocale().substr(0, 2);
                    },

                    getUserLang: function() {
                        var urlParams = window.famobi.getUrlParams(),
                            lang = window.famobi.gametranslation.getNavigatorLanguage();

                        if (urlParams.locale && urlParams.locale.length == 2) {
                            return urlParams.locale;
                        }

                        switch (lang) {
                            case "ch":
                            case "at":
                                return "de";
                            default:
                                return lang;
                        }
                    },

                    translateHtml: function($selector) {
                        $selector.find("[data-i18n]").each(function() {
                            var textkey = this.getAttribute("data-i18n");
                            this.innerHTML = window.famobi.gametranslation.translateString(textkey);
                        });
                        return $selector;
                    }
                },

                __: function(key) {

                    switch(key) {
                        case "test_preload_image":
                            return "html5games/images/testPreloadImage.png";
                        case "preload_image":
                            return "html5games/images/" + (this.config.preload_image || "preloadImage") + ".png";
                        case "more_games_image":
                            return this.getBrandingButtonImage();
                        default:
                            // do nothing
                    }

                    var lang = this.getCurrentLanguage();

                    if(this.config.game_i18n) {

                        if(this.config.game_i18n[lang]) {
                            this.config.game_i18n[lang] = Object.assign(this.config.game_i18n[lang], this.config.game_i18n[this.config.aid+"."+lang]);
                        }

                        if(this.config.game_i18n[lang] && this.config.game_i18n[lang][key]) {
                            if(typeof this.config.game_i18n[lang][key] === "string") {
                                return this.config.game_i18n[lang][key].replace("{lang}", lang);
                            }
                            return this.config.game_i18n[lang][key];
                        }

                        if(this.config.game_i18n.default) {
                            this.config.game_i18n.default = Object.assign(this.config.game_i18n.default, this.config.game_i18n[this.config.aid+".default"]);
                        }

                        if(this.config.game_i18n.default && this.config.game_i18n.default[key]) {
                            if(typeof this.config.game_i18n.default[key] === "string") {
                                return this.config.game_i18n.default[key].replace("{lang}", lang);
                            }
                            return this.config.game_i18n.default[key];
                        }
                    }

                    this.warn("No translation found for '" + key + "'");
                    return null;
                },

                getCurrentLanguage: function() {

                    let locale = "";
                    let lang = "";

                    try{
                        locale = new URL(window.location.href).searchParams.get("locale");
                    } catch(e) {
                        console.error(e);
                    }

                    try{
                        lang = new URL(window.location.href).searchParams.get("lang");
                    } catch(e) {
                        console.error(e);
                    }

                    return lang || locale || (navigator.language || navigator.userLanguage).substr(0, 2);
                },

                showSplashScreen: function(pCallback, pShowTill_EVENT, pModal) {
                  if(!document.getElementById("famobi_splash")) {
                    //Splash Screen doesn't exist yet - Creating new Splash Screen from files in html5games/splash
                    function readSplashFile(file, callback) {
                        var rawFile = new XMLHttpRequest();
                        rawFile.overrideMimeType("application/xhtml+xml");
                        rawFile.open("GET", file, true);
                        rawFile.onreadystatechange = function() {
                            if (rawFile.readyState === 4 && rawFile.status == "200") {
                                callback(rawFile.responseText);
                            }
                        };
                        rawFile.send(null);
                    }
                    readSplashFile("html5games/splash/splash.html",(response)=>{
                      this.includeCSS("html5games/splash/splash.css");
                      let splashScreen = document.createElement("div");
                      splashScreen.classList.add("splash-screen");
                      splashScreen.style.position = "absolute";
                      splashScreen.style.top = "0";
                      splashScreen.style.left = "0";
                      splashScreen.style.width = "100%";
                      splashScreen.style.height = "100%";
                      splashScreen.innerHTML = response;
                      if(this.config.preload_image)splashScreen.querySelector(".logo").src = "html5games/images/"+this.config.preload_image+".png";
                      document.body.appendChild(splashScreen);
                      this.splashScreen = splashScreen;
                      if(pModal) return;      //Show Modal does not define a closing condition and will keep the splash visible untill hideSplash is called manually
                      if(!pShowTill_EVENT) {
                        setTimeout(()=>this.hideSplashScreen(pCallback),SDK_INTERFACE_SETTINGS.splash_duration);
                      } else {
                        window.addEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                      }
                    });
                  }
                  else {
                    //Splash Screen already exists, just need to reenable it.
                    splashScreen.style.display = "block";
                    splashScreen.style.animation = splashScreen._orgAni;
                    if(pModal) return;      //Show Modal does not define a closing condition and will keep the splash visible untill hideSplash is called manually
                    if(!pShowTill_EVENT) {
                      setTimeout(()=>this.hideSplashScreen(pCallback),SDK_INTERFACE_SETTINGS.splash_duration);
                    } else {
                      window.removeEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                      window.addEventListener(pShowTill_EVENT,()=>this.hideSplashScreen(pCallback));
                    }
                  }
                },

                hideSplashScreen: function(pCallback) {
                  this.splashScreen.style.display = "none";
                  if(!this.splashScreen._orgAni)this.splashScreen._orgAni = this.splashScreen.style.animation;  //This saves the original animation - this is required to be able to rerun the animation the next time the splash is shown
                  this.splashScreen.style.animation = "none";
                  if(pCallback)pCallback(this.splashScreen);
                },

                getAbsolutePath: function(relativePath) {
                    var absolutePath =
                        document.location.protocol + "//" + document.location.pathname;

                    // this method is only used for compatibility with Loaders in Cordova Apps,
                    // otherwise absolute URIs with https://games.cdn.famobi.com are used
                    if (document.location.protocol !== "file:") {
                        return relativePath;
                    }

                    if (relativePath.startsWith("/")) {
                        relativePath = relativePath.substr(1);
                    }

                    return (
                        absolutePath.substr(0, absolutePath.lastIndexOf("/") + 1) + relativePath
                    );
                },

                menu: {
                    create: function() {

                        window.famobi.menu = this;

                        window.famobi.menu.rootElement = document.getElementById("fg-root");
                        window.famobi.menu.bodyElement = document.getElementsByTagName("body")[0];
                        window.famobi.menu.headElement = document.getElementsByTagName("head")[0];

                        if (!window.famobi.menu.rootElement) {
                            window.famobi.menu.rootElement = document.createElement("div");
                            window.famobi.menu.rootElement.setAttribute("id", "fg-root");
                            window.famobi.menu.rootElement.classList.add("fg_root");
                            window.famobi.menu.rootElement.style = "color: #999;font-weight:normal;";

                            document.body.insertBefore(window.famobi.menu.rootElement, document.body.firstChild);
                        }

                        // overlay
                        window.famobi.menu.fgOverlay = document.createElement("div");
                        window.famobi.menu.fgOverlay.setAttribute("id","fg-overlay");

                        if (window.famobi.config.overlay_position)
                            window.famobi.menu.fgOverlay.className =
                                "overlay-" +
                                window.famobi.config.overlay_position +
                                " clip-" +
                                window.famobi.config.overlay_position;

                        if (
                            window.famobi.config.overlay_distance &&
                            window.famobi.config.overlay_distance !== ""
                        ) {
                            if (
                                window.famobi.config.overlay_position &&
                                window.famobi.config.overlay_position == "bottom"
                            )
                                window.famobi.menu.fgOverlay.style.bottom = isNaN(
                                    window.famobi.config.overlay_distance
                                )
                                    ? window.famobi.config.overlay_distance
                                    : window.famobi.config.overlay_distance + "px";
                            else
                                window.famobi.menu.fgOverlay.style.top = isNaN(
                                    window.famobi.config.overlay_distance
                                )
                                    ? window.famobi.config.overlay_distance
                                    : window.famobi.config.overlay_distance + "px";
                        }

                        window.famobi.menu.rootElement.appendChild(window.famobi.menu.fgOverlay);

                        window.famobi.menu.fgOverlay.innerHTML = '<header id="fg-header"><div class="fg-clip" id="fg-clip"><div class="fg-clip-btn"><span></span></div></div></header>';

                        window.famobi.menu.fgNavigation = document.createElement("nav");
                        window.famobi.menu.fgNavigation.style.position = "relative";
                        window.famobi.menu.fgNavigation.setAttribute("id", "fg-navigation");

                        window.famobi.menu.fgOverlay.appendChild(window.famobi.menu.fgNavigation);
                        window.famobi.menu.fgOverlay_visible = false;
                        window.famobi.menu.fgHeader = document.getElementById("fg-header");

                        faZepto("#fg-clip, #fg-logo").each(function() {
                            window.famobi.menu.handleClick(this, window.famobi.menu.toggleOverlay);
                        });

                        let currlang = window.famobi.getCurrentLanguage();
                        //console.log("currlang: "+currlang);

                        let langButtons = "";

                        if(window.famobi.config.supportedLanguages && window.famobi.config.supportedLanguages.length > 1) {

                            langButtons = '<ul class="fg-langs">';
                            let lang = "";

                            for(let i = 0; i < window.famobi.config.supportedLanguages.length; i++) {
                                lang = window.famobi.config.supportedLanguages[i];
                                langButtons +=
                                `<li class="${(lang == currlang) ? 'fg-lang fg-lang-selected' : 'fg-lang'}" data-switch-lang="${lang}" style="cursor: pointer;">
                                <a href="javascript:void(0);">
                                  <img class="fg-flag" src="html5games/images/flags/flag_${lang}.png" alt="${lang}">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 841.9 459" xml:space="preserve">
                                      <path d="M630.7,227.3"></path>
                                      <path d="M21.5,17.9c-3.9,0-7.4,2.3-8.9,6c-1.6,3.7-0.6,7.8,2.1,10.5l399.7,399.7c1.9,1.9,4.5,2.9,6.8,2.9c2.3,0,5.1-1,6.8-2.9 L827.4,34.7c2.7-2.5,3.7-6.8,2.1-10.7c-1.6-3.7-5.1-6-8.9-6H21.5z"></path>
                                    </svg>
                                  </a>
                                </li>`;
                            }
                            langButtons += '</ul>';
                        }

                        //console.log(window.famobi.config.game_i18n);

                        let menuButtons = (window.famobi.hasFeature("highscores")) ?
                        `<ul class="fa-menu-buttons">
                          <li data-famobi-href="leaderboard">
                            <a href="javascript:void(0);" class="fa-menu-button-leaderboard">
                              <img src="html5games/images/leaderboard2.svg" alt="leaderboard">
                            </a>
                          </li>
                         </ul>` :
                        "";

                        var menuHtml =
                        `${menuButtons}
                        <ul class="fg-related-games">
                          <li>
                            <a href="${window.famobi.config.branding_url || window.famobi.config.more_games_url}" target="_blank">
                              <img src="html5games/images/icon.svg" alt="${window.famobi.config.name}">
                            </a>
                          </li>
                        </ul>
                        ${langButtons}`;

                        window.famobi.menu.setHtml(menuHtml);

                        if(!!SDK_INTERFACE_SETTINGS.menuless) {
                            window.famobi.menu.fgOverlay.style.display = "none";
                        }
                    },
                    show: function() {
                        if (window.famobi.menu.fgOverlay_visible) {
                            return window.famobi.menu;
                        }
                        let leaderboardBtnImage = window.famobi.menu.fgNavigation.querySelector(".fa-menu-button-leaderboard img");
                        if(leaderboardBtnImage) {
                          window.famobi.menu.fgNavigation.querySelector(".fa-menu-button-leaderboard img").style.animation = "growAndShake 1s linear 1s 1 forwards";
                          setTimeout(()=>window.famobi.menu.fgNavigation.querySelector(".fa-menu-button-leaderboard img").style.animation = "none",2000);
                        }

                        var $fullscreenIcon = faZepto("#fg-overlay .fa-menu-button-fullscreen");

                        this.hideAll();

                        window.famobi.menu.eventHandler = window.famobi.menu.handleClick(faZepto("html").get(0), this.hideAll);
                        faZepto("html").get(0).style.cursor = "pointer";

                        if (
                            !document.fullscreenElement &&
                            !document.mozFullScreenElement &&
                            !document.webkitFullscreenElement &&
                            !document.msFullscreenElement
                        ) {
                            $fullscreenIcon
                                .removeClass("fa-fullscreen-enabled")
                                .addClass("fa-fullscreen-disabled");
                        } else {
                            $fullscreenIcon
                                .removeClass("fa-fullscreen-disabled")
                                .addClass("fa-fullscreen-enabled");
                        }

                        window.famobi.menu.fgOverlay_visible = true;
                        faZepto(window.famobi.menu.fgOverlay).addClass("navigation-view");

                        window.famobi.menu.fgNavigation.style.display = "";

                        return window.famobi.menu;
                    },
                    hide: function() {
                        return hideAll();
                    },
                    hideAll: function() {
                        if (!window.famobi.menu.fgOverlay_visible) {
                            return window.famobi.menu;
                        }

                        if (window.famobi.menu.eventHandler) {
                            window.famobi.menu.removeClick(faZepto("html").get(0), window.famobi.menu.eventHandler);
                        }

                        var $fgOverlay = faZepto(window.famobi.menu.fgOverlay);
                        $fgOverlay.removeClass("iframe-view navigation-view fa-lang-shown");
                        window.famobi.menu.fgOverlay_visible = false;

                        return window.famobi.menu;
                    },
                    handleClick: function(element, callback) {
                        var eventHandler = function(e) {
                            callback.call(this, e);
                            e.cancelBubble = true;
                            e.stopPropagation();
                            return false;
                        };

                        if (typeof callback === "function") {
                            // http://stackoverflow.com/questions/13396297/windows-phone-8-touch-support
                            //
                            // Performing operations that require explicit user interaction on touchstart events is deprecated and will be removed in M54, around October 2016. See https://www.chromestatus.com/features/5649871251963904 for more details.
                            if (window.navigator.msPointerEnabled) {
                                element.addEventListener("MSPointerDown", eventHandler, false);
                            } else if (window.PointerEvent) {
                                element.addEventListener("pointerup", eventHandler, false);
                                element.addEventListener("pointermove", this.eventTrap, true);
                                element.addEventListener("pointerdown", this.eventTrap, true);
                            } else if (detection.is.touch) {
                                element.addEventListener("touchend", eventHandler, false);
                                element.addEventListener("touchmove", this.eventTrap, true);
                                element.addEventListener("touchstart", this.eventTrap, true);
                            } else {
                                element.addEventListener("click", eventHandler, false);
                            }

                            element.style.cursor = "pointer";
                        }

                        return eventHandler;
                    },
                    removeClick: function(element, eventHandler) {
                        if (typeof eventHandler === "function") {
                            if (window.navigator.msPointerEnabled) {
                                element.removeEventListener("MSPointerDown", eventHandler, false);
                            } else if (window.PointerEvent) {
                                element.removeEventListener("pointerup", eventHandler, false);
                                element.removeEventListener("pointermove", this.eventTrap, true);
                                element.removeEventListener("pointerdown", this.eventTrap, true);
                            } else if (detection.is.touch) {
                                element.removeEventListener("touchend", eventHandler, false);
                                element.removeEventListener("touchmove", this.eventTrap, true);
                                element.removeEventListener("touchstart", this.eventTrap, true);
                            } else {
                                element.removeEventListener("click", eventHandler, false);
                            }
                        }

                        return element;
                    },
                    eventTrap: function(e) {
                        e.preventDefault();
                        e.cancelBubble = true;
                        e.stopPropagation();
                    },
                    toggleOverlay: function(e) {
                        if (window.famobi.menu.fgOverlay_visible) {
                            window.famobi.menu.hideAll();
                        } else {
                            window.famobi.menu.show();
                        }
                        e.stopPropagation();
                        return false;
                    },
                    setHtml: function(html) {
                        window.famobi.menu.fgNavigation.innerHTML = html;
                        window.famobi.menu.bindEvents();

                    },

                    toggleLanguages: function() {
                        var $overlayNode = faZepto(window.famobi.menu.fgOverlay);
                        if ($overlayNode.hasClass("fa-lang-shown")) {
                            $overlayNode.removeClass("fa-lang-shown");
                        } else {
                            $overlayNode.addClass("fa-lang-shown");
                        }
                    },

                    switchLanguage: function(lang) {
                        var params = window.famobi.getUrlParams(),
                            qs = "";

                        window.famobi.menu.hideAll();
                        params.locale = lang;
                        qs = faZepto.param(params);
                        document.location.replace(
                            document.location.pathname +
                                "?" +
                                qs +
                                (document.location.hash ? document.location.hash : "")
                        );
                    },

                    bindEvents: function() {

                        faZepto("[data-switch-lang]").each(function() {
                          var $this = faZepto(this),
                            lang = faZepto(this).attr("data-switch-lang");

                          $this.removeClass("fg-lang-selected");

                          if (lang === window.famobi.gametranslation.curLangString) {
                            // Move selected language to first position
                            $this.closest("ul").prepend($this);

                            $this.addClass("fg-lang-selected");
                          }

                          window.famobi.menu.handleClick(this, function() {
                            if ($this.hasClass("fg-lang-selected") === true) {
                              window.famobi.menu.toggleLanguages();
                            } else {
                              if (lang.length) {
                                window.famobi.menu.switchLanguage(lang);
                              }
                            }
                          });
                        });

                        faZepto("[data-famobi-href]")
                            .css("cursor", "pointer")
                            .each(function() {
                                var callback = function() {
                                    var link = faZepto(this).attr("data-famobi-href");

                                    window.famobi.menu.hideAll();

                                    switch (link) {
                                        case "moreGames":
                                            return window.famobi.menu.moreGamesLink();
                                        case "back":
                                            return window.famobi.menu.backLink();
                                        case "leaderboard":
                                            return window.famobi.showLeaderboard();
                                        default:
                                            if (this.href) {
                                                window.open(this.href, "");
                                                return false;
                                            }
                                    }
                                };

                                window.famobi.menu.handleClick(this, callback.bind(this));
                            });
                    }
                },

                getMoreGamesButtonImage: function() {

                    return this.brandingLogo ? this.brandingLogo.src : "html5games/images/" + (this.config.more_games_button_image || "logo") + ".png";
                },

                getBrandingButtonImage: function() {

                    return this.brandingLogo ? this.brandingLogo.src : "html5games/images/" + (this.config.branding_button_image || this.config.more_games_button_image || "logo") + ".png";
                },

                moreGamesLink: function() {

                    var url = "https://famobi.com";

                    if(url = this.config.more_games_url) {
                        window.open(url, "") || (window.top.location.href = url);
                    } else {
                        return;

                        confirm("redirecting to... " + url) && (window.open(url, "") || (window.top.location.href = url)); // handles the link target in production version, depends on user language
                    }



                },

                openBrandingLink: function() {
                    this.moreGamesLink();
                },

                sessionStorage: {

                    setItem: function(key, value) {
                        try{
                            window.sessionStorage.setItem(window.famobi_gameID + ":" + key, value);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    },
                    getItem: function(key) {
                        try{
                            return window.sessionStorage.getItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                        return null;

                    },
                    removeItem: function(key) {
                        try{
                            window.sessionStorage.removeItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    },
                    clear: function() {
                        try{
                            for (var key in window.sessionStorage) {
                                if (key.startsWith(window.famobi_gameID + ":")) {
                                    window.sessionStorage.removeItem(key);
                                }
                            }
                        } catch(e) {
                            window.famobi.config.logging && console.log("[SessionStorage] Skipped because of issues");
                        }
                    }
                },

                localStorage: {

                    setItem: function(key, value) {
                        try{
                            window.localStorage.setItem(window.famobi_gameID + ":" + key, value);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    },
                    getItem: function(key) {
                        try{
                            return window.localStorage.getItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                        return null;

                    },
                    removeItem: function(key) {
                        try{
                            window.localStorage.removeItem(window.famobi_gameID + ":" + key);
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    },
                    clear: function() {
                        try{
                            for (var key in window.localStorage) {
                                if (key.startsWith(window.famobi_gameID + ":")) {
                                    window.localStorage.removeItem(key);
                                }
                            }
                        } catch(e) {
                            window.famobi.config.logging && console.log("[LocalStorage] Skipped because of issues");
                        }
                    }
                },

                log: function() {
                    if(this.config && !this.config.logging) {
                        return;
                    }
                    console.log(arguments.length === 1 ? arguments[0] : arguments);
                },

                warn: function() {
                    if(this.config && !this.config.logging) {
                        return;
                    }
                    console.warn(arguments.length === 1 ? arguments[0] : arguments);
                },

                orientation: {

                    init: function() {
                        this.rootElement = document.getElementById("fg-root");
                        this.update(window.famobi.config.gameParams.orientation);
                    },

                    update: function(orientation) {
                        // show rotation screen?
                        if (
                            typeof orientation != "undefined" &&
                            (window.famobi.config.rotation || (window.famobi.config.rotation !== false && !detection.is.pc && !detection.is.tablet)) &&
                            window.screen &&
                            window.screen.height !== window.screen.width
                        ) {
                            this.rootElement.className =
                                this.rootElement.className + " fg-orientation-" + orientation;

                            if (typeof this.fgLandscapeOverlay == "undefined") {
                                this.fgLandscapeOverlay = document.createElement("div");
                                this.fgLandscapeOverlay.setAttribute("id", "fg-landscape-overlay");

                                this.fgLandscapeImage = document.createElement("img");
                                this.fgLandscapeImage.setAttribute(
                                    "src",
                                    "html5games/images/RotateToLandscape.png"
                                );
                                this.fgLandscapeImage.setAttribute("class", "fg-orientation-icon");
                                this.fgLandscapeImage.setAttribute("alt", "switch to landscape");
                                this.fgLandscapeOverlay.appendChild(this.fgLandscapeImage);

                                this.rootElement.appendChild(this.fgLandscapeOverlay);
                            }

                            if (typeof this.fgPortraitOverlay == "undefined") {
                                this.fgPortraitOverlay = document.createElement("div");
                                this.fgPortraitOverlay.setAttribute("id", "fg-portrait-overlay");

                                this.fgPortraitImage = document.createElement("img");
                                this.fgPortraitImage.setAttribute(
                                    "src",
                                    "html5games/images/RotateToPortrait.png"
                                );
                                this.fgPortraitImage.setAttribute("class", "fg-orientation-icon");
                                this.fgPortraitImage.setAttribute("alt", "switch to portrait");
                                this.fgPortraitOverlay.appendChild(this.fgPortraitImage);

                                this.rootElement.appendChild(this.fgPortraitOverlay);
                            }
                        }

                        return this;
                    }
                },

                sizeOf: function(data) {
                    var length = 0;
                    var prop;

                    if (!data) {
                        return length;
                    }

                    if (typeof data.length != "undefined") {
                        return data.length;
                    }

                    if (Object.keys) {
                        // available since ECMAScript 5 and in some browser 10x faster
                        length = Object.keys(data).length;
                    } else {
                        for (prop in data) {
                            if (data.hasOwnProperty(prop)) {
                                length++;
                            }
                        }
                    }
                    return length;
                },

                getOrientation: function() {
                    var orientationMatch = window.matchMedia('all and (orientation:landscape)');

                    if(orientationMatch && orientationMatch.matches === true) {
                        return 'landscape';
                    }
                    return 'portrait';
                },

                onOrientationChange: function(callback) {
                    this.orientationChangeCallback = callback;

                    if (typeof callback !== "function") {
                      this.error("famobi.onorientationchange: no valid callback provided.");
                    }
                    return faZepto(window).resize(callback);
                },

                // DEPRECATED FUNCTIONS
                submitHighscore: function(level, score, isTriggered) {

                    !isTriggered && this.warn("famobi.submitHighscore is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELSCORE')instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                levelUp: function() {
                    this.warn("famobi.levelUp is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELSUCCESS') instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                gameOver: function() {
                    this.warn("famobi.gameOver is deprecated, please use famobi_analytics.trackEvent('EVENT_LEVELFAIL') instead: https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics");
                },
                includeCSS: function(href) {
                    var head  = document.getElementsByTagName('head')[0],
                        link  = document.createElement('link');

                    link.rel  = 'stylesheet';
                    link.type = 'text/css';
                    link.href = href;

                    head.appendChild(link);
                },
                sendLiveScore: function(liveScore) {
                    // todo
                },
                hasRewardedAd: function() {
                    return this.hasFeature("rewarded");
                },
                hasFeature: function(feature) {

                    if(feature == "local") feature = "standalone";
                    return (feature in this.config.features) && !!this.config.features[feature];
                },
                getAppLink: function() {
                    return "";
                },
                getUrlParams: function(a, b, c) {
                    a = /[?&]?([^=]+)=([^&]*)/g, b = document.location && document.location.search ? document.location.search.split("+").join(" ") : "";
                    for (var d = {}; c = a.exec(b);) d[decodeURIComponent(c[1])] = decodeURIComponent(c[2]);

                        if(d['fg_aid']) {
                            this.config.aid = d['fg_aid'];
                        } else {
                            d['fg_aid'] = this.config.aid;
                        }

                    return d;
                },
                showLeaderboard: function() {
                    if(!window.famobi.hasFeature("highscores")) return;
                },
                game: {
                    waitingCounter: 0,
                    setWaiting: function(newVal) {
                        newVal
                            ? this.waitingCounter++
                            : this.waitingCounter > 0
                            ? this.waitingCounter--
                            : (this.waitingCounter = 0);
                        return this;
                    },
                    isWaiting: function() {
                        return this.waitingCounter > 0;
                    },
                    canResume: function() {
                        return this.waitingCounter === 1;
                    },
                    init: function() {
                        this.waitingCounter = 0;
                    },
                    pause: function() {

                        if (this.isWaiting()) {
                            //window.famobi..log('game is already waiting, do not pause');
                            this.setWaiting(true);
                            return false;
                        }

                        this.setWaiting(true);

                        try {
                            if (typeof window.famobi_onPauseRequested == "function") {
                                window.famobi_onPauseRequested();
                                return true;
                            }
                            // Phaser
                            if (window.game && typeof window.game.paused !== "undefined") {
                                window.game.paused = true;
                                return true;
                            }
                            // Construct 2
                            if (typeof window.cr_setSuspended !== "undefined") {
                                cr_setSuspended(true);
                                //faZepto('<iframe id="fg-clickthrough-frame" src="about:blank" style="width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 999"></iframe>').appendTo(window.famobi..rootElement);
                                return true;
                            }
                            // CreateJS <3
                            if (typeof window.createjs !== "undefined") {
                                //window.createjs.Sound.setMute(true);
                            }
                        } catch (e) {
                            window.famobi.log("Pausing game failed: " + e);
                        }
                    },
                    resume: function() {

                        if (!this.isWaiting()) {
                            //window.famobi..log('game is not waiting, do not resume');
                            return false;
                        }

                        if (!this.canResume()) {
                            //window.famobi..log('game is still waiting, do not resume');
                            this.setWaiting(false);
                            return false;
                        }

                        this.setWaiting(false);

                        try {
                            if (typeof window.famobi_onResumeRequested == "function") {
                                window.famobi_onResumeRequested();
                                return true;
                            }
                            // Phaser
                            if (window.game && typeof window.game.paused !== "undefined") {
                                window.game.paused = false;
                                return true;
                            }
                            // Construct 2
                            if (typeof window.cr_setSuspended !== "undefined") {
                                cr_setSuspended(false);
                                //faZepto('iframe#fg-clickthrough-frame').remove();
                                return true;
                            }
                            // CreateJS <3
                            if (typeof window.createjs !== "undefined") {
                                //window.createjs.Sound.setMute(false);
                            }
                        } catch (e) {
                            window.famobi.log("Resuming game failed: " + e);
                        }

                        return false;
                    }
                },
                translateHtml: function() {
                    return this.gametranslation.translateHtml.apply(this, arguments);
                },
                setPreloadProgress: function(percent) {
                    if(this.config.logging) {
                        console.info(percent + "%");
                    }
                },
                gameReady: function() {

                    // Run Adapter if possible
                    this.adapters.run("game", "ready");
                    this.log("Received gameReady signal");
                },
                playerReady: function() {

                    // Run Adapter if possible
                    this.adapters.run("player", "ready");
                    this.log("Received playerReady signal");
                },
                setVolume: function(vol) {
                    this.volume = Math.max(0.0, Math.min(1.0, vol));
                    if(this.volume != vol) {
                        console.warn("volume: value out of bounds. Now forced to " + this.volume);
                    }
                    this.adapters.run("request", "changeVolume", this.volume);
                },
                getVolume: function() {
                    return this.volume;
                },
                getFeatureProperties: function(feature) {
                    return this.hasFeature(feature) && (typeof this.config.features[feature] == "object") ? this.config.features[feature] : {};
                },
                adaptersModule: function() {
                    var self = this,
                        M;

                    function module() {

                        // define private vars
                        this.adapters = {
                            ads: {
                                show: this.createAdapter(),
                                rewarded: this.createAdapter(),
                                callback: this.createAdapter(),
                                vastUrl: this.createAdapter()
                            },
                            adEvent: {
                                loaded: this.createAdapter(),
                                displayed: this.createAdapter(),
                                errored: this.createAdapter(),
                                userClosed: this.createAdapter(),
                                completed: this.createAdapter()
                            },
                            analytics: {
                                trackEvent: this.createAdapter(),
                                trackScreen: this.createAdapter(),
                                trackStats: this.createAdapter()
                            },
                            api: {
                                created: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            game: {
                                loaded: this.createAdapter({queueCalls: true, runOnce: true}),
                                gameOver: this.createAdapter(),
                                levelUp: this.createAdapter(),
                                preloadProgress: this.createAdapter(),
                                preloadComplete: this.createAdapter({queueCalls: true, runOnce: true}),
                                ready: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            player: {
                                ready: this.createAdapter({queueCalls: true, runOnce: true})
                            },
                            highscore: {
                                show: this.createAdapter(),
                                submit: this.createAdapter()
                            },
                            screenshot: {
                                submit: this.createAdapter()
                            },
                            request: {
                                startGame: this.createAdapter({queueCalls: true, runOnce: true}),
                                stopGame: this.createAdapter(),
                                restartGame: this.createAdapter(),
                                pauseGameplay: this.createAdapter(),
                                resumeGameplay: this.createAdapter(),
                                enableAudio: this.createAdapter(),
                                disableAudio: this.createAdapter(),
                                enableMusic: this.createAdapter(),
                                disableMusic: this.createAdapter(),
                                changeVolume: this.createAdapter()
                            }
                        };

                        this.adapter_templates = {
                            ads: {
                                show: [function(callback, force) {
                                    /* when an interstitial ad is requested */
                                }],
                                rewarded: [function(callback) {
                                    /* when a rewarded ad is requested */
                                }],
                                callback: [function(options) {
                                    /* fired when ad modal is closed */
                                }],
                                vastUrl: [function() {
                                    /* fired when ad vast tag is retrieved */
                                }]
                            },
                            adEvent: {
                                loaded: [function(ad) {
                                    /**/
                                }],
                                displayed: [function() {
                                    /**/
                                }],
                                errored: [function(adErrorEvent) {
                                    /**/
                                }],
                                userClosed: [function(adcount) {
                                    /**/
                                }],
                                completed: [function(adcount) {
                                    /**/
                                }]
                            },
                            analytics: {
                                trackEvent: [function(event, params) {
                                    /**/
                                }],
                                trackScreen: [function(screen, pageTitle) {
                                    /**/
                                }],
                                trackStats: [function(key, value) {
                                    /**/
                                }]
                            },
                            api: {
                                created: [function(apiInstance) {
                                    /**/
                                }]
                            },
                            game: {
                                loaded: [function() {
                                    /**/
                                }],
                                gameOver: [function() {
                                    /**/
                                }],
                                levelUp: [function() {
                                    /**/
                                }],
                                preloadProgress: [function() {
                                    /**/
                                }],
                                preloadComplete: [function() {
                                    /**/
                                }],
                                ready: [function() {
                                    /**/
                                }]
                            },
                            highscore: {
                                show: [function(level) {
                                    /**/
                                }],
                                submit: [function(level, score) {
                                    /**/
                                }]
                            },
                            screenshot: {
                                submit: [function(screenshot_url, options) {
                                    /**/
                                }]
                            },
                            request: {
                                /* attention: these request adapters are only used in specific environments (e.g. Famobi apps) */

                                startGame: [function() {
                                    /* triggered once after loading all assets, indicates when the game should start */
                                }],
                                stopGame: [function() {
                                    /* indicated that game should be stopped */
                                }],
                                restartGame: [function() {
                                    /* indicated that game should be restarted */
                                }],
                                pauseGameplay: [function() {
                                    /* indicates a pause functionality/overlay should be activated when called in gameplay state */
                                }],
                                resumeGameplay: [function() {
                                    /* indicates the game should resume when in a paused gameplay state */
                                }],
                                enableAudio: [function() {
                                    /* indicates that audio(sfx) should be enabled */
                                }],
                                disableAudio: [function() {
                                    /* indicates that audio(sfx) should be disabled */
                                }],
                                enableMusic: [function() {
                                    /* indicates that music should be enabled */
                                }],
                                disableMusic: [function() {
                                    /* indicates that music should be disabled */
                                }],
                                changeVolume: [function(vol) {
                                    /* indicates that the volume changed */
                                }]
                            },
                            player: {
                                ready: [function() {
                                    /**/
                                }]
                            }
                        };
                    }

                    var adaptersPrototype = module.prototype;

                    adaptersPrototype.createAdapter = function(options) {
                        return {
                            callbacks: [],
                            queueCalls: !!(options && options.queueCalls),
                            queue: [],
                            runOnce: !!(options && options.runOnce),
                            numRuns: 0
                        };
                    };

                    adaptersPrototype.init = function() {
                        var section = "",
                            subsection = "";

                        if (typeof window.famobi_adapters !== "undefined") {
                            for (section in window.famobi_adapters) {
                                for (subsection in window.famobi_adapters[section]) {
                                    this.add(
                                        section,
                                        subsection,
                                        window.famobi_adapters[section][subsection]
                                    );
                                }
                            }
                        }
                    };

                    adaptersPrototype.list = function() {
                        //self.log("available adapters: ", this.adapters);
                        //self.log("adapter templates: ", this.adapter_templates);
                        return this.adapters;
                    };

                    adaptersPrototype.add = function(section, subsection, callback) {

                        if (!(section in this.adapters && subsection in this.adapters[section])) {
                            self.log("adapters.add: invalid (sub-)section");
                            return this;
                        }

                        if (typeof callback !== 'function') {
                            self.log("adapters.add: invalid callback");
                            return this;
                        }

                        var adapter = this.adapters[section][subsection];

                        if (typeof adapter != 'object' || !Array.isArray(adapter.callbacks)) {
                            self.log("adapters.add: broken adapter object for", section, subsection);
                            return this;
                        }

                        // self.log("adapters.add: push callback for", section, subsection);
                        adapter.callbacks.push(callback);

                        if (adapter.queueCalls && adapter.queue.length > 0) {
                            adapter.queue.forEach(function(args) {
                                try {
                                    callback.apply(this, args);
                                } catch(err) {
                                    console.warn("adapters.run: callback failed for", section + "." + subsection, "\n", err);
                                }
                            }, this);
                        }

                        return this;
                    };

                    adaptersPrototype.has = function(section, subsection) {
                        return (section in this.adapters) &&
                            (subsection in this.adapters[section]) &&
                            (typeof this.adapters[section][subsection] == "object") &&
                            Array.isArray(this.adapters[section][subsection].callbacks) &&
                            (this.adapters[section][subsection].callbacks.length > 0);
                    };

                    adaptersPrototype.run = function(section, subsection) {
                        var args = arguments ? Array.prototype.slice.call(arguments, 2) : [];

                        if (!(section in this.adapters) ||
                                !(subsection in this.adapters[section]) ||
                                !(typeof this.adapters[section][subsection] == "object")) {
                            return false;
                        }

                        var adapter = this.adapters[section][subsection];

                        if (adapter.runOnce && adapter.numRuns > 0) {
                            console.warn("adapters.run: one-time adapter called more than once for", section + "." + subsection, "\n");
                            return false;
                        }

                        adapter.numRuns += 1;

                        if (adapter.queueCalls) {
                            adapter.queue.push(args);
                        }

                        if (adapter.callbacks.length > 0) {
                            adapter.callbacks.forEach(function(callback) {
                                try {
                                    callback.apply(this, args);
                                } catch(err) {
                                    console.warn("adapters.run: callback failed for", section + "." + subsection, "\n", err);
                                }
                            }, this);
                            return true;
                        }

                        return false;
                    };

                    M = new module();
                    M.init();

                    return M;
                },
                requestsModule: function() {
                    var self = this,
                        M;

                    function module() {
                        // define private vars
                        this.adapterSection = "requests";
                        this.legitActionIdentifiers = [
                            "startGame",
                            "stopGame",
                            "restartGame",
                            "pauseGameplay",
                            "resumeGameplay",
                            "enableAudio",
                            "enableMusic",
                            "disableAudio",
                            "disableMusic",
                            "changeVolume"
                        ];
                    }

                    var requestsPrototype = module.prototype;

                    requestsPrototype.init = function() {
                    };

                    requestsPrototype.isAction = function(actionIdentifier) {
                        return typeof actionIdentifier === "string" &&
                            (M.legitActionIdentifiers.indexOf(actionIdentifier) > -1)
                    };

                    requestsPrototype.onRequest = function(actionIdentifier, callback) {

                        if (!self.adapters) {
                            console.warn(
                                "onRequest(): adapters module required"
                            );
                            return;
                        }

                        if (!M.isAction(actionIdentifier))  {
                            console.warn(
                                "onRequest(): required param 'action' has to be one of \"" +
                                    M.legitActionIdentifiers.join('", "') + '"'
                            );
                            return;
                        }

                        if (typeof callback !== "function") {
                            console.warn(
                                "onRequest(): required param 'callback' has to be of type 'function'"
                            );
                            return;
                        }

                        self.adapters.add("request", actionIdentifier, callback);
                    };

                    requestsPrototype.requestAction = function(actionIdentifier) {

                        if (!self.adapters) {
                            console.warn(
                                "onRequest(): adapters module required"
                            );
                            return;
                        }

                        if (!M.isAction(actionIdentifier))  {
                            console.warn(
                                "requestAction(): required param 'action' has to be one of \"" +
                                    M.legitActionIdentifiers.join('", "') + '"'
                            );
                            return;
                        }

                        self.adapters.run.apply(self.adapters, ["request"].concat(Array.from(arguments)))
                    };

                    M = new module();
                    M.init();

                    return M;
                },
                onRequest: function(action, callback) {

                    if (!this.requests) {
                        console.warn(
                            "onRequest(): requests module required"
                        );
                        return;
                    }

                    this.requests.onRequest(action, callback);
                },
                requestAction: function() {

                    if (!this.requests) {
                        console.warn(
                            "onRequest(): requests module required"
                        );
                        return;
                    }

                    this.requests.requestAction.apply(this, arguments);
                },
                getOffsets: function() {
                    return {top: 0, right: 0, bottom: 0, left: 0};
                },
                onOffsetChange: function(callback) {
                    // do nothing
                }
            };
            // export famobi object to global object
        b[a] = famobi;

    }('famobi', window);

    var isPageReady = new Promise(function(resolve, reject) {
       var readyRE = /complete|loaded|interactive/;
       if (readyRE.test(document.readyState) && document.body) {
           resolve();
       }
       else {
           document.addEventListener('DOMContentLoaded', resolve, false);
       }
    });

    Promise.all([loadScript("sdk_interface.js"), isPageReady]).then(function() {

        if(typeof SDK_INTERFACE !== "undefined" && SDK_INTERFACE.isSDKInterfaceDone !== "undefined") {
            return new Promise((resolve, reject) => {
                let interval = setInterval(function() {
                    // console.log(SDK_INTERFACE.isSDKInterfaceDone);
                    if(SDK_INTERFACE.isSDKInterfaceDone === true) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            });
        }
        return Promise.resolve();

    }).then(function() {

        window.famobi.adapters = window.famobi.adaptersModule.call(window.famobi);
        window.famobi.requests = window.famobi.requestsModule.call(window.famobi);

        return window.famobi.init();

    }).then(function() {

        if (window.famobi.hasOwnProperty("adapters")) {
            window.famobi.adapters.run("api", "created", famobi);
        }
        return Promise.resolve();

    }).then(function() {
        Promise.all((window.famobi.config.ads && !!window.famobi.config.ads.show_initial) ? [window.famobi.showInterstitialAd(true, true)] : []).then(function() {
            setTimeout(function() {
                (function next() {
                    if (!window.famobi_gameJS.length) {

                        window.famobi.gametranslation.init();
                        window.famobi.menu.create();
                        window.famobi.orientation.init();

                        window.setTimeout(function() {
                            var e = document.createEvent('Events');
                            e.initEvent("deviceready", true, false);
                            document.dispatchEvent(e);
                        }, 50);

                        return;
                    }
                    var currentScript = window.famobi_gameJS.shift();

                    if (typeof currentScript === "function") {
                        if(typeof Zepto !== "undefined" && typeof window.faZepto === "undefined") {
                            window.faZepto = Zepto;

                            // see https://github.com/blai/fashionista/issues/2
                            ;(function ($) {
                                $.getScript = function(src, func, error_func) {
                                    var script = document.createElement('script');
                                    script.async = "async";
                                    script.src = src;
                                    if (func) {
                                        script.onload = func;
                                    }
                                    if (error_func) {
                                        script.onerror = error_func;
                                    }
                                    document.getElementsByTagName("head")[0].appendChild( script );
                                };
                            })(Zepto);
                        }

                        if(currentScript instanceof Promise) {
                            currentScript().then(function() {
                                next();
                            });
                        } else {
                            currentScript()
                            next();
                        }
                    }
                    else {
                        var scriptEl = document.createElement("script"),
                            _currentScript = currentScript.match(/(\{(.*?)\})/);
                        scriptEl.onload = next;
                        scriptEl.onerror = next;
                        scriptEl.src = _currentScript ? window.famobi.__(_currentScript[2]) : currentScript;
                        document.body.appendChild(scriptEl);
                    }
                })();
            }, window.famobi.config.nextTimeout || 0);
        });
    });
}
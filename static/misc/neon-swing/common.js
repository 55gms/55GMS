// mock object 1 (https://sites.google.com/a/famobi.com/api-docs/api-implementation/api-snippet)
if (typeof window !== "undefined" && !window["famobi"]){
	!function(a, b) {
		var famobi = {
			volume: 1.0,
			properties: [],
			showAd: function(callback) {

				var self = this;

                window.famobi_onPauseRequested();
                this.game.waiting = true;

                var canvas = document.getElementsByTagName("canvas");
                if(canvas.length) {
                	canvas[0].style.opacity = 0.2;
                }

            ;

                if(canvas.length) {
                	canvas[0].style.opacity = 1.0;
                }

                window.famobi_onResumeRequested();
                self.game.waiting = false;

                if (typeof callback == "function") {
                    callback();
                }
            },
            showInterstitialAd: function(callback) {
            	this.showAd(callback);
            },
            forceAd: function(callback) {
            	this.showAd(callback);
            },
            rewardedAd: function(callback) {

            	var result = {
            		adDidLoad: true,
            		adDidShow: true,
            		rewardGranted: false
            	};

            	if(confirm("Rewarded ad ended. Should a reward be granted?") == true) {
            		result.rewardGranted = true;
            	}

            	if(typeof callback == "function") {
            		callback(result);
            	}
            },
			__: function(key) {
				return key;
			},
			getMoreGamesButtonImage: function(forceAbsolute) {
				return forceAbsolute ? 'https://games.cdn.famobi.com/branding/logo.png' : 'fg_api_local/branding/default/logo.png';
			},
			getBrandingButtonImage: function(forceAbsolute) {
				return forceAbsolute ? 'https://games.cdn.famobi.com/branding/logo.png' : 'fg_api_local/branding/default/logo.png';
			},
			moreGamesLink: function() {
				
			},
			openBrandingLink: function() {
				
			},
			log: function() {
				if(arguments.length == 1) {
					if(Array.isArray(arguments[0])) {
						if(arguments[0].length == 1) {
							console.log(arguments[0][0]);
							return;
						}
					} else {
						console.log(arguments[0]);
						return;
					}
				}
				console.log(arguments);
			},
			submitHighscore: function(level, score) {
				console.log("submitHighscore", level, score);
			},
			hasFeature: function(feature) {
				return false;
			},
			getAppLink: function() {
				return 'https://html5games.com';
			},
			game: {
				waiting: false,
				isWaiting: function() {
					return this.waiting;
				}
			},
			hasRewardedAd: function() {
				return false;
			},
			getUrlParams: function(key) {
				return {};
			},
			audio: {
				controls: false,
				bgm: true,
				sfx: true,
				init: function() {
					// do something
				},
				hasControls: function() {
					return window.famobi.hasFeature("audio") ? this.controls : true;
				},
				isEnabled: function(type) {
					switch(type) {
						case "bgm":
							return this.bgm;
						case "sfx":
							return this.sfx;
						default:
							return this.bgm && this.sfx;
					}
				}
			},
			setPreloadProgress: function(percent) {
				this.log("preload progress: " + percent);
			},
			onRequest: function(action, callback) {
				// do nothing
			},
			adapters: {
				run: function(section, subsection) {

					switch(section) {
						case "request":
							if(typeof window["famobi_onRequest_" + subsection] == "function") {
								window["famobi_onRequest_" + subsection]();
							}
							break;
						default:
							window.famobi.log("unknown section " + section + " in adapters.");
					}
				},
				add: function() {
					// do nothing
				}
			},
			gameReady: function() {
				this.log("gameReady");
			},
			playerReady: function() {
				this.log("playerReady");
			},
			getFeatureProperties: function() {
				return null;
			},
			getVolume: function() {
				return this.volume;
			},
			setVolume: function(vol) {
				this.volume = Math.max(0.0, Math.min(1.0, vol));
				if(this.volume != vol) {
				    console.warn("volume: value out of bounds. Now forced to " + this.volume);
				}
				this.adapters.run("request", "changeVolume");
			}
		};

		// export famobi object to global object
		b[a] = famobi;

	}('famobi', window);
}

// mock object 2 (https://sites.google.com/a/famobi.com/api-docs/api-implementation/famobi-analytics)
if (typeof window !== "undefined" && !window["famobi_analytics"]){
	!function(a, b) {
		var famobi_analytics = {
			'stats' : {}, // params for achivements etc. - custom key-value pairs
			'events': [], // list of logged events, for debugging purposes
			'currentScreen': '',
			'pageTitle' : '',

			// STATS
			'trackStats': function(key, value, amount) {

				famobi.log("trackStats():", key, value, amount);

				return new Promise(function(resolve, reject) {
					var res = {};
					var values = {};

					if (typeof key === 'string') {
						values[key] = value;
					}

					var statsValidator = function() {
						for (var k in values) {
							var testKey = (typeof key === 'string' && key.length && key.length <= 42) && key.match(/^[a-z\_0-9]+$/);
							if (!testKey) {
								console.warn("trackStats(): key '" + key + "' contains not only lowercase letters, numbers and underscore ([a-z_0-9]), maximum length: 42 characters");
								return false;
							}
						}

						return true;
					};

					var isValid = statsValidator();

					if (!isValid) {
						reject("trackStats(): invalid params " + JSON.stringify(key, value));
						return false;
					}

					var updateKey = function(key, value) {
						if (typeof key === 'string' && key.length) {
							if (key in famobi_analytics.stats &&
								(typeof value === "undefined" || value === null)) {
								delete famobi_analytics.stats[key];
							} else {
								if(typeof value !== "undefined" && value) {
									famobi_analytics.stats[key] = value;
								}
							}

							return true;
						} else {
							throw("trackStats(): key is not a string or an Object");
						}
					};

					if(key && typeof key === 'object') {
						for(var k in key) {
							value = key[k];
							updateKey(k, value);
						}

						res = key;
					} else {
						updateKey(key, value);

						res[key] = value;
					}

					if (famobi.hasOwnProperty("adapters")) {
						famobi.adapters.run("analytics", "trackStats", key, value, amount);
					}

					resolve(res);
				});
			},
			'getStats': function() {
				// for debugging purposes
				return new Promise(function(resolve, reject) {
					resolve(famobi_analytics.stats);
				});
			},

			// EVENTS
			'trackEvent': function(event, params) {

				famobi.log("trackEvent():", event, params);

				return new Promise(function(resolve, reject) {
					if (typeof famobi_analytics[event] === "undefined") {
						reject('trackEvent(): unknown event \'' + event + '\'');
						return false;
					}

					params = params || {};

					if (typeof params !== "object" && params !== null) {
						reject('trackEvent(): second parameter needs to be an object');
						return false;
					}

					var paramsValidator = function() {
						var availableParams = {
							'levelName': '',
							'reason': ['timeout', 'dead', 'wrong_answer', 'quit', 'draw'],
							'levelScore': -0.0,
							'totalScore': -0.0,
							'liveScore': -0.0,
							'bgmVolume': 0.0,
							'sfxVolume': 0.0
						};
						var requiredParams = {
							'EVENT_LEVELFAIL': ['levelName', 'reason'],
							'EVENT_LEVELRESTART': ['levelName'],
							'EVENT_LEVELSTART': ['levelName'],
							'EVENT_LEVELSUCCESS': ['levelName'],
							'EVENT_LEVELSCORE': ['levelName', 'levelScore'],
							'EVENT_TOTALSCORE': ['totalScore'],
							'EVENT_LIVESCORE': ['liveScore'],
							'EVENT_VOLUMECHANGE': ['bgmVolume', 'sfxVolume'],
							'EVENT_CUSTOM': []
						};

						if (typeof requiredParams[event] !== "undefined" && Object.keys(params).length === 0) {
							console.warn("trackEvent(): '" + event + "' requires at least one parameter");
							return false;
						}

						if (typeof requiredParams[event] === "undefined") {
							return true;
						}

						var k = 0;
						var name = '';
						var param = null;

						for (k; k < requiredParams[event].length; k++) {
							name = requiredParams[event][k];
							param = availableParams[name];

							if (typeof param === "string") {
								if (typeof params[name] !== "string") {
									console.warn("trackEvent(): required param '" + name + "' has to be of type string");
									return false;
								}
							}

							if (typeof param === "number") {
								if (typeof params[name] !== "number") {
									console.warn("trackEvent(): required param '" + name + "' has to be of type number");
									return false;
								}
							}

							if (typeof param === "object") {
								if (param.indexOf(params[name]) === -1) {
									console.warn("trackEvent(): required param '" + name + "' has to be one of \"" + param.join('", "') + "\"");
									return false;
								}
							}
						}

						return true;
					};

					var isValid = paramsValidator();

					if (!isValid) {
						return reject("trackEvent(): invalid params " + JSON.stringify(params));
					}

					famobi_analytics.events.push({event: event, params: params});

					if (famobi.hasOwnProperty("adapters")) {
						famobi.adapters.run("analytics", "trackEvent", event, params);
					}

					if (famobi_analytics.TRIGGER_AD.indexOf(event) > -1) {

						if(params.reason == "quit") {
							return resolve(event, params);
						}

						return famobi.showAd(function() {
							resolve(event, params);
						});
					}

					if (famobi_analytics.TRIGGER_LEVELSCORE.indexOf(event) > -1) {
						famobi.submitHighscore(params['levelName'], params['levelScore']);
						return resolve(event, params);
					}

					if (famobi_analytics.TRIGGER_TOTALSCORE.indexOf(event) > -1) {
						famobi.submitHighscore('TOTAL', params['totalScore']);
						return resolve(event, params);
					}

					return resolve(event, params);
				});
			},
			'getEvents': function() {
				// for debugging purposes
				return new Promise(function(resolve, reject) {
					resolve(famobi_analytics.events);
				});
			},

			EVENT_CUSTOM:               'EVENT_CUSTOM',
			EVENT_LEVELFAIL:     		'EVENT_LEVELFAIL',
			EVENT_LEVELRESTART:  		'EVENT_LEVELRESTART',
			EVENT_LEVELSTART:    		'EVENT_LEVELSTART',
			EVENT_LEVELSUCCESS:  		'EVENT_LEVELSUCCESS',
			EVENT_LEVELSCORE:  		    'EVENT_LEVELSCORE',
			EVENT_TOTALSCORE:  		    'EVENT_TOTALSCORE',
			EVENT_LIVESCORE:  		    'EVENT_LIVESCORE',
			EVENT_TUTORIALCOMPLETED:    'EVENT_TUTORIALCOMPLETED',
			EVENT_TUTORIALSKIPPED:      'EVENT_TUTORIALSKIPPED',
			EVENT_VOLUMECHANGE:  		'EVENT_VOLUMECHANGE',
			EVENT_PAUSE:  				'EVENT_PAUSE',
			EVENT_RESUME:  				'EVENT_RESUME',

			// SCREEN
			'trackScreen': function(screen, pageTitle) {

				famobi.log("trackScreen():", screen, pageTitle);

				return new Promise(function(resolve, reject) {
					var requiredPageTitleScreens = [
						'SCREEN_OTHER'
					];

					if (typeof famobi_analytics[screen] === "undefined") {
						reject("trackScreen(): unknown screen '" + screen + "'");
						return false;
					}

					if (!pageTitle && screen.indexOf(requiredPageTitleScreens) > -1) {
						reject("trackScreen(): screen '" + screen + "' requires param 'pageTitle'");
						return false;
					}

					if (pageTitle && typeof pageTitle !== "string") {
						reject("trackScreen(): required param 'pageTitle' has to be a non-empty string");
						return false;
					}

					famobi_analytics.currentScreen = screen;
					famobi_analytics.pageTitle = pageTitle;

					if (famobi.hasOwnProperty("adapters")) {
						famobi.adapters.run("analytics", "trackScreen", screen, pageTitle);
					}

					resolve(screen, pageTitle);
				});
			},
			'getScreen': function() {
				return famobi_analytics.currentScreen;
			},
			'getPageTitle': function() {
				return famobi_analytics.pageTitle;
			},

			SCREEN_OTHER:        'SCREEN_OTHER', // custom, use pageTitle to differentiate
			SCREEN_BONUS:        'SCREEN_BONUS', // bonus screen, e.g. extra chance
			SCREEN_CHARACTER:    'SCREEN_CHARACTER', // Select character
			SCREEN_CREDITS:      'SCREEN_CREDITS', // credits screen, if used
			SCREEN_GAMERESULT:   'SCREEN_GAMERESULT', // result screen with total score (game over)
			SCREEN_HELP:         'SCREEN_HELP', // help screen
			SCREEN_HOME:         'SCREEN_HOME', // home screen (start screen)
			SCREEN_LEVEL:        'SCREEN_LEVEL', // level screen while playing
			SCREEN_LEVELINTRO:   'SCREEN_LEVELINTRO', // level has not yet begun (optional)
			SCREEN_LEVELLOADING: 'SCREEN_LEVELLOADING', // level is loading (optional)
			SCREEN_LEVELRESULT:  'SCREEN_LEVELRESULT', // result screen with level score
			SCREEN_LEVELSELECT:  'SCREEN_LEVELSELECT', // level select screen
			SCREEN_PAUSE:        'SCREEN_PAUSE', // pause screen
			SCREEN_SETTINGS:     'SCREEN_SETTINGS', // settings screen (advanced game settings)
			SCREEN_SHOP:         'SCREEN_SHOP', // when the game features an ingame shop, use pageTitle to differentiate between items
			SCREEN_SPLASH:       'SCREEN_SPLASH', // splash screen, if used
			SCREEN_TUTORIAL:     'SCREEN_TUTORIAL', // tutorial screen(s), use pageTitle to differentiate between multiple tutorial screens

			TRIGGER_AD:          ['EVENT_LEVELSUCCESS', 'EVENT_LEVELFAIL'],
			TRIGGER_LEVELSCORE:  ['EVENT_LEVELSCORE'],
			TRIGGER_TOTALSCORE:  ['EVENT_TOTALSCORE']
		};

		// export famobi_analytics object to global object
		b[a] = famobi_analytics;

	}('famobi_analytics', window);
}

if (typeof window !== "undefined" && !window.famobi_tracking) {
    !function(a, b) {

        function init(game, preferredUid, clientVersion, debug, trackAds) {
        	console.log("famobi_tracking.init", arguments);
        };

        function trackEvent(event, data) {
        	console.log("famobi_tracking.trackEvent", arguments);
        }

        b[a] = {
            'trackEvent': trackEvent,
            'init': init
        }

    }('famobi_tracking', window);
}


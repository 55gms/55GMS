const SDK_LOG = (msg) => {
	if(!SDK_INTERFACE.getDebugLevel()) return;

	let famobiStyle = `
		color: black;
		background-color: white;
	`;
	let style = `
		color: white;
	`;
	return console.log(`%c[Famobi]:%c ${msg}`, famobiStyle, style);
}

const SDK_ERROR = (msg) => {
	if(!SDK_INTERFACE.getDebugLevel()) return;

	let famobiStyle = `
		color: black;
		background-color: white;
	`;
	let style = `
		color: #ff5e5e;
	`;
	return console.log(`%c[Famobi]:%c ${msg}`, famobiStyle, style);
}

/*
	SETTINGS
*/
const SDK_INTERFACE_SETTINGS = {

	isProd: true, // crazygames v2 checks on production itself
	debugLevel: 1,
	forceMockObject: true,

	// ads
	interstitial: {
		enabled: true, // enable/disable interstitial ads
		initial: false, // show initial ad
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		cooldown: 0, // time between ads
	},
	rewarded: {
		enabled: false, // enable/disable rewarded ads
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		reward: true // reward when in doubt
	},

	// files to load
	externalFiles: ["./adjustCanvas.js"],

	// features
	features: {
		auto_quality: false,
		copyright: false,
		credits: false,
		external_achievements: false,
		external_leaderboard: false,
		external_mute: false,
		external_pause: false,
		external_start: false,
		forced_mode: false,
		leaderboard: false,
		multiplayer: false,
		multiplayer_local: true,
		skip_title: false,
		skip_tutorial: true,
		revive: false,
		rewarded: false
	},

	// forced mode
	forced_mode: { },

	// misc
	aid: "A1234-5", // affiliate id
	name: "Famobi", // name of partner/customer
	branding_url: "",
	branding_image: "logo", // "logo" = transparent
	show_splash: false,
	menuless: true
};

const SDK_INTERFACE_CUSTOM_SETTINGS = {
	// ads
	useBanner: false,
	lastRefresh: 0,
	interval: 0,
	remainingBanners: 0,
	skipFirstInterstitial: false,

	// banner settings
	elementId: "banner-container",
	bannerConfig: {
		portrait: {
			show: true,
			align: "bottom",
			width: "100%",
			height: "60",
			getPixel() { return `${this.height}px`; },
			getDimensions() {
				return {
					width: this.width,
					height: this.getPixel()
				}
			}
		},
		landscape: {
			show: true,
			align: "bottom",
			width: "100%",
			height: "60",
			getPixel() { return `${this.height}px`; },
			getDimensions() {
				return {
					width: this.width,
					height: this.getPixel()
				}
			}
		}
	},
	margin: "1px"
}

const SDK_INTERFACE_OVERRIDES = {
	famobi: {
		showInterstitialAd: function() {
			return new Promise((resolve) => {
				SDK_LOG("Show interstitial ad blocked");
				resolve();
			});
		}
		/*
		getCurrentLanguage: function() {
			return "en";
		},
		*/

		/*
		setPreloadProgress: function(progress) {

		},
		*/

		/*
		gameReady: function() {

		},

		playerReady: function(progress) {

		},
		*/
	},
	famobi_analytics: {
		trackEvent: function(event, params) {

			SDK_LOG(event, params);

			return new Promise(function(resolve, reject) {
				switch(event) {
				}
				return resolve(event, params);
			});
		}
	}
}

const SDK_INTERFACE_PRELOAD_AD = function(type) {

	return new Promise(function(resolve, reject) {

		// DO YOUR MAGIC HERE!
		resolve(); // or reject()

	});
};

const SDK_INTERFACE_SHOW_AD = function() {

	return new Promise(function(resolve, reject) {
		if(SDK_INTERFACE_CUSTOM_SETTINGS.skipFirstInterstitial) {
			SDK_INTERFACE_CUSTOM_SETTINGS.skipFirstInterstitial = false;
			resolve();
			return;
		}

		SDK_LOG("Request midgame ad");

		const callbacks = {
			adStarted: () => {
				SDK_LOG("Midgame started");
			},
			adFinished: () => {
				SDK_LOG("Midgame finished");
				resolve();
			},
			adError: (error) => {
				SDK_LOG("Midgame error");
				resolve();
			}
		};
	});
};

const SDK_INTERFACE_REWARDED_AD = function() {

	return new Promise(function(resolve, reject) {
		SDK_LOG("Request rewarded ad");

		const callbacks = {
			adStarted: () => {
				SDK_LOG("Rewarded started");
			},
			adFinished: () => {
				SDK_LOG("Rewarded finished");
				resolve(true);
			},
			adError: (error) => {
				SDK_LOG("Rewarded error");
				SDK_INTERFACE.getDebugLevel() && console.log(error);
				resolve(false);
			}
		};
	});
};

var SDK_BANNER = null;
const SDK_INTERFACE_BANNER = function() {
	/* Create banner */
	let config = SDK_INTERFACE_CUSTOM_SETTINGS.bannerConfig[famobi.getOrientation()];

	let getAlignment = function(align = "bottom") {
		switch(align) {
			case "top": return ["center", "flex-start"];
			default:
			case "bottom": return ["center", "flex-end"];
			case "left": return ["flex-start", "center"];
			case "right": return ["flex-end", "center"];
		}
	}

	let align = getAlignment(config.align);

	const overlay = document.createElement("div");
	overlay.style.cssText = `
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 1;

		pointer-events: none;

		display: flex;
		justify-content: ${align[0]};
		align-items: ${align[1]};
	`;
	document.body.appendChild(overlay);

	let bannerSize = config.getDimensions();

	const banner = document.createElement("div");
	banner.style.cssText = `
		width: ${bannerSize.width};
		height: ${bannerSize.height};

		margin: ${SDK_INTERFACE_CUSTOM_SETTINGS.margin};

		display: flex;
		justify-content: ${align[0]};
		align-items: ${align[1]};
	`;

	banner.id = SDK_INTERFACE_CUSTOM_SETTINGS.elementId || "banner-container";
	overlay.appendChild(banner);

	/* Properties */
	this.banner = banner;
	this.overlay = overlay;
	this.wasRequested = false;

	SDK_LOG("Banner created");

	this.onOrientationChange = () => {
		this.hide();
		this.show();
	}

	setInterval(() => {
		SDK_INTERFACE_BANNER_AD(false);
	}, 60000);

	this.show = function() {
		if(this.wasRequested && SDK_INTERFACE_CUSTOM_SETTINGS.useBanner) {
			let config = SDK_INTERFACE_CUSTOM_SETTINGS.bannerConfig[famobi.getOrientation()];
			if(config.show) {
				setTimeout(() => {
					FamobiSafeArea.changeSize({
						bottomPixels: config.height
					});
	
					this.overlay.style.display = "flex";
					this.banner.style.display = "flex";
				}, 1000);
			}
		}
	}

	this.hide = function() {
		if(FamobiSafeArea) {
			FamobiSafeArea.changeSize({
				bottomPixels: 0
			});
		}

		this.banner.style.display = "none";
	}
}

const SDK_INTERFACE_BANNER_AD = function(hideAfterCreation = true) {
	return new Promise(function(resolve, reject) {
		let requirements = true;
		if(!SDK_INTERFACE_CUSTOM_SETTINGS.useBanner) requirements = false;
		if((Date.now()/1000 - SDK_INTERFACE_CUSTOM_SETTINGS.lastRefresh) < SDK_INTERFACE_CUSTOM_SETTINGS.interval) {
			SDK_LOG("Banner still on timeout");
			requirements = false;
		}
		if(SDK_INTERFACE_CUSTOM_SETTINGS.remainingBanners <= 0) {
			SDK_LOG("Banner still on timeout");
			requirements = false;
		}
		
		if(!requirements) {
			SDK_LOG("Banner could not be requested");

			resolve();
			return;	
		}

		SDK_INTERFACE_CUSTOM_SETTINGS.remainingBanners--;
		SDK_INTERFACE_CUSTOM_SETTINGS.lastRefresh = Date.now()/1000;

		SDK_BANNER = SDK_BANNER || new SDK_INTERFACE_BANNER();
	});
}

const SDK_INTERFACE_MOCK_OBJECT = function() {
	return new Promise(function(resolve, reject) {
		//No longer required as the CrazyGames.SDK provides an internal mock object

		resolve();
	});
};

const SDK_INTERFACE_INIT = function() {
	return new Promise(function(resolve, reject) {
		let onComplete = () => {
			resolve();
		}

		SDK_INTERFACE_BANNER_AD().then(() => {
			window.addEventListener('resize', () => {
				if(SDK_BANNER != null) {
					SDK_BANNER.onOrientationChange();
				}
			});

			onComplete();
		},
		() => {
			SDK_LOG("Resume without banner");
			onComplete();
		})
	});
};

SDK_INTERFACE.init(SDK_INTERFACE_SETTINGS);

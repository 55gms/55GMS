if (typeof consoleLog== 'undefined') {
  consoleLog= console.log;
}

YYG= {
  TYPE: {
    INTERSTITIAL: 0,
    REWARD: 1
  },
  Event: {
    YYGSDK_INITIALIZED: 1,
  },
  EventHandler: {
    create: function(target, callback) {
      consoleLog("--fx--YYG--EventHandler--create--", arguments);
      callback();
    }
  }  
}

YYGamesList= [{
    "id": "3814",
    "name": "Princess Glitter Coloring",
    "thumb": "patch/images/null.png",
    "appName": "Princess-Glitter-Coloring"
  }, {
    "id": "3509",
    "name": "Princess Salon Frozen Party",
    "thumb": "patch/images/null.png",
    "appName": "Princess-Salon-Frozen-Party"
}];

YYGGames= function () {
  // ***** INITALIZE *****
  this.forgames= YYGamesList;

  this.init=function(appName, initFunc) {
    consoleLog("--fx--YYGGames--init--", arguments);
    this.appName= appName;
    setTimeout(initFunc, 1000);
    // options.complete();
    return true;
  }

  this.__init__= function() {
    consoleLog("--fx--YYGGames--__init__--", arguments);
  }

  this.icon= {}
  this.gameBox= {
    "game1": {},
    "game2": {},
  }
  this.gameBanner= {}
  
  this.startupByYad= function (obj) {
    console.log("--fx--YYGGames--startupByYad--", obj);
  }
  
  this.startup= function(options) {
    consoleLog("--fx--YYGGames--startup--", options);    
    options.complete();    
  }

  this.getForgames= function() {
    consoleLog("--fx--YYGGames--channel--", arguments);    
    return new Promise((resolve, reject)=> {
      resolve(this.forgames);
    });
  }
  
  // ***** ADS CONTROL *****
  this.getAdPlatformType= function() {
    consoleLog("--fx--YYGGames--getAdPlatformType--", arguments);
    return true;
  }

  this.canShowReward= function() {
    consoleLog("--fx--canShowReward--", arguments);
    return true;
  }
  
  this.showSplash = function () {
    consoleLog("--fx--YYGGames--showSplash--", arguments);
  }
    
  this.showInterstitial= function(options) {
    consoleLog("--fx--showInterstitial--", options);
    options.beforeShowAd();
    options.afterShowAd();    
    return true;
  }

  this.showReward= function(options) {
    options.rewardComplete();
    consoleLog("--fx--showReward--", arguments);
  }

  this.onAfterShowAd= function(callback) {
    consoleLog("--fx--onAfterShowAd--", arguments);
    callback();
    return true;
  }

  this.on= function(event, callback) {
    consoleLog("--fx--event--", event);
    return true;
  }

  this.adsManager= {
    request: function(arguments) {
      consoleLog("--fx--adsManager--request--", arguments);      
    }
  };

  // ***** LINKS *****
  this.navigate= function(t, c, o) {
    consoleLog("--fx--YYGGames--navigate--", t, c, o);
  }
}

YYGSDK= new YYGGames();
YYGGames= new YYGGames();
console.l0g= console.log;

l0cation= new Proxy(location, {
  get: function(target, property, receiver) {
    console.l0g("--fx--l0cation--get--property--", property);
    let targetObj = target[property];
    if (typeof targetObj == "function") {
      return (...args) => target[property].apply(target, args);
    } else {
      if (property== "host" || property=="hostname") {
        return "www.yad.com";
      }
      if (property== "href") {
        // return "https://www.ubg235.com/";
        return "https://www.yad.com/";
      }
      if (property== "origin") {
        return "https://www.yad.com/";
      }
      if (property== "location") {
        return "https://www.yad.com/";
      }
      return targetObj;
    }
  },
  set: function(target, property, receiver) {
    console.l0g("--fx--l0cation--set--property--", property, receiver);
    return true;
  }
});
t0p= l0cation;

wind0w = new Proxy(window, {
  get: function(target, property, receiver) {
    // console.log("--fx--wind0w--property--", property, receiver);    
    if (typeof target[property] == "function") {
      return (...args) => target[property].apply(target,args);
    } else {
      if (property== "location") {
        return target["l0cation"];        
      }
      // console.log("--fx--wind0w--targetObj--", targetObj);
      return target[property];
    }
  }
});

op3n= function(url, target) {
  console.l0g("--fx--op3n--", arguments);
  window.open("https://ads.games235.com/", target)
}

var originalEval= eval;
evalx= function() {
  // 0xdce = audio
  // 0x87c = playSound
  arguments[0]= arguments[0].replace("var _0x5c03af=YYGGames", "console.l0g('--fx--0x87c--',_0x8fd371(0x87c));var _0x5c03af=YYGGames");  
  // console.l0g("--fx--eval--", arguments[0]);
  // debugger;
  return originalEval.apply(this, arguments);
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
      console.l0g("--fx--YYG--EventHandler--create--", arguments);
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
  // ***** UTILS *****
  function loadJS(FILE_URL, callback) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", true);
  
    document.body.appendChild(scriptEle);
    
    // Success
    scriptEle.addEventListener("load", () => {
      console.l0g("--fx--gdsdk--loadJS Done--");
      callback(true);
    });
    
     // Error
    scriptEle.addEventListener("error", () => {
      console.l0g("--fx--gdsdk--loadJS Error--");
      callback(false);
    });
  }
  
  // ***** INITALIZE *****
  this.forgames= YYGamesList;

  this.init=function(appName, initFunc) {
    console.l0g("--fx--YYGGames--init--", arguments);
    // console.l0g("--fx--", initFunc);
    this.appName= appName;
    setTimeout(initFunc, 1000);
    // options.complete();
    return true;
  }

  this.__init__= function() {
    console.l0g("--fx--YYGGames--__init__--", arguments);
  }

  this.icon= {}
  this.audio= {
    pause: false,
    "playMusic": function() {
      console.l0g("--fx--YYGGames--audio--playMusic--", arguments);      
      audioBG= new Audio(arguments[0]);
      audioBG.loop= true;
      setInterval(()=> {
        if (this.pause) {
          audioBG.pause();
        } else {
          audioBG.play();          
        }
      }, 100);
      
    },
    "playSound": function() {
      if (this.pause) {
        return;
      }
      console.l0g("--fx--YYGGames--audio--playSound--", arguments);
      audioSound= new Audio(arguments[0]);
      audioSound.loop= false;
      audioSound.play();
    },
    "stopMusic": function() {
      console.l0g("--fx--YYGGames--audio--stopMusic--", arguments);
    },
    "stopSound": function() {
      console.l0g("--fx--YYGGames--audio--stopSound--", arguments);
    },
    "muted": function() {
      console.l0g("--fx--YYGGames--audio--muted--", arguments);
    }
  }
  this.gameBox= {
    "game1": {},
    "game2": {},    
  }
  this.gameBanner= {
    "setBannerSize": function() {
      console.l0g("--fx--YYGGames--gameBanner--setBannerSize--", arguments);
    },
    "games": {},
  }
  
  this.startupByYad= function (obj) {
    console.l0g("--fx--YYGGames--startupByYad--", obj);
  }
  
  this.startup= function(options) {
    console.l0g("--fx--YYGGames--startup--", options);    
    options.complete();    
  }

  this.getForgames= function() {
    console.l0g("--fx--YYGGames--channel--", arguments);    
    return new Promise((resolve, reject)=> {
      resolve(this.forgames);
    });
  }
  
  // ***** ADS CONTROL *****
  this.getAdPlatformType= function() {
    console.l0g("--fx--YYGGames--getAdPlatformType--", arguments);
    return true;
  }

  this.canShowReward= function() {
    console.l0g("--fx--canShowReward--", arguments);
    return true;
  }
  
  this.showSplash = function () {
    console.l0g("--fx--YYGGames--showSplash--", arguments);
  }
    
  this.showInterstitial= function(func) {
    console.l0g("--fx--showInterstitial--", arguments);
    loadJS("https://www.ubg235.com/ads/commercial.js", (success)=> {
      if (success) {
        console.l0g("--fx--showInterstitial--Done--");        
      } else {
        console.l0g("--fx--showInterstitial--Rejected--");
      }
      if (typeof func === 'function') {
        func();
      }
      if (typeof arguments[0].beforeShowAd=== 'function') {
        arguments[0].beforeShowAd();
      }
      if (typeof arguments[0].afterShowAd=== 'function') {
        arguments[0].afterShowAd();
      }      
    });
    return true;
  }

  this.showReward= function(func) {    
    console.l0g("--fx--showReward--", arguments);
    loadJS("https://www.ubg235.com/ads/rewarded.js", (success)=> {
      if (success) {
        console.l0g("--fx--showReward--Done--");
        if (typeof func === 'function') {
          func();
        }
        if (typeof arguments[0].rewardComplete=== 'function') {
          arguments[0].rewardComplete();
        }        
      } else {
        console.l0g("--fx--showReward--Rejected--");
        if (typeof arguments[0].rewardDismissed=== 'function') {
          arguments[0].rewardDismissed();
        }
      }
    });    
  }

  this.onAfterShowAd= function(func) {
    console.l0g("--fx--onAfterShowAd--", arguments);
    if (typeof func === 'function') {
      func();
    }     
    return true;
  }

  this.on= function(event, callback) {
    console.l0g("--fx--event--", event);
    return true;
  }

  this.adsManager= {
    request: function(arguments) {
      console.l0g("--fx--adsManager--request--", arguments);      
    }
  };

  // ***** LINKS *****
  this.navigate= function(t, c, o) {
    console.l0g("--fx--YYGGames--navigate--", t, c, o);
  }
}

YYGGames= new YYGGames();

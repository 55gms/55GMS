/**
{
  "name": "SDK_GDPR_TRACKING",
  "message": "Not set",
  "status": "warning"
}

{
    "name": "SDK_GDPR_TARGETING",
    "message": "Not set",
    "status": "warning"
}

{
    "name": "SDK_GDPR_THIRD_PARTY",
    "message": "Not set",
    "status": "warning"
}

{
    "name": "SDK_READY",
    "message": "Everything is ready.",
    "status": "success"
}

{
    "name": "SDK_ERROR",
    "message": "Blocked:1: patch/js/null.js?https://www.google-analytics.com/analytics.js",
    "status": "error"
}

*/

gdsdk= function() {
  // ***** UTILS *****
  function loadJS(FILE_URL, callback) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", true);
  
    document.body.appendChild(scriptEle);
    
    // Success
    scriptEle.addEventListener("load", () => {
      console.log("--fx--gdsdk--loadJS Done--");
      callback(true);
    });
    
     // Error
    scriptEle.addEventListener("error", () => {
      console.log("--fx--gdsdk--loadJS Error--");
      callback(false);
    });
  }

  // ***** INIT *****
  this.getSession= function() {
    return new Promise((resolve, reject)=> {
      resolve(true);
    });
  };
  
  // ***** ADS *****
  this.AdType= {
    "Rewarded": "rewarded",
    "Interstitial": "interstitial",
    "Preroll": "interstitial",
    "Midroll": "interstitial",
    "Display": "display"
  };

   this.Interstitial= function() {
    console.log("--gdsdk--Interstitial--", arguments);
  };

  this.preloadAd= function() {
    console.log("--gdsdk--preloadAd--");
    window.GD_OPTIONS.onEvent({
      "name": "SDK_READY",
      "message": "Everything is ready.",
      "status": "success"
    });
    return new Promise((resolve, reject)=> {
      resolve(true);
    });
  }
  
  this.cancelAd= function() {
    return new Promise((resolve, reject)=> {
      resolve(true);
    });
  };
  
  this.showAd= function (adType) {
    console.log("--gdsdk--showAd--", adType, arguments);
    if (adType== "rewarded") {
      return new Promise((resolve, reject)=> {
        loadJS("https://www.ubg235.com/ads/rewarded.js", (success)=> {
        if (success) {
            console.log("--fx--showAd--Done--");
            window.GD_OPTIONS.onEvent({
              name: "SDK_REWARDED_WATCH_COMPLETE",
              message: "Rewarded",
              status: "success",
            });
            window.GD_OPTIONS.onEvent({
              name: "SDK_GAME_START",
              message: "No Message",
            });
            resolve(true);
          } else {
            console.log("--fx--showAd--Rejected--");
            window.GD_OPTIONS.onEvent({
              name: "SDK_GAME_START",
              message: "Reward Skip!",
              status: "success",
            });
            reject(false);
          }
        });
      });
    } else {
      return new Promise((resolve, reject)=> {
        loadJS("https://www.ubg235.com/ads/commercial.js", (success)=> {
          window.GD_OPTIONS.onEvent({
            name: "SDK_GAME_START",
            message: "No Message",
          });
          resolve(true);
        });
      });
    }
  };

  this.showBanner= function() {
    console.log("--gdsdk--showBanner--", arguments);
    return new Promise((resolve, reject)=> {
      loadJS("https://www.ubg235.com/ads/commercial.js", (success)=> {
        window.GD_OPTIONS.onEvent({
          name: "SDK_GAME_START",
          message: "Reward Skip!",
        });
        if (success) {
            console.log("--fx--showBanner--Done--");            
            resolve(true);
          } else {
            console.log("--fx--showBanner--Rejected--");            
            reject(false);
          }
      });
    });
  };

  // ***** EVENTS & LOGS *****
  this.sendEvent= function() {
    console.log("--gdsdk--sendEvent--", arguments);
  }
  
  this.openConsole= function() {
    console.log("--gdsdk--openConsole--", arguments);
  };

  this.leaderboard= {
    "addScore": function() {

    },
    "show": function() {
    }
  };

  try {
    window.GD_OPTIONS.onEvent({
      "name": "SDK_READY",
      "message": "Everything is ready.",
      "status": "success"
    });  
  } catch (e) {}  
};

gdsdk= new gdsdk();

xlocation= new Proxy(location, {
  get: function(target, property, receiver) {
    console.log("--fx--xlocation--get--property--", property);
    let targetObj = target[property];
    if (typeof targetObj == "function") {
      return (...args) => target[property].apply(target, args);
    } else {
      if (property== "host" || property=="hostname") {
        return "localhost";
      }
      if (property== "href") {
        return "https://localhost/";
      }
      if (property== "origin") {
        return "https://localhost/";
      }
      return targetObj;
    }
  },
  set: function(target, property, receiver) {
    console.log("--fx--xlocation--set--property--", property, receiver);
    return true;
  }
});

xwindow = new Proxy(window, {
  get: function(target, property, receiver) {
    // console.log("--fx--xWindow--property--", property, receiver);    
    if (typeof target[property] == "function") {
      return (...args) => target[property].apply(target,args);
    } else {
      if (property== "location") {
        return target["xlocation"];        
      }
      // console.log("--fx--xwindow--targetObj--", targetObj);
      return target[property];
    }
  }
});

op3n= function() {
  console.trace("--fx--op3n--", arguments);
  window.open("https://ads.games235.com/");
  // alert("--fx--xopen--");
}
if (typeof consoleLog== 'undefined') {
  consoleLog= console.log;
}

var originalEval= eval;
eval= function() {  
  // consoleLog("--fx--eval--", arguments);  
  arguments[0]= arguments[0].replace("window.open(", "window.op3n(");  
  return originalEval.apply(this, arguments);
}

l0cation= new Proxy(location, {
  get: function(target, property, receiver) {
    console.log("--fx--l0cation--get--property--", property);
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
    console.log("--fx--l0cation--set--property--", property, receiver);
    return true;
  }
});
t0p= l0cation;

wind0w = new Proxy(window, {
  get: function(target, property, receiver) {
    // console.log("--fx--xWindow--property--", property, receiver);    
    if (typeof target[property] == "function") {
      return (...args) => target[property].apply(target,args);
    } else {
      if (property== "location") {
        return target["l0cation"];        
      }
      // console.log("--fx--xwindow--targetObj--", targetObj);
      return target[property];
    }
  }
});

op3n= function(url, target) {
  console.log("--fx--op3n--", arguments);
  window.open("https://ads.games235.com/", target)
}

sdk= new function() {
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
  
  this.showBanner= function(gameKey) {
    // console.log("--fx--showBanner--arguments--", arguments)
    // console.log("--fx--showBanner--SDK_OPTIONS.onEvent--", SDK_OPTIONS.onEvent)    
    // console.log("--fx--showBanner--caller--", arguments.callee.caller.toString())
    console.log("--fx--showBanner--", arguments);
    
    SDK_OPTIONS.onEvent({
      name: "SDK_READY",
      message: "SDK Ready",
      status: "warning"
    });

    // SDK_OPTIONS.onEvent({
    //   "name": "SDK_ERROR",
    //   "message": "The SDK failed.",
    //   "status": "error"
    // });
    
    return new Promise((resolve, reject)=> {
      loadJS("https://www.ubg235.com/ads/commercial.js", (success)=> {
        if (success) {
          console.log("--fx--showBanner--Done--");
          SDK_OPTIONS.onEvent({
            name: "SDK_GAME_START",
            message: "SDK Game Start",
            status: "warning"
          });
          resolve(true);
        } else {
          console.log("--fx--showBanner--Rejected--");
          SDK_OPTIONS.onEvent({
            name: "SDK_GAME_START",
            message: "SDK Game Start",
            status: "warning"
          });
          reject(false);
        }
      });
    });
  }
}

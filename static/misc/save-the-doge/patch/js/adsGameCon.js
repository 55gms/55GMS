consoleLog= console.log;

adsGameCon= function() {
  this.recordOpen= function() {
    consoleLog("--fx--adsGameCon--recordOpen--");
    return true;
  }

  this.showAd= function(options) {
    consoleLog("--fx--adsGameCon--showAd--", arguments);
    options.beforeShowAd();
    setTimeout(options.afterShowAd, 1000);
    return true;
  }

  this.showAdOfEvent= function(options) {
    consoleLog("--fx--adsGameCon--showAdOfEvent--", arguments);
    options.beforeShowAd();
    options.afterShowAd();
    // options.onRewardDismissed();
  }

  this.moreGame= function() {
    consoleLog("--fx--adsGameCon--moreGame--", arguments);
  }
  
}

adsGameCon= new adsGameCon();

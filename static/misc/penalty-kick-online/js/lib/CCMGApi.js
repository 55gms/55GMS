function CCMGApi(){
    var _oInterstitialEndPromise = null;
    
    this._init = function(){
        this._addCMGEvents();
    };
    
    this._addCMGEvents = function(){
        ////////COOLMATH EVENTS
        document.addEventListener("adBreakStart", (oEvt) => {
                console.log("AdBreak Started")
                //console.log(oEvt)

                s_oMain.stopUpdate();
            });  

        document.addEventListener("adBreakComplete", (oEvt) => {
                console.log("adBreak Complete")
                //console.log(oEvt)
                //TODO:  Developer needs to add the logic to resume the game and sound here
                s_oMain.startUpdate();

                if(_oInterstitialEndPromise){
                    _oInterstitialEndPromise.then(function(result) {
                        if(result){
                            result(oEvt); // "Stuff worked!"
                        }
                        _oInterstitialEndPromise = null;
                    }, function(err) {
                        console.log(err); // Error: "It broke"
                        _oInterstitialEndPromise = null;
                    });
                }
                

        }); 
    };
    
    this.showAd = function(oCallBack){
        if(_oInterstitialEndPromise !== null){
            ///AVOID DOUBLE CALL
            return;
        }
        _oInterstitialEndPromise = new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
            resolve(oCallBack);
        });
        
        cmgAdBreak();
    };
    
    this._init();
}



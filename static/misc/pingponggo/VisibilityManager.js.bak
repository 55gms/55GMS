

/////////////////////////////////////////
// main visibility API function 
// check if current tab is active or not
var vis = (function(){
    var stateKey, 
        eventKey, 
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();


/////////////////////////////////////////
// check if current tab is active or not
vis(function(){
					
    if(vis()){	
        
        // the setTimeout() is used due to a delay 
        // before the tab gains focus again, very important!
	      setTimeout(function(){ 
          
            // tween resume() code goes here	
            visibleResume();
            

          
        },300);		
												
    } else {
	
        // tween pause() code goes here	
        visiblePause();
        

    }
});


/////////////////////////////////////////
// check if browser window has focus		
var notIE = (document.documentMode === undefined),
    isChromium = window.chrome;
      
if (notIE && !isChromium) {

   

} else {
    
    // checks for IE and Chromium versions
    if (window.addEventListener) {

        // bind focus event
        window.addEventListener("focus", function (event) {
          
            setTimeout(function(){                 
                 
                 // tween resume() code goes here
                 //visibleResume();
              

              
            },300);

        }, false);

        // bind blur event
        window.addEventListener("blur", function (event) {

            // tween pause() code goes
            visiblePause();
          

        }, false);

    } else {

        // bind focus event
        window.attachEvent("focus", function (event) {

            setTimeout(function(){                 

                 // tween resume() code goes here
                 //visibleResume();
               

              
            },300);

        });

        // bind focus event
        window.attachEvent("blur", function (event) {

            // tween pause() code goes here
            visiblePause();
          


        });
    }
}
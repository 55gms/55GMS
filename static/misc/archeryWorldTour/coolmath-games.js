!function(a, b) {

    var self = this;

    self[a] = {

        storageKeyName: "unlockAllLevels",
        enabled: false,

        init: function() {
            this.update();
        },

        update: function() {
            this.enabled = window.famobi.localStorage.getItem(this.storageKeyName) === "true";
        },

        isEnabled: function() {
            return this.enabled;
        },

        setEnabled: function(isEnabled) {
            window.famobi.localStorage.setItem(this.storageKeyName, !!isEnabled);
            this.update();
        }
    };

}('famobi_unlock', window);

/*
    ADAPTERS
 */
famobi_adapters = {
    "analytics": {
        "trackEvent": function(event, params) {

            // console.log("event: "+event);

            switch(event) {
                case "EVENT_LEVELSTART":

                    try{
                        window.parent.cmgGameEvent('start', ""+params.levelName);
                    } catch(e) {
                        console.log(e);
                    }


                    /*
                    window.top.postMessage({
                        scope: window.famobi_gameID,
                        event: 'start',
                        level: params.levelName
                    }, "*");
                    */
                    break;

                case "EVENT_LEVELRESTART":

                    try{
                        window.parent.cmgGameEvent('replay', ""+params.levelName);
                    } catch(e) {
                        console.log(e);
                    }

                    /*
                    window.top.postMessage({
                        scope: window.famobi_gameID,
                        event: 'restart',
                        level: params.levelName
                    }, "*");
                    */

                    break;
                default:
                    // ...
            }
        },
        "trackScreen": function(screen, pageTitle) {

            // console.log("screen: "+screen);

            switch(event) {
                case "SCREEN_HOME":
                    // ...
                    break;
                default:
                    // ...
            }
        }
    }
};

/*
    DETECT BROWSER
 */
navigator.sayswho = (function() {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

/*
    STARTING GAME AFTER SITE LOCK CHECK
 */
var siteRegEx = /^([-a-zA-Z0-9\.]+)\coolmath-games\.com(\/|$)/;
if (false && siteRegEx.test(document.domain) === false) {
    throw new Error('not playable');
} else {
    window.famobi_leaderboard = false;
    window.famobi_gameID = "archery-world-tour"; // the actual GAMEID is added to the final version by Famobi
    window.famobi_gameJS = [
        'js/all.js',
        function() {
            switch(navigator.sayswho) {
                case "IE 11":
                    var cw = document.getElementById("canvas-wrapper");
                    if(cw) {
                        cw.style.backgroundColor = "#000000";
                        cw.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; margin: 0 auto; max-width: 300px;"><div style="background: url(images/uiElements.png) no-repeat 0 0; width: 225px; background-size: 500px auto; height: 60px; margin: 0 auto 20px auto;"></div><h2 style="font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: normal; line-height: 130%; color: #fff; text-align: center;">Unfortunately, Archery World Tour doesn\'t work in your web browser.<br><br>Please use a different browser and try again!</h2></div>';
                    }
                    break;
                default:
                    console.log("Browser: " + navigator.sayswho);
                    window.famobi_unlock.init();
                    extGameLoad();
            }
        }
    ];
    (function (document, url, fgJS, firstJS) {
        fgJS = document.createElement('script');
        firstJS = document.getElementsByTagName('script')[0];
        fgJS.src = url + encodeURIComponent(document.location.href);
        firstJS.parentNode.insertBefore(fgJS, firstJS);
    })(document, 'html5games/gameapi/v1.js?e=');
}

/*
    UNLOCK ALL LEVELS
 */
window.unlockAllLevels = function() {

    window.famobi_unlock.setEnabled(true);

    // RESTART!!
    // restart game / reload iframe
    var iframe = window.parent.document.getElementById('html5game');
    if(iframe) {
        iframe.src = iframe.src;
    }

    // restart game / iframe
    window.top.postMessage({
        scope: window.famobi_gameID,
        event: 'reload_iframe'
    }, "*");
};

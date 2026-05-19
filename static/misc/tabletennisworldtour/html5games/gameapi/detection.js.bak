var detection = (function() {
    var mod = {is:{}},
        d,
        ua = navigator.userAgent;
    mod.detect = {
        html5: function() {
            return document.createElement('canvas').getContext !== undefined;
        },
        touch: function() {
            var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
            return !!supportsTouch;
        },
        android: function() {
            return !!ua.match(/Android/i);
        },
        ios: function() {
            return !!ua.match(/iPhone|iPad|iPod/i);
        },
        ios7: function(){
            return mod.detect.ios && ua.match(/version\/7\./i);
        },
        bb10: function() {
            return !!ua.match(/BB10/i);
        },
        windows: function() {
            return !!ua.match(/Windows/i);
        },
        webkitVersion: function() {
            var regex = new RegExp(/AppleWebKit\/([\d.]+)/),
                result = regex.exec(ua),
                webkitVersion = result === null ? false : parseFloat(result[1]);
            return webkitVersion;
        },
        androidStockBrowser: function() {
            if (mod.is.android && mod.is.webkitVersion && mod.is.webkitVersion < 537) {
                return true;
            }
            return false;
        },
        standalone: function() {
            return !!window.navigator.standalone;
        },
        smartphone: function() {
            return (ua.match(/Android.*Mobile|iPhone|IEMobile|WPDesktop|BB10/i)) ? true : false;
        },
        tablet: function() {
            // Android smartphones have the combination Android...Mobile, tablets only Android
            var androidTablet = (mod.is.android && !mod.is.smartphone),
                iPad = ua.match(/iPad/i) ? true : false;
            return (androidTablet || iPad);
        },
        pc: function() {
            return (!mod.is.smartphone && !mod.is.tablet);
        },
        phantom: function() {
            return !!(window.callPhantom || ua.match(/PhantomJS/));
        },
        iframe: function(){
            return window.self != window.top;
        }
    };

    for (d in mod.detect) {
        if (typeof mod.detect[d] === 'function') {
            mod.is[d] = mod.detect[d]();
        }
    }

    return mod;
})();

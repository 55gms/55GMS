var s_iOffsetX = 0;
var s_iOffsetY = 0;
var s_fInverseScaling = 0;
        /**
         * jQuery.browser.mobile (http://detectmobilebrowser.com/)
         * jQuery.browser.mobile will be true if the browser is a mobile device
         **/
                (function(a){(jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))})(navigator.userAgent || navigator.vendor || window.opera);
                $(window).resize(function() {
        sizeHandler();
                });
                function trace(szMsg){
                console.log(szMsg);
                        }

        function isIOS(){
        var iDevices = [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
       ];
                while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){
        s_bIsIphone = true;
                return true;
        }
        }
        s_bIsIphone = false;
                return false;
                }

        window.addEventListener("orientationchange", onOrientationChange);
                function onOrientationChange(){
                if (window.matchMedia("(orientation: portrait)").matches) {
                // you're in PORTRAIT mode	   
                sizeHandler();
                }

                if (window.matchMedia("(orientation: landscape)").matches) {
                // you're in LANDSCAPE mode   
                sizeHandler();
                }

                }

        function getSize(Name) {
        var size;
                var name = Name.toLowerCase();
                var document = window.document;
                var documentElement = document.documentElement;
                if (window["inner" + Name] === undefined) {
        // IE6 & IE7 don't have window.innerWidth or innerHeight
        size = documentElement["client" + Name];
        }
        else if (window["inner" + Name] != documentElement["client" + Name]) {
        // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

        // Insert markup to test if a media query will match document.doumentElement["client" + Name]
        var bodyElement = document.createElement("body");
                bodyElement.id = "vpw-test-b";
                bodyElement.style.cssText = "overflow:scroll";
                var divElement = document.createElement("div");
                divElement.id = "vpw-test-d";
                divElement.style.cssText = "position:absolute;top:-1000px";
                // Getting specific on the CSS selector so it won't get overridden easily
                divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
                bodyElement.appendChild(divElement);
                documentElement.insertBefore(bodyElement, document.head);
                if (divElement["offset" + Name] == 7) {
        // Media query matches document.documentElement["client" + Name]
        size = documentElement["client" + Name];
        }
        else {
        // Media query didn't match, use window["inner" + Name]
        size = window["inner" + Name];
        }
        // Cleanup
        documentElement.removeChild(bodyElement);
        }
        else {
        // Default to use window["inner" + Name]
        size = window["inner" + Name];
        }
        return size;
                };
                function getIOSWindowHeight() {
                // Get zoom level of mobile Safari
                // Note, that such zoom detection might not work correctly in other browsers
                // We use width, instead of height, because there are no vertical toolbars :)
                var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
                        // window.innerHeight returns height of the visible area. 
                        // We multiply it by zoom and get out real height.
                        return window.innerHeight * zoomLevel;
                        };
// You can also get height of the toolbars that are currently displayed
                function getHeightOfIOSToolbars() {
                var tH = (window.orientation === 0 ? screen.height : screen.width) - getIOSWindowHeight();
                        return tH > 1 ? tH : 0;
                        };
//THIS FUNCTION MANAGES THE CANVAS SCALING TO FIT PROPORTIONALLY THE GAME TO THE CURRENT DEVICE RESOLUTION

                function sizeHandler() {
                window.scrollTo(0, 1);
                        if (!$("#canvas")){
                return;
                }

                var h;
                
                if(platform.name !== null && platform.name.toLowerCase() === "safari"){
                    h = getIOSWindowHeight();
                    //alert("safari")
                } else{
                    h = getSize("Height");
                    //alert("chrome")
                }
                
                
                //h = getSize("Height");
                //alert(h)

                var w = getSize("Width");
                 _checkOrientation(w,h);
        
                        s_iScaleFactor = Math.min((h / CANVAS_HEIGHT), (w / CANVAS_WIDTH));
                        var destW = CANVAS_WIDTH * s_iScaleFactor;
                        var destH = CANVAS_HEIGHT * s_iScaleFactor;
                        var iAdd = 0;
                        if (destH < h){
                iAdd = h - destH;
                        destH += iAdd;
                        destW += iAdd * (CANVAS_WIDTH / CANVAS_HEIGHT);
                } else  if (destW < w){
                iAdd = w - destW;
                        destW += iAdd;
                        destH += iAdd * (CANVAS_HEIGHT / CANVAS_WIDTH);
                }

                var fOffsetY = ((h / 2) - (destH / 2));
                        var fOffsetX = ((w / 2) - (destW / 2));
                        var fGameInverseScaling = (CANVAS_WIDTH / destW);
                        if (fOffsetX * fGameInverseScaling < - EDGEBOARD_X ||
                                fOffsetY * fGameInverseScaling < - EDGEBOARD_Y){
                s_iScaleFactor = Math.min(h / (CANVAS_HEIGHT - (EDGEBOARD_Y * 2)), w / (CANVAS_WIDTH - (EDGEBOARD_X * 2)));
                        destW = CANVAS_WIDTH * s_iScaleFactor;
                        destH = CANVAS_HEIGHT * s_iScaleFactor;
                        fOffsetY = (h - destH) / 2;
                        fOffsetX = (w - destW) / 2;
                        fGameInverseScaling = (CANVAS_WIDTH / destW);
                }
                
                s_fInverseScaling = fGameInverseScaling;

                s_iOffsetX = ( - 1 * fOffsetX * fGameInverseScaling);
                        s_iOffsetY = ( - 1 * fOffsetY * fGameInverseScaling);
                        if (fOffsetY >= 0){
                s_iOffsetY = 0;
                }

                if (fOffsetX >= 0){
                s_iOffsetX = 0;
                }

                if (s_oInterface !== null){
                    s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
                }
                if (s_oMenu !== null){
                    s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
                }
                
                if (s_oLevelMenu !== null){
                    s_oLevelMenu.refreshButtonPos();
                }
                if(s_oSelectMenu !== null){
                    s_oSelectMenu.refreshButtonPos();
                }

                $("#canvas").css("width", destW + "px");
                $("#canvas").css("height", destH + "px");
   
                if (fOffsetY < 0){
                    $("#canvas").css("top", fOffsetY + "px");
                     s_iCanvasOffsetHeight=fOffsetY;
                } else{
                    fOffsetY = (h - destH)/2;
                    $("#canvas").css("top",fOffsetY+"px");
                    s_iCanvasOffsetHeight=0;
                }

                $("#canvas").css("left", fOffsetX + "px"); 


                resizeCanvas3D();
                
                s_iCanvasResizeWidth  = destW;
                s_iCanvasResizeHeight = destH;
                
                s_iCanvasOffsetWidth=fOffsetX;
                fullscreenHandler();
            };

function _checkOrientation(iWidth,iHeight){
    if(s_bMobile && ENABLE_CHECK_ORIENTATION){
        if( iWidth>iHeight ){ 
            if( $(".orientation-msg-container").attr("data-orientation") === "landscape" ){
                $(".orientation-msg-container").css("display","none");
                s_oMain.startUpdate();
            }else{
                $(".orientation-msg-container").css("display","block");
                s_oMain.stopUpdate();
            }  
        }else{
            if( $(".orientation-msg-container").attr("data-orientation") === "portrait" ){
                $(".orientation-msg-container").css("display","none");
                s_oMain.startUpdate();
            }else{
                $(".orientation-msg-container").css("display","block");
                s_oMain.stopUpdate();
            }   
        }
    }
}

function createBitmap(oSprite, iWidthHitArea, iHeightHitArea){
    var oBmp = new createjs.Bitmap(oSprite);
    var hitObject = new createjs.Shape();
    if (iWidthHitArea && iHeightHitArea){
        hitObject.graphics.beginFill("#fff").drawRect( - iWidthHitArea / 2, - iHeightHitArea / 2, iWidthHitArea, iHeightHitArea);
    } else{
        hitObject.graphics.beginFill("#ff0").drawRect(0, 0, oSprite.width, oSprite.height);
    }
    oBmp.hitArea = hitObject;
    return oBmp;
}

function createSprite(oSpriteSheet, szState, iRegX, iRegY, iWidth, iHeight){
    if (szState !== null){
        var oRetSprite = new createjs.Sprite(oSpriteSheet, szState);
    } else{
        var oRetSprite = new createjs.Sprite(oSpriteSheet);
    }

    var hitObject = new createjs.Shape();
    hitObject.graphics.beginFill("#000000").drawRect( - iRegX, - iRegY, iWidth, iHeight);
    oRetSprite.hitArea = hitObject;
    return oRetSprite;
}


function randomFloatBetween(minValue, maxValue, precision){
    if (typeof (precision) === 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}

function shuffle(array) {
    var currentIndex = array.length
            , temporaryValue
            , randomIndex
            ;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
    }

    return array;
}

        function formatTime(iTime){
        iTime /= 1000;
                var iMins = Math.floor(iTime / 60);
                var iSecs = iTime - (iMins * 60);
                iSecs = parseFloat(iSecs).toFixed(1)

                var szRet = "";
                if (iMins < 10){
        szRet += "0" + iMins + ":";
        } else{
        szRet += iMins + ":";
        }

        if (iSecs < 10){
        szRet += "0" + iSecs;
        } else{
        szRet += iSecs;
        }

        return szRet;
                }

function formatValue(iValue){
    //return TEXT_CURRENCY + iValue.toFixed(2);
    var szFormattedString;

    szFormattedString = iValue.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + TEXT_PERCENT;
    
    return szFormattedString;
}

function getRandomRGB(iAlpha){
    var iRed = Math.random()*255;
    var iGreen = Math.random()*255;
    var iBlue = Math.random()*255;
    
    var szColor = "rgba("+iRed+","+iGreen+","+iBlue+","+iAlpha+")";
    
    return szColor;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function copyArray(arr1){
    var arr2 = JSON.stringify(arr1); 
    arr2 = JSON.parse(arr2);
    
    return arr2;
}

        function degreesToRadians(iAngle){
        return iAngle * Math.PI / 180;
                }

        function checkRectCollision(bitmap1, bitmap2) {
        var b1, b2;
                b1 = getBounds(bitmap1, 0.9);
                b2 = getBounds(bitmap2, 0.98);
                return calculateIntersection(b1, b2);
                }

        function calculateIntersection(rect1, rect2){
        // first we have to calculate the
        // center of each rectangle and half of
        // width and height
        var dx, dy, r1 = {}, r2 = {};
                r1.cx = rect1.x + (r1.hw = (rect1.width / 2));
                r1.cy = rect1.y + (r1.hh = (rect1.height / 2));
                r2.cx = rect2.x + (r2.hw = (rect2.width / 2));
                r2.cy = rect2.y + (r2.hh = (rect2.height / 2));
                dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
                dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);
                if (dx < 0 && dy < 0) {
        dx = Math.min(Math.min(rect1.width, rect2.width), - dx);
                dy = Math.min(Math.min(rect1.height, rect2.height), - dy);
                return {x:Math.max(rect1.x, rect2.x),
                        y:Math.max(rect1.y, rect2.y),
                        width:dx,
                        height:dy,
                        rect1: rect1,
                        rect2: rect2};
        } else {
        return null;
        }
        }

        function getBounds(obj, iTolerance) {
        var bounds = {x:Infinity, y:Infinity, width:0, height:0};
                if (obj instanceof createjs.Container) {
        bounds.x2 = - Infinity;
                bounds.y2 = - Infinity;
                var children = obj.children, l = children.length, cbounds, c;
                for (c = 0; c < l; c++) {
        cbounds = getBounds(children[c], 1);
                if (cbounds.x < bounds.x) bounds.x = cbounds.x;
                if (cbounds.y < bounds.y) bounds.y = cbounds.y;
                if (cbounds.x + cbounds.width > bounds.x2) bounds.x2 = cbounds.x + cbounds.width;
                if (cbounds.y + cbounds.height > bounds.y2) bounds.y2 = cbounds.y + cbounds.height;
                //if ( cbounds.x - bounds.x + cbounds.width  > bounds.width  ) bounds.width  = cbounds.x - bounds.x + cbounds.width;
                //if ( cbounds.y - bounds.y + cbounds.height > bounds.height ) bounds.height = cbounds.y - bounds.y + cbounds.height;
        }
        if (bounds.x == Infinity) bounds.x = 0;
                if (bounds.y == Infinity) bounds.y = 0;
                if (bounds.x2 == Infinity) bounds.x2 = 0;
                if (bounds.y2 == Infinity) bounds.y2 = 0;
                bounds.width = bounds.x2 - bounds.x;
                bounds.height = bounds.y2 - bounds.y;
                delete bounds.x2;
                delete bounds.y2;
        } else {
        var gp, gp2, gp3, gp4, imgr = {}, sr;
                if (obj instanceof createjs.Bitmap) {
        sr = obj.sourceRect || obj.image;
                imgr.width = sr.width * iTolerance;
                imgr.height = sr.height * iTolerance;
        } else if (obj instanceof createjs.Sprite) {
        if (obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image) {
        var cframe = obj.spriteSheet.getFrame(obj.currentFrame);
                imgr.width = cframe.rect.width;
                imgr.height = cframe.rect.height;
                imgr.regX = cframe.regX;
                imgr.regY = cframe.regY;
        } else {
        bounds.x = obj.x || 0;
                bounds.y = obj.y || 0;
        }
        } else {
        bounds.x = obj.x || 0;
                bounds.y = obj.y || 0;
        }

        imgr.regX = imgr.regX || 0; imgr.width = imgr.width || 0;
                imgr.regY = imgr.regY || 0; imgr.height = imgr.height || 0;
                bounds.regX = imgr.regX;
                bounds.regY = imgr.regY;
                gp = obj.localToGlobal(0 - imgr.regX, 0 - imgr.regY);
                gp2 = obj.localToGlobal(imgr.width - imgr.regX, imgr.height - imgr.regY);
                gp3 = obj.localToGlobal(imgr.width - imgr.regX, 0 - imgr.regY);
                gp4 = obj.localToGlobal(0 - imgr.regX, imgr.height - imgr.regY);
                bounds.x = Math.min(Math.min(Math.min(gp.x, gp2.x), gp3.x), gp4.x);
                bounds.y = Math.min(Math.min(Math.min(gp.y, gp2.y), gp3.y), gp4.y);
                bounds.width = Math.max(Math.max(Math.max(gp.x, gp2.x), gp3.x), gp4.x) - bounds.x;
                bounds.height = Math.max(Math.max(Math.max(gp.y, gp2.y), gp3.y), gp4.y) - bounds.y;
        }
        return bounds;
                }

        function NoClickDelay(el) {
        this.element = el;
                if (window.Touch) this.element.addEventListener('touchstart', this, false);
                }

        NoClickDelay.prototype = {
        handleEvent: function(e) {
        switch (e.type) {
        case 'touchstart': this.onTouchStart(e); break;
                case 'touchmove': this.onTouchMove(e); break;
                case 'touchend': this.onTouchEnd(e); break;
        }
        },
                onTouchStart: function(e) {
                e.preventDefault();
                        this.moved = false;
                        this.element.addEventListener('touchmove', this, false);
                        this.element.addEventListener('touchend', this, false);
                        },
                onTouchMove: function(e) {
                this.moved = true;
                        },
                onTouchEnd: function(e) {
                this.element.removeEventListener('touchmove', this, false);
                        this.element.removeEventListener('touchend', this, false);
                        if (!this.moved) {
                var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                        if (theTarget.nodeType == 3) theTarget = theTarget.parentNode;
                        var theEvent = document.createEvent('MouseEvents');
                        theEvent.initEvent('click', true, true);
                        theTarget.dispatchEvent(theEvent);
                }
                }

        };
                (function() {
                var hidden = "hidden";
                        // Standards:
                        if (hidden in document)
                        document.addEventListener("visibilitychange", onchange);
                        else if ((hidden = "mozHidden") in document)
                        document.addEventListener("mozvisibilitychange", onchange);
                        else if ((hidden = "webkitHidden") in document)
                        document.addEventListener("webkitvisibilitychange", onchange);
                        else if ((hidden = "msHidden") in document)
                        document.addEventListener("msvisibilitychange", onchange);
                        // IE 9 and lower:
                        else if ('onfocusin' in document)
                        document.onfocusin = document.onfocusout = onchange;
                        // All others:
                        else
                        window.onpageshow = window.onpagehide
                        = window.onfocus = window.onblur = onchange;
                        function onchange (evt) {
                        var v = 'visible', h = 'hidden',
                                evtMap = {
                                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
                                };
                                evt = evt || window.event;
                                if (evt.type in evtMap){
                        document.body.className = evtMap[evt.type];
                        } else{
                        document.body.className = this[hidden] ? "hidden" : "visible";
                                if (document.body.className === "hidden"){
                        s_oMain.stopUpdate();
                        } else{
                        s_oMain.startUpdate();
                        }
                        }
                        }
                })();

function playSound(szSound,iVolume,bLoop){
    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
        s_aSounds[szSound].play();
        s_aSounds[szSound].volume(iVolume);

        s_aSounds[szSound].loop(bLoop);

        return s_aSounds[szSound];
    }
    return null;
}

function stopSound(szSound){
    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
        s_aSounds[szSound].stop();
    }
}   

function setVolume(szSound, iVolume){
    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
        s_aSounds[szSound].volume(iVolume);
    }
}  

function setMute(szSound, bMute){
    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
        s_aSounds[szSound].mute(bMute);
    }
}

function isPlaying(szSound){
    return s_aSounds[szSound].playing();
}


        function ctlArcadeResume(){
        if (s_oMain !== null){
        s_oMain.startUpdate();
        }
        }

        function ctlArcadePause(){
        if (s_oMain !== null){
        s_oMain.stopUpdate();
        }
        }


        function getParamValue(paramName){
        var url = window.location.search.substring(1);
                var qArray = url.split('&');
                for (var i = 0; i < qArray.length; i++)
        {
        var pArr = qArray[i].split('=');
                if (pArr[0] == paramName)
                return pArr[1];
        }
        }

        function rotateVector2D(iAngle, o) {
        var iX = o.x * Math.cos(iAngle) + o.y * Math.sin(iAngle);
                var iY = o.x * ( - Math.sin(iAngle)) + o.y * Math.cos(iAngle);
                return {x : iX, y : iY};
                }

        function normalize(o, len){
        if (len > 0){
        o.x /= len; o.y /= len;
        }
        return o
        };
                function length (o){
                return Math.sqrt(o.x * o.x + o.y * o.y);
                };
                
                function findNearestIntersectingObject(clientX, clientY, camera, objects) {
                    // Get the picking ray from the point
                    //var projector = new THREE.Projector();
                    var SCREEN_WIDTH = CANVAS_RESIZE_WIDTH + OFFSET_WIDTH * 2;
                    var SCREEN_HEIGHT = CANVAS_RESIZE_HEIGHT + OFFSET_HEIGHT * 2;
                    
                    var raycaster = new THREE.Raycaster();
                    var mouse3D = new THREE.Vector3();
                    // Get 3D point form the client x y
                    mouse3D.x = (clientX / SCREEN_WIDTH) * 2 - 1;
                    mouse3D.y = - (clientY / SCREEN_HEIGHT) * 2 + 1;
                    mouse3D.z = 0.5;
                    raycaster.setFromCamera(mouse3D, camera);
                    var hits = raycaster.intersectObjects(objects, true);
                    // Find the closest intersecting object
                    // Now, cast the ray all render objects in the scene to see if they collide. Take the closest one.
                    //var hits = raycaster.intersectObjects(objects,true);
    //                console.log(hits);
                    var closest = false;
                    if (hits.length > 0) {
                    closest = hits[0];
                    }

                    return closest;
                }
                
                
                
                
function distance(x1, y1, x2, y2){
    var iDx = x1 - x2;
    var iDy = y1 - y2;
    return Math.sqrt((iDx * iDx) + (iDy * iDy));
}
function distance2(x1, y1, x2, y2){
    var iDx = x1 - x2;
    var iDy = y1 - y2;
    return ((iDx * iDx) + (iDy * iDy));
}
function resizeCanvas3D(){
    $("canvas").each(function(){
        if( $(this).attr("id") == "#canvas"){
            return;
        }
        $(this).css("width", $("#canvas").css("width"));
        $(this).css("height", $("#canvas").css("height"));
        $(this).css("position", $("#canvas").css("position"));
        $(this).css("left", $("#canvas").css("left"));
        $(this).css("top", $("#canvas").css("top"));
    });
}
function createOrthoGraphicCamera(){
    var oCamera = new THREE.PerspectiveCamera(FOV, CANVAS_WIDTH / CANVAS_HEIGHT , NEAR, FAR);
    if(s_iCurState === GOALKEEPER_MODE){
        oCamera.rotation.x  =  84 * (Math.PI / 180);
        oCamera.position.set(0,0,3);
    }else{
        oCamera.rotation.x  = 88.6 * (Math.PI / 180);
        oCamera.rotation.y = 0.03 * (Math.PI / 180);
        oCamera.position.set(CAMERA_POSITION.x,CAMERA_POSITION.y,CAMERA_POSITION.z);
    }

    oCamera.updateProjectionMatrix();  
    oCamera.updateMatrixWorld();
    
    return oCamera;
}

function rotateVector2D( iAngle, o ) {  
    var iX = o.x  *  Math.cos( iAngle )  + o.y * Math.sin( iAngle );
    var iY = o.x * (-Math.sin( iAngle )) + o.y * Math.cos( iAngle );  
    
    return {x : iX, y : iY, z : 0};
}
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function distanceV3 (x1,y1,z1,x2,y2,z2){
    var iDx = x1 - x2;
    var iDy = y1 - y2;
    var iDz = z1 - z2;
    
    return Math.sqrt((iDx * iDx) + (iDy * iDy) + (iDz * iDz));
}

function linearFunction(x, x1, x2, y1, y2){
    return ( (x-x1)*(y2-y1)/(x2-x1) ) + y1; 
}

function distanceV2 ( v1, v2){
    var iDx = v1.x - v2.x;
    var iDy = v1.y - v2.y;

    return Math.sqrt((iDx * iDx) + (iDy * iDy) );
}
/*
function getFactors(number){
    
    const factors = number => Array
    .from(Array(number + 1), (_, i) => i)
    .filter(i => number % i === 0)
    
    return factors(number);
}
*/
function fullscreenHandler(){
	if (!ENABLE_FULLSCREEN || screenfull.enabled === false){
       return;
    }
	
    if(screen.height < window.innerHeight+3 && screen.height > window.innerHeight-3){
        s_bFullscreen = true;
    }else{
        s_bFullscreen = false;
    }

    if (s_oInterface !== null){
        s_oInterface.resetFullscreenBut();
    }

    if (s_oMenu !== null){
        s_oMenu.resetFullscreenBut();
    }
    
    if (s_oLevelMenu !== null){
        s_oLevelMenu.resetFullscreenBut();
    }

    if(s_oSelectMenu !== null){
        s_oSelectMenu.resetFullscreenBut();
    }
}


if (screenfull.enabled) {
    screenfull.on('change', function(){
            s_bFullscreen = screenfull.isFullscreen;

            if (s_oInterface !== null){
                s_oInterface.resetFullscreenBut();
            }

            if (s_oMenu !== null){
                s_oMenu.resetFullscreenBut();
            }
            
            if (s_oLevelMenu !== null){
                s_oLevelMenu.resetFullscreenBut();
            }
            
            if(s_oSelectMenu !== null){
                s_oSelectMenu.resetFullscreenBut();
            }
    });
}

function getCookie(key) {
    var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    return keyValue ? keyValue[2] : null;
}

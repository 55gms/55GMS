var context_2;
var globalContext_2 = null;
function beginPath(ctx, linewidth)
{

    //context_2 = ctx;
    if (globalContext_2 == null)
        globalContext_2 = document.getElementById("canvas").getContext("2d");
    globalContext_2.beginPath();
    globalContext_2.lineWidth = linewidth;
    context_2 = globalContext_2;
}

function pathMoveTo(x1, y1)
{
    context_2.moveTo(x1, y1);
}

function pathLineTo(x1, y1)
{
	context_2.lineTo(x1, y1);
}

function pathCircle(x, y, radius)
{
	context_2.moveTo(x, y);
	context_2.arc(x, y, radius, 0, 2*Math.PI);
}

function drawPathArc(x, y, radius, sAngle, eAngle) {
    sAngle = 360 - sAngle;
    eAngle = 360 - eAngle;
    context_2.arc(x, y, radius, sAngle / 180 * Math.PI, eAngle / 180 * Math.PI, true);
}

function pathStroke(name)
{
	context_2.stroke();
}

function pathFill()
{
	context_2.fill();
}

//Avoid the popup blocker
var urlOpenFunction;
function addLinkHandler(url)
{
	urlOpenFunction = function(e)
	{
		var keyCode = e.keyCode;
		if ((keyCode == 13) || (keyCode == 32))
		{
			window.open(url, "_blank", "width=1000, height=500, location=yes, resizable=yes, scrollbars=yes, toolbar=yes");
			document.getElementById("canvas").focus();
		}
	};
	document.addEventListener("keydown", urlOpenFunction);
}

function removeLinkHandler()
{
	document.removeEventListener("keydown", urlOpenFunction);
}

//Avoid keydown problems
var keys = {};
window.addEventListener("keydown",
function(e){
keys[e.keyCode] = true;
switch(e.keyCode){
case 37: case 39: case 38: case 40: // Arrow keys
case 32: e.preventDefault(); break; // Space
default: break; // do not block other keys
}
},
false);
window.addEventListener("keyup",
function(e){
keys[e.keyCode] = false;
},
false);

function addAnimationPolyfill()
{
	window.requestAnimFrame = (function(){
  return  function( callback ){
            window.setTimeout(callback, 16);
          };
})();
}

function isEdge()
{
    return window.navigator.userAgent.indexOf("Edge") > -1;
}

function toggleHTML5Fullscreen()
{
    if (! isHTML5FullScreen()) {
    if (document.documentElement.requestFullscreen) {  
      document.documentElement.requestFullscreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    } else if (document.documentElement.msRequestFullscreen) {  
      document.documentElement.msRequestFullscreen();  
    }   
    } else {  
    if (document.cancelFullscreen) {  
      document.cancelFullscreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    } else if (document.msCancelFullscreen) {  
      document.msCancelFullscreen();  
    }
    } 

    //Firefox bug
    setTimeout(function()
    {
        document.documentElement.style.backgroundColor = "#101010";
        document.body.style.backgroundColor = "#101010";

        setTimeout(function()
        {
            document.documentElement.style.backgroundColor = "black";
            document.body.style.backgroundColor = "black";
        }, 100);
    }, 1000);
}

function isHTML5FullScreen()
{
    return ((document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreenElement && document.mozFullScreenElement !== null) || (document.msFullscreenElement && document.msFullscreenElement !== null) || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null)) ? true : false;
}

function getDevicePixelRatio() {
    return window.devicePixelRatio;
}

function setCanvasCSSSize(width, height) {
    var cnv = document.getElementById("canvas");
    cnv.style.width = width + "px";
    cnv.style.height = height + "px";
    cnv.style.position = "absolute";
    cnv.style.left = "0px";
    cnv.style.top = "0px";
}

function addTouchscreenHandlerCanvas() {
    // document.getElementById("canvas").addEventListener("touchend", function() {
    //     if (! isHTML5FullScreen())
    //         toggleHTML5Fullscreen();
    // });
}

if(typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
   var resumeAudio = function() {
      if(typeof g_WebAudioContext == "undefined" || g_WebAudioContext == null) return;
      if(g_WebAudioContext.state == "suspended") g_WebAudioContext.resume();
   };
   document.getElementById("canvas").addEventListener("click", resumeAudio);
   document.getElementById("canvas").addEventListener("touchend", resumeAudio);
   document.getElementById("canvas").style.display = "block";
}

var clickRegisteredSinceLastFrame = false, clickRegisteredOnThisFrame = false;

function registerClick() {
    clickRegisteredSinceLastFrame = true;
}

document.getElementById("canvas").addEventListener("pointerdown", registerClick);

//document.getElementById("canvas").addEventListener("keyup")

function mouse_check_pressed_left_notbroken() {
    return clickRegisteredOnThisFrame ? true : false;
}

function mouse_handle_beginstep() {
    clickRegisteredOnThisFrame = clickRegisteredSinceLastFrame;
    clickRegisteredSinceLastFrame = false;
}

function getSafeAreaTop() {
    try {
        var safeArea = (getComputedStyle(document.documentElement).getPropertyValue("--sat").replace("px", "") + 0) * getDevicePixelRatio();
        if (safeArea == null || isNaN(safeArea))
            return 0;
        return safeArea;
    } catch(e) {
        return 0;
    }
}

function show_debug_message_browser(message) {
    console.log(message);
}

htmlFixedLoaded = true;
class UIScreen
{
	constructor(id, path)
	{
		//this.ref = this;
		this.id = id;
		//this.path = path+id+".png";
		this.atlasImg = null;
		this.isLoaded = false;
		this.domElement = document.getElementById("screen_"+this.id);
		this.isAnimating = false;
	}
	loadAtlas()
	{
		var id = this.id;
		this.atlasImg = new Image();
		this.atlasImg.addEventListener("load",this.onAtlasLoaded.bind(this));
		/*
		this.atlasImg.onload = function(){

			UIManager.onScreenLoaded(id);
		};
		*/   
		//this.atlasImg.src = this.path;
	}
	onAtlasLoaded()
	{
		this.isLoaded = true;
		//UIManager.onScreenLoaded(this.id);
	}
}


// --- LOADER

const LOADING_STATEs = {
    START : 0,
    IN_PROGRESS: 1,
    FINISHED: 2,
    END_ANIM : 3,
    END : 4
}
var loadingState = LOADING_STATEs.START;
var loadingLogo = {};
var loadingLoopID;

function PlayLoadingAnimation(state)
{
	switch(state)
	{
		case "start":
		var logoContainer = document.getElementById("logo_container");
		logoContainer.style.display = "block";
		logoContainer.style.animation="scaleUp 0.65s ease-out";

		var sunRays = document.getElementById("sun_rays");
		sunRays.style.display = "block";
		sunRays.style.animation="completeRotation 4s linear infinite";

		var loadingContainer = document.getElementById("loading_container");
		loadingContainer.style.display = "block";
		loadingContainer.style.animation="scaleUp 0.65s ease-out";
		loadingContainer.addEventListener("animationend", onLoadingBarDisplayed);

		//loadingLoopID = setInterval(loadingLoop, 5);
		
		setTimeout(function() {
			PlayLoadingAnimation("prize_text");
		}, 1000)
		break;

		case "prize_text":

		break;

		case "end":
		var logoContainer = document.getElementById("logo_container");
		logoContainer.style.animation="scaleDown 0.5s linear forwards";
		logoContainer.addEventListener("animationend", onLoadingScreenEnd);

		var loadingTexts = document.getElementById("text_container");
		loadingTexts.style.animation="fadeOut 0.25s linear forwards";
		break;
	}
	
}

function SetTip(tip)
{
	document.getElementById("text_container").innerHTML = tip;
}



function onLoadingBarDisplayed()
{
	loadingState = LOADING_STATEs.IN_PROGRESS;
}
function hideLoadingBar()
{
	var loadingContainer = document.getElementById("loading_container");
	loadingContainer.style.animation="scaleDown 0.15s linear forwards";
	document.getElementById("text_container").style.display = "none";
}


function onGoBtnClicked()
{
	if(loadingState == LOADING_STATEs.FINISHED)
	{
		c3_callFunction("Play_aUISound", ["click"]);
		loadingState = LOADING_STATEs.END_ANIM;
		setTimeout(function() {
			PlayLoadingAnimation("end");
		}, 250)
	}
}
function onLoadingScreenEnd()
{
	loadingState = LOADING_STATEs.END;
	destroyLoadingScreen();
	c3_callFunction("onGoBtn_Clicked");
}

function HideLoadingScreen()
{
	if(loadingState != LOADING_STATEs.END)
		loadingState = LOADING_STATEs.END;
	document.getElementById("loading").innerHTML = '';
	document.getElementById("loading").style.display = "none";
}

function updateLoadingProgress(loadingProgress)
{
	if(loadingState == LOADING_STATEs.END)
		return;
	//console.log("Loading Progress Update <>" + loadingProgress);
	if(loadingProgress >= 1)
		loadingProgress = 1;
	document.getElementById("loading_bar").style.width = (10+loadingProgress*90)+"%";
	if(loadingProgress >= 1)
	{
		if(loadingState != LOADING_STATEs.IN_PROGRESS)
			return;
		loadingState = LOADING_STATEs.FINISHED;
		hideLoadingBar();
	}
}
//----------------------------



var ORIENTATIONs = {
	PORTRAIT : 0,
	LANDSCAPE : 1,
	BOTH : 2
}
const RESCALE_MODEs = {
	WIDTH : 0,
	HEIGHT : 1,
	MIN : 2,
	MAX : 3,
	VALUE : 4
}

var UI_SCALE = 0.75;
var CANVAS_WIDTH = 1080;
var CANVAS_HEIGHT = 1920;
var rescaleMode = RESCALE_MODEs.MIN;
var screenOrientation = ORIENTATIONs.PORTRAIT;
var CANVAS_AspectRatio = CANVAS_WIDTH/CANVAS_HEIGHT;
var aspectRatio = 0;
var screenWidth = 0;
var screenHeight = 0;

var gameScreens = {};

const SCREENs = {
    LOADING : "loading",
    MENU: "menu",
    SETTINGs: "settings",
    INFO: "info",
    SHOP : "shop",
    TARGET : "target",
    GLOBAL : "global",
    GAME_PLAY : "gameplay",
    GAME_WIN : "gamewin",
    GAME_LOSE : "gamelose",
    MILESTONE : "milestone",
    LEVEL_COMPLETE : "levelcomplete",
    CONNECTING : "connecting",
    ERROR : "error",
    ROTATE : "rotate"
}

var UIManager = 
{
	isReady : false,
	components : null,
	Init : function()
	{
		console.log("<UIMnagaer> on Start");
		this.isReady = true;
		Resize();
	}
}







function Resize()
{

	screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	screenHeight= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	aspectRatio = screenWidth/screenHeight;
	console.log(screenWidth +"<>"+ screenHeight);

	switch(rescaleMode)
	{
		case RESCALE_MODEs.WIDTH:
		UI_SCALE = screenWidth/CANVAS_WIDTH;
		break;
		case RESCALE_MODEs.HEIGHT:
		UI_SCALE = screenHeight/CANVAS_HEIGHT;
		break;
		case RESCALE_MODEs.MIN:
		UI_SCALE = Math.min(screenWidth/CANVAS_WIDTH,screenHeight/CANVAS_HEIGHT)
		break;
		case RESCALE_MODEs.MAX:
		UI_SCALE = Math.max(screenWidth/CANVAS_WIDTH,screenHeight/CANVAS_HEIGHT)
		break;
	}

	UI_SCALE = UI_SCALE.toFixed(2);
	if(UIManager.components)
	{

		if(UIManager.components.connecting)
		{
			if(isOnMobile)
			{

			}
			else
			{

			
			}

			
		}
	}
	var itemsToRescale = document.querySelectorAll("[data-resize]");
	//console.log(itemsToRescale);
	itemsToRescale.forEach(function (item) {
		if(item.dataset.scalemul)
		{
			var mul = parseFloat(item.dataset.scalemul);
			item.style.transform = 'scale('+UI_SCALE*mul+','+UI_SCALE*mul+')';
		}
		else
			item.style.transform = 'scale('+UI_SCALE+','+UI_SCALE+')';
	});

	if(isOnMobile)
	{

		switch(screenOrientation)
		{

			case ORIENTATIONs.PORTRAIT:

			break;

			case ORIENTATIONs.LANDSCAPE:

			break;
		}
	}
}


gdjs.LoadingCode = {};
gdjs.LoadingCode.localVariables = [];
gdjs.LoadingCode.GDloadingObjects1= [];
gdjs.LoadingCode.GDloadingObjects2= [];
gdjs.LoadingCode.GDloadingObjects3= [];
gdjs.LoadingCode.GDloadingObjects4= [];
gdjs.LoadingCode.GDclientObjects1= [];
gdjs.LoadingCode.GDclientObjects2= [];
gdjs.LoadingCode.GDclientObjects3= [];
gdjs.LoadingCode.GDclientObjects4= [];
gdjs.LoadingCode.GDprogress_9595barObjects1= [];
gdjs.LoadingCode.GDprogress_9595barObjects2= [];
gdjs.LoadingCode.GDprogress_9595barObjects3= [];
gdjs.LoadingCode.GDprogress_9595barObjects4= [];


gdjs.LoadingCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "en");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("en");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "fr");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("fr");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "it");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("it");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "de");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("de");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "es");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("es");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "zh-CN");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("zh-CN");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "ja");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("ja");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "ko");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("ko");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "pt-BR");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("pt-BR");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "ru");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("ru");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtsExt__Language__Language.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined)) == "tr");
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setString("tr");
}}

}


};gdjs.LoadingCode.eventsList1 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "en");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("LOADING");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "fr");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("CHARGEMENT");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "it");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("CARICAMENTO");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "de");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("LADEN");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "es");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("CARGANDO");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "zh-CN");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].setBold(true);
}
}{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("加载中");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "ja");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].setBold(true);
}
}{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("ロード中");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "ko");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].setBold(true);
}
}{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("로드 중");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "pt-BR");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("CARREGANDO");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "ru");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects2);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects2.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects2[i].getBehavior("Text").setText("ЗАГРУЗКА");
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(0).getAsString() == "tr");
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects1);
{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects1[i].getBehavior("Text").setText("YÜKLENIYOR");
}
}}

}


};gdjs.LoadingCode.eventsList2 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46841356);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.LoadingCode.eventsList0(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46854964);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.LoadingCode.eventsList1(runtimeScene);} //End of subevents
}

}


};gdjs.LoadingCode.eventsList3 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerWidth() < gdjs.evtTools.window.getWindowInnerHeight());
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46867484);
}
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.setGameResolutionSize(runtimeScene, 720, 1280);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.systemInfo.isMobile();
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerWidth() > gdjs.evtTools.window.getWindowInnerHeight());
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46869196);
}
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.setGameResolutionSize(runtimeScene, 1600, 900);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.systemInfo.isMobile());
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerWidth() <= 1031);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerHeight() <= 580);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46871260);
}
}
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.setGameResolutionSize(runtimeScene, 1280, 720);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.systemInfo.isMobile());
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerWidth() > 1031);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.evtTools.window.getWindowInnerHeight() > 580);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46873428);
}
}
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.setGameResolutionSize(runtimeScene, 1920, 1080);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}}

}


};gdjs.LoadingCode.userFunc0x36b6860 = function GDJSInlineCode(runtimeScene) {
"use strict";
navigator.sendBeacon('https://leveldata.poki.io/cat-pizza', 'f221e1d1-dcbd-496f-b713-93fb45e4ce63');
};
gdjs.LoadingCode.eventsList4 = function(runtimeScene) {

{


gdjs.LoadingCode.userFunc0x36b6860(runtimeScene);

}


};gdjs.LoadingCode.eventsList5 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46880276);
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.LoadingCode.eventsList4(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.areSceneAssetsLoaded(runtimeScene, "Gameplay");
if (isConditionTrue_0) {
{gdjs.evtsExt__PokiGamesSDKHtml__CallGameLoadingFinished.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Gameplay", false);
}}

}


};gdjs.LoadingCode.eventsList6 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46531220);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.prioritizeLoadingOfScene(runtimeScene, "Gameplay");
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46701772);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.network.enableMetrics(runtimeScene, false);
}}

}


{


gdjs.LoadingCode.eventsList2(runtimeScene);
}


{


gdjs.LoadingCode.eventsList3(runtimeScene);
}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("client"), gdjs.LoadingCode.GDclientObjects1);
gdjs.copyArray(runtimeScene.getObjects("loading"), gdjs.LoadingCode.GDloadingObjects1);
gdjs.copyArray(runtimeScene.getObjects("progress_bar"), gdjs.LoadingCode.GDprogress_9595barObjects1);
{for(var i = 0, len = gdjs.LoadingCode.GDclientObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDclientObjects1[i].getBehavior("Animation").setAnimationName("cat_move_frontside");
}
}{for(var i = 0, len = gdjs.LoadingCode.GDclientObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDclientObjects1[i].getBehavior("Flippable").flipX(true);
}
}{for(var i = 0, len = gdjs.LoadingCode.GDloadingObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDloadingObjects1[i].setCenterPositionInScene((( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterXInScene()),(( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterYInScene()) + 40);
}
}{for(var i = 0, len = gdjs.LoadingCode.GDprogress_9595barObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDprogress_9595barObjects1[i].setCenterPositionInScene((( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterXInScene()),(( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterYInScene()) + 70);
}
}}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(46877132);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("client"), gdjs.LoadingCode.GDclientObjects1);
{gdjs.evtTools.camera.setCameraY(runtimeScene, (( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterYInScene()) + 40, "", 0);
}{gdjs.evtTools.camera.setCameraX(runtimeScene, (( gdjs.LoadingCode.GDclientObjects1.length === 0 ) ? 0 :gdjs.LoadingCode.GDclientObjects1[0].getCenterXInScene()), "", 0);
}}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("progress_bar"), gdjs.LoadingCode.GDprogress_9595barObjects1);
{for(var i = 0, len = gdjs.LoadingCode.GDprogress_9595barObjects1.length ;i < len;++i) {
    gdjs.LoadingCode.GDprogress_9595barObjects1[i].SetValue(100 * gdjs.evtTools.runtimeScene.getSceneLoadingProgress(runtimeScene, "Gameplay"), (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}
}}

}


{


gdjs.LoadingCode.eventsList5(runtimeScene);
}


};

gdjs.LoadingCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.LoadingCode.GDloadingObjects1.length = 0;
gdjs.LoadingCode.GDloadingObjects2.length = 0;
gdjs.LoadingCode.GDloadingObjects3.length = 0;
gdjs.LoadingCode.GDloadingObjects4.length = 0;
gdjs.LoadingCode.GDclientObjects1.length = 0;
gdjs.LoadingCode.GDclientObjects2.length = 0;
gdjs.LoadingCode.GDclientObjects3.length = 0;
gdjs.LoadingCode.GDclientObjects4.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects1.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects2.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects3.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects4.length = 0;

gdjs.LoadingCode.eventsList6(runtimeScene);
gdjs.LoadingCode.GDloadingObjects1.length = 0;
gdjs.LoadingCode.GDloadingObjects2.length = 0;
gdjs.LoadingCode.GDloadingObjects3.length = 0;
gdjs.LoadingCode.GDloadingObjects4.length = 0;
gdjs.LoadingCode.GDclientObjects1.length = 0;
gdjs.LoadingCode.GDclientObjects2.length = 0;
gdjs.LoadingCode.GDclientObjects3.length = 0;
gdjs.LoadingCode.GDclientObjects4.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects1.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects2.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects3.length = 0;
gdjs.LoadingCode.GDprogress_9595barObjects4.length = 0;


return;

}

gdjs['LoadingCode'] = gdjs.LoadingCode;

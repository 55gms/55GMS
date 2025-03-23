
if (typeof gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak !== "undefined") {
  gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak = {};


gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.userFunc0x32be8e8 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
if (typeof PokiSDK === "undefined") return;
gdjs._pokiGamesSDKHtmlExtension.isPlayingCommercialBreak = true;
PokiSDK.commercialBreak().then(() => {
    gdjs._pokiGamesSDKHtmlExtension.commercialBreakJustFinishedPlaying = true;
    gdjs._pokiGamesSDKHtmlExtension.isPlayingCommercialBreak = false;
});

};
gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.userFunc0x32be8e8(runtimeScene, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.func = function(runtimeScene, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("PokiGamesSDKHtml"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("PokiGamesSDKHtml"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        eventsFunctionContext._objectArraysMap[objectName].push(object);
      }
      return object;    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__PokiGamesSDKHtml__RequestCommercialBreak.registeredGdjsCallbacks = [];
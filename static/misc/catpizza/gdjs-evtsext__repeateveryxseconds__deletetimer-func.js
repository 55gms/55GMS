
if (typeof gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer !== "undefined") {
  gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer = {};


gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.runtimeScene.removeTimer(runtimeScene, eventsFunctionContext.getArgument("TimerName"));
}{gdjs.evtTools.variable.variableRemoveChild(runtimeScene.getScene().getVariables().get("__RepeatEveryXSeconds").getChild("Repetitions"), eventsFunctionContext.getArgument("TimerName"));
}}

}


};

gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer.func = function(runtimeScene, TimerName, parentEventsFunctionContext) {
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("RepeatEveryXSeconds"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("RepeatEveryXSeconds"),
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
if (argName === "TimerName") return TimerName;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__RepeatEveryXSeconds__DeleteTimer.registeredGdjsCallbacks = [];
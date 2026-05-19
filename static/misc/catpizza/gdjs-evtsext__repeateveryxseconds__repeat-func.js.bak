
if (typeof gdjs.evtsExt__RepeatEveryXSeconds__Repeat !== "undefined") {
  gdjs.evtsExt__RepeatEveryXSeconds__Repeat.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__RepeatEveryXSeconds__Repeat = {};


gdjs.evtsExt__RepeatEveryXSeconds__Repeat.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.runtimeScene.getTimerElapsedTimeInSecondsOrNaN(runtimeScene, eventsFunctionContext.getArgument("TimerName")) >= 0);
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.resetTimer(runtimeScene, eventsFunctionContext.getArgument("TimerName"));
}{runtimeScene.getScene().getVariables().get("__RepeatEveryXSeconds").getChild("Repetitions").getChild(eventsFunctionContext.getArgument("TimerName")).setNumber(0);
}}

}


{



}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.getTimerElapsedTimeInSecondsOrNaN(runtimeScene, eventsFunctionContext.getArgument("TimerName")) >= eventsFunctionContext.getArgument("LoopDuration");
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.resetTimer(runtimeScene, eventsFunctionContext.getArgument("TimerName"));
}{runtimeScene.getScene().getVariables().get("__RepeatEveryXSeconds").getChild("Repetitions").getChild(eventsFunctionContext.getArgument("TimerName")).add(1);
}{if (typeof eventsFunctionContext !== 'undefined') { eventsFunctionContext.returnValue = true; }}}

}


};

gdjs.evtsExt__RepeatEveryXSeconds__Repeat.func = function(runtimeScene, TimerName, LoopDuration, parentEventsFunctionContext) {
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
if (argName === "LoopDuration") return LoopDuration;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};


gdjs.evtsExt__RepeatEveryXSeconds__Repeat.eventsList0(runtimeScene, eventsFunctionContext);


return !!eventsFunctionContext.returnValue;
}

gdjs.evtsExt__RepeatEveryXSeconds__Repeat.registeredGdjsCallbacks = [];
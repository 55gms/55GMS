
gdjs.evtsExt__Sticker__Sticker = gdjs.evtsExt__Sticker__Sticker || {};

/**
 * Behavior generated from Sticker
 */
gdjs.evtsExt__Sticker__Sticker.Sticker = class Sticker extends gdjs.RuntimeBehavior {
  constructor(instanceContainer, behaviorData, owner) {
    super(instanceContainer, behaviorData, owner);
    this._runtimeScene = instanceContainer;

    this._onceTriggers = new gdjs.OnceTriggers();
    this._behaviorData = {};
    this._sharedData = gdjs.evtsExt__Sticker__Sticker.Sticker.getSharedData(
      instanceContainer,
      behaviorData.name
    );
    
    this._behaviorData.OnlyFollowPosition = behaviorData.OnlyFollowPosition !== undefined ? behaviorData.OnlyFollowPosition : false;
    this._behaviorData.IsDestroyedWithParent = behaviorData.IsDestroyedWithParent !== undefined ? behaviorData.IsDestroyedWithParent : false;
  }

  // Hot-reload:
  updateFromBehaviorData(oldBehaviorData, newBehaviorData) {
    
    if (oldBehaviorData.OnlyFollowPosition !== newBehaviorData.OnlyFollowPosition)
      this._behaviorData.OnlyFollowPosition = newBehaviorData.OnlyFollowPosition;
    if (oldBehaviorData.IsDestroyedWithParent !== newBehaviorData.IsDestroyedWithParent)
      this._behaviorData.IsDestroyedWithParent = newBehaviorData.IsDestroyedWithParent;

    return true;
  }

  // Network sync:
  getNetworkSyncData() {
    return {
      ...super.getNetworkSyncData(),
      props: {
        
    OnlyFollowPosition: this._behaviorData.OnlyFollowPosition,
    IsDestroyedWithParent: this._behaviorData.IsDestroyedWithParent,
      }
    };
  }
  updateFromNetworkSyncData(networkSyncData) {
    super.updateFromNetworkSyncData(networkSyncData);
    
    if (networkSyncData.props.OnlyFollowPosition !== undefined)
      this._behaviorData.OnlyFollowPosition = networkSyncData.props.OnlyFollowPosition;
    if (networkSyncData.props.IsDestroyedWithParent !== undefined)
      this._behaviorData.IsDestroyedWithParent = networkSyncData.props.IsDestroyedWithParent;
  }

  // Properties:
  
  _getOnlyFollowPosition() {
    return this._behaviorData.OnlyFollowPosition !== undefined ? this._behaviorData.OnlyFollowPosition : false;
  }
  _setOnlyFollowPosition(newValue) {
    this._behaviorData.OnlyFollowPosition = newValue;
  }
  _toggleOnlyFollowPosition() {
    this._setOnlyFollowPosition(!this._getOnlyFollowPosition());
  }
  _getIsDestroyedWithParent() {
    return this._behaviorData.IsDestroyedWithParent !== undefined ? this._behaviorData.IsDestroyedWithParent : false;
  }
  _setIsDestroyedWithParent(newValue) {
    this._behaviorData.IsDestroyedWithParent = newValue;
  }
  _toggleIsDestroyedWithParent() {
    this._setIsDestroyedWithParent(!this._getIsDestroyedWithParent());
  }
}

/**
 * Shared data generated from Sticker
 */
gdjs.evtsExt__Sticker__Sticker.Sticker.SharedData = class StickerSharedData {
  constructor(sharedData) {
    
  }
  
  // Shared properties:
  
}

gdjs.evtsExt__Sticker__Sticker.Sticker.getSharedData = function(instanceContainer, behaviorName) {
  if (!instanceContainer._Sticker_StickerSharedData) {
    const initialData = instanceContainer.getInitialSharedDataForBehavior(
      behaviorName
    );
    instanceContainer._Sticker_StickerSharedData = new gdjs.evtsExt__Sticker__Sticker.Sticker.SharedData(
      initialData
    );
  }
  return instanceContainer._Sticker_StickerSharedData;
}

// Methods:
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects2= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.userFunc0xd693e8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const Sticker = gdjs._stickerExtension.Sticker;

const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const object = objects[0];
const behavior = object.getBehavior(behaviorName);

behavior._sticker = new Sticker(behavior);

// Set up the scene sticker objects list - if not done already.
runtimeScene._stickerExtension = runtimeScene._stickerExtension || {
    allStickers: new Set(),
};
// Register this object as a sticker.
runtimeScene._stickerExtension.allStickers.add(behavior);

};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtsExt__Sticker__DefineHelperClasses.func(runtimeScene, (typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined));
}}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.userFunc0xd693e8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreated = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects2.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onCreatedContext.GDObjectObjects2.length = 0;


return;
}
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.GDObjectObjects1= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.userFunc0x46a9fe8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const object = objects[0];
const behavior = object.getBehavior(behaviorName);

behavior._sticker.onStepPreEvents();
};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.userFunc0x46a9fe8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEvents = function(parentEventsFunctionContext) {
this._onceTriggers.startNewFrame();
var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPreEventsContext.GDObjectObjects1.length = 0;


return;
}
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.GDObjectObjects1= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.userFunc0x46a9fe8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const object = objects[0];
const behavior = object.getBehavior(behaviorName);

behavior._sticker.followBasisObject();
};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.userFunc0x46a9fe8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;


return;
}
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDObjectObjects1= [];
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDBasisObjectObjects1= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.userFunc0x46ab2a8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const object = objects[0];
const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const basisObjects = eventsFunctionContext.getObjects("BasisObject");

if (basisObjects.length === 0) return;
// An object can stick to only one object.
const basisObject = basisObjects[0];
object.getBehavior(behaviorName)._sticker.stickTo(basisObject);

};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.userFunc0x46ab2a8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.Stick = function(BasisObject, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "BasisObject": BasisObject
},
  _objectArraysMap: {
"Object": thisObjectList
, "BasisObject": gdjs.objectsListsToArray(BasisObject)
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDBasisObjectObjects1.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.StickContext.GDBasisObjectObjects1.length = 0;


return;
}
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.GDObjectObjects1= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.userFunc0x46ab2a8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const object = objects[0];
const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const behavior = object.getBehavior(behaviorName);

object.getBehavior(behaviorName)._sticker.unstick();

};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.userFunc0x46ab2a8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.Unstick = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.GDObjectObjects1.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.UnstickContext.GDObjectObjects1.length = 0;


return;
}
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext = {};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.GDObjectObjects1= [];


gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.userFunc0xd693e8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
const behaviorName = eventsFunctionContext.getBehaviorName("Behavior");
const object = objects[0];
const behavior = object.getBehavior(behaviorName);

runtimeScene._stickerExtension.allStickers.delete(behavior._sticker);

};
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.GDObjectObjects1);

var objects = [];
objects.push.apply(objects,gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.GDObjectObjects1);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.userFunc0xd693e8(runtimeScene, objects, typeof eventsFunctionContext !== 'undefined' ? eventsFunctionContext : undefined);

}


};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroy = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._runtimeScene;
var thisObjectList = [this.owner];
var Object = Hashtable.newFrom({Object: thisObjectList});
var Behavior = this.name;
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
},
  _objectArraysMap: {
"Object": thisObjectList
},
  _behaviorNamesMap: {
"Behavior": Behavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Sticker"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Sticker"),
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
  getOnceTriggers: function() { return that._onceTriggers; }
};

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.GDObjectObjects1.length = 0;

gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Sticker__Sticker.Sticker.prototype.onDestroyContext.GDObjectObjects1.length = 0;


return;
}


gdjs.registerBehavior("Sticker::Sticker", gdjs.evtsExt__Sticker__Sticker.Sticker);

const appIDsToPreload = [
  4404700, // Barefoot Tasha Skin
  4404680, // CalebCity Skin
  4341320, // ChinoAlphaWolf Skin
  4404720, // Hundo_Grand Skin
  4404750, // Kaiju_Black Skin
  4335870, // Karim Cheese Skin
  4404710, // Khleo Thomas Skin
  4404730, // Kimmicles Skin
  4404690, // King Vader Skin
  4404670, // Valentine Skin
  4404740, // ZuiceTV Skin
];

export default class DLCManager {
  constructor(runtime) {
    this.runtime = runtime;
    this.pipelab = runtime.objects.Pipelab.getFirstInstance();
    this.dlcCache = new Map();
  }

  async preloadDLCStatus() {
    await Promise.all(appIDsToPreload.map((appId) => this.hasDLC(appId)));
  }

  async _pipelab_checkDLCIsInstalled(appId) {
    if (typeof appId !== "number") {
      appId = parseInt(appId, 10);
    }
    if (!this.pipelab || !this.pipelab._isInitialized) {
      console.warn("Pipelab instance not found. Cannot check DLC ownership.");
      return false;
    }

    try {
      await this.pipelab._CheckDLCIsInstalled(appId);
      const isOwned = this.pipelab._CheckDLCIsInstalledResult();
      this.dlcCache.set(appId, isOwned);
      return isOwned;
    } catch (error) {
      console.error(`Error checking DLC ownership for ${appId}:`, error);
      return false;
    }
  }

  hasDLC(appId, forceCheck = false) {
    if (typeof appId !== "number") {
      appId = parseInt(appId, 10);
    }
    if (!forceCheck && this.dlcCache.has(appId)) {
      return this.dlcCache.get(appId);
    }
    return this._pipelab_checkDLCIsInstalled(appId);
  }
}

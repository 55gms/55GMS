/**
 * @typedef {Object} PlayerSteamId
 * @property {string} steamId64
 * @property {string} steamId32
 * @property {number} accountId
 */

/**
 * @typedef {Object} InstallInfo
 * @property {string} folder
 * @property {bigint} sizeOnDisk
 * @property {number} timestamp
 */

/**
 * @typedef {Object} DownloadInfo
 * @property {bigint} current
 * @property {bigint} total
 */

/**
 * @typedef {Object} WorkshopItemStatistic
 * @property {string} [numSubscriptions]
 * @property {string} [numFavorites]
 * @property {string} [numFollowers]
 * @property {string} [numUniqueSubscriptions]
 * @property {string} [numUniqueFavorites]
 * @property {string} [numUniqueFollowers]
 * @property {string} [numUniqueWebsiteViews]
 * @property {string} [reportScore]
 * @property {string} [numSecondsPlayed]
 * @property {string} [numPlaytimeSessions]
 * @property {string} [numComments]
 * @property {string} [numSecondsPlayedDuringTimePeriod]
 * @property {string} [numPlaytimeSessionsDuringTimePeriod]
 */

/**
 * @typedef {Object} WorkshopItem
 * @property {string} publishedFileId
 * @property {number} [creatorAppId]
 * @property {number} [consumerAppId]
 * @property {string} title
 * @property {string} description
 * @property {PlayerSteamId} owner
 * @property {number} timeCreated - Time created in unix epoch seconds format
 * @property {number} timeUpdated - Time updated in unix epoch seconds format
 * @property {number} timeAddedToUserList - Time when the user added the published item to their list (not always applicable), provided in Unix epoch format (time since Jan 1st, 1970).
 * @property {0|1|2|3} visibility - UgcItemVisibility: 0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted
 * @property {boolean} banned
 * @property {boolean} acceptedForUse
 * @property {Array<string>} tags
 * @property {boolean} tagsTruncated
 * @property {string} url
 * @property {number} numUpvotes
 * @property {number} numDownvotes
 * @property {number} numChildren
 * @property {string} [previewUrl]
 * @property {WorkshopItemStatistic} statistics
 * @property {number} state
 * @property {InstallInfo} installInfo
 * @property {DownloadInfo} downloadInfo
 */

export default class WorkshopWrapper {
  constructor(runtime) {
    this.runtime = runtime;
    this.pipelab = runtime.objects.Pipelab.getFirstInstance();

    /** @type {string[] | null} */
    this.subscribedItemIds = null;
    /** @type {Map<string, WorkshopItem>} */
    this.subscribedItemInfos = new Map();
  }

  /**
   * Opens a URL in the Steam overlay
   * @param {string} url - The URL to open
   * @param {0|1} mode - The mode to open the URL in: 0=Default, 1=Modal
   * @returns {Promise<{error: string, success: boolean}>}
   */
  async _pipelab_ActivateToWebPage(url, mode = 0) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { error: "Pipelab not initialized", success: false };
    }
    await this.pipelab._ActivateToWebPage(url, mode);
    let error = this.pipelab._ActivateToWebPageError();
    let success = this.pipelab._ActivateToWebPageResult();
    return { error, success };
  }

  getItemUrl(itemId) {
    return `https://steamcommunity.com/sharedfiles/filedetails/?id=${itemId}`;
  }

  openItemUrl(itemId) {
    return this.openWebPage(this.getItemUrl(itemId));
  }

  openWebPage(url) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      window.open(url, "_blank");
    }
    return this._pipelab_ActivateToWebPage(url);
  }

  openWorkshopPage(appId) {
    this.openWebPage(
      `https://steamcommunity.com/workshop/browse/?appid=${appId}&browsesort=trend&section=readytouseitems`
    );
  }

  openProfilePage(profileId) {
    this.openWebPage(`https://steamcommunity.com/profiles/${profileId}`);
  }

  openMoreFromAuthorPage(authorId, appId) {
    this.openWebPage(
      `https://steamcommunity.com/profiles/${authorId}/myworkshopfiles/?appid=${appId}`
    );
  }

  openGamePage(appId) {
    this.openWebPage(`https://steamcommunity.com/app/${appId}/`);
  }

  /**
   * @typedef {Object} SteamProfile
   * @property {string} steamId64 - The 64-bit Steam ID
   * @property {string} username - Display name
   * @property {string} realName - Real name (if public)
   * @property {string} avatarSmall - 32x32 avatar URL
   * @property {string} avatarMedium - 64x64 avatar URL
   * @property {string} avatarFull - 184x184 avatar URL
   * @property {string} avatarIcon - Icon-sized avatar URL
   * @property {string} profileUrl - URL to the Steam profile
   * @property {string} onlineState - Online status (online, offline, in-game, etc.)
   * @property {string} stateMessage - Status message
   * @property {string} visibilityState - Profile visibility (1=private, 3=public)
   * @property {string} memberSince - Account creation date
   * @property {string} location - Location (if public)
   * @property {string} summary - Profile summary/bio
   * @property {boolean} isPrivate - Whether the profile is private
   */

  /**
   * Cache for profile data to avoid repeated lookups
   * @type {Map<string, SteamProfile>}
   */
  _profileCache = new Map();

  /**
   * Cache for ongoing profile fetch promises to deduplicate requests
   * @type {Map<string, Promise<SteamProfile|null>>}
   */
  _profilePendingRequests = new Map();

  /**
   * Steam profile proxy URL - used to bypass CORS restrictions
   */
  static STEAM_PROFILE_PROXY = "https://steam-id.dedragames.com/profile";

  /**
   * Get Steam profile information from a Steam ID (steamId64)
   * Uses a CORS proxy to fetch Steam's public XML profile data
   *
   * @param {string} steamId64 - The 64-bit Steam ID
   * @param {boolean} [forceRefresh=false] - Force refresh from Steam, bypassing cache
   * @returns {Promise<SteamProfile|null>} The profile data or null if not found
   */
  async getProfile(steamId64, forceRefresh = false) {
    if (!steamId64) return null;

    // Check cache first (unless force refresh)
    if (!forceRefresh && this._profileCache.has(steamId64)) {
      return this._profileCache.get(steamId64);
    }

    // Reuse ongoing request if one exists for this profile
    if (this._profilePendingRequests.has(steamId64)) {
      return this._profilePendingRequests.get(steamId64);
    }

    // Create the fetch promise
    const fetchPromise = this._fetchProfile(steamId64);

    // Store it so concurrent calls can reuse it
    this._profilePendingRequests.set(steamId64, fetchPromise);

    try {
      const result = await fetchPromise;
      return result;
    } finally {
      // Clean up pending request once resolved
      this._profilePendingRequests.delete(steamId64);
    }
  }

  /**
   * Internal method to fetch a profile from Steam
   * @param {string} steamId64 - The 64-bit Steam ID
   * @returns {Promise<SteamProfile|null>}
   * @private
   */
  async _fetchProfile(steamId64) {
    try {
      // Use CORS proxy to fetch Steam profile
      const response = await fetch(
        `${WorkshopWrapper.STEAM_PROFILE_PROXY}/${steamId64}`
      );

      if (!response.ok) {
        console.warn(`[Workshop] Failed to fetch profile for ${steamId64}`);
        return null;
      }

      const text = await response.text();

      // Check if profile is private
      const isPrivate = text.includes("<privacyMessage>");

      // Helper to extract CDATA content (allows empty CDATA)
      const extractCDATA = (tag) => {
        const regex = new RegExp(
          `<${tag}><!\\[CDATA\\[(.*?)\\]\\]></${tag}>`,
          "s"
        );
        const match = text.match(regex);
        return match && match[1] ? match[1].trim() : "";
      };

      // Helper to extract simple tag content
      const extractTag = (tag) => {
        const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`);
        const match = text.match(regex);
        return match && match[1] ? match[1].trim() : "";
      };

      /** @type {SteamProfile} */
      const profile = {
        steamId64,
        // Username can be in CDATA or plain text depending on profile privacy
        username: extractCDATA("steamID") || extractTag("steamID64") || "",
        realName: extractCDATA("realname") || "",
        avatarMedium:
          extractCDATA("avatarMedium") || extractTag("avatarMedium") || "",
        avatarFull:
          extractCDATA("avatarFull") || extractTag("avatarFull") || "",
        avatarIcon:
          extractCDATA("avatarIcon") || extractTag("avatarIcon") || "",
        profileUrl: `https://steamcommunity.com/profiles/${steamId64}`,
        onlineState: extractTag("onlineState") || "",
        stateMessage:
          extractCDATA("stateMessage") || extractTag("stateMessage") || "",
        visibilityState: extractTag("visibilityState") || "",
        memberSince: extractTag("memberSince") || "",
        location: extractCDATA("location") || "",
        summary: extractCDATA("summary") || "",
        isPrivate,
      };

      // Cache the result
      this._profileCache.set(steamId64, profile);

      return profile;
    } catch (error) {
      console.error(
        `[Workshop] Error fetching profile for ${steamId64}:`,
        error
      );
      return null;
    }
  }

  /**
   * Get multiple profiles at once
   * @param {string[]} steamIds - Array of 64-bit Steam IDs
   * @param {boolean} [forceRefresh=false] - Force refresh from Steam, bypassing cache
   * @returns {Promise<Map<string, SteamProfile>>} Map of steamId64 to profile
   */
  async getProfiles(steamIds, forceRefresh = false) {
    const results = new Map();
    const uncached = steamIds.filter((id) => {
      if (!forceRefresh && this._profileCache.has(id)) {
        results.set(id, this._profileCache.get(id));
        return false;
      }
      return true;
    });

    // Fetch uncached profiles in parallel (with some rate limiting)
    const batchSize = 5;
    for (let i = 0; i < uncached.length; i += batchSize) {
      const batch = uncached.slice(i, i + batchSize);
      const promises = batch.map(async (id) => {
        const profile = await this.getProfile(id, forceRefresh);
        if (profile) {
          results.set(id, profile);
        }
      });
      await Promise.all(promises);
    }

    return results;
  }

  /**
   * Clear the profile cache (or a specific entry)
   * @param {string} [steamId64] - Optional specific ID to clear, or all if omitted
   */
  clearProfileCache(steamId64) {
    if (steamId64) {
      this._profileCache.delete(steamId64);
    } else {
      this._profileCache.clear();
    }
  }

  /**
   * Creates a new workshop item in the Steam Workshop and returns the item ID
   * @param {number} appId - The Steam app ID
   * @returns {Promise<{itemId: string, error: string, needsAgreement: boolean}>}
   */
  async _pipelab_CreateWorkshopItem(appId) {
    await this.pipelab._CreateWorkshopItem(appId);

    let itemId = this.pipelab._CreateWorkshopItemResult();
    let error = this.pipelab._CreateWorkshopItemError();
    let needsAgreement = this.pipelab._CreateWorkshopItemNeedsAgreement();

    return { itemId, error, needsAgreement };
  }

  /**
   * Uploads a project to the Steam Workshop
   * @param {number} appId - The Steam app ID
   * @param {string} itemId - The workshop item ID
   * @param {boolean} updateTitle - Whether to update the title
   * @param {string} title - The title of the item
   * @param {boolean} updateDescription - Whether to update the description
   * @param {string} description - The description of the item
   * @param {boolean} updateContent - Whether to update the content
   * @param {string} contentFolderPath - Path to the content folder
   * @param {string} changeNote - Change note for this update
   * @param {boolean} updatePreview - Whether to update the preview image
   * @param {string} previewImagePath - Path to the preview image
   * @param {boolean} updateTags - Whether to update the tags
   * @param {string} tags - Tags separated by commas
   * @param {boolean} updateVisibility - Whether to update the visibility
   * @param {0|1|2|3} visibility - UgcItemVisibility: 0=Public, 1=FriendsOnly, 2=Private, 3=Unlisted
   * @returns {Promise<{error: string, result: boolean, needsAgreement: boolean}>}
   */
  async _pipelab_UploadWorkshopItem(
    appId,
    itemId,
    updateTitle,
    title,
    updateDescription,
    description,
    updateContent,
    contentFolderPath,
    changeNote,
    updatePreview,
    previewImagePath,
    updateTags,
    tags,
    updateVisibility,
    visibility
  ) {
    await this.pipelab._UpdateWorkshopItem(
      appId,
      itemId,
      updateTitle,
      title,
      updateDescription,
      description,
      updateContent,
      contentFolderPath,
      changeNote,
      updatePreview,
      previewImagePath,
      updateTags,
      tags,
      updateVisibility,
      visibility
    );
    let error = this.pipelab._UpdateWorkshopItemError();
    let result = this.pipelab._UpdateWorkshopItemResult();
    let needsAgreement = this.pipelab._UpdateWorkshopItemNeedsAgreement();
    return { error, result, needsAgreement };
  }

  /**
   * Downloads a workshop item from the Steam Workshop
   * @param {string} itemId - The workshop item ID to download
   * @param {boolean} [highPriority=false] - Whether to prioritize this download
   * @returns {Promise<{success: boolean, error: string}>}
   */
  async _pipelab_DownloadWorkshopItem(itemId, highPriority = false) {
    await this.pipelab._DownloadWorkshopItem(itemId, highPriority);

    let success = this.pipelab._DownloadWorkshopItemResult();
    let error = this.pipelab._DownloadWorkshopItemError();

    return { success, error };
  }

  /**
   * Gets information about a workshop item
   * @param {string} itemId - The workshop item ID
   * @returns {Promise<{error: string, item: WorkshopItem}>}
   */
  async _pipelab_GetItemInfo(itemId) {
    await this.pipelab._GetWorkshopItemWithMetadata(itemId);
    let error = this.pipelab._GetWorkshopItemWithMetadataError();
    let item = this.pipelab._workshopItemsMap.get(itemId);
    return { error, item };
  }

  /**
   * Gets the subscribed workshop items
   * @returns {Promise<{items: WorkshopItem[], error: string}>}
   */
  async _pipelab_GetSubscribedWorkshopItems() {
    await this.pipelab._GetSubscribedItemsWithMetadata();
    let items = [...this.pipelab._subscribedItemIds].map((itemId) =>
      this.pipelab._workshopItemsMap.get(itemId)
    );
    let error = this.pipelab._GetSubscribedItemsWithMetadataError();
    return { items, error };
  }

  generateRandomFolderName() {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  getTempFolderPath() {
    const folderName = this.generateRandomFolderName();
    return `${this.pipelab._tempFolder}${folderName}`;
  }

  async createFolder(path) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { success: false, error: "Pipelab not initialized" };
    }
    await this.pipelab._CreateFolder(path);
    let success = this.pipelab._CreateFolderResult();
    let error = this.pipelab._CreateFolderError();
    return { success, error };
  }

  async createTempFolder() {
    let path = this.getTempFolderPath();
    let { success, error } = await this.createFolder(path);
    return { success, error, path: path };
  }

  async deletePath(path, recursive = false) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { success: false, error: "Pipelab not initialized" };
    }
    await this.pipelab._DeleteFile(path, recursive);
    let success = this.pipelab._DeleteFileResult();
    let error = this.pipelab._DeleteFileError();
    return { success, error };
  }

  async writeTextFile(path, content) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { success: false, error: "Pipelab not initialized" };
    }
    await this.pipelab._WriteTextFile(path, content);
    let success = this.pipelab._WriteTextFileResult();
    let error = this.pipelab._WriteTextFileError();
    return { success, error };
  }

  async writeBase64File(path, content, flag) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { success: false, error: "Pipelab not initialized" };
    }
    try {
      const order = {
        url: "/fs/file/write-base64",
        body: {
          path,
          base64Data: content,
          flag,
        },
      };

      await this.pipelab.ws?.sendAndWaitForResponse(order);
      return { success: true, error: null };
    } catch (e) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: "Unknown error" };
    }
  }

  async readTextFile(path) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { content: null, error: "Pipelab not initialized" };
    }
    await this.pipelab._ReadTextFile(path);
    let content = this.pipelab._ReadTextFileResult();
    let error = this.pipelab._ReadTextFileError();
    return { content, error };
  }

  /**
   * Gets information about a workshop item (cached)
   * @param {string} itemId - The workshop item ID
   * @param {boolean} [forceRefresh=false] - Whether to force refresh from Steam
   * @returns {Promise<WorkshopItem | null>}
   */
  async getItemInfo(itemId, forceRefresh = false) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return null;
    }
    if (forceRefresh || !this.subscribedItemInfos.has(itemId)) {
      let { item, error } = await this._pipelab_GetItemInfo(itemId);
      if (error) {
        console.error(error);
        return null;
      }
      this.subscribedItemInfos.set(itemId, item);
    }
    return this.subscribedItemInfos.get(itemId) || null;
  }

  /**
   * Gets all subscribed workshop items (cached)
   * @param {boolean} [forceRefresh=false] - Whether to force refresh from Steam
   * @returns {Promise<WorkshopItem[]>}
   */
  async getSubscribedWorkshopItems(forceRefresh = false) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return [];
    }
    if (
      forceRefresh ||
      this.subscribedItemIds === null ||
      this.subscribedItems === null
    ) {
      let { items, error } = await this._pipelab_GetSubscribedWorkshopItems();
      if (error) {
        console.error(error);
        return [];
      }
      this.subscribedItemIds = items.map((item) => item.publishedFileId);
      items.forEach((item) =>
        this.subscribedItemInfos.set(item.publishedFileId, item)
      );
      this.subscribedItems = items;
    }
    return this.subscribedItems;
  }

  /**
   * Uploads a project to the Steam Workshop
   * @param {Object} projectData - The project data containing workshop metadata and project content
   * @param {string} changeNote - Change notes for this update
   * @returns {Promise<{success: boolean, error: string, needsAgreement: boolean}>}
   */
  async uploadProject(projectData, changeNote = "") {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return {
        success: false,
        error: "Pipelab not initialized",
        needsAgreement: false,
      };
    }

    const workshopData = projectData.workshop;
    if (!workshopData || !workshopData.itemId) {
      return {
        success: false,
        error: "No workshop item ID found",
        needsAgreement: false,
      };
    }

    let tempFolderPath = null;

    try {
      // Create temp folder
      const tempResult = await this.createTempFolder();
      if (!tempResult.success) {
        return {
          success: false,
          error: `Failed to create temp folder: ${tempResult.error}`,
          needsAgreement: false,
        };
      }
      tempFolderPath = tempResult.path;

      // Create content subfolder
      const contentFolderPath = `${tempFolderPath}/content`;
      const contentFolderResult = await this.createFolder(contentFolderPath);
      if (!contentFolderResult.success) {
        return {
          success: false,
          error: `Failed to create content folder: ${contentFolderResult.error}`,
          needsAgreement: false,
        };
      }

      // Write project data to content.utrsproj
      const contentJsonPath = `${contentFolderPath}/content.utrsproj`;
      const projectJson = JSON.stringify(projectData, null, 2);
      const writeContentResult = await this.writeTextFile(
        contentJsonPath,
        projectJson
      );
      if (!writeContentResult.success) {
        return {
          success: false,
          error: `Failed to write content.utrsproj: ${writeContentResult.error}`,
          needsAgreement: false,
        };
      }

      // Handle preview image if it exists
      let previewImagePath = null;
      if (workshopData.previewImage) {
        try {
          // Extract base64 data (remove data:image/...;base64, prefix)
          const base64Match = workshopData.previewImage.match(
            /^data:image\/(\w+);base64,(.+)$/
          );
          if (base64Match) {
            const extension = base64Match[1];
            const base64Data = base64Match[2];
            previewImagePath = `${tempFolderPath}/preview.${extension}`;

            const writeImageResult = await this.writeBase64File(
              previewImagePath,
              base64Data,
              "w"
            );
            if (!writeImageResult.success) {
              console.warn(
                "Failed to write preview image:",
                writeImageResult.error
              );
              previewImagePath = null;
            }
          }
        } catch (err) {
          console.warn("Error processing preview image:", err);
          previewImagePath = null;
        }
      }

      // Generate tags
      const tags = this.generateTags(projectData);

      // Upload to workshop
      const appId = this.pipelab._steam_AppId;

      const uploadResult = await this._pipelab_UploadWorkshopItem(
        appId,
        workshopData.itemId,
        true, // updateTitle
        projectData.projectName, // Use project name as title
        true, // updateDescription
        workshopData.description || "",
        true, // updateContent
        contentFolderPath,
        changeNote,
        !!previewImagePath, // updatePreview
        previewImagePath || "",
        true, // updateTags
        tags.join(","),
        true, // updateVisibility
        workshopData.visibility
      );

      return {
        success: uploadResult.result,
        error: uploadResult.error,
        needsAgreement: uploadResult.needsAgreement,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Unknown error during upload",
        needsAgreement: false,
      };
    } finally {
      // Clean up temp folder
      if (tempFolderPath) {
        try {
          await this.deletePath(tempFolderPath, true);
        } catch (err) {
          console.warn("Failed to delete temp folder:", err);
        }
      }
    }
  }

  /**
   * Generate tags for workshop item based on project data
   * @param {Object} projectData - The project data
   * @returns {string[]} Array of tags
   */
  generateTags(projectData) {
    const tags = ["level"];

    // Add difficulty tag from project data (0-10 scale)
    if (projectData.sharedData?.projectDifficulty !== undefined) {
      const difficulty = projectData.sharedData.projectDifficulty;
      tags.push(`difficulty_${difficulty}`);
    }

    // Add level count tags
    const levelCount = Object.keys(projectData.levels || {}).length;
    if (levelCount === 1) {
      tags.push("single_level");
    } else if (levelCount > 1) {
      tags.push("level_pack");
    }

    return tags;
  }

  async isItemMine(itemId) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return false;
    }
    const item = await this.getItemInfo(itemId);
    return (
      !!item && item.owner.accountId === this.pipelab._steam_SteamId.accountId
    );
  }

  async createItem() {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return {
        itemId: null,
        error: "Pipelab not initialized",
        needsAgreement: false,
      };
    }
    const appId = this.pipelab._steam_AppId;
    const { itemId, error, needsAgreement } =
      await this._pipelab_CreateWorkshopItem(appId);
    if (error) {
      console.error(error);
      return { itemId: null, error: error, needsAgreement: false };
    }
    return { itemId, needsAgreement };
  }

  async pipelab_ExplorerOpen(path) {
    if (!this.pipelab || !this.pipelab._isInitialized) {
      return { success: false, error: "Pipelab not initialized" };
    }
    await this.pipelab._ExplorerOpen(path);
    let success = this.pipelab._ExplorerOpenResult();
    let error = this.pipelab._ExplorerOpenError();
    return { success, error };
  }
}

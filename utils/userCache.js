import axios from "axios";
import { deleteCacheKeys, getJsonCache, setJsonCache } from "./redisCache.js";

class UserCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
    this.cacheTtlSeconds = Math.floor(this.cacheTimeout / 1000);
    this.maxEntries = 1000;
  }

  getCacheKey(uuid) {
    return `user:${uuid}`;
  }

  async getCacheEntry(uuid) {
    const redisCached = await getJsonCache(this.getCacheKey(uuid));
    if (redisCached) {
      return { data: redisCached, timestamp: Date.now() };
    }

    return this.cache.get(uuid);
  }

  async setCacheEntry(uuid, data) {
    await setJsonCache(this.getCacheKey(uuid), data, this.cacheTtlSeconds);

    if (this.cache.has(uuid)) {
      this.cache.delete(uuid);
    }

    this.cache.set(uuid, {
      data,
      timestamp: Date.now(),
    });

    this.enforceMaxEntries();
  }

  async getUserByUuid(uuid) {
    const cached = await this.getCacheEntry(uuid);

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Fetch from external API
      const response = await axios.get(
        `https://db.55gms.com/api/user/${uuid}`,
        {
          headers: {
            Authorization: process.env.workerAUTH,
          },
        },
      );

      await this.setCacheEntry(uuid, response.data);

      return response.data;
    } catch (error) {
      // If we have stale cached data, return it as fallback
      if (cached) {
        return cached.data;
      }
      throw new Error("User not found");
    }
  }

  async getUserByUsername(username) {
    // For username lookups, we could implement a reverse cache
    // but for now, just make the API call
    try {
      const response = await axios.get(
        `https://db.55gms.com/api/user/by-username/${username}`,
        {
          headers: {
            Authorization: process.env.workerAUTH,
          },
        },
      );

      // Cache by UUID for future UUID lookups
      if (response.data.uuid) {
        await this.setCacheEntry(response.data.uuid, response.data);
      }

      return response.data;
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async getUserInfo(uuid) {
    try {
      const userData = await this.getUserByUuid(uuid);
      return {
        uuid: userData.uuid,
        username: userData.username,
        displayName: userData.displayName || userData.username,
        avatar: userData.avatar,
      };
    } catch (error) {
      console.error(`Error getting user info for ${uuid}:`, error);
      return null;
    }
  }

  // Clear cache entry for a specific UUID
  invalidateUser(uuid) {
    void deleteCacheKeys([this.getCacheKey(uuid)]).catch((error) => {
      console.error(`Error invalidating user cache for ${uuid}:`, error);
    });
    this.cache.delete(uuid);
  }

  clearCache() {
    this.cache.clear();
  }

  cleanupExpired() {
    const now = Date.now();
    for (const [uuid, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= this.cacheTimeout) {
        this.cache.delete(uuid);
      }
    }
  }

  enforceMaxEntries() {
    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

const userCache = new UserCache();

const cleanupInterval = setInterval(
  () => {
    userCache.cleanupExpired();
  },
  10 * 60 * 1000,
);
cleanupInterval.unref?.();

export default userCache;

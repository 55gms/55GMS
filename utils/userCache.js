import axios from "axios";
import { deleteCacheKeys, getJsonCache, setJsonCache } from "./redisCache.js";

export class UserCache {
  constructor(httpClient = axios) {
    this.cache = new Map();
    this.inFlightByUuid = new Map();
    this.httpClient = httpClient;
    this.cacheTimeout = 5 * 60 * 1000;
    this.cacheTtlSeconds = Math.floor(this.cacheTimeout / 1000);
    this.maxEntries = 1000;
  }

  getCacheKey(uuid) {
    return `user:${uuid}`;
  }

  isFresh(entry) {
    return Boolean(entry) && Date.now() - entry.timestamp < this.cacheTimeout;
  }

  async getCacheEntry(uuid) {
    // A fresh in-process entry avoids a Redis round trip on hot paths.
    const memoryCached = this.cache.get(uuid);
    if (this.isFresh(memoryCached)) {
      return memoryCached;
    }

    const redisCached = await getJsonCache(this.getCacheKey(uuid));
    if (redisCached) {
      return { data: redisCached, timestamp: Date.now() };
    }

    return memoryCached;
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
    if (this.isFresh(cached)) {
      return cached.data;
    }

    const pendingLookup = this.inFlightByUuid.get(uuid);
    if (pendingLookup) {
      return pendingLookup;
    }

    const lookupPromise = this.fetchAndCacheUserByUuid(uuid, cached).finally(
      () => {
        this.inFlightByUuid.delete(uuid);
      },
    );

    this.inFlightByUuid.set(uuid, lookupPromise);
    return lookupPromise;
  }

  async fetchAndCacheUserByUuid(uuid, cached) {
    try {
      // Fetch from external API
      const response = await this.httpClient.get(
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
    this.inFlightByUuid.delete(uuid);
  }

  clearCache() {
    this.cache.clear();
    this.inFlightByUuid.clear();
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

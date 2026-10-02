import defaultAccounts from "../services/accounts.js";
import { deleteCacheKeys, getJsonCache, setJsonCache } from "./redisCache.js";

export class UserCache {
  constructor(accounts = defaultAccounts) {
    this.cache = new Map();
    this.inFlightByUuid = new Map();
    this.accounts = accounts;
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
      const user = await this.accounts.getUserByUuid(uuid);
      if (!user) {
        throw new Error("User not found");
      }

      await this.setCacheEntry(uuid, user);

      return user;
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
    // but for now, just ask the account store
    let user;
    try {
      user = await this.accounts.getUserByUsername(username);
    } catch (error) {
      throw new Error("User not found");
    }

    if (!user) {
      throw new Error("User not found");
    }

    // Cache by UUID for future UUID lookups
    if (user.uuid) {
      await this.setCacheEntry(user.uuid, user);
    }

    return user;
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

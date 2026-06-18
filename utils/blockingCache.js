import { Friend } from "../models/index.js";
import { deleteCacheKeys, getJsonCache, setJsonCache } from "./redisCache.js";

class BlockingCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.cacheTtlSeconds = Math.floor(this.cacheTimeout / 1000);
    this.maxEntries = 5000;
  }

  getCacheKey(userUuid, otherUserUuid) {
    return `${userUuid}:${otherUserUuid}`;
  }

  getRedisKey(cacheKey) {
    return `blocking:${cacheKey}`;
  }

  async getCacheEntry(cacheKey) {
    const redisCached = await getJsonCache(this.getRedisKey(cacheKey));
    if (redisCached) {
      return { ...redisCached, timestamp: Date.now() };
    }

    return this.cache.get(cacheKey);
  }

  async setCacheEntry(cacheKey, data) {
    await setJsonCache(this.getRedisKey(cacheKey), data, this.cacheTtlSeconds);

    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
    }

    this.cache.set(cacheKey, {
      ...data,
      timestamp: Date.now(),
    });

    this.enforceMaxEntries();
  }

  async isBlocked(userUuid, otherUserUuid) {
    const cacheKey = this.getCacheKey(userUuid, otherUserUuid);
    const cached = await this.getCacheEntry(cacheKey);

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.isBlocked;
    }

    try {
      // Check if the other user has blocked the current user
      const blockedByOther = await Friend.findOne({
        where: {
          requesterUuid: otherUserUuid,
          addresseeUuid: userUuid,
          status: "blocked",
        },
      });

      await this.setCacheEntry(cacheKey, {
        isBlocked: !!blockedByOther,
        blockedBy: blockedByOther ? "other" : null,
      });

      return !!blockedByOther;
    } catch (error) {
      console.error("Error checking blocking status:", error);

      // If we have stale cached data, return it as fallback
      if (cached) {
        return cached.isBlocked;
      }

      return false;
    }
  }

  async hasBlocked(userUuid, otherUserUuid) {
    const cacheKey = this.getCacheKey(otherUserUuid, userUuid); // Reverse the order for the cache key
    const cached = await this.getCacheEntry(cacheKey);

    // Check if we have valid cached data
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.blockedBy === "other";
    }

    try {
      // Check if the current user has blocked the other user
      const blockedByMe = await Friend.findOne({
        where: {
          requesterUuid: userUuid,
          addresseeUuid: otherUserUuid,
          status: "blocked",
        },
      });

      await this.setCacheEntry(cacheKey, {
        isBlocked: !!blockedByMe,
        blockedBy: blockedByMe ? "other" : null,
      });

      return !!blockedByMe;
    } catch (error) {
      console.error("Error checking blocking status:", error);

      // If we have stale cached data, return it as fallback
      if (cached) {
        return cached.blockedBy === "other";
      }

      return false;
    }
  }

  async getBlockingStatus(userUuid, otherUserUuid) {
    const blockedByOther = await this.isBlocked(userUuid, otherUserUuid);
    const blockedByMe = await this.hasBlocked(userUuid, otherUserUuid);

    return {
      isBlocked: blockedByOther || blockedByMe,
      blockedByOther,
      blockedByMe,
    };
  }

  invalidateCache(userUuid, otherUserUuid) {
    const key1 = this.getCacheKey(userUuid, otherUserUuid);
    const key2 = this.getCacheKey(otherUserUuid, userUuid);

    void deleteCacheKeys([
      this.getRedisKey(key1),
      this.getRedisKey(key2),
    ]).catch((error) => {
      console.error("Error invalidating blocking cache:", error);
    });

    this.cache.delete(key1);
    this.cache.delete(key2);
  }

  clearCache() {
    this.cache.clear();
  }

  cleanupExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= this.cacheTimeout) {
        this.cache.delete(key);
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

const blockingCache = new BlockingCache();

// Cleanup expired cache entries every 10 minutes
const cleanupInterval = setInterval(
  () => {
    blockingCache.cleanupExpired();
  },
  10 * 60 * 1000,
);
cleanupInterval.unref?.();

export default blockingCache;

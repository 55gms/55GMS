import { Friend } from "../models/index.js";
import { Op } from "sequelize";

class BlockingCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  getCacheKey(userUuid, otherUserUuid) {
    return `${userUuid}:${otherUserUuid}`;
  }

  async isBlocked(userUuid, otherUserUuid) {
    const cacheKey = this.getCacheKey(userUuid, otherUserUuid);
    const cached = this.cache.get(cacheKey);

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

      // Cache the result
      this.cache.set(cacheKey, {
        isBlocked: !!blockedByOther,
        blockedBy: blockedByOther ? "other" : null,
        timestamp: Date.now(),
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
    const cached = this.cache.get(cacheKey);

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

      // Cache the result
      this.cache.set(cacheKey, {
        isBlocked: !!blockedByMe,
        blockedBy: blockedByMe ? "me" : null,
        timestamp: Date.now(),
      });

      return !!blockedByMe;
    } catch (error) {
      console.error("Error checking blocking status:", error);

      // If we have stale cached data, return it as fallback
      if (cached) {
        return cached.blockedBy === "me";
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
}

const blockingCache = new BlockingCache();

// Cleanup expired cache entries every 10 minutes
setInterval(() => {
  blockingCache.cleanupExpired();
}, 10 * 60 * 1000);

export default blockingCache;

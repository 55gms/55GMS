import axios from "axios";

class UserCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000;
  }

  async getUserByUuid(uuid) {
    const cached = this.cache.get(uuid);

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
        }
      );

      // Cache the result
      this.cache.set(uuid, {
        data: response.data,
        timestamp: Date.now(),
      });

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
        }
      );

      // Cache by UUID for future UUID lookups
      if (response.data.uuid) {
        this.cache.set(response.data.uuid, {
          data: response.data,
          timestamp: Date.now(),
        });
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
}

const userCache = new UserCache();

setInterval(() => {
  userCache.cleanupExpired();
}, 10 * 60 * 1000);

export default userCache;

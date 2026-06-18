import { createClient } from "redis";

let redisClient;
let connectPromise;

export async function getRedisClient() {
  if (!process.env.REDIS_URL) return null;

  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on("error", (error) => {
      console.error("Redis cache client error:", error);
    });
  }

  if (!redisClient.isOpen) {
    connectPromise ||= redisClient.connect().finally(() => {
      connectPromise = null;
    });
    await connectPromise;
  }

  return redisClient;
}

export async function getJsonCache(key) {
  try {
    const client = await getRedisClient();
    if (!client) return null;

    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Redis cache read failed for ${key}:`, error);
    return null;
  }
}

export async function setJsonCache(key, value, ttlSeconds) {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Redis cache write failed for ${key}:`, error);
    return false;
  }
}

export async function deleteCacheKeys(keys) {
  try {
    const client = await getRedisClient();
    if (!client || keys.length === 0) return false;

    await client.del(keys);
    return true;
  } catch (error) {
    console.error(`Redis cache delete failed for ${keys.join(", ")}:`, error);
    return false;
  }
}

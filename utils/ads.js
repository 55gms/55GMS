import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAdsRouter } from "./ads-edge/index.js";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Serves 55GMS Ads (the gms-ads server) from this origin under /_ads, so the
// same embed works on every domain the site is reached through. Mounted ahead
// of the body parsers because the router reads request bodies itself.
export function mountAds(app) {
  const adServerUrl = process.env.ADS_SERVER_URL;
  const apiKey = process.env.ADS_API_KEY;
  if (!adServerUrl || !apiKey) {
    console.warn(
      "ADS_SERVER_URL or ADS_API_KEY is not set. 55GMS Ads are disabled.",
    );
    return null;
  }

  const router = createAdsRouter({
    adServerUrl,
    apiKey,
    secret: process.env.ADS_EDGE_SECRET,
    // Unsent stats survive restarts here. Each pm2 cluster worker keeps its
    // own folder, because a spool holds one process's counters and instance ID.
    spoolDir: path.join(
      process.env.ADS_SPOOL_DIR || path.join(rootDir, ".ads-spool"),
      `worker-${process.env.NODE_APP_INSTANCE || 0}`,
    ),
  });
  app.use("/_ads", router);
  return router;
}

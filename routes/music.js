import express from "express";
import axios from "axios";
import http from "http";
import https from "https";

const router = express.Router();

const allowedHosts = [
  "ohio.monochrome.tf",
  "virginia.monochrome.tf",
  "oregon.monochrome.tf",
  "california.monochrome.tf",
  "frankfurt.monochrome.tf",
  "singapore.monochrome.tf",
  "tokyo.monochrome.tf",
  "jakarta.monochrome.tf",
  "wolf.qqdl.site",
  "maus.qqdl.site",
  "vogel.qqdl.site",
  "katze.qqdl.site",
  "hund.qqdl.site",
  "uploads.frogiesarcade.win",
];

function isAllowedHost(hostname) {
  if (allowedHosts.includes(hostname)) {
    return true;
  }

  if (hostname === "tidal.com" || hostname.endsWith(".tidal.com")) {
    return true;
  }

  return false;
}

// Connection pool for reusing HTTP connections
const axiosInstance = axios.create({
  timeout: 60000, // Increased timeout for large files
  maxRedirects: 3, // Reduced redirects
  // Enable HTTP keep-alive for connection reuse
  httpAgent: new http.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  }),
  httpsAgent: new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  }),
});

function getRequestHeaders(req) {
  const headers = {
    Accept: "video/mp4,video/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Ch-Ua":
      '"Google Chrome";v="123", "Chromium";v="123", "Not?A_Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "video",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept-Encoding": "identity",
  };

  if (req.headers.range) {
    headers["Range"] = req.headers.range;
  }
  if (req.headers["if-range"]) {
    headers["If-Range"] = req.headers["if-range"];
  }
  if (req.headers["if-none-match"]) {
    headers["If-None-Match"] = req.headers["if-none-match"];
  }

  return headers;
}

function getStreamingHeaders(responseHeaders) {
  const headers = {
    "Content-Type": responseHeaders["content-type"] || "video/mp4",
    "Accept-Ranges": "bytes",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers":
      "Accept-Ranges, Content-Length, Content-Range, Content-Type, ETag, Cache-Control, Last-Modified",
    "X-Content-Type-Options": "nosniff",
  };

  const headersToForward = [
    "content-length",
    "content-range",
    "etag",
    "last-modified",
    "cache-control",
  ];

  headersToForward.forEach((header) => {
    if (responseHeaders[header]) {
      headers[
        header
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("-")
      ] = responseHeaders[header];
    }
  });

  if (!headers["Cache-Control"]) {
    headers["Cache-Control"] =
      "public, max-age=86400, stale-while-revalidate=3600";
  }

  return headers;
}

router.all("/*", async (req, res) => {
  // Set CORS headers immediately
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Referer, User-Agent, Range"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Accept-Ranges, Content-Length, Content-Range, Content-Type, ETag, Cache-Control"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let targetUrl = req.params[0];
  if (req.query.url) {
    targetUrl = req.query.url;
  } else if (targetUrl && targetUrl.startsWith("url=")) {
    targetUrl = targetUrl.substring(4);
  }

  if (!targetUrl) {
    return res.status(400).send("Target URL is required.");
  }

  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "https://" + targetUrl;
  }

  if (targetUrl.endsWith("/track")) {
    targetUrl += "/";
  }

  let url;
  try {
    url = new URL(targetUrl);
  } catch (error) {
    return res.status(400).send("Invalid URL format.");
  }

  if (!isAllowedHost(url.hostname)) {
    return res.status(403).send("Host is not allowed.");
  }

  // Handle HEAD requests for metadata
  if (req.method === "HEAD") {
    try {
      const headResponse = await axiosInstance.head(targetUrl, {
        headers: getRequestHeaders(req),
        timeout: 10000, // Shorter timeout for HEAD requests
      });

      const headers = getStreamingHeaders(headResponse.headers);
      res.status(headResponse.status).set(headers).end();
    } catch (error) {
      res.status(error.response?.status || 500).end();
    }
    return;
  }

  try {
    const isRangeRequest = !!req.headers.range;

    const requestHeaders = getRequestHeaders(req);

    const response = await axiosInstance.get(targetUrl, {
      responseType: "stream",
      headers: requestHeaders,
      validateStatus: function (status) {
        return status < 400;
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      decompress: false,
    });

    const streamingHeaders = getStreamingHeaders(response.headers);

    res.status(response.status);
    res.set(streamingHeaders);

    response.data.on("error", (error) => {
      if (!res.headersSent) {
        res.status(500).send("Stream error");
      }
    });

    req.on("close", () => {
      if (response.data && typeof response.data.destroy === "function") {
        response.data.destroy();
      }
    });

    response.data.pipe(res, { end: true });
  } catch (error) {
    if (!res.headersSent) {
      res.status(error.response?.status || 500).json({
        error: error.message,
        status: error.response?.status || "unknown",
        code: error.code,
      });
    }
  }
});

export default router;

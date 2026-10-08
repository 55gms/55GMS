// @55gms/ads-edge — mounted by the 55GMS game server.
// Serves ads from a cached manifest, counts impressions and clicks in memory,
// and reports hourly aggregates to the ad server. Node built-ins only.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { selectAd, normalizeHost, parseSizes, hostMatchesAny, isHostname } from './lib/selection.js';

export { selectAd, eligibleCampaigns, pickWeighted, hostMatches, domainAllowed, mulberry32 } from './lib/selection.js';

const HOUR = 60 * 60 * 1000;
const IMPRESSION_WINDOW_MS = 10 * 60 * 1000;
const CLICK_WINDOW_MS = 60 * 60 * 1000;
const MEDIA_RE = /^[a-f0-9]{64}\.(png|jpe?g|webp|gif|avif)$/;
const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const MEDIA_MAX_FILES = 200;
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|pingdom|curl|wget|python-requests|facebookexternalhit|scrapy|httpclient|go-http/i;

const b64u = (buf) => Buffer.from(buf).toString('base64url');
const hourOf = (t) => new Date(Math.floor(t / HOUR) * HOUR).toISOString();
const dayOf = (iso) => iso.slice(0, 10);

function defaultLogger() {
  const write = (level) => (msg, extra) =>
    console[level === 'error' ? 'error' : 'log'](JSON.stringify({ level, src: 'ads-edge', msg, ...extra }));
  return { info: write('info'), warn: write('warn'), error: write('error') };
}

// Insertion-ordered map used as a bounded "seen recently" set.
class BoundedSet {
  constructor(max, ttl) {
    this.max = max;
    this.ttl = ttl;
    this.map = new Map();
  }
  // Returns true when the id was not seen before (and records it).
  add(id, now) {
    const seen = this.map.get(id);
    if (seen !== undefined && now - seen < this.ttl) return false;
    this.map.delete(id);
    this.map.set(id, now);
    if (this.map.size > this.max) {
      const drop = Math.ceil(this.max / 10);
      let i = 0;
      for (const key of this.map.keys()) {
        if (i++ >= drop) break;
        this.map.delete(key);
      }
    }
    return true;
  }
  prune(now) {
    for (const [key, at] of this.map) {
      if (now - at < this.ttl) break;
      this.map.delete(key);
    }
  }
}

class RateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.hits = new Map();
  }
  allow(key, now) {
    let entry = this.hits.get(key);
    if (!entry || now >= entry.reset) {
      if (this.hits.size > 100_000) this.hits.clear();
      entry = { count: 0, reset: now + this.windowMs };
      this.hits.set(key, entry);
    }
    return ++entry.count <= this.limit;
  }
  prune(now) {
    for (const [key, entry] of this.hits) if (now >= entry.reset) this.hits.delete(key);
  }
}

export function createAdsRouter(options = {}) {
  const opts = {
    adServerUrl: (options.adServerUrl || '').replace(/\/+$/, ''),
    apiKey: options.apiKey || '',
    flushIntervalMs: options.flushIntervalMs ?? HOUR,
    flushJitterMs: options.flushJitterMs ?? 5 * 60 * 1000,
    manifestRefreshMs: options.manifestRefreshMs ?? 60 * 1000,
    spoolIntervalMs: options.spoolIntervalMs ?? 60 * 1000,
    spoolDir: options.spoolDir || null,
    spoolWarnBytes: options.spoolWarnBytes ?? 50 * 1024 * 1024,
    secret: options.secret || process.env.ADS_EDGE_SECRET || null,
    instanceId: options.instanceId || null,
    mountPath: options.mountPath || '/_ads',
    trustForwardedHost: options.trustForwardedHost ?? false,
    rateLimit: { serve: 240, impression: 240, click: 60, media: 240, windowMs: 60 * 1000, ...options.rateLimit },
    maxTrackedServes: options.maxTrackedServes ?? 500_000,
    maxDomains: options.maxDomains ?? 5000,
    cacheMedia: options.cacheMedia ?? true,
    requestTimeoutMs: options.requestTimeoutMs ?? 15_000,
    retryBaseMs: options.retryBaseMs ?? 5_000,
    retryMaxMs: options.retryMaxMs ?? 10 * 60 * 1000,
    handleSignals: options.handleSignals ?? true,
    autoStart: options.autoStart ?? true,
    fetch: options.fetch || globalThis.fetch,
    now: options.now || Date.now,
    random: options.random || Math.random,
    logger: options.logger || defaultLogger(),
  };
  const log = opts.logger;
  if (!opts.adServerUrl || !opts.apiKey) log.warn('adServerUrl or apiKey missing; serving nothing until configured');
  if (!opts.secret) {
    opts.secret = crypto.randomBytes(32).toString('hex');
    log.warn('ADS_EDGE_SECRET not set; using a per-process secret. Set one shared secret when running several instances.');
  }
  if (!opts.spoolDir) log.warn('spoolDir not set; counters are kept in memory only and are lost on a crash');

  // --- State -------------------------------------------------------------
  let manifest = null; // { version, campaigns, siteKeyId, etag, fetchedAt }
  let byCampaign = new Map();
  let blocked = []; // hostname patterns switched off on the ad server
  let allowed = null; // hostname patterns this API key is limited to; null means any host
  let mediaNames = new Set(); // uploaded creative files named by the current manifest
  const mediaCache = new Map(); // "name|variant" -> Promise<{ body, type, etag } | null>
  const seenDomains = new Set(); // hosts served since the last sealed batch, bounded by maxDomains
  const counters = new Map(); // "hour|campaign|creative|domain" -> { impressions, clicks }
  let countersDirty = false;
  const batches = []; // sealed, unsent: { batchId, file, payload }
  const usage = new Map(); // campaignId -> Map(day -> impressions not yet reflected in the manifest)
  let acked = []; // { at, campaignId, day, n } waiting for a manifest that includes them
  const seenImpressions = new BoundedSet(opts.maxTrackedServes, IMPRESSION_WINDOW_MS);
  const seenClicks = new BoundedSet(opts.maxTrackedServes, CLICK_WINDOW_MS);
  const limiters = {
    serve: new RateLimiter(opts.rateLimit.serve, opts.rateLimit.windowMs),
    impression: new RateLimiter(opts.rateLimit.impression, opts.rateLimit.windowMs),
    click: new RateLimiter(opts.rateLimit.click, opts.rateLimit.windowMs),
    media: new RateLimiter(opts.rateLimit.media, opts.rateLimit.windowMs),
  };
  const stats = {
    startedAt: new Date(opts.now()).toISOString(),
    serves: 0,
    noFill: 0,
    impressions: 0,
    clicks: 0,
    rejectedTokens: 0,
    rateLimited: 0,
    lastManifestAt: null,
    lastManifestError: null,
    lastFlushAt: null,
    lastFlushError: null,
    batchesSent: 0,
    batchesRejected: 0,
    retryAttempt: 0,
  };
  const timers = new Set();
  let closed = false;
  let sending = null;
  let batchSeq = 0;

  // --- Spool -------------------------------------------------------------
  const spool = opts.spoolDir ? path.resolve(opts.spoolDir) : null;
  const countersFile = spool && path.join(spool, 'counters.json');

  function writeAtomicSync(file, data) {
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, data);
    fs.renameSync(tmp, file);
  }

  function persistCounters() {
    if (!spool || !countersDirty) return;
    try {
      writeAtomicSync(countersFile, JSON.stringify({ savedAt: opts.now(), rows: [...counters] }));
      countersDirty = false;
    } catch (err) {
      log.error('failed to write spool counters', { error: err.message });
    }
  }

  function addUsage(campaignId, day, n) {
    let days = usage.get(campaignId);
    if (!days) usage.set(campaignId, (days = new Map()));
    days.set(day, (days.get(day) || 0) + n);
  }

  function loadSpool() {
    if (!spool) return;
    fs.mkdirSync(spool, { recursive: true });
    fs.mkdirSync(path.join(spool, 'rejected'), { recursive: true });
    const idFile = path.join(spool, 'instance-id');
    if (!opts.instanceId) {
      try {
        opts.instanceId = fs.readFileSync(idFile, 'utf8').trim();
      } catch {
        opts.instanceId = crypto.randomUUID();
        fs.writeFileSync(idFile, opts.instanceId);
      }
    }
    try {
      const saved = JSON.parse(fs.readFileSync(countersFile, 'utf8'));
      for (const [key, value] of saved.rows) {
        counters.set(key, value);
        const [hour, campaignId] = key.split('|');
        addUsage(campaignId, dayOf(hour), value.impressions);
      }
      if (counters.size) log.info('recovered counters from spool', { rows: counters.size });
    } catch (err) {
      if (err.code !== 'ENOENT') log.error('could not read spool counters', { error: err.message });
    }
    const files = fs.readdirSync(spool).filter((f) => f.startsWith('batch-') && f.endsWith('.json')).sort();
    for (const name of files) {
      const file = path.join(spool, name);
      try {
        const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
        batches.push({ batchId: payload.batchId, file, payload });
        for (const row of payload.rows) addUsage(row.campaignId, dayOf(row.hour), row.impressions);
      } catch (err) {
        log.error('unreadable spool batch left in place', { file: name, error: err.message });
      }
    }
    if (batches.length) log.info('recovered unsent batches from spool', { batches: batches.length });
  }

  function spoolBytes() {
    if (!spool) return 0;
    let total = 0;
    try {
      for (const name of fs.readdirSync(spool)) {
        const stat = fs.statSync(path.join(spool, name));
        if (stat.isFile()) total += stat.size;
      }
    } catch {
      /* directory vanished; reported on next write */
    }
    return total;
  }

  // --- Serve IDs ---------------------------------------------------------
  function sign(data) {
    return crypto.createHmac('sha256', opts.secret).update(data).digest('base64url');
  }

  function makeServeId(campaignId, creativeId, domain, now) {
    const body = b64u(JSON.stringify([campaignId, creativeId, domain, now, crypto.randomBytes(6).toString('base64url')]));
    return `${body}.${sign(body)}`;
  }

  function readServeId(token) {
    if (typeof token !== 'string' || token.length > 600) return null;
    const dot = token.indexOf('.');
    if (dot < 1) return null;
    const body = token.slice(0, dot);
    const given = Buffer.from(token.slice(dot + 1));
    const expected = Buffer.from(sign(body));
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
    try {
      const [campaignId, creativeId, domain, at] = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
      if (typeof at !== 'number') return null;
      return { campaignId, creativeId, domain, at };
    } catch {
      return null;
    }
  }

  // --- Counting and caps -------------------------------------------------
  function count(kind, serve, now) {
    const hour = hourOf(now);
    const key = `${hour}|${serve.campaignId}|${serve.creativeId}|${serve.domain}`;
    let row = counters.get(key);
    if (!row) counters.set(key, (row = { impressions: 0, clicks: 0 }));
    row[kind] += 1;
    countersDirty = true;
    stats[kind] += 1;
    if (kind === 'impressions') addUsage(serve.campaignId, dayOf(hour), 1);
  }

  // Budget left for this instance: the manifest's share minus everything
  // counted locally that the manifest does not include yet.
  function remaining(campaign) {
    const budget = campaign.budget;
    if (!budget || (budget.total == null && budget.daily == null)) return Infinity;
    const days = usage.get(campaign.id);
    let usedTotal = 0;
    let usedToday = 0;
    if (days) {
      const today = dayOf(new Date(opts.now()).toISOString());
      for (const [day, n] of days) {
        usedTotal += n;
        if (day === today) usedToday += n;
      }
    }
    let left = Infinity;
    if (budget.total != null) left = Math.min(left, budget.total - usedTotal);
    if (budget.daily != null) left = Math.min(left, budget.daily - usedToday);
    return left;
  }

  // --- Manifest ----------------------------------------------------------
  async function request(method, urlPath, { headers = {}, body } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.requestTimeoutMs);
    try {
      return await opts.fetch(opts.adServerUrl + urlPath, {
        method,
        headers: { authorization: `Bearer ${opts.apiKey}`, ...headers },
        body,
        signal: controller.signal,
        redirect: 'error',
      });
    } finally {
      clearTimeout(timer);
    }
  }

  // Uploaded creatives live on the ad server under /media/creatives/<sha256>.<ext>.
  // Returns that file name, or null for external images, which keep their own URL.
  function mediaName(imageUrl) {
    const prefix = `${opts.adServerUrl}/media/creatives/`;
    if (!opts.cacheMedia || typeof imageUrl !== 'string' || !imageUrl.startsWith(prefix)) return null;
    const name = imageUrl.slice(prefix.length);
    return MEDIA_RE.test(name) ? name : null;
  }

  async function fetchMedia(name, webp) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.requestTimeoutMs);
    try {
      const res = await opts.fetch(`${opts.adServerUrl}/media/creatives/${name}`, {
        headers: { accept: webp ? 'image/webp,image/*' : 'image/*' },
        signal: controller.signal,
        redirect: 'error',
      });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.startsWith('image/')) throw new Error(`media request returned ${res.status}`);
      const body = Buffer.from(await res.arrayBuffer());
      if (body.length > MEDIA_MAX_BYTES) throw new Error('media file is too large');
      return { body, type, etag: res.headers.get('etag') || `"${name}${webp ? '-webp' : ''}"` };
    } finally {
      clearTimeout(timer);
    }
  }

  // Creative files are content-addressed, so a copy never goes stale. They
  // are kept in memory and dropped once no manifest campaign uses them.
  function loadMedia(name, webp) {
    const key = `${name}|${webp ? 'webp' : 'orig'}`;
    let entry = mediaCache.get(key);
    if (!entry) {
      if (mediaCache.size >= MEDIA_MAX_FILES) mediaCache.delete(mediaCache.keys().next().value);
      entry = fetchMedia(name, webp).catch((err) => {
        mediaCache.delete(key);
        log.warn('creative image not fetched', { name, error: err.message });
        return null;
      });
      mediaCache.set(key, entry);
    }
    return entry;
  }

  async function handleMedia(req, res, name) {
    if (!MEDIA_RE.test(name) || !mediaNames.has(name)) return send(res, 404, { error: 'not found' });
    const negotiable = !/\.(webp|gif)$/.test(name);
    const file = await loadMedia(name, negotiable && /\bimage\/webp\b/.test(req.headers.accept || ''));
    if (!file) return send(res, 502, { error: 'image unavailable' });
    const headers = {
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: file.etag,
      'Content-Type': file.type,
      ...(negotiable ? { Vary: 'Accept' } : {}),
    };
    if (req.headers['if-none-match'] === file.etag) return send(res, 304, undefined, headers);
    send(res, 200, undefined, { ...headers, 'Content-Length': String(file.body.length) }, req.method === 'HEAD' ? undefined : file.body);
  }

  async function refreshManifest() {
    if (!opts.adServerUrl || !opts.apiKey) return false;
    const startedAt = opts.now();
    try {
      const headers = {};
      if (manifest?.etag) headers['if-none-match'] = manifest.etag;
      const query = opts.instanceId ? `?instance=${encodeURIComponent(opts.instanceId)}` : '';
      const res = await request('GET', `/api/v1/manifest${query}`, { headers });
      if (res.status === 200) {
        const data = await res.json();
        if (!Array.isArray(data.campaigns)) throw new Error('manifest has no campaigns array');
        manifest = { ...data, etag: res.headers.get('etag'), fetchedAt: startedAt };
        byCampaign = new Map(data.campaigns.map((c) => [c.id, c]));
        blocked = Array.isArray(data.blockedDomains) ? data.blockedDomains : [];
        allowed = Array.isArray(data.allowedDomains) ? data.allowedDomains : null;
        mediaNames = new Set();
        for (const campaign of data.campaigns) {
          for (const creative of campaign.creatives || []) {
            const name = mediaName(creative.imageUrl);
            if (name) mediaNames.add(name);
          }
        }
        for (const key of mediaCache.keys()) if (!mediaNames.has(key.split('|')[0])) mediaCache.delete(key);
      } else if (res.status === 304 && manifest) {
        manifest.fetchedAt = startedAt;
      } else {
        throw new Error(`manifest request returned ${res.status}`);
      }
      // Counts acknowledged before this request started are now part of the
      // manifest's budgets, so they stop counting against the local share.
      const keep = [];
      for (const entry of acked) {
        if (entry.at < startedAt) addUsage(entry.campaignId, entry.day, -entry.n);
        else keep.push(entry);
      }
      acked = keep;
      for (const [campaignId, days] of usage) {
        for (const [day, n] of days) if (n <= 0) days.delete(day);
        if (!days.size) usage.delete(campaignId);
      }
      stats.lastManifestAt = new Date(startedAt).toISOString();
      stats.lastManifestError = null;
      return true;
    } catch (err) {
      // Keep serving from the last good manifest; schedules and local budgets still apply.
      stats.lastManifestError = err.message;
      log.warn('manifest refresh failed', { error: err.message, serving: manifest ? 'last good manifest' : 'nothing' });
      return false;
    }
  }

  // --- Batching and flush ------------------------------------------------
  function sealBatch() {
    seenDomains.clear();
    if (!counters.size) return null;
    const rows = [];
    let min = Infinity;
    let max = -Infinity;
    for (const [key, value] of counters) {
      const [hour, campaignId, creativeId, domain] = key.split('|');
      const t = Date.parse(hour);
      if (t < min) min = t;
      if (t > max) max = t;
      rows.push({ hour, campaignId, creativeId, domain, impressions: value.impressions, clicks: value.clicks });
    }
    const payload = {
      batchId: crypto.randomUUID(),
      siteKeyId: manifest?.siteKeyId,
      instanceId: opts.instanceId || undefined,
      periodStart: new Date(min).toISOString(),
      periodEnd: new Date(max + HOUR).toISOString(),
      rows,
    };
    let file = null;
    if (spool) {
      const name = `batch-${String(opts.now()).padStart(15, '0')}-${String(batchSeq++).padStart(4, '0')}-${payload.batchId}.json`;
      file = path.join(spool, name);
      try {
        writeAtomicSync(file, JSON.stringify(payload));
      } catch (err) {
        // Without a durable copy, keep the counters in memory and try again later.
        log.error('failed to write spool batch; keeping counters in memory', { error: err.message });
        return null;
      }
    }
    counters.clear();
    countersDirty = true;
    persistCounters();
    const batch = { batchId: payload.batchId, file, payload };
    batches.push(batch);
    return batch;
  }

  function removeBatchFile(batch, rejected) {
    if (!batch.file) return;
    try {
      if (rejected) fs.renameSync(batch.file, path.join(spool, 'rejected', path.basename(batch.file)));
      else fs.unlinkSync(batch.file);
    } catch (err) {
      log.error('failed to clean up spool batch', { error: err.message });
    }
  }

  // Sends sealed batches oldest first. Stops at the first transient failure so
  // order is preserved; the retry timer picks up from the same batch.
  async function sendPending() {
    while (batches.length) {
      const batch = batches[0];
      let res;
      try {
        res = await request('POST', '/api/v1/events/batch', {
          headers: { 'content-type': 'application/json', 'content-encoding': 'gzip' },
          body: zlib.gzipSync(JSON.stringify(batch.payload)),
        });
      } catch (err) {
        throw new Error(`batch ${batch.batchId} not sent: ${err.message}`);
      }
      if (res.ok) {
        const at = opts.now();
        for (const row of batch.payload.rows) {
          if (row.impressions) acked.push({ at, campaignId: row.campaignId, day: dayOf(row.hour), n: row.impressions });
        }
        batches.shift();
        removeBatchFile(batch, false);
        stats.batchesSent += 1;
        continue;
      }
      if (res.status === 400 || res.status === 413 || res.status === 422) {
        // The ad server will never accept this batch as-is. Keep it on disk
        // for inspection instead of blocking everything behind it.
        let detail = '';
        try {
          detail = JSON.stringify(await res.json()).slice(0, 2000);
        } catch {
          /* no body */
        }
        log.error('batch rejected by ad server; moved to spool/rejected', { batchId: batch.batchId, status: res.status, detail });
        for (const row of batch.payload.rows) addUsage(row.campaignId, dayOf(row.hour), -row.impressions);
        batches.shift();
        removeBatchFile(batch, true);
        stats.batchesRejected += 1;
        continue;
      }
      throw new Error(`batch ${batch.batchId} not accepted: status ${res.status}`);
    }
  }

  function later(fn, ms) {
    const timer = setTimeout(() => {
      timers.delete(timer);
      fn();
    }, ms);
    timer.unref?.();
    timers.add(timer);
    return timer;
  }

  let retryTimer = null;
  function scheduleRetry() {
    if (closed || retryTimer) return;
    const delay = Math.min(opts.retryMaxMs, opts.retryBaseMs * 2 ** stats.retryAttempt) * (0.75 + opts.random() * 0.5);
    stats.retryAttempt += 1;
    retryTimer = later(() => {
      retryTimer = null;
      flush({ seal: false }).catch(() => {});
    }, delay);
  }

  async function flush({ seal = true } = {}) {
    if (seal) sealBatch();
    if (sending) return sending;
    sending = (async () => {
      try {
        if (!batches.length) return { sent: 0, pending: 0 };
        const before = stats.batchesSent;
        await sendPending();
        stats.lastFlushAt = new Date(opts.now()).toISOString();
        stats.lastFlushError = null;
        stats.retryAttempt = 0;
        // Pull fresh budgets right away so acknowledged counts are reconciled.
        await refreshManifest();
        return { sent: stats.batchesSent - before, pending: batches.length };
      } catch (err) {
        stats.lastFlushError = err.message;
        log.warn('flush failed; will retry', { error: err.message, pendingBatches: batches.length, attempt: stats.retryAttempt + 1 });
        scheduleRetry();
        const bytes = spoolBytes();
        if (bytes > opts.spoolWarnBytes) log.warn('spool is larger than the configured limit', { bytes, limit: opts.spoolWarnBytes });
        return { sent: 0, pending: batches.length, error: err.message };
      } finally {
        sending = null;
      }
    })();
    return sending;
  }

  function scheduleFlush() {
    if (closed) return;
    const now = opts.now();
    let delay;
    if (opts.flushIntervalMs >= HOUR) {
      // Top of the next hour plus jitter, so many instances do not report at once.
      delay = Math.ceil((now + 1) / HOUR) * HOUR - now + Math.floor(opts.random() * opts.flushJitterMs);
    } else {
      delay = opts.flushIntervalMs;
    }
    later(() => {
      flush().catch(() => {});
      scheduleFlush();
    }, delay);
  }

  function every(fn, ms) {
    const timer = setInterval(fn, ms);
    timer.unref?.();
    timers.add(timer);
  }

  // --- HTTP --------------------------------------------------------------
  function send(res, status, body, headers, raw) {
    res.statusCode = status;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (headers) for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    if (body === undefined) return res.end(raw);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  }

  function hostOf(req) {
    const forwarded = opts.trustForwardedHost && req.headers['x-forwarded-host'];
    return normalizeHost(String(forwarded || req.headers.host || '').split(',')[0]);
  }

  const ipOf = (req) => req.ip || req.socket?.remoteAddress || 'unknown';
  const isBot = (req) => {
    const ua = req.headers['user-agent'];
    return !ua || BOT_RE.test(ua);
  };

  function readBody(req) {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      try {
        return Promise.resolve(JSON.parse(req.body.toString()));
      } catch {
        return Promise.resolve(null);
      }
    }
    return new Promise((resolve) => {
      const chunks = [];
      let size = 0;
      req.on('data', (chunk) => {
        size += chunk.length;
        if (size > 16 * 1024) {
          resolve(null);
          req.destroy();
        } else chunks.push(chunk);
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch {
          resolve(null);
        }
      });
      req.on('error', () => resolve(null));
    });
  }

  function toAd(pick, domain, now) {
    const serveId = makeServeId(pick.campaign.id, pick.creative.id, domain, now);
    // Uploaded images are served from this origin; see handleMedia.
    const local = mediaName(pick.creative.imageUrl);
    return {
      serveId,
      imageUrl: local ? `${opts.mountPath}/m/${local}` : pick.creative.imageUrl,
      width: pick.creative.width,
      height: pick.creative.height,
      alt: pick.creative.alt || '',
      clickUrl: `${opts.mountPath}/c/${serveId}`,
    };
  }

  // The Host header is the caller's to choose, so only well-formed names are
  // accepted and the number of distinct hosts per batch is bounded.
  function canServe(domain) {
    if (!isHostname(domain)) return false;
    if (hostMatchesAny(blocked, domain)) return false;
    if (allowed && !hostMatchesAny(allowed, domain)) return false;
    if (seenDomains.has(domain)) return true;
    if (seenDomains.size >= opts.maxDomains) return false;
    seenDomains.add(domain);
    return true;
  }

  function handleServe(req, res, query) {
    const now = opts.now();
    const single = !query.has('slots');
    const groups = single ? [query.get('sizes')] : query.get('slots').split(';').slice(0, 12);
    if (!manifest || req.method === 'HEAD' || isBot(req)) return single ? send(res, 204) : send(res, 200, { ads: groups.map(() => null) });
    const domain = hostOf(req);
    // Any real hostname is served unless it was switched off on the ad server.
    if (!canServe(domain)) return single ? send(res, 204) : send(res, 200, { ads: groups.map(() => null) });
    const used = new Set();
    const ads = groups.map((group) => {
      const sizes = parseSizes(group);
      if (!sizes.length) return null;
      const base = { campaigns: manifest.campaigns, domain, sizes, now, rng: opts.random, remaining };
      // Prefer a campaign not already on the page, then allow repeats.
      const pick = selectAd({ ...base, exclude: used }) || (used.size ? selectAd(base) : null);
      if (!pick) {
        stats.noFill += 1;
        return null;
      }
      used.add(pick.campaign.id);
      stats.serves += 1;
      return toAd(pick, domain, now);
    });
    if (single) return ads[0] ? send(res, 200, ads[0]) : send(res, 204);
    return send(res, 200, { ads });
  }

  async function handleImpression(req, res) {
    const body = await readBody(req);
    const ids = Array.isArray(body?.serveIds) ? body.serveIds.slice(0, 24) : body?.serveId ? [body.serveId] : [];
    if (!ids.length) return send(res, 400, { error: 'serveId required' });
    if (isBot(req)) return send(res, 204);
    const now = opts.now();
    const domain = hostOf(req);
    for (const id of ids) {
      const serve = readServeId(id);
      if (!serve || serve.domain !== domain || !byCampaign.has(serve.campaignId)) {
        stats.rejectedTokens += 1;
        continue;
      }
      if (now - serve.at > IMPRESSION_WINDOW_MS || serve.at - now > 60_000) continue;
      if (seenImpressions.add(id, now)) count('impressions', serve, now);
    }
    return send(res, 204);
  }

  function handleClick(req, res, token) {
    const serve = readServeId(token);
    if (!serve) {
      stats.rejectedTokens += 1;
      return send(res, 404, { error: 'not found' });
    }
    const campaign = byCampaign.get(serve.campaignId);
    if (!campaign?.clickUrl) return send(res, 404, { error: 'not found' });
    const now = opts.now();
    const countable =
      req.method === 'GET' && !isBot(req) && serve.domain === hostOf(req) && now - serve.at <= CLICK_WINDOW_MS && serve.at - now <= 60_000;
    if (countable && seenClicks.add(token, now)) count('clicks', serve, now);
    return send(res, 302, undefined, { Location: campaign.clickUrl, 'Referrer-Policy': 'no-referrer' });
  }

  function router(req, res, next) {
    const url = new URL(req.url, 'http://edge.local');
    const route = url.pathname;
    const now = opts.now();
    const limited = (kind) => {
      if (limiters[kind].allow(ipOf(req), now)) return false;
      stats.rateLimited += 1;
      send(res, 429, { error: 'rate limited' }, { 'Retry-After': '60' });
      return true;
    };
    try {
      if (route === '/serve' && (req.method === 'GET' || req.method === 'HEAD')) {
        if (!limited('serve')) handleServe(req, res, url.searchParams);
        return;
      }
      if (route === '/i' && req.method === 'POST') {
        if (!limited('impression')) handleImpression(req, res).catch(() => send(res, 204));
        return;
      }
      if (route.startsWith('/m/') && (req.method === 'GET' || req.method === 'HEAD')) {
        if (!limited('media')) handleMedia(req, res, route.slice(3)).catch(() => send(res, 502, { error: 'image unavailable' }));
        return;
      }
      if (route.startsWith('/c/') && (req.method === 'GET' || req.method === 'HEAD')) {
        if (!limited('click')) handleClick(req, res, decodeURIComponent(route.slice(3)));
        return;
      }
    } catch (err) {
      log.error('request failed', { route, error: err.message });
      if (!res.headersSent) return send(res, 204);
      return;
    }
    if (typeof next === 'function') return next();
    send(res, 404, { error: 'not found' });
  }

  // --- Lifecycle ---------------------------------------------------------
  function getStats() {
    let pendingRows = counters.size;
    for (const batch of batches) pendingRows += batch.payload.rows.length;
    return {
      ...stats,
      instanceId: opts.instanceId,
      manifestVersion: manifest?.version || null,
      campaigns: manifest ? manifest.campaigns.length : 0,
      pendingBatches: batches.length,
      pendingRows,
      spoolBytes: spoolBytes(),
    };
  }

  async function close({ timeoutMs = 5000 } = {}) {
    if (closed) return;
    closed = true;
    for (const timer of timers) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    timers.clear();
    // Everything is on disk before the network attempt, so a slow or
    // unreachable ad server cannot lose data on shutdown.
    sealBatch();
    persistCounters();
    let timer;
    await Promise.race([flush({ seal: false }), new Promise((resolve) => (timer = setTimeout(resolve, timeoutMs)))]);
    clearTimeout(timer);
  }

  function start() {
    loadSpool();
    if (!opts.instanceId) opts.instanceId = crypto.randomUUID();
    const ready = refreshManifest().then(() => {
      if (batches.length) flush({ seal: false }).catch(() => {});
    });
    every(() => refreshManifest(), opts.manifestRefreshMs);
    every(() => {
      persistCounters();
      const now = opts.now();
      seenImpressions.prune(now);
      seenClicks.prune(now);
      for (const limiter of Object.values(limiters)) limiter.prune(now);
    }, opts.spoolIntervalMs);
    scheduleFlush();
    if (opts.handleSignals) {
      for (const signal of ['SIGTERM', 'SIGINT']) {
        process.once(signal, () => {
          const alone = process.listenerCount(signal) === 0;
          close().finally(() => {
            // Exit only when the host app has no handler of its own.
            if (alone) process.exit(0);
          });
        });
      }
    }
    return ready;
  }

  router.getStats = getStats;
  router.flush = () => flush();
  router.close = close;
  router.refreshManifest = refreshManifest;
  router.ready = opts.autoStart ? start() : Promise.resolve();
  router.start = start;
  return router;
}

export default createAdsRouter;

// Campaign selection. Pure functions with no I/O, shared by the edge module
// and the ad server (re-exported from /shared/selection.js).

const SIZE_RE = /^(\d{1,4})x(\d{1,4})$/;

export function normalizeHost(host) {
  if (typeof host !== 'string') return '';
  let h = host.trim().toLowerCase();
  if (h.startsWith('[')) return h.slice(0, h.indexOf(']') + 1);
  const colon = h.indexOf(':');
  if (colon !== -1) h = h.slice(0, colon);
  if (h.endsWith('.')) h = h.slice(0, -1);
  return h;
}

const HOST_LABEL = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?';
const HOSTNAME_RE = new RegExp(`^(?:${HOST_LABEL}\\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$`);

// A plain, lower-case DNS name with at least one dot. No wildcards, IPs, or ports.
export function isHostname(host) {
  return typeof host === 'string' && host.length <= 253 && HOSTNAME_RE.test(host);
}

// `*.example.com` matches any subdomain depth, but not the apex itself.
export function hostMatches(pattern, host) {
  if (!pattern || !host) return false;
  if (pattern === host) return true;
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1);
    return host.length > suffix.length && host.endsWith(suffix);
  }
  return false;
}

export function hostMatchesAny(patterns, host) {
  for (const p of patterns) if (hostMatches(p, host)) return true;
  return false;
}

export function domainAllowed(targeting, host) {
  const mode = targeting?.mode || 'all';
  if (mode === 'all') return true;
  const hit = hostMatchesAny(targeting.domains || [], host);
  return mode === 'include' ? hit : !hit;
}

export function inSchedule(campaign, now) {
  const t = typeof now === 'number' ? now : now.getTime();
  if (campaign.startsAt && Date.parse(campaign.startsAt) > t) return false;
  if (campaign.endsAt && Date.parse(campaign.endsAt) <= t) return false;
  return true;
}

export function parseSizes(input) {
  if (!input) return [];
  const parts = Array.isArray(input) ? input : String(input).split(',');
  const out = [];
  for (const raw of parts) {
    const s = String(raw).trim().toLowerCase().replace('×', 'x');
    if (SIZE_RE.test(s) && !out.includes(s)) out.push(s);
    if (out.length === 8) break;
  }
  return out;
}

// Returns one candidate per eligible campaign: the campaign plus its creatives
// in the most preferred requested size it can fill.
export function eligibleCampaigns(campaigns, { domain, sizes, now = Date.now(), remaining, exclude } = {}) {
  const out = [];
  for (const campaign of campaigns) {
    if (campaign.status && campaign.status !== 'active') continue;
    if (exclude && exclude.has(campaign.id)) continue;
    if (!inSchedule(campaign, now)) continue;
    if (!domainAllowed(campaign.targeting, domain)) continue;
    if (remaining && !(remaining(campaign) > 0)) continue;
    let creatives = null;
    let rank = -1;
    for (let i = 0; i < sizes.length && !creatives; i++) {
      const matches = campaign.creatives.filter((c) => c.size === sizes[i]);
      if (matches.length) {
        creatives = matches;
        rank = i;
      }
    }
    if (creatives) out.push({ campaign, creatives, rank });
  }
  return out;
}

export function pickWeighted(items, weightOf, rng = Math.random) {
  let total = 0;
  for (const item of items) total += Math.max(0, weightOf(item));
  if (!(total > 0)) return null;
  let roll = rng() * total;
  for (const item of items) {
    roll -= Math.max(0, weightOf(item));
    if (roll < 0) return item;
  }
  return items[items.length - 1];
}

// Weighted random among campaigns that can fill the best available size.
// Campaigns compete only against others at the same size rank, so a wide slot
// prefers its largest size whenever any campaign has it.
export function selectAd({ campaigns, domain, sizes, now, rng = Math.random, remaining, exclude }) {
  const eligible = eligibleCampaigns(campaigns, { domain, sizes, now, remaining, exclude });
  if (!eligible.length) return null;
  const best = Math.min(...eligible.map((e) => e.rank));
  const pool = eligible.filter((e) => e.rank === best);
  const chosen = pickWeighted(pool, (e) => e.campaign.weight, rng);
  if (!chosen) return null;
  const creative = chosen.creatives[Math.floor(rng() * chosen.creatives.length)] || chosen.creatives[0];
  return { campaign: chosen.campaign, creative };
}

// Expected traffic share per campaign for one size, ignoring targeting and caps.
export function expectedShares(campaigns, size) {
  const pool = campaigns.filter((c) => c.creatives.some((cr) => cr.size === size));
  const total = pool.reduce((sum, c) => sum + c.weight, 0);
  return pool.map((c) => ({ campaignId: c.id, share: total ? c.weight / total : 0 }));
}

// Small seedable PRNG so selection can be made deterministic.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

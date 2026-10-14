// Which localStorage keys stay out of a cloud save. static/account.html
// carries the same rule (isProxyStorageKey) and the two must match, or the
// sync check on /profile never reports "In sync".

// The proxy keeps a proxied site's storage in ours as "<host>@<key>".
const PROXY_KEY = /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?@/i;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;
const MAX_LAYERS = 8;

// Undoes the letter and digit shift on a scrambled key.
function unshift(text) {
  return text.replace(/[A-Za-z0-9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code <= 57) return String.fromCharCode(48 + ((code - 48 + 5) % 10));
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(base + ((code - base + 21) % 26));
  });
}

// Older saves also hold scrambled copies of keys: the key URI-encoded, in
// base64, with letters and digits shifted by five, sometimes several times
// over. Returns the key one layer down, or null when it is not scrambled.
function unscramble(key) {
  if (key.length % 4 !== 0 || !BASE64.test(key)) return null;
  const raw = Buffer.from(unshift(key), "base64").toString("latin1");
  if (!/^[\x20-\x7e]+$/.test(raw)) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

export function isProxyStorageKey(key) {
  let plain = String(key);
  for (let layer = 0; layer < MAX_LAYERS; layer++) {
    if (PROXY_KEY.test(plain)) return true;
    const next = unscramble(plain);
    if (next === null) return false;
    plain = next;
  }
  return PROXY_KEY.test(plain);
}

// A copy of an uploaded save without the proxied sites' storage.
export function withoutProxyKeys(save) {
  if (!save || typeof save !== "object" || Array.isArray(save)) return save;
  const kept = {};
  for (const key of Object.keys(save)) {
    if (!isProxyStorageKey(key)) kept[key] = save[key];
  }
  return kept;
}

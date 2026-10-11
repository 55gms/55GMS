// The preset avatars an account can pick. An account stores one of these ids
// (users.avatar) or nothing, which shows the preset its uuid maps to.
// The images are static/img/avatars/<id>.svg: the DiceBear "Sprouts" style,
// CC0 1.0. An id that has been handed out must keep its file.
export const AVATAR_IDS = Array.from(
  { length: 40 },
  (_, index) => `a${String(index + 1).padStart(2, "0")}`,
);

const VALID = new Set(AVATAR_IDS);

export function isValidAvatar(id) {
  return typeof id === "string" && VALID.has(id);
}

// The preset an account shows until it picks one: always the same for a
// uuid, and spread across the presets so accounts look different.
export function defaultAvatar(uuid) {
  const text = String(uuid ?? "");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) >>> 0;
  }
  return AVATAR_IDS[hash % AVATAR_IDS.length];
}

// What a stored value is sent to clients as: the chosen preset, or the
// account's default.
export function publicAvatar(id, uuid) {
  return isValidAvatar(id) ? id : defaultAvatar(uuid);
}

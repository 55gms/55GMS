// The preset avatars an account can pick. An account stores one of these ids
// (users.avatar) or nothing, which shows its initial on a colour instead.
// The images are static/img/avatars/<id>.svg: the DiceBear "Thumbs" style,
// CC0 1.0. An id that has been handed out must keep its file.
export const AVATAR_IDS = Array.from(
  { length: 40 },
  (_, index) => `a${String(index + 1).padStart(2, "0")}`,
);

const VALID = new Set(AVATAR_IDS);

export function isValidAvatar(id) {
  return typeof id === "string" && VALID.has(id);
}

// What a stored value is sent to clients as: a known id, or null.
export function publicAvatar(id) {
  return isValidAvatar(id) ? id : null;
}

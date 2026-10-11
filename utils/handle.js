// The one definition of a handle. Signup, login, the chat lookups and the
// migration all go through here.
export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 16;
export const HANDLE_RULE_MESSAGE =
  "Handles use only letters, numbers and dashes, 3 to 16 characters";

const HANDLE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class HandleError extends Error {
  constructor(code) {
    super(code);
    this.name = "HandleError";
    this.code = code;
  }
}

// What a person typed, as a candidate handle: no surrounding space, no
// leading "@", lowercase. Says nothing about whether it is valid.
export function normalizeHandle(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/^@/, "").toLowerCase();
}

export function isValidHandle(handle) {
  return (
    typeof handle === "string" &&
    handle.length >= HANDLE_MIN_LENGTH &&
    handle.length <= HANDLE_MAX_LENGTH &&
    HANDLE_PATTERN.test(handle)
  );
}

// The closest handle to an old username: drop what is not allowed, collapse
// runs of dashes, trim dashes from the ends. The result can be too short.
export function cleanToHandle(name) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hasNonAscii(name) {
  return /[^\x00-\x7F]/.test(String(name ?? ""));
}

// Accounts told to choose a handle have until this moment. Unset means no
// deadline: the choice stays open and no deadline notice is shown.
export function handleDeadline() {
  const raw = process.env.HANDLE_MIGRATION_DEADLINE;
  if (!raw) return null;
  const deadline = new Date(raw);
  return Number.isNaN(deadline.getTime()) ? null : deadline;
}

export function isHandleChoiceOpen(now = Date.now()) {
  const deadline = handleDeadline();
  return !deadline || now < deadline.getTime();
}

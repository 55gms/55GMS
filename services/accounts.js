import { createWorkerAccounts } from "./workerAccounts.js";

const METHODS = [
  "createUser",
  "verifyLogin",
  "getUserByUuid",
  "getUserByUsername",
  "isPremium",
  "searchUsers",
  "setPremium",
  "writeSave",
  "readSave",
];

let backendPromise;

// ACCOUNT_BACKEND=postgres serves accounts and saves from the local
// database; anything else keeps using the Cloudflare Worker. The Postgres
// backend is imported lazily so Worker mode never loads the models.
async function loadBackend() {
  if (process.env.ACCOUNT_BACKEND === "postgres") {
    const [{ createPostgresAccounts }, { User, UserSave }] = await Promise.all([
      import("./postgresAccounts.js"),
      import("../models/index.js"),
    ]);
    return createPostgresAccounts({ User, UserSave });
  }

  return createWorkerAccounts();
}

function getBackend() {
  backendPromise ||= loadBackend();
  return backendPromise;
}

export const ACCOUNT_WRITES_FROZEN_ERROR =
  "Accounts are being migrated. Try again in a few minutes.";

// Set ACCOUNT_WRITES_FROZEN=true during the cutover export so no signup or
// save lands in the Worker after it has been copied.
export function areAccountWritesFrozen() {
  return process.env.ACCOUNT_WRITES_FROZEN === "true";
}

const accounts = Object.fromEntries(
  METHODS.map((method) => [
    method,
    async (...args) => (await getBackend())[method](...args),
  ]),
);

export default accounts;

import { randomBytes } from "./util.js";

export function makeSecrets() {
  return {
    id: randomBytes(8).toString("hex"),
    assetVersion: randomBytes(6).toString("hex"),
    catalogueKey: randomBytes(16),
  };
}

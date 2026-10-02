import { randomUUID } from "node:crypto";
import * as defaultPasswords from "../utils/passwordHash.js";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 16;

function toPublicUser(user) {
  return {
    uuid: user.uuid,
    username: user.username,
    premium: Boolean(user.premium),
  };
}

// Accounts and saves stored in Postgres. Models are injected so the logic
// can be tested without a database.
export function createPostgresAccounts({
  User,
  UserSave,
  passwords = defaultPasswords,
}) {
  return {
    async createUser({ username, password }) {
      if (typeof username !== "string" || typeof password !== "string") {
        throw new Error("Invalid username or password");
      }
      if (username.length > USERNAME_MAX_LENGTH) {
        throw new Error("Username Too Long");
      }
      if (username.length < USERNAME_MIN_LENGTH) {
        throw new Error("Username too Short");
      }

      const user = await User.create({
        uuid: randomUUID(),
        username,
        password: await passwords.hashPassword(password),
        premium: false,
      });

      return toPublicUser(user);
    },

    async verifyLogin({ username, password }) {
      if (typeof username !== "string" || typeof password !== "string") {
        return null;
      }

      const user = await User.findOne({ where: { username } });
      if (!user) return null;

      const isValid = await passwords.verifyPassword(password, user.password);
      if (!isValid) return null;

      return { ...toPublicUser(user), success: true };
    },

    async getUserByUuid(uuid) {
      const user = await User.findByPk(String(uuid));
      return user ? toPublicUser(user) : null;
    },

    async getUserByUsername(username) {
      const user = await User.findOne({
        where: { username: String(username) },
      });
      return user ? toPublicUser(user) : null;
    },

    async isPremium(uuid) {
      const user = await User.findByPk(String(uuid), {
        attributes: ["uuid", "premium"],
      });
      return user ? { premium: Boolean(user.premium) } : null;
    },

    async writeSave(uuid, saveData) {
      await UserSave.upsert({
        uuid: String(uuid),
        saveData: JSON.stringify(saveData),
      });
      return { success: true, uuid };
    },

    async readSave(uuid) {
      const save = await UserSave.findByPk(String(uuid));
      return save ? save.saveData : null;
    },
  };
}

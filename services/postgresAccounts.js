import { randomUUID } from "node:crypto";
import { Op } from "sequelize";
import * as defaultPasswords from "../utils/passwordHash.js";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 16;
const SEARCH_LIMIT = 20;

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

    // Case-insensitive username prefix search for the admin screen.
    async searchUsers(query) {
      const prefix = String(query).replace(/[\\%_]/g, "\\$&");
      const users = await User.findAll({
        where: { username: { [Op.iLike]: `${prefix}%` } },
        attributes: ["uuid", "username", "premium"],
        order: [["username", "ASC"]],
        limit: SEARCH_LIMIT,
      });
      return users.map(toPublicUser);
    },

    async setPremium(uuid, premium) {
      const user = await User.findByPk(String(uuid));
      if (!user) return null;

      await user.update({ premium: Boolean(premium) });
      return toPublicUser(user);
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

import { randomUUID } from "node:crypto";
import { Op, col, fn, where as sqlWhere } from "sequelize";
import * as defaultPasswords from "../utils/passwordHash.js";
import {
  HandleError,
  isHandleChoiceOpen,
  isValidHandle,
  normalizeHandle,
} from "../utils/handle.js";
import { isValidAvatar, publicAvatar } from "../utils/avatars.js";

const SEARCH_LIMIT = 20;

// handlePending is what callers act on: the stored flag stops mattering once
// the deadline has passed, when a placeholder becomes the account's handle.
function toPublicUser(user) {
  return {
    uuid: user.uuid,
    username: user.username,
    premium: Boolean(user.premium),
    avatar: publicAvatar(user.avatar, user.uuid),
    handlePending: Boolean(user.handlePending) && isHandleChoiceOpen(),
  };
}

// For /admin only: says whether premium is a grant made there.
function toAdminUser(user) {
  return {
    ...toPublicUser(user),
    premiumGranted: Boolean(user.premiumGranted),
  };
}

function isUniqueViolation(error) {
  return error?.name === "SequelizeUniqueConstraintError";
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
      const handle = normalizeHandle(username);
      if (!isValidHandle(handle)) throw new HandleError("invalid_handle");

      try {
        const user = await User.create({
          uuid: randomUUID(),
          username: handle,
          password: await passwords.hashPassword(password),
          premium: false,
        });
        return toPublicUser(user);
      } catch (error) {
        if (isUniqueViolation(error)) throw new HandleError("handle_taken");
        throw error;
      }
    },

    // A typed name can point at more than one account: an old username kept
    // by one account can be the handle of another. Every match is tried and
    // the password decides. Old names are tried first, exactly as typed, so
    // nobody's login changes; the last candidate (the stored name as typed)
    // only matters on a database the handle migration has not reached yet.
    async verifyLogin({ username, password }) {
      if (typeof username !== "string" || typeof password !== "string") {
        return null;
      }

      const trimmed = username.trim();
      const handle = normalizeHandle(username);
      const typed = [...new Set([username, trimmed])];
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { legacyUsername: { [Op.in]: typed } },
            { username: { [Op.in]: [...new Set([handle, ...typed])] } },
          ],
        },
      });

      const rank = (user) => {
        if (user.legacyUsername === username) return 0;
        if (user.legacyUsername === trimmed) return 1;
        if (user.username === handle) return 2;
        return 3;
      };
      users.sort((a, b) => rank(a) - rank(b));

      for (const user of users) {
        if (await passwords.verifyPassword(password, user.password)) {
          return { ...toPublicUser(user), success: true };
        }
      }
      return null;
    },

    async getUserByUuid(uuid) {
      const user = await User.findByPk(String(uuid));
      return user ? toPublicUser(user) : null;
    },

    // Finds an account by handle, in any case and with or without "@". The
    // name as typed is tried too, for a database not yet migrated.
    async getUserByUsername(username) {
      const typed = String(username);
      const users = await User.findAll({
        where: {
          username: { [Op.in]: [...new Set([typed, normalizeHandle(typed)])] },
        },
      });
      const user = users.find((match) => match.username === typed) || users[0];
      return user ? toPublicUser(user) : null;
    },

    // Whether a handle already belongs to an account. One lookup on the
    // unique username index, fetching no row data.
    async isHandleTaken(handle) {
      const user = await User.findOne({
        attributes: ["uuid"],
        where: { username: String(handle) },
        raw: true,
      });
      return Boolean(user);
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
        attributes: ["uuid", "username", "premium", "premiumGranted", "avatar"],
        order: [["username", "ASC"]],
        limit: SEARCH_LIMIT,
      });
      return users.map(toAdminUser);
    },

    // Grants or revokes premium by hand. With billing on, the admin route
    // then recomputes the flag, so revoking a grant leaves a paying
    // subscriber premium (services/billing.js).
    async setPremium(uuid, premium) {
      const user = await User.findByPk(String(uuid));
      if (!user) return null;

      const granted = Boolean(premium);
      await user.update({ premium: granted, premiumGranted: granted });
      return toAdminUser(user);
    },

    // Only an account that was told to choose can set its handle, once, and
    // only until the deadline. Keeping the placeholder counts as choosing.
    async setHandle(uuid, input) {
      const handle = normalizeHandle(input);
      if (!isValidHandle(handle)) throw new HandleError("invalid_handle");

      const user = await User.findByPk(String(uuid));
      if (!user) return null;
      if (!user.handlePending) throw new HandleError("not_pending");
      if (!isHandleChoiceOpen()) throw new HandleError("deadline_passed");

      try {
        await user.update({ username: handle, handlePending: false });
      } catch (error) {
        if (isUniqueViolation(error)) throw new HandleError("handle_taken");
        throw error;
      }
      return toPublicUser(user);
    },

    // Sets a preset avatar, or goes back to the default with null. Returns
    // false for an id that is not a preset.
    async setAvatar(uuid, avatar) {
      if (avatar !== null && !isValidAvatar(avatar)) return false;

      const user = await User.findByPk(String(uuid));
      if (!user) return null;

      await user.update({ avatar });
      return toPublicUser(user);
    },

    // "What is my handle now?" for someone who only knows their old
    // username. The exact spelling wins; otherwise a spelling that differs
    // only in case, when exactly one account used it.
    async lookupLegacyUsername(name) {
      const typed = String(name ?? "").trim();
      if (!typed) return { status: "none" };

      let matches = await User.findAll({
        where: { legacyUsername: typed },
        limit: 2,
      });
      if (!matches.length) {
        matches = await User.findAll({
          where: sqlWhere(
            fn("lower", col("legacy_username")),
            typed.toLowerCase(),
          ),
          limit: 2,
        });
      }

      if (!matches.length) return { status: "none" };
      if (matches.length > 1) return { status: "ambiguous" };

      const user = toPublicUser(matches[0]);
      return user.handlePending
        ? { status: "pending" }
        : { status: "found", handle: user.username };
    },

    // silent keeps updatedAt out of it: being seen is not an edit.
    async touchLastSeen(uuid) {
      await User.update(
        { lastSeenAt: new Date() },
        { where: { uuid: String(uuid) }, silent: true },
      );
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

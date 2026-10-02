import express from "express";
import defaultAccounts, {
  ACCOUNT_WRITES_FROZEN_ERROR,
  areAccountWritesFrozen,
} from "../services/accounts.js";

export function createUsersRouter({ accounts = defaultAccounts } = {}) {
  const router = express.Router();

  router.post("/checkPremium", async (req, res) => {
    let { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }

    try {
      const result = await accounts.isPremium(uuid);
      if (!result) {
        return res.status(500).json({ error: "User not found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router.post("/uploadSave", async (req, res) => {
    let saveData = req.body;
    let uuid = req.headers["uuid"];

    if (!saveData || !uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }
    if (areAccountWritesFrozen()) {
      return res.status(503).json({ error: ACCOUNT_WRITES_FROZEN_ERROR });
    }

    try {
      const result = await accounts.writeSave(uuid, saveData);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  router.post("/readSave", async (req, res) => {
    let { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ error: "Not enough arguments" });
    }

    try {
      const saveJson = await accounts.readSave(uuid);
      if (saveJson === null || saveJson === undefined) {
        return res
          .status(500)
          .json({ error: "No data found for the provided UUID" });
      }

      // Already a JSON string; send it without parsing (saves can be 25 MB).
      res.status(200).type("application/json").send(saveJson);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  return router;
}

export default createUsersRouter();

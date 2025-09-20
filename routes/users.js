import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/checkPremium", async (req, res) => {
  let { uuid } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: "Not enough arguments" });
  }

  try {
    const response = await axios.post(
      "https://db.55gms.com/api/users/premium",
      {
        uuid,
      },
      {
        headers: {
          Authorization: process.env.workerAUTH,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
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

  try {
    const response = await axios.post(
      "https://db.55gms.com/api/users/uploadSave",
      {
        uuid,
        saveData,
      },
      {
        headers: {
          Authorization: process.env.workerAUTH,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
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
    const response = await axios.post(
      "https://db.55gms.com/api/users/readSave",
      {
        uuid: uuid,
      },
      {
        headers: {
          Authorization: process.env.workerAUTH,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;

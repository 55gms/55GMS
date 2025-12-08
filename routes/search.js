import express from "express";
const router = express.Router();
import requestIp from "request-ip";

router.get("/autocomplete", async (req, res) => {
  const q = req.query.q || "";
  const duckUrl = `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(duckUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

router.get("/ip", (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const ip = clientIp || "127.0.0.1";
  const cleanIp = ip.includes("::ffff:") ? ip.replace("::ffff:", "") : ip;
  const prefix = cleanIp.split(".")[0];

  res.send(prefix);
});

export default router;

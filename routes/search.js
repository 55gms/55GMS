import express from "express";
const router = express.Router();

function toIPv4(ip) {
  if (!ip) return "127.0.0.1";
  if (ip.includes(",")) ip = ip.split(",")[0].trim();
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
  return ip.match(/^(\d{1,3}\.){3}\d{1,3}$/) ? ip : "127.0.0.1";
}

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
  const rawIp =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;
  const ipv4 = toIPv4(rawIp);
  const prefix = ipv4.split(".")[0];
  res.send(prefix);
});
export default router;

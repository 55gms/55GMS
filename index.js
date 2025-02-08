const express = require("express");
const http = require("http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const tokenLimit = 498000;
let tokenUsage = 0;

const modelData = `
gemma2-9b-it
llama-3.3-70b-versatile
llama-3.1-8b-instant
llama3-70b-8192
llama3-8b-8192
mixtral-8x7b-32768
llama-3.3-70b-specdec
llama-3.2-1b-preview
llama-3.2-3b-preview
`
  .trim()
  .split("\n")
  .map((line) => ({ name: line.trim() }));

let currentModelIndex = 0;
let currentModel = modelData[currentModelIndex].name;

function switchModel() {
  currentModelIndex = (currentModelIndex + 1) % modelData.length;
  currentModel = modelData[currentModelIndex].name;
  tokenUsage = 0;
  console.log(`🔄 Switched to model: ${currentModel}`);
}

const server = http.createServer();
const app = express();

const bareServer = createBareServer("/t/");
const activeConversations = new Map();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use((req, res, next) => {
  if (path.extname(req.url) === ".js") {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// ✅ Ensure API keys are properly selected
const apiKeys = [process.env.API_KEY, process.env.API_KEY1].filter(Boolean);
if (apiKeys.length === 0) {
  console.error("❌ No API keys found. Please set API_KEY and API_KEY1 in .env file.");
  process.exit(1);
}

// 📌 AI Chatbot API Route
app.post("/api/chat", async (req, res) => {
  const { message, userId } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  let conversation = activeConversations.get(userId) || [];
  conversation.push({ role: "user", content: message });

  try {
    let apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    let response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      { model: currentModel, messages: conversation, temperature: 0.7, max_tokens: 1024 },
      { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
    );

    // ✅ If rate-limited, switch model and retry
    if (response.status === 429) {
      switchModel();
      apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        { model: currentModel, messages: conversation, temperature: 0.7, max_tokens: 1024 },
        { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = response.data.choices[0].message.content;
    conversation.push({ role: "assistant", content: aiResponse });

    tokenUsage += response.data.usage.total_tokens;
    if (conversation.length > 5) conversation = conversation.slice(-5);
    if (tokenUsage >= tokenLimit) switchModel();

    activeConversations.set(userId, conversation);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

// ✅ Token Usage Endpoint
app.get("/api/usedTokens", (req, res) => {
  res.json({ usedTokens: tokenUsage, model: currentModel });
});

// 📌 User Authentication API
app.post("/api/signUp", async (req, res) => {
  const { password, username, premium = false, captchaResponse } = req.body;
  if (!password || !username || !captchaResponse || password.length < 6 || username.length < 3) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  try {
    const captchaVerifyResponse = await axios.post(
      "https://hcaptcha.com/siteverify",
      new URLSearchParams({ secret: process.env.hcaptchaSecret, response: captchaResponse }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!captchaVerifyResponse.data.success) return res.status(400).json({ error: "Invalid CAPTCHA" });

    const response = await axios.post(
      "https://db.55gms.com/api/signup",
      { username, password, premium },
      { headers: { Authorization: process.env.workerAUTH, "Content-Type": "application/json" } }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Sign-Up Error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// 📌 Login API
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing credentials." });

  try {
    const response = await axios.post(
      "https://db.55gms.com/api/login",
      { username, password },
      { headers: { Authorization: process.env.workerAUTH, "Content-Type": "application/json" } }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Invalid username or password." });
  }
});

// 📌 Static File Serving & Routes
app.use(express.static(path.join(__dirname, "static")));

const routes = [
  { path: "/a", file: "apps.html" },
  { path: "/g", file: "art.html" },
  { path: "/s", file: "settings.html" },
  { path: "/", file: "index.html" },
  { path: "/profile", file: "account.html" },
  { path: "/login", file: "/assets/404/login.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "static", "404.html"));
});

// ✅ Server & Graceful Shutdown Handling
server.on("request", (req, res) => {
  try {
    if (bareServer.shouldRoute(req)) bareServer.routeRequest(req, res);
    else app(req, res);
  } catch (error) {
    console.error("❌ Request Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 8080}`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

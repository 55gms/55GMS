const express = require("express");
const http = require("http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/t/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  if (path.extname(req.url) === ".js") {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

app.post("/api/chat", async (req, res) => {
  const { message, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let conversation = activeConversations.get(userId) || [];
  conversation.push({ role: "user", content: message });

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-70b-versatile",
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    conversation.push({ role: "assistant", content: aiResponse });

    if (conversation.length > 10) {
      conversation = conversation.slice(-10);
    }

    activeConversations.set(userId, conversation);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.use(express.static(path.join(__dirname, "static")));

const routes = [
  { path: "/a", file: "apps.html" },
  { path: "/g", file: "art.html" },
  { path: "/s", file: "settings.html" },
  { path: "/p", file: "science.html" },
  { path: "/!", file: "!.html" },
  { path: "/", file: "index.html" },
  { path: "/d", file: "dashboard.html" },
  { path: "/e", file: "english.html" },
  { path: "/-", file: "math.html" },
  { path: "/l", file: "/assets/404/loading.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.get("/misc/*", async (req, res, next) => {
  const baseUrl = "https://raw.githubusercontent.com/kfm5/a/main";
  const secondaryUrl = "https://raw.githubusercontent.com/22yeets22/a/main";
  await fetchDataFromGithub(req, res, next, baseUrl, secondaryUrl);
});
async function fetchDataFromGithub(
  req,
  res,
  next,
  baseUrl,
  secondaryUrl = null
) {
  function isAFile(urlString) {
    return urlString.trim().split("/").pop().length !== 0;
  }

  async function fetchDataOneSource(req, res, next, url) {
    if (isAFile(req.params[0])) {
      const reqTarget = `${url}/${req.params[0]}`;
      const asset = await fetch(reqTarget);
      if (asset.ok) {
        const data = await asset.arrayBuffer();
        res.end(Buffer.from(data));
        return true;
      }
    } else {
      const indexReqTarget = `${url}/${req.params[0]}/index.html`;
      const indexAsset = await fetch(indexReqTarget);
      if (indexAsset.ok) {
        const indexData = await indexAsset.arrayBuffer();
        res.end(Buffer.from(indexData));
        return true;
      }
    }
    return false;
  }

  try {
    if (await fetchDataOneSource(req, res, next, baseUrl)) return;
    if (secondaryUrl) {
      if (await fetchDataOneSource(req, res, next, secondaryUrl)) return;
    }
    res.status(404).send("Resource not found");
  } catch (error) {
    console.error("Error fetching data, internal server error:", error);
    res.status(500).send("Internal Server Error");
  }
}

server.on("request", (req, res) => {
  try {
    if (bareServer.shouldRoute(req)) {
      bareServer.routeRequest(req, res);
    } else {
      app(req, res);
    }
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.on("upgrade", (req, socket, head) => {
  try {
    if (bareServer.shouldRoute(req)) {
      bareServer.routeUpgrade(req, socket, head);
    } else {
      socket.end();
    }
  } catch (error) {
    console.error("Upgrade error:", error);
    socket.end();
  }
});

const activeConversations = new Map();

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "static/404.html"), function (err) {
    if (err) {
      res.status(404).send(err);
    }
  });
});

server.on("listening", () => {
  console.log(`Running at http://localhost:8080`);
});

server.listen({
  port: 8080,
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

const express = require("express");
const http = require("http");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Import route modules
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const { router: chatRoutes, initializeChatRoute } = require("./routes/chat");

// Import utilities
const ModelManager = require("./utils/modelManager");

// Initialize model manager
const modelManager = new ModelManager();

const server = http.createServer();
const app = express(server);
const activeConversations = new Map();

// Initialize chat route with dependencies
initializeChatRoute(modelManager, activeConversations);

app.use("/t/", (req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

const bareServer = createBareServer("/t/");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use((req, res, next) => {
  if (path.extname(req.url) === ".js") {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// Use route modules
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

// Use route modules
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use(express.static(path.join(__dirname, "static")));
app.use((req, res, next) => {
  if (req.method === "GET" && !path.extname(req.url)) {
    const filePath = path.join(__dirname, "static", req.url + ".html");
    res.sendFile(filePath, (err) => {
      if (err) {
        next();
      }
    });
  } else {
    next();
  }
});

const routes = [
  { path: "/a", file: "apps.html" },
  { path: "/g", file: "games.html" },
  { path: "/s", file: "settings.html" },
  { path: "/!", file: "proxy.html" },
  { path: "/", file: "index.html" },
  { path: "/d", file: "dashboard.html" },
  { path: "/e", file: "ai.html" },
  { path: "/-", file: "media.html" },
  { path: "/m", file: "media.html" }, // possibly change all navbars to use /m
  { path: "/profile", file: "account.html" },
  { path: "/login", file: "login.html" },
  { path: "/signup", file: "signup.html" },
  { path: "/l", file: "/assets/404/loading.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.use((req, res) => {
  const notFoundPage = path.join(__dirname, "static", "404.html");
  res.status(404).sendFile(notFoundPage);
});

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

server.on("listening", () => {
  console.log(`\n------------------------------------`);
  console.log(`🔗 URL: http://localhost:${process.env.PORT}`);
  console.log(`------------------------------------\n`);
});

function shutdown(signal) {
  console.log("-----------------------------------------------");
  console.log(`  Shutting Down (Signal: ${signal})  `);
  console.log("-----------------------------------------------\n");
  server.close(() => {
    console.log("  55GMS has shut down.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.listen({
  port: process.env.PORT || 8080,
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

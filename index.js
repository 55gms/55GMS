import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import { Server as SocketIO } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import "dotenv/config";
import { Op } from "sequelize";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const require = createRequire(import.meta.url);
const { epoxyPath } = require("@mercuryworkshop/epoxy-transport");
const { baremuxPath } = require("@mercuryworkshop/bare-mux/node");
import { scramjetPath } from "@mercuryworkshop/scramjet/path";

logging.set_level(logging.ERROR);

import {
  initDatabase,
  UserStatus,
  Chat,
  Message,
  ChatMember,
} from "./models/index.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messagingRoutes from "./routes/messaging.js";
import { router as chatRoutes, initializeChatRoute } from "./routes/chat.js";
import searchRoutes from "./routes/search.js";
import proxyRoutes from "./routes/music.js";

import ModelManager from "./utils/modelManager.js";

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const modelManager = new ModelManager();

  const fastify = Fastify({
    bodyLimit: 52428800, // 50MB
  });

  // Static file serving
  fastify.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/epoxy/",
    decorateReply: false,
    list: true,
  });
  fastify.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/baremux/",
    decorateReply: false,
    list: true,
  });
  fastify.register(fastifyStatic, {
    root: scramjetPath,
    prefix: "/scram/",
    decorateReply: false,
    list: true,
  });
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "static"),
    prefix: "/",
  });

  // Plugins
  fastify.register(fastifyFormbody);
  fastify.register(fastifyCors);

  // Routes
  fastify.register(authRoutes, { prefix: "/api" });
  fastify.register(userRoutes, { prefix: "/api" });
  fastify.register(messagingRoutes, { prefix: "/api" });
  fastify.register(chatRoutes, { prefix: "/api" });
  fastify.register(searchRoutes, { prefix: "/api" });
  fastify.register(proxyRoutes, { prefix: "/api/music" });

  const io = new SocketIO(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const activeConversations = new Map();
  const connectedUsers = new Map();
  const activeChats = new Map();

  initDatabase().catch(console.error);

  initializeChatRoute(modelManager, activeConversations);

  // Custom static file handler for extensionless URLs
  // The original express code did this:
  // 1. serve static files (via express.static)
  // 2. if GET and no extension, try to serve url + .html
  // 3. define specific routes like /a -> apps.html
  // 4. /chat/:chatId -> chat.html
  // 5. 404 handler

  // In Fastify, @fastify/static handles #1.
  // For #3 and #4, we can define routes.
  // For #2, we can use setNotFoundHandler or a wildcard route, but let's try to map the specific routes first.

  const routes = [
    { path: "/a", file: "apps.html" },
    { path: "/g", file: "games.html" },
    { path: "/s", file: "settings.html" },
    { path: "/!", file: "proxy.html" },
    { path: "/", file: "index.html" },
    { path: "/d", file: "dashboard.html" },
    { path: "/e", file: "ai.html" },
    { path: "/-", file: "media.html" },
    { path: "/m", file: "media.html" },
    { path: "/profile", file: "account.html" },
    { path: "/login", file: "login.html" },
    { path: "/signup", file: "signup.html" },
    { path: "/l", file: "/assets/404/loading.html" },
    { path: "/c", file: "chat.html" },
    { path: "/chat", file: "chat.html" },
  ];

  routes.forEach((route) => {
    fastify.get(route.path, (req, reply) => {
      reply.sendFile(route.file);
    });
  });

  fastify.get("/chat/:chatId", (req, reply) => {
    reply.sendFile("chat.html");
  });

  // Javascript MIME type handling was done via middleware in Express:
  // app.use((req, res, next) => { if (path.extname(req.url) === ".js") ... })
  // Fastify/static usually handles this correctly.

  // The "extensionless -> .html" fallback (#2)
  fastify.setNotFoundHandler(async (req, reply) => {
    if (req.method === "GET" && !path.extname(req.url)) {
      const potentialFile = path.join(__dirname, "static", req.url + ".html");
      const require = createRequire(import.meta.url);
      const fs = require("fs").promises;

      try {
        await fs.access(potentialFile);
        return reply.sendFile(req.url + ".html");
      } catch (err) {
        // File doesn't exist, proceed to 404
      }
    }
    reply.status(404).sendFile("404.html");
  });

  io.on("connection", (socket) => {
    socket.on("authenticate", async (data) => {
      try {
        const { uuid, joinChatRooms = false } = data;
        if (!uuid) return;

        connectedUsers.set(socket.id, uuid);

        await UserStatus.upsert({
          userUuid: uuid,
          isOnline: true,
          lastSeen: new Date(),
          socketId: socket.id,
        });

        socket.join(`user_${uuid}`);

        if (joinChatRooms) {
          const userChats = await ChatMember.findAll({
            where: { userUuid: uuid },
            include: [{ model: Chat, as: "chat" }],
          });

          userChats.forEach((chatMember) => {
            socket.join(`chat_${chatMember.chatId}`);
          });
        }

        socket.broadcast.emit("user_status_change", {
          userUuid: uuid,
          isOnline: true,
        });
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    });

    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    socket.on("viewing_chat", (chatId) => {
      activeChats.set(socket.id, chatId);
    });

    socket.on("stop_viewing_chat", () => {
      activeChats.delete(socket.id);
    });

    socket.on("send_message", async (data) => {
      try {
        const { chatId, content, senderUuid, senderUsername, isSystem } = data;

        const authenticatedUuid = connectedUsers.get(socket.id);
        if (authenticatedUuid !== senderUuid && !isSystem) {
          return socket.emit("error", "Authentication mismatch");
        }

        const finalSenderUsername = senderUsername || "Unknown User";

        socket.to(`chat_${chatId}`).emit("new_message", {
          chatId,
          content,
          senderUuid,
          senderUsername: finalSenderUsername,
          timestamp: new Date(),
          isSystem: isSystem || false,
        });

        const chatMembers = await ChatMember.findAll({
          where: { chatId },
        });

        chatMembers.forEach((member) => {
          if (member.userUuid !== senderUuid) {
            const userSockets = Array.from(connectedUsers.entries())
              .filter(([socketId, userUuid]) => userUuid === member.userUuid)
              .map(([socketId]) => socketId);

            const isCurrentlyViewing = userSockets.some(
              (socketId) => activeChats.get(socketId) === chatId,
            );

            if (!isCurrentlyViewing) {
              socket
                .to(`user_${member.userUuid}`)
                .emit("new_message_notification", {
                  chatId,
                  content,
                  senderUuid,
                  senderUsername: finalSenderUsername,
                  timestamp: new Date(),
                  isSystem: isSystem || false,
                });
            }
          }
        });

        await Chat.update(
          { lastActivity: new Date() },
          { where: { id: chatId } },
        );
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on("typing_start", (data) => {
      const { chatId, senderUuid } = data;
      socket.to(`chat_${chatId}`).emit("user_typing", {
        chatId,
        userUuid: senderUuid,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data) => {
      const { chatId, senderUuid } = data;
      socket.to(`chat_${chatId}`).emit("user_typing", {
        chatId,
        userUuid: senderUuid,
        isTyping: false,
      });
    });

    socket.on("mark_read", async (data) => {
      try {
        const { chatId } = data;
        const userUuid = connectedUsers.get(socket.id);

        if (!userUuid) return;

        await ChatMember.update(
          { lastReadAt: new Date() },
          { where: { chatId, userUuid } },
        );

        socket.to(`chat_${chatId}`).emit("messages_read", {
          chatId,
          userUuid,
          readAt: new Date(),
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    socket.on("heartbeat", async (data) => {
      try {
        const { uuid } = data;
        if (!uuid) return;

        await UserStatus.upsert({
          userUuid: uuid,
          isOnline: true,
          lastSeen: new Date(),
          socketId: socket.id,
        });
      } catch (error) {
        console.error("Error handling heartbeat:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        const userUuid = connectedUsers.get(socket.id);
        if (userUuid) {
          await UserStatus.update(
            {
              isOnline: false,
              lastSeen: new Date(),
              socketId: null,
            },
            { where: { userUuid } },
          );

          socket.broadcast.emit("user_status_change", {
            userUuid,
            isOnline: false,
            lastSeen: new Date(),
          });

          connectedUsers.delete(socket.id);
          activeChats.delete(socket.id);
        }
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });

  setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const staleUsers = await UserStatus.findAll({
        where: {
          isOnline: true,
          lastSeen: { [Op.lt]: fiveMinutesAgo },
        },
      });

      for (const user of staleUsers) {
        await user.update({
          isOnline: false,
          socketId: null,
        });

        io.emit("user_status_change", {
          userUuid: user.userUuid,
          isOnline: false,
          lastSeen: user.lastSeen,
        });
      }
    } catch (error) {
      console.error("Error in heartbeat cleanup:", error);
    }
  }, 60000);

  fastify.ready().then(() => {
    // Wisp/Epoxy/Baremux/Scramjet handling
    // We attach upgrade listeners to the underlying node server
    fastify.server.removeAllListeners("upgrade");
    fastify.server.on("upgrade", (req, socket, head) => {
      if (req.url.startsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
      } else {
        io.engine.handleUpgrade(req, socket, head);
      }
    });
  });

  function shutdown(signal) {
    console.log("-----------------------------------------------");
    console.log(`  Shutting Down (Signal: ${signal})  `);
    console.log("-----------------------------------------------\n");
    fastify.close(() => {
      console.log("  55GMS has shut down.");
      io.close();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  const start = async () => {
    try {
      await fastify.listen({ port: process.env.PORT || 8080, host: "0.0.0.0" });
      console.log(`\n------------------------------------`);
      console.log(`🔗 URL: http://localhost:${process.env.PORT || 8080}`);
      console.log(`------------------------------------\n`);
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  };

  start();
} catch (e) {
  console.error("Failed to start server:", e);
  process.exit(1);
}

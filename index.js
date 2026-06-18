import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import cors from "cors";
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
import searchRoutes from "./routes/search.js";
import proxyRoutes from "./routes/music.js";

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();
  app.use("/epoxy/", express.static(epoxyPath));
  app.use("/baremux/", express.static(baremuxPath));
  app.use("/scram/", express.static(scramjetPath));
  const server = createServer(app);

  const io = new SocketIO({
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.attach(server);

  let redisPubClient;
  let redisSubClient;

  async function configureSocketAdapter() {
    if (!process.env.REDIS_URL) {
      console.warn(
        "REDIS_URL is not set. Socket.IO will only coordinate within this Node process.",
      );
      return;
    }

    redisPubClient = createClient({ url: process.env.REDIS_URL });
    redisSubClient = redisPubClient.duplicate();

    redisPubClient.on("error", (error) => {
      console.error("Redis pub client error:", error);
    });
    redisSubClient.on("error", (error) => {
      console.error("Redis sub client error:", error);
    });

    await Promise.all([redisPubClient.connect(), redisSubClient.connect()]);
    io.adapter(createAdapter(redisPubClient, redisSubClient));
    console.log("✅ Socket.IO Redis adapter connected.");
  }

  async function hasOtherUserSocket(userUuid, currentSocketId) {
    const sockets = await io.in(`user_${userUuid}`).fetchSockets();
    return sockets.some((userSocket) => userSocket.id !== currentSocketId);
  }

  function leaveAuthenticatedRooms(socket) {
    for (const room of socket.rooms) {
      if (
        room !== socket.id &&
        (room.startsWith("user_") || room.startsWith("chat_"))
      ) {
        socket.leave(room);
      }
    }
  }

  async function markUserOffline(userUuid, lastSeen) {
    await UserStatus.update(
      {
        isOnline: false,
        lastSeen,
        socketId: null,
      },
      { where: { userUuid } },
    );

    io.emit("user_status_change", {
      userUuid,
      isOnline: false,
      lastSeen,
    });
  }

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cors());

  app.use((req, res, next) => {
    if (path.extname(req.url) === ".js") {
      res.setHeader("Content-Type", "application/javascript");
    }
    next();
  });

  app.use("/api", authRoutes);
  app.use("/api", userRoutes);
  app.use("/api", messagingRoutes);
  app.use("/api", searchRoutes);
  app.use("/api/music", proxyRoutes);

  io.on("connection", (socket) => {
    socket.on("authenticate", async (data) => {
      try {
        const { uuid, joinChatRooms = false } = data;
        if (!uuid) return;

        const previousUuid = socket.data.userUuid;
        if (previousUuid && previousUuid !== uuid) {
          socket.data.userUuid = null;
          socket.data.activeChat = null;
          leaveAuthenticatedRooms(socket);

          if (!(await hasOtherUserSocket(previousUuid, socket.id))) {
            await markUserOffline(previousUuid, new Date());
          }
        }

        await UserStatus.upsert({
          userUuid: uuid,
          isOnline: true,
          lastSeen: new Date(),
          socketId: socket.id,
        });

        socket.data.userUuid = uuid;
        socket.data.activeChat = null;
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
      if (!socket.data.userUuid) return;
      socket.join(`chat_${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    socket.on("viewing_chat", (chatId) => {
      if (!socket.data.userUuid) return;
      socket.data.activeChat = chatId;
    });

    socket.on("stop_viewing_chat", () => {
      socket.data.activeChat = null;
    });

    socket.on("send_message", async (data) => {
      try {
        const { chatId, content, senderUuid, senderUsername, isSystem } = data;

        const authenticatedUuid = socket.data.userUuid;
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

        for (const member of chatMembers) {
          if (member.userUuid !== senderUuid) {
            const userSockets = await io
              .in(`user_${member.userUuid}`)
              .fetchSockets();

            const isCurrentlyViewing = userSockets.some(
              (userSocket) =>
                String(userSocket.data.activeChat) === String(chatId),
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
        }

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
        const userUuid = socket.data.userUuid;

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
        if (socket.data.userUuid !== uuid) return;

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

    socket.on("disconnecting", async () => {
      const userUuid = socket.data.userUuid;
      socket.data.activeChat = null;

      if (!userUuid || (await hasOtherUserSocket(userUuid, socket.id))) {
        return;
      }

      const lastSeen = new Date();
      try {
        await markUserOffline(userUuid, lastSeen);
      } catch (error) {
        console.error("Error during disconnect:", error);
      }
    });
  });

  setInterval(async () => {
    try {
      // 1. Clean up stale users in database
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const staleUsers = await UserStatus.findAll({
        where: {
          isOnline: true,
          lastSeen: { [Op.lt]: thirtyMinutesAgo },
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
      console.error("Error in periodic cleanup:", error);
    }
  }, 60000).unref?.();

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
    app.get(route.path, (req, res) => {
      res.sendFile(path.join(__dirname, "static", route.file));
    });
  });

  app.get("/chat/:chatId", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "chat.html"));
  });

  app.use((req, res) => {
    const notFoundPage = path.join(__dirname, "static", "404.html");
    res.status(404).sendFile(notFoundPage);
  });

  server.removeAllListeners("upgrade");

  server.on("upgrade", (req, socket, head) => {
    if (req.url.startsWith("/wisp/")) {
      wisp.routeRequest(req, socket, head);
    } else {
      io.engine.handleUpgrade(req, socket, head);
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
    server.close(async () => {
      console.log("  55GMS has shut down.");
      io.close();
      await Promise.allSettled([
        redisPubClient?.quit(),
        redisSubClient?.quit(),
      ]);
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  Promise.all([initDatabase(), configureSocketAdapter()])
    .then(() => {
      server.listen({
        port: process.env.PORT || 8080,
      });
    })
    .catch((error) => {
      console.error("Failed to initialize server dependencies:", error);
      process.exit(1);
    });

  server.on("error", (error) => {
    console.error("Server error:", error);
  });
} catch (e) {
  console.error("Failed to start server:", e);
  process.exit(1);
}

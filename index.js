const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { createBareServer } = require("@tomphttp/bare-server-node");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { Op } = require("sequelize");
dotenv.config();

const {
  initDatabase,
  UserStatus,
  Chat,
  Message,
  ChatMember,
} = require("./models");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messagingRoutes = require("./routes/messaging");
const { router: chatRoutes, initializeChatRoute } = require("./routes/chat");

const ModelManager = require("./utils/modelManager");

const modelManager = new ModelManager();

const app = express();
const server = http.createServer(app);

const bareServer = createBareServer("/t/");

const io = socketIo(server, {
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

app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    next();
  }
});

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
app.use("/api", chatRoutes);

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

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
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

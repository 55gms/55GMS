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

// Import route modules
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messagingRoutes = require("./routes/messaging");
const { router: chatRoutes, initializeChatRoute } = require("./routes/chat");

// Import utilities
const ModelManager = require("./utils/modelManager");

// Initialize model manager
const modelManager = new ModelManager();

const app = express();
const server = http.createServer(app);

// Create bare server for /t/ routes
const bareServer = createBareServer("/t/");

// Create Socket.IO instance
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeConversations = new Map();
const connectedUsers = new Map(); // Map of socketId -> userUuid
const activeChats = new Map(); // Map of socketId -> chatId (currently viewing)

// Initialize database
initDatabase().catch(console.error);

// Initialize chat route with dependencies
initializeChatRoute(modelManager, activeConversations);

// Middleware to handle bare server routes
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

// Use route modules
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", messagingRoutes);
app.use("/api", chatRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  // Handle user authentication and online status
  socket.on("authenticate", async (data) => {
    try {
      const { uuid, joinChatRooms = false } = data;
      if (!uuid) return;

      connectedUsers.set(socket.id, uuid);

      // Update user status to online
      await UserStatus.upsert({
        userUuid: uuid,
        isOnline: true,
        lastSeen: new Date(),
        socketId: socket.id,
      });

      // Join user to their personal room for notifications
      socket.join(`user_${uuid}`);

      // Only join chat rooms if explicitly requested (for chat page)
      if (joinChatRooms) {
        // Get user's chats and join those rooms
        const userChats = await ChatMember.findAll({
          where: { userUuid: uuid },
          include: [{ model: Chat, as: "chat" }],
        });

        userChats.forEach((chatMember) => {
          socket.join(`chat_${chatMember.chatId}`);
        });
      }

      // Notify friends that user is online
      socket.broadcast.emit("user_status_change", {
        userUuid: uuid,
        isOnline: true,
      });
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  });

  // Handle joining specific chat rooms
  socket.on("join_chat", (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on("leave_chat", (chatId) => {
    socket.leave(`chat_${chatId}`);
  });

  // Handle when user starts viewing a specific chat
  socket.on("viewing_chat", (chatId) => {
    activeChats.set(socket.id, chatId);
  });

  // Handle when user stops viewing a specific chat
  socket.on("stop_viewing_chat", () => {
    activeChats.delete(socket.id);
  });

  // Handle new messages
  socket.on("send_message", async (data) => {
    try {
      const { chatId, content, senderUuid } = data;

      // Verify sender is authenticated
      const authenticatedUuid = connectedUsers.get(socket.id);
      if (authenticatedUuid !== senderUuid) {
        return socket.emit("error", "Authentication mismatch");
      }

      // Get sender username
      let senderUsername = "Unknown User";
      try {
        const axios = require("axios");
        const response = await axios.get(
          `https://db.55gms.com/api/user/${senderUuid}`,
          {
            headers: {
              Authorization: process.env.workerAUTH,
            },
          }
        );
        senderUsername = response.data.username;
      } catch (error) {
        console.error("Error fetching sender username:", error);
      }

      // Broadcast the message to all users in the chat
      socket.to(`chat_${chatId}`).emit("new_message", {
        chatId,
        content,
        senderUuid,
        senderUsername,
        timestamp: new Date(),
      });

      // Get all chat members for cross-page notifications
      const chatMembers = await ChatMember.findAll({
        where: { chatId },
      });

      // Send notifications to all chat members
      chatMembers.forEach((member) => {
        if (member.userUuid !== senderUuid) {
          // Find all sockets for this user
          const userSockets = Array.from(connectedUsers.entries())
            .filter(([socketId, userUuid]) => userUuid === member.userUuid)
            .map(([socketId]) => socketId);

          // Check if any of the user's sockets are currently viewing this chat
          const isCurrentlyViewing = userSockets.some(
            (socketId) => activeChats.get(socketId) === chatId
          );

          if (!isCurrentlyViewing) {
            // User is not currently viewing this chat, send notification
            socket
              .to(`user_${member.userUuid}`)
              .emit("new_message_notification", {
                chatId,
                content,
                senderUuid,
                senderUsername,
                timestamp: new Date(),
              });
          }
          // Note: Users currently viewing the chat will receive the message via the regular new_message event
        }
      });

      // Update chat's last activity
      await Chat.update(
        { lastActivity: new Date() },
        { where: { id: chatId } }
      );
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  // Handle typing indicators
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

  // Handle read receipts
  socket.on("mark_read", async (data) => {
    try {
      const { chatId } = data;
      const userUuid = connectedUsers.get(socket.id);

      if (!userUuid) return;

      // Update last read timestamp
      await ChatMember.update(
        { lastReadAt: new Date() },
        { where: { chatId, userUuid } }
      );

      // Notify other chat members
      socket.to(`chat_${chatId}`).emit("messages_read", {
        chatId,
        userUuid,
        readAt: new Date(),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  // Handle heartbeat to keep users online
  socket.on("heartbeat", async (data) => {
    try {
      const { uuid } = data;
      if (!uuid) return;

      // Update last seen timestamp
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
        // Update user status to offline
        await UserStatus.update(
          {
            isOnline: false,
            lastSeen: new Date(),
            socketId: null,
          },
          { where: { userUuid } }
        );

        // Notify friends that user is offline
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

// Heartbeat system to keep users online
setInterval(async () => {
  try {
    // Mark users as offline if they haven't been seen in 5 minutes (increased from 2)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

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

      // Notify friends about status change
      io.emit("user_status_change", {
        userUuid: user.userUuid,
        isOnline: false,
        lastSeen: user.lastSeen,
      });
    }
  } catch (error) {
    console.error("Error in heartbeat cleanup:", error);
  }
}, 60000); // Run every minute

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
  { path: "/c", file: "chat.html" },
  { path: "/chat", file: "chat.html" },
];

routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

// Handle dynamic chat routes
app.get("/chat/:chatId", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "chat.html"));
});

app.use((req, res) => {
  const notFoundPage = path.join(__dirname, "static", "404.html");
  res.status(404).sendFile(notFoundPage);
});

// Handle upgrade events for bare server
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

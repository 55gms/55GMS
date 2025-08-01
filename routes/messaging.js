const express = require("express");
const { Op } = require("sequelize");
const DOMPurify = require("isomorphic-dompurify");
const axios = require("axios");
const {
  Chat,
  Message,
  ChatMember,
  Friend,
  UserStatus,
  sequelize,
} = require("../models");
const router = express.Router();

// Middleware to authenticate user via UUID
const authenticateUser = async (req, res, next) => {
  const uuid = req.headers["x-user-uuid"] || req.body.uuid;
  if (!uuid) {
    return res.status(401).json({ error: "Authentication required" });
  }
  req.userUuid = uuid;
  next();
};

// Get user's chats
router.get("/user-chats", authenticateUser, async (req, res) => {
  try {
    const userChats = await ChatMember.findAll({
      where: { userUuid: req.userUuid },
      include: [
        {
          model: Chat,
          as: "chat",
          include: [
            {
              model: Message,
              as: "messages",
              limit: 1,
              order: [["createdAt", "DESC"]],
              required: false,
            },
            {
              model: ChatMember,
              as: "members",
            },
          ],
        },
      ],
      order: [[{ model: Chat, as: "chat" }, "lastActivity", "DESC"]],
    });

    const chatsWithUsernames = await Promise.all(
      userChats.map(async (chatMember) => {
        const chat = chatMember.chat;
        let chatName = chat.name;
        let otherUsersOnline = [];

        // For direct messages, get the other user's username
        if (chat.type === "direct") {
          const otherMember = chat.members.find(
            (m) => m.userUuid !== req.userUuid
          );
          if (otherMember) {
            try {
              const userResponse = await getUsernameByUuid(
                otherMember.userUuid
              );
              chatName = userResponse.username;
              const status = await UserStatus.findOne({
                where: { userUuid: otherMember.userUuid },
              });
              otherUsersOnline.push({
                uuid: otherMember.userUuid,
                username: userResponse.username,
                isOnline: status?.isOnline || false,
              });
            } catch (error) {
              chatName = "Unknown User";
            }
          }
        } else {
          // For group chats, get all members' usernames and online status
          otherUsersOnline = await Promise.all(
            chat.members
              .filter((m) => m.userUuid !== req.userUuid)
              .map(async (member) => {
                try {
                  const userResponse = await getUsernameByUuid(member.userUuid);
                  const status = await UserStatus.findOne({
                    where: { userUuid: member.userUuid },
                  });
                  return {
                    uuid: member.userUuid,
                    username: userResponse.username,
                    isOnline: status?.isOnline || false,
                  };
                } catch (error) {
                  return {
                    uuid: member.userUuid,
                    username: "Unknown User",
                    isOnline: false,
                  };
                }
              })
          );
        }

        return {
          id: chat.id,
          name: chatName,
          type: chat.type,
          lastMessage: chat.messages[0] || null,
          unreadCount: await getUnreadMessageCount(
            chat.id,
            req.userUuid,
            chatMember.lastReadAt
          ),
          members: otherUsersOnline,
          lastActivity: chat.lastActivity,
        };
      })
    );

    res.json(chatsWithUsernames);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a specific chat
router.get("/chats/:chatId/messages", authenticateUser, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user is member of the chat
    const membership = await ChatMember.findOne({
      where: { chatId, userUuid: req.userUuid },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this chat" });
    }

    const messages = await Message.findAll({
      where: { chatId },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Get usernames for all senders
    const messagesWithUsernames = await Promise.all(
      messages.map(async (message) => {
        try {
          const userResponse = await getUsernameByUuid(message.senderUuid);
          return {
            ...message.toJSON(),
            senderUsername: userResponse.username,
          };
        } catch (error) {
          return {
            ...message.toJSON(),
            senderUsername: "Unknown User",
          };
        }
      })
    );

    // Update last read timestamp
    await ChatMember.update(
      { lastReadAt: new Date() },
      { where: { chatId, userUuid: req.userUuid } }
    );

    res.json(messagesWithUsernames.reverse()); // Return in chronological order
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message
router.post("/chats/:chatId/messages", authenticateUser, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(content.trim());

    // Check if user is member of the chat
    const membership = await ChatMember.findOne({
      where: { chatId, userUuid: req.userUuid },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ error: "Not authorized to send messages to this chat" });
    }

    // Create message
    const message = await Message.create({
      chatId,
      senderUuid: req.userUuid,
      content: sanitizedContent,
    });

    // Update chat's last activity
    await Chat.update({ lastActivity: new Date() }, { where: { id: chatId } });

    // Get sender username
    let senderUsername = "Unknown User";
    try {
      const userResponse = await getUsernameByUuid(req.userUuid);
      senderUsername = userResponse.username;
    } catch (error) {
      console.error("Error fetching sender username:", error);
    }

    const messageWithUsername = {
      ...message.toJSON(),
      senderUsername,
    };

    res.status(201).json(messageWithUsername);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a direct message chat
router.post("/chats/direct", authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Get the other user's UUID
    let otherUserUuid;
    try {
      const userResponse = await getUserByUsername(username);
      otherUserUuid = userResponse.uuid;
    } catch (error) {
      return res.status(404).json({ error: "User not found" });
    }

    if (otherUserUuid === req.userUuid) {
      return res
        .status(400)
        .json({ error: "Cannot create chat with yourself" });
    }

    // Check if direct chat already exists
    const existingChatMembers = await ChatMember.findAll({
      include: [
        {
          model: Chat,
          as: "chat",
          where: { type: "direct" },
        },
      ],
      where: {
        userUuid: {
          [Op.in]: [req.userUuid, otherUserUuid],
        },
      },
    });

    // Group by chatId and find chats with both users
    const chatCounts = {};
    existingChatMembers.forEach((member) => {
      if (!chatCounts[member.chatId]) {
        chatCounts[member.chatId] = [];
      }
      chatCounts[member.chatId].push(member.userUuid);
    });

    const existingChatId = Object.keys(chatCounts).find(
      (chatId) =>
        chatCounts[chatId].length === 2 &&
        chatCounts[chatId].includes(req.userUuid) &&
        chatCounts[chatId].includes(otherUserUuid)
    );

    if (existingChatId) {
      return res.json({ chatId: existingChatId });
    }

    // Create new direct chat
    const chat = await Chat.create({
      type: "direct",
      createdBy: req.userUuid,
    });

    // Add both users as members
    await ChatMember.bulkCreate([
      { chatId: chat.id, userUuid: req.userUuid, role: "member" },
      { chatId: chat.id, userUuid: otherUserUuid, role: "member" },
    ]);

    res.status(201).json({ chatId: chat.id });
  } catch (error) {
    console.error("Error creating direct chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a group chat
router.post("/chats/group", authenticateUser, async (req, res) => {
  try {
    const { name, members = [] } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const sanitizedName = DOMPurify.sanitize(name.trim());

    // Create group chat
    const chat = await Chat.create({
      name: sanitizedName,
      type: "group",
      createdBy: req.userUuid,
    });

    // Add creator as admin
    const chatMembers = [
      { chatId: chat.id, userUuid: req.userUuid, role: "admin" },
    ];

    // Add other members
    for (const username of members) {
      try {
        const userResponse = await getUserByUsername(username);
        if (userResponse.uuid !== req.userUuid) {
          chatMembers.push({
            chatId: chat.id,
            userUuid: userResponse.uuid,
            role: "member",
          });
        }
      } catch (error) {
        console.error(`User ${username} not found, skipping`);
      }
    }

    await ChatMember.bulkCreate(chatMembers);

    res.status(201).json({ chatId: chat.id });
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get friends list
router.get("/friends", authenticateUser, async (req, res) => {
  try {
    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          { requesterUuid: req.userUuid },
          { addresseeUuid: req.userUuid },
        ],
        status: "accepted",
      },
    });

    const friendsWithUsernames = await Promise.all(
      friends.map(async (friend) => {
        const friendUuid =
          friend.requesterUuid === req.userUuid
            ? friend.addresseeUuid
            : friend.requesterUuid;

        try {
          const userResponse = await getUsernameByUuid(friendUuid);
          const status = await UserStatus.findOne({
            where: { userUuid: friendUuid },
          });

          return {
            uuid: friendUuid,
            username: userResponse.username,
            isOnline: status?.isOnline || false,
            lastSeen: status?.lastSeen,
          };
        } catch (error) {
          return {
            uuid: friendUuid,
            username: "Unknown User",
            isOnline: false,
            lastSeen: null,
          };
        }
      })
    );

    res.json(friendsWithUsernames);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send friend request
router.post("/friends/request", authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Get the other user's UUID
    let otherUserUuid;
    try {
      const userResponse = await getUserByUsername(username);
      otherUserUuid = userResponse.uuid;
    } catch (error) {
      return res.status(404).json({ error: "User not found" });
    }

    if (otherUserUuid === req.userUuid) {
      return res.status(400).json({ error: "Cannot add yourself as friend" });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { requesterUuid: req.userUuid, addresseeUuid: otherUserUuid },
          { requesterUuid: otherUserUuid, addresseeUuid: req.userUuid },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        return res.status(400).json({ error: "Already friends" });
      } else if (existingFriendship.status === "pending") {
        return res.status(400).json({ error: "Friend request already sent" });
      }
    }

    // Create friend request
    await Friend.create({
      requesterUuid: req.userUuid,
      addresseeUuid: otherUserUuid,
      status: "pending",
    });

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Accept/reject friend request
router.put("/friends/:friendId", authenticateUser, async (req, res) => {
  try {
    const { friendId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const friendship = await Friend.findOne({
      where: {
        id: friendId,
        addresseeUuid: req.userUuid,
        status: "pending",
      },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (action === "accept") {
      friendship.status = "accepted";
      await friendship.save();
      res.json({ message: "Friend request accepted" });
    } else {
      await friendship.destroy();
      res.json({ message: "Friend request rejected" });
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get pending friend requests
router.get("/friends/requests", authenticateUser, async (req, res) => {
  try {
    const requests = await Friend.findAll({
      where: {
        addresseeUuid: req.userUuid,
        status: "pending",
      },
    });

    const requestsWithUsernames = await Promise.all(
      requests.map(async (request) => {
        try {
          const userResponse = await getUsernameByUuid(request.requesterUuid);
          return {
            id: request.id,
            requesterUuid: request.requesterUuid,
            requesterUsername: userResponse.username,
            createdAt: request.createdAt,
          };
        } catch (error) {
          return {
            id: request.id,
            requesterUuid: request.requesterUuid,
            requesterUsername: "Unknown User",
            createdAt: request.createdAt,
          };
        }
      })
    );

    res.json(requestsWithUsernames);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper functions
async function getUsernameByUuid(uuid) {
  try {
    const response = await axios.get(`https://db.55gms.com/api/user/${uuid}`, {
      headers: {
        Authorization: process.env.workerAUTH,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("User not found");
  }
}

async function getUserByUsername(username) {
  try {
    const response = await axios.get(
      `https://db.55gms.com/api/user/by-username/${username}`,
      {
        headers: {
          Authorization: process.env.workerAUTH,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("User not found");
  }
}

async function getUnreadMessageCount(chatId, userUuid, lastReadAt) {
  return await Message.count({
    where: {
      chatId,
      senderUuid: { [Op.ne]: userUuid },
      createdAt: { [Op.gt]: lastReadAt },
    },
  });
}

module.exports = router;

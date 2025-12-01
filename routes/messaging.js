import { Op } from "sequelize";
import DOMPurify from "isomorphic-dompurify";
import userCache from "../utils/userCache.js";
import blockingCache from "../utils/blockingCache.js";
import {
  Chat,
  Message,
  ChatMember,
  Friend,
  UserStatus,
  sequelize,
} from "../models/index.js";

// Middleware to authenticate user via UUID
const authenticateUser = async (req, reply) => {
  const uuid = req.headers["x-user-uuid"] || req.body?.uuid;
  if (!uuid) {
    return reply.code(401).send({ error: "Authentication required" });
  }
  req.userUuid = uuid;
};

export default async function (fastify, opts) {
  // Register the authentication hook
  fastify.addHook("preHandler", authenticateUser);

  // GET /chats/:chatId/members
  fastify.get("/chats/:chatId/members", async (req, reply) => {
    try {
      const chatId = req.params.chatId;
      const userUuid = req.userUuid;

      // First verify the user is a member of this chat
      const userMembership = await ChatMember.findOne({
        where: {
          chatId: chatId,
          userUuid: userUuid,
        },
      });

      if (!userMembership) {
        return reply.code(403).send({ error: "Not a member of this chat" });
      }

      // Get the chat to make sure it's a group chat
      const chat = await Chat.findByPk(chatId);
      if (!chat || chat.type !== "group") {
        return reply
          .code(400)
          .send({ error: "Chat not found or not a group chat" });
      }

      // Get all members of the chat
      const members = await ChatMember.findAll({
        where: { chatId: chatId },
        order: [
          ["role", "ASC"],
          ["createdAt", "ASC"],
        ], // Admin first, then by join order
      });

      // Format the response with user data from cache and status
      const formattedMembers = await Promise.all(
        members.map(async (member) => {
          let userData = { username: "Unknown User", avatar: "/img/user.webp" };
          let userStatus = "offline";

          try {
            userData = await getUsernameByUuid(member.userUuid);
          } catch (error) {
            console.error(
              `Error fetching user data for ${member.userUuid}:`,
              error,
            );
          }

          try {
            const status = await UserStatus.findOne({
              where: { userUuid: member.userUuid },
            });
            userStatus = status?.isOnline ? "online" : "offline";
          } catch (error) {
            console.error(
              `Error fetching user status for ${member.userUuid}:`,
              error,
            );
          }

          return {
            uuid: member.userUuid,
            username: userData.username,
            avatar: userData.avatar || "/img/user.webp",
            role: member.role,
            status: userStatus,
            joinedAt: member.createdAt,
          };
        }),
      );

      reply.send({
        success: true,
        members: formattedMembers,
        memberCount: formattedMembers.length,
      });
    } catch (error) {
      console.error("Error fetching chat members:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Leave a group chat
  // Get user's chats
  fastify.get("/user-chats", async (req, reply) => {
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
              (m) => m.userUuid !== req.userUuid,
            );
            if (otherMember) {
              try {
                const userResponse = await userCache.getUserByUuid(
                  otherMember.userUuid,
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
                    const userResponse = await userCache.getUserByUuid(
                      member.userUuid,
                    );
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
                }),
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
              chatMember.lastReadAt,
            ),
            members: otherUsersOnline,
            lastActivity: chat.lastActivity,
          };
        }),
      );

      reply.send(chatsWithUsernames);
    } catch (error) {
      console.error("Error fetching chats:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Get messages for a specific chat
  fastify.get("/chats/:chatId/messages", async (req, reply) => {
    try {
      const { chatId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      // Check if user is member of the chat
      const membership = await ChatMember.findOne({
        where: { chatId, userUuid: req.userUuid },
      });

      if (!membership) {
        return reply
          .code(403)
          .send({ error: "Not authorized to view this chat" });
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
        }),
      );

      // Update last read timestamp
      await ChatMember.update(
        { lastReadAt: new Date() },
        { where: { chatId, userUuid: req.userUuid } },
      );

      reply.send(messagesWithUsernames.reverse()); // Return in chronological order
    } catch (error) {
      console.error("Error fetching messages:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Send a message
  fastify.post("/chats/:chatId/messages", async (req, reply) => {
    try {
      const { chatId } = req.params;
      const { content, isSystem } = req.body;

      if (!content || content.trim().length === 0) {
        return reply.code(400).send({ error: "Message content is required" });
      }

      if (content.length > 2000) {
        return reply.code(400).send({
          error: "Message too long. Maximum 2000 characters allowed.",
        });
      }

      // Sanitize content
      const sanitizedContent = DOMPurify.sanitize(content.trim());

      // Check if user is member of the chat
      const membership = await ChatMember.findOne({
        where: { chatId, userUuid: req.userUuid },
      });

      if (!membership) {
        return reply
          .code(403)
          .send({ error: "Not authorized to send messages to this chat" });
      }

      // Check if this is a direct chat and if the user is blocked
      const chat = await Chat.findByPk(chatId);
      if (chat && chat.type === "direct") {
        // Find other chat member
        const otherMember = await ChatMember.findOne({
          where: {
            chatId,
            userUuid: { [Op.ne]: req.userUuid },
          },
        });

        if (otherMember) {
          // Use the blocking cache to check blocking status
          const blockingStatus = await blockingCache.getBlockingStatus(
            req.userUuid,
            otherMember.userUuid,
          );

          if (blockingStatus.blockedByOther) {
            return reply.code(403).send({
              error: "Cannot send message",
              blocked: true,
              message: "You have been blocked by this user",
            });
          }

          if (blockingStatus.blockedByMe) {
            return reply.code(403).send({
              error: "Cannot send message",
              blocked: true,
              message: "You have blocked this user",
            });
          }
        }
      }

      // Enforce max 200 messages per chat: delete oldest if at limit
      const messageCount = await Message.count({ where: { chatId } });
      if (messageCount >= 200) {
        // Find the oldest message(s) to delete
        const oldestMessages = await Message.findAll({
          where: { chatId },
          order: [["createdAt", "ASC"]],
          limit: messageCount - 199, // delete enough to make room for 200
        });
        const idsToDelete = oldestMessages.map((msg) => msg.id);
        if (idsToDelete.length > 0) {
          await Message.destroy({ where: { id: idsToDelete } });
        }
      }

      // Create message
      const message = await Message.create({
        chatId,
        senderUuid: req.userUuid,
        content: sanitizedContent,
        isSystem: isSystem || false,
      });

      // Update chat's last activity
      await Chat.update(
        { lastActivity: new Date() },
        { where: { id: chatId } },
      );

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

      reply.code(201).send(messageWithUsername);
    } catch (error) {
      console.error("Error sending message:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Create a direct message chat
  fastify.post("/chats/direct", async (req, reply) => {
    try {
      const { username } = req.body;

      if (!username) {
        return reply.code(400).send({ error: "Username is required" });
      }

      // Get the other user's UUID
      let otherUserUuid;
      try {
        const userResponse = await getUserByUsername(username);
        otherUserUuid = userResponse.uuid;
      } catch (error) {
        return reply.code(404).send({ error: "User not found" });
      }

      if (otherUserUuid === req.userUuid) {
        return reply
          .code(400)
          .send({ error: "Cannot create chat with yourself" });
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
          chatCounts[chatId].includes(otherUserUuid),
      );

      if (existingChatId) {
        return reply.send({ chatId: existingChatId });
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

      reply.code(201).send({ chatId: chat.id });
    } catch (error) {
      console.error("Error creating direct chat:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Create a group chat
  fastify.post("/chats/group", async (req, reply) => {
    try {
      const { name, members = [] } = req.body;

      if (!name || name.trim().length === 0) {
        return reply.code(400).send({ error: "Group name is required" });
      }

      // Check if trying to add more than 10 people total (including creator)
      if (members.length > 9) {
        return reply.code(400).send({
          error:
            "Cannot add more than 10 people to a group chat (including yourself)",
        });
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

      // Add other members, but prevent adding self
      for (const username of members) {
        try {
          const userResponse = await getUserByUsername(username);
          // Prevent adding yourself to the group
          if (userResponse.uuid !== req.userUuid) {
            chatMembers.push({
              chatId: chat.id,
              userUuid: userResponse.uuid,
              role: "member",
            });
          } else {
            console.log(`Skipping self-addition attempt for user ${username}`);
          }
        } catch (error) {
          console.error(`User ${username} not found, skipping`);
        }
      }

      await ChatMember.bulkCreate(chatMembers);

      reply.code(201).send({ chatId: chat.id });
    } catch (error) {
      console.error("Error creating group chat:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Leave a group chat
  fastify.post("/chats/:chatId/leave", async (req, reply) => {
    try {
      const { chatId } = req.params;

      // Verify that the chat exists and is a group chat
      const chat = await Chat.findOne({
        where: { id: chatId, type: "group" },
      });

      if (!chat) {
        return reply.code(404).send({ error: "Group chat not found" });
      }

      // Verify that the user is a member of this chat
      const membership = await ChatMember.findOne({
        where: {
          chatId: chatId,
          userUuid: req.userUuid,
        },
      });

      if (!membership) {
        return reply
          .code(404)
          .send({ error: "You are not a member of this group" });
      }

      // Get username from cache or default to "A user"
      const userInfo = await userCache.getUserInfo(req.userUuid);
      const username = userInfo ? userInfo.username : "A user";

      // Create a system message about the user leaving
      await Message.create({
        chatId,
        senderUuid: req.userUuid,
        content: `${username} has left this group`,
        isSystem: true,
      });

      // Remove the user from the chat
      await membership.destroy();

      // Check if this was the last member
      const remainingMembers = await ChatMember.count({
        where: { chatId: chatId },
      });

      // If no members remain, delete the chat and all its messages
      if (remainingMembers === 0) {
        await Message.destroy({
          where: { chatId: chatId },
        });
        await chat.destroy();
      }

      reply.send({ message: "Successfully left the group" });
    } catch (error) {
      console.error("Error leaving group chat:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Get friends list
  fastify.get("/friends", async (req, reply) => {
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
        }),
      );

      reply.send(friendsWithUsernames);
    } catch (error) {
      console.error("Error fetching friends:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Send friend request
  fastify.post("/friends/request", async (req, reply) => {
    try {
      const { username } = req.body;

      if (!username) {
        return reply.code(400).send({ error: "Username is required" });
      }

      // Get the other user's UUID
      let otherUserUuid;
      try {
        const userResponse = await getUserByUsername(username);
        otherUserUuid = userResponse.uuid;
      } catch (error) {
        return reply.code(404).send({ error: "User not found" });
      }

      if (otherUserUuid === req.userUuid) {
        return reply.code(400).send({ error: "Cannot add yourself as friend" });
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
          return reply.code(400).send({ error: "Already friends" });
        } else if (existingFriendship.status === "pending") {
          return reply.code(400).send({ error: "Friend request already sent" });
        }
      }

      // Create friend request
      await Friend.create({
        requesterUuid: req.userUuid,
        addresseeUuid: otherUserUuid,
        status: "pending",
      });

      reply.code(201).send({ message: "Friend request sent" });
    } catch (error) {
      console.error("Error sending friend request:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Accept/reject friend request
  fastify.put("/friends/:friendId", async (req, reply) => {
    try {
      const { friendId } = req.params;
      const { action } = req.body; // 'accept' or 'reject'

      if (!["accept", "reject"].includes(action)) {
        return reply.code(400).send({ error: "Invalid action" });
      }

      const friendship = await Friend.findOne({
        where: {
          id: friendId,
          addresseeUuid: req.userUuid,
          status: "pending",
        },
      });

      if (!friendship) {
        return reply.code(404).send({ error: "Friend request not found" });
      }

      if (action === "accept") {
        friendship.status = "accepted";
        await friendship.save();

        let friendUsername = "Unknown User";
        try {
          const userResponse = await getUsernameByUuid(
            friendship.requesterUuid,
          );
          friendUsername = userResponse.username;
        } catch (error) {
          console.error("Error fetching friend username:", error);
        }

        reply.send({
          message: "Friend request accepted",
          friendUsername: friendUsername,
        });
      } else {
        await friendship.destroy();
        reply.send({ message: "Friend request rejected" });
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Block a user
  fastify.post("/friends/block", async (req, reply) => {
    try {
      const { username } = req.body;

      if (!username) {
        return reply.code(400).send({ error: "Username is required" });
      }

      // Get the other user's UUID
      let otherUserUuid;
      try {
        const userResponse = await getUserByUsername(username);
        otherUserUuid = userResponse.uuid;
      } catch (error) {
        return reply.code(404).send({ error: "User not found" });
      }

      if (otherUserUuid === req.userUuid) {
        return reply.code(400).send({ error: "Cannot block yourself" });
      }

      // Check if there's an existing friendship
      let friendship = await Friend.findOne({
        where: {
          [Op.or]: [
            { requesterUuid: req.userUuid, addresseeUuid: otherUserUuid },
            { requesterUuid: otherUserUuid, addresseeUuid: req.userUuid },
          ],
        },
      });

      if (friendship) {
        // If already blocked, just return success
        if (
          friendship.status === "blocked" &&
          friendship.requesterUuid === req.userUuid
        ) {
          return reply.code(200).send({ message: "User already blocked" });
        }

        // If there's an existing friendship, update it to blocked
        // Only the requester can block
        if (friendship.requesterUuid !== req.userUuid) {
          // If current user is not the requester, delete the existing friendship
          // and create a new one where current user is the requester
          await friendship.destroy();
          friendship = null;
        } else {
          friendship.status = "blocked";
          await friendship.save();
        }
      }

      // If no friendship exists or was deleted, create a new one
      if (!friendship) {
        await Friend.create({
          requesterUuid: req.userUuid,
          addresseeUuid: otherUserUuid,
          status: "blocked",
        });
      }

      // Invalidate the blocking cache for these users
      blockingCache.invalidateCache(req.userUuid, otherUserUuid);

      reply.code(200).send({ message: "User blocked successfully" });
    } catch (error) {
      console.error("Error blocking user:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Unblock a user
  fastify.post("/friends/unblock", async (req, reply) => {
    try {
      const { username } = req.body;

      if (!username) {
        return reply.code(400).send({ error: "Username is required" });
      }

      // Get the other user's UUID
      let otherUserUuid;
      try {
        const userResponse = await getUserByUsername(username);
        otherUserUuid = userResponse.uuid;
      } catch (error) {
        return reply.code(404).send({ error: "User not found" });
      }

      // Find the block record
      const friendship = await Friend.findOne({
        where: {
          requesterUuid: req.userUuid,
          addresseeUuid: otherUserUuid,
          status: "blocked",
        },
      });

      if (!friendship) {
        return reply.code(404).send({ error: "Block record not found" });
      }

      // Remove the block (delete the friendship record)
      await friendship.destroy();

      // Invalidate the blocking cache for these users
      blockingCache.invalidateCache(req.userUuid, otherUserUuid);

      reply.code(200).send({ message: "User unblocked successfully" });
    } catch (error) {
      console.error("Error unblocking user:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Get blocked users
  fastify.get("/friends/blocked", async (req, reply) => {
    try {
      const blockedFriendships = await Friend.findAll({
        where: {
          requesterUuid: req.userUuid,
          status: "blocked",
        },
      });

      const blockedUsers = await Promise.all(
        blockedFriendships.map(async (friendship) => {
          try {
            const userResponse = await getUsernameByUuid(
              friendship.addresseeUuid,
            );
            return {
              uuid: friendship.addresseeUuid,
              username: userResponse.username,
            };
          } catch (error) {
            return {
              uuid: friendship.addresseeUuid,
              username: "Unknown User",
            };
          }
        }),
      );

      reply.send(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // Get pending friend requests
  fastify.get("/friends/requests", async (req, reply) => {
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
        }),
      );

      reply.send(requestsWithUsernames);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}

// Helper functions
// Use the userCache for getting user information
async function getUsernameByUuid(uuid) {
  try {
    const userData = await userCache.getUserByUuid(uuid);
    return userData;
  } catch (error) {
    throw new Error("User not found");
  }
}

async function getUserByUsername(username) {
  try {
    const userData = await userCache.getUserByUsername(username);
    return userData;
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

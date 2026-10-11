import assert from "node:assert/strict";
import test from "node:test";

process.env.POSTGRES_URL ||= "postgres://user:password@localhost:5432/test";

const {
  addSenderUsernamesToMessages,
  collectVisibleMemberUuidsFromChats,
  formatUserChats,
} = await import("../routes/messaging.js");

test("message sender lookup is deduped for many messages from one sender", async () => {
  let lookupCount = 0;
  const messages = Array.from({ length: 50 }, (_, index) => ({
    toJSON() {
      return {
        id: `message-${index}`,
        senderUuid: "sender-1",
        content: `message ${index}`,
        isSystem: false,
      };
    },
  }));

  const result = await addSenderUsernamesToMessages(messages, async (uuid) => {
    lookupCount += 1;
    return { uuid, username: "sender one" };
  });

  assert.equal(lookupCount, 1);
  assert.equal(result.length, 50);
  assert.equal(result[0].senderUsername, "sender one");
});

test("message sender lookup runs once per unique missing sender", async () => {
  const lookedUpUuids = [];
  const messages = [
    { id: "1", senderUuid: "sender-1", content: "one", isSystem: false },
    { id: "2", senderUuid: "sender-2", content: "two", isSystem: false },
    { id: "3", senderUuid: "sender-1", content: "three", isSystem: false },
    { id: "4", senderUuid: "sender-3", content: "four", isSystem: false },
  ];

  const result = await addSenderUsernamesToMessages(messages, async (uuid) => {
    lookedUpUuids.push(uuid);
    return { uuid, username: `name-${uuid}` };
  });

  assert.deepEqual(lookedUpUuids.sort(), ["sender-1", "sender-2", "sender-3"]);
  assert.deepEqual(
    result.map((message) => message.senderUsername),
    ["name-sender-1", "name-sender-2", "name-sender-1", "name-sender-3"],
  );
});

test("stored senderUsername skips external sender lookup", async () => {
  let lookupCount = 0;
  const messages = [
    {
      id: "1",
      senderUuid: "sender-1",
      senderUsername: "persisted",
      content: "one",
      isSystem: false,
    },
  ];

  const result = await addSenderUsernamesToMessages(messages, async () => {
    lookupCount += 1;
    return { username: "external" };
  });

  assert.equal(lookupCount, 0);
  assert.equal(result[0].senderUsername, "persisted");
});

test("user chat formatting keeps response shape from batched maps", () => {
  const lastMessage = {
    id: "message-1",
    senderUuid: "other-user",
    content: "hello",
  };
  const userChats = [
    {
      lastReadAt: new Date("2026-01-01T00:00:00.000Z"),
      chat: {
        id: "chat-1",
        name: null,
        type: "direct",
        messages: [lastMessage],
        members: [{ userUuid: "current-user" }, { userUuid: "other-user" }],
        lastActivity: new Date("2026-01-02T00:00:00.000Z"),
      },
    },
    {
      lastReadAt: new Date("2026-01-01T00:00:00.000Z"),
      chat: {
        id: "chat-2",
        name: "Group",
        type: "group",
        messages: [],
        members: [
          { userUuid: "current-user" },
          { userUuid: "member-a" },
          { userUuid: "member-b" },
        ],
        lastActivity: new Date("2026-01-03T00:00:00.000Z"),
      },
    },
  ];

  assert.deepEqual(
    collectVisibleMemberUuidsFromChats(userChats, "current-user"),
    ["other-user", "member-a", "member-b"],
  );

  const formatted = formatUserChats(
    userChats,
    "current-user",
    new Map([
      ["other-user", { username: "Other" }],
      ["member-a", { username: "Member A" }],
      ["member-b", { username: "Member B" }],
    ]),
    new Map([
      ["other-user", { isOnline: true }],
      ["member-a", { isOnline: false }],
      ["member-b", { isOnline: true }],
    ]),
    new Map([
      ["chat-1", 2],
      ["chat-2", 5],
    ]),
  );

  assert.deepEqual(formatted, [
    {
      id: "chat-1",
      name: "Other",
      type: "direct",
      avatar: null,
      lastMessage,
      unreadCount: 2,
      members: [
        { uuid: "other-user", username: "Other", avatar: null, isOnline: true },
      ],
      lastActivity: userChats[0].chat.lastActivity,
    },
    {
      id: "chat-2",
      name: "Group",
      type: "group",
      avatar: null,
      lastMessage: null,
      unreadCount: 5,
      members: [
        {
          uuid: "member-a",
          username: "Member A",
          avatar: null,
          isOnline: false,
        },
        {
          uuid: "member-b",
          username: "Member B",
          avatar: null,
          isOnline: true,
        },
      ],
      lastActivity: userChats[1].chat.lastActivity,
    },
  ]);
});

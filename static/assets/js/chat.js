// Chat System JavaScript
let socket;
let currentChatId = null;
let currentUser = null;
let chats = [];
let friends = [];
let typingTimeout = null;
let isTyping = false;

// Initialize chat system
function initializeChat() {
  currentUser = {
    uuid: localStorage.getItem("uuid"),
    username: localStorage.getItem("username"),
  };

  if (!currentUser.uuid || !currentUser.username) {
    window.location.href = "/login";
    return;
  }

  // Initialize Socket.IO
  initializeSocket();

  // Load initial data
  loadChats();
  loadFriends();
  loadFriendRequests();

  // Setup event listeners
  setupEventListeners();

  // Check for specific chat in URL
  const pathParts = window.location.pathname.split("/");
  if (pathParts[1] === "chat" && pathParts[2]) {
    const chatId = pathParts[2];
    // Wait a bit for chats to load, then select the chat
    setTimeout(() => selectChat(chatId), 1000);
  }

  // Periodically check for new friend requests to update the notification badge
  setInterval(() => {
    loadFriendRequests();
  }, 30000); // Check every 30 seconds
}

// Initialize Socket.IO connection
function initializeSocket() {
  socket = io();

  socket.on("connect", () => {
    console.log("Connected to server");
    // Authenticate user
    socket.emit("authenticate", { uuid: currentUser.uuid });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("new_message", (data) => {
    if (data.chatId === currentChatId) {
      appendMessage(data);
      scrollToBottom();
    }

    // Update chat list
    updateChatInList(data.chatId, data);

    // Show notification if not currently viewing this chat
    if (data.chatId !== currentChatId) {
      showNotification("New Message", data.content, () => {
        selectChat(data.chatId);
      });
    }
  });

  socket.on("user_typing", (data) => {
    if (data.chatId === currentChatId && data.userUuid !== currentUser.uuid) {
      showTypingIndicator(data.userUuid, data.isTyping);
    }
  });

  socket.on("user_status_change", (data) => {
    updateUserStatus(data.userUuid, data.isOnline);
  });

  socket.on("messages_read", (data) => {
    console.log("Messages read by:", data.userUuid);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    Swal.fire({
      icon: "error",
      title: "Connection Error",
      text: error,
    });
  });
}

function setupEventListeners() {
  // Message input
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      handleTyping();
    }
  });

  messageInput.addEventListener("input", handleTyping);

  sendBtn.addEventListener("click", sendMessage);

  // Modal handlers
  document.getElementById("newChatBtn").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "flex";
  });

  document.getElementById("friendsBtn").addEventListener("click", () => {
    document.getElementById("friendsModal").style.display = "flex";
    loadFriends();
    loadFriendRequests();
  });

  document.getElementById("startChatBtn").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "flex";
  });

  // Close modals
  document.getElementById("closeNewChatModal").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "none";
  });

  document.getElementById("closeFriendsModal").addEventListener("click", () => {
    document.getElementById("friendsModal").style.display = "none";
  });

  // Tab switching
  setupTabSwitching();

  // Chat creation
  document
    .getElementById("createDirectBtn")
    .addEventListener("click", createDirectChat);
  document
    .getElementById("createGroupBtn")
    .addEventListener("click", createGroupChat);

  // Friend management
  document
    .getElementById("addFriendBtn")
    .addEventListener("click", sendFriendRequest);

  // Group member input
  const addMemberInput = document.getElementById("addMemberInput");
  addMemberInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMemberToGroup();
    }
  });

  // Search
  document.getElementById("chatSearch").addEventListener("input", filterChats);

  // Click outside to close modals
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

// Setup tab switching functionality
function setupTabSwitching() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tabContainer =
        e.target.closest(".modal-body") ||
        e.target.closest(".friends-tabs").parentElement;
      const tabName = e.target.dataset.tab;

      // Remove active class from all tabs and panels in this container
      tabContainer
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      tabContainer
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("active"));

      // Add active class to clicked tab and corresponding panel
      e.target.classList.add("active");
      tabContainer.querySelector(`#${tabName}Tab`).classList.add("active");
    });
  });
}

// Load user's chats
async function loadChats() {
  try {
    const response = await fetch("/api/user-chats", {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      chats = await response.json();
      renderChatList();
    } else {
      console.error("Failed to load chats");
    }
  } catch (error) {
    console.error("Error loading chats:", error);
  }
}

// Render chat list
function renderChatList() {
  const chatList = document.getElementById("chatList");

  if (chats.length === 0) {
    chatList.innerHTML = `
            <div class="loading">
                <span>No conversations yet</span>
            </div>
        `;
    return;
  }

  chatList.innerHTML = chats
    .map((chat) => {
      const isOnline =
        chat.type === "direct" &&
        chat.members.length > 0 &&
        chat.members[0].isOnline;
      const lastMessage = chat.lastMessage;
      const preview = lastMessage
        ? (lastMessage.senderUuid === currentUser.uuid ? "You: " : "") +
          lastMessage.content
        : "No messages yet";

      return `
            <div class="chat-item" data-chat-id="${
              chat.id
            }" onclick="selectChat('${chat.id}')">
                <div class="chat-avatar">
                    <div class="avatar-circle">
                        ${chat.name.charAt(0).toUpperCase()}
                    </div>
                    ${
                      chat.type === "direct"
                        ? `<div class="online-indicator ${
                            isOnline ? "" : "offline"
                          }"></div>`
                        : ""
                    }
                </div>
                <div class="chat-item-content">
                    <div class="chat-item-name">${chat.name}</div>
                    <div class="chat-item-preview">${preview}</div>
                </div>
                <div class="chat-item-meta">
                    ${
                      lastMessage
                        ? `<div class="chat-time">${formatTime(
                            lastMessage.createdAt
                          )}</div>`
                        : ""
                    }
                    ${
                      chat.unreadCount > 0
                        ? `<div class="unread-badge">${chat.unreadCount}</div>`
                        : ""
                    }
                </div>
            </div>
        `;
    })
    .join("");
}

// Select and load a chat
async function selectChat(chatId) {
  if (currentChatId === chatId) return;

  // Leave previous chat room
  if (currentChatId) {
    socket.emit("leave_chat", currentChatId);
  }

  currentChatId = chatId;

  // Join new chat room
  socket.emit("join_chat", chatId);

  // Update URL
  history.pushState(null, "", `/chat/${chatId}`);

  // Update active chat in sidebar
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.chatId === chatId) {
      item.classList.add("active");
    }
  });

  // Load chat messages
  await loadChatMessages(chatId);

  // Show chat content
  document.getElementById("chatWelcome").style.display = "none";
  document.getElementById("chatContent").style.display = "flex";

  // Update chat header
  const chat = chats.find((c) => c.id === chatId);
  if (chat) {
    document.getElementById("chatName").textContent = chat.name;
    document.getElementById("chatInitials").textContent = chat.name
      .charAt(0)
      .toUpperCase();

    // Update status
    const statusElement = document.getElementById("chatStatus");
    const onlineIndicator = document.getElementById("onlineIndicator");

    if (chat.type === "direct" && chat.members.length > 0) {
      const isOnline = chat.members[0].isOnline;
      statusElement.textContent = isOnline ? "Online" : "Offline";
      onlineIndicator.className = `online-indicator ${
        isOnline ? "" : "offline"
      }`;
    } else {
      statusElement.textContent = `${chat.members.length + 1} members`;
      onlineIndicator.style.display = "none";
    }
  }

  // Mark messages as read
  socket.emit("mark_read", { chatId });

  // Focus message input
  document.getElementById("messageInput").focus();
}

// Load messages for a chat
async function loadChatMessages(chatId) {
  try {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      const messages = await response.json();
      renderMessages(messages);
    } else {
      console.error("Failed to load messages");
    }
  } catch (error) {
    console.error("Error loading messages:", error);
  }
}

// Render messages
function renderMessages(messages) {
  // Limit to last 200 messages
  const limitedMessages =
    messages.length > 200 ? messages.slice(-200) : messages;
  const messagesContainer = document.getElementById("messages");

  messagesContainer.innerHTML = limitedMessages
    .map((message) => {
      const isOwn = message.senderUuid === currentUser.uuid;
      const senderInitials = message.senderUsername
        ? message.senderUsername.charAt(0).toUpperCase()
        : "?";

      return `
            <div class="message ${isOwn ? "own" : ""}">
                ${
                  !isOwn
                    ? `
                    <div class="message-avatar">
                        ${senderInitials}
                    </div>
                `
                    : ""
                }
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${
                          message.senderUsername || "Unknown"
                        }</span>
                        <span class="message-time">${formatTime(
                          message.createdAt
                        )}</span>
                    </div>
                    <div class="message-text">${escapeHtml(
                      message.content
                    )}</div>
                </div>
                ${
                  isOwn
                    ? `
                    <div class="message-avatar">
                        ${currentUser.username.charAt(0).toUpperCase()}
                    </div>
                `
                    : ""
                }
            </div>
        `;
    })
    .join("");
  scrollToBottom();
}

// Append a new message to the chat
function appendMessage(messageData) {
  const messagesContainer = document.getElementById("messages");
  const isOwn = messageData.senderUuid === currentUser.uuid;
  const senderInitials = messageData.senderUsername
    ? messageData.senderUsername.charAt(0).toUpperCase()
    : isOwn
    ? currentUser.username.charAt(0).toUpperCase()
    : "?";

  const messageElement = document.createElement("div");
  messageElement.className = `message ${isOwn ? "own" : ""}`;
  messageElement.innerHTML = `
        ${
          !isOwn
            ? `
            <div class="message-avatar">
                ${senderInitials}
            </div>
        `
            : ""
        }
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${
                  messageData.senderUsername ||
                  (isOwn ? currentUser.username : "Unknown")
                }</span>
                <span class="message-time">${formatTime(
                  messageData.timestamp || new Date()
                )}</span>
            </div>
            <div class="message-text">${escapeHtml(messageData.content)}</div>
        </div>
        ${
          isOwn
            ? `
            <div class="message-avatar">
                ${currentUser.username.charAt(0).toUpperCase()}
            </div>
        `
            : ""
        }
    `;

  // Remove oldest message if over 200
  while (messagesContainer.children.length >= 200) {
    messagesContainer.removeChild(messagesContainer.firstChild);
  }

  messagesContainer.appendChild(messageElement);
}

// Send a message
async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const content = messageInput.value.trim();

  if (!content || !currentChatId) return;

  // Clear input immediately
  messageInput.value = "";

  // Stop typing indicator
  if (isTyping) {
    socket.emit("typing_stop", {
      chatId: currentChatId,
      senderUuid: currentUser.uuid,
    });
    isTyping = false;
  }

  try {
    const response = await fetch(`/api/chats/${currentChatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const message = await response.json();

      // Emit message via socket for real-time delivery
      socket.emit("send_message", {
        chatId: currentChatId,
        content: content,
        senderUuid: currentUser.uuid,
      });

      // Add message to UI immediately
      appendMessage({
        ...message,
        senderUsername: currentUser.username,
        timestamp: new Date(),
      });

      scrollToBottom();

      updateChatInList(currentChatId, message);
    } else {
      throw new Error("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send message",
    });

    // Restore message to input
    messageInput.value = content;
  }
}

// Handle typing indicators
function handleTyping() {
  if (!currentChatId) return;

  if (!isTyping) {
    isTyping = true;
    socket.emit("typing_start", {
      chatId: currentChatId,
      senderUuid: currentUser.uuid,
    });
  }

  // Clear existing timeout
  clearTimeout(typingTimeout);

  // Set new timeout to stop typing
  typingTimeout = setTimeout(() => {
    if (isTyping) {
      isTyping = false;
      socket.emit("typing_stop", {
        chatId: currentChatId,
        senderUuid: currentUser.uuid,
      });
    }
  }, 1000);
}

// Show typing indicator
function showTypingIndicator(userUuid, isTyping) {
  const typingIndicator = document.getElementById("typingIndicator");
  const typingText = document.getElementById("typingText");

  if (isTyping) {
    // Get username for the typing user
    const chat = chats.find((c) => c.id === currentChatId);
    let username = "Someone";

    if (chat && chat.members) {
      const member = chat.members.find((m) => m.uuid === userUuid);
      if (member) {
        username = member.username;
      }
    }

    typingText.textContent = `${username} is typing...`;
    typingIndicator.style.display = "block";
    scrollToBottom();
  } else {
    typingIndicator.style.display = "none";
  }
}

// Create direct chat
async function createDirectChat() {
  const username = document.getElementById("directUsername").value.trim();

  if (!username) {
    Swal.fire({
      icon: "warning",
      title: "Username Required",
      text: "Please enter a username",
    });
    return;
  }

  try {
    const response = await fetch("/api/chats/direct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("newChatModal").style.display = "none";
      document.getElementById("directUsername").value = "";

      // Reload chats and select the new one
      await loadChats();
      selectChat(data.chatId);

      Swal.fire({
        icon: "success",
        title: "Chat Created",
        text: "Direct chat created successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error(data.error || "Failed to create chat");
    }
  } catch (error) {
    console.error("Error creating direct chat:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}

// Create group chat
async function createGroupChat() {
  const groupName = document.getElementById("groupName").value.trim();
  const memberElements = document.querySelectorAll("#membersList .member-tag");
  const members = Array.from(memberElements).map((el) => el.dataset.username);

  if (!groupName) {
    Swal.fire({
      icon: "warning",
      title: "Group Name Required",
      text: "Please enter a group name",
    });
    return;
  }

  try {
    const response = await fetch("/api/chats/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ name: groupName, members }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("newChatModal").style.display = "none";
      document.getElementById("groupName").value = "";
      document.getElementById("membersList").innerHTML = "";

      // Reload chats and select the new one
      await loadChats();
      selectChat(data.chatId);

      Swal.fire({
        icon: "success",
        title: "Group Created",
        text: "Group chat created successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error(data.error || "Failed to create group");
    }
  } catch (error) {
    console.error("Error creating group chat:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}

// Add member to group
function addMemberToGroup() {
  const input = document.getElementById("addMemberInput");
  const username = input.value.trim();

  if (!username) return;

  // Check if already added
  const existing = document.querySelector(`[data-username="${username}"]`);
  if (existing) {
    input.value = "";
    return;
  }

  // Add member tag
  const membersList = document.getElementById("membersList");
  const memberTag = document.createElement("span");
  memberTag.className = "member-tag";
  memberTag.dataset.username = username;
  memberTag.innerHTML = `
        ${username}
        <span class="remove" onclick="this.parentElement.remove()">×</span>
    `;

  membersList.appendChild(memberTag);
  input.value = "";
}

// Load friends list
async function loadFriends() {
  try {
    const response = await fetch("/api/friends", {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      friends = await response.json();
      renderFriendsList();
    }
  } catch (error) {
    console.error("Error loading friends:", error);
  }
}

// Render friends list
function renderFriendsList() {
  const friendsList = document.getElementById("friendsList");

  if (friends.length === 0) {
    friendsList.innerHTML = '<div class="loading">No friends yet</div>';
    return;
  }

  friendsList.innerHTML = friends
    .map(
      (friend) => `
        <div class="friend-item">
            <div class="friend-info">
                <div class="chat-avatar">
                    <div class="avatar-circle">
                        ${friend.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="online-indicator ${
                      friend.isOnline ? "" : "offline"
                    }"></div>
                </div>
                <div>
                    <div style="font-weight: 600;">${friend.username}</div>
                    <div style="font-size: 12px; color: #888;">
                        ${
                          friend.isOnline
                            ? "Online"
                            : `Last seen ${formatTime(friend.lastSeen)}`
                        }
                    </div>
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn-sm btn-primary" onclick="startChatWithFriend('${
                  friend.username
                }')">
                    Message
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Start chat with friend
async function startChatWithFriend(username) {
  document.getElementById("friendsModal").style.display = "none";

  try {
    const response = await fetch("/api/chats/direct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      await loadChats();
      selectChat(data.chatId);
    }
  } catch (error) {
    console.error("Error starting chat:", error);
  }
}

// Send friend request
async function sendFriendRequest() {
  const username = document.getElementById("friendUsername").value.trim();

  if (!username) {
    Swal.fire({
      icon: "warning",
      title: "Username Required",
      text: "Please enter a username",
    });
    return;
  }

  try {
    const response = await fetch("/api/friends/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("friendUsername").value = "";
      Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}

// Load friend requests
async function loadFriendRequests() {
  try {
    const response = await fetch("/api/friends/requests", {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      const requests = await response.json();
      renderFriendRequests(requests);

      // Update badge in modal
      const modalBadge = document.getElementById("requestCount");
      if (requests.length > 0) {
        modalBadge.textContent = requests.length;
        modalBadge.style.display = "inline";
      } else {
        modalBadge.style.display = "none";
      }

      // Update friends button notification badge
      const friendsBadge = document.getElementById("friendsNotificationBadge");
      if (requests.length > 0) {
        friendsBadge.textContent = requests.length > 9 ? "9+" : requests.length;
        friendsBadge.style.display = "flex";
      } else {
        friendsBadge.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error loading friend requests:", error);
  }
}

// Render friend requests
function renderFriendRequests(requests) {
  const requestsList = document.getElementById("friendRequests");

  if (requests.length === 0) {
    requestsList.innerHTML = '<div class="loading">No pending requests</div>';
    return;
  }

  requestsList.innerHTML = requests
    .map(
      (request) => `
        <div class="request-item">
            <div class="friend-info">
                <div class="avatar-circle">
                    ${request.requesterUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style="font-weight: 600;">${
                      request.requesterUsername
                    }</div>
                    <div style="font-size: 12px; color: #888;">
                        ${formatTime(request.createdAt)}
                    </div>
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn-sm btn-success" onclick="handleFriendRequest('${
                  request.id
                }', 'accept')">
                    Accept
                </button>
                <button class="btn-sm btn-danger" onclick="handleFriendRequest('${
                  request.id
                }', 'reject')">
                    Reject
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Handle friend request
async function handleFriendRequest(requestId, action) {
  try {
    const response = await fetch(`/api/friends/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      const data = await response.json();

      loadFriendRequests();
      if (action === "accept") {
        loadFriends();

        // Send automatic friend request acceptance message
        if (data.friendUsername) {
          try {
            // Create or get direct chat with the new friend
            const chatResponse = await fetch("/api/chats/direct", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-User-UUID": currentUser.uuid,
              },
              body: JSON.stringify({ username: data.friendUsername }),
            });

            if (chatResponse.ok) {
              const chatData = await chatResponse.json();

              // Send automatic message
              await fetch("/api/messages", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-User-UUID": currentUser.uuid,
                },
                body: JSON.stringify({
                  chatId: chatData.chatId,
                  content: "I've accepted your friend request!",
                  senderUuid: currentUser.uuid,
                }),
              });

              // Reload chats to show the new conversation
              await loadChats();
            }
          } catch (messageError) {
            console.error("Error sending acceptance message:", messageError);
          }
        }
      }

      Swal.fire({
        icon: "success",
        title: action === "accept" ? "Friend Added" : "Request Rejected",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
  }
}

// Update user status in UI
function updateUserStatus(userUuid, isOnline) {
  // Update in friends list
  const friendIndex = friends.findIndex((f) => f.uuid === userUuid);
  if (friendIndex !== -1) {
    friends[friendIndex].isOnline = isOnline;
    renderFriendsList();
  }

  // Update in chat list
  chats.forEach((chat) => {
    if (
      chat.type === "direct" &&
      chat.members.length > 0 &&
      chat.members[0].uuid === userUuid
    ) {
      chat.members[0].isOnline = isOnline;
    }
  });
  renderChatList();

  // Update current chat if it's a direct message with this user
  if (currentChatId) {
    const currentChat = chats.find((c) => c.id === currentChatId);
    if (
      currentChat &&
      currentChat.type === "direct" &&
      currentChat.members.length > 0 &&
      currentChat.members[0].uuid === userUuid
    ) {
      const statusElement = document.getElementById("chatStatus");
      const onlineIndicator = document.getElementById("onlineIndicator");

      statusElement.textContent = isOnline ? "Online" : "Offline";
      onlineIndicator.className = `online-indicator ${
        isOnline ? "" : "offline"
      }`;
    }
  }
}

// Update chat in list with new message
function updateChatInList(chatId, messageData) {
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].lastMessage = messageData;
    chats[chatIndex].lastActivity = messageData.timestamp || new Date();

    // Move to top
    const chat = chats.splice(chatIndex, 1)[0];
    chats.unshift(chat);

    renderChatList();
  }
}

// Filter chats based on search
function filterChats() {
  const searchTerm = document.getElementById("chatSearch").value.toLowerCase();
  const chatItems = document.querySelectorAll(".chat-item");

  chatItems.forEach((item) => {
    const chatName = item
      .querySelector(".chat-item-name")
      .textContent.toLowerCase();
    const preview = item
      .querySelector(".chat-item-preview")
      .textContent.toLowerCase();

    if (chatName.includes(searchTerm) || preview.includes(searchTerm)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function showNotification(title, message, onClick) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: message,
      icon: "/img/favicon.ico",
    });

    notification.onclick = () => {
      window.focus();
      if (onClick) onClick();
      notification.close();
    };
  }

  const container = document.getElementById("notificationContainer");
  const notificationElement = document.createElement("div");
  notificationElement.className = "notification";
  notificationElement.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${title}</div>
            <div class="notification-time">${formatTime(new Date())}</div>
        </div>
        <div class="notification-message">${message}</div>
    `;

  if (onClick) {
    notificationElement.onclick = () => {
      onClick();
      notificationElement.remove();
    };
  }

  container.appendChild(notificationElement);

  setTimeout(() => {
    if (notificationElement.parentElement) {
      notificationElement.remove();
    }
  }, 5000);
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    // Less than 1 minute
    return "Now";
  } else if (diff < 3600000) {
    // Less than 1 hour
    return `${Math.floor(diff / 60000)}m`;
  } else if (diff < 86400000) {
    // Less than 1 day
    return `${Math.floor(diff / 3600000)}h`;
  } else {
    return date.toLocaleDateString();
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function scrollToBottom() {
  const container = document.getElementById("messagesContainer");
  if (!container) return;

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  requestNotificationPermission();
});

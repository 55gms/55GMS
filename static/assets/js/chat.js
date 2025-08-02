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

  // Initialize user info bar
  initializeUserInfoBar();

  // Setup event listeners
  setupEventListeners();

  // Handle page unload to stop viewing chat
  window.addEventListener("beforeunload", () => {
    if (currentChatId && socket) {
      socket.emit("stop_viewing_chat");
    }
  });

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

  // Update timestamps every 30 seconds
  setInterval(() => {
    updateTimestamps();
  }, 30000);
}

// Initialize Socket.IO connection
function initializeSocket() {
  socket = io();

  socket.on("connect", () => {
    console.log("Connected to server");
    // Authenticate user and join chat rooms
    socket.emit("authenticate", {
      uuid: currentUser.uuid,
      joinChatRooms: true,
    });
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

  socket.on("new_message_notification", (data) => {
    // This handles messages from other chats when user is not in that chat room
    console.log("Received notification for new message:", data);

    // Validate the data before processing
    if (!data.chatId || !data.content || !data.senderUuid) {
      console.error("Invalid notification data received:", data);
      return;
    }

    // Update chat list with the new message
    updateChatInList(data.chatId, data);

    // Show notification since this is for a chat the user is not currently viewing
    showNotification(
      "New Message",
      `${data.senderUsername || "Unknown"}: ${data.content}`,
      () => {
        selectChat(data.chatId);
      }
    );
  });

  socket.on("user_status_change", (data) => {
    updateUserStatus(data.userUuid, data.isOnline);
  });

  socket.on("messages_read", (data) => {
    console.log("Messages read by:", data.userUuid);
    // Clear unread count for the chat if it's the current user
    if (data.userUuid === currentUser.uuid) {
      clearUnreadCount(data.chatId);
    }
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

  // Copy username button
  document
    .getElementById("copyUsernameBtn")
    .addEventListener("click", copyUsername);

  // Chat menu functionality
  document
    .getElementById("chatMenuBtn")
    .addEventListener("click", toggleChatMenu);
  document
    .getElementById("addFriendOption")
    .addEventListener("click", handleAddFriend);
  document
    .getElementById("removeFriendOption")
    .addEventListener("click", handleRemoveFriend);

  // Click outside to close modals
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Close chat menu if clicking outside
    const chatMenu = document.getElementById("chatMenuDropdown");
    const menuBtn = document.getElementById("chatMenuBtn");
    if (
      chatMenu &&
      !menuBtn.contains(e.target) &&
      !chatMenu.contains(e.target)
    ) {
      chatMenu.style.display = "none";
    }
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

      // Check if this chat is currently active
      const isActive = chat.id === currentChatId;

      return `
            <div class="chat-item ${isActive ? "active" : ""}" data-chat-id="${
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
                        ? `<div class="chat-time" data-timestamp="${new Date(
                            lastMessage.createdAt
                          ).getTime()}">${formatTime(
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

  // Stop viewing previous chat
  if (currentChatId) {
    socket.emit("leave_chat", currentChatId);
    socket.emit("stop_viewing_chat");
  }

  currentChatId = chatId;

  // Join new chat room and start viewing it
  socket.emit("join_chat", chatId);
  socket.emit("viewing_chat", chatId);

  // Update URL
  history.pushState(null, "", `/chat/${chatId}`);

  // Update active chat in sidebar
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.chatId === chatId) {
      item.classList.add("active");
    }
  });

  // Immediately clear unread count for this chat
  clearUnreadCount(chatId);

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

      // Ensure timestamp is properly handled
      let timestamp = message.createdAt || new Date();
      if (typeof timestamp === "string") {
        timestamp = new Date(timestamp);
      }
      if (isNaN(timestamp.getTime())) {
        timestamp = new Date();
      }

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
                        <span class="message-time" data-timestamp="${timestamp.getTime()}">${formatTime(
        timestamp
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

  // Ensure timestamp is properly formatted
  let timestamp = messageData.timestamp || messageData.createdAt || new Date();
  if (typeof timestamp === "string") {
    timestamp = new Date(timestamp);
  }

  // Check if timestamp is valid
  if (isNaN(timestamp.getTime())) {
    timestamp = new Date();
  }

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
                <span class="message-time" data-timestamp="${timestamp.getTime()}">${formatTime(
    timestamp
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
  scrollToBottom();
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
        senderUsername: currentUser.username,
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

// Clear unread count for a specific chat
function clearUnreadCount(chatId) {
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].unreadCount = 0;

    // Update the unread badge in the UI immediately
    const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
    if (chatItem) {
      const unreadBadge = chatItem.querySelector(".unread-badge");
      if (unreadBadge) {
        unreadBadge.remove();
      }
    }
  }
}

// Update chat in list with new message
function updateChatInList(chatId, messageData) {
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex !== -1) {
    // Ensure the message data has the correct timestamp properties
    const normalizedMessage = {
      ...messageData,
      createdAt: messageData.createdAt || messageData.timestamp || new Date(),
      timestamp: messageData.timestamp || messageData.createdAt || new Date(),
    };

    chats[chatIndex].lastMessage = normalizedMessage;
    chats[chatIndex].lastActivity = normalizedMessage.timestamp || new Date();

    // Increment unread count if this chat is not currently active and message is not from current user
    if (
      chatId !== currentChatId &&
      messageData.senderUuid !== currentUser.uuid
    ) {
      chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
    }

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
  console.log("Chat showNotification called:", { title, message });

  // Initialize notification system if not already done
  if (!document.getElementById("notification-styles")) {
    console.log("Initializing notification styles...");
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 350px;
      }

      .notification {
        background: #2c2c2c;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        color: #fff;
        animation: notificationSlideIn 0.3s ease;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .notification:hover {
        transform: translateX(-5px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      }

      @keyframes notificationSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .notification-title {
        font-weight: 600;
        font-size: 14px;
        color: #fff;
      }

      .notification-time {
        font-size: 12px;
        color: #aaa;
      }

      .notification-message {
        font-size: 13px;
        color: #ddd;
        line-height: 1.4;
      }

      @media (max-width: 768px) {
        .notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("Notification styles added");
  }

  // Create notification container if not already present
  let container = document.getElementById("notificationContainer");
  if (!container) {
    console.log("Creating notification container...");
    container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
    console.log("Notification container created");
  }

  // Show browser notification if permission granted
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body: message,
        icon: "/img/favicon.ico",
      });

      notification.onclick = () => {
        window.focus();
        if (onClick) onClick();
        notification.close();
      };

      console.log("Browser notification created");
    } catch (error) {
      console.log("Browser notification failed:", error);
    }
  } else {
    console.log("Browser notification permission:", Notification.permission);
  }

  // Show in-page notification
  const notificationElement = document.createElement("div");
  notificationElement.className = "notification";
  notificationElement.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${escapeHtml(title)}</div>
            <div class="notification-time">${formatTime(new Date())}</div>
        </div>
        <div class="notification-message">${escapeHtml(message)}</div>
    `;

  if (onClick) {
    notificationElement.onclick = () => {
      onClick();
      notificationElement.remove();
    };
  }

  container.appendChild(notificationElement);
  console.log("In-page notification added to container");

  setTimeout(() => {
    if (notificationElement.parentElement) {
      notificationElement.remove();
      console.log("Chat notification auto-removed");
    }
  }, 5000);
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
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

// Test function for chat notifications (can be called from browser console)
function testChatNotification() {
  console.log("Testing chat notification system...");
  showNotification(
    "Test Chat Notification",
    "This is a test notification for the chat system!",
    () => {
      console.log("Test chat notification clicked!");
    }
  );
}

// Initialize user info bar
function initializeUserInfoBar() {
  const userInitials = document.getElementById("userInitials");
  const userDisplayName = document.getElementById("userDisplayName");

  if (currentUser.username) {
    userInitials.textContent = currentUser.username.charAt(0).toUpperCase();
    userDisplayName.textContent = currentUser.username;
  }
}

// Copy username to clipboard
function copyUsername() {
  navigator.clipboard
    .writeText(currentUser.username)
    .then(() => {
      // Show brief feedback
      const copyBtn = document.getElementById("copyUsernameBtn");
      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      copyBtn.style.background = "#4caf50";

      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.style.background = "#353d49";
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy username:", err);
    });
}

// Toggle chat menu dropdown
function toggleChatMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("chatMenuDropdown");
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

  // Update friend options based on current chat
  updateChatMenuOptions();
}

// Update chat menu options based on friendship status
async function updateChatMenuOptions() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "direct") {
    document.getElementById("addFriendOption").style.display = "none";
    document.getElementById("removeFriendOption").style.display = "none";
    return;
  }

  const otherUserUuid = currentChat.members[0]?.uuid;
  if (!otherUserUuid) return;

  // Check if already friends
  const isFriend = friends.some((f) => f.uuid === otherUserUuid);

  document.getElementById("addFriendOption").style.display = isFriend
    ? "none"
    : "block";
  document.getElementById("removeFriendOption").style.display = isFriend
    ? "block"
    : "none";
}

// Handle add friend
async function handleAddFriend() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  try {
    const response = await fetch("/api/friends/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ username: otherUser.username }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Friend Request Sent",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      document.getElementById("chatMenuDropdown").style.display = "none";
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}

// Handle remove friend
async function handleRemoveFriend() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  const result = await Swal.fire({
    title: "Remove Friend",
    text: `Are you sure you want to remove ${otherUser.username} from your friends?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, remove",
  });

  if (result.isConfirmed) {
    // Find the friendship and remove it
    // This would require a new API endpoint for removing friends
    // For now, show a message that this feature is coming soon
    Swal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "Friend removal feature is coming soon!",
    });
  }

  document.getElementById("chatMenuDropdown").style.display = "none";
}

// Update timestamps in real-time
function updateTimestamps() {
  const timestamps = document.querySelectorAll(".message-time[data-timestamp]");
  timestamps.forEach((element) => {
    const timestamp = parseInt(element.dataset.timestamp);
    element.textContent = formatTime(new Date(timestamp));
  });

  // Also update chat list timestamps
  const chatTimes = document.querySelectorAll(".chat-time[data-timestamp]");
  chatTimes.forEach((element) => {
    const timestamp = parseInt(element.dataset.timestamp);
    element.textContent = formatTime(new Date(timestamp));
  });
}

// Enhanced formatTime function for live updates
function formatTime(timestamp) {
  // Handle different timestamp formats
  let date;

  if (!timestamp) {
    return "now";
  }

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string" || typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    return "now";
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp received:", timestamp);
    return "now";
  }

  const now = new Date();
  const diff = now - date;

  if (diff < 30000) {
    // Less than 30 seconds
    return "now";
  } else if (diff < 60000) {
    // Less than 1 minute
    return `${Math.floor(diff / 1000)}s`;
  } else if (diff < 3600000) {
    // Less than 1 hour
    return `${Math.floor(diff / 60000)}m`;
  } else if (diff < 86400000) {
    // Less than 1 day
    return `${Math.floor(diff / 3600000)}h`;
  } else if (diff < 604800000) {
    // Less than 1 week
    return `${Math.floor(diff / 86400000)}d`;
  } else {
    return date.toLocaleDateString();
  }
}

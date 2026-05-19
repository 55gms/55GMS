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
  loadBlockedUsers();

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
      },
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
  messageInput.addEventListener("input", updateCharacterCounter);

  sendBtn.addEventListener("click", sendMessage);

  // Modal handlers
  document.getElementById("newChatBtn").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "flex";
    updateMemberCounter(); // Initialize counter when modal opens
  });

  document.getElementById("friendsBtn").addEventListener("click", () => {
    document.getElementById("friendsModal").style.display = "flex";
    loadFriends();
    loadFriendRequests();
  });

  document.getElementById("startChatBtn").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "flex";
    updateMemberCounter(); // Initialize counter when modal opens
  });

  // Close modals
  document.getElementById("closeNewChatModal").addEventListener("click", () => {
    document.getElementById("newChatModal").style.display = "none";
    // Reset form when closing
    document.getElementById("groupName").value = "";
    document.getElementById("membersList").innerHTML = "";
    updateMemberCounter();
  });

  document.getElementById("closeFriendsModal").addEventListener("click", () => {
    document.getElementById("friendsModal").style.display = "none";
  });

  document
    .getElementById("closeGroupMembersModal")
    .addEventListener("click", () => {
      document.getElementById("groupMembersModal").style.display = "none";
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
  document
    .getElementById("leaveGroupOption")
    .addEventListener("click", handleLeaveGroup);
  document
    .getElementById("viewMembersOption")
    .addEventListener("click", handleViewMembers);
  document
    .getElementById("blockUserOption")
    .addEventListener("click", handleBlockUser);
  document
    .getElementById("unblockUserOption")
    .addEventListener("click", handleUnblockUser);

  // Click outside to close modals
  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
        // Reset new chat modal form when closing
        if (modal.id === "newChatModal") {
          document.getElementById("groupName").value = "";
          document.getElementById("membersList").innerHTML = "";
          updateMemberCounter();
        }
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
                            lastMessage.createdAt,
                          ).getTime()}">${formatTime(
                            lastMessage.createdAt,
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
      const isSystem =
        message.senderUuid === "system" || message.isSystem === true;
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

      if (isSystem) {
        // System message style
        return `
          <div class="message system">
            <div class="message-content system-message">
              <div class="message-text">${escapeHtml(message.content)}</div>
              <span class="message-time" data-timestamp="${timestamp.getTime()}">${formatTime(timestamp)}</span>
            </div>
          </div>
        `;
      }

      // Regular message
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
                          timestamp,
                        )}</span>
                    </div>
                    <div class="message-text">${escapeHtml(
                      message.content,
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
  const isSystem =
    messageData.senderUuid === "system" || messageData.isSystem === true;

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

  if (isSystem) {
    // System message style
    messageElement.className = "message system";
    messageElement.innerHTML = `
      <div class="message-content system-message">
        <div class="message-text">${escapeHtml(messageData.content)}</div>
        <span class="message-time" data-timestamp="${timestamp.getTime()}">${formatTime(timestamp)}</span>
      </div>
    `;
  } else {
    // Regular message
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
                  timestamp,
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
  }

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

  // Check character limit
  if (content.length > 2000) {
    Swal.fire({
      icon: "error",
      title: "Message Too Long",
      text: "Messages must be 2000 characters or less.",
    });
    return;
  }

  // Clear input immediately
  messageInput.value = "";
  updateCharacterCounter(); // Update counter after clearing

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
      const errorData = await response.json();

      // Handle blocked messages specially
      if (errorData.blocked) {
        Swal.fire({
          icon: "error",
          title: "Cannot Send Message",
          text: errorData.message || "Message cannot be sent due to blocking",
        });
        // Restore message to input to allow copying
        messageInput.value = content;
        return;
      }

      throw new Error(errorData.error || "Failed to send message");
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

  // Double-check member limit (should already be handled by addMemberToGroup)
  if (members.length > 9) {
    Swal.fire({
      icon: "warning",
      title: "Too Many Members",
      text: "You can only add up to 9 other people to a group chat (10 people total including yourself).",
    });
    return;
  }

  // Filter out any attempt to add yourself (extra safety check)
  const filteredMembers = members.filter(
    (username) => username.toLowerCase() !== currentUser.username.toLowerCase(),
  );

  if (filteredMembers.length !== members.length) {
    Swal.fire({
      icon: "info",
      title: "Note",
      text: "Removed your own username from the members list. You're automatically added as the group creator.",
    });
  }

  try {
    const response = await fetch("/api/chats/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-UUID": currentUser.uuid,
      },
      body: JSON.stringify({ name: groupName, members: filteredMembers }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("newChatModal").style.display = "none";
      document.getElementById("groupName").value = "";
      document.getElementById("membersList").innerHTML = "";
      updateMemberCounter(); // Reset counter

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

  // Check if trying to add yourself
  if (username.toLowerCase() === currentUser.username.toLowerCase()) {
    Swal.fire({
      icon: "warning",
      title: "Cannot Add Yourself",
      text: "You cannot add yourself to the group. You're already the creator!",
    });
    input.value = "";
    return;
  }

  // Check if already added
  const existing = document.querySelector(`[data-username="${username}"]`);
  if (existing) {
    input.value = "";
    return;
  }

  // Check member limit (9 others + creator = 10 total)
  const currentMembers = document.querySelectorAll("#membersList .member-tag");
  if (currentMembers.length >= 9) {
    Swal.fire({
      icon: "warning",
      title: "Member Limit Reached",
      text: "You can only add up to 9 other people to a group chat (10 people total including yourself).",
    });
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
        <span class="remove" onclick="removeMemberFromGroup(this)">×</span>
    `;

  membersList.appendChild(memberTag);
  input.value = "";

  // Update member counter
  updateMemberCounter();
}

// Remove member from group and update counter
function removeMemberFromGroup(element) {
  element.parentElement.remove();
  updateMemberCounter();
}

// Update the member counter display
function updateMemberCounter() {
  const memberCount = document.querySelectorAll(
    "#membersList .member-tag",
  ).length;
  const counterElement = document.getElementById("memberCount");
  if (counterElement) {
    counterElement.textContent = `(${memberCount}/9)`;

    // Change color based on limit
    if (memberCount >= 9) {
      counterElement.style.color = "#ff6b6b";
    } else if (memberCount >= 7) {
      counterElement.style.color = "#ffa726";
    } else {
      counterElement.style.color = "#888";
    }
  }
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
    `,
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
    `,
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

  // Show in-page notification only (browser notifications removed)
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

function updateCharacterCounter() {
  const messageInput = document.getElementById("messageInput");
  const charCount = document.getElementById("charCount");

  if (messageInput && charCount) {
    const currentLength = messageInput.value.length;
    charCount.textContent = currentLength;

    // Change color based on character limit
    if (currentLength > 1800) {
      charCount.style.color = "#e74c3c"; // Red when approaching limit
    } else if (currentLength > 1500) {
      charCount.style.color = "#f39c12"; // Orange when getting close
    } else {
      charCount.style.color = "#95a5a6"; // Default gray
    }
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
  // Browser notification permissions removed - using in-page notifications only
});

// Test function for chat notifications (can be called from browser console)
function testChatNotification() {
  console.log("Testing chat notification system...");
  showNotification(
    "Test Chat Notification",
    "This is a test notification for the chat system!",
    () => {
      console.log("Test chat notification clicked!");
    },
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
  if (!currentChat) return;

  // Handle direct chats
  if (currentChat.type === "direct") {
    document.getElementById("leaveGroupOption").style.display = "none";
    document.getElementById("viewMembersOption").style.display = "none";

    const otherUserUuid = currentChat.members[0]?.uuid;
    if (!otherUserUuid) {
      document.getElementById("addFriendOption").style.display = "none";
      document.getElementById("removeFriendOption").style.display = "none";
      document.getElementById("blockUserOption").style.display = "none";
      document.getElementById("unblockUserOption").style.display = "none";
      return;
    }

    // Check if already friends
    const isFriend = friends.some((f) => f.uuid === otherUserUuid);

    // Check if user is blocked
    let isBlocked = false;
    try {
      const blockedUsers = await getBlockedUsers();
      isBlocked = blockedUsers.some((user) => user.uuid === otherUserUuid);
    } catch (error) {
      console.error("Error checking blocked status:", error);
    }

    document.getElementById("addFriendOption").style.display =
      isFriend || isBlocked ? "none" : "block";
    document.getElementById("removeFriendOption").style.display =
      isFriend && !isBlocked ? "block" : "none";
    document.getElementById("blockUserOption").style.display = isBlocked
      ? "none"
      : "block";
    document.getElementById("unblockUserOption").style.display = isBlocked
      ? "block"
      : "none";
  }
  // Handle group chats
  else if (currentChat.type === "group") {
    document.getElementById("addFriendOption").style.display = "none";
    document.getElementById("removeFriendOption").style.display = "none";
    document.getElementById("blockUserOption").style.display = "none";
    document.getElementById("unblockUserOption").style.display = "none";
    document.getElementById("leaveGroupOption").style.display = "block";
    document.getElementById("viewMembersOption").style.display = "block";
  }
  // Default case - hide all options
  else {
    document.getElementById("addFriendOption").style.display = "none";
    document.getElementById("removeFriendOption").style.display = "none";
    document.getElementById("blockUserOption").style.display = "none";
    document.getElementById("unblockUserOption").style.display = "none";
    document.getElementById("leaveGroupOption").style.display = "none";
    document.getElementById("viewMembersOption").style.display = "none";
  }
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

// Handle leave group
async function handleLeaveGroup() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "group") return;

  const result = await Swal.fire({
    title: "Leave Group",
    text: `Are you sure you want to leave "${currentChat.name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, leave group",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      // Leave the group
      const leaveResponse = await fetch(`/api/chats/${currentChatId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-UUID": currentUser.uuid,
        },
      });

      if (leaveResponse.ok) {
        // Leave the socket room
        socket.emit("leave_chat", currentChatId);

        // Remove chat from local list
        chats = chats.filter((chat) => chat.id !== currentChatId);

        // Update UI
        renderChatList();

        // Show welcome screen
        document.getElementById("chatWelcome").style.display = "flex";
        document.getElementById("chatContent").style.display = "none";
        currentChatId = null;

        // Update URL
        history.pushState(null, "", "/chat");

        Swal.fire({
          icon: "success",
          title: "Left Group",
          text: "You have successfully left the group",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        const errorData = await leaveResponse.json();
        throw new Error(errorData.error || "Failed to leave group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to leave group",
      });
    }
  }

  document.getElementById("chatMenuDropdown").style.display = "none";
}

// Handle block user
async function handleBlockUser() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  const result = await Swal.fire({
    title: "Block User",
    text: `Are you sure you want to block ${otherUser.username}? You will not be able to receive messages from them.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, block user",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch("/api/friends/block", {
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
          title: "User Blocked",
          text: "You have successfully blocked this user",
          timer: 2000,
          showConfirmButton: false,
        });

        // Add a system message to show blocking status
        appendMessage({
          chatId: currentChatId,
          content:
            "You blocked this user. You can no longer receive messages from them.",
          senderUuid: "system",
          senderUsername: "System",
          timestamp: new Date(),
        });

        // Update UI
        loadBlockedUsers();
        updateChatMenuOptions();
      } else {
        throw new Error(data.error || "Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to block user",
      });
    }
  }

  document.getElementById("chatMenuDropdown").style.display = "none";
}

// Handle unblock user
async function handleUnblockUser() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  const result = await Swal.fire({
    title: "Unblock User",
    text: `Are you sure you want to unblock ${otherUser.username}? They will be able to send messages to you again.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, unblock user",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch("/api/friends/unblock", {
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
          title: "User Unblocked",
          text: "You have successfully unblocked this user",
          timer: 2000,
          showConfirmButton: false,
        });

        // Add a system message to show unblocking status
        appendMessage({
          chatId: currentChatId,
          content:
            "You unblocked this user. You can now receive messages from them.",
          senderUuid: "system",
          senderUsername: "System",
          timestamp: new Date(),
        });

        // Update UI
        loadBlockedUsers();
        updateChatMenuOptions();
      } else {
        throw new Error(data.error || "Failed to unblock user");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to unblock user",
      });
    }
  }

  document.getElementById("chatMenuDropdown").style.display = "none";
}

// Load blocked users
async function loadBlockedUsers() {
  try {
    const response = await fetch("/api/friends/blocked", {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      const blockedUsers = await response.json();
      renderBlockedUsers(blockedUsers);
      return blockedUsers;
    }
    return [];
  } catch (error) {
    console.error("Error loading blocked users:", error);
    return [];
  }
}

// Get blocked users (without rendering)
async function getBlockedUsers() {
  try {
    const response = await fetch("/api/friends/blocked", {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error getting blocked users:", error);
    return [];
  }
}

// Render blocked users list
function renderBlockedUsers(blockedUsers) {
  const blockedList = document.getElementById("blockedUsersList");

  if (blockedUsers.length === 0) {
    blockedList.innerHTML = '<div class="loading">No blocked users</div>';
    return;
  }

  blockedList.innerHTML = blockedUsers
    .map(
      (user) => `
        <div class="friend-item">
            <div class="friend-info">
                <div class="chat-avatar">
                    <div class="avatar-circle">
                        ${user.username.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div>
                    <div style="font-weight: 600;">${user.username}</div>
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn-sm btn-primary" onclick="unblockUser('${user.username}')">
                    Unblock
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Unblock user from blocked list
async function unblockUser(username) {
  try {
    const result = await Swal.fire({
      title: "Unblock User",
      text: `Are you sure you want to unblock ${username}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock",
    });

    if (result.isConfirmed) {
      const response = await fetch("/api/friends/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-UUID": currentUser.uuid,
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "User Unblocked",
          text: "User has been unblocked successfully",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh blocked users list
        loadBlockedUsers();

        // Update menu options in current chat (if we're in a chat with the unblocked user)
        updateChatMenuOptions();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to unblock user");
      }
    }
  } catch (error) {
    console.error("Error unblocking user:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Failed to unblock user",
    });
  }
}

// Handle view members button click
async function handleViewMembers() {
  if (!currentChatId) return;

  const currentChat = chats.find((c) => c.id === currentChatId);
  if (!currentChat || currentChat.type !== "group") {
    return;
  }

  try {
    const response = await fetch(`/api/chats/${currentChat.id}/members`, {
      method: "GET",
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch group members");
    }

    const data = await response.json();

    if (data.success) {
      displayGroupMembers(data.members);
      document.getElementById("groupMembersModal").style.display = "block";
    } else {
      throw new Error(data.error || "Failed to fetch group members");
    }
  } catch (error) {
    console.error("Error fetching group members:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load group members. Please try again.",
    });
  }

  document.getElementById("chatMenuDropdown").style.display = "none";
}

// Display group members in the modal
function displayGroupMembers(members) {
  const membersList = document.getElementById("groupMembersList");
  membersList.innerHTML = "";

  members.forEach((member) => {
    const memberElement = document.createElement("div");
    memberElement.className = "group-member-item";

    const statusClass = member.status === "online" ? "online" : "offline";
    const roleText = member.role === "admin" ? " (Admin)" : "";

    memberElement.innerHTML = `
      <div class="member-avatar">
        <img src="${member.avatar}" alt="${member.username}" />
        <span class="status-indicator ${statusClass}"></span>
      </div>
      <div class="member-info">
        <span class="member-username">${member.username}${roleText}</span>
        <span class="member-status">${member.status}</span>
      </div>
    `;

    membersList.appendChild(memberElement);
  });
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

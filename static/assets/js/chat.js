// Chat System JavaScript
let socket;
let currentChatId = null;
let currentUser = null;
let chats = [];
let friends = [];
let blockedUsers = [];
let typingTimeout = null;
let isTyping = false;
let typingChatId = null;
let lastFocusedBeforeModal = null;

// Matches the limit enforced by POST /api/chats/:chatId/messages
const MESSAGE_MAX_LENGTH = 2000;
const COUNTER_WARNING_AT = 1500;
const COUNTER_DANGER_AT = 1800;
// 9 others + the creator = 10 people per group
const MAX_GROUP_OTHERS = 9;
const MAX_RENDERED_MESSAGES = 200;
// Consecutive messages from one sender within this window render as a group
const MESSAGE_GROUP_WINDOW_MS = 5 * 60 * 1000;
const DEFAULT_AVATAR = "/img/user.webp";

const typingUsers = new Set();
const drafts = new Map();
const recentIncoming = new Map();

// Initialize chat system
async function initializeChat() {
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

  // Setup event listeners
  setupEventListeners();

  // Initialize user info bar
  initializeUserInfoBar();

  // Load initial data before resolving /chat/:chatId deep links.
  await loadChats();
  loadFriends();
  loadFriendRequests();
  loadBlockedUsers();

  // Handle page unload to stop viewing chat
  window.addEventListener("beforeunload", () => {
    if (currentChatId && socket) {
      socket.emit("stop_viewing_chat");
    }
  });

  handleChatRoute({ updateHistory: false });
  window.addEventListener("popstate", () => {
    handleChatRoute({ updateHistory: false });
  });

  // Periodically check for new friend requests to update the notification badge
  setInterval(() => {
    if (!document.hidden) loadFriendRequests();
  }, 30000); // Check every 30 seconds while the tab is visible

  // Update timestamps every 30 seconds
  setInterval(() => {
    updateTimestamps();
  }, 30000);
}

// Initialize Socket.IO connection
function initializeSocket() {
  socket = io({
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to server");
    // Authenticate user and join chat rooms
    socket.emit("authenticate", {
      uuid: currentUser.uuid,
      joinChatRooms: true,
    });

    // Restore the open conversation after a reconnect
    if (currentChatId) {
      socket.emit("join_chat", currentChatId);
      socket.emit("viewing_chat", currentChatId);
    }

    setConnectionState(true);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    setConnectionState(false);
  });

  socket.on("new_message", (data) => {
    if (isSameChatId(data.chatId, currentChatId)) {
      showTypingIndicator(data.senderUuid, false);
      appendMessage(data, { forceScroll: false });
      updateChatInList(data.chatId, data);
      return;
    }

    // The server also sends new_message_notification for chats that are not
    // open, so the same message can arrive through both events.
    if (isDuplicateIncoming(data)) return;

    // Update chat list
    updateChatInList(data.chatId, data);

    // Show notification if not currently viewing this chat
    showNotification("New Message", data.content, () => {
      selectChat(data.chatId);
    });
  });

  socket.on("user_typing", (data) => {
    if (
      isSameChatId(data.chatId, currentChatId) &&
      data.userUuid !== currentUser.uuid
    ) {
      showTypingIndicator(data.userUuid, data.isTyping);
    }
  });

  socket.on("new_message_notification", (data) => {
    // This handles messages from other chats when user is not in that chat room
    // Validate the data before processing
    if (!data.chatId || !data.content || !data.senderUuid) {
      console.error("Invalid notification data received:", data);
      return;
    }

    if (isSameChatId(data.chatId, currentChatId)) return;
    if (isDuplicateIncoming(data)) return;

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
    // Clear unread count for the chat if it's the current user
    if (data.userUuid === currentUser.uuid) {
      clearUnreadCount(data.chatId);
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    ChatSwal.fire({
      icon: "error",
      title: "Connection Error",
      text: error,
    });
  });
}

// The same message can be delivered by both new_message and
// new_message_notification; only the first one within a short window counts.
function isDuplicateIncoming(data) {
  const now = Date.now();
  const key = `${data.chatId}|${data.senderUuid}|${data.content}`;

  recentIncoming.forEach((time, existingKey) => {
    if (now - time > 2000) recentIncoming.delete(existingKey);
  });

  if (recentIncoming.has(key)) return true;
  recentIncoming.set(key, now);
  return false;
}

function setConnectionState(isConnected) {
  const status = document.getElementById("userStatus");
  if (!status) return;
  status.textContent = isConnected ? "Online" : "Reconnecting…";
  status.classList.toggle("is-offline", !isConnected);
}

function setupEventListeners() {
  // Message input
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  });

  messageInput.addEventListener("input", handleTyping);
  messageInput.addEventListener("input", updateCharacterCounter);

  sendBtn.addEventListener("click", sendMessage);

  document
    .getElementById("mobileChatBackBtn")
    .addEventListener("click", () => showChatWelcome());

  // Message list scrolling
  document
    .getElementById("messagesContainer")
    .addEventListener("scroll", updateJumpToLatest, { passive: true });
  document.getElementById("jumpToLatestBtn").addEventListener("click", () => {
    scrollToBottom();
  });

  // Modal handlers
  document.getElementById("newChatBtn").addEventListener("click", () => {
    openModal("newChatModal");
  });

  document.getElementById("friendsBtn").addEventListener("click", () => {
    openModal("friendsModal");
    loadFriends();
    loadFriendRequests();
  });

  document.getElementById("startChatBtn").addEventListener("click", () => {
    openModal("newChatModal");
  });

  // Close modals
  document.getElementById("closeNewChatModal").addEventListener("click", () => {
    closeModal("newChatModal");
  });

  document.getElementById("closeFriendsModal").addEventListener("click", () => {
    closeModal("friendsModal");
  });

  document
    .getElementById("closeGroupMembersModal")
    .addEventListener("click", () => {
      closeModal("groupMembersModal");
    });

  // Tab switching
  setupTabSwitching();

  // Chat creation
  document.getElementById("directChatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    createDirectChat();
  });
  document.getElementById("groupChatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    createGroupChat();
  });
  document
    .getElementById("directUsername")
    .addEventListener("input", renderFriendPickers);

  // Friend management
  document.getElementById("addFriendForm").addEventListener("submit", (e) => {
    e.preventDefault();
    sendFriendRequest();
  });

  // Group member input
  const addMemberInput = document.getElementById("addMemberInput");
  addMemberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addMemberToGroup();
    } else if (e.key === "Backspace" && !addMemberInput.value) {
      const tags = document.querySelectorAll("#membersList .member-tag");
      if (tags.length > 0) {
        tags[tags.length - 1].remove();
        updateMemberCounter();
      }
    }
  });
  addMemberInput.addEventListener("input", renderFriendPickers);
  document.getElementById("memberField").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) addMemberInput.focus();
  });

  // Search
  const chatSearch = document.getElementById("chatSearch");
  chatSearch.addEventListener("input", filterChats);
  chatSearch.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatSearch.value) {
      e.stopPropagation();
      chatSearch.value = "";
      filterChats();
    }
  });

  // Conversation list
  document.getElementById("chatList").addEventListener("click", (e) => {
    const item = e.target.closest(".chat-item");
    if (!item) return;
    // Let modified clicks open the conversation in a new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    selectChat(item.dataset.chatId);
  });

  // Copy username button
  document
    .getElementById("copyUsernameBtn")
    .addEventListener("click", copyUsername);

  // Chat menu functionality
  document
    .getElementById("chatMenuBtn")
    .addEventListener("click", toggleChatMenu);
  document
    .getElementById("chatMenuDropdown")
    .addEventListener("keydown", handleChatMenuKeydown);
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

  // Buttons rendered inside lists
  document.addEventListener("click", handleActionClick);

  // Click outside to close modals
  window.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("modal")) {
      closeModal(e.target.id);
    }

    // Close chat menu if clicking outside
    const chatMenu = document.getElementById("chatMenuDropdown");
    const menuBtn = document.getElementById("chatMenuBtn");
    if (
      chatMenu &&
      !menuBtn.contains(e.target) &&
      !chatMenu.contains(e.target)
    ) {
      closeChatMenu();
    }
  });

  document.addEventListener("keydown", handleGlobalKeydown);
}

// Handles buttons that are rendered dynamically inside lists
function handleActionClick(e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const { action, username, requestId } = target.dataset;

  switch (action) {
    case "start-chat":
      startChatWithFriend(username);
      break;
    case "accept-request":
      handleFriendRequest(requestId, "accept");
      break;
    case "reject-request":
      handleFriendRequest(requestId, "reject");
      break;
    case "unblock":
      unblockUser(username);
      break;
    case "add-member":
      addMemberToGroup(username);
      break;
    case "remove-member":
      removeMemberFromGroup(target);
      break;
    case "retry-messages":
      if (currentChatId) {
        renderMessagesLoading();
        loadChatMessages(currentChatId);
      }
      break;
  }
}

function handleGlobalKeydown(e) {
  const openModalElement = getOpenModal();

  if (e.key === "Escape") {
    if (isChatMenuOpen()) {
      closeChatMenu({ restoreFocus: true });
    } else if (openModalElement && !Swal.isVisible()) {
      closeModal(openModalElement.id);
    }
    return;
  }

  // Keep keyboard focus inside the open dialog
  if (e.key === "Tab" && openModalElement && !Swal.isVisible()) {
    const focusable = Array.from(
      openModalElement.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]",
      ),
    ).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!openModalElement.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  }
}

function getOpenModal() {
  return (
    Array.from(document.querySelectorAll(".modal")).find(
      (modal) => modal.style.display !== "none",
    ) || null
  );
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  closeChatMenu();
  if (modal.style.display === "none") {
    lastFocusedBeforeModal = document.activeElement;
  }
  modal.style.display = "flex";

  if (modalId === "newChatModal") {
    updateMemberCounter(); // Initialize counter when modal opens
    renderFriendPickers();
  }

  // On touch devices focusing a field would open the keyboard over the sheet
  const canFocusInput = window.matchMedia("(hover: hover)").matches;
  const focusTarget =
    (canFocusInput &&
      (modal.querySelector(".tab-panel.active input") ||
        modal.querySelector("input"))) ||
    modal.querySelector(".modal-close");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal || modal.style.display === "none") return;

  modal.style.display = "none";

  // Reset new chat modal form when closing
  if (modalId === "newChatModal") {
    document.getElementById("groupName").value = "";
    document.getElementById("membersList").innerHTML = "";
    document.getElementById("addMemberInput").value = "";
    updateMemberCounter();
  }

  if (lastFocusedBeforeModal && document.contains(lastFocusedBeforeModal)) {
    lastFocusedBeforeModal.focus();
  }
  lastFocusedBeforeModal = null;
}

// Setup tab switching functionality
function setupTabSwitching() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabContainer = btn.closest(".modal-body");
      const tabName = btn.dataset.tab;

      // Remove active class from all tabs and panels in this container
      tabContainer.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabContainer
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("active"));

      // Add active class to clicked tab and corresponding panel
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const panel = tabContainer.querySelector(`#${tabName}Tab`);
      panel.classList.add("active");

      const input = panel.querySelector("input");
      if (input && window.matchMedia("(hover: hover)").matches) input.focus();
    });
  });
}

function getRouteChatId() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (pathParts[0] !== "chat" || !pathParts[1]) {
    return null;
  }
  return decodeURIComponent(pathParts[1]);
}

function userHasChat(chatId) {
  return chats.some((chat) => isSameChatId(chat.id, chatId));
}

function isSameChatId(firstChatId, secondChatId) {
  return String(firstChatId) === String(secondChatId);
}

function getCurrentChat() {
  if (!currentChatId) return null;
  return chats.find((c) => isSameChatId(c.id, currentChatId)) || null;
}

async function handleChatRoute({ updateHistory = false } = {}) {
  const routeChatId = getRouteChatId();

  if (!routeChatId) {
    showChatWelcome({ updateHistory });
    return;
  }

  if (!userHasChat(routeChatId)) {
    showChatWelcome({ updateHistory: false });
    return;
  }

  await selectChat(routeChatId, { updateHistory });
}

function showChatWelcome({ updateHistory = true } = {}) {
  saveDraft();
  stopTyping();

  if (currentChatId && socket) {
    socket.emit("leave_chat", currentChatId);
    socket.emit("stop_viewing_chat");
  }

  currentChatId = null;
  document.body.classList.remove("chat-view-active");
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.classList.remove("active");
    item.removeAttribute("aria-current");
  });

  closeChatMenu();
  resetTypingIndicator();
  resetMessages();

  const messageInput = document.getElementById("messageInput");
  messageInput.value = "";
  updateCharacterCounter();

  document.getElementById("chatWelcome").style.display = "flex";
  document.getElementById("chatContent").style.display = "none";

  if (updateHistory && window.location.pathname !== "/chat") {
    history.pushState(null, "", "/chat");
  }
}

// SweetAlert dialogs share the chat's button and surface styles
const ChatSwal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: getAlertClasses("primary"),
});

function getAlertClasses(intent = "primary") {
  return {
    popup: "chat-swal",
    confirmButton: intent === "danger" ? "btn btn-danger" : "btn btn-primary",
    cancelButton: "btn",
  };
}

function getAlertButtonColors(intent = "primary") {
  return { customClass: getAlertClasses(intent) };
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function getInitial(name) {
  const trimmed = String(name ?? "").trim();
  return trimmed ? Array.from(trimmed)[0].toUpperCase() : "?";
}

// Stable per-name hue so initials avatars are told apart at a glance
function getAvatarHue(name) {
  const text = String(name ?? "");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) >>> 0;
  }
  // Scramble so similar names (user1, user2) land on distant hues
  return (Math.imul(hash, 2654435761) >>> 0) % 360;
}

function avatarHtml(name, { isGroup = false, isOnline = null, image } = {}) {
  const content =
    image && image !== DEFAULT_AVATAR
      ? `<img loading="lazy" src="${escapeHtml(image)}" alt="" />`
      : escapeHtml(getInitial(name));

  return `
    <span class="chat-avatar">
      <span class="avatar-circle${isGroup ? " is-group" : ""}" style="--avatar-hue: ${getAvatarHue(name)}">${content}</span>
      ${
        isOnline === null
          ? ""
          : `<span class="online-indicator${isOnline ? "" : " offline"}"></span>`
      }
    </span>
  `;
}

function listStateHtml(title, description = "") {
  return `
    <div class="list-state">
      <strong>${escapeHtml(title)}</strong>
      ${description ? `<span>${escapeHtml(description)}</span>` : ""}
    </div>
  `;
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
      return chats;
    } else {
      console.error("Failed to load chats");
    }
  } catch (error) {
    console.error("Error loading chats:", error);
  }

  const chatList = document.getElementById("chatList");
  if (chats.length === 0 && chatList) {
    chatList.removeAttribute("aria-busy");
    chatList.innerHTML = listStateHtml(
      "Couldn't load conversations",
      "Check your connection and reload the page.",
    );
  }
  return [];
}

function getChatPreview(chat) {
  const lastMessage = chat.lastMessage;
  if (!lastMessage) return "No messages yet";

  const isSystem =
    lastMessage.isSystem === true || lastMessage.senderUuid === "system";
  let prefix = "";
  if (!isSystem) {
    if (lastMessage.senderUuid === currentUser.uuid) {
      prefix = "You: ";
    } else if (chat.type === "group" && lastMessage.senderUsername) {
      prefix = `${lastMessage.senderUsername}: `;
    }
  }

  return prefix + lastMessage.content;
}

// Render chat list
function renderChatList() {
  const chatList = document.getElementById("chatList");
  chatList.removeAttribute("aria-busy");

  if (chats.length === 0) {
    chatList.innerHTML = listStateHtml(
      "No conversations yet",
      "Start one with the + button above.",
    );
    return;
  }

  chatList.innerHTML = chats
    .map((chat) => {
      const isGroup = chat.type === "group";
      const isOnline =
        chat.type === "direct" &&
        chat.members.length > 0 &&
        chat.members[0].isOnline;
      const lastMessage = chat.lastMessage;
      const unreadCount = chat.unreadCount || 0;

      // Check if this chat is currently active
      const isActive = isSameChatId(chat.id, currentChatId);
      const classes = [
        "chat-item",
        isActive ? "active" : "",
        unreadCount > 0 ? "is-unread" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
            <a class="${classes}" href="/chat/${encodeURIComponent(chat.id)}" data-chat-id="${escapeHtml(chat.id)}"${isActive ? ' aria-current="page"' : ""}>
                ${avatarHtml(chat.name, {
                  isGroup,
                  isOnline: chat.type === "direct" ? isOnline : null,
                })}
                <div class="chat-item-content">
                    <div class="chat-item-row">
                        <div class="chat-item-name">${escapeHtml(chat.name)}</div>
                        ${
                          lastMessage
                            ? `<div class="chat-time" data-timestamp="${new Date(
                                lastMessage.createdAt,
                              ).getTime()}">${formatTime(
                                lastMessage.createdAt,
                              )}</div>`
                            : ""
                        }
                    </div>
                    <div class="chat-item-row">
                        <div class="chat-item-preview">${escapeHtml(getChatPreview(chat))}</div>
                        ${
                          unreadCount > 0
                            ? `<div class="unread-badge" aria-label="${unreadCount} unread">${
                                unreadCount > 99 ? "99+" : unreadCount
                              }</div>`
                            : ""
                        }
                    </div>
                </div>
            </a>
        `;
    })
    .join("");

  // Keep an active search applied across re-renders
  filterChats();
}

function updateChatHeader() {
  const chat = getCurrentChat();
  if (!chat) return;

  const isGroup = chat.type === "group";
  const avatar = document.getElementById("chatAvatar");
  const statusElement = document.getElementById("chatStatus");
  const onlineIndicator = document.getElementById("onlineIndicator");

  document.getElementById("chatName").textContent = chat.name;
  document.getElementById("chatInitials").textContent = getInitial(chat.name);
  avatar.classList.toggle("is-group", isGroup);
  avatar.style.setProperty("--avatar-hue", getAvatarHue(chat.name));

  // Update status
  if (chat.type === "direct" && chat.members.length > 0) {
    const isOnline = chat.members[0].isOnline;
    statusElement.textContent = isOnline ? "Online" : "Offline";
    statusElement.className = isOnline ? "is-online" : "is-offline";
    onlineIndicator.style.display = "block";
    onlineIndicator.className = `online-indicator ${isOnline ? "" : "offline"}`;
  } else {
    statusElement.textContent = `${chat.members.length + 1} members`;
    statusElement.className = "";
    onlineIndicator.style.display = "none";
  }

  document.getElementById("messageInput").placeholder = `Message ${chat.name}`;
}

// Select and load a chat
async function selectChat(chatId, { updateHistory = true } = {}) {
  if (isSameChatId(currentChatId, chatId)) return;

  saveDraft();
  stopTyping();

  // Stop viewing previous chat
  if (currentChatId) {
    socket.emit("leave_chat", currentChatId);
    socket.emit("stop_viewing_chat");
  }

  currentChatId = chatId;
  document.body.classList.add("chat-view-active");

  // Join new chat room and start viewing it
  socket.emit("join_chat", chatId);
  socket.emit("viewing_chat", chatId);

  // Update URL
  const chatPath = `/chat/${encodeURIComponent(chatId)}`;
  if (updateHistory && window.location.pathname !== chatPath) {
    history.pushState(null, "", chatPath);
  }

  // Update active chat in sidebar
  document.querySelectorAll(".chat-item").forEach((item) => {
    const isActive = isSameChatId(item.dataset.chatId, chatId);
    item.classList.toggle("active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  // Immediately clear unread count for this chat
  clearUnreadCount(chatId);

  // Show the conversation right away; messages fill in when they arrive
  closeChatMenu();
  resetTypingIndicator();
  updateChatHeader();
  renderMessagesLoading();
  document.getElementById("chatWelcome").style.display = "none";
  document.getElementById("chatContent").style.display = "flex";

  const messageInput = document.getElementById("messageInput");
  messageInput.value = drafts.get(String(chatId)) || "";
  updateCharacterCounter();

  // Focus message input (not on touch devices, where it opens the keyboard)
  if (window.matchMedia("(hover: hover)").matches) {
    messageInput.focus();
  }

  // Load chat messages
  await loadChatMessages(chatId);
  if (!isSameChatId(chatId, currentChatId)) return;

  // Mark messages as read
  socket.emit("mark_read", { chatId });
}

// Load messages for a chat
async function loadChatMessages(chatId) {
  try {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
      headers: {
        "X-User-UUID": currentUser.uuid,
      },
    });

    // The user may have switched conversations while this was loading
    if (!isSameChatId(chatId, currentChatId)) return;

    if (response.ok) {
      const messages = await response.json();
      if (!isSameChatId(chatId, currentChatId)) return;
      renderMessages(messages);
      return;
    }
    console.error("Failed to load messages");
  } catch (error) {
    console.error("Error loading messages:", error);
    if (!isSameChatId(chatId, currentChatId)) return;
  }

  renderMessagesError();
}

function resetMessages() {
  const messagesContainer = document.getElementById("messages");
  if (!messagesContainer) return null;
  messagesContainer.innerHTML = "";
  delete messagesContainer.dataset.lastDay;
  setJumpToLatest(false);
  return messagesContainer;
}

function renderMessagesLoading() {
  const messagesContainer = resetMessages();
  messagesContainer.setAttribute("aria-busy", "true");
  messagesContainer.innerHTML = `
    <div class="messages-state">
      <span class="spinner" role="status" aria-label="Loading messages"></span>
    </div>
  `;
}

function renderMessagesError() {
  const messagesContainer = resetMessages();
  messagesContainer.removeAttribute("aria-busy");
  messagesContainer.innerHTML = `
    <div class="messages-state">
      <strong>Couldn't load messages</strong>
      <span>Check your connection and try again.</span>
      <button class="btn" type="button" data-action="retry-messages">Retry</button>
    </div>
  `;
}

// Render messages
function renderMessages(messages) {
  // Limit to last 200 messages
  const limitedMessages =
    messages.length > MAX_RENDERED_MESSAGES
      ? messages.slice(-MAX_RENDERED_MESSAGES)
      : messages;
  const messagesContainer = resetMessages();
  messagesContainer.removeAttribute("aria-busy");

  if (limitedMessages.length === 0) {
    messagesContainer.innerHTML = `
      <div class="messages-state">
        <strong>No messages yet</strong>
        <span>Send a message to start the conversation.</span>
      </div>
    `;
    return;
  }

  limitedMessages.forEach((message) => {
    insertMessage(messagesContainer, message);
  });
  scrollToBottom();
}

function normalizeMessage(messageData) {
  const isSystem =
    messageData.senderUuid === "system" || messageData.isSystem === true;
  const isOwn = !isSystem && messageData.senderUuid === currentUser.uuid;

  // Ensure timestamp is properly handled
  let timestamp = messageData.timestamp || messageData.createdAt || new Date();
  if (!(timestamp instanceof Date)) {
    timestamp = new Date(timestamp);
  }
  if (isNaN(timestamp.getTime())) {
    timestamp = new Date();
  }

  return {
    content: String(messageData.content ?? ""),
    senderUuid: String(messageData.senderUuid ?? ""),
    senderUsername:
      messageData.senderUsername || (isOwn ? currentUser.username : "Unknown"),
    isSystem,
    isOwn,
    timestamp,
  };
}

// Builds one message element and appends it, grouping it with the previous
// message when both come from the same sender within a short window.
function insertMessage(
  messagesContainer,
  messageData,
  { isNew = false, isPending = false } = {},
) {
  const message = normalizeMessage(messageData);
  const time = message.timestamp.getTime();

  const state = messagesContainer.querySelector(".messages-state");
  if (state) state.remove();

  const dayKey = message.timestamp.toDateString();
  if (messagesContainer.dataset.lastDay !== dayKey) {
    const day = document.createElement("div");
    day.className = "message-day";
    day.textContent = formatDayLabel(message.timestamp);
    messagesContainer.appendChild(day);
    messagesContainer.dataset.lastDay = dayKey;
  }

  const previous = messagesContainer.lastElementChild;
  const messageElement = document.createElement("div");
  messageElement.dataset.timestamp = time;

  if (message.isSystem) {
    // System message style
    messageElement.className = "message system";
    messageElement.innerHTML = `
      <div class="message-content system-message">
        <span class="message-text">${escapeHtml(message.content)}</span><span class="message-time" data-timestamp="${time}">${formatClock(message.timestamp)}</span>
      </div>
    `;
  } else {
    const isGrouped =
      previous &&
      previous.classList.contains("message") &&
      !previous.classList.contains("system") &&
      previous.dataset.sender === message.senderUuid &&
      time - Number(previous.dataset.timestamp) < MESSAGE_GROUP_WINDOW_MS;
    const currentChat = getCurrentChat();
    // In direct messages the header already says who the other person is
    const showSender =
      !message.isOwn && (!currentChat || currentChat.type === "group");

    messageElement.dataset.sender = message.senderUuid;
    messageElement.className = [
      "message",
      message.isOwn ? "own" : "",
      isGrouped ? "" : "is-first",
      "is-last",
      isNew ? "is-new" : "",
      isPending ? "is-pending" : "",
    ]
      .filter(Boolean)
      .join(" ");

    messageElement.innerHTML = `
        ${
          showSender
            ? `<div class="message-avatar" aria-hidden="true" style="--avatar-hue: ${getAvatarHue(
                message.senderUsername,
              )}">${escapeHtml(getInitial(message.senderUsername))}</div>`
            : ""
        }
        <div class="message-content">
            ${
              showSender
                ? `<div class="message-header"><span class="message-sender">${escapeHtml(
                    message.senderUsername,
                  )}</span></div>`
                : `<span class="sr-only">${escapeHtml(
                    message.isOwn ? "You" : message.senderUsername,
                  )}:</span>`
            }
            <div class="message-bubble" title="${escapeHtml(
              message.timestamp.toLocaleString(),
            )}"><span class="message-text">${escapeHtml(message.content)}</span></div>
            <span class="message-time" data-timestamp="${time}">${formatClock(
              message.timestamp,
            )}</span>
        </div>
    `;

    if (isGrouped) previous.classList.remove("is-last");
  }

  messagesContainer.appendChild(messageElement);
  return messageElement;
}

function removeMessageElement(messageElement) {
  const messagesContainer = messageElement.parentElement;
  if (!messagesContainer) return;

  const previous = messageElement.previousElementSibling;
  messageElement.remove();

  if (previous && previous.classList.contains("message-day")) {
    previous.remove();
  } else if (
    previous &&
    previous.classList.contains("message") &&
    !previous.classList.contains("system")
  ) {
    previous.classList.add("is-last");
  }

  const last = messagesContainer.lastElementChild;
  if (last && last.dataset.timestamp) {
    messagesContainer.dataset.lastDay = new Date(
      Number(last.dataset.timestamp),
    ).toDateString();
  } else {
    delete messagesContainer.dataset.lastDay;
  }
}

// Append a new message to the chat
function appendMessage(
  messageData,
  { forceScroll = true, isPending = false } = {},
) {
  const messagesContainer = document.getElementById("messages");
  const shouldScroll = forceScroll || isNearBottom();

  // Remove oldest message if over 200
  while (
    messagesContainer.querySelectorAll(".message").length >=
    MAX_RENDERED_MESSAGES
  ) {
    messagesContainer.removeChild(messagesContainer.firstElementChild);
  }
  // A day label is only useful when a message follows it
  while (
    messagesContainer.firstElementChild &&
    messagesContainer.firstElementChild.classList.contains("message-day") &&
    messagesContainer.firstElementChild.nextElementSibling &&
    messagesContainer.firstElementChild.nextElementSibling.classList.contains(
      "message-day",
    )
  ) {
    messagesContainer.removeChild(messagesContainer.firstElementChild);
  }

  const messageElement = insertMessage(messagesContainer, messageData, {
    isNew: true,
    isPending,
  });

  if (shouldScroll) {
    scrollToBottom();
  } else {
    setJumpToLatest(true, { hasNew: true });
  }

  return messageElement;
}

// Send a message
async function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const content = messageInput.value.trim();
  const chatId = currentChatId;

  if (!content || !chatId) return;

  // Check character limit
  if (content.length > MESSAGE_MAX_LENGTH) {
    ChatSwal.fire({
      icon: "error",
      title: "Message Too Long",
      text: `Messages must be ${MESSAGE_MAX_LENGTH} characters or less.`,
    });
    return;
  }

  // Clear input immediately
  messageInput.value = "";
  drafts.delete(String(chatId));
  updateCharacterCounter(); // Update counter after clearing

  // Stop typing indicator
  stopTyping();

  // Show the message right away; it is confirmed once the server accepts it
  const pendingElement = appendMessage(
    {
      content,
      senderUuid: currentUser.uuid,
      senderUsername: currentUser.username,
      timestamp: new Date(),
    },
    { isPending: true },
  );

  const restoreMessage = () => {
    removeMessageElement(pendingElement);
    if (isSameChatId(chatId, currentChatId)) {
      // Restore message to input to allow copying
      if (!messageInput.value) messageInput.value = content;
      updateCharacterCounter();
    } else {
      drafts.set(String(chatId), content);
    }
  };

  try {
    const response = await fetch(`/api/chats/${chatId}/messages`, {
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
        chatId: chatId,
        content: content,
        senderUuid: currentUser.uuid,
        senderUsername: currentUser.username,
      });

      pendingElement.classList.remove("is-pending");

      updateChatInList(chatId, message);
    } else {
      const errorData = await response.json();

      // Handle blocked messages specially
      if (errorData.blocked) {
        restoreMessage();
        ChatSwal.fire({
          icon: "error",
          title: "Cannot Send Message",
          text: errorData.message || "Message cannot be sent due to blocking",
        });
        return;
      }

      throw new Error(errorData.error || "Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    restoreMessage();
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send message",
    });
  }
}

function saveDraft() {
  if (!currentChatId) return;
  const messageInput = document.getElementById("messageInput");
  if (!messageInput) return;

  if (messageInput.value.trim()) {
    drafts.set(String(currentChatId), messageInput.value);
  } else {
    drafts.delete(String(currentChatId));
  }
}

// Handle typing indicators
function handleTyping() {
  if (!currentChatId) return;

  if (!isTyping) {
    isTyping = true;
    typingChatId = currentChatId;
    socket.emit("typing_start", {
      chatId: currentChatId,
      senderUuid: currentUser.uuid,
    });
  }

  // Clear existing timeout
  clearTimeout(typingTimeout);

  // Set new timeout to stop typing
  typingTimeout = setTimeout(stopTyping, 1000);
}

function stopTyping() {
  clearTimeout(typingTimeout);
  if (!isTyping) return;

  isTyping = false;
  if (socket && typingChatId) {
    socket.emit("typing_stop", {
      chatId: typingChatId,
      senderUuid: currentUser.uuid,
    });
  }
  typingChatId = null;
}

// Show typing indicator
function showTypingIndicator(userUuid, isTyping) {
  if (isTyping) {
    typingUsers.add(userUuid);
  } else {
    typingUsers.delete(userUuid);
  }
  renderTypingIndicator();
}

function resetTypingIndicator() {
  typingUsers.clear();
  renderTypingIndicator();
}

function renderTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  const typingText = document.getElementById("typingText");
  const chat = getCurrentChat();

  // Get usernames for the typing users
  const names = Array.from(typingUsers).map((userUuid) => {
    const member =
      chat && chat.members
        ? chat.members.find((m) => m.uuid === userUuid)
        : null;
    return member ? member.username : "Someone";
  });

  let text = "";
  if (names.length === 1) {
    text = `${names[0]} is typing`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing`;
  } else if (names.length > 2) {
    text = "Several people are typing";
  }

  // The row keeps its height either way, so nothing shifts when it shows
  if (text) typingText.textContent = text;
  typingIndicator.classList.toggle("is-visible", Boolean(text));
  typingIndicator.setAttribute("aria-hidden", text ? "false" : "true");
}

// Create direct chat
async function createDirectChat() {
  const username = document.getElementById("directUsername").value.trim();

  if (!username) {
    document.getElementById("directUsername").focus();
    showToast("Enter a username to start a chat", "warning");
    return;
  }

  const submitButton = document.getElementById("createDirectBtn");
  submitButton.disabled = true;

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
      closeModal("newChatModal");
      document.getElementById("directUsername").value = "";

      // Reload chats and select the new one
      await loadChats();
      selectChat(data.chatId);
    } else {
      throw new Error(data.error || "Failed to create chat");
    }
  } catch (error) {
    console.error("Error creating direct chat:", error);
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    submitButton.disabled = false;
  }
}

// Create group chat
async function createGroupChat() {
  const groupName = document.getElementById("groupName").value.trim();
  const memberElements = document.querySelectorAll("#membersList .member-tag");
  const members = Array.from(memberElements).map((el) => el.dataset.username);

  if (!groupName) {
    document.getElementById("groupName").focus();
    showToast("Give the group a name first", "warning");
    return;
  }

  // Double-check member limit (should already be handled by addMemberToGroup)
  if (members.length > MAX_GROUP_OTHERS) {
    ChatSwal.fire({
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

  const submitButton = document.getElementById("createGroupBtn");
  submitButton.disabled = true;

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
      closeModal("newChatModal"); // Also resets the group form

      // Reload chats and select the new one
      await loadChats();
      selectChat(data.chatId);

      showToast("Group created", "success");
    } else {
      throw new Error(data.error || "Failed to create group");
    }
  } catch (error) {
    console.error("Error creating group chat:", error);
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    submitButton.disabled = false;
  }
}

function getGroupMemberUsernames() {
  return Array.from(
    document.querySelectorAll("#membersList .member-tag"),
    (tag) => tag.dataset.username,
  );
}

// Add member to group
function addMemberToGroup(usernameToAdd) {
  const input = document.getElementById("addMemberInput");
  const username = (
    typeof usernameToAdd === "string" ? usernameToAdd : input.value
  ).trim();

  if (!username) return;

  // Check if trying to add yourself
  if (username.toLowerCase() === currentUser.username.toLowerCase()) {
    showToast("You're already in the group as its creator", "warning");
    input.value = "";
    renderFriendPickers();
    return;
  }

  // Check if already added
  const currentMembers = getGroupMemberUsernames();
  if (
    currentMembers.some(
      (member) => member.toLowerCase() === username.toLowerCase(),
    )
  ) {
    input.value = "";
    renderFriendPickers();
    return;
  }

  // Check member limit (9 others + creator = 10 total)
  if (currentMembers.length >= MAX_GROUP_OTHERS) {
    showToast("Groups can have up to 10 people, including you", "warning");
    input.value = "";
    renderFriendPickers();
    return;
  }

  // Add member tag
  const membersList = document.getElementById("membersList");
  const memberTag = document.createElement("span");
  memberTag.className = "member-tag";
  memberTag.dataset.username = username;
  memberTag.innerHTML = `
        <span class="member-tag-name">${escapeHtml(username)}</span>
        <button class="remove" type="button" data-action="remove-member" aria-label="Remove ${escapeHtml(username)}">${icon("x")}</button>
    `;

  membersList.appendChild(memberTag);
  input.value = "";
  input.focus();

  // Update member counter
  updateMemberCounter();
}

// Remove member from group and update counter
function removeMemberFromGroup(element) {
  const memberTag = element.closest(".member-tag");
  if (memberTag) memberTag.remove();
  updateMemberCounter();
}

// Update the member counter display
function updateMemberCounter() {
  const memberCount = document.querySelectorAll(
    "#membersList .member-tag",
  ).length;
  const counterElement = document.getElementById("memberCount");
  if (counterElement) {
    // Counts the creator too: 9 others + you = 10 people
    counterElement.textContent = `${memberCount + 1} / ${MAX_GROUP_OTHERS + 1}`;
    counterElement.classList.remove("is-warning", "is-danger");

    // Change color based on limit
    if (memberCount >= MAX_GROUP_OTHERS) {
      counterElement.classList.add("is-danger");
    } else if (memberCount >= 7) {
      counterElement.classList.add("is-warning");
    }
  }

  renderFriendPickers();
}

// Friend shortcuts inside the new conversation dialog
function renderFriendPickers() {
  const directPicker = document.getElementById("directFriendPicker");
  const suggestions = document.getElementById("memberSuggestions");
  if (!directPicker || !suggestions) return;

  const directQuery = document
    .getElementById("directUsername")
    .value.trim()
    .toLowerCase();
  const directMatches = friends.filter((friend) =>
    friend.username.toLowerCase().includes(directQuery),
  );

  directPicker.innerHTML =
    directMatches.length === 0
      ? ""
      : `<div class="picker-label">Friends</div>` +
        directMatches
          .map(
            (friend) => `
        <button class="picker-item" type="button" data-action="start-chat" data-username="${escapeHtml(friend.username)}">
            ${avatarHtml(friend.username, { isOnline: Boolean(friend.isOnline) })}
            <span class="friend-info">
                <span class="friend-name"><span>${escapeHtml(friend.username)}</span></span>
                <span class="friend-meta">${friend.isOnline ? "Online" : "Offline"}</span>
            </span>
        </button>
    `,
          )
          .join("");

  const added = getGroupMemberUsernames().map((member) => member.toLowerCase());
  const memberQuery = document
    .getElementById("addMemberInput")
    .value.trim()
    .toLowerCase();
  const isFull = added.length >= MAX_GROUP_OTHERS;

  suggestions.innerHTML = isFull
    ? ""
    : friends
        .filter(
          (friend) =>
            !added.includes(friend.username.toLowerCase()) &&
            friend.username.toLowerCase().includes(memberQuery),
        )
        .slice(0, 8)
        .map(
          (friend) => `
        <button class="suggestion" type="button" data-action="add-member" data-username="${escapeHtml(friend.username)}">
            ${icon("plus")}<span class="member-tag-name">${escapeHtml(friend.username)}</span>
        </button>
    `,
        )
        .join("");
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

function formatLastSeen(lastSeen) {
  if (!lastSeen) return "Offline";
  const relative = formatTime(lastSeen);
  if (relative === "now") return "Last seen just now";
  // Older dates come back as a calendar date rather than a duration
  return /^\d+[smhd]$/.test(relative)
    ? `Last seen ${relative} ago`
    : `Last seen ${relative}`;
}

// Render friends list
function renderFriendsList() {
  const friendsList = document.getElementById("friendsList");
  const friendCount = document.getElementById("friendCount");

  friendCount.textContent = friends.length;
  friendCount.hidden = friends.length === 0;
  renderFriendPickers();

  if (friends.length === 0) {
    friendsList.innerHTML = listStateHtml(
      "No friends yet",
      "Add someone by username to get started.",
    );
    return;
  }

  friendsList.innerHTML = friends
    .map(
      (friend) => `
        <div class="friend-item">
            ${avatarHtml(friend.username, { isOnline: Boolean(friend.isOnline) })}
            <div class="friend-info">
                <div class="friend-name"><span>${escapeHtml(friend.username)}</span></div>
                <div class="friend-meta">
                    ${friend.isOnline ? "Online" : escapeHtml(formatLastSeen(friend.lastSeen))}
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn btn-sm" type="button" data-action="start-chat" data-username="${escapeHtml(friend.username)}">
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
  closeModal("friendsModal");
  closeModal("groupMembersModal");
  closeModal("newChatModal");

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
    } else {
      showToast(data.error || "Couldn't start that chat", "error");
    }
  } catch (error) {
    console.error("Error starting chat:", error);
    showToast("Couldn't start that chat", "error");
  }
}

// Send friend request
async function sendFriendRequest() {
  const username = document.getElementById("friendUsername").value.trim();

  if (!username) {
    document.getElementById("friendUsername").focus();
    showToast("Enter a username to add a friend", "warning");
    return;
  }

  const submitButton = document.getElementById("addFriendBtn");
  submitButton.disabled = true;

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
      showToast(data.message || "Friend request sent", "success");
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  } finally {
    submitButton.disabled = false;
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
      modalBadge.textContent = requests.length;
      modalBadge.hidden = requests.length === 0;

      // Update friends button notification badge
      const friendsBadge = document.getElementById("friendsNotificationBadge");
      friendsBadge.textContent = requests.length > 9 ? "9+" : requests.length;
      friendsBadge.hidden = requests.length === 0;

      const friendsBtn = document.getElementById("friendsBtn");
      const label =
        requests.length > 0
          ? `Friends, ${requests.length} pending ${requests.length === 1 ? "request" : "requests"}`
          : "Friends";
      friendsBtn.setAttribute("aria-label", label);
    }
  } catch (error) {
    console.error("Error loading friend requests:", error);
  }
}

// Render friend requests
function renderFriendRequests(requests) {
  const requestsList = document.getElementById("friendRequests");

  if (requests.length === 0) {
    requestsList.innerHTML = listStateHtml(
      "No pending requests",
      "Requests you receive show up here.",
    );
    return;
  }

  requestsList.innerHTML = requests
    .map(
      (request) => `
        <div class="request-item">
            ${avatarHtml(request.requesterUsername)}
            <div class="friend-info">
                <div class="friend-name"><span>${escapeHtml(request.requesterUsername)}</span></div>
                <div class="friend-meta">
                    ${escapeHtml(formatLastSeen(request.createdAt).replace("Last seen", "Sent"))}
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn btn-sm" type="button" data-action="reject-request" data-request-id="${escapeHtml(request.id)}">
                    Decline
                </button>
                <button class="btn btn-sm btn-primary" type="button" data-action="accept-request" data-request-id="${escapeHtml(request.id)}">
                    Accept
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
      showToast(
        action === "accept" ? "Friend added" : "Request declined",
        "success",
      );

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
    } else {
      showToast("Couldn't update that request", "error");
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
    showToast("Couldn't update that request", "error");
  }
}

// Update user status in UI
function updateUserStatus(userUuid, isOnline) {
  // Update in friends list
  const friendIndex = friends.findIndex((f) => f.uuid === userUuid);
  if (friendIndex !== -1) {
    friends[friendIndex].isOnline = isOnline;
    if (!isOnline) friends[friendIndex].lastSeen = new Date();
    renderFriendsList();
  }

  // Update in chat list
  let chatListChanged = false;
  chats.forEach((chat) => {
    chat.members.forEach((member) => {
      if (member.uuid === userUuid && member.isOnline !== isOnline) {
        member.isOnline = isOnline;
        if (chat.type === "direct") chatListChanged = true;
      }
    });
  });
  if (chatListChanged) renderChatList();

  // Update current chat if it's a direct message with this user
  const currentChat = getCurrentChat();
  if (
    currentChat &&
    currentChat.type === "direct" &&
    currentChat.members.length > 0 &&
    currentChat.members[0].uuid === userUuid
  ) {
    updateChatHeader();
  }
}

// Clear unread count for a specific chat
function clearUnreadCount(chatId) {
  const chatIndex = chats.findIndex((c) => isSameChatId(c.id, chatId));
  if (chatIndex !== -1) {
    chats[chatIndex].unreadCount = 0;

    // Update the unread badge in the UI immediately
    const chatItem = Array.from(document.querySelectorAll(".chat-item")).find(
      (item) => isSameChatId(item.dataset.chatId, chatId),
    );
    if (chatItem) {
      chatItem.classList.remove("is-unread");
      const unreadBadge = chatItem.querySelector(".unread-badge");
      if (unreadBadge) {
        unreadBadge.remove();
      }
    }
  }
}

// Update chat in list with new message
function updateChatInList(chatId, messageData) {
  const chatIndex = chats.findIndex((c) => isSameChatId(c.id, chatId));
  if (chatIndex === -1) {
    // A conversation this client has not seen yet (someone just started it)
    loadChats();
    return;
  }

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
    !isSameChatId(chatId, currentChatId) &&
    messageData.senderUuid !== currentUser.uuid
  ) {
    chats[chatIndex].unreadCount = (chats[chatIndex].unreadCount || 0) + 1;
  }

  // Move to top
  const chat = chats.splice(chatIndex, 1)[0];
  chats.unshift(chat);

  renderChatList();
}

// Filter chats based on search
function filterChats() {
  const chatList = document.getElementById("chatList");
  const searchTerm = document
    .getElementById("chatSearch")
    .value.trim()
    .toLowerCase();
  const chatItems = chatList.querySelectorAll(".chat-item");
  let visibleCount = 0;

  chatItems.forEach((item) => {
    const chatName = item
      .querySelector(".chat-item-name")
      .textContent.toLowerCase();
    const preview = item
      .querySelector(".chat-item-preview")
      .textContent.toLowerCase();
    const isMatch =
      chatName.includes(searchTerm) || preview.includes(searchTerm);

    item.hidden = !isMatch;
    if (isMatch) visibleCount++;
  });

  const existingState = chatList.querySelector(".search-empty");
  if (existingState) existingState.remove();

  if (chatItems.length > 0 && visibleCount === 0) {
    chatList.insertAdjacentHTML(
      "beforeend",
      `<div class="list-state search-empty">
        <strong>No results</strong>
        <span>Nothing matches “${escapeHtml(searchTerm)}”.</span>
      </div>`,
    );
  }
}

function createNotificationElement(title, message, type = "") {
  // Create notification container if not already present
  let container = document.getElementById("notificationContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "notificationContainer";
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const notificationElement = document.createElement("div");
  notificationElement.className = `notification${type ? ` is-${type}` : ""}`;
  notificationElement.setAttribute("role", "status");
  notificationElement.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${escapeHtml(title)}</div>
            ${message ? `<div class="notification-time">${formatTime(new Date())}</div>` : ""}
        </div>
        ${message ? `<div class="notification-message">${escapeHtml(message)}</div>` : ""}
    `;

  // Keep the stack short
  while (container.children.length >= 4) {
    container.removeChild(container.firstElementChild);
  }
  container.appendChild(notificationElement);
  return notificationElement;
}

function showNotification(title, message, onClick) {
  // Show in-page notification only (browser notifications removed)
  const notificationElement = createNotificationElement(title, message);

  if (onClick) {
    notificationElement.classList.add("is-clickable");
    notificationElement.onclick = () => {
      onClick();
      notificationElement.remove();
    };
  }

  setTimeout(() => {
    if (notificationElement.parentElement) {
      notificationElement.remove();
    }
  }, 5000);
}

// Brief confirmation that doesn't interrupt what the user is doing
function showToast(message, type = "success") {
  const toast = createNotificationElement(message, "", type);
  toast.onclick = () => toast.remove();

  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3000);
}

function autoResizeMessageInput() {
  const messageInput = document.getElementById("messageInput");
  if (!messageInput) return;
  messageInput.style.height = "auto";
  // scrollHeight is 0 while the conversation pane is hidden
  if (messageInput.scrollHeight > 0) {
    messageInput.style.height = `${messageInput.scrollHeight}px`;
  }
}

function updateCharacterCounter() {
  const messageInput = document.getElementById("messageInput");
  const charCount = document.getElementById("charCount");
  const counter = document.getElementById("characterCounter");
  const sendBtn = document.getElementById("sendBtn");

  if (messageInput && charCount && counter) {
    const currentLength = messageInput.value.length;

    // Only shown when approaching the limit
    charCount.textContent = MESSAGE_MAX_LENGTH - currentLength;
    counter.hidden = currentLength <= COUNTER_WARNING_AT;
    counter.setAttribute(
      "aria-label",
      `${MESSAGE_MAX_LENGTH - currentLength} characters left`,
    );
    counter.classList.remove("is-warning", "is-danger");

    // Change color based on character limit
    if (currentLength > COUNTER_DANGER_AT) {
      counter.classList.add("is-danger");
    } else if (currentLength > COUNTER_WARNING_AT) {
      counter.classList.add("is-warning");
    }

    if (sendBtn) {
      sendBtn.disabled = !currentChatId || !messageInput.value.trim();
    }
  }

  autoResizeMessageInput();
}

function isNearBottom(threshold = 120) {
  const container = document.getElementById("messagesContainer");
  if (!container) return true;
  return (
    container.scrollHeight - container.scrollTop - container.clientHeight <
    threshold
  );
}

function setJumpToLatest(isVisible, { hasNew = false } = {}) {
  const button = document.getElementById("jumpToLatestBtn");
  if (!button) return;

  button.hidden = !isVisible;
  if (!isVisible) {
    button.classList.remove("has-new");
  } else if (hasNew) {
    button.classList.add("has-new");
  }
  document.getElementById("jumpToLatestLabel").textContent =
    button.classList.contains("has-new") ? "New messages" : "Latest";
}

function updateJumpToLatest() {
  setJumpToLatest(!isNearBottom(240));
}

function scrollToBottom() {
  const container = document.getElementById("messagesContainer");
  if (!container) return;

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
    setJumpToLatest(false);
  }, 0);
}

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
    userInitials.textContent = getInitial(currentUser.username);
    userInitials.parentElement.style.setProperty(
      "--avatar-hue",
      getAvatarHue(currentUser.username),
    );
    userDisplayName.textContent = currentUser.username;
    userDisplayName.title = currentUser.username;
  }
}

// Copy username to clipboard
function copyUsername() {
  navigator.clipboard
    .writeText(currentUser.username)
    .then(() => {
      // Show brief feedback
      const copyBtn = document.getElementById("copyUsernameBtn");
      if (copyBtn.classList.contains("is-copied")) return;

      const originalIcon = copyBtn.innerHTML;
      copyBtn.innerHTML = icon("check");
      copyBtn.classList.add("is-copied");
      copyBtn.setAttribute("aria-label", "Username copied");

      setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
        copyBtn.classList.remove("is-copied");
        copyBtn.setAttribute("aria-label", "Copy username");
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy username:", err);
      showToast("Couldn't copy your username", "error");
    });
}

function isChatMenuOpen() {
  const dropdown = document.getElementById("chatMenuDropdown");
  return Boolean(dropdown) && dropdown.style.display !== "none";
}

function closeChatMenu({ restoreFocus = false } = {}) {
  const dropdown = document.getElementById("chatMenuDropdown");
  const menuBtn = document.getElementById("chatMenuBtn");
  if (!dropdown || !menuBtn) return;

  dropdown.style.display = "none";
  menuBtn.setAttribute("aria-expanded", "false");
  if (restoreFocus) menuBtn.focus();
}

function getVisibleMenuOptions() {
  return Array.from(
    document.querySelectorAll("#chatMenuDropdown .menu-option"),
  ).filter((option) => !option.hidden);
}

// Toggle chat menu dropdown
function toggleChatMenu(e) {
  e.stopPropagation();

  if (isChatMenuOpen()) {
    closeChatMenu();
    return;
  }

  // Update friend options based on current chat
  updateChatMenuOptions();

  document.getElementById("chatMenuDropdown").style.display = "block";
  document.getElementById("chatMenuBtn").setAttribute("aria-expanded", "true");

  // Opened from the keyboard: move focus into the menu
  if (e.detail === 0) {
    const options = getVisibleMenuOptions();
    if (options.length > 0) options[0].focus();
  }
}

function handleChatMenuKeydown(e) {
  const options = getVisibleMenuOptions();
  if (options.length === 0) return;

  const index = options.indexOf(document.activeElement);
  let nextIndex = null;

  if (e.key === "ArrowDown") {
    nextIndex = (index + 1) % options.length;
  } else if (e.key === "ArrowUp") {
    nextIndex = (index - 1 + options.length) % options.length;
  } else if (e.key === "Home") {
    nextIndex = 0;
  } else if (e.key === "End") {
    nextIndex = options.length - 1;
  } else if (e.key === "Tab") {
    closeChatMenu();
  }

  if (nextIndex !== null) {
    e.preventDefault();
    options[nextIndex].focus();
  }
}

function setChatMenuOptions(visibleOptionIds) {
  [
    "addFriendOption",
    "removeFriendOption",
    "viewMembersOption",
    "unblockUserOption",
    "blockUserOption",
    "leaveGroupOption",
  ].forEach((optionId) => {
    document.getElementById(optionId).hidden =
      !visibleOptionIds.includes(optionId);
  });

  // Destructive actions sit below a divider when other actions are present
  const dangerIds = ["blockUserOption", "leaveGroupOption"];
  const hasDanger = visibleOptionIds.some((id) => dangerIds.includes(id));
  const hasRegular = visibleOptionIds.some((id) => !dangerIds.includes(id));
  document.getElementById("chatMenuDivider").hidden = !(
    hasDanger && hasRegular
  );
}

function renderChatMenuOptions() {
  const currentChat = getCurrentChat();
  if (!currentChat) return;

  // Handle direct chats
  if (currentChat.type === "direct") {
    const otherUserUuid = currentChat.members[0]?.uuid;
    if (!otherUserUuid) {
      setChatMenuOptions([]);
      return;
    }

    // Check if already friends
    const isFriend = friends.some((f) => f.uuid === otherUserUuid);

    // Check if user is blocked
    const isBlocked = blockedUsers.some((user) => user.uuid === otherUserUuid);

    const visible = [];
    if (!isFriend && !isBlocked) visible.push("addFriendOption");
    if (isFriend && !isBlocked) visible.push("removeFriendOption");
    visible.push(isBlocked ? "unblockUserOption" : "blockUserOption");
    setChatMenuOptions(visible);
  }
  // Handle group chats
  else if (currentChat.type === "group") {
    setChatMenuOptions(["viewMembersOption", "leaveGroupOption"]);
  }
  // Default case - hide all options
  else {
    setChatMenuOptions([]);
  }
}

// Update chat menu options based on friendship status
async function updateChatMenuOptions() {
  if (!currentChatId) return;
  const chatId = currentChatId;

  // Render from what is already known, then refresh the blocked list
  renderChatMenuOptions();

  try {
    blockedUsers = await getBlockedUsers();
  } catch (error) {
    console.error("Error checking blocked status:", error);
  }

  if (isSameChatId(chatId, currentChatId)) renderChatMenuOptions();
}

// Handle add friend
async function handleAddFriend() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  closeChatMenu();

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
      showToast(data.message || "Friend request sent", "success");
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
}

// Handle remove friend
async function handleRemoveFriend() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  closeChatMenu();

  const result = await ChatSwal.fire({
    title: "Remove Friend",
    text: `Are you sure you want to remove ${otherUser.username} from your friends?`,
    icon: "warning",
    showCancelButton: true,
    ...getAlertButtonColors("danger"),
    confirmButtonText: "Yes, remove",
  });

  if (result.isConfirmed) {
    // Find the friendship and remove it
    // This would require a new API endpoint for removing friends
    // For now, show a message that this feature is coming soon
    ChatSwal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "Friend removal feature is coming soon!",
    });
  }
}

// Handle leave group
async function handleLeaveGroup() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "group") return;

  const chatId = currentChat.id;
  closeChatMenu();

  const result = await ChatSwal.fire({
    title: "Leave Group",
    text: `Are you sure you want to leave "${currentChat.name}"?`,
    icon: "warning",
    showCancelButton: true,
    ...getAlertButtonColors("danger"),
    confirmButtonText: "Yes, leave group",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      // Leave the group
      const leaveResponse = await fetch(`/api/chats/${chatId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-UUID": currentUser.uuid,
        },
      });

      if (leaveResponse.ok) {
        // Leave the socket room
        socket.emit("leave_chat", chatId);

        // Remove chat from local list
        chats = chats.filter((chat) => !isSameChatId(chat.id, chatId));
        drafts.delete(String(chatId));

        // Update UI
        renderChatList();

        // Show welcome screen and update URL
        if (isSameChatId(chatId, currentChatId)) {
          document.getElementById("messageInput").value = "";
          showChatWelcome();
        }

        showToast("You left the group", "success");
      } else {
        const errorData = await leaveResponse.json();
        throw new Error(errorData.error || "Failed to leave group");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      ChatSwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to leave group",
      });
    }
  }
}

// Handle block user
async function handleBlockUser() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  const chatId = currentChat.id;
  closeChatMenu();

  const result = await ChatSwal.fire({
    title: "Block User",
    text: `Are you sure you want to block ${otherUser.username}? You will not be able to receive messages from them.`,
    icon: "warning",
    showCancelButton: true,
    ...getAlertButtonColors("danger"),
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
        showToast("User blocked", "success");

        // Add a system message to show blocking status
        if (isSameChatId(chatId, currentChatId)) {
          appendMessage({
            chatId: chatId,
            content:
              "You blocked this user. You can no longer receive messages from them.",
            senderUuid: "system",
            senderUsername: "System",
            timestamp: new Date(),
          });
        }

        // Update UI
        loadBlockedUsers();
        updateChatMenuOptions();
      } else {
        throw new Error(data.error || "Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      ChatSwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to block user",
      });
    }
  }
}

// Handle unblock user
async function handleUnblockUser() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "direct") return;

  const otherUser = currentChat.members[0];
  if (!otherUser) return;

  const chatId = currentChat.id;
  closeChatMenu();

  const result = await ChatSwal.fire({
    title: "Unblock User",
    text: `Are you sure you want to unblock ${otherUser.username}? They will be able to send messages to you again.`,
    icon: "question",
    showCancelButton: true,
    ...getAlertButtonColors("primary"),
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
        showToast("User unblocked", "success");

        // Add a system message to show unblocking status
        if (isSameChatId(chatId, currentChatId)) {
          appendMessage({
            chatId: chatId,
            content:
              "You unblocked this user. You can now receive messages from them.",
            senderUuid: "system",
            senderUsername: "System",
            timestamp: new Date(),
          });
        }

        // Update UI
        loadBlockedUsers();
        updateChatMenuOptions();
      } else {
        throw new Error(data.error || "Failed to unblock user");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      ChatSwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to unblock user",
      });
    }
  }
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
      blockedUsers = await response.json();
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
    return blockedUsers;
  } catch (error) {
    console.error("Error getting blocked users:", error);
    return blockedUsers;
  }
}

// Render blocked users list
function renderBlockedUsers(blockedUsers) {
  const blockedList = document.getElementById("blockedUsersList");

  if (blockedUsers.length === 0) {
    blockedList.innerHTML = listStateHtml(
      "No blocked users",
      "People you block can't message you.",
    );
    return;
  }

  blockedList.innerHTML = blockedUsers
    .map(
      (user) => `
        <div class="friend-item">
            ${avatarHtml(user.username)}
            <div class="friend-info">
                <div class="friend-name"><span>${escapeHtml(user.username)}</span></div>
                <div class="friend-meta">Blocked</div>
            </div>
            <div class="friend-actions">
                <button class="btn btn-sm" type="button" data-action="unblock" data-username="${escapeHtml(user.username)}">
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
    const result = await ChatSwal.fire({
      title: "Unblock User",
      text: `Are you sure you want to unblock ${username}?`,
      icon: "question",
      showCancelButton: true,
      ...getAlertButtonColors("primary"),
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
        showToast("User unblocked", "success");

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
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "Failed to unblock user",
    });
  }
}

// Handle view members button click
async function handleViewMembers() {
  if (!currentChatId) return;

  const currentChat = getCurrentChat();
  if (!currentChat || currentChat.type !== "group") {
    return;
  }

  closeChatMenu();

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
      openModal("groupMembersModal");
    } else {
      throw new Error(data.error || "Failed to fetch group members");
    }
  } catch (error) {
    console.error("Error fetching group members:", error);
    ChatSwal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load group members. Please try again.",
    });
  }
}

// Display group members in the modal
function displayGroupMembers(members) {
  const membersList = document.getElementById("groupMembersList");
  const title = document.getElementById("groupMembersTitle");
  const currentChat = getCurrentChat();

  title.innerHTML = `Members <small>${members.length} in ${escapeHtml(
    currentChat ? currentChat.name : "this group",
  )}</small>`;

  membersList.innerHTML = members
    .map((member) => {
      const isOnline = member.status === "online";
      const isSelf = member.uuid === currentUser.uuid;

      return `
      <div class="group-member-item">
        ${avatarHtml(member.username, { isOnline, image: member.avatar })}
        <div class="member-info">
          <span class="member-username">
            <span>${escapeHtml(member.username)}</span>
            ${member.role === "admin" ? '<span class="role-badge is-admin">Admin</span>' : ""}
            ${isSelf ? '<span class="role-badge">You</span>' : ""}
          </span>
          <span class="member-status">${isOnline ? "Online" : "Offline"}</span>
        </div>
        ${
          isSelf
            ? ""
            : `<div class="friend-actions">
                <button class="btn btn-sm" type="button" data-action="start-chat" data-username="${escapeHtml(member.username)}">
                  Message
                </button>
              </div>`
        }
      </div>
    `;
    })
    .join("");
}

// Update timestamps in real-time
function updateTimestamps() {
  // Message times are clock times and don't change; chat list times are relative
  const chatTimes = document.querySelectorAll(".chat-time[data-timestamp]");
  chatTimes.forEach((element) => {
    const timestamp = parseInt(element.dataset.timestamp);
    element.textContent = formatTime(new Date(timestamp));
  });
}

// Clock time shown under messages, e.g. "10:32 PM"
function formatClock(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Label for the divider between days of messages
function formatDayLabel(date) {
  const startOfDay = (value) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const dayDiff = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86400000,
  );

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Yesterday";

  const options = { weekday: "short", month: "short", day: "numeric" };
  if (date.getFullYear() !== new Date().getFullYear()) {
    options.year = "numeric";
  }
  return date.toLocaleDateString([], options);
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
    const options = { month: "short", day: "numeric" };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }
    return date.toLocaleDateString([], options);
  }
}

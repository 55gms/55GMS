# 55GMS Chat System Setup Guide

## Overview

This chat system adds real-time messaging capabilities to your 55GMS website with features like:

- ✅ Direct messaging between users
- ✅ Group chats with member management
- ✅ Friend system with approval workflow
- ✅ Real-time message delivery via Socket.IO
- ✅ Online/offline status indicators
- ✅ Push notifications for new messages
- ✅ Message sanitization for security
- ✅ Responsive design matching your site theme

## Prerequisites

1. **PostgreSQL Database** - You need a PostgreSQL server running
2. **Node.js Dependencies** - Already installed via npm
3. **Environment Variables** - Configure your `.env` file

## Database Setup

### Step 1: Configure Environment Variables

Add the following to your `.env` file:

```env
POSTGRES_URL=postgresql://username:password@localhost:5432/your_database_name
workerAUTH=your_worker_auth_token
hcaptchaSecret=your_hcaptcha_secret
PORT=8080
```

### Step 2: Set Up Database Schema

You have two options:

#### Option A: Run the SQL script manually (Recommended)

1. Connect to your PostgreSQL database as a superuser or user with CREATE privileges
2. Run the SQL script:
   ```bash
   psql -U your_username -d your_database -f setup-database.sql
   ```

#### Option B: Let Sequelize handle it (requires proper permissions)

If your database user has CREATE TYPE and CREATE TABLE permissions:

```bash
node setup-db.js
```

## API Endpoints

### User Management

- `GET /api/friends` - Get user's friends list
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests` - Get pending friend requests
- `PUT /api/friends/:friendId` - Accept/reject friend request

### Chat Management

- `GET /api/user-chats` - Get user's chat conversations
- `POST /api/chats/direct` - Create direct message chat
- `POST /api/chats/group` - Create group chat

### Messaging

- `GET /api/chats/:chatId/messages` - Get chat messages (paginated)
- `POST /api/chats/:chatId/messages` - Send message to chat

## Socket.IO Events

### Client → Server

- `authenticate` - Authenticate user and join rooms
- `join_chat` - Join specific chat room
- `leave_chat` - Leave chat room
- `send_message` - Send message (for real-time delivery)
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `mark_read` - Mark messages as read
- `heartbeat` - Keep user online (sent automatically)

### Server → Client

- `new_message` - Receive new message
- `user_typing` - User typing indicator
- `user_status_change` - User online/offline status change
- `messages_read` - Read receipt notification
- `error` - Error message

## Features

### Real-time Messaging

Messages are delivered instantly via Socket.IO while also being stored in the database for persistence.

### Friend System

- Users can send friend requests by username
- Requests require approval before users become friends
- Friends can see each other's online status

### Group Chats

- Any user can create a group chat
- Group creator becomes admin
- Any member can add friends to the group
- Only admins can remove members

### Online Status

- Users are marked online when using any page of the website
- Heartbeat system keeps status updated
- Offline detection after 2 minutes of inactivity

### Notifications

- Browser notifications for new messages (with permission)
- In-page notification system
- Clicking notifications navigates to the chat

### Security

- All message content is sanitized with DOMPurify
- Authentication required for all endpoints
- User authorization checked for chat access

## File Structure

```
├── models/
│   ├── Chat.js              # Chat model
│   ├── Message.js           # Message model
│   ├── ChatMember.js        # Chat membership model
│   ├── Friend.js            # Friend relationship model
│   ├── UserStatus.js        # User online status model
│   └── index.js             # Model definitions and associations
├── routes/
│   └── messaging.js         # Chat API routes
├── static/
│   ├── chat.html            # Chat interface
│   └── assets/
│       ├── css/chat.css     # Chat styling
│       └── js/chat.js       # Chat functionality
├── config/
│   └── database.js          # Database connection
├── setup-database.sql       # Database schema
└── setup-db.js             # Database initialization script
```

## Usage

### Accessing Chat

- Visit `/chat` to access the main chat interface
- Direct links to specific chats: `/chat/:chatId`
- Chat button added to navigation bar

### Creating Chats

1. Click "New Chat" button
2. Choose "Direct Message" or "Group Chat"
3. For direct messages: enter username
4. For groups: enter name and add members

### Adding Friends

1. Click "Friends" button
2. Go to "Add Friend" tab
3. Enter username and send request
4. Other user must accept the request

### Message Features

- Type and press Enter to send
- Real-time typing indicators
- Message timestamps
- Online/offline status indicators

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check connection string in `.env`
- Ensure database user has proper permissions

### Socket.IO Issues

- Check browser console for connection errors
- Verify server is running on correct port
- Check firewall settings

### Authentication Issues

- Ensure user is logged in (has UUID in localStorage)
- Verify auth endpoints are working
- Check worker auth token configuration

## Integration with Existing Auth System

The chat system integrates with your existing authentication by:

1. Using UUID from localStorage for user identification
2. Calling your existing auth API endpoints for user data
3. Requiring login to access chat features

Make sure your auth system provides these endpoints:

- `GET /api/user/:uuid` - Get user by UUID
- `GET /api/user/by-username/:username` - Get user by username

## Performance Considerations

- Messages are paginated (50 per request)
- Database indexes optimize query performance
- Socket.IO rooms minimize unnecessary broadcasts
- Heartbeat system efficiently manages online status

## Security Notes

- All user input is sanitized
- Chat access is validated per user
- Socket authentication prevents impersonation
- Database uses parameterized queries

The chat system is now ready to use! Users can start messaging, adding friends, and creating group chats.

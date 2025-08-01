-- 55GMS Chat System Database Setup
-- Run this script with a PostgreSQL user that has CREATE privileges

-- Create ENUM types
CREATE TYPE chat_type AS ENUM ('direct', 'group');
CREATE TYPE friend_status AS ENUM ('pending', 'accepted', 'blocked');
CREATE TYPE member_role AS ENUM ('admin', 'member');

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    type chat_type NOT NULL DEFAULT 'direct',
    "createdBy" VARCHAR(255) NOT NULL,
    "lastActivity" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "chatId" UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    "senderUuid" VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "isEdited" BOOLEAN DEFAULT FALSE,
    "editedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_members table
CREATE TABLE IF NOT EXISTS chat_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "chatId" UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    "userUuid" VARCHAR(255) NOT NULL,
    role member_role DEFAULT 'member',
    "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastReadAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("chatId", "userUuid")
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "requesterUuid" VARCHAR(255) NOT NULL,
    "addresseeUuid" VARCHAR(255) NOT NULL,
    status friend_status DEFAULT 'pending',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("requesterUuid", "addresseeUuid")
);

-- Create user_status table
CREATE TABLE IF NOT EXISTS user_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userUuid" VARCHAR(255) NOT NULL UNIQUE,
    "isOnline" BOOLEAN DEFAULT FALSE,
    "lastSeen" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "socketId" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages("chatId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderUuid");
CREATE INDEX IF NOT EXISTS idx_chat_members_user ON chat_members("userUuid");
CREATE INDEX IF NOT EXISTS idx_friends_addressee ON friends("addresseeUuid");
CREATE INDEX IF NOT EXISTS idx_user_status_user ON user_status("userUuid");
CREATE INDEX IF NOT EXISTS idx_user_status_online ON user_status("isOnline");

-- Create triggers to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_members_updated_at BEFORE UPDATE ON chat_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON friends FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_status_updated_at BEFORE UPDATE ON user_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

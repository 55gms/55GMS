import base64
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from flask import Flask, g, jsonify, make_response, redirect, request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room

load_dotenv()

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
NODE_MODULES = ROOT / "node_modules" / "@mercuryworkshop"
DATABASE = Path(os.getenv("SQLITE_PATH", ROOT / "55gms.sqlite3"))
SESSION_COOKIE = "site_session"
DEVICE_COOKIE = "site_device"
SESSION_SECRET = os.getenv("SESSION_SECRET", "55gms-default-dev-secret-change-me").encode()

app = Flask(__name__, static_folder=None)
app.config["SECRET_KEY"] = SESSION_SECRET
socketio = SocketIO(app, cors_allowed_origins="*")


def now():
    return datetime.now(timezone.utc).isoformat()


def db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


@app.teardown_appcontext
def close_db(_error):
    connection = g.pop("db", None)
    if connection is not None:
        connection.close()


def init_db():
    connection = sqlite3.connect(DATABASE)
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash BLOB NOT NULL, premium INTEGER NOT NULL DEFAULT 0,
            admin INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,
            last_login_at TEXT, nickname TEXT
        );
        CREATE TABLE IF NOT EXISTS saves (
            user_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS chats (
            id TEXT PRIMARY KEY, name TEXT, type TEXT NOT NULL,
            creator_id TEXT NOT NULL, last_activity TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS chat_members (
            chat_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member',
            last_read_at TEXT, PRIMARY KEY (chat_id, user_id)
        );
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY, chat_id TEXT NOT NULL, sender_id TEXT NOT NULL,
            sender_username TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL,
            edited INTEGER NOT NULL DEFAULT 0, system INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS messages_chat_created ON messages(chat_id, created_at);
        CREATE TABLE IF NOT EXISTS name_requests (
            id TEXT PRIMARY KEY, requester_id TEXT NOT NULL, recipient_id TEXT NOT NULL,
            chat_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
            first_name TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS name_requests_recipient_status
            ON name_requests(recipient_id, status);
        CREATE TABLE IF NOT EXISTS friends (
            id TEXT PRIMARY KEY, requester_id TEXT NOT NULL, addressee_id TEXT NOT NULL,
            status TEXT NOT NULL, created_at TEXT NOT NULL,
            UNIQUE(requester_id, addressee_id)
        );
        CREATE TABLE IF NOT EXISTS activity_logs (
            id TEXT PRIMARY KEY, user_id TEXT NOT NULL, action TEXT NOT NULL,
            details TEXT, created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS activity_user_created ON activity_logs(user_id, created_at);
        CREATE TABLE IF NOT EXISTS device_bans (
            device_id TEXT PRIMARY KEY, banned_by TEXT NOT NULL, reason TEXT,
            created_at TEXT NOT NULL, unbanned_at TEXT
        );
        """
    )
    user_columns = {row[1] for row in connection.execute("PRAGMA table_info(users)")}
    if "nickname" not in user_columns:
        connection.execute("ALTER TABLE users ADD COLUMN nickname TEXT")
    activity_columns = {row[1] for row in connection.execute("PRAGMA table_info(activity_logs)")}
    if "device_id" not in activity_columns:
        connection.execute("ALTER TABLE activity_logs ADD COLUMN device_id TEXT")
    cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    connection.execute("DELETE FROM activity_logs WHERE created_at < ?", (cutoff,))
    connection.commit()
    connection.close()


def session_token(user):
    payload = base64.urlsafe_b64encode(json.dumps(user, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(SESSION_SECRET, payload.encode(), hashlib.sha256).digest()
    return payload + "." + base64.urlsafe_b64encode(signature).decode().rstrip("=")


def device_id():
    token = request.cookies.get(DEVICE_COOKIE, "")
    try:
        encoded_value, encoded_signature = token.split(".", 1)
        expected = hmac.new(SESSION_SECRET, encoded_value.encode(), hashlib.sha256).digest()
        supplied = base64.urlsafe_b64decode(encoded_signature + "=" * (-len(encoded_signature) % 4))
        value = base64.urlsafe_b64decode(encoded_value + "=" * (-len(encoded_value) % 4)).decode()
        if hmac.compare_digest(expected, supplied) and len(value) == 36:
            return value
    except (ValueError, TypeError, UnicodeDecodeError):
        pass
    return None


def device_token(value):
    encoded = base64.urlsafe_b64encode(value.encode()).decode().rstrip("=")
    signature = hmac.new(SESSION_SECRET, encoded.encode(), hashlib.sha256).digest()
    return encoded + "." + base64.urlsafe_b64encode(signature).decode().rstrip("=")


def current_user():
    token = request.cookies.get(SESSION_COOKIE, "")
    try:
        payload, encoded_signature = token.split(".", 1)
        expected = hmac.new(SESSION_SECRET, payload.encode(), hashlib.sha256).digest()
        supplied = base64.urlsafe_b64decode(encoded_signature + "=" * (-len(encoded_signature) % 4))
        if not hmac.compare_digest(expected, supplied):
            return None
        data = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        return data if data.get("uuid") and data.get("username") else None
    except (ValueError, json.JSONDecodeError, TypeError):
        return None


def require_auth(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        user = current_user()
        if device_is_banned():
            if request.path.startswith("/api/"):
                return jsonify(error="This device is banned"), 403
            return "This device is banned", 403
        if not user:
            if request.path.startswith("/api/"):
                return jsonify(error="Authentication required"), 401
            return redirect("/login")
        g.user = user
        return handler(*args, **kwargs)
    return wrapped


def require_admin(handler):
    @wraps(handler)
    @require_auth
    def wrapped(*args, **kwargs):
        if not g.user.get("admin"):
            return jsonify(error="Admin access required"), 403
        return handler(*args, **kwargs)
    return wrapped


def device_is_banned():
    value = device_id()
    if not value:
        return False
    return db().execute(
        "SELECT 1 FROM device_bans WHERE device_id = ? AND unbanned_at IS NULL", (value,)
    ).fetchone() is not None


def set_session(response, user):
    response.set_cookie(SESSION_COOKIE, session_token(user), httponly=True, samesite="Lax", max_age=604800, path="/")
    value = device_id() or str(uuid.uuid4())
    response.set_cookie(DEVICE_COOKIE, device_token(value), httponly=True, samesite="Lax", max_age=31536000, path="/")
    return response


def user_row(username):
    return db().execute("SELECT * FROM users WHERE username = ? COLLATE NOCASE", (username.strip(),)).fetchone()


def log_activity(user_id, action, details=None):
    db().execute(
        "INSERT INTO activity_logs (id, user_id, action, details, created_at, device_id) VALUES (?, ?, ?, ?, ?, ?)",
        (str(uuid.uuid4()), user_id, action, details, now(), device_id()),
    )


def public_user(row):
    return {"uuid": row["id"], "username": row["username"], "premium": bool(row["premium"]), "admin": bool(row["admin"])}


@app.route("/")
def index():
    if not current_user():
        return redirect("/login")
    if device_is_banned():
        return "This device is banned", 403
    log_activity(current_user()["uuid"], "page_view", "home")
    db().commit()
    return send_from_directory(STATIC, "index.html")


@app.route("/apps")
@require_auth
def apps_route():
    log_activity(g.user["uuid"], "page_view", "apps")
    db().commit()
    return send_from_directory(STATIC, "apps.html")


@app.route("/media")
@require_auth
def media_route():
    log_activity(g.user["uuid"], "page_view", "media")
    db().commit()
    return send_from_directory(STATIC, "media.html")


@app.route("/settings")
@require_auth
def settings_route():
    log_activity(g.user["uuid"], "page_view", "settings")
    db().commit()
    return send_from_directory(STATIC, "settings.html")


@app.get("/api/me")
@require_auth
def me():
    return jsonify(g.user)


@app.get("/!")
@require_auth
def proxy_page():
    return send_from_directory(STATIC, "proxy.html")


@app.get("/baremux/<path:filename>")
def baremux_asset(filename):
    return send_from_directory(NODE_MODULES / "bare-mux" / "dist", filename)


@app.get("/scram/<path:filename>")
def scramjet_asset(filename):
    return send_from_directory(NODE_MODULES / "scramjet" / "dist", filename)


@app.get("/epoxy/<path:filename>")
def epoxy_asset(filename):
    return send_from_directory(NODE_MODULES / "epoxy-transport" / "dist", filename)


@app.get("/misc/play/")
@require_auth
def game_launcher():
    link = request.args.get("link", "").strip()
    if not link or "/" in link or "\\" in link or ".." in link:
        return jsonify(error="Game not found"), 404
    launcher = STATIC / "misc" / "play" / f"{link}.html"
    if not launcher.is_file():
        return jsonify(error="Game not found"), 404
    log_activity(g.user["uuid"], "page_view", f"game_launcher:{link}")
    db().commit()
    return send_from_directory(STATIC / "misc" / "play", f"{link}.html")


@app.get("/<path:page>")
def extensionless_page(page):
    if page.startswith("api/"):
        return jsonify(error="Not found"), 404
    aliases = {"a": "apps.html", "g": "games.html", "-": "media.html", "m": "media.html", "apps": "apps.html", "media": "media.html", "settings": "settings.html", "games": "games.html"}
    if page in aliases:
        if not current_user():
            return redirect("/login")
        if device_is_banned():
            return "This device is banned", 403
        log_activity(current_user()["uuid"], "page_view", page)
        db().commit()
        return send_from_directory(STATIC, aliases[page])
    requested_file = STATIC / page
    if requested_file.is_file():
        if requested_file.parent == STATIC and requested_file.suffix == ".html" and requested_file.name not in {"login.html", "signup.html"} and not current_user():
            return redirect("/login")
        user = current_user()
        if device_is_banned() and user:
            return "This device is banned", 403
        if user and requested_file.suffix == ".html" and page.startswith("misc/"):
            query = request.query_string.decode("utf-8")
            details = f"content:{page}" + (f"?{query}" if query else "")
            log_activity(user["uuid"], "page_view", details)
            db().commit()
        return send_from_directory(STATIC, page)
    filename = STATIC / f"{page}.html"
    if filename.is_file() and "." not in Path(page).name:
        if page not in {"login", "signup"} and not current_user():
            return redirect("/login")
        return send_from_directory(STATIC, f"{page}.html")
    return jsonify(error="Not found"), 404


@app.post("/api/signUp")
@app.post("/api/signup")
def signup():
    if device_is_banned():
        return jsonify(error="This device is banned"), 403
    body = request.get_json(silent=True) or {}
    username = str(body.get("username", "")).strip()
    password = str(body.get("password", ""))
    if not username or not password:
        return jsonify(error="Not enough arguments"), 400
    if len(username) < 3:
        return jsonify(error="Username too short"), 400
    if len(password) < 6:
        return jsonify(error="Password too short"), 400
    if user_row(username):
        return jsonify(error="Username already exists"), 409
    user = {"uuid": str(uuid.uuid4()), "username": username, "premium": False, "admin": username.lower() == os.getenv("ADMIN_USERNAME", "admin").lower()}
    connection = db()
    connection.execute(
        "INSERT INTO users (id, username, password_hash, premium, admin, created_at, last_login_at, nickname) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (user["uuid"], username, bcrypt.hashpw(password.encode(), bcrypt.gensalt()), 0, int(user["admin"]), now(), None, None),
    )
    log_activity(user["uuid"], "signup")
    connection.commit()
    return set_session(make_response(jsonify(uuid=user["uuid"], username=username, premium=False)), user)


@app.post("/api/login")
def login():
    if device_is_banned():
        return jsonify(error="This device is banned"), 403
    body = request.get_json(silent=True) or {}
    row = user_row(str(body.get("username", "")))
    if not row or not bcrypt.checkpw(str(body.get("password", "")).encode(), row["password_hash"]):
        return jsonify(error="Invalid username or password"), 401
    db().execute("UPDATE users SET last_login_at = ? WHERE id = ?", (now(), row["id"]))
    log_activity(row["id"], "login")
    db().commit()
    return set_session(make_response(jsonify(uuid=row["id"], username=row["username"], premium=bool(row["premium"]))), public_user(row))


@app.get("/api/logout")
def logout():
    user = current_user()
    if user:
        log_activity(user["uuid"], "logout")
        db().commit()
    response = make_response(redirect("/"))
    response.delete_cookie(SESSION_COOKIE, path="/")
    return response


@app.post("/api/uploadSave")
@require_auth
def upload_save():
    data = request.get_data(as_text=True) or "{}"
    connection = db()
    connection.execute("INSERT INTO saves VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at", (g.user["uuid"], data, now()))
    log_activity(g.user["uuid"], "save_upload")
    connection.commit()
    return jsonify(success=True)


@app.post("/api/readSave")
@require_auth
def read_save():
    row = db().execute("SELECT data FROM saves WHERE user_id = ?", (g.user["uuid"],)).fetchone()
    if not row:
        return jsonify(error="Save not found"), 404
    try:
        return jsonify(json.loads(row["data"]))
    except json.JSONDecodeError:
        return jsonify(row["data"])


@app.get("/api/user-chats")
@require_auth
def user_chats():
    rows = db().execute(
        "SELECT c.* FROM chats c JOIN chat_members m ON m.chat_id=c.id "
        "WHERE m.user_id=? ORDER BY c.last_activity DESC",
        (g.user["uuid"],),
    ).fetchall()
    chats = []
    for row in rows:
        members = db().execute(
            "SELECT u.id, u.username FROM chat_members m "
            "JOIN users u ON u.id=m.user_id WHERE m.chat_id=? AND m.user_id<>?",
            (row["id"], g.user["uuid"]),
        ).fetchall()
        last_message = db().execute(
            "SELECT * FROM messages WHERE chat_id=? ORDER BY created_at DESC LIMIT 1",
            (row["id"],),
        ).fetchone()
        member_data = [
            {"uuid": member["id"], "username": member["username"], "isOnline": False}
            for member in members
        ]
        last_message_data = None
        if last_message:
            last_message_data = {
                "id": last_message["id"],
                "chatId": last_message["chat_id"],
                "senderUuid": last_message["sender_id"],
                "senderUsername": last_message["sender_username"],
                "content": last_message["content"],
                "createdAt": last_message["created_at"],
            }
        chats.append({
            "id": row["id"],
            "name": (member_data[0]["username"] if row["type"] == "direct" and member_data else row["name"] or "Chat"),
            "type": row["type"],
            "lastMessage": last_message_data,
            "unreadCount": 0,
            "members": member_data,
            "lastActivity": row["last_activity"],
        })
    return jsonify(chats)


@app.post("/api/chats/direct")
@require_auth
def create_direct_chat():
    body = request.get_json(silent=True) or {}
    username = str(body.get("username", "")).strip()
    other_user = user_row(username)
    if not other_user:
        return jsonify(error="User not found"), 404
    if other_user["id"] == g.user["uuid"]:
        return jsonify(error="Cannot create chat with yourself"), 400

    existing = db().execute(
        "SELECT c.id FROM chats c JOIN chat_members m ON m.chat_id=c.id "
        "WHERE c.type='direct' AND m.user_id IN (?, ?) "
        "GROUP BY c.id HAVING COUNT(DISTINCT m.user_id)=2",
        (g.user["uuid"], other_user["id"]),
    ).fetchone()
    if existing:
        return jsonify(chatId=existing["id"])

    chat_id = str(uuid.uuid4())
    timestamp = now()
    connection = db()
    connection.execute(
        "INSERT INTO chats (id, name, type, creator_id, last_activity) VALUES (?, NULL, 'direct', ?, ?)",
        (chat_id, g.user["uuid"], timestamp),
    )
    connection.executemany(
        "INSERT INTO chat_members (chat_id, user_id, role, last_read_at) VALUES (?, ?, 'member', ?)",
        [(chat_id, g.user["uuid"], timestamp), (chat_id, other_user["id"], timestamp)],
    )
    connection.commit()
    return jsonify(chatId=chat_id), 201


@app.get("/api/chats/<chat_id>/messages")
@require_auth
def get_messages(chat_id):
    member = db().execute("SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?", (chat_id, g.user["uuid"])).fetchone()
    if not member:
        return jsonify(error="Not a chat member"), 403
    limit = min(int(request.args.get("limit", 50)), 200)
    rows = db().execute("SELECT * FROM messages WHERE chat_id=? ORDER BY created_at DESC LIMIT ?", (chat_id, limit)).fetchall()
    return jsonify([
        {
            "id": row["id"],
            "chatId": row["chat_id"],
            "senderUuid": row["sender_id"],
            "senderUsername": row["sender_username"],
            "content": row["content"],
            "createdAt": row["created_at"],
            "isSystem": bool(row["system"]),
        }
        for row in reversed(rows)
    ])


@app.post("/api/chats/<chat_id>/messages")
@require_auth
def post_message(chat_id):
    body = request.get_json(silent=True) or {}
    content = str(body.get("content", "")).strip()
    member = db().execute("SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?", (chat_id, g.user["uuid"])).fetchone()
    if not member or not content:
        return jsonify(error="Invalid message"), 400
    message = {"id": str(uuid.uuid4()), "chatId": chat_id, "senderUuid": g.user["uuid"], "senderUsername": g.user["username"], "content": content, "createdAt": now()}
    db().execute("INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?, 0, 0)", (message["id"], chat_id, message["senderUuid"], message["senderUsername"], content, message["createdAt"]))
    db().execute("UPDATE chats SET last_activity=? WHERE id=?", (message["createdAt"], chat_id))
    log_activity(g.user["uuid"], "message_sent", f"chat:{chat_id}")
    db().commit()
    socketio.emit("new_message", message, to=chat_id)
    return jsonify(message), 201


@app.post("/api/name-requests")
@require_auth
def create_name_request():
    if not g.user.get("admin"):
        return jsonify(error="Only an admin can request a first name"), 403

    body = request.get_json(silent=True) or {}
    chat_id = str(body.get("chatId", "")).strip()
    recipient_id = str(body.get("recipientUuid", "")).strip()
    user_id = g.user["uuid"]

    chat = db().execute(
        "SELECT id FROM chats WHERE id=? AND type='direct'", (chat_id,)
    ).fetchone()
    requester_member = db().execute(
        "SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?",
        (chat_id, user_id),
    ).fetchone()
    recipient_member = db().execute(
        "SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?",
        (chat_id, recipient_id),
    ).fetchone()
    if not chat or not requester_member or not recipient_member or recipient_id == user_id:
        return jsonify(error="Invalid direct chat recipient"), 400

    pending = db().execute(
        "SELECT 1 FROM name_requests WHERE chat_id=? AND requester_id=? "
        "AND recipient_id=? AND status='pending'",
        (chat_id, user_id, recipient_id),
    ).fetchone()
    if pending:
        return jsonify(error="A name request is already pending"), 409

    timestamp = now()
    db().execute(
        "INSERT INTO name_requests "
        "(id, requester_id, recipient_id, chat_id, status, first_name, created_at, updated_at) "
        "VALUES (?, ?, ?, ?, 'pending', NULL, ?, ?)",
        (str(uuid.uuid4()), user_id, recipient_id, chat_id, timestamp, timestamp),
    )
    db().commit()
    return jsonify(message="Name request sent"), 201


@app.get("/api/name-requests/pending")
@require_auth
def pending_name_requests():
    rows = db().execute(
        "SELECT r.*, u.username AS requester_username FROM name_requests r "
        "LEFT JOIN users u ON u.id=r.requester_id "
        "WHERE r.recipient_id=? AND r.status='pending' ORDER BY r.created_at",
        (g.user["uuid"],),
    ).fetchall()
    return jsonify([
        {
            "id": row["id"],
            "requesterUuid": row["requester_id"],
            "recipientUuid": row["recipient_id"],
            "chatId": row["chat_id"],
            "status": row["status"],
            "requesterUsername": "Admin",
            "createdAt": row["created_at"],
        }
        for row in rows
    ])


@app.post("/api/name-requests/<request_id>/respond")
@require_auth
def answer_name_request(request_id):
    body = request.get_json(silent=True) or {}
    first_name = str(body.get("firstName", "")).strip()
    if not first_name or len(first_name) > 64:
        return jsonify(error="First name must be 1 to 64 characters"), 400

    request_row = db().execute(
        "SELECT * FROM name_requests WHERE id=? AND recipient_id=? AND status='pending'",
        (request_id, g.user["uuid"]),
    ).fetchone()
    if not request_row:
        return jsonify(error="Name request not found"), 404

    member = db().execute(
        "SELECT 1 FROM chat_members WHERE chat_id=? AND user_id=?",
        (request_row["chat_id"], g.user["uuid"]),
    ).fetchone()
    if not member:
        return jsonify(error="You are no longer in this chat"), 403

    timestamp = now()
    content = f"My first name is {first_name}."
    message = {
        "id": str(uuid.uuid4()),
        "chatId": request_row["chat_id"],
        "senderUuid": g.user["uuid"],
        "senderUsername": g.user["username"],
        "content": content,
        "createdAt": timestamp,
    }
    connection = db()
    connection.execute(
        "INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?, 0, 0)",
        (message["id"], message["chatId"], message["senderUuid"], message["senderUsername"], content, timestamp),
    )
    connection.execute(
        "UPDATE name_requests SET status='answered', first_name=?, updated_at=? WHERE id=?",
        (first_name, timestamp, request_id),
    )
    connection.execute(
        "UPDATE chats SET last_activity=? WHERE id=?", (timestamp, message["chatId"])
    )
    connection.commit()
    socketio.emit("new_message", message, to=message["chatId"])
    return jsonify(message=message)


@app.get("/api/friends")
@require_auth
def friends():
    rows = db().execute("SELECT * FROM friends WHERE (requester_id=? OR addressee_id=?) AND status='accepted'", (g.user["uuid"], g.user["uuid"])).fetchall()
    return jsonify([dict(row) for row in rows])


@app.get("/api/admin/users")
@require_admin
def admin_users():
    rows = db().execute(
        "SELECT id, username, nickname, premium, admin, created_at, last_login_at FROM users ORDER BY created_at DESC"
    ).fetchall()
    return jsonify([
        {
            "id": row["id"],
            "username": row["username"],
            "nickname": row["nickname"],
            "premium": bool(row["premium"]),
            "admin": bool(row["admin"]),
            "createdAt": row["created_at"],
            "lastLoginAt": row["last_login_at"],
        }
        for row in rows
    ])


@app.patch("/api/admin/users/<user_id>/nickname")
@require_admin
def update_admin_nickname(user_id):
    body = request.get_json(silent=True) or {}
    nickname = body.get("nickname", "")
    if not isinstance(nickname, str):
        return jsonify(error="Nickname must be text"), 400
    nickname = nickname.strip()
    if len(nickname) > 64:
        return jsonify(error="Nickname must be 64 characters or fewer"), 400
    if not db().execute("SELECT 1 FROM users WHERE id = ?", (user_id,)).fetchone():
        return jsonify(error="User not found"), 404
    db().execute("UPDATE users SET nickname = ? WHERE id = ?", (nickname or None, user_id))
    db().commit()
    return jsonify(id=user_id, nickname=nickname or None)


@app.get("/api/admin/activity")
@require_admin
def admin_activity():
    rows = db().execute(
        """
         SELECT activity_logs.id, activity_logs.action, activity_logs.details,
             activity_logs.created_at, activity_logs.user_id, activity_logs.device_id, users.username
        FROM activity_logs JOIN users ON users.id = activity_logs.user_id
        ORDER BY activity_logs.created_at DESC LIMIT 500
        """
    ).fetchall()
    return jsonify([
        {
            "id": row["id"],
            "userId": row["user_id"],
            "username": row["username"],
            "action": row["action"],
            "details": row["details"],
            "createdAt": row["created_at"],
            "deviceId": row["device_id"],
        }
        for row in rows
    ])


@app.get("/api/admin/device-bans")
@require_admin
def device_bans():
    rows = db().execute(
        "SELECT device_id, reason, created_at, unbanned_at FROM device_bans ORDER BY created_at DESC"
    ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/admin/device-bans")
@require_admin
def ban_device():
    body = request.get_json(silent=True) or {}
    target = str(body.get("deviceId", "")).strip()
    if len(target) != 36:
        return jsonify(error="Invalid device ID"), 400
    reason = str(body.get("reason", "")).strip()[:200] or None
    db().execute(
        "INSERT INTO device_bans (device_id, banned_by, reason, created_at, unbanned_at) VALUES (?, ?, ?, ?, NULL) "
        "ON CONFLICT(device_id) DO UPDATE SET banned_by=excluded.banned_by, reason=excluded.reason, created_at=excluded.created_at, unbanned_at=NULL",
        (target, g.user["uuid"], reason, now()),
    )
    log_activity(g.user["uuid"], "device_banned", f"device:{target}" + (f" reason:{reason}" if reason else ""))
    db().commit()
    return jsonify(success=True)


@app.delete("/api/admin/device-bans/<device_id>")
@require_admin
def unban_device(device_id):
    db().execute(
        "UPDATE device_bans SET unbanned_at = ? WHERE device_id = ? AND unbanned_at IS NULL",
        (now(), device_id),
    )
    log_activity(g.user["uuid"], "device_unbanned", f"device:{device_id}")
    db().commit()
    return jsonify(success=True)


@app.route("/chat", defaults={"chat_id": None})
@app.route("/chat/<chat_id>")
@require_auth
def chat_page(chat_id):
    return send_from_directory(STATIC, "chat.html")


@app.route("/profile")
@require_auth
def profile_page():
    return send_from_directory(STATIC, "account.html")


@app.route("/s")
@require_auth
def settings_page():
    return send_from_directory(STATIC, "settings.html")


@app.route("/d")
@require_auth
def dashboard_page():
    return send_from_directory(STATIC, "dashboard.html")


@app.route("/c")
@require_auth
def chat_short_page():
    return send_from_directory(STATIC, "chat.html")


@app.route("/admin")
@require_admin
def admin_page():
    return send_from_directory(STATIC, "admin.html")


@socketio.on("authenticate")
def socket_auth(data):
    user = current_user()
    if not user or data.get("uuid") != user["uuid"]:
        emit("error", "Authentication required")
        return
    join_room(user["uuid"])
    emit("authenticated", {"uuid": user["uuid"]})


@socketio.on("join_chat")
def socket_join(chat_id):
    join_room(str(chat_id))


@socketio.on("leave_chat")
def socket_leave(chat_id):
    leave_room(str(chat_id))


if __name__ == "__main__":
    init_db()
    socketio.run(app, host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5000")), allow_unsafe_werkzeug=True)

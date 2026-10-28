from __future__ import annotations

import argparse
import base64
import binascii
import hashlib
import hmac
import json
import os
import secrets
import smtplib
import sqlite3
import ssl
from contextlib import closing
from datetime import date, datetime, timedelta, timezone
from email.message import EmailMessage
from http.cookies import CookieError, SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlencode, unquote, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "learning_progress.sqlite3"
TOPICS = {
	"syntax",
	"variables",
	"data-types",
	"input-output",
	"conditionals",
	"lists",
	"loops",
	"functions",
}
PASSWORD_ROUNDS = 310_000
SESSION_DAYS = 30
CONFIRMATION_MINUTES = 30


def application_url() -> str:
	return os.environ.get("APP_BASE_URL", "http://localhost:8000").rstrip("/")


def connect_database() -> sqlite3.Connection:
	connection = sqlite3.connect(DATABASE, timeout=10)
	connection.row_factory = sqlite3.Row
	connection.execute("PRAGMA foreign_keys=ON")
	connection.execute("PRAGMA journal_mode=WAL")
	return connection


def initialize_database() -> None:
	with closing(connect_database()) as connection:
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS attempts (
				id INTEGER PRIMARY KEY,
				topic TEXT NOT NULL,
				question_id TEXT NOT NULL,
				correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
				answered_at TEXT NOT NULL DEFAULT (datetime('now')),
				user_id INTEGER REFERENCES users(id)
			)
			"""
		)
		columns = {
			row["name"]
			for row in connection.execute("PRAGMA table_info(attempts)")
		}
		if "user_id" not in columns:
			connection.execute(
				"ALTER TABLE attempts ADD COLUMN user_id INTEGER REFERENCES users(id)"
			)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY,
				email TEXT NOT NULL UNIQUE COLLATE NOCASE,
				display_name TEXT NOT NULL,
				password_hash TEXT,
				email_verified INTEGER NOT NULL DEFAULT 0,
				course_phase TEXT NOT NULL DEFAULT 'plan',
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
			"""
		)
		user_columns = {
			row["name"] for row in connection.execute("PRAGMA table_info(users)")
		}
		if "course_phase" not in user_columns:
			connection.execute(
				"ALTER TABLE users ADD COLUMN course_phase TEXT NOT NULL DEFAULT 'plan'"
			)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS sessions (
				token_hash TEXT PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				expires_at TEXT NOT NULL
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS email_tokens (
				token_hash TEXT PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				expires_at TEXT NOT NULL
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS google_states (
				state_hash TEXT PRIMARY KEY,
				expires_at TEXT NOT NULL
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS app_settings (
				key TEXT PRIMARY KEY,
				value TEXT NOT NULL
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS auth_rate_limits (
				id INTEGER PRIMARY KEY,
				address TEXT NOT NULL,
				action TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS topic_completions (
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				topic TEXT NOT NULL,
				completed_at TEXT NOT NULL DEFAULT (datetime('now')),
				PRIMARY KEY (user_id, topic)
			)
			"""
		)
		connection.execute(
			"""
			CREATE TABLE IF NOT EXISTS topic_phases (
				user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				topic TEXT NOT NULL,
				phase TEXT NOT NULL CHECK (phase IN ('plan', 'perform', 'reflect')),
				PRIMARY KEY (user_id, topic)
			)
			"""
		)
		connection.execute(
			"CREATE INDEX IF NOT EXISTS attempts_user_topic_date "
			"ON attempts(user_id, topic, answered_at)"
		)
		connection.execute(
			"CREATE INDEX IF NOT EXISTS auth_rate_limits_lookup "
			"ON auth_rate_limits(address, action, created_at)"
		)
		connection.commit()


def token_digest(token: str) -> str:
	return hashlib.sha256(token.encode("utf-8")).hexdigest()


def registration_signing_key() -> bytes:
	with closing(connect_database()) as connection:
		connection.execute(
			"INSERT OR IGNORE INTO app_settings(key, value) VALUES (?, ?)",
			("registration_signing_key", secrets.token_hex(32)),
		)
		connection.commit()
		row = connection.execute(
			"SELECT value FROM app_settings WHERE key = ?",
			("registration_signing_key",),
		).fetchone()
	if not row:
		raise RuntimeError("Could not load the registration signing key.")
	return bytes.fromhex(row["value"])


def sign_registration(data: dict) -> str:
	encoded = base64.urlsafe_b64encode(
		json.dumps(data, separators=(",", ":")).encode("utf-8")
	).decode("ascii").rstrip("=")
	signature = hmac.new(
		registration_signing_key(), encoded.encode("ascii"), hashlib.sha256
	).hexdigest()
	return f"{encoded}.{signature}"


def read_signed_registration(token: str) -> dict | None:
	if not token or not token.isascii() or len(token) > 2048 or token.count(".") != 1:
		return None
	encoded, signature = token.split(".", 1)
	expected = hmac.new(
		registration_signing_key(), encoded.encode("ascii"), hashlib.sha256
	).hexdigest()
	if not hmac.compare_digest(signature, expected):
		return None
	try:
		padding = "=" * (-len(encoded) % 4)
		data = json.loads(
			base64.urlsafe_b64decode(encoded + padding).decode("utf-8")
		)
	except (ValueError, TypeError, UnicodeDecodeError, binascii.Error):
		return None
	if (
		not isinstance(data, dict)
		or not isinstance(data.get("email"), str)
		or not isinstance(data.get("name"), str)
		or not isinstance(data.get("password_hash"), str)
		or not isinstance(data.get("code_hash"), str)
		or not isinstance(data.get("expires"), int)
		or data["expires"] <= int(datetime.now(timezone.utc).timestamp())
	):
		return None
	return data


def create_confirmation(email: str, name: str, password_hash: str) -> tuple[str, str]:
	code = f"{secrets.randbelow(1_000_000):06d}"
	expires = int(
		(datetime.now(timezone.utc) + timedelta(minutes=CONFIRMATION_MINUTES)).timestamp()
	)
	token = sign_registration(
		{
			"email": email,
			"name": name,
			"password_hash": password_hash,
			"code_hash": token_digest(code),
			"expires": expires,
		}
	)
	return code, token


def make_password_hash(password: str) -> str:
	salt = secrets.token_bytes(16)
	derived = hashlib.pbkdf2_hmac(
		"sha256", password.encode("utf-8"), salt, PASSWORD_ROUNDS
	)
	return f"pbkdf2_sha256${PASSWORD_ROUNDS}${salt.hex()}${derived.hex()}"


def verify_password(password: str, stored_hash: str | None) -> bool:
	if not stored_hash:
		return False
	try:
		algorithm, rounds_text, salt_text, digest_text = stored_hash.split("$")
		if algorithm != "pbkdf2_sha256":
			return False
		derived = hashlib.pbkdf2_hmac(
			"sha256",
			password.encode("utf-8"),
			bytes.fromhex(salt_text),
			int(rounds_text),
		)
		return hmac.compare_digest(derived.hex(), digest_text)
	except (ValueError, TypeError):
		return False


def read_progress(user_id: int) -> dict:
	with closing(connect_database()) as connection:
		totals = connection.execute(
			"SELECT COUNT(*) AS answered, COALESCE(SUM(correct), 0) AS correct "
			"FROM attempts WHERE user_id = ?",
			(user_id,),
		).fetchone()
		rows = connection.execute(
			"SELECT topic, COUNT(*) AS answered, COALESCE(SUM(correct), 0) AS correct "
			"FROM attempts WHERE user_id = ? GROUP BY topic",
			(user_id,),
		).fetchall()
		dates = [
			row[0]
			for row in connection.execute(
				"SELECT DISTINCT date(answered_at) FROM attempts "
				"WHERE user_id = ? ORDER BY date(answered_at) DESC",
				(user_id,),
			).fetchall()
		]
		missed = connection.execute(
			"""
			SELECT topic, question_id
			FROM attempts AS attempt
			WHERE user_id = ? AND correct = 0
				AND id = (
					SELECT latest.id
					FROM attempts AS latest
					WHERE latest.user_id = attempt.user_id
						AND latest.topic = attempt.topic
						AND latest.question_id = attempt.question_id
					ORDER BY latest.id DESC
					LIMIT 1
				)
			ORDER BY id DESC
			LIMIT 100
			""",
			(user_id,),
		).fetchall()
		completed = [
			row["topic"]
			for row in connection.execute(
				"SELECT topic FROM topic_completions WHERE user_id = ?",
				(user_id,),
			).fetchall()
		]
		user_row = connection.execute(
			"SELECT course_phase FROM users WHERE id = ?",
			(user_id,),
		).fetchone()
		phases = {
			row["topic"]: row["phase"]
			for row in connection.execute(
				"SELECT topic, phase FROM topic_phases WHERE user_id = ?",
				(user_id,),
			).fetchall()
		}

	by_topic = {topic: {"answered": 0, "correct": 0} for topic in sorted(TOPICS)}
	for row in rows:
		by_topic[row["topic"]] = {
			"answered": row["answered"],
			"correct": row["correct"],
		}

	current_date = datetime.now(timezone.utc).date()
	streak = 0
	best_streak = 0
	if dates:
		latest = date.fromisoformat(dates[0])
		if latest >= current_date - timedelta(days=1):
			expected = latest
			for day in dates:
				current = date.fromisoformat(day)
				if current != expected:
					break
				streak += 1
				expected -= timedelta(days=1)
		previous = None
		run_length = 0
		for day in dates:
			current = date.fromisoformat(day)
			if previous and previous - current == timedelta(days=1):
				run_length += 1
			else:
				run_length = 1
			best_streak = max(best_streak, run_length)
			previous = current

	answered = totals["answered"]
	correct = totals["correct"]
	badges = []
	if answered:
		badges.append("first-step")
	if correct >= 5:
		badges.append("sharp-mind")
	if best_streak >= 3:
		badges.append("daily-practice")
	if all(by_topic[topic]["correct"] > 0 for topic in TOPICS):
		badges.append("syntax-scout")

	return {
		"answered": answered,
		"correct": correct,
		"accuracy": round(correct / answered * 100) if answered else 0,
		"streak": streak,
		"activeDays": len(dates),
		"badges": badges,
		"topics": by_topic,
		"completedTopics": completed,
		"coursePhase": user_row["course_phase"] if user_row else "plan",
		"topicPhases": phases,
		"missed": [
			{"topic": row["topic"], "questionId": row["question_id"]}
			for row in missed
		],
	}


def send_verification_email(email: str, display_name: str, code: str) -> None:
	host = os.environ.get("SMTP_HOST")
	sender = os.environ.get("SMTP_FROM")
	if not host or not sender:
		raise RuntimeError("Email verification is not configured on this server.")
	port = int(os.environ.get("SMTP_PORT", "465" if os.environ.get("SMTP_USE_SSL") == "1" else "587"))
	message = EmailMessage()
	message["Subject"] = "Confirm your Group2 Studio account"
	message["From"] = sender
	message["To"] = email
	message.set_content(
		f"Hello {display_name},\n\n"
		f"Enter this confirmation code to finish creating your account: {code}\n\n"
		f"This code expires in {CONFIRMATION_MINUTES} minutes. If you did not create "
		"this account, you can ignore this email."
	)
	context = ssl.create_default_context()
	if os.environ.get("SMTP_USE_SSL") == "1":
		with smtplib.SMTP_SSL(host, port, context=context, timeout=20) as server:
			smtp_login(server)
			server.send_message(message)
	else:
		with smtplib.SMTP(host, port, timeout=20) as server:
			server.ehlo()
			server.starttls(context=context)
			server.ehlo()
			smtp_login(server)
			server.send_message(message)


def smtp_login(server: smtplib.SMTP | smtplib.SMTP_SSL) -> None:
	username = os.environ.get("SMTP_USER")
	password = os.environ.get("SMTP_PASSWORD")
	if username:
		server.login(username, password or "")


class LearningHandler(BaseHTTPRequestHandler):
	server_version = "SRLStudio/1.0"

	def do_GET(self) -> None:
		parsed = urlparse(self.path)
		if parsed.path == "/favicon.ico":
			self.send_response(204)
			self.end_headers()
			return
		if parsed.path == "/api/auth/session":
			user = self.current_user()
			self.send_json(
				200,
				{"user": self.public_user(user)} if user else {"user": None},
			)
			return
		if parsed.path == "/api/auth/registration-status":
			self.send_json(
				200,
				{"pending": self.pending_registration() is not None},
			)
			return
		if parsed.path == "/api/auth/confirm":
			self.confirm_email(parsed.query)
			return
		if parsed.path == "/auth/google/start":
			self.start_google_login()
			return
		if parsed.path == "/auth/google/callback":
			self.finish_google_login(parsed.query)
			return
		if parsed.path == "/api/state":
			user = self.current_user()
			if not user:
				self.send_json(401, {"error": "Please log in to view progress."})
				return
			self.send_json(200, read_progress(user["id"]))
			return
		if parsed.path == "/api/health":
			self.send_json(200, {"ok": True})
			return
		self.serve_static(parsed.path)

	def do_POST(self) -> None:
		path = urlparse(self.path).path
		if not self.valid_origin():
			self.send_json(403, {"error": "Request origin is not allowed."})
			return
		if path == "/api/auth/register":
			self.register()
		elif path == "/api/auth/resend":
			self.resend_confirmation()
		elif path == "/api/auth/confirm":
			self.confirm_registration()
		elif path == "/api/auth/login":
			self.login()
		elif path == "/api/auth/logout":
			self.logout()
		elif path == "/api/answer":
			self.save_answer()
		elif path == "/api/complete":
			self.complete_topics()
		elif path == "/api/phase":
			self.update_phase()
		else:
			self.send_json(404, {"error": "Not found"})

	def read_payload(self) -> dict:
		length = int(self.headers.get("Content-Length", "0"))
		if length <= 0 or length > 10_000:
			raise ValueError("Request body is missing or too large")
		payload = json.loads(self.rfile.read(length))
		if not isinstance(payload, dict):
			raise ValueError("Request body must be a JSON object")
		return payload

	def current_user(self) -> sqlite3.Row | None:
		cookie = SimpleCookie()
		try:
			cookie.load(self.headers.get("Cookie", ""))
		except Exception:
			return None
		session = cookie.get("srl_session")
		if not session:
			return None
		with closing(connect_database()) as connection:
			return connection.execute(
				"""
				SELECT users.id, users.email, users.display_name,
					users.email_verified
				FROM sessions JOIN users ON users.id = sessions.user_id
				WHERE sessions.token_hash = ? AND sessions.expires_at > ?
					AND users.email_verified = 1
				""",
				(token_digest(session.value), datetime.now(timezone.utc).isoformat()),
			).fetchone()

	def pending_registration(self) -> dict | None:
		cookie = SimpleCookie()
		try:
			cookie.load(self.headers.get("Cookie", ""))
		except CookieError:
			return None
		pending = cookie.get("registration_pending")
		return read_signed_registration(pending.value) if pending else None

	def set_registration_cookie(self, token: str) -> None:
		cookie = (
			f"registration_pending={token}; HttpOnly; Path=/api/auth; "
			f"SameSite=Lax; Max-Age={CONFIRMATION_MINUTES * 60}"
		)
		if application_url().startswith("https://"):
			cookie += "; Secure"
		self.registration_cookie = cookie

	def clear_registration_cookie(self) -> None:
		self.registration_cookie = (
			"registration_pending=; HttpOnly; Path=/api/auth; "
			"SameSite=Lax; Max-Age=0"
			+ ("; Secure" if application_url().startswith("https://") else "")
		)

	@staticmethod
	def public_user(user: sqlite3.Row) -> dict:
		return {
			"id": user["id"],
			"email": user["email"],
			"name": user["display_name"],
			"emailVerified": bool(user["email_verified"]),
		}

	def valid_origin(self) -> bool:
		origin = self.headers.get("Origin")
		if not origin:
			return True
		origin_url = urlparse(origin)
		origin_host = origin_url.netloc.lower()
		request_host = self.headers.get("Host", "").lower()
		default_port = ":80" if origin_url.scheme == "http" else ":443"
		if origin_host.endswith(default_port):
			origin_host = origin_host[: -len(default_port)]
		if request_host.endswith(default_port):
			request_host = request_host[: -len(default_port)]
		return origin_url.scheme in {"http", "https"} and origin_host == request_host

	def rate_limited(
		self, action: str, limit: int, window_minutes: int, record: bool = False
	) -> bool:
		address = self.client_address[0]
		now = datetime.now(timezone.utc)
		cutoff = (now - timedelta(minutes=window_minutes)).isoformat()
		with closing(connect_database()) as connection:
			connection.execute(
				"DELETE FROM auth_rate_limits WHERE created_at <= ?",
				((now - timedelta(days=1)).isoformat(),),
			)
			count = connection.execute(
				"""
				SELECT COUNT(*) FROM auth_rate_limits
				WHERE address = ? AND action = ? AND created_at > ?
				""",
				(address, action, cutoff),
			).fetchone()[0]
			if record and count < limit:
				connection.execute(
					"INSERT INTO auth_rate_limits(address, action, created_at) VALUES (?, ?, ?)",
					(address, action, now.isoformat()),
				)
				connection.commit()
		return count >= limit

	def set_session(self, user_id: int) -> None:
		raw_token = secrets.token_urlsafe(32)
		expires = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
		with closing(connect_database()) as connection:
			connection.execute(
				"INSERT INTO sessions(token_hash, user_id, expires_at) VALUES (?, ?, ?)",
				(token_digest(raw_token), user_id, expires.isoformat()),
			)
			connection.commit()
		cookie = (
			f"srl_session={raw_token}; HttpOnly; Path=/; SameSite=Lax; "
			f"Max-Age={SESSION_DAYS * 24 * 60 * 60}"
		)
		if application_url().startswith("https://"):
			cookie += "; Secure"
		self.pending_cookie = cookie

	def register(self) -> None:
		if self.rate_limited("register", 5, 60, record=True):
			self.send_json(429, {"error": "Too many sign-up attempts. Please try again later."})
			return
		try:
			payload = self.read_payload()
			name = payload.get("name")
			email = payload.get("email")
			password = payload.get("password")
			if not isinstance(name, str) or not name.strip() or len(name) > 80:
				raise ValueError("Enter a name of 1 to 80 characters.")
			if (
				not isinstance(email, str)
				or len(email) > 254
				or email.count("@") != 1
				or any(character.isspace() for character in email)
				or not all(email.split("@"))
			):
				raise ValueError("Enter a valid email address.")
			if not isinstance(password, str) or not 12 <= len(password) <= 256:
				raise ValueError("Choose a password between 12 and 256 characters.")
			email = email.strip().lower()
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return

		try:
			with closing(connect_database()) as connection:
				existing_user = connection.execute(
					"SELECT email_verified FROM users WHERE email = ? COLLATE NOCASE",
					(email,),
				).fetchone()
			if existing_user:
				message = (
					"A pending account already exists. Resend its confirmation code."
					if not existing_user["email_verified"]
					else "An account with that email already exists."
				)
				self.send_json(409, {"error": message})
				return
			password_hash = make_password_hash(password)
			code, token = create_confirmation(email, name.strip(), password_hash)
			send_verification_email(email, name.strip(), code)
		except (OSError, RuntimeError, smtplib.SMTPException, ValueError) as error:
			print(f"Verification email could not be sent: {error}")
			self.send_json(
				503,
				{
					"error": "The confirmation email could not be sent. Check the server email settings and try registering again."
				},
			)
			return
		self.set_registration_cookie(token)
		self.send_json(
			202,
			{"message": "Enter the 6-digit code sent to your email to finish creating your account."},
		)

	def confirm_email(self, query: str) -> None:
		from urllib.parse import parse_qs

		token = parse_qs(query).get("token", [""])[0]
		if not token or len(token) > 200:
			self.send_json(400, {"error": "The confirmation link is invalid."})
			return
		with closing(connect_database()) as connection:
			record = connection.execute(
				"SELECT user_id FROM email_tokens WHERE token_hash = ? AND expires_at > ?",
				(token_digest(token), datetime.now(timezone.utc).isoformat()),
			).fetchone()
			if not record:
				self.send_json(400, {"error": "The confirmation link is invalid or expired."})
				return
			connection.execute(
				"UPDATE users SET email_verified = 1 WHERE id = ?",
				(record["user_id"],),
			)
			connection.execute(
				"DELETE FROM email_tokens WHERE user_id = ?",
				(record["user_id"],),
			)
			connection.commit()
		self.send_json(200, {"message": "Email confirmed. You can now log in."})

	def confirm_registration(self) -> None:
		if self.rate_limited("confirm", 10, 15, record=True):
			self.send_json(429, {"error": "Too many confirmation attempts. Please try again later."})
			return
		try:
			payload = self.read_payload()
			code = payload.get("code")
			if not isinstance(code, str) or len(code) != 6 or not code.isdigit():
				raise ValueError("Enter the 6-digit code from your email.")
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return

		pending = self.pending_registration()
		if not pending:
			self.clear_registration_cookie()
			self.send_json(
				400,
				{"error": "This confirmation has expired. Please start registration again."},
			)
			return
		if not hmac.compare_digest(token_digest(code), pending["code_hash"]):
			self.send_json(400, {"error": "That confirmation code is incorrect."})
			return

		try:
			with closing(connect_database()) as connection:
				user = connection.execute(
					"SELECT id, email_verified, password_hash FROM users "
					"WHERE email = ? COLLATE NOCASE",
					(pending["email"],),
				).fetchone()
				if user:
					if user["email_verified"]:
						self.clear_registration_cookie()
						self.send_json(409, {"error": "An account with that email already exists."})
						return
					if not hmac.compare_digest(
						user["password_hash"] or "", pending["password_hash"]
					):
						self.send_json(
							409,
							{"error": "A pending account already exists. Use its confirmation email."},
						)
						return
					user_id = user["id"]
					connection.execute(
						"UPDATE users SET email_verified = 1 WHERE id = ?",
						(user_id,),
					)
				else:
					first_user = connection.execute(
						"SELECT COUNT(*) FROM users"
					).fetchone()[0] == 0
					user_id = connection.execute(
						"""
						INSERT INTO users(email, display_name, password_hash, email_verified)
						VALUES (?, ?, ?, 1)
						""",
						(
							pending["email"],
							pending["name"],
							pending["password_hash"],
						),
					).lastrowid
					if first_user:
						connection.execute(
							"UPDATE attempts SET user_id = ? WHERE user_id IS NULL",
							(user_id,),
						)
				connection.commit()
		except sqlite3.IntegrityError:
			self.send_json(409, {"error": "An account with that email already exists."})
			return
		self.clear_registration_cookie()
		self.send_json(200, {"message": "Email confirmed. You can now log in."})

	def resend_confirmation(self) -> None:
		if self.rate_limited("resend", 3, 60, record=True):
			self.send_json(429, {"error": "Too many confirmation requests. Please try again later."})
			return
		try:
			payload = self.read_payload()
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return
		pending = self.pending_registration()
		if pending:
			email = pending["email"]
			name = pending["name"]
			password_hash = pending["password_hash"]
		else:
			email = payload.get("email")
			if not isinstance(email, str) or len(email) > 254:
				self.send_json(400, {"error": "Enter a valid email address."})
				return
			email = email.strip().lower()
			with closing(connect_database()) as connection:
				user = connection.execute(
					"SELECT email, display_name, password_hash, email_verified FROM users "
					"WHERE email = ? COLLATE NOCASE",
					(email,),
				).fetchone()
			if not user or user["email_verified"] or not user["password_hash"]:
				self.send_json(
					200,
					{"message": "If a pending account exists, a new confirmation code has been sent."},
				)
				return
			email = user["email"]
			name = user["display_name"]
			password_hash = user["password_hash"]
		code, token = create_confirmation(email, name, password_hash)
		try:
			send_verification_email(email, name, code)
		except (OSError, RuntimeError, smtplib.SMTPException, ValueError) as error:
			print(f"Verification email could not be resent: {error}")
			self.send_json(503, {"error": "The confirmation email could not be sent. Check the server email settings."})
			return
		self.set_registration_cookie(token)
		self.send_json(
			200,
			{"message": "A new confirmation code has been sent to your email."},
		)

	def login(self) -> None:
		if self.rate_limited("login", 5, 15):
			self.send_json(429, {"error": "Too many sign-in attempts. Please wait 15 minutes and try again."})
			return
		try:
			payload = self.read_payload()
			email = payload.get("email")
			password = payload.get("password")
			if (
				not isinstance(email, str)
				or not isinstance(password, str)
				or not 1 <= len(password) <= 256
				or len(email) > 254
			):
				raise ValueError("Enter your email and password.")
			with closing(connect_database()) as connection:
				user = connection.execute(
					"SELECT * FROM users WHERE email = ? COLLATE NOCASE",
					(email.strip(),),
				).fetchone()
			if not user or not verify_password(password, user["password_hash"]):
				self.rate_limited("login", 5, 15, record=True)
				self.send_json(401, {"error": "Email or password is incorrect."})
				return
			if not user["email_verified"]:
				self.rate_limited("login", 5, 15, record=True)
				self.send_json(
					403,
					{"error": "Please confirm your email using the code we sent you."},
				)
				return
			with closing(connect_database()) as connection:
				connection.execute(
					"DELETE FROM auth_rate_limits WHERE address = ? AND action = 'login'",
					(self.client_address[0],),
				)
				connection.commit()
			self.set_session(user["id"])
			self.send_json(200, {"user": self.public_user(user)})
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})

	def logout(self) -> None:
		cookie = SimpleCookie()
		try:
			cookie.load(self.headers.get("Cookie", ""))
		except Exception:
			cookie = SimpleCookie()
		session = cookie.get("srl_session")
		if session:
			with closing(connect_database()) as connection:
				connection.execute(
					"DELETE FROM sessions WHERE token_hash = ?",
					(token_digest(session.value),),
				)
				connection.commit()
		self.pending_cookie = (
			"srl_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
			+ ("; Secure" if application_url().startswith("https://") else "")
		)
		self.send_json(200, {"ok": True})

	def start_google_login(self) -> None:
		client_id = os.environ.get("GOOGLE_CLIENT_ID")
		client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
		if not client_id or not client_secret:
			self.send_error_page(
				"Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
			)
			return
		if self.rate_limited("google", 20, 60, record=True):
			self.send_error_page("Too many Google sign-in requests. Please try again later.")
			return
		state = secrets.token_urlsafe(32)
		with closing(connect_database()) as connection:
			connection.execute(
				"DELETE FROM google_states WHERE expires_at <= ?",
				(datetime.now(timezone.utc).isoformat(),),
			)
			connection.execute(
				"INSERT INTO google_states(state_hash, expires_at) VALUES (?, ?)",
				(
					token_digest(state),
					(datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat(),
				),
			)
			connection.commit()
		redirect_uri = os.environ.get(
			"GOOGLE_REDIRECT_URI", f"{application_url()}/auth/google/callback"
		)
		query = urlencode(
			{
				"client_id": client_id,
				"redirect_uri": redirect_uri,
				"response_type": "code",
				"scope": "openid email profile",
				"state": state,
				"prompt": "select_account",
			}
		)
		self.send_response(302)
		self.send_header(
			"Location", f"https://accounts.google.com/o/oauth2/v2/auth?{query}"
		)
		self.send_header("Cache-Control", "no-store")
		state_cookie = (
			f"google_state={state}; HttpOnly; Path=/auth/google; SameSite=Lax; Max-Age=600"
		)
		if application_url().startswith("https://"):
			state_cookie += "; Secure"
		self.send_header("Set-Cookie", state_cookie)
		self.end_headers()

	def finish_google_login(self, query: str) -> None:
		from urllib.parse import parse_qs

		values = parse_qs(query)
		state = values.get("state", [""])[0]
		code = values.get("code", [""])[0]
		cookie = SimpleCookie()
		try:
			cookie.load(self.headers.get("Cookie", ""))
		except Exception:
			cookie = SimpleCookie()
		state_cookie = cookie.get("google_state")
		if (
			values.get("error")
			or not state
			or not code
			or not state_cookie
			or not hmac.compare_digest(state, state_cookie.value)
		):
			self.redirect_with_auth_error("Google sign-in was canceled.")
			return
		with closing(connect_database()) as connection:
			record = connection.execute(
				"SELECT state_hash FROM google_states WHERE state_hash = ? AND expires_at > ?",
				(token_digest(state), datetime.now(timezone.utc).isoformat()),
			).fetchone()
			connection.execute(
				"DELETE FROM google_states WHERE state_hash = ?",
				(token_digest(state),),
			)
			connection.commit()
		if not record:
			self.redirect_with_auth_error("Google sign-in expired. Please try again.")
			return
		client_id = os.environ.get("GOOGLE_CLIENT_ID")
		client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
		if not client_id or not client_secret:
			self.redirect_with_auth_error("Google sign-in is not configured.")
			return
		redirect_uri = os.environ.get(
			"GOOGLE_REDIRECT_URI", f"{application_url()}/auth/google/callback"
		)
		try:
			token_request = Request(
				"https://oauth2.googleapis.com/token",
				data=urlencode(
					{
						"code": code,
						"client_id": client_id,
						"client_secret": client_secret,
						"redirect_uri": redirect_uri,
						"grant_type": "authorization_code",
					}
				).encode(),
				headers={"Content-Type": "application/x-www-form-urlencoded"},
			)
			with urlopen(token_request, timeout=15) as response:
				token_data = json.load(response)
			access_token = token_data.get("access_token")
			if not isinstance(access_token, str):
				raise ValueError("Google did not return an access token.")
			profile_request = Request(
				"https://openidconnect.googleapis.com/v1/userinfo",
				headers={"Authorization": f"Bearer {access_token}"},
			)
			with urlopen(profile_request, timeout=15) as response:
				profile = json.load(response)
			email = profile.get("email")
			if (
				not isinstance(email, str)
				or profile.get("email_verified") is not True
				or not profile.get("sub")
			):
				raise ValueError("Google did not provide a verified email address.")
			name = str(profile.get("name") or email.split("@")[0])[:80]
			with closing(connect_database()) as connection:
				user = connection.execute(
					"SELECT * FROM users WHERE email = ? COLLATE NOCASE",
					(email.lower(),),
				).fetchone()
				if user:
					connection.execute(
						"UPDATE users SET email_verified = 1 WHERE id = ?",
						(user["id"],),
					)
					user_id = user["id"]
				else:
					user_id = connection.execute(
						"""
						INSERT INTO users(email, display_name, email_verified)
						VALUES (?, ?, 1)
						""",
						(email.lower(), name),
					).lastrowid
				connection.commit()
			self.set_session(user_id)
			self.send_response(302)
			self.send_header("Location", f"{application_url()}/?auth=google")
			self.send_header("Cache-Control", "no-store")
			self.send_header("Set-Cookie", self.pending_cookie)
			self.send_header(
				"Set-Cookie",
				"google_state=; HttpOnly; Path=/auth/google; SameSite=Lax; Max-Age=0"
				+ ("; Secure" if application_url().startswith("https://") else ""),
			)
			self.end_headers()
		except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
			print(f"Google sign-in failed: {error}")
			self.redirect_with_auth_error(
				"Google sign-in could not be completed. Please try again."
			)

	def redirect_with_auth_error(self, message: str) -> None:
		self.send_response(302)
		self.send_header(
			"Location",
			f"{application_url()}/?auth_error={urlencode({'message': message})[8:]}",
		)
		self.send_header("Cache-Control", "no-store")
		self.send_header(
			"Set-Cookie",
			"google_state=; HttpOnly; Path=/auth/google; SameSite=Lax; Max-Age=0"
			+ ("; Secure" if application_url().startswith("https://") else ""),
		)
		self.end_headers()

	def send_error_page(self, message: str) -> None:
		self.send_response(503)
		self.send_header("Content-Type", "text/html; charset=utf-8")
		self.send_header("Cache-Control", "no-store")
		self.end_headers()
		body = (
			"<!doctype html><html lang='en'><meta charset='utf-8'>"
			"<title>Sign-in unavailable</title><p>"
			+ message.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
			+ "</p><a href='/'>Return to Group2 Studio</a></html>"
		)
		self.wfile.write(body.encode("utf-8"))

	def save_answer(self) -> None:
		user = self.current_user()
		if not user:
			self.send_json(401, {"error": "Please log in to save progress."})
			return
		try:
			payload = self.read_payload()
			topic = payload.get("topic")
			question_id = payload.get("questionId")
			correct = payload.get("correct")
			if topic not in TOPICS:
				raise ValueError("Choose a valid course topic")
			if not isinstance(question_id, str) or not question_id.strip():
				raise ValueError("A question id is required")
			if not isinstance(correct, bool):
				raise ValueError("Correct must be true or false")
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return
		with closing(connect_database()) as connection:
			connection.execute(
				"""
				INSERT INTO attempts(user_id, topic, question_id, correct)
				VALUES (?, ?, ?, ?)
				""",
				(user["id"], topic, question_id[:120], int(correct)),
			)
			connection.commit()
		self.send_json(200, read_progress(user["id"]))

	def complete_topics(self) -> None:
		user = self.current_user()
		if not user:
			self.send_json(401, {"error": "Please log in to save progress."})
			return
		try:
			payload = self.read_payload()
			topic_ids = payload.get("topics")
			if (
				not isinstance(topic_ids, list)
				or not topic_ids
				or len(topic_ids) > len(TOPICS)
				or any(not isinstance(topic, str) or topic not in TOPICS for topic in topic_ids)
			):
				raise ValueError("Choose at least one valid course topic.")
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return
		with closing(connect_database()) as connection:
			connection.executemany(
				"""
				INSERT INTO topic_completions(user_id, topic)
				VALUES (?, ?)
				ON CONFLICT(user_id, topic) DO UPDATE SET completed_at = datetime('now')
				""",
				[(user["id"], topic) for topic in set(topic_ids)],
			)
			connection.commit()
		self.send_json(200, read_progress(user["id"]))

	def update_phase(self) -> None:
		user = self.current_user()
		if not user:
			self.send_json(401, {"error": "Please log in to save progress."})
			return
		try:
			payload = self.read_payload()
			phase = payload.get("phase")
			topic_ids = payload.get("topics")
			if phase not in {"plan", "perform", "reflect"}:
				raise ValueError("Choose a valid learning phase.")
			if (
				not isinstance(topic_ids, list)
				or any(not isinstance(topic, str) or topic not in TOPICS for topic in topic_ids)
			):
				raise ValueError("Choose valid course topics.")
		except (ValueError, TypeError, json.JSONDecodeError) as error:
			self.send_json(400, {"error": str(error)})
			return
		with closing(connect_database()) as connection:
			connection.execute(
				"UPDATE users SET course_phase = ? WHERE id = ?",
				(phase, user["id"]),
			)
			connection.executemany(
				"""
				INSERT INTO topic_phases(user_id, topic, phase)
				VALUES (?, ?, ?)
				ON CONFLICT(user_id, topic) DO UPDATE SET phase = excluded.phase
				""",
				[(user["id"], topic, phase) for topic in set(topic_ids)],
			)
			connection.commit()
		self.send_json(200, read_progress(user["id"]))

	def serve_static(self, requested_path: str) -> None:
		relative = unquote(requested_path).lstrip("/") or "index.html"
		candidate = (ROOT / relative).resolve()
		if ROOT not in candidate.parents and candidate != ROOT:
			self.send_json(403, {"error": "Forbidden"})
			return
		if not candidate.is_file():
			self.send_json(404, {"error": "Not found"})
			return
		content_type = {
			".html": "text/html; charset=utf-8",
			".css": "text/css; charset=utf-8",
			".js": "text/javascript; charset=utf-8",
		}.get(candidate.suffix, "application/octet-stream")
		data = candidate.read_bytes()
		self.send_response(200)
		self.send_header("Content-Type", content_type)
		self.send_header("Content-Length", str(len(data)))
		self.send_header("Cache-Control", "no-cache")
		self.end_headers()
		self.wfile.write(data)

	def send_json(self, status: int, data: dict) -> None:
		body = json.dumps(data).encode("utf-8")
		self.send_response(status)
		self.send_header("Content-Type", "application/json; charset=utf-8")
		self.send_header("Content-Length", str(len(body)))
		self.send_header("Cache-Control", "no-store")
		if hasattr(self, "pending_cookie"):
			self.send_header("Set-Cookie", self.pending_cookie)
		if hasattr(self, "registration_cookie"):
			self.send_header("Set-Cookie", self.registration_cookie)
		self.end_headers()
		self.wfile.write(body)

	def log_message(self, format: str, *args: object) -> None:
		print(
			f"[{self.log_date_time_string()}] {self.command} "
			f"{urlparse(self.path).path} {self.protocol_version}"
		)


def main() -> None:
	parser = argparse.ArgumentParser(description="Run the SRL Python learning studio")
	parser.add_argument("--host", default="localhost")
	parser.add_argument("--port", type=int, default=8000)
	arguments = parser.parse_args()
	initialize_database()
	server = ThreadingHTTPServer((arguments.host, arguments.port), LearningHandler)
	print(f"SRL Studio is ready at http://{arguments.host}:{arguments.port}")
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		print("\nStopping SRL Studio...")
	finally:
		server.server_close()


if __name__ == "__main__":
	main()

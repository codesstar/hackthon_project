# db.py
import sqlite3
import os

DB_NAME = "chatbot_app.db"

# Ensure database file exists in current directory
os.makedirs(os.path.dirname(DB_NAME), exist_ok=True) if os.path.dirname(DB_NAME) else None

def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_db()
    cur = conn.cursor()

    # User table
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password_hash TEXT
    )''')

    # Topic table
    cur.execute('''CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        cover_image TEXT
    )''')

    # Subtopic table
    cur.execute('''CREATE TABLE IF NOT EXISTS subtopics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        script TEXT NOT NULL,
        image_url TEXT,
        FOREIGN KEY(topic_id) REFERENCES topics(id)
    )''')

    # Saved subtopics
    cur.execute('''CREATE TABLE IF NOT EXISTS user_saved_subtopics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        subtopic_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(subtopic_id) REFERENCES subtopics(id)
    )''')

    conn.commit()
    conn.close()

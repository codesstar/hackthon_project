# auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
import bcrypt
from backend.db import get_db

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", (
            data['username'],
            data['email'],
            hash_password(data['password'])
        ))
        conn.commit()
        return jsonify(msg="User registered successfully"), 201
    except Exception as e:
        return jsonify(error=str(e)), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM users WHERE username=?", (data['username'],))
    user = cur.fetchone()
    if user and check_password(data['password'], user[1]):
        token = create_access_token(identity=user[0], expires_delta=timedelta(days=7))
        return jsonify(access_token=token)
    return jsonify(error="Invalid credentials"), 401

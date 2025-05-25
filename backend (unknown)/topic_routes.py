# topic_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db

topic_bp = Blueprint('topics', __name__)

@topic_bp.route('/topics', methods=['GET'])
def get_topics():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM topics")
    rows = cur.fetchall()
    return jsonify([{
        "id": r[0], "title": r[1], "description": r[2], "cover_image": r[3]
    } for r in rows])

@topic_bp.route('/subtopics', methods=['GET'])
def get_subtopics():
    topic_id = request.args.get("topic_id")
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM subtopics WHERE topic_id = ?", (topic_id,))
    rows = cur.fetchall()
    return jsonify([{
        "id": r[0], "topic_id": r[1], "script": r[2], "image_url": r[3]
    } for r in rows])

@topic_bp.route('/save-subtopic', methods=['POST'])
@jwt_required()
def save_subtopic():
    user_id = get_jwt_identity()
    subtopic_id = request.json.get("subtopic_id")
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO user_saved_subtopics (user_id, subtopic_id) VALUES (?, ?)", (user_id, subtopic_id))
    conn.commit()
    return jsonify(msg="Subtopic saved")

@topic_bp.route('/my-subtopics', methods=['GET'])
@jwt_required()
def my_subtopics():
    user_id = get_jwt_identity()
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT s.id, s.topic_id, s.script, s.image_url
        FROM user_saved_subtopics us
        JOIN subtopics s ON us.subtopic_id = s.id
        WHERE us.user_id = ?
    """, (user_id,))
    rows = cur.fetchall()
    return jsonify([{
        "id": r[0], "topic_id": r[1], "script": r[2], "image_url": r[3]
    } for r in rows])

# chat_routes.py
from flask import Blueprint, request, jsonify
import openai
from backend.db import get_db

chat_bp = Blueprint('chat', __name__)

openai.api_key = "abcd "
conversation_context = {}

@chat_bp.route('/chat-with-subtopic', methods=['POST'])
def chat_with_subtopic():
    data = request.json
    subtopic_id = data['subtopic_id']
    user_input = data['user_input']

    if subtopic_id not in conversation_context:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT script FROM subtopics WHERE id = ?", (subtopic_id,))
        script = cur.fetchone()[0]
        conversation_context[subtopic_id] = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"This is the script: {script}"}
        ]

    conversation_context[subtopic_id].append({"role": "user", "content": user_input})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=conversation_context[subtopic_id]
    )

    reply = response.choices[0].message['content']
    conversation_context[subtopic_id].append({"role": "assistant", "content": reply})

    return jsonify({"reply": reply})

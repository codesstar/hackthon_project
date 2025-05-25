# upload_routes.py
from flask import Blueprint, request, jsonify
import base64
import os
import uuid

upload_bp = Blueprint('upload', __name__)
UPLOAD_FOLDER = "uploaded_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route('/upload-image', methods=['POST'])
def upload_image():
    data = request.json
    base64_image = data.get("base64")
    filename = f"{uuid.uuid4().hex}.png"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(base64_image))
        return jsonify(image_url=f"/{UPLOAD_FOLDER}/{filename}")
    except Exception as e:
        return jsonify(error="Image upload failed", details=str(e)), 400

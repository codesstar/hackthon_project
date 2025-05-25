# app.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import init_db
from auth_routes import auth_bp
from topic_routes import topic_bp
from chat_routes import chat_bp
from upload_routes import upload_bp

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "your-secret-key"

jwt = JWTManager(app)
init_db()

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(topic_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(upload_bp)

if __name__ == '__main__':
    app.run(debug=True)

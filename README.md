# Unknown Unknown

Unknown Unknown is a modular Flask-based backend for an AI-powered microlearning platform. It enables users to explore knowledge in short bursts by browsing swipable "topics" (like books) and interacting with their "subtopics" (like chapters) using GPT-based chat. Users can also upload content to automatically generate new learning threads.

## Features

* User registration and login with JWT authentication
* Topic and subtopic listing and retrieval
* GPT-based conversation with context memory per subtopic
* Upload and display images via base64
* Save and retrieve user-specific favorite subtopics

## Tech Stack

* Python 3 + Flask
* SQLite (local database)
* Flask-JWT-Extended for authentication
* OpenAI GPT-4 API for chatbot
* Flask-CORS for cross-origin support

## Project Structure

```
├── app.py                # Main app launcher and blueprint registration
├── db.py                 # Database connection and initialization
├── auth_routes.py        # Register/Login routes
├── topic_routes.py       # Topic and subtopic management
├── chat_routes.py        # Chatbot conversation logic
├── upload_routes.py      # base64 image upload API
├── uploaded_images/      # Stored images from user input
```

## Setup Instructions

1. Clone the repo and install dependencies:

```bash
pip install flask flask-jwt-extended flask-cors bcrypt openai
```

2. Run the backend:

```bash
python app.py
```

3. (Optional) Serve uploaded images:

```bash
cd uploaded_images
python3 -m http.server 8000
```

## Environment Configuration

* Replace `your-secret-key` in `app.py`
* Set your OpenAI key in `chat_routes.py`:

```python
openai.api_key = "your-openai-api-key"
```

## Author

Created by Callum. Powered by OpenAI.

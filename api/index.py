import os

# Load .env variables for local development
# Vercel will ignore this and use dashboard environment variables instead
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
    load_dotenv(_env_path)
except ImportError:
    pass

# Import the Flask application instance from our backend package
from backend.src.main import app

# Expose 'application' to ensure Vercel WSGI compatiblity
application = app

import sys
import os

# Add backend/ to sys.path so `src.main` is importable the same way it works locally.
# Vercel runs this file from the project root, so we navigate to backend/ explicitly.
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
_backend_dir = os.path.abspath(_backend_dir)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# Also add project root so any top-level modules are reachable
_project_root = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

# Load .env from backend directory for Vercel (local dev loads it from cwd)
from dotenv import load_dotenv
_env_path = os.path.join(_backend_dir, '.env')
if os.path.exists(_env_path):
    load_dotenv(_env_path)

# IMPORTANT: Declare `app` at the TOP LEVEL so Vercel's builder can always find it.
# Vercel's @vercel/python builder scans for a top-level `app` variable.
app = None

try:
    from src.main import app
except Exception as _import_error:
    import traceback
    _tb = traceback.format_exc()
    print(f"[CRITICAL] Failed to import Flask app:\n{_tb}")

    # Create a minimal fallback app that returns the error details
    from flask import Flask, jsonify
    app = Flask(__name__)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def fallback(path):
        return jsonify({
            'error': 'Application failed to start',
            'detail': str(_import_error),
            'traceback': _tb
        }), 500

# Vercel also checks for a `handler` variable as an alternative entry point
handler = app

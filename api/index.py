import os
import sys
import json

# ── Path setup for Vercel ──
_this_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.abspath(os.path.join(_this_dir, '..'))
_backend_dir = os.path.join(_project_root, 'backend')

if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

# ── Load .env (local dev only; Vercel uses dashboard env vars) ──
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(_backend_dir, '.env')
    load_dotenv(_env_path)
except ImportError:
    pass

# ── Import the Flask app with error handling ──
# If the main app fails to import (e.g. missing dependency, DB timeout),
# return a diagnostic JSON error instead of crashing silently.
try:
    from backend.src.main import app
    application = app
except Exception as _import_err:
    from flask import Flask, jsonify
    app = Flask(__name__)
    _error_message = str(_import_err)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def error_handler(path):
        return jsonify({
            'error': 'Application failed to start',
            'detail': _error_message,
            'hint': 'Check Vercel function logs for full traceback',
            'database_url_set': bool(os.getenv('DATABASE_URL')),
        }), 500

    application = app

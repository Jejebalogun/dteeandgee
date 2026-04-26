"""
Vercel Serverless Entry Point
==============================
Vercel's @vercel/python builder requires a top-level WSGI/ASGI app or handler.
We create a minimal Flask app FIRST (so the builder always finds it),
then replace its routes by importing the full application.
"""
import sys
import os

# ── Path Setup ──────────────────────────────────────────────
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
_backend_dir = os.path.abspath(_backend_dir)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

_project_root = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

# ── Create a guaranteed Flask app FIRST ─────────────────────
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def _boot_fallback(path):
    return jsonify({'error': 'App is still loading'}), 503

# ── Now attempt to import the real app ──────────────────────
try:
    from src.main import app as _real_app
    # Replace the stub with the real application
    app = _real_app
except Exception as _err:
    import traceback
    _tb = traceback.format_exc()
    print(f"[CRITICAL] Failed to import Flask app:\n{_tb}")

    # Override fallback to show the actual error
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def _error_fallback(path):
        return jsonify({
            'error': 'Application failed to start',
            'detail': str(_err),
            'traceback': _tb
        }), 500

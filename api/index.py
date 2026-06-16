import sys
import os

# ── Path Setup ──────────────────────────────────────────────
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
except Exception:
    pass

# ── Import and expose the Flask app ───────────────────────────────────
# Vercel requires a top-level variable named "app", "application", or "handler"
from src.main import app

# Explicit alias so Vercel's static analyser always finds it
application = app

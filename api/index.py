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

# ── Load .env (only matters locally; Vercel uses dashboard env vars) ──
from dotenv import load_dotenv
_env_path = os.path.join(_backend_dir, '.env')
load_dotenv(_env_path)

# ── Import the Flask app ───────────────────────────────────
from src.main import app

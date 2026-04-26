#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations (if using Flask-Migrate)
# python -m flask db upgrade

# Seed initial data (optional - uncomment if needed on first deploy)
# python seed_data.py

echo "Build completed successfully!"

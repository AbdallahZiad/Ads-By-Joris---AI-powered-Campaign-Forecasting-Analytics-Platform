#! /usr/bin/env bash
set -e

# 1. Wait for the Database (Safety First)
# Even in dev, we don't want to crash if the DB container is slow.
python app/backend_pre_start.py

# 2. Run Migrations
# Ensures your local DB schema is always up to date with your code.
echo "--- Running Database Migrations ---"
alembic upgrade head

# 3. Start Uvicorn with HOT RELOAD
# The '--reload' flag watches your files and restarts the server on save.
echo "--- Starting Uvicorn with Hot Reload ---"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
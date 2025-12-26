#! /usr/bin/env bash
set -e

# 1. Wait for the Database to be reachable
# This prevents Alembic from crashing if Postgres is waking up.
python app/backend_pre_start.py

# 2. Run Migrations
# Automatically apply any pending schema changes.
echo "--- Running Database Migrations ---"
alembic upgrade head

# 3. Start the Application
# We use 'exec' so uvicorn becomes PID 1 (receives signals correctly).
echo "--- Starting Uvicorn Server ---"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
# 1. Base Image
FROM python:3.10-slim

# 2. Set Environment Variables
# PYTHONDONTWRITEBYTECODE: Prevents Python from writing pyc files to disc
# PYTHONUNBUFFERED: Ensures python logs are flushed immediately
# PYTHONPATH: CRITICAL FIX. Tells Python to look for modules in the root /app folder.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# 3. Install System Dependencies
# libgomp1 is needed for Prophet
# libpq-dev is needed for Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 4. Set Working Directory
WORKDIR /app

# 5. Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copy Application Code & Scripts
COPY . .

# 7. Permission Setup (Critical for Shell Scripts)
COPY scripts /app/scripts
RUN chmod +x /app/scripts/*

# 8. Create a Non-Root User
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# 9. Expose Port
EXPOSE 8000

# 10. Default Command
CMD ["/app/scripts/start.sh"]
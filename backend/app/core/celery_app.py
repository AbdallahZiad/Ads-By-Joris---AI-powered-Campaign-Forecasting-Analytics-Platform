import os
from celery import Celery
from app.core.config import settings

# 1. Force the broker URL from settings immediately
# This prevents Kombu from guessing "localhost" (which defaults to AMQP/RabbitMQ)
celery_app = Celery("worker", broker=settings.CELERY_BROKER_URL)

# 2. Update configuration
celery_app.conf.update(
    broker_url=settings.CELERY_BROKER_URL,  # Explicitly set broker_url again for safety
    result_backend=settings.CELERY_RESULT_BACKEND,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone="UTC",
    enable_utc=True,
    imports=["app.tasks"],
    # Clean up Redis keys after 1 hour (3600 seconds)
    result_expires=3600,

    # --- TASK ROUTING OPTIMIZATION ---
    # We route tasks to specialized queues to prevent CPU-heavy jobs
    # from blocking high-volume I/O jobs.
    task_routes={
        # CPU Bound: Burns CPU cores (Prophet Math & DB Logic)
        'task_forecast_keywords': {'queue': 'cpu_heavy'},
        'task_apply_labels':      {'queue': 'cpu_heavy'},

        # I/O Bound: Mostly waiting on Network/OpenAI (can handle higher concurrency)
        'task_scan_website':      {'queue': 'io_heavy'},
    }
)

# 3. Optional: Print config on load to verify it sees the URL (Debugging)
print(f"Celery Configured with Broker: {settings.CELERY_BROKER_URL}")
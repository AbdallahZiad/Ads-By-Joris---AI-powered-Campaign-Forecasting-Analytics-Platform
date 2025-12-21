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
)

# 3. Optional: Print config on load to verify it sees the URL (Debugging)
print(f"Celery Configured with Broker: {settings.CELERY_BROKER_URL}")
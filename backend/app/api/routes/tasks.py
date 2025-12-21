from fastapi import APIRouter
from celery.result import AsyncResult
from app.schemas.task_schemas import TaskStatus
from app.core.celery_app import celery_app

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/{task_id}", response_model=TaskStatus)
def get_task_status(task_id: str):
    """
    Check the status of a background Celery task.
    """
    # CRITICAL FIX: Pass 'app=celery_app' to bind the result to our Redis configuration.
    # Without this, it defaults to a disabled backend and crashes.
    task_result = AsyncResult(task_id, app=celery_app)

    response = TaskStatus(
        task_id=task_id,
        status=task_result.status,
    )

    if task_result.status == "SUCCESS":
        response.result = task_result.result
    elif task_result.status == "FAILURE":
        # Convert exception object to string for safe JSON serialization
        response.error = str(task_result.result)

    return response
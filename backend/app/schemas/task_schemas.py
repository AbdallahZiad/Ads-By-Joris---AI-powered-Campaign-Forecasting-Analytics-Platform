from typing import Any, Optional
from pydantic import BaseModel

class TaskResponse(BaseModel):
    """
    Immediate response when a long-running task is submitted.
    """
    task_id: str
    status: str = "Processing"

class TaskStatus(BaseModel):
    """
    Response for polling the status of a task.
    """
    task_id: str
    status: str
    result: Optional[Any] = None
    error: Optional[str] = None
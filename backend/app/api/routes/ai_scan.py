from fastapi import APIRouter
from app.schemas.web_crawler_schemas import CrawlConfig
from app.schemas.task_schemas import TaskResponse
from app.tasks import task_scan_website

router = APIRouter(prefix='/ai-scan', tags=["AI Scan"])


@router.post(
    "/",
    response_model=TaskResponse,
    summary="Execute the full AI Website Scan (Async Task)",
)
async def scan_website_and_process_keywords(
        config: CrawlConfig
):
    """
    Submits a website scanning job to the background worker.

    1. **Crawl:** Fetches content from the URL.
    2. **Process:** Runs LLM analysis to generate keyword hierarchy.

    Returns a Task ID. Poll `/tasks/{task_id}` for the final `AIScanResponse`.
    """
    # Dispatch to Celery
    task = task_scan_website.delay(
        config.model_dump(mode='json')
    )

    return TaskResponse(task_id=task.id)
from fastapi import APIRouter
from app.schemas.analysis_schemas import ForecastInput
from app.schemas.task_schemas import TaskResponse
from app.tasks import task_forecast_keywords

router = APIRouter(prefix='/analysis', tags=["Analysis"])


@router.post(
    "/forecast",
    response_model=TaskResponse,
    summary="Generate time-series forecast (Async Task)",
)
async def forecast_keywords_volume(
        input_data: ForecastInput
):
    """
    Submits a forecasting job to the background worker (Celery).

    Returns a Task ID immediately. The frontend must poll
    `/tasks/{task_id}` to get the final `ForecastResponse`.
    """

    # 1. Dispatch Task to Celery/Redis
    # CRITICAL: We dump using 'by_alias=True' so that internal field names ('keyword')
    # are converted back to their public aliases ('text').
    # This ensures the worker receives the exact JSON structure defined in the Pydantic schema.
    task = task_forecast_keywords.delay(
        input_data.google_ads_data.model_dump(mode='json', by_alias=True),
        input_data.forecast_months
    )

    # 2. Return the Ticket immediately
    return TaskResponse(task_id=task.id)
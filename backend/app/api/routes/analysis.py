from fastapi import APIRouter
from app.services.analysis import KeywordForecastingService
from app.schemas.analysis_schemas import ForecastInput, ForecastResponse

router = APIRouter(prefix='/analysis', tags=["Analysis"])


@router.post(
    "/forecast",
    response_model=ForecastResponse,
    summary="Generate time-series forecast and trend metrics for keywords",
)
async def forecast_keywords_volume(
    input_data: ForecastInput
):
    """
    Runs CPU-intensive time-series analysis (Prophet) on the historical search
    volume data provided in the request body to generate future forecasts and
    trend metrics.

    **Input Constraint:**
    The 'google_ads_data' provided must include **more than 24 monthly search**
    **volume records** (i.e., at least 25 months) for *every* keyword in the
    'results' list. Requests failing this validation will be rejected with a 422
    Unprocessable Entity error before the analysis begins.

    Note: This endpoint expects the full output of a Google Ads keyword endpoint
    (e.g., '/google-ads/keywords/enrich') as its primary input.
    """
    service = KeywordForecastingService()

    response = await service.forecast_keywords(
        data_response=input_data.google_ads_data,
        forecast_months=input_data.forecast_months
    )

    return response
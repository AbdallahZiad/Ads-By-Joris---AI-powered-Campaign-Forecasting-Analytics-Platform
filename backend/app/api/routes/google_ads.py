from fastapi import APIRouter
from app.services.google_ads_data import GoogleAdsDataService
from app.schemas.google_ads_data_schemas import (
    GoogleAdsKeywordResponse, GetKeywordsMetricsInput, EnrichKeywordsInput
)

router = APIRouter(prefix='/google-ads', tags=["Google Ads"])


@router.post(
    "/keywords/historical-metrics",
    response_model=GoogleAdsKeywordResponse,
    summary="Get Historical Metrics for Exact Keywords",
)
async def get_historical_metrics(
        input_data: GetKeywordsMetricsInput
):
    """
    Retrieves historical search volume, competition, and bid estimates
    for the exact list of keywords provided in the request body.
    """
    # The service automatically loads credentials from settings in __init__
    service = GoogleAdsDataService(targeting=input_data.targeting)
    response = await service.get_keywords_historical_metrics(
        keywords=input_data.keywords,
        years_of_history=input_data.years_of_history
    )

    return response


@router.post(
    "/keywords/enrich",
    response_model=GoogleAdsKeywordResponse,
    summary="Generate New Keyword Ideas and Metrics",
)
async def enrich_keywords_with_ideas(
        input_data: EnrichKeywordsInput,
):
    """
    Uses the provided keywords as seeds to generate new, related keyword ideas,
    and returns historical metrics for all generated keywords (seeds + ideas).
    """
    service = GoogleAdsDataService(targeting=input_data.targeting)

    response = await service.enrich_keywords_using_ideas(
        seed_keywords=input_data.keywords,
        years_of_history=input_data.years_of_history,
        maximum_number_of_new_keywords=input_data.maximum_number_of_new_keywords
    )

    return response
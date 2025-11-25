from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Any
from enum import Enum

from app.core.config import settings

class GoogleAdsCredentials(BaseModel):
    developer_token: str = settings.GOOGLE_ADS_DEVELOPER_TOKEN
    client_id: str = settings.GOOGLE_ADS_CLIENT_ID
    client_secret: str = settings.GOOGLE_ADS_CLIENT_SECRET
    refresh_token: str = settings.GOOGLE_ADS_REFRESH_TOKEN
    login_customer_id: str = settings.GOOGLE_ADS_LOGIN_CUSTOMER_ID
    use_proto_plus: bool = settings.USE_PROTO_PLUS

class GoogleAdsTargeting(BaseModel):
    customer_id: Optional[str] = settings.GOOGLE_ADS_CUSTOMER_ID
    language_constant_id: Optional[str] = "1000"
    geo_target_id: Optional[str] = "2840"


class CompetitionLevel(str, Enum):
    """
    Represents the competition level for the keyword.
    The values correspond to Google Ads API's CompetitionLevelEnum.
    """
    UNSPECIFIED = "UNSPECIFIED"
    UNKNOWN = "UNKNOWN"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class Month(str, Enum):
    """
    Represents the month of the year for search volume data.
    The values correspond to Google Ads API's MonthOfYearEnum.
    """
    UNSPECIFIED = "UNSPECIFIED"
    JANUARY = "JANUARY"
    FEBRUARY = "FEBRUARY"
    MARCH = "MARCH"
    APRIL = "APRIL"
    MAY = "MAY"
    JUNE = "JUNE"
    JULY = "JULY"
    AUGUST = "AUGUST"
    SEPTEMBER = "SEPTEMBER"
    OCTOBER = "OCTOBER"
    NOVEMBER = "NOVEMBER"
    DECEMBER = "DECEMBER"


    @classmethod
    def from_int(cls, month_int: int) -> 'Month':
        """Converts an integer (1-12) to the corresponding Month enum value."""
        try:
            enum_str = _INT_TO_ENUM_MAP[month_int]
            return cls(enum_str)
        except KeyError:
            raise ValueError(f"Invalid month integer: {month_int}. Must be between 1 and 12.")

    @classmethod
    def to_int(cls, month_enum: 'Month') -> int:
        """
        Converts a Month enum value back to its integer (1-12) representation
        using the pre-computed reverse map.
        """
        if month_enum == cls.UNSPECIFIED:
            raise ValueError("Cannot convert UNSPECIFIED month to integer.")

        # Access the pre-computed reverse map directly from the class
        month_int = _ENUM_TO_INT_MAP.get(month_enum.value)

        if month_int is None:

            # Should not happen if the enum is used correctly
            raise ValueError(f"Invalid Month enum value: {month_enum.value}")

        return month_int

# --- Utility for Integer Conversion ---
_INT_TO_ENUM_MAP = {
    1: "JANUARY", 2: "FEBRUARY", 3: "MARCH", 4: "APRIL",
    5: "MAY", 6: "JUNE", 7: "JULY", 8: "AUGUST",
    9: "SEPTEMBER", 10: "OCTOBER", 11: "NOVEMBER", 12: "DECEMBER"
}
_ENUM_TO_INT_MAP = {v: k for k, v in _INT_TO_ENUM_MAP.items()}

class MonthlySearchVolume(BaseModel):
    """
    A single data point representing the search volume for a specific month and year.
    """
    month: Month = Field(..., description="The month of the search volume data.")
    year: int = Field(..., description="The year of the search volume data.")
    search_volume: int = Field(..., alias="monthly_searches", description="The approximate number of searches for the keyword during this month and year.")

class KeywordHistoricalMetrics(BaseModel):
    """
    The set of historical metrics for a single keyword.
    """
    competition: CompetitionLevel = Field(..., description="The overall competition level for the keyword.")
    monthly_search_volumes: List[MonthlySearchVolume] = Field(..., description="The search volume breakdown for each month in the requested date range.")
    avg_monthly_searches: int = Field(..., description="The average monthly searches for the keyword over the last 12 months.")
    competition_index: Optional[int] = Field(None, description="The competition index for the keyword, ranging from 0 to 100.")
    low_top_of_page_bid_micros: Optional[int] = Field(None, description="The 20th percentile (low range) of the bid for top-of-page placement, in micros.")
    high_top_of_page_bid_micros: Optional[int] = Field(None, description="The 80th percentile (high range) of the bid for top-of-page placement, in micros.")
    average_cpc_micros: Optional[int] = Field(None, description="The average Cost-Per-Click in micros (only present if explicitly requested).")

    # Property for easier access to dollar-based CPC/Bid
    @property
    def low_top_of_page_bid_currency(self) -> Optional[float]:
        """Converts low bid from micros to currency unit."""
        if self.low_top_of_page_bid_micros is not None:
            return self.low_top_of_page_bid_micros / 1_000_000.0
        return None

    @property
    def high_top_of_page_bid_currency(self) -> Optional[float]:
        """Converts high bid from micros to currency unit."""
        if self.high_top_of_page_bid_micros is not None:
            return self.high_top_of_page_bid_micros / 1_000_000.0
        return None

    @property
    def average_cpc_currency(self) -> Optional[float]:
        """Converts average CPC from micros to currency unit."""
        if self.average_cpc_micros is not None:
            return self.average_cpc_micros / 1_000_000.0
        return None

# --- Base Keyword Result Model ---

class UnifiedKeywordResult(BaseModel):
    """
    Unified model for any keyword result carrying historical metrics (Historical or Idea).
    Handles both 'keyword_metrics' (Historical) and 'keyword_idea_metrics' (Idea) inputs.
    """
    keyword: str = Field(..., description="The keyword phrase.", alias="text")

    # FIX: Made optional to handle cases where API returns a keyword without metrics.
    keyword_metrics: Optional[KeywordHistoricalMetrics] = Field(
        None,
        description="Historical search metrics container. May be None if data is unavailable."
    )

    @model_validator(mode='before')
    @classmethod
    def _unify_metrics_field(cls, data: Any) -> Any:
        """
        Validator that runs BEFORE field validation to ensure the metrics container
        is consistently named 'keyword_metrics', regardless of whether it came from
        the Historical or Idea endpoint.
        """
        if not isinstance(data, dict):
            return data

        if 'keyword_idea_metrics' in data and 'keyword_metrics' not in data:
            data['keyword_metrics'] = data.pop('keyword_idea_metrics')

        return data


# --- Unified Top-Level Response Model ---

class GoogleAdsKeywordResponse(BaseModel):
    """
    Generic top-level container for results from any Google Ads keyword endpoint.
    This replaces HistoricalMetricsResponse and KeywordIdeaResponse as the input
    type for the Forecasting Service.
    """
    results: List[UnifiedKeywordResult] = Field(
        ...,
        description="A list of keyword results with metrics."
    )

# --- Input Schemas For API Routes ---

class GoogleAdsBaseKeywordsInput(BaseModel):
    """Base model for requests that require a list of keywords and history depth."""
    keywords: List[str] = Field(
        ...,
        min_length=1,
        description="A list of keyword phrases to process."
    )
    years_of_history: int = Field(
        5,
        ge=1,
        le=10,
        description="The number of full years of historical data to fetch (1-10)."
    )
    # Allows API consumers to dynamically override the service's default targeting
    targeting: Optional[GoogleAdsTargeting] = Field(
        None,
        description="Optional override for geo, language, and customer ID constraints."
    )


class GetKeywordsMetricsInput(GoogleAdsBaseKeywordsInput):
    """
    Input schema for the /metrics endpoint.
    """
    pass


class EnrichKeywordsInput(GoogleAdsBaseKeywordsInput):
    """
    Input schema for the /enrich endpoint.
    """
    maximum_number_of_new_keywords: Optional[int] = Field(
        None,
        ge=1
    )
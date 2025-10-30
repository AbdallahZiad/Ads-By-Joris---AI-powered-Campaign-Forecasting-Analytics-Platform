import warnings

from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, ClassVar

from app.schemas.google_ads_schemas import Month, GoogleAdsKeywordResponse

# Suppress all future warnings, which includes the FutureWarning from sklearn
warnings.filterwarnings("ignore", category=FutureWarning)


class ForecastPoint(BaseModel):
    """Represents a single point in the forecast series."""
    month: Month
    year: int = Field(..., description="The year of the forecast.")

    search_volume_forecast: int = Field(..., description="The predicted monthly search volume.")
    lower_bound: int = Field(..., description="The lower bound of the 95% confidence interval.")
    upper_bound: int = Field(..., description="The upper bound of the 95% confidence interval.")


class KeywordForecast(BaseModel):
    """Forecasting results and metrics for a single keyword."""
    keyword: str = Field(..., description="The keyword analyzed.")

    # --- PROPHET Metadata ---
    prophet_model_status: str = Field(...,
                                      description="Status or configuration summary of the Prophet model used (e.g., model parameters).")

    # --- Trend Metrics ---
    current_month_expected_volume: int = Field(..., description="The expected search volume for the current month, which serves as the primary baseline for all forward-looking percentage changes.")
    annual_growth_rate: Optional[float] = Field(None, description="The estimated Year-over-Year (YoY) percentage change calculated by comparing the average volume of the next 12 forecasted months against the last 12 historical months.")
    expected_increase_1m: Optional[float] = Field(None, description="Expected percentage increase/decrease in search volume for the next month (M+1) compared to the current expected month (M0).")
    expected_increase_3m: Optional[float] = Field(None, description="Expected percentage increase/decrease in the average search volume over the next 3 months (M+1 to M+3) compared to the current expected month (M0).")
    expected_increase_6m: Optional[float] = Field(None, description="Expected percentage increase/decrease in the average search volume over the next 6 months (M+1 to M+6) compared to the current expected month (M0).")

    # --- The Forecast Series ---
    forecast_series: List[ForecastPoint] = Field(..., description="The sequence of forecasted search volumes.")


class ForecastResponse(BaseModel):
    """The root model containing all forecasted keyword results."""
    forecasts: List[KeywordForecast] = Field(..., description="A list of forecasts, one for each keyword analyzed.")


class ForecastInput(BaseModel):
    """
    Input schema for the /forecast route. Requires the full Google Ads Keyword
    Response (results and metrics) and the duration of the forecast.
    """
    MIN_DATA_POINTS: ClassVar[int] = 24

    google_ads_data: GoogleAdsKeywordResponse = Field(
        ...,
        description=(
            "The complete response object from the Google Ads keyword metrics endpoint. "
            "**Constraint:** The historical data for every keyword in the 'results' list "
            f"must comprise a minimum of {MIN_DATA_POINTS + 1} monthly search volume records "
            f"(i.e., more than {MIN_DATA_POINTS} data points) to ensure forecast accuracy."
        )
    )
    forecast_months: int = Field(
        12,
        ge=1,
        le=36,
        description="The number of future months to generate the forecast for (1-36)."
    )

    @model_validator(mode='after')
    def validate_historical_data_length_for_all_keywords(self) -> 'ForecastInput':
        """
        Ensures that ALL keywords in google_ads_data have more than 24
        monthly search volumes for the forecast to be reliable.
        """

        if not self.google_ads_data.results:
            raise ValueError("google_ads_data must contain at least one keyword result.")

        # Iterate over every keyword result to check its data length
        for result in self.google_ads_data.results:
            data_points = len(result.keyword_metrics.monthly_search_volumes)

            if data_points <= self.MIN_DATA_POINTS:
                raise ValueError(
                    f"Keyword '{result.keyword}' has insufficient historical data. "
                    f"Requires more than {self.MIN_DATA_POINTS} monthly search volumes, but only {data_points} were found."
                )

        return self
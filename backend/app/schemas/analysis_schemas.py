import warnings

from pydantic import BaseModel, Field
from typing import List, Optional

from app.schemas.google_ads_schemas import Month

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
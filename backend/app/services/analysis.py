import asyncio
import concurrent.futures
import json
import os
import warnings
from typing import Tuple, Optional, List

import pandas as pd
import numpy as np
from datetime import datetime
from prophet import Prophet

from app.services.google_ads import GoogleAdsService
from app.services.google_ads_schemas import GoogleAdsKeywordResponse, UnifiedKeywordResult, KeywordHistoricalMetrics, \
    Month, GoogleAdsTargeting
from app.services.analysis_schemas import ForecastResponse, KeywordForecast, ForecastPoint

# Suppress all future warnings, including from third-party libraries
warnings.filterwarnings("ignore", category=FutureWarning)

class KeywordForecastingService:
    """
    Service for performing time-series analysis (Prophet) and forecasting
    on Google Ads keyword historical data.
    """

    # --- Configuration Constants ---
    _MIN_SEARCH_VOLUME_THRESHOLD = 100  # Minimum average searches to attempt a forecast

    # Max safe integer value for clipping predictions
    _MAX_SAFE_VOLUME = 2_147_483_647

    # Set the number of workers dynamically to the number of available CPU cores
    # Use 'os.cpu_count() or 4' as a safe default fallback.
    # Subtract 1 if to reserve a core for the main FastAPI process/event loop.
    _MAX_WORKERS = (os.cpu_count() or 4) - 1
    if _MAX_WORKERS < 1:
        _MAX_WORKERS = 1 # Ensure at least one worker

    def __init__(self):
        pass

    # --------------------------------------------------------------------------
    # --- Internal Helpers (Data Preparation) ---
    # --------------------------------------------------------------------------

    def _extract_time_series_data(self, metrics: KeywordHistoricalMetrics) -> pd.DataFrame:
        """
        Converts a single keyword's historical metrics into a clean DataFrame
        suitable for Facebook Prophet (with 'ds' and 'y' columns).
        """
        volumes = metrics.monthly_search_volumes

        data = [
            {
                # Month.to_int() ensures we get the 1-12 integer for datetime
                'ds': datetime(v.year, Month.to_int(v.month), 1),
                'y': v.search_volume
            }
            for v in volumes
        ]

        df = pd.DataFrame(data).sort_values('ds')

        # Ensure continuous time series for Prophet: Resample to Month-Start ('MS')
        df = df.set_index('ds').asfreq('MS', fill_value=0)

        # Linear interpolation fills any newly created zero-gaps smoothly
        df['y'] = df['y'].interpolate(method='linear')

        # Return as DataFrame with 'ds' and 'y' columns
        return df.reset_index()

    def safe_pct_change(self, new_val: float, old_val: float) -> Optional[float]:
        """Helper to calculate percentage change safely, avoiding division by zero or negative values."""
        return ((new_val - old_val) / old_val) if old_val > 0 else None

    # --------------------------------------------------------------------------
    # --- Internal Processor (Prophet Core Logic) ---
    # --------------------------------------------------------------------------

    def _calculate_percentage_metrics(
            self,
            ts_series_hist: pd.Series,
            forecast_result: pd.Series,
            forecast_months: int
    ) -> Tuple[int, Optional[float], Optional[float], Optional[float], Optional[float]]:
        """
        Calculates all baseline and forward-looking percentage metrics for the forecast model.
        """

        # --- 1. Establish the Baseline (Current Month) ---
        # M0: The expected volume for the current month. Clip safely.
        current_expected_volume = int(np.clip(
            forecast_result.iloc[0],
            a_min=0,
            a_max=self._MAX_SAFE_VOLUME
        ))
        forward_baseline = float(current_expected_volume) if current_expected_volume > 0 else None

        # Ensure we have enough forecast points for comparison
        if forward_baseline is None:
            return current_expected_volume, None, None, None, None

        # --- 2. Calculate Forward-Looking Metrics (Relative to M0) ---

        # M+1 change (M1 vs M0)
        fcst_1m = forecast_result.iloc[1] if forecast_months >= 2 else None
        increase_1m = self.safe_pct_change(fcst_1m, forward_baseline) if fcst_1m is not None else None

        # 3-Month change (Avg M1-M3 vs M0)
        fcst_avg_3m = forecast_result.iloc[1:4].mean() if forecast_months >= 4 else None
        increase_3m = self.safe_pct_change(fcst_avg_3m, forward_baseline) if fcst_avg_3m is not None else None

        # 6-Month change (Avg M1-M6 vs M0)
        fcst_avg_6m = forecast_result.iloc[1:7].mean() if forecast_months >= 7 else None
        increase_6m = self.safe_pct_change(fcst_avg_6m, forward_baseline) if fcst_avg_6m is not None else None

        # --- 3. Calculate Annual Growth Rate (YoY) ---

        # Historical Baseline (Last 12 months historical average)
        hist_avg_12m = ts_series_hist.tail(12).mean()

        # Forecast Average (Next 12 months average, including M0)
        fcst_avg_12m_full = forecast_result.iloc[0:12].mean() if forecast_months >= 12 else None

        # Annual Growth: Next 12 months average vs. Last 12 months historical average
        annual_growth = self.safe_pct_change(fcst_avg_12m_full, hist_avg_12m) if fcst_avg_12m_full is not None else None

        return (
            current_expected_volume,
            annual_growth,
            increase_1m,
            increase_3m,
            increase_6m
        )

    def _run_prophet_forecast(
            self,
            result: UnifiedKeywordResult,
            forecast_months: int
    ) -> KeywordForecast:
        """
        Processes a single keyword using Facebook Prophet for forecasting.
        """
        keyword = result.keyword

        # --- 1. Data Preparation and Pre-checks ---
        prophet_df = self._extract_time_series_data(result.keyword_metrics)

        # Check for sufficient non-zero data points (Prophet is best with at least 2 years of non-zero data)
        if (prophet_df['y'] > 0).sum() < 24:
            raise ValueError(f"Insufficient non-zero data points for Prophet (need > 24).")

        # --- 2. Prophet Model Initialization and Fitting ---
        try:
            model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=False,
                daily_seasonality=False,
                seasonality_mode='multiplicative'
            )
            model.fit(prophet_df)
        except Exception as e:
            raise ValueError(f"Prophet failed to initialize/fit for '{keyword}': {e}")

        # --- 3. Forecasting ---
        future = model.make_future_dataframe(periods=forecast_months, freq='MS')
        forecast = model.predict(future)

        # --- 4. Prepare Slices for Metric Calculation ---

        # Identify the end of historical data and slice the forecast for future points
        last_history_date = prophet_df['ds'].max()
        forecast_slice = forecast[forecast['ds'] > last_history_date].copy()

        # Extract forecast (yhat) and confidence intervals (yhat_lower/upper)
        forecast_result = forecast_slice['yhat']
        conf_int = forecast_slice[['yhat_lower', 'yhat_upper']].values

        # Calculate trend metrics, passing the historical 'y' column
        (
            current_expected_volume,
            annual_growth,
            increase_1m,
            increase_3m,
            increase_6m
        ) = self._calculate_percentage_metrics(prophet_df['y'], forecast_result, forecast_months)

        # --- 5. Format the Forecast Series (Points) ---

        forecast_points: List[ForecastPoint] = []

        for i in range(forecast_months):
            # Use .iloc[i] to safely access the i-th ROW of the forecast_slice DataFrame
            row = forecast_slice.iloc[i]
            date = row['ds']

            # Clip values safely before converting to int for the Pydantic schema
            forecast_value = int(np.clip(row['yhat'], a_min=0, a_max=self._MAX_SAFE_VOLUME))
            lower_bound = int(np.clip(row['yhat_lower'], a_min=0, a_max=self._MAX_SAFE_VOLUME))
            upper_bound = int(np.clip(row['yhat_upper'], a_min=0, a_max=self._MAX_SAFE_VOLUME))

            forecast_points.append(
                ForecastPoint(
                    month=Month.from_int(date.month),
                    year=date.year,
                    search_volume_forecast=forecast_value,
                    lower_bound=lower_bound,
                    upper_bound=upper_bound
                )
            )

        # --- 6. Return Final KeywordForecast Model ---
        return KeywordForecast(
            keyword=keyword,
            # Schema change: Renamed from sarima_params/aic_score
            prophet_model_status="Prophet (Seasonality: Multiplicative)",
            current_month_expected_volume=current_expected_volume,
            annual_growth_rate=annual_growth,
            expected_increase_1m=increase_1m,
            expected_increase_3m=increase_3m,
            expected_increase_6m=increase_6m,
            forecast_series=forecast_points
        )

    # --------------------------------------------------------------------------
    # --- Public Orchestrator ---
    # --------------------------------------------------------------------------

    async def forecast_keywords(
            self,
            data_response: GoogleAdsKeywordResponse,
            forecast_months: int = 12
    ) -> ForecastResponse:
        """
        Orchestrates the forecasting process using parallelism (ProcessPoolExecutor)
        for CPU-intensive Prophet modeling.
        """
        results_to_process = []

        # --- 1. Pre-filter and Prepare Batch ---
        for result in data_response.results:
            keyword = result.keyword
            metrics = result.keyword_metrics

            if metrics.avg_monthly_searches < self._MIN_SEARCH_VOLUME_THRESHOLD:
                print(
                    f"Skipping keyword '{keyword}': Avg search volume ({metrics.avg_monthly_searches}) below threshold."
                )
                continue

            results_to_process.append(result)

        if not results_to_process:
            return ForecastResponse(forecasts=[])

        all_forecasts = []

        # --- 2. Parallel Processing ---
        # Get the current running event loop
        loop = asyncio.get_running_loop()

        # Use a ProcessPoolExecutor for CPU-bound work
        with concurrent.futures.ProcessPoolExecutor(max_workers=self._MAX_WORKERS) as pool:

            # Create a list of futures (promises)
            futures = [
                # Use loop.run_in_executor to run the synchronous forecast method
                # in a separate process, returning an awaitable Future.
                loop.run_in_executor(
                    pool,
                    self._run_prophet_forecast,
                    result,
                    forecast_months
                )
                for result in results_to_process
            ]

            # Wait for all futures to complete concurrently
            print(f"Starting parallel forecast for {len(futures)} keywords using {self._MAX_WORKERS} processes...")

            # Use asyncio.gather to manage exceptions and results
            completed_tasks = await asyncio.gather(*futures, return_exceptions=True)

            # --- 3. Collect and Filter Results ---
            for result, keyword_result in zip(completed_tasks, results_to_process):
                keyword = keyword_result.keyword

                if isinstance(result, Exception):
                    # Handle exceptions from the child process gracefully
                    print(f"Forecast failed for keyword '{keyword}': {result}. Skipping.")
                else:
                    # Successful forecast
                    all_forecasts.append(result)

        # 4. Return the final Pydantic response
        return ForecastResponse(forecasts=all_forecasts)

async def main_test():
    google_ad_service = GoogleAdsService()
    forecasting_service = KeywordForecastingService()

    # Define the keywords to analyze
    keywords_to_query = ['Apple', 'Samsung']
    target_to_use = GoogleAdsTargeting(language_constant_id="1000", geo_target_id="2840")

    # Run the full orchestrator test with multiple keywords
    response_full: GoogleAdsKeywordResponse = await google_ad_service.get_keywords_historical_metrics(
        keywords_to_query, target_to_use
    )

    full_forecast = await forecasting_service.forecast_keywords(response_full)
    print(json.dumps(full_forecast.model_dump(), indent=4))


if __name__ == '__main__':
    asyncio.run(main_test())
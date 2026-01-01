import asyncio
import json
import random

import proto
from datetime import datetime
import time
from typing import List, Optional, Callable, Any
from dateutil.relativedelta import relativedelta
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core.exceptions import ResourceExhausted
from app.schemas.google_ads_data_schemas import GoogleAdsCredentials, GoogleAdsTargeting, GoogleAdsKeywordResponse


class GoogleAdsDataService:
    """
    Centralized service class for interacting with the Google Ads API.
    Handles client initialization and provides methods for specific API calls.
    """

    # --- Class-Level Constants for Configuration ---
    _MAX_RETRIES = 5
    _BASE_SLEEP_SECONDS = 4  # Default to 4s as requested by the server

    def __init__(self, creds: Optional[GoogleAdsCredentials] = None, targeting: Optional[GoogleAdsTargeting] = None):
        # 1. Initialize configurations
        self.creds = creds if creds else GoogleAdsCredentials()
        self.targeting = targeting if targeting else GoogleAdsTargeting()

        # 2. Initialize Google Ads Client
        client = GoogleAdsClient.load_from_dict(self.creds.model_dump())
        self.client: GoogleAdsClient = client


    # --------------------------------------------------------------------------
    # --- Internal Helpers ---
    # --------------------------------------------------------------------------

    def _get_service(self, service_name: str):
        """Helper to retrieve a specific Google Ads API service client."""
        return self.client.get_service(service_name)

    def _get_geo_constraints_string(self, geo_id: str) -> str:
        """
        Helper to format a GeoTargetConstant ID into the required Google Ads API resource name string.
        """
        return f"geoTargetConstants/{geo_id}"

    def _get_language_constraints_string(self, language_constant_id) -> str:
        """ Format a language constant ID into the required resource name. """
        return f"languageConstants/{language_constant_id}"

    def _is_rate_limit_error(self, exception: GoogleAdsException) -> bool:
        """
        Checks the Protobuf error structure for the QuotaErrorEnum.RESOURCE_TEMPORARILY_EXHAUSTED code.
        """
        QuotaErrorEnum = self.client.enums.QuotaErrorEnum

        for error in exception.failure.errors:
            if (hasattr(error.error_code, 'quota_error') and
                    error.error_code.quota_error == QuotaErrorEnum.RESOURCE_TEMPORARILY_EXHAUSTED):
                return True
        return False

    def _is_invalid_date_error(self, exception: GoogleAdsException) -> bool:
        """
        Checks if the error is specifically due to an invalid date range
        (e.g., requesting data for a month that isn't finalized yet).
        """
        DateRangeErrorEnum = self.client.enums.DateRangeErrorEnum

        for error in exception.failure.errors:
            if hasattr(error.error_code, 'date_range_error'):
                # Check for generic INVALID_DATE or specifically DATE_TOO_RECENT if applicable
                if error.error_code.date_range_error == DateRangeErrorEnum.INVALID_DATE:
                    return True
        return False

    def _execute_api_call_sync(self, api_method: Callable, **kwargs) -> Any:
        """
        Centralized request executor with robust retry logic for Google Ads API.
        """
        last_exception = None

        for attempt in range(self._MAX_RETRIES):
            try:
                # 1. Execute the actual API call
                return api_method(**kwargs)

            except (GoogleAdsException, ResourceExhausted) as e:
                last_exception = e
                is_rate_limit = False

                if isinstance(e, ResourceExhausted):
                    is_rate_limit = True
                elif isinstance(e, GoogleAdsException):
                    is_rate_limit = self._is_rate_limit_error(e)

                if is_rate_limit:
                    if attempt < self._MAX_RETRIES - 1:
                        sleep_time = (self._BASE_SLEEP_SECONDS * (2 ** attempt)) + random.uniform(0, 1)
                        print(
                            f"Rate limit hit ({type(e).__name__}). Retrying in {sleep_time:.2f}s... "
                            f"(Attempt {attempt + 1}/{self._MAX_RETRIES})"
                        )
                        time.sleep(sleep_time)
                        continue
                    else:
                        print(f"Failed after {self._MAX_RETRIES} attempts.")
                        raise last_exception

                else:
                    # Non-rate-limit errors (like INVALID_DATE) should fail immediately
                    # so the caller can handle the fallback logic.
                    raise last_exception

            except Exception as e:
                print(f"Caught unexpected system error: {type(e).__name__}. Failing immediately.")
                raise e

        if last_exception:
            raise last_exception
        raise RuntimeError("Max retries exceeded for Google Ads API call") from last_exception

    async def _execute_api_call(self, api_method: Callable, **kwargs) -> Any:
        """
        Asynchronous wrapper for the synchronous API call using asyncio.to_thread.
        """
        return await asyncio.to_thread(self._execute_api_call_sync, api_method, **kwargs)

    def _get_historical_metrics_options(self, years_of_history: int, months_back_offset: int = 1):
        """
        Configures the Date Range.
        Args:
            years_of_history: Number of years to fetch.
            months_back_offset: How many months back to end the query.
                                1 = Previous Month (Aggressive).
                                2 = Two Months Ago (Safe Fallback).
        """
        historical_metrics_options = self.client.get_type("HistoricalMetricsOptions")

        # Dynamic End Date: Today minus 'months_back_offset' months
        # e.g., On Jan 1st:
        # offset=1 -> End Date = Dec 1st (Might fail if API isn't ready)
        # offset=2 -> End Date = Nov 1st (Safe)
        today = datetime.now()
        end_date = (today.replace(day=1) - relativedelta(months=months_back_offset))

        # Calculate start date (Max 48 months limit by Google)
        max_allowed_months = 48
        requested_months = (years_of_history * 12) + 1
        months_to_fetch = min(requested_months, max_allowed_months)

        start_date = end_date - relativedelta(months=months_to_fetch)

        historical_metrics_options.year_month_range.start.year = start_date.year
        historical_metrics_options.year_month_range.start.month = start_date.month
        historical_metrics_options.year_month_range.end.year = end_date.year
        historical_metrics_options.year_month_range.end.month = end_date.month

        historical_metrics_options.include_average_cpc = True

        return historical_metrics_options

    def _add_targeting_to_request(self, request: Any, target: Optional[GoogleAdsTargeting] = None):
        """
        Populates a Protobuf request object with customer ID, geo constraints, and language.
        """
        target_to_use = target if target else self.targeting

        request.customer_id = target_to_use.customer_id

        geo_target_ids = [self._get_geo_constraints_string(target_to_use.geo_target_id)]
        if hasattr(request, 'geo_target_constants'):
            request.geo_target_constants.extend(geo_target_ids)
        elif hasattr(request, 'geo_target_constants_names'):
            request.geo_target_constants_names.extend(geo_target_ids)

        language_resource = self._get_language_constraints_string(target_to_use.language_constant_id)
        if hasattr(request, 'language'):
            request.language = language_resource
        elif hasattr(request, 'language_constants'):
            request.language_constants.extend([language_resource])

    def _proto_to_dict(self, proto_message: Any) -> dict:
        return proto.Message.to_dict(proto_message, use_integers_for_enums=False)

    def _convert_pager_to_dict_list(self, pager_instance: Any) -> List[dict]:
        return [self._proto_to_dict(item) for item in pager_instance]

    def _filter_keywords_without_metrics(self, response, first_n_keywords: int = None):
        if "results" in response and isinstance(response["results"], list):
            filtered_results = [
                r for r in response["results"]
                if r.get("keyword_idea_metrics") is not None
            ]
            response["results"] = filtered_results if first_n_keywords is None else filtered_results[:first_n_keywords]

    # --------------------------------------------------------------------------
    # --- Public API Methods (With Smart Fallback) ---
    # --------------------------------------------------------------------------

    async def get_keywords_historical_metrics(
            self,
            keywords: List[str],
            target: Optional[GoogleAdsTargeting] = None,
            years_of_history: int = 5
    ) -> GoogleAdsKeywordResponse:

        keyword_plan_idea_service = self._get_service("KeywordPlanIdeaService")

        # SMART FALLBACK LOOP
        # Attempt 1: Try getting data up to Previous Month (Aggressive)
        # Attempt 2: If INVALID_DATE error, fallback to 2 Months Ago (Safe)
        last_error = None

        for offset in [1, 2]:
            try:
                # --- Build Request with current offset ---
                request = self.client.get_type("GenerateKeywordHistoricalMetricsRequest")
                request.historical_metrics_options = self._get_historical_metrics_options(years_of_history, months_back_offset=offset)
                request.keywords.extend(keywords)
                self._add_targeting_to_request(request, target)

                # --- Execute ---
                raw_response = await self._execute_api_call(
                    api_method=keyword_plan_idea_service.generate_keyword_historical_metrics,
                    request=request
                )

                # If successful, process and break loop
                response_data = self._proto_to_dict(raw_response)
                return GoogleAdsKeywordResponse.model_validate(response_data)

            except GoogleAdsException as e:
                # Check if this is specifically a Date error (meaning we asked for data too soon)
                if self._is_invalid_date_error(e) and offset == 1:
                    print(f"Warning: 'Previous Month' data not yet available (INVALID_DATE). Falling back to 2 months ago.")
                    last_error = e
                    continue # Retry with offset 2
                else:
                    # If it's any other error (Auth, Rate Limit exhausted), raise immediately
                    raise e

        # If we exit the loop without returning, raise the last error
        if last_error:
            raise last_error
        raise RuntimeError("Failed to fetch historical metrics after fallback attempts.")

    async def enrich_keywords_using_ideas(
            self,
            seed_keywords: List[str],
            target: Optional[GoogleAdsTargeting] = None,
            years_of_history: int = 5,
            maximum_number_of_new_keywords: int = None
    ) -> GoogleAdsKeywordResponse:

        keyword_plan_idea_service = self._get_service("KeywordPlanIdeaService")

        # SMART FALLBACK LOOP (Same logic as above)
        last_error = None

        for offset in [1, 2]:
            try:
                request = self.client.get_type("GenerateKeywordIdeasRequest")
                self._add_targeting_to_request(request, target)
                request.keyword_seed.keywords.extend(seed_keywords)

                # Apply date offset
                request.historical_metrics_options = self._get_historical_metrics_options(years_of_history, months_back_offset=offset)

                raw_response_pager = await self._execute_api_call(
                    api_method=keyword_plan_idea_service.generate_keyword_ideas,
                    request=request
                )

                results_list = self._convert_pager_to_dict_list(raw_response_pager)
                response_data = {"results": results_list}

                if maximum_number_of_new_keywords is not None:
                    self._filter_keywords_without_metrics(
                        response_data,
                        first_n_keywords=len(seed_keywords) + maximum_number_of_new_keywords
                    )
                else:
                    self._filter_keywords_without_metrics(response_data)

                return GoogleAdsKeywordResponse.model_validate(response_data)

            except GoogleAdsException as e:
                if self._is_invalid_date_error(e) and offset == 1:
                    print(f"Warning: 'Previous Month' data not yet available (INVALID_DATE). Falling back to 2 months ago.")
                    last_error = e
                    continue
                else:
                    raise e

        if last_error:
            raise last_error
        raise RuntimeError("Failed to fetch keyword ideas after fallback attempts.")


async def main_test():
    service = GoogleAdsDataService()
    keywords_to_query = ['samsung galaxy s24']
    target_to_use = GoogleAdsTargeting(language_constant_id="1000", geo_target_id="2840")

    # Test Metrics
    print("Testing Metrics...")
    response_1 = await service.get_keywords_historical_metrics(keywords_to_query, target_to_use)
    print(f"Success. Retrieved {len(response_1.results)} metrics.")

    # Test Enrich
    print("Testing Enrich...")
    response_2 = await service.enrich_keywords_using_ideas(keywords_to_query, target_to_use)
    print(f"Success. Retrieved {len(response_2.results)} ideas.")


if __name__ == '__main__':
    asyncio.run(main_test())
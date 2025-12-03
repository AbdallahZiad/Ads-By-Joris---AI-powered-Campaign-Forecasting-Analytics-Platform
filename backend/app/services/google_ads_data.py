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

        Args:
            geo_id: The numeric ID of the geographical target (e.g., '2840' for US).

        Returns:
            The resource name string (e.g., "geoTargetConstants/2840").
        """
        return f"geoTargetConstants/{geo_id}"

    def _get_language_constraints_string(self, language_constant_id) -> str:
        """ Format a language constant ID into the required resource name.
            Args:
                language_constant_id: The numeric ID (e.g., '1000' for English).
            Returns:
                The resource name (e.g., "languageConstants/1000").
        """
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

    def _execute_api_call_sync(self, api_method: Callable, **kwargs) -> Any:
        """
        Centralized request executor with robust retry logic for Google Ads API (GoogleAdsException)
        and underlying gRPC (ResourceExhausted) rate limit errors.
        """
        last_exception = None

        for attempt in range(self._MAX_RETRIES):
            try:
                # 1. Execute the actual API call
                return api_method(**kwargs)

            except (GoogleAdsException, ResourceExhausted) as e:  # <-- Catch BOTH types!
                last_exception = e
                is_rate_limit = False

                if isinstance(e, ResourceExhausted):
                    # ResourceExhausted from gRPC is always a rate limit issue
                    is_rate_limit = True
                elif isinstance(e, GoogleAdsException):
                    # GoogleAdsException requires structured inspection
                    is_rate_limit = self._is_rate_limit_error(e)

                if is_rate_limit:
                    if attempt < self._MAX_RETRIES - 1:
                        # Exponential Backoff with jitter
                        sleep_time = (self._BASE_SLEEP_SECONDS * (2 ** attempt)) + random.uniform(0, 1)
                        print(
                            f"Rate limit hit ({type(e).__name__}). Retrying in {sleep_time:.2f}s... "
                            f"(Attempt {attempt + 1}/{self._MAX_RETRIES})"
                        )
                        time.sleep(sleep_time)
                        continue  # Start the next attempt
                    else:
                        # Max retries reached
                        print(f"Failed after {self._MAX_RETRIES} attempts.")
                        raise last_exception  # Re-raise the exception

                else:
                    # Not a rate limit error (Auth, Invalid Argument), fail immediately
                    print(f"Non-rate-limit error occurred.")
                    raise last_exception

            except Exception as e:
                # Catch any unknown system/network errors
                print(f"Caught unexpected system error: {type(e).__name__}. Failing immediately.")
                raise e

        # This line is a fail-safe
        if last_exception:
            raise last_exception
        raise RuntimeError("Max retries exceeded for Google Ads API call") from last_exception

    async def _execute_api_call(self, api_method: Callable, **kwargs) -> Any:
        """
        Asynchronous wrapper for the synchronous API call using asyncio.to_thread.
        """
        # Offload the synchronous work (including time.sleep and retries)
        # to a separate thread, keeping the main thread free.
        return await asyncio.to_thread(self._execute_api_call_sync, api_method, **kwargs)

    def _get_historical_metrics_options(self, years_of_history: int):
        # --- Configure Historical Metrics Options (Date Range, CPC) ---
        historical_metrics_options = self.client.get_type("HistoricalMetricsOptions")

        # Calculate a dynamic date range: Up to the start of the current month
        today = datetime.now()
        end_date = today.replace(day=1)

        # Calculate start date to cover the requested years
        # We look back one month beyond the required range to ensure a clean N full years
        # when the API returns data up to the preceding month.
        months_to_fetch = (years_of_history * 12) + 1
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

        Uses the optional 'target' object to override instance defaults if provided.

        Args:
            request: The Protobuf request object (e.g., GenerateKeywordHistoricalMetricsRequest).
            target: Optional GoogleAdsTargeting object to override instance defaults.
        """
        # Determine the targeting object to use (provided target or instance default)
        target_to_use = target if target else self.targeting

        # 1. Set Customer ID
        # Note: The 'customer_id' field is present on most requests
        request.customer_id = target_to_use.customer_id

        # 2. Set Geo Constraints
        geo_target_ids = [self._get_geo_constraints_string(target_to_use.geo_target_id)]

        # Check if the request object has the required field before extending
        if hasattr(request, 'geo_target_constants'):
            request.geo_target_constants.extend(geo_target_ids)
        elif hasattr(request, 'geo_target_constants_names'):
            # Some requests use 'geo_target_constants_names'
            request.geo_target_constants_names.extend(geo_target_ids)

        # 3. Set Language Constraint
        language_resource = self._get_language_constraints_string(target_to_use.language_constant_id)

        # Check if the request object has the required field
        if hasattr(request, 'language'):
            request.language = language_resource
        elif hasattr(request, 'language_constants'):
            # Some requests use a list for language (e.g., GenerateKeywordIdeasRequest)
            request.language_constants.extend([language_resource])

    def _proto_to_dict(self, proto_message: Any) -> dict:
        """
        Consistently converts a Protobuf Message instance to a dictionary,
        ensuring string enums are used.
        """
        return proto.Message.to_dict(proto_message, use_integers_for_enums=False)

    def _convert_pager_to_dict_list(self, pager_instance: Any) -> List[dict]:
        """
        Converts a Google Ads Pager instance (iterator of Protobuf messages)
        into a list of dictionaries, ensuring string enums are used.
        """
        return [self._proto_to_dict(item) for item in pager_instance]

    def _filter_keywords_without_metrics(self, response, first_n_keywords: int = None):
        if "results" in response and isinstance(response["results"], list):
            # Filter the list: keep only results where 'keyword_idea_metrics' is present
            filtered_results = [
                r for r in response["results"]
                if r.get("keyword_idea_metrics") is not None
            ]

            # Replace the original results with the filtered list
            response["results"] = filtered_results if first_n_keywords is None else filtered_results[:first_n_keywords]

    # --------------------------------------------------------------------------
    # --- Public API Methods ---
    # --------------------------------------------------------------------------

    async def get_keywords_historical_metrics(
            self,
            keywords: List[str],
            target: Optional[GoogleAdsTargeting] = None,
            years_of_history: int = 5
    ) -> GoogleAdsKeywordResponse:
        """
        Retrieves historical search metrics (search volume, competition, bids) for a list of keywords.

        The method handles the complex Protobuf request construction and uses Pydantic
        for clean, validated data output.

        Args:
            keywords: A list of keyword phrases to query (e.g., ['Samsung']).
            target: Optional Pydantic target object to override the default geo & language constraints.
            years_of_history: The number of full years of historical data to fetch.

        Returns:
            A validated HistoricalMetricsResponse Pydantic object containing results
            for each keyword.
        """

        # Get the required service client
        keyword_plan_idea_service = self._get_service("KeywordPlanIdeaService")

        # --- Build the Request Object ---
        request = self.client.get_type("GenerateKeywordHistoricalMetricsRequest")
        request.historical_metrics_options = self._get_historical_metrics_options(years_of_history)
        request.keywords.extend(keywords)
        self._add_targeting_to_request(request, target)

        # --- Execute API Call and Validate ---
        raw_response = await self._execute_api_call(
            api_method=keyword_plan_idea_service.generate_keyword_historical_metrics,
            request=request
        )

        response_data = self._proto_to_dict(raw_response)
        # With optional metrics in schema, this validation will now succeed even if some data is missing
        response: GoogleAdsKeywordResponse = GoogleAdsKeywordResponse.model_validate(response_data)

        return response

    async def enrich_keywords_using_ideas(
            self,
            seed_keywords: List[str],
            target: Optional[GoogleAdsTargeting] = None,
            years_of_history: int = 5,
            maximum_number_of_new_keywords: int = None
    ) -> GoogleAdsKeywordResponse:
        """
        Generates new keyword ideas and retrieves enriched metrics for seed keywords asynchronously.

        This method executes the GenerateKeywordIdeas API call, which returns a Pager object
        that is streamed and validated by the KeywordIdeaResponse model.

        Args:
            seed_keywords: A list of keyword phrases to use as seeds for idea generation.
            target: Optional Pydantic target object to override the default geo & language constraints.
            years_of_history: The number of full years of historical data to fetch.
            maximum_number_of_new_keywords: The maximum number of new keyword ideas to generate.
        Returns:
            A validated KeywordIdeaResponse Pydantic object containing new keyword ideas
            and their detailed metrics.
        """
        keyword_plan_idea_service = self._get_service("KeywordPlanIdeaService")
        request = self.client.get_type("GenerateKeywordIdeasRequest")

        # --- 1. Build Protobuf Request ---

        # Use the centralized helper for customer ID, geo, and language
        self._add_targeting_to_request(request, target)

        # Set the seed keywords (method-specific field)
        request.keyword_seed.keywords.extend(seed_keywords)

        # Request the specific time-frame
        request.historical_metrics_options = self._get_historical_metrics_options(years_of_history)

        # --- 2. Execute API Call (AWAIT the network I/O, returns Pager) ---
        raw_response_pager = await self._execute_api_call(
            api_method=keyword_plan_idea_service.generate_keyword_ideas,
            request=request
        )

        # --- 3. Convert Pager and Validate ---

        # Stream the Pager into a list of dictionaries using the new helper
        results_list = self._convert_pager_to_dict_list(raw_response_pager)

        # Package the list into the expected top-level dictionary structure {"results": [...]},
        # which matches the KeywordIdeaResponse Pydantic model.
        response_data = {"results": results_list}
        if maximum_number_of_new_keywords is not None:
            self._filter_keywords_without_metrics(
                response_data,
                first_n_keywords=len(seed_keywords) + maximum_number_of_new_keywords
            )
        else:
            self._filter_keywords_without_metrics(response_data)

        # Validate and return
        response: GoogleAdsKeywordResponse = GoogleAdsKeywordResponse.model_validate(response_data)

        return response


async def main_test():
    service = GoogleAdsDataService()

    # Define the keywords to analyze
    keywords_to_query = ['samsung galaxy s24', 'apple iphone 15 pro max']
    target_to_use = GoogleAdsTargeting(language_constant_id="1000", geo_target_id="2840")

    response_1: GoogleAdsKeywordResponse = await service.get_keywords_historical_metrics(keywords_to_query, target_to_use)
    print(json.dumps(response_1.results[0].model_dump(), indent=4))

    response_2: GoogleAdsKeywordResponse = await service.enrich_keywords_using_ideas(keywords_to_query, target_to_use)
    print(json.dumps(response_2.results[0].model_dump(), indent=4))


if __name__ == '__main__':
    asyncio.run(main_test())
import json
import os
import asyncio
import math
import time
from typing import List, Dict, Type, Any

from pydantic import BaseModel, ValidationError
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam, ChatCompletionSystemMessageParam, \
    ChatCompletionUserMessageParam
from openai.lib.azure import OpenAIError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.schemas.llm_schemas import (
    ExtractedKeywordResults, CategoryNames, KeywordCategoryMapping,
    FinalKeywordHierarchy, KeywordGroups, LLMResult, LLMTokenMetrics,
    PhaseMetrics, Phase
)


# --- Custom Exception ---

class LLMServiceError(Exception):
    """Custom exception for LLM service failures (e.g., after all retries fail)."""
    pass


# --- LLM Service ---

class LLMService:
    """
    Service responsible for all interactions with the OpenAI LLM,
    managing authentication, token cost tracking, chunking, and structured output parsing.
    """

    # Internal Configuration Constants
    _MODEL_NAME = "gpt-4o-mini"
    _MAX_INPUT_TOKENS = 10000
    _CHUNK_OVERLAP = 50
    _MAX_RESPONSE_TOKENS = 2000
    _MAX_PROMPT_TOKENS = _MAX_INPUT_TOKENS - _MAX_RESPONSE_TOKENS
    _RETRY_ATTEMPTS = 3
    _PROMPT_DIR = "app/prompts"
    _MAX_CONCURRENT_API_CALLS = 3

    def __init__(self):
        # 1. Authentication and Client Initialization
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        # 2. Token and Metrics Tracking
        self._total_tokens_used: int = 0
        # Phase-specific counters for the current run
        self._current_phase_tokens: int = 0
        self._current_phase_api_calls: int = 0
        # Final metrics storage
        self._phase_metrics: Dict[Phase, PhaseMetrics] = {}

    # --- Internal Helpers ---

    def get_token_metrics(self) -> LLMTokenMetrics:
        """Provides the current accumulated token usage and phase metrics for the instance."""
        return LLMTokenMetrics(
            total_tokens=self._total_tokens_used,
            phase_metrics=self._phase_metrics
        )

    def _load_prompt_template(self, filename: str) -> str:
        """Loads a prompt template from the dedicated file system."""
        path = os.path.join(self._PROMPT_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError as e:
            # Raise a specific service error to be caught higher up
            raise LLMServiceError(f"Prompt template file not found: {path}") from e

    async def _track_phase_stats(self, phase: Phase, phase_coro: Any) -> Any:
        """Wraps an async pipeline phase, tracking time, tokens, and API calls."""
        self._current_phase_tokens = 0
        self._current_phase_api_calls = 0
        start_time = time.time()

        result = await phase_coro

        end_time = time.time()
        time_taken = end_time - start_time

        self._phase_metrics[phase] = PhaseMetrics(
            time_taken_seconds=time_taken,
            tokens_used=self._current_phase_tokens,
            api_calls=self._current_phase_api_calls
        )

        return result

    @retry(
        stop=stop_after_attempt(_RETRY_ATTEMPTS),
        wait=wait_exponential(min=2, max=5),
        # Retry on OpenAI API errors, Pydantic validation failures, and network timeouts
        retry=retry_if_exception_type((OpenAIError, ValidationError, json.JSONDecodeError, asyncio.TimeoutError))
    )
    async def _call_api_with_retry(
            self,
            prompt_filename: str,
            input_data: Dict[str, Any],
            response_model: Type[BaseModel],
            semaphore: asyncio.Semaphore = None
    ) -> Any:
        """
        Executes an OpenAI chat completion using JSON mode, validates the
        raw JSON response, and increments the total token counter.
        The optional `semaphore` is used to limit concurrent API calls.
        """

        # Use the semaphore if provided to limit concurrent requests
        if semaphore:
            async with semaphore:
                return await self._execute_api_call(prompt_filename, input_data, response_model)
        else:
            return await self._execute_api_call(prompt_filename, input_data, response_model)

    async def _execute_api_call(
            self,
            prompt_filename: str,
            input_data: Dict[str, Any],
            response_model: Type[BaseModel]
    ) -> Any:
        """
        Internal function to handle the actual API communication,
        separated to allow the semaphore to wrap the whole call.
        """
        # 1. Load and Format Prompt
        template = self._load_prompt_template(prompt_filename)
        user_content = template.format(**input_data)

        # 2. Build Messages
        messages: List[ChatCompletionMessageParam] = [
            ChatCompletionSystemMessageParam(
                role="system",
                content=f"You are an expert keyword and categorization AI. Respond ONLY with a JSON object that strictly adheres to the schema for the type: {response_model.__name__}."
            ),
            ChatCompletionUserMessageParam(
                role="user",
                content=user_content
            )
        ]

        # 3. API Call
        try:
            self._current_phase_api_calls += 1
            response = await self.client.chat.completions.create(
                model=self._MODEL_NAME,
                messages=messages,
                n=1,
                # Explicitly request JSON output
                response_format={"type": "json_object"},
                temperature=0.0
            )

            # --- Token Tracking Addition ---
            if response.usage and response.usage.total_tokens:
                tokens = response.usage.total_tokens
                self._total_tokens_used += tokens
                self._current_phase_tokens += tokens

            # 4. Extract and Validate
            json_string = response.choices[0].message.content

            # This can raise json.JSONDecodeError (caught by @retry)
            data_dict = json.loads(json_string)

            # This can raise ValidationError (caught by @retry)
            validated_response = response_model.model_validate(data_dict)

            return validated_response

        except (OpenAIError, ValidationError, json.JSONDecodeError) as e:
            # Re-raise to trigger the Tenacity retry decorator
            print(f"LLM API attempt failed with error: {type(e).__name__}. Retrying...")
            raise

    def _split_text_into_chunks(self, text: str) -> List[str]:
        """Splits the input text into token-aware chunks."""
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            model_name=self._MODEL_NAME,
            chunk_size=self._MAX_PROMPT_TOKENS,
            chunk_overlap=self._CHUNK_OVERLAP
        )
        return text_splitter.split_text(text)

    def _clean_keywords(self, keywords: List[str]) -> List[str]:
        """Normalizes and de-duplicates the aggregated keyword list."""
        cleaned = {kw.strip().lower() for kw in keywords if kw.strip()}
        # Return unique, sorted keywords
        return [kw for kw in sorted(list(cleaned)) if kw]

    # --- Public Pipeline Methods ---

    async def extract_keywords_from_text(self, text: str, max_keywords: int = 500) -> List[str]:
        """
        Splits text, runs throttled parallel API calls to extract keywords from chunks,
        and aggregates/cleans the results, respecting a max limit.
        """

        chunks = self._split_text_into_chunks(text)
        if not chunks:
            return []

        print(f"Starting keyword extraction with {len(chunks)} chunks.")

        # Initialize semaphore to limit concurrent API calls (e.g., to 3)
        semaphore = asyncio.Semaphore(self._MAX_CONCURRENT_API_CALLS)

        tasks = [
            self._call_api_with_retry(
                prompt_filename="keyword_extract.txt",
                input_data={"text_chunk": chunk},
                response_model=ExtractedKeywordResults,
                semaphore=semaphore
            )
            for chunk in chunks
        ]

        # Use asyncio.gather for parallel processing, constrained by the semaphore
        results: List[ExtractedKeywordResults] = await asyncio.gather(*tasks, return_exceptions=True)

        master_keywords: List[str] = []

        # Aggregate and check limit
        for res in results:
            if isinstance(res, ExtractedKeywordResults):
                master_keywords.extend(res.keywords)

                # Stop aggregating if limit is reached
                if len(master_keywords) >= max_keywords:
                    master_keywords = master_keywords[:max_keywords]
                    break
            elif isinstance(res, Exception):
                # The exception is already logged during the retry process, just report here
                print(f"Warning: Failed to process a chunk: {type(res).__name__}. Continuing...")

        return self._clean_keywords(master_keywords)

    async def generate_categories(self, keywords: List[str], number_of_categories: int = None) -> List[str]:
        """
        Takes a list of keywords and prompts the LLM to generate high-level category names.
        This call is not parallelized, so no semaphore is needed.
        """
        print(f"Generating categories for {len(keywords)} keywords...")

        # Calculate a suggested number of categories if not provided
        if number_of_categories is None:
            # Simple heuristic: 5 categories minimum, max 30, roughly 1 per 50 keywords
            number_of_categories = max(5, min(30, math.ceil(len(keywords) / 50)))

        # No semaphore passed as this is a single, sequential API call
        result: CategoryNames = await self._call_api_with_retry(
            prompt_filename="category_gen.txt",
            input_data={
                "keywords": "\n".join(keywords),
                "max_categories": number_of_categories
            },
            response_model=CategoryNames
        )

        print(f"Generated {len(result.categories)} categories.")

        # Simple cleaning of category names
        return [cat.strip() for cat in result.categories if cat.strip()]

    async def _categorize_keywords_pass_1(self, keywords: List[str], categories: List[str]) -> Dict[str, List[str]]:
        """
        PRIVATE: Performs the first pass: maps all keywords to the given categories.
        Returns a clean dictionary (unwrapped from RootModel).
        This call is not parallelized, so no semaphore is needed.
        """
        print("Starting Pass 1: Categorizing keywords into pre-defined categories...")

        # The output is a RootModel[Dict[str, List[str]]]
        # No semaphore passed as this is a single, sequential API call
        result: KeywordCategoryMapping = await self._call_api_with_retry(
            prompt_filename="keyword_categorize.txt",
            input_data={
                "keywords": "\n".join(keywords),
                "categories": ", ".join(categories)
            },
            response_model=KeywordCategoryMapping
        )

        # Access the underlying dictionary using .root for clean usage
        return result.root

    async def group_keywords_by_category(self, category_mapping: Dict[str, List[str]]) -> List[FinalKeywordHierarchy]:
        """
        Performs the final, throttled concurrent grouping pass: breaks keywords within
        each category into smaller, tightly-themed groups.
        """

        if not category_mapping:
            return []

        print(f"Starting final Pass 2: Concurrent grouping for {len(category_mapping)} categories.")

        # Initialize semaphore to limit concurrent API calls (e.g., to 3)
        semaphore = asyncio.Semaphore(self._MAX_CONCURRENT_API_CALLS)

        tasks = []
        for category, keywords in category_mapping.items():
            if keywords:
                # Append a tuple of (category_name, async_task)
                task = self._call_api_with_retry(
                    prompt_filename="group_generation.txt",
                    input_data={
                        "category_name": category,
                        "keywords": "\n".join(keywords)
                    },
                    response_model=KeywordGroups,
                    semaphore=semaphore
                )
                tasks.append((category, task))

        # Run all category grouping tasks concurrently, constrained by the semaphore
        results: List[KeywordGroups] = await asyncio.gather(*[task for _, task in tasks], return_exceptions=True)

        final_hierarchy: List[FinalKeywordHierarchy] = []

        # Re-associate results with their original category name
        for (category_name, _), result in zip(tasks, results):
            if isinstance(result, KeywordGroups):
                print(f"Success processing category '{category_name}'. Found {len(result.groups)} groups.")
                final_hierarchy.append(
                    FinalKeywordHierarchy(
                        category_name=category_name,
                        groups=result.groups
                    )
                )
            elif isinstance(result, Exception):
                print(
                    f"Error processing category '{category_name}'. Skipping: {type(result).__name__}. See warning in retry loop.")
            else:
                print(f"Warning: Unexpected result type for category '{category_name}'. Skipping.")

        return final_hierarchy

    # --- Orchestration Method (For the Pipeline Service to call) ---

    async def run_full_extraction_categorization_pipeline(self, text: str, max_keywords: int = 500) -> LLMResult:
        """
        Runs the full, multistep keyword hierarchy generation process and
        returns the structured data along with the total token cost.
        """
        # Clear token and metrics counters for a new run
        self._total_tokens_used = 0
        self._phase_metrics = {}

        # 1. Keyword Extraction (Chunking + Parallel API Calls)
        master_keywords = await self._track_phase_stats(
            Phase.KEYWORD_EXTRACTION,
            self.extract_keywords_from_text(text, max_keywords)
        )
        if not master_keywords:
            print("Pipeline stopped: No keywords extracted.")
            return LLMResult(data=[], metrics=self.get_token_metrics())

        # 2. Category Generation
        categories = await self._track_phase_stats(
            Phase.CATEGORY_GENERATION,
            self.generate_categories(master_keywords)
        )
        if not categories:
            print("Pipeline stopped: Failed to generate categories.")
            return LLMResult(data=[], metrics=self.get_token_metrics())

        # 3. Categorization Pass 1 (Keywords -> Categories)
        category_mapping_dict = await self._track_phase_stats(
            Phase.KEYWORD_CATEGORIZATION,
            self._categorize_keywords_pass_1(master_keywords, categories)
        )

        # 4. Grouping Pass 2 (Categories -> Groups -> Keywords) - Concurrently
        final_hierarchy = await self._track_phase_stats(
            Phase.KEYWORD_GROUPING,
            self.group_keywords_by_category(category_mapping_dict)
        )

        # 5. Final Result Packaging
        return LLMResult(
            data=final_hierarchy,
            metrics=self.get_token_metrics()
        )

async def main_test():
    service = LLMService()

    text = """Sample text for testing."""
    response = await service.run_full_extraction_categorization_pipeline(text)
    final_categories = [x.model_dump() for x in response.data]

    print(json.dumps(final_categories, indent=4))
    print(json.dumps(response.metrics.model_dump(), indent=4))

if __name__ == '__main__':
    asyncio.run(main_test())
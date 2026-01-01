import asyncio
import math
from typing import List, Dict

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.services.llm_base import BaseLLMService
from app.core.google_ads_constants import GEO_TARGET_MAP, LANGUAGE_MAP
from app.schemas.llm_schemas import (
    ExtractedKeywordResults, CategoryNames, KeywordCategoryMapping,
    FinalKeywordHierarchy, KeywordGroups, LLMResult, Phase,
    LLMTokenMetrics, PhaseMetrics, GeoLangLLMResult, GoogleAdsSettings
)


class AIScanLLMService(BaseLLMService):
    """
    Specialized LLM Service for the Website Scanning Pipeline.
    Handles extraction, categorization, grouping, and geo/lang detection.
    """

    _MAX_INPUT_TOKENS = 10000
    _CHUNK_OVERLAP = 50
    _MAX_RESPONSE_TOKENS = 2000
    _MAX_PROMPT_TOKENS = _MAX_INPUT_TOKENS - _MAX_RESPONSE_TOKENS
    _MAX_CONCURRENT_API_CALLS = 3

    def _split_text_into_chunks(self, text: str) -> List[str]:
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            model_name=self._MODEL_NAME,
            chunk_size=self._MAX_PROMPT_TOKENS,
            chunk_overlap=self._CHUNK_OVERLAP
        )
        return text_splitter.split_text(text)

    def _clean_keywords(self, keywords: List[str]) -> List[str]:
        cleaned = {kw.strip().lower() for kw in keywords if kw.strip()}
        return [kw for kw in sorted(list(cleaned)) if kw]

    # --- NEW FEATURE: Geo & Language Detection ---
    async def detect_geo_and_language(self, text_excerpt: str) -> GoogleAdsSettings:
        """
        Uses LLM to identify Country/Language names, then looks up IDs in Python constants.
        """
        # Truncate text to save tokens (first 2000 chars is usually enough for context)
        safe_excerpt = text_excerpt[:2000]

        llm_result: GeoLangLLMResult = await self._call_api_with_retry(
            prompt_filename="geo_lang_detect.txt",
            input_data={"text_excerpt": safe_excerpt},
            response_model=GeoLangLLMResult
        )

        detected_country = llm_result.country.strip()
        detected_lang = llm_result.language.strip()

        # Intelligent Python Lookup
        # 1. Direct Match
        geo_id = GEO_TARGET_MAP.get(detected_country)
        lang_id = LANGUAGE_MAP.get(detected_lang)

        # 2. Fallback: Case-insensitive search if direct match fails
        if not geo_id:
            for k, v in GEO_TARGET_MAP.items():
                if k.lower() == detected_country.lower():
                    geo_id = v
                    detected_country = k # Correct the name casing
                    break

        if not lang_id:
            for k, v in LANGUAGE_MAP.items():
                if k.lower() == detected_lang.lower():
                    lang_id = v
                    detected_lang = k # Correct the name casing
                    break

        return GoogleAdsSettings(
            geo_target_id=geo_id, # Can be None if strictly no match found
            geo_target_name=detected_country,
            language_id=lang_id,  # Can be None if strictly no match found
            language_name=detected_lang
        )

    # --- Existing Pipeline Methods ---

    async def extract_keywords_from_text(self, text: str, max_keywords: int = 500) -> List[str]:
        chunks = self._split_text_into_chunks(text)
        if not chunks: return []

        print(f"Starting keyword extraction with {len(chunks)} chunks.")
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

        results = await asyncio.gather(*tasks, return_exceptions=True)
        master_keywords = []

        for res in results:
            if isinstance(res, ExtractedKeywordResults):
                master_keywords.extend(res.keywords)
                if len(master_keywords) >= max_keywords:
                    master_keywords = master_keywords[:max_keywords]
                    break
            elif isinstance(res, Exception):
                print(f"Warning: Chunk processing failed: {type(res).__name__}")

        return self._clean_keywords(master_keywords)

    async def generate_categories(self, keywords: List[str]) -> List[str]:
        number_of_categories = max(5, min(30, math.ceil(len(keywords) / 50)))
        result = await self._call_api_with_retry(
            prompt_filename="category_gen.txt",
            input_data={
                "keywords": "\n".join(keywords),
                "max_categories": number_of_categories
            },
            response_model=CategoryNames
        )
        return [cat.strip() for cat in result.categories if cat.strip()]

    async def categorize_keywords_pass_1(self, keywords: List[str], categories: List[str]) -> Dict[str, List[str]]:
        result = await self._call_api_with_retry(
            prompt_filename="keyword_categorize.txt",
            input_data={
                "keywords": "\n".join(keywords),
                "categories": ", ".join(categories)
            },
            response_model=KeywordCategoryMapping
        )
        return result.root

    async def group_keywords_by_category(self, category_mapping: Dict[str, List[str]]) -> List[FinalKeywordHierarchy]:
        if not category_mapping: return []

        print(f"Starting final Pass 2: Concurrent grouping for {len(category_mapping)} categories.")
        semaphore = asyncio.Semaphore(self._MAX_CONCURRENT_API_CALLS)
        tasks = []

        for category, keywords in category_mapping.items():
            if keywords:
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

        results = await asyncio.gather(*[task for _, task in tasks], return_exceptions=True)
        final_hierarchy = []

        for (category_name, _), result in zip(tasks, results):
            if isinstance(result, KeywordGroups):
                final_hierarchy.append(FinalKeywordHierarchy(category_name=category_name, groups=result.groups))
            else:
                print(f"Error processing category '{category_name}'.")

        return final_hierarchy

    async def run_full_extraction_categorization_pipeline(self, text: str, max_keywords: int = 500) -> LLMResult:
        """Orchestrator for the AI Scan Pipeline."""
        self._total_tokens_used = 0
        self._phase_metrics = {}

        # --- Phase 1: Geo & Language Detection (Run First) ---
        # We only need a small excerpt, so we take the first 3000 chars of the raw text.
        ads_config = await self._track_phase_stats(
            Phase.GEO_LANG_DETECTION,
            self.detect_geo_and_language(text[:3000])
        )

        # --- Phase 2: Keyword Extraction ---
        master_keywords = await self._track_phase_stats(
            Phase.KEYWORD_EXTRACTION, self.extract_keywords_from_text(text, max_keywords)
        )

        # Early Exit if no keywords
        if not master_keywords:
            return LLMResult(
                data=[],
                metrics=self.get_token_metrics(),
                ads_config=ads_config
            )

        # --- Phase 3: Category Generation ---
        categories = await self._track_phase_stats(
            Phase.CATEGORY_GENERATION, self.generate_categories(master_keywords)
        )

        if not categories:
            return LLMResult(
                data=[],
                metrics=self.get_token_metrics(),
                ads_config=ads_config
            )

        # --- Phase 4: Categorization ---
        category_mapping = await self._track_phase_stats(
            Phase.KEYWORD_CATEGORIZATION, self.categorize_keywords_pass_1(master_keywords, categories)
        )

        # --- Phase 5: Grouping ---
        final_hierarchy = await self._track_phase_stats(
            Phase.KEYWORD_GROUPING, self.group_keywords_by_category(category_mapping)
        )

        return LLMResult(
            data=final_hierarchy,
            metrics=self.get_token_metrics(),
            ads_config=ads_config # Include the detected config
        )
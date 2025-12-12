import asyncio
import math
from typing import List, Dict

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.services.llm_base import BaseLLMService
# FIX: Added LLMTokenMetrics, PhaseMetrics to imports
from app.schemas.llm_schemas import (
    ExtractedKeywordResults, CategoryNames, KeywordCategoryMapping,
    FinalKeywordHierarchy, KeywordGroups, LLMResult, Phase,
    LLMTokenMetrics, PhaseMetrics
)

class AIScanLLMService(BaseLLMService):
    """
    Specialized LLM Service for the Website Scanning Pipeline.
    Handles extraction, categorization, and grouping.
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

        master_keywords = await self._track_phase_stats(
            Phase.KEYWORD_EXTRACTION, self.extract_keywords_from_text(text, max_keywords)
        )
        if not master_keywords: return LLMResult(data=[], metrics=self.get_token_metrics())

        categories = await self._track_phase_stats(
            Phase.CATEGORY_GENERATION, self.generate_categories(master_keywords)
        )
        if not categories: return LLMResult(data=[], metrics=self.get_token_metrics())

        category_mapping = await self._track_phase_stats(
            Phase.KEYWORD_CATEGORIZATION, self.categorize_keywords_pass_1(master_keywords, categories)
        )

        final_hierarchy = await self._track_phase_stats(
            Phase.KEYWORD_GROUPING, self.group_keywords_by_category(category_mapping)
        )

        return LLMResult(data=final_hierarchy, metrics=self.get_token_metrics())
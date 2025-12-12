import asyncio
import json
import time
from typing import List, Tuple

from app.services.web_crawler import CrawlConfig, CrawlStats, WebCrawlerService
from app.services.llm_aiscan import AIScanLLMService
# FIX: Import schemas from the correct location
from app.schemas.llm_schemas import LLMResult, LLMTokenMetrics, PhaseMetrics


class AIScanService:
    """
    Orchestrates the complete AI Website Scan pipeline by chaining the
    WebCrawlerService and the AIScanLLMService.

    This service provides a unified entry point to fetch raw content and immediately
    process it through the multistep keyword hierarchy generation pipeline.
    """

    def __init__(self):
        pass

    async def _run_crawler(
            self, config: CrawlConfig
    ) -> Tuple[List[str], CrawlStats]:
        """Runs the web scanning portion and returns raw data and crawler stats."""
        print("--- 1. WEB CRAWL (Extraction) ---")

        crawler_service = WebCrawlerService(config)
        extracted_text, stats = await crawler_service.crawl_website()

        return extracted_text, stats

    async def _run_llm_pipeline_step(
            self, raw_text_snippets: List[str]
    ) -> LLMResult:
        """Runs the LLM keyword processing pipeline on the crawled text."""
        print("--- 2. LLM KEYWORD PIPELINE (Processing) ---")

        llm_service = AIScanLLMService()

        # Combine all snippets into one large text blob for processing
        full_text_content = "\n".join(raw_text_snippets)

        if not full_text_content.strip():
            print("LLM pipeline skipped: No text content was successfully extracted.")
            # Return a valid PipelineResult with zero tokens
            return LLMResult(data=[], metrics=LLMTokenMetrics(total_tokens=0, phase_metrics={}))

        # Run the full, robust LLM pipeline
        pipeline_result = await llm_service.run_full_extraction_categorization_pipeline(
            text=full_text_content
        )

        return pipeline_result

    def _display_llm_metrics(self, metrics: LLMTokenMetrics):
        """Prints a clean, cohesive summary of the LLM pipeline metrics."""
        print("\n--- LLM Processing Metrics (Per Phase) ---")

        # Sort phases by their time taken, for high-value display
        sorted_phases = sorted(
            metrics.phase_metrics.items(),
            key=lambda item: item[1].time_taken_seconds,
            reverse=True
        )

        for phase_name, p_metrics in sorted_phases:
            # Clean up the phase name for display
            display_name = phase_name.value.replace('_', ' ').title()
            time_str = f"{p_metrics.time_taken_seconds:.2f}s"
            tokens_str = f"{p_metrics.tokens_used:,} tokens"
            calls_str = f"{p_metrics.api_calls} calls"

            print(f"  • {display_name:<25}: {time_str:>8} | {tokens_str:>16} | {calls_str:>10}")

        print("\n--- LLM Pipeline Totals ---")
        print(f"  • Total Tokens Used: {metrics.total_tokens:,}")

    async def scan_website(
            self, config: CrawlConfig
    ) -> Tuple[LLMResult, CrawlStats]:
        """
        Executes the complete website scan and AI processing pipeline.

        Args:
            config: The CrawlConfig defining scope, depth, politeness, etc.

        Returns:
            A tuple containing the final PipelineResult (structured hierarchy + metrics)
            and the CrawlStats (web scanning metadata).
        """
        start_time = time.time()

        # Step 1: Crawl the website to get raw, clean text
        raw_text_snippets, crawler_stats = await self._run_crawler(config)

        # Step 2: Process text using the LLM pipeline
        pipeline_result = await self._run_llm_pipeline_step(raw_text_snippets)

        # Finalize overall statistics
        total_duration = round(time.time() - start_time, 2)

        # --- Final Summary ---
        print("\n=============================================")
        print(f"✅ AI Scan Pipeline Complete!")
        print(f"Total End-to-End Duration: {total_duration} seconds")
        print("=============================================")

        print("\n--- Web Crawler Statistics ---")
        print(f"  • Pages Scanned/Failed: {crawler_stats.pages_crawled} / {crawler_stats.pages_failed}")
        print(f"  • Total Crawl Duration: {crawler_stats.crawl_duration_seconds:.2f}s")
        print(f"  • Max Depth Reached: {crawler_stats.max_depth_reached}")
        print(f"  • Total Links Discovered: {crawler_stats.total_links_found:,}")
        print(f"  • Avg Page Size: {crawler_stats.average_page_size_bytes:,.0f} bytes")
        print(f"  • Robots.txt Found: {crawler_stats.robots_txt_found}")

        self._display_llm_metrics(pipeline_result.metrics)

        return pipeline_result, crawler_stats


async def main_test():
    scan_config = CrawlConfig(
        start_url="https://www.jumia.com.eg/",
        max_pages=10,
        max_depth=2,
        stay_in_domain=True,
        headlines_only=True,
        min_request_delay=0.5,
    )

    scanner = AIScanService()

    # Run the full pipeline
    result_data, scan_stats = await scanner.scan_website(scan_config)

    print("\n--- Final Structured Data ---")
    print(json.dumps(result_data.data, indent=4, default=lambda o: o.dict()))


if __name__ == '__main__':
    asyncio.run(main_test())
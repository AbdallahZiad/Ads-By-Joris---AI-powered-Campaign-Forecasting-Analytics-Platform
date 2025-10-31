from fastapi import APIRouter
from app.services.ai_scan import AIScanService
from app.schemas.web_crawler_schemas import CrawlConfig
from app.schemas.ai_scan_schemas import AIScanResponse

router = APIRouter(prefix='/ai-scan', tags=["AI Scan"])


@router.post(
    "/",
    response_model=AIScanResponse,
    summary="Execute the full AI Website Scan and Keyword Hierarchy Pipeline",
)
async def scan_website_and_process_keywords(
    config: CrawlConfig
):
    """
    Executes the complete, end-to-end AI website analysis pipeline:

    1. **Web Crawl (I/O Bound):** Fetches content based on the provided configuration (depth, pages, domain).
    2. **LLM Processing (Compute Bound):** Processes the extracted text through a multistep LLM pipeline to generate a structured keyword hierarchy (Categories -> Groups -> Keywords).

    The response provides the final structured data along with detailed operational metrics for both the web crawl and the LLM token usage.
    """
    scanner = AIScanService()

    llm_result, crawl_stats = await scanner.scan_website(config)

    return AIScanResponse(
        structured_data=llm_result.data,
        crawl_stats=crawl_stats,
        llm_metrics=llm_result.metrics
    )

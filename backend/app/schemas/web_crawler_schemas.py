from pydantic import BaseModel, Field

# --- Configuration Model ---
class CrawlConfig(BaseModel):
    """Defines the configuration parameters for a web crawl operation."""
    start_url: str = Field(
        ...,
        description="The root URL to begin the crawl.",
        examples=["https://example.com"]
    )
    max_pages: int = Field(100, ge=1, description="Maximum number of total pages to fetch.")
    max_depth: int = Field(2, ge=0, description="Max link levels deep to crawl (0 = start page only).")
    stay_in_domain: bool = Field(True, description="If True, only crawl links on the same domain as start_url.")
    headlines_only: bool = Field(True,
                                 description="If True, extract text only from H1-H6 tags. Otherwise, extract all visible text.")
    min_request_delay: float = Field(0.5, ge=0.0,
                                     description="Minimum delay (in seconds) between consecutive requests for politeness.")


# --- Statistics Model ---
class CrawlStats(BaseModel):
    """Statistics and metadata from the crawl operation."""
    pages_crawled: int = Field(..., description="The total number of unique URLs successfully fetched and processed.")
    pages_failed: int = Field(...,
                              description="The total number of URLs that failed after all retries or were non-HTML.")
    total_links_found: int = Field(..., description="The total number of unique links discovered across all pages.")
    crawl_duration_seconds: float = Field(..., description="The total time elapsed for the crawl operation.")
    average_page_size_bytes: float = Field(...,
                                           description="The average content size (in bytes) of successfully crawled pages.")
    robots_txt_found: bool = Field(...,
                                   description="Indicates whether a robots.txt file was successfully fetched and parsed.")
    max_depth_reached: int = Field(..., description="The maximum depth level reached during the crawl.")

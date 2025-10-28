import asyncio
import json
import re
import time
from typing import List, Optional, Set, Deque, Tuple
from urllib.parse import urljoin, urlparse
from collections import deque

import aiohttp
from pydantic import BaseModel, Field
from bs4 import BeautifulSoup, Comment
from urllib.robotparser import RobotFileParser


# --- Configuration Model ---

class CrawlConfig(BaseModel):
    """Defines the configuration parameters for a web crawl operation."""
    start_url: str = Field(..., description="The root URL to begin the crawl.")
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


# --- Custom Exception ---

class CrawlServiceError(Exception):
    """Custom exception for web crawler service failures."""
    pass


# --- Web Crawler Service ---

class WebCrawlerService:
    """
    A robust, asynchronous web crawler designed to extract clean text
    from a website based on strict constraints, politeness (robots.txt, delay),
    and efficient queue management.
    """

    # Internal Configuration Constants
    _MAX_CONCURRENT_REQUESTS = 10  # Politeness: Limit the max number of parallel requests
    _TIMEOUT_SECONDS = 15  # Timeout for any single content HTTP request
    _ROBOTS_TIMEOUT_SECONDS = 5  # Shorter timeout for the non-critical robots.txt file
    _MAX_RETRIES = 3  # Max retries for failed requests
    _ALLOWED_SCHEMES = ('http', 'https')
    _EXCLUDED_EXTENSIONS = (
        '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip',
        '.rar', '.exe', '.doc', '.docx', '.xls', '.xlsx',
        '.ppt', '.pptx', '.mp3', '.mp4', '.avi', '.mov'
    )

    def __init__(self, config: CrawlConfig):
        """Initializes the crawler with configuration and state management."""
        self.config = config

        # State tracking
        self.base_domain: str = urlparse(config.start_url).netloc
        self.visited_urls: Set[str] = set()
        self.pending_urls: Set[str] = set()  # O(1) check for URLs currently in the queue
        self.crawl_queue: Deque[tuple[str, int]] = deque()
        self.extracted_text: List[str] = []

        # Stats tracking
        self.stats = {
            'pages_failed': 0,
            'total_links_found': 0,
            'total_bytes_crawled': 0,
            'max_depth_reached': 0,
            'robots_txt_found': False
        }

        # Politeness and Concurrency control
        self.semaphore = asyncio.Semaphore(self._MAX_CONCURRENT_REQUESTS)
        self.robots_parser = self._initialize_robots_parser()

    def _initialize_robots_parser(self) -> RobotFileParser:
        """Initializes the standard library's robots.txt parser."""
        # Simple setup for the standard parser
        parser = RobotFileParser()
        robots_url = urljoin(self.config.start_url, 'robots.txt')
        parser.set_url(robots_url)
        return parser

    # --- Canonicalization and Link Filtering Helpers ---

    @staticmethod
    def _canonicalize_url(url: str) -> str:
        """
        Cleans and canonicalizes a URL for consistent storage in sets.
        Removes fragments and trailing slashes.
        """
        parsed = urlparse(url)

        # 1. Remove fragment
        clean_url = parsed._replace(fragment="").geturl()

        # 2. Remove trailing slash if path is not root '/'
        if clean_url.endswith('/') and clean_url != (parsed.scheme + '://' + parsed.netloc + '/'):
            clean_url = clean_url.rstrip('/')

        return clean_url

    def _is_valid_link(self, base_url: str, link_url: str, depth: int) -> Optional[str]:
        """
        Checks a potential link against all constraints and resolves/canonicalizes it.
        Returns the clean, absolute URL if valid, otherwise None.
        """
        # 1. Resolve to absolute URL and canonicalize
        absolute_url = urljoin(base_url, link_url)
        canonical_url = self._canonicalize_url(absolute_url)
        parsed_url = urlparse(canonical_url)

        # 2. Scheme and Path Validation
        if parsed_url.scheme not in self._ALLOWED_SCHEMES:
            return None
        if not parsed_url.path or parsed_url.path.lower().endswith(self._EXCLUDED_EXTENSIONS):
            return None

        # 3. Domain Constraint Check
        if self.config.stay_in_domain and parsed_url.netloc != self.base_domain:
            return None

        # 4. Depth Constraint Check
        if depth > self.config.max_depth:
            return None

        # 5. Check if already visited or pending (O(1) efficiency)
        if canonical_url in self.visited_urls or canonical_url in self.pending_urls:
            return None

        # 6. Politeness Check (Robots.txt)
        if not self.robots_parser.can_fetch("WebCrawlerService", canonical_url):
            return None

        return canonical_url

    # --- HTML Parsing Helpers ---

    def _extract_text_from_html(self, html_content: bytes, content_type: str) -> tuple[str, List[str]]:
        """
        Extracts clean text and new links from the HTML content based on config,
        handling character encoding explicitly.
        """

        # 1. Handle Encoding
        encoding = 'utf-8'  # Default fallback
        charset_match = re.search(r'charset=([\w-]+)', content_type, re.I)
        if charset_match:
            encoding = charset_match.group(1).strip()

        try:
            html_string = html_content.decode(encoding, errors='replace')
        except:
            # Fallback if the detected encoding fails completely
            html_string = html_content.decode('utf-8', errors='replace')

        soup = BeautifulSoup(html_string, 'html.parser')

        # 2. Remove non-content elements
        for tag in soup(["script", "style", "noscript", "meta", "link", "svg"]):
            tag.decompose()
        for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
            comment.extract()

        # 3. Conditional Text Extraction
        if self.config.headlines_only:
            tags = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            text = '\n'.join(tag.get_text(separator=' ', strip=True) for tag in tags)
        else:
            text = soup.get_text(separator='\n', strip=True)

        # Clean multiple whitespaces and newlines
        clean_text = re.sub(r'\s+', ' ', text).strip()

        # 4. Link Extraction
        links = [a.get('href') for a in soup.find_all('a', href=True)]

        return clean_text, links

    # --- Core Crawling Logic ---

    async def _fetch_url_with_retry(self, session: aiohttp.ClientSession, url: str) -> Optional[Tuple[bytes, str]]:
        """
        Fetches the content of a single URL with retries and politeness delay.
        Returns (content_bytes, content_type) on success, None otherwise.
        """

        # Introduce politeness delay before acquiring the semaphore
        await asyncio.sleep(self.config.min_request_delay)

        async with self.semaphore:  # Wait on the semaphore (max concurrent requests)
            for attempt in range(self._MAX_RETRIES):
                try:
                    # Use the standard content timeout
                    timeout = aiohttp.ClientTimeout(total=self._TIMEOUT_SECONDS)
                    # Note: aiohttp automatically follows redirects (default behaviour)
                    async with session.get(url, timeout=timeout) as response:
                        content_type = response.headers.get('Content-Type', '')

                        if response.status == 200 and 'text/html' in content_type:
                            content_bytes = await response.read()
                            # Track byte count for statistics
                            self.stats['total_bytes_crawled'] += len(content_bytes)
                            return content_bytes, content_type

                        if response.status >= 400:
                            print(f"[{url}] Attempt {attempt + 1}: Status {response.status}. Retrying...")
                            await asyncio.sleep(2 ** attempt)  # Exponential backoff
                            continue

                        # Status non-200 but not an error (e.g. image, video, 3xx redirect handled by aiohttp)
                        return None

                except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                    print(f"[{url}] Attempt {attempt + 1}: Connection error ({type(e).__name__}). Retrying...")
                    if attempt < self._MAX_RETRIES - 1:
                        await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    else:
                        print(f"[{url}] Failed after {self._MAX_RETRIES} attempts.")
                        self.stats['pages_failed'] += 1  # Update stats on final failure
                        return None
                except Exception as e:
                    print(f"[{url}] An unexpected error occurred: {e}")
                    self.stats['pages_failed'] += 1  # Update stats on final failure
                    return None
        return None

    async def _crawl_worker(self, session: aiohttp.ClientSession, url: str, depth: int):
        """
        Processes a single URL: fetches, extracts text, and queues new links.
        """

        # O(1) removal from pending set before adding to visited set
        if url in self.pending_urls:
            self.pending_urls.remove(url)
        self.visited_urls.add(url)
        self.stats['max_depth_reached'] = max(self.stats['max_depth_reached'], depth)  # Track max depth

        print(
            f"Crawling (Depth {depth}/{self.config.max_depth}, Pages {len(self.visited_urls)}/{self.config.max_pages}): {url}")

        result = await self._fetch_url_with_retry(session, url)

        if result and result[0]:
            html_content_bytes, content_type = result
            clean_text, links = self._extract_text_from_html(html_content_bytes, content_type)

            if clean_text:
                self.extracted_text.append(clean_text)

            # Queue new links for the next depth level
            if depth < self.config.max_depth:
                for link in links:
                    if len(self.visited_urls) >= self.config.max_pages:
                        break  # Max pages reached, stop link processing

                    valid_url = self._is_valid_link(url, link, depth + 1)

                    if valid_url and valid_url not in self.pending_urls:
                        # O(1) addition to pending set
                        self.pending_urls.add(valid_url)
                        self.crawl_queue.append((valid_url, depth + 1))
                        self.stats['total_links_found'] += 1  # Track links found

    # --- Public Orchestration Method ---

    async def crawl_website(self) -> Tuple[List[str], CrawlStats]:
        """
        Executes the full asynchronous crawl pipeline and returns a list
        of clean text extracted from all crawled pages along with metadata.
        """
        if not self.config.start_url:
            raise CrawlServiceError("Start URL must be provided in the configuration.")

        # Reset state and start timer
        self.__init__(self.config)  # Re-initialize all state variables
        start_time = time.time()

        # --- Initialization and Setup ---
        parsed_start = urlparse(self.config.start_url)
        if not all([parsed_start.scheme, parsed_start.netloc]):
            raise CrawlServiceError("Start URL is invalid or malformed.")

        self.base_domain = parsed_start.netloc

        start_canonical = self._canonicalize_url(self.config.start_url)
        self.crawl_queue = deque([(start_canonical, 0)])
        self.pending_urls.add(start_canonical)

        # 1. Fetch robots.txt
        try:
            robots_url = urljoin(start_canonical, '/robots.txt')
            timeout = aiohttp.ClientTimeout(total=self._ROBOTS_TIMEOUT_SECONDS)
            async with aiohttp.ClientSession() as session:
                async with session.get(robots_url, timeout=timeout) as response:
                    if response.status == 200:
                        raw_robots_txt = await response.text()
                        self.robots_parser.parse(raw_robots_txt.splitlines())
                        self.stats['robots_txt_found'] = True  # Update stats
                        print("Successfully fetched and parsed robots.txt.")
                    else:
                        print(
                            f"No robots.txt found at {robots_url} (Status: {response.status}). Proceeding without rules.")
        except Exception as e:
            print(f"Error fetching robots.txt: {e}. Proceeding without rules.")

        # 2. Main Crawl Loop
        async with aiohttp.ClientSession(headers={'User-Agent': 'WebCrawlerService'}) as session:

            while self.crawl_queue and len(self.visited_urls) < self.config.max_pages:

                # Pages remaining check only uses visited_urls as the overall limit
                pages_remaining = self.config.max_pages - len(self.visited_urls)
                num_tasks_to_launch = min(
                    self._MAX_CONCURRENT_REQUESTS,
                    pages_remaining,
                    len(self.crawl_queue)
                )

                if num_tasks_to_launch == 0:
                    break

                # Pop tasks from the queue for concurrent execution
                current_batch = [self.crawl_queue.popleft() for _ in range(num_tasks_to_launch)]

                tasks = [
                    self._crawl_worker(session, url, depth)
                    for url, depth in current_batch
                ]

                await asyncio.gather(*tasks)

        # 3. Finalize Statistics and Return
        crawl_duration = time.time() - start_time
        pages_crawled = len(self.visited_urls)
        avg_page_size = self.stats['total_bytes_crawled'] / pages_crawled if pages_crawled > 0 else 0.0

        final_stats = CrawlStats(
            pages_crawled=pages_crawled,
            pages_failed=self.stats['pages_failed'],
            total_links_found=self.stats['total_links_found'],
            crawl_duration_seconds=round(crawl_duration, 2),
            average_page_size_bytes=round(avg_page_size, 2),
            robots_txt_found=self.stats['robots_txt_found'],
            max_depth_reached=self.stats['max_depth_reached']
        )

        print(
            f"\nCrawl complete. Total pages crawled: {final_stats.pages_crawled}. Duration: {final_stats.crawl_duration_seconds}s.")

        return self.extracted_text, final_stats


async def main_test():
    config = CrawlConfig(
        start_url="https://www.jumia.com.eg/",
        max_pages=600,
        max_depth=3,
        stay_in_domain=True,
        headlines_only=True,
        min_request_delay=0.5,
    )

    service = WebCrawlerService(config)

    extracted_text, stats = await service.crawl_website()

    print("\n--- Extracted Text (First 3 Snippets) ---")
    print(json.dumps(extracted_text[:3], indent=4, ensure_ascii=False))

    print("\n--- Crawl Statistics ---")
    print(stats.model_dump_json(indent=4))


if __name__ == '__main__':
    asyncio.run(main_test())
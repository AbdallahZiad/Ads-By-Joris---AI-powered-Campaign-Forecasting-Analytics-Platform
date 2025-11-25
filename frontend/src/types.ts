export interface Group {
    id: string;
    name: string;
    keywords: string[];
}

export interface Category {
    id: string;
    name: string;
    groups: Group[];
}

export type CompetitionLevel = "UNSPECIFIED" | "UNKNOWN" | "LOW" | "MEDIUM" | "HIGH";
export type Month = "UNSPECIFIED" | "JANUARY" | "FEBRUARY" | "MARCH" | "APRIL" | "MAY" | "JUNE" | "JULY" | "AUGUST" | "SEPTEMBER" | "OCTOBER" | "NOVEMBER" | "DECEMBER";

// --- History API Types ---
export interface MonthlySearchVolume {
    month: Month;
    year: number;
    monthly_searches: number;
}

export interface KeywordHistoricalMetrics {
    competition: CompetitionLevel;
    monthly_search_volumes: MonthlySearchVolume[];
    avg_monthly_searches: number;
    competition_index?: number | null;
    low_top_of_page_bid_micros?: number | null;
    high_top_of_page_bid_micros?: number | null;
    average_cpc_micros?: number | null;
}

export interface UnifiedKeywordResult {
    text: string;
    keyword_metrics: KeywordHistoricalMetrics | null;
}

export interface ForecastPoint {
    month: Month;
    year: number;
    search_volume_forecast: number;
    lower_bound: number;
    upper_bound: number;
}

export interface KeywordForecast {
    keyword: string;
    prophet_model_status: string;
    current_month_expected_volume: number;
    annual_growth_rate?: number | null;
    expected_increase_1m?: number | null;
    expected_increase_3m?: number | null;
    expected_increase_6m?: number | null;
    forecast_series: ForecastPoint[];
}

export interface ForecastResponse {
    forecasts: KeywordForecast[];
}


export interface GoogleAdsKeywordResponse {
    results: UnifiedKeywordResult[];
}

export interface AnalyzedKeyword {
    text: string;
    // undefined = loading, null = not found, object = loaded
    history: KeywordHistoricalMetrics | null | undefined;
    forecast: KeywordForecast | null | undefined;
}

export interface AnalyzedGroup {
    id: string;
    name: string;
    keywords: AnalyzedKeyword[];
}

export interface AnalyzedCategory {
    id: string;
    name: string;
    groups: AnalyzedGroup[];
}

export interface SelectOption {
    id: string;
    name: string;
}

export interface ScannerConfig {
    start_url: string;
    max_pages: number;
    max_depth: number;
    stay_in_domain: boolean;
    headlines_only: boolean;
    min_request_delay: number;
}

export interface ScannedGroupRaw {
    group_name: string;
    keywords: string[];
}

export interface ScannedCategoryRaw {
    category_name: string;
    groups: ScannedGroupRaw[];
}

export interface CrawlStats {
    pages_crawled: number;
    pages_failed: number;
    total_links_found: number;
    crawl_duration_seconds: number;
    average_page_size_bytes: number;
    robots_txt_found: boolean;
    max_depth_reached: number;
}

export interface PhaseMetrics {
    time_taken_seconds: number;
    tokens_used: number;
    api_calls: number;
}

export interface LlmMetrics {
    total_tokens: number;
    phase_metrics: {
        keyword_extraction: PhaseMetrics;
        category_generation: PhaseMetrics;
        keyword_categorization: PhaseMetrics;
        keyword_grouping: PhaseMetrics;
    }
}

export interface ScannerResponse {
    structured_data: ScannedCategoryRaw[];
    crawl_stats: CrawlStats;
    llm_metrics: LlmMetrics;
}
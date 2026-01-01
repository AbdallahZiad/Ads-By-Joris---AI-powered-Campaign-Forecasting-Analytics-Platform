// --- Domain Entities ---

export interface Keyword {
    id: string;
    text: string;
    isNew?: boolean;
    applied_labels?: string[];
}

export interface Group {
    id: string;
    name: string;
    keywords: Keyword[];
    google_ad_group_id?: string | null;
    applied_labels?: string[];
}

export interface Category {
    id: string;
    name: string;
    groups: Group[];
    google_campaign_id?: string | null;
    applied_labels?: string[];
}

export interface ProjectMetadata {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    categories_count?: number;
    owner_id: string;
    linked_customer_id?: string | null;
}

export interface Project extends ProjectMetadata {
    categories: Category[];
}

// --- Google Ads Entities ---

export interface GoogleAdsCustomer {
    id: string;
    resource_name: string;
    descriptive_name: string;
    is_manager: boolean;
}

export interface GoogleAdsCampaign {
    id: string;
    name: string;
    status: string;
}

export interface GoogleAdsAdGroup {
    id: string;
    name: string;
    status: string;
}

export interface CustomerListResponse {
    customers: GoogleAdsCustomer[];
}

export interface CampaignListResponse {
    campaigns: GoogleAdsCampaign[];
}

export interface AdGroupListResponse {
    ad_groups: GoogleAdsAdGroup[];
}

// --- Labeling Report ---

export interface LabelStats {
    count: number;
    unique_labels_applied: string[];
}

export interface LabelingReport {
    keywords: LabelStats;
    groups: LabelStats;
    categories: LabelStats;
    total_items_processed: number;
    synced_to_google: boolean;
}

// --- Async Task Types (NEW) ---

export type TaskStatus = 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE';

export interface TaskResponse<T = any> {
    task_id: string;
    status: TaskStatus;
    result: T | null;
    error: string | null;
}

export interface AsyncTaskInitResponse {
    task_id: string;
    status: string;
}

// --- API Payloads ---

export interface CreateProjectPayload { title: string; }
export interface UpdateProjectPayload { title: string; }
export interface CreateCategoryPayload { name: string; }
export interface UpdateCategoryPayload { name: string; }
export interface CreateGroupPayload { name: string; }
export interface UpdateGroupPayload { name?: string; google_ad_group_id?: string; }
export interface CreateKeywordPayload { text: string; }
export interface BulkCreateKeywordsPayload { keywords: string[]; }
export interface CreateProjectTreePayload {
    title: string;
    categories: {
        name: string;
        groups: {
            name: string;
            keywords: string[];
        }[];
    }[];
}

// --- Select / Inputs ---
export interface SelectOption {
    id: string;
    name: string;
}

// --- Analysis & Scanner Types ---
export type CompetitionLevel = "UNSPECIFIED" | "UNKNOWN" | "LOW" | "MEDIUM" | "HIGH";
export type Month = "UNSPECIFIED" | "JANUARY" | "FEBRUARY" | "MARCH" | "APRIL" | "MAY" | "JUNE" | "JULY" | "AUGUST" | "SEPTEMBER" | "OCTOBER" | "NOVEMBER" | "DECEMBER";

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

export interface AggregatedStats {
    id: string;
    name: string;
    type: 'CATEGORY' | 'GROUP';
    itemCount: number;
    totalVolume: number;
    avgCpc: number;
    avgCompetition: number;
    maxGrowth: number;
    labels: string[];
    originalRef: AnalyzedCategory | AnalyzedGroup;
}

export type ViewLevel = 'ROOT' | 'CATEGORY' | 'GROUP';

// --- Scanner Types ---
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
        // The API returns 'geo_lang_detection' sometimes, we can map broadly:
        [key: string]: PhaseMetrics;
    }
}

// ▼▼▼ NEW: Added Config from Scanner ▼▼▼
export interface ScannerAdsConfig {
    geo_target_id: string;
    geo_target_name: string;
    language_id: string;
    language_name: string;
}

export interface ScannerResponse {
    structured_data: ScannedCategoryRaw[];
    google_ads_config?: ScannerAdsConfig; // Added here
    crawl_stats: CrawlStats;
    llm_metrics: LlmMetrics;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    avatar_url?: string;
    settings?: Record<string, any>;
    google_id?: string;
    is_google_ads_linked: boolean;
}

export interface UserCreate {
    email: string;
    password: string;
    full_name?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface EmailVerification {
    token: string;
}

export interface PasswordReset {
    token: string;
    new_password: string;
}

export interface MessageResponse {
    message: string;
}
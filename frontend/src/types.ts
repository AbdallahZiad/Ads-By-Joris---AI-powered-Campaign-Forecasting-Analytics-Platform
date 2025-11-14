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
    keyword_metrics: KeywordHistoricalMetrics;
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
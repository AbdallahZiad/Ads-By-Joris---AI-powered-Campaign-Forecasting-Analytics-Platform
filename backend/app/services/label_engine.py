import statistics
from typing import List, Dict, Any
from collections import Counter

from app.schemas.analysis_schemas import KeywordForecast
from app.schemas.google_ads_data_schemas import KeywordHistoricalMetrics

class LabelContext:
    """
    Holds statistical context for the entire project to allow for
    robust relative labeling (Z-scores, Averages).
    """
    def __init__(self, cpc_values: List[float], volume_values: List[float]):
        self.cpc_values = cpc_values
        self.volume_values = volume_values

        # Pre-calculate CPC Stats
        if len(cpc_values) > 1:
            self.avg_cpc = statistics.mean(cpc_values)
            self.std_dev_cpc = statistics.stdev(cpc_values)
        else:
            self.avg_cpc = cpc_values[0] if cpc_values else 0
            self.std_dev_cpc = 0

        # Pre-calculate Volume Stats (Median is often better for Volume due to outliers)
        if len(volume_values) > 0:
            self.median_volume = statistics.median(volume_values)
        else:
            self.median_volume = 0

class LabelEngine:
    """
    Pure logic engine that determines which [AdsByJoris] labels apply based on
    Forecasts, Historical Metrics, and Project Context.
    """

    # --- Configuration ---
    LABEL_PREFIX = "[AdsByJoris]"

    # Label Definitions
    L_TREND_UP = f"{LABEL_PREFIX} Trending Up 🚀"
    L_TREND_DOWN = f"{LABEL_PREFIX} Trending Down 📉"
    L_HOT_NEXT_MONTH = f"{LABEL_PREFIX} Hot Next Month 🔥"
    L_HIDDEN_GEM = f"{LABEL_PREFIX} Hidden Gem 💎"
    L_HIGH_COST = f"{LABEL_PREFIX} High Cost 💰"
    L_STABLE = f"{LABEL_PREFIX} Stable"
    L_VOLATILE = f"{LABEL_PREFIX} Volatile ⚠️"
    L_LOW_DATA = f"{LABEL_PREFIX} Low Data ❓"

    # Tuned Thresholds
    GROWTH_THRESHOLD = 0.10  # 10% Annual Growth
    IMMEDIATE_GROWTH_THRESHOLD = 0.15 # 15% Next Month Growth
    LOW_COMPETITION_THRESHOLD = 30

    # Statistical Thresholds
    HIGH_COST_Z_SCORE = 1.0
    VOLATILITY_RATIO = 0.40

    # Aggregation Thresholds
    GROUP_AGGREGATION_RATIO = 0.3

    @classmethod
    def generate_keyword_labels(
            cls,
            forecast: KeywordForecast,
            metrics: KeywordHistoricalMetrics = None,
            context: LabelContext = None
    ) -> List[str]:
        """
        Analyzes a single keyword forecast and returns a list of label names.
        """
        labels = []

        # 0. Low Data Check (Safety)
        if metrics and metrics.avg_monthly_searches < 10:
            labels.append(cls.L_LOW_DATA)
            return labels

            # 1. Trend Analysis (Annual Growth)
        if forecast.annual_growth_rate is not None:
            if forecast.annual_growth_rate > cls.GROWTH_THRESHOLD:
                labels.append(cls.L_TREND_UP)
            elif forecast.annual_growth_rate < -cls.GROWTH_THRESHOLD:
                labels.append(cls.L_TREND_DOWN)
            else:
                labels.append(cls.L_STABLE)

        # 2. Seasonality (Next Month)
        if forecast.expected_increase_1m and forecast.expected_increase_1m > cls.IMMEDIATE_GROWTH_THRESHOLD:
            labels.append(cls.L_HOT_NEXT_MONTH)

        # 3. Robust Volatility Check
        if forecast.forecast_series and len(forecast.forecast_series) > 0:
            point = forecast.forecast_series[0]

            if point.search_volume_forecast and point.search_volume_forecast > 10:
                spread = point.upper_bound - point.lower_bound
                uncertainty_ratio = spread / point.search_volume_forecast

                if uncertainty_ratio > cls.VOLATILITY_RATIO:
                    labels.append(cls.L_VOLATILE)

        # 4. Metrics-based Labels
        if metrics:
            avg_vol = metrics.avg_monthly_searches
            comp_idx = metrics.competition_index or 100

            # Opportunity (Hidden Gem)
            is_high_volume = False
            if context and context.median_volume > 0:
                is_high_volume = avg_vol > context.median_volume
            else:
                is_high_volume = avg_vol >= 1000

            if is_high_volume and comp_idx <= cls.LOW_COMPETITION_THRESHOLD:
                labels.append(cls.L_HIDDEN_GEM)

            # Cost Analysis (Statistical Z-Score)
            if metrics.average_cpc_micros and context and context.std_dev_cpc > 0:
                cpc_val = metrics.average_cpc_micros
                z_score = (cpc_val - context.avg_cpc) / context.std_dev_cpc

                if z_score > cls.HIGH_COST_Z_SCORE:
                    labels.append(cls.L_HIGH_COST)

        return labels

    @classmethod
    def compute_group_labels(cls, keyword_labels_list: List[List[str]]) -> List[str]:
        """
        Aggregates labels for a Group based on its constituent keywords.
        Includes CONFLICT RESOLUTION to prevent contradicting labels.
        """
        if not keyword_labels_list:
            return []

        total_keywords = len(keyword_labels_list)
        label_counts = Counter()

        for k_labels in keyword_labels_list:
            label_counts.update(k_labels)

        final_group_labels = []

        # 1. Apply Thresholds
        for label, count in label_counts.items():
            if (count / total_keywords) >= cls.GROUP_AGGREGATION_RATIO:
                final_group_labels.append(label)

        # 2. Conflict Resolution
        if cls.L_TREND_UP in final_group_labels and cls.L_TREND_DOWN in final_group_labels:
            up_count = label_counts[cls.L_TREND_UP]
            down_count = label_counts[cls.L_TREND_DOWN]

            if up_count > down_count:
                final_group_labels.remove(cls.L_TREND_DOWN)
            elif down_count > up_count:
                final_group_labels.remove(cls.L_TREND_UP)
            else:
                final_group_labels.remove(cls.L_TREND_UP)
                final_group_labels.remove(cls.L_TREND_DOWN)
                if cls.L_VOLATILE not in final_group_labels:
                    final_group_labels.append(cls.L_VOLATILE)

        if cls.L_STABLE in final_group_labels:
            if cls.L_TREND_UP in final_group_labels or cls.L_TREND_DOWN in final_group_labels:
                final_group_labels.remove(cls.L_STABLE)

        return final_group_labels

    @classmethod
    def get_all_managed_labels(cls) -> List[str]:
        return [
            cls.L_TREND_UP, cls.L_TREND_DOWN, cls.L_HOT_NEXT_MONTH,
            cls.L_HIDDEN_GEM, cls.L_HIGH_COST, cls.L_STABLE, cls.L_VOLATILE, cls.L_LOW_DATA
        ]
from enum import Enum
from typing import List, Dict, Optional, Any

from pydantic import BaseModel, Field, RootModel


# --- Extraction Outputs ---
class ExtractedKeywordResults(BaseModel):
    """The expected output from the keyword extraction pass (per chunk)."""
    keywords: List[str] = Field(..., description="A list of marketable keywords extracted from the text chunk.")


# --- Categorization & Grouping Outputs ---
class CategoryNames(BaseModel):
    """The expected output from the category generation step."""
    categories: List[str] = Field(..., description="A list of high-level category names derived from the keywords.")


class KeywordCategoryMapping(RootModel[Dict[str, List[str]]]):
    """
    The first categorization pass output. Map of Category -> Keywords.
    """
    pass


class KeywordGroup(BaseModel):
    """Represents a final group (Ad Group equivalent) within a category."""
    group_name: str = Field(..., description="A descriptive name for the group.")
    keywords: List[str] = Field(..., description="The list of keywords belonging to this group.")


class KeywordGroups(BaseModel):
    """Wrapper for the final grouping step."""
    groups: List[KeywordGroup] = Field(..., description="A list of granular keyword groups.")


class FinalKeywordHierarchy(BaseModel):
    """The final, combined structured output for one category."""
    category_name: str
    groups: List[KeywordGroup]


# --- Auto-Linking Outputs ---
class AutoLinkMatchResult(BaseModel):
    """The output from the Auto-Link LLM Prompt."""
    matches: Dict[str, Optional[str]] = Field(..., description="Source ID to Target ID mapping.")


# --- NEW: Geo & Language Detection Outputs ---
class GeoLangLLMResult(BaseModel):
    """The raw JSON output from the LLM for Geo/Lang detection."""
    country: str = Field(..., description="The detected country name (e.g., 'United States').")
    language: str = Field(..., description="The detected language name (e.g., 'English').")


class GoogleAdsSettings(BaseModel):
    """The resolved Google Ads IDs and names after Python lookup."""
    geo_target_id: Optional[str] = None
    geo_target_name: str
    language_id: Optional[str] = None
    language_name: str


# --- Final Pipeline Result Metrics ---
class Phase(Enum):
    KEYWORD_EXTRACTION = "keyword_extraction"
    CATEGORY_GENERATION = "category_generation"
    KEYWORD_CATEGORIZATION = "keyword_categorization"
    KEYWORD_GROUPING = "keyword_grouping"
    AUTO_LINKING = "auto_linking"
    GEO_LANG_DETECTION = "geo_lang_detection"  # <--- NEW PHASE


class PhaseMetrics(BaseModel):
    """Metrics for a single phase of the pipeline."""
    time_taken_seconds: float
    tokens_used: int
    api_calls: int


class LLMTokenMetrics(BaseModel):
    """Encapsulates the total token usage and phase-specific metrics."""
    total_tokens: int = Field(0)
    phase_metrics: Dict[Phase, PhaseMetrics] = Field(default_factory=dict)


class LLMResult(BaseModel):
    """The final model returned to the service layer."""
    data: List[FinalKeywordHierarchy] = Field(..., description="The final structured keyword hierarchy data.")
    # NEW: Optional config found during the scan
    ads_config: Optional[GoogleAdsSettings] = Field(None, description="Recommended Google Ads Geo/Lang settings.")
    metrics: LLMTokenMetrics = Field(..., description="The token usage data.")
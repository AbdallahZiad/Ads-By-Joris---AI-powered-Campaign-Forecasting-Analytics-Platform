from pydantic import BaseModel, Field, RootModel
from typing import List, Dict


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
    The first categorization pass output. The root of the JSON response is
    a dictionary where keys are the pre-defined category names and values
    are the list of keywords assigned to that category.
    """
    # The RootModel handles the validation; the structure is accessed via .root
    pass


class KeywordGroup(BaseModel):
    """Represents a final group (Ad Group equivalent) within a category."""
    group_name: str = Field(...,
                            description="A descriptive name for the group (e.g., 'Winter Boots', 'Premium Coffee').")
    keywords: List[str] = Field(...,
                                description="The list of keywords belonging to this specific, tightly-themed group.")


class KeywordGroups(BaseModel):
    """
    A wrapper model for the final grouping step. The LLM is instructed to
    return a JSON object containing a list of groups under the 'groups' key.
    """
    groups: List[KeywordGroup] = Field(...,
                                       description="A list of all granular, tightly-themed keyword groups for the given category.")


class FinalKeywordHierarchy(BaseModel):
    """The final, combined structured output for one category ready for the database/pipeline."""
    category_name: str
    groups: List[KeywordGroup]


# --- Final Pipeline Result ---

class PipelineTokenMetrics(BaseModel):
    """Encapsulates the total token usage for the entire pipeline run."""
    total_tokens: int = Field(0, description="The sum of all prompt and completion tokens used across all API calls.")


class PipelineResult(BaseModel):
    """The final model returned to the service layer, containing both data and token metrics."""
    data: List[FinalKeywordHierarchy] = Field(..., description="The final structured keyword hierarchy data.")
    metrics: PipelineTokenMetrics = Field(..., description="The token usage data for the pipeline execution.")

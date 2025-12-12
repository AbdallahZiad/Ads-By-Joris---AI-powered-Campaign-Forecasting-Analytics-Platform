from typing import List, Optional, Dict
from pydantic import BaseModel, Field

# --- Customers ---
class GoogleAdsCustomer(BaseModel):
    """Represents a Google Ads account (Customer) that the user has access to."""
    resource_name: str = Field(..., description="The resource name (e.g., 'customers/123...')")
    id: str = Field(..., description="The 10-digit Customer ID.")
    descriptive_name: Optional[str] = Field(None, description="The descriptive name of the account.")
    currency_code: Optional[str] = Field(None)
    time_zone: Optional[str] = Field(None)
    is_manager: bool = Field(False)

class AccessibleCustomersResponse(BaseModel):
    customers: List[GoogleAdsCustomer]

class LinkProjectCustomerRequest(BaseModel):
    customer_id: str = Field(..., description="The 10-digit Customer ID to link to the Project.")


# --- Campaigns ---
class GoogleAdsCampaign(BaseModel):
    """Represents a live Campaign in Google Ads."""
    id: str
    name: str
    status: str
    resource_name: str

class CampaignListResponse(BaseModel):
    campaigns: List[GoogleAdsCampaign]

class LinkCategoryCampaignRequest(BaseModel):
    campaign_id: str


# --- Ad Groups ---
class GoogleAdsAdGroup(BaseModel):
    """Represents a live Ad Group in Google Ads."""
    id: str
    name: str
    status: str
    resource_name: str
    campaign_id: str

class AdGroupListResponse(BaseModel):
    ad_groups: List[GoogleAdsAdGroup]

class LinkGroupAdGroupRequest(BaseModel):
    ad_group_id: str


# --- NEW: Labeling Report Schemas ---

class EntityLabelStats(BaseModel):
    count: int = 0
    unique_labels_applied: List[str] = []

class LabelingReport(BaseModel):
    """
    Detailed summary of the Labeling Engine's execution.
    """
    keywords: EntityLabelStats = Field(default_factory=EntityLabelStats)
    groups: EntityLabelStats = Field(default_factory=EntityLabelStats)
    categories: EntityLabelStats = Field(default_factory=EntityLabelStats)

    # Metadata
    total_items_processed: int = 0
    synced_to_google: bool = True
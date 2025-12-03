from typing import List, Optional
from pydantic import BaseModel, Field

class GoogleAdsCustomer(BaseModel):
    """
    Represents a Google Ads account (Customer) that the user has access to.
    """
    resource_name: str = Field(..., description="The resource name of the customer (e.g., 'customers/1234567890')")
    id: str = Field(..., description="The 10-digit Customer ID.")
    descriptive_name: Optional[str] = Field(None, description="The descriptive name of the account (e.g., 'Joris Ads')")
    currency_code: Optional[str] = Field(None, description="Currency code (e.g., 'USD')")
    time_zone: Optional[str] = Field(None, description="Time zone ID (e.g., 'America/New_York')")
    is_manager: bool = Field(False, description="Whether this is a Manager account (MCC).")

class AccessibleCustomersResponse(BaseModel):
    """
    Response model for the list of accessible Google Ads accounts.
    """
    customers: List[GoogleAdsCustomer]

class LinkCustomerRequest(BaseModel):
    """
    Request model for linking a specific Google Ads Customer ID to the user's profile.
    """
    customer_id: str = Field(..., description="The 10-digit Customer ID to link.")
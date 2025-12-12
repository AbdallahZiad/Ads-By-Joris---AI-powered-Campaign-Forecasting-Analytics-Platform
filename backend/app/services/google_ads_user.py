import asyncio
from typing import List, Optional

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

from app.core.config import settings
from app.models import User
from app.schemas.google_ads_user_schemas import GoogleAdsCustomer, GoogleAdsCampaign, GoogleAdsAdGroup

class UserGoogleAdsService:
    """
    Service for interacting with Google Ads API using the **User's Credentials**.
    Responsible for fetching accessible customers, linking accounts, and managing campaigns.
    """

    def __init__(self, user: User, login_customer_id: str = None):
        """
        Args:
            user: The authenticated user model.
            login_customer_id: Optional. The explicit Customer ID to act as.
                               If provided, sets the 'login-customer-id' header.
        """
        if not user.google_refresh_token:
            raise ValueError("User does not have a linked Google Ads account (missing refresh token).")

        self.creds_dict = {
            "developer_token": settings.GOOGLE_ADS_DEVELOPER_TOKEN,
            "client_id": settings.GOOGLE_ADS_CLIENT_ID,
            "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
            "refresh_token": user.google_refresh_token,
            "use_proto_plus": True,
        }

        # If we are targeting a specific sub-account (e.g. searching campaigns),
        # we usually need to specify that ID in the configuration.
        if login_customer_id:
            self.creds_dict["login_customer_id"] = login_customer_id

        self.client = GoogleAdsClient.load_from_dict(self.creds_dict)
        self.user = user

    async def get_accessible_customers(self) -> List[GoogleAdsCustomer]:
        """
        Fetches the list of Google Ads accounts directly accessible by the user's credentials.
        """
        customer_service = self.client.get_service("CustomerService")

        try:
            response = await asyncio.to_thread(
                customer_service.list_accessible_customers
            )

            customers = []
            for resource_name in response.resource_names:
                customer_id = resource_name.split("/")[-1]
                customers.append(GoogleAdsCustomer(
                    resource_name=resource_name,
                    id=customer_id,
                    descriptive_name=f"Account {customer_id}"
                ))
            return customers

        except GoogleAdsException as ex:
            print(f"Error fetching customers: {ex.error.code().name}")
            raise ex

    async def validate_access(self, customer_id: str) -> bool:
        """Checks if the user has access to this customer ID."""
        accessible = await self.get_accessible_customers()
        return any(c.id == customer_id for c in accessible)

    # --- Validation Methods (NEW) ---

    async def verify_campaign_exists(self, customer_id: str, campaign_id: str) -> bool:
        """
        Validates that a specific Campaign ID exists within the given Customer Account.
        """
        ga_service = self.client.get_service("GoogleAdsService")
        query = f"SELECT campaign.id FROM campaign WHERE campaign.id = {campaign_id} LIMIT 1"

        try:
            stream = await asyncio.to_thread(
                ga_service.search_stream,
                customer_id=customer_id,
                query=query
            )
            # If we get any result, the campaign exists
            for batch in stream:
                for _ in batch.results:
                    return True
            return False
        except GoogleAdsException:
            return False

    async def verify_ad_group_parentage(self, customer_id: str, campaign_id: str, ad_group_id: str) -> bool:
        """
        Validates that an Ad Group exists AND belongs to the specific Campaign.
        This prevents linking an Ad Group to the wrong Campaign category.
        """
        ga_service = self.client.get_service("GoogleAdsService")
        # We query for the ad group, but filter by the expected parent campaign
        query = f"""
            SELECT ad_group.id 
            FROM ad_group 
            WHERE ad_group.id = {ad_group_id} 
            AND campaign.id = {campaign_id} 
            LIMIT 1
        """

        try:
            stream = await asyncio.to_thread(
                ga_service.search_stream,
                customer_id=customer_id,
                query=query
            )
            for batch in stream:
                for _ in batch.results:
                    return True
            return False
        except GoogleAdsException:
            return False

    # --- Fetching Methods ---

    async def get_campaigns(self, customer_id: str) -> List[GoogleAdsCampaign]:
        """
        Fetches ALL enabled/paused campaigns for a given Customer ID.
        """
        ga_service = self.client.get_service("GoogleAdsService")

        query = """
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign.resource_name
                FROM campaign
                WHERE campaign.status != 'REMOVED'
                ORDER BY campaign.name ASC \
                """

        try:
            stream = await asyncio.to_thread(
                ga_service.search_stream,
                customer_id=customer_id,
                query=query
            )

            campaigns = []
            for batch in stream:
                for row in batch.results:
                    c = row.campaign
                    campaigns.append(GoogleAdsCampaign(
                        id=str(c.id),
                        name=c.name,
                        status=c.status.name,
                        resource_name=c.resource_name
                    ))
            return campaigns

        except GoogleAdsException as ex:
            print(f"Error fetching campaigns for {customer_id}: {ex}")
            raise ex

    async def get_ad_groups(self, customer_id: str, campaign_id: str) -> List[GoogleAdsAdGroup]:
        """
        Fetches ALL enabled/paused Ad Groups for a specific Campaign.
        """
        ga_service = self.client.get_service("GoogleAdsService")

        query = f"""
            SELECT 
                ad_group.id, 
                ad_group.name, 
                ad_group.status,
                ad_group.resource_name,
                campaign.id
            FROM ad_group 
            WHERE 
                campaign.id = {campaign_id} 
                AND ad_group.status != 'REMOVED'
            ORDER BY ad_group.name ASC
        """

        try:
            stream = await asyncio.to_thread(
                ga_service.search_stream,
                customer_id=customer_id,
                query=query
            )

            ad_groups = []
            for batch in stream:
                for row in batch.results:
                    ag = row.ad_group
                    ad_groups.append(GoogleAdsAdGroup(
                        id=str(ag.id),
                        name=ag.name,
                        status=ag.status.name,
                        resource_name=ag.resource_name,
                        campaign_id=str(row.campaign.id)
                    ))
            return ad_groups

        except GoogleAdsException as ex:
            print(f"Error fetching ad groups: {ex}")
            raise ex
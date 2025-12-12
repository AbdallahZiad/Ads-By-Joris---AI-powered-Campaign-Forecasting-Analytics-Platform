import asyncio
from typing import List, Optional, Set, Dict

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

from app.core.config import settings
from app.models import User
from app.schemas.google_ads_user_schemas import GoogleAdsCustomer, GoogleAdsCampaign, GoogleAdsAdGroup

class UserGoogleAdsService:
    """
    Service for interacting with Google Ads API using the **User's Credentials**.
    """

    def __init__(self, user: User, login_customer_id: str = None):
        if not user.google_refresh_token:
            raise ValueError("User does not have a linked Google Ads account.")

        self.creds_dict = {
            "developer_token": settings.GOOGLE_ADS_DEVELOPER_TOKEN,
            "client_id": settings.GOOGLE_ADS_CLIENT_ID,
            "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
            "refresh_token": user.google_refresh_token,
            "use_proto_plus": True,
        }

        if login_customer_id:
            self.creds_dict["login_customer_id"] = login_customer_id

        self.client = GoogleAdsClient.load_from_dict(self.creds_dict)
        self.user = user

    async def get_accessible_customers(self) -> List[GoogleAdsCustomer]:
        customer_service = self.client.get_service("CustomerService")
        try:
            response = await asyncio.to_thread(customer_service.list_accessible_customers)
            customers = []
            for resource_name in response.resource_names:
                customer_id = resource_name.split("/")[-1]
                customers.append(GoogleAdsCustomer(resource_name=resource_name, id=customer_id, descriptive_name=f"Account {customer_id}"))
            return customers
        except GoogleAdsException as ex:
            print(f"Error fetching customers: {ex.error.code().name}")
            raise ex

    async def validate_access(self, customer_id: str) -> bool:
        accessible = await self.get_accessible_customers()
        return any(c.id == customer_id for c in accessible)

    async def verify_campaign_exists(self, customer_id: str, campaign_id: str) -> bool:
        ga_service = self.client.get_service("GoogleAdsService")
        query = f"SELECT campaign.id FROM campaign WHERE campaign.id = {campaign_id} LIMIT 1"
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for _ in batch.results: return True
            return False
        except GoogleAdsException: return False

    async def verify_ad_group_parentage(self, customer_id: str, campaign_id: str, ad_group_id: str) -> bool:
        ga_service = self.client.get_service("GoogleAdsService")
        query = f"SELECT ad_group.id FROM ad_group WHERE ad_group.id = {ad_group_id} AND campaign.id = {campaign_id} LIMIT 1"
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for _ in batch.results: return True
            return False
        except GoogleAdsException: return False

    async def get_campaigns(self, customer_id: str) -> List[GoogleAdsCampaign]:
        ga_service = self.client.get_service("GoogleAdsService")
        query = "SELECT campaign.id, campaign.name, campaign.status, campaign.resource_name FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.name ASC"
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            campaigns = []
            for batch in stream:
                for row in batch.results:
                    c = row.campaign
                    campaigns.append(GoogleAdsCampaign(id=str(c.id), name=c.name, status=c.status.name, resource_name=c.resource_name))
            return campaigns
        except GoogleAdsException as ex:
            print(f"Error fetching campaigns: {ex}")
            raise ex

    async def get_ad_groups(self, customer_id: str, campaign_id: str) -> List[GoogleAdsAdGroup]:
        ga_service = self.client.get_service("GoogleAdsService")
        query = f"SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.resource_name, campaign.id FROM ad_group WHERE campaign.id = {campaign_id} AND ad_group.status != 'REMOVED' ORDER BY ad_group.name ASC"
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            ad_groups = []
            for batch in stream:
                for row in batch.results:
                    ag = row.ad_group
                    ad_groups.append(GoogleAdsAdGroup(id=str(ag.id), name=ag.name, status=ag.status.name, resource_name=ag.resource_name, campaign_id=str(row.campaign.id)))
            return ad_groups
        except GoogleAdsException as ex:
            print(f"Error fetching ad groups: {ex}")
            raise ex

    # --- LABEL MANAGEMENT ---

    async def ensure_label_exists(self, customer_id: str, label_name: str) -> str:
        """
        Checks if a label exists by name. If not, creates it.
        Returns the Label Resource Name.
        """
        ga_service = self.client.get_service("GoogleAdsService")
        label_service = self.client.get_service("LabelService")

        # 1. Check existence
        query = f"SELECT label.resource_name, label.name FROM label WHERE label.name = '{label_name}' LIMIT 1"
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for row in batch.results:
                    return row.label.resource_name
        except GoogleAdsException:
            pass

            # 2. Create Label
        label_op = self.client.get_type("LabelOperation")
        label = label_op.create
        label.name = label_name

        try:
            response = await asyncio.to_thread(
                label_service.mutate_labels,
                customer_id=customer_id,
                operations=[label_op]
            )
            return response.results[0].resource_name
        except GoogleAdsException as ex:
            # If creation failed, likely a race condition or already exists hidden. Try select again.
            print(f"Error creating label {label_name}, retrying fetch: {ex}")
            # Simplified retry mechanism
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for row in batch.results:
                    return row.label.resource_name
            raise ex

    async def sync_labels_for_ad_group(self, customer_id: str, ad_group_id: str, new_label_names: List[str]):
        """
        Robustly syncs labels for an Ad Group.
        Adds new [Joris] labels. Removes old [Joris] labels. Keeps manual labels.
        """
        ga_service = self.client.get_service("GoogleAdsService")
        ad_group_label_service = self.client.get_service("AdGroupLabelService")

        ad_group_res_name = f"customers/{customer_id}/adGroups/{ad_group_id}"

        # 1. Fetch CURRENTLY applied labels for this Ad Group
        # We need the relationship resource name (to delete) and the label name (to check logic)
        query = f"""
            SELECT 
                ad_group_label.resource_name,
                label.name,
                label.resource_name
            FROM ad_group_label 
            WHERE ad_group.id = {ad_group_id}
        """

        current_labels_map = {} # label_name -> ad_group_label_resource_name

        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for row in batch.results:
                    # Map Name -> The Relationship ID (needed for removal)
                    current_labels_map[row.label.name] = row.ad_group_label.resource_name
        except GoogleAdsException as ex:
            print(f"Error fetching current labels for Ad Group {ad_group_id}: {ex}")
            return

        # 2. Calculate DIFF
        ops = []

        # A. ADDITION Logic
        for name in new_label_names:
            if name not in current_labels_map:
                # Need to add this label
                # First ensure the label definition exists
                label_res_name = await self.ensure_label_exists(customer_id, name)

                op = self.client.get_type("AdGroupLabelOperation")
                op.create.ad_group = ad_group_res_name
                op.create.label = label_res_name
                ops.append(op)

        # B. REMOVAL Logic (Cleanup)
        # Remove if it starts with [Joris] AND is NOT in the new list
        for applied_name, applied_rel_res_name in current_labels_map.items():
            if applied_name.startswith("[Joris]") and applied_name not in new_label_names:
                op = self.client.get_type("AdGroupLabelOperation")
                op.remove = applied_rel_res_name
                ops.append(op)

        # 3. Execute Batch
        if ops:
            try:
                await asyncio.to_thread(
                    ad_group_label_service.mutate_ad_group_labels,
                    customer_id=customer_id,
                    operations=ops
                )
                print(f"Synced labels for Ad Group {ad_group_id}: {len(ops)} operations.")
            except GoogleAdsException as ex:
                print(f"Error syncing labels for Ad Group {ad_group_id}: {ex}")

    async def sync_labels_for_campaign(self, customer_id: str, campaign_id: str, new_label_names: List[str]):
        """
        Robustly syncs labels for a Campaign.
        """
        ga_service = self.client.get_service("GoogleAdsService")
        campaign_label_service = self.client.get_service("CampaignLabelService")

        campaign_res_name = f"customers/{customer_id}/campaigns/{campaign_id}"

        # 1. Fetch Current Labels
        query = f"""
            SELECT 
                campaign_label.resource_name,
                label.name
            FROM campaign_label 
            WHERE campaign.id = {campaign_id}
        """

        current_labels_map = {}
        try:
            stream = await asyncio.to_thread(ga_service.search_stream, customer_id=customer_id, query=query)
            for batch in stream:
                for row in batch.results:
                    current_labels_map[row.label.name] = row.campaign_label.resource_name
        except GoogleAdsException as ex:
            print(f"Error fetching current labels for Campaign {campaign_id}: {ex}")
            return

        # 2. Diff
        ops = []

        # Add
        for name in new_label_names:
            if name not in current_labels_map:
                label_res_name = await self.ensure_label_exists(customer_id, name)
                op = self.client.get_type("CampaignLabelOperation")
                op.create.campaign = campaign_res_name
                op.create.label = label_res_name
                ops.append(op)

        # Remove
        for applied_name, applied_rel_res_name in current_labels_map.items():
            if applied_name.startswith("[Joris]") and applied_name not in new_label_names:
                op = self.client.get_type("CampaignLabelOperation")
                op.remove = applied_rel_res_name
                ops.append(op)

        # 3. Execute
        if ops:
            try:
                await asyncio.to_thread(
                    campaign_label_service.mutate_campaign_labels,
                    customer_id=customer_id,
                    operations=ops
                )
            except GoogleAdsException as ex:
                print(f"Error syncing labels for Campaign {campaign_id}: {ex}")
import asyncio
from typing import List, Optional

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

from app.core.config import settings
from app.models import User
from app.schemas.google_ads_user_schemas import GoogleAdsCustomer

class UserGoogleAdsService:
    """
    Service for interacting with Google Ads API using the **User's Credentials**.
    Responsible for fetching accessible customers, linking accounts, and managing campaigns.
    """

    def __init__(self, user: User):
        if not user.google_refresh_token:
            raise ValueError("User does not have a linked Google Ads account (missing refresh token).")

        # Construct credentials dynamically using the User's Refresh Token
        self.creds_dict = {
            "developer_token": settings.GOOGLE_ADS_DEVELOPER_TOKEN,
            "client_id": settings.GOOGLE_ADS_CLIENT_ID,
            "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
            "refresh_token": user.google_refresh_token,
            "use_proto_plus": True
        }

        self.client = GoogleAdsClient.load_from_dict(self.creds_dict)
        self.user = user

    async def get_accessible_customers(self) -> List[GoogleAdsCustomer]:
        """
        Fetches the list of Google Ads accounts directly accessible by the user's credentials.
        This is used to populate the dropdown for the "Link Customer" step.
        """
        customer_service = self.client.get_service("CustomerService")

        # This call does NOT require a login_customer_id
        try:
            # Running synchronous API call in a thread
            response = await asyncio.to_thread(
                customer_service.list_accessible_customers
            )

            customers = []
            for resource_name in response.resource_names:
                # The response only gives resource names (customers/1234567890).
                # To get the descriptive name, we technically need to query the customer detail,
                # but that requires knowing which Manager to log in as.
                # For the initial listing, we just parse the ID.
                # In a robust system, we would query each customer to get its name,
                # but that can be slow and permission-heavy.

                customer_id = resource_name.split("/")[-1]

                # Basic object without name for now (Frontend can label by ID)
                customers.append(GoogleAdsCustomer(
                    resource_name=resource_name,
                    id=customer_id,
                    descriptive_name=f"Customer {customer_id}" # Placeholder
                ))

            return customers

        except GoogleAdsException as ex:
            print(f"Request with ID '{ex.request_id}' failed with status '{ex.error.code().name}' and includes the following errors:")
            for error in ex.failure.errors:
                print(f"\tError with message '{error.message}'.")
                if error.location:
                    for field_path_element in error.location.field_path_elements:
                        print(f"\t\tOn field: {field_path_element.field_name}")
            raise ex

    async def get_customer_details(self, customer_id: str) -> Optional[GoogleAdsCustomer]:
        """
        Fetches details (Name, Currency, Timezone) for a specific customer.
        This verifies that we can actually manage this account.
        """
        # To get details, we must set the login-customer-id.
        # If the user has direct access, login-customer-id can be the customer_id itself.
        # If the user accesses via a Manager, we might need logic to find that Manager ID.
        # For this implementation, we try direct access.

        # Re-initialize client with the specific login_customer_id
        config = self.creds_dict.copy()
        config["login_customer_id"] = customer_id
        client = GoogleAdsClient.load_from_dict(config)

        ga_service = client.get_service("GoogleAdsService")

        query = """
                SELECT
                    customer.id,
                    customer.descriptive_name,
                    customer.currency_code,
                    customer.time_zone,
                    customer.manager
                FROM customer
                         LIMIT 1 \
                """

        try:
            # Execute query
            stream = await asyncio.to_thread(
                ga_service.search_stream,
                customer_id=customer_id,
                query=query
            )

            for batch in stream:
                for row in batch.results:
                    c = row.customer
                    return GoogleAdsCustomer(
                        resource_name=c.resource_name,
                        id=str(c.id),
                        descriptive_name=c.descriptive_name,
                        currency_code=c.currency_code,
                        time_zone=c.time_zone,
                        is_manager=c.manager
                    )
            return None

        except GoogleAdsException:
            # If we fail here, it likely means we don't have direct access
            # (perhaps need a manager ID).
            return None

    async def validate_and_link_customer(self, customer_id: str) -> bool:
        """
        Validates access and ensures the customer ID is valid before linking.
        """
        # 1. Check if it's in the accessible list
        accessible = await self.get_accessible_customers()
        ids = [c.id for c in accessible]

        if customer_id not in ids:
            return False

        # 2. (Optional) Try to fetch details to confirm we can Query it
        # details = await self.get_customer_details(customer_id)
        # if not details:
        #    return False

        return True
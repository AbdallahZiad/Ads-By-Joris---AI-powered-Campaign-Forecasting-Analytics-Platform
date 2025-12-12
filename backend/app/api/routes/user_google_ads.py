from typing import Any
import httpx

from fastapi import APIRouter, HTTPException, Depends
from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.models import Message, GoogleAdsLinkRequest
from app.schemas.google_ads_user_schemas import AccessibleCustomersResponse
from app.services.google_ads_user import UserGoogleAdsService

# Tag: User Ads Configuration
router = APIRouter(prefix="/users/me/google-ads", tags=["User Ads Configuration"])

@router.post("/link", response_model=Message)
async def link_google_ads_account(
        *,
        session: SessionDep,
        body: GoogleAdsLinkRequest,
        current_user: CurrentUser
) -> Any:
    """
    **OAuth Exchange:** Link Google Ads Access (Permissions).
    Exchanges the 'code' from the frontend for a Refresh Token and saves it to the User profile.
    """
    token_url = "https://oauth2.googleapis.com/token"

    payload = {
        "code": body.code,
        "client_id": settings.GOOGLE_ADS_CLIENT_ID,
        "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
        "redirect_uri": body.redirect_uri,
        "grant_type": "authorization_code"
    }

    print(f"Exchanging code for token with redirect_uri: {body.redirect_uri}")

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=payload)

    if response.status_code != 200:
        print(f"Google Token Exchange Failed: {response.text}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to exchange code with Google: {response.text}"
        )

    tokens = response.json()

    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=400,
            detail="No refresh token returned. Please try revoking access and linking again."
        )

    current_user.google_refresh_token = refresh_token
    current_user.google_access_token = tokens.get("access_token")

    if "scope" in tokens:
        current_user.google_scopes = tokens["scope"].split(" ")

    session.add(current_user)
    session.commit()

    return Message(message="Google Ads account successfully linked.")


@router.get("/customers", response_model=AccessibleCustomersResponse)
async def get_google_ads_customers(
        current_user: CurrentUser
) -> Any:
    """
    **Utility:** Get list of Google Ads customers accessible by the user's credentials.
    Use this to populate the dropdown when creating/linking a Project.
    """
    if not current_user.google_refresh_token:
        raise HTTPException(status_code=400, detail="No Google Ads account linked.")

    try:
        service = UserGoogleAdsService(current_user)
        customers = await service.get_accessible_customers()
        return AccessibleCustomersResponse(customers=customers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch customers: {str(e)}")
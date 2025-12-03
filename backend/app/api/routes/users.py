import uuid
from typing import Any
import httpx

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select
from google.oauth2 import id_token
from google.auth.transport import requests

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import (
    Message,
    UpdatePassword,
    User,
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
    GoogleConnectRequest,
    GoogleAdsLinkRequest
)
from app.schemas.google_ads_user_schemas import AccessibleCustomersResponse, LinkCustomerRequest
from app.services.google_ads_user import UserGoogleAdsService
from app.utils import generate_new_account_email, send_email, generate_verification_email, generate_email_verification_token

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    # Manually populate the is_google_ads_linked field for the list
    public_users = []
    for user in users:
        u_public = UserPublic.model_validate(user)
        u_public.is_google_ads_linked = bool(user.google_refresh_token)
        public_users.append(u_public)

    return UsersPublic(data=public_users, count=count)


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user (Superuser creation endpoint).
    """
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    user = crud.create_user(session=session, user_create=user_in)
    if settings.emails_enabled and user_in.email:
        email_data = generate_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
        send_email(
            email_to=user_in.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return user


@router.patch("/me", response_model=UserPublic)
def update_user_me(
        *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user.
    """

    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    # Return formatted public user
    result = UserPublic.model_validate(current_user)
    result.is_google_ads_linked = bool(current_user.google_refresh_token)
    return result


@router.patch("/me/password", response_model=Message)
def update_password_me(
        *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password.
    """
    if not current_user.hashed_password:
        raise HTTPException(status_code=400, detail="User account does not use a password (Google Auth).")

    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    session.commit()
    return Message(message="Password updated successfully")


@router.post("/me/link-google", response_model=Message)
async def link_google_account(
        *,
        session: SessionDep,
        body: GoogleConnectRequest,
        current_user: CurrentUser
) -> Any:
    """
    Link a Google Account (Identity).
    Accepts either ID Token (Implicit) or Code (Auth Code).
    """
    final_id_token = body.id_token

    if body.code:
        token_url = "https://oauth2.googleapis.com/token"
        payload = {
            "code": body.code,
            "client_id": settings.GOOGLE_ADS_CLIENT_ID,
            "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
            "redirect_uri": body.redirect_uri or "http://localhost:8080",
            "grant_type": "authorization_code"
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=payload)
        if resp.status_code == 200:
            final_id_token = resp.json().get("id_token")

    if not final_id_token:
        raise HTTPException(status_code=400, detail="No ID Token available for linking")

    try:
        # 1. Verify Token
        # FIX: Added clock_skew_in_seconds=10
        id_info = id_token.verify_oauth2_token(
            final_id_token,
            requests.Request(),
            settings.GOOGLE_ADS_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        google_id = id_info.get("sub")

        # 2. Check if this Google ID is already used
        statement = select(User).where(User.google_id == google_id)
        existing_google_user = session.exec(statement).first()

        if existing_google_user:
            if existing_google_user.id == current_user.id:
                return Message(message="This Google account is already linked to your profile.")
            else:
                raise HTTPException(
                    status_code=409,
                    detail="This Google account is already linked to a different user."
                )

        current_user.google_id = google_id
        if not current_user.avatar_url:
            current_user.avatar_url = id_info.get("picture")

        session.add(current_user)
        session.commit()

        return Message(message="Google account linked successfully")

    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Linking failed: {str(e)}")


@router.post("/me/link-google-ads", response_model=Message)
async def link_google_ads_account(
        *,
        session: SessionDep,
        body: GoogleAdsLinkRequest,
        current_user: CurrentUser
) -> Any:
    """
    Link Google Ads Access (Permissions).
    Exchanges the 'code' from the frontend for a Refresh Token and saves it.
    """

    token_url = "https://oauth2.googleapis.com/token"

    payload = {
        "code": body.code,
        "client_id": settings.GOOGLE_ADS_CLIENT_ID,
        "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
        "redirect_uri": body.redirect_uri, # Must match frontend (localhost:8080)
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

    # 1. Get the Refresh Token (Critical)
    refresh_token = tokens.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=400,
            detail="No refresh token returned. Please try revoking access and linking again."
        )

    # 2. Save to User
    current_user.google_refresh_token = refresh_token
    current_user.google_access_token = tokens.get("access_token")

    # Save scope if available
    if "scope" in tokens:
        current_user.google_scopes = tokens["scope"].split(" ")

    session.add(current_user)
    session.commit()

    return Message(message="Google Ads account successfully linked.")


@router.get("/me/google-ads/customers", response_model=AccessibleCustomersResponse)
async def get_google_ads_customers(
        current_user: CurrentUser
) -> Any:
    """
    Get list of Google Ads customers accessible by the user.
    """
    if not current_user.google_refresh_token:
        raise HTTPException(status_code=400, detail="No Google Ads account linked.")

    try:
        service = UserGoogleAdsService(current_user)
        customers = await service.get_accessible_customers()
        return AccessibleCustomersResponse(customers=customers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch customers: {str(e)}")


@router.post("/me/google-ads/link-customer", response_model=Message)
async def link_customer_id(
        *,
        session: SessionDep,
        body: LinkCustomerRequest,
        current_user: CurrentUser
) -> Any:
    """
    Set the specific Google Ads Customer ID that this user manages.
    """
    if not current_user.google_refresh_token:
        raise HTTPException(status_code=400, detail="No Google Ads account linked.")

    try:
        service = UserGoogleAdsService(current_user)

        # Validate Access
        is_valid = await service.validate_and_link_customer(body.customer_id)

        if not is_valid:
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this Customer ID."
            )

        # Update User
        current_user.linked_customer_id = body.customer_id
        session.add(current_user)
        session.commit()

        return Message(message=f"Successfully linked Customer ID {body.customer_id}")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to link customer: {str(e)}")


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    # Dynamically check if linked
    user_public = UserPublic.model_validate(current_user)
    user_public.is_google_ads_linked = bool(current_user.google_refresh_token)
    return user_public


@router.delete("/me", response_model=Message)
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create new user without the need to be logged in.
    """
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )

    # Default to is_verified=False
    user_create = UserCreate.model_validate(user_in)
    user_create.is_verified = False

    user = crud.create_user(session=session, user_create=user_create)

    # Send Verification Email with SHORT-LIVED token (15 mins)
    if settings.emails_enabled:
        # Use the new function here
        token = generate_email_verification_token(email=user.email)
        email_data = generate_verification_email(email_to=user.email, email=user.email, token=token)
        send_email(
            email_to=user.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )

    return user


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
        user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if user == current_user:
        return UserPublic.model_validate(user)

    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(
        *,
        session: SessionDep,
        user_id: uuid.UUID,
        user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """

    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
        session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """
    Delete a user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    session.delete(user)
    session.commit()
    return Message(message="User deleted successfully")
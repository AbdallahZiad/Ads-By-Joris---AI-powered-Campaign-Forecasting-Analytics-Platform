import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import delete, func, select
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
    GoogleConnectRequest
)
from app.utils import generate_new_account_email, send_email, generate_verification_email, generate_email_verification_token

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", dependencies=[Depends(get_current_active_superuser)], response_model=UsersPublic)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """Retrieve users."""
    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()
    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    # Populate computed field
    public_users = []
    for user in users:
        u_public = UserPublic.model_validate(user)
        u_public.is_google_ads_linked = bool(user.google_refresh_token)
        public_users.append(u_public)

    return UsersPublic(data=public_users, count=count)

@router.post("/signup", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """Create new user without the need to be logged in."""
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="The user with this email already exists in the system")

    user_create = UserCreate.model_validate(user_in)
    user_create.is_verified = False
    user = crud.create_user(session=session, user_create=user_create)

    if settings.emails_enabled:
        token = generate_email_verification_token(email=user.email)
        email_data = generate_verification_email(email_to=user.email, email=user.email, token=token)
        send_email(email_to=user.email, subject=email_data.subject, html_content=email_data.html_content)

    return user

@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """Get current user."""
    user_public = UserPublic.model_validate(current_user)
    user_public.is_google_ads_linked = bool(current_user.google_refresh_token)
    return user_public

@router.patch("/me", response_model=UserPublic)
def update_user_me(*, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser) -> Any:
    """Update own user."""
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=409, detail="User with this email already exists")

    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    result = UserPublic.model_validate(current_user)
    result.is_google_ads_linked = bool(current_user.google_refresh_token)
    return result

@router.patch("/me/password", response_model=Message)
def update_password_me(*, session: SessionDep, body: UpdatePassword, current_user: CurrentUser) -> Any:
    """Update own password."""
    if not current_user.hashed_password:
        raise HTTPException(status_code=400, detail="User account does not use a password (Google Auth).")
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="New password cannot be the same as the current one")
    hashed_password = get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    session.commit()
    return Message(message="Password updated successfully")

@router.post("/me/link-google", response_model=Message)
def link_google_account(*, session: SessionDep, body: GoogleConnectRequest, current_user: CurrentUser) -> Any:
    """Link a Google Account (Identity) to the currently logged-in user."""
    try:
        id_info = id_token.verify_oauth2_token(body.id_token, requests.Request(), settings.GOOGLE_ADS_CLIENT_ID)
        google_id = id_info.get("sub")
        statement = select(User).where(User.google_id == google_id)
        existing_google_user = session.exec(statement).first()

        if existing_google_user:
            if existing_google_user.id == current_user.id:
                return Message(message="This Google account is already linked to your profile.")
            else:
                raise HTTPException(status_code=409, detail="This Google account is already linked to a different user.")

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

@router.delete("/me", response_model=Message)
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """Delete own user."""
    if current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Super users are not allowed to delete themselves")
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")

# --- Superuser Routes ---

@router.post("/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """Create new user (Superuser only)."""
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="The user with this email already exists.")
    user = crud.create_user(session=session, user_create=user_in)
    if settings.emails_enabled and user_in.email:
        email_data = generate_new_account_email(email_to=user_in.email, username=user_in.email, password=user_in.password)
        send_email(email_to=user_in.email, subject=email_data.subject, html_content=email_data.html_content)
    return user

@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser) -> Any:
    """Get a specific user by id."""
    user = session.get(User, user_id)
    if user == current_user: return UserPublic.model_validate(user)
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return user

@router.patch("/{user_id}", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic)
def update_user(*, session: SessionDep, user_id: uuid.UUID, user_in: UserUpdate) -> Any:
    """Update a user (Superuser only)."""
    db_user = session.get(User, user_id)
    if not db_user: raise HTTPException(status_code=404, detail="User not found")
    if user_in.email:
        existing = crud.get_user_by_email(session=session, email=user_in.email)
        if existing and existing.id != user_id: raise HTTPException(status_code=409, detail="Email already exists")
    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user

@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID) -> Message:
    """Delete a user (Superuser only)."""
    user = session.get(User, user_id)
    if not user: raise HTTPException(status_code=404, detail="User not found")
    if user == current_user: raise HTTPException(status_code=403, detail="Cannot delete self")
    session.delete(user)
    session.commit()
    return Message(message="User deleted successfully")
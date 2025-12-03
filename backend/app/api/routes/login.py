from datetime import timedelta
from typing import Annotated, Any
import httpx

from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlmodel import select

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import (
    Message,
    NewPassword,
    Token,
    UserPublic,
    GoogleAuthRequest,
    UserCreate,
    User,
    LoginRequest,
    BodyToken
)
from app.utils import (
    generate_password_reset_token,
    generate_reset_password_email,
    generate_verification_email,
    generate_email_verification_token,
    send_email,
    verify_password_reset_token,
)

router = APIRouter(tags=["login"])

@router.post("/login", response_model=Token)
def login_json(session: SessionDep, login_data: LoginRequest) -> Token:
    """
    Standard JSON Login.
    """
    user = crud.authenticate(
        session=session, email=login_data.email, password=login_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please check your inbox or resend verification."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )

@router.post("/login/access-token")
def login_access_token(
        session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 Form Login.
    """
    email = form_data.username
    user = crud.authenticate(
        session=session, email=email, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Email not verified. Please check your inbox or resend verification."
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )

@router.post("/login/google")
async def login_google(
        session: SessionDep,
        auth_data: GoogleAuthRequest
) -> Token:
    """
    Google-First Authentication.
    Accepts EITHER an 'id_token' (Implicit flow) OR a 'code' (Auth Code flow).
    """
    final_id_token = auth_data.id_token

    # 1. If we received a Code, exchange it for an ID Token first
    if auth_data.code:
        token_url = "https://oauth2.googleapis.com/token"

        clean_redirect_uri = (auth_data.redirect_uri or "http://localhost:8080").rstrip("/")

        payload = {
            "code": auth_data.code,
            "client_id": settings.GOOGLE_ADS_CLIENT_ID,
            "client_secret": settings.GOOGLE_ADS_CLIENT_SECRET,
            "redirect_uri": clean_redirect_uri,
            "grant_type": "authorization_code"
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=payload)

        if resp.status_code != 200:
            print(f"Google Token Exchange Failed: {resp.text}")
            raise HTTPException(status_code=400, detail=f"Google Error: {resp.text}")

        tokens = resp.json()
        final_id_token = tokens.get("id_token")

    if not final_id_token:
        raise HTTPException(status_code=400, detail="No ID Token provided or generated")

    try:
        # 2. Verify the ID Token
        # FIX: Added clock_skew_in_seconds=10 to handle slight local time differences
        id_info = id_token.verify_oauth2_token(
            final_id_token,
            requests.Request(),
            settings.GOOGLE_ADS_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        email = id_info.get("email")
        google_id = id_info.get("sub")
        name = id_info.get("name")
        picture = id_info.get("picture")

        if not email:
            raise HTTPException(status_code=400, detail="Google token does not contain an email")

        statement = select(User).where(User.google_id == google_id)
        user = session.exec(statement).first()

        if not user:
            user = crud.get_user_by_email(session=session, email=email)

            if user:
                # Merge accounts
                user.google_id = google_id
                user.avatar_url = picture
                if not user.is_verified:
                    user.is_verified = True
            else:
                # Create new
                user_in = UserCreate(
                    email=email,
                    full_name=name,
                    password=None,
                    avatar_url=picture,
                    is_verified=True,
                    settings={}
                )
                user = User.model_validate(user_in)
                user.google_id = google_id
                session.add(user)
                session.commit()
                session.refresh(user)
        else:
            # Update avatar if changed
            if user.avatar_url != picture:
                user.avatar_url = picture
                session.add(user)

        session.commit()
        session.refresh(user)

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return Token(
            access_token=security.create_access_token(
                user.id, expires_delta=access_token_expires
            )
        )

    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@router.post("/verify-email", response_model=Token)
def verify_email(session: SessionDep, body: BodyToken) -> Token:
    """
    Verify email address and Auto-Login.
    """
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_verified:
        user.is_verified = True
        session.add(user)
        session.commit()
        session.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/resend-verification", response_model=Message)
def resend_verification_email(
        email: str,
        session: SessionDep
) -> Message:
    """
    Resend the verification email to a user who hasn't verified yet.
    """
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        return Message(message="If the user exists, a verification email has been sent.")

    if user.is_verified:
        return Message(message="User is already verified.")

    token = generate_email_verification_token(email=email)
    email_data = generate_verification_email(email_to=user.email, email=user.email, token=token)
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )

    return Message(message="Verification email sent")


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    return current_user

@router.post("/password-recovery/{email}")
def recover_password(email: str, session: SessionDep) -> Message:
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    send_email(
        email_to=user.email,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Password recovery email sent")

@router.post("/reset-password/")
def reset_password(session: SessionDep, body: NewPassword) -> Message:
    email = verify_password_reset_token(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.get_user_by_email(session=session, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(password=body.new_password)
    user.hashed_password = hashed_password
    session.add(user)
    session.commit()
    return Message(message="Password updated successfully")

@router.post(
    "/password-recovery-html-content/{email}",
    dependencies=[Depends(get_current_active_superuser)],
    response_class=HTMLResponse,
)
def recover_password_html_content(email: str, session: SessionDep) -> Any:
    user = crud.get_user_by_email(session=session, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    email_data = generate_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )

    return HTMLResponse(
        content=email_data.html_content, headers={"subject:": email_data.subject}
    )
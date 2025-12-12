import logging
import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import emails  # type: ignore
import jwt
from jinja2 import Template
from jwt.exceptions import InvalidTokenError

from app.core import security
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
            Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
        *,
        email_to: str,
        subject: str = "",
        html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"

    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )

    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}

    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True

    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD

    logger.info(f"Attempting to send email to {email_to} via {settings.SMTP_HOST}:{settings.SMTP_PORT}...")

    try:
        response = message.send(to=email_to, smtp=smtp_options)
        logger.info(f"Email Provider Response: {response}")

        if response.status_code not in [250, 200]:
            logger.error(f"Failed to send email. Status: {response.status_code}, Error: {response.error}")

    except Exception as e:
        logger.error(f"CRITICAL EMAIL ERROR: {str(e)}")


def generate_test_email(email_to: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    html_content = render_email_template(
        template_name="test_email.html",
        context={"project_name": settings.PROJECT_NAME, "email": email_to},
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"

    # UPDATED: Matches frontend route /auth/reset-password
    link = f"{settings.FRONTEND_HOST}/auth/reset-password?token={token}"

    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(
        email_to: str, username: str, password: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.FRONTEND_HOST,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_verification_email(email_to: str, email: str, token: str) -> EmailData:
    """Generates the email content for account verification."""
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Verify your email"

    # UPDATED: Matches frontend route /auth/verify-email
    link = f"{settings.FRONTEND_HOST}/auth/verify-email?token={token}"

    html_content = render_email_template(
        template_name="email_verification.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "link": link,
            "valid_hours": "0.25" # Display roughly 15 mins
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_password_reset_token(email: str) -> str:
    """
    Generates a Long-Lived JWT token for password reset (Settings default: 48 hours).
    """
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.now(timezone.utc)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=security.ALGORITHM,
    )
    return encoded_jwt


def generate_email_verification_token(email: str) -> str:
    """
    Generates a Short-Lived JWT token for Email Verification & Auto-Login.
    Strictly expires in 15 minutes.
    """
    delta = timedelta(minutes=15)
    now = datetime.now(timezone.utc)
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email, "purpose": "verification"},
        settings.SECRET_KEY,
        algorithm=security.ALGORITHM,
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    """
    Verifies a JWT token.
    automatically validates the 'exp' claim, ensuring the token hasn't expired.
    Works for both reset and verification tokens.
    """
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None


def normalize_keyword(text: str) -> str:
    """
    Standardizes keyword text for robust comparison.
    1. Converts to lowercase.
    2. Strips leading/trailing whitespace.
    3. Normalizes internal whitespace (e.g. "  " becomes " ").
    """
    if not text:
        return ""

    # Lowercase and strip ends
    text = text.lower().strip()

    # Replace multiple spaces/tabs with a single space
    text = re.sub(r'\s+', ' ', text)

    return text
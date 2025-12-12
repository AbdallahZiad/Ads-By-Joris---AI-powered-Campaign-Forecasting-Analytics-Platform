import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import EmailStr, field_validator
from sqlmodel import Field, Relationship, SQLModel, Column, JSON


# --- Shared Properties ---

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = Field(default=False)
    full_name: str | None = Field(default=None, max_length=255)
    avatar_url: str | None = Field(default=None, max_length=1024)

    # App Preferences
    settings: Dict[str, Any] | None = Field(default_factory=dict, sa_column=Column(JSON))


# --- User Models ---

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Auth
    hashed_password: str | None = Field(default=None)

    # Google Identity & Ads OAuth Data
    google_id: str | None = Field(default=None, index=True)
    google_access_token: str | None = Field(default=None)
    google_refresh_token: str | None = Field(default=None)
    google_token_expiry: datetime | None = Field(default=None)

    # Permissions
    google_scopes: List[str] | None = Field(default_factory=list, sa_column=Column(JSON))

    # REFACTORED: Linked Customer ID moved to Project level.
    # User holds the KEYS (Refresh Token), Projects determine the ROOM (Customer ID).

    # Relationships
    projects: list["Project"] = Relationship(back_populates="owner", cascade_delete=True)


class UserCreate(UserBase):
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)
    settings: Dict[str, Any] | None = None


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    settings: Dict[str, Any] | None = None


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class UserPublic(UserBase):
    id: uuid.UUID
    google_id: str | None = None
    is_google_ads_linked: bool = False

    settings: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("settings", mode="before")
    @classmethod
    def ensure_settings_dict(cls, v: Any) -> Dict[str, Any]:
        return v or {}

    @field_validator("is_google_ads_linked", mode="before")
    @classmethod
    def check_refresh_token(cls, v: Any, info: Any) -> bool:
        return v


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# --- Authentication Schemas ---

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class GoogleAuthRequest(SQLModel):
    id_token: str | None = None
    code: str | None = None
    redirect_uri: str | None = "http://localhost:8080"

class GoogleConnectRequest(SQLModel):
    id_token: str | None = None
    code: str | None = None
    redirect_uri: str | None = "http://localhost:8080"

class GoogleAdsLinkRequest(SQLModel):
    code: str
    redirect_uri: str

class LoginRequest(SQLModel):
    email: EmailStr
    password: str

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class BodyToken(SQLModel):
    token: str


# --- Project Hierarchy Models ---

# 1. Keywords
class Keyword(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    text: str = Field(index=True)

    group_id: uuid.UUID = Field(foreign_key="group.id", ondelete="CASCADE")
    group: "Group" = Relationship(back_populates="keywords")

class KeywordCreate(SQLModel):
    text: str

class KeywordBulkCreate(SQLModel):
    keywords: List[str]


# 2. Groups
class Group(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str

    category_id: uuid.UUID = Field(foreign_key="category.id", ondelete="CASCADE")
    category: "Category" = Relationship(back_populates="groups")

    keywords: list[Keyword] = Relationship(back_populates="group", cascade_delete=True)

    # Link to Google Ad Group
    google_ad_group_id: str | None = Field(default=None)

class GroupCreate(SQLModel):
    name: str

class GroupUpdate(SQLModel):
    name: str | None = None
    google_ad_group_id: str | None = None


# 3. Categories
class Category(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str

    project_id: uuid.UUID = Field(foreign_key="project.id", ondelete="CASCADE")
    project: "Project" = Relationship(back_populates="categories")

    groups: list[Group] = Relationship(back_populates="category", cascade_delete=True)

    # Link to Google Campaign (NEW)
    google_campaign_id: str | None = Field(default=None)

class CategoryCreate(SQLModel):
    name: str

class CategoryUpdate(SQLModel):
    name: str | None = None
    google_campaign_id: str | None = None


# 4. Projects
class Project(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User = Relationship(back_populates="projects")

    categories: list[Category] = Relationship(back_populates="project", cascade_delete=True)

    # Link to Google Ads Customer (NEW)
    linked_customer_id: str | None = Field(default=None)

class ProjectCreate(SQLModel):
    title: str

class ProjectUpdate(SQLModel):
    title: str | None = None
    linked_customer_id: str | None = None


# --- Nested Input Models for Full Tree Creation ---

class GroupCreateFull(SQLModel):
    name: str
    keywords: List[str]

class CategoryCreateFull(SQLModel):
    name: str
    groups: List[GroupCreateFull]

class ProjectCreateFull(SQLModel):
    title: str
    categories: List[CategoryCreateFull]


# --- Response Models for Project Hierarchy ---

class KeywordPublic(SQLModel):
    id: uuid.UUID
    text: str

class GroupPublic(SQLModel):
    id: uuid.UUID
    name: str
    keywords: List[KeywordPublic]
    google_ad_group_id: str | None = None

class CategoryPublic(SQLModel):
    id: uuid.UUID
    name: str
    groups: List[GroupPublic]
    google_campaign_id: str | None = None

class ProjectPublic(SQLModel):
    id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime
    owner_id: uuid.UUID
    categories: List[CategoryPublic]
    linked_customer_id: str | None = None

class ProjectsPublic(SQLModel):
    data: list[ProjectPublic]
    count: int

# Generic message
class Message(SQLModel):
    message: str
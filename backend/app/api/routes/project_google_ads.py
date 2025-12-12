import uuid
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Project, Category, Group, ProjectPublic, CategoryPublic, GroupPublic
)
from app.schemas.google_ads_user_schemas import (
    LinkProjectCustomerRequest,
    CampaignListResponse,
    LinkCategoryCampaignRequest,
    AdGroupListResponse,
    LinkGroupAdGroupRequest
)
from app.services.google_ads_user import UserGoogleAdsService
from app.services.llm_autolink import AutoLinkLLMService

# Tag: Google Ads Integration
router = APIRouter(prefix="/projects", tags=["Google Ads Integration"])

# --- 1. Project Level Linking ---

@router.put("/{id}/link-customer", response_model=ProjectPublic)
async def link_project_customer(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkProjectCustomerRequest
) -> Any:
    """
    Links a Google Ads Customer ID to this Project.
    SAFETY: If Customer ID changes, all downstream Campaign/AdGroup links are RESET.
    """
    project = session.get(Project, id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not current_user.google_refresh_token: raise HTTPException(status_code=400, detail="Google Ads not linked.")

    try:
        service = UserGoogleAdsService(current_user)
        if not await service.validate_access(body.customer_id):
            raise HTTPException(status_code=403, detail=f"No access to Customer ID {body.customer_id}")

        # State Reset Logic
        if project.linked_customer_id and project.linked_customer_id != body.customer_id:
            for category in project.categories:
                category.google_campaign_id = None
                session.add(category)
                for group in category.groups:
                    group.google_ad_group_id = None
                    session.add(group)

        project.linked_customer_id = body.customer_id
        session.add(project)
        session.commit()
        session.refresh(project)
        return project
    except HTTPException: raise
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id}/google-ads/campaigns", response_model=CampaignListResponse)
async def get_project_live_campaigns(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """Fetch LIVE campaigns for the linked Project."""
    project = session.get(Project, id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not project.linked_customer_id: raise HTTPException(status_code=400, detail="Project not linked to Ads Customer.")

    try:
        service = UserGoogleAdsService(current_user, login_customer_id=project.linked_customer_id)
        campaigns = await service.get_campaigns(project.linked_customer_id)
        return CampaignListResponse(campaigns=campaigns)
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))


@router.post("/{id}/auto-link", response_model=Dict[str, int])
async def auto_link_project_structure(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    **AI Auto-Linker:** Uses an LLM to semantically match the Project structure
    to the Google Ads structure.

    1. Matches Categories -> Campaigns
    2. Matches Groups -> Ad Groups (Context-aware: only looks in linked Campaign)

    Returns a summary of how many items were linked.
    """
    # 1. Validation
    project = session.get(Project, id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not project.linked_customer_id: raise HTTPException(status_code=400, detail="Link a Google Customer ID first.")

    stats = {
        "categories_matched": 0,
        "groups_matched": 0
    }

    try:
        ads_service = UserGoogleAdsService(current_user, login_customer_id=project.linked_customer_id)
        llm_service = AutoLinkLLMService()

        # --- PHASE 1: Categories <-> Campaigns ---

        # A. Fetch Data
        google_campaigns = await ads_service.get_campaigns(project.linked_customer_id)
        app_categories = project.categories

        if not google_campaigns or not app_categories:
            return stats # Nothing to match

        # B. LLM Match
        cat_matches = await llm_service.match_items(app_categories, google_campaigns)

        # C. Apply Matches
        for cat in app_categories:
            match_id = cat_matches.get(str(cat.id))
            if match_id:
                # If changing link, reset children
                if cat.google_campaign_id != match_id:
                    for g in cat.groups:
                        g.google_ad_group_id = None
                        session.add(g)

                cat.google_campaign_id = match_id
                session.add(cat)
                stats["categories_matched"] += 1

        session.commit()
        session.refresh(project) # Refresh to get updated links for Phase 2

        # --- PHASE 2: Groups <-> Ad Groups (Context Aware) ---

        for category in project.categories:
            # We can only match groups if the parent category is linked to a campaign
            if not category.google_campaign_id:
                continue

            # A. Fetch Data (Scoped to this Campaign)
            google_ad_groups = await ads_service.get_ad_groups(
                project.linked_customer_id,
                category.google_campaign_id
            )
            app_groups = category.groups

            if not google_ad_groups or not app_groups:
                continue

            # B. LLM Match
            group_matches = await llm_service.match_items(app_groups, google_ad_groups)

            # C. Apply Matches
            for group in app_groups:
                match_id = group_matches.get(str(group.id))
                if match_id:
                    group.google_ad_group_id = match_id
                    session.add(group)
                    stats["groups_matched"] += 1

        session.commit()
        return stats

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-linking failed: {str(e)}")


# --- 2. Category Level Linking ---

@router.put("/categories/{id}/link-campaign", response_model=CategoryPublic)
async def link_category_campaign(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkCategoryCampaignRequest
) -> Any:
    """Link Category to Campaign. Validates existence."""
    category = session.get(Category, id)
    if not category: raise HTTPException(status_code=404, detail="Category not found")
    if category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not category.project.linked_customer_id: raise HTTPException(status_code=400, detail="Project not linked.")

    try:
        service = UserGoogleAdsService(current_user, login_customer_id=category.project.linked_customer_id)
        exists = await service.verify_campaign_exists(category.project.linked_customer_id, body.campaign_id)
        if not exists: raise HTTPException(status_code=404, detail="Campaign not found.")

        # State Reset
        if category.google_campaign_id and category.google_campaign_id != body.campaign_id:
            for group in category.groups:
                group.google_ad_group_id = None
                session.add(group)

        category.google_campaign_id = body.campaign_id
        session.add(category)
        session.commit()
        session.refresh(category)
        return category
    except HTTPException: raise
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories/{id}/google-ads/ad-groups", response_model=AdGroupListResponse)
async def get_category_live_ad_groups(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """Fetch LIVE Ad Groups for the linked Category's Campaign."""
    category = session.get(Category, id)
    if not category: raise HTTPException(status_code=404, detail="Category not found")
    if category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not category.google_campaign_id: raise HTTPException(status_code=400, detail="Category not linked to Campaign.")

    try:
        service = UserGoogleAdsService(current_user, login_customer_id=category.project.linked_customer_id)
        ad_groups = await service.get_ad_groups(category.project.linked_customer_id, category.google_campaign_id)
        return AdGroupListResponse(ad_groups=ad_groups)
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))


# --- 3. Group Level Linking ---

@router.put("/groups/{id}/link-ad-group", response_model=GroupPublic)
async def link_group_ad_group(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkGroupAdGroupRequest
) -> Any:
    """Link Group to Ad Group. Validates parentage."""
    group = session.get(Group, id)
    if not group: raise HTTPException(status_code=404, detail="Group not found")
    if group.category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not group.category.google_campaign_id: raise HTTPException(status_code=400, detail="Category not linked.")

    try:
        service = UserGoogleAdsService(current_user, login_customer_id=group.category.project.linked_customer_id)
        is_valid = await service.verify_ad_group_parentage(
            group.category.project.linked_customer_id,
            group.category.google_campaign_id,
            body.ad_group_id
        )
        if not is_valid: raise HTTPException(status_code=400, detail="Invalid Ad Group for this Campaign.")

        group.google_ad_group_id = body.ad_group_id
        session.add(group)
        session.commit()
        session.refresh(group)
        return group
    except HTTPException: raise
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))
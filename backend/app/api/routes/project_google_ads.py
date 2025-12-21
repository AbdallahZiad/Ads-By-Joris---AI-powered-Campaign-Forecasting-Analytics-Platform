import uuid
from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Project, ProjectPublic, CategoryPublic, GroupPublic
)
from app.schemas.google_ads_user_schemas import (
    LinkProjectCustomerRequest,
    CampaignListResponse,
    LinkCategoryCampaignRequest,
    AdGroupListResponse,
    LinkGroupAdGroupRequest,
    LabelingReport
)
from app.schemas.task_schemas import TaskResponse
from app.tasks import task_apply_labels # <--- IMPORT TASK
from app.services.google_ads_user import UserGoogleAdsService
from app.services.project_linking import ProjectLinkingService
from app.services.labeling_service import LabelingService

# Tag: Google Ads Integration
router = APIRouter(prefix="/projects", tags=["Google Ads Integration"])

# --- Helper: Permissions ---
def _get_project_with_permission(session, user, project_id) -> Project:
    project = session.get(Project, project_id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user.id: raise HTTPException(status_code=403, detail="Permission denied")
    return project

# --- 1. Linking & Structure ---

@router.put("/{id}/link-customer", response_model=ProjectPublic)
async def link_project_customer(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkProjectCustomerRequest
) -> Any:
    """Link Project to Google Ads Customer."""
    project = _get_project_with_permission(session, current_user, id)
    linker = ProjectLinkingService(session, current_user)
    try:
        return await linker.link_customer(project, body.customer_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) if not isinstance(e, HTTPException) else e

@router.get("/{id}/google-ads/campaigns", response_model=CampaignListResponse)
async def get_project_live_campaigns(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """Fetch LIVE campaigns."""
    project = _get_project_with_permission(session, current_user, id)
    if not project.linked_customer_id: raise HTTPException(status_code=400, detail="Project not linked.")
    try:
        service = UserGoogleAdsService(current_user, login_customer_id=project.linked_customer_id)
        campaigns = await service.get_campaigns(project.linked_customer_id)
        return CampaignListResponse(campaigns=campaigns)
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.put("/categories/{id}/link-campaign", response_model=CategoryPublic)
async def link_category_campaign(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkCategoryCampaignRequest
) -> Any:
    """Link Category to Campaign."""
    from app.models import Category
    category = session.get(Category, id)
    if not category: raise HTTPException(status_code=404, detail="Category not found")
    if category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")

    linker = ProjectLinkingService(session, current_user)
    try:
        return await linker.link_campaign(category, body.campaign_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) if not isinstance(e, HTTPException) else e

@router.get("/categories/{id}/google-ads/ad-groups", response_model=AdGroupListResponse)
async def get_category_live_ad_groups(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """Fetch LIVE Ad Groups."""
    from app.models import Category
    category = session.get(Category, id)
    if not category: raise HTTPException(status_code=404, detail="Category not found")
    if category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")
    if not category.google_campaign_id: raise HTTPException(status_code=400, detail="Category not linked.")

    try:
        service = UserGoogleAdsService(current_user, login_customer_id=category.project.linked_customer_id)
        ad_groups = await service.get_ad_groups(category.project.linked_customer_id, category.google_campaign_id)
        return AdGroupListResponse(ad_groups=ad_groups)
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@router.put("/groups/{id}/link-ad-group", response_model=GroupPublic)
async def link_group_ad_group(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID,
        body: LinkGroupAdGroupRequest
) -> Any:
    """Link Group to Ad Group."""
    from app.models import Group
    group = session.get(Group, id)
    if not group: raise HTTPException(status_code=404, detail="Group not found")
    if group.category.project.owner_id != current_user.id: raise HTTPException(status_code=403, detail="Permission denied")

    linker = ProjectLinkingService(session, current_user)
    try:
        return await linker.link_ad_group(group, body.ad_group_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) if not isinstance(e, HTTPException) else e

# --- 2. Automation Engines ---

@router.post("/{id}/auto-link", response_model=Dict[str, int])
async def auto_link_project_structure(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """Run AI Auto-Linking (Sync - Fast enough for now, can be moved to Async later if needed)."""
    project = _get_project_with_permission(session, current_user, id)
    linker = ProjectLinkingService(session, current_user)
    try:
        return await linker.run_auto_link(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{id}/apply-labels", response_model=TaskResponse)
async def apply_labels_to_project(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    Run Intelligent Labeling Engine (Async Task).
    This is a heavy operation involving Forecasts + DB Updates + Google Sync.
    """
    # 1. Verify access immediately (Fail fast)
    _get_project_with_permission(session, current_user, id)

    # 2. Dispatch Task
    # Pass IDs as strings, not objects
    task = task_apply_labels.delay(str(id), str(current_user.id))

    return TaskResponse(task_id=task.id)

@router.delete("/{id}/labels", response_model=LabelingReport)
async def remove_labels_from_project(
        *,
        session: SessionDep,
        current_user: CurrentUser,
        id: uuid.UUID
) -> Any:
    """
    **Label Cleanup:** Removes all [Joris] labels from the project locally
    and syncs the removal to Google Ads.
    (Kept synchronous for now as it's usually faster, but can be made async if timeouts occur)
    """
    project = _get_project_with_permission(session, current_user, id)
    labeler = LabelingService(session, current_user)
    try:
        return await labeler.remove_labels_from_project(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
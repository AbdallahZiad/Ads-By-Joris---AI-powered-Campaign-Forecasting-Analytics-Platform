from typing import Dict, Any, Optional
import uuid

from fastapi import HTTPException
from sqlmodel import Session

from app.models import Project, Category, Group, User
from app.services.google_ads_user import UserGoogleAdsService
from app.services.llm_autolink import AutoLinkLLMService

class ProjectLinkingService:
    """
    Handles the logic for linking internal Project entities to Google Ads entities.
    Enforces referential integrity, handles cascading state resets, and orchestrates AI linking.
    """

    def __init__(self, session: Session, user: User):
        self.session = session
        self.user = user

    # --- Manual Linking Methods ---

    async def link_customer(self, project: Project, customer_id: str) -> Project:
        """
        Links a Project to a Google Ads Customer ID.
        Resets all downstream links (Categories/Groups) if the customer changes.
        """
        if not self.user.google_refresh_token:
            raise HTTPException(status_code=400, detail="Google Ads not linked to user.")

        service = UserGoogleAdsService(self.user)
        if not await service.validate_access(customer_id):
            raise HTTPException(status_code=403, detail=f"No access to Customer ID {customer_id}")

        # State Reset Logic: If customer changes, wipe all children links
        if project.linked_customer_id and project.linked_customer_id != customer_id:
            print(f"Project {project.id}: Customer changed. Resetting hierarchy links.")
            for category in project.categories:
                category.google_campaign_id = None
                self.session.add(category)
                for group in category.groups:
                    group.google_ad_group_id = None
                    self.session.add(group)

        project.linked_customer_id = customer_id
        self.session.add(project)
        self.session.commit()
        self.session.refresh(project)
        return project

    async def link_campaign(self, category: Category, campaign_id: str) -> Category:
        """
        Links a Category to a Google Campaign.
        Resets downstream Group links if the campaign changes.
        """
        project = category.project
        if not project.linked_customer_id:
            raise HTTPException(status_code=400, detail="Parent Project must be linked to a Customer first.")

        service = UserGoogleAdsService(self.user, login_customer_id=project.linked_customer_id)
        exists = await service.verify_campaign_exists(project.linked_customer_id, campaign_id)

        if not exists:
            raise HTTPException(status_code=404, detail=f"Campaign ID {campaign_id} not found.")

        # State Reset Logic: If campaign changes, wipe child group links
        if category.google_campaign_id and category.google_campaign_id != campaign_id:
            print(f"Category {category.id}: Campaign changed. Resetting group links.")
            for group in category.groups:
                group.google_ad_group_id = None
                self.session.add(group)

        category.google_campaign_id = campaign_id
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    async def link_ad_group(self, group: Group, ad_group_id: str) -> Group:
        """
        Links a Group to a Google Ad Group.
        Validates that the Ad Group belongs to the Category's linked Campaign.
        """
        category = group.category
        if not category.google_campaign_id:
            raise HTTPException(status_code=400, detail="Parent Category must be linked to a Campaign first.")

        project = category.project
        customer_id = project.linked_customer_id
        campaign_id = category.google_campaign_id

        service = UserGoogleAdsService(self.user, login_customer_id=customer_id)

        # Strict Validation
        is_valid = await service.verify_ad_group_parentage(customer_id, campaign_id, ad_group_id)

        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid Ad Group. It does not belong to the linked Campaign."
            )

        group.google_ad_group_id = ad_group_id
        self.session.add(group)
        self.session.commit()
        self.session.refresh(group)
        return group

    # --- AI Auto-Linking ---

    async def run_auto_link(self, project: Project) -> Dict[str, int]:
        """
        Executes the AI Auto-Link cascade.
        1. Categories -> Campaigns
        2. Groups -> Ad Groups (Context Aware)
        """
        if not project.linked_customer_id:
            raise HTTPException(status_code=400, detail="Link a Google Customer ID first.")

        stats = { "categories_matched": 0, "groups_matched": 0 }

        try:
            ads_service = UserGoogleAdsService(self.user, login_customer_id=project.linked_customer_id)
            llm_service = AutoLinkLLMService()

            # --- PHASE 1: Categories <-> Campaigns ---
            google_campaigns = await ads_service.get_campaigns(project.linked_customer_id)
            app_categories = project.categories

            if google_campaigns and app_categories:
                cat_matches = await llm_service.match_items(app_categories, google_campaigns)

                for cat in app_categories:
                    match_id = cat_matches.get(str(cat.id))
                    if match_id:
                        # Reset check
                        if cat.google_campaign_id != match_id:
                            for g in cat.groups:
                                g.google_ad_group_id = None
                                self.session.add(g)

                        cat.google_campaign_id = match_id
                        self.session.add(cat)
                        stats["categories_matched"] += 1

            self.session.commit()
            self.session.refresh(project)

            # --- PHASE 2: Groups <-> Ad Groups ---
            for category in project.categories:
                if not category.google_campaign_id:
                    continue

                # Context-Aware Fetch: Only get ad groups for this specific campaign
                google_ad_groups = await ads_service.get_ad_groups(
                    project.linked_customer_id,
                    category.google_campaign_id
                )
                app_groups = category.groups

                if not google_ad_groups or not app_groups:
                    continue

                group_matches = await llm_service.match_items(app_groups, google_ad_groups)

                for group in app_groups:
                    match_id = group_matches.get(str(group.id))
                    if match_id:
                        group.google_ad_group_id = match_id
                        self.session.add(group)
                        stats["groups_matched"] += 1

            self.session.commit()
            return stats

        except Exception as e:
            # Re-raise as 500 but log detail
            print(f"Auto-linking failed: {e}")
            raise HTTPException(status_code=500, detail=f"Auto-linking failed: {str(e)}")
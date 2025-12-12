from typing import Dict, List, Set, Any
from sqlmodel import Session

from app.models import Project, User
from app.core.config import settings
from app.services.google_ads_user import UserGoogleAdsService
from app.services.google_ads_data import GoogleAdsDataService
from app.services.analysis import KeywordForecastingService
from app.services.label_engine import LabelEngine, LabelContext
from app.schemas.google_ads_data_schemas import GoogleAdsTargeting
from app.schemas.google_ads_user_schemas import LabelingReport
from app.utils import normalize_keyword

class LabelingService:
    """
    Orchestrator for the Intelligent Labeling Pipeline.
    Manages the data flow from Google -> Forecast -> Label Engine -> DB -> Google Sync.
    """

    def __init__(self, session: Session, user: User):
        self.session = session
        self.user = user

    async def apply_labels_to_project(self, project: Project) -> LabelingReport:
        """
        Runs the full labeling pipeline for a project.
        Returns a detailed report of actions taken.
        """
        if not project.linked_customer_id:
            raise ValueError("Project is not linked to a Google Ads Customer.")

        # Initialize Stats Tracking
        report = LabelingReport()
        unique_kw_labels = set()
        unique_group_labels = set()
        unique_cat_labels = set()

        # 1. Initialize Sub-Services
        user_ads_service = UserGoogleAdsService(self.user, login_customer_id=project.linked_customer_id)
        data_service = GoogleAdsDataService()
        forecast_service = KeywordForecastingService()

        # 2. Collect ALL keywords for efficient batch processing
        all_keywords_text = []
        for category in project.categories:
            for group in category.groups:
                for kw in group.keywords:
                    all_keywords_text.append(kw.text)

        unique_keywords = list(set(all_keywords_text))
        if not unique_keywords:
            return report

        # 3. Data & Forecast Phase
        metrics_response = await data_service.get_keywords_historical_metrics(
            keywords=unique_keywords,
            target=GoogleAdsTargeting(customer_id=settings.GOOGLE_ADS_CUSTOMER_ID)
        )
        forecast_response = await forecast_service.forecast_keywords(metrics_response)

        # 4. Optimization: Create Lookup Maps
        metrics_map = {
            normalize_keyword(res.keyword): res.keyword_metrics
            for res in metrics_response.results
        }
        forecast_map = {
            normalize_keyword(f.keyword): f
            for f in forecast_response.forecasts
        }

        # 5. Calculate Statistical Context
        cpc_values = []
        volume_values = []

        for res in metrics_response.results:
            if res.keyword_metrics:
                volume_values.append(res.keyword_metrics.avg_monthly_searches)
                if res.keyword_metrics.average_cpc_micros:
                    cpc_values.append(res.keyword_metrics.average_cpc_micros)

        context = LabelContext(cpc_values=cpc_values, volume_values=volume_values)

        print(f"\n=== LABELING ENGINE STARTED ===")
        print(f"Context: Avg CPC={context.avg_cpc/1_000_000:.2f}, Median Vol={context.median_volume}")

        # 6. Apply Logic & Sync
        for category in project.categories:
            category_labels_set = set()

            for group in category.groups:
                group_kw_labels = []

                print(f"\nProcessing Group: {group.name}")

                for kw in group.keywords:
                    norm_text = normalize_keyword(kw.text)
                    kw_forecast = forecast_map.get(norm_text)

                    if not kw_forecast: continue
                    kw_metric = metrics_map.get(norm_text)

                    # Generate Labels
                    labels = LabelEngine.generate_keyword_labels(kw_forecast, kw_metric, context)

                    # Log for debugging
                    growth = kw_forecast.annual_growth_rate or 0
                    print(f"  > KW: '{kw.text}' | Growth: {growth:.1%} | Labels: {labels}")

                    # Update DB
                    kw.applied_labels = labels
                    self.session.add(kw)

                    # Stats
                    if labels:
                        report.keywords.count += 1
                        unique_kw_labels.update(labels)
                        report.total_items_processed += 1

                    group_kw_labels.append(labels)

                # Aggregate Labels for Group
                group_labels = LabelEngine.compute_group_labels(group_kw_labels)
                print(f"  >> Group Final Labels: {group_labels}")

                group.applied_labels = group_labels
                self.session.add(group)

                # Stats
                if group_labels:
                    report.groups.count += 1
                    unique_group_labels.update(group_labels)
                    report.total_items_processed += 1

                # Sync Group to Google Ads
                if group.google_ad_group_id:
                    await user_ads_service.sync_labels_for_ad_group(
                        customer_id=project.linked_customer_id,
                        ad_group_id=group.google_ad_group_id,
                        new_label_names=group_labels
                    )

                category_labels_set.update(group_labels)

            # Sync Category/Campaign Labels
            final_cat_labels = list(category_labels_set)

            # Stats
            if final_cat_labels:
                report.categories.count += 1
                unique_cat_labels.update(final_cat_labels)
                report.total_items_processed += 1

            if category.google_campaign_id:
                category.applied_labels = final_cat_labels
                self.session.add(category)

                await user_ads_service.sync_labels_for_campaign(
                    customer_id=project.linked_customer_id,
                    campaign_id=category.google_campaign_id,
                    new_label_names=final_cat_labels
                )

        # Finalize Report Lists
        report.keywords.unique_labels_applied = list(unique_kw_labels)
        report.groups.unique_labels_applied = list(unique_group_labels)
        report.categories.unique_labels_applied = list(unique_cat_labels)

        self.session.commit()
        return report

    async def remove_labels_from_project(self, project: Project) -> LabelingReport:
        """
        Removes all [Joris] labels from the project locally and syncs removals to Google Ads.
        """
        if not project.linked_customer_id:
            raise ValueError("Project is not linked to a Google Ads Customer.")

        report = LabelingReport()
        user_ads_service = UserGoogleAdsService(self.user, login_customer_id=project.linked_customer_id)

        print("\n=== LABEL REMOVAL STARTED ===")

        for category in project.categories:
            # 1. Clear Group Labels
            for group in category.groups:
                if group.applied_labels:
                    report.groups.count += 1
                    group.applied_labels = [] # Clear Local
                    self.session.add(group)

                # Sync Wipe to Google (passing empty list triggers removal of Joris labels)
                if group.google_ad_group_id:
                    await user_ads_service.sync_labels_for_ad_group(
                        customer_id=project.linked_customer_id,
                        ad_group_id=group.google_ad_group_id,
                        new_label_names=[]
                    )

                # Clear Keyword Labels (Local only, keywords aren't synced to ads individually yet)
                for kw in group.keywords:
                    if kw.applied_labels:
                        report.keywords.count += 1
                        kw.applied_labels = []
                        self.session.add(kw)

            # 2. Clear Category/Campaign Labels
            if category.applied_labels:
                report.categories.count += 1
                category.applied_labels = [] # Clear Local
                self.session.add(category)

            if category.google_campaign_id:
                await user_ads_service.sync_labels_for_campaign(
                    customer_id=project.linked_customer_id,
                    campaign_id=category.google_campaign_id,
                    new_label_names=[]
                )

        self.session.commit()
        return report
import asyncio
from sqlmodel import Session, select
from celery import shared_task

from app.core.db import engine
from app.models import User, Project
from app.services.analysis import KeywordForecastingService
from app.services.ai_scan import AIScanService
from app.services.labeling_service import LabelingService
from app.schemas.google_ads_data_schemas import GoogleAdsKeywordResponse
from app.schemas.web_crawler_schemas import CrawlConfig

# --- TASK 1: FORECASTING (Stateless, CPU Bound) ---
@shared_task(bind=True, name="task_forecast_keywords")
def task_forecast_keywords(self, google_ads_data_dict: dict, forecast_months: int):
    """
    Celery task wrapper for KeywordForecastingService.
    """
    try:
        # 1. Rehydrate Pydantic Model
        # Use model_validate to handle complex nested structures and aliases (text vs keyword)
        try:
            input_data = GoogleAdsKeywordResponse.model_validate(google_ads_data_dict)
        except Exception:
            # Fallback for strict dictionary unpacking if validation fails on aliases
            input_data = GoogleAdsKeywordResponse(**google_ads_data_dict)

        # 2. Initialize Service
        service = KeywordForecastingService()

        # 3. Bridge Async to Sync
        response = asyncio.run(
            service.forecast_keywords(
                data_response=input_data,
                forecast_months=forecast_months
            )
        )

        # 4. Return as Dict (for Celery JSON serialization)
        return response.model_dump(mode="json")

    except Exception as e:
        print(f"CRITICAL WORKER ERROR in task_forecast_keywords: {str(e)}")
        raise e


# --- TASK 2: AI WEBSITE SCAN (Long Running I/O + CPU) ---
@shared_task(bind=True, name="task_scan_website")
def task_scan_website(self, crawl_config_dict: dict):
    """
    Celery task wrapper for AIScanService.
    """
    try:
        # 1. Rehydrate Configuration
        config = CrawlConfig.model_validate(crawl_config_dict)

        # 2. Initialize Service
        scanner = AIScanService()

        # 3. Bridge Async to Sync (Run the heavy pipeline)
        llm_result, crawl_stats = asyncio.run(scanner.scan_website(config))

        # 4. Construct Final Response Dictionary manually to ensure JSON serializability
        # We match the 'AIScanResponse' schema structure
        return {
            "structured_data": [item.model_dump(mode="json") for item in llm_result.data],
            # UPDATED: Pass the detected ads config (if available)
            "google_ads_config": llm_result.ads_config.model_dump(mode="json") if llm_result.ads_config else None,
            "crawl_stats": crawl_stats.model_dump(mode="json"),
            "llm_metrics": llm_result.metrics.model_dump(mode="json")
        }

    except Exception as e:
        print(f"CRITICAL WORKER ERROR in task_scan_website: {str(e)}")
        raise e


# --- TASK 3: LABELING ENGINE (Database Heavy) ---
@shared_task(bind=True, name="task_apply_labels")
def task_apply_labels(self, project_id: str, user_id: str):
    """
    Celery task for LabelingService.
    Requires manually creating a DB Session since we are in a separate worker process.
    """
    try:
        # 1. Create a fresh Database Session for this task
        with Session(engine) as session:

            # 2. Re-fetch User and Project
            # Objects cannot be passed across processes, so we pass IDs and refetch.
            user = session.get(User, user_id)
            if not user:
                raise ValueError(f"User {user_id} not found in worker task.")

            project = session.get(Project, project_id)
            if not project:
                raise ValueError(f"Project {project_id} not found in worker task.")

            # 3. Initialize Service with the fresh session
            service = LabelingService(session=session, user=user)

            # 4. Run Logic (Async to Sync Bridge)
            report = asyncio.run(service.apply_labels_to_project(project))

            # 5. Return Report as Dict
            return report.model_dump(mode="json")

    except Exception as e:
        print(f"CRITICAL WORKER ERROR in task_apply_labels: {str(e)}")
        raise e
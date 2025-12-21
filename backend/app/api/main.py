from fastapi import APIRouter

from app.api.routes import (
    login,
    private,
    users,
    utils,
    google_ads,
    analysis,
    ai_scan,
    projects,
    user_google_ads,
    project_google_ads,
    tasks  # <--- IMPORT NEW ROUTER
)
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(user_google_ads.router)
api_router.include_router(utils.router)
api_router.include_router(projects.router)
api_router.include_router(project_google_ads.router)
api_router.include_router(google_ads.router)
api_router.include_router(analysis.router)
api_router.include_router(ai_scan.router)
api_router.include_router(tasks.router) # <--- REGISTER NEW ROUTER


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
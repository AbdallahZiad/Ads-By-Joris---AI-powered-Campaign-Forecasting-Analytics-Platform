from fastapi import APIRouter

from app.api.routes import login, private, users, utils, google_ads, analysis, ai_scan, projects
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(projects.router) # <--- ADDED PROJECTS ROUTER
api_router.include_router(google_ads.router)
api_router.include_router(analysis.router)
api_router.include_router(ai_scan.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
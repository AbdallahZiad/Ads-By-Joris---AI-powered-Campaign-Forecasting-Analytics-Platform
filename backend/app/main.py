import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from app.api.main import api_router
from app.core.config import settings

# --- CRITICAL FIX: Import celery_app to ensure configuration is loaded ---
# Even though we don't use 'celery_app' directly here, importing it
# executes the configuration code in app/core/celery_app.py,
# binding the shared_tasks to the correct Redis URL.
from app.core.celery_app import celery_app

def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# --- CUSTOM OPENAPI SCHEMA ---
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version="0.1.0",
        description="Ads By Joris API",
        routes=app.routes,
    )

    # Inject a description into the Security Scheme to clarify 'username' = 'email'
    if "components" in openapi_schema and "securitySchemes" in openapi_schema["components"]:
        for scheme_name, scheme in openapi_schema["components"]["securitySchemes"].items():
            if scheme["type"] == "oauth2":
                scheme["description"] = "<strong>NOTE:</strong> For the 'username' field, please enter your <strong>EMAIL ADDRESS</strong>."

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
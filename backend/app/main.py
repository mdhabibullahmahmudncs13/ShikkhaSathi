from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_v1.api import api_router
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.db.redis_client import connect_to_redis, close_redis_connection

app = FastAPI(
    title="ShikkhaSathi API",
    description="AI-powered adaptive learning platform for Bangladesh students",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await connect_to_redis()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    await close_redis_connection()

@app.get("/")
async def root():
    return {"message": "ShikkhaSathi API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ShikkhaSathi API"}
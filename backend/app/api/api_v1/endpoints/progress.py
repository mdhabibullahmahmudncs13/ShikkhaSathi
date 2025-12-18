from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data():
    return {"message": "Dashboard data endpoint - to be implemented"}

@router.get("/analytics")
async def get_analytics():
    return {"message": "Analytics endpoint - to be implemented"}
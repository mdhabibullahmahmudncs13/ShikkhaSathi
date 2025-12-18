from fastapi import APIRouter

router = APIRouter()

@router.post("/generate")
async def generate_quiz():
    return {"message": "Quiz generation endpoint - to be implemented"}

@router.post("/submit")
async def submit_quiz():
    return {"message": "Quiz submission endpoint - to be implemented"}

@router.get("/history")
async def get_quiz_history():
    return {"message": "Quiz history endpoint - to be implemented"}
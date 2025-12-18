from fastapi import APIRouter

router = APIRouter()

@router.post("/message")
async def send_message():
    return {"message": "Chat message endpoint - to be implemented"}

@router.get("/history")
async def get_chat_history():
    return {"message": "Chat history endpoint - to be implemented"}
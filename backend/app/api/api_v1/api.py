from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, chat, quiz, progress, gamification, teacher, assessment, parent
from app.api.api_v1 import docs

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(progress.router, prefix="/progress", tags=["progress"])
api_router.include_router(gamification.router, prefix="/gamification", tags=["gamification"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["teacher"])
api_router.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
api_router.include_router(parent.router, prefix="/parent", tags=["parent"])
api_router.include_router(docs.router, prefix="/docs", tags=["documentation"])
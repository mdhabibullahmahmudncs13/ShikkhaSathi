from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from uuid import UUID
import logging

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.services.quiz.quiz_service import QuizService
from app.schemas.question import (
    QuizGenerateRequest,
    QuizSubmitRequest,
    QuizResult,
    QuizHistory,
    QuizRecommendation
)

logger = logging.getLogger(__name__)
router = APIRouter()

def get_quiz_service(db: Session = Depends(get_db)) -> QuizService:
    """Get quiz service instance"""
    return QuizService(db)

@router.post("/generate")
def generate_quiz(
    request: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Generate a quiz from the question bank
    
    - **subject**: Subject name (e.g., Mathematics, Physics)
    - **topic**: Optional topic filter
    - **grade**: Grade level (6-12)
    - **difficulty_level**: Optional difficulty (1-5)
    - **bloom_level**: Optional Bloom's taxonomy level (1-6)
    - **question_count**: Number of questions (5-50)
    - **time_limit_minutes**: Optional time limit
    - **language**: 'english' or 'bangla'
    """
    try:
        logger.info(f"Generating quiz for user {current_user.id}: {request.subject}/{request.topic}")
        
        quiz_data = quiz_service.generate_quiz(
            user_id=current_user.id,
            subject=request.subject,
            topic=request.topic,
            grade=request.grade,
            difficulty_level=request.difficulty_level,
            bloom_level=request.bloom_level,
            question_count=request.question_count,
            time_limit_minutes=request.time_limit_minutes,
            language=request.language
        )
        
        return quiz_data
        
    except ValueError as e:
        logger.warning(f"Quiz generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Quiz generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )

@router.post("/submit")
async def submit_quiz(
    submission: QuizSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    services = Depends(get_quiz_services)
):
    """Submit quiz and get results with feedback"""
    try:
        # This would typically retrieve the original questions from cache/database
        # For now, we'll return a placeholder response
        
        scoring_service = services["scoring_service"]
        adaptive_engine = services["adaptive_engine"]
        
        # Convert responses
        responses = [
            QuestionResponse(
                question_id=r.question_id,
                student_answer=r.student_answer,
                time_taken_seconds=r.time_taken_seconds,
                is_flagged=r.is_flagged
            )
            for r in submission.responses
        ]
        
        # Note: In a real implementation, we would retrieve the original questions
        # from cache or database using the quiz_id
        # For now, return a placeholder response
        
        return {
            "message": "Quiz submission received",
            "quiz_id": submission.quiz_id,
            "responses_count": len(responses),
            "status": "processed"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}"
        )

@router.get("/history")
async def get_quiz_history(
    subject: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get quiz history for the current user"""
    try:
        from app.models.quiz_attempt import QuizAttempt
        
        query = db.query(QuizAttempt).filter(
            QuizAttempt.user_id == current_user.id
        )
        
        if subject:
            query = query.filter(QuizAttempt.subject == subject)
        
        attempts = query.order_by(
            QuizAttempt.completed_at.desc()
        ).limit(limit).all()
        
        history = [
            QuizHistoryResponse(
                quiz_id=str(attempt.quiz_id),
                subject=attempt.subject,
                topic=attempt.topic,
                score=attempt.score,
                max_score=attempt.max_score,
                percentage=(attempt.score / attempt.max_score * 100) if attempt.max_score > 0 else 0,
                completed_at=attempt.completed_at,
                difficulty_level=attempt.difficulty_level
            )
            for attempt in attempts
        ]
        
        return {
            "history": history,
            "total_count": len(history)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get quiz history: {str(e)}"
        )

@router.get("/analytics")
async def get_quiz_analytics(
    subject: Optional[str] = None,
    days_back: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    services = Depends(get_quiz_services)
):
    """Get quiz performance analytics"""
    try:
        scoring_service = services["scoring_service"]
        analytics = scoring_service.get_quiz_analytics(
            user_id=str(current_user.id),
            subject=subject,
            days_back=days_back
        )
        
        return analytics
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics: {str(e)}"
        )

@router.get("/performance/{subject}/{topic}")
async def get_topic_performance(
    subject: str,
    topic: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    services = Depends(get_quiz_services)
):
    """Get performance analytics for a specific topic"""
    try:
        adaptive_engine = services["adaptive_engine"]
        
        performance = adaptive_engine.get_performance_analytics(
            user_id=str(current_user.id),
            subject=subject
        )
        
        return performance
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get topic performance: {str(e)}"
        )
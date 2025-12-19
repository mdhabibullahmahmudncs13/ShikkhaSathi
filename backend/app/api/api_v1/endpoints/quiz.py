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
async def generate_quiz(
    request: QuizGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    services = Depends(get_quiz_services)
):
    """Generate adaptive quiz questions"""
    try:
        # Calculate difficulty if not provided
        difficulty_level = request.difficulty_level
        if difficulty_level is None:
            adaptive_engine = services["adaptive_engine"]
            difficulty_adjustment = adaptive_engine.calculate_next_difficulty(
                user_id=str(current_user.id),
                subject=request.subject,
                topic=request.topic,
                grade=request.grade
            )
            difficulty_level = difficulty_adjustment.new_difficulty
        
        # Convert string enums
        question_type = QuestionType(request.question_type)
        bloom_level = BloomLevel(request.bloom_level)
        
        # Create generation request
        gen_request = QuestionGenerationRequest(
            subject=request.subject,
            topic=request.topic,
            grade=request.grade,
            question_type=question_type,
            bloom_level=bloom_level,
            difficulty_level=difficulty_level,
            count=request.count,
            language=request.language
        )
        
        # Generate questions
        question_generator = services["question_generator"]
        questions = await question_generator.generate_questions(gen_request)
        
        if not questions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No questions could be generated for the specified criteria"
            )
        
        # Convert to API response format
        quiz_id = str(uuid.uuid4())
        
        return {
            "quiz_id": quiz_id,
            "questions": [
                {
                    "id": q.id,
                    "question_text": q.question_text,
                    "question_type": q.question_type.value,
                    "bloom_level": q.bloom_level.value,
                    "difficulty_level": q.difficulty_level,
                    "options": q.options,
                    "subject": q.subject,
                    "topic": q.topic,
                    "grade": q.grade
                }
                for q in questions
            ],
            "metadata": {
                "subject": request.subject,
                "topic": request.topic,
                "grade": request.grade,
                "difficulty_level": difficulty_level,
                "bloom_level": request.bloom_level,
                "total_questions": len(questions)
            }
        }
        
    except Exception as e:
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
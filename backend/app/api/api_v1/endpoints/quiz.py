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
def submit_quiz(
    submission: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Submit quiz answers and get results
    
    - **quiz_id**: Quiz identifier
    - **answers**: Map of question_id to answer (A/B/C/D)
    - **time_taken_seconds**: Total time taken
    """
    try:
        logger.info(f"Submitting quiz {submission.quiz_id} for user {current_user.id}")
        
        result = quiz_service.submit_quiz(
            quiz_id=submission.quiz_id,
            user_id=current_user.id,
            answers=submission.answers,
            time_taken_seconds=submission.time_taken_seconds
        )
        
        return result
        
    except ValueError as e:
        logger.warning(f"Quiz submission failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Quiz submission error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}"
        )

@router.get("/results/{attempt_id}")
def get_quiz_results(
    attempt_id: UUID,
    current_user: User = Depends(get_current_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get detailed quiz results
    
    - **attempt_id**: Quiz attempt identifier
    """
    try:
        logger.info(f"Getting quiz results {attempt_id} for user {current_user.id}")
        
        results = quiz_service.get_quiz_results(
            attempt_id=attempt_id,
            user_id=current_user.id
        )
        
        return results
        
    except ValueError as e:
        logger.warning(f"Get results failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Get results error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get quiz results: {str(e)}"
        )


@router.get("/history", response_model=List[QuizHistory])
def get_quiz_history(
    subject: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Get quiz attempt history
    
    - **subject**: Optional subject filter
    - **limit**: Maximum number of attempts to return (default: 20)
    """
    try:
        logger.info(f"Getting quiz history for user {current_user.id}")
        
        history = quiz_service.get_quiz_history(
            user_id=current_user.id,
            subject=subject,
            limit=limit
        )
        
        return history
        
    except Exception as e:
        logger.error(f"Get history error: {e}")
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
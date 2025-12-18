"""
Teacher Analytics API Endpoints
Provides comprehensive analytics and performance tracking for teachers
"""

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user, require_teacher
from app.models.user import User
from app.services.teacher_analytics_service import TeacherAnalyticsService

router = APIRouter()


@router.get("/class-performance")
async def get_class_performance_metrics(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    time_range: str = Query("month", regex="^(week|month|quarter)$", description="Time range for analysis"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get comprehensive class performance metrics
    
    **Validates: Requirements 6.1, 6.2, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range=time_range
        )
        return metrics
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get class performance metrics: {str(e)}"
        )


@router.get("/student-analytics/{student_id}")
async def get_student_analytics(
    student_id: str,
    time_range: str = Query("month", regex="^(week|month|quarter)$", description="Time range for analysis"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get detailed analytics for a specific student
    
    **Validates: Requirements 6.1, 6.2, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        analytics = analytics_service.get_student_analytics(
            teacher_id=str(current_user.id),
            student_id=student_id,
            time_range=time_range
        )
        return analytics
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get student analytics: {str(e)}"
        )


@router.get("/at-risk-students")
async def get_at_risk_students(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Identify students who are at risk and need intervention
    
    **Validates: Requirements 6.2, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        at_risk_students = analytics_service.identify_at_risk_students(
            teacher_id=str(current_user.id),
            class_id=class_id
        )
        return {"at_risk_students": at_risk_students}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to identify at-risk students: {str(e)}"
        )


@router.get("/comparative-analysis")
async def get_comparative_analysis(
    class_ids: List[str] = Query(..., description="List of class IDs to compare"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get comparative analysis across multiple classes
    
    **Validates: Requirements 6.1, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        analysis = analytics_service.get_comparative_analysis(
            teacher_id=str(current_user.id),
            class_ids=class_ids
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get comparative analysis: {str(e)}"
        )


@router.get("/weakness-patterns")
async def get_weakness_patterns(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    time_range: str = Query("month", regex="^(week|month|quarter)$", description="Time range for analysis"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get identified weakness patterns for intervention planning
    
    **Validates: Requirements 6.2, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range=time_range
        )
        return {"weakness_patterns": metrics["weaknessPatterns"]}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get weakness patterns: {str(e)}"
        )


@router.get("/engagement-metrics")
async def get_engagement_metrics(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    time_range: str = Query("month", regex="^(week|month|quarter)$", description="Time range for analysis"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get detailed engagement metrics and time tracking
    
    **Validates: Requirements 6.1, 6.2**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range=time_range
        )
        return {
            "engagement_metrics": metrics["engagementMetrics"],
            "time_analytics": metrics["timeAnalytics"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get engagement metrics: {str(e)}"
        )


@router.get("/performance-trends")
async def get_performance_trends(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    subject: Optional[str] = Query(None, description="Subject to filter by"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get performance trends over time for analysis
    
    **Validates: Requirements 6.1, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        
        # Get metrics for different time ranges to show trends
        week_metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range="week"
        )
        
        month_metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range="month"
        )
        
        quarter_metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range="quarter"
        )
        
        # Filter by subject if specified
        if subject:
            week_subject = [s for s in week_metrics["subjectPerformance"] if s["subject"] == subject]
            month_subject = [s for s in month_metrics["subjectPerformance"] if s["subject"] == subject]
            quarter_subject = [s for s in quarter_metrics["subjectPerformance"] if s["subject"] == subject]
            
            return {
                "subject": subject,
                "trends": {
                    "week": week_subject[0] if week_subject else None,
                    "month": month_subject[0] if month_subject else None,
                    "quarter": quarter_subject[0] if quarter_subject else None
                }
            }
        
        return {
            "trends": {
                "week": {
                    "averageScore": week_metrics["averageScore"],
                    "completionRate": week_metrics["completionRate"],
                    "engagementRate": week_metrics["engagementMetrics"]["dailyActiveUsers"]
                },
                "month": {
                    "averageScore": month_metrics["averageScore"],
                    "completionRate": month_metrics["completionRate"],
                    "engagementRate": month_metrics["engagementMetrics"]["dailyActiveUsers"]
                },
                "quarter": {
                    "averageScore": quarter_metrics["averageScore"],
                    "completionRate": quarter_metrics["completionRate"],
                    "engagementRate": quarter_metrics["engagementMetrics"]["dailyActiveUsers"]
                }
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get performance trends: {str(e)}"
        )


@router.get("/intervention-recommendations/{student_id}")
async def get_intervention_recommendations(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get personalized intervention recommendations for a student
    
    **Validates: Requirements 6.2, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        analytics = analytics_service.get_student_analytics(
            teacher_id=str(current_user.id),
            student_id=student_id,
            time_range="month"
        )
        return {"recommendations": analytics["interventionRecommendations"]}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get intervention recommendations: {str(e)}"
        )


@router.get("/bloom-level-analysis")
async def get_bloom_level_analysis(
    class_id: Optional[str] = Query(None, description="Class ID to filter by"),
    subject: Optional[str] = Query(None, description="Subject to filter by"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher)
) -> Any:
    """
    Get Bloom's taxonomy level analysis for the class
    
    **Validates: Requirements 6.1, 6.3**
    """
    try:
        analytics_service = TeacherAnalyticsService(db)
        metrics = analytics_service.get_class_performance_metrics(
            teacher_id=str(current_user.id),
            class_id=class_id,
            time_range="month"
        )
        
        # Extract Bloom level data
        bloom_analysis = {}
        for subject_perf in metrics["subjectPerformance"]:
            if subject is None or subject_perf["subject"] == subject:
                bloom_analysis[subject_perf["subject"]] = subject_perf["bloomLevelDistribution"]
        
        return {"bloom_level_analysis": bloom_analysis}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get Bloom level analysis: {str(e)}"
        )
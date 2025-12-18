"""
Teacher Analytics Service
Provides comprehensive analytics and performance tracking for teachers
"""

from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from collections import defaultdict
import statistics

from app.models.user import User, UserRole
from app.models.student_progress import StudentProgress
from app.models.quiz_attempt import QuizAttempt
from app.models.gamification import Gamification
from app.models.learning_path import LearningPath


class TeacherAnalyticsService:
    """Service for teacher analytics and performance tracking"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_class_performance_metrics(
        self, 
        teacher_id: str, 
        class_id: Optional[str] = None,
        time_range: str = "month"
    ) -> Dict[str, Any]:
        """Get comprehensive class performance metrics"""
        
        # Calculate date range
        end_date = datetime.utcnow()
        if time_range == "week":
            start_date = end_date - timedelta(days=7)
        elif time_range == "month":
            start_date = end_date - timedelta(days=30)
        elif time_range == "quarter":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Get students in the class (for now, all students - in real app would filter by class)
        students = self.db.query(User).filter(User.role == UserRole.STUDENT).all()
        student_ids = [str(student.id) for student in students]
        
        if not student_ids:
            return self._empty_metrics()
        
        # Get quiz attempts in time range
        quiz_attempts = self.db.query(QuizAttempt).filter(
            and_(
                QuizAttempt.user_id.in_(student_ids),
                QuizAttempt.completed_at >= start_date,
                QuizAttempt.completed_at <= end_date
            )
        ).all()
        
        # Get student progress data
        progress_data = self.db.query(StudentProgress).filter(
            and_(
                StudentProgress.user_id.in_(student_ids),
                StudentProgress.last_accessed >= start_date
            )
        ).all()
        
        # Get gamification data
        gamification_data = self.db.query(Gamification).filter(
            Gamification.user_id.in_(student_ids)
        ).all()
        
        # Calculate metrics
        metrics = {
            "classId": class_id or "default",
            "averageScore": self._calculate_average_score(quiz_attempts),
            "completionRate": self._calculate_completion_rate(progress_data, student_ids),
            "engagementMetrics": self._calculate_engagement_metrics(
                gamification_data, quiz_attempts, progress_data, start_date, end_date
            ),
            "subjectPerformance": self._calculate_subject_performance(
                quiz_attempts, progress_data
            ),
            "weaknessPatterns": self._identify_weakness_patterns(
                quiz_attempts, progress_data, students
            ),
            "timeAnalytics": self._calculate_time_analytics(
                progress_data, quiz_attempts, start_date, end_date
            )
        }
        
        return metrics
    
    def get_student_analytics(
        self, 
        teacher_id: str, 
        student_id: str,
        time_range: str = "month"
    ) -> Dict[str, Any]:
        """Get detailed analytics for a specific student"""
        
        # Calculate date range
        end_date = datetime.utcnow()
        if time_range == "week":
            start_date = end_date - timedelta(days=7)
        elif time_range == "month":
            start_date = end_date - timedelta(days=30)
        elif time_range == "quarter":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Get student data
        student = self.db.query(User).filter(User.id == student_id).first()
        if not student:
            raise ValueError(f"Student with ID {student_id} not found")
        
        # Get quiz attempts
        quiz_attempts = self.db.query(QuizAttempt).filter(
            and_(
                QuizAttempt.user_id == student_id,
                QuizAttempt.completed_at >= start_date,
                QuizAttempt.completed_at <= end_date
            )
        ).all()
        
        # Get progress data
        progress_data = self.db.query(StudentProgress).filter(
            and_(
                StudentProgress.user_id == student_id,
                StudentProgress.last_accessed >= start_date
            )
        ).all()
        
        # Get gamification data
        gamification = self.db.query(Gamification).filter(
            Gamification.user_id == student_id
        ).first()
        
        analytics = {
            "studentId": student_id,
            "studentName": student.full_name,
            "performanceHistory": self._get_performance_history(quiz_attempts),
            "subjectBreakdown": self._get_subject_breakdown(quiz_attempts, progress_data),
            "bloomLevelProgress": self._get_bloom_level_progress(quiz_attempts),
            "weakAreas": self._identify_student_weak_areas(quiz_attempts, progress_data),
            "engagementMetrics": self._get_student_engagement_metrics(
                gamification, quiz_attempts, progress_data
            ),
            "interventionRecommendations": self._generate_intervention_recommendations(
                student, quiz_attempts, progress_data
            )
        }
        
        return analytics
    
    def identify_at_risk_students(
        self, 
        teacher_id: str, 
        class_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Identify students who are at risk and need intervention"""
        
        # Get students in the class
        students = self.db.query(User).filter(User.role == UserRole.STUDENT).all()
        at_risk_students = []
        
        for student in students:
            risk_factors = self._calculate_risk_factors(str(student.id))
            risk_level = self._determine_risk_level(risk_factors)
            
            if risk_level in ['medium', 'high']:
                at_risk_students.append({
                    "studentId": str(student.id),
                    "studentName": student.full_name,
                    "riskLevel": risk_level,
                    "riskFactors": risk_factors,
                    "recommendedActions": self._get_risk_mitigation_actions(risk_factors)
                })
        
        return sorted(at_risk_students, key=lambda x: {'high': 3, 'medium': 2, 'low': 1}[x['riskLevel']], reverse=True)
    
    def get_comparative_analysis(
        self, 
        teacher_id: str, 
        class_ids: List[str]
    ) -> Dict[str, Any]:
        """Get comparative analysis across multiple classes"""
        
        class_comparisons = []
        
        for class_id in class_ids:
            metrics = self.get_class_performance_metrics(teacher_id, class_id)
            class_comparisons.append({
                "classId": class_id,
                "className": f"Class {class_id}",  # In real app, get from class table
                "averageScore": metrics["averageScore"],
                "completionRate": metrics["completionRate"],
                "engagementRate": metrics["engagementMetrics"]["dailyActiveUsers"],
                "weaknessCount": len(metrics["weaknessPatterns"])
            })
        
        return {
            "classComparisons": class_comparisons,
            "overallTrends": self._calculate_overall_trends(class_comparisons),
            "recommendations": self._generate_class_comparison_recommendations(class_comparisons)
        }
    
    def _empty_metrics(self) -> Dict[str, Any]:
        """Return empty metrics structure"""
        return {
            "classId": "default",
            "averageScore": 0,
            "completionRate": 0,
            "engagementMetrics": {
                "dailyActiveUsers": 0,
                "averageSessionDuration": 0,
                "streakDistribution": {"0-7": 0, "8-14": 0, "15-30": 0, "30+": 0},
                "activityHeatmap": []
            },
            "subjectPerformance": [],
            "weaknessPatterns": [],
            "timeAnalytics": {
                "averageStudyTime": 0,
                "peakActivityHours": [],
                "weeklyTrends": [],
                "monthlyComparison": {
                    "currentMonth": {"totalTime": 0, "averageScore": 0, "completedQuizzes": 0, "activeStudents": 0},
                    "previousMonth": {"totalTime": 0, "averageScore": 0, "completedQuizzes": 0, "activeStudents": 0},
                    "growthRate": 0
                }
            }
        }
    
    def _calculate_average_score(self, quiz_attempts: List[QuizAttempt]) -> float:
        """Calculate average score across all quiz attempts"""
        if not quiz_attempts:
            return 0.0
        
        total_score = sum((attempt.score / attempt.max_score) * 100 for attempt in quiz_attempts)
        return round(total_score / len(quiz_attempts), 1)
    
    def _calculate_completion_rate(self, progress_data: List[StudentProgress], student_ids: List[str]) -> float:
        """Calculate overall completion rate"""
        if not student_ids:
            return 0.0
        
        if not progress_data:
            return 0.0
        
        total_completion = sum(progress.completion_percentage for progress in progress_data)
        return round(total_completion / len(progress_data), 1)
    
    def _calculate_engagement_metrics(
        self, 
        gamification_data: List[Gamification],
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress],
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """Calculate engagement metrics"""
        
        # Daily active users (students with activity in last 7 days)
        recent_date = datetime.utcnow() - timedelta(days=7)
        active_users = set()
        
        for attempt in quiz_attempts:
            if attempt.completed_at >= recent_date:
                active_users.add(attempt.user_id)
        
        for progress in progress_data:
            if progress.last_accessed >= recent_date:
                active_users.add(progress.user_id)
        
        # Average session duration (from quiz attempts)
        session_durations = [attempt.time_taken_seconds / 60 for attempt in quiz_attempts if attempt.time_taken_seconds]
        avg_session_duration = statistics.mean(session_durations) if session_durations else 0
        
        # Streak distribution
        streak_distribution = {"0-7": 0, "8-14": 0, "15-30": 0, "30+": 0}
        for gam_data in gamification_data:
            streak = gam_data.current_streak
            if streak <= 7:
                streak_distribution["0-7"] += 1
            elif streak <= 14:
                streak_distribution["8-14"] += 1
            elif streak <= 30:
                streak_distribution["15-30"] += 1
            else:
                streak_distribution["30+"] += 1
        
        return {
            "dailyActiveUsers": len(active_users),
            "averageSessionDuration": round(avg_session_duration, 1),
            "streakDistribution": streak_distribution,
            "activityHeatmap": self._generate_activity_heatmap(quiz_attempts, progress_data, start_date, end_date)
        }
    
    def _calculate_subject_performance(
        self, 
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress]
    ) -> List[Dict[str, Any]]:
        """Calculate performance by subject"""
        
        subject_data = defaultdict(lambda: {
            "scores": [],
            "completion_rates": [],
            "bloom_levels": defaultdict(int),
            "topics": defaultdict(list)
        })
        
        # Process quiz attempts
        for attempt in quiz_attempts:
            # In real app, get subject from quiz metadata
            subject = "Physics"  # Mock data
            subject_data[subject]["scores"].append((attempt.score / attempt.max_score) * 100)
            subject_data[subject]["bloom_levels"][f"level{attempt.bloom_level}"] += 1
        
        # Process progress data
        for progress in progress_data:
            subject = progress.subject
            subject_data[subject]["completion_rates"].append(progress.completion_percentage)
            subject_data[subject]["topics"][progress.topic].append(progress.completion_percentage)
        
        # Build subject performance list
        subject_performance = []
        for subject, data in subject_data.items():
            avg_score = statistics.mean(data["scores"]) if data["scores"] else 0
            avg_completion = statistics.mean(data["completion_rates"]) if data["completion_rates"] else 0
            
            # Normalize bloom level distribution
            total_bloom = sum(data["bloom_levels"].values())
            bloom_distribution = {}
            for i in range(1, 7):
                level_key = f"level{i}"
                bloom_distribution[level_key] = round(
                    (data["bloom_levels"][level_key] / total_bloom * 100) if total_bloom > 0 else 0, 1
                )
            
            # Topic performance
            topic_performance = []
            for topic, completions in data["topics"].items():
                topic_performance.append({
                    "topic": topic,
                    "averageScore": round(statistics.mean(completions), 1),
                    "completionRate": round(statistics.mean(completions), 1),
                    "difficultyLevel": 3  # Mock difficulty level
                })
            
            subject_performance.append({
                "subject": subject,
                "averageScore": round(avg_score, 1),
                "completionRate": round(avg_completion, 1),
                "bloomLevelDistribution": bloom_distribution,
                "topicPerformance": topic_performance
            })
        
        return subject_performance
    
    def _identify_weakness_patterns(
        self, 
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress],
        students: List[User]
    ) -> List[Dict[str, Any]]:
        """Identify common weakness patterns across students"""
        
        patterns = []
        
        # Pattern 1: Low performance in higher Bloom levels
        high_bloom_struggles = []
        for attempt in quiz_attempts:
            if attempt.bloom_level >= 4 and (attempt.score / attempt.max_score) < 0.6:
                high_bloom_struggles.append(attempt.user_id)
        
        if len(set(high_bloom_struggles)) >= 3:  # At least 3 students struggling
            patterns.append({
                "pattern": "Difficulty with Higher-Order Thinking Skills",
                "affectedStudents": len(set(high_bloom_struggles)),
                "subjects": ["Physics", "Chemistry", "Mathematics"],  # Mock data
                "topics": ["Problem Solving", "Analysis", "Evaluation"],
                "recommendedIntervention": "Implement scaffolded problem-solving exercises and peer collaboration activities",
                "severity": "high" if len(set(high_bloom_struggles)) > 5 else "medium"
            })
        
        # Pattern 2: Low completion rates in specific subjects
        subject_completion = defaultdict(list)
        for progress in progress_data:
            subject_completion[progress.subject].append(progress.completion_percentage)
        
        for subject, completions in subject_completion.items():
            avg_completion = statistics.mean(completions)
            if avg_completion < 60:  # Less than 60% average completion
                patterns.append({
                    "pattern": f"Low Engagement in {subject}",
                    "affectedStudents": len(completions),
                    "subjects": [subject],
                    "topics": ["All topics"],
                    "recommendedIntervention": f"Review {subject} curriculum pacing and add more interactive elements",
                    "severity": "medium" if avg_completion > 40 else "high"
                })
        
        return patterns
    
    def _calculate_time_analytics(
        self, 
        progress_data: List[StudentProgress],
        quiz_attempts: List[QuizAttempt],
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, Any]:
        """Calculate time-based analytics"""
        
        # Average study time
        total_time = sum(progress.time_spent_minutes for progress in progress_data)
        avg_study_time = total_time / len(progress_data) if progress_data else 0
        
        # Weekly trends (mock data for now)
        weekly_trends = []
        current_date = start_date
        while current_date < end_date:
            week_end = min(current_date + timedelta(days=7), end_date)
            week_attempts = [a for a in quiz_attempts if current_date <= a.completed_at < week_end]
            week_progress = [p for p in progress_data if current_date <= p.last_accessed < week_end]
            
            weekly_trends.append({
                "week": f"Week of {current_date.strftime('%m/%d')}",
                "totalTime": sum(p.time_spent_minutes for p in week_progress),
                "averageScore": statistics.mean([(a.score / a.max_score) * 100 for a in week_attempts]) if week_attempts else 0,
                "activeStudents": len(set(a.user_id for a in week_attempts) | set(p.user_id for p in week_progress))
            })
            current_date = week_end
        
        # Monthly comparison (mock data)
        current_month_data = {
            "totalTime": total_time,
            "averageScore": statistics.mean([(a.score / a.max_score) * 100 for a in quiz_attempts]) if quiz_attempts else 0,
            "completedQuizzes": len(quiz_attempts),
            "activeStudents": len(set(a.user_id for a in quiz_attempts) | set(p.user_id for p in progress_data))
        }
        
        previous_month_data = {
            "totalTime": int(total_time * 0.9),  # Mock 10% less
            "averageScore": current_month_data["averageScore"] - 2,  # Mock 2% less
            "completedQuizzes": int(len(quiz_attempts) * 0.85),  # Mock 15% less
            "activeStudents": int(current_month_data["activeStudents"] * 0.95)  # Mock 5% less
        }
        
        growth_rate = ((current_month_data["totalTime"] - previous_month_data["totalTime"]) / 
                      previous_month_data["totalTime"] * 100) if previous_month_data["totalTime"] > 0 else 0
        
        return {
            "averageStudyTime": round(avg_study_time, 1),
            "peakActivityHours": [14, 15, 16, 19, 20],  # Mock peak hours
            "weeklyTrends": weekly_trends,
            "monthlyComparison": {
                "currentMonth": current_month_data,
                "previousMonth": previous_month_data,
                "growthRate": round(growth_rate, 1)
            }
        }
    
    def _generate_activity_heatmap(
        self, 
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress],
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict[str, Any]]:
        """Generate activity heatmap data"""
        
        heatmap = []
        current_date = start_date
        
        while current_date < end_date:
            day_attempts = [a for a in quiz_attempts if a.completed_at.date() == current_date.date()]
            day_progress = [p for p in progress_data if p.last_accessed.date() == current_date.date()]
            
            activity_count = len(day_attempts) + len(day_progress)
            avg_score = statistics.mean([(a.score / a.max_score) * 100 for a in day_attempts]) if day_attempts else 0
            
            heatmap.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "activityCount": activity_count,
                "averageScore": round(avg_score, 1)
            })
            
            current_date += timedelta(days=1)
        
        return heatmap
    
    def _get_performance_history(self, quiz_attempts: List[QuizAttempt]) -> List[Dict[str, Any]]:
        """Get student performance history"""
        
        history = []
        for attempt in sorted(quiz_attempts, key=lambda x: x.completed_at):
            history.append({
                "date": attempt.completed_at.strftime("%Y-%m-%d"),
                "score": round((attempt.score / attempt.max_score) * 100, 1),
                "timeSpent": attempt.time_taken_seconds // 60  # Convert to minutes
            })
        
        return history[-7:]  # Return last 7 attempts
    
    def _get_subject_breakdown(
        self, 
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress]
    ) -> List[Dict[str, Any]]:
        """Get subject-wise breakdown for a student"""
        
        subject_data = defaultdict(lambda: {
            "scores": [],
            "time_spent": 0,
            "completed_lessons": 0,
            "total_lessons": 15  # Mock total
        })
        
        # Process quiz attempts
        for attempt in quiz_attempts:
            subject = "Physics"  # Mock - in real app get from quiz metadata
            subject_data[subject]["scores"].append((attempt.score / attempt.max_score) * 100)
        
        # Process progress data
        for progress in progress_data:
            subject = progress.subject
            subject_data[subject]["time_spent"] += progress.time_spent_minutes
            if progress.completion_percentage >= 80:
                subject_data[subject]["completed_lessons"] += 1
        
        breakdown = []
        for subject, data in subject_data.items():
            avg_score = statistics.mean(data["scores"]) if data["scores"] else 0
            breakdown.append({
                "subject": subject,
                "averageScore": round(avg_score, 1),
                "timeSpent": data["time_spent"],
                "completedLessons": data["completed_lessons"],
                "totalLessons": data["total_lessons"]
            })
        
        return breakdown
    
    def _get_bloom_level_progress(self, quiz_attempts: List[QuizAttempt]) -> Dict[str, float]:
        """Get Bloom's taxonomy level progress"""
        
        bloom_data = defaultdict(list)
        
        for attempt in quiz_attempts:
            bloom_level = f"level{attempt.bloom_level}"
            score_percentage = (attempt.score / attempt.max_score) * 100
            bloom_data[bloom_level].append(score_percentage)
        
        bloom_progress = {}
        for level in range(1, 7):
            level_key = f"level{level}"
            if level_key in bloom_data:
                bloom_progress[level_key] = round(statistics.mean(bloom_data[level_key]), 1)
            else:
                bloom_progress[level_key] = 0.0
        
        return bloom_progress
    
    def _identify_student_weak_areas(
        self, 
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress]
    ) -> List[Dict[str, Any]]:
        """Identify weak areas for a specific student"""
        
        weak_areas = []
        
        # From quiz attempts - low scoring topics
        topic_performance = defaultdict(lambda: {"scores": [], "attempts": 0})
        
        for attempt in quiz_attempts:
            topic = f"Topic {attempt.bloom_level}"  # Mock topic based on bloom level
            score_percentage = (attempt.score / attempt.max_score) * 100
            topic_performance[topic]["scores"].append(score_percentage)
            topic_performance[topic]["attempts"] += 1
        
        for topic, data in topic_performance.items():
            avg_score = statistics.mean(data["scores"])
            if avg_score < 60 and data["attempts"] >= 2:  # Low performance with multiple attempts
                weak_areas.append({
                    "subject": "Physics",  # Mock subject
                    "topic": topic,
                    "bloomLevel": 3,  # Mock bloom level
                    "successRate": round(avg_score, 1),
                    "attemptsCount": data["attempts"]
                })
        
        # From progress data - low completion topics
        for progress in progress_data:
            if progress.completion_percentage < 50:
                weak_areas.append({
                    "subject": progress.subject,
                    "topic": progress.topic,
                    "bloomLevel": progress.bloom_level,
                    "successRate": round(progress.completion_percentage, 1),
                    "attemptsCount": 1
                })
        
        return weak_areas[:5]  # Return top 5 weak areas
    
    def _get_student_engagement_metrics(
        self, 
        gamification: Optional[Gamification],
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress]
    ) -> Dict[str, Any]:
        """Get engagement metrics for a student"""
        
        if not gamification:
            return {
                "currentStreak": 0,
                "totalXP": 0,
                "currentLevel": 1,
                "averageSessionTime": 0,
                "weeklyActivity": 0
            }
        
        # Calculate average session time from quiz attempts
        session_times = [attempt.time_taken_seconds / 60 for attempt in quiz_attempts if attempt.time_taken_seconds]
        avg_session_time = statistics.mean(session_times) if session_times else 0
        
        # Weekly activity count
        week_ago = datetime.utcnow() - timedelta(days=7)
        weekly_activity = len([a for a in quiz_attempts if a.completed_at >= week_ago])
        weekly_activity += len([p for p in progress_data if p.last_accessed >= week_ago])
        
        return {
            "currentStreak": gamification.current_streak,
            "totalXP": gamification.total_xp,
            "currentLevel": gamification.current_level,
            "averageSessionTime": round(avg_session_time, 1),
            "weeklyActivity": weekly_activity
        }
    
    def _generate_intervention_recommendations(
        self, 
        student: User,
        quiz_attempts: List[QuizAttempt],
        progress_data: List[StudentProgress]
    ) -> List[Dict[str, Any]]:
        """Generate intervention recommendations for a student"""
        
        recommendations = []
        
        # Check for low performance pattern
        recent_attempts = sorted(quiz_attempts, key=lambda x: x.completed_at)[-5:]
        if recent_attempts:
            avg_recent_score = statistics.mean([(a.score / a.max_score) * 100 for a in recent_attempts])
            
            if avg_recent_score < 60:
                recommendations.append({
                    "id": f"int-{student.id}-1",
                    "studentId": str(student.id),
                    "studentName": student.full_name,
                    "type": "remedial_content",
                    "priority": "high",
                    "description": "Student showing consistent low performance in recent assessments",
                    "suggestedActions": [
                        "Assign foundational review materials",
                        "Schedule one-on-one tutoring session",
                        "Provide additional practice exercises"
                    ],
                    "estimatedImpact": "high",
                    "timeframe": "1-2 weeks",
                    "resources": [
                        {
                            "type": "lesson",
                            "title": "Foundational Concepts Review",
                            "url": "/lessons/foundation-review",
                            "description": "Review of basic concepts and principles"
                        }
                    ]
                })
        
        # Check for engagement issues
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_activity = len([a for a in quiz_attempts if a.completed_at >= week_ago])
        recent_activity += len([p for p in progress_data if p.last_accessed >= week_ago])
        
        if recent_activity < 3:  # Less than 3 activities in past week
            recommendations.append({
                "id": f"int-{student.id}-2",
                "studentId": str(student.id),
                "studentName": student.full_name,
                "type": "parent_contact",
                "priority": "medium",
                "description": "Student showing low engagement with learning activities",
                "suggestedActions": [
                    "Contact parents about study habits",
                    "Set up regular check-ins",
                    "Explore motivational strategies"
                ],
                "estimatedImpact": "medium",
                "timeframe": "1 week",
                "resources": []
            })
        
        return recommendations
    
    def _calculate_risk_factors(self, student_id: str) -> Dict[str, Any]:
        """Calculate risk factors for a student"""
        
        # Get recent data (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        quiz_attempts = self.db.query(QuizAttempt).filter(
            and_(
                QuizAttempt.user_id == student_id,
                QuizAttempt.completed_at >= start_date
            )
        ).all()
        
        progress_data = self.db.query(StudentProgress).filter(
            and_(
                StudentProgress.user_id == student_id,
                StudentProgress.last_accessed >= start_date
            )
        ).all()
        
        gamification = self.db.query(Gamification).filter(
            Gamification.user_id == student_id
        ).first()
        
        risk_factors = {
            "lowPerformance": False,
            "lowEngagement": False,
            "inconsistentActivity": False,
            "strugglingWithHigherOrder": False,
            "performanceScore": 0,
            "engagementScore": 0,
            "consistencyScore": 0
        }
        
        # Performance risk
        if quiz_attempts:
            avg_score = statistics.mean([(a.score / a.max_score) * 100 for a in quiz_attempts])
            risk_factors["performanceScore"] = avg_score
            risk_factors["lowPerformance"] = avg_score < 60
        
        # Engagement risk
        total_activities = len(quiz_attempts) + len(progress_data)
        risk_factors["engagementScore"] = total_activities
        risk_factors["lowEngagement"] = total_activities < 5  # Less than 5 activities in 30 days
        
        # Consistency risk
        if gamification:
            risk_factors["consistencyScore"] = gamification.current_streak
            risk_factors["inconsistentActivity"] = gamification.current_streak < 3
        
        # Higher-order thinking risk
        high_bloom_attempts = [a for a in quiz_attempts if a.bloom_level >= 4]
        if high_bloom_attempts:
            high_bloom_avg = statistics.mean([(a.score / a.max_score) * 100 for a in high_bloom_attempts])
            risk_factors["strugglingWithHigherOrder"] = high_bloom_avg < 50
        
        return risk_factors
    
    def _determine_risk_level(self, risk_factors: Dict[str, Any]) -> str:
        """Determine overall risk level based on risk factors"""
        
        risk_count = sum([
            risk_factors["lowPerformance"],
            risk_factors["lowEngagement"],
            risk_factors["inconsistentActivity"],
            risk_factors["strugglingWithHigherOrder"]
        ])
        
        if risk_count >= 3:
            return "high"
        elif risk_count >= 2:
            return "medium"
        else:
            return "low"
    
    def _get_risk_mitigation_actions(self, risk_factors: Dict[str, Any]) -> List[str]:
        """Get recommended actions based on risk factors"""
        
        actions = []
        
        if risk_factors["lowPerformance"]:
            actions.append("Provide additional practice materials and remedial content")
        
        if risk_factors["lowEngagement"]:
            actions.append("Implement gamification strategies and peer collaboration")
        
        if risk_factors["inconsistentActivity"]:
            actions.append("Set up regular check-ins and study schedule")
        
        if risk_factors["strugglingWithHigherOrder"]:
            actions.append("Focus on scaffolded problem-solving and critical thinking exercises")
        
        return actions
    
    def _calculate_overall_trends(self, class_comparisons: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate overall trends across classes"""
        
        if not class_comparisons:
            return {}
        
        avg_score = statistics.mean([c["averageScore"] for c in class_comparisons])
        avg_completion = statistics.mean([c["completionRate"] for c in class_comparisons])
        avg_engagement = statistics.mean([c["engagementRate"] for c in class_comparisons])
        
        return {
            "overallAverageScore": round(avg_score, 1),
            "overallCompletionRate": round(avg_completion, 1),
            "overallEngagementRate": round(avg_engagement, 1),
            "topPerformingClass": max(class_comparisons, key=lambda x: x["averageScore"])["classId"],
            "mostEngagedClass": max(class_comparisons, key=lambda x: x["engagementRate"])["classId"]
        }
    
    def _generate_class_comparison_recommendations(self, class_comparisons: List[Dict[str, Any]]) -> List[str]:
        """Generate recommendations based on class comparisons"""
        
        recommendations = []
        
        if not class_comparisons:
            return recommendations
        
        # Find classes that need attention
        low_performing_classes = [c for c in class_comparisons if c["averageScore"] < 60]
        low_engagement_classes = [c for c in class_comparisons if c["engagementRate"] < 10]
        
        if low_performing_classes:
            recommendations.append(
                f"Focus on improving performance in {len(low_performing_classes)} classes with scores below 60%"
            )
        
        if low_engagement_classes:
            recommendations.append(
                f"Implement engagement strategies in {len(low_engagement_classes)} classes with low activity"
            )
        
        # Best practices sharing
        best_class = max(class_comparisons, key=lambda x: x["averageScore"])
        if best_class["averageScore"] > 80:
            recommendations.append(
                f"Share successful strategies from {best_class['className']} with other classes"
            )
        
        return recommendations
#!/usr/bin/env python3
"""
Direct test of quiz submission to find the exact error
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from uuid import UUID, uuid4
from datetime import datetime
import traceback

# Import after path is set
from app.db.session import SessionLocal
from app.services.quiz.rag_quiz_service import RAGQuizService
from app.services.gamification_service import GamificationService

def test_gamification_directly():
    """Test gamification service directly"""
    print("🧪 Testing gamification service...")
    
    db = SessionLocal()
    try:
        service = GamificationService(db)
        
        # Test with UUID object
        test_user_id = UUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')
        print(f"   User ID type: {type(test_user_id)}")
        print(f"   User ID value: {test_user_id}")
        
        # Try to award XP
        print("   Awarding XP...")
        result = service.award_xp(
            user_id=test_user_id,
            activity_type='quiz_completion',
            amount=100,
            metadata={
                'quiz_id': 'test-quiz-123',
                'score': 5,
                'max_score': 5
            }
        )
        
        print(f"✅ Gamification test passed!")
        print(f"   XP awarded: {result['xp_awarded']}")
        print(f"   Total XP: {result['total_xp']}")
        
        db.rollback()  # Don't save test data
        
    except Exception as e:
        print(f"❌ Gamification test failed: {e}")
        traceback.print_exc()
    finally:
        db.close()

def test_rag_quiz_submission():
    """Test RAG quiz submission"""
    print("\n🧪 Testing RAG quiz submission...")
    
    db = SessionLocal()
    try:
        service = RAGQuizService(db)
        
        # Create mock quiz data
        quiz_id = str(uuid4())
        user_id = UUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')
        
        quiz_data = {
            'user_id': str(user_id),
            'difficulty_level': 3,
            'subject': 'Physics',
            'topic': 'Force and Motion',
            'grade': 10,
            'status': 'active',
            'questions': [
                {
                    'id': 'q1',
                    'question': 'Test question?',
                    'options': {'A': 'Option A', 'B': 'Option B', 'C': 'Option C', 'D': 'Option D'},
                    'correct_answer': 'A',
                    'explanation': 'Test explanation'
                }
            ]
        }
        
        # Store quiz session
        service._store_quiz_session(quiz_id, quiz_data)
        print(f"   Quiz ID: {quiz_id}")
        print(f"   User ID: {user_id} (type: {type(user_id)})")
        
        # Submit quiz
        print("   Submitting quiz...")
        result = service.submit_quiz(
            quiz_id=quiz_id,
            user_id=user_id,
            answers={'q1': 'A'},
            time_taken_seconds=120
        )
        
        print(f"✅ Quiz submission test passed!")
        print(f"   Score: {result['score']}/{result['max_score']}")
        print(f"   XP earned: {result['xp_earned']}")
        
        db.rollback()  # Don't save test data
        
    except Exception as e:
        print(f"❌ Quiz submission test failed: {e}")
        print(f"   Error type: {type(e).__name__}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_gamification_directly()
    test_rag_quiz_submission()

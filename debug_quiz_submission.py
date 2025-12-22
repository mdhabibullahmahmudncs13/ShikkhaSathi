#!/usr/bin/env python3
"""
Debug script to test quiz submission directly
"""
import sys
import os
sys.path.append('backend')

import logging
logging.basicConfig(level=logging.DEBUG)

from backend.app.services.quiz.rag_quiz_service import get_rag_quiz_service
from backend.app.db.session import SessionLocal
from uuid import UUID
import traceback

def test_submission():
    """Test the submission directly"""
    db = SessionLocal()
    try:
        service = get_rag_quiz_service(db)

        # Mock quiz data
        quiz_data = {
            'user_id': 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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

        # Store mock quiz
        service._store_quiz_session('test-quiz-id', quiz_data)

        # Test submission
        print("🧪 Testing quiz submission...")
        result = service.submit_quiz(
            quiz_id='test-quiz-id',
            user_id=UUID('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
            answers={'q1': 'A'},
            time_taken_seconds=120
        )
        print('✅ SUCCESS:', result)
        
    except Exception as e:
        print('❌ ERROR:', str(e))
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_submission()
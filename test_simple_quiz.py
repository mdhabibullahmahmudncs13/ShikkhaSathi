#!/usr/bin/env python3
"""
Simple test to isolate the quiz submission issue
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {
    "email": "student1@shikkhasathi.com",
    "password": "student123"
}

def test_with_minimal_quiz():
    """Test with minimal quiz data"""
    print("🧪 Testing minimal quiz submission...")
    
    # Login
    response = requests.post(f"{BASE_URL}/auth/login", json=TEST_USER)
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code}")
        return
    
    token = response.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # Generate quiz with minimal parameters
    quiz_request = {
        "subject": "Physics",
        "grade": 10,
        "question_count": 5,
        "language": "english"
    }
    
    response = requests.post(f"{BASE_URL}/quiz/generate", json=quiz_request, headers=headers)
    if response.status_code != 200:
        print(f"❌ Quiz generation failed: {response.status_code}")
        print(response.text)
        return
    
    quiz_data = response.json()
    print(f"✅ Quiz generated: {quiz_data['quiz_id']}")
    
    # Submit with minimal answers
    answers = {}
    for question in quiz_data['questions']:
        answers[question['id']] = 'A'  # Answer A for all
    
    submission = {
        "quiz_id": quiz_data['quiz_id'],
        "answers": answers,
        "time_taken_seconds": 60
    }
    
    print(f"📤 Submitting quiz...")
    print(f"   Quiz ID: {submission['quiz_id']}")
    print(f"   Answers count: {len(submission['answers'])}")
    
    # Make the submission request
    response = requests.post(f"{BASE_URL}/quiz/submit", json=submission, headers=headers)
    
    print(f"   Response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Quiz submitted successfully!")
        print(f"   Score: {result['score']}/{result['max_score']}")
        print(f"   XP earned: {result['xp_earned']}")
    else:
        print(f"❌ Quiz submission failed")
        print(f"   Response: {response.text}")
        
        # Try to get more details from the error
        try:
            error_data = response.json()
            print(f"   Error ID: {error_data.get('error_id', 'N/A')}")
            print(f"   Message: {error_data.get('message', 'N/A')}")
        except:
            print("   Could not parse error response")

if __name__ == "__main__":
    test_with_minimal_quiz()
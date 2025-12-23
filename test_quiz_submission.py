#!/usr/bin/env python3
"""
Test script to debug quiz submission issue
"""
import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {
    "email": "student1@shikkhasathi.com",
    "password": "student123"
}

def login():
    """Login and get access token"""
    print("🔐 Logging in...")
    
    response = requests.post(f"{BASE_URL}/auth/login", json=TEST_USER)
    
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None
    
    data = response.json()
    token = data.get('access_token')
    print(f"✅ Login successful, token: {token[:20]}...")
    return token

def generate_quiz(token):
    """Generate a test quiz"""
    print("\n📝 Generating quiz...")
    
    headers = {"Authorization": f"Bearer {token}"}
    quiz_request = {
        "subject": "Physics",
        "topic": "Force and Motion",
        "grade": 10,
        "difficulty_level": 3,
        "question_count": 5,
        "time_limit_minutes": 10,
        "language": "english"
    }
    
    response = requests.post(f"{BASE_URL}/quiz/generate", json=quiz_request, headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Quiz generation failed: {response.status_code}")
        print(response.text)
        return None
    
    quiz_data = response.json()
    print(f"✅ Quiz generated: {quiz_data['quiz_id']}")
    print(f"   Questions: {len(quiz_data['questions'])}")
    
    # Print first question for debugging
    if quiz_data['questions']:
        q = quiz_data['questions'][0]
        print(f"   Sample question: {q['question'][:50]}...")
        print(f"   Question ID: {q['id']}")
        print(f"   Options: {list(q['options'].keys())}")
    
    return quiz_data

def submit_quiz(token, quiz_data):
    """Submit quiz with test answers"""
    print("\n📤 Submitting quiz...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create test answers (answer A for all questions)
    answers = {}
    for question in quiz_data['questions']:
        answers[question['id']] = 'A'
    
    submission = {
        "quiz_id": quiz_data['quiz_id'],
        "answers": answers,
        "time_taken_seconds": 120
    }
    
    print(f"   Quiz ID: {submission['quiz_id']}")
    print(f"   Answers: {submission['answers']}")
    print(f"   Time taken: {submission['time_taken_seconds']}s")
    
    response = requests.post(f"{BASE_URL}/quiz/submit", json=submission, headers=headers)
    
    print(f"   Response status: {response.status_code}")
    print(f"   Response headers: {dict(response.headers)}")
    
    if response.status_code != 200:
        print(f"❌ Quiz submission failed: {response.status_code}")
        print(f"   Error response: {response.text}")
        
        # Try to parse error details
        try:
            error_data = response.json()
            print(f"   Error detail: {error_data.get('detail', 'No detail')}")
        except:
            print("   Could not parse error response as JSON")
        
        return None
    
    result = response.json()
    print(f"✅ Quiz submitted successfully!")
    print(f"   Score: {result['score']}/{result['max_score']} ({result['percentage']:.1f}%)")
    print(f"   XP earned: {result['xp_earned']}")
    
    return result

def test_backend_directly():
    """Test backend endpoints directly"""
    print("🧪 Testing backend directly...")
    
    # Test health check
    try:
        response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/health")
        print(f"   Health check: {response.status_code}")
    except Exception as e:
        print(f"   Health check failed: {e}")
    
    # Test auth endpoint
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={"email": "test", "password": "test"})
        print(f"   Auth endpoint: {response.status_code}")
    except Exception as e:
        print(f"   Auth endpoint failed: {e}")

def main():
    """Main test function"""
    print("🚀 Starting quiz submission test...\n")
    
    # Test backend connectivity
    test_backend_directly()
    
    # Login
    token = login()
    if not token:
        print("❌ Cannot proceed without login")
        sys.exit(1)
    
    # Generate quiz
    quiz_data = generate_quiz(token)
    if not quiz_data:
        print("❌ Cannot proceed without quiz")
        sys.exit(1)
    
    # Submit quiz
    result = submit_quiz(token, quiz_data)
    if not result:
        print("❌ Quiz submission failed")
        sys.exit(1)
    
    print("\n🎉 All tests passed! Quiz submission is working.")

if __name__ == "__main__":
    main()
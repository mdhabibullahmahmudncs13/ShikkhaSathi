#!/usr/bin/env python3
"""
Test script to verify RAG-powered quiz generation
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_rag_quiz_system():
    """Test the complete RAG quiz workflow"""
    print("🧪 Testing RAG Quiz System...")
    
    # Step 1: Login
    print("📝 Logging in...")
    login_response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "student1@shikkhasathi.com",
        "password": "student123"
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        return False
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("✅ Login successful!")
    
    # Step 2: Get available subjects
    print("\n📚 Getting available subjects...")
    subjects_response = requests.get(f"{BASE_URL}/quiz/subjects", headers=headers)
    
    if subjects_response.status_code == 200:
        subjects_data = subjects_response.json()
        print(f"✅ Found {subjects_data['total_subjects']} available subjects")
        for subject in subjects_data['subjects'][:3]:  # Show first 3
            print(f"   - {subject['subject']}: {subject['total_questions']} potential questions")
    else:
        print(f"❌ Failed to get subjects: {subjects_response.status_code}")
    
    # Step 3: Generate a Physics quiz
    print("\n🔬 Generating Physics quiz...")
    quiz_request = {
        "subject": "Physics",
        "topic": "Force and Motion",
        "grade": 10,
        "difficulty_level": 3,
        "question_count": 5,
        "time_limit_minutes": 10,
        "language": "english"
    }
    
    quiz_response = requests.post(f"{BASE_URL}/quiz/generate", 
                                 json=quiz_request, headers=headers)
    
    if quiz_response.status_code == 200:
        quiz_data = quiz_response.json()
        print(f"✅ Generated quiz with {quiz_data['question_count']} questions")
        print(f"   Quiz ID: {quiz_data['quiz_id']}")
        print(f"   Subject: {quiz_data['subject']}")
        print(f"   Time limit: {quiz_data['time_limit_minutes']} minutes")
        
        # Show first question
        if quiz_data['questions']:
            q1 = quiz_data['questions'][0]
            print(f"\n📝 Sample Question:")
            print(f"   {q1['question']}")
            for option, text in q1['options'].items():
                print(f"   {option}) {text}")
        
        return quiz_data
    else:
        print(f"❌ Failed to generate quiz: {quiz_response.status_code}")
        print(f"   Response: {quiz_response.text}")
        return None

if __name__ == "__main__":
    quiz_data = test_rag_quiz_system()
    if quiz_data:
        print("\n🎉 RAG Quiz System is working!")
        print("✅ Students can now take quizzes based on NCTB textbook content")
    else:
        print("\n❌ RAG Quiz System test failed")
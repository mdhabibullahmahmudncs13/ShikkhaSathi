#!/usr/bin/env python3
"""
Test script for AI Tutor functionality
Tests authentication, RAG system, and AI tutor integration
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_authentication():
    """Test user authentication"""
    print("🔐 Testing authentication...")
    
    login_data = {
        "email": "student1@shikkhasathi.com",
        "password": "student123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,  # Send as JSON instead of form data
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Authentication successful!")
            return token_data.get("access_token")
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None

def test_ai_tutor(token):
    """Test AI tutor chat functionality"""
    print("\n🤖 Testing AI Tutor...")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test message in Bangla about literature
    test_message = {
        "message": "বাংলা সাহিত্যে রবীন্দ্রনাথ ঠাকুরের অবদান সম্পর্কে বলুন।",
        "subject": "bangla"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/chat",
            json=test_message,
            headers=headers
        )
        
        if response.status_code == 200:
            chat_response = response.json()
            print("✅ AI Tutor response received!")
            print(f"📝 Response: {chat_response.get('response', '')[:200]}...")
            print(f"📚 Context used: {chat_response.get('context_used', False)}")
            print(f"📖 Sources: {len(chat_response.get('sources', []))} sources")
            return True
        else:
            print(f"❌ AI Tutor failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ AI Tutor error: {e}")
        return False

def test_rag_system():
    """Test RAG system directly"""
    print("\n📚 Testing RAG System...")
    
    try:
        # Test by checking the stats directly using the ingestion script
        import subprocess
        result = subprocess.run(
            ["python3", "ingest_txt_files.py", "--stats"],
            cwd="backend",
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            output = result.stdout
            if "Documents: 1225" in output:
                print("✅ RAG system has 1,225 documents loaded!")
                return True
            elif "Documents: 0" in output:
                print("❌ RAG system has no documents")
                return False
            else:
                print(f"📊 RAG system status: {output}")
                return "Documents:" in output
        else:
            print(f"❌ RAG system check failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ RAG system error: {e}")
        return False

def test_health_check():
    """Test basic health check"""
    print("🏥 Testing health check...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting ShikkhaSathi AI Tutor Tests\n")
    
    # Test 1: Health check
    health_ok = test_health_check()
    
    # Test 2: Authentication
    token = test_authentication()
    auth_ok = token is not None
    
    # Test 3: RAG system
    rag_ok = test_rag_system()
    
    # Test 4: AI Tutor
    tutor_ok = test_ai_tutor(token) if auth_ok else False
    
    # Summary
    print("\n" + "="*50)
    print("📋 TEST SUMMARY:")
    print(f"🏥 Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"🔐 Authentication: {'✅ PASS' if auth_ok else '❌ FAIL'}")
    print(f"📚 RAG System: {'✅ PASS' if rag_ok else '❌ FAIL'}")
    print(f"🤖 AI Tutor: {'✅ PASS' if tutor_ok else '❌ FAIL'}")
    
    all_passed = health_ok and auth_ok and rag_ok and tutor_ok
    print(f"\n🎯 Overall Status: {'✅ ALL SYSTEMS WORKING!' if all_passed else '❌ SOME ISSUES FOUND'}")
    
    if all_passed:
        print("\n🎉 The student dashboard AI tutor should be fully functional!")
        print("📱 You can now test it at: http://localhost:5173")
        print("🔑 Login with: student1@shikkhasathi.com / student123")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
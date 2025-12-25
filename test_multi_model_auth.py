#!/usr/bin/env python3
"""
Test script for multi-model AI system with proper authentication
Uses existing sample users to test the multi-model functionality
"""

import requests
import json
import sys

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def login_user(email: str, password: str):
    """Login and get access token"""
    try:
        login_data = {
            "email": email,
            "password": password
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,  # Use JSON format
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_models_endpoint(token: str):
    """Test the models information endpoint"""
    print("🔍 Testing models endpoint...")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/chat/models", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Models endpoint working!")
            print(f"   Available models: {list(data.get('models', {}).keys())}")
            print(f"   Selection required: {data.get('selection_required', 'Not specified')}")
            print(f"   Model categories: {data.get('model_categories', [])}")
            
            # Check if phi3:mini is configured for math
            math_model = data.get('models', {}).get('math', {})
            if math_model.get('model_name') == 'phi3:mini':
                print("✅ Phi3:mini correctly configured for math")
            else:
                print(f"❌ Math model is {math_model.get('model_name')}, expected phi3:mini")
            
            return True
        else:
            print(f"❌ Models endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing models endpoint: {e}")
        return False

def test_chat_without_model_selection(token: str):
    """Test chat endpoint without model selection (should fail gracefully)"""
    print("\n🔍 Testing chat without model selection...")
    
    try:
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {
            "message": "What is 2 + 2?",
            "conversation_history": []
        }
        
        response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
        
        if response.status_code == 422:  # Validation error expected
            print("✅ Chat correctly requires model_category parameter (validation error)")
            return True
        elif response.status_code == 200:
            # Check if the response indicates model selection is required
            data = response.json()
            if "select a model category" in data.get('response', '').lower():
                print("✅ Chat correctly requires model selection (handled gracefully)")
                return True
            else:
                print(f"❌ Chat should require model selection but got response: {data.get('response')}")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing chat without model selection: {e}")
        return False

def test_chat_with_model_selection(token: str):
    """Test chat endpoint with model selection"""
    print("\n🔍 Testing chat with model selection...")
    
    test_cases = [
        {
            "name": "Math question with math model",
            "payload": {
                "message": "Solve x² - 5x + 6 = 0 step by step",
                "model_category": "math",
                "subject": "mathematics",
                "conversation_history": []
            },
            "expected_model": "phi3:mini",
            "expected_category": "math"
        },
        {
            "name": "Bangla question with bangla model",
            "payload": {
                "message": "বাংলা ব্যাকরণে সন্ধি কী? উদাহরণসহ ব্যাখ্যা করো।",
                "model_category": "bangla",
                "subject": "bangla",
                "conversation_history": []
            },
            "expected_model": "llama3.2:3b",
            "expected_category": "bangla"
        },
        {
            "name": "Science question with general model",
            "payload": {
                "message": "What is photosynthesis? Explain the process in detail.",
                "model_category": "general",
                "subject": "biology",
                "conversation_history": []
            },
            "expected_model": "llama3.2:1b",
            "expected_category": "general"
        }
    ]
    
    success_count = 0
    
    for test_case in test_cases:
        print(f"\n   Testing: {test_case['name']}")
        
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=test_case['payload'])
            
            if response.status_code == 200:
                data = response.json()
                actual_model = data.get('model', 'unknown')
                category = data.get('category', 'unknown')
                user_selected = data.get('user_selected', False)
                response_text = data.get('response', '')
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Model used: {actual_model}")
                print(f"      Category: {category}")
                print(f"      User selected: {user_selected}")
                print(f"      Response preview: {response_text[:100]}...")
                
                # Check model and category
                model_correct = actual_model == test_case['expected_model']
                category_correct = category == test_case['expected_category']
                
                if model_correct and category_correct and user_selected:
                    print(f"      ✅ All checks passed!")
                    success_count += 1
                else:
                    if not model_correct:
                        print(f"      ❌ Expected model {test_case['expected_model']}, got {actual_model}")
                    if not category_correct:
                        print(f"      ❌ Expected category {test_case['expected_category']}, got {category}")
                    if not user_selected:
                        print(f"      ❌ user_selected should be True")
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                print(f"      Response: {response.text}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count == len(test_cases)

def test_invalid_model_category(token: str):
    """Test chat with invalid model category"""
    print("\n🔍 Testing invalid model category...")
    
    try:
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {
            "message": "Test question",
            "model_category": "invalid_model",
            "conversation_history": []
        }
        
        response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            response_text = data.get('response', '')
            if "invalid model category" in response_text.lower():
                print("✅ Invalid model category properly handled")
                print(f"   Response: {response_text}")
                return True
            else:
                print(f"❌ Invalid category not handled properly: {response_text}")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing invalid model category: {e}")
        return False

def test_concept_explanation(token: str):
    """Test concept explanation endpoint"""
    print("\n🔍 Testing concept explanation...")
    
    try:
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {
            "concept": "Quadratic Equation",
            "subject": "mathematics",
            "model_category": "math",
            "difficulty_level": "basic"
        }
        
        response = requests.post(f"{BASE_URL}/chat/explain", headers=headers, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Concept explanation working!")
            print(f"   Concept: {data.get('concept')}")
            print(f"   Subject: {data.get('subject')}")
            print(f"   Model: {data.get('model')}")
            print(f"   Category: {data.get('category')}")
            print(f"   Explanation preview: {data.get('explanation', '')[:100]}...")
            return True
        else:
            print(f"❌ Concept explanation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing concept explanation: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Multi-Model AI System with Authentication")
    print("=" * 60)
    
    # Login with sample student
    print("🔐 Logging in...")
    token = login_user("student1@shikkhasathi.com", "student123")
    
    if not token:
        print("❌ Failed to login. Make sure sample data is created and backend is running.")
        print("Run: python3 backend/create_sample_data.py")
        return 1
    
    print("✅ Login successful!")
    
    tests = [
        ("Models Endpoint", lambda: test_models_endpoint(token)),
        ("Chat Without Model Selection", lambda: test_chat_without_model_selection(token)),
        ("Chat With Model Selection", lambda: test_chat_with_model_selection(token)),
        ("Invalid Model Category", lambda: test_invalid_model_category(token)),
        ("Concept Explanation", lambda: test_concept_explanation(token))
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 40)
        
        if test_func():
            passed += 1
            print(f"✅ {test_name} PASSED")
        else:
            print(f"❌ {test_name} FAILED")
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Multi-model system is working correctly.")
        print("\n🎯 Key Features Verified:")
        print("   ✅ Users must select model category before asking questions")
        print("   ✅ Phi3:mini model is used for math questions")
        print("   ✅ Bangla model (llama3.2:3b) handles Bengali content")
        print("   ✅ General model (llama3.2:1b) handles science subjects")
        print("   ✅ Invalid model categories are handled gracefully")
        print("   ✅ Concept explanation works with model selection")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
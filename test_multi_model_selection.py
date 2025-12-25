#!/usr/bin/env python3
"""
Test script for multi-model AI system with required model selection
Tests the new requirement that users must select model category before asking questions
"""

import requests
import json
import sys

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_models_endpoint():
    """Test the models information endpoint"""
    print("🔍 Testing models endpoint...")
    
    try:
        # Test without authentication (should fail)
        response = requests.get(f"{BASE_URL}/chat/models")
        print(f"   Without auth: {response.status_code}")
        
        # Test with mock authentication (for demo purposes)
        headers = {"Authorization": "Bearer demo_token"}
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

def test_chat_without_model_selection():
    """Test chat endpoint without model selection (should fail)"""
    print("\n🔍 Testing chat without model selection...")
    
    try:
        headers = {"Authorization": "Bearer demo_token", "Content-Type": "application/json"}
        payload = {
            "message": "What is 2 + 2?",
            "conversation_history": []
        }
        
        response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
        
        if response.status_code == 422:  # Validation error expected
            print("✅ Chat correctly requires model_category parameter")
            return True
        else:
            print(f"❌ Chat should require model_category but got: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing chat without model selection: {e}")
        return False

def test_chat_with_model_selection():
    """Test chat endpoint with model selection"""
    print("\n🔍 Testing chat with model selection...")
    
    test_cases = [
        {
            "name": "Math question with math model",
            "payload": {
                "message": "Solve x² - 5x + 6 = 0",
                "model_category": "math",
                "subject": "mathematics",
                "conversation_history": []
            },
            "expected_model": "phi3:mini"
        },
        {
            "name": "Bangla question with bangla model",
            "payload": {
                "message": "বাংলা ব্যাকরণে সন্ধি কী?",
                "model_category": "bangla",
                "subject": "bangla",
                "conversation_history": []
            },
            "expected_model": "llama3.2:3b"
        },
        {
            "name": "Science question with general model",
            "payload": {
                "message": "What is photosynthesis?",
                "model_category": "general",
                "subject": "biology",
                "conversation_history": []
            },
            "expected_model": "llama3.2:1b"
        }
    ]
    
    success_count = 0
    
    for test_case in test_cases:
        print(f"\n   Testing: {test_case['name']}")
        
        try:
            headers = {"Authorization": "Bearer demo_token", "Content-Type": "application/json"}
            response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=test_case['payload'])
            
            if response.status_code == 200:
                data = response.json()
                actual_model = data.get('model', 'unknown')
                category = data.get('category', 'unknown')
                user_selected = data.get('user_selected', False)
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Model used: {actual_model}")
                print(f"      Category: {category}")
                print(f"      User selected: {user_selected}")
                
                if actual_model == test_case['expected_model']:
                    print(f"      ✅ Correct model used!")
                    success_count += 1
                else:
                    print(f"      ❌ Expected {test_case['expected_model']}, got {actual_model}")
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                print(f"      Response: {response.text}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count == len(test_cases)

def test_invalid_model_category():
    """Test chat with invalid model category"""
    print("\n🔍 Testing invalid model category...")
    
    try:
        headers = {"Authorization": "Bearer demo_token", "Content-Type": "application/json"}
        payload = {
            "message": "Test question",
            "model_category": "invalid_model",
            "conversation_history": []
        }
        
        response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            if "Invalid model category" in data.get('response', ''):
                print("✅ Invalid model category properly handled")
                return True
            else:
                print(f"❌ Invalid category not handled properly: {data.get('response')}")
                return False
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing invalid model category: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Multi-Model AI System with Required Model Selection")
    print("=" * 60)
    
    tests = [
        ("Models Endpoint", test_models_endpoint),
        ("Chat Without Model Selection", test_chat_without_model_selection),
        ("Chat With Model Selection", test_chat_with_model_selection),
        ("Invalid Model Category", test_invalid_model_category)
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
        return 0
    else:
        print("⚠️  Some tests failed. Please check the implementation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
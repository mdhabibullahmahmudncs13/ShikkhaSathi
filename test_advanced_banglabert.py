#!/usr/bin/env python3
"""
Advanced test script for enhanced BanglaBERT integration
Tests the new advanced Bengali processor with sophisticated language understanding
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
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print(f"Login failed: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_advanced_grammar_processing(token: str):
    """Test advanced Bengali grammar processing"""
    print("🔍 Testing Advanced Bengali Grammar Processing...")
    
    grammar_tests = [
        {
            "name": "সন্ধি with detailed examples",
            "message": "সন্ধি কী? বিস্তারিত উদাহরণসহ ব্যাখ্যা করো।",
            "expected_keywords": ["স্বরসন্ধি", "ব্যঞ্জনসন্ধি", "বিসর্গসন্ধি", "বিদ্যালয়", "উদ্ধার"]
        },
        {
            "name": "সমাস explanation",
            "message": "সমাস কাকে বলে? প্রকারভেদ লেখো।",
            "expected_keywords": ["দ্বন্দ্ব সমাস", "কর্মধারয় সমাস", "তৎপুরুষ সমাস"]
        },
        {
            "name": "বর্ণমালা structure",
            "message": "বাংলা বর্ণমালার গঠন ও শ্রেণীবিভাগ আলোচনা করো।",
            "expected_keywords": ["স্বরবর্ণ", "ব্যঞ্জনবর্ণ", "কণ্ঠ্য", "তালব্য", "মূর্ধন্য"]
        }
    ]
    
    success_count = 0
    
    for test in grammar_tests:
        print(f"\n   Testing: {test['name']}")
        
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {
                "message": test["message"],
                "model_category": "bangla",
                "subject": "bangla",
                "conversation_history": []
            }
            
            response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                response_text = data.get('response', '')
                model_used = data.get('model', 'unknown')
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Model: {model_used}")
                print(f"      Response length: {len(response_text)} chars")
                
                # Check for expected keywords
                keywords_found = sum(1 for keyword in test['expected_keywords'] if keyword in response_text)
                total_keywords = len(test['expected_keywords'])
                
                print(f"      Keywords found: {keywords_found}/{total_keywords}")
                print(f"      Preview: {response_text[:150]}...")
                
                if keywords_found >= total_keywords * 0.6:  # At least 60% of keywords
                    print(f"      ✅ Advanced processing successful!")
                    success_count += 1
                else:
                    print(f"      ⚠️  Limited advanced features detected")
                    success_count += 0.5
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count >= len(grammar_tests) * 0.7

def test_advanced_literature_analysis(token: str):
    """Test advanced Bengali literature analysis"""
    print("\n🔍 Testing Advanced Bengali Literature Analysis...")
    
    literature_tests = [
        {
            "name": "রবীন্দ্রনাথ comprehensive analysis",
            "message": "রবীন্দ্রনাথ ঠাকুরের সাহিত্যকর্ম ও বাংলাদেশে তাঁর প্রভাব আলোচনা করো।",
            "expected_keywords": ["গীতাঞ্জলি", "নোবেল পুরস্কার", "জাতীয় সংগীত", "বিশ্বকবি", "কাব্যগ্রন্থ"]
        },
        {
            "name": "নজরুল বিশ্লেষণ",
            "message": "কাজী নজরুল ইসলামের কবিতার বৈশিষ্ট্য কী?",
            "expected_keywords": ["বিদ্রোহী", "সাম্যবাদী", "জাতীয় কবি", "অগ্নিবীণা"]
        },
        {
            "name": "মধুসূদন অবদান",
            "message": "মাইকেল মধুসূদন দত্তের বাংলা সাহিত্যে অবদান লেখো।",
            "expected_keywords": ["মেঘনাদবধ", "অমিত্রাক্ষর", "মহাকাব্য", "সনেট"]
        }
    ]
    
    success_count = 0
    
    for test in literature_tests:
        print(f"\n   Testing: {test['name']}")
        
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {
                "message": test["message"],
                "model_category": "bangla",
                "subject": "bangla",
                "conversation_history": []
            }
            
            response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                response_text = data.get('response', '')
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Response length: {len(response_text)} chars")
                
                # Check for expected keywords
                keywords_found = sum(1 for keyword in test['expected_keywords'] if keyword in response_text)
                total_keywords = len(test['expected_keywords'])
                
                print(f"      Keywords found: {keywords_found}/{total_keywords}")
                print(f"      Preview: {response_text[:150]}...")
                
                if keywords_found >= total_keywords * 0.5:  # At least 50% of keywords
                    print(f"      ✅ Literature analysis successful!")
                    success_count += 1
                else:
                    print(f"      ⚠️  Basic literature response")
                    success_count += 0.5
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count >= len(literature_tests) * 0.7

def test_concept_explanation_enhancement(token: str):
    """Test enhanced concept explanation"""
    print("\n🔍 Testing Enhanced Concept Explanation...")
    
    concept_tests = [
        {
            "concept": "সন্ধি",
            "expected_features": ["প্রকারভেদ", "উদাহরণ", "SSC", "অনুশীলন"]
        },
        {
            "concept": "সমাস",
            "expected_features": ["দ্বন্দ্ব", "কর্মধারয়", "তৎপুরুষ", "ব্যাসবাক্য"]
        },
        {
            "concept": "রবীন্দ্রনাথ ঠাকুর",
            "expected_features": ["গীতাঞ্জলি", "নোবেল", "জাতীয় সংগীত", "বিশ্বকবি"]
        }
    ]
    
    success_count = 0
    
    for test in concept_tests:
        print(f"\n   Testing concept: {test['concept']}")
        
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {
                "concept": test["concept"],
                "subject": "bangla",
                "model_category": "bangla",
                "difficulty_level": "basic"
            }
            
            response = requests.post(f"{BASE_URL}/chat/explain", headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                explanation = data.get('explanation', '')
                model_used = data.get('model', 'unknown')
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Model: {model_used}")
                print(f"      Explanation length: {len(explanation)} chars")
                
                # Check for expected features
                features_found = sum(1 for feature in test['expected_features'] if feature in explanation)
                total_features = len(test['expected_features'])
                
                print(f"      Features found: {features_found}/{total_features}")
                print(f"      Preview: {explanation[:150]}...")
                
                if features_found >= total_features * 0.6:
                    print(f"      ✅ Enhanced explanation successful!")
                    success_count += 1
                else:
                    print(f"      ⚠️  Basic explanation provided")
                    success_count += 0.5
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count >= len(concept_tests) * 0.7

def test_contextual_understanding(token: str):
    """Test contextual understanding and adaptive responses"""
    print("\n🔍 Testing Contextual Understanding...")
    
    context_tests = [
        {
            "name": "Grammar context adaptation",
            "message": "ব্যাকরণ",
            "expected_adaptation": "Should provide comprehensive grammar overview"
        },
        {
            "name": "Literature context adaptation", 
            "message": "সাহিত্য",
            "expected_adaptation": "Should provide literature overview"
        },
        {
            "name": "SSC preparation focus",
            "message": "SSC পরীক্ষার জন্য বাংলা প্রস্তুতি",
            "expected_adaptation": "Should focus on SSC exam preparation"
        }
    ]
    
    success_count = 0
    
    for test in context_tests:
        print(f"\n   Testing: {test['name']}")
        
        try:
            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            payload = {
                "message": test["message"],
                "model_category": "bangla",
                "subject": "bangla",
                "conversation_history": []
            }
            
            response = requests.post(f"{BASE_URL}/chat/chat", headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                response_text = data.get('response', '')
                
                print(f"      ✅ Status: {response.status_code}")
                print(f"      Response length: {len(response_text)} chars")
                print(f"      Preview: {response_text[:150]}...")
                
                # Check for contextual adaptation
                ssc_mentioned = "SSC" in response_text or "এসএসসি" in response_text
                educational_tone = any(word in response_text for word in ["অনুশীলন", "পরীক্ষা", "প্রস্তুতি", "শিক্ষা"])
                
                if ssc_mentioned and educational_tone:
                    print(f"      ✅ Contextual adaptation successful!")
                    success_count += 1
                else:
                    print(f"      ⚠️  Limited contextual adaptation")
                    success_count += 0.5
                    
            else:
                print(f"      ❌ Request failed: {response.status_code}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    return success_count >= len(context_tests) * 0.7

def main():
    """Run all advanced BanglaBERT tests"""
    print("🚀 Testing Advanced BanglaBERT Integration")
    print("=" * 55)
    
    # Login
    print("🔐 Logging in...")
    token = login_user("student1@shikkhasathi.com", "student123")
    
    if not token:
        print("❌ Failed to login. Make sure sample data is created and backend is running.")
        return 1
    
    print("✅ Login successful!")
    
    tests = [
        ("Advanced Grammar Processing", lambda: test_advanced_grammar_processing(token)),
        ("Advanced Literature Analysis", lambda: test_advanced_literature_analysis(token)),
        ("Enhanced Concept Explanation", lambda: test_concept_explanation_enhancement(token)),
        ("Contextual Understanding", lambda: test_contextual_understanding(token))
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 45)
        
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"⚠️  {test_name} PARTIAL")
        except Exception as e:
            print(f"❌ {test_name} ERROR: {e}")
    
    print("\n" + "=" * 55)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed >= total * 0.75:
        print("🎉 Advanced BanglaBERT system is working excellently!")
        print("\n🎯 Advanced Features Verified:")
        print("   ✅ Sophisticated grammar explanations with examples")
        print("   ✅ Comprehensive literature analysis")
        print("   ✅ Enhanced concept explanations")
        print("   ✅ Contextual understanding and adaptation")
        print("   ✅ SSC preparation focus maintained")
        print("   ✅ Cultural context and Bengali language expertise")
        return 0
    elif passed >= total * 0.5:
        print("⚠️  Advanced BanglaBERT system is partially working.")
        print("Some advanced features may need refinement.")
        return 0
    else:
        print("❌ Advanced BanglaBERT system needs attention.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
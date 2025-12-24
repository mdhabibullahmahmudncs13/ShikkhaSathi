#!/usr/bin/env python3
"""
Test script for AI Mode functionality
Tests different AI modes with the multi-model AI tutor service
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.rag.multi_model_ai_tutor_service import multi_model_ai_tutor_service

async def test_ai_modes():
    """Test all AI modes with different questions"""
    
    test_cases = [
        {
            "message": "What is photosynthesis?",
            "model_category": "general",
            "ai_mode": "tutor",
            "subject": "Biology",
            "description": "Tutor Mode - Step-by-step explanation"
        },
        {
            "message": "What is photosynthesis?",
            "model_category": "general", 
            "ai_mode": "quiz",
            "subject": "Biology",
            "description": "Quiz Mode - Interactive questions"
        },
        {
            "message": "What is photosynthesis?",
            "model_category": "general",
            "ai_mode": "explanation",
            "subject": "Biology", 
            "description": "Explanation Mode - Quick definition"
        },
        {
            "message": "I need help with my math homework: solve 2x + 5 = 15",
            "model_category": "math",
            "ai_mode": "homework",
            "subject": "Mathematics",
            "description": "Homework Help Mode - Guided problem solving"
        },
        {
            "message": "How should I prepare for SSC Physics exam?",
            "model_category": "general",
            "ai_mode": "exam",
            "subject": "Physics",
            "description": "Exam Prep Mode - SSC preparation strategies"
        },
        {
            "message": "What do you think about renewable energy in Bangladesh?",
            "model_category": "general",
            "ai_mode": "discussion",
            "subject": "Physics",
            "description": "Discussion Mode - Interactive conversation"
        }
    ]
    
    print("🤖 Testing AI Mode Functionality")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test {i}: {test_case['description']}")
        print(f"Question: {test_case['message']}")
        print(f"Model: {test_case['model_category']} | Mode: {test_case['ai_mode']}")
        print("-" * 50)
        
        try:
            result = await multi_model_ai_tutor_service.chat(
                message=test_case['message'],
                model_category=test_case['model_category'],
                ai_mode=test_case['ai_mode'],
                conversation_history=[],
                subject=test_case['subject'],
                grade=9
            )
            
            print(f"✅ Model: {result.get('model', 'unknown')}")
            print(f"✅ Category: {result.get('category', 'unknown')}")
            print(f"✅ AI Mode: {test_case['ai_mode']}")
            print(f"✅ Specialized: {result.get('specialized', False)}")
            
            response = result.get('response', 'No response')
            # Show first 300 characters to see the mode-specific formatting
            if len(response) > 300:
                print(f"✅ Response Preview: {response[:300]}...")
            else:
                print(f"✅ Response: {response}")
                
            # Check if response contains mode-specific keywords
            mode_keywords = {
                'tutor': ['step', 'explain', 'understand', 'let me', 'first'],
                'quiz': ['question', 'answer', 'correct', 'test', 'choose'],
                'explanation': ['definition', 'concept', 'simply', 'key points'],
                'homework': ['hint', 'try', 'think', 'guide', 'help you'],
                'exam': ['SSC', 'exam', 'strategy', 'practice', 'preparation'],
                'discussion': ['think', 'opinion', 'perspective', 'discuss', 'what do you']
            }
            
            expected_keywords = mode_keywords.get(test_case['ai_mode'], [])
            found_keywords = [kw for kw in expected_keywords if kw.lower() in response.lower()]
            
            if found_keywords:
                print(f"✅ Mode-specific keywords found: {found_keywords}")
            else:
                print(f"⚠️  No specific mode keywords detected")
                
            if 'error' in result:
                print(f"⚠️  Error: {result['error']}")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎯 Testing AI Mode Validation")
    
    # Test invalid AI mode
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="Test question",
            model_category="general",
            ai_mode="invalid_mode",
            conversation_history=[],
            subject="Test",
            grade=9
        )
        print(f"✅ Invalid AI mode handled gracefully")
        print(f"   Response: {result.get('response', '')[:100]}...")
    except Exception as e:
        print(f"❌ Error handling invalid AI mode: {str(e)}")
    
    # Test missing AI mode (should default to tutor)
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="Test question",
            model_category="general",
            ai_mode=None,
            conversation_history=[],
            subject="Test",
            grade=9
        )
        print(f"✅ Missing AI mode handled (defaults to tutor)")
        print(f"   Response: {result.get('response', '')[:100]}...")
    except Exception as e:
        print(f"❌ Error handling missing AI mode: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting AI Mode Functionality Tests")
    asyncio.run(test_ai_modes())
    print("\n✨ AI Mode tests completed!")
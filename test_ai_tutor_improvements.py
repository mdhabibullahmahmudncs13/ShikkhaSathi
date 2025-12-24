#!/usr/bin/env python3
"""
Test script for AI Tutor improvements
Tests the enhanced multi-model AI tutor service
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.rag.multi_model_ai_tutor_service import multi_model_ai_tutor_service

async def test_model_categories():
    """Test all three model categories with different questions"""
    
    test_cases = [
        {
            "message": "What is photosynthesis?",
            "model_category": "general",
            "subject": "Biology",
            "description": "General Model - Biology Question"
        },
        {
            "message": "Solve: 2x + 5 = 15",
            "model_category": "math", 
            "subject": "Mathematics",
            "description": "Math Model - Algebra Question"
        },
        {
            "message": "বাংলা ব্যাকরণে সন্ধি কী?",
            "model_category": "bangla",
            "subject": "Bangla",
            "description": "Bangla Model - Grammar Question"
        }
    ]
    
    print("🧪 Testing AI Tutor Model Selection and Enhanced Prompts")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test {i}: {test_case['description']}")
        print(f"Question: {test_case['message']}")
        print("-" * 40)
        
        try:
            result = await multi_model_ai_tutor_service.chat(
                message=test_case['message'],
                model_category=test_case['model_category'],
                conversation_history=[],
                subject=test_case['subject'],
                grade=9
            )
            
            print(f"✅ Model: {result.get('model', 'unknown')}")
            print(f"✅ Category: {result.get('category', 'unknown')}")
            print(f"✅ Specialized: {result.get('specialized', False)}")
            print(f"✅ User Selected: {result.get('user_selected', False)}")
            print(f"✅ Context Used: {result.get('context_used', False)}")
            print(f"✅ Sources: {len(result.get('sources', []))} sources")
            
            response = result.get('response', 'No response')
            if len(response) > 200:
                print(f"✅ Response: {response[:200]}...")
            else:
                print(f"✅ Response: {response}")
                
            if 'error' in result:
                print(f"⚠️  Error: {result['error']}")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🎯 Testing model category validation")
    
    # Test invalid model category
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="Test question",
            model_category="invalid",
            conversation_history=[],
            subject="Test",
            grade=9
        )
        print(f"✅ Invalid category handled: {result.get('response', '')[:100]}...")
    except Exception as e:
        print(f"❌ Error handling invalid category: {str(e)}")
    
    # Test missing model category
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="Test question",
            model_category=None,
            conversation_history=[],
            subject="Test", 
            grade=9
        )
        print(f"✅ Missing category handled: {result.get('response', '')[:100]}...")
    except Exception as e:
        print(f"❌ Error handling missing category: {str(e)}")

async def test_model_info():
    """Test model information endpoint"""
    print("\n🔍 Testing Model Information")
    print("-" * 30)
    
    try:
        model_info = multi_model_ai_tutor_service.get_model_info()
        print("✅ Available Models:")
        for category, info in model_info.items():
            print(f"  • {category}: {info['model_name']} (Available: {info['available']})")
    except Exception as e:
        print(f"❌ Error getting model info: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting AI Tutor Enhancement Tests")
    asyncio.run(test_model_categories())
    asyncio.run(test_model_info())
    print("\n✨ Test completed!")
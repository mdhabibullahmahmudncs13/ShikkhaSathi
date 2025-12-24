#!/usr/bin/env python3
"""
Quick test to verify AI tutor is working after the BanglaBERT fix
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.rag.multi_model_ai_tutor_service import multi_model_ai_tutor_service

async def test_ai_tutor_fix():
    """Test if the AI tutor is working with AI modes"""
    
    print("🧪 Testing AI Tutor Fix")
    print("=" * 40)
    
    # Test Bangla model with tutor mode
    print("\n📝 Testing Bangla Model + Tutor Mode")
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="বাংলা ব্যাকরণে সন্ধি কী?",
            model_category="bangla",
            ai_mode="tutor",
            conversation_history=[],
            subject="Bangla",
            grade=9
        )
        
        print(f"✅ Success! Model: {result.get('model', 'unknown')}")
        print(f"✅ Category: {result.get('category', 'unknown')}")
        print(f"✅ Response: {result.get('response', 'No response')[:100]}...")
        
        if 'error' in result:
            print(f"⚠️  Error: {result['error']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test Math model with quiz mode
    print("\n📝 Testing Math Model + Quiz Mode")
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="What is 2x + 5 = 15?",
            model_category="math",
            ai_mode="quiz",
            conversation_history=[],
            subject="Mathematics",
            grade=9
        )
        
        print(f"✅ Success! Model: {result.get('model', 'unknown')}")
        print(f"✅ Category: {result.get('category', 'unknown')}")
        print(f"✅ Response: {result.get('response', 'No response')[:100]}...")
        
        if 'error' in result:
            print(f"⚠️  Error: {result['error']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    # Test General model with explanation mode
    print("\n📝 Testing General Model + Explanation Mode")
    try:
        result = await multi_model_ai_tutor_service.chat(
            message="What is photosynthesis?",
            model_category="general",
            ai_mode="explanation",
            conversation_history=[],
            subject="Biology",
            grade=9
        )
        
        print(f"✅ Success! Model: {result.get('model', 'unknown')}")
        print(f"✅ Category: {result.get('category', 'unknown')}")
        print(f"✅ Response: {result.get('response', 'No response')[:100]}...")
        
        if 'error' in result:
            print(f"⚠️  Error: {result['error']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Testing AI Tutor Fix")
    asyncio.run(test_ai_tutor_fix())
    print("\n✨ Test completed!")
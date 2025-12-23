#!/usr/bin/env python3
"""
Test script to verify AI tutor can handle multiple consecutive messages
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/v1/auth/login"
CHAT_URL = f"{BASE_URL}/api/v1/chat/chat"

def test_multiple_chat_messages():
    """Test multiple consecutive chat messages"""
    print("🔐 Testing multiple chat messages...")
    
    # Login first
    login_data = {
        "email": "student1@shikkhasathi.com",
        "password": "student123"
    }
    
    print("📝 Logging in...")
    login_response = requests.post(LOGIN_URL, json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        return False
    
    # Get token
    token_data = login_response.json()
    token = token_data.get("access_token")
    
    if not token:
        print("❌ No access token received")
        return False
    
    print("✅ Login successful!")
    
    # Set up headers
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test multiple messages
    messages = [
        "What is force in physics?",
        "Can you give me an example of force?",
        "What is Newton's first law?",
        "How does friction work?",
        "What is the difference between mass and weight?"
    ]
    
    conversation_history = []
    
    for i, message in enumerate(messages, 1):
        print(f"\n💬 Message {i}: {message}")
        
        chat_data = {
            "message": message,
            "conversation_history": conversation_history,
            "subject": "Physics"
        }
        
        try:
            response = requests.post(CHAT_URL, headers=headers, json=chat_data)
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get("response", "")
                sources = result.get("sources", [])
                
                print(f"✅ Response {i} successful!")
                print(f"📝 AI Response: {ai_response[:100]}...")
                print(f"📚 Sources: {len(sources)} sources")
                
                # Add to conversation history
                conversation_history.extend([
                    {"role": "user", "content": message},
                    {"role": "assistant", "content": ai_response}
                ])
                
                # Keep only last 10 messages
                if len(conversation_history) > 10:
                    conversation_history = conversation_history[-10:]
                
            else:
                print(f"❌ Message {i} failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error sending message {i}: {e}")
            return False
        
        # Small delay between messages
        time.sleep(1)
    
    print(f"\n🎉 All {len(messages)} messages sent successfully!")
    print(f"📊 Final conversation history length: {len(conversation_history)}")
    return True

if __name__ == "__main__":
    success = test_multiple_chat_messages()
    if success:
        print("\n✅ Multiple chat test PASSED - Backend can handle consecutive messages")
    else:
        print("\n❌ Multiple chat test FAILED")
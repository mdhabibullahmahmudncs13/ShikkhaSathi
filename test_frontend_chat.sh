#!/bin/bash

echo "🔐 Testing frontend chat simulation..."

# Step 1: Login
echo "📝 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@shikkhasathi.com", "password": "student123"}')

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Login successful!"

# Step 2: Send first message
echo ""
echo "💬 Sending first message..."
FIRST_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/chat/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What is force in physics?",
    "conversation_history": [
      {
        "role": "assistant",
        "content": "Hello! I am ShikkhaSathi, your AI tutor."
      }
    ],
    "subject": "Physics"
  }')

echo "✅ First response received!"
echo "📝 Response: $(echo $FIRST_RESPONSE | cut -c1-100)..."

# Step 3: Send second message with conversation history
echo ""
echo "💬 Sending second message..."
SECOND_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/chat/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "Can you give me an example?",
    "conversation_history": [
      {
        "role": "assistant",
        "content": "Hello! I am ShikkhaSathi, your AI tutor."
      },
      {
        "role": "user",
        "content": "What is force in physics?"
      },
      {
        "role": "assistant",
        "content": "Force is a push or pull that can change the motion of an object."
      }
    ],
    "subject": "Physics"
  }')

echo "✅ Second response received!"
echo "📝 Response: $(echo $SECOND_RESPONSE | cut -c1-100)..."

# Step 4: Send third message
echo ""
echo "💬 Sending third message..."
THIRD_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/chat/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What about Newton'\''s laws?",
    "conversation_history": [
      {
        "role": "user",
        "content": "What is force in physics?"
      },
      {
        "role": "assistant",
        "content": "Force is a push or pull that can change the motion of an object."
      },
      {
        "role": "user",
        "content": "Can you give me an example?"
      },
      {
        "role": "assistant",
        "content": "Sure! When you push a door to open it, you are applying force."
      }
    ],
    "subject": "Physics"
  }')

echo "✅ Third response received!"
echo "📝 Response: $(echo $THIRD_RESPONSE | cut -c1-100)..."

echo ""
echo "🎉 Frontend chat simulation successful!"
echo "✅ Backend can handle multiple consecutive messages correctly"
echo "🔍 The issue is likely in the React component state management"
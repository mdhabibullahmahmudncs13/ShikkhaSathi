#!/bin/bash

echo "🤖 Testing ShikkhaSathi AI Chat Endpoint"
echo "======================================"

# Get authentication token
echo "1. Getting authentication token..."
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@test.com","password":"student123"}' | \
  grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  exit 1
fi

echo "✅ Token obtained: ${TOKEN:0:50}..."

# Test chat endpoint
echo ""
echo "2. Testing chat endpoint..."
echo "Sending message: 'Hello, can you help me with mathematics?'"

RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/chat/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "Hello, can you help me with mathematics?",
    "subject": "mathematics",
    "conversation_history": []
  }')

echo ""
echo "3. Chat Response:"
echo "=================="
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

echo ""
echo "4. Testing with a specific math question..."
echo "Sending message: 'What is a quadratic equation?'"

RESPONSE2=$(curl -s -X POST http://localhost:8000/api/v1/chat/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What is a quadratic equation?",
    "subject": "mathematics",
    "conversation_history": [
      {"role": "user", "content": "Hello, can you help me with mathematics?"},
      {"role": "assistant", "content": "Hello! I am ShikkhaSathi, your AI tutor. I would be happy to help you with mathematics."}
    ]
  }')

echo ""
echo "5. Math Question Response:"
echo "=========================="
echo "$RESPONSE2" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE2"

echo ""
echo "🎉 Chat endpoint testing complete!"
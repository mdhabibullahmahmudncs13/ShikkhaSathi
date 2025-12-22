#!/bin/bash

echo "🧪 Testing Frontend API Connection..."

# Get token
echo "📝 Getting authentication token..."
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:5173/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "student1@shikkhasathi.com", "password": "student123"}')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Token obtained successfully"

# Test subjects API through frontend proxy
echo ""
echo "📚 Testing subjects API through frontend proxy..."
SUBJECTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5173/api/v1/quiz/subjects")

echo "📊 Subjects API Response:"
echo $SUBJECTS_RESPONSE | jq '.'

# Check ICT specifically
ICT_QUESTIONS=$(echo $SUBJECTS_RESPONSE | jq -r '.subjects[] | select(.subject == "ICT") | .total_questions')
echo ""
echo "🎯 ICT Questions Available: $ICT_QUESTIONS"

if [ "$ICT_QUESTIONS" = "600" ]; then
    echo "✅ ICT shows 600 questions - API working correctly!"
else
    echo "❌ ICT shows $ICT_QUESTIONS questions - API issue detected"
fi
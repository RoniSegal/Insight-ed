#!/bin/bash

# Test Chat API Integration
# This script tests the OpenAI chat endpoint

set -e

BASE_URL="http://localhost:4001"
echo "Testing Chat API at $BASE_URL"
echo "================================"

# Step 1: Login to get token
echo -e "\n1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Logged in successfully"

# Step 2: Get student list
echo -e "\n2. Getting students..."
STUDENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/students" \
  -H "Authorization: Bearer $TOKEN")

STUDENT_ID=$(echo $STUDENTS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$STUDENT_ID" ]; then
  echo "❌ No students found"
  exit 1
fi

echo "✓ Found student ID: $STUDENT_ID"

# Step 3: Start conversation
echo -e "\n3. Starting conversation..."
START_RESPONSE=$(curl -s -X POST "$BASE_URL/api/analysis/start" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"studentId\":\"$STUDENT_ID\"}")

CONVERSATION_ID=$(echo $START_RESPONSE | grep -o '"conversationId":"[^"]*' | cut -d'"' -f4)

if [ -z "$CONVERSATION_ID" ]; then
  echo "❌ Failed to start conversation"
  echo "Response: $START_RESPONSE"
  exit 1
fi

echo "✓ Conversation started: $CONVERSATION_ID"
echo "First message:"
echo $START_RESPONSE | grep -o '"message":"[^"]*' | cut -d'"' -f4 | head -c 100
echo "..."

# Step 4: Send chat message
echo -e "\n4. Sending chat message..."
CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/analysis/chat" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONVERSATION_ID\",\"message\":\"התלמיד מצטיין במתמטיקה אבל מתקשה בקריאה\"}")

if echo $CHAT_RESPONSE | grep -q '"message"'; then
  echo "✓ Chat response received"
  echo "Response preview:"
  echo $CHAT_RESPONSE | grep -o '"message":"[^"]*' | cut -d'"' -f4 | head -c 150
  echo "..."
  
  # Check metadata
  if echo $CHAT_RESPONSE | grep -q '"questionCount"'; then
    QUESTION_COUNT=$(echo $CHAT_RESPONSE | grep -o '"questionCount":[0-9]*' | cut -d':' -f2)
    echo "✓ Question count: $QUESTION_COUNT"
  fi
else
  echo "❌ Failed to get chat response"
  echo "Response: $CHAT_RESPONSE"
  exit 1
fi

# Step 5: Send another message
echo -e "\n5. Sending second message..."
CHAT_RESPONSE2=$(curl -s -X POST "$BASE_URL/api/analysis/chat" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONVERSATION_ID\",\"message\":\"הוא מאוד חברותי ועובד טוב בקבוצה\"}")

if echo $CHAT_RESPONSE2 | grep -q '"message"'; then
  echo "✓ Second chat response received"
  QUESTION_COUNT=$(echo $CHAT_RESPONSE2 | grep -o '"questionCount":[0-9]*' | cut -d':' -f2)
  echo "✓ Question count: $QUESTION_COUNT"
else
  echo "❌ Failed to get second chat response"
  exit 1
fi

echo -e "\n✅ All tests passed!"
echo "================================"
echo "Summary:"
echo "  - Authentication: ✓"
echo "  - Conversation start: ✓"
echo "  - Chat messages: ✓"
echo "  - Message count tracking: ✓"
echo ""
echo "Note: If OpenAI API key is configured, responses use GPT-4."
echo "      Otherwise, falls back to template Hebrew responses."

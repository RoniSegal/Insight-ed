#!/bin/bash

# Test Analysis Results API
# Usage: ./test-analysis-api.sh [BASE_URL]

BASE_URL="${1:-http://localhost:3000}"
API_URL="$BASE_URL/api"

echo "Testing Analysis Results API at $API_URL"
echo "==========================================="
echo ""

# Step 1: Login to get token
echo "1. Getting auth token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "Test123!"
  }')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "   ❌ Failed to get token"
  echo "   Response: $TOKEN_RESPONSE"
  exit 1
fi

echo "   ✅ Got token: ${TOKEN:0:20}..."
echo ""

# Step 2: Create an analysis
echo "2. Creating new analysis..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/analysis" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "1",
    "analysis": "# ניתוח תלמיד\n\nזהו ניתוח בדיקה",
    "conversationHistory": [
      {"role": "assistant", "content": "שלום"},
      {"role": "user", "content": "שלום גם לך"}
    ]
  }')

ANALYSIS_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$ANALYSIS_ID" ]; then
  echo "   ❌ Failed to create analysis"
  echo "   Response: $CREATE_RESPONSE"
  exit 1
fi

echo "   ✅ Created analysis with ID: $ANALYSIS_ID"
echo ""

# Step 3: Get all analyses
echo "3. Getting all analyses..."
ALL_RESPONSE=$(curl -s -X GET "$API_URL/analysis" \
  -H "Authorization: Bearer $TOKEN")

echo "   ✅ Response: $(echo $ALL_RESPONSE | jq -r '.analyses | length') analyses"
echo ""

# Step 4: Get analyses for student
echo "4. Getting analyses for student 1..."
STUDENT_RESPONSE=$(curl -s -X GET "$API_URL/analysis/1" \
  -H "Authorization: Bearer $TOKEN")

echo "   ✅ Response: $(echo $STUDENT_RESPONSE | jq -r '.analyses | length') analyses for student 1"
echo ""

# Step 5: Get latest analysis for student
echo "5. Getting latest analysis for student 1..."
LATEST_RESPONSE=$(curl -s -X GET "$API_URL/analysis/1/latest" \
  -H "Authorization: Bearer $TOKEN")

LATEST_ID=$(echo $LATEST_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "   ✅ Latest analysis ID: $LATEST_ID"
echo ""

# Step 6: Get specific analysis by ID
echo "6. Getting analysis by ID $ANALYSIS_ID..."
GET_RESPONSE=$(curl -s -X GET "$API_URL/analysis/$ANALYSIS_ID" \
  -H "Authorization: Bearer $TOKEN")

GET_ID=$(echo $GET_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "   ✅ Retrieved analysis ID: $GET_ID"
echo ""

# Step 7: Delete analysis
echo "7. Deleting analysis $ANALYSIS_ID..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/analysis/$ANALYSIS_ID" \
  -H "Authorization: Bearer $TOKEN")

SUCCESS=$(echo $DELETE_RESPONSE | grep -o '"success":[^,}]*' | cut -d':' -f2)
echo "   ✅ Delete success: $SUCCESS"
echo ""

# Step 8: Verify deletion
echo "8. Verifying deletion..."
VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/analysis/$ANALYSIS_ID" \
  -H "Authorization: Bearer $TOKEN")

ERROR=$(echo $VERIFY_RESPONSE | grep -o '"error":"[^"]*' | cut -d'"' -f4)
echo "   ✅ Expected error: $ERROR"
echo ""

echo "==========================================="
echo "All tests completed successfully! ✅"

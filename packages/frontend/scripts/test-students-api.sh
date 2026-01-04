#!/bin/bash

# Test script for Students API
# This tests all CRUD operations for the students endpoint

BASE_URL="http://localhost:4001"

echo "=== Testing Students API ==="
echo ""

# Step 1: Login and get token
echo "1. Login to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to get token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Login successful, token received"
echo ""

# Step 2: List all students (should show 5 seeded students)
echo "2. GET /api/students - List all students..."
curl -s -X GET "$BASE_URL/api/students" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 3: Get specific student
echo "3. GET /api/students/1 - Get student by ID..."
curl -s -X GET "$BASE_URL/api/students/1" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 4: Create new student
echo "4. POST /api/students - Create new student..."
NEW_STUDENT=$(curl -s -X POST "$BASE_URL/api/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "יוסף אברהמי",
    "grade": "כיתה ו׳",
    "class": "מר כהן"
  }')

echo $NEW_STUDENT | jq '.'
NEW_STUDENT_ID=$(echo $NEW_STUDENT | jq -r '.student.id')
echo "✓ Created student with ID: $NEW_STUDENT_ID"
echo ""

# Step 5: Update student
echo "5. PUT /api/students/$NEW_STUDENT_ID - Update student..."
curl -s -X PUT "$BASE_URL/api/students/$NEW_STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "כיתה ז׳"
  }' | jq '.'
echo ""

# Step 6: Delete student
echo "6. DELETE /api/students/$NEW_STUDENT_ID - Delete student..."
curl -s -X DELETE "$BASE_URL/api/students/$NEW_STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 7: Verify deletion
echo "7. GET /api/students/$NEW_STUDENT_ID - Verify deletion (should return 404)..."
curl -s -X GET "$BASE_URL/api/students/$NEW_STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 8: Test validation - missing name
echo "8. POST /api/students - Test validation (missing name, should fail)..."
curl -s -X POST "$BASE_URL/api/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "כיתה ג׳"
  }' | jq '.'
echo ""

# Step 9: Test authentication - missing token
echo "9. GET /api/students - Test authentication (no token, should fail)..."
curl -s -X GET "$BASE_URL/api/students" | jq '.'
echo ""

echo "=== All tests completed ==="

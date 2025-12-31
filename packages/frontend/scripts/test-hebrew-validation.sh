#!/bin/bash

# Test script for Hebrew name validation
# Tests the Unicode-aware validation in students API

set -e

echo "=========================================="
echo "Testing Hebrew Name Validation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000"
EMAIL="teacher@example.com"
PASSWORD="password123"

# Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to login. Response: $LOGIN_RESPONSE${NC}"
  exit 1
fi

echo -e "${GREEN}Login successful!${NC}"
echo ""

# Test function
test_student_creation() {
  local test_name="$1"
  local student_name="$2"
  local should_pass="$3"
  local expected_error="$4"

  echo "----------------------------------------"
  echo "Test: $test_name"
  echo "Name: '$student_name'"

  RESPONSE=$(curl -s -X POST "$API_URL/api/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"name\":\"$student_name\",\"grade\":\"א\"}")

  if [ "$should_pass" = "true" ]; then
    if echo "$RESPONSE" | grep -q '"student"'; then
      echo -e "${GREEN}✓ PASS${NC} - Student created successfully"
      echo "Response: $RESPONSE"
    else
      echo -e "${RED}✗ FAIL${NC} - Expected success but got error"
      echo "Response: $RESPONSE"
    fi
  else
    if echo "$RESPONSE" | grep -q '"error"'; then
      echo -e "${GREEN}✓ PASS${NC} - Correctly rejected with error"
      echo "Response: $RESPONSE"
      if [ -n "$expected_error" ] && echo "$RESPONSE" | grep -q "$expected_error"; then
        echo -e "${GREEN}✓ Error message matches expected: $expected_error${NC}"
      fi
    else
      echo -e "${RED}✗ FAIL${NC} - Expected error but got success"
      echo "Response: $RESPONSE"
    fi
  fi
  echo ""
}

# Test cases from requirements
echo "=========================================="
echo "Test Cases"
echo "=========================================="
echo ""

test_student_creation "Hebrew only name" "דוד כהן" "true" ""

test_student_creation "English only name" "David Cohen" "true" ""

test_student_creation "Mixed Hebrew/English name" "David כהן" "true" ""

test_student_creation "Hebrew with hyphen" "שרה לוי-כהן" "true" ""

test_student_creation "Hebrew with apostrophe" "ג'ון סמית" "true" ""

test_student_creation "Only whitespace" "   " "false" "שם הוא שדה חובה"

test_student_creation "Empty string" "" "false" "שם הוא שדה חובה"

test_student_creation "Hebrew with numbers" "דוד123" "false" "השם יכול להכיל רק אותיות בעברית או באנגלית"

test_student_creation "Special characters" "דוד@כהן" "false" "השם יכול להכיל רק אותיות בעברית או באנגלית"

test_student_creation "Name with emoji" "דוד 😊" "false" "השם יכול להכיל רק אותיות בעברית או באנגלית"

echo "=========================================="
echo "All tests completed!"
echo "=========================================="

#!/bin/bash
# Test script for authentication API endpoints
# Usage: ./scripts/test-auth-api.sh

API_URL="http://localhost:4001/api/auth"

echo "======================================"
echo "Authentication API Test Suite"
echo "======================================"
echo ""

# Test 1: Login with correct credentials
echo "Test 1: Login with correct credentials"
echo "--------------------------------------"
RESPONSE=$(curl -s -X POST ${API_URL}/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}')
echo $RESPONSE | jq .

# Extract token for next tests
TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
echo ""
echo "Token: $TOKEN"
echo ""

# Test 2: Login with wrong credentials
echo "Test 2: Login with wrong credentials"
echo "--------------------------------------"
curl -s -X POST ${API_URL}/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"WrongPassword"}' | jq .
echo ""

# Test 3: Get current user with valid token
echo "Test 3: Get current user with valid token"
echo "--------------------------------------"
curl -s -X GET ${API_URL}/me \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 4: Get current user with invalid token
echo "Test 4: Get current user with invalid token"
echo "--------------------------------------"
curl -s -X GET ${API_URL}/me \
  -H "Authorization: Bearer invalid-token-here" | jq .
echo ""

# Test 5: Get current user without token
echo "Test 5: Get current user without token"
echo "--------------------------------------"
curl -s -X GET ${API_URL}/me | jq .
echo ""

# Test 6: Logout
echo "Test 6: Logout"
echo "--------------------------------------"
curl -s -X POST ${API_URL}/logout | jq .
echo ""

echo "======================================"
echo "All tests completed!"
echo "======================================"

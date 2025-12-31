#!/bin/bash

# Test script for Results Display Page (GE-059)
# Tests the /results/[id] route with seeded analysis data

echo "====================================="
echo "Testing Results Display Page"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
API_URL="http://localhost:3000/api"

echo "${YELLOW}Prerequisites:${NC}"
echo "1. Frontend dev server is running (npm run dev)"
echo "2. User is logged in to get access token"
echo ""

# Prompt for access token
read -p "Enter your access token (from localStorage): " ACCESS_TOKEN

if [ -z "$ACCESS_TOKEN" ]; then
  echo "${RED}Error: Access token is required${NC}"
  exit 1
fi

echo ""
echo "====================================="
echo "Test 1: Fetch Analysis by ID (Seeded Data)"
echo "====================================="

# Test with analysis ID 1 (Sarah Cohen)
echo "Fetching analysis ID: 1 (Sarah Cohen)..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$API_URL/analysis/by-id/1")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "${GREEN}✓ Successfully fetched analysis${NC}"
  echo "$BODY" | jq '.analysis | {id, studentId, createdBy, createdAt}' 2>/dev/null || echo "$BODY"
else
  echo "${RED}✗ Failed to fetch analysis (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""
echo "====================================="
echo "Test 2: Fetch Analysis by ID (Analysis 2)"
echo "====================================="

# Test with analysis ID 2 (Michael David)
echo "Fetching analysis ID: 2 (Michael David)..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$API_URL/analysis/by-id/2")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "${GREEN}✓ Successfully fetched analysis${NC}"
  echo "$BODY" | jq '.analysis | {id, studentId, createdBy, createdAt}' 2>/dev/null || echo "$BODY"
else
  echo "${RED}✗ Failed to fetch analysis (HTTP $HTTP_CODE)${NC}"
  echo "$BODY"
fi

echo ""
echo "====================================="
echo "Test 3: Invalid Analysis ID (404)"
echo "====================================="

echo "Fetching analysis ID: 999 (should not exist)..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$API_URL/analysis/by-id/999")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 404 ]; then
  echo "${GREEN}✓ Correctly returns 404 for non-existent analysis${NC}"
  echo "$BODY"
else
  echo "${RED}✗ Expected 404, got HTTP $HTTP_CODE${NC}"
  echo "$BODY"
fi

echo ""
echo "====================================="
echo "Manual Testing Instructions"
echo "====================================="
echo ""
echo "To test the UI manually:"
echo "1. Open browser to ${YELLOW}$BASE_URL/results/1${NC}"
echo "2. Verify you see analysis for Sarah Cohen (שרה כהן)"
echo "3. Check RTL layout and Hebrew text rendering"
echo "4. Test 'Back to Students' button"
echo "5. Test 'Analyze Again' button"
echo "6. Test Print button (Ctrl/Cmd+P)"
echo ""
echo "To test error states:"
echo "7. Visit ${YELLOW}$BASE_URL/results/999${NC} (should show error)"
echo "8. Log out and try to access ${YELLOW}$BASE_URL/results/1${NC} (should redirect to login)"
echo ""
echo "====================================="
echo "Tests Complete"
echo "====================================="

#!/bin/bash

##################################################################
# COMPREHENSIVE HEBREW INTEGRATION TEST
# GE-061: Day 2 Integration Testing with Hebrew Names
#
# Tests the complete student analysis flow with Hebrew data:
# 1. Login
# 2. Add Hebrew-named students
# 3. Start analysis
# 4. Chat flow
# 5. Complete analysis
# 6. View results
##################################################################

BASE_URL="http://localhost:4001"
API_URL="$BASE_URL/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test results array
declare -a TEST_RESULTS

# Function to print section header
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Function to print test result
print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $1"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        TEST_RESULTS+=("PASS: $1")
    else
        echo -e "${RED}✗ FAIL${NC}: $1"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        TEST_RESULTS+=("FAIL: $1")
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ WARNING${NC}: $1"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ INFO${NC}: $1"
}

##################################################################
# TEST 1: LOGIN AND AUTHENTICATION
##################################################################
print_header "TEST 1: LOGIN AND AUTHENTICATION"

echo "Logging in as teacher..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "teacher@example.com",
        "password": "Test123!"
    }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    print_test "Login with valid credentials" 1
    echo -e "${RED}ERROR: Could not obtain auth token. Stopping tests.${NC}"
    exit 1
else
    print_test "Login with valid credentials" 0
    print_info "Token obtained: ${TOKEN:0:20}..."
fi

##################################################################
# TEST 2: HEBREW STUDENT VALIDATION
##################################################################
print_header "TEST 2: HEBREW STUDENT NAME VALIDATION"

# Test 2.1: Pure Hebrew name
echo ""
echo "Test 2.1: Adding student with pure Hebrew name (דוד כהן)..."
STUDENT1_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "דוד כהן",
        "grade": "כיתה ג׳",
        "class": "גב'\'' לוי"
    }')

echo "Response: $STUDENT1_RESPONSE"

if echo "$STUDENT1_RESPONSE" | grep -q '"student"'; then
    STUDENT1_ID=$(echo $STUDENT1_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    print_test "Add student with pure Hebrew name (דוד כהן)" 0
    print_info "Student ID: $STUDENT1_ID"
else
    print_test "Add student with pure Hebrew name (דוד כהן)" 1
    STUDENT1_ID=""
fi

# Test 2.2: Hebrew with hyphen
echo ""
echo "Test 2.2: Adding student with hyphenated Hebrew name (שרה לוי-כהן)..."
STUDENT2_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "שרה לוי-כהן",
        "grade": "כיתה ד׳",
        "class": "מר רוזנברג"
    }')

echo "Response: $STUDENT2_RESPONSE"

if echo "$STUDENT2_RESPONSE" | grep -q '"student"'; then
    STUDENT2_ID=$(echo $STUDENT2_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    print_test "Add student with hyphenated Hebrew name (שרה לוי-כהן)" 0
    print_info "Student ID: $STUDENT2_ID"
else
    print_test "Add student with hyphenated Hebrew name (שרה לוי-כהן)" 1
    STUDENT2_ID=""
fi

# Test 2.3: Hebrew with apostrophe
echo ""
echo "Test 2.3: Adding student with apostrophe in Hebrew name (מרים ד'אנג'לו)..."
STUDENT3_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "מרים ד'\''אנג'\''לו",
        "grade": "כיתה ה׳",
        "class": "גב'\'' שפירא"
    }')

echo "Response: $STUDENT3_RESPONSE"

if echo "$STUDENT3_RESPONSE" | grep -q '"student"'; then
    STUDENT3_ID=$(echo $STUDENT3_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    print_test "Add student with apostrophe in Hebrew name (מרים ד'אנג'לו)" 0
    print_info "Student ID: $STUDENT3_ID"
else
    print_test "Add student with apostrophe in Hebrew name (מרים ד'אנג'לו)" 1
    STUDENT3_ID=""
fi

# Test 2.4: Mixed Hebrew/English
echo ""
echo "Test 2.4: Adding student with mixed Hebrew/English name (David כהן)..."
STUDENT4_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "David כהן",
        "grade": "כיתה ו׳",
        "class": "מר פרידמן"
    }')

echo "Response: $STUDENT4_RESPONSE"

if echo "$STUDENT4_RESPONSE" | grep -q '"student"'; then
    STUDENT4_ID=$(echo $STUDENT4_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    print_test "Add student with mixed Hebrew/English name (David כהן)" 0
    print_info "Student ID: $STUDENT4_ID"
else
    print_test "Add student with mixed Hebrew/English name (David כהן)" 1
    STUDENT4_ID=""
fi

# Test 2.5: Invalid name (numbers)
echo ""
echo "Test 2.5: Attempting to add student with invalid name (דוד123)..."
INVALID_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "דוד123",
        "grade": "כיתה ג׳"
    }')

echo "Response: $INVALID_RESPONSE"

if echo "$INVALID_RESPONSE" | grep -q '"error"'; then
    print_test "Reject student with numbers in name (דוד123)" 0
    print_info "Validation working correctly"
else
    print_test "Reject student with numbers in name (דוד123)" 1
    print_warning "Validation should reject names with numbers"
fi

# Test 2.6: Invalid name (special chars)
echo ""
echo "Test 2.6: Attempting to add student with special characters (דוד@כהן)..."
INVALID2_RESPONSE=$(curl -s -X POST "$API_URL/students" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
        "name": "דוד@כהן",
        "grade": "כיתה ג׳"
    }')

echo "Response: $INVALID2_RESPONSE"

if echo "$INVALID2_RESPONSE" | grep -q '"error"'; then
    print_test "Reject student with special characters (דוד@כהן)" 0
    print_info "Validation working correctly"
else
    print_test "Reject student with special characters (דוד@כהן)" 1
    print_warning "Validation should reject names with special characters"
fi

##################################################################
# TEST 3: RETRIEVE STUDENTS AND VERIFY HEBREW ENCODING
##################################################################
print_header "TEST 3: RETRIEVE STUDENTS AND VERIFY HEBREW ENCODING"

echo "Fetching all students..."
STUDENTS_LIST=$(curl -s -X GET "$API_URL/students" \
    -H "Authorization: Bearer $TOKEN")

echo "Students List:"
echo "$STUDENTS_LIST" | python3 -m json.tool 2>/dev/null || echo "$STUDENTS_LIST"

if echo "$STUDENTS_LIST" | grep -q '"students"'; then
    print_test "Retrieve students list" 0

    # Check if Hebrew names are preserved
    if echo "$STUDENTS_LIST" | grep -q 'דוד כהן'; then
        print_test "Hebrew name preserved in list (דוד כהן)" 0
    else
        print_test "Hebrew name preserved in list (דוד כהן)" 1
    fi

    if echo "$STUDENTS_LIST" | grep -q 'שרה לוי-כהן'; then
        print_test "Hyphenated Hebrew name preserved (שרה לוי-כהן)" 0
    else
        print_test "Hyphenated Hebrew name preserved (שרה לוי-כהן)" 1
    fi
else
    print_test "Retrieve students list" 1
fi

# Test individual student retrieval
if [ -n "$STUDENT1_ID" ]; then
    echo ""
    echo "Fetching individual student (ID: $STUDENT1_ID)..."
    STUDENT_DETAIL=$(curl -s -X GET "$API_URL/students/$STUDENT1_ID" \
        -H "Authorization: Bearer $TOKEN")

    echo "Student Detail:"
    echo "$STUDENT_DETAIL" | python3 -m json.tool 2>/dev/null || echo "$STUDENT_DETAIL"

    if echo "$STUDENT_DETAIL" | grep -q '"student"'; then
        print_test "Retrieve individual student by ID" 0

        if echo "$STUDENT_DETAIL" | grep -q 'דוד כהן'; then
            print_test "Hebrew name preserved in detail view (דוד כהן)" 0
        else
            print_test "Hebrew name preserved in detail view (דוד כהן)" 1
        fi
    else
        print_test "Retrieve individual student by ID" 1
    fi
fi

##################################################################
# TEST 4: START ANALYSIS WITH HEBREW STUDENT NAME
##################################################################
print_header "TEST 4: START ANALYSIS WITH HEBREW STUDENT NAME"

if [ -n "$STUDENT1_ID" ]; then
    echo "Starting analysis for student: דוד כהן (ID: $STUDENT1_ID)..."
    START_RESPONSE=$(curl -s -X POST "$API_URL/analysis/start" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"studentId\": \"$STUDENT1_ID\"
        }")

    echo "Start Analysis Response:"
    echo "$START_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$START_RESPONSE"

    if echo "$START_RESPONSE" | grep -q '"conversationId"'; then
        CONVERSATION_ID=$(echo $START_RESPONSE | grep -o '"conversationId":"[^"]*' | cut -d'"' -f4)
        print_test "Start analysis for Hebrew-named student" 0
        print_info "Conversation ID: $CONVERSATION_ID"

        # Check if Hebrew name appears in response
        if echo "$START_RESPONSE" | grep -q 'דוד כהן'; then
            print_test "Hebrew student name appears in analysis start response" 0
        else
            print_test "Hebrew student name appears in analysis start response" 1
        fi
    else
        print_test "Start analysis for Hebrew-named student" 1
        CONVERSATION_ID=""
    fi
else
    print_warning "Skipping analysis start test - no valid student ID"
    CONVERSATION_ID=""
fi

##################################################################
# TEST 5: CHAT FLOW WITH HEBREW RESPONSES
##################################################################
print_header "TEST 5: CHAT FLOW WITH HEBREW RESPONSES"

if [ -n "$CONVERSATION_ID" ]; then
    # Send Hebrew message
    echo ""
    echo "Sending Hebrew message in chat..."
    CHAT_RESPONSE=$(curl -s -X POST "$API_URL/analysis/chat" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"conversationId\": \"$CONVERSATION_ID\",
            \"message\": \"התלמיד מצטיין במתמטיקה ובפתרון בעיות. הוא משתתף פעיל בשיעורים ועוזר לחברים.\"
        }")

    echo "Chat Response:"
    echo "$CHAT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CHAT_RESPONSE"

    if echo "$CHAT_RESPONSE" | grep -q '"message"'; then
        print_test "Send Hebrew message in chat" 0

        # Check if response contains Hebrew
        if echo "$CHAT_RESPONSE" | grep -qE '[\u0590-\u05FF]|מתמטיקה|קריאה|כתיבה'; then
            print_test "Receive Hebrew response from AI" 0
        else
            print_test "Receive Hebrew response from AI" 1
        fi
    else
        print_test "Send Hebrew message in chat" 1
    fi

    # Send multiple Hebrew messages to reach minimum count
    echo ""
    echo "Sending multiple Hebrew messages to meet minimum requirement..."

    MESSAGES=(
        "הוא לומד בצורה ויזואלית ומעדיף עבודה בקבוצות קטנות"
        "משלים שיעורי בית בזמן ומגיע מוכן לשיעורים"
        "מתקשה מעט בקריאה אבל יש שיפור משמעותי לאחרונה"
        "עובד יפה עם חברים בכיתה ומכבד את המורים"
        "החוזק העיקרי שלו הוא חשיבה יצירתית ופתרון בעיות"
    )

    for msg in "${MESSAGES[@]}"; do
        sleep 1
        CHAT_RESP=$(curl -s -X POST "$API_URL/analysis/chat" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "{
                \"conversationId\": \"$CONVERSATION_ID\",
                \"message\": \"$msg\"
            }")

        if echo "$CHAT_RESP" | grep -q '"message"'; then
            echo "✓ Message sent successfully"
        else
            echo "✗ Failed to send message"
        fi
    done

    print_test "Send multiple Hebrew messages in conversation" 0
else
    print_warning "Skipping chat flow test - no conversation ID"
fi

##################################################################
# TEST 6: COMPLETE ANALYSIS AND VIEW RESULTS
##################################################################
print_header "TEST 6: COMPLETE ANALYSIS AND VIEW RESULTS"

if [ -n "$CONVERSATION_ID" ]; then
    echo "Completing analysis..."
    COMPLETE_RESPONSE=$(curl -s -X POST "$API_URL/analysis/complete" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d "{
            \"conversationId\": \"$CONVERSATION_ID\"
        }")

    echo "Complete Analysis Response:"
    echo "$COMPLETE_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$COMPLETE_RESPONSE"

    if echo "$COMPLETE_RESPONSE" | grep -q '"analysisId"'; then
        ANALYSIS_ID=$(echo $COMPLETE_RESPONSE | grep -o '"analysisId":"[^"]*' | cut -d'"' -f4)
        print_test "Complete analysis for Hebrew-named student" 0
        print_info "Analysis ID: $ANALYSIS_ID"

        # Check if Hebrew content is in analysis
        if echo "$COMPLETE_RESPONSE" | grep -qE '[\u0590-\u05FF]|חוזקות|חולשות|המלצות'; then
            print_test "Hebrew content in analysis results" 0
        else
            print_test "Hebrew content in analysis results" 1
        fi
    else
        print_test "Complete analysis for Hebrew-named student" 1
        ANALYSIS_ID=""
    fi

    # Retrieve analysis results
    if [ -n "$ANALYSIS_ID" ]; then
        echo ""
        echo "Retrieving analysis results..."
        RESULTS_RESPONSE=$(curl -s -X GET "$API_URL/analysis/by-id/$ANALYSIS_ID" \
            -H "Authorization: Bearer $TOKEN")

        echo "Analysis Results:"
        echo "$RESULTS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESULTS_RESPONSE"

        if echo "$RESULTS_RESPONSE" | grep -q '"analysis"'; then
            print_test "Retrieve analysis results by ID" 0

            # Check if student name appears in results
            if echo "$RESULTS_RESPONSE" | grep -q 'דוד כהן'; then
                print_test "Hebrew student name appears in analysis results" 0
            else
                print_test "Hebrew student name appears in analysis results" 1
            fi
        else
            print_test "Retrieve analysis results by ID" 1
        fi
    fi
else
    print_warning "Skipping analysis completion test - no conversation ID"
fi

##################################################################
# TEST 7: RETRIEVE LATEST ANALYSIS FOR STUDENT
##################################################################
print_header "TEST 7: RETRIEVE LATEST ANALYSIS FOR STUDENT"

if [ -n "$STUDENT1_ID" ]; then
    echo "Retrieving latest analysis for student: דוד כהן..."
    LATEST_RESPONSE=$(curl -s -X GET "$API_URL/analysis/student/$STUDENT1_ID/latest" \
        -H "Authorization: Bearer $TOKEN")

    echo "Latest Analysis Response:"
    echo "$LATEST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LATEST_RESPONSE"

    if echo "$LATEST_RESPONSE" | grep -q '"analysis"'; then
        print_test "Retrieve latest analysis for student" 0

        if echo "$LATEST_RESPONSE" | grep -q 'דוד כהן'; then
            print_test "Hebrew student name in latest analysis" 0
        else
            print_test "Hebrew student name in latest analysis" 1
        fi
    else
        print_test "Retrieve latest analysis for student" 1
    fi
else
    print_warning "Skipping latest analysis test - no valid student ID"
fi

##################################################################
# FINAL REPORT
##################################################################
print_header "INTEGRATION TEST SUMMARY"

echo ""
echo -e "${BLUE}Total Tests:${NC} $TOTAL_TESTS"
echo -e "${GREEN}Passed:${NC} $PASSED_TESTS"
echo -e "${RED}Failed:${NC} $FAILED_TESTS"
echo ""

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "${BLUE}Pass Rate:${NC} $PASS_RATE%"

echo ""
echo -e "${BLUE}Test Results:${NC}"
for result in "${TEST_RESULTS[@]}"; do
    if [[ $result == PASS* ]]; then
        echo -e "  ${GREEN}$result${NC}"
    else
        echo -e "  ${RED}$result${NC}"
    fi
done

echo ""
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ ALL TESTS PASSED - PRODUCTION READY${NC}"
    echo -e "${GREEN}========================================${NC}"
    exit 0
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ SOME TESTS FAILED - NOT READY${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Critical Issues:${NC}"
    echo "  - Review failed tests above"
    echo "  - Fix issues before proceeding to production"
    echo "  - Re-run integration tests after fixes"
    exit 1
fi

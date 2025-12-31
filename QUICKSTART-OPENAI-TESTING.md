# Quick Start: Testing OpenAI Integration

This guide will help you test the OpenAI integration in 5 minutes.

## Prerequisites

- Node.js installed
- Dev server running (`npm run dev` in packages/frontend)
- Port 4001 available

## Step 1: Fix API Key (REQUIRED)

The current API key in `.env` is invalid (starts with `k-proj-` instead of `sk-proj-`).

**Option A: Get a Real OpenAI Key (Recommended)**

1. Visit https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create new key
5. Copy the key (starts with `sk-proj-` or `sk-`)
6. Update `.env`:

```bash
# Edit .env file
vim .env

# Replace this line:
OPENAI_API_KEY=k-proj-XnSkkSn4wio...

# With your real key:
OPENAI_API_KEY=sk-proj-YOUR-REAL-KEY-HERE

# Save and exit (:wq in vim)
```

**Option B: Use Template Fallback (Demo Mode)**

If you don't have an OpenAI key yet, the system will use Hebrew template questions for demo purposes.

## Step 2: Restart Dev Server

```bash
cd /Users/ronisegal/Projects/growth-engine/packages/frontend
npm run dev
```

Wait for: `ready - started server on 0.0.0.0:4001`

## Step 3: Test OpenAI Connectivity

```bash
npm run test:openai
```

**Expected with valid key:**
```
✅ SUCCESS!
Response: API connection successful!
API Details:
- Model: gpt-4-turbo-preview
- Tokens used: 42
✅ OpenAI API is configured correctly!
```

**Expected with placeholder/invalid key:**
```
❌ FAILED!
Error: OpenAI API key not configured
💡 Using placeholder is OK - real key needed for Day 2 AI work
```

## Step 4: Run Full Integration Test

```bash
./scripts/test-chat-api.sh
```

**Expected output:**
```
Testing Chat API at http://localhost:4001
================================
1. Logging in...
✓ Logged in successfully

2. Getting students...
✓ Found student ID: 550e8400-e29b-41d4-a716-446655440000

3. Starting conversation...
✓ Conversation started: [conversation-id]
First message: שלום! בואו ננתח את דוד כהן...

4. Sending chat message...
✓ Chat response received
Response preview: תודה! זה מאוד מועיל...
✓ Question count: 1

5. Sending second message...
✓ Second chat response received
✓ Question count: 2

✅ All tests passed!
```

## Step 5: Manual Test with curl

### 5a. Login
```bash
TOKEN=$(curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### 5b. Get Students
```bash
curl -s -X GET http://localhost:4001/api/students \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 5c. Start Conversation
```bash
# Replace STUDENT_ID with actual ID from step 5b
STUDENT_ID="550e8400-e29b-41d4-a716-446655440000"

CONV_RESPONSE=$(curl -s -X POST http://localhost:4001/api/analysis/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"studentId\":\"$STUDENT_ID\"}")

echo $CONV_RESPONSE | jq

CONV_ID=$(echo $CONV_RESPONSE | grep -o '"conversationId":"[^"]*' | cut -d'"' -f4)
echo "Conversation ID: $CONV_ID"
```

### 5d. Send Chat Message
```bash
curl -s -X POST http://localhost:4001/api/analysis/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"message\":\"התלמיד מצטיין במתמטיקה אבל מתקשה בקריאה\"}" | jq
```

### 5e. Send Another Message
```bash
curl -s -X POST http://localhost:4001/api/analysis/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"message\":\"הוא מאוד חברותי ועובד טוב בקבוצה\"}" | jq
```

## Expected Response Format

### Start Response
```json
{
  "conversationId": "uuid-string",
  "message": "שלום! בואו ננתח את דוד כהן. כדי ליצור ניתוח מקיף, אשאל אותך מספר שאלות על התלמיד/ה.\n\n**שאלה 1 מתוך 6:**\nכיצד היית מתאר/ת את הביצועים האקדמיים הכוללים של דוד כהן במקצועות השונים? באילו מקצועות הוא/היא מצטיין/ת, ובאילו מקצועות יש קשיים?"
}
```

### Chat Response
```json
{
  "message": "תודה! זה מאוד מועיל.\n\n**שאלה 2 מתוך 6:**\nכיצד דוד כהן בדרך כלל מתקשר/ת עם השיעורים? האם הוא/היא לומד/ת בצורה ויזואלית, שמיעתית, או קינסטטית יותר? תאר/י את ההשתתפות שלו/שלה בדיונים בכיתה ובפעילויות קבוצתיות.",
  "isComplete": false,
  "metadata": {
    "questionCount": 2,
    "messageCount": 5
  }
}
```

## Troubleshooting

### Issue: Server not responding

**Solution:**
```bash
# Check if server is running
curl http://localhost:4001

# If not, start it
cd /Users/ronisegal/Projects/growth-engine/packages/frontend
npm run dev
```

### Issue: "Unauthorized" error

**Solution:**
```bash
# Make sure JWT_SECRET is set in .env
grep JWT_SECRET .env

# Should see:
JWT_SECRET=dev-secret-key-please-change-in-production-abc123
```

### Issue: Template responses instead of AI

**Cause:** OpenAI API key not configured or invalid

**What this means:**
- System is working correctly!
- Using Hebrew template fallback
- To use real AI, add valid OpenAI key (see Step 1)

**Solution:**
```bash
# Check API key format
grep OPENAI_API_KEY .env

# Should start with sk-proj- or sk-
# If it starts with k-proj-, it's invalid - fix it
```

### Issue: "Conversation not found"

**Cause:** Server restarted (conversations are in-memory)

**Solution:**
```bash
# Start a new conversation
# Run steps 5c-5e again
```

### Issue: OpenAI rate limit

**Solution:**
```bash
# Wait 60 seconds
sleep 60

# Try again
```

## What to Expect

### With Valid OpenAI API Key

- AI asks intelligent follow-up questions
- Questions adapt to teacher's responses
- Final analysis is comprehensive and personalized
- Responses in Hebrew as specified
- Cost: ~$0.05-0.10 per analysis

### With Template Fallback (No API Key)

- System asks 6 predefined Hebrew questions
- Questions don't adapt to responses
- Still works for demo purposes
- No OpenAI costs
- Can show stakeholders the flow

## Next Steps

After testing:

1. Review API documentation:
   ```bash
   cat /Users/ronisegal/Projects/growth-engine/packages/frontend/src/app/api/analysis/README.md
   ```

2. Check implementation summary:
   ```bash
   cat /Users/ronisegal/Projects/growth-engine/GE-057-IMPLEMENTATION-COMPLETE.md
   ```

3. Review the ticket:
   ```bash
   cat /Users/ronisegal/Projects/growth-engine/tickets/GE-057-openai-integration-backend.md
   ```

4. Test the frontend chat interface (when implemented)

## Support

For issues:
1. Check logs: `console` output in terminal running dev server
2. Review error messages in API responses
3. Check `/packages/frontend/src/app/api/analysis/README.md`
4. Verify environment variables in `.env`

---

**Quick Test (All-in-One Script):**

```bash
# Save this as test-quick.sh
#!/bin/bash
cd /Users/ronisegal/Projects/growth-engine/packages/frontend

echo "1. Testing OpenAI connectivity..."
npm run test:openai

echo -e "\n2. Testing full chat flow..."
./scripts/test-chat-api.sh

echo -e "\n✅ All tests complete!"
```

---

**Last Updated:** 2025-12-31
**Sprint:** 3-Day MVP - Day 2

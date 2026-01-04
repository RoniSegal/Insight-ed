# Students API - In-Memory Implementation

This is a temporary in-memory implementation for the 3-day MVP demo. Data is stored in memory and will be lost on server restart.

## API Endpoints

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### List All Students

```bash
GET /api/students
```

**Response:**

```json
{
  "students": [
    {
      "id": "1",
      "name": "שרה כהן",
      "grade": "כיתה ג׳",
      "class": "גב׳ לוי",
      "createdAt": "2025-12-31T05:27:00.000Z"
    }
  ]
}
```

### Get Single Student

```bash
GET /api/students/:id
```

**Response:**

```json
{
  "student": {
    "id": "1",
    "name": "שרה כהן",
    "grade": "כיתה ג׳",
    "class": "גב׳ לוי",
    "createdAt": "2025-12-31T05:27:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "error": "Student not found"
}
```

### Create Student

```bash
POST /api/students
Content-Type: application/json

{
  "name": "יוסף אברהמי",
  "grade": "כיתה ו׳",
  "class": "מר כהן"  // optional
}
```

**Response (201):**

```json
{
  "student": {
    "id": "6",
    "name": "יוסף אברהמי",
    "grade": "כיתה ו׳",
    "class": "מר כהן",
    "createdAt": "2025-12-31T05:30:00.000Z"
  }
}
```

**Validation Errors (400):**

```json
{
  "error": "Name is required"
}
```

```json
{
  "error": "Grade is required"
}
```

### Update Student

```bash
PUT /api/students/:id
Content-Type: application/json

{
  "grade": "כיתה ז׳"  // any field is optional
}
```

**Response:**

```json
{
  "student": {
    "id": "6",
    "name": "יוסף אברהמי",
    "grade": "כיתה ז׳",
    "class": "מר כהן",
    "createdAt": "2025-12-31T05:30:00.000Z"
  }
}
```

### Delete Student

```bash
DELETE /api/students/:id
```

**Response:**

```json
{
  "success": true
}
```

**Error Response (404):**

```json
{
  "error": "Student not found"
}
```

## Authentication

All endpoints require a valid JWT token. Get a token by logging in:

```bash
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "Test123!"
  }'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "teacher@example.com",
    "role": "teacher",
    "firstName": "Demo",
    "lastName": "Teacher"
  }
}
```

## Error Responses

### 401 Unauthorized

Missing or invalid authentication token:

```json
{
  "error": "Unauthorized - Missing or invalid authorization header"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

### 400 Bad Request

Invalid input data:

```json
{
  "error": "Name is required"
}
```

### 404 Not Found

Student not found:

```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error

Server error:

```json
{
  "error": "Internal server error"
}
```

## Seed Data

The system initializes with 5 students:

1. שרה כהן - כיתה ג׳ - גב׳ לוי
2. מיכאל דוד - כיתה ג׳ - גב׳ לוי
3. נועה אברהם - כיתה ד׳ - מר רוזנברג
4. דניאל יוסף - כיתה ה׳ - גב׳ שפירא
5. תמר לוי - כיתה ד׳ - מר רוזנברג

## Testing

Run the test script to verify all endpoints:

```bash
./packages/frontend/scripts/test-students-api.sh
```

Or test manually with curl:

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}' \
  | jq -r '.accessToken')

# List students
curl -X GET http://localhost:4001/api/students \
  -H "Authorization: Bearer $TOKEN" | jq

# Create student
curl -X POST http://localhost:4001/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "אליה מזרחי",
    "grade": "כיתה ג׳",
    "class": "גב׳ לוי"
  }' | jq

# Get specific student
curl -X GET http://localhost:4001/api/students/1 \
  -H "Authorization: Bearer $TOKEN" | jq

# Update student
curl -X PUT http://localhost:4001/api/students/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"grade": "כיתה ד׳"}' | jq

# Delete student
curl -X DELETE http://localhost:4001/api/students/6 \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Implementation Details

- **Storage:** In-memory Map (singleton instance)
- **ID Generation:** Auto-incrementing integers converted to strings
- **Authentication:** JWT validation using existing auth middleware
- **Validation:** Server-side validation for required fields
- **Data Loss:** All data is lost on server restart (acceptable for 3-day MVP)

## Files

- `/packages/frontend/src/app/api/lib/studentsStore.ts` - In-memory storage singleton
- `/packages/frontend/src/app/api/students/route.ts` - List and create endpoints
- `/packages/frontend/src/app/api/students/[id]/route.ts` - Get, update, delete endpoints
- `/packages/frontend/scripts/test-students-api.sh` - Test script

## Production Considerations

This implementation is NOT suitable for production. For production:

1. Replace in-memory storage with a real database (PostgreSQL recommended)
2. Add data isolation (teachers should only see their students)
3. Add pagination for large datasets
4. Add search and filtering capabilities
5. Add audit logging
6. Add rate limiting
7. Add proper validation with a validation library
8. Add unit and integration tests

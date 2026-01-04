# Growth Engine - API Contract Specification

**Version:** 1.0 (MVP)
**Last Updated:** 2025-12-30
**Base URL:** `/api/v1`
**Protocol:** REST over HTTPS
**Format:** JSON

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Pagination & Filtering](#pagination--filtering)
5. [Endpoints](#endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [User Management Endpoints](#user-management-endpoints)
   - [Student Management Endpoints](#student-management-endpoints)
   - [Class Management Endpoints](#class-management-endpoints)
   - [Analysis Endpoints](#analysis-endpoints)
   - [Dashboard & Analytics Endpoints](#dashboard--analytics-endpoints)
6. [Webhooks & Events](#webhooks--events)
7. [Rate Limiting](#rate-limiting)
8. [Versioning Strategy](#versioning-strategy)

---

## API Overview

### Design Principles

1. **RESTful:** Resource-based URLs, HTTP verbs for actions
2. **Consistent:** Standard response format across all endpoints
3. **Secure:** JWT authentication, RBAC authorization
4. **Documented:** OpenAPI/Swagger auto-generated documentation
5. **Versioned:** `/api/v1/...` prefix for future compatibility
6. **Idempotent:** PUT, PATCH, DELETE operations are idempotent

### Base URLs

| Environment | Base URL                                      |
| ----------- | --------------------------------------------- |
| Local Dev   | `http://localhost:4000/api/v1`                |
| Staging     | `https://staging-api.growthengine.app/api/v1` |
| Production  | `https://api.growthengine.app/api/v1`         |

### HTTP Methods

| Method | Usage                   | Idempotent |
| ------ | ----------------------- | ---------- |
| GET    | Retrieve resources      | Yes        |
| POST   | Create new resources    | No         |
| PUT    | Update entire resource  | Yes        |
| PATCH  | Update partial resource | Yes        |
| DELETE | Delete resources        | Yes        |

### Standard Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Resource data or array of resources
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "value": "invalid-email"
      }
    ]
  }
}
```

---

## Authentication

### JWT Token Authentication

**Authentication Flow:**

1. User logs in via `/api/v1/auth/login` or `/api/v1/auth/sso/google`
2. Backend returns JWT access token (15 min) + refresh token (7 days) in HTTP-only cookies
3. Frontend includes cookies in all subsequent requests
4. Backend validates JWT, extracts user context
5. If access token expires, frontend calls `/api/v1/auth/refresh` automatically

**Token Payload:**

```json
{
  "sub": "user-uuid",
  "email": "teacher@school.com",
  "role": "TEACHER",
  "schoolId": "school-uuid",
  "iat": 1735567200,
  "exp": 1735568100
}
```

### Authorization Headers

```http
GET /api/v1/students
Host: api.growthengine.app
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Protected Endpoints

All endpoints except `/auth/*` and `/health` require authentication.

**Authorization Middleware:**

- Validates JWT signature
- Checks token expiration
- Extracts user context (ID, role, school)
- Enforces role-based access control (RBAC)

---

## Error Handling

### HTTP Status Codes

| Status Code               | Meaning             | Usage                             |
| ------------------------- | ------------------- | --------------------------------- |
| 200 OK                    | Success             | GET, PATCH, DELETE successful     |
| 201 Created               | Resource created    | POST successful                   |
| 204 No Content            | Success, no body    | DELETE successful (alternative)   |
| 400 Bad Request           | Invalid input       | Validation errors                 |
| 401 Unauthorized          | Not authenticated   | Missing/invalid token             |
| 403 Forbidden             | Not authorized      | Insufficient permissions          |
| 404 Not Found             | Resource not found  | Invalid ID or deleted resource    |
| 409 Conflict              | Duplicate resource  | Unique constraint violation       |
| 422 Unprocessable Entity  | Validation failed   | Business logic validation errors  |
| 429 Too Many Requests     | Rate limit exceeded | Too many API calls                |
| 500 Internal Server Error | Server error        | Unexpected errors                 |
| 503 Service Unavailable   | Service down        | Maintenance or OpenAI API failure |

### Error Codes

| Error Code            | HTTP Status | Description              |
| --------------------- | ----------- | ------------------------ |
| `VALIDATION_ERROR`    | 400         | Input validation failed  |
| `UNAUTHORIZED`        | 401         | Not authenticated        |
| `FORBIDDEN`           | 403         | Insufficient permissions |
| `NOT_FOUND`           | 404         | Resource not found       |
| `DUPLICATE_RESOURCE`  | 409         | Resource already exists  |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests        |
| `OPENAI_API_ERROR`    | 503         | OpenAI API unavailable   |
| `INTERNAL_ERROR`      | 500         | Unexpected server error  |

### Validation Error Example

**Request:**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "123",
  "firstName": "",
  "role": "INVALID_ROLE"
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "שגיאת אימות קלט",
    "details": [
      {
        "field": "email",
        "message": "כתובת דוא\"ל לא תקינה",
        "value": "invalid-email"
      },
      {
        "field": "password",
        "message": "הסיסמה חייבת להכיל לפחות 8 תווים",
        "value": "***"
      },
      {
        "field": "firstName",
        "message": "שם פרטי הוא שדה חובה",
        "value": ""
      },
      {
        "field": "role",
        "message": "התפקיד חייב להיות אחד מהבאים: מורה, מנהל, מנהל מערכת",
        "value": "INVALID_ROLE"
      }
    ]
  }
}
```

**Note:** All error messages are returned in Hebrew (primary language). Field names remain in English for API consistency.

---

### Hebrew Error Messages Reference

All user-facing error messages are in Hebrew. Below is a comprehensive mapping of common error messages:

**HTTP Status Code Errors:**

| HTTP Status               | English               | Hebrew (עברית)   |
| ------------------------- | --------------------- | ---------------- |
| 400 Bad Request           | Bad Request           | בקשה שגויה       |
| 401 Unauthorized          | Unauthorized          | נדרשת הזדהות     |
| 403 Forbidden             | Forbidden             | אין הרשאה        |
| 404 Not Found             | Not Found             | לא נמצא          |
| 409 Conflict              | Already Exists        | כבר קיים         |
| 422 Unprocessable Entity  | Validation Failed     | אימות נכשל       |
| 429 Too Many Requests     | Too Many Requests     | יותר מדי בקשות   |
| 500 Internal Server Error | Internal Server Error | שגיאת שרת        |
| 503 Service Unavailable   | Service Unavailable   | השירות אינו זמין |

**Validation Error Messages:**

| Field      | Validation         | Hebrew Message                                  |
| ---------- | ------------------ | ----------------------------------------------- |
| email      | Invalid format     | כתובת דוא"ל לא תקינה                            |
| email      | Required           | דוא"ל הוא שדה חובה                              |
| password   | Too short          | הסיסמה חייבת להכיל לפחות 8 תווים                |
| password   | Missing uppercase  | הסיסמה חייבת להכיל לפחות אות גדולה אחת          |
| password   | Missing lowercase  | הסיסמה חייבת להכיל לפחות אות קטנה אחת           |
| password   | Missing number     | הסיסמה חייבת להכיל לפחות ספרה אחת               |
| firstName  | Required           | שם פרטי הוא שדה חובה                            |
| firstName  | Invalid characters | שם פרטי חייב להכיל רק אותיות עבריות או אנגליות  |
| lastName   | Required           | שם משפחה הוא שדה חובה                           |
| lastName   | Invalid characters | שם משפחה חייב להכיל רק אותיות עבריות או אנגליות |
| gradeLevel | Required           | כיתה היא שדה חובה                               |
| gradeLevel | Invalid value      | כיתה לא תקינה                                   |
| studentId  | Duplicate          | מספר תלמיד כבר קיים במערכת                      |
| role       | Invalid            | תפקיד לא תקין                                   |

**Authentication Error Messages:**

| Scenario            | Hebrew Message                    |
| ------------------- | --------------------------------- |
| Invalid credentials | דוא"ל או סיסמה שגויים             |
| Account locked      | החשבון נחסם. נסה שוב בעוד 15 דקות |
| Session expired     | ההפעלה פגה. נא להתחבר מחדש        |
| Email not verified  | נא לאמת את כתובת הדוא"ל           |
| MFA required        | נדרשת אימות דו-שלבי               |
| Invalid MFA code    | קוד אימות שגוי                    |

**Business Logic Error Messages:**

| Scenario                 | Hebrew Message                                  |
| ------------------------ | ----------------------------------------------- |
| Student not found        | תלמיד לא נמצא                                   |
| Student already analyzed | התלמיד כבר נותח היום                            |
| Analysis in progress     | ניתוח בתהליך. נא להמתין                         |
| Insufficient permissions | אין לך הרשאה לבצע פעולה זו                      |
| School quota exceeded    | מכסת בית הספר מלאה                              |
| OpenAI API error         | שירות הניתוח אינו זמין כרגע. נסה שוב מאוחר יותר |

**Example Complete Error Response (Hebrew):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "שגיאת אימות קלט",
    "details": [
      {
        "field": "firstName",
        "message": "שם פרטי הוא שדה חובה",
        "value": ""
      },
      {
        "field": "lastName",
        "message": "שם משפחה חייב להכיל רק אותיות עבריות או אנגליות",
        "value": "כהן123"
      },
      {
        "field": "email",
        "message": "כתובת דוא\"ל לא תקינה",
        "value": "not-an-email"
      }
    ],
    "timestamp": "2025-12-30T14:30:00Z",
    "path": "/api/v1/students"
  }
}
```

---

## Pagination & Filtering

### Pagination Parameters

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Field to sort by (default: `createdAt`)
- `sortOrder`: `asc` or `desc` (default: `desc`)

**Example:**

```http
GET /api/v1/students?page=2&limit=50&sortBy=lastName&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": [
    // Array of students
  ],
  "meta": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

### Filtering

**Query Parameters:**

- Exact match: `?gradeLevel=10`
- Search: `?search=John`
- Multiple values: `?gradeLevel=10,11,12`
- Date range: `?createdAfter=2025-01-01&createdBefore=2025-12-31`

**Example:**

```http
GET /api/v1/students?gradeLevel=10&search=Smith&isActive=true
```

---

## Endpoints

### Authentication Endpoints

#### POST `/api/v1/auth/register`

Register a new user account.

**Request:**

```json
{
  "email": "teacher@school.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "TEACHER",
  "schoolId": "school-uuid"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "teacher@school.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "TEACHER",
      "schoolId": "school-uuid",
      "createdAt": "2025-12-30T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here"
  }
}
```

**Validation:**

- Email must be valid and unique
- Password must be ≥8 chars, contain upper/lower/number
- Role must be valid enum value
- School must exist

---

#### POST `/api/v1/auth/login`

Login with email and password.

**Request:**

```json
{
  "email": "teacher@school.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "teacher@school.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "TEACHER",
      "schoolId": "school-uuid"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

---

#### POST `/api/v1/auth/logout`

Logout and invalidate refresh token.

**Request:** (Empty body, requires authentication)

**Response (204 No Content)**

---

#### POST `/api/v1/auth/refresh`

Refresh access token using refresh token.

**Request:**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token"
  }
}
```

---

#### GET `/api/v1/auth/sso/google`

Initiate Google OAuth flow.

**Response:** Redirect to Google OAuth consent screen

---

#### GET `/api/v1/auth/sso/google/callback`

Google OAuth callback endpoint.

**Query Parameters:**

- `code`: Authorization code from Google
- `state`: CSRF protection token

**Response:** Redirect to frontend with tokens in cookies

---

#### GET `/api/v1/auth/sso/microsoft`

Initiate Microsoft OAuth flow.

**Response:** Redirect to Microsoft OAuth consent screen

---

#### GET `/api/v1/auth/sso/microsoft/callback`

Microsoft OAuth callback endpoint.

**Response:** Redirect to frontend with tokens in cookies

---

#### POST `/api/v1/auth/forgot-password`

Request password reset email.

**Request:**

```json
{
  "email": "teacher@school.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent if account exists"
  }
}
```

---

#### POST `/api/v1/auth/reset-password`

Reset password using reset token.

**Request:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Password reset successful"
  }
}
```

---

### User Management Endpoints

#### GET `/api/v1/users/me`

Get current authenticated user profile.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "teacher@school.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TEACHER",
    "schoolId": "school-uuid",
    "school": {
      "id": "school-uuid",
      "name": "Tel Aviv High School"
    },
    "createdAt": "2025-12-30T10:00:00Z",
    "lastLoginAt": "2025-12-30T12:00:00Z"
  }
}
```

---

#### PATCH `/api/v1/users/me`

Update current user profile.

**Request:**

```json
{
  "firstName": "Jane",
  "phone": "+972-50-123-4567",
  "settings": {
    "language": "he",
    "notifications": true
  }
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+972-50-123-4567",
    "settings": {
      "language": "he",
      "notifications": true
    }
  }
}
```

---

#### GET `/api/v1/users`

List all users (Admins only).

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `role`: Filter by role
- `schoolId`: Filter by school
- `search`: Search by name or email

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid-1",
      "email": "teacher1@school.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "TEACHER",
      "schoolId": "school-uuid",
      "isActive": true,
      "createdAt": "2025-12-30T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

**Authorization:** ADMIN only

---

#### POST `/api/v1/users`

Create a new user (Admins only).

**Request:**

```json
{
  "email": "newteacher@school.com",
  "password": "TempPassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "TEACHER",
  "schoolId": "school-uuid"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "new-user-uuid",
    "email": "newteacher@school.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "TEACHER",
    "schoolId": "school-uuid",
    "createdAt": "2025-12-30T14:00:00Z"
  }
}
```

**Authorization:** ADMIN only

---

### Student Management Endpoints

#### GET `/api/v1/students`

List students (filtered by user role).

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `gradeLevel`: Filter by grade
- `classId`: Filter by class
- `search`: Search by name
- `isActive`: Filter active/inactive

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "student-uuid-1",
      "firstName": "David",
      "lastName": "Cohen",
      "studentId": "S12345",
      "gradeLevel": "10",
      "schoolId": "school-uuid",
      "isActive": true,
      "enrolledClasses": [
        {
          "id": "class-uuid-1",
          "name": "Math Period 3"
        }
      ],
      "analysisCount": 3,
      "lastAnalysisDate": "2025-12-15T10:00:00Z",
      "createdAt": "2025-09-01T08:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Authorization:**

- TEACHER: Only students in their classes
- PRINCIPAL: All students in their school
- ADMIN: All students

---

#### GET `/api/v1/students/:id`

Get single student details.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "student-uuid",
    "firstName": "David",
    "lastName": "Cohen",
    "studentId": "S12345",
    "gradeLevel": "10",
    "schoolId": "school-uuid",
    "school": {
      "id": "school-uuid",
      "name": "Tel Aviv High School"
    },
    "enrolledClasses": [
      {
        "id": "class-uuid-1",
        "name": "Math Period 3",
        "subject": "Math",
        "teacher": {
          "id": "teacher-uuid",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "analyses": [
      {
        "id": "analysis-uuid-1",
        "teacherId": "teacher-uuid",
        "status": "COMPLETED",
        "createdAt": "2025-12-15T10:00:00Z"
      }
    ],
    "isActive": true,
    "createdAt": "2025-09-01T08:00:00Z",
    "updatedAt": "2025-12-30T10:00:00Z"
  }
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Student not found"
  }
}
```

---

#### POST `/api/v1/students`

Create a new student.

**Request (Hebrew Name Example):**

```json
{
  "firstName": "דוד",
  "lastName": "כהן",
  "studentId": "S12345",
  "gradeLevel": "10",
  "schoolId": "school-uuid",
  "dateOfBirth": "2010-05-15",
  "gender": "male"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "new-student-uuid",
    "firstName": "דוד",
    "lastName": "כהן",
    "studentId": "S12345",
    "gradeLevel": "10",
    "schoolId": "school-uuid",
    "isActive": true,
    "createdAt": "2025-12-30T14:00:00Z"
  }
}
```

**Request (Mixed Hebrew/English Name Example):**

```json
{
  "firstName": "David",
  "lastName": "כהן",
  "studentId": "S12346",
  "gradeLevel": "10",
  "schoolId": "school-uuid"
}
```

**Validation Rules:**

- `firstName`, `lastName`: 2-50 characters
- Allowed characters: Hebrew (א-ת), English (A-Z, a-z), spaces, hyphens, apostrophes
- Unicode normalization (NFC) applied automatically
- Regex pattern: `/^[\u0590-\u05FFa-zA-Z\s'-]+$/`

**Validation Error Example (Invalid Hebrew Name):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "שגיאת אימות קלט",
    "details": [
      {
        "field": "firstName",
        "message": "שם פרטי חייב להכיל רק אותיות עבריות או אנגליות, רווחים, מקפים או גרשיים",
        "value": "דוד123"
      }
    ]
  }
}
```

**Authorization:** TEACHER, PRINCIPAL, ADMIN

---

#### PATCH `/api/v1/students/:id`

Update student information.

**Request:**

```json
{
  "gradeLevel": "11",
  "notes": "Moved to 11th grade"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "student-uuid",
    "gradeLevel": "11",
    "notes": "Moved to 11th grade",
    "updatedAt": "2025-12-30T14:30:00Z"
  }
}
```

---

#### DELETE `/api/v1/students/:id`

Soft delete a student.

**Response (204 No Content)**

**Note:** This performs a soft delete (sets `deletedAt` timestamp)

---

#### POST `/api/v1/students/import`

Bulk import students from CSV.

**Request (multipart/form-data):**

```
POST /api/v1/students/import
Content-Type: multipart/form-data

file: students.csv
```

**CSV Format:**

```csv
firstName,lastName,studentId,gradeLevel,dateOfBirth,gender
David,Cohen,S12345,10,2010-05-15,male
Sarah,Levi,S12346,10,2010-06-20,female
```

**Response (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "jobId": "import-job-uuid",
    "status": "PROCESSING",
    "message": "Import job queued. Use GET /api/v1/students/import/:jobId to check status."
  }
}
```

---

#### GET `/api/v1/students/import/:jobId`

Check CSV import job status.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "jobId": "import-job-uuid",
    "status": "COMPLETED",
    "totalRows": 150,
    "successCount": 148,
    "errorCount": 2,
    "errors": [
      {
        "row": 5,
        "error": "Duplicate student ID: S12345"
      },
      {
        "row": 12,
        "error": "Invalid grade level: 'invalid'"
      }
    ],
    "completedAt": "2025-12-30T14:35:00Z"
  }
}
```

---

### Class Management Endpoints

#### GET `/api/v1/classes`

List classes (filtered by user role).

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `teacherId`: Filter by teacher
- `gradeLevel`: Filter by grade
- `academicYear`: Filter by academic year

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "class-uuid-1",
      "name": "Math Period 3",
      "subject": "Math",
      "gradeLevel": "10",
      "section": "A",
      "teacherId": "teacher-uuid",
      "teacher": {
        "id": "teacher-uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "studentCount": 25,
      "academicYear": "2025-2026",
      "isActive": true,
      "createdAt": "2025-09-01T08:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

#### POST `/api/v1/classes`

Create a new class.

**Request:**

```json
{
  "name": "Math Period 3",
  "subject": "Math",
  "gradeLevel": "10",
  "section": "A",
  "teacherId": "teacher-uuid",
  "schoolId": "school-uuid",
  "academicYear": "2025-2026"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "new-class-uuid",
    "name": "Math Period 3",
    "subject": "Math",
    "gradeLevel": "10",
    "teacherId": "teacher-uuid",
    "schoolId": "school-uuid",
    "isActive": true,
    "createdAt": "2025-12-30T14:00:00Z"
  }
}
```

---

#### POST `/api/v1/classes/:id/enroll`

Enroll students in a class.

**Request:**

```json
{
  "studentIds": ["student-uuid-1", "student-uuid-2", "student-uuid-3"]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "enrolled": 3,
    "skipped": 0,
    "errors": []
  }
}
```

---

### Analysis Endpoints

#### POST `/api/v1/analyses`

Start a new student analysis session.

**Request:**

```json
{
  "studentId": "student-uuid"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "analysis-uuid",
    "studentId": "student-uuid",
    "teacherId": "teacher-uuid",
    "status": "IN_PROGRESS",
    "conversations": [
      {
        "id": "conversation-uuid-1",
        "role": "ASSISTANT",
        "content": "Can you describe David Cohen's overall academic performance in your class?",
        "sequenceNumber": 1,
        "createdAt": "2025-12-30T14:00:00Z"
      }
    ],
    "createdAt": "2025-12-30T14:00:00Z"
  }
}
```

---

#### POST `/api/v1/analyses/:id/messages`

Continue analysis conversation (teacher responds).

**Request:**

```json
{
  "message": "David is a strong student in math. He consistently scores above 90% on tests and shows excellent problem-solving skills."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conversation-uuid-2",
      "role": "USER",
      "content": "David is a strong student in math...",
      "sequenceNumber": 2,
      "createdAt": "2025-12-30T14:01:00Z"
    },
    "nextQuestion": {
      "id": "conversation-uuid-3",
      "role": "ASSISTANT",
      "content": "That's great to hear! What specific areas of math does David excel in?",
      "sequenceNumber": 3,
      "createdAt": "2025-12-30T14:01:05Z"
    },
    "isComplete": false
  }
}
```

**When Analysis Complete:**

```json
{
  "success": true,
  "data": {
    "conversation": { ... },
    "isComplete": true,
    "results": {
      "strengths": [
        "Excellent problem-solving skills",
        "Strong mathematical reasoning",
        "Consistent high performance"
      ],
      "weaknesses": [
        "Could benefit from more peer collaboration"
      ],
      "recommendations": [
        "Consider advanced math enrichment",
        "Pair with struggling students for peer tutoring"
      ],
      "learningStyle": "Visual and analytical learner",
      "confidence": 0.92
    }
  }
}
```

---

#### GET `/api/v1/analyses/:id`

Get analysis details.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "analysis-uuid",
    "studentId": "student-uuid",
    "student": {
      "id": "student-uuid",
      "firstName": "David",
      "lastName": "Cohen"
    },
    "teacherId": "teacher-uuid",
    "teacher": {
      "id": "teacher-uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "status": "COMPLETED",
    "results": {
      "strengths": [...],
      "weaknesses": [...],
      "recommendations": [...],
      "learningStyle": "Visual learner"
    },
    "teacherEdits": null,
    "privateNotes": "Recommend for honors math next year",
    "sessionDuration": 420,
    "totalTokens": 1500,
    "estimatedCost": 0.03,
    "flaggedForReview": false,
    "conversations": [
      {
        "id": "conversation-uuid-1",
        "role": "ASSISTANT",
        "content": "Can you describe David's performance?",
        "sequenceNumber": 1,
        "createdAt": "2025-12-30T14:00:00Z"
      },
      {
        "id": "conversation-uuid-2",
        "role": "USER",
        "content": "David is a strong student...",
        "sequenceNumber": 2,
        "createdAt": "2025-12-30T14:01:00Z"
      }
    ],
    "createdAt": "2025-12-30T14:00:00Z",
    "updatedAt": "2025-12-30T14:07:00Z"
  }
}
```

---

#### PATCH `/api/v1/analyses/:id`

Update analysis (edit results, add notes).

**Request:**

```json
{
  "teacherEdits": {
    "strengths": [
      "Excellent problem-solving skills",
      "Strong mathematical reasoning",
      "Leadership in group work"
    ]
  },
  "privateNotes": "Consider for honors math and peer tutoring role",
  "flaggedForReview": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "analysis-uuid",
    "teacherEdits": { ... },
    "privateNotes": "Consider for honors math...",
    "flaggedForReview": true,
    "updatedAt": "2025-12-30T15:00:00Z"
  }
}
```

---

#### GET `/api/v1/analyses/:id/export`

Export analysis as PDF.

**Response:** PDF file download

**Headers:**

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="analysis-david-cohen-2025-12-30.pdf"
```

---

#### GET `/api/v1/analyses`

List analyses (filtered by user role).

**Query Parameters:**

- `page`, `limit`, `sortBy`, `sortOrder`
- `studentId`: Filter by student
- `teacherId`: Filter by teacher
- `status`: Filter by status
- `flaggedForReview`: Filter flagged analyses
- `createdAfter`, `createdBefore`: Date range

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "analysis-uuid-1",
      "studentId": "student-uuid",
      "student": {
        "firstName": "David",
        "lastName": "Cohen"
      },
      "teacherId": "teacher-uuid",
      "status": "COMPLETED",
      "flaggedForReview": false,
      "createdAt": "2025-12-30T14:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### Dashboard & Analytics Endpoints

#### GET `/api/v1/dashboard/teacher`

Teacher dashboard data.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalStudents": 125,
      "analyzedStudents": 98,
      "completionRate": 0.784,
      "flaggedStudents": 5,
      "recentAnalyses": 12
    },
    "studentsByClass": [
      {
        "classId": "class-uuid-1",
        "className": "Math Period 3",
        "totalStudents": 28,
        "analyzedStudents": 25,
        "completionRate": 0.893
      }
    ],
    "flaggedStudents": [
      {
        "id": "student-uuid-1",
        "firstName": "David",
        "lastName": "Cohen",
        "latestAnalysis": {
          "id": "analysis-uuid",
          "createdAt": "2025-12-15T10:00:00Z"
        }
      }
    ],
    "trends": {
      "commonStrengths": [
        { "strength": "Problem-solving skills", "count": 45 },
        { "strength": "Class participation", "count": 38 }
      ],
      "commonWeaknesses": [
        { "weakness": "Reading comprehension", "count": 22 },
        { "weakness": "Time management", "count": 18 }
      ]
    }
  }
}
```

**Authorization:** TEACHER only

---

#### GET `/api/v1/dashboard/principal`

Principal dashboard data.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalStudents": 850,
      "analyzedStudents": 625,
      "completionRate": 0.735,
      "flaggedStudents": 42,
      "totalTeachers": 45,
      "activeTeachers": 38
    },
    "studentsByGrade": [
      {
        "gradeLevel": "9",
        "totalStudents": 220,
        "analyzedStudents": 165,
        "completionRate": 0.75
      },
      {
        "gradeLevel": "10",
        "totalStudents": 215,
        "analyzedStudents": 172,
        "completionRate": 0.8
      }
    ],
    "teacherActivity": [
      {
        "teacherId": "teacher-uuid-1",
        "teacherName": "John Doe",
        "totalStudents": 125,
        "analyzedStudents": 98,
        "completionRate": 0.784,
        "lastAnalysis": "2025-12-30T10:00:00Z"
      }
    ],
    "schoolTrends": {
      "topStrengths": [
        { "strength": "Mathematical reasoning", "count": 320 },
        { "strength": "Creative thinking", "count": 285 }
      ],
      "topChallenges": [
        { "challenge": "Reading comprehension", "count": 180 },
        { "challenge": "Self-regulation", "count": 145 }
      ]
    },
    "flaggedStudents": [
      {
        "id": "student-uuid",
        "firstName": "David",
        "lastName": "Cohen",
        "gradeLevel": "10",
        "flagCount": 2,
        "latestFlag": "2025-12-28T14:00:00Z"
      }
    ]
  }
}
```

**Authorization:** PRINCIPAL only

---

#### GET `/api/v1/analytics/trends`

Trends analysis over time.

**Query Parameters:**

- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `gradeLevel`: Filter by grade
- `teacherId`: Filter by teacher (for principals)
- `groupBy`: `day`, `week`, `month` (default: `week`)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "analysisVolume": [
      {
        "period": "2025-12-01",
        "count": 45
      },
      {
        "period": "2025-12-08",
        "count": 62
      }
    ],
    "completionRate": [
      {
        "period": "2025-12-01",
        "rate": 0.72
      },
      {
        "period": "2025-12-08",
        "rate": 0.78
      }
    ],
    "strengthTrends": {
      "Problem-solving skills": [
        { "period": "2025-12-01", "count": 12 },
        { "period": "2025-12-08", "count": 18 }
      ]
    }
  }
}
```

---

#### GET `/api/v1/analytics/reports/export`

Export analytics report as CSV.

**Query Parameters:**

- `type`: `student-summary`, `teacher-activity`, `school-trends`
- `startDate`, `endDate`: Date range

**Response:** CSV file download

---

## Rate Limiting

### Rate Limits

| Endpoint Pattern          | Limit        | Window   |
| ------------------------- | ------------ | -------- |
| `/api/v1/auth/login`      | 5 requests   | 1 minute |
| `/api/v1/auth/register`   | 3 requests   | 1 hour   |
| `/api/v1/analyses` (POST) | 10 requests  | 1 hour   |
| All other endpoints       | 100 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1735567800
```

### Rate Limit Exceeded Response

**Response (429 Too Many Requests):**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 45 seconds.",
    "retryAfter": 45
  }
}
```

---

## Webhooks & Events

### Future Enhancement

Webhooks for real-time notifications (post-MVP):

- Analysis completed
- Student flagged for review
- CSV import completed
- Daily/weekly digest

**Webhook Payload Example:**

```json
{
  "event": "analysis.completed",
  "timestamp": "2025-12-30T14:07:00Z",
  "data": {
    "analysisId": "analysis-uuid",
    "studentId": "student-uuid",
    "teacherId": "teacher-uuid",
    "status": "COMPLETED"
  }
}
```

---

## Versioning Strategy

### API Versioning

**Current Version:** v1 (`/api/v1/...`)

**Versioning Approach:**

- Major version in URL path (`/api/v1`, `/api/v2`)
- Breaking changes require new version
- Non-breaking changes added to current version
- Deprecation notice period: 6 months minimum

### Deprecation Process

1. **Announce deprecation** in response headers
2. **Document alternative** in API docs
3. **Maintain for 6 months** minimum
4. **Remove after notice period**

**Deprecated Endpoint Header:**

```http
X-API-Deprecated: true
X-API-Deprecation-Date: 2026-06-30
X-API-Alternative: /api/v2/students
```

---

## OpenAPI / Swagger Documentation

**Swagger UI:** Available at `/api/docs`

Auto-generated from NestJS decorators using `@nestjs/swagger`.

**Example Decorator:**

```typescript
@ApiTags('students')
@ApiOperation({ summary: 'Create a new student' })
@ApiResponse({ status: 201, description: 'Student created successfully', type: StudentDto })
@ApiResponse({ status: 400, description: 'Validation error' })
@Post()
async createStudent(@Body() createStudentDto: CreateStudentDto) {
  // ...
}
```

---

## Document Version History

- v1.0 (2025-12-30): Initial API contract design for MVP

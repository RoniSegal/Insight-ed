# Authentication API

Simple JWT-based authentication system for the 3-day MVP demo.

## Endpoints

### POST /api/auth/login

Authenticate user and receive JWT token.

**Request:**

```json
{
  "email": "teacher@example.com",
  "password": "Test123!"
}
```

**Response (200):**

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

**Error Responses:**

- 400: Missing email or password
- 401: Invalid credentials
- 500: Internal server error

---

### GET /api/auth/me

Get current authenticated user information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "id": "1",
  "email": "teacher@example.com",
  "role": "teacher",
  "firstName": "Demo",
  "lastName": "Teacher"
}
```

**Error Responses:**

- 401: Missing or invalid token
- 500: Internal server error

---

### POST /api/auth/logout

Logout current user (client-side token removal).

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Hardcoded User

For the 3-day MVP demo, there is one hardcoded teacher account:

- **Email:** teacher@example.com
- **Password:** Test123!
- **Role:** teacher
- **Name:** Demo Teacher

## Testing

Run the test script:

```bash
cd packages/frontend
./scripts/test-auth-api.sh
```

Or test manually:

```bash
# Login
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"Test123!"}'

# Get current user (replace TOKEN with actual token from login)
curl -X GET http://localhost:4001/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Logout
curl -X POST http://localhost:4001/api/auth/logout
```

## Environment Variables

Required in `.env.local`:

```env
JWT_SECRET=dev-secret-key-for-3day-mvp-demo
```

## Security Notes

- This is a demo implementation with a hardcoded user
- Password is stored in plain text (NOT production-ready)
- No rate limiting or brute force protection
- Single 24-hour JWT token (no refresh tokens)
- Should be replaced with proper authentication system for production

## File Structure

```
src/app/api/
├── auth/
│   ├── login/
│   │   └── route.ts       # Login endpoint
│   ├── me/
│   │   └── route.ts       # Get current user endpoint
│   ├── logout/
│   │   └── route.ts       # Logout endpoint
│   └── README.md          # This file
└── lib/
    └── auth.ts            # JWT utilities and hardcoded user
```

## Implementation Details

- Uses Next.js 14 API routes
- JWT tokens generated with `jsonwebtoken` library
- Token expiration: 24 hours
- Token payload includes: userId, email, role
- No database required (hardcoded user)

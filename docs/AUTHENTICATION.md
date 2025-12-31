# Authentication & Authorization Architecture

**Version:** 1.0
**Last Updated:** 2025-12-30
**Status:** Approved
**Owner:** Architect

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Strategy](#authentication-strategy)
3. [Authentication Flows](#authentication-flows)
4. [Authorization Model (RBAC)](#authorization-model-rbac)
5. [Security Design](#security-design)
6. [SSO Integration](#sso-integration)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Implementation Guidance](#implementation-guidance)

---

## Overview

### Scope

This document defines the authentication and authorization architecture for Growth Engine, covering:

- **Authentication**: How users prove their identity (email/password, SSO)
- **Authorization**: What authenticated users are allowed to do (RBAC)
- **Session Management**: How user sessions are created, maintained, and terminated
- **Security Controls**: Password policies, token security, CSRF protection, etc.

### Requirements Summary

From `/context/requirements.md`:

- Email/password authentication with secure password requirements (min 8 chars, upper/lower/number)
- SSO integration with Google Workspace and Microsoft 365
- Role-based access control (RBAC) with three roles: Teacher, Principal, Admin
- Session management with 30-minute inactivity timeout
- Password reset functionality via email verification
- Multi-factor authentication (MFA) support for future (architecture must accommodate)

### Key Decisions

**Decision 7 (from `/context/decisions.md`):**

**Self-Managed Authentication with Passport.js**

- **Decision**: Use self-managed authentication with Passport.js (NestJS integration)
- **Alternatives Considered**: Auth0, Clerk, AWS Cognito
- **Rationale**:
  - **Cost**: Auth0 pricing ($700+/month for 500 users) vs. self-managed ($50/month infrastructure)
  - **Control**: Full control over auth flows, customization for educational context
  - **Data sovereignty**: User credentials stay in our database (FERPA compliance)
  - **Simplicity**: No external service dependency, easier debugging
  - **SSO**: Passport supports Google/Microsoft OAuth out of the box
- **Trade-offs**: More implementation and maintenance burden, but acceptable for team's skill level

---

## Authentication Strategy

### Authentication Methods

Growth Engine supports **two authentication methods**:

1. **Email/Password (Primary for initial MVP)**
   - Traditional username/password authentication
   - Secure password storage with bcrypt (12 rounds)
   - Password reset via email verification tokens
   - Account activation via email confirmation

2. **Single Sign-On (SSO) - Google & Microsoft**
   - OAuth 2.0 integration with Google Workspace
   - OAuth 2.0 integration with Microsoft 365
   - Automatic account creation on first SSO login
   - Account linking (SSO account can link to existing email/password account)

### Authentication Flow Selection

| User Scenario                       | Authentication Method         | Notes                                     |
| ----------------------------------- | ----------------------------- | ----------------------------------------- |
| School with Google Workspace        | Google SSO (preferred)        | Seamless login, no password to remember   |
| School with Microsoft 365           | Microsoft SSO (preferred)     | Seamless login, leverages school identity |
| Independent teacher or small school | Email/Password                | Self-registration, email verification     |
| District admin (central IT)         | Email/Password + MFA (future) | Higher security requirements              |

---

## Authentication Flows

### 1. Email/Password Authentication Flow

```
┌─────────┐                                           ┌─────────────┐
│ User    │                                           │  Backend    │
│(Browser)│                                           │   (NestJS)  │
└────┬────┘                                           └──────┬──────┘
     │                                                        │
     │  1. Navigate to /auth/login                           │
     ├───────────────────────────────────────────────────────►
     │                                                        │
     │  2. Display login form                                │
     ◄───────────────────────────────────────────────────────┤
     │                                                        │
     │  3. Submit email + password                           │
     ├──POST /api/v1/auth/login────────────────────────────►│
     │    { email, password }                                │
     │                                                        │
     │                        4. Validate credentials        │
     │                           - Lookup user by email      │
     │                           - Verify password (bcrypt)  │
     │                           - Check isActive flag       │
     │                                                        │
     │                        5. Generate JWT tokens         │
     │                           - Access token (15 min)     │
     │                           - Refresh token (7 days)    │
     │                                                        │
     │                        6. Update lastLoginAt          │
     │                           timestamp in DB             │
     │                                                        │
     │  7. Return tokens + user object                       │
     ◄──200 OK──────────────────────────────────────────────┤
     │    {                                                   │
     │      accessToken: "eyJhbG...",                         │
     │      refreshToken: "eyJhbG...",                        │
     │      user: { id, email, role, ... }                   │
     │    }                                                   │
     │                                                        │
     │  8. Store tokens (localStorage/cookie)                │
     │     Redirect to /dashboard                            │
     │                                                        │
```

#### Error Scenarios

| Scenario                 | HTTP Status           | Error Response                                                                 |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------ |
| Invalid email            | 401 Unauthorized      | `{ error: "Invalid credentials" }`                                             |
| Invalid password         | 401 Unauthorized      | `{ error: "Invalid credentials" }` (same message to prevent email enumeration) |
| Account not verified     | 403 Forbidden         | `{ error: "Please verify your email" }`                                        |
| Account inactive         | 403 Forbidden         | `{ error: "Account has been deactivated" }`                                    |
| Too many failed attempts | 429 Too Many Requests | `{ error: "Account temporarily locked. Try again in 15 minutes" }`             |

### 2. Google SSO Authentication Flow

```
┌─────────┐         ┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ User    │         │  Frontend   │         │   Backend    │         │   Google    │
│(Browser)│         │  (Next.js)  │         │   (NestJS)   │         │    OAuth    │
└────┬────┘         └──────┬──────┘         └──────┬───────┘         └──────┬──────┘
     │                     │                        │                        │
     │  1. Click "Sign in with Google"             │                        │
     ├─────────────────────►                        │                        │
     │                     │                        │                        │
     │  2. Redirect to Google OAuth consent page   │                        │
     ├────────────────────────────────────────────────────────────────────►│
     │    /auth/google?redirect_uri=...                                     │
     │                     │                        │                        │
     │  3. User grants consent                      │                        │
     │                     │                        │                        │
     │  4. Google redirects back with auth code     │                        │
     ◄────────────────────────────────────────────────────────────────────┤
     │    /api/v1/auth/google/callback?code=ABC123 │                        │
     │                     │                        │                        │
     │                     │  5. Exchange code for Google ID token         │
     │                     │        ├───────────────────────────────────────►
     │                     │        │                │                        │
     │                     │        │  6. Return ID token + user profile    │
     │                     │        ◄───────────────────────────────────────┤
     │                     │        │                │                        │
     │                     │        7. Decode JWT, extract user info        │
     │                     │           - email: user@school.edu             │
     │                     │           - name: "John Doe"                   │
     │                     │           - picture: "https://..."             │
     │                     │           - sub: "google-user-id-12345"        │
     │                     │        │                │                        │
     │                     │        8. Lookup or create user in DB          │
     │                     │           - Find user by email                 │
     │                     │           - If not found, create new user:     │
     │                     │             - authProvider: GOOGLE             │
     │                     │             - providerId: sub                  │
     │                     │             - passwordHash: null               │
     │                     │             - role: TEACHER (default)          │
     │                     │             - emailVerified: true              │
     │                     │        │                │                        │
     │                     │        9. Generate JWT tokens                  │
     │                     │           - Access token (15 min)              │
     │                     │           - Refresh token (7 days)             │
     │                     │        │                │                        │
     │  10. Return tokens + user object              │                        │
     ◄────────200 OK────────────────┤                │                        │
     │    {                         │                │                        │
     │      accessToken: "...",     │                │                        │
     │      refreshToken: "...",    │                │                        │
     │      user: { ... }           │                │                        │
     │    }                         │                │                        │
     │                     │        │                │                        │
     │  11. Store tokens, redirect to /dashboard    │                        │
     │                     │        │                │                        │
```

### 3. Refresh Token Flow

```
┌─────────┐                                           ┌─────────────┐
│ User    │                                           │  Backend    │
│(Browser)│                                           │   (NestJS)  │
└────┬────┘                                           └──────┬──────┘
     │                                                        │
     │  1. Make API request with expired access token       │
     ├──GET /api/v1/students───────────────────────────────►│
     │    Authorization: Bearer eyJhbG...                    │
     │                                                        │
     │                        2. Token validation fails      │
     │                           (expired signature)         │
     │                                                        │
     │  3. Return 401 Unauthorized                           │
     ◄──401 Unauthorized────────────────────────────────────┤
     │    { error: "Token expired" }                         │
     │                                                        │
     │  4. Frontend intercepts 401, uses refresh token       │
     ├──POST /api/v1/auth/refresh──────────────────────────►│
     │    { refreshToken: "eyJhbG..." }                      │
     │                                                        │
     │                        5. Validate refresh token      │
     │                           - Verify signature          │
     │                           - Check expiration (7 days) │
     │                           - Verify user still active  │
     │                                                        │
     │                        6. Generate new access token   │
     │                           (15 min expiration)         │
     │                                                        │
     │  7. Return new access token                           │
     ◄──200 OK──────────────────────────────────────────────┤
     │    { accessToken: "eyJhbG..." }                       │
     │                                                        │
     │  8. Retry original request with new token             │
     ├──GET /api/v1/students───────────────────────────────►│
     │    Authorization: Bearer (new token)                  │
     │                                                        │
     │  9. Return requested data                             │
     ◄──200 OK──────────────────────────────────────────────┤
     │                                                        │
```

### 4. Password Reset Flow

```
┌─────────┐                                           ┌─────────────┐
│ User    │                                           │  Backend    │
│(Browser)│                                           │   (NestJS)  │
└────┬────┘                                           └──────┬──────┘
     │                                                        │
     │  1. Click "Forgot Password?" on login page            │
     ├───────────────────────────────────────────────────────►
     │                                                        │
     │  2. Display password reset form                       │
     ◄───────────────────────────────────────────────────────┤
     │                                                        │
     │  3. Submit email address                              │
     ├──POST /api/v1/auth/forgot-password─────────────────►│
     │    { email: "teacher@school.edu" }                    │
     │                                                        │
     │                        4. Lookup user by email        │
     │                           (always return 200 OK       │
     │                            to prevent email enum)     │
     │                                                        │
     │                        5. Generate reset token        │
     │                           - Random secure token       │
     │                           - Hash and store in DB      │
     │                           - Set expiration (1 hour)   │
     │                                                        │
     │                        6. Send reset email            │
     │                           with reset link:            │
     │                           /auth/reset?token=ABC123    │
     │                                                        │
     │  7. Return success (always)                           │
     ◄──200 OK──────────────────────────────────────────────┤
     │    { message: "If account exists, email sent" }       │
     │                                                        │
     │  8. User clicks link in email                         │
     ├──GET /auth/reset?token=ABC123──────────────────────►│
     │                                                        │
     │                        9. Validate token              │
     │                           - Check expiration          │
     │                           - Check not already used    │
     │                                                        │
     │  10. Display password reset form                      │
     ◄────────────────────────────────────────────────────────┤
     │                                                        │
     │  11. Submit new password                              │
     ├──POST /api/v1/auth/reset-password──────────────────►│
     │    { token: "ABC123", newPassword: "SecurePass1!" }  │
     │                                                        │
     │                        12. Validate password strength │
     │                            Hash new password (bcrypt) │
     │                            Update user.passwordHash   │
     │                            Mark token as used         │
     │                            Invalidate all sessions    │
     │                                                        │
     │  13. Return success                                   │
     ◄──200 OK──────────────────────────────────────────────┤
     │    { message: "Password reset successful" }           │
     │                                                        │
     │  14. Redirect to login page                           │
     │                                                        │
```

### 5. Logout Flow

```
┌─────────┐                                           ┌─────────────┐
│ User    │                                           │  Backend    │
│(Browser)│                                           │   (NestJS)  │
└────┬────┘                                           └──────┬──────┘
     │                                                        │
     │  1. Click "Logout" button                             │
     ├───────────────────────────────────────────────────────►
     │                                                        │
     │  2. Call logout endpoint                              │
     ├──POST /api/v1/auth/logout───────────────────────────►│
     │    Authorization: Bearer (access token)               │
     │    { refreshToken: "..." }                            │
     │                                                        │
     │                        3. Blacklist tokens (optional) │
     │                           - Add to Redis blacklist    │
     │                           - TTL = token exp time      │
     │                                                        │
     │                        4. Clear server-side session   │
     │                           (if using session storage)  │
     │                                                        │
     │  5. Return success                                    │
     ◄──200 OK──────────────────────────────────────────────┤
     │    { message: "Logged out successfully" }             │
     │                                                        │
     │  6. Clear client-side tokens                          │
     │     - Remove from localStorage                        │
     │     - Clear cookies                                   │
     │     - Redirect to /auth/login                         │
     │                                                        │
```

---

## Authorization Model (RBAC)

### Role Definitions

| Role          | Description                   | Scope                                        | Typical Users                |
| ------------- | ----------------------------- | -------------------------------------------- | ---------------------------- |
| **TEACHER**   | Standard teacher account      | Own students and classes only                | Classroom teachers, tutors   |
| **PRINCIPAL** | School administrator          | All students/classes in their school         | Principals, vice principals  |
| **ADMIN**     | District/system administrator | All schools in district (or all system data) | District IT, platform admins |

### Permission Matrix

| Resource                       | Action    | TEACHER | PRINCIPAL | ADMIN |
| ------------------------------ | --------- | ------- | --------- | ----- |
| **Students**                   |           |         |           |       |
| View own students              | ✅        | ✅      | ✅        | ✅    |
| View school students           | ❌        | ✅      | ✅        | ✅    |
| View all students              | ❌        | ❌      | ❌        | ✅    |
| Create student                 | ✅        | ✅      | ✅        | ✅    |
| Edit own student               | ✅        | ✅      | ✅        | ✅    |
| Edit any student (same school) | ❌        | ✅      | ✅        | ✅    |
| Delete student                 | ✅ (soft) | ✅      | ✅        | ✅    |
| **Analyses**                   |           |         |           |       |
| View own analyses              | ✅        | ✅      | ✅        | ✅    |
| View school analyses           | ❌        | ✅      | ✅        | ✅    |
| Create analysis (own students) | ✅        | ✅      | ✅        | ✅    |
| Edit own analysis              | ✅        | ✅      | ✅        | ✅    |
| Delete own analysis            | ✅        | ✅      | ✅        | ✅    |
| Export analysis                | ✅        | ✅      | ✅        | ✅    |
| **Classes**                    |           |         |           |       |
| View own classes               | ✅        | ✅      | ✅        | ✅    |
| View school classes            | ❌        | ✅      | ✅        | ✅    |
| Create class                   | ✅        | ✅      | ✅        | ✅    |
| Edit own class                 | ✅        | ✅      | ✅        | ✅    |
| Delete own class               | ✅        | ✅      | ✅        | ✅    |
| **Users**                      |           |         |           |       |
| View own profile               | ✅        | ✅      | ✅        | ✅    |
| Edit own profile               | ✅        | ✅      | ✅        | ✅    |
| View school users              | ❌        | ✅      | ✅        | ✅    |
| Create user (same school)      | ❌        | ✅      | ✅        | ✅    |
| Edit user (same school)        | ❌        | ✅      | ✅        | ✅    |
| Deactivate user                | ❌        | ✅      | ✅        | ✅    |
| **Dashboard**                  |           |         |           |       |
| Teacher dashboard              | ✅        | ✅      | ✅        | ✅    |
| Principal dashboard            | ❌        | ✅      | ✅        | ✅    |
| Admin dashboard                | ❌        | ❌      | ❌        | ✅    |
| School-wide analytics          | ❌        | ✅      | ✅        | ✅    |
| District-wide analytics        | ❌        | ❌      | ❌        | ✅    |

### Resource Ownership Rules

#### Teachers

- **Own Students**: Students in classes where teacher is the owner
- **Own Classes**: Classes where `teacher_id = current_user_id`
- **Own Analyses**: Analyses where `created_by_user_id = current_user_id`

**Data Isolation (FERPA Compliance):**

- Teachers CANNOT see students from other teachers' classes
- Teachers CANNOT see other teachers' analyses
- Exception: If student is in multiple classes (co-teaching), both teachers can see student

#### Principals

- **School Students**: All students where `student.schoolId = principal.schoolId`
- **School Classes**: All classes where `class.schoolId = principal.schoolId`
- **School Analyses**: All analyses for students in their school
- **School Users**: All teachers in their school

**Data Isolation:**

- Principals CANNOT see students from other schools
- Principals CAN see all analyses for their school (oversight responsibility)

#### Admins

- **All Access**: No restrictions (district or system-wide)
- Used for: District reporting, platform maintenance, support

### Implementing Authorization in Code

#### 1. Decorators (NestJS)

```typescript
// Custom role guard
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER', 'PRINCIPAL')
@Get('students')
async getStudents(@CurrentUser() user: User) {
  // Only teachers and principals can access
}
```

#### 2. Resource Ownership Check

```typescript
// In service layer
async getStudent(studentId: string, currentUser: User): Promise<Student> {
  const student = await this.prisma.student.findUnique({
    where: { id: studentId },
    include: { enrollments: { include: { class: true } } }
  });

  if (!student) {
    throw new NotFoundException('Student not found');
  }

  // Authorization check
  if (currentUser.role === 'TEACHER') {
    // Check if teacher owns any class this student is enrolled in
    const hasAccess = student.enrollments.some(
      enrollment => enrollment.class.teacherId === currentUser.id
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this student');
    }
  } else if (currentUser.role === 'PRINCIPAL') {
    // Check if student is in principal's school
    if (student.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException('You do not have access to this student');
    }
  }
  // ADMIN has unrestricted access

  return student;
}
```

#### 3. Database Query Scoping

```typescript
// Auto-scope queries based on user role
async findStudents(currentUser: User, filters: StudentFilterDto) {
  const where: Prisma.StudentWhereInput = {};

  // Apply role-based scoping
  if (currentUser.role === 'TEACHER') {
    where.enrollments = {
      some: {
        class: {
          teacherId: currentUser.id
        }
      }
    };
  } else if (currentUser.role === 'PRINCIPAL') {
    where.schoolId = currentUser.schoolId;
  }
  // ADMIN: no additional scoping

  // Add user filters on top of role scoping
  if (filters.gradeLevel) {
    where.gradeLevel = filters.gradeLevel;
  }

  return this.prisma.student.findMany({ where });
}
```

---

## Security Design

### 1. Password Security

**Requirements:**

- Minimum 8 characters
- Must contain: uppercase, lowercase, number
- Optional: special character (recommended but not enforced)
- Maximum 72 characters (bcrypt limit)

**Password Hashing:**

- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (balances security and performance)
- **Storage**: Store hash only, never plaintext

```typescript
import * as bcrypt from 'bcrypt';

// Hash password on registration/reset
const saltRounds = 12;
const passwordHash = await bcrypt.hash(password, saltRounds);

// Verify password on login
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**Password Reset Tokens:**

- **Generation**: Crypto-random 32-byte token
- **Storage**: Hashed in database (SHA-256)
- **Expiration**: 1 hour
- **Single-use**: Marked as used after successful reset

### 2. JWT Token Security

**Access Token:**

- **Purpose**: Short-lived token for API authentication
- **Expiration**: 15 minutes
- **Claims**:
  ```json
  {
    "sub": "user-id-uuid",
    "email": "teacher@school.edu",
    "role": "TEACHER",
    "schoolId": "school-id-uuid",
    "iat": 1640995200,
    "exp": 1640996100
  }
  ```
- **Algorithm**: RS256 (asymmetric, public/private key pair)
- **Storage**: Client-side (localStorage or memory)

**Refresh Token:**

- **Purpose**: Long-lived token to obtain new access tokens
- **Expiration**: 7 days
- **Claims**:
  ```json
  {
    "sub": "user-id-uuid",
    "type": "refresh",
    "iat": 1640995200,
    "exp": 1641600000
  }
  ```
- **Algorithm**: RS256
- **Storage**: Secure HttpOnly cookie (preferred) or localStorage
- **Rotation**: Optional - issue new refresh token with each refresh

**Token Blacklisting (Optional):**

- Use Redis to blacklist logged-out tokens
- Key: `blacklist:${tokenId}`
- TTL: Token expiration time
- Check blacklist on every authenticated request

### 3. Session Management

**Session Timeout:**

- **Inactivity Timeout**: 30 minutes (configurable per school)
- **Absolute Timeout**: 8 hours (for long teacher work sessions)
- **Implementation**: Track last activity timestamp, validate on each request

**Session Storage:**

- **Stateless JWT**: No server-side session storage (default)
- **Alternative**: Redis session store for high-security environments

### 4. CSRF Protection

**Strategy:**

- **SameSite Cookie**: Set `SameSite=Lax` on cookies
- **CSRF Token**: For state-changing operations (POST, PUT, DELETE)
- **Double-Submit Cookie**: Send CSRF token in both cookie and header

```typescript
// NestJS CSRF middleware
app.use(
  csurf({
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);
```

### 5. Account Lockout Policy

**Failed Login Attempts:**

- **Threshold**: 5 failed attempts within 15 minutes
- **Lockout Duration**: 15 minutes
- **Tracking**: Store failed attempts in Redis with TTL

```typescript
// Pseudo-code
const key = `login_attempts:${email}`;
const attempts = await redis.incr(key);
await redis.expire(key, 900); // 15 minutes

if (attempts > 5) {
  throw new TooManyRequestsException('Account temporarily locked');
}
```

**Unlock Mechanisms:**

- Automatic unlock after 15 minutes
- Manual unlock by principal/admin (future)
- Password reset unlocks account

### 6. Email Verification

**New Accounts:**

- Send verification email on registration
- Account status: `emailVerified = false`
- Block login until email verified
- Verification token: 24-hour expiration

### 7. Multi-Factor Authentication (MFA)

**Current Status**: Not implemented in MVP

**Future Architecture Support:**

- Add `mfaEnabled` and `mfaSecret` fields to User model
- Support TOTP (Time-based One-Time Password) via Google Authenticator
- MFA required for ADMIN role, optional for TEACHER/PRINCIPAL
- Backup codes for account recovery

---

## SSO Integration

### 1. Google Workspace OAuth 2.0

**OAuth Flow:**

- **Authorization URL**: `https://accounts.google.com/o/oauth2/v2/auth`
- **Token URL**: `https://oauth2.googleapis.com/token`
- **Scopes**:
  - `openid` - OpenID Connect
  - `profile` - User's name, picture
  - `email` - User's email address

**Implementation (Passport.js):**

```typescript
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://app.growthengine.app/api/v1/auth/google/callback',
      scope: ['openid', 'profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // 1. Extract user info from profile
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const avatar = profile.photos[0]?.value;
      const providerId = profile.id;

      // 2. Find or create user
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            avatar,
            authProvider: 'GOOGLE',
            providerId,
            role: 'TEACHER', // Default role
            emailVerified: true, // Google emails are pre-verified
            schoolId: await determineSchoolFromEmail(email), // Domain matching
          },
        });
      } else if (user.authProvider === 'EMAIL' && !user.providerId) {
        // Link SSO to existing email/password account
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            providerId,
            authProvider: 'GOOGLE', // Switch to SSO
            emailVerified: true,
          },
        });
      }

      return done(null, user);
    }
  )
);
```

**Domain Verification (School Matching):**

- Extract domain from email (e.g., `@school.edu`)
- Lookup school by verified domain
- If no school found, require manual school selection or admin approval

### 2. Microsoft 365 OAuth 2.0

**OAuth Flow:**

- **Authorization URL**: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
- **Token URL**: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- **Scopes**:
  - `openid`
  - `profile`
  - `email`

**Implementation:**

```typescript
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: 'https://app.growthengine.app/api/v1/auth/microsoft/callback',
      scope: ['openid', 'profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Similar logic to Google strategy
      // ...
    }
  )
);
```

### 3. Account Linking Strategy

**Scenario 1: SSO user with existing email/password account**

- User logs in with Google/Microsoft
- System finds existing account with same email
- Prompt user: "Link this account to your existing account?"
- If yes: Update `authProvider` to SSO, set `providerId`

**Scenario 2: Email/password user wants to add SSO**

- User navigates to account settings
- Click "Link Google Account" or "Link Microsoft Account"
- Complete OAuth flow
- Update account with SSO credentials
- User can now login via either method

### 4. SSO Error Handling

| Error Scenario                            | Handling                                                    |
| ----------------------------------------- | ----------------------------------------------------------- |
| User cancels OAuth consent                | Redirect to login with message: "Login cancelled"           |
| Email domain not whitelisted              | Show error: "Your school is not registered. Contact admin." |
| OAuth provider unavailable                | Show error: "SSO service unavailable. Try email/password."  |
| Invalid OAuth response                    | Log error, show generic message: "Login failed. Try again." |
| Email already exists (different provider) | Ask user to login with existing method, then link accounts  |

---

## Database Schema

### Additional Auth Tables

#### 1. PasswordResetTokens

```prisma
model PasswordResetToken {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  tokenHash  String   @unique // SHA-256 hash of the token
  expiresAt  DateTime
  usedAt     DateTime? // Null if not used yet

  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
}
```

#### 2. RefreshTokens (Optional - for token rotation strategy)

```prisma
model RefreshToken {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  tokenHash   String   @unique // Hash of refresh token
  expiresAt   DateTime
  revokedAt   DateTime? // For manual revocation

  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
}
```

#### 3. AuditLogs (for authentication events)

Already defined in `DATABASE_SCHEMA.md`, but key events to log:

- User login (email/password or SSO)
- User logout
- Failed login attempts
- Password reset requested
- Password reset completed
- Account locked
- Account unlocked
- Email verification sent
- Email verified
- MFA enabled/disabled (future)

```prisma
// Example audit log entries
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user.id,
    changes: {
      authMethod: 'email',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  }
});
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/register

**Description**: Register new user with email/password
**Body**:

```json
{
  "email": "teacher@school.edu",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "schoolCode": "SCH-001" // Optional, for school assignment
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "userId": "uuid",
    "email": "teacher@school.edu"
  }
}
```

#### POST /api/v1/auth/login

**Description**: Login with email/password
**Body**:

```json
{
  "email": "teacher@school.edu",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "teacher@school.edu",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "TEACHER",
      "schoolId": "uuid",
      "avatar": null
    }
  }
}
```

#### GET /api/v1/auth/google

**Description**: Initiate Google OAuth flow
**Query Params**: None
**Response**: Redirect to Google consent page

#### GET /api/v1/auth/google/callback

**Description**: Google OAuth callback
**Query Params**: `code=...` (OAuth authorization code)
**Response**: Redirect to frontend with tokens in URL params or cookies

#### GET /api/v1/auth/microsoft

**Description**: Initiate Microsoft OAuth flow

#### GET /api/v1/auth/microsoft/callback

**Description**: Microsoft OAuth callback

#### POST /api/v1/auth/refresh

**Description**: Refresh access token using refresh token
**Body**:

```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs..."
  }
}
```

#### POST /api/v1/auth/logout

**Description**: Logout (blacklist tokens)
**Headers**: `Authorization: Bearer <accessToken>`
**Body**:

```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/v1/auth/forgot-password

**Description**: Request password reset email
**Body**:

```json
{
  "email": "teacher@school.edu"
}
```

**Response** (200 OK - always, to prevent email enumeration):

```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

#### POST /api/v1/auth/reset-password

**Description**: Reset password using token
**Body**:

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

#### POST /api/v1/auth/verify-email

**Description**: Verify email address using token
**Body**:

```json
{
  "token": "verification-token-from-email"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Email verified successfully. You can now login."
}
```

#### GET /api/v1/auth/me

**Description**: Get current user profile
**Headers**: `Authorization: Bearer <accessToken>`
**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "teacher@school.edu",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "TEACHER",
    "schoolId": "uuid",
    "school": {
      "id": "uuid",
      "name": "Example High School"
    },
    "emailVerified": true,
    "isActive": true,
    "lastLoginAt": "2025-12-30T10:00:00Z"
  }
}
```

---

## Implementation Guidance

### Backend (NestJS)

#### 1. Folder Structure

```
packages/backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── microsoft.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── ownership.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── public.decorator.ts
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       ├── reset-password.dto.ts
│       └── refresh-token.dto.ts
```

#### 2. Key Dependencies

```json
{
  "dependencies": {
    "@nestjs/passport": "^10.0.3",
    "@nestjs/jwt": "^10.2.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-microsoft": "^1.0.0",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  }
}
```

#### 3. Environment Variables

```bash
# JWT
JWT_ACCESS_SECRET=<random-256-bit-secret>
JWT_REFRESH_SECRET=<random-256-bit-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
GOOGLE_CALLBACK_URL=https://app.growthengine.app/api/v1/auth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=<from-azure-portal>
MICROSOFT_CLIENT_SECRET=<from-azure-portal>
MICROSOFT_CALLBACK_URL=https://app.growthengine.app/api/v1/auth/microsoft/callback

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
FROM_EMAIL=noreply@growthengine.app

# Redis (for rate limiting, token blacklist)
REDIS_URL=redis://localhost:6379
```

### Frontend (Next.js)

#### 1. Auth Context

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'TEACHER' | 'PRINCIPAL' | 'ADMIN';
  schoolId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (response.ok) {
        const { data } = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { data } = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem('refreshToken')
      })
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

#### 2. Protected Route Wrapper

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: ('TEACHER' | 'PRINCIPAL' | 'ADMIN')[];
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
```

---

## Summary

This authentication architecture provides:

✅ **Secure Authentication**: Email/password with bcrypt hashing, SSO with Google/Microsoft
✅ **Role-Based Authorization**: Clear permission matrix for Teachers, Principals, Admins
✅ **Session Management**: JWT tokens with refresh flow, 30-min inactivity timeout
✅ **FERPA Compliance**: Data isolation, audit logging, secure password resets
✅ **Extensibility**: Architecture supports future MFA, additional SSO providers
✅ **Developer Experience**: Clear API contracts, NestJS/Passport integration guidance

**Next Steps (GE-007 to GE-010):**

- GE-007: Backend implementation (NestJS, Passport, JWT)
- GE-008: Frontend implementation (Next.js, auth context, protected routes)
- GE-009: UI/UX design (login forms, SSO buttons, password reset flow)
- GE-010: E2E tests (auth flows, role-based access, session management)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-30
**Maintained By**: Architect

# GE-007: Authentication - Backend Implementation

**Epic:** authentication
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-002 (backend) - Monorepo and NestJS backend initialized
- GE-003 (backend) - Local dev environment with database
- GE-006 (architect) - Authentication architecture designed

## Context
- Architecture: /docs/ARCHITECTURE.md (Authentication section)
- Requirements: /context/requirements.md (Authentication & Authorization)
- Tech Stack: NestJS with Passport.js

## Description
Implement authentication backend including email/password registration and login, SSO integration (Google and Microsoft), JWT token generation and validation, password reset, and RBAC middleware.

## Acceptance Criteria
- [ ] Email/Password authentication:
  - [ ] POST /auth/register - user registration with validation
  - [ ] POST /auth/login - login with email/password, returns JWT
  - [ ] Password hashing with bcrypt (min 10 salt rounds)
  - [ ] Password strength validation (min 8 chars, upper/lower/number)
  - [ ] Email validation and uniqueness check
  - [ ] Account lockout after 5 failed attempts (15-minute cooldown)
- [ ] JWT token management:
  - [ ] JWT access token generation with user claims (id, email, role)
  - [ ] Token signing with secure secret (from environment variable)
  - [ ] Token expiration (15 minutes for access token)
  - [ ] Refresh token implementation (7 days expiration, stored in database)
  - [ ] POST /auth/refresh - refresh access token using refresh token
  - [ ] Token validation middleware for protected routes
- [ ] SSO implementation:
  - [ ] Google OAuth 2.0 integration (Passport Google Strategy)
  - [ ] Microsoft OAuth 2.0 integration (Passport Azure AD Strategy)
  - [ ] GET /auth/google - redirect to Google login
  - [ ] GET /auth/google/callback - handle OAuth callback
  - [ ] GET /auth/microsoft - redirect to Microsoft login
  - [ ] GET /auth/microsoft/callback - handle OAuth callback
  - [ ] Account linking (SSO to existing email account)
  - [ ] Auto-registration for new SSO users
- [ ] Password reset:
  - [ ] POST /auth/forgot-password - generate reset token, send email
  - [ ] POST /auth/reset-password - validate token and reset password
  - [ ] Reset token expiration (1 hour)
  - [ ] One-time use tokens (invalidate after use)
- [ ] Authorization (RBAC):
  - [ ] Role-based guards (Teacher, Principal, Admin)
  - [ ] Permission decorators for route protection
  - [ ] Resource ownership checks (teacher can only access their students)
  - [ ] Middleware to attach user context to requests
- [ ] Session management:
  - [ ] POST /auth/logout - invalidate tokens
  - [ ] Session timeout handling
  - [ ] Concurrent session policy (allow/deny multiple sessions)
- [ ] Audit logging:
  - [ ] Log all authentication events (login, logout, failed attempts, password reset)
  - [ ] Store IP address, user agent, timestamp
  - [ ] FERPA-compliant audit trail
- [ ] Security features:
  - [ ] CSRF protection for state-changing operations
  - [ ] Rate limiting on auth endpoints (prevent brute force)
  - [ ] Secure HTTP-only cookies for refresh tokens
  - [ ] Input sanitization and validation
- [ ] Testing:
  - [ ] Unit tests for all authentication services
  - [ ] Integration tests for auth endpoints
  - [ ] Test SSO flows with mocked OAuth providers
  - [ ] Test RBAC middleware and guards
  - [ ] Test password reset flow
  - [ ] Test account lockout mechanism

## Deliverables
- `/packages/backend/src/auth` module with:
  - Auth controller (routes)
  - Auth service (business logic)
  - Passport strategies (local, Google, Microsoft)
  - JWT strategy and guards
  - RBAC guards and decorators
- Database migrations for users, sessions, audit logs
- Unit and integration tests with 80%+ coverage
- API documentation (Swagger/OpenAPI) for auth endpoints

## Notes
- Use NestJS @nestjs/passport for Passport.js integration
- Use @nestjs/jwt for JWT token generation
- Store secrets in environment variables, never in code
- Implement rate limiting early to prevent abuse
- Test SSO flows thoroughly (error cases: denied consent, invalid tokens, etc.)
- Ensure password reset tokens are cryptographically secure (crypto.randomBytes)
- Consider using Redis for session storage if database becomes bottleneck

## Estimated Effort
5 days (backend)

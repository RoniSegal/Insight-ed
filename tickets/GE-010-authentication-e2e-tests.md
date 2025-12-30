# GE-010: Authentication - E2E Tests

**Epic:** authentication
**Owner role:** e2e
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-005 (e2e) - E2E framework set up
- GE-007 (backend) - Authentication backend implemented
- GE-008 (frontend) - Authentication frontend implemented

## Context
- PRD: /docs/PRD.md (Section 5: User Journeys - Authentication flows)
- Architecture: /docs/ARCHITECTURE.md (Authentication section)
- Discovery: /context/discovery.md (Testing Priorities - Auth is critical)

## Description
Create comprehensive E2E tests for all authentication flows including email/password login, SSO, registration, password reset, and authorization scenarios. Ensure authentication is bulletproof before MVP launch.

## Acceptance Criteria
- [ ] Email/Password authentication tests:
  - [ ] Test: Successful login with valid credentials
    - Navigate to login page
    - Enter valid email and password
    - Click "Sign In"
    - Verify redirect to dashboard
    - Verify user is authenticated (check for user menu)
  - [ ] Test: Login fails with invalid credentials
    - Enter invalid email/password
    - Verify error message displayed
    - Verify user remains on login page
  - [ ] Test: Account lockout after 5 failed attempts
    - Attempt login with wrong password 5 times
    - Verify account locked message
    - Attempt login with correct password
    - Verify login still blocked
  - [ ] Test: Successful logout
    - Login as user
    - Click logout
    - Verify redirect to login page
    - Verify cannot access protected pages
- [ ] Registration tests:
  - [ ] Test: Successful registration
    - Navigate to registration page
    - Fill form with valid data
    - Submit form
    - Verify success message
    - Verify can login with new account
  - [ ] Test: Registration fails with duplicate email
    - Attempt to register with existing email
    - Verify error message
  - [ ] Test: Password strength validation
    - Enter weak password (too short, no numbers)
    - Verify validation errors
    - Enter strong password
    - Verify validation passes
- [ ] Password reset tests:
  - [ ] Test: Forgot password flow
    - Navigate to forgot password page
    - Enter valid email
    - Submit form
    - Verify success message (email sent confirmation)
  - [ ] Test: Reset password with valid token
    - Navigate to reset page with valid token
    - Enter new password
    - Submit form
    - Verify success message
    - Login with new password
    - Verify successful authentication
  - [ ] Test: Reset password with expired token
    - Navigate to reset page with expired token
    - Verify error message
    - Verify cannot reset password
- [ ] SSO tests (mocked OAuth providers):
  - [ ] Test: Google SSO successful login
    - Click "Sign in with Google"
    - Mock OAuth flow (auto-approve)
    - Verify redirect to dashboard
    - Verify user authenticated
  - [ ] Test: Microsoft SSO successful login
    - Click "Sign in with Microsoft"
    - Mock OAuth flow (auto-approve)
    - Verify redirect to dashboard
    - Verify user authenticated
  - [ ] Test: SSO with denied consent
    - Click "Sign in with Google"
    - Mock OAuth denial
    - Verify error message
    - Verify user not authenticated
  - [ ] Test: SSO account linking
    - Existing account with email@example.com
    - SSO login with same email
    - Verify account linking flow
    - Verify can login via both methods
- [ ] Authorization tests:
  - [ ] Test: Teacher cannot access principal routes
    - Login as teacher
    - Attempt to navigate to /principal/dashboard
    - Verify redirect to forbidden page or teacher dashboard
  - [ ] Test: Principal can access principal routes
    - Login as principal
    - Navigate to /principal/dashboard
    - Verify access granted
  - [ ] Test: Unauthenticated user redirected to login
    - Navigate to /dashboard (protected route)
    - Verify redirect to /login
    - After login, verify redirect back to /dashboard
- [ ] Session management tests:
  - [ ] Test: Session persists across page refreshes
    - Login as user
    - Refresh page
    - Verify still authenticated
  - [ ] Test: Token refresh extends session
    - Login as user
    - Wait for token to near expiration (mock time if needed)
    - Perform action triggering token refresh
    - Verify session still valid
  - [ ] Test: Expired session redirects to login
    - Login as user
    - Mock token expiration
    - Attempt to access protected page
    - Verify redirect to login with session expired message
- [ ] Security tests:
  - [ ] Test: CSRF protection
    - Attempt state-changing auth operation without CSRF token
    - Verify request rejected
  - [ ] Test: XSS prevention in error messages
    - Enter malicious script in email field
    - Verify script not executed
  - [ ] Test: Rate limiting on login endpoint
    - Attempt rapid-fire login requests
    - Verify rate limit enforced (429 response)
- [ ] Cross-browser tests:
  - [ ] Run all critical tests in Chrome, Firefox, Safari
  - [ ] Verify consistent behavior across browsers
- [ ] Mobile responsive tests:
  - [ ] Test login flow on mobile viewport
  - [ ] Verify touch-friendly form inputs
  - [ ] Verify SSO buttons work on mobile

## Deliverables
- `/e2e/auth/` directory with comprehensive auth tests:
  - `login.spec.ts` - email/password login tests
  - `registration.spec.ts` - registration tests
  - `password-reset.spec.ts` - password reset tests
  - `sso.spec.ts` - SSO flow tests
  - `authorization.spec.ts` - RBAC and route protection tests
  - `session.spec.ts` - session management tests
- Page Object Models for auth pages
- Test utilities for auth (login helper, user creation, etc.)
- Test data fixtures (test users with different roles)
- Documentation of test coverage

## Notes
- Authentication is CRITICAL - these tests must be comprehensive and reliable
- Mock OAuth providers for SSO tests (use Playwright/Cypress mocking)
- Create test users with known credentials for repeatable tests
- Clean up test data after tests (delete created users)
- Tests should be isolated (each test independent)
- Consider security-focused tests (OWASP Top 10 scenarios)
- Run these tests on every PR - authentication regressions are unacceptable
- Track test coverage - aim for 100% of critical auth paths

## Estimated Effort
3 days (e2e)

# GE-041: Security & Compliance - E2E Tests

**Epic:** security-compliance
**Owner role:** e2e
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-040 (backend) - Security implementation

## Context
- Discovery: /context/discovery.md (OWASP Top 10, security testing)

## Description
Create E2E security tests validating CSRF protection, authorization enforcement, data isolation, and security headers.

## Acceptance Criteria
- [ ] CSRF protection tests:
  - [ ] Test: POST without CSRF token fails
  - [ ] Test: POST with valid CSRF token succeeds
- [ ] Authorization tests:
  - [ ] Test: Unauthorized access blocked
  - [ ] Test: Cross-tenant data access prevented
  - [ ] Test: Privilege escalation prevented
- [ ] Data isolation tests:
  - [ ] Test: Teacher A cannot access Teacher B's data
  - [ ] Test: Principal cannot access other school's data
- [ ] Security headers tests:
  - [ ] Test: CSP header present
  - [ ] Test: HSTS header present
  - [ ] Test: X-Frame-Options prevents clickjacking
- [ ] Input validation tests:
  - [ ] Test: XSS attempts blocked
  - [ ] Test: SQL injection attempts blocked
- [ ] Rate limiting tests:
  - [ ] Test: Excessive requests rate-limited

## Deliverables
- `/e2e/security/` with comprehensive security tests
- OWASP Top 10 test coverage

## Notes
- Critical for FERPA compliance
- Run security tests on every PR

## Estimated Effort
3 days (e2e)

# GE-003: Project Setup - Local Development Environment

**Epic:** project-setup
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-001 (architect) - Architecture design complete (cloud services selected)
- GE-002 (backend) - Monorepo initialized

## Context
- Architecture: /docs/ARCHITECTURE.md
- Discovery: /context/discovery.md (Development Tools section)
- Requirements: /context/requirements.md (Infrastructure section)

## Description
Set up local development environment with Docker Compose for running PostgreSQL, Redis, and other services locally. Ensure developers can run the entire stack on their machines.

## Acceptance Criteria
- [ ] Docker Compose configuration created:
  - [ ] PostgreSQL 15+ container with persistent volume
  - [ ] Redis container for caching and sessions
  - [ ] Environment variables configured via .env files
  - [ ] Health checks for all services
  - [ ] Network configuration for service communication
- [ ] Database setup:
  - [ ] Initial database schema applied on first startup
  - [ ] Seed data for development (sample users, students)
  - [ ] Connection pooling configured
  - [ ] Database migrations working (up/down)
- [ ] Environment configuration:
  - [ ] .env.example file with all required variables documented
  - [ ] .env files in .gitignore
  - [ ] Separate configs for development, testing, production
  - [ ] Validation of required environment variables on startup
- [ ] Development workflow:
  - [ ] `docker-compose up` starts all services
  - [ ] Backend connects to local PostgreSQL and Redis
  - [ ] Frontend proxy configured to backend API
  - [ ] Hot reload working for both frontend and backend
  - [ ] Logs visible and properly formatted
- [ ] Developer documentation:
  - [ ] Setup guide in README.md
  - [ ] Environment variables documented
  - [ ] Troubleshooting common issues
  - [ ] Database reset instructions

## Deliverables
- `docker-compose.yml` with all required services
- `.env.example` with documented environment variables
- Database initialization scripts and seed data
- Updated README.md with local development setup instructions

## Notes
- Ensure PostgreSQL version matches production environment
- Use volumes for database persistence to avoid losing data on container restart
- Consider pgAdmin or similar tool for database inspection (optional)
- Test on macOS, Linux, and Windows (WSL2) if possible

## Estimated Effort
1 day (backend)

# GE-036: Search & Filter - Backend Implementation

**Epic:** search-filter
**Owner role:** backend
**Status:** TODO
**Priority:** P2 (medium)
**Created:** 2025-12-30

## Dependencies
- GE-015 (backend) - Student management (entities to search)
- GE-020 (backend) - Analyses (search analysis results)

## Context
- Requirements: /context/requirements.md (Search & Filtering)

## Description
Implement global search and advanced filtering for students, analyses, and users. Support full-text search and multiple filter criteria.

## Acceptance Criteria
- [ ] Global search API:
  - [ ] GET /search?q=query - search across students, analyses
  - [ ] Full-text search on student names
  - [ ] Search analysis results (recommendations, strengths)
  - [ ] Fuzzy matching for typos
  - [ ] Search results ranked by relevance
- [ ] Advanced filtering:
  - [ ] Filter students by: grade, class, status, flag
  - [ ] Filter analyses by: date range, completion status, teacher
  - [ ] Combine multiple filters (AND logic)
  - [ ] Sort results (name, date, relevance)
- [ ] Saved searches (future):
  - [ ] Save filter presets
  - [ ] Quick access to common filters
- [ ] Performance:
  - [ ] Database indexes for search columns
  - [ ] Full-text search indexes (PostgreSQL FTS)
  - [ ] Search response < 300ms for 1000+ students
- [ ] Testing:
  - [ ] Unit and integration tests
  - [ ] Test fuzzy matching
  - [ ] Test filter combinations

## Deliverables
- Search and filter endpoints
- Full-text search implementation
- Database indexes
- Tests

## Estimated Effort
2 days (backend)

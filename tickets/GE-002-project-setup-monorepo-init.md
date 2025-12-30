# GE-002: Project Setup - Initialize Monorepo Structure

**Epic:** project-setup
**Owner role:** backend
**Status:** TODO
**Priority:** P0 (critical)
**Created:** 2025-12-30

## Dependencies
- GE-001 (architect) - Architecture design must be complete

## Context
- Architecture: /docs/ARCHITECTURE.md (to be created by GE-001)
- Discovery: /context/discovery.md (Repository Structure section)
- Decisions: /context/decisions.md (Decision 5: Monorepo with npm Workspaces)

## Description
Initialize the monorepo structure with npm workspaces according to the architecture design. Set up base packages for frontend, backend, shared code, and database.

## Acceptance Criteria
- [ ] Root package.json created with npm workspaces configuration
- [ ] Package structure created:
  - [ ] `/packages/frontend` - Next.js application initialized
  - [ ] `/packages/backend` - NestJS application initialized
  - [ ] `/packages/shared` - Shared TypeScript types and utilities
  - [ ] `/packages/database` - Database schemas, migrations, and seeds
- [ ] TypeScript configuration:
  - [ ] Root tsconfig.json with project references
  - [ ] Each package has its own tsconfig.json extending root config
  - [ ] Strict mode enabled
  - [ ] Path aliases configured for cross-package imports
- [ ] Development tooling configured:
  - [ ] ESLint configuration (root + per-package overrides)
  - [ ] Prettier configuration
  - [ ] Husky pre-commit hooks for linting and formatting
  - [ ] EditorConfig for consistent editor settings
- [ ] Scripts configured in root package.json:
  - [ ] `npm run dev` - starts all packages in development mode
  - [ ] `npm run build` - builds all packages
  - [ ] `npm run test` - runs tests across all packages
  - [ ] `npm run lint` - lints all packages
  - [ ] `npm run format` - formats all code
- [ ] Documentation:
  - [ ] Root README.md with project overview and setup instructions
  - [ ] CONTRIBUTING.md with development guidelines
  - [ ] Each package has its own README.md

## Deliverables
- Monorepo structure with all packages initialized
- Working development environment (can run `npm install` and `npm run dev`)
- Documentation for developers to get started

## Notes
- Use npm workspaces (Node.js built-in, per Decision 5)
- Ensure TypeScript project references work correctly for cross-package imports
- Test that changes in shared package trigger rebuilds in dependent packages
- Consider Turborepo if build performance becomes an issue (can add later)

## Estimated Effort
1 day (backend)

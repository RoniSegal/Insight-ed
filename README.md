# Growth Engine

AI-powered student assessment platform for K-12 education. Helps teachers efficiently analyze student strengths and weaknesses, providing actionable insights and recommendations.

## 🏗️ Project Structure

This is a monorepo using npm workspaces:

```
growth-engine/
├── packages/
│   ├── frontend/       # Next.js web application
│   ├── backend/        # NestJS API server
│   └── shared/         # Shared TypeScript types and utilities
├── docs/               # Architecture and PRD documentation
├── context/            # Project context and requirements
└── tickets/            # Work backlog and epics
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd growth-engine

# Install all dependencies
npm install

# Build shared package
npm run build --workspace=@growth-engine/shared
```

### Development

```bash
# Start all packages in development mode
npm run dev

# Or start packages individually:
npm run dev --workspace=@growth-engine/frontend  # Frontend on http://localhost:3000
npm run dev --workspace=@growth-engine/backend   # Backend on http://localhost:4000
```

### Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@growth-engine/frontend
```

### Testing

```bash
# Run tests across all packages
npm run test

# Run tests for specific package
npm run test --workspace=@growth-engine/backend
```

### Linting & Formatting

```bash
# Lint all packages
npm run lint

# Format all code
npm run format

# Check formatting
npm run format:check
```

## 📦 Packages

### Frontend (`@growth-engine/frontend`)
Next.js 14 web application with:
- React 18 + TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Hebrew RTL support

### Backend (`@growth-engine/backend`)
NestJS API server with:
- TypeScript
- Prisma ORM (PostgreSQL)
- Passport.js authentication
- OpenAI API integration

### Shared (`@growth-engine/shared`)
Shared code across frontend and backend:
- TypeScript types and interfaces
- Constants
- Utility functions

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand

**Backend:**
- NestJS 10
- TypeScript
- Prisma
- PostgreSQL
- Passport.js
- Bull (job queue)

**Infrastructure:**
- Google Cloud Platform
- Cloud Run (containers)
- Cloud SQL (PostgreSQL)
- Memorystore (Redis)

## 📚 Documentation

- [PRD](./docs/PRD.md) - Product Requirements Document
- [Architecture](./docs/ARCHITECTURE.md) - System Architecture
- [Database Schema](./docs/DATABASE_SCHEMA.md) - Database Design
- [API Contract](./docs/API_CONTRACT.md) - API Endpoints
- [Contributing Guidelines](./CONTRIBUTING.md) - Development Guidelines

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

Private - All Rights Reserved

## 🔗 Links

- **Documentation:** `/docs`
- **Tickets:** `/tickets`
- **Context:** `/context`

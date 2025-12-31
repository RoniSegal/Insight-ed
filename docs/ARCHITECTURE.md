# Architecture Document – growth-engine

**Version:** 1.0
**Last Updated:** December 30, 2025
**Status:** Approved

---

## 1. Context & Overview

### Project Summary

Growth Engine is an AI-powered K-12 student analysis platform that helps teachers identify individual student strengths, weaknesses, and learning needs through conversational AI analysis. The system uses ChatGPT to conduct guided assessments based on teacher observations, generates comprehensive student profiles with actionable recommendations, and provides principals with school-wide insights and trends.

### Domain

Education (K-12 student assessment and intervention planning)

### Business Drivers

**Problem Statement:**
- Teachers lack time to conduct deep individual student assessments (50+ hour work weeks)
- Student insights exist in teachers' minds but are not systematically documented
- Principals lack visibility into school-wide patterns and intervention needs
- Current assessment tools are either test-based (missing qualitative insights) or manual (too time-consuming)

**Solution Value:**
- Reduce student assessment time from hours to 5-10 minutes per student
- Capture and preserve teacher expertise and observations
- Generate actionable, personalized intervention strategies
- Provide data-driven insights for principals to allocate resources effectively
- Enable evidence-based parent communication and IEP/504 planning

**Strategic Goals:**
- Year 1: 20 schools, 500 teachers, 15,000 students
- Year 2: 100 schools, 2,500 teachers, 75,000 students
- Year 3: 300 schools, 7,500 teachers, 225,000 students

### Key Constraints

**Regulatory Compliance:**
- FERPA (Family Educational Rights and Privacy Act) compliance mandatory
- COPPA (Children's Online Privacy Protection Act) compliance if students access directly
- State-specific education privacy laws (CCPA in California, NY Ed Law 2-d, etc.)
- Data residency requirements (some districts require US-only data storage)

**Technical Constraints:**
- School network environments: restrictive firewalls, limited bandwidth
- OpenAI API dependency: costs, rate limits, availability
- Must support SSO (Google Workspace, Microsoft 365) for authentication
- Mixed tech literacy among users (design for accessibility)

**Cost Constraints:**
- Target pricing: <$10/teacher/month to be competitive
- OpenAI API costs: $0.01-0.05 per analysis (must control and predict)
- Infrastructure costs must scale efficiently

### Quality Attributes (Prioritized)

1. **Security & Compliance** - Critical: FERPA compliance non-negotiable, breach would be catastrophic
2. **Reliability** - High: 99.5% uptime target, educational workflows cannot be disrupted
3. **Performance** - High: Teachers won't tolerate slow responses, AI latency must be <3s
4. **Scalability** - High: Must grow from 10k to 100k+ students without re-architecture
5. **Usability** - High: Low training time (<30 min), intuitive for non-technical users
6. **Maintainability** - Medium: Code must be modular for rapid iteration based on feedback

---

## 2. System Context

### System Boundary

```
┌────────────────────────────────────────────────────────────────────────┐
│                          External Actors                                │
│                                                                          │
│   ┌──────────┐      ┌──────────┐      ┌──────────┐                    │
│   │ Teachers │      │Principals│      │  Admins  │                    │
│   └─────┬────┘      └─────┬────┘      └─────┬────┘                    │
│         │                  │                  │                         │
└─────────┼──────────────────┼──────────────────┼─────────────────────────┘
          │                  │                  │
          │    HTTPS/TLS     │                  │
          │                  │                  │
          ▼                  ▼                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Growth Engine Platform                            │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Next.js Frontend (Teacher/Principal Dashboards & Analysis UI) │   │
│   └────────────────────────────┬───────────────────────────────────┘   │
│                                 │ REST API                              │
│   ┌────────────────────────────▼───────────────────────────────────┐   │
│   │  NestJS Backend API (Auth, Business Logic, Data Management)    │   │
│   └────────────────────────────┬───────────────────────────────────┘   │
│                                 │                                       │
│        ┌────────────────────────┼────────────────────────┐             │
│        │                        │                        │             │
│   ┌────▼─────┐          ┌──────▼──────┐        ┌───────▼────────┐    │
│   │PostgreSQL│          │    Redis    │        │  Background    │    │
│   │ Database │          │   Cache     │        │  Job Queue     │    │
│   └──────────┘          └─────────────┘        └────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼─────────────────────────┐
│         │   External Services & Integrations                             │
│         │                  │                  │                         │
│   ┌─────▼────────┐   ┌────▼─────────┐  ┌─────▼──────────┐             │
│   │ OpenAI API   │   │Email Service │  │Cloud Storage   │             │
│   │ (ChatGPT-4)  │   │(SendGrid/SES)│  │(S3/GCS/Azure)  │             │
│   └──────────────┘   └──────────────┘  └────────────────┘             │
└────────────────────────────────────────────────────────────────────────┘
```

### External Dependencies

**Critical Dependencies:**

| Service | Purpose | Type | SLA/Availability | Data Sensitivity |
|---------|---------|------|------------------|------------------|
| OpenAI API | AI-powered student analysis | REST API | 99.9% (OpenAI SLA) | High (student observations) |
| PostgreSQL | Primary data store | Managed Database | 99.95% (Cloud provider) | Critical (all student data) |
| Redis | Session & cache | Managed Cache | 99.9% (Cloud provider) | Medium (session tokens) |
| Email Service | Transactional emails | REST API | 99.95% (SendGrid/SES) | Low (notifications only) |
| Cloud Storage | File storage (PDFs, CSVs) | Object Storage | 99.99% (S3/GCS) | Medium (exported reports) |
| SSO Provider | Google/Microsoft OAuth | OAuth 2.0 | 99.9% (external) | Medium (auth tokens) |

### Actors

| Actor | Type | Interaction | Access Level |
|-------|------|-------------|--------------|
| Teacher | Human | Web UI (dashboard, analysis interface) | Own students only |
| Principal | Human | Web UI (school-wide dashboards) | All students in school |
| District Admin | Human | Web UI (district-wide analytics) | All students in district |
| OpenAI API | System | Server-to-server (analysis generation) | No direct data access |
| Email Service | System | Server-to-server (notifications) | Email addresses only |
| Cloud Storage | System | Server-to-server (file upload/download) | Uploaded files only |

---

## 3. High-Level Architecture

### Architecture Style

**Style:** Modular Monolith with Backend for Frontend (BFF) pattern

**Rationale:**
- **Monolithic initially:** Faster development, simpler deployment, easier debugging for MVP
- **Modular design:** NestJS modules organized by domain (auth, students, analysis, etc.) enable future microservices extraction if needed
- **BFF pattern:** Next.js server-side components handle frontend-specific logic, reducing backend coupling
- **Event-driven elements:** Background job queue (BullMQ) for async operations (CSV imports, email sending, report generation)

**Why not microservices?**
- Premature for 100-500 concurrent users
- Increases operational complexity (orchestration, distributed tracing, service mesh)
- Monolith with clear module boundaries provides 80% of benefits with 20% of complexity
- Can extract services later when specific scaling bottlenecks emerge (e.g., AI analysis service)

### System Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                Client Tier                                        │
│                                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │                         Next.js 14+ (App Router)                            │  │
│  │                                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Teacher      │  │ Principal    │  │ Auth Pages   │  │ Public Pages │   │  │
│  │  │ Dashboard    │  │ Dashboard    │  │ (Login/SSO)  │  │ (Marketing)  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  │                                                                              │  │
│  │  Features: React Server Components, Streaming SSR, Client-side Hydration   │  │
│  └────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                   │ REST API (HTTPS/JSON)                         │
└───────────────────────────────────┼───────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼───────────────────────────────────────────────┐
│                              Application Tier                                      │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                    NestJS 10+ Backend API Server                              │ │
│  │                                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                        Core Modules (Domain-Driven)                      │ │ │
│  │  │                                                                           │ │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │ │
│  │  │  │   Auth   │  │ Students │  │ Analysis │  │  Users   │  │ Schools  │ │ │ │
│  │  │  │  Module  │  │  Module  │  │  Module  │  │  Module  │  │  Module  │ │ │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │ │
│  │  │                                                                           │ │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │ │ │
│  │  │  │  Classes │  │Analytics │  │ OpenAI   │  │  Files   │                │ │ │
│  │  │  │  Module  │  │  Module  │  │ Integration│ Module  │                │ │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │ │ │
│  │  └───────────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    Cross-Cutting Concerns (Shared)                       │ │ │
│  │  │                                                                           │ │ │
│  │  │  • Guards (Auth, RBAC)        • Interceptors (Logging, Caching)         │ │ │
│  │  │  • Pipes (Validation)         • Filters (Error Handling)                │ │ │
│  │  │  • Middleware (CORS, Helmet)  • Decorators (Custom)                     │ │ │
│  │  └───────────────────────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────┬───────────────────────────────────────────────┘ │
│                                   │                                                 │
└───────────────────────────────────┼─────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────────────────┐
│                              Data & Infrastructure Tier                              │
│                                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────────────┐ │
│  │   PostgreSQL 15+     │  │     Redis 7+         │  │  BullMQ Job Queue         │ │
│  │   Primary Database   │  │   Cache & Sessions   │  │  (Background Jobs)        │ │
│  │                      │  │                      │  │                           │ │
│  │  • Students          │  │  • Session Store     │  │  • CSV Imports            │ │
│  │  • Users             │  │  • Dashboard Cache   │  │  • Report Generation      │ │
│  │  • Analyses          │  │  • API Rate Limits   │  │  • Email Queue            │ │
│  │  • Schools/Classes   │  │  • Temp Data         │  │  • Analytics Pre-compute  │ │
│  └──────────────────────┘  └──────────────────────┘  └───────────────────────────┘ │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────────────────┐
│                          External Services Integration                               │
│                                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────────────┐ │
│  │   OpenAI API         │  │  Email Service       │  │  Cloud Storage            │ │
│  │   (ChatGPT-4)        │  │  (SendGrid/SES)      │  │  (S3/GCS/Azure Blob)      │ │
│  │                      │  │                      │  │                           │ │
│  │  • Student Analysis  │  │  • Password Reset    │  │  • PDF Exports            │ │
│  │  • Prompt Management │  │  • Notifications     │  │  • CSV Uploads            │ │
│  │  • Token Tracking    │  │  • Weekly Digests    │  │  • User Attachments       │ │
│  └──────────────────────┘  └──────────────────────┘  └───────────────────────────┘ │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Components

#### Component 1: Frontend - Next.js Application

**Responsibility:**
- Server-side rendering and static generation for optimal performance
- User interface for teachers (analysis workflow, student management, dashboards)
- User interface for principals (school-wide analytics, trends)
- Client-side state management (form state, UI state)
- API client for backend communication
- Authentication UI (login, password reset, profile)

**Technology Stack:**
- **Framework:** Next.js 14+ with App Router (React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3+
- **State Management:** React Context + Zustand (for complex client state)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (composable, customizable, React-native)
- **HTTP Client:** Native fetch with Next.js extensions
- **UI Components:** Radix UI primitives + custom components

**Key Interfaces:**
- **User-facing:**
  - `/login` - Authentication page
  - `/dashboard` - Role-based dashboard (teacher vs. principal)
  - `/students` - Student management (list, add, edit)
  - `/students/:id/analyze` - AI analysis interface
  - `/students/:id/history` - Analysis history
  - `/analytics` - Trends and insights
  - `/settings` - User profile and settings

- **API Communication:**
  - REST API client abstraction layer
  - Automatic token refresh
  - Error handling and retry logic

**Dependencies:**
- Backend API (REST endpoints)
- Browser APIs (localStorage for client state, SessionStorage for temp data)

**Deployment:**
- Containerized (Docker)
- Served via CDN for static assets
- SSR via Node.js runtime

---

#### Component 2: Backend - NestJS API Server

**Responsibility:**
- RESTful API for all business logic
- Authentication and authorization (JWT + RBAC)
- Student and user data management (CRUD operations)
- AI analysis orchestration (OpenAI API integration)
- Background job scheduling and processing
- Email notifications
- File upload/download management
- Database operations (ORM abstraction)
- Audit logging for compliance

**Technology Stack:**
- **Framework:** NestJS 10+ (modular architecture)
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 5+ (type-safe database client)
- **Authentication:** Passport.js (local + OAuth strategies)
- **Validation:** class-validator + class-transformer
- **Logging:** Winston (structured JSON logs)
- **Job Queue:** BullMQ (Redis-backed)
- **HTTP:** Express.js (NestJS default)
- **API Documentation:** Swagger/OpenAPI (auto-generated)

**Key Modules:**

1. **AuthModule**
   - JWT token generation and validation
   - Session management
   - SSO integration (Google, Microsoft)
   - Password hashing (bcrypt)
   - Role-based guards

2. **UsersModule**
   - User CRUD operations
   - Profile management
   - Role assignment
   - Teacher-school affiliation

3. **StudentsModule**
   - Student CRUD operations
   - CSV import processing
   - Student search and filtering
   - Archive/restore functionality

4. **AnalysisModule**
   - Analysis session management
   - OpenAI API integration
   - Analysis history tracking
   - Recommendation generation
   - PDF export

5. **SchoolsModule**
   - School and class management
   - Organizational hierarchy
   - Access control boundaries

6. **AnalyticsModule**
   - Dashboard aggregations
   - Trend calculations
   - Report generation
   - Data export (CSV, PDF)

7. **FilesModule**
   - File upload/download
   - Cloud storage integration
   - File validation and sanitization

8. **OpenAIModule**
   - API client wrapper
   - Prompt template management
   - Token usage tracking
   - Rate limiting and quota enforcement
   - Error handling and retries

**Key Interfaces:**
- REST API endpoints (see Section 5: API Design)
- Database via Prisma ORM
- Redis for cache and jobs
- External services (OpenAI, Email, Storage)

**Dependencies:**
- PostgreSQL database
- Redis cache
- OpenAI API
- Email service
- Cloud storage

**Deployment:**
- Containerized (Docker)
- Horizontally scalable (stateless)
- Auto-scaling based on CPU/memory

---

#### Component 3: Database - PostgreSQL

**Responsibility:**
- Primary data persistence for all entities
- Relational integrity enforcement
- Transaction management
- Full-text search (students, analyses)
- Backup and point-in-time recovery

**Technology:**
- PostgreSQL 15+ (managed service: AWS RDS, Google Cloud SQL, or Azure Database)
- Extensions: pgcrypto (encryption), pg_trgm (fuzzy search)

**Key Schema Areas:**
- Users and authentication
- Schools, classes, organizational structure
- Students and enrollment
- Analyses and recommendations
- Audit logs

**Scaling Strategy:**
- Vertical scaling (increase instance size) for initial growth
- Read replicas for analytics and reporting queries (separate from transactional load)
- Connection pooling (PgBouncer or built-in cloud provider pooling)
- Partitioning for large tables (analyses table partitioned by date)

---

#### Component 4: Cache Layer - Redis

**Responsibility:**
- Session storage (user sessions, JWT blacklist)
- API rate limiting (per-user, per-IP)
- Dashboard data caching (expensive aggregations)
- Temporary data (analysis in-progress state)
- Background job queue (BullMQ backing store)

**Technology:**
- Redis 7+ (managed service: AWS ElastiCache, Google Memorystore, Azure Cache)

**Cache Patterns:**
- **TTL-based expiration:** Dashboard caches expire after 5 minutes
- **Write-through:** Critical data written to DB first, then cached
- **Cache-aside:** Read from cache, fallback to DB on miss
- **Invalidation:** Explicit invalidation on data updates

**Key Namespaces:**
- `session:*` - User sessions (TTL: 30 minutes)
- `cache:dashboard:*` - Dashboard aggregations (TTL: 5 minutes)
- `ratelimit:*` - API rate limits (TTL: 1 hour)
- `bull:*` - BullMQ job queues

---

#### Component 5: Background Job Queue - BullMQ

**Responsibility:**
- Asynchronous task processing
- CSV import processing (large files)
- Report generation (PDF exports)
- Email sending (batch notifications)
- Analytics pre-computation (nightly aggregations)

**Technology:**
- BullMQ (Redis-backed, Node.js job queue)

**Job Types:**
- `csv-import` - Process uploaded CSV files (priority: medium, retry: 3)
- `generate-report` - Create PDF reports (priority: low, retry: 2)
- `send-email` - Send transactional emails (priority: high, retry: 5)
- `compute-analytics` - Pre-compute dashboard aggregations (priority: low, cron: daily)

**Features:**
- Job retries with exponential backoff
- Priority queues
- Scheduled jobs (cron-like)
- Progress tracking
- Dead letter queue for failed jobs

---

## 4. Data Architecture

### Data Model

#### Entity Relationship Diagram

```
┌─────────────────────┐
│      District       │
│─────────────────────│
│ id (PK)             │
│ name                │
│ state               │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │ 1
           │
           │ *
┌──────────▼──────────┐         ┌─────────────────────┐
│       School        │         │      User           │
│─────────────────────│         │─────────────────────│
│ id (PK)             │         │ id (PK)             │
│ district_id (FK)    │         │ email (UNIQUE)      │
│ name                │         │ password_hash       │
│ address             │         │ first_name          │
│ principal_user_id   │◄────────│ last_name           │
│ created_at          │         │ role (ENUM)         │
│ updated_at          │         │ school_id (FK)      │
└──────────┬──────────┘         │ sso_provider        │
           │ 1                  │ sso_id              │
           │                    │ mfa_enabled         │
           │ *                  │ last_login_at       │
┌──────────▼──────────┐         │ created_at          │
│       Class         │         │ updated_at          │
│─────────────────────│         └──────────┬──────────┘
│ id (PK)             │                    │ 1
│ school_id (FK)      │                    │
│ teacher_id (FK)     │────────────────────┘
│ name                │
│ grade_level         │
│ subject             │
│ academic_year       │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │ 1
           │
           │ *
┌──────────▼──────────┐         ┌─────────────────────┐
│      Student        │         │     Analysis        │
│─────────────────────│         │─────────────────────│
│ id (PK)             │ 1       │ id (PK)             │
│ first_name          │────────►│ student_id (FK)     │
│ last_name           │      *  │ teacher_id (FK)     │
│ student_id_number   │         │ session_started_at  │
│ grade_level         │         │ session_completed_at│
│ date_of_birth       │         │ conversation (JSONB)│
│ is_archived         │         │ ai_response (JSONB) │
│ created_at          │         │ strengths (JSONB[]) │
│ updated_at          │         │ weaknesses (JSONB[])│
└─────────────────────┘         │ recommendations     │
                                │   (JSONB[])         │
                                │ teacher_notes (TEXT)│
┌─────────────────────┐         │ is_flagged          │
│  StudentEnrollment  │         │ status (ENUM)       │
│─────────────────────│         │ created_at          │
│ id (PK)             │         │ updated_at          │
│ student_id (FK)     │         └─────────────────────┘
│ class_id (FK)       │
│ enrollment_date     │         ┌─────────────────────┐
│ withdrawal_date     │         │    AuditLog         │
│ created_at          │         │─────────────────────│
└─────────────────────┘         │ id (PK)             │
                                │ user_id (FK)        │
                                │ action (ENUM)       │
                                │ entity_type         │
                                │ entity_id           │
                                │ metadata (JSONB)    │
                                │ ip_address          │
                                │ created_at          │
                                └─────────────────────┘
```

---

#### Detailed Entity Definitions

**User Entity**

```typescript
interface User {
  id: string;                    // UUID (primary key)
  email: string;                 // Unique, indexed
  password_hash: string;         // bcrypt (10 rounds) - nullable if SSO only
  first_name: string;
  last_name: string;
  role: 'teacher' | 'principal' | 'district_admin';
  school_id: string;             // Foreign key to School
  sso_provider: 'google' | 'microsoft' | null;
  sso_id: string | null;         // External ID from SSO provider
  mfa_enabled: boolean;          // Default: false
  mfa_secret: string | null;     // TOTP secret (encrypted)
  last_login_at: Date | null;
  is_active: boolean;            // Soft delete flag
  created_at: Date;
  updated_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `school_id` (for principal queries)
- Index on `role, school_id` (composite for RBAC)

---

**Student Entity**

```typescript
interface Student {
  id: string;                    // UUID (primary key)
  first_name: string;
  last_name: string;
  student_id_number: string | null;  // School-provided ID (optional)
  grade_level: number;           // 1-12 or K=0
  date_of_birth: Date | null;    // Optional, for age-appropriate recommendations
  is_archived: boolean;          // Soft delete (graduated, transferred)
  created_by_user_id: string;    // Foreign key to User (teacher who added)
  school_id: string;             // Foreign key to School (denormalized for performance)
  created_at: Date;
  updated_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Index on `school_id, is_archived` (principal dashboard queries)
- Full-text index on `first_name, last_name` (search)
- Index on `grade_level` (filtering)

---

**School Entity**

```typescript
interface School {
  id: string;                    // UUID (primary key)
  district_id: string | null;    // Foreign key to District (nullable for standalone schools)
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  principal_user_id: string | null;  // Foreign key to User
  settings: {                    // JSONB field for school-specific settings
    analysis_quota_per_month?: number;
    enable_parent_sharing?: boolean;
    custom_prompts?: string[];
  };
  created_at: Date;
  updated_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Index on `district_id`
- Index on `name` (for search)

---

**Class Entity**

```typescript
interface Class {
  id: string;                    // UUID (primary key)
  school_id: string;             // Foreign key to School
  teacher_id: string;            // Foreign key to User (teacher)
  name: string;                  // e.g., "Math Period 3", "5th Grade Room 201"
  grade_level: number | null;    // Optional (multi-grade classes)
  subject: string | null;        // e.g., "Math", "Science", "Homeroom"
  academic_year: string;         // e.g., "2024-2025"
  is_archived: boolean;          // For past academic years
  created_at: Date;
  updated_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Index on `teacher_id` (teacher dashboard)
- Index on `school_id, academic_year` (principal view)

---

**StudentEnrollment Entity** (Many-to-Many Join Table)

```typescript
interface StudentEnrollment {
  id: string;                    // UUID (primary key)
  student_id: string;            // Foreign key to Student
  class_id: string;              // Foreign key to Class
  enrollment_date: Date;         // When student joined class
  withdrawal_date: Date | null;  // When student left class (null = active)
  created_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Unique index on `student_id, class_id` (prevent duplicate enrollments)
- Index on `class_id` (class roster queries)

---

**Analysis Entity**

```typescript
interface Analysis {
  id: string;                    // UUID (primary key)
  student_id: string;            // Foreign key to Student
  teacher_id: string;            // Foreign key to User (teacher who conducted)
  session_started_at: Date;
  session_completed_at: Date | null;  // Null if in-progress or abandoned
  status: 'in_progress' | 'completed' | 'abandoned';

  // Conversation data (stored as JSONB for flexibility)
  conversation: {
    question: string;
    answer: string;
    timestamp: Date;
  }[];

  // AI-generated analysis (JSONB)
  ai_response: {
    raw_response: string;        // Full AI response text
    generated_at: Date;
  };

  // Parsed structured data from AI response
  strengths: {
    category: string;            // e.g., "Academic", "Behavioral", "Social"
    description: string;
    confidence: number;          // 0-1 (AI confidence score)
  }[];

  weaknesses: {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];

  recommendations: {
    category: string;
    intervention: string;
    priority: number;            // 1-5
    evidence: string;            // Citation to teacher input
  }[];

  // Teacher input
  teacher_notes: string | null;  // Private notes not visible to principal
  is_flagged: boolean;           // Urgent attention needed

  // Cost tracking
  tokens_used: number;           // Total OpenAI tokens consumed
  estimated_cost: number;        // In USD cents

  created_at: Date;
  updated_at: Date;
}
```

**Indexes:**
- Primary key on `id`
- Index on `student_id, session_completed_at DESC` (history view)
- Index on `teacher_id, session_completed_at DESC` (teacher dashboard)
- Index on `is_flagged, created_at DESC` (flagged students)
- Partial index on `status = 'in_progress'` (resume sessions)

---

**AuditLog Entity** (Compliance requirement)

```typescript
interface AuditLog {
  id: string;                    // UUID (primary key)
  user_id: string | null;        // Foreign key to User (null for system actions)
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'login' | 'logout';
  entity_type: 'user' | 'student' | 'analysis' | 'school' | 'class';
  entity_id: string;             // ID of affected entity
  metadata: {                    // JSONB for flexible logging
    changes?: Record<string, any>;  // Before/after for updates
    reason?: string;
    ip_address?: string;
  };
  ip_address: string;
  user_agent: string;
  created_at: Date;              // Immutable (no updated_at)
}
```

**Indexes:**
- Primary key on `id`
- Index on `user_id, created_at DESC` (user activity history)
- Index on `entity_type, entity_id, created_at DESC` (entity audit trail)
- Index on `action, created_at DESC` (compliance queries)

---

### Database Schema Strategy

#### Migrations

**Tool:** Prisma Migrate (declarative schema management)

**Strategy:**
- **Development:** `prisma migrate dev` for rapid iteration
- **Production:** `prisma migrate deploy` (no automatic schema changes)
- All migrations version-controlled in Git
- Roll-forward only (no rollbacks, create new migration to revert)
- Test migrations in staging before production

**Naming Convention:**
- `YYYYMMDDHHMMSS_descriptive_name.sql`
- Example: `20250130120000_add_student_enrollment_table.sql`

---

#### Data Retention Policy

**Compliance Requirement:** FERPA allows schools to retain records indefinitely, but best practice is defined retention

**Retention Strategy:**
- **Active students:** Retain all data while enrolled
- **Archived students:** Retain for 7 years after graduation/transfer (configurable per district)
- **Audit logs:** Retain for 7 years (compliance requirement)
- **Analysis data:** Retain with student records
- **Deleted users:** Anonymize instead of hard delete (preserve audit trails)

**Implementation:**
- Nightly background job identifies records eligible for deletion
- Soft delete first (mark as deleted, retain for 90 days)
- Hard delete after 90-day grace period (allows recovery from accidental deletion)
- Automated anonymization scripts for GDPR compliance

---

#### Backup Strategy

**Objective:** RPO (Recovery Point Objective) = 1 hour, RTO (Recovery Time Objective) = 4 hours

**Backup Types:**
1. **Automated daily full backups** (managed by cloud provider)
   - Retention: 30 days
   - Encrypted at rest
   - Stored in separate geographic region

2. **Automated incremental backups** (every 6 hours)
   - Retention: 7 days
   - Point-in-time recovery capability

3. **Transaction log backups** (continuous)
   - Enables recovery to any moment within 7 days

**Backup Testing:**
- Monthly restore drills to staging environment
- Quarterly disaster recovery exercises
- Automated backup verification (check for corruption)

---

#### Database Optimization

**Indexing Strategy:**
- Index all foreign keys (for joins)
- Composite indexes for common query patterns (e.g., `school_id, is_archived`)
- Full-text search indexes on name fields (using PostgreSQL pg_trgm)
- Partial indexes for filtered queries (e.g., `WHERE status = 'in_progress'`)

**Query Optimization:**
- Use `EXPLAIN ANALYZE` for slow queries (>500ms)
- Connection pooling (PgBouncer) - max 100 connections
- Prepared statements to reduce parsing overhead
- Query result caching in Redis for expensive aggregations

**Scaling Plan:**
- **Phase 1 (0-50k students):** Single PostgreSQL instance (vertical scaling)
- **Phase 2 (50k-200k students):** Add read replicas for analytics queries
- **Phase 3 (200k+ students):** Partition large tables (analyses by date), shard by school district

---

### Data Flow

#### Write Path (Creating an Analysis)

```
User submits analysis
    ↓
Next.js Frontend validates input
    ↓
POST /api/v1/analyses (REST API)
    ↓
NestJS validation pipe (class-validator)
    ↓
AnalysisService.create()
    ↓
┌─────────────────────────────────────────┐
│  1. Start database transaction          │
│  2. Insert Analysis record (status: in_progress)
│  3. Call OpenAI API (with retry logic)  │
│  4. Parse AI response                   │
│  5. Update Analysis record with results │
│  6. Commit transaction                  │
│  7. Invalidate related caches           │
└─────────────────────────────────────────┘
    ↓
AuditLog.create() (async, no blocking)
    ↓
Response sent to frontend
    ↓
Frontend updates UI
```

**Error Handling:**
- If OpenAI API fails: Mark analysis as `abandoned`, log error, notify user
- If database transaction fails: Rollback, return 500 error
- If cache invalidation fails: Log warning but don't fail request

---

#### Read Path (Loading Principal Dashboard)

```
Principal visits dashboard
    ↓
Next.js Server Component fetches data
    ↓
GET /api/v1/analytics/dashboard
    ↓
NestJS AnalyticsController
    ↓
Check Redis cache (key: cache:dashboard:school:{school_id})
    ↓
Cache HIT? → Return cached data (sub-second response)
    ↓
Cache MISS? → AnalyticsService.getDashboardData()
    ↓
┌─────────────────────────────────────────┐
│  1. Query database (complex aggregations)│
│     - Total students                     │
│     - Analysis completion rate           │
│     - Flagged students                   │
│     - Trends over time                   │
│  2. Transform data for frontend          │
│  3. Store in Redis (TTL: 5 minutes)      │
└─────────────────────────────────────────┘
    ↓
Response sent to frontend
    ↓
Next.js renders dashboard (SSR or RSC)
```

**Performance Optimization:**
- Cache TTL: 5 minutes (balance freshness vs. performance)
- Database query optimization: Use aggregations, avoid N+1 queries
- Pagination: Limit to 50 results per page
- Lazy loading: Load charts only when scrolled into view

---

### Caching Strategy

#### Cache Layers

1. **Browser Cache** (Client-side)
   - Static assets (JS, CSS, images): 30 days
   - API responses: No cache (use server-side caching)

2. **CDN Cache** (Edge)
   - Next.js static pages: 24 hours
   - API responses: No cache (dynamic content)

3. **Application Cache** (Redis)
   - Session data: 30 minutes (sliding expiration)
   - Dashboard aggregations: 5 minutes
   - Rate limit counters: 1 hour
   - API response cache: Varies by endpoint

4. **Database Cache** (PostgreSQL)
   - Query result cache (built-in): Automatic
   - Connection pool: Reuse connections (max 100)

---

#### Cache Invalidation Strategy

**Cache-Aside Pattern:**
- Read: Check cache → If miss, query DB → Store in cache
- Write: Update DB → Invalidate cache → Next read repopulates

**Example: Student Update**
```typescript
async updateStudent(id: string, data: UpdateStudentDto) {
  // 1. Update database
  const student = await this.prisma.student.update({
    where: { id },
    data,
  });

  // 2. Invalidate related caches
  await this.cacheService.delete(`student:${id}`);
  await this.cacheService.deletePattern(`dashboard:*:${student.schoolId}`);
  await this.cacheService.delete(`class:roster:*`);

  // 3. Return updated student
  return student;
}
```

**Invalidation Triggers:**
- Student created/updated/deleted → Invalidate student cache, dashboard cache, roster cache
- Analysis completed → Invalidate student cache, dashboard cache, analytics cache
- User role changed → Invalidate session, RBAC cache

---

## 5. API Design

### API Style

**Style:** RESTful API with JSON payloads

**Rationale:**
- Simple and widely understood
- Excellent tooling (Postman, Swagger UI)
- Native Next.js support
- Easy to cache and version

**Version Strategy:**
- URL-based versioning: `/api/v1/*`
- V1 for MVP, V2 for breaking changes
- Maintain backward compatibility for 12 months after deprecation

---

### Authentication

**Method:** JWT (JSON Web Tokens) + HTTP-only cookies

**Flow:**
1. User logs in → POST `/api/v1/auth/login`
2. Server validates credentials → Generates JWT (access token + refresh token)
3. Access token (short-lived: 15 minutes) + Refresh token (long-lived: 7 days)
4. Tokens stored in HTTP-only cookies (secure, sameSite: strict)
5. Frontend includes cookies automatically on each request
6. Backend validates token via middleware (Passport.js JWT strategy)

**Token Payload:**
```json
{
  "sub": "user-id-uuid",
  "email": "teacher@school.edu",
  "role": "teacher",
  "schoolId": "school-id-uuid",
  "iat": 1704067200,
  "exp": 1704067800
}
```

---

### API Endpoints

#### Authentication & Users

**POST /api/v1/auth/register**
Create new user account (requires invite token or admin role)

Request:
```json
{
  "email": "teacher@school.edu",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher",
  "schoolId": "uuid",
  "inviteToken": "token-from-email"
}
```

Response (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "teacher@school.edu",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "teacher",
    "schoolId": "uuid"
  },
  "message": "Account created successfully. Please check your email to verify."
}
```

---

**POST /api/v1/auth/login**
Authenticate user (email/password or SSO)

Request:
```json
{
  "email": "teacher@school.edu",
  "password": "SecurePass123!"
}
```

Response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "teacher@school.edu",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "teacher",
    "schoolId": "uuid"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Cookies Set:
- `access_token` (HTTP-only, secure, sameSite: strict, maxAge: 15 min)
- `refresh_token` (HTTP-only, secure, sameSite: strict, maxAge: 7 days)

---

**POST /api/v1/auth/sso/google**
Initiate Google SSO flow

Response (302): Redirect to Google OAuth consent screen

---

**GET /api/v1/auth/sso/google/callback**
Handle Google SSO callback

Query Params: `code`, `state`

Response (302): Redirect to dashboard with tokens set

---

**POST /api/v1/auth/logout**
Logout user (invalidate tokens)

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

---

**POST /api/v1/auth/refresh**
Refresh access token using refresh token

Response (200):
```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

**GET /api/v1/users/me**
Get current user profile

Response (200):
```json
{
  "id": "uuid",
  "email": "teacher@school.edu",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teacher",
  "schoolId": "uuid",
  "school": {
    "id": "uuid",
    "name": "Lincoln Elementary"
  },
  "lastLoginAt": "2025-01-30T10:00:00Z"
}
```

---

**PATCH /api/v1/users/me**
Update current user profile

Request:
```json
{
  "firstName": "Jane",
  "lastName": "Smith-Jones"
}
```

Response (200): Updated user object

---

**POST /api/v1/users/me/change-password**
Change password

Request:
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

Response (200):
```json
{
  "message": "Password changed successfully"
}
```

---

#### Students

**GET /api/v1/students**
List students (filtered by user role)

Query Params:
- `classId` (optional): Filter by class
- `gradeLevel` (optional): Filter by grade
- `search` (optional): Search by name
- `isArchived` (optional, default: false)
- `page` (default: 1)
- `limit` (default: 50)

Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "gradeLevel": 5,
      "studentIdNumber": "12345",
      "classes": [
        {
          "id": "uuid",
          "name": "Math Period 3"
        }
      ],
      "lastAnalysisDate": "2025-01-15T14:00:00Z",
      "analysisCount": 3,
      "isFlagged": false
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

**POST /api/v1/students**
Create new student

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gradeLevel": 5,
  "studentIdNumber": "12345",
  "dateOfBirth": "2015-06-15",
  "classIds": ["class-uuid-1", "class-uuid-2"]
}
```

Response (201): Created student object

---

**GET /api/v1/students/:id**
Get student details

Response (200):
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "gradeLevel": 5,
  "studentIdNumber": "12345",
  "dateOfBirth": "2015-06-15",
  "classes": [...],
  "analyses": [
    {
      "id": "uuid",
      "completedAt": "2025-01-15T14:00:00Z",
      "teacher": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "summary": "Strong in math, needs reading support"
    }
  ],
  "createdAt": "2024-09-01T08:00:00Z"
}
```

---

**PATCH /api/v1/students/:id**
Update student

Request:
```json
{
  "gradeLevel": 6,
  "classIds": ["new-class-uuid"]
}
```

Response (200): Updated student object

---

**DELETE /api/v1/students/:id**
Archive student (soft delete)

Response (200):
```json
{
  "message": "Student archived successfully"
}
```

---

**POST /api/v1/students/import**
Bulk import students via CSV

Request (multipart/form-data):
- `file`: CSV file (max 5MB)

CSV Format:
```csv
firstName,lastName,gradeLevel,studentIdNumber,classId
John,Doe,5,12345,class-uuid-1
Jane,Smith,5,12346,class-uuid-1
```

Response (202 Accepted):
```json
{
  "jobId": "job-uuid",
  "message": "Import started. You will be notified when complete.",
  "estimatedTime": "2 minutes"
}
```

---

**GET /api/v1/students/import/:jobId**
Check import job status

Response (200):
```json
{
  "jobId": "job-uuid",
  "status": "completed",
  "progress": 100,
  "results": {
    "total": 50,
    "created": 48,
    "updated": 0,
    "errors": 2,
    "errorDetails": [
      {
        "row": 15,
        "error": "Invalid grade level"
      }
    ]
  }
}
```

---

#### Analyses

**GET /api/v1/analyses**
List analyses (filtered by user role)

Query Params:
- `studentId` (optional): Filter by student
- `teacherId` (optional): Filter by teacher (principals only)
- `isFlagged` (optional): Filter flagged analyses
- `status` (optional): `completed`, `in_progress`, `abandoned`
- `startDate`, `endDate` (optional): Date range filter
- `page`, `limit`

Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "student": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "teacher": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "completedAt": "2025-01-15T14:00:00Z",
      "isFlagged": false,
      "summary": "Strong in math, needs reading support"
    }
  ],
  "meta": {...}
}
```

---

**POST /api/v1/analyses**
Start new analysis session

Request:
```json
{
  "studentId": "uuid"
}
```

Response (201):
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "status": "in_progress",
  "sessionStartedAt": "2025-01-30T10:00:00Z",
  "conversation": [],
  "nextQuestion": "Tell me about John's recent academic performance in your class. What subjects does he excel in?"
}
```

---

**POST /api/v1/analyses/:id/respond**
Submit answer to analysis question

Request:
```json
{
  "answer": "John is really strong in math. He solves problems quickly and helps other students. He struggles with reading comprehension though."
}
```

Response (200):
```json
{
  "id": "uuid",
  "conversation": [
    {
      "question": "Tell me about John's recent academic performance...",
      "answer": "John is really strong in math...",
      "timestamp": "2025-01-30T10:01:00Z"
    }
  ],
  "nextQuestion": "Can you describe specific examples of his math strengths?",
  "isComplete": false
}
```

---

**POST /api/v1/analyses/:id/complete**
Finalize analysis and generate recommendations

Response (200):
```json
{
  "id": "uuid",
  "status": "completed",
  "completedAt": "2025-01-30T10:10:00Z",
  "strengths": [
    {
      "category": "Academic - Math",
      "description": "Demonstrates advanced problem-solving skills",
      "confidence": 0.95
    },
    {
      "category": "Social",
      "description": "Helps peers understand concepts",
      "confidence": 0.88
    }
  ],
  "weaknesses": [
    {
      "category": "Academic - Reading",
      "description": "Reading comprehension below grade level",
      "severity": "medium"
    }
  ],
  "recommendations": [
    {
      "category": "Academic Intervention",
      "intervention": "Provide daily 15-minute guided reading sessions focusing on comprehension strategies",
      "priority": 1,
      "evidence": "Teacher observed struggles with reading comprehension"
    },
    {
      "category": "Enrichment",
      "intervention": "Consider math enrichment program or peer tutoring role",
      "priority": 2,
      "evidence": "Advanced math skills and helps peers"
    }
  ]
}
```

---

**GET /api/v1/analyses/:id**
Get analysis details

Response (200): Full analysis object with conversation, strengths, weaknesses, recommendations

---

**PATCH /api/v1/analyses/:id**
Update analysis (edit recommendations, add teacher notes)

Request:
```json
{
  "teacherNotes": "Spoke with reading specialist, will implement guided reading starting next week",
  "isFlagged": true
}
```

Response (200): Updated analysis object

---

**DELETE /api/v1/analyses/:id**
Delete analysis (soft delete)

Response (200):
```json
{
  "message": "Analysis deleted successfully"
}
```

---

**GET /api/v1/analyses/:id/export**
Export analysis as PDF

Response (200): PDF file download

---

#### Classes

**GET /api/v1/classes**
List classes (filtered by user role)

Query Params:
- `schoolId` (optional, principals/admins only)
- `teacherId` (optional, principals/admins only)
- `academicYear` (optional, default: current year)
- `isArchived` (optional, default: false)

Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Math Period 3",
      "gradeLevel": 5,
      "subject": "Math",
      "academicYear": "2024-2025",
      "teacher": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "studentCount": 28
    }
  ],
  "meta": {...}
}
```

---

**POST /api/v1/classes**
Create new class

Request:
```json
{
  "name": "Math Period 3",
  "gradeLevel": 5,
  "subject": "Math",
  "academicYear": "2024-2025"
}
```

Response (201): Created class object

---

**GET /api/v1/classes/:id**
Get class details with student roster

Response (200):
```json
{
  "id": "uuid",
  "name": "Math Period 3",
  "gradeLevel": 5,
  "subject": "Math",
  "students": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "lastAnalysisDate": "2025-01-15T14:00:00Z"
    }
  ]
}
```

---

**PATCH /api/v1/classes/:id**
Update class

**DELETE /api/v1/classes/:id**
Archive class

---

#### Analytics & Dashboards

**GET /api/v1/analytics/dashboard**
Get role-based dashboard data

Response for Teachers (200):
```json
{
  "overview": {
    "totalStudents": 75,
    "analysesCompleted": 60,
    "completionRate": 0.8,
    "flaggedStudents": 3,
    "pendingAnalyses": 15
  },
  "recentAnalyses": [...],
  "flaggedStudents": [...]
}
```

Response for Principals (200):
```json
{
  "overview": {
    "totalStudents": 450,
    "totalTeachers": 20,
    "analysesCompleted": 380,
    "completionRate": 0.84,
    "flaggedStudents": 15
  },
  "teacherActivity": [
    {
      "teacher": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "analysesCompleted": 60,
      "completionRate": 0.95
    }
  ],
  "trends": {
    "commonStrengths": [
      {
        "category": "Academic - Math",
        "count": 120
      }
    ],
    "commonWeaknesses": [
      {
        "category": "Academic - Reading",
        "count": 85
      }
    ]
  }
}
```

---

**GET /api/v1/analytics/trends**
Get trend data over time

Query Params:
- `metric`: `completion_rate`, `flagged_count`, `common_strengths`, etc.
- `groupBy`: `day`, `week`, `month`
- `startDate`, `endDate`
- `gradeLevel`, `teacherId` (optional filters)

Response (200):
```json
{
  "metric": "completion_rate",
  "groupBy": "week",
  "data": [
    {
      "period": "2025-W01",
      "value": 0.72
    },
    {
      "period": "2025-W02",
      "value": 0.78
    },
    {
      "period": "2025-W03",
      "value": 0.84
    }
  ]
}
```

---

**GET /api/v1/analytics/export**
Export analytics data as CSV

Query Params: (same as dashboard filters)

Response (200): CSV file download

---

### Error Handling

**Error Response Format:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2025-01-30T10:00:00Z",
  "path": "/api/v1/students",
  "details": [
    {
      "field": "gradeLevel",
      "message": "Grade level must be between 0 and 12"
    }
  ]
}
```

**HTTP Status Codes:**
- `200 OK` - Successful GET/PATCH
- `201 Created` - Successful POST
- `202 Accepted` - Async job started
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - External service (OpenAI) unavailable

---

### Rate Limiting

**Strategy:** Token bucket algorithm (via Redis)

**Limits:**
- **Authenticated users:** 100 requests/minute per user
- **Analysis endpoints:** 10 concurrent sessions per user (prevent OpenAI API abuse)
- **Unauthenticated:** 10 requests/minute per IP (login, password reset)
- **CSV import:** 3 imports/hour per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1704067800
```

**Response on limit exceeded (429):**
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

---

## 6. Integration Architecture

### Integration Patterns

**Pattern:** Direct API calls with circuit breaker and retry logic

**Rationale:**
- Simple to implement and debug
- Sufficient for MVP scale
- Can migrate to message queue (e.g., RabbitMQ) if async requirements grow

---

### Integration 1: OpenAI API (ChatGPT)

**Type:** REST API (HTTPS)

**Purpose:** Generate AI-powered student analysis and recommendations

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Authentication:** Bearer token (API key stored in environment variable)

**Model:** GPT-4 Turbo (`gpt-4-turbo-preview`)

**Request Example:**
```json
{
  "model": "gpt-4-turbo-preview",
  "messages": [
    {
      "role": "system",
      "content": "You are an educational assessment expert helping teachers identify student strengths, weaknesses, and personalized intervention strategies. Responses should be evidence-based, actionable, and formatted as structured JSON."
    },
    {
      "role": "user",
      "content": "Student: John Doe, Grade 5. Teacher observation: John is really strong in math. He solves problems quickly and helps other students. He struggles with reading comprehension though."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1500,
  "response_format": { "type": "json_object" }
}
```

**Response Parsing:**
- Extract structured JSON from AI response
- Validate schema (strengths, weaknesses, recommendations)
- Store raw response + parsed data in database

**Error Handling:**
- **Rate limit (429):** Exponential backoff, retry after rate limit reset
- **API error (500):** Retry up to 3 times with exponential backoff
- **Timeout (>30s):** Retry once, then mark analysis as abandoned
- **Invalid response:** Log error, mark analysis as failed, notify user

**Circuit Breaker:**
- Open circuit after 5 consecutive failures
- Half-open after 1 minute (allow 1 test request)
- Close circuit after 3 successful requests

**Cost Management:**
- Track tokens per request (input + output)
- Aggregate cost per school/month
- Alert when approaching quota limits
- Implement per-school quotas (configurable)

**Token Estimate:**
- Average analysis: 800 input tokens + 700 output tokens = 1500 tokens
- Cost: ~$0.015 per analysis (GPT-4 Turbo pricing)

---

### Integration 2: Email Service (SendGrid or Amazon SES)

**Type:** REST API (HTTPS)

**Purpose:** Send transactional emails (password reset, notifications, weekly digests)

**Recommended Provider:** SendGrid (superior deliverability and templates)

**Authentication:** API key (stored in environment variable)

**Email Types:**

1. **Password Reset**
   - Template: `password-reset`
   - Variables: `userName`, `resetLink`, `expiryTime`
   - Priority: High (immediate send)

2. **Welcome Email**
   - Template: `welcome`
   - Variables: `userName`, `schoolName`, `loginLink`

3. **Flagged Student Alert**
   - Template: `flagged-student`
   - Variables: `studentName`, `teacherName`, `dashboardLink`
   - Priority: High

4. **Weekly Digest**
   - Template: `weekly-digest`
   - Variables: `userName`, `completionRate`, `flaggedCount`, `recentAnalyses`
   - Schedule: Every Monday 8:00 AM (school timezone)

**Request Example (SendGrid):**
```json
{
  "personalizations": [
    {
      "to": [{ "email": "teacher@school.edu", "name": "Jane Smith" }],
      "dynamic_template_data": {
        "userName": "Jane",
        "resetLink": "https://growth-engine.com/reset-password?token=abc123",
        "expiryTime": "1 hour"
      }
    }
  ],
  "from": { "email": "noreply@growth-engine.com", "name": "Growth Engine" },
  "template_id": "d-abc123xyz"
}
```

**Error Handling:**
- **Delivery failure:** Retry 3 times with exponential backoff
- **Invalid email:** Log error, mark email as bounced, notify admin
- **Rate limit:** Queue emails and send in batches

**Monitoring:**
- Track delivery rate, bounce rate, open rate
- Alert on delivery rate <95%
- Suppress emails to addresses with 3+ hard bounces

**Background Job Integration:**
- All emails sent via BullMQ job queue (async, non-blocking)
- Priority queue for critical emails (password reset)
- Batch queue for digest emails (send 100/minute to avoid rate limits)

---

### Integration 3: Cloud Storage (AWS S3 / Google Cloud Storage / Azure Blob)

**Type:** Object Storage (S3-compatible API)

**Purpose:** Store uploaded files (CSV imports) and generated files (PDF reports)

**Authentication:** IAM role (preferred) or access key

**Bucket Structure:**
```
growth-engine-storage/
├── uploads/
│   └── csv/
│       └── {schoolId}/
│           └── {timestamp}-{filename}.csv
└── exports/
    └── pdf/
        └── {schoolId}/
            └── {analysisId}.pdf
```

**Operations:**

1. **Upload CSV:**
   - Pre-signed URL generated by backend (expires in 1 hour)
   - Frontend uploads directly to S3 (reduces backend load)
   - Webhook triggers backend to process file

2. **Generate PDF:**
   - Backend generates PDF (using Puppeteer or similar)
   - Upload to S3
   - Return pre-signed download URL (expires in 24 hours)

**Security:**
- Bucket not publicly accessible (private)
- Pre-signed URLs for temporary access
- Server-side encryption (AES-256)
- Lifecycle policy: Delete uploads after 30 days, exports after 90 days

**Error Handling:**
- **Upload failure:** Retry 3 times, then notify user
- **Storage quota exceeded:** Alert admin, prevent new uploads

---

## 7. Cross-Cutting Concerns

### Security

#### Authentication

**Method:** JWT (JSON Web Tokens) + HTTP-only Cookies

**Token Strategy:**
- **Access Token:** Short-lived (15 minutes), contains user claims (id, email, role, schoolId)
- **Refresh Token:** Long-lived (7 days), stored in database (revocable)
- **Storage:** HTTP-only cookies (secure, sameSite: strict) to prevent XSS

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number
- Password strength meter on frontend (zxcvbn library)
- Hashing: bcrypt (10 rounds)

**SSO Integration:**
- OAuth 2.0 / OpenID Connect
- Supported providers: Google Workspace, Microsoft 365
- Auto-provision users on first SSO login (if email domain matches school)

**MFA (Optional, for admins):**
- TOTP (Time-based One-Time Password) via Google Authenticator, Authy
- QR code enrollment
- Backup codes (10 single-use codes)

**Session Management:**
- Sliding expiration: 30 minutes of inactivity
- Maximum session duration: 12 hours
- Logout invalidates tokens (add to Redis blacklist)

---

#### Authorization

**Model:** Role-Based Access Control (RBAC)

**Roles:**
1. **Teacher:** Access own students and analyses only
2. **Principal:** Access all students/analyses/teachers in own school
3. **District Admin:** Access all schools in district

**Permission Matrix:**

| Resource | Teacher | Principal | District Admin |
|----------|---------|-----------|----------------|
| View own students | ✓ | ✓ | ✓ |
| View all students in school | ✗ | ✓ | ✓ |
| View all students in district | ✗ | ✗ | ✓ |
| Create/edit own analyses | ✓ | ✗ | ✗ |
| View all analyses in school | ✗ | ✓ | ✓ |
| Manage users in school | ✗ | ✓ | ✓ |
| Manage users in district | ✗ | ✗ | ✓ |
| Export data | ✓ (own) | ✓ (school) | ✓ (district) |

**Enforcement:**
- NestJS Guards (e.g., `@Roles('principal', 'admin')`)
- Database-level row filtering (e.g., `WHERE schoolId = user.schoolId`)
- API responses filtered by role

**Example Guard Implementation:**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user.role === role);
  }
}
```

---

#### Data Protection

**Encryption at Rest:**
- Database: AES-256 (managed by cloud provider)
- Object storage: Server-side encryption (S3 SSE-S3)
- Application secrets: AWS Secrets Manager or Google Secret Manager

**Encryption in Transit:**
- TLS 1.3 (minimum TLS 1.2)
- HSTS (HTTP Strict Transport Security) headers
- Certificate: Let's Encrypt or cloud provider managed certificate

**PII Handling:**
- **Student data classification:** High sensitivity (FERPA protected)
- **Data minimization:** Only collect necessary data (no SSN, health records)
- **Anonymization:** Aggregate analytics use anonymized data
- **Data masking:** Mask student names in logs (replace with `STUDENT-{id}`)

**Sensitive Data in Logs:**
- Never log passwords, tokens, or full student names
- Log only non-PII identifiers (UUIDs)
- Structured logging with redaction filters

**Data Deletion:**
- Soft delete by default (set `deleted_at` timestamp)
- Hard delete after 90-day grace period
- Anonymization scripts for GDPR compliance (replace PII with `REDACTED`)

---

#### Compliance

**FERPA (Family Educational Rights and Privacy Act):**
- **Written consent:** Required before sharing student data with third parties (OpenAI DPA in place)
- **Access logs:** Audit trail of all data access (AuditLog table)
- **Parent rights:** Mechanism for parents to request student data (future parent portal)
- **Data retention:** Configurable per district (default: 7 years)

**COPPA (Children's Online Privacy Protection Act):**
- **No direct student access:** All data collected via teachers (educational agents exception)
- **Parental consent:** If future student portal added, require verifiable parental consent for under-13

**GDPR (if serving EU schools):**
- **Right to access:** API endpoint for data export
- **Right to erasure:** Hard delete functionality
- **Right to rectification:** Edit student data
- **Data portability:** Export in machine-readable format (JSON, CSV)
- **Privacy by design:** Encryption, access controls, audit logs built-in

**State-Specific Laws:**
- California CCPA: Consumer data rights (access, delete, opt-out)
- New York Education Law 2-d: Additional student data protections
- Illinois SOPPA: Student Online Personal Protection Act

**Data Processing Agreement (DPA):**
- Signed DPA with OpenAI (FERPA-compliant)
- Signed DPA with email service provider
- Signed DPA with cloud hosting provider

---

#### Vulnerability Management

**Dependency Management:**
- Automated dependency scanning: Dependabot (GitHub) or Renovate
- Weekly dependency updates
- Critical vulnerabilities patched within 48 hours

**Code Security:**
- Static analysis: ESLint security plugins, SonarQube
- Input validation: class-validator (all API inputs)
- SQL injection prevention: Parameterized queries (Prisma ORM)
- XSS prevention: React auto-escaping, CSP headers
- CSRF protection: SameSite cookies, CSRF tokens for state-changing requests

**Infrastructure Security:**
- WAF (Web Application Firewall): Cloudflare, AWS WAF, or Google Cloud Armor
- DDoS protection: Cloud provider DDoS mitigation
- Rate limiting: API rate limits (100 req/min per user)
- IP whitelisting: Admin panel access restricted to school IPs (optional)

**Security Headers:**
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Penetration Testing:**
- Annual third-party penetration test
- Automated vulnerability scanning: OWASP ZAP, Burp Suite
- Bug bounty program (future consideration)

---

### Observability

#### Logging

**Framework:** Winston (NestJS default, structured JSON logs)

**Log Levels:**
- `DEBUG`: Detailed diagnostic info (development only)
- `INFO`: General informational messages (user actions, API calls)
- `WARN`: Warning messages (non-critical errors, deprecated features)
- `ERROR`: Error messages (exceptions, failed requests)
- `FATAL`: Critical errors (system crash, data corruption)

**Log Format (JSON):**
```json
{
  "timestamp": "2025-01-30T10:00:00.000Z",
  "level": "info",
  "message": "User logged in",
  "context": "AuthService",
  "userId": "uuid",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "duration": 120,
  "traceId": "abc123"
}
```

**Log Aggregation:**
- **Development:** Console output (pretty format)
- **Production:** Cloud logging service (AWS CloudWatch, Google Cloud Logging, Datadog)
- **Retention:** 30 days for INFO/DEBUG, 90 days for WARN/ERROR

**Sensitive Data Redaction:**
- Automatically redact fields: `password`, `token`, `apiKey`, `ssn`
- Mask student names in logs (use `STUDENT-{id}` instead)

**Contextual Logging:**
- Request ID propagation (unique ID per request, included in all logs)
- Correlation ID for distributed tracing (trace across frontend/backend/external services)

---

#### Monitoring

**APM Tool:** Datadog, New Relic, or AWS X-Ray (TBD during Architect Phase)

**Key Metrics:**

1. **Application Metrics:**
   - Request rate (req/sec)
   - Response time (p50, p95, p99)
   - Error rate (% of 5xx responses)
   - Throughput (successful requests/sec)

2. **Business Metrics:**
   - Active users (daily, weekly)
   - Analyses completed (daily)
   - OpenAI API costs (daily spend)
   - User registrations (daily)

3. **Infrastructure Metrics:**
   - CPU utilization (%)
   - Memory utilization (%)
   - Database connections (active, idle)
   - Disk I/O (read/write ops)
   - Network throughput (MB/sec)

4. **Database Metrics:**
   - Query response time (p50, p95, p99)
   - Slow queries (>1s)
   - Connection pool usage
   - Replication lag (if using read replicas)

5. **External Service Metrics:**
   - OpenAI API latency
   - OpenAI API error rate
   - Email delivery rate
   - S3 upload/download success rate

**Dashboards:**
- **Executive Dashboard:** Business metrics (active users, analyses, costs)
- **Operations Dashboard:** Infrastructure health (CPU, memory, database)
- **Developer Dashboard:** API performance (response time, error rate, slow queries)

**Tools:**
- Prometheus (metrics collection)
- Grafana (visualization)
- Datadog or New Relic (all-in-one APM)

---

#### Distributed Tracing

**Tool:** OpenTelemetry (vendor-agnostic, future-proof)

**Trace Propagation:**
- Frontend generates `trace-id` on initial request
- Passed to backend in `X-Trace-Id` header
- Propagated to all downstream services (OpenAI, email, S3)
- Logged in all log entries

**Span Structure:**
```
Request: POST /api/v1/analyses/:id/complete
├─ HTTP Handler (NestJS)
│  ├─ Auth Guard (verify JWT)
│  ├─ Validation Pipe (validate input)
│  └─ AnalysisController.complete()
│     ├─ AnalysisService.complete()
│     │  ├─ OpenAIService.generateAnalysis() [External Call: 2.3s]
│     │  ├─ AnalysisRepository.update() [Database: 45ms]
│     │  └─ CacheService.invalidate() [Redis: 5ms]
│     └─ Response Serialization
└─ Total Duration: 2.4s
```

**Benefits:**
- Identify bottlenecks (e.g., slow OpenAI API calls)
- Debug errors across services
- Understand request flow

---

#### Alerting

**Alert Manager:** PagerDuty, Opsgenie, or AWS SNS + Email

**Critical Alerts (Page on-call engineer):**
- **Service Down:** API health check fails for 2 consecutive minutes
- **Error Rate Spike:** Error rate >5% for 5 minutes
- **Database Down:** Database connection failures for 1 minute
- **OpenAI API Failures:** 10+ consecutive failures

**Warning Alerts (Email/Slack notification):**
- **High Response Time:** p95 latency >2s for 10 minutes
- **High CPU:** CPU utilization >80% for 15 minutes
- **High Memory:** Memory utilization >85% for 15 minutes
- **Disk Space Low:** <20% disk space remaining
- **High OpenAI Costs:** Daily OpenAI spend exceeds budget by 20%

**Business Alerts:**
- **Low Completion Rate:** Analysis completion rate drops below 50%
- **Spike in Flagged Students:** 3x increase in flagged students
- **Login Failures:** 100+ failed login attempts in 1 hour (potential attack)

**Alert Routing:**
- **Critical:** PagerDuty → On-call engineer (phone call + SMS)
- **Warning:** Slack channel + email
- **Business:** Email to product owner

**On-Call Rotation:**
- 24/7 on-call coverage (rotating weekly)
- Escalation policy: Primary (5 min) → Secondary (10 min) → Manager (15 min)
- Post-incident reviews for all critical alerts

---

### Performance

#### Performance Requirements (from PRD)

- **Page Load Time:** <2 seconds (p95)
- **API Response Time:** <500ms standard queries (p95), <1s complex analytics (p95)
- **ChatGPT Analysis:** <3 seconds per prompt/response exchange
- **Dashboard Refresh:** <1s cached, <3s fresh
- **Search:** <300ms for 1000+ students

---

#### Optimization Strategies

**Frontend:**

1. **Code Splitting:**
   - Next.js automatic code splitting per route
   - Dynamic imports for heavy components (charts, PDF viewer)
   - Lazy loading for below-the-fold content

2. **Bundle Optimization:**
   - Target bundle size: <300KB gzipped (main bundle)
   - Tree-shaking (remove unused code)
   - Minification (Terser)
   - Dead code elimination

3. **Asset Optimization:**
   - Image optimization: Next.js Image component (WebP, responsive sizes)
   - CDN for static assets (CloudFront, Cloudflare)
   - Font optimization: Self-host fonts, preload critical fonts

4. **Caching:**
   - Browser cache: 30 days for static assets
   - Service worker cache (future PWA consideration)
   - React Query for server state caching

5. **Rendering:**
   - Server-side rendering (SSR) for initial page load
   - React Server Components for data fetching
   - Streaming SSR for progressive rendering

**Backend:**

1. **Database Optimization:**
   - Indexing: All foreign keys, search fields, filter fields
   - Query optimization: EXPLAIN ANALYZE for slow queries
   - Connection pooling: PgBouncer (max 100 connections)
   - N+1 query prevention: Use Prisma `include` for eager loading

2. **Caching:**
   - Redis cache for expensive queries (dashboard aggregations)
   - Cache-aside pattern (check cache → fallback to DB → populate cache)
   - TTL-based expiration (5 minutes for dashboards)

3. **Async Processing:**
   - Background jobs for long-running tasks (CSV import, PDF generation)
   - BullMQ job queue (Redis-backed)
   - Offload heavy processing from request-response cycle

4. **API Optimization:**
   - Pagination: Limit 50 results per page (prevent large payloads)
   - Field selection: Allow clients to specify fields (reduce payload size)
   - Compression: gzip/brotli compression for responses
   - HTTP/2: Multiplexing, header compression

---

#### Performance Monitoring

**Core Web Vitals (Frontend):**
- **LCP (Largest Contentful Paint):** <2.5s (goal: <2s)
- **FID (First Input Delay):** <100ms (goal: <50ms)
- **CLS (Cumulative Layout Shift):** <0.1 (goal: <0.05)

**Tools:**
- Google Lighthouse (automated audits)
- Vercel Analytics (real user monitoring)
- WebPageTest (performance testing)

**Backend Metrics:**
- **TTFB (Time to First Byte):** <200ms
- **Database query time:** <100ms (p95)
- **OpenAI API latency:** <3s (p95)

**Load Testing:**
- **Tool:** k6 or Artillery
- **Scenario:** 500 concurrent users, 30-minute duration
- **Target:** <1% error rate, <2s response time (p95)
- **Frequency:** Before major releases

---

### Resilience

#### Fault Tolerance

**Retry Logic:**
- **Exponential backoff:** Initial delay 100ms, max delay 30s
- **Max retries:** 3 for critical operations (OpenAI API), 1 for non-critical
- **Idempotency:** API operations idempotent (use idempotency keys for create operations)

**Circuit Breaker (for external services):**
- **Closed:** Normal operation, all requests pass through
- **Open:** After 5 consecutive failures, block requests for 1 minute
- **Half-Open:** After 1 minute, allow 1 test request
- **Close:** After 3 successful requests, resume normal operation

**Bulkheads (Resource Isolation):**
- Separate thread pools for critical vs. non-critical operations
- Database connection pool limits (prevent exhaustion)
- Rate limiting per user (prevent single user from consuming all resources)

**Timeouts:**
- **API requests:** 30s timeout (prevent hanging requests)
- **Database queries:** 10s timeout (kill slow queries)
- **OpenAI API:** 30s timeout (retry on timeout)

**Graceful Degradation:**
- If OpenAI API unavailable: Queue analysis for later processing, notify user
- If database read replica unavailable: Fallback to primary (accept higher latency)
- If Redis cache unavailable: Fallback to database (accept slower response)

---

#### Disaster Recovery

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 1 hour

**Backup Strategy:**
- **Database:** Daily full backups + 6-hour incremental + continuous transaction logs
- **Object Storage:** Cross-region replication (S3 versioning enabled)
- **Infrastructure:** Infrastructure as Code (Terraform) in Git

**Disaster Scenarios:**

1. **Database Failure:**
   - Restore from latest backup (RPO: 1 hour)
   - Switch DNS to backup database (if multi-region)
   - RTO: 2-4 hours

2. **Region Outage:**
   - Failover to secondary region (if multi-region setup)
   - RTO: 1 hour (automated failover)
   - Future consideration: Active-active multi-region

3. **Data Corruption:**
   - Restore from point-in-time backup
   - RTO: 4 hours (depends on data volume)

4. **Security Breach:**
   - Isolate affected systems
   - Rotate credentials
   - Restore from clean backup
   - Notify affected users (FERPA breach notification)

**Disaster Recovery Plan:**
- Documented runbooks for each scenario
- Quarterly disaster recovery drills
- Designated incident commander

---

### Scalability

#### Horizontal Scaling

**Stateless Application Tier:**
- NestJS backend designed to be stateless (session in Redis, not in-memory)
- Load balancer distributes traffic across multiple instances (round-robin)
- Auto-scaling based on CPU utilization (scale out at 70% CPU)

**Load Balancing:**
- **Tool:** AWS ALB, Google Cloud Load Balancer, or Nginx
- **Algorithm:** Round-robin or least connections
- **Health checks:** HTTP `/health` endpoint (every 30s)

**Auto-scaling Rules:**
- **Scale out:** CPU >70% for 5 minutes → Add 1 instance
- **Scale in:** CPU <30% for 10 minutes → Remove 1 instance
- **Min instances:** 2 (for redundancy)
- **Max instances:** 10 (MVP), 50 (production)

---

#### Vertical Scaling

**Database:**
- Start: 4 vCPU, 16GB RAM (handles 10k students)
- Year 1: 8 vCPU, 32GB RAM (handles 100k students)
- Year 2: 16 vCPU, 64GB RAM (handles 300k students)

**Application Servers:**
- Start: 2 vCPU, 4GB RAM per instance
- Scale: 4 vCPU, 8GB RAM per instance (if needed)

---

#### Database Scaling

**Phase 1 (0-50k students): Single PostgreSQL Instance**
- Vertical scaling (increase instance size)
- Connection pooling (PgBouncer)

**Phase 2 (50k-200k students): Read Replicas**
- Primary database: Write operations, critical reads
- Read replica(s): Analytics, reporting, dashboards
- Application logic routes reads to replica

**Phase 3 (200k+ students): Partitioning & Sharding**
- **Partitioning:** Partition `analyses` table by date (monthly partitions)
- **Sharding:** Shard by `school_id` or `district_id` (separate databases per region)

**Caching Strategy (Redis):**
- Cache expensive aggregations (dashboard queries)
- Cache TTL: 5 minutes
- Cache invalidation on data updates

---

### Internationalization & Localization

#### Primary Language: Hebrew

**Context:**
Growth Engine is designed primarily for the Israeli education market. All user-facing content, system messages, and documentation must be in Hebrew with full right-to-left (RTL) text direction support.

**Why Hebrew First:**
- **Target Market:** Israeli K-12 schools (Ministry of Education requirements)
- **User Base:** Teachers and principals primarily Hebrew-speaking
- **Compliance:** Educational materials must be in local language
- **Adoption:** Higher adoption rates when users can work in their native language
- **Accessibility:** Reduces cognitive load for non-English-speaking educators

---

#### Frontend Internationalization

**Framework:** next-intl (Next.js-native i18n library)

**Why next-intl:**
- Native Next.js App Router support (React Server Components compatible)
- Built-in RTL handling
- Type-safe translations (TypeScript integration)
- Server-side and client-side rendering support
- Automatic locale routing
- Lightweight and performant

**Alternative Considered:** react-i18next
- Rejected due to larger bundle size and less optimal Next.js integration

**Implementation Details:**

1. **Directory Structure:**
```
/messages
  /he-IL.json          # Hebrew translations (primary)
  /en-US.json          # English translations (future)
```

2. **Translation File Format (JSON):**
```json
{
  "auth": {
    "login": "התחברות",
    "logout": "התנתקות",
    "email": "דוא\"ל",
    "password": "סיסמה",
    "forgotPassword": "שכחתי סיסמה",
    "invalidCredentials": "דוא\"ל או סיסמה שגויים"
  },
  "students": {
    "title": "תלמידים",
    "addStudent": "הוסף תלמיד",
    "firstName": "שם פרטי",
    "lastName": "שם משפחה",
    "gradeLevel": "כיתה",
    "noStudentsFound": "לא נמצאו תלמידים"
  },
  "analysis": {
    "startAnalysis": "התחל ניתוח",
    "strengths": "חוזקות",
    "weaknesses": "נקודות לשיפור",
    "recommendations": "המלצות",
    "inProgress": "ניתוח בתהליך",
    "completed": "ניתוח הושלם"
  }
}
```

3. **Next.js Configuration:**
```typescript
// next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n.ts');

module.exports = withNextIntl({
  i18n: {
    locales: ['he-IL'],
    defaultLocale: 'he-IL',
  },
});
```

4. **Usage in Components:**
```typescript
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');

  return (
    <form>
      <label>{t('email')}</label>
      <input type="email" placeholder={t('email')} />

      <label>{t('password')}</label>
      <input type="password" placeholder={t('password')} />

      <button>{t('login')}</button>
    </form>
  );
}
```

5. **RTL Support (CSS):**
```css
/* globals.css */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Use logical properties for RTL compatibility */
.button {
  margin-inline-start: 1rem;  /* Instead of margin-left */
  padding-inline: 1rem;       /* Instead of padding-left/right */
}

/* Tailwind CSS RTL plugin */
/* tailwind.config.js */
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
};
```

6. **Hebrew Typography:**
```css
/* Use Hebrew-optimized fonts */
body {
  font-family: 'Rubik', 'Heebo', 'Assistant', system-ui, sans-serif;
}

/* Load Hebrew fonts */
@font-face {
  font-family: 'Rubik';
  src: url('/fonts/Rubik-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  unicode-range: U+0590-05FF; /* Hebrew block */
}
```

**Recommended Hebrew Fonts:**
- **Rubik:** Modern, clean, excellent screen readability
- **Heebo:** Open-source, designed for Hebrew UI
- **Assistant:** Friendly, readable, pairs well with English

**Date & Number Formatting:**
```typescript
// Use Intl API for locale-aware formatting
const date = new Date();
const hebrewDate = new Intl.DateTimeFormat('he-IL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(date);
// Output: "30 בדצמבר 2025"

const number = 1234.56;
const hebrewNumber = new Intl.NumberFormat('he-IL').format(number);
// Output: "1,234.56" (Hebrew uses same decimal notation)
```

**Bidirectional Text Handling:**
```typescript
// For mixed Hebrew/English content (e.g., student names)
<p dir="auto">{studentName}</p>  // Auto-detects text direction

// For user-generated content with mixed languages
<div className="whitespace-pre-wrap" dir="auto">
  {userInput}
</div>
```

---

#### Backend Internationalization

**Database Unicode Support:**

1. **PostgreSQL Configuration:**
```sql
-- Ensure database uses UTF-8 encoding
CREATE DATABASE growth_engine
  WITH ENCODING 'UTF8'
  LC_COLLATE = 'he_IL.UTF-8'
  LC_CTYPE = 'he_IL.UTF-8';

-- Hebrew text search configuration (future enhancement)
CREATE TEXT SEARCH CONFIGURATION hebrew (COPY = simple);
```

2. **Prisma Schema:**
```prisma
// All text fields support Unicode by default
model Student {
  id        String @id @default(uuid())
  firstName String  // Full Unicode support (Hebrew, English, etc.)
  lastName  String  // Full Unicode support

  // Prisma automatically handles UTF-8 encoding
  @@index([lastName, firstName])  // Hebrew alphabetical sorting
}
```

**Unicode Normalization:**
- **Issue:** Hebrew can be represented in multiple Unicode forms (e.g., with/without diacritics)
- **Solution:** Normalize to NFC (Canonical Composition) on input
```typescript
// NestJS validation pipe
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class UnicodeNormalizationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.normalize('NFC');  // Canonical composition
    }
    return value;
  }
}

// Apply to all text inputs
@Post('students')
async createStudent(@Body(UnicodeNormalizationPipe) dto: CreateStudentDto) {
  // ...
}
```

**API Validation with Hebrew:**

1. **Name Validation (Hebrew characters):**
```typescript
import { IsString, Matches, Length } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[\u0590-\u05FFa-zA-Z\s'-]+$/, {
    message: 'שם חייב להכיל רק אותיות עבריות או אנגליות',  // Hebrew error message
  })
  firstName: string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[\u0590-\u05FFa-zA-Z\s'-]+$/, {
    message: 'שם משפחה חייב להכיל רק אותיות עבריות או אנגליות',
  })
  lastName: string;
}
```

**Unicode Range Reference:**
- `\u0590-\u05FF`: Hebrew block (letters, vowels, punctuation)
- `\u0020-\u007F`: Basic Latin (English letters, numbers)

2. **Error Messages in Hebrew:**
```typescript
// Custom exception filter for Hebrew error messages
import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HebrewExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const errorMessages = {
      400: 'בקשה שגויה',
      401: 'נדרשת הזדהות',
      403: 'אין הרשאה',
      404: 'לא נמצא',
      409: 'כבר קיים',
      500: 'שגיאת שרת',
    };

    response.status(status).json({
      success: false,
      error: {
        code: exception.name,
        message: errorMessages[status] || 'שגיאה לא ידועה',
        details: exception.message,
      },
    });
  }
}
```

3. **Validation Error Translation:**
```typescript
// Translate class-validator errors to Hebrew
export const hebrewValidationMessages = {
  isNotEmpty: 'שדה חובה',
  isEmail: 'כתובת דוא"ל לא תקינה',
  minLength: 'אורך מינימלי: {constraint1} תווים',
  maxLength: 'אורך מקסימלי: {constraint1} תווים',
  isString: 'חייב להיות טקסט',
  isNumber: 'חייב להיות מספר',
  isDate: 'תאריך לא תקין',
};
```

**Hebrew Collation for Sorting:**
```typescript
// Use PostgreSQL Hebrew collation for alphabetical sorting
const students = await prisma.$queryRaw`
  SELECT * FROM students
  ORDER BY last_name COLLATE "he_IL.UTF-8", first_name COLLATE "he_IL.UTF-8"
`;

// Alternative: Use Prisma with locale-aware sorting
const students = await prisma.student.findMany({
  orderBy: [
    { lastName: 'asc' },
    { firstName: 'asc' },
  ],
});
// Note: Prisma uses database collation settings
```

**Email Notifications in Hebrew:**
```typescript
// Email templates in Hebrew
const passwordResetEmail = {
  subject: 'איפוס סיסמה - Growth Engine',
  body: `
    שלום {firstName},

    קיבלנו בקשה לאיפוס הסיסמה שלך.

    לחץ על הקישור הבא לאיפוס הסיסמה:
    {resetLink}

    הקישור תקף ל-24 שעות.

    אם לא ביקשת לאפס את הסיסמה, התעלם מהודעה זו.

    בברכה,
    צוות Growth Engine
  `,
};
```

---

#### Text Search & Analysis

**Hebrew Full-Text Search (Future Enhancement):**
```sql
-- PostgreSQL Hebrew text search (requires hebrew dictionary)
ALTER TEXT SEARCH CONFIGURATION hebrew
  ADD MAPPING FOR word WITH hebrew_stem;

-- Create GIN index for fast Hebrew text search
CREATE INDEX idx_students_hebrew_search
ON students
USING GIN(to_tsvector('hebrew', first_name || ' ' || last_name));

-- Search query
SELECT * FROM students
WHERE to_tsvector('hebrew', first_name || ' ' || last_name)
  @@ to_tsquery('hebrew', 'דוד');
```

**OpenAI API with Hebrew:**
- **Issue:** ChatGPT supports Hebrew but may default to English responses
- **Solution:** Explicitly specify Hebrew in system prompt
```typescript
const systemPrompt = `
אתה מומחה לניתוח חינוכי של תלמידים.
תפקידך לנתח את התצפיות של המורה על התלמיד ולספק המלצות מעשיות.

כל השאלות והתשובות שלך יהיו בעברית.
השתמש בשפה מקצועית אך מובנת.

התלמיד: {studentName}
המורה: {teacherName}
`;

const conversation = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'assistant', content: 'ספר לי על הביצועים האקדמיים של התלמיד.' },
  ],
});
```

---

#### Future Enhancements

**Multi-Language Support (Post-MVP):**

1. **Language Selection:**
```typescript
// User settings model
model User {
  id       String @id
  email    String
  language String @default("he-IL")  // User-selected language
  settings Json?  // { "language": "he-IL", "timezone": "Asia/Jerusalem" }
}
```

2. **Dynamic Locale Switching:**
```typescript
// Next.js middleware for locale detection
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'he-IL';
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  return response;
}
```

3. **Additional Languages:**
- English (en-US): For international schools in Israel
- Arabic (ar-IL): For Arabic-speaking schools in Israel
- Russian (ru-IL): For Russian-speaking communities

**Hebrew Calendar Support (Future):**
```typescript
// Dual calendar display (Gregorian + Hebrew)
import { HebrewCalendar } from '@hebcal/core';

const hebrewDate = new HebrewCalendar(new Date());
const formatted = hebrewDate.toString('h');  // e.g., "ז' טבת תשפ\"ו"
```

---

#### Technical Specifications Summary

| Component | Requirement | Implementation |
|-----------|-------------|----------------|
| **Frontend Framework** | RTL-aware i18n | next-intl with RTL plugin |
| **Translation Storage** | JSON files | /messages/he-IL.json |
| **Fonts** | Hebrew-optimized | Rubik, Heebo, or Assistant |
| **CSS Framework** | RTL support | Tailwind CSS with tailwindcss-rtl plugin |
| **Date Formatting** | Hebrew locale | Intl.DateTimeFormat('he-IL') |
| **Number Formatting** | Hebrew locale | Intl.NumberFormat('he-IL') |
| **Database Encoding** | UTF-8 | PostgreSQL UTF-8 with he_IL collation |
| **Text Normalization** | Unicode NFC | String.normalize('NFC') on input |
| **Name Validation** | Hebrew + English | Regex: /^[\u0590-\u05FFa-zA-Z\s'-]+$/ |
| **Error Messages** | Hebrew | Custom exception filter with Hebrew messages |
| **Email Templates** | Hebrew | HTML emails with RTL direction |
| **AI Prompts** | Hebrew | System prompts in Hebrew for OpenAI API |
| **Search** | Hebrew collation | PostgreSQL he_IL.UTF-8 collation |

---

#### Testing & Quality Assurance

**RTL Visual Testing:**
- Verify all UI components render correctly in RTL mode
- Check alignment: text, icons, buttons, forms, tables
- Test bidirectional content (mixed Hebrew/English)
- Verify date/number formatting displays correctly

**Unicode Testing:**
- Test Hebrew diacritics (nikud) input and storage
- Test special Hebrew characters (geresh, gershayim)
- Test mixed Hebrew/English/numbers in names
- Verify normalization prevents duplicate entries

**E2E Tests with Hebrew:**
```typescript
test('should create student with Hebrew name', async ({ page }) => {
  await page.goto('/students/new');
  await page.fill('input[name="firstName"]', 'דוד');
  await page.fill('input[name="lastName"]', 'כהן');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=דוד כהן')).toBeVisible();
});
```

**Accessibility Testing (Hebrew):**
- Screen reader compatibility with Hebrew content (NVDA, JAWS)
- Keyboard navigation in RTL layout
- Focus indicators visible in RTL mode

---

#### Performance Considerations

**Font Loading:**
```typescript
// Preload critical Hebrew fonts
// app/layout.tsx
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={rubik.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Translation Bundle Size:**
- Hebrew translation file: ~10-15KB (gzipped)
- Lazy load non-critical translations
- Use code splitting per route to reduce initial bundle

---

## 8. Deployment Architecture

### Infrastructure

**Cloud Provider:** Google Cloud Platform (GCP) - Recommended

**Rationale:**
- **Education focus:** Google for Education programs, better pricing for schools
- **Managed services:** Cloud SQL (PostgreSQL), Memorystore (Redis), Cloud Run (containers)
- **Compliance:** FERPA-compliant infrastructure
- **Simplicity:** Easier to manage than AWS for small teams
- **Integration:** Native Google Workspace SSO integration

**Alternative:** AWS (if team has expertise) or Azure (if schools use Microsoft ecosystem)

---

### Deployment Model

**Environment Strategy:**

1. **Development:** Local Docker Compose + cloud-hosted database (shared dev DB)
2. **Staging:** Full cloud deployment (mirrors production)
3. **Production:** Multi-instance, auto-scaled deployment

**Deployment Pattern:** Rolling deployment (zero-downtime)

**Process:**
1. Deploy new version to staging → Run E2E tests
2. Deploy to production incrementally (10% → 50% → 100% traffic)
3. Monitor error rate and latency during rollout
4. Auto-rollback if error rate >5%

---

### Container Orchestration

**Tool:** Google Cloud Run (managed containers) or Kubernetes (if self-managed)

**Recommendation:** Cloud Run for MVP (simplest, auto-scaling)

**Container Structure:**
- **Frontend:** Next.js app (Node.js runtime)
- **Backend:** NestJS app (Node.js runtime)
- **Background Jobs:** BullMQ worker (separate container)

**Dockerfile Example (NestJS Backend):**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

### CI/CD Pipeline

**Tool:** GitHub Actions (if using GitHub) or GitLab CI

**Pipeline Stages:**

```
┌─────────────────────────────────────────────────────────────────┐
│                       Code Commit (Git Push)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Stage 1: Build & Lint                                           │
│  • Install dependencies (npm ci)                                 │
│  • Run linter (ESLint)                                           │
│  • Run formatter check (Prettier)                                │
│  • Build TypeScript (tsc --noEmit)                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Stage 2: Unit Tests                                             │
│  • Run Jest unit tests (packages/backend, packages/frontend)     │
│  • Generate coverage report (target: >80%)                       │
│  • Fail if coverage <70%                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Stage 3: Integration Tests                                      │
│  • Spin up test database (Docker)                                │
│  • Run API integration tests (Jest + Supertest)                  │
│  • Tear down test environment                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  Stage 4: Build Docker Images                                    │
│  • Build frontend image (Next.js)                                │
│  • Build backend image (NestJS)                                  │
│  • Push to container registry (GCR, ECR, or Docker Hub)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ├─────────────────┐
                             │                 │
                    ┌────────▼──────┐  ┌──────▼────────┐
                    │ Deploy Staging │  │ Deploy Prod   │
                    │ • Deploy images│  │ • Manual gate │
                    │ • Run E2E tests│  │ • Run E2E     │
                    │ • Smoke tests  │  │ • Rolling     │
                    └────────────────┘  │   deployment  │
                                        │ • Health check│
                                        │ • Monitor     │
                                        └───────────────┘
```

**GitHub Actions Workflow (Example):**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  deploy-staging:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - run: gcloud builds submit --tag gcr.io/$PROJECT_ID/backend:$GITHUB_SHA
      - run: gcloud run deploy backend-staging --image gcr.io/$PROJECT_ID/backend:$GITHUB_SHA

  deploy-production:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
      - run: gcloud run deploy backend-prod --image gcr.io/$PROJECT_ID/backend:$GITHUB_SHA
```

---

### Infrastructure as Code

**Tool:** Terraform (cloud-agnostic, widely adopted)

**Alternative:** Pulumi (if team prefers TypeScript for infrastructure)

**Managed Resources:**
- VPC and networking
- PostgreSQL database (Cloud SQL)
- Redis cache (Memorystore)
- Cloud Run services
- Load balancers
- DNS records
- IAM roles and policies
- Secrets (API keys)

**State Management:**
- Terraform state stored in cloud storage (GCS, S3)
- State locking (prevent concurrent modifications)
- Version control (Git) for Terraform files

**Example Structure:**
```
infrastructure/
├── modules/
│   ├── database/
│   ├── cache/
│   ├── compute/
│   └── networking/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── production/
└── README.md
```

---

## 9. Technology Stack

### Frontend

**Framework:** Next.js 14+ (App Router with React Server Components)

**Language:** TypeScript 5+ (strict mode)

**Styling:**
- **Framework:** Tailwind CSS 3+
- **Component Library:** Radix UI (unstyled primitives) + custom components
- **Icons:** Lucide Icons (React components)

**State Management:**
- **Server State:** React Query (TanStack Query) for data fetching, caching
- **Client State:** Zustand (lightweight, simple) for UI state
- **Form State:** React Hook Form + Zod (schema validation)

**Data Visualization:**
- **Charts:** Recharts (React-native, composable, customizable)
- **Alternatives:** Chart.js (if Recharts insufficient)

**HTTP Client:**
- Native fetch API (Next.js extensions for caching)
- Axios wrapper for complex scenarios (interceptors, retries)

**Build Tools:**
- Next.js built-in (Webpack + Turbopack)
- ESLint (linting)
- Prettier (formatting)

**Testing:**
- **Unit/Component:** Jest + React Testing Library
- **E2E:** Playwright (fast, reliable, multi-browser)

---

### Backend

**Framework:** NestJS 10+ (modular, enterprise-grade)

**Language:** TypeScript 5+ (strict mode)

**ORM:** Prisma 5+ (type-safe, modern, excellent DX)

**Authentication:**
- **Library:** Passport.js (strategies: local, JWT, Google OAuth, Microsoft OAuth)
- **Token:** jsonwebtoken (JWT generation/validation)
- **Hashing:** bcrypt (password hashing, 10 rounds)

**Validation:**
- **Library:** class-validator + class-transformer (NestJS native)
- **Schema:** Zod (shared with frontend for type safety)

**Logging:**
- **Library:** Winston (structured JSON logs)
- **Transport:** Console (dev), Cloud logging service (production)

**Job Queue:**
- **Library:** BullMQ (Redis-backed, robust, feature-rich)
- **Use Cases:** CSV import, PDF generation, email sending, analytics pre-computation

**HTTP Server:**
- Express.js (NestJS default)
- Alternative: Fastify (if performance critical)

**API Documentation:**
- **Tool:** Swagger/OpenAPI (auto-generated via @nestjs/swagger)
- **UI:** Swagger UI (interactive API docs at `/api/docs`)

**Testing:**
- **Unit:** Jest
- **Integration:** Jest + Supertest (HTTP assertions)
- **E2E:** Playwright (shared with frontend)

---

### Data & Integration

**Primary Database:**
- **Technology:** PostgreSQL 15+
- **Hosting:** Managed service (Google Cloud SQL, AWS RDS, or Azure Database)
- **Extensions:** pgcrypto (encryption), pg_trgm (fuzzy search)

**Cache:**
- **Technology:** Redis 7+
- **Hosting:** Managed service (Google Memorystore, AWS ElastiCache, Azure Cache)
- **Use Cases:** Session storage, rate limiting, dashboard caching, job queue

**Object Storage:**
- **Technology:** S3-compatible object storage
- **Providers:** AWS S3, Google Cloud Storage, Azure Blob Storage
- **Use Cases:** CSV uploads, PDF exports, user attachments

**Email Service:**
- **Provider:** SendGrid (recommended) or Amazon SES
- **Use Cases:** Transactional emails (password reset, notifications, digests)

**AI Service:**
- **Provider:** OpenAI API
- **Model:** GPT-4 Turbo (`gpt-4-turbo-preview`)
- **Use Cases:** Student analysis generation

---

### Infrastructure

**Cloud Provider:** Google Cloud Platform (GCP)

**Compute:**
- **Service:** Cloud Run (managed containers, auto-scaling)
- **Alternative:** Google Kubernetes Engine (GKE) if advanced orchestration needed

**Database:**
- **Service:** Cloud SQL for PostgreSQL
- **Instance Type:** db-custom-4-16384 (4 vCPU, 16GB RAM) for MVP

**Cache:**
- **Service:** Memorystore for Redis
- **Instance Type:** Basic tier (1GB) for MVP

**Storage:**
- **Service:** Google Cloud Storage
- **Bucket:** Standard storage class (multi-region)

**CDN:**
- **Service:** Cloud CDN or Cloudflare
- **Use Cases:** Static assets, frontend deployment

**Monitoring:**
- **Service:** Google Cloud Monitoring + Logging
- **Alternative:** Datadog, New Relic (richer features)

**CI/CD:**
- **Service:** GitHub Actions or Google Cloud Build

**Secrets Management:**
- **Service:** Google Secret Manager
- **Use Cases:** API keys, database passwords, JWT secrets

---

### Development Tools

**Version Control:**
- **Tool:** Git
- **Platform:** GitHub or GitLab
- **Branching Strategy:** GitFlow (main, develop, feature/*, release/*, hotfix/*)

**Code Quality:**
- **Linting:** ESLint (TypeScript, React, Node.js rules)
- **Formatting:** Prettier (consistent code style)
- **Pre-commit Hooks:** Husky + lint-staged (run linter/formatter before commit)
- **Type Checking:** TypeScript compiler (strict mode)

**Testing:**
- **Unit/Integration:** Jest (30%+ coverage target)
- **E2E:** Playwright (critical user flows)
- **Coverage:** Istanbul (via Jest)

**Local Development:**
- **Containerization:** Docker + Docker Compose
- **Database:** PostgreSQL container (local development)
- **Cache:** Redis container (local development)
- **Hot Reload:** Next.js dev server (frontend), NestJS watch mode (backend)

**API Testing:**
- **Tool:** Postman or Insomnia (manual testing)
- **Alternative:** curl, HTTPie (CLI testing)

**Documentation:**
- **API Docs:** Swagger UI (auto-generated)
- **Code Docs:** JSDoc comments, TypeDoc (auto-generated)
- **Architecture:** Markdown files (this document)

---

## 10. Architecture Decisions

### Key Decisions

Reference detailed ADRs in `/context/decisions.md`

**Quick Reference:**

1. **PostgreSQL for Primary Database**
   - _Decision:_ Use PostgreSQL 15+ as primary database
   - _Rationale:_ Strong ACID guarantees, excellent JSON support (JSONB), mature ecosystem, FERPA compliance track record
   - _Alternatives Considered:_ MongoDB (rejected: weaker consistency), MySQL (rejected: inferior JSON support)

2. **TypeScript for Full Stack**
   - _Decision:_ Use TypeScript (strict mode) for both frontend and backend
   - _Rationale:_ End-to-end type safety, shared types, better DX, catches bugs at compile time
   - _Alternatives Considered:_ JavaScript only (rejected: too many runtime errors)

3. **Next.js for Frontend Framework**
   - _Decision:_ Use Next.js 14+ with App Router
   - _Rationale:_ Best-in-class React framework, SSR for performance, excellent DX, built-in optimizations
   - _Alternatives Considered:_ CRA (deprecated), Remix (smaller ecosystem), Vite + React (no SSR)

4. **NestJS for Backend Framework**
   - _Decision:_ Use NestJS 10+ for backend API
   - _Rationale:_ TypeScript-first, modular architecture, built-in DI, enterprise-grade patterns
   - _Alternatives Considered:_ Express (too minimal), Fastify (less structure)

5. **Monorepo with npm Workspaces**
   - _Decision:_ Monorepo structure with npm workspaces
   - _Rationale:_ Shared code (types), atomic commits, simplified CI/CD, zero-config
   - _Alternatives Considered:_ Multirepo (complex coordination), pnpm/yarn (overkill for MVP)

6. **Prisma for ORM**
   - _Decision:_ Use Prisma 5+ as database ORM
   - _Rationale:_ Superior type safety, excellent DX, modern migration system, auto-generated client
   - _Alternatives Considered:_ TypeORM (less type-safe), Sequelize (outdated)

7. **Self-Managed Authentication**
   - _Decision:_ Build auth with Passport.js + JWT (not Auth0/Clerk)
   - _Rationale:_ No per-user costs, full control, avoid vendor lock-in, sufficient for MVP
   - _Alternatives Considered:_ Auth0 (expensive at scale), Clerk (vendor lock-in)

8. **Google Cloud Platform for Hosting**
   - _Decision:_ Use GCP as cloud provider
   - _Rationale:_ Education focus, simpler than AWS, good managed services, FERPA-compliant
   - _Alternatives Considered:_ AWS (more complex), Azure (less education focus)

---

## 11. Evolution & Future Considerations

### Technical Debt

**Known Shortcuts for MVP:**

1. **No multi-region deployment:** Single-region deployment initially (add failover in Year 2)
2. **No advanced caching:** Basic Redis caching (can optimize with cache warming, edge caching)
3. **No database sharding:** Single PostgreSQL instance (shard by district when >200k students)
4. **No microservices:** Monolithic architecture (extract services if scaling bottlenecks emerge)
5. **Limited E2E test coverage:** Focus on critical flows only (expand coverage post-MVP)

**Debt Paydown Strategy:**
- Allocate 15-20% of sprint capacity for tech debt
- Quarterly architecture review to identify debt
- Document all shortcuts as tech debt tickets

---

### Planned Improvements

**Short-term (0-3 months post-MVP):**
- Add read replicas for database (separate analytics load)
- Implement cache warming for dashboard queries
- Expand E2E test coverage to 80% of user flows
- Set up production monitoring dashboards (Datadog or New Relic)

**Medium-term (3-6 months):**
- Add multi-factor authentication (MFA) for all users
- Implement parent portal for student analysis sharing
- Add LMS integrations (Google Classroom, Canvas)
- Optimize OpenAI prompts to reduce token costs by 30%

**Long-term (6-12 months):**
- Extract AI analysis service as microservice (independent scaling)
- Multi-region deployment for high availability (active-passive failover)
- Advanced analytics with machine learning (predict at-risk students)
- Mobile native apps (React Native or Flutter)

---

### Scalability Runway

**Current Capacity (MVP Architecture):**
- **Students:** 50,000 (single PostgreSQL instance)
- **Concurrent Users:** 500
- **Analyses/Day:** 5,000

**Year 1 Target:**
- **Students:** 100,000
- **Concurrent Users:** 1,000
- **Analyses/Day:** 10,000
- **Required Changes:** Add read replicas, increase database instance size

**Year 2 Target:**
- **Students:** 300,000
- **Concurrent Users:** 3,000
- **Analyses/Day:** 30,000
- **Required Changes:** Database partitioning, extract AI service, multi-region

**Scaling Triggers:**
- **Database CPU >70% sustained:** Add read replica or increase instance size
- **API latency p95 >2s:** Add application instances (horizontal scaling)
- **OpenAI costs >$5k/month:** Optimize prompts, implement caching

---

## 12. Risks & Mitigation

### Architecture Risks

#### Risk 1: OpenAI API Dependency

**Impact:** Critical (core product feature)
**Likelihood:** Medium (external service, rate limits, costs)

**Mitigation:**
- Implement circuit breaker and retry logic
- Queue failed analyses for later processing
- Monitor OpenAI service status (status page)
- Negotiate enterprise SLA with OpenAI
- Explore alternative AI providers (Anthropic Claude, open-source models) as backup
- Implement aggressive caching of analysis results

---

#### Risk 2: Database Performance Degradation at Scale

**Impact:** High (poor user experience, increased costs)
**Likelihood:** Medium (as student count grows)

**Mitigation:**
- Proper indexing from day one
- Regular query optimization (EXPLAIN ANALYZE)
- Implement caching layer (Redis)
- Monitor slow query logs
- Plan for read replicas before needed
- Partition large tables (analyses by date)

---

#### Risk 3: Security Breach / Data Leak

**Impact:** Critical (FERPA violation, legal liability, reputation damage)
**Likelihood:** Low (with proper precautions)

**Mitigation:**
- Defense in depth: encryption, access controls, audit logs
- Annual penetration testing
- Security code reviews
- Incident response plan
- Cyber insurance
- Staff training on security best practices
- Regular dependency updates

---

#### Risk 4: Vendor Lock-In (Cloud Provider)

**Impact:** Medium (difficult migration, cost increases)
**Likelihood:** Low (GCP unlikely to discontinue services)

**Mitigation:**
- Use open-source technologies where possible (PostgreSQL, Redis, Docker)
- Abstract cloud-specific APIs (use ORMs, not raw SQL)
- Document infrastructure as code (Terraform)
- Design for portability (avoid GCP-specific features unless critical)

---

#### Risk 5: Inadequate Test Coverage Leading to Production Bugs

**Impact:** Medium (user frustration, churn)
**Likelihood:** Medium (tight timelines, pressure to ship)

**Mitigation:**
- Enforce minimum test coverage (70% for backend, 60% for frontend)
- E2E tests for all critical user flows
- Staging environment testing before production
- Gradual rollout (canary deployments)
- Monitoring and alerting to catch issues early
- Feature flags for risky features

---

## Appendix

### Glossary

- **FERPA:** Family Educational Rights and Privacy Act (US education privacy law)
- **COPPA:** Children's Online Privacy Protection Act (US law protecting children under 13)
- **SSO:** Single Sign-On (authentication via external provider)
- **JWT:** JSON Web Token (compact authentication token)
- **RBAC:** Role-Based Access Control (authorization model)
- **ORM:** Object-Relational Mapping (database abstraction layer)
- **CDN:** Content Delivery Network (edge caching for static assets)
- **APM:** Application Performance Monitoring (observability tool)
- **RTO:** Recovery Time Objective (maximum acceptable downtime)
- **RPO:** Recovery Point Objective (maximum acceptable data loss)

---

### Related Documents

- **Product Requirements:** `/docs/PRD.md`
- **Context Files:**
  - `/context/client.md`
  - `/context/requirements.md`
  - `/context/discovery.md`
  - `/context/decisions.md`
- **Tickets:** `/tickets/`
- **Agent Definitions:** `/.claude/agents/`

---

### Architecture Diagrams

**C4 Model Diagrams (Future):**
- System Context Diagram (Level 1)
- Container Diagram (Level 2)
- Component Diagram (Level 3)
- Code Diagram (Level 4) - for complex modules

**Sequence Diagrams:**
- User Authentication Flow
- AI Analysis Session Flow
- Dashboard Data Loading Flow

**Entity Relationship Diagram:**
- See Section 4: Data Architecture

---

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-30 | Architect Agent | Initial comprehensive architecture document |

---

## Summary

This architecture document provides a comprehensive blueprint for the Growth Engine platform, an AI-powered K-12 student analysis system. The architecture prioritizes:

1. **Security & Compliance:** FERPA-compliant design with encryption, access controls, and audit logging
2. **Scalability:** Modular monolith that scales from 10k to 300k+ students with clear evolution path
3. **Performance:** <2s page loads, <500ms API responses, aggressive caching strategy
4. **Reliability:** 99.5% uptime target, disaster recovery plan, fault-tolerant design
5. **Developer Experience:** TypeScript full-stack, modern frameworks (Next.js, NestJS), excellent tooling

**Key Technical Decisions:**
- PostgreSQL for relational data + JSONB flexibility
- Next.js + NestJS for type-safe, modular full-stack development
- Prisma ORM for type-safe database access
- Redis for caching and session management
- BullMQ for background job processing
- Google Cloud Platform for hosting (education-focused)

**Architecture Style:**
- Modular monolith (initially) with clear domain boundaries
- RESTful API design
- Event-driven background processing
- Backend for Frontend (BFF) pattern with Next.js Server Components

The architecture is designed to support rapid MVP development while providing a clear path to scale to hundreds of thousands of students across multiple school districts. All components are production-ready, FERPA-compliant, and built with modern best practices.

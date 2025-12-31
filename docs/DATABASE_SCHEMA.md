# Growth Engine - Database Schema

**Version:** 1.0 (MVP)
**Last Updated:** 2025-12-30
**Database:** PostgreSQL 15+
**ORM:** Prisma 5+

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Indexes & Performance](#indexes--performance)
5. [Data Retention & Archival](#data-retention--archival)
6. [Security & Compliance](#security--compliance)
7. [Migrations Strategy](#migrations-strategy)

---

## Schema Overview

The Growth Engine database is designed to support:
- Multi-tenancy at the school/district level
- Role-based access control (RBAC)
- Flexible AI analysis storage (JSONB)
- Comprehensive audit logging for FERPA compliance
- Efficient querying for dashboards and reports
- Full Unicode support with Hebrew language optimization

### Key Design Principles

1. **Normalization:** Third normal form (3NF) for core entities
2. **Denormalization:** Selective denormalization for dashboard performance
3. **Soft Deletes:** Preserve data integrity, use `deletedAt` timestamp
4. **Audit Trail:** Immutable audit logs for all data changes
5. **Timestamps:** Every table has `createdAt` and `updatedAt`
6. **UUIDs:** Use UUIDs for primary keys (better for distributed systems, security)
7. **Hebrew Support:** UTF-8 encoding with Hebrew collation for proper text handling and sorting

### Database Configuration

**Encoding & Collation:**
```sql
-- Database creation with Hebrew locale support
CREATE DATABASE growth_engine
  WITH ENCODING 'UTF8'
  LC_COLLATE = 'he_IL.UTF-8'
  LC_CTYPE = 'he_IL.UTF-8'
  TEMPLATE = template0;
```

**Character Set:**
- All tables use UTF-8 encoding (Unicode support)
- Hebrew character range: U+0590-U+05FF
- Latin character range: U+0020-U+007F
- Supports mixed Hebrew/English text in all fields

**Text Collation:**
- Default collation: `he_IL.UTF-8` (Hebrew alphabetical order)
- Ensures correct sorting for Hebrew names: א, ב, ג, ד, ה, ו, ז, ח, ט, י, כ, ל, מ, נ, ס, ע, פ, צ, ק, ר, ש, ת
- Mixed language fields sorted by database collation rules

**Unicode Normalization:**
- Application-level normalization to NFC (Canonical Composition)
- Prevents duplicate entries with different Unicode representations (e.g., composed vs decomposed characters)
- Applied on all text inputs before database insertion

---

## Entity Relationship Diagram

```
┌──────────────┐
│   Districts  │
└──────┬───────┘
       │ 1
       │
       │ n
┌──────▼───────┐        1      n  ┌─────────────┐
│   Schools    │◄─────────────────│    Users    │
└──────┬───────┘                   └──────┬──────┘
       │ 1                                │ 1 (teacher)
       │                                  │
       │ n                                │ n
┌──────▼───────┐        1      n  ┌──────▼───────┐
│   Classes    │◄─────────────────│   Students   │
└──────┬───────┘                   └──────┬───────┘
       │ n                      1         │ 1
       │                   ┌──────────────┘
       │                   │
       │ n         n  ┌────▼────────────┐
       └──────────────►│ClassEnrollments│
                       └─────────────────┘

┌─────────────┐
│   Users     │ 1
│ (teacher)   ├─────────┐
└─────────────┘         │
                        │ n
┌─────────────┐    ┌────▼────────┐       1    n  ┌──────────────────────┐
│  Students   │───►│  Analyses   │◄───────────────│AnalysisConversations │
└─────────────┘ 1  └─────┬───────┘                └──────────────────────┘
                         │
                         │
                         │ n
                    ┌────▼──────┐
                    │ AuditLogs │ (all entities generate audit logs)
                    └───────────┘
```

---

## Table Definitions

### 1. Districts

Represents school districts (for multi-district deployments).

```prisma
model District {
  id        String   @id @default(uuid())
  name      String
  code      String   @unique // District code (e.g., "NYC-DOE")
  state     String?  // US state (e.g., "NY")
  country   String   @default("IL") // Israel by default
  settings  Json?    // District-specific settings (quotas, features)

  schools   School[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([code])
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `name`: District name (e.g., "Tel Aviv District")
- `code`: Unique district code
- `state`: Optional state/region
- `country`: Country code (ISO 3166-1 alpha-2)
- `settings`: JSON field for district-specific configuration

**Relationships:**
- `schools`: One-to-many with Schools

---

### 2. Schools

Represents individual schools within districts.

```prisma
model School {
  id         String   @id @default(uuid())
  name       String
  code       String   @unique // School code (e.g., "TLV-HS-01")
  districtId String?
  district   District? @relation(fields: [districtId], references: [id])

  address    String?
  phone      String?
  email      String?
  principal  String?  // Principal name (informational)
  settings   Json?    // School-specific settings (quotas, features)

  users      User[]
  students   Student[]
  classes    Class[]

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime?

  @@index([districtId])
  @@index([code])
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `name`: School name (e.g., "Tel Aviv High School")
- `code`: Unique school code
- `districtId`: Foreign key to District (nullable for standalone schools)
- `settings`: JSON field for school-specific configuration (e.g., analysis quotas)

**Relationships:**
- `district`: Many-to-one with District
- `users`: One-to-many with Users
- `students`: One-to-many with Students
- `classes`: One-to-many with Classes

---

### 3. Users

Represents all system users (teachers, principals, admins).

```prisma
enum UserRole {
  TEACHER
  PRINCIPAL
  ADMIN
}

enum AuthProvider {
  EMAIL      // Email/password
  GOOGLE     // Google OAuth
  MICROSOFT  // Microsoft OAuth
}

model User {
  id            String       @id @default(uuid())
  email         String       @unique
  passwordHash  String?      // Nullable for SSO-only users
  role          UserRole
  authProvider  AuthProvider @default(EMAIL)
  providerId    String?      // OAuth provider user ID

  firstName     String
  lastName      String
  phone         String?
  avatar        String?      // Profile picture URL

  schoolId      String
  school        School       @relation(fields: [schoolId], references: [id])

  // Metadata
  lastLoginAt   DateTime?
  emailVerified Boolean      @default(false)
  isActive      Boolean      @default(true)
  settings      Json?        // User preferences (language, notifications)

  // Relationships
  classes       Class[]      // Teacher-owned classes
  analyses      Analysis[]   // Teacher-created analyses

  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  deletedAt     DateTime?

  @@index([email])
  @@index([schoolId])
  @@index([role])
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `email`: Unique email address (used for login)
- `passwordHash`: Bcrypt hash (nullable for SSO users)
- `role`: User role (TEACHER, PRINCIPAL, ADMIN)
- `authProvider`: Authentication method used
- `providerId`: OAuth provider user ID (for SSO)
- `schoolId`: Foreign key to School

**Relationships:**
- `school`: Many-to-one with School
- `classes`: One-to-many with Classes (teacher-owned)
- `analyses`: One-to-many with Analyses (teacher-created)

**Security:**
- Password hash uses bcrypt with 10 rounds
- Soft delete preserves audit trail
- `isActive` flag for account suspension

---

### 4. Students

Represents student records.

```prisma
model Student {
  id          String    @id @default(uuid())
  firstName   String
  lastName    String
  studentId   String?   // School-assigned student ID
  gradeLevel  String    // e.g., "9", "10", "11", "12"

  schoolId    String
  school      School    @relation(fields: [schoolId], references: [id])

  // PII fields (encrypted at application level if needed)
  dateOfBirth DateTime?
  gender      String?
  notes       String?   // Teacher notes (not AI-generated)

  // Metadata
  enrollmentDate DateTime? // When student enrolled in school
  isActive    Boolean   @default(true)

  // Relationships
  enrollments ClassEnrollment[]
  analyses    Analysis[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  @@unique([schoolId, studentId]) // Prevent duplicate student IDs within school
  @@index([schoolId])
  @@index([gradeLevel])
  @@index([lastName, firstName]) // Alphabetical sorting
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `firstName`, `lastName`: Student name
- `studentId`: School-assigned ID (optional, unique within school)
- `gradeLevel`: Student grade (stored as string for flexibility)
- `schoolId`: Foreign key to School

**Relationships:**
- `school`: Many-to-one with School
- `enrollments`: One-to-many with ClassEnrollments
- `analyses`: One-to-many with Analyses

**FERPA Compliance:**
- PII fields marked for encryption
- Soft delete preserves historical data
- Audit logging required for all access

**Hebrew & Unicode Support:**
- All text fields (`firstName`, `lastName`, `notes`) support full Unicode (UTF-8)
- Hebrew character range (U+0590-U+05FF) explicitly supported
- Mixed Hebrew/English names allowed (e.g., "דוד Smith")
- Database collation: `he_IL.UTF-8` for proper Hebrew alphabetical sorting
- Unicode normalization: NFC (Canonical Composition) applied on input to prevent duplicates
- Example valid names:
  - Full Hebrew: "דוד כהן"
  - Full English: "David Cohen"
  - Mixed: "דוד Cohen", "David כהן"
  - With hyphens/apostrophes: "בן-ציון", "O'Brien"

---

### 5. Classes

Represents teacher-owned class sections.

```prisma
model Class {
  id          String   @id @default(uuid())
  name        String   // e.g., "Math Period 3", "5th Grade Room 201"
  subject     String?  // e.g., "Math", "Science", "English"
  gradeLevel  String?  // e.g., "9", "10"
  section     String?  // e.g., "A", "B", "Period 3"

  teacherId   String
  teacher     User     @relation(fields: [teacherId], references: [id])

  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id])

  // Metadata
  academicYear String?  // e.g., "2025-2026"
  isActive    Boolean  @default(true)

  // Relationships
  enrollments ClassEnrollment[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([teacherId])
  @@index([schoolId])
  @@index([gradeLevel])
  @@index([academicYear])
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `name`: Class name/description
- `subject`: Subject taught (optional)
- `gradeLevel`: Grade level (optional, string for flexibility)
- `teacherId`: Foreign key to User (teacher)
- `schoolId`: Foreign key to School

**Relationships:**
- `teacher`: Many-to-one with User
- `school`: Many-to-one with School
- `enrollments`: One-to-many with ClassEnrollments

---

### 6. ClassEnrollments

Junction table for many-to-many relationship between Students and Classes.

```prisma
model ClassEnrollment {
  id        String   @id @default(uuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id])

  classId   String
  class     Class    @relation(fields: [classId], references: [id])

  // Enrollment metadata
  enrolledAt DateTime @default(now())
  droppedAt  DateTime? // If student dropped the class

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([studentId, classId]) // Prevent duplicate enrollments
  @@index([studentId])
  @@index([classId])
  @@index([enrolledAt])
}
```

**Fields:**
- `id`: UUID primary key
- `studentId`: Foreign key to Student
- `classId`: Foreign key to Class
- `enrolledAt`: Enrollment timestamp
- `droppedAt`: Timestamp when student dropped (nullable)

**Relationships:**
- `student`: Many-to-one with Student
- `class`: Many-to-one with Class

---

### 7. Analyses

Stores AI-generated student analysis results.

```prisma
enum AnalysisStatus {
  IN_PROGRESS  // Analysis started but not complete
  COMPLETED    // Analysis finished and saved
  FAILED       // Analysis failed (e.g., OpenAI API error)
}

model Analysis {
  id          String         @id @default(uuid())
  studentId   String
  student     Student        @relation(fields: [studentId], references: [id])

  teacherId   String
  teacher     User           @relation(fields: [teacherId], references: [id])

  status      AnalysisStatus @default(IN_PROGRESS)

  // Analysis results (flexible JSON structure)
  results     Json?          // AI-generated analysis results
  // Example structure:
  // {
  //   "strengths": ["Strong math skills", "Good problem solver"],
  //   "weaknesses": ["Struggles with reading comprehension"],
  //   "recommendations": ["Provide extra reading support"],
  //   "learningStyle": "Visual learner",
  //   "confidence": 0.85
  // }

  // Teacher edits and notes
  teacherEdits    Json?      // Teacher-modified results
  privateNotes    String?    // Teacher-only notes (not visible to principal)

  // Metadata
  sessionDuration Int?       // Analysis duration in seconds
  totalTokens     Int?       // OpenAI tokens used
  estimatedCost   Float?     // Estimated cost in USD
  flaggedForReview Boolean   @default(false) // Teacher can flag for follow-up

  // Relationships
  conversations AnalysisConversation[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([studentId])
  @@index([teacherId])
  @@index([status])
  @@index([flaggedForReview])
  @@index([createdAt]) // For chronological sorting
  @@index([deletedAt])
}
```

**Fields:**
- `id`: UUID primary key
- `studentId`: Foreign key to Student
- `teacherId`: Foreign key to User (teacher)
- `status`: Analysis status (IN_PROGRESS, COMPLETED, FAILED)
- `results`: JSONB field for flexible AI analysis structure
- `teacherEdits`: JSONB field for teacher modifications
- `privateNotes`: Teacher-only notes (FERPA-compliant)

**Relationships:**
- `student`: Many-to-one with Student
- `teacher`: Many-to-one with User
- `conversations`: One-to-many with AnalysisConversations

**Cost Tracking:**
- `totalTokens`: Track OpenAI token usage
- `estimatedCost`: Estimated cost for budgeting

---

### 8. AnalysisConversations

Stores multi-turn ChatGPT conversation history for each analysis.

```prisma
enum ConversationRole {
  SYSTEM      // System prompt
  ASSISTANT   // ChatGPT response
  USER        // Teacher response
}

model AnalysisConversation {
  id          String            @id @default(uuid())
  analysisId  String
  analysis    Analysis          @relation(fields: [analysisId], references: [id], onDelete: Cascade)

  role        ConversationRole
  content     String            @db.Text // Conversation message content
  tokens      Int?              // Tokens used for this message

  // Metadata
  sequenceNumber Int            // Order of messages (1, 2, 3...)

  createdAt   DateTime          @default(now())

  @@index([analysisId])
  @@index([sequenceNumber])
  @@unique([analysisId, sequenceNumber]) // Ensure ordered conversation
}
```

**Fields:**
- `id`: UUID primary key
- `analysisId`: Foreign key to Analysis (cascade delete)
- `role`: Message role (SYSTEM, ASSISTANT, USER)
- `content`: Message content (TEXT type for long messages)
- `tokens`: Token count for this message
- `sequenceNumber`: Order of messages in conversation

**Relationships:**
- `analysis`: Many-to-one with Analysis (cascade delete)

**Storage Optimization:**
- Content stored as TEXT (no length limit)
- Cascade delete when analysis deleted
- Indexed by analysis and sequence for fast retrieval

---

### 9. AuditLogs

Immutable audit trail for FERPA compliance.

```prisma
enum AuditAction {
  CREATE
  READ
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  EXPORT
}

model AuditLog {
  id          String      @id @default(uuid())

  // Who performed the action
  userId      String?
  userEmail   String?
  userRole    String?

  // What was accessed
  action      AuditAction
  resource    String      // e.g., "Student", "Analysis", "User"
  resourceId  String?     // ID of the affected resource

  // Context
  ipAddress   String?
  userAgent   String?
  metadata    Json?       // Additional context (e.g., changed fields)

  // When
  createdAt   DateTime    @default(now())

  @@index([userId])
  @@index([resourceId])
  @@index([action])
  @@index([createdAt])
}
```

**Fields:**
- `id`: UUID primary key
- `userId`: User who performed action (nullable for system actions)
- `userEmail`: User email at time of action
- `action`: Type of action (CREATE, READ, UPDATE, DELETE, etc.)
- `resource`: Resource type (e.g., "Student", "Analysis")
- `resourceId`: ID of affected resource
- `ipAddress`: Client IP address
- `userAgent`: Client user agent
- `metadata`: Additional context (JSON)

**FERPA Compliance:**
- Immutable (no updates or deletes)
- 7-year retention minimum
- Tracks all student data access
- Required for breach investigation

---

## Indexes & Performance

### Primary Indexes

All tables have:
- Primary key index (UUID)
- Foreign key indexes
- Timestamp indexes (`createdAt`, `deletedAt`)

### Search & Filtering Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school_role ON users(school_id, role);

-- Students
CREATE INDEX idx_students_name ON students(last_name, first_name);
CREATE INDEX idx_students_school_grade ON students(school_id, grade_level);
CREATE INDEX idx_students_active ON students(is_active) WHERE deleted_at IS NULL;

-- Analyses
CREATE INDEX idx_analyses_student_created ON analyses(student_id, created_at DESC);
CREATE INDEX idx_analyses_teacher_created ON analyses(teacher_id, created_at DESC);
CREATE INDEX idx_analyses_flagged ON analyses(flagged_for_review) WHERE flagged_for_review = true;

-- Audit Logs
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
```

### Full-Text Search Indexes (Future)

```sql
-- PostgreSQL full-text search for students
CREATE INDEX idx_students_fulltext ON students USING GIN(to_tsvector('hebrew', first_name || ' ' || last_name));
```

### Performance Considerations

1. **Composite Indexes:** Used for common query patterns (e.g., school_id + grade_level)
2. **Partial Indexes:** Used for filtered queries (e.g., active students only)
3. **JSONB Indexes:** Can add GIN indexes on JSONB fields if querying nested data
4. **Index Maintenance:** Monitor index usage and remove unused indexes

---

## Data Retention & Archival

### Retention Policies

| Data Type | Retention Period | Archival Strategy |
|-----------|-----------------|-------------------|
| Active Students | Indefinite | Soft delete on graduation/transfer |
| Graduated Students | 7 years | Anonymize after 7 years |
| Analyses | 7 years | Retain per FERPA requirements |
| Audit Logs | 7 years minimum | Archive to cold storage after 1 year |
| Conversations | 7 years | Cascade delete with analysis |
| Users (inactive) | Indefinite | Soft delete, anonymize PII after 2 years |

### Soft Delete Implementation

```sql
-- Example soft delete query
UPDATE students
SET deleted_at = NOW()
WHERE id = 'student-uuid';

-- Queries automatically exclude soft-deleted records
SELECT * FROM students WHERE deleted_at IS NULL;
```

### Anonymization Process

After retention period:
```sql
-- Anonymize student data
UPDATE students
SET
  first_name = 'REDACTED',
  last_name = 'REDACTED',
  student_id = NULL,
  notes = NULL
WHERE deleted_at < NOW() - INTERVAL '7 years';
```

---

## Security & Compliance

### Encryption

**At Rest:**
- PostgreSQL database encryption enabled (GCP Cloud SQL default)
- Application-level encryption for highly sensitive fields (optional)

**In Transit:**
- TLS 1.3 for all database connections
- SSL required for PostgreSQL connections

### Row-Level Security (Future Enhancement)

```sql
-- Example RLS policy for teachers (PostgreSQL)
CREATE POLICY teacher_students_policy ON students
  FOR SELECT
  TO teacher_role
  USING (
    EXISTS (
      SELECT 1 FROM class_enrollments ce
      JOIN classes c ON ce.class_id = c.id
      WHERE ce.student_id = students.id
      AND c.teacher_id = current_user_id()
    )
  );
```

### Data Isolation

- **Teachers:** Can only access students in their classes (enforced at application level)
- **Principals:** Can access all students in their school
- **Admins:** Can access all data (with audit logging)

### FERPA Compliance Checklist

- [x] Audit logging for all data access
- [x] Soft delete (preserve historical data)
- [x] 7-year data retention
- [x] Encryption at rest and in transit
- [x] Role-based access control
- [x] Data anonymization after retention period
- [ ] Breach notification process (application-level)

---

## Migrations Strategy

### Prisma Migrations

**Development:**
```bash
# Create migration after schema changes
npx prisma migrate dev --name descriptive-migration-name

# Reset database (destructive, dev only)
npx prisma migrate reset
```

**Production:**
```bash
# Review migration SQL before applying
npx prisma migrate diff

# Apply migrations (non-destructive)
npx prisma migrate deploy
```

### Migration Best Practices

1. **Backward Compatible:** Never break existing code
2. **Additive Changes:** Add columns, don't remove (use deprecation)
3. **Data Migrations:** Separate schema changes from data changes
4. **Rollback Plan:** Always have a rollback script
5. **Test on Staging:** Apply to staging before production

### Example Migration Workflow

```
1. Developer creates schema change in schema.prisma
2. Run `prisma migrate dev` to generate migration
3. Review generated SQL migration file
4. Test migration on local database
5. Commit migration file to git
6. CI/CD applies migration to staging automatically
7. Manual review and approval
8. CI/CD applies migration to production
9. Monitor for errors, rollback if needed
```

---

## Database Sizing & Capacity Planning

### MVP (500 teachers, 15,000 students, 50,000 analyses)

```
Users:           500 rows × 1 KB ≈ 0.5 MB
Students:      15,000 rows × 1 KB ≈ 15 MB
Classes:        2,000 rows × 1 KB ≈ 2 MB
Enrollments:   50,000 rows × 0.5 KB ≈ 25 MB
Analyses:      50,000 rows × 5 KB ≈ 250 MB
Conversations: 300,000 rows × 0.5 KB ≈ 150 MB
Audit Logs:    500,000 rows × 0.5 KB ≈ 250 MB

Total Data: ~700 MB
With Indexes: ~1.5 GB
```

**Recommended Instance:** Cloud SQL db-n1-standard-2 (2 vCPU, 7.5 GB RAM, 100 GB SSD)

### Year 1 (2,500 teachers, 75,000 students, 500,000 analyses)

```
Total Data: ~7 GB
With Indexes: ~15 GB
```

**Recommended Instance:** Cloud SQL db-n1-standard-4 (4 vCPU, 15 GB RAM, 250 GB SSD)

### Year 3 (7,500 teachers, 225,000 students, 3,000,000 analyses)

```
Total Data: ~40 GB
With Indexes: ~80 GB
```

**Recommended Instance:** Cloud SQL db-n1-highmem-8 (8 vCPU, 52 GB RAM, 500 GB SSD) + Read Replicas

---

## Prisma Schema Summary

See `packages/backend/prisma/schema.prisma` for complete schema definition.

**Key Enums:**
- `UserRole`: TEACHER, PRINCIPAL, ADMIN
- `AuthProvider`: EMAIL, GOOGLE, MICROSOFT
- `AnalysisStatus`: IN_PROGRESS, COMPLETED, FAILED
- `ConversationRole`: SYSTEM, ASSISTANT, USER
- `AuditAction`: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT

**Relationships:**
- Districts → Schools (1:n)
- Schools → Users, Students, Classes (1:n)
- Users → Classes, Analyses (1:n)
- Students → ClassEnrollments, Analyses (1:n)
- Classes → ClassEnrollments (1:n)
- Analyses → AnalysisConversations (1:n, cascade delete)

**Total Tables:** 9 core tables + additional tables for sessions, etc.

---

## Document Version History

- v1.0 (2025-12-30): Initial database schema design for MVP

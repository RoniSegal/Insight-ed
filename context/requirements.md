# Requirements

## Core User Flows

teacher: logs in->choose student name->start analysis->recive the output, principle: logs in -> see dashboard of all students per class, teacher and principle: dashboard of all data eligible to see with trends

## Functional Requirements

### User Management

**Authentication & Authorization**

- Users must authenticate via email/password with secure password requirements (min 8 chars, upper/lower/number)
- Support for SSO integration with Google Workspace and Microsoft 365 (common in schools)
- Role-based access control (RBAC) with three roles: Teacher, Principal, District Admin
- Session management with automatic timeout after 30 minutes of inactivity for security
- Password reset functionality via email verification
- Multi-factor authentication (MFA) optional but recommended for administrators

**User Profiles**

- Teachers: name, email, school affiliation, grade levels taught, subjects
- Principals: name, email, school affiliation, managed grade levels/departments
- District Admins: name, email, district affiliation, access scope

**Account Management**

- Users can update their profile information
- Users can change password
- Principals can view and manage teacher accounts within their school
- District admins can manage all users within their district

### Core Features

**Student Management**

- Teachers can add students with: name, grade level, class/section, optional student ID
- Teachers can organize students into classes (e.g., "Math Period 3", "5th Grade Room 201")
- Teachers can archive students (e.g., graduated, transferred) without deleting historical data
- Bulk student import via CSV upload
- Student search and filtering by class, grade level, or name
- Principals can view all students across all teachers in their school
- Data validation to prevent duplicate student entries

**Analysis Workflow (Teacher)**

- Teacher selects a student from their roster
- System initiates AI-powered analysis session using pre-configured ChatGPT prompts
- Teacher answers free-form questions about student (conversational interface)
- Analysis covers: academic strengths, areas for improvement, learning style, behavioral observations, engagement level
- Session can be saved and resumed later if interrupted
- Typical analysis time: 5-10 minutes per student
- System generates comprehensive analysis report with:
  - Identified strengths (ranked by confidence)
  - Areas for improvement (with specific recommendations)
  - Suggested interventions and teaching strategies
  - Learning style assessment
  - Comparison to grade-level benchmarks (if available)
- Teachers can review, edit, and approve AI-generated analysis before saving
- Teachers can add private notes not visible to principals
- Analysis history tracked with timestamps and version control

**Analysis Results & Recommendations**

- Clear, actionable recommendations tailored to each student
- Recommendations categorized by: academic support, behavioral strategies, engagement tactics
- Evidence citations linking recommendations back to teacher's input
- Printable/exportable student profiles (PDF format)
- Ability to share analysis with other teachers (with permission)
- Flagging system for students requiring urgent intervention

**Dashboard (Teachers)**

- Overview of all assigned students with analysis completion status
- Quick access to pending analyses
- Recently analyzed students with key highlights
- Alerts for students flagged for follow-up
- Analytics: class-wide trends, common strengths/weaknesses
- Progress tracking: compare multiple analyses for same student over time

**Dashboard (Principals)**

- School-wide overview: total students, analysis completion rate
- View all students organized by class, grade level, or teacher
- Aggregate insights: most common student needs, trending patterns
- Teacher activity: which teachers are actively using the platform
- Flagged students requiring attention (across all teachers)
- Exportable reports for school board meetings or district reporting
- Filter by date range, grade level, teacher, or subject area

**Trends & Analytics (Both Roles)**

- Time-series visualization of student progress (multiple analyses over time)
- Class-level comparisons: identify high-performing vs. struggling classes
- Grade-level benchmarking: compare against school or district averages
- Intervention effectiveness tracking: before/after comparison
- Data export for external analysis (CSV, Excel)
- Customizable date ranges and filters
- Visual dashboards with charts and graphs (not just tables)

**Search & Filtering**

- Global search across all students (name, ID, class)
- Advanced filters: grade level, analysis date, flagged status, completion status
- Saved filter presets for common queries
- Sort by: name, last analysis date, grade level, class

### Integrations

**Required Integrations:** Database, ChatGPT API, Email Service

**Database (Primary Data Store)**

- Relational database (PostgreSQL recommended) for structured student/user data
- Secure storage with encryption at rest
- Regular automated backups (daily minimum, retained for 30 days)
- Support for complex queries (trends, aggregations)
- Transaction support for data integrity

**ChatGPT API / OpenAI Integration**

- Integration with OpenAI API for AI-powered student analysis
- Custom system prompts optimized for educational assessment
- Conversation management: multi-turn dialogue with context retention
- Rate limiting and quota management to control costs
- Fallback mechanisms if API is unavailable (queue for later processing)
- Response validation and safety filters (detect inappropriate content)
- Token usage tracking for cost monitoring
- API key management and rotation

**Email Service (Transactional Email)**

- Password reset emails
- Account activation emails
- Weekly digest reports (optional for teachers)
- Alert notifications for flagged students
- System announcements and maintenance notifications
- Email deliverability monitoring

**Future Integration Considerations**

- Student Information System (SIS) integration for automated student roster sync
- Learning Management System (LMS) integration (Google Classroom, Canvas, Schoology)
- Parent portal for transparency (future enhancement)
- Data warehouse for advanced analytics

## Non-Functional Requirements

### Performance

**Response Time**

- Page load time: < 2 seconds for initial page load (p95)
- API response time: < 500ms for standard queries (p95), < 1s for complex analytics (p95)
- ChatGPT analysis session: response latency < 3 seconds per prompt/response exchange
- Dashboard data refresh: < 1 second for cached data, < 3 seconds for fresh queries
- Search results: < 300ms for student search across 1000+ students

**Concurrent Users**

- MVP target: Support 100 concurrent users without degradation
- Scale target (Year 1): Support 500 concurrent users
- Peak load: Handle 3x normal traffic during back-to-school periods (Aug-Sept)
- Analysis sessions: Support 50 concurrent AI analysis sessions

**Data Volume**

- Initial capacity: 10,000 students, 100 teachers, 50,000 analyses
- Year 1 target: 100,000 students, 2,000 teachers, 500,000 analyses
- Database query performance must remain acceptable (<1s) at 10x initial volume
- File storage: Support up to 100MB of documents per school (exported PDFs, imports)

**Optimization Requirements**

- Frontend code splitting to minimize initial bundle size (< 300KB gzipped)
- Lazy loading for analytics charts and non-critical components
- Database query optimization with proper indexing
- CDN usage for static assets
- Browser caching strategy for static resources (30 days)

### Security

**Authentication**

- Industry-standard password hashing (bcrypt with min 10 rounds)
- Secure session management with HTTP-only cookies
- SSO integration via OAuth 2.0 / SAML 2.0
- Optional MFA using TOTP (Time-based One-Time Password)
- Account lockout after 5 failed login attempts (15-minute cooldown)
- Password expiration policy: optional, configurable per district (e.g., 90 days)

**Authorization**

- Role-based access control (RBAC) with principle of least privilege
- Teachers can only access their own students and classes
- Principals can access all data within their school
- District admins can access all data within their district
- Fine-grained permissions for sensitive actions (user management, data export)
- API endpoints protected with JWT tokens
- CSRF protection for all state-changing operations

**Data Protection**

- Encryption at rest for all student data (AES-256)
- Encryption in transit (TLS 1.3 minimum)
- PII (Personally Identifiable Information) handling:
  - Student names, IDs, and analysis data treated as PII
  - No storage of student Social Security Numbers or highly sensitive data
  - Data anonymization for analytics (aggregated reports)
- Secure API key storage (environment variables, not in code)
- Audit logging for all data access and modifications
- Data retention policy: analysis data retained for 7 years (or per school policy)
- Secure data deletion: complete removal upon request, not just soft delete

**Compliance**

- **FERPA (Family Educational Rights and Privacy Act):**
  - Written consent required before sharing student data with third parties
  - Parents have right to access student records (future parent portal)
  - Implement data access request workflow
- **COPPA (Children's Online Privacy Protection Act):**
  - No direct data collection from students under 13
  - All data collected via teachers (as educational agents)
  - Parental notification and consent mechanisms (if direct student access added)
- **GDPR considerations** (if serving EU schools):
  - Right to access, rectification, erasure, data portability
  - Privacy by design and by default
  - Data Processing Agreement (DPA) with schools
- **State-specific regulations:** Compliance with California CCPA, New York Education Law 2-d, etc.

**Vulnerability Management**

- Regular dependency updates (weekly automated scans)
- Annual penetration testing by third-party security firm
- Vulnerability disclosure policy and responsible disclosure program
- WAF (Web Application Firewall) to protect against common attacks
- Rate limiting on all API endpoints to prevent abuse
- Input validation and sanitization to prevent XSS, SQL injection
- Content Security Policy (CSP) headers

### Scalability

**Expected Growth**

- **Year 1:** 20 schools, 500 teachers, 15,000 students
- **Year 2:** 100 schools, 2,500 teachers, 75,000 students
- **Year 3:** 300 schools, 7,500 teachers, 225,000 students
- Analysis volume grows 3x annually (increased usage per teacher)

**Scaling Strategy**

- **Horizontal scaling:** Stateless application tier to enable easy addition of app servers
- **Database scaling:**
  - Vertical scaling for initial growth (increase database instance size)
  - Read replicas for analytics and reporting queries (separate from transactional load)
  - Connection pooling to efficiently manage database connections
  - Potential sharding by school district for massive scale (Year 3+)
- **Caching strategy:**
  - Redis/Memcached for session storage and frequently accessed data
  - Application-level caching for dashboard aggregations
  - Cache invalidation on data updates
- **CDN for static assets:** Reduce server load and improve global performance
- **Auto-scaling:** Cloud-based infrastructure with auto-scaling groups (e.g., AWS, GCP)
- **Queue-based processing:** Background job queue (e.g., Bull, BullMQ) for long-running tasks:
  - CSV imports
  - Report generation
  - Batch email sending
  - Analytics pre-computation

**Capacity Planning**

- Monitor key metrics: CPU, memory, database connections, API latency
- Set up alerts for 70% resource utilization to proactively scale
- Quarterly capacity reviews and scaling exercises
- Load testing before major releases

### Reliability

**Uptime Target**

- **MVP:** 99% uptime (3.65 days downtime per year)
- **Production (Year 1):** 99.5% uptime (1.83 days downtime per year)
- **Scale (Year 2+):** 99.9% uptime (8.76 hours downtime per year)
- Planned maintenance during off-hours (evenings/weekends)
- Zero downtime for minor releases (rolling deployments)

**Error Rate**

- API error rate: < 0.5% (excluding client errors 4xx)
- Database transaction error rate: < 0.1%
- ChatGPT API failure handling: graceful degradation with retry logic

**Backup Strategy**

- **Database backups:**
  - Full daily backups retained for 30 days
  - Incremental backups every 6 hours
  - Point-in-time recovery capability (restore to any moment within 7 days)
  - Backup testing: monthly restore drills to verify backup integrity
  - Off-site backup storage in different geographic region
- **Application state:**
  - Infrastructure as Code (IaC) for reproducible deployments
  - Configuration backups in version control
- **User-uploaded files:**
  - S3 or equivalent with versioning enabled
  - Cross-region replication for critical files

**Disaster Recovery**

- **RTO (Recovery Time Objective):** 4 hours (maximum acceptable downtime)
- **RPO (Recovery Point Objective):** 1 hour (maximum acceptable data loss)
- Disaster recovery plan documented and tested quarterly
- Multi-region deployment for critical infrastructure (future)
- Runbook for common failure scenarios (database failure, API outage, etc.)
- On-call rotation for critical incident response

**Monitoring & Alerting**

- Application Performance Monitoring (APM) with New Relic, Datadog, or similar
- Uptime monitoring with external service (Pingdom, UptimeRobot)
- Error tracking with Sentry or Rollbar
- Real-time alerts via PagerDuty, Opsgenie, or email
- Dashboards for system health, business metrics, user activity

## Technical Requirements

### Tech Stack

- **Frontend:** Next.js 14+ (React 18+)
  - TypeScript for type safety
  - Server-side rendering (SSR) for initial page loads
  - Static generation for marketing pages
  - Tailwind CSS for styling with RTL support
  - next-intl or react-i18next for internationalization (i18n) and RTL handling
  - Recharts or Chart.js for data visualization
  - React Hook Form for form management
  - Zustand or React Context for state management
  - Hebrew web fonts (e.g., Rubik, Heebo, or Assistant for optimal Hebrew readability)

- **Backend:** NestJS 10+ with TypeScript
  - Modular architecture with domain-driven design
  - RESTful API design (with potential GraphQL future)
  - JWT-based authentication
  - Passport.js for authentication strategies
  - TypeORM or Prisma for database ORM
  - Bull or BullMQ for background job processing
  - Winston for structured logging
  - Joi or class-validator for input validation

- **Database:** PostgreSQL 15+
  - Relational data model for students, users, analyses
  - JSONB columns for flexible analysis data structure
  - Full-text search capabilities
  - PostGIS extension for geographic data (future: school mapping)

- **Integrations:**
  - OpenAI API (ChatGPT-4) for AI-powered analysis
  - SendGrid or Amazon SES for transactional email
  - Redis for caching and session storage
  - AWS S3 or Google Cloud Storage for file uploads/exports

### Infrastructure

**Hosting (MVP):**

- **Cloud provider:** AWS, Google Cloud, or Azure (to be decided)
- **Compute:** Containerized deployment (Docker)
- **Orchestration:** Kubernetes or managed container service (ECS, Cloud Run)
- **Database:** Managed PostgreSQL (RDS, Cloud SQL, Azure Database)
- **Caching:** Managed Redis (ElastiCache, Cloud Memorystore)
- **Storage:** Object storage (S3, GCS, Azure Blob)
- **CDN:** CloudFront, Cloud CDN, or Azure CDN

**CI/CD:**

- GitHub Actions or GitLab CI for automated builds and deployments
- Automated testing in pipeline (unit, integration, E2E)
- Staging environment for pre-production testing
- Production deployments via blue-green or rolling updates

**Development Tools:**

- Git for version control (GitHub or GitLab)
- ESLint + Prettier for code quality
- Husky for pre-commit hooks
- Docker Compose for local development environment
- Jest for unit and integration testing
- Playwright or Cypress for E2E testing

### Browser/Platform Support

**Desktop Browsers (Primary):**

- Google Chrome (last 2 versions)
- Mozilla Firefox (last 2 versions)
- Microsoft Edge (last 2 versions)
- Safari (last 2 versions)

**Mobile Browsers (Secondary):**

- iOS Safari (last 2 versions)
- Chrome Mobile (last 2 versions)
- Responsive design for tablets (iPad, Android tablets)

**Operating Systems:**

- Windows 10+
- macOS 11+
- Chrome OS (common in schools)

**Screen Resolutions:**

- Minimum supported: 1280x720 (720p)
- Optimized for: 1920x1080 (1080p) and 1440x900 (common laptop)
- Responsive breakpoints: mobile (<640px), tablet (640-1024px), desktop (1024px+)

**Accessibility:**

- WCAG 2.1 Level AA compliance
- Screen reader compatibility (JAWS, NVDA, VoiceOver)
- Keyboard navigation support
- Sufficient color contrast ratios
- Focus indicators for all interactive elements

**Network Conditions:**

- Graceful degradation on slow connections (2G, 3G)
- Offline detection and user feedback
- Progressive enhancement approach

### Language & Localization

**Primary Language: Hebrew**

- All UI text, labels, buttons, and messages must be in Hebrew
- All system-generated content (emails, reports, dashboards) must be in Hebrew
- Right-to-left (RTL) text direction support throughout the application
- Hebrew date and number formatting (e.g., Hebrew calendar support optional, but Gregorian dates in Hebrew format)
- Error messages and validation feedback in Hebrew
- Onboarding materials and help documentation in Hebrew

**Technical Requirements:**

- i18n (internationalization) framework supporting RTL languages (e.g., next-intl, react-i18next)
- RTL CSS support with logical properties (e.g., `margin-inline-start` instead of `margin-left`)
- Bidirectional text handling for mixed Hebrew/English content (e.g., student names, technical terms)
- Hebrew font optimization (web fonts with Hebrew character sets)
- Unicode normalization for Hebrew text storage and search
- Hebrew collation for sorting (alphabetical order according to Hebrew alphabet)

**Content Strategy:**

- UI strings stored in centralized translation files (JSON/YAML)
- Hebrew translations for all user-facing content
- English technical terms preserved where appropriate (e.g., "API", "ChatGPT")
- Date and time formatting using Hebrew locales (he-IL)

**Future Enhancement:**

- English interface as secondary language (for non-Hebrew speakers)
- Additional language support based on market expansion
- User-selectable language preference

## Out of Scope

**Explicitly NOT included in MVP:**

- Mobile native apps (iOS/Android) - web-responsive only
- Parent portal or parent-facing features
- Student-facing interface (no direct student login)
- Video or audio recording during analysis sessions
- Integration with Learning Management Systems (LMS) - manual workflows only
- Automated SIS (Student Information System) sync - manual CSV import only
- Advanced analytics with machine learning predictions (basic trends only)
- Custom branding per school/district (single branded experience)
- Real-time collaboration (multiple teachers analyzing same student simultaneously)
- Gamification or student engagement features
- Curriculum mapping or standards alignment
- Lesson planning integration
- Grade book integration
- Attendance tracking
- Behavior incident management
- IEP (Individualized Education Program) or 504 plan management
- Parent-teacher communication tools

**Future Enhancements (Post-MVP):**

- Mobile apps for on-the-go access
- Parent transparency portal (view student analyses with permission)
- LMS and SIS integrations for automated roster sync
- English language interface option (for non-Hebrew speaking users)
- Additional language support for diverse international schools
- Advanced predictive analytics (e.g., early warning systems for at-risk students)
- Intervention tracking and outcome measurement
- Professional development resources for teachers
- District-wide benchmarking and best practice sharing

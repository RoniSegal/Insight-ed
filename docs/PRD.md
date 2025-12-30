# Product Requirements Document – Growth Engine

**Version:** 1.0
**Last Updated:** December 30, 2025
**Status:** Approved
**Product Owner:** Educational Technology Director
**Tech Lead:** Senior Full-Stack Engineer

---

## 1. Overview

### Project Summary

Growth Engine is an AI-powered educational assessment platform that transforms how K-12 teachers understand and support their students. The platform uses conversational AI (ChatGPT-4) to guide teachers through structured student assessments via natural language dialogue, then generates comprehensive analysis reports with actionable intervention strategies.

**The Problem:** Teachers spend 50+ hours per week but lack time for deep individual student assessment. They have valuable observations about each student but no efficient way to synthesize these insights into actionable plans. Traditional assessment tools are time-consuming, checklist-based, and fail to capture the nuanced understanding teachers develop through daily interactions.

**The Solution:** Growth Engine enables teachers to complete a comprehensive student analysis in 5-10 minutes through an AI-guided conversation. The system captures teacher observations, analyzes patterns, and generates personalized recommendations for academic support, behavioral strategies, and engagement tactics. Principals gain school-wide visibility through aggregated dashboards showing trends, intervention needs, and teacher activity.

### Domain

**Primary Domain:** K-12 Education Technology
**Sub-Domains:** Student Assessment, Educational Analytics, Teacher Productivity Tools, School Administration

### Strategic Context

**Why We're Building This:**
- Educational outcomes depend on personalized instruction, but teachers lack tools to efficiently assess individual student needs at scale
- Schools generate vast amounts of student data but struggle to transform it into actionable insights
- Principals need visibility into school-wide patterns to allocate resources and support teachers effectively
- AI technology is mature enough to augment (not replace) teacher expertise in understanding students

**Business Problems Solved:**
1. **Teacher Time Scarcity:** Reduce assessment time from 30-60 minutes per student to 5-10 minutes through AI-guided conversation
2. **Inconsistent Assessment:** Provide structured framework ensuring comprehensive evaluation across academic, behavioral, and engagement dimensions
3. **Lost Insights:** Capture tacit teacher knowledge that would otherwise remain undocumented
4. **Limited Visibility:** Give principals school-wide view of student needs, teacher activity, and intervention effectiveness
5. **Resource Allocation:** Enable data-driven decisions about where to focus intervention resources and professional development

**Market Opportunity:**
- 3.7 million teachers in U.S. public K-12 schools
- Growing EdTech market projected to reach $605 billion by 2027
- Increasing demand for AI-powered tools that augment teacher capabilities
- Shift toward personalized learning requires scalable assessment solutions

### Target Launch Date

**MVP Pilot Launch:** Month 5 (end of February 2026)
**Production Launch:** Month 8 (end of May 2026)
**Full-Scale Rollout:** Month 12 (September 2026 - start of new school year)

---

## 2. Goals & Success Criteria

### Business Goals

1. **Establish Product-Market Fit:** Validate that Growth Engine addresses real teacher and principal needs with measurable time savings and improved student outcomes
2. **Achieve Market Penetration:** Onboard 20+ schools and 500+ teachers within first year, demonstrating scalability and market demand
3. **Demonstrate ROI:** Show clear return on investment through teacher time savings (2+ hours/week), improved intervention effectiveness, and student outcome improvements
4. **Build Sustainable Business:** Achieve positive unit economics with subscription revenue covering development, infrastructure, and AI API costs
5. **Create Defensible Moat:** Establish data network effects and platform stickiness through accumulated student insights and teacher adoption

### User Goals

**Teachers:**
1. **Save Time:** Complete comprehensive student assessment in 5-10 minutes instead of 30-60 minutes
2. **Gain Actionable Insights:** Receive specific, evidence-based recommendations for supporting each student
3. **Track Progress:** Monitor student development over time with historical analysis comparisons
4. **Improve Outcomes:** Identify intervention needs early and implement effective strategies
5. **Reduce Documentation Burden:** Automatically generate professional reports for parent conferences, IEP meetings, and administrative requirements

**Principals:**
1. **School-Wide Visibility:** Understand student needs across all classrooms and grade levels at a glance
2. **Identify Trends:** Recognize patterns requiring professional development, curriculum changes, or resource allocation
3. **Support Teachers:** Identify teachers who need assistance and monitor platform adoption
4. **Data-Driven Decisions:** Allocate intervention resources based on concrete evidence rather than anecdotes
5. **Compliance & Reporting:** Generate reports for district administrators and school board presentations

**District Administrators (Future):**
1. **District-Level Insights:** Compare performance across schools and identify best practices
2. **Resource Planning:** Make strategic decisions about staffing, professional development, and program funding
3. **Accountability:** Demonstrate impact to school boards and community stakeholders

### Success Metrics / KPIs

#### MVP Success Criteria (Months 1-3)

| Metric | Target | Measurement Method | Baseline |
|--------|--------|-------------------|----------|
| **Pilot School Enrollment** | 3-5 schools | Sales/onboarding tracking | 0 |
| **Active Teachers** | 50-100 | Login and usage analytics | 0 |
| **Analysis Completion Rate** | 80% of students | % of students with ≥1 analysis | N/A |
| **Teacher Time Savings** | 2+ hours/week | User survey + usage data | Baseline survey |
| **Teacher Satisfaction (NPS)** | 30+ | Post-analysis survey | N/A |
| **System Uptime** | 99%+ during school hours | Monitoring tools | N/A |
| **Security Incidents** | 0 | Security monitoring | N/A |
| **Average Analysis Time** | <10 minutes | Session duration tracking | N/A |

#### Product-Market Fit (Months 6-12)

| Metric | Target | Measurement Method | Baseline |
|--------|--------|-------------------|----------|
| **Active Schools** | 20+ | Account count | 3-5 |
| **Active Teachers** | 500+ | Weekly active users | 50-100 |
| **Students Analyzed** | 15,000+ | Total student count | 1,500 |
| **Teacher Retention** | 85%+ | % continuing after trial | N/A |
| **School Renewal Rate** | 80%+ | Annual contract renewals | N/A |
| **Net Promoter Score** | 40+ | Quarterly NPS survey | 30+ |
| **Principal Adoption** | 90%+ | % of principals using dashboard | N/A |
| **Feature Adoption** | 70%+ | % using trends/export features | N/A |
| **Support Ticket Volume** | <5% of analyses | Support tickets / total analyses | N/A |

#### Scale Metrics (Months 12-24)

| Metric | Target | Measurement Method | Baseline |
|--------|--------|-------------------|----------|
| **Active Schools** | 100+ | Account count | 20+ |
| **Active Teachers** | 2,000+ | Weekly active users | 500+ |
| **Total Analyses** | 500,000+ | Cumulative analysis count | 50,000 |
| **Analyses Per Student/Year** | 3+ | Avg analyses per student | 1 |
| **Revenue** | $500K+ ARR | Annual Recurring Revenue | $0 |
| **Gross Margin** | 70%+ | (Revenue - COGS) / Revenue | N/A |
| **Churn Rate** | <15% annually | Lost schools / total schools | N/A |
| **Customer Acquisition Cost** | <$500/school | Sales cost / new schools | N/A |

**Key Performance Indicators:**

- **Adoption:**
  - Weekly Active Users (WAU) growth rate: 20%+ month-over-month in first year
  - Feature activation rate: 80%+ of teachers complete first analysis within 7 days of onboarding
  - Principal dashboard usage: 90%+ of principals log in weekly

- **Engagement:**
  - Analysis frequency: 3+ analyses per student per academic year
  - Session completion rate: 90%+ of started analyses are completed
  - Return rate: 80%+ of teachers return within 7 days of first analysis

- **Retention:**
  - 30-day retention: 85%+ of teachers active after first month
  - 90-day retention: 75%+ of teachers still active
  - Annual retention: 85%+ of teachers renew for second year

- **Impact:**
  - Teacher time savings: Average 2.5 hours/week documented through surveys
  - Intervention effectiveness: 60%+ of flagged students show improvement in follow-up analysis
  - Student coverage: 90%+ of students have at least one analysis per semester

- **Revenue (Year 1):**
  - Average Revenue Per User (ARPU): $8-12/teacher/month
  - Customer Lifetime Value (LTV): $500-800 per teacher over 3 years
  - LTV:CAC Ratio: 3:1 or higher

---

## 3. Non-Goals

**What is explicitly OUT of scope for this project:**

### Phase 1 MVP (Months 1-8)

1. **Mobile Native Apps:** No iOS or Android native apps; web-responsive design only (mobile browsers supported)
2. **Parent Portal:** No parent-facing features; teachers and principals only in MVP
3. **Student Login:** No direct student access; all data collected through teacher observations
4. **Video/Audio Recording:** No multimedia capture during analysis sessions; text-based only
5. **LMS Integration:** No automated sync with Google Classroom, Canvas, Schoology, etc.; manual workflows
6. **SIS Integration:** No automated Student Information System integration; manual CSV import/export only
7. **Multi-Language Support:** Hebrew is the primary and only language; UI will be right-to-left (RTL) with Hebrew text throughout
8. **Advanced ML Predictions:** Basic trends only; no predictive analytics or early warning systems using machine learning
9. **Custom Branding:** Single branded experience; no white-labeling or school-specific branding
10. **Real-Time Collaboration:** No simultaneous multi-teacher editing; single-user analysis sessions
11. **Curriculum Mapping:** No alignment with Common Core or state standards
12. **Lesson Planning:** No integration with lesson planning or instructional design
13. **Grade Book:** No gradebook functionality or grade tracking
14. **Attendance Tracking:** No attendance management features
15. **Behavior Incident Management:** No disciplinary incident tracking (beyond analysis insights)
16. **IEP/504 Management:** No specialized education plan management (analysis can inform plans but doesn't replace legal IEP documents)
17. **Assessment Creation:** No ability for teachers to create custom assessments or quizzes
18. **Student Portfolios:** No student work samples or artifact collection

### Post-MVP (Deferred to Future Phases)

**Phase 2 Enhancements (Months 9-18):**
- Parent transparency portal (view analyses with teacher permission)
- LMS integrations (Google Classroom, Canvas) for automated roster sync
- Mobile native apps (iOS/Android) for on-the-go access
- Advanced trend visualization and pattern recognition
- Intervention tracking with before/after outcome measurement

**Phase 3 Enhancements (Year 2+):**
- Predictive analytics and early warning systems
- District-wide benchmarking and best practice sharing
- Professional development recommendation engine
- Custom branding and white-labeling for districts
- API for third-party integrations

**Never in Scope:**
- AI making decisions without teacher review (human always in the loop)
- Automated grading or student evaluation
- Student surveillance or monitoring (no tracking student devices)
- Replacing teachers with AI (augmentation, not automation)
- Selling student data to third parties (absolute prohibition)

---

## 4. Users & Personas

### Primary Users

1. **Classroom Teachers** (K-12) – Primary daily users
2. **School Principals** – Secondary users, oversight and strategic planning

### Detailed Personas

#### Persona 1: Sarah Chen – Elementary School Teacher

**Background:**
- **Age:** 32
- **Role:** 4th Grade Teacher at Lincoln Elementary (suburban public school)
- **Experience:** 8 years teaching, 3rd year at current school
- **Class Size:** 24 students (mixed ability levels, 3 ELL students, 2 with IEPs)
- **Work Schedule:** 7:30 AM - 4:30 PM at school, 1-2 hours prep at home
- **Tech Proficiency:** Moderate – comfortable with Google Classroom, Zoom, basic productivity tools

**Goals:**
- Differentiate instruction to meet diverse student needs
- Identify struggling students early enough for effective intervention
- Provide specific, evidence-based feedback to parents at conferences
- Reduce time spent on administrative tasks and paperwork
- Track student progress over the school year

**Pain Points:**
- "I know my students well but struggle to articulate what I observe in actionable ways"
- "Parent conferences are stressful because I don't have concrete data to share beyond test scores"
- "I suspect several students need extra support but don't have time for formal assessments"
- "By the time I realize a student is struggling, it's often too late for easy intervention"
- "I spend evenings writing student comments and recommendations that no one reads"

**Use Cases:**
- Conducts analysis for each student at start of year (September) to establish baseline
- Re-analyzes struggling students monthly to track intervention effectiveness
- Runs analyses before parent-teacher conferences for data-driven conversations
- Uses trends dashboard to identify class-wide needs for lesson planning

**Technical Proficiency:**
- Comfortable with web apps and mobile devices (iPhone)
- Prefers simple, intuitive interfaces over feature-rich complexity
- Values fast onboarding with minimal training required
- Accustomed to single sign-on with Google account

**Quote:** "I don't have time to learn another complicated system. If it takes more than 10 minutes per student, I won't use it."

---

#### Persona 2: Marcus Thompson – Middle School Principal

**Background:**
- **Age:** 47
- **Role:** Principal at Roosevelt Middle School (urban public school, Title I)
- **Experience:** 15 years as educator (10 years teacher, 5 years admin)
- **School Size:** 650 students, 45 teachers, grades 6-8
- **Work Schedule:** 60+ hours/week, frequent evening events
- **Tech Proficiency:** Advanced – uses data dashboards, SIS systems, manages budgets with spreadsheets

**Goals:**
- Ensure all students receive appropriate support and interventions
- Make data-driven decisions about resource allocation and professional development
- Identify trends requiring systemic changes (curriculum, staffing, programs)
- Monitor teacher effectiveness and provide targeted support
- Demonstrate school improvement to district administrators and parents

**Pain Points:**
- "I can't see the full picture of student needs across 45 classrooms"
- "Teachers tell me students are struggling, but I lack data to justify intervention funding"
- "I'm blind to school-wide patterns until they become crises"
- "Compiling data for district reports is a nightmare of spreadsheets and teacher surveys"
- "I want to support my teachers but don't know who needs help until problems escalate"

**Use Cases:**
- Reviews weekly dashboard to monitor analysis completion rates and flagged students
- Generates monthly reports for district leadership showing intervention needs and trends
- Identifies teachers with low platform usage for professional development conversations
- Analyzes school-wide data before budgeting decisions (e.g., reading interventionist vs. math coach)
- Exports grade-level reports for department chair meetings

**Technical Proficiency:**
- Power user of data tools and dashboards
- Comfortable with filters, exports, and data analysis
- Values visual charts and graphs over raw data tables
- Expects mobile access for checking dashboards between meetings

**Quote:** "I need to see the whole school at a glance and drill down into specifics. If I can't answer 'which grade needs the most help?' in 30 seconds, it's not useful."

---

#### Persona 3: Jennifer Rodriguez – High School Teacher

**Background:**
- **Age:** 28
- **Role:** English Teacher at Washington High School (rural public school)
- **Experience:** 4 years teaching
- **Class Load:** 5 sections, 150 students total (sophomores and juniors)
- **Work Schedule:** 7:00 AM - 3:30 PM at school, grading on weekends
- **Tech Proficiency:** High – digital native, uses tech extensively in classroom

**Goals:**
- Track progress of 150 students without losing individual insights
- Identify at-risk students before they fail or drop out
- Provide targeted writing and reading support
- Manage time effectively with large student load
- Build relationships despite limited one-on-one time

**Pain Points:**
- "With 150 students, I can barely remember all their names, let alone their individual needs"
- "I want to personalize instruction but it's impossible at this scale"
- "Students slip through the cracks because I don't have time for individual check-ins"
- "Assessment tools are designed for elementary teachers with 25 students, not my situation"

**Use Cases:**
- Prioritizes analyzing students showing warning signs (declining grades, absences)
- Uses bulk analysis features to process large rosters efficiently
- Filters dashboard by class period to focus on one group at a time
- Tracks intervention effectiveness for students on academic probation

**Technical Proficiency:**
- Expects modern, fast web interface
- Comfortable with keyboard shortcuts and power user features
- Values efficiency features like batch operations and saved filters
- Uses platform on laptop and tablet

**Quote:** "I need a system that scales to 150 students. If it's designed for elementary teachers with 25 kids, it won't work for me."

---

#### Persona 4: Dr. Aisha Williams – District Curriculum Director (Future User)

**Background:**
- **Age:** 51
- **Role:** District-Level Administrator overseeing 12 schools
- **Experience:** 25 years in education (teacher, principal, central office)
- **Scope:** 8,000 students, 500 teachers, $120M annual budget
- **Tech Proficiency:** Moderate-to-advanced – uses district dashboards, manages programs

**Goals (Future Scope):**
- Identify district-wide trends requiring curriculum or policy changes
- Justify budget requests with concrete data
- Share best practices across schools
- Monitor equity of access to interventions
- Ensure compliance with state and federal requirements

**Pain Points:**
- "Each school uses different systems; I can't compare apples to apples"
- "I know some schools are doing great work, but I can't scale those practices district-wide"
- "When the school board asks about achievement gaps, I have anecdotes, not data"

**Note:** District-level features are out of scope for MVP but should inform architectural decisions for future scalability.

---

## 5. User Journeys & Core Flows

### High-Level User Flows

1. **Teacher: Student Analysis Flow**
   Login → Dashboard → Select Student → AI-Guided Analysis Session → Review Results → Save with Notes → Export/Print (Optional)

2. **Principal: School Monitoring Flow**
   Login → Executive Dashboard → View Metrics/Charts → Drill Down (by grade/class/teacher) → Identify Trends → Export Reports

3. **Teacher: Progress Tracking Flow**
   Login → Select Student → View History → Compare Analyses Over Time → Identify Changes → Update Intervention Plan

4. **Teacher: Bulk Operations Flow**
   Login → Upload CSV → Validate Students → Bulk Assign to Classes → Begin Batch Analysis Queue

### Detailed User Journeys

#### Journey 1: Teacher Conducts First Student Analysis

**Actor:** Sarah Chen (Elementary Teacher)
**Trigger:** Beginning of school year, wants to establish baseline for all students
**Frequency:** 1x per student per semester (minimum); 3-4x per year (typical)
**Duration:** 5-10 minutes per student

**Steps:**

1. **Login (15 seconds)**
   - Sarah navigates to growth-engine.app
   - Clicks "Sign in with Google" button (SSO with school Google Workspace)
   - Automatically authenticated, redirected to dashboard

2. **Dashboard Overview (30 seconds)**
   - Sees list of all 24 students with completion status
   - Notices 18 students still need baseline analysis (highlighted in yellow)
   - Sees motivational progress bar: "6/24 students analyzed (25%)"
   - Filters view to show "Not Yet Analyzed" students

3. **Select Student (10 seconds)**
   - Clicks on "Marcus Johnson" from filtered list
   - Student detail card appears with basic info: grade, class, any previous analyses
   - Clicks "Start New Analysis" button

4. **AI-Guided Analysis Session (5-8 minutes)**
   - **Introduction:** System explains process and time estimate
   - **Academic Assessment (2-3 min):**
     - AI: "Let's start with Marcus's academic strengths. What subjects or skills does he excel in?"
     - Sarah: "Marcus is really strong in math, especially problem-solving. He can see patterns quickly."
     - AI: "That's great. Can you give me a specific example?"
     - Sarah: "Last week he solved a multi-step word problem that most students struggled with."
     - AI: "What about areas where Marcus struggles academically?"
     - Sarah: "Reading comprehension is tough for him, especially with inferencing."
   - **Behavioral/Social Assessment (2-3 min):**
     - AI: "How would you describe Marcus's behavior and social interactions?"
     - Sarah: "He's generally well-behaved but can be impulsive. Sometimes blurts out answers."
     - AI: "How does that affect his learning or the class environment?"
     - Sarah: "He gets frustrated when he has to wait his turn. Works better in small groups."
   - **Engagement Assessment (1-2 min):**
     - AI: "Tell me about Marcus's engagement level. When is he most engaged?"
     - Sarah: "Hands-on activities, definitely. He zones out during long lectures."
     - AI: "Any patterns to when he's most or least focused?"
     - Sarah: "Mornings are better. After lunch he's distracted."
   - **Progress indicator** shows conversation progress (Academic → Behavioral → Engagement → Complete)
   - **Session can be paused:** "Save & Resume Later" button always visible

5. **AI Processing (10-15 seconds)**
   - Loading screen: "Analyzing your observations about Marcus..."
   - System sends conversation to ChatGPT API with structured prompts
   - AI generates comprehensive analysis report

6. **Review Results (2-3 minutes)**
   - **Strengths Section:**
     - "Strong mathematical reasoning and pattern recognition"
     - "Excels in hands-on, kinesthetic learning activities"
     - "Works well in small group settings"
   - **Areas for Improvement:**
     - "Reading comprehension, particularly inferential reasoning"
     - "Impulse control and turn-taking in whole-class discussions"
     - "Sustained attention during passive learning (lectures)"
   - **Learning Style Assessment:**
     - "Kinesthetic learner with strong visual-spatial skills"
     - "Prefers active engagement over passive listening"
     - "Morning hours optimal for complex cognitive tasks"
   - **Recommended Interventions (Prioritized):**
     - **High Priority:** Small-group reading intervention focusing on inference strategies
     - **Medium Priority:** Self-regulation techniques (e.g., fidget tools, movement breaks)
     - **Medium Priority:** Graphic organizers for reading comprehension
     - **Low Priority:** Preferential seating near teacher for redirection
   - **Evidence Citations:** Each recommendation links back to Sarah's specific observations
   - Sarah can **edit any section** if AI misinterpreted or add additional notes
   - Private notes section (not visible to principal): "Check with parents about ADHD evaluation"

7. **Save Analysis (10 seconds)**
   - Sarah reviews for accuracy
   - Adds private note about parent follow-up
   - Clicks "Save Analysis" button
   - Confirmation: "Analysis for Marcus Johnson saved successfully!"
   - Option to export as PDF appears

8. **Post-Analysis Actions (Optional)**
   - **Export PDF:** Professional report for parent conference folder
   - **Flag for Follow-Up:** Marks Marcus as "Needs Reading Intervention"
   - **Share with Specialist:** Option to share with reading specialist (if permissions allow)
   - **Return to Dashboard:** Clicks "Analyze Next Student" or "Back to Dashboard"

**Success Criteria:**
- ✅ Analysis completed in <10 minutes
- ✅ AI-generated recommendations are relevant and actionable
- ✅ Sarah feels report accurately reflects her observations
- ✅ Report is professional enough for parent conference
- ✅ Session can be interrupted and resumed without data loss

**Edge Cases:**
- **Session timeout:** If Sarah is interrupted (class emergency), session auto-saves every 2 minutes; can resume later
- **AI hallucination:** If AI generates nonsensical recommendation, Sarah can delete and manually add her own
- **Insufficient input:** If Sarah's responses are too brief, AI prompts for more detail: "Can you provide a specific example?"
- **Conflicting observations:** If Sarah says student is both "strong" and "struggling" in same area, AI asks clarifying question
- **Technical error:** If ChatGPT API fails, error message offers to queue analysis for later processing

---

#### Journey 2: Principal Reviews School-Wide Trends

**Actor:** Marcus Thompson (Middle School Principal)
**Trigger:** Monday morning weekly review; preparing for faculty meeting
**Frequency:** Weekly (detailed review); daily (quick check)
**Duration:** 10-15 minutes (weekly review)

**Steps:**

1. **Login (15 seconds)**
   - Marcus opens growth-engine.app on laptop
   - Authenticates with district SSO (Microsoft 365)
   - Lands on Principal Executive Dashboard

2. **Executive Dashboard Overview (1-2 minutes)**
   - **Key Metrics (Top Cards):**
     - Total Students: 650
     - Students Analyzed: 487 (75%)
     - Flagged for Intervention: 42 (6.5%)
     - Active Teachers This Week: 38/45 (84%)
   - **Trend Chart:** Analysis completion rate over last 4 weeks (shows dip after holiday break)
   - **Alert Banner:** "8 students flagged as High Priority by multiple teachers – Review Now"
   - **Quick Filters:** Grade level, department, date range
   - Marcus notes completion rate dropped from 85% to 75% – needs investigation

3. **Investigate Completion Rate Drop (2 minutes)**
   - Clicks "Active Teachers" metric to drill down
   - Sees list of 45 teachers with usage statistics
   - Sorts by "Last Analysis Date" – identifies 7 teachers who haven't used platform in 3+ weeks
   - Notes: "Math department lag – follow up with dept chair"
   - Exports teacher activity report as CSV for follow-up email

4. **Review Flagged Students (3-4 minutes)**
   - Clicks on "42 Flagged for Intervention" metric
   - Sees table of students sorted by priority level (High → Medium → Low)
   - **Filters:** High priority only (8 students)
   - Reviews each student's summary:
     - Student name, grade, primary teacher
     - Flagging reasons: "Declining engagement + reading struggles" (3 students), "Behavioral concerns" (2 students), "Math + attendance" (3 students)
   - Recognizes pattern: 3 students in same 6th-grade class struggling with reading
   - **Decision:** Assign reading interventionist to that class; schedule meeting with teacher

5. **Identify Trends (3-4 minutes)**
   - Scrolls to "Common Intervention Needs" chart (bar chart showing top needs across school)
     - Reading comprehension: 87 students (18%)
     - Behavioral self-regulation: 54 students (11%)
     - Math fact fluency: 49 students (10%)
     - Engagement/motivation: 38 students (8%)
   - **Insight:** Reading comprehension is #1 need school-wide
   - Clicks "Reading Comprehension" to see breakdown by grade level
     - 6th grade: 35 students (highest concentration)
     - 7th grade: 28 students
     - 8th grade: 24 students
   - **Decision:** Allocate professional development budget to reading comprehension strategies training for all ELA teachers

6. **Grade-Level Comparison (2 minutes)**
   - Switches to "Grade Level Overview" tab
   - Sees side-by-side comparison of 6th, 7th, 8th grades:
     - Analysis completion rate by grade
     - Average flagged students per class
     - Most common strengths and needs
   - Notes 7th grade has highest completion rate (92%) – dept chair is champion user
   - Notes 8th grade has lowest completion rate (68%) – needs encouragement

7. **Export Report for Faculty Meeting (1 minute)**
   - Clicks "Export Executive Summary" button
   - Selects date range: Last 4 weeks
   - Chooses format: PowerPoint slides (for faculty meeting presentation)
   - Downloads file: "Growth-Engine-Report-Dec-2025.pptx"
   - Contains: Key metrics, trend charts, top intervention needs, grade comparisons

8. **Set Reminders and Next Actions (1 minute)**
   - Adds to to-do list:
     - [ ] Email math dept chair re: low usage
     - [ ] Schedule reading interventionist for 6th-grade focus
     - [ ] Announce professional development for ELA teachers
     - [ ] Recognize 7th-grade team for high platform adoption
   - Bookmarks dashboard for daily check-in tomorrow

**Success Criteria:**
- ✅ Marcus identifies actionable trends in <15 minutes
- ✅ Dashboard visualizations make patterns immediately obvious
- ✅ Marcus can drill down from high-level metrics to specific students
- ✅ Export generates professional report for stakeholder meetings
- ✅ Insights lead to concrete administrative decisions (resource allocation, professional development)

**Edge Cases:**
- **No data:** If teachers haven't used platform yet, dashboard shows onboarding tips and encouragement to promote usage
- **Incomplete data:** If only 30% of students analyzed, banner warns: "Low data coverage – insights may not represent full school"
- **Conflicting flags:** If student flagged by one teacher but not others, system shows discrepancy for principal to investigate
- **Data privacy:** Principal sees aggregated data but must click into individual student to see detailed analysis (audit log tracks access)
- **Slow loading:** If aggregations take >3 seconds, show cached data with "Refreshing..." indicator

---

#### Journey 3: Teacher Tracks Student Progress Over Time

**Actor:** Sarah Chen (Elementary Teacher)
**Trigger:** Mid-year check-in; wants to see if interventions are working
**Frequency:** Monthly for struggling students; quarterly for all students
**Duration:** 3-5 minutes per student

**Steps:**

1. **Navigate to Student (30 seconds)**
   - Sarah logs in and goes to dashboard
   - Filters students by "Flagged for Intervention"
   - Selects "Marcus Johnson" (previously flagged for reading intervention)

2. **View Analysis History (1 minute)**
   - Student detail page shows timeline of all analyses:
     - **September 5:** Initial baseline analysis
     - **October 12:** Follow-up after reading intervention started
     - **December 8:** Current check-in (today)
   - Each analysis shows thumbnail summary (strengths, needs, recommendations)
   - Clicks "Compare Analyses" button

3. **Side-by-Side Comparison (2-3 minutes)**
   - **Split-screen view:** September (left) vs. December (right)
   - **Strengths Section:**
     - ✅ Sept: "Strong math skills"
     - ✅ Dec: "Strong math skills" + "Improved reading fluency"
   - **Areas for Improvement:**
     - Sept: "Reading comprehension (inferencing)"
     - ⚠️ Dec: "Still struggles with inferencing, but improving"
   - **Engagement:**
     - Sept: "Distracted during lectures"
     - ✅ Dec: "More focused; fidget tools helping"
   - **Highlighted Changes:** System automatically highlights what's improved (green), stayed same (yellow), or worsened (red)
   - **Intervention Effectiveness:** Shows which recommendations were implemented and outcomes
     - Small-group reading intervention: ✅ Implemented → Moderate improvement
     - Fidget tools: ✅ Implemented → Significant improvement
     - Graphic organizers: ⚠️ Partially implemented → Unclear impact

4. **Conduct New Analysis (5 minutes)**
   - Clicks "Start New Analysis" to update Marcus's profile
   - AI prompts: "It's been 2 months since your last analysis. Let's see how Marcus has progressed."
   - AI intelligently asks about areas flagged previously:
     - "You mentioned reading comprehension was a challenge. How has that changed?"
     - "You implemented small-group intervention. What have you noticed?"
   - Sarah provides updated observations
   - AI generates new analysis with progress indicators

5. **Review Progress Report (1 minute)**
   - New analysis includes "Progress Since Last Analysis" section:
     - ✅ Improved: Reading fluency, focus/attention
     - ↔️ Stable: Math skills (still strong), social interactions
     - ⚠️ Still Needs Support: Inferential reading comprehension
   - **Updated Recommendations:**
     - Continue small-group reading intervention (working)
     - Add specific inferencing strategy instruction
     - Continue fidget tools (highly effective)
   - Sarah saves analysis and updates intervention plan

6. **Share Progress with Parent (Optional, 1 minute)**
   - Clicks "Export Progress Report"
   - Generates parent-friendly PDF showing before/after comparison
   - Highlights growth areas and ongoing intervention plan
   - Sarah prints for upcoming parent conference

**Success Criteria:**
- ✅ Sarah can quickly see if student has improved, stayed same, or declined
- ✅ Comparison view makes changes visually obvious (green/yellow/red highlighting)
- ✅ AI asks contextual questions based on previous analysis (not starting from scratch)
- ✅ Progress report is concrete enough to share with parents and administrators
- ✅ Sarah feels empowered to adjust interventions based on data

**Edge Cases:**
- **First analysis:** If no prior analysis exists, system skips comparison and conducts baseline
- **Large time gap:** If >6 months since last analysis, system warns: "Long gap – student may have changed significantly"
- **Contradictory progress:** If new analysis shows decline in previously strong area, system flags for Sarah's attention
- **Intervention not implemented:** If Sarah says recommended intervention wasn't tried, AI asks why and adjusts recommendations

---

#### Journey 4: Teacher Onboarding – First-Time User

**Actor:** Jennifer Rodriguez (High School Teacher) – New to Platform
**Trigger:** School has just adopted Growth Engine; Jennifer invited to platform
**Frequency:** One-time onboarding
**Duration:** 20-30 minutes (includes account setup + first analysis)

**Steps:**

1. **Invitation Email (Day 1)**
   - Jennifer receives email from principal: "Welcome to Growth Engine! Start analyzing your students in minutes."
   - Email includes: Video tutorial (3 min), quick start guide PDF, and "Get Started" button
   - Clicks "Get Started" → directed to signup page

2. **Account Creation (2 minutes)**
   - Clicks "Sign Up with Microsoft" (school uses Microsoft 365)
   - Authorizes Growth Engine to access basic profile (name, email)
   - Prompted to complete profile:
     - School: Washington High School (pre-filled)
     - Role: Teacher
     - Grade Levels: 10, 11
     - Subjects: English Language Arts
   - Accepts Terms of Service and Privacy Policy
   - Clicks "Complete Setup"

3. **Interactive Onboarding Tour (5 minutes)**
   - **Welcome Screen:** "Welcome, Jennifer! Let's get you started in 3 easy steps."
   - **Step 1: Add Your Students**
     - Option A: Upload CSV from student information system
     - Option B: Manually add students one by one
     - Option C: Skip for now (can add later)
     - Jennifer chooses Option A: Upload CSV
     - Uploads file with 150 students (name, student ID, class period)
     - System validates: "150 students imported successfully!"
   - **Step 2: Take a Quick Tour**
     - Interactive walkthrough highlights: Dashboard, Student List, Analysis Button, Trends
     - Tooltips explain each section: "This is your student roster. Click any student to begin analysis."
     - Can skip tour or complete it (Jennifer completes it – 2 minutes)
   - **Step 3: Analyze Your First Student**
     - System suggests: "Let's analyze your first student together! Pick a student you know well."
     - Jennifer selects student: "Emily Martinez"
     - Guided first analysis with extra helpful tooltips and examples

4. **First Analysis with Coaching (8-10 minutes)**
   - AI provides extra context during first analysis:
     - "I'll ask you a series of questions about Emily. Answer in your own words – there are no wrong answers."
     - "This usually takes 5-10 minutes. You can save and come back anytime."
   - Jennifer completes analysis with inline tips:
     - After academic section: "Great! You can provide as much or as little detail as you like. More detail → better recommendations."
   - AI generates results with explanatory text: "Here's what I learned from your observations..."
   - Jennifer reviews and saves

5. **Post-Analysis Onboarding (2 minutes)**
   - Congratulations screen: "You just completed your first analysis! Here's what you can do next:"
     - ✅ Analyze more students at your own pace
     - ✅ View your dashboard to track progress
     - ✅ Export Emily's report as a PDF
   - **Optional Quick Wins:**
     - "Want to save time? Analyze students in batches by class period."
     - "Tip: Use filters to find students who need analysis first."
   - Prompts to set personal goal: "How many students do you want to analyze this week?" (Jennifer sets goal: 20)

6. **Ongoing Support (Embedded in Platform)**
   - Help button always visible in top-right corner
   - Contextual help tooltips throughout interface
   - Link to video library and help documentation
   - Option to request live support session with Customer Success team

**Success Criteria:**
- ✅ Jennifer completes onboarding in <30 minutes
- ✅ Jennifer successfully imports all 150 students
- ✅ Jennifer completes first analysis independently (with coaching)
- ✅ Jennifer understands core workflow: Select student → Analyze → Review → Save
- ✅ Jennifer sets personal goal and knows how to track progress

**Edge Cases:**
- **CSV format errors:** If CSV doesn't match expected format, system shows preview with errors highlighted and offers to fix automatically
- **Duplicate students:** If Jennifer tries to import students already in system, system offers to merge or skip duplicates
- **Overwhelm:** If Jennifer has 150 students and feels overwhelmed, system suggests: "Start with your smallest class (Period 3, 22 students) to build momentum"
- **Skips onboarding:** If Jennifer skips tour, can access it anytime from Help menu: "Replay Onboarding Tour"

---

## 6. Functional Requirements

### Must-Have Features (P0 – MVP Blockers)

#### Feature 1: User Authentication & Authorization

**Description:** Secure authentication system supporting email/password and Single Sign-On (SSO) with Google Workspace and Microsoft 365. Role-based access control (RBAC) ensures teachers, principals, and admins have appropriate permissions.

**Acceptance Criteria:**
- [ ] Users can sign up with email and password (min 8 characters, uppercase, lowercase, number)
- [ ] Users can authenticate via Google Workspace SSO (OAuth 2.0)
- [ ] Users can authenticate via Microsoft 365 SSO (OAuth 2.0 / SAML 2.0)
- [ ] System enforces role-based permissions:
  - Teachers can only access their own students and classes
  - Principals can access all students/teachers in their school
  - District admins can access all schools in their district
- [ ] Password reset via email verification flow
- [ ] Session timeout after 30 minutes of inactivity (security requirement)
- [ ] Account lockout after 5 failed login attempts (15-minute cooldown)
- [ ] Secure session management with HTTP-only cookies
- [ ] All authentication endpoints protected against brute-force attacks

**User Stories:**
- As a teacher, I want to sign in with my school Google account so that I don't need to remember another password
- As a principal, I want to be sure teachers can't see each other's students so that student privacy is protected
- As a security-conscious admin, I want accounts to lock after failed login attempts so that unauthorized access is prevented
- As a busy teacher, I want my session to stay active while I'm working so that I don't have to re-login constantly

**Technical Notes:**
- Use Passport.js for authentication strategies
- JWT tokens for API authentication (short-lived, 15-minute expiry)
- Refresh tokens for extended sessions (7-day expiry)
- Passwords hashed with bcrypt (min 10 rounds)

---

#### Feature 2: Student Management

**Description:** Teachers can add, organize, and manage student rosters. Supports manual entry, CSV bulk import, and class organization. Historical data is preserved even when students are archived.

**Acceptance Criteria:**
- [ ] Teachers can manually add students with: First Name, Last Name, Grade Level, Class/Section, Student ID (optional)
- [ ] Teachers can edit student information
- [ ] Teachers can archive students (not delete – preserves historical data)
- [ ] Teachers can organize students into classes (e.g., "Period 3 English", "Homeroom 5B")
- [ ] Teachers can bulk import students via CSV upload:
  - Required columns: First Name, Last Name, Grade
  - Optional columns: Student ID, Class, Email
  - System validates CSV format and shows preview before import
  - System detects and flags duplicate students
- [ ] Teachers can search students by name or student ID (live search)
- [ ] Teachers can filter students by:
  - Class/section
  - Grade level
  - Analysis status (analyzed, not analyzed, flagged)
- [ ] System prevents duplicate student entries (name + DOB or Student ID match)
- [ ] Principals can view all students across all teachers in their school (read-only)

**User Stories:**
- As a teacher, I want to import my roster from a CSV file so that I don't have to type 30+ students manually
- As a teacher, I want to organize students by class period so that I can analyze one group at a time
- As a high school teacher with 150 students, I want powerful search and filtering so that I can quickly find specific students
- As a principal, I want to see all students across all teachers so that I have a complete view of my school

**Technical Notes:**
- CSV parsing library: Papa Parse or csv-parser
- File upload limits: 5MB max, 1000 students per CSV
- Duplicate detection: fuzzy matching on name (Levenshtein distance) + exact match on Student ID
- Soft delete for archived students (preserve data integrity)

---

#### Feature 3: AI-Powered Student Analysis Workflow

**Description:** Core feature enabling teachers to conduct conversational AI-guided student assessments. ChatGPT prompts teachers with structured questions, captures free-form responses, and generates comprehensive analysis reports with actionable recommendations.

**Acceptance Criteria:**
- [ ] Teacher selects student and clicks "Start Analysis"
- [ ] System initiates conversational AI session with ChatGPT-4 API
- [ ] AI asks structured questions covering:
  - Academic strengths and weaknesses (specific subjects/skills)
  - Behavioral observations and social interactions
  - Engagement level and learning preferences
  - Any additional concerns or observations
- [ ] Teacher provides free-form text responses (conversational, not checkboxes)
- [ ] AI asks follow-up questions for clarification or specificity (e.g., "Can you give an example?")
- [ ] Session can be paused and resumed later (auto-save every 2 minutes)
- [ ] Progress indicator shows conversation stage (Academic → Behavioral → Engagement → Complete)
- [ ] Typical session duration: 5-10 minutes (tracked and reported)
- [ ] Upon completion, AI generates structured analysis report containing:
  - **Strengths:** Ranked list of student strengths with evidence citations
  - **Areas for Improvement:** Specific challenges with severity ratings
  - **Learning Style Assessment:** Visual/auditory/kinesthetic, preferences
  - **Recommended Interventions:** Prioritized list (High/Medium/Low priority) with rationale
- [ ] Teacher can review, edit, and approve AI-generated content before saving
- [ ] Teacher can add private notes (visible only to teacher, not principal)
- [ ] Analysis saved with timestamp, version history
- [ ] If ChatGPT API fails, system queues analysis for retry and notifies teacher

**User Stories:**
- As a teacher, I want to answer questions conversationally so that I can share my observations naturally without filling out forms
- As a teacher, I want AI to ask follow-up questions so that my vague responses are refined into actionable insights
- As a teacher, I want to pause mid-analysis if interrupted so that I don't lose my work
- As a teacher, I want to review and edit AI-generated recommendations so that I can correct misinterpretations
- As a teacher, I want private notes so that I can document sensitive information (e.g., suspected learning disability) without sharing with admin

**Technical Notes:**
- OpenAI API integration: GPT-4 model (gpt-4-turbo for cost efficiency)
- Prompt engineering: System prompts optimized for educational assessment domain
- Token usage tracking: Monitor costs per analysis (target: $0.01-0.05 per analysis)
- Rate limiting: Max 50 concurrent analyses to manage API costs
- Fallback: If API unavailable, queue analysis in background job (Redis queue)
- Safety filters: Content moderation to detect inappropriate responses

---

#### Feature 4: Teacher Dashboard

**Description:** Personalized dashboard for teachers showing all students, analysis completion status, quick access to pending work, and class-wide trends.

**Acceptance Criteria:**
- [ ] Dashboard displays all students assigned to teacher (grouped by class/section)
- [ ] Each student shows:
  - Name, grade, class
  - Analysis status: ✅ Analyzed (date), ⚠️ Flagged, ⏳ Pending
  - Last analysis date
  - Quick action buttons: "Analyze", "View History"
- [ ] Summary cards at top:
  - Total students
  - Completion rate (% analyzed)
  - Flagged students count
  - Analyses this week/month
- [ ] Filters:
  - Show only: Analyzed, Not Analyzed, Flagged for Follow-Up
  - Filter by class/section
  - Sort by: Name, Last Analysis Date, Grade
- [ ] Quick access section: "Students Needing Attention" (flagged or overdue for re-analysis)
- [ ] Class-wide trends widget (collapsed by default, expandable):
  - Most common strengths across class
  - Most common intervention needs
  - Chart showing analysis completion over time
- [ ] Search bar for quick student lookup
- [ ] "Analyze Next Student" smart recommendation (suggests students who need baseline or follow-up)

**User Stories:**
- As a teacher, I want to see at a glance which students I haven't analyzed yet so that I can prioritize my work
- As a teacher, I want to quickly access students flagged for follow-up so that I don't forget about struggling students
- As a teacher, I want to see class-wide trends so that I can identify if my whole class needs support in a particular area

**Technical Notes:**
- Dashboard data cached in Redis (30-second TTL) to reduce database load
- Lazy load trends widget (only fetch when expanded)
- Pagination for teachers with >100 students (infinite scroll or page-based)

---

#### Feature 5: Principal Dashboard (Executive View)

**Description:** School-wide dashboard for principals providing aggregated metrics, trend visualizations, teacher activity monitoring, and drill-down capabilities.

**Acceptance Criteria:**
- [ ] Executive dashboard shows school-wide metrics:
  - Total students across all teachers
  - Total analyses completed
  - Analysis completion rate (%)
  - Flagged students count (High/Medium/Low priority)
  - Active teachers this week (% of total teachers)
- [ ] Visual charts:
  - Trend chart: Analysis completion rate over time (last 30/60/90 days)
  - Bar chart: Most common intervention needs school-wide (top 10)
  - Pie chart: Students by analysis status (Analyzed, Pending, Flagged)
  - Grade-level comparison: Completion rates by grade
- [ ] Drill-down capabilities:
  - Click metric to see underlying data (e.g., click "42 Flagged Students" → list of those students)
  - Filter by: Grade level, teacher, date range, class/section
  - Click teacher to see their specific students and activity
  - Click student to see full analysis (audit log tracks principal access)
- [ ] Teacher activity monitoring:
  - List of all teachers with usage stats: Last login, analyses completed, completion rate
  - Identify teachers who haven't used platform recently (auto-flag <7 days)
- [ ] Alert notifications:
  - High-priority flagged students requiring immediate attention
  - Low platform adoption warnings (e.g., <50% completion rate)
- [ ] Export functionality:
  - Export executive summary as PDF or PowerPoint
  - Export detailed data as CSV/Excel
  - Customizable date ranges and filters for exports

**User Stories:**
- As a principal, I want to see school-wide completion rates so that I can monitor platform adoption
- As a principal, I want to identify which teachers aren't using the platform so that I can provide support or encouragement
- As a principal, I want to see the most common intervention needs so that I can allocate resources (e.g., hire a reading specialist)
- As a principal, I want to export reports for district meetings so that I can demonstrate our school's data-driven approach

**Technical Notes:**
- Aggregations pre-computed daily via cron job (stored in materialized view or cache)
- Real-time data for current day, cached data for historical trends
- Chart library: Recharts or Chart.js (React-compatible)
- Export generation: Background job (queued, not synchronous) for large exports

---

#### Feature 6: Analysis History & Progress Tracking

**Description:** View historical analyses for each student, compare analyses over time, and track intervention effectiveness.

**Acceptance Criteria:**
- [ ] Student detail page shows timeline of all analyses (newest first)
- [ ] Each analysis in timeline displays:
  - Date conducted
  - Teacher who conducted it (if multiple teachers analyze same student)
  - Thumbnail summary: Top strengths, top needs, flagged status
  - "View Full Report" and "Compare" buttons
- [ ] "Compare Analyses" feature:
  - Teacher selects 2+ analyses to compare (side-by-side view)
  - System highlights what changed: Improved (green), Stable (yellow), Declined (red)
  - Shows which interventions were implemented and outcomes
- [ ] Progress report generation:
  - "Generate Progress Report" button creates summary of changes over time
  - Includes: Before/after comparison, implemented interventions, outcome assessment
  - Exportable as PDF for parents, administrators, or specialists
- [ ] AI-assisted follow-up analysis:
  - When conducting new analysis, AI references previous analyses
  - Asks contextual questions: "Last time you mentioned X. How has that changed?"
  - Includes "Progress Since Last Analysis" section in new report

**User Stories:**
- As a teacher, I want to compare a student's current analysis to their baseline so that I can see if interventions are working
- As a teacher, I want the AI to remember previous analyses so that I don't have to repeat the same information
- As a principal, I want to see evidence that our intervention programs are effective based on before/after analysis comparisons

**Technical Notes:**
- Version control for analyses (immutable records – edits create new versions)
- Comparison algorithm: Text diffing + semantic analysis to identify changes
- Progress report template: Markdown → PDF conversion (using Puppeteer or similar)

---

#### Feature 7: Search, Filtering, and Sorting

**Description:** Powerful search and filtering capabilities to help users find students, analyses, and trends quickly.

**Acceptance Criteria:**
- [ ] Global search bar on all pages:
  - Search by student name (fuzzy matching)
  - Search by student ID (exact match)
  - Search by class/section name
  - Auto-suggest results as user types (live search)
- [ ] Advanced filters (combinable):
  - Grade level (multi-select)
  - Class/section (multi-select)
  - Analysis status: Analyzed, Not Analyzed, Flagged (High/Medium/Low)
  - Date range: Last analysis date, analysis created date
  - Teacher (principal view only)
- [ ] Saved filter presets:
  - Users can save commonly used filters (e.g., "6th Grade Flagged Students")
  - Quick access to saved filters from dropdown
- [ ] Sort options:
  - Alphabetically (A-Z, Z-A)
  - Last analysis date (newest, oldest)
  - Grade level (ascending, descending)
  - Flagged status (High priority first)
- [ ] Search results show count: "Showing 12 of 150 students"
- [ ] Clear filters button resets all filters to default

**User Stories:**
- As a high school teacher with 150 students, I want to quickly find a specific student by name so that I don't waste time scrolling
- As a principal, I want to filter students by "Flagged + 6th Grade" so that I can focus on highest-need students in a specific grade
- As a teacher, I want to save my "Needs Analysis This Week" filter so that I can access it with one click

**Technical Notes:**
- Search: Debounced input (300ms) + Postgres full-text search or Elasticsearch (if scale requires)
- Filters: URL query parameters to enable shareable filter states
- Performance: Indexed database columns (name, student_id, grade, analysis_date)

---

#### Feature 8: Export & Reporting

**Description:** Generate exportable reports in multiple formats (PDF, CSV, PowerPoint) for various stakeholders.

**Acceptance Criteria:**
- [ ] Student Analysis Report Export (PDF):
  - Professional single-page or multi-page report
  - Includes: Student name, analysis date, strengths, areas for improvement, recommendations
  - Formatted for printing or parent conferences
  - Teacher can customize which sections to include (e.g., omit private notes)
- [ ] Class/Section Report Export (PDF or CSV):
  - Aggregated report for all students in a class
  - Shows completion status, flagged students, common trends
  - Exportable as table (CSV) or narrative summary (PDF)
- [ ] Principal Executive Summary (PowerPoint or PDF):
  - Pre-designed slides with key metrics, charts, and insights
  - Customizable date range and filters
  - Suitable for faculty meetings or district presentations
- [ ] Data Export (CSV/Excel):
  - Raw data export for principals and admins
  - Columns: Student ID, Name, Grade, Class, Last Analysis Date, Flagged Status, Top Needs
  - Principals can select which fields to export
  - Anonymization option (remove student names/IDs for research purposes)
- [ ] Export queue for large reports:
  - Background job processes large exports (>100 students)
  - Email notification when export is ready
  - Download link expires after 7 days

**User Stories:**
- As a teacher, I want to export a student's analysis as a PDF so that I can print it for parent-teacher conferences
- As a principal, I want to export a PowerPoint summary so that I can present our school's data to the district
- As a data-driven principal, I want to export raw data as CSV so that I can perform custom analysis in Excel

**Technical Notes:**
- PDF generation: Puppeteer (headless Chrome) rendering HTML templates
- PowerPoint generation: PptxGenJS library
- CSV generation: Fast-csv or built-in Node.js streams
- Background job queue: Bull (Redis-backed) for async export processing

---

#### Feature 9: Role-Based Access Control (RBAC)

**Description:** Fine-grained permissions system ensuring users only access data appropriate for their role.

**Acceptance Criteria:**
- [ ] Three primary roles:
  - **Teacher:** Can view/edit own students, classes, and analyses; cannot see other teachers' data
  - **Principal:** Can view all students/teachers in their school; cannot edit teacher analyses; can export school data
  - **District Admin:** Can view all schools in district; read-only access; can manage users
- [ ] Permission matrix:
  - Teachers: CRUD own students, CRUD own analyses, Read own classes
  - Principals: Read all students/teachers/analyses in school, Create/export reports, Manage teacher accounts
  - District Admins: Read all schools, Create/export district reports, Manage principals
- [ ] API endpoints enforce role-based authorization (JWT token contains role + scope)
- [ ] Frontend UI adapts based on role (principals see different nav/dashboard than teachers)
- [ ] Audit logging for sensitive actions:
  - Principal viewing individual student analysis (privacy tracking)
  - User role changes
  - Data exports (who, what, when)
- [ ] Special permissions (future):
  - "Shared student" – student can be analyzed by multiple teachers (e.g., special ed + homeroom)
  - "Guest access" – temporary read-only access for specialists or student teachers

**User Stories:**
- As a teacher, I want assurance that other teachers can't see my students so that I feel comfortable documenting sensitive observations
- As a principal, I want to view all teacher data so that I can support school-wide decision-making
- As a district admin, I want to audit who accessed what data so that we can ensure compliance with privacy regulations

**Technical Notes:**
- Authorization middleware checks role + resource ownership on every API request
- JWT claims include: user_id, role, school_id, district_id (scoping)
- Database row-level security (RLS) as additional safeguard (Postgres RLS policies)

---

### Should-Have Features (P1 – Important but Not MVP Blockers)

1. **Email Notifications:**
   - Weekly digest emails for teachers: "You have 5 students needing analysis"
   - Alert emails for flagged students (opt-in for principals/teachers)
   - Password reset and account activation emails (P0 for auth, P1 for enhancements)

2. **Data Visualization Enhancements:**
   - Interactive charts (hover tooltips, click to drill down)
   - Custom date range selectors (calendar picker)
   - Comparative analytics (compare this month vs. last month)

3. **Bulk Operations:**
   - Bulk flag/unflag students
   - Bulk assign students to different classes
   - Batch delete archived students

4. **Mobile Optimization:**
   - Fully responsive design for tablets (iPad, Android tablets)
   - Touch-optimized interface elements
   - Simplified mobile dashboard for quick checks on phones

5. **Intervention Tracking:**
   - Mark which recommendations were implemented
   - Track outcomes for implemented interventions
   - "Intervention library" of common strategies

6. **Collaboration Features:**
   - Share student analysis with other teachers (with permission)
   - Add collaborator teachers to specific students (co-taught classes)
   - Comment threads on analyses (teacher-to-teacher communication)

7. **Advanced Filtering:**
   - Filter by specific intervention needs (e.g., "All students needing reading support")
   - Filter by learning style
   - Filter by date of last analysis (overdue for follow-up)

8. **User Preferences:**
   - Customizable dashboard layout
   - Theme preferences (light/dark mode)
   - Email notification preferences (frequency, types)

---

### Nice-to-Have Features (P2 – Future Enhancements)

1. **Parent Portal:**
   - Parents can view their child's analyses (with teacher permission)
   - Transparency into recommendations and progress tracking

2. **Mobile Native Apps:**
   - iOS and Android apps for on-the-go access
   - Push notifications for alerts

3. **LMS Integrations:**
   - Google Classroom integration (auto-import rosters)
   - Canvas, Schoology, Moodle integrations

4. **SIS Integration:**
   - Automated sync with PowerSchool, Infinite Campus, Skyward
   - Real-time roster updates

5. **Advanced AI Features:**
   - Predictive analytics (early warning system for at-risk students)
   - AI-suggested professional development for teachers based on class needs
   - Natural language queries: "Show me all 6th graders struggling with math"

6. **Custom Branding:**
   - White-labeling for districts
   - School-specific logos and color schemes

7. **Assessment Integration:**
   - Import standardized test scores to correlate with teacher observations
   - Combine quantitative (test data) + qualitative (teacher insights)

8. **Video/Audio Notes:**
   - Teachers record verbal observations instead of typing
   - AI transcribes and analyzes audio

9. **Gamification:**
    - Teacher achievements: "Analyzed all students!", "3-month streak"
    - Leaderboards for schools (highest completion rate)

---

## 7. Non-Functional Requirements

### Performance

**Response Time:**
- **Page Load Time:** <2 seconds for initial page load (p95 – 95th percentile)
- **API Response Time:**
  - Standard queries (student list, dashboard metrics): <500ms (p95)
  - Complex analytics (principal dashboard with aggregations): <1 second (p95)
  - ChatGPT analysis session: <3 seconds per AI response (dependent on OpenAI API)
- **Search Results:** <300ms for student search across 1,000+ students
- **Dashboard Refresh:** <1 second for cached data, <3 seconds for fresh data

**Concurrent Users:**
- **MVP Target:** 100 concurrent users without performance degradation
- **Year 1 Target:** 500 concurrent users
- **Peak Load Handling:** 3x normal traffic during back-to-school periods (August-September) without downtime

**Concurrent Analysis Sessions:**
- **MVP Target:** 50 concurrent AI analysis sessions
- **Year 1 Target:** 200 concurrent AI analysis sessions
- **Rate Limiting:** Max 5 analyses per teacher per hour to prevent abuse and manage API costs

**Data Volume Capacity:**
- **Initial (MVP):** 10,000 students, 100 teachers, 50,000 analyses
- **Year 1:** 100,000 students, 2,000 teachers, 500,000 analyses
- **Database Performance:** Query response time remains <1 second at 10x initial volume

**Optimization Requirements:**
- Frontend bundle size: <300KB gzipped for initial load
- Code splitting: Lazy load analytics charts and non-critical components
- Image optimization: WebP format, responsive image sizes
- CDN usage for static assets (JS, CSS, images)
- Browser caching: 30-day cache for static resources, versioned cache busting
- Database query optimization: Proper indexing on all filter/sort columns, EXPLAIN ANALYZE reviews

### Security

**Authentication:**
- Industry-standard password hashing: bcrypt with minimum 10 rounds (cost factor)
- Secure session management: HTTP-only cookies, SameSite=Strict, Secure flag (HTTPS only)
- SSO integration: OAuth 2.0 for Google Workspace, OAuth 2.0 / SAML 2.0 for Microsoft 365
- Optional MFA: TOTP (Time-based One-Time Password) using Google Authenticator or similar
- Account lockout: 5 failed login attempts → 15-minute cooldown
- Password requirements: Min 8 characters, uppercase, lowercase, number, special character (optional)
- Password expiration: Optional, configurable per district (e.g., 90-day rotation)

**Authorization:**
- Role-based access control (RBAC): Teacher, Principal, District Admin roles
- Principle of least privilege: Users can only access data within their scope (own students, own school, own district)
- API endpoint protection: JWT tokens required for all authenticated endpoints
- JWT token expiry: Access tokens expire after 15 minutes, refresh tokens after 7 days
- CSRF protection: Anti-CSRF tokens for all state-changing operations (POST, PUT, DELETE)
- API rate limiting: Per-user and per-IP rate limits to prevent abuse

**Data Protection:**
- **Encryption at Rest:** AES-256 encryption for all student PII (names, IDs, analysis data) in database
- **Encryption in Transit:** TLS 1.3 minimum for all HTTPS connections
- **PII Handling:**
  - Student names, IDs, analysis data treated as Personally Identifiable Information
  - No storage of Social Security Numbers, addresses, or highly sensitive data
  - Data anonymization for aggregated analytics (principals see anonymized class trends)
- **Secure Secrets Management:**
  - API keys (OpenAI, email service) stored in environment variables or secrets manager (AWS Secrets Manager, GCP Secret Manager)
  - Never commit secrets to version control (enforced by pre-commit hooks and .gitignore)
- **Audit Logging:**
  - Log all data access and modifications: who accessed which student data, when
  - Principal access to individual student analyses logged for privacy compliance
  - Log retention: 1 year minimum for audit trails
- **Data Retention Policy:**
  - Analysis data retained for 7 years (or per school/district policy)
  - Deleted users: Data anonymized (remove PII) but preserve analytics
- **Secure Data Deletion:**
  - Hard delete (not just soft delete/archiving) upon explicit deletion request
  - Comply with "Right to Erasure" (GDPR, CCPA equivalent)

**Compliance:**
- **FERPA (Family Educational Rights and Privacy Act):**
  - Written parental consent required before sharing student data with third parties (not including school officials)
  - Parents have right to access and request corrections to student records
  - Implement data access request workflow for parents
  - Data Processing Agreements (DPAs) with schools clearly define data handling responsibilities
- **COPPA (Children's Online Privacy Protection Act):**
  - No direct data collection from students under 13
  - All data collected via teachers (as "school official" exception)
  - If student-facing features added in future, implement parental consent mechanisms
- **GDPR Considerations (if serving EU schools):**
  - Right to access, rectification, erasure, data portability
  - Privacy by design and by default
  - Data Processing Agreements (DPA) with schools
  - Data residency: EU data stored in EU regions
- **State-Specific Regulations:**
  - California CCPA (Consumer Privacy Act)
  - New York Education Law 2-d (data privacy and security)
  - Compliance monitoring for state-specific requirements

**Vulnerability Management:**
- **Dependency Management:**
  - Automated weekly scans for vulnerable dependencies (Dependabot, Snyk, Renovate)
  - Critical vulnerabilities patched within 48 hours
- **Penetration Testing:** Annual third-party penetration test before production launch and annually thereafter
- **Vulnerability Disclosure:** Responsible disclosure policy published at /security
- **Web Application Firewall (WAF):** Protect against OWASP Top 10 (SQL injection, XSS, CSRF, etc.)
- **Input Validation:**
  - Server-side validation for all user inputs (never trust client)
  - Sanitize inputs to prevent XSS attacks
  - Parameterized queries to prevent SQL injection (ORM handles this)
- **Content Security Policy (CSP):** HTTP headers to prevent XSS and code injection
- **Security Headers:** HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### Scalability

**Expected Growth:**
- **Year 1:** 20 schools, 500 teachers, 15,000 students, 50,000 analyses
- **Year 2:** 100 schools, 2,500 teachers, 75,000 students, 300,000 analyses
- **Year 3:** 300 schools, 7,500 teachers, 225,000 students, 1,000,000 analyses

**Scaling Strategy:**

- **Horizontal Scaling (Application Tier):**
  - Stateless application servers (Next.js frontend, NestJS backend) enable easy horizontal scaling
  - Load balancer distributes traffic across multiple app instances
  - Auto-scaling groups add/remove instances based on CPU/memory utilization

- **Database Scaling:**
  - **Vertical Scaling (Year 1):** Increase PostgreSQL instance size (CPU, RAM, storage)
  - **Read Replicas (Year 2):** Separate read replicas for analytics/reporting queries, reducing load on primary database
  - **Connection Pooling:** PgBouncer or similar to efficiently manage database connections (max connections: 200)
  - **Potential Sharding (Year 3+):** Shard by district or school for massive scale (only if needed)

- **Caching Strategy:**
  - **Redis for Session Storage:** Centralized session store for multi-instance deployments
  - **Application-Level Caching:** Cache frequently accessed data (dashboard metrics, aggregated analytics)
    - TTL: 30 seconds for real-time data, 5 minutes for historical trends, 1 hour for static aggregations
  - **Cache Invalidation:** Invalidate cache on data updates (e.g., new analysis → invalidate student's cache)
  - **CDN for Static Assets:** CloudFront, Cloud CDN, or Cloudflare for global asset delivery

- **Background Job Processing:**
  - **Queue System:** Bull or BullMQ (Redis-backed) for async tasks
  - **Use Cases:**
    - CSV imports (large files processed asynchronously)
    - PDF/PowerPoint report generation
    - Batch email sending (weekly digests)
    - Analytics pre-computation (nightly aggregation jobs)
  - **Worker Scaling:** Scale worker processes independently from web servers

- **API Rate Limiting:**
  - Per-user limits: 100 requests/minute (prevent abuse)
  - Per-IP limits: 500 requests/minute (prevent DDoS)
  - ChatGPT API quota management: School-level quotas (e.g., 1000 analyses/month/school)

**Capacity Planning:**
- **Monitoring:** Track CPU, memory, database connections, API latency, queue depth
- **Alerting:** Alerts at 70% resource utilization to proactively scale
- **Load Testing:** Quarterly load tests simulating 3x peak traffic
- **Quarterly Reviews:** Capacity planning reviews before peak periods (back-to-school, mid-year)

### Reliability

**Uptime Targets:**
- **MVP (Pilot Phase):** 99% uptime (3.65 days downtime/year) – acceptable for pilot
- **Production Year 1:** 99.5% uptime (1.83 days downtime/year)
- **Scale Year 2+:** 99.9% uptime (8.76 hours downtime/year)
- **Planned Maintenance:** During off-hours (evenings 8 PM - 6 AM, weekends)
- **Zero Downtime Deployments:** Rolling deployments for minor releases (no downtime)

**Error Rate Targets:**
- **API Error Rate:** <0.5% (excluding client errors 4xx)
- **Database Transaction Error Rate:** <0.1%
- **ChatGPT API Failure Handling:** Graceful degradation with retry logic (3 retries with exponential backoff)

**Backup Strategy:**

- **Database Backups:**
  - **Full Daily Backups:** Automated daily backups retained for 30 days
  - **Incremental Backups:** Every 6 hours (WAL archiving for Postgres)
  - **Point-in-Time Recovery (PITR):** Restore to any moment within last 7 days
  - **Backup Testing:** Monthly restore drills to verify backup integrity
  - **Off-Site Storage:** Backups stored in different geographic region (disaster recovery)

- **Application State:**
  - **Infrastructure as Code (IaC):** All infrastructure defined in Terraform/CloudFormation (reproducible deployments)
  - **Configuration Backups:** Environment variables and configurations versioned in Git (secrets excluded)

- **User-Uploaded Files:**
  - **Object Storage:** AWS S3, Google Cloud Storage, or Azure Blob with versioning enabled
  - **Cross-Region Replication:** Critical files replicated to secondary region

**Disaster Recovery:**
- **Recovery Time Objective (RTO):** 4 hours (maximum acceptable downtime after disaster)
- **Recovery Point Objective (RPO):** 1 hour (maximum acceptable data loss)
- **Disaster Recovery Plan:** Documented and tested quarterly
- **Multi-Region Deployment (Future):** Active-passive multi-region setup for critical infrastructure
- **Runbooks:** Documented procedures for common failure scenarios:
  - Database failure and failover
  - ChatGPT API outage (queue analysis for later)
  - Application server outage (auto-scaling recovery)
  - Network outage (failover to secondary region)
- **On-Call Rotation:** 24/7 on-call engineer for critical incident response (post-MVP)

**Monitoring & Alerting:**
- **Application Performance Monitoring (APM):** New Relic, Datadog, or Sentry
  - Track: API latency, error rates, database query performance, user flows
- **Uptime Monitoring:** External service (Pingdom, UptimeRobot) pings endpoints every 1 minute
- **Error Tracking:** Sentry or Rollbar for real-time error monitoring and stack traces
- **Real-Time Alerts:** PagerDuty, Opsgenie, or email/SMS alerts for:
  - API error rate >1%
  - Database connection failures
  - Uptime check failures (3 consecutive failures)
  - Disk space >80% full
  - ChatGPT API quota exhaustion
- **Dashboards:** Grafana or cloud provider dashboards for system health, business metrics, user activity

### Accessibility

**WCAG Compliance:**
- **Target:** WCAG 2.1 Level AA compliance (minimum standard for public education tools)
- **Keyboard Navigation:** All interactive elements accessible via keyboard (Tab, Enter, Esc)
- **Screen Reader Support:** Compatible with JAWS (Windows), NVDA (Windows), VoiceOver (Mac/iOS)
- **Focus Indicators:** Visible focus states for all interactive elements (buttons, links, form inputs)
- **Color Contrast:** Minimum 4.5:1 contrast ratio for text, 3:1 for large text (WCAG AA)
- **Alt Text:** All images have descriptive alt text (or marked as decorative with empty alt)
- **Form Labels:** All form inputs have associated labels (visible or aria-label)
- **Error Messages:** Clear, specific error messages (not just "Error" – explain what's wrong and how to fix)
- **Semantic HTML:** Use proper HTML5 elements (<nav>, <main>, <article>, <button> instead of <div onclick>)

**Responsive Design:**
- **Mobile-First Approach:** Design for mobile, enhance for desktop
- **Breakpoints:**
  - Mobile: <640px (smartphones)
  - Tablet: 640px - 1024px (tablets, small laptops)
  - Desktop: 1024px+ (laptops, desktops)
- **Touch Targets:** Minimum 44x44 pixels for touch-friendly buttons (iOS HIG standard)
- **Responsive Images:** Serve appropriately sized images for device (srcset, picture element)

**Assistive Technology Support:**
- ARIA landmarks and labels where semantic HTML insufficient
- Live regions for dynamic content updates (e.g., "Analysis saved" confirmation)
- Skip links to jump to main content (bypass navigation)

### Language & Localization

**Primary Language: Hebrew**

The Growth Engine platform serves Hebrew-speaking educators in Israel. All UI elements, system-generated content, and user-facing materials must be in Hebrew with proper right-to-left (RTL) text direction support.

**UI & Content Requirements:**
- **All interface text in Hebrew:** Buttons, labels, navigation, form fields, error messages, tooltips
- **System-generated content in Hebrew:** Emails (password reset, notifications), PDF reports, dashboard text, AI analysis prompts and outputs
- **Documentation in Hebrew:** Onboarding materials, help documentation, FAQs, tooltips
- **Right-to-left (RTL) layout:** Entire UI mirrors horizontally (navigation on right, back buttons point right, etc.)
- **Hebrew date/time formatting:** Use Hebrew locale (he-IL) for all dates and times (e.g., "30 בדצמבר 2025")
- **Number formatting:** Hebrew number formatting conventions

**Technical Implementation:**
- **i18n Framework:** next-intl or react-i18next with RTL support
- **RTL CSS:** Tailwind CSS with RTL plugin using logical properties (margin-inline-start vs margin-left)
- **Bidirectional Text Handling:** Proper rendering of mixed Hebrew/English content (e.g., student names with English, technical terms)
- **Hebrew Typography:**
  - Web fonts optimized for Hebrew readability (Rubik, Heebo, or Assistant)
  - Support for Hebrew diacritics (nikud) if needed for educational content
  - Appropriate line-height and letter-spacing for Hebrew text
- **Hebrew Collation:** Database sorting according to Hebrew alphabetical order (aleph to tav)
- **Unicode Normalization:** Proper storage and search of Hebrew text with combining characters
- **Text Search:** Full-text search supporting Hebrew morphology and character variants

**Content Strategy:**
- **Translation Files:** All UI strings stored in centralized JSON/YAML files (e.g., `/locales/he/common.json`)
- **English Technical Terms:** Preserve English for universally recognized terms (e.g., "API", "ChatGPT", "PDF") where appropriate
- **Translation Quality:** Professional Hebrew translation (not machine-translated) for clarity and educational appropriateness
- **Consistency:** Maintain consistent terminology across the platform (e.g., always use same Hebrew term for "analysis")

**Accessibility Considerations:**
- RTL screen reader support (test with JAWS, NVDA, VoiceOver in Hebrew mode)
- Keyboard navigation works correctly in RTL layout (Tab order right-to-left, Arrow keys reversed)
- Form validation messages in clear, actionable Hebrew

**Future Enhancement:**
- **English Interface:** Secondary language option for non-Hebrew speakers (administrators, technical support)
- **Additional Languages:** Expand to Arabic, Russian, or other languages based on market demand
- **User Language Preference:** Allow users to select preferred language (future multi-language support)

**Out of Scope for MVP:**
- Multi-language support (Hebrew only for MVP)
- User-selectable language switching
- Automatic language detection based on browser locale

---

## 8. Technical Constraints

### Tech Stack

**Frontend:**
- **Framework:** Next.js 14+ (React 18+)
  - App Router (React Server Components)
  - TypeScript for type safety
- **Styling:** Tailwind CSS with RTL plugin (utility-first CSS framework with right-to-left support)
- **Internationalization:** next-intl or react-i18next (i18n framework with RTL support for Hebrew)
- **UI Components:** shadcn/ui or Radix UI (accessible, unstyled primitives with RTL compatibility)
- **Data Visualization:** Recharts or Chart.js (React-compatible charting library)
- **Forms:** React Hook Form (performant, flexible form management)
- **State Management:** Zustand or React Context (lightweight, modern state management)
- **HTTP Client:** Fetch API or Axios with React Query for caching and optimistic updates
- **Fonts:** Hebrew web fonts (e.g., Rubik, Heebo, Assistant) optimized for readability

**Backend:**
- **Framework:** NestJS 10+ with TypeScript
  - Modular architecture (domain-driven design)
  - Dependency injection for testability
- **API Design:** RESTful APIs (future: GraphQL if needed)
- **Authentication:** Passport.js (authentication middleware for Node.js)
  - Strategies: JWT, Google OAuth, Microsoft OAuth
- **Database ORM:** Prisma or TypeORM (TypeScript-first ORM)
- **Background Jobs:** Bull or BullMQ (Redis-backed job queue)
- **Logging:** Winston (structured logging with JSON output)
- **Validation:** Joi or class-validator (NestJS pipes for input validation)

**Database:**
- **Primary Database:** PostgreSQL 15+
  - Relational data model (users, students, schools, classes)
  - JSONB columns for flexible analysis data (varying structure)
  - Full-text search for student search
  - Extensions: pg_trgm (fuzzy search), PostGIS (future: geographic school mapping)

**Caching & Sessions:**
- **Redis 7+**
  - Session storage (centralized for multi-instance deployments)
  - Application-level caching (dashboard metrics, aggregations)
  - Background job queue (Bull/BullMQ)

**Integrations:**
- **OpenAI API (ChatGPT-4):**
  - Model: gpt-4-turbo (cost-effective, fast)
  - Custom system prompts for educational assessment domain
  - Rate limiting and quota management
- **Email Service:** SendGrid or Amazon SES
  - Transactional emails (password reset, notifications)
  - Template management for consistent branding
- **Object Storage:** AWS S3, Google Cloud Storage, or Azure Blob
  - User-uploaded files (CSV imports)
  - Generated exports (PDFs, CSVs, PowerPoint files)
- **Authentication Providers:**
  - Google Workspace (OAuth 2.0)
  - Microsoft 365 / Azure AD (OAuth 2.0 or SAML 2.0)

### Infrastructure (Cloud Provider TBD – Decision During Architect Phase)

**Hosting Options (Final decision pending):**
- **AWS (Amazon Web Services):**
  - Compute: ECS (Fargate) or EKS (Kubernetes)
  - Database: RDS for PostgreSQL
  - Caching: ElastiCache for Redis
  - Storage: S3
  - CDN: CloudFront
  - Pros: Comprehensive services, mature, strong compliance certifications
  - Cons: Complex, steeper learning curve, potentially higher cost

- **Google Cloud Platform (GCP):**
  - Compute: Cloud Run (serverless containers) or GKE (Kubernetes)
  - Database: Cloud SQL for PostgreSQL
  - Caching: Memorystore for Redis
  - Storage: Google Cloud Storage
  - CDN: Cloud CDN
  - Pros: Simpler than AWS, strong education discounts, excellent Kubernetes support
  - Cons: Smaller ecosystem than AWS

- **Microsoft Azure:**
  - Compute: Azure Container Instances or AKS (Kubernetes)
  - Database: Azure Database for PostgreSQL
  - Caching: Azure Cache for Redis
  - Storage: Azure Blob Storage
  - CDN: Azure CDN
  - Pros: Good for schools using Microsoft 365, integrated Active Directory
  - Cons: Less mature than AWS in some areas

**Recommended:** Google Cloud Platform (GCP) for education focus, simplicity, and cost-effectiveness. Final decision during Architect Phase based on team expertise and detailed cost analysis.

**CI/CD:**
- **Pipeline:** GitHub Actions or GitLab CI
- **Build Process:** Docker multi-stage builds
- **Environments:** Development, Staging, Production
- **Deployment Strategy:** Blue-green or rolling deployments (zero downtime)
- **Automated Testing:** Unit tests, integration tests, E2E tests run in CI pipeline (must pass to deploy)

**Development Tools:**
- **Version Control:** Git (GitHub or GitLab)
- **Code Quality:** ESLint (linting) + Prettier (formatting)
- **Pre-Commit Hooks:** Husky (runs linting, type-checking, tests before commit)
- **Local Development:** Docker Compose (Postgres, Redis, backend, frontend all in containers)
- **Testing Frameworks:**
  - Unit/Integration: Jest
  - E2E: Playwright or Cypress
  - API Testing: Supertest (NestJS testing utilities)

### Browser/Device Support

**Desktop Browsers (Primary):**
- Google Chrome: Last 2 versions
- Mozilla Firefox: Last 2 versions
- Microsoft Edge: Last 2 versions
- Safari (macOS): Last 2 versions

**Mobile Browsers (Secondary – responsive web, not native apps):**
- iOS Safari: Last 2 versions
- Chrome Mobile (Android): Last 2 versions
- Responsive design for tablets: iPad, Android tablets (optimized for 10-13" screens)

**Operating Systems:**
- Windows 10+
- macOS 11+ (Big Sur and later)
- Chrome OS (common in schools – must support!)
- Linux (not primary target but should work)

**Screen Resolutions:**
- **Minimum Supported:** 1280x720 (720p) – small laptops, older devices
- **Optimized For:** 1920x1080 (1080p) – most common desktop, 1440x900 (common MacBook Pro)
- **Responsive Breakpoints:**
  - Mobile: <640px (smartphones – limited support, basic functionality only)
  - Tablet: 640px - 1024px (tablets, small laptops – optimized)
  - Desktop: 1024px+ (laptops, desktops – fully featured)

**Accessibility:**
- See "Non-Functional Requirements > Accessibility" section above

**Network Conditions:**
- **Design for Low Bandwidth:** Many schools have slow/limited internet (rural areas, overcrowded networks)
- **Graceful Degradation:** On slow connections (<1 Mbps), show simplified UI, defer non-critical assets
- **Offline Detection:** Detect offline state and show user-friendly message (not broken page)
- **Progressive Enhancement:** Core functionality works without JavaScript (where feasible), enhance with JS

---

## 9. Design Requirements

### UI/UX Principles

1. **Simplicity First:**
   - Teachers have limited time and varying tech proficiency – interface must be intuitive, not overwhelming
   - Prioritize essential features on main screens; advanced features accessible but not prominent
   - Minimize clicks to complete core tasks (e.g., start analysis in 2 clicks from dashboard)

2. **Speed & Efficiency:**
   - Fast page loads (<2 seconds)
   - Instant feedback for user actions (loading states, progress indicators)
   - Keyboard shortcuts for power users (e.g., "/" to focus search, "A" to analyze next student)

3. **Clear Hierarchy:**
   - Visual hierarchy guides users to most important actions (e.g., "Start Analysis" button is primary CTA)
   - Dashboard prioritizes actionable items (students needing analysis) over passive metrics

4. **Consistent Patterns:**
   - Consistent navigation, button styles, color meanings across entire platform
   - Reusable component library (buttons, cards, modals) for cohesive experience

5. **Trust & Transparency:**
   - AI-generated content clearly labeled as such
   - Teachers can always review, edit, and override AI recommendations
   - No "black box" – show evidence linking recommendations to teacher input

6. **Responsive & Accessible:**
   - Mobile-responsive design (works on tablets, acceptable on phones)
   - WCAG 2.1 AA accessibility (keyboard navigation, screen reader support)

7. **Professional & Approachable:**
   - Visual design balances professionalism (suitable for school environment) with approachability (not intimidating)
   - Education-themed but not childish (avoid elementary school clip art aesthetic)

### Mockups/Wireframes

**Current Status:** Wireframes to be created during Designer Phase

**Required Mockups (Designer Phase Deliverables):**
1. **Teacher Dashboard:** Student list with filters, completion status, quick actions
2. **Student Detail Page:** Analysis history timeline, compare analyses, start new analysis
3. **Analysis Session UI:** Conversational AI interface, progress indicator, save/resume
4. **Analysis Results Page:** Strengths, areas for improvement, recommendations with editing
5. **Principal Dashboard:** Executive metrics, charts, drill-down views
6. **Settings/Profile:** User profile, preferences, notification settings
7. **Mobile Views:** Responsive layouts for tablet and smartphone (key screens only)

**Design Deliverables:**
- High-fidelity mockups in Figma or similar
- Interactive prototypes for core user flows (clickable prototypes for user testing)
- Design system documentation (colors, typography, spacing, components)

### Design System

**To Be Developed:** Design system will be created during Designer Phase

**Design System Components:**

1. **Color Palette:**
   - **Primary Color:** TBD (education-friendly, trustworthy – likely blue or teal)
   - **Secondary Color:** TBD (for accents, CTAs)
   - **Semantic Colors:**
     - Success: Green (completed analyses, improvements)
     - Warning: Yellow/Orange (pending tasks, needs attention)
     - Error: Red (critical issues, declined metrics)
     - Info: Blue (informational messages)
   - **Neutral Grays:** For backgrounds, borders, disabled states
   - **Accessibility:** All color combinations meet WCAG AA contrast ratios

2. **Typography:**
   - **Font Family:** Hebrew web fonts for optimal readability (e.g., Rubik, Heebo, Assistant)
     - Must support Hebrew character set with proper diacritics (nikud) support
     - Fallback fonts for mixed Hebrew/English content
   - **Text Direction:** Right-to-left (RTL) as default
   - **Headings:** Bold, clear hierarchy (H1, H2, H3 with distinct sizes)
   - **Body Text:** 16px minimum (readable without zooming)
   - **Line Height:** 1.5 for body text (comfortable reading in Hebrew)

3. **Spacing:**
   - **Spacing Scale:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
   - **Consistent Margins/Padding:** Use spacing scale for all layouts

4. **Components:**
   - **Buttons:** Primary, Secondary, Tertiary, Danger (with hover, active, disabled states)
   - **Forms:** Text inputs, dropdowns, checkboxes, radio buttons (with validation states)
   - **Cards:** Student cards, analysis summary cards, metric cards
   - **Modals:** Confirmation dialogs, information modals
   - **Navigation:** Top nav bar, sidebar (principal view), breadcrumbs
   - **Data Visualization:** Chart styles (bar, line, pie), table styles
   - **Alerts/Notifications:** Toast notifications, inline alerts, banner alerts

5. **Icons:**
   - **Icon Library:** Heroicons, Feather Icons, or similar (consistent style)
   - **Usage:** Icons paired with text labels (not icon-only buttons, for accessibility)

6. **Responsive Grid:**
   - **12-Column Grid:** Standard responsive grid system with RTL support (CSS Grid or Tailwind)
   - **RTL Layout:** Logical properties for margin/padding (e.g., margin-inline-start instead of margin-left)
   - **Breakpoints:** Mobile (<640px), Tablet (640-1024px), Desktop (1024px+)
   - **Mirroring:** UI elements mirror horizontally in RTL (navigation on right, back buttons point right)

**Component Library:** shadcn/ui or Radix UI (unstyled primitives customized to design system)

---

## 10. Dependencies & Risks

### External Dependencies

| Dependency | Type | Status | Risk Level | Mitigation |
|------------|------|--------|------------|-----------|
| **OpenAI API (ChatGPT-4)** | Third-Party Service | Production-ready | **High** | Critical dependency; implement retry logic, queue fallback, monitor quota, budget alerts, consider alternative AI providers (Anthropic Claude) as backup |
| **Google Workspace (SSO)** | Authentication Provider | Production-ready | **Medium** | Primary SSO for K-12; also support Microsoft 365 as alternative; email/password as fallback |
| **Microsoft 365 / Azure AD (SSO)** | Authentication Provider | Production-ready | **Medium** | Secondary SSO option; also support Google as primary; email/password fallback |
| **PostgreSQL (Managed)** | Database | Production-ready | **Low** | Use managed service (RDS, Cloud SQL) with automated backups and failover; well-established technology |
| **Redis (Managed)** | Caching & Queue | Production-ready | **Low** | Use managed service (ElastiCache, Memorystore); graceful degradation if cache unavailable (slower but functional) |
| **SendGrid or Amazon SES** | Email Delivery | Production-ready | **Low** | Transactional email; have backup provider configured; emails queued for retry if service unavailable |
| **AWS S3 / GCS / Azure Blob** | Object Storage | Production-ready | **Low** | Highly reliable; cross-region replication for critical files |
| **Cloud Provider (AWS/GCP/Azure)** | Infrastructure | Production-ready | **Medium** | Vendor lock-in risk; use abstraction layers (Terraform, Docker) for portability; multi-cloud not realistic but avoid deep vendor-specific features |
| **School Internet Infrastructure** | Network | Varies by School | **Medium** | Some schools have limited bandwidth or strict firewalls; design for low bandwidth, test in real school environments during pilot |
| **Modern Web Browsers** | Client Platform | Production-ready | **Low** | Target last 2 versions of major browsers; progressive enhancement for older browsers |

### Risks & Mitigation

#### Risk 1: OpenAI API Dependency and Cost Overruns

**Impact:** Critical
**Probability:** Medium
**Description:** Growth Engine's core value proposition depends on ChatGPT API. If OpenAI experiences outages, rate limits, or pricing changes, product is severely impacted. Costs could spiral if usage exceeds projections.

**Mitigation Strategies:**
- **Quota Management:** Implement school-level and teacher-level quotas (e.g., 1000 analyses/month/school)
- **Cost Monitoring:** Real-time cost tracking dashboards with alerts at 80% of monthly budget
- **Rate Limiting:** Max 5 analyses/hour/teacher, max 50 concurrent sessions platform-wide
- **Fallback Queue:** If API unavailable, queue analysis requests in Redis; process when API recovers
- **Prompt Optimization:** Iteratively optimize prompts to minimize token usage (fewer tokens = lower cost)
- **Caching:** Cache common AI responses where appropriate (not student-specific but framework responses)
- **Alternative Providers:** Evaluate Anthropic Claude, Google Gemini, or Azure OpenAI as backup providers
- **Pricing Model:** Build API costs into subscription pricing with 50% margin for buffer
- **Contract Negotiation:** Negotiate enterprise pricing with OpenAI once we reach scale (Year 1+)

**Contingency Plan:** If OpenAI becomes unavailable or unaffordable, pivot to alternative AI provider (requires re-prompting but core architecture remains).

---

#### Risk 2: FERPA/COPPA Compliance Violation

**Impact:** Critical (legal liability, loss of customer trust, business shutdown)
**Probability:** Low (with proper precautions)
**Description:** Mishandling student data could violate FERPA (federal law protecting student records) or COPPA (protecting children under 13), resulting in lawsuits, fines, customer loss, and reputational damage.

**Mitigation Strategies:**
- **Legal Counsel:** Engage education law attorney to review product, privacy policy, DPA before launch
- **Privacy Impact Assessment (PIA):** Conduct formal PIA with checklist for FERPA, COPPA compliance
- **Data Protection by Design:** Build privacy into architecture from day one (encryption, access controls, audit logs)
- **Security Audits:** Annual third-party security audit and penetration test
- **Staff Training:** All team members complete FERPA training (understanding legal obligations)
- **Data Processing Agreements (DPAs):** Signed DPAs with schools clearly defining data handling, retention, deletion
- **Third-Party Vendor Management:** Vet all vendors (OpenAI, email service, hosting) for FERPA compliance; signed DPAs
- **Incident Response Plan:** Documented plan for data breaches (notification procedures, remediation steps)
- **Privacy Policy & Terms:** Attorney-reviewed, clear policies explaining data usage, rights, retention
- **Transparent Communication:** Proactively communicate privacy protections to schools and parents

**Contingency Plan:** If compliance issue discovered, immediately remediate, notify affected schools, engage legal counsel, implement corrective action plan.

---

#### Risk 3: Low Teacher Adoption (Product-Market Fit Risk)

**Impact:** High (product fails without active users)
**Probability:** Medium
**Description:** Teachers may resist using Growth Engine due to change fatigue, perceived complexity, lack of trust in AI, or insufficient value demonstration. If <50% of pilot teachers actively use platform, product-market fit is questionable.

**Mitigation Strategies:**
- **Extremely Simple Onboarding:** <30 minutes from signup to first analysis completed; interactive tour with hand-holding
- **Immediate Value Demonstration:** Show time savings and actionable insights in first analysis (wow moment)
- **Minimal Disruption:** Integrate into existing workflow (SSO with school accounts, CSV import from SIS)
- **Teacher Champions:** Identify and empower 1-2 enthusiastic teachers per pilot school to advocate for platform
- **Excellent Support:** White-glove support during pilot (daily check-ins first week, rapid bug fixes)
- **Rapid Feedback Loop:** Collect feedback weekly, prioritize issues, ship fixes within 1-2 weeks
- **Clear ROI Communication:** Quantify time savings (hours/week) and highlight student outcome improvements
- **Avoid Feature Bloat:** Launch with minimal, focused MVP; add features based on user requests (not assumptions)
- **Admin Buy-In:** Secure principal/admin support before rollout (they can encourage/require usage)
- **Professional Development:** Optional PD session for teachers (best practices, use cases beyond baseline analysis)

**Contingency Plan:** If adoption <50% after Month 2, conduct user interviews to identify barriers, pivot UX or value proposition, or consider product direction change.

---

#### Risk 4: AI-Generated Analysis Quality Issues

**Impact:** High (inaccurate/biased recommendations damage credibility)
**Probability:** Medium
**Description:** ChatGPT may generate inappropriate, inaccurate, biased, or nonsensical recommendations. Teachers may lose trust if AI outputs are low-quality or offensive.

**Mitigation Strategies:**
- **Extensive Prompt Engineering:** Iterative testing and refinement of system prompts (education domain experts involved)
- **Human-in-the-Loop:** Teachers review and approve all analyses before saving (AI is assistant, not decision-maker)
- **Bias Detection & Mitigation:** Prompts explicitly instruct AI to avoid stereotypes, biases (e.g., gender, race, socioeconomic)
- **Hallucination Detection:** Compare AI output to teacher input; flag if AI invents facts not mentioned
- **Safety Filters:** OpenAI content moderation API to detect inappropriate content; flag for review
- **Continuous Monitoring:** Track flagged/rejected AI outputs; identify patterns indicating systemic issues
- **Feedback Mechanism:** "Report Issue" button on every analysis; teachers can flag problematic outputs
- **Iterative Improvement:** Analyze flagged outputs, refine prompts, retrain approach based on real-world issues
- **Transparency:** Clearly label AI-generated content; explain AI limitations in onboarding
- **Fallback Manual Mode:** If AI fails or teacher distrusts output, allow manual note entry (non-AI mode)

**Contingency Plan:** If AI quality issues are severe (>10% of analyses flagged), pause AI feature, implement manual workflow temporarily, fix prompts, relaunch with improved quality.

---

#### Risk 5: Database Performance Degradation at Scale

**Impact:** Medium (poor UX, increased costs, potential downtime)
**Probability:** Medium
**Description:** As student data grows to 100k+ students and 500k+ analyses, database queries (especially analytics/aggregations) may slow significantly, degrading user experience and increasing infrastructure costs.

**Mitigation Strategies:**
- **Proper Indexing from Day One:** Index all columns used in filters, sorts, joins (student_id, grade, analysis_date, teacher_id)
- **Query Optimization:** EXPLAIN ANALYZE all complex queries; optimize N+1 queries, unnecessary joins
- **Caching Layer:** Redis caching for dashboard aggregations (30-second to 5-minute TTL)
- **Read Replicas:** Separate read replica for analytics queries (Year 1), reducing load on primary database
- **Connection Pooling:** PgBouncer to manage database connections efficiently (max 200 connections)
- **Pagination:** All large result sets paginated (20-50 items per page, infinite scroll or page-based)
- **Materialized Views:** Pre-compute expensive aggregations (e.g., school-wide trends) in materialized views, refresh nightly
- **Query Timeouts:** Enforce 5-second timeout on queries; show user-friendly error if timeout exceeded
- **Monitoring:** Continuous monitoring of slow query log, database CPU/memory, connection count
- **Load Testing:** Quarterly load tests at 10x current scale; identify bottlenecks before users hit them

**Contingency Plan:** If database performance becomes critical issue, implement emergency caching, add read replicas, or vertically scale database instance (can be done in hours with managed services).

---

#### Risk 6: Scope Creep and Feature Bloat

**Impact:** Medium (delayed MVP, over-engineered product, wasted resources)
**Probability:** High (very common in software projects)
**Description:** Stakeholders request additional features, delaying MVP launch and increasing complexity beyond what users actually need. "Wouldn't it be nice if…" syndrome.

**Mitigation Strategies:**
- **Clear PRD with "Non-Goals":** This document explicitly lists out-of-scope features (see Section 3)
- **Empowered Product Owner:** Product owner can say no to feature requests without escalation
- **Ruthless Prioritization:** MoSCoW method (Must-Have, Should-Have, Could-Have, Won't-Have) rigorously applied
- **Fixed MVP Timeline:** Time-boxed MVP (Months 1-5); feature freeze 2 weeks before pilot launch
- **Post-MVP Roadmap:** Maintain backlog for deferred features; show stakeholders their ideas are captured for future
- **Regular Scope Reviews:** Weekly product meetings to review scope, cut features if timeline at risk
- **User Validation:** Only build features validated by user research (not internal assumptions)
- **Prototype Before Build:** Low-fi wireframes or prototypes for new features; validate before engineering
- **Engineering Estimates:** Require time estimates for all feature requests; visualize impact on timeline

**Contingency Plan:** If scope creep threatens MVP timeline, conduct emergency scope review, cut non-essential features, focus on P0 features only.

---

#### Risk 7: School Budget Constraints and Sales Cycle Length

**Impact:** Medium (slower revenue growth, pilot-to-paid conversion risk)
**Probability:** Medium
**Description:** Schools have limited EdTech budgets and lengthy procurement processes (6-12 months). Even if product is excellent, sales cycle may be long, delaying revenue.

**Mitigation Strategies:**
- **Competitive Pricing:** Price competitively (<$10/teacher/month ideal) to fit school budgets
- **Clear ROI Demonstration:** Quantify teacher time savings, student outcome improvements (data from pilot)
- **Flexible Pricing:** Offer school-level pricing (flat fee per school) vs. per-teacher pricing (accommodate different budgets)
- **Pilot Program:** Free or heavily discounted pilots to prove value before purchase commitment
- **Decision-Maker Targeting:** Engage principals and district admins early (they control budgets)
- **Grant Funding Support:** Help schools identify grant opportunities (e.g., Title I funds, state EdTech grants)
- **Budget Cycle Alignment:** Time sales efforts for school budget planning cycles (typically January-April for next fiscal year)
- **Annual Contracts:** 12-month contracts aligned with school year (August-July) for predictable renewal cycles
- **Case Studies & Testimonials:** Develop compelling case studies from pilot schools (social proof for new prospects)

**Contingency Plan:** If sales cycle longer than expected, extend runway with additional fundraising or reduce burn rate; focus on demonstrable ROI to accelerate sales.

---

#### Risk 8: Team Capacity and Expertise Gaps

**Impact:** Medium (delayed timelines, technical debt, quality issues)
**Probability:** Medium
**Description:** Project requires expertise in multiple domains (Next.js, NestJS, AI, education, security). If team lacks expertise or bandwidth, quality/timeline suffers.

**Mitigation Strategies:**
- **Skill Assessment:** Audit team skills early; identify gaps (e.g., AI prompt engineering, PostgreSQL optimization)
- **Upfront Training:** Invest in training for critical skills (NestJS course, PostgreSQL performance workshop)
- **Specialist Hiring:** If gaps can't be filled via training, hire specialists (e.g., DevOps engineer, security consultant)
- **Multi-Agent R&D OS:** Use role-based development workflow to ensure domain expertise applied to each phase
- **External Consultants:** Engage consultants for specialized tasks (e.g., FERPA compliance legal review, AI prompt optimization)
- **Pair Programming:** Pair junior developers with seniors for knowledge transfer
- **Documentation:** Invest in comprehensive documentation (onboarding, architecture, runbooks) to reduce dependency on individuals
- **Realistic Timelines:** Buffer timelines by 20-30% to account for learning curves and unknowns

**Contingency Plan:** If team capacity is insufficient, reduce MVP scope, extend timeline, or bring in contractors/agencies to fill gaps.

---

### Assumptions

1. **Schools have basic IT infrastructure:** Internet connectivity, student information systems, teacher devices (laptops/tablets)
2. **Teachers are willing to spend 5-10 minutes per student:** If perceived as valuable, teachers will make time
3. **OpenAI API remains stable and affordable:** Pricing and availability don't change drastically in next 12 months
4. **SSO with Google/Microsoft is standard:** Most K-12 schools use Google Workspace or Microsoft 365 for email/authentication
5. **Principals have authority to adopt tools:** Principals can champion platform adoption without lengthy district approval (for pilot)
6. **Student data privacy is top concern:** Schools will scrutinize data handling; FERPA compliance is non-negotiable
7. **Teachers trust AI as assistant (not replacement):** Teachers comfortable with AI-augmented workflow if they retain control
8. **Schools operate on academic year cycle:** September-June academic year (U.S. schools); plan launches accordingly
9. **Pilot schools provide candid feedback:** Pilot teachers/principals will honestly share issues and feature requests
10. **Browser/device compatibility:** Teachers use modern browsers (Chrome, Firefox, Edge, Safari) on laptops or tablets (not ancient IE8 on Windows XP)

---

## 11. Open Questions

**To Be Resolved Before MVP Development:**

- [ ] **Q1: Cloud Provider Selection** – AWS, Google Cloud Platform, or Microsoft Azure? Recommendation: GCP for education focus and simplicity. **Decision Point:** Architect Phase

- [ ] **Q2: ORM Choice** – Prisma or TypeORM for database ORM? Recommendation: Prisma for developer experience. **Decision Point:** Architect Phase

- [ ] **Q3: Authentication Strategy** – Self-managed auth (Passport.js) or Auth-as-a-Service (Auth0, Clerk)? Recommendation: Self-managed for MVP to control costs. **Decision Point:** Architect Phase

- [ ] **Q4: Email Service Provider** – SendGrid, Amazon SES, Mailgun, or Postmark? Recommendation: SendGrid for ease of use. **Decision Point:** Backend Phase

- [ ] **Q5: State Management (Frontend)** – Zustand, Redux Toolkit, React Context, or Jotai? Recommendation: Zustand for simplicity. **Decision Point:** Frontend Phase

- [ ] **Q6: Monitoring & APM Tools** – Datadog, New Relic, Sentry, or AWS X-Ray? Recommendation: Sentry for error tracking + Datadog for APM (if budget allows). **Decision Point:** DevOps/Architect Phase

- [ ] **Q7: Pricing Model** – Per-teacher subscription, per-school flat fee, or tiered pricing? Recommendation: Per-teacher ($8-12/month) with school-level discounts. **Decision Point:** Product/Business Phase (post-MVP, informed by pilot feedback)

- [ ] **Q8: ChatGPT Prompt Structure** – Single comprehensive prompt vs. multi-turn conversation with separate prompts per section? Recommendation: Test both in early prototyping. **Decision Point:** Backend/AI Integration Phase

- [ ] **Q9: Pilot School Selection Criteria** – Which schools to target for pilot (geography, size, demographics, tech-savviness)? Recommendation: 1 urban, 1 suburban, 1 rural school for diversity. **Decision Point:** Product/Sales Phase

- [ ] **Q10: Data Retention Policy** – How long to retain student analysis data (7 years per FERPA recommendation, shorter per school request, or indefinite)? Recommendation: Default 7 years, configurable per school. **Decision Point:** Legal/Compliance Review (pre-launch)

**To Be Resolved During MVP Development:**

- [ ] **Q11: CSV Import Format** – What columns are required, optional, and how to handle edge cases (missing data, special characters)? **Decision Point:** Backend Phase

- [ ] **Q12: Analysis Re-Prompting Frequency** – How often should teachers re-analyze students? System recommendation or user discretion? Recommendation: System suggests quarterly re-analysis. **Decision Point:** Product Phase

- [ ] **Q13: Principal Access to Private Teacher Notes** – Should principals see private notes or only AI-generated analysis? Recommendation: Private notes visible only to teacher. **Decision Point:** Product/Legal Phase

- [ ] **Q14: Export Template Customization** – Should schools customize export templates (logos, headers) or use standard template? Recommendation: Standard for MVP, custom in Phase 2. **Decision Point:** Designer Phase

- [ ] **Q15: Multi-Teacher Access to Same Student** – How to handle shared students (e.g., special ed teacher + homeroom teacher)? Recommendation: Allow multi-teacher assignment with shared view. **Decision Point:** Backend/Product Phase

---

## 12. Approval & Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| **Product Owner** | Educational Technology Director | TBD | ⏳ Pending |
| **Tech Lead** | Senior Full-Stack Engineer | TBD | ⏳ Pending |
| **Architect** | Solutions Architect | TBD | ⏳ Pending |
| **Legal Counsel** | Education Law Attorney (FERPA Review) | TBD | ⏳ Pending |
| **Stakeholder (School Principal)** | Pilot School Representative | TBD | ⏳ Pending |

**Approval Process:**
1. Product team reviews PRD (internal review)
2. Tech lead and architect review for technical feasibility
3. Legal counsel reviews for FERPA/COPPA compliance
4. Pilot school representative reviews for user needs alignment
5. Final sign-off by Product Owner

**Next Steps After Approval:**
- [ ] Architect Phase: Populate ARCHITECTURE.md with system design
- [ ] Designer Phase: Create wireframes and design system
- [ ] Product Phase: Generate tickets from PRD for all features
- [ ] Epic Tracking: Update /tickets/EPICS.md with all epics

---

## Appendix

### Related Documents

- **Architecture:** `/docs/ARCHITECTURE.md` (to be populated in Architect Phase)
- **Context Files:**
  - `/context/client.md` – Business background and stakeholder info
  - `/context/requirements.md` – Detailed functional and non-functional requirements
  - `/context/discovery.md` – User research, competitive analysis, technical discovery
  - `/context/decisions.md` – Architectural Decision Records (ADRs)
- **Tickets:** `/tickets/` – Backlog and epic tracking (to be generated from this PRD)
- **Agent Definitions:** `/.claude/agents/` – Multi-agent R&D OS agent role definitions

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| **1.0** | December 30, 2025 | Product Agent (Claude AI) | Initial comprehensive PRD created from project context, requirements, discovery notes, and decisions. Populated all sections with production-ready content. |

### Glossary

- **FERPA:** Family Educational Rights and Privacy Act (federal law protecting student education records)
- **COPPA:** Children's Online Privacy Protection Act (federal law protecting children under 13 online)
- **SSO:** Single Sign-On (authentication method using existing credentials, e.g., Google, Microsoft)
- **RBAC:** Role-Based Access Control (permissions system based on user roles)
- **API:** Application Programming Interface (interface for software-to-software communication)
- **JWT:** JSON Web Token (secure token format for authentication)
- **ORM:** Object-Relational Mapping (library translating between database and code objects)
- **PII:** Personally Identifiable Information (data that can identify an individual)
- **WCAG:** Web Content Accessibility Guidelines (international web accessibility standards)
- **MFA:** Multi-Factor Authentication (security requiring multiple verification methods)
- **CDN:** Content Delivery Network (distributed network for fast asset delivery)
- **APM:** Application Performance Monitoring (tools tracking application performance and errors)
- **RTO:** Recovery Time Objective (maximum acceptable downtime after disaster)
- **RPO:** Recovery Point Objective (maximum acceptable data loss)
- **MVP:** Minimum Viable Product (simplest version validating product concept)
- **NPS:** Net Promoter Score (customer satisfaction metric)
- **ARR:** Annual Recurring Revenue (predictable yearly revenue from subscriptions)

### Contact Information

**Product Inquiries:**
Email: product@growth-engine.app (TBD)

**Technical Support (Post-Launch):**
Email: support@growth-engine.app (TBD)

**Security/Privacy Concerns:**
Email: security@growth-engine.app (TBD)

---

**End of Product Requirements Document**

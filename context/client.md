# Client Background

## Project Overview

- **Project Name:** growth-engine
- **Domain:** education
- **Primary Users:** teachers, principles

## Project Summary

We have a chagpt prompt that helps teachers to find out the strength and weakmesses points of wach student. the prompt receives a student name than ask questions, the responses are free style. thhen the chatpgt analyze the response and return a output with full anlysis and recommenstaion for the student. we need a system that will hold all student and will give option to analyze each one. the analysis will use the above mmetioned prompt

## Business Context

Growth Engine is an educational technology platform designed to revolutionize personalized learning assessment for K-12 and higher education institutions. The platform addresses a critical gap in modern education: the ability to efficiently assess individual student strengths and weaknesses at scale while maintaining the depth of personalized evaluation.

**Market Position:**
The education technology market is rapidly growing, with increasing demand for AI-powered assessment tools that can provide actionable insights. Growth Engine positions itself as a teacher-empowerment tool rather than a teacher replacement, leveraging AI to augment educators' capabilities in understanding their students.

**Strategic Goals:**

- Provide teachers with actionable, data-driven insights about each student's learning profile
- Enable school administrators to identify trends and patterns across classrooms and grade levels
- Reduce the time burden on teachers for individual student assessment
- Create a scalable platform that can grow from single classrooms to district-wide deployments
- Build a foundation for data-driven personalized learning interventions

**Target Market:**

- Primary: K-12 schools (public and private) with class sizes of 15-30 students
- Secondary: Educational consultants and tutoring centers
- Future: Higher education institutions and corporate training programs

## Key Stakeholders

- **Product Owner:** Educational Technology Director / School District Technology Lead
- **Technical Lead:** Senior Full-Stack Engineer with education domain experience
- **End Users:**
  - **Primary:** Classroom teachers (daily active users)
  - **Secondary:** School principals and administrators (weekly reports and oversight)
  - **Tertiary:** District administrators (monthly/quarterly strategic insights)

**External Stakeholders:**

- Students (subjects of analysis, though not direct users)
- Parents (potential future stakeholders for transparency)
- School board members (budget approval and oversight)

## Important Constraints

**Hard Constraints:**

- Must comply with FERPA (Family Educational Rights and Privacy Act) for student data protection
- Must comply with COPPA (Children's Online Privacy Protection Act) if serving students under 13
- Student data must be stored securely and never shared with third parties
- AI analysis must be transparent and explainable to educators
- System must work in schools with limited internet bandwidth
- Must support single sign-on (SSO) integration with common school identity providers

**Soft Constraints:**

- Teachers have limited time for training (max 30 minutes onboarding)
- Schools often have tight budgets - solution must demonstrate clear ROI
- Some educators may be resistant to AI-assisted tools - UX must build trust
- School IT departments may have limited resources for deployment support

## Success Criteria

**MVP Success (First 3 Months):**

- Successfully onboard 3-5 pilot schools with 50-100 total teachers
- Teachers complete analyses for at least 80% of their students within first semester
- Average teacher time savings of 2+ hours per week on assessment activities
- 70%+ teacher satisfaction score (would recommend to colleagues)
- System uptime of 99%+ during school hours
- Zero data security incidents or breaches

**Product-Market Fit (6-12 Months):**

- Expand to 20+ schools with 500+ active teachers
- 85%+ teacher retention rate (continue using after pilot period)
- Demonstrable improvement in targeted intervention effectiveness (measured by follow-up assessments)
- School renewal rate of 80%+ for annual contracts
- Net Promoter Score (NPS) of 40+
- Principal/administrator adoption rate of 90%+ at schools where teachers use the platform

**Scale Success (12-24 Months):**

- 100+ schools across multiple districts
- 2000+ active teachers analyzing 50,000+ students
- Platform becomes part of regular assessment workflow (3+ analyses per student per year)
- Revenue sustainability with positive unit economics
- District-wide contracts representing 25%+ of customer base
- Feature usage expansion beyond core analysis (trend tracking, intervention planning)

## Timeline & Milestones

**Phase 1: Foundation (Months 1-2)**

- **Kickoff:** Week 1 - Team formation, requirements finalization, architecture design
- **Sprint 1-2:** Core platform setup (auth, database, basic UI framework)
- **Sprint 3-4:** Teacher flow MVP (student selection, analysis initiation)
- **Deliverable:** Working prototype for internal testing

**Phase 2: MVP Development (Months 3-4)**

- **Sprint 5-6:** ChatGPT integration, analysis workflow, results display
- **Sprint 7-8:** Principal dashboard (basic class and student overview)
- **Sprint 9:** Security hardening, FERPA compliance review
- **Deliverable:** MVP ready for pilot school deployment

**Phase 3: Pilot Launch (Month 5)**

- **MVP Launch:** Deploy to 3 pilot schools with training sessions
- **Week 1-2:** Intensive user support and bug fixing
- **Week 3-4:** Feedback collection and prioritization
- **Deliverable:** Validated product with real teacher and principal users

**Phase 4: Iteration & Scale Prep (Months 6-7)**

- **Sprint 10-12:** Feature refinement based on pilot feedback
- **Sprint 13-14:** Trends dashboard, data export capabilities
- **Sprint 15:** Performance optimization and infrastructure scaling
- **Deliverable:** Production-ready platform for broader rollout

**Phase 5: Scale (Month 8+)**

- **Broader Launch:** Expand to 10-20 additional schools
- **Continuous Improvement:** Bi-weekly releases with enhancements
- **Success Metrics:** Track adoption, retention, and impact metrics
- **Deliverable:** Sustainable, growing product with proven impact

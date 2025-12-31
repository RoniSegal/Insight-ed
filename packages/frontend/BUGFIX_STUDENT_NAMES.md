# Student Names Bug Fix - Data Model Alignment

## Problem
Student names were showing as "undefined undefined" in the UI due to a data model mismatch between frontend and backend.

## Root Cause
- **Backend API** uses: `{ name, grade, class }` (single full name field)
- **Frontend & Shared Types** were using: `{ firstName, lastName, gradeLevel, studentId }` (split name fields)

This mismatch caused the frontend to look for `student.firstName` and `student.lastName` which didn't exist in the API response.

## Files Changed

### 1. `/packages/shared/src/types/index.ts`
**Before:**
```typescript
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  gradeLevel: string;
  schoolId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**After:**
```typescript
export interface Student {
  id: string;
  name: string;
  grade: string;
  class?: string;
  createdAt: string;
}
```

### 2. `/packages/frontend/src/app/students/page.tsx`

#### Search Filter (lines 48-54)
**Before:**
```typescript
student.firstName.toLowerCase().includes(query) ||
student.lastName.toLowerCase().includes(query) ||
student.gradeLevel.toLowerCase().includes(query) ||
(student.studentId && student.studentId.toLowerCase().includes(query))
```

**After:**
```typescript
student.name.toLowerCase().includes(query) ||
student.grade.toLowerCase().includes(query) ||
(student.class && student.class.toLowerCase().includes(query))
```

#### StudentCard Component (line 309-323)
**Before:**
```typescript
const fullName = `${student.firstName} ${student.lastName}`;
// ...
<h3>{fullName}</h3>
<p>כיתה: {student.gradeLevel}</p>
{student.studentId && <p>מזהה: {student.studentId}</p>}
```

**After:**
```typescript
<h3>{student.name}</h3>
<p>כיתה: {student.grade}</p>
{student.class && <p>כיתה: {student.class}</p>}
```

#### AddStudentForm Component (lines 389-455)
**Before:**
```typescript
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [gradeLevel, setGradeLevel] = useState('');
const [studentId, setStudentId] = useState('');

await ApiClient.post('/students', {
  firstName: firstName.trim(),
  lastName: lastName.trim(),
  gradeLevel: gradeLevel.trim(),
  studentId: studentId.trim() || undefined,
});

// 4 separate input fields
```

**After:**
```typescript
const [name, setName] = useState('');
const [grade, setGrade] = useState('');
const [className, setClassName] = useState('');

await ApiClient.post('/students', {
  name: name.trim(),
  grade: grade.trim(),
  class: className.trim() || undefined,
});

// 3 input fields: full name, grade, class (optional)
```

### 3. `/packages/frontend/src/app/students/[id]/chat/page.tsx`

**Before:**
```typescript
const student = await ApiClient.get(`/students/${studentId}`);
const fullName = `${student.firstName} ${student.lastName}`;
setStudentName(fullName);
```

**After:**
```typescript
const student = await ApiClient.get(`/students/${studentId}`);
setStudentName(student.name);
```

## Backend API Data Structure (Unchanged)

The backend was already using the correct structure:

```typescript
interface Student {
  id: string;
  name: string;        // Full name (e.g., "שרה כהן")
  grade: string;       // Grade level (e.g., "כיתה ג׳")
  class?: string;      // Teacher/class (e.g., "גב׳ לוי")
  createdAt: string;   // ISO timestamp
}
```

## Test Results

All API tests pass with Hebrew names displaying correctly:
- GET /api/students - Returns students with `name`, `grade`, `class` fields
- POST /api/students - Creates students with single name field
- Search and filtering work with Hebrew text
- Student cards display names correctly in UI

## Impact

This fix resolves:
- Student names showing as "undefined undefined"
- Search not working properly
- Add student form not matching backend expectations
- Type mismatches between frontend and backend

## Verification

Run the students API test:
```bash
cd packages/frontend
bash scripts/test-students-api.sh
```

Expected: All tests pass, students show Hebrew names like "שרה כהן", "מיכאל דוד", etc.

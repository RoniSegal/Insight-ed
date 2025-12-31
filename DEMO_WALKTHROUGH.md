# Demo Walkthrough - Growth Engine MVP
**Version:** 1.0
**Date:** 2025-12-31
**Purpose:** Technical guide for setting up and running the demo

---

## Table of Contents
1. [Pre-Demo Setup](#pre-demo-setup)
2. [Demo Environment Configuration](#demo-environment-configuration)
3. [Step-by-Step Execution Guide](#step-by-step-execution-guide)
4. [Troubleshooting](#troubleshooting)
5. [Reset Instructions](#reset-instructions)
6. [Backup Plans](#backup-plans)

---

## Pre-Demo Setup

### System Requirements
- **Node.js:** v18.x or v20.x
- **npm:** v9.x or v10.x
- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, or Edge 120+
- **RAM:** Minimum 4GB available
- **Internet:** Required for OpenAI API calls

### Environment Setup (15 minutes before demo)

#### 1. Clone and Install Dependencies
```bash
# Navigate to project root
cd /Users/ronisegal/Projects/growth-engine

# Navigate to frontend package
cd packages/frontend

# Install dependencies (if not already installed)
npm install
```

#### 2. Configure Environment Variables
```bash
# Create .env.local file from example
cp .env.example .env.local

# Edit .env.local with required values
# Required variables:
# - OPENAI_API_KEY=sk-... (your OpenAI API key)
# - JWT_SECRET=your-secret-key-here (can use default for demo)
```

**Example `.env.local`:**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXX

# JWT Configuration
JWT_SECRET=demo-secret-key-change-in-production

# Application URL (for demo, leave as localhost)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**How to Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy and paste into `.env.local`
5. **Important:** Ensure you have credits in your OpenAI account ($5-10 recommended for demos)

#### 3. Start the Development Server
```bash
# From packages/frontend directory
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 3.2s
```

**Verify Server is Running:**
1. Open browser
2. Navigate to `http://localhost:3000`
3. Should see login page with Hebrew text

#### 4. Verify Test Data
Test data is automatically seeded on first server start. To verify:

1. Login with `teacher@example.com` / `Test123!`
2. Should see 5 pre-seeded students:
   - שרה כהן (Sarah Cohen)
   - מיכאל דוד (Michael David)
   - נועה אברהם (Noa Avraham)
   - דניאל יוסף (Daniel Yosef)
   - תמר לוי (Tamar Levi)

**If students are missing:**
```bash
# Restart the server
# Press Ctrl+C to stop
# Run npm run dev again
npm run dev
```

---

## Demo Environment Configuration

### Browser Setup

#### Recommended Browser: Chrome
**Why:** Best developer tools, consistent performance, good Hebrew support

**Configuration Steps:**
1. **Open Chrome in Incognito Mode** (prevents cache/extension issues)
   - Mac: `Cmd + Shift + N`
   - Windows: `Ctrl + Shift + N`

2. **Set Zoom Level for Visibility**
   - If presenting on projector: 125% or 150%
   - If presenting on laptop: 100% or 110%
   - Keyboard: `Cmd/Ctrl` + `+` to zoom in

3. **Open Developer Tools** (optional, for debugging)
   - Mac: `Cmd + Option + I`
   - Windows: `Ctrl + Shift + I`
   - Keep closed during demo unless troubleshooting

4. **Disable Notifications**
   - Chrome → Settings → Privacy and security → Site Settings → Notifications
   - Set to "Don't allow sites to send notifications"

#### Alternative Browser: Firefox
**Configuration:**
1. Open in Private Window (`Cmd/Ctrl + Shift + P`)
2. Zoom to appropriate level
3. Ensure Hebrew fonts render correctly

### Screen Setup

#### Resolution Recommendations
- **Laptop Demo (1-5 people):** 1440x900 or native resolution at 100% zoom
- **Projector Demo (6+ people):** 1920x1080 at 125-150% browser zoom
- **Video Call Demo:** 1920x1080, share browser window only (not entire screen)

#### Window Arrangement
```
┌─────────────────────────────────────┐
│  Browser Window (Maximized)        │
│  - Main demo window                 │
│  - http://localhost:3000            │
└─────────────────────────────────────┘

┌──────────────┐  ┌──────────────────┐
│  Terminal    │  │  Backup Browser  │
│  (Hidden)    │  │  (Background)    │
│  - npm run   │  │  - Same URL      │
│    dev logs  │  │  - Just in case  │
└──────────────┘  └──────────────────┘
```

**Best Practice:**
- Maximize browser window for demo
- Hide menu bar if possible (macOS: Auto-hide menu bar in System Preferences)
- Close all other applications (prevent notifications)
- Mute computer (prevent notification sounds)

### Font Configuration

**Hebrew Fonts - Ensure Clarity:**

Default fonts should work, but verify Hebrew text is readable:
- **Heebo** - Clean, modern, good for UI
- **Rubik** - Readable, friendly
- **Assistant** - Professional, clear

**Test Hebrew Rendering:**
1. Navigate to login page
2. Verify labels are clear: "דוא״ל", "סיסמה", "התחבר"
3. If fonts look blurry, try different browser or clear cache

---

## Step-by-Step Execution Guide

### Overview of Demo Flow
```
1. Login (1 min)
   ↓
2. View Student List (1 min)
   ↓
3. Add New Student (1.5 min)
   ↓
4. Start Analysis (1 min)
   ↓
5. AI Conversation (4 min)
   ↓
6. View Results (2.5 min)
   ↓
7. (Optional) Show Another Result (1 min)
```

**Total Time:** ~12 minutes of actual demo + buffer for talking points

---

### Step 1: Login (1 minute)

**URL:** `http://localhost:3000`

**What You'll See:**
```
┌─────────────────────────────────────┐
│                                     │
│           Growth Engine             │
│       מערכת ניתוח תלמידים          │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ דוא״ל                      │   │
│   │ [____________]             │   │
│   │                             │   │
│   │ סיסמה                      │   │
│   │ [____________]             │   │
│   │                             │   │
│   │     [התחבר]                │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Actions:**
1. **Click** on email field (דוא״ל)
2. **Type:** `teacher@example.com`
3. **Click** on password field (סיסמה)
4. **Type:** `Test123!`
5. **Click** "התחבר" (Login) button

**Expected Outcome:**
- Redirect to `/dashboard`
- URL changes to `http://localhost:3000/dashboard`
- Welcome message appears: "ברוך הבא, Demo Teacher"
- Student table visible with 5 students

**Troubleshooting:**
- If login fails: Check console for errors (F12)
- If redirect fails: Manually navigate to `/dashboard`
- If "Invalid credentials" message: Double-check spelling of email/password

**Talking Points While Logging In:**
"המערכת מאובטחת עם הזדהות JWT. כרגע יש חשבון מורה אחד להדגמה."

---

### Step 2: View Student List (1 minute)

**URL:** `http://localhost:3000/dashboard`

**What You'll See:**
```
┌───────────────────────────────────────────────────────┐
│  ברוך הבא, Demo Teacher              [התנתק]        │
├───────────────────────────────────────────────────────┤
│                                                       │
│  התלמידים שלי                      [הוסף תלמיד]    │
│                                                       │
│  ┌─────────┬──────┬───────────┬──────────────────┐  │
│  │ שם      │ כיתה │ כיתה/מורה │ פעולות          │  │
│  ├─────────┼──────┼───────────┼──────────────────┤  │
│  │ שרה כהן │ כיתה ג׳│ גב׳ לוי  │ [נתח] [צפה]    │  │
│  │ מיכאל דוד│ כיתה ג׳│ גב׳ לוי  │ [נתח] [צפה]    │  │
│  │ נועה אברהם│ כיתה ד׳│ מר רוזנברג│ [נתח] [צפה]   │  │
│  │ דניאל יוסף│ כיתה ה׳│ גב׳ שפירא│ [נתח] [צפה]   │  │
│  │ תמר לוי │ כיתה ד׳│ מר רוזנברג│ [נתח] [צפה]   │  │
│  └─────────┴──────┴───────────┴──────────────────┘  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Key Elements to Point Out:**

1. **Hebrew Interface**
   - All text in Hebrew
   - Right-to-left layout
   - Hebrew student names

2. **Student Information**
   - Name (שם)
   - Grade (כיתה) - Hebrew grade notation
   - Class/Teacher (כיתה/מורה)

3. **Actions**
   - "נתח" (Analyze) - Start new analysis
   - "צפה בתוצאות" (View Results) - See existing results (may not be available yet)

**Talking Points:**
"כאן המורה רואה את כל התלמידים שלו. שימו לב לשמות העבריים, הכיתות, והממשק המלא בעברית."

**Optional Actions:**
- Scroll through table
- Point to specific students
- Show search bar (if implemented)

---

### Step 3: Add New Student (1.5 minutes)

**Starting Point:** Dashboard with student list visible

**Actions:**

**3.1. Click "הוסף תלמיד" Button**
- Located at top right of student table
- Blue button

**Expected Outcome:**
- Modal dialog opens
- Screen slightly darkens (overlay)
- Form appears with 3 fields

**What You'll See:**
```
┌────────────────────────────────────┐
│  הוסף תלמיד חדש                   │
│                                    │
│  שם התלמיד/ה                      │
│  [_____________________]           │
│                                    │
│  כיתה                              │
│  [_____________________]           │
│                                    │
│  כיתה/מורה (אופציונלי)            │
│  [_____________________]           │
│                                    │
│  [ביטול]    [הוסף]                │
└────────────────────────────────────┘
```

**3.2. Fill Out Form**

**Field 1 - Student Name (שם התלמיד/ה):**
- Click in first field
- Type: `יוסי מזרחי`
- Note: Hebrew input should work naturally

**Field 2 - Grade (כיתה):**
- Click in second field
- Type: `כיתה ו׳`
- Note: Standard Hebrew grade format

**Field 3 - Class/Teacher (כיתה/מורה):**
- Click in third field
- Type: `גב׳ כהן`
- Note: Optional field, but good to demonstrate

**3.3. Submit Form**
- Click "הוסף" (Add) button
- Wait for response

**Expected Outcome:**
- Modal closes
- Success message appears (toast/alert): "התלמיד נוסף בהצלחה"
- Table updates with new student
- "יוסי מזרחי" now appears in the table
- Student count increases from 5 to 6

**Talking Points While Typing:**
"שימו לב - הקלט העברי עובד בצורה טבעית. הכיווניות נכונה, הפונטים ברורים."

**After Submission:**
"התלמיד נוסף מיד למערכת. בגרסת הייצור, זה יישמר במסד נתונים. כרגע זה בזיכרון."

**Troubleshooting:**
- If modal doesn't open: Refresh page and try again
- If form doesn't submit: Check for validation errors
- If student doesn't appear: Check browser console for errors

---

### Step 4: Start Analysis (1 minute)

**Starting Point:** Dashboard with student list (including newly added student)

**Actions:**

**4.1. Find "שרה כהן" in Table**
- First student in the list
- 3rd grade student

**4.2. Click "נתח" (Analyze) Button**
- Blue button in the "פעולות" (Actions) column
- Next to "שרה כהן"

**Expected Outcome:**
- Page navigates to analysis page
- URL changes to: `/analyze?student={id}&name=שרה כהן`
- Loading state briefly appears
- Chat interface loads

**What You'll See:**
```
┌────────────────────────────────────────────────────┐
│  ניתוח תלמיד: שרה כהן                [חזרה]      │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  [Chat messages will appear here]           │ │
│  │                                              │ │
│  │                                              │ │
│  │                                              │ │
│  │                                              │ │
│  │                                              │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ הקלד/י הודעה...                              │ │
│  │ [________________________________]  [שלח]    │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  [סיים ניתוח]                                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Talking Points:**
"עכשיו נתחיל את הניתוח. זה הממשק השיחתי - הAI ישאל שאלות והמורה עונה באופן טבעי."

**Important Note:**
- The "סיים ניתוח" (Complete Analysis) button should be **disabled** initially
- It enables only after a few messages have been exchanged

---

### Step 5: AI Conversation (4 minutes)

**Starting Point:** Analysis page with empty chat

**Important:** AI should send first message automatically when page loads.

**If AI doesn't send first message automatically:**
1. Wait 3-5 seconds
2. If still nothing, refresh page
3. If that fails, manually type: "בואו נתחיל את הניתוח של שרה"

---

#### Exchange 1: Academic Performance

**AI Message (Auto-sent):**
```
שלום! אני כאן כדי לעזור לך ליצור ניתוח מקיף עבור שרה כהן.
אני אשאל מספר שאלות על הביצועים האקדמיים, סגנון הלמידה, וההתנהגות של התלמידה.
תוכל/י לענות בחופשיות ובפירוט ככל שתרצה/י.

בואו נתחיל:

איך היית/היית מתאר/ת את הביצועים האקדמיים הכלליים של שרה כהן במקצועות השונים?
```

**Where to Type Your Response:**
- Click in the message input field at bottom
- Type your response

**Your Response (Copy-Paste or Type):**
```
שרה היא תלמידה מצטיינת במתמטיקה ומדעים. היא מבינה מושגים במהירות ותמיד מסיימת את התרגילים ראשונה.
בקריאה והבעה בעברית היא טובה, אבל לפעמים מתקשה עם כתיבה יצירתית.
באנגלית היא בינונית - צריכה עוד תרגול באוצר מילים.
```

**How to Send:**
- Click "שלח" (Send) button
- OR press Enter (if supported)

**What Happens:**
- Your message appears in chat (right side, teacher bubble)
- Loading indicator appears
- After 2-4 seconds, AI response appears (left side, AI bubble)

**Talking Points While Waiting:**
"המורה כותב בצורה חופשית, טבעית. אין שדות קבועים או שאלונים."

---

#### Exchange 2: Learning Style

**AI Message (Should appear automatically):**
```
תודה רבה על המידע!

עכשיו, ספר/י לי על סגנון הלמידה של שרה:
- האם היא לומדת טוב יותר בצורה ויזואלית, שמיעתית, או קינסתטית?
- איך היא משתתפת בשיעורים ובפעילויות קבוצתיות?
```

**Your Response:**
```
שרה היא לומדת ויזואלית מובהקת. כשאני משתמשת בתרשימים וציורים, היא תופסת מיד.
בדיונים בכיתה היא קצת ביישנית - לא מתנדבת הרבה, אבל כשאני שואלת אותה ישירות, התשובות שלה מצוינות.
בעבודת קבוצה היא מעדיפה לעבוד עם חברה אחת או שתיים, לא בקבוצות גדולות.
```

**Send** the message

**Talking Points:**
"הAI מתאים את השאלות לפי התשובות. זו שיחה דינמית, לא שאלון סטנדרטי."

---

#### Exchange 3: Work Habits & Behavior

**AI Message:**
```
מעולה, אני מתחיל להבין את שרה טוב יותר.

עכשיו נדבר על הרגלי עבודה והתנהגות:
- איך שרה מתמודדת עם שיעורי בית ומשימות?
- איך היית/היית מתאר/ת את ההתנהגות שלה בכיתה? האם היא ממוקדת, מוסחת בקלות, או איפשהו באמצע?
```

**Your Response (SHORTER - for demo pacing):**
```
שיעורי בית - תמיד מושלמים במתמטיקה, לפעמים שוכחת בשאר המקצועות.
בכיתה היא מאוד ממוקדת וקשובה. אף פעם לא מפריעה. לפעמים נראה שהיא "בעולם שלה" אבל זה בדרך כלל כשהיא חושבת על הפתרון.
```

**Send** the message

**Talking Points:**
"שימו לב - אפשר לכתוב תשובות קצרות או ארוכות. המערכת גמישה."

---

#### Exchange 4: Complete Analysis

**After 3 exchanges, you have enough for analysis.**

**Action:**
- Click "סיים ניתוח" (Complete Analysis) button
  - Should now be **enabled** (not grayed out)
  - Located at bottom of page

**What Happens:**
1. Button changes to "מעבד..." (Processing)
2. Loading spinner appears
3. Screen shows "מנתח את התשובות..." (Analyzing responses...)
4. After 5-10 seconds, redirect to results page

**Talking Points While Waiting:**
"עכשיו הAI מעבד את השיחה ומייצר ניתוח מקיף. זה לוקח מספר שניות."

**If Analysis Takes Too Long (>15 seconds):**
- Check browser console for errors
- Verify OpenAI API key is valid
- Check internet connection
- May need to refresh and try again

---

### Step 6: View Results (2.5 minutes)

**Starting Point:** Redirect from analysis page

**URL:** `http://localhost:3000/results?student={id}`

**What You'll See:**
```
┌────────────────────────────────────────────────────┐
│  תוצאות ניתוח: שרה כהן              [חזרה]       │
├────────────────────────────────────────────────────┤
│                                                    │
│  # ניתוח למידה מקיף - שרה כהן                    │
│                                                    │
│  ## 📊 סיכום כללי                                │
│  שרה היא תלמידה מוכשרת במיוחד במתמטיקה ומדעים,  │
│  עם יכולות הבנה גבוהות ומהירות תפיסה מרשימה...  │
│                                                    │
│  ## 💪 נקודות חוזק                               │
│                                                    │
│  ### חוזקות אקדמיות                              │
│  - **מצטיינת במתמטיקה** - מבינה מושגים במהירות...│
│  - **חזקה במדעים** - יכולת הבנה והיקש מצוינת    │
│  - **לומדת ויזואלית** - תופסת מיד כשמשתמשים...  │
│                                                    │
│  [... more content ...]                           │
│                                                    │
│  [הדפס]  [ייצא PDF]  [שתף]                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Analysis Structure:**
The results page displays the full analysis in Hebrew markdown format with these sections:

1. **📊 סיכום כללי** (General Summary)
2. **💪 נקודות חוזק** (Strengths)
   - חוזקות אקדמיות (Academic Strengths)
   - חוזקות התנהגותיות וחברתיות (Behavioral/Social Strengths)
3. **🎯 תחומים לשיפור** (Areas for Improvement)
   - אתגרים אקדמיים (Academic Challenges)
   - אתגרים התנהגותיים/רגשיים (Behavioral/Emotional Challenges)
4. **📈 המלצות ותוכנית פעולה** (Recommendations & Action Plan)
   - המלצות מיידיות (Immediate Recommendations)
   - המלצות לטווח ארוך (Long-term Recommendations)
   - התאמות בכיתה (Classroom Adaptations)
5. **🎓 נקודות למעקב** (Follow-up Points)
   - מדדי הצלחה (Success Metrics)
   - תדירות הערכה מחדש (Re-evaluation Frequency)
6. **💡 הערות נוספות** (Additional Notes)

**Demo Actions - Scroll Through Content:**

**Scroll 1: Summary Section**
- Pause at top
- **Say:** "הנה הניתוח המלא! שימו לב לסיכום הכללי - 2-3 משפטים שתופסים את המהות."

**Scroll 2: Strengths Section**
- Scroll to נקודות חוזק
- **Say:** "המערכת מתחילה עם חוזקות - גישה חיובית."
- Point to specific strength: "מצטיינת במתמטיקה"

**Scroll 3: Improvements Section**
- Scroll to תחומים לשיפור
- **Say:** "האתגרים מוצגים כהזדמנויות לצמיחה, לא כביקורת."

**Scroll 4: Recommendations Section** ⭐ **MOST IMPORTANT**
- Scroll to המלצות ותוכנית פעולה
- **Pause here for 10 seconds**
- **Say:** "וזה החלק החשוב ביותר - המלצות מעשיות!"

**Point to Specific Recommendation:**
Find a recommendation like:
```
1. **פיתוח ביטחון בדיבור**
   - פעולה: לשאול את שרה שאלות ישירות לפחות פעם בכל שיעור
   - מטרה: לחזק את הביטחון העצמי ולאפשר לה להציג את הידע שלה
   - יישום: התחל עם שאלות במתמטיקה...
```

**Say:**
"הנה דוגמה: 'לשאול את שרה שאלות ישירות לפחות פעם בכל שיעור'. זו המלצה קונקרטית שמורה יכול ליישם מחר."

**Scroll 5: Follow-up Section**
- Scroll to נקודות למעקב
- **Say:** "ויש גם מדדי הצלחה - איך נדע שההתערבות עובדת?"

**Final Statement:**
"כל זה נוצר אוטומטית על ידי AI תוך דקות. זה חוסך למורה שעות של כתיבה וניתוח."

---

### Step 7: Show Another Student's Result (Optional - 1 minute)

**If Time Permits:**

**Action:**
1. Click "חזרה" (Back) button
2. Returns to dashboard
3. Find different student in table
4. Click "צפה בתוצאות" (View Results) if available

**Purpose:**
- Show that results are stored
- Demonstrate ability to review past analyses
- Show system remembers data

**Talking Points:**
"המורה יכול לחזור לניתוחים קודמים בכל עת. זה מאפשר מעקב לאורך זמן."

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Server Won't Start
**Symptom:** `npm run dev` fails or hangs

**Solutions:**
```bash
# Solution A: Kill existing process
lsof -ti:3000 | xargs kill -9
npm run dev

# Solution B: Clear Next.js cache
rm -rf .next
npm run dev

# Solution C: Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

#### Issue 2: Login Doesn't Work
**Symptom:** "Invalid credentials" error or no response

**Solutions:**
1. **Check credentials:**
   - Email: `teacher@example.com` (exact case)
   - Password: `Test123!` (exact case and characters)

2. **Check browser console:**
   - Press F12
   - Look for red errors
   - Common: JWT_SECRET not set

3. **Verify environment variables:**
   ```bash
   cat .env.local | grep JWT_SECRET
   # Should show: JWT_SECRET=your-secret-key
   ```

4. **Restart server:**
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

#### Issue 3: Students Don't Appear
**Symptom:** Dashboard shows empty table

**Solutions:**
1. **Refresh page:** `Cmd/Ctrl + R`

2. **Hard refresh:** `Cmd/Ctrl + Shift + R` (clears cache)

3. **Check server logs:**
   - Look at terminal where `npm run dev` is running
   - Should show "Students seeded" or similar message

4. **Manually verify API:**
   ```bash
   # In separate terminal
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/students
   # Should return JSON array with 5 students
   ```

#### Issue 4: AI Conversation Fails
**Symptom:** No response from AI, or error message

**Solutions:**
1. **Check OpenAI API key:**
   ```bash
   cat .env.local | grep OPENAI_API_KEY
   # Should show: OPENAI_API_KEY=sk-proj-...
   ```

2. **Verify API key is valid:**
   - Go to https://platform.openai.com/api-keys
   - Check if key is active
   - Check if you have credits

3. **Check browser console:**
   - F12 → Console tab
   - Look for 401 Unauthorized (bad key) or 429 Rate Limit (no credits)

4. **Network issue:**
   - Check internet connection
   - Try: `ping api.openai.com`

5. **Fallback:**
   - Use backup browser with same URL
   - Or restart demo from Step 1

#### Issue 5: Analysis Results Don't Appear
**Symptom:** "Processing..." hangs or error after completing conversation

**Solutions:**
1. **Wait longer:**
   - Can take 10-15 seconds for complex analyses
   - Don't refresh yet

2. **Check server logs:**
   - Look for OpenAI API errors
   - Look for "Analysis complete" or error messages

3. **Check network tab:**
   - F12 → Network tab
   - Look for failed requests (red)
   - Check response of `/api/analysis/complete` endpoint

4. **Restart analysis:**
   - Go back to dashboard
   - Try different student
   - Use shorter responses

#### Issue 6: Hebrew Text Appears Broken or Backwards
**Symptom:** Text displays left-to-right or with broken characters

**Solutions:**
1. **Check browser language settings:**
   - Should support RTL languages
   - Try different browser

2. **Verify fonts:**
   - Hebrew fonts should be installed
   - Try Ctrl+0 to reset zoom

3. **Hard refresh:**
   - `Cmd/Ctrl + Shift + R`

4. **Try different browser:**
   - Chrome usually best for Hebrew
   - Firefox also good

#### Issue 7: Modal Doesn't Open (Add Student)
**Symptom:** Clicking "הוסף תלמיד" does nothing

**Solutions:**
1. **Check browser console:**
   - F12 → Console
   - Look for JavaScript errors

2. **Refresh page:**
   - `Cmd/Ctrl + R`

3. **Try keyboard:**
   - Tab to button
   - Press Enter

#### Issue 8: "Complete Analysis" Button Stays Disabled
**Symptom:** Can't finish analysis, button is grayed out

**Solutions:**
1. **Send more messages:**
   - Need minimum 3 messages from teacher
   - Send one more message and wait for AI response

2. **Check message count:**
   - Should show at least 3 teacher messages and 3 AI messages

3. **Restart analysis:**
   - Go back to dashboard
   - Start fresh analysis

---

## Reset Instructions

### Between Demo Sessions

**If running multiple demos back-to-back:**

#### Quick Reset (Keep Server Running)
```bash
# Server stays running, just clear data in browser
# In browser:
1. Click "התנתק" (Logout)
2. Hard refresh: Cmd/Ctrl + Shift + R
3. Login again
```

**Note:** Student data may persist in memory. If you need fresh students:

#### Full Reset (Restart Server)
```bash
# In terminal where server is running:
1. Press Ctrl+C (stop server)
2. npm run dev (start server)

# In browser:
3. Hard refresh: Cmd/Ctrl + Shift + R
4. Login again
```

**Expected Result:**
- 5 original students appear
- Any added students are gone
- No analysis results exist

### Clearing Browser Cache

**If things seem "stuck":**

**Chrome:**
1. `Cmd/Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Time range: "Last hour"
4. Click "Clear data"

**Firefox:**
1. `Cmd/Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"

### Resetting Test Data

**If you want specific test data:**

Edit `/packages/frontend/src/app/api/lib/studentsStore.ts`:

```typescript
seed() {
  if (this.students.size === 0) {
    this.create({
      name: 'YOUR_STUDENT_NAME',
      grade: 'כיתה ג׳',
      class: 'גב׳ לוי'
    });
    // Add more students...
  }
}
```

Then restart server.

---

## Backup Plans

### Backup Plan A: Second Browser Window

**Setup:**
1. Before demo, open second browser window
2. Login and complete full flow
3. Keep in background
4. If main window fails, switch to backup

### Backup Plan B: Screenshots/Video

**Preparation:**
```bash
# Record successful demo run beforehand
# Take screenshots at each step
# If live demo fails completely, show screenshots
```

**Recommended Screenshots:**
1. Login page
2. Student list
3. Add student modal
4. Analysis chat with 3-4 messages
5. Complete analysis results

**Where to Store:**
- `/demo-screenshots/` folder
- Or Google Slides presentation

### Backup Plan C: Localhost Alternative

**If localhost fails:**

**Option 1: Deploy to Vercel (Before Demo)**
```bash
# From project root
vercel deploy

# Get URL: https://growth-engine-xyz.vercel.app
# Use this URL instead of localhost
```

**Option 2: Use ngrok (Expose localhost)**
```bash
# Install ngrok: brew install ngrok (Mac)
ngrok http 3000

# Get public URL: https://abc123.ngrok.io
# Share this URL
```

### Backup Plan D: Pre-Recorded Demo

**Ultimate Fallback:**
1. Record successful demo video beforehand
2. Keep video file ready (MP4)
3. If everything fails, play video
4. Narrate over the video

---

## Demo Checklist

### T-15 Minutes Before Demo

- [ ] Server running (`npm run dev`)
- [ ] Open browser to `http://localhost:3000`
- [ ] Verify login works
- [ ] Verify 5 students appear
- [ ] Zoom level appropriate (100% or 125%)
- [ ] Close other applications
- [ ] Mute computer notifications
- [ ] Backup browser window ready
- [ ] Terminal visible (but hidden from screen share)

### T-5 Minutes Before Demo

- [ ] Do a quick test run (login → view students)
- [ ] Open second tab with OpenAI API dashboard (verify credits)
- [ ] Have demo script open on second monitor or printed
- [ ] Water nearby
- [ ] Phone on silent

### T-0 Minutes (Demo Start)

- [ ] Take a deep breath
- [ ] Smile
- [ ] Start with introduction slide (optional)
- [ ] Share screen (browser window only, not entire screen)
- [ ] Begin demo

---

## Post-Demo Actions

### Immediate (During Q&A)
1. Keep browser open (in case someone asks "show me again")
2. Have OpenAI API costs ready if asked about pricing
3. Be ready to show code (if technical audience)

### After Demo
1. Stop server: `Ctrl+C`
2. Save any feedback notes
3. Check server logs for errors (learn for next time)
4. If recording, save and backup video

---

## Performance Optimization Tips

### If Demo is Slow

**Optimize OpenAI API Calls:**
- Use GPT-3.5-turbo instead of GPT-4 (faster, cheaper)
- Edit `/packages/frontend/src/app/api/lib/openai.ts`
- Change model to `gpt-3.5-turbo`

**Reduce AI Response Time:**
- Use shorter system prompts
- Request shorter responses
- Limit conversation to 3 messages

**Browser Performance:**
- Close other tabs
- Disable browser extensions
- Use Incognito mode (no extensions)

---

## Success Metrics

### How to Know Demo Went Well

**Technical Success:**
- [ ] No crashes or errors
- [ ] All features demonstrated
- [ ] Hebrew text displayed correctly
- [ ] AI responses were relevant and professional

**Engagement Success:**
- [ ] Audience asked questions
- [ ] Positive reactions (nodding, smiling)
- [ ] Follow-up requests
- [ ] Time stayed on track (12-15 minutes)

**Impact Success:**
- [ ] Audience understood the value proposition
- [ ] No confusion about what the system does
- [ ] Interest in pilot/trial expressed
- [ ] Specific use cases discussed

---

**End of Demo Walkthrough**

**Remember:** Practice the demo 2-3 times before the real presentation. Know where each button is, what each response should be, and how to recover from common issues. Confidence comes from preparation.

**Good luck!** 🎓

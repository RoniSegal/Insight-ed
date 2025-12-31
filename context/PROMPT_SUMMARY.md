# Student Analysis Prompts - Summary

**Created**: 2025-12-31
**Purpose**: 3-Day MVP Demo - AI-powered student analysis
**Status**: ✅ Ready for Day 2 implementation

---

## 📁 Files Created

### 1. Full Prompt Documentation

**File**: `/context/student-analysis-prompt.md`

**Description**: Comprehensive prompt engineering documentation including:

- System prompt with role definition
- 6-phase assessment questions
- Complete Hebrew analysis template
- Guidelines for tone, language, and ethics
- Example variables and error handling

**Use Case**: Reference for developers and prompt engineers. Contains full context and best practices.

**Size**: ~500 lines of detailed documentation

---

### 2. Simple Chat Prompt

**File**: `/context/chat-prompt-simple.txt`

**Description**: Condensed version for direct use in the chat interface. Contains:

- Core system instructions
- 6 key questions to ask
- Output format requirements
- Tone and language guidelines

**Use Case**: Direct integration into OpenAI API calls. Copy-paste ready.

**Size**: ~30 lines of concise instructions

---

## 🎯 How It Works

### Conversation Flow

1. **Teacher provides student name**: "I want to analyze Sarah Cohen"

2. **AI asks 6 key questions** (one at a time):
   - Overall academic performance and subject strengths/weaknesses
   - Learning style and class engagement
   - Homework habits and behavior
   - Social interactions and emotional patterns
   - Main learning challenges and recent progress
   - Unique strengths and additional observations

3. **Teacher provides free-form responses**: No structure required, natural conversation

4. **AI generates comprehensive Hebrew analysis** with:
   - 📊 General summary (2-3 sentences)
   - 💪 Strengths (academic + social/behavioral)
   - 🎯 Areas for improvement (with specific challenges)
   - 📈 Action plan (immediate + long-term recommendations)
   - 🎓 Success metrics and follow-up timeline
   - 💡 Additional notes

---

## 📝 Sample Output Structure

```hebrew
# ניתוח למידה מקיף - שרה כהן

## 📊 סיכום כללי
שרה היא תלמידה מצטיינת במתמטיקה ומדעים, עם כישורי חשיבה אנליטיים מעולים...

## 💪 נקודות חוזק

### חוזקות אקדמיות
- מתמטיקה: פותרת בעיות מורכבות ביצירתיות
- מדעים: סקרנות גבוהה ושאלות מעמיקות
- חשיבה לוגית: מזהה דפוסים במהירות

### חוזקות התנהגותיות וחברתיות
- עבודת צוות: מובילה קבוצות בצורה טבעית
- יוזמה: מציעה רעיונות חדשים

## 🎯 תחומים לשיפור

### אתגרים אקדמיים
1. **כתיבה יצירתית**
   - תיאור: קושי בארגון רעיונות בכתב
   - השפעה: ציונים נמוכים יותר בעבודות חיבור

### אתגרים התנהגותיים/רגשיים
1. **פרפקציוניזם**
   - תיאור: חששות מטעויות גורמות להימנעות מניסיונות
   - השפעה: מגבילה לקיחת סיכונים בלימודה

## 📈 המלצות ותוכנית פעולה

### המלצות מיידיות (1-2 שבועות)
1. **מבני כתיבה מובנים**
   - פעולה: השתמשי בתבניות גרפיות לארגון רעיונות לפני כתיבה
   - מטרה: להקל על תהליך הכתיבה ולהפחית חרדה
   - יישום: הקדישי 10 דקות לתכנון לפני כל משימת כתיבה

[... המשך המלצות ...]

## 🎓 נקודות למעקב

### מדדי הצלחה
1. שיפור בציוני חיבורים ב-20% בחודש הקרוב
2. נכונות להגיש טיוטות ראשונות ללא פרפקציוניזם
3. השתתפות פעילה בדיונים על נושאים לא-מדעיים

---

**תאריך הניתוח**: 31/12/2025
**מבוסס על**: תצפיות ושיחה עם המורה/ה
**המלצה לשיתוף**: מומלץ לשתף עם ההורים והצוות החינוכי
```

---

## 🎨 Design Principles

### 1. **Strengths-First Approach**

Always start with what the student does well. Build confidence before addressing challenges.

### 2. **Growth Mindset**

Frame challenges as opportunities for development, not fixed limitations.

### 3. **Actionable Recommendations**

Every suggestion includes:

- **What** to do (specific action)
- **Why** it matters (goal/purpose)
- **How** to implement (practical steps)

### 4. **Hebrew Language & Culture**

- Professional Hebrew with educational terminology
- Culturally appropriate for Israeli K-12 system
- Gender-inclusive language (תלמיד/ה)

### 5. **Evidence-Based**

Grounded in educational psychology and learning science best practices.

---

## 🔧 Implementation Notes for Day 2

### For Backend (GE-057: OpenAI Integration)

**Recommended approach**:

```typescript
// Use the simple prompt as system message
const systemPrompt = fs.readFileSync('/context/chat-prompt-simple.txt', 'utf-8');

// Conversation flow:
1. User sends: "Analyze student: Sarah Cohen"
2. Backend starts conversation with OpenAI
3. OpenAI asks first question
4. Teacher responds
5. Continue until all 6 questions answered
6. OpenAI generates final Hebrew analysis
```

**API Configuration**:

- Model: `gpt-4-turbo-preview` (or `gpt-4` for better Hebrew)
- Temperature: `0.7` (balance creativity with consistency)
- Max tokens: `2000` (enough for comprehensive analysis)

### For Frontend (GE-056: Chat Interface)

**UI Requirements**:

- Real-time message display
- Clear indication of AI vs teacher messages
- "Analysis complete" state with formatted output
- Copy/download analysis feature
- RTL support for Hebrew output

### For Designer (GE-060: Prompt Engineering)

**Already Done!** ✅

- Full prompt created: `/context/student-analysis-prompt.md`
- Simple version ready: `/context/chat-prompt-simple.txt`
- No further prompt engineering needed for MVP

**Optional enhancements** (post-MVP):

- A/B test different question orders
- Experiment with temperature settings
- Add few-shot examples for consistency
- Create specialized prompts for different age groups

---

## 📊 Quality Metrics

### What Makes a Good Analysis?

1. **Completeness**: Covers all requested sections
2. **Specificity**: Concrete examples, not generic statements
3. **Balance**: 3-5 strengths, 2-4 improvement areas
4. **Actionability**: Every recommendation has clear next steps
5. **Hebrew Quality**: Professional, fluent, culturally appropriate
6. **Empathy**: Supportive tone, growth-oriented language

### Red Flags to Watch For:

- Generic advice ("study more", "try harder")
- Diagnostic labels (ADHD, dyslexia) without professional evaluation
- Judgmental language about student or family
- Contradictory recommendations
- Missing concrete action steps

---

## 🧪 Testing the Prompt

### Test Scenarios for Day 2:

1. **High-performing student**: Should focus on challenge/enrichment
2. **Struggling student**: Should be supportive, identify root causes
3. **Behavioral issues**: Should address emotional/social factors
4. **Learning disability suspected**: Should recommend professional evaluation
5. **Insufficient teacher input**: Should ask follow-up questions

### Sample Test Input:

```
Teacher: "I want to analyze David Levi"
AI: "How would you describe David's overall academic performance..."
Teacher: "He's great at math but struggles with reading comprehension"
AI: "Which subjects does David excel in..."
Teacher: "Math and science. He has trouble with Hebrew and social studies"
[... continue through all 6 questions ...]
AI: [Generates comprehensive Hebrew analysis]
```

---

## 🔐 Privacy & Security

### Important Reminders:

- **Student data is sensitive**: Never log or store analysis content
- **Parental consent**: Ensure school has permission for AI analysis
- **Confidentiality**: Teachers should be reminded not to share outside school
- **No diagnostics**: AI cannot diagnose learning disabilities
- **Human oversight**: Teacher reviews all AI recommendations

### Recommended Disclaimer:

Add to analysis footer:

```
⚠️ הערת אחריות: ניתוח זה מבוסס על תצפיות המורה ומהווה המלצות בלבד.
לא מדובר באבחון רפואי או פסיכולוגי. ייעוץ מקצועי נדרש במקרים המצריכים התערבות מומחה.
```

---

## 📚 References & Resources

The prompt is based on:

- Educational psychology best practices
- Israeli K-12 curriculum framework
- Growth mindset research (Dweck, 2006)
- Differentiated instruction principles (Tomlinson, 2001)
- Universal Design for Learning (UDL) framework

---

## ✅ Ready for Integration

**Status**: Both prompt files are complete and ready for Day 2 implementation.

**Next Steps**:

1. Backend team: Integrate `/context/chat-prompt-simple.txt` into OpenAI API calls (GE-057)
2. Frontend team: Build chat interface to support multi-turn conversation (GE-056)
3. E2E team: Test with sample teacher inputs (GE-061)

**No further prompt engineering work required for MVP!**

---

_Prompt created for 3-Day MVP Demo - Growth Engine_
_Date: 2025-12-31_
_Version: 1.0_

# Hebrew Translation Guide for Growth Engine Prototypes

## Status

### Completed Files (3/15):
1. ✅ **styles.css** - RTL support added
2. ✅ **index.html** - Fully translated to Hebrew with RTL
3. ✅ **teacher-dashboard/dashboard.html** - Fully translated to Hebrew with RTL

### Pending Files (12/15):
4. ⏸ analysis/conversation.html - **CORE FEATURE - HIGH PRIORITY**
5. ⏸ auth/login.html
6. ⏸ auth/signup.html
7. ⏸ auth/password-reset.html
8. ⏸ students/roster.html
9. ⏸ students/add-student.html
10. ⏸ students/import-csv.html
11. ⏸ analysis/start-analysis.html
12. ⏸ analysis/review-results.html
13. ⏸ results/view-analysis.html
14. ⏸ results/export-pdf.html
15. ⏸ principal-dashboard/dashboard.html
16. ⏸ search/search-filter.html

---

## RTL Implementation

### HTML Tag Changes
Every HTML file needs:
```html
<!-- OLD -->
<html lang="en">

<!-- NEW -->
<html lang="he" dir="rtl">
```

### CSS RTL Support (Already Implemented)
The `styles.css` file now includes comprehensive RTL support:
- Text direction and alignment
- Flexbox/grid direction reversal
- Padding/margin flips
- Border positioning (left → right)
- Icon and button positioning

---

## Translation Dictionary

### Common UI Elements

| English | Hebrew | Notes |
|---------|--------|-------|
| Login | התחברות | |
| Sign Up | הרשמה | |
| Sign In | כניסה | |
| Logout | התנתקות | |
| Dashboard | לוח בקרה | |
| Student | תלמיד/ה | Gender-neutral form |
| Students | תלמידים | |
| Teacher | מורה | |
| Principal | מנהל/ת | Can be masculine or feminine |
| Analysis | ניתוח | |
| Start Analysis | התחל ניתוח | |
| Save | שמור | |
| Cancel | ביטול | |
| Submit | שלח | |
| Send | שלח | |
| Email | דוא"ל | With quotes (gershayim) |
| Password | סיסמה | |
| Settings | הגדרות | |
| Search | חיפוש | |
| Filter | סינון / מסנן | Verb / Noun |
| View | הצג | |
| Edit | ערוך | |
| Delete | מחק | |
| Add | הוסף | |
| Export | ייצוא | |
| Import | ייבוא | |
| Download | הורדה | |
| Upload | העלאה | |
| Back | חזרה | |
| Next | הבא | |
| Previous | הקודם | |
| Continue | המשך | |
| Finish | סיים | |
| Close | סגור | |

### Page-Specific Translations

#### Authentication
| English | Hebrew |
|---------|--------|
| Forgot Password? | שכחת סיסמה? |
| Reset Password | איפוס סיסמה |
| Remember Me | זכור אותי |
| Or continue with | או המשך עם |
| Don't have an account? | אין לך חשבון? |
| Already have an account? | כבר יש לך חשבון? |
| Create Account | יצירת חשבון |
| Password strength | חוזק סיסמה |
| Weak | חלשה |
| Medium | בינונית |
| Strong | חזקה |

#### Dashboard & Analytics
| English | Hebrew |
|---------|--------|
| Welcome back | ברוך שובך / שלום |
| Total Students | סה"כ תלמידים |
| Analyzed | נותחו |
| In Progress | בתהליך |
| Flagged | מסומנים |
| Pending | ממתין |
| Completed | הושלם |
| Overview | סקירה כללית |
| Metrics | מדדים |
| Trends | מגמות |
| View All | הצג הכל |
| Last analyzed | נותח לאחרונה |
| Never | אף פעם |
| 2 days ago | לפני יומיים |
| 1 week ago | לפני שבוע |
| On track | על המסלול |
| Priority: High | עדיפות: גבוהה |

#### Student Management
| English | Hebrew |
|---------|--------|
| Student Roster | רשימת תלמידים |
| Add Student | הוסף תלמיד |
| Student Name | שם התלמיד |
| First Name | שם פרטי |
| Last Name | שם משפחה |
| Grade | כיתה |
| Class | כיתה |
| Room | חדר |
| Student ID | מספר תלמיד |
| Date of Birth | תאריך לידה |
| CSV Import | ייבוא CSV |
| Bulk Import | ייבוא כמותי |
| Drag and drop | גרור ושחרר |
| Upload file | העלה קובץ |
| Validation errors | שגיאות אימות |

#### AI Analysis (CORE FEATURE)
| English | Hebrew |
|---------|--------|
| Start Analysis | התחל ניתוח |
| AI Analysis | ניתוח AI |
| Conversation | שיחה |
| Conversation Interface | ממשק שיחה |
| Growth Engine AI | מנוע צמיחה AI |
| AI-guided assessment | הערכה מונחית AI |
| Progress tracking | מעקב התקדמות |
| Auto-save | שמירה אוטומטית |
| Auto-saved | נשמר אוטומטית |
| Save & Resume Later | שמור והמשך מאוחר יותר |
| Review Results | סקור תוצאות |
| Processing | מעבד |
| Analyzing | מנתח |
| Section X of Y | קטע X מתוך Y |
| Estimated time remaining | זמן משוער שנותר |
| Academic | אקדמי |
| Behavioral & Social | התנהגותי וחברתי |
| Engagement | מעורבות |

#### Analysis Results
| English | Hebrew |
|---------|--------|
| Analysis Report | דוח ניתוח |
| View Analysis | הצג ניתוח |
| Strengths | נקודות חוזק |
| Areas for Improvement | תחומי שיפור |
| Recommendations | המלצות |
| Teacher Notes | הערות מורה |
| Export PDF | ייצוא PDF |
| Professional PDF | PDF מקצועי |
| Parent Conference | פגישת הורים |
| Documentation | תיעוד |

### Status Badges
| English | Hebrew |
|---------|--------|
| Critical | קריטי |
| Core Feature | תכונה מרכזית |
| Complete | הושלם |
| In Progress | בתהליך |
| Pending | ממתין |
| Success | הצלחה |
| Warning | אזהרה |
| Error | שגיאה |

### Time Expressions
| English | Hebrew |
|---------|--------|
| Now | עכשיו |
| Today | היום |
| Yesterday | אתמול |
| Tomorrow | מחר |
| This week | השבוע |
| Last week | שבוע שעבר |
| X minutes ago | לפני X דקות |
| X hours ago | לפני X שעות |
| X days ago | לפני X ימים |
| X weeks ago | לפני X שבועות |
| X months ago | לפני X חודשים |

### Form Labels
| English | Hebrew |
|---------|--------|
| Enter your email | הזן את כתובת הדוא"ל שלך |
| Enter your password | הזן את הסיסמה שלך |
| Confirm password | אשר סיסמה |
| Full name | שם מלא |
| Phone number | מספר טלפון |
| Address | כתובת |
| Required field | שדה חובה |
| Optional | אופציונלי |
| This field is required | שדה זה הוא חובה |
| Invalid email | דוא"ל לא תקין |
| Passwords don't match | הסיסמאות אינן תואמות |
| Please enter | נא להזין |
| Please select | נא לבחור |
| Characters | תווים |
| At least X characters | לפחות X תווים |

### Messages & Notifications
| English | Hebrew |
|---------|--------|
| Success! | הצלחה! |
| Error | שגיאה |
| Warning | אזהרה |
| Info | מידע |
| Saved successfully | נשמר בהצלחה |
| Changes saved | השינויים נשמרו |
| Are you sure? | האם אתה בטוח? |
| This action cannot be undone | פעולה זו לא ניתנת לביטול |
| Loading... | טוען... |
| Please wait | נא להמתין |
| No results found | לא נמצאו תוצאות |
| No data available | אין נתונים זמינים |
| Try again | נסה שנית |
| Refresh | רענן |

### Navigation
| English | Hebrew |
|---------|--------|
| Home | בית |
| Analytics | אנליטיקה |
| Reports | דוחות |
| Profile | פרופיל |
| Account | חשבון |
| Help | עזרה |
| About | אודות |
| Contact | צור קשר |
| Privacy Policy | מדיניות פרטיות |
| Terms of Service | תנאי שימוש |

### Sample Student Names (Israeli Context)
Use culturally appropriate Israeli names:
- דני כהן (Dani Cohen)
- נועה לוי (Noa Levi)
- יוסי מזרחי (Yossi Mizrachi)
- מיכל אבני (Michal Avni)
- רון שפירא (Ron Shapira)
- תמר גולדשטיין (Tamar Goldstein)

Or keep transliterated names:
- מרקוס ג'ונסון (Marcus Johnson)
- אמה רודריגז (Emma Rodriguez)
- איידן צ'ן (Aiden Chen)
- שרה כהן (Sarah Cohen)

---

## Arrow Direction in RTL

In Hebrew RTL, arrows should point in the opposite direction:

| English Context | Hebrew RTL |
|----------------|-----------|
| → Next | ← הבא |
| ← Back | → חזרה |
| → View | ← הצג |

---

## Number Formatting

Numbers remain in LTR (left-to-right) even in RTL context:
- Correct: 24 תלמידים
- Correct: 75% השלמה
- Correct: v1.0

---

## Date Formatting

Hebrew date format: DD/MM/YYYY or DD בחודש YYYY
- 30 December 2025 → 30 דצמבר 2025
- December 30, 2025 → 30 בדצמבר 2025

---

## Testing Checklist

After translating each file, verify:
- [ ] `lang="he"` and `dir="rtl"` in `<html>` tag
- [ ] Title tag translated
- [ ] All user-facing text translated (headings, labels, buttons, paragraphs)
- [ ] Placeholders translated
- [ ] Alt text for images translated (if any)
- [ ] ARIA labels translated
- [ ] Error messages translated
- [ ] Success messages translated
- [ ] Tooltips translated (if any)
- [ ] Navigation links translated
- [ ] Form labels and validation messages translated
- [ ] Arrows pointing in correct RTL direction (← instead of →)
- [ ] Numbers and emails remain LTR
- [ ] Layout flows naturally right-to-left
- [ ] No text overflow issues
- [ ] Forms are usable

---

## Remaining Work

To complete the Hebrew translation:

1. **PRIORITY: analysis/conversation.html** - This is the CORE product feature
2. Auth files (login, signup, password-reset)
3. Student management files (roster, add-student, import-csv)
4. Analysis files (start-analysis, review-results)
5. Results files (view-analysis, export-pdf)
6. Principal dashboard
7. Search/filter

For each file:
1. Update `<html lang="he" dir="rtl">`
2. Update `<title>` tag
3. Translate all text content using the dictionary above
4. Change arrow directions (→ becomes ←)
5. Test the layout

---

## Notes

- **Professional tone**: Use formal Hebrew appropriate for educators
- **Consistency**: Use the same translations throughout all files
- **Cultural sensitivity**: Adapt examples to Israeli educational context when appropriate
- **Gender-neutral**: Where possible, use gender-neutral forms (e.g., תלמיד/ה)
- **RTL awareness**: The CSS already handles RTL layout; focus on text translation
